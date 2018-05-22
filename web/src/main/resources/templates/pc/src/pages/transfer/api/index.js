
import resourceObj from './resourses';


export default {

  
  //组团社通知书
  getConfirmationForm: (data)=> {
    return resourceObj.orderResource.get({id:'getScheduleMessage'},data)
  }
}
