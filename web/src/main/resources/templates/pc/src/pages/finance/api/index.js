import { order_refund, label,billResource} from './resource';

export default {
    // 线下退款列表
    refundList: (data) => {
        return order_refund.save({ id: 'list' }, data)
    },
    // 线下退款标记
    refundLabelUpdate: (data) => {
        return order_refund.save({ id: 'update' }, data)
    },
    // 线下退款列表
    refundLabel: (data) => {
        return label.save({ id: 'list' }, data)
    },
    //在线账单
    getOnlineBill: (data) => {
        return billResource.save({ id: 'queryOnlinePage' }, data)
    },
     //在线账单详情
     getOnlineBillDetail: (data) => {
        return billResource.save({ id: 'queryOnlineBill' }, data,{ emulateJSON: true })
    }
}