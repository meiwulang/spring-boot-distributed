import Vue from 'vue'
import Router from 'vue-router'
import orderSellerModify from '@/pages/sale/seller/orderModify';
import orderSellerDetail from '@/pages/sale/seller/orderDetail';
import groupConfirmPrint from '@/pages/sale/seller/groupConfirmPrint';
import groupNoticePrint from '@/pages/sale/seller/groupNoticePrint';
import orderBuyerDetail from '@/pages/sale/buyer/orderDetail';
import buyerOrderAll from '@/pages/sale/buyer/orderAll';
import sellerOrderAll from '@/pages/sale/seller/orderAll';
import contract from '@/pages/sale/checkContract/checkContract';
// 产品订单
import product from '@/pages/sale/product/product';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: sellerOrderAll,
      meta:{title:'销售中心'}
    },
    {
      path: '/orderSellerModify', //修改卖家订单
      name: 'orderSellerModify',
      component: orderSellerModify,
      meta:{title:'修改订单'}
    },
    {
      path: '/orderSellerDetail', //订单详情
      name: 'orderSellerDetail',
      component: orderSellerDetail,
      meta:{title:'订单详情'}
    },
    {
      path: '/groupConfirmPrint', //组团社确认单
      name: 'groupConfirmPrint',
      component: groupConfirmPrint,
      meta:{title:'组团社确认单'}
    },
    {
      path: '/groupNoticePrint', //出团通知书
      name: 'groupNoticePrint',
      component: groupNoticePrint,
      meta:{title:'出团通知书'}
    },{
      path: '/orderBuyerDetail', //买家订单详情
      name: 'orderBuyerDetail',
      component: orderBuyerDetail,
      meta:{title:'买家订单详情'}
    },
    {
      path: '/buyerOrderAll', //买家订单
      name: 'buyerOrderAll',
      component: buyerOrderAll,
      meta:{title:'买家订单'}
    },
    {
      path: '/sellerOrderAll', //买家订单
      name: 'sellerOrderAll',
      component: sellerOrderAll,
      meta:{title:'卖家订单'}
    },
    {
      path: '/contract', //买家订单
      name: 'contract',
      component: contract,
      meta:{title:'合同审核'}
    },   
    {
      path: '/product', //产品订单
      name: 'product',
      component: product,
      meta:{title:'产品订单'}
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
