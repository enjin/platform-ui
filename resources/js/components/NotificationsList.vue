<template>
    <div class="ml-4 flex flex-shrink-0 items-center">
        <Menu as="div" class="relative">
            <div>
                <Tooltip class="flex my-auto" text="Notifications on/off">
                    <MenuButton
                        dusk="notificationMenuBtn"
                        class="flex rounded-full bg-light-surface-primary dark:bg-dark-surface-primary p-1 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all"
                    >
                        <BellIcon class="h-6 w-6 text-light-content dark:text-dark-content" />
                    </MenuButton>
                </Tooltip>
            </div>
            <ScaleTransition>
                <MenuItems
                    v-if="appStore.loggedIn"
                    class="absolute right-0 z-10 mt-2 w-72 sm:w-80 origin-top-right divide-y divide-light-stroke dark:divide-dark-stroke rounded-md bg-light-surface-primary dark:bg-dark-surface-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none pt-1"
                >
                    <div
                        class="max-h-80 overflow-y-auto divide-y divide-light-stroke dark:divide-dark-stroke scrollbar-hide"
                    >
                        <MenuItem
                            v-for="item in notifications"
                            :key="item.id"
                            class="group flex flex-row justify-between overflow-hidden"
                            as="div"
                            @click.prevent="transactionRedirect(item)"
                        >
                            <div :class="[notificationColor(item.type), 'mr-2 w-0.5 flex-shrink-0']"></div>
                            <div class="flex flex-col flex-1 py-2 flex-shrink-0">
                                <p class="text-sm text-light-content-strong dark:text-dark-content-strong break-words">
                                    {{ item.text }}
                                </p>
                                <p class="text-xs mt-1 text-light-content dark:text-dark-content">
                                    {{ formatDate(item.date) }}
                                </p>
                            </div>
                            <div class="flex mx-4 w-4 flex-shrink-0">
                                <button
                                    type="button"
                                    class="sm:hidden group-hover:block animate-slide-in-left transition-all my-auto"
                                    @click.prevent="removeNotification(item.id)"
                                >
                                    <TrashIcon
                                        class="h-4 w-4 text-light-content dark:text-dark-content"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </MenuItem>
                        <div v-if="notifications.length === 0" class="my-6">
                            <p class="text-center text-sm text-light-content-strong dark:text-dark-content-strong">
                                No notifications
                            </p>
                        </div>
                    </div>

                    <div v-if="notifications.length">
                        <button
                            class="block px-4 py-2 text-sm w-full transition-all text-light-content dark:text-dark-content hover:bg-light-surface-background hover:dark:bg-dark-surface-background hover:text-light-content-strong hover:dark:text-dark-content-strong"
                            @click="clearAll"
                        >
                            Clear All
                        </button>
                    </div>
                </MenuItems>
            </ScaleTransition>
        </Menu>

        <Slideover :open="modalSlide" @close="closeModalSlide" :item="slideComponent" />
    </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import ScaleTransition from './ScaleTransition.vue';
import { useAppStore } from '~/store';
import { useNotificationsStore } from '~/store/notifications';
import { BellIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import { NotificationType } from '~/types/types.enums';
import Tooltip from './Tooltip.vue';
import { NotificationInfo } from '~/types/types.interface';
import Slideover from './Slideover.vue';
import { TransactionApi } from '~/api/transaction';

const appStore = useAppStore();
const notificationsStore = useNotificationsStore();

const modalSlide = ref(false);
const slideComponent = ref();

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
            return 'bg-light-surface-background dark:bg-dark-surface-background';
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

const getTransaction = async (id) => {
    const res = await TransactionApi.getTransaction(id);

    return res.data.GetTransaction;
};

const transactionRedirect = async (item: NotificationInfo) => {
    let transactionId;
    if (item.event) {
        transactionId = item.event;
    } else if (item.text.includes('id ')) {
        const id = item.text.match(/\d+/)?.[0];
        transactionId = id;
    }

    if (transactionId) {
        const res = await getTransaction(transactionId);
        openModalSlide('DetailsTransactionSlideover', res);
    }
};

const closeModalSlide = () => {
    modalSlide.value = false;
    setTimeout(() => {
        slideComponent.value = null;
    }, 500);
};

const openModalSlide = (componentName: string, transaction) => {
    let componentPath = 'common';
    slideComponent.value = { componentName, componentPath, ...transaction };
    modalSlide.value = true;
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
