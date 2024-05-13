<template>
    <Form ref="formRef" class="space-y-6" :validation-schema="validation">
        <div
            class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-5 sm:p-6 rounded-lg"
            :class="{ '!p-0 sm:p-0': isModal }"
        >
            <div class="space-y-6">
                <div class="flex items-center">
                    <h3
                        class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                    >
                        Dispatch Rules
                    </h3>
                    <Tooltip
                        text="These are evaluated upon call dispatches. Composed of one to many rule sets each containing
                        different rule definitions. All rules are independent of each other, so they can be used both
                        separately and together, allowing great flexibity when creating a rule set. These rule sets then
                        allow different means of access to the same fuel tank, where each set is identified by u32 and
                        user must provide rule set ID when dispatching a call through fuel tank."
                    >
                        <QuestionMarkCircleIcon
                            class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                        />
                    </Tooltip>
                </div>
                <FormInput
                    v-if="props.ruleId"
                    v-model="ruleId"
                    name="ruleId"
                    label="Rule set ID"
                    type="number"
                    disabled
                />
                <div class="flex space-x-3">
                    <FormSelect
                        v-model="selectedDispatchRule"
                        :options="availableDispatchRules"
                        label="Choose a dispatch rule"
                        description=""
                        name="selectedDispatchRule"
                        class="flex-1"
                    />
                    <Btn @click="addDispatchRuleItem" class="!px-2 !flex mt-auto" primary>
                        <PlusIcon class="w-6 h-6 m-auto" />
                    </Btn>
                </div>
                <div class="space-y-6 divide-y-[1px] divide-light-stroke dark:divide-dark-stroke">
                    <div v-if="checkSelectedDispatchRule(DispatchRules.WhitelistedCallers)" class="relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.WhitelistedCallers)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <FormList
                            v-model="whitelistedCallers"
                            @add="addCaller"
                            @remove="removeCaller"
                            flex
                            add-text="Add Caller"
                            dusk-id="caller"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Whitelisted Callers
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The wallet accounts that are allowed to use the fuel tank.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.caller"
                                        :dusk="`input__caller-${index + 1}`"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                    />
                                </div>
                            </template>
                        </FormList>
                    </div>

                    <div v-if="checkSelectedDispatchRule(DispatchRules.RequireToken)" class="space-y-2 relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.RequireToken)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <div>
                            <h3
                                class="text-sm font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Require Token
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                The wallet account must have a specific token in their wallet to use the fuel tank.
                            </p>
                        </div>
                        <div :class="`grid grid-cols-${isModal ? '1' : '2'} gap-4`">
                            <FormInput
                                class="col-span-1"
                                v-model="collectionId"
                                name="collectionId"
                                type="number"
                                placeholder="Collection ID"
                            />
                            <TokenIdInput class="col-span-1" v-model="tokenId" placeholder="Token ID" />
                        </div>
                    </div>

                    <div v-if="checkSelectedDispatchRule(DispatchRules.WhitelistedCollections)" class="relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.WhitelistedCollections)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <FormList
                            v-model="whitelistedCollections"
                            @add="addWhiteCollection"
                            @remove="removeWhiteCollection"
                            flex
                            add-text="Add Collection"
                            dusk-id="collection"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label
                                        class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Whitelisted Collections
                                    </label>
                                    <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                        The wallet account must have a specific token in their wallet to use the fuel
                                        tank.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs, index }">
                                <div class="flex-1">
                                    <FormInput
                                        v-model="inputs.collection"
                                        :name="`collection-${index + 1}`"
                                        type="number"
                                        :dusk="`input__collection-id-${index + 1}`"
                                    />
                                </div>
                            </template>
                        </FormList>
                    </div>

                    <div
                        v-if="checkSelectedDispatchRule(DispatchRules.MaxFuelBurnPerTransaction)"
                        class="relative pt-3"
                    >
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.MaxFuelBurnPerTransaction)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <FormInput
                            v-model="maxFuelBurnPerTransaction"
                            name="maxFuelBurnPerTransaction"
                            label="Max Fuel Burn Per Transaction"
                            description="The maximum amount of fuel can be used per transaction."
                            type="number"
                        />
                    </div>

                    <div v-if="checkSelectedDispatchRule(DispatchRules.PermittedExtrinsic)" class="relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.PermittedExtrinsic)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
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

                    <div v-if="checkSelectedDispatchRule(DispatchRules.UserFuelBudget)" class="space-y-2 relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.UserFuelBudget)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <div>
                            <h3
                                class="text-sm font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                User Fuel Budget
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                The rule for fuel budget.
                            </p>
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

                    <div v-if="checkSelectedDispatchRule(DispatchRules.TankFuelBudget)" class="space-y-2 relative pt-3">
                        <div
                            class="absolute -right-1 top-1 cursor-pointer rounded-full p-2 hover:bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 transition-all text-red-400"
                            @click="removeSelectedDispatch(DispatchRules.TankFuelBudget)"
                        >
                            <XMarkIcon class="w-6 h-6 m-auto" />
                        </div>
                        <div>
                            <h3
                                class="text-sm font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Tank Fuel Budget
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                The rule for fuel budget.
                            </p>
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
    </Form>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import FormInput from '~/components/FormInput.vue';
import { currencySymbolByNetwork, formatData, formatPriceToENJ, formatToken, parseFormatedTokenId } from '~/util';
import { TokenIdSelectType, TransactionMethods, DispatchRules } from '~/types/types.enums';
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
import Tooltip from '../Tooltip.vue';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['update:modelValue', 'validation', 'close']);

const props = withDefaults(
    defineProps<{
        modelValue: DispatchRulesValuesInterface;
        isModal?: boolean;
        ruleId?: number;
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
const ruleId = ref(props.ruleId);
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
const selectedDispatchRule = ref('');
const selectedDispatchRules: Ref<DispatchRules[]> = ref([]);

const transactionMethods = Object.values(TransactionMethods);
const allowedDispatchRules = Object.values(DispatchRules);

const availableDispatchRules = allowedDispatchRules.filter((rule) => !selectedDispatchRules.value.includes(rule));
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

const addDispatchRuleItem = () => {
    if (selectedDispatchRule.value === '') return;
    if (selectedDispatchRules.value.includes(selectedDispatchRule.value as DispatchRules)) return;

    selectedDispatchRules.value.push(selectedDispatchRule.value as DispatchRules);
    selectedDispatchRule.value = '';
};

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

const checkSelectedDispatchRule = (rule: DispatchRules) => {
    return selectedDispatchRules.value.includes(rule);
};

const removeSelectedDispatch = (rule: DispatchRules) => {
    const index = selectedDispatchRules.value.indexOf(rule);
    if (index > -1) {
        selectedDispatchRules.value.splice(index, 1);
    }
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
        setTimeout(() => {
            emit('validation', validForm.value);
            emit('update:modelValue', hasChanged.value);
        }, 50);
    }
);
</script>
