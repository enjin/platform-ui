<template>
    <div class="p-6">
        <h1 class="text-xl text-light-content-strong dark:text-dark-content-strong">Wallet Account</h1>
        <p class="mt-1 text-sm text-light-content dark:text-dark-content max-w-3xl">
            The platform depends on there being a funded wallet daemon account setup and connected to the platform and
            blockchain so it can receive transactions from the platform, sign them on your behalf and then broadcast
            them to the network. You can get the latest version of the wallet daemon from this repository:
            <a href="https://github.com/enjin/wallet-daemon" target="_blank" class="text-primary">
                https://github.com/enjin/wallet-daemon</a
            >
            and an overview can be found here:
            <a href="https://docs.enjin.io/docs/wallet-daemon" target="_blank" class="text-primary">
                https://docs.enjin.io/docs/wallet-daemon
            </a>
        </p>
        <div class="flex flex-col space-y-4 mt-4">
            <label
                v-if="walletAccount"
                class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background text-sm rounded-md mr-auto p-2 cursor-pointer"
                name="walletAccount"
                disabled
                @click="copyText(walletAccount)"
            >
                {{ walletAccount }}
            </label>
            <span v-else-if="userWalletAccounts.length" class="text-lg font-bold text-light-content-strong dark:text-dark-content-strong">
                Connected Wallets
            </span>
            <label
                v-for="account in userWalletAccounts"
                :key="account"
                class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background hover:bg-light-surface-brand text-sm rounded-md mr-auto p-2 cursor-pointer"
                name="walletAccount"
                disabled
                @click="copyText(account)"
            >
                {{ account }}
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '~/store';
import { publicKeyToAddress } from '~/util/address';
import snackbar from '~/util/snackbar';

const appStore = useAppStore();

const walletAccount = computed(() =>
    appStore.isMultiTenant ? publicKeyToAddress(appStore.user?.account) : appStore.config.daemon
);
const userWalletAccounts = computed(() => appStore.user?.walletAccounts || []);

const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    snackbar.info({ title: 'Copied to clipboard!' });
};
</script>
