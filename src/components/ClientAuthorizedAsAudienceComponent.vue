<template>
    <div>
        <ClientAuthorizeModal ref="authorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeauthorizeModal ref="deauthorizeModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        
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
</template>

<script>

import ClientAuthorizeModal from './ClientAuthorizeModal.vue';
import ClientDeauthorizeModal from './ClientDeauthorizeModal.vue';

export default {
    props: ['client'],
    emits: ['refreshClient'],
    components: {
        ClientAuthorizeModal,
        ClientDeauthorizeModal,
    },
    methods: {
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
            this.$emit('refreshClient', {});
        },
    },
}
</script>