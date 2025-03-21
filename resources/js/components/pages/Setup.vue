<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2
                class="mt-6 text-center text-2xl font-semibold tracking-normal text-light-content-strong dark:text-dark-content-strong"
            >
                Setup
            </h2>
        </div>
        <div class="mt-8 mx-auto w-full sm:max-w-md">
            <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form
                    ref="formRef"
                    class="space-y-6"
                    :validation-schema="validation"
                    @invalid-submit="invalidSubmit"
                    @submit="setupAccount"
                >
                    <FormInput
                        v-model="url"
                        label="Enjin Platform URL"
                        name="url"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                    <FormInput
                        v-model="authorizationToken"
                        label="Authorization Token"
                        name="authorization"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        type="password"
                    />
                    <Btn is-submit primary :loading="isLoading" class="w-full"> Setup Account </Btn>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import FormInput from '~/components/FormInput.vue';
import * as yup from 'yup';
import EnjinLogo from '~/components/EnjinLogo.vue';
import snackbar from '~/util/snackbar';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const url = ref();
const authorizationToken = ref('');
const formRef = ref();

const validation = yup.object().shape({
    url: yup.string().required('The URL is required'),
    authorization: yup.string().when('tenant', {
        is: false,
        then: () => yup.string().required('The authorization token is required'),
    }),
});

const redirectToCollections = () => {
    router.push({ name: 'platform.collections' });
};

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const invalidSubmit = () => {
    snackbar.error({
        title: 'Form validation',
        text: 'Please verify that all the fields are valid',
    });
};

const setupAccount = async () => {
    try {
        if (!(await isValid())) {
            return;
        }
        isLoading.value = true;

        if (window.location.protocol === 'https:' && url.value?.protocol === 'http:') {
            throw new Error('You must use an https hostname');
        }

        const parsedUrl = new URL(url.value);
        if (!(await appStore.checkURL(parsedUrl))) return;

        await appStore.setupAccount({
            url: parsedUrl,
            authorization_token: authorizationToken.value,
        });

        redirectToCollections();
    } catch (e: any) {
        snackbar.error({ title: e.message || e });
    }

    isLoading.value = false;
};

(async () => {
    if (appStore.loggedIn) redirectToCollections();
    url.value = appStore.config.url as URL;
})();

watch(
    () => appStore.hasValidConfig,
    () => {
        if (appStore.hasValidConfig) router.push({ name: 'platform.collections' });
    }
);
</script>
