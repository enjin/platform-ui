<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">
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

                        <template v-if="transaction?.state !== TransactionState.FINALIZED">
                            <div v-if="!webSocketEvents && webSocket">
                                <LoadingCircle :size="40" class="pt-10" />
                                <p class="text-center py-4">Waiting for the transaction details...</p>
                            </div>
                            <div v-else-if="webSocketEvents" class="py-4">
                                <div class="space-y-2 pt-2 pb-2" v-for="(event, idx) in webSocketEvents" :key="idx">
                                    <dt class="text-base font-medium text-gray-500">{{ event.title }}</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ event.value }}</dd>
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
                        </template>
                    </div>

                    <div v-if="transaction" class="animate-fade-in" as="div">
                        <div class="space-y-2 pt-4 pb-3">
                            <dt class="text-base font-medium text-gray-500">State</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ transaction.state }}</dd>
                        </div>
                        <div class="space-y-2 pt-4 pb-3" v-if="transaction.result">
                            <dt class="text-base font-medium text-gray-500">Result</dt>
                            <dd class="mt-1 text-sm text-gray-900 font-bold">
                                <TransactionResultChip :text="transaction.result" />
                            </dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3">
                            <dt class="text-base font-medium text-gray-500">Transaction Method</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ transaction.method }}</dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3" v-if="transaction.transactionId">
                            <dt class="text-base font-medium text-gray-500">Transaction ID</dt>
                            <dd class="flex items-center mt-1 text-sm text-gray-900">
                                {{ transaction.transactionId }}
                                <CopyTextIcon :text="transaction.transactionId" />
                            </dd>
                        </div>

                        <div class="space-y-2 pt-4 pb-3" v-if="transaction.transactionHash">
                            <dt class="text-base font-medium text-gray-500">Transaction Hash</dt>
                            <dd class="mt-1 text-sm text-gray-900 break-words">
                                {{ transaction.transactionHash }}
                                <CopyTextIcon :text="transaction.transactionHash" />
                            </dd>
                        </div>

                        <h3 class="text-xl font-semibold pt-4 text-gray-900" v-if="events?.length">Events</h3>
                        <div class="space-y-2 pb-3 divide divide-y divide-gray-300" v-if="events?.length">
                            <div class="" v-for="event in events" :key="event">
                                <div class="space-y-2 pt-4 pb-3">
                                    <dt class="text-base font-medium text-gray-500">Event ID</dt>
                                    <dd class="mt-1 text-gray-900 break-words font-semibold">
                                        {{ event.eventId }}
                                    </dd>
                                </div>
                                <div class="space-y-2 pb-3" v-for="param in event.params" :key="param">
                                    <dt class="text-base font-medium text-gray-500">{{ param.type }}</dt>
                                    <Address
                                        v-if="isAddressKey(param.type) && param.value"
                                        :address="`0x${param.value}`"
                                    />
                                    <dd v-else class="mt-1 text-sm text-gray-900 break-words">
                                        {{ param.value ?? '-' }}
                                    </dd>
                                </div>
                            </div>
                        </div>

                        <template v-if="useAppStore().advanced && advancedEvents?.length">
                            <h3 class="text-xl font-semibold pt-4 text-gray-900">Advanced Events</h3>
                            <div class="space-y-2 pb-3 divide divide-y divide-gray-300" v-if="advancedEvents.length">
                                <div class="" v-for="event in advancedEvents" :key="event">
                                    <div class="space-y-2 pt-4 pb-3">
                                        <dt class="text-base font-medium text-gray-500">Event ID</dt>
                                        <dd class="mt-1 text-gray-900 break-words font-semibold">
                                            {{ event.eventId }}
                                        </dd>
                                    </div>
                                    <div class="space-y-2 pb-3" v-for="param in event.params" :key="param">
                                        <dt class="text-base font-medium text-gray-500">{{ param.type }}</dt>
                                        <Address
                                            v-if="isAddressKey(param.type) && param.value"
                                            :address="`0x${param.value}`"
                                        />
                                        <dd v-else class="mt-1 text-sm text-gray-900 break-words">
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
import CopyTextIcon from '~/components/CopyTextIcon.vue';
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

const isAddressKey = (key) => ['who', 'operator', 'account', 'owner'].includes(key);

const getTransaction = async () => {
    try {
        isLoading.value = true;
        const res = await TransactionApi.getTransaction(props.item?.id ?? '');
        transaction.value = DTOTransactionFactory.forTransaction(res);
        if (transaction.value.state === TransactionState.FINALIZED) {
            emit('update', transaction.value);
        }
    } catch (error) {
        console.log(error);
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
