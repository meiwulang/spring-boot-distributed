Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='qtip';
    var url = $__app__ + '/Tendency/TendDataJson';
    var field = [];
    var store = new SUNLINE.JsonStore(url, field,false,{pageSize:13});
    //创建 已选的数据
    var checked_store = Ext.create('Ext.data.Store',{
        fields: ['group_name'],
        data: []
    });
    //组织左边栏组件
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
    var search_org_area_value = search_org_area_mem ? search_org_area_mem : '';
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
        style:'margin-top:5px',
        value:search_org_area_value,
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
    var search_org_province_value = search_org_province_mem ? search_org_province_mem : '';
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
        value:search_org_province_value,
        style:'margin-top:5px',
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
    var search_org_city_value = search_org_city_mem ? search_org_city_mem : '';
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
        style:'margin-top:5px',
        disabled:true,
        value:search_org_city_value
    });
    //已选数据
    var checked_grid = new Ext.grid.GridPanel({
        style:'border:3px solid #add2ed',
        region:'left',
        height: 500,
        store:checked_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'',
            deferEmptyText:true
        },
        columns:[
            {header:"对比对象", dataIndex:"group_name", width:370,renderer:cut_label},
        ]
    });
    //未选数据
    var none_grid = new Ext.grid.GridPanel({
        style:'border:3px solid #add2ed',
        region:'left',
        height: 500,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有信息',
            deferEmptyText:true
        },
        columns:[
            {header:"对比对象", dataIndex:"group_name", width:370,renderer:add_label},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:''
        })
    });


    //选项卡
    var tab = Ext.create('Ext.tab.Panel', {
        width: 380,
        activeTab: 0,
        plain: true,
        border:false,
        bodyBorder:true,
        autoShow:true,
        bodyStyle:"border:0px;border-color:red",
        items: [{title:'可选',items:none_grid,id:"none_id"},{title:'已选<span id="checked_num">(0)</span>',items:checked_grid,id:"checked_id"}],
        renderTo : Ext.getBody(),
        listeners: {
            tabchange: function(tabs, newTab) {
                if(newTab.config.title == '可选'){
                    dosearch('add');
                }
            }
        },
    });
    //日期
    var date_content_value = date_content_mem ? date_content_mem : '日趋势:近7天';
    var date_type= new Ext.form.ComboBox({
        id:"date_type",
        name:"date_type",
        triggerAction:"all",
        editable:false,
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[
                ['日趋势:近7天'],
                ['日趋势:近30天'],
                ['月趋势:近半年'],
                ['月趋势:近一年']
            ]
        }),
        style:"margin-top:10px",
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:date_content_value,
        width:150,
        labelAlign:"left"
    });
    var search_date_value = search_date_mem ? search_date_mem : '交易日期';
    //日期类型
    var search_date= new Ext.form.ComboBox({
        id:"search_date",
        name:"search_date",
        triggerAction:"all",
        editable:false,
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[
                ['交易日期'],
                ['出团日期'],
            ]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:search_date_value,
        width:90,
        labelAlign:"right",
        style:"margin-left:10px;margin-top:10px;margin-right:-30px"
    });
    //默认数据
    var order_count_checked = field_content=='order_count' ||field_content=='' ? true :false;
    var order_num_checked = field_content=='order_num' ? true :false;
    var order_money_checked = field_content=='order_money' ? true :false;
    var company_search_value  = company_search_mem ? company_search_mem :'';
    var ten_leftPanel = new Ext.form.FormPanel({
        border :false,
        autoScroll:true,
        bodyPadding:5,
        bodyStyle:"background:#fff;border:0px",
        region:'west',
        split : true,
        collapsible: true,
        collapsed: false,
        floatable: false,
        resizable:false,
        fixed:true,
        title:'<div onclick="help(\'交易趋势对比报表\');" title="查看帮助"><span>绘制图表设置</span><span style="margin-left: 5px"><i class="fa fa-question-circle"></i></span></div>',
        maxWidth: 400,
        minWidth:400,
        layout:'column',
        items: [
            {xtype:'fieldset',title:'',cls:'tcol2',border:0,style:"padding:5;",items:[
                {
                    xtype: 'buttongroup',
                    id: 'search_form',
                    height: 110,
                    width:380,
                    border:false,
                    style:"border-color:#add2ed",
                    columns: 3,
                    items: [
                        {
                            colspan: 3,
                            text: '按大区汇总',
                            id: 'group_type',
                            width: 360,
                            style: 'margin-top:5px',
                            menu: {
                                items: [
                                    {
                                        text: '按大区汇总', id: "region", width: 360, listeners:{click: function () {
                                        Ext.getCmp("group_type").setText("按大区汇总");
                                        clearChekced();
                                        dosearch();
                                        Ext.getCmp('search_org_city').setDisabled(true);
                                        Ext.getCmp('search_org_province').setDisabled(true);
                                        Ext.getCmp('company_search').setDisabled(true);
                                        }
                                    }},
                                    {
                                        text: '按省份汇总', id: "province", width: 360, listeners:{click: function () {
                                        Ext.getCmp("group_type").setText("按省份汇总");
                                        Ext.getCmp('search_org_province').setDisabled(false);
                                        Ext.getCmp('search_org_city').setDisabled(true);
                                        Ext.getCmp('company_search').setDisabled(true);
                                        clearChekced();
                                        dosearch();
                                        }
                                    }},
                                    {
                                        text: '按城市汇总', id: "city", width: 360, listeners:{click: function () {
                                        Ext.getCmp("group_type").setText("按城市汇总");
                                        Ext.getCmp('search_org_province').setDisabled(false);
                                        Ext.getCmp('search_org_city').setDisabled(false);
                                        Ext.getCmp('company_search').setDisabled(true);
                                        clearChekced();
                                        dosearch();
                                        }
                                    }},
                                    {
                                        text: '按供应商汇总', id: "worg", width: 360, listeners:{click: function () {
                                        Ext.getCmp("group_type").setText("按供应商汇总");
                                        Ext.getCmp('search_org_province').setDisabled(false);
                                        Ext.getCmp('search_org_city').setDisabled(false);
                                        Ext.getCmp('company_search').setDisabled(false);
                                        clearChekced();
                                        dosearch();
                                        }
                                    }}
                                ]
                            }
                        },
                        box_large_area,
                        box_province,
                        {
                            rowspan: 2,
                            text: '搜索',
                            xtype: 'button',
                            iconCls: 'button-sch',
                            iconAlign: 'top',
                            width: 50,
                            height: 50,
                            style: 'margin-left:10px;margin-top:5px;',
                            handler: dosearch
                        },
                        box_city,
                        {
                            id: "company_search",
                            xtype: 'textfield',
                            name: "company_search",
                            value: company_search_value,
                            emptyText: '供应商名称',
                            width: 140,
                            style: 'margin-left:10px;margin-top:5px',
                            disabled: true
                        }
                    ]
                },
            ]},
            {xtype:'fieldset',title:'',cls:'tcol1',border:0,style:";padding:5",items:[tab]},
            {xtype:'tbtext',text:'注:对比分析对象最多只能选择11个.',style:"margin-bottom:5px"},
            {xtype:'fieldset',title:'',cls:'tcol2',border:0,style:"padding:5",items:[
                {
                    xtype: 'buttongroup',
                    id: 'set_form',
                    height: 110,
                    border: false,
                    columns: 3,
                    style:"border-color:#add2ed",
                    items: [search_date,date_type,{text:'',xtype:'tbtext'},
                        {
                            colspan:2,
                        xtype: "radiogroup",
                        fieldLabel: "统计维度",
                        id:'field_content',
                        labelWidth:70,
                        columns: 3,
                        style:"margin-left:10px;margin-top:5px",
                        items: [
                            { boxLabel: "订单数", name: "count_type",checked:order_count_checked, inputValue: "order_count" ,width:70},
                            { boxLabel: "收客人数", name: "count_type",checked:order_num_checked, inputValue: "order_num" ,width:70},
                            { boxLabel: "订单金额", name: "count_type",checked:order_money_checked, inputValue: "order_money" ,width:70}
                        ]
                    },{text:'',xtype:'tbtext'},
                        {  colspan:2,text:'绘制图表',iconCls:'button-view',xtype:'button',width:100,height:30,style:'margin-left:230px;margin-top:20px；margin-bottom:5px',handler:doTendency},
                        {text:'',xtype:'tbtext'}
                    ]
                },
            ]},
        ]
    });
    //默认数据
    Ext.getCmp(group_type).fireEvent('click');
    var html = '<div id="container" style="height: 100%"></div>';
    var panel = new Ext.panel.Panel({
        region:'center',
        height:200,
        width:'100%',
        renderTo:Ext.getBody(),
        bodyPadding:2,
        layout:"fit",
        bodyStyle:'background-color:#FFFFFF',
        html:html,
    })
    new Ext.Viewport({
        layout : 'border',
        items : [ten_leftPanel,panel]
    });
    panel.on('resize',function(){doTendency('resize')});

    /**     方法  ***/
    function dosearch(type){
        var data = [];
        checked_store.each(function(record){
            data.push(record.data.group_name);
        });
        var group_type = Ext.getCmp('group_type').getText();
        var region =Ext.getCmp('search_org_area').getValue();
        var province =Ext.getCmp('search_org_province').getValue();
        var city =Ext.getCmp('search_org_city').getValue();
        var company_search=Ext.getCmp('company_search').getValue();
        var where_in = data.join(',');
        SUNLINE.baseParams(store,{group_type:group_type,region:region,province:province,city:city,company_search:company_search,where_in:where_in},true);
        if(type != 'add' || type != 'cut'){
            store.currentPage=1;
        }
        store.load();
    }

    function set_chart(title,tendency,time,data){
        var dom = document.getElementById("container");
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(dom);
        option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x:'190px',
                data:tendency
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '1%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {title:'Download'}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: time
            },
            yAxis: {
                type: 'value'
            },
            series: data

        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }

    function doTendency(type){
        var arr = []
        Ext.each(checked_store.data.items,function(v){
            arr.push(v.data.group_name);
        })
        str = arr.join(',');
        if(type == 'resize' && (arr.length < 1 || Ext.getCmp('field_content').getChecked().length==0)){
            set_chart('交易趋势分析');return false;
        }
        if(arr.length < 1){
            Ext.Msg.alert('友情提示', '请选择趋势分析对象'); return ;
        }
        var group_type = Ext.getCmp('group_type').getText();
        var search_date = Ext.getCmp('search_date').getValue();
        var date_content = Ext.getCmp('date_type').getValue();
        var region =Ext.getCmp('search_org_area').getValue();
        var province =Ext.getCmp('search_org_province').getValue();
        var city =Ext.getCmp('search_org_city').getValue();
        var company_search=Ext.getCmp('company_search').getValue();
        if(Ext.getCmp('field_content').getChecked().length==0){
            Ext.Msg.alert('友情提示', '请选择统计维度'); return ;
        }
        var field_content =  Ext.getCmp('field_content').getChecked()[0].inputValue;
        Ext.Ajax.request({
            url: $__app__ + '/Tendency/orderDataJson',
            params: { tendency:str,group_type:group_type,search_date:search_date,date_content:date_content,field_content:field_content,search_org_area:region,search_org_province:province,search_org_city:city,company_search:company_search},
            method: 'POST',
            success: function (response, options) {
                var obj=Ext.decode(response.responseText);
                set_chart(obj.title,obj.tendency,obj.time,obj.data)
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        });

    }

    /**
     * 清空checkedstore数据
     */
    function clearChekced(){
        checked_store.removeAll();
        checked_grid.store.loadData(checked_store.data.items);
        document.getElementById('checked_num').innerHTML = '('+checked_grid.store.data.items.length+')';
    }


    /**
     * 显示加号
     */
    function add_label(v,m,r){
        return v + '<div title="点击添加至分析对象" onclick="addChecked(\''+ v +'\')" style="display:inline-block;float:right;padding-right:20px;background-repeat: no-repeat;width: 20px;height: 20px;" class="button-add" ></div>';
    }

    window.addChecked = function(gname){
        if(checked_store.getData().items.length > 10){
            Ext.Msg.alert('友情提示', '最多选择11个分析对象');
            return false;
        }
        var arr = [];
        checked_store.each(function(record){
            arr.push(record.data.group_name);
        });
        var str = arr.join(',');
        var i = str.indexOf(gname);
        if(i == -1){
            checked_store.add({group_name:gname})
            arr.push(gname);
        }
        document.getElementById('checked_num').innerHTML = '('+checked_store.getData().items.length+')';
        var i = -1;
        store.each(function(record,index) {
            if (record.data.group_name == gname) {
                i=index;
            }
        });
        if(i > -1){
            store.remove(store.getAt(i));
        }
    }
    /**
     * 显示减号
     */
    function cut_label(v,m,r){
        return v + '<div title="点击删除分析对象" onclick="cutChecked(\''+ v +'\')" style="display:inline-block;float:right;padding-right:20px;background-repeat: no-repeat;width: 20px;height: 20px;" class="button-close" ></div>';
    }

    window.cutChecked = function(v){
        var i = -1;
        checked_grid.store.each(function(record,index) {
            if (record.data.group_name == v) {
                i=index;
            }
        });
        if(i > -1){
            checked_grid.store.remove(checked_grid.store.getAt(i));
            checked_store = checked_grid.store;
        }
        document.getElementById('checked_num').innerHTML = '('+checked_grid.store.data.items.length+')';
    }

    if(tendency){
        var tendency_arr = tendency.split(",");
        Ext.each(tendency_arr,function(v){
            addChecked(v);
        })
        dosearch();
        doTendency();
    }else{
        doTendency('resize');
    }




});