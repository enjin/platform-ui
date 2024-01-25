<template>
    <div class="px-4 sm:px-6 lg:px-8 overflow-y-auto transition-all pb-14">
        <div class="mt-4 flow-root">
            <LoadingCircle v-if="loading" class="mt-40" :size="44" />
            <template v-else>
                <div
                    v-if="!appStore.hasValidConfig && appStore.isMultiTenant && !tokens?.length"
                    class="flex flex-col mb-6 w-full transition-all rounded-md bg-[#0284c7] p-3 text-white"
                >
                    <p class="font-bold">Initialization Guide</p>
                    <p>Please complete these steps in order to use the platform:</p>
                    <div>Create an API token</div>
                </div>
                <div class="flex flex-col space-y-8">
                    <div v-if="appStore.isMultiTenant" class="flex flex-col space-y-4">
                        <SettingsApiTokens />
                        <SettingsWalletAccount />
                    </div>
                </div>

                <div class="flex flex-col space-y-4 mt-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl">Settings</h1>
                    </div>
                    <SettingsResetPassword v-if="appStore.isMultiTenant" />
                    <FormCheckbox
                        v-model="advancedMode"
                        name="advancedMode"
                        label="Advanced Mode"
                        description="Enable advanced mode."
                        readmore="Advanced mode"
                    />
                    <Btn v-if="appStore.isMultiTenant" class="mr-auto" @click="logout">Logout</Btn>
                    <Btn v-else class="mr-auto" error @click="resetSettings"> Reset Settings </Btn>
                </div>
            </template>
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
import LoadingCircle from '../LoadingCircle.vue';
import SettingsResetPassword from './SettingsResetPassword.vue';
import SettingsWalletAccount from './SettingsWalletAccount.vue';
import SettingsApiTokens from './SettingsApiTokens.vue';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);
const loading = ref(appStore.user || !appStore.hasMultiTenantPackage ? false : true);

const tokens = computed(() => appStore.user?.apiTokens);

const logout = async () => {
    await appStore.logout();
    router.push({ name: 'platform.auth.login' });
    snackbar.info({ title: 'Logged out' });
};

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

watch(
    () => appStore.user,
    (userVal) => {
        if (userVal) {
            loading.value = false;
        }
    }
);

(() => {
    setTimeout(() => {
        if (loading.value) {
            loading.value = false;
        }
    }, 2000);
})();
</script>
