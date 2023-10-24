declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface Window {
    bootstrap: {
        url: string;
        daemon: string;
        name: string;
    };
}
