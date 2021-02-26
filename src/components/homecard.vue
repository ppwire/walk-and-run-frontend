<template>
  <v-col>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <subhome :key="componentkey"></subhome>
      </v-col>

      <v-col cols="12">
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on" v-if="role=='admin'">Post</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Post Activity</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model="valid" ref="form">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="boardhead"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="หัวเรื่อง"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="boardtext"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="คำอธิบาย"
                          required
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="dialog = false ; submitBoard()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";
import Subhome from "./subhomecard.vue";
export default {
  components: {
    subhome: Subhome
  },
  data() {
    return {
      role: this.$store.getters.role,
      componentkey: 0,
      dialog: false,
      valid: false,
      boardhead: null,
      boardtext: null
    };
  },
  methods: {
    async submitBoard() {
      axios.defaults.headers.post[
        "authorization"
      ] = `Bearer ${this.$store.getters.token}`;

      await axios
        .post("/admin/insertboard", {
          boardhead: this.boardhead,
          boardtext: this.boardtext,
          boarddate: new Date().toLocaleString()
        })
        .then(() => {
          this.componentkey++;
        })
        .catch(function() {
          this.$fire({
            title: "Error",
            text: "เกิดข้อผิดพลาด",
            type: "error"
          });
        });
    }
  }
};
</script>

