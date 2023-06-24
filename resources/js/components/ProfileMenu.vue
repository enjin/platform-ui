<template>
    <div class="ml-4 flex flex-shrink-0 items-center">
        <Menu as="div" class="relative">
            <div>
                <Tooltip class="flex my-auto" text="Settings">
                    <MenuButton
                        class="flex rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all"
                    >
                        <Cog6ToothIcon class="h-6 w-6 text-gray-400" />
                    </MenuButton>
                </Tooltip>
            </div>
            <ScaleTransition>
                <MenuItems
                    v-if="appStore.hasValidConfig"
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
                >
                    <div class="px-4 py-2" v-if="appStore.user">
                        <p class="text-sm text-gray-500">Email</p>
                        <p class="truncate text-sm font-medium text-gray-900">
                            {{ appStore.user.email }}
                        </p>
                    </div>
                    <div class="px-4 py-2" v-if="appStore.user">
                        <p class="text-sm text-gray-500">Account</p>
                        <Address
                            class="truncate text-sm font-medium text-gray-900"
                            short
                            :address="appStore.user?.account"
                        />
                    </div>
                    <div class="px-4 py-2" v-if="appStore.config.hostname">
                        <p class="text-sm text-gray-500">Hostname</p>
                        <p class="truncate text-sm font-medium text-gray-900">
                            {{ appStore.config.hostname }}
                        </p>
                    </div>
                    <div class="px-4 py-2" v-if="appStore.config.network">
                        <p class="text-sm text-gray-500">Network</p>
                        <p class="truncate text-sm font-medium text-gray-900">
                            {{ appStore.config.network }}
                        </p>
                    </div>
                    <div class="px-4 py-2" v-if="appStore.config.packages.length">
                        <p class="text-sm text-gray-500 mb-1">Packages</p>
                        <p
                            v-for="(packg, idx) in appStore.config.packages"
                            :key="idx"
                            class="truncate text-sm font-medium text-gray-900"
                        >
                            <Tooltip :text="packg.version">
                                <span class="cursor-pointer">
                                    {{ packg.name }}
                                </span>
                            </Tooltip>
                        </p>
                    </div>
                    <div class="py-1">
                        <MenuItem v-slot="{ active }">
                            <button
                                :class="[
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
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
import Address from './Address.vue';

const appStore = useAppStore();
const router = useRouter();

const redirectSettings = () => {
    router.push({ name: 'platform.user.settings' });
};
</script>
