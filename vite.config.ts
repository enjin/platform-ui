import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';
import vue from '@vitejs/plugin-vue';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import eslint from 'vite-plugin-eslint';

const path = require('path');

export default defineConfig({
    server: {
        port: 5174
    },
    plugins: [
        dynamicImport({
            viteIgnore: () => true,
        }),
        vue(),
        eslint(),
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
