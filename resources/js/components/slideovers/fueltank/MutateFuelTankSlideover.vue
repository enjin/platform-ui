<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        :validation-schema="validation"
        @invalid-submit="invalidSubmit"
        @submit="mutateFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Mutate Fuel Tank
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-light-stroke dark:divide-dark-stroke px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="tankId"
                            name="tankId"
                            label="Tank ID"
                            description="The wallet address of the fuel tank."
                            disabled
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
                        <FormInput
                            v-if="useAppStore().advanced"
                            v-model="signingAccount"
                            name="signingAccount"
                            label="Signing Account"
                            description="The wallet used to sign and broadcast the transaction. By default, this is the wallet daemon."
                        />
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
                        <div class="flex flex-row space-x-4">
                            <FormSelect
                                v-model="collectionId"
                                class="flex-1"
                                name="collectionId"
                                placeholder="Select a collection ID"
                                :options="collectionIds"
                            />
                            <TokenIdInput class="flex-1" v-model="tokenId" placeholder="Token ID" />
                        </div>
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
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Mutate</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { computed, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, formatToken, snackbarErrors } from '~/util';
import { FuelTankApi } from '~/api/fueltank';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import FormList from '~/components/FormList.vue';
import { addressToPublicKey } from '~/util/address';
import { TokenIdType } from '~/types/types.interface';
import { useAppStore } from '~/store';
import FormSelect from '~/components/FormSelect.vue';
import { stringNotRequiredSchema, stringRequiredSchema } from '~/util/schemas';
import RadioInput from '~/components/RadioInput.vue';
import Toggle from '~/components/Toggle.vue';

const emit = defineEmits(['close']);

const appStore = useAppStore();

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
            reservesAccountCreationDeposit: boolean;
            coveragePolicy: string;
            isFrozen: boolean;
            signingAccount: string;
            whitelistedCallers: { caller: string }[];
            collectionId: string;
            tokenId: TokenIdType;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tankId = ref(props.item?.tankId);
const whitelistedCallers = ref<{ caller: string }[]>([]);
const collectionId = ref('');
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const idempotencyKey = ref('');
const formRef = ref();
const accountManagement = ref(props.item?.reservesAccountCreationDeposit ? true : false);
const coveragePolicy = ref(props.item?.coveragePolicy ?? '');
const signingAccount = ref(props.item?.signingAccount ?? '');
const reserveAccountCreationDeposit = ref(props.item?.reservesAccountCreationDeposit ?? false);

const collectionIds = computed(() => appStore.collections);

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

const addCaller = () => {
    whitelistedCallers.value.push({ caller: '' });
};

const removeCaller = (index: number) => {
    whitelistedCallers.value.splice(index, 1);
};

const validation = yup.object({
    tankId: stringRequiredSchema,
    coveragePolicy: yup.string().nullable(),
    accountManagement: yup.boolean().nullable(),
    reserveAccountCreationDeposit: yup.boolean().nullable(),
    signingAccount: yup.string().nullable(),
    whitelistedCallers: yup.array().of(
        yup.object({
            caller: stringRequiredSchema,
        })
    ),
    collectionId: stringNotRequiredSchema,
    tokenId: stringNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
});

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const mutateFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) {
        return;
    }

    if (!props.item?.isFrozen) {
        snackbar.error({
            title: 'Fuel Tank mutation',
            text: 'Fuel tank need to be frozen to mutate',
        });

        return;
    }

    try {
        isLoading.value = true;
        const res = await FuelTankApi.mutateFuelTank(
            formatData({
                tankId: addressToPublicKey(tankId.value!),
                mutation: {
                    reservesAccountCreationDeposit: accountManagement.value
                        ? reserveAccountCreationDeposit.value
                        : null,
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
                },
                signingAccount: signingAccount.value,
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.MutateFuelTank?.id;

        if (id) {
            snackbar.success({
                title: 'Fuel Tank mutated',
                text: `Fuel Tank mutate with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Fuel Tank mutation',
            text: 'Fuel Tank mutation failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};
</script>
