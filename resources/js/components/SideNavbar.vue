<template>
    <div class="w-64 flex-col hidden md:flex animate-slide-in bg-light-surface-primary dark:bg-dark-surface-primary">
        <div
            class="flex flex-grow flex-col overflow-y-auto border-r border-light-stroke dark:border-dark-stroke pt-4 pb-4"
        >
            <div class="flex flex-shrink-0 items-center px-4">
                <CanaryEnjinLogo v-if="canaryHost" class="h-8 w-auto" />
                <EnjinLogo v-else class="h-8 w-auto" />
                <span
                    class="text-lg font-semibold ml-2 truncate text-light-content-strong dark:text-dark-content-strong"
                    >{{ pageTitle() }}</span
                >
            </div>
            <div class="mt-4 flex flex-grow flex-col">
                <nav class="flex-1" aria-label="Sidebar">
                    <RouterLink
                        v-for="item in navigations"
                        :key="item.name"
                        :to="item.to"
                        class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 font-medium transition-all"
                    >
                        <span class="">{{ item.name }}</span>
                        <span
                            v-if="item.count && transactionsCount > 0"
                            class="text-xs font-normal ml-4 rounded-full text-light-content-brand dark:text-dark-content-brand bg-light-surface-brand-alpha p-1 w-6 h-6 flex items-center justify-center animate-fade-in"
                        >
                            {{ transactionsCount }}
                        </span>
                    </RouterLink>
                </nav>
            </div>
            <div class="mt-auto flex flex-col">
                <a
                    href="https://docs.enjin.io"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Documentation
                </a>
                <a
                    href="https://feedback.enjin.io"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Feedback
                </a>
                <a
                    :href="
                        canaryHost ? 'https://platform.canary.enjin.io/graphiql' : 'https://platform.enjin.io/graphiql'
                    "
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    GraphiQl playground
                </a>
                <a
                    :href="canaryHost ? 'https://canary-matrix.subscan.io' : 'https://matrix.subscan.io'"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Blockchain explorer
                </a>
                <a
                    :href="
                        canaryHost
                            ? 'https://console.enjin.io/?rpc=wss://rpc.matrix.canary.enjin.io#/explorer'
                            : 'https://console.enjin.io/?rpc=wss://rpc.matrix.blockchain.enjin.io#/explorer'
                    "
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Blockchain console
                </a>
                <a
                    href="https://www.enjinstatus.com/"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Service status
                </a>
                <a
                    href="https://faucet.canary.enjin.io"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    Enjin Coin faucet
                </a>
                <a
                    href="https://nft.io"
                    target="_blank"
                    class="text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-selected hover:dark:text-dark-content-selected group flex items-center px-4 py-3 text-sm font-medium"
                >
                    NFT.io Marketplace
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '~/store';
import EnjinLogo from '~/components/EnjinLogo.vue';
import CanaryEnjinLogo from '~/components/CanaryEnjinLogo.vue';
import { TransactionApi } from '~/api/transaction';
import { DTOTransactionFactory as DTOFactory } from '~/factory/transaction';

const navigations = computed(() => useAppStore().navigations);

const canaryHost = computed(() => useAppStore().config.network === 'canary');

const transactionsCount = ref(0);

const loadTransactions = async () => {
    const res = await TransactionApi.getTransactions({ first: 500 });
    transactionsCount.value = DTOFactory.getPendingTransactionsCount(res.data);
};

const pageTitle = () => {
    if (window.bootstrap?.name) {
        return window.bootstrap.name;
    }

    if (canaryHost.value) {
        return 'Canary Platform';
    } else {
        return 'Platform';
    }
};

onMounted(() => {
    loadTransactions();
});
</script>

<style lang="scss" scoped>
.router-link-exact-active,
.router-link-active {
    @apply bg-light-surface-background dark:bg-dark-surface-background;
    @apply text-primary;
}
</style>
