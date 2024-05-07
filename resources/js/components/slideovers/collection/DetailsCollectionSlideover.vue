<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Collection Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Collection ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.collectionId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Owner</dt>
                        <Address :address="item.owner" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="Royalty.getRoyaltyBeneficiary(item)">
                        <dt class="text-base font-medium text-gray-700">Royalty</dt>
                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Beneficiary</dt>
                        <Address :address="Royalty.getRoyaltyBeneficiary(item)" />

                        <dt class="text-sm font-medium text-light-content dark:text-dark-content">Percentage</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ Royalty.getRoyaltyPercentage(item) }}%
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Frozen</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.frozen }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.tokens?.totalCount">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Total tokens</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.tokens?.totalCount }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Network</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.network }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.attributes.length">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Attributes</dt>
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr class="divide-x divide-gray-200">
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
                                class="divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary"
                            >
                                <tr
                                    v-for="(attribute, idx) in item.attributes"
                                    :key="idx"
                                    class="divide-x divide-gray-200"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-0 break-words"
                                    >
                                        {{ attribute.key }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap p-4 text-sm text-light-content dark:text-dark-content break-words"
                                    >
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
import Royalty from '~/util/royalty';

defineProps<{
    item?: {
        collectionId: string;
        owner: string;
        frozen: boolean;
        tokens: {
            totalCount: number;
        };
        network: string;
        attributes: {
            key: string;
            value: string;
        }[];
    };
}>();
</script>
