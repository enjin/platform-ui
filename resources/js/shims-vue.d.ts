declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface Window {
    bootstrap: {
        network: string;
        url: string;
        daemon: string;
        name: string;
        captcha_key: string;
    };
}
