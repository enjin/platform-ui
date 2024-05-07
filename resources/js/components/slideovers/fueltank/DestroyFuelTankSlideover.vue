<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @submit="destroyFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Destroy Fuel Tank
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="tankId"
                            name="tankId"
                            label="Tank ID"
                            description="The wallet address of the fuel tank."
                            disabled
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
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Destroy</Btn>
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
import { FuelTankApi } from '~/api/fueltank';
import { addressToPublicKey } from '~/util/address';
import { stringNotRequiredSchema, stringRequiredSchema } from '~/util/schemas';
import { useAppStore } from '~/store';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tankId = ref(props.item?.tankId);
const idempotencyKey = ref('');
const formRef = ref();

const validation = yup.object({
    tankId: stringRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
});

const destroyFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid || !tankId.value) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.destroyFuelTank(
            formatData({
                tankId: addressToPublicKey(tankId.value),
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.DestroyFuelTank?.id;

        if (id) {
            snackbar.success({
                title: 'Fuel Tank destroyed',
                text: `Fuel Tank destroyed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel Tank destroy',
            text: 'Fuel Tank destroy failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
