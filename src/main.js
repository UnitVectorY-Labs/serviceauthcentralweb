import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import components here
import MyHeader from './components/MyHeader.vue';
import MyFooter from './components/MyFooter.vue';

import Error404Component from './components/Error404Component.vue';
import Error500Component from './components/Error500Component.vue';
import LoadingComponent from './components/LoadingComponent.vue';

import HomePage from './components/HomePage.vue';
import ClientsPage from './components/ClientsPage.vue';
import ClientDetailsPage from './components/ClientDetailsPage.vue';
import ClientCreatePage from './components/ClientCreatePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/client', component: ClientCreatePage },
    { path: '/clients', component: ClientsPage },
    { path: '/clients/:clientId', component: ClientDetailsPage },
    { path: '/:catchAll(.*)', component: Error404Component },
  ],
});

const app = createApp(App);
app.component('MyHeader', MyHeader);
app.component('MyFooter', MyFooter);
app.component('Error404Component', Error404Component);
app.component('Error500Component', Error500Component);
app.component('LoadingComponent', LoadingComponent);
app.use(router);
app.mount('#app');
