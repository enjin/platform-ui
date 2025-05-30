<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="freezeFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            {{ props.item?.isFrozen ? 'Thaw' : 'Freeze' }} Fuel Tank
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="tankId"
                            name="tankId"
                            label="Tank ID"
                            description="The wallet address of the fuel tank."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="ruleSetId"
                            name="ruleSetId"
                            label="Rule Set ID"
                            description="The rule set index."
                            type="number"
                        />
                        <FormInput
                            v-if="useAppStore().advanced"
                            v-model="signingAccount"
                            name="signingAccount"
                            label="Signing Account"
                            description="The wallet used to sign and broadcast the transaction. By default, this is the wallet daemon."
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
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Confirm</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import { FuelTankApi } from '~/api/fueltank';
import { addressToPublicKey } from '~/util/address';
import { useAppStore } from '~/store';
import { numberNotRequiredSchema, stringNotRequiredSchema, stringRequiredSchema } from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
            isFrozen: boolean;
            ruleSetId: number;
            idempotencyKey: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tankId = ref(props.item?.tankId);
const isFrozen = ref(props.item?.isFrozen ?? false);
const ruleSetId = ref();
const idempotencyKey = ref('');
const formRef = ref();
const signingAccount = ref('');

const validation = yup.object({
    tankId: stringRequiredSchema,
    ruleSetId: numberNotRequiredSchema.typeError('Rule Set ID must be a number'),
    idempotencyKey: stringNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const freezeFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await FuelTankApi.scheduleMutateFreezeState(
            formatData({
                tankId: addressToPublicKey(tankId.value!),
                isFrozen: !isFrozen.value,
                ruleSetId: ruleSetId.value,
                idempotencyKey: idempotencyKey.value,
                signingAccount: signingAccount.value,
            })
        );

        const id = res.data?.ScheduleMutateFreezeState?.id;

        if (id) {
            snackbar.success({
                title: `Fuel Tank ${props.item?.isFrozen ? 'Thaw' : 'Freeze'} `,
                text: `Fuel Tank ${props.item?.isFrozen ? 'Thaw' : 'Freeze'} with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: `Fuel Tank ${props.item?.isFrozen ? 'Thaw' : 'Freeze'}`,
            text: `Fuel Tank ${props.item?.isFrozen ? 'Thaw' : 'Freeze'} failed`,
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
