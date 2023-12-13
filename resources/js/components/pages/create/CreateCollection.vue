<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto transition-all">
        <div class="flow-root">
            <div class="mb-4">
                <h1 class="text-xl md:text-2xl">Create Collection</h1>
            </div>
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createCollection">
                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Mint Policy</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                This section determines the rules pertaining to token supply and amount of tokens
                                available to be minted on future interactions with this collection.
                            </p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormInput
                                    v-model="maxTokenCount"
                                    name="maxTokenCount"
                                    label="Max Token Count"
                                    description="The maximum number of individual tokens that can be created and exist for this collection."
                                    type="number"
                                    :disabled="isInfiniteCount"
                                />
                                <FormCheckbox
                                    v-model="isInfiniteCount"
                                    name="infiniteCount"
                                    label="Infinite Count"
                                    description="Use this option if you would like the collection to support an infinite amount of tokens."
                                />
                                <FormInput
                                    v-model="maxTokenSupply"
                                    name="maxTokenSupply"
                                    label="Max Token Supply"
                                    description="Absolute maximum supply for each token in this collection. Set to 1 for all tokens to be unique NFTs with a max supply of 1, all tokens that have a supply of more than 1 should be treated as fungible tokens (FTs)."
                                    type="number"
                                    :disabled="isInfiniteSupply"
                                />
                                <FormCheckbox
                                    v-model="isInfiniteSupply"
                                    name="infiniteSupply"
                                    label="Infinite Supply"
                                    description="With this option selected tokens in this collection will have an infinite supply."
                                />
                                <FormCheckbox
                                    v-model="forceSingleMint"
                                    name="forceSingleMint"
                                    label="Force Single Mint"
                                    description="Set whether the tokens in this collection will be minted as SingleMint
                                            types. This would indicate the tokens in this collection are NFTs."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg transition-all sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Market Policy</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                This section determines the rules which tokens and collections must follow when
                                interacting with Marketplace on the blockchain.
                            </p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormInput
                                    v-model="beneficiaryAddress"
                                    name="beneficiaryAddress"
                                    label="Royalty Beneficiary"
                                    description="Account receiving the royalties from Marketplace interactions."
                                />

                                <FormInput
                                    v-model="beneficiaryPercentage"
                                    name="beneficiaryPercentage"
                                    label="Royalty Percentage"
                                    description="The percentage of royalties the beneficiary will receive from Marketplace interactions."
                                    type="number"
                                    :min="0"
                                    prefix="%"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg transition-all sm:p-6">
                    <FormList
                        v-model="explicitRoyaltyCurrencies"
                        label="Explicit Royalty Currencies (optional)"
                        description="Set the royalty currencies for the tokens related to this collection and its marketplace interactions"
                        @add="addExplicitRoyaltyCurrencyItem"
                        @remove="removeExplicitRoyaltyCurrencyItem"
                        tooltip="Token must be a currency"
                        readmore="Explicit Royalty Currencies"
                        flex
                        dusk-id="royalty"
                    >
                        <template #headers>
                            <div class="flex-1">
                                <label class="block text-sm font-medium leading-6 text-gray-900"> Collection ID </label>
                                <p class="mt-1 text-sm text-gray-500">
                                    Collection ID of the token that will be included as part of the royalty policy
                                </p>
                            </div>
                            <div class="flex-1">
                                <label class="block text-sm font-medium leading-6 text-gray-900"> Token ID </label>
                                <p class="mt-1 text-sm text-gray-500">
                                    Token ID that will be included as part of the royalty policy.
                                    <ReadMoreButton readmore="Token ID" dusk="tokenId" />
                                </p>
                            </div>
                            <div class="w-5"></div>
                        </template>
                        <template #inputs="{ inputs, index }">
                            <div class="flex-1">
                                <FormInput
                                    v-model="inputs.collectionId"
                                    type="number"
                                    :name="`collection-${index + 1}`"
                                    :dusk="`input__collection-id-${index + 1}`"
                                />
                            </div>
                            <div class="flex-1">
                                <TokenIdInput
                                    v-model="inputs.tokenId"
                                    :dusk="`input_token-id-${index + 1}`"
                                    :name="`input_token-id-${index + 1}`"
                                />
                            </div>
                        </template>
                    </FormList>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg transition-all sm:p-6">
                    <FormList
                        v-model="attributes"
                        label="Attributes"
                        description="Set initial attributes for this collection."
                        @add="addAttributeItem"
                        @remove="removeAttributeItem"
                        readmore="Attributes"
                        flex
                        dusk-id="attributes"
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
                        <template #inputs="{ inputs, index }">
                            <div class="flex-1">
                                <input
                                    v-model="inputs.key"
                                    :dusk="`input__attribute-key-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div class="flex-1">
                                <input
                                    v-model="inputs.value"
                                    :dusk="`input__attribute-value-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                        </template>
                    </FormList>
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg transition-all sm:p-6" v-if="useAppStore().advanced">
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

                <div class="flex space-x-3 justify-end">
                    <RouterLink
                        :to="{ name: 'platform.collections' }"
                        type="button"
                        class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </RouterLink>
                    <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import FormList from '~/components/FormList.vue';
import { addressToPublicKey } from '~/util/address';
import { formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { useAppStore } from '~/store';
import { CollectionApi } from '~/api/collection';
import ReadMoreButton from '~/components/ReadMoreButton.vue';
import { addressNotRequiredSchema, booleanNotRequiredSchema, numberNotRequiredSchema } from '~/util/schemas';
import { TokenIdType } from '~/types/types.interface';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const maxTokenCount = ref();
const maxTokenSupply = ref();
const isInfiniteSupply = ref(true);
const isInfiniteCount = ref(true);
const forceSingleMint = ref(false);
const beneficiaryAddress = ref('');
const beneficiaryPercentage = ref(0);
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const attributes = ref([
    {
        key: '',
        value: '',
    },
]);
const explicitRoyaltyCurrencies: Ref<
    {
        collectionId: string;
        tokenId: TokenIdType;
    }[]
> = ref([
    {
        collectionId: '',
        tokenId: {
            tokenId: '',
            tokenType: TokenIdSelectType.Integer,
        },
    },
]);

const validation = yup.object({
    maxTokenCount: numberNotRequiredSchema.typeError('Max token count must be a number'),
    maxTokenSupply: numberNotRequiredSchema.typeError('Max token supply must be a number'),
    forceSingleMint: booleanNotRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().min(1).max(100).typeError('Percentage must be a number').required(),
        otherwise: () => yup.number().typeError('Percentage must be a number'),
    }),
});

const addExplicitRoyaltyCurrencyItem = () => {
    explicitRoyaltyCurrencies.value.push({
        collectionId: '',
        tokenId: {
            tokenId: '',
            tokenType: TokenIdSelectType.Integer,
        },
    });
};

const removeExplicitRoyaltyCurrencyItem = (index: number) => {
    explicitRoyaltyCurrencies.value.splice(index, 1);
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

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const createCollection = async () => {
    if (!(await isValid())) return;

    try {
        isLoading.value = true;

        const res = await CollectionApi.createCollection(
            formatData({
                mintPolicy: {
                    maxTokenCount: isInfiniteCount.value ? null : maxTokenCount.value,
                    maxTokenSupply: isInfiniteSupply.value ? null : maxTokenSupply.value,
                    forceSingleMint: forceSingleMint.value,
                },
                marketPolicy: beneficiaryAddress.value
                    ? {
                          beneficiary: addressToPublicKey(beneficiaryAddress.value) ?? null,
                          percentage: parseFloat(beneficiaryPercentage.value.toString()) ?? null,
                      }
                    : null,
                explicitRoyaltyCurrencies: explicitRoyaltyCurrencies.value
                    .filter((a) => a.collectionId !== '' && a.tokenId.tokenId !== '')
                    .map((a) => ({
                        collectionId: a.collectionId,
                        tokenId: formatToken(a.tokenId),
                    })),
                attributes: attributes.value.filter((a) => a.key !== '' && a.value !== ''),
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.CreateCollection?.id;

        if (id) {
            snackbar.success({
                title: 'Collection created',
                text: `Collection created with transaction id ${id}`,
                event: id,
            });
            appStore.newCollection = true;
            router.push({ name: 'platform.collections' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection creation',
            text: 'Collection creation failed',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
