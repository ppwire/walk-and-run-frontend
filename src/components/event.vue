<template>
  <v-app>
    <v-card min-height="100vh" max-height="auto">
      <v-row>
        <v-col md="2"></v-col>
        <v-col md="9">
          <subevent :key='componentkey'></subevent>
        </v-col>
      </v-row>
      <v-row>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Add Event</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Event Register</span>
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
                        <v-text-field
                        v-model="eventdes"
                          height="200"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="คำอธิบาย Event"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                        v-model="eventtype"
                          
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['คูณ','เปอร์เซ็น','ปัดเศษ']"
                          label="ประเภท"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
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
                <v-btn color="blue darken-1" text @click="dialog = false ; submitEvent()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import axios from "axios";
import subEvent from './subevent.vue'
export default {
  components:{
    subevent : subEvent
  },
  data: () => ({
    componentkey:0,
    dialog: false,
    eventtitle: null,
    eventdes: null,
    eventtype: null,
    eventvalue: null,
    eventdate: new Date().toISOString().substr(0, 10),
    valid: false
  }),
  methods: {
    async submitEvent() {

      if(this.eventtype == 'คูณ'){
        this.eventtype = 'M'
      }else if (this.eventtype == 'เปอร์เซ็น'){
        this.eventtype = 'P'
      }else if (this.eventtype == 'ปัดเศษ'){
        this.eventtype = 'C'
      }
      

      await axios
        .post("/admin/insertevent", {
          eventtitle:this.eventtitle,
          eventdes:this.eventdes,
          eventtype:this.eventtype,
          eventvalue:this.eventvalue,
          eventdate:this.eventdate
        })
        .then(response => {
          console.log(response.data.data);
          this.events = response.data.data;
          this.componentkey++
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

