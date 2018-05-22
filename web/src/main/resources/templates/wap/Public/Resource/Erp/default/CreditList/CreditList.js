Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.QuickTips.init();
    var thisTitle = '欠款信息汇总';
    var dis_url = $__app__+'/CreditList/dataJson';
    var dis_fields = ["crl_amount","crl_sorg_id","crl_sorg_name","crl_worg_id","crl_worg_name", "nopay"];
    var _store = SUNLINE.JsonStore(dis_url,dis_fields);
    var worg_hidden = _uinfo['org_type']=='管理公司' ? false : true;

    //分销商
    var conf_b = {
        displayField:'text',
        valueField:'id',
        id:'company_box_b',
        labelWidth:60,
        fieldLabel:false,
        hiddenName:'org_id',
        width:200,
        pageSize:20,
        value:'',
        listConfig:{
            width:400,
            minWidth:300,
            maxWidth:500
        },
        labelAlign:'right'
    };
    var company_config_b=Ext.apply(conf_b,{});
    var company_box_b= SUNLINE.CompanyBox({
        where:{  source:'order' },
        config:company_config_b
    });
    //管理公司单位的combobox
    var conf_s = {
        displayField:'text',
        valueField:'id',
        fieldLabel:'供应商',
        id:'company_box_s',
        labelWidth:60,
        hiddenName:'org_id',
        hidden:worg_hidden,
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
        _search();
    });

    var _cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header:"SID",dataIndex:"crl_sorg_id",hidden:true},
        {header:"WID",dataIndex:"crl_worg_id",hidden:true},
        {header:"供应商",dataIndex:"crl_worg_name",width:220,hidden:worg_hidden},
        {header:"分销商",dataIndex:"crl_sorg_name",width:320},
        {header:"欠款总额 <i class='fa fa-question-circle'></i>",dataIndex:"crl_amount",renderer:money,
            width:150,tooltip:'欠款总额 = 未生成账单 + 已生成账单但未还款金额'},
        {header:"未生成账单",dataIndex:"unbill",renderer:money,width:150},
        {header:"已生成账单但未还款 <i class='fa fa-question-circle'></i>",dataIndex:"billed",renderer:money,width:150,tooltip:'已生成账单但未还款的账单金额'},
        {header:"结算周期",dataIndex:"cl_cycle",width:150},
        {header:"出团日(最小-最大)",dataIndex:"min_max_start",width:150},
        {header:"交易日(最小-最大)",dataIndex:"min_max_create",width:150},
        {header:"账单日(最小-最大)",dataIndex:"min_max_bill",width:150}
    ];

    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        emptyText:'暂时没有数据',
        store: _store,//数据源
        columns: _cm,//表格列定义
        viewConfig: {emptyText: '暂时没有数据',deferEmptyText:true,enableTextSelection: true},
        tbar:[
            {
                xtype:'buttongroup',
                title:'生成信用账单',
                height:80,
                columns: 1,
                defaults: {scale: 'small'},
                items:[
                    {text:'生成信用账单',rowspan: 2,height:48,disabled:isDisabled("CreditBill::create_bill_by_id"),iconCls: 'button-write',style:'margin-top:3px;margin-right:2px;',iconAlign: 'top',handler:createBill}
                ]
            },
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:5,
                items:[
                    {xtype:'tbtext',text: '分&nbsp;销&nbsp;商：' ,height:29,style:'line-height:26px'},
                    company_box_b,
                    {xtype:'tbtext',text:'&nbsp;时间类型：',height:29,style:'line-height:26px'},
                    new Ext.form.ComboBox({
                        fieldLabel:false,
                        width:150,
                        id:"s_date_type",
                        name:"s_date_type",
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
                    }),
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',height:55,handler:_search,style:'margin:2px 5px 2px 10px;'},
                    {xtype:'tbtext',text: '结算周期：' ,height:29,style:'line-height:26px'},
                    new Ext.form.ComboBox({
                        fieldLabel:false,
                        width:200,
                        id:"cl_cycle_type",
                        name:"cl_cycle_type",
                        allowBlank:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['value'],
                            data:[['全部'],['手动'],['日结'],['周结'],['月结']]
                        }),
                        displayField:"value",
                        valueField:"value",
                        mode:"local",
                        forceSelection:true,
                        editable:false,
                        typeAhead:true,
                        value:"全部"
                    }),
                    {xtype:'tbtext',text:'<span data-qtip="包含选择的日期">&nbsp;截止日期</span>：',height:29,style:'line-height:26px'},
                    new SUNLINE.ExtDateField({id:'s_bill_date',name:'s_bill_date',labelWidth:60,labelAlign:"right",
                        fieldLabel:false,
                        labelSeparator:'',width:150,value:new Date()})
                ]
            },
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'u_Search',
                cls:'search-icon-cls',
                emptyText : '分销商名称/法人姓名/手机号',
                width:260,
                onTriggerClick:function(e){
                    _search();
                },
                listeners : {
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            _search();
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据',
            items:[company_box_s]
        })
    });

    function _search(){
        var skey = Ext.getCmp('u_Search').getValue();
        var date_type = Ext.getCmp('s_date_type').getValue();
        var bill_date = Ext.getCmp('s_bill_date').getValue();
        var cycle_type = Ext.getCmp('cl_cycle_type').getValue();
        var crl_sorg_id = Ext.getCmp('company_box_b').getValue();
        var crl_worg_id = Ext.getCmp('company_box_s').getValue();
        SUNLINE.baseParams(_store,{skey:skey,date_type:date_type,cycle_type:cycle_type,bill_date:bill_date,crl_worg_id:crl_worg_id,crl_sorg_id:crl_sorg_id});
        _store.load();
    }

    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    var order_list_url   = $__app__ + '/CreditList/get_order_list';
    var order_list_fld = ["crl_oid", "crl_start_date", "crl_bill_day", "crl_amount", "crl_onum", "crl_subject", "crl_trade_no", "crl_create_time"];
    var order_list_store = SUNLINE.JsonStore(order_list_url, order_list_fld, false);
    order_list_store.on('load', function(){
        Ext.getCmp('order_total').setText('共找到<span style="color: blueviolet">'+ order_list_store.getCount() +'</span>个订单');
    });

    var order_list_grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        selModel:{ selType: 'checkboxmodel' },
        emptyText:'没有数据',
        columns:[
            new Ext.grid.RowNumberer({width:45}),
            {header:"ID", dataIndex:"crl_oid", width:80,hidden:true},
            {header:"出团时间", dataIndex:"crl_start_date", width:90,renderer:formatDate},
            {header:"账单日期", dataIndex:"crl_bill_day", width:90,renderer:number2date},
            {header:"结算金额", dataIndex:"crl_amount", width:100,renderer:money},
            {header:"人数", dataIndex:"crl_onum", width:60},
            {header:"产品名称", dataIndex:"crl_subject", width:180},
            {header:"订单编号", dataIndex:"crl_trade_no", width:150,renderer:formatNum},
            {header:"交易时间", dataIndex:"crl_create_time", width:150,renderer:getLocalTime}
        ],
        sortable: true,
        store: order_list_store//数据源
    });
    order_list_grid.on('selectionchange', function(t, s, o){
        var tm = 0;
        Ext.each(s, function(item){
            tm = Number(tm) + (item.data['crl_amount']);
        });
        Ext.getCmp('order_selected').setText('您已经选中<span style="color: blue;">'+ s.length +
            '</span>个订单，未付款金额共计<span style="color: blue;" data-qtip="'+ RMB(tm) +'">'+ fmoney(tm) +'</span>元');
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


    var create_bill_win = new Ext.Window({
        title : '手动生成账单',
        width : 840,
        height: 400,
        closeAction : 'hide',
        resizable:false,
        layout : 'border',
        maximizable : true,
        modal:true,
        tbar:[
            time_type_combo,
            new SUNLINE.ExtDateField({id:'bill_date',name:'bill_date',labelWidth:60,labelAlign:"right",
                fieldLabel:'<span data-qtip="包含选择的日期">截止日期</span>',
                labelSeparator:'',width:180,value:new Date()}),
            {text:'查询',handler:search_order},'->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'o_search',
                cls:'search-icon-cls',
                emptyText : '完整订单号、游客信息',
                width:200,
                onTriggerClick:function(e){
                    order_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            order_search();
                    }
                }
            }
        ],
        items:[order_list_grid],
        buttons: [
            {xtype:'tbtext', text:'', id:'order_total'},'-',{xtype:'tbtext', text:'', id:'order_selected'},'->',
            {text : '合并账单', id:"merge",handler:mergeBill,disabled:isDisabled("CreditBill::merge")},
            {text : '生成账单', id:"dosave",handler:create_bill_save},
            {text : '关闭', handler:function(){create_bill_win.hide();}}
        ]
    });

    function order_search(){
        var key=Ext.getCmp('o_search').getValue();
        SUNLINE.baseParams(order_list_store,{skeys:key},true);
        order_list_store.load();
    }

    function search_order(){
        var date_type=time_type_combo.getValue();
        var bill_date=Ext.getCmp('bill_date').getValue();
        var row = SUNLINE.getSelected(_grid);
        var worg=row.get('crl_worg_id');
        var sorg=row.get('crl_sorg_id');
        SUNLINE.baseParams(order_list_store,{worg_id:worg,sorg_id:sorg,bill_date:bill_date,date_type:date_type});
        order_list_store.currentPage=1;
        order_list_store.load();
    };

    function create_bill_save(){
        var rows=order_list_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何订单记录');
            return;
        };
        Ext.MessageBox.confirm("友情提示",'确认要将选中的订单生成账单？',function(y){
            if(y!="yes") return false;
            var mask=new Ext.LoadMask({target:create_bill_win,msg:'数据提交中，请稍候...'});
            mask.show();

            var _temp_id=[];
            for (var i=0;i<rows.length;i++){
                _temp_id.push(rows[i]['data']['crl_oid']);
            };
            _temp_id=_temp_id.join(',');
            //console.log(temp_id);return;

            Ext.Ajax.request({
                url:$__app__ + '/CreditBill/create_bill_by_id',
                params:{o_id:_temp_id},
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    mask.hide();
                    Ext.Msg.alert("友情提示",result.info);
                    if (result.status){
                        _store.reload();
                        create_bill_win.hide();
                    }
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            })
        })
    };

    function createBill(){
        var row = SUNLINE.getSelected(_grid);
        if ( !row ) return ExtAlert('请选择您要生成账单的单位。');
        var title = row.get('crl_sorg_name');
        order_list_store.removeAll();
        Ext.getCmp('time_type').setValue(Ext.getCmp('s_date_type').getValue());
        Ext.getCmp('bill_date').setValue(Ext.getCmp('s_bill_date').getValue());
        create_bill_win.setTitle('手动生成账单：【' + title+'】');
        create_bill_win.show();
        return ;
    };




    function getLocalTime(tm) {
        if (tm==0 || tm=='' || !tm) return '';
        var t = Ext.Date.format(new Date(parseInt(tm) * 1000),'Y-m-d H:i:s');
        return t;
    };

    function formatDate(dt){
        if(dt != "" && dt != undefined){
            var d = dt.substr(0,4);
            d     = d + "-" + dt.substr(4,2);
            d     = d + "-" + dt.substr(6,2);
            return d;
        }else{
            return '';
        }
    };

    function formatNum(v, m, r){
        var color = 'blue';
        return '<div data-qtip="'+ v +'"><a href="'+ $__app__ + '/OrderDetail/index/id/'+ v + '/source/frame/order_type/seller'
            +'" style="color:'+ color +'" target="_blank">'+ v +'</a></div>';
    };

    //合并账单操作
    function mergeBill(){
        var rows=order_list_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何订单记录');
            return;
        };
        var orgRow = SUNLINE.getSelected(_grid);
        var org_id = orgRow.data.crl_sorg_id;
        var _temp_id=[];
        for (var i=0;i<rows.length;i++){
            _temp_id.push(rows[i]['data']['crl_oid']);
        };
        _temp_id=_temp_id.join(',');
        SUNLINE.baseParams(merge_store,{org_id:org_id});
        merge_store.load();
        merge_win.show();
        Ext.getCmp('merge_oid').setValue(_temp_id);
    };


    var merge_url   = $__app__ + '/CreditList/merge_bill';
    var merge_fld = ["cb_id", "cb_number", "cb_bill_date", "cb_bill_amount", "cb_status"];
    var merge_store = SUNLINE.JsonStore(merge_url, merge_fld, false);
    var merge_grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        columns:[
            new Ext.grid.RowNumberer({width:45}),
            {header:"ID", dataIndex:"cb_id", width:80,hidden:true},
            {header:"账单编号", dataIndex:"cb_number", width:140},
            {header:"账单日期", dataIndex:"cb_bill_date", width:90,renderer:number2date},
            {header:"账单金额", dataIndex:"cb_bill_amount", width:100,renderer:money},
            {header:"账单状态", dataIndex:"cb_status", width:100}
        ],
        sortable: true,
        store: merge_store//数据源
    });

    var start_time=SUNLINE.ExtDateField({
        id:'start_date_id',
        width:100,
        labelWidth:0,
        name:'start_date_id',
        fieldLabel:":",
        format: 'Y-m-d',
        value:'',gang:'end_date_id',start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date_id',
        width:100,
        labelWidth:0,
        name:'end_date_id',
        fieldLabel:":",
        format: 'Y-m-d',
        value:'',gang:'start_date_id'
    });

    var merge_win = new Ext.Window({
        title : '手动合并账单',
        width : 800,
        height: 400,
        closeAction : 'hide',
        resizable:false,
        layout : 'border',
        maximizable : true,
        modal:true,
        tbar:[
            {xtype:'hidden',emptyText:'订单ID',id:'merge_oid'},
            '账单日期','-',start_time,' 至 ',end_time,
            {text:'查询', iconCls:'button-sch',handler:merge_search},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'merge_search_id',
                cls:'search-icon-cls',
                emptyText : '账单编号',
                width:200,
                onTriggerClick:function(e){
                    merge_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            merge_search();
                    }
                }
            }
        ],
        items:[merge_grid],
        buttons: [
            {text : '确认合并',handler:merge_bill_save},
            {text : '关闭', handler:function(){merge_win.hide();}}
        ]
    });
    function merge_search(){
        var post_val={};
        var skeys=Ext.getCmp('merge_search_id').getValue();
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        var end_date=Ext.Date.format(end_time.getValue(),'Ymd');
        if(skeys)post_val.skeys=skeys;
        if(start_date){
            post_val.start_date=start_date;
            post_val.end_date=end_date;
        }
        SUNLINE.baseParams(merge_store,post_val,true);
        merge_store.reload();
    }
    function merge_bill_save(){
        var row = SUNLINE.getSelected(merge_grid);
        if ( !row ) return ExtAlert('请选择您需要合并的账单。');
        Ext.MessageBox.confirm("友情提示",'确认要将选中的订单合并到此账单中吗？',function(y){
            if(y!="yes") return false;
            var myMask=new Ext.LoadMask({target:merge_win,msg:'数据提交中，请稍候...'});
            myMask.show();
            var oid=Ext.getCmp('merge_oid').getValue();
            var post_val={o_id:oid,cb_id:row.get('cb_id')};
            Ext.Ajax.request({
                url:$__app__ + '/CreditBill/merge_bill_save',
                params:post_val,
                method:'POST',
                success:function (response, otps) {
                    var result = Ext.decode(response.responseText);
                    myMask.hide();
                    Ext.Msg.alert("友情提示",result.info);
                    if (result.status){
                        merge_win.hide();
                    }
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            })
        })
    };
});