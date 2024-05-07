<template>
    <div>
        <Field
            v-slot="{ handleInput, handleChange, handleBlur }"
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

            <Datepicker
                v-model="localModelValue"
                :min-date="minDate"
                :is-24="false"
                position="right"
                auto-apply
                class="mt-2 shadow-sm rounded-md"
            >
                <template #dp-input="{ value }">
                    <input
                        type="text"
                        :value="value"
                        :placeholder="placeholder"
                        class="block w-full flex-1 rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong ring-1 ring-inset ring-gray-300 placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 overflow-hidden transition-all,"
                        @input="handleInput"
                        @change="handleChange"
                        @blur="handleBlur"
                    />
                </template>
                <template #clear-icon>
                    <CalendarDaysIcon class="w-5 h-5 mr-4" />
                </template>
            </Datepicker>
        </Field>
    </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import { CalendarDaysIcon } from '@heroicons/vue/24/outline';
import InputHeader from './InputHeader.vue';

const props = withDefaults(
    defineProps<{
        modelValue: Date | null;
        label?: string;
        description?: string;
        placeholder?: string;
        required?: boolean;
        name: string;
        minDate?: Date | string | null;
        readmore?: string;
        tooltip?: string;
    }>(),
    {
        modelValue: null,
        label: undefined,
        description: undefined,
        placeholder: '',
        required: false,
        name: '',
        minDate: null,
    }
);

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => {
        return props.modelValue;
    },
    set(value) {
        if (localModelValue.value !== value) {
            emit('update:modelValue', value);
        }
    },
});

const minDate = ref(props.minDate ?? new Date(new Date().getTime()));
</script>

<style lang="scss">
.dp__arrow_bottom,
.dp__arrow_top {
    visibility: hidden;
}

.dp__button {
    border-radius: 0 0 0.5rem 0.5rem;
}

.dp__theme_light,
.dp__overlay {
    @apply rounded-lg;
}
</style>
