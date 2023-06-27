<template>
    <div class="ml-4 flex flex-shrink-0 items-center">
        <Menu as="div" class="relative">
            <div>
                <Tooltip class="flex my-auto" text="Notifications on/off">
                    <MenuButton
                        class="flex rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all"
                    >
                        <BellIcon class="h-6 w-6 text-gray-400" />
                    </MenuButton>
                </Tooltip>
            </div>
            <ScaleTransition>
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-72 sm:w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
                    v-if="appStore.hasValidConfig"
                >
                    <div class="max-h-80 overflow-y-auto divide-y divide-gray-100 scrollbar-hide">
                        <MenuItem
                            class="group flex flex-row justify-between overflow-hidden"
                            as="div"
                            @click.prevent=""
                            v-for="item in notifications"
                            :key="item.id"
                        >
                            <div :class="[notificationColor(item.type), 'mr-2 w-0.5 flex-shrink-0']"></div>
                            <div class="flex flex-col flex-1 py-2 flex-shrink-0">
                                <p class="text-sm text-gray-900 break-words">{{ item.text }}</p>
                                <p class="text-xs mt-1 text-gray-500">
                                    {{ formatDate(item.date) }}
                                </p>
                            </div>
                            <div class="flex mx-4 w-4 flex-shrink-0">
                                <button
                                    type="button"
                                    class="sm:hidden group-hover:block animate-slide-in-left transition-all my-auto"
                                    @click.prevent="removeNotification(item.id)"
                                >
                                    <TrashIcon class="h-4 w-4 text-gray-500" aria-hidden="true" />
                                </button>
                            </div>
                        </MenuItem>
                        <div v-if="notifications.length === 0" class="my-6">
                            <p class="text-center text-sm">No notifications</p>
                        </div>
                    </div>

                    <div v-if="notifications.length">
                        <button
                            class="block px-4 py-2 text-sm w-full transition-all text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            @click="clearAll"
                        >
                            Clear All
                        </button>
                    </div>
                </MenuItems>
            </ScaleTransition>
        </Menu>
    </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import { useAppStore } from '~/store';
import { useNotificationsStore } from '~/store/notifications';
import { BellIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import { NotificationType } from '~/types/types.enums';
import Tooltip from './Tooltip.vue';

const appStore = useAppStore();
const notificationsStore = useNotificationsStore();

const notifications = computed(() => notificationsStore.notifications);

const notificationColor = (type: NotificationType) => {
    switch (type) {
        case NotificationType.Success:
            return 'bg-green-400';
        case NotificationType.Error:
            return 'bg-red-400';
        case NotificationType.Info:
            return 'bg-blue-400';
        default:
            return 'bg-gray-100';
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};

const removeNotification = (id) => {
    notificationsStore.removeNotification(id);
};

const clearAll = () => {
    notificationsStore.clearAll();
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
