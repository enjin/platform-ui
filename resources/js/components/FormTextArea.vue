<template>
    <div>
        <InputHeader
            :label="label"
            :required="required"
            :description="description"
            :readmore="readmore"
            :tooltip="tooltip"
        />
        <Field
            as="textarea"
            v-slot="{ errorMessage }"
            v-model="localModelValue"
            :validate-on-input="true"
            :validate-on-mount="false"
            :name="name"
            rows="5"
            :class="`mt-2 block w-full flex-1 rounded-md flex-shrink-0 border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6 overflow-hidden transition-all disabled:bg-gray-100 ${inputClass}`"
        >
            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
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
        modelValue?: number | string;
        disabled?: boolean;
        name: string;
        required?: boolean;
        placeholder?: string;
        tooltip?: string;
        inputClass?: string;
        readmore?: string;
        haveShadow?: boolean;
    }>(),
    {
        label: undefined,
        required: false,
        description: undefined,
        disabled: false,
        tooltip: undefined,
        inputClass: '',
        readmore: undefined,
        haveShadow: true,
    }
);

const emit = defineEmits(['update:modelValue', 'inputChange', 'submit']);

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        if (localModelValue.value !== value) {
            emit('update:modelValue', value);
        }
    },
});
</script>
