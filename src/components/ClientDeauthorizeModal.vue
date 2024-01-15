<template>
    <div class="modal fade" id="clientDeauthorizeModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientDeauthorizeModelLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="clientDeauthorizeModelLabel">Deauthorize Client Confirmation</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-else class="alert alert-danger" role="alert">
              Are you sure you want to deauthorize the client "<span class="text-primary font-weight-bold">{{ client.clientId }}</span>" access to "<span class="text-primary font-weight-bold">{{ deauthorizedSubject }}</span>".
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" :disabled="loading" data-bs-dismiss="modal" @click="confirmDelete">Confirm Deauthorize</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { gql } from '@apollo/client/core';
  import client from '../apollo-client';
  
  export default {
    props: {
      client: Object,
    },
    data() {
        return {
            deauthorizedSubject: null,
            loading: false,
            errorMessage: null,
            deauthorizedSuccess: false
        };
    },
    methods: {
      setDeauthorizedSubject(deauthorizedSubject){
        this.loading = false;
        this.errorMessage = null;
        this.deauthorizedSubject = deauthorizedSubject;
        this.deauthorizedSuccess = false;
      },
      async confirmDelete() {
        const DEAUTHORIZE_CLIENT = gql`
                mutation Deauthorize($subject: String!, $audience: String!) {
                    deauthorize(subject: $subject, audience: $audience) {
                        success
                    }
                }
            `;
            try {
                const response = await client.mutate({ 
                    mutation: DEAUTHORIZE_CLIENT, 
                    variables: { 
                        subject: this.deauthorizedSubject,
                        audience: this.client.clientId
                    }
                });

                if(response.data.deauthorize.success) {
                    this.deauthorizedSuccess = true;
                    this.$emit('refreshClient', {});
                } else {
                    this.errorMessage = "Failed to authorize client";
                }
            } catch (error) {
                console.error("Error authorizing client:", error);
                this.$emit('error', error); // Notify parent component of error
            } finally {
                this.loading = false;
            }
      }
    }
  };
  </script>
  