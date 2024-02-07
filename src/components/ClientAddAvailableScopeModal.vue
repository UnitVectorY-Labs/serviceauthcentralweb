<template>
    <div class="modal fade" id="clientAddAvailableScopeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientAddAvailableScopeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form @submit.prevent="addScope" v-show="!addScopeSuccess"> <!-- Add this line -->
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clientAddAvailableScopeModalLabel">Add Available Scope</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                        <div class="form-group mb-3">
                            <label for="scope">Scope</label>
                            <input type="text" class="form-control" id="scope" v-model="scope" placeholder="Enter Scope" :disabled="loading" />
                        </div>
                        <div class="form-group mb-3">
                            <label for="description">Description</label>
                            <input type="text" class="form-control" id="description" v-model="description" placeholder="Enter Description" :disabled="loading" />
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="loading">Add Scope</button>
                    </div>
                </div>
            </form> <!-- Close the form tag -->

            <div v-if="addScopeSuccess" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="clientAuthorizeModalLabel">Available Scope Added Successful</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';

const ADD_CLIENT_AVAILABLE_SCOPE = gql`
    mutation AddClientAvailableScope($clientId: String!, $availableScope: ClientScopeInput!) {
        addClientAvailableScope(clientId: $clientId, availableScope: $availableScope) {
            success
        }
    }
`;

export default {
    props: {
        client: Object
    },
    emits: ['refreshClient'],
    data() {
        return {
            loading: false,
            errorMessage: null,
            addScopeSuccess: false,
            scope: '', // For the scope input
            description: '', // For the description input
        };
    },
    methods: {
        async addScope() {
            if (!this.scope || !this.description) {
                this.errorMessage = "Please fill in all fields.";
                return;
            }

            this.loading = true;
            this.errorMessage = null;

            try {
                const response = await client.mutate({
                    mutation: ADD_CLIENT_AVAILABLE_SCOPE,
                    variables: {
                        clientId: this.client.clientId,
                        availableScope: {
                            scope: this.scope,
                            description: this.description
                        }
                    }
                });

                if (response.data.addClientAvailableScope.success) {
                    // Handle success (e.g., close modal, clear form, refresh data)
                    this.addScopeSuccess = true;
                    this.$emit('refreshClient', {});
                } else {
                    // Handle failure
                    this.errorMessage = response.data.addClientAvailableScope.message || "Failed to add available scope.";
                }
            } catch (error) {
                console.error("Error adding available scope:", error);
                this.errorMessage = "An error occurred while adding the scope.";
            } finally {
                this.loading = false;
            }
        },
        resetData() {
            this.addScopeSuccess = false;
            this.errorMessage = null;
            this.scope = '';
            this.description = '';
        }
    }
};

</script>
