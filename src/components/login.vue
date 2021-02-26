<template>
  <v-app class="background">
    <div
      class="background"
      :style="{ 'background-image':'url(https://cdn.pixabay.com/photo/2015/05/04/15/01/runners-752493_960_720.jpg)'}"
    >
      <v-container>
        <v-row class="justify-center logincard">
          <v-col cols="11" md="5">
            <v-progress-linear color="orange
" height="10" striped indeterminate v-show="loading"></v-progress-linear>
            <v-card>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <div class="text-center">
                    <h1>Login</h1>
                  </div>
                  <v-row align="center" justify="center" class="mt-3">
                    <div>
                      <v-img
                        src="https://i.imgur.com/OGOcqrf.png"
                        max-width="150px"
                      ></v-img>
                    </div>
                  </v-row>
                </v-col>
              </v-row>

              <v-form v-model="valid" ref="form">
                <v-container>
                  <v-row justify="center">
                    <v-col cols="12" md="11">
                      <v-text-field v-model="username" :rules="userRules" required label="Username"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="11">
                      <v-text-field
                        v-model="password"
                        :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showpassword ? 'text' : 'password'"
                        counter
                        label="Password"
                        @click:append="showpassword = !showpassword"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <v-card-actions>
                <v-row justify="center">
                  <v-btn width="85%" color="#f77100"  @click="login">
                    <span class="white--text">Login</span>
                  </v-btn>
                </v-row>
              </v-card-actions>
              <v-row justify="space-around">
                <p class="font-weight-black" id="regis">
                  <router-link to="/register" class="colorRegister" exact>Register</router-link>
                </p>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import router from "../router";

export default {
  data: () => ({
    valid: false,
    username: "",
    password: "",
    userRules: [v => !!v],
    showpassword: false,
    loading: false
  }),
  methods: {
     login() {
      this.loading = true
      
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("retrieveToken", {
            username: this.username,
            password: this.password
          })
          .then(response => {
            if (response.data.verify == "valid") {
              this.loading = false
              this.$store.commit("setUsername", response.data.username);

              router.push({ path: "/homepage" });
            } else {
              this.loading = false
              this.$fire({
                title: "ผิดพลาด",
                text: "ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด",
                type: "warning",
                timer: 3000
              });
            }
          });
      } else {
        this.$fire({
          title: "Error",
          text: "การยืนยัน Token ผิดพลาด",
          type: "error"
        });
      }
    }
  }
};
</script>

<style scoped>
#regis {
  cursor: pointer;
}

.background {
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #999;
  height: 100%;
}

.logincard {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95vh;
}
.colorRegister {
  display: block;
  color: #f77100;
}
</style>