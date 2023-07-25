<template>
    <div class="text-gray-600">
        {{ appStore.wcSession ? 'Wallet Connected' : 'Wallet Disconnected' }}
    </div>
</template>

<script setup>
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';
import { getAppMetadata } from '@walletconnect/utils';
import { useAppStore } from '~/store';

const appStore = useAppStore();

const walletConnect = new WalletConnectModalSign({
    projectId: 'a4b92f550ab3039f7e084a879882bc96',
    metadata: getAppMetadata(),
    modalOptions: {
        themeMode: 'light',
        explorerRecommendedWalletIds: ['bdc9433ffdaee55d31737d83b931caa1f17e30666f5b8e03eea794bac960eb4a'],
        enableExplorer: true,
        walletImages: {},
        themeVariables: {
            '--wcm-background-color': '#7567CE',
            '--wcm-accent-color': '#7567CE',
            '--wcm-accent-fill-color': '#FFFFFF',
        },
    },
});

let session = await walletConnect.getSession();
const hasValidSession = session && session.acknowledged;

if (hasValidSession) {
    appStore.setWCSession(true);
}
</script>
