<template>
    <div class="w-full max-w-md">
        <RadioGroup v-model="selected">
            <InputHeader
                :label="label"
                :required="required"
                :description="description"
                :readmore="readmore"
                :tooltip="tooltip"
            />

            <div class="space-y-2 mt-4">
                <RadioGroupOption
                    as="template"
                    v-for="item in props.items"
                    :key="item.key"
                    :value="item.value"
                    v-slot="{ checked }"
                >
                    <div
                        :class="[
                            checked
                                ? 'bg-primary/90 text-white border-transparent'
                                : ' bg-light-surface-background dark:bg-dark-surface-background',
                        ]"
                        class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-sm border outline-none focus:outline-none transition-all"
                    >
                        <div class="flex w-full items-center justify-between">
                            <div class="flex items-center">
                                <div class="text-sm">
                                    <RadioGroupLabel
                                        as="p"
                                        :class="checked ? 'text-white' : 'text-gray-900 dark:text-white'"
                                        class="font-medium transition-all"
                                    >
                                        {{ item.label }}
                                    </RadioGroupLabel>
                                    <RadioGroupDescription
                                        as="span"
                                        :class="checked ? 'text-sky-100' : 'text-gray-500'"
                                        class="inline transition-all"
                                    >
                                        {{ item.description }}
                                    </RadioGroupDescription>
                                </div>
                            </div>
                            <div v-show="checked" class="shrink-0 text-white">
                                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
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
                </RadioGroupOption>
            </div>
        </RadioGroup>
    </div>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupDescription, RadioGroupOption } from '@headlessui/vue';
import InputHeader from './InputHeader.vue';

const selected = defineModel<string>('value');

const props = defineProps<{
    label?: string;
    items: { label: string; description?: string; tooltip?: string; value: string; key?: string }[];
    required?: boolean;
    tooltip?: string;
    description?: string;
    readmore?: string;
}>();
</script>
