<template>
  <v-col>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <subsection :key="componentkey"></subsection>
        <v-btn
          color="primary"
          @click="popUpAddSection"
          class="mb-2 ml-5"
          v-show="sectionState == true"
        >Add Section</v-btn>
        <v-btn
          color="blue lighten-5"
          @click="deleteSection = true"
          class="ml-5 mb-2"
          v-show="sectionState == true"
        >Manage Section</v-btn>
        <v-row>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline" v-if="editactivate != true">Section Register</span>
                <span class="headline" v-if="editactivate == true">Section Edit</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model="valid" ref="form">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="sectionnumber"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="เลขเซคชั่น"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-select
                          v-model="sectionDay"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์','อาทิตย์']"
                          label="วันที่เรียน*"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="sectionyear"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="ปีการศึกษา"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="sectionsemester"
                          :items="['1','2']"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          label="เทอม"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6" md="6">
                        <v-select
                          v-model="sectiontimestartHour"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['8','9','10','11','12','13','14','15','16','17','18','19','20','21']"
                          label="เวลาเริ่ม[ชม]"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6" md="6">
                        <v-select
                          v-model="sectiontimestartMin"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['00','15','30','45',]"
                          label="เวลาเริ่ม[นาที]"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6" md="6">
                        <v-select
                          v-model="sectiontimeendHour"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['8','9','10','11','12','13','14','15','16','17','18','19','20','21']"
                          label="เวลาจบ[ชม]"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6" md="6">
                        <v-select
                          v-model="sectiontimeendMin"
                          :rules="[v => !!v || 'กรุณาเติมข้อมูลให้ครบ']"
                          :items="['00','15','30','45',]"
                          label="เวลาจบ[นาที]"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false ; addSection()"
                  v-if="editactivate != true"
                >Save</v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false ; editSection()"
                  v-if="editactivate == true"
                >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteSection">
            <v-card>
              <v-container>
                <v-card-title>ลบเซคชั่น</v-card-title>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th
                          class="text-center"
                          v-for="item in headers"
                          :key="item.value"
                        >{{item.text}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="section in sections" :key="section.sectionid " class="text-center">
                        <td>{{ section.sectionnumber }}</td>
                        <td>{{ section.sectionday }}</td>
                        <td>{{ section.sectiontime }}</td>
                        <td>{{ section.sectionyear }}</td>
                        <td>{{ section.sectionsemester }}</td>
                        <td>
                          <v-btn
                            class="ml-5 mb-2 mt-2"
                            outlined
                            color="light-blue"
                            @click="postDeleteSection(section.sectionid)"
                          >DELETE</v-btn>
                          <v-btn
                            class="ml-5 mb-2 mt-2"
                            outlined
                            color="light-blue"
                            @click="postEditSection(section)"
                          >EDIT</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-container>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import subSection from "./subsection.vue";
import axios from "axios";
export default {
  components: {
    subsection: subSection
  },
  data() {
    return {
      managesectionshow: this.$store.getters.managesection,
      editactivate: false,
      deleteSection: false,
      componentkey: 0,
      valid: false,
      dialog: false,
      sectionyear: null,
      sectionsemester: null,
      sectionnumber: null,
      sectionDay: null,
      sectiontimestartHour: null,
      sectiontimestartMin: null,
      sectiontimeendHour: null,
      sectiontimeendMin: null,
      sectionTime: null,
      sectionId: null,
      sections: [],
      headers: [
        { text: "เลขเชคชั่น", value: "sectionnum" },
        { text: "วันที่เรียน", value: "sectionday" },
        { text: "เวลาที่เรียน", value: "sectiontime" },
        { text: "ปีการศึกษา", value: "sectionyear" },
        { text: "เทอม", value: "sectionsemester" },
        { text: "ตัวเลือก", value: "option" }
      ]
    };
  },
  methods: {
    async addSection() {
      this.sectionTime = `${this.sectiontimestartHour}:${this.sectiontimestartMin}-${this.sectiontimeendHour}:${this.sectiontimeendMin}`;
      switch (this.sectionDay) {
        case "จันทร์":
          this.sectionDay = "M";
          break;
        case "อังคาร":
          this.sectionDay = "T";
          break;
        case "พุธ":
          this.sectionDay = "W";
          break;
        case "พฤหัส":
          this.sectionDay = "H";
          break;
        case "ศุกร์":
          this.sectionDay = "F";
          break;
        case "เสาร์":
          this.sectionDay = "S";
          break;
        case "อาทิตย์":
          this.sectionDay = "U";
          break;
        default:
          this.sectionDay = null;
          break;
      }

      if (this.$refs.form.validate()) {
        await axios
          .post("/admin/insertsection", {
            sectionnumber: this.sectionnumber,
            sectionday: this.sectionDay,
            sectiontime: this.sectionTime,
            sectionyear: this.sectionyear,
            sectionsemester: this.sectionsemester
          })
          .then(() => {
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
    async postDeleteSection(context) {
      this.$confirm("ต้องการจะลบเชคชั่นใช่ไหม ?").then(() => {
        this.deleteSection = false;
        axios
          .post("/admin/deletesection", { sectionid: context })
          .then(() => {
            this.$fire({
              title: "success",
              text: "ลบเชคชั่นสำเร็จ",
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
      });
    },
    async postEditSection(context) {
      this.dialog = true;
      this.editactivate = true;
      this.sectionnumber = context.sectionnumber;
      this.sectionDay = context.sectionday;
      this.sectionyear = context.sectionyear;
      this.sectionsemester = context.sectionsemester;
      this.sectionId = context.sectionid;

      let splitminus = context.sectiontime.split("-");
      let i,
        splitdot = [];
      for (i = 0; i < splitminus.length; i++) {
        splitdot.push(splitminus[i]);
      }

      let splitstart = splitdot[0].split(":");
      let splitend = splitdot[1].split(":");

      this.sectiontimestartHour = splitstart[0];
      this.sectiontimestartMin = splitstart[1];
      this.sectiontimeendHour = splitend[0];
      this.sectiontimeendMin = splitend[1];
    },
    popUpAddSection() {
      this.dialog = true;
      this.editactivate = false;
    },
    async editSection() {
      this.sectionTime = `${this.sectiontimestartHour}:${this.sectiontimestartMin}-${this.sectiontimeendHour}:${this.sectiontimeendMin}`;
      switch (this.sectionDay) {
        case "จันทร์":
          this.sectionDay = "M";
          break;
        case "อังคาร":
          this.sectionDay = "T";
          break;
        case "พุธ":
          this.sectionDay = "W";
          break;
        case "พฤหัส":
          this.sectionDay = "H";
          break;
        case "ศุกร์":
          this.sectionDay = "F";
          break;
        case "เสาร์":
          this.sectionDay = "S";
          break;
        case "อาทิตย์":
          this.sectionDay = "U";
          break;
        default:
          this.sectionDay = null;
          break;
      }

      if (this.$refs.form.validate()) {
        await axios
          .post("/admin/updatesection", {
            sectionnumber: this.sectionnumber,
            sectionday: this.sectionDay,
            sectiontime: this.sectionTime,
            sectionyear: this.sectionyear,
            sectionsemester: this.sectionsemester,
            sectionid: this.sectionId
          })
          .then(() => {
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
    }
  },
  computed: {
    sectionState() {
      return this.$store.getters.managesection;
    }
  },

  created: async function() {
    await axios
      .post("/admin/getallsection", {})
      .then(res => {
        this.$store.commit("switchSectionOn");
        this.sections = res.data.data;
      })
      .catch(() => {
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