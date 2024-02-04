<template>
  <div class="container mt-4">
    <h3>Create New Client</h3>
    <form @submit.prevent="submitForm" class="offset-sm-2">
      <div class="row mb-3">
        <label for="clientId" class="col-sm-2 col-form-label text-end">Client Id</label>
        <div class="col-sm-6">
          <input type="text" class="form-control" id="clientId" v-model="clientId" :disabled="loading">
        </div>
      </div>
      <div class="row mb-3">
        <label for="description" class="col-sm-2 col-form-label text-end">Description</label>
        <div class="col-sm-6">
          <input type="text" class="form-control" id="description" v-model="description" :disabled="loading">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2">
          <button type="submit" class="btn btn-primary" :disabled="loading">Create</button>
        </div>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mb-3 col-sm-6 offset-sm-2">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';

// GraphQL mutation
const ADD_CLIENT = gql`
  mutation AddClient($clientId: String!, $description: String!) {
    addClient(clientId: $clientId, description: $description) {
      clientId
    }
  }
`;

export default {
  name: 'ClientForm',
  data() {
    return {
      clientId: '',
      description: '',
      loading: false,
      errorMessage: null,
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.errorMessage = null;
      try {
        await client.mutate({ 
          mutation: ADD_CLIENT, 
          variables: { clientId: this.clientId, description: this.description }
        });
        client.resetStore(); // Reset local cache after mutation
        this.$router.push('/clients/' + this.clientId);
      } catch (error) {
        console.error("Error submitting form:", error);
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
