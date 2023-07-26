import { defineStore } from 'pinia';
import { AppState } from '~/types/types.interface';
import appConfig from '~/config.json';
import { ApiService } from '~/api';
import snackbar from '~/util/snackbar';
import { AuthApi } from '~/api/auth';
import { CollectionApi } from '~/api/collection';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';
import { wcOptions } from '~/util';
import { wcRequiredNamespaces } from '~/util';
import { getSdkError } from '@walletconnect/utils';
import { PolkadotjsWallet, Wallet } from '@talismn/connect-wallets';
import { addressToPublicKey } from '~/util/address';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { hexToU8a } from '@polkadot/util';
import { compact } from 'scale-ts';

const parseConfigURL = (url: string): URL => {
    try {
        return new URL(url);
    } catch {
        return new URL('https://' + url);
    }
};

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        url: undefined,
        authorization_token: '',
        advanced: false,
        config: {
            url: undefined,
            authorization_token: '',
            route: '',
            network: '',
            packages: [],
            tenant: false,
            webSocket: '',
            channel: '',
        },
        navigations: [
            { name: 'Collections', to: { name: 'platform.collections' }, pos: 1 },
            { name: 'Tokens', to: { name: 'platform.tokens' }, pos: 2 },
            { name: 'Transactions', to: { name: 'platform.transactions' }, pos: 6 },
            { name: 'Wallets', to: { name: 'platform.wallets' }, pos: 7 },
        ],
        collections: [],
        loggedIn: false,
        newCollection: false,
        user: null,
        provider: '',
        account: null,
        accounts: null,
    }),
    persist: {
        paths: ['url', 'authorization_token', 'loggedIn', 'advanced', 'provider', 'account'],
    },
    actions: {
        async init() {
            try {
                this.setConfig();
                if (!this.config.url) return;

                if (this.isMultiTenant && this.loggedIn) await this.getUser();
                const urlConfig = await this.checkURL(this.config.url);
                this.config.network = urlConfig.network;
                this.config.packages = Object.entries(urlConfig.packages).map(([key, value]: any[]) => {
                    let link =
                        urlConfig.url +
                        '/graphiql/' +
                        (key === 'enjin/platform-core' ? '' : key.replace('enjin/platform-', ''));
                    if (key === 'enjin/platform-ui') link = '';

                    return {
                        name: key.replace('enjin/', ''),
                        version: value.version,
                        link,
                    };
                });

                if (this.hasBeamPackage) this.addBeamNavigation();
                if (this.hasFuelTanksPackage) this.addFuelTanksNavigation();
                if (this.hasMarketplacePackage) this.addMarketplaceNavigation();

                await this.fetchCollectionIds();

                return true;
            } catch (error: any) {
                console.log(error);
                snackbar.error({ title: error });
            }

            return false;
        },
        async setupAccount({ url, authorization_token }: { url: URL; authorization_token: string }) {
            this.url = url;
            this.authorization_token = authorization_token;
            this.config.authorization_token = authorization_token;
            this.loggedIn = true;
            await this.init();
        },
        setConfig() {
            if (appConfig?.url) this.config.url = parseConfigURL(appConfig.url);
            else if (window?.bootstrap?.hostname) this.config.url = parseConfigURL(window.location.origin);
            else this.config.url = this.url;

            if (appConfig?.authorization_token?.length) this.config.authorization_token = appConfig.authorization_token;
            else this.config.authorization_token = this.authorization_token;

            if (appConfig?.tenant) this.config.tenant = appConfig.tenant;

            if (appConfig.websocket.length) this.config.webSocket = appConfig.websocket;
            if (appConfig.channel.length) this.config.channel = appConfig.channel;
        },
        async checkURL(url: URL) {
            try {
                if (url) {
                    const urlConfig = await ApiService.fetchURL(url);
                    if (urlConfig) return urlConfig;

                    throw 'The URL is not valid';
                }

                return null;
            } catch {
                throw 'The URL is not valid';
            }
        },
        async getUser() {
            const res = await AuthApi.getUser();
            this.user = res.data.User;
        },
        async fetchCollectionIds(totalCount?: number) {
            if (!this.loggedIn) return;

            try {
                this.newCollection = false;

                const res = await CollectionApi.getCollectionsIds(totalCount);
                const collectionsData = res.data.GetCollections;
                if (collectionsData.pageInfo.hasNextPage) {
                    await this.fetchCollectionIds(collectionsData.totalCount);
                } else {
                    this.collections = collectionsData.edges.map((collection: any) => collection.node.collectionId);
                }
            } catch {
                // do nothing
            }
        },
        async login(email: string, password: string) {
            const res = await AuthApi.login(email, password);
            if (!res.data.Login) throw [{ field: 'Login error', message: 'Invalid credentials' }];

            await this.getUser();
            if (!this.user.isVerified) {
                await this.logout();
                throw [{ field: 'Login error', message: 'Please verify your email address' }];
            }

            this.loggedIn = res.data.Login;

            return res.data.Login;
        },
        async logout() {
            await AuthApi.logout();
            this.clearLogin();
        },
        clearLogin() {
            this.user = null;
            this.authorization_token = '';
            this.loggedIn = false;
        },
        async createApiToken(name: string) {
            const res = await AuthApi.createApiToken(name);
            this.user.apiTokens.push(res.data.CreateApiToken);
        },
        async revokeToken(name: string) {
            await AuthApi.revokeApiTokens([name]);
            this.user.apiTokens = this.user.apiTokens.filter((token) => token.name !== name);
        },
        setURL(url: string) {
            this.url = new URL(url);
            this.config.url = new URL(url);
        },
        setAuthorizationToken(authorization_token: string) {
            this.authorization_token = authorization_token;
            this.config.authorization_token = authorization_token;
        },
        resetSettings() {
            this.$reset();
        },
        addBeamNavigation() {
            if (this.navigations.find((nav) => nav.name === 'Beams')) return;
            this.navigations = [
                ...this.navigations,
                { name: 'Beams', to: { name: 'platform.beams.list' }, pos: 3 },
            ].sort((a, b) => a.pos - b.pos);
        },
        addFuelTanksNavigation() {
            if (this.navigations.find((nav) => nav.name === 'Fuel Tanks')) return;
            this.navigations = [
                ...this.navigations,
                { name: 'Fuel Tanks', to: { name: 'platform.fuel-tanks' }, pos: 4 },
            ].sort((a, b) => a.pos - b.pos);
        },
        addMarketplaceNavigation() {
            if (this.navigations.find((nav) => nav.name === 'Marketplace')) return;
            this.navigations = [
                ...this.navigations,
                { name: 'Marketplace', to: { name: 'platform.marketplace' }, pos: 5 },
            ].sort((a, b) => a.pos - b.pos);
        },
        setAdvancedMode(advanced: boolean) {
            this.advanced = advanced;
        },
        setCollections(collections: string[]) {
            this.collections = collections;
        },
        getWeb3Modal() {
            return new WalletConnectModalSign(wcOptions);
        },
        async getSession() {
            if (this.provider === 'wc') {
                const walletConnect = this.getWeb3Modal();
                const session = await walletConnect.getSession();
                if (session && !session.acknowledged) {
                    this.account = null;
                }
            }
        },
        async connectWallet(provider) {
            if (provider === 'wc') {
                await this.connectWC();
            }

            if (provider === 'polkadot.js') {
                await this.connectPolkadotJS();
            }
        },
        async connectWC() {
            const walletConnect = this.getWeb3Modal();

            const session = await walletConnect.connect({
                requiredNamespaces: wcRequiredNamespaces,
            });

            if (session.acknowledged) {
                const accounts = Object.values(session.namespaces)
                    .map((namespace) => namespace.accounts)
                    .flat()
                    .map((account) => {
                        return {
                            address: account.split(':')[2],
                        };
                    });
                this.accounts = accounts;
                this.provider = 'wc';

                return;
            }

            await walletConnect.disconnect({
                topic: session.topic,
                reason: getSdkError('USER_REJECTED'),
            });

            this.account = null;
        },
        async connectPolkadotJS() {
            const pkjs = new PolkadotjsWallet();
            if (pkjs.installed) {
                await pkjs.enable('Platform');
                const accounts = await pkjs.getAccounts();
                this.accounts = accounts;
                this.provider = 'polkadot.js';
            }
        },
        async signTransaction() {
            // This is the call that comes from the platform transactions 'encodedCall'
            const call = '0a03008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48a10f';
            const era = '00'; // 00 is for immortal transactions
            const nonce = 'c8'; // Thats the account nonce
            const tip = '00'; // Tip should always be 00
            const spec = 'c60b0000'; // The spec version of runtime
            const txVersion = '08000000'; // The tx version of runtime
            const genesis = '99ded175d436bee7d751fa3f2f8c7a257ddc063a541f8daa5e6152604f66b2a0'; // The genesis block
            const blockHash = '99ded175d436bee7d751fa3f2f8c7a257ddc063a541f8daa5e6152604f66b2a0'; // For immortal transactions the blockhash needs to be the genesis

            const extra = era + nonce + tip; // This is the extra data that needs to be added in the final extrinsic and in the signing payload
            const addExtra = spec + txVersion + genesis + blockHash; // This is the extra data that needs to be added only in the signing payload
            const payload = call + extra + addExtra; // This is the payload to sign

            // Send the payload above to the wallet to sign
            // The wallet will return a signature
            const { signature } = await this.account.signer.signRaw({
                type: 'bytes',
                data: payload,
                address: this.account.address,
            });

            // To build the final extrinsic we need to do this

            const extrinsicVersion = 4; // Come from extrinsic.version in metadata
            // Signed transaction
            const extraByte = extrinsicVersion | 128;
            const extraByteString = extraByte.toString(16);
            const signerType = '00'; // MultiAddress?
            const signatureType = '00';
            // 00 = ed25519
            // 01 = sr25519
            const size = "0x098241189191c3c438118152273490ad1763716efb8119fb1315f07eab423491";

            const finalExtrinsic =
                size +
                extraByteString +
                signerType +
                addressToPublicKey(this.account.address) +
                signatureType +
                signature +
                extra +
                call;

            // const bytes = hexToU8a(finalExtrinsic).byteLength;
            // const size = compact.enc(bytes);
            // console.log(size);
            // Send the above to the blockchain
            await this.connectToAPI(finalExtrinsic as any);
        },
        async connectToAPI(extrinsic: string) {
            const provider = new WsProvider('wss://rpc.matrix.canary.enjin.io');
            const api = await ApiPromise.create({ provider });
            

            // Create the size of the extrinsic
            // const bytes = hexToU8a(extrinsic).byteLength;
            // const size = api.createType('Compact<u32>', bytes);
            // console.log(size.hash.toHex());

            // const tx = api.tx.customModule.customMethod(extrinsic);

            // await tx.signAndSend(this.account.address);
        },
        async disconnectWallet() {
            try {
                if (this.provider === 'wc') {
                    const walletConnect = this.getWeb3Modal();
                    const session = await walletConnect.getSession();

                    if (session) {
                        await walletConnect.disconnect({
                            topic: session.topic,
                            reason: getSdkError('USER_DISCONNECTED'),
                        });
                    }
                }

                this.account = null;
                this.provider = '';
            } catch {
                this.account = null;
                this.provider = '';
            }
        },
        setAccount(account: Wallet) {
            this.account = account;
        },
    },
    getters: {
        hasValidConfig(state: AppState) {
            if (this.isMultiTenant) {
                return state.loggedIn && state.user?.apiTokens?.length > 0 && state.user?.account;
            }

            return state.loggedIn && state.config.url && state.config.authorization_token.length > 0;
        },
        isMultiTenant(state: AppState) {
            return state.config.tenant;
        },
        hasBeamPackage(state: AppState) {
            return state.config.packages.find((p) => p.name === 'platform-beam');
        },
        hasFuelTanksPackage(state: AppState) {
            return state.config.packages.find((p) => p.name === 'platform-fuel-tanks');
        },
        hasMarketplacePackage(state: AppState) {
            return state.config.packages.find((p) => p.name === 'platform-marketplace');
        },
    },
});
