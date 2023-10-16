<template>
    <div class="relative">
        <svg :height="44" viewBox="0 0 64 64" :width="40">
            <circle
                v-for="(circle, index) in circles"
                :key="index"
                :cx="circle.cx"
                :cy="circle.cy"
                :fill="circle.fill"
                :r="circle.r"
            />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { polkadotIcon } from '@polkadot/ui-shared';

const props = defineProps<{
    address: string;
}>();

const circles = polkadotIcon(props.address, {
    isAlternative: false,
}).map(({ cx, cy, fill, r }) => ({ cx, cy, fill, r }));
</script>
