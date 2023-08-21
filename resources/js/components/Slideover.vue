<template>
    <TransitionRoot as="template" :show="open">
        <Dialog :initialFocus="initialFocusRef" as="div" class="relative z-40" @close="emit('close')">
            <div class="fixed inset-0" />
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full"
                        >
                            <DialogPanel class="pointer-events-auto w-screen max-w-xs md:max-w-lg transition-all">
                                <div ref="initialFocusRef"></div>
                                <component
                                    :is="component"
                                    :item="item"
                                    @close="emit('close')"
                                    @update="($event) => emit('update', $event)"
                                />
                                <XMarkIcon
                                    class="absolute top-0 right-0 w-6 h-6 mt-4 mr-6 text-black cursor-pointer hover:text-gray-500 transition-all"
                                    @click="emit('close')"
                                />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { defineAsyncComponent, shallowRef, watch } from 'vue';

const emit = defineEmits(['close', 'update']);

const component = shallowRef();
const initialFocusRef = shallowRef();

const props = withDefaults(
    defineProps<{
        open: boolean;
        item?: { [key: string]: string };
    }>(),
    {
        open: false,
        item: undefined,
    }
);

const loadComponent = () => {
    component.value = defineAsyncComponent({
        loader: () => import(`~/components/slideovers/${props.item?.componentPath}/${props.item?.componentName}.vue`),
        timeout: 3000,
        suspensible: false,
    });
};

watch(
    () => props.open,
    (newVal) => {
        if (newVal) {
            loadComponent();
        }
    }
);
</script>
