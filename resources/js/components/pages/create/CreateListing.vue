<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 pb-20 overflow-y-auto transition-all">
        <div class="flow-root space-y-4 pb-4 max-w-3xl mx-auto">
            <div class="mb-4">
                <h1 class="text-xl md:text-2xl">Create Listing</h1>
            </div>
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createListing">
                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="space-y-6">
                        <div class="">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Parameters</h3>
                            <p class="mt-1 text-sm text-gray-500">Places a sell order.</p>
                        </div>
                        <FormInput
                            v-model="account"
                            name="account"
                            label="Account"
                            description="The seller account."
                            required
                            tooltip="Wallet Address"
                        />

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-sm leading-6 text-gray-900">
                                    Make Asset ID
                                    <span class="text-red-500">&nbsp;*</span>
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">
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

                        <FormCheckbox
                            v-model="enableTakeCollectionId"
                            name="enableTakeCollection"
                            label="Enable offer"
                            description="Use this option to enable offering a different asset in exchange for the asset being sold."
                        />

                        <div v-if="enableTakeCollectionId" class="space-y-2 animate-fade-in">
                            <div>
                                <h3 class="text-sm leading-6 text-gray-900">
                                    Take Asset ID
                                    <span class="text-red-500">&nbsp;*</span>
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    The collection and token ID of the asset being requested.
                                </p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <FormInput
                                    class="col-span-1"
                                    v-model="takeCollectionId"
                                    name="takeCollectionId"
                                    placeholder="Collection ID"
                                    type="number"
                                />
                                <TokenIdInput
                                    class="col-span-1"
                                    v-model="takeTokenId"
                                    placeholder="Token ID"
                                    name="takeTokenId"
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
                            v-model="salt"
                            name="salt"
                            label="Salt"
                            description="Can be used to differentiate listings."
                        />

                        <FormInput
                            v-model="auctionDataStart"
                            name="auctionDataStart"
                            label="Auction Data Start Block"
                            description="The block number the auction starts at."
                        />

                        <FormInput
                            v-model="auctionDataEnd"
                            name="auctionDataEnd"
                            label="Auction Data End Block"
                            description="The block number the auction ends at."
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
                        class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
import { computed, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import { currencySymbolByNetwork, formatData, formatToken, snackbarErrors } from '~/util';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { useAppStore } from '~/store';
import {
    addressRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import { MarketplaceApi } from '~/api/marketplace';
import FormSelect from '~/components/FormSelect.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const account = ref();
const amount = ref('');
const price = ref('');
const salt = ref('');
const auctionDataStart = ref('');
const auctionDataEnd = ref('');
const enableTakeCollectionId = ref(false);
const takeCollectionId = ref('0');
const takeTokenId = ref({
    tokenId: '0',
    tokenType: TokenIdSelectType.Integer,
});
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
    account: addressRequiredSchema,
    amount: numberRequiredSchema.typeError('Amount must be a number'),
    price: numberRequiredSchema.typeError('Price must be a number'),
    salt: stringNotRequiredSchema.typeError('Salt must be a string'),
    takeCollectionId: numberRequiredSchema.typeError('Collection ID is required'),
    takeTokenId: stringRequiredSchema.required('Token ID is required'),
    makeCollectionId: numberRequiredSchema.typeError('Collection ID is required'),
    makeTokenId: stringRequiredSchema.required('Token ID is required'),
    auctionDataStart: stringNotRequiredSchema.typeError('Auction Data Start Block must be a number'),
    auctionDataEnd: stringNotRequiredSchema.typeError('Auction Data End Block must be a number'),
    idempotencyKey: stringNotRequiredSchema,
});

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const createListing = async () => {
    if (!(await isValid())) return;

    try {
        isLoading.value = true;

        const res = await MarketplaceApi.createListing(
            formatData({
                account: account.value,
                amount: amount.value,
                price: price.value,
                salt: salt.value,
                makeAssetId: {
                    collectionId: makeCollectionId.value,
                    tokenId: formatToken(makeTokenId.value),
                },
                takeAssetId: {
                    collectionId: takeCollectionId.value,
                    tokenId: formatToken(takeTokenId.value),
                },
                auctionData: {
                    startBlock: auctionDataStart.value,
                    endBlock: auctionDataEnd.value,
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
</script>
