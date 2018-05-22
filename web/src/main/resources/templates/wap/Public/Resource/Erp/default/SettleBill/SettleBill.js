Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.QuickTips.init();
    var thisTitle = '账单详情';
    var dis_url = $__app__+'/SettleBill/settle_bill_json';
    var dis_fields = [];
    var _store = SUNLINE.JsonStore(dis_url,dis_fields,false);
    var pay_type_txt='付';
    if(type_id=='购物店')pay_type_txt='收';
    function num_format(v){
        v=parseFloat(v)?parseFloat(v):0;
        return v.toFixed(0);
    }
    function not_money(v,m,r){
        var amount= parseFloat(r.get('sb_amount'))?r.get('sb_amount'):0;
        var repay_amount= parseFloat(r.get('sb_repay_amount'))?r.get('sb_repay_amount'):0;
        return '<b style="color: green;">'+money(amount-repay_amount)+'</b>';
    }
    function date_format(v,format){
        return Ext.Date.format(v,format);
    }
    function getprogress(v,m,r){
        var ment_amount=parseFloat(r.get('sb_ment_amount'))?parseFloat(r.get('sb_ment_amount')):0
        if(v=="") return "";
        var yfje=(parseFloat(v)+ment_amount);
        var jdtp = yfje/ parseFloat(r.get('sb_amount'));
        var jdtp1 = 123 - Math.floor(123 * jdtp);
        var jdtp2 = (100*jdtp).toFixed(2)+"%";
        if(v!=0){var cp="，已"+pay_type_txt+"金额：￥"+Number(yfje).toFixed(2);}else{var cp = '';}
        return '<div class="jdt">' +
            '<img src="/'+$public_path+'Images/jdt-top.gif" style="background-position:-'+jdtp1+'px center;" title="'+jdtp2+cp+'"></div>';
    };

    var _cm = [
        new Ext.grid.RowNumberer(),
        {header:"ID",dataIndex:"sb_id",width:40,hidden:true},
        {header:"凭证编号",dataIndex:"sb_number",width:150},
        {header:"结算单位",dataIndex:"sb_org_name",width:200},
        {header:"单位类型",dataIndex:"sb_org_type",width:80},
        {header:"单位ID",dataIndex:"sb_org_id",width:200,hidden:true},
        {header:"数量",dataIndex:"sb_num",width:100,align:"center",renderer:num_format},
        {header:"未"+pay_type_txt+"款金额",dataIndex:"sb_amount",width:100,renderer:not_money,align:"right"},
        {header:"已"+pay_type_txt+"款金额",dataIndex:"sb_repay_amount",width:100,renderer:money,align:"right"},
        {header:"其他费用",dataIndex:"sb_ment_amount",width:90,renderer:money,align:"right"},
        {header:"应"+pay_type_txt+"总额",dataIndex:"sb_amount",width:100,renderer:money,align:"right"},
        {header:pay_type_txt+"款时间",dataIndex:"sb_time",width:140},
        {header:pay_type_txt+"款进度",dataIndex:"sb_repay_amount",width:150,renderer:getprogress}
    ];
    var company_box=SUNLINE.CompanyBox({
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'',
            id:'company_box',
            labelWidth:60,
            hiddenName:'org_id',
            width:160,
            listConfig:{
                width:400,
                minWidth:300,
                maxWidth:500
            },
            labelAlign:'right',
            value:_uinfo.org_name
        }
    });

    var finishComob=new Ext.form.ComboBox({
        fieldLabel:"",
        allowBlank:false,
        width:120,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['name','value'],
            data:[['全部','全部'],['未'+pay_type_txt+'款','未'+pay_type_txt+'款'],['未'+pay_type_txt+'完','未'+pay_type_txt+'完'],['已'+pay_type_txt+'完','已'+pay_type_txt+'完'],['已撤销','已撤销']]
        }),
        displayField:"name",
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
        tbar:[
            {text:'销账',id:"deal_plan",disabled:isDisabled("SettleBill::"+role_type+"_deal_pay"),iconCls: 'button-write',handler:generate},
            {text:'打印账单',iconCls: 'button-print',disabled:isDisabled("SettleBill::"+role_type+"_deal_print"),handler:printPlan},
            {text:'撤销账单',id:'revoke_bill',iconCls: 'button-add',disabled:isDisabled("SettleBill::"+role_type+"_deal_del"),handler:revokeBill},
            '生成日期：',
            new SUNLINE.ExtDateField({id:'ap_start_date',name:'ap_start_date',labelWidth:0,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:100,gang:'ap_end_date',start:true}),' 至 ',
            new SUNLINE.ExtDateField({id:'ap_end_date',name:'ap_end_date',labelWidth:1,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:100,gang:'ap_start_date'}),
            {xtype:"hidden",id:"type_id",value:type_id},
            '账单状态：',finishComob,
            {text:'查询',iconCls: 'searchico',handler:quick_search,style:'margin-left:5px'},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'skey',
                iconCls:'button-sch',
                emptyText : '凭证号,单位等',
                width:220,
                onTriggerClick:function(e){
                    KeySearch()
                },
                listeners : {
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            KeySearch()
                    }
                }
            }],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    _grid.getSelectionModel().on('select', function(sm,record){
        if(record.data.cb_status=="未"+pay_type_txt+"款"){
            Ext.getCmp("revoke_bill").setDisabled(false);
            Ext.getCmp("deal_plan").setDisabled(false);
            Ext.getCmp("merge_bill").setDisabled(false);
        }else if(record.data.cb_status=="未"+pay_type_txt+"完"){
            Ext.getCmp("revoke_bill").setDisabled(true);
            Ext.getCmp("deal_plan").setDisabled(false);
            Ext.getCmp("merge_bill").setDisabled(false);
        }else if(record.data.cb_status=="已"+pay_type_txt+"完"){
            Ext.getCmp("revoke_bill").setDisabled(false);
            Ext.getCmp("deal_plan").setDisabled(true);
            Ext.getCmp("merge_bill").setDisabled(true);
        }
    });


    var credit_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:#ff; padding:10px;',
        defaultType : 'textfield',
        defaults:{labelWidth:90, anchor:'95%',labelAlign:'right' },
        items:[
            {id:"sl_org_name", name:"sl_org_name", fieldLabel:"单位名称",readOnly:true},
            {id:"sl_number", name:"sl_number", fieldLabel:"凭证编号", readOnly:true},
            {id:"sb_amount", name:"sb_amount", fieldLabel:"账单金额", readOnly:true,renderer:money},
            {id:"sb_balance", name:"sb_balance", fieldLabel:"未"+pay_type_txt+"款金额",readOnly:true},
            {id:"sb_repay_amount", name:"sb_repay_amount", fieldLabel:"未"+pay_type_txt+"款金额",xtype:'hidden'},
            {id:"sb_ment_amount", name:"sb_ment_amount", fieldLabel:"费用",xtype:'numberfield',value:0,allowBlank:false,minValue:0},
            {id:"sl_amount", name:"sl_amount", fieldLabel:"<span style='color: blue;'>本次"+pay_type_txt+"款</span>", style:'color:blue;', xtype:'numberfield'},
            {id:"sl_remark", name:"sl_remark", fieldLabel:pay_type_txt+"款说明", maxLength:500, xtype:'textarea',width:260,height:100}
        ]
    });

    Ext.getCmp('sb_ment_amount').on('blur',function(){
        var bill_amount = parseFloat(Ext.getCmp('sb_amount').getValue()); //账单金额
        var repay_amount = parseFloat(Ext.getCmp('sb_repay_amount').getValue()); //这是什么金额？
        var oddment = parseFloat(Ext.getCmp('sb_ment_amount').getValue()); //费用金额
        var repay_balance = bill_amount - repay_amount - oddment;
        if(repay_balance<0){
            Ext.getCmp('sl_amount').setMinValue(repay_balance);
            Ext.getCmp('sl_amount').setMaxValue(0);
        }else{
            Ext.getCmp('sl_amount').setMinValue(0);
            Ext.getCmp('sl_amount').setMaxValue(repay_balance);
        }
        Ext.getCmp('sl_amount').setValue(repay_balance);
    });

    //结款窗口
    var credit_win = new Ext.Window({
        title: '手动'+pay_type_txt+'款',
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
            {text:'Values',handler:function(){ showFormValues(credit_form)} },
            {text:'确认'+pay_type_txt+'款',handler:dispose },
            {text:'关闭',handler:function(){credit_win.hide();}
        }]
    });

    credit_win.on("hide",function(){
        var f=credit_form.getForm();
        f.reset();
    });

    function generate(e){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要'+pay_type_txt+'款的账单!');
            return;
        }
        row=row.data;
        var d={};
        d['sl_number'] = row.sb_number;
        d['sl_org_name'] = row.sb_org_name;
        d['sb_amount'] = row.sb_amount;
        d['sb_repay_amount'] = row.sb_repay_amount;
        d['sb_ment_amount'] = row.sb_ment_amount;
        d['sb_balance'] = parseFloat(row.sb_amount)-parseFloat(row.sb_repay_amount)-parseFloat(row.sb_ment_amount);
        if(d['sb_balance']<=0){
            Ext.Msg.alert('友情提示','已经'+pay_type_txt+'完的账单不可再进行销账!');
            return;
        }
        credit_form.getForm().setValues(d);
        credit_win.show();
        if(d['sb_balance']<0){
            Ext.getCmp('sl_amount').setMinValue(d['sb_balance']);
            Ext.getCmp('sl_amount').setMaxValue(0);
        }else{
            Ext.getCmp('sl_amount').setMinValue(0);
            Ext.getCmp('sl_amount').setMaxValue(d['sb_balance']);
        }
    };

    function dispose(){
        var  form = credit_form.getForm();
        if (!form.isValid()){
            Ext.Msg.alert('友情提示', '请正确填写'+pay_type_txt+'款信息！');
            return;
        };
        var data=form.getValues();
        if (data.sb_ment_amount>0){
            if (filterHtml(data.sl_remark) == '') return ExtAlert('您填写了费用金额，请在'+pay_type_txt+'款说明里填写费用事由。');
        };
        Ext.MessageBox.confirm("友情提示",'确认处理后账单将无法撤销，确认要处理此账单？', function(y){
            if(y!="yes") return false;
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/SettleBill/settle_list_save',
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
        if(row.data.sb_time){
            Ext.Msg.alert('友情提示','该账单已经'+pay_type_txt+'过款，不能撤销!');
            return;
        }
        Ext.MessageBox.confirm("友情提示",'账单撤销后将无法恢复，确认要操作？',function(y){
            if(y!="yes") return false;
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/SettleBill/settle_bill_save',
                params:{sb_number:row.data.sb_number,action:'del'},
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
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });

    cd_win.on("show",function(){
        var row=SUNLINE.getSelected(_grid);
        var url = $__app__ + '/SettleBill/settle_print?_dc=' + time()+'&number='+row.data.sb_number;
        window.ifm_print.location = url;
    });

    function printPlan(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要打印的账单！');
            return false;
        }
        cd_win.show();
    }

    function createBill(){
        order_list_store.removeAll();
        create_bill_win.show();
        return ;
    }
    function mergeBill(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要合并的目标账单！');
            return false;
        }
         if(row.data.cb_status != '未'+pay_type_txt+'款' && row.data.cb_status != '未'+pay_type_txt+'完'){
             Ext.Msg.alert('友情提示','仅支持未'+pay_type_txt+'款或未还完的账单！');
             return false;
         }
        Ext.getCmp('merge_bill_no').setValue(row.data.cb_number);
        merge_win.show();
    }
    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }
    /*打印处理窗口(end)*/

    /*逻辑方法处理(start)*/



    function money_format(v,m,r,ri){
        v="￥"+(v);
        if (ri==0 || ri==1) v = '<b>'+v+'</b>';
        return v;
    }

    function balance_format(v,m,r){
        return "￥"+(0-v);
    }

    function body_info(v,m,r){
        return '<span qtip="'+v+'">'+v+'</span>';
    }

    function repay_date(v){
        if(v=="not") return "";
        if(!v) return "未"+pay_type_txt+"款";
        return v;
    }

    function post_where(){
        var where={};
        var org_id=Ext.getCmp("company_box").getValue();
        var type_id=Ext.getCmp('type_id').getValue();
        var status=finishComob.getValue();
        var start_date=date_format(Ext.getCmp("ap_start_date").getValue(),'Ymd');
        var end_date=date_format(Ext.getCmp("ap_end_date").getValue(),'Ymd');
        if(type_id) where["type_id"]=type_id;
        if(org_id) where["org_id"]=org_id;
        if(status) where["status"]=status;
        if(start_date) where["start_date"]=start_date;
        if(end_date) where["end_date"]=end_date;
        return where;
    }

    quick_search();
    function quick_search(e){
        var where=post_where();
        SUNLINE.baseParams(_store,where);
        _store.load();
    }

    function KeySearch(){
        var where=post_where();
        where.skey = Ext.getCmp('skey').getValue();//获取search里面的值
        SUNLINE.baseParams(_store,where);
        _store.currentPage=1;
        _store.load();
    }


    var order_list_url   = $__app__ + '/CreditBill/get_order_list';
    var order_list_store = SUNLINE.JsonStore(order_list_url, [], false);
    var order_list_grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        height:230,
        selModel:{
            selType: 'checkboxmodel'
        },
        columns:[
            new Ext.grid.RowNumberer({width:45}),
            {header:"订单编号", dataIndex:"o_number", width:140,renderer:formatNum},
            {header:"产品名称", dataIndex:"o_product_name", width:220},
            {header:"订单总金额", dataIndex:"o_settle_real", width:100,renderer:money},
            {header:"交易总金额", dataIndex:"o_bill_amount", width:100,renderer:money},
            {header:"已还金额", dataIndex:"o_reapy_amount", width:100,renderer:money},
            {header:"未还金额", dataIndex:"o_nopay_amount", width:100,renderer:money},
            {header:"出团时间", dataIndex:"o_start_date", width:100,renderer:formatDate},
            {header:"交易时间", dataIndex:"o_sell_time", width:120,renderer:getLocalTime},
            {header:"人数", dataIndex:"o_num", width:35}
        ],
        sortable: true,
        store: order_list_store//数据源
    });

    var time_type_combo = new Ext.form.ComboBox({
        fieldLabel:"时间类型",
        width:170,
        labelWidth:60,
        id:"time_type",
        name:"time_type",
        allowBlank:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['交易时间'],['出团时间'],['账单日']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        editable:false,
        typeAhead:true,
        value:"交易时间"
    });

    var bill_company_box=SUNLINE.CompanyBox({
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'',
            id:'bill_company_box',
            hiddenName:'org_id',
            width:220,
            listConfig:{
                width:400,
                minWidth:300,
                maxWidth:500
            },
            labelAlign:'right',
            value:_uinfo.org_name
        }
    });

    var create_bill_win=new Ext.Window({
        title : '手动生成账单',
        width : 840,
        height: 400,
        closeAction : 'hide',
        resizable:false,
        layout : 'border',
        modal:true,
        tbar:[
            time_type_combo,
            new SUNLINE.ExtDateField({id:'bill_date',name:'bill_date',labelWidth:60,labelAlign:"right",fieldLabel:'选择时间',labelSeparator:'',width:180,value:new Date()}),
            bill_company_box,
            {text:'查询',handler:search_order}
        ],
        items:[order_list_grid],
        buttons: [
            {text : '生成账单', id:"dosave",handler:create_bill_save},
            {text : '关闭', handler:function(){create_bill_win.hide();}}
        ]
    });

    function search_order(){
        var bill_date_type=time_type_combo.getValue();
        var bill_date=Ext.getCmp('bill_date').getValue();
        var bill_org=bill_company_box.getValue();
        SUNLINE.baseParams(order_list_store,{bill_orgid:bill_org,bill_date:bill_date,bill_date_type:bill_date_type});
        order_list_store.currentPage=1;
        order_list_store.load();
    }

    function create_bill_save(){
        var rows=order_list_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何记录');
            return;
        }
        var temp_id='';
        for(var i=0;i<rows.length;i++){
            temp_id+=rows[i]['data']['o_id']+',';
        }
        temp_id=temp_id.substr(0,temp_id.length-1);
        Ext.MessageBox.confirm("友情提示",'确认要将选中的订单生成账单？',function(y){
            if(y!="yes") return false;
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/CreditBill/create_bill_by_id',
                params:{o_id:temp_id},
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    mask.hide();
                    Ext.Msg.alert("友情提示",result.info);
                    if (result.status){
                        _store.reload();
                        order_list_store.reload();
                    }
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            })
        })
    }



    var merge_bill_store_url = $__app__+'/CreditBill/get_bill_no';
    var merge_bill_store = SUNLINE.JsonStore(merge_bill_store_url,[],false);
    var merge_form  = new Ext.form.FormPanel({
        border:false,
        bodyStyle:"background:none;padding-top:20",
        autoHeight:true,
        defaults : {
            xtype : "textfield",
            layout:'form',
            border:false,
            bodyStyle:"background:none;",
            labelWidth : 80,
            width:300,
            labelAlign : "right"
        },
        items:[
            {id:"merge_bill_no",name:"merge_bill_no",fieldLabel:"目标账单",readOnly:true,allowBlank:false},
            {id:"merge_order_no",name:"merge_order_no",fieldLabel:"订单号",allowBlank:false,listeners:{
                blur:function(v){
                    SUNLINE.baseParams(merge_bill_store,{cb_number:Ext.getCmp('merge_bill_no').getValue(),o_number: v.value});
                    merge_bill_store.load();
                }
            }},
            {id:'merge_bill_combo',name:'merge_bill_source',fieldLabel: '来源账单',xtype:'combo',triggerAction:'all',store:merge_bill_store,displayField: 'cb_number',valueField: 'cb_number',emptyText:' 请选择来源账单',allowBlank: false}
        ]
    });
    var merge_win=new Ext.Window({
        title : '合成账单',
        layout:'fit',
        width : 350,
        height: 200,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[merge_form],
        buttons: [
            {text : '合成',handler:merge},
            {text : '关闭', handler:function(){merge_win.hide();}}
        ]
    });
    merge_win.on("hide",function(){
        merge_form.getForm().reset();
    });
    Ext.getCmp('merge_order_no').on()

    function merge(){
        if (!merge_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '信息填写有误，请检查！');
            return;
        }
        var form = merge_form.getForm().getValues();
        var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
        mask.show();
        Ext.Ajax.request({
            url: $__app__ + '/CreditBill/merge',
            method : 'POST',
            params : form,
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    merge_win.hide();
                    _store.reload();
                }
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '操作失败');
            }
        });
    }



    function money(v, m, r){
        var m = real_money(v, m, r);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }

    function nopay_money(v, m, r){
        var money=parseFloat(r.get('cb_bill_amount'))- parseFloat(r.get('cb_repay_amount'));
        var m = real_money(money);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }

    function real_money(v, m, r){
        if (v==null || v=='') v=0;
        if (isNaN(v)) v=0;
        return '￥'+Number(v).toFixed(2);
    }

    function repay_time(v){
        if(v==0){
            return '未'+pay_type_txt+'款';
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


    //单团毛利
    var print_height=Ext.getBody().getHeight()-50;
    var print_win = new Ext.Window({
        title:'单团毛利',
        width:800,
        height:print_height,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        id:"print_id",
        resizable:false,
        maximizable : true,//全屏效果
        modal:true,
        html:'<iframe id="ml_print" name="ml_print" src="" width="100%" style=" height: '+print_height+';" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:fl_doprint},
            {text : '关闭', handler:function(){print_win.hide();}}
        ]
    });

    //单团毛利打印
    function fl_doprint(){
        window.ml_print.focus();
        window.ml_print.print();
    }


    window.submit_account=function(id,number){
        var url='',title='',b='';
        if(number=='出发地接送'){
            url = $__app__ + '/TeamPlanItems/bus_trans_print?_dc=' + time()+'&tp_id='+id;
            title= "交通明细表";
        }else{
            url = $__app__ + '/TeamPlanItems/team_print?_dc=' + time()+'&team_id='+id;
            title="单团毛利 团队编号:"+number;
        }
        if(!url)return false;
        print_win.show();
        Ext.getCmp("print_id").setTitle(title);
        window.ml_print.location = url;
    }

});