<template>
    <div class="ml-4 flex flex-shrink-0 items-center">
        <Menu as="div" class="relative">
            <div>
                <Tooltip class="flex my-auto" text="Settings">
                    <MenuButton
                        dusk="settingMenuBtn"
                        class="flex rounded-full bg-light-surface-primary dark:bg-dark-surface-primary p-1 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all"
                    >
                        <Cog6ToothIcon class="h-6 w-6 text-light-content dark:text-dark-content" />
                    </MenuButton>
                </Tooltip>
            </div>
            <ScaleTransition>
                <MenuItems
                    v-if="appStore.loggedIn"
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-light-stroke dark:divide-dark-stroke rounded-md bg-light-surface-primary dark:bg-dark-surface-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
                >
                    <div class="px-4 py-2" v-if="appStore.config.url">
                        <p class="text-sm text-light-content dark:text-dark-content">URL</p>
                        <p class="truncate text-sm font-medium text-light-content-strong dark:text-dark-content-strong">
                            {{ appStore.config.url }}
                        </p>
                    </div>
                    <div class="px-4 py-2" v-if="appStore.config.network">
                        <p class="text-sm text-light-content dark:text-dark-content">Network</p>
                        <p class="truncate text-sm font-medium text-light-content-strong dark:text-dark-content-strong">
                            {{ appStore.config.network }}
                        </p>
                    </div>
                    <div class="px-4 py-2" v-if="appStore.config.packages.length">
                        <p class="text-sm text-light-content dark:text-dark-content mb-1">Packages Available</p>
                        <p
                            v-for="(packg, idx) in appStore.config.packages"
                            :key="idx"
                            class="truncate text-sm font-medium text-light-content-strong dark:text-dark-content-strong"
                        >
                            <Tooltip :text="packg.version">
                                <a v-if="packg.link" :href="packg.link" target="_blank" class="cursor-pointer">
                                    {{ packg.name }}
                                </a>
                                <span v-else class="cursor-pointer">
                                    {{ packg.name }}
                                </span>
                            </Tooltip>
                        </p>
                    </div>
                    <div class="py-1">
                        <MenuItem v-slot="{ active }">
                            <button
                                dusk="settingsBtn"
                                :class="[
                                    active
                                        ? 'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong'
                                        : 'text-light-content dark:text-dark-content',
                                    'block px-4 py-2 text-sm w-full text-center transition-all',
                                ]"
                                @click="redirectSettings"
                            >
                                Settings
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </ScaleTransition>
        </Menu>
    </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import { useAppStore } from '~/store';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import Tooltip from './Tooltip.vue';

const appStore = useAppStore();
const router = useRouter();

const redirectSettings = () => {
    router.push({ name: 'platform.user.settings' });
};
</script>
