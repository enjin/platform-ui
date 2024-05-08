<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="updateBeam"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Update Beam</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6 pt-4 w-full rounded-md overflow-hidden">
                    <img class="w-full rounded-md" :src="item?.image" />
                </div>
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
                        <FormInput v-model="name" name="name" label="Name" description="The beam name." required />
                        <FormInput
                            v-model="description"
                            name="description"
                            description="The beam description."
                            label="Description"
                            required
                        />
                        <FormInput
                            v-model="image"
                            name="image"
                            label="Image"
                            description="The beam image URL."
                            required
                        />
                        <FormDateInput
                            v-model="start"
                            name="start"
                            label="Start time"
                            description="The claim period start date."
                            required
                        />
                        <FormDateInput
                            v-model="end"
                            :min-date="start"
                            name="end"
                            label="End time"
                            description="The claim period end date."
                            required
                        />
                        <MultiCheckbox
                            name="flags"
                            v-model="flags"
                            :options="beamFlags"
                            label="Flags"
                            description="The beam flags that should be enabled disabled."
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Update</Btn>
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
import { BeamFlag } from '~/types/types.enums';
import MultiCheckbox from '~/components/MultiCheckbox.vue';
import FormDateInput from '~/components/FormDateInput.vue';
import { stringRequiredSchema, dateRequiredSchema } from '~/util/schemas';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            id: string;
            code: string;
            name: string;
            description: string;
            image: string;
            start: string;
            end: string;
            flags: string[];
            claimConditions: { type: string; value: string }[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const code = ref(props.item?.code);
const name = ref(props.item?.name);
const description = ref(props.item?.description);
const image = ref(props.item?.image);
const start = ref(new Date(props.item?.start || new Date()));
const end = ref(new Date(props.item?.end || new Date()));
const flags = ref([]);
const formRef = ref();

const beamFlags = Object.values(BeamFlag).map((flag) => ({
    label: flag.charAt(0) + flag.toLowerCase().replace('_', ' ').slice(1),
    value: flag,
}));

const validation = yup.object({
    code: stringRequiredSchema,
    name: stringRequiredSchema,
    description: stringRequiredSchema,
    image: stringRequiredSchema,
    start: dateRequiredSchema,
    end: dateRequiredSchema.min(yup.ref('start')),
    flags: yup.array().of(yup.string()),
});

const checkChanges = () => {
    return {
        code: code.value,
        name: name.value !== props.item?.name ? name.value : null,
        description: description.value !== props.item?.description ? description.value : null,
        image: image.value !== props.item?.image ? image.value : null,
        start:
            new Date(start.value).toString() !== new Date(props.item?.start ?? '').toString()
                ? new Date(start.value).toString()
                : null,
        end:
            new Date(end.value).toString() !== new Date(props.item?.end ?? '').toString()
                ? new Date(end.value).toString()
                : null,
        flags:
            flags.value !== props.item?.flags
                ? flags.value.map((f) => {
                      return {
                          flag: f,
                          enabled: true,
                      };
                  })
                : null,
        claimConditions: props.item?.claimConditions,
    };
};

const updateBeam = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await BeamApi.updateBeam(formatData(checkChanges()));

        const id = res.data?.UpdateBeam;

        if (id) {
            snackbar.success({
                title: 'Update Beam',
                text: `Beam \`${code.value}\` has been updated.`,
            });
            closeSlide();
        } else {
            snackbar.error({
                title: 'Update Beam',
                text: 'Something went wrong while updating the beam.',
            });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Update Beam',
            text: 'Something went wrong while updating the beam.',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
