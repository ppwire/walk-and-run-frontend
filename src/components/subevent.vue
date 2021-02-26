<template>
  <v-app>
    <v-card v-for="event in events" :key="event.eventid" class="homecard pa-4 mb-4">
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

      <v-card-actions>
        <v-row justify="end">
          <v-col md="1" sm="2">
            <v-btn color="error" @click="deleteEvent(event.eventid)">Delete</v-btn>
          </v-col>
          <v-col md="1" sm="2">
            <v-btn color="warning" @click="editEvent(event)">Edit</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Event Edit</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="eventtitle"
                    :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                    label="ชื่อ Event"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="eventdes"
                    :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                    label="คำอธิบาย Event"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="eventtype"
                    :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                    :items="['คูณ','เปอร์เซ็น','ปัดเศษ']"
                    label="ประเภท"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="eventvalue"
                    :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                    label="Value"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-date-picker v-model="eventdate"></v-date-picker>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false ; submitEdit()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      events: [],
      dialog: false,
      eventtitle: null,
      eventdes: null,
      eventtype: null,
      eventvalue: null,
      eventdate: new Date().toISOString().substr(0, 10),
      eventid: null
    };
  },

  methods: {
    async deleteEvent(contextid) {
      await axios
        .post("/admin/deleteevent", {
          eventid: contextid
        })
        .then(() => {
          this.$fire({
            title: "สำเร็จ",
            text: "ลบข้อมูลสำเร็จ",
            type: "success",
            timer: 3000
          });
          window.location.reload();
        })
        .catch(() => {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error",
            timer: 3000
          });
        });
    },
    async editEvent(context) {
      if (context.eventtype == "M") {
        this.eventtype = "คูณ";
      } else if (context.eventtype == "P") {
        this.eventtype = "เปอร์เซ็น";
      } else if (context.eventtype == "C") {
        this.eventtype = "ปัดเศษ";
      }
      this.eventtitle = context.eventtitle;
      this.eventdes = context.eventdes;
      this.eventid = context.eventid;
      this.eventvalue = context.eventvalue;
      this.eventdate = context.eventdate;
      this.dialog = true;
    },
    async submitEdit() {
      if (this.eventtype == "คูณ") {
        this.eventtype = "M";
      } else if (this.eventtype == "เปอร์เซ็น") {
        this.eventtype = "P";
      } else if (this.eventtype == "ปัดเศษ") {
        this.eventtype = "C";
      }

      await axios
        .post("/admin/updateevent", {
          eventtitle: this.eventtitle,
          eventdes: this.eventdes,
          eventtype: this.eventtype,
          eventvalue: this.eventvalue,
          eventdate: this.eventdate,
          eventid: this.eventid
        })
        .then(() => {
          this.$fire({
            title: "สำเร็จ",
            text: "แก้ไขข้อมูลสำเร็จ",
            type: "success",
            timer: 3000
          });
          window.location.reload();
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