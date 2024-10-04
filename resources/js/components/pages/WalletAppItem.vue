<template>
    <div
        class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background text-sm rounded-md p-2 cursor-pointer transition-all w-full flex justify-between items-center"
        name="walletAccount"
        disabled
    >
        <span @click="copyText(account)">
            {{ account }}
        </span>

        <Btn
            class="!bg-opacity-90 text-white"
            :class="{
                '!bg-green-500': !props.enabled,
                '!bg-red-500': props.enabled,
            }"
            @click.prevent="enableAccount"
        >
            {{ props.enabled ? 'Disconnect' : 'Connect' }}
        </Btn>
    </div>
</template>

<script lang="ts" setup>
import snackbar from '~/util/snackbar';
import Btn from '../Btn.vue';
import { useConnectionStore } from '~/store/connection';

const props = defineProps<{
    account: string;
    enabled: boolean;
}>();

const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    snackbar.info({ title: 'Copied to clipboard!' });
};

const enableAccount = () => {
    useConnectionStore().enableWalletAccount(props.account);
    snackbar.success({ title: !props.enabled ? 'Wallet account enabled.' : 'Wallet account disabled.' });
};
</script>
