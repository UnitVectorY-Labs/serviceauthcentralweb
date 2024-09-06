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
  <div v-if="client.managementPermissions.canAddAvailableScope || client.availableScopes.length > 0">
    <ClientAddAvailableScopeModal
      ref="addAvailableScopeModal"
      v-if="client"
      :client="client"
      @refreshClient="refreshClient"
    />

    <h3>Client Available Scopes</h3>
    <span class="text-muted"
      >The list of scopes this client recognizes that can be requested by another client if authorization is
      granted.</span
    >
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th scope="col">Scope</th>
          <th scope="col">Description</th>
          <th scope="col">
            <button
              type="button"
              class="btn btn-success float-end"
              data-bs-toggle="modal"
              @click="resetAddAvailableScope()"
              data-bs-target="#clientAddAvailableScopeModal"
              title="Add Available Scope"
              v-if="client.managementPermissions.canAddAvailableScope"
            >
              <i class="bi bi-plus"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="availableScope in client.availableScopes" :key="availableScope.scope">
          <td>
            <span class="btn btn-dark btn-sm custom-disabled">{{ availableScope.scope }}</span>
          </td>
          <td>{{ availableScope.description }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div v-if="client.availableScopes.length == 0" class="text-center p-3">
      <span class="fw-lighter">No scopes defined.</span>
    </div>
  </div>
</template>

<style>
.custom-disabled {
  pointer-events: none; /* Prevents mouse events from being captured */
  color: #fff; /* Adjusts text color if needed */
  background-color: #000000; /* Keeps background color dark */
}
</style>

<script>
import ClientAddAvailableScopeModal from '@/components/ClientAddAvailableScopeModal.vue';

export default {
  props: ['client'],
  components: {
    ClientAddAvailableScopeModal,
  },
  methods: {
    refreshClient() {
      this.$emit('refreshClient', {});
    },
    resetAddAvailableScope() {
      if (this.$refs.addAvailableScopeModal) {
        this.$refs.addAvailableScopeModal.resetData();
      }
    },
  },
};
</script>
