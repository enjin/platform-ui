<template>
    <CollapseCard dusk-id="walletAppTab" title="Wallet app" :actions="false" :isOpen="true">
        <div>
            <div class="p-6">
                <template v-if="connected">
                    <div>
                        <div class="space-y-3">
                            <div class="flex space-x-4 items-center">
                                <span class="text-light-content dark:text-dark-content text-sm"
                                    >You are connected with {{ walletName }}</span
                                >
                                <button
                                    id="wallet-connect-button__disconnect"
                                    class="flex items-center space-x-2 rounded-md bg-primary py-1 px-2 md:py-2 md:px-3 text-sm font-semibold shadow-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-1 text-white transition-all"
                                    @click="disconnectWallet"
                                >
                                    Disconnect
                                </button>
                            </div>
                            <p class="text-light-content dark:text-dark-content text-sm">
                                Platform requests will show up in
                                <RouterLink class="underline" to="/transactions">
                                    {{ `${originUrl}/transactions` }}
                                </RouterLink>
                                and will need to be signed manually through your wallet. If you prefer automatic request
                                approvals, consider configuring a Daemon wallet.
                            </p>
                        </div>
                        <div class="flex flex-col space-y-4 mt-4">
                            <label
                                v-for="account in userWalletAccounts"
                                :key="account"
                                class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background hover:text-white hover:bg-light-surface-brand text-sm rounded-md mr-auto p-2 cursor-pointer transition-all"
                                name="walletAccount"
                                disabled
                                @click="copyText(account)"
                            >
                                {{ account }}
                            </label>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="space-y-3 relative flex flex-col">
                        <p class="text-light-content dark:text-dark-content text-sm">
                            You are not connected with a wallet app
                        </p>
                        <WalletConnectButton class="mr-auto" title="Connect Wallet App" :icon="false" />
                    </div>
                </template>
            </div>
        </div>
    </CollapseCard>
</template>

<script lang="ts" setup>
import snackbar from '~/util/snackbar';
import CollapseCard from '../CollapseCard.vue';
import { computed, watch } from 'vue';
import { useAppStore } from '~/store';
import { useConnectionStore } from '~/store/connection';
import WalletConnectButton from '../WalletConnectButton.vue';
import { publicKeyToAddress } from '~/util/address';

const appStore = useAppStore();
const connectionStore = useConnectionStore();

const connected = computed(() => connectionStore.wallet);
const userWalletAccounts = computed(
    () =>
        appStore.user?.walletAccounts || connectionStore.accounts?.map((account) => publicKeyToAddress(account.address))
);

const originUrl = window.location.origin;

const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    snackbar.info({ title: 'Copied to clipboard!' });
};

const disconnectWallet = async () => {
    await connectionStore.disconnectWallet();
};

const walletName = computed(() => {
    if (connectionStore.provider === 'wc') {
        return 'Enjin Wallet';
    } else if (connectionStore.provider === 'polkadot.js') {
        return 'Polkadot.JS';
    }

    return '';
});

watch(connected, () => {
    if (connected.value) {
        connectionStore.getAccounts();
    }
});
</script>
