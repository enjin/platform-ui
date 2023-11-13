<template>
    <Form ref="formRef" class="space-y-6" :validation-schema="validation">
        <div class="bg-white px-4 py-5 sm:p-6 rounded-lg" :class="{ '!p-0 sm:p-0': isModal }">
            <div :class="`md:grid md:grid-cols-${isModal ? '1' : '3'} md:gap-6`">
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
                            <div :class="`grid grid-cols-${isModal ? '1' : '2'} gap-4`">
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
                            name="maxFuelBurnPerTransaction"
                            label="Max Fuel Burn Per Transaction"
                            description="The maximum amount of fuel can be used per transaction."
                            type="number"
                        />

                        <div>
                            <div class="flex space-x-3">
                                <FormSelect
                                    v-model="permittedExtrinsicValue"
                                    :options="transactionMethods"
                                    label="Permitted Extrinsics"
                                    description="The list of permitted extrinsics in this ruleset."
                                    name="permittedExtrinsics"
                                    class="flex-1"
                                />
                                <Btn @click="addItem" class="!px-2 !flex mt-auto" primary>
                                    <PlusIcon class="w-6 h-6 m-auto" />
                                </Btn>
                            </div>
                            <div class="flex flex-wrap mt-4 gap-2" v-if="permittedExtrinsics.length">
                                <Chip
                                    v-for="(item, idx) in permittedExtrinsics"
                                    :key="(item as string)"
                                    :text="(item as string)"
                                    @remove="removeItem(idx)"
                                />
                            </div>
                        </div>

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
                                    :prefix="currencySymbol"
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
                                    :prefix="currencySymbol"
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
import { currencySymbolByNetwork, formatData, formatPriceToENJ, formatToken, parseFormatedTokenId } from '~/util';
import { TokenIdSelectType, TransactionMethods } from '~/types/types.enums';
import TokenIdInput from '~/components/TokenIdInput.vue';
import FormList from '../FormList.vue';
import { formatWhitelistedCallers, formatWhitelistedCollections } from '~/util';
import { DispatchRulesValuesInterface } from '~/types/types.interface';
import { numberNotRequiredSchema, stringNotRequiredSchema } from '~/util/schemas';
import { useAppStore } from '~/store';
import FormSelect from '../FormSelect.vue';
import { PlusIcon } from '@heroicons/vue/20/solid';
import Btn from '../Btn.vue';
import Chip from '../Chip.vue';

const emit = defineEmits(['update:modelValue', 'validation', 'close']);

const props = withDefaults(
    defineProps<{
        modelValue: DispatchRulesValuesInterface;
        isModal?: boolean;
    }>(),
    {
        isModal: false,
    }
);

const formRef = ref();
const whitelistedCallers = ref(formatWhitelistedCallers(props.modelValue.whitelistedCallers) ?? [{ caller: '' }]);
const collectionId = ref(props.modelValue.requireToken?.collectionId ?? '');
const tokenId = ref(
    parseFormatedTokenId(props.modelValue.requireToken?.tokenId ?? null) ?? {
        tokenId: '',
        tokenType: TokenIdSelectType.Integer,
    }
);
const whitelistedCollections = ref(
    formatWhitelistedCollections(props.modelValue.whitelistedCollections) ?? [{ collection: '' }]
);
const maxFuelBurnPerTransaction = ref(props.modelValue.maxFuelBurnPerTransaction ?? null);
const userFuelAmount = ref(props.modelValue.userFuelBudget?.amount ?? null);
const userFuelresetPeriod = ref(props.modelValue.userFuelBudget?.resetPeriod ?? null);
const tankFuelAmount = ref(props.modelValue.tankFuelBudget?.amount ?? null);
const tankFuelresetPeriod = ref(props.modelValue.tankFuelBudget?.resetPeriod ?? null);
const permittedExtrinsics = ref(props.modelValue.permittedExtrinsics ?? []);
const permittedExtrinsicValue = ref('');

const transactionMethods = Object.values(TransactionMethods);

const validForm = computed(() => formRef.value.getMeta().valid);
const currencySymbol = computed(() => currencySymbolByNetwork(useAppStore().config.network));

const validation = yup.object({
    whitelistedCallers: yup.array().of(
        yup.object({
            caller: yup.string(),
        })
    ),
    collectionId: stringNotRequiredSchema,
    tokenId: stringNotRequiredSchema,
    whitelistedCollections: stringNotRequiredSchema,
    maxFuelBurnPerTransaction: numberNotRequiredSchema.typeError('Max Fuel Burn Per Transaction must be a number'),
    userFuelAmount: numberNotRequiredSchema.typeError('User Fuel Amount must be a number'),
    userFuelresetPeriod: numberNotRequiredSchema.typeError('User Fuel Reset Period must be a number'),
    tankFuelAmount: numberNotRequiredSchema.typeError('Tank Fuel Amount must be a number'),
    tankFuelresetPeriod: numberNotRequiredSchema.typeError('Tank Fuel Reset Period must be a number'),
});

const addItem = () => {
    if (permittedExtrinsicValue.value === '') return;
    if (permittedExtrinsics.value.includes(permittedExtrinsicValue.value as TransactionMethods)) return;

    permittedExtrinsics.value.push(permittedExtrinsicValue.value as TransactionMethods);
    permittedExtrinsicValue.value = '';
};

const removeItem = (idx: number) => {
    permittedExtrinsics.value.splice(idx, 1);
};

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
            amount: formatPriceToENJ(userFuelAmount.value),
            resetPeriod: userFuelresetPeriod.value,
        },
        tankFuelBudget: {
            amount: formatPriceToENJ(tankFuelAmount.value),
            resetPeriod: tankFuelresetPeriod.value,
        },
        permittedExtrinsics: permittedExtrinsics.value,
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
