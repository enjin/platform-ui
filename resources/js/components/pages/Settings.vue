<template>
    <div class="px-4 pb-2 sm:px-6 lg:px-8 overflow-y-auto transition-all">
        <div class="mt-4 flow-root">
            <div class="space-y-6">
                <div v-if="appStore.isMultiTenant" class="flex flex-col space-y-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl md:text-2xl">
                            My API Tokens
                            <span v-if="!appStore.hasValidConfig" class="text-red-500">&nbsp;*</span>
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
                        <Btn primary class="py-2.5" @click="createApiToken">
                            <KeyIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                            <span class="truncate"> Create New API Token </span>
                        </Btn>
                    </div>
                    <div
                        class="bg-white p-3 shadow sm:rounded-lg sm:p-4 flex justify-between items-center"
                        v-for="token in tokens"
                        :key="token.name"
                    >
                        <div class="flex items-center">
                            <KeyIcon class="w-5 h-5 mr-4 text-green-500" />
                            <span class="text-gray-900 mr-4">{{ token.name }}</span>
                            <span class="text-gray-400 text-sm mt-1">
                                {{
                                    token.plainTextToken?.substring(token.plainTextToken?.indexOf('|') + 1 ?? 0) ??
                                    '*******'
                                }}
                                <CopyTextIcon
                                    v-if="token.plainTextToken"
                                    :text="token.plainTextToken.substring(token.plainTextToken?.indexOf('|') + 1 ?? 0)"
                                />
                            </span>
                        </div>
                        <Btn error @click="revokeToken(token.name)">Revoke</Btn>
                    </div>
                </div>
                <div v-if="appStore.isMultiTenant" class="flex flex-col space-y-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl md:text-2xl">
                            Wallet Account
                            <span v-if="!appStore.hasValidConfig" class="text-red-500">&nbsp;*</span>
                        </h1>
                    </div>
                    <div class="flex items-end space-x-4">
                        <FormInput
                            v-model="walletAccount"
                            class="sm:w-[300px] flex-1 sm:flex-none"
                            :class="!enableAccountModify ? 'text-gray-400' : ''"
                            name="tokenName"
                            placeholder="Enter wallet account"
                            :disabled="!enableAccountModify"
                            @keyup.enter="updateWalletAccount"
                        />
                        <Btn primary class="py-2.5" @click="updateWalletAccount">
                            <PencilIcon class="w-4 h-4 mr-2" />
                            <span class="truncate">
                                {{ enableAccountModify ? 'Update' : 'Edit' }}
                            </span>
                        </Btn>
                    </div>
                </div>
                <div class="flex flex-col space-y-4">
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
            </div>
        </div>
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
import { snackbarErrors } from '~/util';
import CopyTextIcon from '../CopyTextIcon.vue';
import { PencilIcon } from '@heroicons/vue/20/solid';
import { AuthApi } from '~/api/auth';
import { isValidAddress } from '~/util/address';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);
const tokenName = ref();
const walletAccount = ref(appStore.user?.walletAccount);
const enableTokenCreate = ref(false);
const enableAccountModify = ref(false);

const tokens = computed(() => appStore.user?.apiTokens);

const createApiToken = async () => {
    if (!enableTokenCreate.value) {
        enableTokenCreate.value = true;
    } else {
        if (!tokenName.value)
            return snackbar.error({ title: 'Token name required', text: 'Please enter a token name.' });
        try {
            await appStore.createApiToken(tokenName.value);
            snackbar.info({ title: 'Token generated', text: `Your token ${tokenName.value} has been generated.` });
        } catch (e: any) {
            if (snackbarErrors(e)) return;
            snackbar.error({ title: 'Token generation failed', text: e.message });
        } finally {
            enableTokenCreate.value = false;
        }
    }
};

const updateWalletAccount = async () => {
    if (!enableAccountModify.value) {
        enableAccountModify.value = true;
    } else {
        if (!walletAccount.value) {
            return snackbar.error({ title: 'Account required', text: 'Please enter a wallet account.' });
        } else if (walletAccount.value === appStore.user?.walletAccount) {
            return;
        } else if (!isValidAddress(walletAccount.value)) {
            return snackbar.error({ title: 'Invalid account', text: 'Please enter a valid wallet account.' });
        }
        try {
            await AuthApi.updateUser({ account: walletAccount.value });
            snackbar.info({
                title: 'Account wallet updated',
                text: `Your wallet account is set to ${walletAccount.value}`,
            });
        } catch (e: any) {
            if (snackbarErrors(e)) return;
            snackbar.error({ title: 'Account wallet update failed', text: e.message });
        } finally {
            enableAccountModify.value = false;
        }
    }
};

const revokeToken = async (name) => {
    if (!name) return;
    try {
        await appStore.revokeToken(name);
        snackbar.info({ title: 'Token revoked', text: `Your token ${name} has been revoked.` });
    } catch (e: any) {
        if (snackbarErrors(e)) return;
        snackbar.error({ title: 'Token revocation failed' });
    }
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

(async () => {
    appStore.setBaseSchema();
    if (tokens.value?.length !== 0) {
        enableTokenCreate.value = true;
        enableAccountModify.value = true;
    }
})();

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
