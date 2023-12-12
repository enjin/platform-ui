<template>
    <span
        :dusk="`btn__readmore-${dusk}`"
        class="underline text-gray-400 cursor-pointer text-xs"
        @click="sendReadmoreEvent"
    >
        Read more
    </span>
</template>

<script setup lang="ts">
import { events } from '~/util/snackbar';

const props = defineProps<{
    readmore?: string;
    dusk?: string;
}>();

const sendReadmoreEvent = () => {
    events.emit('readmore', props.readmore);
};
</script>
