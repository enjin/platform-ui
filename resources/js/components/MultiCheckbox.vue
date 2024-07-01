<template>
    <div>
        <label
            v-if="label"
            class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
        >
            {{ label }} <span v-if="required" class="text-red-500">&nbsp;*</span>
        </label>
        <p class="mt-1 text-sm text-light-content dark:text-dark-content" v-if="description">{{ description }}</p>
        <input
            v-for="option in options"
            v-model="localModelValue"
            :value="option.value"
            :key="option.value"
            type="checkbox"
            class="hidden"
        />
        <div class="mt-4 grid grid-cols-3 gap-y-6 gap-x-4" :class="colsClass">
            <template v-for="option in options" :key="option.value">
                <div
                    :class="[
                        hasValue(option.value)
                            ? 'ring-primary'
                            : 'ring-light-stroke-strong',
                        'relative flex cursor-pointer rounded-lg ring-2 bg-light-surface-primary dark:bg-dark-surface-primary p-4 shadow-sm focus:outline-none transition-all',
                    ]"
                    @click="updateCheckbox(option.value)"
                >
                    <span class="flex flex-1">
                        <span class="flex">
                            <span
                                class="block text-sm font-medium text-light-content-strong dark:text-dark-content-strong truncate"
                            >
                                {{ option.label }}
                            </span>
                            <Tooltip class="!flex items-center" v-if="option.tooltip" :text="option.tooltip">
                                <QuestionMarkCircleIcon
                                    class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                                />
                            </Tooltip>
                        </span>
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Tooltip from './Tooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(
    defineProps<{
        label?: string;
        description?: string;
        options: { label: string; value: string; tooltip?: string }[];
        modelValue: string[];
        name: string;
        required?: boolean;
        tooltip?: string;
        readmore?: string;
        colsClass?: string;
    }>(),
    {
        required: false,
        tooltip: undefined,
        readmore: undefined,
    }
);

const emit = defineEmits(['update:modelValue']);

const hasValue = (value) => localModelValue.value.find((v) => v === value);

const updateCheckbox = (value) => {
    if (hasValue(value)) {
        localModelValue.value = localModelValue.value.filter((v) => v !== value);
    } else {
        localModelValue.value = [...localModelValue.value, value];
    }
};

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
