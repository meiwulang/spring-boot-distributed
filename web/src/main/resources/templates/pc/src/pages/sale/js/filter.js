import Vue from 'vue'


//订单状态
Vue.filter('orderStatus',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='待审核'
  }
  else if(num == 1){
    returnVal ='已报名'
  }
  else if(num == 2){
    returnVal ='收款中'
  }
  else if(num == 3){
    returnVal ='已全款'
  }
  else if(num == 4){
    returnVal ='已取消'
  }
  else if(num == 6){
    returnVal ='已驳回'
  } 
  else if(num == 10){
    returnVal ='已首款'
  }  
  else if(num == 11){
    returnVal ='已报名'
  }    
  return returnVal;
});

//操作状态
Vue.filter('optionStatus',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='待处理'
  }
  else if(num == 1){
    returnVal ='已处理 '
  }
  else {
    returnVal ='-'
  }
  return returnVal;
});

//证件类型
Vue.filter('licenceType',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='身份证'
  }
  else if(num == 1){
    returnVal ='护照'
  }
  else if(num == 2){
    returnVal ='军官证'
  }
  else if(num == 3){
    returnVal ='回乡证 '
  }
  else if(num == 4){
    returnVal ='台胞证'
  }
  else if(num == 5){
    returnVal ='国际海员证'
  }
  else if(num == 6){
    returnVal ='港澳通行证'
  }
  else if(num == 7){
    returnVal ='赴台证'
  }
  else if(num == 8){
    returnVal ='其他'
  }

  return returnVal;
});


//票种类型
Vue.filter('ticketType',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='单票 '
  }
  else if(num == 1){
    returnVal ='套票  '
  }
  return returnVal;
});

//票价类型
Vue.filter('ticketPriceType',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='成人票'
  }
  else if(num == 1){
    returnVal ='儿童票'
  }
  return returnVal;
});


//支付方式
Vue.filter('payType',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='在线支付'
  }
  else if(num == 1){
    returnVal ='信用支付'
  }
  else if(num == 2){
    returnVal ='线下支付'
  }
  else if(num == 3){
    returnVal ='微信支付'
  }
  return returnVal;
});

//支付状态
Vue.filter('payStatus',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='未加入'
  }
  else if(num == 1){
    returnVal ='加入 '
  }
  else if(num == 2){
    returnVal ='线下支付'
  }
  return returnVal;
});

// 账单状态( 信用账单状态1, 在线账单状态0)
Vue.filter('billStatus',function (val,billType) {
  let returnVal = '';
  const billTypeNum = Number(billType);
  const num = Number(val);
  if(billTypeNum == 0){ //在线账单状态0
    if(num == 0){
      returnVal ='生成'
    }
    else if(num == 1){
      returnVal ='处理中'
    }
    else if(num == 2){
      returnVal ='已受理'
    }
    else if(num == 3){
      returnVal ='已提现'
    }
    else if(num == 4){
      returnVal ='失败'
    }
  }
  else if(billTypeNum == 1){ //信用单状态1
    if(num == 0){
      returnVal ='未还款'
    }
    else if(num == 1){
      returnVal ='未还完'
    }
    else if(num == 2){
      returnVal ='已还完'
    }
    else if(num == 3){
      returnVal ='已撤销'
    }
  }
  else {
    returnVal ='-'
  }
  return returnVal;
});


// 账单类型
Vue.filter('billType',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='线上账单'
  }
  else if(num == 1){
    returnVal ='信用账单 '
  }
  else {
    returnVal ='-'
  }
  return returnVal;
});

//账单生成方式
Vue.filter('billGenerateMethod',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 0){
    returnVal ='自动账单'
  }
  else if(num == 1){
    returnVal ='手动账单'
  }
  else {
    returnVal ='-'
  }
  return returnVal;
});

//接送站点类型
Vue.filter('stationType',function (val) {
  let returnVal = 'null';
  const num = Number(val);
  if(num == 0){
    returnVal ='始';//始发站
  }
  else if(num == 1){
    returnVal ='顺 ';//顺路站
  }
  else if(num == 2){
    returnVal ='班';//班车站
  }
  return returnVal;
});
