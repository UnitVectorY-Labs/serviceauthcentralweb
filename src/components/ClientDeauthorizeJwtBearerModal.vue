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
    id="clientDeauthorizeJwtBearerModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="clientDeauthorizeJwtBearerModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="clientDeauthorizeJwtBearerModalLabel">
            Deauthorize Client JWT Bearer Confirmation
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-else class="alert alert-danger" role="alert">
            Are you sure you want to deauthorize the following JWT Bearer? Doing so will result in the client "<span
              class="text-primary fw-bold"
              >{{ client.clientId }}</span
            >" being unable to authenticate with this JWT Bearer.
          </div>
          <table class="table" v-if="jwtBearer">
            <thead class="table-dark">
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JWKS URL</td>
                <td>{{ jwtBearer.jwksUrl }}</td>
              </tr>
              <tr>
                <td>Issuer</td>
                <td>{{ jwtBearer.iss }}</td>
              </tr>
              <tr>
                <td>Audience</td>
                <td>{{ jwtBearer.aud }}</td>
              </tr>
              <tr>
                <td>Subject</td>
                <td>{{ jwtBearer.sub }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="loading"
            data-bs-dismiss="modal"
            @click="confirmDelete"
          >
            Confirm Deauthorize
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '@/services/apollo-client';

const DEAUTHORIZE_CLIENT_JWT_BEARER = gql`
  mutation DeauthorizeJwtBearer($clientId: String!, $id: String!) {
    deauthorizeJwtBearer(clientId: $clientId, id: $id) {
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
      jwtBearer: null,
      loading: false,
      errorMessage: null,
      deauthorizedSuccess: false,
    };
  },
  methods: {
    setJwtBearer(jwtBearer) {
      this.loading = false;
      this.errorMessage = null;
      this.jwtBearer = jwtBearer;
      this.deauthorizedSuccess = false;
    },
    async confirmDelete() {
      try {
        const response = await client.mutate({
          mutation: DEAUTHORIZE_CLIENT_JWT_BEARER,
          variables: {
            clientId: this.client.clientId,
            id: this.jwtBearer.id,
          },
        });

        if (response.data.deauthorizeJwtBearer.success) {
          this.deauthorizedSuccess = true;
          this.$emit('refreshClient', {});
        } else {
          this.errorMessage = 'Failed to authorize client';
        }
      } catch (error) {
        console.error('Error authorizing client:', error);
        this.$emit('error', error); // Notify parent component of error
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
