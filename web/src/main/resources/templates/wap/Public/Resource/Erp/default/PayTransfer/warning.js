/**
 * Created by cjl on 2017/4/20.
 */
var pageSize = 20; //每页记录数
Ext.onReady(function () {

    //转账金额验证,只允许数字和小数点
    Ext.apply(Ext.form.field.VTypes, {
        money: function(val, field) {
            return /^\d+$|^\d+\.\d+$/.test(val);
        },
        ipText: "请输入数字！",
        ipMask: /[\d\.]/i
    });

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    //获取初始化失败数据
    var url = $__app__ + '/PayTransfer/dataJson';
    var field = ['t_id', 't_out_trade_no', 't_type', 't_amount', 't_request_no', 't_request_time', 't_request_info', 't_request_num', 't_create_time', 't_out_orgname', 't_in_orgname'];
    var store = SUNLINE.JsonStore(url, field);

    var status_color = {'处理中':'#ff6331', '已转账':'#71dc1c', '已失败':'#8899AB', '已撤销':'#666666'};
    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: "ID", dataIndex: "t_id", width: 50, hidden: true},
        {header: "账单ID", dataIndex: "t_bill_id", width: 70, hidden: true},
        {header: "转出方ID", dataIndex: "t_out_orgid", width: 100, hidden: true},
        {header: "转入方ID", dataIndex: "t_in_orgid", width: 100, hidden: true},
        {header: "转账状态", dataIndex: "t_status",width:80,renderer:function(v){
            return '<div style="width:52px;border-radius:3px;padding:2px 5px;color:#fff;background-color: '+status_color[v]+'">'+v+'</div>';
        }},
        {header: "转出单位", dataIndex: "t_out_orgname",width:220},
        {header: "转入单位", dataIndex: "t_in_orgname",width:220},
        {header: "转账类型", dataIndex: "t_type",width:100},
        {header: "转账编号", dataIndex: "t_request_no",width:160},
        {header: "转账金额", dataIndex: "t_amount", align: 'right',renderer:money, width:100},
        {header: "失败原因", dataIndex: "t_request_info",minWidth:220,renderer:function(v){
            return '<div data-qtip="'+v+'">'+v+'</div>';
        }},
        {header: "创建时间", dataIndex: "t_create_time", width: 140},
        {header: "转账时间", dataIndex: "t_request_time", width: 140},
        {header: "完成时间", dataIndex: "t_finish_time", width: 140},
        {header: "订单编号", dataIndex: "t_out_trade_no",width:160},
    ];

    var t_type_combo = new Ext.form.ComboBox({
        fieldLabel:false,
        allowBlank:false,
        width:140,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['供应商实收'],['手续费'],['佣金'],['提现手续费'],['金豆充值']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        editable:false,
        typeAhead:true,
        value:"全部"
    });

    var t_status_combo = new Ext.form.ComboBox({
        fieldLabel:false,
        allowBlank:false,
        width:140,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['处理中'],['已转账'],['已失败'],['已撤销']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        editable:false,
        value:"已失败"
    });

    //配置ext面板
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '暂时没有转账失败记录',deferEmptyText:true,enableTextSelection: true},
        tbar: [
            {
                xtype:'buttongroup',
                title:'转账失败预警',
                height:80,
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                style:'padding:2px',
                items:[
                    {text:'处理',tooltip:'对于已失败或处理中的转账会进行撤销，并重发转账指令，处理前会检查融数的转账状态，所以无需担心重复转账',id:"manual-transfer",rowspan: 2,height:48,disabled:isDisabled("PayTransfer::manual_transfer"),iconCls: 'button-write',iconAlign: 'top',style:'margin-right:3px;',handler:mainWinShow},
                    {text:'检查状态',tooltip:'手动检查处理中的转账在融数的转账状态',id:'check-transfer',rowspan: 2,iconCls: 'button-edit',height:48,iconAlign: 'top',handler:checkTransfer}
                ]
            },
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:6,
                items:[
                    {xtype:'tbtext',text: '类型状态：',height:29,style:'line-height:26px'},
                    t_type_combo,
                    {xtype:'tbtext',text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' ,height:29,style:'line-height:26px'},
                    t_status_combo,
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',height:50,handler:doSearch,style:'margin:3px 5px 3px 10px;'},
                    {text:'日志',rowspan:2,iconCls:'button-log',iconAlign: 'top',id:'ziyo_log_btn',height:50,style:'margin:3px 5px 3px 0px'},
                    {xtype:'tbtext',text:'转账日期：',height:29,style:'line-height:26px'},
                    new SUNLINE.ExtDateField({id: 't_request_time_start',
name: 't_request_time_start',labelWidth: 1,fieldLabel: false,width: 140,gang: 't_request_time_end',start: true,value:''}
                    ),
                    {xtype:'tbtext',text:'~',height:29,style:'line-height:26px;text-align:center'},
                    new SUNLINE.ExtDateField({id: 't_request_time_end',name: 't_request_time_end',labelWidth: 1,fieldLabel: false,width: 140,gang: 't_request_time_start',value: ''}
                    ),
                ]
            },
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'Search_key',
                emptyText: '转账编号、转出单位、转入单位、订单编号',
                width: 300,
                onTriggerClick: function (e) {
                    doSearch();
                },
                listeners: {
                    "specialkey": function (_t, _e) {
                        if (_e.keyCode == 13) {
                            doSearch();
                        }
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂时没有转账失败记录'
        })
    });



    grid.getSelectionModel().on('select', function(sm,record){
        Ext.getCmp('manual-transfer').setDisabled(true);
        Ext.getCmp('check-transfer').setDisabled(true);
        if(record.data.t_status=='已失败' || record.data.t_status=='处理中'){
            Ext.getCmp('manual-transfer').setDisabled(isDisabled("PayTransfer::manual_transfer"));
        }
        if(record.data.t_status=='处理中' || record.data.t_status=='已失败'){
            Ext.getCmp('check-transfer').setDisabled(false);
        }

    });

    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [grid]
    });


    //转账失败处理表单
    var basic_items = [
        {id:'t_id',name:'t_id',xtype:'hidden'},
        {id:'t_type_text',name:'t_type',fieldLabel:'转账类型'},
        {id:'t_request_no',name:'t_request_no',fieldLabel:'转账编号'},
        {id:'t_amount',name:'t_amount',fieldLabel:'转账金额'},
        {id:'t_out_orgname',name:'t_out_orgname',fieldLabel:'转出单位'},
        {id:'t_in_orgname',name:'t_in_orgname',fieldLabel:'转入单位'},
        {id:'t_request_info',name:'t_request_info',fieldLabel:'失败原因'}
    ];
    var mainForm=Ext.create('Ext.form.Panel',{
        layout: 'column',bodyPadding: 10,id:'form',border:false,width: 490,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',columnWidth:1,
            defaults: {anchor: '100%',labelAlign: "right", labelWidth: 80,readOnly:true}
        },
        items: [
            {title:'基本信息',cls:'tcol2',items:basic_items},
            {title:'温馨提示',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1、该功能建议只由技术操作，或在技术指导下操作；</li><li>2、转账失败处理会将原单置为失败已处理状态，并生成新的队列数据交由定时任务执行。</li><li>3、该操作无法更改如金额、转出方、转入方等数据，严格按照原单数据处理。</li></ul></div>'}
        ]
    });

    var mainWin = Ext.create('Ext.Window', {
        width: 500,
        title:'转账失败处理',
        items: mainForm,
        modal: true,
        closeAction: 'hide',
        buttons: [
            {text: '处理', handler: manualTransfer},
            {
                text: '关闭', handler: function () {
                    mainWin.hide();
                }
            }
        ]
    });


    function mainWinShow(){
        var row = SUNLINE.getSelected(grid);
        if (!row) {
            return ExtAlert('请选择您要处理的转账记录!', '提示');
        }
        mainForm.getForm().setValues(row.data);
        mainWin.show();
    }



    //手动操作转账操作
    function manualTransfer() {
        if (!mainForm.getForm().isValid()) {
            return ExtAlert('红色边框显示为必填项', '友情提示');
        };
        var myMask = SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var mainFormData = mainForm.getForm().getValues();
        Ext.Ajax.request({
            url: $__app__ + '/PayTransfer/manual_transfer',
            params: mainFormData,
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                myMask.hide();
                ExtAlert(ret.info, '友情提示');
                if (ret.status) {
                    store.reload();
                    mainWin.hide();
                }
            },
            failure: function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    /**
     * 手动检查当前转账记录是否失败？
     */
    function checkTransfer(){
        //获取选中一行的数据
        var row = SUNLINE.getSelected(grid);
        if (!row) {
            return ExtAlert('请选择您要检查的转账记录!', '提示');
        }else if (!row.data.t_id) {
            return ExtAlert('数据异常!', '错误提示');
        }
        Ext.Ajax.request({
            url: $__app__ + '/PayTransfer/check_transfer',
            params: {id: row.data.t_id},
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.status) {
                    store.reload();
                }else{
                    return ExtAlert(ret.info, '提示');
                }
            },
            failure: function (response, otps) {
                Ext.Msg.alert('友情提示', '检查转账记录失败！');
            }
        });
    }

    //搜索查询数据
    function doSearch(v) {
        var t_type = t_type_combo.getValue();
        var t_status = t_status_combo.getValue();
        var t_request_time_start = Ext.Date.format(Ext.getCmp('t_request_time_start').getValue(), 'Y-m-d');
        var t_request_time_end = Ext.Date.format(Ext.getCmp('t_request_time_end').getValue(), 'Y-m-d');
        var keyword = Ext.getCmp('Search_key').getValue();
        var params = {t_type: t_type,t_status: t_status,t_request_time_start: t_request_time_start, t_request_time_end: t_request_time_end};
        if(!v){
            params = {t_status:'全部',keyword: keyword}
        }
        SUNLINE.baseParams(store, params);
        store.currentPage = 1;
        store.load();
    }

    ziyo_log({ listeners : [{grid: grid, action:'PaymentTransfer',pk_id:'t_id'}] });
});
