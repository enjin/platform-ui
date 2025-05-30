<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="mutateCollection"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Mutate Collection
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
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
                        <div class="flex flex-row space-x-4 w-full">
                            <FormInput
                                v-model="beneficiaryAddress"
                                name="beneficiaryAddress"
                                label="Beneficiary"
                                class="w-full"
                                description="The account that will receive the royalty."
                            />
                            <FormInput
                                v-model="beneficiaryPercentage"
                                name="beneficiaryPercentage"
                                class="w-[100px] flex flex-col justify-between"
                                input-class="w-full"
                                label="Percentage"
                                tooltip="The amount of royalty the beneficiary receives in percentage."
                                type="number"
                                :min="0"
                                prefix="%"
                            />
                        </div>

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
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Collection ID
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The collection id of a multi token.
                                    </p>
                                </div>
                                <div class="flex-1">
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Token ID
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The token ID of a multi token.
                                        <ReadMoreButton readmore="Token ID" dusk="tokenId" />
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="w-1/2">
                                    <input
                                        v-model="inputs.collectionId"
                                        :dusk="`input__collection-id-${index + 1}`"
                                        type="number"
                                        min="0"
                                        oninput="validity.valid||(value=value.replace(/\D+/g, ''))"
                                        class="block w-full rounded-md border-0 py-2 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                    />
                                </div>
                                <div class="w-1/2">
                                    <TokenIdInput v-model="inputs.tokenId" :dusk="`input__token-id-${index + 1}`" />
                                </div>
                            </template>
                        </FormList>
                        <FormInput
                            v-if="useAppStore().advanced"
                            v-model="signingAccount"
                            name="signingAccount"
                            label="Signing Account"
                            description="The wallet used to sign and broadcast the transaction. By default, this is the wallet daemon."
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
const beneficiaryPercentage = ref(Royalty.getRoyaltyPercentage(props.item) * 100);
const skipValidation = ref(false);
const formRef = ref();
const signingAccount = ref('');

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
    newOwner: addressNotRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().min(0).max(100).typeError('Percentage must be a number').required(),
        otherwise: () => yup.number().typeError('Percentage must be a number'),
    }),
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const mutateCollection = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

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
                signingAccount: signingAccount.value,
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

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}
</style>
