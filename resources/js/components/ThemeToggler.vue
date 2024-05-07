<template>
    <div class="ml-4 cursor-pointer text-light-content dark:text-dark-content" @click="toggleTheme">
        <MoonIcon v-if="!isDarkTheme" class="w-6 h-6" />
        <SunIcon v-else class="w-6 h-6" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';

const appStore = useAppStore();

const isDarkTheme = computed(() => appStore.theme === 'dark');

const isAppearanceTransition =
    document.startViewTransition && !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

const toggleTheme = (event?: MouseEvent) => {
    if (!isAppearanceTransition) {
        const newTheme = appStore.theme === 'light' ? 'dark' : 'light';
        appStore.setTheme(newTheme);

        return;
    }

    const x = event?.clientX ?? 0;
    const y = event?.clientY ?? 0;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
        const newTheme = appStore.theme === 'light' ? 'dark' : 'light';
        appStore.setTheme(newTheme);
    });

    transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
        document.documentElement.animate(
            {
                clipPath: isDarkTheme.value ? clipPath : [...clipPath].reverse(),
            },
            {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: isDarkTheme.value ? '::view-transition-new(root)' : '::view-transition-old(root)',
            }
        );
    });
};
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}
::view-transition-old(root) {
    z-index: 9999;
}
::view-transition-new(root) {
    z-index: 1;
}
.dark::view-transition-old(root) {
    z-index: 1;
}
.dark::view-transition-new(root) {
    z-index: 9999;
}
</style>
