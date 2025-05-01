<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="finalizeAuction"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Finalize Auction
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
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
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Close</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Finalize Auction</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import { useAppStore } from '~/store';
import { stringRequiredSchema } from '~/util/schemas';
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

const isLoading = ref(false);
const listingId = ref(props.item?.listingId);
const idempotencyKey = ref('');
const formRef = ref();
const signingAccount = ref('');

const validation = yup.object({
    listingId: stringRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const finalizeAuction = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await MarketplaceApi.finalizeAuction(
            formatData({
                listingId: listingId.value,
                idempotencyKey: idempotencyKey.value,
                signingAccount: signingAccount.value,
            })
        );

        const id = res.data?.FinalizeAuction?.id;

        if (id) {
            snackbar.success({
                title: 'Listing finalization',
                text: `Listing finalized with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Listing finalization',
            text: 'Listing finalization failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
