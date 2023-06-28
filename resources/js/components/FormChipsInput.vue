<template>
    <div>
        <Field
            ref="fieldRef"
            v-slot="{ field, errorMessage }"
            v-model="localModelValue"
            :validate-on-input="true"
            :validate-on-mount="false"
            :name="name"
        >
            <InputHeader
                :label="label"
                :required="required"
                :description="description"
                :readmore="readmore"
                :tooltip="tooltip"
            />

            <input class="hidden" v-bind="{ ...field }" />
            <div
                class="mt-2 flex flex-col space-y-2 rounded-md p-2 flex-1 flex-shrink-0 border-0 text-gray-900 ring-1 ring-inset ring-gray-300 overflow-hidden transition-all"
            >
                <div class="flex space-x-3">
                    <FormInput
                        v-model="input"
                        class="flex-1 !mt-0"
                        input-class="!p-0 !ring-0 !shadow-none !transition-none"
                        name="inputChips"
                        has-focus
                        :placeholder="placeholder"
                        :have-shadow="false"
                        @submit="addItem"
                    />
                </div>
                <div class="flex flex-wrap gap-2 transition-all" v-if="localModelValue.length">
                    <Chip
                        v-for="(item, idx) in localModelValue"
                        :key="idx"
                        :text="item"
                        :is-error="checkError(item)"
                        @remove="removeItem(idx)"
                        class="animate-fade-in"
                    />
                </div>
            </div>
            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
        </Field>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Chip from './Chip.vue';
import FormInput from './FormInput.vue';
import InputHeader from './InputHeader.vue';
import { Field } from 'vee-validate';

const props = defineProps<{
    label?: string;
    placeholder: string;
    name: string;
    modelValue: string[];
    required?: boolean;
    description?: string;
    readmore?: string;
    tooltip?: string;
    regexFunction?: Function;
}>();

const emit = defineEmits(['update:modelValue', 'change', 'submit']);

const input = ref('');
const fieldRef = ref();

const addItem = async () => {
    if (input.value === '') return;

    localModelValue.value.push(input.value);
    input.value = '';
    await fieldRef.value.validate();
};

const removeItem = async (idx: number) => {
    localModelValue.value.splice(idx, 1);
    await fieldRef.value.validate();
};

const checkError = (item: string) => {
    if (props.regexFunction) {
        return !props.regexFunction(item);
    }

    return false;
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
</script>
