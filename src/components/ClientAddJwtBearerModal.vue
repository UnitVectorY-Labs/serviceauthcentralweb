<template>
    <div class="modal fade" id="clientAddJwtBearerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientAddJwtBearerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form @submit.prevent="confirmAuthorize" v-show="!authorizedSuccess">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clientAddJwtBearerModalLabel">Add JWT Bearer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info" role="alert">
                            JWT Bearer authentication allows secure authentication with an external JWT, eliminating the need for a client secret.
                        </div>
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                        <div class="form-group mb-3" v-for="field in formFields" :key="field.id">
                            <label :for="field.id">{{ field.label }}</label>
                            <input type="text" class="form-control" :id="field.id" v-model="field.value" :disabled="loading" :placeholder="field.placeholder">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success" :disabled="loading">Authorize</button>
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
import client from '@/services/apollo-client';

const AUTHORIZE_JWT_BEARER = gql`
    mutation AuthorizeJwtBearer($clientId: String!, $jwksUrl: String!, $iss: String!, $sub: String!, $aud: String!) {
        authorizeJwtBearer(clientId: $clientId, jwksUrl: $jwksUrl, iss: $iss, sub: $sub, aud: $aud) {
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
            formFields: [
                { id: 'jwksUrl', label: 'JWKS URL', value: '', placeholder: 'https://example.com/.well-known/jwks.json' },
                { id: 'iss', label: 'Issuer', value: '', placeholder: 'Issuer' },
                { id: 'sub', label: 'Subject', value: '', placeholder: 'Subject' },
                { id: 'aud', label: 'Audience', value: '', placeholder: 'Audience' }
            ],
            loading: false,
            errorMessage: null,
            authorizedSuccess: false
        };
    },
    methods: {
        async confirmAuthorize() {
            this.errorMessage = null;
            this.loading = true;
            const { jwksUrl, iss, sub, aud } = this.formFields.reduce((acc, field) => ({ ...acc, [field.id]: field.value }), {});

            try {
                const response = await client.mutate({ 
                    mutation: AUTHORIZE_JWT_BEARER, 
                    variables: { clientId: this.client.clientId, jwksUrl, iss, sub, aud }
                });

                if(response.data.authorizeJwtBearer.success) {
                    this.authorizedSuccess = true;
                    this.$emit('refreshClient', {});
                } else {
                    this.errorMessage = "Failed to add authorized JWT Bearer.";
                }
            } catch (error) {
                console.error("Error authorizing client:", error);
                this.errorMessage = error.message;
                this.$emit('error', error); // Notify parent component of error
            } finally {
                this.loading = false;
            }
        },
        resetData() {
            this.formFields.forEach(field => field.value = '');
            this.loading = false;
            this.errorMessage = null;
            this.authorizedSuccess = false;
        }
    }
};
</script>