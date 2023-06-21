<template>
    <Chip :text="text" :closable="false" :class="getChipColor(text)" />
</template>

<script setup lang="ts">
import Chip from '~/components/Chip.vue';
import { TransactionResultType } from '~/types/types.enums';

defineProps<{
    text: string;
}>();

const getChipColor = (type: string) => {
    switch (type) {
        case TransactionResultType.TRANSACTION_SUCCESS:
        case TransactionResultType.EXTRINSIC_SUCCESS:
            return '!bg-green-200 !text-green-600';
        case TransactionResultType.TRANSACTION_FAILED:
        case TransactionResultType.EXTRINSIC_FAILED:
            return '!bg-red-200';
        default:
            return '';
    }
};
</script>
