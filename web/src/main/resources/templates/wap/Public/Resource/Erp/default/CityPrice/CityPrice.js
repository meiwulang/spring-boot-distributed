Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '城市接送价格管理';

    var cp_url = $__app__ + '/CityPrice/dataJson';
    var cp_field = [
        {name:"cp_id"},
        {name:"cp_province"},
        {name:"cp_city"},
        {name:"cp_price"},
        {name:"cp_time"},
        {name:"cp_status"},
        {name:"cp_user_id"},
        {name:"cp_user_name"}
    ];
    var cp_store=SUNLINE.GroupingStore(cp_url,cp_field,{sortInfo:{field:'cp_id',direction: "DESC"}, groupField:'org_name'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "分公司: {name} (共 {[values.rows.length]} 条)"
    });
    var cp_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"cp_id", dataIndex:"cp_id", width:50, hidden:true},
        {header:"cp_bc_id", dataIndex:"cp_bc_id", width:50, hidden:true},
        {header:"城市名称", dataIndex:"cp_city", width:150},
        {header:"城市接送价格", dataIndex:"cp_price", width:150},
        {header:"添加用户", dataIndex:"cp_user_name", width:150}
    ];
    var cp_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:cp_cm,
        store:cp_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有城市接送价格信息',
            deferEmptyText:true
        },
        features: [groupingFeature],
        tbar:[
            {text:'编辑', iconCls:'button-edit',handler:modify, disabled:isDisabled('CityPrice::save')},
            '-',
            /*{text:'删除', iconCls:'button-del',handler:del},
            '-',*/
            {text:'刷新', iconCls:'button-ref',handler:function () {
                cp_store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'cp_search',
                cls:'search-icon-cls',
                emptyText:'城市名称',
                width:150,
                onTriggerClick:function (e) {
                    cp_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            cp_dosearch();
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
            store:cp_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有城市接送价格管理信息'
        })
    });



    //搜索框查询
    function cp_dosearch(){
        var key=Ext.getCmp('cp_search').getValue();
        SUNLINE.baseParams(cp_store,{skey:key});
        cp_store.currentPage=1;
        cp_store.load();
    }


    var bc_form= new Ext.form.FormPanel({
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
                    {id:"cp_id", name:"cp_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"cp_bc_id", name:"cp_bc_id", fieldLabel:"cp_bc_id", maxLength:"10",xtype:"hidden"},
                    {id:"org_name_id", name:"org_name", fieldLabel:"分公司名称", maxLength:"50", allowBlank:false},
                    {id:"cp_city_id", name:"cp_city", fieldLabel:"城市名称", maxLength:"50", allowBlank:false},
                    {id:"cp_price", name:"cp_price", fieldLabel:"城市接送价格", maxLength:"50", allowBlank:false}
                ]
            }
        ]
    });
    Ext.getCmp('cp_city_id').setReadOnly(true);
    Ext.getCmp('org_name_id').setReadOnly(true);
    bc_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:bc_form,
        buttons:[
            {text:'保存', handler:bc_dosave},
            {text:'关闭', handler:function () {
                bc_win.hide();
            }}
        ]
    })
    bc_win.on('hide',function(){
        bc_form.getForm().reset();
    })
    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(cp_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            bc_win.show();
            bc_form.getForm().setValues(row.data);
        }
        bc_win.setTitle(v.text+"城市接送价格信息", v.iconCls);
    }
    function bc_dosave(){
        if (!bc_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var data = bc_form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/CityPrice/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    cp_store.reload();
                    bc_win.hide();
                };
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }



    //删除
    function del(){
        var row=SUNLINE.getSelected(cp_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }

        var id = row.get('cp_id'), cp_name = row.get('cp_city');
        Ext.Msg.confirm('友情提示','你确定删除'+cp_name+'吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/CityPrice/del',
                    method : 'POST',
                    params : { cp_id :id},
                    success : function(response, opts){
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            cp_store.reload();
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }
    ziyo_log({ listeners : [{grid: cp_grid, action:'CityPrice', pk_id:'cp_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [cp_grid]
    });





});
