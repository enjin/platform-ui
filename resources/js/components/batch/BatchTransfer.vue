<template>
    <div class="mt-4 flow-root">
        <div class="space-y-6 pb-4">
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createBatch">
                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-5 shadow sm:rounded-lg sm:p-6"
                >
                    <div class="space-y-6">
                        <div class="flex items-center">
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Batch Transfer
                            </h3>
                            <Tooltip
                                text="Use this method to transfer multiple tokens in one transaction. You can include up to
                                250 different transfers per batch. Set the continueOnFailure to true to allow all valid
                                transfers to complete while skipping transfers which would fali so they can be fixed and
                                attempted again in another transaction."
                            >
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
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
                <CollapseCard
                    v-for="(item, idx) in transfers"
                    :key="idx"
                    class="animate-fade-in"
                    :class="{ 'border border-red-400': !item.valid, 'border border-green-400': item.valid }"
                    :title="`Transfer Item ${idx + 1}`"
                >
                    <template #icon>
                        <CheckCircleIcon
                            v-if="item.valid"
                            class="ml-2 my-auto h-5 w-5 text-green-400"
                            aria-hidden="true"
                        />
                        <XCircleIcon class="ml-2 my-auto h-5 w-5 text-red-400" aria-hidden="true" v-else />
                    </template>
                    <template #actions>
                        <XMarkIcon class="h-5 w-5 cursor-pointer" @click.prevent="removeItem(idx)" />
                    </template>
                    <BatchTransferForm v-model="item.values" @validation="setValidation(idx, $event)" />
                </CollapseCard>
                <div class="flex justify-between">
                    <Btn class="!m-0 !flex" @click="addItem" primary>Add Item</Btn>
                    <div class="flex space-x-3 justify-end">
                        <RouterLink
                            :to="{ name: 'platform.tokens' }"
                            type="button"
                            class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </RouterLink>
                        <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Batch Transfer</Btn>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { CheckCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import CollapseCard from '~/components/CollapseCard.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import FormInput from '~/components/FormInput.vue';
import { ApiService } from '~/api';
import { formatData, snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import BatchTransferForm from '~/components/batch/forms/BatchTransferForm.vue';
import { useAppStore } from '~/store';
import { TransferValuesInterface } from '~/types/types.interface';
import FormSelect from '../FormSelect.vue';
import Tooltip from '../Tooltip.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const collectionId = ref('');
const idempotencyKey = ref();
const skipValidation = ref(false);
const signingAccount = ref();
const formRef = ref();

const validation = yup.object().shape({
    collectionId: yup.number().typeError('Collection ID must be a number').required(),
    signingAccount: yup.string().nullable(),
    idempotencyKey: yup.string().nullable(),
});

const transfers: Ref<
    {
        valid: boolean;
        values: TransferValuesInterface;
    }[]
> = ref([
    {
        valid: false,
        values: {},
    },
]);

const collectionIds = computed(() => appStore.collections);

const addItem = () => {
    transfers.value.push({
        valid: false,
        values: {},
    });
};

const removeItem = (index: number) => {
    transfers.value.splice(index, 1);
};

const setValidation = (index: number, isValid: boolean) => {
    transfers.value[index].valid = isValid;
};

const isAllValid = computed(() => {
    return (
        transfers.value.length > 0 &&
        transfers.value.every((item: { valid: boolean; values: TransferValuesInterface }) => item.valid) &&
        formRef.value.getMeta().valid
    );
});

const createBatch = async () => {
    await formRef.value.validate();
    if (!isAllValid.value) return;

    try {
        isLoading.value = true;
        const res = await ApiService.batchTransfer(
            formatData({
                collectionId: collectionId.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
                signingAccount: signingAccount.value,
                recipients: transfers.value.map(
                    (item: { valid: boolean; values: TransferValuesInterface }) => item.values
                ),
            })
        );

        const id = res.data?.BatchTransfer?.id;

        if (id) {
            snackbar.success({
                title: 'Batch transfer created',
                text: `Batch transfer created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.tokens' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Batch transfer',
            text: 'Batch transfer failed',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
