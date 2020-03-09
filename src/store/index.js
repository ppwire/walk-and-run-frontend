import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import passwordHash from 'password-hash';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: localStorage.getItem('username') || null,
    token: localStorage.getItem('access_token') || null,
    datatable: null,
    role: localStorage.getItem('user_role')||null
  },
  mutations: {
    setUsername(state, username) {
      localStorage.setItem('username', username)
      state.username = username
    },
    retrieveToken(state, token) {
      state.token = token
    },
    destroyToken(state) {
      state.role = null
      state.token = null
      state.username = null
    },
    getTable(state, value) {
      state.datatable = value
    }
  },
  getters: {
    loggedIn(state) {
      return state.token != null
    },
    username: state => state.username,
    token: state => state.token,
    datatable: state => state.datatable,
    role: state => state.role
  },
  actions: {
    retrieveToken(context, data) {

      return new Promise((resolve, reject) => {
        axios
          .post("/auth/gettoken", {
            userid: data.username,
            userpw: passwordHash.generate(data.password)
          })
          .then(response => {
            if (response.data.verify == 'valid') {
              const token = response.data.access_token
              this.state.role = response.data.userrole
              localStorage.setItem('access_token', token)
              localStorage.setItem('user_role',response.data.userrole)
              context.commit('retrieveToken', token)
              axios.defaults.headers.post['authorization'] = `Bearer ${this.state.token}`
            }
            
            resolve(response)

          })
          .catch(function (error) {
            console.log(error);
            reject(error)
          })
      })
    },
    destroyToken(context) {
      localStorage.removeItem('username')
      localStorage.removeItem('user_role')
      localStorage.removeItem('access_token')
      context.commit('destroyToken')
    }
  },
  modules: {
  }
})
