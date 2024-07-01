<template>
    <Popper
        :arrow="arrow"
        :class="theme"
        :block="block"
        :show="show"
        :offset-distance="offsetDistance"
        :placement="(placement as any)"
        z-index="30"
    >
        <!-- Activator -->
        <slot name="activator" />

        <!-- Popover -->
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper';

withDefaults(
    defineProps<{
        theme?: 'light' | 'dark';
        hover?: boolean;
        arrow?: boolean;
        offsetDistance?: string;
        placement?: string;
        block?: boolean;
        show?: boolean | undefined;
    }>(),
    {
        theme: 'light',
        hover: false,
        arrow: false,
        offsetDistance: '12',
        placement: 'auto',
        block: false,
        show: undefined,
    }
);
</script>

<style scoped lang="scss">
@mixin base-style {
    --popper-theme-border-width: 1px;
    --popper-theme-border-style: solid;
    --popper-theme-border-color: hsl(248 12% 90%);
    --popper-theme-padding: 0.5rem;
    --popper-theme-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
        0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@mixin light-mode {
    @include base-style;
    --popper-theme-background-color: #fff;
    --popper-theme-background-color-hover: #fff;
    --popper-theme-text-color: #000;
}

@mixin dark-mode {
    @include base-style;
}

.light {
    @include light-mode;
    --popper-theme-padding: 0;
    --popper-theme-border-radius: 0.5rem;
}

.dark {
    @include dark-mode;
    --popper-theme-padding: 0;
    --popper-theme-border-radius: 0.5rem;
    --popper-theme-border-width: 2px;
    --popper-theme-border-color: hsl(0, 0%, 15%);
}

.mobile {
    @include light-mode;
    --popper-theme-border-radius: 0;
}

:deep([block~='true'] .popper) {
    width: 100%;
}
</style>
