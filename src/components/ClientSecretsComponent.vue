<template>
    <div v-if="client.managementPermissions.canAddClientSecret || client.managementPermissions.canDeleteClientSecret">
        <ClientCreateSecretModal ref="secretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        <ClientDeleteSecretModal ref="deleteSecretModal" v-if="client" :client="client" @refreshClient="refreshClient" />
        
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
</template>

<script>

import ClientCreateSecretModal from '@/components/ClientCreateSecretModal.vue';
import ClientDeleteSecretModal from '@/components/ClientDeleteSecretModal.vue';

export default {
    props: ['client'],
    emits: ['refreshClient'],
    components: {
        ClientCreateSecretModal,
        ClientDeleteSecretModal,
    },
    methods: {
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
        refreshClient() {
            this.$emit('refreshClient', {});
        },
    },
};

</script>