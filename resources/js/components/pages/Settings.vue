<template>
    <div class="px-4 sm:px-6 lg:px-8 overflow-y-auto transition-all pb-14 max-w-4xl mx-auto w-full">
        <div class="mt-4 flow-root">
            <LoadingCircle v-if="loading" class="mt-40" :size="44" />
            <template v-else>
                <div
                    v-if="!appStore.hasValidConfig && isMultiTenant && !tokens?.length"
                    class="flex flex-col mb-6 w-full transition-all rounded-md bg-[#0284c7] p-3 text-white"
                >
                    <p class="font-bold">Initialization Guide</p>
                    <p>Please complete these steps in order to use the platform:</p>
                    <div>Create an API token</div>
                </div>
                <div class="flex flex-col space-y-4">
                    <div v-if="isMultiTenant" class="flex flex-col space-y-4">
                        <CollapseCard
                            dusk-id="apiTokensTab"
                            title="Api tokens"
                            :actions="false"
                            :isOpen="!appStore.hasValidConfig"
                        >
                            <div>
                                <SettingsApiTokens />
                            </div>
                        </CollapseCard>
                        <CollapseCard dusk-id="walletTab" title="Wallet Account" :actions="false">
                            <div>
                                <SettingsWalletAccount />
                            </div>
                        </CollapseCard>
                    </div>
                    <CollapseCard dusk-id="linksTab" title="Helpful links" :actions="false">
                        <div>
                            <div class="flex flex-col space-y-4 p-6">
                                <p
                                    v-for="(packg, idx) in appStore.config.packages.filter((p) => p.link)"
                                    :key="idx"
                                    class="truncate text-sm font-medium text-primary hover:text-primary-light"
                                >
                                    <Tooltip :text="packg.version">
                                        <a
                                            :href="packg.link"
                                            target="_blank"
                                            class="cursor-pointer capitalize text-light-content dark:text-dark-content"
                                        >
                                            {{ formatName(packg.name) }}
                                        </a>
                                    </Tooltip>
                                </p>
                            </div>
                        </div>
                    </CollapseCard>
                </div>

                <div class="flex flex-col space-y-4 mt-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl text-light-content-strong dark:text-dark-content-strong">Settings</h1>
                    </div>
                    <SettingsResetPassword v-if="isMultiTenant" />
                    <SettingsChangeEmail v-if="isMultiTenant" />
                    <FormCheckbox
                        v-model="advancedMode"
                        name="advancedMode"
                        label="Advanced Mode"
                        description="Enable advanced mode."
                        readmore="Advanced mode"
                    />
                    <div class="flex space-x-4">
                        <Btn dusk="deleteBtn" v-if="isMultiTenant" @click="confirmModal = true"> Delete account </Btn>
                        <Btn dusk="logoutBtn" v-if="isMultiTenant" class="mr-auto" @click="logout">Logout</Btn>
                        <Btn dusk="resetBtn" v-else class="mr-auto" error @click="resetSettings">Reset Settings</Btn>
                    </div>
                </div>
            </template>
        </div>
        <ConfirmModal
            :is-open="confirmModal"
            title="Delete account"
            description="Your account will be deactivated and will be removed after 14 days, All active Beams or other pending platform actions will be permanently deleted. Do you want to delete your account?"
            @closed="confirmModal = false"
            @confirm="verifyPasswordModal = true"
        />
        <VerifyPasswordModal
            :is-open="verifyPasswordModal"
            @closed="verifyPasswordModal = false"
            @confirm="deleteAccount"
        />
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
import CollapseCard from '../CollapseCard.vue';
import Tooltip from '../Tooltip.vue';
import { AuthApi } from '~/api/auth';
import ConfirmModal from '../ConfirmModal.vue';
import { ApiService } from '~/api';
import SettingsChangeEmail from './SettingsChangeEmail.vue';
import VerifyPasswordModal from './VerifyPasswordModal.vue';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);
const loading = ref(appStore.user || !appStore.hasMultiTenantPackage ? false : true);
const confirmModal = ref(false);
const verifyPasswordModal = ref(false);

const tokens = computed(() => appStore.user?.apiTokens);

const isMultiTenant = computed(() => appStore.isMultiTenant);

const logout = async () => {
    await appStore.logout();
    router.push({ name: 'platform.auth.login' });
    snackbar.info({ title: 'Logged out' });
};

const resetSettings = () => {
    appStore.resetSettings();
    router.push({ name: 'platform.setup' });
};

const formatName = (name: string) => {
    return name.replaceAll('-', ' ');
};

const deleteAccount = async (password) => {
    await AuthApi.deleteAccount(password);
    appStore.clearLogin();
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
