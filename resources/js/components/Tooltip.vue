<template>
    <Popover block hover :theme="useAppStore().theme">
        <template #activator>
            <slot />
        </template>
        <template #content>
            <span class="cursor-pointer text-center block">
                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary bg-opacity-90 rounded-md p-3 flex flex-col max-w-sm z-50"
                >
                    <p class="text-sm text-light-content dark:text-dark-content">
                        {{ text }}
                    </p>
                </div>
            </span>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import Popover from '~/components/Popover.vue';
import { useAppStore } from '~/store';

defineProps<{
    text: string;
}>();
</script>
