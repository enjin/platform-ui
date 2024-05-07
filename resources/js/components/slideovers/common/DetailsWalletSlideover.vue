<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Wallet Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Wallet ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.id }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Account</dt>
                        <Address :address="item.account" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.balances">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Balances</dt>
                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Free</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words">
                            {{ formatPriceFromENJ(item.balances.free) }} {{ currencySymbol }}
                        </dd>
                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Reserved</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ formatPriceFromENJ(item.balances.reserved) }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.externalId">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">External Id</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.externalId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Managed</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.managed }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Network</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.network }}
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Address from '~/components/Address.vue';
import { useAppStore } from '~/store';
import { currencySymbolByNetwork, formatPriceFromENJ } from '~/util';

defineProps<{
    item?: {
        id: string;
        account: string;
        balances: {
            free: string;
            reserved: string;
        };
        externalId: string;
        managed: boolean;
        network: string;
    };
}>();

const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));
</script>
