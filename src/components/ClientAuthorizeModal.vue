<template>
    <div class="modal fade" id="clientAuthorizeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientAuthorizeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form @submit.prevent="submitForm" v-show="!authorizedSuccess">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clientAuthorizeModalLabel">Authorize Client</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                        <div class="form-group mb-3">
                            <label for="authorizedSubject">Authorized Subject Client Id</label>
                            <input type="text" class="form-control" id="authorizedSubject" v-model="authorizedSubject" :disabled="loading" placeholder="Enter Client Id">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success" :disabled="loading" @click="confirmAuthorize">Authorize</button>
                    </div>
                </div>
            </form>
            <div v-if="authorizedSuccess" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="clientAuthorizeModalLabel">Authorization Successful</h5>
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

export default {
    props: {
        client: Object
    },
    data() {
        return {
            authorizedSubject: '',
            loading: false,
            errorMessage: null,
            authorizedSuccess: false
        };
    },
    methods: {
        async confirmAuthorize() {
            this.errorMessage = null;
            this.loading = true;

            const AUTHORIZE_CLIENT = gql`
                mutation Authorize($subject: String!, $audience: String!) {
                    authorize(subject: $subject, audience: $audience) {
                        success
                    }
                }
            `;
            try {
                const response = await client.mutate({ 
                    mutation: AUTHORIZE_CLIENT, 
                    variables: { 
                        subject: this.authorizedSubject,
                        audience: this.client.clientId
                    }
                });

                if(response.data.authorize.success) {
                    this.authorizedSuccess = true;
                    this.$emit('refreshClient', {});
                } else {
                    this.errorMessage = "Failed to authorize client";
                }
            } catch (error) {
                console.error("Error authorizing client:", error);
                this.$emit('error', error); // Notify parent component of error
            } finally {
                this.loading = false;
            }
        },
        resetData() {
            this.authorizedSubject = '';
            this.loading = false;
            this.errorMessage = null;
            this.authorizedSuccess = false;
        }
    }
};
</script>
