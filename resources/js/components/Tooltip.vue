<template>
    <Popover block hover theme="dark">
        <template #activator>
            <slot />
        </template>
        <template #content>
            <span class="cursor-pointer text-center block">
                <div class="bg-[#1a1a1a] bg-opacity-90 rounded-md shadow-md p-3 flex flex-col max-w-sm z-50">
                    <p class="text-sm text-white">
                        {{ text }}
                    </p>
                </div>
            </span>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import Popover from '~/components/Popover.vue';

defineProps<{
    text: string;
}>();
</script>
