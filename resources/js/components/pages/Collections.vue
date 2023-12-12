<template>
    <div class="px-4 sm:px-6 lg:px-8 bg-white m-4 sm:m-8 overflow-y-auto shadow rounded-lg h-full transition-all">
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex md:flex-row flex-col-reverse justify-between">
                    <div class="min-w-0 mb-2 md:w-1/2 py-2 md:px-6 lg:px-8 transition-all">
                        <div class="relative rounded-md shadow-sm">
                            <FormInput
                                v-model="searchInput"
                                type="number"
                                name="searchInput"
                                label="Collection ID"
                                placeholder="Search by collection ID"
                                @input-change="searchChange"
                            />
                        </div>
                    </div>
                    <div class="flex md:px-6 lg:px-8 py-2 mb-2 items-end">
                        <RouterLink :to="{ name: 'platform.create.collection' }">
                            <Btn primary> Create Collection </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table class="min-w-full divide-y divide-gray-300" v-if="collections.items?.length">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                >
                                    CollectionId
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Owner
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Attributes
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Tokens
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Frozen
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            <tr
                                v-for="(collection, idx) in collections.items"
                                :key="collection.collectionId"
                                :class="idx % 2 === 0 ? undefined : 'bg-gray-50'"
                            >
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsCollectionSlideover', collection)"
                                    >
                                        {{ `#${collection.collectionId}` }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ addressShortHex(collection.owner) }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ collection.attributes.length }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ collection.tokens?.totalCount }}
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {{ collection.frozen }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <DropdownMenu
                                        :actions="actions"
                                        @clicked="($event) => openModalSlide($event, collection)"
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
import { ref, computed, onMounted, Ref, watch } from 'vue';
import { CollectionApi } from '~/api/collection';
import { DTOCollectionFactory as DTOFactory } from '~/factory/collection';
import { addressShortHex } from '~/util/address';
import DropdownMenu from '~/components/DropdownMenu.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import debounce from 'lodash/debounce';
import { useAppStore } from '~/store';
import snackbar, { events } from '~/util/snackbar';
import FormInput from '~/components/FormInput.vue';
import NoItems from '~/components/NoItems.vue';
import { snackbarErrors } from '~/util';
import Btn from '~/components/Btn.vue';
import { TransactionState } from '~/types/types.enums';
import { useRoute, useRouter } from 'vue-router';

const isLoading = ref(true);
const isPaginationLoading = ref(false);
const collections: Ref<{
    items: {
        collectionId: string;
        owner: string;
        attributes: string[];
        tokens: {
            totalCount: number;
        };
        frozen: boolean;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const slideComponent = ref();
const searchInput = ref('');

const route = useRoute();
const router = useRouter();

const enablePagination = computed(() => searchInput.value === '');

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsCollectionSlideover',
    },
    {
        key: 'approve',
        name: 'Approve',
        component: 'ApproveCollectionSlideover',
    },
    {
        key: 'unapprove',
        name: 'Unapprove',
        component: 'UnapproveCollectionSlideover',
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
        component: 'MutateCollectionSlideover',
    },
    {
        key: 'attributes',
        name: 'Attributes',
        component: 'AttributesCollectionSlideover',
    },
    {
        key: 'destroy',
        name: 'Destroy',
        component: 'DestroyCollectionSlideover',
    },
];

const debouncedSearch = debounce(async () => {
    if (searchInput.value) {
        await getCollection();
    }
}, 1000);

const cancelSearch = () => {
    searchInput.value = '';
    debouncedSearch.cancel();
    getCollections();
};

const searchChange = (e) => {
    if (e.target.value) {
        debouncedSearch();
    } else {
        cancelSearch();
    }
};

const setCollectionIds = () => {
    const ids = collections.value?.items.map((collection) => {
        return collection.collectionId;
    });
    useAppStore().setCollections(ids);
};

const getCollection = async () => {
    isLoading.value = true;
    try {
        const res = await CollectionApi.getCollection(searchInput.value);
        collections.value = DTOFactory.forCollection(res);
    } catch (e) {
        collections.value.items = [];
    } finally {
        isLoading.value = false;
    }
};

const getCollections = async () => {
    try {
        const res = await CollectionApi.getCollections();
        collections.value = DTOFactory.forCollections(res);
    } catch (e) {
        collections.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection',
            text: 'Error while fetching collections',
        });
    } finally {
        isLoading.value = false;
    }
};

const loadMoreCollectionsWithObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                if (!enablePagination.value) return;
                try {
                    if (!collections.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await CollectionApi.getCollections(collections.value.cursor);
                    const data = DTOFactory.forCollections(res);
                    collections.value = { items: [...collections.value.items, ...data.items], cursor: data.cursor };
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

const openModalSlide = (componentName: string, collection) => {
    let componentPath = 'common';
    if (componentName.toLowerCase().includes('collection')) componentPath = 'collection';
    slideComponent.value = { componentName, componentPath, ...collection };
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

(async () => {
    await getCollections();
})();

onMounted(() => {
    loadMoreCollectionsWithObserver();
    events.on('transaction', openTransactionSlide);
});

watch(
    () => useAppStore().user,
    () => {
        if (useAppStore().isMultiTenant && !useAppStore().hasValidConfig && route.meta.requiresToken) {
            router.push({ name: 'platform.user.settings' });
        }
    }
);

watch(() => collections.value, setCollectionIds);
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
