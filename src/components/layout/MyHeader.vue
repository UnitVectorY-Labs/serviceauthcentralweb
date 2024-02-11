<!--
 ~ Copyright 2024 the original author or authors.
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 ~ in compliance with the License. You may obtain a copy of the License at
 ~
 ~ https://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software distributed under the License
 ~ is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 ~ or implied. See the License for the specific language governing permissions and limitations under
 ~ the License.
 ~ 
 ~ @author Jared Hatfield (UnitVectorY Labs)
-->
<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- Brand/Title linked to home -->
        <router-link to="/" class="navbar-brand"
          ><img src="@/assets/logo_transparent.png" height="50" width="50" alt="ServiceAuthCentral Logo" />{{
            pageTitle
          }}</router-link
        >

        <!-- Toggler Button -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-for="link in navLinks" :key="link.path" class="nav-item">
              <router-link
                :to="link.path"
                class="nav-link"
                :class="{ active: isActive(link.path) }"
                v-if="!link.loginRequired || isTokenSet"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>

          <div class="ms-auto">
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import LoginButton from '@/components/layout/LoginButton.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'MyHeader',
  components: {
    LoginButton,
  },
  computed: {
    ...mapGetters(['isTokenSet']),
  },
  data() {
    return {
      pageTitle: 'ServiceAuthCentral',
      navLinks: [
        { path: '/clients', label: 'Clients', loginRequired: true },
        // Add more navigation links as needed
      ],
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>
