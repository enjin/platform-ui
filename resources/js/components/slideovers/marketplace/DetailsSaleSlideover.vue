<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" v-if="item">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Sale Details</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Sale ID</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.id }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Seller</dt>
                        <Address :address="item.bidder" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Price</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            {{ checkFormatPrice(item.price, item.listing, currencySymbol) }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Amount</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.amount }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Listing</dt>
                        <dd class="mt-1 text-sm text-gray-900 break-words">{{ item.listing.listingId }}</dd>
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
import { checkFormatPrice, currencySymbolByNetwork } from '~/util';

defineProps<{
    item?: {
        id: string;
        bidder: string;
        price: number;
        amount: string;
        listing: {
            listingId: string;
        };
    };
}>();

const appStore = useAppStore();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));
</script>
