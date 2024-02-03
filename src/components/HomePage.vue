<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h2>Home</h2>
            </div>
        </div>
    
    </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters(['isTokenSet']),
  },
}
</script>