// 一些公共使用的JS方法

/**
 * 获取当前时间的毫秒数
 * @param d
 * @return {String}
 */
function time(d){
    var date=new Date();
    var yy=date.getFullYear();
    var MM=(date.getMonth() + 1);
    var dd=date.getDay();
    var hh=date.getHours();
    var mm=date.getMinutes();
    var ss=date.getSeconds();
    var sss=date.getMilliseconds();
    var result=Date.UTC(yy,MM,dd,hh,mm,ss,sss);
    return result;
};

function addDate(date,days, split){
    if (!split) split = '';
    var d=new Date(date);
    d.setDate(d.getDate()+days);
    var month=d.getMonth()+1;
    var day = d.getDate();
    if(month<10) month = "0"+month;
    if(day<10) day = "0"+day;
    var val = d.getFullYear()+split+month+split+day;
    return val;
};

/**
 * 经典代码 iFrame 自适应高度，在IE6/IE7/IE8/Firefox/Opera/Chrome/Safari通过测试
 */
function iFrameAutoHeight(id) {
    var ifm= document.getElementById(id);
    var subWeb = document.frames ? document.frames[id].document : ifm.contentDocument;
    if(ifm != null && subWeb != null) {
        ifm.height = (subWeb.body.scrollHeight + 20);
    }
};

/**
 * 桌面通知实体方法
 * @param option
 */
function showNotification(option) {
    var title = '系统管理',
        icon = $app_public_images_path + 'tip.png',
        msg = '您没有指定提示的内容。',
        fn = function(){ };
    if (!option){ option = {}; }
    if (!option.title) option.title = title;
    if (!option.icon) option.icon = icon;
    if (!option.msg) option.msg = msg;
    if (!option.onshow) option.onshow = function(){ };
    if (!option.onclick) option.onclick = function(){ this.cancel(); };
    if (!option.onerror) option.onerror = function(){ };
    if (!option.onclose) option.onclose = function(){ };

    if (window.webkitNotifications.checkPermission() === 0) {
        var noti = window.webkitNotifications.createNotification(option.icon, option.title, option.msg);
        noti.onshow = option.onshow;
        noti.onclick = option.onclick;
        noti.onclose = option.onclose;
        noti.onerror = option.onerror;
        if (option.id) noti.replaceId = option.id;
        noti.show();
    }else{
        window.webkitNotifications.requestPermission(function(){ showNotification(option)});
    }
}

/**
 * ExtJs中 Column的函数  用于根据Action里push出来的status数据替换Column中的值
 * @param d
 * @return {String}
 */
function mystatus(value, metaData, record, rowIndex, colIndex, store){
    var theval='_'+this.dataIndex;
    var arr=eval(theval);
    var str=eval('arr.'+value);
    if(str){
        return str;
    }
    return '未知';
};


function delAlert(from,fromId){
    Ext.Ajax.request({
        url:$__app__+'/Alert/del',
        method:'POST',
        params:{from:from,fromId:fromId},
        success:function(response, opts){
            var ret=Ext.decode(response.responseText);
        }
    });
};


function CKEditorDataIsEmpty(str){
    str = filterHtml(str);
    if (str=='') return true;
    return false;
};

function filterHtml(str){
    if (str==null || str=='') return '';
    str = str.replace(/<\/?[^>]*>/g, '');
    str = str.replace(/\n/g,'');
    str = str.replace(/\r/g,'');
    str = str.replace(/\s/g,'');
    str = str.replace(/&nbsp;/g,'');
    return str;
};

function roleItems(values){
    if (!values) return "";
    var html = '<div class="item">';
    for (var i=0; i<values.length; i++){
        var item = values[i], l=item._layer, sw=l*20, txt=item.text, id=item.id, c=item._child?true:false,
            b=item._btn?true:false,h=c?' child':'', v=item.module+'::'+item.action;
        html += '<div class="mi"><label class="select-warp module" id="'+v+'">'+
            '<img src="'+$__app__+'/s.gif" class="s-split" style="width:'+sw+'px" />'+
            '<img src="'+$__app__+'/s.gif" class="s-header'+h+'"/>'+
            '<img src="'+$__app__+'/s.gif" class="s-checkbox"/>'+ txt +
            '</label>';
        if (b){
            var hbtn = roleItemsBtn(item._btn);
            html += hbtn;
        }
        if (c) {
            var hcld = roleItems(item._child);
            html += hcld;
        }
        html += '<div class="x-clear"></div></div>';
    }
    return html + '</div>';
};

function roleItemsBtn(_btn){
    if (!_btn) return "";
    var btn = "";
    for (var b=0; b<_btn.length; b++){
        var item = _btn[b], l=item._layer, sw=l*20, txt=item.text, id=item.id, v=item.module+'::'+item.action;
        btn += '<label class="select-warp" id="'+v+'">' +
            '<img src="'+$__app__+'/s.gif" class="s-checkbox"/>'+ txt +
            '</label>';
    }
    return btn;
};


/**
 *
 * @param pic_path：原图路径
 * @param size：要返回的图片规则
 * @return 改变以后的图片路径
 */
function format_pic_path(pic_path, size){
    if (size==null || size=='') size = "_s";
    if(pic_path){
        var pic_index = pic_path.lastIndexOf(".");
        var fore_str = pic_path.substring(0, pic_index);
        var Suffix = pic_path.substring(pic_index);
        return fore_str + size + Suffix;
    }
};

/**
 * 判断浏览器
 * @type {Object}
 * " 是否为移动终端: "+browser.versions.mobil
 */
var browser = {
    versions:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident:u.indexOf('Trident') > -1, //IE内核
            presto:u.indexOf('Presto') > -1, //opera内核
            webKit:u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile:!!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android:u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone:u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad:u.indexOf('iPad') > -1, //是否iPad
            webApp:u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};


/**
 * 格式化数字型日期的显示
 * 20131008 => 2013-10-08
 * @param daytime
 * @return {*}
 */
function int2date(daytime, is_date){
    if(daytime.indexOf('-')<1){
        var Y = daytime.substr (0,4);
        var M = daytime.substr (4,2);
        var D = daytime.substr (6,2);
        if (!is_date)
            return Y + '-' + M + '-' + D;
        else
            return new Date(Y, M, D);
    }else{
        return daytime;
    }
};

function int2float(daytime, is_date){
    if(daytime.indexOf('-')<1){
        var Y = daytime.substr (0,4);
        var M = daytime.substr (4,2);
        var D = daytime.substr (6,2);
        if (!is_date)
            return M + '/' + D;
        else
            return new Date(Y, M, D);
    }else{
        return daytime;
    }
}

function number2date($num){
    if (!$num) return '';
    if ($num.toString().length != 8) return $num;
    var y, m, d;
    y = $num.toString().substr(0,4);
    m = $num.toString().substr(4,2);
    d = $num.toString().substr(6,2);
    return y + '-' + m + '-' + d;
};

function str2date(daytime){
    if(daytime.indexOf('-')>0){
        daytime=daytime.split('-');
        var str_day='';
        for(var i=0;i<daytime.length;i++){
            str_day+=daytime[i];
        }
        return str_day;
    }else{
        return daytime;
    }
}

/**Parses string formatted as YYYY-MM-DD to a Date object.
 * If the supplied string does not match the format, an
 * invalid Date (value NaN) is returned.
 * @param {string} dateStringInRange format YYYY-MM-DD, with year in
 * range of 0000-9999, inclusive.
 * @return {Date} Date object representing the string.
 */
function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);

    if(parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if(month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
}


/**
 * 切换皮肤的方法
 * @param b
 */
function set_theme(b){
    try{
        Ext.util.Cookies.set('xtheme', b.xtheme);
        Ext.util.CSS.swapStyleSheet('theme', $app_public_ext_path + 'resources/css/' + b.xtheme);
        var MainTabPanel = Ext.getCmp('MainTabPanel'); //得到tab组件
        var tab = MainTabPanel.getActiveTab();
        eval("window.ifm_" + tab.id + ".set_theme({xtheme:'"+b.xtheme+"'});");
    }catch(e){
        // error
    }
};

function show_size(v){
    return parseInt(v/1024)+'kb';
};

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//js in_array
function inArray(needle,array,bool){
    if(typeof needle=="string"||typeof needle=="number"){
        var len=array.length;
        for(var i=0;i<len;i++){
            if(needle==array[i]){
                if(bool){
                    return i;
                }
                return true;
            }
        }
        return false;
    }
}


/**
 * 判断值是否在数组内
 * @param $value
 * @param $array
 * @return {*}
 */
function in_array($value, $array){
    if (typeof $array != 'object') return false;
    for (var $i=0; $i<$array.length; $i++){
        if ( $value == $array[$i] ) return $i;
    }
    return -1;
};

var getDate=function(str){
    var tempDate=new Date();
    if(str.indexOf('-'))str=str.replace(/\-/g,'');
    if(str.length!=8)return 0;
    tempDate.setFullYear(str.substr(0,4));
    tempDate.setMonth(str.substr(4,2)-1);
    tempDate.setDate(str.substr(6,2));
    return [tempDate,str];
}

function date_lousy(value1,value2){
    var days_start=getDate(value1);
    var days_end=getDate(value2);
    if(days_start[0]==0 || days_end[0]==0)return '';
    var date1=days_start[0];
    var date2=days_end[0];
    if(date1>date2){
        var tempDate=date1;
        date1=date2;
        date2=tempDate;
    }
    date1.setDate(date1.getDate()+1);
    var days_date=[days_start[1]];
    if(days_start[1]==days_end[1]) return days_date;
    var max_i=0;
    while(!(date1.getFullYear()==date2.getFullYear()&&date1.getMonth()==date2.getMonth()&&date1.getDate()==date2.getDate())){
        if(max_i>60)break;
        var month=(date1.getMonth()+1);
        if(month<10)month='0'+month;
        var days=date1.getDate();
        if(days<10)days='0'+days;
        month=month.toString();
        days=days.toString();
        days_date.push(date1.getFullYear().toString()+month+days);
        date1.setDate(date1.getDate()+1);
        max_i++;
    }
    days_date.push(days_end[1]);
    return days_date;
}


SUNTOUR = {
    data : {},
    setData: function(key, store, rewrite){
        if (!key) throw new Error(68669902, 'Key name cannot be empty.');
        if (top.SUNTOUR['data'][key] && rewrite){
            top.SUNTOUR['data'][key] = store;
        }else if ( store ){
            top.SUNTOUR['data'][key] = store;
        }else{
            return null;
        };
        return top.SUNTOUR['data'][key];
    },

    getData: function(key){
        if (top.SUNTOUR['data'][key]){
            return top.SUNTOUR['data'][key];
        }else{
            return null;
        };
    },

    rowIndex: function(key, index){
        var $key_row = key + '_row_index';
        if (index > -1){
            top.SUNTOUR['data'][$key_row] = index;
            return top.SUNTOUR['data'][$key_row];
        }else if (top.SUNTOUR['data'][$key_row]) {
            return top.SUNTOUR['data'][$key_row];
        }else{
            return -1;
        }
    }
};

/**
 * 配置全局变量的方法
 * @param $key 保存数据对象的键名
 * @param $data|function 数据对象或方法
 * @return {*}
 */
function $SUNTOUR($key, $data){
    //alert( typeof $data ); return;
    if (top.SUNTOUR[$key]) return top.SUNTOUR[$key];
    if (typeof $data == 'object'){
        top.SUNTOUR[$key] = $data;
    }
    return top.SUNTOUR[$key] ? top.SUNTOUR[$key] : null;
};


function $SUNTOUR_ROW_INDEX($key, $index){
    var $key_row = $key + '_row_index';
    if (top.SUNTOUR[$key_row]) return top.SUNTOUR[$key_row];
    top.SUNTOUR[$key_row] = -1;
    if ($index > -1) top.SUNTOUR[$key_row] = $index;
    return top.SUNTOUR[$key_row];
};

function $SUNTOUR_ROW_CHANGE($key, $json){
    var $key_row = $key + '_row';
    if (top.SUNTOUR[$key_row] && $json) {
        try{
            for (var field in $json){
                top.SUNTOUR[$key_row].set(field, $json[field]);
            }
        }catch(e){}
    }
    return top.SUNTOUR[$key_row] ? top.SUNTOUR[$key_row] : false;
};

/**
 * 根据字符串获取指定的日期对象
 * @param datestr
 * @param format
 * @return {*}
 */
function str_to_date(datestr, format){
    var tmp = datestr.split('-');
    var _date = new Date(tmp[0], tmp[1]-1, tmp[2]);
    if (!format) return _date;
    return Ext.Date.format(_date,format);
  //  return _date.format(format); // 这个用法基于ExtJS
};

var O2String = function (O) {
    //return JSON.stringify(jsonobj);
    var S = [];
    var J = "";
    if (Object.prototype.toString.apply(O) === '[object Array]') {
        for (var i = 0; i < O.length; i++)
            S.push(O2String(O[i]));
        J = '[' + S.join(',') + ']';
    }
    else if (Object.prototype.toString.apply(O) === '[object Date]') {
        J = "new Date(" + O.getTime() + ")";
    }
    else if (Object.prototype.toString.apply(O) === '[object RegExp]' || Object.prototype.toString.apply(O) === '[object Function]') {
        J = O.toString();
    }
    else if (Object.prototype.toString.apply(O) === '[object Object]') {
        for (var i in O) {
            O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? O2String(O[i]) : O[i]);
            S.push('"'+i + '":' + O[i]);
        }
        J = '{' + S.join(',') + '}';
    }

    return J;
};

/**
 * Json对象转字符串方法
 * @param obj json对象
 * @returns {string}
 * @constructor
 */
function Json2String(obj){
    if (!obj || typeof obj !== 'object') return 'null';
    var str='';
    if (isArray(obj)){
        str = encodeArray(obj);
    }else if (isObject(obj)){
        str = encodeObject(obj);
    };
    return str;
};


/**
 * 将数组编码成字符串
 * @param v
 * @returns {string}
 */
function encodeArray(v){
    var str = [];
    for (var i= 0; i< v.length; i++){
        var tv = v[i], type = typeof tv;
        if (tv == null) {
            str.push('null');
        }else{
            if (type == 'boolean') str.push(tv);
            if (type == 'number') str.push(tv);
            if (type == 'string') str.push('"'+ tv.replace(/\"/ig, '\\"') +'"');
            if (isArray(tv)) str.push(encodeArray(tv));
            if (isObject(tv)) str.push(encodeObject(tv));
        }
    };
    return "["+ str.join(',') +"]";
};


/**
 * 将object编码为字符串
 * @param v
 * @returns {string}
 */
function encodeObject(v){
    var str = [];
    for (var k in v){
        var tv = v[k], type = typeof tv, key = '"' + k.replace(/\'/ig, '').replace(/\"/ig, '') + '":';
        if (tv == null) {
            str.push(key + 'null');
        }else{
            if (type == 'boolean') str.push(key + 'true');
            if (type == 'number') str.push(key + tv);
            if (type == 'string') str.push(key + '"'+ tv.replace(/\"/ig, '\\"') +'"');
            if (isArray(tv)) str.push(key + encodeArray(tv));
            if (isObject(tv)) str.push(key + encodeObject(tv));
        }
    };
    return '{'+ str.join(',') +'}';
};


/**
 * 判断是否是数组
 * @param v
 * @returns {boolean}
 */
function isArray(v){
    var toString = Object.prototype.toString;
    var s = toString.apply(v);
    return s === '[object Array]';
};

/**
 * 判断是否是对象
 * @param v
 * @returns {boolean}
 */
function isObject(v){
    var toString = Object.prototype.toString;
    var s = toString.call(v);
    return s === '[object Object]';
};


/**
 * 大写人民币转换方法
 * @param currencyDigits
 * @param rmb 是否显示前缀“人民币：”，默认不显示
 * @returns {string}
 * @constructor
 */
function RMB(currencyDigits, rmb) {
    // Constants:
    var MAXIMUM_NUMBER = 99999999999.99;
    // Predefine the radix characters and currency symbols for output:
    var CN_ZERO = "零";
    var CN_ONE = "壹";
    var CN_TWO = "贰";
    var CN_THREE = "叁";
    var CN_FOUR = "肆";
    var CN_FIVE = "伍";
    var CN_SIX = "陆";
    var CN_SEVEN = "柒";
    var CN_EIGHT = "捌";
    var CN_NINE = "玖";
    var CN_TEN = "拾";
    var CN_HUNDRED = "佰";
    var CN_THOUSAND = "仟";
    var CN_TEN_THOUSAND = "万";
    var CN_HUNDRED_MILLION = "亿";
    var CN_SYMBOL = "人民币：";
    var CN_DOLLAR = "元";
    var CN_TEN_CENT = "角";
    var CN_CENT = "分";
    var CN_INTEGER = "整";

    // Variables:
    var integral; // Represent integral part of digit number.
    var decimal; // Represent decimal part of digit number.
    var outputCharacters; // The output result.
    var parts;
    var digits, radices, bigRadices, decimals;
    var zeroCount;
    var i, p, d;
    var quotient, modulus;

    // Validate input string:
    currencyDigits = currencyDigits.toString();
    var is_minus = currencyDigits.indexOf('-') > -1;
    currencyDigits = currencyDigits.replace(/-/g, '');
    if (currencyDigits == "") {
        console.log("Empty input!");
        return "";
    };
    if (currencyDigits.match(/[^,.\d-]/) != null) {
        console.log("Invalid characters in the input string!");
        return "";
    };
    if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
        console.log("Illegal format of digit number!");
        return "";
    };

    // Normalize the format of input digits:
    currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
    currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
    // Assert the number is not greater than the maximum number.
    if (Number(currencyDigits) > MAXIMUM_NUMBER) {
        console.log("Too large a number to convert!");
        return "";
    };

    // Process the coversion from currency digits to characters:
    // Separate integral and decimal parts before processing coversion:
    parts = currencyDigits.split(".");
    if (parts.length > 1) {
        integral = parts[0];
        decimal = parts[1];
        // Cut down redundant decimal digits that are after the second.
        decimal = decimal.substr(0, 2);
    }else {
        integral = parts[0];
        decimal = "";
    };
    // Prepare the characters corresponding to the digits:
    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
    // Start processing:
    outputCharacters = "";
    // Process integral part if it is larger than 0:
    if (Number(integral) > 0) {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++) {
            p = integral.length - i - 1;
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0") {
                zeroCount++;
            }else {
                if (zeroCount > 0) outputCharacters += digits[0];
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            };
            if (modulus == 0 && zeroCount < 4) outputCharacters += bigRadices[quotient];

        };
        outputCharacters += CN_DOLLAR;
    };
    // Process decimal part if there is:
    if (decimal != "") {
        for (i = 0; i < decimal.length; i++) {
            d = decimal.substr(i, 1);
            if (d != "0") outputCharacters += digits[Number(d)] + decimals[i];
        }
    };
    // Confirm and return the final output string:
    if (outputCharacters == "") outputCharacters = CN_ZERO + CN_DOLLAR;
    if (decimal == "") outputCharacters += CN_INTEGER;
    if (!rmb) CN_SYMBOL = '';
    outputCharacters = CN_SYMBOL + outputCharacters;
    var pfx = is_minus ? '负' : '';
    return pfx + outputCharacters;
};


function ExtAlert($msg, opt){
    console.log($msg);
    var $type = typeof opt, dt = '友情提醒';
    if ( $type == 'object'){
        var $title = opt.title ? opt.title : dt;
    }else{
        //兼容原来第二次参数为title
        var $title = opt ? opt : dt;
        opt = {};
    }

    var msg = $msg, //兼容原来第一个参数为字符串的值
        icon = opt.icon ? opt.icon : Ext.MessageBox.INFO;
    if (typeof $msg == 'object'){
        var msg = $msg.info;
        if (typeof msg != 'string')
            msg = msg.msg ? msg.msg : msg.message ? msg.message : '未知错误。';
        icon = ($msg.status == 0)? Ext.MessageBox.ERROR : icon;
    }
    var conf = {
        title: $title,
        message: msg,
        width: opt.width ? opt.width : 300,
        buttons: opt.buttons ? opt.buttons : Ext.Msg.OK,
        icon: icon
    };
    if (typeof opt.fn == 'function') conf['fn'] = opt.fn;
    Ext.Msg.show(conf);
    return false;
};

var _qtip_msg_ct;
function QtipMsg(title, format, options){
    console.log('QtipMsg:', _body_mouse_xy);
    if (!_qtip_msg_ct) _qtip_msg_ct = Ext.DomHelper.insertFirst(document.body, {id:'qtip-msg-div'}, true);
    if (options){
        if (options.width) _qtip_msg_ct.setWidth(options.width);
        if (options.left) _qtip_msg_ct.setLeft(options.left);
        if (options.right) _qtip_msg_ct.setRight(options.right);
        if (options.top) _qtip_msg_ct.setTop(options.top);
        if (options.bottom) _qtip_msg_ct.setBottom(options.bottom);
    };
    if (options.mouse && _body_mouse_xy){
        _qtip_msg_ct.setLeft(_body_mouse_xy[0]);
        _qtip_msg_ct.setTop(_body_mouse_xy[1]-10);
        _qtip_msg_ct.setStyle({'marginLeft':'30px'});
    };
    var direction = options.direction ? options.direction : 't';
    var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
    var h = '<div class="msg ' + Ext.baseCSSPrefix + 'border-box"><h3>' + title + '</h3><p>' + s + '</p></div>';
    var m = Ext.DomHelper.append(_qtip_msg_ct, h, true);
    m.hide();
    m.slideIn(direction).ghost(direction, { delay: 1000*1, remove: true});
};

function set_mouse(e){
    window._body_mouse_xy = [e.pageX, e.pageY, e];
};


function clog(msg, mark){
    var d = new Date();
    if (mark)
        console.log( d.getTime(), msg, mark );
    else
        console.log(d.getTime(), msg);
    //console.log(d.getTime(), arguments);
};

//铺位类型转换成等级()
function berth_to_grades(type){
    var type_code='fl_money_three';
    if(in_array(type,['下铺','商务座','头等舱'])!=-1){
        type_code='fl_money_one';
    }else if(in_array(type,['中铺','一等座','硬座','商务舱'])!=-1){
        type_code='fl_money_two';
    }
    return type_code;
};

//根据时间戳生成的时间对象
function timestamp2date(timestamp){
    if (timestamp==0) return '';
    if (Ext) {
        var date = Ext.Date.format(new Date(parseInt(timestamp) * 1000), 'Y-m-d H:i:s');
    }else{
        if (!timestamp || timestamp==0) return '';
        var d = new Date(timestamp * 1000);
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes()) + ":" +
            (d.getSeconds());
    }
    return date;
};

//字符串转化为浮点型
function str2float(v){
    v=parseFloat(v);
    if(!v)v=0;
    return v;
}

/**
 * Js获取单选框内的值
 * @param name
 * @returns {string}
 */
function radio_val(name){
    var traffic_cls=document.getElementsByName(name);
    var traffic_val='';
    for(var i=0;i<traffic_cls.length;i++){ if(traffic_cls[i].checked==true)traffic_val=traffic_cls[i].value; }
    return traffic_val;
}

//由字附串转数字
function data_str_int(row,key){
    return parseFloat(row[key])?parseFloat(row[key]):0;
}