<template>
  <div class="modal fade" id="clientCreateSecretModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientCreateSecretModalLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h1 class="modal-title fs-5" id="clientCreateSecretModalLabel">New Client Secret</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <div v-if="loading">
                      <LoadingComponent />
                  </div>
                  <div v-else-if="errorMessage" class="alert alert-danger">
                      {{ errorMessage }}
                  </div>
                  <div v-else class="input-group mb-3">
                      <div class="alert alert-danger" role="alert">
                          <h4 class="alert-heading">Important: One-Time Access!</h4>
                          <p>This is the only time you will be able to view or copy your client secret. Make sure to copy and securely store it now. If you lose this secret, there is no way to retrieve it again!</p>
                      </div>
                      <input type="text" class="form-control" readonly :value="clientSecret">
                      <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="copyToClipboard">
                          <i class="bi-clipboard"></i> Copy
                      </button>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
        loading: true,
        clientSecret: null,
        errorMessage: null,
      };
    },
    methods: {
      copyToClipboard() {
        if (this.clientSecret) {
            navigator.clipboard.writeText(this.clientSecret)
                .then(() => {
                    // Optional: Display a success message or toast
                    console.log('Secret copied to clipboard!');
                })
                .catch(err => {
                    // Optional: Display an error message or toast
                    console.error('Failed to copy: ', err);
                });
        }
      },
      async generateSecret(secretType) {
        this.clientSecret = null;
        this.errorMessage = null;

        const GENERATE_CLIENT_SECRET_1 = gql`
            mutation GenerateClientSecret1($clientId: String!) {
                generateClientSecret1(clientId: $clientId) {
                    clientSecret
                }
            }
        `;
        const GENERATE_CLIENT_SECRET_2 = gql`
            mutation GenerateClientSecret2($clientId: String!) {
                generateClientSecret2(clientId: $clientId) {
                    clientSecret
                }
            }
        `;
        let mutation;
        if (secretType === 'secret1') {
        mutation = GENERATE_CLIENT_SECRET_1;
        } else if (secretType === 'secret2') {
            mutation = GENERATE_CLIENT_SECRET_2; // You need to define this mutation
        } else {
            this.errorMessage = "Unknown secret type specified";
            return;
        }
        try {
            const response = await client.mutate({ 
                mutation: mutation, 
                variables: { clientId: this.client.clientId }
            });
            if (secretType === 'secret1') {
                this.clientSecret = response.data.generateClientSecret1.clientSecret; // Adapt based on actual response structure
            } else if (secretType === 'secret2') {
                this.clientSecret = response.data.generateClientSecret2.clientSecret;
            }
            // After successful generation
            this.$emit('refreshClient', {});
        } catch (error) {
            console.error("Error creating client secret:", error);
            this.errorMessage = error.message; // Set error message
        } finally {
            this.loading = false;
        }
      },
      async generate() {
      }
    }
  };
  </script>
  