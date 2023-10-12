import { defineStore } from 'pinia';
import { ConnectionState } from '~/types/types.interface';
import { wcOptions } from '~/util';
import { wcRequiredNamespaces } from '~/util';
import { getAppMetadata, getSdkError } from '@walletconnect/utils';
import { PolkadotjsWallet, Wallet } from '@talismn/connect-wallets';
import SignClient from '@walletconnect/sign-client';
import { HexString } from '@polkadot/util/types';
import { wcNamespaces, wcProjectId } from '~/util/constants';
import { useAppStore } from '.';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';

export const useConnectionStore = defineStore('connection', {
    state: (): ConnectionState => ({
        provider: '',
        wallet: false,
        walletClient: null,
        walletSession: null,
        account: null,
        accounts: null,
    }),
    persist: {
        paths: ['provider'],
    },
    actions: {
        getWeb3Modal() {
            return new WalletConnectModalSign(wcOptions);
        },
        async connectWallet(provider) {
            if (provider === 'wc') {
                await this.connectWC();
            }

            if (provider === 'polkadot.js') {
                await this.connectPolkadotJS();
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
        async connectWC() {
            const walletConnect = this.getWeb3Modal();
            await this.initWalletClient();

            this.walletSession = await walletConnect.connect({
                requiredNamespaces: wcRequiredNamespaces(useAppStore().config.network),
            });

            if (this.walletSession && this.walletSession.acknowledged) {
                this.provider = 'wc';
                this.wallet = true;
                await this.initWalletClient();

                return;
            }

            await walletConnect!.disconnect({
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
});
