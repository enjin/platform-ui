<template>
    <div v-if="walletAccount" class="p-6">
        <h1 class="text-xl text-light-content-strong dark:text-dark-content-strong">Wallet Account</h1>
        <p class="mt-1 text-sm text-light-content dark:text-dark-content max-w-3xl">
            The platform depends on there being a funded wallet daemon account setup and connected to the platform and
            blockchain so it can receive transactions from the platform, sign them on your behalf and then broadcast
            them to the network. You can get the latest version of the wallet daemon from this repository:
            <a href="https://github.com/enjin/wallet-daemon" target="_blank" class="text-primary">
                https://github.com/enjin/wallet-daemon</a
            >
            and an overview can be found here:
            <a href="https://docs.enjin.io/enjin-platform/wallet-daemon" target="_blank" class="text-primary">
                https://docs.enjin.io/enjin-platform/wallet-daemon</a
            >
        </p>
        <div class="flex items-end space-x-4 mt-4">
            <FormInput
                v-model="walletAccount"
                class="sm:w-[430px] flex-1 sm:flex-none text-light-content dark:text-dark-content"
                name="walletAccount"
                disabled
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '~/store';
import { publicKeyToAddress } from '~/util/address';
import FormInput from '../FormInput.vue';

const appStore = useAppStore();

const walletAccount = computed(() => publicKeyToAddress(appStore.user?.account || appStore.config.daemon));
</script>
