<template>
<v-col>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <event :key="componentkey"></event>
    </v-col>
  </v-row>
  </v-col>
</template>

<script>
import SubEventforstu from "./subeventforsut.vue";
export default {
  components: {
    event: SubEventforstu
  },
  data() {
    return {
      componentkey: 0
    };
  }
};
</script>

