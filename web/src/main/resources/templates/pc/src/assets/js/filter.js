import Vue from 'vue'


//金钱保留两位小数
Vue.filter('moneyTwoPoints',function (val,type) {
  var returnVal = '0.00';
  if(val == null|| typeof val == 'undefined'){
    returnVal = '';
    return returnVal;
  }
  else{
    var selVal = $.trim(val.toString());
    if(selVal == ''){
      returnVal = '';
      return returnVal;
    }
    else{
      if(selVal.indexOf('.') == -1){   //整数
        returnVal = selVal+".00";
      }
      else{
        var arrNum = selVal.split(".");
        var pointNum = arrNum[1];
        if(pointNum.length == 1){ //一位小数
          returnVal = selVal +'0';
        }
        else if(pointNum.length == 2){ //两位小数
          returnVal = selVal;
        }
        else{     //两位以上小数
          arrNum[1] = pointNum.substring(0,2);
          returnVal = arrNum.join('.');
        }
      }
    }
  }
  if(type==1){
    return returnVal;
  }else{
    return '￥'+returnVal;
  }
  
});

//格式化时间
  //type为'time'时，表示格式化为yyyy-mm-dd hh:mm:ss ；没有时  格式化为yyyy-mm-dd
  Vue.filter('dateFormat',function(value,type,blank){
    if(value== '' || value == null || typeof value == 'undefined' || isNaN(value)){
      if(blank == '--'){
        return '-- --';
      }
      return '';
    }
  var unixTimestamp = new Date(value);
  var oYear = unixTimestamp.getFullYear();
  var oMonth = unixTimestamp.getMonth() + 1;
  var oDay = unixTimestamp.getDate();
  var oHour = unixTimestamp.getHours();
  var oMin = unixTimestamp.getMinutes();
  var oSen = unixTimestamp.getSeconds();
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
  var oTimeJust =  oHour + ':' + getzf(oMin);
  //补0操作
  function getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  }
  if(type == 'time'){
    return oTime;
  }
  else if(type == 'hm'){
    return oTimeJust;
  }
  return oTime.substring(0,10);

});
//格式化时间
  //type为'time'时，表示格式化为yyyy-mm-dd hh:mm:ss ；没有时  格式化为yyyy-mm-dd
  Vue.filter('dateFormatTwo',function(value,type,blank){
    if(value== '' || value == null || typeof value == 'undefined' || isNaN(value)){
      if(blank == '--'){
        return '-- --';
      }
      return '';
    }
  var unixTimestamp = new Date(value);
  var oYear = unixTimestamp.getFullYear();
  var oMonth = unixTimestamp.getMonth() + 1;
  var oDay = unixTimestamp.getDate();
  var oHour = unixTimestamp.getHours();
  var oMin = unixTimestamp.getMinutes();
  var oSen = unixTimestamp.getSeconds();
  var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
  var oTimeJust =  oHour + ':' + getzf(oMin);
  //补0操作
  function getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  }
  if(type == 'time'){
    return oTime;
  }
  else if(type == 'hm'){
    return oTimeJust;
  }
  return oTime;

});


  //日期加天数
Vue.filter('addDate',function (value,days) {
  if(value== '' || value == null || typeof value == 'undefined' || isNaN(value)){
    return '';
  }
  var a = new Date(value);
  a = a.valueOf();
  a = a + (days-1) * 24 * 60 * 60 * 1000;
  a = new Date(a);
  return a;
});

// 线路类型
Vue.filter('lineType',function (value) {
    let type={
      "0": "全部类型",
      "10": "周边短线",
      "11": "国内长线",
      "20": "出境长线",
      "21": "出境短线",
      "30": "邮轮",
      "50": "自由行",
      "51": "出境海岛",
      "52": "定制旅游",
      "54": "团队会奖",
      "55": "签证服务",
      "56": "机票预订",
      "57": "酒店预订",
      "58": "单项委托",
      "59": "其他服务",
      "60": "户外拓展",
      "61": "游学/研学",
      "62": "自驾游",
      "63": "全球旅拍",
      "64": "旅游金融",
      "65": "旅游地产",
      "66": "亲子",
    };
    for(let val in type){
      if(value==val){
        return type[val];
        break;
      }
    }
});