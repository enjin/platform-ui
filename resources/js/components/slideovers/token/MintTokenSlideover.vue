<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="mintToken"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Mint Token
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID to mint from."
                            type="number"
                            disabled
                            required
                        />
                        <TokenIdInput
                            v-model="tokenId"
                            label="Token ID"
                            description="The token ID to set. This must be unique for this collection."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="recipient"
                            name="recipient"
                            label="Recipient"
                            description="The recipient account of the tokens being minted."
                            required
                        />

                        <FormInput
                            v-model="amount"
                            name="amount"
                            label="Amount"
                            description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token cap if set."
                            type="number"
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Mint</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { Ref, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import { TokenApi } from '~/api/token';
import snackbar from '~/util/snackbar';
import { addressToPublicKey, publicKeyToAddress } from '~/util/address';
import { formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { useAppStore } from '~/store';
import { TokenIdType } from '~/types/types.interface';
import {
    addressRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            collectionId: number;
            tokenId: string;
            owner: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const collectionId = ref(props.item?.collectionId);
const recipient = ref(publicKeyToAddress(props.item?.owner!));
const amount = ref();
const idempotencyKey = ref('');
const skipValidation = ref(false);
const tokenId: Ref<TokenIdType> = ref({
    tokenType: TokenIdSelectType.Integer,
    tokenId: props.item?.tokenId!,
});
const formRef = ref();

const validation = yup.object({
    collectionId: collectionIdRequiredSchema,
    tokenId: stringRequiredSchema,
    recipient: addressRequiredSchema,
    amount: numberRequiredSchema.typeError('Amount must be a number'),
    unitPrice: numberNotRequiredSchema.min(0.01).typeError('Unit price must be a number'),
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const mintToken = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;

        const res = await TokenApi.mintToken(
            formatData({
                recipient: addressToPublicKey(recipient.value),
                collectionId: collectionId.value,
                params: {
                    tokenId: formatToken(tokenId.value),
                    amount: amount.value,
                },
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.MintToken?.id;

        if (id) {
            snackbar.success({
                title: 'Token minted',
                text: `Token minted with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token mint',
            text: 'Token mint failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
