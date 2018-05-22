/**
 * Created by Johony on 16-2-26.
 */
var usInfo = {};//存储查询条件
Ext.onReady(function(){
    var lf_store = SUNLINE.JsonStore($__app__+'/TransPlan/plan_list_data',[]);
    var ri_store = SUNLINE.JsonStore($__app__+'/TransPlan/plan_detail_list',[],false);

    function getThisDate(str){
        var year = str.substr(0,4);
        var mon = str.substr(4,2);
        var day = str.substr(6,2);
        var date = year+'/'+mon+'/'+day;
        return new Date(date);
    }
    /*lf_store.on('load',function(){

    })*/
    var lf_cm = [
        new Ext.grid.RowNumberer(),
        {header:'接送ID',dataIndex:'tp_id',hidden:true},
        {header:'类型',dataIndex:'tp_type',align:'left',width:80},
        {header:'出发口岸名称',dataIndex:'tp_sb_text',align:'center',width:150},
        {header:'出发日期',dataIndex:'tp_start_date',align:'center',width:100},
        {header:'出发时间',dataIndex:'tp_go_time',align:'center',width:100},
        {header:'司机信息',dataIndex:'tp_driver_text',align:'center',width:150},
        {header:'车辆信息',dataIndex:'tp_bus_text',align:'center',width:130},
        {header:'预估价格',dataIndex:'tp_forecast_money',hidden:true},
        {header:'实际价格',dataIndex:'tp_real_money',hidden:true},
        {header:'人数',dataIndex:'tp_person',align:'center',width:60},
        {header:'短信',dataIndex:'tp_sms',align:'center',width:60}
    ];
    var start_time=SUNLINE.ExtDateField({
        id:'pd_start_date_id',
        width:120,
        labelWidth:0,
        name:'pd_start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'pd_end_date_id',
        start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'pd_end_date_id',
        width:120,
        labelWidth:0,
        name:'pd_end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'pd_start_date_id'
    });
    var start_site=SUNLINE.StartSiteBox({
        config:{
            displayField:'text',
            valueField:'text',
            fieldLabel:'出发口岸',
            labelWidth:60,
            width:220,
            labelAlign:'right',
            //value:'全部口岸'
        }
    });
    var lf_grid = Ext.create('Ext.grid.Panel',{
        region:'west',
        store:lf_store,
        columns:lf_cm,
        style:'border-top:2px solid #009DDA',
        fixed:true,
        width:870,
        viewConfig:{emptyText:'没有符合你要查找的内容，点击查询试试看╮(╯_╰)╭'},
        tbar:[
            {text:'编辑接送计划',iconCls:'button-edit',handler:editPlans,disabled:isDisabled('TransPlan::PlansEdit')},
            '-',
            {text:'撤消接送计划', iconCls:'button-del',handler:delPlane,disabled:isDisabled('TransPlan::bus_plan_del')},
            '-',
            {text:'修改接送金额',iconCls:'button-edit',handler:editMoney,disabled:isDisabled('TransPlan::MoneyEdit')},
            '-',
            {text:'打印计划', iconCls:'button-print',handler:printPlane,disabled:isDisabled('TransPlan::PrintPlane')},
            '-',
            {text:'导出计划', iconCls:'button-article',handler:downLoadPlane,disabled:isDisabled('TransPlan::PlaneDownload')},
            '-',
            {text:'发送消息', iconCls:'button-write',handler:transMess,disabled:isDisabled('TransPlan::transMess')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: lf_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    })

    var dri_store = SUNLINE.JsonStore($__app__+'/TransPlan/getDrivers',['d_id','u_name','u_mobile'], false);
    var car_store = SUNLINE.JsonStore($__app__+'/TransPlan/getCars',['c_id','c_mark','c_brand','c_people'], false);
    var car_type=SUNLINE.ComBoxPlus({
        id:'tp_car_type',
        fields:['d_id','d_text','d_type'],
        url:$__app__+'/Dict/dict_json',
        where:{d_type:'车辆车型'},
        config:{displayField:'d_text',valueField:'d_text',value:'',fieldLabel: '车辆类型',labelWidth:90,labelAlign:'right',hidden:true}
    });
    var cm = [
        {id:"tp_id",name:"tp_id",hidden:true,allowBlank:false},
        {id:"tp_bus_text",name:"tp_bus_text",fieldLabel:"车辆信息",hidden:true},
        {id:"tp_driver_text",name:"tp_driver_text",fieldLabel:'司机ID',hidden:true},
        {id:"tp_sid",name:"tp_sid",fieldLabel:'座位ID',hidden:true},
        {id:"tp_type",name:"tp_type",fieldLabel:"接送类型",editable:false,readOnly:true,hidden:true},
        {id:"tp_station_text",name:"tp_station_text",fieldLabel:"出发站点",editable:false,readOnly:true,hidden:true},
        {id:"tp_sb_text",name:"tp_sb_text",fieldLabel:'出发口岸',editable:false,readOnly:true},
        {id:"tp_area",name:'tp_area',fieldLabel:'出发城市',editable:false,readOnly:true,hidden:true},
        {id:'tp_start_date',name:'tp_start_date',fieldLabel:'出发日期',editable:false,readOnly:true},
        {id:'tp_car_org_id',name:'tp_car_org_id',fieldLabel:'车辆公司ID',hidden:true},
        {
            id:'tp_car_org_name',
            name:'tp_car_org_name',
            fieldLabel:'车辆公司',
            xtype:'combo',
            editable:true,
            store:SUNLINE.JsonStore($__app__+'/TransPlan/getCarOrg',['id','text'],false),
            loadingText:'正在加载数据',
            displayField:'text',
            valueField:'text',
            queryMode:'remote',
            selectOnFocus:true,
            allowBlank:false,
            emptyText:'请选择车辆公司',
            listeners:{
                select:function(v,r,i){
                    var row = r[0].data;
                    Ext.getCmp('tp_api_type').setValue(row.org_api_type);
                    Ext.getCmp('tp_driver').setValue();
                    Ext.getCmp('tp_driver_text').setValue();
                    Ext.getCmp('tp_bus').setValue();
                    Ext.getCmp('tp_bus_text').setValue();
                    Ext.getCmp('tp_car_num').setValue();
                    car_type.setValue();
                    Ext.getCmp('tp_forecast_money').setValue();
                    Ext.getCmp('tp_real_money').setValue();
                    Ext.getCmp('tp_specail_serve').setValue();
                    Ext.getCmp('tp_car_org_id').setValue(row.id);
                    if(row.text != '测试厦门'){
                        Ext.getCmp('tp_car_num').setHidden(true);
                        car_type.setHidden(true);
                        Ext.getCmp('tp_driver').setHidden(false);
                        Ext.getCmp('tp_specail_serve').setHidden(true);
                        Ext.getCmp('tp_forecast_money').setHidden(false);
                        Ext.getCmp('tp_real_money').setHidden(false);
                        Ext.getCmp('tp_bus').setHidden(false);
                        Ext.getCmp('tp_go_time').allowBlank=true;
                        Ext.getCmp('tp_car_num').allowBlank=true;
                        car_type.allowBlank=true;
                        Ext.getCmp('tp_api_type').setValue('内部');
                        var startDate = Ext.getCmp('tp_start_date').getValue();
                        SUNLINE.baseParams(dri_store,{d_org_id:row.id,date:startDate});
                        dri_store.reload();
                        SUNLINE.baseParams(car_store,{c_org_id:row.id,date:startDate});
                        car_store.reload();
                    }else{
                        Ext.getCmp('tp_car_num').setHidden(false);
                        car_type.setHidden(false);
                        Ext.getCmp('tp_forecast_money').setHidden(true);
                        Ext.getCmp('tp_real_money').setHidden(true);
                        Ext.getCmp('tp_go_time').allowBlank=false;
                        Ext.getCmp('tp_car_num').allowBlank=false;
                        car_type.allowBlank=false;
                        Ext.getCmp('tp_driver').setHidden(true);
                        Ext.getCmp('tp_bus').setHidden(true);
                        Ext.getCmp('tp_specail_serve').setHidden(false);
                        Ext.getCmp('tp_driver').allowBlank=true;
                        Ext.getCmp('tp_bus').allowBlank=true;
                        Ext.getCmp('tp_api_type').setValue('接口');
                    }
                }
            }
        },
        {
            id:"tp_driver",
            name:"tp_driver",
            fieldLabel:'司机姓名',
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_name} - {u_mobile}' +
                '<tpl if = "plan == true">',
                '<font style = "color:red" title="{site}-{time}">(已安排)</font>',
                '</tpl>',
                '</li>',
                '</tpl></ul>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{u_name} - {u_mobile}',
                '</tpl>'
            ),
            xtype:"combo",
            editable:true,
            triggerAction:"all",
            store:dri_store,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            displayField:'u_name',
            valueField:'d_id',
            queryMode:'remote',
            typeAhead: true,
            selectOnFocus:true,
            emptyText:'请选择司机',
            allowBlank:false,
            hidden:true,
            listeners:{
                select:function(v,r,i){
                    var row= r[0];
                    var str = row.get('u_name')+'--'+row.get('u_mobile');
                    Ext.getCmp('tp_driver_text').setValue(str);
                }
            }
        },
        {
            id:"tp_bus",
            name:"tp_bus",
            fieldLabel:"车辆信息",
            xtype:"combo",
            editable:true,
            triggerAction:"all",
            store:car_store,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            valueField:'c_id',
            queryMode:'remote',
            typeAhead: true,
            selectOnFocus:true,
            emptyText:'请选择车辆',
            allowBlank:false,
            hidden:true,
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{c_brand} - {c_mark} - {c_people}人' +
                '<tpl if = "plan == true">',
                '<font style = "color:red">({num})</font>',
                '</tpl>',
                '</li>',
                '</tpl></ul>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{c_brand} - {c_mark} - {c_people}人',
                '</tpl>'
            ),
            listeners:{
                select:function(v,i,r){
                    var row= i[0];
                    Ext.getCmp('tp_bus_text').setValue(row.get('c_brand')+'-'+ row.get('c_mark')+'-'+ row.get('c_people')+'人');
                }
            }
        },
        {id:'tp_person',name:'tp_person',fieldLabel:'人数',allowBlank:false,readOnly:true},
        {id:'tp_api_type',name:'tp_api_type',fieldLabel:'数据类型',hidden:true},
        {id:'tp_car_num',name:'tp_car_num',fieldLabel:'车辆数',allowBlank:false,hidden:true},
        car_type,
        {id:'tp_go_time',name:'tp_go_time',fieldLabel:'发车时间',editable:true,emptyText:'请填写发车时间',allowBlank:false},
        {id:'tp_forecast_money',name:'tp_forecast_money',fieldLabel:'预估价格',emptyText:'预估价格',allowBlank:true,hidden:true},
        {id:'tp_real_money',name:'tp_real_money',fieldLabel:'实际价格',emptyText:'实际价格',allowBlank:true,hidden:true},
        {id:'tp_specail_serve',name:'tp_specail_serve',fieldLabel:'特殊服务',hidden:true}
    ];
    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        region:'center',
        anchor: '100%',
        items:[
            {
                defaults:{
                    labelWidth:90,
                    width:400,
                    labelAlign:'right',
                    xtype:'textfield'
                },
                items:cm
            }
        ]
    })
    var win = Ext.create('Ext.window.Window',{
        title:"修改计划",
        width:450,
        closeAction:'hide',
        items:[form],
        modal:true,
        buttons:[
            {text:'保存',handler:editSubmit},
            {text:'关闭',handler:function(){win.hide()}}
        ],
    });
    function editPlans(){
        var row = SUNLINE.getSelected(lf_grid);
        if(row == null){
            Ext.Msg.alert('友情提示','请选择你编辑的记录!');
            return false;
        }
        win.show();
        form.getForm().setValues(row.data);
    }

    function editSubmit(){
        var formVal = form.getForm();
        if(!formVal.isValid()){
            Ext.Msg.alert('温馨提示','请将表单中红色边框的内容填写完整');
            return false;
        }
        var v = form.getValues();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/save',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    formVal.reset();
                    win.hide();
                    lf_store.reload();
                    ri_store.removeAll();
                }
            }
        })

    }
    function planeSearch(){
        var skey=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(lf_store,{skey:skey});
        lf_store.currentPage=1;
        lf_store.load();
    }
    function UsPlaneSearch(){
        var row = SUNLINE.getSelected(lf_grid);
        if(typeof row == 'undefined'){
            Ext.Msg.alert('温馨提示','请在左侧列表中选择要查询的计划');
            return false;
        }
        var tp_id = row.data.tp_id;
        var skey=Ext.getCmp('plUse_Search').getValue();
        SUNLINE.baseParams(ri_store,{tp_id:tp_id,skey:skey});
        ri_store.currentPage=1;
        ri_store.load();
    }
    function creatDate(date){
        var year = date.getFullYear();
        var mon = date.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = date.getDate();
        if(day<10){
            day = '0'+day;
        }
        return year+mon+day;
    }
    function getTopInfo(){
        usInfo.type = Ext.getCmp('ob_goto_type').value;
        var start_date = start_time.getValue();
        var end_date = end_time.getValue();
        usInfo.site_val = start_site.getValue();
        if(usInfo.site_val == '全部口岸'){
            usInfo.site_val = '';
        }
        usInfo.start = creatDate(start_date);
        usInfo.end = creatDate(end_date);
    }
    function selectInfo(){
        getTopInfo();
        SUNLINE.baseParams(lf_store,{o_start_date:usInfo.start,o_end_date:usInfo.end,ob_goto_type:usInfo.type,start_site:usInfo.site_val});
        lf_store.load();
    }

    /**************************************************/
    lf_grid.on('cellclick',function(v,i,d,r){
        var row={};
        row=r.data;
        SUNLINE.baseParams(ri_store,{tp_id:row.tp_id});
        ri_store.load();
    });

    var ri_cm = [
        {header:'座位ID',dataIndex:'s_id',hidden:true},
        {header:'上车时间',dataIndex:'ob_start_time',align:'left',width:80,renderer:function(v){
            if(v>0)return v;
            return '<p style = "color:red">待通知</p>';
        }},
        {header:'上车站点',dataIndex:'site_name',align:'center',width:150},
        {header:'游客姓名',dataIndex:'s_vip_name',align:'center',width:100},
        {header:'游客手机',dataIndex:'s_vip_mob',align:'center',width:100},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:150},
        {header:'航班编号',dataIndex:'ob_bus_number',align:'center',width:100,renderer:function(v){
            if(v!='')return v;
            return '<p style = "color:red">无</p>';
        }}
    ];

    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:ri_store,
        columns:ri_cm,
        fixed:true,
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'移除选中游客', iconCls:'button-del',handler:removeThis,disabled:isDisabled('TransPlan::busPlanDel')},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'plUse_Search',
                cls:'search-icon-cls',
                emptyText : '游客姓名,游客手机号,订单编号,站点名称,航班编号',
                width:180,
                onTriggerClick:function(e){
                    UsPlaneSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            UsPlaneSearch();
                    }
                }
            }

        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: ri_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    })
    var r = {};

    /**
     * 判断是否选择了一行
     * @param v
     * @returns {boolean}
     */
    function checkSelect(girdName,v){
        r = SUNLINE.getSelected(girdName);
        if(r==null){
            Ext.Msg.alert('友情提示','请选择你'+v+'的记录!');
            return false;
        }
    }


    /**
     * 提交数据
     * @param v
     */
    function extAjax(v){
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/bus_plan_del',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    lf_store.reload();
                    ri_store.removeAll();
                }
            }
        })
    }

    /**
     * 撤销计划
     * @param t
     */
    function delPlane(t){
        checkSelect(lf_grid,t.text);
        if(typeof r !='undefined'){
            var info = r.data;
            var row = {};
            row.tp_id = info.tp_id;
            row.tp_status = 'del';
            extAjax(row);
            ri_store.remove();
        }
    }

    /**
     * 从计划中移除某个人
     * @param t
     */
    function removeThis(t){
        checkSelect(ri_grid,t.text);
        if(typeof r != 'undefined'){
            var info = r.data;
            var row = {};
            row.tp_id = info.s_tpid;
            row.not_sid=[];
            row.not_sid.push(info.s_id);
            extAjax(row);
        }
    }

    /**
     * 打印计划
     * @param t
     */
    function printPlane(t){
        checkSelect(lf_grid,t.text);
        if(typeof r != 'undefined'){
            var info = r.data;
            var tp_id = info.tp_id;
            window.location = $__app__+'/TransPlan/PrintPlane/tp_id-'+tp_id;
        }
    }

    /**
     * 导出计划
     * @param t
     */
    function downLoadPlane(t){
        checkSelect(lf_grid,t.text);
        if(typeof r != 'undefined'){
            var info = r.data;
            var tp_id = info.tp_id;
            window.location = $__app__+'/TransPlan/PlaneDownload/tp_id-'+tp_id;
        }
    }

    /**
     * 发送消息
     * @param t
     */
    function transMess(t){
        checkSelect(lf_grid,t.text);
    }

    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[lf_grid,ri_grid],
        tbar:[
            /*'<span style = "color:#009DDA;font-size: 15px;font-weight: bolder">接送计划列表</span>',*/
            /*'<a style = "cursor: pointer;color:#009DDA" onclick=backPlaneInfo()><< 返回接送明细</a>',*/
            {
                id:"ob_goto_type",
                name:"ob_goto_type",
                fieldLabel:"类型",
                xtype:"combo",
                editable:false,
                width:120,
                labelWidth:30,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['ob_goto_type'],
                    data:[
                        ['去程'],
                        ['返程']
                    ]
                }),
                displayField:"ob_goto_type",
                valueField:"ob_goto_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"去程"
            },
            '-',
            '出发时间',
            start_time,
            '至',
            end_time,
            start_site,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '-',
            /*{text:'修改接送金额',iconCls:'button-edit',handler:editMoney,disabled:isDisabled('TransPlan::MoneyEdit')},
            '-',
            {text:'撤消接送计划', iconCls:'button-del',handler:delPlane,disabled:isDisabled('TransPlan::bus_plan_del')},
            '-',
            {text:'打印计划', iconCls:'button-print',handler:printPlane,disabled:isDisabled('TransPlan::PrintPlane')},
            '-',
            {text:'导出计划', iconCls:'button-article',handler:downLoadPlane,disabled:isDisabled('TransPlan::PlaneDownload')},
            '-',
            {text:'发送消息', iconCls:'button-write',handler:transMess,disabled:isDisabled('TransPlan::transMess')},
            '-',*/
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '司机名称、车牌号、出发口岸',
                width:180,
                onTriggerClick:function(e){
                    planeSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            planeSearch();
                    }
                }
            },
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){parent.CloseTab()}}
        ]
    });
    var monCm = [
        {id:"tp_id",name:"tp_id",fieldLabel:"计划ID",hidden:true},
        {id:'tp_forecast_money',name:'tp_forecast_money',fieldLabel:'预估价格',emptyText:'预估价格',allowBlank:false},
        {id:'tp_real_money',name:'tp_real_money',fieldLabel:'实际价格',emptyText:'实际价格',allowBlank:false}
    ];
    var monForm = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:monCm
    })
    var monWin = Ext.create('Ext.window.Window',{
        title:"修改接送金额",
        width:330,
        /*height:245,*/
        autoScroll: true,
        closeAction:'hide',
        items: monForm,
        buttons:[
            {text:'确认',handler:monSubmit},
            {text:'关闭',handler:function(){ monWin.hide(); }}
        ]
    })
    function monSubmit(){
        var iform = monForm.getForm();
        var v=iform.getValues();
        if(!iform.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/save',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    iform.reset();
                    monWin.hide();
                    lf_store.reload();
                }
            }
        })
    }
    function editMoney(v){
        r = SUNLINE.getSelected(lf_grid);
        if(r==null){
            Ext.Msg.alert('友情提示','请选择你'+ v.text+'的记录!');
            return false;
        }
        monWin.show();
        monForm.getForm().setValues(r.data);
    }

    /*window.backPlaneInfo=function(){
        if(urlData){
            var StrType = urlData.ob_goto_type;
            var StrSite = urlData.ob_start_site;
            var StrDate = urlData.s_start_date;
        }else{
            var StrType = usInfo.type;
            var StrSite = usInfo.site_val;
            var StrDate = usInfo.start;
        }
        var str = 's_start_date-'+StrDate+'-ob_start_site-'+StrSite+'-ob_goto_type-'+StrType;
        parent.OpenTab('接送明细', 'Plane'+str, '', $__app__+'/TransPlan/Plane/'+str, 1);
    }*/
    if(urlData){
        if(urlData.s_start_date){
            var date = getThisDate(urlData.s_start_date);
            start_time.setValue(date);
            end_time.setValue(date);
        }
        if(urlData.ob_start_site){
            start_site.setValue(urlData.ob_start_site);
        }
        if(urlData.ob_goto_type){
            Ext.getCmp('ob_goto_type').setValue(urlData.ob_goto_type);
        }
        var date =  start_time.getValue();
        var type = Ext.getCmp('ob_goto_type').getValue();
        var site = start_site.getValue();
        SUNLINE.baseParams(lf_store,{o_start_date:date,o_end_date:date,ob_goto_type:type,start_site:site});
        lf_store.load();
    }
    ziyo_log({ listeners : [{grid: lf_grid, action:'TransPlan', pk_id:'tp_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
})