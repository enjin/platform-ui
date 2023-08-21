<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2 class="mt-6 text-center text-2xl font-semibold tracking-normal text-gray-900">Reset your password</h2>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="requestReset">
                    <p class="text-sm text-center">
                        Enter your registered email below to receive password reset instructions
                    </p>
                    <FormInput
                        v-model="email"
                        label="Email address"
                        name="email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
                        <Btn is-submit primary :loading="isLoading" class="w-full"> Reset Password </Btn>
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
import { snackbarErrors } from '~/util';
import { ArrowLeftIcon } from '@heroicons/vue/20/solid';

const router = useRouter();
const appStore = useAppStore();

const isLoading = ref(false);
const email = ref('');
const formRef = ref();

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

const requestReset = async () => {
    if (!(await isValid())) return;

    isLoading.value = true;
    try {
        const res = await AuthApi.requestPasswordReset(email.value);
        if (res.data.RequestPasswordReset === true) {
            snackbar.success({ title: 'Password reset link sent', save: false });
        } else {
            snackbar.error({ title: 'Error sending password reset link' });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({ title: 'Error sending password reset link' });
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    if (appStore.loggedIn) {
        redirectToCollections();
    }
})();
</script>
