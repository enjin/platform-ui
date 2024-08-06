import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import dynamicImport from 'vite-plugin-dynamic-import';
import vue from '@vitejs/plugin-vue';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { dynamicBase } from 'vite-plugin-dynamic-base';
import renameBase from './vite-rename-base-plugin';

const path = require('path');

// @ts-ignore
export default defineConfig({
    plugins: [
        dynamicImport({
            viteIgnore: () => true,
        }),
        vue(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        //@ts-ignore
        renameBase('/__vite_base__/'),
        dynamicBase(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [NodeModulesPolyfillPlugin()],
            define: {
                global: 'globalThis',
            },
        },
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            output: {
                assetFileNames: `[ext]-[hash].[ext]`,
                chunkFileNames: `js-[hash].js`,
            },
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'resources/js'),
            vendor: path.resolve(__dirname, 'vendor'),
            buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
            process: 'process/browser',
            stream: 'stream-browserify',
            zlib: 'browserify-zlib',
            util: 'util',
        },
    },
});
