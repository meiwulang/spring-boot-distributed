/**
 * User: asun
 * Date: 17-02-04
 * Time: 下午2:03
 */
PRODUCTS={};
BUSLIST={};
OPERATION_SEAT = [];
LOCK_SEAT =[];
TYPE_G = '';
OLD_DATA= 0;
var bl_org_id = _uinfo.org_id; //默认情况下，当前登陆账号id
var ticket_is_changed=false;
var Org_id='';
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '班期调整';
    Org_id=_uinfo.org_id;
    /*对应班期操作区(start)*/
    function is_price(v, m, r){
        if (r.get('bl_ticket_detail')=='1')
            v = '<span style="color:blue" qtip="当天调整过票价，将不受票价定义里设置的影响">'+ v +'</span>';
        return v;
    };

    var busList_storeUrl = $__app__ + '/BusListNew/buslist_dateJoin';
    var busList_field=[];
    var busList_store=SUNLINE.GroupingStore(busList_storeUrl,busList_field,{sortInfo:{field:'bl_id',direction: "DESC"}, groupField:'product_name' },true);
    var group_btn;
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{columnName}: {name:this.format_time} (共 {[values.rows.length]} 条)',{
            format_time:function(time){
                var group_field=busList_store.getConfig('groupField');
                switch(group_field){
                    case 'bl_num':
                    case 'bl_start_time':
                        return time;
                    case 'bl_start_date2':
                        return time;
                    case 'product_name':
                        return time;
                    case 'bl_week':
                        var weekly = ['日','一','二','三','四','五','六']
                        return "星期"+weekly[time];
                }
            }}],
        startCollapsed:false
    });
    busList_store.on('beforeload',function(){
        busList_store.removeAll();
    })

    function bl_num(v){ return v; };

    /**
     * 时间格式 年-月-日
     * @param v
     * @param m
     * @param r
     * @return {String}
     */
    function strDate(v,m,r){
        var daytime = r.get('bl_start_time');
        var weekly = ['日','一','二','三','四','五','六'];
        var week_time = weekly[r.get("bl_week")];
        if(r.get('bl_ticket_detail') && r.get('bl_ticket_detail')!=0){
            return '<font color="blue" data-qtip="当前班期金额有所调整">'+int2date(v) + ' ' + daytime+'('+week_time+')' +'</font>';
        }else{
            return int2date(v) + ' ' + daytime +'('+week_time+')';
        }
    };

    function bus_number(v, m, r){
        return v;
    };

    function is_cluster(v){
        if(v==0) return "未设置";
        return v;
    }

    /**
     * 计算余座
     * @param v
     * @param m
     * @param r
     * @return {*}
     */
    function surplusSeats(v,m,r){
        var carSeatCount = r.get('bl_seat_count');    //座位总数
        var saledSeatCount = r.get('bl_saled');    //已售座位
        var seat_num=0;
        if(r.get('bl_seat_share_id') > 0)
            seat_num= r.get('bl_surplus');
        else
            seat_num= carSeatCount - saledSeatCount;
        return '<font color="green"><b>'+seat_num+'</b></font>';
    };

    function print_num(v){
        return v !=0 ? '是':'否';
    };

    function bl_status(v){
        var dict = {
            '计划':'color:#FF6E24',
            '正常':'color:#444', //3889FF
            '暂停':'color:#A82FFF',
            '取消':'color:#666',
            '锁定':'color:red',
            'del':'color:#ccc;text-decoration:line-through;'
        };
        return '<span style="'+ dict[v] +'">' + v + '</span>';
    };

    function num_fn(v){
        return '<font color="blue" data-qtip="'+v+'">'+v+'</font>';
    }

    function reserved_lock_fn(v){
        if(v>0)return '<font color="red"><b>'+v+'</b></font>';
        return v;
    }
    var busList_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID",dataIndex:"bl_id",width:50,hidden:true},
        {header:"状态",dataIndex:"bl_status",width:50, menuDisabled:false, renderer:bl_status},
        {header:"班期编号",dataIndex:"bl_num",width:80, menuDisabled:false, renderer:is_price, groupRenderer:bl_num,renderer:num_fn},
        {header:"班期名称",dataIndex:"bl_name",width:80,align:'left'},
        {header:"产品名称",dataIndex:"product_name",width:200,align:'left',renderer:name_fn},
        {header:"出发日期",dataIndex:"bl_start_date",width:150,renderer:strDate, menuDisabled:false},
        {header:"出发时分",dataIndex:"bl_start_time",width:60, menuDisabled:false, hidden: true},
        {header:"停售时间",dataIndex:"bl_last_time",width:90, menuDisabled:false},
        {header:"车辆数",dataIndex:"bl_count",width:73, renderer:bus_number,align:'right'},
        {header:"总座位",dataIndex:"bl_seat_count",width:73,align:'right'},
        {header:"已售",dataIndex:"bl_saled",width:73,align:'right'},
        {id:'bl_cluster',header:"<span style='color:blue'>成团人数</span>",dataIndex:"bl_cluster",width:90,align:'right',editor: new Ext.form.NumberField({ allowBlank: false }),renderer:is_cluster},
        {header:"<span style='color:blue'>虚占</span>",dataIndex:"bl_fake_saled",width:50,
            editor: new Ext.form.NumberField({ allowBlank: false }),
            tooltip:'<b>虚拟占座数量</b><br><font color=\'red\'>当已售数量小于虚拟占座数量时，人工选座不起作用</font>' +
            '<br>单击本列单元格可直接编辑',
            align:'center'
        },
        {header:"余座",dataIndex:"bl_surplus_seats",width:60,renderer:surplusSeats},
        {header:"预留",dataIndex:"bl_reserved",width:60,align:'right',renderer:reserved_lock_fn},
        {header:"锁定",dataIndex:"bl_lock",width:60,align:'right',renderer:reserved_lock_fn},
        {header:"待定数",dataIndex:"death_num",width:80,align:'right'},
        {header:"星期",dataIndex:"bl_week",width:125,renderer:SUNLINE.weekRenderer, menuDisabled:false,hidden:true,
            groupRenderer:function(v, u, r, ri, ci, ds){
                var w = ['日','一','二','三','四','五','六'];
                return w[v]; // + "[共"+ z +"车]";
            }
        },
        {header:"<span style='color:blue'>排序</span>",tooltip:'单击本列单元格可直接编辑',dataIndex:"bl_rank",width:60,editor: new Ext.form.NumberField({ allowBlank: false })},
        {header:"车型",dataIndex:"bl_brand",width:50},
        {header:"打印班期号",dataIndex:"bl_print_num",width:100, renderer:print_num,hidden:true},
        {header:"对号入座",dataIndex:"bl_right_seat",width:150},
        {header:"出发日期",dataIndex:"bl_start_date2",hidden:true,width:120,renderer:strDate, menuDisabled:false},
        {header:"产品线路",dataIndex:"product_name",width:60, menuDisabled:false, hidden: true},
    ];

    var _grid = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        //clicksToEdit:1,
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var data = SUNLINE.getSelected(g.grid).data;
                        Ext.Ajax.request({
                            url: $__app__+'/BusListNew/bl_info_save',
                            params: data,
                            method:'post',
                            success: function(response){
                                var r = Ext.decode(response.responseText);
                                if(r.info.msg != '编辑成功！'){
                                    Ext.Msg.alert('友情提示', r.info.msg);
                                }
                                if(r.status){
                                    // panel.hide();
                                    store.load();
                                }
                                myMask.hide();
                            }
                        })
                    }
                }
            })
        ],
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: busList_store,//数据源
        columns: busList_cm,//表格列定义
        features:[groupfeatures],
        style:'border-top:1px solid #ccc',
        selModel:{ selType: 'checkboxmodel' },
        tbar: [
            '查询日期：',
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',
                width:120,gang:'seach_stop_date',start:true,value:sys_time.start}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',
                width:120,gang:'seach_start_date'}),
            '-',
            {text:'查询',iconCls:'searchico',act:'select',handler:startReloadStore},
            '-',
            {text:'按产品线路分组', id:'group_btn', menu:{
                items : [
                    {text:'按产品线路分组', handler:function(b){
                        busList_store.group('product_name');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按班期编号分组', handler:function(b){
                        busList_store.group('bl_num');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按出发日期分组', handler:function(b){
                        busList_store.group('bl_start_date2');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按出发时分分组', handler:function(b){
                        busList_store.group('bl_start_time');
                        Ext.getCmp('group_btn').setText(b.text);
                    }},
                    {text:'按星期几分组', handler:function(b){
                        busList_store.group('bl_week');
                        Ext.getCmp('group_btn').setText(b.text);
                    }}
                ]
            }},'-',
            {text:'清除自定义票价',handler:do_clear, id:'clear_ticket'/*, disabled:isDisabled('BusList::clear_ticket_detail')*/},
            '-',
            {text:'游客信息',iconCls:'searchico',handler:_print},
            '-',
            {text:'导出', iconCls:'button-article', handler:function(){doExcel();}},
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: busList_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners:{
            "select":function(i,r){
                var bl_last_time=r.get('bl_last_time');
                var bl_start_date=int2date(r.get('bl_start_date'));
                var year=new Date(bl_start_date);
                var now_time=new Date().getTime();
                var begin_time=new Date(year.getFullYear()+' '+bl_last_time).getTime();
                if(now_time<=begin_time) {
                    Ext.getCmp('append_order').setDisabled(true);
                }else{
                    Ext.getCmp('append_order').setDisabled(false);
                }
            }
        }
    });
    var busList_panel= new Ext.Panel({
        id : 'busList_panel',
        region : 'center',
        layout : 'border',
        border : false,
        style : 'border-left-width:1px;',
        tbar : [
            {text:'添加',act:'add',iconCls:'button-add',handler:modify, disabled:isDisabled('BusList::add')},
            //'-',
            {text:'批量添加',act:'add_multi', handler:modify, disabled:isDisabled('BusList::add_batch')},
            '-',
            {text:'编辑',id:"busList_edit", act:'edit',iconCls:'button-edit',handler:modify, disabled:isDisabled('BusList::edit')},
            '-',
            {text:'删除',iconCls:'button-del',handler:busList_del, disabled:isDisabled('BusList::del')},
            '-',
            {text:'暂停', id:'busList_p',iconCls:'button-stop',act:'zt',handler:busListSet,
                tooltip:'<b>班期暂停</b><br>班期暂停后无法销售，退票受退票时间的限制。', disabled:isDisabled('BusList::pause')},
            '-',
            {text:'恢复售票', iconCls:'button-icon-complete',id:'busList_r',act:'hf',handler:busListSet, disabled:isDisabled('BusList::resale')},
            '-',
            {text:'修改车座信息', id:'busList_ch', handler:function(){modify_bus_info('single_add',this)}, disabled:isDisabled('BusList::change')},
            '-',
            {text:'补单', id:'append_order',iconCls:'button-write',handler:appendOrder},
            '-',
            /*{text:'行程调整', handler:chg_journey, disabled:isDisabled('BusList::journey'),tooltip:'<b>行程调整</b><br>仅调整选中日期的行程，调整后的行程将优先于默认行程显示。'},
            '-',*/
            {text:'刷新',iconCls:'button-ref',handler:function(){busList_store.reload()}},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon s-btn-icon',
                //text:'&nbsp;刷新'+ thisTitle,
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            },{
                icon: $app_public_images_path + 'close.gif',
                cls: 'x-btn-icon s-btn-icon',
                //text:'&nbsp;关闭'+ thisTitle,
                tooltip: getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            },{icon: $app_public_images_path + 'b_help.png',  tooltip: '查看帮助',cls: 'x-btn-icon',handler:function(){help('班期管理')}}
        ],
        items:[_grid]
    });
    _grid.getSelectionModel().on('selectionchange', function(sm,record){
        var rows = SUNLINE.getSelected(_grid, true);
        if(rows.length > 1){
            Ext.getCmp("busList_edit").setDisabled(true);
            Ext.getCmp("busList_ch").setDisabled(true);
            Ext.getCmp("append_order").setDisabled(true);
            Ext.getCmp("clear_ticket").setDisabled(true);
        }else{
            Ext.getCmp("busList_edit").setDisabled(false);
            Ext.getCmp("busList_ch").setDisabled(false);
            Ext.getCmp("clear_ticket").setDisabled(false);
        }
    });
    /*对应班期操作区(end)*/

    /*产品列表信息(start)*/
    var _p_grid = SUNLINE.ProductsGrid('select', 10,'BusShop');
    _p_grid.getSelectionModel().on('selectionchange', function( sm, rowIndex, record ){
        var row = SUNLINE.getSelected(_p_grid,true);
        if(row.length>0){
            PRODUCTS=row[0].data;
        }else{
            PRODUCTS='';
        }
        var post_date=where_date();
        SUNLINE.baseParams(busList_store,post_date);
        busList_store.currentPage=1;
        busList_store.load();
    });

    //时间搜索
    function startReloadStore(){
        var post_date=where_date();
        SUNLINE.baseParams(busList_store,post_date);
        busList_store.currentPage=1;
        busList_store.load();
    };

    /**
     * 查寻日期段
     * @returns {{}}
     */
    function where_date(){
        var post_date={};
        var start_date=Ext.getCmp('seach_start_date').getValue();
        if(start_date)post_date.start_date=Ext.Date.format(start_date,'Y-m-d');
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        if(stop_date)post_date.stop_date=Ext.Date.format(stop_date,'Y-m-d');
        var p_org_id =company_box.getValue();
        if(p_org_id)post_date.p_org_id = p_org_id;
        post_date.bl_product_id=p_select_id();
        return post_date;
    }

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

    /**
    * 打印游客信息
    * */
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
        var _row=SUNLINE.getSelected(_grid);
        var url = $__app__ + '/OrderExcel/seatListExport/team_bl_id/' + _row.data.bl_id + '/team_p_id/' + _row.data.bl_product_id + '/bl_org_id/' + bl_org_id;
        if(_row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的班期');
            return false;
        }
        window.location = url;
    }
    function _print(b){
        var _row=SUNLINE.getSelected(_grid);
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

    /*单位操作(start)*/
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
        collapsed : false,
        collapsible:true,
        items:[_p_grid],
    };
    if(_uinfo.org_type=='管理公司') {
        product_config.tbar=[ company_box ];
    }
    var product_select = new Ext.Panel(product_config);
    company_box.on({
        select:function(c,r){
            var row=r[0].data;
            Org_id=row.id;
            SUNLINE.baseParams(_p_grid.store,{p_org_id:row.id});
            _p_grid.store.load();
            var row_p = SUNLINE.getSelected(_p_grid,true);
            if(row_p.length>1){
                PRODUCTS=row_p[0].data;
            }else{
                PRODUCTS='';
            }
            var post_date=where_date();
            SUNLINE.baseParams(busList_store,post_date);
            busList_store.currentPage =1;
            busList_store.load();
        }
    });


    /*单位操作(end)*/

    /*var product_select = {
        layout : 'border',
        region : 'west',
        split : true,
        style : 'border-right-width:1px;',
        width : 400,
        maxWidth : 460,
        minWidth : 380,
        items:[_p_grid]
    };*/
    /*产品列表信息(end)*/

    function get_week_by_date(nv, week){
        var weekly = ['日','一','二','三','四','五','六'];
        var w = Ext.Date.format(nv, 'w');
        var date = Ext.Date.format(nv, 'Y-m-d');
        if (week) return w;
        return date + ' 星期' + weekly[w];
    };

    function get_week_js_date(nv,week){
        var weekly = ['日','一','二','三','四','五','六'];
        var d=new Date(nv);
        var w=d.getDay();
        if (week) return w;
        return nv + ' 星期' + weekly[w];
    }

    function getListRow(){
        var list_row=SUNLINE.getSelected(_grid);
        if(list_row==null){
            Ext.Msg.alert('友情提示','请选择您要调整的班期！');
            return false;
        };
        return list_row;
    };

    /*添加班期表单项（start）*/

    //	创建日历
    function create_calendar(p_id, bl_num){
        $(function(){
            $('.multi_calendar').multicalendar({
                url : $__app__ + '/BusList/mcalendar',
                params : {product_id: p_id, bl_num:bl_num},
                fn : function(v){
                    Ext.getCmp('bl_dates').setValue(v);
                }
            });
        });
    };

    function appendOrder(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择班期');
            return false;
        };
        var bl_product_id=row.data.bl_product_id_en;
        var bl_id=row.data.bl_id_en;
        window.open($__app__+'/BusListNew/append_order_sign_jump?p_id='+bl_product_id+'&bl_id='+bl_id+'&city_code='+_uinfo.org_code,'_blank');
    }

    //车辆品牌
    var Dict_cmb_m = SUNLINE.DictComBox({id:'bl_brand_m',name:'bl_brand',fieldLabel:'车型品牌',labelWidth:80,labelAlign:"right"},{'d_type':'车辆品牌'});
    var Dict_cmb = SUNLINE.DictComBox({id:'bl_brand',name:'bl_brand',fieldLabel:'车型品牌',labelWidth:80,labelAlign:"right"},{'d_type':'车辆品牌'});
    var bus_list_form_items_multi = [
        {id:"bl_dates", name:"bl_dates", xtype:"hidden"},
        {id:"bl_ticket_ids_m", name:"bl_ticket_ids", fieldLabel:"票价id",xtype:"hidden"},
        {id:"bl_product_id_m",name:"bl_product_id",fieldLabel:"产品id",xtype:'hidden'},
        {id:"bl_product_type_m",name:"bl_product_type",fieldLabel:"产品类型",xtype:'hidden'},
            {id:"bl_org_id_m",name:"bl_org_id",fieldLabel:"单位ID",xtype:'hidden'},
        {id:"bl_ticket_ids_m",name:"bl_ticket_ids",fieldLabel:"票种",xtype:'hidden'},
       /* {id:"bl_name_m",name:"bl_name",fieldLabel:"班期名称",allowBlank:false},*/
        {id:"bl_num_m",name:"bl_num",fieldLabel:'<font color="red">*</font> 班期编号',maxLength:20,vtype:'alphanum',vtypeText:'只能输入字母、数字和_。',allowBlank:false,listeners:{'blur':function(t){
            var product_data=SUNLINE.getSelected(_p_grid);
            create_calendar( product_data.data.p_id, t.getValue());
        },
        }},
        {id:"bl_name_m",name:"bl_name",fieldLabel:"班期名称",maxLength:"6",xtype:"textfield"},
        {id:"bl_start_time_m",name:"bl_start_time",fieldLabel:'出发时分',maxLength:"5", emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'},
        //Dict_cmb_m.box,
        {id:"bl_count_m",name:"bl_count",fieldLabel:'<font color="red">*</font> 车量数',maxLength:"11",xtype:"numberfield",minValue:0, allowBlank:false,listeners:{'focus':function(t){mul_focus(t.getValue())},'blur':function(t){mul_change(t.getValue(),'num')}}},
        {id:"bl_fake_saled_m",name:"bl_fake_saled",fieldLabel:"虚拟已售数",maxLength:"11",xtype:"numberfield",value:0},
        {id:"bl_seats_m",name:"bl_seats",fieldLabel:'<font color="red">*</font> 车座数',maxLength:"11",xtype:"numberfield",minValue:0, allowBlank:false,listeners:{'focus':function(t){mul_focus(t.getValue())},'blur':function(t){mul_change(t.getValue(),'seat')}}},
        {
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            name:"bl_print_num",
            fieldLabel:"打印班次号",
            xtype:"combo",
            editable:false,
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['combo_value'],
                data:[
                    ['是'],
                    ['否']
                ]
            }),
            displayField:"combo_value",
            valueField:"combo_value",
            mode:"local",
            forceSelection:true,
            typeAhead:true,
            value:"是"
        },
        {
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            name:"bl_right_seat",
            fieldLabel:"对号入座",
            xtype:"combo",
            editable:false,
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['combo_value'],
                data:[
                    ['不对号入座'],
                    ['对号入座（系统随机）'],
                    ['对号入座（人工选择）']
                ]
            }),
            displayField:"combo_value",
            valueField:"combo_value",
            mode:"local",
            forceSelection:true,
            typeAhead:true,
            value:"不对号入座"
        },
        {id:'bl_cluster_m',name:"bl_cluster", fieldLabel:"成团人数", allowBlank:false,value:0,xtype:'numberfield',minValue:0},
        SUNLINE.stop_sale_time_tool({id:"bl_stop_time_m",name:"bl_stop_time",fieldLabel:'<font color="red">*</font> 停售时间',allowBlank:false,width:230,labelWidth:80,labelAlign:"right"}),
        //{ xtype:'displayfield',html:""},
        { xtype:"button",text:'批量预留锁定车座',width:'130',style:"float: left",handler:function(){modify_bus_info('mul_add',this)}, disabled:isDisabled('BusList::add_batch')},
        {
            id:'show_text',
            xtype : 'label',
            html : '<span style="margin-left: 10px;margin-top: 5px; float: left; ">已预留座位 <span style="color:red">0</span> ,锁定座位 <span style="color:red">0</span></span>'
        }];
    /**
     * 批量添加的表单
     * @type {Ext.form.FormPanel}
     */
    var busList_form=new Ext.form.FormPanel({
        border:false,
        region:'west',
        width : 515,
        bodyStyle:"background:#fff;padding:5px;",
        autoHeight:true,
        cls:'tcol3',
        defaults:{xtype:'textfield',labelWidth:80,width:230,labelAlign:"right",style:'margin-top:5px;'},
        items:bus_list_form_items_multi
    });

    var calendar = new Ext.Panel({
        region : 'center',
        border : false,
        bodyStyle:"background:#f6f6f6;padding:5px",
        html : '<div class="multi_calendar" id="sun_calendar">' +
        '<div class="toolbar">' +
        '<span class="prev"><<上个月</span>' +
        '<span class="next">下个月>></span>' +
        '<div class="title"></div>' +
        '</div>' +
        '<div class="calendar_body">' +
        '<div class="c_li"></div>' +
        '<div class="clear"></div>' +
        '</div>'
    });

    /**
     * 表单+日历
     */
    var north_panel = new Ext.Panel({
        region : 'north',
        border : false,
        layout : 'border',
        height : 230,
        items : [ busList_form, calendar ]
    });

    /*票价信息表(start)*/
    var ticket_field=[
        "t_id","t_name","t_product_id","t_site_name","t_site_name_rule","t_preset_type","t_detail",{name:"t_price",type:'float'},
        {name:"t_trade_price",type:'float'},{name:"t_agency_price",type:'float'},"t_spread_price",
        "t_web_price","t_web_show","t_time","t_discount","t_pym","t_weekly","t_rebate","t_bind",
        "t_limit_type","t_limit_condition","t_single","t_order","t_remark","t_contain","t_uncontain",
        "t_status","t_room","t_store"
    ];

    var ticket_store = SUNLINE.JsonStore($__app__ + '/Ticket/bus_tickets',ticket_field,false,{pageSize:100});
    var ticket_store_multi = SUNLINE.JsonStore($__app__ + '/Ticket/bus_tickets',ticket_field,false,{pageSize:100});

    function salesStatus(v, m, r){
        var sg = r.get('t_single') , t1=t2=['#ccc','非'];
        if (sg=='1') t1 = ['green',''];
        if (v=='有效') t2 = ['blue',''];
        var tmp='<span style="color:'+t2[0]+';" qtip="'+t2[1]+'有效票价">效</span>';
        tmp += '<span style="color:'+t1[0]+';" qtip="'+t1[1]+'独立销售">独</span>';
        return tmp;
    };
    function t_store(v){
        if (v==-1){ v = '无限制'; };
        return v;
    };
    var t_room_data = [[1,'房源充足，可自由选择'],[2,'不能选房，只能拼房'],[3,'必须补房差']];
    function t_room(v){
        for (var i=0; i<t_room_data.length; i++){
            if (v==t_room_data[i][0]) return t_room_data[i][1];
        };
        return '***';
    };
    /**
     * 市场权限显示
     * @param v 市场城市
     * @returns {string}
     */
    function site_name_rule_fn(v){
        if(!v)return '<font color="green">0站点</font>';
        var site= v.split(',');
        var len=site.length;
        return '<font color="green" data-qtip="'+v+'">'+len+'站点</font>';
    }
    var ticket_cm = [
        new Ext.grid.RowNumberer(),
        {header:"ID",dataIndex:"t_id",width:50,hidden:true,align:'right'},
        {header:"<span style='color:#6b47bd'>状态</span>",dataIndex:"t_status",width:55,align:'center',renderer:salesStatus,editor:new Ext.form.ComboBox({
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['t_status'],
                data:[['有效'],[ '无效']]
            }),
            displayField:"t_status",
            valueField:"t_status",
            mode:"local",forceSelection:true,typeAhead:true,value:"0", editable:false
        })},
        {header:"适用站点",dataIndex:"t_site_name_rule",width:80,align:'center',renderer:site_name_rule_fn},
        {header:"票价名称",dataIndex:"t_standards_name",width:100},
        {header:"<span style='color:#6b47bd'>门市价</span>",dataIndex:"t_price",width:100,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true,regex:/^[0-9]\d*(\.\d+)?$/,regexText:'只能输入大于等于0的数字'}), sortable:true,renderer:money},
        {header:"<span style='color:#6b47bd'>同行价</span>",dataIndex:"t_trade_price",width:100,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true,regex:/^[0-9]\d*(\.\d+)?$/,regexText:'只能输入大于等于0的数字'}), sortable:true,renderer:money},
        {header:"周几有效",dataIndex:"t_weekly",width:120,renderer:SUNLINE.weekRenderer},
        {header:"<span style='color:#6b47bd'>库存量</span>",dataIndex:"t_store",width:80,tooltip:'-1为不限制',editor:new Ext.form.NumberField({selectOnFocus:true}),renderer:t_store},
        {header:"<span style='color:#6b47bd'>拼房选项</span>",dataIndex:"t_room",width:150,renderer:t_room,
            editor:new Ext.form.ComboBox({
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['combo_t_room_v','combo_t_room'],
                    data:t_room_data
                }),
                displayField:"combo_t_room",
                valueField:"combo_t_room_v",
                mode:"local",forceSelection:true,typeAhead:true,value:"0", editable:false
            })
        },
        {header:"预置类型",dataIndex:"t_preset_type",width:100},
        {header:"是否返利",dataIndex:"t_rebate",width:60},
        {header:"限制类型",dataIndex:"t_limit_type",width:80},
        {header:"限制条件",dataIndex:"t_limit_condition",width:80},
        {header:"编辑时间",dataIndex:"t_time",width:150},
        {header:"票价简介",dataIndex:"t_remark",width:200}
    ];

    var ticket_grid = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: ticket_store,//数据源
        columns: ticket_cm,//表格列定义
        selModel:{
            selType: 'checkboxmodel',
            mode:'SIMPLE'
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        tbar: [
            {text:'刷新',iconCls:'button-ref',handler:function(){ticket_store.reload()}},
            '-',
            '<span style="color:#666">双击表头<span style=\'color:#6b47bd\'>紫色</span>的列可以直接修改，修改的信息只作用于当前班期。</span>'
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: ticket_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    //批量添加
    var ticket_grid_multi = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: ticket_store_multi,//数据源
        columns: ticket_cm,//表格列定义
        selModel:{
            selType: 'checkboxmodel'
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        tbar: [
            {text:'刷新',iconCls:'button-ref',handler:function(){ticket_store_multi.reload()}},
            '-',
            '<span style="color:#666">双击表头<span style=\'color:#6b47bd\'>紫色</span>的列可以直接修改，修改的信息只作用于当前班期。</span>',
            '->',
            '<span style="color: red;">注：日历支持点选、拖选等操作，按住ctrl键还可以多选。</span>'
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: ticket_store_multi,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    ticket_grid.on('edit', function(t,e){
        if ( e.value == e.originalValue ) return false;
        window.ticket_is_changed = true;
    });

    ticket_grid_multi.on('edit', function(t,e){
        if ( e.value == e.originalValue ) return false;
        window.ticket_is_changed = true;
    });

    /*票价信息表(end)*/

    /**
     * 批量开班
     * @type {Ext.Window}
     */
    var busList_win_multi=new Ext.Window({
        title : '批量添加',
        layout: 'border',
        width : 900,
        //width:Ext.getBody().getWidth()-50,
        height:Ext.getBody().getHeight()-50,
        minHeight:600,
        closeAction : 'hide',
        //resizable:false,
        modal:true,
        items:[north_panel,ticket_grid_multi],
        buttons: [
            '批量添加的班期默认为“正常”状态。',
            {text : '保存', handler:do_submit_multi},
            {text : '关闭', handler:function(){
                remove_operation_data_by_productid();
                busList_win_multi.hide();
            }}
        ]
    });

    busList_win_multi.on('show',function(){
        var row=SUNLINE.getSelected(_p_grid);
        var f_form=busList_form.getForm();
        f_form.reset();
        f_form.setValues(BUSLIST.values);
        SUNLINE.baseParams(ticket_store_multi,{t_product_id:row.data.p_id,bl_id:BUSLIST.values.bl_id},true);
        ticket_store_multi.load(function(){
            ticket_select_row(ticket_store_multi,ticket_grid_multi);
        });
        create_calendar(row.data.p_id,row.data.p_num);
    });
    busList_win_multi.on('hide',function(){remove_operation_data_by_productid();})
    var bus_list_form_items_single=[
        {id:"bl_id", name:"bl_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
        {id:"bl_ticket_ids", name:"bl_ticket_ids", fieldLabel:"票价id",xtype:"hidden"},
        {id:"bl_product_id", name:"bl_product_id", fieldLabel:"商品ID", maxLength:"10",xtype:"hidden"},
        {id:"bl_product_type", name:"bl_product_type", fieldLabel:"商品类型", maxLength:"10",xtype:"hidden"},
        {id:"bl_num",name:"bl_num", fieldLabel:"<font color='red'>*</font> 班期编号",allowBlank:false,vtype:'alphanum',vtypeText:'只能输入字母、数字和_。'},
        {id:"bl_name",name:"bl_name",fieldLabel:"班期名称",maxLength:"6",xtype:"textfield"},
        SUNLINE.ExtDateField({id:'bl_start_date',name:'bl_start_date',labelWidth:80,labelAlign:"right",fieldLabel:"开始时间",width:250,
            listeners:{
                select : function(t, d){
                    var show = '';
                    var new_v = Ext.util.Format.date(d,'Y-m-d');
                    var data_value = Ext.util.Format.date(d,'w');
                    var old_v = Ext.getCmp('bl_start_date').getValue();
                    if(new_v != old_v){
                        show = get_week_by_date(d);
                        Ext.getCmp('bl_week_show').setValue(show);
                        Ext.getCmp('bl_week').setValue(data_value);
                    }
                }
            }
        }),
        {id:'bl_week_show',name:"bl_week_show", fieldLabel:"星期几",readOnly:true},
        {id:'bl_week',name:"bl_week", fieldLabel:"",xtype:'hidden'},
        /*{id:"bl_name", name:"bl_name", fieldLabel:"班期名称", allowBlank:false},*/
        //Dict_cmb.box,
        {id:'bl_count',name:"bl_count", fieldLabel:"<font color='red'>*</font> 车辆数", allowBlank:false,minValue:0,xtype:"numberfield"},
        {id:'bl_seats',name:"bl_seats", fieldLabel:"<font color='red'>*</font> 每车座位数", allowBlank:false,minValue:0,xtype:"numberfield"},

        {id:'bl_start_time',name:"bl_start_time", fieldLabel:"出发时分",emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'
        },
        SUNLINE.stop_sale_time_tool({id:"bl_stop_time",name:"bl_stop_time",fieldLabel:'<font color="red">*</font> 停售时间',allowBlank:false,width:250,labelWidth:80,labelAlign:"right"}),

        {id:'bl_fake_saled',name:"bl_fake_saled", fieldLabel:"虚拟已售数", allowBlank:false,value:0},
        {
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            name:"bl_print_num",
            fieldLabel:"打印班次号",
            xtype:"combo",
            editable:false,
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['combo_value'],
                data:[
                    ['是'],
                    ['否']
                ]
            }),
            displayField:"combo_value",
            valueField:"combo_value",
            mode:"local",
            forceSelection:true,
            typeAhead:true,
            value:"是"
        },
        {id:'bl_cluster_s2',name:"bl_cluster", style:'margin-top:5px;',fieldLabel:"成团人数", allowBlank:false,value:0,xtype:'numberfield',minValue:0},
        {
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            name:"bl_right_seat",
            fieldLabel:"对号入座",
            xtype:"combo",
            editable:false,
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['combo_value'],
                data:[
                    ['不对号入座'],
                    ['对号入座（系统随机）'],
                    ['对号入座（人工选择）']
                ]
            }),
            displayField:"combo_value",
            valueField:"combo_value",
            mode:"local",
            forceSelection:true,
            typeAhead:true,
            value:"不对号入座"
        },

    ];

    /**
     * 单天添加与编辑表单
     * @type {Ext.form.FormPanel}
     */
    var busList_form_single = new Ext.form.FormPanel({
        border : false,
        region : 'north',
        height: 150,
        split:{size:3},
        bodyStyle : "background:#fff;padding:5",
        cls:'tcol3',
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:5px;'},
        items:bus_list_form_items_single
    });


    /**
     * 添加与编辑时的表单
     * @type {Ext.Window}
     */
    var busList_win_single=new Ext.Window({
        title : thisTitle,
        layout: 'border',
        width : 900,
        //width:Ext.getBody().getWidth()-50,
        minHeight: 500,
        height:Ext.getBody().getHeight()-50,
        closeAction : 'hide',
        modal:true,
        items:[busList_form_single,ticket_grid],
        buttons: [
            /*{text : '值', handler:function(){ showFormValues(busList_form_single)}},*/
            {text : '保存', handler:doSubmit},
            {text : '关闭', handler:function(){busList_win_single.hide();}}
        ]
    });

    busList_win_single.on({
        show:function(){
            var f_form=busList_form_single.getForm();
            f_form.reset();

            show_box_data(BUSLIST.values,'single');
            f_form.setValues(BUSLIST.values);
            var row = SUNLINE.getSelected(_grid);
            if(row){
                var p_id = row.data.bl_product_id;
            }else{
                var p_id = PRODUCTS.p_id;
            }
            SUNLINE.baseParams(ticket_store,{t_product_id:p_id,bl_id:BUSLIST.values.bl_id},true);
            ticket_store.load(function(){
                ticket_select_row(ticket_store,ticket_grid);
            });
        }
    });
    /*添加班期表单项（end）*/

    function show_box_data(values,type){
        if(values.bl_brand){
            if(type=='single'){
                Dict_cmb.store.add({d_text:values.bl_brand});
            }else{
                Dict_cmb_m.store.add({d_text:values.bl_brand});
            }
        }
    }

    /**
     * 添加、批量添加、编辑班期计划
     * @param b
     */
    function modify(b){
        if(b.act=='add' || b.act=='add_multi'){
            var row = SUNLINE.getSelected(_p_grid, true);
            if(row.length==0){
                Ext.Msg.alert('友情提示','请选择需要操作的对应产品!');
                return false;
            }
            if(row.length>1){
                Ext.Msg.alert('友情提示','请选择单条产品线路!');
                return false;
            }
            var p_row=row[0].data;
            do_operation_data(p_row.p_id);
            am = b.act=='add_multi'? '批量':'';
            titles='班期'+am+'添加';
            var s_date = Ext.getCmp('seach_start_date').getValue();
            var week = get_week_by_date(s_date);
            BUSLIST.values={
                'bl_id':'',
                'bl_ticket_ids':'',
                'bl_product_id':p_row.p_id,
                'bl_org_id':p_row.p_org_id,
                'bl_product_type':p_row.p_type,
                'bl_num':p_row.p_num,
                'bl_fake_saled':0,
                'bl_start_date': Ext.Date.format(s_date, 'Y-m-d'),
                'bl_start_date_s': Ext.Date.format(s_date, 'Y-m-d'),
                'bl_stop_time':'提前30分钟',
                'bl_week_show':week
            };
            if (b.act=='add') BUSLIST.values['bl_week'] = get_week_by_date(s_date, true);
            if (p_row.p_type==11) BUSLIST.values['bl_count'] = 1;
            read_only(false)
        }else{
            window.busList_row=getListRow();
            if(!busList_row){
                return false;
            };
            BUSLIST.values=busList_row.data;
            BUSLIST.values.bl_start_date = int2date(BUSLIST.values.bl_start_date);
            BUSLIST.values.bl_start_date_s = int2date(BUSLIST.values.bl_start_date);
            BUSLIST.values.bl_week_show = get_week_js_date( int2date(BUSLIST.values.bl_start_date, true) );
            titles='班期调整';
            read_only(true);
        }
        if (b.act=='add_multi'){
            busList_win_multi.setTitle(titles+'【'+PRODUCTS.p_name+'】', b.iconCls);
            busList_win_multi.show(b.id);
            return;
        }else if(b.act=='add'){
            busList_win_single.setTitle(titles+'【'+PRODUCTS.p_name+'】', b.iconCls);
            busList_win_single.show(b.id);
        }else{
            busList_win_single.setTitle(titles+'【'+busList_row.data.p_name+'】', b.iconCls);
            busList_win_single.show(b.id);
        }
    }
    function read_only(bool){
        var f=['bl_count','bl_seats','bl_start_date','bl_num'];
        for(var i=0; i<f.length;i++){
            Ext.getCmp(f[i]).setReadOnly(bool);
        }
    }
    //票价加载时 对之前已选的票价进行选中
    function ticket_select_row(store,grid){
        var tickets = BUSLIST.values.bl_ticket_ids;
        var indexs=[];
        if (!tickets){
            grid.getSelectionModel().selectAll(true);
        }else{
            var ids = tickets.split(',');
            for (var i=0; i<ids.length; i++){
                var index = store.find('t_id', eval('/^'+ids[i]+'$/') );
                indexs.push( store.getAt(index) );
            };
            if(indexs.length>0) grid.getSelectionModel().select(indexs);
        }
    }

    /**
     * 删除班期计划
     */
    function busList_del(){
        var rows = SUNLINE.getSelected(_grid, true);
        if(rows.length == 0){
            Ext.Msg.alert('友情提示','请选择需要删除的班期！');
            return false;
        }
        Ext.Msg.confirm('友情提示', "是否确定删除选中的班期吗？" +
            "<div style='color:red'>删除的班期可能被班期计划重新生成，若想彻底停班，请使用“暂停”功能。</div>", function (opt) {
            if(opt == 'yes'){
                var bl_id = [];
                for (var i = 0; i < rows.length; i++) {
                    if(rows[i].data.bl_status!='正常'){
                        Ext.Msg.alert('友情提示','删除操作只适用于状态为正常的班期，请重新选择！');
                        return false;
                    }
                    bl_id[i] = parseInt(rows[i].data.bl_id);
                }
                var bl_ids = bl_id.join(',');
                Ext.Ajax.request({
                    url:$__app__ + '/BusList/batchDelBusList',
                    method:'POST',
                    params:{bl_ids:bl_ids},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var msg = ret.info.msg;
                        if (ret.status==1){
                            busList_store.reload();
                        };
                        Ext.Msg.alert('友情提示',msg);
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '未知错误！',function(){});
                    }
                });
            }
        });
    }

    /**
     * 修改班期状态
     * @param b
     * @param listData
     */
    function updateStatus(b,listData){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        //listData.actType= b.act;
        Ext.Ajax.request({
            url:$__app__ + '/BusList/batchSetListStatus',
            method:'POST',
            params:{bl_ids:listData,actType:b.act},
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg = ret.info;
                if(ret.status){
                    busList_store.reload();
                };
                Ext.Msg.alert('友情提示',msg);
                myMask.hide();
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '未知错误！');
            }
        });
    };

    /**
     * 确定、暂停、取消、恢复售票班期计划
     */
    function busListSet(b){
        var rows = SUNLINE.getSelected(_grid, true);
        if(rows.length == 0){
            Ext.Msg.alert('友情提示','请选择需要操作的班期！');
            return false;
        }
        var bl_id = [];
        for (var i = 0; i < rows.length; i++) {
            if(b.act=='hf' && rows[i].data.bl_status!='暂停'){
                Ext.Msg.alert('友情提示','恢复操作只适用于状态为暂停的班期，请重新选择！');
                return false;
            }else if(b.act=='zt' && rows[i].data.bl_status!='正常'){
                Ext.Msg.alert('友情提示','暂停操作只适用于状态为正常的班期，请重新选择！');
                return false;
            }
            bl_id[i] = parseInt(rows[i].data.bl_id);
        }
        var bl_ids = bl_id.join(',');
        if(b.act=='zt'){
            Ext.Msg.confirm('友情提示', '您确定要暂停班期吗?', function (opt) {
                if(opt == 'yes'){
                    updateStatus(b,bl_ids);
                };
            });
        }else{
            updateStatus(b,bl_ids);
        }
    }

    /**
     * 行程调整
     */
    function chg_journey(){

    }



    function get_week_price(records, week){
        var wp = [999999999,999999999,999999999,999999999,999999999,999999999,999999999];
        var ids = [];
        Ext.each(records, function(record, index, all){
            ids.push(record.get('t_id'));
            var w = record.get('t_weekly'),
                ww = w.split(','),
                price=record.get('t_price'),
                type=record.get('t_preset_type');
            for (var _w=0; _w<ww.length; _w++){
                var pp = wp[ww[_w]];
                if (type!='座位票' && pp>price){
                    wp[ww[_w]] = price;
                }
            };
        });
        if (week > -1) wp = wp[week];
        return [wp, ids];
    };

    function get_changed_ticket(grid){
        //需要保存的字段列表
        var field = [
            't_id','t_status','t_name','t_price','t_trade_price','t_agency_price',
            't_weekly','t_limit_type','t_limit_condition','t_room','t_store'
        ];
        var sm = grid.getSelectionModel();
        var sd = sm.getSelection(), data={};
        Ext.each(sd, function(record, index, all){
            var d = {};
            for (var i=0; i<field.length; i++){
                d[field[i]] = record.get(field[i]);
            };
            var id = record.get('t_id');
            data[id] = d;
        });
        return data;
    };

    /**
     * 批量确认保存，确认编辑
     */
    function do_submit_multi(b){
        var s = busList_form.getForm().getValues();
        if(!busList_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };
        var records = ticket_grid_multi.getSelectionModel().getSelection();
        var ticket = get_week_price(records);
        s.bl_ticket_ids = ticket[1].join(',');
        s.bl_price = ticket[0].join(',');
        if (ticket_is_changed == true){
            var tickets = get_changed_ticket(ticket_grid_multi);
            s['bl_ticket_detail'] = Ext.encode(tickets);
        };
        //全选状态下内容为空
        if(ticket[1].length==ticket_grid_multi.store.getCount())s.bl_ticket_ids ='';
        submit_ajax(s,busList_win_multi);
    }

    /**
     * 单条添加班期信息
     * @param b
     */
    function doSubmit(b){
        var s = busList_form_single.getForm().getValues();
        if(!busList_form_single.getForm().isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };
        var records = ticket_grid.getSelectionModel().getSelection();
        var week = str_to_date(s.bl_start_date,'w');
        var ticket = get_week_price(records, week);
        s.bl_ticket_ids = ticket[1].join(',');
        s.bl_price = ticket[0];
        if (s.bl_ticket_ids == ''){
            Ext.Msg.alert('友情提示', '请正确选择本班期可用的票价。');
            return;
        };
        if (ticket_is_changed == true){
            var tickets = get_changed_ticket(ticket_grid);
            var bool_flag = true;
            $.each(tickets,function(ti,tv){
                if(Number(tv.t_trade_price) > Number(tv.t_price)){
                    bool_flag = false;
                    return false;
                }
            });
            if(bool_flag === false){
                Ext.Msg.alert('友情提示','【同行价】必须小于【门市价】，请仔细检查！');
                return false;
            }
            s['bl_ticket_detail'] = Ext.encode(tickets);
        };
        //全选状态下内容为空
        if(ticket[1].length==ticket_grid.store.getCount())s.bl_ticket_ids ='';
        submit_ajax(s,busList_win_single);
    }

    /**
     * 班期添加与修改
     * @param s
     * @param win
     * @returns {string}
     */
    function submit_ajax(s,win){
        if(!s)return '';
        s.bl_org_id=Org_id;
        var submit_data = [];
        if(OPERATION_SEAT.length > 0){
           Ext.each(OPERATION_SEAT,function(v){
               if(v.bl_product_id == s.bl_product_id){
                   submit_data.push(v);
               }
           })
        }
        s.operation_data = JSON.stringify(submit_data);
        Ext.MessageBox.confirm('友情提示','你确认需要添加当天班期吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/BusList/save',
                method:'POST',
                params:s,
                success : function(response, opts){
                    var rst = Ext.decode(response.responseText);
                    var msg = rst.info;
                    myMask.hide();
                    if (rst.status==1){
                        win.hide();
                        var p_id = parseInt(msg);
                        if (!isNaN(p_id)){
                            msg = msg.substring(p_id.toString().length);
                            busList_store.load();
                        }else{
                            busList_store.reload();
                        }
                    };
                    remove_operation_data_by_productid();
                    Ext.Msg.alert('友情提示',msg);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '未知错误！');
                }
            });
        });
    };

    /*修改车座信息(start)*/
    var mbi_win, mbi_bus_panel, mbi_seat_panel, mbi_bus_store, mbi_seat_store, bus_view, seat_view, users_box, reserve_org;
    function modify_bus_info(type,b){
        TYPE_G = type;
        if(TYPE_G == 'mul_add'){
            var bl_num = Ext.getCmp('bl_num_m').getValue();
            var sf_time = '';
            var num = Ext.getCmp('bl_count_m').getValue();
            var seat = Ext.getCmp('bl_seats_m').getValue();
            if(num ==null || seat == null){
                Ext.Msg.alert('友情提示', '未填写车辆数或者座位数');return false;
            }
        }else {
            var row = SUNLINE.getSelected(_grid);
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要调整的班期！');
                return false;
            };
            var sf_time = int2date(row.get('bl_start_date')) + ' ' + row.get('bl_start_time');
            var bl_num=row.data.bl_num;
        }
        var bus_tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap">',
            '<div class="bus"> BUS </div>',
            '<div class="bus-info">{bl_num} <b>{num}号车</b> [{sf_time}]'+
            '<br>总数：{seats} &nbsp;已售：{sale} </div>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        );
        var seat_tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap {status} {cls}">',
            '<div class="thumb" data-qtip="{[ this.get_status(values) ]}">{num}</div>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>',
            {
                get_status : function(v){
                    var s = {
                        sale : '已售',
                        lock : '锁定',
                        reserve : '预留',
                        plan : '计划单锁定',
                        empty  : '空座'
                    };
                    var user = time = '';
                    if (v.user) user = '<br>' + v.org_name+'('+ v.u_name+')';
                    var myDate = new Date(v.time);
                    var t = myDate.getTime();
                    if (s[v.status] != '已售' && t && t>0) time = '<br>预留到：'+v.time;
                    return '<b>'+s[v.status]+'</b>' + user + time;
                }
            }
        );
        if (!mbi_bus_store){
            mbi_bus_store = SUNLINE.JsonStore($__app__ + '/BusList/get_bus', ['num','seats','sale','max'], false);
            mbi_bus_store.on('load', function(s){
                if (s.getCount()>0){
                    s.each(function(r){
                        if(TYPE_G == 'mul_add'){
                            r.set('sf_time','适用于任一个选择的日期');
                            r.set('bl_num',bl_num);
                        }else{
                            var list_row = getListRow();
                            r.set('sf_time', int2date(list_row.get('bl_start_date')) + ' ' + list_row.get('bl_start_time'));
                            r.set('bl_num', list_row.get('bl_num'));
                        }
                    });
                    bus_view.select(0);
                }
            });
        };
        if(TYPE_G == 'mul_add'){
            SUNLINE.baseParams(mbi_bus_store,{type:'mul_add',num:num,seat:seat});
        }else{
            SUNLINE.baseParams(mbi_bus_store,{type:'single_add',bl_id:row.data.bl_id, start_date:row.data.bl_start_date});
        }
        mbi_bus_store.load();
        if (!mbi_seat_store){
            mbi_seat_store = SUNLINE.JsonStore($__app__ + '/BusList/get_seat', ['num','status','cls','user','time'], false);
        };
        if(TYPE_G == 'mul_add'){
            if(OPERATION_SEAT.length != 0){
                var opeartion_data = JSON.stringify(OPERATION_SEAT);
            }else{
                var opeartion_data = '';
            }
            var row =  SUNLINE.getSelected(_p_grid);
            SUNLINE.baseParams(mbi_seat_store,{type:'mul_add',seat:seat,operation:opeartion_data,bus_num:1,bl_product_id:row.data.p_id})
        }else{
            SUNLINE.baseParams(mbi_seat_store,{type:'single_add',bl_id:row.data.bl_id, start_date:row.data.bl_start_date})
        }
        mbi_seat_store.load();
        mbi_seat_store.on('load',function(){
            setTimeout(function(){
                var seat_h = parseInt((mbi_seat_store.count()/4)*34)+20;
                var div_seat_h = document.getElementById('bus-view-body').getElementsByTagName('div')[0].clientHeight;
                if(seat_h > div_seat_h-20){
                    document.getElementById('seat-view-body').getElementsByTagName('div')[0].style.height=seat_h+'px';
                }else{
                    document.getElementById('seat-view-body').getElementsByTagName('div')[0].style.height=(div_seat_h-20)+'px';
                }
            },500);
        });
        if(!bus_view){
            bus_view = new Ext.DataView({
                store: mbi_bus_store,
                tpl: bus_tpl,
                //width:300,
                //autoHeight:true,
                singleSelect: true,
                style:{margin:'10px',height:'200px'},
                overClass:'x-view-over',
                itemSelector:'div.thumb-wrap',
                emptyText: '请选择您要查看的班期信息。',
                listeners:{
                    'selectionchange':function(dv, nodes){
                        try{
                            var seat = Ext.getCmp('bl_seats_m').getValue();
                            var num = Ext.getCmp('bl_count_m').getValue();
                            var row=nodes[0].data;
                            if(TYPE_G == 'mul_add'){
                                var p_left_row = SUNLINE.getSelected(_p_grid);
                                var operation_data = new Array();
                                if(OPERATION_SEAT.length != 0){
                                    Ext.each(OPERATION_SEAT,function(v){
                                        if(row.num == v.num){
                                            operation_data.push(v);
                                        }
                                    })
                                }
                                SUNLINE.baseParams(mbi_seat_store,{type:'mul_add',seat:seat,operation:JSON.stringify(operation_data),bus_num:row.num,bl_product_id:p_left_row.data.p_id})
                                mbi_seat_store.load();
                            }else{
                                SUNLINE.baseParams(mbi_seat_store,{bus_num:row.num,seats:row.seats},true);
                                mbi_seat_store.load();
                            }
                            Ext.getCmp('car_num').setValue(row.num);
                            Ext.getCmp('car_seats').setValue(row.seats);
                        }catch(e){
                        }
                    }
                }
            });
        }

        if(!seat_view){
            seat_view = new Ext.DataView({
                store: mbi_seat_store,
                tpl: seat_tpl,
                style:'padding:10px 35px;margin:0px;right:0px;left:0px;',
                autoHeight:true,
                multiSelect: true,
                trackOver:true,
                simpleSelect:true,
                overClass:'x-view-over',
                itemSelector:'div.thumb-wrap',
                emptyText: '请选择您要查看的车号。',
                plugins: [ new Ext.ux.DataView.DragSelector({})]
            });
        }

        if(!mbi_seat_panel){
            mbi_seat_panel = new Ext.Panel({
                id:'seat-view',
                cls : 'data_view',
                region : 'east',
                border:false,
                autoScroll : true,
                layout : 'fit',
                width:330,
                style:{margin:'5px',border:'1px solid #009DD9'},
                bodyStyle : 'overflow-x: hidden; background:#fff;',
                title:'座位信息（鼠标移到空白处可拖选多个）',
                items : seat_view
            });
        }

        if(!mbi_bus_panel){
            mbi_bus_panel = new Ext.panel.Panel({
                id:'bus-view',
                cls : 'data_view',
                region : 'center',
                border : false,
                height:330,
                autoScroll : true,
                style:{border:'1px solid #009DD9',margin:'5px'},
                bodyStyle : 'overflow-x: hidden; background:#fff;',
                title:'可用车辆信息',
                items : bus_view
            });
        }
        var users_box=SUNLINE.UserCompanyBox({
            where:{
                org_type:'分销商'
            },
            config:{
                id:'user_company_box', //必写，不然跟前面所属单位ID相同
                displayField:'org_name',
                valueField:'org_name',
                tpl:Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{u_realname} - {org_name}</li>',
                    '</tpl></ul>'
                ),
                pageSize:20,
                fieldLabel:'',
                labelWidth:0,
                width:220,
                matchFieldWidth:false,
                columnWidth:300,
                labelAlign:'right'
            }
        });
        if(!mbi_win){
            mbi_win = new Ext.Window({
                layout : 'border',
                modal : true,
                closeAction : 'hide',
                width : 900,
                style :'background:#fff";border:1px solid #009DD9',
                bodyStyle:"background:#fff;border-top:2px solid #009DD9 !important",
                tbar : [{
                    xtype: 'buttongroup',
                    columns: 3,
                    style:{border:'1px solid #009DD9'},
                    bodyStyle :'padding-top:5px;',
                    header:{
                        title:'调整座位数',
                        style:'background:#3892d3;font-family:"Microsoft Yahei";color:#fff;border:1px solid #009DD9'
                    },
                    items: [{
                        xtype:'tbtext', text:'当前车号'
                    },{
                        xtype:'numberfield', id:'car_num', width:100, readOnly:true,
                    },{
                        text: '修改',
                        id:'car_edit',
                        scale: 'medium',
                        rowspan: 2,
                        iconCls: 'button-edit',
                        iconAlign: 'top',
                        cls: 'x-btn-as-arrow',
                        style:"background:none",
                        border:false,
                        handler:change_seat_num
                    },{
                        xtype:'tbtext', text:'新座位数'
                    },{
                        xtype:'numberfield', id:'car_seats', width:100, selectOnFocus:true,

                    }]
                },{
                    xtype: 'buttongroup',
                    columns: 4,
                    style:{border:'1px solid #3892d3'},
                    bodyStyle :'padding-top:5px;',
                    header:{
                        title:'预留座位数',
                        style:'background:#3892d3;font-family:"Microsoft Yahei";color:#fff;border:1px solid #009DD9'
                    },
                    items: [
                        {
                            xtype:'tbtext', text:'选择单位：'
                        },
                        {
                            xtype:'hidden', text:'选择单位：',id:'user_id'
                        },
                        users_box,
                        {
                            text: '预留',
                            scale: 'medium',
                            rowspan: 2, iconCls: 'button-edit',
                            iconAlign: 'top',
                            style:"background:none",
                            border:false,
                            tooltip :'预留选定的座位给指定的旅行社，只对空座起作用。',
                            id:'reserve_seat',
                            cls: 'x-btn-as-arrow',
                            handler:function(){reserve_seat(type)}
                        },{
                            text: '释放',
                            act : 'reserve',
                            scale: 'medium',
                            rowspan: 2, iconCls: 'button-edit',
                            iconAlign: 'top',
                            style:"background:none",
                            border:false,
                            tooltip :'释放预留的座位，只对预留状态的座位起作用。',
                            cls: 'x-btn-as-arrow',
                            handler : function(){release_seat(type,this)}
                        },{
                            xtype:'tbtext', text:'<span qtip="预留到发车前几小时">预留时效：</span>'
                        },{
                            xtype:'numberfield', id:'save_time',  width:220, value:24, selectOnFocus:true
                        }]
                },{
                    xtype: 'buttongroup',
                    columns: 3,
                    style:{border:'1px solid #3892d3'},
                    bodyStyle :'padding-top:5px',
                    header:{
                        title:'其他管理',
                        style:'background:#3892d3;font-family:"Microsoft Yahei";color:#fff;border:1px solid #009DD9'
                    },
                    items: [{
                        text: '锁定座位',
                        scale: 'medium',
                        rowspan: 2, iconCls: 'button-lock',
                        iconAlign: 'top',
                        style:"background:none",
                        border:false,
                        cls: 'x-btn-as-arrow',
                        handler:function(){lock_seat(type,this)}
                    },{
                        text: '解锁',
                        act : 'lock',
                        scale: 'medium',
                        rowspan: 2, iconCls: 'button-lock',
                        iconAlign: 'top',
                        style:"background:none",
                        border:false,
                        cls: 'x-btn-as-arrow',
                        handler : function(){release_seat(type,this)}
                    },{
                        text:'新增车辆',
                        id:'add_car',
                        iconCls: 'button-add',
                        iconAlign: 'left',
                        scale: 'medium',
                        style:"background:none",
                        border:false,
                        handler:add_bus
                    },{
                        text:'删除车辆',
                        id:'del_car',
                        iconCls: 'button-del',
                        iconAlign: 'left',
                        scale: 'medium',
                        style:"background:none",
                        border:false,
                        tooltip : '只能删除最后一辆没有销售过的空车，如需要删除多辆，请重复操作。',
                        handler:remove_bus
                    }]
                }
                ],
                items:[mbi_bus_panel, mbi_seat_panel],
                listeners:{
                    'hide':function(w){
                        try{
                            mbi_bus_store.removeAll();
                            mbi_seat_store.removeAll();
                            store.reload();
                        }catch(e){}
                    }
                }
            });
            mbi_win.setTitle('车辆信息管理：' + bl_num);
            mbi_bus_store.load();
            users_box.on({
                select:function(c,r,o){
                    var row= r[0].data;
                    users_box.setValue(row.u_realname+'-'+row.org_name);
                    Ext.getCmp('user_id').setValue(row.u_id);
                }
            });
        };
        mbi_win.show();
        mbi_win.setTitle('车辆信息管理：' + bl_num);
        mbi_win.setHeight(Ext.getBody().getHeight()-50);
        if(TYPE_G == 'mul_add'){
            Ext.getCmp('car_num').setDisabled(true);
            Ext.getCmp('car_seats').setDisabled(true);
            Ext.getCmp('add_car').setDisabled(true);
            Ext.getCmp('del_car').setDisabled(true);
            Ext.getCmp('car_edit').setDisabled(true);
        }else{
            Ext.getCmp('car_num').setDisabled(false);
            Ext.getCmp('car_seats').setDisabled(false);
            Ext.getCmp('add_car').setDisabled(false);
            Ext.getCmp('del_car').setDisabled(false);
            Ext.getCmp('car_edit').setDisabled(false);
        }
        mbi_win.on({
            hide:function(){
                if(TYPE_G == 'mul_add'){
                    var index = new Array();
                    var i = 0;
                    var p_left_row = SUNLINE.getSelected(_p_grid);
                    var seat = Ext.getCmp('bl_seats_m').getValue();
                    var bl_num = Ext.getCmp('bl_count_m').getValue();
                    Ext.each(OPERATION_SEAT,function(v){
                        if(v.bl_product_id == p_left_row.data.p_id && (v.seats > seat || v.num > bl_num)){
                            index[i]= OPERATION_SEAT.indexOf(v);
                            i++;
                        }
                    })
                    index.sort(function(a,b){return b-a});
                    Ext.each(index,function(v){
                        OPERATION_SEAT.splice(v,1);
                    })
                    do_operation_data(p_left_row.data.p_id);
                }
                busList_store.load();
            }
        })
    }

    /**
     * 修改座位数
     * @param b
     */
    function change_seat_num(b){
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(_grid);
        var num = Ext.getCmp('car_num'), seat = Ext.getCmp('car_seats'),
            cs = seat.getValue();
        var car = bus_view.getSelectionModel().getSelection();
        if(car==''){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示', '请先选择要操作的车辆！');
            return;
        }
        var cd = car[0].data;
        if (cd.seats==cs){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示', '您填写的座位数量与当前的一样，无需修改。');
            return;
        }
        if (cd.max>cs){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示', '您填写的座位数量小于当前已售座位号，不能完成修改操作。');
            return;
        }
        var params = { bl_id:list_row.data.bl_id, bus_num:cd.num, seats: cs, bl_start_date:list_row.data.bl_start_date,bl_product_id:p_row.data.p_id };
        Ext.Msg.confirm('友情提示', '您真的要修改座位数量吗？',function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('正在保存座位信息，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__ + '/BusList/change_seat_num',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        SUNLINE.baseParams(mbi_seat_store,{bl_id:list_row.data.bl_id, bus_num:cd.num, seats: cs, start_date:list_row.data.bl_start_date});
                        mbi_seat_store.load();
                        mbi_bus_store.load();
                    }
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '修改座位信息失败！');
                    b.setDisabled(false);
                }
            });
        });
    };


    /**
     * 预留座位
     * @param b
     */
    function reserve_seat(type,b){
        var seat = Ext.getCmp('bl_seats_m').getValue();
        var bus_rcd;
        b = Ext.getCmp('reserve_seat');
        b.setDisabled(true);
       var p_left_row = SUNLINE.getSelected(_p_grid);
        if(TYPE_G != 'mul_add'){
            var list_row = getListRow();
            var bl_id = list_row.data.bl_id;
            var go_time = list_row.data.bl_start_date + ' ' + list_row.data.bl_start_time;
            var p_row=SUNLINE.getSelected(_grid);
        }
        var save_time = Ext.getCmp('save_time'); //company = Ext.getCmp('company'),
        var seat_rcd = seat_view.getSelectionModel().getSelection();
        bus_rcd = bus_view.getSelectionModel().getSelection();
        if(bus_rcd==''){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请先选择您要操作的车辆。' );
            return;
        }
        var company=Ext.getCmp('user_id').getValue();
        var st = get_selected_seat(seat_rcd);
        var tm = save_time.getValue();
        var num = bus_rcd[0].data.num;
        if ( company == '' ){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示','请选择您要为其预留座位的单位名称。');
            return;
        };
        if (st.length<1){
            b.setDisabled(false);
            var msg = '';
            if (seat_rcd.length>1) msg = '(注：只对空座操作，忽略其他状态的座位。)';
            Ext.Msg.alert('友情提示','请选择您要为其预留的座位。' + msg);
            return;
        };
        if(TYPE_G != 'mul_add') {
            var params = {
                bl_id: bl_id,
                user_id: company,
                seats: st.join(','),
                save_time: tm,
                num: num,
                go_time: go_time,
                bl_product_id: p_row.data.p_id
            };
        }
        Ext.Msg.confirm('友情提示', '您真的要预留这些座位吗？['+ st.join(',')+']', function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('正在保存座位信息，请稍候...');
            myMask.show();
            if(TYPE_G == 'mul_add'){
                Ext.each(st,function(v){
                    arr = {
                        user_id: company,
                        seats: v ,
                        save_time: tm,
                        num: num,
                        go_time: go_time,
                        bl_product_id: p_left_row.data.p_id,
                        type:'reserve'
                    }
                    if(is_in_array(arr,OPERATION_SEAT) == -1){
                        OPERATION_SEAT.push(arr);
                    }
                });
                do_operation_data(p_left_row.data.p_id);
                var operation_data = new Array();
                if(OPERATION_SEAT.length != 0){
                    Ext.each(OPERATION_SEAT,function(v){
                        if(num == v.num){
                            operation_data.push(v);
                        }
                    })
                }
                SUNLINE.baseParams(mbi_seat_store,{type:'mul_add',seat:seat,operation:JSON.stringify(operation_data),bus_num:num,bl_product_id:p_left_row.data.p_id})
                mbi_seat_store.load();
                Ext.Msg.alert('友情提示', '预留成功' );
                myMask.hide();
                b.setDisabled(false);
                return false;
            }
            Ext.Ajax.request({
                url: $__app__ + '/BusList/reserve_seat',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        mbi_seat_store.load();
                    }
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '预留座位操作失败！');
                    b.setDisabled(false);
                }
            });
        });
    };

    /**
     * 释放预留(锁定)座位
     * @param b
     */
    function release_seat(type,b){
        var p_left_row = SUNLINE.getSelected(_p_grid);
        var seat = Ext.getCmp('bl_seats_m').getValue();
        var bus_rcd;
        var act = b.act=='lock'?'锁定':'预留';
        var p_row=SUNLINE.getSelected(_grid);
        var seat_rcd = seat_view.getSelectionModel().getSelection();
        bus_rcd = bus_view.getSelectionModel().getSelection();
        if(bus_rcd==''){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请先选择您要操作的车辆。' );
            return;
        }
        var num = bus_rcd[0].data.num;
        var rs = get_selected_seat(seat_rcd, b.act);
        if(TYPE_G != 'mul_add'){
            var list_row = getListRow();
            var params = {bl_id:list_row.data.bl_id, num:num, seats:rs.join(','), act:b.act,bl_product_id:p_row.data.p_id};
        }
        if (rs.length<1){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请选择您要释放的'+ act +'座位。' );
            return;
        };
        Ext.Msg.confirm('友情提示','您确定要释放这些'+ act +'位置吗？['+ rs.join(',')+']',function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            var index= [];
            var i =0;
            if(TYPE_G=='mul_add'){
                Ext.each(rs,function(a){
                    Ext.each(OPERATION_SEAT,function(v_reserve){
                        if(v_reserve.seats == a && v_reserve.type == b.act){
                            index[i]= OPERATION_SEAT.indexOf(v_reserve);
                            i++;
                        }
                    })
                })
                index.sort(function(a,b){return b-a});
                Ext.each(index,function(v){
                    OPERATION_SEAT.splice(v,1);
                })
                Ext.Msg.alert('友情提示', '释放'+ act +'座位操作成功');
                myMask.hide();
                b.setDisabled(false);
                do_operation_data(p_left_row.data.p_id);
                var operation_data = new Array();
                if(OPERATION_SEAT.length != 0){
                    Ext.each(OPERATION_SEAT,function(v){
                        if(num == v.num){
                            operation_data.push(v);
                        }
                    })
                }
                SUNLINE.baseParams(mbi_seat_store,{type:'mul_add',seat:seat,operation:JSON.stringify(operation_data),bus_num:num,bl_product_id:p_left_row.data.p_id});
                mbi_seat_store.load();
                return false;
            }
            Ext.Ajax.request({
                url: $__app__ + '/BusList/release_seat',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        mbi_seat_store.load();
                    }
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '释放'+ act +'座位操作失败！');
                    b.setDisabled(false);
                }
            });
        });
    };


    /**
     * 锁定座位
     * @param b
     */
    function lock_seat(type,b){
        var p_left_row = SUNLINE.getSelected(_p_grid);
        var seat = Ext.getCmp('bl_seats_m').getValue();
        var bus_rcd;
        b.setDisabled(true);
        var p_row=SUNLINE.getSelected(_grid);
        var seat_rcd = seat_view.getSelectionModel().getSelection();
        bus_rcd = bus_view.getSelectionModel().getSelection();
        if(bus_rcd==''){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请先选择您要操作的车辆。' );
            return;
        }
        var num = bus_rcd[0].data.num;
        var rs = get_selected_seat(seat_rcd);
        if(TYPE_G != 'mul_add'){
            var list_row = getListRow();
            var params = {bl_id:list_row.data.bl_id, num:num, seats:rs.join(','),bl_product_id:p_row.data.p_id};
        }
        if (rs.length<1){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请选择您要锁定的座位。' );
            return;
        };
        Ext.Msg.confirm('友情提示','您确定要锁定这些位置吗？['+ rs.join(',')+']',function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            if(TYPE_G == 'mul_add'){
                Ext.each(rs,function(v){
                    arr = {
                        seats: v ,
                        num: num,
                        bl_product_id: p_left_row.data.p_id,
                        type:'lock',
                    }
                    if(is_in_array(arr,OPERATION_SEAT) == -1){
                        OPERATION_SEAT.push(arr);
                    }
                });
                Ext.Msg.alert('友情提示', '锁定成功' );
                myMask.hide();
                b.setDisabled(false);
                do_operation_data(p_left_row.data.p_id);
                var operation_data = new Array();
                if(OPERATION_SEAT.length != 0){
                    Ext.each(OPERATION_SEAT,function(v){
                        if(num == v.num){
                            operation_data.push(v);
                        }
                    })
                }
                SUNLINE.baseParams(mbi_seat_store,{type:'mul_add',seat:seat,operation:JSON.stringify(operation_data),bus_num:num,bl_product_id:p_left_row.data.p_id})
                mbi_seat_store.load();
                return false;
            }
            Ext.Ajax.request({
                url: $__app__ + '/BusList/lock_seat',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        mbi_seat_store.load();
                    };
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '锁定座位操作失败！');
                    b.setDisabled(false);
                }
            });
        });
    };

    /**
     * 获取选中座位的座位号
     * @param records
     * @param filter
     * @return {Array}
     */
    function get_selected_seat(records, filter){
        if (!filter) filter = 'empty'; // 默认选择空座
        var seats = [];
        for (var i=0; i<records.length; i++){
            if (records[i].data.status == filter)
                seats.push( records[i].data.num );
        }
        return seats;
    };



    /**
     * 添加车辆
     * @param b
     */
    function add_bus(b){
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(_grid);
        var seats = list_row.data.bl_seats;
        Ext.Msg.prompt('友情提示', '请填写您想新增的车辆数：', function(btn, num){
            if (btn!='ok'){
                b.setDisabled(false);
                return;
            };
            if ( isNaN( num ) ){
                b.setDisabled(false);
                Ext.Msg.alert('友情提示','请填写正确的车辆数。');
                return;
            }
            bus_rcd = bus_view.getSelectionModel().getSelection();
            if(bus_rcd.length>0){
                seats = bus_rcd[0].get('seats');
            }else{
                Ext.Msg.alert('友情提示','请选择车辆信息用于生成新车辆');
                bus_view.select(0);
                b.setDisabled(false);
                return;
            }
            var params = {bl_id:list_row.data.bl_id, add_num:num, seats:seats,bl_product_id:p_row.data.p_id};
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__ + '/BusList/add_bus',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        mbi_bus_store.reload();
                    };
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '锁定座位操作失败！');
                    b.setDisabled(false);
                }
            });
        }, this, false, 1);
    };

    /**
     * 移除车辆
     * @param b
     */
    function remove_bus(b){
        b.setDisabled(true);
        var row=SUNLINE.getSelected(bus_view);
        var p_row=SUNLINE.getSelected(_grid);
        if(!row){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示', '请先选择一辆要移除的车辆。');
            return;
        }
        var num=row.data.num;
        if (row.data.sale!=0){
            b.setDisabled(false);
            Ext.Msg.alert('友情提示', '您选择的车辆已经有销售数据，不能移除。');
            return;
        }
        var list_row = getListRow();
        var params = { bl_id:list_row.data.bl_id, num:num,bl_product_id:p_row.data.p_id};
        Ext.Msg.confirm('友情提示', '您真的要移除'+num+'号车吗？', function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : $__app__ + '/BusList/remove_bus',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        mbi_bus_store.load();
                    };
                    Ext.Msg.alert('友情提示', msg );
                    myMask.hide();
                    b.setDisabled(false);
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '车辆移除操作失败！');
                    b.setDisabled(false);
                }
            });
        });
    };
    /*修改车座信息(end)*/

    function do_clear(b){
        var row=SUNLINE.getSelected(_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择您要清除自定义票价的班期。');
            return;
        };
        Ext.Msg.confirm('友情提示', '您真的要清除选定班期的自定义票价吗？ 清除后遵循票价定义中的价格。', function(btn){
            if (btn != 'yes'){ return false; };
            var myMask=SUNLINE.LoadMask('数据清理中，请稍候...');
            myMask.show();
            var s = {
                bl_id : row.get('bl_id')
            };
            Ext.Ajax.request({
                url : $__app__ + '/BusListNew/clear_ticket_detail',
                method:'POST',
                params:s,
                success : function(response, opts){
                    var rst = Ext.decode(response.responseText);
                    var msg = rst.info;
                    Ext.Msg.alert('友情提示',msg);
                    myMask.hide();
                    busList_store.load();
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '未知错误！');
                }
            });
        });
    };
    /**
     * 判断数组是否在另一个数组中
     */
    function is_in_array(s,b){
        for(var i= 0;i < b.length;i++){
            if(JSON.stringify(s) == JSON.stringify(b[i])){
                return i;
            }
        }
        return -1;
    }

    /**
     * 处理OPERATION_DATA数据
     */
    function do_operation_data(product_id){
        var lock_num = 0;
        var reserve_num = 0;
        Ext.each(OPERATION_SEAT,function(v){
            if(v.type=='lock' && v.bl_product_id == product_id){
                lock_num ++;
            }else if(v.type == 'reserve' && v.bl_product_id == product_id){
                reserve_num ++;
            }
        })
        var html = '<span style="margin-left: 10px;margin-top: 5px; float: left; ">已预留座位 <span style="color:red">'+reserve_num+'</span> ,锁定座位 <span style="color:red">'+lock_num+'</span></span>';
        Ext.getCmp('show_text').setHtml(html);
    }

    /**
     * 通过productid删除操作数据
     */
    function remove_operation_data_by_productid(){
        var row=SUNLINE.getSelected(_p_grid);
        var index = new Array();
        var i = 0;
        Ext.each(OPERATION_SEAT,function(v){
            if(v.bl_product_id == row.data.p_id){
                index[i]= OPERATION_SEAT.indexOf(v);
                i++;
            }
        });
        index.sort(function(a,b){return b-a});
        Ext.each(index,function(v){
            OPERATION_SEAT.splice(v,1);
        })
    }

    /**
     * 修改车辆数或者车座数时，清楚数据
     */
    function mul_change(new_data,change_type){
        var old = OLD_DATA;
        if(new_data >= old || OPERATION_SEAT.length==0){
            return false;
        }
        Ext.Msg.confirm('友情提示', '您真的要修改车量或者车座数么？ 修改后会更新预留锁定车座信息。', function(btn){
            if (btn != 'yes'){
                if(change_type == 'num'){
                    Ext.getCmp('bl_count_m').setValue(OLD_DATA);
                }else{
                    Ext.getCmp('bl_seats_m').setValue(OLD_DATA);
                }
                return false;
            };
            var myMask=SUNLINE.LoadMask('数据清理中，请稍候...');
            myMask.show();
            var row=SUNLINE.getSelected(_p_grid);
            var index = new Array();
            var i = 0;
            Ext.each(OPERATION_SEAT,function(v){
                if(v.bl_product_id == row.data.p_id && ((change_type=='num' && v.num > new_data) || (change_type=='seat' && v.seats > new_data))){
                    index[i]= OPERATION_SEAT.indexOf(v);
                    i++;
                }
            });
            index.sort(function(a,b){return b-a});
            Ext.each(index,function(v){
                OPERATION_SEAT.splice(v,1);
            })
            do_operation_data(row.data.p_id);
            myMask.hide();
        });
    }
    /**
     * 导出excel
     */
    function doExcel(){
        var url = '';
        url += 'bl_start_date=' + Ext.Date.format(Ext.getCmp('seach_start_date').getValue(),'Y-m-d');
        url += '&bl_stop_date=' + Ext.Date.format(Ext.getCmp('seach_stop_date').getValue(),'Y-m-d');
        var bl_product_id=p_select_id();
        if(bl_product_id){
            url += '&bl_product_id=' + bl_product_id;
        }
        if(Org_id){
            url += '&bl_org_id=' + Org_id;
        }

        url += '&source=buslistnew';

        window.location = $__app__+'/BusList/selectShopExcel?'+url;
    }

    function name_fn(v,i,r){
        var enid = r.get('p_enid');
        var url = $__app__+"/detail.html?p_id="+enid;
        return '<a href = "'+url+'" target = "_blank" title='+ v +'>'+ v +'</a> ';
    }
    /**
     * 记录之前的值
     */
    function mul_focus(d){
        OLD_DATA = 0;
        if(d) OLD_DATA = d;
    }
    ziyo_log({ listeners : [{grid: _grid, table:'BusList', pk_id:'bl_id'}] });
    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [product_select,busList_panel]
    });
});