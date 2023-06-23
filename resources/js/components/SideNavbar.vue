<template>
    <div class="w-64 flex-col hidden md:flex animate-slide-in">
        <div class="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
                <EnjinLogo class="h-8 w-auto" />
                <span class="text-lg font-semibold ml-2">Platform</span>
            </div>
            <div class="mt-5 flex flex-grow flex-col">
                <nav class="flex-1 bg-white" aria-label="Sidebar">
                    <RouterLink
                        v-for="item in navigations"
                        :key="item.name"
                        :to="item.to"
                        class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-3 font-medium transition-all"
                    >
                        <span class="flex-1">{{ item.name }}</span>
                    </RouterLink>
                </nav>
            </div>
            <div class="mt-auto px-2">
                <a
                    href="http://feedback.enjin.io"
                    target="_blank"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-4 sm:px-2 py-2 text-sm font-medium"
                >
                    Feedback
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '~/store';
import EnjinLogo from '~/components/EnjinLogo.vue';

const navigations = computed(() => useAppStore().navigations);
</script>

<style lang="scss" scoped>
.router-link-exact-active,
.router-link-active {
    @apply bg-gray-100;
    @apply text-primary;
}
</style>