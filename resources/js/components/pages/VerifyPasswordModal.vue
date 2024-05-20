<template>
    <Modal :is-open="props.isOpen" :close="closeModal">
        <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
        >
            Verify Password
        </DialogTitle>
        <div class="mt-2 space-y-4">
            <p class="text-sm text-light-content dark:text-dark-content">
                Please enter your password to verify your identity.
            </p>
            <FormInput
                v-model="password"
                label="Password"
                placeholder="Password"
                class="flex-1 sm:flex-none text-light-content dark:text-dark-content"
                name="password"
                type="password"
            />
            <vue-recaptcha
                v-if="hasCaptcha"
                ref="captchaRef"
                :style="{ visibility: isCaptchaBadgeVisible ? 'visible' : 'hidden' }"
                size="invisible"
                :load-recaptcha-script="false"
                :sitekey="reCaptchaSiteKey"
                @verify="confirm"
                @expired="onCaptchaExpired"
            />
        </div>

        <div class="flex justify-end space-x-4 mt-6">
            <Btn @click="closeModal">Cancel</Btn>
            <Btn primary @click="verifyCaptcha">Confirm</Btn>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import Btn from '~/components/Btn.vue';
import Modal from '~/components/Modal.vue';
import FormInput from '../FormInput.vue';
import { ref } from 'vue';
import { useAppStore } from '~/store';
import { AuthApi } from '~/api/auth';
import { VueRecaptcha } from 'vue-recaptcha';
import snackbar from '~/util/snackbar';

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits(['closed', 'confirm']);

const appStore = useAppStore();

const password = ref();
const isCaptchaBadgeVisible = ref(false);
const captchaRef = ref();
const hasCaptcha = window.bootstrap?.captcha_key?.length > 0;
const reCaptchaSiteKey = window.bootstrap?.captcha_key || 'null';

const confirm = async (recaptcha?: string) => {
    const email = appStore.user?.email;
    const res = await AuthApi.login(email, password.value, recaptcha);
    if (res.data.Login) {
        emit('confirm');
    } else {
        snackbar.error({
            title: 'Error',
            text: 'Invalid password',
        });
    }
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

const onCaptchaExpired = () => {
    captchaRef.value.reset();
};

const verifyCaptcha = () => {
    if (!hasCaptcha) {
        return confirm();
    }

    captchaRef.value.execute();
};

const closeModal = () => {
    emit('closed');
};

(() => {
    loadCaptchaScript();
})();
</script>
