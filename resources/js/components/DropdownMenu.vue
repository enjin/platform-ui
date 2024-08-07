<template>
    <Menu as="div" class="relative ml-3 inline-block text-left">
        <div>
            <MenuButton
                class="-my-2 flex items-center rounded-full p-2 text-light-content dark:text-dark-content hover:text-light-content-strong hover:dark:text-dark-content-strong focus:outline-none focus:ring-0"
            >
                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
        </div>

        <ScaleTransition>
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-light-surface-primary dark:bg-dark-surface-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
                <div class="py-1">
                    <MenuItem v-slot="{ active }" v-for="action in actions" :key="action.name">
                        <div
                            class="cursor-pointer"
                            :class="[
                                active
                                    ? 'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong'
                                    : 'text-light-content dark:text-dark-content ',
                                'flex justify-between px-4 py-2 text-sm transition-all',
                            ]"
                            @click="emitAction(action)"
                        >
                            <span>{{ action.name }}</span>
                        </div>
                    </MenuItem>
                </div>
            </MenuItems>
        </ScaleTransition>
    </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import ScaleTransition from '~/components/ScaleTransition.vue';

defineProps<{
    actions: {
        name: string;
        component?: string;
        action?: Function;
    }[];
}>();

const emit = defineEmits(['clicked', 'loading']);

const emitAction = (action) => {
    if (action.component) {
        emit('clicked', action.component);
    } else if (action.action) {
        emit('loading');
        action.action();
    }
};
</script>
