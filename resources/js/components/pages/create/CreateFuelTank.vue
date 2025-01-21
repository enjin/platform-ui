<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 pb-20 overflow-y-auto transition-all">
        <div class="flow-root max-w-3xl mx-auto">
            <div class="mb-4">
                <h1 class="text-2xl text-light-content-strong dark:text-dark-content-strong">Create Fuel Tank</h1>
            </div>
            <Form
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @invalid-submit="invalidSubmit"
                @submit="createFueltank"
            >
                <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="">
                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <h3
                                        class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                                    >
                                        Fuel tank Details
                                    </h3>
                                </div>
                                <a href="https://docs.enjin.io/docs/creating-a-fuel-tank" target="_blank">
                                    <Btn dusk="documentationBtn" primary> Documentation </Btn>
                                </a>
                            </div>
                            <FormInput
                                v-model="name"
                                name="name"
                                label="Name"
                                description="The fuel tank name."
                                required
                            />
                            <RadioInput
                                v-model:value="coveragePolicy"
                                name="coveragePolicy"
                                label="Coverage Policy"
                                description="Defines the coverage scope for the Fuel Tank"
                                :items="coverageItems"
                            />
                            <Toggle
                                v-model:toggle="accountManagement"
                                class="mt-4"
                                label="Account Management"
                                tooltip="When enabled, users can add or remove their own accounts from the fuel tank. If disabled, only the fuel tank owner can manage accounts."
                            />
                            <FormCheckbox
                                v-model="reserveAccountCreationDeposit"
                                name="reserveAccountCreationDeposit"
                                label="Reserve Account Creation Deposit"
                                tooltip="When enabled, the fuel tank will cover the storage deposit required for creating user accounts within this fuel tank. If disabled, users will need to provide their own deposit for account creation."
                                :disabled="!accountManagement"
                                hide-label
                            />
                            <FormCheckbox
                                v-model="requireAccount"
                                name="requireAccount"
                                label="Require account"
                                tooltip="Specifies if the caller must have a Tank User Account to dispatch transactions. If true, the caller must have an account, or the dispatch will fail. If false, the caller can dispatch without an account"
                            />
                            <FormInput
                                v-model="signingAccount"
                                name="signingAccount"
                                label="Signing Account"
                                description="The wallet used to sign and broadcast the transaction. By default, this is the wallet daemon."
                            />
                            <FormInput
                                v-if="useAppStore().advanced"
                                v-model="idempotencyKey"
                                name="idempotencyKey"
                                label="Idempotency Key"
                                description="The idempotency key to set. It is recommended to use a UUID for this."
                                tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                                readmore="Idempotency Key"
                            />
                        </div>
                    </div>
                </div>

                <Btn dusk="addDispatchRuleBtn" class="!flex" @click="addItem" primary>Add Dispatch Rule</Btn>

                <CollapseCard
                    v-for="(item, idx) in dispatchRules"
                    :key="idx"
                    class="animate-fade-in"
                    :title="`Dispatch Rule ${idx + 1}`"
                    dusk="dispatchRuleCard"
                >
                    <template #icon>
                        <CheckCircleIcon
                            class="ml-2 my-auto h-5 w-5 text-green-400"
                            aria-hidden="true"
                            v-if="item.valid"
                        />
                        <XCircleIcon class="ml-2 my-auto h-5 w-5 text-red-400" aria-hidden="true" v-else />
                    </template>
                    <template #actions>
                        <XMarkIcon
                            class="h-5 w-5 cursor-pointer text-light-content-strong dark:text-dark-content-strong"
                            @click="removeItem(idx)"
                        />
                    </template>
                    <DispatchRuleForm v-model="item.values" :rule-id="idx" @validation="setValidation(idx, $event)" />
                </CollapseCard>

                <CollapseCard title="Account Rules" :actions="false" dusk="accountRulesCard">
                    <template #icon>
                        <Tooltip text="The fuel tank account rules.">
                            <QuestionMarkCircleIcon
                                class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                            />
                        </Tooltip>
                    </template>
                    <div class="space-y-6 p-6">
                        <FormList
                            v-model="whitelistedCallers"
                            flex
                            add-text="Add Caller"
                            dusk-id="caller"
                            @add="addCaller"
                            @remove="removeCaller"
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

                        <div>
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Require Token
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                The wallet account must have a specific token in their wallet to use the fuel tank.
                            </p>
                        </div>
                        <div class="grid grid-cols-2 space-x-4">
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
                </CollapseCard>

                <div class="flex justify-between">
                    <div class="flex space-x-3 justify-end">
                        <RouterLink
                            :to="{ name: 'platform.fuel-tanks' }"
                            type="button"
                            class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong hover:bg-light-surface-background hover:dark:bg-dark-surface-background !bg-opacity-50"
                        >
                            Cancel
                        </RouterLink>
                        <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import { formatData, formatToken, snackbarErrors } from '~/util';
import { useAppStore } from '~/store';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { FuelTankApi } from '~/api/fueltank';
import CollapseCard from '~/components/CollapseCard.vue';
import { CheckCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import DispatchRuleForm from '~/components/fueltank/DispatchRuleForm.vue';
import FormList from '~/components/FormList.vue';
import { DispatchRulesValuesInterface } from '~/types/types.interface';
import Tooltip from '~/components/Tooltip.vue';
import Toggle from '~/components/Toggle.vue';
import RadioInput from '~/components/RadioInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';

const router = useRouter();

const formRef = ref();
const isLoading = ref(false);
const name = ref('');
const whitelistedCallers = ref<{ caller: string }[]>([]);
const collectionId = ref('');
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const idempotencyKey = ref('');
const dispatchRules: Ref<{ valid: boolean; values: DispatchRulesValuesInterface }[]> = ref([]);
const accountManagement = ref(false);
const coveragePolicy = ref('FEES');
const requireAccount = ref(false);
const signingAccount = ref('');
const reserveAccountCreationDeposit = ref(false);

const validation = yup.object({
    name: yup.string().nullable().required(),
    coveragePolicy: yup.string().nullable(),
    accountManagement: yup.boolean().nullable(),
    reserveAccountCreationDeposit: yup.boolean().nullable(),
    requireAccount: yup.boolean().nullable(),
    signingAccount: yup.string().nullable(),
});

const isAllValid = computed(() => {
    return (
        ((dispatchRules.value.length > 0 && dispatchRules.value.every((item: any) => item.valid)) ||
            dispatchRules.value.length === 0) &&
        formRef.value.getMeta().valid
    );
});

const coverageItems = ref([
    {
        label: 'Fees',
        value: 'FEES',
        description: 'The Fuel Tank subsidizes only transaction fees.',
    },
    {
        label: 'Fees and Deposit',
        value: 'FEES_AND_DEPOSIT',
        description:
            'The Fuel Tank covers both transaction fees and any storage deposit required by the dispatched call.',
    },
]);

const addItem = () => {
    dispatchRules.value.push({
        valid: false,
        values: {},
    });
};

const removeItem = (index: number) => {
    dispatchRules.value.splice(index, 1);
};

const addCaller = () => {
    whitelistedCallers.value.push({ caller: '' });
};

const removeCaller = (index: number) => {
    whitelistedCallers.value.splice(index, 1);
};

const setValidation = (index: number, isValid: boolean) => {
    dispatchRules.value[index].valid = isValid;
};

const validateForms = async () => {
    await formRef.value.validate();
};

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const createFueltank = async () => {
    await validateForms();
    if (!isAllValid.value) {
        return;
    }

    try {
        isLoading.value = true;
        const res = await FuelTankApi.createFuelTank(
            formatData({
                name: name.value,
                reservesAccountCreationDeposit: accountManagement.value ? reserveAccountCreationDeposit.value : null,
                coveragePolicy: coveragePolicy.value,
                accountRules: {
                    whitelistedCallers: formatData(whitelistedCallers.value.map((item: any) => item.caller)),
                    requireToken: collectionId.value
                        ? {
                              collectionId: collectionId.value,
                              tokenId: formatToken(tokenId.value),
                          }
                        : null,
                },
                dispatchRules: dispatchRules.value.map((item: any) => item.values),
                requireAccount: requireAccount.value,
                signingAccount: signingAccount.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.CreateFuelTank.id;

        if (id) {
            snackbar.success({
                title: 'Fuel tank created',
                text: `Fuel tank created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.fuel-tanks' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel tank creation',
            text: 'Fuel tank creation failed',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
