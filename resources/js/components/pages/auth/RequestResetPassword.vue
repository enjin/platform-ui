<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2
                class="mt-6 text-center text-2xl font-semibold tracking-normal text-light-content-strong dark:text-dark-content-strong"
            >
                Reset your password
            </h2>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="verifyCaptcha">
                    <p class="text-sm text-center">
                        Enter your registered email below to receive password reset instructions
                    </p>
                    <FormInput
                        v-model="email"
                        label="Email address"
                        name="email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        @focus="loadCaptchaScript"
                    />
                    <vue-recaptcha
                        v-if="hasCaptcha"
                        ref="captchaRef"
                        :style="{ visibility: isCaptchaBadgeVisible ? 'visible' : 'hidden' }"
                        size="invisible"
                        :load-recaptcha-script="false"
                        :sitekey="reCaptchaSiteKey"
                        @verify="requestReset"
                        @expired="onCaptchaExpired"
                    />
                    <div>
                        <div class="flex items-center justify-start mb-4">
                            <div class="text-sm">
                                <RouterLink
                                    :to="{ name: 'platform.auth.login' }"
                                    class="font-medium text-primary hover:text-primary-light"
                                >
                                    <div class="flex items-center">
                                        <ArrowLeftIcon class="w-4 h-4 mr-1" />
                                        <span> Back to Sign in </span>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                        <Btn is-submit primary :disabled="!isCaptchaBadgeVisible" :loading="isLoading" class="w-full">
                            Reset Password
                        </Btn>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import FormInput from '~/components/FormInput.vue';
import * as yup from 'yup';
import EnjinLogo from '~/components/EnjinLogo.vue';
import { AuthApi } from '~/api/auth';
import snackbar from '~/util/snackbar';
import { ArrowLeftIcon } from '@heroicons/vue/20/solid';
import { VueRecaptcha } from 'vue-recaptcha';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const email = ref('');
const formRef = ref();
const captchaRef = ref();
const isCaptchaBadgeVisible = ref(false);
const reCaptchaSiteKey = window.bootstrap?.captcha_key || 'null';
const hasCaptcha = window.bootstrap?.captcha_key?.length > 0;

const validation = yup.object().shape({
    email: yup.string().email('Email is not valid').required('Email is required'),
});

const redirectToCollections = () => {
    router.push({ name: 'platform.collections' });
};

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const onCaptchaExpired = () => {
    captchaRef.value.reset();
};

const loadCaptchaScript = async () => {
    if (!hasCaptcha) {
        isCaptchaBadgeVisible.value = true;

        return;
    }
    if (!document.getElementById('recaptcha-script')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'recaptcha-script';
        script.async = true;
        script.defer = true;
        script.src = 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl=:1';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    isCaptchaBadgeVisible.value = true;
};

const verifyCaptcha = () => {
    if (!hasCaptcha) {
        return requestReset();
    }

    captchaRef.value.execute();
};

const requestReset = async (recaptcha?: string) => {
    if (!(await isValid())) return;

    isLoading.value = true;
    try {
        await AuthApi.requestPasswordReset(email.value, recaptcha);
        snackbar.success({
            title: "If an account with this email exists, you'll receive an email shortly with information on resetting your password.",
            save: false,
        });
    } catch (e: any) {
        if (e.message.includes('Too many requests')) {
            snackbar.error({
                title: 'Error',
                text: e.message,
            });
        }
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    if (appStore.loggedIn) {
        redirectToCollections();
    } else {
        loadCaptchaScript();
    }
})();
</script>
