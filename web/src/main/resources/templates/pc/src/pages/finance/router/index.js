import Vue from 'vue'
import Router from 'vue-router'
import creditBill from '@/pages/finance/creditBill/creditBill';
import creditBillPrint from '@/pages/finance/creditBill/creditBillPrint';
import creditBillRemove from '@/pages/finance/creditBill/creditBillRemove';
import generateCreditBill from '@/pages/finance/creditBillGenerate/creditBillGenerate';
import generateCreditBillByManual from '@/pages/finance/creditBillGenerate/creditBillGenerateByManual';
import creditManage from '@/pages/finance/creditManage/creditManage';
import creditAdd from '@/pages/finance/creditManage/creditAdd';
import onlineBill from '@/pages/finance/onlineBill/onlineBill';
import onlineBillPrint from '@/pages/finance/onlineBill/onlineBillPrint';
import offlineRefund from '@/pages/finance/offlineRefund/offlineRefund';
import warnOfWithdraw from '@/pages/finance/warnOfWithdrawFail/warnOfWithdraw';
import warnOfTransfer from '@/pages/finance/warnOfTransferFail/warnOfTransfer';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'creditBill',
            component: creditBill,
            meta: { title: '财务中心' }
        }, {
            path: '/creditBill', //应收信用账单
            name: 'creditBill',
            component: creditBill,
            meta: { title: '应收信用账单' }
        }, {
            path: '/creditBill/creditBillPrint', //应收信用账单打印
            name: 'creditBillPrint',
            component: creditBillPrint,
            meta: { title: '打印应收信用账单' }
        },{
            path: '/creditBill/creditBillRemove', //应收信用账单移除
            name: 'creditBillRemove',
            component: creditBillRemove,
            meta: { title: '移除应收信用账单' }
        }, {
            path: '/generateCreditBill', //生成信用账单
            name: 'generateCreditBill',
            component: generateCreditBill,
            meta: { title: '生成信用账单' }
        },{
            path: '/generateCreditBill/generateCreditBillByManual', //手动生成信用账单
            name: 'generateCreditBillByManual',
            component: generateCreditBillByManual,
            meta: { title: '手动生成信用账单' }
        },{
            path: '/creditManage', //授信管理
            name: 'creditManage',
            component: creditManage,
            meta: { title: '授信管理' }
        }, {
            path: '/creditManage/creditAdd', //新增授信
            name: 'creditAdd',
            component: creditAdd,
            meta: { title: '新增授信' }
        }, {
            path: '/warnOfWithdraw', //提现失败预警
            name: 'warnOfWithdraw',
            component: warnOfWithdraw,
            meta: {title: '提现失败预警'}
        }, {
            path: '/warnOfTransfer', //转账失败预警
            name: 'warnOfTransfer',
            component: warnOfTransfer,
            meta: {title: '转账失败预警'}
        },{
            path: '/onlineBill', //应收信用账单
            name: 'onlineBill',
            component: onlineBill,
            meta: { title: '应收在线账单' }
        },{
            path: '/onlineBillPrint', //应收信用账单
            name: 'onlineBillPrint',
            component: onlineBillPrint,
            meta: { title: '打印应收在线账单' }
        },{
            path: '/offlineRefund', //线下退款
            name: 'offlineRefund',
            component: offlineRefund,
            meta: { title: '线下退款' }
        },
    ]
})
