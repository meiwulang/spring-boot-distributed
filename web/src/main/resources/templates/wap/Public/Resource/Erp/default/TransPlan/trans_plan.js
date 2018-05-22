/**
 * Created by Johony on 16-2-25.
 */
var usInfo = {};//存储查询条件
var PlanInfo=[];
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var store = SUNLINE.GroupingStore($__app__+'/TransPlan/json_site_seat',[],{sortInfo:{field:'sort_time',direction: "ASC"},groupField:'goto_type'},true);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' {name:this.format_keyword}: (共 {rows:this.values_rows} 人)',{
            format_keyword:function(name){
                if(name=='返程'){
                    return '<font color="blue">返程接站</font>';
                }else{
                    return '<font color="blue">去程送站</font>';
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
        startCollapsed:false/*,
        collapsible:false*/
    });
    store.sort('sort_time', 'ASC');
    function bus_number_fn(v,c,r){
        if(!v)return '<font color="red"><b>未安排大交通</b></font>';
        var str='出发';
        if(r.get('goto_type')=='返程')str='抵达';
        return '<b style="color: darkred">'+r.get('start_time')+'</b> '+str+' - '+v;
    };
    function seat_detail_fn(v,c,r){
        if(!v)return v;
        var seat_detail= v.join(']</div><div class="trans_list_cls">[');
        return '<div class="trans_list_cls">['+seat_detail+']</div>';
    };
    function start_site_fn(v,c,r){
        var _string=r.get('start_stname')+' — '+ r.get('start_site');
        if(r.get('goto_type')=='返程')_string= r.get('start_site') +' —> '+ r.get('start_stname');
        return '<div class="trans_list_cls">'+_string+'</div>';
    }
    function tp_status_fn(v){
        if(!v)return '<font style="color:red">未安排</font>';
        if(v=='已安排')return '<font color="green">'+v+'</font>';
        return '<font color="blue">'+v+'</font>';
    }
    function pop_num_fn(v,c,r){
        var red='';
        var row= r.data;
        if(row.tp_person>0 && row.tp_person!=row.pop_num)red=' <font color="red" title="有未安排接送人数改动">('+(row.pop_num-row.tp_person)+')</font>';
        return '<font color="green"><b>'+v+red+'</b></font>';
    }
    function seat_date_fn(v){
        if(!v)return v;
        var seat_detail= v.join('</div><div class="trans_list_cls">/');
        return '<div class="trans_list_cls">'+seat_detail+'</div>';
    }
    function age_num_fn(v,c,r){
        var str_pop='';
        if(!v)return '';
        if(v.big_pop)str_pop+=v.big_pop+'大';
        if(v.min_pop)str_pop+=v.min_pop+'小';
        if(v.small_pop)str_pop+=v.small_pop+'婴儿';
        if(v.not_pop)str_pop+=v.not_pop+'其它';
        return str_pop;
    }
    function bus_seat_fn(v,c,r){
        if(!v)return '';
        var driver_txt=[],org_txt=[];
        Ext.each(v,function(bv,bi){
            if(bv.bus_name){
                driver_txt.push(bv.bus_name);
                org_txt.push('【'+bv.org_name+'】'+bv.bus_name+'('+bv.bus_money+')');
            }
        });
        var driver_str=driver_txt.join('、');
        var txt='<div class="trans_list_cls"><span data-qtip="<b>接送司机:共'+driver_txt.length+'项</b><br>'+org_txt.join('<br>')+'" style="cursor: pointer">'+driver_str+'</span></div>';
        return txt;
    }

    function bus_remark_fn(v,c,r){
        if(!v)return '';
        var remark_txt=[];
        Ext.each(v,function(rv,ri){
            if(rv.bus_remark)remark_txt.push('<b>【'+rv.org_name+'】</b><br>备注:'+rv.bus_remark);
        });
        if(remark_txt.length<=0)return '';
        var txt='<span data-qtip="<br>'+remark_txt.join('<br>')+'" style="color:blue;cursor: pointer">移上查看备注('+remark_txt.length+')</span>';
        return txt;
    }

    var cm = [
        /*new Ext.grid.RowNumberer(),*/
        {header:'计划ID',dataIndex:'tp_id',hidden:true},
        {header:'状态',dataIndex:'tp_plan_status',align:'center',width:70,renderer:tp_status_fn},
        {header:'排序时间',dataIndex:'sort_time',hidden:true},
        {header:'接送类型',dataIndex:'goto_type',align:'center',width:100,hidden:true},
        {header:'出发日期',dataIndex:'start_date_fn',align:'center',width:80},
        {header:'用车线路',dataIndex:'start_site',align:'left',width:160,renderer:start_site_fn},
        {header:'人数',dataIndex:'pop_num',align:'center',width:50,renderer:pop_num_fn},
        {header:'时间/航班(次)号',dataIndex:'bus_number',align:'left',width:150,renderer:bus_number_fn},
        {header:'客人联系',dataIndex:'seat_detail',align:'left',width:180,renderer:seat_detail_fn},
        {header:'游玩日期',dataIndex:'seat_date',align:'left',width:90,renderer:seat_date_fn},
        {header:'游客分布',dataIndex:'age_num',align:'center',width:120,renderer:age_num_fn},
        {header:'接送时间',dataIndex:'tp_go_time',align:'center',width:80,renderer:function(v){
            return '<div class="trans_list_cls">'+v+'</div>';
        }},
        {header:'司机信息',dataIndex:'org_bus',align:'left',width:150,renderer:bus_seat_fn},
        {header:'车价',dataIndex:'tp_real_money',align:'right',width:80,renderer:function(v){
            if(!v)return '';
            return '￥'+ parseFloat(v).toFixed(2);
        }},
        /*{header:'调整金额',dataIndex:'tp_trim_money',align:'right',width:90,renderer:function(v){
            if(!v)return '';
            return '￥'+ parseFloat(v).toFixed(2);
        }},
        {header:'调整金额备注',dataIndex:'tp_trim_remark',align:'left',width:200},*/
        {header:'备注',dataIndex:'org_bus',align:'left',width:200,renderer:bus_remark_fn},
        {header:'座位信息',dataIndex:'seat_id',hidden:true}

    ];

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        features: [groupfeatures],
        store:store,
        columns:cm,
        id:'plan_box_id',
        style:'border-top:2px solid #009DDA',
        fixed:true,
        viewConfig:{
            emptyText:'没有符合你要查找的内容',
            enableTextSelection:true
        },
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            {text:'撤销计划',iconCls:'button-del',id:'plan_del',handler:del_trans_plan, disabled:isDisabled('TransPlan::del_trans_plan')},
            '-',
            /*{text:'编辑接送计划',iconCls:'button-edit',id:'plan_edit',handler:edit_trans_plan, disabled:isDisabled('TransPlan::seat_arranged')},
            '-',*/
            {text:'导出计划',iconCls:'button-excel',handler:download_excel, disabled:isDisabled('TransPlan::seat_excel')},
            '-',
            {text:'查看全陪交通',iconCls:'button-edit',handler:guide_info},
            '-',
            {text:'计划明细',iconCls:'button-edit',id:'plan_edit',handler:detail_info},
            '-',
            /*{text:'确认付款',iconCls:"button-edit",
                menu:{
                    items :[
                        {text:'确认付款',handler:edit_status_price},
                        {text:'取消付款',handler:edit_status_price}
                    ]
                }
            },*/
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '游客姓名,游客手机号,订单编号,站点名称,航班编号',
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


    var ri_store = SUNLINE.GroupingStore($__app__+'/TransPlan/look_data_seat',[],{groupField:'s_o_number'},false);
    var ri_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' <div>{name}: (共 {[values.rows.length]} 人) <span class="grid_group_cls" onclick="OrderDetail(\'{name}\')">查看详情>></span></div>{rows:this.data_rows}',{
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
        if(r.get('ob_add_status')==1)return '<font color="#999">不包含</font>';
        if(v=='已出票')return '<font color="green">'+v+'</font>';
        if(v=='未出票')return '<font color="red">'+v+'</font>';
        return v;
    }
    function vip_name_fn(v,c,r){
        var row= r.data;
        if(row.tp_id>0)return v;
        return '<span class="span_not_plan" title="未安排接送">'+v+'</span>';
    }
    function vip_age_fn(v,c,r){
        var row= r.data;
        if(!v)return '<span title="非身份证:'+ row.s_vip_card +'('+row.s_vip_card_type+')">未知</span>';
        if(v<12 && v>3)return '<span style="color: #008000;font-weight: bold" title="儿童">'+v+'岁</span>';
        if(v<3)return '<span style="color: red;font-weight: bold" title="婴儿">'+v+'岁</span>';
        return v+'岁';
    }
    var ri_cm = [
        {header:'座位ID',dataIndex:'s_id',hidden:true},
        {header:'游客姓名',dataIndex:'s_vip_name',width:80,renderer:vip_name_fn},
        {header:'游客手机',dataIndex:'s_vip_mob',width:100},
        {header:'年龄',dataIndex:'s_vip_age',width:60,align:'center',renderer:vip_age_fn},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:50,hidden:true},
        {header:'出票状态',dataIndex:'ob_status',align:'center',width:100,renderer:ob_status_fn}
    ];
    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'east',
        store:ri_store,
        id:'plan_id',
        width:360,
        features: [ri_groupfeatures],
        selModel:{
            selType: 'checkboxmodel'
        },
        columns:ri_cm,
        fixed:true,
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'移除选中游客', iconCls:'button-del',handler:vip_del_name, disabled:isDisabled('TransPlan::trans_del_vip')}
        ]
    });

    //票种类型Box
    var goto_type_box=SUNLINE.LocalComob({
        id:'goto_type',
        fields:['goto_type'],
        data:[['去程'],['返程'],['全部']],
        config:{
            fieldLabel:'接送类型',
            labelWidth:60,
            width:160,
            value:'全部'
        }
    });

    //票种类型Box
    var plan_status_box=SUNLINE.LocalComob({
        id:'status_id',
        fields:['status_id'],
        data:[['全部'],['未安排'],['安排中'],['已安排'],['有变更']],
        config:{
            fieldLabel:'状态',
            labelWidth:35,
            width:160,
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
            '车辆公司:',
            {xtype:'textfield',emptyText:'全部车辆公司',text:'选择车辆公司',id:'car_org_txt',to_id:'car_org_id',width:80},
            {xtype:'hidden',emptyText:'全部车辆公司ID',id:'car_org_id'},
            '-',
            '始发站:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'site_txt',to_id:'site_id',width:80},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'site_id'},
            '-',
            '上车点:',
            {xtype:'textfield',emptyText:'全部上车点',text:'选择上车站点',id:'station_txt',to_id:'station_id',width:80},
            {xtype:'hidden',emptyText:'全部上车点ID',id:'station_id'},
            '-',
            plan_status_box,
            '-',
            goto_type_box,
            '-',
            '接送日期',
            start_time,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){parent.CloseTab()}}
        ]
    });
    //选择订单来源单位
    var CarNameBox=SUNLINE.CompanyBox({
        where:{
            org_type:'车队公司'
        },
        config:{
            displayField:'text',
            valueField:'text',
            id:'tp_car_org_name',
            name:'tp_car_org_name',
            labelWidth:60,
            width:280,
            labelAlign:'right',
            fieldLabel:'车队公司'
        }
    });

    //选择司机信息
    var tp_driver_box=SUNLINE.CompanyBox({
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
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{u_zname}{u_mob}',
                '</tpl>'
            ),
            id:'tp_driver_text',
            name:'tp_driver_text',
            labelWidth:60,
            width:280,
            queryParam:'skey',
            labelAlign:'right',
            fieldLabel:'司机信息'
        }
    });

    //编辑处理票接送信息
    var form_cm = [
        {id:"tp_id",name:"tp_id",fieldLabel:"计划ID",hidden:true},
        {id:"tp_type",name:"tp_type",fieldLabel:"接送类型",hidden:true},
        {id:"tp_sid",name:"tp_sid",fieldLabel:"座位ID",hidden:true},
        {id:"tp_fly_time",name:"tp_fly_time",fieldLabel:"航班时间",hidden:true},
        {id:"tp_fly_number",name:"tp_fly_number",fieldLabel:"航班号",hidden:true},
        {id:"start_site",name:"start_site",fieldLabel:"出发站",readOnly:true,hidden:true},
        {id:"end_site",name:"end_site",fieldLabel:'目地站',readOnly:true,hidden:true},
        {id:"tp_start_date",name:"tp_start_date",fieldLabel:'安排日期',readOnly:true},
        {id:"tp_person",name:"tp_person",fieldLabel:"人数",editable:false,readOnly:true},
        {id:"tp_go_time",name:"tp_go_time",fieldLabel:"发车时间"},
        {id:"tp_car_org_id",name:"tp_car_org_id",fieldLabel:'车队公司',hidden:true},
        CarNameBox,
        /*{id:"tp_driver_text",name:'tp_driver_text',fieldLabel:'司机信息'},*/
        tp_driver_box,
        {id:"tp_driver",name:"tp_driver",fieldLabel:'司机信息ID',hidden:true},
        {id:'tp_real_money',name:'tp_real_money',fieldLabel:'车价'},
        {id:'tp_trim_money',name:'tp_trim_money',fieldLabel:'调整金额'},
        {id:'tp_trim_remark',name:'tp_trim_remark',fieldLabel:'金额备注',xtype:'textarea',height:50},
        {id:'tp_remark',name:'tp_remark',fieldLabel:'备注',xtype:'textarea',height:50}
    ];

    CarNameBox.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('tp_car_org_id').setValue(row.get('id'));
            tp_driver_box.setValue('');
            Ext.getCmp('tp_driver').setValue('');
        }
    });
    tp_driver_box.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('tp_driver').setValue(row.get('u_id'));
            tp_driver_box.setValue(row.get('u_zname')+row.get('u_mob'));
        }
    });
    tp_driver_box.on({
        beforequery:function(c,r){
            tp_driver_box_params();
        }
    });

    function tp_driver_box_params(){
        var corg_id=Ext.getCmp('tp_car_org_id').getValue();
        SUNLINE.baseParams(tp_driver_box.store,{us_orgid:corg_id});
        tp_driver_box.store.load();
    }

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
        title:"安排计划",
        width:330,
        /*height:245,*/
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: form,
        buttons:[
            {text:'保存编辑',handler:pres_edit},
            {text:'关闭',handler:function(){ win.hide(); }}
        ]
    });

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
    var select_row=['tm_worg_txt','site_txt','station_txt','car_org_txt'];
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

    function edit_trans_plan(t){
        var rows=grid.getSelectionModel().getSelection();
        if(!rows[0]){
            Ext.Msg.alert('友情提示','请选择需要编辑的接送信息!');
            return false;
        }
        var row='',bus_number='',bool=true,pop_num= 0,tp_real_money= 0,tp_trim_money=0;
        PlanInfo=[];
        Ext.each(rows,function(v,i){
            var rw= v.data;
            if(bus_number!=rw.bus_number && bus_number){
                bool=false;
                //return false;
            }
            if(!row){
                bus_number=rw.bus_number;
                row={
                    start_time:rw.start_time,
                    tp_fly_number:rw.bus_number,
                    tp_start_date:rw.start_date,
                    tp_go_time:rw.tp_go_time,
                    tp_car_org_id:rw.tp_car_org_id,
                    tp_car_org_name:rw.tp_car_org_name,
                    tp_driver:rw.tp_driver,
                    tp_driver_text:rw.tp_driver_text,
                    /*tp_real_money:rw.tp_real_money,*/
                    tp_trim_remark:rw.tp_trim_remark,
                    tp_remark:rw.tp_remark
                }
            }
            var real_money=rw.tp_real_money?parseFloat(rw.tp_real_money):0;
            var trim_money=rw.tp_trim_money?parseFloat(rw.tp_trim_money):0;
            pop_num+=rw.pop_num;
            tp_real_money+=real_money;
            tp_trim_money+=trim_money;
            PlanInfo.push(rw);
        });
        row.tp_person=pop_num;
        row.tp_real_money=tp_real_money;
        row.tp_trim_money=tp_trim_money;
        /*if(bool===false){
            Ext.Msg.alert('友情提示','批量编辑的计划中不能选择多个航班，请重新选择!');
            return false;
        }*/
        //row=row.data;
        win.show();
        var _from=form.getForm();
        _from.reset();
        //如果有航班(次)信息有不一样的，有提示
        var form_data=row;
        _from.setValues(form_data);
    }

    //编辑接送信息
    function pres_edit(t){
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
                    store.reload();
                }
                myMask.hide();
            }
        })
    }

    //撤销整条接送计划
    function del_trans_plan(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要撤销的接送信息!');
            return false;
        }
        row=row.data;
        if(row.tp_status=='del'){
            Ext.Msg.alert('友情提示','当前计划没有安排，不可以撤销!');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/del_trans_plan',
            params: {tp_id:row.tp_id},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    store.reload();
                }
                myMask.hide();
            }
        })
    };

    grid.on('cellclick',function(v,i,d,r){
        var row=r.data;
        var post={
            goto_type:row.goto_type,
            start_site:row.start_site,
            start_stname:row.start_stname,
            bus_number:row.bus_number,
            start_date:row.start_date
        };
        if(!row.bus_number){
            Ext.getCmp('plan_edit').setDisabled(true);
            //Ext.getCmp('plan_del').setDisabled(true);
        }else{
            if(isDisabled('TransPlan::seat_arranged')==false)Ext.getCmp('plan_edit').setDisabled(false);
            //if(isDisabled('TransPlan::del_trans_plan')==false)Ext.getCmp('plan_del').setDisabled(false);
        }
        SUNLINE.baseParams(ri_store,post);
        ri_store.load();
    });

    ri_store.on({
        load:function(){
            check_hide();
        }
    });
    store.on({
        load:function(){
            check_hide();
        }
    });
    var guide_info_url=$__app__+'/TransPlan/guide_info';
    var guide_info_field=[];
    var guide_info_store=SUNLINE.GroupingStore(guide_info_url,guide_info_field,{sortInfo:{field:'ob_goto_type'}, groupField:'ob_goto_type'},false);
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 条)"
    });
    var guide_info_cm=[
        new Ext.grid.RowNumberer(),

        {header:"导游姓名",dataIndex:"s_vip_name",width:80,renderer:function(v,i,r){
            if(r.get('ob_status')=='已出票'){
                return '<span style="color:#008000" title="'+r.get('ob_status')+'">'+v+'</span>';
            }else if(r.get('ob_status')=='未出票'){
                return '<span style="color:#ff4500;font-weight: bold" title="'+r.get('ob_status')+'">'+v+'</span>';
            }else{
                return '<span style="color:red;font-weight: bold" title="'+r.get('ob_status')+'">'+v+'</span>';
            }
        }},
        {header:"航班次",dataIndex:"ob_type",width:170,renderer:function(v,i,r){
            if(v=='飞机'){
                return '<i class="fa fa-plane" data-val="plane" title="飞机" style="color:blue"> '+r.get('ob_bus_number')+'</i> '+'( '+r.get('ob_start_time')+' - '+r.get('ob_end_time')+' )';
            }else if(v=='火车'){
                return '<i class="fa fa-subway" data-val="subway" title="火车"  style="color:green"> '+r.get('ob_bus_number')+'</i> '+'( '+r.get('ob_start_time')+' - '+r.get('ob_end_time')+' )';
            }
        }},
        {header:"大交通信息",dataIndex:"ob_start_site",width:220,renderer:function(v,i,r){
            return    v +'&nbsp;&nbsp;抵达&nbsp;&nbsp;' +r.get('ob_end_site');
        }},
        {header:"导游手机号",dataIndex:"s_vip_mob",width:100},
        {header:"团队编号",dataIndex:"s_o_number",width:150},
        {header:"类型",dataIndex:"s_o_type",width:80,renderer:function(v){
            if(v=='跟团游'){
                return '散客';
            }else{
                return '团队';
            }
        }}
    ];
    var ob_status_box=SUNLINE.LocalComob({
        id:'ob_status',
        fields:['ob_status'],
        data:[['已出票'],['未出票'],['已退票'],['全部']],
        config:{
            fieldLabel:'出票状态',
            labelWidth:60,
            width:160,
            value:'全部'
        }
    });
    var s_o_type_box=SUNLINE.LocalComob({
        id:'s_o_type',
        fields:['s_o_type'],
        data:[['跟团游'],['团队订单'],['全部']],
        config:{
            fieldLabel:'团队类型',
            labelWidth:60,
            width:160,
            value:'全部'
        }
    });
    var guide_info_grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        features: [groupingFeature],
        store:guide_info_store,
        columns:guide_info_cm,
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        tbar:[
            ob_status_box,
            '-',
            s_o_type_box,
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'guide_info_search',
                cls:'search-icon-cls',
                emptyText : '导游姓名、航班次、手机号、编号',
                width:230,
                onTriggerClick:function(e){
                    guide_info_Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            guide_info_Search();
                    }
                }
            }
        ]
    });
    function guide_info_Search(){
        guide_load();
    }
    var guide_info_win=new Ext.Window({
        title:'全陪导游大交通信息',
        width:850,
        height:510,
        autoScroll : true,
        closeAction:'hide',
        layout : 'border',
        modal:true,
        resizable:true,
        maximizable : true,//全屏效果
        items:guide_info_grid,
        buttons:[
            {text:'关闭', handler:function (){
                guide_info_win.hide();
            },style:'margin-right:15px;'}
        ]
    });
    function guide_info(){
        guide_info_win.show();
        guide_load();
    }
    ob_status_box.on('select',function(){
        guide_load();
    })
    s_o_type_box.on('select',function(){
        guide_load();
    })
    function guide_load(){
        var ob_status_val=ob_status_box.getValue()
        var s_o_type_val=s_o_type_box.getValue()
        var key=Ext.getCmp('guide_info_search').getValue();
        var start_date=Ext.getCmp('start_date').getRawValue();
        SUNLINE.baseParams(guide_info_store,{ob_start_date:start_date,keys:key,ob_status:ob_status_val,s_o_type:s_o_type_val},true);
        guide_info_store.load();
    }
    /**
     * 批量导出条件中的数据
     */
    function download_excel(){
        var msg='是否将导出计划设置为【安排中】?<br />' +
            '<span style="font-size: 16px;color:red;font-weight: bold">注意：确认"是"时相应订单将需要撤销接送计划才可以修改接送，"否"只下载！</span>';
        Ext.MessageBox.confirm('友情提示',msg,function(y){
            if(y=='yes'){
                // todo 需要虚拟的入数据到接送计划表中,如果存在将不入
                var tp_data=[],tp_update=[];
                store.each(function(v){
                    var rows= v.data;
                    if(!rows.tp_id && rows.bus_number){
                        tp_data.push(rows);
                    }else if(rows.pop_num!=rows.tp_person){
                        tp_data.push(rows);
                    }
                });
                download_excel_fn();
                if(tp_data.length>0){
                    var myMask = SUNLINE.LoadMask('正在处理成"按排中",由于数据比较多大概需要30秒，请耐心等待...');
                    myMask.show();
                    setTimeout(function(){
                        plan_process(tp_data,'',myMask);
                    },30000);
                }
            }else{
                download_excel_fn();
            }
        });
    };

    /**
     * 批量操作计划为安排中
     * @param data
     * @returns {string}
     */
    function plan_process(data,up,myMask){
        if(!data && !up)return '没有需要安排的计划数据!';
        var data_row={};
        if(data)data_row.tp_data=Ext.encode(data);
        if(data)data_row.tp_up=Ext.encode(up);
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/plan_process',
            params: data_row,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                myMask.hide();
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    store.load();
                    //download_excel_fn();
                }
            }
        })
    }

    function download_excel_fn(){
        var post=where_select();
        var url='/start_date/'+post.start_date;
        if(post.goto_type)url+='/goto_type/'+post.goto_type;
        if(post.port_name)url+='/port_name/'+post.port_name;
        if(post.site_name)url+='/site_name/'+post.site_name;
        if(post.worg_id)url+='/worg_id/'+post.worg_id;
        if(post.car_org_id)url+='/car_org_id/'+post.car_org_id;
        if(post.status_id)url+='/status_id/'+post.status_id;
        if(post.skeys)url+='/skeys/'+post.skeys;
        window.location = $__app__+'/TransPlan/seat_excel'+url;
    }

    function where_select(){
        var goto_type=goto_type_box.getValue();
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        if(goto_type=='全部')goto_type='';
        var post_where={goto_type:goto_type,start_date:start_date};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var site_id=Ext.getCmp('site_id').getValue();
        var station_id=Ext.getCmp('station_id').getValue();
        var car_org_id=Ext.getCmp('car_org_id').getValue();
        var status_id=plan_status_box.getValue();
        var skeys=Ext.getCmp('pl_Search').getValue();
        if(tm_worg_id)post_where['worg_id']=tm_worg_id;
        if(site_id)post_where['port_name']=site_id;
        if(station_id)post_where['site_name']=station_id;
        if(car_org_id)post_where['car_org_id']=car_org_id;
        if(status_id)post_where['status_id']=status_id;
        if(skeys)post_where['skeys']=skeys;
        return post_where;
    }

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{skeys:key},true);
        store.load();
    };

    function vip_del_name(){
        var rows=ri_grid.getSelectionModel().getSelection();
        var s_id=[],tp_id='';
        Ext.each(rows,function(v,i){
            var row= v.data;
            s_id.push(row.s_id);
            tp_id=row.tp_id;
        });
        if(!tp_id){
            Ext.Msg.alert('友情提示','请选择已经安排过的游客信息!');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/trans_del_vip',
            params: {s_id:Ext.encode(s_id),tp_id:tp_id},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    ri_store.reload();
                    store.load();
                }
                myMask.hide();
            }
        })
    };

    function check_hide(){
        var span_not_plan=$('.span_not_plan');
        for(var si=0;si<span_not_plan.length;si++){
            var si_id=span_not_plan.eq(si);
            var sid_id=si_id.parents('.x-grid-row');
            sid_id.find('.x-grid-cell-row-checker .x-grid-cell-inner').remove();
        }
    }

    function edit_status_price(b){
        var rows=grid.getSelectionModel().getSelection();
        if(!rows){
            Ext.Msg.alert('友情提示','请选择需要修改支付状态的计划!');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定需要修改支付状态吗？',function(y){
            if(y!='yes')return false;
            var tp_id=[];
            Ext.each(rows,function(v,i){
                var rw= v.data;
                tp_id.push(rw.tp_id);
            });
            var tp_status=0;
            if(b.text=='确认付款')tp_status=1;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/TransPlan/trans_status_price',
                params: {tp_id:Ext.encode(tp_id),tp_status:tp_status},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){
                        store.reload();
                    }
                    myMask.hide();
                }
            })
        });
    }

    window.OrderDetail=function(number){
        parent.OpenTab('订单详情'+number, 'OrderDetail'+number, '', $__app__+'/OrderDetail/index/id/'+number, 1);
    };

    var detail_fn=SUNLINE.TransBox({
        grid:grid,
        HideObj:function(){
            store.reload();
            ri_store.reload();
        }
    });
    function detail_info(b){
        detail_fn.detail_info(b);
    }

    /*//操作接送计划明细(start)
    var detail_url=$__app__+'/TransPlan/json_trans_detail';
    var detail_field=[];
    var detail_store = new SUNLINE.JsonStore(detail_url, detail_field,false);
    var detail_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID",dataIndex:"ti_id",width:80,hidden:true},
        {header:"计划ID",dataIndex:"ti_tpid",width:80,hidden:true},
        {header:"车队名称",dataIndex:"ti_org_name",width:180},
        {header:"驾驶员名称",dataIndex:"ti_bus_name",width:150},
        {header:"数量",dataIndex:"ti_num",width:80},
        {header:"金额",dataIndex:"ti_money",width:80},
        {header:"备注",dataIndex:"ti_remark",width:150}
    ];
    var tp_detail_grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:detail_store,
        columns:detail_cm,
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        tbar:[
            {text:'添加接送计划',iconCls:'button-add',handler:detail_trans_plan, disabled:isDisabled('TransPlan::seat_arranged')},
            {text:'编辑接送计划',iconCls:'button-edit',handler:detail_trans_plan, disabled:isDisabled('TransPlan::seat_arranged')},
            {text:'删除接送计划',iconCls:'button-del',handler:detail_del, disabled:isDisabled('TransPlan::seat_arranged')}
        ]
    });
    var tp_detail_win=new Ext.Window({
        title:'接送计划明细',
        width:900,
        height:510,
        autoScroll : true,
        closeAction:'hide',
        layout : 'border',
        modal:true,
        resizable:true,
        maximizable : true,//全屏效果
        items:tp_detail_grid,
        buttons:[
            {text:'关闭', handler:function (){
                tp_detail_win.hide();
            }}
        ]
    });
    tp_detail_win.on('hide',function(){
        store.reload();
        ri_store.reload();
    });
    function detail_info(b){
        var rows=grid.getSelectionModel().getSelection();
        if(!rows[0]){
            Ext.Msg.alert('友情提示','请选择需要查看的【计划明细】!');
            return false;
        }
        var tp_id=[];
        Ext.each(rows,function(v,i){
            var rw= v.data;
            tp_id.push(rw.tp_id);
        });
        tp_detail_win.show();
        SUNLINE.baseParams(detail_store,{tp_id:Ext.encode(tp_id)});
        detail_store.load();
    }

    //接送计划添加、编辑(start)
    var DetailCarBox=SUNLINE.CompanyBox({
        where:{
            org_type:'车队公司'
        },
        config:{
            displayField:'text',
            valueField:'text',
            id:'ti_org_name',
            name:'ti_org_name',
            labelWidth:60,
            width:280,
            labelAlign:'right',
            fieldLabel:'车队公司'
        }
    });
    var detail_driver_box=SUNLINE.CompanyBox({
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
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{u_zname}{u_mob}',
                '</tpl>'
            ),
            id:'ti_bus_name',
            name:'ti_bus_name',
            labelWidth:60,
            width:280,
            queryParam:'skey',
            labelAlign:'right',
            fieldLabel:'司机信息'
        }
    });
    var detail_form_cm = [
        {id:"ti_id",name:"ti_id",fieldLabel:"计划ID",hidden:true},
        {id:"ti_type",name:"tp_type",fieldLabel:"接送类型",hidden:true},
        {id:"ti_sid",name:"tp_sid",fieldLabel:"座位ID",hidden:true},
        {id:"ti_number",name:"ti_number",fieldLabel:"统一编号",hidden:true},
        {id:"ti_start_date",name:"tp_start_date",fieldLabel:'安排日期',readOnly:true},
        {id:"ti_person",name:"tp_person",fieldLabel:"人数",editable:false,readOnly:true},
        {id:"ti_go_time",name:"ti_go_time",fieldLabel:"发车时间"},
        {id:"ti_org_id",name:"ti_org_id",fieldLabel:'车队公司ID',hidden:true},
        DetailCarBox,
        detail_driver_box,
        {id:"ti_bus_id",name:"ti_bus_id",fieldLabel:'司机信息ID',hidden:true},
        {id:'ti_money',name:'ti_money',fieldLabel:'车价'},
        {id:'ti_remark',name:'ti_remark',fieldLabel:'备注',xtype:'textarea',height:50}
    ];
    DetailCarBox.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('ti_org_id').setValue(row.get('id'));
            detail_driver_box.setValue('');
            Ext.getCmp('ti_bus_name').setValue('');
        }
    });
    detail_driver_box.on({
        select:function(c,r){
            var row=r[0];
            Ext.getCmp('ti_bus_id').setValue(row.get('u_id'));
            detail_driver_box.setValue(row.get('u_zname')+row.get('u_mob'));
        }
    });
    detail_driver_box.on({
        beforequery:function(c,r){
            detail_driver_box_params();
        }
    });
    function detail_driver_box_params(){
        var corg_id=Ext.getCmp('ti_org_id').getValue();
        SUNLINE.baseParams(detail_driver_box.store,{us_orgid:corg_id});
        detail_driver_box.store.load();
    }
    var detail_form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:detail_form_cm
    })
    //安排计划添加与编辑
    var detail_win = new Ext.Window({
        title:"安排计划",
        width:330,
        autoScroll: true,
        modal : true,
        closeAction:'hide',
        items: detail_form,
        buttons:[
            {text:'保存编辑',handler:detail_pres_edit},
            {text:'关闭',handler:function(){
                detail_win.hide();
            }}
        ]
    });
    //编辑接送信息
    function detail_pres_edit(t){
        var d_form = detail_form.getForm();
        if(!d_form.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var data=d_form.getValues();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/seat_arranged_list',
            params: {from_data:Ext.encode(data),plan_list:Ext.encode(PlanInfo)},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                var info=r.info;
                Ext.Msg.alert('友情提示', info.msg);
                if(r.status){
                    detail_win.hide();
                    var data_row=info.tp_data;
                    var tp_id=[];
                    var tp_arr={};
                    Ext.each(data_row,function(v,i){
                        tp_id.push(v.tp_id);
                        tp_arr[v.start_date+'-'+ v.start_site+'-'+ v.start_stname+'-'+ v.bus_number]= v.tp_id;
                    });
                    Ext.each(PlanInfo,function(pv,pi){
                        var str=pv.start_date+'-'+ pv.start_site+'-'+ pv.start_stname+'-'+ pv.bus_number;
                        if(tp_arr[str]>0)PlanInfo[pi]['tp_id']=tp_arr[str];
                    });
                    console.log(PlanInfo);
                    SUNLINE.baseParams(detail_store,{tp_id:Ext.encode(tp_id)});
                    detail_store.reload();
                }
                myMask.hide();
            }
        });
    }
    /!**
     * 添加或编辑接送明细信息
     * @param b
     * @returns {boolean}
     *!/
    function detail_trans_plan(b){
        var rows=grid.getSelectionModel().getSelection();
        if(!rows[0]){
            Ext.Msg.alert('友情提示','请选择需要编辑的接送信息!');
            return false;
        }
        var row={},bus_number='',bool=true,pop_num= 0,start_date='';
        PlanInfo=[];
        Ext.each(rows,function(v,i){
            var rw= v.data;
            if(bus_number!=rw.bus_number && bus_number){
                bool=false;
            }
            if(!start_date){
                bus_number=rw.bus_number;
                start_date=rw.start_date;
            }
            pop_num+=rw.pop_num;
            PlanInfo.push(rw);
        });
        row.tp_person=pop_num;
        row.ti_start_date=start_date;
        if(b.text=='编辑接送计划'){
            var detail_row=SUNLINE.getSelected(tp_detail_grid);
            detail_row=detail_row.data;
            row.ti_number=detail_row.ti_number;
            row.ti_go_time=detail_row.ti_go_time;
            row.ti_org_id=detail_row.ti_org_id;
            row.ti_org_name=detail_row.ti_org_name;
            row.ti_bus_id=detail_row.ti_bus_id;
            row.ti_bus_name=detail_row.ti_bus_name;
            row.ti_money=detail_row.ti_money;
            row.ti_remark=detail_row.ti_remark;
            row.tp_person=detail_row.ti_num;
            row.ti_id=detail_row.ti_id;
        }
        detail_win.show();
        var d_from=detail_form.getForm();
        d_from.reset();
        d_from.setValues(row);
    }

    /!**
     * 删除接送明细
     * @returns {boolean}
     *!/
    function detail_del(){
        var detail_row=SUNLINE.getSelected(tp_detail_grid);
        if(!detail_row){
            Ext.Msg.alert('友情提示','请选择需要删除的接送明细!');
            return false;
        }
        console.log(detail_row)
        Ext.MessageBox.confirm('友情提示','你确定需要删除当前接送明细吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/TransPlan/trans_detail_del',
                params: {ti_id:detail_row.data.ti_id},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status)detail_store.reload();
                    myMask.hide();
                }
            })
        });
    }
    //接送计划添加、编辑(end)*/


    //操作接送计划明细(end)

    ziyo_log({ listeners : [{grid: grid, action:'TransPlan', pk_id:'tp_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
})