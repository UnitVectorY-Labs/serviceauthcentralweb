<!--
 ~ Copyright 2024 the original author or authors.
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 ~ in compliance with the License. You may obtain a copy of the License at
 ~
 ~ https://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software distributed under the License
 ~ is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 ~ or implied. See the License for the specific language governing permissions and limitations under
 ~ the License.
 ~ 
 ~ @author Jared Hatfield (UnitVectorY Labs)
-->
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
