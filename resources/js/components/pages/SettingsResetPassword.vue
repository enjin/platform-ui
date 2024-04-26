<template>
    <div>
        <div v-if="enableReset" class="flex flex-col space-y-4">
            <Form
                id="passwordResetForm"
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @submit="resetPassword"
            >
                <FormInput
                    v-model="oldPassword"
                    label="Old Password"
                    placeholder="Old Password"
                    class="sm:w-[430px] flex-1 sm:flex-none text-gray-400"
                    name="oldPassword"
                    type="password"
                />
                <FormInput
                    v-model="newPassword"
                    label="New Password"
                    placeholder="New Password"
                    class="sm:w-[430px] flex-1 sm:flex-none text-gray-400"
                    name="newPassword"
                    type="password"
                />
                <FormInput
                    v-model="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    class="sm:w-[430px] flex-1 sm:flex-none text-gray-400"
                    name="confirmPassword"
                    type="password"
                />
                <div class="flex space-x-4">
                    <Btn @click="enableReset = false" id="passwordResetCancelBtn">Cancel</Btn>
                    <Btn is-submit primary :loading="isLoading" id="passwordResetSubmitBtn">Change password</Btn>
                </div>
            </Form>
        </div>
        <div v-else>
            <Btn primary @click="enableReset = true" dusk="changePasswordBtn">Change Password</Btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '../FormInput.vue';
import { AuthApi } from '~/api/auth';
import Btn from '../Btn.vue';
import * as yup from 'yup';
import { snackbarErrors } from '~/util';
import snackbar from '~/util/snackbar';
import { Form } from 'vee-validate';

const oldPassword = ref();
const newPassword = ref();
const confirmPassword = ref();
const isLoading = ref(false);
const formRef = ref();
const enableReset = ref(false);

const validation = yup.object().shape({
    oldPassword: yup.string().required().min(8, 'Your password is too short.'),
    newPassword: yup.string().required().min(8, 'Your password is too short.'),
    confirmPassword: yup
        .string()
        .required('Your passwords do not match.')
        .oneOf([yup.ref('newPassword')], 'Your passwords do not match.'),
});

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const resetPassword = async () => {
    if (!(await isValid())) return;

    isLoading.value = true;
    try {
        const res = await AuthApi.changePassword({
            password: newPassword.value,
            oldPassword: oldPassword.value,
            passwordConfirmation: confirmPassword.value,
        });
        if (res.data.ChangePassword) {
            snackbar.success({
                title: 'Password change',
                text: 'Your password has been changed successfully.',
            });
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Reset password failed',
            text: 'Please try again.',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
