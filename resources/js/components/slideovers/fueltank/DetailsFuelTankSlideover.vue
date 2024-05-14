<template>
    <div
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Fuel Tank Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Tank ID</dt>
                        <Address :address="item.tankId" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Name</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.name }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Owner</dt>
                        <Address :address="item.owner" />
                    </div>

                    <div v-if="tankBalance" class="space-y-2 pt-4 pb-3 animate-fade-in">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Balance</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ formatPriceFromENJ(tankBalance)?.toFixed(4) }} {{ currencySymbol }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Reserves Existential Deposit
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.reservesExistentialDeposit }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Reserves Account Creation Deposit
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.reservesAccountCreationDeposit }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                            Provides Deposit
                        </dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.providesDeposit }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Frozen</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.isFrozen }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Total Accounts</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.accountCount }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.accountRules.length">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Account Rules</dt>
                        <table class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke">
                            <thead>
                                <tr class="divide-x divide-light-stroke dark:divide-dark-stroke">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-0"
                                    >
                                        Rule
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
                                    v-for="(accountRule, idx) in item.accountRules"
                                    :key="idx"
                                    class="divide-x divide-light-stroke dark:divide-dark-stroke"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-0 break-words"
                                    >
                                        {{ accountRule.rule }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap p-4 text-sm text-light-content dark:text-dark-content break-words"
                                    >
                                        {{ accountRule.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.dispatchRules.length">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Dispatch Rules</dt>
                        <table class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke">
                            <thead>
                                <tr class="divide-x divide-light-stroke dark:divide-dark-stroke">
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-0"
                                    >
                                        Rule
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Rule Set ID
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Value
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        IsFrozen
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                class="divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary"
                            >
                                <tr
                                    v-for="(dispatchRule, idx) in item.dispatchRules"
                                    :key="idx"
                                    class="divide-x divide-light-stroke dark:divide-dark-stroke"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-0 break-words"
                                    >
                                        {{ dispatchRule.rule }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap p-4 text-sm text-light-content dark:text-dark-content break-words"
                                    >
                                        {{ dispatchRule.ruleSetId }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap p-4 text-sm text-light-content dark:text-dark-content break-words"
                                    >
                                        {{ dispatchRule.value }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap p-4 text-sm text-light-content dark:text-dark-content break-words"
                                    >
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
import { computed, ref } from 'vue';
import { TransactionApi } from '~/api/transaction';
import Address from '~/components/Address.vue';
import { DTOWalletFactory as DTOFactory } from '~/factory/wallet';
import { useAppStore } from '~/store';
import { currencySymbolByNetwork, formatPriceFromENJ } from '~/util';

const props = defineProps<{
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

const tankBalance = ref();

const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));

const getTankBalance = async () => {
    if (!props.item) return;

    const res = await TransactionApi.getWallet({ account: props.item.tankId });
    tankBalance.value = DTOFactory.forWallet(res).items[0]?.balances?.free;
};

(() => {
    getTankBalance();
})();
</script>
