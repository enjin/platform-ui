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
        <div class="flex flex-col space-y-2 mt-4 relative text-light-content-strong dark:text-dark-content-strong">
            <div v-if="signing">
                <span>
                    <span> Address: </span>
                    <span class="font-bold">
                        {{ addressShortHex(connectionStore.account.address) }}
                    </span>
                </span>
            </div>
            <div class="inline-flex space-x-1">
                <span> Transaction fee: </span>
                <LoadingCircle v-if="loadingApi" :size="20" class="my-auto text-primary" />
                <span v-else class="font-bold animate-fade-in">
                    {{ `${feeCost} ${currencySymbolByNetwork(useAppStore().config.network)}` }}
                </span>
            </div>
            <div v-if="deposit" class="inline-flex space-x-1 !mb-2">
                <span> Deposit fee: </span>
                <span class="font-bold animate-fade-in">
                    {{ `${deposit} ${currencySymbolByNetwork(useAppStore().config.network)}` }}
                </span>
            </div>
            <div v-if="loadingApi" class="py-20 animate-fade-in">
                <LoadingCircle class="my-auto text-primary" :size="42" />
            </div>
            <div v-else-if="!loadingApi && !signing" class="flex flex-col space-y-2 animate-fade-in">
                <div
                    v-for="account in walletAccounts"
                    :key="account.address"
                    class="px-4 py-3 border border-light-stroke-strong dark:border-dark-stroke-strong rounded-md cursor-pointer hover:bg-primary/20 transition-all flex items-center space-x-4 w-full"
                    @click="selectAccount(account)"
                >
                    <Identicon :address="account.address" />
                    <div class="flex flex-col">
                        <span class="font-medium">{{ account.name }} </span>
                        <span class="text-sm">
                            {{ addressShortHex(account.address) }}
                        </span>
                    </div>
                    <div class="!ml-auto">
                        <LoadingCircle v-if="loadingBalance" />
                        <template v-else>
                            <span>{{ formatPriceFromENJ(account.balance)?.toFixed(5) ?? 0 }}&nbsp;</span>
                            <span class="font-bold">{{ currencySymbol }}</span>
                        </template>
                    </div>
                </div>
                <div v-if="!walletAccounts.length" class="text-center">
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
import { addressShortHex, addressToPublicKey } from '~/util/address';
import { useTransactionStore } from '~/store/transaction';
import { computed, ref } from 'vue';
import LoadingCircle from './LoadingCircle.vue';
import snackbar from '~/util/snackbar';
import Identicon from './Identicon.vue';
import { currencySymbolByNetwork, formatPriceFromENJ, formatPriceToENJ } from '~/util';
import { useConnectionStore } from '~/store/connection';
import { useAppStore } from '~/store';
import { TransactionApi } from '~/api/transaction';
import { DTOWalletFactory as DTOFactory } from '~/factory/wallet';

const props = defineProps<{
    transaction: any;
}>();

const emit = defineEmits(['success']);

const isLoading = ref(false);
const showAccountsModal = ref(false);
const feeCost = ref();
const deposit = ref();
const loadingApi = ref(false);
const signing = ref(false);
const loadingBalance = ref(false);

const transactionStore = useTransactionStore();
const connectionStore = useConnectionStore();

const walletAccounts = computed(() => connectionStore.getWalletAccounts().filter((account) => account.enabled));

const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));

const signTransaction = async () => {
    try {
        if (!connectionStore.provider) {
            snackbar.error({
                title: 'You must configure a wallet to sign a transaction, ',
                link: {
                    text: 'Configure Wallet',
                    to: 'platform.user.settings',
                },
            });

            return;
        }
        showAccountsModal.value = true;
        loadingApi.value = true;
        connectionStore.getAccounts();
        await transactionStore.init();
        fetchAccountsBalance();
        feeCost.value = formatPriceFromENJ(props.transaction.fee)?.toFixed(5);
        deposit.value = formatPriceFromENJ(props.transaction.deposit)?.toFixed(5);
        loadingApi.value = false;
    } catch (e) {
        console.log(e);
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

const fetchAccountsBalance = async () => {
    try {
        loadingBalance.value = true;
        const addresses = walletAccounts.value.map((account) => addressToPublicKey(account.address));
        const res = await TransactionApi.getWallets('', addresses);
        let wallets = DTOFactory.forWallets(res);
        wallets = wallets.items.map((wallet) => {
            return {
                account: wallet.account,
                balance: wallet.balances.free,
            };
        });
        connectionStore.setAccountsBalance(wallets);
    } catch {
        snackbar.error({ title: 'Failed to fetch accounts balance' });
    } finally {
        loadingBalance.value = false;
    }
};
</script>
