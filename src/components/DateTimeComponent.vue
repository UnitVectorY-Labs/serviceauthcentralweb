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
  