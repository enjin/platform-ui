<template>
    <Popover block hover theme="dark">
        <template #activator>
            <slot />
        </template>
        <template #content>
            <span class="cursor-pointer text-center block">
                <div class="bg-[#1a1a1a] bg-opacity-80 rounded-md shadow-md py-2 px-3 flex flex-col max-w-xs z-30">
                    <p class="text-xs text-white">
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
