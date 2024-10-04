<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 pb-20 overflow-y-auto transition-all">
        <div class="flow-root max-w-3xl mx-auto">
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl text-light-content-strong dark:text-dark-content-strong">Create Token</h1>
                </div>
                <div class="space-x-4 ml-auto">
                    <Btn dusk="simpleBtn" :primary="mode === 'simple'" @click="mode = 'simple'"> Simple </Btn>
                    <Btn dusk="advancedBtn" :primary="mode === 'advanced'" @click="mode = 'advanced'"> Advanced </Btn>
                </div>
            </div>
            <Form
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @invalid-submit="invalidSubmit"
                @submit="createToken"
            >
                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary p-4 md:p-6 shadow rounded-lg sm:p-6 transition-all"
                >
                    <div class="space-y-6">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <h3
                                    class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Token Details
                                </h3>
                                <Tooltip
                                    text="Creates a new token in a collection owned by you, the new token will be automatically
                                minted to the specified recipient account/wallet"
                                >
                                    <QuestionMarkCircleIcon
                                        class="ml-1 w-4 h-4 cursor-pointer text-light-content dark:text-dark-content"
                                    />
                                </Tooltip>
                            </div>
                            <a
                                href="https://docs.enjin.io/docs/first-steps-start-here#step-2-click-create-token"
                                target="_blank"
                            >
                                <Btn primary> Documentation </Btn>
                            </a>
                        </div>
                        <FormSelect
                            v-model="collectionId"
                            name="collectionId"
                            label="Collection ID"
                            description="The collection ID to mint from."
                            tooltip="The Collection ID can be retrieved by accessing the details of the request on the transactions page."
                            placeholder="Select a collection ID"
                            :options="collectionIds"
                            required
                        />
                        <TokenIdInput
                            v-model="tokenId"
                            label="Token ID"
                            description="The token ID to set. This must be unique for this collection."
                            required
                            readmore="Token ID"
                        />
                        <FormInput
                            v-model="name"
                            name="name"
                            label="Name"
                            description="The name of the token."
                            required
                        />
                        <FormInput
                            v-model="imageUrl"
                            name="imageUrl"
                            label="Image URL"
                            class="w-full"
                            description="The URL of the image for the token."
                        />
                        <RichTextEditor
                            v-model="description"
                            name="description"
                            label="Description"
                            description="The description of the token."
                        />
                        <FormInput
                            v-model="symbol"
                            name="symbol"
                            label="Symbol"
                            description="The symbol of the token."
                            required
                        />
                        <FormInput
                            v-model="recipient"
                            name="recipient"
                            label="Recipient"
                            description="The recipient account of the tokens for the initial mint."
                            required
                            tooltip="Wallet Address"
                        />
                        <div>
                            <label
                                class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong mb-2"
                                >Token type</label
                            >
                            <div class="flex">
                                <div
                                    class="flex-1 px-4 py-8 border border-light-stroke-strong dark:border-dark-stroke-strong rounded-l-2xl cursor-pointer transition-all text-light-content-strong dark:text-dark-content-strong text-center"
                                    :class="{
                                        '!text-light-content-brand dark:!text-dark-content-brand !border-light-surface-brand':
                                            tokenType === 'nft',
                                    }"
                                    @click="tokenType = 'nft'"
                                    dusk="nftOption"
                                >
                                    <div class="font-bold text-lg">Non Fungible Token (NFT)</div>
                                    <div class="text-xs mt-1">
                                        Verifiably distinct and unique digital items. Recommended for collectibles.
                                    </div>
                                </div>
                                <div
                                    class="flex-1 px-4 py-8 border border-light-stroke-strong dark:border-dark-stroke-strong rounded-r-2xl cursor-pointer transition-all text-light-content-strong dark:text-dark-content-strong text-center"
                                    :class="{
                                        '!text-light-content-brand dark:!text-dark-content-brand !border-light-surface-brand':
                                            tokenType === 'ft',
                                    }"
                                    @click="tokenType = 'ft'"
                                    dusk="ftOption"
                                >
                                    <div class="font-bold text-lg">Fungible Token (FT)</div>
                                    <div class="text-xs mt-1">
                                        Items that can have multiple copies. Recommended for gaming items, trading
                                        cards, etc.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-if="tokenType === 'ft'">
                            <FormInput
                                v-model="initialSupply"
                                name="initialSupply"
                                label="Initial Supply"
                                description="The initial supply of tokens to mint to the specified recipient. Must not exceed the token maximum supply if set."
                                type="number"
                                tooltip="Number of items to be minted when this item is first created. If this is below maximum supply, users can mint more of this item in the future."
                            />
                            <InputHeader
                                label="Supply Cap"
                                description="Set the maximum supply for your token."
                                readmore="https://support.enjin.io/hc/en-gb/articles/19114269858834"
                                tooltip="Learn more about the different supply types here"
                            />
                            <div class="flex space-x-4 w-full">
                                <FormSelect
                                    v-model="capType"
                                    :options="capTypes"
                                    name="capType"
                                    label="Supply Cap Type"
                                    class="flex-1"
                                />
                                <FormInput
                                    v-if="capType === TokenCapType.COLLAPSING_SUPPLY || capType === TokenCapType.SUPPLY"
                                    v-model="capAmount"
                                    name="capAmount"
                                    label="Max Supply"
                                    type="number"
                                />
                            </div>
                        </template>
                    </div>
                </div>

                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary p-4 md:p-6 shadow rounded-lg sm:p-6 transition-all"
                >
                    <div class="space-y-6">
                        <div class="">
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Token Royalty
                            </h3>
                            <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                The market behavior for a token.
                            </p>
                        </div>
                        <div class="mt-6">
                            <div class="flex flex-row space-x-4">
                                <FormInput
                                    v-model="beneficiaryAddress"
                                    name="beneficiaryAddress"
                                    class="w-full"
                                    label="Beneficiary Address"
                                    tooltip="Account receiving the royalties from Marketplace interactions."
                                />
                                <FormInput
                                    v-model="beneficiaryPercentage"
                                    class="w-[100px] flex flex-col justify-between"
                                    input-class="w-full"
                                    name="beneficiaryPercentage"
                                    label="Percentage"
                                    tooltip="The percentage of royalties the beneficiary will receive from Marketplace interactions."
                                    type="number"
                                    :min="0"
                                    prefix="%"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-light-surface-primary dark:bg-dark-surface-primary p-4 md:p-6 shadow rounded-lg sm:p-6 transition-all"
                >
                    <FormList
                        v-model="attributes"
                        label="Attributes"
                        description="Set initial attributes for this token."
                        @add="addAttributeItem"
                        @remove="removeAttributeItem"
                        readmore="Attributes"
                        dusk-id="attributes"
                    >
                        <template #headers>
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Key
                                </label>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">The attribute key.</p>
                            </div>
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                                >
                                    Value
                                </label>
                                <p class="mt-1 text-sm text-light-content dark:text-dark-content">
                                    The attribute value.
                                </p>
                            </div>
                            <div class="w-5"></div>
                        </template>
                        <template #inputs="{ inputs, index }">
                            <div class="flex-1">
                                <input
                                    v-model="inputs.key"
                                    :name="`input__attribute-key-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                />
                            </div>
                            <div class="flex-1">
                                <input
                                    v-model="inputs.value"
                                    :name="`input__attribute-value-${index + 1}`"
                                    type="text"
                                    class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content placeholder:dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-light-surface-background dark:bg-dark-surface-background"
                                />
                            </div>
                        </template>
                    </FormList>
                </div>

                <div
                    v-if="isAdvanced"
                    class="bg-light-surface-primary dark:bg-dark-surface-primary p-4 md:p-6 shadow rounded-lg sm:p-6 transition-all"
                >
                    <div class="space-y-6">
                        <div class="">
                            <h3
                                class="text-base font-semibold leading-6 text-light-content-strong dark:text-dark-content-strong"
                            >
                                Other Options
                            </h3>
                        </div>
                        <div class="mt-6">
                            <div class="flex flex-col gap-6">
                                <FormCheckbox
                                    v-model="infuseEnj"
                                    name="infuseEnj"
                                    label="Infuse ENJ"
                                    description="Use this option to infuse ENJ into the token."
                                    readmore="https://support.nft.io/hc/en-gb/articles/20436178520594"
                                />
                                <div v-if="infuseEnj" class="space-y-4">
                                    <FormInput
                                        v-model="infuseAmount"
                                        name="infuseAmount"
                                        label="ENJ Infusion"
                                        description="Enter the amount of ENJ you wish to infuse in each unit."
                                        type="number"
                                        required
                                    />
                                    <FormSelect
                                        v-model="infuseAccess"
                                        name="infuseAccess"
                                        label="Infusion Access"
                                        description=""
                                        :options="['Only Me', 'Everyone']"
                                    />
                                    <template v-if="tokenType === 'ft'">
                                        <FormInput
                                            v-model="initialSupply"
                                            name="itemsInfuse"
                                            label="Number of items"
                                            type="number"
                                            disabled
                                        />
                                        <FormInput
                                            :value="totalInfuseAmountComputed"
                                            name="totalInfuseAmount"
                                            label="Total Infuse Amount"
                                            type="number"
                                            disabled
                                        />
                                    </template>
                                </div>
                                <FormCheckbox
                                    v-model="listingForbidden"
                                    name="listingForbidden"
                                    label="Listing Forbidden"
                                    description="By checking this field, you are prohibiting this token from being listed in the marketplace."
                                />
                                <FormCheckbox
                                    v-model="isCurrency"
                                    name="isCurrency"
                                    label="Is Currency"
                                    description="If the token is a currency."
                                />
                                <FormInput
                                    v-model="idempotencyKey"
                                    name="idempotencyKey"
                                    label="Idempotency Key"
                                    description="The idempotency key to set. It is recommended to use a UUID for this."
                                    tooltip="In mathematical and computer science terms, idempotency is a property of certain operations that can be applied repeated times without changing the initial result of the application."
                                    readmore="Idempotency Key"
                                />

                                <FormCheckbox
                                    v-model="skipValidation"
                                    name="skipValidation"
                                    label="Skip validation"
                                    description="Skip all validation rules, use with caution. Defaults to false."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3 justify-start px-4 sm:px-0">
                    <RouterLink
                        :to="{ name: 'platform.tokens' }"
                        type="button"
                        dusk="cancelBtn"
                        class="rounded-md bg-light-surface-primary dark:bg-dark-surface-primary py-2 px-3 text-sm font-semibold text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong hover:bg-light-surface-background hover:dark:bg-dark-surface-background !bg-opacity-50"
                    >
                        Cancel
                    </RouterLink>
                    <Btn dusk="createBtn" :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import FormCheckbox from '~/components/FormCheckbox.vue';
import { addressToPublicKey } from '~/util/address';
import { formatData, formatToken, snackbarErrors, validateToken } from '~/util';
import { TokenCapType, TokenIdSelectType } from '~/types/types.enums';
import FormList from '~/components/FormList.vue';
import TokenIdInput from '~/components/TokenIdInput.vue';
import FormSelect from '~/components/FormSelect.vue';
import { useAppStore } from '~/store';
import { TokenApi } from '~/api/token';
import {
    addressRequiredSchema,
    addressNotRequiredSchema,
    booleanNotRequiredSchema,
    collectionIdRequiredSchema,
    numberNotRequiredSchema,
    numberRequiredSchema,
    stringNotRequiredSchema,
    stringRequiredSchema,
} from '~/util/schemas';
import Tooltip from '~/components/Tooltip.vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import RichTextEditor from '~/components/RichTextEditor.vue';
import InputHeader from '~/components/InputHeader.vue';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const mode = ref('simple');
const imageUrl = ref('');
const imageType = ref();
const name = ref('');
const description = ref('');
const tokenType = ref('nft');
const capType = ref(TokenCapType.SINGLE_MINT);

//Advanced
const collectionId = ref('');
const recipient = ref();
const tokenId = ref({
    tokenId: '',
    tokenType: TokenIdSelectType.Integer,
});
const initialSupply = ref(1);
const capAmount = ref();
const infuseAmount = ref();
const isCurrency = ref(false);
const infuseEnj = ref(false);
const symbol = ref('');
const infuseAccess = ref('Only Me');
const beneficiaryAddress = ref('');
const beneficiaryPercentage = ref(0);
const listingForbidden = ref(false);
const idempotencyKey = ref('');
const skipValidation = ref(false);
const formRef = ref();

const attributes = ref([
    {
        key: '',
        value: '',
    },
]);

const capTypes =
    appStore.config.network === 'canary'
        ? [TokenCapType.INFINITE, TokenCapType.COLLAPSING_SUPPLY, TokenCapType.SINGLE_MINT]
        : [TokenCapType.INFINITE, TokenCapType.SUPPLY, TokenCapType.SINGLE_MINT];

const collectionIds = computed(() => appStore.collections);
const isAdvanced = computed(() => mode.value === 'advanced');

const totalInfuseAmountComputed = computed(() => {
    return initialSupply.value * infuseAmount.value;
});

const validation = yup.object({
    imageUrl: stringNotRequiredSchema,
    name: stringRequiredSchema,
    description: stringNotRequiredSchema,
    symbol: stringRequiredSchema,
    collectionId: collectionIdRequiredSchema,
    tokenId: stringRequiredSchema,
    recipient: addressRequiredSchema,
    initialSupply: yup.number().when({
        is: () => tokenType.value === 'ft',
        then: () => numberRequiredSchema.typeError('Initial Supply must be a number').min(1),
        otherwise: () => numberNotRequiredSchema,
    }),
    capAmount: numberNotRequiredSchema,
    beneficiaryAddress: addressNotRequiredSchema,
    beneficiaryPercentage: yup.number().when('beneficiaryAddress', {
        is: (val) => val !== '' && val !== null,
        then: () => yup.number().typeError('Percentage must be a number').min(0).max(100).required(),
        otherwise: () => yup.number().nullable().typeError('Percentage must be a number'),
    }),
    listingForbidden: booleanNotRequiredSchema,
    isCurrency: booleanNotRequiredSchema,
    idempotencyKey: stringNotRequiredSchema,
    skipValidation: booleanNotRequiredSchema,
});

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const simpleAttributes = () => {
    return [
        {
            key: 'name',
            value: name.value,
        },
        {
            key: 'description',
            value: description.value,
        },
        {
            key: 'media',
            value: imageUrl.value
                ? JSON.stringify([
                      {
                          url: imageUrl.value,
                          type: imageType.value,
                      },
                  ])
                : '',
        },
    ].filter((a) => a.value !== '');
};

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const createToken = async () => {
    if (!(await isValid())) {
        return;
    }

    if (!validateToken(tokenId.value)) {
        snackbar.error({
            title: 'Token ID',
            text: 'Token ID is invalid',
        });
        return;
    }

    try {
        isLoading.value = true;

        const res = await TokenApi.createToken(
            formatData({
                recipient: addressToPublicKey(recipient.value),
                collectionId: collectionId.value,
                params: {
                    tokenId: formatToken(tokenId.value),
                    initialSupply: initialSupply.value,
                    cap: {
                        type: capType.value,
                        amount: capAmount.value,
                    },
                    behavior: {
                        hasRoyalty:
                            beneficiaryAddress.value !== ''
                                ? {
                                      beneficiary: addressToPublicKey(beneficiaryAddress.value),
                                      percentage: parseFloat(beneficiaryPercentage.value.toString()),
                                  }
                                : null,
                        isCurrency: isCurrency.value,
                    },
                    listingForbidden: listingForbidden.value,
                    ...(infuseEnj.value
                        ? {
                              infusion: totalInfuseAmountComputed.value,
                              anyoneCanInfuse: infuseAccess.value === 'Everyone',
                          }
                        : {}),
                    attributes: [
                        ...simpleAttributes(),
                        ...attributes.value.filter((a) => a.key !== '' && a.value !== ''),
                    ],
                    metadata: {
                        name: name.value,
                        symbol: symbol.value,
                    },
                },
                idempotencyKey: idempotencyKey.value,
                skipValidation: skipValidation.value,
            })
        );

        const id = res.data?.CreateToken?.id;

        if (id) {
            snackbar.success({
                title: 'Token created',
                text: `Token created with transaction id ${id}`,
                event: id,
            });
            router.push({ name: 'platform.tokens' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Token create',
            text: 'Token create failed',
        });
    } finally {
        isLoading.value = false;
    }
};

const addAttributeItem = () => {
    attributes.value.push({
        key: '',
        value: '',
    });
};

const removeAttributeItem = (index: number) => {
    attributes.value.splice(index, 1);
};

watch(
    () => tokenType.value,
    () => {
        if (tokenType.value === 'nft') {
            capType.value = TokenCapType.SINGLE_MINT;
        } else {
            capType.value = TokenCapType.INFINITE;
        }
    }
);
</script>
