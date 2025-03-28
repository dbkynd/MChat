import { createPinia } from 'pinia';
import { createApp } from 'vue';
import '@repo/ui/style.css';
import App from './App.vue';

const pinia = createPinia();

createApp(App).use(pinia).mount('#app');
