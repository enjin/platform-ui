<template>
    <div class="flex items-start">
        <Field
            v-slot="{ field }"
            v-model="localModelValue"
            :validate-on-input="false"
            :validate-on-mount="false"
            :name="name"
        >
            <div class="flex h-6 items-center">
                <input
                    v-model="localModelValue"
                    v-bind="{ ...field }"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-light"
                />
            </div>
            <div class="ml-3">
                <InputHeader
                    :label="label"
                    :required="required"
                    :description="description"
                    :readmore="readmore"
                    :tooltip="tooltip"
                />
            </div>
        </Field>
    </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import { computed } from 'vue';
import InputHeader from './InputHeader.vue';

const props = withDefaults(
    defineProps<{
        label?: string;
        description?: string;
        modelValue: boolean;
        name: string;
        readmore?: string;
        required?: boolean;
        tooltip?: string;
    }>(),
    {
        required: false,
        readmore: undefined,
        description: undefined,
        tooltip: undefined,
    }
);

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});
</script>
