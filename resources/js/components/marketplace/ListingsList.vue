<template>
    <div
        class="mb-1 mt-4 sm:mt-8 bg-light-surface-primary dark:bg-dark-surface-primary px-4 sm:px-6 lg:px-8 shadow rounded-lg overflow-y-auto h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex lg:flex-row flex-col-reverse justify-between">
                    <div class="gap-4 min-w-0 mb-2 py-2 sm:px-6 lg:px-8 transition-all">
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
                                :type="searchInput.type"
                                @change="searchChange"
                            />
                        </div>
                    </div>
                    <div class="flex gap-2 sm:px-6 lg:px-8 py-2 mb-2 items-end">
                        <RouterLink :to="{ name: 'platform.create.listing' }">
                            <Btn primary> Create Listing </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table
                        class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                        v-if="listings.items?.length"
                    >
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 truncate"
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Listing ID
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Seller
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Sales
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Bids
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    State
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                            <tr
                                v-for="(listing, idx) in listings.items"
                                :key="listing.id"
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
                                        @click="openModalSlide('DetailsListingSlideover', listing)"
                                    >
                                        {{ `#${listing.id}` }}
                                    </span>
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ shortString(listing.listingId) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ checkFormatPrice(listing.price, listing, currencySymbol) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ addressShortHex(listing.seller) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ listing.sales }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ listing.bids }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ listing.state.__typename }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <DropdownMenu
                                        :actions="actions"
                                        @clicked="($event) => openModalSlide($event, listing)"
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
    </div>
    <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, Ref } from 'vue';
import { DTOMarketplaceFactory as DTOFactory } from '~/factory/marketplace';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import debounce from 'lodash/debounce';
import { addressShortHex } from '~/util/address';
import { checkFormatPrice, currencySymbolByNetwork, formatData, shortString, snackbarErrors } from '~/util';
import DropdownMenu from '~/components/DropdownMenu.vue';
import Slideover from '~/components/Slideover.vue';
import CollapseFilter from '~/components/CollapseFilter.vue';
import NoItems from '~/components/NoItems.vue';
import snackbar from '~/util/snackbar';
import { MarketplaceApi } from '~/api/marketplace';
import Btn from '../Btn.vue';
import { useAppStore } from '~/store';

const isLoading = ref(true);
const isPaginationLoading = ref(false);
const listings: Ref<{
    items: any;
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const slideComponent = ref();

const searchInputs = ref([
    {
        name: 'ids',
        label: 'IDs',
        placeholder: 'Search by ID',
        value: [],
        type: 'text',
    },
    {
        name: 'account',
        label: 'Account',
        placeholder: 'Search by account',
        value: [],
        type: 'text',
    },
    {
        name: 'listingIds',
        label: 'Listing IDs',
        placeholder: 'Search by listing ID',
        value: [],
        type: 'text',
    },
]);

const enablePagination = computed(() => !isLoading.value);

const searchChanged = computed(() => {
    return searchInputs.value.reduce((total, input) => total + input.value.length, 0);
});

const appStore = useAppStore();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsListingSlideover',
    },
    {
        key: 'cancel',
        name: 'Cancel',
        component: 'CancelListingSlideover',
    },
    {
        key: 'fill',
        name: 'Fill',
        component: 'FillListingSlideover',
    },
    {
        key: 'finalize',
        name: 'Finalize Auction',
        component: 'FinalizeAuctionSlideover',
    },
    {
        key: 'bid',
        name: 'Place Bid',
        component: 'PlaceBidSlideover',
    },
];

const debouncedSearch = debounce(async () => {
    await getListings();
}, 1000);

const cancelSearch = () => {
    debouncedSearch.cancel();
    getListings();
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

const getListings = async () => {
    isLoading.value = true;
    try {
        const res = await MarketplaceApi.getListings(
            formatData({
                ...getSearchInputs(),
            })
        );
        listings.value = DTOFactory.forListings(res);
    } catch (e) {
        listings.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Listings',
            text: 'Error while fetching Listings',
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
                    if (!listings.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await MarketplaceApi.getListings(
                        formatData({
                            ...getSearchInputs(),
                            after: listings.value.cursor,
                        })
                    );
                    const data = DTOFactory.forListings(res);
                    listings.value = { items: [...listings.value.items, ...data.items], cursor: data.cursor };
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
    let componentPath = 'marketplace';
    if (componentName.toLowerCase().includes('transaction')) componentPath = 'common';
    slideComponent.value = { componentName, componentPath, ...collection };
    modalSlide.value = true;
};

const closeModalSlide = () => {
    modalSlide.value = false;
    setTimeout(() => {
        slideComponent.value = null;
    }, 500);
};

(async () => {
    await getListings();
})();

onMounted(() => {
    loadMoreItemsWithObserver();
});

watch(
    () => searchChanged.value,
    () => {
        searchChange({ target: { value: '' } });
    }
);
</script>
