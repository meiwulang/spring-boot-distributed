
import resourceObj from './resourses';


export default {
  //获取参数time和accesstoken
  getEncodingParam:(data)=> {
    return resourceObj.reportResource.save({id:'encodingParam'},data);
  },
  //代理人销售总额趋势
  saleTrend:(data)=> {
    return resourceObj.saleTrendResource.save({id:'detail'},data);
  },  
  //所有代理人销售总额趋势
  saleAllTrend:(data)=> {
    return resourceObj.saleTrendResource.save({id:'sumdetail'},data);
  },    

}
