import { createRouter, createWebHistory } from 'vue-router';

// Import route components
import HomePage from '@/components/HomePage.vue';
import CallbackPage from '@/components/CallbackPage.vue';
import ClientsPage from '@/components/ClientsPage.vue';
import ClientDetailsPage from '@/components/ClientDetailsPage.vue';
import ClientCreatePage from '@/components/ClientCreatePage.vue';
import Error404Component from '@/components/Error404Component.vue';

const routes = [
  { path: '/', component: HomePage, name: "ServiceAuthCentral" },
  { path: '/callback', component: CallbackPage, name: "ServiceAuthCentral: Callback" },
  { path: '/client', component: ClientCreatePage, name: "ServiceAuthCentral: Create Client" },
  { path: '/clients', component: ClientsPage, name: "ServiceAuthCentral: Clients" },
  { path: '/clients/:clientId', component: ClientDetailsPage, name: "ServiceAuthCentral: Client Details" },
  { path: '/:catchAll(.*)', component: Error404Component, name: "ServiceAuthCentral: 404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

export default router;
