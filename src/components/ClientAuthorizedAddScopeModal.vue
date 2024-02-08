<template>
    <div>

    </div>
</template>

<script>
import { gql } from '@apollo/client/core';
import client from '../apollo-client';

export default {
    props: {
        client: Object
    },
    emits: ['refreshClient'],
};
</script>
