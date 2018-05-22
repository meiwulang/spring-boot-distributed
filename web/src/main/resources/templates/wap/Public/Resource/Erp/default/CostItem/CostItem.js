Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '成本项目管理';

    var ci_url = $__app__ + '/CostItem/dataJson';
    var ci_field = [
        {name:"ci_id"},
        {name:"ci_name"},
        {name:"ci_price"},
        {name:"ci_trade_price"},
        {name:"ci_time"},
        {name:"ci_status"},
        {name:"ci_user_id"},
        {name:"ci_user_name"},
        {name:"ci_bc_id"},
        {name:"ci_bc_name"}
    ];
    var ci_store=SUNLINE.GroupingStore(ci_url,ci_field,{sortInfo:{field:'ci_id',direction: "DESC"}, groupField:'org_name'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "分公司名称:{name} (共 {[values.rows.length]} 条)"
    });
    var ci_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID", dataIndex:"cp_id", width:50, hidden:true},
        {header:"ci_user_id", dataIndex:"ci_user_id", width:50, hidden:true},
        {header:"ci_bc_id", dataIndex:"ci_bc_id", width:50, hidden:true},
        {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
        {header:"org_name", dataIndex:"org_name", width:50, hidden:true},
        {header:"成本项目名称", dataIndex:"ci_name", width:200},
        {header:"添加用户", dataIndex:"ci_user_name", width:200}
    ];
    var ci_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:ci_cm,
        store:ci_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目信息',
            deferEmptyText:true
        },
        features: [groupingFeature],
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify, disabled:isDisabled('CostItem::save')},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify, disabled:isDisabled('CostItem::save')},
            '-',
            {text:'删除', iconCls:'button-del', handler:del, disabled:isDisabled('CostItem::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                ci_store.reload();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'ci_search',
                cls:'search-icon-cls',
                emptyText:'成本项目名称',
                width:150,
                onTriggerClick:function (e) {
                    ci_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            ci_dosearch();
                    }
                }
            },
            '-',
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
            store:ci_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有成本项目信息'
        })
    });



    //搜索框查询
    function ci_dosearch(){
        var key=Ext.getCmp('ci_search').getValue();
        SUNLINE.baseParams(ci_store,{skey:key});
        ci_store.currentPage=1;
        ci_store.load();
    }
    var bc_url = $__app__ + '/Company/dataJson';
    var bc_field = [
        {name:"bc_id"},
        {name:"bc_name"},
        {name:"bc_province"},
        {name:"bc_city"},
        {name:"bc_county"},
        {name:"bc_apply_city"},
        {name:"bc_time"},
        {name:"bc_status"}
    ];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field,false);
    var ci_bc_store = new Ext.form.ComboBox({
        width:210,
        labelAlign:"right",
        labelWidth:70,
        name:'org_id',
        id:'org_id_idd',
        allowBlank : false,
        hiddenName:'org_id',
        fieldLabel:"公司名称",
        store: bc_store,
        displayField:'org_name',
        valueField:"org_id",
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all'
    });

    var ci_from= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {id:"ci_id", name:"ci_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"ci_user_id", name:"ci_user_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"ci_bc_id", name:"ci_bc_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"org_id", name:"org_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    ci_bc_store,
                    {id:"ci_name", name:"ci_name", fieldLabel:"成本项目", maxLength:"50", allowBlank:false,vtype:'NotBlank'}
                ]
            }
        ]
    });
    ci_bc_store.on({'select':function(c,r,n){
        var data={
            ci_bc_id:r[0].get('bc_id')
        }
        ci_from.getForm().setValues(data);
    }});
    bc_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:ci_from,
        buttons:[
            {text:'保存', handler:bc_dosave},
            {text:'关闭', handler:function () {
                bc_win.hide();
            }}
        ]
    })
    bc_win.on('hide',function(){
        ci_from.getForm().reset();
    })
    //添加-修改方法
    function modify(v){
        SUNLINE.baseParams(bc_store,{org_status:'通过',org_zt:'ok',org_type:'管理公司'});
        bc_store.currentPage=1;
        bc_store.load();
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(ci_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            bc_win.show();
            ci_from.getForm().setValues(row.data);
            Ext.getCmp('org_id_idd').setValue(row.data.ci_bc_id)
        }else{
            bc_win.show();
        }
        bc_win.setTitle(v.text+"成本项目信息", v.iconCls);
    }
    function bc_dosave(){
        if (!ci_from.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var data = ci_from.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/CostItem/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ci_store.reload();
                    bc_win.hide();
                };

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }



    //删除
    function del(){
        var row=SUNLINE.getSelected(ci_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }
        /*if(row.data.ci_name=='毛利'){
            Ext.Msg.alert('友情提示','毛利是不能删除的！');
            return;
        }*/
        var id = row.get('ci_id'), cp_name = row.get('ci_name');
        Ext.Msg.confirm('友情提示','你确定删除'+cp_name+'吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/CostItem/del',
                    method : 'POST',
                    params : { ci_id :id},
                    success : function(response, opts){
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            ci_store.reload();
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }


    new Ext.Viewport({
        layout : 'border',
        items : [ci_grid]
    });





});
