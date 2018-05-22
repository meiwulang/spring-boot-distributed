
import resourceObj from './resource';


export default {
  //近期订单信息
  recentOrderInfo: (data)=> {
    return resourceObj.orderResource.save({id:'recentOrderInfo'},data)
  },
  //获取参数time和accesstoken
  getEncodingParam:(data)=> {
    return resourceObj.reportResource.save({id:'encodingParam'},data);
  },  
}
