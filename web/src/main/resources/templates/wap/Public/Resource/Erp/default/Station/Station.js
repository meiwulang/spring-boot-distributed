var ROW = {};
var WG={};
var org_id=_uinfo.org_id;
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var thisTitle = '出发地管理';


    url = $__app__ + '/Station/dataJson';


    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        url = $__app__ + '/Station/dataJson';
    }else{
        url = $__app__ + '/Station/fen_select';
    }

    var field = [ {name:"st_id"}];
    var store = new SUNLINE.JsonStore(url, field);
    SUNLINE.baseParams(store,{'at_org_id':org_id});

    store.load();


    var st_cm=[
        new Ext.grid.RowNumberer({width:70,header:'序号',align:'center'}),
        {header:"ID号", dataIndex:"st_id", width:60, hidden:true},
        {header:"出发地点", dataIndex:"st_name", width:180},
        {header:"排序", dataIndex:"st_order", width:60,hidden:true},
        {header:"类型", dataIndex:"st_type", width:100},
        {header:"所属区域", dataIndex:"st_district", width:200,renderer:fullDress}
    ];

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
        columns:st_cm,
        tbar:[
            {text:'添加', iconCls:'button-add',handler:modify, disabled:isDisabled('Station::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:modify, disabled:isDisabled('Station::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:st_del, disabled:isDisabled('Station::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                store.reload();
                sp_store.removeAll();
            }},
            '-',
            '选择类型:',
            {
                xtype:"combo",
                id:"st_type2",
                name:"st_type2",
                width:100,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['st_type2'],
                    data:[
                        ['全部'],
                        ['顺路站'],
                        ['班车站']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"st_type2",
                displayField:"st_type2",
                mode:"local",
                value:'全部'
            },
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'st_dosearch_id',
                emptyText:'出发地名称、类型、拼音码',
                width:200,
                onTriggerClick:function (e) {
                    st_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            st_dosearch();
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

    function st_dosearch(){
        var key=Ext.getCmp('st_dosearch_id').getValue();
        SUNLINE.baseParams(store,{skey:key},true);
        store.currentPage=1;
        store.load();
        sp_store.removeAll();
    }

    Ext.getCmp('st_type2').on({'select':function(c,r,n){
        var row= r[0];
        var st_type_r=row.get('st_type2');
        if(st_type_r=='全部'){
            st_type_r=''
        }
        SUNLINE.baseParams(store,{st_type:st_type_r});
        store.currentPage=1;
        store.load();

    }});

    //添加表单
    var province_combo=SUNLINE.ComBoxCity({
        id:'st_province',
        where:{city_type:'province'},
        config:{fieldLabel:"省份",labelWidth:100,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('st_city_id').getValue() ) Ext.getCmp('st_city_id').setValue();
                if( Ext.getCmp('st_county_id').getValue() ) Ext.getCmp('st_county_id').setValue();
            }
        },emptyText:'请选择省份'}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'st_city',
        where:{city_type:'city'},
        appTo:'st_province',
        config:{fieldLabel:"城市",labelWidth:100,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('st_county_id').getValue() ) Ext.getCmp('st_county_id').setValue();
            }
        },emptyText:'请选择城市'}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'st_county',
        where:{city_type:'county'},
        appTo:'st_city',
        config:{fieldLabel:"区/县",labelWidth:100,labelAlign:'right',allowBlank:false,editable:false, emptyText:'请选择区/县'}
    })

    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"st_id", name:"st_id", fieldLabel:"ID", maxLength:"10", allowBlank:false, xtype:"hidden",labelAlign:"right"},
            {id:"st_org_id", name:"st_org_id", fieldLabel:"ORG_ID", maxLength:"10", allowBlank:false, xtype:"hidden",labelAlign:"right",value:org_id},
            {id:"st_name", name:"st_name", fieldLabel:"出发地点", maxLength:"100",labelAlign:"right",allowBlank:false,vtype:'NotBlank'},
            {
                xtype:"combo",
                id:"st_type",
                name:"st_type",
                fieldLabel:"类型",
                allowBlank:false,
                labelAlign:"right",
                store:new Ext.data.SimpleStore({fields:['st_type'], data:[
                    ['班车站'],
                    ['顺路站']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"st_type",
                displayField:"st_type",
                mode:"local",
                value:'班车站'
            },
            province_combo,
            city_combo,
            county_combo
        ]
    });

    var win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:t_save},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    function t_save(){
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/Station/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                myMask.hide();
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    store.reload();
                    win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }


    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            win.show();
            form.getForm().setValues(row.data);
        }else{
            win.show();
        }
        win.setTitle(v.text+"出发地信息", v.iconCls);
    }

    win.on('hide',function(){
        form.getForm().reset();
    })


    //删除
    function st_del(){
        var row=SUNLINE.getSelected(grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的出发地点！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该出发地点吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Station/del',
                    params:{st_id:row.data.st_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
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



    function fullDress_start(v,m,r){
        var province = r.get('sd_province');
        if(province == null) {province = ""};
        var city = r.get('sd_city');
        if(city == null) {city = ""};
        var county = r.get('sd_county') ? r.get('sd_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    /*右边*/
    var sp_fld = [{name:"sp_go_back"}];
    var sp_url = $__app__ + '/StationPrice/dataJson';
    var sp_store = new SUNLINE.JsonStore(sp_url,sp_fld,false);

    var sp_store=SUNLINE.GroupingStore(sp_url,sp_fld,{sortInfo:{field:'sp_id',direction: "DESC"}, groupField:'sp_go_back'},false);
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "往返类型: {name}"
    });

    var sp_cm=[
        new Ext.grid.RowNumberer({width:30}),
        //{xtype:'rownumberer',width:100},
        {header:"ID",dataIndex:"sp_id",width:60, hidden: true},
        {header:"sp_stid",dataIndex:"sp_stid",width:60, hidden: true},
        {header:"出发时间",dataIndex:"sp_go_time",width:80},
        {header:"时差(分钟)",dataIndex:"sp_time_lag",width:90},
        {header:"起(始)点站id",dataIndex:"sp_site_id",width:100,hidden:true},
        {header:"起(始)点站",dataIndex:"sp_site_name",width:100},
        /*{header:"销售价",dataIndex:"sp_price",width:75},*/
        {header:"结算价",dataIndex:"sp_settle_price",width:75},
        {header:"开始时间",dataIndex:"sp_date_s",width:100,renderer:time_sp_date_s},
        {header:"结束时间",dataIndex:"sp_date_e",width:100,renderer:time_sp_date_e}
    ];

    var sp_grid = new Ext.grid.GridPanel({
        region:'east',
        border:false,
        split : {size:3},
        width : 600,
        maxWidth : 800,
        minWidth : 350,
        store:sp_store,
        style :'border-left-width:1px;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无班车策略信息，请点选左表中的出发地查看相应的信息。',
            deferEmptyText : true
        },
        columns:sp_cm,
        features: [groupingFeature],
        tbar:[
            '<b>班车策略：</b>',
            {iconCls:'button-add',id:'add',cls: 'x-btn-icon', text:'添加',handler:price_modify, disabled:isDisabled('StationPrice::save')},
            '-',
            {iconCls:'button-edit',id:'edit',cls: 'x-btn-icon', text:'编辑',handler:price_modify, disabled:isDisabled('StationPrice::save')},
            '-',
            {iconCls:'button-del',id:'del',cls: 'x-btn-icon', text:'删除',handler:price_del, disabled:isDisabled('StationPrice::del')}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:sp_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有班车策略信息'
        })
    });


    //选择行赋值事件
    grid.on('select',function(i,v){
        if(v.data.st_type=='顺路站'){
            Ext.getCmp('add').setDisabled(true);
            Ext.getCmp('edit').setDisabled(true);
            Ext.getCmp('del').setDisabled(true);
        }else{
            Ext.getCmp('add').setDisabled(false);
            Ext.getCmp('edit').setDisabled(false);
            Ext.getCmp('del').setDisabled(false);
        }
        key=v['data']['st_id'];
        SUNLINE.baseParams(sp_store,{sp_stid:key});
        sp_store.currentPage=1;
        sp_store.load();
    })

    //右边添加表单

    var weekly_list= SUNLINE.weekCheckboxGroupThree({
        width:400,
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'t_weekly',
        config:{id:'t_weekly',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false}
    });


    var sd_start_type_combo=SUNLINE.DictComBox_false({id:'sp_station_type',name:'sp_station_type',fieldLabel:"交通方式",labelWidth:80,width:280,labelAlign:"right",allowBlank:false,value:'火车',listeners:{select:function(r){Ext.getCmp('sp_site_name').setValue('');}}},{'d_type':'交通类目'});
    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaultType:'textfield',
        defaults:{labelAlign:"right",width:280 ,labelWidth:80,},
        items:[
            {id:"sp_id",name:"sp_id",fieldLabel:"ID",maxLength:"10",xtype:"hidden"},
            {id:"sp_stid",name:"sp_stid",fieldLabel:"sp_stid",maxLength:"10",xtype:"hidden"},
            {id:"sp_org_id",name:"sp_org_id",fieldLabel:"所属公司",maxLength:"10",xtype:"hidden"},
            {id:"sp_name",name:"sp_name",fieldLabel:"sp_name",xtype:"hidden"},
            {id:"sp_type",name:"sp_type",fieldLabel:"sp_type",xtype:"hidden"},
            {
                xtype:"combo",
                id:"sp_go_back",
                name:"sp_go_back",
                fieldLabel:"往返情况",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['sp_go_back'], data:[
                    ['去程'],
                    ['返程']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"sp_go_back",
                displayField:"sp_go_back",
                mode:"local",
                value:'去程'
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: '应用到返程',
                defaultType: 'checkboxfield',
                id: 'copy_to_back',
                hidden: true,
                items: [
                    {
                        boxLabel  : '',
                        name      : 'copy_to_back',
                        inputValue: '1',
                        id        : 'checkbox1'
                    }
                ]
            },
            {name:"sp_go_time",id:"sp_go_time",width:280,fieldLabel:"出发时间",xtype:"textfield"},
            sd_start_type_combo.box,
            {id:"sp_time_lag",name:"sp_time_lag",width:280,fieldLabel:"时差(分钟)",xtype:'numberfield',blankText:"正确认格式:(10:30)",value:0},
            {id:"sp_price",name:"sp_price",fieldLabel:"销售价格",maxLength:"9,2",xtype:'numberfield',value:0,hidden:true},
            {id:"sp_settle_price",name:"sp_settle_price",fieldLabel:"结 算 价",maxLength:"9,2", xtype:'numberfield',value:0},
            {id:"sp_site_id",name:"sp_site_id",fieldLabel:"终 点 站ID",xtype:"hidden"},
            {id:"sp_site_name",name:"sp_site_name",fieldLabel:"起(终)点站",xtype:"textfield"
                ,listeners:{'focus':station_list},allowBlank:false},
            SUNLINE.ExtDateField({id:'sp_date_s',name:'sp_date_s',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",width:280,gang:'sp_date_e',start:true}),
            SUNLINE.ExtDateField({id:'sp_date_e',name:'sp_date_e',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",width:280,gang:'sp_date_s'}),
            weekly_list,
            {id:"sp_stid",name:"sp_stid",fieldLabel:"所属车站",maxLength:"10",allowBlank:false,xtype:"hidden"}
        ]
    });

    Ext.getCmp('sp_go_back').on('select',function(t,r,i){
        var v = Ext.getCmp('sp_go_back').getValue();
        if(v == '去程'){
            var s = false;
        }else{
            var s = true;
        }
        Ext.getCmp('copy_to_back').setHidden(s);
        Ext.getCmp('sp_go_time').setDisabled(s);
    });

    var price_win = new Ext.Window({
        width : 330,
        items : price_form,
        html: '<div style="padding: 0 10px 10px 10px;"><b>友情提示：</b><br>' +
            '　　1、出发时间、起(始)站点、开始、结束日期不能存在相交的现像<br>' +
            '　　2、出发时间必需是正确认的时间格式,例:10:30 <br >' +
            '　　3、时差请填写分钟,例:30' +
            '</div>',
        modal : true,
        closeAction : 'hide',
        buttons:[
            {text:'保存', handler:price_save},
            {text:'关闭', handler:function () {
                price_win.hide();
            }}
        ]
    });
    var sd_start=1;
    price_win.on('show',function(){
        if(sd_start==1)sd_start_type_combo.box.getStore().load();
        sd_start++;
    })

    //price_win保存
    function price_save(v){
        var data=price_form.getForm().getValues();
        if(! data['t_weekly[]']){
            Ext.Msg.alert('友情提示','请选择周几有效！');
            return;
        }
        if(!price_form.form.isValid()){
            Ext.Msg.alert('友情提示','请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/StationPrice/save',
            params : data,
            method : 'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    sp_store.reload();
                    price_win.hide();
                }
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '班车策略操作失败！');
            }
        });
    };

    /*取出所有始发站与出发口岸选择*/
    var start_station_url = $__app__ + '/StationStart/dataJson';
    var start_station_fld = [{name:"sd_id"}];
    var start_station_store = SUNLINE.JsonStore(start_station_url, start_station_fld, false,{pageSize:7});
    var start_station_cm = [
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID号", dataIndex:"sd_id", width:60, hidden:true},
        {header:"始发站", dataIndex:"sd_name", width:180},
        {header:"类型", dataIndex:"sd_type", width:100},
        {header:"所属区域", dataIndex:"sd_district", width:150,renderer:fullDress_start}
    ];

    var start_station_grid = new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        columns:start_station_cm, //表格列定义
        store : start_station_store,

        tbar:[
            {text:'刷新', iconCls:'button-ref', handler:function () {
                start_station_store.reload();
            }},
            '-',
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'station_search2_id',
                cls:'search-icon-cls',
                emptyText:'始发站',
                width:150,
                onTriggerClick:function (e) {
                    station_search2();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            station_search2();
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize:7,
            store: start_station_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        })

    });
    function station_search2(){
        var key=Ext.getCmp('station_search2_id').getValue();
        SUNLINE.baseParams(start_station_store,{skey:key},true);
        start_station_store.currentPage=1;
        start_station_store.load();
    }


    var start_station_win = new Ext.Window({
        title:'选择站点',
        width : 510,
        height : 410,
        closeAction : 'hide',
        modal : true,
        items : [start_station_grid],
        layout : 'fit',
        buttons:[
            {text:'加入起(始)站点',handler:add_shuttle},
            {text:'关闭', handler:function(){start_station_win.hide();} }
        ]
    });

    start_station_win.on('show', function(){
        var row =SUNLINE.getSelected(grid);
        var sd_start_type=sd_start_type_combo.box.getValue();
        SUNLINE.baseParams(start_station_store,{st_id:row.data.st_id,sd_start_type:sd_start_type,st_org_id:org_id});
        start_station_store.currentPage=1;
        start_station_store.load();
    });

    /**
     * 加入规则的处理方法
     * @param b
     */
    function add_shuttle(b){
        var s =SUNLINE.getSelected(start_station_grid);
        if (!s){
            Ext.Msg.alert('友情提示', '请选择始发站或出发口岸!');
            return;
        };
        Ext.getCmp("sp_site_id").setValue(s.get("sd_id"));
        Ext.getCmp("sp_site_name").setValue(s.get("sd_name"));
        start_station_win.hide();
    };

    /**
     * 增加站点的处理方法
     * @param
     */
    function station_list(b){
        start_station_win.show(b.id);
    };

    //--右边form表单保存


    //添加-修改方法
    function price_modify(b){
        if(b.text=='添加'){
            var row =SUNLINE.getSelected(grid);
            if(row==null){
                Ext.Msg.alert('提示','请选择您要设置的出发地');
                return false;
            }
            price_win.show();
            price_form.getForm().setValues({'sp_stid':row.data.st_id});
            Ext.getCmp('copy_to_back').setHidden(false);
            Ext.getCmp('sp_go_time').setDisabled(false);
        }else if(b.text=='编辑'){
            var row =SUNLINE.getSelected(sp_grid);
            if(row==null){
                Ext.Msg.alert('提示','请选择您要操作的班车策略');
                return false;
            }
            price_win.show();
            if(row.data.sp_date_s.indexOf("-")<=0){
                row.data.sp_date_s=row.data.sp_date_s.substr(0,4)+'-'+row.data.sp_date_s.substr(4,2)+'-'+row.data.sp_date_s.substr(6,2) ;
            }
            if(row.data.sp_date_e.indexOf("-")<=0){
                row.data.sp_date_e=row.data.sp_date_e.substr(0,4)+'-'+row.data.sp_date_e.substr(4,2)+'-'+row.data.sp_date_e.substr(6,2) ;
            }
            SUNLINE.weekSetValues(weekly_list, row.data.sp_weekly);
            price_form.getForm().setValues(row.data);
            console.log(row);
            if(row.data.sp_go_back=='返程'){
                Ext.getCmp('sp_go_time').setDisabled(true);
            }else{
                Ext.getCmp('sp_go_time').setDisabled(false);
            }
            Ext.getCmp('copy_to_back').setHidden(true);
        }
        price_win.setTitle(b.text+"班车策略信息", b.iconCls);
    }


    price_win.on('hide',function(){
        price_form.getForm().reset();
    })

    function price_del(b){
        var row=SUNLINE.getSelected(sp_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要'+b.text+'的行！');
            return;
        }
        var id = row.data.sp_id;
        Ext.Msg.confirm('友情提示','你确定'+b.text+'吗？',function(y){
            if(y=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/StationPrice/del',
                    method : 'POST',
                    params : { sp_id :id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',ret.info);
                        if(ret.status ==1){
                            sp_store.reload();
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', b.text+'失败！');
                    }
                });
            }
        })
    }
    sp_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(grid);
        if(data==null){
            return false;
        }
    })
    store.on('load',function(){
        sp_store.removeAll();
        sp_store.removeAll();
    })

    function time_sp_date_s(v,m,r){
        var time = r.get('sp_date_s');
        time1=time.substr(0,4);
        time2=time.substr(4,2);
        time3=time.substr(6,2);
        return time1+'-'+time2+'-'+time3 ;
    }
    function time_sp_date_e(v,m,r){
        var time = r.get('sp_date_e');
        time1=time.substr(0,4);
        time2=time.substr(4,2);
        time3=time.substr(6,2);
        return time1+'-'+time2+'-'+time3 ;
    }


    new Ext.Viewport({
        layout : 'border',
        items : [grid,sp_grid]
    });
});