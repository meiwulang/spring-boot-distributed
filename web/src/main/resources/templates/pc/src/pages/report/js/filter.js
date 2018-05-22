import Vue from 'vue'


//订单状态
Vue.filter('levelTxt',function (val) {
  let returnVal = '';
  const num = Number(val);
  if(num == 1){
    returnVal ='一级'
  }
  else if(num == 2){
    returnVal ='二级'
  }
  else if(num == 3){
    returnVal ='三级'
  }
  else{
    returnVal =num;
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


