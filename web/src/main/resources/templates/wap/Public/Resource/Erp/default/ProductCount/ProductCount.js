/**
 * Created by cjl on 2017/6/7.
 */
Ext.onReady(function () {
    var pageSize = 20;
    Ext.QuickTips.init();
    var prepay_window;

    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: "产品ID", dataIndex: "o_product_id", width: 80, align: 'center',hidden:true},
        {header: "产品编号", dataIndex: "o_product_num", width: 200, align: 'left'},
        {header: "产品名称", dataIndex: "o_product_name", width: 300, align: 'left',renderer:productName},
        {header: "订单数 <i class='fa fa-question-circle'></i>", dataIndex: "order_num", width:100, align: 'center', renderer: showWin, tooltip:'点击可显示订单列表'},
        {header: "总人数", dataIndex: "person_num", width:100,align: 'center'},
        {header: "成人数", dataIndex: "big_num", width:100,align: 'center'},
        {header: "儿童数", dataIndex: "small_num", width:100,align: 'center'},
        {header: "销售金额", dataIndex: "buy_money", width:120,align: 'right', renderer: money},
        {header: "结算金额", dataIndex: "settle_money", width:120,align: 'right', renderer: money},
    ];

    var url = $__app__ + '/ProductCount/getDataList';
    var field = ['o_product_num', 'o_product_name', 'order_num', 'person_total', 'big_num', 'small_num', 'buy_money', 'settle_money'];
    var store = SUNLINE.JsonStore(url, field, false);
    var search_params = {
        time_type: time_types,
        start_time: start_time,
        end_time: end_time,
        t_type: t_type,
        org_id: org_id,
        t_org_id: t_org_id,
    };
    //分销商下拉列表是否隐藏？ 如果是从分销商汇总跳转过来的，隐藏这个列表，不是则显示。
    var is_company =  ( org_id && t_type == 2 ) ? true : false;

    console.log( search_params );
    //return;

    SUNLINE.baseParams(store, search_params);
    store.currentPage = 1;
    store.load();

    //查询日期类型
    var time_type = SUNLINE.LocalComob({
        id: 'time_type',
        fields: ['time_type'],
        data: [['出团日期'], ['交易日期']],
        config: {
            allowBlank: true,
            id: 'time_type',
            width: 170,
            fieldLabel: "日期类型",
            labelWidth: 60,
            labelAlign: 'right',
            //value: '出团日期',
            value: time_types ? time_types : '出团日期',
            style:'margin-top:3px;',
        }
    });
    //开始日期
    var start_date = SUNLINE.ExtDateField({
        labelSeparator: '',
        id: 'start_time',
        labelWidth: 0,
        fieldLabel: "&nbsp;",
        labelAlign: "right",
        width: 110,
        gang: 'end_time',
        start: true,
        value: start_time ? start_time : '',
        style:'margin-top:3px;margin-left:5px;',
    });
    //结束日期
    var end_date = SUNLINE.ExtDateField({
        labelSeparator: '',
        id: 'end_time',
        labelWidth: 0,
        fieldLabel: "&nbsp;",
        labelAlign: "right",
        width: 110,
        gang: 'start_time',
        value: end_time ? end_time : '',
        style:'margin-top:3px;margin-left:5px;',
    });

    //分销商单位
    var company_box = SUNLINE.CompanyBox({
        where:{t_type: t_type, org_id: org_id},
        id:'reseller',
        name:'reseller',
        fields:['id','text'],
        url:$__app__ + '/ProductCount/getResList',
        config:{
            disabled: is_company,
            displayField:'text',
            valueField:'id',
            fieldLabel:'分销商',
            name:'reseller',
            labelWidth:60,
            width:225,
            labelAlign: 'right',
            value: '',
            pageSize:20,
            listConfig:{
                minWidth:270,
            },
            colspan:2,
            style:'margin-top:3px;margin-left:5px;'
        }
    });

    //产品品牌
    var brand_box = SUNLINE.ComBoxPlus({
        id: 'p_cb',
        name: 'p_cb',
        fields: ['cb_id', 'cb_name'],
        url: $__app__ + '/ProductCount/getProductBrand',
        where:{t_type: t_type, org_id: org_id},
        config: {
            displayField: 'cb_name',
            emptyText: '',
            valueField: 'cb_id',
            width: 170,
            value: '',
            pageSize: 0,
            fieldLabel: '品牌名称',
            labelWidth: 60,
            labelAlign: 'right',
            padding: '0 0 0 0',
            listConfig:{
                minWidth:240,
            },
            style:'margin-top:3px;'
        },
    });

    //配置ext面板
    var panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '暂无数据'},
        tbar: [
            {
                xtype: 'buttongroup',
                //id: 'search_form',
                title: '<b style="float:left;">'+open_title+'产品汇总</b>'+'<span style="float:right">查询条件</span>',
                height: 86,
                columns: 4,
                items: [
                    time_type,
                    start_date,
                    end_date,
                    {text: '查询', iconCls: 'button-sch', handler: function () {doSearch();},style:'margin-top:3px;margin-left:5px;'},
                    brand_box,
                    company_box,
                    {text: '导出', iconCls: 'button-article', id: 'add_id', handler: doExcel,style:'margin-top:3px;margin-left:5px;'},
                ],
            },
            '->',{
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:86,
                columns:7,
                bodyStyle:'padding:10px',
                items:[
                    {
                        xtype: 'trigger',
                        triggerCls: 'x-form-search-trigger',
                        id: 'skey',
                        emptyText: '产品编号、产品名称',
                        width: 160,
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
                    {xtype:'tbtext',text:'&nbsp;'},
                    {
                        icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                        cls: 'x-btn-icon',
                        tooltip: '重载线下支付统计',
                        handler: function () {
                            window.location.reload();
                        }
                    },
                    {xtype:'tbtext', text:''},
                    {
                        icon: $app_public_images_path + 'delete.gif',
                        cls: 'x-btn-icon',
                        tooltip: '关闭当前页',
                        handler: function () {
                            var main_tab_view = parent.Ext.getCmp('MainTabPanel'); //得到tab组件
                            var tab = main_tab_view.getActiveTab();
                            if (!tab.closable) return;
                            Ext.Msg.confirm('友情提醒', '您真的要关闭“' + tab.title + '”吗？', function (btn) {
                                if (btn == 'yes') {
                                    main_tab_view.remove(tab);
                                    parent.tab_list_menu.remove(Ext.getCmp('am_' + tab.id));
                                }
                            });
                        }
                    },
                    {xtype:'tbtext', text:''},
                    {icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('产品汇总报表')}},
                ],
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无数据'
        })
    });

    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

    //搜索条件
    function doSearch() {
        //获取所有搜索条件
        var search_params = getSearchParams();

        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    /**
     * 导出excel
     */
    function doExcel() {
        //获取所有搜索条件
        var search_params = getSearchParams();
        //拼接url参数
        var params = 'time_type=' + search_params.time_type
            + '&start_time=' + search_params.start_time
            + '&end_time=' + search_params.end_time
            + '&skey=' + search_params.skey
            + '&cb_id=' + search_params.cb_id
            + '&o_sorg_id=' + search_params.o_sorg_id
            + '&t_type=' + search_params.t_type
            + '&org_id=' + search_params.org_id
            + '&t_org_id=' + search_params.t_org_id;
        window.location = $__app__ + '/ProductCount/getListDataExcel?' + params;
    }

    //获取所有搜索条件 --产品汇总
    function getSearchParams(){
        var time_type = Ext.getCmp('time_type').getValue();
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var o_sorg_id = Ext.getCmp('reseller_id').getValue();
        var cb_id = Ext.getCmp('p_cb_id').getValue();
        var skey = Ext.getCmp('skey').getValue();

        var search_params = {
            time_type: time_type,
            start_time: start_time,
            end_time: end_time,
            o_sorg_id: o_sorg_id,
            cb_id: cb_id,
            skey: skey,
            t_type: t_type,
            org_id: org_id,
            t_org_id: t_org_id,
        };
        return search_params;
    }

    /**
     *  给产品名称拼接上品牌名称
     */
    function productName(v, c,record){
        var cb_name = record.data.o_cb_name;
        return cb_name ? '【<font color="blue">'+cb_name+'</font>】'+v : v;
    }

    /**
     * 显示订单列表 --弹窗
     */
    function showWin(v, m){
        var product_id  = m.record.data.o_product_id;
        var product_name = m.record.data.o_product_name;
        console.log( product_id );
        v = !product_id ?  v : "<a href='javascript:;' onclick='orderData(\""+product_id+"\",\""+product_name+"\");' style='color:blue;text-decoration：none;'>"+v+"</a>";
        return v;
    }

    /**
     * 订单弹窗
     */
    window.orderData = function(product_id, product_name){
        var o_cb_id = Ext.getCmp('p_cb_id').getValue();         //品牌ID
        var reseller_id = Ext.getCmp('reseller_id').getValue();         //分销商ID
        var order_time_type = Ext.getCmp('time_type').getValue();                           //时间类型
        var order_start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');//开始时间
        var order_end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');    //结束时间
        var time_type = (order_time_type == '出团日期' ? 'o_start_date' : 'o_sell_time'); //时间类型，出团日期or交易日期

        var url = $__app__ + '/OrderAdmin/seller?o_product_id=' + product_id
            + '&t_type=' + t_type
            + '&org_id=' + org_id
            + '&t_org_id=' + t_org_id
            + '&o_sorg_id=' + reseller_id
            + '&o_cb_id=' + o_cb_id
            + '&time_type=' + time_type
            + '&order_start_time=' + encodeURI(order_start_time)
            + '&order_end_time=' + encodeURI(order_end_time);

        if ( !prepay_window ) {
            prepay_window = new Ext.Window({
                width: Ext.getBody().getWidth() - 50,
                height: Ext.getBody().getHeight() - 50,
                closeAction: 'hide',
                modal: true,
                html: '<iframe  frameborder="0" id="order_list" name="order_list" style="width: 100%; height: 100%;" ></iframe>',
            });
        }
        prepay_window.setTitle( product_name );
        prepay_window.show();
        setTimeout(function () {
            window.order_list.location = url;
        }, 100);
    }

});
