<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        @submit="expireSingleUseCode"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Expire Single Use Code</h3>
        <div class="h-0 flex-1 overflow-y-auto" v-if="item?.codes">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <div>
                            <div>
                                <div class="flex">
                                    <label class="block text-sm font-medium leading-6 text-gray-900"> Codes </label>
                                </div>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <Chip v-for="code in item.codes" :key="code" :text="code" :closable="false" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" primary is-submit>Expire</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref } from 'vue';
import Btn from '~/components/Btn.vue';
import { BeamApi } from '~/api/beam';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import Chip from '~/components/Chip.vue';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            codes: string[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);

const expireSingleUseCode = async () => {
    try {
        isLoading.value = true;
        const res = await BeamApi.expireSingleUseCodes(
            formatData({
                codes: props.item.codes,
            })
        );

        const id = res.data?.ExpireSingleUseCodes;

        if (id) {
            snackbar.success({
                title: 'Expire single use codes',
                text: `Single use codes are expired`,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Expire single use codes',
            text: 'Something went wrong',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
