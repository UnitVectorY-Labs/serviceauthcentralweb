<template>
    <ClientAddAvailableScopeModal ref="addAvailableScopeModal" v-if="client" :client="client" />
    
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
        <span class="fw-lighter">No scopes defined.</span>
    </div>
</template>

<script>

import ClientAddAvailableScopeModal from './ClientAddAvailableScopeModal.vue';

export default {
    props: ['client'],
    components: {
      ClientAddAvailableScopeModal,
  },
}
</script>
