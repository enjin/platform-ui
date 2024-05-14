<template>
    <Form ref="formRef" class="sm:rounded-b-lg" :validation-schema="formValidation">
        <RadioGroupButton
            class="p-6"
            v-model="transferType"
            label="Select transfer type"
            :items="transferTypes"
            :cols="transferTypes.length"
        />
        <input type="hidden" name="transferType" v-model="transferType" />
        <FadeTransition>
            <div class="rounded-b-lg p-6 pt-0" v-if="transferType === 'simple'">
                <div class="space-y-6">
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
                        v-if="useAppStore().advanced"
                        v-model="simpleKeepAlive"
                        name="simpleKeepAlive"
                        label="Keep Alive"
                        description="If true, the transaction will fail if the balance drops below the minimum requirement. Defaults to False."
                    />
                </div>
            </div>
            <div class="rounded-b-lg p-6 pt-0" v-else>
                <div class="space-y-6">
                    <div class="flex items-center">
                        <h3
                            class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                        >
                            Operator Transfer
                        </h3>
                        <Tooltip
                            text="The params to make an operator transfer. Operator transfers are transfers that you make
                            using tokens from somebody else's wallet as the source. To make this type of transfer the
                            source wallet owner must approve you for transferring their tokens."
                        >
                            <QuestionMarkCircleIcon
                                class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                            />
                        </Tooltip>
                    </div>
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
                        v-if="useAppStore().advanced"
                        v-model="operatorKeepAlive"
                        name="operatorKeepAlive"
                        label="Keep Alive"
                        description="If true, the transaction will fail if the balance drops below the minimum requirement. Defaults to False."
                    />
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
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import { useAppStore } from '~/store';
import Tooltip from '~/components/Tooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['update:modelValue', 'validation']);

const props = defineProps<{
    modelValue: TransferValuesInterface;
}>();

const transferType = ref('simple');
const transferTypes = [
    {
        key: 'btn-simple',
        label: 'Simple',
        value: 'simple',
    },
    {
        key: 'btn-operator',
        label: 'Operator',
        value: 'operator',
    },
];
const formRef = ref();
const account = ref(publicKeyToAddress(props.modelValue.account!)!);
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
const operatorSource = ref(props.modelValue.operatorParams?.source!);

const validForm = computed(() => formRef.value.getMeta().valid);

const formValidation = computed(() => (transferType.value === 'simple' ? simpleValidation : operatorValidation));

const operatorValidation = yup.object({
    account: addressRequiredSchema,
    operatorTokenId: stringRequiredSchema.typeError('Token ID is required'),
    operatorAmount: numberRequiredSchema.typeError('Amount must be a number'),
    operatorSource: stringRequiredSchema,
    operatorKeepAlive: booleanNotRequiredSchema,
});

const simpleValidation = yup.object({
    account: addressRequiredSchema,
    transferType: stringNotRequiredSchema,
    simpleTokenId: stringRequiredSchema.typeError('Token ID is required'),
    simpleAmount: numberRequiredSchema.typeError('Amount must be a number'),
    simpleKeepAlive: booleanRequiredSchema,
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
        setTimeout(() => {
            emit('validation', validForm.value);
            emit('update:modelValue', hasChanged.value);
        }, 50);
    }
);
</script>
