Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var c_url = $__app__ + '/Company/dataJson?type=bankcard';
    var c_field = [];
    var company_store = new SUNLINE.JsonStore(c_url, c_field,true);

    var b_url = $__app__ + '/BankCard/dataJson';
    var b_field = [];
    var card_store = new SUNLINE.JsonStore(b_url, b_field,false);

    var basic_items=[
        {id:"bc_id", name:"bc_id", fieldLabel:"ID", xtype:'hidden',allowBlank:true},
        {id:"bc_org_id", name:"bc_org_id", xtype:'hidden',allowBlank:false},
        {id:"bc_bank_code", name:"bc_bank_code", xtype:'hidden',allowBlank:false},
        {id:"bc_branch_code", name:"bc_branch_code", xtype:'hidden',allowBlank:false},
        {id:"bc_provinceid", name:"bc_provinceid", xtype:'hidden',allowBlank:false},
        {id:"bc_cityid", name:"bc_cityid", xtype:'hidden',allowBlank:false},
        SUNLINE.ComBoxCity({
            id:'bc_province',
            where:{city_type:'province'},
            config:{name:'bc_province',fieldLabel:"<font color='red'>*</font> 开户省份",editable:false,labelWidth:70,labelAlign:'right',forceSelection:true,allowBlank:false,width:334,displayField:'name',valueField:'name',listeners:{
                select:function(combo,record,ep){
                    if(Ext.getCmp('bc_provinceid').getValue()!=record[0].get('id') && Ext.getCmp('bc_cityid').getValue()) {
                        Ext.getCmp('bc_cityid').setValue();
                        Ext.getCmp('bc_city_id').setValue();
                        if(Ext.getCmp('bc_sub_branch').getValue() || Ext.getCmp('bc_branch_code').getValue()){
                            Ext.getCmp('bc_sub_branch').setValue();
                            Ext.getCmp('bc_branch_code').setValue();
                        }
                    }
                    Ext.getCmp('bc_provinceid').setValue(record[0].get('id'));
                }
            },emptyText:'请选择开户省份'}
        }),
        {id:"bc_card_man",name:"bc_card_man",fieldLabel:"<font color='red'>*</font> 持卡人",allowBlank:false},
        SUNLINE.ComBoxCity({
            id:'bc_city',
            where:{city_type:'city'},
            appTo:'bc_province',
            config:{name:'bc_city',fieldLabel:"<font color='red'>*</font> 开户城市",editable:false,labelWidth:70,labelAlign:'right',forceSelection:true,allowBlank:false,width:334,displayField:'name',valueField:'name',listeners:{
                select:function(combo,record,ep){
                    Ext.getCmp('bc_cityid').setValue(record[0].get('id'));
                    if(Ext.getCmp('bc_sub_branch').getValue() || Ext.getCmp('bc_branch_code').getValue()){
                        Ext.getCmp('bc_sub_branch').setValue();
                        Ext.getCmp('bc_branch_code').setValue();
                    }
                }
            },emptyText:'请选择开户城市'}
        }),
        {id:"bc_card_num",name:"bc_card_num",fieldLabel:"<font color='red'>*</font> 银行卡号",allowBlank:false},
        {id:"bc_bank",name:"bc_bank",fieldLabel:"<font color='red'>*</font> 选择银行",maxLength:"11",xtype:'combobox',queryParam:'bc_bank',editable:false,triggerAction:"all",
            store:Ext.create('Ext.data.Store', {
                fields:['b_code','b_name','id'],
                proxy: {type: 'ajax',url: $__app__+'/BankCard/get_bank',reader: {type: 'json',rootProperty: 'data'}
                }
            }),
            displayField: 'b_name',valueField: 'b_name',emptyText:' 请选择银行 ',allowBlank: false,
            listeners: {
                select: function (combo, record, oe) {
                    if(Ext.getCmp('bc_bank_code').getValue!=record[0].get('b_code') && (Ext.getCmp('bc_sub_branch').getValue() || Ext.getCmp('bc_branch_code').getValue())){
                        Ext.getCmp('bc_sub_branch').setValue();
                        Ext.getCmp('bc_branch_code').setValue();
                    }
                    Ext.getCmp('bc_bank_code').setValue(record[0].get('b_code'));
                }
            }
        },
        {id:"bc_currency",name:"bc_currency",fieldLabel:"<font color='red'>*</font> 币种",value:'CNY',allowBlank:false},
        {id:"bc_sub_branch",name:"bc_sub_branch",fieldLabel:"<font color='red'>*</font> 选择支行",xtype:'combobox',displayField: 'bb_name',valueField: 'bb_name',emptyText:' 请先选择省市银行再选支行 ',allowBlank: false,
            triggerAction:"all",
            queryParam:'bc_sub_branch',
            store:Ext.create('Ext.data.Store', {
                fields:['bb_number','bb_name'],
                proxy: {
                    type: 'ajax',
                    url: $__app__+'/BankCard/get_branch',
                    reader: {type: 'json',rootProperty: 'data'}
                },
                listeners:{
                    beforeload:function(s,o){
                        var bank = Ext.getCmp('bc_bank_code').getValue();
                        var city = Ext.getCmp('bc_cityid').getValue();
                        Ext.apply(s.proxy.extraParams, {bank:bank,city:city});
                    },
                }
            }),
            listeners:{
                select:function(combo,record,oe){
                    Ext.getCmp('bc_branch_code').setValue(record[0].data.bb_number);
                },
                change:function(t,e,q){
                    SUNLINE.baseParams(t.store,{query:e},true);
                    t.store.reload();
                }
            }
        },
        {id:"bc_cftype",name:"bc_cftype",fieldLabel:"<font color='red'>*</font> 开户证件",xtype:"combo",readOnly:true,editable:false,triggerAction:"all",
            store:new Ext.data.Store({fields:['name'],data:bc_cftype}),
            displayField:"name",valueField:"name",mode:"local",forceSelection:true,typeAhead:true,value:"身份证"
        },
        {id:"bc_card_type",name:"bc_card_type",fieldLabel:"<font color='red'>*</font> 账户类型",xtype:"combo",editable:false,triggerAction:"all",
            store:new Ext.data.Store({fields:['name'],data:card_type}),
            displayField:"name",valueField:"name",mode:"local",forceSelection:true,typeAhead:true,value:"对私",
            listeners:{
                select:function(combo,record,oe){

                },
                change:function(t,e,q){
                    if(e == '对私'){
                        Ext.getCmp('bc_cftype').setValue('身份证');
                    }else{
                        Ext.getCmp('bc_cftype').setValue('营业执照');
                    }
                    Ext.getCmp('bc_cfno').setValue('');
                }
            }
        },
        {id:"bc_cfno",name:"bc_cfno",fieldLabel:"<font color='red'>*</font> 证件号码",allowBlank:false}
    ];


    /**     基本信息的表单  ***/
    var add_form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,id:'form',border:false,width: 700,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{allowBlank:false,labelAlign:'right',labelWidth:70}
        },
        items: [
            {title:'基本信息',cls:'tcol2',items:basic_items},
            {title:'备注说明',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1、添加银行卡时请仔细核对其正确性（尤其卡号、持卡人、支行信息），避免银行卡信息错误导致无法提现</li><li>2、对私账户请选择身份证并填写证件号；对公账户则选择营业执照并填写执照号</li><li>3、对公账户需要银行校验真实性，一般需要2个工作日</li><li>4、对公账户无法编辑，如有需要请先删除并通知客服，由客服发起最终由银行审核删除</li><li>5、对公绑卡支持所有银行，对私绑卡只支持11家银行，<div id="bank_tips" style="display:inline-block;cursor:pointer;text-decoration: underline;color:chocolate ;">点击查看</div></li></ul></div>'}
        ]
    });



    var card_win=new Ext.Window({
        width:750,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:add_form,
        buttons:[
            {text:'保存',handler:save},
            {text:'关闭', handler:function () {
                card_win.hide();
            }}
        ]
    })

    var company_grid = new Ext.grid.GridPanel({
        region:'west',
        width:600,
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:company_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有公司信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID", dataIndex:"org_id", width:50, hidden:true},
            {header:"单位名称", dataIndex:"org_name", width:250},
            {header:"单位简称", dataIndex:"org_sname", width:200}
            //{header:"金额", dataIndex:"org_balance", width:120,renderer:money}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:company_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有公司信息'
        }),
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){
                company_store.reload();
                card_store.removeAll();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'公司名称，公司简称',
                width:170,
                onTriggerClick:function (e) {
                    company_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            company_dosearch();
                        }
                    }
                }
            }
        ]
    });


    var card_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store : card_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有银行卡信息',
            deferEmptyText:true
        },
        tbar : [
            {text:'添加', iconCls:'button-add',handler:modify,hidden:isDisabled('BankCard::save')},
            {text:'编辑', id:'button-edit',iconCls:'button-edit',handler:modify,hidden:isDisabled('BankCard::save')},
            {text:'删除', iconCls:'button-del',handler:del,hidden:isDisabled('BankCard::del')},
            {text:'删除审核', iconCls:'button-close',handler:check_del,hidden:isDisabled('BankCard::check_del')}
        ],
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"卡ID", dataIndex:"bc_id", width:10,hidden:true},
            {header:"绑定状态 <i class='fa fa-question-circle'></i>",tooltip:'是否已经绑定至收款系统，收款结算卡只能绑定一张', dataIndex:"bc_is_bind",align:'center', width:110,renderer:function(v,m,r){
                var st = '未绑定';
                if(v==1 && r.get('bc_status')=='ok'){
                    st = '<span style="color:green">已绑定</span>';
                }else if(v==1 && r.get('bc_status')=='chk'){
                    st = '<span style="color:blue">删除审核中</span>';
                }
                return st;
            }},
            {header:"持卡人", dataIndex:"bc_card_man", width:120},
            {header:"银行名称", dataIndex:"bc_bank", width:140},
            {header:"支行名称", dataIndex:"bc_sub_branch", width:220},
            {header:"银行卡号", dataIndex:"bc_card_num", width:180},
            {header:"类型", dataIndex:"bc_card_type", width:80},
            {header:"添加时间", dataIndex:"bc_time", width:130}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:card_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有银行卡信息'
        })
    });


    new Ext.Viewport({
        layout:'border',
        items:[company_grid,card_grid]
    });

    function company_dosearch(){
        var key=Ext.getCmp('hotel_search').getValue();
        SUNLINE.baseParams(company_store,{skey:key},true);
        company_store.currentPage=1;
        company_store.load();
    }

    company_store.on('load',function(){
        card_store.removeAll();
        if(_uinfo['org_type']!='管理公司'){
            company_grid.getSelectionModel().select(0);
        }
    });
    if(_uinfo['org_type']!='管理公司'){
        company_store.on('beforeload',function(){
            SUNLINE.baseParams(company_store,{org_id:_uinfo['org_id']});
        });
    };

    company_grid.on('select',function(){
        var row=SUNLINE.getSelected(company_grid);
        SUNLINE.baseParams(card_store,{bc_org_id:row.data.org_id})
        card_store.currentPage=1;
        card_store.load();
    });

    card_win.on('hide',function(){
        add_form.form.reset();
    });

    card_grid.on('select',function(){
        Ext.getCmp('button-edit').setDisabled(true);
        var row=SUNLINE.getSelected(card_grid);
        if(row.get('bc_card_type')=='对私'){
            Ext.getCmp('button-edit').setDisabled(false);
        };
    });

    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(card_grid);
            if(!row) {
                Ext.Msg.alert('友情提示', '请选择您要操作的银行卡信息！');
                return false;
            }
        }
        var company_row=SUNLINE.getSelected(company_grid);
        if(!company_row){
            Ext.Msg.alert('友情提示', '请选择您要操作的公司！');
            return false;
        }
        card_win.setTitle(v.text+'银行卡');
        card_win.show();
        if(v.text=='编辑'){
            add_form.getForm().setValues(row.data);
            Ext.getCmp('bc_province_id').getStore().reload();
            Ext.getCmp('bc_province_id').setValue(row.data.bc_province);
            SUNLINE.baseParams(Ext.getCmp('bc_city_id').getStore(),{append_to:row.data.bc_province});
            Ext.getCmp('bc_city_id').getStore().reload();
            Ext.getCmp('bc_city_id').setValue(row.data.bc_city);
            Ext.getCmp('bc_card_num').setReadOnly(true);
        }else{
            Ext.getCmp('bc_card_num').setReadOnly(false);
            Ext.getCmp('bc_org_id').setValue(company_row.data.org_id);
        }
        var tip = Ext.create('Ext.tip.ToolTip', {
            target: 'bank_tips',
            html: '对私绑卡支持以下银行：<br>102 中国工商银行<br>103 中国农业银行<br>104 中国银行<br>105 中国建设银行<br>301 交通银行<br>302 中信银行<br>303 中国光大银行<br>308 招商银行<br>309 兴业银行<br>310 上海浦东发展银行<br>403 中国邮政储蓄银行'
        });
    }

    function save(){
        if(!add_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var data=add_form.getForm().getValues();
        if(data.bc_branch_code==''){
            Ext.Msg.alert('友情提示', '请选择正确的支行（只能选择，不能手动输入）。');
            return;
        }
        Ext.Msg.confirm('友情提示','请仔细核对银行卡信息，对公账户需要银行验证真实性，如信息错误会被驳回，再次修改需要重新验证（每次验证通常需要2个工作日），进而导致延误您的提现。',function(v) {
            if (v != 'yes')return false;
            var myMask = new Ext.LoadMask({target: card_win, msg: '数据提交中，请稍候...'});
            myMask.show();
            Ext.Ajax.request({
                url: $__app__ + '/BankCard/save',
                params: data,
                method: 'POST',
                success: function (response, otps) {
                    myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var info = result.info.msg ? result.info.msg : result.info;
                    Ext.Msg.alert('友情提示', info);
                    if (result.status == 1) {
                        card_win.hide();
                        card_store.reload();
                    }
                },
                failure: function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '添加失败');
                }
            });
        });
    }

    function del(){
        var row=SUNLINE.getSelected(card_grid);
        if(!row) {
            Ext.Msg.alert('友情提示', '请选择您要删除的银行卡！');
            return false;
        }
        var tips = row.get('bc_card_type')=='对公' ? '对公银行卡不会直接删除，需要客服审核并由收款系统删除，您确定要操作吗？' : '确定删除该银行卡吗？';
        Ext.MessageBox.confirm('友情提示',tips,function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/BankCard/del',
                    params:{bc_id:row.data.bc_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            card_store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        })
    }

    function check_del(){
        var row=SUNLINE.getSelected(card_grid);
        if(!row) {
            Ext.Msg.alert('友情提示', '请选择您要审核删除的银行卡！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定要审核删除该银行卡吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/BankCard/check_del',
                    params:{bc_id:row.data.bc_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            card_store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '审核删除失败');
                    }
                })
            }
        })
    }

});