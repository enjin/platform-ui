<template>
    <div class="px-4 sm:px-6 lg:px-8 bg-white m-4 sm:m-8 shadow rounded-lg overflow-y-auto h-full transition-all">
        <div class="mt-4 flow-root">
            <div class="md:-mx-6 lg:-mx-8 transition-all">
                <div class="flex md:flex-row flex-col-reverse justify-between">
                    <div class="sm:py-2 sm:px-6 lg:px-8 mb-2 w-full flex justify-between">
                        <div class="flex flex-wrap gap-4">
                            <div class="" v-for="searchInput in searchInputs" :key="searchInput.name">
                                <FormInput
                                    v-model="searchInput.value"
                                    :name="searchInput.name"
                                    :label="searchInput.label"
                                    :placeholder="searchInput.placeholder"
                                    @input-change="searchChange"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex md:px-6 lg:px-8 py-2 mb-2 items-end">
                        <Btn primary @click="openModalSlide('TransferBalanceSlideover')"> Transfer Balance </Btn>
                    </div>
                </div>

                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table class="min-w-full divide-y divide-gray-300" v-if="wallets.items?.length">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    Id
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Account
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Managed
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Network
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            <tr
                                v-for="(wallet, idx) in wallets.items"
                                :key="wallet.id"
                                :class="idx % 2 === 0 ? undefined : 'bg-gray-50'"
                            >
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsWalletSlideover', wallet)"
                                    >
                                        {{ `#${wallet.id}` }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ addressShortHex(wallet.account) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ wallet.managed }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ wallet.network }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <DropdownMenu
                                        :actions="actions"
                                        @clicked="($event) => openModalSlide($event, wallet)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <NoItems v-else />
                </LoadingContent>
                <LoadingCircle v-if="isPaginationLoading" class="mx-auto py-4" />
            </div>
        </div>
        <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { TransactionApi } from '~/api/transaction';
import { DTOWalletFactory as DTOFactory } from '~/factory/wallet';
import { addressShortHex } from '~/util/address';
import DropdownMenu from '~/components/DropdownMenu.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import debounce from 'lodash/debounce';
import { formatData, snackbarErrors } from '~/util';
import snackbar, { events } from '~/util/snackbar';
import FormInput from '~/components/FormInput.vue';
import NoItems from '~/components/NoItems.vue';
import { TransactionState } from '~/types/types.enums';
import Btn from '../Btn.vue';

const isLoading = ref(false);
const isPaginationLoading = ref(false);
const wallets: Ref<{
    items: {
        id: number;
        account: string;
        managed: boolean;
        network: string;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const modalSlide = ref(false);
const slideComponent = ref();

const searchInputs = ref([
    {
        name: 'id',
        label: 'Wallet ID',
        placeholder: 'Search by wallet ID',
        value: '',
        tooltip: 'The internal database ID of the wallet.',
    },
    {
        name: 'externalId',
        label: 'External ID',
        placeholder: 'Search by external ID',
        value: '',
        tooltip:
            'The external ID associated with the wallet.  This is the ID that you can set when creating a wallet, for example to make it easier to link to a record in another database.',
    },
    {
        name: 'verificationId',
        label: 'Verification ID',
        placeholder: 'Search by verification ID',
        value: '',
        tooltip: 'This is the verification ID for the wallet used to verify a wallet on the platform.',
    },
    {
        name: 'account',
        label: 'Account',
        placeholder: 'Search by account',
        value: '',
        tooltip: 'The wallet account address.',
    },
]);

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsWalletSlideover',
    },
];

const debouncedSearch = debounce(async () => {
    await getWallet();
}, 1000);

const cancelSearch = () => {
    debouncedSearch.cancel();
};

const searchChange = (e) => {
    if (e.target.value) {
        debouncedSearch();
    } else {
        cancelSearch();
    }
};

const getSearchInputs = () => {
    const inputs = {};

    searchInputs.value.forEach((input) => {
        inputs[input.name] = input.value;
    });

    return inputs;
};

const getWallet = async () => {
    try {
        isLoading.value = true;
        const res = await TransactionApi.getWallet(formatData(getSearchInputs()));
        wallets.value = DTOFactory.forWallet(res);
    } catch (e) {
        wallets.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Wallets',
            text: 'Error while fetching wallets',
        });
    } finally {
        isLoading.value = false;
    }
};

const openModalSlide = (componentName: string, wallet?: any) => {
    let componentPath = 'common';
    slideComponent.value = { componentName, componentPath, ...wallet };
    modalSlide.value = true;
};

const closeModalSlide = () => {
    modalSlide.value = false;
    setTimeout(() => {
        slideComponent.value = null;
    }, 500);
};

const openTransactionSlide = async (transactionId: string) => {
    if (modalSlide.value) closeModalSlide();

    setTimeout(() => {
        openModalSlide('DetailsTransactionSlideover', { id: transactionId, state: TransactionState.PENDING });
    }, 600);
};

onMounted(() => {
    events.on('transaction', openTransactionSlide);
});
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
