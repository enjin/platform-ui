<template>
    <div class="h-full flex flex-row">
        <SideNavbar v-if="appStore.loggedIn" />
        <SnackbarGroup />

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
import SnackbarGroup from '~/components/SnackbarGroup.vue';
import UserNavbar from '~/components/UserNavbar.vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const appStore = useAppStore();
const router = useRouter();

(async () => {
    await appStore.init();
})();

watch(
    () => appStore.loggedIn,
    () => {
        if (!appStore.loggedIn) router.push({ name: 'platform.auth.login' });
    }
);
</script>
