<template>
  <div
    class="modal fade"
    id="clientDeauthorizeModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="clientDeauthorizeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientDeauthorizeModalLabel">Deauthorize Client Confirmation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-else class="alert alert-danger" role="alert">
            Are you sure you want to deauthorize the client
            <span class="text-primary fw-bold">{{ client.clientId }}</span> access to
            <span class="text-primary fw-bold">{{ deauthorizedSubject }}</span
            >?
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="loading"
            data-bs-dismiss="modal"
            @click="confirmDeauthorize"
          >
            Confirm Deauthorize
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '@/services/apollo-client';

const DEAUTHORIZE_CLIENT = gql`
  mutation Deauthorize($subject: String!, $audience: String!) {
    deauthorize(subject: $subject, audience: $audience) {
      success
    }
  }
`;

export default {
  props: {
    client: Object,
  },
  data() {
    return {
      deauthorizedSubject: null,
      loading: false,
      errorMessage: null,
      deauthorizedSuccess: false,
    };
  },
  methods: {
    setDeauthorizedSubject(deauthorizedSubject) {
      this.deauthorizedSubject = deauthorizedSubject;
      this.loading = false;
      this.errorMessage = null;
      this.deauthorizedSuccess = false;
    },
    async confirmDeauthorize() {
      this.loading = true;
      try {
        const response = await client.mutate({
          mutation: DEAUTHORIZE_CLIENT,
          variables: {
            subject: this.deauthorizedSubject,
            audience: this.client.clientId,
          },
        });

        if (response.data.deauthorize.success) {
          this.deauthorizedSuccess = true;
          this.$emit('refreshClient');
        } else {
          this.errorMessage = 'Failed to deauthorize client.';
        }
      } catch (error) {
        console.error('Error deauthorizing client:', error);
        this.$emit('error', error);
        this.errorMessage = 'An error occurred during deauthorization.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
