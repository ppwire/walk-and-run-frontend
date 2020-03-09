import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import axios from 'axios'

import VueSimpleAlert from "vue-simple-alert";
import VModal from 'vue-js-modal'


// import firebase from 'firebase'
// firebase.initializeApp({
//   apiKey: "AIzaSyCF3qUxjLG1sjn7k_6fH11sS_ZJPBSLOzk",
//   authDomain: "days100kilos.firebaseapp.com",
//   databaseURL: "https://days100kilos.firebaseio.com",
//   projectId: "days100kilos",
//   storageBucket: "days100kilos.appspot.com",
//   messagingSenderId: "1011929757190",
//   appId: "1:1011929757190:web:f6ab13ec4c8e45514e7587",
//   measurementId: "G-NYDT22K1RS"
// })


axios.defaults.baseURL = "https://us-central1-days100kilos.cloudfunctions.net/walkandrunapi"

Vue.use(VueSimpleAlert);
Vue.use(VModal)
Vue.use(axios)
Vue.use(Vuelidate)
Vue.config.productionTip = false



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
