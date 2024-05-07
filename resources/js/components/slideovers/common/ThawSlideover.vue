<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="thaw"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Thaw
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="freezeType"
                            name="freezeType"
                            label="Freeze Type"
                            description="The type of thawing to do."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID to thaw."
                            type="number"
                            disabled
                            required
                        />
                        <TokenIdInput
                            v-if="freezeType === FreezeType.TOKEN"
                            v-model="tokenId"
                            label="Token ID"
                            description="The token ID to thaw."
                            disabled
                            required
                        />
                        <FormInput
                            v-if="freezeType === FreezeType.COLLECTION_ACCOUNT"
                            v-model="collectionAccount"
                            name="collectionAccount"
                            label="Collection Account"
                            description="Thaw a previously frozen collection or token."
                            required
                        />
                        <FormInput
                            v-if="freezeType === FreezeType.TOKEN_ACCOUNT"
                            v-model="tokenAccount"
                            name="tokenAccount"
                            label="Token Account"
                            description="The token account to thaw."
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Thaw</Btn>
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
import { ApiService } from '~/api';
import snackbar from '~/util/snackbar';
import { FreezeType, TokenIdSelectType } from '~/types/types.enums';
import { formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { useAppStore } from '~/store';
import {
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            collectionId: number;
            freezeType: FreezeType;
            tokenId: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const collectionId = ref(props.item?.collectionId);
const freezeType = ref(props.item?.freezeType ?? FreezeType.COLLECTION);
const tokenId = ref({
    tokenType: TokenIdSelectType.Integer,
    tokenId: props.item?.tokenId ?? '',
});
const collectionAccount = ref('');
const tokenAccount = ref('');
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const validation = yup.object({
    collectionId: collectionIdRequiredSchema,
    freezeType: stringRequiredSchema.oneOf(Object.values(FreezeType)),
    tokenId: yup.object().when('freezeType', {
        is: FreezeType.TOKEN,
        then: () => stringRequiredSchema,
        otherwise: () => stringNotRequiredSchema,
    }),
    collectionAccount: stringNotRequiredSchema,
    tokenAccount: stringNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const thaw = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const freezeTypeText = freezeType.value.charAt(0) + freezeType.value.slice(1).toLowerCase();
    try {
        isLoading.value = true;
        const res = await ApiService.thaw(
            formatData({
                collectionId: props.item?.collectionId,
                freezeType: freezeType.value,
                tokenId: formatToken(tokenId.value),
                collectionAccount: collectionAccount.value,
                tokenAccount: tokenAccount.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.Thaw?.id;

        if (id) {
            snackbar.success({
                title: `${freezeTypeText} thawed`,
                text: `${freezeTypeText} thawed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: `${freezeTypeText} thaw`,
            text: `${freezeTypeText} thaw failed`,
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
