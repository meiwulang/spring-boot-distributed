/**
 * Created by cjl on 2017/8/11
 * 供应商汇总报表
 */
Ext.onReady(function () {
    var pageSize = 20;
    Ext.QuickTips.init();
    var prepay_window;

    var gone = org_id == false  ? false : true; // 是否跳转过，跳转过不能再跳

    var cm = [
        new Ext.grid.RowNumberer({width: 50}),
        {header: '供应商ID', dataIndex: 'org_id', width: 100, align: 'center', hidden: true},
        {header: '供应商名称', dataIndex: 'org_name', width: 200, align: 'left'},
        {header: "省份", dataIndex: "org_province", align: 'center', width: 100},
        {header: "城市", dataIndex: "org_city", align: 'center', width: 100},
        {header: "区/县", dataIndex: "org_county", align: 'center', width: 100},
        {
            header: "订单数 <i class='fa fa-question-circle'></i>",
            dataIndex: "order_num",
            align: 'right',
            renderer: showWin,
            width: 80,
            tooltip: '点击订单数显示订单列表'
        },
        {
            header: "分销商数 <i class='fa fa-question-circle'></i>",
            dataIndex: 'org_count',
            align: 'right',
            renderer: goBuyerList,
            width: 80,
            tooltip: '点击分销商数可跳转到该单位下相应的分销商汇总报表'
        },
        {
            header: "产品数 <i class='fa fa-question-circle'></i>",
            dataIndex: 'p_count',
            align: 'right',
            width: 80,
            renderer: goProductList,
            tooltip: '点击产品数可跳转到该单位下相应的产品汇总报表'
        },
        {header: "总人数", dataIndex: "person_num", align: 'right', width: 80},
        {header: "成人数", dataIndex: "big_num", align: 'right', width: 80},
        {header: "儿童数", dataIndex: "small_num", align: 'right', width: 80},
        {header: "销售金额", dataIndex: "buy_money", align: 'right', width: 120, renderer: money},
        {header: "结算金额", dataIndex: "settle_money", align: 'right', width: 120, renderer: money},
    ];

    //store
    var url = $__app__ + '/ProductCount/supplyDataList';
    var field = ['org_id','org_name', 'order_num', 'person_total', 'big_num', 'small_num', 'buy_money', 'settle_money'];
    var store = SUNLINE.JsonStore(url, field, false);
    var search_params = {
        cur_province: cur_province,
        cur_city: cur_city,
        org_id: org_id,
        time_type: time_types,
        start_time: start_time,
        end_time: end_time,
    };
    SUNLINE.baseParams(store, search_params);
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
            value: '出团日期',
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
    //省份
    var province = SUNLINE.ComBoxCity({
        id: 'org_province',
        where: {city_type: 'province'},
        config: {
            fieldLabel: "省/市/区",
            labelWidth: 60,
            labelAlign: 'right',
            forceSelection: true,
            editable: false,
            width: 170,
            listeners: {
                select: function () {
                    if (Ext.getCmp('org_city_id').getValue()) Ext.getCmp('org_city_id').setValue();
                    if (Ext.getCmp('org_county_id').getValue()) Ext.getCmp('org_county_id').setValue();
                }
            },
            style:'margin-top:3px;',
            emptyText: '请选择省份'
        }
    });
    //城市
    var city = SUNLINE.ComBoxCity({
        id: 'org_city',
        where: {city_type: 'city'},
        appTo: 'org_province',
        config: {
            fieldLabel: "&nbsp;",
            labelSeparator: '',
            labelWidth:0,
            labelAlign: 'right',
            forceSelection: true,
            editable: false,
            width: 110,
            listConfig:{
                minWidth:160
            },
            listeners: {
                select: function () {
                    if (Ext.getCmp('org_county_id').getValue()) Ext.getCmp('org_county_id').setValue();
                }
            },
            style:'margin-top:3px;margin-left:5px;',
            emptyText: '请选择城市'
        }
    });
    //区县
    var area = SUNLINE.ComBoxCity({
        id:'org_county',
        where:{city_type:'county'},
        appTo:'org_city',
        config:{
            fieldLabel: "&nbsp;",
            labelSeparator: '',
            labelWidth:0,
            labelAlign:'right',
            forceSelection:true,
            editable:false,
            width: 110,
            listConfig:{
                minWidth:160
            },
            style:'margin-top:3px;margin-left:5px;',
            emptyText:'请选择区/县'
        }
    });
    if(cur_province || cur_city){
        //province.setHidden(true);
        //city.setHidden(true);
        province.setDisabled(true);
        city.setDisabled(true);
        //重新获取区县
        var area_city_store = SUNLINE.JsonStore($__app__ + '/ProductCount/getAreaList', []);
        SUNLINE.baseParams(area_city_store, {cur_province:cur_province,cur_city:cur_city});
        area_city_store.load();
        var area = Ext.create('Ext.form.ComboBox', {
            id: 'org_county',
            fieldLabel: '',
            //labelWidth: 40,
            labelAlign: 'right',
            store: area_city_store,
            displayField: 'name',
            valueField: 'name',
            editable:false,
            allowBlank:false,
            width:110,
            style:'margin-top:3px;margin-left:5px;',
            emptyText:'请选择区/县',
            forceSelection:true,
            editable:false,
            listConfig:{
                minWidth:160
            },
        });
    }

    //配置ext面板
    var panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '暂无数据'},
        tbar: [

            {
                xtype:'buttongroup',
                id:'search_form',
                title:'<b style="float:left;">'+open_title+text_title+'</b>'+'<span style="float:right;">查询条件</span>',
                height:86,
                columns:4,
                items:[
                    time_type,
                    start_date,
                    end_date,
                    {text: '查询',rowspan:1, iconCls: 'button-sch', style:'margin-top:3px;margin-left:5px;', handler: function () { doSearch();}, },
                    province,
                    city,
                    area,
                    {text: '导出',rowspan:1, iconCls: 'button-article', id: 'add_id',style:'margin-top:3px;margin-left:5px;', handler: doExcel},
                ],
            },
            '->',{
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:86,
                columns:7,
                bodyStyle:'padding:10px',
                items:[{
                    xtype: 'trigger',
                    triggerCls: 'x-form-search-trigger',
                    id: 'skey',
                    emptyText: '供应商名称',
                    width: 150,
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
                    {icon: $app_public_images_path + 'b_help.png',tooltip: '查看帮助 ', cls: 'x-btn-icon',handler:function(){help('供应商汇总报表')}}],
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

    //*********************************** function start **************

    //供应商汇总搜索
    function doSearch(){
        //1. 获取所有的搜索条件
        var search_params = getSearchParams();

        //2. 重新加载数据
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    //导出excel
    function doExcel() {
        //1. 获取所有的搜索条件
        var search_params = getSearchParams();

        //把搜索条件拼接到url
        var params = 'sb=1&time_type=' + search_params.time_type
            + '&start_time=' + search_params.start_time
            + '&end_time=' + search_params.end_time
            + '&cur_province=' + search_params.cur_province
            + '&cur_city=' + search_params.cur_city
            + '&cur_area=' + search_params.cur_area
            + '&skey=' + search_params.skey;
        window.location = $__app__ + '/ProductCount/dataListExcel?' + params;
    }

    //查询或导出时接收的搜索条件
    function getSearchParams(){
        //1. 接收搜索条件
        var time_type = Ext.getCmp('time_type').getValue();
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        //省市区
        if(province.getValue() !== null){
            cur_province = province.getValue();
        }
        if(city.getValue() !== null){
            cur_city = city.getValue();
        }
        var cur_area = '';
        if(area.getValue() !== null){
            cur_area = area.getValue();
        }
        var skey = Ext.getCmp('skey').getValue(); //供应商名称

        //2. 拼接搜索条件
        var search_params = {
            org_id: org_id,//分销商ID
            time_type: time_type,
            start_time: start_time,
            end_time: end_time,
            cur_province: cur_province,
            cur_city: cur_city,
            cur_area: cur_area,
            skey: skey
        };

        return search_params;
    }

    /**
     * 显示订单列表 --弹窗
     */
    function showWin(v, m){
        var org_id  = m.record.data.org_id;
        var org_name = m.record.data.org_name;
        v = !org_id ? v : "<a href='javascript:;' onclick='getOrderList(\"o_worg_id\", "+org_id+", \""+org_name+"\");' style='color:blue;text-decoration：none;'>"+v+"</a>";
        return v;
    }

    //弹窗显示--订单列表
    window.getOrderList = function(org_type, worg_id, org_name){
        var order_start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var order_end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var order_time_type = Ext.getCmp('time_type').getValue();
        var time_type = order_time_type == '出团日期' ? 'o_start_date' : 'o_sell_time';

        var url = $__app__ + '/OrderAdmin/seller?org_id='+worg_id;
        url += "&time_type=" + time_type;
        url += "&order_start_time=" + order_start_time;
        url += "&order_end_time=" + order_end_time;
        url += "&t_type=1&t_org_id=" + org_id;

        if ( !prepay_window ) {
            prepay_window = new Ext.Window({
                width: Ext.getBody().getWidth() - 50,
                height: Ext.getBody().getHeight() - 50,
                closeAction: 'hide',
                modal: true,
                html: '<iframe  frameborder="0" id="order_list" name="order_list" style="width: 100%; height: 100%;" ></iframe>',
            });
        }
        prepay_window.setTitle( org_name );
        prepay_window.show();
        setTimeout(function () {
            window.order_list.location = url;
        }, 100);
    };

    //获取分销商数链接
    function goBuyerList(v, m){
        var org_id  = m.record.data.org_id;
        var org_name = m.record.data.org_name;
        v = (!org_id || gone)  ? v : "<a href='javascript:;' onclick='getBuyerList("+org_id+", \""+org_name+"\");' style='color:blue;text-decoration：none;'>"+v+"</a>";
        return v;
    }

    //点击分销商数跳转到分销商汇总
    window.getBuyerList = function(org_id, org_name){
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var time_type = Ext.getCmp('time_type').getValue();

        var open_title = '【供】'+org_name+'的';
        var open_id    = "SbCountSupplier_"+Math.round(Math.random()*1000);

        var url = $__app__ + '/ProductCount/reseller?org_id='+org_id;
        url += "&time_type=" + encodeURI(time_type);
        url += "&start_time=" + encodeURI(start_time);
        url += "&end_time=" + encodeURI(end_time);
        url += "&open_title=" + encodeURI(open_title);

        parent.OpenTab(open_title+'分销商汇总', open_id, '', url, 1);
    }

    //供应商汇总-->产品汇总
    function goProductList(v, m){
        var org_id  = m.record.data.org_id;
        var org_name = m.record.data.org_name;
        v = !org_id ? v : "<a href='javascript:;' onclick='getProductList("+org_id+", \""+org_name+"\");' style='color:blue;text-decoration：none;'>"+v+"</a>";
        return v;
    }

    //点击跳向产品汇总报表
    window.getProductList = function(worg_id, org_name){
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        var time_type = Ext.getCmp('time_type').getValue();

        var open_title = '【供】'+org_name+'的';
        var open_id    = "SbCountSupplier_"+Math.round(Math.random()*1000);

        var url = $__app__ + '/ProductCount/index?org_id='+worg_id;
        url += "&t_type=1";
        url += "&t_org_id=" + org_id;
        url += "&time_type=" + encodeURI(time_type);
        url += "&start_time=" + encodeURI(start_time);
        url += "&end_time=" + encodeURI(end_time);
        url += "&open_title=" + encodeURI(open_title);

        parent.OpenTab(open_title + '产品汇总', open_id, '', url, 1);

    }
    //*********************************** function end ****************
});
