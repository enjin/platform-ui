<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" v-if="item">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Listing Details</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Listing ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 break-words">{{ item.listingId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">
                            Make Asset ID
                            <Tooltip text="The collection and token ID of the asset being sold.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.makeAssetId?.collectionId }}</dd>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.makeAssetId?.tokenId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">
                            Take Asset ID
                            <Tooltip text="The collection and token ID of the asset being requested.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.takeAssetId?.collectionId }}</dd>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.takeAssetId?.tokenId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Seller</dt>
                        <Address :address="item.seller" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Price</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            {{ formatPriceFromENJ(item.price) }} {{ currencySymbol }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Amount</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.amount }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">
                            Minimum take value
                            <Tooltip text="The minimum value of the take asset received for the sale to be a success.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.minTakeValue }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Fee Side</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.feeSide }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Creation Block</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.creationBlock }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Salt</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.salt }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">State</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.state.__typename }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Data</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.data.__typename }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Total Sales</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.sales }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Total Bids</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.bids }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3 mb-20">
                        <dt class="text-base font-medium text-gray-500">States</dt>
                        <dd class="mt-1 text-sm text-gray-900" v-for="state in item.states" :key="state.id">
                            <Chip :text="state.state" :closable="false" />
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import Address from '~/components/Address.vue';
import Chip from '~/components/Chip.vue';
import Tooltip from '~/components/Tooltip.vue';
import { useAppStore } from '~/store';
import { currencySymbolByNetwork, formatPriceFromENJ } from '~/util';

defineProps<{
    item?: {
        listingId: string;
        seller: string;
        price: string;
        amount: string;
        makeAssetId: {
            collectionId: string;
            tokenId: string;
        };
        takeAssetId: {
            collectionId: string;
            tokenId: string;
        };
        minTakeValue: string;
        feeSide: string;
        creationBlock: string;
        salt: string;
        state: {
            __typename: string;
        };
        data: {
            __typename: string;
        };
        sales: number;
        bids: number;
        states: {
            id: string;
            state: string;
        }[];
    };
}>();

const appStore = useAppStore();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));
</script>
