<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2 class="mt-6 text-center text-2xl font-semibold tracking-normal text-gray-900">
                Sign in to your account
            </h2>
        </div>
        <div
            v-if="!appStore.allowResend"
            class="flex justify-between p-4 text-sm items-center w-full sm:max-w-md bg-green-300 bg-opacity-20 rounded-lg"
        >
            <span class="font-medium">Did not receive a verification email ?</span>
            <Btn primary>Resend</Btn>
        </div>
        <div class="mt-4 mx-auto w-full sm:max-w-md">
            <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="login">
                    <FormInput
                        v-model="email"
                        label="Email address"
                        name="email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                    <FormInput
                        v-model="password"
                        label="Password"
                        name="password"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        type="password"
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
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import FormInput from '~/components/FormInput.vue';
import * as yup from 'yup';
import EnjinLogo from '~/components/EnjinLogo.vue';
import snackbar from '~/util/snackbar';
import { snackbarErrors } from '~/util';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const formRef = ref();

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
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'An error occurred while logging in.',
            text: 'Please try again.',
        });
    } finally {
        isLoading.value = false;
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
