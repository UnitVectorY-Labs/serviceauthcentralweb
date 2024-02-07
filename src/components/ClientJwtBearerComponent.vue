<template>
    <div v-if="client.managementPermissions.canAddClientAuthorization || client.managementPermissions.canDeleteClientAuthorization">
        <ClientAddJwtBearerModal ref="addJwtBearerModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeauthorizeJwtBearerModal ref="deauthorizeJwtBearerModal" v-if="client" :client="client" @refreshClient="refreshClient" />
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
</template>

<script>

import ClientAddJwtBearerModal from './ClientAddJwtBearerModal';
import ClientDeauthorizeJwtBearerModal from './ClientDeauthorizeJwtBearerModal.vue';


export default {
    props: ['client'],
    emits: ['refreshClient'],
    components: {
        ClientAddJwtBearerModal,
        ClientDeauthorizeJwtBearerModal,
    },
    methods: {
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
        refreshClient() {
            this.$emit('refreshClient', {});
        },
    },
}
</script>
