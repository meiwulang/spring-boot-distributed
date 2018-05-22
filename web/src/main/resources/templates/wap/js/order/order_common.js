// info数据
var INFO_DATA;
var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
// 引入底部html
$("#footer").load("index_footer.html?t="+_TimeStamp);
// 批量填写游客信息
$("#batch_fill").load("batch_fill.html?t="+_TimeStamp);
// 选择去程
$("#select_site").load("select_siteModal.html?t="+_TimeStamp);
// 选择返程
// $("#select_rebackSite").load("select_rebackSiteModal.html?t="+_TimeStamp);
// // 确认去程返程
// $("#select_confirmSite").load("select_confirmSiteModal.html?t="+_TimeStamp);
// 登录
$("#login_mask").load("login.html?t="+_TimeStamp);

function get_batch_info(num) {
    return '共' + $('.order_touristInfo .tourist-table tbody tr').length + '人，已填写' + num + '人。<span style="color: red">多填、空行会被忽略。</span>';
}
;function batch_parse(t, ret) {
    var s = t.val()
      , sn = s.split('\n')
      , row_num = ''
      , r = 0
      , tourist = [];

    for (var i = 0; i < sn.length; i++) {
        var reg = /(\s|\t|,|，)+/gi;
        var ns = sn[i].replace(reg,',');
        var vt = verify_tourist(ns)
          , c = vt ? 'blue' : 'red';
        if (vt)
            r++;
        tourist.push(vt);
        row_num += '<p style="color:' + c + '">' + (i + 1) + '</p>';
    }
    ;var tip = get_batch_info(r);
    if (ret)
        return tourist;
    $('#rs_info').html(tip);
    $('#batch_row_number').html(row_num);
}
;function verify_tourist(row) {
    if (!row)
        return false;
    //姓名，身份证号码，手机号
    var spt = ',';
    if (row.indexOf('\t') > -1)
        spt = '\t';
    if (row.indexOf('，') > -1)
        spt = '，';
    if (row.indexOf(' ') > -1)
        spt = ' ';
    var t = row.split(spt);
    var rst = true;
    var id = id_card(t[1]);
    // if (!id.status)
    //     rst = false;
    // var mobile_reg = /(^0?[1][34857][0-9]{9}$)/
    // if (!mobile_reg.test(t[2]))
    //     rst = false;
    return rst ? {
        name: t[0],
        idcode: t[1],
        mobile: t[2]
    } : false;
}
;function get_tourist() {
    var s = batch_parse($('#batch_textarea'), true);
    var tl = $('.order_touristInfo .tourist-table tbody tr');
    var i_n = tl.find('.passenger_name');
    var i_m = tl.find('.passenger_tel');
    var i_c = tl.find('.passenger_id');
        $.each(s, function(index, items) {
        if (items && i_n[index]) {
            i_n[index].value = items['name'];
            if(items['mobile']){
               i_m[index].value = items['mobile']; 
            }
            if(items['idcode']){
              i_c[index].value = items['idcode'];
            }
        }
    });
}
function id_card(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
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
    };
    var tip = "";
    var pass = true;
    if (!code)
        return {
            status: false,
            msg: '身份证号码不能为空'
        };
    if (typeof code != 'string')
        code = code.toString();
    code = code.toUpperCase();
    if (code.length != 15 && code.length != 18) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += (ai * wi);
            }
            ;var last = parity[sum % 11];
            if (last != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    ;return {
        status: pass,
        msg: tip
    };
}
function CardChk(idcard) {
    var Errors = new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!");
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
}
function CardSex(Card) {
    var cSex = '';
    var isOK = CardChk(Card);
    //检查身份证是否合法
    if (isOK.start != 1) {
        cSex = isOK.info;
        //不合法则返回错误信息
    } else {
        var cLen = Card.length;
        if (cLen == 15) {
            sexCode = Card.substring(14, 15);
        } else if (cLen == 18) {
            sexCode = Card.substring(16, 17);
        }
        if (sexCode % 2 == 0) {
            cSex = '女';
        } else {
            cSex = '男';
        }
    }
    return cSex;
}
function getAge(Card) {
    var Age = '';
    var isOK = CardChk(Card);
    if (isOK.start != 1) {
        Age = isOK.info;
    } else {
        var cLen = Card.length;
        var date = new Date();
        //var CardArr = new Array();
        //CardArr = Card.split("");
        switch (cLen) {
            case 15:
                var y = Card.substr(6, 2);
                //年
                var m = Card.substr(8, 2);
                //月
                var d = Card.substr(10, 2);
                //日
                var birth = "19" + y + '-' + m + '-' + d;
                if (m < 9) {
                    var zs = date.getFullYear() - 1900 - y;
                    //9月份前出生的周岁
                } else {
                    var zs = date.getFullYear() - 1900 - y - 1;
                    //9月份出生后的周岁
                }
                var Age = zs;
                // 返回周岁
                break;
            case 18:
                var y = Card.substr(6, 4);
                //年
                var m = Card.substr(10, 2);
                //月
                var d = Card.substr(12, 2);
                //日
                var birth = y + '-' + m + '-' + d;
                if (m < 9) {
                    var zs = date.getFullYear() - y;
                } else {
                    var zs = date.getFullYear() - y - 1;
                }
                var Age = zs;
                break;
        }
    }
    return Age;
}
function chechIdcard(val, opt) {
    if (opt.card_type != '身份证' || val == '' || val == null)
        return true;
    val = val.replace('x', 'X');
    var rst = CardChk(val);
    //console.log([val,opt,rst]);
    if (rst.start == 0) {
        return rst;
    } else {
        var card = rst.data;
        if (opt.limit_type == "限制性别" || opt.limit_type == "限性别") {
            if (card.sex != opt.limit_condition) {
                return {
                    start: 0,
                    info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition
                };
            } else {
                // 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
                // return true;
            }
        }
        //票种限制年龄
        if (opt.limit_type == "限制年龄" || opt.limit_type == "限年龄") {
            var condition = opt.limit_condition
              , where = "";
            var Age = getAge(val);
            if (condition.indexOf("-") >= 0) {
                var bt = condition.split("-");
                where = Age > bt[0] && Age < bt[1];
            } else if (condition.indexOf("<") >= 0) {
                var gt = condition.split("<");
                where = (Age < gt[1]);
            } else if (condition.indexOf(">") >= 0) {
                var gt = condition.split(">");
                where = (Age > gt[1]);
            } else {
                where = (Age == condition);
            }
            if (where) {
                // 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
                // return true;
            } else {
                return {
                    start: 0,
                    info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition + '，当前年龄是：' + Age
                };
            }
        }
    }
    return rst;
}

// 计算补房差
function SingleTicketSettlement(data,people_num,bed_num){
    var base_num = parseInt(people_num/data.num);   // 基数

    // 补房差

    // 相差床位数
    var dec_bed_num = bed_num - base_num * data.room_num;
    // 单张床位价格
    var dec_bed_price = 0;
    // 房差总价
    var dec_bed_money = 0;

    // 加房价
    if( dec_bed_num > 0 ){
        dec_bed_price = data.t_spread_price;
    }
    // 减房价
    if( dec_bed_num < 0 ){
        dec_bed_price = data.t_out_room_price;
    }

    dec_bed_money = (dec_bed_num * dec_bed_price).toFixed(2);

    return {
        title : data.t_standards_name,  // 票价名
        bed_price : dec_bed_price,      // 单张床位价格
        dec_bed_num : dec_bed_num,  // 相差床位数
        dec_bed_money : dec_bed_money,  //房差总价
    }
}

// 算钱
function Settlement(){
    var $TicketTableTr = $('.order_ticketlist .ticket-table tbody tr[type=normal],.order_ticketlist .ticket-table tbody tr[type=group]');
    var $SiteTr = $('.order_touristInfo .tourist-table tbody tr');
    var RenderList = {};
    
    var AllTotal = 0;   // 总金额
    var TicketTotal = 0;    // 票价总额
    var BedTotal = 0;   // 房差金额
    var SeatTotal = 0;  // 接送金额
    var GoSeatTotal = 0; // 去程总价
    var BackSeatTotal = 0; // 返程总价

    // 各类型票价汇总
    var AdultTotal = 0, // 所有成人价
        AdultNum = 0,   // 成人数量
        ChildrenTotal = 0,  // 所有儿童价
        ChildrenNum = 0,    // 儿童数量
        SetsTotal = 0,  // 所有套票价
        SetsNum = 0;    // 套票数量

    // 票价类型
    var TicketList = [];
    $TicketTableTr.each(function(){
        var tid = $(this).attr('tid'),
            people_num = parseInt($(this).find('.people_num input').val()),
            bed_num = parseInt($(this).find('.bed_num input').val());

        var tr_data = INFO_DATA.ticket[tid];
        var base_num = parseInt(people_num/tr_data.num);    // 基数
        var tr_price = (base_num * tr_data.t_price).toFixed(2); // 报名总价

        var tr_trade_price = base_num * tr_data.t_trade_price;
        TicketTotal += parseFloat(tr_trade_price);
        AllTotal += parseFloat(tr_price);

        // 用来计算各票种优惠
        var limit_type = tr_data.t_preset_type;
        switch(limit_type){
            case '成人票':
                AdultTotal += parseFloat(base_num * tr_data.t_trade_price);
                AdultNum += base_num;
                break;
            case '儿童票':
                ChildrenTotal += parseFloat(base_num * tr_data.t_trade_price);
                ChildrenNum += base_num;
                break;
            case '套票':
                SetsTotal += parseFloat(base_num * tr_data.t_trade_price);
                SetsNum += base_num;
                break;
        }

        // 显示同行价和佣金
        var trade_price = (tr_data.t_trade_price * base_num).toFixed(2),
            commission_price = (tr_price - trade_price).toFixed(2);

        var tr_type = $(this).attr('type');
        var data = {
            type : tr_type, // 票价类型 normal=普通票 group=套票
            title : tr_data.t_standards_name,   // 标题
            people_num : people_num,    // 人数
            base_num : base_num,    // 基数
            bed_num : bed_num,  // 床位数
            price : tr_data.t_price,    // 票价类型单价
            tr_price : tr_price,    // 报名总价
            alt : '同行价：￥'+trade_price+' (佣金：￥'+commission_price+')',
            group_bed : []  // 套票补房差
        }
        // 普通票
        if( tr_type == 'normal' ){
            var SingleTicket = SingleTicketSettlement(tr_data,people_num,bed_num);
            data = $.extend({},data,SingleTicket);
            AllTotal += parseFloat(data.dec_bed_money);
            BedTotal += parseFloat(data.dec_bed_money);
        }
        // 套票
        if( tr_type == 'group' ){
            var $tr = $('.order_ticketlist .ticket-table tbody tr[type="group-normal"][pid="'+tid+'"]');
            $tr.each(function(){
                var ttid = $(this).attr('tid'),
                    pnum = parseInt($(this).find('.people_num input').val()),
                    bnum = parseInt($(this).find('.bed_num input').val());
                var ttr_data = INFO_DATA.ticket[tid].list[ttid];
                var SingleTicket = SingleTicketSettlement(ttr_data,pnum,bnum);
                data.group_bed.push(SingleTicket);
                AllTotal += parseFloat(SingleTicket.dec_bed_money);
                BedTotal += parseFloat(SingleTicket.dec_bed_money);
            })
        }

        TicketList.push(data);
    })

    RenderList['TicketList'] = TicketList;

    // 去程返程
    var GoList = [], BackList = [];
    for(var x = 0; x < $SiteTr.length; x++){
        if( !$SiteTr.hasClass('has-del') ){
            var data = $SiteTr.eq(x).data('site');
            if( !data ){
                continue;
            }
            var goflag = 0, backflag = 0;
            for(var i = 0; i < GoList.length; i++){
                if( GoList[i].gosname == data.gosname && GoList[i].goprice == data.goprice ){
                    GoList[i]['total'] += 1;
                    GoList[i]['total_price'] = (GoList[i]['total'] * GoList[i].goprice).toFixed(2);
                    goflag = 1;
                }
            }
            for(var i = 0; i < BackList.length; i++){
                if( BackList[i].backsname == data.backsname && BackList[i].backprice == data.backprice ){
                    BackList[i]['total'] += 1;
                    BackList[i]['total_price'] = (BackList[i]['total'] * BackList[i].backprice).toFixed(2);
                    backflag = 1;
                }
            }
            if( goflag == 0 ){
                GoList.push({
                    'total' : 1,
                    'gosname' : data.gosname,
                    'goprice' : data.goprice,
                    'total_price' : (data.goprice*1).toFixed(2)
                })
            }
            if( backflag == 0 ){
                BackList.push({
                    'total' : 1,
                    'backsname' : data.backsname,
                    'backprice' : data.backprice,
                    'total_price' : (data.backprice*1).toFixed(2)
                })
            }
            AllTotal += (parseFloat(data.goprice) + parseFloat(data.backprice));
            SeatTotal += (parseFloat(data.goprice) + parseFloat(data.backprice));
            GoSeatTotal += parseFloat(data.goprice);
            BackSeatTotal += parseFloat(data.backprice);
        }
    }

    RenderList['GoList'] = GoList;
    RenderList['BackList'] = BackList;

    // 优惠金额
    var Discount = Number($('#order_discount').val()).toFixed(2);
    RenderList['Discount'] = Discount;
    $('.orderInfo_submit .l_pos_money').text(AllTotal.toFixed(2));

    // 结算优惠，有代报名时才会有
    var DisTotal = parseFloat($('#order_settlementDiscount').val());
    DisTotal = DisTotal ? DisTotal : 0;

    // 两个优惠价格判断
    if( Discount && DisTotal && (Discount >= AllTotal || DisTotal >= TicketTotal) ){
        $.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请填写正确的优惠金额',
            speed: 200
        });
    }

    // 设置应付金额
    AllTotal -= Discount;
    $('.orderInfo_submit .total-money,.order_submit .l_pos_money').text(AllTotal.toFixed(2));

    // 活动优惠金额
    var p_data = INFO_DATA.p_promotion;
    var ActiveTotal = 0, ActiveTitle = '';
    if( p_data.length > 0 ){
        var pp_id = $('#activi li').attr('pp_id');
        for(var z = 0; z < p_data.length; z++){
            if( p_data[z].pp_id != pp_id ){
                continue;
            }
            var type = p_data[z].pp_type;
            var pp_num = p_data[z].pp_amount;
            ActiveTitle = p_data[z].pp_title;
            // 定额
            if( type == 'quota' ){
                var pp_son_type = p_data[z].pp_son_type;
                // 定额每人
                if( pp_son_type == 'quotaPerson' ){
                    var pp_ticket_type = p_data[z].pp_ticket_type;

                    for(var i = 0; i < pp_ticket_type.length; i++){
                        var this_type = pp_ticket_type[i];
                        switch(this_type){
                            case 'adult':   // 成人
                                ActiveTotal += AdultNum * pp_num;
                                break;
                            case 'children':    //儿童
                                ActiveTotal += ChildrenNum * pp_num;
                                break;
                            case 'sets':     // 套票
                                ActiveTotal += SetsNum * pp_num;
                                break;
                        }
                    }
                }
                // 定额每单
                if( pp_son_type == 'quotaOrder' ){
                    ActiveTotal = pp_num;
                }
            }
            // 百分比
            if( type == 'percent' ){
                var pp_ticket_type = p_data[z].pp_ticket_type;
                // 最高优惠价
                var max_money = p_data[z].pp_max_limit;

                for(var i = 0; i < pp_ticket_type.length; i++){
                    var this_type = pp_ticket_type[i];
                    switch(this_type){
                        case 'adult':   // 成人
                            ActiveTotal += (AdultTotal * pp_num)/100;
                            break;
                        case 'children':    //儿童
                            ActiveTotal += (ChildrenTotal * pp_num)/100;
                            break;
                        case 'sets':     // 套票
                            ActiveTotal += (SetsTotal * pp_num)/100;
                            break;
                    }
                }

                if( max_money && ActiveTotal > max_money  ){
                    ActiveTotal = max_money;
                }
            }
            // 退出循环
            break;
        }
    }

    // 结算明细
    var FactTotal = parseFloat(TicketTotal + BedTotal + SeatTotal - DisTotal);   // 实际结算

    var Special = {
        TicketTotal : TicketTotal.toFixed(2),   // 票价金额 * 所有同行价总和
        BedTotal : BedTotal.toFixed(2),     // 房差总和 * 所有房差总和
        SeatTotal : SeatTotal.toFixed(2),   // 接送总额 * 所有接送费用总和
        DisTotal : (-1 * DisTotal).toFixed(2),      // 结算优惠 * 代报名时优惠金额
        FactTotal : FactTotal.toFixed(2),       // 实际结算 * (票价金额+房差总和+接送总额-结算优惠)
        GetTotal : (AllTotal - FactTotal).toFixed(2),    // 佣金 * (应付金额-实际结算)
        ActiveTotal : (-1 * ActiveTotal).toFixed(2),    // 活动优惠 * (只做显示，不做计算)
        ActiveTitle : ActiveTitle,   // 活动标题,
        GoSeatTotal : GoSeatTotal,
        BackSeatTotal : BackSeatTotal
    };

    RenderList['Special'] = Special;

    // console.log(RenderList);

    var interText = doT.template($("#SettlementTemplage").text());
        $(".order_balanceDetails").html(interText(RenderList));
}

// 获取报名人列表
function getBmrList(org_id){
    var getShoppeoplelistUrl = '/b2b/shop/peoplelist?org_id=' + org_id;
    ajaxRequest(getShoppeoplelistUrl, 'GET', '', function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            $('#bmrlist input').val('').attr({
                uid : 0
            });
            var str = '';
            for(var i = 0; i < ret.data.length; i++){
                str += '<li uid="' + ret.data[i].u_id + '">' + ret.data[i].u_realname + '</li>';
            }
            $('#bmrlist .select-simulate-list ul').html(str);
            $('#bmrlist .select-simulate-list li').on('click',function(e){
                e.stopPropagation();
                var uid = $(this).attr('uid'),
                    u_realname = $(this).text();
                $('#bmrlist input').val(u_realname).attr({
                    uid : uid
                })
                $(this).addClass('hover').siblings().removeClass('hover');
                $('#bmrlist .select-simulate-list').hide();
                return false;
            })
        }
    })
}
// 获报名旅行社列表
function getDbmList(query){
    if( !query ){
        return false;
    }
    datas = {
        query: query,
        //查询字符串，可选
        org_city: '',
        //出发城市
        page: '',
        //当前页，可选
        limit: ''//每页行数，可选
    }
    var Mixed = generateMixed(12);
    var getShopbusinesslistUrl = '/b2b/shop/businesslist?mixed=' + Mixed;
    ajaxRequest(getShopbusinesslistUrl, 'POST', datas, function(ret) {
        //console.log(JSON.stringify(ret))
        if (ret.data && ret.code == 200) {
            var str = '';
            for(var i = 0; i < ret.data.length; i++){
                str += '<li org_id="'+ret.data[i].org_id+'" balance="'+ret.data[i].credit_balance+'">'+ret.data[i].org_name+'</li>';
            }
            $('#dbmlist .select-simulate-list ul').html(str);
            $('#dbmlist .select-simulate-list ul li').on('click',function(e){
                e.stopPropagation();
                var key = $(this).text(),
                    org_id = $(this).attr('org_id'),
                    balance = $(this).attr('balance');
                $('#dbmlist input').val(key).attr({
                    org_id : org_id,
                    balance : balance
                })
                // $('#account-cls span').html(balance);
                //$('#account-cls').show();
                $(this).addClass('hover').siblings().removeClass('hover');
                $('#dbmlist .select-simulate-list').hide();
                getBmrList(org_id);
                $("#ShopinfoDatas").remove(); 
                $('#dbmlist').addClass('checked');
                return false;
            })
        }else{
            $('#dbmlist .select-simulate-list ul').html('');
        }
    })
}
// 代报名操作
function DbmInit(){
    var ov = '';
    getDbmList(ov);

    $('#dbmlist input,#dbmlist .select-down').on('click',function(e){
        e.stopPropagation();
        $('.select-simulate-list').hide();
        var $list = $('#dbmlist .select-simulate-list');
        $list.show();

        // $('#dbmlist .select-simulate-list li').on('click',function(e){
        //     console.log(2);
        //     e.stopPropagation();
        //     var key = $(this).text(),
        //         org_id = $(this).attr('org_id'),
        //         balance = $(this).attr('balance');
        //     $('#dbmlist input').val(key).attr({
        //         org_id : org_id,
        //         balance : balance
        //     })
        //     // $('#account-cls span').html(balance);
        //     //$('#account-cls').show();
        //     $(this).addClass('hover').siblings().removeClass('hover');
        //     $('#dbmlist .select-simulate-list').hide();
        //     getBmrList(org_id);
        // });
    });



    $('#dbmlist input').on('keyup',function(e){
        e.stopPropagation();
        var key = $.trim($(this).val());
        if( key != ov ){
            $('#dbmlist').removeClass('checked');
            ov = key;
            getDbmList(key);
        }
    });

    $('#bmrlist input,#bmrlist .select-down').on('click',function(e){
        e.stopPropagation();
        $('.select-simulate-list').hide();
        var $list = $('#bmrlist .select-simulate-list');
        $list.show();
    });

    $(document).on('click',function(){
        $('.select-simulate-list').hide();
        // if( !$('#dbmlist').hasClass('checked') && $('#dbmlist input').val() ){
        //     getBmrList(-1);
        // }
    });
}

function go_back_station_list(dest){
    var go_dest=[],back_dest=[];
    for(var di=0;di<dest.length;di++){
        var rst={'返程':[],'去程':[]},row=dest[di].data;
        for(var ri=0;ri<row.length;ri++){
            if(row[ri]['go_back']=='返程'){
                rst['返程'].push(row[ri]);
            }else{
                rst['去程'].push(row[ri]);
            }
        }
        if(rst['返程'].length>0){
            back_dest.push({
                id:dest[di]['id'],
                site_name:dest[di]['site_name'],
                data:rst['返程']
            })
        }
        if(rst['去程'].length>0){
            go_dest.push({
                id:dest[di]['id'],
                site_name:dest[di]['site_name'],
                data:rst['去程']
            })
        }
    }
    return {'返程':back_dest,'去程':go_dest};
}

//班车接送站点信息
function getShopstationData(go,back) {
    var p_id = GetQueryString('p_id') || INFO_DATA.p_id;
    strdate = INFO_DATA.bl_start_date.replace(/\-/g, '');
    var tid = sessionStorage.tid;
    var spages = '1';
    var key = '';
    if (sessionStorage.pagecount) {
        spages = sessionStorage.pagecount;
    }
    if (sessionStorage.keys) {
        key = sessionStorage.keys;
    }
    var data = {
        t_id: tid,
        start_date: strdate,
        start_time: '',
        // start: spages,
        p_id: p_id,
        start : 1,
        limit: '999',
        key: key
    }
    var getShopstationtUrl = '/front/b2b/shop/station';
    ajaxRequest(getShopstationtUrl, 'POST', data, function(ret) {
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data.data;
            var shopstationData_go = doT.template($("#shopstationData_go-template").text());
            var shopstationData_back = doT.template($("#shopstationData_back-template").text());
            $("#shopstationData_go").html(shopstationData_go(dataInter["去程"]));
            $("#shopstationData_back").html(shopstationData_back(dataInter['返程']));

            $('.tabAddG li:nth-child(2) span:nth-child(2)').html(dataInter.go_start_num);
            $('.tabAddG li:nth-child(3) span:nth-child(2)').html(dataInter.buslist_go_num);
            $('.tabAddG li:nth-child(4) span:nth-child(2)').html(dataInter.bystation_num);
            $('.tabAddB li:nth-child(2) span:nth-child(2)').html(dataInter.bk_start_num);
            $('.tabAddB li:nth-child(3) span:nth-child(2)').html(dataInter.buslist_back_num);
            $('.tabAddB li:nth-child(4) span:nth-child(2)').html(dataInter.bystation_num);

            //获得始发站的时间
            if(INFO_DATA.bl_start_time){
                $("#shopstationData_go li").each(function() {
                    if ($(this).attr('data-type') == '始发站') {
                        $(this).find('.blTime').html(INFO_DATA.bl_start_time);
                    } 
                })
            } else{
                $(this).find('.blTime').html('--');
            }

            
               $('.goLine_list li').each(function() {
                    //停售状态下班车站为禁止状态
                    if (dataInter.stop_status == 1) {
                        if ($(this).attr('data-type') == '班车站') {
                            $(this).addClass('stopStatus');
                            $(this).removeClass('nostop')
                            $(this).find('i').css('visibility','hidden');
                            $(this).css({
                                'background-color':'#f1f1f1',
                                'color':'#aaa',
                                'cursor': 'default'
                            });
                            $(this).find('.orange-color').css({'color':'#aaa'});
                            if ($(this).hasClass('odd')) {
                                $(this).mouseenter(function() {
                                    $(this).append('<div class="tips orange-color"><img src="../../img/order/tips.png" alt="" /></div>')
                                });
                                $(this).mouseleave(function() {
                                    $('.tips').remove();
                                });
                            }
                        }
                    }

                    //另行通知
                    if ($(this).attr('data-type') == '顺路站') {
                        $(this).find('.blTime').css('color','#ccc');
                    }
                    
                })
               
                $('#shopstationData_go li').each(function() {
                    var radioText = $.trim($(this).find('.radioAndName').text());

                    if(radioText == go){
                        $(this).find('i').addClass('fa-check-circle').removeClass('fa-circle-o');
                        $(this).addClass('active');
                        var goid = $(this).attr('data-id')
                        $('.contSelGo').attr('data-id',goid);
                        var goname = $(this).attr('data-sname')
                        $('.contSelGo').attr('data-sname',goname);
                        var goprice = $(this).attr('data-price');
                        $('.contSelGo').attr('data-price',goprice);
                        $('.contSelGo').html(radioText);
                    }
               })
               $('#shopstationData_back li').each(function() {
                    var radioText = $.trim($(this).find('.radioAndName').text());
                    
                    if(radioText == back){
                        $(this).find('i').addClass('fa-check-circle').removeClass('fa-circle-o');
                        $(this).addClass('active');
                        $('.select_same').removeClass('active');
                        var backid = $(this).attr('data-id');
                        $('.contSelBack').attr('data-id',backid);
                        var backsname = $(this).attr('data-sname');
                        $('.contSelBack').attr('data-sname',backsname);
                        var backprice = $(this).attr('data-price');
                        $('.contSelBack').attr('data-price',backprice);
                        $('.contSelBack').html(radioText);
                        $('#allprice').html(parseInt($('.contSelGo').attr('data-price')) + parseInt($('.contSelBack').attr('data-price')));
                    }
               })


            // 分页代码
            // var total = ret.data.total;
            // var pages = Math.ceil(total / 10);
            // sessionStorage.pagetotal = pages;
            // var pagehtml = '<div class="p_page"><span class="next_page"></span></div>';
            // for (var i = 1; i <= pages; i++) {
            //     if (i == spages) {
            //         pagehtml += '<div class="o_page active"><span class="page ">' + i + '</span></div>';
            //     } else {
            //         pagehtml += '<div class="o_page"><span class="page">' + i + '</span></div>';
            //     }
            // }
            // pagehtml += '<div class="n_page"><span class="prev_page"></span></div>';
            // $('#pagecount_go').html(pagehtml);
            // $('#pagecount_back').html(pagehtml);
        }
    })
}

// 去程返程处理
function SiteSelect(){
    $('.gosite,.backsite,.tourist-table .seats-select').on('click',function(){
        var pnumber = $(this).parents('tr').find('.order_number').text(),
            tbody_type = $(this).parents('tbody').attr('type'),
            tid = $(this).parents('tbody').attr('tid');

        if( tbody_type == 'group' ){
            tid = $(this).parents('tr').attr('tid');
        }
        if (window.location.href.indexOf('order_edit.html')>-1) {
            var data = $(this).parents('tr').data('site');
            if (data) {
                var gosname = data.gosname;
                var backsname = data.backsname; 
            }
            
        }

        $("#selectSite_modal").modal("show");
        sessionStorage.pnumber = pnumber;
        sessionStorage.tid = tid;
        getShopstationData(gosname,backsname);
    })
}

// 新增票，新增游客信息模板后事件
function TouistTemplateEvent(){
    // 选择证件类型
    $('.personalId_select .dropdown-menu li').off().on('click',function() {
        $(this).parents('.dropdown').find('.dropdown-toggle').html($(this).find('a').html());
    });
    //设为联系人
    $(".setcontact").off().on('click', function() {
        var tl = $(this).parents('tr');
        $('#order_emergencyContactName').val(tl.find('.passenger_name').val());
        $('#order_emergencyContactTel').val(tl.find('.passenger_tel').val());
    });

    $('.passenger_id').off().on('blur', function() {
        var card_typevals = $(this).find('.card_type').html();
        if ($(this).val() && card_typevals == "身份证") {
            var id = id_card($(this).val());
            if (!id.status) {
                $(this).css('border', '1px solid red');
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写正确的身份证号',
                    speed: 200
                });
            } else {
                $(this).css('border', '1px solid #eaeaea');
            }
        } else {
            $(this).css('border', '1px solid #eaeaea');
        }
    })
    $('.passenger_tel').off().on('blur', function() {
        if ($(this).val()) {
            var tel = $(this).val();
            var mobile_reg = /(^0?[1][34857][0-9]{9}$)/
            if (!mobile_reg.test(tel)) {
                $(this).css('border', '1px solid red');
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写正确的手机号码',
                    speed: 200
                });
            } else {
                $(this).css('border', '1px solid #eaeaea');
            }
        } else {
            $(this).css('border', '1px solid #eaeaea');
        }
    })
}

// 编辑状态下删除票，去除座位选择
function EditDelBusSeat($tr){
    var seat_data = $tr.data('site');
    if( seat_data ){
        var bus = seat_data.bus_num,
            seat = seat_data.num;
        $('#bus'+(bus-1)+' .seats[n='+seat+']').removeClass('actives');
    }
}

// 游客信息事件
function TouistEvent(){
    var $table = $(".order_touristInfo .tourist-table table");
    // 移除套票多余关闭按扭
    $table.find('tbody[type="group"]').each(function(){
        $(this).find('tr:gt(0) .resuce_passengerTicket').remove();
    });
    // 更改数字前标
    $table.find('tbody tr').each(function(index){
        $(this).find('.order_number').text(index+1);
    });
    // 移除游客信息
    $table.find('.resuce_passengerTicket').off().on('click',function(){
        var $tbody = $(this).parents('tbody'),
            ttid = $tbody.attr('tid'),
            type = $tbody.attr('type');
        if( type == 'normal' ){
            var $tr = $(this).parents('tr');
            $tr.addClass('remove');
            // 编辑状态下删除票，去除座位选择
            EditDelBusSeat($tr);
        }
        if( type == 'group' ){
            $tbody.addClass('remove');
            $tbody.prev().addClass('remove');
            $tbody.find('tr').each(function(){
                // 编辑状态下删除票，去除座位选择
                EditDelBusSeat($(this));
            })
        }
        $('.order_ticketlist tr[tid='+ttid+'][type='+type+'] .people_num .order_reduceBtn').click();
    });
    SiteSelect();
    TouistTemplateEvent();
}

// 新增票，新增游客信息模板
function TouistTemplate(tid,$tr,ticketdata,ActiveType){
    var data = ticketdata[tid];
    var $table = $(".order_touristInfo .tourist-table table");
    var interText = doT.template($("#TouristTemplage").text());
    data['round'] = 0;

    switch(ActiveType){
        case 'add':
            if( data.t_preset_type == '套票' ){
                $table.append(interText(data));
            }else{
                if( $table.find('tbody[tid='+tid+']').size() ){
                    data['TplHave'] = 1;
                    $table.find('tbody[tid='+tid+']').append(interText(data));
                }else{
                    data['TplHave'] = 0;
                    $table.append(interText(data));
                }
            }
            break;
        case 'reduce':
            if( $table.find('.remove').length ){
                $table.find('.remove').remove();
            }else{
                if( data.t_preset_type == '套票' ){
                    $table.find('tbody[tid='+tid+']').each(function(){
                        if( $(this).find('tr.has-del').size() ){
                            $(this).addClass('has-del');
                            $(this).prev().addClass('has-del');
                        }
                    })
                    $table.find('tbody[tid='+tid+']:not(.has-del):last').remove();
                    $table.find('thead[tid='+tid+']:not(.has-del):last').remove();
                }else{
                    $table.find('tbody[tid='+tid+'] tr:not(.has-del):last').remove();
                }
            }
            break;
        case 'change':
            var num = parseInt($tr.find('.people_num input').val());
            data['round'] = num;
            if( num ){
                if( $table.find('tbody[tid='+tid+']').size() ){
                    data['TplHave'] = 1;
                    $table.find('tbody[tid='+tid+']').html(interText(data));
                }else{
                    data['TplHave'] = 0;
                    $table.append(interText(data));
                }
            }
            break;
    }
    TouistEvent();
}

// 获取所有票汇总信息
function AllTicketInfo(){
    var all_people_num = 0;
    var $tickettr = $('.order_ticketlist .ticket-table tbody tr[type=normal],.order_ticketlist .ticket-table tbody tr[type=group]');
    $tickettr.each(function(){
        all_people_num += parseInt($(this).find('.people_num input').val());
    })
    return all_people_num;
}

// 数量选择-变化
function ChangeNum($here,$tr,ticketdata,tid){
    var tid = $tr.attr('tid');
    // 票价类型 正常票=normal 套票=group 套票子票=group-normal
    var tr_type = $tr.attr('type');

    var people_num = parseInt($tr.find('.people_num input').val()),
        bed_num = parseInt($tr.find('.bed_num input').val());
    var ActiveType = 'change',
        ActiveTo = '';
    if( $here.hasClass('order_reduceBtn') ){
        ActiveType = 'reduce';
    }
    if( $here.hasClass('order_addBtn') ){
        ActiveType = 'add';
    }
    if( $here.parent().hasClass('people_num') ){
        ActiveTo = 'people';
    }
    if( $here.parent().hasClass('bed_num') ){
        ActiveTo = 'bed';
    }

    if( people_num > 1000 ){
        people_num = 0;
    }

    // 总人数
    var ChangeDom = 0;
    var all_people_num_start = AllTicketInfo();
    if( ((all_people_num_start + ticketdata[tid].num) > INFO_DATA.num) && ActiveType == 'add' && ActiveTo == 'people' ){
        return false;
    }

    // 普通票算法
    if( tr_type == 'normal' ){
        switch(ActiveType){
            case 'add':
                if( ActiveTo == 'people' ){
                    people_num += ticketdata[tid].num;
                    bed_num += ticketdata[tid].room_num;

                    if( people_num == 0 ){
                        bed_num = 0;
                    }
                }else{
                    if( people_num > 0 ){
                        bed_num += 1;
                    }
                }
                break;
            case 'reduce':
                if( ActiveTo == 'people' ){
                    people_num -= ticketdata[tid].num;
                    bed_num -= ticketdata[tid].room_num;

                    if( people_num == 0 ){
                        bed_num = 0;
                    }
                }else{
                    if( people_num > 0 ){
                        bed_num -= 1;
                    }
                }
                if( people_num < 0 ){
                    people_num = 0;
                }
                if( bed_num < 0 ){
                    bed_num = 0;
                }
                break;
            case 'change':
                var thisnum = parseInt($here.val());
                if( thisnum ){
                    $here.val(thisnum);
                }

                if( people_num > 0 ){
                    if( ActiveTo == 'people' ){
                        people_num = people_num * ticketdata[tid].num;
                        bed_num = people_num * ticketdata[tid].room_num;
                    }else{
                        if( bed_num < 0 ){
                            bed_num = 0;
                        }
                    }
                }else{
                    people_num = 0;
                    bed_num = 0;
                }
                break;
            default:
                break;
        }

        // 填入计算后数据
        $tr.find('.people_num input').val(people_num);
        $tr.find('.bed_num input').val(bed_num);

        // 总人数
        var all_people_num = AllTicketInfo();
        // 超出总人数规定
        if( all_people_num > INFO_DATA.num ){
            var other_num = all_people_num - people_num;

            people_num = INFO_DATA.num - other_num;
            bed_num = people_num * ticketdata[tid].room_num;
            // 填入计算后数据
            $tr.find('.people_num input').val(people_num);
            $tr.find('.bed_num input').val(bed_num);
            ActiveType = 'change';
        }
        // 超出当前票人数规定
        if( ticketdata[tid].t_store != '-1' && people_num > ticketdata[tid].t_store ){
            people_num = ticketdata[tid].t_store;
            bed_num = people_num * ticketdata[tid].room_num;
            // 填入计算后数据
            $tr.find('.people_num input').val(people_num);
            $tr.find('.bed_num input').val(bed_num);
            ActiveType = 'change';
            return false;
        }

        var tr_price = (ticketdata[tid].t_price * people_num).toFixed(2);
        $tr.find('.tr_total').text('￥'+tr_price);

        // 显示同行价和佣金
        var trade_price = (ticketdata[tid].t_trade_price * people_num).toFixed(2),
            commission_price = (tr_price - trade_price).toFixed(2);
        $tr.find('.tr_total').attr('title','同行价：￥'+trade_price+' (佣金：￥'+commission_price+')');
    }
    // 套票算法
    if( tr_type == 'group' ){
        switch(ActiveType){
            case 'add':
                people_num += ticketdata[tid].num;
                bed_num += ticketdata[tid].room_num;
                break;
            case 'reduce':
                people_num -= ticketdata[tid].num;
                bed_num -= ticketdata[tid].room_num;
                if( people_num < 0 ){
                    people_num = 0;
                }
                if( bed_num < 0 || people_num == 0 ){
                    bed_num = 0;
                }
                break;
            default:
                break;
        }
        var base_num = parseInt(people_num/ticketdata[tid].num);

        $tr.find('.people_num input').val(people_num);
        $tr.find('.bed_num input').val(base_num*ticketdata[tid].room_num);

        var tr_price = (ticketdata[tid].t_price * base_num).toFixed(2);
        $tr.find('.tr_total').text('￥'+tr_price);

        // 显示同行价和佣金
        var trade_price = (ticketdata[tid].t_trade_price * base_num).toFixed(2),
            commission_price = (tr_price - trade_price).toFixed(2);
        $tr.find('.tr_total').attr('title','同行价：￥'+trade_price+' (佣金：￥'+commission_price+')');

        $('.order_ticketlist .ticket-table tr[pid='+tid+'][type="group-normal"]').each(function(){
            var ttid = $(this).attr('tid');
            var t_people_num = parseInt(base_num * ticketdata[tid]['list'][ttid].num),
                t_bed_num = parseInt(base_num * ticketdata[tid]['list'][ttid].room_num);
            $(this).find('.people_num input').val(t_people_num);
            $(this).find('.bed_num input').val(t_bed_num);
        })

        // 总人数
        var all_people_num = AllTicketInfo();
        // 超出总人数规定
        if( all_people_num > INFO_DATA.num ){
            $tr.find('.people_num .order_reduceBtn').click();
        }
        // 超出当前票人数规定
        if( ticketdata[tid].t_store != '-1' && base_num > ticketdata[tid].t_store ){
            $tr.find('.people_num .order_reduceBtn').click();
        }
    }
    // 套票子票算法
    if( tr_type == 'group-normal' && people_num > 0 ){
        switch(ActiveType){
            case 'add':
                bed_num += 1;
                break;
            case 'reduce':
                bed_num -= 1;
                break;
            default:
                break;
        }
        if( bed_num < 0 ){
            bed_num = 0;
        }
        $tr.find('.bed_num input').val(bed_num);

        var pid = $tr.attr('pid');
        var all_bed_num = 0;
        $('.order_ticketlist .ticket-table tr[pid='+pid+'][type="group-normal"]').each(function(){
            all_bed_num += parseInt($(this).find('.bed_num input').val());
        })
        $('.order_ticketlist .ticket-table tr[tid='+pid+'][type="group"] .bed_num input').val(all_bed_num);
    }

    if( ActiveTo == 'people' ){
        TouistTemplate(tid,$tr,ticketdata,ActiveType);
    }

    Settlement();
}

// 票价信息操作
function TicketListInit(ticketdata){
    var $wrap = $('.order_ticketlist'),
        $title = $wrap.find('.ticket-group'),
        $table = $wrap.find('.ticket-table');

    // 分组选择
    $title.find('li').on('click',function(){
        var gname = $(this).attr('gname');
        $(this).addClass('active').siblings().removeClass('active');
        switch(gname){
            case 'all':
                $table.find('tbody').show();
                break;
            default:
                $table.find('tbody').hide();
                $table.find('tbody[gname='+gname+']').show();
                break;
        }
    })

    // 数量操作
    $table.find('.people_num span,.bed_num span').on('click',function(){
        var $tr = $(this).parents('tr');
        ChangeNum($(this),$tr,ticketdata);
    })
    $table.find('input.people_number').on('keyup',function(){
        var $tr = $(this).parents('tr');
        ChangeNum($(this),$tr,ticketdata);
    })
}

// 票价信息数据按分组重组
function TicketListData(data){
    var ticket_group_arr = [];
    if( data.ticket ){
        for(var i in data.ticket){
            var gf = 0;
            for(var j = 0; j < ticket_group_arr.length; j++){
                if( data.ticket[i].t_room_groups == ticket_group_arr[j].gname ){
                    ticket_group_arr[j]['list'].push(data.ticket[i]);
                    gf = 1;
                    break;
                }
            }
            if( gf == 0 ){
                ticket_group_arr.push({
                    'gname' : data.ticket[i].t_room_groups,
                    'list' : [data.ticket[i]]
                })
            }
        }
    }
    return ticket_group_arr;
}

// 车位选择
function SeatInit(data){
    // 默认选中项
    for (k in data.seat_num) {
        for (p in data.seat_num[k]) {
            $('#bus' + (k - 1) + ' .seats').eq(data.seat_num[k][p] - 1).addClass('active').removeClass('null');
        }
    }
    // 前一辆车坐满自动跳到下一辆车
    (function(bus,seat){
        var blankBus = 1;
        for(var i = 0; i < bus.length; i++){
            var max = bus[i];
            var j = i + 1;
            if( !seat || !seat[j] || bus[i] > seat[j].length  ){
                blankBus = j;
                break;
            }
        }
        $('#buselsect').text('客车'+blankBus);
        $('#bus ul').eq(blankBus-1).show().siblings().hide();
    })(data.bl_bus,data.seat_num);

    // 选择客车
    $('.seats_select .dropdown-menu li').off().on('click',function() {
        $(this).parents('.dropdown').find('.dropdown-toggle').html($(this).find('a').html());

        

        });

    //客车选择
    $('#busselect li').on('click', function() {
        $('.seat_content').hide();
        $('#bus' + $(this).attr('data-id')).show();

        getBusHei();
    })
    //座位选择
    $('#bus .null').on('click',function() {
        $(this).toggleClass('actives');
    })

    getBusHei();
    }

    function getBusHei () {
        var hei = $("#bus").height();
        $("#busselect").css({
            'max-height': (hei * 0.85 + 'px'),
            'overflow' : 'auto'
        });
    }

// 游客信息相关事件
function TouristInfoEvent(){
    var $wrap = $('.order_touristInfo'),
        $table = $wrap.find('.tourist-table table');

    // 批量添加乘客
    $wrap.find('.select_addPassenger').on('click', function() {
        var tlength = $table.find('tbody tr').length;
        if (tlength > 0) {
            $("#batchFill_modal").modal("show");
        }else{
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请选择一个票',
                speed: 200
            });
        }
    })

    // 批量添加确认按扭
    $(".batch_confirmBtn").on('click', function() {
        get_tourist();
        $("#batchFill_modal").modal("hide");
    });
}

// 促销活动
function ActiveEvent(){
    // 选择活动默认促销类型
    if(INFO_DATA.p_promotion && INFO_DATA.p_promotion.length > 0){
        $(".activi_ul li").on("click",function(){
            var $lios = $(this).clone().get(0).outerHTML;
            $("#activi").html($lios);
            $(".activi_ul").css("display","");
            Settlement();
        })
        $("#activi").on("click",function(ev){
            ev.stopPropagation();
            $(".activi_ul").css("display","block");
        })
        $(document).on("click",function(){
            $(".activi_ul").css("display","");
        })
    }
}

// 下单提交最终数据
function SubmitAjax(busdata,tickets,again,yes){
    if( $('.stylesLoad').hasClass('subLoad') ){
        return false;
    }
    var no = GetQueryString('no') ? GetQueryString('no') : '';
    
    var data = {
        "state":INFO_DATA.state,
        "o_edit_lock":INFO_DATA.o_edit_lock,
        "no": no,
        // 订单编号
        "bl_id": INFO_DATA.bl_id,
        //班期ID (必需)
        "buy_uid": $("#bmrlist input").attr('uid'),
        //报名者ID (分销报名为空，代报名时必需)
        "o_vip_name": $("#order_emergencyContactName").val(),
        //紧急联系人姓名
        "o_vip_mob": $("#order_emergencyContactTel").val(),
        //紧急联系人手机号
        "o_remark": $("#input_remarkInfo").val(),
        //订单备注(前台标注：填写备注需要后供应商确认)
        "o_out_num": $("#order_outNumber").val(),
        //外部订单号
        "o_deal_num": $("#order_contactNumber").val(),
        //合同号
        "sell_favourable": $("#order_discount").val(),
        //优惠金额
        "settle_favourable": $("#order_settlementDiscount").val(),
        //结算优惠(代报名时可以填写)
        "url_bool": "yes",
        //跳过当天已经报过情况(当跳过提示时第二次提交，默认为空)
        "seat_spread": busdata,
        "ticket": tickets,
        "pp_id" : $("#activi li").eq(0).attr("pp_id"),
        "time_stamp": GetQueryString('time_stamp'),
        "sign": GetQueryString('sign'),
        "city_code": GetQueryString('city_code'),
        "p_id": GetQueryString('p_id'),
        "bl_yes": yes
    }
    if( again == 1 ){
        data['credit_pay'] = 1;
    }
    // var def_txt = $('.stylesLoad').eq(0).text();
    // $('.stylesLoad').html('提交中...').addClass('subLoad');
    $('.stylesLoad').addClass('subLoad');
    var PostshopplaceUrl = '/b2b/shop/place';
    ajaxRequest(PostshopplaceUrl, 'POST', data, function(ret) {
        if (ret.data && ret.code == 200) {
            if( ret.data.type == 'edit' ){ 
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '订单操作成功',
                    speed: 200
                });
                var t = setTimeout(function(){
                    window.location.href = '/OrderDetail/index/id/'+ret.data.number+'/source/frame/order_type/org_type='+ret.data.org_type;
                    clearTimeout(t);
                },2000)
            }else{
                if (ret.data.status == '待付款') {
                    window.location.href = '/Pay/order/no/' + ret.data.number;
                } else if (ret.data.status == '待确认') {
                    window.location.href = '/Buy/confirm_wait/no/' + ret.data.number;
                } else if (ret.data.status == '已付款') {
                    window.location.href = '/Buy/pay_success/no/' + ret.data.number;
                }
            }
        } else {
            if( ret.code == '902' ){
                $('#myModal').modal('show');
            }else if( ret.code == '612' ){
                $.MsgBox({
                    type: "confirm",
                    title: '提示',
                    msg: ret.message,
                    speed: 200,
                });
                $('#msg_btn_ok').on('click',function(){
                    SubmitAjax(busdata,tickets,1,yes);
                })
            } else if(ret.code == '683') {
                var megs = $.parseJSON(ret.message);
                //需确认
                var html = '<div><span class="examineState"></span><h4 style="color:#f00;font-size:16px;">线路供应商需审核此订单游客</h4>';

                        for (i in megs) {
                            html += '<p style="font-size:12px;margin-bottom:0px;"><span>'+megs[i].vip_name +'</span><span>('+megs[i].b_name+')</span>  <span>'+megs[i].b_mobile+'</span> <span>'+megs[i].b_card+'</span></p><p><span style="color:#999">理由：'+megs[i].b_sorg_reason + '</span>';
                        }
                       html  +='</p></div>';

                $.MsgBox({
                    type: "confirm",
                    title: '友情提示',
                    msg: html,
                    speed: 200,
                    callback: function() {
                        // var sty = '1';
                        SubmitAjax(busdata,tickets,again,1);
                    }
                });
            } else if(ret.code == '682') {
                var megs = $.parseJSON(ret.message);
                //不接待
                var html = '<div><span class="refuseState"></span><h4 style="color:#f00;font-size:16px;">线路供应商无法接待此订单游客</h4>';

                        for (i in megs) {
                            html += '<p style="font-size:12px;margin-bottom:0px;"><span>'+megs[i].vip_name +'</span><span>('+megs[i].b_name+')</span>  <span>'+megs[i].b_mobile+'</span> <span>'+megs[i].b_card+'</span></p><p><span style="color:#999">理由：'+megs[i].b_sorg_reason + '</span>';
                        }
                       html  +='</p></div>';
                       
                $.MsgBox({
                    type: "alert",
                    title: '友情提示',
                    msg: html,
                    speed: 200
                });
            } else{
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: ret.message,
                    speed: 200
                });
            }
        }
        // $('.stylesLoad').text(def_txt).removeClass('subLoad');
        $('.stylesLoad').removeClass('subLoad');
    })
}
// 下单
function Submit(){
    // 代下单信息判断
    var dbmv = $('#dbmlist input').val(),
        bmrv = $("#bmrlist input").val();

    if (window.location.href.indexOf('order.html')>-1) {
        if( dbmv && !bmrv ){
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请选择报名人',
                speed: 200
            });
            return false;
        }
    }
    
    // 判断是否选择票据
    var $ticketlist = $('.order_touristInfo .tourist-table table tbody tr:not(.has-del)');
    if( !$ticketlist.length ){
        $.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请添加至少一组游客信息',
            speed: 200
        });
        return false;
    }
    // 票据遍历
    var ticket_ok_num = 0;
    var i_c_list = [];

    var MobileFlag = 0,
        MobileFlagTel = '';

    $ticketlist.each(function(index){
        // 重新开始验证时身份证红框取消
        $ticketlist.find('.passenger_id').css('border-color','#eaeaea');
        // 其本信息
        var i_n = $(this).find('.passenger_name').val();
        var i_m = $(this).find('.passenger_tel').val();
        var i_c = $(this).find('.passenger_id').val();

        // 验证是否有已下过单用户手机号码
        var no = GetQueryString('no') ? GetQueryString('no') : '';
        if( !no ){
            for(var i = 0; i < INFO_DATA.vip_mob.length; i++){
                if( i_m == INFO_DATA.vip_mob[i] ){
                    MobileFlag = 1;
                    MobileFlagTel = i_m;
                    break;
                }
            }
        }

        // 验证身份证是否有重复
        if( i_c ){
            var i_c_flag = 0;
            for(var i = 0; i < i_c_list.length; i++){
                if( i_c == i_c_list[i].no ){
                    $.MsgBox({
                        type: "alert",
                        title: '提示',
                        msg: '身份证重复，请从新填写提示',
                        speed: 200
                    });
                    i_c_flag = 1;
                    // 身份证号相同，红框提示位置
                    $(this).find('.passenger_id').css('border-color','#f00');
                    $ticketlist.eq(i_c_list[i].ind).find('.passenger_id').css('border-color','#f00');
                    break;
                }
            }
            if( i_c_flag == 1 ){
                return false;
            }else{
                var i_c_data = {
                    no : i_c,
                    ind : index
                }
                i_c_list.push(i_c_data);
            }
        }
        
        // 去程返程信息是否全部填写
        var site_data = $(this).data('site');
        if( !site_data ){
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请添加去程、返程站点'
            });
            return false;
        }

        // 限制信息
        var $tbody = $(this).parents('tbody'),
            tr_type = $tbody.attr('type');
        var tid = $tbody.attr('tid');
        var card_typeval = $(this).find('.card_type').html();
        if( tr_type == 'normal' ){
            var limit_typeval = INFO_DATA.ticket[tid].t_limit_type;
            var limit_conditionval = INFO_DATA.ticket[tid].t_limit_condition;
        }
        if( tr_type == 'group' ){
            ttid = $(this).attr('tid');
            var limit_typeval = INFO_DATA.ticket[tid].list[ttid].t_limit_type;
            var limit_conditionval = INFO_DATA.ticket[tid].list[ttid].t_limit_condition;
        }

        // 验证电话号码
        if (i_m) {
            var mobile_reg = /(^0?[1][34857][0-9]{9}$)/;
            if (!mobile_reg.test(i_m)) {
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写正确的手机号码',
                    speed: 200
                });
                return false;
            }
        }

        if (limit_typeval != '无限制' && card_typeval == "身份证") {
            if (i_c == '') {
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: '请填写身份证号',
                    speed: 200
                });
                return false;
            }
            var opt = {
                card_type: card_typeval,
                limit_type: limit_typeval,
                limit_condition: limit_conditionval
            }
            var rst = chechIdcard(i_c, opt);
            //验证失败
            if (rst.start == 0) {
                $.MsgBox({
                    type: "alert",
                    title: '提示',
                    msg: rst.info,
                    speed: 200
                });
                $(this).find('input.passenger_id').css({
                    border: '1px solid #f00'
                })
                return false;
            }
            //验证成功
            if (rst.start == 1) {
                ticket_ok_num++;
            }
        }else{
            ticket_ok_num++;
        }
    })

    //验证买票数据是否完整
    if( ticket_ok_num < $ticketlist.length ){
        $.MsgBox({
            type: "alert",
            title: '提示',
            msg: '请填写正确的游客信息',
            speed: 200
        });
        return false;
    }

    //获取座位数据
    var buslist = $('.seat_content')
    var busdata = []
    $.each(buslist, function(index) {
        var busnum = $(this).find('.actives');
        var busnums = [];
        $.each(busnum, function(index) {
            busnums.push($(this).text())
        })
        busdata.push({
            "bus": (Number(index) + 1),
            "num": busnums
        })
    })


    var $tickettr = $('.order_ticketlist .ticket-table tbody tr[type=normal],.order_ticketlist .ticket-table tbody tr[type=group]');
    // 验证人数跟座位数相等
    if ( INFO_DATA.bl_right_seat == "对号入座（人工选择）" ){
        var allNum = 0;
        $tickettr.each(function(){
            allNum += parseInt($(this).find('.people_num input').val());
        })
        var seats = 0;
        for (var i = 0; i < busdata.length; i++) {
            seats += busdata[i].num.length;
        }
        if (seats != allNum) {
            $.MsgBox({
                type: "alert",
                title: '提示',
                msg: '请选择正确的座位数量',
                speed: 200
            });
            return false;
        }
    }

    // 按后端数据格式生成所有票数据
    var tickets = [];
    var start_date = INFO_DATA.bl_start_date.replace(/\-/gi,''),
        end_date = INFO_DATA.bl_end_date.replace(/\-/gi,'');

    

    $tickettr.each(function(){
        var type = $(this).attr('type'),
            tid = $(this).attr('tid'),
            num = $(this).find('.people_num input').val(),
            room_num = $(this).find('.bed_num input').val();

        if( num > 0 ){
            // 普通票
            var seat = [];
            if( type == 'normal' ){
                $('.order_touristInfo .tourist-table tbody[tid='+tid+'] tr:not(.has-del)').each(function(){
                    var this_seat = $(this).data('site');
                    seat.push({
                        "id" : this_seat.id,
                        "start_site_type": this_seat.gotype,
                        "start_site" : this_seat.gosname,//去程站点名称
                        "start_sid" : this_seat.goid,//去程站点ID
                        "start_date" : start_date,//出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
                        "start_price" : this_seat.goprice,
                        "end_site_type": this_seat.backtype,
                        "end_site" : this_seat.backsname,//返程站点名称
                        "end_sid" : this_seat.backid,//返程站点ID
                        "end_date" : end_date,//返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
                        "end_price" : this_seat.backprice,
                        "vip_name" : $(this).find('.passenger_name').val(),//游客姓名
                        "vip_mob" : $(this).find('.passenger_tel').val(),//游客手机号
                        "vip_card_type" : $(this).find('.card_type').text(),//游客证件类型
                        "vip_card" : $(this).find('.passenger_id').val()//游客证件号
                    })
                })
            }

            // 套票
            var list = {};
            if( type == 'group' ){
                $('.order_touristInfo .tourist-table tbody[tid='+tid+'] tr:not(.has-del)').each(function(){
                    var ttid = $(this).attr('tid');
                    var this_seat = $(this).data('site');
                    var $tr = $('.order_ticketlist .ticket-table tbody tr[tid='+ttid+'][pid='+tid+']');
                    var se = {
                        // "pid" : tid,
                        "id" : this_seat.id,
                        "start_site_type": this_seat.gotype,
                        "start_site" : this_seat.gosname,//去程站点名称
                        "start_sid" : this_seat.goid,//去程站点ID
                        "start_date" : start_date,//出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
                        "start_price" : this_seat.goprice,
                        "end_site_type": this_seat.backtype,
                        "end_site" : this_seat.backsname,//返程站点名称
                        "end_sid" : this_seat.backid,//返程站点ID
                        "end_date" : end_date,//返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
                        "end_price" : this_seat.backprice,
                        "vip_name" : $(this).find('.passenger_name').val(),//游客姓名
                        "vip_mob" : $(this).find('.passenger_tel').val(),//游客手机号
                        "vip_card_type" : $(this).find('.card_type').text(),//游客证件类型
                        "vip_card" : $(this).find('.passenger_id').val()//游客证件号
                    }

                    if( list.hasOwnProperty(ttid) ){
                        list[ttid]['seat'].push(se)
                    }else{
                        list[ttid] = {
                            'id' : ttid,
                            'num' : $tr.find('.people_num input').val(),
                            'room_num' : $tr.find('.bed_num input').val(),
                            'seat' : [se]
                        }
                    }
                })
            }

            tickets.push({
                'id' : tid,
                'num' : num,
                'room_num' : room_num,
                'seat' : seat,
                'list' : list
            })
        }
    })

    if( MobileFlag == 1 ){
        $.MsgBox({
            type: "confirm",
            title: '提示',
            msg: '<p>当前客户当天存在订单，联系电话：'+ MobileFlagTel +'</p> <p>请确认是否继续下单！</p>',
            speed: 200,
        });
        $('#msg_btn_ok').on('click',function(){
            SubmitAjax(busdata,tickets);
        })
        return false;
    }else{
        SubmitAjax(busdata,tickets);
    }
}

// pos单位置炫浮
function PosPosition(){
    $(window).on('scroll',function(){
        var st = $(window).scrollTop();
        if( st > 200 ){
            var ww = $(window).width();
            if( ww > 1220 ){
                var w = ($(window).width() - 1220)/2 + 970;
            }else{
                var w = 970;
            }
            $('.order_balance').css({
                'position' : 'fixed',
                'left' : w + 'px',
                'top' : '-50px'
            })
        }else{
            $('.order_balance').css({
                'position' : 'static'
            })
        }
    })
}

// 其他事件
function OtherEvent(){
    //优惠金额变化
    $('#order_discount').on('blur', function() {
        Settlement();
    })

    // 结算优惠，代报名时才有
    $('#order_settlementDiscount').on('blur', function() {
        Settlement();
    })

    // pos显隐操作
    $('.balance_info .eye').on('click',function(){
        $(this).toggleClass('open');
        $('.balance_info .special_price').toggle();
    })

    //pos列表的收起与展开
    $('.stopList').on('click',function() {
        $('.stopList').hide();
        $('.openList').show();
        $('.order_balanceDetails').hide();
        $('.order_submit').hide();
    });
    $('.openList').on('click',function() {
        $('.openList').hide();
        $('.stopList').show();
        $('.order_balanceDetails').show();
        $('.order_submit').show();
    });
}