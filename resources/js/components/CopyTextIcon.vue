<template>
    <ClipboardIcon class="inline-block ml-1 mb-1 w-4 h-4 cursor-pointer hover:text-primary" @click="copyText" />
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
