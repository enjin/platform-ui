<template>
    <div class="rich-editor">
        <Field
            v-slot="{ field, errorMessage }: { field: any, errorMessage: any }"
            v-model="localModelValue"
            validate-on-input
            :name="name"
        >
            <label class="mb-2 flex justify-between text-base text-light-content-strong">
                <label
                    v-if="label"
                    class="block text-sm font-medium leading-6 text-light-content-strong dark:text-dark-content-strong"
                >
                    {{ label }} <span v-if="required" class="text-red-500">&nbsp;*</span>
                </label>

                <div class="form-input__help font-normal">
                    <ErrorMessage class="text-light-state-error-content" :name="name" />
                </div>

                <span v-if="!errorMessage" :class="`text-sm text-light-content ${helpClass}`">
                    {{ help }}
                </span>
            </label>

            <p class="my-2 text-sm text-light-content dark:text-dark-content" v-if="description">
                {{ description }}
            </p>
            <textarea
                ref="markdownEditorRef"
                class="form-textarea__textarea block w-full border py-2 px-3 rounded-lg focus:outline-none min-h-[125px]"
                v-bind="field"
                :placeholder="placeholder"
                :rows="rows"
                :maxlength="maxLength"
            />
        </Field>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { ErrorMessage, Field } from 'vee-validate';
import { renderMarkdown } from '~/util/marked';

const props = withDefaults(
    defineProps<{
        modelValue: string | object;
        name: string;
        label?: string;
        description?: string;
        placeholder?: string;
        rows?: number;
        maxLength?: number;
        help?: string;
        helpClass?: string;
        required?: boolean;
    }>(),
    {
        modelValue: '',
        label: '',
        description: '',
        placeholder: '',
        rows: 4,
        maxLength: 30,
        help: '',
        helpClass: '',
        required: false,
    }
);

const emit = defineEmits(['update:modelValue']);

const markdownEditorRef = ref();

const localModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    },
});

const initMDE = () => {
    const easyMDE = new EasyMDE({
        minHeight: '175px',
        lineNumbers: false,
        spellChecker: false,
        status: false,
        forceSync: true,
        sideBySideFullscreen: false,
        element: markdownEditorRef.value,
        previewRender: renderMarkdown,
        toolbar: ['bold', 'italic', 'link', 'unordered-list', 'ordered-list', '|', 'preview', 'fullscreen', 'guide'],
        previewClass: [
            'bg-light-surface-background',
            'dark:bg-dark-surface-background',
            'max-w-none',
            'prose',
            'dark:prose-invert',
            'pl-2',
        ],
    });

    easyMDE.codemirror.on('change', () => {
        markdownEditorRef.value.dispatchEvent(new Event('change'));
    });
};

onMounted(() => {
    initMDE();
});
</script>

<style lang="scss">
.rich-editor {
    &:has(.editor-toolbar.fullscreen) {
        position: fixed;
        z-index: 100;
    }

    .EasyMDEContainer {
        .editor-toolbar {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            @apply text-light-content dark:text-dark-content;
            @apply border-light-stroke-strong dark:bg-dark-surface-background dark:border-dark-stroke-strong;

            button:hover {
                @apply bg-light-surface-background dark:bg-dark-surface-background;
                @apply transition-all;
            }

            button.active {
                @apply bg-light-surface-background dark:bg-dark-surface-background;
                @apply transition-all;
            }
        }

        .CodeMirror {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            @apply border-light-stroke-strong dark:border-dark-stroke-strong;
            @apply bg-light-surface-primary dark:bg-dark-surface-primary;
            @apply text-light-content dark:text-dark-content;
        }

        .CodeMirror-wrap {
            pre.CodeMirror-line,
            pre.CodeMirror-line-like {
                word-break: break-word;
            }
        }
    }
}

.dark {
    .CodeMirror {
        span.CodeMirror-selectedtext {
            background-color: rgba(0, 0, 0, 0.4);
        }
        .CodeMirror-cursor {
            border-left: 1px solid #fff;
        }
    }
}
</style>
