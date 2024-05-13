<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2
                class="mt-6 text-center text-2xl font-semibold tracking-normal text-light-content-strong dark:text-dark-content-strong"
            >
                Create an account
            </h2>
        </div>
        <div class="mt-8 mx-auto w-full sm:max-w-md">
            <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="verifyCaptcha">
                    <FormInput
                        v-model="email"
                        label="Email address"
                        name="email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        @focus="loadCaptchaScript"
                    />
                    <FormInput
                        v-model="password"
                        label="Password"
                        name="password"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        type="password"
                    />
                    <FormInput
                        v-model="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        type="password"
                    />
                    <vue-recaptcha
                        v-if="hasCaptcha"
                        ref="captchaRef"
                        :style="{ visibility: isCaptchaBadgeVisible ? 'visible' : 'hidden' }"
                        size="invisible"
                        :load-recaptcha-script="false"
                        :sitekey="reCaptchaSiteKey"
                        @verify="register"
                        @expired="onCaptchaExpired"
                    />
                    <div>
                        <div class="flex items-center justify-end mb-4">
                            <div class="text-sm">
                                <RouterLink
                                    :to="{ name: 'platform.auth.login' }"
                                    class="font-medium text-primary hover:text-primary-light"
                                >
                                    Already have an account?
                                </RouterLink>
                            </div>
                        </div>
                        <Btn is-submit primary :disabled="!isCaptchaBadgeVisible" :loading="isLoading" class="w-full">
                            Register
                        </Btn>
                    </div>
                </Form>
            </div>
            <p class="text-sm text-center px-8 pt-4">
                By proceeding, you agree with the
                <a href="https://enjin.io/terms-of-service" target="_blank" class="text-primary"> Terms of Service </a>
                and our
                <a href="https://enjin.io/privacy-policy" target="_blank" class="text-primary"> Privacy Policy </a>
            </p>
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
import { snackbarErrors } from '~/util';
import { VueRecaptcha } from 'vue-recaptcha';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const formRef = ref();
const captchaRef = ref();
const isCaptchaBadgeVisible = ref(false);
const reCaptchaSiteKey = window.bootstrap?.captcha_key || 'null';
const hasCaptcha = window.bootstrap?.captcha_key?.length > 0;

const validation = yup.object().shape({
    email: yup.string().email('Email is not valid').required('Email is required'),
    password: yup.string().required().min(8, 'Your password is too short.'),
    confirmPassword: yup
        .string()
        .required('Your passwords do not match.')
        .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

const redirectToLogin = () => {
    router.push({ name: 'platform.auth.login' });
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
        return register();
    }
    captchaRef.value.execute();
};

const register = async (recaptcha?: string) => {
    if (!(await isValid())) return;

    isLoading.value = true;
    try {
        const res = await AuthApi.register(email.value, password.value, recaptcha);
        if (res.data.RegisterUser.id) {
            snackbar.success({
                title: 'Account created successfully!',
                text: 'A link has been sent to your email inbox to verify your account.',
                save: false,
            });
        }
        redirectToLogin();
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Account creation failed!',
            text: 'Please try again.',
        });
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    if (appStore.loggedIn) {
        redirectToLogin();
    } else {
        loadCaptchaScript();
    }
})();
</script>
