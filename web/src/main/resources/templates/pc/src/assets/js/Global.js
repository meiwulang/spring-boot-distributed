import Vue from 'vue'
import VueResource from 'vue-resource'
import api_prefix from '@/assets/js/apiUrl'
import VueRouter from 'vue-router'
Vue.use(VueResource)

if(!sessionStorage.loginData){
  window.location.href = "/login.html#/"
}

if (api_prefix != '') {
  Vue.http.options.xhr = { withCredentials: true }
}
//在拦截其中添加此属性即可
Vue.http.interceptors.push((request, next) => {
  //如果是前段服务器，则需要加入跨越携带cookie
  if (api_prefix != '') {
    request.credentials = true
  }
  //加入token
  if (sessionStorage.token) {
    request.headers.set('Authorization', sessionStorage.token)
  }

  /*
  * 在此处添加请求前拦截
  * */

  next((response) => {
    // if(!response.headers.ok){
    //   window.location.href="/login.html#/"
    // }
    /*
     *
     * 此处添加请求返回拦截
     * return response 表示继续执行，不return则结束
     * */
    if (response.body.code == -5) {
      window.location.href = "/login.html#/"
    }else if(response.body.code == -10){
      window.location.href = api_prefix.error_url;
    }else {
      return response;
    }
  })
})


window.FormatDate = function(date,fmt){  //格式化时间
  if(date instanceof Date){
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  throw new Error("日期格式转换发现错误的参数类型");
}

Date.prototype.FormatDate = function(fmt){  //格式化时间

    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


loginUrl();
function loginUrl(){
  let currentUrl = window.location.href;
  if( currentUrl.indexOf("login.html")>0&&(!currentUrl.endsWith("login.html")||!currentUrl.endsWith("login.html#")||!currentUrl.endsWith("login.html#/")) ){
    window.location.href='/login.html#/'
  }

}

String.prototype.TrimBlank = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

window.dateChange=function(value){
  let dd = new Date();
  dd.setDate(dd.getDate()+value);
  let y = dd.getFullYear();
  let m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
  let d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
  return y+"-"+m+"-"+d;
}


//计算天数差的函数
window.DateDiff=function(sDate1,sDate2){
  let  aDate,  oDate1,  oDate2,  iDays;
  aDate  =  sDate1.split("-");
  oDate1  =  new  Date(parseInt(aDate[1])  +  '-'  +  parseInt(aDate[2])  +  '-'  +  parseInt(aDate[0])) ;   //转换为12-18-2002格式
  aDate  =  sDate2.split("-");
  oDate2  =  new  Date(parseInt(aDate[1])  +  '-'  +  parseInt(aDate[2])  +  '-'  +  parseInt(aDate[0]));
  iDays  =  parseInt((oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
  return  iDays;
}

/*window.onbeforeunload = function()  {
  if(!sessionStorage.getItem("loginData")){
    this.$http.get(api_prefix.api_prefix + "user/logout").then(response => {
      if(response.body.code==0){
        location.href = "/login.html#/"
      }
    },response => {

    });
  }
}*/

//过滤参数
window.filterSendData = function (data,type) {
  for(var key in data) {
    if(Object.prototype.hasOwnProperty.call(data,key)) { //过滤
      if(key==='name'){
        console.log('data[key]');
        console.log(data[key]);
      }
      if(!data[key] && data[key] !== 0){
        if(type==='delete' || typeof type==='undefined'){//为不显示
          delete data[key];
        }
        else if(type==='blankStr'){//为空字符串
          data[key] ='';
        }
        else if(type==='null'){//为null
          data[key] =null;
        }
      }
    }
  }
  return data;
};

Array.prototype.removeArr = function(val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}
// 正则
window.RegExObj={
  // 金钱（两位小数且不能为负值）
  moneyTwoPoint:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  // 验证手机号
  mobildPhone:function(str){
		let reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
		return reg.test(str);
  },
  // 验证身份证号
  idCard:function(idcard) {
    var Errors = new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","验证失败，请注意数字或字母大小写的准确性，填写正确的验证信息!","身份证地区非法!");
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    }
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    var Area = area[parseInt(idcard.substr(0, 2))];
    if (Area == null)
        return {
            start: 0,
            info: Errors[4]
        };
    //身份号码位数及格式检验
    var Birthday = ''
      , sexCode = '';
    switch (idcard.length) {
	    case 15:
	        Birthday = '19' + idcard.substr(6, 2) + '-' + idcard.substr(8, 2) + '-' + idcard.substr(10, 2);
	        sexCode = idcard.substring(14, 15);
	        break;
	    case 18:
	        //18位身份号码检测
	        //出生日期的合法性检查
	        Birthday = idcard.substr(6, 4) + '-' + idcard.substr(10, 2) + '-' + idcard.substr(12, 2);
	        sexCode = idcard.substring(16, 17);
	        //计算校验位
	        S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
	        Y = S % 11;
	        M = "F";
	        JYM = "10X98765432";
	        M = JYM.substr(Y, 1);
	        //判断校验位
	        if (M == idcard_array[17]) {//return Errors[0]; //检测ID的校验位
	        } else {
	            return {
	                start: 0,
	                info: Errors[3]
	            };
	        }
	        break;
	    default:
	        return {
	            start: 0,
	            info: Errors[1]
	        };
	        break;
    }
    var cSex = '';
    if (sexCode % 2 == 0) {
        cSex = '女';
    } else {
        cSex = '男';
    }
    return {
        start: 1,
        data: {
            area: Area,
            birthday: Birthday,
            sex: cSex
        }
    };
},
  // 验证护照
  passport:function(str){
		let reg = /^1[45][0-9]{7}|([P|S]\d{7})|([S|G]\d{8})|([G|T|S|L|Q|D|A|F|E]\d{8})|([G|T|S|L|Q|D|A|F|E][\w]\d{7})|([H|M]\d{8,10})$/;
		return reg.test(str);
  },
}

window.menuData = null


