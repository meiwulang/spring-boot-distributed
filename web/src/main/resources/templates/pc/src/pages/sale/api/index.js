
import resourceObj from './resourses';


export default {

  //获得一班期的车座位
  selectBusList:(data)=>{
    return resourceObj.busResource.save({id:'selectBus'},data)
  },
  //出发站/始发站列表/Schedule/departuresWithStops/
  departuresWithStops:(data)=>{
    return resourceObj.pichupStationResource.save({id:'departuresWithStops'},data)
  },

  //订单详情
  orderDetail: (data)=> {
    return resourceObj.orderResource.save({id:'detail'},data)
  },
  //订单确认
  orderConfirm: (data)=> {
    return resourceObj.orderResource.save({id:'confirm'},data)
  },
  //支付记录
  orderPayRecords: (data)=> {
    return resourceObj.orderResource.save({id: 'orderPayRecords'}, data)
  },
  //组团社通知书
  getConfirmationForm: (data)=> {
    return resourceObj.orderResource.save({id:'groupConfirmationForm'},data)
  },
  //买家,卖家订单列表
  orderList: (data)=> {
    return resourceObj.orderResource.save({id:'searchOrders'},data)
  },
  // 产品维度订单列表
  orderProdList: (data)=> {
    return resourceObj.orderResource.save({id:'searchProdOrders'},data)
  },
  // 品牌列表查询
  brandList:(data)=>{
    return resourceObj.brandResource.save({id:'list'},data)
  },
  // 产品查询
  productList:(data)=>{
    return resourceObj.productResource.save({id:'list'},data)
  },
  // 单位
  companyList:(data)=>{
    return resourceObj.companyResource.save({id:'index'},data)
  },
  // 人员
  userList:(data)=>{
    return resourceObj.userResource.save({id:'list'},data)
  },
  //  线下支付
  offlinePay:(data)=>{
    return resourceObj.orderResource.save({id:'offlinePay'},data)
  },
  // 取消订单
  cancelOrder:(data)=>{
    return resourceObj.orderResource.save({id:'cancel'},data)
  },
  // 发送短信
  sendMessage:(data)=>{
    return resourceObj.orderResource.save({id:'sendSMS'},data)
  },
  exportOrder:(data)=>{
    return resourceObj.orderResource.save({id:'export'},data)
  },
  // 查询订单列表(用于合同审核页)
  getContractList:(data)=>{
    return resourceObj.orderResource.save({id:'searchContractOrders'},data)
  },  
  // 查询合同
  getContractDetail:(data)=>{
    return resourceObj.orderResource.save({id:'selectContract'},data)
    // return resourceObj.orderResource.get({id: 'selectContract'},orderId:data)
  },
  // 审核合同
  checkContract:(data)=>{
    return resourceObj.orderResource.save({id:'confirm'},data)
  },
  // 保存游客
  saveTouristInfo:(data)=>{
    return resourceObj.orderResource.save({id:'saveTourist'},data)
  },
  // 批量保存游客
  saveAllToutist:(data)=>{
    return resourceObj.orderResource.save({id:'batchSaveTourist'},data)
  },  
  // 查询游客信息
  getTouristInfo:(data,currpage,size)=>{
    return resourceObj.orderResource.get({id:'getTourists',orderId:data,pageNo:currpage,pageSize:size})
  }
}
