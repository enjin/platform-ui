<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="approveCollection"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Approve Collection
        </h3>
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
                            v-model="operator"
                            name="operator"
                            label="Operator"
                            description="The account that will be approved to operate the collection."
                            required
                        />
                        <FormInput
                            v-model="expiration"
                            type="number"
                            name="expiration"
                            label="Expiration"
                            description="The block number where the approval will expire. Leave it as null for no expiration."
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Approve</Btn>
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
import { addressToPublicKey } from '~/util/address';
import { formatData, snackbarErrors } from '~/util';
import { useAppStore } from '~/store';
import {
    booleanNotRequiredSchema,
    stringNotRequiredSchema,
    numberNotRequiredSchema,
    addressRequiredSchema,
    collectionIdRequiredSchema,
} from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            collectionId: number;
            operator: string;
            expiration: number;
            idempotencyKey: string;
            skipValidation: boolean;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const collectionId = ref(props.item?.collectionId);
const operator = ref('');
const expiration = ref();
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const validation = yup.object({
    collectionId: collectionIdRequiredSchema,
    operator: addressRequiredSchema,
    expiration: numberNotRequiredSchema.typeError('Expiration must be a number'),
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const approveCollection = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await CollectionApi.approveCollection(
            formatData({
                collectionId: props.item?.collectionId,
                operator: addressToPublicKey(operator.value),
                expiration: expiration.value === 0 ? null : expiration.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.ApproveCollection?.id;

        if (id) {
            snackbar.success({
                title: 'Collection approved',
                text: `Collection approved with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        } else {
            snackbar.error({
                title: 'Collection approval',
                text: 'Collection approval failed',
            });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection approval',
            text: 'Collection approval failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
