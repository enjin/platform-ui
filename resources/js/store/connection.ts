import { defineStore } from 'pinia';
import { ConnectionState } from '~/types/types.interface';
import { wcRequiredNamespaces } from '~/util';
import { getAppMetadata, getSdkError } from '@walletconnect/utils';
import { BaseDotsamaWallet, PolkadotjsWallet, Wallet } from '@talismn/connect-wallets';
import { hasMetaMask, initPolkadotSnap, isMetamaskSnapsSupported } from '@enjin-io/metamask-enjin-adapter';
import SignClient from '@walletconnect/sign-client';
import { HexString } from '@polkadot/util/types';
import { wcNamespaces, wcProjectId } from '~/util/constants';
import { useAppStore } from '.';
import snackbar from '~/util/snackbar';
import { Web3Modal, Web3ModalConfig } from '@web3modal/standalone';
import { publicKeyToAddress } from '~/util/address';

export const PrivacyPolicyLink = 'https://nft.io/legal/privacy-policy';
export const TermsOfServiceLink = 'https://nft.io/legal/terms-of-service';

const walletConnectWeb3modalConfig: Web3ModalConfig = {
    projectId: wcProjectId,
    themeMode: 'light',
    privacyPolicyUrl: PrivacyPolicyLink,
    termsOfServiceUrl: TermsOfServiceLink,
    explorerRecommendedWalletIds: ['bdc9433ffdaee55d31737d83b931caa1f17e30666f5b8e03eea794bac960eb4a'],
    walletConnectVersion: 2,
    themeVariables: {
        '--w3m-background-color': '#7567CE',
        '--w3m-accent-color': '#7567CE',
        '--w3m-accent-fill-color': '#FFFFFF',
        '--w3m-logo-image-url': '/images/enjin-wallet-long.svg',
    },
};

class EnjinConnectSnap extends BaseDotsamaWallet {
    override extensionName = 'enjin-connect';
    override title = 'MetaMask';
    override get installed(): boolean {
        return hasMetaMask();
    }
    override installUrl = 'https://metamask.io/';
    override logo = {
        src: 'https://cdn.nft.io/images/wallet/metamask.svg',
        alt: 'MetaMask',
    };
}

export const useConnectionStore = defineStore('connection', {
    state: (): ConnectionState => ({
        provider: '',
        wallet: false,
        walletClient: null,
        walletSession: null,
        account: null,
        accounts: null,
        disabledAccounts: [],
    }),
    persist: {
        paths: ['provider', 'disabledAccounts'],
    },
    actions: {
        getWeb3Modal() {
            return new Web3Modal(walletConnectWeb3modalConfig);
        },
        async connectWallet(provider: string, endLoading: Function, notify = true) {
            try {
                if (provider === 'wc') {
                    await this.connectWC(endLoading);
                }

                if (provider === 'polkadot.js') {
                    await this.connectPolkadotJS(notify);
                }

                if (provider === 'enjin-connect') {
                    await this.connectEnjinSnap();
                }
            } catch (error: any) {
                snackbar.error({ title: 'Error connecting wallet', text: error?.message });
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

            this.walletClient.session.getAll({});
            if (this.walletClient.session.length) {
                const lastKeyIndex = this.walletClient.session.keys.length - 1;
                this.walletSession = this.walletClient.session.get(this.walletClient.session.keys[lastKeyIndex]);
            }
        },
        async connectWC(endLoading: Function) {
            const walletConnect = this.getWeb3Modal();
            await this.initWalletClient();

            if (!this.walletClient) {
                return;
            }

            const { uri, approval } = await this.walletClient.connect({
                requiredNamespaces: wcRequiredNamespaces(useAppStore().config.network),
            });

            walletConnect.subscribeModal(async (event) => {
                if (event.open === false) {
                    endLoading();
                }
            });

            await walletConnect.openModal({
                uri,
            });

            try {
                this.walletSession = await approval();
                if (this.walletSession) {
                    this.provider = 'wc';
                    this.wallet = true;
                    await this.initWalletClient();
                }
            } finally {
                walletConnect.closeModal();
                this.account = null;
            }
        },
        async connectPolkadotJS(notify: boolean) {
            const pkjs = new PolkadotjsWallet();
            if (pkjs.installed) {
                await pkjs.enable('Platform');
                this.wallet = true;
                this.provider = 'polkadot.js';
                this.walletSession = pkjs;
                if (notify) {
                    snackbar.success({ title: 'Polkadot.js extension connected', save: false });
                }
            } else {
                if (notify) {
                    snackbar.error({ title: 'Polkadot.js extension is not installed' });
                }
            }
        },
        async initPolkadotSnap() {
            if (!(await isMetamaskSnapsSupported())) {
                snackbar.error({
                    title: 'Your MetaMask version does not support the snaps feature. Please update your MetaMask.',
                });
            }
            await initPolkadotSnap(
                {
                    snapOrigin: 'npm:@enjin-io/snap',
                    config: {
                        networkName: `${useAppStore().config.network}-matrixchain`,
                    },
                },
                'enjin-connect'
            );
        },
        async connectEnjinSnap() {
            const snap = new EnjinConnectSnap();

            if (snap.installed) {
                await this.initPolkadotSnap();
                await snap.enable('Platform');
                this.wallet = true;
                this.provider = snap.extensionName;
                this.walletSession = snap;
                snackbar.success({ title: 'Metamask snap connected', save: false });
            } else {
                snackbar.error({ title: 'Metamask extension is not installed' });
            }
        },

        async getSession(): Promise<any> {
            if (this.provider === 'wc') {
                await this.initWalletClient();

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
            } else if (this.provider === 'enjin-connect') {
                await this.initPolkadotSnap();
                const snap = new EnjinConnectSnap();
                this.walletSession = snap;
                if (this.walletSession.installed) {
                    await this.walletSession.enable('Platform');
                    this.wallet = true;
                }
            }

            if (!this.wallet) {
                this.provider = '';

                return;
            }

            return this.walletSession;
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
                            chainId: wcNamespaces[useAppStore().config.network],
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

                const accounts = Object.values(this.walletSession?.namespaces)
                    .map((namespace: any) => namespace.accounts)
                    .flat()
                    .map((account) => {
                        return {
                            address: account.split(':')[2],
                        };
                    });
                this.accounts = accounts;
            } else if (['polkadot.js', 'enjin-connect'].includes(this.provider)) {
                const accounts = await this.walletSession?.getAccounts();
                this.accounts = accounts;
            }

            return this.accounts;
        },
        getTrackableAccounts() {
            const appStore = useAppStore();
            const accounts: string[] = [];
            if (appStore.config.daemon) {
                accounts.push(publicKeyToAddress(appStore.config.daemon));
            }
            if (this.accounts?.length) {
                const walletAccounts = this.accounts.map((account) => publicKeyToAddress(account.address));
                accounts.push(...walletAccounts);
            }

            return [...new Set(accounts)];
        },
        getWalletAccounts() {
            let accounts = this.accounts?.map((account) => {
                return { ...account, address: publicKeyToAddress(account.address) };
            });
            try {
                accounts = accounts?.map((account) => {
                    if (this.disabledAccounts?.find((disabled) => disabled === account.address)) {
                        return { ...account, enabled: false };
                    }

                    return { ...account, enabled: true };
                });
            } catch {
                //
            }

            return accounts;
        },
        enableWalletAccount(account: string) {
            if (!this.disabledAccounts) {
                this.disabledAccounts = [];
            }
            if (!this.disabledAccounts.find((disabled) => disabled === account)) {
                this.disabledAccounts.push(account);
            } else {
                this.disabledAccounts = this.disabledAccounts.filter((disabled) => disabled !== account);
            }
        },
        setAccountsBalance(accounts: any) {
            this.accounts = this.accounts?.map((account) => {
                const balance = accounts.find(
                    (balance: any) => balance.account === publicKeyToAddress(account.address)
                );

                return { ...account, balance: balance?.balance };
            });
        },
    },
});
