<template>
    <dd class="mt-1 text-sm text-gray-900 break-words" v-if="addressSwitch">
        <CopyTextIcon :text="addressSwitch">
            <span class="break-words">
                {{ displayAddress }}
            </span>
        </CopyTextIcon>
        <ArrowsRightLeftIcon
            v-if="useAppStore().advanced && !props.short"
            class="w-4 h-4 ml-1 cursor-pointer hover:text-primary"
            @click="switchAddress = !switchAddress"
        />
    </dd>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { addressShortHex, addressToPublicKey, publicKeyToAddress } from '~/util/address';
import CopyTextIcon from './CopyTextIcon.vue';
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';

const props = defineProps<{
    address: string;
    short?: boolean;
}>();

const switchAddress = ref(false);

const addressSwitch = computed(() => {
    return !switchAddress.value ? publicKeyToAddress(props.address) : addressToPublicKey(props.address);
});

const displayAddress = computed(() => {
    return props.short ? addressShortHex(addressSwitch.value) : addressSwitch.value;
});
</script>
