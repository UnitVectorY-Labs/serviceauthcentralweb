<template>
    <div class="container mt-4">
      <div v-if="serverError">
        <Error500Component/>
      </div>
      <div v-else-if="notFound">
        <Error404Component/>
      </div>
      <div v-else-if="client">

        <client-delete-modal v-if="client" :client="client" @deleted="handleDeletion" />
        <ClientCreateSecretModal ref="secretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeleteSecretModal ref="deleteSecretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientAuthorizeModal ref="authorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeauthorizeModal ref="deauthorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        
        <div class="row">
          <div class="col">
            <h3>Client</h3>
            <table class="table">
              <!-- Table headers here -->
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">Value</th>
                  <th scope="col">
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteClientModel">
                      <i class="bi bi-trash"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Client ID</td>
                  <td>{{ client.clientId }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{{ client.description }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Client Secret 1</td>
                  <td>{{ client.clientSecret1Set }}</td>
                  <td>
                    <div v-if="client.clientSecret1Set">
                      <button type="button" class="btn btn-danger" @click="openDeleteSecretModal('secret1')" data-bs-toggle="modal" data-bs-target="#deleteClientSecretModel">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <div v-else>
                      <button type="button" class="btn btn-success" @click="openSecretModal('secret1')" data-bs-toggle="modal" data-bs-target="#clientCreateSecretModal">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Client Secret 2</td>
                  <td>{{ client.clientSecret2Set }}</td>
                  <td>
                    <div v-if="client.clientSecret2Set">
                      <button type="button" class="btn btn-danger" @click="openDeleteSecretModal('secret2')" data-bs-toggle="modal" data-bs-target="#deleteClientSecretModel">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <div v-else>
                      <button type="button" class="btn btn-success" @click="openSecretModal('secret2')" data-bs-toggle="modal" data-bs-target="#clientCreateSecretModal">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col">
            <!-- Display authorizations for subjects if client is not null -->
            <h3>Authorized as Subject</h3>
            <table class="table">
              <!-- Table headers here -->
              <thead>
                <tr>
                  <th scope="col">Client Id</th>
                  <th scope="col" class="text-end">
                    <!-- Right now not allowing granting access to other resources on a client page, just granting access to other clients. -->
                    <button type="button" class="btn btn-success invisible" disabled="disabled" >
                      <i class="bi bi-plus"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Loop through authorizationsAsSubject and display them in rows -->
                <tr v-for="authorization in client.authorizationsAsSubject" :key="authorization.id">
                  <!--<td>{{ authorization.id }}</td>-->
                  <td>{{ authorization.audience.clientId }}</td>
                  <td class="text-end">
                    <div class="btn-group" role="group">
                      <!-- Right now not allowing deauthorize either -->
                      <button type="button" class="btn btn-danger invisible" disabled="disabled">
                        <i class="bi bi-trash"></i>
                      </button>
                      <router-link :to="'/clients/' + authorization.audience.clientId" class="btn btn-primary">
                        <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col">
            <!-- Display authorizations for audiences if client is not null -->
            <h3>Authorized as Audience</h3>
            <table class="table">
              <!-- Table headers here -->
              <thead>
                <tr>
                  <th scope="col">Client Id</th>
                  <th scope="col" class="text-end">
                    <button type="button" class="btn btn-success" @click="resetAuthorize()" data-bs-toggle="modal" data-bs-target="#clientAuthorizeModal">
                      <i class="bi bi-plus"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Loop through authorizationsAsAudience and display them in rows -->
                <tr v-for="authorization in client.authorizationsAsAudience" :key="authorization.id">
                  <!--<td>{{ authorization.id }}</td>-->
                  <td>{{ authorization.subject.clientId }}</td>
                  <td class="text-end">
                    <div class="btn-group" role="group">
                      <button type="button" class="btn btn-danger"  @click="openDeauthorizeModal(authorization.subject.clientId)" data-bs-toggle="modal" data-bs-target="#clientDeauthorizeModel">
                        <i class="bi bi-trash"></i>
                      </button>
                      <router-link :to="'/clients/' + authorization.subject.clientId" class="btn btn-primary">
                        <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
  
  export default {
    name: 'ClientDetailsPage',
    components: {
        ClientDeleteModal,
        ClientCreateSecretModal,
        ClientDeleteSecretModal,
        ClientAuthorizeModal,
        ClientDeauthorizeModal,
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
        this.$router.push('/'); // Navigate back to home
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
      resetAuthorize() {
        if(this.$refs.authorizeModal){
          this.$refs.authorizeModal.resetData();
        }
      },
      refreshClient() {
        this.loadClient(this.client.clientId, true);
      },
      async loadClient(clientId, refresh) {
        const GET_CLIENT = gql`
          query Client($clientId: ID!) { 
            client(clientId: $clientId) {
              clientId
              description
              clientSecret1Set
              clientSecret2Set
              authorizationsAsSubject {
                id
                audience {
                  clientId
                }
              }
              authorizationsAsAudience {
                id
                subject {
                  clientId
                }
              }
            }
          }
        `;
  
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
  