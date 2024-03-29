import { defineStore } from 'pinia';
import { AppState } from '~/types/types.interface';
import appConfig from '~/config.json';
import { ApiService } from '~/api';
import snackbar from '~/util/snackbar';
import { AuthApi } from '~/api/auth';
import { CollectionApi } from '~/api/collection';
import { useConnectionStore } from './connection';

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
        allowResend: false,
        user: null,
        tokensCount: 0,
    }),
    persist: {
        paths: ['url', 'authorization_token', 'loggedIn', 'advanced', 'provider', 'tokensCount'],
    },
    actions: {
        async init() {
            try {
                this.setConfig();

                if (!this.config.url) {
                    return false;
                }
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

                if (this.hasBeamPackage) {
                    this.addBeamNavigation();
                }
                if (this.hasFuelTanksPackage) {
                    this.addFuelTanksNavigation();
                }
                if (this.hasMarketplacePackage) {
                    this.addMarketplaceNavigation();
                }

                if (this.loggedIn && this.hasMultiTenantPackage && !this.user) {
                    await this.getUser();
                }

                await useConnectionStore().getSession();

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

            if (window?.bootstrap?.url) {
                this.config.url = parseConfigURL(window?.bootstrap?.url);
            } else {
                this.config.url = this.url;
            }

            if (!this.config.tenant) {
                this.config.authorization_token = this.authorization_token;
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
            if (res.data.User) {
                this.user = res.data.User;
                this.tokensCount = res.data.User?.apiTokens.length;
            }
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
            if (!res.data.Login) {
                if (res.errors.length) {
                    throw res.errors;
                }
                throw [{ field: 'Login error', message: 'Invalid credentials' }];
            }

            await this.getUser();
            if (!this.user.isVerified) {
                this.allowResend = true;
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
            this.tokensCount = this.user.apiTokens.length;
        },
        async revokeToken(name: string) {
            await AuthApi.revokeApiTokens([name]);
            this.user.apiTokens = this.user.apiTokens.filter((token) => token.name !== name);
            this.tokensCount = this.user.apiTokens.length;
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
    },
    getters: {
        hasValidConfig(state: AppState) {
            if (this.isMultiTenant) {
                return state.loggedIn && state.tokensCount > 0;
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
        hasMultiTenantPackage(state: AppState) {
            return state.config.packages.find((p) => p.name === 'platform-multi-tenant');
        },
    },
});
