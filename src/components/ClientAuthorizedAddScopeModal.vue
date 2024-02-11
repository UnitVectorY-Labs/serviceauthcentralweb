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
    id="authorizedAddScopeModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="authorizedAddScopeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div v-show="!authorizedSuccess">
          <div class="modal-header">
            <h5 class="modal-title" id="authorizedAddScopeModalLabel">Add Scope to Client Authorization</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <label>Authorize Scope</label>
            <div class="form-check" v-for="(scope, index) in filteredAvailableScopes" :key="scope">
              <input
                class="form-check-input"
                type="radio"
                :disabled="loading"
                :value="scope"
                v-model="selectedScope"
                :name="radioGroupName"
                :id="`scope-${index}`"
              />
              <label class="form-check-label" :for="`scope-${index}`">
                <span class="badge text-bg-dark">{{ scope.scope }}</span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" :disabled="loading" @click="confirmAuthorize">
              Authorize
            </button>
          </div>
        </div>
      </div>
      <div v-if="authorizedSuccess" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientAuthorizeModalLabel">Add Modal Successful</h5>
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

const AUTHORIZE_ADD_SCOPE = gql`
  mutation AddScope($subject: String!, $audience: String!, $authorizedScope: String!) {
    authorizeAddScope(subject: $subject, audience: $audience, authorizedScope: $authorizedScope) {
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
      selectedScope: null, // Holds the selected radio button value
      authorizedScopes: [], // Initialize as an empty array to avoid undefined error
      loading: false,
      errorMessage: null,
      radioGroupName: 'authorizedScope',
      authorizedSuccess: false,
    };
  },
  computed: {
    filteredAvailableScopes() {
      // Check if authorizedScopes is not undefined and is an array
      if (Array.isArray(this.authorizedScopes) && this.authorizedScopes.length > 0) {
        // Return only those scopes not included in authorizedScopes
        return this.client.availableScopes.filter(scopeObj => !this.authorizedScopes.includes(scopeObj.scope));
      }
      // If authorizedScopes is empty or undefined, return all availableScopes
      return this.client.availableScopes;
    },
  },
  methods: {
    setSubjectAndScopes(addSubject, authorizedScopes) {
      this.addSubject = addSubject;
      this.authorizedScopes = authorizedScopes;
      this.selectedScope = null;
      this.loading = false;
      this.errorMessage = null;
      this.authorizedSuccess = false;
    },
    async confirmAuthorize() {
      this.loading = true;
      try {
        const response = await client.mutate({
          mutation: AUTHORIZE_ADD_SCOPE,
          variables: {
            subject: this.addSubject,
            audience: this.client.clientId,
            authorizedScope: this.selectedScope.scope,
          },
        });

        if (response.data.authorizeAddScope.success) {
          this.authorizedSuccess = true;
          this.$emit('refreshClient');
        } else {
          this.errorMessage = 'Failed to add scope to client.';
        }
      } catch (error) {
        console.error('Error adding scope to client:', error);
        this.$emit('error', error);
        this.errorMessage = 'An error occurred during scope addition.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
