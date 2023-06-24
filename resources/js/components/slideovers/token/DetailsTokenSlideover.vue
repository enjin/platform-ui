<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" v-if="item">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Token Details</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Token ID</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.tokenId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Collection ID</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.collectionId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Owner</dt>
                        <Address :address="item.owner" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Unit Price</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ formatPriceFromENJ(item.unitPrice) }} RFI</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Is Currency</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            {{ item.isCurrency }}
                        </dd>
                    </div>

                    <div class="space-y-3 pt-4 pb-3">
                        <div class="space-y-2">
                            <dt class="text-base font-medium text-gray-500">Supply</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ item.supply }}
                            </dd>
                        </div>

                        <div class="space-y-2" v-if="item.capSupply">
                            <dt class="text-base font-medium text-gray-500">Cap Supply</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ item.capSupply }}
                            </dd>
                        </div>

                        <div class="space-y-2">
                            <dt class="text-base font-medium text-gray-500">Minimum Balance</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                {{ item.minimumBalance }}
                            </dd>
                        </div>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.royalty.beneficiary">
                        <dt class="text-base font-medium text-gray-500">Royalty</dt>
                        <dt class="text-sm font-medium text-gray-500">Beneficiary</dt>
                        <dd class="flex items-center mt-1 text-sm text-gray-900 break-words">
                            {{ Royalty.getRoyaltyBeneficiary(item) }}
                            <CopyTextIcon :text="Royalty.getRoyaltyBeneficiary(item)" />
                        </dd>
                        <dt class="text-sm font-medium text-gray-500">Percentage</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ Royalty.getRoyaltyPercentage(item) }}%</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Frozen</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.isFrozen }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Network</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.collection.network }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.attributes.length">
                        <dt class="text-base font-medium text-gray-500">Attributes</dt>
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr class="divide-x divide-gray-200">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Key
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr
                                    v-for="(attribute, idx) in item.attributes"
                                    :key="idx"
                                    class="divide-x divide-gray-200"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0 break-words"
                                    >
                                        {{ attribute.key }}
                                    </td>
                                    <td class="whitespace-nowrap p-4 text-sm text-gray-500 break-words">
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
import { formatPriceFromENJ } from '~/util';
import Royalty from '~/util/royalty';

defineProps<{
    item?: {
        tokenId: string;
        collectionId: string;
        owner: string;
        unitPrice: string;
        isCurrency: boolean;
        supply: string;
        capSupply: string;
        minimumBalance: string;
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
