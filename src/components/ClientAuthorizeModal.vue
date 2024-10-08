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
  <div
    class="modal fade"
    id="clientAuthorizeModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="clientAuthorizeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <form @submit.prevent="submitForm" v-show="!authorizedSuccess">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="clientAuthorizeModalLabel">Authorize Client</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info" role="alert">
              Enter the client ID of the application you want to authorize to use 
              "<span class="text-primary fw-bold">{{client.clientId}}</span>" as an audience in its access tokens.
              This allows the specified client to use this as the audience, verify you intend to grant this access.
            </div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div class="form-group mb-3">
              <label for="authorizedSubject">Authorized Subject Client Id</label>
              <input
                type="text"
                class="form-control"
                id="authorizedSubject"
                v-model="authorizedSubject"
                :disabled="loading"
                placeholder="Enter Client Id"
              />
            </div>
            <div v-if="client.availableScopes && client.availableScopes.length > 0" class="form-group">
              <label>Authorized Scopes</label>
              <div class="form-check" v-for="(scope, index) in client.availableScopes" :key="scope.scope">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="scope.scope"
                  v-model="selectedScopes"
                  :id="`scope-${index}`"
                />
                <label class="form-check-label" :for="`scope-${index}`">
                  <span class="badge text-bg-dark">{{ scope.scope }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success" :disabled="loading" @click="confirmAuthorize">
              Authorize
            </button>
          </div>
        </div>
      </form>
      <div v-if="authorizedSuccess" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientAuthorizeModalLabel">Authorization Successful</h5>
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
import client from '@/services/apollo-client';

const AUTHORIZE_CLIENT = gql`
  mutation Authorize($subject: String!, $audience: String!, $authorizedScopes: [String]) {
    authorize(subject: $subject, audience: $audience, authorizedScopes: $authorizedScopes) {
      success
    }
  }
`;

export default {
  props: {
    client: Object,
  },
  data() {
    return {
      authorizedSubject: '',
      loading: false,
      errorMessage: null,
      authorizedSuccess: false,
      selectedScopes: [],
    };
  },
  methods: {
    async confirmAuthorize() {
      this.errorMessage = null;
      this.loading = true;
      try {
        const response = await client.mutate({
          mutation: AUTHORIZE_CLIENT,
          variables: {
            subject: this.authorizedSubject,
            audience: this.client.clientId,
            authorizedScopes: this.selectedScopes,
          },
        });

        if (response.data.authorize.success) {
          this.authorizedSuccess = true;
          this.$emit('refreshClient', {});
        } else {
          this.errorMessage = 'Failed to authorize client';
        }
      } catch (error) {
        console.error('Error authorizing client:', error);
        this.errorMessage = 'Error occurred while authorizing client';
        this.$emit('error', error); // Notify parent component of error
      } finally {
        this.loading = false;
      }
    },
    resetData() {
      this.authorizedSubject = '';
      this.loading = false;
      this.errorMessage = null;
      this.authorizedSuccess = false;
      this.selectedScopes = [];
    },
  },
};
</script>
