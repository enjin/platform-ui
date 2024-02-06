<template>
    <div class="w-64 flex-col hidden md:flex animate-slide-in">
        <div class="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-4 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
                <CanaryEnjinLogo v-if="canaryHost" class="h-8 w-auto" />
                <EnjinLogo v-else class="h-8 w-auto" />
                <span class="text-lg font-semibold ml-2 truncate">{{ pageTitle() }}</span>
            </div>
            <div class="mt-5 flex flex-grow flex-col">
                <nav class="flex-1 bg-white" aria-label="Sidebar">
                    <RouterLink
                        v-for="item in navigations"
                        :key="item.name"
                        :to="item.to"
                        class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 font-medium transition-all"
                    >
                        <span class="flex-1">{{ item.name }}</span>
                    </RouterLink>
                </nav>
            </div>
            <div class="mt-auto px-2 flex flex-col space-y-2">
                <a
                    href="https://docs.enjin.io"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Documentation
                </a>
                <a
                    href="https://feedback.enjin.io"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Feedback
                </a>
                <a
                    :href="
                        canaryHost ? 'https://platform.canary.enjin.io/graphiql' : 'https://platform.enjin.io/graphiql'
                    "
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    GraphiQl playground
                </a>
                <a
                    :href="canaryHost ? 'https://canary-matrix.subscan.io' : 'https://matrix.subscan.io'"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
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
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Blockchain console
                </a>
                <a
                    href="https://www.enjinstatus.com/"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Service status
                </a>
                <a
                    href="https://faucet.canary.enjin.io"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Enjin Coin faucet
                </a>
                <a
                    href="https://nft.io"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    NFT.io Marketplace
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '~/store';
import EnjinLogo from '~/components/EnjinLogo.vue';
import CanaryEnjinLogo from '~/components/CanaryEnjinLogo.vue';

const navigations = computed(() => useAppStore().navigations);

const canaryHost = computed(() => useAppStore().config.network === 'canary');

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
</script>

<style lang="scss" scoped>
.router-link-exact-active,
.router-link-active {
    @apply bg-gray-100;
    @apply text-primary;
}
</style>
