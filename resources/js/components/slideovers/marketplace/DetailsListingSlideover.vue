<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Listing Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Listing ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words">
                            {{ item.listingId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Make Asset ID
                            <Tooltip text="The collection and token ID of the asset being sold.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.makeAssetId?.collectionId }}
                        </dd>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.makeAssetId?.tokenId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Take Asset ID
                            <Tooltip text="The collection and token ID of the asset being requested.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.takeAssetId?.collectionId }}
                        </dd>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.takeAssetId?.tokenId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Seller</dt>
                        <Address :address="item.seller" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Price</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ checkFormatPrice(item.price, item, currencySymbol) }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Amount</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.amount }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Minimum take value
                            <Tooltip text="The minimum value of the take asset received for the sale to be a success.">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.minTakeValue }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Fee Side</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.feeSide }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Creation Block</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.creationBlock }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Salt</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.salt }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">State</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.state.__typename }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Data</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.data.__typename }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Total Sales</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.sales }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Total Bids</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.bids }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3 mb-20">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">States</dt>
                        <dd
                            class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong"
                            v-for="state in item.states"
                            :key="state.id"
                        >
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
import { checkFormatPrice, currencySymbolByNetwork } from '~/util';

defineProps<{
    item?: {
        listingId: string;
        seller: string;
        price: number;
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
