var WG={};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '额度授信';

    var cb_url = $__app__ + '/Credit/cb_company';
    var cb_field = [{name:"org_id"} ];
    var cb_store = new SUNLINE.JsonStore(cb_url,cb_field);

    var cb_cm =[
        new Ext.grid.RowNumberer(),
        {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
        {header:"编号", dataIndex:"org_bh", width:100},
        {header:"账户名称", dataIndex:"org_name", width:250},
        {header:"所属区域", dataIndex:"org_address", width:150,renderer:fullDress},
        {header:"现金余额", dataIndex:"org_balance", width:120,align:'right', editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"信用额度", dataIndex:"org_credit", width:120,align:'right', editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"信用余额", dataIndex:"org_credit_balance", width:120,align:'right', editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"信用结算类型", dataIndex:"org_credit_type", width:120},
        {header:"结算周期", dataIndex:"org_clearing", width:150},
        /*{header:'操作',dataIndex:'s_start_date',align:'center',width:140,renderer:function(v,n,r){
            if(r.get('org_id')){
                var val=r.get('org_id');
            }else{
                var val=-1;
            }

            var reStr = '<a style = "cursor: pointer;color:#0000ff" onclick = planeInfo("'+val+'")>[查看账户明细]</a>';
            return reStr;
        }}*/
    ];
    window.planeInfo=function(v){
        //parent.OpenTab('接送明细', 'Plane'+v, '', $__app__+'/TransPlan/Plane/'+v, 1);
        parent.OpenTab('接送明细', 'Plane'+v, '', $__app__+'/Credit/account_detail/'+v, 1);
    }
    function fullDress(v,m,r){
        var province = r.get('org_province');
        if(province == null) {province = ""};
        var city = r.get('org_city');
        if(city == null) {city = ""};
        var county = r.get('org_county') ? r.get('org_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };
    var bc_url = $__app__ + '/Credit/company_select';
    var bc_field = [ {name:"org_id"}];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field);
    var ci_bc_store = new Ext.form.ComboBox({
        width:350,
        value:'全部单位',
        fieldLabel:"所属分公司",
        labelWidth:80,
        id:'org_name_id',
        labelAlign:"right",
        name:'org_name',
        allowBlank : false,
        store: bc_store,
        displayField:'org_name',
        valueField:"org_name",
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });
    bc_store.on('load',function(){
        this.add({org_name:'全部单位'});
        if(_uinfo['org_id']!=1){
            Ext.getCmp('org_name_id').setValue(_uinfo['org_name']);
        }else{
            Ext.getCmp('org_name_id').setValue('全部单位');
        }
    })

    var bc_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:cb_cm,
        store:cb_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有额度授信信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'信用额度管理', iconCls:'button-add',handler:bill_modify, disabled:isDisabled('Credit::bill_save')},
            '-',
            /*{text:'手动入账', iconCls:'button-edit',handler:income_modify, disabled:isDisabled('Credit::income_save')},
            '-',
            {text:'手动支出', iconCls:'button-del',handler:pay_modify, disabled:isDisabled('Credit::income_save')},
            '-',*/
            ci_bc_store,
            '-',
            '余额状态',
            {
                xtype:"combo",
                id:"org_money_val",
                name:"org_money_val",
                width:100,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['org_money_val'],
                    data:[
                        ['全部'],
                        ['有余额']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"org_money_val",
                displayField:"org_money_val",
                mode:"local",
                value:'全部'
            },
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'cb_search',
                cls:'search-icon-cls',
                emptyText:'单位名称、编号',
                width:200,
                onTriggerClick:function (e) {
                    cb_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            cb_dosearch();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:cb_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'额度授信信息'
        })
    });
    //手动支出
    var pay_store = new SUNLINE.JsonStore(bc_url, bc_field,false);
    var pay_combobox= new Ext.form.ComboBox({
        width:260,
        value:'全部单位',
        fieldLabel:"选择单位",
        labelWidth:80,
        labelAlign:"right",
        name:'org_name_val',
        allowBlank : false,
        store: pay_store,
        hiddenName:'org_id',
        valueField:"org_name",
        displayField:'org_name',
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });
    var pay_from= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {name:"org_id", fieldLabel:"org_id", maxLength:"10",xtype:"hidden"},
                    {name:"ad_theme", fieldLabel:"ad_theme", maxLength:"10",xtype:"hidden",value:'手动支出'},
                    {name:"ad_class", fieldLabel:"ad_class", maxLength:"10",xtype:"hidden",value:'支出'},
                    {name:"ad_type", fieldLabel:"ad_class", maxLength:"10",xtype:"hidden",value:'提现'},
                    {name:"ad_status", fieldLabel:"ad_status", maxLength:"10",xtype:"hidden",value:'已付款'},
                    {name:"org_bh", fieldLabel:"编号", maxLength:"50",disabled:true},
                    {name:"org_name", fieldLabel:"账户名称", maxLength:"50",disabled:true},
                    {name:"ad_money", fieldLabel:"支出金额", maxLength:"50",allowBlank:false,xtype:'numberfield',value:0},
                    pay_combobox,
                    {name:"ad_remark", fieldLabel:"备注", xtype:'textarea', maxLength:"200", height:60,width:260}
                ]
            }
        ]
    });
    pay_combobox.on({'select':function(c,r,n){
        WG.org_id_val=r[0].get('org_id');
    }})
     var pay_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:pay_from,
        buttons:[
            {text:'保存', handler:pay_dosave},
            {text:'关闭', handler:function () {
                pay_win.hide();
            },style:'margin-right:15px;'}
        ]
    });
    function pay_dosave(){
        if (!pay_from.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var data = pay_from.getForm().getValues();
        if (data['ad_money']<0) {
            Ext.Msg.alert('友情提示', '支出金额不能为负数');
            return;
        };
        var row=SUNLINE.getSelected(bc_grid);
        if (parseFloat(row.data.org_balance)-parseFloat(data['ad_money'])<0) {
            Ext.Msg.alert('友情提示', '现金余额不足，请充值');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(bc_grid);

        data['org_bh']=row.data.org_bh;
        data['org_name']=row.data.org_name;
        data['org_balance_old']=row.data.org_balance;
        data['org_id_val']=WG.org_id_val;
        data['type']='pay';
        Ext.Ajax.request({
            url:$__app__ + '/Credit/income_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    cb_store.reload();
                    pay_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    pay_win.on('hide',function(){
        pay_from.getForm().reset();
    })
    function pay_modify(v){
        var row=SUNLINE.getSelected(bc_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        pay_win.show();
        pay_from.getForm().setValues(row.data);
        pay_win.setTitle('手动支出', v.iconCls);
    }
    //手动入账
    var income_store = new SUNLINE.JsonStore(bc_url, bc_field,false);
    var income_combobox= new Ext.form.ComboBox({
        width:260,
        value:'全部单位',
        fieldLabel:"选择单位",
        labelWidth:80,
        labelAlign:"right",
        name:'org_name_val',
        allowBlank : false,
        store: income_store,
        hiddenName:'org_id',
        valueField:"org_name",
        displayField:'org_name',
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });
    var income_from= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {name:"org_id", fieldLabel:"org_id", maxLength:"10",xtype:"hidden"},
                    {name:"ad_theme", fieldLabel:"ad_theme", maxLength:"10",xtype:"hidden",value:'在线充值'},
                    {name:"ad_class", fieldLabel:"ad_class", maxLength:"10",xtype:"hidden",value:'收入'},
                    {name:"ad_type", fieldLabel:"ad_class", maxLength:"10",xtype:"hidden",value:'充值'},
                    {name:"ad_status", fieldLabel:"ad_status", maxLength:"10",xtype:"hidden",value:'已付款'},
                    {name:"org_bh", fieldLabel:"编号", maxLength:"50",disabled:true},
                    {name:"org_name", fieldLabel:"账户名称", maxLength:"50",disabled:true},
                    {name:"ad_detail", fieldLabel:"底单编号", maxLength:"50"},
                    {name:"ad_money", fieldLabel:"充值金额", maxLength:"50",allowBlank:false,xtype:'numberfield',value:0},
                    income_combobox,
                    {name:"ad_remark", fieldLabel:"备注", xtype:'textarea', maxLength:"200", height:60,width:260}
                ]
            }
        ]
    });
    income_combobox.on({'select':function(c,r,n){
        WG.org_id_val=r[0].get('org_id');
    }})
    income_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:income_from,
        buttons:[
            {text:'保存', handler:income_dosave},
            {text:'关闭', handler:function () {
                income_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    function income_dosave(){
        if (!income_from.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var data = income_from.getForm().getValues();
        if(data['ad_money']<0){
            Ext.Msg.alert('友情提示', '充值金额不能为负数');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(bc_grid);
        var data = income_from.getForm().getValues();
        data['org_bh']=row.data.org_bh;
        data['org_name']=row.data.org_name;
        data['org_id_val']=WG.org_id_val;
        Ext.Ajax.request({
            url:$__app__ + '/Credit/income_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    cb_store.reload();
                    income_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    income_win.on('hide',function(){
        income_from.getForm().reset();
    })
    function income_modify(v){
        var row=SUNLINE.getSelected(bc_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        income_win.show();
        income_from.getForm().setValues(row.data);
        income_win.setTitle('手动入账', v.iconCls);
    }
    //信用额度管理
    org_clearing_choose_3=new Ext.form.ComboBox({
        name:"org_clearing",
        fieldLabel:"结算类型",
        editable:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['org_clearing'],
            data:[
                ['周一'],
                ['周二'],
                ['周三'],
                ['周四'],
                ['周五'],
                ['周六'],
                ['周日']
            ]
        }),
        displayField:"org_clearing",
        valueField:"org_clearing",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:'周一'
    });
    org_clearing_choose_week=new Ext.form.ComboBox({
        name:"org_clearing",
        fieldLabel:"结算类型",
        xtype:"combo",
        editable:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['org_clearing'],
            data:[
                ['周一'],
                ['周二'],
                ['周三'],
                ['周四'],
                ['周五'],
                ['周六'],
                ['周日']
            ]
        }),
        displayField:"org_clearing",
        valueField:"org_clearing",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:'周一'
    });
    org_clearing_choose_month=new Ext.form.TextField({
        id:'org_clearing_choose_month',labelAlign:'right',labelWidth:80,width:260,name:"org_clearing",
        fieldLabel:'结算周期',disabled:true,xtype:"hidden"});

    org_clearing_choose_tow_month=new Ext.form.ComboBox({
        name:"org_clearing",
        fieldLabel:"结算周期",
        editable:false,
        triggerAction:"all",
        disabled:true,
        xtype:"hidden",
        store:new Ext.data.SimpleStore({
            fields:['org_clearing'],
            data:[
                ['1'],
                ['2'],
                ['3'],
                ['4'],
                ['5'],
                ['6'],
                ['7'],
                ['8'],
                ['9'],
                ['10'],
                ['11'],
                ['12'],
                ['13'],
                ['14'],
                ['15'],
                ['16'],
                ['17'],
                ['18'],
                ['19'],
                ['20'],
                ['21'],
                ['22'],
                ['23'],
                ['24'],
                ['25'],
                ['26'],
                ['27'],
                ['28']
            ]
        }),
        displayField:"org_clearing",
        valueField:"org_clearing",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:'1'
    });
    org_clearing_choose_designated =new Ext.form.TextField({
        labelAlign:'right',labelWidth:80,width:260,name:"org_clearing",
        fieldLabel:'结算周期',disabled:true,xtype:"hidden"});
    var bill_from= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {name:"org_id", fieldLabel:"org_id", maxLength:"10",xtype:"hidden"},
                    {name:"org_bh", fieldLabel:"编号", maxLength:"50",disabled:true},
                    {name:"org_name", fieldLabel:"账户名称", maxLength:"50",disabled:true},
                    {name:"org_credit", fieldLabel:"信用额度", maxLength:"50",xtype:'numberfield'},
                    {
                        name:"org_credit_type",
                        fieldLabel:"结算类型",
                        id:'org_credit_type_id',
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['org_credit_type'],
                            data:[
                                ['每周'],
                                ['每月'],
                                ['偶数月'],
                                ['奇数月'],
                                ['指定日期']
                            ]
                        }),
                        displayField:"org_credit_type",
                        valueField:"org_credit_type",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:'每周'
                    },
                    org_clearing_choose_3,
                    org_clearing_choose_week,
                    org_clearing_choose_month,
                    org_clearing_choose_tow_month,
                    org_clearing_choose_designated
                ]
            }
        ]
    });
    org_clearing_choose_3.setHidden(true);
    org_clearing_choose_3.setDisabled(true);
    org_clearing_choose_designated.setHidden(true);
    org_clearing_choose_tow_month.setHidden(true);
    org_clearing_choose_month.setHidden(true);
    Ext.getCmp('org_credit_type_id').on('change', function(c,r,n){
        if(r=='每周'){
            org_clearing_choose_week.setDisabled(false);
            org_clearing_choose_week.setHidden(false);
            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
        }else if(r=='每月'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);
            org_clearing_choose_month.setDisabled(false);
            org_clearing_choose_month.setHidden(false);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
            org_clearing_choose_month.focus();
            org_clearing_choose_month.allowBlank = false;
            org_clearing_choose_month.regex=/^([1-9]|1[0-9]|2[0-8])(,([1-9]|1[0-9]|2[0-8]))*$/;
            org_clearing_choose_month.emptyText ='只能输入1-28用逗号隔开，例如"1,2,3"';
        }else if(r=='偶数月' || r=='奇数月'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);
            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(false);
            org_clearing_choose_tow_month.setHidden(false);
            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
        }else if(r=='指定日期'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);
            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(false);
            org_clearing_choose_designated.setHidden(false);
            org_clearing_choose_designated.focus();
            org_clearing_choose_designated.allowBlank = false;
            org_clearing_choose_designated.regex=/^(([1-9]|1[0-9]|2[1-2])(.([1-9]|1[0-9]|2[0-8])))(,(([1-9]|1[0-9]|2[1-2])(.([1-9]|1[0-9]|2[0-8]))))*$/;
            org_clearing_choose_designated.emptyText ='只能输入月份加点加天数，例如1.20,3.20"';
        }
    })
    bill_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:bill_from,
        buttons:[
            {text:'保存', handler:bill_dosave},
            {text:'关闭', handler:function () {
                bill_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    function bill_dosave(){
        if (!bill_from.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var data = bill_from.getForm().getValues();
        if(data['org_credit']<0){
            Ext.Msg.alert('友情提示', '信用额度不能为负数');
            return;
        }
        var row=SUNLINE.getSelected(bc_grid);
        var money_c=parseFloat(row.data.org_credit)-parseFloat(row.data.org_credit_balance);
        if(money_c>data['org_credit']){
            Ext.Msg.alert('友情提示', '您已经使用信用额度'+money_c+',所有信用额度最低为'+money_c);
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();


        data['org_credit_old']=row.data.org_credit;
        data['org_credit_balance']=row.data.org_credit_balance;
        Ext.Ajax.request({
            url:$__app__ + '/Credit/bill_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    cb_store.reload();
                    bill_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    bill_win.on('hide',function(){
        bill_from.getForm().reset();
    })
    function bill_modify(v){
        var row=SUNLINE.getSelected(bc_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        bill_win.show();
        if(row.data.org_credit_type=='每周'){

            org_clearing_choose_week.setDisabled(false);
            org_clearing_choose_week.setHidden(false);
            org_clearing_choose_week.setValue(row.data.org_clearing);
            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
        }else if(row.data.org_credit_type=='每月'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);
            org_clearing_choose_month.setDisabled(false);
            org_clearing_choose_month.setHidden(false);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
            org_clearing_choose_month.focus();
            org_clearing_choose_month.allowBlank = false;
            org_clearing_choose_month.regex=/^([1-9]|1[0-9]|2[0-8])(,([1-9]|1[0-9]|2[0-8]))*$/;
            org_clearing_choose_month.setValue(row.data.org_clearing);

        }else if(row.data.org_credit_type=='偶数月' || row.data.org_credit=='奇数月'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);

            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(false);
            org_clearing_choose_tow_month.setHidden(false);


            org_clearing_choose_designated.setDisabled(true);
            org_clearing_choose_designated.setHidden(true);
        }else if(row.data.org_credit_type=='指定日期'){
            org_clearing_choose_week.setDisabled(true);
            org_clearing_choose_week.setHidden(true);
            org_clearing_choose_month.setDisabled(true);
            org_clearing_choose_month.setHidden(true);
            org_clearing_choose_tow_month.setDisabled(true);
            org_clearing_choose_tow_month.setHidden(true);
            org_clearing_choose_designated.setDisabled(false);
            org_clearing_choose_designated.setHidden(false);
            org_clearing_choose_designated.focus();
            org_clearing_choose_designated.allowBlank = false;
            org_clearing_choose_designated.regex=/^(([1-9]|1[0-9]|2[1-2])(.([1-9]|1[0-9]|2[0-8])))(,(([1-9]|1[0-9]|2[1-2])(.([1-9]|1[0-9]|2[0-8]))))*$/;
            org_clearing_choose_designated.setValue(row.data.org_clearing);
        }

        bill_from.getForm().setValues(row.data);
        bill_win.setTitle('信用额度管理', v.iconCls);
    }
    ci_bc_store.on({'select':function(c,r,n){
        var key=Ext.getCmp('cb_search').setValue('');
        var org_money=Ext.getCmp('org_money_val').getValue();
        SUNLINE.baseParams(cb_store,{org_name:r[0].get('org_name'),org_money_val:org_money});
        cb_store.currentPage=1;
        cb_store.load();

    }});
    Ext.getCmp('org_money_val').on({'select':function(c,r,n){
        var key=Ext.getCmp('cb_search').setValue('');
        var org_name_val=Ext.getCmp('org_name_id').getValue();
        SUNLINE.baseParams(cb_store,{org_money_val:r[0].get('org_money_val'),org_name:org_name_val});
        cb_store.currentPage=1;
        cb_store.load();

    }});
    function cb_dosearch(){
        var org_money=Ext.getCmp('org_money_val').getValue();
        var org_name_val=Ext.getCmp('org_name_id').getValue();
        var key=Ext.getCmp('cb_search').getValue();
        SUNLINE.baseParams(cb_store,{skey:key,org_name:org_name_val,org_money_val:org_money});
        cb_store.currentPage=1;
        cb_store.load();
    }
    ziyo_log({ listeners : [{grid: bc_grid, action:'Credit', pk_id:'org_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [bc_grid]
    });

    if(_uinfo['org_id']!=1){
        Ext.getCmp('org_name_id').setDisabled(true);
    }
});
