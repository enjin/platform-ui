<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="setConsumption"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Set Consumption</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
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
                            required
                        />
                        <FormInput
                            v-model="userId"
                            name="userId"
                            label="User ID"
                            description="The wallet account to be added to the fuel tank."
                        />
                        <FormInput
                            v-model="totalConsumed"
                            name="totalConsumed"
                            label="Total Consumed"
                            description="The total consumption."
                            type="number"
                            required
                        />
                        <FormInput
                            v-model="lastResetBlock"
                            name="lastResetBlock"
                            label="Last Reset Block"
                            description="The last reset block."
                            type="number"
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Set consumption</Btn>
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
import {
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import { useAppStore } from '~/store';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tankId = ref(props.item?.tankId);
const idempotencyKey = ref('');
const ruleSetId = ref();
const userId = ref('');
const totalConsumed = ref();
const lastResetBlock = ref();
const formRef = ref();

const validation = yup.object({
    tankId: stringRequiredSchema,
    ruleSetId: numberRequiredSchema.typeError('Rule Set ID must be a number'),
    userId: stringRequiredSchema,
    totalConsumed: numberRequiredSchema.typeError('Total Consumed must be a number'),
    lastResetBlock: numberNotRequiredSchema.typeError('Last Reset Block must be a number'),
    idempotencyKey: stringNotRequiredSchema,
});

const setConsumption = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.setConsumption(
            formatData({
                tankId: addressToPublicKey(tankId.value ?? ''),
                ruleSetId: ruleSetId.value,
                userId: userId.value,
                totalConsumed: totalConsumed.value,
                lastResetBlock: lastResetBlock.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.SetConsumption?.id;

        if (id) {
            snackbar.success({
                title: 'Fuel Tank consumption',
                text: `Fuel Tank consumption set with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel Tank consumption',
            text: 'Fuel Tank consumption set failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
