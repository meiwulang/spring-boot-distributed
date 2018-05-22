import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/login/main/main';
import Errors from '@/pages/login/main/errors';
import Pic from '@/pages/resources/pics/Pic';
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/', //登录首页
        name: 'Main',
        component: Main,
        },{
        path: '/error', //报错页面
        name: 'Errors',
        component: Errors,
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    linkActiveClass: 'active'
})
