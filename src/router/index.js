/*
 * Copyright 2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author Jared Hatfield (UnitVectorY Labs)
 */
import { createRouter, createWebHistory } from 'vue-router';

// Import route components
import HomePage from '@/pages/HomePage.vue';
import CallbackPage from '@/pages/CallbackPage.vue';
import ClientsPage from '@/pages/ClientsPage.vue';
import ClientDetailsPage from '@/pages/ClientDetailsPage.vue';
import ClientCreatePage from '@/pages/ClientCreatePage.vue';
import Error404Component from '@/components/Error404Component.vue';

const routes = [
  { path: '/', component: HomePage, name: 'ServiceAuthCentral' },
  { path: '/callback', component: CallbackPage, name: 'ServiceAuthCentral: Callback' },
  { path: '/client', component: ClientCreatePage, name: 'ServiceAuthCentral: Create Client' },
  { path: '/clients', component: ClientsPage, name: 'ServiceAuthCentral: Clients' },
  { path: '/clients/:clientId', component: ClientDetailsPage, name: 'ServiceAuthCentral: Client Details' },
  { path: '/:catchAll(.*)', component: Error404Component, name: 'ServiceAuthCentral: 404' },
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
