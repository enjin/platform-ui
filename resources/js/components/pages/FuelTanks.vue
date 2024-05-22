<template>
    <div
        class="px-4 sm:px-6 lg:px-8 bg-light-surface-primary dark:bg-dark-surface-primary m-4 sm:m-8 overflow-y-auto shadow rounded-lg h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex md:flex-row flex-col-reverse justify-between">
                    <div class="sm:py-2 sm:px-6 lg:px-8 mb-2 w-full">
                        <h1 class="block font-medium leading-6 text-light-content-strong dark:text-dark-content-strong">
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
                                @change="searchChange"
                            />
                        </div>
                    </div>

                    <div class="flex md:px-6 lg:px-8 py-2 mb-2 items-end">
                        <RouterLink :to="{ name: 'platform.create.fuel-tank' }">
                            <Btn primary> Create Fuel Tank </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <table
                        class="min-w-full divide-y divide-light-stroke dark:divide-dark-stroke"
                        v-if="fueltanks.items?.length"
                    >
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                >
                                    Tank ID
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Accounts
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Owner
                                </th>
                                <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Frozen
                                </th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                            </tr>
                        </thead>
                        <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                            <tr
                                v-for="(fueltank, idx) in fueltanks.items"
                                :key="fueltank.tankId"
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
                                        @click="openModalSlide('DetailsFuelTankSlideover', fueltank)"
                                    >
                                        {{ `#${addressShortHex(fueltank.tankId)}` }}
                                    </span>
                                </td>

                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ fueltank.name }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ fueltank.accountCount }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ addressShortHex(fueltank.owner) }}
                                </td>
                                <td
                                    class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                >
                                    {{ fueltank.isFrozen }}
                                </td>
                                <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                >
                                    <DropdownMenu
                                        :actions="actions"
                                        @clicked="($event) => openModalSlide($event, fueltank)"
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
import { ref, computed, onMounted, watch, Ref } from 'vue';
import { DTOFuelTankFactory as DTOFactory } from '~/factory/fueltank';
import { addressShortHex } from '~/util/address';
import DropdownMenu from '~/components/DropdownMenu.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import CollapseFilter from '~/components/CollapseFilter.vue';
import debounce from 'lodash/debounce';
import { events } from '~/util/snackbar';
import NoItems from '~/components/NoItems.vue';
import { FuelTankApi } from '~/api/fueltank';
import { formatData } from '~/util';
import Btn from '../Btn.vue';
import { TransactionState } from '~/types/types.enums';
import { useAppStore } from '~/store';

const isLoading = ref(true);
const isPaginationLoading = ref(false);
const fueltanks: Ref<{
    items: {
        tankId: string;
        name: string;
        accountCount: number;
        owner: string;
        isFrozen: boolean;
    }[];
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
        name: 'names',
        label: 'Names',
        placeholder: 'Search by name',
        value: [],
    },
    {
        name: 'tankIds',
        label: 'Tank IDs',
        placeholder: 'Search by tank ID',
        value: [],
    },
]);

const enablePagination = computed(() => !isLoading.value);

const searchChanged = computed(() => {
    return searchInputs.value.reduce((total, input) => total + input.value.length, 0);
});

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsFuelTankSlideover',
    },
    {
        key: 'accounts',
        name: 'Accounts',
        component: 'AccountsFuelTankSlideover',
    },
    {
        key: 'mutate',
        name: 'Mutate',
        component: 'MutateFuelTankSlideover',
    },
    {
        key: 'consumption',
        name: 'Set Consumption',
        component: 'ConsumptionFuelTankSlideover',
    },
    {
        key: 'dispatch',
        name: 'Dispatch',
        component: 'DispatchFuelTankSlideover',
    },
    {
        key: 'rulesets',
        name: 'Rule Sets',
        component: 'RuleSetsFuelTankSlideover',
    },
    {
        key: 'destroy',
        name: 'Destroy',
        component: 'DestroyFuelTankSlideover',
    },
    {
        key: 'freeze',
        name: 'Freeze / Unfreeze',
        component: 'FreezeFuelTankSlideover',
    },
];

const debouncedSearch = debounce(async () => {
    await getFuelTanks();
}, 500);

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

const getFuelTanks = async () => {
    try {
        const res = await FuelTankApi.getFuelTanks(formatData({ ...getSearchInputs() }));
        fueltanks.value = DTOFactory.forFuelTanks(res);
    } catch (error) {
        // Do notihing
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
                    if (!fueltanks.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await FuelTankApi.getFuelTanks(
                        formatData({
                            ...getSearchInputs(),
                            after: fueltanks.value.cursor,
                        })
                    );
                    const data = DTOFactory.forFuelTanks(res);
                    fueltanks.value = { items: [...fueltanks.value.items, ...data.items], cursor: data.cursor };
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

const openModalSlide = (componentName: string, fueltank: any) => {
    let componentPath = 'common';
    if (componentName.toLowerCase().includes('fueltank')) componentPath = 'fueltank';
    slideComponent.value = {
        componentName,
        componentPath,
        ...fueltank,
    };
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
    await useAppStore().initPromise;
    await getFuelTanks();
})();

onMounted(() => {
    loadMoreItemsWithObserver();
    events.on('transaction', openTransactionSlide);
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
