import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import components here
import MyHeader from './components/MyHeader.vue'; 
import HomePage from './components/HomePage.vue';
import ClientsPage from './components/ClientsPage.vue';
import ClientDetailsPage from './components/ClientDetailsPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/clients', component: ClientsPage },
    { path: '/clients/:clientId', component: ClientDetailsPage },
  ],
});

const app = createApp(App);
app.component('MyHeader', MyHeader);
app.use(router);
app.mount('#app');
