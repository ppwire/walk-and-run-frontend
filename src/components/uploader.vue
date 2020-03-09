<template>
  <v-app>
    <v-card min-height="100vh" max-height="auto">
      <v-row>
        <v-col md="2"></v-col>
        <v-col md="9">
          <v-card max-width="auto">
            <v-card-title>Uploader</v-card-title>
            <v-container>
              <v-progress-linear
                color="light-blue"
                height="10"
                striped
                indeterminate
                v-show="loading"
              ></v-progress-linear>
              <input type="file" @change="onFileSelected" class="v-btn" />
              <v-btn @click="onUpload" :disabled="this.clicked_upload == false">Upload</v-btn>
            </v-container>

            <v-row>
              <v-col md="5">
                <img v-bind:src="imageUrl" class="imgcrop" />
              </v-col>
              <v-col md="7">
                <v-row>
                  <v-col md="12">
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
                        label="Pace"
                        solo
                        v-model="dataimgpack.pacedata"
                        :rules="[v => !!v || 'Pace is required', v=> !isNaN(parseFloat(v)) || 'กรุณากรอกตัวเลข']"
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

                      <v-btn @click="edit_submit = true">Edit</v-btn>
                      <v-btn @click="showupload = true">Upload Addtional</v-btn>
                    </v-form>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="6">
                    <v-btn @click="sendImage" :disabled="clicked_submit == false">Submit</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>


    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-text>Upload Success</v-card-text>
        <v-card-actions>
          <v-btn @click="close">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showupload" persistent max-width="290">
      <v-card>
        <h3>Upload your addtional file</h3>
        <input type="file" @change="onFileSelected_Add" class="v-btn" />
        <v-progress-linear
          color="light-blue"
          height="10"
          striped
          indeterminate
          v-show="loading_add"
        ></v-progress-linear>
        <v-btn @click="onUpload_II" :disabled="this.clicked_upload_II == false">Upload</v-btn>
        <img v-bind:src="imageUrl_II" class="imgcrop" />
      </v-card>

      <v-btn @click="showupload = false">close</v-btn>
    </v-dialog>
  </v-app>
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
      days:['00','01','02','03','04','05','06','07','08','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
      months:['00','01','02','03','04','05','06','07','08','10','11','12'],
      years:['2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030'],
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
      console.log(event.target.files[0]);
      const fileReader = new FileReader();
      await fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      await fileReader.readAsDataURL(event.target.files[0]);

      this.selectedFile = this.imageUrl;
    },
    async onFileSelected_Add(event) {
      this.clicked_upload_II = true;
      console.log(event.target.files[0]);
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
          console.log(response);
          this.dialog = true;
          this.imageCloudUrl = response.data.file;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
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
          console.log(response);
          this.imageCloudUrl_II = response.data.file;
          this.loading_add = false;
        })
        .catch(error => {
          console.log(error);
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
        console.log(this.imageCloudUrl);
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
          .catch(function(error) {
            console.log(error);
          });
      } else {
        console.log("invalid");
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
        console.log("valid");
        console.log(this.dataimgpack);
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
          .then(function(response) {
            console.log(response);
            window.location.reload();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        console.log("invalid form");
      }
    },
    async gettable() {
      await axios
        .post("/usermanage/getuserallwork", {})
        .then(response => {
          console.log(response.data);
          this.$store.commit("getTable", response.data.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
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