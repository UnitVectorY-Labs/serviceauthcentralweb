<template>
    <div class="modal fade" id="authorizedRemoveScopeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="authorizedRemoveScopeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="authorizedRemoveScopeModalLabel">Remove Scope from Client Confirmation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-else class="alert alert-danger" role="alert">
                Are you sure you and to remove the authorized scope <span class="text-primary fw-bold">{{ removeScope }}</span> from the client <span class="text-primary fw-bold">{{ client.clientId }}</span> access to <span class="text-primary fw-bold">{{ removeSubject }}</span>?
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" :disabled="loading" data-bs-dismiss="modal" @click="confirmRemove">Confirm Deauthorize</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { gql } from '@apollo/client/core';
  import client from '../apollo-client';
  
  const AUTHORIZE_REMOVE_SCOPE = gql`
      mutation RemoveScope($subject: String!, $audience: String!, $authorizedScope: String!) {
        authorizeRemoveScope(subject: $subject, audience: $audience, authorizedScope: $authorizedScope) {
              success
          }
      }
  `;
  
  export default {
    props: {
      client: Object,
    },
    emits: ['refreshClient'],
    data() {
      return {
        removeSubject: null,
        removeScope: null,
        loading: false,
        errorMessage: null,
        removeSuccess: false
      };
    },
    methods: {
        setSubjectAndScope(removeSubject, removeScope) {
        this.removeSubject = removeSubject;
        this.removeScope = removeScope;
        this.loading = false;
        this.errorMessage = null;
        this.removeSuccess = false;
      },
      async confirmRemove() {
        this.loading = true;
        try {
          const response = await client.mutate({ 
            mutation: AUTHORIZE_REMOVE_SCOPE, 
            variables: { 
              subject: this.removeSubject,
              audience: this.client.clientId,
              authorizedScope: this.removeScope
            }
          });
  
          if (response.data.authorizeRemoveScope.success) {
            this.removeSuccess = true;
            this.$emit('refreshClient');
          } else {
            this.errorMessage = "Failed to remove scope from client.";
          }
        } catch (error) {
          console.error("Error removing scope from client:", error);
          this.$emit('error', error);
          this.errorMessage = "An error occurred during scope removal.";
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  