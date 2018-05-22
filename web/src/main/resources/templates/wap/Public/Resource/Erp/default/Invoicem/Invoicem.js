Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='qtip';
    var status_color = {'待处理':'#ff0000', '已处理':'#3B994F', '已撤销':'#8899AB'}
    var i_url = $__app__ + '/Invoicem/invoiceDataJson';
    var i_field = ['in_id','in_org_name','in_title','in_get_type','in_type','in_signer','in_tel','in_real_money','in_deal_uid','in_apply_uname','in_apply_time','in_deal_time','in_audit_remark','in_description','in_order_info','in_status'];
    var invoice_store = new SUNLINE.JsonStore(i_url, i_field,true);
    invoice_store.on('load',function(){
        order_store.removeAll()
        if(_uinfo.org_type == '分销商'){
            Ext.getCmp('deal').hide();
        }
    });
    var o_url = $__app__ + '/Invoicem/orderDataJson';
    var o_field = [];
    var order_store = new SUNLINE.JsonStore(o_url, o_field,false);

    /**
     * 所属公司
     */
    if(_uinfo.org_type == '供应商'){
       var hiderule = true;
    }else{
       var hiderule = false;
    }

    var company_box=SUNLINE.CompanyBox({
        config:{
            id:"p_org",
            hidden:hiderule,
            displayField:'text',
            valueField:'id',
            fieldLabel:'分销商单位',
            labelWidth:80,
            width:250,
            labelAlign: 'right',
            value: '全部公司',
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box_store.load();
    /**    数据  ***/
    var invoice_grid = new Ext.grid.GridPanel({
        region:'center',
        width:500,
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:invoice_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有发票信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID", dataIndex:"in_id",name:"in_id", width:50, hidden:true},
            {header:"orderinfo", dataIndex:"in_order_info",name:"in_order_info", width:50, hidden:true},
            {header:"发票状态", dataIndex:"in_status",name:"in_status", width:80,renderer:in_status_data},
            {header:"发票抬头", dataIndex:"in_title",name:"in_title", width:200},
            {header:"实际开票金额", dataIndex:"in_real_money",name:"in_real_money", width:110,renderer:money},
            {header:"获取方式", dataIndex:"in_get_type",name:"in_get_type", width:110},
            {header:"申请人", dataIndex:"in_apply_uname",name:"in_apply_uname", width:100},
            {header:"申请时间", dataIndex:"in_apply_time",name:"in_apply_time", width:130},
            {header:"收件人", dataIndex:"in_signer",name:"in_signer", width:100},
            {header:"发票号", dataIndex:"in_number",name:"in_number", width:130},
            {header:"处理人", dataIndex:"in_deal_uname",name:"in_deal_uname", width:100},
            {header:"处理时间", dataIndex:"in_deal_time",name:"in_deal_time", width:130},
            {header:"申请备注", dataIndex:"in_description",name:"in_description", width:200},
            {header:"处理备注", dataIndex:"in_audit_remark",name:"in_audit_remark", width:200},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:invoice_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有发票信息'
        }),
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){
                invoice_store.reload();
                order_store.removeAll();
            }},
            {text:'撤销', iconCls:'button-del', handler:del_invoice},
            {text:'处理',id:'deal', iconCls:'button-edit', handler:deal_invoice},
            '-',
            company_box,
            '-',
            {xtype:'tbtext',text:'发票状态',style:"margin-top:5px;"},
            {
                id:"in_status_type",
                name:"in_status_type",
                xtype:"combo",
                editable:false,
                width:100,
                labelWidth:60,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['in_status_type'],
                    data:[
                        ['全部'],
                        ['待处理'],
                        ['已处理'],
                        ['已撤销']
                    ]
                }),
                displayField:"in_status_type",
                valueField:"in_status_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:'全部',
                style:"margin-top:5px"
            },
            '-',
            {
                id:"time_type",
                name:"time_type",
                xtype:"combo",
                editable:false,
                width:100,
                labelWidth:60,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['time_type'],
                    data:[
                        ['申请时间'],
                        ['处理时间']
                    ]
                }),
                displayField:"time_type",
                valueField:"time_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:'申请时间',
                style:"margin-top:5px"
            },
            SUNLINE.ExtDateField({allowBlank:true,id:'seach_start_date',name:'seach_start_date',value:'',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'seach_stop_date',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'seach_start_date'}),
            ,
            {text:'搜索', handler:invoice_dosearch},
            {icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png', cls: 'x-btn-icon', handler: function () {window.location.reload();}},
            '->',
            '关键字搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'invoice_search',
                cls:'search-icon-cls',
                emptyText:'发票抬头/申请人/处理人',
                width:170,
                onTriggerClick:function (e) {
                    invoice_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            invoice_dosearch();
                        }
                    }
                }
            }
        ]
    });
    //双击事件
    invoice_grid.addListener('rowdblclick', rowdblclickFn);

    var order_grid=new Ext.grid.GridPanel({
        id: 'order',
        border : false,
        region : 'south',
        split : {size:3},
        store : order_store,
        height:300,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有订单信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"订单ID", dataIndex:"o_id", width:10,hidden:true},
            {header:"订单编号", dataIndex:"o_number", width:180},
            {header:"开票金额", dataIndex:"invoice_money", width:100,renderer:money},
            {header:"累计开票金额", dataIndex:"all_invoice_money", width:100,renderer:money},
            {header:"订单实收金额", dataIndex:"o_buy_real", width:100,renderer:money},
            {header:"订单已付金额", dataIndex:"o_pay_money", width:100,renderer:money},
            {header:"产品", dataIndex:"o_product_name", width:180},
            {header:"分销商", dataIndex:"o_sorg_name", width:120},
            {header:"预购日期", dataIndex:"o_sell_time", width:100},
            {header:"出团日期", dataIndex:"o_start_date", width:100}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:order_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有订单信息'
        }),

    });

    new Ext.Viewport({
        layout: 'border',
        items:[invoice_grid,order_grid]
    });

    invoice_grid.on('select',function(){
        var row=SUNLINE.getSelected(invoice_grid);
        if(row.data.in_status != '待处理'){
            Ext.getCmp('deal').setText('查看');
            edit_win.setTitle('发票查看');
            Ext.getCmp('save_btn').setDisabled(true);
        }else{
            Ext.getCmp('deal').setText('处理');
            edit_win.setTitle('发票处理');
            Ext.getCmp('save_btn').setDisabled(false);
        }
        SUNLINE.baseParams(order_store,{o_id:row.data.in_id},true);
        order_store.currentPage=1;
        order_store.load();
    })


    /**  发票处理基本信息的表单  ***/
    //收取方式
    var invoice_type= new Ext.form.ComboBox({
        id:"in_get_type",
        name:"in_get_type",
        fieldLabel:"收取方式",
        allowBlank:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[
                ['委托销售代送'],
                ['前台自取'],
                ['快递'],
                ['挂号信']
            ]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:"委托销售代送",
        width:250,
        labelWidth:90,
        labelAlign:"right"
    });
    invoice_type.on('change',changeInvocieType);
    //开票项目
    var in_item= SUNLINE.DictComBox(
        {fieldLabel:"开票项目",name:'in_item',id:'in_item',width:250,allowBlank:false,editable:false,labelWidth:90,labelAlign:"right"},
        {'d_type':'开票项目'}
    );
    in_item.store.load();
    in_item = in_item.box;
    //快递公司
    var Dict_cmb_m = SUNLINE.DictComBox({id:'in_express_org',name:'in_express_org',fieldLabel:'快递公司',labelWidth:90,labelAlign:"right",disabled:true,allowBlank:false},{'d_type':'快递公司'});
    //付费类型
    var pay_store=new Ext.data.SimpleStore({
        fields:['value'],
        data:[['签单'],['快递卡'],['积分'],['现金']]
    });
    var pay_type_combo = new Ext.form.ComboBox({
        fieldLabel:"付费方式",
        width:250,
        labelWidth:90,
        id:"in_express_type",
        name:"in_express_type",
        labelAlign:"right",
        triggerAction:"all",
        store:pay_store,
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        editable:false,
        typeAhead:true,
        disabled:true,
        value:""
    });
    //发票数据
    var invoice_item = [
        {id:"o_worg_name",name:"in_org_name",fieldLabel:"供应商",xtype:'textfield',value:'',labelWidth:90,width:500,editable :false},
        {id:"in_title", name:"in_title", fieldLabel:"发票抬头", width:500, allowBlank:false,editable :false},
        {id:"in_org_id",name:"in_org_id",fieldLabel:"公司ID",hidden:true},
        {id:"in_money",name:"in_money",fieldLabel:"已付金额",xtype:'textfield',editable :false},
        {id:"in_real_money",name:"in_real_money",fieldLabel:"实际开票",allowBlank:false,labelAlign:'right',xtype:'textfield',minValue:0,editable :false},
        in_item,
        {id:"in_number",name:"in_number",fieldLabel:"发票号",allowBlank:false, labelAlign:"right"},

    ];
    //寄送方式
    var send_item = [
        invoice_type,
        {id:"in_signer",name:"in_signer",allowBlank:false,fieldLabel:"分销商联系人",editable :false},
        {id:"in_address",name:"in_address",allowBlank:false,fieldLabel:"地址",editable :false},
        {id:"in_tel",name:"in_tel",fieldLabel:"分销商电话",allowBlank:false, labelAlign:"right",editable :false},
        {id:'in_worg_man',name:'in_worg_man',fieldLabel:'供应商联系人',disabled:true,allowBlank:false},
        {id:'in_worg_phone',name:'in_worg_phone',fieldLabel:'供应商电话',disabled:true,allowBlank:false},
        Dict_cmb_m.box,
        {id:'in_express_num',name:'in_express_num',fieldLabel:'快递单号',disabled:true,allowBlank:false},
        pay_type_combo,
        {id:'in_express_money',name:'in_express_money',fieldLabel:'快递金额',disabled:true,xtype:'numberfield',minValue:0},
    ];
    var edit_form = new Ext.form.FormPanel({
        border:false,
        bodyPadding: 5,
        bodyStyle:"background:#fff;",
        autoHeight:true,
        region : 'center',
        width : 560,
        layout:'column',
        defaults : {
            defaultType : "textfield",
            defaults : {xtype:'textfield',style:'margin-top:5px;',width:250,labelWidth:90,labelAlign:"right"},
            bodyStyle:"background:#fff;"
        },
        items: [
            {xtype:'textfield',hidden:true, id:'in_id',name:'in_id'},
            {xtype:'textfield',hidden:true, id:'in_status',name:'in_status'},
            {xtype:'fieldset',title:'发票数据',cls:'tcol2',items:invoice_item},
            {xtype:'fieldset',title:'寄送方式',cls:'tcol2',items:send_item},
            {xtype:'fieldset',title:'备注信息',cls:'tcol1',items:[
                {id:"in_description",name:"in_description",fieldLabel:"申请备注",xtype:'textarea',editable :false,labelWidth:80,width:530},
                {id:"in_audit_remark",name:"in_audit_remark",fieldLabel:"处理备注",xtype:'textarea',labelWidth:80,width:530}
            ]},
        ]


    });


    var edit_win=new Ext.Window({
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:edit_form,
        title:'发票处理',
        buttons:[
            {id:'save_btn',text:'保存',handler:save},
            {text:'关闭', handler:function () {
                edit_win.hide();
            }}
        ]
    })

    edit_win.on('hide',function(){
        edit_form.form.reset();
    })
    /**  发票撤销基本信息的表单  ***/
    var del_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:"background:#fff;",
        autoHeight:true,
        region : 'center',
        width : 530,
        layout:'column',
        style:'margin-top:10px',
        defaults : {
            defaultType : "textfield",
            border:false,
            defaults : {xtype:'textfield',style:'margin-top:5px;',width:250,labelWidth:100,labelAlign:"right"},
            bodyStyle:"background:#fff;"
        },
        items:[
            {
                columnWidth:1,
                cls:'tcol1',
                defaults : {
                    defaultType : "textarea",
                    labelAlign:"right",
                    labelWidth:100,
                    width:500
                },
                items : [
                    {id:"in_audit_remark_cancel",name:"in_audit_remark",fieldLabel:"请填写撤销原因",xtype:'textarea',allowBlank:false}
                ]
            }
        ]
    });
    var del_win=new Ext.Window({
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:del_form,
        title:'确定撤销发票么?',
        buttons:[
            {text:'确定',handler:dodel_invoice},
            {text:'关闭', handler:function () {
                del_win.hide();
            }}
        ]
    })
    del_win.on('hide',function(){
        del_form.form.reset();
    })
    /**     方法  ***/
    function save() {
        if(!edit_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var data=edit_form.getForm().getValues();
        var myMask=new Ext.LoadMask({target:edit_win,msg:'数据提交中，请稍候...'});
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Invoicem/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                if(result.status ==1){
                    invoice_store.reload();
                    edit_win.hide();
                }
                Ext.Msg.alert('友情提示', result.info.msg);
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '处理失败');
            }
        });
    }

    /**
     * 显示撤销发票页面
     * @returns {boolean}
     */
    function del_invoice(){
        var invoice=SUNLINE.getSelected(invoice_grid);
        if(!invoice){
            Ext.Msg.alert('友情提示','请选择发票');return false;
        }
        if(invoice.data.in_status != '待处理'){
            Ext.Msg.alert('友情提示','该发票无法撤销或已撤销');return false;
        }
        del_win.show();
    }
    /**
     * 撤销发票
     * @returns {boolean}
     */
    function dodel_invoice(){
        if(!del_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var invoice=SUNLINE.getSelected(invoice_grid);
        if(!invoice){
            Ext.Msg.alert('友情提示','请选择发票');return false;
        }
        var in_audit_remark = Ext.getCmp('in_audit_remark_cancel').getValue();
        Ext.Ajax.request({
            url : $__app__ + '/Invoicem/del',
            method:'post',
            waitMsg:'数据加载中，请稍后....',
            params:{in_id:invoice.data.in_id,in_audit_remark:in_audit_remark},
            success:function(response,opts){
                var obj=Ext.decode(response.responseText);
                if(obj.status == 1) {//如果你处理的JSON串中true不是字符串，就obj.success == true
                    Ext.Msg.alert('友情提示', obj.info);
                    invoice_store.reload();
                    del_win.hide();
                } else {
                    Ext.Msg.alert('友情提示', obj.info);
                    del_win.hide();
                }
            },
            failure:function(response,opts){
                var obj=Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', '撤销失败！');
            }
        });
    }

    /**
     * 处理发票
     * @returns {boolean}
     */
    function deal_invoice(){
        Dict_cmb_m.store.load();
        var row=SUNLINE.getSelected(invoice_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要处理的发票!');
            return;
        }
        edit_form.getForm().setValues(row.data);
        changeInvocieType();
        if(row.data.in_status != '待处理'){
            Ext.getCmp('in_get_type').setReadOnly(true);
        }else{
            Ext.getCmp('in_get_type').setReadOnly(false);
        }
        edit_win.show();
    }

    function invoice_dosearch(){
        var org_id = Ext.getCmp('p_org').getValue();
        var key=Ext.getCmp('invoice_search').getValue();
        var startTime = Ext.getCmp('seach_start_date').getValue();
        var endTime = Ext.getCmp('seach_stop_date').getValue();
        var time_type = Ext.getCmp('time_type').getValue();
        var in_status_type = Ext.getCmp('in_status_type').getValue();
        SUNLINE.baseParams(invoice_store,{org_id:org_id,key:key,startTime:startTime,endTime:endTime,timetype:time_type,in_status_type:in_status_type},true);
        invoice_store.currentPage=1;
        invoice_store.load();
    }
    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }

    function changeInvocieType(){
        var invoice_type_content =  Ext.getCmp('in_get_type').getValue();
        if(invoice_type_content == '快递' || invoice_type_content == '挂号信'){
            Ext.getCmp('in_worg_man').setDisabled(true);
            Ext.getCmp('in_worg_phone').setDisabled(true);
            Ext.getCmp('in_express_org').setDisabled(false);
            Ext.getCmp('in_express_type').setDisabled(false);
            Ext.getCmp('in_express_num').setDisabled(false);
            Ext.getCmp('in_express_money').setDisabled(false);
        }else if(invoice_type_content == '前台自取' || invoice_type_content == '委托销售代送') {
            Ext.getCmp('in_worg_man').setDisabled(false);
            Ext.getCmp('in_worg_phone').setDisabled(false);
            Ext.getCmp('in_express_org').setDisabled(true);
            Ext.getCmp('in_express_type').setDisabled(true);
            Ext.getCmp('in_express_num').setDisabled(true);
            Ext.getCmp('in_express_money').setDisabled(true);
        }
    }

    function in_status_data(v, m, r){
        return '<div style="width:52px;border-radius:3px;padding:2px 5px;color:#fff;background-color: '+status_color[v]+'">'+v+'</div>';
    };

    function rowdblclickFn(){
        if(_uinfo.org_type == '分销商'){
            Ext.getCmp('save_btn').hide();
        }
        deal_invoice();
    }


});