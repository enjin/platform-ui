<template>
    <div class="text-light-content-strong dark:text-dark-content-strong">
        <div v-if="label" class="flex items-center">
            <label v-if="label" class="block text-sm font-medium leading-6">
                {{ label }} <span v-if="required" class="text-red-500">&nbsp;*</span>
            </label>
            <Tooltip class="!flex items-center" v-if="tooltip" :text="tooltip">
                <QuestionMarkCircleIcon class="ml-1 w-4 h-4 cursor-pointer" />
            </Tooltip>
            <ReadMoreButton v-if="readmore && !description" class="ml-2" :readmore="readmore" :dusk="duskId" />
        </div>

        <p
            v-if="description"
            class="text-sm text-light-content dark:text-dark-content"
            :class="{
                'mt-1': label,
            }"
        >
            {{ description }}
            <ReadMoreButton v-if="readmore" :readmore="readmore" :dusk="duskId" />
        </p>
    </div>
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
    duskId?: string;
}>();
</script>
