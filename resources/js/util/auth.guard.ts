import type { Router } from 'vue-router';
import { useAppStore } from '~/store';

export function initAuthGuard(router: Router) {
    router.beforeEach((to, _, next) => {
        const appStore = useAppStore();

        const validConfig = appStore.hasValidConfig;
        const isMultiTenant = appStore.isMultiTenant;
        const isLoggedIn = appStore.loggedIn;

        const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
        const requiresToken = to.matched.some((record) => record.meta.requiresToken);

        if (isMultiTenant) {
            if (!appStore.config.url && to.name != 'platform.setup') {
                next({ name: 'platform.setup' });
                return;
            } else if (to.name == 'platform.setup' && appStore.config.url) {
                next({ name: 'platform.auth.login' });
                return;
            }

            if (requiresAuth && !isLoggedIn) {
                next({ name: 'platform.auth.login' });
            } else if (requiresToken && !validConfig) {
                next({ name: 'platform.user.settings' });
            } else if (to.name == 'platform.auth.login' && isLoggedIn) {
                next({ name: 'platform.collections' });
            } else {
                next();
            }
        } else {
            if (requiresAuth && !isLoggedIn) {
                next({ name: 'platform.setup' });
            } else if (to.name == 'platform.auth.login' && !isLoggedIn) {
                next({ name: 'platform.setup' });
            } else if (to.name == 'platform.setup' && validConfig && isLoggedIn) {
                next({ name: 'platform.collections' });
            } else {
                next();
            }
        }
    });
}
