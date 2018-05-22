
//手机号验证
const mobile = /^1[3|4|5|6|7|8|9]\d{9}$/;
const phone = /^0\d{2,3}-?\d{7,8}$/;
const phoneNew = /^((\d{3,4})|\d{3,4}-|\s)?\d{7,14}$/;
export const validatePhone = function(rule, value, callback){
  if(value.trim() == ''){
    callback();
  }
  else if ( !(mobile.test(value))) {
    callback(new Error('请输入正确的手机号码'));
  } else if (!(phoneNew.test(value))) {
    callback(new Error('请输入正确的电话号码'));
  }else{
    callback();
  }
}
//身份证验证
export const validateUserCard = function(rule, value, callback){
  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
  if(value.trim() == '') {
    callback();
  }else if(!(reg.test(value))){
    callback(new Error('请输入正确的身份证'));
  }else{
    callback()
  }
}

//日期格式校验
export const validateDate = (rule, value, callback) => {
  var strRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if(value.trim() == '') {
    callback();
  }
  else if(!strRegex.test(value)){
    callback(new Error('日期格式不正确'));
  }else{
    callback();
  }
}
//时间格式校验
export const validateTime = (rule, value, callback) => {

  var strRegex = /^(\d+)-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
 if(value.trim() == '') {
    callback();
  }
  else if(!strRegex.test(value)){
    callback(new Error('时间格式不正确'));
  }else{
    callback();
  }
}

//空格校验
export const validateSpacing = (rule, value, callback) => {
  if (value.trim() == '') {
    callback(new Error('不允许输入全空格'));
  }else{
    callback();
  }
}


//验证不能为空，element-ui验证select等value值为整数时的非空
export const requiredMust = function(rule, value, callback){
  const val = value.toString().trim();
  if (val ==='') {
    callback(new Error('不能为空'));
  }
  else{
    callback();
  }

};

//金钱校验(不能为负数)
export const validateMoney = (rule, value, callback) => {
  var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  // var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/;
  // var reg = /^((\d+)|0)(\.\d{1,2})?$/;
  if (!value) {
    callback();
  }
  else if (value.toString().trim() == '') {
    callback();
  }
  else if(!reg.test(value)){ 
      callback(new Error('格式不正确（参考：99.88，无小数或最多两位小数）'));
    }else{
    callback();
  }
}

// 正整数校验
export const integerMoney = (rule, value, callback) => {
  var reg = /^[1-9]\d*$/;
  if (!value) {
    callback();
  }
  else if (value.toString().trim() == '') {
    callback();
  }
  else if(!reg.test(value)){ 
      callback(new Error('格式不正确，请输入正整数'));
    }else{
    callback();
  }
}

