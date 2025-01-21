<template>
    <div class="w-full max-w-md">
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
        <div class="space-y-2 mt-4">
            <template v-for="option in options" :key="option.value">
                <div
                    :class="[
                        hasValue(option.value)
                            ? 'bg-primary/90 text-white '
                            : 'bg-light-surface-background dark:bg-dark-surface-background',
                    ]"
                    class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md outline-none focus:outline-none transition-all"
                    @click="updateCheckbox(option.value)"
                >
                    <div class="flex w-full items-center justify-between">
                        <div class="flex items-center">
                            <div class="text-sm">
                                <label
                                    :class="hasValue(option.value) ? 'text-white' : 'text-gray-900 dark:text-white'"
                                    class="flex font-medium transition-all"
                                >
                                    {{ option.label }}
                                    <Tooltip v-if="option.tooltip" class="!flex items-center" :text="option.tooltip">
                                        <QuestionMarkCircleIcon
                                            class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                                            :class="hasValue(option.value) ? '!text-white' : ''"
                                        />
                                    </Tooltip>
                                </label>
                            </div>
                        </div>
                        <div v-show="hasValue(option.value)" class="shrink-0 text-white">
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
