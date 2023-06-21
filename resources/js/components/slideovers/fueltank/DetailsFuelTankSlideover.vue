<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" v-if="item">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Fuel Tank Details</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Tank ID</dt>
                        <Address :address="item.tankId" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Name</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.name }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Owner</dt>
                        <Address :address="item.owner" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Reserves Existential Deposit</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.reservesExistentialDeposit }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Reserves Account Creation Deposit</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.reservesAccountCreationDeposit }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Provides Deposit</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.providesDeposit }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Frozen</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.isFrozen }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Total Accounts</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.accountCount }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.accountRules.length">
                        <dt class="text-base font-medium text-gray-500">Account Rules</dt>
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr class="divide-x divide-gray-200">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Rule
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr
                                    v-for="(accountRule, idx) in item.accountRules"
                                    :key="idx"
                                    class="divide-x divide-gray-200"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0 break-words"
                                    >
                                        {{ accountRule.rule }}
                                    </td>
                                    <td class="whitespace-nowrap p-4 text-sm text-gray-500 break-words">
                                        {{ accountRule.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.dispatchRules.length">
                        <dt class="text-base font-medium text-gray-500">Dispatch Rules</dt>
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr class="divide-x divide-gray-200">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Rule
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Rule Set ID
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Value
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        IsFrozen
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr
                                    v-for="(dispatchRule, idx) in item.dispatchRules"
                                    :key="idx"
                                    class="divide-x divide-gray-200"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0 break-words"
                                    >
                                        {{ dispatchRule.rule }}
                                    </td>
                                    <td class="whitespace-nowrap p-4 text-sm text-gray-500 break-words">
                                        {{ dispatchRule.ruleSetId }}
                                    </td>
                                    <td class="whitespace-nowrap p-4 text-sm text-gray-500 break-words">
                                        {{ dispatchRule.value }}
                                    </td>
                                    <td class="whitespace-nowrap p-4 text-sm text-gray-500 break-words">
                                        {{ dispatchRule.isFrozen }}
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

defineProps<{
    item?: {
        tankId: string;
        name: string;
        owner: string;
        reservesExistentialDeposit: string;
        reservesAccountCreationDeposit: string;
        providesDeposit: string;
        isFrozen: boolean;
        accountCount: number;
        accountRules: {
            rule: string;
            value: string;
        }[];
        dispatchRules: {
            rule: string;
            ruleSetId: string;
            value: string;
            isFrozen: boolean;
        }[];
    };
}>();
</script>
