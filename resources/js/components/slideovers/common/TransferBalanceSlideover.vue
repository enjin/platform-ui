<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="transfer"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Transfer Balance</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="recipient"
                            name="recipient"
                            label="Recipient"
                            description="The recipient account who is going to receive the transfer."
                            required
                            tooltip="Wallet Address"
                        />
                        <FormInput
                            v-model="amount"
                            name="amount"
                            label="Amount"
                            description="The amount to transfer."
                            type="number"
                            required
                            :prefix="currencySymbol"
                        />
                        <FormInput
                            v-if="useAppStore().advanced"
                            v-model="idempotencyKey"
                            name="idempotencyKey"
                            label="Idempotency Key"
                            description="The idempotency key to set. It is recommended to use a UUID for this."
                            tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                            readmore="Idempotency Key"
                        />
                        <FormCheckbox
                            v-if="useAppStore().advanced"
                            v-model="keepAlive"
                            name="keepAlive"
                            label="Keep Alive"
                            description="If true, the transaction will fail if the balance drops below the minimum requirement. Defaults to False."
                        />
                        <FormCheckbox
                            v-if="useAppStore().advanced"
                            v-model="skipValidation"
                            name="skipValidation"
                            label="Skip validation"
                            description="Skip all validation rules, use with caution. Defaults to false."
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Transfer</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { computed, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import { ApiService } from '~/api';
import snackbar from '~/util/snackbar';
import { currencySymbolByNetwork, formatData, formatPriceToENJ, snackbarErrors } from '~/util';
import { useAppStore } from '~/store';
import {
    addressRequiredSchema,
    booleanNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const isLoading = ref(false);
const recipient = ref('');
const amount = ref('');
const idempotencyKey = ref('');
const keepAlive = ref(false);
const skipValidation = ref(false);
const formRef = ref();

const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));

const validation = yup.object({
    recipient: addressRequiredSchema,
    amount: numberRequiredSchema.typeError('Amount must be a number').min(0),
    idempotencyKey: stringNotRequiredSchema,
    keepALive: booleanNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const transfer = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await ApiService.transferBalance(
            formatData({
                recipient: recipient.value,
                amount: formatPriceToENJ(amount.value) ?? null,
                keepAlive: keepAlive.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.TransferBalance?.id;

        if (id) {
            snackbar.success({
                title: 'Transfer Balance',
                text: `Transfer Balance successfully with transaction id: ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Transfer Balance',
            text: 'Transfer Balance failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
