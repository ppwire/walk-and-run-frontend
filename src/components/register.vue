<template>
  <v-app class="background">
    <div
      class="background"
      :style="{ 'background-image':'url(https://cdn.pixabay.com/photo/2015/05/04/15/01/runners-752493_960_720.jpg)'}"
    >
      <v-container>
        <v-row class="justify-center">
          <v-card class="col-11 col-md-8">
            <v-btn class="ma-2" color="blue" text @click="back">
              <v-icon dark left>mdi-arrow-left</v-icon>Back
            </v-btn>
            <v-row justify="center">
              <h1>Register</h1>
            </v-row>

            <v-form v-model="valid" ref="form">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" md="6">
                    <v-text-field
                      ref="name"
                      maxlength="20"
                      v-model="firstname"
                      :rules="nameRules"
                      label="ชื่อ"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      maxlength="20"
                      v-model="lastname"
                      :rules="lastnameRules"
                      label="นามสกุล"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      maxlength="13"
                      v-model="usernumber"
                      :rules="usernumnerRules"
                      :counter="13"
                      label="รหัสประจำตัวนักศึกษา"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="8" md="5">
                    <v-text-field v-model="userid" :rules="useridRules" label="ไอดี" required></v-text-field>
                  </v-col>
                  <v-col cols="4" md="2">
                    <v-btn color="#f77100" class="white--text" @click="checkId()">Validate</v-btn>
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showpassword ? 'text' : 'password'"
                      label="พาสเวิร์ด"
                      @click:append="showpassword = !showpassword"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      maxlength="10"
                      v-model="department"
                      :rules="[v => !!v || 'กรุณากรอกภาควิชา' , v => v.length <= 10 || 'ภาควิชาต้องไม่เกิน 10 ตัวอักษร']"
                      label="ภาควิชา (ตัวย่อ)"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="sectionSelected"
                      :items="section"
                      :rules="[v => !!v || 'กรุณาเลือกเซคชั่น', ]"
                      label="เซคชั่น"
                      item-text="sectiondetail"
                      item-value="sectionkey"
                      return-object
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      color="#f77100"
                      class="white--text"
                      @click="dialog = true"
                    >เลือกรูปโปรไฟล์</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <v-card-actions>
              <v-row justify="center">
                <v-btn
                  width="40%"
                  color="#f77100"
                  class="white--text"
                  @click="submit"
                  id="submit"
                  :disabled="this.check_name == false"
                >Submit</v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" persistent width="500px">
        <v-card class="pa-3">
          <v-row>
            <v-col cols="8">
              <input type="file" @change="onFileSelected" class="v-btn" accept="image/*" />
              <v-progress-linear
                color="light-blue"
                height="10"
                striped
                indeterminate
                v-show="loading"
              ></v-progress-linear>
            </v-col>
            <v-col cols="4">
              <v-btn
                color="#f77100"
                class="white--text"
                @click="onUpload"
                :disabled="this.clicked_upload == false"
              >Upload</v-btn>
            </v-col>
            <v-col cols="12">
              <img v-bind:src="imageUrl" class="imgcrop" />
              <v-btn color="#f77100" class="white--text" @click="dialog = false">OK</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  data: () => ({
    clicked_upload: false,
    check_name: false,
    loading: false,
    dialog: false,
    valid: false,
    firstname: "",
    lastname: "",
    nameRules: [
      v => !!v || "กรุณากรอกชื่อ",
      v => v.length <= 20 || "ชื่อต้องไม่เกิน 20 ตัวอักษร"
    ],
    password: "",
    passwordRules: [
      v => !!v || "กรุณากรอกพาสเวิร์ด",
      v => v.length >= 8 || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      v => v.length <= 20 || "รหัสผ่านต้องไม่เกิน 20 ตัวอักษร"
    ],
    lastnameRules: [
      v => !!v || "กรุณากรอกนามสกุล",
      v => v.length <= 20 || "นามสกุลต้องไม่เกิน 20 ตัวอักษร"
    ],
    userid: "",
    useridRules: [
      v => !!v || "กรุณากรอกไอดี",
      v => v.length <= 20 || "ไอดีต้องไม่เกิน 20 ตัวอักษร",
      v => v.length >= 8 || "ไอดีต้องมีอย่างน้อย 8 ตัวอักษร"
    ],
    usernumber: "",
    usernumnerRules: [
      v => !!v || "กรุณากรอกรหัสประจำตัว",
      v => v.length == 13 || "รหัสประจำตัวต้องมี 13 ตัว"
    ],
    sectionSelected: null,
    section: [],
    sectionkey: [],
    department: "",
    showpassword: false,
    imageCloudUrl: null,
    imageUrl: null
  }),

  methods: {
    async submit() {
      await axios
        .post("/usermanage/getuser", {
          userid: this.userid
        })
        .then(res => {
          if (res.data.message == "notfound") {
            this.check_name = true;
          } else if (res.data.message == "found") {
            this.check_name = false;
            this.$fire({
              title: "แจ้งเตือน",
              text: "ไอดีนี้มีผู้อื่นใช้งานไปแล้ว",
              type: "warning",
              timer: 3000
            });
          }
        })
        .catch(() => {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error"
          });
        });

      let sectionnum = this.section.indexOf(this.sectionSelected);
      let selected = this.sectionkey[sectionnum];
      if (this.$refs.form.validate() && this.check_name == true) {
        axios
          .post("/usermanage/insertuser", {
            username: this.firstname,
            userlast: this.lastname,
            userid: this.userid,
            usersection: selected,
            userdepartment: this.department,
            userpassword: this.password,
            usernumber: this.usernumber,
            userrole: "user",
            userprofile: this.imageCloudUrl
          })
          .then(function() {
            router.push({ name: "login" });
          })
          .catch(function() {
            this.$fire({
              title: "Error",
              text: "เกิดข้อผิดพลาด",
              type: "error"
            });
          });
      } else {
        this.$fire({
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาตรวจสอบข้อมูลการลงทะเบียน",
          type: "warning"
        });
      }
    },
    async onFileSelected(event) {
      this.clicked_upload = true;
      const fileReader = new FileReader();
      await fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
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
          this.imageCloudUrl = response.data.file;
          this.loading = false;
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
            type: "error"
          });
        });
    },
    async checkId() {
      this.check_name = false;
      await axios
        .post("/usermanage/getuser", {
          userid: this.userid
        })
        .then(res => {
          if (res.data.message == "notfound") {
            this.check_name = true;
            this.$fire({
              title: "แจ้งเตือน",
              text: "ไอดีของคุณสามารถใช้ได้",
              type: "success",
              timer: 3000
            });
          } else if (res.data.message == "found") {
            this.check_name = false;
            this.$fire({
              title: "แจ้งเตือน",
              text: "ไอดีนี้มีผู้อื่นใช้งานไปแล้ว",
              type: "warning",
              timer: 3000
            });
          }
        })
        .catch(() => {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error"
          });
        });
    },
    back() {
      router.push({ name: "login" });
    }
  },

  created: async function() {
    await axios
      .post("/admin/getallsectionnum", {})
      .then(response => {
        this.section = response.data.data.sectiondetail;
        this.sectionkey = response.data.data.sectionkey;
      })
      .catch(function() {
        this.$fire({
          title: "Error",
          text: "เกิดข้อผิดพลาด",
          type: "error"
        });
      });
  }
};
</script>

<style scoped>
.imgcrop {
  max-width: 100%;
  max-height: 100%;
}
.background {
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #999;
  height: 100%;
}
</style>
