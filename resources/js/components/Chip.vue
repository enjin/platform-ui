<template>
    <div
        class="inline-flex rounded-md px-1 truncate"
        :class="{
            'bg-red-500 !text-white ': isError,
            'bg-slate-200 text-slate-600': !isError,
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
                'text-gray-400': !isError,
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
