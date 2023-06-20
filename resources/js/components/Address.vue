<template>
    <dd class="mt-1 text-sm text-gray-900 break-words" v-if="address">
        <span class="break-words">
            {{ address }}
        </span>
        <ArrowsRightLeftIcon
            v-if="useAppStore().advanced"
            class="inline-block w-4 h-4 ml-1 cursor-pointer hover:text-primary"
            @click="switchAddress = !switchAddress"
        />
        <CopyTextIcon :text="address" />
    </dd>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { addressToPublicKey, publicKeyToAddress } from '~/util/address';
import CopyTextIcon from './CopyTextIcon.vue';
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';

const props = defineProps<{
    address: string;
}>();

const switchAddress = ref(false);

const address = computed(() => {
    return !switchAddress.value ? publicKeyToAddress(props.address) : addressToPublicKey(props.address);
});
</script>
