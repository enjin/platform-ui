<template>
    <div>
        <div v-if="enableReset" class="flex flex-col space-y-4">
            <Form
                id="changeEmailForm"
                ref="formRef"
                class="space-y-6"
                :validation-schema="validation"
                @invalid-submit="invalidSubmit"
                @submit="changeEmail"
            >
                <FormInput
                    v-model="currentEmail"
                    label="Current Email"
                    class="sm:w-[430px] flex-1 sm:flex-none text-gray-400"
                    name="currentEmail"
                    disabled
                />
                <FormInput
                    v-model="newEmail"
                    label="New Email"
                    placeholder="New Email"
                    class="sm:w-[430px] flex-1 sm:flex-none text-gray-400"
                    name="newEmail"
                />
                <div class="flex space-x-4">
                    <Btn @click="enableReset = false" id="changeEmailCancelBtn">Cancel</Btn>
                    <Btn is-submit primary :loading="isLoading" id="changeEmailSubmitBtn">Change Email</Btn>
                </div>
            </Form>
        </div>
        <div v-else>
            <Btn primary @click="enableReset = true" dusk="changeEmailBtn">Change Email</Btn>
        </div>
        <VerifyPasswordModal
            :is-open="verifyPasswordModal"
            @closed="verifyPasswordModal = false"
            @confirm="confirmChangeEmail"
        />
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
import { useAppStore } from '~/store';
import VerifyPasswordModal from './VerifyPasswordModal.vue';

const appStore = useAppStore();

const currentEmail = ref(appStore.user?.email);
const newEmail = ref();
const isLoading = ref(false);
const formRef = ref();
const enableReset = ref(false);
const verifyPasswordModal = ref(false);

const validation = yup.object().shape({
    newEmail: yup.string().email().required(),
});

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

const changeEmail = async () => {
    if (!(await isValid())) {
        return;
    }

    verifyPasswordModal.value = true;
};

const confirmChangeEmail = async (password) => {
    isLoading.value = true;
    try {
        const res = await AuthApi.updateUser(newEmail.value, password);
        if (res.data.UpdateUser) {
            snackbar.success({
                title: 'Email changed',
                text: 'Your email has been changed successfully.',
            });
            appStore.logout();
        }
    } catch (e) {
        if (snackbarErrors(e)) return;
        snackbar.error({
            title: 'Failed to change email',
            text: 'Please try again.',
        });
    } finally {
        isLoading.value = false;
    }
};
</script>
