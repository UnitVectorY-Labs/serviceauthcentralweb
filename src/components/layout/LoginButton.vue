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
  <div class="d-flex justify-content-end">
    <button v-if="!isTokenSet" @click="signIn" class="btn btn-primary btn-sm">Sign In</button>
    <button v-else @click="performSignOut" class="btn btn-secondary btn-sm">Sign Out</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { authorize } from '@/services/authService.js';
import client from '@/services/apollo-client';

export default {
  name: 'LoginButton',
  data() {
    return {
      logoutTimer: null,
    };
  },
  watch: {
    // Watch for changes in tokenExpiration to setup or clear the logout timer
    tokenExpiration(newExpiration, oldExpiration) {
      if (newExpiration !== oldExpiration) {
        this.setUpLogoutTimer();
      }
    },
  },
  mounted() {
    this.setUpLogoutTimer();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  computed: {
    ...mapGetters(['isTokenSet', 'tokenExpiration']),
  },
  methods: {
    ...mapActions(['signOut']),
    performSignOut() {
      // Custom logic before signing out
      this.signOut(); // Vuex action to clear the token
      client.resetStore(); // Clear the Apollo cache
      this.$router.push('/'); // Redirect after signing out
    },
    signIn() {
      authorize();
    },
    handleVisibilityChange() {
      // If the document is visible, setup the logout timer again
      if (document.visibilityState === 'visible') {
        this.setUpLogoutTimer();
      }
    },
    setUpLogoutTimer() {
      // Clear any existing timer to avoid multiple timers running
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
      }

      if (this.tokenExpiration) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const delay = (this.tokenExpiration - currentTime) * 1000; // Convert to milliseconds

        if (delay > 0) {
          // Set a timer to log out when the token is supposed to expire
          this.logoutTimer = setTimeout(() => {
            console.log('Token expired, logging out...');
            this.performSignOut();
          }, delay);
        } else {
          // Session is already expired just go ahead and log out
          this.performSignOut();
        }
      }
    },
  },
};
</script>
