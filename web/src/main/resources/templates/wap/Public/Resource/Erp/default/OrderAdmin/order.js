/**
 * Created by Johony on 16-1-21.
 */
var ROW = {}; //用于存储头部搜索条件
var od_data={};
ROW.o_status = '所有订单';
Ext.onReady(function(){
    var url= $__app__+'/OrderAdmin/OrderJson';
    var field = [];
    var store= SUNLINE.JsonStore(url,field,true);
    store.baseParams = { start:0, limit:20 };
    store.on('load',function(t){
        var OrdCount = t.proxy.reader.rawData.OrdCount;
        if(!OrdCount.buyReal){
            OrdCount.buyReal=0;
        }
        if(!OrdCount.settleReal){
            OrdCount.settleReal=0;
        }
        var AllCount = t.proxy.reader.rawData.AllCount;
        if(!AllCount.buyReal){
            AllCount.buyReal=0;
        }
        if(!AllCount.settleReal){
            AllCount.settleReal=0;
        }
        var OrdStr = '';
        var AllStr = '';
        if(OrdCount.sNum && OrdCount.lNum){
            OrdStr += '<span>['+OrdCount.lNum+'大/ '+OrdCount.sNum+'小]</span>';
        }else if(!OrdCount.sNum){
            OrdStr += '<span>['+OrdCount.lNum+'人 ]</span>';
        }else if(!OrdCount.lNum){
            OrdStr += '<span>['+OrdCount.sNum+'小] </span>';
        }
        if(AllCount.sNum && AllCount.lNum){
            AllStr += '<span>['+AllCount.lNum+'大/ '+AllCount.sNum+'小]</span>';
        }else if(!AllCount.sNum){
            AllStr += '<span>['+AllCount.lNum+'人 ]</span>';
        }else if(!OrdCount.lNum){
            AllStr += '<span>['+AllCount.sNum+'小 ]</span>';
        }
        if(!OrdCount.sNum && !OrdCount.lNum){
            OrdStr = '暂无订单';
        }
        if(!AllCount.sNum && !AllCount.lNum){
            AllStr = '暂无订单';
        }
        OrdStr += '= 销售额：<i style = "color:#ff4500;font-style:normal">'+OrdCount.buyReal+'</i> 元    结算额：<i style = "color:#ff4500;font-style:normal">'+OrdCount.settleReal+'</i> 元';
        AllStr += '= 销售额：<i style = "color:#ff4500;font-style:normal">'+AllCount.buyReal+'</i> 元    结算额：<i style = "color:#ff4500;font-style:normal">'+AllCount.settleReal+'</i> 元';
        var OrdCountDoc = document.getElementById('OrdCount');
        var AllCountDoc = document.getElementById('AllCount');
        if(OrdCountDoc){
            OrdCountDoc.innerHTML = OrdStr;
        }
        if(AllCountDoc){
            AllCountDoc.innerHTML = AllStr;
        }
    })

    /**
     * 头部搜索的时间插件
     * @type {*}
     */
    var start_time=SUNLINE.ExtDateField({
        id:'search_start_time',
        allowBlank:true,
        emptyText:'开始日期',
        width:100,
        labelWidth:1,
        height:30,
        style: {
            borderColor: '#ddd'
        },
        name:'search_start_time',
        fieldLabel:" ",
        format: 'Ymd',
        gang:'search_end_time',
        start:true,
        renderTo:'start_time',
        labelSeparator:''
        //value:new Date()
    });
    var end_time=SUNLINE.ExtDateField({
        id:'search_end_time',
        width:100,
        allowBlank:true,
        emptyText:'结束日期',
        labelWidth:1,
        height:30,
        style: {
            borderColor: '#ddd',
            color:'#666'
        },
        name:'search_end_time',
        fieldLabel:" ",
        format: 'Ymd',
        gang:'search_start_time',
        renderTo:'end_time',
        labelSeparator:''/*,
        value:new Date()*/
    });
    var pd_start=$("#start_time").attr("val");
    var pd_end=$("#end_time").attr("val");
    var start_date=$("#start_date").val();
    if(start_date){
        pd_start=pd_end=start_date;
        Ext.getCmp("search_start_time").setReadOnly(true);
        Ext.getCmp("search_end_time").setReadOnly(true);
    }
    if(pd_start){ Ext.getCmp("search_start_time").setValues(pd_start); }
    if(pd_end){ Ext.getCmp("search_end_time").setValues(pd_end); }

    /**头部搜索的下拉框插件**/

    /**
     * 出团日期
     * @type {Ext.form.ComboBox}
     */
    var time_type=new Ext.form.ComboBox({
        id:"time_type_combo",
        fieldLabel:":",
        style: {
            borderColor: '#ddd'
        },
        width:90,
        height:30,
        allowBlank:true,
        store:new Ext.data.SimpleStore({fields:['time_type'], data:[
            ['出团日期'],['交易日期'],['回团日期'],['确认日期']
        ]}),
        triggerAction:"all",
        editable:false,
        valueField:"time_type",
        displayField:"time_type",
        mode:"local",
        value:'',
        emptyText:'时间查询',
        renderTo:'time-type',
        listeners:{
            change:function(){
                var timeType = $('input[name=time_type_combo-inputEl]').val();
                ROW.timeType = timeType;
            }
        }
    })
    /**
     * 产品系列的下拉框
     * @type {*}
     */
    var route_type_info=SUNLINE.ComBoxPlus({
        id:'route_type_info_combo',
        fields:['d_id','d_text','d_type'],
        url:$__app__+'/OrderAdmin/getOrderProductType',
        config:{
            displayField:'d_text',
            valueField:'d_id',
            fieldLabel: '产品系列',
            labelWidth:60,
            labelAlign:'right',
            width:220,
            height:30,
            selectOnFocus:true ,
            forceSelection : true,
            value:'',
            emptyText:'请选择产品系列',
            renderTo:'route-info',
            listeners:{
                change:function(){
                    var route_type = $('input[name=route_type_info_combo]').val();
                    ROW.o_product_series = route_type;
                }
            }
        }
    });
    /**
     * 出发城市的下拉框
     * @type {Ext.form.ComboBox}
     */
    var city_info=SUNLINE.ComBoxPlus({
        id:'city_info_combo',
        fields:['o_sorg_city'],
        where:{group:'o_sorg_city'},
        url:$__app__+'/OrderAdmin/getOrderInfo',
        config:{
            displayField:'o_sorg_city',
            valueField:'o_sorg_city',
            fieldLabel: '出发城市',
            labelWidth:60,
            labelAlign:'right',
            width:220,
            selectOnFocus:true ,
            forceSelection : true,
            height:30,
            value:'',
            emptyText:'请选择出发城市',
            renderTo:'city-info',
            listeners:{
                change:function(){
                    var city_info = $('input[name=city_info_combo]').val();
                    ROW.o_sorg_city = city_info;
                }
            }
        }
    });

    /**
     * 旅行社的下拉框插件
     * @type {*}
     */
    var agency_info=SUNLINE.ComBoxPlus({
        id:'agency_info_combo',
        fields:['o_sorg_name'],
        where:{group:'o_sorg_name'},
        url:$__app__+'/OrderAdmin/getOrderInfo',
        config:{
            displayField:'o_sorg_name',
            valueField:'o_sorg_name',
            fieldLabel: '报名社',
            labelWidth:55,
            labelAlign:'right',
            width:280,
            height:30,
            value:'',
            selectOnFocus:true ,
            forceSelection : true,
            emptyText:'请选择报名社',
            renderTo:'agency-info',
            listeners:{
                change:function(){
                    var org_info = $('input[name=agency_info_combo]').val();
                    ROW.o_sorg_name = org_info;
                }
            }
        }
    });
    /**
     * 报名人的下拉框插件
     * @type {*}
     */
    var applicant_info=SUNLINE.ComBoxPlus({
        id:'applicant_info_combo',
        fields:['o_name'],
        where:{group:'o_name'},
        url:$__app__+'/OrderAdmin/getOrderInfo',
        config:{
            displayField:'o_name',
            valueField:'o_name',
            fieldLabel: '报名人',
            labelWidth:55,
            labelAlign:'right',
            width:150,
            height:30,
            value:'',
            selectOnFocus:true ,
            forceSelection : true,
            emptyText:'请选择报名人',
            renderTo:'applicant-info',
            listeners:{
                change:function(){
                    var o_name = $('input[name=applicant_info_combo]').val();
                    ROW.o_name = o_name;
                }
            }
        }
    });
    /**
     * 产品类型的下拉框插件
     * @type {*}
     */
    var type_info=SUNLINE.ComBoxPlus({
        id:'type_info_combo',
        fields:['o_type'],
        where:{group:'o_type'},
        url:$__app__+'/OrderAdmin/getOrderInfo',
        config:{
            displayField:'o_type',
            valueField:'o_type',
            fieldLabel: '产品类型',
            labelWidth:60,
            labelAlign:'right',
            width:150,
            height:30,
            value:'',
            selectOnFocus:true ,
            forceSelection : true,
            emptyText:'请选择产品类型',
            renderTo:'type-info',
            listeners:{
                change:function(){
                    var o_type = $('input[name=type_info_combo]').val();
                    ROW.o_type = o_type;
                }
            }
        }
    });
    /*var custom_info=new Ext.form.ComboBox({
        id:"custom_info_combo",
        fieldLabel:"服务客服",
        labelWidth:60,
        style: {
            borderColor: '#ddd'
        },
        width:150,
        height:30,
        allowBlank:false,
        store:new Ext.data.SimpleStore({fields:['custom-info'], data:[
            ['李蒙蒙'],['李蒙蒙']
        ]}),
        triggerAction:"all",
        editable:false,
        valueField:"custom-info",
        displayField:"custom-info",
        mode:"local",
        emptyText:'请选择客服',
        value:'',
        renderTo:'custom-info'
    })*/
    var custom_info=SUNLINE.ComBoxPlus({
        id:'custom_info_combo',
        fields:['service_name'],
        where:{group:'o_service_name'},
        url:$__app__+'/OrderAdmin/getOrderInfo',
        config:{
            displayField:'service_name',
            valueField:'service_name',
            fieldLabel: '客服',
            labelWidth:60,
            labelAlign:'right',
            width:150,
            height:30,
            value:'',
            allowBlank:true,
            selectOnFocus:true ,
            forceSelection : true,
            emptyText:'请选择客服',
            renderTo:'custom-info',
            listeners:{
                change:function(){
                    var o_service_name = $('input[name=custom_info_combo]').val();
                    ROW.o_service_name = o_service_name;
                }
            }
        }
    });
    /*分公司*/
    var bc_url = $__app__ + '/Credit/company_select';
    var bc_field = [ {name:"org_id"}];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field);
    var ci_bc_store = new Ext.form.ComboBox({
        width:300,
        value:'全部单位',
        fieldLabel:"所属单位",
        labelWidth:60,
        id:'org_name_id',
        labelAlign:"right",
        name:'org_name',
        allowBlank : false,
        store: bc_store,
        displayField:'org_name',
        valueField:"org_id",
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });
    bc_store.on('load',function(){
        this.add({org_name:'全部单位',org_id:'99999'});
        if(_uinfo['org_id']!=1){
            Ext.getCmp('org_name_id').setValue(_uinfo['org_id']);
        }else{
            Ext.getCmp('org_name_id').setValue('99999');
        }
    })
    if(_uinfo['org_id']==1){
        ci_bc_store.render('company-info');
    }
    /**
     * 产品线路的下拉框插件
     * @type {Ext.form.ComboBox}
     */
    var Products_OrgCombo=SUNLINE.OrgCombo_Products_false({
        fieldLabel: '产品信息',id:'routes_info_combo',valueField:"p_id",width:300,allowBlank:true,editable:true,forceSelection:true,labelWidth:60,labelAlign:'right',height:30,status_type:'all',
        listConfig:{minWidth:340}
    });
    Products_OrgCombo.box.render('routes-info');

    /**
     * 将时间戳 转换为日期格式
     * @param now
     * @returns {string}
     */
    function  strFormatDate(now){
        var time = new Date(now).toLocaleString();
        return time;
    }

    /**
     * 订单显示的dataView
     */
    var order_tpl = new Ext.XTemplate(
        '<table class="main-table"  width="100%" cellspacing="0" >'+
            '<tbody>',
        '<tpl for=".">',
            '<tr>'+
                '<td class="order-info">'+
                    '<ul>'+
                        '<li>'+
                            '<span class="title title-color">订单号：</span>'+
                            '<span class="info info-color">{o_number}</span>'+
                        '</li>'+
                        '<li>'+
                            '<span class="title">预定：</span>'+
                            '<span class="info">'+
                            '{[ this.getSellTime(values) ]}'+
                            '</span>'+
                        '</li>'+
                        '<tpl if = "o_vip_name">',
                        '<li>'+
                            '<span class="title">联系：</span>'+
                            '<span class="info">{o_vip_name} &nbsp;{o_vip_mob}</span>'+
                        '</li>'+
                        '</tpl>',
                        '<li>'+
                        /*'{[ this.getStatus(values) ]}'+*/
                        '</li>'+
                    '</ul>'+
                '</td>'+
                '<td class="goods-info">'+
                    '<ul >'+
                        '<li>'+
                        '{[ this.getGoalUrl(values)]}'+
                        '</li>'+
                        '<li>'+
                            '<span class="li-left">出团：'+
                            '{[ this.getStartTime(values) ]}'+
                            '</span>'+
                            ' <span class="li-right">回团：'+
                            '{[ this.getEndTime(values) ]}'+
                            '</span>'+
                        '</li>'+
                        '<li>'+
                            '<span class="li-left">出发城市：{o_sorg_city}</span>'+
                           ' <span class="li-right">天数：{o_days}日</span>'+
                       ' </li>'+
                    '</ul>'+
                '</td>' +
                '<td class = "ticket-trans">' +
                    '{[ this.getTicketPlans(values)]}'+
                '</td>'+
                '<td class="tourist-info">' +
                '<ul>' +
                '<li>' +
                '<span class="buy">买：</span>' +
                '<span class="ti-info">' +
                '<span>{o_sorg_name}</span>' +
                '<p>' +
                '<i>{o_name}</i>' +
                '<i class="ti-tell" data-id = "{o_uid}">[查看联系方式]</i>' +
                '</p>' +
                '</span>' +
                '</li>' +
                '<li>' +
                '<span class="sale">卖：</span>' +
                '<span class="ti-info">' +
                '{[ this.getService(values)]}</span>' +
                '</li>' +
                '</ul>' +
                '</td>' +
                '<td class="price-info">' +
                '<p class="price-cursor cursor-person">' +
                '<span class="num">人数：</span>' +
                '{[ this.getOrdDetail(values) ]}'+
                '</p>' +
                '<p class="red-color">' +
                '<span>销售：</span>' +
                '<span>{o_buy_real}</span>' +
                '</p>' +
                '<p class="red-color price-cursor cursor-refund">' +
                '<span>结算：</span>' +
                '<span>{o_settle_real}</span>' +
                '<div class="prices-hover">' +
                '<i class="s-top"></i>' +
                '<div class="hover-info">' +
                '<ul>' +
                '{[ this.getPrices(values) ]}'+
                '</ul>' +
                '</div>' +
                '</div>' +
                '</p>' +
                '</td>' +
                '<td class="handle-info">' +
                '<div class="handle-menu">' +
                '{[ this.Detail(values) ]}'+
                '<div class="handle-hide">' +
                '<ul>' +
                '{[ this.StaUpdateOrder(values) ]}'+
                /*'<li><a href="'+$__app__+'/Buy/pId_{o_product_id}_blId_{o_bl_id}_number_{o_number}" target = "_blank">修改订单</a></li>' +*/
                '{[ this.ChangeMoney(values) ]}'+
                /*'<li><a href = "javascript:;"  value = "{o_number}" onclick = changePrice(this.getAttribute("value"))>调整金额</a></li>' +*/
                '{[ this.ChangeSeat(values) ]}'+
                /*'<li><a href = "javascript:;"  value = "{o_number}" onclick = changeSeat(this.getAttribute("value"))>调整座位</a></li>' +*/
                '{[ this.DeleteOrder(values) ]}'+
                /*'<li><a href="#">预留时间</a></li>' +*/
                '{[ this.showConf(values) ]}'+
                /*'<li><a href = "/Confirmation/index/o_number/{o_number}" target="_blank">查看确认单</a></li>'+*/
                '</ul>' +
                '</div>' +
                '</div>' +
                '{[ this.getSta(values) ]}'+
                '<div>' +
                '{[ this.getStatus(values) ]}'+
                '</div>'+
                '</td>' +
                '</tr>',
        '</tpl>',
        '<tr>' +
            '<td class = "count-info">总计 : </td>'+
            '<td id = "AllCount" colspan="2"></td>'+
            '<td class = "count-info">当前 : </td>'+
            '<td id = "OrdCount" colspan="2"></td>'+
        '</tr>'+
        '</tbody>'+
        '</table>',
        {
            Detail:function(val){
                var str = '订单详情';
                var role=_uinfo.r_role;
                if(val.o_status == '待确认' && in_array('OrderDetail::changeStatus',role)!=-1){
                    str = '确认订单';
                }
                var info = '<a href="javascript:;" onclick = UrlOrderDetail("'+val.o_number+'") class="menu"><i class="fa fa-file-text-o"></i>'+str;
                info += '<i class="fa fa-caret-down"></i></a>';
                return info;
            },
            getGoalUrl:function(val){
                if(val.o_type == '跟团游'){
                    var str = '<a href = "/Goal/'+val.o_product_id+'" target = "_blank" style = "font-size: 14px;">['+val.o_product_num+']'+val.o_product_name+'</a>';
                }else if(val.o_type == '团队订单'){
                    var str = '<a href = "/TeamList/PrintTeam/num/'+val.o_product_num+'" target = "_blank" style = "font-size: 14px;">['+val.o_product_num+']'+val.o_product_name+'</a>';
                }
                return str;
            },
            getSellTime:function(val){
                val = parseInt(val.o_sell_time)*1000;
                return strFormatDate(val);
            },
            getStartTime:function(val){
                var val = val.o_start_date;
                var year = val.substr(0,4);
                var mon = val.substr(4,2);
                var day = val.substr(6,2);
                return year+'/'+mon+'/'+day;
            },
            getEndTime:function(val){
                var val  = val.o_end_date;
                var year = val.substr(0,4);
                var mon = val.substr(4,2);
                var day = val.substr(6,2);
                return year+'/'+mon+'/'+day;
            },
            getStatus:function(val){
                var str = '';
                var val = val.o_status;
                switch(val){
                    case '待确认':
                        str = '<span class="status status-confirming">'+val+'</span>';
                        break;
                    case '已确认':
                        str = '<span class="status status-confirmed">'+val+'</span>';
                        break;
                    case '问题订单':
                        str = '<span class="status status-error">'+val+'</span>';
                        break;
                    case '出票中':
                        str = '<span class="status status-ticketing">'+val+'</span>';
                        break;
                    case '已出票':
                        str = '<span class="status status-ticketed">'+val+'</span>';
                        break;
                    case '退票':
                        str = '<span class="status status-refund">'+val+'</span>';
                        break;
                    case '收款中':
                        str = '<span class="status status-ticketing">'+val+'</span>';
                        break;
                    default :
                        str = '<span class="status">'+val+'</span>';
                        break;
                }
                return str;
            },
            getStatusInfo:function(val){
                var val = val.o_status;
                var str = '订单详情';
                var role=_uinfo.r_role;
                if(val == '待确认' && in_array('OrderDetail::changeStatus',role)!=-1){
                    str = '确认订单';
                }
                return str;
            },
            getSta:function(val){
                var status = val.o_status;
                if(status!='待确认' && status != '退票'){
                    var str = '<div class="print-menu">' +
                        '<a href="/PrintNotice/number_'+val.o_number+'" class="print" target = "_blank"><i class="fa fa-print"></i>打印通知书</a>' +
                        '</div>';
                }
                return str;
            },
            StaUpdateOrder:function(val){
                var role = _uinfo.r_role;
                if(val.o_status == '退票'){
                    return '';
                }else{
                    if(in_array('OrderDetail::UpdateOrder',role)!=-1){
                        if(val.o_type=='跟团游'){
                            var str =  '<li><a href="'+$__app__+'/Buy/pId_'+val.o_product_id+'_blId_'+val.o_bl_id+'_number_'+val.o_number+'" target = "_blank">修改订单</a></li>';
                        }else if(val.o_type == '团队订单'){
                            var str =  '<li><a href="javascript:;" onclick=localTeam("'+val.o_number+'","'+val.o_team_id+'")>修改订单</a></li>';
                        }
                        return str;
                    }
                }
            },
            getService:function(val){
                if(val.o_uid == val.o_create_uid){
                    return val.o_service_name;
                }else{
                    return val.o_create_name;
                }
            },
            ChangeMoney:function(val){
                var role = _uinfo.r_role;
                if(val.o_status == '退票'){
                    return '';
                }else{
                    if(in_array('OrderAdmin::changeMoney',role)!=-1){
                        if(val.o_type == '跟团游'){
                            var str = '<li><a href = "javascript:;"  value = "'+val.o_number+'" onclick = changePrice(this.getAttribute("value"))>调整金额</a></li>';
                        }else if(val.o_type == '团队订单'){
                            var str =  '<li><a href="javascript:;" onclick=localTeam("'+val.o_number+'","'+val.o_team_id+'")>调整金额</a></li>';
                        }
                        return str;
                    }
                }
            },
            ChangeSeat:function(val){
                var role = _uinfo.r_role;
                if(val.o_status == '退票'){
                    return '';
                }else{
                    if(in_array('OrderAdmin::ajax_adjust_seat',role)!=-1){
                        if(val.o_type == '跟团游'){
                            var str = '<li><a href = "javascript:;"  value = "'+val.o_number+'" onclick = changeSeat(this.getAttribute("value"))>调整座位</a></li>';
                            return str;
                        }
                    }
                }
            },
            DeleteOrder:function(val){
                var role = _uinfo.r_role;
                var status = val.o_status;
                if(status != '出票中' && status != '已出票' && status != '退票'){
                    if(in_array('OrderAdmin::DelOrder',role)!=-1){
                        var str = '<li><a href = "javascript:;"  value = "'+val.o_number+'" onclick = delOrder("'+val.o_number+'")>取消订单</a></li>';
                    }
                    return str;
                }
            },
            showConf:function(val){
                if(val.o_status == '退票'){
                    return '';
                }else{
                    return '<li><a href = "/Confirmation/index/o_number/'+val.o_number+'" target="_blank">查看确认单</a></li>';
                }
            },
            getOrdDetail:function(val){
                var str = '';
                var sNum = 0;//儿童票数量
                var lNum = 0;//成人票数量
                var val = val.o_room_detail;
                $.each(val,function(i,v){
                    if(v.t_preset_type == '儿童票'){
                        if(v.num){
                            sNum = parseInt(sNum) + parseInt(v.num);
                        }
                    }else{
                        if(v.num){
                            lNum = parseInt(lNum) + parseInt(v.num);
                        }
                    }
                });
                if(sNum && lNum){
                    str += '<span>'+lNum+'大/ '+sNum+'小</span>';
                }else if(!sNum){
                    str += '<span>'+lNum+'大 </span>';
                }else if(!lNum){
                    str += '<span>'+sNum+'小 </span>';
                }
                str+= '<div class="price-hover">' +
                    '<i class="s-top"></i>'+
                    '<div class="hover-info">' +
                    '<ul>' ;
                $.each(val,function(i,v){
                    str += '<li><span>'+v.t_name+'：</span><span>'+v.num+'x <i>'+v.t_price+'</i></span></li>';
                })
                str += '</ul>' +
                    '</div>' +
                    '</div>';
                return str;
            },
            getTicketPlans:function(val){
                var rows=val.plan_ticket
                var str = '<div class="order-status">'+
                    '<ul class="car">'+
                    '<li class="t">接送</li>'+
                    '<li class="'+changeShow(rows.start_bus,rows.start_on_bus)+'" title = "'+bus_msg_view('去程',rows.start_bus,rows.start_on_bus,rows.start_not_bus,'接送')+'">'+rows.start_on_bus+'/'+rows.start_bus+'</li>'+
                    '<li class="'+changeShow(rows.end_bus,rows.end_on_bus)+'" title = "'+bus_msg_view('返程',rows.end_bus,rows.end_on_bus,rows.end_not_bus,'接送')+'">'+rows.end_on_bus+'/'+rows.end_bus+'</li>'+
                    '</ul>'+
                    '<ul class="tickets">'+
                    '<li class="t">票务</li>'+
                    '<li class="'+changeShow(rows.start_ticket,rows.start_on_ticket)+'" title = "'+bus_msg_view('去程',rows.start_ticket,rows.start_on_ticket,rows.start_not_ticket,'票务')+'">'+rows.start_on_ticket+'/'+rows.start_ticket+'</li>'+
                    '<li class="'+changeShow(rows.end_ticket,rows.end_on_ticket)+'" title = "'+bus_msg_view('返程',rows.end_ticket,rows.end_on_ticket,rows.end_not_ticket,'票务')+'">'+rows.end_on_ticket+'/'+rows.end_ticket+'</li>'+
                    '</ul>'+
                    '</div>';
                /*var values = val.plan_ticket;
                var str = '<div class="order-status">'+
                    '<ul class="car">'+
                        '<li class="t">接送</li>'+
                        '<li class="'+changeShow(parseFloat(values.go_tp_count/values.go_count),values.go_count)+'" title = "去程">'+getStrInfo(values.go_tp_count,values.go_count)+'</li>'+
                        '<li class="'+changeShow(parseFloat(values.back_tp_count/values.back_count),values.back_count)+'" title = "返程">'+getStrInfo(values.back_tp_count,values.back_count)+'</li>'+
                    '</ul>'+
                    '<ul class="tickets">'+
                        '<li class="t">票务</li>'+
                        '<li class="'+changeShow(parseFloat(values.go_tick_count/values.go_count),values.go_count)+'" title = "去程">'+getStrInfo(values.go_tick_count,values.go_count)+'</li>'+
                        '<li class="'+changeShow(parseFloat(values.back_tick_count/values.back_count),values.back_count)+'" title = "返程">'+getStrInfo(values.back_tick_count,values.back_count)+'</li>'+
                    '</ul>'+
                    '</div>';*/
                return str;
            },
            getPrices:function(val){
                var str = '';
                if(typeof val.payMent!='object')return '';
                var val = val.payMent;
                $.each(val,function(i,v){
                     str += '<li>' +
                            '<span>'+v.op_detail+':</span>' +
                            '<span>'+v.op_num+'人x <i>'+ v.op_price+'</i></span>' +
                            '</li>';
                });
                return str;
            }
        }
    );

    function getStrInfo(num,count){
        var str = '';
        if(count == 0){
            str = "无"
            return str;
        }
        return num+'/'+count;
    }
    //出票状态样式显示
    function changeShow(start_num,end_num){
        //不包含error、未处理not、处理中full、已完成part
        var cls='part';
        if(start_num<=0){
            cls='error';
        }else if(start_num>0 && end_num<=0){
            cls='not';
        }else if(start_num>0 && start_num!=end_num){
            cls='full';
        }
        return cls;
    }
    //接送提示模版、票务提示模版
    function bus_msg_view(type,start,end,not,ticket){
        var str=type+':'+'有'+start+'人含大交通，'+end+'人已出票,('+not+'人不含票)';
        if(ticket=='接送'){
            var str=type+':'+'有'+start+'人需要接送，已安排'+end+'人,('+not+'人无需接送)';
        }
        return str;
    }

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
        items:[
            {id:'number',name:'number',fieldLabel:'订单编号',allowBlank:false,hidden:true},
            {id:'penalty_money',name:'penalty_money',fieldLabel:'违约金',xtype:'numberfield'},
            {id:'penalty_remarks',name:'penalty_remarks',fieldLabel:'备注',xtype:'textarea'}
        ]
    });
    var delOrderWin = Ext.create('Ext.window.Window',{
        title:"取消订单违约金",
        width:330,
        autoScroll: true,
        closeAction:'hide',
        items: delForm,
        buttons:[
            {text:'确认',handler:delSub},
            {text:'关闭',handler:function(){ delOrderWin.hide(); }}
        ]
    });
    function delSub(){
        var Form = delForm.getForm();
        var v=Form.getValues();
        if(!Form.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        Ext.MessageBox.confirm('友情提示','真的要取消订单吗?',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/Order/order_del',
                    params:v,
                    method:'POST',
                    success:function(response,otps){
                        var result = Ext.decode(response.responseText);
                        var msg = result.info;
                        if(result.status == 1){
                            store.reload();
                            Ext.Msg.alert("温馨提示",msg.msg);
                            delOrderWin.hide();
                            delForm.getForm().reset();
                        }else{
                            Ext.Msg.alert("温馨提示",msg);
                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '数据查询失败');
                    }
                })
            }
        })
    }
    window.delOrder=function(v){
        delOrderWin.show();
        Ext.getCmp('number').setValue(v);
    }
    window.localTeam=function(v,team_id){
        /*if(team_id>0){
            Ext.Msg.alert('友情提示','当前团队已经生成过计划单，如需修改请先撤销掉计划单再来修改！');
            return false;
        }*/
        parent.OpenTab('修改团队'+v, 'Team'+v, '', $__app__+'/Team/team_order_save/number/'+v, 1);
    }
    window.UrlOrderDetail=function(v){
        parent.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v, 1);
    }
    var order_view = new Ext.DataView({
        store:store,
        tpl:order_tpl,
        id : 'order_dv',
        autoHeight:true,
        multiSelect:true,
        border:false,
        /*plugins: [
            new Ext.ux.DataView.DragSelector()
        ],*/
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
        height:"80%",
        border:false,
        autoScroll:true,
        items:[ order_view ],
        bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有订单信息'
        }),
        renderTo:'main-info'
    });

    var skey = $('input[name = keySearch]');
    skey.on('blur',function(){
        ROW.keylike = '';
        var sVal = skey.val();
        if(sVal){
            ROW.keylike = sVal;
        }
    })

    skey.on('keydown',function(v){
        if(v.keyCode == '13'){
            ROW.keylike = '';
            var sVal = skey.val();
            if(sVal){
                ROW.keylike = sVal;
            }
            SUNLINE.baseParams(store,{keylike:ROW.keylike});
            store.currentPage = 1;
            store.load();
        }
    })
    /**
     * 搜索按钮的点击事件
     */
    $('.search-confirm').on('click',function(){
        if(typeof ROW.o_status == 'undefined'){
            Ext.Msg.alert('温馨提示','请先选择您要搜索的订单状态');
            return false;
        }
        if(!ROW.keylike){
            getFormValues();
            SUNLINE.baseParams(store,ROW);
        }else{
            SUNLINE.baseParams(store,{keylike:ROW.keylike});
        }
        store.currentPage = 1;
        store.load();
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

    //头部的菜单按钮
    $('.mt-left a').click(function(){
        $('.mt-left a').removeClass('a-hover');
        $(this).addClass('a-hover');
        var val = $(this).text().split('[');
        ROW.o_status = val[0];
        getThisData(val[0]);
    });

    /*清空搜索条件*/
    var clear_search = $('.clear-search');
    clear_search.unbind();
    clear_search.on('click',function(){
        var status = ROW.o_status;
        ROW = {};
        ROW.o_status = status;
        skey.val('');
        //$('input[name=routes_info_combo]').val('');
        Ext.getCmp('org_name_id').setValue('全部单位');
        Products_OrgCombo.box.setValue('')
        $('input[name=search_start_time]').val('');
        $('input[name=search_end_time]').val('');
        $('input[name=time_type_combo-inputEl]').val('');
        $('input[name=city_info_combo]').val('');
        $('input[name=agency_info_combo]').val('');
        $('input[name=applicant_info_combo]').val('');
        $('input[name=type_info_combo]').val('');
        $('input[name=custom_info_combo]').val('');
    })
    function getFormValues(){
        ROW.org_name_id=Ext.getCmp('org_name_id').getValue();
        ROW.o_product_id =  Products_OrgCombo.box.getValue();
        var start_time = $('input[name=search_start_time]').val();
        ROW.start_time = start_time;
        var end_time = $('input[name=search_end_time]').val();
        ROW.end_time = end_time;
        var timeType = $('input[name=time_type_combo-inputEl]').val();
        ROW.timeType = timeType;
        var route_type = $('input[name=route_type_info_combo]').val();
        ROW.o_product_series = route_type;
        var city_info = $('input[name=city_info_combo]').val();
        ROW.o_sorg_city = city_info;
        var org_info = $('input[name=agency_info_combo]').val();
        ROW.o_sorg_name = org_info;
        var o_name = $('input[name=applicant_info_combo]').val();
        ROW.o_name = o_name;
        var o_type = $('input[name=type_info_combo]').val();
        ROW.o_type = o_type;
        var o_service_name = $('input[name=custom_info_combo]').val();
        ROW.o_service_name = o_service_name;
        /*var sVal = skey.val();
        ROW.keylike = sVal?sVal:'';*/
    }
    function getThisData(val){
        if(val != '所有订单'){
            SUNLINE.baseParams(store,{o_status:val});
        }else{
            SUNLINE.baseParams(store);
        }
        store.currentPage = 1;
        store.load();
    }

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
    })
    /***************************************************/
    window.changeSeat=function(val){
        seat_adjust(val);
    }

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
                data.push(item);
            });
        });
        seat_store_item.loadData(data);
    });
    var seat_tpl = new Ext.XTemplate(
        seat_adjust_msg+
        '<div class="data_seat">',
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
        simpleSelect:true,
        overCls:'x-view-over',
        selectedItemCls:'x-view-selected',
        itemSelector:'div.thumb-wrap-seat',
        emptyText: '没有座位信息',
        plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });

    var seat_win = new Ext.Window({
        title:"座位调整",
        width:400,
        height:400,
        autoScroll: true,
        closeAction:'hide',
        items: seat_view,
        buttons:[
            {text:'调整',handler:ajax_adjust},
            {text:'关闭',handler:function(){ seat_win.hide(); }}
        ]
    });

    seat_win.on("show",function(){
        var pop=od_data.o_people_num;
        seat_win.setTitle('调整游客座位表:<font color="red"><b>'+pop+'人</b></font>');
        seat_store.load({
            params:{
                bus_list:od_data.o_bl_id,
                p_id:od_data.o_product_id,
                type:"order",
                o_num_id:od_data.o_number
                /*start_date:od_data.o_start_date*/
            }
        });
    });
    function seat_adjust(values){
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
                        seat_win.hide();
                    };
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '数据提交失败');
                }
            })
        });
    }
    /*******************************座位调整结束******************************************/

    /*******************************价格调整开始***********************************************/
    window.changePrice=function(val){
        getOrderData(val);
    }
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
                    data.o_favourable_money=0;
                    _form.reset();
                    _form.setValues(data);
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
    var price_form = Ext.create("Ext.form.Panel", {
        width: 350,
        margin:20,
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 80,
            width: 300,
            labelAlign: "left"
        },
        items: [
            { xtype: "textfield", id:"o_number",name: "o_number", fieldLabel: "订单编号",readOnly:true},
            { xtype: "textfield", id:"o_settle_money",name: "o_settle_money", fieldLabel: "结算金额",readOnly:true},
            { xtype: "textfield", id:"o_settle_real",name: "o_settle_real", fieldLabel: "实际结算金额",readOnly:true},
            { xtype: "numberfield", id: "o_favourable_money",name: "o_favourable_money", fieldLabel: "<span style = 'color:red'>*</span>优惠金额", decimalPrecision: 2,
                listeners:{
                'change':function(){
                    var o_settle_money = Ext.getCmp('o_settle_money').getValue();
                    var o_favourable_money = Ext.getCmp('o_favourable_money').getValue();
                    if(o_favourable_money == '' || o_favourable_money == null){
                        o_favourable_money = 0;
                    }
                    var o_settle_real = parseFloat(o_settle_money) - parseFloat(o_favourable_money) ;
                    Ext.getCmp('o_settle_real').setValue(o_settle_real);
                }}
            },
            {id:'op_remark',name:'op_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ]
    });
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
            {text:'确认',handler:submit},
            {text:'关闭',handler:function(){
                price_win.hide();
            }}
        ]
    });

    function submit(){
        var o_number = Ext.getCmp('o_number').getValue();
        var o_favourable_money = Ext.getCmp('o_favourable_money').getValue();
        var op_remark=Ext.getCmp('op_remark').getValue();
        if(o_favourable_money == null){
            Ext.Msg.alert('温馨提示','金额调整不能空');
            return false;
        }
        Ext.Ajax.request({
            url:$__app__ + '/OrderAdmin/changeMoney',
            params:{o_number:o_number,o_favourable_money:o_favourable_money,op_remark:op_remark},
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    Ext.Msg.alert("友情提示",msg);
                    price_win.hide();
                    store.reload();
                }else{
                    Ext.Msg.alert("友情提示",msg);
                };
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '数据提交失败');
            }
        })
    }

    /*******************************价格调整结束**************************************************/
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
    $(window).resize(function() {
        order_panel.setWidth();
        order_panel.setHeight();
    })
})



