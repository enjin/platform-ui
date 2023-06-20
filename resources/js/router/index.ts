import { createRouter, createWebHistory } from 'vue-router';
import Collections from '~/components/pages/Collections.vue';
import appConfig from '~/config.json';

const routes = [
    {
        path: '/',
        name: 'platform',
        redirect: { name: 'platform.setup' },
    },
    {
        path: '/setup',
        name: 'platform.setup',
        component: () => import('../components/pages/Setup.vue'),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/collections',
        name: 'platform.collections',
        component: Collections,
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/tokens',
        name: 'platform.tokens',
        component: () => import('../components/pages/Tokens.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/transactions',
        name: 'platform.transactions',
        component: () => import('../components/pages/Transactions.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/wallets',
        name: 'platform.wallets',
        component: () => import('../components/pages/Wallets.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/beams',
        name: 'platform.beams',
        component: () => import('../components/pages/Beams.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
        children: [
            {
                path: '',
                redirect: { name: 'platform.beams.list' },
            },
            {
                path: 'list',
                name: 'platform.beams.list',
                component: () => import('../components/beam/BeamsList.vue'),
            },
            {
                path: 'claims',
                name: 'platform.beams.claims',
                component: () => import('../components/beam/ClaimsList.vue'),
            },
        ],
    },
    {
        path: '/fuel-tanks',
        name: 'platform.fuel-tanks',
        component: () => import('../components/pages/FuelTanks.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/create/collection',
        name: 'platform.create.collection',
        component: () => import('../components/pages/create/CreateCollection.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/create/token',
        name: 'platform.create.token',
        component: () => import('../components/pages/create/CreateToken.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/create/beam',
        name: 'platform.create.beam',
        component: () => import('../components/pages/create/CreateBeam.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/create/fuel-tank',
        name: 'platform.create.fuel-tank',
        component: () => import('../components/pages/create/CreateFuelTank.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
    },
    {
        path: '/create/batch',
        name: 'platform.create.batch',
        component: () => import('../components/pages/create/CreateBatch.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: true,
        },
        children: [
            {
                path: 'mint',
                name: 'platform.create.batch.mint',
                component: () => import('../components/batch/BatchMint.vue'),
            },
            {
                path: 'transfer',
                name: 'platform.create.batch.transfer',
                component: () => import('../components/batch/BatchTransfer.vue'),
            },
            {
                path: 'set-attribute',
                name: 'platform.create.batch.set-attribute',
                component: () => import('../components/batch/BatchSetAttribute.vue'),
            },
        ],
    },
    {
        path: '/settings',
        name: 'platform.user.settings',
        component: () => import('../components/pages/Settings.vue'),
        meta: {
            requiresAuth: true,
            requiresToken: false,
        },
    },
    {
        path: '/login',
        name: 'platform.auth.login',
        component: () => import('../components/pages/auth/Login.vue'),
    },
    {
        path: '/register',
        name: 'platform.auth.register',
        component: () => import('../components/pages/auth/Register.vue'),
    },
    {
        path: '/forgot-password',
        name: 'platform.auth.forgot.password',
        component: () => import('../components/pages/auth/RequestResetPassword.vue'),
    },
    {
        path: '/reset-password/:token',
        name: 'platform.auth.reset.password',
        component: () => import('../components/pages/auth/ResetPassword.vue'),
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'platform.404',
        component: () => import('../components/pages/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(appConfig.route),
    routes,
    scrollBehavior(to, from) {
        if (from.matched.length > 1 && to.matched?.[0].name !== from.matched[1].name) {
            setTimeout(() => {
                document.getElementById('app')?.scrollIntoView();
            }, 10);
        }

        return { top: 0 };
    },
});

export default router;
