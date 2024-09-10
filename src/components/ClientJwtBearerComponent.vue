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
    v-if="
      client.managementPermissions.canAddClientAuthorization ||
      client.managementPermissions.canDeleteClientAuthorization
    "
  >
    <ClientAddJwtBearerModal ref="addJwtBearerModal" v-if="client" :client="client" @refreshClient="refreshClient" />
    <ClientDeauthorizeJwtBearerModal
      ref="deauthorizeJwtBearerModal"
      v-if="client"
      :client="client"
      @refreshClient="refreshClient"
    />
    <h3>Client JWT Bearer</h3>
    <span class="text-muted"
      >The preferred method for authenticating clients is using an existing JWT to authenticate the client that is
      registered here.</span
    >
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th scope="col">JWT Bearer</th>
          <th scope="col">
            <button
              v-if="client.managementPermissions.canAddClientAuthorization"
              type="button"
              class="btn btn-success float-end"
              @click="openAddJwtBearerModal()"
              data-bs-toggle="modal"
              data-bs-target="#clientAddJwtBearerModal"
            >
              <i class="bi bi-plus"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bearer in client.jwtBearer" :key="bearer.id">
          <td>
            <table class="table table-bordered">
              <tr>
                <th>JWKS URL</th>
                <td>
                  <a :href="bearer.jwksUrl" target="_blank" class="my-custom-transparent-bg text-break">{{ bearer.jwksUrl }}</a>
                </td>
              </tr>
              <tr>
                <th>Issuer</th>
                <td>
                  <span class="font-monospace my-custom-transparent-bg text-break">{{ bearer.iss }}</span>
                </td>
              </tr>
              <tr>
                <th>Audience</th>
                <td>
                  <span class="font-monospace my-custom-transparent-bg text-break">{{ bearer.aud }}</span>
                </td>
              </tr>
              <tr>
                <th>Subject</th>
                <td>
                  <span class="font-monospace my-custom-transparent-bg text-break">{{ bearer.sub }}</span>
                </td>
              </tr>
            </table>
          </td>
          <td>
            <button
              v-if="client.managementPermissions.canDeleteClientAuthorization"
              type="button"
              class="btn btn-danger float-end"
              @click="openDeauthorizeJwtBearerModal(bearer)"
              data-bs-toggle="modal"
              data-bs-target="#clientDeauthorizeJwtBearerModal"
              title="Delete Client JWT Bearer"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="client.jwtBearer.length == 0" class="text-center p-3">
      <span class="fw-lighter">No client JWT Bearers Registered.</span>
    </div>
  </div>
</template>

<style>
.my-custom-transparent-bg {
  background-color: transparent !important;
}
</style>

<script>
import ClientAddJwtBearerModal from '@/components/ClientAddJwtBearerModal';
import ClientDeauthorizeJwtBearerModal from '@/components/ClientDeauthorizeJwtBearerModal.vue';

export default {
  props: ['client'],
  emits: ['refreshClient'],
  components: {
    ClientAddJwtBearerModal,
    ClientDeauthorizeJwtBearerModal,
  },
  methods: {
    openAddJwtBearerModal() {
      if (this.$refs.addJwtBearerModal) {
        this.$refs.addJwtBearerModal.resetData();
      }
    },
    openDeauthorizeJwtBearerModal(jwtBearer) {
      if (this.$refs.deauthorizeJwtBearerModal) {
        this.$refs.deauthorizeJwtBearerModal.setJwtBearer(jwtBearer);
      }
    },
    refreshClient() {
      this.$emit('refreshClient', {});
    },
  },
};
</script>
