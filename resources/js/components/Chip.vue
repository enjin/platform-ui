<template>
    <div
        class="inline-flex rounded-md px-1 truncate"
        :class="{
            'bg-red-500 !text-white ': isError,
            'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong':
                !isError,
        }"
    >
        <span
            class="py-2 px-1 text-xs inline-block whitespace-nowrap text-center align-baseline font-bold leading-none truncate"
        >
            {{ text }}
        </span>
        <XMarkIcon
            v-if="closable"
            class="h-5 w-5 ml-auto my-auto cursor-pointer flex-shrink-0"
            :class="{
                'text-light-content dark:text-dark-content': !isError,
            }"
            @click="emit('remove')"
        />
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid';

withDefaults(
    defineProps<{
        text: string | number;
        closable?: boolean;
        isError?: boolean;
    }>(),
    {
        closable: true,
        isError: false,
    }
);

const emit = defineEmits(['remove']);
</script>
