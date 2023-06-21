<template>
    <div>
        <div v-if="isLoading || hasErrors" :class="containerClass">
            <LoadingCircle v-if="isLoading" :size="size" />
            <h3 v-else class="text-2xl">
                {{ statusMessage }}
            </h3>
        </div>
        <slot v-else />
    </div>
</template>

<script setup lang="ts">
import LoadingCircle from '~/components/LoadingCircle.vue';

withDefaults(
    defineProps<{
        size?: number;
        isLoading: boolean;
        hasErrors?: boolean;
        statusMessage?: string;
        containerClass?: string;
    }>(),
    {
        size: 48,
        hasErrors: false,
        statusMessage: '',
        containerClass: 'py-[20vh]',
    }
);
</script>
