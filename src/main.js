import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueSimpleAlert from "vue-simple-alert";
import VModal from 'vue-js-modal'
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
