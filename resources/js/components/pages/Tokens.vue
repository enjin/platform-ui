<template>
    <div
        class="px-4 sm:px-6 lg:px-8 bg-light-surface-primary dark:bg-dark-surface-primary m-4 sm:m-8 shadow rounded-lg overflow-y-auto h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex lg:flex-row flex-col-reverse justify-between">
                    <div class="min-w-0 mb-2 w-full lg:w-2/3 py-2 sm:px-6 lg:px-8 transition-all">
                        <div class="flex flex-col md:flex-row relative gap-4">
                            <div class="flex-1">
                                <FormInput
                                    v-model="searchCollectionInput"
                                    name="searchInput"
                                    label="Collection ID"
                                    type="number"
                                    placeholder="Search by collection ID"
                                    @input-change="searchCollectionChange"
                                />
                            </div>
                            <div class="flex-1">
                                <TokenIdInput
                                    v-model="searchTokensInput"
                                    label="Token ID"
                                    placeholder="Search by Token ID"
                                    @search-tokens-change="searchTokensChange"
                                    readmore="Token ID"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 sm:px-6 lg:px-8 py-2 mb-2 items-end">
                        <RouterLink :to="{ name: 'platform.create.batch.mint' }">
                            <Btn primary dusk="batchBtn"> Batch </Btn>
                        </RouterLink>
                        <RouterLink :to="{ name: 'platform.create.token' }">
                            <Btn primary dusk="createTokenBtn"> Create Token </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table
                        id="tokensTable"
                        class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                        v-if="tokens.items?.length"
                    >
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 cursor-pointer"
                                    @click="sortTable('name')"
                                >
                                    Name
                                    <span v-if="sortKey === 'name'">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
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
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 cursor-pointer"
                                    @click="sortTable('collectionId')"
                                >
                                    Collection ID
                                    <span v-if="sortKey === 'collectionId'">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('owner')"
                                >
                                    Owner
                                    <span v-if="sortKey === 'owner'">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('attributes')"
                                >
                                    Attributes
                                    <span v-if="sortKey === 'attributes'">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('frozen')"
                                >
                                    Frozen
                                    <span v-if="sortKey === 'frozen'">
                                        {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                            <tr
                                v-for="(token, idx) in sortedTokens"
                                :key="idx"
                                :class="
                                    idx % 2 === 0
                                        ? undefined
                                        : 'bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50'
                                "
                            >
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm font-medium text-light-content-strong dark:text-dark-content-strong"
                                >
                                    {{ tokenNames[`${token.collection.collectionId}-${token.tokenId}`] }}
                                </td>
                                <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsTokenSlideover', token)"
                                    >
                                        {{ `#${token.tokenId}` }}
                                    </span>
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    #{{ token.collection.collectionId }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ addressShortHex(token.owner) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ token.attributeCount }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ token.isFrozen }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <DropdownMenu
                                        :actions="actions"
                                        @clicked="($event) => openModalSlide($event, token)"
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
import { ref, computed, onMounted, Ref } from 'vue';
import { TokenApi } from '~/api/token';
import { DTOTokenFactory as DTOFactory } from '~/factory/token';
import { addressShortHex } from '~/util/address';
import DropdownMenu from '~/components/DropdownMenu.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import debounce from 'lodash/debounce';
import { formatTokens, snackbarErrors } from '~/util';
import { TokenIdSelectType, TransactionState } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import snackbar, { events } from '~/util/snackbar';
import FormInput from '~/components/FormInput.vue';
import NoItems from '~/components/NoItems.vue';
import Btn from '~/components/Btn.vue';
import { ApiService } from '~/api';

const isLoading = ref(false);
const isPaginationLoading = ref(false);
const tokens: Ref<{
    items: {
        tokenId: string;
        collection: {
            collectionId: string;
        };
        owner: string;
        attributeCount: number;
        isFrozen: boolean;
        nonFungible: boolean;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const slideComponent = ref();
const searchCollectionInput = ref();
const searchTokensInput = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const tokenNames = ref<{ [key: string]: string }[]>([]);
const sortKey = ref('');
const sortOrder = ref('asc');

const enablePagination = computed(() => searchTokensInput.value.tokenId === '');

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsTokenSlideover',
    },
    {
        key: 'mint',
        name: 'Mint',
        component: 'MintTokenSlideover',
    },
    {
        key: 'approve',
        name: 'Approve',
        component: 'ApproveTokenSlideover',
    },
    {
        key: 'unapprove',
        name: 'Unapprove',
        component: 'UnapproveTokenSlideover',
    },
    {
        key: 'freeze',
        name: 'Freeze',
        component: 'FreezeSlideover',
    },
    {
        key: 'thaw',
        name: 'Thaw',
        component: 'ThawSlideover',
    },
    {
        key: 'mutate',
        name: 'Mutate',
        component: 'MutateTokenSlideover',
    },
    {
        key: 'infuse',
        name: 'Infuse',
        component: 'InfuseTokenSlideover',
    },
    {
        key: 'transfer',
        name: 'Transfer',
        component: 'TransferTokenSlideover',
    },
    {
        key: 'attributes',
        name: 'Attributes',
        component: 'AttributesTokenSlideover',
    },
    {
        key: 'burn',
        name: 'Burn',
        component: 'BurnTokenSlideover',
    },
];

const sortedTokens = computed(() => {
    if (!sortKey.value) {
        return tokens.value.items;
    }

    const sorted = [...tokens.value.items].sort((a, b) => {
        const aValue =
            sortKey.value === 'name'
                ? tokenNames.value[`${a.collection.collectionId}-${a.tokenId}`]
                : sortKey.value === 'id'
                ? a.tokenId
                : sortKey.value === 'collectionId'
                ? a.collection.collectionId
                : sortKey.value === 'owner'
                ? a.owner
                : sortKey.value === 'attributes'
                ? a.attributeCount
                : a.isFrozen;
        const bValue =
            sortKey.value === 'name'
                ? tokenNames.value[`${b.collection.collectionId}-${b.tokenId}`]
                : sortKey.value === 'id'
                ? b.tokenId
                : sortKey.value === 'collectionId'
                ? b.collection.collectionId
                : sortKey.value === 'owner'
                ? b.owner
                : sortKey.value === 'attributes'
                ? b.attributeCount
                : b.isFrozen;

        if (sortOrder.value === 'asc') {
            return aValue > bValue ? 1 : -1;
        }

        return aValue < bValue ? 1 : -1;
    });
    return sorted;
});

const debouncedSearch = debounce(async () => {
    if (searchCollectionInput.value) {
        await getTokens();
    }
}, 1000);

const sortTable = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const cancelSearch = (input) => {
    input.value = undefined;
    debouncedSearch.cancel();
};

const searchCollectionChange = (e) => {
    if (e.target.value) {
        debouncedSearch();
    } else {
        cancelSearch(searchCollectionInput);
        getTokens();
    }
};

const searchTokensChange = (e) => {
    if (e.target.value) {
        debouncedSearch.cancel();
        debouncedSearch();
    } else {
        cancelSearch(searchTokensInput);
        getTokens();
    }
};

const setTokenNames = async () => {
    tokens.value.items.map(async (item) => {
        if (tokenNames.value[`${item.collection.collectionId}-${item.tokenId}`]) {
            return item;
        }
        const name = await getTokenName(item);
        tokenNames.value = { ...tokenNames.value, [`${item.collection.collectionId}-${item.tokenId}`]: name };

        return item;
    });
};

const getTokens = async () => {
    try {
        isLoading.value = true;
        const res = await TokenApi.getTokens(searchCollectionInput.value, formatTokens([searchTokensInput.value]));
        tokens.value = DTOFactory.forTokens(res);
        setTokenNames();
    } catch (e) {
        tokens.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Tokens',
            text: 'Error while fetching tokens',
        });
    } finally {
        isLoading.value = false;
    }
};

const loadMoreTokensWithObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                if (!enablePagination.value) return;
                try {
                    if (!tokens.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await TokenApi.getTokens(
                        searchCollectionInput.value,
                        formatTokens([searchTokensInput.value]),
                        tokens.value.cursor
                    );
                    const data = DTOFactory.forTokens(res);
                    tokens.value = { items: [...tokens.value.items, ...data.items], cursor: data.cursor };
                    setTokenNames();
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

const openModalSlide = (componentName: string, token) => {
    let componentPath = 'common';
    if (componentName.toLowerCase().includes('token')) componentPath = 'token';
    slideComponent.value = { componentName, componentPath, ...token };
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

const getTokenName = async (token): Promise<string> => {
    if (token.attributes.find((attr) => attr.key === 'name')?.value) {
        return token.attributes.find((attr) => attr.key === 'name')?.value;
    }

    const uri = token.attributes.find((attr) => attr.key === 'uri')?.value;
    if (uri) {
        return await fetchUri(uri);
    }

    return '-';
};

const fetchUri = async (uri) => {
    try {
        const res = await ApiService.fetchUrl(uri);
        if (res.name) {
            return res.name;
        }

        return '-';
    } catch (e) {
        return '-';
    }
};

onMounted(async () => {
    getTokens();
    loadMoreTokensWithObserver();
    events.on('transaction', openTransactionSlide);
});
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
