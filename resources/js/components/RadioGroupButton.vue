<template>
    <RadioGroup v-model="localModelValue">
        <RadioGroupLabel
            class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
            v-if="label"
        >
            {{ label }}
        </RadioGroupLabel>
        <div
            :class="[
                {
                    'md:grid-cols-2': cols === 2,
                    'md:grid-cols-3': cols === 3,
                    'md:grid-cols-4': cols === 4,
                    'md:grid-cols-5': cols === 5,
                },
                `mt-4 grid grid-cols-2 gap-y-6 gap-x-4`,
            ]"
        >
            <RadioGroupOption
                v-for="item in items"
                as="template"
                :value="item.value"
                :key="item.value"
                :dusk="item.key"
                v-slot="{ checked, active }"
            >
                <div
                    :class="[
                        active || checked ? 'ring-primary' : 'ring-light-stroke-strong dark:ring-dark-stroke-strong',
                        'relative flex cursor-pointer rounded-lg ring-2 bg-light-surface-primary dark:bg-dark-surface-primary p-4 outline-none transition-all',
                    ]"
                >
                    <span class="flex flex-1 items-center break-words">
                        <span class="flex flex-col">
                            <RadioGroupLabel
                                as="span"
                                class="block text-sm font-medium text-light-content-strong dark:text-dark-content-strong"
                            >
                                {{ item.label }}
                            </RadioGroupLabel>
                        </span>
                    </span>
                    <span
                        :class="[
                            active || checked ? '' : 'border-2',
                            'pointer-events-none absolute -inset-px rounded-lg transition-all',
                        ]"
                        aria-hidden="true"
                    />
                </div>
            </RadioGroupOption>
        </div>
    </RadioGroup>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        label?: string;
        items: { label: string; value: string; key?: string }[];
        modelValue: string | boolean;
        cols: number;
    }>(),
    {
        label: undefined,
        cols: 2,
    }
);

const emit = defineEmits(['update:modelValue']);

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
