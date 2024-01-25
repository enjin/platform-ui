<template>
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
                        shortString(token.plainTextToken?.substring(token.plainTextToken?.indexOf('|') + 1 ?? 0)) ??
                        '*******'
                    }}
                    <CopyTextIcon
                        v-if="token.plainTextToken"
                        :text="token.plainTextToken.substring(token.plainTextToken?.indexOf('|') + 1 ?? 0)"
                    />
                </span>
            </div>
            <Btn :dusk="`btn__revoke-api-${token.name}`" error @click="confirmRevoke(token.name)"> Revoke </Btn>
        </div>
    </div>
    <ConfirmModal
        :is-open="confirmModal"
        title="Revoke API Token"
        description="Do you want to revoke this API token?"
        @closed="confirmModal = false"
        @confirm="revokeToken"
    />
</template>

<script setup lang="ts">
import { KeyIcon } from '@heroicons/vue/24/outline';
import { shortString, snackbarErrors } from '~/util';
import CopyTextIcon from '../CopyTextIcon.vue';
import { computed, ref, watch } from 'vue';
import { useAppStore } from '~/store';
import snackbar from '~/util/snackbar';
import ConfirmModal from '../ConfirmModal.vue';
import LoadingCircle from '../LoadingCircle.vue';
import Btn from '../Btn.vue';
import FormInput from '../FormInput.vue';

const appStore = useAppStore();

const enableTokenCreate = ref(false);
const tokenName = ref();
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
