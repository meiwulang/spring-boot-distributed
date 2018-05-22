var ROW = {};
GUIDE_WORK = {};
ORGTree.rootText = '班车规则管理';
var WG={};
var authBank={};
var rebate_row={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '班车规则';

    function rebate_fun(v, fld, dw){
        if (!v) return '<span style="color: grey;">未设置</span>';
        var s = Ext.decode(v);
        return s[fld] + dw;
    }



    var url = $__app__ + '/ShuttleBus/fang';
    var fld = ["sb_id","sb_name","sb_weekly","sb_stations","sb_orgid","sb_status","sb_type","sb_start_date","sb_end_date","sb_goback_type","sb_back_stand","sb_back_stand_name","sb_back_time"];
    //var store = new SUNLINE.JsonStore(url, field);
    var _store=SUNLINE.GroupingStore(url,fld,{sortInfo:{field:'sb_id',direction: "DESC"}, groupField:'sb_goback_type'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "往返类型: {name}"
    });


    var _cm =[
        new Ext.grid.RowNumberer(),
        {header:"ID",dataIndex:"sb_id",width:60, hidden:true},
        {header:"规则名称",dataIndex:"sb_name",width:200},
        {header:"往(返)始发站ID",dataIndex:"sb_back_stand",width:100, hidden:true },
        {header:"往(返)始发站",dataIndex:"sb_back_stand_name",width:100 },
        {header:"往返类型",dataIndex:"sb_goback_type",width:70 },
        {header:"周几有效",dataIndex:"sb_weekly",width:160, renderer:SUNLINE.weekRenderer},
        {header:"开始日期",dataIndex:"sb_start_date",width:120,renderer:function(v){return int2date(v);} },
        {header:"结束日期",dataIndex:"sb_end_date",width:120,renderer:function(v){return int2date(v);} },
        {header:"往(返)返始发时分",dataIndex:"sb_back_time",width:120 }
    ];



    var _grid = new Ext.grid.GridPanel({
        region:'center',

//        split : true,
        border:false,
        store:_store,
        loadMask:{msg:'数据载入中，请稍后'},
        columns:_cm,
        features: [groupingFeature],
        style : 'border-right-width:1px;',

        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:del},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                _store.load();
            }},
            '-',
            '往返类型:',
            {
                xtype:"combo",
                id:"sb_goback_type_z",
                name:"sb_goback_type_z",
                width:200,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['sb_goback_type_z'],
                    data:[
                        ['全部'],
                        ['去程'],
                        ['返程']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"sb_goback_type_z",
                displayField:"sb_goback_type_z",
                mode:"local",
                value:'全部'
            },


            '->',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有班车规则管理信息'
        })
    });

    Ext.getCmp('sb_goback_type_z').on({'select':function(c,r,n){
        var row= r[0];
        var sb_goback_type_z=row.get('sb_goback_type_z');

        _store.load({
            params:{sb_goback_type:sb_goback_type_z}
        });

    }});
    var weekly = SUNLINE.weekCheckboxGroup({
     id:'sb_weekly',
     fieldLabel:'周几有效',
     name:'sb_weekly',
     width:'100%'
     });
    //var weekly = SUNLINE.weekCheckboxGroup({id:'sb_weeklys', fieldLabel:'周几有效'});

    var form = new Ext.form.FormPanel({
        layout:'column',
        border:false,
        split : true,
        autoHeight : true,
        bodyStyle:'background:none;padding:10px',
        width:600,
        labelAlign:'right',
        defaults : {
            border : false,
            bodyStyle:'background:none;',
            defaultType:'textfield',
            layout : 'form',

            labelWidth:100

        },
        items:[
            {
                columnWidth :1,
                defaults: {width:462},
                items : [
                    {id:"sb_id",name:"sb_id",fieldLabel:"ID",xtype:"hidden"},
                    {id:"sb_orgid",name:"sb_orgid",fieldLabel:"所属单位",xtype:"hidden"},
                    {id:"sb_name",name:"sb_name",fieldLabel:"规则名称",xtype:"textfield"},
                    //{id:"sb_name",name:"sb_name",fieldLabel:"规则名称",allowBlank:false},
                    SUNLINE.ExtDateField({id:'sb_start_date',name:'sb_start_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",width:280,gang:'sb_end_date',start:true}),
                    SUNLINE.ExtDateField({id:'sb_end_date',name:'sb_end_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",width:280,gang:'sb_start_date'}),
                    /*ddd,*/
                    weekly,
                    {
                        xtype:'radiogroup',
                        fieldLabel:'往返类型',
                        id: 'sb_goback_type',

                        items: [
                            {boxLabel: '去程',id:'sb_goback_type_id1', name: 'sb_goback_type', width:230, inputValue: '去程', checked: true},
                            {boxLabel: '返程',id:'sb_goback_type_id2', name: 'sb_goback_type', inputValue: '返程'}
                        ]
                    },
                    {id:"sb_back_time",name:"sb_back_time",fieldLabel:'往(返)时分',maxLength:"5",dallowBlank:true,emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'},
                    {id:"sb_back_stand_name",name:"sb_back_stand_name",fieldLabel:"起(终)点站",xtype:"textfield"
                        ,listeners:{'focus':station_list_1},allowBlank:false},
                    {id:"sb_back_stand",name:"sb_back_stand",fieldLabel:"往(返)始发站名称ID",xtype:"hidden"}
                ]
            }
        ]
    });


    /*取出所有始发站与出发口岸选择*/
    var station_url2_1 = $__app__ + '/ShuttleBus/shuttle_bus';
    var station_fld2_1 = ["st_id","st_name","st_pym","st_group","st_type","st_charge","st_cost","st_province","st_city","st_county","st_go_time","st_go_times","st_org_id","st_site_name","st_order","st_status","st_time"];
    var station_store2_1 = SUNLINE.JsonStore(station_url2_1, station_fld2_1, false);

    var station_cm2_1 = [
        new Ext.grid.RowNumberer(),
        {header:"ID号", dataIndex:"st_id", width:60, hidden:true},
        {header:"出发地点", dataIndex:"st_name", width:180},
        {header:"类型", dataIndex:"st_type", width:100},
        {header:"所属区域", dataIndex:"st_district", width:120,renderer:fullDress}
    ];

    var station_grid2_1 = new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        columns:station_cm2_1, //表格列定义
        store : station_store2_1,
        //loadMask : {msg:'站点数据载入中，请稍后'},

        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: station_store2_1,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        }),
        tbar:[
            {text:'刷新', iconCls:'button-ref', handler:function () {
                var s=form.getForm().getValues();
                station_store2_1.load({
                    params:{sb_goback_type:s['sb_goback_type']}
                });

            }},
            '-',
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'station_grid2_dosearch',
                emptyText:'始发站或出发口岸名称等',
                width:150,
                onTriggerClick:function (e) {
                    station_grid2_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            station_grid2_dosearch();
                    }
                }
            }
        ]

    });

    function station_grid2_dosearch(){
        var skey=Ext.getCmp('station_grid2_dosearch').getValue();
        var s=form.getForm().getValues();
        station_store2_1.load({params:{start:0,limit:pageSize,key:skey,sb_goback_type:s['sb_goback_type']}});
    }



    var station_win2_1 = new Ext.Window({
        title:'选择站点',
        width : 570,
        height : 400,
        closeAction : 'hide',
        modal : true,
        items : [station_grid2_1],
        layout : 'fit',
        buttons:[
            {text:'加入起(始)站点',handler:add_shuttle_1},
            {text:'关闭', handler:function(){station_win2_1.hide();} }
        ]
    });

    /**
     * 加入规则的处理方法
     * @param b
     */
    function add_shuttle_1(b){
        var s =SUNLINE.getSelected(station_grid2_1);
        //var s = station_grid2.getSelectionModel().getSelected();
        if (!s){
            Ext.Msg.alert('友情提示', '请选择始发站或出发口岸!');
            return;
        };
        Ext.getCmp("sb_back_stand").setValue(s.get("st_id"));
        Ext.getCmp("sb_back_stand_name").setValue(s.get("st_name"));

        station_win2_1.hide();
    };



    function station_list_1(){
        station_win2_1.show();
    }

    station_win2_1.on('show', function(){
        var s=form.getForm().getValues();
        station_store2_1.load({
            params:{sb_goback_type:s['sb_goback_type']}
        });
    });


    var _win = new Ext.Window({
        title : '班车规则',
        width:600,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                _win.hide();
            }}
        ]
    });

    function dosave() {
        //console.log(form.getForm().getValues());
        //return
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = form.getForm().getValues();
        s['sb_orgid']=3521;
        Ext.Ajax.request({
            url:$__app__ + '/ShuttleBus/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                Ext.Msg.alert('友情提示','操作成功！');
                _store.reload();
                _win.hide();
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };





    function modify(v){
        var f_id=form.getForm();
        f_id.reset();
        if(v.text=='添加'){
            WG.values='';
        }else{
            var row=SUNLINE.getSelected(_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择要编辑的班车规则');
                return;
            }
            WG.values=row.data;
            form.getForm().setValues(WG.values);

            if(row.data.sb_goback_type=='去程'){
                Ext.getCmp('sb_goback_type_id1').setValue(true)
            }else{
                Ext.getCmp('sb_goback_type_id2').setValue(true)
            }
            sb_weekly_id=row.get('sb_weekly');
            SUNLINE.weekSetValues(weekly,sb_weekly_id );

        }
        _win.setTitle(v.text+"班车规则", v.iconCls);
        _win.show();

    }

    //删除
    function del(){
        var row=SUNLINE.getSelected(_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }

        var id = row.get('sb_id');
        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/ShuttleBus/save',
                    method : 'POST',
                    params : { sb_id :id,sb_status:'del'},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功');
                        _store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }


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












    var shuttle_fld = [
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
    var shuttle_url = $__app__ + '/ShuttleBus/load_sp_grid_tow';
    var shuttle_store = new SUNLINE.JsonStore(shuttle_url,shuttle_fld,false);


    var shuttle_store=SUNLINE.GroupingStore(shuttle_url,shuttle_fld,{sortInfo:{field:'sp_id',direction: "DESC"}, groupField:'sp_name'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
    groupHeaderTpl: "往返类型: {name}"
    });

    var shuttle_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID号", dataIndex:"sp_id", width:60, hidden:true},
        {header:"时间", dataIndex:"sp_go_time", width:60},
        {header:"站点名称", dataIndex:"sp_name", width:120},
        {header:"类型", dataIndex:"sp_type", width:60},
        {header:"销售金额", dataIndex:"sp_price", width:80,renderer:money},
        {header:"结算金额", dataIndex:"sp_settle_price", width:80,renderer:money},
        {header:"所属区域", dataIndex:"st_district", width:120,renderer:fullDress},
        {header:"开始日期", dataIndex:"sp_date_s", width:120},
        {header:"结束日期", dataIndex:"sp_date_e", width:120}
    ];


    var station_grid = new Ext.grid.GridPanel({
        region:'east',
        border:false,
        split : true,
        width : 600,
        maxWidth : 800,
        minWidth : 350,
        store:shuttle_store,
        loadMask:{msg:'数据载入中，请稍后'},

        columns:shuttle_cm,
        features: [groupingFeature],
        style : 'border-left-width:1px;',
        tbar: [
            '<b>已选站点</b>',
            '-',
            {text:'增加站点', id:'add_shuttle_bus', handler:station_list},
            {text:'移除站点', handler:remove_station },
            {text:'刷新', handler:function(){shuttle_store.reload();}},
            '->',

            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){ window.location.reload(); }
            }
        ],

        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: shuttle_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        })

    });

    /**
     * 移除站点的处理方法
     * @param b
     */
    function remove_station(b){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择左边您想要移除的班车规则。')
            return;
        }
        var selected=SUNLINE.getSelected(station_grid);
        if (!selected){
            Ext.Msg.alert('友情提示', '请选择您想要移除的站点。');
            return;
        }
        Ext.Msg.confirm('友情提示', '将删除此站点整组数据;<br>您确定移除所选站点信息吗？',function(btn){
            var sp_stid_dd=selected.get('sp_stid')
            var sb_id_dd=row.get('sb_id')
            if (btn=='yes'){
                real_remove(sp_stid_dd,sb_id_dd);
            }
        });
    };

    /**
     * 真正移除的方法
     * @param selections
     */
    function real_remove(sp_stid_dd,sb_id_dd){
        /*var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();*/
        alert(sb_id_dd+sp_stid_dd)
        Ext.Ajax.request({
            url: $__app__ + '/ShuttleBus/remove_station',
            method : 'POST',
            params : {st_id:sp_stid_dd,sb_id:sb_id_dd},
            success:function (response, otps) {
                /*myMask.hide();*/
                Ext.Msg.alert('友情提示','移除站点成功！');
                shuttle_store.reload();

            },
            failure:function (response, otps) {
                /*myMask.hide();*/
                Ext.Msg.alert( '友情提示', '对不起！请求异常，暂时无法移除您选择的站点。' );
            }
        });
    };

    //选择行赋值事件
    _grid.on('cellclick',function(sm,rowIdx,c,r){
        var row =r.data;
        var sb_idid=row.sb_id;
        /*sp_grid.baseParams['sp_stid']=st_id;*/
        var baseParams = {sb_id:sb_idid};
        baseParams['start']=0;
        baseParams['limit']=pageSize;
        shuttle_store.load({params:baseParams});
        loadLinkForm(sb_idid);

    });


    function loadLinkForm(sc_id){
        Ext.Ajax.request({
            url:$__app__+'/ShuttleBus/load_sp_grid',
            params:{sb_id:sc_id},
            method:'POST',
            success:function(r, otps){
                var ret = Ext.decode(r.responseText);   //获取返回的信息
                //shuttle_store.load();
                //so.setValues(ret.root[0]);
            }
        })
    };

    /*取出所有班车站与顺路站选择*/
    var station_url2_2 = $__app__ + '/ShuttleBus/shuttle_bus_2';
    var station_fld2_2 = ["st_id","st_name","st_pym","st_group","st_type","st_charge","st_cost","st_province","st_city","st_county","st_go_time","st_go_times","st_org_id","st_site_name","st_order","st_status","st_time"];
    var station_store2_2 = SUNLINE.JsonStore(station_url2_2, station_fld2_2, false);

    var station_cm2_2 = [
        new Ext.grid.RowNumberer(),
        {header:"ID号", dataIndex:"st_id", width:60, hidden:true},
        {header:"ID号", dataIndex:"sb_id", width:60, hidden:true},
        {header:"出发地点", dataIndex:"st_name", width:180},
        {header:"类型", dataIndex:"st_type", width:100},
        {header:"所属区域", dataIndex:"st_district", width:120,renderer:fullDress}
    ];

    var station_grid2_2 = new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        columns:station_cm2_2, //表格列定义
        store : station_store2_2,
        //loadMask : {msg:'站点数据载入中，请稍后'},

        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: station_store2_2,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        }),
        tbar:[
            {text:'刷新', iconCls:'button-ref', handler:function () {

                var ss=SUNLINE.getSelected(_grid);

                var sb_back_Stand_value=ss.get('sb_back_stand');
                var sb_Stand_value=ss.get('sb_stations');
                station_store2_2.load({params:{sb_back_stand:sb_back_Stand_value,sb_stations:sb_Stand_value}});

            }},
            '-',
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'station_grid2_dosearch_2',
                emptyText:'班车站或顺路站名称',
                width:150,
                onTriggerClick:function (e) {
                    station_grid2_dosearch_2();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            station_grid2_dosearch_2();
                    }
                }
            }
        ]

    });

    function station_grid2_dosearch_2(){

        var skey=Ext.getCmp('station_grid2_dosearch_2').getValue();
        var s=form.getForm().getValues();
        var ss=SUNLINE.getSelected(_grid);
        var sb_back_Stand_value=ss.get('sb_back_stand');
        station_store2_2.load({params:{start:0,limit:pageSize,key:skey,sb_back_stand:sb_back_Stand_value}});
    }

    //右边添加站点表单
    var station_win2_2 = new Ext.Window({
        title:'选择站点',
        width : 500,
        height : 400,
        closeAction : 'hide',
        modal : true,
        items : [station_grid2_2],
        layout : 'fit',
        buttons:[
            {text:'加入起(始)站点',id:'win2_2_buttons',handler:add_shuttle_2},
            {text:'关闭', handler:function(){station_win2_2.hide();} }
        ]
    });

    /*Ext.getCmp('win2_2_buttons').on({'cellclick':function(sm,rowIdx,c,r){
        var row =SUNLINE.getSelected(_grid);
        var aa=row.get('sb_id');
        alert(11)
    }});*/

    function station_list(){
        station_store2_2.load();
        var row,msg='';
        var row =SUNLINE.getSelected(_grid);
        msg = '请在左表中选择一个您要添加的班车规则。';

        if (!row){
            Ext.Msg.alert('友情提示', msg);
            return;
        };
        station_win2_2.show();
    }

    station_win2_2.on('show', function(){
        var ss=SUNLINE.getSelected(_grid);
        var sb_id_dd=ss.get('sb_id')

        var s =SUNLINE.getSelected(_grid);

        station_store2_2.load({
            params:{sb_back_stand: s.get('sb_back_stand'),sb_stations:s.get('sb_stations')/*,sb_id:sb_id_dd*/}
        });
        //_store.load();
    });



    function add_shuttle_2(){
        var s =SUNLINE.getSelected(station_grid2_2);
        if (!s){
            Ext.Msg.alert('友情提示', '请选择站点!');
            return;
        };
        var st_id_one=s.get("st_id");

        var aass=_grid.getSelectionModel().getSelection()[0];
        var asd=aass.get('sb_id');
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        station_win2_2.hide();
        Ext.Ajax.request({
            url : $__app__ + '/ShuttleBus/add_shuttle_one',
            method : 'POST',
            params : { st_id :st_id_one,sb_id:asd},
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示','班车策略操作成功！');


                shuttle_store.reload();
                _store.reload();
                station_win2_2.hide();


                myMask.hide();
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '站点添加失败！');
            }
        });
    }



    new Ext.Viewport({
        layout : 'border',
        items : [_grid, station_grid]
    });





});
