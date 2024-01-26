<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <!-- Dynamic Title -->
        <h1 class="mb-0 me-4 text-white">{{ pageTitle }}</h1>

        <!-- Navigation Links -->
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li v-for="link in navLinks" :key="link.path" class="nav-item">
            <router-link v-if="!link.loginRequired || isTokenSet" :to="link.path" class="nav-link" :class="{ 'text-secondary': isActive(link.path), 'text-white': !isActive(link.path) }">{{ link.label }}</router-link>
          </li>
        </ul>

        <div class="text-end">
          <LoginButton />
        </div>
      </div>
    </div>
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
        { path: '/', label: 'Home', 'loginRequired': false },
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
