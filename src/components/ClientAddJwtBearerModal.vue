<template>
    <div class="modal fade" id="clientAddJwtBearerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientAddJwtBearerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form @submit.prevent="submitForm" v-show="!authorizedSuccess">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clientAddJwtBearerModalLabel">Add JWT Bearer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                        <div class="form-group mb-3">
                            <label for="jwksUrl">JWKS URL</label>
                            <input type="text" class="form-control" id="jwksUrl" v-model="jwksUrl" :disabled="loading" placeholder="https://example.com/.well-known/jwks.json">
                        </div>
                        <div class="form-group mb-3">
                            <label for="iss">Issuer</label>
                            <input type="text" class="form-control" id="iss" v-model="iss" :disabled="loading" placeholder="Issuer">
                        </div>
                        <div class="form-group mb-3">
                            <label for="sub">Subject</label>
                            <input type="text" class="form-control" id="sub" v-model="sub" :disabled="loading" placeholder="Subject">
                        </div>
                        <div class="form-group mb-3">
                            <label for="aud">Audience</label>
                            <input type="text" class="form-control" id="aud" v-model="aud" :disabled="loading" placeholder="Audience">
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
            jwksUrl: '',
            iss: '',
            sub: '',
            aud: '',
            loading: false,
            errorMessage: null,
            authorizedSuccess: false
        };
    },
    methods: {
        async confirmAuthorize() {
            this.errorMessage = null;
            this.loading = true;

            const AUTHORIZE_JWT_BEARER= gql`
                mutation AuthorizeJwtBearer($clientId: String!, $jwksUrl: String!, $iss: String!, $sub: String!, $aud: String!) {
                    authorizeJwtBearer(
                        clientId: $clientId
                        jwksUrl: $jwksUrl
                        iss: $iss
                        sub: $sub
                        aud: $aud
                    ) {
                        success
                    }
                }
            `;
            try {
                const response = await client.mutate({ 
                    mutation: AUTHORIZE_JWT_BEARER, 
                    variables: { 
                        clientId: this.client.clientId,
                        jwksUrl: this.jwksUrl,
                        iss: this.iss,
                        sub: this.sub,
                        aud: this.aud,
                    }
                });

                if(response.data.authorizeJwtBearer.success) {
                    this.authorizedSuccess = true;
                    this.$emit('refreshClient', {});
                } else {
                    this.errorMessage = "Failed to add authorized JWT Bearer.";
                }
            } catch (error) {
                console.error("Error authorizing client:", error);
                this.$emit('error', error); // Notify parent component of error
            } finally {
                this.loading = false;
            }
        },
        resetData() {
            this.jwksUrl = '';
            this.iss = '';
            this.sub = '';
            this.aud = '';
            this.loading = false;
            this.errorMessage = null;
            this.authorizedSuccess = false;
        }
    }
};
</script>
