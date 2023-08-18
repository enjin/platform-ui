<template>
    <Btn primary @click="signTransaction" class="px-8" :disabled="isLoading">
        <LoadingCircle v-if="isLoading" class="h-5 w-5 mx-1 ml-0.5 text-white" />
        <span v-else> Sign </span>
    </Btn>
    <Modal :is-open="showAccountsModal" :close="closeModal" width="max-w-lg">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
            Select an account to sign the transaction
        </DialogTitle>
        <div class="flex flex-col space-y-2 mt-4">
            <div>Transaction fee: {{ feeCost }}</div>
            <div
                v-for="account in useAppStore().accounts"
                :key="account.address"
                class="px-4 py-3 border border-gray-300 rounded-md cursor-pointer hover:bg-primary/20 transition-all flex items-center space-x-4"
                @click="selectAccount(account)"
            >
                <Identicon :address="account.address" />
                <div class="flex flex-col">
                    <span class="font-medium">{{ account.name }} </span>
                    <span class="text-sm">
                        {{ addressShortHex(account.address) }}
                    </span>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from './Btn.vue';
import Modal from './Modal.vue';
import { addressShortHex } from '~/util/address';
import { useAppStore } from '~/store';
import { useTransactionStore } from '~/store/transaction';
import { ref } from 'vue';
import LoadingCircle from './LoadingCircle.vue';
import snackbar from '~/util/snackbar';
import Identicon from './Identicon.vue';

const props = defineProps<{
    transaction: any;
}>();

const emit = defineEmits(['success']);

const isLoading = ref(false);
const showAccountsModal = ref(false);
const feeCost = ref(0);

const appStore = useAppStore();
const transactionStore = useTransactionStore();

const signTransaction = async () => {
    try {
        if (!appStore.provider) {
            snackbar.error({ title: 'Please connect your wallet to sign' });
            return;
        }
        appStore.getAccounts();
        await transactionStore.init();
        feeCost.value = await transactionStore.getTransactionCost(props.transaction);
        showAccountsModal.value = true;
    } catch (e) {
        console.log(e)
        snackbar.error({ title: 'Failed to sign transaction' });
    }
};

const closeModal = () => {
    showAccountsModal.value = false;
};

const selectAccount = async (account) => {
    try {
        isLoading.value = true;
        appStore.setAccount(account);
        showAccountsModal.value = false;
        const res = await transactionStore.signTransaction(props.transaction);
        if (res) {
            emit('success');
        }
    } catch (e) {
        snackbar.error({ title: 'Failed to sign transaction' });
    } finally {
        isLoading.value = false;
    }
};
</script>
