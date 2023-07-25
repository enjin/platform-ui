<template>
    <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <EnjinLogo class="h-12 w-auto mx-auto" />

            <h2 class="mt-6 text-center text-2xl font-semibold tracking-normal text-gray-900">Setup</h2>
        </div>
        <div class="mt-8 mx-auto w-full sm:max-w-md">
            <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <Form ref="formRef" class="space-y-6" :validation-schema="validation" @submit="setupAccount">
                    <FormInput
                        v-model="hostname"
                        label="Hostname"
                        name="hostname"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                    <FormInput
                        v-if="!appStore.isMultiTenant"
                        v-model="authorizationToken"
                        label="Authroization token"
                        name="authorization"
                        input-class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
import { ref } from 'vue';
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
const hostname = ref('');
const authorizationToken = ref('');
const formRef = ref();

const validation = yup.object().shape({
    hostname: yup.string().required('Hostname is required'),
    authorization: yup.string().when('tenant', {
        is: false,
        then: () => yup.string().required('Authorization token is required'),
    }),
});

const redirectToCollections = () => {
    router.push({ name: 'platform.collections' });
};

const isValid = async () => {
    await formRef.value.validate();
    return formRef.value.getMeta().valid;
};

const parseHostname = (hostname: string) => {
    try {
        const url = new URL(hostname);

        return url;
    } catch {
        return { hostname: hostname, protocol: 'https:', port: '' };
    }
};

const setupAccount = async () => {
    try {
        if (!(await isValid())) return;

        isLoading.value = true;
        const hostnameParse = parseHostname(hostname.value);

        if (!hostnameParse) {
            throw new Error('Invalid hostname');
        }
        if (window.location.protocol === 'https:' && hostnameParse?.protocol === 'http:') {
            throw new Error('You must use an https hostname');
        }
        const fullHostname = hostnameParse.hostname + (hostnameParse.port ? `:${hostnameParse.port}` : '');

        if (!(await appStore.checkHostname(fullHostname, hostnameParse.protocol))) return;

        await appStore.setupAccount({
            hostname: fullHostname,
            protocol: hostnameParse.protocol,
            authorization_token: authorizationToken.value,
        });
        redirectToCollections();
    } catch (e: any) {
        snackbar.error({ title: e.message || e });
    } finally {
        isLoading.value = false;
    }
};

(async () => {
    if (appStore.config.hostname && appStore.config.authorization_token) redirectToCollections();
    hostname.value = appStore.config.hostname as string;
})();
</script>
