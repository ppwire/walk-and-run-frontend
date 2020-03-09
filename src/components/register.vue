<template>
  <v-app>
    <v-container>
      <v-row class="justify-center">
        <v-card max-width="500">
          <v-row justify="center">
            <v-card-title>Register</v-card-title>
          </v-row>

          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row justify="center">
                <v-col cols="12" md="11">
                  <v-text-field
                    v-model="usernumber"
                    :rules="usernumnerRules"
                    :counter="13"
                    label="รหัสประจำตัว"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="11">
                  <v-text-field
                    v-model="firstname"
                    :rules="nameRules"
                    :counter="10"
                    label="ชื่อ"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="11">
                  <v-text-field
                    v-model="lastname"
                    :rules="lastnameRules"
                    :counter="15"
                    label="นามสกุล"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="11">
                  <v-text-field v-model="userid" :rules="useridRules" label="ไอดี" required></v-text-field>
                </v-col>
                <v-col cols="1" md="1">
                  <v-btn @click="checkId()">Check</v-btn>
                </v-col>
                <v-col cols="12" md="11">
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
                <v-col cols="12" md="11">
                  <v-text-field
                    v-model="department"
                    :rules="[v => !!v || 'กรุณากรอกภาควิชา']"
                    label="ภาควิชา"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="11">
                  <v-select
                    v-model="sectionSelected"
                    :items="section"
                    :rules="[v => !!v || 'กรุณาเลือกเซคชั่น']"
                    label="เซคชั่น"
                    item-text="sectiondetail"
                    item-value="sectionkey"
                    return-object
                  ></v-select>
                </v-col>

                <v-col cols="11">
                  <v-btn @click="dialog = true">เลือกรูปโปรไฟล์</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-row justify="end">
              <v-btn rounded color="secondary" @click="submit" id="submit">Submit</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" persistent max-width="300 " max-height="600">
      <v-card>
        <input type="file" @change="onFileSelected" class="v-btn" />
        <v-progress-linear color="light-blue" height="10" striped indeterminate v-show="loading"></v-progress-linear>
        <v-btn @click="onUpload" :disabled="this.clicked_upload == false">Upload</v-btn>
        <img v-bind:src="imageUrl" class="imgcrop" />
        <v-card-actions>
          <v-btn @click="dialog = false">Back</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    nameRules: [v => !!v || "กรุณากรอกชื่อ"],
    password: "",
    passwordRules: [
      v => !!v || "กรุณากรอกพาสเวิร์ด",
      v => v.length >= 8 || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
    ],
    lastnameRules: [v => !!v || "กรุณากรอกนามสกุล"],
    userid: "",
    useridRules: [
      v => !!v || "กรุณากรอกไอดี",
      v => v.length <= 15 || "ไอดีต้องไม่เกิน 15 ตัวอักษร"
    ],
    usernumber: "",
    usernumnerRules: [
      v => !!v || "กรุณากรอกรหัสประจำตัว",
      v => v.length == 13 || "รหัสประจำตัวต้องมี 13 ตัว"
    ],
    sectionSelected: null,
    section: [],
    department: "",
    showpassword: false,
    imageCloudUrl: null,
    imageUrl: null
  }),

  methods: {
    async submit() {
      if (this.check_name == false) {
        this.$fire({
          title: "Error",
          text: "กรุณาตรวจสอบไอดี",
          type: "error",
          timer: 3000
        });
      }

      if (this.$refs.form.validate() && this.check_name == true) {
        axios
          .post("/usermanage/insertuser", {
            username: this.firstname,
            userlast: this.lastname,
            userid: this.userid,
            usersection: this.sectionSelected.sectionkey,
            userdepartment: this.department,
            userpassword: this.password,
            usernumber: this.usernumber,
            userrole: "user",
            userprofile: this.imageCloudUrl
          })
          .then(function(response) {
            console.log(response);
            router.push({ name: "login" });
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        console.log("invalid");
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
          console.log(response);
          this.imageCloudUrl = response.data.file;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
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
        .catch(err => {
          console.log(err);
        });
    }
  },

  created: async function() {
    await axios
      .post("/admin/getallsectionnum", {})
      .then(response => {
        this.section = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

<style scoped>
#submit {
  margin-right: 6%;
}

.imgcrop {
  max-width: 100%;
  max-height: 100%;
}
</style>
