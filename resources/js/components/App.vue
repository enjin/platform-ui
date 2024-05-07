<template>
    <div class="h-full flex flex-row bg-light-surface-background dark:bg-dark-surface-background">
        <SideNavbar v-if="appStore.hasValidConfig" />
        <SnackbarGroup />
        <SupportButton />

        <div class="flex flex-col w-full overflow-hidden">
            <UserNavbar />
            <router-view v-slot="{ Component }">
                <ScaleTransition>
                    <component :is="Component" />
                </ScaleTransition>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import ScaleTransition from '~/components/ScaleTransition.vue';
import SideNavbar from '~/components/SideNavbar.vue';
import SupportButton from '~/components/SupportButton.vue';
import SnackbarGroup from '~/components/SnackbarGroup.vue';
import UserNavbar from '~/components/UserNavbar.vue';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

const canaryHost = computed(() => appStore.config.network === 'canary');

const initialTheme = () => {
    if (appStore.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

(() => {
    appStore.init();
    initialTheme();

    if (window.bootstrap?.name) {
        return;
    }

    if (canaryHost.value) {
        document.title = 'Canary Enjin Platform';
    } else {
        document.title = 'Enjin Platform';
    }
})();

watch(
    () => appStore.theme,
    () => {
        initialTheme();
    }
);

watch(
    () => appStore.loggedIn,
    () => {
        if (!appStore.loggedIn) router.push({ name: 'platform.auth.login' });
    }
);

watch(
    () => appStore.user,
    () => {
        if (appStore.isMultiTenant && !appStore.hasValidConfig && route.meta.requiresToken) {
            router.push({ name: 'platform.user.settings' });
        }
    }
);
</script>
