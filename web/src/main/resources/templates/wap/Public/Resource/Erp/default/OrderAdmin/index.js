/**
 * Created by Johony on 16-1-21.
 */
var od_data={};
var ROW={};
var del_order_info = {};
Ext.onReady(function(){

    var panelHeight = '80%';
    //1. 出团计划单跳转时，隐藏订单列表头部
    //2. 产品汇总报表跳转到订单列表时，隐藏订单列表头部
    if( bl_id>0 || o_product_id || org_id ){
        panelHeight = '94%';
    }


    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url= $__app__+'/OrderAdmin/OrderJson';
    var field = [];
    var store= SUNLINE.JsonStore(url,field,false);
    SUNLINE.baseParams(store,{order_type:order_type,
        bl_id:bl_id,
        bus_num:bus_num,
        o_product_id: o_product_id,
        o_cb_id: o_cb_id,
        o_sorg_id: o_sorg_id,
        time_type: time_type,
        order_start_time: order_start_time,
        order_end_time: order_end_time,
        out_order:'1',
        //org_type: org_type,
        org_id: org_id,
        t_type: t_type,
        ip:ip,
        start_time:start_time,
        end_time:end_time,
        t_org_id: t_org_id});
    store.load();

    //不含退票订单复选框
    $(".out_checks").on("click",function(){
        $(".out_checks").toggleClass("out_check");
        if( $(".out_checks").hasClass("out_check")){
            SUNLINE.baseParams(store,{order_type:order_type,bl_id:bl_id,bus_num:bus_num,out_order:'1'});
        }else {
            SUNLINE.baseParams(store,{order_type:order_type,bl_id:bl_id,bus_num:bus_num,out_order:'0'});
        }
        store.load();

    })


    //下订单列表显示(start)
    var BuySeller='<ul>' +
        '<li><span class="buy">买：</span><span class="ti-info"><span>{o_sorg_name}{[ this.o_remark(values) ]}</span><p>{[ this.buyerName(values) ]}</p></span></li>' +
        '<li><span class="sale">卖：</span><span class="ti-info">{[ this.SellerName(values) ]}【<font color="blue">{o_cb_name}</font>】</span></li>{[ this.expireOrder(values) ]}' +
        '</ul>';
    if(order_type=='buyer'){
        BuySeller='<ul>' +
            '<li><span class="buy">卖：</span><span class="ti-info">{[ this.SellerName(values) ]}</span></li>' +
            '<li><span class="sale">买：</span><span class="ti-info">{[ this.buyerName(values) ]}{[ this.o_remark(values) ]}</span></li>{[ this.expireOrder(values) ]}' +
            '</ul>';
    }
    var order_tpl = new Ext.XTemplate(
        '<table class="main-table"  width="100%" cellspacing="0" >'+
        '<tbody>',
        '<tpl for=".">',
        '<tr class="order-list">'+
        '<td class="order-info">'+
        '<ul>'+
        '<li><span class="title title-color">订单号：</span><span class="info info-color">{o_number}</span></li>'+
        '<li><span class="title">预定：</span><span class="info">{o_sell_time}</span></li>'+
        '<tpl if = "o_vip_name">',
        '<li><span class="title">联系：</span><span class="info">{o_vip_name} &nbsp;{o_vip_mob}</span></li>'+
        '</tpl>',
        '</ul>'+
        '</td>'+
        '<td class="goods-info">'+
        '<ul>'+
        '<li>{[ this.getGoalUrl(values)]}{[ this.appendOrder(values) ]}</li>'+
        '<li><span class="li-left">出团：{o_start_date}</span><span class="li-right">回团：{o_end_date}</span></li>'+
        '<li><span class="li-left">出发城市：{o_start_city}</span><span class="li-right">天数：{o_days}日 <font class="order-team-cls">{o_team_detail}</font></span></li>'+
        '</ul>'+
        '</td>' +
        '<td class="tourist-info">' +
        BuySeller +
        '</td>'+
        '<td class="price-info">{[ this.TicketDetail(values) ]}</td>' +
        '<td class="handle-info">{[ this.HandleMenu(values) ]}</td>'+
        '</tr>',
        '</tpl>',
        '</tbody>'+
        '</table>',
        {
            appendOrder:function(r){
                if(r.o_append_order==1){
                    return '<span class="sub_order">补单</span>';
                }
            },
            expireOrder:function(r){
                if(r.o_status=='待付款'){
                    return '<li><span class="set_time" id="'+r.o_number+'" expireTime="'+ r.o_expire+'"></span></li>';
                }
            },
            buyerName:function(r){
                if(r.o_status=='退票'){
                    return '<i>'+r.o_name+'</i><i class="ti-tell" data-id = "'+r.o_uid+'">[查看联系方式]</i><span class="pay-id back-cls">'+r.o_status+'</span>';
                }
                var type='<span class="pay-id red-cls">未支付</span>';
                if(r.o_payment_type){
                    type='<span class="pay-id pay-cls">在线支付</span>';
                }
                if(r.o_payment_type == 'line'){
                    type='<span class="pay-id line-cls">线下支付</span>';
                }
                if(r.o_payment_type == 'credit'){
                    type='<span class="pay-id credit-cls">信用支付</span>';
                }


                var mobile='';
                if(r.o_source=='m'){
                    mobile='<span class="order-mobile"><img src="http://img.jdytrip.cn/2017/07596dac2ac461b.png"></span>';
                }
                return '<i>'+r.o_name+'</i><i class="ti-tell" data-id = "'+r.o_uid+'">[查看联系方式]</i>'+type+mobile;
            },
            o_remark:function(r){
                var o_remark='',remark_color='';
                if(r.o_remark != ''){
                    o_remark=r.o_remark;
                    remark_color=' <span class=""><img src="/Public/Images/o_remark.png" data-qtip="'+o_remark+'"></span>';
                }
                return remark_color;
            },
            SellerName:function(r){
                var tpl= r.o_service_name;
                var replace='';
                if(r.o_uid!= r.o_create_uid)replace=' <font color="#ff4500"><b>(代报名)</b></font>';
                if(order_type=='buyer'){
                    tpl='<span class="ti-info"><span>'+ r.o_worg_name+'【<font color="blue">'+r.o_cb_name+'</font>】</span><p>客服：<i>'+ r.o_service_name+'('+ r.o_service_tel+')</i>'+replace+'</p></span>'
                }else{
                    tpl+=replace;
                }
                return tpl;
            },
            HandleMenu:function(r){
                //查看订单详情
                var confirm_id=r.o_confirm_id;
                var show_detail='';
                if(power_control('订单详情', r.o_status,r)){
                    show_detail='<a href="javascript:;" onclick = UrlOrderDetail("'+r.o_number+'") class="menu">' +
                        '<i class="fa fa-file-text-o"></i>订单详情<i class="fa fa-caret-down"></i></a>';
                }

                //编辑游客(有权限，不等于退票)
                var set_order='',edit_type='',order_edit_type='';
                //订单修改
                if(order_type=='buyer'){
                    order_edit_type='买家订单修改';
                }else {
                    order_edit_type='卖家订单修改';
                }
                if(power_control(order_edit_type,r.o_status,r)){
                    if(confirm_id>0){
                        set_order='<li class="readonly">订单修改</li>'
                    }else{
                        if(order_type=='buyer' &&  r.o_status != '待确认'){
                            edit_type='submitAudit';
                        }else{
                            edit_type='orderEdit';
                        }
                        set_order='<li><a href = "'+$__app__+'/OrderAdmin/order_set?no='+r.o_number+'&order_type='+order_type+'&type='+edit_type+'" target = "_blank">订单修改</a></li>';
                    }

                }

                //订单审核
                var check_order='';
                if(power_control('订单审核',r.o_status,r)){
                    edit_type='checkAudit';
                    check_order='<li class="disabled"><a href = "order_set?no='+r.o_number+'&order_type='+order_type+'&type='+edit_type+'" target = "_blank">订单审核</a></li>';
                }
                //取消审核
                var check_cancel='';
                if(power_control('取消审核',r.o_status,r)){
                    check_cancel= '<li><a href = "javascript:;" onclick=cancelCheck("'+r.o_number+'","'+ r.o_status+'")>取消审核</a></li>';
                }


                //调整金额(有权限，不等于退票)
                var chang_money='';
                if(power_control('调整金额', r.o_status,r)){
                    if(confirm_id>0){
                        chang_money = '<li class="readonly">调整金额</li>';
                    }else{
                        chang_money = '<li><a href = "javascript:;" onclick=changePrice("'+r.o_number+'")>调整金额</a></li>';
                    }
                }

                //调整座位(有权限，不等于退票)
                var chang_seat='';
                if(power_control('调整座位', r.o_status,r)){
                    if(confirm_id>0){
                        chang_seat = '<li class="readonly">调整座位</li>';
                    }else{
                        chang_seat = '<li><a href = "javascript:;" onclick = changeSeat("'+r.o_number+'")>调整座位</a></li>';
                    }
                }

                //取消订单(有权限，不等于退票)
                var delete_order='',order_cancel_type='';
                if(order_type=='buyer'){
                    order_cancel_type='买家取消订单';
                }else {
                    order_cancel_type='卖家取消订单';
                }
                if(power_control(order_cancel_type, r.o_status,r)){
                    delete_order='<li><a href = "javascript:;" onclick = delOrder("'+r.o_number+'")>取消订单</a></li>';
                }

                //发送短信
                var sms_send='';
                if(power_control('发送短信', r.o_status,r)){
                    if(confirm_id>0){
                        sms_send='<li class="readonly">发送短信</li>';
                    }else{
                        sms_send='<li><a href = "javascript:;" onclick = SmsOrder("'+r.o_number+'")>发送短信</a></li>';
                    }
                }

                //立即支付
                var pay_order='';
                if(power_control('立即支付', r.o_status,r)){
                    if(confirm_id>0){
                        pay_order = '<li><span class="readonly">立即支付</span></li>';
                    }else{
                        if(order_type=='buyer' && r.o_status == '收款中' && r.o_payment_type == 'line'){
                            pay_order = '<li><span onclick = LinePayOrder("'+r.o_number+'")>立即支付</span></li>';
                        }else{
                            pay_order='<li><a href = "/Pay/order/no/'+r.o_number+'" target="_blank" onclick = PayOrder("'+r.o_number+'")>立即支付</a></li>';
                        }
                    }
                }

                //生成支付二维码
                var wx_pay_qrcode='';
                if(power_control('支付二维码', r.o_status,r)){
                    if(confirm_id>0){
                        wx_pay_qrcode = '<li class="readonly">支付二维码</li>';
                    }else{
                        wx_pay_qrcode = '<li><a href = "javascript:;" onclick = creat_qrcode("'+r.o_number+'")>支付二维码</a></li>';

                    }
                }

                /*//查看订单确认单
                 var show_confirm='';
                 if(power_control('查看确认单', r.o_status,r)) show_confirm='<li><a href = "/Confirmation/index/o_number/'+r.o_number+'" target="_blank">查看确认单</a></li>';*/

                //调整预留时间
                var obligate_order='';
                if(power_control('调整预留时间', r.o_status,r)){
                    obligate_order='<li><a href = "javascript:;" onclick = ObligateOrder("'+r.o_number+'","'+ r.o_status+'",'+ r.o_settle_real+')>调整预留时间</a></li>';
                }

                //线下支付
                var line_order='';
                if(power_control('线下支付', r.o_status,r)){
                    if(confirm_id>0){
                        line_order='<li class="readonly">线下支付</li>';
                    }else{
                        line_order='<li><a href = "javascript:;" onclick = linePay("'+r.o_number+'")>线下支付</a></li>';
                    }

                }
                //组团社确认单
                var group_order='';
                if(power_control('组团社确认单', r.o_status,r)){
                    if(confirm_id>0){
                        group_order='<li class="readonly">组团社确认单</li>';
                    }else{
                        group_order='<li><a href = "/Confirmation/index/o_number/'+r.o_number+'/org_id/'+ r.o_worg_id+'"  class="print" target = "_blank">组团社确认单</a></li>';
                    }

                }
                // 代信用支付
                // var agent_credit='';
                // if(power_control('信用代支付', r.o_status,r)) line_order='<li><a href = "javascript:;" onclick = agent_credit_pay("'+r.o_number+'","'+ r.o_status+'",'+ r.o_settle_real+')>信用代支付</a></li>';

                //打印通知书(不为待确认、退票)
                var print_notice='';
                if(power_control('打印通知书', r.o_status,r)){
                    if(confirm_id>0){
                        print_notice='<li class="readonly" style="width: 108px">打印通知书</li>'
                    }else{
                        print_notice='<div class="print-menu"><a href="/PrintNotice/number_'+r.o_number+'/org_id/'+ r.o_sorg_id+'" class="print" target = "_blank"><i class="fa fa-print"></i>打印通知书</a></div>'
                    }
                }
                var status_color='';
                var color_class={待确认:'status-confirming',待付款:'status-ticketing',问题订单:'status-error',待审核:'status-confirm',
                    出票中:'status-ticketing',已出票:'status-ticketed',退票:'status-refund',收款中:'status-ticketing',已付款:'status-confirmed'};
                if(color_class[r.o_status]){
                    if(order_type=='buyer' && r.o_status=='待付款' && r.o_confirm_id ==0){
                        status_color = '<span  class="status '+color_class[r.o_status]+'"><a href = "/Pay/order/no/'+r.o_number+'" target="_blank" onclick = PayOrder("'+r.o_number+'")><span style="color: white">立即支付</span></a></span>';
                    }else if(order_type=='buyer' && r.o_status == '收款中' && r.o_payment_type == 'line' &&  r.o_confirm_id==0){
                        status_color = '<span  class="status '+color_class[r.o_status]+'"><span onclick = LinePayOrder("'+r.o_number+'")><span style="color: white">立即支付</span></span></span>';
                    }else if(  r.o_confirm_id >0 && order_type=='seller'){
                        status_color = '<span  class="status '+color_class['待审核']+'"><a href = "order_set?no='+r.o_number+'&order_type='+order_type+'&type='+edit_type+'" target = "_blank" ><span style="color: white">待审核</span></a></span>';
                    }else if( r.o_confirm_id >0 && order_type == 'buyer' ){
                        status_color = '<span  class="status '+color_class['待审核']+'">待审核</span>';
                    }else {
                        status_color = '<span class="status '+color_class[r.o_status]+'">'+r.o_status+'</span>';
                    }
                }else{
                    status_color = '<span class="status">'+r.o_status+'</span>';
                }
                var tpl=
                    '<div class="handle-menu">' +show_detail+
                    '<div class="handle-hide">' +
                    '<ul>' + set_order+chang_money+check_order+check_cancel + chang_seat + delete_order +  sms_send + pay_order + wx_pay_qrcode + obligate_order + line_order + group_order +'</ul>' +
                    '</div>' +
                    '</div>' +print_notice+
                    '<div class="status-id">' +status_color+'</div>';
                return tpl;
            },
            TicketDetail:function(r){
                var str=''/*,pop={big:0,small:0}*/;
                //房间、用票信息
                var room_detail=r.o_room_detail;
                for(var i in room_detail){
                    var val=room_detail[i];
                    str += '<li style="width: 120px"><span>'+val.t_name+'：</span><span>'+val.num+'份 x <i>'+val.t_price+'</i></span></li>';
                };
                //财务流水信息
                var payment_detail= r.payment_detail,payment='';
                for(var p in payment_detail){
                    var pv=payment_detail[p];
                    if(!pv.op_detail)continue;
                    payment += '<li style="width:120px"><span>'+pv.op_detail+'</span><span >'+pv.op_num+'份 x <i>'+ pv.op_price+'</i></span></li>';
                };
                var pop_str=[],pop_text='';
                //if(pop.big>0)pop_str.push(pop.big+'大');
                //if(pop.small>0)pop_str.push(pop.small+'小');
                if(r.o_big_num!=0)pop_str.push(r.o_big_num+'大');
                if(r.o_small_num!=0)pop_str.push(r.o_small_num+'小');
                if(pop_str.length>0)pop_text=pop_str.join('/');
                var discount='';
                var money_total=0;
                var act_detail='';
                if(r.o_discount){
                    Ext.each(r.o_discount,function(n){
                        var pay_type_detail='';
                        if(n.op_promotion_type)pay_type_detail=' （'+n.op_promotion_type+'后生效）';
                        act_detail +=  n.op_detail+"  : " +n.op_money +"元"+pay_type_detail+"\n";
                        money_total += Number(n.op_money);
                        if(n.op_status=='已付款'){
                            //payment += '<li><span>'+n.op_detail+'：</span><span>'+n.op_money+'</i></span></li>';
                            payment += '<li><span>'+n.op_detail+'</span><span class="r-cls"> <i>'+ n.op_money+'</i></span></li>';
                        }else{
                            var time = Date.parse(new Date())/1000;
                            var start_time = r.o_start_time || '23:59:59';
                            var o_start_time_str= r.o_start_date + ' ' + start_time;
                            var date_time=Date.parse(new Date(o_start_time_str))/1000;
                            if(in_array(r.o_status,['待确认','待付款'])!=-1 && date_time > time){
                                discount=' <p style=" color: #999; font-size: 12px;" title="'+act_detail+'(出团前在线支付后生效)"> (限时活动优惠:'+money_total+'元)</p>';
                            }
                        }
                    });
                }
                //补差操作
                var supply_money=parseFloat(r.o_settle_real)-parseFloat(r.o_pay_money);
                var supply='';

                if(supply_money>0 && r.o_status=='收款中'){
                    supply='<p style="font-size: 12px;color:blue" title="需要分销商再补'+supply_money.toFixed(2)+'元差价！">(需补差价:'+supply_money.toFixed(2)+'元)</p>';
                }

                if(r.o_status=='待付款'&&r.o_expire>0){
                    timer_string='';
                }else{
                    timer_string='';
                }
                var tpl=
                    '<p class="price-cursor cursor-person">' +
                    '<span class="num">人数：</span><span>'+pop_text+'</span>' +
                    '<div class="price-hover"><i class="s-top"></i><div class="hover-info"><ul id="ticket_name">'+str+'</ul></div></div>' +
                    '</p>' +
                    '<p class="red-color"><span>销售：</span><span>'+ r.o_buy_real+'</span></p>' +
                    '<p class="red-color price-cursor cursor-refund">'+ '<span>结算：</span><span>'+r.o_settle_real+'</span>' +
                    discount + supply+
                    '<div class="prices-hover" ><i class="s-top"></i>' +'<div class="hover-info"><ul>'+payment+'</ul></div>' +'</div>' +
                    '</p>'+timer_string;
                return tpl;
            },
            getGoalUrl:function(val){
                var org_url=_uinfo.org_url;
                if(!org_url){
                    org_url='';
                }
                return '<a href = "/'+org_url+'detail.html?p_id='+val.o_product_id+'" target = "_blank" style = "font-size: 14px;">' +'['+val.o_product_num+']'+ val.o_product_name+'</a>';
            }
        }
    );
    //console.log(fnaddbr(20));
    //window.order_line_pay=function (no,status,money){
    //    out_change_ajax({no:no,o_status:status,o_settle_real:money},$__app__ + '/Order/save_pay_line','您确定线下支付订单吗？');
    //};

    window.agent_credit_pay=function(no,status,money){
        out_change_ajax({no:no,o_status:status,o_settle_real:money},$__app__ + '/Order/agent_credit','您确定要用【买家信用额度】代支付吗？');
    };

    /**
     * 功能限制判断
     * @param type 功能项目
     * @param status 订单状态
     * @param row 订单数据
     * @returns {boolean}
     */
    function power_control(type,status,row){
        var role = _uinfo.r_role;
        var org_type = _uinfo.org_type;
        var pay_type=row.o_payment_type;
        var confirm_id=row.o_confirm_id;
        var team_detail = row.o_team_detail;
        var role_data={订单详情:'',卖家订单修改:'OrderAdmin::order_edit_worg',买家订单修改:'OrderAdmin::order_edit_sorg',调整金额:'OrderAdmin::changeMoney',确认订单:'OrderDetail::changeStatus',
            调整座位:'OrderAdmin::ajax_adjust_seat',卖家取消订单:'OrderAdmin::DelOrder_seller',买家取消订单:'OrderAdmin::DelOrder_buyer',查看确认单:'',打印通知书:'',
            买家发送短信:'OrderAdmin::sms_order_sorg', 卖家发送短信:'OrderAdmin::sms_order_org',/*立即支付:'OrderAdmin::pay_order',*/调整预留时间:'OrderAdmin::obligate_order',
            线下支付:'OrderDetail::line_order',/*信用代支付:'OrderDetail::agent_credit'*/ 审核订单:'OrderDetail::check_order',取消审核:'OrderDetail::cancel_check_order'};

        if(order_type=='buyer' && in_array(type,['订单详情','打印通知书','立即支付','取消订单','组团社确认单','订单修改','取消审核','买家取消订单','买家订单修改','买家发送短信'])==-1)return false;
        //权限判断
        if(in_array(role_data[type],role)==-1 && role_data[type])return false;
        //状态判断(退票信息下不显示)
        if(in_array(type,['订单详情'])==-1 && status=='退票')return false;
        // 订单修改
        // if(type==['订单修改']/* && confirm_id>0*/) return false;
        //取消订单
        if(type==['买家取消订单'] && status!='待确认'){
                return false;
        }
        //供应商订单审核
        if(type=='订单审核' && (confirm_id<=0 || order_type=='buyer'))return false;
        //分销商取消订单审核
        if(type=='取消审核' && (confirm_id<=0 || order_type=='seller'))return false;
        //查看确认单、确认订单(必需在待确认状态下操作)
        if(in_array(type,['查看确认单','确认订单'])!=-1 && status!='待确认')return false;
        //调整预留时间
        if(type=='调整预留时间' && (status!='待付款'||row.o_expire==0))return false;
        //打印通知书
        if(in_array(type,['打印通知书'])!=-1 && status=='待确认')return false;
        //立即支付
        if(type=='立即支付' && (in_array(status,['待付款','收款中'])==-1 || order_type=='seller'))return false;
        //二维码支付
        if(type=='支付二维码' && (in_array(status,['待付款','收款中'])==-1 || pay_type=='line'))return false;

        //线下支付
        if(type=='线下支付'  && (in_array(status,['待确认','待付款','收款中'])==-1 || order_type=='buyer' || pay_type=='bank-p'))return false;

        //if(type=='信用代支付'  && (in_array(status,['待确认','待付款'])==-1 || order_type=='buyer'))return false;
        //发送短信，发送过了将不能再发
        if(type=='发送短信' && (status=='退票' || row.o_sms>0))return false;
        //金额调整，支付中的订单将不能调整金额
        if(type=='调整金额' && (row.o_payment_no || confirm_id>0))return false;
        return true;
    }

    var order_view = new Ext.DataView({
        store:store,
        tpl:order_tpl,
        id : 'order_dv',
        autoHeight:true,
        multiSelect:true,
        border:false,
        overClass:'header-view-over',
        selectedClass:'header-view-selected',
        itemSelector:'div.thumb-wrap',
        emptyText: '<div style = "font-size: 18px;font-weight: bolder;color:#00b7ee;text-align: center;margin: 20px">暂无订单信息，快去下单哦</div>',
        renderTo:'main-info'
    });

    var order_panel = Ext.create('Ext.panel.Panel', {
        region:'center',
        frame:false,
        width: "100%",
        height: panelHeight,
        border:false,
        autoScroll:true,
        items:[ order_view ],
        bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            items:[
                '-',
                {xtype:'tbtext',id:'total_id',text:''},
                '-',
                {xtype:'tbtext',id:'page_id',text:''}
            ],
            emptyMsg:'没有订单信息'
        }),
        renderTo:'main-info'
    });

    store.on('load',function(t){
        var total_all=t.proxy.reader.rawData.total_all;
        var total_page=t.proxy.reader.rawData.total_page;
        var status_group=t.proxy.reader.rawData.status_group;
        for( var si in status_group){
            $("[data-group='"+status_group[si].o_status+"']").html('['+status_group[si].num+']');
        }
        for( var ai in total_all){
            if(!total_all[ai])total_all[ai]=0;
        }
        for( var pi in total_page){
            if(!total_page[pi])total_page[pi]=0;
        }
        if(!total_all.o_buy_real)total_all.o_buy_real=0;
        if(!total_page.o_buy_real)total_page.o_buy_real=0;
        Ext.getCmp('total_id').setText('<b style="color: #008000">总计</b>:[<font color="#ff4500">'+total_all.o_num+'</font>人 ]= ' +
            '销售额：<font color="#ff4500">'+(total_all.o_buy_real)+'</font> 元 结算额：<font color="#ff4500">' +(total_all.o_settle_real)+'</font> 元');
        var o_buy_real=(total_page.o_buy_real);
        var o_settle_real=(total_page.o_settle_real);
        if(!o_buy_real)o_buy_real=0;
        if(!o_settle_real)o_settle_real=0;
        if(total_page.o_big_num==null ||total_page.o_small_num==null){
            total_page.o_big_num=0;
            total_page.o_small_num=0;
        }
        Ext.getCmp('page_id').setText('<b style="color: #008000">当前</b>:[<font color="#ff4500">'+total_page.o_big_num+'</font>大/ <font color="#ff4500">'+total_page.o_small_num+'</font>小 ]= ' +
            '销售额：<font color="#ff4500">'+o_buy_real.toFixed(2)+'</font> 元 结算额：<font color="#ff4500">' +o_settle_real.toFixed(2)+'</font> 元');
        load_js();
    })
    //下订单列表显示(end)


    /*头部查询条件操作(start)*/
    //查询日期类型
    SUNLINE.LocalComob({
        id:'time_type',
        fields:['time_type'],
        data:[['出团日期'],['交易日期']],
        config:{
            allowBlank:true,
            id:'order_time_type',
            labelWidth:0,
            width:100,
            labelAlign:'right',
            fieldLabel:"",
            renderTo:'time_type',
            value:'交易日期'
        }
    });

    //开始日期
    SUNLINE.ExtDateField({labelSeparator:'',id:'order_start_time',name:'start_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'order_end_time',start:true,renderTo:'start_time'});
    //结束日期
    SUNLINE.ExtDateField({labelSeparator:'',id:'order_end_time',name:'end_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'order_start_time',renderTo:'end_time'});

    //单位信息操作（配置）
    var company_config={
        displayField:'text',
        valueField:'id',
        labelWidth:70,
        width:260,
        labelAlign: 'right',
        pageSize:20,
        labelSeparator:'：',
        value:'1111',
        listConfig:{
            minWidth:340
        }
    };
    //报名社查询操作（分销商）
    var sorg_config=Ext.apply(company_config,{
        id:'order_sorg_id',
        fieldLabel:'报名社',
        renderTo:'sorg_id'
    });
    if(_uinfo.org_type=='分销商'){
        sorg_config.value= order_type == 'buyer'?'全部公司':'';
    }else{
        sorg_config.value= '';
    }
    SUNLINE.CompanyBox({
        where:{  org_type:'分销商',source:'order',type :order_type},
        config:sorg_config
    });
    if(order_type == 'buyer'){
        var sorg_store=Ext.getCmp('order_sorg_id').store;
        sorg_store.on('load',function(a,b,c){
            this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
            for(var i in b){
                this.add(b[i]['data']);
            }
        })
        sorg_store.load();
    }

    //供应商查询操作
    var worg_config=Ext.apply(company_config,{
        id:'order_worg_id',
        fieldLabel:'供应商',
        renderTo:'worg_id'
    });
    if(_uinfo.org_type=='供应商'){
        worg_config.value= order_type == 'seller'?'全部公司':'';
    }else{
        worg_config.value= '';
    }
    SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order' ,type :order_type},
        config:worg_config
    });
    if(order_type == 'seller'){
        var worg_store=Ext.getCmp('order_worg_id').store;
        worg_store.on('load',function(a,b,c){
            this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
            for(var i in b){
                this.add(b[i]['data']);
            }
        })
        worg_store.load();
    }

    //用户操作
    var user_config={
        displayField:'u_realname',
        valueField:'u_id',
        tpl:Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item">{u_realname} - {u_mobile}</li>',
            '</tpl></ul>'
        ),
        labelWidth:70,
        width:180,
        labelAlign:'right',
        /*value:_uinfo.u_realname,*/
        pageSize:20,
        labelSeparator:'：',
        listConfig:{
            minWidth:340
        }
    };

    var user_fields=['u_id','u_mob','u_zname'];
    var user_url=$__app__ + '/Users/dataJson';

    //报名人操作
    var u_config=Ext.apply(user_config,{
        id:'order_uid',
        fieldLabel:'报名人',
        renderTo:'uid'
    });
    SUNLINE.CompanyBox({
        fields:user_fields,url:user_url,
        where:{ org_type:'分销商',source:'order',order_type:order_type },
        config:u_config
    });

    //产品计调操作
    var service_config=Ext.apply(user_config,{
        id:'order_service_id',
        fieldLabel:'产品计调',
        renderTo:'service_id'
    });
    SUNLINE.CompanyBox({
        fields:user_fields,url:user_url,
        where:{ org_type:'供应商' },
        config:service_config
    });

    //产品类型
    var pro_type_publish=SUNLINE.productType({ id:'order_product_type',name:'product_type',fieldLabel:"产品类型",renderTo:'product_type',width:455,labelWidth:70,real_renderTo:'product_type_id' });
    var type_str=[];
    if(PRODUCTS_TYPE){
        for(var pi in PRODUCTS_TYPE){
            var p_type=PRODUCTS_TYPE[pi];
            if(!p_type[0])continue;
            type_str.push(p_type[0]);
        }
        SUNLINE.productTypeSetValues(pro_type_publish,type_str.join(',') );
    }

    //产品信息
    var com = SUNLINE.OrgCombo_Products_false({
        name: 'product_id',
        id: 'order_product_id',
        width: 455,
        allowBlank: true,
        editable: true,
        forceSelection: false,
        renderTo: 'product_id',
        fieldLabel: "产品信息",
        labelWidth: 70,
        where: {source: 'order',order_type:order_type},
        valueField: 'p_id'
    });

    //产品品牌
    var brand_box = SUNLINE.ComBoxPlus({
        where: {order_type: order_type, p_list:'product_list'},
        id: 'order_company_brand',
        name: 'p_cb_name',
        fields: ['cb_id', 'cb_name'],
        url: $__app__ + '/Brand/getOrderBrand',
        config: {
            readOnly: true,
            displayField: 'cb_name',
            emptyText: '',
            valueField: 'cb_id',
            width: 220,
            value: '',
            pageSize: 0,
            fieldLabel: '产品品牌',
            labelWidth: 60,
            labelAlign: 'right',
            padding: '0 0 0 0',
            renderTo:'company_brand_id',
            listConfig:{
                minWidth:180,
            }
        },
    });

    brand_box.on('focus', function(c,r){
        var list_store = brand_box.getStore();
        SUNLINE.baseParams(list_store,{order_type: order_type, p_list:'product_list'});
        brand_box.setReadOnly(false);
        brand_box.setValue('');
        list_store.currentPage=1;
        list_store.load();
    });


    //支付类型
    var pay_type=SUNLINE.LocalComob({
        id:'order_paytype_id',
        fields:['text','code'],
        data:[
            {'text':'全部','code':''},
            {'text':'未支付','code':'none'},
            {'text':'线下支付','code':'line'},
            {'text':'信用支付','code':'credit'},
            {'text':'在线支付','code':'bank-p'}
        ],
        config:{
            id:'order_paytype_id',
            valueField:'code',
            displayField:'text',
            renderTo:'paytype_id',
            fieldLabel:'支付方式',
            labelWidth:60,
            width:190,
            labelAlign: 'right'
        }

    });


    //报名社与报名人联动
    Ext.getCmp('order_sorg_id').on({
        select:function(v,r){
            var row= r[0].data;
            var uid_store=Ext.getCmp('order_uid').store;
            SUNLINE.baseParams(uid_store,{org_id:row.id},true);
            uid_store.load();
        }
    });

    //供应商与产品计调联动
    Ext.getCmp('order_worg_id').on({
        select:function(v,r){
            var row= r[0].data;
            var service_store=Ext.getCmp('order_service_id').store;
            SUNLINE.baseParams(service_store,{org_id:row.id},true);
            service_store.load();
        }
    });

    //详细搜索条件的显示与隐藏
    var sele_whe=$('.sele_whe');
    var main_content = sele_whe.parents('.main-content');
    var height_search = main_content.find('.high-search');
    sele_whe.click(function(){
        var display = main_content.find('.high-search').css('display');
        var ico = $(this).find('i');
        if(display=='none'){
            ico.removeClass('fa-angle-down');
            ico.addClass('fa-angle-up');
            height_search.show();
        }else{
            ico.removeClass('fa-angle-up');
            ico.addClass('fa-angle-down');
            height_search.hide();
        }
    });

    var refresh = $('.refresh');
    refresh.unbind();
    refresh.on('click',function(){
        location.reload();
    });

    //头部的菜单按钮（订单类型切换按钮）
    $('.mt-left a').click(function(){
        $('.mt-left a').removeClass('a-hover');
        $(this).addClass('a-hover');
        var val = $(this).text().split('[');
        ROW.o_status = val[0];
        getThisData(val[0]);
    });
    /*根据订单类型搜索*/
    function getThisData(val){
        if(val != '所有订单'){
            $(".out_order").css("display","none");
            SUNLINE.baseParams(store,{status:val,out_order:0},true);
        }else{
            $(".out_order").css("display","block");
            SUNLINE.baseParams(store,{status:'',out_order:1},true);
        }
        store.currentPage = 1;
        store.load();
    }

    /*头部查询条件操作(end)*/

    //函数数据操作(start)
    var penalty_remarks_url = $__app__ + '/Order/orderDelReason';
    var penalty_remarks_field = [];
    var penalty_remarks_store = SUNLINE.JsonStore(penalty_remarks_url, penalty_remarks_field);
    var penalty_remarks = Ext.create('Ext.form.ComboBox', {
        id: 'penalty_remarks',
        fieldLabel: '取消原因',
        labelWidth: 60,
        labelAlign: 'right',
        store: penalty_remarks_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '',
    });
    var delForm = Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        style:'padding:10px',
        items:[
            {id:'penalty_number',name:'number',fieldLabel:'订单编号',allowBlank:false,disabled:true},
            {id:'penalty_status',name:'status',fieldLabel:'订单状态',allowBlank:false,disabled:true},
            {id:'penalty_real_money',name:'money',fieldLabel:'结算金额',allowBlank:false,disabled:true},
            {id:'penalty_name',name:'name',fieldLabel:'买家名称',allowBlank:false,disabled:true},
            {id:'penalty_person',name:'person',fieldLabel:'联系人',allowBlank:false,disabled:true},
            penalty_remarks,
            {id:'penalty_money',name:'penalty_money',fieldLabel:'违约金',xtype:'numberfield',regex:/^[0-9]\d*(\.\d+)?$/,regexText:'只能输入大于等于0的数字'}
        ]
    });
    var delOrderWin = Ext.create('Ext.window.Window',{
        title:"取消订单违约金",
        width:330,
        autoScroll: true,
        closeAction:'hide',
        items: delForm,
        modal: true,
        buttons:[
            {text:'确认',handler:delOrderSub},
            {text:'关闭',handler:function(){ delOrderWin.hide(); }}
        ]
    });
    window.delOrder=function(no){
        var data=get_store_find(no);
        var line_data ={
            "money":data.get('o_settle_real'),
            "status":data.get('o_status'),
            "sorgname":data.get('o_sorg_name'),
            "oname":data.get('o_name')
        };

        Ext.getCmp('penalty_number').setValue(no);
        Ext.getCmp('penalty_status').setValue(line_data.status);
        Ext.getCmp('penalty_real_money').setValue(line_data.money);
        Ext.getCmp('penalty_name').setValue(line_data.sorgname);
        Ext.getCmp('penalty_person').setValue(line_data.oname);
        if(line_data.status == '已付款'){
            Ext.getCmp('penalty_money').setDisabled(false);
        }else{
            Ext.getCmp('penalty_money').setDisabled(true);
        }
        Ext.getCmp('penalty_money').setValue(0);
        Ext.getCmp('penalty_remarks').setValue('');
        del_order_info = { number:no,o_status:line_data.status,o_settle_real:line_data.money};
        delOrderWin.show();
    };
    function delOrderSub(){
        del_order_info.penalty_money = Ext.getCmp('penalty_money').getValue();
        del_order_info.penalty_remarks = Ext.getCmp('penalty_remarks').getValue();
        out_change_ajax(del_order_info,$__app__ + '/Order/order_del','真的要取消订单吗?');
    }

    /**
     * 调整订单，ajax后台交互操作
     * @param $post 传递参数
     * @param url 表求地址
     * @param msg
     */
    function out_change_ajax($post,url,msg){
        Ext.MessageBox.confirm('友情提示',msg,function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url:url,
                    params:$post,
                    method:'POST',
                    success:function(response,otps){
                        var result = Ext.decode(response.responseText);
                        var msg = result.info;
                        if(result.status == 1){
                            delOrderWin.hide();
                            store.reload();
                            Ext.Msg.alert("温馨提示",msg);
                        }else{
                            if(msg.indexOf('CODE:LOAD001')>0){
                                Ext.Msg.alert("温馨提示",msg,function(y){
                                    store.reload();
                                });
                            }else{
                                Ext.Msg.alert("温馨提示",msg);
                            }
                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '数据查询失败');
                    }
                })
            }
        })
    }

    //发送短信
    window.SmsOrder=function(v){
        var post_data={ no:v};
        Ext.MessageBox.confirm('友情提示','你确认要发短信吗?',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/Order/ajax_order_sms',
                    params:post_data,
                    method:'POST',
                    success:function(response,otps){
                        var result = Ext.decode(response.responseText);
                        var msg = result.info;
                        Ext.Msg.alert("温馨提示",msg);
                        if(result.status == 1)store.reload();
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '数据查询失败');
                    }
                })
            }
        })
    };

    //立即支付
    window.PayOrder=function(v){
        Ext.MessageBox.confirm('友情提示','是否支付成功？',function(y){
            //if(y!='yes')return false;
            store.load();
        });
    };
    //买家中心线下支付订单提示弹窗
    window.LinePayOrder=function(){
        Ext.Msg.alert('友情提示','当前订单使用的是线下支付，请联系供应商操作。');
        return false;
    };




    //订单详情页面跳转
    window.UrlOrderDetail=function(v){
        top.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/'+order_type, 1);
    };

    //修改游客信息
    window.SetOrder=function(v){
        //parent.OpenTab('修改团队'+v, 'Team'+v, '', $__app__+'/Team/team_order_save/number/'+v, 1);
    };

    //调整金额(start)
    window.changePrice=function(val){
        getOrderData(val);
    };
    //取消审核
    window.cancelCheck=function(val,status){
        getCancelData(val,status);
    }
    var money_type={
        xtype: 'fieldcontainer',fieldLabel : '调整类型',defaultType: 'radiofield',defaults: { flex: 1},layout: 'hbox',
        items: [
            {boxLabel: "订单优惠<span class='help' data-qtip='订单结算金额为减少:<br>【信用支付】金额直接退回信用额度中;<br>【在线支付】金额需要商家线下退款;'>&nbsp;</span> ",name :'money_type',
                inputValue: '1',id:'favourable_id',
                listeners:{
                    'change':function(v,m,e){
                        real_favourable();
                    }
                }
            },
            {boxLabel: "订单补差<span class='help' data-qtip='订单结算金额为减少:<br>【信用支付】直接扣除信息额度金额;<br>【在线支付】订单状态变为(付款中)，需要客户再次支付;'>&nbsp;</span> ",name: 'money_type',
                inputValue: '2',id:'mend_id',
                listeners:{
                    'change':function(v,m,e){
                        real_favourable();
                    }
                }
            }
        ]
    };
    var price_form = Ext.create("Ext.form.Panel", {
        width: 350,
        margin:20,
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 90,
            width: 300,
            labelAlign: "right"
        },
        items: [
            { xtype: "textfield", id:"o_number",name: "o_number", fieldLabel: "订单编号",readOnly:true},
            { xtype: "hidden", id:"o_status",name: "o_status", fieldLabel: "订单状态",readOnly:true},
            { xtype: "hidden", id:"o_settle_money",name: "o_settle_money", fieldLabel: "结算金额",readOnly:true},
            { xtype: "hidden", id:"o_settle_real_old",name: "o_settle_real_old", fieldLabel: "结算金额",readOnly:true},
            { xtype: "hidden", id:"pp_type",name: "pp_type", fieldLabel: "促销类型",readOnly:true},
            { xtype: "hidden", id:"pp_amount",name: "pp_amount", fieldLabel: "促销额度",readOnly:true},
            { xtype: "hidden", id:"pp_max_limit",name: "pp_max_limit", fieldLabel: "促销最大上限",readOnly:true},
            { xtype: "hidden", id:"pp_title",name: "pp_title", fieldLabel: "活动名称",readOnly:true},
            { xtype: "textfield", id:"o_settle_real",name: "o_settle_real", fieldLabel: "结算金额",readOnly:true},
            money_type,
            { xtype: "numberfield", id: "favourable_money",name: "favourable_money", fieldLabel: "<span style = 'color:red'>*</span>调整金额", decimalPrecision: 2,allowBlank:true, minValue:0,
                listeners:{
                    'change':function(v,m,e){
                        if(!m)m=0;
                        //金额大于0，小于结算金额
                        var real_old=parseFloat(Ext.getCmp('o_settle_real_old').getValue());
                        if(!real_old)real_old=0;
                        if((m<0 || m>real_old) && Ext.getCmp('favourable_id').getValue()==true){
                            Ext.getCmp('favourable_money').setValue(e);
                            m=e;
                        }
                        real_favourable(m);
                    }}
            },
            {xtype: "checkboxfield",id:"is_promotion", name: "is_promotion", boxLabel: "优惠参与立减活动", fieldLabel: " ",labelWidth: 90, width: 300,labelSeparator:'',handler:real_favourable},
            { xtype: "numberfield", id: "o_favourable_money",name: "o_favourable_money", fieldLabel: "<span style = 'color:red'>*</span>本次调整金额", decimalPrecision: 2,allowBlank:true, minValue:0,readOnly:true},
            {id:'op_remark',name:'op_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ]
    });

    function num_max_len(num){
        var nv=parseInt(num*1000), ns = nv.toString();
        var last = ns.substr(ns.length-1,1);
        if (last==0) return num;
        return Math.ceil(num*100)/100;
    }

    /**
     * 调整金额操作
     * @param m 当前调整的金额
     */
    function real_favourable(m){
        if(isNaN(m))m=Ext.getCmp('favourable_money').getValue();
        if(!m) m=0;
        var settle_real=Ext.getCmp('o_settle_real');
        var real_old=parseFloat(Ext.getCmp('o_settle_real_old').getValue());
        if(!real_old)real_old=0;
        real_old=parseInt(real_old*100);
        m=parseInt(m*100);
        var money=0;
        var pp_type = Ext.getCmp('pp_type').getValue(); //促销类型
        var pp_amount = Ext.getCmp('pp_amount').getValue();//促销额度
        var is_promotion = Ext.getCmp('is_promotion').getValue();//是否参与优惠
        if(is_promotion==true && pp_type == 'percent'){
            m = parseInt(m*(1-pp_amount/10000));
        }
        if(Ext.getCmp('favourable_id').getValue()==true){
            money=real_old-m;
        }else{
            money=real_old+m;
        }
        if(m==0){
            if(real_old >0){
                settle_real.setValue(real_old/100);
            }else{
                r_money=Ext.getCmp('o_settle_real').getValue();
                settle_real.setValue(r_money);
            }
        }else{
            settle_real.setValue(money/100);
        }
        Ext.getCmp('o_favourable_money').setValue(m/100);

    }

    var price_win=new Ext.Window({
        title:"调整金额",
        width:355,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        fixed:true,
        items: price_form,
        buttons:[
            { xtype:'tbtext',id:'settle_money',style:'font-weight:bold;',text:'原订单金额:0.00'},
            '->',
            {text:'确认',handler:price_submit},
            {text:'关闭',handler:function(){
                price_win.hide();
            }}
        ]
    });

    function getOrderData(val){
        if(!val){
            Ext.Msg.alert('温馨提示','请先选择要修改的订单信息！');
        }
        Ext.Ajax.request({
            url:$__app__ + '/OrderAdmin/OneOrderInfo',
            params:{o_number:val},
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var msg = result.msg;
                if (result.status==true) {
                    var data = result.data;
                    var _form=price_form.getForm();
                    data.favourable_money=0;
                    data.o_settle_real_old=data.o_settle_real;
                    Ext.getCmp('settle_money').setText("原订单金额:"+data.o_settle_money)
                    _form.reset();
                    _form.setValues(data);
                    if(data.pp_type == null){
                        Ext.getCmp('is_promotion').setBoxLabel("优惠参与立减活动");
                        Ext.getCmp('is_promotion').setDisabled(true);
                    }else{
                        var title = Ext.getCmp('pp_title').getValue();
                        Ext.getCmp('is_promotion').setBoxLabel("<span class='help' data-qtip='活动名称为:"+title+"'>&nbsp;</span> 优惠参与立减活动");
                        Ext.getCmp('is_promotion').setDisabled(false);
                    }
                    price_win.show();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '数据提交失败');
            }
        })
    }


    //调整金额保存
    price_win.on({
        hide:function(){
            store.reload();
        }
    });
    function price_submit(){
        var _from=price_form.getForm();
        var post_data=_from.getValues();
        if(!_from.isValid()){
            Ext.Msg.alert('友情提示','请把红色框填写完整');
            return false;
        }
        if(!post_data.money_type){
            Ext.Msg.alert('友情提示','请选择调整类型');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','您确认需要调整订单金额吗？',function(y){
            if(y!='yes')return false;

            if(post_data.o_settle_real < 0){
                Ext.Msg.alert('友情提示','结算金额不能为负数');
                return false;
            }
            Ext.Ajax.request({
                url:$__app__ + '/OrderAdmin/changeMoney',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        Ext.Msg.alert("友情提示",msg);
                        price_win.hide();
                    }else{
                        if(msg.indexOf('CODE:LOAD001')>0){
                            Ext.Msg.alert("友情提示",msg,function(y){
                                price_win.hide();
                            });
                        }else{
                            Ext.Msg.alert("友情提示",msg);
                        }

                    };
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }
    //调整金额(end)

    /**线下支付start**/
    window.linePay=function(no){
        var data=get_store_find(no);
        var line_data ={
            "no":no,
            "money":data.get('o_settle_real'),
            "pay_money":data.get('o_pay_money'),
            "pname":data.get('o_product_name'),
            "sorgname":data.get('o_sorg_name'),
            "oname":data.get('o_name'),
            "line_remark":data.get('o_line_remark'),
        };
        line_pay_data(line_data);
    };

    //根据订单号取store中对应数据
    function get_store_find(no){
        var data={};
        store.each(function(record){
            var o_number = record.get('o_number');
            if(o_number == no){
                data=record;
                return false;
            }
        });
        return data;
    }


    var line_form = Ext.create("Ext.form.Panel", {
        width: 350,
        margin:20,
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 90,
            width: 300,
            labelAlign: "right"
        },
        items: [
            { xtype: "textfield", id:"o_line_number",name: "no", fieldLabel: "订单编号",readOnly:true},
            { xtype: "textfield", id:"product_name",name: "product_name", fieldLabel: "产品名",readOnly:true},
            { xtype: "textfield", id:"settle_price",name: "settle_price", fieldLabel: "结算价",readOnly:true},
            { xtype: "textfield", id:"pay_price",name: "pay_price", fieldLabel: "支付金额",readOnly:true},
            { xtype: "textfield", id:"sorg_name",name: "sorg_name", fieldLabel: "买家",readOnly:true},
            {id:"o_payment_time",name:"o_payment_time",fieldLabel:"支付日期",xtype:'datefield',format:'Y-m-d',editable:false},
            {id:'o_line_remark',name:'o_line_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ]
    });


    var line_win=new Ext.Window({
        title:"线下支付",
        width:355,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        fixed:true,
        items: line_form,
        buttons:[
            {text:'线下支付',handler:line_submit},
            {text:'关闭',handler:function(){
                line_win.hide();
            }}
        ]
    });

    function line_pay_data(line_data){
        if(!line_data.no){
            Ext.Msg.alert('温馨提示','请先选择要支付的订单！');
        }
        var pay_price=parseInt(line_data.money)-parseInt(line_data.pay_money);
        Ext.getCmp('o_line_number').setValue(line_data.no);
        Ext.getCmp('product_name').setValue(line_data.pname);
        Ext.getCmp('settle_price').setValue(line_data.money);
        Ext.getCmp('pay_price').setValue(pay_price);
        Ext.getCmp('sorg_name').setValue(line_data.sorgname+'  '+line_data.oname);
        Ext.getCmp('o_line_remark').setValue(line_data.line_remark);
        var lineTime=Ext.getCmp('o_payment_time').getValue();
        var date= new Date();        //获取当前日
        if(!lineTime){
            Ext.getCmp('o_payment_time').setValue(date);
        }
        line_win.show();
    }

    function line_submit(){
        var _from=line_form.getForm();

        Ext.MessageBox.confirm('友情提示','您确认需要线下支付吗？',function(y){
            if(y!='yes')return false;
            var post_data=_from.getValues();
            Ext.Ajax.request({
                url:$__app__ + '/Order/save_pay_line',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        store.reload();
                        line_win.hide();
                    }
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }





    /**线下支付end**/



    //调整座位(start)
    /*座位调整*/
    var seat_adjust_msg= '<div class="seat_adjust_msg">' +
        '座位调整会导致系统内信息与游客手中的通知书信息不一致，从而产生投诉，请慎用！</div>' +
        '<div class="seat_hint">' +
        '<span class="sel"><i></i>选中</span>' +
        '<span class="old_seat"><i></i>原座位</span>' +
        '<span class="empty_seat"><i></i>空座</span>' +
        '<span class="hold_seat"><i></i>已占</span>' +
        '</div>';

    //新的DataView数据源
    Ext.define('SeatStore', {
        extend: 'Ext.data.Model',
        fields: [ 'num','status','cls','select_cls','bus','text' ]
    });
    var seat_store_item = Ext.create('Ext.data.Store', {
        model: 'SeatStore',
        data : [ ]
    });
    var seat_store=new SUNLINE.JsonStore($__app__+'/OrderAdmin/ajax_seat',['bus_num','seats',"st_d"],false);
    seat_store.on('load', function(store){
        //重构DataView的数据
        var data = [];
        store.each(function(record){
            var bus_num = record.get('bus_num');
            var seats = record.get('seats');
            data.push({bus:bus_num, cls : 'thumb_none', text:'<h3>第'+bus_num+'号车</h3>', num:0});
            Ext.each(seats, function(item, index){
                item.cls += ' thumb-wrap-seat';
                item.text = '';
                item.bus_num = bus_num;
                data.push(item);
            });
        });
        seat_store_item.loadData(data);
        seat_select();
    });
    var seat_tpl = new Ext.XTemplate(
        seat_adjust_msg+
        '<div class="data_seat  x-component  x-fit-item x-component-default seat_select">',
        '<div class="seat_select">' +
        '<tpl for=".">',
        '<div class="{status} {cls} {select_cls}" id="{bus}_{num}">',
        '{text}',
        '<div class="none">{bus}_</div>' +
        '<div class="thumb">{num}</div>' +
        '<div class="none">_{status}</div>' +
        '</div>',
        '</tpl>',
        '</div>',
        '</div>'
    );
    var seat_view = new Ext.DataView({
        store:seat_store_item,
        tpl:seat_tpl,
        autoHeight:true,
        multiSelect: true,
        trackOver:true,
        simpleSelect:true,
        overClass:'x-view-over',
        itemSelector:'div.thumb-wrap-seat',
        selectedItemCls:'x-view-selected',
        emptyText: '没有座位信息',
        id:'seat-view',
        plugins: [ new Ext.ux.DataView.DragSelector({})]
    });


    //调出座位调整窗口
    var seat_win = new Ext.Window({
        title:"座位调整",
        width:400,
        minHeight:400,
        maxHeight:600,
        autoScroll: true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        fixed:true,
        items: seat_view,
        buttons:[
            {text:'选中原座位',handler:check_seat},
            {text:'取消选中',handler:cancel_seat},
            {text:'调整',handler:ajax_adjust},
            {text:'关闭',handler:function(){ seat_win.hide(); }}
        ]
    });



    //跳出已有座位时赋值
    seat_win.on("show",function(){
        var pop=od_data.o_people_num;
        seat_win.setTitle('调整游客座位表:<font color="orange"><b>'+pop+'人;</b>【订单号:'+od_data.o_number+'】</font>');
        seat_store.load({
            params:{
                bus_list:od_data.o_bl_id,
                p_id:od_data.o_product_id,
                type:"order",
                o_num_id:od_data.o_number
            }
        });
    });

    //跳出座位数据
    window.changeSeat=function(values){
        if(values==""){
            Ext.Msg.alert('友情提示', '请选择要预留的订单信息');
            return;
        };
        Ext.Ajax.request({
            url:$__app__ + '/OrderAdmin/getOrderData',
            params:{o_num:values},
            method:'POST',
            success:function(response,otps){
                var result = Ext.decode(response.responseText);
                var msg = result.msg;
                if(result.status == true){
                    od_data=result.data;
                    seat_win.show();
                }else{
                    Ext.Msg.alert("温馨提示",msg);
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '数据查询失败');
            }
        })
    };

    /**
     * 保存座位调整数据
     */
    function ajax_adjust(){
        var row = seat_view.getSelectedNodes(), sd=[];
        var seat_d={}, num=0;
        for (var i=0; i < row.length; i++){
            var sv=row[i].textContent.split("_");
            if(sv[2]=="empty"){
                seat_d[sv[0]+"_"+sv[1]]={s_bus_num:sv[0],s_num:sv[1]};
                num++;
            }
        };
        if(od_data.o_people_num!=num){
            Ext.Msg.alert('友情提示', '您选择的座位数不等于'+od_data.o_people_num+'，请重新选择!');
            return;
        };

        //判断所选择的座位数是否与实际座位一样
        Ext.MessageBox.confirm('友情提示', '您确定要调整此订单的座位信息吗？'+seat_adjust_msg, function(btn){
            if(btn!="yes") return false;
            var s = {seat_bus:Ext.encode(seat_d),num_id:od_data.o_number,start_date:od_data.o_start_date,pop_num:num};
            Ext.Ajax.request({
                url:$__app__ + '/OrderAdmin/ajax_adjust_seat',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.msg;
                    Ext.Msg.alert("友情提示",msg);
                    if (result.status===false){
                        Ext.Msg.alert('温馨提示',msg);
                        seat_store.reload();
                    }else{
                        Ext.Msg.alert('温馨提示',msg);
                        seat_store.reload();
                    };
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }

    /**
     * 选中原座位
     */
    function check_seat(){
        seat_select();
    }



    /**
     * 取消选中
     */
    function cancel_seat(){
        seat_view.getSelectionModel().deselectAll();
    }

    /**
     * 默认选定座位
     */
    function seat_select(){
        var indexs = [];
        Ext.each(seat_store_item.data.items, function(item, index){
            if(item.data.status != 'sale' && item.data.select_cls == "view-selected"){
                indexs.push(seat_store_item.getAt(index-item.data.bus_num) );
            }
        });
        seat_view.getSelectionModel().select(indexs);
    }
    //调整座位(end)

    /*修改预留时间*/
    var up_date=new Ext.DatePicker({
        id:"calendar_date",
        anchor:'100%',
        format:'Y-m-d',
        style:"margin:auto;margin-top:10px;margin-bottom:10px",
        listeners:{
            'select':function(t, d){
                Ext.getCmp("r_end_date").setValue(Ext.Date.format(d,'Y-m-d'));
            }
        }
    });
    var order_wid = new Ext.Window({
        title:'修改预留时间',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        cls : 'tb_input',
        items:[ up_date ],
        buttonAlign : 'left',
        buttons:[
            {xtype:'tbtext', text:'预留时间：'},
            {xtype:'textfield', id:"r_end_date", width:80, readOnly:true},
            {xtype: 'numberfield',anchor: '100%',name: 'time_h',id:'time_h',fieldLabel: '',labelWidth:0,maxValue: 24,minValue: 0,width:50},
            {xtype:'tbtext', text:':'},
            {xtype: 'numberfield',anchor: '100%',name: 'time_m',id:'time_m',fieldLabel: '',labelWidth:0,maxValue: 60,minValue: 0,width:50},
            {xtype:'hidden', id:'time_number'},
            '->',
            {text:'保存',handler:obligate_sub}
        ]
    });

    function obligate_sub(){
        var ymd=Ext.getCmp("r_end_date").getValue();
        var h=Ext.getCmp("time_h").getValue();
        var m=Ext.getCmp("time_m").getValue();
        var number=Ext.getCmp('time_number').getValue();
        if(!Ext.getCmp("time_h").isValid() || !Ext.getCmp("time_m").isValid()){
            Ext.Msg.alert("友情提示","请正确红色框内的数值!");
            return false;
        }
        var time_str=ymd + ' ' + h + ':' + m;
        var date_time=Date.parse(new Date(time_str))/1000;
        var post_data={
            expire:date_time,
            expire_h:h,
            expire_m:m,
            no:number
        };
        Ext.MessageBox.confirm('友情提示', '您确定要修改预留时间吗？', function(btn){
            if(btn!=="yes") return false;
            // var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            // myMask.show();
            var s = post_data;
            Ext.Ajax.request({
                url:$__app__ + '/Order/order_expire',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    //myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    Ext.Msg.alert("友情提示",msg);
                    if (result.status==1) {
                        $('#'+number).attr("expireTime",date_time);
                        order_wid.hide();
                    };
                },
                failure:function (response, otps) {
                    //myMask.hide();
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }
    //调整预留时间
    window.ObligateOrder=function(number){
        if(!number){
            Ext.Msg.alert('友情提示', '请选择要预留的订单信息');
            return;
        };
        var rows=get_order_data(number);
        if(!rows.o_expire){
            Ext.Msg.alert('友情提示','当前不需设置预留时间!');
            return;
        }
        order_wid.show();
        var ymd=rows.expire.ymd;
        var h=rows.expire.h;
        var m=rows.expire.m;
        Ext.getCmp("r_end_date").setValue(ymd);
        //Ext.getCmp("calendar_date").setValue(ymd);
        Ext.getCmp("time_h").setValue(h);
        Ext.getCmp("time_m").setValue(m);
        Ext.getCmp('time_number').setValue(number);
    };
    //支付二维码
    var paycode_win = Ext.create('Ext.window.Window',{
        title:'微信支付二维码',
        closeAction:'hide',
        width: 750,
        height:600,
        modal:true,
        html:'<iframe width="100%" height="100%" id="paycode_ifr" name="paycode_ifr" frameborder="0"></iframe>',
        buttons:[
            {xtype:'tbtext', text:'出团通知书：'},
            {xtype:'textfield', id:"notice_url", width:420, readOnly:true,listeners:{
                focus: function(){
                    this.selectText();
                }
            }},
            '->',
            {text:'关闭',handler:function(){
                paycode_win.hide();
            }}
        ]
    });
    window.creat_qrcode=function(values){
        if(values==""){
            Ext.Msg.alert('友情提示', '请选择要生成支付二维码的订单信息');
            return;
        };
        paycode_win.show();
        Ext.getCmp("notice_url").setValue('http://'+window.location.host+'/PrintNotice/number_'+values);
        window.paycode_ifr.location=$__app__+'/OrderAdmin/getOrderPayCode/no/'+values;
    };
    //订单取消审核
    function getCancelData(val,status){
        if(!val){
            Ext.Msg.alert('温馨提示','请先选择要修改的订单信息！');
        }
        Ext.MessageBox.confirm('友情提示','您确认取消订单审核吗？',function(y){
            if(y!='yes')return false;
            var post_data={no:val,type:"cancel",status:status};
            Ext.Ajax.request({
                url:$__app__ + '/Order/order_confirm',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    var msg = result.message;
                    if (result.code=='200') {
                        Ext.Msg.alert('友情提示',msg);
                        store.load();
                    }
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }



    /**
     * 根据订单号查询订单信息
     * @param number
     * @returns {{}}
     */
    function get_order_data(number){
        var data={};
        store.each(function(v){
            var row= v.data;
            if(row.o_number==number)data=row;
        });
        return data;
    }

    /**
     * 搜索按钮的点击事件(所有条件的接取)
     */
    function form_where_values(type){
        var post_data={order_type:order_type/*,start:0,limit:20*/}; // todo 可能存在其他分页问题
        var sh_from=$('.sh-from');
        for(var fi=0;fi<sh_from.length;fi++){
            var id=sh_from.eq(fi).attr('id');
            var val_id=Ext.getCmp('order_'+id),val='';
            if(type=='set'){
                if(id=='time_type')continue;
                val=val_id.setValue('');
            }else{
                val=val_id.getValue();
                if(in_array(id,['end_time','start_time'])!=-1 && val){
                    val=Ext.getCmp('order_'+id).getRawValue();
                }
                post_data[id]=val;
            }
        };

        if(type=='set'){
            $('input[name=keySearch]').val('');
            return true;
        };
        var keySearch=$('input[name=keySearch]').val();
        post_data.keys=keySearch;
        //关键词查询其他条件不用
        if(keySearch)return {keys:keySearch};
        //产品类型复选框
        post_data.product_type=Ext.getCmp('order_product_type_id').getValue();
        var time_type={交易日期:'o_sell_time',出团日期:'o_start_date'};
        post_data.time_type=time_type[post_data.time_type];
        return post_data;
    }



    $('.search-confirm').on('click',function(){
        var post_form=form_where_values();
        var product_id= Ext.getCmp('order_product_id').getRawValue();
        if( product_id == '' ){
            post_form.product_id = '';
        }
        SUNLINE.baseParams(store,post_form,true);
        store.currentPage = 1;
        store.load();

    });

    $('.search-input').keypress(function(event){
        if(event.keyCode == 13){
            var post_form=form_where_values();
            SUNLINE.baseParams(store,post_form,true);
            store.currentPage = 1;
            store.load();
        }
    });

    /*订单导出功能*/
    function get_unix_time(dateStr)//时间格式转化成时间戳
    {
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str.substr(0, 10);
    }


    var order_export = $('.order-export');
    order_export.on('click',function(){

        var post_form=form_where_values();
        var o_status=ROW.o_status;
        if(!o_status){
            o_status='所有订单';
        }
        if(post_form.start_time){
            var startTime=get_unix_time(post_form.start_time);
        }
        if(post_form.end_time){
            var endTime=get_unix_time(post_form.end_time);

        }
        if((endTime-startTime)/86400>30){
            Ext.Msg.alert('友情提示', '您所选的时间超过【30天】，请重新选择');
            return false;
        }

        if(!startTime || !endTime){
            Ext.Msg.alert('友情提示', '请选择时间跨度不超过【30天】的订单来进行导出');
            return false;
        }
        var url = '';
        url += '&end_time=' + post_form.end_time;
        url += '&start_time=' +post_form.start_time;
        url += '&order_type=' + post_form.order_type;
        url += '&product_id=' + post_form.product_id;
        url += '&service_id=' + post_form.service_id;
        url += '&time_type=' + post_form.time_type;
        url += '&worg_id=' + post_form.worg_id;
        url += '&sorg_id=' + post_form.sorg_id;
        url += '&uid=' + post_form.uid;
        url += '&paytype_id=' + post_form.paytype_id;
        url += '&nopage=1';
        url += '&company_brand_id=' + post_form.company_brand_id;
        url += '&status='+o_status;
        window.location = $__app__+'/OrderAdmin/order_export?'+url;

    });




    /**
     * 页面JS效果
     */
    $(document).on('mouseenter','.cursor-person',function(){
        $(this).parent('.price-info').find('.price-hover').show();
    });
    $(document).on('mouseleave','.cursor-person',function(){
        $(this).parent('.price-info').find('.price-hover').hide();
    });
    $(document).on('mouseenter','.handle-menu',function(){
        $(this).find('.handle-hide').show();
    });
    $(document).on('mouseleave','.handle-menu',function(){
        $(this).find('.handle-hide').hide();
    });
    $(document).on('mouseenter','.cursor-refund',function(){
        $(this).parents('.price-info').find('.prices-hover').show();
    });
    $(document).on('mouseleave','.cursor-refund',function(){
        $(this).parents('.price-info').find('.prices-hover').hide();
    });

    //函数数据操作(end)

    /**
     * 浏览器改变大小时触发
     */
    var telDoc = $('.ti-tell');
    telDoc.unbind();
    telDoc.live('click',function(){
        var str = $(this).text();
        var val = $(this).attr('data-id');
        var panelVal = $(this);
        if(str != '[查看联系方式]'){
            return false;
        }
        Ext.Ajax.request({
            url:$__app__ + '/Users/getUserTel',
            params:{u_id:val},
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var mobile = '[没有联系方式]';
                if(result.status){
                    mobile = '['+result.data+']';
                    panelVal.text(mobile);
                };
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '数据提交失败');
            }
        })
    });
    function load_js(){
        var order_list=$('.order-list');
        for(var oi in order_list){
            var list_id=order_list.eq(oi);
            if(oi%2){
                list_id.css('background','#f3f3f3');
            }
        };
        order_list.hover(function(){
            $(this).addClass('order-list-hover');
        },function(){
            $(this).removeClass('order-list-hover');
        });
    }

    /*清空搜索条件*/
    var clear_search = $('.clear-search');
    clear_search.unbind();
    clear_search.on('click',function(){
        form_where_values('set');
        SUNLINE.baseParams(store,{order_type:order_type});
    });

    $(window).resize(function() {
        order_panel.setWidth();
        order_panel.setHeight();
    });

    //执行倒数秒
    $(function(){
        updateEndTime();
    });
});


