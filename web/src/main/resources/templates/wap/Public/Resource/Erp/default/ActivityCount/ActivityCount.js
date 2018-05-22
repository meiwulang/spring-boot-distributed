
//选中大区包含的省份直接作为参数传递后端，避免在后端再次查询
var area_pro_arr;
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '活跃度报表';
    var url = $__app__ + '/ActivityCount/getListData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);
    SUNLINE.baseParams(store, {action_type:action_type,province:reload_province,city:reload_city});
    store.load();
    if(action_type == 3){
        var do_width = 170;
    }else{

        var do_width = 90;
    }
    if(action_type == 2){
        var tablename = '供应商活跃度报表';
    }else{
        var tablename = '分销商活跃度报表';
    }
    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {text: 'ID', dataIndex: 'org_id', hidden: true},
        {text: '省份', dataIndex: 'org_province',width:110},
        {text: '城市', dataIndex: 'org_city',width:110},
        {text: '区/县', dataIndex: 'org_county',width:110,hidden:hidden_bool},
        {text: '单位数', dataIndex: 'org_count',width:90,align:'right'},
        {text: '有订单的单位数', dataIndex: 'order_org_count',width:130,align:'right'},
        {text: '有订单的用户数', dataIndex: 'order_user_count',width:130,align:'right',hidden:order_user_count},
        {text: '用户数', dataIndex: 'user_count',width:90,align:'right'},
        {text: '订单数', dataIndex: 'order_count',width:90,align:'right'},
        {text: '订单金额', dataIndex: 'order_money',width:140,align:'right', renderer:money},
        {text: '操作', dataIndex: 'detail_btn',width:do_width,align:'center', renderer:detailBtn}
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
            width: 155,
            value: '全部',
        }
    });
    //日期搜索
    var search_date_box = SUNLINE.LocalComob({
        id: 'search_date',
        fields: ['id', 'text'],
        data: [
            {id: 0, text: '全部'},
            {id: 1, text: '出团日期'},
            {id: 2, text: '交易日期'},
            {id: 3, text: '注册日期'}
        ],
        config: {
            fieldLabel: '日期筛选',
            editable: false,
            valueField: 'id',
            displayField: 'text',
            id: 'search_date',
            name: 'search_date',
            labelWidth: 60,
            labelAlign: 'right',
            width: 155,
            value: '全部',
            listeners:{
                select:function(c,r){
                    var cur_row = r[0];
                    var cur_id = cur_row.get('id');
                    if(cur_id == 0){ //全部类型
                        Ext.getCmp('start_time').setDisabled(true);
                        Ext.getCmp('end_time').setDisabled(true);
                        Ext.getCmp('start_time').setValue('');
                        Ext.getCmp('end_time').setValue('');
                    }else{
                        Ext.getCmp('start_time').setDisabled(false);
                        Ext.getCmp('end_time').setDisabled(false);
                    }
                }
            }
        }
    });

    //有供应商的省份、城市列表
    var area_large_url = $__app__ + '/ActivityCount/getLargeAreaList';
    var area_large_field = [];
    var area_large_store = SUNLINE.JsonStore(area_large_url, area_large_field);
    var area_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var area_city_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var area_county_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var box_large_area = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_area',
        fieldLabel: '大区',
        labelWidth: 60,
        labelAlign: 'right',
        store: area_large_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 155,
        editable: false,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                Ext.getCmp('search_org_county').setValue('');
                area_store.loadData(r[0].get('data'));
                area_pro_arr = ''; //重置
                Ext.each(r[0].get('data'),function(v){
                    if(area_pro_arr) {
                        area_pro_arr += ',' + v.name;
                    }else{
                        area_pro_arr = v.name;
                    }
                });
            }
        }
    });
    var box_province = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_province',
        fieldLabel: '省份',
        labelWidth: 60,
        labelAlign: 'right',
        store: area_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 155,
        editable: false,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_city').setValue('');
                Ext.getCmp('search_org_county').setValue('');
                area_city_store.loadData(r[0].get('data'));
                area_pro_arr = '';
            }
        }
    });
    if(hidden_bool === true){
        var city_colspan = 3;
    }else{
        var city_colspan = 0;
    }
    var box_city = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_city',
        fieldLabel: '城市',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_city_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 150,
        editable: false,
        colspan:city_colspan,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_county').setValue('');
                var data_arr = new Array();
                Ext.each(r,function(v2){
                    Ext.each(v2.get('data'),function(v3){
                        data_arr.push(v3);
                    });
                });
                area_county_store.loadData(data_arr);
            }
        }
    });
    var box_county = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_county',
        fieldLabel: '区/县',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_county_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 160,
        multiSelect:multi_select,
        colspan:2,
        editable: false
    });
    if(hidden_bool === true){
        Ext.getCmp('search_org_county').setHidden(true);
    }else{
        Ext.getCmp('search_org_county').setHidden(false);
    }
    if(reload_province || reload_city){
        box_large_area.setDisabled(true);
        box_province.setDisabled(true);
        box_city.setDisabled(true);
        box_province.setValue(reload_province);
        box_city.setValue(reload_city);
        area_large_store.load(function(){
            var one_flag = true;
            area_large_store.each(function(r,i){
                var cur_city_data; //当前省份对应的城市数据
                Ext.each(r.get('data'),function(r1){
                    if(r1.name == reload_province){
                        box_large_area.setValue(r.get('name')); //设置省份对应的 大区
                        cur_city_data = r1.data; //省份对应的城市
                        one_flag = false;
                        return false;
                    }
                });
                Ext.each(cur_city_data,function(r2){
                    if(r2.name == reload_city){
                        area_county_store.loadData(r2.data); //加载城市对应的区县
                        return false;
                    }
                });
                if(one_flag === false){
                    return false;
                }
            });
        })
    }else{
        box_large_area.setDisabled(false);
        box_province.setDisabled(false);
        box_city.setDisabled(false);
    }
    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        forceFit: false, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: [
            {
                xtype: 'buttongroup',
                id: 'search_form',
                title: '<span style="float:left;font-weight: bold">'+search_title+'</span><span style="float:right">查询条件选择</span>',
                height: 82,
                columns: 8,
                items: [
                    pay_type_box,
                    search_date_box,
                    SUNLINE.ExtDateField({
                        id:'start_time',
                        name:'start_time',
                        labelAlign:"right",
                        fieldLabel:false,
                        labelSeparator:'',
                        width:140,
                        disabled:true,
                        style:'margin-left:10px;',
                        gang:'end_time',
                        start:true
                    }),
                    {xtype:'tbtext',text:'~',width:20,height:29,style:'line-height:26px;text-align:center'},
                    SUNLINE.ExtDateField({
                        id:'end_time',
                        name:'end_time',
                        labelAlign:"right",
                        fieldLabel:false,
                        labelSeparator:'',
                        width:140,
                        disabled:true,
                        gang:'start_time'
                    }),
                    {text: '刷新', iconCls: 'button-ref', handler: function () {store.reload();}},
                    {
                        text: '重载',
                        icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                        cls: 'x-btn-icon',
                        tooltip: '重载' + thisTitle,
                        handler: function () {
                            window.location.reload();
                        }
                    },
                    {text: '帮助', icon: $app_public_images_path + 'b_help.png',style: 'margin-left:5px',cls:'x-btn-icon', handler: function () {help(tablename);}},
                    box_large_area,
                    box_province,
                    box_city,
                    box_county,
                    {text: '查询', iconCls: 'button-sch', handler: doSearch, style: 'margin-right:5px'},
                    {text: '导出', iconCls: 'button-article', handler: doExcel},
                    {text:'',xtype:'tbtext'}
                ]
            }
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        renderTo: Ext.getBody()
    });

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

    function detailBtn(v, m, r){
        var province = r.data.org_province;
        var city = r.data.org_city;
        var county = r.data.org_county;
        if(province == '全部合计：' || province == '本页合计：'){
            return '';
        }
        var html = "<a style='text-underline: none;' href='javascript:;' onclick=urlActivityDetail('"+province+"','"+city+"','"+county+"')>汇总详情</a>";
        if(action_type == 3){
            html += "<a style='margin-left:10px' href='javascript:;' onclick=urlActivityDetailCity('"+province+"','"+city+"')>区县详情</a>";
        }
        return html;
    }

    window.urlActivityDetailCity = function(p,c){
        var prefix = (p == c) ? p : p+c;
        var open_title = prefix + '分销商活跃度报表(区县)';
        var open_id = 'indexSeller'+p+c;
        var open_url = $__app__+'/ActivityCount/indexSeller/province/'+p+'/city/'+c;
        parent.OpenTab(open_title, open_id, '', open_url, 1);
    }

    window.urlActivityDetail = function(p,c,a){
        var prefix = (p == c) ? p : p+c;
        var open_title = prefix+'供应商汇总';
        var open_id = 'ProductCountSupplier'+p+c;
        var open_type = 'supplier';
        var open_url = $__app__+'/ProductCount/'+open_type+'/open_type/'+open_type+'/province/'+p+'/city/'+c;
        if(action_type == 1){
            open_title = prefix+a+'分销商汇总';
            open_id = 'ProductCountSeller'+p+c+a;
            open_type = 'reseller'; //保持同原有代码一致
            open_url = $__app__+'/ProductCount/'+open_type+'/open_type/'+open_type+'/province/'+p+'/city/'+c+'/county/'+a;
        }else if(action_type == 3){
            open_title = prefix+'分销商汇总';
            open_id = 'ProductCountSeller'+p+c;
            open_type = 'reseller'; //保持同原有代码一致
            open_url = $__app__+'/ProductCount/'+open_type+'/open_type/'+open_type+'/province/'+p+'/city/'+c;
        }
        parent.OpenTab(open_title, open_id, '', open_url, 1);
    }

    /**
     * 搜索方法
     */
    function doSearch() {
        var search_pay_type = Ext.getCmp('pay_type').getValue();
        var search_province = reload_province ? reload_province : Ext.getCmp('search_org_province').getValue();
        var search_city = reload_city ? reload_city : Ext.getCmp('search_org_city').getValue();
        var search_date_type = Ext.getCmp('search_date').getValue();
        var search_start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        var search_end_time = Ext.Date.format(Ext.getCmp('end_time').getValue(),'Y-m-d');
        var search_params = {
            pay_type: search_pay_type,
            area: area_pro_arr,
            province: search_province,
            city: search_city,
            date_type: search_date_type,
            start_time: search_start_time,
            end_time: search_end_time,
            action_type: action_type,
        };
        if(action_type == 1) {
            var search_county = box_county.getValue();
            search_params.county = search_county.join(',');
        }
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    /**
     * 导出excel
     */
    function doExcel(){
        var url = 'action_type=' + action_type;
        url += '&pay_type=' + Ext.getCmp('pay_type').getValue();
        url += '&date_type=' + Ext.getCmp('search_date').getValue();
        url += '&start_time=' + Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        url += '&end_time=' + Ext.Date.format(Ext.getCmp('end_time').getValue(),'Y-m-d');
        var search_area = Ext.getCmp('search_org_area').getValue();
        if(search_area !== null){
            url += '&area=' + area_pro_arr;
        }
        var search_province = reload_province ? reload_province : Ext.getCmp('search_org_province').getValue();
        if(search_province !== null && search_province != ''){
            url += '&province=' + search_province;
        }
        var search_city = reload_city ? reload_city : Ext.getCmp('search_org_city').getValue();
        if(search_city !== null && search_city != ''){
            url += '&city=' + search_city;
        }
        if(action_type == 1) {
            url += '&county=' + box_county.getValue().join(',');
        }
        window.location = $__app__+'/ActivityCount/getlistDataExcel?'+url;
    }

});