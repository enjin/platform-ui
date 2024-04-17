<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2 class="mt-6 text-center text-2xl font-semibold tracking-normal text-gray-900">
                Sign in to your account
            </h2>
        </div>
        <div
            v-if="allowResend"
            class="flex justify-between p-4 text-sm items-center w-full sm:max-w-md bg-green-300 bg-opacity-20 rounded-lg"
        >
            <span class="font-medium">Did not receive a verification email ?</span>
            <Btn primary @click="resendVerification">Resend</Btn>
        </div>
        <div class="mt-4 mx-auto w-full sm:max-w-md">
            <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="verifyCaptcha">
                    <FormInput
                        v-model="email"
                        label="Email address"
                        name="email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        @focus="loadCaptchaScript"
                    />
                    <FormInput
                        v-model="password"
                        label="Password"
                        name="password"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        type="password"
                    />
                    <vue-recaptcha
                        v-if="hasCaptcha"
                        ref="captchaRef"
                        :style="{ visibility: isCaptchaBadgeVisible ? 'visible' : 'hidden' }"
                        size="invisible"
                        :load-recaptcha-script="false"
                        :sitekey="reCaptchaSiteKey"
                        @verify="login"
                        @expired="onCaptchaExpired"
                    />
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <RouterLink
                                :to="{ name: 'platform.auth.register' }"
                                class="font-medium text-primary hover:text-primary-light text-xs sm:text-sm"
                            >
                                Create an account
                            </RouterLink>
                            <RouterLink
                                :to="{ name: 'platform.auth.forgot.password' }"
                                class="font-medium text-primary hover:text-primary-light text-xs sm:text-sm"
                            >
                                Forgot your password?
                            </RouterLink>
                        </div>
                        <Btn is-submit primary :loading="isLoading" class="w-full"> Sign in </Btn>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import FormInput from '~/components/FormInput.vue';
import * as yup from 'yup';
import EnjinLogo from '~/components/EnjinLogo.vue';
import snackbar from '~/util/snackbar';
import { snackbarErrors } from '~/util';
import { AuthApi } from '~/api/auth';
import { VueRecaptcha } from 'vue-recaptcha';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const formRef = ref();
const captchaRef = ref();
const isCaptchaBadgeVisible = ref(false);
const reCaptchaSiteKey = window.bootstrap?.captcha_key || 'null';
const hasCaptcha = window.bootstrap?.captcha_key?.length > 0;
const allowResend = computed(() => appStore.allowResend);

const validation = yup.object().shape({
    email: yup.string().email('Email is not valid').required('Email is required'),
    password: yup.string().required('Password is required'),
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
    if (!hasCaptcha) return;

    console.log('loadCaptchaScript');
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
        return login();
    }

    captchaRef.value.execute();
};

const login = async () => {
    if (!(await isValid())) return;

    isLoading.value = true;
    try {
        if (!(await appStore.login(email.value, password.value))) {
            snackbar.error({ title: 'Invalid username or password' });
            isLoading.value = false;
            return;
        }
        if (await appStore.init()) {
            snackbar.success({ title: 'Logged in successfully', save: false });
            if (appStore.hasValidConfig) {
                redirectToCollections();
            }
        }
    } catch (e: any) {
        if (snackbarErrors(e)) {
            return;
        }
        if (e.message.includes('email address is not verified')) {
            useAppStore().allowResend = true;
            snackbar.error({
                title: 'Email address is not verified',
                text: 'Please verify your email address.',
            });
        } else {
            snackbar.error({
                title: 'An error occurred while logging in.',
                text: 'Please try again.',
            });
        }
    } finally {
        isLoading.value = false;
        captchaRef.value?.reset();
    }
};

const checkVerified = () => {
    if (route.query.verified) {
        snackbar.success({
            title: 'Your email has been verified.',
            text: 'You can now login.',
            save: false,
        });
        router.replace({ query: undefined });
    }
};

const resendVerification = async () => {
    try {
        if (!email.value) {
            snackbar.error({
                title: 'Email required',
                text: 'Please enter your email address.',
            });

            return;
        }
        await AuthApi.resendVerificationEmail(email.value);
        snackbar.success({
            title: 'Verification email sent.',
            text: 'Please check your inbox.',
            save: false,
        });
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'An error occurred while sending the verification email.',
            text: 'Please try again.',
        });
    }
};

(async () => {
    checkVerified();
    if (appStore.loggedIn) {
        redirectToCollections();
    }
})();

watch(
    () => appStore.loggedIn,
    () => {
        if (appStore.loggedIn) router.push({ name: 'platform.collections' });
    }
);
</script>
