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
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

// Bootstrap and icons
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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
