Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.QuickTips.init();
    var thisTitle = '账单详情';
    var dis_url = $__app__+'/CreditBill/billJson';
    var dis_fields = [];
    var _store = SUNLINE.JsonStore(dis_url,dis_fields);
    var isHidden = _uinfo.org_type=='管理公司' ? false : true;
    var isSupplyHidden = _uinfo.org_type=='管理公司' || _uinfo.org_type=='供应商' || (_uinfo.org_type=='分销商' && _uinfo.u_scope=='单位级' && _uinfo.org_pid==0) ? false : true;
    var _cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID",dataIndex:"cb_id",width:40,hidden:true},
        {header:"凭证编号",dataIndex:"cb_number",width:150},
        {header:"收款单位",dataIndex:"cb_worg_name",width:200,hidden:isHidden},
        {header:"付款单位ID",dataIndex:"org_id",width:100,align:'center',hidden:true},
        {header:"付款单位",dataIndex:"cb_org_name",width:320,hidden:isSupplyHidden},
        {header:"单位ID",dataIndex:"cb_orgid",width:200,hidden:true},
        {header:"账单金额",dataIndex:"cb_bill_amount",width:100,renderer:money,align:"right"},
        {header:"已还金额",dataIndex:"cb_repay_amount",width:100,renderer:money,align:"right"},
        {header:"费用金额",dataIndex:"cb_oddment",width:100,renderer:money,align:"right"},
        {header:"未还金额",dataIndex:"cb_repay_amount",width:100,renderer:nopay_money,align:"right"},
        {header:"账单日期",dataIndex:"cb_bill_date",width:100},
        {header:"还款日期",dataIndex:"cb_repay_time",width:145,renderer:repay_time},
        {header:"生成方式",dataIndex:"cb_flag",width:80},
        {header:"还款进度",dataIndex:"cb_repay_amount",width:150,renderer:getprogress},
        {header:"结算周期<i class='fa fa-question-circle'></i>",dataIndex:"cb_cycle",width:120,renderer:getcycle,tooltip:"该结算周期为生成账单时供应商设置的结算周期"},
        {header:"备注",dataIndex:"cb_remark",width:150,renderer:function(v){
            if(v) {
                return '<div title="' + v + '">' + v + '</div>';
            }
        }},
    ];

    if(_uinfo['org_type'] == '分销商'){
        var type_name = '收款单位';
        //构建收款单位的combobox
        var conf = {
            displayField:'text',
            valueField:'id',
            fieldLabel:'',
            id:'company_box',
            labelWidth:60,
            hiddenName:'org_id',
            width:160,
            pageSize:20,
            value:'',
            listConfig:{
                width:400,
                minWidth:300,
                maxWidth:500
            },
            labelAlign:'right'
        };
        var company_config=Ext.apply(conf,{});
        var company_box= SUNLINE.CompanyBox({
            where:{  org_type:'供应商',source:'order' },
            config:company_config
        });
    }else{
        //构建付款单位的combobox
        var type_name = '付款单位';
        var conf = {
            displayField:'text',
            valueField:'id',
            fieldLabel:'',
            id:'company_box',
            labelWidth:60,
            hiddenName:'org_id',
            width:160,
            pageSize:20,
            value:'',
            listConfig:{
                width:400,
                minWidth:300,
                maxWidth:500
            },
            labelAlign:'right'
        };
        var company_config=Ext.apply(conf,{});
        var company_box= SUNLINE.CompanyBox({
            where:{  org_type:'分销商',source:'creditbill' },
            config:company_config
        });
        var company_box_store=company_box.getStore();
        company_box_store.on('load',function(a,b,c){
            this.add({id:0,text:'全部分销商', org_bh: "quanbu", org_type: "分销商",tel:'120'});
            for(var i in b){
                this.add(b[i]['data']);
            }
        });
    }
    //构建收款单位的combobox
    var conf_s = {
        hidden:isHidden,
        displayField:'text',
        valueField:'id',
        id:'company_box_s',
        labelWidth:60,
        fieldLabel:'收款单位',
        hiddenName:'supply_org_id',
        width:400,
        pageSize:20,
        value:'',
        listConfig:{
            width:400,
            minWidth:300,
            maxWidth:500
        },
        labelAlign:'right'
    };
    var company_config_s=Ext.apply(conf_s,{});
    var company_box_s= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order' },
        config:company_config_s
    });
    company_box_s.on('select',function(c,r){
        quick_search();
    });
    var finishComob=new Ext.form.ComboBox({
        fieldLabel:"",
        allowBlank:false,
        width:160,
        triggerAction:"all",
        editable:false,
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部(不含已撤销)'],['未还款'],['未还完'],['已还完'],['已撤销']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:"全部(不含已撤销)"
    });

    var creditKindComob=new Ext.form.ComboBox({
        fieldLabel:"生成方式",
        labelWidth:70,
        labelAlign:'right',
        allowBlank:false,
        width:170,
        triggerAction:"all",
        editable:false,
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['手动生成'],['自动生成']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:"全部"
    });
    var cycleComob=new Ext.form.ComboBox({
        fieldLabel:"结算周期",
        allowBlank:false,
        labelWidth:70,
        labelAlign:'right',
        width:170,
        triggerAction:"all",
        editable:false,
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['日结'],['周结'],['月结'],['手动']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:"全部"
    });

    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: _store,//数据源
        columns: _cm,//表格列定义
        viewConfig: {emptyText: '暂时没有信用账单',deferEmptyText:true,enableTextSelection: true},
        tbar:[
            {
                xtype:'buttongroup',
                title:'信用账单管理',
                height:80,
                columns: 4,
                defaults: {
                    scale: 'small'
                },
                items:[
                    {text:'销账',id:"deal_bill",rowspan: 2,height:48,disabled:isDisabled("CreditBill::repay"),iconCls: 'button-write',iconAlign: 'top',handler:generate},
                    {text:'打印账单',id:'print_bill',rowspan: 2,iconCls: 'button-print',height:48,disabled:isDisabled("CreditBill::print_bill"),iconAlign: 'top',handler:printPlan},
                    {text:'导出账单',id:'export_details',rowspan: 2,iconCls: 'button-excel',height:48,disabled:isDisabled("CreditBill::print_bill"),iconAlign: 'top',handler:do_export},
                    {text:'撤销账单',id:'revoke_bill',disabled:isDisabled("CreditBill::revoke"),handler:revokeBill},
                    {text:'移除订单',id:'remove_order',disabled:isDisabled("CreditBill::revoke"),handler:printPlan},
                ]
            },
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:7,
                items:[
                    // {xtype:'tbtext',text:'所属市场:',height:29,style:'line-height:26px'},
                    // worg_box,
                    {xtype:'tbtext',text: type_name ,height:29,style:'line-height:26px'},
                    company_box,
                    {xtype:'tbtext',text:'&nbsp;&nbsp;&nbsp;&nbsp;'},
                    finishComob,
                    creditKindComob,
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',height:55,handler:quick_search,style:'margin-left:5px'},
                    {text:'日志',iconCls:'button-log',id:'ziyo_log_btn',style:'margin-left:5px'},
                    //{text:'导出',hidden:true,rowspan:2,iconCls: 'button-excel',iconAlign: 'top',height:55,handler:exportExcel,style:'margin-left:5px'},
                    // {xtype:'tbtext',text:'销售人员:',height:29,style:'line-height:26px'},
                    // sale_box,
                    {xtype:'tbtext',text:'账单日期:',height:29,style:'line-height:26px'},
                    new SUNLINE.ExtDateField({allowBlank:true,id:'ap_start_date',name:'ap_start_date',labelWidth:0,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:160,gang:'ap_end_date',start:true}),
                    {xtype:'tbtext',text:'~',height:29,style:'line-height:26px;text-align:center'},
                    new SUNLINE.ExtDateField({allowBlank:true,id:'ap_end_date',name:'ap_end_date',labelWidth:1,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:160,gang:'ap_start_date'}),
                    cycleComob,
                    {text:'清空',icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',cls: 'x-btn-icon',style:'margin-left:5px', handler:clear_search},

                ]
            },'->',{
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:80,
                bodyStyle:'padding:10px',
                items:[{
                    xtype:'trigger',
                    triggerCls:'x-form-search-trigger',
                    width:300,
                    id:'skey',
                    cls:'search-icon-cls',
                    emptyText:'账单号/分销商名称/编号/法人姓名/手机号',
                    onTriggerClick:function(){
                        quick_search()
                    },
                    listeners:{
                        specialkey:function(t,e){
                            if(e.keyCode==13) quick_search()
                        }
                    }
                },{
                    xtype:'hidden',
                    id:'h_jgid',
                    value:0
                },{
                    xtype:'hidden',
                    id:'h_uid',
                    value:0
                }]
            }],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据',
            items:[
                company_box_s,
            ],
        })
    });

    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    _grid.getSelectionModel().on('select', function(sm,record){
        Ext.getCmp("deal_bill").setDisabled(true);
        Ext.getCmp("print_bill").setDisabled(true);
        Ext.getCmp("revoke_bill").setDisabled(true);
        Ext.getCmp("remove_order").setDisabled(true);
        Ext.getCmp("export_details").setDisabled(true);
        if(record.data.cb_status=="未还款"){
            Ext.getCmp("deal_bill").setDisabled(false);
            Ext.getCmp("print_bill").setDisabled(false);
            Ext.getCmp("revoke_bill").setDisabled(false);
            Ext.getCmp("remove_order").setDisabled(false);
            Ext.getCmp("export_details").setDisabled(false);
        }else if(record.data.cb_status=="未还完"){
            Ext.getCmp("deal_bill").setDisabled(false);
            Ext.getCmp("print_bill").setDisabled(false);
            Ext.getCmp("revoke_bill").setDisabled(false);
            Ext.getCmp("remove_order").setDisabled(false);
            Ext.getCmp("export_details").setDisabled(false);
        }else if(record.data.cb_status=="已还完"){
            Ext.getCmp("print_bill").setDisabled(false);
            Ext.getCmp("export_details").setDisabled(false);
        }
        if(_uinfo['org_type'] == '分销商'){
            Ext.getCmp("deal_bill").setDisabled(true);
            Ext.getCmp("revoke_bill").setDisabled(true);
            Ext.getCmp("remove_order").setDisabled(true);
        }
        var role = _uinfo.r_role;
        if(in_array('CreditBill::repay',role)==-1){
            Ext.getCmp("deal_bill").setDisabled(true);
        }
    });


    var credit_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:#ff; padding:10px;',
        defaultType : 'textfield',
        defaults:{labelWidth:100, anchor:'95%',labelAlign:'right' },
        items:[
            {id:"org_name", name:"org_name", fieldLabel:"单位名称",readOnly:true},
            {id:"cb_number", name:"cb_number", fieldLabel:"凭证编号", readOnly:true},
            {id:"cb_bill_date", name:"cb_bill_date", fieldLabel:"账单日期",readOnly:true},
            {id:"cb_bill_amount", name:"cb_bill_amount", fieldLabel:"账单金额", readOnly:true,renderer:money},
            {id:"cb_bill_balance", name:"cb_bill_balance", fieldLabel:"未还款金额",readOnly:true},
            {id:"repay_amount", name:"repay_amount",xtype:'hidden'},
            {id:"cb_oddment", name:"cb_oddment", fieldLabel:"费用",xtype:'numberfield',value:0,allowBlank:false,minValue:0},
            {id:"cb_repay_amount", name:"cb_repay_amount", fieldLabel:"<span style='color: blue;'>本次还款</span>", style:'color:blue;', xtype:'numberfield'},
            /*{id:'paymethod',xtype:'checkboxgroup',fieldLabel: ' ',columns: 1,labelSeparator:' ',vertical: true,
             items: [
             {id:'pay_balance',boxLabel: '从账户余额中扣除', name: 'pay_balance', inputValue: '是',checked: true }
             ]
             },*/
            {id:'pay_balance',name:'pay_balance',value:'是',xtype:'hidden'},
            {id:"remark", name:"remark", fieldLabel:"还款说明", maxLength:500, xtype:'textarea',width:260,height:100},
            {xtype:'displayfield', fieldLabel:' ', labelSeparator:'', value:'<span style="color: #666;">还款说明中关于费用的说明请每项<span style="color: orangered;">单独一行</span>填写，格式[优惠：60]（不要方括号）</span>'}
        ]
    });
    Ext.getCmp('cb_oddment').on('blur',function(){
        var bill_amount = parseFloat(Ext.getCmp('cb_bill_amount').getValue()); //账单金额
        var repay_amount = parseFloat(Ext.getCmp('repay_amount').getValue()); //这是什么金额？
        var oddment = parseFloat(Ext.getCmp('cb_oddment').getValue()); //费用金额
        if(bill_amount-repay_amount >0){
            var repay_balance = bill_amount - repay_amount - oddment;
        }else if(bill_amount-repay_amount <0){
            var repay_balance = bill_amount - repay_amount + oddment;
        }else{
            Ext.getCmp('cb_oddment').setValue(0);
        }
        if(repay_balance<0){
            Ext.getCmp('cb_repay_amount').setMinValue(repay_balance.toFixed(2));
            Ext.getCmp('cb_repay_amount').setMaxValue(0);
        }else{
            Ext.getCmp('cb_repay_amount').setMinValue(0);
            Ext.getCmp('cb_repay_amount').setMaxValue(repay_balance.toFixed(2));
        }
        Ext.getCmp('cb_repay_amount').setValue(repay_balance);
    });

    //结款窗口
    var credit_win = new Ext.Window({
        title: '手动还款',
        width: document.body.clientWidth > 420 ? 420 : document.body.clientWidth - 20,
        autoHeight : true,
        closable:false,
        modal:true,
        style:'background:#fff',
        resizable:false,
        items: credit_form,
        buttonAlign:'left',
        buttons:[
            {xtype:'tbtext',id:'hj',style:'font-weight:bold;color:blue',text:''},'->',
            {text:'打印账单',disabled:isDisabled("CreditBill::print_bill"),handler:printPlan},
            //{text:'Values',handler:function(){ showFormValues(credit_form)} },
            {text:'确认还款',handler:dispose },
            {text:'关闭',handler:function(){credit_win.hide();}
        }]
    });

    credit_win.on("hide",function(){
        var f=credit_form.getForm();
        Ext.getCmp('cb_repay_amount').setMinValue(false);
        Ext.getCmp('cb_repay_amount').setMaxValue(false);
        f.reset();
    });

    function generate(e){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要还款的账单!');
            return;
        }
        row=row.data;
        var d={};
        d['cb_number'] = row.cb_number;
        d['org_name'] = row.cb_org_name;
        d['cb_bill_amount'] = row.cb_bill_amount;
        d['cb_oddment'] = row.cb_oddment;
        d['cb_bill_balance'] = (parseFloat(row.cb_bill_amount)-parseFloat(row.cb_repay_amount)-parseFloat(row.cb_oddment)).toFixed(2);
        d['repay_amount'] = row.cb_repay_amount;
        d['cb_repay_amount'] = d['cb_bill_balance'];
        d['cb_bill_date']=row.cb_bill_date;
        Ext.getCmp('pay_balance').checked=true;
        if(d['cb_bill_balance']<0){
            Ext.getCmp('cb_repay_amount').setMinValue(d['cb_bill_balance']);
            Ext.getCmp('cb_repay_amount').setMaxValue(0);
        }else{
            Ext.getCmp('cb_repay_amount').setMinValue(0);
            Ext.getCmp('cb_repay_amount').setMaxValue(d['cb_bill_balance']);
        }
        credit_form.getForm().setValues(d);
        credit_win.show();
    };

    function dispose(){
        var  form = credit_form.getForm();
        if (!form.isValid()){
            Ext.Msg.alert('友情提示', '请正确填写还款信息！');
            return;
        };
        var data=form.getValues();
        if (data.cb_oddment != 0){
            if ((data.cb_bill_balance>0  && (Number(data.cb_oddment)+Number(data.cb_repay_amount))!=data.cb_bill_balance) || (data.cb_bill_balance<0  && (-Number(data.cb_oddment)+Number(data.cb_repay_amount))!=data.cb_bill_balance)){
                return ExtAlert('费用 ＋ 本次还款 ≠ 未还款金额，无法完成销账。');
            }
        };
        if (data.cb_oddment>0){
            if (filterHtml(data.remark) == '') return ExtAlert('您填写了费用金额，请在还款说明里填写费用事由。');
        };
        var alert_info="请确保您线下已收到相应款项，您确定要对此账单进行销账吗？";

        Ext.MessageBox.confirm("友情提示",alert_info, function(y){
            if(y!="yes") return false;
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/CreditBill/repay',
                params:data,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    mask.hide();
                    Ext.Msg.alert("友情提示",result.info);
                    if (result.status){
                        _store.reload();
                        credit_win.hide();
                    }
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            })
        })
    }

    function revokeBill(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要撤销的账单!');
            return;
        }
        if(row.data.cb_status!='未还款'){
            Ext.Msg.alert('友情提示','该账单不是未还款账单，不能撤销!');
            return;
        }
        Ext.MessageBox.confirm("友情提示",'账单撤销后将无法恢复，确认要操作？',function(y){
            if(y!="yes") return false;
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/CreditBill/revoke',
                params:{cb_number:row.data.cb_number},
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    mask.hide();
                    Ext.Msg.alert("友情提示",result.info);
                    if (result.status){
                        _store.reload();
                    }
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            })
        })
    }

    /*打印处理窗口(start)*/
    var cd_win = new Ext.Window({
        title:'账单打印',
        width:760,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="748" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text:'销账',disabled:isDisabled("CreditBill::repay"),handler:generate},
            {text : '打印', handler:doprint, id:'doprint_btn'},
            {text : '移除订单', handler:rm_order, id:'rm_order_btn'},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });

    cd_win.on("show",function(){
        var row=SUNLINE.getSelected(_grid);
        var url = $__app__ + '/CreditBill/BillPrint?_dc=' + time()+'&cb_num='+row.data.cb_number;
        window.ifm_print.location = url;
    });


    function rm_order(b) {
        Ext.Msg.confirm('友情提示', '您真的要移除选定的订单吗？', function (btn) {
            if (btn!='yes') return false;
            window.ifm_print.rm_order();
        });
    }


    function printPlan(b){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            var msg = b.id == 'remove_order' ? '请选择要移除订单的账单！' : '请选择要打印的账单！';
            Ext.Msg.alert('友情提示',msg);
            return false;
        }
        cd_win.show();
        Ext.getCmp('doprint_btn').setHidden(b.id == 'remove_order');
        Ext.getCmp('rm_order_btn').setHidden(b.id != 'remove_order');
        var title = b.id == 'remove_order' ? '移除订单' : '账单打印';
        cd_win.setTitle(title);
    }


    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }
    /*打印处理窗口(end)*/

    /*逻辑方法处理(start)*/
    function getprogress(v,m,r){
        if(v=="") return "";
        if(r.get('cb_repay_time') == 0){
            var flag = 0;
        }else{
            var flag = 1;
        }
        if(parseFloat(r.get('cb_bill_amount')) > 0){
            var money_n = (parseFloat(v)+parseFloat(r.get('cb_oddment')));
        }else{
            var money_n =  (parseFloat(v)-parseFloat(r.get('cb_oddment')))
        }
        var jdtp = parseFloat(r.get('cb_bill_amount')) != 0 ? money_n / parseFloat(r.get('cb_bill_amount')) : flag;
        var jdtp1 = 123 - Math.floor(123 * jdtp);
        var jdtp2 = (100*jdtp).toFixed(2)+"%";
        if(v!=0){var cp="，已还金额：￥"+Number(v).toFixed(2);}else{var cp = '';}
        return '<div class="jdt">' +
            '<img src="/Public/Images/jdt-top.gif" style="background-position:-'+jdtp1+'px center;" title="'+jdtp2+cp+'"></div>';
    };

    function getcycle(v,m,r){
        if(r.get('cb_cycle') == '日结' || r.get('cb_cycle') == '手动'){
            return r.get('cb_cycle');
        }else if(r.get('cb_cycle') == '月结'){
            if(r.get('cb_day')) {
                return r.get('cb_cycle') + ' ' + r.get('cb_day') + '号';
            }else{
                return r.get('cb_cycle')
            }
        }else if(r.get('cb_cycle') == '周结'){
            if(r.get('cb_day')) {
                return r.get('cb_cycle') + ' ' + r.get('cb_day') ;
            }else{
                return r.get('cb_cycle')
            }
        }
    }

    function clear_search(){
        Ext.getCmp("company_box").setValue('');
        Ext.getCmp("company_box_s").setValue(''); //收款单位
        finishComob.setValue('全部(不含已撤销)');
        Ext.getCmp("ap_start_date").setValue('');
        Ext.getCmp("ap_end_date").setValue('');
        Ext.getCmp('skey').setValue('');//获取search里面的值
        creditKindComob.setValue('全部');
        cycleComob.setValue('全部');
    }
    function quick_search(e){
        var where={};
        var org_id=Ext.getCmp("company_box").getValue();
        var supply_org_id = Ext.getCmp("company_box_s").getValue(); //收款单位
        var status=finishComob.getValue();
        var start_date=Ext.getCmp("ap_start_date").getValue();
        var end_date=Ext.getCmp("ap_end_date").getValue();
        var skey = Ext.getCmp('skey').getValue();//获取search里面的值
        var creditkind = creditKindComob.getValue();
        var cycle = cycleComob.getValue();
        if(org_id) where["org_id"]=org_id;
        if(supply_org_id) where['supply_org_id'] = supply_org_id;
        if(status) where["status"]=status;
        if(start_date) where["start_date"]=start_date;
        if(end_date) where["end_date"]=end_date;
        if(skey) where['skey'] = skey;
        if(creditkind) where['creditkind'] = creditkind;
        if(cycle) where['cycle'] = cycle;
        SUNLINE.baseParams(_store,where);
        _store.load();
    }


    function money(v, m, r){
        var m = real_money(v, m, r);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }

    function nopay_money(v, m, r){
        var money_none = parseFloat(r.get('cb_bill_amount'))- parseFloat(r.get('cb_repay_amount'));
        if(money_none>0){
            var money=parseFloat(r.get('cb_bill_amount'))- parseFloat(r.get('cb_repay_amount')) - parseFloat(r.get('cb_oddment'));
        }else if(money_none<=0){
            var money=parseFloat(r.get('cb_bill_amount'))- parseFloat(r.get('cb_repay_amount')) + parseFloat(r.get('cb_oddment'));
        }
        var m = real_money(money);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }

    function real_money(v, m, r){
        if (v==null || v=='') v=0;
        if (isNaN(v)) v=0;
        return '￥'+Number(v).toFixed(2);
    }

    function repay_time(v ,m, r){
        if(v==0){
            if(r.get('cb_status') == '已撤销'){
                return '已撤销'
            }else{
                return '未还款';
            }
        }else{
            return getLocalTime(v);
        }
    }

    function getLocalTime(tm) {
        var t = Ext.Date.format(new Date(parseInt(tm) * 1000),'Y-m-d H:i:s');
        return t;
    }

    function formatDate(dt){
        if(dt != "" && dt != undefined){
            var d = dt.substr(0,4);
            d     = d + "-" + dt.substr(4,2);
            d     = d + "-" + dt.substr(6,2);
            return d;
        }else{
            return (new Date()).format('Y-m-d');
        }
    }
    function formatNum(v){
        return '<div style="color:#009b26">'+v+'</div>';
    }

    /**
     * 导出应收信用账单明细操作
     */
    function do_export() {
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示',"请选择要导出的信用账单！");
            return false;
        }
        var url = 'cb_id='+row.data.cb_id;
        window.location = $__app__+'/CreditBill/export_details?'+url;
    }

    ziyo_log({ listeners : [{grid: _grid, action:'CreditBill',pk_id:'cb_id'}] });

});