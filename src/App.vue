<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <MyHeader />
    <router-view class="flex-grow-1"></router-view>
    <MyFooter />
  </div>
</template>

<script>
import MyHeader from '@/components/layout/MyHeader.vue';
import MyFooter from '@/components/layout/MyFooter.vue';

export default {
  name: 'ServiceAuthCentral',
  components: {
    MyHeader,
    MyFooter,
  },
};
</script>

<style>
.flex-grow-1 {
  flex-grow: 1;
}
</style>
