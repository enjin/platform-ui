<template>
    <div class="cursor-pointer flex items-center" @click="copyText">
        <slot />
        <ClipboardIcon class="inline-block ml-1 my-auto w-4 h-4 hover:text-primary flex-shrink-0" />
    </div>
</template>

<script setup lang="ts">
import { ClipboardIcon } from '@heroicons/vue/24/outline';
import snackbar from '~/util/snackbar';

const props = defineProps<{
    text: string;
}>();

const copyText = () => {
    navigator.clipboard.writeText(props.text);
    snackbar.info({ title: 'Copied to clipboard!' });
};
</script>
