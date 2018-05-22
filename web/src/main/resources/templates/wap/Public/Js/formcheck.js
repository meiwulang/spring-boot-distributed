FORMCHECK = {
    //(不可以为空)手机号验证
    mobile : function(val, field){
        var reg=/(^0?[1][34857][0-9]{9}$)/;
        if(!reg.test(val))
        {
            return false;
        };
        return true;
    },
    mobileText:"手机号格式不正确",

    //身份证号验证
    checkIdcode : function(val, field){
        if (val != '' && val != null) {
            val=val.replace('x','X');
            var rst = CardChk(val);
            return rst.start;
        } else {
            return true;
        }
    },
    chechIdcard : function(val,opt){
        if(opt.card_type!='身份证' || val == '' || val == null)return true;
        val=val.replace('x','X');
        var rst = CardChk(val);
        if(rst.start==0){
            return rst;
        }else{
            var card=rst.data;
            if(opt.limit_type=="限制性别" || opt.limit_type=="限性别"){
                if(card.sex!=opt.limit_condition){
                    return {start:0,info:"身份证填写错误,此票种"+opt.limit_type+"为"+opt.limit_condition};
                }else{
                    return true;
                }
            }

            //票种限制年龄
            if(opt.limit_type=="限制年龄" || opt.limit_type=="限年龄"){
                var condition=opt.limit_condition,where="";
                var Age=getAge(val);
                if(condition.indexOf("-")>=0){
                    var bt=condition.split("-");
                    where=Age>bt[0] && Age<bt[1];
                }else if(condition.indexOf("<")>=0){
                    var gt=condition.split("<");
                    where=(Age<gt[1]);
                }else if(condition.indexOf(">")>=0){
                    var gt=condition.split(">");
                    where=(Age>gt[1]);
                }else{
                    where=(Age==condition);
                };
                if(where){
                    return true;
                }else{
                    return {start:0,info:"身份证填写错误,此票种"+opt.limit_type+"为"+opt.limit_condition+'，当前年龄是：'+Age};
                }
            }
        }
        return rst;
    },
    checkIdcodeText:"身份证号码有错误",

    //(可以为空)请输入正确的电话号码,如:0920-29392929
    phone:function(val,field)
    {
        try
        {
            if(/^((0[1-9]{3})?(0[12][0-9])?[-])?[0-9]{6,8}$/.test(val))
                return true;
            return false;
        }
        catch(e)
        {
            return false;
        }
    },
    phoneText:"请输入正确的电话号码,如:0920-29392929",

    //请输入正确的IP地址
    ip:function(val,field)
    {
        try
        {
            if((/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(val)))
                return true;
            return false;
        }
        catch(e)
        {
            return false;
        }
    },
    ipText:"请输入正确的IP地址",

    //请输入英文字母
    alpha:function(val,field)
    {
        try
        {
            if( /^[a-zA-Z]+$/.test(val))
                return true;
            return false;
        }
        catch(e)
        {
            return false;
        }
    },
    alphaText:"请输入英文字母",

    //请输入中文
    chinese:function(val,field)
    {
        var reg = /[\u4e00-\u9fa5]/;
        if(!reg.test(val))
        {
            return false;
        }
        return true;
    },
    chineseText:"请输入英文字母",

    //两次输入的密码不一致！
    password: function(val, field)
    {
        if (field.initialPassField)
        {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText:"两次输入的密码不一致!",

    //年龄输入有误(18岁到100岁)
    age:function(val,field)
    {
        try
        {
            if(parseInt(val) >= 18 && parseInt(val) <= 100)
                return true;
            return false;
        }
        catch(err)
        {
            return false;
        }
    },
    ageText:"年龄输入有误(18岁到100岁)!",


    //请使用这样的日期格式: yyyy-mm-dd. 例如:2008-06-20.
    datecn:function(val,field)
    {
        try
        {
            var regex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
            if(!regex.test(val)) return false;
            var d = new Date(val.replace(regex, '$1/$2/$3'));
            return (parseInt(RegExp.$2, 10) == (1+d.getMonth())) && (parseInt(RegExp.$3, 10) == d.getDate())&&(parseInt(RegExp.$1, 10) == d.getFullYear());
        }
        catch(e)
        {
            return false;
        }
    },
    datecnText:"请使用这样的日期格式: yyyy-mm-dd. 例如:2008-06-20.",

    //请输入正确的整数
    integer:function(val,field)
    {
        try
        {
            if(/^[-+]?[/d]+$/.test(val))
                return true;
            return false;
        }
        catch(e)
        {
            return false;
        }
    },
    integerText:"请输入正确的整数",

    //长度过小
    minlength:function(val,field)
    {
        try
        {
            if(val.length >= parseInt(field.minlen))
                return true;
            return false
        }
        catch(e)
        {
            return false;
        }
    },
    minlengthText:"长度过小",

    //长度过大
    maxlength:function(val,field)
    {
        try
        {
            if(val.length <= parseInt(field.maxlen))
                return true;
            return false;
        }
        catch(e)
        {
            return false;
        }
    },
    maxlengthText:"长度过小"
};
Ext.onReady(function(){
    Ext.apply(Ext.form.VTypes, FORMCHECK);
});

//所需要用方法
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function CardChk(idcard){
    var Errors=new Array(
        "ok",
        "身份证号码位数不对!",
        "身份证号码出生日期超出范围或含有非法字符!",
        "身份证号码校验错误!",
        "身份证地区非法!"
    );
    var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
    var idcard,Y,JYM;
    var S,M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    var Area = area[parseInt(idcard.substr(0,2))];
    if(Area==null) return {start:0, info:Errors[4]};
    //身份号码位数及格式检验
    var Birthday = '', sexCode='';
    switch(idcard.length){
        case 15:
            Birthday = '19' + idcard.substr(6,2) + '-' + idcard.substr(8,2) + '-' + idcard.substr(10,2);
            sexCode = idcard.substring(14,15);
            break;
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            Birthday = idcard.substr(6,4) + '-' + idcard.substr(10,2) + '-' + idcard.substr(12,2);
            sexCode = idcard.substring(16,17);
            //计算校验位
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                + parseInt(idcard_array[7]) * 1
                + parseInt(idcard_array[8]) * 6
                + parseInt(idcard_array[9]) * 3 ;
            Y = S % 11;
            M = "F";
            JYM = "10X98765432";
            M = JYM.substr(Y,1);//判断校验位
            if(M == idcard_array[17]){
                //return Errors[0]; //检测ID的校验位
            }else{
                return {start:0, info:Errors[3]};
            }
            break;
        default:
            return {start:0, info:Errors[1]};
            break;
    }
    var cSex = '';
    if(sexCode % 2 == 0 ){ cSex = '女'; }else{ cSex = '男'; }
    return {start:1, data:{area:Area, birthday:Birthday, sex:cSex}};
}

function CardSex(Card){

    var cSex = '';

    var isOK = CardChk(Card);  //检查身份证是否合法

    if(isOK.start != 1){
        cSex = isOK.info;  //不合法则返回错误信息
    }else{
        var cLen = Card.length;
        if(cLen ==15 ){
            sexCode = Card.substring(14,15);
        }else if(cLen==18){
            sexCode = Card.substring(16,17);
        }
        if(sexCode % 2 == 0 ){ cSex = '女'; }else{ cSex = '男'; }
    }
    return cSex;
}

function getAge(Card){
    var Age = '';
    var isOK = CardChk(Card);
    if(isOK.start != 1){
        Age = isOK.info;
    }else{
        var cLen = Card.length;
        var date = new Date();
        //var CardArr = new Array();
        //CardArr = Card.split("");
        switch(cLen){
            case 15:
                var y = Card.substr(6,2);  //年
                var m = Card.substr(8,2);  //月
                var d = Card.substr(10,2); //日

                var birth = "19" + y + '-' + m + '-' + d;
                if(m < 9){
                    var zs = date.getFullYear() - 1900 - y ; //9月份前出生的周岁
                }else{
                    var zs = date.getFullYear() - 1900 - y - 1 ; //9月份出生后的周岁
                }
                var Age = zs; // 返回周岁
                break;
            case 18:
                var y = Card.substr(6,4);   //年
                var m = Card.substr(10,2);  //月
                var d = Card.substr(12,2);  //日
                var birth = y + '-' + m + '-' + d;
                if(m < 9 ){
                    var zs = date.getFullYear() - y;
                }else{
                    var zs = date.getFullYear() - y - 1;
                }
                var Age = zs;
                break;
        }
    }
    return Age;
}


