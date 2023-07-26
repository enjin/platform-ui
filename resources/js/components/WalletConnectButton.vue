<template>
    <Menu as="div" class="relative">
        <div>
            <MenuButton
                class="flex items-center space-x-2 rounded-md bg-primary py-2 px-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-white transition-all"
            >
                <WalletIcon class="h-6 w-6" />
                <LoadingCircle v-if="loading" class="!text-white" />
                <span v-else>{{ walletSession ? 'Wallet connected' : 'Connect wallet' }}</span>
            </MenuButton>
        </div>
        <ScaleTransition>
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
            >
                <template v-if="!walletSession">
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="connectWallet('wc')"
                        >
                            WalletConnect
                        </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="connectWallet('polkadot.js')"
                        >
                            Polkadot.JS
                        </button>
                    </MenuItem>
                </template>
                <template v-else>
                    <div class="px-4 py-2 text-sm text-center">
                        <Address :address="walletSession.address" short />
                    </div>
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-center transition-all',
                            ]"
                            @click="disconnectWallet"
                        >
                            Disconnect
                        </button>
                    </MenuItem>
                </template>
            </MenuItems>
        </ScaleTransition>
    </Menu>
    <Modal :is-open="showAccountsModal" :close="closeModal" width="max-w-lg">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
            Select Account
        </DialogTitle>
        <div class="flex flex-col space-y-2 mt-4">
            <div
                v-for="account in appStore.accounts"
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
import { WalletIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';
import LoadingCircle from './LoadingCircle.vue';
import { computed, ref } from 'vue';
import { DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import snackbar from '~/util/snackbar';
import Modal from './Modal.vue';
import { publicKeyToAddress } from '~/util/address';
import Address from './Address.vue';
import { hexToU8a } from '@polkadot/util';
import { compact } from 'scale-ts';

const appStore = useAppStore();

const loading = ref(true);
const showAccountsModal = ref(false);

const walletSession = computed(() => appStore.account);

const connectWallet = async (provider: string) => {
    try {
        loading.value = true;
        await appStore.connectWallet(provider);
        if (appStore.accounts) {
            showAccountsModal.value = true;
        }
    } catch {
        snackbar.error({ title: 'Failed to connect wallet' });
    } finally {
        loading.value = false;
    }
};

const getSession = async () => {
    try {
        loading.value = true;
        await appStore.getSession();
    } catch {
        snackbar.error({ title: 'Failed to get session' });
    } finally {
        loading.value = false;
    }
};

const disconnectWallet = async () => {
    loading.value = true;
    await appStore.disconnectWallet();
    loading.value = false;
};

const closeModal = () => {
    showAccountsModal.value = false;
};

const selectAccount = (account) => {
    // I don't think we should select an account as the person can use multiple accounts to sign
    // The account can be determined by the "signingWallet" in the transaction.
    // Unless we are not using that, then we would need a way to select an account indeed
    appStore.setAccount(account);
    showAccountsModal.value = false;
};

function makeTransaction() {
    // This is the call that comes from the platform transactions 'encodedCall'
    const call = '0a03008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48a10f';
    const era = '00'; // 00 is for immortal transactions
    const nonce = 'c8'; // Thats the account nonce
    const tip = '00'; // Tip should always be 00
    const spec = 'c60b0000'; // The spec version of runtime
    const txVersion = '08000000'; // The tx version of runtime
    const genesis = '99ded175d436bee7d751fa3f2f8c7a257ddc063a541f8daa5e6152604f66b2a0'; // The genesis block
    const blockHash = '99ded175d436bee7d751fa3f2f8c7a257ddc063a541f8daa5e6152604f66b2a0'; // For immortal transactions the blockhash needs to be the genesis

    const extra = era + nonce + tip; // This is the extra data that needs to be added in the final extrinsic and in the signing payload
    const addExtra = spec + txVersion + genesis + blockHash; // This is the extra data that needs to be added only in the signing payload
    const payload = call + extra + addExtra; // This is the payload to sign

    const bytes = hexToU8a(payload).byteLength;
    const size = compact.enc(bytes); // This is the compact version of the payload length

    // Send the payload above to the wallet to sign
    // The wallet will return a signature

    // To build the final extrinsic we need to do this

    // extrinsicVersion = 4; // Come from extrinsic.version in metadata
    // Signed transaction
    // extraByte = extrinsicVersion | 128;
    // extraByte = extraByte.toRadixString(16);
    // signerType = '00' // MultiAddress?
    // signatureType = '00';
    // 00 = ed25519
    // 01 = sr25519

    // Error: Call to a member function increment() on null (Line 42 in /var/www/releases/76bbfc0db4eef154ef7054b0ab64ada66143fe43/vendor/enjin/platform-core/src/Services/Processor/Substrate/Events/Implementations/MultiTokens/Transferred.php)

    const finalExtrinsic =
        'size of the extrinsic in compact' + extaByte + signerType + signer + signatureType + signature + extra + call;
    // Send the above to the blockchain
}

(async () => {
    getSession();
})();
</script>
