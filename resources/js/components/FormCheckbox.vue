<template>
    <div class="w-full max-w-md space-y-4">
        <InputHeader
            v-if="!hideLabel"
            :label="label"
            :required="required"
            :description="description"
            :readmore="readmore"
            :tooltip="tooltip"
        />

        <Field
            v-slot="{ field }"
            v-model="localModelValue"
            :validate-on-input="false"
            :validate-on-mount="false"
            :name="name"
            :disabled="disabled"
        >
            <div class="items-center w-full">
                <input
                    v-model="localModelValue"
                    v-bind="{ ...field }"
                    type="checkbox"
                    class="rounded border-light-stroke-strong dark:border-dark-stroke-strong text-primary focus:ring-primary-light bg-light-surface-background dark:bg-dark-surface-background hidden"
                />

                <div
                    :class="[
                        localModelValue
                            ? 'bg-primary/90 text-white '
                            : 'bg-light-surface-background dark:bg-dark-surface-background',
                    ]"
                    class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md outline-none focus:outline-none transition-all"
                    @click="onChange"
                >
                    <div class="flex w-full items-center justify-between">
                        <label
                            :class="localModelValue ? 'text-white' : 'text-gray-900 dark:text-white'"
                            class="flex font-medium text-sm transition-all"
                        >
                            {{ label }}
                            <Tooltip v-if="tooltip && hideLabel" class="!flex items-center" :text="tooltip">
                                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
                            </Tooltip>
                        </label>
                        <div v-show="localModelValue" class="shrink-0 text-white">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.2" />
                                <path
                                    d="M7 13l3 3 7-7"
                                    stroke="#fff"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Field>
    </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import { computed, watch } from 'vue';
import InputHeader from './InputHeader.vue';
import Tooltip from './Tooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(
    defineProps<{
        label?: string;
        description?: string;
        modelValue: boolean;
        name: string;
        readmore?: string;
        required?: boolean;
        tooltip?: string;
        disabled?: boolean;
        hideLabel?: boolean;
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

const onChange = () => {
    if (props.disabled) {
        return;
    }

    localModelValue.value = !localModelValue.value;
};

watch(
    () => props.disabled,
    (value) => {
        if (value) {
            localModelValue.value = false;
        }
    }
);
</script>
