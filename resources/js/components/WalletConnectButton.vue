<template>
    <div class="text-gray-600">
        {{ appStore.wcSession ? 'Wallet connected' : 'Connect wallet' }}
    </div>
</template>

<script setup>
import { useAppStore } from '~/store';

const appStore = useAppStore();
const walletConnect = appStore.getWeb3Modal();
const session = await walletConnect.getSession();
const hasValidSession = session && session.acknowledged;

if (hasValidSession) {
    appStore.setWCSession(true);
}
</script>
