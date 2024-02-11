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
  <ClientDeleteModal v-if="client" :client="client" @deleted="handleDeletion" />

  <h3>Client</h3>
  <span class="text-muted"
    >A client is used by a service for both making requests to other clients and for receiving requests from other
    clients.</span
  >
  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th scope="col">Field</th>
        <th scope="col">Value</th>
        <th scope="col">
          <button
            v-if="client.managementPermissions.canDeleteClient"
            type="button"
            class="btn btn-danger float-end"
            data-bs-toggle="modal"
            data-bs-target="#deleteClientModal"
            title="Delete Client"
          >
            <i class="bi bi-trash"></i>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Client Id</td>
        <td>
          <p class="text-break">{{ client.clientId }}</p>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>Description</td>
        <td>
          <p class="text-break">{{ client.description }}</p>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>Created</td>
        <td><DateTimeComponent :date="client.clientCreated" /></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ClientDeleteModal from '@/components/ClientDeleteModal.vue';

import apollo from '@/services/apollo-client';

export default {
  props: ['client'],
  components: {
    ClientDeleteModal,
  },
  methods: {
    handleDeletion() {
      apollo.resetStore(); // We made a change so reset the local cache
      this.$router.push('/clients'); // Navigate back to home
    },
  },
};
</script>
