import '~/polyfills';
import '../css/app.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '~/components/App.vue';
import Router from '~/router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initAuthGuard } from '~/util/auth.guard';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

initAuthGuard(Router);

const app = createApp(App);

app.use(pinia);
app.use(Router);

app.mount('#app');
