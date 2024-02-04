<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- Brand/Title linked to home -->
        <router-link to="/" class="navbar-brand">{{ pageTitle }}</router-link>

        <!-- Toggler Button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-for="link in navLinks" :key="link.path" class="nav-item">
              <router-link :to="link.path" class="nav-link" :class="{ 'active': isActive(link.path) }" v-if="!link.loginRequired || isTokenSet">
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

import LoginButton from './LoginButton.vue';
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
        { path: '/clients', label: 'Clients', 'loginRequired': true },
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
