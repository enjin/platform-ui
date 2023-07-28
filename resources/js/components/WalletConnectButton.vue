<template>
    <Menu as="div" class="relative">
        <div>
            <MenuButton
                class="flex items-center space-x-2 rounded-md bg-primary py-2 px-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-white transition-all"
            >
                <WalletIcon class="h-6 w-6" />
                <LoadingCircle v-if="loading" class="!text-white" />
                <span v-else>{{ walletSession ? 'Wallet connected' : 'Connect wallet' }}</span>
            </MenuButton>
        </div>
        <ScaleTransition>
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
            >
                <template v-if="!walletSession">
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="connectWallet('wc')"
                        >
                            WalletConnect
                        </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="connectWallet('polkadot.js')"
                        >
                            Polkadot.JS
                        </button>
                    </MenuItem>
                </template>
                <template v-else>
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="disconnectWallet"
                        >
                            Disconnect
                        </button>
                    </MenuItem>
                </template>
            </MenuItems>
        </ScaleTransition>
    </Menu>
   
</template>

<script setup lang="ts">
import { WalletIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';
import LoadingCircle from './LoadingCircle.vue';
import { computed, ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import snackbar from '~/util/snackbar';

const appStore = useAppStore();

const loading = ref(true);
const showAccountsModal = ref(false);

const walletSession = computed(() => appStore.wallet);

const connectWallet = async (provider: string) => {
    try {
        loading.value = true;
        await appStore.connectWallet(provider);
        if (appStore.accounts) {
            showAccountsModal.value = true;
        }
    } catch {
        snackbar.error({ title: 'Failed to connect wallet' });
    } finally {
        loading.value = false;
    }
};

const getSession = async () => {
    try {
        loading.value = true;
        await appStore.getSession();
    } catch (e){
        console.log(e)
        snackbar.error({ title: 'Failed to get session' });
    } finally {
        loading.value = false;
    }
};

const disconnectWallet = async () => {
    loading.value = true;
    await appStore.disconnectWallet();
    loading.value = false;
};


(async () => {
    getSession();
})();
</script>
