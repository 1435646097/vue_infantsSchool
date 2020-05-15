import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import { messages } from './components/i18n'
// import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css' //默认主题
import './assets/css/icon.css'
import Axios from 'axios'
import './components/directives'

Vue.config.productionTip = false
Axios.defaults.baseURL = 'http://localhost:5000/api/'
Axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = Axios
Vue.use(VueI18n)
Vue.use(ElementUI)
const i18n = new VueI18n({
  locale: 'zh',
  messages
})
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')