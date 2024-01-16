<template>
    <div class="modal fade" id="deleteClientModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteClientModelLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="deleteClientModelLabel">Delete Client Confirmation</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger" role="alert">
              Are you sure you want to delete the client "<span class="text-primary font-weight-bold">{{ client.clientId }}</span>" and all of its authorizations? This action cannot be undone and may result in unauthorized requests.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmDelete">Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';

const DELETE_CLIENT = gql`
    mutation DeleteClient($clientId: String!) {
        deleteClient(clientId: $clientId) {
            success
        }
    }
`;

export default {
  props: {
    client: Object
  },
  methods: {
    async confirmDelete() {
      try {
          await client.mutate({ 
              mutation: DELETE_CLIENT, 
              variables: { clientId: this.client.clientId }
          });
          this.$emit('deleted'); // Notify parent component
      } catch (error) {
          console.error("Error deleting client:", error);
          this.$emit('error', error); // Notify parent component of error
      }
    }
  }
};
</script>
  