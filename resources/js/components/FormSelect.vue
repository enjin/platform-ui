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
                <div class="mt-2 relative rounded-md shadow-sm" :class="{ '!mt-0': !label }">
                    <div
                        class="relative w-full cursor-default overflow-hidden bg-white text-left text-sm leading-6 transition-all"
                    >
                        <ComboboxInput
                            :class="`w-full py-2 pl-3 pr-10 text-sm leading-5 border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary rounded-md transition-all disabled:bg-gray-100 {inputClass}`"
                            @change="query = $event.target.value"
                            @click="openSelect"
                        />
                        <ComboboxButton ref="comboButtonRef" class="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>
                    </div>
                    <TransitionRoot
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        @after-leave="query = ''"
                    >
                        <ComboboxOptions
                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30"
                        >
                            <div
                                v-if="filteredOptions.length === 0 && query !== ''"
                                class="relative cursor-default select-none py-2 px-4 text-gray-700"
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
                                        'bg-primary-light/10': active,
                                        'text-gray-900': !active,
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

            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
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
        label?: string;
        description?: string;
        options: string[];
        modelValue: string | number;
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
