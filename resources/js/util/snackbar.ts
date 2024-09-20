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
    link?: {
        text: string;
        to: string;
    };
}

export default {
    notify(
        params: { title: string; text: string; link: any; type: NotificationType; event?: string },
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
                id: Math.random().toString(36).substring(2, 9),
                type: params.type,
                text: params.text.length > 0 ? params.text : params.title,
                date: new Date().toISOString(),
                event: params.event,
            });
        }
    },
    success({ title, link, text = '', time = 5000, event, save = true }: NotificationParams) {
        this.notify({ title, text, link, type: NotificationType.Success, event }, time, save);
    },
    info({ title, link, text = '', time = 5000, save = false }: NotificationParams) {
        this.notify({ title, text, link, type: NotificationType.Info }, time, save);
    },
    error({ title, link, text = '', time = 5000, save = false }: NotificationParams) {
        this.notify({ title, text, link, type: NotificationType.Error }, time, save);
    },
};
