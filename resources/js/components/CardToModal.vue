<template>
    <div class="bg-light-surface-primary dark:bg-dark-surface-primary shadow rounded-lg">
        <div
            class="flex divide-x divide-light-stroke dark:divide-dark-stroke transition-all"
            :class="{ 'border-b border-light-stroke dark:border-dark-stroke': open }"
        >
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
            <div class="flex items-center p-4">
                <slot name="actions" />
            </div>
        </div>
        <Modal :is-open="open" :close="() => (open = false)" width="max-w-xl">
            <slot :close="() => (open = false)" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import Modal from './Modal.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
});

const open = ref(false);

const toggleCard = () => {
    open.value = !open.value;
};
</script>
