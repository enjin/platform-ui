import { ApiService } from '~/api';
import { AppState } from '~/types/types.interface';
import { CollectionApi } from '~/api/collection';
import appConfig from '~/config.json';
import { defineStore } from 'pinia';
import snackbar from '~/util/snackbar';
import { useConnectionStore } from './connection';
import { publicKeyToAddress } from '~/util/address';

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
            { name: 'Transactions', to: { name: 'platform.transactions' }, count: true, pos: 6 },
            { name: 'Wallets', to: { name: 'platform.wallets' }, pos: 7 },
        ],
        collections: [],
        loggedIn: false,
        newCollection: false,
        allowResend: false,
        user: null,
        tokensCount: 0,
        theme: 'light',
        initPromise: null,
        internal: false,
    }),
    persist: {
        paths: ['url', 'authorization_token', 'loggedIn', 'advanced', 'provider', 'tokensCount', 'theme'],
    },
    actions: {
        async init() {
            try {
                // eslint-disable-next-line
                if (this.config.network) {
                    return;
                }

                this.setConfig();

                if (!this.config.url) {
                    return false;
                }
                if (!this.authorization_token) {
                    return false;
                }

                const urlConfig = await this.checkURL(this.config.url);
                try {
                    const internalConfig = await ApiService.fetchInternalUrl(this.config.url);
                    if (internalConfig) {
                        this.internal = true;
                    }
                } catch {
                    this.internal = false;
                }
                this.config.network = urlConfig?.network;
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

                if (this.hasBeamPackage) {
                    this.addBeamNavigation();
                }
                if (this.hasFuelTanksPackage) {
                    this.addFuelTanksNavigation();
                }
                if (this.hasMarketplacePackage) {
                    this.addMarketplaceNavigation();
                }
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
            this.loggedIn = true;

            await this.init();
            await this.initPromise;
        },
        setConfig() {
            if (appConfig?.tenant) {
                this.config.tenant = appConfig.tenant == 'true';
            }

            if (window?.bootstrap?.url) {
                this.config.url = parseConfigURL(window?.bootstrap?.url);
            } else {
                this.config.url = this.url;
            }

            if (window.bootstrap?.daemon) {
                this.config.daemon = window.bootstrap.daemon;
            }

            if (appConfig.websocket.length) {
                this.config.webSocket = appConfig.websocket;
            }
            if (appConfig.channel.length) {
                this.config.channel = appConfig.channel;
            }

            if (window.bootstrap?.name) {
                document.title = window.bootstrap.name;
            }

            if (window.bootstrap?.network) {
                this.config.network = window.bootstrap.network;
            }
        },
        async checkURL(url: URL) {
            try {
                if (url) {
                    const urlConfig = await ApiService.fetchPlatformURL(url);
                    if (urlConfig) return urlConfig;

                    throw 'The URL is not valid';
                }

                return null;
            } catch {
                throw 'The URL is not valid';
            }
        },
        async fetchCollectionIds(totalCount?: number, after?: string) {
            if (!this.loggedIn) return false;
            try {
                this.newCollection = false;

                const res = await CollectionApi.getCollectionsIds(totalCount, after);
                const collectionsData = res.data.GetCollections;
                if (collectionsData.pageInfo.hasNextPage) {
                    await this.fetchCollectionIds(
                        collectionsData.totalCount > 500 ? 500 : collectionsData.totalCount,
                        collectionsData.pageInfo.endCursor
                    );
                } else {
                    const accounts = useConnectionStore().getTrackableAccounts();
                    this.collections = [
                        ...this.collections,
                        ...collectionsData.edges
                            .filter(async (collection: any) => {
                                return accounts.find(
                                    (account) => account === publicKeyToAddress(collection.owner?.account.publicKey)
                                );
                            })
                            .map((collection: any) => collection.node.collectionId),
                    ];
                    // clear duplicates
                    this.collections = Array.from(new Set(this.collections));
                }
            } catch {
                return false;
            }

            return true;
        },
        async fetchInternal() {
            try {
                const internalConfig = await ApiService.fetchInternalUrl(this.config.url!);
                if (internalConfig) {
                    this.internal = true;
                }
            } catch {
                this.internal = false;
            }
        },
        clearLogin() {
            this.authorization_token = '';
            this.loggedIn = false;
        },
        setURL(url: string) {
            this.url = new URL(url);
            this.config.url = new URL(url);
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
                { name: 'Marketplace', to: { name: 'platform.marketplace.bids' }, pos: 5 },
            ].sort((a, b) => a.pos - b.pos);
        },
        setAdvancedMode(advanced: boolean) {
            this.advanced = advanced;
        },
        setCollections(collections: string[]) {
            this.collections = collections;
        },
        setTheme(theme: 'dark' | 'light') {
            this.theme = theme;
        },
        clearInitPromise() {
            this.initPromise = null;
        },
    },
    getters: {
        hasValidConfig(state: AppState) {
            return state.loggedIn && state.config.url;
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
