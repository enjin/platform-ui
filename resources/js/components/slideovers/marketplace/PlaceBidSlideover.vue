<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="placeBid"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Place Bid</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="listingId"
                            name="listingId"
                            label="Listing ID"
                            description="The listing ID."
                            disabled
                            required
                        />
                        <FormInput
                            v-model="price"
                            type="number"
                            name="price"
                            label="Price"
                            description="The requested price for each unit. If it’s an auction, this is the minimum bid."
                            :prefix="currencySymbol"
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
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Close</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Place Bid</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { computed, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { currencySymbolByNetwork, formatData, snackbarErrors } from '~/util';
import { useAppStore } from '~/store';
import { numberRequiredSchema, stringRequiredSchema } from '~/util/schemas';
import { stringNotRequiredSchema } from '~/util/schemas';
import { MarketplaceApi } from '~/api/marketplace';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            listingId: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const appStore = useAppStore();

const isLoading = ref(false);
const listingId = ref(props.item?.listingId);
const price = ref(0);
const idempotencyKey = ref('');
const formRef = ref();

const currencySymbol = computed(() => currencySymbolByNetwork(appStore.config.network));

const validation = yup.object({
    listingId: stringRequiredSchema,
    price: numberRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
});

const placeBid = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await MarketplaceApi.placeBid(
            formatData({
                listingId: listingId.value,
                price: price.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.PlaceBid?.id;

        if (id) {
            snackbar.success({
                title: 'Bid placed',
                text: `Bid placed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Bid placing',
            text: 'Bid placing failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
