<template>
  <v-app>
    <homenav></homenav>
  </v-app>
</template>

<script>
import Homenav from "../components/homenav.vue";
export default {
  data() {
    return {
        test: ""
    };
  },
  components: {
    homenav: Homenav
  }
};
</script>

<style scoped>
</style>