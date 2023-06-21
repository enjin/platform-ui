<template>
    <Form
        ref="formRef"
        class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
        :validation-schema="validation"
        @submit="formAction"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Accounts</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <RadioGroupButton
                    class="px-4 sm:px-6 pt-6 w-full"
                    v-model="actionType"
                    label="Select action type"
                    :items="actions"
                    :cols="actions.length"
                />
                <div class="divide-y divide-gray-200 px-4 sm:px-6" v-if="actionType !== 'list'">
                    <div class="space-y-6 pt-6 pb-5">
                        <FormInput
                            v-model="tankId"
                            name="tankId"
                            label="Tank ID"
                            description="The wallet address of the fuel tank."
                            disabled
                            required
                        />
                        <FormList
                            v-model="usersInputs"
                            @add="addUserInput"
                            @remove="removeUserInput"
                            flex
                            add-text="Add User"
                        >
                            <template #headers>
                                <div class="flex-1">
                                    <label class="block text-sm font-medium leading-6 text-gray-900"> User ID </label>
                                    <p class="mt-1 text-sm text-gray-500">
                                        The wallet account to be
                                        {{ actionType === 'add' ? 'added to' : 'removed from' }}
                                        the fuel tank.
                                    </p>
                                </div>
                                <div class="w-5"></div>
                            </template>
                            <template #inputs="{ inputs }">
                                <div class="flex-1">
                                    <input
                                        v-model="inputs.userId"
                                        type="text"
                                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </template>
                        </FormList>
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
                <div v-else>
                    <LoadingContent
                        class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
                        :is-loading="isLoading"
                    >
                        <table class="min-w-full divide-y divide-gray-300" v-if="accounts.items?.length">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                    >
                                        Account
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                <tr
                                    v-for="(account, idx) in accounts.items"
                                    :key="idx"
                                    :class="idx % 2 === 0 ? undefined : 'bg-gray-50'"
                                >
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ account.owner }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <NoItems v-else />
                    </LoadingContent>
                    <LoadingCircle v-if="isPaginationLoading" class="mx-auto py-4" />
                    <div ref="paginatorRef"></div>
                </div>
            </div>
        </div>
        <div class="flex space-x-3 flex-shrink-0 justify-end px-4 py-4" v-if="actionType !== 'list'">
            <Btn @click="closeSlide">Cancel</Btn>
            <Btn :loading="isLoading" primary is-submit>
                {{ actionType === 'add' ? 'Add' : 'Remove' }}
            </Btn>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import * as yup from 'yup';
import { ref, computed, onMounted, Ref } from 'vue';
import FormInput from '~/components/FormInput.vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { formatData, snackbarErrors } from '~/util';
import RadioGroupButton from '~/components/RadioGroupButton.vue';
import FormList from '~/components/FormList.vue';
import { FuelTankApi } from '~/api/fueltank';
import { DTOAccountFactory as DTOFactory } from '~/factory/account';
import LoadingCircle from '~/components/LoadingCircle.vue';
import LoadingContent from '~/components/LoadingContent.vue';
import { addressToPublicKey } from '~/util/address';
import NoItems from '~/components/NoItems.vue';
import { useAppStore } from '~/store';

const emit = defineEmits(['close']);

const props = withDefaults(
    defineProps<{
        item?: {
            tankId: string;
            name: string;
            description: string;
            owner: string;
            createdAt: string;
            updatedAt: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const isLoading = ref(true);
const actionType = ref('list');
const usersInputs = ref([{ userId: '' }]);
const actions = ref([
    {
        label: 'List',
        value: 'list',
        apiFunction: () => 'getAccounts',
        key: () => 'GetAccounts',
    },
    {
        label: 'Add',
        value: 'add',
        apiFunction: () => (usersInputs.value.length === 1 ? 'addAccount' : 'batchAddAccount'),
        key: () => (usersInputs.value.length === 1 ? 'AddAccount' : 'BatchAddAccount'),
    },
    {
        label: 'Remove',
        value: 'remove',
        apiFunction: () => (usersInputs.value.length === 1 ? 'removeAccount' : 'batchRemoveAccount'),
        key: () => (usersInputs.value.length === 1 ? 'RemoveAccount' : 'BatchRemoveAccount'),
    },
]);
const isPaginationLoading = ref(false);
const accounts: Ref<{
    items: {
        owner: string;
    }[];
    cursor: string | null;
}> = ref({
    items: [],
    cursor: null,
});
const tankId = ref(props.item?.tankId ?? '');
const idempotencyKey = ref('');
const formRef = ref();
const paginatorRef = ref();

const validation = yup.object({});

const enablePagination = computed(() => !isLoading.value);

const addUserInput = () => {
    usersInputs.value.push({ userId: '' });
};

const removeUserInput = (index: number) => {
    usersInputs.value.splice(index, 1);
};

const formAction = () => {
    if (actionType.value === 'add') {
        addAccounts();
    } else if (actionType.value === 'remove') {
        removeAccounts();
    }
};

const addAccounts = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const currentAction = actions.value.find((a: any) => a.value === actionType.value);
    if (!currentAction) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi[currentAction?.apiFunction()](
            formatData({
                tankId: addressToPublicKey(tankId.value),
                userId: addressToPublicKey(usersInputs.value[0].userId),
                userIds: usersInputs.value.map((u: any) => addressToPublicKey(u.userId)),
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.[currentAction.key()]?.id;

        if (id) {
            snackbar.success({
                title: 'Account added',
                text: `Account added with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Account added',
            text: 'Account add failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const removeAccounts = async () => {
    await formRef.value?.validate();
    if (!formRef.value?.getMeta().valid) return;

    const currentAction = actions.value.find((a: any) => a.value === actionType.value);
    if (!currentAction) return;

    try {
        isLoading.value = true;
        const res = await FuelTankApi[currentAction?.apiFunction()](
            formatData({
                tankId: addressToPublicKey(tankId.value),
                userId: addressToPublicKey(usersInputs.value[0].userId),
                userIds: usersInputs.value.map((u: any) => addressToPublicKey(u.userId)),
                idempotencyKey: idempotencyKey.value,
            })
        );

        const id = res.data?.[currentAction.key()]?.id;

        if (id) {
            snackbar.success({
                title: 'Account removed',
                text: `Account removed with transaction id ${id}`,
                event: id,
            });
            closeSlide();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Account removed',
            text: 'Account removal failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const closeSlide = () => {
    emit('close');
};

const getAccounts = async () => {
    try {
        const res = await FuelTankApi.getAccounts(addressToPublicKey(tankId.value) ?? '');
        accounts.value = DTOFactory.forAccounts(res);
    } catch (e) {
        // Do nothing
    } finally {
        isLoading.value = false;
    }
};

const loadMoreItemsWithObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                if (!enablePagination.value) return;
                try {
                    if (!accounts.value.cursor || isPaginationLoading.value) return;
                    isPaginationLoading.value = true;
                    const res = await FuelTankApi.getAccounts(tankId.value, accounts.value.cursor);
                    const data = DTOFactory.forAccounts(res);
                    accounts.value = { items: [...accounts.value.items, ...data.items], cursor: data.cursor };
                    isPaginationLoading.value = false;
                } catch (error) {
                    isPaginationLoading.value = false;
                }
            }
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        }
    );
    observer.observe(paginatorRef.value);
};

(async () => {
    useAppStore().setFuelTanksSchema();
    await getAccounts();
})();

onMounted(() => {
    loadMoreItemsWithObserver();
});
</script>
