
var current_row = {}; //（左侧）当前选中行
var group_type = '按线路查询'; //查询类型，默认按线路
var cm_product = new  Array();
var cm_station = new  Array();
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '接送统计';
    var url = $__app__ + '/TransferNew/getListData';
    var field = [];
    //var store = SUNLINE.JsonStore(url, field,true,{pageSize: 100000});
    var store = SUNLINE.GroupingStore(url,field,{groupField:'s_type'},true,{},100000);
    cm_product = [
        {text: '', dataIndex: '', width: 50},
        {text: '接送类型', dataIndex: 's_type', hidden: true},
        {text: '线路名称', dataIndex: 's_stname', width: 400},
        {text: '线路编号', dataIndex: 's_sttime', width: 150},
        {text: '接送人数', dataIndex: 's_count', width: 150},
    ];
    cm_station = [
        {text: '', dataIndex: '', width: 50},
        {text: '接送类型', dataIndex: 's_type', hidden: true},
        {text: '时间', dataIndex: 's_sttime',align:'center', width: 60},
        {text: '接送站点', dataIndex: 's_stname', width: 400},
        {text: '接送人数', dataIndex: 's_count', width: 150},
    ];
    var group_features = Ext.create('Ext.grid.feature.Grouping', {
        groupHeaderTpl: ['', '{columnName}: {name:this.formatName} (共 {[values.rows.length]} 条)', {
            formatName: function (v) {
                var group_field = store.getConfig('groupField');
                switch (group_field) {
                    case 's_type':
                        return v;
                }
            }
        }],
        startCollapsed: false
    });

    //接送类型
    var goto_type = SUNLINE.LocalComob({
        id: 'goto_type',
        fields: ['id', 'text'],
        data: [
            {id: 0, text: '全部'},
            {id: 1, text: '去程'},
            {id: 2, text: '返程'}
        ],
        config: {
            fieldLabel: '接送类型',
            editable: false,
            valueField: 'text',
            displayField: 'text',
            id: 'goto_type',
            name: 'goto_type',
            labelWidth: 60,
            labelAlign: 'right',
            width: 130,
            value: '全部',
        }
    });

    //接送日期
    var goto_date = SUNLINE.ExtDateField({
        id:'start_time',
        name:'start_time',
        labelAlign:"right",
        fieldLabel:'接送日期',
        labelWidth: 60,
        width:170,
        value: new Date()
    });

    //出团日期checkbox
    var start_date_box = new Ext.form.Checkbox({
        id:'follow_date',
        boxLabel:'仅关注出团日期',
        inputValue:1,
        checked:false,
        listeners:{
            change:function(i){
                var bool = Ext.getCmp('follow_date').getValue();
                if(bool){
                    Ext.getCmp('goto_type').setDisabled(true);
                }else{
                    Ext.getCmp('goto_type').setDisabled(false);
                }
            }
        }
    });

    //供应商列表
    var company_box = SUNLINE.CompanyBox();
    company_box.store.on({
        beforeload:function(store,options){
            Ext.apply(store.proxy.extraParams, {org_type:'供应商'});
        },
        load:function(){
            company_box.store.add({id:0,text:'全部供应商'});
            company_box.store.sort({property : 'id',direction: 'ASC'});
        }
    });
    if(_uinfo.org_type=='管理公司'){
        company_box.setValue('全部供应商');
    }else{
        company_box.setHidden(true);
        company_box.setDisabled(true);
    }

    //左边 表格渲染数据列表
    var grid_left = Ext.create('Ext.grid.Panel', {
        region : 'west',
        border:false,
        store: store,
        columns: cm_product,
        width:760,
        split: {size: 3},
        forceFit: false, //列宽自适应
        features: [group_features],
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: {
            xtype: "container",
            border: false,
            items: [
                {
                    xtype: "toolbar",
                    items: [
                        goto_type,
                        goto_date,
                        start_date_box,
                        {
                            id: 'search_key',
                            name: 'search_key',
                            xtype: 'textfield',
                            labelWidth: 50,
                            width: 270,
                            fieldLabel: "&nbsp;关键字",
                            emptyText: '请输入线路名称、线路编号查询'
                        },
                    ]
                },
                {
                    xtype: "toolbar",
                    items: [
                        company_box,
                        {
                            text: '按线路查询',
                            iconCls: 'button-sch',
                            toggleGroup: 'btnGroup',
                            pressed:true,
                            handler: doSearch
                        },
                        {
                            text: '按站点查询',
                            iconCls: 'button-sch',
                            toggleGroup: 'btnGroup',
                            pressed:false,
                            handler: doSearch
                        },
                        {text: '打印', iconCls: 'button-print', handler: doPrintWin},
                        {text: '导出', iconCls: 'button-article', handler: doExcel},
                        {
                            text: '刷新', iconCls: 'button-ref', handler: function () {
                            store.reload();
                        }
                        },
                    ]
                }]
        }

    });

    //右边 表格渲染数据列表
    var right_url = $__app__ + '/TransferNew/getListDataUsers';
    var right_field = [];
    var right_store = SUNLINE.GroupingStore(right_url,right_field,{groupField:'group_field'},false,{},100000);
    var right_group_features = Ext.create('Ext.grid.feature.Grouping', {
        groupHeaderTpl: ['', '{name:this.formatName} (共 {[values.rows.length]} 条)', {
            formatName: function (vv) {
                var group_field = right_store.getConfig('groupField');
                switch (group_field) {
                    case 'group_field':
                        return vv;
                }
            }
        }],
        startCollapsed: false
    });
    var right_cm = [
        new Ext.grid.RowNumberer({width:50,align:'center'}),
        {text: '姓名', dataIndex: 's_vip_name',width:110},
        {text: '手机号', dataIndex: 's_vip_mob',width:150},
        {text: '订单号', dataIndex: 's_o_number',width:150,renderer:orderNumber},
    ];
    var grid_right = Ext.create('Ext.grid.Panel', {
        region : 'center',
        border:false,//无边框
        store: right_store,
        columns: right_cm,
        forceFit: false, //列宽自适应
        features: [right_group_features],
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: [
            '->',
            '快速搜索:',
            {
                id:'search_right_key',
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                emptyText : '姓名、手机',
                width:200,
                onTriggerClick:function(e){
                    right_store.currentPage=1;
                    doSearchUsers();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13) {
                            right_store.currentPage = 1;
                            doSearchUsers();
                        }
                    }
                }
            },
            {text: '刷新', iconCls: 'button-ref', handler: function () {right_store.reload();}},
            '-',
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('接送统计')}},
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler: function () {
                    window.location.reload();
                }
            }
        ],
    });

    grid_left.on('select',function(m,v,i){
        console.log(v.data);
        var row = v.data;
        //var type = Ext.getCmp('button_search').getText();
        var params = {};
        params.group_type = group_type;
        params.s_pid = row.p_id;
        params.s_date = row.s_date;
        params.s_type = row.s_type;
        params.s_sttime = row.s_sttime;
        params.s_stid = row.s_stid;
        params.s_ids = row.s_ids.join(',');
        current_row = params;
        SUNLINE.baseParams(right_store, params);
        right_store.currentPage = 1;
        right_store.load();
    });

    //面板
    var panel_main = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'border',
        items: [grid_left, grid_right]
    })

    Ext.create('Ext.Viewport',{
        layout : 'border',
        items : [panel_main]
    });

    function orderNumber(v,m,r){
        var url = $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/seller';
        return '<a href="'+url+'" target="_blank">'+v+'</a>';
    }

    /**
     * 搜索方法
     */
    function doSearch(b) {
        b.toggle(true);
        var params = {};
        if(b.text == '按线路查询' || b.text == '按站点查询') {
            group_type = b.text;
            params.group_type = b.text;
            var empty_text;
            if(b.text == '按线路查询'){
                empty_text = '请输入线路名称、线路编号查询';
                grid_left.reconfigure(store,cm_product);
            }else{
                grid_left.reconfigure(store,cm_station);
                empty_text = '请输入站点名称查询';
            }
            Ext.getCmp('search_key').inputEl.dom.placeholder = empty_text;
        }
        var worg = company_box.getValue();
        if(!isNaN(worg) && worg>0){
            params.s_worg_id = worg;
        }
        params.goto_type = Ext.getCmp('goto_type').getValue();
        params.follow_date = Ext.getCmp('follow_date').getValue() ? 1 : 0;
        if(params.follow_date){
            params.goto_type = '去程';
        }
        params.start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        params.keywords = Ext.getCmp('search_key').getValue();
        SUNLINE.baseParams(store, params);
        store.currentPage = 1;
        store.load();
        right_store.loadData({});
    }

    /**
     * 导出excel
     */
    function doExcel(){
        var url = 'group_type=' + group_type;
        var worg = company_box.getValue();
        if(!isNaN(worg) && worg>0){
            url += '&s_worg_id=' + worg;
        }
        var goto_type = Ext.getCmp('goto_type').getValue();
        if(Ext.getCmp('follow_date').getValue()){
            goto_type = '去程';
        }
        url += '&goto_type=' + goto_type;
        url += '&start_time=' + Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        url += '&keywords=' + Ext.getCmp('search_key').getValue();

        window.location = $__app__+'/TransferNew/getlistDataExcel?'+url;
    }

    /*打印处理窗口(start)*/
    var cd_win = new Ext.Window({
        title:'接送统计打印',
        width:810,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="810" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doPrint, id:'doprint_btn'},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });

    cd_win.on("show",function(){
        var url = 'group_type=' + group_type;
        var worg = company_box.getValue();
        if(!isNaN(worg) && worg>0){
            url += '&s_worg_id=' + worg;
        }
        var goto_type = Ext.getCmp('goto_type').getValue();
        if(Ext.getCmp('follow_date').getValue()){
            goto_type = '去程';
        }
        url += '&goto_type=' + goto_type;
        url += '&start_time=' + Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        url += '&keywords=' + Ext.getCmp('search_key').getValue();

        window.ifm_print.location = $__app__+'/TransferNew/getlistDataPrint?'+url;
    });

    /**
     * 打印信息窗口
     */
    function doPrintWin(){
        cd_win.show();
        cd_win.setTitle('接送统计打印');
    }

    /**
     * 打印
     */
    function doPrint() {
        window.ifm_print.focus();
        window.ifm_print.print();
    }

    /**
     * 游客搜索
     */
    function doSearchUsers(){
        var params = current_row;
        params.keywords = Ext.getCmp('search_right_key').getValue();
        SUNLINE.baseParams(right_store, params);
        right_store.currentPage = 1;
        right_store.load();
        right_store.loadData({});
    }

});