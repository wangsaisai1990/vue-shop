import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入全局样式表
import './assets/fonts/iconfont.css'

import axios from 'axios'
Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
