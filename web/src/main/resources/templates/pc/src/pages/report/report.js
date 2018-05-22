// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import $ from 'jquery'
import jdyCommon from '@/assets/js/common'
import api_prefix from '@/assets/js/apiUrl'
import '@/assets/js/Global'
import '@/assets/js/filter'
import './js/filter'


import '../../../node_modules/element-ui/lib/theme-default/index.css'
import '@/assets/css/content.css'
import '@/assets/css/jstyle.css'
import '@/assets/css/lstyle.css'
import '@/assets/css/ystyle.css' 
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueResource)

window.api_prefix = api_prefix.api_prefix
// window.api_prefix = 'http://47.94.14.17:8200/'


/* eslint-disable no-new */
var vm = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    methods:{}
})
