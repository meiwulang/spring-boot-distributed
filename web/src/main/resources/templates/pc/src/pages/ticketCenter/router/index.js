import Vue from 'vue'
import Router from 'vue-router'
import ticketDeclarationList from '@/pages/ticketCenter/ticketDeclaration/ticketDeclarationList'
import ticketDeclarationInformation from '@/pages/ticketCenter/ticketDeclaration/ticketDeclarationInformation'
import ticketDeclarationPrice from '@/pages/ticketCenter/ticketDeclaration/ticketDeclarationPrice'
import ticketDeclarationContract from '@/pages/ticketCenter/ticketDeclaration/ticketDeclarationContract'
// 销售政策
import ticketPolicyList from '@/pages/ticketCenter/ticketPolicy/ticketPolicyList'
import ticketPolicyTicketInfo from '@/pages/ticketCenter/ticketPolicy/ticketPolicyTicketInfo'
import ticketPolicyPriceInfo from '@/pages/ticketCenter/ticketPolicy/ticketPolicyPriceInfo'
import ticketPolicyExpandInfo from '@/pages/ticketCenter/ticketPolicy/ticketPolicyExpandInfo'
import ticketPolicyContract from '@/pages/ticketCenter/ticketPolicy/ticketPolicyContract'
// 生产门票
import produceTicket from '@/pages/ticketCenter/produceTicket/produceTicket'

import ticketInventoryList from '@/pages/ticketCenter/ticketInventory/ticketInventoryList'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/', //产品管理
      name: 'index',
      component: ticketDeclarationList,
      meta: {
        title: '门票中心'
      }
    },
    {
      path: '/ticketDeclaration/ticketDeclarationList', //门票产品基本信息配置
      name: 'ticketDeclarationList',
      component: ticketDeclarationList,
      meta: {
        title: '门票产品基本信息配置',
      }
    },  
    {
      path: '/ticketDeclaration/ticketDeclarationList/ticketDeclarationInformation', //基本信息
      name: 'ticketDeclarationInformation',
      component: ticketDeclarationInformation,
      meta: {
        title: '基本信息',
        query:['id']
      }
    },   
    {
      path: '/ticketDeclaration/ticketDeclarationList/ticketDeclarationPrice', //出厂价信息
      name: 'ticketDeclarationPrice',
      component: ticketDeclarationPrice,
      meta: {
        title: '出厂价信息',
        query:['id']
      }
    },   
    {
      path: '/ticketDeclaration/ticketDeclarationList/ticketDeclarationContract', //电子合同
      name: 'ticketDeclarationContract',
      component: ticketDeclarationContract,
      meta: {
        title: '电子合同',
        query:['id','isEdit']
      }
    },   
    {
      path: '/ticketInventory/ticketInventoryList', //库存信息
      name: 'ticketInventoryList',
      component: ticketInventoryList,
      meta: {
        title: '库存信息'
      }
    }, 
    {
      path: '/ticketPolicy/ticketPolicyList', //申报销售政策列表
      name: 'ticketPolicyList',
      component: ticketPolicyList,
      meta: {
        title: '门票销售信息配置'
      }
    },  
    {
      path: '/ticketPolicy/ticketPolicyList/ticketPolicyTicketInfo', //门票信息
      name: 'ticketPolicyTicketInfo',
      component: ticketPolicyTicketInfo,
      meta: {
        title: '门票信息'
      }
    },   
    {
      path: '/ticketPolicy/ticketPolicyList/ticketPolicyPriceInfo', //票价信息
      name: 'ticketPolicyPriceInfo',
      component: ticketPolicyPriceInfo,
      meta: {
        title: '销售价格信息'
      }
    },   
    {
      path: '/ticketPolicy/ticketPolicyList/ticketPolicyExpandInfo', //扩展信息
      name: 'ticketPolicyExpandInfo',
      component: ticketPolicyExpandInfo,
      meta: {
        title: '扩展信息'
      }
    }, 
    {
      path: '/ticketPolicy/ticketPolicyList/ticketPolicyContract', //电子合同
      name: 'ticketPolicyContract',
      component: ticketPolicyContract,
      meta: {
        title: '电子合同'
      }
    },     
    {
      path: '/ticketPolicy/produceTicket', //扩展信息
      name: 'produceTicket',
      component: produceTicket,
      meta: {
        title: '生产门票'
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
