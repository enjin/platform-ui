<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="deleteBeam"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Delete Beam</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="code"
                            name="code"
                            label="Code"
                            description="The beam code."
                            disabled
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" primary is-submit>Delete</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import { BeamApi } from '~/api/beam';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import { stringRequiredSchema } from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            code: string;
            qr: {
                url: string;
                payload: string;
            };
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const code = ref(props.item?.code);
const formRef = ref();

const validation = yup.object({
    code: stringRequiredSchema,
});

const deleteBeam = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await BeamApi.deleteBeam(
            formatData({
                code: props.item?.code,
            })
        );

        const id = res.data?.DeleteBeam;

        if (id) {
            snackbar.success({
                title: 'Beam deleted',
                text: `Beam deleted successfully`,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Beam delete',
            text: 'Failed to delete beam',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
