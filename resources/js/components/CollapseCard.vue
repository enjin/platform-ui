<template>
    <div class="bg-white shadow rounded-lg">
        <div class="flex divide-x divide-gray-200 transition-all" :class="{ 'border-b border-gray-200': open }">
            <div class="flex justify-between px-4 py-5 flex-1" @click="toggleCard">
                <div class="inline-flex">
                    <label>{{ title }}</label>
                    <slot name="icon" />
                </div>
                <div class="flex space-x-2">
                    <ChevronDownIcon
                        class="h-5 w-5 cursor-pointer transition-all"
                        :class="{ '-rotate-180': open }"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div v-if="actions" class="flex items-center p-4">
                <slot name="actions" />
            </div>
        </div>
        <transition
            enter-active-class="duration-300"
            enter-from-class="transform opacity-0 max-h-0 delay-150"
            enter-to-class="opacity-100 max-h-[300px]"
            leave-active-class="duration-300"
            leave-from-class="opacity-100 max-h-[300px]"
            leave-to-class="transform opacity-0 max-h-0"
        >
            <slot v-if="open" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(
    defineProps<{
        title: string;
        actions?: boolean;
        isOpen?: boolean;
    }>(),
    {
        actions: true,
        isOpen: false,
    }
);

const open = ref(props.isOpen);

const toggleCard = () => {
    open.value = !open.value;
};
</script>
