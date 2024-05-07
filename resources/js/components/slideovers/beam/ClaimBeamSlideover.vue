<template>
    <div
        class="flex h-full flex-col divide-y divide-gray-200 bg-light-surface-primary dark:bg-dark-surface-primary shadow-xl"
        v-if="item"
    >
        <h3 class="text-xl font-semibold px-4 sm:px-6 py-4 text-light-content-strong dark:text-dark-content-strong">
            Claim Beam
        </h3>
        <div class="h-0 flex-1 overflow-y-auto">
            <div class="flex flex-1 flex-col justify-between">
                <div class="divide-y divide-gray-200 px-4 sm:px-6">
                    <div class="space-y-6 pt-6 pb-5">
                        <div class="space-y-2 pb-3">
                            <dt class="text-base font-medium text-light-content dark:text-dark-content">Code</dt>
                            <dd
                                class="mt-1 text-sm text-light-content-strong dark:text-dark-content-strong break-words"
                            >
                                {{ item.code }}
                                <CopyTextIcon :text="item.code" />
                            </dd>
                        </div>
                        <QrcodeVue ref="qrCodeRef" :value="item.qr.payload" :size="272" class="mx-auto" />
                        <div class="flex space-x-3 justify-center">
                            <Btn class="font-normal" @click="saveImage" primary>Save image</Btn>
                            <Btn class="font-normal" @click="copyLink" primary>Copy link</Btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Btn from '~/components/Btn.vue';
import snackbar from '~/util/snackbar';
import QrcodeVue from 'qrcode.vue';
import CopyTextIcon from '~/components/CopyTextIcon.vue';

const props = withDefaults(
    defineProps<{
        item?: {
            code: string;
            qr: {
                url: string;
                payload: string;
            };
        };
    }>(),
    {
        item: undefined,
    }
);

const qrCodeRef = ref();

const copyLink = () => {
    navigator.clipboard.writeText(props.item?.qr.payload ?? '');
    snackbar.info({ title: 'Link copied to clipboard!' });
};

const saveImage = () => {
    let dataUrl = qrCodeRef.value.$el.toDataURL('image/png');
    downloadUrl(dataUrl, 'qrcode.png');
};

const downloadUrl = (url, filename) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a.remove();
};
</script>
