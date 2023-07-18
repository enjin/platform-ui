<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="mutateFuelTank"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Mutate Fuel Tank</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="tankId"
                            name="tankId"
                            label="Tank ID"
                            description="The wallet address of the fuel tank."
                            disabled
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
                        <Btn class="!flex" @click="addItem" primary>Add Dispatch Rule</Btn>
                        <div class="flex flex-col space-y-4" v-if="dispatchRules.length">
                            <CardToModal
                                v-for="(item, idx) in dispatchRules"
                                :key="idx"
                                class="animate-fade-in"
                                :title="`Dispatch Rule ${idx + 1}`"
                            >
                                <template #icon>
                                    <CheckCircleIcon
                                        v-if="item.valid"
                                        class="ml-2 my-auto h-5 w-5 text-green-400"
                                        aria-hidden="true"
                                    />
                                    <XCircleIcon v-else class="ml-2 my-auto h-5 w-5 text-red-400" aria-hidden="true" />
                                </template>
                                <template #actions>
                                    <XMarkIcon class="h-5 w-5 cursor-pointer" @click="removeItem(idx)" />
                                </template>

                                <template v-slot="{ close }">
                                    <DispatchRuleForm
                                        v-model="item.values"
                                        @validation="setValidation(idx, $event)"
                                        typeContent="modal"
                                        @close="close"
                                    />
                                </template>
                            </CardToModal>
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
            <Btn :loading="isLoading" primary is-submit>Mutate</Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { Ref, computed, ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, formatToken, snackbarErrors } from '~/util';
import { FuelTankApi } from '~/api/fueltank';
import TokenIdInput from '~/components/TokenIdInput.vue';
import { TokenIdSelectType } from '~/types/types.enums';
import CardToModal from '~/components/CardToModal.vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import DispatchRuleForm from '~/components/fueltank/DispatchRuleForm.vue';
import FormList from '~/components/FormList.vue';
import { addressToPublicKey } from '~/util/address';
import { DispatchRulesValuesInterface, TokenIdType } from '~/types/types.interface';
import { useAppStore } from '~/store';
import FormSelect from '~/components/FormSelect.vue';

const emit = defineEmits(['close']);

const appStore = useAppStore();

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
            providesDeposit: boolean;
            reservesExistentialDeposit: boolean;
            reservesAccountCreationDeposit: boolean;
            whitelistedCallers: { caller: string }[];
            collectionId: string;
            tokenId: TokenIdType;
            dispatchRules: any[];
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(false);
const tankId = ref(props.item?.tankId);
const providesDeposit = ref(props.item?.providesDeposit ?? false);
const reservesExistentialDeposit = ref(props.item?.reservesExistentialDeposit ?? false);
const reservesAccountCreationDeposit = ref(props.item?.reservesAccountCreationDeposit ?? false);
const whitelistedCallers = ref([{ caller: '' }]);
const collectionId = ref('');
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const dispatchRules: Ref<{ valid: boolean; values: DispatchRulesValuesInterface }[]> = ref([]);
const idempotencyKey = ref('');
const formRef = ref();

const collectionIds = computed(() => appStore.collections);

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

const validation = yup.object({
    tankId: yup.string().required(),
    providesDeposit: yup.boolean().required(),
    reservesExistentialDeposit: yup.boolean(),
    reservesAccountCreationDeposit: yup.boolean(),
    whitelistedCallers: yup.string().nullable(),
    collectionId: yup.string().nullable(),
    tokenId: yup.string().nullable(),
    idempotencyKey: yup.string().nullable(),
});

const mutateFuelTank = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi.mutateFuelTank(
            formatData({
                tankId: addressToPublicKey(tankId.value ?? ''),
                mutation: {
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
                    dispatchRules: dispatchRules.value.map((item: any) => item.values),
                },
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
