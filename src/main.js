import Vue from 'vue'

import Cookies from 'js-cookie'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './assets/css/reset.css'

import Element from 'element-ui'
import V_Charts from 'vue-echarts'
import './styles/element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'
import comButton from './components/Generic/button.vue' // 自定义按钮
Vue.component('comButton', comButton)

//
import VueClipboard from 'vue-clipboard2'

import VueCompositionAPI from '@vue/composition-api' // Vue3
Vue.use(VueCompositionAPI)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
import gojs from 'gojs'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import echarts from 'echarts'

Vue.component('v-chart', V_Charts)

Vue.prototype.$echarts = echarts
Vue.prototype.go = gojs

Vue.use(VueClipboard)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.prototype.$axios = axios
axios.defaults.baseURL = process.env.VUE_APP_BASE_API

Vue.use(Element, {
  size: Cookies.get('size') // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
