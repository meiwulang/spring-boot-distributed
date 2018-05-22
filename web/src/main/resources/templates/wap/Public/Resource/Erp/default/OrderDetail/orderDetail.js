/**
 * Created by Johony on 16-1-27.
 */
var ROW = {};
ROW.status = false;
ROW.SiteStatus = false;
ROW.site = [];
ROW.num = 1;
var SeatStore={};
Ext.onReady(function(){
    seat_ajax_data();
    function seat_ajax_data(){
        $.ajax({
            type:"POST",
            url:$__app__ + "/OrderDetail/order_seat_look",
            data:{ id:number },
            success:function (msg) {
                var data = msg;
                if(typeof msg != 'object')
                    data = eval("(" + msg + ")");
                var info = data.info;
                if(data.status == 1) {
                    seat_view(info.seat_data);
                    submit_order(info.o_data);
                    order_confirm(info.o_data);
                    if(info.o_data['o_expire']){
                        updateEndTime();
                    }
                    SeatStore=info.seat_data;
                    if(ROW.SiteStatus){
                        sitePlane.show();
                        $('#allSite').show();
                        $('.nowSite').show();
                    }
                    if(info.o_data.blacklist_user == 1){
                        $('#has_black_user').show();
                    }
                }
            }
        });
    }

    function seat_view(data){
        var tpl='',i_index=1;
        $.each(data,function(i,v){
            if(v.list){
                    tpl+='<div class="v_name"><div class="name_left"><span>'+ v.s_tname+'</span><span class="t_type">('+ v.s_ticket_type+')</span></div><div class="name_right"><span>￥'+ v.s_trade_price+'</span></div></div>';
                    $.each(v.list,function(ii,vv){
                        tpl+=seat_tpl_find(vv,i_index);
                        i_index++;
                    })
            }else {
                    tpl+=seat_tpl_find(v,i_index);
                    i_index++;
            }
        });
        var tour_content=$('.tour-content ul');
        tour_content.html(tpl);
        traffic_click_fn();
        exit_fn();
        site_info_no('off');
    }

    function seat_tpl_find(data,i_index){
        var traffic_tpl='';
        if(typeof data.bus_detail=='object' && data.bus_detail){
            var traffic={ 飞机:'plane',火车:'subway',高铁:'train',动车:'train',轮船:'ship',汽车:'bus'};
            var num=0;
            for(var i_num in data.bus_detail){
                num+=1;
            }
            var i_index=0;
            $.each(data.bus_detail,function(i,v){
                if(v.ob_start_site){
                    var ob_start=v.ob_start_site;
                }else{
                    ROW.SiteStatus = true;
                }
                if(v.ob_end_site){
                    var ob_end=v.ob_end_site;
                }else{
                    ROW.SiteStatus = true;
                }
                if(v.ob_start_time)ob_start+='('+ v.ob_start_time+')';
                if(v.ob_end_time)ob_end+='('+ v.ob_end_time+')';
                traffic_tpl+='<tr class="ob-list" ob-id="'+ v.ob_id+'">' +
                    '<td class="trt-goto"><i class="xj-icon"></i>'+ v.ob_goto_type+'</td>' +
                    '<td class="trt-date">['+ v.ob_start_date+']</td>' +
                    '<td class="trt-city">'+ v.ob_city_start+' → '+ v.ob_city_end+'</td>' +
                    '<td class="trt-fly"><i class="fa fa-'+ traffic[v.ob_type]+'"></i>'+ v.ob_type+'</td>' +
                    '<td class="trt-ssite">'+ ob_start+'</td>' +
                    '<td class="trt-icon">';
                if( v.ob_bus_number){
                    var ob_stocks_id='';
                    if(v.ob_stocks_id>0)ob_stocks_id=' (库存)';
                    if(v.ob_status=='已出票'){
                        traffic_tpl+= '<span class = "site_type" ><i class = "fa fa-ticket" style = "background:green" title = "已出票"></i></span>'+v.ob_bus_number+ob_stocks_id;
                    }else{
                        if(v.ob_add_status==1){
                            traffic_tpl+=v.ob_bus_number+'(不包含)';
                        }else{
                            traffic_tpl+= '<span class = "site_type" ><i class = "fa fa-ticket" style = "background:blue" title = "未出票"></i></span>'+v.ob_bus_number+ob_stocks_id;
                        }
                    }
                }else{
                    traffic_tpl += '<span class = "site_type" ><i class = "fa fa-ticket" style = "background:red" title = "未安排"></i></span>';
                }
                var opear='<td class="trt-opear">[编辑]</td>';
                if(v.ob_place)opear='<td style="color:#999;width: 70px;">'+v.ob_place+'</td>';
                traffic_tpl+='</td>' +
                    '<td class="trt-esite">'+ ob_end+'</td>' +
                    '<td class="trt-seat">'+ v.ob_berth_type+'</td>' +
                    opear +
                    '</tr>';
                i_index+=1;
            });
        };
        if(data.bus_detail == null) ROW.SiteStatus = true;

        var start_title='',end_title='',s_check_status='',e_check_status='';
        if(data.s_start_site_type=='始发站'){
            s_check_status='checked=checked';
            start_title='【始发站】不记接送';
        }else{
            s_check_status='';
            start_title='需要接送站点';
        }
        if(data.s_end_site_type=='始发站'){
            e_check_status='checked=checked';
            end_title='【始发站】不记接送';
        }else{
            e_check_status='';
            end_title='需要接送站点';
        }
        if(data.s_is_bl == 1){
            var vip_name_html = '<div style="float: left"><i class="fa fa-user-secret bl_info" style="color: #b50606;cursor:pointer;" t1="'+data.b_worg_reason+'" t2="'+data.b_sorg_reason+'"></i></div>';
            var bl_reason = '';
            if(data.b_worg_reason){
                bl_reason += '内部备注:'+data.b_worg_reason;
            }
            if(data.b_sorg_reason){
                bl_reason += '&#10;分销商备注:'+data.b_sorg_reason;
            }
        }else{
            var vip_name_html = '';
            var bl_reason = '';
        }
        var tpl='<li class="tour-list" s-id="'+data.s_id+'" t-id="'+data.s_tid+'">' +

            '<div class="tl-right tl-list">' +
            '<dl>' +
            '<dd class="tlr-list">' +

            '<span class="tlr-from td-bus">' +
            '<div class="txt-from">' +
            '<span class="from-input" name="bus_num">'+data.seat_bus_num+'</span>' +
            '</div>' +
            '</span>' +

            '<span class="tlr-from td-ticket">' +
            '<div class="txt-from">' +
            '<label class="check-label">' +
            '<span class="from-input span-name" name="t_name">'+ data.s_tname+'<br /><font class="ticket-type-cls">('+data.s_ticket_type+')</font></span></label>' +
            '</div></span>' +
            '<span class="tlr-from td-name" title="'+bl_reason+'">' + vip_name_html +
            '<div class="txt-from" style="float:left;">' +
            '<span class="from-input" name="vip_name">'+data.s_vip_name+'</span>' +
            '</div>' +
            '</span>' +

            '<span class="tlr-from td-mob">' +
            '<div class="txt-from">' +
            '<span class="from-input" name="vip_mob">'+data.s_vip_mob+'</span>' +
            '</div>' +
            '</span>' +

            '<span class="tlr-from td-card-type">' +
            '<div class="txt-from">' +
            '<span class="from-input" name="vip_card_type">'+data.s_vip_card_type+'</span>' +
            '</div>' +
            '</span>' +

            '<span class="tlr-from td-card">' +
            '<div class="txt-from">' +
            '<span class="from-input" name="vip_card">'+data.s_vip_card+'</span>' +
            '</div>' +
            '</span>' +

            '<div class="site-info">'+
                '<div>'+
                     '<u style="color: green">去程:</u>'+
                    '<span class="tlr-from td-gotime from-time">' +
                        '<div class="txt-from">' +
                            '<span class="from-input" name="start_sttime">'+data.s_start_sttime+'</span>' +
                        '</div>' +
                    '</span>' +
                    '<span class="tlr-from td-goname from-site">' +
                        '<div class="txt-from">' +
                            '<span class="from-input" name="start_stname">'+data.s_start_stname+'</span>' +
                        '</div>' +
                    '</span>' +
                    '<span class="tlr-from td-checkbox">' +
                        '<div class="check-box">'+
                            '<input type="checkbox" name="start_site_type  "  title='+start_title+' class="from-input-checkbox" '+s_check_status+ 'value="" style="width:20px;height: 20px;position:relative;top:2px;display:none;" />'+
                        '</div>'+
                    '</span>' +
                '</div>'+


                '<div>'+
                    '<u style="color: #ff9913">返程:</u>'+
                    '<span class="tlr-from td-backtime from-time">' +
                    '<div class="txt-from">' +
                    '<span class="from-input" name="end_sttime">'+data.s_end_sttime+'</span>' +
                    '</div>' +
                    '</span>' +

                    '<span class="tlr-from td-backname from-site">' +
                    '<div class="txt-from">' +
                    '<span class="from-input" name="end_stname">'+data.s_end_stname+'</span>' +
                    '</div>' +
                    '</span>' +
                    '<span class="tlr-from td-checkbox">' +
                    '<div class="check-box">'+
                    '<input type="checkbox" value="" name="end_site_type" title='+end_title+' class="from-input-checkbox" '+e_check_status+ ' value="" style="width:20px;height: 20px;position:relative;top:2px;display:none;" />'+
                    '</div>'+
                    '</span>' +
                 '</div>'+

            '</div>';



            if(data.s_tfid==0){
              tpl+= '<span class="tlr-from td-price">' +
                '<div class="ticket-money f-div"><i>￥'+data.s_trade_price+'</i></div>' +
                '</span>';
            }


        tpl+='</dd>' +
            '</dl>' +
            '</div>' +
            '</li>';
        return tpl;
    }

    var rollBack = $('#rollBack');
    rollBack.toggle(function(){
        $(this).text('[全部展开]');
        var traffic_cls=$('.traffic-cls');
        var fa_angle=traffic_cls.find('.fa');
        var traffic_main = $('.traffic-main');
        traffic_main.hide();
        fa_angle.removeClass('fa-angle-up');
        fa_angle.addClass('fa-angle-down');
    },function(){
        $(this).text('[全部收起]');
        var traffic_cls=$('.traffic-cls');
        var fa_angle=traffic_cls.find('.fa');
        var traffic_main = $('.traffic-main');
        traffic_main.show();
        fa_angle.removeClass('fa-angle-down');
        fa_angle.addClass('fa-angle-up');
    });

    function site_info_no(type){
        var site_info=$('.from-time');
        if(type=='set'){
            site_info.show();
            return '';
        }
        $.each(site_info,function(i,v){
            var site_html=site_info.eq(i).find('.from-input').html();
            if(!site_html){
                site_info.eq(i).hide();
            }
        })
    }

    function traffic_click_fn(){
        var traffic_cls=$('.traffic-cls');
        traffic_cls.click(function(){
            var fa_angle=$(this).find('.fa');
            var ticket_list=$(this).parents('.tour-list');
            if(fa_angle.hasClass('fa-angle-up')){
                ticket_list.find('.traffic-main').hide();
                fa_angle.removeClass('fa-angle-up');
                fa_angle.addClass('fa-angle-down');
            }else{
                ticket_list.find('.traffic-main').show();
                fa_angle.removeClass('fa-angle-down');
                fa_angle.addClass('fa-angle-up');
            }
        });
        $('.bl_info').click(function(){
            var t1 = $(this).attr('t1');
            var t2 = $(this).attr('t2');
            if(t1 == ''){
                Ext.getCmp('b_worg_reason').setHidden(true);
            }else{
                Ext.getCmp('b_worg_reason').setValue(t1);
            }
            Ext.getCmp('b_sorg_reason').setValue(t2);
            info_win.show();
        });
    }
//订单详情模态窗口
    $('#look_price').click(function(){
        var price_detail=$('.price-detail-box').html();
        var pagei = $.layer({
            type: 1,   //0-4的选择,
            title: '订单价格明细',
            border: [0],
            shadeClose: true,
            area : ['800px',''],
            page: { html: price_detail }
        });
    });
//送票详情模态窗口
    $('.look_ticket').click(function(){
        var ticket_detail=$('.ticket-detail-box').html();
        var pagei = $.layer({
            type: 1,   //0-4的选择,
            title: '送票信息动态',
            border: [0],
            shadeClose: true,
            area : ['800px',''],
            page: { html: ticket_detail }
        });
    });








    window.showInfo= function(time,type){
        getPriceInfoAjax(time,number,type);
    }
    function getPriceInfoAjax(time,num,type){
        $.ajax({
            type:'POST',
            url:$__app__+'/OrderDetail/getOpaInfo',
            data:{time:time,num:num,type:type},
            success:function(data){
                if(typeof data != 'object') data = eval('('+data+')');
                if(data.status == 1){
                    var info =  data.info.info;
                    priceDetailTpl(info);
                }else{
                    layer.alert(data.info.msg);
                }
            },
            error:function(){
                layer.alert('查询错误');
            }
        });
    }
    function priceDetailTpl(data){
        var str = '<table cellspacing="0" class="money-table">' +
            '<tr>' +
            '<td class="th">价格名称</td>' +
            '<td class="th">个数</td>' +
            '<td class="th">单价</td>' +
            '<td class="th">金额</td>' +
            '<td class="th">备注</td>' +
            '</tr>';
        var money = 0;
        $.each(data,function(i,v){
            var op_remark=v.op_remark;
            if(!op_remark)op_remark='';
            str += '<tr>' +
                '<td>'+v.op_detail+'</td>' +
                '<td style="text-align: center">'+v.op_num+'</td>' +
                '<td class="td-right">￥'+v.op_price+'</td>' +
            '<td class="td-right">￥'+v.op_money+'</td>' +
            '<td style="width: 350px">'+op_remark+'</td>' +
            '</tr>';
            money += parseFloat(v.op_money);
        });
        str += '<tr>' +
            '<td style="text-align: right">小计：</td>' +
            '<td class="td-right" style="font-weight: bold;color: orangered" colspan="3">￥'+money+'</td>' +
            '</tr>' +
            '</table>';
        var page = $.layer({
            type: 1,   //0-4的选择,
            title: '账户流水明细',
            border: [0],
            shadeClose: true,
            area : ['800px',''],
            shift:'left',
            page: { html: str }
        });
    }

    /**********操作日志************/
    window.showLogInfo= function(id){
        getLogInfoAjax(id);
    }
    function getLogInfoAjax(id){
        $.ajax({
            type:'POST',
            url:$__app__+'/OrderDetail/getLogDetail',
            data:{ol_id:id,num:number},
            success:function(data){
                if(typeof data != 'object') data = eval('('+data+')');
                if(data.status == 1){
                    var info =  data.info.data;
                    LogDetailTpl(info);
                }else{
                    layer.alert(data.info.msg);
                }
            },
            error:function(){
                layer.alert('查询错误');
            }
        });
    }
    function LogDetailTpl(data){
        var str = '<div id="LogDetail"><ul>';
        $.each(data,function(i,v){
            str += '<li><span>'+i+'</span>:';
            if(i=='删除座位' || i=='添加座位'){
                $.each(v,function(n,val){
                    str += '['+val.vip_name+'：'+i+']';
                })
            }else if(i == '首款' || i == '尾款' || i == '修改房差'){
                $.each(v,function(n,val){
                    str += '[￥'+val.new+'：'+i+']';
                })
            }else{
                $.each(v,function(n,val){
                    if(!val.old){
                        str += '['+i+':'+val.new+']';
                    }else{
                        str += '['+i+': 由 '+val.old+' --改为-> '+val.new+']';
                    }
                    if(val.vip_name){
                        if(!val.old){
                            str += '['+val.vip_name+': 由 '+val.old+' --改为-> '+val.new+']';
                        }else{
                            str += '['+val.vip_name+':'+val.new+']';
                        }
                    }
                })
            }
            str += '</li>';
        });
        str += '</ul></div>';
        var page = $.layer({
            type: 1,   //0-4的选择,
            title: '操作日志明细',
            border: [0],
            shadeClose: true,
            area : ['460px',''],
            shift:'left',
            page: { html: str }
        });


    }

    /**********操作结束************/
    var confirm_form = Ext.create("Ext.form.Panel", {
        width: 350,
        margin:20,
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 0,
            width: 300,
            labelAlign: "right"
        },
        items: [
            { xtype: "hidden", id:"o_number",name: "o_number", fieldLabel: "订单编号",readOnly:true},
            { xtype: "hidden", id:"o_status",name: "o_status", fieldLabel: "订单状态",readOnly:true},
            { xtype: "hidden", id:"o_settle_real",name: "o_settle_real", fieldLabel: "结算金额",readOnly:true},
            {
                boxLabel: '<font color="green">信用额度</font>直接确认 <font color="#999">(信用余额:1200.00元)</font>',
                id:'agent_credit',
                name: 'confirm',
                inputValue: '1',
                xtype:'radiofield',
                hidden:isDisabled('OrderDetail::agent_credit'),
            },
           {
                checked:!(isDisabled('OrderDetail::changeStatus')),
                boxLabel: '确认并由分销商自行支付',
                id:'changeStatus',
                name: 'confirm',
                inputValue: '2',
                xtype:'radiofield',
                labelSeparator:''
            }
        ]
    });
    var confirm_win=new Ext.Window({
        title:"确认订单",
        width:355,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        fixed:true,
        items: confirm_form,
        buttons:[
            {text:'确认保存',handler:price_submit},
            {text:'关闭',handler:function(){
                confirm_win.hide();
            }}
        ]
    });

    var form_reason = [
        {id:"b_worg_reason", name:"b_worg_reason", fieldLabel:"内部备注", maxLength:"255", xtype:'textarea',readOnly:true},
        {id:"b_sorg_reason", name:"b_sorg_reason", fieldLabel:"分销商备注", maxLength:"255", xtype:'textarea',readOnly:true},
    ];
    var info_form=Ext.create('Ext.form.Panel',{
        bodyPadding: 10,id:'form',border:false,width: 410,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{labelAlign:'right',labelWidth:70,width:340}
        },
        items: [{title:'备注信息',items:form_reason}]
    });
    var info_win = new Ext.Window({
        'title':'黑名单用户备注查看',
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:info_form,
        buttons:[
            {text:'关闭', handler:function () {
                info_win.hide();
            }}
        ]
    });

    function price_submit(){
        Ext.MessageBox.confirm('友情提示','真的要确认订单吗?',function(y){
            if(y!='yes')return false;
            var _confirm_form=confirm_form.getForm();
            var post_data=_confirm_form.getValues();

            var url;
            post_data.no=post_data.o_number;
            if(post_data.confirm==1){
                url=$__app__ + '/Order/agent_credit';
            }else if(post_data.confirm==2){
                url=$__app__ + "/OrderDetail/changeStatus"
            }
            confirm_status_save(post_data,url)
        });
    }
    /**
     * 组团确认单
     * @type {*|jQuery|HTMLElement}
     */
    function  order_confirm(data){
        var confirm = $('#confirm_order');
        confirm.on('click',function(){
            window.open("/Confirmation/index/o_number/"+data.o_number+"/org_id/"+ data.o_worg_id);
        });
    }


    /**
     * 订单确认操作
     * @type {*|jQuery|HTMLElement}
     */
    function submit_order(data){
        if(data.o_status == '待付款'){
            var edit = $('#waitPay');
            edit.unbind();
            edit.on('click',function(){
                Ext.getCmp('changeStatus').setHidden(true);
                confirm_win.show();
            });
        }else{
            var sub = $('#submitOrder');
            sub.unbind();
            sub.on('click',function(){
                confirm_win.show();
            });
        }
        confirm_win.on({
            show:function(){
                var _confirm_form=confirm_form.getForm();
                var agent_credit=Ext.getCmp('agent_credit'),
                    agent_title='';
                if(parseFloat(data.credit)<parseFloat(data.o_settle_real)){
                    agent_title='<font color="red">不足</font>';
                    agent_credit.setDisabled(true);
                    data.confirm=2;
                }else if(parseFloat(data.credit)>parseFloat(data.o_settle_real) && !isDisabled('OrderDetail::agent_credit')){
                    agent_credit.setDisabled(false);
                    data.confirm=1;
                }
                _confirm_form.setValues(data);
                agent_credit.setBoxLabel('<font color="green">信用额度</font>直接确认 <font color="#999">(信用余额:'+data.credit+'元 '+agent_title+')</font>');
            }
        });
    }

    /**
     * 订单确认保存
     * @param data
     * @param url
     */
    function confirm_status_save(data,url){
        $.ajax({
            type:"POST",
            url:url,
            data:data,
            success:function (msg) {
                var data = msg;
                if(typeof msg != 'object')
                    data = eval("(" + msg + ")");
                var info = data.info;
                if(data.status == true){
                    Ext.MessageBox.confirm('友情提示','订单确认成功',function(y){
                        window.location.reload();
                    })
                }else{
                    if(info.indexOf('CODE:LOAD001')>0){
                        Ext.Msg.alert("温馨提示",info,function(y){
                            window.location.reload();
                        });
                    }else{
                        Ext.Msg.alert("温馨提示",info);
                    }
                }
            },
            error:function(){
                layer.alert('确认失败');
                sub.text('确认订单');
                sub.css({
                    background:'#FF6600'
                });
            }
        })
    }

    var affirm_btn = $('.affirm-btn');
    var o_remark = $('input[name=o_remark]');
    affirm_btn.on('click',function(){
        Ext.MessageBox.confirm('友情提示','要保存备注信息么？',function(y){
            if(y=='yes'){
                var remark = o_remark.val();
                $.ajax({
                    url:$__app__+"/OrderDetail/UpRemake",
                    type:'POST',
                    data:{o_remark:remark,o_number:number},
                    success:function(data){
                        if(typeof data != 'object'){
                            data = eval('('+data+')');
                        }
                        if(data.status==true){
                            layer.alert(data.msg,1);
                        }else{
                            layer.alert(data.msg);
                        }
                    },
                    error:function(){
                        layer.alert('修改失败');
                    }
                });
            }
        })
    });

    var show_a = $('.show-a');

    var basicInfo = $('.basicInfo');

    show_a.on('click',function(){

        $.each(show_a,function(i,v){
            show_a.eq(i).removeClass('a-hover');
            basicInfo.eq(i).css('display','none');
        });

        $(this).addClass('a-hover');
        var index = $(this).index();
        basicInfo.eq(index).css('display','inline-block');
    });
    window.UrlOrder=function(){
        parent.OpenTab('订单管理', 'Order', '', $__app__+'/OrderAdmin', 1);
    }
    if(__ZIYO_REN__['from']=='success'){
        $('#close').css('display','none');
        $('#transPlane').css('display','none');
        $('#ticketPlane').css('display','none');
        $('#updateTour').css('display','none');
    }
    window.closeWin=function(val){
        if(__ZIYO_REN__['from']=='success'){
            $('#close').css('display','none');
        }else{
            Ext.MessageBox.confirm('友情提示','你确定要关闭吗?',function(y){
                if(y=='yes'){
                    parent.CloseTab(true);
                }
            })
        }
    }

    var payMon = $('.payMon');
    payMon.unbind();
    payMon.on('click',function(){
        var id = $(this).attr('value');
        Ext.Msg.confirm('温馨提示','你确定要支付信用账单么？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Order/order_payment_find',
                    params: {id:id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.MessageBox.confirm('友情提示','信用账单成功',function(y){
                                window.location.reload(true);
                            })
                        }
                        Ext.Msg.alert('友情提示', r.info);
                    }
                })
            }
        })
    })
    var show_more = $('#show-more');
    var hide_detail = $('.hide-detail');
    show_more.toggle(function(){
        hide_detail.css('display','');
        $(this).text('点击收起');
    },function(){
        hide_detail.css('display','none');
        $(this).text('点击展开更多');
    })

    var store = SUNLINE.JsonStore($__app__+'/OrderDetail/getSite',[],false);
    var grid = Ext.create('Ext.grid.Panel',{
        store: store,
        columns: [
            { text: '出发口岸', dataIndex: 'site',width:220 },
            { text: '人数', dataIndex: 'num',width:100 }
        ]
    })
    function submit(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','请先选择要安排的出发口岸');
            return false;
        }
        var site = row.data.site;
        var date = row.data.date;
        var type = '去程';
        var num = number;
        //var v = 's_start_date-'+date+'-ob_start_site-'+site+'-ob_goto_type-'+type;
        var v = 's_start_date-'+date+'-ob_start_site-'+site+'-o_number-'+num;
        win.hide();
        setTimeout(function(){
            parent.OpenTab('接送明细:'+num, 'Plane'+num, '', $__app__+'/TransPlan/Text/'+v, 1);
        },200)
    }
    var win = Ext.create('Ext.window.Window',{
        title:"安排计划",
        width:330,
        fixed:true,
        modal:true,
        autoScroll: true,
        closeAction:'hide',
        items: grid,
        buttons:[
            {text:'确认',handler:submit},
            {text:'关闭',handler:function(){ win.hide(); }}
        ]
    })
    var transPlane = $('#transPlane');
    transPlane.unbind();
    transPlane.on('click',function(){
        /*if(!ROW.status){
            Ext.Msg.alert('温馨提示','没有可安排接送的游客！(请修改游客的上车站点)');
            return false;
        }*/
        parent.OpenTab('接送明细：'+number, 'TransPlan_'+number, '', $__app__+'/TransPlan/trans_plan/number/'+number, 1);
        /*var str = $(this).attr('value');
        SUNLINE.baseParams(store,{number:number});
        store.load();
        win.show();*/
    });
    var ticketPlane = $('#ticketPlane');
    ticketPlane.unbind();
    ticketPlane.on('click',function(){
        var number = $(this).attr('value');
        parent.OpenTab('票务：'+number, 'OrderBus_'+number, '', $__app__+'/OrderBus/index/'+number, 1);
        //parent.OpenTab('票务：'+number, 'OrderBus_'+number, '', $__app__+'/OrderBus/order_bus/number/'+number, 1);
    })

    /********选择出发口岸*********/
    //交通明细
    var season_station_start_url = $__app__ + '/StationStart/dataJsonn';
    var season_station_start_field = [{name:"sd_id"}];
    var season_station_start_store=SUNLINE.GroupingStore(season_station_start_url,season_station_start_field,{ groupField:'f_traffic_type'},false);
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 条)"
    });
    var f_traffic_name_combo=SUNLINE.DictComBox_false({name:'f_traffic_name',allowBlank:false},{'d_type':'交通类型'});
    var f_ticket_type_combo=SUNLINE.DictComBox_false({name:'f_ticket_type',allowBlank:false},{'d_type':'火车铺位'});
    var start_time = {xtype: 'timefield',name: 'in',/*minValue: '6:00 AM',maxValue: '8:00 PM',*/increment: 30,/*format:'H:i',*/anchor: '100%'};
    var end_time = {xtype: 'timefield',name: 'out',/*minValue: '6:00 AM',maxValue: '8:00 PM',*/increment: 30,/*format:'H:i',*/anchor: '100%'};
    var f_traffic_start_OrgCombo=SUNLINE.OrgCombo_Sation({listConfig:{minWidth:340},name:'f_traffic_start',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var f_traffic_end_OrgCombo=SUNLINE.OrgCombo_Sation({listConfig:{minWidth:340},name:'f_traffic_end',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var season_station_start= new Ext.grid.GridPanel({
        region:'center',
        //width:1000,
        border:false,
        //style : 'border-left:3px solid #3993D3;border-bottom:3px solid #3993D3;',
        //height:230,
        resizable:false,
        closeAction:'hide',
        store:season_station_start_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        features: [groupingFeature],
        columns:[
            {header:"交通类型", dataIndex:"f_traffic_name", width:100,editor:f_traffic_name_combo.box},
            {header:"铺位", dataIndex:"f_ticket_type", width:100,editor:f_ticket_type_combo.box},
            {header:"出发口岸", dataIndex:"f_traffic_start", width:250,editor:f_traffic_start_OrgCombo.box},
            {header:"出发城市", dataIndex:"f_traffic_start_place", width:150,hidden:true},
            {header:"出发城市", dataIndex:"f_start_place_id", width:150,hidden:true},
            {header:"目的地口岸", dataIndex:"f_traffic_end", width:250,editor:f_traffic_end_OrgCombo.box},
            {header:"航班/班次",dataIndex:"f_traffic_num",width:150,editor:true},
            {header:"出发时间",dataIndex:"f_start_time",width:150,editor:start_time,renderer:function(v){if(v){return getHoursMinutes(v)}}},
            {header:"到达时间",dataIndex:"f_end_time",width:150,editor:end_time,renderer:function(v){if(v){return getHoursMinutes(v)}}},
            {header:"目的城市", dataIndex:"f_traffic_end_place", width:150,hidden:true},
            {header:"目的城市", dataIndex:"f_end_place_id", width:150,hidden:true}
        ],
        tbar:[
            '<b>交通明细<b>',
            {text:'添加路程',id:'detaild_add',iconCls:'button-add',width:120,
                menu:[ {text:'添加去程',iconCls:'button-add',handler:add_traffic},
                    {text:'添加返程',iconCls:'button-add',handler:add_traffic}]
            },
            '-',
            {text:'删除',iconCls:'button-del',handler:del_traffic}
        ]
    });
    function getHoursMinutes(v){
        var hours = v.getHours();
        var minutes = v.getMinutes();
        if(minutes < 10){
            minutes = '0'+minutes;
        }
        return hours+':'+minutes;
    }
    function add_traffic(v){
        if(v.text=='添加去程'){
            season_station_start_store.add({
                f_traffic_type:'去程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
        }else if(v.text=='添加返程'){
            season_station_start_store.add({
                f_traffic_type:'返程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
        }
    }
    f_traffic_name_combo.box.on('select',function(c,r,n){
        var key;
        if(r[0].get('d_text')=='动车'){
            key='高铁座位';
        }else{
            key=r[0].get('d_text')+'座位';
        }
        var store=f_ticket_type_combo.box.getStore();
        var start_store=f_traffic_start_OrgCombo.box.getStore();
        var end_store=f_traffic_end_OrgCombo.box.getStore();

        var row=SUNLINE.getSelected(season_station_start);
        var type = {'飞机':'经济舱','高铁':'二等座','动车':'二等座','火车':'下铺'};
        $.each(type,function(i,v){
            if(r[0].get('d_text') == i){
                SUNLINE.baseParams(start_store,{sd_start_type:i});
                SUNLINE.baseParams(end_store,{sd_start_type:i});
                row.set('f_ticket_type',v);
            }
        })
        start_store.currentPage=1;
        start_store.load();
        end_store.currentPage=1;
        end_store.load();
        row.set('f_traffic_start','');
        row.set('f_traffic_end','');
        SUNLINE.baseParams(store,{'d_type':key});
        store.load();
    });
    season_station_start.on('select',function(i,v){
        if(typeof v['data']['f_traffic_name'] != 'undefined'){
            key=v['data']['f_traffic_name']+'座位';
            var store=f_ticket_type_combo.box.getStore();
            SUNLINE.baseParams(store,{'d_type':key});
            store.load();
            var start_store=f_traffic_start_OrgCombo.box.getStore();
            var end_store=f_traffic_end_OrgCombo.box.getStore();
            var type = ['飞机','高铁','动车','火车'];
            $.each(type,function(i,val){
                if(v['data']['f_traffic_name']==val){
                    SUNLINE.baseParams(start_store,{sd_start_type:val});
                    SUNLINE.baseParams(end_store,{sd_start_type:val});
                    start_store.currentPage=1;
                    start_store.load();
                    end_store.currentPage=1;
                    end_store.load();
                }
            })
        }
    })

    function del_traffic(){
        var row=SUNLINE.getSelected(season_station_start);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要删除的行！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该条信息吗？',function(id){
            if (id == 'yes') {
                var id_value=row.data.id;
                for(var i=0;i<season_station_start_store.count();i++){
                    var At_store=season_station_start_store.getAt(i);
                    var id=At_store.get('id');
                    if(id==id_value){
                        season_station_start_store.remove(season_station_start_store.data.items[i]);
                        season_station_start_store.reload();
                    }
                }
            }
        })
    }
    f_traffic_end_OrgCombo.box.on({'select':function(c,r,n) {
        var row = SUNLINE.getSelected(season_station_start);
        row.set('f_traffic_end_place', r[0].get('sd_city'));
        row.set('f_end_place_id', r[0].get('sd_id'));
    }});
    f_traffic_start_OrgCombo.box.on({'select':function(c,r,n){
        var row=SUNLINE.getSelected(season_station_start);
        row.set('f_traffic_start_place',r[0].get('sd_city'));
        row.set('f_start_place_id',r[0].get('sd_id'));
    }})
    var site_win = Ext.create('Ext.window.Window',{
        title:"选择口岸",
        width:1200,
        fixed:true,
        modal:true,
        autoScroll: true,
        closeAction:'hide',
        items: season_station_start,
        buttons:[
            {text:'确认',handler:siteSub},
            {text:'关闭',handler:function(){ site_win.hide(); }}
        ]
    })
    site_win.on('show',function(){
        var start_store = f_traffic_start_OrgCombo.store;
        var end_store = f_traffic_end_OrgCombo.store;
        season_station_start_store.add({
            f_traffic_type:'去程',
            f_traffic_name:'火车',
            f_ticket_type:'上铺',
            f_traffic_start:'',
            f_traffic_end:'',
            f_start_time:'',
            f_end_time:''
        });
        season_station_start_store.add({
            f_traffic_type:'返程',
            f_traffic_name:'火车',
            f_ticket_type:'上铺',
            f_traffic_start:'',
            f_traffic_end:'',
            f_start_time:'',
            f_end_time:''
        });
    })
    function siteSub(){
        var row = season_station_start_store.data.items;
        if(row.length<=0){
            Ext.Msg.alert('温馨提示','请填写完整出发口岸信息');
            return false;
        }
        var sid = ROW.site.join(',');
        ROW.SiteData=[];
        $.each(row,function(i,v){
            if(v.data.f_end_time){
                v.data.f_end_time = getHoursMinutes(v.data.f_end_time);
            }
            if(v.data.f_start_time){
                v.data.f_start_time = getHoursMinutes(v.data.f_start_time);
            }
            ROW.SiteData.push(v.data);
        })
        var data = Ext.encode(ROW.SiteData);
        Ext.Ajax.request({
            url: $__app__+'/OrderDetail/save_order_bus',
            params: {sid:sid,data:data},
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info,fun);
                function fun(){
                    if(r.status){
                        site_win.hide();
                        window.location.reload();
                    }
                }
            }
        })
    }
    function showWin(){
        if(ROW.site.length <= 0){
            Ext.Msg.alert('温馨提示','请选择要设置出发口岸的游客！');
            return false;
        }
        site_win.show();
    }
    var sitePlane = $('#sitePlane');
    sitePlane.live('click',function(){
        if(!ROW.SiteStatus){
            Ext.MessageBox.confirm('温馨提示','您要变更游客的出发口岸么？',function(yn){
                if(yn == 'yes'){
                    showWin();
                }
            })
        }else{
            showWin();
        }
    })
    setTimeout(function(){
        ROW.site = [];
        var allSite = $('#allSite');
        var changeSite = $('#changeSite');
        var selectSite = $("input[name=selectSite]");
        allSite.toggle(function(){
            ROW.site = [];
            changeSite.text("[不选]");
            $.each(selectSite,function(i,v){
                selectSite.eq(i).attr('checked','checked');
                ROW.site.push(selectSite.eq(i).attr('data_id'));
            })
        },function(){
            ROW.site = [];
            changeSite.text("[全选]");
            $.each(selectSite,function(i,v){
                selectSite.eq(i).attr('checked',null);
            })
        })
        selectSite.on('click',function(){
            var id = $(this).attr('data_id');
            if(jQuery.inArray(id,ROW.site) > -1){
                ROW.site.splice(jQuery.inArray(id,ROW.site),1);
            }else{
                ROW.site.push(id);
            }
        })
    },500);
    var refresh = $('#refresh');
    refresh.unbind();
    refresh.on('click',function(){
        location.reload();
    });
    site_win.on('hide',function(){
        season_station_start_store.removeAll();
    });

    var bus_save=ITEMS_YUN.BusSave();
    var fly_form=bus_save.form;
    var td_win=bus_save.win;

    //补录航班(次)信息 (start)
    var add_ticket=$('.add-ticket');
    add_ticket.unbind();
    add_ticket.click(function(){
        var check_id=$('.check-id');
        var s_id=[];
        for(var i=0;i<check_id.length;i++){
            var ck_id=check_id.eq(i);
            var list_id=ck_id.parents('.tour-list');
            if(ck_id.attr('checked')=='checked'){
                s_id.push(list_id.attr('s-id'));
            }
        }
        if(s_id.length>0){
            var _form_fly=fly_form.getForm();
            var start_date=$('.start_date');
            td_win.show();
            _form_fly.reset();
            var post_data={ s_id:s_id };
            post_data.ob_start_date=start_date.html();
            post_data.ob_end_date=start_date.html();
            post_data.ob_place_type=1;
            _form_fly.setValues(post_data);
            td_win.setTitle('追加航班(次)信息');
            Ext.getCmp('dosave_id').setText('确认添加');
            Ext.getCmp('ob_bool').setHidden(true);
        }else{
            Ext.Msg.alert('友情提示','请选择需要追加票务的游客信息!');
        }
    });
    //编辑航班（次）信息
    function exit_fn(){
        var trt_opear=$('.trt-opear');
        trt_opear.unbind();
        trt_opear.click(function(){
            var _form_fly=fly_form.getForm();
            td_win.show();
            td_win.setTitle('编辑航班(次)信息');
            Ext.getCmp('dosave_id').setText('确认编辑');
            var list_id=$(this).parents('.tour-list');
            var s_id=list_id.attr('s-id');
            var ob_id=$(this).parents('.ob-list').attr('ob-id');
            var rows=SeatStore[s_id]['bus_detail'][ob_id];
            //获取出发与返程日期
            var start_date=$('.start_date');
            var end_date=$('.end_date');
            Ext.getCmp('ob_bool').setHidden(false);
            rows.ob_bool=false;
            rows.s_id=s_id;
            rows.ob_old_start=rows.ob_start_site;
            rows.ob_old_end=rows.ob_end_site;
            rows.ob_start_date=start_date.html();
            rows.ob_end_date=start_date.html();
            _form_fly.setValues(rows);
        });
    }

    var cd_win = new Ext.Window({
        title:'账单打印',
        width:760,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="748" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });
    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }
    window.printPlan=function(number,date_time){
        cd_win.show();
        var url = $__app__ + '/CreditBill/BillPrint?_dc='+date_time+'&cb_id='+number;
        window.ifm_print.location = url;
    }



    var check_all=$('.check-all');
    check_all.click(function(){
        var tour_cid=$('.tour-content');
        var check_id=tour_cid.find('.check-id');
        for(var i=0;i<check_id.length;i++){
            var row_id=check_id.eq(i);
            if(row_id.attr('checked')=='checked'){
                row_id.attr('checked',false);
            }else{
                row_id.attr('checked',true);
            }
        }

    });
    var vip_set=$('.vip-set');
    vip_set.click(function(){
        var t=$(this);
        if(t.html()=='修改保存'){
            Ext.MessageBox.confirm('友情提示','你确定需要修改游客信息吗？',function(y){
                if(y!='yes')return false;
                var post_data=set_seat_post();
                //var o_vip_mob={'o_num':1,'vip_mob':$('.linkmob').val()};
                var o_vip_mob={},o_vip_name={};
                o_vip_mob['o_num']=$('.o_num').text();
                o_vip_mob['o_vip_mob']=$('.linkmob').val();
                o_vip_mob['o_vip_name']=$('.linkname').val();
                post_data.push(o_vip_mob);
                Ext.Ajax.request({
                    url:$__app__ + '/Order/save_seat_data',
                    params:{seat:Ext.encode(post_data),no:number},
                    method:'POST',
                    success:function (response, otps) {
                        var result = Ext.decode(response.responseText);
                        if (result.code==200) {
                            spaninput('span');
                            span2input('span');
                            t.html('[ 编辑游客 ]');
                            t.removeClass('vf-btn');
                            t.addClass('vf-blue');
                            Ext.Msg.alert("友情提示",result.data);
                        }else{
                            Ext.Msg.alert("友情提示",result.message);
                        };
                        site_info_no('off');
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '数据提交失败');
                    }
                })
            });
        }else{
            spaninput('input');
            span2input('input');
            t.html('修改保存');
            t.addClass('vf-btn');
            t.removeClass('vf-blue');
            site_info_no('set')
        }
    });

    /**
     * 获取修改游客数据
     * @returns {{}}
     */
    function set_seat_post(){
        var tour_list=$('.tour-list'),post_data=[],set_f=['vip_name','vip_mob','vip_card','vip_card_type','start_sttime','end_sttime','start_stname','end_stname','start_site_type','end_site_type'];
        $.each(tour_list,function(i,v){

            var tour_id=tour_list.eq(i);
            var from_id=tour_id.find('.from-input');
            var post_row={s_id:tour_id.attr('s-id'),s_tid:tour_id.attr('t-id')};
            $.each(from_id,function(fi,fv){
                var f_id=from_id.eq(fi);
                if(in_array(f_id.attr('name'),set_f)!=-1){
                    post_row['s_'+f_id.attr('name')]=f_id.val();
                }
            });
            $.each(tour_id.find('.site-info').find('.from-input-checkbox'),function(i,v){
                var field_name='start_site_type';
                if(i == 1){
                    field_name='end_site_type';
                }
                post_row[field_name]=($(this).is(':checked'))?1:0;
            });

            post_data.push(post_row);
        });
        return post_data;
    };

    /**
     * 控制编辑框显示方式
     * @param type 显示类型
     */
    function spaninput(type){
            var old_vip_mob = $.trim($('.linkmob').text());
            var old_vip_name= $.trim($('.linkname').text());
            if(type=='input'){
                $('.mobfa').html('<input type="text" class="linkmob" name="vip_mob"  value="'+old_vip_mob+'"/>');
                $('.manfa').html('<input type="text" class="linkname" name="vip_name"  value="'+old_vip_name+'"/>');
                $('.td-checkbox input').show();
            }else{
                $('.mobfa').html('<span  class="linkmob" name="vip_mob">'+ $('.linkmob').val() +'</span>');
                $('.manfa').html('<span  class="linkname" name="vip_name">'+ $('.linkname').val() +'</span>');
                $('.td-checkbox input').hide();
            }
    }


    function span2input(type){
        var tour_list=$('.tour-list'),set_f=['vip_name','vip_mob','vip_card','vip_card_type','start_sttime','end_sttime','start_stname','end_stname'];
        var card_type=['身份证','护照','军官证','回乡证','台胞证','国际海员证','港澳通行证','赴台证','其他'];
        $.each(tour_list,function(ti,tv){
            var tour_id=tour_list.eq(ti);
            var from_id=tour_id.find('.from-input');
            $.each(from_id,function(fi,fv){
                var f_id=from_id.eq(fi);
                if(in_array(f_id.attr('name'),set_f)!=-1){
                    if(type=='input'){
                        if(f_id.attr('name')=='vip_card_type'){
                            var card_tpl='';
                            $.each(card_type,function(cti,ctv){
                                var selected='';
                                if(ctv==f_id.html())selected='selected';
                                card_tpl+='<option value="'+ctv+'" '+selected+'>'+ctv+'</option>';
                            })
                            f_id.parent().html('<select name="'+f_id.attr('name')+'" class="'+f_id.attr('class')+'">'+card_tpl+'</select>');
                        }else{
                            f_id.parent().html('<input type="text" name="'+f_id.attr('name')+'" class="'+f_id.attr('class')+'" value="'+f_id.html()+'">');
                        }
                    }else{
                        f_id.parent().html('<span name="'+f_id.attr('name')+'" class="'+f_id.attr('class')+'">'+f_id.val()+'</span>');
                    }
                }
            })
        });
    }
    /*打印处理窗口(start)*/
    var cd_win = new Ext.Window({
        title:'账单打印',
        width:760,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="748" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });
    $('.look_bill').on('click',function(){
        if(this.attributes.bill_type.nodeValue == '信用支付账单'){
            cd_win.setHtml('<iframe id="ifm_print" name="ifm_print" src="/CreditBill/BillPrint?cb_num='+this.text+'" width="748" style=" height:480px;" frameborder=0></iframe>')
        }else{
            cd_win.setHtml('<iframe id="ifm_print" name="ifm_print" src="/OnlineBill/BillPrint?wno='+this.text+'&id='+this.attributes.bill_id.nodeValue+'" width="748" style=" height:480px;" frameborder=0></iframe>')

        }
        cd_win.show();
    });

    $('a.cancel').on('click',function(){
        var payid = $(this).attr('data-id');
        Ext.MessageBox.confirm('友情提示','取消订单时请确保付款单位未在付款过程中，避免系统内金额与实际收款金额不一致而导致纠纷',function (y){
            if(y!='yes')return false;
            Ext.Ajax.request({
                url:$__app__ + '/OrderDetail/cancel_pay',
                params:{ payid:payid },
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    if (result.code==200) {
                        $('.pay_status').html('已取消');
                        $('.pay_cancel').html('');
                    }else{
                        Ext.MessageBox.alert('温馨提示',result.data);
                    };
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            });
        });
    });
    var log=ziyo_log({ listeners : [{action:'Order'}],js_app:'jquery' });
    $('#system_log').click(function(){
        SUNLINE.baseParams(_ziyo_log_store, {'log_table':'Order','log_tid':number_id});
        log.win.show();
    });
    //执行倒数秒
    $(function(){
        updateEndTime();
    });

});