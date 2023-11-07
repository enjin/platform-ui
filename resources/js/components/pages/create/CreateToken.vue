<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto transition-all">
        <div class="flow-root">
            <div class="mb-4">
                <h1 class="text-2xl">Create Token</h1>
            </div>
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createToken">
                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6 transition-all">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Create Token</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Creates a new token in a collection owned by you, the new token will be automatically
                                minted to the specified recipient account/wallet
                            </p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormSelect
                                    v-model="collectionId"
                                    name="collectionId"
                                    label="Collection ID"
                                    description="The collection ID to mint from."
                                    tooltip="The Collection ID can be retrieved by accessing the details of the request on the transactions page."
                                    placeholder="Select a collection ID"
                                    :options="collectionIds"
                                    required
                                />
                                <TokenIdInput
                                    v-model="tokenId"
                                    label="Token ID"
                                    description="The token ID to set. This must be unique for this collection."
                                    required
                                    readmore="Token ID"
                                />
                                <FormInput
                                    v-model="recipient"
                                    name="recipient"
                                    label="Recipient"
                                    description="The recipient account of the tokens for the initial mint."
                                    required
                                    tooltip="Wallet Address"
                                />
                                <FormInput
                                    v-model="initialSupply"
                                    name="initialSupply"
                                    label="Initial Supply"
                                    description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token cap if set."
                                    type="number"
                                    tooltip="This supply will enter circulation after confirming this create token request."
                                />
                                <FormInput
                                    v-model="unitPrice"
                                    name="unitPrice"
                                    label="Unit Price"
                                    description="Leave as null if you want to keep the same unitPrice. You can also put a value if you want to change the unitPrice. Please note you can only increase it and a deposit to the difference of every token previously minted will also be needed."
                                    type="number"
                                    :prefix="currencySymbol"
                                    required
                                    tooltip="The backing of the token necessary for it to exist in the blockchain, not to be mistaken by the reserve value, once the token is burned, the Unit Price returns to the creator and not the holder."
                                />
                                <FormCheckbox
                                    v-model="listingForbidden"
                                    name="listingForbidden"
                                    label="Listing Forbidden"
                                    description="By checking this field, you are prohibiting this token from being listed in the marketplace."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6 transition-all">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Cap</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                The token cap (if required). A cap of 1 will create this token as a Single Mint type to
                                produce an NFT.
                            </p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormSelect
                                    v-model="capType"
                                    :options="capTypes"
                                    name="capType"
                                    label="Cap Type"
                                    required
                                    tooltip="The type of mint cap for this token. A SINGLE_MINT type means a token can only be minted once, and cannot be re-minted once burned. A SUPPLY type allows you to set a limit on the total number of circulating tokens that can be minted, this type allows for burned tokens to be re-minted even if the supply amount is 1."
                                />
                                <FormInput
                                    v-model="capAmount"
                                    name="capAmount"
                                    label="Cap Amount"
                                    description="The cap amount when using the SUPPLY type."
                                    type="number"
                                    :disabled="capType !== 'SUPPLY'"
                                    :required="capType === 'SUPPLY'"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6 transition-all">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Token Royalty Settings</h3>
                            <p class="mt-1 text-sm text-gray-500">The market behavior for a token.</p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
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
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6 transition-all">
                    <FormList
                        v-model="attributes"
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

                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6 transition-all" v-if="useAppStore().advanced">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Other Options</h3>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormInput
                                    v-model="idempotencyKey"
                                    name="idempotencyKey"
                                    label="Idempotency Key"
                                    description="The idempotency key to set. It is recommended to use a UUID for this."
                                    tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                                    readmore="Idempotency Key"
                                />

                                <FormCheckbox
                                    v-model="skipValidation"
                                    name="skipValidation"
                                    label="Skip validation"
                                    description="Skip all validation rules, use with caution. Defaults to false."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3 justify-end px-4 sm:px-0">
                    <RouterLink
                        :to="{ name: 'platform.collections' }"
                        type="button"
                        class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </RouterLink>
                    <Btn :loading="isLoading" primary is-submit>Create</Btn>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import { addressToPublicKey } from '~/util/address';
import { currencySymbolByNetwork, formatData, formatPriceToENJ, formatToken, snackbarErrors } from '~/util';
import { TokenCapType, TokenIdSelectType } from '~/types/types.enums';
import FormList from '~/components/FormList.vue';
import TokenIdInput from '~/components/TokenIdInput.vue';
import FormSelect from '~/components/FormSelect.vue';
import { useAppStore } from '~/store';
import { TokenApi } from '~/api/token';
import {
    addressRequiredSchema,
    addressNotRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const router = useRouter();
const appStore = useAppStore();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));

const isLoading = ref(false);
const collectionId = ref('');
const recipient = ref();
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const initialSupply = ref(1);
const capType = ref(TokenCapType.SINGLE_MINT);
const capAmount = ref();
const isCurrency = ref(false);
const beneficiaryAddress = ref('');
const beneficiaryPercentage = ref(0);
const listingForbidden = ref(false);
const unitPrice = ref(0.01);
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const attributes = ref([
    {
        key: '',
        value: '',
    },
]);

const capTypes = Object.values(TokenCapType);
const collectionIds = computed(() => appStore.collections);

const validation = yup.object({
    collectionId: collectionIdRequiredSchema,
    tokenId: stringRequiredSchema,
    recipient: addressRequiredSchema,
    initialSupply: numberRequiredSchema.typeError('Initial Supply must be a number').min(1),
    capType: stringRequiredSchema,
    capAmount: yup.number().when('capType', {
        is: TokenCapType.SUPPLY,
        then: () => numberRequiredSchema.typeError('Cap amount must be a number'),
        otherwise: () => numberNotRequiredSchema.typeError('Cap amount must be a number'),
    }),
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().typeError('Percentage must be a number').min(0).max(100).required(),
        otherwise: () => yup.number().nullable().typeError('Percentage must be a number'),
    }),
    listingForbidden: booleanNotRequiredSchema,
    isCurrency: booleanNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const createToken = async () => {
    if (!(await isValid())) return;

    try {
        isLoading.value = true;

        const res = await TokenApi.createToken(
            formatData({
                recipient: addressToPublicKey(recipient.value),
                collectionId: collectionId.value,
                params: {
                    tokenId: formatToken(tokenId.value),
                    initialSupply: initialSupply.value,
                    unitPrice: formatPriceToENJ(unitPrice.value) ?? null,
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
                },
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.CreateToken?.id;

        if (id) {
            snackbar.success({
                title: 'Token created',
                text: `Token created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.tokens' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token create',
            text: 'Token create failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const addAttributeItem = () => {
    attributes.value.push({
        key: '',
        value: '',
    });
};

const removeAttributeItem = (index: number) => {
    attributes.value.splice(index, 1);
};
</script>
