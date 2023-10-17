<template>
    <div class="px-4 pb-2 sm:px-6 lg:px-8 overflow-y-auto transition-all">
        <div class="mt-4 flow-root">
            <LoadingCircle class="mt-40" :size="44" v-if="loading" />
            <template v-else>
                <div class="flex flex-col space-y-8">
                    <div class="">
                        <h1 class="text-xl md:text-2xl">
                            Wallet Account
                            <span v-if="!appStore.loggedIn && !walletAccount" class="text-red-500">&nbsp;*</span>
                        </h1>
                        <p class="mt-1 text-sm text-gray-500 max-w-3xl">
                            The platform depends on there being a funded wallet daemon account setup and connected to
                            the platform and blockchain so it can receive transactions from the platform, sign them on
                            your behalf and then broadcast them to the network. You can get the latest version of the
                            wallet daemon from this repository:
                            <a href="https://github.com/enjin/wallet-daemon" target="_blank" class="text-primary">
                                https://github.com/enjin/wallet-daemon</a
                            >
                            and an overview can be found here:
                            <a
                                href="https://docs.enjin.io/enjin-platform/wallet-daemon"
                                target="_blank"
                                class="text-primary"
                            >
                                https://docs.enjin.io/enjin-platform/wallet-daemon</a
                            >
                        </p>
                        <div class="flex items-end space-x-4 mt-4">
                            <FormInput
                                v-model="walletAccount"
                                class="sm:w-[300px] flex-1 sm:flex-none"
                                :class="!enableAccountModify ? 'text-gray-400' : ''"
                                name="tokenName"
                                placeholder="Enter wallet account"
                                :disabled="!enableAccountModify"
                            />
                            <Btn
                                v-if="appStore.isMultiTenant"
                                primary
                                class="py-2.5 disabled:!bg-primary"
                                @click="updateWalletAccount"
                                :disabled="updating"
                            >
                                <span v-if="!updating" class="truncate">
                                    {{ enableAccountModify ? 'Update' : 'Update Account' }}
                                </span>
                                <LoadingCircle v-else class="w-4 h-4 text-white" />
                            </Btn>
                        </div>
                    </div>

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
                                primary
                                class="py-2.5 disabled:!bg-primary"
                                @click="createApiToken"
                                :disabled="creating"
                            >
                                <div v-if="!creating" class="flex items-center">
                                    <KeyIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span class="truncate"> Create New API Token </span>
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
                                <Btn error @click="revokeToken(token.name)">Revoke</Btn>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col space-y-4 mt-8">
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
import { AuthApi } from '~/api/auth';
import { addressToPublicKey, isValidAddress, publicKeyToAddress } from '~/util/address';
import LoadingCircle from '../LoadingCircle.vue';

const router = useRouter();
const appStore = useAppStore();

const advancedMode = ref(appStore.advanced);
const tokenName = ref();
const walletAccount = ref(publicKeyToAddress(appStore.user?.account));
const enableTokenCreate = ref(false);
const enableAccountModify = ref(false);
const loading = ref(appStore.user ? false : true);
const creating = ref(false);
const updating = ref(false);

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

const updateWalletAccount = async () => {
    if (!enableAccountModify.value) {
        enableAccountModify.value = true;
    } else {
        if (!walletAccount.value) {
            return snackbar.error({ title: 'Account required', text: 'Please enter a wallet account.' });
        } else if (addressToPublicKey(walletAccount.value) === appStore.user?.account) {
            enableAccountModify.value = false;
            return;
        } else if (!isValidAddress(walletAccount.value)) {
            return snackbar.error({ title: 'Invalid account', text: 'Please enter a valid wallet account.' });
        }
        try {
            updating.value = true;
            const res = await AuthApi.updateUser({ account: walletAccount.value });
            enableAccountModify.value = false;
            if (res.data.UpdateUser) {
                appStore.user.account = walletAccount.value;
                snackbar.info({
                    title: 'Account wallet updated',
                    text: `Your wallet account is set to ${walletAccount.value}`,
                });
            } else {
                throw 'error';
            }
        } catch (e: any) {
            if (snackbarErrors(e)) return;
            snackbar.error({ title: 'Account wallet update failed', text: e.message });
        } finally {
            updating.value = false;
        }
    }
};

const revokeToken = async (name: string) => {
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
    () => appStore.user?.account,
    (newAccount) => {
        if (!newAccount) {
            enableAccountModify.value = true;
        } else {
            walletAccount.value = publicKeyToAddress(appStore.user?.account);
        }

        if (!appStore.user?.apiTokens?.length) {
            enableTokenCreate.value = true;
        }
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
</script>
