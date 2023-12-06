<template>
    <div class="mt-4 flow-root">
        <div class="space-y-4 pb-4">
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createBatch">
                <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Batch Set Attribute</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Use this to set multiple attributes on a collection or token in one transaction. Setting
                                the continueOnFailure flag to true will allow all valid attributes to be set while
                                skipping invalid attributes so they can be fixed and attempted again in another
                                transaction.
                            </p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormSelect
                                    v-model="collectionId"
                                    name="collectionId"
                                    label="Collection ID"
                                    description="The collection ID to mint from."
                                    tooltip="The Collection ID can be retrieved by accessing the details of the request on the transactions page."
                                    placeholder="Select a collection ID"
                                    :options="collectionIds"
                                    required
                                />
                                <TokenIdInput
                                    v-model="tokenId"
                                    label="Token ID"
                                    description="The token ID to set. This must be unique for this collection."
                                    readmore="Token ID"
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
                <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
                    <FormList
                        v-model="attributes"
                        label="Attributes"
                        description="The attribute for a collection or token."
                        @add="addAttributeItem"
                        @remove="removeAttributeItem"
                        readmore="Attributes"
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
                <div class="flex space-x-3 justify-end">
                    <RouterLink
                        :to="{ name: 'platform.collections' }"
                        type="button"
                        class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </RouterLink>
                    <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Batch Set Attribute</Btn>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import FormInput from '~/components/FormInput.vue';
import { ApiService } from '~/api';
import { formatData, formatToken, snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import FormList from '~/components/FormList.vue';
import { useAppStore } from '~/store';
import FormSelect from '../FormSelect.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const collectionId = ref('');
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const idempotencyKey = ref();
const skipValidation = ref(false);
const formRef = ref();

const attributes = ref([
    {
        key: '',
        value: '',
    },
]);

const collectionIds = computed(() => appStore.collections);

const validation = yup.object().shape({
    collectionId: yup.number().typeError('Collection ID must be a number').required(),
    tokenId: yup.string().required(),
    idempotencyKey: yup.string().nullable(),
    skipValidation: yup.boolean(),
});

const addAttributeItem = () => {
    attributes.value.push({
        key: '',
        value: '',
    });
};

const removeAttributeItem = (index: number) => {
    attributes.value.splice(index, 1);
};

const createBatch = async () => {
    await formRef.value.validate();
    if (!formRef.value.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await ApiService.batchSetAttribute(
            formatData({
                collectionId: collectionId.value,
                tokenId: formatToken(tokenId.value),
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
                attributes: attributes.value.filter((a) => a.key !== '' && a.value !== ''),
            })
        );

        const id = res.data?.BatchSetAttribute?.id;

        if (id) {
            snackbar.success({
                title: 'Batch setAttribute created',
                text: `Batch setAttribute created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.collections' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Batch setAttribute',
            text: 'Batch setAttribute failed',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
