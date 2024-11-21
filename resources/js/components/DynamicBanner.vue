<template>
    <Transition name="fade-down" appear>
        <div
            v-if="enabled && show"
            class="flex justify-between items-center px-4 md:px-10 text-light-content-white dark:text-dark-content-white notice-bg h-[72px] w-full z-10 text-white"
        >
            <span class="text-xs md:text-base">{{ banner.text }}</span>
            <div class="flex space-x-2 md:space-x-4">
                <a
                    v-if="banner.link"
                    :href="banner.link"
                    target="_blank"
                    class="underline font-medium text-light-content-white dark:text-dark-content-white hover:text-light-content-white hover:dark:text-dark-content-white text-sm md:text-base truncate"
                >
                    <span>
                        {{ banner.linkText ?? 'Learn more' }}
                    </span>
                </a>
                <XMarkIcon
                    v-if="banner.dismissable"
                    class="h-5 w-5 ml-auto my-auto cursor-pointer flex-shrink-0"
                    @click="closeBanner"
                />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';

const show = ref(true);
const banner = ref({
    key: 'banner',
    text: 'This is a banner',
    link: 'https://google.com',
    linkText: 'Read more',
    dismissable: true,
});

const enabled = computed(() => {
    return true;
});

const closeBanner = () => {
    deleteOutdated();
    localStorage.setItem(banner.value.key, 'true');
    show.value = false;
};

const deleteOutdated = () => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith('banner'));
    keys.forEach((key) => {
        if (key !== banner.value.key) {
            const item = localStorage.getItem(key);
            if (item) {
                localStorage.removeItem(key);
            }
        }
    });
};

const fetchBanner = async () => {
    console.log('fetching');
};

(() => {
    fetchBanner();
})();
</script>

<style lang="scss" scoped>
.fade-down-enter-active,
.fade-down-leave-active {
    transition: all 0.3s ease-in-out;
    margin-top: 0;
}
.fade-down-enter-from,
.fade-down-leave-to {
    opacity: 0;
    margin-top: -70px;
}

.notice-bg {
    background: linear-gradient(96deg, #4f40af -2.69%, #8c7fe0 98.64%);
}
</style>
