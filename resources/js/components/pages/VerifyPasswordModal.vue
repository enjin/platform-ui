<template>
    <Modal :is-open="props.isOpen" :close="closeModal">
        <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
        >
            Verify Password
        </DialogTitle>
        <div class="mt-2 space-y-4">
            <p class="text-sm text-light-content dark:text-dark-content">
                Please enter your password to verify your identity.
            </p>
            <FormInput
                v-model="password"
                label="Password"
                placeholder="Password"
                class="flex-1 sm:flex-none text-light-content dark:text-dark-content"
                name="password"
                type="password"
            />
        </div>

        <div class="flex justify-end space-x-4 mt-6">
            <Btn dusk="passwordCancelBtn" @click="closeModal">Cancel</Btn>
            <Btn dusk="passwordConfirmBtn" primary @click="confirm">Confirm</Btn>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from '~/components/Btn.vue';
import Modal from '~/components/Modal.vue';
import FormInput from '../FormInput.vue';
import { onUnmounted, ref } from 'vue';

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits(['closed', 'confirm']);

const password = ref();

const confirm = async () => {
    emit('confirm', password.value);
    closeModal();
};

const closeModal = () => {
    emit('closed');
};

onUnmounted(() => {
    password.value = '';
});
</script>
