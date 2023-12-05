<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto transition-all">
        <div class="flow-root space-y-4 pb-4">
            <div class="mb-4">
                <h1 class="text-2xl">Create Fuel Tank</h1>
            </div>
            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createFueltank">
                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Parameters</h3>
                            <p class="mt-1 text-sm text-gray-500">Mutation for creating a beam.</p>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormInput
                                    v-model="name"
                                    name="name"
                                    label="Name"
                                    description="The fuel tank name."
                                    required
                                />
                                <FormCheckbox
                                    v-model="providesDeposit"
                                    name="providesDeposit"
                                    label="Provides Deposit"
                                    description="The flag for deposit."
                                />
                                <FormCheckbox
                                    v-model="reservesExistentialDeposit"
                                    name="reservesExistentialDeposit"
                                    label="Reserves Existential Deposit"
                                    description="The flag for existential deposit."
                                />
                                <FormCheckbox
                                    v-model="reservesAccountCreationDeposit"
                                    name="reservesAccountCreationDeposit"
                                    label="Reserves Account Creation Deposit"
                                    description="The flag for account creation deposit."
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
                </div>

                <div class="bg-white px-4 py-5 shadow rounded-lg transition-all sm:p-6">
                    <div class="md:grid md:grid-cols-3 md:gap-6">
                        <div class="md:col-span-1">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Account Rules</h3>
                            <p class="mt-1 text-sm text-gray-500">The fuel tank account rules.</p>
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

                                <div>
                                    <h3 class="text-base font-semibold leading-6 text-gray-900">Require Token</h3>
                                    <p class="mt-1 text-sm text-gray-500">
                                        The wallet account must have a specific token in their wallet to use the fuel
                                        tank.
                                    </p>
                                </div>
                                <div class="grid grid-cols-2 space-x-4">
                                    <FormInput
                                        class="col-span-1"
                                        v-model="collectionId"
                                        name="collectionId"
                                        placeholder="Collection ID"
                                    />
                                    <TokenIdInput class="col-span-1" v-model="tokenId" placeholder="Token ID" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between">
                    <Btn class="!m-0 !flex" @click="addItem" primary>Add Dispatch Rule</Btn>
                    <div class="flex space-x-3 justify-end">
                        <RouterLink
                            :to="{ name: 'platform.collections' }"
                            type="button"
                            class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </RouterLink>
                        <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                    </div>
                </div>

                <CollapseCard
                    v-for="(item, idx) in dispatchRules"
                    :key="idx"
                    class="animate-fade-in"
                    :title="`Dispatch Rule ${idx + 1}`"
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
                        <XMarkIcon class="h-5 w-5 cursor-pointer" @click="removeItem(idx)" />
                    </template>
                    <DispatchRuleForm v-model="item.values" @validation="setValidation(idx, $event)" />
                </CollapseCard>
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
import FormCheckbox from '~/components/FormCheckbox.vue';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import { FuelTankApi } from '~/api/fueltank';
import CollapseCard from '~/components/CollapseCard.vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import DispatchRuleForm from '~/components/fueltank/DispatchRuleForm.vue';
import FormList from '~/components/FormList.vue';
import { DispatchRulesValuesInterface } from '~/types/types.interface';

const router = useRouter();

const formRef = ref();
const isLoading = ref(false);
const name = ref('');
const providesDeposit = ref(false);
const reservesExistentialDeposit = ref(false);
const reservesAccountCreationDeposit = ref(false);
const whitelistedCallers = ref([{ caller: '' }]);
const collectionId = ref('');
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const idempotencyKey = ref('');
const dispatchRules: Ref<{ valid: boolean; values: DispatchRulesValuesInterface }[]> = ref([]);

const validation = yup.object({
    name: yup.string().nullable().required(),
});

const isAllValid = computed(() => {
    return (
        ((dispatchRules.value.length > 0 && dispatchRules.value.every((item: any) => item.valid)) ||
            dispatchRules.value.length === 0) &&
        formRef.value.getMeta().valid
    );
});

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

const createFueltank = async () => {
    await validateForms();
    if (!isAllValid.value) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.createFuelTank(
            formatData({
                name: name.value,
                providesDeposit: providesDeposit.value,
                reservesExistentialDeposit: reservesExistentialDeposit.value,
                reservesAccountCreationDeposit: reservesAccountCreationDeposit.value,
                accountRules: {
                    whitelistedCallers: whitelistedCallers.value.map((item: any) => item.caller),
                    requireToken: collectionId.value
                        ? {
                              collectionId: collectionId.value,
                              tokenId: formatToken(tokenId.value),
                          }
                        : null,
                },
                idempotencyKey: idempotencyKey.value,
                dispatchRules: dispatchRules.value.map((item: any) => item.values),
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
