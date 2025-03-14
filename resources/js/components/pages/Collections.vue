<template>
    <div
        class="px-4 sm:px-6 lg:px-8 bg-light-surface-primary dark:bg-dark-surface-primary m-4 sm:m-8 overflow-y-auto shadow rounded-lg h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex md:flex-row flex-col-reverse justify-between">
                    <div class="min-w-0 mb-2 md:w-1/2 py-2 md:px-6 lg:px-8 transition-all">
                        <div class="relative rounded-md shadow-sm">
                            <FormInput
                                v-model="searchInput"
                                name="searchInput"
                                label="Collection ID"
                                type="number"
                                placeholder="Search by collection ID"
                                @input-change="searchChange"
                            />
                        </div>
                    </div>
                    <div class="flex space-x-4 md:px-6 lg:px-8 py-2 mb-2 items-end">
                        <Btn dusk="trackCollectionBtn" primary @click="trackModal = true"> Track </Btn>
                        <RouterLink :to="{ name: 'platform.create.collection' }">
                            <Btn dusk="createCollectionBtn" primary> Create Collection </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table
                        id="collectionsTable"
                        class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                        v-if="collections.items?.length"
                    >
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 cursor-pointer"
                                    @click="sortTable('name')"
                                >
                                    Name
                                    <span v-if="sortKey === 'name'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 cursor-pointer"
                                    @click="sortTable('id')"
                                >
                                    ID
                                    <span v-if="sortKey === 'id'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('owner')"
                                >
                                    Owner
                                    <span v-if="sortKey === 'owner'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('attributes')"
                                >
                                    Attributes
                                    <span v-if="sortKey === 'attributes'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('tokens')"
                                >
                                    Tokens
                                    <span v-if="sortKey === 'tokens'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong cursor-pointer"
                                    @click="sortTable('frozen')"
                                >
                                    Frozen
                                    <span v-if="sortKey === 'frozen'"> {{ sortOrder === 'asc' ? '↑' : '↓' }} </span>
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                            <tr
                                v-for="(collection, idx) in sortedCollections"
                                :key="collection.collectionId"
                                :class="
                                    idx % 2 === 0
                                        ? undefined
                                        : 'bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50'
                                "
                            >
                                <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    {{ collectionNames[collection.collectionId] }}
                                </td>
                                <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    <span
                                        class="cursor-pointer"
                                        @click="openModalSlide('DetailsCollectionSlideover', collection)"
                                    >
                                        {{ `#${collection.collectionId}` }}
                                    </span>
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ addressShortHex(collection.owner) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ collection.attributes.length }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ collection.tokens?.totalCount }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ collection.frozen }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <Chip
                                        v-if="collection.tracked && !collection.searched"
                                        text="Tracked"
                                        :closable="false"
                                        class="!bg-blue-400 !bg-opacity-80 !text-white"
                                    />
                                    <LoadingCircle
                                        class="mx-3 h-5 w-5"
                                        v-if="loadingAction === collection.collectionId"
                                    />
                                    <DropdownMenu
                                        v-else
                                        :actions="actions(collection)"
                                        @clicked="($event) => openModalSlide($event, collection)"
                                        @loading="loadingAction = collection.collectionId"
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
        <TrackCollectionModal :is-open="trackModal" @confirm="trackCollection" @closed="trackModal = false" />
        <ConfirmModal
            key="cancel"
            :is-open="untrackModal"
            title="Untrack Collection"
            description="Are you sure you want to untrack this collection? It will be removed from your collections' list and you will have to add it again."
            @closed="closeUntrackModal"
            @confirm="untrackCollection"
        />
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
import { ApiService } from '~/api';
import TrackCollectionModal from '../TrackCollectionModal.vue';
import ConfirmModal from '../ConfirmModal.vue';
import Chip from '../Chip.vue';
import { useConnectionStore } from '~/store/connection';

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
        tracked?: boolean;
        searched?: boolean;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const untrackModal = ref(false);
const trackModal = ref(false);
const slideComponent = ref();
const searchInput = ref('');
const collectionNames = ref<{ [key: string]: string }[]>([]);
const loadingAction = ref<string | null>(null);
const sortKey = ref('');
const sortOrder = ref('asc');

const appStore = useAppStore();
const connectionStore = useConnectionStore();

const enablePagination = computed(() => searchInput.value === '');

const sortedCollections = computed(() => {
    if (!sortKey.value) {
        return collections.value.items;
    }

    const sorted = [...collections.value.items].sort((a, b) => {
        const aValue =
            sortKey.value === 'name'
                ? collectionNames.value[a.collectionId]
                : sortKey.value === 'id'
                ? parseInt(a.collectionId)
                : sortKey.value === 'owner'
                ? a.owner
                : sortKey.value === 'attributes'
                ? a.attributes.length
                : sortKey.value === 'tokens'
                ? a.tokens?.totalCount
                : a.frozen;
        const bValue =
            sortKey.value === 'name'
                ? collectionNames.value[b.collectionId]
                : sortKey.value === 'id'
                ? parseInt(b.collectionId)
                : sortKey.value === 'owner'
                ? b.owner
                : sortKey.value === 'attributes'
                ? b.attributes.length
                : sortKey.value === 'tokens'
                ? b.tokens?.totalCount
                : b.frozen;
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

const actions = (collection) => {
    if (collection.searched && collection.tracked) {
        return [
            {
                key: 'details',
                name: 'Details',
                component: 'DetailsCollectionSlideover',
            },
        ];
    }

    if (collection.tracked) {
        return [
            {
                key: 'details',
                name: 'Details',
                component: 'DetailsCollectionSlideover',
            },
            {
                key: 'untrack',
                name: 'Untrack',
                action: () => {
                    untrackModal.value = true;
                },
            },
        ];
    }

    return [
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
};

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
        debouncedSearch.cancel();
        debouncedSearch();
    } else {
        cancelSearch();
    }
};

const setCollectionIds = () => {
    if (searchInput.value) {
        return;
    }
    const ids = collections.value?.items.map((collection) => {
        return collection.collectionId;
    });
    appStore.setCollections(ids);
};

const getCollection = async () => {
    isLoading.value = true;
    try {
        const res = await CollectionApi.getCollections([parseInt(searchInput.value)]);
        collections.value = DTOFactory.forCollections(res);
        setTrackableCollections(true);
        setCollectionNames();
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
        setTrackableCollections();
        setCollectionNames();
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

const getCollectionName = async (collection) => {
    if (collection.attributes.find((attr) => attr.key === 'name')?.value) {
        return collection.attributes.find((attr) => attr.key === 'name')?.value;
    }

    const uri = collection.attributes.find((attr) => attr.key === 'uri')?.value;
    if (uri) {
        return await fetchUri(uri);
    }

    return '-';
};

const setCollectionNames = async () => {
    collections.value.items.map(async (item) => {
        if (collectionNames.value[`${item.collectionId}`]) {
            return item;
        }
        const name = await getCollectionName(item);
        collectionNames.value = { ...collectionNames.value, [`${item.collectionId}`]: name };

        return item;
    });
};

const fetchUri = async (uri) => {
    try {
        const res = await ApiService.fetchUrl(uri);
        if (res.name) {
            return res.name;
        }

        return '-';
    } catch {
        return '-';
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
                    const res = await CollectionApi.getCollections([], collections.value.cursor);
                    const data = DTOFactory.forCollections(res);
                    collections.value = { items: [...collections.value.items, ...data.items], cursor: data.cursor };
                    setTrackableCollections();
                    setCollectionNames();
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

const closeUntrackModal = () => {
    untrackModal.value = false;
    loadingAction.value = null;
};

const openTransactionSlide = async (transactionId: string) => {
    if (modalSlide.value) closeModalSlide();

    setTimeout(() => {
        openModalSlide('DetailsTransactionSlideover', { id: transactionId, state: TransactionState.PENDING });
    }, 600);
};

const trackCollection = async (collectionId: string) => {
    try {
        await CollectionApi.trackCollection(collectionId, true);
        await getCollections();
        snackbar.success({
            title: 'Tracking',
            text: 'Collection tracked successfully',
            save: false,
        });
    } catch {
        snackbar.error({
            title: 'Tracking',
            text: 'Tracking the collection failed',
        });
    } finally {
        trackModal.value = false;
    }
};

const untrackCollection = async () => {
    try {
        untrackModal.value = false;
        const res = await CollectionApi.untrackCollection(loadingAction.value!);
        if (!res.data.RemoveFromTracked) {
            snackbar.info({
                title: 'Untracking',
                text: 'Untracking the collection failed',
            });
            return;
        } else {
            await getCollections();
            snackbar.success({
                title: 'Untracking',
                text: 'Collection untracked successfully',
                save: false,
            });
        }
    } catch {
        snackbar.info({
            title: 'Untracking',
            text: 'Untracking the collection failed',
        });
    } finally {
        loadingAction.value = null;
    }
};

const checkCollectionOwnership = (collection, accounts) => {
    return !accounts.find((account) => account === collection.owner);
};

const setTrackableCollections = async (searched = false) => {
    await connectionStore.getAccounts();
    const uniqueAccounts = connectionStore.getTrackableAccounts();
    collections.value.items.map((collection) => {
        collection.tracked = checkCollectionOwnership(collection, uniqueAccounts);
        collection.searched = searched;

        return collection;
    });
};

(async () => {
    await getCollections();
})();

onMounted(() => {
    loadMoreCollectionsWithObserver();
    events.on('transaction', openTransactionSlide);
});

watch(() => collections.value, setCollectionIds);

watch(
    () => connectionStore.wallet,
    async () => {
        if (connectionStore.wallet) {
            await connectionStore.getAccounts();
            setTrackableCollections();
        }
    }
);
</script>

<style lang="scss" scoped>
input[type='search' i]::-webkit-search-cancel-button {
    display: none;
}
</style>
