<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2
                class="mt-6 text-center text-2xl font-semibold tracking-normal text-light-content-strong dark:text-dark-content-strong"
            >
                Set new password
            </h2>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-light-surface-primary dark:bg-dark-surface-primary px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form
                    ref="formRef"
                    class="space-y-6"
                    :validation-schema="validation"
                    @invalid-submit="invalidSubmit"
                    @submit="resetPassword"
                >
                    <FormInput
                        v-model="email"
                        label="Email"
                        name="Email"
                        input-class="block w-full rounded-md border-0 py-1.5 text-light-content-strong dark:text-dark-content-strong shadow-sm ring-1 ring-inset ring-light-stroke-strong dark:ring-dark-stroke-strong placeholder:text-light-content dark:text-dark-content focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        disabled
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
                    <Btn is-submit primary :loading="isLoading" class="w-full"> Reset Password </Btn>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '~/store';
import Btn from '~/components/Btn.vue';
import FormInput from '~/components/FormInput.vue';
import * as yup from 'yup';
import EnjinLogo from '~/components/EnjinLogo.vue';
import { AuthApi } from '~/api/auth';
import snackbar from '~/util/snackbar';
import { snackbarErrors } from '~/util';
import { ResetPasswordResponse } from '~/types/types.enums';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

const props = defineProps<{
    token: string;
}>();

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const formRef = ref();

const validation = yup.object().shape({
    password: yup.string().required().min(8, 'Your password is too short.'),
    confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

const redirectToLogin = () => {
    router.push({ name: 'platform.auth.login' });
};

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

const resetPassword = async () => {
    if (!(await isValid())) {
        return;
    }

    isLoading.value = true;
    try {
        const res = await AuthApi.resetPassword(email.value, password.value, confirmPassword.value, props.token);
        if (res.data.ResetPassword === null) {
            throw res.errors[0];
        }

        if (res.data.ResetPassword === ResetPasswordResponse.PASSWORD_RESET) {
            snackbar.success({ title: 'Password reset successfully.', save: false });
            redirectToLogin();
        } else if (res.data.ResetPassword === ResetPasswordResponse.INVALID_TOKEN) {
            snackbar.error({ title: 'Invalid token' });
        } else if (res.data.ResetPassword === ResetPasswordResponse.INVALID_USER) {
            snackbar.error({ title: 'Invalid user', text: 'Please check the email provided' });
        }
    } catch (e: any) {
        if (snackbarErrors(e)) {
            return;
        }
        snackbar.error({ title: 'Error resetting password.' });
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    email.value = route.query.email as string;
    if (appStore.loggedIn) {
        redirectToCollections();
    }
})();
</script>
