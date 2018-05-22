/**
 * Created by Johony on 16-2-25.
 */
var usInfo = {};//存储查询条件
var SiteInfo=[];
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/OrderBus/team_order_bus',[],{sortInfo:{field:'team_id',direction: "ASC"},groupField:'team_number'},false);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['','<font color="blue"> {rows:this.values_name} (团队编号：{rows:this.values_val})</font>: 共 {rows:this.values_rows} 张',{
            values_name:function(row){
                var team_name='';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.product_series){
                            team_name=rw.team_name;
                            return false;
                        }
                    });
                }
                return team_name;
            },
            values_val:function(row){
                var team_name='',team_number='',title='先去生成计划单才可快速查询!';
                if(row.length>0){
                    Ext.each(row,function(v,i){
                        var rw=v.data;
                        if(rw.s_team_id==0){
                            team_name='<font color="red">'+rw.team_number+'<font>';
                        }else{
                            var team_text='';
                            if(rw.tpi_name)team_text='<span title="全陪导游：'+rw.tpi_name+rw.tpi_tel+'">：'+rw.tpi_name+'</span>';
                            team_name=rw.team_number+team_text;
                            team_number=rw.team_num;
                            title='点击此处可以快速查询去返程';
                        }
                        return false;
                    });
                }
                return '<span class="team_num_id" onclick="TeamSreach(\''+team_number+'\')" title="'+title+'">'+team_name+'</span>';
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
        startCollapsed:false/*,
        collapsible:false*/
    });
    store.sort('ob_type', 'ASC');
    //私服种类型
    function ob_stocks_fn(v,c,r){
        if(r.get('to_stocks_id'))return '<span class="blue-cls">库存短程</span>';
        return '普通';
    }
    //时间格式
    function date_format(v,c,r){
        return int2date(v);
    }
    //金额格式
    function money_format(v,c,r){
        v=parseFloat(v);
        if(!v)v=0;
        return '￥'+ v.toFixed(2);
    }
    function bus_number_fn(v){
        if(!v)return '<font class="span_not_check">未知</font>';
        return '<font color="green">'+v+'</font>';
    };
    function start_site_fn(v,c,r){
        var start_time='',end_time='',start_platform=r.get('start_platform'),end_platform=r.get('end_platform');
        if(r.get('start_time'))start_time='('+r.get('start_time')+')';
        if(r.get('end_time'))end_time='('+r.get('end_time')+')';
        if(!start_platform)start_platform='';
        if(!end_platform)end_platform='';
        return r.get('start_site')+ start_platform+start_time+'—'+ r.get('end_site')+ end_platform+end_time;
    };
    var cm = [
        {header:'团队编号',dataIndex:'team_number',width:60,hidden:true},
        {header:'团队ID',dataIndex:'team_id',width:80,hidden:true},
        {header:'出团日期',dataIndex:'start_date_fn',width:80},
        {header:'交通',dataIndex:'ob_type',width:65},
        {header:'航班(次)',dataIndex:'bus_number',align:'left',width:80,renderer:bus_number_fn},
        {header:'站点信息',dataIndex:'start_site',align:'left',width:310,renderer:start_site_fn},
        {header:'票数',dataIndex:'pop_num',width:60,align:'center'}
    ];

    var skey_search_box=SUNLINE.LocalComob({
        id:'skey_search',
        fields:['skey_search'],
        data:[['订单号'],['游客信息'],['航班号'],['团队编号']],
        config:{
            labelWidth:60,
            width:90,
            value:'团队编号'
        }
    });

    var grid = Ext.create('Ext.grid.Panel',{
        region:'west',
        width:630,
        store:store,
        features: [groupfeatures],
        columns:cm,
        cls:'check-no-cls',
        style:'border-top:2px solid #009DDA',
        fixed:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        viewConfig:{
            emptyText:'没有符合你要查找的内容',
            enableTextSelection:true
        },
        tbar:[
            '<b>团队汇总:</b>','-',
            {text:'导出所选数据',iconCls:'button-excel',handler:download_excel},
            '->',
            '快速搜索：',
            skey_search_box,
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '订单号、游客信息、航班号、团队编号',
                width:200,
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

    //查询条件汇总
    function selectInfo(){
        var post=where_select();
        SUNLINE.baseParams(store,post);
        store.load();
    };

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
    //班次号操作
    function ob_number_fn(v,c,r){
        if(!v)return '<font class="span_not_check">未知</font>';
        return '<font color="green"><b>'+v+'</b></font>';
    }
    //身份证判断
    function s_vip_card_fn(v,c,r){
        if(r.get('s_vip_card_type')!='身份证')return v+'('+ r.get('s_vip_card_type')+')';
        return v;
    }
    //票务状态
    function ob_status_fn(v){
        if(v=='已出票')return '<font color="green"><b>'+v+'</b></font>';
        return '<font color="red"><b>'+v+'</b></font>';
    }

    function final_name_fn(v,c,r){
        if(!v)return  '<font color="red">未取</font>';
        return '<span style="color:green;cursor: pointer" title="点击可看到历史详情" onclick="order_dole_detail(\''+ r.get('ob_id')+'\')">'+v+'</span>';
    }

    function ob_stocks_fn(v,c,r){
        if(r.get('stocks_id')>0)return '<span class="blue-cls">库存票</span>';
        if(r.get('tbd_id')>0)return '<span class="blue-cls">库存短程</span>';
        if(r.get('depute_uid')>0)return '<span class="green-cls">委托:'+r.get('depute_uname')+'</span>';
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
        {header:'票务订单ID',dataIndex:'ob_toid',hidden:true},
        {header:'交通ID',dataIndex:'ob_id',width:80,hidden:true},
        {header:'游客姓名',dataIndex:'s_vip_name',width:80},
        {header:'游客证件号',dataIndex:'s_vip_card',width:180,renderer:s_vip_card_fn},
        {header:'年龄',dataIndex:'s_vip_age',width:60,align:'center',renderer:vip_age_fn},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:50,hidden:true},
        {header:'航班(次)',dataIndex:'ob_bus_number',width:80,renderer:ob_number_fn},
        {header:'票务状态',dataIndex:'ob_status',width:80,renderer:ob_status_fn},
        {header:'取票状态',dataIndex:'ob_final_name',width:80,renderer:final_name_fn},
        {header:'票种',dataIndex:'s_ticket_type',width:60},
        {header:'票务类型',dataIndex:'ob_stocks_id',width:100,renderer:ob_stocks_fn},
        {header:'票价',dataIndex:'ob_money',align:'right',width:80,renderer:money_format},
        {header:'手续费',dataIndex:'ob_price',align:'right',width:80,renderer:money_format},
        {header:'快递费',dataIndex:'ob_express_money',align:'right',width:80,renderer:money_format}
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
            {text:'确认取票',iconCls:'button-tq',handler:dole_handler_fn},'-',
            /*{text:'快递录入'},'-',*/
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},'-',
            {text:'退票',iconCls:'button-drop',handler:del_bus_fn} /*,'-',
            {text:'撤销出票'}
            ,{text:'确认出票'},'-',
            */
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
                    }
                    i++;
                });
            },200);
        }
    });
    //右则操作 (end)


    /*****    顶部搜索区域(start)     *****/
    //票种类型Box
    var goto_type_box=SUNLINE.LocalComob({
        id:'goto_type',
        fields:['goto_type'],
        data:[['去程'],['返程']],
        config:{
            fieldLabel:'往返类型',
            labelWidth:60,
            width:160,
            value:'去程'
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
        id:'start_date',
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
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'start_site_txt',to_id:'start_id',width:120},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'start_id'},
            '-',
            '目的地:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'end_site_txt',to_id:'end_id',width:120},
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

    //选择司机信息
    var final_name_box=SUNLINE.CompanyBox({
        fields:['u_id','u_mob','u_zname'],url:$__app__ + '/Users/dataJson',
        config:{
            displayField:'u_zname',
            valueField:'u_zname',
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_zname} - {u_mob}</li>',
                '</tpl></ul>'
            ),
            id:'ob_final_name',
            name:'ob_final_name',
            labelWidth:60,
            width:280,
            queryParam:'skey',
            labelAlign:'right',
            fieldLabel:'持票人'
        }
    });
    var ob_ems_org_combo=SUNLINE.DictComBox_false({fieldLabel:"快递公司",name:'ob_ems_org',id:'ob_ems_org',width:280,labelWidth:60,labelAlign:"right",forceSelection:false},{'d_type':'快递公司'});
    //确认取票业务(start)
    var dole_form = Ext.create('Ext.form.Panel',{
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
            {id:"ob_start_date",name:"start_date",fieldLabel:"出发日期",readOnly:true},
            final_name_box,
            {id:"ob_final_tel",name:"ob_final_tel",fieldLabel:"联系方式"},
            ob_ems_org_combo.box,
            {id:"ob_ems_number",name:"ob_ems_number",fieldLabel:"运单号"},
            {id:"ob_express_money",name:"ob_express_money",fieldLabel:"快递费"},
            {id:"ob_ems_msg",name:"ob_ems_msg",fieldLabel:"备注",xtype:'textarea',height:50}
        ]
    });

    var dole_win = new Ext.Window({
        title:"确认领取票务",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: dole_form,
        buttons:[
            {text:'确认领取',handler:confirm_dole},
            {text:'关闭',handler:function(){ dole_win.hide(); }}
        ]
    });

    function dole_handler_fn(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要领取的游客票务!');
            return false;
        }
        dole_win.show();
        var bus_data=vip_data.bus_data;
        var _dole_form=dole_form.getForm();
        _dole_form.reset();
        var post_data={
            bus_id:bus_id,
            start_date:int2date(bus_data.ob_start_date),
            ob_final_name:bus_data.ob_final_name,
            ob_final_tel:bus_data.ob_final_tel,
            ob_ems_org:bus_data.ob_ems_org,
            ob_ems_number:bus_data.ob_ems_number,
            ob_ems_msg:bus_data.ob_ems_msg,
            ob_express_money:bus_data.ob_express_money
        };
        _dole_form.setValues(post_data);
    };

    function confirm_dole(){
        var _dole_form=dole_form.getForm();
        if(!_dole_form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var form_post=_dole_form.getValues();
        Ext.MessageBox.confirm('友情提示','你确认需要确认取票吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/the_tickets_user',
                params: form_post,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        dole_win.hide();
                        store.reload();
                        ri_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    };

    final_name_box.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('ob_final_tel').setValue(row.get('u_mob'));
        }
    });
    //确认取票业务(end)

    //查看票领取日志 (start)
    var look_url = $__app__ + '/OrderBus/obd_select';
    var look_field = [ {name:"obd_id"}];
    var look_store = new SUNLINE.JsonStore(look_url, look_field,false,{pageSize:10});
    var look_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:look_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有票位置的信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"obd_id", dataIndex:"obd_id", width:150,hidden:true},
            {header:"obd_ob_id", dataIndex:"obd_ob_id", width:150,hidden:true},
            {header:"当前持票人", dataIndex:"obd_final_name", width:80},
            {header:"持票人联系方式", dataIndex:"obd_final_tel", width:115},
            {header:"快递公司", dataIndex:"obd_ems_org", width:150},
            {header:"快递运单号", dataIndex:"obd_ems_number", width:100},
            {header:"快递运费", dataIndex:"obd_express_money", width:100},
            {header:"备注", dataIndex:"obd_remark", width:140,renderer:function(v,m,r){
                return '<span title="'+v+'">'+v+'</span>';
            }},
            {header:"持票时间", dataIndex:"obd_ems_time", width:136,hidden:true,renderer:function(v,m,r){
                v= new Date(parseInt(v)*1000);
                return Ext.Date.format(v,'Y-m-d H:i:s');
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:look_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有票位置的信息'
        })
    });
    var look_win=new Ext.Window({
        title:'查看票位置',
        width:746,
        height:458,
        layout:'fit',
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[look_grid],
        buttons:[
            {text:'关闭', handler:function () { look_win.hide();}}
        ]
    });

    window.order_dole_detail=function(e){
        look_win.show();
        SUNLINE.baseParams(look_store,{obd_ob_id:e});
        look_store.currentPage=1;
        look_store.load();
    }
    //查看票领取日志 (end)

    //导出所选数据 (start)
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确认导出所选中班次吗?',function(y){
            if(y=='yes'){
                var rows=grid.getSelectionModel().getSelection();
                var bus_id=[];
                Ext.each(rows,function(v,i){
                    var row= v.data;
                    if(bus_id.length>0){
                        bus_id=bus_id.concat(row.bus_id);
                    }else{
                        bus_id=row.bus_id;
                    }
                });
                if(bus_id.length<=0){
                    Ext.Msg.alert('友情提示','请选择需要导出的班次信息!');
                    return false;
                }
                bus_id=bus_id.join(',');
                window.location = $__app__+'/OrderBus/train_detail_excel/bus_id/'+bus_id;
            }
        });
    };
    //导出所选数据 (end)

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
                bus_data=row;
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
        if(bus_id.length<0){
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
    var select_row=['tm_worg_txt','start_site_txt','end_site_txt'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                console.log(select_row[si])
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                var post={type:t.text};
                if(in_array(select_row[si],['start_site_txt','end_site_txt'])){
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

    grid.on('cellclick',function(v,i,d,r){
        setTimeout(function(){
            var rows=grid.getSelectionModel().getSelection();
            var bus_id=[];
            Ext.each(rows,function(v,i){
                var row= v.data;
                if(bus_id.length>0){
                    bus_id=bus_id.concat(row.bus_id);
                }else{
                    bus_id=row.bus_id;
                }
            });
            console.log(bus_id);
            var post={bus_id:Ext.encode(bus_id)}
            SUNLINE.baseParams(ri_store,post);
            ri_store.load();
        },200);
    });

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

    //大交通票退票操作 (start)
    var del_form = Ext.create('Ext.form.Panel',{
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
            {id:"to_id",name:"to_id",fieldLabel:"票务订单ID",hidden:true},
            {id:"o_number",name:"o_number",fieldLabel:"订单编号",hidden:true},
            {id:"ob_start_date",name:"start_date",fieldLabel:"票务日期",readOnly:true},
            {id:"ob_penalty",name:"ob_penalty",fieldLabel:"单票损"},
            {id:"ob_remarks",name:"ob_remarks",fieldLabel:"备注",xtype:'textarea'}
        ]
    });
    var del_win = new Ext.Window({
        title:"批量退票操作",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: del_form,
        buttons:[
            {text:'确认退票',handler:confirm_del},
            {text:'关闭',handler:function(){ del_win.hide(); }}
        ]
    });

    function del_bus_fn(){
        var vip_data=select_vip_data();
        var bus_id=vip_data.bus_id;
        if(bus_id.length<=0){
            Ext.Msg.alert('友情提示','请选择需要退票的用户信息!');
            return false;
        }
        del_win.show();
        var bus_data=vip_data.bus_data;
        var _del_form=del_form.getForm();
        var post_form={
            bus_id:bus_id,
            start_date:int2date(bus_data.ob_start_date),
            to_id:bus_data.ob_toid,
            ob_penalty:bus_data.ob_penalty,
            ob_remarks:bus_data.ob_remarks,
            o_number:bus_data.s_o_number
        };
        _del_form.setValues(post_form);
    }

    function confirm_del(){
        var _del_form=del_form.getForm();
        var post_data=_del_form.getValues();
        Ext.MessageBox.confirm('友情提示','你确认需要退掉所选票务吗?退票后，票务将变为【已退票】状态!',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/OrderBus/bus_ticket_quit',
                params: post_data,
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        del_win.hide();
                        store.reload();
                        ri_store.load();
                    }
                    myMask.hide();
                }
            })
        });
    }
    //大交通票退票操作 (end)

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        var key_type=skey_search_box.getValue();
        SUNLINE.baseParams(store,{skeys:key,key_type:key_type},true);
        store.load();
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

    window.OrderDetail=function(number){
        parent.OpenTab('订单详情'+number, 'OrderDetail'+number, '', $__app__+'/OrderDetail/index/id/'+number, 1);
    }

    window.TeamSreach=function(number){
        if(!number){
            Ext.Msg.alert('友情提示','当前团队未生成计划单不可直接查询！');
            return false;
        }
        skey_search_box.setValue('团队编号');
        Ext.getCmp('pl_Search').setValue(number);
        planeSearch();
    }

    ziyo_log({ listeners : [{grid: grid, action:'OrderBus', pk_id:'ob_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
})