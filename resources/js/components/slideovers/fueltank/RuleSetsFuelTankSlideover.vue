<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="formAction"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Rule Sets</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <RadioGroupButton
                    class="px-4 sm:px-6 pt-6 w-full"
                    v-model="actionType"
                    label="Select action type"
                    :items="actions"
                    :cols="actions.length"
                />
                <input v-model="actionType" class="hidden" />
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
                            v-if="actionType === 'removeUserRule'"
                            v-model="userId"
                            name="userId"
                            label="User ID"
                            description="The wallet account."
                            required
                        />
                        <FormInput
                            v-model="ruleSetId"
                            name="ruleSetId"
                            label="Rule Set ID"
                            description="The rule set index."
                            required
                        />
                        <FormSelect
                            v-if="actionType === 'removeUserRule'"
                            v-model="rule"
                            :options="ruleOptions"
                            name="rule"
                            label="Rule"
                            description="The dispatch rule options."
                            required
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
                        <template v-if="actionType === 'add'">
                            <Btn class="!flex" @click="addItem" primary>Add Dispatch Rule</Btn>
                            <div class="flex flex-col space-y-4">
                                <CardToModal
                                    v-for="(item, idx) in dispatchRules"
                                    :key="idx"
                                    class="animate-fade-in"
                                    :title="`Dispatch Rule ${idx + 1}`"
                                >
                                    <template #icon>
                                        <CheckCircleIcon
                                            v-if="item.valid"
                                            class="ml-2 my-auto h-5 w-5 text-green-400"
                                            aria-hidden="true"
                                        />
                                        <XCircleIcon
                                            v-else
                                            class="ml-2 my-auto h-5 w-5 text-red-400"
                                            aria-hidden="true"
                                        />
                                    </template>
                                    <template #actions>
                                        <XMarkIcon class="h-5 w-5 cursor-pointer" @click="removeItem(idx)" />
                                    </template>

                                    <template v-slot="{ close }">
                                        <DispatchRuleForm
                                            v-model="item.values"
                                            @validation="setValidation(idx, $event)"
                                            typeContent="modal"
                                            @close="close"
                                        />
                                    </template>
                                </CardToModal>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4" v-if="actionType !== 'list'">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" primary is-submit>
                {{ actionType === 'add' ? 'Add' : 'Remove' }}
            </Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { Ref, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import { FuelTankApi } from '~/api/fueltank';
import CardToModal from '~/components/CardToModal.vue';
import DispatchRuleForm from '~/components/fueltank/DispatchRuleForm.vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { RuleType } from '~/types/types.enums';
import FormSelect from '~/components/FormSelect.vue';
import { addressToPublicKey } from '~/util/address';
import { DispatchRulesValuesInterface } from '~/types/types.interface';
import { useAppStore } from '~/store';
import { stringNotRequiredSchema, stringRequiredSchema } from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
            ruleSetId: string;
            userId: string;
            rule: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const actionType = ref('add');
const tankId = ref(props.item.tankId);
const idempotencyKey = ref('');
const ruleSetId = ref('');
const formRef = ref();
const dispatchRules: Ref<{ valid: boolean; values: DispatchRulesValuesInterface }[]> = ref([]);
const userId = ref('');
const rule = ref('');

const ruleOptions = Object.values(RuleType);

const actions = ref([
    {
        label: 'Add Rule',
        value: 'add',
    },
    {
        label: 'Remove Rule',
        value: 'removeRule',
    },
    {
        label: 'Remove User Rule',
        value: 'removeUserRule',
    },
]);

const addItem = () => {
    dispatchRules.value.push({
        valid: false,
        values: {},
    });
};

const removeItem = (index: number) => {
    dispatchRules.value.splice(index, 1);
};

const setValidation = (index: number, isValid: boolean) => {
    dispatchRules.value[index].valid = isValid;
};

const validation = yup.object({
    tankId: stringRequiredSchema,
    ruleSetId: stringRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    userId: yup.string().when('actionType', {
        is: 'removeUserRule',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    rule: yup.string().when('actionType', {
        is: 'removeUserRule',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
});

const formAction = () => {
    if (actionType.value === 'add') {
        insertRule();
    } else if (actionType.value === 'removeRule') {
        removeRule();
    } else if (actionType.value === 'removeUserRule') {
        removeUserRule();
    }
};

const insertRule = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const currentAction = actions.value.find((a: any) => a.value === actionType.value);
    if (!currentAction) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.insertRuleSet(
            formatData({
                tankId: addressToPublicKey(tankId.value),
                ruleSetId: ruleSetId.value,
                dispatchRules: dispatchRules.value.map((d) => d.values),
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.InsertRuleSet?.id;

        if (id) {
            snackbar.success({
                title: 'Rule Set added',
                text: `Rule Set added with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Rule Set add',
            text: 'Rule Set add failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const removeRule = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const currentAction = actions.value.find((a: any) => a.value === actionType.value);
    if (!currentAction) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.removeRuleSet(
            formatData({
                tankId: tankId.value,
                ruleSetId: ruleSetId.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.RemoveRuleSet?.id;

        if (id) {
            snackbar.success({
                title: 'Rule Set removed',
                text: `Rule Set removed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Rule Set removal',
            text: 'Rule Set removal failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const removeUserRule = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const currentAction = actions.value.find((a: any) => a.value === actionType.value);
    if (!currentAction) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.removeAccountRuleData(
            formatData({
                tankId: tankId.value,
                userId: userId.value,
                ruleSetId: ruleSetId.value,
                rule: rule.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.RemoveAccountRuleData?.id;

        if (id) {
            snackbar.success({
                title: 'User Rule Data removed',
                text: `User Rule Data removed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'User Rule Data removal',
            text: 'User Rule Data removal failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
