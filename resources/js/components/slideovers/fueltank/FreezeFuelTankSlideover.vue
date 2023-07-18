<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="freezeFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Freeze Fuel Tank</h3>
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
                        <FormCheckbox
                            v-model="isFrozen"
                            name="isFrozen"
                            label="Is Frozen"
                            description="The flag for frozen state."
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
            <Btn :loading="isLoading" primary is-submit>Freeze</Btn>
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
import FormCheckbox from '~/components/FormCheckbox.vue';
import { addressToPublicKey } from '~/util/address';
import { useAppStore } from '~/store';
import {
    booleanRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

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
const isFrozen = ref(false);
const ruleSetId = ref();
const idempotencyKey = ref('');
const formRef = ref();

const validation = yup.object({
    tankId: stringRequiredSchema,
    isFrozen: booleanRequiredSchema,
    ruleSetId: numberRequiredSchema.typeError('Rule Set ID must be a number'),
    idempotencyKey: stringNotRequiredSchema,
});

const freezeFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.scheduleMutateFreezeState(
            formatData({
                tankId: addressToPublicKey(tankId.value ?? ''),
                isFrozen: isFrozen.value,
                ruleSetId: ruleSetId.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.ScheduleMutateFreezeState?.id;

        if (id) {
            snackbar.success({
                title: 'Fuel Tank freeze',
                text: `Fuel Tank frozen with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel Tank freeze',
            text: 'Fuel Tank freeze failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
