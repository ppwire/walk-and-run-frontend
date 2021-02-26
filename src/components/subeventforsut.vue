<template>
  <v-app>
    <v-card v-for="event in events" :key="event.eventid" class="homecard pa-4 mb-10">
      <v-row>
        <v-col cols="10">
          <strong class="blue-grey--text">Event Title</strong>
          <div>{{event.eventtitle}}</div>
        </v-col>
        <v-col cols="11">
          <strong class="blue-grey--text">Description</strong>
          <p>{{event.eventdes}}</p>
        </v-col>
        <v-col cols="4">
          <strong class="blue-grey--text">Date</strong>
          <div>{{event.eventdate}}</div>
        </v-col>
        <v-col cols="4">
          <strong class="blue-grey--text">Type</strong>
          <div v-if="event.eventtype == 'M'">คูณ</div>
          <div v-if="event.eventtype == 'P'">เปอร์เซ็น</div>
          <div v-if="event.eventtype == 'C'">ปัดเศษ</div>
        </v-col>
        <v-col cols="4">
          <strong class="blue-grey--text">Value</strong>
          <p>{{event.eventvalue}}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import axios from "axios";
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
        this.events = response.data.data;
      })
      .catch(function() {
        this.$fire({
          title: "Error",
          text: "เกิดข้อผิดพลาด",
          type: "error",
          timer: 3000
        });
      });
  }
};
</script>

<style scoped>
.eventcard {
  margin-bottom: 5%;
}

.subcard {
  padding-left: 20px;
}
</style>