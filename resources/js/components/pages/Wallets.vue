<template>
    <div
        class="px-4 sm:px-6 lg:px-8 bg-light-surface-primary dark:bg-dark-surface-primary m-4 sm:m-8 shadow rounded-lg overflow-y-auto h-full transition-all"
    >
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
                        <Btn dusk="transferBtn" primary @click="openModalSlide('TransferBalanceSlideover')"> Transfer Balance </Btn>
                    </div>
                </div>

                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table
                        id="walletsTable"
                        class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                        v-if="wallets.items?.length"
                    >
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    Id
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Account
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Managed
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Network
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                            <tr
                                v-for="(wallet, idx) in wallets.items"
                                :key="wallet.id"
                                :class="
                                    idx % 2 === 0
                                        ? undefined
                                        : 'bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50'
                                "
                            >
                                <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsWalletSlideover', wallet)"
                                    >
                                        {{ `#${wallet.id}` }}
                                    </span>
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ addressShortHex(wallet.account) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ wallet.managed }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
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
                <div ref="paginatorRef"></div>
            </div>
        </div>
        <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
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
import { useAppStore } from '~/store';

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
const paginatorRef = ref();

const enablePagination = computed(() => !isLoading.value);

const searchInputs = ref([
    {
        name: 'id',
        label: 'Wallet ID',
        placeholder: 'Search by wallet ID',
        value: '',
        tooltip: 'The internal database ID of the wallet.',
        type: 'number',
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
        getWallets();
    }
};

const getSearchInputs = () => {
    const inputs = {};

    searchInputs.value.forEach((input) => {
        if (input.type === 'number' && input.value !== '') {
            inputs[input.name] = parseInt(input.value);
        } else {
            inputs[input.name] = input.value.trim();
        }
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

const getWallets = async () => {
    try {
        isLoading.value = true;
        const res = await TransactionApi.getWallets();
        wallets.value = DTOFactory.forWallets(res);
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Wallets',
            text: 'Error while fetching wallets',
        });
    } finally {
        isLoading.value = false;
    }
};

const loadMoreItemsWithObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                if (!enablePagination.value) return;
                try {
                    if (!wallets.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await TransactionApi.getWallets(wallets.value.cursor);
                    const data = DTOFactory.forWallets(res);
                    wallets.value = { items: [...wallets.value.items, ...data.items], cursor: data.cursor };
                    isPaginationLoading.value = false;
                } catch (error) {
                    isPaginationLoading.value = false;
                }
            }
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        }
    );
    observer.observe(paginatorRef.value);
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

onMounted(async () => {
    await useAppStore().initPromise;
    useAppStore().clearInitPromise();
    getWallets();
    loadMoreItemsWithObserver();
    events.on('transaction', openTransactionSlide);
});
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
