<template>
    <div class="space-y-4" :class="{ 'md:!flex md:!flex-col': flex }">
        <div class="" v-if="label || description">
            <div class="flex" v-if="label">
                <h3 class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong">
                    {{ label }}
                </h3>
                <Tooltip class="!flex items-center" v-if="tooltip" :text="tooltip">
                    <QuestionMarkCircleIcon
                        class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                    />
                </Tooltip>
            </div>

            <p v-if="description" class="mt-1 text-sm text-light-content dark:text-dark-content">
                {{ description }}
                <ReadMoreButton v-if="readmore" :readmore="readmore" :dusk="duskId" />
            </p>
        </div>

        <div class="space-y-4">
            <div class="flex flex-row flex-nowrap gap-3 md:gap-6">
                <slot name="headers" />
            </div>

            <transition-group
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div v-for="(item, idx) in localItems" :key="idx" class="flex flex-row flex-nowrap gap-3 md:gap-6">
                    <slot name="inputs" :inputs="item" :index="idx" />

                    <button
                        type="button"
                        :dusk="`btn__remove-item-${idx + 1}`"
                        class="my-auto cursor-pointer"
                        @click="emit('remove', idx)"
                    >
                        <TrashIcon class="h-5 w-5 text-red-600" aria-hidden="true" />
                    </button>
                </div>
            </transition-group>

            <Btn @click="emit('add')" primary class="text-xs" :dusk="`btn__add-item-${duskId}`">{{ addText }}</Btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuestionMarkCircleIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import Btn from '~/components/Btn.vue';
import Tooltip from './Tooltip.vue';
import ReadMoreButton from './ReadMoreButton.vue';
import { TokenIdType } from '~/types/types.interface';

const props = withDefaults(
    defineProps<{
        modelValue: { [key: string]: string & { [key: string]: string } & TokenIdType }[] | any[];
        label?: string;
        description?: string;
        flex?: boolean;
        tooltip?: string;
        readmore?: string;
        addText?: string;
        duskId?: string;
    }>(),
    {
        flex: false,
        tooltip: undefined,
        readmore: undefined,
        addText: 'Add Item',
    }
);

const emit = defineEmits(['update:modelValue', 'add', 'remove']);

const localItems = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
</script>
