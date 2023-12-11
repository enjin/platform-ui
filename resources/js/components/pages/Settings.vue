<template>
    <div class="px-4 pb-2 sm:px-6 lg:px-8 overflow-y-auto transition-all">
        <div class="mt-4 flow-root">
            <LoadingCircle class="mt-40" :size="44" v-if="loading" />
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
                        <div class="flex justify-between">
                            <h1 class="text-xl">
                                My API Tokens
                                <span v-if="enableTokenCreate && !tokens?.length" class="text-red-500">&nbsp;*</span>
                            </h1>
                        </div>
                        <div class="flex items-end space-x-4">
                            <FormInput
                                v-if="enableTokenCreate"
                                class="sm:w-[300px] flex-1 sm:flex-none"
                                v-model="tokenName"
                                name="tokenName"
                                placeholder="Enter token name"
                            />
                            <Btn
                                id="create-api-token-button"
                                primary
                                class="py-2.5 disabled:!bg-primary"
                                @click="createApiToken"
                                :disabled="creating"
                            >
                                <div v-if="!creating" class="flex items-center">
                                    <KeyIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span class="truncate"> Create API Token </span>
                                </div>
                                <LoadingCircle v-else class="w-4 h-4 text-white" />
                            </Btn>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                class="bg-white p-3 shadow sm:rounded-lg sm:p-4 flex justify-between items-center gr"
                                v-for="token in tokens"
                                :key="token.name"
                            >
                                <div class="flex items-center">
                                    <KeyIcon class="w-5 h-5 mr-4 text-green-500" />
                                    <span class="text-gray-900 mr-4">{{ token.name }}</span>
                                    <span class="text-gray-400 text-sm mt-1">
                                        {{
                                            shortString(
                                                token.plainTextToken?.substring(
                                                    token.plainTextToken?.indexOf('|') + 1 ?? 0
                                                )
                                            ) ?? '*******'
                                        }}
                                        <CopyTextIcon
                                            v-if="token.plainTextToken"
                                            :text="
                                                token.plainTextToken.substring(
                                                    token.plainTextToken?.indexOf('|') + 1 ?? 0
                                                )
                                            "
                                        />
                                    </span>
                                </div>
                                <Btn :id="`revoke-api-button__${token.name}`" error @click="confirmRevoke(token.name)">
                                    Revoke
                                </Btn>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col space-y-4 mt-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl md:text-2xl">Settings</h1>
                    </div>
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
        <ConfirmModal
            :is-open="confirmModal"
            title="Revoke API Token"
            description="Do you want to revoke this API token?"
            @closed="confirmModal = false"
            @confirm="revokeToken"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import { KeyIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import FormCheckbox from '~/components/FormCheckbox.vue';
import snackbar from '~/util/snackbar';
import FormInput from '../FormInput.vue';
import { shortString, snackbarErrors } from '~/util';
import CopyTextIcon from '../CopyTextIcon.vue';
import LoadingCircle from '../LoadingCircle.vue';
import ConfirmModal from '../ConfirmModal.vue';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);
const tokenName = ref();
const enableTokenCreate = ref(false);
const loading = ref(appStore.user || !appStore.hasMultiTenantPackage ? false : true);
const creating = ref(false);
const confirmModal = ref(false);
const confirmModalName = ref();

const tokens = computed(() => appStore.user?.apiTokens);

const createApiToken = async () => {
    if (!enableTokenCreate.value) {
        enableTokenCreate.value = true;
    } else {
        if (!tokenName.value)
            return snackbar.error({ title: 'Token name required', text: 'Please enter a token name.' });
        try {
            creating.value = true;
            await appStore.createApiToken(tokenName.value);
            enableTokenCreate.value = false;
            tokenName.value = '';
            snackbar.info({ title: 'Token generated', text: `Your token ${tokenName.value} has been generated.` });
        } catch (e: any) {
            if (snackbarErrors(e)) return;
            snackbar.error({ title: 'Token generation failed', text: e.message });
        } finally {
            creating.value = false;
        }
    }
};

const revokeToken = async () => {
    if (!confirmModalName.value) return;

    try {
        await appStore.revokeToken(confirmModalName.value);
        snackbar.info({ title: 'Token revoked', text: `Your token ${confirmModalName.value} has been revoked.` });
        confirmModalName.value = null;
    } catch (e: any) {
        if (snackbarErrors(e)) return;
        snackbar.error({ title: 'Token revocation failed' });
    } finally {
        confirmModal.value = false;
        confirmModalName.value = null;
    }
};

const confirmRevoke = (name: string) => {
    confirmModal.value = true;
    confirmModalName.value = name;
};

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
            if (!appStore.user?.apiTokens?.length) {
                enableTokenCreate.value = true;
            }
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
