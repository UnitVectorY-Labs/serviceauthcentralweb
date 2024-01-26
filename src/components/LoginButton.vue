<template>
  <div>
    <button v-if="!isTokenSet" @click="signIn" class="btn btn-primary">Sign In</button>
    <button v-else @click="performSignOut" class="btn btn-secondary">Sign Out</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { authorize } from '@/services/authService.js'
import client from '../apollo-client';

export default {
  name: 'LoginButton',
  computed: {
    ...mapGetters(['isTokenSet']),
  },
  methods: {
    ...mapActions(['signOut']),
    performSignOut() {
      // Custom logic before signing out
      this.signOut(); // Call the Vuex action to clear the token
      client.resetStore(); // Clear the Apollo cache
      this.$router.push('/'); // Redirect after signing out
    },
    signIn() {
      authorize();
    },
  },
};
</script>
