<template>
    <div class="absolute z-50 inset-x-0 bottom-0 flex items-center justify-center my-6">
        <div class="w-full fixed max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl top-2 right-2">
            <Snackbar v-slot="{ notifications, close }">
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    aria-live="assertive"
                    class="pointer-events-none inset-0 flex items-end px-4 py-1 sm:items-start sm:p-1"
                >
                    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <transition
                            enter-active-class="transform ease-out duration-300 transition"
                            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <div
                                @click="close(notification.id)"
                                class="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                            >
                                <div class="w-0 flex-1 p-4">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 pt-0.5">
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
                                            <p class="text-sm font-medium text-gray-900">
                                                {{ notification.title }}
                                            </p>
                                            <p class="mt-1 text-sm text-gray-500 break-all" v-if="notification.text">
                                                {{ notification.text }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex border-l border-gray-200" v-if="notification.event">
                                    <button
                                        type="button"
                                        @click="close(notification.id, true)"
                                        class="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-primary hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light"
                                    >
                                        {{ 'View' }}
                                    </button>
                                </div>
                            </div>
                        </transition>
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
