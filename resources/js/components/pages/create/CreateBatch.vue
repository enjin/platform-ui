<template>
    <div class="px-4 pb-2 sm:px-6 lg:px-8 overflow-y-auto transition-all">
        <RadioGroupButton
            class="pt-6"
            v-model="batchType"
            label="Select batch type"
            :items="batchTypes"
            :cols="batchTypes.length"
        />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BatchType } from '~/types/types.enums';
import { useRouter } from 'vue-router';
import RadioGroupButton from '~/components/RadioGroupButton.vue';

const router = useRouter();

const batchType = ref(BatchType.BatchMint);

const batchTypes = Object.values(BatchType).map((type) => ({
    key: `btn-${type}`,
    label: type.replace('Batch', 'Batch '),
    value: type,
}));

const batchRoutes = {
    [BatchType.BatchMint]: 'platform.create.batch.mint',
    [BatchType.BatchTransfer]: 'platform.create.batch.transfer',
    [BatchType.BatchSetAttribute]: 'platform.create.batch.set-attribute',
};

watch(
    () => batchType.value,
    (value) => {
        router.push({ name: batchRoutes[value] });
    }
);

(async () => {
    router.push({ name: batchRoutes[batchType.value] });
})();
</script>
