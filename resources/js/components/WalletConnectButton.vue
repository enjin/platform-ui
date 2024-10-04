<template>
    <Menu as="div" class="relative">
        <div>
            <MenuButton
                id="wallet-connect-button"
                class="flex items-center space-x-2 rounded-md bg-primary py-1 px-2 md:py-2 md:px-3 text-sm font-semibold shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-1 text-white transition-all"
            >
                <WalletIcon v-if="props.icon" class="h-6 w-6" />
                <LoadingCircle v-if="loading" class="!text-white" />
                <span v-else class="hidden sm:block">{{ walletSession ? walletName : props.title }}</span>
            </MenuButton>
        </div>
        <ScaleTransition>
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-light-stroke dark:divide-dark-stroke rounded-md bg-light-surface-primary dark:bg-dark-surface-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
            >
                <template v-if="!walletSession">
                    <MenuItem v-slot="{ active }">
                        <button
                            id="wallet-connect-button__enjin"
                            :class="[
                                active
                                    ? 'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong'
                                    : 'text-light-content dark:text-dark-content',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="connectWallet('wc')"
                        >
                            Enjin Wallet
                        </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <button
                            id="wallet-connect-button__polkadot"
                            :class="[
                                active
                                    ? 'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong'
                                    : 'text-light-content dark:text-dark-content',
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
                            id="wallet-connect-button__disconnect"
                            :class="[
                                active
                                    ? 'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong'
                                    : 'text-light-content dark:text-dark-content',
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
import LoadingCircle from './LoadingCircle.vue';
import { computed, ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import snackbar from '~/util/snackbar';
import { useConnectionStore } from '~/store/connection';
import { publicKeyToAddress } from '~/util/address';
import { AuthApi } from '~/api/auth';
import { useAppStore } from '~/store';

const props = withDefaults(
    defineProps<{
        title?: string;
        icon?: boolean;
    }>(),
    {
        title: 'Connect wallet',
        icon: true,
    }
);

const connectionStore = useConnectionStore();

const loading = ref(false);

const walletName = computed(() => {
    if (connectionStore.provider === 'wc') {
        return 'Enjin Wallet';
    } else if (connectionStore.provider === 'polkadot.js') {
        return 'Polkadot.JS';
    }

    return '';
});

const walletSession = computed(() => connectionStore.wallet);

const connectWallet = async (provider: string) => {
    try {
        loading.value = true;
        await connectionStore.connectWallet(provider, () => {
            loading.value = false;
        });
        await connectionStore.getAccounts();
        const localAccounts = connectionStore.accounts.map((account) => publicKeyToAddress(account.address));
        const walletAccounts = useAppStore().user?.walletAccounts?.map((account) => publicKeyToAddress(account)) ?? [];
        const uniqueAccounts = [...new Set([...walletAccounts, ...localAccounts])];
        if (useAppStore().isMultiTenant) {
            AuthApi.setUserAccounts(uniqueAccounts);
        }
    } catch {
        snackbar.error({ title: 'Failed to connect the wallet' });
    } finally {
        loading.value = false;
    }
};

const disconnectWallet = async () => {
    loading.value = true;
    await connectionStore.disconnectWallet();
    loading.value = false;
};
</script>
