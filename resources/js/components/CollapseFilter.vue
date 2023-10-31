<template>
    <Popover ref="popperRef" theme="dark" @open:popper="open = true" @close:popper="open = false">
        <template #activator>
            <Btn ref="btnOpenerRef" :class="open ? 'ring-1 ring-primary' : 'text-opacity-90'">
                <span class="text-sm text-gray-900 hover:text-opacity-100 font-normal">{{ label }}</span>
                <span class="ml-2 w-2 text-sm text-gray-500 font-normal">{{ localModelValue.length }}</span>
                <ChevronDownIcon
                    class="ml-2 h-5 w-5 text-gray-900 transition duration-150 ease-in-out group-hover:text-opacity-80"
                    aria-hidden="true"
                />
            </Btn>
        </template>
        <template #content>
            <div class="bg-white rounded-md shadow-md p-4 flex flex-col w-[320px] z-10">
                <div class="flex space-x-3">
                    <FormInput
                        v-if="type === 'text'"
                        class="flex-1 !mt-0"
                        :name="name"
                        :placeholder="placeholder"
                        v-model="filter"
                        @submit="addItem"
                    />
                    <FormSelect
                        v-else-if="type === 'select' && options"
                        class="flex-1 !mt-0"
                        :name="name"
                        :placeholder="placeholder"
                        v-model="filter"
                        :options="options"
                    />
                    <Btn @click="addItem" class="!py-1 !px-2 !flex" primary>
                        <PlusIcon class="w-6 h-6 m-auto" />
                    </Btn>
                </div>
                <div class="flex flex-wrap mt-4 gap-2" v-if="localModelValue.length">
                    <Chip
                        v-for="(item, idx) in localModelValue"
                        :key="(item as string)"
                        :text="(item as string)"
                        @remove="removeItem(idx)"
                    />
                </div>
            </div>
        </template>
    </Popover>
</template>

<script setup lang="ts">
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/20/solid';
import { ref, computed, onMounted } from 'vue';
import Btn from '~/components/Btn.vue';
import Chip from '~/components/Chip.vue';
import FormInput from '~/components/FormInput.vue';
import FormSelect from '~/components/FormSelect.vue';
import Popover from '~/components/Popover.vue';

const props = withDefaults(
    defineProps<{
        label: string;
        placeholder: string;
        name: string;
        modelValue: string[];
        options?: string[];
        type?: string;
    }>(),
    {
        type: 'text',
        options: undefined,
    }
);

const emit = defineEmits(['update:modelValue', 'change']);

const filter = ref('');
const btnOpenerRef = ref();
const popperRef = ref();
const open = ref(false);

const addItem = () => {
    if (filter.value === '') return;
    if (props.type === 'select' && localModelValue.value.includes(filter.value)) return;

    localModelValue.value.push(filter.value);
    filter.value = '';
};

const removeItem = (idx: number) => {
    localModelValue.value.splice(idx, 1);
};

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('change');
        emit('update:modelValue', value);
    },
});

onMounted(() => {
    popperRef.value.$parent.$parent.$el.addEventListener('scroll', () => {
        if (btnOpenerRef.value && open.value) {
            btnOpenerRef.value.$el.click();
        }
    });
});
</script>
