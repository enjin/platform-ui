<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="infuseToken"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Infuse Token
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID to use in this operation.."
                            type="number"
                            disabled
                            required
                        />
                        <TokenIdInput
                            v-model="tokenId"
                            label="Token ID"
                            description="The token that will be infused."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="amount"
                            name="amount"
                            label="Amount"
                            description="The amount of ENJ to infuse."
                            type="number"
                            :prefix="currencySymbol"
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Mutate</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { computed, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import { TokenApi } from '~/api/token';
import snackbar from '~/util/snackbar';
import { currencySymbolByNetwork, formatData, formatPriceToENJ, formatToken, snackbarErrors } from '~/util';
import { TokenIdSelectType } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { useAppStore } from '~/store';
import {
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
const amount = ref();
const signingAccount = ref('');
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const validation = yup.object({
    tokenId: stringRequiredSchema,
    collectionId: collectionIdRequiredSchema,
    amount: numberRequiredSchema.min(1),
    signingAccount: stringNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const infuseToken = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await TokenApi.infuseToken(
            formatData({
                collectionId: props.item?.collectionId,
                tokenId: formatToken(tokenId.value),
                amount: formatPriceToENJ(amount.value),
                signingAccount: signingAccount.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.MutateToken?.id;

        if (id) {
            snackbar.success({
                title: 'Token Infused',
                text: `Token infused with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token infusion',
            text: 'Token infusion failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
