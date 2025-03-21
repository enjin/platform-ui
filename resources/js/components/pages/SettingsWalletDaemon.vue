<template>
    <CollapseCard dusk-id="walletDaemonTab" title="Daemon Wallet" :actions="false" :isOpen="true">
        <template #icon>
            <div class="flex space-x-2 ml-2">
                <Tooltip class="!flex items-center" :text="tooltipText">
                    <div v-if="operational" class="rounded-full w-3 h-3 bg-green-400"></div>
                    <div v-else class="rounded-full w-3 h-3 bg-red-500"></div>
                </Tooltip>
                <QuestionMarkCircleIcon
                    class="m-2 w-5 h-5 cursor-pointer text-light-content dark:text-dark-content"
                    stroke-width="36"
                    @click.stop="showHelp = true"
                />
            </div>
        </template>
        <div>
            <div class="p-6 text-light-content dark:text-dark-content">
                <div class="flex flex-col space-y-4">
                    <Transition
                        enter-active-class="transition ease-out duration-300"
                        leave-active-class="transition ease-in duration-300"
                        enter-from-class="transform opacity-0 "
                        enter-to-class="transform opacity-100"
                        leave-from-class="transform opacity-100"
                        leave-to-class="transform opacity-0"
                        mode="out-in"
                    >
                        <div v-if="creationFlow" class="flex flex-col space-y-4">
                            <div class="text-sm">
                                <span> API Token was successfully created. Token: </span>
                                <CopyTextIcon
                                    v-if="creationFlowToken"
                                    ref="copyIconRef"
                                    class="cursor-pointer inline-flex"
                                    :text="creationFlowToken.substring(creationFlowToken?.indexOf('|') + 1)"
                                >
                                    <span class="truncate text-light-content-brand dark:text-dark-content-brand">
                                        {{ creationFlowToken?.substring(creationFlowToken?.indexOf('|') + 1) }}
                                    </span>
                                </CopyTextIcon>
                            </div>
                            <Transition
                                enter-active-class="transition ease-out duration-300"
                                leave-active-class="transition ease-in duration-300"
                                enter-from-class="transform opacity-0 "
                                enter-to-class="transform opacity-100"
                                leave-from-class="transform opacity-100"
                                leave-to-class="transform opacity-0"
                                mode="out-in"
                            >
                                <div v-if="!walletAccount" class="flex flex-col space-y-4">
                                    <span class="text-sm">
                                        To enable automatic signing of your platform requests, Set up a Daemon wallet
                                        with the API Token above and run it once to complete the setup. We'll notify you
                                        here once the configuration is successful. Detailed configuration instructions
                                        can be found in our
                                        <a
                                            href="https://docs.enjin.io/docs/using-wallet-daemon"
                                            target="_blank"
                                            class="text-light-content-brand dark:text-dark-content-brand"
                                        >
                                            documentation.
                                        </a>
                                    </span>
                                    <LoadingCircle
                                        class="py-2 text-light-content-brand dark:text-dark-content-brand"
                                        :size="28"
                                    />
                                    <p class="text-sm">
                                        Please configure your Daemon wallet with the above API Token and run it once in
                                        order to complete the configuration.
                                    </p>
                                </div>
                                <div v-else>
                                    <p class="text-sm">
                                        Setup complete! Daemon Wallet account
                                        <span class="text-light-content-brand dark:text-dark-content-brand">
                                            {{ walletAccount }}
                                        </span>
                                        is now configured with your Enjin Platform account. As long as the Daemon Wallet
                                        is running, it will be used to automatically sign and broadcast all platform
                                        requests to the blockchain.
                                    </p>
                                    <Btn primary class="mx-auto mt-4" @click="cancelCreationFlow">Continue</Btn>
                                </div>
                            </Transition>
                        </div>
                        <div v-else class="flex flex-col space-y-4">
                            <p v-if="!walletAccount" class="text-sm">Daemon Wallet is not configured at the moment</p>
                            <p v-else class="text-sm">Daemon Wallet is configured</p>
                            <label
                                v-if="walletAccount"
                                class="text-light-content dark:text-dark-content bg-light-surface-background dark:bg-dark-surface-background hover:text-white hover:bg-light-surface-brand text-sm rounded-md mr-auto p-2 cursor-pointer transition-all"
                                name="walletAccount"
                                disabled
                                @click="copyText(walletAccount)"
                            >
                                {{ walletAccount }}
                            </label>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </CollapseCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Btn from '../Btn.vue';
import CollapseCard from '../CollapseCard.vue';
import { useAppStore } from '~/store';
import snackbar from '~/util/snackbar';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import LoadingCircle from '../LoadingCircle.vue';
import CopyTextIcon from '../CopyTextIcon.vue';
import Tooltip from '../Tooltip.vue';

const showHelp = defineModel<boolean>('help');

const appStore = useAppStore();

const creationFlow = ref(false);
const creationFlowToken = ref('');

const walletAccount = computed(() => appStore.config.daemon);
const operational = computed(() => walletAccount.value);
const tooltipText = computed(() => (operational.value ? 'Operational' : 'Not configured'));

const cancelCreationFlow = () => {
    creationFlow.value = false;
    creationFlowToken.value = '';
};

const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    snackbar.info({ title: 'Copied to clipboard!' });
};
</script>
