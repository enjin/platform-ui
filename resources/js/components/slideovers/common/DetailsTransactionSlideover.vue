<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Transaction Details for {{ transaction?.transactionId ?? transaction?.id }}
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6 divide-y divide-gray-200">
                    <div>
                        <template v-if="transaction?.state === TransactionState.PENDING">
                            <div class="flex justify-center py-4">
                                <SignTransaction :transaction="transaction" @success="signedTransaction" />
                            </div>
                        </template>

                        <template
                            v-if="
                                transaction?.state !== TransactionState.FINALIZED &&
                                transaction?.state !== TransactionState.PENDING
                            "
                        >
                            <div v-if="!webSocketEvents && webSocket">
                                <LoadingCircle :size="40" class="pt-10" />
                                <p class="text-center py-4">Waiting for the transaction details...</p>
                            </div>
                            <div v-else-if="webSocketEvents" class="py-4">
                                <div class="space-y-2 pt-2 pb-2" v-for="(event, idx) in webSocketEvents" :key="idx">
                                    <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                        {{ event.title }}
                                    </dt>
                                    <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                                        {{ event.value }}
                                    </dd>
                                </div>

                                <Btn
                                    v-if="transaction?.state !== TransactionState.FINALIZED"
                                    class="!mx-auto !flex"
                                    primary
                                    :loading="isLoading"
                                    :disabled="isLoading"
                                    @click="getTransaction"
                                >
                                    Get More Transaction Details
                                </Btn>
                                <div class="text-xs text-center mx-auto mt-4" v-if="!webSocketEvents.length">
                                    Usually it takes few seconds to finilize the transaction
                                </div>
                            </div>
                            <div v-else-if="!webSocket" class="py-4">
                                <Btn
                                    v-if="transaction?.state !== TransactionState.FINALIZED"
                                    class="!mx-auto !flex"
                                    primary
                                    :loading="isLoading"
                                    :disabled="isLoading"
                                    @click="getTransaction"
                                >
                                    Get More Transaction Details
                                </Btn>
                                <div class="text-xs text-center mx-auto mt-4">
                                    Usually it takes few seconds to finilize the transaction
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="transaction" class="animate-fade-in" as="div">
                        <div class="space-y-2 pt-4 pb-3">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">State</dt>
                            <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                                {{ transaction.state }}
                            </dd>
                        </div>
                        <div
                            class="space-y-2 pt-4 pb-3"
                            v-if="transaction.result && transaction.state === TransactionState.FINALIZED"
                        >
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">Result</dt>
                            <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong font-bold">
                                <TransactionResultChip :text="transaction.result" />
                            </dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                Transaction Method
                            </dt>
                            <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                                {{ transaction.method }}
                            </dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3" v-if="transaction.transactionId">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                Transaction ID
                            </dt>
                            <dd
                                class="flex items-center mt-1 text-sm text-light-content-strong dark:text-dark-content-strong"
                            >
                                <a
                                    :href="getSubscanUrl(transaction.transactionId)"
                                    target="_blank"
                                    class="text-primary font-medium"
                                >
                                    {{ transaction.transactionId }}
                                </a>
                            </dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3" v-if="transaction.transactionHash">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                Transaction Hash
                            </dt>
                            <dd
                                class="flex items-center mt-1 text-sm text-light-content-strong dark:text-dark-content-strong"
                            >
                                <a
                                    :href="getSubscanUrl(transaction.transactionHash)"
                                    target="_blank"
                                    class="text-primary font-medium truncate"
                                >
                                    {{ transaction.transactionHash }}
                                </a>
                            </dd>
                        </div>

                        <h3
                            class="text-xl font-semibold pt-4 text-light-content-strong dark:text-dark-content-strong"
                            v-if="events?.length"
                        >
                            Events
                        </h3>
                        <div class="space-y-2 pb-3 divide divide-y divide-gray-300" v-if="events?.length">
                            <div class="" v-for="event in events" :key="event">
                                <div class="space-y-2 pt-4 pb-3">
                                    <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                        Event ID
                                    </dt>
                                    <dd
                                        class="mt-1 text-light-content-strong dark:text-dark-content-strong break-words font-semibold"
                                    >
                                        {{ event.eventId }}
                                    </dd>
                                </div>
                                <div class="space-y-2 pb-3" v-for="param in event.params" :key="param">
                                    <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                        {{ param.type }}
                                    </dt>
                                    <Address
                                        v-if="isAddressKey(param.type) && param.value"
                                        :address="`0x${param.value}`"
                                    />
                                    <dd
                                        v-else-if="param.type === 'percentage'"
                                        class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                                    >
                                        {{ param.value / 10000000 }}%
                                    </dd>
                                    <dd
                                        v-else
                                        class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                                    >
                                        {{ param.value ?? '-' }}
                                    </dd>
                                </div>
                            </div>
                        </div>

                        <template v-if="useAppStore().advanced && advancedEvents?.length">
                            <h3
                                class="text-xl font-semibold pt-4 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Advanced Events
                            </h3>
                            <div class="space-y-2 pb-3 divide divide-y divide-gray-300" v-if="advancedEvents.length">
                                <div class="" v-for="event in advancedEvents" :key="event">
                                    <div class="space-y-2 pt-4 pb-3">
                                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                            Event ID
                                        </dt>
                                        <dd
                                            class="mt-1 text-light-content-strong dark:text-dark-content-strong break-words font-semibold"
                                        >
                                            {{ event.eventId }}
                                        </dd>
                                    </div>
                                    <div class="space-y-2 pb-3" v-for="param in event.params" :key="param">
                                        <dt class="text-base font-medium text-light-content dark:text-dark-content">
                                            {{ param.type }}
                                        </dt>
                                        <Address
                                            v-if="isAddressKey(param.type) && param.value"
                                            :address="`0x${param.value}`"
                                        />
                                        <dd
                                            v-else
                                            class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                                        >
                                            {{ param.value }}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { TransactionApi } from '~/api/transaction';
import Address from '~/components/Address.vue';
import Btn from '~/components/Btn.vue';
import LoadingCircle from '~/components/LoadingCircle.vue';
import SignTransaction from '~/components/SignTransaction.vue';
import TransactionResultChip from '~/components/TransactionResultChip.vue';
import { DTOTransactionFactory } from '~/factory/transaction';
import { useAppStore } from '~/store';
import { TransactionState } from '~/types/types.enums';

const props = withDefaults(
    defineProps<{
        item?: {
            id: string;
            transactionId: string;
            state: TransactionState;
            result: string;
            method: string;
            transactionHash: string;
        };
    }>(),
    {
        item: undefined,
    }
);

const emit = defineEmits(['update']);

const appStore = useAppStore();

const isLoading = ref(false);
const transaction = ref();
const webSocketEvents = ref();
const webSocket = ref();

const events = computed(() => transaction.value?.events);

const advancedEvents = computed(() => transaction.value?.advancedEvents);

const getSubscanUrl = (transactionId) => {
    if (appStore.config.network === 'canary') {
        return `https://canary-matrix.subscan.io/extrinsic/${transactionId}`;
    }

    return `https://matrix.subscan.io/extrinsic/${transactionId}`;
};

const isAddressKey = (key) => ['who', 'operator', 'account', 'owner'].includes(key);

const getTransaction = async () => {
    try {
        if (props.item?.state === TransactionState.FINALIZED) {
            transaction.value = props.item;
            return;
        }

        isLoading.value = true;
        const res = await TransactionApi.getTransaction(props.item?.id ?? '');
        transaction.value = DTOTransactionFactory.forTransaction(res);
        if (transaction.value.state === TransactionState.FINALIZED) {
            emit('update', transaction.value);
        }
    } catch (error) {
        // Do notihing
    }
    isLoading.value = false;
};

const parseWSMessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.event.includes('platform:')) {
        webSocketEvents.value = Object.entries(JSON.parse(data.data)).map(([key, value]) => {
            return {
                title: key,
                value,
            };
        });
    }
};

const connectWebSocket = () => {
    if (!appStore.config.webSocket) return;
    webSocket.value = new WebSocket(appStore.config.webSocket);

    webSocket.value.onopen = () => {
        const payload = {
            event: 'pusher:subscribe',
            data: {
                channel: 'platform',
            },
        };
        webSocket.value.send(JSON.stringify(payload));
    };

    webSocket.value.onmessage = (e) => {
        parseWSMessage(e);
    };
};

const closeWebSocket = () => {
    webSocket.value?.close();
};

const signedTransaction = () => {
    transaction.value.state = TransactionState.BROADCAST;
};

(async () => {
    await getTransaction();
    setTimeout(() => {
        if (!webSocketEvents.value) {
            if (webSocket.value) webSocket.value.close();
            getTransaction();
        }
    }, 25000);
})();

watch(
    () => transaction.value?.state,
    () => {
        if (transaction.value.state === TransactionState.BROADCAST) {
            connectWebSocket();
        } else if (transaction.value.state === TransactionState.FINALIZED) {
            closeWebSocket();
        }
    }
);
</script>
