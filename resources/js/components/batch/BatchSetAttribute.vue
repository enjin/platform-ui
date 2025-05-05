<template>
    <div class="mt-4 flow-root">
        <div class="space-y-4 pb-4">
            <Form
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @invalid-submit="invalidSubmit"
                @submit="createBatch"
            >
                <div class="bg-light-surface-primary dark:bg-dark-surface-primary p-6 shadow rounded-lg">
                    <div class="space-y-6">
                        <div class="flex items-center">
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Batch Set Attribute
                            </h3>
                            <Tooltip
                                text="Use this to set multiple attributes on a collection or token in one transaction. Setting
                                the continueOnFailure flag to true will allow all valid attributes to be set while
                                skipping invalid attributes so they can be fixed and attempted again in another
                                transaction."
                            >
                                <QuestionMarkCircleIcon
                                    class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                                />
                            </Tooltip>
                        </div>
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
                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-5 shadow sm:rounded-lg sm:p-6"
                >
                    <FormList
                        v-model="attributes"
                        label="Attributes"
                        description="The attribute for a collection or token."
                        @add="addAttributeItem"
                        @remove="removeAttributeItem"
                        readmore="Attributes"
                        dusk-id="attributes"
                    >
                        <template #headers>
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Key
                                </label>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">The attribute key.</p>
                            </div>
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Value
                                </label>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                    The attribute value.
                                </p>
                            </div>
                            <div class="w-5"></div>
                        </template>
                        <template #inputs="{ inputs, index }">
                            <div class="flex-1">
                                <input
                                    v-model="inputs.key"
                                    :dusk="`input__attribute-key-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                />
                            </div>
                            <div class="flex-1">
                                <input
                                    v-model="inputs.value"
                                    :dusk="`input__attribute-value-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                />
                            </div>
                        </template>
                    </FormList>
                </div>
                <div class="flex space-x-4 justify-start">
                    <RouterLink
                        :to="{ name: 'platform.tokens' }"
                        type="button"
                        class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong hover:bg-light-surface-background hover:dark:bg-dark-surface-background !bg-opacity-50"
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
import Tooltip from '../Tooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

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
const signingAccount = ref('');

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

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const createBatch = async () => {
    await formRef.value.validate();
    if (!formRef.value.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await ApiService.batchSetAttribute(
            formatData({
                collectionId: collectionId.value,
                tokenId: formatToken(tokenId.value),
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
                attributes: attributes.value.filter((a) => a.key !== '' && a.value !== ''),
                signingAccount: signingAccount.value,
            })
        );

        const id = res.data?.BatchSetAttribute?.id;

        if (id) {
            snackbar.success({
                title: 'Batch setAttribute created',
                text: `Batch setAttribute created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.tokens' });
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
