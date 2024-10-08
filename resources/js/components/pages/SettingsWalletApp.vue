<template>
    <CollapseCard dusk-id="walletAppTab" title="Wallet app" :actions="false" :isOpen="true">
        <div>
            <div class="p-6">
                <template v-if="connected">
                    <div>
                        <div class="space-y-3">
                            <div class="flex space-x-4 items-center">
                                <span class="text-light-content dark:text-dark-content text-sm">
                                    You are connected with {{ walletName }}
                                </span>
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
                            <template v-if="loadingAccounts">
                                <LoadingCircle class="mt-4" :size="42" />
                            </template>
                            <template v-else>
                                <WalletAppItem
                                    v-for="item in userWalletAccounts"
                                    :key="item.address"
                                    :account="item.address"
                                    :enabled="item.enabled"
                                />
                            </template>
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
import CollapseCard from '../CollapseCard.vue';
import { computed, ref, watch } from 'vue';
import { useConnectionStore } from '~/store/connection';
import WalletConnectButton from '../WalletConnectButton.vue';
import WalletAppItem from './WalletAppItem.vue';
import LoadingCircle from '../LoadingCircle.vue';

const connectionStore = useConnectionStore();

const loadingAccounts = ref(false);

const connected = computed(() => connectionStore.wallet);
const userWalletAccounts = computed(() => connectionStore.getWalletAccounts());

const originUrl = window.location.origin;

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

watch(connected, async () => {
    if (connected.value) {
        loadingAccounts.value = true;
        await connectionStore.getAccounts();
        loadingAccounts.value = false;
    }
});
</script>
