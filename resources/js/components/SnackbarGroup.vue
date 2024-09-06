<template>
    <div class="absolute z-50 inset-x-0 bottom-0 flex items-center justify-center my-6">
        <div class="w-full fixed max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl top-2">
            <Snackbar v-slot="{ notifications, close }">
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    aria-live="assertive"
                    class="pointer-events-none inset-0 flex items-center px-4 py-1 sm:p-1"
                >
                    <div class="flex w-full flex-col items-center space-y-4">
                        <div
                            @click="close(notification.id)"
                            class="pointer-events-auto flex w-full max-w-md rounded-lg bg-light-surface-primary dark:bg-dark-surface-primary shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            <div class="w-0 flex-1 p-4 relative overflow-hidden rounded-lg">
                                <div
                                    class="absolute w-8 h-8 left-2 top-4 blur-xl"
                                    :class="{
                                        'bg-green-300': notification.type === NotificationType.Success,
                                        'bg-blue-300': notification.type === NotificationType.Info,
                                        'bg-red-300': notification.type === NotificationType.Error,
                                    }"
                                ></div>
                                <div class="flex items-center z-10 relative">
                                    <div
                                        class="flex-shrink-0 p-1 bg-light-surface-primary dark:bg-dark-surface-primary rounded-lg shadow-sm"
                                    >
                                        <CheckCircleIcon
                                            v-if="notification.type === NotificationType.Success"
                                            class="h-6 w-6 text-green-400"
                                            aria-hidden="true"
                                        />
                                        <ExclamationCircleIcon
                                            v-if="notification.type === NotificationType.Info"
                                            class="h-6 w-6 text-blue-400"
                                            aria-hidden="true"
                                        />
                                        <XCircleIcon
                                            v-if="notification.type === NotificationType.Error"
                                            class="h-6 w-6 text-red-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div class="ml-3 w-0 flex-1">
                                        <p
                                            class="text-sm font-medium text-light-content-strong dark:text-dark-content-strong"
                                        >
                                            {{ notification.title }}
                                        </p>
                                        <p
                                            class="mt-1 text-sm text-light-content dark:text-dark-content break-words"
                                            v-if="notification.text"
                                        >
                                            {{ notification.text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="notification.event"
                                class="flex border-l border-light-stroke dark:border-dark-stroke"
                            >
                                <button
                                    type="button"
                                    @click="close(notification.id, true)"
                                    class="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-primary hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light"
                                >
                                    {{ 'View' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Snackbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import Snackbar from '~/components/Snackbar.vue';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { NotificationType } from '~/types/types.enums';
</script>
