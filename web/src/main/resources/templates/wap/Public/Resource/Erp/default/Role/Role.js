ROLE = {};
var WG={};
Ext.onReady(function(){
	Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
	Ext.QuickTips.init();
    window.org_id = top._uinfo.org_id;
    window.org_name = top._uinfo.org_name;
    window.isSystem = (top._uinfo.u_dj == '中心级');
    window.r_id = '';
    window.all_chose = false;
	var thisTitle = '角色权限管理';
	var role_storeUrl = $__app__ + '/Role/dataJson';
	var role_field   = ["r_id","r_org","r_bh","r_name","org_name","r_px","r_info","r_zt"];
    var role_store=SUNLINE.JsonStore(role_storeUrl,role_field,false);
    SUNLINE.baseParams(role_store,{r_org:_uinfo.org_id});
    role_store.load();
    var role_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {"header":"ID","dataIndex":"r_id","width":50, hidden:true},
        {"header":"角色编号","dataIndex":"r_bh","width":80},
        {"header":"角色名称","dataIndex":"r_name","width":200},
        {"header":"排序","dataIndex":"r_px","width":50},
        {"header":"所属单位","dataIndex":"org_name","width":150, hidden:true},
        {"header":"备注说明","dataIndex":"r_info","width":500}
    ];

    var role_grid = new Ext.grid.GridPanel({
        region : 'west',
        split : true,
        width : 450,
        minWidth : 400,
        maxWidth : 500,
        style:'border-top:1px solid #dddddd',
        loadMask: {msg : '数据传输中，请稍候...'},//导入时显示loading
        store: role_store,//数据源
        columns:role_cm,//表格列定义
        viewConfig : {emptyText: '暂无角色权限信息。'},
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: role_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    var role_panel=new Ext.panel.Panel({
        region:'center',
        style:'border-top:1px solid #dddddd',
        html:'<iframe width="100%" height="100%" id="ifm_role" name="ifm_role" src="'+$__app__+'/Role/role_list" frameborder="0"></iframe>'
    });
    var company_box=SUNLINE.CompanyBox();
    if(_uinfo.org_type=='管理公司' && _uinfo.org_pid==0){
        company_box.store.on({
            load:function(){
                company_box.store.add({id:-1,text:'顶级单位'});
                company_box.store.sort({property : 'id',direction: 'ASC'});
            }
        });
    }

    var _panel = new Ext.Panel({
        border : false,
        region : 'center',
        layout : 'border',
        tbar: [
            {text:'添加',act:'add',iconCls:'button-add', id:'role_add_btn', disabled:isDisabled('Role::add'), handler:modify},
            {text:'编辑',act:'edit',iconCls:'button-edit', disabled:isDisabled('Role::edit'), handler:modify},
            {text:'删除',iconCls:'button-del', disabled:isDisabled('Role::delete'), handler:del},
            {text:'刷新',iconCls:'button-ref',handler:function(){role_store.reload()}},
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}, //,handler:_ziyo_log
            company_box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'role_Search',
                emptyText : '编号、角色名称等',
                width:150,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            dosearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            },{
                icon: $app_public_images_path + 'close.gif',
                cls: 'x-btn-icon',
                tooltip: getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            }
        ],
        items : [role_grid, role_panel]
    });

    company_box.on('select',function(c,r){
        var row= r[0];
        SUNLINE.baseParams(role_store,{r_org:row.get('id')});
        window.org_id=row.get('id');
        role_store.load();
    });

    //搜索框查询
    function dosearch(){
        var key=Ext.getCmp('role_Search').getValue();
        role_store.load({params:{skey:key}});
    }

    var form = new Ext.form.FormPanel({
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
                defaults:{ width:260 },
                items:[
                    {id:"r_id", name:"r_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"r_org", name:"r_org", fieldLabel:"单位ID", maxLength:"10",xtype:"hidden"},
                    {id:"r_bh", name:"r_bh", fieldLabel:"角色编号", maxLength:"10",allowBlank:false},
                    {id:"r_name", name:"r_name", fieldLabel:"角色名称", maxLength:"10",allowBlank:false},
                    {id:"r_px", name:"r_px", fieldLabel:"排序", maxLength:"10",allowBlank:false}
                ]
            },{
                columnWidth:1,
                items:[{id:"r_info", name:"r_info", fieldLabel:"备注说明", maxLength:"500", xtype:'textarea',width:"260"}]
            }
        ]
    });

    var win = new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });


    //添加
    function modify(v){
        var f_id=form.getForm();
        f_id.reset();
        if(v.text=='添加'){
            WG.values={
                r_org:window.org_id
            };
        }else{
            var row=SUNLINE.getSelected(role_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择要编辑的角色权限信息');
                return;
            }
            WG.values=row.data;
            form.getForm().setValues(WG.values);
        }
        form.getForm().setValues(WG.values);
        win.setTitle(v.text+"角色权限信息", v.iconCls);
        win.show();
    }

    function dosave() {
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/Role/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    role_store.reload();
                    win.hide();
                }
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };

    //删除
    function del(){
        var row=SUNLINE.getSelected(role_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }

        var id = row.get('r_id');

        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Role/save',
                    method : 'POST',
                    params : { r_id :id,r_zt:'del'},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功');
                        role_store.reload();
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
        items : [_panel]
    });

    role_grid.getSelectionModel().on('select',function(t,r){
        var row= r;
        var url = $__app__ + '/Role/role_list?_dc=' + time()+'&id='+row.get('r_id');
        window.ifm_role.location = url;
    });

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: role_grid, action:'Role', table:'Role', pk_id:'r_id'}] });

});