/**
 * Created by Johony on 16-2-25.
 */
var usInfo = {};//存储查询条件
var SiteInfo=[];
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/OrderBus/ticket_bus_deal',[],{sortInfo:{field:'ob_type',direction: "ASC"},groupField:'goto_type'},true);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' {name:this.format_keyword}: (共 {rows:this.values_rows} 人)',{
            format_keyword:function(name){
                if(name=='返程'){
                    return '<font color="blue">返程票务</font>';
                }else{
                    return '<font color="blue">去程票务</font>';
                }
            },
            values_rows:function(row){
                var pop=0;
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        pop+=rw.pop_num;
                    });
                }
                return pop;
            }
        }],
        startCollapsed:false,
        collapsible:false
    });
    store.sort('ob_type', 'ASC');
    function bus_number_fn(v,c,r){
        if(!v)return '<span class="red-cls span_not_check">未知</span>';
        return '<font color="green"><b>'+v+'</b></font>';
    }

    function start_site_fn(v,c,r){
        if(r.get('start_time'))return v+'('+r.get('start_time')+')';
        return v;
    }

    function end_site_fn(v,c,r){
        if(r.get('end_time'))return v+'('+r.get('end_time')+')';
        return v;
    }

    function ob_stocks_fn(v,c,r){
        if(r.get('stocks_id')>0)return '<span class="blue-cls">库存票</span>';
        if(r.get('tbd_id')>0)return '<span class="blue-cls">库存短程</span>';
        if(r.get('depute_uid')>0)return '<span class="green-cls">委托:'+r.get('depute_uname')+'</span>';
        return '普通';
    }

    var cm = [
        {header:'出发日期',dataIndex:'start_date_fn',align:'center',width:80},
        {header:'类型',dataIndex:'goto_type',width:60,hidden:true},
        {header:'类型',dataIndex:'ob_type',width:65},
        {header:'人数',dataIndex:'pop_num',align:'center',width:60},
        {header:'航班(次)',dataIndex:'bus_number',align:'left',width:80,renderer:bus_number_fn},
        {header:'出发地',dataIndex:'start_site',align:'left',width:150,renderer:start_site_fn},
        {header:'目的地',dataIndex:'end_site',align:'left',width:150,renderer:end_site_fn},
        {header:'票务类型',dataIndex:'ob_stocks_id',align:'left',width:100,renderer:ob_stocks_fn}
    ];

    var grid = Ext.create('Ext.grid.Panel',{
        region:'west',
        features: [groupfeatures],
        store:store,
        columns:cm,
        width:710,
        cls:'check-no-cls',
        style:'border-top:2px solid #009DDA',
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
           '<b>航班(次)信息汇总:</b>',
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '订单号、游客信息、航班号、、团队编号',
                width:280,
                onTriggerClick:function(e){
                    planeSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            planeSearch();
                    }
                }
            }
        ]
    });

    window_load();
    function window_load(){
        if(!o_number)return '';
        Ext.getCmp('pl_Search').setValue(o_number);
        planeSearch();
    }

    function selectInfo(){
        var post=where_select();
        SUNLINE.baseParams(store,post);
        store.load();
    };


    //右则操作 (start)
    var ri_store = SUNLINE.GroupingStore($__app__+'/OrderBus/ticket_seat_detail',[],{groupField:'s_o_number'},false);
    var ri_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' <div>{name} {rows:this.service_name}  {[values.rows.length]}人 <span class="grid_group_cls" onclick="OrderDetail(\'{name}\')">查看详情>></span></div>{rows:this.data_rows}',{
            service_name:function(row){
                var service_name='';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.service_name){
                            service_name='(客服：'+rw.service_name+')';
                            return false;
                        }
                    });
                }
                return service_name;
            },
            data_rows:function(row){
                var remark='';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.o_remark){
                            remark='<div class="remark_cls" style="font-size: 12px;color:#999;font-weight: 100">备注:'+rw.o_remark+'</div>'
                            return false;
                        }
                    });
                }
                return remark;
            }
        }],
        startCollapsed:false,
        collapsible:false
    });
    function ob_status_fn(v,c,r){
        if(!v)return '<font color="red" class="span_not_check">未知</font>';
        return v;
    }
    function s_vip_card_fn(v,c,r){
        if(r.get('s_vip_card_type')!='身份证')return v+'('+ r.get('s_vip_card_type')+')';
        return v;
    }

    function ob_depute_fn(v,c,r){
        if(r.get('ob_stocks_id')>0)return '<span class="blue-cls">库存票</span>';
        if(r.get('ob_tbd_id')>0)return '<span class="blue-cls">库存短程</span>';
        if(r.get('ob_depute_uid')>0)return '<span class="green-cls">委托:'+r.get('ob_depute_uname')+'</span>';
        return '普通';
    }
    function vip_age_fn(v,c,r){
        var row= r.data;
        if(!v)return '<span title="非身份证:'+ row.s_vip_card +'('+row.s_vip_card_type+')">未知</span>';
        if(v<12 && v>3)return '<span style="color: #008000;font-weight: bold" title="儿童">'+v+'</span>';
        if(v<3)return '<span style="color: red;font-weight: bold" title="婴儿">'+v+'</span>';
        return v;
    }
    var ri_cm = [
        {header:'座位ID',dataIndex:'s_id',hidden:true},
        {header:'交通ID',dataIndex:'ob_id',width:80,hidden:true},
        {header:'游客姓名',dataIndex:'s_vip_name',width:80},
        {header:'游客证件号',dataIndex:'s_vip_card',width:200,renderer:s_vip_card_fn},
        {header:'年龄',dataIndex:'s_vip_age',width:60,align:'center',renderer:vip_age_fn},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:50,hidden:true},
        {header:'航班(次)',dataIndex:'ob_bus_number',width:100,renderer:ob_status_fn},
        {header:'票务类型',dataIndex:'ob_stocks_id',align:'left',width:100,renderer:ob_depute_fn},
        {header:'票种类型',dataIndex:'s_ticket_type',width:100,renderer:ob_status_fn}
    ];
    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:ri_store,
        features: [ri_groupfeatures],
        selModel:{
            selType: 'checkboxmodel'
        },
        viewConfig:{
            emptyText:'没有符合你要查找的内容',
            enableTextSelection:true
        },
        columns:ri_cm,
        fixed:true,
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'撤销委托',iconCls:'button-drop',id:'depute_del_id',handler:depute_del},'-',
            {text:'委托出票',iconCls:'button-tq',id:'depute_id',handler:depute_win_fn},'-',
            {text:'处理库存',iconCls:'re-back',id:'stocks_id',handler:stocks_ticket_fn},'-',
            {text:'生成票务订单',iconCls:'button-edit',id:'form_order_id',handler:form_order_fn}
        ]
    });

    //排除不可选中的复选框
    ri_grid.on({
        headerclick:function(c,co,e,t,e){
            setTimeout(function(){
                var i=0;
                ri_store.each(function(v){
                    var row= v.data;
                    if(!row.ob_bus_number){
                        ri_grid.getSelectionModel().deselect(i,true);
                        console.log(i);
                    }
                    i++;
                });
            },200);
        }
    });
    ri_grid.on({
        select:function(c,r){
            var row= r.data;
            if(!row.ob_bus_number)ri_grid.getSelectionModel().deselect(r,true);
            //判断委托权限
            if(row.ob_depute_uid>0){
                Ext.getCmp('depute_del_id').setDisabled(false);
                Ext.getCmp('depute_id').setDisabled(true);
            }else{
                Ext.getCmp('depute_del_id').setDisabled(true);
                Ext.getCmp('depute_id').setDisabled(false);
            }
            //判断处理库存票权限
            Ext.getCmp('stocks_id').setDisabled(true);
            Ext.getCmp('form_order_id').setDisabled(false);
            if(row.ob_stocks_id>0 && row.ob_type!='飞机'){
                Ext.getCmp('stocks_id').setDisabled(false);
                Ext.getCmp('form_order_id').setDisabled(true);
                Ext.getCmp('depute_del_id').setDisabled(true);
                Ext.getCmp('depute_id').setDisabled(true);
            }
        }
    });
    //右则操作 (end)


    /*****    顶部搜索区域(start)     *****/
    //票种类型Box
    var goto_type_box=SUNLINE.LocalComob({
        id:'goto_type',
        fields:['goto_type'],
        data:[['去程'],['返程'],['全部']],
        config:{
            fieldLabel:'往返类型',
            labelWidth:60,
            width:160,
            value:'全部'
        }
    });

    //票种类型Box
    var plan_status_box=SUNLINE.LocalComob({
        id:'fly_type',
        fields:['fly_type'],
        data:[['全部'],['火车'],['飞机']],
        config:{
            fieldLabel:'交通类型',
            labelWidth:60,
            width:150,
            value:'全部'
        }
    });

    var start_time=SUNLINE.ExtDateField({
        id:'site_start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date()
    });
    var hidden_type=true,c_worg_id=_uinfo.org_id;
    if(_uinfo.org_type=='管理公司' && _uinfo.org_pid==0){
        hidden_type=false
        c_worg_id='';
    }

    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[grid,ri_grid],
        tbar:[
            {xtype:'textfield',fieldLabel:'分公司',labelWidth:50,emptyText:'全部分公司',text:'选择分公司',id:'tm_worg_txt',to_id:'tm_worg_id',width:150,hidden:hidden_type},
            {xtype:'hidden',emptyText:'全部分公司ID',id:'tm_worg_id',value:c_worg_id},
            '-',
            plan_status_box,
            '-',
            '始发站:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'site_start_id',to_id:'start_id',width:80},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'start_id'},
            '-',
            '目的地:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'site_end_id',to_id:'end_id',width:80},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'end_id'},
            '-',
            goto_type_box,
            '-',
            '出发日期',
            start_time,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){parent.CloseTab()}}
        ]
    });

    //选择订单来源单位
    var CarNameBox=SUNLINE.CompanyBox({
        where:{
            org_type:'管理公司'
        },
        config:{
            displayField:'text',
            valueField:'text',
            id:'worg_name',
            name:'worg_name',
            labelWidth:60,
            width:280,
            labelAlign:'right',
            fieldLabel:'管理公司'
        }
    });

    //选择委托用户
    var ob_depute_uname=SUNLINE.CompanyBox({
        fields:['u_id','u_mob','u_zname'],url:$__app__ + '/Users/dataJson',
        where:{
            us_orgid:-1
        },
        config:{
            displayField:'u_zname',
            valueField:'u_zname',
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_zname} - {u_mob}</li>',
                '</tpl></ul>'
            ),
            id:'ob_depute_uname',
            name:'ob_depute_uname',
            labelWidth:60,
            width:280,
            allowBlank:false,
            labelAlign:'right',
            fieldLabel:'委托用户'
        }
    });

    //处理委托业务 (start)
    var form_depute = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:[
            {id:"bus_id",name:"bus_id",fieldLabel:"大交通ID",hidden:true},
            {id:"ob_start_date",name:"ob_start_date",fieldLabel:"出发日期",readOnly:true},
            {id:"worg_id",name:"worg_id",fieldLabel:"委托单位ID",hidden:true},
            {id:"ob_depute_uid",name:"ob_depute_uid",fieldLabel:"委托人ID",hidden:true},
            CarNameBox,
            ob_depute_uname
        ]
    });

    CarNameBox.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('worg_id').setValue(row.id);
            ob_depute_uname.setValue('');
            Ext.getCmp('ob_depute_uid').setValue('');
        }
    });

    ob_depute_uname.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('ob_depute_uid').setValue(row.get('u_id'));
        }
    });

    ob_depute_uname.on({
        beforequery:function(c,r){
            var corg_id=Ext.getCmp('worg_id').getValue();
            SUNLINE.baseParams(ob_depute_uname.store,{us_orgid:corg_id});
            ob_depute_uname.store.load();
        }
    });

    var depute_win = new Ext.Window({
        title:"委托出票",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: form_depute,
        buttons:[
            {text:'确认委托',handler:confirm_depute},
            {text:'关闭',handler:function(){ depute_win.hide(); }}
        ]
    });

    function depute_win_fn(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        var start_date=vip_data.start_date;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要委托的游客信息!');
            return false;
        }
        depute_win.show();
        var _form=form_depute.getForm();
        var form_post={
            bus_id:bus_id,
            ob_start_date:int2date(start_date)
        };
        _form.setValues(form_post);
    }

    /**
     * 获取游客大交通数据(多选操作)
     * @returns {{bus_id: Array, start_date: string}}
     */
    function select_vip_data(){
        var rows=ri_grid.getSelectionModel().getSelection();
        var bus_id=[],start_date='',bus_data='';
        Ext.each(rows,function(v,i){
            var row= v.data;
            bus_id.push(row.ob_id);
            start_date=row.ob_start_date;
            if(!bus_data){
                bus_data={
                    ob_start_site:row.ob_start_site,
                    ob_start_code:row.ob_start_code,
                    ob_site_sid:row.ob_site_sid,
                    ob_start_time:row.ob_start_time,
                    ob_site_eid:row.ob_site_eid,
                    ob_end_site:row.ob_end_site,
                    ob_end_code:row.ob_end_code,
                    ob_city_start:row.ob_city_start,
                    ob_city_end:row.ob_city_end
                }
            }
        })
        return {bus_id:bus_id,start_date:start_date,bus_data:bus_data}
    }

    //确认委托
    function confirm_depute(t){
        var _form=form_depute.getForm();
        if(!_form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var form_post=_form.getValues();
        Ext.MessageBox.confirm('友情提示','你确认需要委托游客吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/depute_user_save',
                params: form_post,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        depute_win.hide();
                        store.reload();
                    }
                    myMask.hide();
                }
            })
        });
    }

    //撤销委托
    function depute_del(t){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要撤销委托的游客信息!');
            return false;
        };
        Ext.MessageBox.confirm('友情提示','你确认需要委托游客吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/depute_user_del',
                params: {bus_id:Ext.encode(bus_id)},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){ store.reload(); }
                    myMask.hide();
                }
            })
        });
    }

    //委托出票业务操作 (end)

    //票务订单的创建生成 (start)
    var BusNameBox=SUNLINE.CompanyBox({
        where:{
            org_type:'票务公司'
        },
        config:{
            displayField:'text',
            valueField:'text',
            id:'to_torg_name',
            name:'to_torg_name',
            labelWidth:60,
            width:280,
            labelAlign:'right',
            allowBlank:false,
            fieldLabel:'票务公司'
        }
    });
    var form_order = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:[
            {id:"to_bus_id",name:"to_bus_id",fieldLabel:"大交通ID",hidden:true},
            {id:"to_start_date",name:"to_start_date",fieldLabel:"出发日期",readOnly:true},
            {id:"to_torg_id",name:"to_torg_id",fieldLabel:"委托单位ID",hidden:true},
            {id:"to_poundage",name:"to_poundage",fieldLabel:"手续费",hidden:true},
            BusNameBox,
            {id:'to_remark',name:'to_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ]
    });

    BusNameBox.on({
        select:function(c,r){
            var row=r[0];
            row=row.data;
            Ext.getCmp('to_torg_id').setValue(row.id);
            Ext.getCmp('to_poundage').setValue(row.org_procedure);
        }
    });

    var create_win = new Ext.Window({
        title:"生成票务订单",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: form_order,
        buttons:[
            {text:'确认生成',handler:confirm_create},
            {text:'关闭',handler:function(){ create_win.hide(); }}
        ]
    });

    function form_order_fn(t){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        var start_date=vip_data.start_date;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要生成票务订单的游客信息!');
            return false;
        }
        create_win.show();
        var _form_order=form_order.getForm();
        _form_order.reset();
        var form_post={
            to_bus_id:bus_id,
            to_start_date:int2date(start_date)
        };
        _form_order.setValues(form_post);
    };
    //确认生成票务订单
    function confirm_create(){
        var _form_order=form_order.getForm();
        if(!_form_order.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var form_post=_form_order.getValues();
        Ext.MessageBox.confirm('友情提示','你确认生成票务订单吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/create_train',
                params: form_post,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        create_win.hide();
                        store.reload();
                        ri_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    }
    //票务订单的创建生成 (end)

    //处理库存票业务 (start)
    var BusBox=SUNLINE.CompanyBox({
        where:{
            org_type:'票务公司'
        },
        config:{
            displayField:'text',
            valueField:'text',
            id:'ob_torg_name',
            name:'to_torg_name',
            labelWidth:60,
            width:280,
            labelAlign:'right',
            allowBlank:false,
            fieldLabel:'票务公司'
        }
    });

    var form_stocks = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:[
            {id:"bus_id_id",name:"bus_id",fieldLabel:"交通ID",hidden:true},
            {id:"ob_type",name:"ob_type",fieldLabel:"交通类型",hidden:true},
            {id:"ob_start_date",name:"ob_start_date",fieldLabel:"票务日期",hidden:true},
            {id:"ob_number",name:"ob_number",fieldLabel:"班次号"},
            {id:"start_site",name:"start_site",fieldLabel:"始发站"},
            {id:"end_site",name:"end_site",fieldLabel:"目的地"},
            {id:"ob_start_time",name:"ob_start_time",fieldLabel:"出发时间"},
            {id:"ob_end_time",name:"ob_end_time",fieldLabel:"抵达时间"},
            {id:"ob_torg_id",name:"to_torg_id",fieldLabel:"委托单位ID",hidden:true},
            {id:"ob_poundage",name:"to_poundage",fieldLabel:"手续费",hidden:true},
            BusBox,
            {id:'ob_remark',name:'to_remark',fieldLabel:'备注',xtype:'textarea',height:50}
        ]
    });

    BusBox.on({
        select:function(c,r){
            var row=r[0];
            row=row.data;
            Ext.getCmp('ob_torg_id').setValue(row.id);
            Ext.getCmp('ob_poundage').setValue(row.org_procedure);
        }
    });
    var stocks_win = new Ext.Window({
        title:"处理库存短程票",
        width:330,
        autoScroll: true,
        resizable:false,
        modal:true,
        closeAction:'hide',
        items: form_stocks,
        buttons:[
            {text:'确认生成',handler:confirm_stocks},
            {text:'关闭',handler:function(){ stocks_win.hide(); }}
        ]
    });

    function stocks_ticket_fn(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        var start_date=vip_data.start_date;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要生成库存短程票的游客!');
            return false;
        }
        var bus_data=vip_data.bus_data;
        stocks_win.show();
        var _form_stocks=form_stocks.getForm();
        _form_stocks.reset();
        var form_post={
            ob_type:'火车',
            bus_id:bus_id,
            ob_start_date:start_date,
            start_site:bus_data.ob_start_site
        };
        _form_stocks.setValues(form_post);
    }

    var fly_grid=ITEMS_YUN.FlySelect({site:'yes'});
    var fly_win = new Ext.Window({
        title:"在线选择航班(次)信息",
        width:1000,
        height:525,
        resizable:false,
        modal:true,
        closeAction:'hide',
        items: fly_grid.grid,
        buttons:[
            {text:'确认选择',handler:confirm_fly},
            {text:'关闭',handler:function(){ stocks_win.hide(); }}
        ]
    });

    //在线选择班次数据
    Ext.getCmp('ob_number').on({
        focus:function(t,e,o){
            fly_win.show();
        }
    });

    function confirm_fly(t){
        var rows=SUNLINE.getSelected(fly_grid.grid);
        if(!rows){
            Ext.Msg.alert('友情提示','请选择需要选择的班次信息！');
            return false;
        }
        var start_site=Ext.getCmp('start_site_id_id').getValue();
        var end_site=Ext.getCmp('end_site_id_id').getValue();
        rows=rows.data;
        var _form_stocks=form_stocks.getForm();
        var form_post={
            ob_number:rows.fl_number,
            ob_start_time:rows.fl_start_time,
            ob_end_time:rows.fl_end_time,
            start_site:start_site,
            end_site:end_site
        };
        _form_stocks.setValues(form_post);
        fly_win.hide();
    }

    function confirm_stocks(){
        var _form_stocks=form_stocks.getForm();
        if(!_form_stocks.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var form_post=_form_stocks.getValues();
        Ext.MessageBox.confirm('友情提示','你确认生成票务订单吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/save_stock_order',
                params: form_post,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        stocks_win.hide();
                        store.reload();
                    }
                    myMask.hide();
                }
            })
        });
    }

    //处理库存票业务 (end)

    //筛选条件部分
    var trans_store = new SUNLINE.JsonStore($__app__+'/TransPlan/select_combox', [],false);
    var trans_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"id", width:80,hidden:true},
        {header:"名称", dataIndex:"text", width:300}
    ];
    var trans_grid=new Ext.grid.GridPanel({
        region:'center',
        store:trans_store,
        columns:trans_cm,
        autoScroll:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        height:520,
        tbar:[
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'trans_Search',
                cls:'search-icon-cls',
                emptyText : '信息名称',
                width:280,
                onTriggerClick:function(e){
                    trans_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            trans_search();
                    }
                }
            }
        ]
    });

    var trans_win = new Ext.Window({
        width : 400,
        height : 600,
        modal : true,
        fixed:true,
        closeAction : 'hide',
        items:trans_grid,
        buttons:[
            {text:'确认选择',handler:trans_vf_fn},
            {text:'关闭', handler:function () {
                trans_win.hide();
            }}
        ]
    });

    function trans_search(){
        var keys=Ext.getCmp('trans_Search').getValue();
        SUNLINE.baseParams(trans_store,{skey:keys},true);
        trans_store.load();
    }

    var select_id='';
    var select_name='';
    var select_row=['tm_worg_txt','site_start_id','site_end_id'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                var post={type:t.text};
                if(in_array(select_row[si],['site_start_id','site_end_id'])){
                    //判断是飞机还是火车
                    var plan_status_id=plan_status_box.getValue();
                    post.fly_type=plan_status_id;
                }
                SUNLINE.baseParams(trans_store,post);
                trans_store.load();
            }
        });
    }

    trans_store.on({
        load:function(){
            var row_id=Ext.getCmp(select_id).getValue();
            if(!row_id)return '';
            var i=0;
            row_id=row_id.split(',');
            this.each(function(v){
                var rows= v.data;
                if(in_array(rows['id'],row_id)!=-1){
                    trans_grid.getSelectionModel().select(i, true);
                }
                i++;
            })
        }
    });

    function trans_vf_fn(){
        var rows=trans_grid.getSelectionModel().getSelection();
        var sl_id=[];
        var sl_name=[];
        Ext.each(rows,function(v,i){
            var row= v.data;
            if(v.id && row.text!='全部')sl_id.push(row.id);
            sl_name.push(row.text);
        });
        Ext.getCmp(select_id).setValue(sl_id);
        Ext.getCmp(select_name).setValue(sl_name);
        trans_win.hide();
    }

    grid.on('select',function(v,i,d,r){
        setTimeout(function(){
            var bus_id=grid_bus_id();
            var post={bus_id:Ext.encode(bus_id)}
            SUNLINE.baseParams(ri_store,post);
            ri_store.load();
        },200);
    });
    //获取或则操作数据
    function grid_bus_id(){
        var rows=grid.getSelectionModel().getSelection();
        var bus_id=[],bus_type='';
        Ext.each(rows,function(v,i){
            var row= v.data;
            //1.当数量大于2时，存在未知的，需要取消未知的
            if(rows.length>1 && !row.bus_number){
                grid.getSelectionModel().deselect(v,true);
            }else{
                //2.当选择时存在库存票与普通票时，去那前面选择项目
                var bus_r='普通';
                if(row.stocks_id>0) bus_r='库存';
                if(row.depute_uid>0)bus_r='委托';
                if(bus_type!=bus_r && bus_type){
                    grid.getSelectionModel().deselect(v,true);
                    Ext.Msg.alert('友情提示','【普通】票务、【库存票】票务、【委托】票务不能同时选择!');
                }else{
                    bus_type=bus_r;
                    if(bus_id.length>0){
                        bus_id=bus_id.concat(row.bus_id);
                    }else{
                        bus_id=row.bus_id;
                    }
                }
            }
        });
        return bus_id;
    }

    function where_select(){
        var goto_type=goto_type_box.getValue();
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        if(goto_type=='全部')goto_type='';
        var post_where={goto_type:goto_type,start_date:start_date};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var start_id=Ext.getCmp('start_id').getValue();
        var end_id=Ext.getCmp('end_id').getValue();
        var status_id=plan_status_box.getValue();
        var skeys=Ext.getCmp('pl_Search').getValue();

        if(tm_worg_id)post_where['worg_id']=tm_worg_id;
        if(start_id)post_where['start_site']=start_id;
        if(end_id)post_where['end_site']=end_id;
        if(status_id)post_where['status_id']=status_id;
        if(skeys)post_where['skeys']=skeys;
        return post_where;
    }

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{skeys:key},true);
        store.load();
    };


    window.OrderDetail=function(number){
        parent.OpenTab('订单详情'+number, 'OrderDetail'+number, '', $__app__+'/OrderDetail/index/id/'+number, 1);
    };

    //禁操作项目
    store.on({
        load:function(){
            check_hide();
        }
    });
    ri_store.on({
        load:function(){
            check_hide();
        }
    });

    function check_hide(){
        var span_not_plan=$('.span_not_check');
        for(var si=0;si<span_not_plan.length;si++){
            var si_id=span_not_plan.eq(si);
            var sid_id=si_id.parents('.x-grid-row');
            sid_id.find('.x-grid-cell-row-checker .x-grid-cell-inner').remove();
        }
    }

    //ziyo_log({ listeners : [{grid: grid, action:'TransPlan', pk_id:'tp_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
})