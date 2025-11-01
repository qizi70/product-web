import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vant from 'vant';
import 'vant/lib/index.css';

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$persist = true;
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vant);
app.mount('#app');
