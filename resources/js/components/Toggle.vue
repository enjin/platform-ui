<template>
    <div class="flex space-x-4">
        <InputHeader
            :label="props.label"
            :required="props.required"
            :description="props.description"
            :readmore="props.readmore"
            :tooltip="props.tooltip"
        />
        <Switch
            v-model="toggleModel"
            :class="[
                toggleModel ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-400',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            ]"
        >
            <span
                aria-hidden="true"
                :class="[
                    toggleModel ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                ]"
            />
        </Switch>
    </div>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue';
import InputHeader from './InputHeader.vue';

const toggleModel = defineModel<boolean>('toggle', {
    default: false,
});

const props = defineProps<{
    label?: string;
    description?: string;
    readmore?: string;
    tooltip?: string;
    required?: boolean;
}>();
</script>
