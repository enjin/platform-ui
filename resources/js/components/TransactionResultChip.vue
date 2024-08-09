<template>
    <Chip :text="computedText" :closable="false" :class="getChipColor(text)" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chip from '~/components/Chip.vue';
import { TransactionResultType } from '~/types/types.enums';

const props = defineProps<{
    text: string;
}>();

const computedText = computed(() => props.text.replace('EXTRINSIC_', '').replace('TRANSACTION_', ''));

const getChipColor = (type: string) => {
    switch (type) {
        case TransactionResultType.TRANSACTION_SUCCESS:
        case TransactionResultType.EXTRINSIC_SUCCESS:
            return '!bg-green-200 !text-green-600';
        case TransactionResultType.TRANSACTION_FAILED:
        case TransactionResultType.EXTRINSIC_FAILED:
            return '!bg-red-400';
        default:
            return '';
    }
};
</script>
