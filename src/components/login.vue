<template>
  <v-app>
    <v-container>
      <div class="rowpush"></div>
      <v-row class="justify-center">
        <v-card max-width="500">
          <v-row justify="center">
            <v-card-title>Login</v-card-title>
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
              <v-btn rounded color="light-blue ">
                <span class="white--text" @click="login">Login</span>
              </v-btn>
            </v-row>
          </v-card-actions>
          <v-row justify="space-around">
            <p class="font-weight-black" id="regis">
              <router-link to="/register" exact>Register</router-link>
            </p>
          </v-row>
        </v-card>
      </v-row>
    </v-container>
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
    showpassword: false
  }),
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("retrieveToken", {
            username: this.username,
            password: this.password
          })
          .then(response => {
            if (response.data.verify == "valid") {
              this.$store.commit("setUsername", response.data.username);
              console.log(response);
              router.push({ path: "/homepage" });
            } else {
              console.log("invalidpw");
              this.$fire({
                title: "Error",
                text: "ไอดีหรือรหัสผ่านผิดพลาด",
                type: "error",
                timer: 3000
              });
            }
          });
      } else {
        console.log("Invalidate");
        console.log(this.$refs.form.validate());
      }
    }
  }
};
</script>

<style scoped>
#regis {
  cursor: pointer;
}

.rowpush {
  min-height: 10rem;
}
</style>