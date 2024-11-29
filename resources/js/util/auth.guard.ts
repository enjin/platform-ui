import type { Router } from 'vue-router';
import { useAppStore } from '~/store';

export function initAuthGuard(router: Router) {
    router.beforeEach((to, _, next) => {
        const appStore = useAppStore();

        const validConfig = appStore.hasValidConfig;
        const isLoggedIn = appStore.loggedIn;

        const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

        if (requiresAuth && !isLoggedIn) {
            next({ name: 'platform.setup' });
        } else if (to.name == 'platform.auth.login' && !isLoggedIn) {
            next({ name: 'platform.setup' });
        } else if (to.name == 'platform.setup' && validConfig && isLoggedIn) {
            next({ name: 'platform.collections' });
        }

        next();
    });
}
