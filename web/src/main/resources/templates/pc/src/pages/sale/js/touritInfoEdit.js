

import {validatePhone,validateUserCard} from  '@/assets/js/validate';

let TouristFormOption = class {
  constructor(tableData) {
    this.touristData = null;
    this.mainTouristData = {id:'',mainName: '', mainPhone: '', mainIndex: '', adultNum: 0, childrenNum: 0};
    this.touristFormData = {otName:{}, otPhone:{}, otLicenceType:{}, otLincese:{}};
    //验证规则
    this.touristFormRulses = {
      name: [{required: true, message: '请输入游客姓名', trigger: 'blur'}],
      phone: [{required: true, message: '请输入游客电话', trigger: 'blur'}, {
        validator: validatePhone,
        message: '电话号码不正确',
        trigger: 'blur'
      }],
      phoneReg: [{validator: validatePhone, message: '电话号码不正确', trigger: 'blur'}],
      licenceNumBlank: [],
      licenceJustIdBlank: [],
      licenceNumReq: [{required: true, message: '请输入证件号码', trigger: 'blur'}],
      licenceIdReg: [{validator: validateUserCard, message: '身份证号码不正确', trigger: 'blur'}],
      licenceNum: [
        {required: true, message: '请输入证件号码', trigger: 'blur'},
        {validator: validateUserCard, message: '身份证号码不正确', trigger: 'blur'}
      ],
    };
  }

  //获取游客第一个大人的信息，在列表中的index，name,phone,计算大人，小孩个数
  getMainTouristData(touristDataPram) {
    let mainTouristData = {id:'',mainName: '', mainPhone: '', adultNum: 0, childrenNum: 0};
    const touristData = touristDataPram || this.touristData;
    let adultInfo = [];
    let childrenInfo = [];
    if (touristData.length == 0) {
      console.log('tourist list is blank');
      this.mainTouristData = mainTouristData;
      return mainTouristData;
    }
    touristData.forEach((item, index, arr) => {
      if (Number(item.otType) == 0) { //大人
        adultInfo.push(item);
      }
      if (Number(item.otType) == 1) { //小孩
        childrenInfo.push(item);
      }
    });
    mainTouristData.adultNum = adultInfo.length;
    mainTouristData.childrenNum = childrenInfo.length;
    if (mainTouristData.adultNum !== 0) {
      mainTouristData.id = adultInfo[0].id;
      mainTouristData.mainName = adultInfo[0].otName;
      mainTouristData.mainPhone = adultInfo[0].otPhone;
    }
    else if (mainTouristData.adultNum === 0 && childrenInfo.adultNum !== 0) {
      mainTouristData.id = childrenInfo[0].id;
      mainTouristData.mainName = childrenInfo[0].otName;
      mainTouristData.mainPhone = childrenInfo[0].otPhone;
    }
    this.mainTouristData = mainTouristData;
    return mainTouristData;
  }

  //数据转化为 套票和单票两种数据
  turnTableData(tableData){
    let singleTicketArr = [];
    let packageTicketArr = [];
    tableData.forEach((item)=>{
      if(item.otTicketType  == 0){
        singleTicketArr.push(item);
      }
      else if(item.otTicketType  == 1){
        packageTicketArr.push(item);
      }
    });
    let newArr = {};
    packageTicketArr.forEach((item)=>{
      if(newArr[item.otTicketId]){
        newArr[item.otTicketId].push(item);
      }
      else{
        newArr[item.otTicketId] = [item];
      }
    });
    let newArr2 = [];
    for(let arr in newArr){
      let my = {
        otTicketType : newArr[arr][0].otTicketType,
        tPeerPrice:newArr[arr][0].tPeerPrice,
        children:newArr[arr]
      }
      newArr2.push(my)
    }
    return{
      singleTicket:singleTicketArr,
      packageTicket:newArr2
    }

  }

  //根据证件类型不同 证件号码添加不同的验证
  setLicenceValidateRules(licenceType, id) {
    const touristFormRules = this.touristFormRulses;
    const mainTouristData = this.mainTouristData;
    //licenceType = 0 为身份证
    if (licenceType === 0 && id === mainTouristData.id) {
      touristFormRules.licenceNumBlank = touristFormRules.licenceNum;
      console.log(999)
      console.log(touristFormRules.licenceNumBlank)
    }
    else if(licenceType !== 0 && id === mainTouristData.id) {
      touristFormRules.licenceNumBlank = touristFormRules.licenceNumReq;
      console.log(888)
      console.log(touristFormRules.licenceNumBlank)
    }
    else if (licenceType === 0 && id !== mainTouristData.id) {
      touristFormRules.licenceJustIdBlank = touristFormRules.licenceIdReg;
    }
    else if (licenceType !== 0 && id !== mainTouristData.id) {
      touristFormRules.licenceJustIdBlank = [];
    }
  }

  //选择证件类型，如有初始数据，保存显示，选择不同的证件类型，证件号添加不同的验证
  licenceTypeSelectChange(id) {
    const touristFormData = this.touristFormData;
    const licenceType = touristFormData.otLicenceType[id];
    const initLicenceType = touristFormData.initOtLicenceType[id];
    const initLicenceNum = touristFormData.initOtLincese[id];
    if (licenceType === initLicenceType) {
      touristFormData.otLincese[id]= initLicenceNum;
    }
    else {
      touristFormData.otLincese[id] = '';
    }
    this.setLicenceValidateRules(licenceType, id);
    return touristFormData;
  }

  //获取数据后表单数据转换
  touristFormExecute(tableData) {
    let initForm = {otName:{}, otPhone:{}, otLicenceType:{}, otLincese:{},initOtLicenceType:{},initOtLincese:{}};
    if(tableData.length === 0){
      console.log('tableData.length === 0');
      this.touristFormData = initForm;
      return initForm;
    }
    this.mainTouristData = this.getMainTouristData(tableData);
    for(var key in initForm){
      let formObj = initForm[key];
      tableData.forEach((item)=>{
        const id = item.id;
        if(key === 'initOtLicenceType'){
          formObj[id] = item.otLicenceType;
        }
        else  if(key === 'initOtLincese'){
          formObj[id] = item.otLincese;
        }
        else{
          formObj[id] = item[key];
        }
        //this.setLicenceValidateRules(item.otLicenceType, item.id);
      });
    }
    this.touristFormData = initForm;
    return initForm;
  }
};

export default new TouristFormOption();
