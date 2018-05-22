Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.QuickTips.init();

    var thisTitle = '欠款信息汇总';
    var dis_url = $__app__+'/CreditBill/summary_json';
    var dis_fields = ["org_id","org_name", "org_type", "money_s1", "money_s2", "money_t1", "money_t2", "money_all", "nopay"];
    var _store = SUNLINE.JsonStore(dis_url,dis_fields);

    function org_name(v, m, r){
        var pt = r.get('org_type') == '网络平台' ? '<i class="fa fa-exclamation-circle" data-qtip="网络平台"></i> ' : '';
        var on = v.split(';;');
        return pt + on[1];
    };

    function org_bh(v, m, r){
        var on = r.get('org_name').split(';;');
        return on[0];
    };

    var _cm = [
        new Ext.grid.RowNumberer({width:45}),
        {header:"ID",dataIndex:"org_id",hidden:true},
        {header:"编号",dataIndex:"org_bh",width:80, renderer:org_bh},
        {header:"结算单位",dataIndex:"org_name",width:300, renderer:org_name},
        {header:"欠款总额 <i class='fa fa-question-circle'></i>",dataIndex:"money_all",renderer:sum_money,
            width:150,tooltip:'欠款总额 = 未生成账单 + 未生成账单 + 未还金额'},
        {text:'跟团游', columns:[
            {header:"未生成账单",dataIndex:"money_s1",renderer:money,width:150},
            {header:"已生成账单 <i class='fa fa-question-circle'></i>",dataIndex:"money_s2",renderer:money,width:150,tooltip:'仅统计有欠款的账单金额'}
        ]},
        {text:'团队', columns:[
            {header:"未生成账单",dataIndex:"money_t1",renderer:money,width:150},
            {header:"已生成账单 <i class='fa fa-question-circle'></i>",dataIndex:"money_t2",renderer:money,width:150,tooltip:'仅统计有欠款的账单金额'}
        ]},
        {header:"未还金额",dataIndex:"nopay",renderer:money,width:150}
    ];

    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: _store,//数据源
        columns: _cm,//表格列定义
        tbar:[
            {text:'生成账单',iconCls: 'button-add',disabled:isDisabled("CreditBill::create_bill_by_id"),handler:createBill},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'u_Search',
                iconCls:'button-sch',
                emptyText : '单位名称、编号',
                width:220,
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
            emptyMsg: '没有数据'
        })
    });

    function _search(){
        var skey = Ext.getCmp('u_Search').getValue();
        SUNLINE.baseParams(_store,{skey:skey});
        _store.load();
    }

    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    var order_list_url   = $__app__ + '/CreditBill/get_order_list';
    var order_list_fld = ["o_id", "o_number", "o_settle_real", "o_product_name", "o_num", "o_type", "o_start_date", "o_sell_time", "o_bill_amount", "o_reapy_amount","op_bill_date"];
    var order_list_store = SUNLINE.JsonStore(order_list_url, order_list_fld, false);
    order_list_store.on('load', function(){
        Ext.getCmp('order_total').setText('共找到<span style="color: blueviolet">'+ order_list_store.getCount() +'</span>个订单');
    });

    var order_list_grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        selModel:{ selType: 'checkboxmodel' },
        columns:[
            new Ext.grid.RowNumberer({width:45}),
            {header:"ID", dataIndex:"o_id", width:80,hidden:true},
            {header:"出团时间", dataIndex:"o_start_date", width:90,renderer:formatDate},
            {header:"账单日期", dataIndex:"op_bill_date", width:90,renderer:number2date},
            {header:"交易总金额", dataIndex:"o_bill_amount", width:100,renderer:money},
            {header:"未付款", dataIndex:"o_nopay_amount", width:100,renderer:nopay_money},
            {header:"已付款", dataIndex:"o_reapy_amount", width:100,renderer:money},
            {header:"订单总金额", dataIndex:"o_settle_real", width:100,renderer:money},
            {header:"人数", dataIndex:"o_num", width:60},
            {header:"产品名称", dataIndex:"o_product_name", width:180},
            {header:"订单编号", dataIndex:"o_number", width:150,renderer:formatNum},
            {header:"交易时间", dataIndex:"o_sell_time", width:150,renderer:getLocalTime}
        ],
        sortable: true,
        store: order_list_store//数据源
    });
    order_list_grid.on('selectionchange', function(t, s, o){
        var tm = 0;
        Ext.each(s, function(item){
            tm = Number(tm) + (item.data['o_bill_amount']- item.data['o_reapy_amount']);
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
                emptyText : '订单号、游客信息',
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
        var bill_date_type=time_type_combo.getValue();
        var bill_date=Ext.getCmp('bill_date').getValue();
        var row = SUNLINE.getSelected(_grid);
        var bill_org=row.get('org_id');
        SUNLINE.baseParams(order_list_store,{bill_orgid:bill_org,bill_date:bill_date,bill_date_type:bill_date_type});
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
            var mask=SUNLINE.LoadMask('数据提交中，请稍候...');
            mask.show();

            var _temp_id=[];
            for (var i=0;i<rows.length;i++){
                _temp_id.push(rows[i]['data']['o_id']);
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
        var title = row.get('org_name'), org_type= row.get('org_type');
        order_list_store.removeAll();
        create_bill_win.setTitle('手动生成账单：【' + title.replace(';;', '】') + ' <span style="color: yellow">[' + org_type + ']</span>');
        create_bill_win.show();
        return ;
    };


    function balance_format(v,m,r){
        return "￥"+(0-v);
    };

    function body_info(v,m,r){
        return '<span qtip="'+v+'">'+v+'</span>';
    };

    function quick_search(e){
        var where={};
        var org_id=Ext.getCmp("company_box").getValue();
        var status=finishComob.getValue();
        var start_date=Ext.getCmp("ap_start_date").getValue();
        var end_date=Ext.getCmp("ap_end_date").getValue();
        if(org_id) where["org_id"]=org_id;
        if(status) where["status"]=status;
        if(start_date) where["start_date"]=start_date;
        if(end_date) where["end_date"]=end_date;
        SUNLINE.baseParams(_store,where);
        _store.load();
    };

    function sum_money(v,m,r){
        var sum=parseFloat(r.get('money_all')) - r.get('money_s2')- r.get('money_t2') + parseFloat(r.get('nopay'));
        return money(sum, m, r);
    };


    function nopay_money(v, m, r){
        var bm = r.get('o_bill_amount'), rp = r.get('o_reapy_amount');
        var np = bm-rp;
        return '<div style="color:blue;">' + money(np, m, r) + '</div>';
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
        var ot = r.get('o_type');
        var color = ot=='跟团游' ? '#009b26' : 'blue';
        return '<div data-qtip="'+ ot +'"><a href="'+ $__app__ + '/OrderDetail/index/id/'+ v
            +'" style="color:'+ color +'" target="_blank">'+ v +'</a></div>';
    };

    //合并账单操作
    var merge=SUNLINE.MergeBill('',function(v,r){
        order_list_store.reload();
    });
    function mergeBill(){
        var rows=order_list_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何订单记录');
            return;
        };
        var _temp_id=[],org_id;
        for (var i=0;i<rows.length;i++){
            _temp_id.push(rows[i]['data']['o_id']);
            org_id=rows[i]['data']['op_pay_org'];
        };
        _temp_id=_temp_id.join(',');
        SUNLINE.baseParams(merge.store,{org_id:org_id});
        merge.store.load();
        merge.win.show();
        merge.id.setValue(_temp_id);
    };
});