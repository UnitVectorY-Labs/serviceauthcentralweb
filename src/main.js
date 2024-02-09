import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

// Bootstrap and icons
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import components here
import DateTimeComponent from '@/components/common/DateTimeComponent.vue';
import LoadingComponent from '@/components/common/LoadingComponent.vue';
import Error404Component from '@/components/Error404Component.vue';
import Error500Component from '@/components/Error500Component.vue';

const app = createApp(App);

// Global components
app.component('DateTimeComponent', DateTimeComponent);
app.component('Error404Component', Error404Component);
app.component('Error500Component', Error500Component);
app.component('LoadingComponent', LoadingComponent);

// Use router and store
app.use(router);
app.use(store);

// Mount app
app.mount('#app');
