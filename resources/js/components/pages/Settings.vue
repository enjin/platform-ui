<template>
    <div class="px-4 sm:px-6 lg:px-8 overflow-y-auto transition-all pb-14 max-w-4xl mx-auto w-full scrollbar-hide">
        <div class="mt-4 flow-root relative">
            <SettingsHelp v-model:help="showHelp" />
            <div class="flex flex-col space-y-4">
                <SettingsWalletApp />
                <SettingsWalletDaemon v-model:help="showHelp" />
            </div>

            <div class="flex flex-col space-y-4 mt-4">
                <div class="flex justify-between">
                    <h1 class="text-xl text-light-content-strong dark:text-dark-content-strong">Settings</h1>
                </div>
                <FormCheckbox
                    v-model="advancedMode"
                    name="advancedMode"
                    label="Advanced Mode"
                    description="Enable advanced mode."
                    readmore="Advanced mode"
                />
                <Btn dusk="resetBtn" class="mr-auto" error @click="resetSettings">Reset Settings</Btn>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import { useRouter } from 'vue-router';
import FormCheckbox from '~/components/FormCheckbox.vue';
import snackbar from '~/util/snackbar';
import SettingsWalletApp from './SettingsWalletApp.vue';
import SettingsWalletDaemon from './SettingsWalletDaemon.vue';
import SettingsHelp from './SettingsHelp.vue';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);

const walletAccount = computed(() => appStore.config.daemon);

const showHelp = ref(!!walletAccount.value);

const resetSettings = () => {
    appStore.resetSettings();
    router.push({ name: 'platform.setup' });
};

watch(
    () => advancedMode.value,
    () => {
        snackbar.info({
            title: 'Advanced mode',
            text: `Advanced mode has been ${advancedMode.value ? 'enabled' : 'disabled'}.`,
        });
        appStore.setAdvancedMode(advancedMode.value);
    }
);
</script>
