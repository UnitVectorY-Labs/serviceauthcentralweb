<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <MyHeader />
    <router-view class="flex-grow-1"></router-view>
    <MyFooter />
  </div>
</template>

<script>
export default {
  name: 'ServiceAuthCentral',
}
</script>

<style>
  .flex-grow-1 {
    flex-grow: 1;
  }
</style>
