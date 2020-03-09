<template>
  <v-app>
    <v-card v-for="event in events" :key="event.eventid" class="eventcard">
      <v-row justify="space-between">
        <v-col md="3" class="subcard">
          <strong class="blue-grey--text">Event Title</strong>
          <div>{{event.eventtitle}}</div>
        </v-col>
        <v-col md="3" >
          <strong class="blue-grey--text">Date</strong>
          <div>{{event.eventdate}}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12" class="subcard">
          <strong class="blue-grey--text">Description</strong>
          <p>{{event.eventdes}}</p>
        </v-col>
        <v-col md="2" class="subcard">
          <strong class="blue-grey--text">Type</strong>
          <div v-if="event.eventtype == 'M'">คูณ</div>
          <div v-if="event.eventtype == 'P'">เปอร์เซ็น</div>
        </v-col>
        <v-col md="2">
          <strong class="blue-grey--text">Value</strong>
          <p>{{event.eventvalue}}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      events: []
    };
  },
  created: async function() {
    await axios
      .post("/admin/getallevent", {})
      .then(response => {
        console.log(response.data.data);
        this.events = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<style scoped>
  .eventcard{
    margin-bottom: 5% 
  }

  .subcard{
    padding-left: 20px
  }
</style>