Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.QuickTips.init();

    var finishComob=new Ext.form.ComboBox({
        allowBlank:false,
        width:90,
        triggerAction:"all",
        store:new Ext.data.Store({
            fields:['name'],
            data:[{name:'全部'},{name:'已提现'},{name:'处理中'},{name:'已失败'},{name:'已合并'},{name:'已受理'}]
        }),
        displayField:"name",
        valueField:"name",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        editable: false,
        value:"全部"
    });
    var w_flag = SUNLINE.LocalComob({
        id: 'w_flag',
        fields: ['id', 'text'],
        data: [
            {id: '全部', text: '全部'},
            {id: '手动', text: '手动'},
            {id: '自动', text: '自动'},
        ],
        config: {
            editable: false,
            valueField: 'id',
            displayField: 'text',
            id: 'w_flag',
            name: 'w_flag',
            labelWidth: 60,
            labelAlign: 'right',
            width: 90,
            value: '全部',
        }
    });


    var company_value = _uinfo.org_type=='管理公司' ? '' : _uinfo.org_name;
    var company_disabled = _uinfo.org_type=='管理公司' ? false : true;


    var type_name = '收款单位';
    //构建收款单位的combobox
    var conf = {
        colspan:3,
        displayField:'text',
        valueField:'id',
        fieldLabel:'',
        id:'company_box',
        hiddenName:'org_id',
        pageSize:20,
        width:257,
        value:company_value,
        disabled:company_disabled,
        listConfig:{
            width:257,
            minWidth:257,
            maxWidth:257
        },
        labelAlign:'right'
    };
    var company_config=Ext.apply(conf,{});
    var company_box= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order',type :'seller' },
        config:company_config
    });
    if(_uinfo.org_type=='管理公司'){
        var company_box_store=company_box.getStore();
        company_box_store.on('load',function(a,b,c){
            this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "供应商",tel:'120'});
            for(var i in b){
                this.add(b[i]['data']);
            }
        });
    }

    var status_color = {'处理中':'#ff6331', '已提现':'#71dc1c', '已失败':'#8899AB', '已撤销':'#666666', '已合并':'#fda50d', '已受理':'#45b4fc'};
    var dis_url = $__app__+'/OnlineBill/billJson';
    var dis_fields = [];
    var _store = SUNLINE.JsonStore(dis_url,dis_fields,true,{groupField:''});
    var isHidden = _uinfo.org_type=='管理公司' ? false : true;
    var _cm = {
        defaults: {
            sortable: false
        },
        items:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"ID",dataIndex:"w_id",width:100,hidden:true},
            {header:"收款单位ID",dataIndex:"w_in_orgid",width:100,hidden:true},
            {header:"凭证编号",dataIndex:"w_number",width:200,renderer:function(v,m,r,i){
                var cls = r.get('w_child') && r.get('w_child')>0 ? 'button-collapse' : 'button-expand';
                var div = r.get('w_isparent')==1 ? '<div title="点击此列可展开查看子账单或收起子账单" id="span_index_'+i+'" onclick="childrenBill('+i+');" class="'+cls+'" style="padding:5px 0 0 20px;">'+v+'</div>' : (r.get('w_isparent')==0 ? '<div onclick="childrenBill('+i+');" style="padding-left:20px;">'+v+'</div>' : v);
                if(r.get('w_pid')>0){
                    div = '<div style="padding-left:30px;">'+v+'</div>';
                }
                return div;

            }},
            {header:"状态",dataIndex:"w_status",width:70,renderer:in_status_data},
            {header:"账单日期",dataIndex:"w_bill_date",width:90},
            {header:"收款单位",dataIndex:"w_in_orgname",width:230,hidden:isHidden},
            {header:"账单金额",dataIndex:"w_bill_amount",width:130,renderer:money,align:"right"},
            {header:"提现手续费",dataIndex:"w_bill_fee",width:110,renderer:money,align:"right"},
            {header:"实收金额",dataIndex:"w_bill_income",width:130,renderer:money,align:"right"},
            {header:"提现日期",dataIndex:"w_finish_time",width:150,renderer:repay_time},
            {header:"生成方式",dataIndex:"w_flag",width:80,align:'center'},
            {header:"备注",dataIndex:"w_request_info",width:270,renderer:function(v){
                if(v) {
                    return '<div title="' + v + '">' + v + '</div>';
                }
            }},
            {header:"特殊说明",dataIndex:"w_info",width:270,renderer:function(v){
                if(v) {
                    return '<div title="' + v + '">' + v + '</div>';
                }
            }}
        ]
    };

    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: _store,//数据源
        columns:  _cm,//表格列定义
        viewConfig: {emptyText: '暂时没有提现账单',deferEmptyText:true,enableTextSelection: true},
        tbar:[
            {
                xtype:'buttongroup',
                title:'在线账单管理',
                height:80,
                columns: 3,
                defaults: {
                    scale: 'small'
                },
                items:[
                    {text:'打印账单',id:'print_bill',rowspan: 2,iconCls: 'button-print',height:48,disabled:isDisabled("OnlineBill::print_bill"),iconAlign: 'top',handler:print_bill},
                    {text:'导出账单',id:'export_details',rowspan: 2,iconCls: 'button-excel',height:48,iconAlign: 'top',handler:export_details}
                ]
            },
            {
                xtype:'buttongroup',
                id:'search_form',
                title:'查询条件选择',
                height:80,
                columns:7,
                items:[
                    {xtype:'tbtext',text:'账单状态:',height:29,style:'line-height:26px'},
                    finishComob,
                    {xtype:'tbtext',text: type_name ,height:29,style:'line-height:26px'},
                    company_box,
                    {text:'查询',rowspan:2,iconCls: 'searchico',iconAlign: 'top',height:55,handler:quick_search,style:'margin-left:5px'},
                    {xtype:'tbtext',text:'生成方式:',height:29,style:'line-height:26px'},
                    w_flag,
                    {xtype:'tbtext',text:'账单日期:',height:29,style:'line-height:26px'},
                    new SUNLINE.ExtDateField({id:'ap_start_date',name:'ap_start_date',labelWidth:0,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:120,gang:'ap_end_date',start:true}),
                    {xtype:'tbtext',text:'~',height:29,style:'line-height:26px;text-align:center'},
                    new SUNLINE.ExtDateField({id:'ap_end_date',name:'ap_end_date',labelWidth:1,labelAlign:"right",fieldLabel:false,labelSeparator:'',width:120,gang:'ap_start_date'})
                ]
            },'->',{
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:80,
                bodyStyle:'padding:10px',
                items:[{
                    xtype:'trigger',
                    triggerCls:'x-form-search-trigger',
                    width:150,
                    id:'skey',
                    cls:'search-icon-cls',
                    emptyText:'凭证号',
                    onTriggerClick:function(){
                        KeySearch()
                    },
                    listeners:{
                        specialkey:function(t,e){
                            if(e.keyCode==13) KeySearch()
                        }
                    }
                },{
                    xtype:'hidden',
                    id:'h_jgid',
                    value:0
                },{
                    xtype:'hidden',
                    id:'h_uid',
                    value:0
                }]
            }],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });
    //双击事件
    _grid.addListener('rowdblclick', print_bill);


    //监听父账单是否展开收缩
    window.childrenBill = function(i){
        _grid.getSelectionModel().selectRange(i,i);
        var r = SUNLINE.getSelected(_grid);
        var child = r.get('w_child');
        var id = r.get('w_id');
        var pid = r.get('w_isparent');
        if(!id || !id>0 || pid==0){
            return false;
        }
        if(child && child > 0){
            r.set('w_child',0);
            for(var j=child;j>0;j--) {
                _grid.getStore().removeAt(parseInt(j)+parseInt(i));
            }
            document.getElementById('span_index_'+i).className = 'button-expand';
            return false;
        }
        Ext.Ajax.request({
            url:$__app__+'/OnlineBill/billJson?_dc='+Math.random(),
            params:{id:id},
            method:'post',
            success:function(result){
                var ret=Ext.decode(result.responseText);
                _grid.getStore().insert(i+1,ret.data);
                r.set('w_child',ret.total);
                document.getElementById('span_index_'+i).className = 'button-collapse';
            }
        });
    };



    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    _grid.getSelectionModel().on('select', function(sm,record){
        Ext.getCmp("print_bill").setDisabled(true);
        if(record.data.w_status){
            Ext.getCmp("print_bill").setDisabled(false);
        }
    });



    /*打印处理窗口(start)*/
    var cd_win = new Ext.Window({
        title:'账单打印',
        width:760,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="748" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint, id:'doprint_btn'},
            {text : '关闭', handler:function(){cd_win.hide();}}
        ]
    });

    cd_win.on("show",function(){
        var row=SUNLINE.getSelected(_grid);
        var url = $__app__ + '/OnlineBill/BillPrint?_dc=' + time()+'&wno='+row.data.w_number+'&id='+row.data.w_id;
        window.ifm_print.location = url;
    });



    function print_bill(b){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            var msg = '请选择要打印的账单！';
            Ext.Msg.alert('友情提示',msg);
            return false;
        }
        if(!row.data.w_id>0){
            return false;
        }
        cd_win.show();
        var title = '账单打印';
        cd_win.setTitle(title);
    }


    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }
    /*打印处理窗口(end)*/


    var s_conf = {
        displayField:'text',
        valueField:'id',
        fieldLabel:'分销商',
        hidden:true,
        id:'s_company_box',
        hiddenName:'s_org_id',
        pageSize:20,
        labelAlign:'right',
        labelWidth:70,
        width:300,
        value:''
    };
    var s_company_config=Ext.apply(s_conf,{});
    var s_company_box= SUNLINE.CompanyBox({
        where:{  org_type:'分销商',source:'onlinebill'},
        config:s_company_config
    });
    var s_company_box_store=s_company_box.getStore();
    s_company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部分销商', org_bh: "quanbu", org_type: "分销商",tel:'120'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    });

    var b_conf = {
        displayField:'text',
        valueField:'id',
        fieldLabel:'供应商',
        id:'b_company_box',
        hiddenName:'b_org_id',
        pageSize:20,
        labelAlign:'right',
        hidden:isHidden,
        labelWidth:70,
        width:300,
        value:''
    };
    var b_company_config=Ext.apply(b_conf,{});
    var b_company_box= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'onlinebill'},
        config:b_company_config
    });
    var b_company_box_store=b_company_box.getStore();
    b_company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部供应商', org_bh: "quanbu", org_type: "供应商",tel:'120'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    });

    var export_type={
        xtype: 'radiogroup',id:'export_type',fieldLabel : '导出类型',labelAlign:'right', labelWidth:70,columns: 2,
        items: [
            {boxLabel: "提现账单",columnsWidth:80,name:'export_type_input', inputValue: '1',checked:true},
            {boxLabel: "账单明细",columnsWidth:80,name:'export_type_input', inputValue: '2'},
        ]
    };
    var date_flag = SUNLINE.LocalComob({
        id: 'date_flag',
        fields: ['id', 'text'],
        data: [
            {id: '0', text: '账单日期'},
            {id: '1', text: '支付日期'},
        ],
        config: {
            editable: false,
            fieldLabel : '日期类型',
            disabled: true,
            valueField: 'id',
            displayField: 'text',
            id: 'date_flag',
            name: 'date_flag',
            labelWidth: 70,
            labelAlign: 'right',
            width: 90,
            value: '账单日期',
        }
    });

    var exportItems = [
        export_type,
        b_company_box,
        s_company_box,
        date_flag,
        new SUNLINE.ExtDateField({id:'payment_start_time',name:'payment_start_time',labelAlign:"right",fieldLabel:'开始日期',labelWidth:70,gang:'payment_end_time',start:true,maxValue:yesterday()}),
        new SUNLINE.ExtDateField({id:'payment_end_time',name:'payment_end_time',labelAlign:"right",fieldLabel:'结束日期',labelWidth:70,gang:'payment_start_time',maxValue:yesterday()})
    ];

    var exportForm=Ext.create('Ext.form.Panel',{
        layout: 'column',bodyPadding: 10,id:'form',border:false,width: 450,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',columnWidth:1,
            defaults:{anchor: '100%',allowBlank:false,labelAlign:'right'}
        },
        items: [
            {title:'查询条件',cls:'tcol2',items:exportItems},
            {title:'温馨提示',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1、日期区间必选；</li><li>2、提现账单导出日期默认账单日期，账单明细可以选择账单日期或者支付日期。</li></ul></div>'}
        ]
    });

    var exportWin = Ext.create('Ext.window.Window',{
        title:'导出账单信息',
        closeAction:'hide',
        width: 460,
        height:380,
        modal:true,
        items: [exportForm],
        buttons:[
            {text:'导出',iconCls: 'button-excel',handler:do_export},
            {text:'关闭',handler:function(){
                exportWin.hide();
            }}
        ]
    });
    function export_details() {
        exportWin.show();
    }

    Ext.getCmp('export_type').on('change',function(c,r) {
        if(r.export_type_input == 1){
            Ext.getCmp('s_company_box').setDisabled(true)
            Ext.getCmp('date_flag').setDisabled(true);
            Ext.getCmp('date_flag').setValue('账单日期');
            Ext.getCmp('s_company_box').setHidden(true);
        }else{
            Ext.getCmp('date_flag').setDisabled(false);
            Ext.getCmp('s_company_box').setDisabled(false);
            Ext.getCmp('s_company_box').setHidden(false);
        }
    })
    function do_export() {
        var r = Ext.getCmp('export_type').getValue();
        var export_type = r.export_type_input;
        var buyer_org_id = Ext.getCmp('s_company_box').getValue();
        var seller_org_id = Ext.getCmp('b_company_box').getValue();
        var date_type = Ext.getCmp('date_flag').getValue();
        var payment_start_time = Ext.Date.format(Ext.getCmp('payment_start_time').getValue(), 'Y-m-d');
        var payment_end_time = Ext.Date.format(Ext.getCmp('payment_end_time').getValue(), 'Y-m-d 23:59:59');
        if(payment_start_time == '' || payment_end_time == ''){
            Ext.Msg.alert('友情提示','请选择时间段');
            return false;
        }
        var url = 'export_type='+export_type+'&seller_org_id='+seller_org_id+'&buyer_org_id='+buyer_org_id+'&payment_start_time='+payment_start_time+'&payment_end_time='+payment_end_time+'&date_type='+date_type;
        window.location = $__app__+'/OnlineBill/export_details?'+url;
    }

    function quick_search(e){
        var where={};
        var status=finishComob.getValue();
        var flag = Ext.getCmp("w_flag").getValue();
        var start_date=Ext.getCmp("ap_start_date").getValue();
        var end_date=Ext.getCmp("ap_end_date").getValue();
        var company_box = Ext.getCmp("company_box").getValue();
        if(status) where["status"]=status;
        if(flag && flag != '全部'){
            where['w_flag'] = flag;
        }
        if(start_date) where["start_date"]=start_date;
        if(end_date) where["end_date"]=end_date;
        if(company_box) where['w_in_orgid'] = company_box;
        SUNLINE.baseParams(_store,where);
        _store.load();
    }

    function KeySearch(){
        var skey = Ext.getCmp('skey').getValue();//获取search里面的值
        SUNLINE.baseParams(_store,{skey:skey});
        _store.currentPage=1;
        _store.load();
    }



    function money(v, m, r){
        var m = real_money(v, m, r);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }


    function real_money(v, m, r){
        if (v==null || v=='') v=0;
        if (isNaN(v)) v=0;
        return '￥'+Number(v).toFixed(2);
    }

    function repay_time(v){
        if(isNaN(v) || v==0){
            return '';
        }else{
            return getLocalTime(v);
        }
    }

    function getLocalTime(tm) {
        var t = Ext.Date.format(new Date(parseInt(tm) * 1000),'Y-m-d H:i:s');
        return t;
    }

    function in_status_data(v, metaData, r){
        if(v == undefined){
            return '';
        }else{
            var w_min_limit = r.get('w_min_limit') > 0 ? r.get('w_min_limit') : 500;
            var tip_str = '该账单生成时的最低提现额度为'+w_min_limit+'元';
            switch(v){
                case '处理中':metaData.tdAttr = 'data-qtip="'+tip_str+'"';break;
                case '已提现':metaData.tdAttr = 'data-qtip="'+tip_str+'"';break;
                case '已失败':metaData.tdAttr = 'data-qtip="'+tip_str+'"';break;
                case '已撤销':metaData.tdAttr = 'data-qtip="'+tip_str+'"';break;
                case '已合并':metaData.tdAttr = 'data-qtip="'+tip_str+'"';break;
            }
            return '<div style="width:52px;border-radius:3px;padding:2px 5px;color:#fff;background-color: '+status_color[v]+'">'+v+'</div>';
        }
    };

    function yesterday(){
        var time=new Date();
        time.setTime(time.getTime()-24*60*60*1000);
        return Ext.util.Format.date(time,'Y-m-d');
    }

});