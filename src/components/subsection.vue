<template>
  <v-app>
    <v-row class="cardsearch" v-show="showSection">
      <v-col cols="6">
        <h3 class="blue-grey--text textpadding">ปีการศึกษา</h3>
        <v-select v-model="selectedYear" :items="sectionyear"></v-select>
      </v-col>
      <v-col cosl="6">
        <h3 class="blue-grey--text textpadding">เทอม</h3>
        <v-select v-model="selectedSemester" :items="['1','2']"></v-select>
      </v-col>
    </v-row>

    <v-card v-for="section in filterSection" :key="section.sectionnumber" v-show="showSection">
      <v-layout row wrap>
        <v-flex>
          <strong class="blue-grey--text textpadding">เลขเซคชั่น</strong>
          <div class="textpadding">{{section.sectionnumber}}</div>
        </v-flex>
        <v-flex>
          <strong class="blue-grey--text">วันที่เรียน</strong>
          <div>{{section.sectionday}}</div>
        </v-flex>
        <v-flex>
          <strong class="blue-grey--text">เวลาเรียน</strong>
          <div>{{section.sectiontime}}</div>
        </v-flex>
        <v-btn @click="viewSection(section.sectionid)">View</v-btn>
      </v-layout>
    </v-card>

    <div v-show="showUser">
      <v-card v-for="user in users" :key="user.username">
        <v-layout row wrap>
          <v-avatar size="62">
            <img v-bind:src="user.userprofile" @click="viewProfile(user.userprofile)" />
          </v-avatar>
          <v-flex>
            <strong class="blue-grey--text textpadding">รหัสประจำตัว</strong>
            <div class="textpadding">{{user.usernumber}}</div>
          </v-flex>
          <v-flex>
            <strong class="blue-grey--text textpadding">ชื่อ</strong>
            <div class="textpadding">{{user.username}}</div>
          </v-flex>
          <v-flex>
            <strong class="blue-grey--text">นามสกุล</strong>
            <div>{{user.userlastname}}</div>
          </v-flex>
          <v-flex>
            <strong class="blue-grey--text">ภาควิชา</strong>
            <div>{{user.userdepartment}}</div>
          </v-flex>
          <v-btn @click="viewCulUserWork(user.userid); calSum();">สรุป</v-btn>
          <v-btn @click="viewUserWork(user.userid)">ดูรายละเอียด</v-btn>
        </v-layout>
      </v-card>
      <v-btn @click="backToSection()">Back</v-btn>
    </div>

    <div v-show="showWork">
      <v-card v-for="userwork in userworks" :key="userwork.workid">
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
      <v-btn @click="backToUser()">Back</v-btn>
    </div>

    <div v-show="showCulWork">
      <v-card max-width="auto">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th v-for="item in headers" :key="item.value">{{item.text}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="userworkcul in userworkculs" :key="userworkcul.name">
                <td>{{ userworkcul.userworkcounter }}</td>
                <td>{{ userworkcul.userworkdate }}</td>
                <td>{{ userworkcul.userworkdistance }}</td>
                <td>{{ userworkcul.userworktime }}</td>
                <td>{{ userworkcul.userworkpace }}</td>
                <td>{{ userworkcul.userworkcal }}</td>
                <td>{{ userworkcul.userworkstarttime }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>

      <v-card max-width="auto" class="cardsum">
        <v-row>
          <v-col>
            <strong class="blue-grey--text">ผลรวมระยะทาง (กิโลเมตร)</strong>
            <p>{{sumdistance}}</p>
          </v-col>
          <v-col>
            <strong class="blue-grey--text">ความเร็วเฉลี่ย (นาที/กิโลเมตร)</strong>
            <p>{{sumpace}}</p>
          </v-col>
          <v-col>
            <strong class="blue-grey--text">ผลรวมระยะเวลา (ชม:นาที:วินาที)</strong>
            <p>{{sumtime}}</p>
          </v-col>
          <v-col>
            <strong class="blue-grey--text">ผลรวมแคลลอรี่ (กิโลแคลลอรี่)</strong>
            <p>{{sumcal}}</p>
          </v-col>
        </v-row>
      </v-card>

      <v-btn @click="backToUser()">Back</v-btn>
    </div>
    <v-dialog v-model="showProfile" class="cardholderimg">
      <img v-bind:src="currentProfile" class="imgcard" />
    </v-dialog>

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
                  <v-text-field v-model="editdate" label="Date" readonly v-on="on"></v-text-field>
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
      Img: false,
      currentimg: null,
      sections: [],
      users: [],
      userworks: [],
      userworkculs: [],
      showUser: false,
      showWork: false,
      showSection: true,
      showCulWork: false,
      showProfile: false,
      currentProfile: null,
      headers: [
        { text: "ครั้งที่", value: "counter" },
        { text: "วันที่", value: "date" },
        { text: "ระยะทาง(กิโลเมตร)", value: "distance" },
        { text: "เวลา(ชั่วโมง)", value: "time" },
        { text: "ความเร็วเฉลี่ย(นาที/กิโลเมตร)", value: "speed" },
        { text: "พลังงานที่ใช้(กิโลแคลลอรี่)", value: "calorie" },
        { text: "เวลาเริ่ม", value: "statedtime" }
      ],
      sumdistance: 0,
      sumcal: 0,
      sumtime: null,
      sumpace: null,
      selectedYear: null,
      sectionyear: [],
      selectedSemester: null,
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      editworkdialog: false,
      editdistance: null,
      editcal: null,
      editpace: null,
      editstarttime: null,
      editdate: null,
      edittime: null,
      editid: null,
      editolddate: null
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
    backToSection() {
      this.showUser = false;
      this.showWork = false;
      this.showCulWork = false;
      this.showSection = true;
    },
    backToUser() {
      this.showWork = false;
      this.showSection = false;
      this.showCulWork = false;
      this.showUser = true;
    },

    async viewSection(text) {
      await axios
        .post("/admin/getuserbysection", {
          usersection: text
        })
        .then(response => {
          console.log(response.data);
          this.users = response.data.data;
          this.showSection = false;
          this.showUser = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async viewUserWork(text) {
      await axios
        .post("/usermanage/getuserworkbyid", {
          userid: text
        })
        .then(response => {
          console.log(response.data);
          this.userworks = response.data.data;
          this.showUser = false;
          this.showWork = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async viewCulUserWork(text) {
      await axios
        .post("/usermanage/getuserworkbyid", {
          userid: text
        })
        .then(response => {
          console.log(response.data);
          this.userworkculs = response.data.data;
          this.showUser = false;
          this.showWork = false;
          this.showCulWork = true;

          let i = 0;
          let temp_distance = 0;
          let temp_cal = 0;
          let timesplit;
          let pacesplit;
          let hour_time = 0;
          let minute_time = 0;
          let second_time = 0;
          let hour_pace = 0;
          let minute_pace = 0;
          let sum_pace;

          for (i = 0; i < this.userworkculs.length; i++) {
            //Sum distance
            temp_distance =
              temp_distance + parseFloat(this.userworkculs[i].userworkdistance);

            //Sum calrorie
            temp_cal = temp_cal + parseFloat(this.userworkculs[i].userworkcal);

            //Sum time
            timesplit = this.userworkculs[i].userworktime.split(":");
            hour_time = hour_time + parseInt(timesplit[0]);
            minute_time = minute_time + parseInt(timesplit[1]);
            second_time = second_time + parseInt(timesplit[2]);

            //Sum pace
            pacesplit = this.userworkculs[i].userworkpace.split(":");
            hour_pace = hour_pace + parseInt(pacesplit[0]);
            minute_pace = minute_pace + parseInt(pacesplit[1]);
          }

          //Cal time
          hour_time = hour_time + Math.floor(minute_time / 60);
          minute_time = minute_time % 60;
          minute_time = minute_time + Math.floor(second_time / 60);
          second_time = second_time % 60;

          if (minute_time < 10) {
            minute_time.toString;
            minute_time = "0" + minute_time;
          }

          if (second_time < 10) {
            second_time.toString;
            second_time = "0" + second_time;
          }
          hour_time.toString;

          //Cal Pace

          sum_pace = hour_pace * 60 + minute_pace;

          let templength = parseInt(this.userworkculs.length);
          let avg = Math.round(sum_pace / templength);

          let finalpacemin = Math.floor(avg / 60);
          let finalpacesec = avg % 60;

          if (finalpacesec < 10) {
            finalpacesec.toString;
            finalpacesec = "0" + finalpacesec;
          }

          finalpacemin.toString;

          console.log(finalpacemin + ":" + finalpacesec);
          console.log(hour_time + ":" + minute_time + ":" + second_time);
          this.sumpace = finalpacemin + ":" + finalpacesec;
          this.sumtime = hour_time + ":" + minute_time + ":" + second_time;
          (this.sumdistance = temp_distance.toPrecision(5)),
            (this.sumcal = temp_cal);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    viewProfile(url) {
      this.currentProfile = url;
      this.showProfile = true;
    },
    editwork(context) {
      this.editworkdialog = true;
      this.editcal = context.userworkcal;
      this.editpace = context.userworkpace;
      this.editstarttime = context.userworkstarttime;
      this.edittime = context.userworktime;
      this.editdistance = context.userworkdistance;
      this.editdate = context.userworkdate;
      this.editolddate = context.userworkdate;
      this.editid = context.userid;
    },
    ChangeDate() {
      this.editdate = this.date;
      this.menu = false;
    },
    async postEditwork() {
      await axios
        .post("/admin/updateuserworkbyadmin", {
          userworkcal: this.editcal,
          userworkdate: this.editdate,
          userworkstarttime: this.editstarttime,
          userworkdistance: this.editdistance,
          userworkpace: this.editpace,
          userworktime: this.edittime,
          userworkolddate: this.editolddate,
          userid: this.editid
        })
        .then(response => {
          console.log(response.data);
          this.editworkdialog = false;
          // window.location.reload();
          this.showWork = false;
          this.showSection = false;
          this.showCulWork = false;
          this.showUser = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },

  computed: {
    filterSection: function() {
      return this.sections.filter(sections => {
        return (
          sections.sectionyear == this.selectedYear &&
          sections.sectionsemester == this.selectedSemester
        );
      });
    }
  },

  created: async function() {
    await axios
      .post("/admin/getallsection", {})
      .then(response => {
        console.log(response.data.data);
        this.sections = response.data.data;
        this.showUser = false;
        this.showWork = false;
        this.showCulWork = false;
      })
      .catch(function(error) {
        console.log(error);
      });

    await axios
      .post("/admin/getallsectionbyyear", {})
      .then(response => {
        console.log("selected:year");
        console.log(response.data.data);
        let i = 0;
        while (i < response.data.data.length) {
          this.sectionyear.push(response.data.data[i].sectionyear);
          i++;
        }
        this.showUser = false;
        this.showWork = false;
        this.showCulWork = false;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<style scoped>
.textpadding {
  padding-left: 20px;
}

.cardsum {
  margin-top: 10%;
}

.cardsearch {
  max-height: 200px;
}

.imgcard {
  height: 60%;
  width: 60%;
}
</style>