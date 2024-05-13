<template>
    <div>
        <Field v-slot="{ field, errorMessage }" v-model="localModelValue" :name="name">
            <InputHeader
                :label="label"
                :required="required"
                :description="description"
                :readmore="readmore"
                :tooltip="tooltip"
            />

            <Combobox v-bind="field" v-model="localModelValue">
                <div class="relative rounded-md shadow-sm mt-2" :class="{ '!mt-0': !label }">
                    <p v-if="errorMessage" class="absolute left-0 -bottom-5 text-red-500 text-xs truncate">
                        {{ errorMessage }}
                    </p>
                    <div
                        class="relative w-full cursor-default overflow-hidden bg-light-surface-primary dark:bg-dark-surface-primary text-left text-sm leading-6 transition-all"
                    >
                        <ComboboxInput
                            class="w-full py-2.5 pl-3 pr-10 text-sm leading-5 border-0 text-light-content-strong dark:text-dark-content-strong ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary rounded-md transition-all disabled:bg-dark-surface-background/10 disabled:dark:bg-light-surface-background/10 bg-light-surface-background dark:bg-dark-surface-background"
                            autocomplete="off"
                            @change="query = $event.target.value"
                            @click="openSelect"
                        />
                        <ComboboxButton ref="comboButtonRef" class="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                class="h-5 w-5 text-light-content dark:text-dark-content"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                    </div>
                    <TransitionRoot
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        @after-leave="query = ''"
                    >
                        <ComboboxOptions
                            class="absolute mt-1 max-h-60 overflow-auto rounded-md bg-light-surface-primary dark:bg-dark-surface-primary text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30 py-1 w-full"
                        >
                            <div
                                v-if="filteredOptions.length === 0 && query !== ''"
                                class="relative cursor-default select-none py-2 px-4 text-light-content dark:text-dark-content"
                            >
                                Nothing found.
                            </div>

                            <ComboboxOption
                                v-for="(option, idx) in filteredOptions"
                                as="template"
                                :key="idx"
                                :value="option"
                                v-slot="{ selected, active }"
                            >
                                <li
                                    class="relative cursor-default select-none py-2 pl-10 pr-4 transition-all"
                                    :class="{
                                        'bg-light-surface-primary/10 text-light-content-strong dark:text-dark-content-strong':
                                            active,
                                        'text-light-content-strong dark:text-dark-content-strong': !active,
                                    }"
                                >
                                    <span
                                        class="block truncate"
                                        :class="{ 'font-medium': selected, 'font-normal': !selected }"
                                    >
                                        {{ option }}
                                    </span>
                                    <span
                                        v-if="selected"
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600"
                                    >
                                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                    </span>
                                </li>
                            </ComboboxOption>
                        </ComboboxOptions>
                    </TransitionRoot>
                </div>
            </Combobox>
        </Field>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { Field } from 'vee-validate';
import InputHeader from '~/components/InputHeader.vue';
import { useAppStore } from '~/store';

const props = withDefaults(
    defineProps<{
        modelValue: string | number | undefined;
        label?: string;
        description?: string;
        options: string[];
        name: string;
        required?: boolean;
        tooltip?: string;
        readmore?: string;
        placeholder?: string;
    }>(),
    {
        label: undefined,
        description: undefined,
        required: false,
        tooltip: undefined,
        readmore: undefined,
        placeholder: 'Select an option',
    }
);

const emit = defineEmits(['update:modelValue', 'inputChange']);

const query = ref('');
const comboButtonRef = ref();

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        if (localModelValue.value !== value) {
            emit('update:modelValue', value);
        }
    },
});

const filteredOptions = computed(() =>
    query.value === ''
        ? props.options
        : props.options?.filter((option) =>
              option.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, ''))
          )
);

const openSelect = () => {
    if (useAppStore().newCollection) {
        useAppStore().fetchCollectionIds();
    }
    comboButtonRef.value.el.click();
};
</script>
