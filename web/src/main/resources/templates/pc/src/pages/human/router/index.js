import Vue from 'vue'
import Router from 'vue-router'
import orgStructure from '@/pages/human/orgStructure/orgStructure'
import staffEdit from '@/pages/human/newuser/newuseredit'
import staffList from '@/pages/human/newuser/newuserList'
import staffDetail from '@/pages/human/newuser/newuserDetail'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'orgStructure',
      component: orgStructure,
      meta: {
        title: '人资中心'
      }
    },
    {
      path: '/orgStructure',
      name: 'orgStructure',
      component: orgStructure,
      meta: {
        title: '组织架构管理'
      }
    },
    {
      path: '/staffList',
      name: 'staffList',
      component: staffList,
      meta: {
        title: '员工管理'
      }
    },
    {
      path: '/staffList/staffEdit',
      name: 'staffEdit',
      component: staffEdit,
      meta: {
        title: '新增/编辑员工'
      }
    },
    {
      path: '/staffList/staffDetail',
      name: 'staffDetail',
      component: staffDetail,
      meta: {
        title: '查看员工信息'
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  linkActiveClass: 'active'
})
