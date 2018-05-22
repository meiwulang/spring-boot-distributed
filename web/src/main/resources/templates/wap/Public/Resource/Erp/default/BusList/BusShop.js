/**
 * User: asun
 * Date: 13-1-11
 * Time: 下午2:03
 */
BUSLIST={};
WG={};
var _row;
var bl_status;
var product_row; //选中商品行
var bl_org_id = _uinfo.org_id; //默认情况下，当前登陆账号id
var p_id_str,p_id=[];//默认加载的产品id
Ext.onReady(function(){
    var p_url=$__app__+'/Products/series_select';
    var p_field=[];
    var p_store=SUNLINE.GroupingStore(p_url,p_field,{sortInfo:{field:'p_id',direction: "DESC"}, groupField:'p_type' },true);

    var url=$__app__+'/BusList/select_shop';
    //var url=$__app__+'/BusList/dataJson';
    var field=[];
    var store=SUNLINE.GroupingStore(url,field,{sortInfo:{field:'bl_id',direction: "DESC"}, groupField:'bl_num' },false);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{columnName}: {name:this.format_time} (共 {[values.rows.length]} 条)',{format_time:function(time){
            var group_field=store.getConfig('groupField');
            switch(group_field){
                case 'bl_num':
                case 'bl_start_time':
                    return time;
                case 'bl_start_date':
                    return to_date(time);
                case 'bl_week':
                    var weekly = ['日','一','二','三','四','五','六']
                    return "星期"+weekly[time];
            }
            var group_field=store.getConfig('groupField');
        }}],
        startCollapsed:false
    })

    store.on('beforeload',function(){
        store.removeAll();
    })

    function to_date(v){
        var y=v.substr(0,4);
        var m=v.substr(4,2);
        var d=v.substr(6,2);
        v=y+'-'+m+'-'+d;
        return v;
    }
    function strDate(v,m,r){
        var daytime = r.get('bl_start_time');
        return int2date(v) + ' ' + daytime;
    };

    function surplusSeats(v,m,r){
        var carSeatCount = r.get('bl_seat_count');    //座位总数
        var saledSeatCount = r.get('bl_saled');    //已售座位
        var yulieSeatCount = r.get('bl_reserved');    //预留座位
        if(!yulieSeatCount)yulieSeatCount=0;
        var num=carSeatCount - saledSeatCount;
        return '<span style="font-weight: bold;color:green;">'+num+'</span>';
    };

    function bl_status(v,t,s){
        var dict = {
            '正常':'color:#444', //3889FF
            '暂停':'color:#009DDA',
            '取消':'color:#009DDA',
            '锁定':'color:#009DDA',
            'del':'color:#ccc;text-decoration:line-through;'
        };
        return '<span style="'+ dict[v] +'">' + v + '</span>';
    };

    function bus_number(v, m, r){
        return v + ' × ' + r.get('bl_seats');
    };

    function is_price(v, m, r){
        if (r.get('bl_ticket_detail')=='1')
            v = '<span style="color:blue" qtip="当天调整过票价，将不受票价定义里设置的影响">'+ v +'</span>';
        return v;
    };

    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }
    function reser_color(v, m, r){
        if(v>0){
            return "<span style='color:blue;font-weight: bold'>"+v+"</span>"
        }else{
            return 0;
        }
    }

    function bl_num(v){ return v; };
    function saled_color(v){ return '<span style="font-weight: bold;color:red;">'+v+'</span>';};

    var bl_saled_combo = new Ext.form.Checkbox({boxLabel:'仅显示已售', id:'bl_saled', inputValue:1, checked:true});

    var busList_grid = Ext.create('Ext.grid.Panel',{
        region : 'center',
        border:false,//无边框
        features:[groupfeatures],
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: store,//数据源
        style:'border-top:1px solid #009DDA;',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        viewConfig:{
            groupByText : '使用当前字段分组',
            showGroupsText : '分组显示',
            showGroupName : true,
            enableGroupingMenu:true,
            hideGroupedColumn : false,
            emptyText: '暂无团队信息。',
            groupTextTpl: '{text} <span style="font-weight: normal;">(共{[values.rs.length]}个团队)</span>'
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID",dataIndex:"bl_id",width:80,hidden:true},
            {header:"bl_product_id",dataIndex:"bl_product_id",width:80,hidden:true},
            {header:"状态",dataIndex:"bl_status",width:60,renderer:bl_status},
            {header:"班期编号",dataIndex:"bl_num",width:110,renderer:is_price, groupRenderer:bl_num},
            {header:"班期名称",dataIndex:"bl_name",width:140},
            {header:"线路名称",dataIndex:"p_name",width:250},
            {header:"出发日期",dataIndex:"bl_start_date",width:120,renderer:strDate,menuDisabled:false},
            {header:"出发时分",dataIndex:"bl_start_time",width:60, menuDisabled:false, hidden: true},
            {header:"车辆数",dataIndex:"bl_count",width:80,renderer:bus_number,align:'center'},
            {header:"总座位",dataIndex:"bl_seat_count",width:70,align:'center'},
            {header:"余座",dataIndex:"bl_surplus_seats",width:70,renderer:surplusSeats,align:'center'},
            {header:"已售",dataIndex:"bl_saled",width:70,align:'center',renderer:saled_color},
            {header:"虚占",dataIndex:"bl_fake_saled",width:70,align:'center'},
            {header:"预留",dataIndex:"bl_reserved",width:70,align:'center',renderer:reser_color},
            {header:"锁定",dataIndex:"bl_lock",width:70,align:'center',renderer:reser_color},
            {header:"待定数",dataIndex:"death_num",width:70,align:'center'},
            {header:"星期",dataIndex:"bl_week",width:140,renderer:SUNLINE.weekRenderer, menuDisabled:false,
                groupRenderer:function(v, u, r, ri, ci, ds){
                    var w = ['日','一','二','三','四','五','六'];
                    return w[v];
                }
            }
        ],
        tbar: [
            bl_saled_combo,
            {
                labelWidth:40,
                labelAlign:"right",
                width:160,
                name:"b_status",
                id:"b_status",
                fieldLabel:"状态",
                xtype:"combo",
                editable:false,
                emptyText: '可直接填写天数',
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['combo_value','combx_show'],
                    data: [[0,'全部'], ['正常', '正常'], ['暂停', '暂停'], ['取消', '取消']]
                }),
                displayField:"combx_show",
                valueField:"combo_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:0
            },
            {
                labelWidth:40,
                labelAlign:"right",
                width:200,
                name:"p_days",
                id:"p_days",
                fieldLabel:"天数",
                xtype:"combo",
                editable:false,
                emptyText: '可直接填写天数',
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['combo_value','combx_show'],
                    data:[[0,'全部'],[1, '一日游'], [2, '二日游'], [3, '三日游'], [-1, '四日及以上']]
                }),
                displayField:"combx_show",
                valueField:"combo_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:0
            },
            {text:'查询',iconCls:'searchico',act:'select',handler:startReloadStore},
            {text:'游客信息',iconCls:'searchico',handler:_print},
            {
                text:'导出',
                iconCls:'button-article',
                handler:function(){
                    doExcel();
                }
            },
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('班期销售报表')}},
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    //查看游客
    var _print_win = new Ext.Window({
        title : '打印',
        modal : true,
        maximizable : true,//全屏效果
        closeAction : 'hide',
        html : '<iframe src="" id="_print_frm" name="_print_frm" frameborder="0" width="100%" height="100%"></iframe>',
        buttons:[
            {text:'打印', iconCls:'button-print', handler:function(b){
                try{
                    window._print_frm.focus();
                    window._print_frm.do_print();
                }catch (e){
                    ExtAlert('目标窗口中的打印方法没有定义。');
                }
            }},
            {text:'导出', handler:_export},
            {text:'关闭', handler:function(){_print_win.hide();}}
        ]
    });
    function _export(){
        var _row=SUNLINE.getSelected(busList_grid);
        var url = $__app__ + '/OrderExcel/seatListExport/team_bl_id/' + _row.data.bl_id + '/team_p_id/' + _row.data.bl_product_id + '/bl_org_id/' + bl_org_id;
        if(_row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的班期');
            return false;
        }
        window.location = url;
    }
    function _print(b){
        var _row=SUNLINE.getSelected(busList_grid);
        if(_row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的班期');
            return false;
        }
        var _w = 850, _h = Ext.getBody().getHeight();
        _print_win.setWidth(_w);
        _print_win.setHeight(_h-50);
        var url = $__app__ + '/OrderExcel/seat_bus_people/team_bl_id/' + _row.data.bl_id + '/team_p_id/' + _row.data.bl_product_id + '/bl_org_id/' + bl_org_id;
        _print_win.setTitle('查看游客信息', b.iconCls);
        _print_win.setSize( _w, _h - 50 );
        _print_win.show();
        window._print_frm.location = url;
    }

    var product_cm=[
        {header:"p_id_arr", dataIndex:"p_id_arr", width:50, hidden:true},
        {header:"产品系类", dataIndex:"p_series", width:173}
    ];

    var product_grid = Ext.create('Ext.grid.Panel',{
        title:'产品系类',
        region:'west',
        width:200,
        maxWidth : 360,
        minWidth : 200,
        floatable: false,
        split : {size:3},
        columns:product_cm,
        cls:'check-no-cls',
        style:'border-top:2px solid #009DDA',
        fixed:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        store:p_store,
        bodyBorder: false,
        autoScroll : true,
        collapsed : true,
        collapsible:true,
        border :false,
        defaults: {
            collapsible: true,
            split: true,
            bodyPadding: 10
        },
        tbar:[
            '快捷搜索：',
            {
                xtype:'textfield',
                triggerCls : 'x-form-search-trigger',
                id:'search',
                emptyText : '产品系类',
                width:100,
                onTriggerClick:function(e){
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

    /*单位操作(start)*/
    var _p_grid = SUNLINE.ProductsGrid('select', 10,'BusShop');
    var p_data=_p_grid.getStore();

    /*p_data.load(function(){
    //    for(var i =0;i<p_data.getCount();i++){
    //        p_id.push(p_data.getAt(i).data.p_id);//遍历每一行
    //    }
    //    p_id_str=p_id.join(",");
    //
            select_load_mod();

        //SUNLINE.baseParams(store,{bl_product_id:pid},true);
        })*/

    // Ext.getCmp('pro_search').on('click',function(){
    //     select_load_mod();
    //});

    _p_grid.getSelectionModel().on('selectionchange', function(){
        //var pid=p_select_id();
        var params=load_where_data({});
        SUNLINE.baseParams(store,params,true);
        store.currentPage = 1;
        store.load();
    });

    function p_select_id(){
        var row = SUNLINE.getSelected(_p_grid, true);
        //把勾选中产品Id拼接成字符串，以‘,’分隔
        var pid = [];
        for (var i = 0; i < row.length; i++) {
            pid[i] = parseInt(row[i].data.p_id);
        }
        pid = pid.join(',');
        return pid;
    }

    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:380,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var product_config={
        title:'产品信息',
        layout : 'border',
        region : 'west',
        split : true,
        style : 'border-right-width:1px;',
        width : 400,
        maxWidth : 460,
        minWidth : 380,
        floatable: false,
        fixed:true,
        collapsed : true,
        collapsible:true,
        items:[_p_grid],
    };
    if(_uinfo.org_type=='管理公司')product_config.tbar=[ company_box ];
    var product_select = new Ext.Panel(product_config);


    company_box.on({
        select:function(c,r){
            var row=r[0].data;
            SUNLINE.baseParams(_p_grid.store,{p_org_id:row.id});
            _p_grid.store.load();
           /* bl_org_id = row.id;
            SUNLINE.baseParams(store,{bl_org_id:bl_org_id},true);
            store.load();*/
        }
    });

    _p_grid.store.on({
        load:function(t,r,s,o){
            var params=load_where_data({});
            SUNLINE.baseParams(store,params,true);
            store.load();
            //console.log(params);
        }
    });

    /*单位操作(end)*/

    var buslist_right = new Ext.Panel({
        border : false,
        layout : 'border',
        region : 'center',
        items : [product_select,busList_grid] ,
        tbar: [
            {text:'查找线路',handler:function(){product_select.expand(true); }},
            /*{text:'查看游客',iconCls:'',act:'tourist'},
            {text:'查看营收',iconCls:'',act:'revenue'},*/
            '查询日期：',
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'seach_stop_date',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',value:today(),labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'seach_start_date'}),
            '-',
            {text:'按班期编号分组', id:'group_btn', menu:{
                items : [
                    {text:'按班期编号分组', handler:function(b){
                        store.group('bl_num');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按出发日期分组', handler:function(b){
                        store.group('bl_start_date');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按出发时分分组', handler:function(b){
                        store.group('bl_start_time');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按星期几分组', handler:function(b){
                        store.group('bl_week');
                        Ext.getCmp('group_btn').setText(b.text);
                    }}
                ]
            }}
        ]
    });

    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [buslist_right]
    });

    function load_where_data(data){
        data['saled_status']=Ext.getCmp('bl_saled').getValue();
        data['bl_status']=Ext.getCmp('b_status').getValue();
        data['p_days']=Ext.getCmp('p_days').getValue();
        var start_date=Ext.getCmp('seach_start_date').getValue();
        data['bl_start_date']=Ext.Date.format(start_date,'Y-m-d');
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        data['bl_stop_date']=Ext.Date.format(stop_date,'Y-m-d');
        data['p_org_id']=company_box.getValue();
        data['product_type']=Ext.getCmp('product_type').getValue();
        data['skey']=Ext.getCmp('pro_search').getValue();
        data['bl_product_id']=p_select_id();
        return data;
    }


    //时间搜索
    function select_load_mod(){
        var rows=_p_grid.getSelectionModel().getSelection();
        /*var status=Ext.getCmp('bl_saled').getValue();
        var bl_status=Ext.getCmp('b_status').getValue();
        var p_days=Ext.getCmp('p_days').getValue();
        var start_date=Ext.getCmp('seach_start_date').getValue();
        start_date=Ext.Date.format(start_date,'Y-m-d');
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        stop_date=Ext.Date.format(stop_date,'Y-m-d');*/
        //var bus_id=[];
        var pid_bloon=rows.length>0?true:false;
        var params=load_where_data({});
        //if(rows.length>0){
        //    if(product_row){
        //        bus_id.push(product_row.p_id);
        //    }
        //    Ext.each(rows,function(v,i){
        //        bus_id.push(v.data.p_id_arr);
        //    });
        //    bus_id=bus_id.join(',');
        //    SUNLINE.baseParams(store,{'bl_start_date':start_date,'bl_stop_date':stop_date,'bl_status':bl_status,'p_days':p_days,'saled_status':status},true);
        //}else{
        //    SUNLINE.baseParams(store,{'bl_start_date':start_date,'bl_stop_date':stop_date,'bl_status':bl_status,'p_days':p_days,'saled_status':status},false);
        //}
        SUNLINE.baseParams(store,params,pid_bloon);
        store.currentPage=1;
        store.load();
    }

    function startReloadStore(){
        select_load_mod();
    }

    /*product_grid.on('select',function(i,v){

    });*/

    //快捷搜索
    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        SUNLINE.baseParams(p_store,{skey:skey})
        p_store.currentPage=1;
        p_store.load();
        store.removeAll();
    };

    /**
     * 导出excel
     */
    function doExcel(){
        var url = '';
        url += 'bl_start_date=' + Ext.Date.format(Ext.getCmp('seach_start_date').getValue(),'Y-m-d');
        url += '&bl_stop_date=' + Ext.Date.format(Ext.getCmp('seach_stop_date').getValue(),'Y-m-d');
        url += '&bl_status=' + Ext.getCmp('b_status').getValue();
        url += '&p_days=' + Ext.getCmp('p_days').getValue();
        url += '&saled_status=' + Ext.getCmp('bl_saled').getValue();
        if(product_row){
            url += '&bl_product_id=' + product_row.p_id;
        }
        if(bl_org_id){
            url += '&bl_org_id=' + bl_org_id;
        }

        window.location = $__app__+'/BusList/selectShopExcel?'+url;
    }


})


