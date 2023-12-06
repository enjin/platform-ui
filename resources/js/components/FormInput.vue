<template>
    <div>
        <Field
            v-slot="{ field, errorMessage }"
            v-model="localModelValue"
            :validate-on-input="true"
            :validate-on-mount="false"
            :name="name"
        >
            <InputHeader
                :label="label"
                :required="required"
                :description="description"
                :readmore="readmore"
                :tooltip="tooltip"
            />

            <div class="mt-2 flex relative rounded-md w-full" :class="{ '!mt-0': !label, 'shadow-sm': haveShadow }">
                <span
                    v-if="prefix"
                    class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 text-sm"
                >
                    {{ prefix }}
                </span>
                <div class="w-full flex">
                    <input
                        v-bind="{ ...field }"
                        :type="type"
                        :min="min"
                        :disabled="disabled"
                        :class="[
                            {
                                'rounded-none rounded-r-md': prefix,
                                'rounded-md': !prefix,
                                'rounded-r-none': hasAddon,
                            },
                            `block flex-1 flex-shrink-0 border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6 overflow-hidden transition-all disabled:bg-gray-100 ${inputClass}`,
                        ]"
                        :placeholder="placeholder"
                        @input="emit('inputChange', $event)"
                        @keyup.enter="emit('submit')"
                        @focusout="hasFocus && emit('submit')"
                    />
                    <slot name="input" />
                    <slot name="addon" />
                </div>
            </div>
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
        type?: string;
        min?: number;
        modelValue?: number | string | null;
        disabled?: boolean;
        prefix?: string;
        name: string;
        required?: boolean;
        placeholder?: string;
        hasAddon?: boolean;
        tooltip?: string;
        inputClass?: string;
        readmore?: string;
        haveShadow?: boolean;
        hasFocus?: boolean;
    }>(),
    {
        label: undefined,
        required: false,
        description: undefined,
        type: 'text',
        min: 0,
        disabled: false,
        prefix: undefined,
        placeholder: undefined,
        hasAddon: false,
        tooltip: undefined,
        inputClass: '',
        readmore: undefined,
        haveShadow: true,
        hasFocus: false,
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
