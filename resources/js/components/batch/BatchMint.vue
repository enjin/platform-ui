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
                                Batch Mint
                            </h3>
                            <Tooltip
                                text="Use this method to batch together several mints into one transaction. You can mix and
                                match Create Token and Mint Token params, as well as use the continueOnFailure flag to
                                skip mints which fail on chain so they can be fixed later."
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
                            v-if="appStore.advanced"
                            v-model="idempotencyKey"
                            name="idempotencyKey"
                            label="Idempotency Key"
                            description="The idempotency key to set. It is recommended to use a UUID for this."
                            tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                            readmore="Idempotency Key"
                        />
                        <FormCheckbox
                            v-if="appStore.advanced"
                            v-model="skipValidation"
                            name="skipValidation"
                            label="Skip validation"
                            description="Skip all validation rules, use with caution. Defaults to false."
                        />
                    </div>
                </div>
                <CollapseCard
                    class="animate-fade-in"
                    :class="{ 'border border-red-400': !item.valid, 'border border-green-400': item.valid }"
                    :title="`Mint Item ${idx + 1}`"
                    v-for="(item, idx) in mints"
                    :key="idx"
                >
                    <template #icon>
                        <CheckCircleIcon
                            class="ml-2 my-auto h-5 w-5 text-green-400"
                            aria-hidden="true"
                            v-if="item.valid"
                        />
                        <XCircleIcon class="ml-2 my-auto h-5 w-5 text-red-400" aria-hidden="true" v-else />
                    </template>
                    <template #actions>
                        <XMarkIcon class="h-5 w-5 cursor-pointer" @click="removeItem(idx)" />
                    </template>
                    <BatchMintForm v-model="item.values" @validation="setValidation(idx, $event)" />
                </CollapseCard>
                <div class="flex justify-between">
                    <Btn dusk="addItemBtn" class="!m-0 !flex" @click="addItem" primary>Add Item</Btn>
                    <div class="flex space-x-3 justify-end">
                        <RouterLink
                            dusk="cancelBtn"
                            :to="{ name: 'platform.tokens' }"
                            type="button"
                            class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </RouterLink>
                        <Btn dusk="submitBtn" :loading="isLoading" :disabled="isLoading" primary is-submit
                            >Batch Mint</Btn
                        >
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
import BatchMintForm from '~/components/batch/forms/BatchMintForm.vue';
import { ApiService } from '~/api';
import { formatData, snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import { MintValuesInterface } from '~/types/types.interface';
import FormSelect from '../FormSelect.vue';
import Tooltip from '../Tooltip.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const collectionId = ref('');
const idempotencyKey = ref();
const skipValidation = ref(false);
const formRef = ref();

const validation = yup.object().shape({
    collectionId: yup.number().typeError('Collection ID must be a number').required(),
    idempotencyKey: yup.string().nullable(),
    skipValidation: yup.boolean().default(false),
});

const mints: Ref<
    {
        valid: boolean;
        values: MintValuesInterface;
    }[]
> = ref([
    {
        valid: false,
        values: {},
    },
]);

const collectionIds = computed(() => appStore.collections);

const addItem = () => {
    mints.value.push({
        valid: false,
        values: {},
    });
};

const removeItem = (index: number) => {
    mints.value.splice(index, 1);
};

const setValidation = (index: number, isValid: boolean) => {
    mints.value[index].valid = isValid;
};

const isAllValid = computed(() => {
    return (
        mints.value.length > 0 &&
        mints.value.every((item: { valid: boolean; values: MintValuesInterface }) => item.valid) &&
        formRef.value.getMeta().valid
    );
});

const createBatch = async () => {
    await formRef.value.validate();
    if (!isAllValid.value) return;

    try {
        isLoading.value = true;
        const res = await ApiService.batchMint(
            formatData({
                collectionId: collectionId.value,
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
                recipients: mints.value.map((item: { valid: boolean; values: MintValuesInterface }) => item.values),
            })
        );

        const id = res.data?.BatchMint?.id;

        if (id) {
            snackbar.success({
                title: 'Batch mint created',
                text: `Batch mint created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.tokens' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Batch mint',
            text: 'Batch mint failed',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
