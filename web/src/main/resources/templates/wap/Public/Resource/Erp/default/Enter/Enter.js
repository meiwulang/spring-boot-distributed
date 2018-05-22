Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    //所有公司数据源
    var cb_url = $__app__ + '/Enter/cb_company';
    var cb_field = [{name:"org_id"} ];
    var cb_store = new SUNLINE.JsonStore(cb_url,cb_field,true);

    var ac_url = $__app__ + '/Credit/ad_select';
    var ac_store = new SUNLINE.JsonStore(ac_url,[],false);

    //获取公司数据源
    var outflow_org_url = $__app__ + '/Enter/cb_company';
    var outflow_org_field = [ {name:"org_id"}];
    var outflow_org_store = new SUNLINE.JsonStore(outflow_org_url, outflow_org_field,false);

    var inflow_org_url = $__app__ + '/Enter/get_company';
    var inflow_org_field = [];
    var inflow_org_store = new SUNLINE.JsonStore(inflow_org_url, inflow_org_field,false);



    var inflow_url = $__app__ + '/BankCard/card_data';
    var inflow_field = [];
    var inflow_store = new SUNLINE.JsonStore(inflow_url, inflow_field,false);

    var bc_url = $__app__ + '/Enter/get_company';
    var bc_field = [{name:"org_id"}];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field);
    var ci_bc_store = new Ext.form.ComboBox({
        width:300,
        value:'全部单位',
        fieldLabel:"选择单位",
        labelWidth:60,
        id:'org_name_id',
        labelAlign:"right",
        name:'org_name',
        allowBlank : false,
        store: bc_store,
        displayField:'org_name',
        valueField:"org_name",
        editable:false,
        typeAhead: true,
        matchFieldWidth:false,
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

    ci_bc_store.on({'select':function(c,r,n){
        SUNLINE.baseParams(cb_store,{org_name:c.rawValue});
         cb_store.currentPage=1;
         cb_store.load();
    }});

    var inflow_box = new Ext.form.ComboBox({
        width:420,
        value:'',
        fieldLabel:"入账银行卡号",
        labelWidth:100,
        id:'inflow_bcid',
        labelAlign:"right",
        name:'inflow_bcid',
        allowBlank:false,
        editable:false,
        store: inflow_store,
        displayField:'bc_card_num',
        valueField:"bc_id"
    });

    var inflow_org = new Ext.form.ComboBox({
        width:420,
        fieldLabel:"收款公司",
        labelWidth:100,
        id:'ad_sub_id',
        labelAlign:"right",
        editable:false,
        name:'ad_sub_id',
        store: inflow_org_store,
        displayField:'org_name',
        valueField:"org_id",
        pageSize:20
    });

    var outflow_org = new Ext.form.ComboBox({
        width:420,
        value:'',
        fieldLabel:"来源公司",
        labelWidth:100,
        id:'ad_sorg_name',
        labelAlign:"right",
        editable:false,
        name:'ad_sorg_name',
        store: outflow_org_store,
        displayField:'org_name',
        valueField:"org_name",
        pageSize:20
    });

    var inflow_form= new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            xtype : 'textfield',
            width:420,
            labelWidth:100,
            labelAlign:'right',
            border : false
        },
        items:[
            {name:"ad_temp_remark", fieldLabel:'汇款信息',id:'ad_temp_remark'},
            outflow_org,
            {name:"ad_sorg_id", fieldLabel:'来源公司ID',id:'ad_sorg_id',hidden:true},
            {name:"ad_outflow_bcid", fieldLabel:'来源银行卡ID',id:'ad_outflow_bcid',hidden:true},
            {name:"ad_money",allowBlank:false,fieldLabel:"金额",xtype:'numberfield'},
            inflow_org,
            {name:"ad_sub_name", fieldLabel:'入账公司名',id:'ad_sub_name',hidden:true},
            inflow_box,
            {name:"ad_inflow_bcid", fieldLabel:'入账银行卡ID',id:'ad_inflow_bcid',hidden:true},
            {name:"ad_remark", fieldLabel:"备注",xtype:'textarea'}
        ]
    });


    var inflow_win= new Ext.Window({
        title:'手动入账',
        width:460,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:inflow_form,
        buttons:[
            {text:'保存', handler:inflow_dosave},
            {text:'关闭', handler:function(){
                inflow_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    inflow_win.on('hide',function(){
        inflow_form.getForm().reset();
        inflow_box.getStore().removeAll();
    })

    var cb_cm =[
        new Ext.grid.RowNumberer(),
        {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
        {header:"编号", dataIndex:"org_bh", width:100},
        {header:"账户名称", dataIndex:"org_name", width:250},
        {header:"所属区域", dataIndex:"org_address", width:150,renderer:fullDress},
        {header:"账户余额", dataIndex:"org_balance", width:150,renderer:money}
    ];

    var bc_grid = new Ext.grid.GridPanel({
        region:'west',
        border:false,
        style : 'border-right:2px solid #009DDA;',
        width:800,
        columns:cb_cm,
        store:cb_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有公司信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'手动入账', iconCls:'button-edit', handler:inflow,disabled:isDisabled('Enter::input')},
            {text:'手动支出', iconCls:'button-del',handler:pay_modify,disabled:isDisabled('Enter::output')},
            ci_bc_store,
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'cb_search',
                cls:'search-icon-cls',
                emptyText:'单位名称、编号',
                width:150,
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
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:cb_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'额度授信信息'
        })
    });

    var ac_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"ad_id", width:50, hidden:true},
        {header:"交易流水号", dataIndex:"ad_serial_number", width:200,renderer:function(val){
            if(val=='账户余额'){
                return "<b style='color:#010408'>账户余额</b>";
            }else{
                return val;
            }
        }},
        {header:"操作人", dataIndex:"ad_uname", width:80},
        {header:"操作时间", dataIndex:"ad_time", width:150,renderer:function(val){
            if(val){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d H:i:s');
            }else{
                return '';
            }
        }},
        {header:"主题", dataIndex:"ad_theme", width:200},
        {header:"交易金额", dataIndex:"ad_money", width:100,align:'right',renderer:function(v,m,r){
            if(r.get('ad_class')=='支出'){
                return "<span style='color:#ff8e92'>￥"+v+"</span>";
            }else if(r.get('ad_class')=='收入'){
                return "<span style='color:#008000'>￥"+v+"</span>";
            }else if(!r.get('ad_class')){
                if(v){
                    return "<span style='color:#1494d9'>￥"+v+"</span>";
                }else{
                    return "<span style='color:#1494d9'>￥0</span>";
                }

            }else{
                return "<span style='color:#008000'>￥"+v+"</span>";
            }
        }},
        {header:"付款状态", dataIndex:"ad_status", width:100}
    ];

    var ac_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:ac_cm,
        store:ac_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有流水信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'刷新',iconCls:'button-edit',handler:function(){
                ac_store.reload();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:ac_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'流水信息'
        })
    });

    ziyo_log({ listeners : [{grid: ac_grid, action:'Enter', pk_id:'ad_id'}] });

    new Ext.Viewport({
        layout : 'border',
        items : [bc_grid,ac_grid]
    });

    bc_grid.on('select',function(){
        var row=SUNLINE.getSelected(bc_grid);
        SUNLINE.baseParams(ac_store,{ad_sorg_id:row.data.org_id});
        ac_store.currentPage=1;
        ac_store.load();
    })

    function fullDress(v,m,r){
        var province = r.get('org_province');
        if(province == null) {province = ""};
        var city = r.get('org_city');
        if(city == null) {city = ""};
        var county = r.get('org_county') ? r.get('org_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    function dosearch(){
        var key=Ext.getCmp('cb_search').getValue();
        SUNLINE.baseParams(cb_store,{skey:key});
        cb_store.currentPage=1;
        cb_store.load();
    }

    function inflow(){
        var row=SUNLINE.getSelected(bc_grid);
        inflow_win.show();
        if(row){
            outflow_org.setValue(row.data.org_name);
            Ext.getCmp('ad_sorg_id').setValue(row.data.org_id);
        }
    }

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
                    {name:"org_bh", fieldLabel:"编号", maxLength:"50",readOnly:true},
                    {name:"org_name", fieldLabel:"账户名称", maxLength:"50",readOnly:true},
                    {name:"ad_money", fieldLabel:"支出金额", maxLength:"50",allowBlank:false,xtype:'numberfield',value:0},
                    {name:"ad_remark", fieldLabel:"备注", xtype:'textarea', maxLength:"200", height:60,width:260}
                ]
            }
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
        if (parseFloat(row.data.org_balance) < parseFloat(data['ad_money'])) {
            Ext.Msg.alert('友情提示', '现金余额不足，请充值');
            return;
        };
        Ext.MessageBox.confirm('友情提示', '是否确定支出操作？', function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Enter/output_manual',
                    params:data,
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            cb_store.reload();
                            outflow_win.hide();
                        };
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }


    function pay_modify(v){
        var row=SUNLINE.getSelected(bc_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的公司！');
            return false;
        }
        outflow_win.show();
        pay_from.getForm().setValues(row.data);
        outflow_win.setTitle('手动支出', v.iconCls);
    }

    var outflow_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:pay_from,
        buttons:[
            {text:'保存', handler:pay_dosave},
            {text:'关闭', handler:function () {
                outflow_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    outflow_win.on('hide',function(){
        pay_from.getForm().reset();
    })

    //入账保存
    function inflow_dosave(){
        if (!inflow_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var data=inflow_form.getForm().getValues();
        if(!data.ad_sorg_id){
            data.ad_sorg_name='';
        }
        Ext.MessageBox.confirm('友情提示', '是否确定入账操作？', function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__+'/Enter/input_manual',
                    params:data,
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        if (ret.status==1){
                            myMask.hide();
                            inflow_win.hide();
                            ac_store.reload();
                        }
                    }
                })
            }
        })
    }

    //输入银行卡号 得到公司名id
    Ext.getCmp('ad_temp_remark').on('blur',function(v){
        if(v.rawValue==''){
            return false;
        }
        Ext.Ajax.request({
            url:$__app__+'/Enter/card_get_org',
            params:{'bc_card_num': v.rawValue},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.status==1){
                    if(ret.info.org_id){
                        outflow_org.setValue(ret.info.org_name);
                        outflow_org.setReadOnly(true);
                        Ext.getCmp('ad_sorg_id').setValue(ret.info.org_id);
                    }else{
                        outflow_org.setReadOnly(false);
                    }
                }
            }
        })
    });

    outflow_org_store.on('load', function () {
        this.add({org_name:'无',org_id:''});
    });

    inflow_store.on('beforeload', function(store, options) {
        var inflow_org=Ext.getCmp('ad_sub_id').getValue();
        if(!inflow_org)return false;
    });

    //由公司拉取银行卡
    outflow_org.on('select',function(v,r,o){
        Ext.getCmp('ad_sorg_id').setValue(r[0].data.org_id);
    });

    inflow_org.on('select',function(v,r){
        inflow_box.setValue('');
        Ext.getCmp('ad_inflow_bcid').setValue('');
        Ext.getCmp('ad_sub_name').setValue(v.rawValue);
        SUNLINE.baseParams(inflow_store,{'bc_org_id': v.value});
        inflow_store.currentPage=1;
        inflow_store.load();
    });

    inflow_box.on('change',function(v,r){
        Ext.getCmp('ad_inflow_bcid').setValue(r);
    });

});
