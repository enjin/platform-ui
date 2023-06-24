<template>
    <div class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl" v-if="item">
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-gray-900">Wallet Details</h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="px-4 sm:px-6">
                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Wallet ID</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.id }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Account</dt>
                        <Address :address="item.account" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.balances">
                        <dt class="text-base font-medium text-gray-500">Balances</dt>
                        <dt class="text-sm font-medium text-gray-500">Free</dt>
                        <dd class="mt-1 text-sm text-gray-900 break-words">
                            {{ formatPriceFromENJ(item.balances.free) }} RFI
                        </dd>
                        <dt class="text-sm font-medium text-gray-500">Reserved</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ formatPriceFromENJ(item.balances.reserved) }} RFI</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.externalId">
                        <dt class="text-base font-medium text-gray-500">External Id</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.externalId }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Managed</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.managed }}</dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-gray-500">Network</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ item.network }}</dd>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Address from '~/components/Address.vue';
import { formatPriceFromENJ } from '~/util';

defineProps<{
    item?: {
        id: string;
        account: string;
        balances: {
            free: string;
            reserved: string;
        };
        externalId: string;
        managed: boolean;
        network: string;
    };
}>();
</script>
