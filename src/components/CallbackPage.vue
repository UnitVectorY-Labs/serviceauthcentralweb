<template>
    <div>
      Processing login...
    </div>
  </template>
  
  <script>
  import { exchangeToken } from '@/services/authService.js';
  
  export default {
    name: 'CallbackView',
    async mounted() {
      try {
        const token = await exchangeToken();
        console.log('Token:', token);
        // Navigate to another route or update state as necessary
        // Make sure token isn't stored in history
        this.$router.replace('/');
      } catch (error) {
        console.error('Error:', error);
        // Handle errors
      }
    }
  };
  </script>
  