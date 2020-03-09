<template>
  <v-app>
    <v-card min-height="100vh" max-height="auto">
      <v-row>
        <v-col md="2"></v-col>
        <v-col md="9">
          <v-card max-width="auto">
            <v-card-title>Setting</v-card-title>
            <v-img v-bind:src="profile[0].userprofile"></v-img>
            <v-form v-model="valid" ref="form">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-progress-linear
                      color="light-blue"
                      height="10"
                      striped
                      indeterminate
                      v-show="loading"
                    ></v-progress-linear>
                  </v-col>

                  <v-col cols="6">
                    <input
                      type="file"
                      :disabled="edit_submit == false"
                      @change="onFileSelected"
                      class="v-btn"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-btn @click="onUpload" :disabled="clickupload == false">Upload</v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="ชื่อ"
                      v-model="profile[0].username"
                      :disabled="edit_submit == false"
                      :rules="nameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="นามสกุล"
                      v-model="profile[0].userlastname"
                      :disabled="edit_submit == false"
                      :rules="nameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="เลขประจำตัว"
                      v-model="profile[0].usernumber"
                      :disabled="edit_submit == false"
                      :rules="usernumnerRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="สาขา"
                      v-model="profile[0].userdepartment"
                      :disabled="edit_submit == false"
                      :rules="[v => !!v || 'กรุณากรอกภาควิชา']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      label="section"
                      :disabled="edit_submit == false"
                      :items="section"
                      v-model="selectedsection"
                      item-text="sectiondetail"
                      item-value="sectionkey"
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <v-card-actions>
              <v-btn @click="edit()">{{buttonedit}}</v-btn>
              <v-btn @click="pwform = true">เปลี่ยนรหัสผ่าน</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="pwform" max-width="500">
      <v-card>
        <v-card-title>เปลี่ยนรหัสผ่าน</v-card-title>
        <v-form v-model="validformpw" ref="formpw">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="รหัสผ่านเก่า" v-model="pwold" :rules="passwordRules"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="รหัสผ่านใหม่" v-model="pwnew" :rules="passwordRules"></v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn @click="pwform = false">ปิด</v-btn>
              <v-btn @click="changepw()">ยืนยัน</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
import pwhash from "password-hash";
export default {
  data() {
    return {
      edit_section: null,
      profile: null,
      selectedsection: null,
      section: [],
      imgpush: null,
      loading: false,
      clickupload: false,
      edit_submit: false,
      buttonedit: "แก้ไขข้อมูล",
      valid: false,
      validformpw: false,
      nameRules: [v => !!v || "กรุณากรอกชื่อ"],
      usernumnerRules: [
        v => !!v || "กรุณากรอกรหัสประจำตัว",
        v => v.length == 13 || "รหัสประจำตัวต้องมี 13 ตัว"
      ],
      pwform: false,
      passwordRules: [
        v => !!v || "กรุณากรอกพาสเวิร์ด",
        v => v.length >= 8 || "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
      ],
      pwold: "",
      pwnew: ""
    };
  },

  methods: {
    async edit() {
      if (this.imgpush != null) {
        this.profile[0].userprofile = this.imgpush;
      }
      if (this.edit_submit == false) {
        this.edit_submit = true;
        this.buttonedit = "submit";
      } else if (this.edit_submit == true && this.$refs.form.validate()) {
        console.log("update");
        this.buttonedit = "แก้ไขข้อมูล";
        this.edit_submit = false;
        await axios
          .post("/usermanage/updateprofile", {
            username: this.profile[0].username,
            userlastname: this.profile[0].userlastname,
            userdepartment: this.profile[0].userdepartment,
            usernumber: this.profile[0].usernumber,
            usersection: this.selectedsection.sectionkey,
            userprofile: this.profile[0].userprofile
          })
          .then(response => {
            console.log(response.data);
            console.log("update");
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    async changepw() {
      if (this.$refs.formpw.validate()) {
        await axios
          .post("/usermanage/changepw", {
            newpw: this.pwnew,
            oldpw: pwhash.generate(this.pwold)
          })
          .then(response => {
            console.log(response.data);
            switch (response.data.message) {
              case "invalidpassword":
                this.$fire({
                  title: "Error",
                  text: "รหัสผ่านผิดพลาด",
                  type: "error",
                  timer: 3000
                });
                break;
              case "pwchange_success":
                this.$fire({
                  title: "Success",
                  text: "เปลี่ยนรหัสผ่านสำเร็จ",
                  type: "success",
                  timer: 3000
                });
                break;
              case "notfound":
                this.$fire({
                  title: "Error",
                  text: "ไม่พบผู้ใช้",
                  type: "error",
                  timer: 3000
                });
                break;
              default:
                break;
            }
            this.pwform = false;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    async onFileSelected(event) {
      this.clickupload = true;
      const fileReader = new FileReader();
      await fileReader.addEventListener("load", () => {
        this.imgpush = fileReader.result;
      });
      await fileReader.readAsDataURL(event.target.files[0]);
    },
    async onUpload() {
      this.clickupload = false;
      this.loading = true;
      await axios
        .post("/usermanage/insertimguser", {
          file: this.imgpush
        })
        .then(response => {
          this.imgpush = response.data.file;
          this.loading = false;
          this.profile[0].userprofile = this.imgpush;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created: async function() {
    axios.defaults.headers.post[
      "authorization"
    ] = `Bearer ${this.$store.getters.token}`;
    await axios
      .post("/usermanage/getuserbytoken", {})
      .then(response => {
        console.log(response.data);
        this.profile = response.data.data;
        this.selectedsection = response.data.data[0].usersection;
      })
      .catch(function(error) {
        console.log(error);
      });

    await axios
      .post("/admin/getallsectionnum", {})
      .then(response => {
        console.log(response.data.data);
        this.section = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>

