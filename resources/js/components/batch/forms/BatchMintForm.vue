<template>
    <Form ref="formRef" class="sm:rounded-b-lg" :validation-schema="formValidation">
        <RadioGroupButton
            class="p-6"
            v-model="mintType"
            label="Select Mint type"
            :items="mintTypes"
            :cols="mintTypes.length"
        />
        <FadeTransition>
            <div
                class="bg-light-surface-primary dark:bg-dark-surface-primary rounded-b-lg p-6 pt-0"
                v-if="mintType === 'create'"
            >
                <input v-model="mintType" class="hidden" />
                <div class="space-y-6">
                    <TokenIdInput
                        v-model="createTokenId"
                        name="createTokenId"
                        label="Token ID"
                        description="The token ID to set. This must be unique for this collection."
                        required
                        readmore="Token ID"
                    />
                    <FormInput
                        v-model="imageUrl"
                        name="imageUrl"
                        label="Image URL"
                        class="w-full"
                        description="The URL of the image for the token."
                        required
                    />
                    <FormInput
                        v-model="name"
                        name="name"
                        label="Name"
                        description="The name of the collection."
                        required
                    />
                    <RichTextEditor
                        v-model="description"
                        name="description"
                        label="Description"
                        description="The description of the collection."
                    />
                    <FormInput
                        v-model="account"
                        name="account"
                        label="Recipient"
                        description="The recipient account of the token."
                        required
                    />
                    <div>
                        <label
                            class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong mb-2"
                            >Token type</label
                        >
                        <div class="flex">
                            <div
                                class="flex-1 px-4 py-8 border border-light-stroke-strong dark:border-dark-stroke-strong rounded-l-2xl cursor-pointer transition-all text-light-content-strong dark:text-dark-content-strong"
                                :class="{
                                    'bg-light-surface-brand/30 !border-light-surface-brand': tokenType === 'nft',
                                }"
                                @click="tokenType = 'nft'"
                            >
                                <div class="font-bold text-lg">Non Fungible Token (NFT)</div>
                                <div class="text-xs mt-1">
                                    Verifiably distinct and unique digital items. Recommended for collectibles.
                                </div>
                            </div>
                            <div
                                class="flex-1 px-4 py-8 border border-light-stroke-strong dark:border-dark-stroke-strong rounded-r-2xl cursor-pointer transition-all text-light-content-strong dark:text-dark-content-strong"
                                :class="{
                                    'bg-light-surface-brand/30 !border-light-surface-brand': tokenType === 'ft',
                                }"
                                @click="tokenType = 'ft'"
                            >
                                <div class="font-bold text-lg">Fungible Token (FT)</div>
                                <div class="text-xs mt-1">
                                    Items that can have multiple copies. Recommended for gaming items, trading cards,
                                    etc.
                                </div>
                            </div>
                        </div>
                    </div>
                    <FormInput
                        v-show="tokenType === 'ft'"
                        v-model="initialSupply"
                        name="initialSupply"
                        label="Initial Supply"
                        description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token maximum supply if set."
                        type="number"
                        tooltip="Number of items to be minted when this item is first created. If this is below maximum supply, users can mint more of this item in the future."
                    />
                    <FormInput
                        v-if="tokenType === 'ft'"
                        v-model="capAmount"
                        name="capAmount"
                        label="Maximum Supply"
                        tooltip="Once this limit is reached, minting of additional items will not be allowed."
                        placeholder="Unlimited"
                        type="number"
                    />
                    <div class="flex space-x-4">
                        <FormInput
                            v-model="beneficiaryAddress"
                            name="beneficiaryAddress"
                            label="Beneficiary Address"
                            class="w-full"
                            description="The account that will receive the royalty."
                        />
                        <FormInput
                            v-model="beneficiaryPercentage"
                            name="beneficiaryPercentage"
                            class="w-[100px] !mr-[40px] flex flex-col justify-between"
                            label="Percentage"
                            tooltip="The amount of royalty the beneficiary receives in percentage."
                            type="number"
                            :min="0"
                            prefix="%"
                        />
                    </div>
                    <FormList
                        v-model="attributes"
                        flex
                        label="Attributes"
                        description="Set initial attributes for this token."
                        @add="addAttributeItem"
                        @remove="removeAttributeItem"
                        readmore="Attributes"
                        dusk-id="attributes"
                    >
                        <template #headers>
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Key
                                </label>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">The attribute key.</p>
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
                </div>
            </div>
            <div class="rounded-b-lg p-6 pt-0" v-else>
                <div class="space-y-6">
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
                        v-model="account"
                        name="account"
                        label="Recipient"
                        description="The recipient account of the token."
                        required
                    />
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
import { formatData, formatToken, getMediaTypeFromUrl, parseFormatedTokenId } from '~/util';
import { TokenCapType, TokenIdSelectType } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
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
import RichTextEditor from '~/components/RichTextEditor.vue';

const emit = defineEmits(['update:modelValue', 'validation']);

const props = defineProps<{
    modelValue: MintValuesInterface;
}>();

const mintType = ref(props.modelValue.mintType ?? 'create');
const mintTypes = [
    {
        key: 'btn-create',
        label: 'Create',
        value: 'create',
    },
    {
        key: 'btn-mint',
        label: 'Mint',
        value: 'mint',
    },
];
const formRef: Ref<typeof Form | undefined> = ref();
const account = ref(publicKeyToAddress(props.modelValue.account ?? '') ?? '');
const createTokenId: Ref<TokenIdType> = ref(
    parseFormatedTokenId(props.modelValue.createParams?.tokenId ?? null) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const mintTokenId: Ref<TokenIdType> = ref(
    parseFormatedTokenId(props.modelValue.mintParams?.tokenId ?? null) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const initialSupply = ref(props.modelValue.createParams?.initialSupply ?? 1);
const capAmount = ref(props.modelValue.createParams?.cap?.amount ?? undefined);
const mintAmount = ref(props.modelValue.mintParams?.amount ?? 1);
const isCurrency = ref(props.modelValue.createParams?.behavior?.isCurrency ?? false);
const beneficiaryAddress = ref(props.modelValue.createParams?.behavior?.hasRoyalty?.beneficiary ?? '');
const beneficiaryPercentage = ref(props.modelValue.createParams?.behavior?.hasRoyalty?.percentage ?? 0);
const listingForbidden = ref(props.modelValue.createParams?.listingForbidden ?? false);

const imageUrl = ref('');
const imageType = ref();
const name = ref('');
const description = ref('');
const tokenType = ref('nft');

const validForm = computed(() => formRef.value?.getMeta().valid);

const attributes = ref(
    props.modelValue.createParams?.attributes ?? [
        {
            key: '',
            value: '',
        },
    ]
);

const formValidation = computed(() => (mintType.value === 'create' ? createValidation : mintValidation));

const mintValidation = yup.object({
    account: addressRequiredSchema,
    mintTokenId: stringRequiredSchema,
    mintAmount: numberRequiredSchema.min(1).typeError('Amount must be a number'),
});

const createValidation = yup.object({
    account: addressRequiredSchema,
    createTokenId: stringRequiredSchema,
    initialSupply: numberNotRequiredSchema.typeError('Initial supply must be a number').default(1).min(1),
    name: stringRequiredSchema,
    imageUrl: stringRequiredSchema,
    description: stringNotRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val: string) => val !== '' && val !== null,
        then: () => yup.number().min(0).max(100).typeError('Percentage must be a number').required(),
        otherwise: () => numberNotRequiredSchema.typeError('Percentage must be a number'),
    }),
    listingForbidden: booleanNotRequiredSchema,
    isCurrency: booleanNotRequiredSchema,
});

const simpleAttributes = () => {
    return [
        {
            key: 'name',
            value: name.value,
        },
        {
            key: 'description',
            value: description.value,
        },
        {
            key: 'media',
            value: JSON.stringify([
                {
                    url: imageUrl.value,
                    type: imageType.value,
                },
            ]),
        },
    ].filter((a) => a.value !== '');
};

const hasChanged = computed(() =>
    formatData({
        account: addressToPublicKey(account.value),
        mintType: mintType.value,
        createParams:
            mintType.value === 'create'
                ? {
                      tokenId: formatToken(createTokenId.value),
                      initialSupply: parseInt(initialSupply.value?.toString()),
                      cap: {
                          type:
                              tokenType.value === 'ft'
                                  ? capAmount.value && capAmount.value > 0
                                      ? TokenCapType.SUPPLY
                                      : TokenCapType.INFINITE
                                  : TokenCapType.SINGLE_MINT,
                          amount: capAmount.value ? parseInt(capAmount.value?.toString()) : null,
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
                      attributes: [
                          ...simpleAttributes(),
                          attributes.value.filter((a) => a.key !== '' && a.value !== ''),
                      ],
                  }
                : null,
        mintParams:
            mintType.value === 'mint'
                ? {
                      tokenId: formatToken(mintTokenId.value),
                      amount: parseInt(mintAmount.value.toString()),
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
        await formRef.value?.validate();
        setTimeout(() => {
            emit('validation', validForm.value);
            emit('update:modelValue', hasChanged.value);
        }, 50);
    }
);

watch(
    () => imageUrl.value,
    (imageVal) => {
        if (imageVal) {
            imageType.value = getMediaTypeFromUrl(imageVal);
        } else {
            imageType.value = '';
        }
    }
);
</script>
