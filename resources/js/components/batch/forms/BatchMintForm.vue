<template>
    <Form ref="formRef" class="sm:rounded-b-lg" :validation-schema="createValidation">
        <RadioGroupButton
            class="p-6"
            v-model="mintType"
            label="Select Mint type"
            :items="mintTypes"
            :cols="mintTypes.length"
        />
        <FadeTransition>
            <div class="bg-white px-4 py-5 sm:p-6" v-if="mintType === 'create'">
                <input v-model="mintType" class="hidden" />
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Create Token</h3>
                        <p class="mt-1 text-sm text-gray-500">The params to create a token.</p>
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
                                v-model="createTokenId"
                                name="createTokenId"
                                label="Token ID"
                                description="The token ID to set. This must be unique for this collection."
                                required
                                readmore="Token ID"
                            />
                            <FormInput
                                v-model="initialSupply"
                                name="initialSupply"
                                label="Initial Supply"
                                description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token cap if set."
                                type="number"
                            />
                            <FormInput
                                v-model="createUnitPrice"
                                name="createUnitPrice"
                                label="Unit Price"
                                description="Leave as null if you want to keep the same unitPrice. You can also put a value if you want to change the unitPrice. Please note you can only increase it and a deposit to the difference of every token previously minted will also be needed."
                                type="number"
                                :prefix="currencySymbol"
                                required
                            />
                            <FormSelect
                                v-model="capType"
                                :options="capTypes"
                                name="capType"
                                label="Cap Type"
                                description="The type of mint cap for this token. A SINGLE_MINT type means a token can only be minted once, and cannot be re-minted once burned. A SUPPLY type allows you to set a limit on the total number of circulating tokens that can be minted, this type allows for burned tokens to be re-minted even if the supply amount is 1."
                                required
                            />
                            <FormInput
                                v-model="capAmount"
                                name="capAmount"
                                label="Cap Amount"
                                description="The cap amount when using the SUPPLY type."
                                type="number"
                                :disabled="capType !== 'SUPPLY'"
                            />
                            <FormInput
                                v-model="beneficiaryAddress"
                                name="beneficiaryAddress"
                                label="Beneficiary"
                                description="The account that will receive the royalty."
                            />
                            <FormInput
                                v-model="beneficiaryPercentage"
                                name="beneficiaryPercentage"
                                label="Percentage"
                                description="The amount of royalty the beneficiary receives in percentage."
                                type="number"
                                :min="0"
                                prefix="%"
                            />
                            <FormCheckbox
                                v-model="isCurrency"
                                name="isCurrency"
                                label="Is Currency"
                                description="If the token is a currency."
                            />
                            <FormCheckbox
                                v-model="listingForbidden"
                                name="listingForbidden"
                                label="Listing Forbidden"
                                description="If the token can be listed in the marketplace."
                            />
                            <FormList
                                v-model="attributes"
                                flex
                                label="Attributes"
                                description="Set initial attributes for this token."
                                @add="addAttributeItem"
                                @remove="removeAttributeItem"
                                readmore="Attributes"
                            >
                                <template #headers>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium leading-6 text-gray-900"> Key </label>
                                        <p class="mt-1 text-sm text-gray-500">The attribute key.</p>
                                    </div>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium leading-6 text-gray-900"> Value </label>
                                        <p class="mt-1 text-sm text-gray-500">The attribute value.</p>
                                    </div>
                                    <div class="w-5"></div>
                                </template>
                                <template #inputs="{ inputs }">
                                    <div class="flex-1">
                                        <input
                                            v-model="inputs.key"
                                            type="text"
                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div class="flex-1">
                                        <input
                                            v-model="inputs.value"
                                            type="text"
                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </template>
                            </FormList>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4 sm:rounded-b-lg py-5 sm:p-6" v-else>
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Mint Token</h3>
                        <p class="mt-1 text-sm text-gray-500">The params to mint a token.</p>
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
                                v-model="mintTokenId"
                                name="mintTokenId"
                                label="Token ID"
                                description="The token ID to set. This must be unique for this collection."
                                required
                                readmore="Token ID"
                            />
                            <FormInput
                                v-model="mintAmount"
                                name="mintAmount"
                                label="Amount"
                                description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token cap if set."
                                type="number"
                                required
                            />
                            <FormInput
                                v-model="mintUnitPrice"
                                name="mintUnitPrice"
                                label="Unit Price"
                                description="Leave as null if you want to keep the same unitPrice. You can also put a value if you want to change the unitPrice. Please note you can only increase it and a deposit to the difference of every token previously minted will also be needed."
                                type="number"
                                :prefix="currencySymbol"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FadeTransition>
    </Form>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import { addressToPublicKey, publicKeyToAddress } from '~/util/address';
import {
    currencySymbolByNetwork,
    formatData,
    formatPriceFromENJ,
    formatPriceToENJ,
    formatToken,
    parseFormatedTokenId,
} from '~/util';
import { TokenCapType, TokenIdSelectType } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import FormSelect from '~/components/FormSelect.vue';
import FormList from '~/components/FormList.vue';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import FadeTransition from '~/components/FadeTransition.vue';
import { MintValuesInterface, TokenIdType } from '~/types/types.interface';
import {
    addressRequiredSchema,
    addressNotRequiredSchema,
    booleanNotRequiredSchema,
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import { useAppStore } from '~/store';

const emit = defineEmits(['update:modelValue', 'validation']);

const props = defineProps<{
    modelValue: MintValuesInterface;
}>();

const appStore = useAppStore();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));

const mintType = ref(props.modelValue.mintType ?? 'create');
const mintTypes = [
    {
        label: 'Create',
        value: 'create',
    },
    {
        label: 'Mint',
        value: 'mint',
    },
];
const formRef = ref();
const account = ref(publicKeyToAddress(props.modelValue.account ?? appStore.user?.account) ?? '');
const createTokenId: Ref<TokenIdType> = ref(
    parseFormatedTokenId(props.modelValue.createParams?.tokenId ?? {}) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const mintTokenId: Ref<TokenIdType> = ref(
    parseFormatedTokenId(props.modelValue.mintParams?.tokenId ?? {}) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const initialSupply = ref(props.modelValue.createParams?.initialSupply ?? 1);
const capType = ref(props.modelValue.createParams?.cap?.type ?? TokenCapType.SINGLE_MINT);
const capAmount = ref(props.modelValue.createParams?.cap?.amount ?? undefined);
const mintAmount = ref(props.modelValue.mintParams?.amount ?? 1);
const isCurrency = ref(props.modelValue.createParams?.behavior?.isCurrency ?? false);
const beneficiaryAddress = ref(props.modelValue.createParams?.behavior?.hasRoyalty?.beneficiary ?? '');
const beneficiaryPercentage = ref(props.modelValue.createParams?.behavior?.hasRoyalty?.percentage ?? 0);
const listingForbidden = ref(props.modelValue.createParams?.listingForbidden ?? false);
const createUnitPrice = ref(formatPriceFromENJ(props.modelValue.createParams?.unitPrice) ?? 0.01);
const mintUnitPrice = ref(formatPriceFromENJ(props.modelValue.mintParams?.unitPrice) ?? 0.01);

const capTypes = Object.values(TokenCapType);

const validForm = computed(() => formRef.value.getMeta().valid);

const attributes = ref(
    props.modelValue.createParams?.attributes ?? [
        {
            key: '',
            value: '',
        },
    ]
);

const createValidation = yup.object({
    account: addressRequiredSchema,
    mintType: stringNotRequiredSchema,
    mintTokenId: yup.string().when('mintType', {
        is: 'mint',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    mintUnitPrice: yup.number().when('mintType', {
        is: 'mint',
        then: () => numberRequiredSchema.min(0.01).typeError('Unit price must be a number'),
        otherwise: () => numberNotRequiredSchema,
    }),
    mintAmount: yup.number().when('mintType', {
        is: 'mint',
        then: () => numberRequiredSchema.min(1).typeError('Amount must be a number'),
        otherwise: () => numberNotRequiredSchema.typeError('Amount must be a number'),
    }),
    createTokenId: yup.string().when('mintType', {
        is: 'create',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    createUnitPrice: yup.number().when('mintType', {
        is: 'create',
        then: () => numberRequiredSchema.min(0.01).typeError('Unit price must be a number'),
        otherwise: () => numberNotRequiredSchema,
    }),
    initialSupply: yup.number().typeError('Initial Supply must be a number').default(1).min(1),
    capType: yup.string().when('mintType', {
        is: 'create',
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    capAmount: yup.number().when('capType', {
        is: TokenCapType.SUPPLY,
        then: () => numberRequiredSchema.typeError('Amount must be number'),
        otherwise: () => numberNotRequiredSchema,
    }),
    beneficiaryAddress: yup.string().when('mintType', {
        is: 'create',
        then: () => addressNotRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    beneficiaryPercentage: yup.number().when('mintType', {
        is: 'create',
        then: () =>
            yup.number().when('beneficiaryAddress', {
                is: (val: string) => val !== '' && val !== null,
                then: () => yup.number().min(0).max(100).typeError('Percentage must be a number').required(),
                otherwise: () => numberNotRequiredSchema.typeError('Percentage must be a number'),
            }),
    }),
    listingForbidden: booleanNotRequiredSchema,
    isCurrency: booleanNotRequiredSchema,
});

const hasChanged = computed(() =>
    formatData({
        account: addressToPublicKey(account.value),
        mintType: mintType.value,
        createParams:
            mintType.value === 'create'
                ? {
                      tokenId: formatToken(createTokenId.value),
                      unitPrice: formatPriceToENJ(createUnitPrice.value) ?? null,
                      initialSupply: initialSupply.value,
                      cap: {
                          type: capType.value,
                          amount: capAmount.value,
                      },
                      behavior: {
                          hasRoyalty:
                              beneficiaryAddress.value !== ''
                                  ? {
                                        beneficiary: addressToPublicKey(beneficiaryAddress.value),
                                        percentage: parseFloat(beneficiaryPercentage.value.toString()),
                                    }
                                  : null,
                          isCurrency: isCurrency.value,
                      },
                      listingForbidden: listingForbidden.value,
                      attributes: attributes.value.filter((a) => a.key !== '' && a.value !== ''),
                  }
                : null,
        mintParams:
            mintType.value === 'mint'
                ? {
                      tokenId: formatToken(mintTokenId.value),
                      amount: mintAmount.value,
                      unitPrice: formatPriceToENJ(mintUnitPrice.value) ?? null,
                  }
                : null,
    })
);

const addAttributeItem = () => {
    attributes.value.push({
        key: '',
        value: '',
    });
};

const removeAttributeItem = (index: number) => {
    attributes.value.splice(index, 1);
};

watch(
    () => hasChanged.value,
    async () => {
        await formRef.value.validate();
        emit('validation', validForm);
        emit('update:modelValue', hasChanged.value);
    }
);
</script>
