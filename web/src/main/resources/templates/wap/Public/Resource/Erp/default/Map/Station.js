var ROW = {};
var cityCombo="";
var orgId = "";
var current_org = {id : org_id, name : org_name};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    window.org_id = top._uinfo.u_jgid;
    window.pageSize = top._uinfo.u_setup.pageSize ? top._uinfo.u_setup.pageSize : $app_page_size;
    var thisTitle = "出发地管理";
    var today_date = (new Date()).format('Y-m-d');

    var provinceCombo = SUNLINE.provinceCombo("st_province");
    provinceCombo.on({
        'select': function(_t, record, index){
            var cityCombo_store = cityCombo.getStore();
            cityCombo_store.baseParams['pid'] = record.get('id');
            cityCombo_store.load();
        }
    });

    var cityCombo = SUNLINE.cityCombo("st_city");
    cityCombo.on({
        'select': function(_t, record, index){
            var countyCombo_store = countyCombo.getStore();
            countyCombo_store.baseParams['pid'] = record.get('id');
            countyCombo_store.load();
        }
    });

    var countyCombo = SUNLINE.countyCombo("st_county");

    /**
     * 完整的地点
     * @param v
     * @param m
     * @param r
     * @return {String}
     */
    function fullDress(v,m,r){
        var province = r.get('st_province');
        if(province == null) {province = ""};
        var city = r.get('st_city');
        if(city == null) {city = ""};
        var county = r.get('st_county') ? r.get('st_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    var url = $__app__ + '/Station/dataJson';
    var field = [
        {name:"st_id"},
        {name:"st_name"},
        {name:"st_pym"},
        {name:"st_group"},
        {name:"st_type"},
        {name:"st_charge"},
        {name:"st_cost"},
        {name:"st_province"},
        {name:"st_city"},
        {name:"st_county"},
        {name:"st_go_time"},
        {name:"st_order"},
        {name:"st_status"},
        {name:"st_traffic"},
        {name:"st_map"},
        {name:"st_time"}
    ];
    var store = new SUNLINE.JsonStore(url, field);
    store.baseParams = {st_org_id : org_id};
    store.on('load', function(s){ sp_store.removeAll(); });

    org_ComboBox.setValue(org_name);
    if(_uinfo['u_dj'] != '平台级' && _uinfo['u_dj'] != '分站级' && _uinfo['u_dj'] != '单位级'){
        org_ComboBox.setDisabled(true);
    };

    org_ComboBox.on('treeClick', function (org, treeNode) {
        orgId = org.org_id;
        var st_type = Ext.getCmp("st_type_combox").getValue()
        if(st_type != '全部'){
            store.baseParams= { st_org_id : org.org_id , st_type : st_type};
        }else{
            store.baseParams = { st_org_id : org.org_id };
        }
        store.load();
    });

    function show_group(v, m, r){
        var tmp = '未知';
        try{
            Ext.each(_sunline_.product_type, function(item, index, all){
                if ( item[0] == v ) { tmp = item[1]; }
            });
        }catch(e){}
        return tmp;
    }

    var org_ComboBox1=new Ext.form.ComboBox({
        fieldLabel:"类型",
        allowBlank:false,
        width:60,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['name','value'],
            data:[['全部','全部'],['出发口岸','出发口岸'],['顺路站','顺路站'],['始发站','始发站'],['班车站','班车站']]
        }),
        displayField:"name",
        valueField:"value",
        mode:"local",
        id:"st_type_combox",
        forceSelection:true,
        typeAhead:true,
        value:"全部"
    });
    org_ComboBox1.on({
        "select":function(t,r,i){
            var st_type_combox=Ext.getCmp("st_type_combox").getValue();
            if(isNaN(orgId) || orgId==0){
                orgId=top._uinfo.u_jgid;
            }
            if(st_type_combox!="全部"){
                store.baseParams = { st_org_id : orgId ,st_type:st_type_combox };
            }else{
                store.baseParams = { st_org_id : orgId };
            }
            store.load();
        }
    });
    var  line = "";
    if(_uinfo.u_jgid==1) line='-';
    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:store,
        style :'border-right-width:1px;',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有出发地信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID号", dataIndex:"st_id", width:60, hidden:true},
            {header:"出发地点", dataIndex:"st_name", width:180},
            //{header:"收费金额", dataIndex:"st_cost", width:100, renderer:money },
            {header:"排序", dataIndex:"st_order", width:60,hidden:true},
            {header:"所属分组", dataIndex:"st_group", width:100, renderer:show_group},
            {header:"类型", dataIndex:"st_type", width:100},
            {header:"交通方式", dataIndex:"st_traffic", width:80},
            //{header:"收费类型", dataIndex:"st_charge", width:100},
            {header:"所属区域", dataIndex:"st_district", width:120,renderer:fullDress},
            {header:"站点类型", dataIndex:"st_map", width:80,renderer:full_map,hidden:window.org_id==1?false:true}
            /*{header:"编辑时间", dataIndex:"st_time", width:150},*/
           /* {header:"默认集合时间", dataIndex:"st_go_time", width:90, align:'center'},
            {header:"默认收费金额", dataIndex:"st_cost", width:90, align:'center',renderer:money_txt}*/
        ],
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:dodelete},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                store.load();
            }},
            '-',
            {text:'接送联系人', id:"contact_manage",iconCls:'button-add', disabled:true,handler:contact_manage},
            line,
            {text:'设为八达通', id:"map_station",iconCls:'button-add', handler:map_station,hidden:_uinfo.u_jgid==1 ? false:true},
            '-',
            '选择单位',
            org_ComboBox,
            '-',
            '选择类型',
            org_ComboBox1,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                emptyText:'出发地点、拼音码等',
                width:150,
                onTriggerClick:function (e) {
                    Ext.getCmp("search").getValue();
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
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有出发地信息'
        })
    });
    grid.getSelectionModel().on('rowselect',function(sm, rowindex, record){
        st_id = record.get('st_id');
        if(record.get("st_type")=="出发口岸" || record.get("st_type")=="始发站"){
            Ext.getCmp("contact_manage").enable();
        }else{
            Ext.getCmp("contact_manage").disable();
        }
        sp_store.baseParams['sp_stid'] = st_id;
        sp_store.load();
    });

    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"st_id", name:"st_id", fieldLabel:"ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"st_name", name:"st_name", fieldLabel:"出发地点", maxLength:"100"},
            {
                xtype:"combo",
                id:"st_group_id",
                hiddenName:"st_group",
                fieldLabel:"适用产品",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['st_id','st_group'], data:group}),
                triggerAction:"all",
                editable:false,
                valueField:"st_id",
                displayField:"st_group",
                emptyText:'请选择产品类型',
                mode:"local",
                listeners:{
                    // asun 2013.9.19 增加站点类型联动处理
                    'select' : function(combo, record, index){
                        try{
                            var st_type = Ext.getCmp('st_type');
                            var st_store = st_type.getStore();
                            var data = station_type[record.get('st_id')];
                            st_type.setValue('');
                            if (data){
                                st_store.loadData( data );
                            }else{
                                st_store.removeAll();
                            }
                        }catch(e){
                            alert(e.message);
                        }
                    }
                }
            },
            {
                xtype:"combo",
                id:"st_type",
                name:"st_type",
                fieldLabel:"类型",
                allowBlank:false,
                emptyText:'先选择适用产品',
                store:new Ext.data.SimpleStore({fields:['st_type'], data:[]}),
                triggerAction:"all",
                editable:false,
                valueField:"st_type",
                displayField:"st_type",
                mode:"local"
            },
            {
                xtype:"combo",
                id:"st_traffic",
                name:"st_traffic",
                fieldLabel:"交通方式",
                store:new Ext.data.SimpleStore({fields:['st_traffic'], data:[
                    ['汽车'],
                    ['火车'],
                    ['飞机'],
                    ['邮轮']
                ]}),
                emptyText:"选择交通方式",
                triggerAction:"all",
                editable:false,
                valueField:"st_traffic",
                displayField:"st_traffic",
                mode:"local"
            },
            /*{
                xtype:"combo",
                id:"st_charge",
                name:"st_charge",
                fieldLabel:"收费类型",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['st_charge'], data:[
                    ['常规免费'],
                    ['临时收费']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"st_charge",
                displayField:"st_charge",
                mode:"local",
                value:'常规免费',
                listeners:{
                    'change':function (combo, newVal, oldVal) {
                        if(newVal=="临时收费"){
                            Ext.getCmp('st_cost').setDisabled(false);
                        };
                        if(newVal=="常规免费"){
                            Ext.getCmp('st_cost').setDisabled(true);
                            Ext.getCmp('st_cost').setValue(0);
                        }
                    }
                }
            },*/
            provinceCombo,
            cityCombo,
            countyCombo/*,
            {id:"st_cost", name:"st_cost", fieldLabel:"默认价格", maxLength:"10", xtype:"numberfield"},
            {id:"st_go_time", name:"st_go_time", fieldLabel:"集合时间", style:'ime-mode:disabled;',
                regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/,
                regexText : '请输入正确的时间格式：06:00'
            },
            {id:"st_order", name:"st_order", fieldLabel:"排序", maxLength:"9", xtype:"numberfield"}*/
        ]
    });

    var win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    function modify(b) {
        if (b.text == '添加') {
            ROW.data = {st_charge:'常规免费'};
            com_org_name = Ext.fly('ext-comp-1001').getValue();
            if(window.org_id == '' || com_org_name == '请选择单位'){ //这里为什么用这么龌龊的方法呢，是因为org_id和org_name和全局的重名了，苦逼啊...
                Ext.Msg.alert('友情提示','请选择一个单位!');
                return;
            }
        }else if (b.text == '编辑') {
            var row = grid.getSelectionModel().getSelected();
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要编辑的出发地信息');
                return;
            };
            ROW.data = row.data;
        };
        win.setTitle(b.text + '出发地信息');
        win.show(b.id);
    };

    win.on('show', function (w) {
        var f = form.getForm();
        f.reset();
        f.setValues(ROW.data);
    });

    function dosave() {
        var s = form.getForm().getValues();
        if(!s.st_id){
            s.st_org_id = org_id;
        };

        s.st_site_name = $short_name;

        if ( s.st_type == "始发站" || s.st_type == "出发口岸" ){ }else{
            if (s.st_go_time == ''){
                Ext.Msg.alert('友情提示', '请填写集合时间！');
                return;
            }
        };

        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '请完整填写出发地信息');
            return;
        };

        var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
        mask.show();

        //免费时 disabled=true st_cost未定义 作如下处理：
        if(typeof(s.st_cost) == "undefined"){
            s.st_cost = 0;
        };

        Ext.Ajax.request({
            url:$__app__ + '/Station/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var  msg  = result.info;
                if (result.status ==1) {
                    var id = parseInt(result.info);
                    if (!isNaN(id)) {
                        var msg = msg.substring(id.toString().length);
                        s.st_id = id;
                        s.st_time = (new Date()).format('Y-m-d H:i:s');
                        store.add(new Ext.data.Record(s));
                    } else {
                        var row = grid.getSelectionModel().getSelected();
                        ChangeRowData(row, s, store);
                        row.set('st_time', (new Date()).format('Y-m-d H:i:s'));
                        store.commitChanges();
                    };
                    win.hide();
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '操作失败');
            }
        })
    };

    function dodelete() {
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要删除的出发地信息');
            return;
        };
        Ext.MessageBox.confirm('友情提示', '确定删除出发地信息吗？', callBack);
        function callBack(id) {
            if (id == 'yes') {
                var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在删除，请稍后...'});
                mask.show();
                var s = row.data;
                Ext.Ajax.request({
                    url:$__app__ + '/Station/station_del',
                    params:{st_id:s.st_id},
                    method:'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            grid.store.remove(grid.getSelectionModel().getSelected());
                        }
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        }
    };

    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        store['baseParams'] = {skey:skey};
        store.load({params:{start:0, limit:pageSize}});
    };

    provinceCombo.value = pname;
    cityCombo.value = cname;
    cityCombo.getStore().baseParams['pid'] = _pid;
    var countyCombo_store = countyCombo.getStore();
    countyCombo_store.baseParams['pid'] = cityId;
    countyCombo_store.load();


    var sp_fld = [
        {name:"sp_go_back"},
        {name:"sp_id"},
        {name:"sp_name"},
        {name:"sp_date_s"},
        {name:"sp_date_e"},
        {name:"sp_indate_s"},
        {name:"sp_indate_e"},
        {name:"sp_price"},
        {name:"sp_stid"},
        {name:"sp_status"},
        {name:"sp_go_time"},
        {name:"sp_type"},
        {name:"sp_org_id"},
        {name:"sp_settle_price"},
        {name:"sp_site_id"},
        {name:"sp_site_name"},
        {name:"sp_ptype"},
        {name:"sp_time_lag"},
        {name:"sp_traffic"}
    ];
    var sp_url = $__app__ + '/StationPrice/PriceJson';
    var sp_store = SUNLINE.GroupingStore( sp_url, sp_fld, {sortInfo:{field:"sp_date_s",direction: "ASC"}, groupField:"sp_go_back" },false );
    function date_s(v){
        if (v==''){
            v = "<b>默认价格</b>";
        }
        return v;
    };

    function date_e(v){
        if (v==''){
            v = "永久有效";
        }
        return v;
    };

    var sp_grid = new Ext.grid.GridPanel({
        region:'east',
        border:false,
        split : true,
        width : 400,
        maxWidth : 600,
        minWidth : 350,
        store:sp_store,
        style :'border-left-width:1px;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无价格信息，请点选左表中的出发地查看相应的价格信息。',
            deferEmptyText : true
        },
        view : new Ext.grid.GroupingView({
            groupByText : '使用当前字段分组',
            showGroupsText : '分组显示',
            showGroupName : false,
            enableGroupingMenu:false,
            hideGroupedColumn : false,
            emptyText: '暂无价格信息。',
            groupTextTpl: '往返类型:{text}'
        }),
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"sp_id",width:60, hidden: true},
            {header:"往返情况",dataIndex:"sp_go_back",width:60,hidden:true},
            {header:"出发时间",dataIndex:"sp_go_time",width:60,renderer:default_time},
            {header:"时差(分钟)",dataIndex:"sp_time_lag",width:70},
            {header:"起(始)点站id",dataIndex:"sp_site_id",width:100,hidden:true},
            {header:"起(始)点站",dataIndex:"sp_site_name",width:100,renderer:default_site},
            {header:"销售价",dataIndex:"sp_price",width:50},
            {header:"结算价",dataIndex:"sp_settle_price",width:50},
            /*{header:"佣金",dataIndex:"sp_settle_price",width:50},*/
            {header:"开始时间",dataIndex:"sp_date_s",width:75,renderer:default_date_s},
            {header:"结束时间",dataIndex:"sp_date_e",width:75,renderer:default_date_e},
            {header:"产品类型",dataIndex:"sp_ptype",width:60,renderer:default_ptype}
        ],

        tbar:[
            '<b>班车策略：</b>',
            {iconCls:'button-add',cls: 'x-btn-icon', tooltip:'添加班车策略', act:'price_add', handler:price_modify},
            //'-',
            {iconCls:'button-edit',cls: 'x-btn-icon', tooltip:'编辑班车策略', act:'price_edit', handler:price_modify},
            //'-',
            {iconCls:'button-del',cls: 'x-btn-icon', tooltip:'删除班车策略', act:'price_del', handler:del_price},
            {iconCls:'button-ys',cls: 'x-btn-icon', tooltip:'设置是否有效', act:'price_status', handler:del_price},
            //'-',
            {iconCls:'button-ref',cls: 'x-btn-icon', tooltip:'刷新', handler:function () {
                if (sp_store.baseParams['sp_stid']) sp_store.load();
            }},
            '->',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function () {
                    parent.CloseTab();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:sp_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有价格信息'
        })
    });

    function default_time(v){
        if(!v) return "<b>默认时间</b>"
        return v;
    }

    function default_site(v){
        if(!v) return "<b>默认站点</b>"
        return v;
    }

    function default_date_s(v){
        if(!v) return "<b>默认时间</b>"
        return v;
    }

    function default_date_e(v){
        if(!v) return "<b>默认时间</b>"
        return v;
    }

    function default_ptype(v){
        var txt = v;
        Ext.each(product_type_data,function(val, key){
            var value = product_type_data[key];
            if(v==value[1]){
                txt = value[0];
                return false;
            }
        });
        if(!txt || txt==0) txt="无类型";
        return txt;
    }


    function price_modify(b){
        var row, row1, row2, msg='';
        var txt = (b.act == 'price_add') ? '添加' : '编辑';
        if (b.act == 'price_add'){
            row1 = row = grid.getSelectionModel().getSelected();
            msg = '请在左表中选择一个您要'+ txt + '班车策略的出发地。';
        }else{
            row1 = grid.getSelectionModel().getSelected();
            row2 = row = sp_grid.getSelectionModel().getSelected();
            msg = '请在选择一个您要'+ txt + '班车策略。';
        }
        if (!row){
            Ext.Msg.alert('友情提示', msg);
            return;
        };
        if (b.act == 'price_add'){
            var form_values = {
                sp_org_id:org_id,
                sp_id:0,
                sp_stid:row.get('st_id'),
                sp_name:row.get('st_name'),
                sp_type:row.get('st_type'),
                sp_price:0
            };
        }else{
            if (row.data.sp_date_s == '') {
                modify(b);
                return;
            }
            var j = row.data;
            j.sp_name = row1.get('st_name');
            j.sp_type = row1.get('st_type');
            var form_values = j;
        };
        price_win.show(b.id);
        strategy_form.getForm().setValues( form_values );
    };

    var strategy_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'datefield',
        defaults:{anchor:'90%' },
        items:[
            {id:"sp_id",name:"sp_id",fieldLabel:"ID",maxLength:"10",xtype:"hidden"},
            {id:"sp_org_id",name:"sp_org_id",fieldLabel:"所属公司",maxLength:"10",xtype:"hidden"},
            {id:"sp_name",name:"sp_name",fieldLabel:"sp_name",xtype:"hidden"},
            {id:"sp_type",name:"sp_type",fieldLabel:"sp_type",xtype:"hidden"},
            {id:"sp_go_time",name:"sp_go_time",fieldLabel:"出发时间",xtype:"textfield",allowBlank:false,blankText:"正确认格式:(10:30)"},
            {id:"sp_go_back",name:"sp_go_back",fieldLabel:"往返情况",
                xtype:"radiogroup",
                items:[
                    {boxLabel:"去程",name:"sp_go_back",inputValue:"去程",checked:true},
                    {boxLabel:"返程",name:"sp_go_back",inputValue:"返程"}
                ]
            },
            {id:"sp_time_lag",name:"sp_time_lag",fieldLabel:"时差(分钟)",xtype:'numberfield',blankText:"正确认格式:(10:30)"},
            {id:"sp_price",name:"sp_price",fieldLabel:"销售价格",maxLength:"9,2",xtype:'numberfield'},
            {id:"sp_settle_price",name:"sp_settle_price",fieldLabel:"结 算 价",maxLength:"9,2", xtype:'numberfield'},
            {id:"sp_site_id",name:"sp_site_id",fieldLabel:"终 点 站ID",xtype:"hidden"},
            {id:"sp_site_name",name:"sp_site_name",fieldLabel:"起(终)点站",xtype:"textfield"
                ,listeners:{'focus':station_list},allowBlank:false},
            /*{id:"sp_ptype_id",name:"sp_ptype_id",fieldLabel:"产品类型",xtype:"hidden"},
            {id:"sp_ptype",name:"sp_ptype",fieldLabel:"产品类型",xtype:"combo",
                store:new Ext.data.SimpleStore({
                    fields:["sp_ptype_name","sp_ptype"],
                    data:product_type_data
                }),
                triggerAction:"all",
                editable:false,
                valueField:"sp_ptype",
                displayField:"sp_ptype_name",
                mode:"local",
                value:10
            },*/
            SUNLINE.ExtDateField({id:'sp_date_s', fieldLabel:"开始日期",gang:'sp_date_e',start:true,value:today_date}),
            SUNLINE.ExtDateField({id:'sp_date_e', fieldLabel:"结束日期",gang:'sp_date_s',value:today_date}),
            {id:"sp_stid",name:"sp_stid",fieldLabel:"所属车站",maxLength:"10",allowBlank:false,xtype:"hidden"}
        ]
    });

    /*Ext.getCmp("sp_ptype").on({
        'select':function(_t,record,index){
            var pid=record.data.sp_ptype;
            Ext.getCmp("sp_ptype_id").setValue(pid);
        }
    });*/

    var price_win = new Ext.Window({
        title : '班车策略',
        width : 330,
        items : strategy_form,
        html: '<div style="padding: 0 10px 10px 10px;"><b>友情提示：</b><br>' +
            '　　1、出发时间、起(始)站点、开始、结束日期不能存在相交的现像<br>' +
            '　　2、出发时间必需是正确认的时间格式,例:10:30 <br >' +
            '　　3、时差请填写分钟,例:30' +
            '</div>',
        modal : true,
        closeAction : 'hide',
        buttons:[
            //{text:'值', handler:function(){ showFormValues(price_form) }},
            {text:'保存', handler:price_save},
            {text:'关闭', handler:function () {
                price_win.hide();
            }}
        ]
    });

    price_win.on("hide",function(b){
        strategy_form.getForm().reset();
    });

    function price_save(){
        if (!strategy_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '请填写班车策略的相关信息。');
            return;
        };
        var s = strategy_form.getForm().getValues();
        if(s.sp_go_time==0){
            Ext.Msg.alert('友情提示', '请填写正确的出发时间,例:(10:30)');
            Ext.getCmp("sp_go_time").setValue("");
            return;
        }
        var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存班车策略，请稍后...'});
        mask.show();
        Ext.Ajax.request({
            url:$__app__ + '/StationPrice/save',
            params : s,
            method : 'POST',
            submitEmptyText:false,
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var  msg  = result.info;
                if (result.status ==1) {
                    var id = parseInt(result.info);
                    if (!isNaN(id)) {
                        var msg = msg.substring(id.toString().length);
                        s.sp_id = id;
                        s.sp_status = '有效';
                        //sp_store.add(new Ext.data.Record(s));
                    } else {
                        var row = sp_grid.getSelectionModel().getSelected();
                        ChangeRowData(row, s, sp_store);
                        sp_store.commitChanges();
                    };
                    sp_store.load();
                    price_win.hide();
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '班车策略操作失败！');
            }
        });
    };

    function del_price(b){
        var row = sp_grid.getSelectionModel().getSelected();
        var txt = (b.act == 'price_status') ? '改变状态' : '删除';
        if ( !row ){
            Ext.Msg.alert('友情提示', '请选择您要'+txt+'的班车策略。');
            return;
        };
        if ( row.get('sp_indate_s')==0 ){
            Ext.Msg.alert('友情提示', '您选择的是默认价格，不能'+txt+'。');
            return;
        };
        Ext.Msg.confirm('友情提示', '您真的要'+ txt +'吗？', function(btn){
            if (btn == 'yes'){
                var s = {}, type = 'del';
                s.sp_id = row.get('sp_id');
                if (b.act == 'price_status'){
                    type = 'status';
                    s.sp_status = (row.get('sp_status')=="有效")?"无效":"有效";
                }else{
                    s.sp_status = "del";
                };

                var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存班车策略，请稍后...'});
                mask.show();

                Ext.Ajax.request({
                    url:$__app__ + '/StationPrice/change_status/' + type,
                    params : s,
                    method : 'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        var  msg  = result.info;
                        if (result.status ==1) {
                            if (type!='del'){
                                //var row = sp_grid.getSelectionModel().getSelected();
                                ChangeRowData(row, s, sp_store);
                                sp_store.commitChanges();
                            }else{
                                sp_store.reload();
                            }
                        };
                        Ext.Msg.alert('友情提示', msg);
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '班车策略的'+txt+'操作失败！');
                    }
                });
            }
        })
    }


    new Ext.Viewport({
        layout:'border',
        items:[ grid, sp_grid ]
    });

    function contact_manage(){
        contact_win.show();
    }
    var contact_store = SUNLINE.JsonStore( $__app__ +'/Station/getContact', ["contact_name","contact_tel"],false);
    var contact_cm = new Ext.grid.ColumnModel({
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"联系人姓名", dataIndex:"contact_name", width:120,editor: new Ext.form.TextField({ allowBlank: true ,id:"contact_name"})},
            {header:"联系方式", dataIndex:"contact_tel", width:120,editor: new Ext.form.NumberField({ allowBlank: false })}
        ],
        defaults:{sortable: true, menuDisabled:true}
    });
    var contact_grid = new Ext.grid.EditorGridPanel({
        region : 'center',
        border : false,
        height:400,
        store : contact_store,
        clicksToEdit:1,
        loadMask : {msg:'接送管理人数据载入中，请稍后'},
        cm : contact_cm, //表格列定义
        sm: new Ext.grid.RowSelectionModel({singleSelect:true}),//行选择模式(单选)
        viewConfig : {emptyText: '暂无接送联系人信息。'},
        tbar: [
            {text:'添加接送联系人',iconCls:'button-add',handler:function(){
                if(contact_store.getCount()>=5){
                    Ext.Msg.alert("友情提示","每个产品只可以设置5个接送联系人!");
                    return false;
                }
                contact_store.add(new Ext.data.Record({contact_name:'',contact_tel:''}));
            }},
            "-",
            {text:'删除接送联系人',iconCls:'button-del',handler:contact_del},
            '->',
            {text:'刷新', iconCls:'button-ref', handler:function(){contact_store.reload();} }
        ]

    });
    var contact_win=new Ext.Window({
        title:"接送联系人管理",
        width:400,
        height:400,
        closeAction:"hide",
        modal : true,
        items: contact_grid ,
        layout : 'border',
        buttons:[
            {text:'保存',handler:contact_save},
            {text:'关闭',handler:function(){
                contact_win.hide();
            }}
        ]
    });

    /*
    * 删除接送联系人
    * */
    function contact_del(){
         var contact_row = contact_grid.getSelectionModel().getSelected();
         contact_store.remove(contact_row);
    }

    /*
    * 保存接送联系人
    * */
    function contact_save(){
        var tmp = [],null_bool=true;
        contact_store.each(function(record){
            if(!record.data.contact_name || !record.data.contact_tel){
                null_bool=false;
                return false;
            };
            tmp.push( record.data) ;
        });
        if(null_bool==false){
            Ext.Msg.alert('友情提示','接送联系人存在空值，请修改后再提交！');
            return;
        };
        var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在保存，请稍后...'});
        mask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Station/saveContact',
            method : 'POST',
            params : {p_contact:Ext.encode(tmp),p_id:st_id},
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                mask.hide();
                if (rst.status=='1'){
                    Ext.Msg.alert("友情提示",rst.info);
                    contact_win.hide();
                }else{
                    Ext.Msg.alert("友情提示","接送联系人信息保存失败!");
                }
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '接送联系人信息保存失败！请稍候再试。');
            }
        });
    }

    contact_win.on("show",function(){
        contact_store.baseParams.p_id=st_id;
        contact_store.reload();
    });
    contact_win.on("hide",function(){
        contact_store.removeAll();
    });

    function money_txt(v){
        if(v=="0.00"){
            return "免费";
        }
        return v;
    }

    /*取出所有始发站与出发口岸选择*/
    var station_url2 = $__app__ + '/Station/shuttle_bus';
    var station_fld2 = ["st_id","st_name","st_pym","st_group","st_type","st_charge","st_cost","st_province","st_city","st_county","st_go_time","st_go_times","st_org_id","st_site_name","st_order","st_status","st_time"];
    var station_store2 = SUNLINE.JsonStore(station_url2, station_fld2, false);
    station_store2.baseParams['limit'] = 10;
    station_store2.baseParams['st_org_id'] = current_org.id;
    station_store2.baseParams['type_site'] = "1";
    var station_cm2 = new Ext.grid.ColumnModel({
        columns:[
            new Ext.grid.RowNumberer(),
            /*new Ext.grid.CheckboxSelectionModel(),*/
            {header:"ID号", dataIndex:"st_id", width:60, hidden:true},
            /*{header:"集合时间", dataIndex:"st_go_time", width:70,hidden:true},*/
            {header:"出发地点", dataIndex:"st_name", width:180},
            /*{header:"排序", dataIndex:"st_order", width:60,hidden:true},*/
            {header:"所属分组", dataIndex:"st_group", width:100, renderer:show_group},
            {header:"类型", dataIndex:"st_type", width:100},
            {header:"所属区域", dataIndex:"st_district", width:120,renderer:fullDress}
        ],
        defaults:{sortable: true}
    });

    var station_grid2 = new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        store : station_store2,
        loadMask : {msg:'站点数据载入中，请稍后'},
        cm : station_cm2, //表格列定义
       /* sm : new Ext.grid.CheckboxSelectionModel(), //行选择模式(单选)*/
        viewConfig : {emptyText: '暂无站点信息。'},

        tbar: [
            {text:'刷新', iconCls:'button-ref', handler:function(){station_store2.reload();} },
            '->',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'do_search',
                emptyText:'出发地点、拼音码等',
                width:150,
                onTriggerClick:function (e) {
                    do_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            do_search();
                        }
                    }
                }
            }
        ],

        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: station_store2,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        })

    });

    station_store2.on('load', function(){
        var row = grid.getSelectionModel().getSelected();
        if(row.get('sb_goback_type') == '返程'){
            station_grid2.getColumnModel().setHidden(3,true);
        }else{
            station_grid2.getColumnModel().setHidden(3,false);
        }
    });

    function do_search(){
        var skey = Ext.getCmp('do_search').getValue() ;
         station_store2.baseParams['skey'] = skey;
         station_store2.load();
    }

    var station_win2 = new Ext.Window({
        title:'选择站点',
        width : 570,
        height : 400,
        closeAction : 'hide',
        modal : true,
        items : station_grid2,
        layout : 'fit',
        buttons:[
            {text:'加入起(始)站点',handler:add_shuttle},
            {text:'关闭', handler:function(){station_win2.hide();} }
        ]
    });

    station_win2.on('show', function(){
        station_store2.load();
    });

    /**
     * 增加站点的处理方法
     * @param b
     */
    function station_list(b){
        var _row = grid.getSelectionModel().getSelected();
        if (!_row){
            Ext.Msg.alert('友情提示', '请在左侧表格中选择您要增加站点的班车规则。');
            return;
        };
        station_store2.baseParams['_not_in'] = _row.get('sb_stations');
        station_win2.show(b.id);
    };

    /**
     * 加入规则的处理方法
     * @param b
     */
    function add_shuttle(b){
        var s = station_grid2.getSelectionModel().getSelected();
        if (!s){
            Ext.Msg.alert('友情提示', '请选择始发站或出发口岸!');
            return;
        };
        Ext.getCmp("sp_site_id").setValue(s.get("st_id"));
        Ext.getCmp("sp_site_name").setValue(s.get("st_name"));
        station_win2.hide();
    };


    /*八达通选择*/
    var map_win=new Ext.Window({
        title:"设置为八达通班车",
        width:800,
        height:500,
        closeAction:"hide",
        modal : true,
        html: '<iframe src="'+$__app__+'/Station/map_draw" id="if_station" name="if_station" style="border:none;width:100%;height:100%"></iframe>' ,
        buttons:[
            {text:'恢复初始状态',handler:map_station},
            {text:'取消设置',handler:map_add},
            {text:'保存设置',handler:map_add},
            {text:'关闭',handler:function(){
                map_win.hide();
            }}
        ]
    });
    function map_station(b){
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设为八达通的站点！');
            return;
        };
        var txt = row.get('st_city')+" "+row.get('st_county');
        var map_id = row.get("st_map");
        map_win.show();
        if(map_id){
            map_win.setTitle("设置为八达通班车<font style='color: red'>[此站点已经是八达通班车]</font>");
        }else{
            map_win.setTitle("设置为八达通班车<font style='color: #188C2B'>[此站点未设置成八达通班车]</font>");
        }
        setTimeout(function(){
            if(b.text=="恢复初始状态" || !map_id){
                map_select(txt);
            }else{
                map_select(txt,map_id);
            }
        },1000)
    }

    function map_add(b){
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设为八达通的站点！');
            return;
        };
        var if_station = document.getElementById("if_station");
        var txt = window.if_station.bd_GON();
        var s = {st_map: txt, st_id:row.get("st_id")};
        if(b.text=="取消设置") s["st_map"]="";
        Ext.Msg.confirm('友情提示', '您真的要'+ b.text+'吗？',function(btn){
            if (btn == 'yes'){
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"数据提交中，请稍候..."});
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/Station/map_add',
                    params : s,
                    success : function(response, opts){
                        var rst = Ext.decode(response.responseText);
                        Ext.Msg.alert("友情提示",rst.info);
                        myMask.hide();
                        if(rst.status==1){
                            map_win.hide();
                            store.load();
                        }
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', b.text+'线路信息遇到未知错误！未能'+ b.text+'。',function(){});
                    }
                });
            }
        });
    }

    function map_select(txt,id_map){
        var if_station = document.getElementById("if_station");
        window.if_station.select_map(txt,id_map);
    };

    function full_map(v){
        if(v){
            return "八达通";
        }else{
            return "普通";
        }
    }
 });