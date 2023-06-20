import { defineStore } from 'pinia';
import { NotificationsState, NotificationInfo } from '~/types/types.interface';

export const useNotificationsStore = defineStore('notifications', {
    state: (): NotificationsState => ({
        notifications: [],
    }),
    persist: {
        paths: ['notifications'],
    },
    actions: {
        addNotification(notification: NotificationInfo) {
            if (!notification.text) return;
            if (this.notifications.filter((n) => n.id === notification.id).length > 0) return;
            this.notifications = [notification, ...this.notifications];
        },
        removeNotification(id) {
            this.notifications = this.notifications.filter((n) => n.id !== id);
        },
        clearAll() {
            this.notifications = [];
        },
    },
});
