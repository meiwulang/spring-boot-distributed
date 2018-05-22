Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var _url = $__app__ + '/Forecast/get_grid_data';
    var _field = [];
    var _store = new SUNLINE.JsonStore(_url,_field,true);

    //产品系列
    var p_series_combo=SUNLINE.DictComBox({name:'p_series',id:'p_series_id',width:120,labelWidth:80,labelAlign:"right",style:'margin-left:-7px;'},{'d_type':'品牌系列'});
    //产品
    var Products_OrgCombo=SUNLINE.OrgCombo_Products_false({name:'p_name',id:'p_name_id',labelWidth:80,labelAlign:"right",width:310,allowBlank:true,editable:true,forceSelection:true});

    //产品系列
    var end_store=p_series_combo.box.getStore();
    var Products_store=Products_OrgCombo.box.getStore();
    SUNLINE.baseParams(end_store,{d_type:'品牌系列'});
    end_store.on('load',function(){
        this.add({d_type:'品牌系列',d_text:'全部产品', d_status: "ok", d_recommend: "0"});
        Ext.getCmp('p_series_id').setValue('全部产品');
    })
    p_series_combo.box.on({'select':function(c,r,n){
        Products_store.removeAll();
        Ext.getCmp('p_id').setValue('');
        SUNLINE.baseParams(Products_store,{p_series:r[0].get('d_text')});
        Products_store.currentPage=1;
        Products_store.load();
    }});

    //时间类型
    var time_type_combo = new Ext.form.ComboBox({
        fieldLabel:"时间类型",
        width:155,
        labelWidth:60,
        id:"time_type",
        name:"time_type",
        allowBlank:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['出团日期'],['回团日期'],['售票日期'],['确认日期']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        editable:false,
        typeAhead:true,
        value:"出团日期"
    });
    //订单状态
    var order_type_combo = new Ext.form.ComboBox({
        fieldLabel:"订单状态",
        width:155,
        labelWidth:65,
        id:"order_type",
        name:"order_type",
        allowBlank:false,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['待确认'],['已确认'],['问题订单'],['出票中'],['退票'],['收款中']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        editable:false,
        typeAhead:true,
        value:"全部"
    });

    var _cm =[
        new Ext.grid.RowNumberer(),
        {header:"订单ID", dataIndex:"o_id", width:50, hidden:true},
        {header:"订单号", dataIndex:"o_number", width:200,renderer:function(v,i,r){
            var url = $__app__+"/OrderDetail/index/id/"+v;
            return '<a href = "'+url+'" target = "_blank">'+v+'</a>';}
        },
        {header:"订单收入", dataIndex:"o_settle_real", width:150,renderer:money},
        {header:"核算成本", dataIndex:"trade_price", width:150,renderer:money},
        {header:"去程交通", dataIndex:"goto_money", width:150,renderer:money},
        {header:"回程交通", dataIndex:"back_money", width:150,renderer:money},
        {header:"接送费", dataIndex:"tp_money", width:150,renderer:money},
        {header:"订单返还", dataIndex:"", width:150},
        {header:"人数", dataIndex:"o_num", width:80,align:'right'},
        {header:"预算毛利", dataIndex:"total", width:150,renderer:money},
        {header:"订单状态", dataIndex:"o_status", width:150}
    ];

    var _grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
       // style : 'border-top:2px solid #009DDA;',
        width:800,
        columns:_cm,
        store:_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有公司信息',
            deferEmptyText:true
        },
        style : 'border-top:1px solid #ddd;',
        tbar:[
            '产品系列:',
            p_series_combo.box,
            '线路名称:',
            Products_OrgCombo.box,
            {xtype:'hidden',emptyText:'产品id',id:'p_id'},
            time_type_combo,
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:110,gang:'seach_stop_date',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',labelWidth:0,labelAlign:"right",style:'margin-top:5px;',fieldLabel:" ",labelSeparator:'',width:110,gang:'seach_start_date'}),
            '-',
            {text:'查询',iconCls:'button-sch',handler:sreach},
            '-',
           {text:'导出',f_type:'all', iconCls:'button-excel',handler:download_excel}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'额度授信信息'
        })
    });

    var check=['tm_worg_id','sorg_city_id','sale_txt_id','order_type','seach_start_date','seach_stop_date','time_type','p_series_id','p_id'];
    //导出函数
    function download_excel(){
        var char=[];
        var url='';
        for(var i= 0;i<check.length;i++){
            char[i] =Ext.getCmp(check[i]).getValue();
            if(char[i]){
                if(check[i]=='seach_start_date' ||check[i]=='seach_stop_date'){
                    char[i]=Ext.util.Format.date(char[i],'Ymd');
                }
                url+='/'+check[i]+'/'+char[i];
            }
        }
        var name='是否确认导出当前选择条件下的所有数据？';
        Ext.MessageBox.confirm('友情提示',name,function(y){
            if(y!='yes')return false;
            window.download_ifm.location = $__app__+'/Forecast/download_excel'+url;
        });
    }

    Products_OrgCombo.box.on('select',function(v,r,o){
        Ext.getCmp('p_id').setValue(r[0].data.p_id);
    })

    var trans_store = new SUNLINE.JsonStore($__app__+'/TransPlan/select_combox', [],false);
    var trans_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"id", width:80,hidden:true},
        {header:"名称", dataIndex:"text", width:300}
    ];
    var trans_grid=new Ext.grid.GridPanel({
        region:'center',
        store:trans_store,
        columns:trans_cm,
        autoScroll:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        height:520,
        tbar:[
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'trans_Search',
                cls:'search-icon-cls',
                emptyText : '信息名称',
                width:280,
                onTriggerClick:function(e){
                    trans_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            trans_search();
                    }
                }
            }
        ]
    });

    var trans_win = new Ext.Window({
        width : 400,
        height : 600,
        modal : true,
        fixed:true,
        closeAction : 'hide',
        items:trans_grid,
        buttons:[
            {text:'确认选择',handler:trans_vf_fn},
            {text:'关闭', handler:function () {
                trans_win.hide();
            }}
        ]
    });



    function trans_vf_fn(){
        var rows=trans_grid.getSelectionModel().getSelection();
        var sl_id=[];
        var sl_name=[];
        Ext.each(rows,function(v,i){
            var row= v.data;
            if(v.id && row.text!='全部')sl_id.push(row.id);
            sl_name.push(row.text);
        });
        Ext.getCmp(select_id).setValue(sl_id);
        Ext.getCmp(select_name).setValue(sl_name);
        trans_win.hide();
    }

    function trans_search(){
        var keys=Ext.getCmp('trans_Search').getValue();
        SUNLINE.baseParams(trans_store,{skey:keys},true);
        trans_store.load();
    }

    trans_store.on({
        load:function(){
            var row_id=Ext.getCmp(select_id).getValue();
            if(!row_id)return '';
            var i=0;
            row_id=row_id.split(',');
            this.each(function(v){
                var rows= v.data;
                if(in_array(rows['id'],row_id)!=-1){
                    trans_grid.getSelectionModel().select(i, true);
                }
                i++;
            })
        }
    });

    var _panel = new Ext.Panel({
        border : false,
        layout : 'border',
        region : 'center',
        items : [_grid],
        html:'<iframe id="download_ifm" name="download_ifm" frameborder="0" width="0" height="0"></iframe>',
        tbar:[
            {xtype:'textfield',fieldLabel:'分公司',labelWidth:60,labelAlign:"right",emptyText:'全部分公司',text:'选择分公司',id:'tm_worg_txt',to_id:'tm_worg_id',width:185},
            {xtype:'hidden',emptyText:'全部分公司ID',id:'tm_worg_id'},
            {xtype:'textfield',fieldLabel:'所属地区',labelWidth:60,labelAlign:"right",emptyText:'全部城市',text:'选择城市',id:'sorg_city',to_id:'sorg_city_id',width:187},
            {xtype:'hidden',emptyText:'全部城市ID',id:'sorg_city_id'},
            {xtype:'textfield',fieldLabel:'销售',labelWidth:40,labelAlign:"right",emptyText:'全部销售',text:'选择销售',id:'sale_txt',to_id:'sale_txt_id',width:187},
            {xtype:'hidden',emptyText:'全部销售ID',id:'sale_txt_id'},
            order_type_combo,
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'f_search',
                iconCls:'button-sch',
                emptyText : '订单号',
                width:190,
                onTriggerClick:function(e){
                    sreach();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            sreach();
                    }
                }
            }
        ]
    });

    var select_id='';
    var select_name='';
    var select_row=['tm_worg_txt','sorg_city','sale_txt'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                var post={type:t.text};
                if(select_name=='sale_txt'){
                    var org_id=Ext.getCmp('tm_worg_id').getValue();
                    post.org_id=org_id;
                }
                SUNLINE.baseParams(trans_store,post);
                trans_store.load();
            }
        });
    }

    new Ext.Viewport({
        layout : 'border',
        items : [_panel]
    });

    function sreach(){
        var org_id=Ext.getCmp('tm_worg_id').getValue();
        var city_id=Ext.getCmp('sorg_city_id').getValue();
        var sale_id=Ext.getCmp('sale_txt_id').getValue();
        var order_type=Ext.getCmp('order_type').getValue();
        var start_date=Ext.util.Format.date(Ext.getCmp('seach_start_date').getValue(), 'Ymd');
        var stop_date=Ext.util.Format.date(Ext.getCmp('seach_stop_date').getValue(),'Ymd');
        var time_type=Ext.getCmp('time_type').getValue();
        var p_series_id=Ext.getCmp('p_series_id').getValue();
        var p_id=Ext.getCmp('p_id').getValue();
        var skey=Ext.getCmp('f_search').getValue();
        var params = {order_type:order_type,tm_worg_id:org_id,sorg_city_id:city_id,sale_txt_id:sale_id,seach_start_date:start_date,seach_stop_date:stop_date,time_type:time_type,p_series_id:p_series_id,p_id:p_id};
        if(skey)params.skey=skey;
        SUNLINE.baseParams(_store,params);
        _store.currentPage=1;
        _store.load();
    }




});
