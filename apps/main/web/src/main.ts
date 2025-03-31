import { createPinia } from 'pinia';
import { createApp } from 'vue';
import '@repo/ui/style.css';
import App from './App.vue';
import { router } from './routes';

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');
