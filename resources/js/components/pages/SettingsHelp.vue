<template>
    <div
        class="flex justify-end md:absolute w-auto top-0 cursor-pointer transition-all z-40"
        :class="{
            'right-0 absolute': showHelp,
            'right-0 md:-right-10': !showHelp,
        }"
    >
        <QuestionMarkCircleIcon
            v-if="!showHelp"
            class="m-2 w-5 h-5 cursor-pointer text-light-content dark:text-dark-content"
            stroke-width="36"
            @click="showHelp = true"
        />
        <XMarkIcon
            v-else
            class="h-5 w-5 m-2 cursor-pointer text-light-content-strong dark:text-dark-content-strong"
            @click="showHelp = false"
        />
    </div>
    <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="w-[0px] absolute right-0 md:translate-x-20 scale-0 h-[0px]"
        leave-to-class="w-[0px] absolute right-0 md:translate-x-20 scale-0 h-[0px]"
        enter-to-class="w-[100%] translate-x-0 scale-100 h-[350px] md:h-[200px]"
        leave-from-class="w-[100%] translate-x-0 scale-100 h-[350px] md:h-[200px]"
    >
        <div
            v-if="showHelp"
            class="ml-auto flex flex-col mb-6 transition-all rounded-md bg-[#0284c7] p-3 text-white overflow-hidden"
        >
            <p class="font-bold">Configuring Your Wallet</p>
            <p>To interact with the Enjin Platform, you need a wallet to sign your transactions. You can do this:</p>
            <ul class="list-disc py-4 px-6">
                <li>
                    <span class="font-bold">Manually: </span>Using a wallet app like
                    <a class="underline" target="_blank" href="https://enjin.io/technology/wallet"
                        >Enjin Wallet (mobile)</a
                    >
                    or
                    <a class="underline" target="_blank" href="https://polkadot.js.org/extension/"
                        >Polkadot{.js} browser extension (desktop)</a
                    >
                </li>
                <li>
                    <span class="font-bold">Automatically: </span>Using a
                    <a class="underline" target="_blank" href="https://docs.enjin.io/docs/using-wallet-daemon"
                        >Daemon Wallet</a
                    >, which automatically signs requests as long as its running.
                </li>
            </ul>
            <p>
                You can choose to configure either or both based on your needs. For detailed instructions on setting up
                a Daemon wallet,
                <a class="underline" target="_blank" href="https://docs.enjin.io/docs/using-wallet-daemon"
                    >visit our docs</a
                >.
            </p>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const showHelp = ref(false);
</script>
