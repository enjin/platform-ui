<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="mutateToken"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Mutate Token
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection that will be mutated."
                            type="number"
                            disabled
                            required
                        />
                        <TokenIdInput
                            v-model="tokenId"
                            label="Token ID"
                            description="The token that will be mutated."
                            disabled
                            required
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
                            description="Set if the token can be listed on the marketplace. If null, the listingForbidden property will not be changed."
                        />
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
import { TokenApi } from '~/api/token';
import snackbar from '~/util/snackbar';
import { formatData, formatToken, snackbarErrors } from '~/util';
import Royalty from '~/util/royalty';
import { TokenIdSelectType } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { useAppStore } from '~/store';
import {
    addressNotRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tokenId: string;
            collectionId: number;
            isCurrency: boolean;
            listingForbidden: boolean;
            royalty: {
                beneficiary: string;
                percentage: number;
            } | null;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tokenId = ref({
    tokenType: TokenIdSelectType.Integer,
    tokenId: props.item?.tokenId!,
});
const collectionId = ref(props.item?.collectionId);
const beneficiaryAddress = ref(Royalty.getRoyaltyBeneficiary(props.item));
const beneficiaryPercentage = ref(Royalty.getRoyaltyPercentage(props.item) * 100);
const isCurrency = ref(props.item?.isCurrency ?? false);
const listingForbidden = ref(false);
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();
const signingAccount = ref('');

const validation = yup.object({
    tokenId: stringRequiredSchema,
    collectionId: collectionIdRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().min(1).max(100).typeError('Percentage must be a number').required(),
        otherwise: () => yup.number().typeError('Percentage must be a number').nullable(),
    }),
    isCurrency: booleanNotRequiredSchema,
    listingForbidden: booleanNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const mutateToken = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await TokenApi.mutateToken(
            formatData({
                tokenId: formatToken(tokenId.value),
                collectionId: props.item?.collectionId,
                hasRoyalty:
                    beneficiaryAddress.value !== ''
                        ? {
                              beneficiary: beneficiaryAddress.value,
                              percentage: parseFloat(beneficiaryPercentage.value.toString()),
                          }
                        : null,
                isCurrency: isCurrency.value ? isCurrency.value : null,
                listingForbidden: listingForbidden.value,
                signingAccount: signingAccount.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.MutateToken?.id;

        if (id) {
            snackbar.success({
                title: 'Token mutated',
                text: `Token mutated with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token mutation',
            text: 'Token mutation failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
