<template>
  <v-app>
    <v-app-bar color="#f77100">
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <h3 class="white--text">
          <span>100 Day 100 KM</span>
        </h3>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed class="logouticon" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary left>
      <v-img :aspect-ratio="16/9" src="https://cdn.pixabay.com/photo/2015/05/04/15/01/runners-752493_960_720.jpg">
        <v-row align="end" class="lightbox white--text pa-2 fill-height">
          <v-col>
            <div class="body-1">สวัสดีคุณ {{$store.getters.username}}</div>
          </v-col>
        </v-row>
      </v-img>

      <v-list dense>
        <template v-if="role == 'user'">
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon @click="changeCom(item.com)">{{item.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="changeCom(item.com)">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="role == 'admin'">
          <v-list-item v-for="itemadmin in itemadmins" :key="itemadmin.title" link>
            <v-list-item-icon>
              <v-icon @click="changeCom(itemadmin.com)">{{itemadmin.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title @click="changeCom(itemadmin.com)">{{ itemadmin.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <component class="mt-3" v-bind:is="component"></component>
  </v-app>
</template>

<script>
import router from "../router";
import Uploader from "./uploader.vue";
import Homecard from "./homecard.vue";
import Setting from "./setting.vue";
import Work from "./work.vue";
import Sections from "./section.vue";
import Event from "./event.vue";
import Userwork from "./userwork.vue";
import Eventforstu from "./eventforstu.vue";
import axios from "axios";
export default {
  components: {
    userwork: Userwork,
    uploader: Uploader,
    homecard: Homecard,
    setting: Setting,
    work: Work,
    sections: Sections,
    event: Event,
    eventforstu: Eventforstu
  },
  data() {
    return {
      role: this.$store.getters.role,
      drawer: null,
      component: "homecard",
      items: [
        { title: "หน้าหลัก", icon: "mdi-home", com: "homecard", role: "uni" },
        {
          title: "กิจกรรมพิเศษ",
          icon: "mdi-tooltip-text-outline",
          com: "eventforstu",
          role: "user"
        },
        {
          title: "โปรไฟล์",
          icon: "mdi-account",
          com: "setting",
          role: "user"
        },
        {
          title: "อัพโหลด",
          icon: "mdi-cloud-upload",
          com: "uploader",
          role: "user"
        },
        {
          title: "สรุปงาน",
          icon: "mdi-clipboard-list",
          com: "work",
          role: "user"
        },
        {
          title: "งาน",
          icon: "mdi-run-fast",
          com: "userwork",
          role: "user"
        }
      ],
      itemadmins: [
        { title: "หน้าหลัก", icon: "mdi-home", com: "homecard", role: "uni" },
        {
          title: "เซคชั่น",
          icon: "mdi-account-group",
          com: "sections",
          role: "admin"
        },
        {
          title: "กิจกรรมพิเศษ",
          icon: "mdi-tooltip-text-outline",
          com: "event",
          role: "admin"
        }
      ]
    };
  },
  methods: {
    changeCom(com) {
      this.component = com;
    },
    logout() {
      this.$store.dispatch("destroyToken").then(router.push({ name: "login" }));
    }
  },
  created: async function() {
    axios.defaults.headers.post[
      "authorization"
    ] = `Bearer ${this.$store.getters.token}`;
    await axios
      .post("/usermanage/getuserallwork", {})
      .then(response => {
        this.$store.commit("getTable", response.data.data);
      })
      .catch(function() {
        this.$fire({
          title: "Error",
          text: "การยืนยัน Token ผิดพลาด",
          type: "error"
        });
      });
  }
};
</script>

<style scoped>
.v-toolbar {
  flex: none;
}

.logouticon {
  margin: 1%;
}
.v-navigation-drawer {
  transition: none !important;
}

.lightbox {
  box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
</style>