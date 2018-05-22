import Vue from 'vue'
import Router from 'vue-router'
import personalinfo from '@/pages/personal/personal/personalinfo/'
import resetpassword from '@/pages/personal/personal/resetpassword/'

Vue.use(Router)

export default new Router({
    routes: [
      {
        path: '/',
        name: 'personalinfo',
        component: personalinfo,
        meta:{title:'个人中心'}
      },
       {
        path: '/personalinfo',
        name: 'personalinfo',
        component: personalinfo,
        meta:{title:'个人信息'}
      },{
        path: '/resetpassword',
        name: 'resetpassword',
        component: resetpassword,
        meta:{title:'修改密码'}
      }
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
