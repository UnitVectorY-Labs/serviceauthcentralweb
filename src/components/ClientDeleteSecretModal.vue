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
    id="deleteClientSecretModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="deleteClientSecretModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteClientSecretModalLabel">Delete Client Confirmation</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert">
            Are you sure you want to delete the secret for "<span class="text-primary fw-bold">{{
              client.clientId
            }}</span
            >"? This cannot be undone.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmDelete">
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

const DELETE_CLIENT_SECRET_1 = gql`
  mutation ClearClientSecret1($clientId: String!) {
    clearClientSecret1(clientId: $clientId) {
      clientSecret
    }
  }
`;

const DELETE_CLIENT_SECRET_2 = gql`
  mutation ClearClientSecret2($clientId: String!) {
    clearClientSecret2(clientId: $clientId) {
      clientSecret
    }
  }
`;

export default {
  props: {
    client: Object,
  },
  data() {
    return {
      secretType: null,
    };
  },
  methods: {
    setSecretType(secretType) {
      this.secretType = secretType;
    },
    async confirmDelete() {
      try {
        let mutation;
        if (this.secretType === 'secret1') {
          mutation = DELETE_CLIENT_SECRET_1;
        } else if (this.secretType === 'secret2') {
          mutation = DELETE_CLIENT_SECRET_2;
        } else {
          return;
        }

        await client.mutate({
          mutation: mutation,
          variables: { clientId: this.client.clientId },
        });

        this.$emit('refreshClient', {});
      } catch (error) {
        console.error('Error deleting client:', error);
        this.$emit('error', error);
      }
    },
  },
};
</script>
