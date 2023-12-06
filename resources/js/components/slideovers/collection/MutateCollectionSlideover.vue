<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="mutateCollection"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Mutate Collection</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection that will be approved."
                            type="number"
                            disabled
                            required
                        />
                        <FormInput
                            v-model="newOwner"
                            name="newOwner"
                            label="Owner"
                            description="The new owner account of the collection."
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
                        <FormList
                            flex
                            v-model="explicitRoyaltyCurrencies"
                            label="Explicit Royalty Currencies"
                            description="Set the explicit royalty currencies for tokens in this collection."
                            @add="addExplicitRoyaltyCurrencyItem"
                            @remove="removeExplicitRoyaltyCurrencyItem"
                            dusk-id="royalty"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900">
                                        Collection ID
                                    </label>
                                    <p class="mt-1 text-sm text-gray-500">The collection id of a multi token.</p>
                                </div>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900"> Token ID </label>
                                    <p class="mt-1 text-sm text-gray-500">
                                        The token ID of a multi token.
                                        <ReadMoreButton readmore="Token ID" dusk="tokenId" />
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.collectionId"
                                        :dusk="`input__collection-id-${index + 1}`"
                                        type="number"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div class="flex-1">
                                    <TokenIdInput v-model="inputs.tokenId" :dusk="`input__token-id-${index + 1}`" />
                                </div>
                            </template>
                        </FormList>
                        <FormInput
                            v-if="useAppStore().advanced"
                            v-model="idempotencyKey"
                            name="idempotencyKey"
                            label="Idempotency Key"
                            description="The idempotency key to set. It is recommended to use a UUID for this."
                            tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                            readmore="Idempotency Key"
                        />
                        <FormCheckbox
                            v-if="useAppStore().advanced"
                            v-model="skipValidation"
                            name="skipValidation"
                            label="Skip validation"
                            description="Skip all validation rules, use with caution. Defaults to false."
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Mutate</Btn>
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
import { CollectionApi } from '~/api/collection';
import snackbar from '~/util/snackbar';
import FormList from '~/components/FormList.vue';
import Royalty from '~/util/royalty';
import { addressToPublicKey } from '~/util/address';
import { formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { useAppStore } from '~/store';
import ReadMoreButton from '~/components/ReadMoreButton.vue';
import {
    addressNotRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    stringNotRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            collectionId: number;
            owner: string;
            royalty: {
                beneficiary: string;
                percentage: number;
            };
            explicitRoyaltyCurrencies: {
                collectionId: number;
                tokenId: {
                    tokenId: string;
                    tokenType: TokenIdSelectType;
                };
            }[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const collectionId = ref(props.item?.collectionId);
const newOwner = ref('');
const idempotencyKey = ref('');
const beneficiaryAddress = ref(Royalty.getRoyaltyBeneficiary(props.item));
const beneficiaryPercentage = ref(Royalty.getRoyaltyPercentage(props.item));
const skipValidation = ref(false);
const formRef = ref();

const explicitRoyaltyCurrencies = ref([
    {
        collectionId: '',
        tokenId: {
            tokenId: '',
            tokenType: TokenIdSelectType.Integer,
        },
    },
]);

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

const validation = yup.object({
    collectionId: collectionIdRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().min(0).max(100).typeError('Percentage must be a number').required(),
        otherwise: () => yup.number().typeError('Percentage must be a number'),
    }),
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const mutateCollection = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await CollectionApi.mutateCollection(
            formatData({
                collectionId: props.item?.collectionId,
                mutation: {
                    owner: addressToPublicKey(newOwner.value),
                    royalty: beneficiaryAddress.value
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
                },
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.MutateCollection?.id;

        if (id) {
            snackbar.success({
                title: 'Collection mutated',
                text: `Collection mutate with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection mutation',
            text: 'Collection mutation failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
