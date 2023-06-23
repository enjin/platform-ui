<template>
    <Form ref="formRef" class="space-y-6" :validation-schema="validation">
        <div class="bg-white px-4 py-5 sm:p-6 rounded-b-lg" :class="{ '!p-2': typeContent == 'modal' }">
            <div :class="`md:grid md:grid-cols-${typeContent == 'modal' ? '1' : '3'} md:gap-6`">
                <div class="md:col-span-1">
                    <h3 class="text-base font-semibold leading-6 text-gray-900">Dispatch Rule</h3>
                    <p class="mt-1 text-sm text-gray-500">The fuel tank dispatch rules.</p>
                </div>
                <div class="mt-5 md:col-span-2 md:mt-0">
                    <div class="flex flex-col gap-6">
                        <FormList
                            v-model="whitelistedCallers"
                            @add="addCaller"
                            @remove="removeCaller"
                            flex
                            add-text="Add Caller"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900">
                                        Whitelisted Callers
                                    </label>
                                    <p class="mt-1 text-sm text-gray-500">
                                        The wallet accounts that are allowed to use the fuel tank.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.caller"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </template>
                        </FormList>

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-base font-semibold leading-6 text-gray-900">Require Token</h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    The wallet account must have a specific token in their wallet to use the fuel tank.
                                </p>
                            </div>
                            <div :class="`grid grid-cols-${typeContent === 'modal' ? '1' : '2'} gap-4`">
                                <FormInput
                                    class="col-span-1"
                                    v-model="collectionId"
                                    name="collectionId"
                                    placeholder="Collection ID"
                                />
                                <TokenIdInput class="col-span-1" v-model="tokenId" placeholder="Token ID" />
                            </div>
                        </div>

                        <FormList
                            v-model="whitelistedCollections"
                            @add="addWhiteCollection"
                            @remove="removeWhiteCollection"
                            flex
                            add-text="Add Collection"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900">
                                        Whitelisted Collections
                                    </label>
                                    <p class="mt-1 text-sm text-gray-500">
                                        The wallet account must have a specific token in their wallet to use the fuel
                                        tank.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.collection"
                                        type="number"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </template>
                        </FormList>

                        <FormInput
                            v-model="maxFuelBurnPerTransaction"
                            name="claimQuantity"
                            label="Claim Quantity"
                            description="The total amount of times each token ID can be claimed. This is mainly relevant for fungible tokens, where you can specify that there are a certain amount of claims for a token ID, e.g. 10 individual claims to receive 1 token with ID 123 per claim."
                            type="number"
                        />

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-base font-semibold leading-6 text-gray-900">User Fuel Budget</h3>
                                <p class="mt-1 text-sm text-gray-500">The rule for fuel budget.</p>
                            </div>
                            <div class="grid grid-cols-2 space-x-4">
                                <FormInput
                                    class="col-span-1"
                                    v-model="userFuelAmount"
                                    name="userFuelAmount"
                                    placeholder="Amount"
                                    type="number"
                                />
                                <FormInput
                                    class="col-span-1"
                                    v-model="userFuelresetPeriod"
                                    name="userFuelresetPeriod"
                                    placeholder="Reset Period"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-base font-semibold leading-6 text-gray-900">Tank Fuel Budget</h3>
                                <p class="mt-1 text-sm text-gray-500">The rule for fuel budget.</p>
                            </div>
                            <div class="grid grid-cols-2 space-x-4">
                                <FormInput
                                    class="col-span-1"
                                    v-model="tankFuelAmount"
                                    name="tankFuelAmount"
                                    placeholder="Amount"
                                    type="number"
                                />
                                <FormInput
                                    class="col-span-1"
                                    v-model="tankFuelresetPeriod"
                                    name="tankFuelresetPeriod"
                                    placeholder="Reset Period"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col" v-if="typeContent === 'modal'">
                            <Btn primary @click="emit('close')"> Save </Btn>
                        </div>
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
import { formatData, formatToken, parseFormatedTokenId } from '~/util';
import { TokenIdSelectType } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import Btn from '../Btn.vue';
import FormList from '../FormList.vue';
import { formatWhitelistedCallers, formatWhitelistedCollections } from '~/util';
import { DispatchRulesValuesInterface } from '~/types/types.interface';
import { numberNotRequiredSchema, stringNotRequiredSchema } from '~/util/schemas';

const emit = defineEmits(['update:modelValue', 'validation', 'close']);

const props = withDefaults(
    defineProps<{
        modelValue: DispatchRulesValuesInterface;
        typeContent?: 'form' | 'modal';
    }>(),
    {
        typeContent: 'form',
    }
);

const formRef = ref();
const whitelistedCallers = ref(formatWhitelistedCallers(props.modelValue.whitelistedCallers) ?? [{ caller: '' }]);
const collectionId = ref(props.modelValue.requireToken?.collectionId ?? '');
const tokenId = ref(
    parseFormatedTokenId(props.modelValue.requireToken?.tokenId) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const whitelistedCollections = ref(
    formatWhitelistedCollections(props.modelValue.whitelistedCollections) ?? [{ collection: '' }]
);
const maxFuelBurnPerTransaction = ref(props.modelValue.maxFuelBurnPerTransaction ?? '');
const userFuelAmount = ref(props.modelValue.userFuelBudget?.amount ?? '');
const userFuelresetPeriod = ref(props.modelValue.userFuelBudget?.resetPeriod ?? '');
const tankFuelAmount = ref(props.modelValue.tankFuelBudget?.amount ?? '');
const tankFuelresetPeriod = ref(props.modelValue.tankFuelBudget?.resetPeriod ?? '');

const validForm = computed(() => formRef.value.getMeta().valid);

const validation = yup.object({
    whitelistedCallers: yup.array().of(
        yup.object({
            caller: yup.string(),
        })
    ),
    collectionId: stringNotRequiredSchema,
    tokenId: stringNotRequiredSchema,
    whitelistedCollections: stringNotRequiredSchema,
    maxFuelBurnPerTransaction: numberNotRequiredSchema,
    userFuelAmount: numberNotRequiredSchema.typeError('User Fuel Amount must be a number'),
    userFuelresetPeriod: numberNotRequiredSchema.typeError('User Fuel Reset Period must be a number'),
    tankFuelAmount: numberNotRequiredSchema.typeError('Tank Fuel Amount must be a number'),
    tankFuelresetPeriod: numberNotRequiredSchema.typeError('Tank Fuel Reset Period must be a number'),
});

const addCaller = () => {
    whitelistedCallers.value.push({ caller: '' });
};

const removeCaller = (index: number) => {
    whitelistedCallers.value.splice(index, 1);
};

const addWhiteCollection = () => {
    whitelistedCollections.value.push({ caller: '' });
};

const removeWhiteCollection = (index: number) => {
    whitelistedCollections.value.splice(index, 1);
};

const hasChanged = computed(() =>
    formatData({
        whitelistedCallers: whitelistedCallers.value.map((item: any) => item.caller),
        requireToken: {
            collectionId: collectionId.value,
            tokenId: formatToken(tokenId.value),
        },
        whitelistedCollections: whitelistedCollections.value.map((item: any) => item.collection),
        maxFuelBurnPerTransaction: maxFuelBurnPerTransaction.value,
        userFuelBudget: {
            amount: userFuelAmount.value,
            resetPeriod: userFuelresetPeriod.value,
        },
        tankFuelBudget: {
            amount: tankFuelAmount.value,
            resetPeriod: tankFuelresetPeriod.value,
        },
    })
);

watch(
    () => hasChanged.value,
    async () => {
        await formRef.value.validate();
        emit('validation', validForm.value);
        emit('update:modelValue', hasChanged.value);
    }
);
</script>