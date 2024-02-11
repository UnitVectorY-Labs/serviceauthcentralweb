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
  <div>
    <LoadingComponent />
  </div>
</template>

<script>
import { exchangeToken } from '@/services/authService.js';

export default {
  name: 'CallbackView',
  async mounted() {
    try {
      const token = await exchangeToken();
      console.log('Token:', token);
      // Navigate to another route or update state as necessary
      // Make sure token isn't stored in history
      this.$router.replace('/clients');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }
  },
};
</script>
