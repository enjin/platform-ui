<template>
    <button
        :disabled="disabled"
        :type="isSubmit ? 'submit' : 'button'"
        class="inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold shadow-sm transition-all truncate"
        :class="{
            'text-white bg-primary hover:bg-primary-light': primary,
            'text-white bg-red-500 hover:bg-red-600': error,
            'text-light-content-strong dark:text-dark-content-strong bg-light-surface-primary dark:bg-dark-surface-primary hover:bg-gray-50 ring-1 ring-inset ring-gray-300':
                basic && !error && !primary,
            'px-5': loading,
            '!bg-gray-400': disabled,
        }"
    >
        <template v-if="loading">
            <LoadingCircle class="my-auto" :class="primary && '!text-white'" :size="20" />
        </template>
        <template v-else>
            <slot />
        </template>
    </button>
</template>

<script setup lang="ts">
import LoadingCircle from '~/components/LoadingCircle.vue';

withDefaults(
    defineProps<{
        loading?: boolean;
        disabled?: boolean;
        primary?: boolean;
        isSubmit?: boolean;
        error?: boolean;
        basic?: boolean;
    }>(),
    {
        basic: true,
    }
);
</script>
