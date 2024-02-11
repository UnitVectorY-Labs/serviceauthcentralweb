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
  <div class="d-inline-block custom-condensed">{{ formattedDate }}</div>
</template>

<style>
.custom-condensed {
  letter-spacing: -0.05em;
}
</style>

<script>
import { parseISO } from 'date-fns';

export default {
  props: ['date'],
  computed: {
    formattedDate() {
      // Defensive statement to protect this if the date is null
      if (this.date == null) {
        return '';
      }

      const dateObj = parseISO(this.date);
      const formatter = new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      });
      return formatter.format(dateObj);
    },
  },
};
</script>
