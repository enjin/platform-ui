<template>
    <Disclosure as="nav" class="bg-white shadow z-40">
        <div class="px-4 sm:px-6 lg:px-8 transition-all">
            <div class="flex h-16 justify-between">
                <div class="flex">
                    <!-- Mobile menu button -->
                    <div class="-ml-2 mr-2 space-x-2 flex items-center md:hidden animate-slide-in">
                        <DisclosureButton
                            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-light"
                        >
                            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>

                        <EnjinLogo class="h-8 w-auto" />
                        <span class="text-lg font-semibold ml-2">Platform</span>
                    </div>
                    <div class="hidden md:flex items-center" v-if="appStore.isMultiTenant && !appStore.hasValidConfig">
                        <EnjinLogo class="h-8 w-auto" />
                        <span class="text-lg font-semibold ml-2">Platform</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4" v-if="appStore.loggedIn">
                    <WalletIcon class="h-6 w-6 text-gray-400 cursor-pointer" @click="connectWallet" />
                    <Suspense>
                        <WalletConnectButton></WalletConnectButton>
                        <template #fallback><div class="text-gray-600">Loading</div></template>
                    </Suspense>
                    <InformationCircleIcon class="h-6 w-6 text-gray-400 cursor-pointer" @click="openHelp" />
                    <NotificationsList />
                    <ProfileMenu />
                </div>
            </div>
        </div>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform -translate-y-10 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-75 ease-out"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-10 opacity-0"
        >
            <DisclosureMenu :navigations="navigations" />
        </transition>
    </Disclosure>
    <Handbook :open="help" @close="closeHelp" @openHelp="openHelp" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Disclosure, DisclosureButton } from '@headlessui/vue';
import { Bars3Icon, InformationCircleIcon, XMarkIcon, WalletIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '~/store';
import EnjinLogo from '~/components/EnjinLogo.vue';
import ProfileMenu from '~/components/ProfileMenu.vue';
import DisclosureMenu from '~/components/DisclosureMenu.vue';
import NotificationsList from '~/components/NotificationsList.vue';
import Handbook from '~/components/Handbook.vue';
import WalletConnectButton from '~/components/WalletConnectButton.vue';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';
import { getAppMetadata } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';

const open = ref(false);
const help = ref(false);

const appStore = useAppStore();

const navigations = computed(() => appStore.navigations);

const connectWallet = async () => {
    const walletConnect = new WalletConnectModalSign({
        projectId: 'a4b92f550ab3039f7e084a879882bc96',
        metadata: getAppMetadata(),
        modalOptions: {
            themeMode: 'light',
            explorerRecommendedWalletIds: ['bdc9433ffdaee55d31737d83b931caa1f17e30666f5b8e03eea794bac960eb4a'],
            enableExplorer: true,
            walletImages: {},
            themeVariables: {
                '--wcm-background-color': '#7567CE',
                '--wcm-accent-color': '#7567CE',
                '--wcm-accent-fill-color': '#FFFFFF',
            },
        },
    });

    let session: SessionTypes.Struct | undefined = await walletConnect.getSession();

    if (!session) {
        session = await walletConnect.connect({
            requiredNamespaces: {
                polkadot: {
                    methods: ['polkadot_signTransaction'],
                    chains: ['polkadot:99ded175d436bee7d751fa3f2f8c7a25'],
                    events: [],
                },
            },
        });

        if (session.acknowledged) {
            appStore.setWCSession(true);
        }
    }
};

const openHelp = () => {
    help.value = true;
};

const closeHelp = () => {
    help.value = false;
};
</script>
