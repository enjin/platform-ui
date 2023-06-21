<template>
    <span class="underline text-gray-400 cursor-pointer text-xs" @click="sendReadmoreEvent">Read more</span>
</template>

<script setup lang="ts">
import { events } from '~/util/snackbar';

const props = defineProps<{
    readmore?: string;
}>();

const sendReadmoreEvent = () => {
    events.emit('readmore', props.readmore);
};
</script>
