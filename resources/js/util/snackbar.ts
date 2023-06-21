import EventEmitter from 'eventemitter3';
import { useNotificationsStore } from '~/store/notifications';
import { NotificationType } from '~/types/types.enums';

export const events = new EventEmitter();
let count = 0;

interface NotificationParams {
    title: string;
    text?: string;
    time?: number;
    event?: string;
    save?: boolean;
}

export default {
    notify(
        params: { title: string; text: string; type: NotificationType; event?: string },
        time = 3000,
        save: boolean
    ) {
        events.emit('notify', {
            notification: {
                id: ++count,
                ...params,
            },
            timeout: time,
        });
        if (save) {
            useNotificationsStore().addNotification({
                id:
                    params.text.toLowerCase() === 'unauthorized'
                        ? params.text.toLowerCase()
                        : Math.random().toString(36).substring(2, 9),
                type: params.type,
                text: params.text.length > 0 ? params.text : params.title,
                date: new Date().toISOString(),
            });
        }
    },
    success({ title, text = '', time = 5000, event, save = true }: NotificationParams) {
        this.notify({ title, text, type: NotificationType.Success, event }, time, save);
    },
    info({ title, text = '', time = 5000, save = false }: NotificationParams) {
        this.notify({ title, text, type: NotificationType.Info }, time, save);
    },
    error({ title, text = '', time = 5000, save = false }: NotificationParams) {
        this.notify({ title, text, type: NotificationType.Error }, time, save);
    },
};
