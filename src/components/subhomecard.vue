<template>
  <v-app>
    <v-card v-for="boarddata in boarddatas" :key="boarddata.boardid" class="homecard pa-4">
      <v-row justify="space-between">
        <v-col md="3">
          <strong class="blue-grey--text">หัวข้อ</strong>
          <div>{{boarddata.boardhead}}</div>
        </v-col>
        <v-col md="3">
          <strong class="blue-grey--text">Date</strong>
          <div>{{boarddata.boarddate}}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <strong class="blue-grey--text">Description</strong>
          <p>{{boarddata.boardtext}}</p>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-row justify="end">
          <v-col md="1" sm="2">
            <v-btn color="error" @click="deleteBoard(boarddata.boardid)" v-if="role == 'admin'">Delete</v-btn>
          </v-col>
          <v-col md="1" sm="2">
            <v-btn color="warning" @click="editBoard(boarddata)" v-if="role == 'admin'">Edit</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Activity</span>
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
          <v-btn color="blue darken-1" text @click="dialog = false ; submitEdit()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      role: this.$store.getters.role,
      boarddatas: null,
      dialog: false,
      boardhead: null,
      boardtext: null,
      boardid:null
    };
  },

  methods: {
    async deleteBoard(contextid) {
      await axios
        .post("/admin/deleteboard", {
          boardid: contextid
        })
        .then(() => {
          this.$fire({
            title: "สำเร็จ",
            text: "ลบข้อมูลสำเร็จ",
            type: "success",
            timer: 3000
          });
          window.location.reload();
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
    async editBoard(context) {
      this.boardhead = context.boardhead;
      this.boardtext = context.boardtext;
      this.boardid = context.boardid
      this.dialog = true;
     
    },
    async submitEdit() {
      await axios
        .post("/admin/updateboard", {
          boardtext:this.boardtext,
          boardhead:this.boardhead,
          boarddate: new Date().toLocaleString(),
          boardid:this.boardid
        })
        .then(() => {
          this.$fire({
            title: "สำเร็จ",
            text: "แก้ไขข้อมูลสำเร็จ",
            type: "success",
            timer: 3000
          });
          window.location.reload();
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

  created: async function() {
    await axios
      .post("/admin/getallboard", {})
      .then(response => {
        this.boarddatas = response.data.data;
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
.homecard {
  margin-bottom: 5%;
}
</style>