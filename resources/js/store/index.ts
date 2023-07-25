import { defineStore } from 'pinia';
import { AppState } from '~/types/types.interface';
import appConfig from '~/config.json';
import { ApiService } from '~/api';
import snackbar from '~/util/snackbar';
import { AuthApi } from '~/api/auth';
import { CollectionApi } from '~/api/collection';

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        hostname: '',
        authorization_token: '',
        protocol: 'https',
        advanced: false,
        config: {
            hostname: '',
            authorization_token: '',
            route: '',
            network: '',
            packages: [],
            tenant: false,
            webSocket: '',
            channel: '',
            protocol: '',
        },
        navigations: [
            { name: 'Collections', to: { name: 'platform.collections' }, pos: 1 },
            { name: 'Tokens', to: { name: 'platform.tokens' }, pos: 2 },
            { name: 'Transactions', to: { name: 'platform.transactions' }, pos: 5 },
            { name: 'Wallets', to: { name: 'platform.wallets' }, pos: 6 },
        ],
        collections: [],
        loggedIn: false,
        newCollection: false,
        user: null,
    }),
    persist: {
        paths: ['hostname', 'authorization_token', 'loggedIn', 'advanced', 'protocol'],
    },
    actions: {
        async init() {
            try {
                this.setConfig();
                if (!this.config.hostname) return;

                if (this.isMultiTenant && this.loggedIn) await this.getUser();

                const hostnameConfig = await this.checkHostname(this.config.hostname, this.config.protocol);
                this.config.network = hostnameConfig.network;
                this.config.packages = Object.entries(hostnameConfig.packages).map(([key, value]: any[]) => {
                    let link =
                        hostnameConfig.url +
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
                this.fetchCollectionIds();

                return true;
            } catch (error: any) {
                snackbar.error({ title: error });
            }

            return false;
        },
        async setupAccount({
            hostname,
            authorization_token,
            protocol,
        }: {
            hostname: string;
            authorization_token: string;
            protocol: string;
        }) {
            this.hostname = hostname;
            this.protocol = protocol;
            this.config.protocol = protocol;
            this.config.hostname = hostname;
            this.authorization_token = authorization_token;
            this.config.authorization_token = authorization_token;
            this.loggedIn = true;
            await this.init();
        },
        setConfig() {
            if (appConfig?.hostname?.length) this.config.hostname = appConfig.hostname;
            else if (window?.bootstrap?.hostname) this.config.hostname = window.bootstrap.hostname;
            else this.config.hostname = this.hostname;

            this.config.protocol = this.protocol;

            if (appConfig?.authorization_token?.length) this.config.authorization_token = appConfig.authorization_token;
            else this.config.authorization_token = this.authorization_token;

            if (appConfig?.tenant) this.config.tenant = appConfig.tenant;

            if (appConfig.websocket.length) this.config.webSocket = appConfig.websocket;
            if (appConfig.channel.length) this.config.channel = appConfig.channel;
        },
        async checkHostname(hostname: string, protocol: string) {
            try {
                if (hostname) {
                    const hostnameConfig = await ApiService.fetchHostname(hostname, protocol);
                    if (hostnameConfig) return hostnameConfig;

                    throw 'Hostname is not valid';
                }

                return null;
            } catch {
                throw 'Hostname is not valid';
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
        setHostname(hostname: string) {
            this.hostname = hostname;
            this.config.hostname = hostname;
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
                return state.loggedIn && state.user?.apiTokens?.length > 0 && state.user?.account;
            }

            return state.loggedIn && state.config.hostname.length > 0 && state.config.authorization_token.length > 0;
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
    },
});
