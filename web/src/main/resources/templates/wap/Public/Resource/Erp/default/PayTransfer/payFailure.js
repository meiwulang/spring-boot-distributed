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
    var url = $__app__ + '/PayTransfer/payDataJson';
    var field = ['t_id', 't_out_trade_no', 't_type', 't_amount', 't_request_no', 't_request_time', 't_request_info', 't_request_num', 't_create_time', 't_out_orgname', 't_in_orgname'];
    var store = SUNLINE.JsonStore(url, field);

    var cm = [
        new Ext.grid.RowNumberer(),
        {header: "ID", dataIndex: "t_id", width: 50, hidden: true},
        {header: "转账类型", dataIndex: "t_type", align: 'center',maxWidth:120},
        {header: "转账金额", dataIndex: "t_amount", align: 'left',renderer:money, maxWidth:100},
        {header: "转账编号", dataIndex: "t_request_no", align: 'center'},
        {header: "失败反馈信息", dataIndex: "t_request_info", align: 'center',minWidth:150},
        {header: "转账时间", dataIndex: "t_request_time", align: 'center', width: 60},
        {header: "订单编号", dataIndex: "t_out_trade_no", align: 'center'},
        {header: "转出单位名称", dataIndex: "t_out_orgname", align: 'center'},
        {header: "转入单位名称", dataIndex: "t_in_orgname", align: 'center'},
        {header: "创建时间", dataIndex: "t_create_time", align: 'center', width: 60},
    ];

    /*转账类型*/
    var t_type = SUNLINE.LocalComob({
        id: 't_type',
        fields: ['t_type', 't_type_text'],
        data: [
            {'t_type': 0, 't_type_text': '全部'},
            {'t_type': 1, 't_type_text': '供应商实收'},
            {'t_type': 2, 't_type_text': '手续费'},
            {'t_type': 3, 't_type_text': '佣金'},
            {'t_type': 4, 't_type_text': '提现手续费'},
        ],
        config: {
            displayField: 't_type_text',
            valueField: 't_type',
            fieldLabel: '转账类型',
            allowBlank: true,
            id: 't_type',
            name: 't_type',
            labelWidth: 80,
            labelAlign: 'right',
            width: 185,
            value: 0
        }
    });

    //配置ext面板
    var panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        forceFit: true,
        viewConfig: {emptyText: '暂时没有转账失败记录！'},
        tbar: [
            //{text: '手动转账', iconCls: 'button-edit', id: 'update-pay', handler: function(){manWin.show();}},
            {text: '检查', iconCls: 'button-edit', id: 'check-transfer', handler: checkTransfer},
            '-',
            t_type,
/*            '转账金额:',
            {id: "t_amount_start", name: "t_amount_start", xtype: "textfield", width: 80},
            '~',
            {id: "t_amount_end", name: "t_amount_end", xtype: "textfield", width: 80},*/
            '转账日期:',
            SUNLINE.ExtDateField({
                    id: 't_request_time_start',
                    name: 't_request_time_start',
                    labelWidth: 0,
                    labelAlign: "right",
                    style: 'margin-top:5px;',
                    fieldLabel: " ",
                    labelSeparator: '',
                    width: 110,
                    gang: 't_request_time_end',
                    start: true,
                    value: '',
                }
            ),
            '~',
            SUNLINE.ExtDateField({
                    id: 't_request_time_end',
                    name: 't_request_time_end',
                    labelWidth: 0,
                    labelAlign: "right",
                    style: 'margin-top:5px;',
                    fieldLabel: " ",
                    labelSeparator: '',
                    width: 110,
                    gang: 't_request_time_start',
                    value: '',
                }
            ),
            '关键字：',
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
            },
            {text: '查询', iconCls: 'button-save', id: 'button-save', handler: doSearch},
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载转账失败数据',
                handler: function () {
                    window.location.reload();
                }
            }

        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: ''
        }),
        viewConfig: { //面板可复制属性
            enableTextSelection: true
        },
    });

    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });


    /*转账类型*/
    var t_type_1 = SUNLINE.LocalComob({
        id: 't_type_1',
        fields: ['t_type', 't_type_text'],
        data: [
            {'t_type': 1, 't_type_text': '供应商实收'},
            {'t_type': 2, 't_type_text': '手续费'},
            {'t_type': 3, 't_type_text': '佣金'},
        ],
        config: {
            displayField: 't_type_text',
            valueField: 't_type',
            fieldLabel: "<font color='red'>*</font>转账类型",
            allowBlank: true,
            id: 't_type_1',
            name: 't_type_1',
            labelAlign: 'right',
            width: 300,
            value: 1
        }
    });
    //转入方单位
    var inCom = SUNLINE.CompanyBox({
        where: {},
        config: {
            id: 't_in_orgid',
            name: 't_in_orgid',
            displayField: 'text',
            valueField: 'id',
            fieldLabel: "<font color='red'>*</font>转入方单位",
            labelAlign: 'right',
            value: '',
            pageSize: 20,
            allowBlank: false,
        }
    });
    inCom.on('select',function(_this){
        Ext.getCmp('t_in_orgname').setValue(_this.rawValue);
    });
    //转出方单位
    var outCom = SUNLINE.CompanyBox({
        where:{},
        config:{
            id: 't_out_orgid',
            name: 't_out_orgid',
            displayField:'text',
            valueField:'id',
            fieldLabel:"<font color='red'>*</font>转出方单位",
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            allowBlank: false,
        }
    });
    outCom.on('select',function(_this){
        Ext.getCmp('t_out_orgname').setValue(_this.rawValue);
    });
    //金额
    var t_amount = Ext.create('Ext.form.TextField', {
        labelAlign: "right",
        id: "t_amount",
        name: "t_amount",
        fieldLabel: "<font color='red'>*</font>转账金额",
        emptyText:'单位：元',
        allowBlank: false,
        vtype:'money',
        vtypeText:'只允许输入数字!',
    });
    //订单号
    var t_out_trade_no = Ext.create('Ext.form.TextField', {
        labelAlign: "right",
        id: "t_out_trade_no",
        name: "t_out_trade_no",
        fieldLabel: '订单编号',
        emptyText:'输入转账相关连的订单编号',
        allowBlank: true,
    });
    //转账备注
    var t_warning_info = Ext.create('Ext.form.TextField', {
        labelAlign: "right",
        id: "t_warning_info",
        name: "t_warning_info",
        fieldLabel: '转账备注',
        emptyText:'手动发起转账的原因',
        allowBlank: true,
    });

    var manForm = Ext.create('Ext.form.FormPanel',{
        border: false,
        bodyStyle: 'background:none;padding:10px',
        defaultType: 'textfield',
        defaults: {labelAlign: "right", width: 360, labelWidth: 80,},
        items: [
            t_type_1,
            outCom,
            {id: "t_out_orgname", name: "t_out_orgname", value:_uinfo.org_name, fieldLabel: "转出方单位ID", xtype: "hidden"},
            inCom,
            {id: "t_in_orgname", name: "t_in_orgname", fieldLabel: "转入方单位ID", xtype: "hidden"},
            t_amount,
            t_out_trade_no,
            t_warning_info,
        ]
    });

    var manWin = Ext.create('Ext.Window', {
        width: 400,
        title:'手动转账',
        items: manForm,
        modal: true,
        closeAction: 'hide',
        buttons: [
            {text: '保存', handler: manualTransfer},
            {
                text: '关闭', handler: function () {
                    manWin.hide();
                }
            }
        ]
    });

    //手动操作转账操作
    function manualTransfer() {
        if (!manForm.getForm().isValid()) {
            return ExtAlert('红色边框显示为必填项', '友情提示');
        };
        var myMask = SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var manFormData = manForm.getForm().getValues();
        Ext.Ajax.request({
            url: $__app__ + '/PayTransfer/manualTransfer',
            params: manFormData,
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                myMask.hide();
                if (ret.success) {
                    store.reload();
                }
                ExtAlert(ret.message, '友情提示');
                manWin.hide();
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
        var row = SUNLINE.getSelected(panel);
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
                }
                return ExtAlert(ret.info, '提示');
            },
            failure: function (response, otps) {
                Ext.Msg.alert('友情提示', '检查转账记录失败！');
            }
        });
    }

    //搜索查询数据
    function doSearch() {
        var t_type = Ext.getCmp('t_type').getValue();
        // var t_amount_start = Ext.getCmp('t_amount_start').getValue();
        // var t_amount_end = Ext.getCmp('t_amount_end').getValue();
        var t_request_time_start = Ext.Date.format(Ext.getCmp('t_request_time_start').getValue(), 'Y-m-d');
        var t_request_time_end = Ext.Date.format(Ext.getCmp('t_request_time_end').getValue(), 'Y-m-d');
        var keyword = Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(store, {
            t_type: t_type,
            //t_amount_start: t_amount_start, t_amount_end: t_amount_end,
            t_request_time_start: t_request_time_start, t_request_time_end: t_request_time_end,
            keyword: keyword
        });
        store.currentPage = 1;
        store.load();
    }
});
