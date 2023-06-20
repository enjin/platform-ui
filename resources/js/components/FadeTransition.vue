<template>
    <transition
        mode="out-in"
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
    >
        <slot />
    </transition>
</template>

<script setup lang="ts"></script>
