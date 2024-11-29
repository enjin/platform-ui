<template>
    <div class="bg-light-surface-background dark:bg-dark-surface-background">
        <div class="flex flex-row h-screen">
            <SideNavbar v-if="appStore.loggedIn" />
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
import { useRouter } from 'vue-router';

const appStore = useAppStore();
const router = useRouter();

const canaryHost = computed(() => appStore.config.network === 'canary');

const initialTheme = () => {
    if (appStore.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

(async () => {
    initialTheme();
    await appStore.init();

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
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
