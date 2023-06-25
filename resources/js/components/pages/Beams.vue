<template>
    <div class="m-3 sm:m-7 px-1 overflow-y-auto h-full transition-all flex flex-col">
        <RadioGroupButton v-model="beamType" :items="beamTypes" :cols="beamTypes.length" />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RadioGroupButton from '~/components/RadioGroupButton.vue';

const router = useRouter();

const beamType = ref('BeamsList');

const beamTypes = [
    {
        label: 'Beams List',
        value: 'BeamsList',
    },
    {
        label: 'Claims List',
        value: 'ClaimsList',
    },
];

const beamRoutes = {
    BeamsList: 'platform.beams.list',
    ClaimsList: 'platform.beams.claims',
};

watch(
    () => beamType.value,
    (value) => {
        router.push({ name: beamRoutes[value] });
    }
);

(async () => {
    await router.isReady();
    if (router.currentRoute.value.name === 'platform.beams') {
        router.push({ name: beamRoutes[beamType.value] });
    } else if (router.currentRoute.value.name) {
        beamType.value = Object.keys(beamRoutes).find(
            (key) => beamRoutes[key] === router.currentRoute.value.name
        ) as string;
    }
})();
</script>
