<template>
    <div class="px-4 sm:px-6 lg:px-8 py-4 pb-20 overflow-y-auto transition-all">
        <div class="flow-root space-y-4 pb-4 max-w-3xl mx-auto">
            <div class="mb-4">
                <h1 class="text-2xl">Create Beam</h1>
            </div>
            <CollapseCard
                v-for="(item, idx) in tokens"
                :key="idx"
                class="animate-fade-in"
                :title="`Beam Asset ${idx + 1}`"
            >
                <template #icon>
                    <CheckCircleIcon class="ml-2 my-auto h-5 w-5 text-green-400" aria-hidden="true" v-if="item.valid" />
                    <XCircleIcon class="ml-2 my-auto h-5 w-5 text-red-400" aria-hidden="true" v-else />
                </template>
                <template #actions>
                    <XMarkIcon class="h-5 w-5 cursor-pointer" @click="removeItem(idx)" />
                </template>
                <ClaimableTokenForm v-model="item.values" @validation="setValidation(idx, $event)" />
            </CollapseCard>
            <Btn class="!flex" @click="addItem" primary>Add Asset</Btn>

            <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="createBeam">
                <div class="bg-white px-4 py-5 shadow rounded-lg sm:p-6">
                    <div class="space-y-6">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <h3 class="text-base font-semibold leading-6 text-gray-900">Parameters</h3>
                            </div>
                            <a href="https://docs.enjin.io/docs/creating-an-enjin-beam" target="_blank">
                                <Btn primary> Documentation </Btn>
                            </a>
                        </div>
                        <div class="mt-5 md:col-span-2 md:mt-0">
                            <div class="flex flex-col gap-6">
                                <FormSelect
                                    v-model="collectionId"
                                    name="collectionId"
                                    label="Collection ID"
                                    description="The collection ID"
                                    placeholder="Select a collection ID"
                                    :options="collectionIds"
                                    required
                                />
                                <FormInput
                                    v-model="name"
                                    name="name"
                                    label="Name"
                                    description="The beam name."
                                    required
                                />
                                <FormInput
                                    v-model="description"
                                    name="description"
                                    description="The beam description."
                                    label="Description"
                                    tooltip="The beam description appears in the Enjin Wallet app when a user first scans the QR code, not to be confused by the NFT description."
                                    required
                                />
                                <FormInput
                                    v-model="image"
                                    name="image"
                                    label="Image"
                                    description="The beam image URL."
                                    required
                                />
                                <FormDateInput
                                    v-model="start"
                                    name="start"
                                    label="Start time"
                                    description="The claim period start date."
                                    required
                                />
                                <FormDateInput
                                    v-model="end"
                                    :min-date="start"
                                    name="end"
                                    label="End time"
                                    description="The claim period end date."
                                    required
                                />
                                <MultiCheckbox
                                    v-model="flags"
                                    name="flags"
                                    :options="beamFlags"
                                    label="Flags"
                                    description="The beam flags that should be enabled disabled."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between">
                    <div class="flex space-x-3 justify-end">
                        <RouterLink
                            :to="{ name: 'platform.beams' }"
                            type="button"
                            class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </RouterLink>
                        <Btn :loading="isLoading" :disabled="isLoading" primary is-submit>Create</Btn>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import { Form } from 'vee-validate';
import * as yup from 'yup';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import { useRouter } from 'vue-router';
import FormInput from '~/components/FormInput.vue';
import { formatData, snackbarErrors } from '~/util';
import { BeamFlag } from '~/types/types.enums';
import MultiCheckbox from '~/components/MultiCheckbox.vue';
import CollapseCard from '~/components/CollapseCard.vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import ClaimableTokenForm from '~/components/beam/ClaimableTokenForm.vue';
import FormDateInput from '~/components/FormDateInput.vue';
import { useAppStore } from '~/store';
import { BeamApi } from '~/api/beam';
import { ClaimTokenValuesInterface } from '~/types/types.interface';
import FormSelect from '~/components/FormSelect.vue';

const router = useRouter();
const appStore = useAppStore();

const formRef = ref();
const isLoading = ref(false);
const collectionId = ref('');
const name = ref('');
const description = ref('');
const image = ref('');
const start = ref(new Date());
const end = ref(new Date());

const flags = ref([]);

const collectionIds = computed(() => appStore.collections);
const isAllValid = computed(() => {
    return (
        tokens.value.length > 0 &&
        tokens.value.every((item: { valid: boolean; values: ClaimTokenValuesInterface }) => item.valid) &&
        formRef.value.getMeta().valid
    );
});

const flagTooltips = {
    [BeamFlag.PAUSED]: 'Pausing a Beam will temporarily stop any claims until it is unpaused again.',
    [BeamFlag.SINGLE_USE]:
        "Setting a Beam to Single Use mode will generate unique QR codes for every claim that can be individually distributed.  Single use Beams can only be claimed via the individual claim QR codes and not via the Beam's main QR code.",
    [BeamFlag.PRUNABLE]:
        "Claims for Beams which have expired will be deleted from the database after the number of days set in the PRUNE_EXPIRED_CLAIMS environment variable (defaults to 30 days).  Setting this flag to false will exclude the Beam's claims from being pruned.",
};

const beamFlags = Object.values(BeamFlag).map((flag) => ({
    label: flag.charAt(0) + flag.toLowerCase().replace('_', ' ').slice(1),
    value: flag,
    tooltip: flagTooltips[flag],
}));

const tokens: Ref<
    {
        valid: boolean;
        values: ClaimTokenValuesInterface;
    }[]
> = ref([
    {
        valid: false,
        values: {},
    },
]);

const validation = yup.object({
    collectionId: yup.number().typeError('Collection ID must be a number').nullable().required(),
    name: yup.string().nullable().required(),
    description: yup.string().nullable().required(),
    image: yup.string().nullable().required(),
    start: yup.date().required(),
    end: yup.date().min(yup.ref('start')).required(),
    flags: yup.array().of(yup.string()),
});

const addItem = () => {
    tokens.value.push({
        valid: false,
        values: {},
    });
};

const removeItem = (index: number) => {
    tokens.value.splice(index, 1);
};

const setValidation = (index: number, isValid: boolean) => {
    tokens.value[index].valid = isValid;
};

const validateForms = async () => {
    await formRef.value.validate();
};

const createBeam = async () => {
    await validateForms();
    if (!isAllValid.value) return;
    try {
        isLoading.value = true;
        const res = await BeamApi.createBeam(
            formatData({
                collectionId: collectionId.value,
                name: name.value,
                description: description.value,
                image: image.value,
                start: new Date(start.value).toISOString(),
                end: new Date(end.value).toISOString(),
                flags: flags.value.map((f) => {
                    return {
                        flag: f,
                        enabled: true,
                    };
                }),
                tokens: tokens.value.map((t) => t.values),
            })
        );

        const code = res.data?.CreateBeam;

        if (code) {
            snackbar.success({
                title: 'Beam created',
                text: `Beam created with code ${code}`,
            });
            router.push({ name: 'platform.beams' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Beam create',
            text: 'Failed to create beam',
        });
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    const endDate = new Date();
    end.value = new Date(endDate.setDate(endDate.getDate() + 3));
})();
</script>
