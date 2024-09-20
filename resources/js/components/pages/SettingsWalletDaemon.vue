<template>
    <CollapseCard dusk-id="walletDaemonTab" title="Daemon Wallet" :actions="false" :isOpen="true">
        <template #icon>
            <div class="ml-2">
                <Tooltip class="!flex items-center" :text="tooltipText">
                    <div v-if="operational" class="rounded-full w-3 h-3 bg-green-400"></div>
                    <div v-else class="rounded-full w-3 h-3 bg-red-500"></div>
                </Tooltip>
            </div>
        </template>
        <div>
            <div class="p-6 text-light-content dark:text-dark-content">
                <div class="flex flex-col space-y-4">
                    <p v-if="!walletAccount" class="text-sm">Daemon Wallet is not configured at the moment</p>
                    <p v-else class="text-sm">Daemon Wallet is configured</p>
                    <label
                        v-if="walletAccount"
                        class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background hover:text-white hover:bg-light-surface-brand text-sm rounded-md mr-auto p-2 cursor-pointer transition-all"
                        name="walletAccount"
                        disabled
                        @click="copyText(walletAccount)"
                    >
                        {{ walletAccount }}
                    </label>
                    <template v-if="isMultiTenant">
                        <p class="text-sm">
                            To configure a new Daemon wallet, you'll need to create an API token. This token will be
                            used to authenticate your Daemon wallet with your Platform account.
                        </p>
                        <div v-if="tokens.length">
                            <span class="text-xl mb-4">My API Tokens</span>
                            <div class="grid grid-cols-1 gap-4">
                                <div
                                    class="bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 p-3 shadow sm:rounded-lg sm:p-4 flex justify-between items-center gr"
                                    v-for="token in tokens"
                                    :key="token.name"
                                >
                                    <div class="flex-1 truncate flex items-center">
                                        <KeyIcon class="w-5 h-5 mr-4 text-green-500" />
                                        <span class="text-light-content-strong dark:text-dark-content-strong mr-4">
                                            {{ token.name }}
                                        </span>
                                        <span class="text-light-content dark:text-dark-content text-sm mt-1 truncate">
                                            <span v-if="!token.plainTextToken">
                                                {{ '*******' }}
                                            </span>
                                            <CopyTextIcon
                                                v-if="token.plainTextToken"
                                                ref="copyIconRef"
                                                class="cursor-pointer flex mr-4"
                                                :text="
                                                    token.plainTextToken.substring(
                                                        token.plainTextToken?.indexOf('|') + 1 ?? 0
                                                    )
                                                "
                                            >
                                                <span class="truncate">
                                                    {{
                                                        token.plainTextToken?.substring(
                                                            token.plainTextToken?.indexOf('|') + 1 ?? 0
                                                        )
                                                    }}
                                                </span>
                                            </CopyTextIcon>
                                        </span>
                                    </div>
                                    <Btn
                                        class="flex-shrink-0"
                                        :dusk="`btn__revoke-api-${token.name}`"
                                        error
                                        @click="confirmRevoke(token.name)"
                                    >
                                        Revoke
                                    </Btn>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-end space-x-4 mb-4">
                            <FormInput
                                v-if="enableTokenCreate"
                                class="sm:w-[300px] flex-1 sm:flex-none"
                                v-model="tokenName"
                                name="tokenName"
                                placeholder="Enter token name"
                            />
                            <Btn
                                dusk="btn__create-api-token"
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
                    </template>
                </div>
            </div>
        </div>
    </CollapseCard>

    <ConfirmModal
        :is-open="confirmModal"
        title="Revoke API Token"
        description="Do you want to revoke this API token?"
        @closed="confirmModal = false"
        @confirm="revokeToken"
    />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import Btn from '../Btn.vue';
import CollapseCard from '../CollapseCard.vue';
import { useAppStore } from '~/store';
import snackbar from '~/util/snackbar';
import { snackbarErrors } from '~/util';
import FormInput from '../FormInput.vue';
import { KeyIcon } from '@heroicons/vue/24/outline';
import LoadingCircle from '../LoadingCircle.vue';
import CopyTextIcon from '../CopyTextIcon.vue';
import ConfirmModal from '../ConfirmModal.vue';
import { publicKeyToAddress } from '~/util/address';
import Tooltip from '../Tooltip.vue';

const appStore = useAppStore();

const creating = ref(false);
const enableTokenCreate = ref(false);
const tokenName = ref();
const confirmModal = ref(false);
const confirmModalName = ref();

const tokens = computed(() => appStore.user?.apiTokens ?? []);

const walletAccount = computed(() =>
    appStore.isMultiTenant ? publicKeyToAddress(appStore.user?.account) : appStore.config.daemon
);
const operational = computed(() => walletAccount.value);
const isMultiTenant = computed(() => appStore.isMultiTenant);
const tooltipText = computed(() => (operational.value ? 'Operational' : 'Not configured'));

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

const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    snackbar.info({ title: 'Copied to clipboard!' });
};

watch(
    () => appStore.user,
    (userVal) => {
        if (userVal) {
            if (!appStore.user?.apiTokens?.length) {
                enableTokenCreate.value = true;
            }
        }
    }
);
</script>
