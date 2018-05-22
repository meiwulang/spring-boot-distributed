/**
 * User: asun
 * Date: 13-1-11
 * Time: 下午2:03
 */
BUSLIST={};
WG={};
var ticket_is_changed=false;
var _row;
var bl_status;
Ext.onReady(function(){
    var p_url=$__app__+'/Products/dataJson';
    var p_field=[];
    var p_store=SUNLINE.GroupingStore(p_url,p_field,{sortInfo:{field:'p_id',direction: "DESC"}, groupField:'p_type' },true);
    var p_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: '产品类型: {name} (共 {[values.rows.length]} 条)',
        startCollapsed:false
    })

    var url=$__app__+'/BusList/dataJson';
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

    //添加窗口的票价数据源
    var ticket_field=[];
    var t_store = SUNLINE.JsonStore($__app__ + '/BusList/get_data_ticket',ticket_field,false);

    //批量添加窗口的数据源
    var ticket_multi_field=[];
    var t_multi_store = SUNLINE.JsonStore($__app__ + '/BusList/get_data_ticket',ticket_multi_field,false);

    //修改窗口的数据源
    var ticket_edit_field=[];
    var t_edit_store = SUNLINE.JsonStore($__app__ + '/BusList/get_data_ticket_fen',ticket_edit_field,false);

/*************************** 渲染函数 start *************************************/
    function get_week_by_date(nv, week){
        var weekly = ['日','一','二','三','四','五','六']
        var w = Ext.util.Format.date(nv, 'w');
        var date = Ext.util.Format.date(nv, 'Y-m-d');
        if (week) return w;
        return date + ' 星期' + weekly[w];
    };

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

    var t_room_data = [[1,'房源充足，可自由选择'],[2,'不能选房，只能拼房'],[3,'必须补房差']];
    function t_room(v){
        for (var i=0; i<t_room_data.length; i++){
            if (v==t_room_data[i][0]) return t_room_data[i][1];
        };
        return '***';
    };
/*
    function salesStatus(v, m, r){
        var sg = r.get('t_single') , t1=t2=['#ccc','非'];
        if (sg=='1') t1 = ['green',''];
        if (v=='有效') t2 = ['blue',''];
        var tmp='<span style="color:'+t2[0]+';" qtip="'+t2[1]+'有效票价">效</span>';
        tmp += '<span style="color:'+t1[0]+';" qtip="'+t1[1]+'独立销售">独</span>';
        if (isPackageTicket(r.get('t_detail'))) tmp += '<span style="color: #999;" qtip="套票">套</span>';
        return tmp;
    };*/

    function surplusSeats(v,m,r){
        var carSeatCount = r.get('bl_seat_count');    //座位总数
        var saledSeatCount = r.get('bl_saled');    //已售座位
        return carSeatCount - saledSeatCount;
    };

    function bl_status(v,t,s){
        var dict = {
            '正常':'color:#444', //3889FF
            '暂停':'color:#009DDA',
            '取消':'color:#009DDA',
            '锁定':'color:#009DDA',
            'del':'color:#ccc;text-decoration:line-through;'
        };
        if(company_type=='zhu'){
            return '<span style="'+ dict[v] +'">' + v + '</span>';
        }else{
            if(v=='暂停'){
                return '<span style="'+ dict[v] +'">' + v + '</span>';
            }else{
                var stop_org_id=s.get('bl_stop_org');
                if(stop_org_id!=''){
                    var arr=stop_org_id.split(',');
                    if(in_array(company_id,arr)!=-1){
                        return '<span style="color:#009DDA">暂停</span>';
                    }else{
                        return '<span style="color:#444">正常</span>';
                    }
                }else{
                    return '<span style="color:#444">正常</span>';
                }
            }
        }
    };
    function print_num(v){
        return v !=0 ? '是':'否';
    };

    function bus_number(v, m, r){
        return v + ' × ' + r.get('bl_seats');
    };

    function is_price(v, m, r){
        if (r.get('bl_ticket_detail')=='1')
            v = '<span style="color:blue" qtip="当天调整过票价，将不受票价定义里设置的影响">'+ v +'</span>';
        return v;
    };

    function is_cluster(v){
        if(v==0) return "未设置";
        return v;
    }

    function today(){
        var time=new Date();
        return Ext.util.Format.date(time,'Y-m-d');
    }

    function bl_num(v){ return v; };

/*************************** 渲染函数 end *************************************/

    var Dict_cmb_m = SUNLINE.DictComBox({id:'bl_brand_m',name:'bl_brand',fieldLabel:'车型品牌',labelWidth:80,labelAlign:"right"},{'d_type':'车辆品牌'});
    var Dict_cmb = SUNLINE.DictComBox({id:'bl_brand',name:'bl_brand',fieldLabel:'车型品牌',labelWidth:80,labelAlign:"right"},{'d_type':'车辆品牌'});
    var Dict_cmb_e = SUNLINE.DictComBox({id:'bl_brand_e',name:'bl_brand',disabled:true,fieldLabel:'车型品牌',labelWidth:80,labelAlign:"right"},{'d_type':'车辆品牌'});

/*************************** 子公司编辑部分 start ******************************/


    //成本项目
    var edit_url = $__app__ + '/Test/xi';   //xi是不存在的
    var edit_field = [{name:"ri_id"} ];
    var edit_store = new SUNLINE.JsonStore(edit_url, edit_field,false);
    var edit_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:edit_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有明细信息',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"成本名称", dataIndex:"ci_name", width:250},
            {header:"成本价格", dataIndex:"ci_trade_price", width:250,editor:new Ext.form.NumberField({id:'price_id'})}
        ]
    });

    var edit_win=new Ext.Window({
        title:'成本项目',
        width:550,
        height:Ext.getBody().getHeight()-50,
        maxHeight:325,
        layout:'fit',
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[edit_grid],
        buttons:[
            {text:'确定',handler:edit_ticket},
            {text:'关闭', handler:function (){
                edit_win.hide();
            }}
        ]
    });

    var buslist_edit_grid = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: t_edit_store,//数据源
        viewConfig:{
            emptyText:'没有票价信息',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"<span style='color:#6b47bd'>状态</span>",dataIndex:"t_id",width:55,align:'center',renderer:check_status},
            {header:"票价ID",dataIndex:"t_id",width:100,hidden:true},
            {header:"票价名称",dataIndex:"t_standards_name",width:150},
            {header:"票价类型",dataIndex:"t_preset_type",width:150},
            {header:"<span style='color:#009DD9'>同行价</span>",dataIndex:"t_trade_price",width:150,editor:new Ext.form.NumberField({id:'t_trade_price'})},
            {header:"门市价",dataIndex:"t_price",width:200},
            {header:"<span style='color:#009DD9'>返利</span>",dataIndex:"t_money",width:150,editor:new Ext.form.NumberField({id:'t_money'})},
            {header:"房差",dataIndex:"t_spread_price",width:150},
            {header:"代理价",dataIndex:"t_agency_price",width:100,align:'right',sortable:true,renderer:money},
            {header:"周几有效",dataIndex:"t_weekly",width:120,renderer:SUNLINE.weekRenderer},
            {header:"库存量",dataIndex:"t_store",width:80,tooltip:'-1为不限制',renderer:t_store,editor:new Ext.form.NumberField()},
            {header:"拼房选项",dataIndex:"t_room",width:150/*,renderer:t_room,
                editor:new Ext.form.ComboBox({
                    triggerAction:"all",
                    store:new Ext.data.SimpleStore({
                        fields:['combo_t_room_v','combo_t_room'],
                        data:t_room_data
                    }),
                    displayField:"combo_t_room",
                    valueField:"combo_t_room_v",
                    mode:"local",forceSelection:true,typeAhead:true,value:"0", editable:false
                })*/
            },
            {header:"预置类型",dataIndex:"t_preset_type",width:100},
            {header:"限制类型",dataIndex:"t_limit_type",width:80},
            {header:"限制条件",dataIndex:"t_limit_condition",width:80}
        ],
        defaults:{sortable: true},//表格列定义
        tbar: [
            {text:'修改票价',id:'edit_btn',iconCls:'button-edit',handler:function(){
                var t_row=SUNLINE.getSelected(buslist_edit_grid);
                if(!t_row){
                    Ext.Msg.alert('友情提示', '请选择要操作的票价信息。');
                    return;
                }
                edit_win.show()}},
            {text:'启用',iconCls:'fa fa-play',id:'start_act',handler:edit_status},
            {text:'停用',iconCls:'fa fa-pause',id:'stop_act',handler:edit_status},
            {text:'刷新',iconCls:'button-ref',handler:function(){t_edit_store.reload()}},
            '-',
            '<span style="color:#666">双击表头<span style=\'color:#009DD9\'>蓝色</span>的列可以直接修改，修改的信息只作用于当前班期。</span>'
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:t_edit_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });


    buslist_edit_grid.on('select',function(i,v){
        var arr= window._row.split(',');
        if(in_array(v['data']['t_id'],arr)!=-1){
            Ext.getCmp('stop_act').setDisabled(true);
            Ext.getCmp('start_act').setDisabled(false);
        }else{
            Ext.getCmp('stop_act').setDisabled(false);
            Ext.getCmp('start_act').setDisabled(true);
        }
    })
/*========================================================================================================================*/


    function check_status(v){
        var arr= window._row.split(',');
        if(in_array(v,arr)!=-1){
            return '<span style="color:red">停用</span>';
        }else{
            return '<span style="color:blue">正常</span>';
        }
    }

    //子公司修改票价状态
    function edit_status(b){
        var b_row=SUNLINE.getSelected(busList_grid);
        var row=SUNLINE.getSelected(buslist_edit_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择要操作的票价！');
            return;
        }
        var stop_id=row.data.t_id;
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__+'/BusList/change_status',
            params:{stop_id:stop_id,act:b.getText(),bl_id:b_row.data.bl_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', result.info.msg);
                if(result.status ==1){
                    var arr=window._row.split(',');
                    if(b.getText()=='停用'){
                        window._row=window._row+','+stop_id;
                    }else{
                        for(i=0;i<arr.length;i++){
                            if(arr[i]==stop_id){
                                arr.remove(arr[i]);
                            }
                        }
                        window._row=arr.join(',');
                    }
                    t_edit_store.load();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })
    }

    var busList_edit_form = new Ext.form.FormPanel({
        border : false,
        region : 'north',
        height: 200,
        split:{size:3},
        bodyStyle : "background:#fff;padding:5",
        cls:'tcol3',
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"bl_id_e", name:"bl_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden",disabled:true},
            {id:"bl_ticket_ids_e", name:"bl_ticket_ids", fieldLabel:"票价id",xtype:"hidden",disabled:true},
            {id:"bl_product_id_e", name:"bl_product_id", fieldLabel:"商品ID", maxLength:"10",xtype:"hidden",disabled:true},
            {id:"bl_product_type_e", name:"bl_product_type", fieldLabel:"商品类型", maxLength:"10",xtype:"hidden",disabled:true},
            {id:"bl_num_e",name:"bl_num", fieldLabel:"班期编号", allowBlank:false,vtypeText:'只能输入字母、数字和_。',vtype:'alphanum',disabled:true},
            SUNLINE.ExtDateField({id:'bl_start_date_e',name:'bl_start_date',minValue:today(),labelWidth:80,labelAlign:"right",disabled:true,fieldLabel:"开始时间",width:250,
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
            {id:'bl_week_show_e',name:"bl_week_show", fieldLabel:"星期几",disabled:true},
            {id:'bl_week_e',name:"bl_week", fieldLabel:"",xtype:'hidden',disabled:true},
            {id:"bl_name_e", name:"bl_name", fieldLabel:"班期名称",disabled:true},
            /*Dict_cmb_e.box,*/
            {id:'bl_count_e',name:"bl_count", fieldLabel:"车辆数", allowBlank:false,disabled:true},
            {id:'bl_start_time_e',name:"bl_start_time", fieldLabel:"出发时分",disabled:true,emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'},
            SUNLINE.stop_sale_time_tool({id:"bl_stop_time_e",name:"bl_stop_time",fieldLabel:'停售时间',allowBlank:false,width:250,labelWidth:80,labelAlign:"right",disabled:true}),
            {id:'bl_seats_e',name:"bl_seats", fieldLabel:"每车座位数", allowBlank:false,disabled:true},
            {id:'bl_fake_saled_e',name:"bl_fake_saled", fieldLabel:"虚拟已售数", allowBlank:false,disabled:true,value:0},
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
                value:"是",
                disabled:true
            },{
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
                        ['对号入座（系统随机）']
                    ]
                }),
                displayField:"combo_value",
                valueField:"combo_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"不对号入座",
                disabled:true
            }
        ]
    });

    var busList_win_edit=new Ext.Window({
        title : '班期编辑',
        layout: 'border',
        width : 800,
        height:Ext.getBody().getHeight()-50,
        maxHeight:550,
        closeAction: 'hide',
        resizable:false,
        modal:true,
        items:[busList_edit_form,buslist_edit_grid],
        buttons:[
            {text : '关闭', handler:function(){busList_win_edit.hide();}}
        ]
    });


    busList_win_edit.on('show',function(){
         var row=SUNLINE.getSelected(buslist_left);
         var b_row=SUNLINE.getSelected(busList_grid);
        var child_org_id=-1;
        if(company_type=='zhu'){
            child_org_id = companyCombox.getValue();
        }
         SUNLINE.baseParams(t_edit_store,{p_id:row.data.p_id,t_data:b_row.data.bl_start_date,bl_id:b_row.data.bl_id,child_org_id:child_org_id},true);
         t_edit_store.load();

    })

/*************************** 子公司编辑部分 end *********************************/



/*************************** 总公司添加/编辑班期 start *********************************/


    var buslist_win_grid = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: t_store,//数据源
        viewConfig:{
            emptyText:'没有票价信息',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"票价ID",dataIndex:"ta_id",width:100,hidden:true},
            {header:"票价名称",dataIndex:"ta_name",width:340},
            {header:"票价类型",dataIndex:"ta_type",width:340},
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        defaults:{sortable: true},//表格列定义
        tbar: [
            {text:'刷新',iconCls:'button-ref',handler:function(){t_store.reload()}},
            '-',
            '<span style="color:#666">双击表头<span style=\'color:#009DD9\'>蓝色</span>的列可以直接修改，修改的信息只作用于当前班期。</span>',
            '->',
            '<span style="color:red">注：请选择本班期可用的票价！</span>'
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:t_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    var busList_win_form = new Ext.form.FormPanel({
        border : false,
        region : 'north',
        height: 200,
        split:{size:3},
        bodyStyle : "background:#fff;padding:5",
        cls:'tcol3',
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"bl_id", name:"bl_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"bl_ticket_ids", name:"bl_ticket_ids", fieldLabel:"票价id",xtype:"hidden"},
            {id:"bl_product_id", name:"bl_product_id", fieldLabel:"商品ID", maxLength:"10",xtype:"hidden"},
            {id:"bl_product_type", name:"bl_product_type", fieldLabel:"商品类型", maxLength:"10",xtype:"hidden"},
            {id:"bl_num",name:"bl_num", fieldLabel:"班期编号", allowBlank:false,vtype:'alphanum',vtypeText:'只能输入字母、数字和_。'},
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
            {id:"bl_name", name:"bl_name", fieldLabel:"班期名称", allowBlank:false},
            Dict_cmb.box,
            {id:'bl_count',name:"bl_count", fieldLabel:"车辆数", allowBlank:false},
            {id:'bl_start_time',name:"bl_start_time", fieldLabel:"出发时分",emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'
           },
            SUNLINE.stop_sale_time_tool({id:"bl_stop_time",name:"bl_stop_time",fieldLabel:'停售时间',allowBlank:false,width:250,labelWidth:80,labelAlign:"right"}),
            {id:'bl_seats',name:"bl_seats", fieldLabel:"每车座位数", allowBlank:false},
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
            },{
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
            }
        ]
    });

  var busList_win=new Ext.Window({
        title : '班期添加',
        layout: 'border',
        width : 800,
        height:Ext.getBody().getHeight()-50,
        maxHeight:600,
        closeAction : 'hide',
        resizable:false,
        style : 'border-top-width:1px;',
        modal:true,
        items:[busList_win_form,buslist_win_grid],
        buttons: [
            {text : '保存', handler:doSubmit},
            {text : '关闭', handler:function(){busList_win.hide();}}
        ]
    });

    busList_win.on('show',function(){
        var row=SUNLINE.getSelected(buslist_left);
            SUNLINE.baseParams(t_store,{'p_id':row.data.p_id},true);
           /* var b_row=SUNLINE.getSelected(busList_grid);
            SUNLINE.baseParams(t_store,{'t_product_id':row.data.p_id,'t_data':b_row.data.bl_start_date},true);
          */
        Ext.getCmp('bl_num').setValue(row.data.p_num);
        t_store.load();
    })

    busList_win.on('hide',function(){
        busList_win_form.form.reset();
    })

/************************ 总公司添加/编辑 end ************************************/

/************************ 总公司批量添加 start ************************************/
    var busList_multi_form=new Ext.form.FormPanel({
        border:false,
        region:'west',
        width : 300,
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"bl_dates", name:"bl_dates", xtype:"hidden"},
            {id:"bl_ticket_ids_m", name:"bl_ticket_ids", fieldLabel:"票价id",xtype:"hidden"},
            /*{id:"bl_id_m",name:"bl_id",fieldLabel:"ID",maxLength:"11",xtype:'hidden'},*/
            {id:"bl_product_id_m",name:"bl_product_id",fieldLabel:"产品id",xtype:'hidden'},
            {id:"bl_product_type_m",name:"bl_product_type",fieldLabel:"产品类型",xtype:'hidden'},
            {id:"bl_org_id_m",name:"bl_org_id",fieldLabel:"单位ID",xtype:'hidden'},
            {id:"bl_ticket_ids_m",name:"bl_ticket_ids",fieldLabel:"票种",xtype:'hidden'},
            {id:"bl_num_m",name:"bl_num",fieldLabel:'班期编号',maxLength:20,vtype:'alphanum',vtypeText:'只能输入字母、数字和_。', allowBlank:false,listeners:{'blur':function(t){
                var product_data=SUNLINE.getSelected(buslist_left);
                create_calendar( product_data.data.p_id, t.getValue());
            }
            }},
            {id:"bl_name_m",name:"bl_name",fieldLabel:"班期名称",allowBlank:false},
            Dict_cmb_m.box,
            {id:"bl_start_time_m",name:"bl_start_time",fieldLabel:'出发时分',maxLength:"5", emptyText:'如12:35',regex : /^(([0-1]?[0-9])|(2[0-3]))(:|：)(([0-5][0-9]))$/, regexText : '请输入正确的时间格式：6:00'},
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
            {id:"bl_count_m",name:"bl_count",fieldLabel:'车量数',maxLength:"11",xtype:"numberfield", allowBlank:false},
            {id:"bl_seats_m",name:"bl_seats",fieldLabel:'车座数',maxLength:"11",xtype:"numberfield", allowBlank:false},
            {id:"bl_fake_saled_m",name:"bl_fake_saled",fieldLabel:"虚拟已售数",maxLength:"11",xtype:"numberfield",value:0},
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
            SUNLINE.stop_sale_time_tool({id:"bl_stop_time_m",name:"bl_stop_time",fieldLabel:'停售时间',allowBlank:false,width:250,labelWidth:80,labelAlign:"right"})
        ]
    });

    var calendar = new Ext.Panel({
        region : 'center',
        border : false,
        bodyStyle:"background:#fff;padding:5",
        html : '<div class="multi_calendar" id="sun_calendar">' +
            '<div class="toolbar">' +
            '<span class="prev"><<上个月</span>' +
            '<span class="next">下个月>></span>' +
            '<div class="title"></div>' +
            '</div>' +
            '<div class="calendar_body">' +
            '<div class="c_li"></div>' +
            '<div class="clear"></div>' +
            '</div>'+
            '<div><span style="color: red;">注：日历支持点选、拖选等操作，按住ctrl键还可以多选。</span></div>'
    });

    var north_panel = new Ext.Panel({
        region : 'north',
        border : false,
        layout : 'border',
        height : 350,
        items : [ busList_multi_form, calendar ]
    });

    var ticket_grid = new Ext.grid.Panel({
        region : 'center',
        border:false,//无边框
        style:'border-top:2px solid #009DDA',
        viewConfig:{
            emptyText:'没有票价信息',
            deferEmptyText:true
        },
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: t_multi_store,//数据源
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"票价ID",dataIndex:"ta_id",width:100,hidden:true,align:'right'},
            {header:"票价名称",dataIndex:"ta_name",width:340},
            {header:"票价类型",dataIndex:"ta_type",width:340},
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        defaults:{sortable: true},//表格列定义
        tbar: [
            {text:'刷新',iconCls:'button-ref',handler:function(){t_multi_store.reload()}},
            '-',
            '<span style="color:#666">双击表头<span style=\'color:#009DD9\'>蓝色</span>的列可以直接修改，修改的信息只作用于当前班期。</span>',
            '->',
            '<span style="color:red">注：请选择本班期可用的票价！</span>'
        ]
    });

    var busList_win_multi=new Ext.Window({
        title : '批量添加',
        layout: 'border',
        width : 700,
        height:Ext.getBody().getHeight()-50,
        maxHeight:600,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[north_panel,ticket_grid],
        buttons: [
           {text : '保存', handler:do_submit_multi},
           {text : '关闭', handler:function(){busList_win_multi.hide();}}
        ]
    });


    busList_win_multi.on('show',function(){
        var row=SUNLINE.getSelected(buslist_left);
        SUNLINE.baseParams(t_multi_store,{p_id:row.data.p_id},true);
        t_multi_store.load();
        busList_multi_form.form.setValues('');
        Ext.getCmp('bl_num_m').setValue(row.data.p_num);
        create_calendar(row.data.p_id,row.data.p_num);
        var hd_checker = ticket_grid.getEl().select('div.x-grid3-hd-checker');
        var hd = hd_checker.first();
    });

    busList_win_multi.on('hide',function(){
        busList_multi_form.form.reset();
    })

/************************ 总公司批量添加 end *******************************/



/**************************** 班期表格 start ******************************/

    var busList_grid = Ext.create('Ext.grid.Panel',{
        region : 'center',
        border:false,//无边框
        features:[groupfeatures],
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        viewConfig:{
            emptyText:'没有服务信息',
            deferEmptyText:true
        },
        store: store,//数据源
        style:'border-top:1px solid #009DDA;',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:[
             new Ext.grid.RowNumberer({width:30}),
            {header:"ID",dataIndex:"bl_id",width:80,hidden:true},
            {header:"stopID",dataIndex:"bl_stop_org",width:80,hidden:true},
            {header:"状态",dataIndex:"bl_status",width:80,renderer:bl_status},
            {header:"班期编号",dataIndex:"bl_num",width:120,renderer:is_price, groupRenderer:bl_num},
            {header:"班期名称",dataIndex:"bl_name",width:150},
            {header:"出发日期",dataIndex:"bl_start_date",width:120,renderer:strDate,menuDisabled:false},
            {header:"出发时分",dataIndex:"bl_start_time",width:60, menuDisabled:false, hidden: true},
            {header:"停售时间",dataIndex:"bl_last_time",width:120,renderer:to_str},
            {header:"车辆数",dataIndex:"bl_count",width:80,renderer:bus_number,align:'center'},
            {header:"总座位",dataIndex:"bl_seat_count",width:80,align:'center'},
            {header:"已售",dataIndex:"bl_saled",width:80,align:'center'},
            {header:"<span style='color:#009DD9'>成团人数</span>",dataIndex:"bl_cluster",width:100,align:'center',editor:new Ext.form.NumberField({selectOnFocus:true}),renderer:is_cluster},
            {header:"<span style='color:#009DD9'>虚占</span>",dataIndex:"bl_fake_saled",width:80,
                editor: new Ext.form.NumberField({ allowBlank: false}),
                tooltip:'<b>虚拟占座数量</b><br><font color=\'red\'>当已售数量小于虚拟占座数量时，人工选座不起作用</font>' +
                    '<br>单击本列单元格可直接编辑',
                align:'center'
            },
            {header:"预留",dataIndex:"bl_reserved",width:80,align:'center'},
            {header:"锁定",dataIndex:"bl_lock",width:80,align:'center'},
            {header:"星期",dataIndex:"bl_week",width:150,renderer:SUNLINE.weekRenderer, menuDisabled:false,
                groupRenderer:function(v, u, r, ri, ci, ds){
                    var w = ['日','一','二','三','四','五','六'];
                    return w[v];
                }},
            {header:"<span style='color:#009DD9'>排序</span>",tooltip:'单击本列单元格可直接编辑',dataIndex:"bl_rank",width:80,editor:{ allowBlank: false }},
            {header:"车型",dataIndex:"bl_brand",width:80,editor:new Ext.form.TextField({})},
            {header:"余座",dataIndex:"bl_surplus_seats",width:80,renderer:surplusSeats},
            {header:"打印班期号",dataIndex:"bl_print_num",width:100},
            {header:"对号入座",dataIndex:"bl_right_seat",width:150},
            {header:"暂停票ID",dataIndex:"bl_t_stop_id",width:150,hidden:true}
        ],
        tbar: [
            '查询日期：',
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'seach_stop_date',start:true}),
           '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:120,gang:'seach_start_date'}),
            '-',
            {text:'查询',iconCls:'searchico',act:'select',handler:startReloadStore},
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
            }},
            {text:'清除自定义票价', id:'clear_ticket',handler:do_clear,disabled:isDisabled('BusList::clear')}
        ],

        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    var companyCombox = SUNLINE.ComBoxPlus({
        id:'company',
        fields:['org_id','org_name'],
        url:$__app__+'/UserArea/getCompany',
        hidden:company_type!='zhu',
        config:{
            displayField:'org_name',
            valueField:'org_id',
            emptyText:'请选择分公司',
            width:300
        }
    });

    if(_uinfo){
        if(_uinfo.org_type == '管理公司' && _uinfo.org_pid != 0){
            companyCombox.setDisabled(true);
            companyCombox.setValue(_uinfo.org_name);
        }
    }

//输出tbar
    function make_tbar(){
            var parent_arr=[{text:'添加',act:'add',iconCls:'button-add',handler:modify,disabled:isDisabled('BusList::add')},

                {text:'批量添加',act:'add_multi',iconCls:'button-add', handler:modify,disabled:isDisabled('BusList::add_all')},

                {text:'编辑',act:'edit',iconCls:'button-edit',handler:modify,disabled:isDisabled('BusList::edit')},

                {text:'删除',iconCls:'button-del',handler:busList_del,disabled:isDisabled('BusList::del')},

                {text:'暂停', id:'busList_p',act:'zt',handler:busListSet,disabled:isDisabled('BusList::stop'),
                    tooltip:'<b>班期暂停</b><br>班期暂停后无法销售，退票受退票时间的限制。'},

                {text:'恢复售票', id:'busList_r',act:'hf',handler:busListSet,disabled:isDisabled('BusList::recover')},

                {text:'修改车座信息', id:'busList_ch', handler:modify_bus_info,disabled:isDisabled('BusList::change_seat')},
                {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
                '->',
                {text:'编辑子公司票价', id:'child_edit', handler:for_child_modify,disabled:isDisabled('BusList::edit_child')},
                {text:'暂停子公司班期', id:'child_p', act:'zt',handler:change_child_status,disabled:isDisabled('BusList::stop_child')},
                {text:'恢复子公司班期', id:'child_r', act:'hf',handler:change_child_status,disabled:isDisabled('BusList::recover_child')},
                companyCombox
            ];
        
        var childen_arr=[
            {text:'编辑',act:'edit',iconCls:'button-edit',handler:modify,disabled:isDisabled('BusList::edit')},
            {text:'暂停', id:'busList_p',act:'zt',handler:busListSet,disabled:isDisabled('BusList::stop'),
                tooltip:'<b>班期暂停</b><br>班期暂停后无法销售，退票受退票时间的限制。'},
            {text:'恢复售票', id:'busList_r',act:'hf',handler:busListSet,disabled:isDisabled('BusList::recover')},
            {text:'修改车座信息', id:'busList_ch', handler:modify_bus_info,disabled:isDisabled('BusList::change_seat')},
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}
        ];

        if(company_type=='zhu'){
            return parent_arr;
        }else{
            return childen_arr;
        }
    }

    var busList_panel= new Ext.Panel({
        id : 'busList_panel',
        region : 'north',
        border : false,
        style : 'border-left-width:1px;',
        tbar : make_tbar()
    });


    busList_grid.on('validateedit',function(i,g){
        if ( g.value == g.originalValue ) return false;
        var row=SUNLINE.getSelected(busList_grid);
        if(g.field=='bl_fake_saled'){
            var bl_seat_count=row.data.bl_seat_count;
            if(bl_seat_count<g.value){
                Ext.Msg.alert('友情提示','虚占数不能大于座位总数！');
                g.cancel = true;
                return false;
            }
        }
        Ext.Ajax.request({
            url:$__app__+'/BusList/hand_change',
            params:{bl_id:row.data.bl_id,change_name: g.field,change_value:g.value},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.status!=1){
                    g.cancel = true;
                }
            },
            failure:function (response, otps) {

            }
        })
    })

    busList_grid.on('select',function(){
        var clear_ticket = Ext.getCmp('clear_ticket');
        var row=SUNLINE.getSelected(busList_grid);
        window._row = row.data.bl_t_stop_id;
        row=row.data;
        var data;
        var bl_stop_org=row.bl_stop_org.split(',');
        if(company_type!='zhu'){
            if(row.bl_status!='暂停'){
                if(in_array(company_id,bl_stop_org)!=-1){
                    bl_status='暂停';
                    data='暂停';
                }else{
                    bl_status='正常';
                    data='正常';
                }
            }else{
                bl_status='暂停';
                data='暂停';
            }
        }else{
            var child_org_id=companyCombox.getValue();;
            if(in_array(child_org_id,bl_stop_org)!=-1){
                Ext.getCmp('child_r').setDisabled(false);
                Ext.getCmp('child_p').setDisabled(true);
            }else{
                Ext.getCmp('child_r').setDisabled(true);
                Ext.getCmp('child_p').setDisabled(false);
            }
            bl_status=row.bl_status;
            data= row.bl_status;
        }
        if(data=='正常'){
            Ext.getCmp('busList_p').setDisabled(false);
            Ext.getCmp('busList_r').setDisabled(true);
        }else if(data=='暂停'){
            Ext.getCmp('busList_p').setDisabled(true);
            Ext.getCmp('busList_r').setDisabled(false);
        }
        if(row.bl_ticket_detail!=''){
            Ext.getCmp('clear_ticket').setDisabled(false);
        }else{
            Ext.getCmp('clear_ticket').setDisabled(true);
        }
    })

/************************** 班期表格 end ****************************/

/************************ 车辆窗口 start ***************************/
    var mbi_win, mbi_bus_panel, mbi_seat_panel, mbi_bus_store, mbi_seat_store, bus_view, seat_view, users_box, reserve_org;

    function modify_bus_info(b){
        var row=SUNLINE.getSelected(busList_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要调整的班期！');
            return false;
        };
        var sf_time = int2date(row.get('bl_start_date')) + ' ' + row.get('bl_start_time');
        var bl_num=row.data.bl_num;
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
            '<div class="seat_list"><tpl for=".">',
            '<div class="thumb-wrap {status} {cls}">',
            '<div class="thumb" qtip="{[ this.get_status(values) ]}">{num}</div>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div></div>',
            {
                get_status : function(v){
                    var s = {
                        sale : '已售',
                        lock : '锁定',
                        reserve : '预留',
                        plan : '计划单锁定',
                        empty  : '空座'
                    };
                    var org = time = '';
                    if (v.org) org = '<br>' + v.org;
                    if (v.time) time = '<br>预留到：'+v.time;
                    return '<b>'+s[v.status]+'</b>' + org + time;
                }
            }
        );
        if (!mbi_bus_store){
            mbi_bus_store = SUNLINE.JsonStore($__app__ + '/BusList/get_bus', ['num','seats','sale','max'], false);
            mbi_bus_store.on('load', function(s){
                if (s.getCount()>0){
                    s.each(function(r){
                        var list_row = getListRow();
                        r.set('sf_time', int2date(list_row.get('bl_start_date')) + ' ' + list_row.get('bl_start_time'));
                        r.set('bl_num', list_row.get('bl_num'));
                    });
                    bus_view.select(0);
                }
            });
        };
        SUNLINE.baseParams(mbi_bus_store,{bl_id:row.data.bl_id, start_date:row.data.bl_start_date})
        mbi_bus_store.load();
        if (!mbi_seat_store){
            mbi_seat_store = SUNLINE.JsonStore($__app__ + '/BusList/get_seat', ['num','status','cls','user','time'], false);
        };
        SUNLINE.baseParams(mbi_seat_store,{bl_id:row.data.bl_id, start_date:row.data.bl_start_date})
        mbi_seat_store.load();
        if(!bus_view){
            bus_view = new Ext.DataView({
                store: mbi_bus_store,
                tpl: bus_tpl,
                //autoHeight:true,
                singleSelect: true,
                style:{margin:'10px',height:'200px'},
                overClass:'x-view-over',
                itemSelector:'div.thumb-wrap',
                emptyText: '请选择您要查看的班期信息。',
                listeners:{
                    'selectionchange':function(dv, nodes){
                        try{
                            var row=nodes[0].data;
                            SUNLINE.baseParams(mbi_seat_store,{bus_num:row.num,seats:row.seats},true);
                            mbi_seat_store.load();
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
                autoHeight:true,
                multiSelect: true,
                simpleSelect:true,
                overClass:'x-view-over',
                itemSelector:'div.thumb-wrap',
                emptyText: '请选择您要查看的车号。',
                plugins: [ /*new Ext.view.MultiSelector*/]
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
                title:'座位信息',
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
                width:100,
                matchFieldWidth:false,
                columnWidth:300,
                labelAlign:'right'
            }
        });
        if(!mbi_win){
            if(company_type!='zhu'){
                var style_str='padding-top:10px';
            }else{
                var style_str='padding-top:3px';
            }
        mbi_win = new Ext.Window({
            layout : 'border',
            modal : true,
            closeAction : 'hide',
            width : 950,
            style :'background:#fff";border:1px solid #009DD9',
            bodyStyle:"background:#fff;border-top:2px solid #009DD9 !important",
            tbar : [{
                xtype: 'buttongroup',
                columns: 3,
                style:{border:'1px solid #009DD9'},
                bodyStyle :'padding-top:5px;',
                hidden:company_type!='zhu',
                header:{
                    title:'调整座位数',
                    style:'background:#3892d3;font-family:"Microsoft Yahei";color:#fff;border:1px solid #009DD9'
                },
                items: [{
                    xtype:'tbtext', text:'当前车号'
                },{
                    xtype:'numberfield', id:'car_num', width:100, readOnly:true
                },{
                    text: '修改',
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
                    xtype:'numberfield', id:'car_seats', width:100, selectOnFocus:true

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
                        cls: 'x-btn-as-arrow',
                        handler:reserve_seat
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
                        handler : release_seat
                    },{
                        xtype:'tbtext', text:'<span qtip="预留到发车前几小时">预留时效：</span>'
                    },{
                        xtype:'numberfield', id:'save_time',  width:100, value:24, selectOnFocus:true
                    }]
            },{
                xtype: 'buttongroup',
                columns: 3,
                style:{border:'1px solid #3892d3'},
                bodyStyle :style_str,
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
                    handler:lock_seat
                },{
                    text: '解锁',
                    act : 'lock',
                    scale: 'medium',
                    rowspan: 2, iconCls: 'button-lock',
                    iconAlign: 'top',
                    style:"background:none",
                    border:false,
                    cls: 'x-btn-as-arrow',
                    handler : release_seat
                },{
                    text:'新增车辆',
                    iconCls: 'button-add',
                    iconAlign: 'left',
                    scale: 'medium',
                    style:"background:none",
                    border:false,
                    hidden:company_type!='zhu',
                    handler:add_bus
                },{
                    text:'删除车辆',
                    iconCls: 'button-del',
                    iconAlign: 'left',
                    scale: 'medium',
                    style:"background:none",
                    border:false,
                    hidden:company_type!='zhu',
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
        mbi_win.setTitle('车辆信息管理：' + row.get('bl_num'));
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
        mbi_win.setTitle('车辆信息管理：' + row.get('bl_num'));
        mbi_win.setHeight(500);
}

/************************ 车辆窗口 end ****************************/

/************************ 左导航 start ***************************/
    var left_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID", dataIndex:"p_id", width:50, hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:100},
        {header:"产品主题", dataIndex:"p_name", width:200}
    ];

    var buslist_left = Ext.create('Ext.grid.Panel',{
        region:'west',
        width:300,
        split : {size:3},
        store:p_store,
        features:[p_groupfeatures],
        columns:left_cm,
        border :false,
        style : 'border-right:1px solid #009DDA;',
        tbar:[
            '快捷搜索：',
            {
                xtype:'textfield',
                triggerCls : 'x-form-search-trigger',
                id:'search',
                emptyText : '可搜索产品编号和主题',
                width:200,
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
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:p_store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: '没有数据'
        })
    })

    //快捷搜索
    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        SUNLINE.baseParams(p_store,{skey:skey})
        p_store.currentPage=1;
        p_store.load();
        store.removeAll();
    };

    buslist_left.on('select',function(i,v){
        SUNLINE.baseParams(store,{bl_product_id: v['data']['p_id']});
        store.currentPage=1;
        store.load();
    });

/************************* 左导航 end *****************************/


    var buslist_right = new Ext.Panel({
        border : false,
        layout : 'border',
        region : 'center',
        split : {size:3},
        style : 'border-top-width:1px;',
        items : [busList_panel,busList_grid]
    });


    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [buslist_left,buslist_right]
    });


/*************************** 操作函数区 start ***************************************/

    //添加，批量添加，编辑
    function modify( b){
       var row=SUNLINE.getSelected(buslist_left);
       if(!row){
           Ext.Msg.alert('友情提示','请选择一个产品！');
           return false;
       }
        if(b.act=='add_multi'){
            busList_win_multi.show();
            return;
        }else if(b.act=='edit'){
           var grid_row=SUNLINE.getSelected(busList_grid);
            if(!grid_row){
                Ext.Msg.alert('友情提示','请选择一个班期！');
                return false;
            }
            if(company_type!='zhu'){
                busList_win_edit.show();
                busList_win_edit.setTitle('编辑信息');
            }else{
                busList_win.show();
                Ext.getCmp('bl_start_date').setDisabled(true);
                Ext.getCmp('bl_count').setDisabled(true);
                Ext.getCmp('bl_seats').setDisabled(true);
                Ext.getCmp('bl_week_show').setDisabled(true);
                Ext.getCmp('bl_num').setDisabled(true);
                Ext.getCmp('bl_name').setDisabled(true);
                busList_win.setTitle('编辑班期信息');
            }
           var edit_data=Ext.apply({},grid_row.data);
               var date=to_date(edit_data.bl_start_date);
               edit_data.bl_start_date=date;
               edit_data.bl_week_show=get_week_by_date(date);
            if(company_type=='zhu'){
                busList_win_form.form.setValues(edit_data);
            }else{
                busList_edit_form.form.setValues(edit_data);
            }
         }else if (b.act=='add'){
            Ext.getCmp('bl_start_date').setDisabled(false);
            Ext.getCmp('bl_count').setDisabled(false);
            Ext.getCmp('bl_seats').setDisabled(false);
            Ext.getCmp('bl_week_show').setDisabled(false);
            Ext.getCmp('bl_num').setDisabled(false);
            busList_win.show();
            busList_win.setTitle('添加班期');
            var s_date = Ext.getCmp('bl_start_time').getValue();
            var s_time= get_week_by_date(s_date, true);
            Ext.getCmp('bl_week').setValue(s_time);
        }
    };

    function for_child_modify(b){
        var grid_row=SUNLINE.getSelected(busList_grid);
        if(!grid_row){
            Ext.Msg.alert('友情提示','请选择一个班期！');
            return false;
        }
        var child_org_id=companyCombox.getValue();
        if(!child_org_id){
            Ext.Msg.alert('友情提示','请选择一个子公司！');
            return false;
        }
        busList_win_edit.show();
        busList_win_edit.setTitle('编辑子公司信息');
        var edit_data=Ext.apply({},grid_row.data);
        var date=to_date(edit_data.bl_start_date);
        edit_data.bl_start_date=date;
        edit_data.bl_week_show=get_week_by_date(date);
        busList_edit_form.form.setValues(edit_data);
    }

    companyCombox.on('change',function(v,r,o){
        var row=SUNLINE.getSelected(busList_grid);
        var bl_stop_org=row.data.bl_stop_org.split(',');
        if(in_array(r,bl_stop_org)!=-1){
            Ext.getCmp('child_r').setDisabled(false);
            Ext.getCmp('child_p').setDisabled(true);
        }else{
            Ext.getCmp('child_r').setDisabled(true);
            Ext.getCmp('child_p').setDisabled(false);
        }
    })

    function change_child_status(b){
        var row=SUNLINE.getSelected(busList_grid);
        var child_org_id=companyCombox.getValue();
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要操作的班期！');
            return false;
        };
        if(!child_org_id){
            Ext.Msg.alert('友情提示','请选择您要操作的子公司！');
            return false;
        }
        var act_data={};
        var $cmsg='';
        var listData=row.data;
        act_data.child_org_id=child_org_id;
        act_data.bl_id=listData.bl_id;
        act_data.bl_product_id=listData.bl_product_id;
        if(b.act=='hf'){
            $cmsg = "您确认要恢复售票吗?";
        }else{
            $cmsg = "您确定要取暂停班期吗?";
        }
        Ext.Msg.confirm('友情提示', $cmsg, function (opt) {
            if(opt == 'yes'){
                updateStatus(b,act_data);
            };
        });
    }


    //删除
    function busList_del(){
        var p_row=SUNLINE.getSelected(buslist_left);
        var row=SUNLINE.getSelected(busList_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的班期！');
            return false;
        };
        Ext.Msg.confirm('友情提示', "是否确定删除选中的班期吗？" +
            "<div style='color:red'>删除的班期可能被班期计划重新生成，若想彻底停班，请使用“暂停”功能。</div>", function (opt) {
            if(opt == 'yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/BusList/delBusList',
                    method:'POST',
                    params:{bl_product_id:p_row.data.p_id,bl_id:row.data.bl_id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var msg = ret.info.msg;
                        if (ret.status==1){
                            store.reload();
                        };
                        Ext.Msg.alert('友情提示',msg);
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '未知错误！',function(){});
                    }
                });
            }
        });
    };



    //暂停zt，恢复售票hf
    function busListSet(b){
        var row=SUNLINE.getSelected(busList_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要操作的班期！');
            return false;
        };
        var act_data={};
        var listData=row.data;
        if(b.act=='hf'){ //恢复销售
            if(bl_status!='暂停'){
                Ext.Msg.alert('友情提示','该班期不适合本操作！');
                return false;
            };
            Ext.Msg.confirm('友情提示', '您确认要恢复售票吗？', function (opt) {
                if(opt == 'yes'){
                    act_data.bl_id=listData.bl_id;
                    act_data.bl_product_id=listData.bl_product_id;
                    updateStatus(b,act_data);
                };
            });
        }else{
            if(bl_status!='正常'){
                Ext.Msg.alert('友情提示','该班期不适合本操作！');
                return false;
            }else{
                var $cmsg = "您确定要取暂停班期吗?";
                act_data.bl_id=listData.bl_id;
                act_data.bl_product_id=listData.bl_product_id;
                if(b.act=='zt'){
                    Ext.Msg.confirm('友情提示', $cmsg, function (opt) {
                        if(opt == 'yes'){
                            updateStatus(b,act_data);
                        };
                    });
                };
            };
        };
    };


    //修改状态提交函数
    function updateStatus(b,listData){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        listData.actType= b.act;
        Ext.Ajax.request({
            url:$__app__ + '/BusList/setListStatus',
            method:'POST',
            params:listData,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg = ret.info;
                if(ret.status){
                  store.reload();
                };
                Ext.Msg.alert('友情提示',msg);
                myMask.hide();
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '未知错误！');
            }
        });
    };


    //总公司保存
    function doSubmit(){
        if(!busList_win_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var row=SUNLINE.getSelected(buslist_left);
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var data=busList_win_form.getForm().getValues();
        if(data.bl_count && data.bl_seats){
           if(data.bl_count<=0 || data.bl_seats<=0){
               Ext.Msg.alert('友情提示', '请填写车辆数和每车座位数！');
               return;
           }
        }
        var records=buslist_win_grid.getSelectionModel().getSelection();
        var ids=[];
        for(i=0;i<records.length;i++){
            ids[i]=records[i].data.ta_id;
        }
        var str_ticket = ids.join(',');
        data.bl_ticket_ids = str_ticket;
        data.bl_start_time = data.bl_start_time.replace('：',':');
        if(data.bl_seats<0){
            Ext.Msg.alert('友情提示', '请输入正确的虚拟已售数。');
            return;
        }
        data.bl_product_id=row.data.p_id;
        data.bl_product_type=row.data.p_type;
        Ext.Ajax.request({
            url:$__app__ + '/BusList/save',
            method:'POST',
            params:data,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg=ret.info;
                if (ret.status==1){
                    var p_id = parseInt(msg);
                    if (!isNaN(p_id)){
                        msg = msg.substring(p_id.toString().length);
                        store.reload();
                    }else{
                        store.reload();
                    }
                };
                Ext.Msg.alert('友情提示',msg,function(){ if (ret.status==1){busList_win.hide();} });
                myMask.hide();
            },
            failure:function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '未知错误！');
            }
     })

    };

   //时间搜索
    function startReloadStore(){
        var row=SUNLINE.getSelected(buslist_left);
        if(!row){
            Ext.Msg.alert('友情提示','请在左侧选择一个产品');
            return false;
        };
        var start_date=Ext.getCmp('seach_start_date').getValue();
        start_date=Ext.Date.format(start_date,'Y-m-d');
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        stop_date=Ext.Date.format(stop_date,'Y-m-d');
        SUNLINE.baseParams(store,{'bl_product_id':row.data.p_id,'bl_start_date':start_date,'bl_stop_date':stop_date});
        store.currentPage=1;
        store.load();
    };

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

    //锁定座位
    function lock_seat(b){
        var bus_rcd;
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(buslist_left);
        var seat_rcd = seat_view.getSelectionModel().getSelection();
        bus_rcd = bus_view.getSelectionModel().getSelection();
        if(bus_rcd==''){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请先选择您要操作的车辆。' );
            return;
        }
        var num = bus_rcd[0].data.num;
        var rs = get_selected_seat(seat_rcd);
        var params = {bl_id:list_row.data.bl_id, num:num, seats:rs.join(','),bl_product_id:p_row.data.p_id};
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

    //获取被选中的座位号
    function get_selected_seat(records, filter){
        if (!filter) filter = 'empty'; // 默认选择空座
        var seats = [];
        for (var i=0; i<records.length; i++){
            if (records[i].data.status == filter)
                seats.push( records[i].data.num );
        }
        return seats;
    };

    //确认是否选中班期
    function getListRow(){
        var list_row=SUNLINE.getSelected(busList_grid);
        if(list_row==null){
            Ext.Msg.alert('友情提示','请选择您要调整的班期！');
            return false;
        };
        return list_row;
    };

    //删除车辆
    function remove_bus(b){
        b.setDisabled(true);
        var row=SUNLINE.getSelected(bus_view);
        var p_row=SUNLINE.getSelected(buslist_left);
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


    //添加车辆
    function add_bus(b){
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(buslist_left);
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

   // 释放预留(锁定)座位
    function release_seat(b){
        var bus_rcd;
       // b.setDisabled(true);
        var act = b.act=='lock'?'锁定':'预留';
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(buslist_left);
        var seat_rcd = seat_view.getSelectionModel().getSelection();
        bus_rcd = bus_view.getSelectionModel().getSelection();
        if(bus_rcd==''){
            b.setDisabled(false);
            Ext.Msg.alert( '友情提示', '请先选择您要操作的车辆。' );
            return;
        }
        var num = bus_rcd[0].data.num;
        var rs = get_selected_seat(seat_rcd, b.act);

        var params = {bl_id:list_row.data.bl_id, num:num, seats:rs.join(','), act:b.act,bl_product_id:p_row.data.p_id};
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

// 修改座位数
    function change_seat_num(b){
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(buslist_left);
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

    //预留座位
    function reserve_seat(b){
        var bus_rcd;
        b.setDisabled(true);
        var list_row = getListRow();
        var p_row=SUNLINE.getSelected(buslist_left);
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
        var bl_id = list_row.data.bl_id;
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
        var go_time = list_row.data.bl_start_date + ' ' + list_row.data.bl_start_time;
        var params = { bl_id:bl_id, user_id:company, seats:st.join(','), save_time:tm, num:num , go_time:go_time,bl_product_id:p_row.data.p_id};

        Ext.Msg.confirm('友情提示', '您真的要预留这些座位吗？['+ st.join(',')+']', function(btn){
            if (btn!='yes'){
                b.setDisabled(false);
                return;
            };
            var myMask=SUNLINE.LoadMask('正在保存座位信息，请稍候...');
            myMask.show();
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

    // 批量添加时表单提交方法
    function do_submit_multi(){
       var row= busList_multi_form.getForm().getValues();
        if(!busList_multi_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };
        var records=ticket_grid.getSelectionModel().getSelection();
        var ids=[];
        for(i=0;i<records.length;i++){
            ids[i]=records[i].data.ta_id;
        }
        var str_ticket = ids.join(',');
        row.bl_ticket_ids = str_ticket;
        var p_data=SUNLINE.getSelected(buslist_left);
        row.bl_product_id=p_data.data.p_id;
        row.bl_product_type=p_data.data.p_type;
        row.bl_start_time = row.bl_start_time.replace('：',':');
        var myMask=SUNLINE.LoadMask('正在保存班期信息，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/BusList/save',
            method:'POST',
            params:row,
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                var msg = rst.info;
                if (rst.status==1){
                    var p_id = parseInt(msg);
                    if (!isNaN(p_id)){
                        msg = msg.substring(p_id.toString().length);
                        store.load();
                    }else{
                        store.load();
                        //ChangeRowData(records, row, store);
                    }
                };
                Ext.Msg.alert('友情提示',msg,function(){
                    if (rst.status==1){ busList_win_multi.hide(); }
                });
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '未知错误！',function(){ busList_win_multi.hide(); });
            }
        });
    }; // end doSubmit

  function do_clear(b){
        var row=SUNLINE.getSelected(busList_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择您要清除自定义票价的班期。');
            return;
        };
      if(company_type=='zhu'){
          var child_org_id=companyCombox.getValue();
          if(!child_org_id){
              Ext.Msg.alert('友情提示', '请选择您要清除自定义票价的子公司。');
              return;
          }
      }
      Ext.Msg.confirm('友情提示', '您真的要清除选定班期的自定义票价吗？ 清除后遵循票价定义中的价格。', function(btn){
      if (btn != 'yes'){ return false; };
          var myMask=SUNLINE.LoadMask('数据清理中，请稍候...');
          myMask.show();
          var s = {
              bl_id : row.get('bl_id'),
              bl_start_date : row.get('bl_start_date'),
              bl_num : row.get('bl_num'),
              p_id:row.get('bl_product_id'),
              bl_product_id:row.get('bl_product_id'),
              child_org_id:child_org_id
         };
         Ext.Ajax.request({
             url : $__app__ + '/BusList/clear_ticket_detail',
            method:'POST',
            params:s,
            success : function(response, opts){
               var rst = Ext.decode(response.responseText);
               var msg = rst.info;
               Ext.Msg.alert('友情提示',msg);
               myMask.hide();
               store.load();
            },
              failure : function(response, opts){
              myMask.hide();
              Ext.Msg.alert('友情提示', '未知错误！');
            }
         });
      });
  };

    //勾选函数
    t_store.on('load',function(){
        if(busList_win.title=='编辑班期信息'){
            var row=SUNLINE.getSelected(busList_grid);
            if(row.data.bl_ticket_ids==''){

            }else{
                var arr_id=row.data.bl_ticket_ids.split(',');
                var count=t_store.getCount();
                var select_array=[];
                for(var index=0;index<count;index++){
                    var record=t_store.getAt(index);
                    if(in_array(record.data.ta_id,arr_id)!=-1){
                        select_array.push(record);
                    }
                }
                if(select_array.length>0){
                    buslist_win_grid.getSelectionModel().select(select_array);
                }
            }
        }
    })

    //时间处理函数
    function formatTime(v){
        if(v==''|| v==0){
            return '';
        }
        var t = new Date(parseInt(v) * 1000);
        return Ext.Date.format(t,'Y/m/d H:i');
    }
    function to_str(v){
        if(v==''|| v==0){
            return '';
        }
        var t = new Date(parseInt(v) * 1000);
        return Ext.Date.format(t,'m-d H:i');
    }


//修改当天票价信息
    function edit_ticket(){
        var money=0;
        var north_data=[];
        for(var i=0;i<edit_store.count();i++){
            var se_store=edit_store.getAt(i);
            var se_temp={};
            se_temp['ci_name']=se_store.get('ci_name');
            se_temp['ci_trade_price']=se_store.get('ci_trade_price');
            north_data.push(se_temp);
            if(se_store.get('ci_name')=='毛利')WG.td_gross_price_old=se_store.get('ci_trade_price');
            money=parseFloat(money)+parseFloat(se_store.get('ci_trade_price'));
        }
        north_data=Ext.encode(north_data);
        WG.td_fanli=parseFloat(WG.td_price_old)-parseFloat(WG.td_trade_price_old);
        WG.money_new=money;
        WG.td_trade_price_old=money;
        WG.td_price_old=parseFloat(money)+parseFloat(WG.td_fanli);
        var b_row=SUNLINE.getSelected(busList_grid);
        var b_id_val=b_row.data.bl_id;
        var p_row=SUNLINE.getSelected(buslist_left);
        var p_id_val=p_row.data.p_id;
        var t_row=SUNLINE.getSelected(buslist_edit_grid);
        var t_id_val=t_row.data.t_id;
        var data={};
        var chai_money=parseFloat(t_row.data.t_trade_price)-parseFloat(t_row.data.t_agency_price);
        data['chai_money']=chai_money;
        data['t_id']=t_id_val;
        data['p_id']=p_id_val;
        data['b_id']=b_id_val;
        data['td_btime']=b_row.data.bl_start_date;
        data['td_start_time']=WG.td_start_time_old;
        data['td_end_time']=WG.td_end_time_old;
        data['td_ta_id']=WG.td_ta_id_old;
        data['td_price']=WG.td_price_old;
        data['td_trade_price']=WG.td_trade_price_old;
        data['td_gross_price']=WG.td_gross_price_old;
        data['td_details']=north_data;
        data['t_preset_type']=t_row.data.t_preset_type;
        data['t_standards_name']=t_row.data.t_standards_name;
        data['t_money']=t_row.data.t_money;
        data['t_agency_price']=t_row.data.t_agency_price;
        data['t_spread_price']=t_row.data.t_spread_price;
        data['type']=WG.td_type_old;
        data['td_id']=WG.td_id_old;
        data=Ext.encode(data);
        if(WG.b_id_old==0){
            var ta_id=0;
        }else{
            var ta_id=WG.td_ta_id_old;
        }
        var child_org_id=-1;
        if(company_type=='zhu'){
            child_org_id=companyCombox.getValue();
        }
        Ext.Ajax.request({
            url:$__app__ + '/BusList/save_ticket_detail',
            params:{bl_ticket_detail:data,bl_id:b_row.data.bl_id,ta_id:ta_id,bl_product_id:p_id_val,child_org_id:child_org_id},
            method:'POST',
            success:function(response,opts){
                var ret = Ext.decode(response.responseText);
                if(ret.status){
                    Ext.Msg.alert('提示信息',ret.info.msg);
                    SUNLINE.baseParams(edit_store,{b_id:b_id_val,t_id:t_id_val,p_id:p_id_val});
                    t_edit_store.load();
                    edit_win.hide();
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('提示信息','当天票价修改失败！');
            }
        })

    }

    buslist_edit_grid.on('edit',function(i,g){
        if ( g.value == g.originalValue ) return false;
        var row=SUNLINE.getSelected(buslist_edit_grid);
        var b_row=SUNLINE.getSelected(busList_grid);
        var data={};
        if(g.field=='t_trade_price'){
            data.t_money=row.data.t_money;
        }else{
            data.t_trade_price=row.data.t_trade_price;
        }
        if(company_type=='zhu'){
            data.child_org_id=companyCombox.getValue();
        }
        data.change= g.field;
        data.old_value= g.originalValue;
        data.new_value= g.value;
        data.p_id=b_row.data.bl_product_id;
        //data.t_store=row.data.t_store;
        data.bl_product_id=b_row.data.bl_product_id;
        data.bl_id=b_row.data.bl_id;
        data.t_preset_type=row.data.t_preset_type;
        data.t_standards_name=row.data.t_standards_name;
        data.t_spread_price=row.data.t_spread_price;
        data.t_id=row.data.t_id;
        data.td_btime=b_row.data.bl_start_date;
        data.t_agency_price=row.data.t_agency_price;
        data.td_start_time=row.data.t_start_time;
        data.td_end_time=row.data.t_end_time;
        data.td_ta_id=row.data.t_taid;
        Ext.Ajax.request({
            url:$__app__+'/BusList/change_price',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                    t_edit_store.load();
            },
            failure:function (response, otps) {

            }
        })
    });

    edit_win.on('show',function(){
        var s={};
        var p_row=SUNLINE.getSelected(buslist_left);
        var b_row=SUNLINE.getSelected(busList_grid);
        var t_row=SUNLINE.getSelected(buslist_edit_grid);
        if(!t_row){
            Ext.Msg.alert('友情提示', '请选择要操作的票价信息。');
            return;
        }
        if(company_type=='zhu'){
            s['child_org_id']=companyCombox.getValue();
        }
        s['t_id']=t_row.data.t_id;
        s['b_id']=b_row.data.bl_id;
        s['p_id']=p_row.data.p_id;
        s['bl_product_id']=p_row.data.p_id;
        s['td_btime']=b_row.data.bl_start_date;
        Ext.Ajax.request({
            url:$__app__ + '/BusList/get_ticket_detail',
            params:s,
            method:'POST',
            success:function (response,opts) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if(info.msg){
                    var td_details=Ext.decode(info.msg);
                    for(var i in td_details){
                        if(td_details[i]['ci_name']){
                            var ci_name_v=td_details[i]['ci_name'];
                            var ci_trade_price_v=td_details[i]['ci_trade_price'];
                            edit_store.add({
                                ci_name:ci_name_v,
                                ci_trade_price:ci_trade_price_v
                            });
                        }
                    }
                    WG.td_price_old=info.td_price_old;
                    WG.td_trade_price_old=info.td_trade_price_old;
                    WG.td_id_old=info.info;
                    WG.td_gross_price_old=info.val;
                    WG.b_id_old=info.b_id_old;
                    WG.td_start_time_old=info.td_start_time_old;
                    WG.td_end_time_old=info.td_end_time_old;
                    WG.td_ta_id_old=info.td_ta_id_old;
                    WG.td_type_old=info.type;
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('提示信息','没有该票价的详情信息');
            }
        })
    });

    edit_win.on('hide',function(){
        edit_store.removeAll();
    });

    busList_win_edit.on('hide',function(){
        t_edit_store.load();
        store.load();
    });

    ziyo_log({ listeners : [{grid: busList_grid, table:'BusList', pk_id:'bl_id'}] });

});


