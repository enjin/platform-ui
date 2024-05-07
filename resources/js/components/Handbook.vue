<template>
    <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
        <Dialog as="div" class="relative z-50" @close="$emit('close')">
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div
                    class="fixed inset-0 bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-500 bg-opacity-25 transition-opacity"
                />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <DialogPanel
                        class="mx-auto max-w-3xl transform divide-y divide-light-stroke dark:divide-dark-stroke overflow-hidden rounded-xl bg-light-surface-primary dark:bg-dark-surface-primary shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                    >
                        <Combobox v-model="selectedContent">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-light-content dark:text-dark-content"
                                    aria-hidden="true"
                                />
                                <ComboboxInput
                                    class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-light-content-strong dark:text-dark-content-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-0 sm:text-sm"
                                    placeholder="Search..."
                                    :value="query"
                                    @change="queryChange"
                                />
                            </div>

                            <ComboboxOptions
                                v-if="query === '' || filteredContent.length > 0"
                                class="flex divide-x divide-light-stroke dark:divide-dark-stroke"
                                as="div"
                                static
                                hold
                            >
                                <div
                                    :class="[
                                        'max-h-96 min-w-0 flex-auto scroll-py-4 px-6 py-4',
                                        selectedContent && 'sm:h-96',
                                    ]"
                                >
                                    <div hold class="-mx-2 text-sm text-light-content dark:text-dark-content">
                                        <ComboboxOption
                                            v-for="content in query === '' ? contents : filteredContent"
                                            :key="content.id"
                                            :value="content"
                                            as="template"
                                            v-slot="{ active }"
                                        >
                                            <div
                                                :class="[
                                                    'group flex cursor-default select-none items-center rounded-md p-2 transition-all',
                                                    active &&
                                                        'bg-light-surface-background dark:bg-dark-surface-background text-light-content-strong dark:text-dark-content-strong',
                                                    selectedContent?.id === content.id &&
                                                        'bg-light-surface-background dark:bg-dark-surface-background !bg-opacity-50 text-light-content-strong dark:text-dark-content-strong',
                                                ]"
                                            >
                                                <span class="ml-3 flex-auto truncate">{{ content.name }}</span>
                                                <ChevronRightIcon
                                                    v-if="active"
                                                    class="ml-3 h-5 w-5 flex-none text-light-content dark:text-dark-content"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </ComboboxOption>
                                    </div>
                                </div>

                                <div class="h-96 w-1/2 overflow-y-auto">
                                    <div
                                        v-if="selectedContent"
                                        class="flex flex-none flex-col divide-y divide-light-stroke dark:divide-dark-stroke"
                                    >
                                        <div class="flex-none p-6 text-center">
                                            <h2
                                                class="font-semibold text-light-content-strong dark:text-dark-content-strong"
                                            >
                                                {{ selectedContent.name }}
                                            </h2>
                                        </div>
                                        <div
                                            class="flex flex-col p-6 space-y-2 text-sm text-light-content dark:text-dark-content"
                                        >
                                            <ul v-if="selectedContent.type === 'list'" class="list-disc space-y-2">
                                                <li v-for="option in selectedContent.content" :key="option">
                                                    <span
                                                        v-if="option.includes('**')"
                                                        :class="{ 'text-base font-semibold': option.includes('**') }"
                                                    >
                                                        {{ option.replace(/\*\*/g, '') }}
                                                    </span>
                                                    <span v-else>{{ option }}</span>
                                                </li>
                                            </ul>
                                            <p v-else v-for="option in selectedContent.content" :key="option">
                                                <span :class="{ 'text-base font-semibold': option.includes('**') }">
                                                    {{ option.replace(/\*\*/g, '') }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ComboboxOptions>

                            <div
                                v-if="query !== '' && filteredContent.length === 0"
                                class="px-6 py-14 text-center text-sm sm:px-14"
                            >
                                <NewspaperIcon
                                    class="mx-auto h-6 w-6 text-light-content dark:text-dark-content"
                                    aria-hidden="true"
                                />
                                <p class="mt-4 font-semibold text-light-content-strong dark:text-dark-content-strong">
                                    No content found
                                </p>
                                <p class="mt-2 text-light-content dark:text-dark-content">
                                    We couldn't find anything with that name. Please try again.
                                </p>
                            </div>
                        </Combobox>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { ChevronRightIcon, NewspaperIcon } from '@heroicons/vue/24/outline';
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue';
import { events } from '~/util/snackbar';

defineProps<{
    open: boolean;
}>();

const emit = defineEmits(['close', 'openHelp']);

const contents = [
    {
        id: 1,
        name: 'Explicit Royalty Currencies',
        type: 'text',
        content: [
            'Explicit royalty currencies are optional.',
            'If no currencies are provided here, then ALL currencies are allowed for royalties.',
            'If one or more currencies are provided here, they will be whitelisted for use as a royalty currency and ONLY this list of currencies will be allowed for royalties.',
        ],
    },
    {
        id: 2,
        name: 'Advanced mode',
        type: 'text',
        content: [
            'Advanced mode is for experienced users who want to customize their experience.',
            'Advanced mode enables idempotency keys and skip validation option.',
        ],
    },
    {
        id: 3,
        name: 'Attributes',
        type: 'text',
        content: [
            'Get the on-chain metadata of a collection or token. Attributes are stored as key/value pairs which can consist of any bytes/text. Special attributes like URI, name, and description hold special behavior in the blockchain, for new users, it’s recommended to use set the URI attribute and use a json file link containing the metadata. ',
        ],
    },
    {
        id: 4,
        name: 'Idempotency Key',
        type: 'text',
        content: [
            'In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application.',
            ' As an example, This is a highly helpful quality since it allows an operation to be repeated or done as many times as required without having any unexpected consequences. The algorithm might need to keep track of whether a non-idempotent operation has previously been carried out or not.',
            '**Where is this applied in the Enjin Platform API?**',
            'As an example, we can imagine a situation where a game dev runs a function that will transfer 0.1 ENJ tokens to one of his users if he does not have an idempotent code logic implemented on the API, in case the platform returns an error but the tokens still got transferred, he would not be able to actually know if this operation worked as expected or not, and he would not be able to retry that specific transaction without risking sending another 0.1 ENJ tokens to one of his users. By implementing an idempotent code key in the Enjin Platform API, we solve this issue by returning an idempotency key after every transaction, where in case he tries to run the transaction with the same idempotency key, the platform will actually check the result of the transaction that was performed using that key and prevent it from getting executed.',
        ],
    },
    {
        id: 5,
        name: 'Token ID',
        type: 'list',
        content: [
            'Integer → A type that represents unsigned integers up to 256 bits.',
            'StringID → Converts a string into a hex value, then converts that to an integer. This encoding is reversible.',
            'Hash → Hashes an arbitrary object into an integer',
            'Erc-1155 Style → A 16-character hex formatted ERC1155 style token id, e.g. 0x1080000000000123. Index → A 64-bit integer index. This will be converted to hex and concatenated with the tokenId to make the final unique NFT id. Defaults to 0 is not supplied.',
        ],
    },
    {
        id: 6,
        name: 'Beam Types',
        type: 'list',
        content: [
            'Transfer Token → transfers the minted token to the address that claims it.',
            'Mint on Demand → mints the token to the address that claims it.',
        ],
    },
];

const query = ref('');
const selectedContent = ref();

const filteredContent = computed(() =>
    query.value === ''
        ? []
        : contents.filter((content) => {
              return content.name.toLowerCase().includes(query.value.toLowerCase());
          })
);

const queryChange = (e) => {
    query.value = e.target.value;
    selectedContent.value = '';
};

const listenReadmore = () => {
    events.on('readmore', (name) => {
        emit('openHelp');
        selectedContent.value = contents.find((content) => content.name === name);
    });
};

onMounted(() => {
    listenReadmore();
});
</script>
