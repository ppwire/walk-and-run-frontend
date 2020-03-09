<template>
  <v-app>
    <v-card min-height="100vh" max-height="auto">
      <v-row>
        <v-col md="2"></v-col>
        <v-col md="9">
          <v-card v-for="userwork in userworks" :key="userwork.workid" class="workcard">
            <v-row>
              <v-col md="4">
                <v-img v-bind:src="userwork.userworkurl"></v-img>
              </v-col>
              <v-col md="8">
                <v-row>
                  <v-col md="6">
                    <strong class="blue-grey--text">ครั้งที่</strong>
                    <div>{{userwork.userworkcounter}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Distance</strong>
                    <div>{{userwork.userworkdistance}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Date</strong>
                    <div>{{userwork.userworkdate}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Calorie</strong>
                    <div>{{userwork.userworkcal}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Pace</strong>
                    <div>{{userwork.userworkpace}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Time</strong>
                    <div>{{userwork.userworktime}}</div>
                  </v-col>
                  <v-col md="6">
                    <strong class="blue-grey--text">Started Time</strong>
                    <div>{{userwork.userworkstarttime}}</div>
                  </v-col>
                  <v-col md="6">
                    <v-btn @click="showImg(userwork.userworkurlextra)">Check Additional Image</v-btn>
                    <v-btn @click="editwork(userwork)">Edit</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="Img">
      <v-img v-bind:src="currentimg"></v-img>
    </v-dialog>

    <v-dialog v-model="editworkdialog">
      <v-card>
        <v-card-title>แก้ไข</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="6">
              <h3>ระยะทาง</h3>
              <v-text-field
                v-model="editdistance"
                label="ระยะทาง"
                solo
                :rules="[v => !!v || 'กรุณากรอกระยะทาง',v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <h3>ระยะเวลา</h3>
              <v-text-field
                label="Time"
                solo
                v-model="edittime"
                :rules="[v => !!v || 'Time is required',v => /.+:.+:.+/.test(v) || 'กรุณากรอกเวลาให้ถูกต้อง !!ตัวอย่าง 1:59:40!!']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <h3>ฝีเท้าเฉลี่ย(Pace)</h3>
              <v-text-field
                label="Pace"
                solo
                v-model="editpace"
                :rules="[v => !!v || 'Pace is required', v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <h3>แคลอรี่</h3>
              <v-text-field
                label="Calorie"
                solo
                v-model="editcal"
                :rules="[v => !!v || 'กรุณากรอกแคลอรี่',
                        v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <h3>เวลาเริ่ม</h3>
              <v-text-field
                label="Time Started : Example => 11:12"
                solo
                v-model="editstarttime"
                :rules="[v => !!v || 'Time Started is required',
                        v => /.+:.+/.test(v) || 'Time must be valid']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="editdate"
                    label="Date"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="ChangeDate">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn @click="editworkdialog=false">Close</v-btn>
            <v-btn @click="postEditwork">Submit</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      menu:false,
      date: new Date().toISOString().substr(0, 10),
      editworkdialog: false,
      userworks: null,
      currentimg: null,
      Img: false,
      editdistance: null,
      editcal: null,
      editpace: null,
      editstarttime: null,
      editdate: null,
      edittime: null,
       editolddate:null
    };
  },
  methods: {
    showImg(img) {
      this.Img = true;
      this.currentimg = img;
    },
    hideImg() {
      this.Img = false;
    },
    editwork(context) {
      this.editworkdialog = true;
      this.editcal = context.userworkcal;
      this.editpace = context.userworkpace;
      this.editstarttime = context.userworkstarttime;
      this.edittime = context.userworktime;
      this.editdistance = context.userworkdistance;
      this.editdate = context.userworkdate;
      this.editolddate = context.userworkdate
    },
    ChangeDate(){
      this.editdate = this.date
      this.menu = false
    },
    async postEditwork(){
      await axios
      .post("/usermanage/updateuserwork", {
        userworkcal:this.editcal,
        userworkdate:this.editdate,
        userworkstarttime:this.editstarttime,
        userworkdistance:this.editdistance,
        userworkpace:this.editpace,
        userworktime:this.edittime,
        userworkolddate:this.editolddate,
      })
      .then(response => {
        console.log(response.data);
        this.editworkdialog = false;
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  },

  created: async function() {
    axios.defaults.headers.post[
      "authorization"
    ] = `Bearer ${this.$store.getters.token}`;
    await axios
      .post("/usermanage/getuserworkbytoken", {})
      .then(response => {
        console.log(response.data.data);
        this.userworks = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<style scoped>
.workcard {
  margin-bottom: 5%;
}
</style>