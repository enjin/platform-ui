<template>
    <transition-group
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        move-class="transition duration-500"
    >
        <slot :notifications="sortedNotifications" :close="close" />
    </transition-group>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue';
import { NotificationType } from '~/types/types.enums';
import { events } from '~/util/snackbar';

const MAX_NOTIFICATION = 10;
const DEFAULT_TIMEOUT = 3000;

const notifications: Ref<
    {
        id: string;
        title: string;
        text: string;
        type: NotificationType;
        event: string;
        timeout: number;
    }[]
> = ref([]);

const sortedNotifications = computed(() => notifications.value.slice(0, MAX_NOTIFICATION));

const close = (id, event = false) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    if (event && notifications.value[index]?.event) {
        sendEvent(notifications.value[index].event);
    }
    notifications.value = notifications.value.filter((item) => item.id !== id);
};

const sendEvent = (id: string) => {
    events.emit('transaction', id);
};

const add = ({ notification, timeout }) => {
    if (notifications.value.find((item) => item.title === notification.title && item.title === 'Unauthorized')) {
        return;
    }
    notifications.value.push(notification);
    setTimeout(() => {
        close(notification.id);
    }, timeout || DEFAULT_TIMEOUT);
};

onMounted(() => {
    events.on('notify', add);
});
</script>
