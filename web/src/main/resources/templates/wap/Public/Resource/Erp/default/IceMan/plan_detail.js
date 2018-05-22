var ROW = {};
GUIDE_WORK = {};
var WG={};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '紧急联系人管理';

    var ice_url = $__app__ + '/IceMan/plan_json';
    var ice_field = [{name:"tpl_id"},{name:"tpl_name"},{name:"tpl_detail"}];
    var ice_store = new SUNLINE.JsonStore(ice_url, ice_field);

    var ice_cm =[
        new Ext.grid.RowNumberer(),
        {header:"tpl_id", dataIndex:"tpl_id", width:50, hidden:true},
        {header:"模板名称", dataIndex:"tpl_name", width:150},
        {header:"模板内容", dataIndex:"tpl_detail", width:500,renderer:function(v){
            return '<span title="'+v+'">'+v+'</span>';
        }}
    ];
    var ice_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:ice_cm,
        store:ice_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有模板信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:del},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                ice_store.reload();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'紧急联系人、职位',
                width:200,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            dosearch();
                    }
                }
            }
        ]
    });

    var ice_form= new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'100%',xtype:'textfield',labelWidth:60,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {fieldLabel:"tpl_id", name:"tpl_id",hidden:true},
            {fieldLabel:"模板名称", name:"tpl_name", allowBlank:false},
            {fieldLabel:"模板明细",xtype:'textarea', name:"tpl_detail", allowBlank:false,height:350}
        ]
    });
    var win = new Ext.Window({
        width:700,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:ice_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    function dosave() {
        if (!ice_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = ice_form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/IceMan/detail_save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ice_store.reload();
                    win.hide();
                };
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };

    //搜索框查询
    function dosearch(){
        var key=Ext.getCmp('search').getValue();
        SUNLINE.baseParams(ice_store,{skey:key});
        ice_store.currentPage=1;
        ice_store.load();
    }

    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(ice_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            win.show();
            ice_form.getForm().setValues(row.data);
        }else{
            win.show();
        }
        win.setTitle(v.text+"出团计划单说明模板", v.iconCls);
    }

    win.on('hide',function(){
        ice_form.getForm().reset();
    })

    //删除
    function del(){
        var row=SUNLINE.getSelected(ice_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }
        Ext.Msg.confirm('友情提示','你确定删除【'+row.get('tpl_name')+'】吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/IceMan/detail_del',
                    method : 'POST',
                    params : { tpl_id :row.data.tpl_id},
                    success : function(response, opts){
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            ice_store.reload();
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
        items : [ice_grid]
    });





});
