<template>
    <div class="modal fade" id="clientAddAvailableScopeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="clientAddAvailableScopeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clientAddAvailableScopeModalLabel">Add Available Scope</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        TODO IMPLEMENT
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { gql } from '@apollo/client/core';
// import client from '../apollo-client';



export default {
    props: {
        client: Object
    },
    data() {
        return {

            loading: false,
            errorMessage: null,
            authorizedSuccess: false
        };
    },
    methods: {
    }
};
</script>
