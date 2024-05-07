<template>
    <Btn primary @click="signTransaction" class="px-8" :disabled="isLoading">
        <LoadingCircle v-if="isLoading" class="h-5 w-5 mx-1 ml-0.5 text-white" />
        <span v-else> Sign </span>
    </Btn>
    <Modal :is-open="showAccountsModal" :close="closeModal" width="max-w-lg">
        <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-light-content-strong dark:text-dark-content-strong text-center"
        >
            <span v-if="!signing">Select an account to sign the transaction</span>
            <span v-else>Signing</span>
        </DialogTitle>
        <div class="flex flex-col space-y-2 mt-4 relative">
            <div v-if="signing">
                <span>
                    <span> Address: </span>
                    <span class="font-bold">
                        {{ addressShortHex(connectionStore.account.address) }}
                    </span>
                </span>
            </div>
            <div class="inline-flex space-x-1 mb-2">
                <span> Transaction fee: </span>
                <LoadingCircle v-if="loadingApi" :size="20" class="my-auto text-primary" />
                <span v-else class="font-bold animate-fade-in">
                    {{ `${feeCost} ${currencySymbolByNetwork(useAppStore().config.network)}` }}
                </span>
            </div>
            <div v-if="loadingApi" class="py-20 animate-fade-in">
                <LoadingCircle class="my-auto text-primary" :size="42" />
            </div>
            <div v-else-if="!loadingApi && !signing" class="flex flex-col space-y-2 animate-fade-in">
                <div
                    v-for="account in connectionStore.accounts"
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
                <div v-if="!connectionStore.accounts?.length" class="text-center">
                    <span class="text-sm text-light-content dark:text-dark-content">
                        No accounts found. Please connect your wallet.
                    </span>
                </div>
            </div>
            <div v-else class="py-20">
                <LoadingCircle class="my-auto text-primary" :size="42" />
                <p class="text-center text-lg mt-2">Please sign the transaction in your wallet</p>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from './Btn.vue';
import Modal from './Modal.vue';
import { addressShortHex } from '~/util/address';
import { useTransactionStore } from '~/store/transaction';
import { ref } from 'vue';
import LoadingCircle from './LoadingCircle.vue';
import snackbar from '~/util/snackbar';
import Identicon from './Identicon.vue';
import { currencySymbolByNetwork, formatPriceFromENJ } from '~/util';
import { useConnectionStore } from '~/store/connection';
import { useAppStore } from '~/store';

const props = defineProps<{
    transaction: any;
}>();

const emit = defineEmits(['success']);

const isLoading = ref(false);
const showAccountsModal = ref(false);
const feeCost = ref();
const loadingApi = ref(false);
const signing = ref(false);

const transactionStore = useTransactionStore();
const connectionStore = useConnectionStore();

const signTransaction = async () => {
    try {
        if (!connectionStore.provider) {
            snackbar.error({ title: 'Please connect your wallet to sign' });

            return;
        }
        showAccountsModal.value = true;
        loadingApi.value = true;
        connectionStore.getAccounts();
        await transactionStore.init();
        feeCost.value = formatPriceFromENJ(props.transaction.fee)?.toFixed(5);
        loadingApi.value = false;
    } catch (e) {
        snackbar.error({ title: 'Failed to sign transaction' });
        loadingApi.value = false;
    }
};

const closeModal = () => {
    showAccountsModal.value = false;
};

const selectAccount = async (account) => {
    try {
        isLoading.value = true;
        await connectionStore.setAccount(account);
        signing.value = true;
        const res = await transactionStore.signTransaction(props.transaction);
        if (res) {
            emit('success');
        }
    } catch (e) {
        snackbar.error({ title: 'Failed to sign transaction' });
    } finally {
        isLoading.value = false;
        showAccountsModal.value = false;
        signing.value = false;
    }
};
</script>
