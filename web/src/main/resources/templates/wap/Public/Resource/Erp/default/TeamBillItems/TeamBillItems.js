var WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '导游报账管理';

    function quan_gudie(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_guide_tel+'">'+v+'</span>'
        }
        return v;
    }
    function di_gudie(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_local_guide_tel+'">'+v+'</span>'
        }
        return v;
    }
    function driver_plan(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_driver_tel+'">'+v+'</span>'
        }
        return v;
    }
    function receipt_mod(v,m,r){
        if(v)return '<span title="'+v+'">'+v+'</span>';
    }
    var si_url = $__app__ + '/TeamBillItems/select_data';
    var si_field = [{name:"si_id"}];
    var si_store = new SUNLINE.JsonStore(si_url, si_field);
    var si_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"team_id", dataIndex:"team_id", width:50, hidden:true},
        {header:"团队编号", dataIndex:"team_num", width:180},
        {header:"线路名称", dataIndex:"team_name", width:200},
        {header:"发车时间", dataIndex:"team_start_date", width:140,renderer:function(v,m,r){
            var time=r.get('team_start_date').substr(0,4) + '-' + r.get('team_start_date').substr(4,2) + '-' + r.get('team_start_date').substr(6,2);
            if(r.get('team_start_time')!='00') time=time+' '+r.get('team_start_time');
            return time;
        }},
        {header:"状态", dataIndex:"team_credit_status", width:180,renderer:function(v,m,r){
            if(v=="审核中"){
                var status4='';
                var status1='';
                var status2='';
                var status3='';
                var status5='';
                if(r.get('team_root_name')){
                    status1="<span style='color: #24840b'>房调、</font>";
                }else{
                    status1="<span style='color: #f00000'>房调、</font>";
                }
                if(r.get('team_survey_name')){
                    status2="<span style='color: #24840b'>计调、</font>";
                }else{
                    status2="<span style='color: #f00000'>计调、</font>";
                }
                if(r.get('team_finance_name')){
                    status3="<span style='color: #24840b'>财务、</font>";
                }else{
                    status3="<span style='color: #f00000'>财务、</font>";
                }
                if(!status5)status5="<span style='color: #24840b'>已报账</font>";
                status4=status1+status2+status3+status5;
                v=status4;
            }else if(v=="审核完成"){
                v="<span style='color: #24840b'>"+v+"</font>";
            }else if(v=="审核驳回"){
                v="<span style='color: #9a1c21;font-weight: bold'>"+v+"</font>";
            }else if(v=='报账中'){
                v="<span style='color: #8e5da5'>报账中</font>";
            }else{
                v="<span style='color: #004ca5'>"+v+"</font>";
            }
            return v;
        }},
        {header:"人数", dataIndex:"team_saled", width:60,align:"right"},
        {header:"领用费用", dataIndex:"team_total_fee", width:100,renderer:money_g,align:"right"},
        {header:"支出（现金）", dataIndex:"team_pay_money", width:120,renderer:money_g,align:"right"},
        {header:"收入（现金）", dataIndex:"team_temp_income", width:120,renderer:money_g,align:"right"},
        {header:"团款剩余", dataIndex:"team_surplus_money", width:100,renderer:money_g,align:"right"},
        {header:"毛利", dataIndex:"team_gross_money", width:100,renderer:money_g,align:"right"},
        {header:"全陪导游",dataIndex:"team_guide_name",width:80, renderer:quan_gudie},
        {header:"地陪导游",dataIndex:"team_local_guide_name",width:80, renderer:di_gudie},
        {header:"车辆信息", dataIndex:"team_bus", width:100},
        {header:"司机信息",dataIndex:"team_driver_name",width:80, renderer:driver_plan},
        {header:"签单/回执单", dataIndex:"team_receipt", width:120, renderer:receipt_mod},
    ];
    function money_g(v,m,r){
        if(!v) v = "0.00";
        return '￥'+ (parseFloat(v).toFixed(2));
    }
    //车队公司
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        var company_box=SUNLINE.CompanyBox_guide({
            where:{org_type:'管理公司'}
        });
    }else{
        var company_box='<b>'+_uinfo['org_name']+'</b>';
    }
    var Products_OrgCombo=SUNLINE.OrgCombo_Products({listConfig:{minWidth:320},name:'p_name',valueField:'p_id',id:'p_name_id',width:245,listWidth:250,editable:true,forceSelection:true});
    var Products_store=Products_OrgCombo.box.getStore();
    Products_store.on('load',function(){
        this.add({p_name:'全部产品',p_id:'全部产品'});
        Ext.getCmp('p_name_id').setValue('全部产品');
    })

    var si_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:si_cm,
        store:si_store,
        style:'border-top:2px solid #3892d3',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有导游报账信息',
            deferEmptyText:true
        },
        tbar:[

            {text:'报账',iconCls:'button-edit',id:"team_p",handler:submit_modify, disabled:isDisabled('TeamBillItems::select_item')},
            "-",
            /*{text:'回执单',iconCls:'button-add',handler:dan_modify},
            "-",*/
            {text:'查看凭证',iconCls:'button-edit',handler:image_account},
            "-",
            {text:'计调审核',iconCls:'button-sch',id:"ac_cls2",handler:submit_modify, disabled:isDisabled('TeamBillItems::examine_save')},
            "-",
            {text:'房调审核',iconCls:'button-sch',id:"ac_cls3",handler:submit_modify, disabled:isDisabled('TeamBillItems::examine_save')},
            "-",
            {text:'财务审核',iconCls:'button-sch',id:"ac_cls",handler:submit_modify, disabled:isDisabled('TeamBillItems::examine_save')},
            "-",
            {text:'单团毛利',id:"team_print",iconCls:'button-print',handler:submit_account, disabled:isDisabled('TeamBillItems::gross_select')},
            "-",
            {text:'导出支出详情',id:"derive_info",iconCls:'button-print',handler:sell_xsl, disabled:isDisabled('TeamBillItems::export_xsl')},
            "-",
            {text:'导出列表',id:"derive_list",iconCls:'button-print',handler:derive_fun, disabled:isDisabled('TeamBillItems::derive_xls')},
            '-',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'导游姓名、导游手机号',
                width:180,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            dosearch();
                    }
                }
            }
        ],
        listeners:{
            cellclick:function(v,g,n,r){
                var td_status = r.data.team_credit_status;
                switch(td_status){
                    case '未报账':
                        Ext.getCmp('team_p').setDisabled(false)
                        Ext.getCmp('ac_cls').setDisabled(true)
                        Ext.getCmp('ac_cls2').setDisabled(true)
                        Ext.getCmp('ac_cls3').setDisabled(true)
                        Ext.getCmp('team_print').setDisabled(true)
                        Ext.getCmp('derive_info').setDisabled(true)
                        break;
                    case '报账中':
                        Ext.getCmp('team_p').setDisabled(false)
                        Ext.getCmp('ac_cls').setDisabled(true)
                        Ext.getCmp('ac_cls2').setDisabled(true)
                        Ext.getCmp('ac_cls3').setDisabled(true)
                        Ext.getCmp('team_print').setDisabled(true)
                        Ext.getCmp('derive_info').setDisabled(true)
                        break;
                    case '审核中':
                        Ext.getCmp('team_p').setDisabled(false)
                        Ext.getCmp('ac_cls').setDisabled(false)
                        Ext.getCmp('ac_cls2').setDisabled(false)
                        Ext.getCmp('ac_cls3').setDisabled(false)
                        Ext.getCmp('team_print').setDisabled(false)
                        Ext.getCmp('derive_info').setDisabled(false)
                        break;
                    case '审核完成':
                        Ext.getCmp('team_p').setDisabled(true)
                        Ext.getCmp('ac_cls').setDisabled(false)
                        Ext.getCmp('ac_cls2').setDisabled(false)
                        Ext.getCmp('ac_cls3').setDisabled(false)
                        Ext.getCmp('team_print').setDisabled(false)
                        Ext.getCmp('derive_info').setDisabled(false)
                        break;
                    case '审核驳回':
                    /* Ext.getCmp('team_p').setDisabled(true)
                     Ext.getCmp('ac_cls').setDisabled(true)
                     Ext.getCmp('ac_cls2').setDisabled(true)
                     Ext.getCmp('ac_cls3').setDisabled(true)
                     Ext.getCmp('team_print').setDisabled(false)
                     Ext.getCmp('derive_info').setDisabled(false)
                     break;*/
                    default :
                        break;
                }
            }
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:si_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有导游报账信息'
        })
    });
  /*  var dan_form= new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {fieldLabel:"team_id", name:"team_id",hidden:true},
            {fieldLabel:"全陪导游", name:"team_guide_name",readOnly:true},
            {fieldLabel:"地陪导游", name:"team_local_guide_name",readOnly:true},
            {xtype:'textarea',name:"team_receipt", fieldLabel:"签单/回执单",labelWidth:80,labelAlign:"right"}
        ]
    });
    var dan_win=Ext.create('Ext.window.Window', {
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        width:380,
        items:dan_form,
        buttons:[
            {text:'保存',handler:dan_dosave},
            {text:'关闭', handler:function () {
                dan_win.hide();
            }}
        ]
    });
    function dan_dosave(){
        var data=dan_form.getForm().getValues();
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/receipt_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    dan_win.hide();
                    si_store.load();
                    Ext.Msg.alert('友情提示',info.msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function dan_modify(){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要填写回执单的团队!');
            return;
        };
        dan_win.show();
        dan_form.getForm().setValues(row.data);
    }
    dan_win.on('hide',function(){
        dan_form.form.reset();
    })*/
    var bill_url = $__app__ + '/TeamBillItems/bill_select';
    var bill_field = [{name:"si_id"}];
    var bill_store=SUNLINE.GroupingStore(bill_url,bill_field,{sortInfo:{field:'si_subject'}, groupField:'si_subject'},false);
    var grouping_bill = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个项目)"
    });
    //名字不能重复
    var grouping_bill2 = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个项目)"
    });
    function title_show(v){
        return "<span title="+v+">"+v+"</span>";
    }
    var bill_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:bill_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        features: [grouping_bill2],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"si_id", dataIndex:"si_id", width:50,hidden:true},
            {header:"si_team_id", dataIndex:"si_team_id", width:50,hidden:true},
            {header:"资源名称", dataIndex:"si_insti_name", width:160},
            {header:"项目名称", dataIndex:"si_name", width:130,renderer:title_show},
            {header:"费用类型", dataIndex:"si_subject", width:80},
            {header:"天数", dataIndex:"si_day", width:80,renderer:function(v){
                if(v=='-1')v='按团计费';
                return v;
            }},
            {header:"类型", dataIndex:"si_status", width:80}
        ]
    });
    var image_grid=new Ext.panel.Panel({
        region:'east',
        border:true,
        width:400,
        html:'<iframe src="" style="border:none;width:100%;height:100%" name="news_frame" id="news_frame"></iframe>'
    })
    var cert_remark_panel=new Ext.form.FormPanel({
        border:false,
        region:'south',
        bodyStyle:'padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {fieldLabel:"team_id",id:'team_id_cert',name:"team_id",hidden:true},
            {xtype:'textarea',id:'team_receipt_cert',name:"team_receipt", fieldLabel:"签单/回执单",labelWidth:80,labelAlign:"right",height:100}
        ]
    });

    function receipt_dosave(v){
        var data=cert_remark_panel.getForm().getValues();
        if(typeof v=='string'){
            data.team_receipt=v;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/receipt_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    image_win.hide();
                    si_store.load();
                    Ext.Msg.alert('友情提示',info.msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    var image_left_panel=new Ext.panel.Panel({
        region:'center',
        layout:'border',
        items:[bill_grid,cert_remark_panel]
    })
    var image_win=new Ext.Window({
        id:'image_win',
        layout:'border',   //左右必须有他
        autoHeight:true,
        title:'查看凭证',
        width:1000,
        height:Ext.getBody().getHeight()-50,
        resizable:false,
        autoScroll : true,
        closeAction:'hide',
        modal:true,
        items:[image_grid,image_left_panel],
        buttons:[
            {text:'保存', handler:receipt_dosave},
            {text:'凭证齐全', handler:function(){receipt_dosave('凭证齐全')}},
            {text:'关闭', handler:function(){ image_win.hide();}}
        ]
    })
    bill_grid.getSelectionModel().on('select',function(t,r){
        var row= r;
        var url = $__app__ + '/TeamBillItems/image_select/si_id/'+row.get('si_id')+'/team_id/'+row.get('si_team_id');
        window.news_frame.location = url;
    });
    image_win.on('hide',function(){
        var url = $__app__ + '/TeamBillItems/kbai';
        window.news_frame.location = url;
    })
    function image_account(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        if (row.data.team_credit_status=='未报账') {
            Ext.Msg.alert('友情提示', '未报账的团队没有凭证!');
            return;
        };
        image_win.show();
        Ext.getCmp('team_receipt_cert').setValue(row.data.team_receipt);
        Ext.getCmp('team_id_cert').setValue(row.data.team_id);
        SUNLINE.baseParams(bill_store,{team_id:row.data.team_id});
        bill_store.currentPage=1;
        bill_store.load();
    }

    function dosearch(){
        var key = Ext.getCmp("search").getValue();

        var tx = Ext.getCmp("search_cls").getText();
        if(tx=="查询全部") tx = "";
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            if(WG.num==1){
                org_id=1;
            }else{
                org_id=Ext.getCmp(company_box.id).getValue();
            }
        }else{
            org_id= _uinfo['org_id'];
        }
        var p_name_id=Ext.getCmp('p_name_id').getValue();
        var t_start_time=Ext.getCmp('t_start_time').getRawValue();
        var t_end_time=Ext.getCmp('t_end_time').getRawValue();
        SUNLINE.baseParams(si_store,{skey:key,team_org_id:org_id,team_p_id:p_name_id,start_time:t_start_time,end_time:t_start_time,team_credit_status:tx});
        si_store.currentPage=1;
        si_store.load();
    }

    //报账
    function num_tips(v,m,r){
        return '<span qtip="'+v+'">'+v+'</span>';
    }
    var exc_url = $__app__ + '/TeamBillItems/kbai';
    var exc_f=['si_id'];
    //var income_store = SUNLINE.JsonStore(exc_url, exc_f, false);
    //var plan_store = SUNLINE.JsonStore(exc_url, exc_f, false);

    function group_day(v){
        if (v==-1){
            return "按团计费";
        } else{
            return "第"+ v +"天的消费项目";
        }

    };
    function ti_day(v){
        if (v==-1) return '-';
        return '第'+ v +'天';
    };
    var two_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"si_team_id", dataIndex:"si_team_id", width:10,hidden:true},
        {header:"si_id", dataIndex:"si_id", width:10,hidden:true},
        {header:"si_name_id", dataIndex:"si_name_id", width:10,hidden:true},
        {header:"资源名称", dataIndex:"si_insti_name", width:130},
        {header:"项目名称", dataIndex:"si_name", width:100,renderer:title_show},
        {header:"单价", dataIndex:"si_settle", width:80,align:'right',renderer:function(v,i,r){
            if(r.data.si_subject=='购物店'){
                return '--'
            }else{
                return '￥'+v;
            }
        }},
        {header:"人数", dataIndex:"si_count", width:80,align:'center'},
        {header:"总金额", dataIndex:"si_money", width:80,align:'right',renderer:money},
        {header:"结算类型", dataIndex:"si_settle_type", width:100},
        {header:"签单编号", dataIndex:"si_qd_num", width:100},
        {header:"联系人", dataIndex:"si_man", width:100},
        {header:"联系方式", dataIndex:"si_man_tel", width:100},
        {header:"备注", dataIndex:"si_remark", width:100},
        {header:'操作',dataIndex:'s_start_date',align:'center',width:120,renderer:function(v,n,r){
            var reStr = '<span style = "cursor: pointer;color:#0000ff" onclick = planeInfo("'+r.get('si_id')+'")>[ 编辑 ]</span>';
            var plStr = '<span style = "cursor: pointer;color:#0000ff" onclick = planeList("'+r.get('si_id')+'")>[ 删除 ]</span>';
            return reStr+' | '+plStr;
        }}
    ]
    window.planeList=function(v){
        var row = SUNLINE.getSelected(si_grid);
        Ext.MessageBox.confirm('友情提示','您确定要删除么？',function(id){
            if (id == 'yes') {
                Ext.Ajax.request({
                    url:$__app__ + '/TeamBillItems/del',
                    params:{si_id:v},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            ajax_load(row.data.team_id);
                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }})
    }
    window.planeInfo=function(v){
        shop_win.show();
        Ext.getCmp('form_liushui').disable().setHidden(true);
        Ext.getCmp('form_pct_num').disable().setHidden(true);
        Ext.getCmp('form_trade_price').setReadOnly(false)
        Ext.getCmp('form_pct_num').setReadOnly(false)
        Ext.getCmp('form_all_money').setReadOnly(false)
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/one_find',
            params:{si_id:v},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                store_form.getForm().setValues(info.msg);
                Ext.getCmp('form_all_money').setValue(info.msg.si_money);
                shop_win.setTitle(info.msg.si_subject+'支出信息');
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })

    }
    var income_url = $__app__ + '/TeamBillItems/income_select';
    var income_field = [{name:"si_id"}];
    //新的DataView数据源
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "si_id,si_team_id,si_name_id,si_insti_name,si_name,si_settle,si_count,si_money"]
    });
    //var income_store=SUNLINE.GroupingStore(income_url,income_store,{sortInfo:{field:'si_subject'}, groupField:'si_subject'},false);
    var income_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });
    var grouping_income = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个项目)"
    });
    function items_del(){
        return '<i class="fa fa-times" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
    };
    function items_save(){
        return '<i class="fa fa-pencil-square-o" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以编辑"></i>';
    };

    var income_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:income_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目',
            deferEmptyText:true
        },
        features: [grouping_income],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"si_team_id", dataIndex:"si_team_id", width:10,hidden:true},
            {header:"si_id", dataIndex:"si_id", width:10,hidden:true},
            {header:"si_name_id", dataIndex:"si_name_id", width:10,hidden:true},
            {header:"资源名称", dataIndex:"si_insti_name", width:130},
            {header:"项目名称", dataIndex:"si_name", width:100,renderer:title_show},
            {header:"单价", dataIndex:"si_settle", width:80,align:'right',renderer:function(v,i,r){
                if(r.data.si_subject=='购物店'){
                    return '--'
                }else{
                    return '￥'+v;
                }
            }},
            {header:"人数", dataIndex:"si_count", width:80,align:'center'},
            {header:"总金额", dataIndex:"si_money", width:80,align:'right',renderer:money},
            {header:"结算类型", dataIndex:"si_settle_type", width:100},
            {header:"签单编号", dataIndex:"si_qd_num", width:100},
            {header:"联系人", dataIndex:"si_man", width:100},
            {header:"联系方式", dataIndex:"si_man_tel", width:100},
            {header:"备注", dataIndex:"si_remark", width:100},
            {header:'操作',dataIndex:'s_start_date',align:'center',width:120,renderer:function(v,n,r){
                var reStr = '<span style = "cursor: pointer;color:#0000ff" onclick = planeInfo2("'+r.get('si_id')+'")>[ 编辑 ]</span>';
                var plStr = '<span style = "cursor: pointer;color:#0000ff" onclick = planeList2("'+r.get('si_id')+'")>[ 删除 ]</span>';
                return reStr+' | '+plStr;
            }}
        ],
        tbar : [
            {text:'购物店',iconCls:'button-add',f_type:'shop',handler:shou_modify},
            {text:'车辆',iconCls:'button-add',f_type:'car',handler:shou_modify},
            {text:'导游',iconCls:'button-add',f_type:'guides',handler:shou_modify},
            {text:'景区',iconCls:'button-add',f_type:'scenic',handler:shou_modify},
            {text:'住宿',iconCls:'button-add',f_type:'hotal',handler:shou_modify},
            {text:'餐饮',iconCls:'button-add',f_type:'caterers',handler:shou_modify},
            {text:'地接',iconCls:'button-add',f_type:'dijie',handler:shou_modify},
            {text:'大交通',iconCls:'button-add',f_type:'dajiaotong',handler:shou_modify},
            {text:'小交通',iconCls:'button-add',f_type:'xiaojiaotong',handler:shou_modify},
            {text:'保险',iconCls:'button-add',f_type:'baoxian',handler:shou_modify},
            {text:'其他',iconCls:'button-add',f_type:'out',handler:shou_modify}
        ],
    });
    window.planeList2=function(v){
        var row = SUNLINE.getSelected(si_grid);
        Ext.MessageBox.confirm('友情提示','您确定要删除么？',function(id){
            if (id == 'yes') {
                Ext.Ajax.request({
                    url:$__app__ + '/TeamBillItems/del',
                    params:{si_id:v},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            ajax_load(row.data.team_id);
                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }})
    }
    window.planeInfo2=function(v){
        shop_win.show();
        Ext.getCmp('form_liushui').disable().setHidden(true);
        Ext.getCmp('form_pct_num').disable().setHidden(true);
        Ext.getCmp('form_trade_price').setReadOnly(false)
        Ext.getCmp('form_pct_num').setReadOnly(false)
        Ext.getCmp('form_all_money').setReadOnly(false)
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/one_find',
            params:{si_id:v},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if(info.msg.si_subject=='购物店'){
                    Ext.getCmp('form_liushui').enable().setHidden(false);
                    Ext.getCmp('form_pct_num').enable().setHidden(false);
                    Ext.getCmp('form_trade_price').setReadOnly(true);
                    Ext.getCmp('form_pct_num').setReadOnly(true);
                    Ext.getCmp('form_all_money').setReadOnly(true);
                }else{
                    Ext.getCmp('form_liushui').disable().setHidden(true);
                    Ext.getCmp('form_pct_num').disable().setHidden(true);
                    Ext.getCmp('form_trade_price').setReadOnly(false);
                    Ext.getCmp('form_pct_num').setReadOnly(false);
                    Ext.getCmp('form_all_money').setReadOnly(false);
                }
                store_form.getForm().setValues(info.msg);
                Ext.getCmp('form_all_money').setValue(info.msg.si_money);
                shop_win.setTitle(info.msg.si_subject+'收入信息');
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })

    }
    var exc_url = $__app__ + '/TeamBillItems/exc_select';
    var exc_field = [{name:"si_id"}];
    //var exc_store=SUNLINE.GroupingStore(exc_url,exc_field,{sortInfo:{field:'si_subject'}, groupField:'si_subject'},false);
    var exc_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });
    var grouping_exc = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个项目)"
    });
    var exc_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:exc_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目',
            deferEmptyText:true
        },
        features: [grouping_bill],
        columns:two_cm,
        tbar : [
            {text:'车辆',iconCls:'button-add',f_type:'car',handler:add_modify,},
            {text:'导游',iconCls:'button-add',f_type:'guides',handler:add_modify,},
            {text:'景区',iconCls:'button-add',f_type:'scenic',handler:add_modify,},
            {text:'住宿',iconCls:'button-add',f_type:'hotal',handler:add_modify,},
            {text:'餐饮',iconCls:'button-add',f_type:'caterers',handler:add_modify,},
            {text:'地接',iconCls:'button-add',f_type:'dijie',handler:add_modify,},
            {text:'大交通',iconCls:'button-add',f_type:'dajiaotong',handler:add_modify,},
            {text:'小交通',iconCls:'button-add',f_type:'xiaojiaotong',handler:add_modify,},
            {text:'保险',iconCls:'button-add',f_type:'baoxian',handler:add_modify,},
            {text:'其他',iconCls:'button-add',f_type:'out',handler:add_modify,}
        ],
    });
    var insti_name_box_form=SUNLINE.ComBoxPlus({
        id:'insti_name_form',
        fields:['id','text'],url:$__app__ + '/Team/items_data',
        config:{
            displayField:'text',
            valueField:'text',
            width:230,
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20,
            fieldLabel:"<span style='color:red'> * </span>资源名称",
            labelWidth:80,
            labelAlign:"right",
            name:"si_insti_name",
            listConfig:{minWidth:320}
        }
    });
    var cs_type_name_form=SUNLINE.ComBoxPlus({
        id:'cs_type_name_form',
        fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
        config:{
            displayField:'text',
            valueField:'text',
            width:230,
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20,
            fieldLabel:"<span style='color:red'> * </span>项目",
            labelWidth:80,
            labelAlign:"right",
            name:"si_name"
        }
    });
    var store_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {name:"si_edit_num", fieldLabel:"si_edit_num",hidden:true},
            {name:"si_id", fieldLabel:"si_id",hidden:true},
            {name:"si_team_id", fieldLabel:"si_team_id",hidden:true,id:'form_team_id'},
            {name:"si_name_id", fieldLabel:"si_name_id",hidden:true,id:"form_name_id"},
            {name:"si_status", fieldLabel:"si_status",hidden:true,id:"form_si_status"},
            insti_name_box_form,
            cs_type_name_form,
            {fieldLabel:"项目类型", name:"si_subject",id:'form_type_new',hidden:true},
            {id:"form_type_mode", name:"si_type_mode",hidden:true,fieldLabel:"计量方式", xtype:"combo", triggerAction : "all",
                store:new Ext.data.SimpleStore({fields:['si_type_mode'], data:[
                    ['按人计算'],
                    ['按团计算']
                ]}),
                displayField:"si_type_mode",
                valueField:"si_type_mode",
                mode:"local",
                value:"按人计算",
                forceSelection : true,
                typeAhead : true,
                allowBlank:false,
                width:230
            },
            {id:"form_insti_type", name:"si_settle_type",fieldLabel:"结算方式", xtype:"combo", triggerAction : "all",
                store:new Ext.data.SimpleStore({fields:['si_settle_type'], data:[
                    ['现金'],
                    ['签单'],
                    ['预付']
                ]}),
                displayField:"si_settle_type",
                valueField:"si_settle_type",
                mode:"local",
                value:"签单",
                forceSelection : true,
                typeAhead : true,
                allowBlank:false,
                width:230
            },
            {fieldLabel:"第几天", name:"si_day",id:'form_day',hidden:true, xtype:'numberfield',value:1},
            {fieldLabel:"<span style='color:red'> * </span>数量", name:"si_count",id:'form_num', xtype:'numberfield',value:0},
            {fieldLabel:"<span style='color:red'> * </span>流水金额", name:"si_liushui",id:'form_liushui', xtype:'numberfield',value:0},
            {fieldLabel:"结算单价", name:"si_settle",id:'form_trade_price', xtype:'numberfield'},
            {fieldLabel:"总金额", name:"si_money",id:'form_all_money', xtype:'numberfield'},
            {fieldLabel:"利润百分比", name:"si_pct_num",id:'form_pct_num'},
            {fieldLabel:"签单号", name:"si_qd_num",id:'form_sign'},
            {fieldLabel:"处理状态", name:"ti_deal_status",id:'form_deal_status',hidden:true},
            {id:"form_deal_status", name:"si_status_box",hidden:true, fieldLabel:"计量方式", xtype:"combo", triggerAction : "all",
                store:new Ext.data.SimpleStore({fields:['si_status_box'], data:[
                    ['未处理'],
                    ['处理中'],
                    ['已处理']
                ]}),
                displayField:"si_status_box",
                valueField:"si_status_box",
                mode:"local",
                value:"已处理",
                forceSelection : true,
                typeAhead : true,
                allowBlank:false,
                width:230
            },
            {name:"sp_id", fieldLabel:"sp_id",hidden:true,id:"form_sp_id"},
            {fieldLabel:"联系人", name:"si_man",id:'form_man'},
            {fieldLabel:"联系方式", name:"si_man_tel",id:'form_man_tel'},
            {xtype:'textarea',id:'form_remark',name:"si_remark", fieldLabel:"备注",labelWidth:80,labelAlign:"right"}
        ]
    });

    var shop_win=Ext.create('Ext.window.Window', {
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        width:380,
        items:store_form,
        buttons:[
            {text:'确认选择',handler:shop_dosave},
            {text:'关闭', handler:function () {
                shop_win.hide();
            }}
        ]
    });
    shop_win.on('hide',function(){
        store_form.form.reset();
    })
    function shop_dosave(){
        var data= store_form.getForm().getValues();
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        if(!data['si_id']) data['si_default']='否';
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    var row = SUNLINE.getSelected(si_grid);
                    ajax_load(row.data.team_id);
                    shop_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    //双击删除项目
    /*income_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            if(c==10){
                var _row=SUNLINE.getSelected(income_grid);
                var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/TeamBillItems/del',
                    params:{si_id:_row.data.si_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            income_store.remove(_row);
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }else if(c==9){
                var _row=SUNLINE.getSelected(income_grid);
                shop_win.show();
                shop_win.setTitle(_row.data.si_subject+'收入信息');
                if(_row.data.si_subject=='购物店'){
                    Ext.getCmp('form_liushui').enable().setHidden(false);
                    Ext.getCmp('form_pct_num').enable().setHidden(false);
                    Ext.getCmp('form_trade_price').setReadOnly(true);
                    Ext.getCmp('form_pct_num').setReadOnly(true);
                    Ext.getCmp('form_all_money').setReadOnly(true);
                }else{
                    Ext.getCmp('form_liushui').disable().setHidden(true);
                    Ext.getCmp('form_pct_num').disable().setHidden(true);
                    Ext.getCmp('form_trade_price').setReadOnly(false);
                    Ext.getCmp('form_pct_num').setReadOnly(false);
                    Ext.getCmp('form_all_money').setReadOnly(false);
                }
                store_form.getForm().setValues(_row.data);
            }
        }
    });
    exc_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            console.log(c)
            if(c==10){
                var _row=SUNLINE.getSelected(exc_grid);
                var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                myMask.show();
                console.log(_row.data)
                Ext.Ajax.request({
                    url:$__app__ + '/TeamBillItems/del',
                    params:{si_id:_row.data.si_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            exc_store.load();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }else if(c==9){
                var _row=SUNLINE.getSelected(exc_grid);
                shop_win.show();
                shop_win.setTitle(_row.data.si_subject+'支出信息');
                Ext.getCmp('form_liushui').disable().setHidden(true);
                Ext.getCmp('form_pct_num').disable().setHidden(true);
                Ext.getCmp('form_trade_price').setReadOnly(false)
                Ext.getCmp('form_pct_num').setReadOnly(false)
                Ext.getCmp('form_all_money').setReadOnly(false)
                store_form.getForm().setValues(_row.data);
            }
        }
    });*/
    function shou_modify(v){
        shop_win.show();
        shop_win.setTitle(v.text+'收入信息', v.iconCls);
        /*var insti_name_box_store=insti_name_box_form.store;
        SUNLINE.baseParams(insti_name_box_store,{type: v.text});
        insti_name_box_store.currentPage=1;
        insti_name_box_store.load();*/
        Ext.getCmp('form_type_new').setValue(v.text)
        var row=SUNLINE.getSelected(si_grid);
        Ext.getCmp('form_team_id').setValue(row.data.team_id);
        Ext.getCmp('form_si_status').setValue('收入');
        if(v.text=='购物店'){
            Ext.getCmp('form_liushui').enable().setHidden(false);
            Ext.getCmp('form_pct_num').enable().setHidden(false);
            Ext.getCmp('form_trade_price').setReadOnly(true);
            Ext.getCmp('form_pct_num').setReadOnly(true);
            Ext.getCmp('form_all_money').setReadOnly(true);
        }else{
            Ext.getCmp('form_liushui').disable().setHidden(true);
            Ext.getCmp('form_pct_num').disable().setHidden(true);
            Ext.getCmp('form_trade_price').setReadOnly(false);
            Ext.getCmp('form_pct_num').setReadOnly(false);
            Ext.getCmp('form_all_money').setReadOnly(false);
        }
    }
    function add_modify(v){
        shop_win.show();
        shop_win.setTitle(v.text+'支出信息', v.iconCls);
        /*var insti_name_box_store=insti_name_box_form.store;
        SUNLINE.baseParams(insti_name_box_store,{type: v.text});
        insti_name_box_store.currentPage=1;
        insti_name_box_store.load();*/
        Ext.getCmp('form_type_new').setValue(v.text)
        var row=SUNLINE.getSelected(si_grid);
        Ext.getCmp('form_team_id').setValue(row.data.team_id);
        Ext.getCmp('form_si_status').setValue('支出');
        Ext.getCmp('form_liushui').disable().setHidden(true);
        Ext.getCmp('form_pct_num').disable().setHidden(true);
        Ext.getCmp('form_trade_price').setReadOnly(false)
        Ext.getCmp('form_pct_num').setReadOnly(false)
        Ext.getCmp('form_all_money').setReadOnly(true)
    }
    insti_name_box_form.on({
        select:function( c, r, e ){
            var r= r[0];
            Ext.getCmp('form_man_tel').setValue(r.data.rc_mobile)
            Ext.getCmp('form_man').setValue(r.data.rc_name)
            Ext.getCmp('form_name_id').setValue(r.data.id)
        }
    });
    insti_name_box_form.on({beforequery:function( c, r, i, e ){
        var sub_type=Ext.getCmp('form_type_new').getValue();
        var insti_name_box_store=insti_name_box_form.store;
        SUNLINE.baseParams(insti_name_box_store,{type:sub_type});
        insti_name_box_store.currentPage=1;
        insti_name_box_store.load();
    }
    });
    cs_type_name_form.on({
        select:function( c, r, e ){
            var r= r[0];
            var form_trade_price=r.data.price;
            var form_num=Ext.getCmp('form_num').getValue();
            if(!form_trade_price)form_trade_price=0;
            if(!form_num)form_num=0;
            Ext.getCmp('form_trade_price').setValue(form_trade_price);
            if(r.data.pay_type) Ext.getCmp('form_insti_type').setValue(r.data.pay_type);
            var price=0;
            var type=Ext.getCmp('form_type_new').getValue();
            if(type=='购物店'){
                Ext.getCmp('form_pct_num').setValue(r.data.sp_pct_num);
                Ext.getCmp('form_trade_price').setValue(r.data.sp_one_price);
                var form_liushui=Ext.getCmp('form_liushui').getValue();
                var form_pct_num=Ext.getCmp('form_pct_num').getValue();
                if(!form_liushui)form_liushui=0;
                if(!form_pct_num)form_pct_num=0;
                price=Math.round(parseFloat(form_num)*parseFloat(form_trade_price)+parseFloat(form_liushui)*parseFloat(form_pct_num)*0.01).toFixed(2);
            }else{
                price=parseFloat(form_num)*parseFloat(form_trade_price).toFixed(2);

            }
            Ext.getCmp('form_sp_id').setValue(r.data.id);
            Ext.getCmp('form_all_money').setValue(price);
        }
    });
    cs_type_name_form.on({
        beforequery:function( c, r, i, e ){
            var sub_type=Ext.getCmp('form_type_new').getValue();
            var name_id=Ext.getCmp('form_name_id').getValue();
            var row=SUNLINE.getSelected(si_grid);
            var cs_type_name_box_store=cs_type_name_form.store;
            console.log(row.data.team_start_date)
            SUNLINE.baseParams(cs_type_name_box_store,{type:sub_type,at_id:name_id,start_date:row.data.team_start_date,end_date:row.data.team_start_date});
            cs_type_name_box_store.currentPage=1;
            cs_type_name_box_store.load();
        }
    });
    Ext.getCmp('form_trade_price').on('change',function(a,nv,c){
        var type=Ext.getCmp('form_type_new').getValue();
        if(type!='购物店'){
            var form_num=Ext.getCmp('form_num').getValue();
            if(!form_num)form_num=0;
            var price=parseFloat(form_num)*parseFloat(nv).toFixed(2);
            Ext.getCmp('form_all_money').setValue(price);
        }
    })
    Ext.getCmp('form_num').on('change',function(a,nv){
        var form_trade_price=Ext.getCmp('form_trade_price').getValue();
        if(!form_trade_price)form_trade_price=0;
        var price=0;
        var type=Ext.getCmp('form_type_new').getValue();
        if(type=='购物店'){
            var form_liushui=Ext.getCmp('form_liushui').getValue();
            var form_pct_num=Ext.getCmp('form_pct_num').getValue();
            if(!form_liushui)form_liushui=0;
            if(!form_pct_num)form_pct_num=0;
            price=Math.round(parseFloat(nv)*parseFloat(form_trade_price)+parseFloat(form_liushui)*parseFloat(form_pct_num)*0.01).toFixed(2);
        }else{
            price=parseFloat(form_trade_price)*parseFloat(nv).toFixed(2);
        }
        Ext.getCmp('form_all_money').setValue(price);
    })
    Ext.getCmp('form_all_money').on('blur',function(a,nv){
        var type=Ext.getCmp('form_type_new').getValue();
        if(type!='购物店'){
            var form_num=Ext.getCmp('form_num').getValue();
            var form_all_money=Ext.getCmp('form_all_money').getValue();
            if(!form_num)form_num=0;
            var price=parseFloat(form_all_money)/parseFloat(form_num).toFixed(2);
            Ext.getCmp('form_trade_price').setValue(price);
        }
    })
    Ext.getCmp('form_liushui').on('change',function(a,nv,c){
        var form_num=Ext.getCmp('form_num').getValue();
        if(!form_num)form_num=0;
        var form_trade_price=Ext.getCmp('form_trade_price').getValue();
        if(!form_trade_price)form_num=0;
        var form_pct_num=Ext.getCmp('form_pct_num').getValue();
        if(!form_pct_num)form_num=0;
        var price=Math.round(parseFloat(form_num)*parseFloat(form_trade_price)+parseFloat(nv)*parseFloat(form_pct_num)*0.01).toFixed(2);
        Ext.getCmp('form_all_money').setValue(price);
    })

    // 导出支出明细
    function sell_xsl(){
        var row=SUNLINE.getSelected(si_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请先选择您要导出支出详情的团队');
            return;
        }
        Ext.Msg.confirm('友情提示','你确认要导出支出明细的电子表格吗？',function(y){
            if(y=='yes'){
                var where={};
                where["si_team_id"]=row.data.team_id;
                where["export"]='export';
                var param='';
                for(i in where){
                    param = param + i + "=" + where[i] + "&";
                }
                window.open($__app__+"/TeamBillItems/export_xsl?"+param,'_blank');
            }
        })
    }

    var tabs_panel = new Ext.TabPanel({
        activeTab:0,
        xtype: 'reconfigure-grid',
        defaults:{autoScroll: false},
        items:[
            { title: '支出',layout:'border', items:[exc_grid]},
            { title: '收入',layout:'border', items:[ income_grid ]}
        ]
    });
    var bz_win=new Ext.Window({
        //width:Ext.getBody().getWidth()-200,
        width:1135,
        height:Ext.getBody().getHeight()-50,
        closeAction:'hide',
        resizable:true,
        modal:true,
        items:[tabs_panel],
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        maximizable : true,//全屏效果
        buttons:[
            {
                xtype:'tbtext',
                id:'bottom_money',
                style:'font-weight:bold;',
                text:' '
            },
            '->',
            {text:'提交审核',id:'ome_bottom',handler:bz_dosave},
            {text:'保存草稿',id:'two_bottom',handler:cg_dosave},
            {text:'关闭', handler:function () {
                bz_win.hide();
            }}
        ]
    });

    exc_store.on({
        update:function(){
            items_total_money();
        },
        datachanged:function(){
            items_total_money();
        }
    });
    income_store.on({
        update:function(){
            items_total_money();
        },
        datachanged:function(){
            items_total_money();
        }
    });
    //计算最终金额
    function items_total_money(){
        var zhichu_money= 0,shouru_money= 0;
        var money=0;
        exc_store.each(function(v){
            var row= v.data;
            money=parseFloat(row.si_money);
            zhichu_money+=money;
        })
        var money=0;
        income_store.each(function(v){
            var row= v.data;
            money=parseFloat(row.si_money);
            shouru_money+=money;
        })
        var text_money='实时统计信息：';
        text_money+='支出金额：<b>￥'+parseFloat(zhichu_money).toFixed(2)+'</b>元;';
        text_money+='收入金额：<b>￥'+parseFloat(shouru_money).toFixed(2)+'</b>元;';
        Ext.getCmp('bottom_money').setText(text_money);
    }

    //提交审核
    function bz_dosave(v){
        dosave('审核中');
    }
    function cg_dosave(v){
        var type;
        if(v.text=='保存草稿'){
            type='报账中';
        }else{
            type=v.text;
        }
        dosave(type);
    }
    function dosave(bz_status){
        var row=SUNLINE.getSelected(si_grid);
        var data={};
        data['team_credit_status']=bz_status;
        data['man_type']=WG.type;
        data['si_team_id']=row.data.team_id;
        data['team_id']=row.data.team_id;
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/mod_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                myMask.hide();
                Ext.Msg.alert('友情提示',info.msg);
                if(ret.status){
                    si_store.reload();
                    bz_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    bz_win.on('hide',function(){
        //plan_store.removeAll();
        income_store.removeAll();
        exc_store.removeAll();
        si_store.load();
    })
    //单团毛利
    var print_win = new Ext.Window({
        title:'单团毛利',
        width:760,
        height:600,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        id:"print_id",
        resizable:false,
        //maximizable : true,//全屏效果
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="748" style=" height: 600;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){print_win.hide();}}
        ]
    });
    //单团毛利打印
    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }

    print_win.on("show",function(){
        var row = SUNLINE.getSelected(si_grid);
        Row_data=row.data;
        Ext.getCmp("print_id").setTitle("单团毛利 导游:"+Row_data.team_guide_name+Row_data.team_guide_tel+" 团队编号:"+Row_data.team_num);
        var url = $__app__ + '/TeamBillItems/team_print?_dc=' + time()+'&team_id='+Row_data.team_id;
        window.ifm_print.location = url;
    });
    //新报账
    function ajax_load(idd,type){
        Ext.Ajax.request({
            url:$__app__ + '/TeamBillItems/select_item',
            params:{team_id:idd,type:type},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if(info.msg!='成功'){
                    Ext.Msg.alert('友情提示', info.msg);
                }else{
                    if(info.info['收入'])income_store.loadData(info.info['收入']);
                    if(info.info['支出'])exc_store.loadData(info.info['支出']);
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function submit_modify(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        Row_data=row.data;
        if(b.text == "单团毛利"){
            print_win.show();
        }else{
            bz_win.setTitle(b.text+" 团号:"+Row_data.team_num+" 导游:"+Row_data.team_guide_name+' '+Row_data.team_guide_tel);
            var type='';
            Ext.getCmp('two_bottom').show();
            if(b.text == "财务审核"){
                WG.type='cw_shenhe';
                Ext.getCmp('two_bottom').setText('审核驳回');
                Ext.getCmp('ome_bottom').setText('财务审核');
                type='财务';
            }else  if(b.text == "计调审核"){
                WG.type='jd_shenhe';
                Ext.getCmp('two_bottom').setText('审核驳回');
                Ext.getCmp('ome_bottom').setText('计调审核');
                type='计调';
            }else if(b.text == "房调审核"){
                WG.type='fd_shenhe';
                Ext.getCmp('two_bottom').setText('审核驳回');
                Ext.getCmp('ome_bottom').setText('房调审核');
                type='房调';
            }else{
                WG.type='';
                Ext.getCmp('ome_bottom').setText('提交审核');
                //Ext.getCmp('two_bottom').setText('保存草稿');
                Ext.getCmp('two_bottom').hide();
            }
            ajax_load(row.data.team_id,type);
            bz_win.show();
        }
    }

    bz_win.on('hide',function(){
        WG.type='';
    });

    function submit_account(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        Row_data=row.data;
        if(b.text == "单团毛利"){
            print_win.show();
        }
    }


    bz_win.on('hide',function(){
        WG.type='';
    });

    //导出列表
    function derive_fun(b){
        var tx = Ext.getCmp("search_cls").getText();
        if(tx=="查询全部") tx = "";
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            if(WG.num==1){
                org_id=1;
            }else{
                org_id=Ext.getCmp(company_box.id).getValue();
            }
        }else{
            org_id= _uinfo['org_id'];
        }
        var p_name_id=Ext.getCmp('p_name_id').getValue();
        var t_start_time=Ext.getCmp('t_start_time').getRawValue();
        var t_end_time=Ext.getCmp('t_end_time').getRawValue();
        Ext.Msg.confirm('友情提示','您确定要导出列表么？',function(y){
            if(y=='yes'){
                var where={};
                where["team_org_id"]=org_id;
                where["team_p_id"]=p_name_id;
                where["start_time"]=t_start_time;
                where["end_time"]=t_end_time;
                where["team_credit_status"]=tx;
                where["export"]='export';
                var param='';
                for(i in where){
                    param = param + i + "=" + where[i] + "&";
                }
                window.open($__app__+"/TeamBillItems/derive_xls?"+param,'_blank');
            }
        })
    }

    WG.num=1;
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        company_box.on('select',function(c,r){
            WG.num++;
            inquiry_mod();
        })
    }else{
        var company_box=_uinfo['org_name'];
    }
    Products_OrgCombo.box.on('select',function(c,r){
        inquiry_mod();
    });
    //查询
    function fast_search(b){
        Ext.getCmp("search_cls").setText(b.text);
        var tx = b.text;
        if(b.text=="查询全部") tx = "";
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            if(WG.num==1){
                org_id=1;
            }else{
                org_id=Ext.getCmp(company_box.id).getValue();
            }
        }else{
            org_id= _uinfo['org_id'];
        }

        var p_name_id=Ext.getCmp('p_name_id').getValue();
        var t_start_time=Ext.getCmp('t_start_time').getRawValue();
        var t_end_time=Ext.getCmp('t_end_time').getRawValue();
        SUNLINE.baseParams(si_store,{
            team_org_id:org_id,
            team_p_id:p_name_id,
            start_time:t_start_time,
            end_time:t_end_time,
            team_credit_status:tx
        });
        si_store.currentPage=1;
        si_store.load();
    }
    function inquiry_mod(){
        var tx = Ext.getCmp("search_cls").getText();
        if(tx=="查询全部") tx = "";
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            if(WG.num==1){
                org_id=1;
            }else{
                org_id=Ext.getCmp(company_box.id).getValue();
            }
        }else{
            org_id= _uinfo['org_id'];
        }
        var p_name_id=Ext.getCmp('p_name_id').getValue();
        var t_start_time=Ext.getCmp('t_start_time').getRawValue();
        var t_end_time=Ext.getCmp('t_end_time').getRawValue();
        SUNLINE.baseParams(si_store,{team_org_id:org_id,team_p_id:p_name_id,start_time:t_start_time,end_time:t_start_time,team_credit_status:tx});
        si_store.currentPage=1;
        si_store.load();
    }
    var _panel = new Ext.Panel({
        layout : 'border',
        region:'center',
        border:false,
        tbar: [
            company_box,
            '选择产品:',
            Products_OrgCombo.box,
            '出团时间:',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_start_time',name:'t_start_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_end_time',start:true}),
            '~',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_end_time',name:'t_end_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_start_time'}),
            "-",
            {text:'查询全部',id:"search_cls",iconCls:"searchico",handler:fast_search, xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '查询全部',handler:fast_search},
                        {text: '未报账',handler:fast_search},
                        {text: '报账中',handler:fast_search},
                        {text: '审核中',handler:fast_search},
                        {text: '审核驳回',handler:fast_search},
                        {text: '审核完成',handler:fast_search}
                    ]
                }
            },
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'}
        ],
        items : [si_grid]
    });
    ziyo_log({ listeners : [{grid: _panel, action:'TeamBillItems', pk_id:'si_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [_panel]
    });





});
