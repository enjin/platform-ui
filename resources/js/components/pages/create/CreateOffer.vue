<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 pb-20 overflow-y-auto transition-all">
        <div class="flow-root space-y-4 pb-4 max-w-3xl mx-auto">
            <div class="mb-4">
                <h1 class="text-xl md:text-2xl text-light-content-strong dark:text-dark-content-strong">
                    Create Listing
                </h1>
            </div>
            <Form
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @invalid-submit="invalidSubmit"
                @submit="createListing"
            >
                <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="space-y-6">
                        <div class="">
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Parameters
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">Places a sell order.</p>
                        </div>

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-sm leading-6 text-light-content-strong dark:text-dark-content-strong">
                                    Make Asset ID
                                    <span class="text-red-500">&nbsp;*</span>
                                </h3>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                    The collection and token ID of the asset being sold.
                                </p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <FormSelect
                                    v-model="makeCollectionId"
                                    name="makeCollectionId"
                                    placeholder="Select a collection ID"
                                    :options="collectionIds"
                                />
                                <TokenIdInput
                                    class="col-span-1"
                                    v-model="makeTokenId"
                                    placeholder="Token ID"
                                    name="makeTokenId"
                                />
                            </div>
                        </div>

                        <FormInput
                            v-model="amount"
                            name="amount"
                            label="Amount"
                            description="The number of units being sold."
                            type="number"
                            required
                        />

                        <FormInput
                            v-model="price"
                            name="price"
                            label="Price"
                            description="The requested price for each unit. If it’s an auction, this is the minimum bid."
                            type="number"
                            required
                            :prefix="currencySymbol"
                        />

                        <FormInput
                            v-model="expiration"
                            name="expiration"
                            label="Expiration"
                            description="The expiration time for the offer."
                            required
                        />
                        <span class="text-sm text-light-content">Current block: {{ currentBlock }}</span>

                        <FormInput
                            v-if="appStore.advanced"
                            v-model="salt"
                            name="salt"
                            label="Salt"
                            description="Can be used to differentiate listings."
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
                    </div>
                </div>

                <div class="flex space-x-3 justify-end">
                    <RouterLink
                        :to="{ name: 'platform.marketplace' }"
                        type="button"
                        class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong hover:bg-light-surface-background hover:dark:bg-dark-surface-background !bg-opacity-50"
                    >
                        Cancel
                    </RouterLink>
                    <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import { currencySymbolByNetwork, formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { useAppStore } from '~/store';
import {
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import { MarketplaceApi } from '~/api/marketplace';
import FormSelect from '~/components/FormSelect.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const amount = ref('');
const price = ref('');
const salt = ref('');
const expiration = ref();
const currentBlock = ref();
const blockInterval = ref();
const makeCollectionId = ref('');
const makeTokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const idempotencyKey = ref('');
const formRef = ref();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));
const collectionIds = computed(() => appStore.collections);

const validation = yup.object({
    amount: numberRequiredSchema.typeError('Amount must be a number'),
    price: numberRequiredSchema.typeError('Price must be a number'),
    salt: stringNotRequiredSchema.typeError('Salt must be a string'),
    takeCollectionId: yup.string().when('enableTakeCollection', {
        is: true,
        then: () => numberRequiredSchema.typeError('Collection ID is required'),
        otherwise: () => yup.string().notRequired(),
    }),
    takeTokenId: yup.string().when('enableTakeCollection', {
        is: true,
        then: () => stringRequiredSchema.typeError('Token ID is required'),
        otherwise: () => yup.string().notRequired(),
    }),
    makeCollectionId: numberRequiredSchema.typeError('Collection ID is required'),
    makeTokenId: stringRequiredSchema.required('Token ID is required'),
    expiration: numberNotRequiredSchema.typeError('Expiration must be a number'),
    idempotencyKey: stringNotRequiredSchema,
});

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const createListing = async () => {
    if (!(await isValid())) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await MarketplaceApi.createListing(
            formatData({
                amount: amount.value,
                price: price.value,
                salt: salt.value,
                makeAssetId: {
                    collectionId: makeCollectionId.value,
                    tokenId: formatToken(makeTokenId.value),
                },
                listingData: {
                    type: 'OFFER',
                    offerParams: {
                        expiration: expiration.value ?? undefined,
                    },
                },
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.CreateListing?.id;

        if (id) {
            snackbar.success({
                title: 'Listing created',
                text: `Listing created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.marketplace.listings' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Listing creation',
            text: 'Listing creation failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const getCurrentBlock = async () => {
    try {
        const res = await MarketplaceApi.getCurrentBlock();
        currentBlock.value = res.data?.GetBlocks?.edges[0].node.number;
    } catch (e) {
        snackbar.error({
            title: 'Failed to get current block',
            text: 'Please try again.',
        });
    }
};

onMounted(() => {
    getCurrentBlock();
    blockInterval.value = setInterval(() => {
        getCurrentBlock();
    }, 12100);
});

onBeforeRouteLeave(() => {
    clearInterval(blockInterval.value);
});
</script>
