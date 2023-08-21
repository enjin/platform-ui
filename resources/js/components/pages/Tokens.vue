<template>
    <div class="px-4 sm:px-6 lg:px-8 bg-white m-4 sm:m-8 shadow rounded-lg overflow-y-auto h-full transition-all">
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
                            <Btn primary> Batch </Btn>
                        </RouterLink>
                        <RouterLink :to="{ name: 'platform.create.token' }">
                            <Btn primary> Create Token </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table class="min-w-full divide-y divide-gray-300" v-if="tokens.items?.length">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    Token ID
                                </th>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    Collection ID
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Owner
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Attributes
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Frozen
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            <tr
                                v-for="(token, idx) in tokens.items"
                                :key="token.tokenId"
                                :class="idx % 2 === 0 ? undefined : 'bg-gray-50'"
                            >
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsTokenSlideover', token)"
                                    >
                                        {{ `#${token.tokenId}` }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    #{{ token.collection.collectionId }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ addressShortHex(token.owner) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ token.attributeCount }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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

const debouncedSearch = debounce(async () => {
    if (searchCollectionInput.value !== '') {
        await getTokens();
    }
}, 1000);

const cancelSearch = (input) => {
    input.value = '';
    debouncedSearch.cancel();
};

const searchCollectionChange = (e) => {
    if (e.target.value) {
        debouncedSearch();
    } else {
        cancelSearch(searchCollectionInput);
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

const getTokens = async () => {
    try {
        isLoading.value = true;
        const res = await TokenApi.getTokens(searchCollectionInput.value, formatTokens([searchTokensInput.value]));
        tokens.value = DTOFactory.forTokens(res);
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
                    const res = await TokenApi.getTokens(searchCollectionInput.value, tokens.value.cursor);
                    const data = DTOFactory.forTokens(res);
                    tokens.value = { items: [...tokens.value.items, ...data.items], cursor: data.cursor };
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

onMounted(() => {
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
