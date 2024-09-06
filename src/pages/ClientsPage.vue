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
  <div class="container mt-4">
    <div v-if="serverError">
      <Error500Component />
    </div>
    <div v-else-if="loading">
      <LoadingComponent />
    </div>
    <div v-else>
      <h3>Clients</h3>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th scope="col">Client Id</th>
            <th scope="col">Description</th>
            <th scope="col" class="text-end">
              <router-link :to="'/client'" class="btn btn-success" v-if="canWrite">
                <i class="bi bi-plus"></i>
              </router-link>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="edge in clients.edges" :key="edge.node.clientId">
            <th scope="row"><p class="text-break">{{ edge.node.clientId }}</p></th>
            <td>{{ edge.node.description }}</td>
            <td class="text-end">
              <router-link :to="'/clients/' + encodeURIComponent(edge.node.clientId)" class="btn btn-primary">
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-center mb-3">
        <div class="btn-group pagination-controls" role="group" aria-label="Pagination Controls">
          <button @click="loadPrevious()" :disabled="!clients.pageInfo.hasPreviousPage" class="btn btn-primary">
            <i class="bi bi-chevron-left"></i> Previous
          </button>
          <button @click="loadNext()" :disabled="!clients.pageInfo.hasNextPage" class="btn btn-primary">
            Next <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { gql } from '@apollo/client/core';
import client from '@/services/apollo-client';

const GET_CLIENTS = gql`
  query Clients($first: Int, $after: String, $last: Int, $before: String) {
    clients(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          clientId
          description
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const PERPAGE = 10;

export default {
  name: 'ClientsPage',
  data() {
    return {
      clients: {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      },
      loading: true,
      serverError: false,
    };
  },
  mounted() {
    this.loadClients({ first: PERPAGE });
  },
  computed: {
    ...mapGetters(['canWrite']),
  },
  methods: {
    async loadClients({ first, after, last, before }) {
      this.serverError = false;
      try {
        const { data } = await client.query({
          query: GET_CLIENTS,
          variables: { first, after, last, before },
        });
        this.clients = data.clients;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching clients:', error);
        this.serverError = true;
      }
    },
    loadNext() {
      const { endCursor } = this.clients.pageInfo;
      this.loadClients({ first: PERPAGE, after: endCursor });
    },
    loadPrevious() {
      const { startCursor } = this.clients.pageInfo;
      this.loadClients({ last: PERPAGE, before: startCursor });
    },
  },
};
</script>
