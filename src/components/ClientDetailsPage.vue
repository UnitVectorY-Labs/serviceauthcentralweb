<template>
    <div class="container mt-4">
      <div v-if="serverError">
        <Error500Component/>
      </div>
      <div v-else-if="notFound">
        <Error404Component/>
      </div>
      <div v-else-if="client">

        <ClientDeleteModal v-if="client" :client="client" @deleted="handleDeletion" />
        <ClientCreateSecretModal ref="secretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeleteSecretModal ref="deleteSecretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientAuthorizeModal ref="authorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeauthorizeModal ref="deauthorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientAddJwtBearerModal ref="addJwtBearerModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <clientDeauthorizeJwtBearerModal ref="deauthorizeJwtBearerModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientAddAvailableScopeModal ref="addAvailableScopeModal" v-if="client" :client="client" />
        <div class="row">
          <div class="col-lg-6 col-sm-12">
            <h3>Client</h3>
            <span class="text-muted">A client is used by a service for both making requests to other clients and for receiving requests from other clients.</span>
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                  <tr>
                      <th scope="col">Field</th>
                      <th scope="col">Value</th>
                      <th scope="col">
                          <button v-if="client.managementPermissions.canDeleteClient" type="button" class="btn btn-danger float-end" data-bs-toggle="modal" data-bs-target="#deleteClientModal" title="Delete Client">
                              <i class="bi bi-trash"></i>
                          </button>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Client Id</td>
                      <td><p class="text-break">{{ client.clientId }}</p></td>
                      <td></td>
                  </tr>
                  <tr>
                      <td>Description</td>
                      <td><p class="text-break">{{ client.description }}</p></td>
                      <td></td>
                  </tr>
                  <tr>
                      <td>Created</td>
                      <td><DateTimeComponent :date="client.clientCreated" /></td>
                      <td></td>
                  </tr>
              </tbody>
          </table>

          <h3>Client Available Scopes</h3>
          <span class="text-muted">The list of scopes this client recognizes that can be requested by another client if authorization is granted.</span>
          <table class="table table-striped table-hover">
            <thead class="table-dark">
                  <tr>
                      <th scope="col">Scope</th>
                      <th scope="col">Description</th>
                      <th scope="col">
                          <button type="button" class="btn btn-success float-end" data-bs-toggle="modal" data-bs-target="#clientAddAvailableScopeModal" title="Add Available Scope">
                              <i class="bi bi-plus"></i>
                          </button>
                      </th>
                  </tr>
              </thead>
              <tbody>
                <tr v-for="availableScope in client.availableScopes" :key="availableScope.scope">
                    <td><span class="badge text-bg-dark">{{ availableScope.scope }}</span></td>
                    <td>{{ availableScope.description }}</td>
                    <td></td>
                  </tr>
              </tbody>
          </table>
          <div v-if="client.availableScopes.length == 0" class="text-center p-3">
              <span class="fw-lighter">No client available scopes.</span>
            </div>

          </div>

          <div class="col-lg-6 col-sm-12">
            <div v-if="client.managementPermissions.canAddClientAuthorization || client.managementPermissions.canDeleteClientAuthorization">
              <h3>Client Authorizations</h3>
              <span class="text-muted">The preferred method for authenticating clients is using an existing JWT to authenticate the client that is registered here.</span>
              <button v-if="client.managementPermissions.canAddClientAuthorization" type="button" class="btn btn-success float-end" @click="openAddJwtBearerModal()" data-bs-toggle="modal" data-bs-target="#clientAddJwtBearerModal">
                <i class="bi bi-plus"></i>
              </button>
              <div v-for="bearer in client.jwtBearer" :key="bearer.id">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                      <tr>
                          <th scope="col">Field</th>
                          <th scope="col">
                            <div class="d-flex justify-content-between align-items-end">
                              <div>Value</div>
                              <button v-if="client.managementPermissions.canDeleteClientAuthorization" type="button" class="btn btn-danger float-end" @click="openDeauthorizeJwtBearerModal(bearer)" data-bs-toggle="modal" data-bs-target="#clientDeauthorizeJwtBearerModal" title="Delete Client JWT Bearer">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>JWKS URL</td>
                          <td>{{ bearer.jwksUrl }}</td>
                      </tr>
                      <tr>
                          <td>Issuer</td>
                          <td>{{ bearer.iss }}</td>
                      </tr>
                      <tr>
                          <td>Audience</td>
                          <td>{{ bearer.aud }}</td>
                      </tr>
                      <tr>
                          <td>Subject</td>
                          <td>{{ bearer.sub }}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="client.jwtBearer.length == 0" class="text-center p-3">
                <span class="fw-lighter">No client authorizations.</span>
              </div>
            </div>
            <div v-if="client.managementPermissions.canAddClientSecret || client.managementPermissions.canDeleteClientSecret">
              <h3>Client Secrets</h3>
              <span class="text-muted">Client secrets are used to authenticate clients and are not preferred. Two client secrets can be active at a time to facilitate rotation.</span>
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Field</th>
                        <th scope="col">Value</th>
                        <th scope="col">Created</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Client Secret 1</td>
                        <td>
                          <span :class="{'me-2': true, 'badge': true, 'bg-primary': client.clientSecret1Set, 'bg-secondary': !client.clientSecret1Set}">
                            {{ client.clientSecret1Set ? 'Set' : 'Not Set' }}
                          </span>
                        </td>
                        <td>
                          <DateTimeComponent v-if="client.clientSecret1Set" :date="client.clientSecret1Updated" />
                        </td>
                        <td>
                            <div v-if="client.clientSecret1Set">
                                <button v-if="client.managementPermissions.canDeleteClientSecret" type="button" class="btn btn-danger float-end" @click="openDeleteSecretModal('secret1')" data-bs-toggle="modal" data-bs-target="#deleteClientSecretModal" title="Delete Secret 1">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div v-else>
                                <button v-if="client.managementPermissions.canAddClientSecret" type="button" class="btn btn-success float-end" @click="openSecretModal('secret1')" data-bs-toggle="modal" data-bs-target="#clientCreateSecretModal" title="Create Secret 1">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Client Secret 2</td>
                        <td>
                          <span :class="{'me-2': true, 'badge': true, 'bg-primary': client.clientSecret2Set, 'bg-secondary': !client.clientSecret2Set}">
                            {{ client.clientSecret2Set ? 'Set' : 'Not Set' }}
                          </span>
                        </td>
                        <td>
                          <DateTimeComponent v-if="client.clientSecret2Set" :date="client.clientSecret2Updated" />
                        </td>
                        <td>
                            <div v-if="client.clientSecret2Set">
                                <button v-if="client.managementPermissions.canDeleteClientSecret" type="button" class="btn btn-danger float-end" @click="openDeleteSecretModal('secret2')" data-bs-toggle="modal" data-bs-target="#deleteClientSecretModal" title="Delete Secret 2">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div v-else>
                                <button v-if="client.managementPermissions.canAddClientSecret" type="button" class="btn btn-success float-end" @click="openSecretModal('secret2')" data-bs-toggle="modal" data-bs-target="#clientCreateSecretModal" title="Create Secret 2">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row">

          <div class="col-lg-6 col-sm-12">
            <!-- Display authorizations for subjects if client is not null -->
            <h3>Authorized as Subject</h3>
            <span class="text-muted">The "<span class="text-primary fw-bold">{{ client.clientId }}</span>" client is authorized to access the following clients.</span>
            <table class="table table-striped table-hover mt-2">
              <!-- Table headers here -->
              <thead class="table-dark">
                <tr>
                  <th scope="col">Client Id</th>
                  <th scope="col">Scopes</th>
                  <th scope="col">Created</th>
                  <th scope="col" class="text-end">
                    <!-- Right now not allowing granting access to other resources on a client page, just granting access to other clients. -->
                    <button type="button" class="btn btn-success float-end invisible" disabled="disabled" >
                      <i class="bi bi-plus"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Loop through authorizationsAsSubject and display them in rows -->
                <tr v-for="authorization in client.authorizationsAsSubject" :key="authorization.id">
                  <td><p class="text-break">{{ authorization.audience.clientId }}</p></td>
                  <td>
                    <span class="badge text-bg-dark" v-for="scope in authorization.authorizedScopes" :key="scope">{{ scope }}</span>
                  </td>
                  <td><DateTimeComponent :date="authorization.authorizationCreated" /></td>
                  <td class="text-end">
                    <div class="btn-group" role="group">
                      <!-- Right now not allowing deauthorize either -->
                      <button type="button" class="btn btn-danger float-end invisible" disabled="disabled">
                        <i class="bi bi-trash"></i>
                      </button>
                      <router-link :to="'/clients/' + encodeURIComponent(authorization.audience.clientId)" class="btn btn-primary">
                        <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="client.authorizationsAsSubject.length == 0" class="text-center p-3">
              <span class="fw-lighter">No authorizations.</span>
            </div>
          </div>

          <div class="col-lg-6 col-sm-12" v-if="client.managementPermissions.canAddAuthorization || client.managementPermissions.canDeleteAuthorization" >
            <!-- Display authorizations for audiences if client is not null -->
            <h3>Authorized as Audience</h3>
            <span class="text-muted">The following clients are authorized authorized to access "<span class="text-primary fw-bold">{{ client.clientId }}</span>".</span>
            <table class="table table-striped table-hover mt-2">
              <!-- Table headers here -->
              <thead class="table-dark">
                <tr>
                  <th scope="col">Client Id</th>
                  <th scope="col">Scopes</th>
                  <th scope="col">Created</th>
                  <th scope="col" class="text-end">
                    <button v-if="client.managementPermissions.canAddAuthorization" type="button" class="btn btn-success float-end" @click="resetAuthorize()" data-bs-toggle="modal" data-bs-target="#clientAuthorizeModal">
                      <i class="bi bi-plus"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Loop through authorizationsAsAudience and display them in rows -->
                <tr v-for="authorization in client.authorizationsAsAudience" :key="authorization.id">
                  <td><p class="text-break">{{ authorization.subject.clientId }}</p></td>
                  <td>
                    <span class="badge text-bg-dark" v-for="scope in authorization.authorizedScopes" :key="scope">{{ scope }}</span>
                  </td>
                  <td><DateTimeComponent :date="authorization.authorizationCreated" /></td>
                  <td class="text-end">
                    <div class="btn-group" role="group">
                      <button v-if="client.managementPermissions.canDeleteAuthorization" type="button" class="btn btn-danger float-end"  @click="openDeauthorizeModal(authorization.subject.clientId)" data-bs-toggle="modal" data-bs-target="#clientDeauthorizeModal">
                        <i class="bi bi-trash"></i>
                      </button>
                      <router-link :to="'/clients/' + encodeURIComponent(authorization.subject.clientId)" class="btn btn-primary">
                        <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="client.authorizationsAsAudience.length == 0" class="text-center p-3">
              <span class="fw-lighter">No authorizations.</span>
            </div>
          </div>
          </div>
        </div>
        <div v-else>
          <LoadingComponent/>
        </div>
    </div>
  </template>
  
  
<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';
import ClientDeleteModal from './ClientDeleteModal.vue';
import ClientCreateSecretModal from './ClientCreateSecretModal.vue';
import ClientDeleteSecretModal from './ClientDeleteSecretModal.vue';
import ClientAuthorizeModal from './ClientAuthorizeModal.vue';
import ClientDeauthorizeModal from './ClientDeauthorizeModal.vue';
import ClientAddJwtBearerModal from './ClientAddJwtBearerModal';
import clientDeauthorizeJwtBearerModal from './ClientDeauthorizeJwtBearerModal.vue';
import ClientAddAvailableScopeModal from './ClientAddAvailableScopeModal.vue';

const GET_CLIENT = gql`
  query Client($clientId: ID!) { 
    client(clientId: $clientId) {
      clientId
      clientCreated
      description
      clientType
      clientSecret1Set
      clientSecret1Updated
      clientSecret2Set
      clientSecret2Updated
      availableScopes {
        scope
        description
      }
      authorizationsAsSubject {
        id
        authorizationCreated
        authorizedScopes
        audience {
          clientId
        }
      }
      authorizationsAsAudience {
        id
        authorizationCreated
        authorizedScopes
        subject {
          clientId
        }
      }
      jwtBearer {
        id
        jwksUrl
        iss
        sub
        aud
      }
      managementPermissions {
        canDeleteClient
        canAddClientSecret
        canDeleteClientSecret
        canAddClientAuthorization
        canDeleteClientAuthorization
        canAddAuthorization
        canDeleteAuthorization
        }
    }
  }
`;

export default {
  name: 'ClientDetailsPage',
  components: {
      ClientDeleteModal,
      ClientCreateSecretModal,
      ClientDeleteSecretModal,
      ClientAuthorizeModal,
      ClientDeauthorizeModal,
      ClientAddJwtBearerModal,
      clientDeauthorizeJwtBearerModal,
      ClientAddAvailableScopeModal,
  },
  data() {
    return {
      client: null, // Store the specific client
      notFound: false,
      serverError: false,
    };
  },
  mounted() {
    const clientId = this.$route.params.clientId; // Get the clientId from the route
    this.loadClient(clientId, false);
  },
  watch: {
    // Watch for changes in the route parameters (clientId)
    '$route.params.clientId': 'loadClient',
  },
  methods: {
    handleDeletion() {
      client.resetStore(); // We made a change so reset the local cache
      this.$router.push('/clients'); // Navigate back to home
    },
    openSecretModal(secretType) {
      // Assuming the child component has a method named 'generateSecret'
      if (this.$refs.secretModal) {
        this.$refs.secretModal.generateSecret(secretType);
      }
    },
    openDeleteSecretModal(secretType) {
      if (this.$refs.deleteSecretModal) {
        this.$refs.deleteSecretModal.setSecretType(secretType);
      }
    },
    openDeauthorizeModal(subject) {
      if (this.$refs.deauthorizeModal) {
        this.$refs.deauthorizeModal.setDeauthorizedSubject(subject);
      }
    },
    openAddJwtBearerModal() {
      if(this.$refs.addJwtBearerModal){
        this.$refs.addJwtBearerModal.resetData();
      }
    },
    openDeauthorizeJwtBearerModal(jwtBearer) {
      if(this.$refs.deauthorizeJwtBearerModal){
        this.$refs.deauthorizeJwtBearerModal.setJwtBearer(jwtBearer);
      }
    },
    resetAuthorize() {
      if(this.$refs.authorizeModal){
        this.$refs.authorizeModal.resetData();
      }
    },
    refreshClient() {
      this.loadClient(this.client.clientId, true);
    },
    async loadClient(clientId, refresh) {
      try {
        const { data } = await client.query({ 
          query: GET_CLIENT, 
          variables: { clientId },
          fetchPolicy: refresh ? 'network-only' : 'cache-first',
        });
        if (data.client != null) {
          this.client = data.client;
        } else {
          this.notFound = true;
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        this.serverError = true;
      }
    },
  },
};
</script>
  