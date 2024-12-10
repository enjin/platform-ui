<template>
    <div
        class="px-4 sm:px-6 lg:px-8 bg-light-surface-primary dark:bg-dark-surface-primary m-4 sm:m-8 shadow rounded-lg overflow-y-auto h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="md:-mx-6 lg:-mx-8 transition-all">
                <div class="sm:py-2 sm:px-6 lg:px-8 mb-2 w-full">
                    <h1
                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                    >
                        Filters
                    </h1>
                    <div class="flex flex-wrap gap-4 mt-2">
                        <CollapseFilter
                            v-for="searchInput in searchInputs"
                            :key="searchInput.name"
                            v-model="searchInput.value"
                            :label="searchInput.label"
                            :name="searchInput.name"
                            :placeholder="searchInput.placeholder"
                            :options="searchInput.options"
                            :type="searchInput.type"
                            @change="searchChange"
                        />
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <div class="relative">
                        <div
                            v-if="selectedTransaction.length > 0"
                            class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-light-surface-primary dark:bg-dark-surface-primary sm:left-12"
                        >
                            <Btn class="!px-2 !py-1 text-sm" @click="retrySelectedTransactions">
                                {{ `Retry ${selectedTransaction.length > 1 ? 'all' : ''}` }}
                            </Btn>
                        </div>
                        <table
                            id="transactionsTable"
                            class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                            v-if="transactions.items?.length"
                        >
                            <thead>
                                <tr>
                                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                                        <input
                                            type="checkbox"
                                            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light-stroke-strong dark:border-dark-stroke-strong text-primary focus:ring-primary bg-light-surface-background dark:bg-dark-surface-background"
                                            :checked="isChecked"
                                            :indeterminate="indeterminate"
                                            @change="checkedChange"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 cursor-pointer"
                                        @click="sortTable('id')"
                                    >
                                        ID
                                        <span v-if="sortKey === 'id'">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                        @click="sortTable('wallet')"
                                    >
                                        Wallet
                                        <span v-if="sortKey === 'wallet'">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                        @click="sortTable('method')"
                                    >
                                        Method
                                        <span v-if="sortKey === 'method'">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                        @click="sortTable('state')"
                                    >
                                        State
                                        <span v-if="sortKey === 'state'">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                        @click="sortTable('result')"
                                    >
                                        Result
                                        <span v-if="sortKey === 'result'">
                                            {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-right text-sm font-semibold text-light-content-strong dark:text-dark-content-strong truncate cursor-pointer"
                                    >
                                        Transaction ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                                <tr
                                    v-for="transaction in sortedTransactions"
                                    :key="transaction.id"
                                    :class="[
                                        selectedTransaction.includes(transaction.id) &&
                                            'bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50',
                                    ]"
                                >
                                    <td class="relative px-7 sm:w-12 sm:px-6">
                                        <div
                                            v-if="selectedTransaction.includes(transaction.id)"
                                            class="absolute inset-y-0 left-0 w-0.5 bg-primary animate-fade-in"
                                        ></div>
                                        <input
                                            type="checkbox"
                                            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light-stroke-strong dark:border-dark-stroke-strong text-primary focus:ring-primary bg-light-surface-background dark:bg-dark-surface-background"
                                            :value="transaction.id"
                                            v-model="selectedTransaction"
                                        />
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                    >
                                        <span
                                            class="cursor-pointer"
                                            @click="openModalSlide('DetailsTransactionSlideover', transaction)"
                                        >
                                            {{ `#${transaction.id}` }}
                                        </span>
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ addressShortHex(transaction.wallet) }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ transaction.method }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ transaction.state }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        <TransactionResultChip v-if="transaction.result" :text="transaction.result" />
                                    </td>
                                    <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end items-center"
                                    >
                                        <Btn
                                            v-if="
                                                (transaction.state !== TransactionState.PENDING &&
                                                    transaction.transactionId) ||
                                                transaction.state === TransactionState.BROADCAST
                                            "
                                            primary
                                            @click="openModalSlide('DetailsTransactionSlideover', transaction)"
                                        >
                                            <span v-if="transaction.transactionId">
                                                {{ transaction.transactionId }}
                                            </span>
                                            <LoadingCircle v-else class="h-5 w-5 mx-5 text-white" />
                                        </Btn>
                                        <SignTransaction
                                            v-if="transaction.state === TransactionState.PENDING"
                                            :transaction="transaction"
                                            @success="onSuccess(transaction.id)"
                                        />
                                        <DropdownMenu
                                            :actions="actions"
                                            @clicked="($event) => openModalSlide($event, transaction)"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <NoItems v-else />
                    </div>
                </LoadingContent>
                <LoadingCircle v-if="isPaginationLoading" class="mx-auto py-4" />
                <div ref="paginatorRef"></div>
            </div>
        </div>
        <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" @update="updateTransaction" />

        <ConfirmModal
            key="retry"
            :is-open="modalRetry"
            title="Disclaimer"
            description="Retries transactions that have failed or otherwise not been included on-chain after some time. Use with caution and ensure the transactions really aren't yet on-chain (or likely to be) to make sure they are not accidentally included twice."
            @closed="modalRetry = false"
            @confirm="retryTransaction"
        />

        <ConfirmModal
            key="cancel"
            :is-open="modalCancel"
            title="Disclaimer"
            description="Cancels the selected transaction. This action cannot be undone."
            @closed="modalCancel = false"
            @confirm="cancelTransaction"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, Ref } from 'vue';
import { DTOTransactionFactory as DTOFactory } from '~/factory/transaction';
import { addressShortHex } from '~/util/address';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import debounce from 'lodash/debounce';
import { formatData, snackbarErrors } from '~/util';
import CollapseFilter from '~/components/CollapseFilter.vue';
import Btn from '~/components/Btn.vue';
import TransactionResultChip from '~/components/TransactionResultChip.vue';
import { TransactionResultType, TransactionState, TransactionMethods } from '~/types/types.enums';
import NoItems from '~/components/NoItems.vue';
import snackbar from '~/util/snackbar';
import SignTransaction from '../SignTransaction.vue';
import { TransactionApi } from '~/api/transaction';
import DropdownMenu from '../DropdownMenu.vue';
import ConfirmModal from '../ConfirmModal.vue';

const isLoading = ref(false);
const isPaginationLoading = ref(false);
const transactions: Ref<{
    items: {
        id: number;
        wallet: string;
        method: TransactionMethods;
        state: TransactionState;
        result: TransactionResultType;
        transactionId: string;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const modalRetry = ref(false);
const modalCancel = ref(false);
const slideComponent = ref();
const selectedTransaction: Ref<number[]> = ref([]);
const sortKey = ref('');
const sortOrder = ref('asc');
const selectedId = ref(0);

const indeterminate = computed(
    () => selectedTransaction.value.length > 0 && selectedTransaction.value.length < transactions.value.items.length
);

const isChecked = computed(() => {
    return indeterminate.value || selectedTransaction.value.length === transactions.value.items.length;
});

const searchInputs = ref([
    {
        name: 'ids',
        label: 'IDs',
        placeholder: 'Search by ID',
        value: [],
    },
    {
        name: 'transactionIds',
        label: 'Transaction IDs',
        placeholder: 'Search by transaction ID',
        value: [],
    },
    {
        name: 'transactionHashes',
        label: 'Transaction Hashs',
        placeholder: 'Search by transaction hash',
        value: [],
    },
    {
        name: 'methods',
        label: 'Methods',
        placeholder: 'Search by method',
        value: [],
        type: 'select',
        options: Object.values(TransactionMethods),
    },
    {
        name: 'states',
        label: 'States',
        placeholder: 'Search by state',
        value: [],
        type: 'select',
        options: Object.values(TransactionState),
    },
    {
        name: 'results',
        label: 'Results',
        placeholder: 'Search by result',
        value: [],
        type: 'select',
        options: Object.values(TransactionResultType),
    },
    {
        name: 'accounts',
        label: 'Accounts',
        placeholder: 'Search by account',
        value: [],
    },
    {
        name: 'idempotencyKeys',
        label: 'Idempotency Keys',
        placeholder: 'Search by idempotency key',
        value: [],
    },
]);

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsTransactionSlideover',
    },
    {
        key: 'retry',
        name: 'Retry',
        component: 'RetryModal',
    },
    {
        key: 'cancel',
        name: 'Cancel',
        component: 'CancelModal',
    },
];

const enablePagination = computed(() => !isLoading.value);

const searchChanged = computed(() => {
    return searchInputs.value.reduce((total, input) => total + input.value.length, 0);
});

const debouncedSearch = debounce(async () => {
    await getTransactions();
}, 1000);

const sortedTransactions = computed(() => {
    if (!sortKey.value) return transactions.value.items;
    const sorted = [...transactions.value.items].sort((a, b) => {
        const aValue = sortKey.value === 'id' ? parseInt(a.id.toString()) : a[sortKey.value];
        const bValue = sortKey.value === 'id' ? parseInt(b.id.toString()) : b[sortKey.value];
        if (sortOrder.value === 'asc') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
    });
    return sorted;
});

const sortTable = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

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

const checkedChange = (e) => {
    selectedTransaction.value = e.target?.checked ? transactions.value.items.map((p) => p.id) : [];
};

const retrySelectedTransactions = () => {
    const ids = selectedTransaction.value;
    if (ids.length === 0) return;

    openModalSlide('RetryTransactionSlideover', { ids: ids });
};

const getSearchInputs = () => {
    const inputs = {};

    searchInputs.value.forEach((input) => {
        inputs[input.name] = input.value;
    });

    return inputs;
};

const onSuccess = async (id) => {
    const res = await getTransaction(id);

    transactions.value.items.map((p) => {
        if (p.id === id) {
            p.state = res.state;
            p.result = res.result;
            p.transactionId = res.transactionId;
        }

        return p;
    });

    openModalSlide('DetailsTransactionSlideover', res);
};

const getTransaction = async (id) => {
    const res = await TransactionApi.getTransaction(id);

    return res.data.GetTransaction;
};

const updateTransaction = (transaction) => {
    transactions.value.items.map((p) => {
        if (p.id === transaction.id) {
            p.state = transaction.state;
            p.result = transaction.result;
            p.transactionId = transaction.transactionId;
        }
        return p;
    });
};

const getTransactions = async () => {
    try {
        isLoading.value = true;
        const res = await TransactionApi.getTransactions(
            formatData({
                ...getSearchInputs(),
            })
        );
        transactions.value = DTOFactory.forTransactions(res);
    } catch (e) {
        transactions.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Transactions',
            text: 'Error while fetching transactions',
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
                    if (!transactions.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await TransactionApi.getTransactions(
                        formatData({
                            ...getSearchInputs(),
                            after: transactions.value.cursor,
                        })
                    );
                    const data = DTOFactory.forTransactions(res);
                    transactions.value = { items: [...transactions.value.items, ...data.items], cursor: data.cursor };
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

const openModalSlide = (componentName: string, transaction) => {
    let componentPath = 'common';
    if (componentName.toLowerCase().includes('modal')) {
        selectedId.value = transaction.id;
        if (componentName.toLowerCase().includes('retry')) {
            modalRetry.value = true;
        } else if (componentName.toLowerCase().includes('cancel')) {
            modalCancel.value = true;
        }
    } else {
        slideComponent.value = { componentName, componentPath, ...transaction };
        modalSlide.value = true;
    }
};

const retryTransaction = async () => {
    modalRetry.value = false;
    try {
        const res = await TransactionApi.retryTransactions(
            formatData({
                ids: [selectedId.value],
            })
        );

        const id = res.data?.RetryTransactions;

        if (id) {
            snackbar.success({
                title: `Retry transactions`,
                text: `Retry transactions successful`,
            });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: `Retry transactions`,
            text: `Retry transactions failed`,
        });
    } finally {
        isLoading.value = false;
        selectedId.value = 0;
    }
};

const updateTransactionState = (id) => {
    transactions.value.items.map((p) => {
        if (p.id === id) {
            p.state = TransactionState.ABANDONED;
        }

        return p;
    });
};

const cancelTransaction = async () => {
    modalCancel.value = false;
    const transactionId = selectedId.value;
    selectedId.value = 0;
    try {
        const res = await TransactionApi.updateTransaction(
            formatData({
                id: transactionId,
                state: TransactionState.ABANDONED,
            })
        );

        const id = res.data?.UpdateTransaction;

        if (id) {
            updateTransactionState(transactionId);
            snackbar.success({
                title: `Cancel transactions`,
                text: `Cancel transactions successful`,
            });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: `Cancel transactions`,
            text: `Cancel transactions failed`,
        });
    }
};

const closeModalSlide = () => {
    modalSlide.value = false;
    setTimeout(() => {
        slideComponent.value = null;
    }, 500);
};

(async () => {
    getTransactions();
})();

onMounted(() => {
    loadMoreItemsWithObserver();
});

watch(
    () => searchChanged.value,
    () => {
        searchChange({ target: { value: 'search' } });
    }
);
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
