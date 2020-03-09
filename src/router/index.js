import Vue from 'vue'
import VueRouter from 'vue-router'
import showRegister from '../components/register.vue'
import showLogin from '../components/login.vue'
import showHome from '../views/home.vue'
import store from '../store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/register', name: 'register', component: showRegister, beforeEnter: (to, from, next) => {
      if (store.getters.loggedIn == true) {
        console.log('not logged In')
        next({
          name: 'homepage'
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/', name: 'login', component: showLogin, beforeEnter: (to, from, next) => {
      if (store.getters.loggedIn == true) {
        console.log('not logged In')
        next({
          name: 'homepage'
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/homepage', name: 'homepage', component: showHome, beforeEnter: (to, from, next) => {
      if (store.getters.loggedIn == false) {
        console.log('not logged In')
        next({
          name: 'login'
        })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
