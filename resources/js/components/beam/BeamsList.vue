<template>
    <div
        class="mb-1 mt-4 sm:mt-8 bg-light-surface-primary dark:bg-dark-surface-primary px-4 sm:px-6 lg:px-8 shadow rounded-lg overflow-y-auto h-full transition-all"
    >
        <div class="mt-4 flow-root">
            <div class="sm:-mx-6 lg:-mx-8 transition-all">
                <div class="flex flex-col-reverse md:flex-row gap-4 min-w-0 mb-2 py-2 sm:px-6 lg:px-8 transition-all">
                    <div class="relative rounded-md shadow-sm flex-1">
                        <FormInput
                            v-model="searchInput"
                            name="beamCode"
                            label="Beam Code"
                            placeholder="Search by beam code"
                            has-addon
                            @input-change="searchChange"
                        >
                            <template #addon>
                                <div
                                    class="rounded-r-md border border-l-0 border-gray-300 inset-y-0 left-0 flex items-center"
                                >
                                    <select
                                        v-model="searchCodeType"
                                        class="h-full rounded-r-md border-0 bg-transparent py-0 pl-3 pr-7 text-light-content dark:text-dark-content focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                                    >
                                        <option v-for="codeType in codeTypes" :key="codeType">
                                            {{ codeType }}
                                        </option>
                                    </select>
                                </div>
                            </template>
                        </FormInput>
                    </div>
                    <div class="flex flex-1 justify-end gap-4 items-end">
                        <div>
                            <Btn
                                v-if="beams.items?.length"
                                class="animate-fade-in"
                                primary
                                :loading="downloadLoading"
                                @click="exportAllBeams"
                            >
                                Export All
                            </Btn>
                        </div>
                        <RouterLink :to="{ name: 'platform.create.beam' }">
                            <Btn primary> Create Enjin Beam </Btn>
                        </RouterLink>
                    </div>
                </div>
                <LoadingContent
                    class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                    :is-loading="isLoading"
                >
                    <div class="relative">
                        <div
                            v-if="selectedBeams.length > 0"
                            class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-light-surface-primary dark:bg-dark-surface-primary sm:left-12"
                        >
                            <Btn class="!px-2 !py-1 text-sm animate-fade-in" @click="expireSelectedBeams"
                                >{{ `Expire ${selectedBeams.length > 1 ? 'All' : ''} ` }}
                            </Btn>
                            <Btn class="!px-2 !py-1 text-sm animate-fade-in" @click="exportSelectedBeams">Export</Btn>
                        </div>
                        <table v-if="beams.items?.length" class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                                        <input
                                            type="checkbox"
                                            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-all"
                                            :checked="isChecked"
                                            :indeterminate="indeterminate"
                                            @change="checkedChange"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong sm:pl-3 truncate"
                                    >
                                        Beam Id
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Code
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
                                        End
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-sm font-semibold text-light-content-strong dark:text-dark-content-strong truncate"
                                    >
                                        Is Claimable
                                    </th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-light-surface-primary dark:bg-dark-surface-primary">
                                <tr
                                    v-for="beam in beams.items"
                                    :key="beam.id"
                                    :class="[checkBeamIncluded(beam) && 'bg-gray-50']"
                                >
                                    <td class="relative px-7 sm:w-12 sm:px-6">
                                        <div
                                            v-if="checkBeamIncluded(beam)"
                                            class="absolute inset-y-0 left-0 w-0.5 bg-primary animate-fade-in"
                                        ></div>
                                        <input
                                            type="checkbox"
                                            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-all"
                                            :value="beam"
                                            v-model="selectedBeams"
                                        />
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-light-content-strong dark:text-dark-content-strong sm:pl-3"
                                    >
                                        <span
                                            class="cursor-pointer"
                                            @click="openModalSlide('DetailsBeamSlideover', beam)"
                                        >
                                            {{ `#${beam.id}` }}
                                        </span>
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ shortCode(beam.code) }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ beam.name }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ new Date(beam.end).toLocaleString() }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap px-3 py-4 text-sm text-light-content dark:text-dark-content"
                                    >
                                        {{ beam.isClaimable }}
                                    </td>
                                    <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 flex justify-end"
                                    >
                                        <DropdownMenu
                                            :actions="actions"
                                            @clicked="($event) => openModalSlide($event, beam)"
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
    </div>
    <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import { DTOBeamFactory as DTOFactory } from '~/factory/beam';
import DropdownMenu from '~/components/DropdownMenu.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import Slideover from '~/components/Slideover.vue';
import debounce from 'lodash/debounce';
import snackbar, { events } from '~/util/snackbar';
import FormInput from '~/components/FormInput.vue';
import { CodeType, TransactionState } from '~/types/types.enums';
import { shortCode } from '~/util/address';
import NoItems from '~/components/NoItems.vue';
import Btn from '~/components/Btn.vue';
import { formatData, snackbarErrors } from '~/util';
import { BeamApi } from '~/api/beam';

const isLoading = ref(false);
const downloadLoading = ref(false);
const isPaginationLoading = ref(false);
const beams: Ref<{
    items: {
        id: number;
        code: string;
        name: string;
        end: string;
        isClaimable: boolean;
        qr: {
            url: string;
            payload: string;
        };
    }[];
    cursor: string | null;
    totalCount?: number;
}> = ref({
    items: [],
    cursor: null,
});
const paginatorRef = ref();
const modalSlide = ref(false);
const slideComponent = ref();
const searchInput = ref('');
const searchCodeType = ref(CodeType.MultiUse);
const codeTypes = Object.values(CodeType);
const selectedBeams: Ref<
    {
        id: number;
        code: string;
        name: string;
        end: string;
        isClaimable: boolean;
        qr: {
            url: string;
            payload: string;
        };
    }[]
> = ref([]);
const indeterminate = computed(
    () => selectedBeams.value.length > 0 && selectedBeams.value.length < beams.value.items.length
);

const enablePagination = computed(() => searchInput.value === '');

const isChecked = computed(() => {
    return indeterminate.value || selectedBeams.value.length === beams.value.items.length;
});

const actions = [
    {
        key: 'details',
        name: 'Details',
        component: 'DetailsBeamSlideover',
    },
    {
        key: 'update',
        name: 'Update',
        component: 'UpdateBeamSlideover',
    },
    {
        key: 'delete',
        name: 'Delete',
        component: 'DeleteBeamSlideover',
    },
    {
        key: 'claim',
        name: 'Claim',
        component: 'ClaimBeamSlideover',
    },
];

const debouncedSearch = debounce(async () => {
    if (searchInput.value) {
        await getBeams();
    }
}, 1000);

const cancelSearch = () => {
    searchInput.value = '';
    debouncedSearch.cancel();
    getBeams();
};

const searchChange = (e) => {
    if (e.target.value) {
        debouncedSearch();
    } else {
        cancelSearch();
    }
};

const getSingleUseCode = async () => {
    if (!searchInput.value) return;

    isLoading.value = true;
    try {
        const res = await BeamApi.getSingleUseCodes({ code: searchInput.value });
        beams.value = DTOFactory.forSingleUseCodes(res);
    } catch {
        // Do notihing
    } finally {
        isLoading.value = false;
    }
};

const getBeamCodes = async () => {
    isLoading.value = true;
    try {
        const res = await BeamApi.getBeams(formatData(searchInput.value ? { codes: [searchInput.value] } : {}));
        beams.value = DTOFactory.forBeams(res);
    } catch (e) {
        beams.value.items = [];
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Beams',
            text: 'Error while fetching beams',
        });
    } finally {
        isLoading.value = false;
    }
};

const checkBeamIncluded = (beam) => {
    return selectedBeams.value.some((b) => b.code === beam.code);
};

const checkedChange = (e) => {
    selectedBeams.value = e.target?.checked ? beams.value.items : [];
};

const expireSelectedBeams = () => {
    const codes = selectedBeams.value.map((beam) => beam.code);
    if (codes.length === 0) return;

    openModalSlide('ExpireBeamSlideover', { codes });
};

const exportSelectedBeams = () => {
    const beams = selectedBeams.value.map((beam) => {
        return { code: beam.code, url: beam.qr.url, qr: beam.qr.payload };
    });
    downloadCSV(beams);
};

const exportAllBeams = async () => {
    if (searchCodeType.value === CodeType.SingleUse) {
        downloadLoading.value = true;
        const res = await BeamApi.getSingleUseCodes({
            code: searchInput.value,
            first: beams.value.totalCount,
        });
        const data = DTOFactory.forSingleUseCodes(res);
        downloadCSV(data.items.map((beam) => ({ code: beam.code, url: beam.qr.url, qr: beam.qr.payload })));
        downloadLoading.value = false;
    } else {
        downloadCSV(beams.value.items.map((beam) => ({ code: beam.code, url: beam.qr.url, qr: beam.qr.payload })));
    }
};

const downloadCSV = (data) => {
    var csvContent = 'code;url;qr\n';
    data.forEach(function (infoArray, index) {
        let dataString = infoArray.code + ';' + infoArray.url + ';' + infoArray.qr;
        csvContent += index < data.length ? dataString + '\n' : dataString;
    });
    const blob = new Blob([csvContent], { type: 'application/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'beam_codes_' + new Date().toISOString() + '.csv';
    link.click();
    URL.revokeObjectURL(link.href);
};

const getBeams = async () => {
    beams.value.items = [];
    if (searchCodeType.value === CodeType.MultiUse) {
        await getBeamCodes();
    } else {
        await getSingleUseCode();
    }
};

const loadMoreApi = async () => {
    if (searchCodeType.value !== CodeType.MultiUse) {
        const res = await BeamApi.getSingleUseCodes({
            code: searchInput.value,
            after: beams.value.cursor,
        });

        return DTOFactory.forSingleUseCodes(res);
    } else {
        const res = await BeamApi.getBeams({
            ...formatData(searchInput.value ? { codes: [searchInput.value] } : {}),
            after: beams.value.cursor,
        });

        return DTOFactory.forBeams(res);
    }
};

const loadMoreItemsWithObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                if (!enablePagination.value) return;
                try {
                    if (!beams.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const data = await loadMoreApi();
                    beams.value = { items: [...beams.value.items, ...data.items], cursor: data.cursor };
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
    let componentPath = 'beam';
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

const openTransactionSlide = async (transactionId: string) => {
    if (modalSlide.value) closeModalSlide();

    setTimeout(() => {
        openModalSlide('DetailsTransactionSlideover', { id: transactionId, state: TransactionState.PENDING });
    }, 600);
};

onMounted(() => {
    getBeams();
    loadMoreItemsWithObserver();
    events.on('transaction', openTransactionSlide);
});

watch(
    () => searchCodeType.value,
    () => {
        getBeams();
    }
);
</script>
