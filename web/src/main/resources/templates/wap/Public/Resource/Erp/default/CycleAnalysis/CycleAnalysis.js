Ext.onReady(function() {
    var pageSize = 100;
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url = $__app__ + '/CycleAnalysis/orderDataJson';
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
        width: 150
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
            {header:"统计对象", dataIndex:"group_id", width:200},
            {
                text: '有订单的单位数量',
                columns:[
                    {header:"今天", dataIndex:"order_org_count",align:'right', width:70},
                    {header:"昨天", dataIndex:"bf_order_org_count",align:'right', width:70},
                    {header:"增减", dataIndex:"gap_order_org_count",align:'right', width:70,renderer:sort_style},
                    {header:"排名", dataIndex:"order_org_count_sort",align:'right', width:70}
                ]
            },
            {
                text: '订单数量',
                columns:[
                    {header:"今天", dataIndex:"order_count",align:'right', width:70},
                    {header:"昨天", dataIndex:"bf_order_count",align:'right', width:70},
                    {header:"增减", dataIndex:"gap_order_count", width:70,align:'right',renderer:sort_style},
                    {header:"排名", dataIndex:"order_count_sort", width:70,align:'right'}
                ]
            },
            {
                text: '门店订单平均频率 <i class="fa fa-question-circle"></i>',
                tooltip:'门店订单平均频率=订单数/有订单的单位数',
                columns:[
                    {header:"今天", dataIndex:"order_rate", width:80,align:'right'},
                    {header:"排名", dataIndex:"order_rate_sort", width:80,align:'right'}
                ]
            },
            {
                text: '订单人数',
                columns:[
                    {header:"今天", dataIndex:"user_count", width:70,align:'right'},
                    {header:"昨天", dataIndex:"bf_user_count", width:70,align:'right'},
                    {header:"增减", dataIndex:"gap_user_count", width:70,align:'right',renderer:sort_style},
                    {header:"排名", dataIndex:"user_count_sort", width:70,align:'right'}
                ]
            },
            {
                text: '门店人数转化率 <i class="fa fa-question-circle"></i>',
                tooltip:'门店人数转化率=订单人数/有订单的单位数',
                columns:[
                    {header:"今天", dataIndex:"num_rate", width:80,align:'right'},
                    {header:"排名", dataIndex:"num_rate_sort", width:80,align:'right'}
                ]
            },
            {text: ''}
        ],
        tbar : [
            {text:'按供应商统计',id:'group_type', xtype:'button',width:150,
                menu:{
                    items:[
                        {width:150,text: '按大区统计',id:"region",handler:function(){
                            Ext.getCmp("group_type").setText("按大区统计");
                            Ext.getCmp('search_org_province').reset();
                            Ext.getCmp('search_org_city').reset();
                            Ext.getCmp('search_org_area').reset();
                            dosearch();
                            Ext.getCmp('search_org_city').setDisabled(true);
                            Ext.getCmp('search_org_province').setDisabled(true);
                        }},
                        {width:150,text: '按省份统计',id:"province",handler:function(){
                            Ext.getCmp("group_type").setText("按省份统计");
                            Ext.getCmp('search_org_province').setDisabled(false);
                            Ext.getCmp('search_org_city').setDisabled(true);
                            Ext.getCmp('search_org_city').reset();
                            Ext.getCmp('search_org_province').reset();
                            dosearch();
                        }},
                        {width:150,text: '按城市统计',id:"city",handler:function(){
                            Ext.getCmp("group_type").setText("按城市统计");
                            Ext.getCmp('search_org_province').setDisabled(false);
                            Ext.getCmp('search_org_city').setDisabled(false);
                            dosearch();
                        }},
                        {width:150,text: '按供应商统计',id:"worg",handler:function(){
                            Ext.getCmp("group_type").setText("按供应商统计");
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
            {text:'选择时间：',id:'search_date',xtype:'tbtext',width:60},
            SUNLINE.ExtDateField({id:'start_time', name:'start_time', labelAlign:"right", fieldLabel:false, labelSeparator:'', width:120, start:true,value:today()
            }),
            {text:'搜索',iconCls:'button-sch',handler:dosearch},
            {text:'导出',iconCls:'button-article',handler:doexport},
            {text:'重载',icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png', cls: 'x-btn-icon', handler: function () {window.location.reload();}},
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('供应商日环比分析报表')}},
        ]
    });

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
       // var search_date=Ext.getCmp('search_date').getText();
        var start_time =Ext.getCmp('start_time').getValue();
        SUNLINE.baseParams(store,{group_by:group_type,region:region,province:province,city:city,start_time:start_time},true);
        store.currentPage=1;
        store.load();
    }


    function doexport(){
        var url = "group_by="+Ext.getCmp('group_type').getText();
        url += "&region="+Ext.getCmp('search_org_area').getValue();
        url += "&province="+Ext.getCmp('search_org_province').getValue();
        url += "&city="+Ext.getCmp('search_org_city').getValue();
       // url += "&search_date="+Ext.getCmp('search_date').getText();
        url += '&start_time=' + Ext.Date.format(Ext.getCmp('start_time').getValue(),'Y-m-d');
        window.location = $__app__+'/CycleAnalysis/export?'+url;
    }

    function sort_style(v,m,r){
        if(v<0){
            return "<span style='color:green'>↓"+ -v +"</span>";
        }else if(v>0){
            return "<span style='color:red'>↑"+ v +"</span>";
        }else{
            return 0;
        }
    }

    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }




});