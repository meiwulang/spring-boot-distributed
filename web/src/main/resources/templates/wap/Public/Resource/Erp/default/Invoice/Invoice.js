Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='qtip';
    var c_url = $__app__ + '/Invoice/companyDataJson';
    var c_field = [];
    var company_store = new SUNLINE.JsonStore(c_url, c_field,true);

    var i_url = $__app__ + '/Invoice/orderDataJson';
    var i_field = [];
    var invoice_store = new SUNLINE.JsonStore(i_url, i_field,false);
    company_store.on('load',function(){
        invoice_store.removeAll();
    });
    /**
     * 所属公司
     */
    var hiderule;
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
    company_box.on('select',function(c,r){
        company_dosearch();
    });
    /**    数据  ***/
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
            {header:"ID", dataIndex:"o_worg_id", width:50, hidden:true},
            {header:"已付金额", dataIndex:"o_pay_money", width:100,renderer:money},
            {header:"单位简称", dataIndex:"org_sname", width:150},
            {header:"供应商单位名称", dataIndex:"o_worg_name", width:250},
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
                invoice_store.removeAll();
            }},
            '-',
            company_box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'供应商公司名称',
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

    var invoice_grid=new Ext.grid.GridPanel({
        selModel: {
            selType: 'checkboxmodel'
        },
        id: 'invoice',
        border : false,
        region : 'center',
        store : invoice_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有订单信息',
            deferEmptyText:true
        },
        tbar :  [
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:6,
                items:[
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
                                ['预购日期'],
                                ['出团日期']
                            ]
                        }),
                        displayField:"time_type",
                        valueField:"time_type",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:'预购日期',
                        style:"margin-top:5px"
                    },
                     SUNLINE.ExtDateField({allowBlank:true,id:'seach_start_date',name:'seach_start_date',value:'',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'seach_stop_date',start:true}),
                    {xtype:'tbtext',text:'~',style:"margin-top:5px;"},
                     SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:160,gang:'seach_start_date'}),
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',width:50,height:55,handler:order_dosearch,style:'margin-left:5px'},
                    {xtype:'tbtext',text:'&nbsp;&nbsp;&nbsp;&nbsp;'},
                    {xtype:'textfield',id:'OrderKeyWord',name:'OrderKeyWord',colspan:5,width:400,emptyText:'请输入关键词：订单号/产品'},
                ]
            },
            '->',
            Ext.Button({
                text: '<font color="white">立即申请</font>',
                width:150,
                height:30,
                style: 'background:#169BD5;',
                cls:'',
                handler:add_win_show
            })

        ],
        columns:[
            {header:"订单ID", dataIndex:"o_id", width:10,hidden:true},
            {header:"可开票金额", dataIndex:"o_can_money", width:150,renderer:money},
            {header:"订单已付金额", dataIndex:"o_pay_money", width:150,renderer:money},
            {header:"订单号", dataIndex:"o_number", width:180},
            {header:"产品", dataIndex:"o_product_name", width:180},
            {header:"分销商", dataIndex:"o_sorg_name", width:180},
            {header:"预购日期", dataIndex:"o_sell_time", width:120},
            {header:"出团日期", dataIndex:"o_start_date", width:120}
        ],
        bbar:[
            {xtype:'tbtext',id:'totalmoney',text:'<span>已选0个订单，可开票￥0;</span>'},

        ],
        listeners: {
            selectionchange: getInvoice,
        }
    });

    new Ext.Viewport({
        layout:'border',
        items:[company_grid,invoice_grid]
    });

    company_grid.on('select',function(){
        var s_org_id = Ext.getCmp('p_org').getValue();
        var key=Ext.getCmp('OrderKeyWord').getValue();
        var seach_start_date = Ext.getCmp('seach_start_date')
        seach_start_date.setValue('');
        var startTime = Ext.getCmp('seach_start_date').getValue();
        var endTime = Ext.getCmp('seach_stop_date').getValue();
        var time_type = Ext.getCmp('time_type').getValue();
        var row=SUNLINE.getSelected(company_grid);
        SUNLINE.baseParams(invoice_store,{o_sorg_id:s_org_id,o_worg_id:row.data.o_worg_id,key:key,startTime:startTime,endTime:endTime,timetype:time_type},true);
        invoice_store.currentPage=1;
        invoice_store.load();
    })

    /**     基本信息的表单  ***/
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
        labelWidth:80,
        labelAlign:"right"
    });
    //开票项目
    var in_item= SUNLINE.DictComBox(
        {fieldLabel:"开票项目",name:'in_item',id:'in_item',width:250,allowBlank:false,editable:false,labelWidth:80,labelAlign:"right"},
        {'d_type':'开票项目'}
    );
    in_item.store.load();
    in_item = in_item.box;
    var add_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:"background:#fff;",
        autoHeight:true,
        region : 'center',
        width : 530,
        layout:'column',
        defaults : {
            defaultType : "textfield",
            border:false,
            defaults : {xtype:'textfield',style:'margin-top:5px;',width:250,labelWidth:80,labelAlign:"right"},
            bodyStyle:"background:#fff;"
        },
        items:[
            {xtype:'textfield',hidden:true, id:'oids',name:'oids', value:''},
            {xtype:'textfield',hidden:true, id:'in_sorg_id',name:'in_sorg_id', value:_uinfo.org_id},
            {xtype:'textfield',hidden:true, id:'in_sorg_name',name:'in_sorg_name', value:_uinfo.org_name},
            {xtype:'textfield',hidden:true, id:'in_workgroup_id',name:'in_workgroup_id', value:_uinfo.u_wg_id},
            {xtype:'textfield',hidden:true, id:'in_workgroup_name',name:'in_workgroup_name', value:_uinfo.wg_name},
            {
                columnWidth:1,
                cls:'tcol1',
                items : [
                    {id:"o_worg_name",name:"in_org_name",fieldLabel:"供应商",xtype:'textfield',value:'',labelWidth:80,width:500},
                    {xtype:'displayfield',hidden:true,width:500, id:'invoice_total', value:'',style:'margin-left:25px;'}
                ]
            },
            {
                columnWidth:1,
                cls:'tcol1',
                items : [
                    {id:"in_title", name:"in_title", fieldLabel:"发票抬头", width:500, allowBlank:false}
                ]
            },
            {
                columnWidth:1,
                cls:'tcol2',
                items : [
                    {id:"in_org_id",name:"in_org_id",fieldLabel:"公司ID",hidden:true},
                    {id:"in_money",name:"in_money",fieldLabel:"已付金额",xtype:'numberfield',readonly:true},
                    {id:"in_real_money",name:"in_real_money",fieldLabel:"实际开票",allowBlank:false,labelAlign:'right',xtype:'numberfield'},
                    invoice_type,
                    {id:"in_signer",name:"in_signer",allowBlank:false,fieldLabel:"联系人",value:_uinfo.u_realname},
                    {id:"in_address",name:"in_address",allowBlank:false,fieldLabel:"地址",value:_uinfo.u_addr},
                    {id:"in_tel",name:"in_tel",fieldLabel:"联系电话",allowBlank:false, labelAlign:"right",value:_uinfo.u_mobile}
                ]
            },
            {
                columnWidth:1,
                cls:'tcol2',
                items :[
                    in_item,
                ]
            },
            {
                columnWidth:1,
                cls:'tcol1',
                defaults : {
                    defaultType : "textarea",
                    labelAlign:"right",
                    labelWidth:80,
                    width:500
                },
                items : [
                    {id:"in_description",name:"in_description",fieldLabel:"备注说明",xtype:'textarea'},
                ]
            }
        ]
    });


    var add_win=new Ext.Window({
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:add_form,
        title:'发票申请',
        buttons:[
            {text:'保存',handler:save},
            {text:'关闭', handler:function () {
                add_win.hide();
            }}
        ]
    })

    add_win.on('hide',function(){
        add_form.form.reset();
    })

    /**     方法  ***/
    function save(){
        if(!add_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var data=add_form.getForm().getValues();
        var myMask=new Ext.LoadMask({target:add_win,msg:'数据提交中，请稍候...'});
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Invoice/invoiceSave',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', result.info.msg);
                if(result.status ==1){
                    invoice_store.reload();
                    add_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '添加失败');
            }
        });
    }
    //获取选中数据
    function getInvoice(){
        var invoice =Ext.getCmp('invoice');
        var records= invoice.getSelectionModel().getSelection();
        var is_can_invoice = 0;
        for(var i = 0;i<records.length;i++){
            is_can_invoice = parseFloat(is_can_invoice)+parseFloat(records[i].data.o_can_money);
        }
        var str = "<span>已选"+records.length+"个订单，可开票￥"+is_can_invoice.toFixed(2)+"</span>";
        var totalmoney = Ext.getCmp('totalmoney');
        totalmoney.setText(str);
        return is_can_invoice;
    }

    function company_dosearch(){
        var org_id = Ext.getCmp('p_org').getValue();
        var key=Ext.getCmp('hotel_search').getValue();
        SUNLINE.baseParams(company_store,{org_id:org_id,skey:key},true);
        company_store.currentPage=1;
        company_store.load();
    }
    function order_dosearch(){
        var key=Ext.getCmp('OrderKeyWord').getValue();
        var startTime = Ext.getCmp('seach_start_date').getValue();
        var endTime = Ext.getCmp('seach_stop_date').getValue();
        var time_type = Ext.getCmp('time_type').getValue();
        SUNLINE.baseParams(invoice_store,{key:key,startTime:startTime,endTime:endTime,timetype:time_type},true);
        invoice_store.currentPage=1;
        invoice_store.load();
    }
    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }
    function add_win_show(){
        var company=SUNLINE.getSelected(company_grid);
        if(!company){
            Ext.Msg.alert('消息提示','请选择开票公司');return false;
        }
        var o_worg_name = Ext.getCmp('o_worg_name');
        o_worg_name.setValue(company.data.o_worg_name);
        var in_org_id = Ext.getCmp('in_org_id');
        in_org_id.setValue(company.data.o_worg_id);
        o_worg_name.setReadOnly(true);

        //订单数据
        var invoice =Ext.getCmp('invoice');
        var records_invoice= invoice.getSelectionModel().getSelection();
        var in_real_money = Ext.getCmp('in_real_money');
        var in_money = Ext.getCmp('in_money');
        var in_title = Ext.getCmp('in_title');
        in_real_money.setReadOnly(false);
        if(records_invoice.length <1){
            Ext.Msg.alert('消息提示','请选择开票订单');return false;
        }else if(records_invoice.length>1){
            in_real_money.setReadOnly(true);
        }
        var is_can_invoice = o_pay_money = 0;
        var oids = '';
        for(var i = 0;i<records_invoice.length;i++){
            is_can_invoice = parseFloat(is_can_invoice)+parseFloat(records_invoice[i].data.o_can_money);
            o_pay_money = parseFloat(o_pay_money)+parseFloat(records_invoice[i].data.o_pay_money);
            oids = oids + records_invoice[i].data.o_id+',';
        }
        in_real_money.setValue(is_can_invoice);
        in_money.setValue(o_pay_money);
        in_money.setReadOnly(true);
        Ext.getCmp('oids').setValue(oids);

        //设置发票抬头是否可以自己设置
        var $url = $__app__ + '/Set/dataJson';
        Ext.Ajax.request( {
            url : $__app__ + '/Set/dataJson',
            params:{org_id:company.data.o_worg_id},
            success : function(response, options) {
                var o = JSON.parse(response.responseText);
                if(o.is_make_title != 1){
                    in_title.setReadOnly(true);
                }else{
                    in_title.setReadOnly(false);
                }
            },
            failure : function() {
                Ext.Msg.alert('消息提示','系统错误');
            }
        });
        in_title.setValue(_uinfo.org_name);
        add_win.show();
    }

});