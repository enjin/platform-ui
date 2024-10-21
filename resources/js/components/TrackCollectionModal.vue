<template>
    <Modal :is-open="props.isOpen" :close="closeModal">
        <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
        >
            Track a collection
        </DialogTitle>
        <div class="mt-2 space-y-4">
            <p class="text-sm text-light-content dark:text-dark-content">
                Enter a collection ID to track it. This will enable platform interactions like querying its tokens.
            </p>
            <FormInput
                v-model="collectionId"
                label="Collection ID"
                placeholder="Collection ID"
                class="flex-1 sm:flex-none text-light-content dark:text-dark-content"
                name="collectionId"
            />
        </div>

        <div class="flex justify-end space-x-4 mt-6">
            <Btn dusk="trackCancelBtn" @click="closeModal">Cancel</Btn>
            <Btn dusk="trackConfirmBtn" primary :loading="loading" :disabled="loading" @click="confirm">Track</Btn>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from '~/components/Btn.vue';
import Modal from '~/components/Modal.vue';
import FormInput from './FormInput.vue';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits(['closed', 'confirm']);

const collectionId = ref();
const loading = ref(false);

const confirm = async () => {
    loading.value = true;
    emit('confirm', collectionId.value);
};

const closeModal = () => {
    collectionId.value = '';
    emit('closed');
};

onMounted(() => {
    collectionId.value = '';
    loading.value = false;
});

watch(
    () => props.isOpen,
    (isOpen) => {
        if (!isOpen) {
            collectionId.value = '';
            loading.value = false;
        }
    }
);
</script>
