<template>
    <div class="container mt-4">
        <h2>Clients</h2>
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Client Id</th>
                    <th scope="col">Description</th>
                    <th scope="col" class="text-end">
                      <router-link :to="'/client'" class="btn btn-success">
                        <i class="bi bi-plus"></i>
                      </router-link>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in clients" :key="client.clientId">
                    <th scope="row">{{ client.clientId }}</th>
                    <td>{{ client.description }}</td>
                    <td class="text-end">
                      <router-link :to="'/clients/' + client.clientId" class="btn btn-primary">
                        <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';

export default {
  name: 'ClientsPage',
  data() {
    return {
      clients: [],
    };
  },
  mounted() {
    this.loadClients();
  },
  methods: {
    async loadClients() {
      const GET_CLIENTS = gql`
        query Clients {
          clients {
            clientId
            description
          }
        }
      `;
      
      try {
        const { data } = await client.query({ query: GET_CLIENTS });
        this.clients = data.clients;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
  },
};
</script>
