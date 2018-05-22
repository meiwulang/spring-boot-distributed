/**
 * Created by Administrator on 2016/5/30.
 */
var PlanInfo=[];
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/TransPlan/trans_select';
    var store=SUNLINE.JsonStore(url,[],false);
    var cm=[
        {header:"tp_org_id", dataIndex:"tp_org_id", width:100,hidden:true},
        {header:"车辆ID", dataIndex:"tp_car_org_id", width:100,hidden:true},
        {header:"车辆公司", dataIndex:"tp_car_org_name", width:170},
        {header:"安排总次数", dataIndex:"all_ci_num", width:90,align:'center'},
        {header:"安排总人数", dataIndex:"num", width:90,align:'center'},
        {header:"总费用", dataIndex:"all_money", width:75,align:'right',renderer:money},
        {header:"未结费用次数", dataIndex:"ci_num", width:100,align:'center',renderer:function(v){
            if(v)return "<span style='color:red;font-weight: bold'>"+v+"</span>";
        }}
    ];

    var start_time=SUNLINE.ExtDateField({
        width:110,
        labelWidth:0,
        fieldLabel:":",
        format: 'Y-m-d',
        id:'start_date',
        name:'start_date',
        value:start_date,gang:'end_date',start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date',
        width:110,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:end_date,gang:'start_date'
    });
    var grid=Ext.create('Ext.grid.Panel',{
        style:'border-top:2px solid #009DDA',
        region:'center',
        width:500,
        store:store,
        columns:cm ,
        viewConfig:{emptyText:'没有人数汇总信息'}
    });

    var ri_store=SUNLINE.GroupingStore($__app__+'/TransPlan/trans_count_store',[],{sortInfo:{field:'tp_start_date',direction: "DESC"}, groupField:'tp_start_date'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: " {name} (共 {[values.rows.length]} 条)"
    });
    var ri_cm = [
        {header:'tp_id',dataIndex:'tp_id',hidden:true},
        {header:'tp_stations',dataIndex:'tp_stations',hidden:true},
        {header:'tp_station_text',dataIndex:'tp_station_text',hidden:true},
        {header:'tp_sb_id',dataIndex:'tp_sb_id',hidden:true},
        {header:'tp_type',dataIndex:'tp_type',hidden:true},
        {header:'tp_sid',dataIndex:'tp_sid',hidden:true},
        {header:'tp_fly_number',dataIndex:'tp_fly_number',hidden:true},
        {header:'tp_car_org_id',dataIndex:'tp_car_org_id',hidden:true},
        {header:'类型',dataIndex:'tp_settle_type',width:50,renderer:function(v,m,r){
            if(v=='现金'){
                return '<font color="green">'+v+'</font>';
            }else{
                return '<font color="red">'+v+'</font>';
            }
        }},
        {header:'出发日期',dataIndex:'tp_start_date',width:100,renderer:function(v,m,r){
            return v.substr(4,2)+'月'+v.substr(6,2) +'日 '+ r.get('tp_type');
        }},
        {header:'司机',dataIndex:'tp_driver_text',width:135},
        {header:'人数',dataIndex:'tp_person',width:60,align:'center'},
        {header:'金额',dataIndex:'tp_real_money',width:80,align:'right',renderer:function(v){
            if(v=='' || v==0)v="<span style='color:red;font-weight: bold'>0</span>";
            return '￥'+v;
        }},
        /*{header:'调整金额',dataIndex:'tp_trim_money',align:'right',width:90,renderer:function(v){
            if(!v)return '';
            return '￥'+ parseFloat(v).toFixed(2);
        }},
        {header:'调整金额备注',dataIndex:'tp_trim_remark',align:'left',width:200},*/
        {header:'用车线路',dataIndex:'tp_go_time',width:180,renderer:function(v,m,r){
            var text='',color='style="color:#0000ff!important;font-weight: bold!important;"';
            if(r.get('tp_real_money')>0)color='style="color:#008000!important"';
            if(r.get('tp_type')=='去程'){
                text='<div class="trans_list_cls" >'+r.get('tp_go_time')+' '+ r.get('tp_station_text')+' — '+r.get('tp_sb_text')+'</div>';
            }else{
                text='<div class="trans_list_cls" >'+r.get('tp_go_time')+' '+ r.get('tp_sb_text')+' — '+r.get('tp_station_text')+'</div>';
            }
            return text;
        }},
        {header:'时间/航班(次)号',dataIndex:'tp_fly_number',width:140,renderer:function(v,m,r){
            if(!v)return '<font color="red"><b>未安排大交通</b></font>';
            var str='出发';
            if(r.get('tp_type')=='返程')str='抵达';
            return '<b style="color: darkred">'+r.get('tp_fly_time')+'</b> '+str+' - '+v;
        }},
        {header:'备注',dataIndex:'tp_remark',width:100,align:'left',renderer:function(v){
            if(!v)v='';
            return '<font title="'+ v+'">'+ v+'</font>';
        }}

    ];

    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'east',
        width:870,
        minWidth:10,
        store:ri_store,
        collapsed:true,
        columns:ri_cm,
        fixed:true,
        features: [groupingFeature],
        selModel:{
            selType: 'checkboxmodel'
        },
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'输入金额',iconCls:'button-edit',id:'plan_edit',handler:edit_trans_plan},
            '-',
            {text:'确认付款',iconCls:"button-edit",
                menu:{
                    items :[
                        {text:'确认付款',handler:edit_status_price},
                        {text:'取消付款',handler:edit_status_price}
                    ]
                }
            },
            '-',
            '填写状态',
            {
                xtype:"combo",
                id:"money_type",
                name:"money_type",
                width:75,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['money_type'],
                    data:[['全部'],['已填写'],['未填写']],
                }),
                triggerAction:"all",
                editable:false,
                valueField:"money_type",
                displayField:"money_type",
                mode:"local",
                value:'全部'
            },
            '-',
            {text:'按出发日期分组',id:'_group_by_id',iconCls:"searchico",field:'tp_start_date',handler:setGroup,
                menu:{
                    items :[
                        {text:'按往返程分组',field:'tp_type',handler:setGroup},
                        {text:'按出发日期分组',field:'tp_start_date',handler:setGroup}
                    ]
                }
            },

            {text:'收起',iconCls:'button-structure',handler:function(){
                ri_grid.collapse();
            }},
            {text:'导出',f_type:'one', iconCls:'button-excel',handler:download_excel}
        ]
    });
    Ext.getCmp('money_type').on('select',function(){
        var row=SUNLINE.getSelected(grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择左边您要操作的公司');
            return false;
        }
        var money_id=Ext.getCmp('money_type').getValue();
        var row= row.data;
        if(row.tp_car_org_name=='总计'){
            ri_store.removeAll();
            return false;
        }
        var date_val=where_date();
        date_val['tp_car_org_id']=row.tp_car_org_id;
        date_val['money_id']=money_id;
        SUNLINE.baseParams(ri_store,date_val);
        ri_store.load();


    })
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
            '车辆公司:',
            {xtype:'textfield',emptyText:'全部车辆公司',text:'选择车辆公司',id:'car_org_txt',to_id:'car_org_id',width:80},
            {xtype:'hidden',emptyText:'全部车辆公司ID',id:'car_org_id'},
            '-',
            '出发日期',
            start_time,
            ' 至 ',
            end_time,
            {text:'查询',iconCls:'button-sch',handler:sreach_fn},
            {text:'导出',f_type:'all', iconCls:'button-excel',handler:download_excel}
        ]
    });
    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Y-m-d');
        var end_date=Ext.Date.format(end_time.getValue(),'Y-m-d');
        var post_data={start_date:start_date,end_date:end_date};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var car_org_id=Ext.getCmp('car_org_id').getValue();
        if(tm_worg_id)post_data['worg_id']=tm_worg_id;
        if(car_org_id)post_data['car_org_id']=car_org_id;
        return post_data;
    }
    //导出/打印
    function download_excel(v){
        var name='',url='';
        var url_data=where_date();
        if(v.f_type=='all'){
            url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date+'/type/all';
            if(url_data.worg_id)url+='/worg_id/'+url_data.worg_id;
            if(url_data.car_org_id)url+='/car_org_id/'+url_data.car_org_id;
            name='你确定要导出车辆公司统计表吗?';
        }else{
            var row = SUNLINE.getSelected(grid);
            if(row == null){
                Ext.Msg.alert('友情提示','请选择要导出的车队公司!');
                return false;
            }
            name='你确定要导出'+row.data.tp_car_org_name+'的统计表吗?';
            url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date+'/tp_car_org_id/'+row.data.tp_car_org_id+'type/one';
        }
        Ext.MessageBox.confirm('友情提示',name,function(y){
            if(y!='yes')return false;
            window.location = $__app__+'/TransPlan/all_trans_count/'+url;
        });

    }
    function sreach_fn(){
        var date_val=where_date();
        SUNLINE.baseParams(store,date_val);
        store.load();
    }
    sreach_fn();


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

    function trans_search(){
        var keys=Ext.getCmp('trans_Search').getValue();
        SUNLINE.baseParams(trans_store,{skey:keys},true);
        trans_store.load();
    }

    var select_id='';
    var select_name='';
    var select_row=['tm_worg_txt','car_org_txt'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                SUNLINE.baseParams(trans_store,{type:t.text});
                trans_store.load();
            }
        });
    }
    var form_cm = [
        {id:"tp_id",name:"tp_id",fieldLabel:"计划ID",hidden:true},
        {id:"tp_type",name:"tp_type",fieldLabel:"接送类型",hidden:true},
        {id:"tp_sid",name:"tp_sid",fieldLabel:"座位ID",hidden:true},
        {id:"tp_fly_time",name:"tp_fly_time",fieldLabel:"航班时间",hidden:true},
        {id:"tp_fly_number",name:"tp_fly_number",fieldLabel:"航班号",hidden:true},
        {id:"tp_station_text",name:"tp_station_text",fieldLabel:"出发站",readOnly:true,hidden:true},
        {id:"tp_sb_text",name:"tp_sb_text",fieldLabel:'目地站',readOnly:true,hidden:true},
        {id:"tp_start_date",name:"tp_start_date",fieldLabel:'安排日期',readOnly:true},
        {id:"tp_person",name:"tp_person",fieldLabel:"人数",editable:false,readOnly:true},
        {id:"tp_go_time",name:"tp_go_time",fieldLabel:"发车时间",readOnly:true},
        {id:"tp_car_org_id",name:"tp_car_org_id",fieldLabel:'车队公司',hidden:true,readOnly:true},
        {id:"tp_car_org_name",name:"tp_car_org_name",fieldLabel:'车队公司',readOnly:true},
        {id:"tp_driver_text",name:"tp_driver_text",fieldLabel:'司机信息',readOnly:true},
        {id:"tp_driver",name:"tp_driver",fieldLabel:'司机信息ID',hidden:true},
        {id:"source_type",name:"source_type",fieldLabel:'司机信息ID',xtype:'hidden'},
        {id:'tp_real_money',name:'tp_real_money',fieldLabel:'车价'},
        {id:'tp_remark',name:'tp_remark',fieldLabel:'备注',xtype:'textarea',height:50}
    ];
    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:form_cm
    })
    var win = new Ext.Window({
        title:"输入金额",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: form,
        buttons:[
            {text:'保存编辑',handler:pres_edit},
            {text:'关闭',handler:function(){ win.hide(); }}
        ]
    });
    win.on('hide',function(){
        form.reset();
    })
    function pres_edit(){
        var iform = form.getForm();
        if(!form.getForm().isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var data=iform.getValues();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/seat_arranged_list',
            params: {from_data:Ext.encode(data),plan_list:Ext.encode(PlanInfo)},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    win.hide();
                    ri_store.reload();
                }
                myMask.hide();
            }
        })
    }

    function edit_status_price(b){
        var rows=ri_grid.getSelectionModel().getSelection();
        if(!rows){
            Ext.Msg.alert('友情提示','请选择需要修改支付状态的计划!');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定需要修改支付状态吗？',function(y){
            if(y!='yes')return false;
            var tp_id=[],org_id=[];
            Ext.each(rows,function(v,i){
                var rw= v.data;
                tp_id.push(rw.tp_id);
                org_id.push(rw.tp_car_org_id);
            });
            var tp_status=0;
            if(b.text=='确认付款')tp_status=1;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/TransPlan/trans_status_price',
                params: {tp_id:Ext.encode(tp_id),tp_org_id:Ext.encode(org_id),tp_status:tp_status},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        ri_store.reload();
                    }
                    myMask.hide();
                }
            })
        });
    }

    var detail_fn=SUNLINE.TransBox({
        grid:ri_grid,
        type:'money',
        HideObj:function(){
            ri_store.reload();
        }
    });

    function edit_trans_plan(b){
        var rows=ri_grid.getSelectionModel().getSelection();
        if(!rows){
            Ext.Msg.alert('友情提示','请选择需要输入金额的信息!');
            return false;
        }
        var row='',bus_number='',bool=true;
        Ext.each(rows,function(v,i){
            var rw= v.data;
            if(bus_number!=rw.bus_number && bus_number){
                bool=false;
                return false;
            }
            if(!row)bus_number=rw.bus_number;
        });
        if(bool===false){
            Ext.Msg.alert('友情提示','批量编辑的计划中不能选择多个航班，请重新选择!');
            return false;
        }
        detail_fn.detail_info(b);
    }
    function setGroup(b){
        var g = Ext.getCmp('_group_by_id');
        g.setText(b.text);
        ri_store.group(b.field);
        g.field = b.field;
    }
    grid.on('cellclick',function(v,i,d,r){

        var row= r.data;
        if(row.tp_car_org_name=='总计'){
            ri_store.removeAll();
            return false;
        }
        var date_val=where_date();
        date_val['tp_car_org_id']=row.tp_car_org_id;
        SUNLINE.baseParams(ri_store,date_val);
        ri_store.load();
        if(ri_grid.getCollapsed())ri_grid.expand();
    });
    store.on('load',function(){
        ri_store.removeAll();
    })

    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
});