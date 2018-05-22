Ext.onReady(function() {
    var pageSize = 100;
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url = $__app__ + '/RegionCount/orderDataJson';
    var field = [];
    var store = new SUNLINE.JsonStore(url, field, true,{pageSize:pageSize});


    /**    数据  ***/

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
    var box_large_area = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_area',
        fieldLabel: '大区',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_large_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 150,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                area_store.loadData(r[0].get('data'));
                area_pro_arr = ''; //重置
                Ext.each(r[0].get('data'),function(v){
                    if(area_pro_arr) {
                        area_pro_arr += ',' + v.name;
                    }else{
                        area_pro_arr = v.name;
                    }
                });
            },
            change:function(t,n,o,opt){
                var r = t.valueModels;
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                if(r && r.length >0 ) {
                    area_store.loadData(r[0].get('data'));
                    area_pro_arr = ''; //重置
                    Ext.each(r[0].get('data'), function (v) {
                        if (area_pro_arr) {
                            area_pro_arr += ',' + v.name;
                        } else {
                            area_pro_arr = v.name;
                        }
                    });
                }
            }
        }
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
        emptyText: '请选择',
        disabled:true,
        width: 150,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_city').setValue('');
                area_city_store.loadData(r[0].get('data'));
                area_pro_arr = '';
            },
            change:function(t,n,o,opt){
                var r = t.valueModels;
                if(r && r.length >0 ){
                    Ext.getCmp('search_org_city').setValue('');
                    area_city_store.loadData(r[0].get('data'));
                    area_pro_arr = '';
                }
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
        emptyText: '请选择',
        width: 150,
        disabled:true
    });

    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有订单信息',
            deferEmptyText:true
        },
        columns:[
            {header:"parent", dataIndex:"parent", hidden:true},
            {header:"next_group", dataIndex:"next_group", hidden:true},
            {header:"", dataIndex:"group_name", width:150},
            {
                text: '在线支付订单',
                columns:[
                    {header:"结算金额",dataIndex:"online_money", width:100,align:'center',renderer:money},
                    {header:"数量", dataIndex:"online_num", width:100,align:'center'}
                ]
            },
            {
                text: '信用支付订单',
                columns:[
                    {header:"结算金额",dataIndex:"credit_money", width:100,align:'center',renderer:money},
                    {header:"数量", dataIndex:"credit_num", width:100,align:'center'}
                ]
            },
            {
                text: '线下支付订单',
                columns:[
                    {header:"结算金额", dataIndex:"line_money", width:100,align:'center',renderer:money},
                    {header:"数量", dataIndex:"line_num", width:100,align:'center'}
                ]
            },
            {
                text: '未确认订单',
                columns:[
                    {header:"结算金额", dataIndex:"confirm_money", width:100,align:'center',renderer:money},
                    {header:"数量", dataIndex:"confirm_num", width:100,align:'center'}
                ]
            },
            {
                text: '未付款订单',
                columns:[
                    {header:"结算金额", dataIndex:"topay_money", width:100,align:'center',renderer:money},
                    {header:"数量", dataIndex:"topay_num", width:100,align:'center'}
                ]
            },
            {
                text: '小计',
                columns:[
                    {header:"结算金额", dataIndex:"total_money", width:100,align:'center',renderer:money},
                    {header:"数量",dataIndex:"total_num", width:100,align:'center'}
                ]
            },
            {text: ''}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有订单信息'
        }),
        tbar : [
            {text:'按大区汇总',id:'group_type', xtype:'button',width:150,
                menu:{
                    items:[
                        {width:150,text: '按大区汇总',id:"region",handler:function(){
                            Ext.getCmp("group_type").setText("按大区汇总");
                            Ext.getCmp('search_org_province').reset();
                            Ext.getCmp('search_org_city').reset();
                            Ext.getCmp('search_org_area').reset();
                            dosearch();
                            Ext.getCmp('search_org_city').setDisabled(true);
                            Ext.getCmp('search_org_province').setDisabled(true);
                        }},
                        {width:150,text: '按省份汇总',id:"province",handler:function(){
                            Ext.getCmp("group_type").setText("按省份汇总");
                            Ext.getCmp('search_org_province').setDisabled(false);
                            Ext.getCmp('search_org_city').setDisabled(true);
                            Ext.getCmp('search_org_city').reset();
                            Ext.getCmp('search_org_province').reset();
                            dosearch();
                        }},
                        {width:150,text: '按城市汇总',id:"city",handler:function(){
                            Ext.getCmp("group_type").setText("按城市汇总");
                            Ext.getCmp('search_org_province').setDisabled(false);
                            Ext.getCmp('search_org_city').setDisabled(false);
                            dosearch();
                        }},
                        {width:150,text: '按供应商汇总',id:"worg",handler:function(){
                            Ext.getCmp("group_type").setText("按供应商汇总");
                            Ext.getCmp('search_org_province').setDisabled(false);
                            Ext.getCmp('search_org_city').setDisabled(false);
                            dosearch();
                        }}
                    ]
                }
            },
            box_large_area,
            box_province,
            box_city,
            {text:'交易日期',id:'search_date', xtype:'button',width:120,
                menu:{
                    items:[
                        {width:120,text: '交易日期',id:"deal_times",handler:function(){
                            Ext.getCmp("search_date").setText("交易日期");
                        }},
                        {width:120,text: '出团日期',id:"out_date",handler:function(){
                            Ext.getCmp("search_date").setText("出团日期");
                        }}
                    ]
                }
            },
            SUNLINE.ExtDateField({id:'start_time', name:'start_time', labelAlign:"right", fieldLabel:false, labelSeparator:'', width:100, gang:'end_time', start:true,value:today()
            }),
            '至',
            SUNLINE.ExtDateField({id:'end_time',
                name:'end_time', labelAlign:"right", fieldLabel:false, labelSeparator:'', width:100,  gang:'start_time',value:today()}),
            {text:'搜索',iconCls:'button-sch',handler:dosearch},
            {text:'导出',iconCls:'button-article',handler:doexport},
            {text:'刷新', iconCls:'button-ref', handler:function(){
                store.reload();
            }},
            {text:'查看详情',iconCls:'button-article',handler:show_next},
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('支付方式汇总报表')}},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'company_search',
                cls:'search-icon-cls',
                emptyText:'供应商名称',
                width:170,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            dosearch();
                        }
                    }
                }
            }
        ]
    });
    //双击事件
    grid.addListener('rowdblclick', show_next);
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    });

    /**     方法  ***/
    function dosearch(){
        var group_type = Ext.getCmp('group_type').getText();
        var region =Ext.getCmp('search_org_area').getValue();
        var province =Ext.getCmp('search_org_province').getValue();
        var city =Ext.getCmp('search_org_city').getValue();
        var search_date=Ext.getCmp('search_date').getText();
        var start_time =Ext.getCmp('start_time').getValue();
        var end_time =Ext.getCmp('end_time').getValue();
        var company_search=Ext.getCmp('company_search').getValue();
        SUNLINE.baseParams(store,{group_type:group_type,region:region,province:province,city:city,search_date:search_date,start_time:start_time,end_time:end_time,company_search:company_search},true);
        store.currentPage=1;
        store.load();
    }

    function doexport(){
        var url = "group_type="+Ext.getCmp('group_type').getText();
         url += "&region="+Ext.getCmp('search_org_area').getValue();
         url += "&province="+Ext.getCmp('search_org_province').getValue();
         url += "&city="+Ext.getCmp('search_org_city').getValue();
         url += "&search_date="+Ext.getCmp('search_date').getText();
         url += '&start_time=' + Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
         url += '&end_time=' + Ext.Date.format(Ext.getCmp('end_time').getValue(),'Y-m-d');
         url += "&company_search="+Ext.getCmp('company_search').getValue();
        window.location = $__app__+'/RegionCount/export?'+url;
    }

    function show_next(){
        var select = SUNLINE.getSelected(grid);
        if(!select){
            Ext.Msg.alert('消息提示','请选择数据');return false;
        }
        if(!select.data.next_group || typeof(select.data.next_group) == 'undefined'){
            Ext.Msg.alert('消息提示','已无下级数据');return false;
        }
        var group_type = select.data.next_group;
        Ext.getCmp("group_type").setText(group_type);
        var parent = select.data.parent;
        strs=parent.split("/");
        if(!strs[0]) strs = new Array();
        strs.push(select.data.group_name);
        if(strs[0]){
            Ext.getCmp('search_org_area').setValue(strs[0]);
            Ext.getCmp('search_org_area').setDisabled(false);
            Ext.getCmp('search_org_province').setDisabled(false);
        }
        if(strs[1]){
            Ext.getCmp('search_org_province').setValue(strs[1]);
            Ext.getCmp('search_org_province').setDisabled(false);
            Ext.getCmp('search_org_city').setDisabled(false);
        }
        if(strs[2]){
            Ext.getCmp('search_org_city').setValue(strs[2]);
            Ext.getCmp('search_org_city').setDisabled(false);
        }
        dosearch();
    }
    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }
    function yesterday(){
        var time=new Date();
        time.setTime(time.getTime()-24*60*60*1000);
        return Ext.util.Format.date(time,'Y-m-d');
    }

});