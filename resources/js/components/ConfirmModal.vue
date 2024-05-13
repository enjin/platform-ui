<template>
    <Modal :is-open="isOpen" :close="closeModal">
        <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
        >
            {{ title }}
        </DialogTitle>
        <div class="mt-2">
            <p class="text-sm text-light-content dark:text-dark-content">
                {{ description }}
            </p>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
            <Btn @click="closeModal">Cancel</Btn>
            <Btn primary @click="confirm">Confirm</Btn>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from '~/components/Btn.vue';
import Modal from '~/components/Modal.vue';

defineProps<{ isOpen: boolean; title: string; description: string }>();

const emit = defineEmits(['closed', 'confirm']);

const closeModal = () => {
    emit('closed');
};

const confirm = () => {
    emit('confirm');
};
</script>
