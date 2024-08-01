<template>
    <span
        :dusk="`btn__readmore-${dusk}`"
        class="underline text-light-content dark:text-dark-content cursor-pointer text-xs"
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
    if (props.readmore && props.readmore.includes('http')) {
        window.open(props.readmore, '_blank');
    } else {
        events.emit('readmore', props.readmore);
    }
};
</script>
