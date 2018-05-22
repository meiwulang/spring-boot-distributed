/**
 * Created by cjl on 2017/5/19.
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    var url = $__app__ + '/OfflinePayment/getOrderList';
    var field = [];
    var store = SUNLINE.GroupingStore(url, field, {}, true);

    var isEdit = Ext.create('Ext.form.DateField', {
        allowBlank: false,
        format:'Y-m-d',
        editable: false, //日期文本框禁止手动输入
    });


    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {text: '订单ID', dataIndex: 'o_id', align: 'center',width:80, hidden: true},
        {text: '分销商名称', dataIndex: 'o_sorg_name', align: 'left',width:230},
        {text: '订单编号', dataIndex: 'o_number', align: 'center',width:150},
        {text: '线路名称', dataIndex: 'o_product_name', width: 230, align: 'left'},
        {text: '交易金额', dataIndex: 'o_settle_real', width: 150, align: 'right',renderer:money},
        {text: '成人人数', dataIndex: 'o_big_num', width: 90, align: 'right'},
        {text: '儿童人数', dataIndex: 'o_small_num', width: 90, align: 'right'},
        {text: '总人数', dataIndex: 'o_num', width: 90, align: 'right'},
        {text: '交易日期', dataIndex: 'o_sell_time', width: 150, align: 'center'},
        {header:'<span style="color:blue">付款日期</span>', dataIndex: 'o_payment_time', width: 150, align: 'center',editor: isEdit, renderer:is_cluster},
        {text: '出团日期', dataIndex: 'o_start_date', width: 130, align: 'center'},
        {text: '备注', dataIndex: 'o_line_remark', width: 130, align: 'left', renderer:showTitle}
    ];
    //支付类型
    var payment_type = SUNLINE.LocalComob({
        id: 'payment_type',
        fields: ['payment_type', 'payment_type_text'],
        data: [
            {'payment_type': 'line', 'payment_type_text': '线下支付'},
        ],
        config: {
            displayField: 'payment_type_text',
            valueField: 'payment_type',
            fieldLabel: '支付类型',
            allowBlank: true,
            id: 'payment_type',
            name: 'payment_type',
            labelWidth: 60,
            labelAlign: 'right',
            width: 160,
            value: '全部'
        }
    });

    //查询日期类型
    var time_type = SUNLINE.LocalComob({
        id: 'time_type',
        fields: ['time_type'],
        data: [['出团日期'], ['交易日期'], ['付款日期']],
        config: {
            allowBlank: true,
            id: 'order_time_type',
            labelWidth: 20,
            width: 120,
            labelAlign: 'right',
            fieldLabel: "&nbsp;",
            labelSeparator: "&nbsp;",
            value: '出团日期'
        }
    });

    //开始日期
    var start_date = SUNLINE.ExtDateField({
        labelSeparator: '',
        id: 'order_start_time',
        name: 'start_time',
        labelWidth: 0,
        fieldLabel: " ",
        labelAlign: "right",
        width: 120,
        gang: 'order_end_time',
        start: true,
    });
    //结束日期
    var end_date = SUNLINE.ExtDateField({
        labelSeparator: '',
        id: 'order_end_time',
        name: 'end_time',
        labelWidth: 0,
        fieldLabel: " ",
        labelAlign: "right",
        width: 120,
        gang: 'order_start_time',
    });

    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        viewConfig: {emptyText: '暂时没有订单'},
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var data = SUNLINE.getSelected(g.grid).data;
                        var o_payment_time = Ext.Date.format(data.o_payment_time, 'Y-m-d');
                        var o_id = data.o_id;
                        Ext.Ajax.request({
                            url: $__app__+'/OfflinePayment/updatePaymentTime',
                            params: {o_id: o_id, o_payment_time: o_payment_time},
                            method:'post',
                            success: function(response){
                                var r = Ext.decode(response.responseText);
                                //Ext.Msg.alert('友情提示', r.msg);
                                if(r.status){
                                    store.load();
                                }
                            }
                        })
                    }
                }
            })
        ],
        tbar: [
            payment_type,
            time_type,
            start_date,
            '至',
            end_date,
            {
                text: '查询',
                iconCls: 'button-sch',
                handler: function () {
                    doSearch();
                },
            },
            '-',
            {text: '导出', iconCls: 'button-article', id: 'add_id', handler: doExcel},
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('线下支付明细报表')}},
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'skey',
                emptyText: '分销商名称、订单编号',
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
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载线下支付统计',
                handler: function () {
                    window.location.reload();
                }
            }
        ],
        emptyText: '暂无数据',
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: 2,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        viewConfig: { //面板可复制属性
            enableTextSelection: true
        },
        renderTo: Ext.getBody(),
        listeners: {
            beforeedit: function (a,b) {
                if(b.record.get('o_payment_time')== undefined){
                    return false;
                }
            }
        }
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    //显示title
    function showTitle(value, metaData){
        if( value )
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
        return value;
    }

    //判断付款日期显示格式
    function is_cluster(v) {
        if(v == undefined) return '';
        if (v == 0) return "未设置";
        return v.length == 10 ? v : Ext.Date.format(v, 'Y-m-d');
    }

    //搜索条件
    function doSearch() {
        var payment_type = Ext.getCmp('payment_type').getValue();
        var order_start_time = Ext.Date.format(Ext.getCmp('order_start_time').getValue(), 'Y-m-d');
        var order_end_time = Ext.Date.format(Ext.getCmp('order_end_time').getValue(), 'Y-m-d');
        var order_time_type = Ext.getCmp('order_time_type').getValue();
        var skey = Ext.getCmp('skey').getValue();

        var search_params = {
            payment_type: payment_type == '全部' ? '' : payment_type,
            order_time_type: order_time_type,
            order_start_time: order_start_time,
            order_end_time: order_end_time,
            skey: skey,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    /**
     * 导出excel
     */
    function doExcel() {
        var payment_type = Ext.getCmp('payment_type').getValue();
        var order_start_time = Ext.Date.format(Ext.getCmp('order_start_time').getValue(), 'Y-m-d');
        var order_end_time = Ext.Date.format(Ext.getCmp('order_end_time').getValue(), 'Y-m-d');
        var order_time_type = Ext.getCmp('order_time_type').getValue();
        var skey = Ext.getCmp('skey').getValue();

        payment_type: payment_type == '全部' ? '' : payment_type;

        var url = 'payment_type=' + payment_type
            + '&order_time_type=' + order_time_type
            + '&order_start_time=' + order_start_time
            + '&order_end_time=' + order_end_time
            + '&skey=' + skey;
        window.location = $__app__ + '/OfflinePayment/getListDataExcel?' + url;
    }

    //订单详情页面跳转
    window.UrlOrderDetail=function(v){
        parent.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/seller', 1);
    };

});
