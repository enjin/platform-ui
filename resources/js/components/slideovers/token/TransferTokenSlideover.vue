<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="transferToken"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Transfer Token
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <RadioGroupButton
                    class="px-4 sm:px-6 pt-6 w-full"
                    v-model="transferType"
                    label="Select transfer type"
                    :items="transferTypes"
                />
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID that you be adding attributes to."
                            type="number"
                            disabled
                            required
                        />
                        <TokenIdInput
                            v-model="tokenId"
                            label="Token ID"
                            description="The token ID."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="recipient"
                            name="recipient"
                            label="Recipient"
                            description="The recipient account who is going to receive the transfer."
                            required
                        />
                        <ScaleTransition>
                            <FormInput
                                v-if="transferType === TransferType.OperatorTransferToken"
                                v-model="source"
                                name="source"
                                label="Source"
                                description="The source account of the token."
                                required
                            />
                        </ScaleTransition>
                        <FormInput
                            v-model="amount"
                            name="amount"
                            label="Amount"
                            description="The amount to transfer."
                            type="number"
                            required
                        />
                        <FormInput
                            v-model="signingAccount"
                            name="signingAccount"
                            label="Signing Account"
                            description="The signing wallet for this transaction. Defaults to wallet daemon."
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Transfer</Btn>
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
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType, TransferType } from '~/types/types.enums';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import ScaleTransition from '~/components/ScaleTransition.vue';
import { useAppStore } from '~/store';
import {
    addressRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tokenId: string;
            collectionId: number;
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
const recipient = ref('');
const source = ref('');
const amount = ref();
const signingAccount = ref('');
const idempotencyKey = ref('');
const skipValidation = ref(false);
const transferType = ref(TransferType.SimpleTransferToken);
const transferTypes = Object.values(TransferType).map((type) => ({
    key: `btn-${type}`,
    label: type.replace('TransferToken', ''),
    value: type,
}));
const formRef = ref();

const validation = yup.object({
    tokenId: stringRequiredSchema,
    collectionId: collectionIdRequiredSchema,
    recipient: addressRequiredSchema,
    amount: numberRequiredSchema.min(1),
    source: stringNotRequiredSchema,
    signingAccount: stringNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const transferToken = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await TokenApi.transferToken(
            formatData({
                collectionId: props.item?.collectionId,
                recipient: recipient.value,
                params: {
                    tokenId: formatToken(tokenId.value),
                    source: source.value,
                    amount: amount.value,
                },
                signingAccount: signingAccount.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
                transferType: transferType.value,
            })
        );

        const id = res.data?.[transferType.value]?.id;

        if (id) {
            snackbar.success({
                title: 'Token transfered',
                text: `Token transfered with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token transfer',
            text: 'Token transfer failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
