<template>
    <div class="relative">
        <svg :height="44" viewBox="0 0 64 64" :width="44">
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

<script setup>
import { polkadotIcon } from '@polkadot/ui-shared';
import { ref, h } from 'vue';

const props = defineProps({
    address: {
        type: String,
        required: true,
    },
});

const circles = polkadotIcon(props.address, {
    isAlternative: false,
}).map(({ cx, cy, fill, r }) => ({ cx, cy, fill, r }));
</script>
