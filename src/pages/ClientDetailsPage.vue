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
    <div v-else-if="notFound">
      <Error404Component />
    </div>
    <div v-else-if="client" v-show="!loading">
      <div class="row">
        <div class="col-lg-6 col-sm-12">
          <ClientInfoComponent :client="client" />
          <ClientAvailableScopesComponent :client="client" @refreshClient="refreshClient" />
        </div>

        <div class="col-lg-6 col-sm-12">
          <ClientJwtBearerComponent :client="client" @refreshClient="refreshClient" />
          <ClientSecretsComponent :client="client" @refreshClient="refreshClient" />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-sm-12">
          <ClientAuthorizedAsSubjectComponent :client="client" />
        </div>

        <div
          class="col-lg-6 col-sm-12"
          v-if="client.managementPermissions.canAddAuthorization || client.managementPermissions.canDeleteAuthorization"
        >
          <ClientAuthorizedAsAudienceComponent :client="client" @refreshClient="refreshClient" />
        </div>
      </div>
    </div>
    <div v-if="loading">
      <LoadingComponent />
    </div>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '@/services/apollo-client';

import ClientInfoComponent from '@/components/ClientInfoComponent.vue';
import ClientAvailableScopesComponent from '@/components/ClientAvailableScopesComponent.vue';
import ClientJwtBearerComponent from '@/components/ClientJwtBearerComponent.vue';
import ClientSecretsComponent from '@/components/ClientSecretsComponent.vue';
import ClientAuthorizedAsSubjectComponent from '@/components/ClientAuthorizedAsSubjectComponent.vue';
import ClientAuthorizedAsAudienceComponent from '@/components/ClientAuthorizedAsAudienceComponent.vue';

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
        canAddAvailableScope
        canAddAuthorization
        canDeleteAuthorization
        canAuthorizeAddScope
        canAuthorizeRemoveScope
      }
    }
  }
`;

export default {
  name: 'ClientDetailsPage',
  components: {
    ClientInfoComponent,
    ClientAvailableScopesComponent,
    ClientJwtBearerComponent,
    ClientSecretsComponent,
    ClientAuthorizedAsSubjectComponent,
    ClientAuthorizedAsAudienceComponent,
  },
  data() {
    return {
      client: null, // Store the specific client
      notFound: false,
      serverError: false,
      loading: true,
    };
  },
  mounted() {
    const clientId = this.$route.params.clientId; // Get the clientId from the route
    this.loading = true;
    this.loadClient(clientId, false);
  },
  watch: {
    // Watch for changes in the route parameters (clientId)
    '$route.params.clientId': 'loadClient',
  },
  methods: {
    refreshClient() {
      this.loadClient(this.client.clientId, true);
    },
    async loadClient(clientId, refresh) {
      if (refresh != false) {
        this.loading = true;
      }
      try {
        const { data } = await client.query({
          query: GET_CLIENT,
          variables: { clientId },
          fetchPolicy: refresh ? 'network-only' : 'cache-first',
        });
        if (data.client != null) {
          this.client = data.client;
          this.loading = false;
        } else {
          this.notFound = true;
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        this.serverError = true;
      }
    },
  },
};
</script>
