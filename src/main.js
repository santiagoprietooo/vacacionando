import { createApp } from 'vue';
import App from './App.vue';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives
    /* defaults: {
        global: {
        // Podés redefinir márgenes, paddings, etc. aquí si hace falta
        },
    }, */
});

import router from './router/router';
import './style.css';

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');
