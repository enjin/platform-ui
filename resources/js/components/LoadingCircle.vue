<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        class="text-primary m-auto"
        :style="{
            width: `${size}px`,
        }"
    >
        <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            r="42"
            stroke-dasharray="202.63272615654165 69.54424205218055"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="0.5s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
            />
        </circle>
    </svg>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: number;
        strokeWidth?: number;
    }>(),
    {
        size: 24,
        strokeWidth: 4,
    }
);
</script>
