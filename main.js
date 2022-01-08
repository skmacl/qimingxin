// import '@/static/js/pc'
import Vue from 'vue'
import App from './App'
import api from '@/common/api.js'
import common from '@/common/common.js'
// import config from '@/common/config.js'
const config = require('@/config/config.js')
const navigate = require('@/components/sk-navigationBar/sk-navigationBar.js')
import utils from '@/common/utils.js'
import request from '@/common/request.js'
import user from '@/common/user.js'



import emptyStatus from '@/components/empty-status/empty-status.vue'
import loginModule from "@/components/login-module/login-module.vue"
import navigation from "@/components/sk-navigationBar/sk-navigationBar.vue"

Vue.prototype.api = api;
Vue.prototype.common = common;
Vue.prototype.user = user
Vue.prototype.config = config
Vue.prototype.utils = utils
Vue.prototype.request = request
Vue.prototype.navigate = navigate

// Vue.prototype.$loginModule = loginModule

Vue.component('emptyStatus',emptyStatus)
Vue.component('loginModule',loginModule)
Vue.component("sknavigate",navigation)


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
