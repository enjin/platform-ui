<template>
    <Form ref="formRef" class="sm:rounded-b-lg" :validation-schema="createValidation">
        <RadioGroupButton
            class="p-6"
            v-model="transferType"
            label="Select transfer type"
            :items="transferTypes"
            :cols="transferTypes.length"
        />
        <FadeTransition>
            <div class="bg-white px-4 py-5 sm:p-6" v-if="transferType === 'simple'">
                <input type="hidden" name="transferType" v-model="transferType" />
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Simple Transfer</h3>
                        <p class="mt-1 text-sm text-gray-500">The params to make a simple transfer.</p>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <div class="flex flex-col gap-6">
                            <FormInput
                                v-model="account"
                                name="account"
                                label="Account"
                                description="The recipient account of the token."
                                required
                            />
                            <TokenIdInput
                                v-model="simpleTokenId"
                                name="simpleTokenId"
                                label="Token ID"
                                description="The token ID."
                                required
                                readmore="Token ID"
                            />
                            <FormInput
                                v-model="simpleAmount"
                                name="simpleAmount"
                                label="Amount"
                                description="The amount to transfer."
                                type="number"
                                required
                            />
                            <FormCheckbox
                                v-model="simpleKeepAlive"
                                name="simpleKeepAlive"
                                label="Keep Alive"
                                description="If true, the transaction will fail if the balance drops below the minimum requirement. Defaults to False."
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4 sm:rounded-b-lg py-5 sm:p-6" v-else>
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Operator Transfer</h3>
                        <p class="mt-1 text-sm text-gray-500">
                            The params to make an operator transfer. Operator transfers are transfers that you make
                            using tokens from somebody else's wallet as the source. To make this type of transfer the
                            source wallet owner must approve you for transferring their tokens.
                        </p>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <div class="flex flex-col gap-6">
                            <FormInput
                                v-model="account"
                                name="account"
                                label="Account"
                                description="The recipient account of the token."
                                required
                            />
                            <TokenIdInput
                                v-model="operatorTokenId"
                                name="operatorTokenId"
                                label="Token ID"
                                description="The token ID."
                                required
                                readmore="Token ID"
                            />
                            <FormInput
                                v-model="operatorSource"
                                name="operatorSource"
                                label="Source"
                                description="The source account of the token."
                                required
                            />
                            <FormInput
                                v-model="operatorAmount"
                                name="operatorAmount"
                                label="Amount"
                                description="The amount to transfer."
                                type="number"
                                required
                            />
                            <FormCheckbox
                                v-model="operatorKeepAlive"
                                name="operatorKeepAlive"
                                label="Keep Alive"
                                description="If true, the transaction will fail if the balance drops below the minimum requirement. Defaults to False."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FadeTransition>
    </Form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import { addressToPublicKey, publicKeyToAddress } from '~/util/address';
import { formatData, formatToken, parseFormatedTokenId } from '~/util';
import { TokenIdSelectType } from '~/types/types.enums';
import { TransferValuesInterface } from '~/types/types.interface';
import TokenIdInput from '~/components/TokenIdInput.vue';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import FadeTransition from '~/components/FadeTransition.vue';
import {
    addressRequiredSchema,
    booleanNotRequiredSchema,
    booleanRequiredSchema,
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['update:modelValue', 'validation']);

const props = defineProps<{
    modelValue: TransferValuesInterface;
}>();

const transferType = ref('simple');
const transferTypes = [
    {
        label: 'Simple',
        value: 'simple',
    },
    {
        label: 'Operator',
        value: 'operator',
    },
];
const formRef = ref();
const account = ref(publicKeyToAddress(props.modelValue.account ?? '') ?? '');
const simpleTokenId = ref(
    parseFormatedTokenId(props.modelValue.simpleParams?.tokenId ?? null) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const operatorTokenId = ref(
    parseFormatedTokenId(props.modelValue.operatorParams?.tokenId ?? null) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const simpleAmount = ref(props.modelValue.simpleParams?.amount ?? 1);
const operatorAmount = ref(props.modelValue.operatorParams?.amount ?? 1);
const simpleKeepAlive = ref(props.modelValue.simpleParams?.keepAlive ?? false);
const operatorKeepAlive = ref(props.modelValue.operatorParams?.keepAlive ?? false);
const operatorSource = ref(props.modelValue.operatorParams?.source ?? '');

const validForm = computed(() => formRef.value.getMeta().valid);

const createValidation = yup.object({
    account: addressRequiredSchema,
    transferType: stringNotRequiredSchema,
    simpleTokenId: yup.string().when('transferType', {
        is: 'simple',
        then: () => stringRequiredSchema.typeError('Token ID is required'),
        otherwise: () => stringNotRequiredSchema.typeError('Token ID is required'),
    }),
    simpleAmount: yup.number().when('transferType', {
        is: 'simple',
        then: () => numberRequiredSchema.typeError('Amount must be a number'),
        otherwise: () => numberNotRequiredSchema.typeError('Amount must be a number'),
    }),
    simpleKeepAlive: yup.boolean().when('transferType', {
        is: 'simple',
        then: () => booleanRequiredSchema,
        otherwise: () => booleanNotRequiredSchema,
    }),
    operatorTokenId: yup.string().when('transferType', {
        is: 'operator',
        then: () => stringRequiredSchema.typeError('Token ID is required'),
        otherwise: () => stringNotRequiredSchema.typeError('Token ID is required'),
    }),
    operatorAmount: yup.number().when('transferType', {
        is: 'operator',
        then: () => numberRequiredSchema.typeError('Amount must be a number'),
        otherwise: () => numberNotRequiredSchema.typeError('Amount must be a number'),
    }),
    operatorKeepAlive: yup.boolean().when('transferType', {
        is: 'operator',
        then: () => booleanRequiredSchema,
        otherwise: () => booleanNotRequiredSchema,
    }),
    operatorSource: yup.string().when('transferType', {
        is: 'operator',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
});

const hasChanged = computed(() =>
    formatData({
        account: addressToPublicKey(account.value),
        transferType: transferType.value,
        simpleParams:
            transferType.value === 'simple'
                ? {
                      tokenId: formatToken(simpleTokenId.value),
                      amount: simpleAmount.value,
                      keepAlive: simpleKeepAlive.value,
                  }
                : null,
        operatorParams:
            transferType.value === 'operator'
                ? {
                      tokenId: formatToken(operatorTokenId.value),
                      source: addressToPublicKey(operatorSource.value),
                      amount: operatorAmount.value,
                      keepAlive: operatorKeepAlive.value,
                  }
                : null,
    })
);

watch(
    () => hasChanged.value,
    async () => {
        await formRef.value.validate();
        emit('validation', validForm.value);
        emit('update:modelValue', hasChanged.value);
    }
);
</script>
