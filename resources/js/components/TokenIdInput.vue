<template>
    <FormInput
        v-model="localModelValue"
        :name="name"
        :label="label"
        :placeholder="placeholder"
        :description="description"
        :required="required"
        :disabled="disabled"
        has-addon
        @input-change="emit('searchTokensChange', $event)"
        :tooltip="tooltip"
        :readmore="readmore"
    >
        <template #input>
            <TranslateTransition>
                <div class="block w-16" v-if="localTokenType === TokenIdSelectType.Erc1155">
                    <FormInput name="index" v-model="localIndex" placeholder="Index" input-class="!rounded-none" />
                </div>
            </TranslateTransition>
        </template>
        <template #addon>
            <div class="rounded-r-md border border-l-0 border-gray-300 inset-y-0 right-0 flex items-center z-10">
                <select
                    v-model="localTokenType"
                    name="tokenType"
                    :disabled="disabled"
                    class="h-full rounded-r-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary text-sm disabled:bg-gray-100"
                >
                    <option v-for="tokenType in tokenTypes" :key="tokenType" :value="tokenType">
                        <span class="uppercase">
                            {{ tokenType.charAt(0).toUpperCase() + tokenType.slice(1) }}
                        </span>
                    </option>
                </select>
            </div>
        </template>
    </FormInput>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TokenIdSelectType } from '~/types/types.enums';
import FormInput from '~/components/FormInput.vue';
import TranslateTransition from '~/components/TranslateTransition.vue';
import { TokenIdType } from '~/types/types.interface';

const props = withDefaults(
    defineProps<{
        label?: string;
        modelValue: TokenIdType;
        description?: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        name?: string;
        tooltip?: string;
        readmore?: string;
    }>(),
    {
        label: undefined,
        required: false,
        disabled: false,
        name: 'tokenId',
        tooltip: undefined,
        readmore: undefined,
    }
);

const emit = defineEmits(['update:modelValue', 'searchTokensChange']);

const localTokenType = computed({
    get() {
        return props.modelValue.tokenType;
    },
    set(value) {
        emit('update:modelValue', {
            tokenId: props.modelValue.tokenId,
            tokenType: value,
            index: props.modelValue.index,
        });
    },
});

const tokenTypes = Object.values(TokenIdSelectType);

const localIndex = computed({
    get() {
        return props.modelValue.index;
    },
    set(value) {
        emit('update:modelValue', {
            tokenId: props.modelValue.tokenId,
            tokenType: props.modelValue.tokenType,
            index: value,
        });
    },
});

const localModelValue = computed({
    get() {
        return props.modelValue.tokenId;
    },
    set(value) {
        emit('update:modelValue', {
            tokenId: value,
            tokenType: props.modelValue.tokenType,
            index: props.modelValue.index,
        });
    },
});
</script>
