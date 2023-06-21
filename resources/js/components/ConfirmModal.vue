<template>
    <Modal :is-open="isOpen" :close="closeModal">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> Disclaimer </DialogTitle>
        <div class="mt-2">
            <p class="text-sm text-gray-500">
                Retries transactions that have failed or otherwise not been included on-chain after some time. Use with
                caution and ensure the transactions really aren't yet on-chain (or likely to be) to make sure they are
                not accidentally included twice.
            </p>
        </div>

        <div class="flex space-x-4 mt-4">
            <Btn @click="closeModal">Cancel</Btn>
            <Btn primary @click="confirm">Retry transaction</Btn>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from '~/components/Btn.vue';
import Modal from '~/components/Modal.vue';

defineProps<{ isOpen: boolean }>();

const emit = defineEmits(['closed', 'confirm']);

const closeModal = () => {
    emit('closed');
};

const confirm = () => {
    emit('confirm');
};
</script>
