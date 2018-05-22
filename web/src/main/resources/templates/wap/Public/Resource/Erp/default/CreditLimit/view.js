/**
 * Created by cjl on 2017/8/16.
 */


Ext.onReady(function () {
    var pageSize = 20;

    //左侧信用卡片列表
    var left_url = $__app__ + '/CreditLimit/getSupplierList';
    var left_store = SUNLINE.JsonStore(left_url, [],false);
    SUNLINE.baseParams(left_store, {org_id:_uinfo.org_id});
    left_store.currentPage = 1;
    left_store.load();

    var cardTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<li class="cardTpl default" onclick="getCreditItemList({org_id},{cl_sorg_id}, this)">',
            '<div class="title clearfloat">',
                '<div class="peoImg pull-left"><img src="{org_logo}?x-oss-process=image/resize,m_fill,h_50,w_50"></div>',
                '<div class="classify pull-left">',
                    '<h3>{org_name}</h3>',
                    '<p>{org_type}</p>',
                '</div>',
            '</div>',
            '<div class="detail clearfloat">',
                '<div class="pull-left">',
                    '<p>结算</p>',
                    '<p><span>{cl_cycle}</span>/<span>{cl_day}</span></p>',
                '</div>',
                '<div class="pull-right">',
                    '<p>余额/额度</p>',
                    '<p><span>{cl_balance}</span>/<span>{cl_money}</span></p>',
                '</div>',
            '</div>',
        '</li>',
        '</tpl>'
    );

    //信用卡片小模板
    var cardList = Ext.create('Ext.view.View', {
        store: left_store,
        tpl: cardTpl,
        itemSelector: 'li.cardTpl',
        border: false,
        autoScroll:true,
        layout : 'border',
        deferEmptyText: false,
        emptyText:'<span class="empty-text">没有授信信息</span>',
    });

    var is_hide = _uinfo.org_type != '管理公司' ? true : false;
    //所属单位
    var company_box = SUNLINE.CompanyBox({
        fields:['id','text','org_bh'],
        config:{
            disabled: is_hide,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:300,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            },
        }
    });
    company_box.on('select',function(c, r){
        var org_id = r[0]['id'];
        SUNLINE.baseParams(left_store, {org_id: org_id});
        left_store.currentPage = 1;
        left_store.load();
    });

    //信用卡片面板
    var left_panel = Ext.create('Ext.form.Panel', {
        width: 470,
        autoScroll: true,
        region: 'west',
        split:{size: 3},
        tbar:[company_box],
        items:[cardList],
    });

    //右侧----信用额度消费明细列表*************************************************
    var right_cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header:"收支类型", dataIndex:"crl_type", width:100},
        {header:"交易金额", dataIndex:"crl_amount", width:100, align:'right',renderer: money},
        {header:"账单编号", dataIndex:"crl_bill_no", width:150},
        {header:"结算状态", dataIndex:"crl_status", width:100, renderer: setStatus},
        {header:"账单日", dataIndex:"crl_bill_day", width:100},
        {header:"出团日期", dataIndex:"crl_start_date", width:100},
        {header:"交易日期", dataIndex:"crl_create_time", width:100},
        {header:"操作者", dataIndex:"crl_uname", width:100},
        {header:"订单编号", dataIndex:"crl_trade_no", width:150, renderer: getLink},
        {header:"交易详情", dataIndex:"crl_body", width:300}
    ];

    var right_url = $__app__ + '/CreditLimit/getCreditList';
    var right_store = SUNLINE.JsonStore(right_url, [],false);

    //收支类型
    var crl_type = SUNLINE.LocalComob({
        id: 'crl_type',
        fields: ['crl_type'],
        data: [['全部'],['支出'], ['收入']],
        config: {
            allowBlank: true,
            id: 'crl_type',
            width: 65,
            labelWidth:0,
            labelAlign: 'right',
            fieldLabel: "",
            value: '全部'
        }
    });

    //查询日期类型
    var time_type = SUNLINE.LocalComob({
        id: 'time_type',
        fields: ['time_type'],
        data: [['账单日期'],['出团日期'], ['交易日期']],
        config: {
            allowBlank: true,
            id: 'time_type',
            labelWidth: 0,
            width: 105,
            labelAlign: 'right',
            fieldLabel: "&nbsp;&nbsp;",
            labelSeparator:'',
            value: '账单日期'
        }
    });
    //开始日期
    var start_date = SUNLINE.ExtDateField({
        id: 'start_time',
        labelWidth: 0,
        fieldLabel: "&nbsp;",
        labelAlign: "right",
        width: 110,
        gang: 'end_time',
        start: true,
        value:'',
        allowBlank: true,
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
        value:'',
        allowBlank: true,
    });

    var rightForm = Ext.create('Ext.grid.Panel', {
        region: 'center',
        columns: right_cm,
        store: right_store,
        border: false,
        autoScroll: true,
        tbar:[
            crl_type,
            time_type,
            start_date,
            end_date,
            {xtype:'hidden',value:0, id:'worg_id'},
            {xtype:'hidden',value:0, id:'sorg_id'},
            {text: '查询',iconCls: 'button-sch',handler: function () { doSearch();},},
            {text: '导出', iconCls: 'button-article', id: 'add_id', handler: doExcel},
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'skey',
                emptyText: '账单编号、订单编号',
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
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载信用明细数据',
                handler: function () {
                    window.location.reload();
                }
            },
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
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:right_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'额度授信信息'
        }),
        viewConfig: {deferEmptyText: false, emptyText: '暂无信用消费明细'},
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        region : 'center',
        border : false,
        layout : 'border',
        items: [left_panel,rightForm],
    });

    //*********************************** function start **************
    //供应商汇总搜索
    function doSearch(){
        //1. 获取所有的搜索条件
        var search_params = getSearchParams();
        //2. 重新加载数据
        SUNLINE.baseParams(right_store, search_params);
        right_store.currentPage = 1;
        right_store.load();
    }

    //导出excel
    function doExcel() {
        //1. 获取所有的搜索条件
        var search_params = getSearchParams();

        //把搜索条件拼接到url
        var params = 'org_id='+ search_params.org_id
            +'&cl_sorg_id=' + search_params.cl_sorg_id
            +'&crl_type=' + search_params.crl_type
            +'&time_type=' + search_params.time_type
            + '&start_time=' + search_params.start_time
            + '&end_time=' + search_params.end_time
            + '&skey=' + search_params.skey;
        window.location = $__app__ + '/CreditLimit/getCreditLimitExcel?' + params;
    }

    //查询或导出时接收的搜索条件
    function getSearchParams(){
        //1. 接收搜索条件
        var crl_type = Ext.getCmp('crl_type').getValue();
        var time_type = Ext.getCmp('time_type').getValue();
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Ymd');
        var end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Ymd');
        var skey = Ext.getCmp('skey').getValue(); //账单编号、订单编号
        var org_id = Ext.getCmp('worg_id').getValue(); //当前供应商ID
        var sorg_id = Ext.getCmp('sorg_id').getValue(); //当前分销商ID

        //2. 拼接搜索条件
        var search_params = {
            org_id: org_id,
            cl_sorg_id: sorg_id,
            crl_type: crl_type,
            time_type: time_type,
            start_time: start_time,
            end_time: end_time,
            skey: skey
        };
        console.log( search_params );
        return search_params;
    }

    //把结算状态中的“待付款”改成“待结算”
    function setStatus(v) {
        return v == '待付款' ? '待结算' : v;
    }

    //点击信用卡片，获取信用明细数据
    window.getCreditItemList = function( org_id, cl_sorg_id, _this){
        $(_this).removeClass('default').addClass('active');
        $(_this).siblings().removeClass('active').addClass('default');

        //明细搜索条件恢复
        Ext.getCmp('crl_type').setValue('全部');
        Ext.getCmp('time_type').setValue('账单日期');
        Ext.getCmp('start_time').setValue('');
        Ext.getCmp('end_time').setValue('');

        //记录当前点击供应商
        Ext.getCmp('worg_id').setValue(org_id);
        Ext.getCmp('sorg_id').setValue(cl_sorg_id);
        //重新加载信用明细
        SUNLINE.baseParams(right_store, {org_id:org_id, cl_sorg_id: cl_sorg_id});
        right_store.currentPage = 1;
        right_store.load();
    }

    //添加订单链接
    function getLink(v){
        return '<a href="javascript:;" style="color:blue;" onclick="UrlOrderDetail(&quot;'+v+'&quot;)">'+v+'</a>'
    }

    //订单详情页面跳转
    window.UrlOrderDetail=function(v){
        var org_type = _uinfo.org_type == '管理公司' ? 'seller ' : 'buyer';
        parent.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/'+org_type, 1);
    };
    //*********************************** function end **************
});
