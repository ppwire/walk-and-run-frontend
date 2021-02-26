<template>
  <v-app>
    <div>
      <v-row v-show="showSection">
        <v-col cols="6">
          <h3 class="blue-grey--text textpadding">ปีการศึกษา</h3>
          <v-select v-model="selectedYear" :items="sectionyear" class="ml-5 mr-7"></v-select>
        </v-col>
        <v-col cols="6">
          <h3 class="blue-grey--text textpadding">เทอม</h3>
          <v-select v-model="selectedSemester" :items="['1','2']" class="mr-4 ml-4"></v-select>
        </v-col>
      </v-row>
    </div>
    <v-divider class="mx-4 blue" v-show="showSection"></v-divider>
    <div
      v-for="section in filterSection"
      :key="section.sectionnumber"
      v-show="showSection"
      class="homecard text-center mb-1"
    >
      <v-divider class="mx-4"></v-divider>
      <v-row>
        <v-col cols="3">
          <strong class="blue-grey--text textpadding">เลขเซคชั่น</strong>
          <div class="textpadding">{{section.sectionnumber}}</div>
        </v-col>

        <v-col cols="3">
          <strong class="blue-grey--text">วันที่เรียน</strong>
          <div>{{section.sectionday}}</div>
        </v-col>

        <v-col cols="3">
          <strong class="blue-grey--text">เวลาเรียน</strong>
          <div>{{section.sectiontime}}</div>
        </v-col>

        <v-col cols="2">
          <v-btn text color="blue" @click="viewSection(section.sectionid)">View</v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-show="showUser">
      <v-btn class="ma-2" color="blue" text @click="backToSection()">
        <v-icon dark left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <div v-for="user in users" :key="user.username" class="homecard ma-3 ml-6">
        <v-divider class="mx mb-1 mt-1"></v-divider>
        <v-row>
          <v-col cols="6" md="1">
            <v-avatar size="45">
              <img v-bind:src="user.userprofile" @click="viewProfile(user.userprofile)" />
            </v-avatar>
          </v-col>
          <v-col cols="6" md="2">
            <strong class="blue-grey--text">รหัสประจำตัว</strong>
            <div class>{{user.usernumber}}</div>
          </v-col>
          <v-col cols="6" md="2">
            <strong class="blue-grey--text">ชื่อ</strong>
            <div class>{{user.username}}</div>
          </v-col>
          <v-col cols="6" md="2">
            <strong class="blue-grey--text">นามสกุล</strong>
            <div>{{user.userlastname}}</div>
          </v-col>
          <v-col cols="4" md="2">
            <strong class="blue-grey--text">ภาควิชา</strong>
            <div>{{user.userdepartment}}</div>
          </v-col>
          <v-col cols="4" md="1">
            <v-btn color="blue" text @click="viewCulUserWork(user.userid); calSum();">สรุป</v-btn>
          </v-col>
          <v-col cols="4" md="1">
            <v-btn color="blue" text @click="viewUserWork(user.userid)">ดูรายละเอียด</v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

    <div v-show="showWork">
      <v-btn class="ma-2 mb-2" color="blue" text @click="backToUser()">
        <v-icon dark left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-card v-for="userwork in userworks" :key="userwork.workid" class="workcard pa-1 mb-10">
        <v-row>
          <v-col cols="12" md="3">
            <v-img v-bind:src="userwork.userworkurl"></v-img>
          </v-col>
          <v-col cols="12" md="9" mg="3" class="pa-6">
            <v-divider class="mx-4 d-md-none"></v-divider>
            <v-row>
              <v-col cols="12" md="12">
                <div class="text-center text-md-left">
                  <strong class="blue-grey--text">ครั้งที่</strong>
                  <div class="border-style: solid">{{userwork.userworkcounter}}</div>
                </div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Distance</strong>
                <div>{{userwork.userworkdistance}}</div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Calorie</strong>
                <div>{{userwork.userworkcal}}</div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Pace</strong>
                <div>{{userwork.userworkpace}}</div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Date</strong>
                <div>{{userwork.userworkdate}}</div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Time</strong>
                <div>{{userwork.userworktime}}</div>
              </v-col>
              <v-col cols="4" md="4">
                <strong class="blue-grey--text">Started Time</strong>
                <div>{{userwork.userworkstarttime}}</div>
              </v-col>
              <v-col cols="9" md="12">
                <v-btn
                  outlined
                  color="light-blue"
                  @click="showImg(userwork.userworkurlextra)"
                >Check Additional Image</v-btn>
              </v-col>
              <v-col cols="3" md="12">
                <v-btn outlined color="light-blue" @click="editwork(userwork)">Edit</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div v-show="showCulWork">
      <v-btn class="ma-2" color="blue" text @click="backToUser()">
        <v-icon dark left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-divider class="mx-4"></v-divider>
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

      <v-card max-width="auto" class="cardsum text-center pa-3">
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <strong class="blue-grey--text">ผลรวมระยะทาง (กิโลเมตร)</strong>
                <p>{{sumdistance}}</p>
              </v-col>
              <v-col>
                <strong class="blue-grey--text">ความเร็วเฉลี่ย (นาที/กิโลเมตร)</strong>
                <p>{{sumpace}}</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <strong class="blue-grey--text">ผลรวมระยะเวลา (ชม:นาที:วินาที)</strong>
                <p>{{sumtime}}</p>
              </v-col>
              <v-col>
                <strong class="blue-grey--text">ผลรวมแคลลอรี่ (กิโลแคลลอรี่)</strong>
                <p>{{sumcal}}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-dialog v-model="showProfile" class="cardholderimg" max-width="600px">
      <img v-bind:src="currentProfile" />
    </v-dialog>

    <v-dialog v-model="Img" max-width="500px">
      <v-img v-bind:src="currentimg"></v-img>
    </v-dialog>

    <v-dialog v-model="editworkdialog">
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h2>แก้ไข</h2>
            </v-col>
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
            <v-spacer></v-spacer>
            <v-btn text color="light-blue" @click="editworkdialog=false">Close</v-btn>
            <v-btn text color="light-blue" @click="postEditwork">Submit</v-btn>
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
      this.$store.commit("switchSectionOn");
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
          this.$store.commit("switchSectionOff");
          this.users = response.data.data;
          this.showSection = false;
          this.showUser = true;
        })
        .catch(function() {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error",
            timer: 3000
          });
        });
    },
    async viewUserWork(text) {
      await axios
        .post("/usermanage/getuserworkbyid", {
          userid: text
        })
        .then(response => {
          this.userworks = response.data.data;
          this.showUser = false;
          this.showWork = true;
        })
        .catch(function() {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error",
            timer: 3000
          });
        });
    },
    async viewCulUserWork(text) {
      await axios
        .post("/usermanage/getuserworkbyid", {
          userid: text
        })
        .then(response => {
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

          this.sumpace = finalpacemin + ":" + finalpacesec;
          this.sumtime = hour_time + ":" + minute_time + ":" + second_time;
          (this.sumdistance = temp_distance.toPrecision(5)),
            (this.sumcal = temp_cal);
        })
        .catch(function() {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error",
            timer: 3000
          });
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
        .then(() => {
          this.editworkdialog = false;
          // window.location.reload();
          this.showWork = false;
          this.showSection = false;
          this.showCulWork = false;
          this.showUser = true;
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
        this.sections = response.data.data;
        this.showUser = false;
        this.showWork = false;
        this.showCulWork = false;
      })
      .catch(function() {
        this.$fire({
          title: "Error",
          text: "เกิดข้อผิดพลาด",
          type: "error",
          timer: 3000
        });
      });

    await axios
      .post("/admin/getallsectionbyyear", {})
      .then(response => {
        let i = 0;
        while (i < response.data.data.length) {
          this.sectionyear.push(response.data.data[i].sectionyear);
          i++;
        }
        this.showUser = false;
        this.showWork = false;
        this.showCulWork = false;
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
.textpadding {
  padding-left: 20px;
}

.cardsum {
  margin-top: 10%;
}

.cardsearch {
}

.imgcard {
  height: 60%;
  width: 60%;
}
</style>