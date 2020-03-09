<template>
  <v-app>
    <v-app-bar color="amber accent-4" dark>
      <v-app-bar-nav-icon color="black" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <span color="black">Welcome to Walk&Run</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="logouticon" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary left>
      <v-list-item>
        
        <v-list-item-content>
          <v-list-item-title>สวัสดีคุณ {{$store.getters.username}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <template v-if="role == 'user'">
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon color="black" @click="changeCom(item.com)">{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title @click="changeCom(item.com)">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="role == 'admin'">
          <v-list-item v-for="itemadmin in itemadmins" :key="itemadmin.title" link>
            <v-list-item-icon>
              <v-icon color="black" @click="changeCom(itemadmin.com)">{{itemadmin.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title @click="changeCom(itemadmin.com)">{{ itemadmin.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <component v-bind:is="component"></component>
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
import Userwork from './userwork.vue'
import axios from 'axios'
export default {
  components: {
    userwork: Userwork,
    uploader: Uploader,
    homecard: Homecard,
    setting: Setting,
    work: Work,
    sections: Sections,
    event: Event
  },
  data() {
    return {

      role: this.$store.getters.role,
      drawer: null,
      component: "homecard",
      items: [
        { title: "หน้าหลัก", icon: "mdi-home", com: "homecard", role: "uni" },
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
        },
        {
          title: "ตั้งค่า",
          icon: "mdi-settings-outline",
          com: "setting",
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
      console.log(com);
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
        console.log(response.data);
        this.$store.commit("getTable", response.data.data);
      })
      .catch(function(error) {
        console.log(error);
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
</style>