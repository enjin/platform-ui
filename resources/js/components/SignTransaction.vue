<template>
    <Btn primary @click="signTransaction()" class="ml-3">
        <LoadingCircle v-if="isLoading" class="h-5 w-5 mx-1 ml-0.5 text-white" />
        <span v-else> Sign </span>
    </Btn>
    <Modal :is-open="showAccountsModal" :close="closeModal" width="max-w-lg">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
            Select Account
        </DialogTitle>
        <div class="flex flex-col space-y-2 mt-4">
            <div
                v-for="account in useAppStore().accounts"
                :key="account.address"
                class="px-4 py-3 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-primary/20 transition-all"
                @click="selectAccount(account)"
            >
                {{ publicKeyToAddress(account.address) }}
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from './Btn.vue';
import Modal from './Modal.vue';
import { publicKeyToAddress } from '~/util/address';
import { useAppStore } from '~/store';
import { ref } from 'vue';
import LoadingCircle from './LoadingCircle.vue';
import snackbar from '~/util/snackbar';

const props = defineProps<{
    transaction: any;
}>();

const isLoading = ref(false);
const showAccountsModal = ref(false);

const signTransaction = async () => {
    useAppStore().getAccounts();
    showAccountsModal.value = true;
};

const closeModal = () => {
    showAccountsModal.value = false;
};

const selectAccount = async (account) => {
    try {
        isLoading.value = true;
        useAppStore().setAccount(account);
        showAccountsModal.value = false;
        await useAppStore().signTransaction(props.transaction);
    } catch (e) {
        snackbar.error({ title: 'Failed to sign transaction' });
    } finally {
        isLoading.value = false;
    }
};
</script>
