<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Beam Details
        </h3>
        <div class="h-0 flex-1 overflow-y-auto pb-10">
            <div class="flex flex-1 flex-col justify-between">
                <div class="pt-4 px-4 sm:px-6">
                    <img class="w-full rounded-md mx-auto" :src="item.image" />

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Beam ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.id }}
                        </dd>
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
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Name</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words">
                            {{ item.name }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Description</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words">
                            {{ item.description }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Start time</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ new Date(item.start).toLocaleString() }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">End time</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ new Date(item.end).toLocaleString() }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Collection ID</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.collection?.collectionId }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Is Claimable</dt>
                        <dd class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong">
                            {{ item.isClaimable }}
                        </dd>
                    </div>

                    <div class="space-y-2 pt-4 pb-3" v-if="item.flags.length">
                        <dt class="text-base font-medium text-light-content dark:text-dark-content">Flags</dt>
                        <Chip v-for="flag in item.flags" :key="flag" :text="flag" :closable="false" class="mr-2" />
                    </div>
                    <div class="space-y-2 pt-4 pb-3" v-if="item.claimConditions.length">
                        <dt class="text-base font-medium text-gray-500">Conditions</dt>
                        <Chip
                            v-for="condition in item.claimConditions"
                            :key="condition.type"
                            :text="formatCondition(condition)"
                            :closable="false"
                            class="mr-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Chip from '~/components/Chip.vue';
import CopyTextIcon from '~/components/CopyTextIcon.vue';

defineProps<{
    item?: {
        id: string;
        code: string;
        name: string;
        description: string;
        start: string;
        end: string;
        collection: {
            collectionId: string;
        };
        isClaimable: boolean;
        flags: string[];
        image: string;
        claimConditions: { type: string; value: string }[];
    };
}>();

const formatCondition = (condition) => {
    const type = condition.type.replace(/_/g, ' ');

    return `${type}: ${condition.value}`;
};
</script>
