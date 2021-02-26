<template>
  <v-col>
    <v-row justify="center">
      <v-card class="col-11 col-md-8">
        <v-card-title>Uploader</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="9">
                <v-progress-linear
                  color="light-blue"
                  height="10"
                  striped
                  indeterminate
                  v-show="loading"
                ></v-progress-linear>
                <input type="file" @change="onFileSelected" class="v-btn"  accept="image/*"/>
              </v-col>
              <v-col cols="3">
                <v-btn
                  outlined
                  color="light-blue"
                  @click="onUpload"
                  :disabled="this.clicked_upload == false || validateapp == false"
                >Upload</v-btn>
              </v-col>
              <v-col cols="12">
                <img v-bind:src="imageUrl" class="imgcrop" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-form v-model="valid" ref="form" v-show="showoption">
                  <h3>แอปที่ใช้</h3>
                  <v-select
                    v-model="app_selected"
                    label="App"
                    :items="['Endomondo[ไทย]','Endomondo[Eng]','Running','Nike Run Club','Strava','Samsung']"
                  ></v-select>

                  <h3>ระยะเวลา</h3>
                  <v-text-field
                    label="Time"
                    solo
                    v-model="dataimgpack.timedata"
                    :rules="[v => !!v || 'Time is required',v => /.+:.+:.+/.test(v) || 'กรุณากรอกเวลาให้ถูกต้อง !!ตัวอย่าง 1:59:40!!']"
                    filled
                    :disabled="edit_submit == false"
                  ></v-text-field>
                  <h3>ระยะทาง</h3>
                  <v-text-field
                    label="Distance"
                    solo
                    v-model="dataimgpack.distancedata"
                    :rules="[v => !!v || 'Distance is required',v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
                    filled
                    :disabled="edit_submit == false"
                  ></v-text-field>
                  <h3>ฝีเท้าเฉลี่ย(Pace)</h3>
                  <v-text-field
                    label="Pace : Example => 10:20"
                    solo
                    v-model="dataimgpack.pacedata"
                    :rules="[v => !!v || 'Pace is required', v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข' , v => /.+:.+/.test(v) || 'กรุณากรอกฟอร์มให้ถูกต้อง']"
                    filled
                    :disabled="edit_submit == false"
                  ></v-text-field>

                  <h3>แคลอรี่</h3>
                  <v-text-field
                    label="Calorie"
                    solo
                    v-model="dataimgpack.caloriedata"
                    :rules="[v => !!v || 'กรุณากรอกแคลอรี่',
                        v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
                    filled
                    :disabled="edit_submit == false"
                  ></v-text-field>

                  <h3>เวลาเริ่ม</h3>
                  <v-text-field
                    label="Time Started : Example => 11:12"
                    solo
                    v-model="dataimgpack.timestart"
                    :rules="[v => !!v || 'Time Started is required',
                        v => /.+:.+/.test(v) || 'Time must be valid']"
                    filled
                    :disabled="edit_submit == false"
                  ></v-text-field>

                  <h3>วันที่</h3>
                  <v-select
                    label="Day"
                    solo
                    :items="days"
                    v-model="dataimgpack.datedata_day"
                    :rules="[v => !!v || 'Day is required']"
                    :disabled="edit_submit == false"
                  ></v-select>
                  <v-select
                    label="Month"
                    solo
                    :items="months"
                    v-model="dataimgpack.datedata_month"
                    :rules="[v => !!v || 'Month is required']"
                    :disabled="edit_submit == false"
                  ></v-select>

                  <v-select
                    label="Year"
                    solo
                    :items="years"
                    v-model="dataimgpack.datedata_year"
                    :rules="[v => !!v || 'Year is required']"
                    :disabled="edit_submit == false"
                  ></v-select>
                  <v-row>
                    <v-col cols="3">
                      <v-btn outlined color="light-blue" @click="edit_submit = true">Edit</v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn outlined color="light-blue" @click="showupload = true">Upload Addtional</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-btn
                  outlined
                  color="light-blue"
                  @click="sendImage"
                  :disabled="clicked_submit == false"
                >Submit</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-dialog v-model="dialog" persistent max-width="200px">
        <v-card class="pa-3">
          <v-row justify="center">
            <h3>Upload Success</h3>
            <v-card-actions>
              <v-btn outlined color="light-blue" @click="close">Ok</v-btn>
            </v-card-actions>
          </v-row>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showupload" persistent max-width="500px">
        <v-card class="pa-3">
          <h3>Upload your addtional file</h3>
          <v-row>
            <v-col cols="8">
              <input
                type="file"
                outlined
                color="light-blue"
                @change="onFileSelected_Add"
                class="v-btn"
                accept="image/*"
              />
              <v-progress-linear
                color="light-blue"
                height="10"
                striped
                indeterminate
                v-show="loading_add"
              ></v-progress-linear>
            </v-col>
            <v-col cols="4">
              <v-btn
                outlined
                color="light-blue"
                @click="onUpload_II"
                :disabled="this.clicked_upload_II == false"
              >Upload</v-btn>
            </v-col>
            <v-col cols="12">
              <v-spacer></v-spacer>
              <img v-bind:src="imageUrl_II" class="imgcrop" />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="light-blue" @click="showupload = false">close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showupload: false,
      clicked_upload: false,
      clicked_upload_II: false,
      clicked_submit: false,
      edit_submit: false,
      timepick: false,
      selectedFile: "",
      image: null,
      imageUrl: "",
      imageUrl_II: "",
      imageCloudUrl: null,
      imageCloudUrl_II: null,
      dialog: false,
      valid: false,
      days: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31"
      ],
      months: [
        
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "09",
        "08",
        "10",
        "11",
        "12"
      ],
      years: [
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026",
        "2027",
        "2028",
        "2029",
        "2030"
      ],
      dataimgpack: {
        timestart: null,
        timedata: null,
        distancedata: null,
        pacedata: null,
        caloriedata: null,
        datedata_day: null,
        datedata_month: null,
        datedata_year: null
      },
      showoption: true,
      loading: false,
      loading_add: false,
      app_selected: null
    };
  },

  methods: {
    async onFileSelected(event) {
      this.clicked_upload = true;

      const fileReader = new FileReader();
      await fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      await fileReader.readAsDataURL(event.target.files[0]);

      this.selectedFile = this.imageUrl;
    },
    async onFileSelected_Add(event) {
      this.clicked_upload_II = true;

      const fileReader = new FileReader();
      await fileReader.addEventListener("load", () => {
        this.imageUrl_II = fileReader.result;
      });
      await fileReader.readAsDataURL(event.target.files[0]);
    },
    async onUpload() {
      this.clicked_upload = false;
      this.loading = true;
      await axios
        .post("/usermanage/insertimguser", {
          file: this.imageUrl
        })
        .then(response => {
          this.dialog = true;
          this.imageCloudUrl = response.data.file;
          this.loading = false;
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
    async onUpload_II() {
      this.clicked_upload_II = false;
      this.loading_add = true;
      await axios
        .post("/usermanage/insertimguser", {
          file: this.imageUrl_II
        })
        .then(response => {
          this.imageCloudUrl_II = response.data.file;
          this.loading_add = false;
          this.$fire({
              title: "อัพเดต",
              text: "อัปโหลดสำเร็จ",
              type: "success",
              timer: 3000
            });
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
    async close() {
      this.dialog = false;
      this.loading = true;
      let apiendpoint;

      switch (this.app_selected) {
        case "Endomondo[ไทย]":
          apiendpoint = "/usermanage/ocruserwork";
          break;
        case "Endomondo[Eng]":
          apiendpoint = "/usermanage/ocruserwork";
          break;
        case "Running":
          apiendpoint = "/usermanage/ocrrunning";
          break;
        case "Nike Run Club":
          apiendpoint = "/usermanage/ocrnike";
          break;
        case "Strava":
          apiendpoint = "/usermanage/ocrstrava";
          break;
        case "Samsung":
          apiendpoint = "/usermanage/ocrsamsung";
          break;
        default:
          break;
      }

      if (this.imageCloudUrl != null) {
        await axios
          .post(apiendpoint, {
            appselected: this.app_selected,
            url: this.imageCloudUrl
          })
          .then(response => {
            this.showoption = true;
            this.dataimgpack.timedata = response.data.time;
            this.dataimgpack.distancedata = response.data.distance;
            this.dataimgpack.pacedata = response.data.pace;
            this.dataimgpack.caloriedata = response.data.calorie;
            this.dataimgpack.timestart = response.data.starttime;
            this.dataimgpack.datedata_day = response.data.day;
            this.dataimgpack.datedata_month = response.data.month;
            this.dataimgpack.datedata_year = response.data.year;
            this.loading = false;
            this.clicked_submit = true;
          })
          .catch(() => {
            
            this.$fire({
              title: "Error",
              text: "เกิดข้อผิดพลาด",
              type: "error",
              timer: 3000
            });
          });
      } else {
        this.$fire({
          title: "Error",
          text: "เกิดข้อผิดพลาด",
          type: "error",
          timer: 3000
        });
      }
    },
    async sendImage() {
      this.clicked_submit = false;

      let date =
        this.dataimgpack.datedata_year +
        "-" +
        this.dataimgpack.datedata_month +
        "-" +
        this.dataimgpack.datedata_day;

      axios.defaults.headers.post[
        "authorization"
      ] = `Bearer ${this.$store.getters.token}`;
      if (this.$refs.form.validate()) {
        await axios
          .post("/usermanage/commituserwork", {
            userworkcal: this.dataimgpack.caloriedata,
            userworktime: this.dataimgpack.timedata,
            userworkurl: this.imageCloudUrl,
            userworkpace: this.dataimgpack.pacedata,
            userworkdistance: this.dataimgpack.distancedata,
            userworkdate: date,
            userworkstarttime: this.dataimgpack.timestart,
            userworkurlextra: this.imageCloudUrl_II
          })
          .then(function() {
            window.location.reload();
          })
          .catch(() => {
            this.clicked_submit = true;
            this.$fire({
              title: "Error",
              text: "เกิดข้อผิดพลาด โปรดติดต่อผู้ดูแลระบบ",
              type: "error",
              timer: 3000
            });
          });
      } else {
         this.clicked_submit = true;
        this.$fire({
          title: "Error",
          text: "เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูล",
          type: "error",
          timer: 3000
        });
      }
    },
    async gettable() {
      await axios
        .post("/usermanage/getuserallwork", {})
        .then(response => {
          this.$store.commit("getTable", response.data.data);
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
    validateapp(){
      if(this.app_selected == null ){
        return false
      }else{
        return true
      }
    }
  },
};
</script>

<style scoped>
.imgcrop {
  max-width: 100%;
  max-height: 100%;
}

.pickerdate {
  border-radius: 2%;
}
</style>