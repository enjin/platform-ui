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
import { getAppMetadata, getSdkError } from '@walletconnect/utils';
import { PolkadotjsWallet, Wallet } from '@talismn/connect-wallets';
import SignClient from '@walletconnect/sign-client';
import { HexString } from '@polkadot/util/types';
import { wcNamespaces, wcProjectId } from '~/util/constants';

const parseConfigURL = (url: string): URL => {
    return new URL(url);
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
            daemon: '',
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
        wallet: false,
        walletClient: null,
        walletSession: null,
        account: null,
        accounts: null,
    }),
    persist: {
        paths: ['url', 'authorization_token', 'loggedIn', 'advanced', 'provider'],
    },
    actions: {
        async init() {
            try {
                this.setConfig();
                if (!this.config.url) return false;
                if (!this.isMultiTenant && !this.config.authorization_token.length) {
                    return false;
                }

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

                if (this.loggedIn) await this.getUser();
                await this.getSession();

                return await this.fetchCollectionIds();
            } catch (error: any) {
                snackbar.error({ title: error });
                if (this.config.tenant) {
                    this.clearLogin();
                }
            }

            return false;
        },
        async setupAccount({ url, authorization_token }: { url: URL; authorization_token: string }) {
            this.url = url;
            this.authorization_token = authorization_token;
            if (!this.isMultiTenant) {
                this.loggedIn = true;
            }

            return await this.init();
        },
        setConfig() {
            if (appConfig?.tenant) {
                this.config.tenant = appConfig.tenant === 'true';
            }

            if (appConfig?.url) {
                this.config.url = parseConfigURL(appConfig.url);
            } else if (window?.bootstrap?.url) {
                this.config.url = parseConfigURL(window?.bootstrap?.url);
            } else {
                this.config.url = this.url;
            }

            if (!this.config.tenant && appConfig?.authorization_token?.length) {
                this.config.authorization_token = appConfig.authorization_token;
            } else if (!this.config.tenant) {
                this.config.authorization_token = this.authorization_token;
            }

            if (appConfig.websocket.length) {
                this.config.webSocket = appConfig.websocket;
            }
            if (appConfig.channel.length) {
                this.config.channel = appConfig.channel;
            }

            if (window.bootstrap?.daemon) {
                this.config.daemon = window.bootstrap.daemon;
            }
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
            if (!this.loggedIn) return false;

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
                return false;
            }

            return true;
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
            this.loggedIn = false;
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
        async getSession(): Promise<any> {
            if (this.provider === 'wc') {
                const walletConnect = this.getWeb3Modal();
                this.walletSession = await walletConnect.getSession();
                if (this.walletSession?.acknowledged) {
                    this.wallet = true;
                }
            } else if (this.provider === 'polkadot.js') {
                const pkjs = new PolkadotjsWallet();
                this.walletSession = pkjs;

                if (this.walletSession.installed) {
                    await this.walletSession.enable('Platform');
                    this.wallet = true;
                }
            }
            return this.walletSession;
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
            await this.initWalletClient();

            this.walletSession = await walletConnect.connect({
                requiredNamespaces: wcRequiredNamespaces(this.config.network),
            });

            if (this.walletSession && this.walletSession.acknowledged) {
                this.provider = 'wc';
                this.wallet = true;
                await this.initWalletClient();

                return;
            }

            await walletConnect.disconnect({
                topic: this.walletSession.topic,
                reason: getSdkError('USER_REJECTED'),
            });

            this.account = null;
        },
        async connectPolkadotJS() {
            const pkjs = new PolkadotjsWallet();
            if (pkjs.installed) {
                await pkjs.enable('Platform');
                this.wallet = true;
                this.provider = 'polkadot.js';
                this.walletSession = pkjs;
            }
        },
        async initWalletClient() {
            this.walletClient = await SignClient.init({
                projectId: wcProjectId,
                metadata: getAppMetadata(),
            });

            if (this.walletClient) {
                this.walletClient.on('session_delete', () => {
                    this.disconnectWallet();
                });
                this.walletClient.on('session_expire', () => {
                    this.disconnectWallet();
                });
            }
        },
        async disconnectWallet() {
            try {
                if (this.provider === 'wc') {
                    if (this.walletClient) {
                        this.walletClient.disconnect({
                            topic: this.walletSession.topic,
                            reason: getSdkError('USER_DISCONNECTED'),
                        });
                    }
                }
            } catch {
                // do nothing
            } finally {
                this.account = null;
                this.wallet = false;
                this.provider = '';
                this.walletClient = null;
                this.walletSession = null;
            }
        },
        async setAccount(account: Wallet) {
            if (this.provider === 'wc') {
                account.signer = {
                    signPayload: async (payload: any) => {
                        const result = await (this.walletClient! as SignClient).request<{ signature: HexString }>({
                            chainId: wcNamespaces[this.config.network],
                            topic: this.walletSession?.topic,
                            request: {
                                method: 'polkadot_signTransaction',
                                params: {
                                    address: payload.address,
                                    transactionPayload: payload,
                                },
                            },
                        });

                        return result;
                    },
                };
            }
            this.account = account;
        },
        async getAccounts() {
            if (this.provider === 'wc') {
                if (!this.walletSession) {
                    return;
                }

                const accounts = Object.values(this.walletSession.namespaces)
                    .map((namespace: any) => namespace.accounts)
                    .flat()
                    .map((account) => {
                        return {
                            address: account.split(':')[2],
                        };
                    });
                this.accounts = accounts;
            } else if (this.provider === 'polkadot.js') {
                const accounts = await this.walletSession.getAccounts();
                this.accounts = accounts;
            }
        },
    },
    getters: {
        hasValidConfig(state: AppState) {
            if (this.isMultiTenant) {
                return state.loggedIn && state.user?.apiTokens?.length > 0 && state.user?.account;
            }

            return state.loggedIn && state.config.url;
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
