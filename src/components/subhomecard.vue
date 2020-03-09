<template>
  <v-app>
    <v-card v-for="boarddata in boarddatas" :key="boarddata.boardid" class="homecard">
      <v-row justify="space-between">
        <v-col md="3">
          <strong class="blue-grey--text">หัวข้อ</strong>
          <div>{{boarddata.boardhead}}</div>
        </v-col>
        <v-col md="3">
          <strong class="blue-grey--text">Date</strong>
          <div>{{boarddata.boarddate}}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <strong class="blue-grey--text">Description</strong>
          <p>{{boarddata.boardtext}}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return { boarddatas: null };
  },

  created: async function() {
    console.log("Created");
    await axios
      .post("/admin/getallboard", {})
      .then(response => {
        console.log(response.data.data);
        this.boarddatas = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<style scoped>
  .homecard{
    margin-bottom: 5%
  }
</style>