<template>
    <Form ref="formRef" class="space-y-6" :validation-schema="createValidation">
        <div class="bg-white px-4 py-5 sm:p-6 rounded-b-lg">
            <div class="space-y-6">
                <div class="md:col-span-1">
                    <h3 class="text-base font-semibold leading-6 text-gray-900">Token Details</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Enter all the details regarding the tokens that you are adding in this Enjin Beam
                    </p>
                </div>
                <div class="">
                    <div class="flex flex-col gap-6">
                        <FormChipsInput
                            v-model="tokenIds"
                            name="tokenIds"
                            label="Token IDs"
                            tooltip="The token chain IDs available to claim."
                            placeholder="1, 2 or 10..20 (Integers range)"
                            :regex-function="testInteger"
                        />
                        <FormInput
                            v-model="tokenQuantityPerClaim"
                            name="tokenQuantityPerClaim"
                            label="Token Quantity Per Claim"
                            tooltip="The quantity of token that can be received per claim."
                            type="number"
                        />
                        <FormInput
                            v-model="claimQuantity"
                            name="claimQuantity"
                            label="Claim Quantity"
                            tooltip="The total amount of times each token ID can be claimed. This is mainly relevant for fungible tokens, where you can specify that there are a certain amount of claims for a token ID, e.g. 10 individual claims to receive 1 token with ID 123 per claim."
                            type="number"
                        />
                        <FormSelect
                            v-model="beamType"
                            :options="beamTypes"
                            name="type"
                            label="Type"
                            description="The beam type."
                            readmore="Beam Types"
                        />
                        <FormList
                            v-model="attributes"
                            flex
                            label="Attributes"
                            description="Set initial attributes for this token."
                            @add="addAttributeItem"
                            @remove="removeAttributeItem"
                            readmore="Attributes"
                            tooltip="This method of beam creation mints the tokens beforehand instead of using already minted tokens, which is why it needs to have attributes for the metadata of the token"
                            dusk-id="attributes"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900"> Key </label>
                                    <p class="mt-1 text-sm text-gray-500">The attribute key.</p>
                                </div>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900"> Value </label>
                                    <p class="mt-1 text-sm text-gray-500">The attribute value.</p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.key"
                                        :dusk="`input__attribute-key-${index + 1}`"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.value"
                                        :dusk="`input__attribute-value-${index + 1}`"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </template>
                        </FormList>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '~/components/FormInput.vue';
import { formatData } from '~/util';
import { BeamType } from '~/types/types.enums';
import FormSelect from '~/components/FormSelect.vue';
import FormList from '~/components/FormList.vue';
import FormChipsInput from '../FormChipsInput.vue';
import { integerOrRangeSchema, testInteger } from '~/util/schemas';
import { ClaimTokenValuesInterface } from '~/types/types.interface';

const emit = defineEmits(['update:modelValue', 'validation']);

const props = defineProps<{
    modelValue: ClaimTokenValuesInterface;
}>();

const formRef = ref();
const beamType = ref(props.modelValue.type ?? BeamType.TRANSFER_TOKEN);
const tokenIds = ref(props.modelValue.tokenIds ?? []);
const tokenQuantityPerClaim = ref(props.modelValue.tokenQuantityPerClaim ?? 1);
const claimQuantity = ref(props.modelValue.claimQuantity ?? 1);

const beamTypes = Object.values(BeamType);

const validForm = computed(() => formRef.value.getMeta().valid);

const attributes = ref(
    props.modelValue.attributes ?? [
        {
            key: '',
            value: '',
        },
    ]
);

const createValidation = yup.object({
    tokenIds: integerOrRangeSchema,
    tokenQuantityPerClaim: yup.number().typeError('Token quantity per claim must be a number'),
    claimQuantity: yup.number().typeError('Claim quantity must be a number'),
    beamType: yup.string(),
});

const hasChanged = computed(() =>
    formatData({
        tokenIds: tokenIds.value,
        tokenQuantityPerClaim: parseInt(tokenQuantityPerClaim.value.toString()),
        claimQuantity: parseInt(claimQuantity.value.toString()),
        type: beamType.value,
        attributes: attributes.value.filter((a) => a.key !== '' && a.value !== ''),
    })
);

const addAttributeItem = () => {
    attributes.value.push({
        key: '',
        value: '',
    });
};

const removeAttributeItem = (index: number) => {
    attributes.value.splice(index, 1);
};

watch(
    () => hasChanged.value,
    async () => {
        await formRef.value.validate();
        setTimeout(() => {
            emit('validation', validForm.value);
            emit('update:modelValue', hasChanged.value);
        }, 50);
    }
);
</script>
