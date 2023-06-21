<template>
    <div class="flex items-center">
        <label v-if="label" class="block text-sm font-medium leading-6 text-gray-900">
            {{ label }} <span v-if="required" class="text-red-500">&nbsp;*</span>
        </label>
        <Tooltip class="!flex items-center" v-if="tooltip" :text="tooltip">
            <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
        </Tooltip>
        <ReadMoreButton v-if="readmore && !description" class="ml-2" :readmore="readmore" />
    </div>

    <p class="mt-1 text-sm text-gray-500" v-if="description">
        {{ description }}
        <ReadMoreButton v-if="readmore" :readmore="readmore" />
    </p>
</template>

<script setup lang="ts">
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import ReadMoreButton from './ReadMoreButton.vue';
import Tooltip from './Tooltip.vue';

defineProps<{
    label?: string;
    description?: string;
    tooltip?: string;
    readmore?: string;
    required?: boolean;
}>();
</script>
