<template>
    <div
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Token Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Token ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.tokenId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Collection ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.collectionId }}
                        </dd>
                    </div>

                    <div v-if="item.owner" class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Owner</dt>
                        <Address :address="item.owner" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Is Currency</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.isCurrency }}
                        </dd>
                    </div>

                    <div class="space-y-3 pt-4 pb-3">
                        <div class="space-y-2">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">Supply</dt>
                            <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                                {{ item.supply == '-1' ? '0' : item.supply }}
                            </dd>
                        </div>

                        <div class="space-y-2" v-if="item.capSupply">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">Cap Supply</dt>
                            <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                                {{ item.capSupply }}
                            </dd>
                        </div>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.royalty.beneficiary">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Royalty</dt>
                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Beneficiary</dt>
                        <dd
                            class="flex items-center mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                        >
                            {{ Royalty.getRoyaltyBeneficiary(item) }}
                            <CopyTextIcon :text="Royalty.getRoyaltyBeneficiary(item)" />
                        </dd>
                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Percentage</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ Royalty.getRoyaltyPercentage(item) }}%
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Frozen</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.isFrozen }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Network</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.collection.network }}
                        </dd>
                    </div>

                    <div v-if="item.attributes.length" class="space-y-2 pt-4 pb-3 overflow-x-scroll">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Attributes</dt>
                        <table class="divide-y divide-light-stroke dark:divide-dark-stroke">
                            <thead>
                                <tr class="divide-x divide-light-stroke dark:divide-dark-stroke">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-0"
                                    >
                                        Key
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                class="divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary"
                            >
                                <tr
                                    v-for="(attribute, idx) in item.attributes"
                                    :key="idx"
                                    class="divide-x divide-light-stroke dark:divide-dark-stroke"
                                >
                                    <td
                                        class="py-4 pl-4 pr-4 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-0 break-words"
                                    >
                                        {{ attribute.key }}
                                    </td>
                                    <td class="p-4 text-sm text-light-content dark:text-dark-content break-words">
                                        {{ attribute.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Address from '~/components/Address.vue';
import CopyTextIcon from '~/components/CopyTextIcon.vue';
import Royalty from '~/util/royalty';

defineProps<{
    item?: {
        tokenId: string;
        collectionId: string;
        owner: string;
        isCurrency: boolean;
        supply: string;
        capSupply: string;
        isFrozen: boolean;
        attributes: {
            key: string;
            value: string;
        }[];
        royalty: {
            beneficiary: string;
            percentage: string;
        };
        collection: {
            network: string;
        };
    };
}>();
</script>
