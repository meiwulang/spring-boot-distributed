/**
 * Created by cjl on 2017/6/12.
 */
var pageSize = 20;

Ext.onReady(function(){
    //初始加载store
    var url = $__app__ + '/OnlineCount/getOnlineCountList';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);

    var center_cm = [
        new Ext.grid.RowNumberer({width:30}),
        {header: "支付通道", dataIndex: "bank_info",width:130},
        {header: "交易金额", dataIndex: "money", align:'right', renderer: money,width:120},
        {header: "百分比", dataIndex: "percent", align: 'right', width:80, renderer:sortPercent},
        {header: "订单数", dataIndex: "count_order", align: 'right', width:80},
        {header: "分销商数", dataIndex: "count_buyer", align: 'right', width:90},
        {header: "供应商数", dataIndex: "count_seller", align: 'right', width:90},
    ];

    //查询日期类型
    var time_type = SUNLINE.LocalComob({
        id: 'time_type',
        fields: ['time_type'],
        data: [['付款日期'],['出团日期']],
        config: {
            id: 'order_time_type',
            labelWidth: 80,
            width: 100,
            labelAlign: 'right',
            fieldLabel: false,
            value: '付款日期'
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

    var center_panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: center_cm,
        border: true,
        viewConfig: {emptyText: '暂无产品！'},
        tbar:[
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
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('在线支付统计报表')}},
        ]
    });

    store.on('load',function(){

    });


    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [{
            region: 'east',
            activeTab: 0,
            width:'58%',
            html:'<iframe id="online_pic" name="online_pic" src="'+$__app__+'/OnlineCount/getPicImage?request_source=pic" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>',
        },{
            region: 'center',
            title: '',
            collapsible: false,
            width: '40%',
            height:'100%',
            layout: 'border',
            items:[center_panel],
            emptyText:'暂无产品',
        }]
    });

    //搜索条件
    function doSearch() {
        //接收参数
        var order_start_time = Ext.Date.format(Ext.getCmp('order_start_time').getValue(), 'Y-m-d');
        var order_end_time = Ext.Date.format(Ext.getCmp('order_end_time').getValue(), 'Y-m-d');
        var order_time_type = Ext.getCmp('order_time_type').getValue();

        //列表store重新加载
        var search_params = {
            order_time_type: order_time_type,
            order_start_time: order_start_time,
            order_end_time: order_end_time,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();

        //饼状图重新加载
        var url = $__app__+'/OnlineCount/getPicImage?order_time_type='+order_time_type
            +'&order_start_time='+order_start_time
            +'&order_end_time='+order_end_time
            +'&request_source=pic';
        document.getElementById('online_pic').contentWindow.location.href = url;
    }

    function sortPercent( v ){
        return v ? v+'%' : 0;
    }
});
