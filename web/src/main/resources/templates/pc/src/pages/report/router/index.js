import Vue from 'vue'
import Router from 'vue-router'
import agentReturnReport from '@/pages/report/agentReturnReport/agentReturnReport';
import agentReturnDetail from '@/pages/report/agentReturnReport/agentReturnDetail';
import saleTrendReport from '@/pages/report/saleTrendReport/saleTrendReport';
import agentSalesReport from '@/pages/report/agentSalesReport/agentSalesReport';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: agentReturnReport,
      meta:{title:'报表中心'}
    },
    {
      path: '/agentReturnReport', //代理人返佣报表
      name: 'agentReturnReport',
      component: agentReturnReport,
      meta:{title:'代理人返佣报表'}
      //meta:{title:'代理人返佣报表', keepAlive: true}//保存缓存
    },
    {
      path: '/agentReturnDetail', //代理人返佣明细报表
      name: 'agentReturnDetail',
      component: agentReturnDetail,
      meta:{title:'代理人返佣明细报表'}
    },
    {
      path: '/saleTrendReport', //代理人销售总额趋势图
      name: 'saleTrendReport',
      component: saleTrendReport,
      meta:{title:'代理人销售总额趋势图'}
    },
    {
      path: '/agentSalesReport', //代理人销售报表
      name: 'agentSalesReport',
      component: agentSalesReport,
      meta:{title:'代理人销售报表'}
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
