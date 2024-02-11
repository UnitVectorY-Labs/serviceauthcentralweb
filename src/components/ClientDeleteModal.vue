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
    id="deleteClientModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="deleteClientModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteClientModalLabel">Delete Client Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert">
            Are you sure you want to delete the client "<span class="text-primary fw-bold">{{ client.clientId }}</span
            >" and all of its authorizations? This action cannot be undone and may result in unauthorized requests.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete" data-bs-dismiss="modal">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '@/services/apollo-client';

const DELETE_CLIENT = gql`
  mutation DeleteClient($clientId: String!) {
    deleteClient(clientId: $clientId) {
      success
    }
  }
`;

export default {
  props: {
    client: Object,
  },
  methods: {
    async confirmDelete() {
      try {
        await client.mutate({
          mutation: DELETE_CLIENT,
          variables: { clientId: this.client.clientId },
        });
        this.$emit('deleted'); // Notify parent component
      } catch (error) {
        console.error('Error deleting client:', error);
        this.$emit('error', error); // Notify parent component of error
      }
    },
  },
};
</script>
