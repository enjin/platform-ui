<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="formAction"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Collection Attributes
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <RadioGroupButton
                    class="px-4 sm:px-6 pt-6 w-full"
                    v-model="attributeAction"
                    label="Select"
                    :items="attributeActions"
                    :cols="attributeActions.length"
                />
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput v-model="attributeAction" name="attributeAction" class="hidden" />
                        <FormInput
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID that you be adding attributes to."
                            type="number"
                            disabled
                            required
                        />
                        <FormInput
                            v-if="attributeAction === 'set'"
                            v-model="key"
                            name="key"
                            label="Key"
                            description="The attribute key."
                            required
                        />
                        <FormSelect
                            v-if="attributeAction === 'remove'"
                            :options="itemAttributesKeys"
                            v-model="key"
                            name="key"
                            label="Key"
                            description="The attribute key."
                            required
                        />
                        <FormInput
                            v-if="attributeAction === 'set'"
                            v-model="value"
                            name="value"
                            label="Value"
                            description="The attribute value."
                            required
                        />
                        <FormInput
                            v-if="attributeAction === 'removeAll'"
                            v-model="attributeCount"
                            name="attributeCount"
                            label="Attribute Count"
                            description="This is an advanced feature and is used to calculate the weight of the on-chain extrinsic. Putting a value in that isn't equal to the on-chain attribute count will lead to the transaction failing. When empty, the attribute count will be auto calculated from data stored in the local database."
                            required
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
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>
                {{ attributeActions.find((a) => a.value === attributeAction)?.btnText }}
            </Btn>
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
import { formatData, snackbarErrors } from '~/util';
import FormSelect from '~/components/FormSelect.vue';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import { useAppStore } from '~/store';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            collectionId: number;
            attributes: {
                key: string;
                value: string;
            }[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const collectionId = ref(props.item?.collectionId);
const key = ref('');
const value = ref('');
const attributeCount = ref(props.item?.attributes.length);
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();
const signingAccount = ref('');

const attributeAction = ref('set');
const attributeActions = [
    {
        key: 'btn-set',
        label: 'Set',
        value: 'set',
        btnText: 'Set Attribute',
        action: () => setAttribute(),
    },
    {
        key: 'btn-remove',
        label: 'Remove',
        value: 'remove',
        btnText: 'Remove Attribute',
        action: () => removeAttribute(),
    },
    {
        key: 'btn-remove-all',
        label: 'Remove All',
        value: 'removeAll',
        btnText: 'Remove All Attributes',
        action: () => removeAllAttributes(),
    },
];

const formAction = () => {
    const action = attributeActions.find((a) => a.value === attributeAction.value);
    if (action) {
        action.action();
    }
};

const itemAttributesKeys = props.item?.attributes.map((a: { key: string; value: string }) => a.key) ?? [];

const validation = yup.object({
    collectionId: yup.number().typeError('Collection ID must be a number').required(),
    attributeAction: yup.string().nullable(),
    key: yup.string().when('attributeAction', {
        is: 'removeAll',
        then: () => yup.string().nullable().notRequired(),
        otherwise: () => yup.string().required(),
    }),
    value: yup.string().when('attributeAction', {
        is: 'set',
        then: () => yup.string().required(),
        otherwise: () => yup.string().nullable().notRequired(),
    }),
    attributeCount: yup.number().when('attributeAction', {
        is: 'removeAll',
        then: () => yup.number().typeError('Attribute count must be a number').required(),
        otherwise: () => yup.number().nullable().notRequired(),
    }),
    idempotencyKey: yup.string().nullable(),
    skipValidation: yup.boolean().default(false),
});

const setAttribute = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await CollectionApi.setCollectionAttribute(
            formatData({
                collectionId: props.item?.collectionId,
                key: key.value,
                value: value.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.SetCollectionAttribute?.id;

        if (id) {
            snackbar.success({
                title: 'Collection attribute set',
                text: `Collection attribute set with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection attribute set',
            text: 'Collection attribute set failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const removeAttribute = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await CollectionApi.removeCollectionAttribute(
            formatData({
                collectionId: props.item?.collectionId,
                key: key.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );
        isLoading.value = false;

        const id = res.data?.RemoveCollectionAttribute?.id;

        if (id) {
            snackbar.success({
                title: 'Collection attribute removed',
                text: `Collection attribute removed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection attribute removal',
            text: 'Collection attribute removed failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const removeAllAttributes = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await CollectionApi.removeAllAttributes(
            formatData({
                collectionId: props.item?.collectionId,
                attributeCount: attributeCount.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );
        isLoading.value = false;

        const id = res.data?.RemoveAllAttributes?.id;

        if (id) {
            snackbar.success({
                title: 'Collection attributes removed',
                text: `Collection attributes removed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Collection attributes removal',
            text: 'Collection attributes removal failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
