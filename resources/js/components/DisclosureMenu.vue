<template>
    <DisclosurePanel
        class="fixed bg-white left-0 right-0 md:hidden divide-y divide-gray-200 shadow-md"
        v-slot="{ close }"
        v-if="appStore.hasValidConfig"
    >
        <div class="space-y-1 py-2 px-4">
            <RouterLink
                v-for="item in navigations"
                :key="item.name"
                :to="item.to"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                @click="close"
            >
                <span class="flex-1">{{ item.name }}</span>
            </RouterLink>
        </div>
        <div class="mt-auto sm:px-2 border-t px-4 py-2">
            <a
                href="http://feedback.enjin.io"
                target="_blank"
                class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-2 py-2 text-sm font-medium"
            >
                Feedback
            </a>
        </div>
    </DisclosurePanel>
</template>

<script setup lang="ts">
import { DisclosurePanel } from '@headlessui/vue';
import { useAppStore } from '~/store';

const appStore = useAppStore();

defineProps<{
    navigations: {
        name: string;
        to: { name: string };
    }[];
}>();
</script>
