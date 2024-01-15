<template>
    <div class="container">
      <div v-if="serverError">
        <Error500Component/>
      </div>
      <div v-else-if="notFound">
        <Error404Component/>
      </div>
      <div v-else-if="client">
        <h2>Client Details</h2>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteClientModel">
            <i class="bi bi-trash"></i>
        </button>
        <client-delete-modal v-if="client" :client="client" @deleted="handleDeletion"></client-delete-modal>

        <!-- Display client details if client is not null -->
        <p>Client ID: {{ client.clientId }}</p>
        <p>Description: {{ client.description }}</p>
        <p>clientSecret1Set: {{ client.clientSecret1Set }}</p>
        <p>clientSecret2Set: {{ client.clientSecret2Set }}</p>

        <!-- Display authorizations for subjects if client is not null -->
        <table class="table">
          <!-- Table headers here -->
          <thead>
            <tr>
              <th scope="col">Authorized as Subject</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop through authorizationsAsSubject and display them in rows -->
            <tr v-for="authorization in client.authorizationsAsSubject" :key="authorization.id">
              <!--<td>{{ authorization.id }}</td>-->
              <td>
                  <router-link :to="'/clients/' + authorization.audience.clientId">{{ authorization.audience.clientId }}</router-link>
              </td> 
            </tr>
          </tbody>
        </table>

        <!-- Display authorizations for audiences if client is not null -->
        <table class="table">
          <!-- Table headers here -->
          <thead>
            <tr>
              <th scope="col">Authorized as Audience</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop through authorizationsAsAudience and display them in rows -->
            <tr v-for="authorization in client.authorizationsAsAudience" :key="authorization.id">
              <!-- <td>{{ authorization.id }}</td>-->
              <td>
                  <router-link :to="'/clients/' + authorization.subject.clientId">{{ authorization.subject.clientId }}</router-link>
              </td>
            </tr>
          </tbody>
        </table>
          
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
  
  export default {
    name: 'ClientDetailsPage',
    components: {
        ClientDeleteModal,
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
      this.loadClient(clientId);
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
      async loadClient(clientId) {
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
          const { data } = await client.query({ query: GET_CLIENT, variables: { clientId } });
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
  