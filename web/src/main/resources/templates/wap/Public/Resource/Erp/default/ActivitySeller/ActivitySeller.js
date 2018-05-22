Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '分销商活跃度';
    var url = $__app__ + '/ActivitySeller/getListData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);
    var cm = [
        new Ext.grid.RowNumberer(),
        {text: 'ID', dataIndex: 'org_id', hidden: true},
        {text: '省份', dataIndex: 'org_province'},
        {text: '城市', dataIndex: 'org_city'},
        {text: '单位数', dataIndex: 'org_count'},
        {text: '有订单的单位数', dataIndex: 'order_org_count'},
        {text: '用户数', dataIndex: 'user_count'},
        {text: '订单数', dataIndex: 'order_count'},
        {text: '订单金额', dataIndex: 'order_money'}
    ];

    //支付类型
    var pay_type_box = SUNLINE.LocalComob({
        id: 'pay_type',
        fields: ['id', 'text'],
        data: [
            {id: 0, text: '全部类型'},
            {id: 1, text: '在线交易'},
            {id: 2, text: '线下交易'},
            {id: 3, text: '未付款'}
        ],
        config: {
            fieldLabel: '支付类型',
            editable: false,
            valueField: 'id',
            displayField: 'text',
            id: 'pay_type',
            name: 'pay_type',
            labelWidth: 60,
            labelAlign: 'right',
            width: 180,
            value: '全部类型',
            listeners:{
                select:function(){
                    doSearch();
                }
            }
        }
    });

    //有供应商的省份、城市列表
    var area_url = $__app__ + '/ActivitySeller/getAreaList';
    var area_field = [];
    var area_store = SUNLINE.JsonStore(area_url, area_field);
    var area_city_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var box_province = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_province',
        fieldLabel: '省份',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择省份',
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_city').setValue('');
                area_city_store.loadData(r[0].get('data'));
            }
        }
    });
    var box_city = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_city',
        fieldLabel: '城市',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_city_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择城市'
    });

    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        forceFit: true, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: [
            pay_type_box,
            box_province,
            box_city,
            {text: '查询', iconCls: 'button-sch', handler: doSearch},
            {text: '导出', iconCls: 'button-article', handler: doExcel},
            {text: '刷新', iconCls: 'button-ref', handler: function () {store.reload();}},
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler: function () {
                    window.location.reload();
                }
            }
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            items:[
                '-',
                {xtype:'tbtext',id:'total_cid',text:''},
                '-',
                {xtype:'tbtext',id:'total_coid',text:''},
                '-',
                {xtype:'tbtext',id:'total_uid',text:''},
                '-',
                {xtype:'tbtext',id:'toal_oid',text:''},
                '-',
                {xtype:'tbtext',id:'total_mid',text:''}
            ],
            emptyMsg: '没有数据'
        }),
        renderTo: Ext.getBody()
    });

    store.on('load',function(t){
        var total_all = t.proxy.reader.rawData.total_all;
        Ext.getCmp('total_cid').setText('单位总数：' + total_all.org_count);
        Ext.getCmp('total_coid').setText('有订单的单位总数：' + total_all.order_org_count);
        Ext.getCmp('total_uid').setText('用户总数：' + total_all.user_count);
        Ext.getCmp('toal_oid').setText('订单总数：' + total_all.order_count);
        Ext.getCmp('total_mid').setText('订单总金额：' + total_all.order_money);
    })

    Ext.create('Ext.Viewport',{
        layout : 'border',
        items : [grid]
    });

    function orgOrderCount(v,m,r){
        var org_order_count = 0;
        var org_id = r.get('org_id');
        if(org_id){
            org_order_count = org_id.split(',').length;
        }
        return org_order_count;
    };

    /**
     * 搜索方法
     */
    function doSearch() {
        var search_pay_type = Ext.getCmp('pay_type').getValue();
        var search_province = Ext.getCmp('search_org_province').getValue();
        var search_city = Ext.getCmp('search_org_city').getValue();
        var search_params = {
            pay_type: search_pay_type,
            province: search_province,
            city: search_city,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    /**
     * 导出excel
     */
    function doExcel(){
        var url = '';
        url += 'pay_type=' + Ext.getCmp('pay_type').getValue();
        var search_province = Ext.getCmp('search_org_province').getValue();
        if(search_province !== null){
            url += '&province=' + search_province;
        }
        var search_city = Ext.getCmp('search_org_city').getValue();
        if(search_city !== null){
            url += '&city=' + search_city;
        }
        window.location = $__app__+'/ActivitySeller/getlistDataExcel?'+url;
    }

});