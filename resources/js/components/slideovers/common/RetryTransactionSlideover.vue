<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        @submit="showDisclaimer"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Retry Transactions</h3>
        <div class="h-0 flex-1 overflow-y-auto" v-if="item?.ids">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <div>
                            <div class="flex">
                                <label class="block text-sm font-medium leading-6 text-gray-900">
                                    Transaction IDs <span class="text-red-500">&nbsp;*</span>
                                </label>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <Chip v-for="id in item.ids" :key="id" :text="id" :closable="false" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Retry</Btn>
        </div>
    </Form>
    <ConfirmModal
        :is-open="modal"
        title="Disclaimer"
        description="Retries transactions that have failed or otherwise not been included on-chain after some time. Use with caution and ensure the transactions really aren't yet on-chain (or likely to be) to make sure they are not accidentally included twice."
        @closed="modal = false"
        @confirm="retryTransaction"
    />
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref } from 'vue';
import Btn from '~/components/Btn.vue';
import { TransactionApi } from '~/api/transaction';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import ConfirmModal from '~/components/ConfirmModal.vue';
import Chip from '~/components/Chip.vue';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            ids: string[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const modal = ref(false);

const showDisclaimer = () => {
    modal.value = true;
};

const retryTransaction = async () => {
    modal.value = false;
    try {
        isLoading.value = true;
        const res = await TransactionApi.retryTransactions(
            formatData({
                ids: props.item?.ids,
            })
        );

        const id = res.data?.RetryTransactions;

        if (id) {
            snackbar.success({
                title: `Retry transactions`,
                text: `Retry transactions successful`,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: `Retry transactions`,
            text: `Retry transactions failed`,
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
