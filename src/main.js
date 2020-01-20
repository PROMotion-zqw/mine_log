import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'iview'
import "iview/dist/styles/iview.css"
import "./assets/mine.css"
import Axios from 'axios';
import qs from 'qs'
// Axios.defaults.baseURL = process.env.VUE_APP_URL;
// Axios.interceptors.request.use(config => {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   if (config.method === 'post') {
//     config.data = qs.stringify({
//       ...config.data
//     })
//   }
//   return config
// },
//   error => {
//     Promise.reject(error)
//   })
Vue.use(ViewUI)
// Axios.get("/api/getUser").then(res => {
//   console.log(res);
// });
Vue.prototype.$http = Axios;

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')