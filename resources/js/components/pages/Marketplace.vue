<template>
    <div class="m-3 sm:m-7 px-1 overflow-y-auto h-full transition-all flex flex-col">
        <RadioGroupButton v-model="marketType" :items="marketTypes" :cols="marketTypes.length" />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RadioGroupButton from '~/components/RadioGroupButton.vue';

const router = useRouter();

const marketType = ref('BidsList');

const marketTypes = [
    {
        key: 'btn-bids',
        label: 'Bids',
        value: 'BidsList',
    },
    {
        key: 'btn-listings',
        label: 'Listings',
        value: 'ListingsList',
    },
    {
        key: 'btn-sales',
        label: 'Sales',
        value: 'SalesList',
    },
];

const martketRoutes = {
    BidsList: 'platform.marketplace.bids',
    ListingsList: 'platform.marketplace.listings',
    SalesList: 'platform.marketplace.sales',
};

watch(
    () => marketType.value,
    (value) => {
        router.push({ name: martketRoutes[value] });
    }
);

(async () => {
    await router.isReady();
    if (router.currentRoute.value.name === 'platform.marketplace') {
        router.push({ name: martketRoutes[marketType.value] });
    } else if (router.currentRoute.value.name) {
        marketType.value = Object.keys(martketRoutes).find(
            (key) => martketRoutes[key] === router.currentRoute.value.name
        ) as string;
    }
})();
</script>
