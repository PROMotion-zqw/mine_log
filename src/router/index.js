import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Axios from 'axios'
import { getUser } from '../components/public_method'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/users/login.vue')
  },
  // {
  //   path: '/test',
  //   component: () => import('../components/test.vue')
  // },
  {
    path: "/404",
    name: "notFound",
    component: () => import('../components/found.vue')
  },
  {
    path: "*",
    redirect: "/404"
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {

  // if (to.name !== "login") {
    getUser({ $http: Axios }, () => {
      next()
    }, (err) => {
      if(err.response.status === 500) {
        document.write(`<h2 style="text-align: center;margin: 0px">${err.response.status}</h2><hr /><h5 style="text-align: center;margin: 0px">${err.response.statusText}</h5>`)
        return
      }
      if (err.response.status === 403 && to.name !== "login") {
        next('/login')
      }else {
        next()
      }
    })
  // } else {
  //   next()
  // }
})

export default router
