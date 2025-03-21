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
                <p v-if="errorMessage" class="absolute left-0 -bottom-5 text-red-500 text-xs truncate">
                    {{ errorMessage }}
                </p>
                <div
                    v-if="prefix"
                    class="flex items-center rounded-l-md border border-r-0 border-light-stroke-strong dark:border-dark-stroke-strong px-3 text-light-content dark:text-dark-content text-sm"
                >
                    {{ prefix }}
                </div>
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
                            'block flex-1 flex-shrink-0 border-0 bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong  placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6 overflow-hidden transition-all disabled:bg-dark-surface-background/10 disabled:dark:bg-light-surface-background/10 outline-none',
                            inputClass,
                        ]"
                        :placeholder="placeholder"
                        autocomplete="off"
                        oninput="validity.valid||(value=value.replace(/\D+/g, ''))"
                        @input="inputChange"
                        @focus="emit('focus')"
                        @keyup.enter="emit('submit')"
                        @focusout="hasFocus && emit('submit')"
                    />
                    <slot name="input" />
                    <slot name="addon" />
                </div>
            </div>
            <div v-if="$slots.errorText" class="text-xs">
                <slot name="errorText" />
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
        type?: string;
        min?: number;
        modelValue?: number | string | null;
        value?: number | string | null;
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

const emit = defineEmits(['update:modelValue', 'inputChange', 'submit', 'focus']);

const inputChange = (e: Event) => {
    emit('inputChange', e);
};

const localModelValue = computed({
    get() {
        return props.modelValue ?? props.value;
    },
    set(value) {
        if (value !== null && value !== undefined && localModelValue.value !== value) {
            emit('update:modelValue', value);
        }
    },
});
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}
</style>
