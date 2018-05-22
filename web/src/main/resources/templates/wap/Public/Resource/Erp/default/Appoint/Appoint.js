var PRODUCT_INFO = {};
var PRODUCT_ID = '';
Ext.onReady(function() {
    checkMarket();
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget ='qtip';
    var p_url = $__app__ + '/Appoint/productDataJson';
    var p_field = [];
    var product_store = new SUNLINE.JsonStore(p_url, p_field,true);

    var b_url = $__app__ + '/Appoint/buyerDataJson';
    var b_field = [];
    var buyer_store = new SUNLINE.JsonStore(b_url, b_field,false);
    product_store.on('load',function(){
        buyer_store.removeAll();
    });
    /* 所选产品 */
    var product_box = SUNLINE.ComBoxPlus({
        id:'products',
        name:'products',
        fields:['p_id','p_name','p_num','p_linkman','p_only_buyer'],url:$__app__ + '/Products/dataJson',
        where:{'p_only_id':''},
        config:{
            fieldLabel:"选择产品",
            labelWidth:65,
            labelAlign:"right",
            displayField:'p_name',
            valueField:'p_id',
            width:250,
            value:'',
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    product_box.on('select',function(c,r){
        PRODUCT_INFO = '';
        PRODUCT_INFO = r[0].data;
    });
    /*单位操作(start)*/
    var ishidden = _uinfo.org_type=='管理公司' ? false : true;
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config:{
            hidden:ishidden,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:200,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    company_box.on({
        select:function(c,r){
            var row=r[0].data;
            select_org_id = row.id;
            SUNLINE.baseParams(product_store,{p_org_id:row.id});
            product_store.load();
            SUNLINE.baseParams(product_box.store,{p_org_id:row.id});
            product_box.store.load();
        }
    });
    /**    数据  ***/
    var product_grid = new Ext.grid.GridPanel({
        region:'west',
        width:600,
        border:false,
        style:'border-right:1px solid #009DDA;',
        store:product_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有产品信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"p_id", width:50, hidden:true},
            {header:"产品可见", dataIndex:"p_only_buyer", width:50, hidden:true},
            {header:"产品编号", dataIndex:"p_num", width:100},
            {header:"产品名称", dataIndex:"p_name", width:300},
            {header:"客服", dataIndex:"p_linkman", width:100},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:product_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        }),
        tbar : [
            company_box,
            product_box,
            {text:'加入', iconCls:'button-add', handler:add_products}
        ]
    });

    var buyer_grid=new Ext.grid.GridPanel({
        selModel: {
            selType: 'checkboxmodel'
        },
        id: 'buyer',
        border : false,
        region : 'center',
        store : buyer_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有分销商信息',
            deferEmptyText:true
        },
        tbar :  [
            {text:'添加定向投放对象', iconCls:'button-add', handler:add_buyer},
            {text:'移除', iconCls:'button-close', handler:remove_buyer},
            {text:'复制', iconCls:'button-add', handler:copy_buyer},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'分销商单位名称/法人代表/联系电话',
                width:170,
                onTriggerClick:function (e) {
                    company_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            company_dosearch();
                        }
                    }
                }
            }
        ],
        columns:[
            {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
            {header:"编号", dataIndex:"org_bh", width:100, align:'center'},
            {header:"单位名称", dataIndex:"org_name", width:250},
            {header:"分销商区域", dataIndex:"org_province", width:250,renderer:fullDress},
            {header:"法人代表", dataIndex:"org_legal", width:120, align:'center'},
            {header:"联系电话", dataIndex:"org_mob", width:120, align:'center'},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:buyer_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分销商信息'
        }),
    });

    new Ext.Viewport({
        layout:'border',
        items:[product_grid,buyer_grid]
    });

    product_grid.on('select',function(){
        var row=SUNLINE.getSelected(product_grid);
        SUNLINE.baseParams(buyer_store,{p_id:row.data.p_id},true);
        buyer_store.currentPage=1;
        buyer_store.load();
    })

    /**     显示分销列表的表单开始  ***/
    var search_sorg_cm =[
        {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
        {header:"copy_p_id", dataIndex:"copy_p_id", width:50, hidden:true,id:"copy_p_id"},
        {header:"编号", dataIndex:"org_bh", width:100, align:'center'},
        {header:"单位名称", dataIndex:"org_name", width:250},
        {header:"分销商区域", dataIndex:"org_province", width:250,renderer:fullDress},
        {header:"法人代表", dataIndex:"org_legal", width:120, align:'center'},
        {header:"联系电话", dataIndex:"org_mob", width:120, align:'center'},
    ];
    var search_sorg_url = $__app__ + '/Appoint/get_company';
    var search_sorg_store = SUNLINE.JsonStore(search_sorg_url, [],false);

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
        width: 150,
    });
    var search_sorg_grid = new Ext.grid.GridPanel({
        selModel: {
            selType: 'checkboxmodel'
        },
        region:'center',
        scrollable:true,
        border:false,
        columns:search_sorg_cm,
        store:search_sorg_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有分销商信息',
            deferEmptyText:true
        },
        tbar:[
            box_large_area,
            box_province,
            box_city,
            {xtype:'textfield',id:'sorg_company_search',name:'sorg_company_search',width:240, emptyText:'分销商名称/编号/法人名称/手机号码'},
            {text:'查询',iconCls: 'searchico',handler:function(){
                dosearch();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:search_sorg_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分销商信息'
        })
    });
    var search_sorg_win =  new Ext.Window({
        width:900,
        height:500,
        maximizable : true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:search_sorg_grid,
        scrollable:true,
        layout : 'border',
        buttons:[
            {text:'保存', handler:doSubmit},
            {text:'关闭', handler:function () {
                search_sorg_win.hide();
            },style:'margin-right:15px;'}
        ],
        listeners: {
            'hide':function(){
                PRODUCT_ID = '';
                search_sorg_store.removeAll();
            }
        }

    })
    /**     显示分销列表的表单结束  ***/
    var copy_product_cm =[
        {header:"p_id", dataIndex:"p_id", width:50, hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:100, align:'center'},
        {header:"产品名称", dataIndex:"p_name", width:250},
        {header:"客服", dataIndex:"p_linkman", width:250},
        {header:"定向分销数", dataIndex:"p_count", width:120, align:'center'},
    ];
    var copy_product_url = $__app__ + '/Appoint/get_product';
    var copy_product_store = SUNLINE.JsonStore(copy_product_url, [],false);
    var copy_product_grid = new Ext.grid.GridPanel({
        region:'center',
        scrollable:true,
        border:false,
        columns:copy_product_cm,
        store:copy_product_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有产品信息',
            deferEmptyText:true
        },
        tbar:[
            {xtype:'textfield',id:'copy_product_search',name:'copy_product_search',width:240, emptyText:'产品名称'},
            {text:'查询',iconCls: 'searchico',handler:function(){
                product_dosearch();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:copy_product_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });
    /**     显示复制列表的表单开始  ***/
    var copy_sorg_win =  new Ext.Window({
        width:900,
        height:500,
        maximizable : true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:copy_product_grid,
        scrollable:true,
        layout : 'border',
        buttons:[
            {text:'复制', handler:doCopy},
            {text:'关闭', handler:function () {
                copy_sorg_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    /**     显示复制列表的表单结束  ***/
    /**     方法  ***/
    function add_products(){
        var is_exist = 0;
        var p = [];
        Ext.each(product_store.data.items,function(v){
            if(PRODUCT_INFO.p_id == v.data.p_id){
                is_exist = 1 ;
            }
            p.push(v);
        });
        if(is_exist == 1) return false;
        if(!PRODUCT_INFO.p_id) return false;
        p.unshift(PRODUCT_INFO)
        product_store.removeAll();
        product_store.add(p);
    }

    function add_buyer(){
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        search_sorg_win.show();
    }

    /**
     * 移除定向投放对象
     * @returns {boolean}
     */
    function remove_buyer(){
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        var records_buyer= buyer_grid.getSelectionModel().getSelection();
        if(!records_buyer){
            Ext.Msg.alert('提示信息','请选择您要移除的分销商对象');
            return false;
        }
        Ext.MessageBox.confirm("友情提示",'确认要移除选中的分销商？',function(y){
            if(y!="yes") return false;
            var org_id_arr = [];
            Ext.each(records_buyer,function(v){
                org_id_arr.push(v.data.org_id);
            })
            org_id = org_id_arr.join(',');
            var url  = $__app__ +'/Appoint/removeOnlyToBuyer';
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : url,
                params : {p_id:row.data.p_id,p_only_buyer:org_id},
                success : function(response, opts){
                    var rst = Ext.decode(response.responseText);
                    if (rst.status){
                        search_sorg_win.hide();
                    }
                    Ext.Msg.alert('友情提示', rst.info,function(){});
                    myMask.hide();
                    buyer_store.load();
                },
                failure : function(response, opts){
                    myMask.hide();
                    buyer_store.load();
                    Ext.Msg.alert('友情提示', '设置定向投放失败，遇到未知错误！',function(){});
                }
            });
        })
    }

    /**
     * 复制产品页显示
     * @returns {boolean}
     */
    function copy_buyer(){
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        SUNLINE.baseParams(copy_product_store, {p_id:row.data.p_id});
        copy_product_store.currentPage = 1;
        copy_product_store.load();
        copy_sorg_win.show();
    }

    /**
     * 复制产品页跳转到分销商页面
     * @returns {boolean}
     */
    function doCopy(){
        var row=SUNLINE.getSelected(copy_product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要复制的产品');
            return false;
        }
        copy_sorg_win.hide();
        PRODUCT_ID = '';
        PRODUCT_ID = row.data.p_id;
        SUNLINE.baseParams(search_sorg_store, {copy_p_id:row.data.p_id});
        search_sorg_store.currentPage = 1;
        search_sorg_store.load();
        search_sorg_win.show();
    }

    /**
     * 追加 覆盖 页面
     */
    var cp_win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        title:'友情提示',
        items: new Ext.form.FormPanel({
            border:false,
            bodyStyle:'background:none;padding:10px',
            defaultType:'textfield',
            items: [
                {id:"msg_show",xtype:'fieldset',autoHeight:true,border:0,html:'复制操作将会修改原有的投放对象,请选择修改方式?'},
            ]
        }),
        buttons:[
            {text:'追加', handler:function(){copy_edit_store('add')}},
            {text:'覆盖', handler:function(){copy_edit_store('cover')}},
            {text:'关闭', handler:function () {
                cp_win.hide();
            }}
        ]
    });

    function doSubmit(){
        if(PRODUCT_ID != ''){
            cp_win.show();
        }else{
            copy_edit_store('add');
        }
    }

    function copy_edit_store(type){
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        var records_sorg= search_sorg_grid.getSelectionModel().getSelection();
        if(records_sorg.length == 0){
            Ext.Msg.alert('提示信息','请选择您要投放的分销商对象');
            return false;
        }
        var org_id_arr = [];
        Ext.each(records_sorg,function(v){
            org_id_arr.push(v.data.org_id);
        });
        org_id = org_id_arr.join(',');
        var url  = $__app__ +'/Appoint/saveOnlyToBuyer';
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : url,
            params : {p_id:row.data.p_id,p_only_buyer:org_id,type:type},
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                if (rst.status){
                    search_sorg_win.hide();
                }
                Ext.Msg.alert('友情提示', rst.info,function(){});
                myMask.hide();
                cp_win.hide();
                buyer_store.load();
            },
            failure : function(response, opts){
                myMask.hide();
                cp_win.hide();
                buyer_store.load();
                Ext.Msg.alert('友情提示', '设置定向投放失败，遇到未知错误！',function(){});
            }
        });
    }

    //分销商搜索
    function dosearch(){
        var region =Ext.getCmp('search_org_area').getValue();
        var province =Ext.getCmp('search_org_province').getValue();
        var city =Ext.getCmp('search_org_city').getValue();
        var search_store = search_sorg_store;
        var key = Ext.getCmp('sorg_company_search').getValue();
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        var search_params ={skey: key,region:region,province:province,city:city,p_id:row.data.p_id,copy_p_id:PRODUCT_ID};
        SUNLINE.baseParams(search_store, search_params);
        search_store.currentPage = 1;
        search_store.load();
    }
    //产品搜索
    function product_dosearch(){
        var key = Ext.getCmp('copy_product_search').getValue();
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        if(!key)return;
        var search_params ={skey: key,p_id:row.data.p_id};
        SUNLINE.baseParams(copy_product_store, search_params);
        copy_product_store.currentPage = 1;
        copy_product_store.load();
    }
    //已设置定投分销商
    function company_dosearch(){
        var key = Ext.getCmp('hotel_search').getValue();
        var row=SUNLINE.getSelected(product_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要设置的产品');
            return false;
        }
        if(!key)return;
        var search_params ={skey: key,p_id:row.data.p_id};
        SUNLINE.baseParams(buyer_store, search_params);
        buyer_store.currentPage = 1;
        buyer_store.load();
    }
    function fullDress(v,m,r){
        var province = r.get('org_province');
        if(province == null) {province = ""};
        var city = r.get('org_city');
        if(city == null) {city = ""};
        var county = r.get('org_county') ? r.get('org_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    function checkMarket(){
        Ext.Ajax.request({
            async:false,
            url : $__app__+ '/Appoint/getAppoint',
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                var  html = '<div class="x-component x-message-box-icon x-box-item x-component-default x-dlg-icon x-message-box-question" style="right: auto; left: 15px; top: 30px; margin: 0px;"></div><div style="margin-left:25px;padding:30px;text-align: left">'+rst.msg+'</div>';
                if(rst.code != 200){
                    var buy_win=new Ext.Window({
                        autoHeight:true,
                        closeAction:'hide',
                        width:500,
                        modal:true,
                        html:html,
                        title:'友情提示',
                        buttons:[
                            {text:'关闭', handler:function () {
                                parent.CloseTab(this);
                            }},
                            {text:'去购买',handler:function(){
                                top.window.location.href = rst.data.buy_url;
                            }},
                        ],
                        listeners:{
                            close:function(){
                                parent.CloseTab(this);
                            }
                        }
                    })
                    buy_win.show();
                    return false;
                }
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '遇到未知错误',function(){});
            }
        });
    }
});