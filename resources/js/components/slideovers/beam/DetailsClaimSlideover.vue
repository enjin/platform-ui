<template>
    <div
        class="flex h-full flex-col divide-y divide-light-stroke dark:divide-dark-stroke bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Claim Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="pt-4 px-4 sm:px-6">
                    <img class="w-full rounded-md mx-auto" :src="item.image" />

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Claim ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.id }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Claim Status</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.claimStatus ?? '-' }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.wallet?.account">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Wallet Claimed</dt>
                        <Address :address="item.wallet?.account?.publicKey" />
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Code</dt>
                        <dd
                            class="flex items-center text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                        >
                            {{ item.code }}
                            <CopyTextIcon :text="item.code" />
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Quantity</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.quantity }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Collection ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.collection?.collectionId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Token ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.tokenId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Type</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.type }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Claimed At</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ new Date(item.claimedAt).toLocaleString() }}
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Address from '~/components/Address.vue';
import CopyTextIcon from '~/components/CopyTextIcon.vue';

defineProps<{
    item?: {
        id: string;
        code: string;
        quantity: number;
        claimedAt: string;
        tokenId: string;
        type: string;
        claimStatus: string;
        image: string;
        collection: {
            collectionId: string;
        };
        wallet: {
            account: {
                publicKey: string;
            };
        };
    };
}>();
</script>
