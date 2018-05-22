var ROW = {};
GUIDE_WORK = {};
var WG={};
//setReadOnly
Ext.onReady(function () {
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
     * 头部搜索的时间插件
     * @type {*}
     */
    var start_time=SUNLINE.ExtDateField({
        id:'search_start_time',
        name:'ob_start_date',
        labelAlign:"right",
        fieldLabel:"出发日期",
        labelWidth:60,
        height:30,
        width:165,
        allowBlank:true,
        renderTo:'start_time',
        labelSeparator:''
    });
    //票种类型Box
    var fly_type=new Ext.form.ComboBox({
        id:"time_type_combo",
        width:130,
        allowBlank:true,
        store:new Ext.data.SimpleStore({fields:['time_type'], data:[
            ['全部'],['火车'],['高铁'],['飞机']
        ]}),
        value:'全部',
        triggerAction:"all",
        editable:false,
        valueField:"time_type",
        displayField:"time_type",
        mode:"local",
        fieldLabel:"交通方式",
        labelWidth:60,
        renderTo:'fly_type'
    });
    //出发口岸
    var Sation_OrgCombo=SUNLINE.OrgCombo_Sation({
        listConfig:{minWidth:340},
        id:'f_traffic_start',
        name:'f_traffic_start',
        allowBlank:true,
        listWidth:250,
        editable:true,
        fieldLabel:"出发口岸",
        forceSelection:true,
        renderTo:'start_station'
    });
    function station_type(b){
        var start_store=Sation_OrgCombo.box.getStore();
        if(b!='全部'){
            if(b[0]['data']['time_type']=='火车'){
                SUNLINE.baseParams(start_store,{sd_start_type:'火车'});
            }else if(b[0]['data']['time_type']=='飞机'){
                SUNLINE.baseParams(start_store,{sd_start_type:'飞机'});
            }
        }
        start_store.currentPage=1;
        start_store.load();
    }
    Ext.getCmp('time_type_combo').on('select',function(a,b,c){
        station_type(b);
    })
    station_type('全部');
    //送机人
    var delivery_man=SUNLINE.Delivery_man({
        listConfig:{minWidth:340},
        id:'delivery_man',
        name:'ob_delivery_man',
        allowBlank:true,
        listWidth:250,
        labelWidth:60,
        editable:true,
        fieldLabel:"送机人",
        forceSelection:true,
        renderTo:'delivery_man'
    });
    var delivery_man_store=delivery_man.box.getStore();
    delivery_man_store.on('load',function(){
        this.add({ob_delivery_man:'全部送机人'});
    })
    //送站人
    var price_form = Ext.create("Ext.form.Panel", {
        width: 350,
        margin:20,
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 60,
            width: 300,
            labelAlign: "left"
        },
        items: [
            { xtype: "textfield",name: "ob_delivery_man", fieldLabel: "送站人",emptyText:'例如:方金喜18758151667',allowBlank:false}
        ]
    });
    var price_win=new Ext.Window({
        title:"送站人",
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
    price_win.on('hide',function(){
        price_form.form.reset();
    })
    function trf_id(){
        var role=[];
        $('input:checkbox').each(function(a) {
            var data=$(this)
            if (data[0].checked ==true) {
                var start_tion={};
                start_tion['ob_bus_number']=$(this).val();
                start_tion['ob_start_site']=$(this).attr('start_station');
                role.push(start_tion);
            }
        });
        return role;
    }
    function submit(){
        if(!price_form.form.isValid()){
            Ext.Msg.alert('友情提示','请填写送机人信息');
            return false;
        }
        var data= price_form.getForm().getValues();
        data['date']=Ext.encode(trf_id());
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/send_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    search();
                    price_win.hide();
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    var send_man = $('.send_man');
    send_man.click(function(){
        var role=[];
        var man='';
        $('input:checkbox').each(function(a) {
            var data=$(this)
            if (data[0].checked ==true) {
                var start_tion={};
                start_tion['ob_bus_number']=$(this).val();
                start_tion['ob_start_site']=$(this).attr('start_station');
                role.push(start_tion);
                if($(this).attr('send_man_name'))man+=$(this).attr('send_man_name');
            }
        });

        if(role.length == 0){
            Ext.Msg.alert('友情提示','请您选择游客');
            return false;
        }
        price_win.show();
        if(man!='null'){
            Ext.Msg.alert('友情提示','请您的游客已有送站人，继续编辑将会<span style="color:red;font-size:14px;">覆盖</span>原先送站人');
        }

    });
    function send_where(){
        var where={};
        var org_id=Ext.getCmp('org_name_id').getValue();
        var search_start_time=Ext.getCmp('search_start_time').getRawValue();
        var time_type_combo=Ext.getCmp('time_type_combo').getValue();
        var f_traffic_start=Ext.getCmp('f_traffic_start').getValue();
        var delivery_man=Ext.getCmp('delivery_man').getValue();
        var skey=$('.seach_val').val();;
        if(org_id)where['ob_org_id']=org_id;
        if(search_start_time)where['ob_start_date']=search_start_time;
        if(time_type_combo)where['ob_type']=time_type_combo;
        if(f_traffic_start)where['ob_start_site']=f_traffic_start;
        if(delivery_man)where['ob_delivery_man']=delivery_man;
        if(skey)where['skey']=skey;
        return where;
    }

    function search(){
        var data=send_where();
        $.ajax({
            type:"POST",
            url:$__app__ + "/OrderBus/send_station",
            data:data,
            success:function (r) {
                var rst = Ext.decode(r);
                var str='<tbody>'+
                    '<tr>'+
                    '<th width="105">游客姓名</th>'+
                    '<th width="205">身份证</th>'+
                    '<th width="145">手机号</th>'+
                    '<th width="105">持票人</th>'+
                    '<th width="205">订单号</th>'+
                    '<th></th>'+
                    '</tr>'+
                    '</tbody>';

                $.each(rst,function(e2,ev2){
                    str+=' <tr>'+
                        '<td colspan="6" class="title_td">'+
                        ' <input type="checkbox" class="form_id" value="'+ev2.ob_bus_number+'" start_station="'+ev2.ob_start_code+'" send_man="'+ev2.ob_end_code+'" send_man_name="'+ev2.ob_delivery_man+'"  >'+
                        ' <span class="fa_click_cl"><i class="fa fa-folder-o "></i></span>  '+
                        '<span style="display:inline-block;width:30px;text-align:center;color:blue">'+ev2.ob_bus_number+'</span>'+
                        '<span style="display:inline-block;width:240px;text-align:center;color:#04C624"> ['+ev2.ob_start_time+' -- '+ev2.ob_end_time+' ] </span>'+
                        '<span style="display:inline-block;width:220px;text-align:left;color:#AE0FCD"> [ '+ev2.ob_start_site+' -- '+ev2.ob_end_site+' ] </span>'+
                        '<span style="display:inline-block;width:40px;text-align:left;color:#D3880B">'+ev2.num+' 人</span>';
                        if(ev2.ob_delivery_man){
                            str+='<span style="display:inline-block;width:180px;text-align:left;color:#0f9721">  '+ev2.ob_delivery_man;
                        }else{
                            str+='<span style="display:inline-block;width:180px;text-align:left;color:#999">  '+'暂无安排';
                        }
                        str+='</span>'+
                            '</td>'+
                            '</tr>';
                    //var info = ev2;
                    str+='<tbody class="td_click">';
                    $.each(ev2.data,function(e3,ev3){
                        str+='<tr>'+
                            '<td class="one-td">'+ev3['s_vip_name']+'</td>'+
                            '<td>'+ev3['s_vip_card']+'</td>'+
                            '<td>'+ev3['s_vip_mob']+'</td>'+
                            '<td>'+ev3['ob_final_name']+'</td>'+
                            '<td><a href="'+$__app__+'/OrderDetail/index/id/'+ev3['s_o_number']+'" target = "_blank">'+ev3['s_o_number']+'</a></td>'+
                            '<td></td>'+
                            '</tr>';

                    })
                    str+='</tbody>';
                })
                $('.main-table').html(str);
                click_hide();
            }
        });
        //if(role.length == 0)alert('空数组');
    }
    $('.search').click(function(){
        search();
    })

    function click_hide(){
        var click_cl=$('.fa_click_cl');
        click_cl.unbind();
        click_cl.click(function(){
            var num=$('.fa_click_cl').index($(this));
            if($(this).find('.fa-folder-o').length>0){
                $(this).html('<i class="fa fa-folder-open-o"></i>');
                $('.td_click').eq(num).show();
            }else{
                $(this).html('<i class="fa fa-folder-o"></i>');
                $('.td_click').eq(num).hide();
            }
        });
    }
    $('.dayin').click(function(){
        var str='';
        var man='';
        $('input:checkbox').each(function(a) {
            var data=$(this)
            if (data[0].checked ==true) {
                str+=$(this).val()+'_'+$(this).attr('start_station')+'-';
            }
        });
        if(!str){
            Ext.Msg.alert('友情提示','请您选择游客');
            return false;
        }
        var search_start_time=Ext.getCmp('search_start_time').getRawValue();
        window.open($__app__+'/OrderBus/send_station_before/'+str+'/'+search_start_time,'blank');
    })
    if(now_day)Ext.getCmp('search_start_time').setRawValue(now_day);

});
