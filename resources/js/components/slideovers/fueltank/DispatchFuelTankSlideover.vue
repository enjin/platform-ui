<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="dispatchFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Dispatch Fuel Tank
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
                            required
                        />
                        <FormSelect
                            :options="callOptions"
                            v-model="call"
                            name="call"
                            label="Call"
                            description="The dispatch call options."
                            required
                        />
                        <FormTextArea
                            v-model="query"
                            name="query"
                            label="Query"
                            description="The GraphQL query. It's required to query the 'id' and 'encodedData' from the result."
                            required
                        />
                        <FormList
                            v-model="variables"
                            label="Variables"
                            description="Query variables."
                            @add="addVariable"
                            @remove="removeVariable"
                            flex
                            dusk-id="variables"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Key
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The attribute key.
                                    </p>
                                </div>
                                <div class="flex-1">
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Value
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The attribute value.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.key"
                                        :dusk="`input__attribute-key-${index + 1}`"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                    />
                                </div>
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.value"
                                        :dusk="`input__attribute-value-${index + 1}`"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                    />
                                </div>
                            </template>
                        </FormList>
                        <FormCheckbox
                            v-model="paysRemainingFee"
                            name="paysRemainingFee"
                            label="Pays Remaining Fee"
                            description="Pays remaining fee flag."
                        />
                        <FormCheckbox
                            v-model="touch"
                            name="touch"
                            label="Create account"
                            description="creates an account for 'origin' if doesn't exist."
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Dispatch</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import { FuelTankApi } from '~/api/fueltank';
import FormSelect from '~/components/FormSelect.vue';
import FormList from '~/components/FormList.vue';
import { formatVariables } from '~/util';
import { addressToPublicKey } from '~/util/address';
import { stringNotRequiredSchema, stringRequiredSchema } from '~/util/schemas';
import FormTextArea from '~/components/FormTextArea.vue';
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
const ruleSetId = ref('');
const paysRemainingFee = ref(false);
const call = ref('');
const query = ref('');
const variables = ref([{ key: '', value: '' }]);
const touch = ref(false);
const idempotencyKey = ref('');
const formRef = ref();

const callOptions = ['MULTI_TOKENS', 'FUEL_TANKS'];

const validation = yup.object({
    tankId: stringRequiredSchema,
    ruleSetId: stringRequiredSchema,
    call: stringRequiredSchema,
    query: stringRequiredSchema,
    variables: yup.array().of(
        yup.object({
            key: stringNotRequiredSchema,
            value: stringNotRequiredSchema,
        })
    ),
    paysRemainingFee: yup.boolean(),
    touch: yup.boolean(),
    idempotencyKey: stringNotRequiredSchema,
});

const addVariable = () => {
    variables.value.push({ key: '', value: '' });
};

const removeVariable = (index: number) => {
    variables.value.splice(index, 1);
};

const dispatchFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.dispatch(
            formatData({
                tankId: addressToPublicKey(tankId.value!),
                ruleSetId: ruleSetId.value,
                dispatch: {
                    call: call.value,
                    query: query.value,
                    variables: formatVariables(variables.value),
                },
                paysRemainingFee: paysRemainingFee.value,
                idempotencyKey: idempotencyKey.value,
            }),
            touch.value
        );

        const id = touch.value ? res.data?.DispatchAndTouch?.id : res.data?.Dispatch?.id;

        if (id) {
            snackbar.success({
                title: 'Fuel Tank dispatch',
                text: `Fuel Tank dispatched with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel Tank dispatch',
            text: 'Fuel Tank dispatch failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
