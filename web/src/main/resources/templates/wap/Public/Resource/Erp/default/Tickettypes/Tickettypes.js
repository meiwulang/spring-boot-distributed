var ROW = {};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    window.org_id = top._uinfo.u_jgid;
    window.pageSize = top._uinfo.u_setup.pageSize ? top._uinfo.u_setup.pageSize : $app_page_size;
    var thisTitle = '票种管理';

    var url = $__app__ + '/Tickettypes/dataJson';
    var field = [
        {name:"tt_id"},
        {name:"tt_num"},
        {name:"tt_name"},
        {name:"tt_short"},
        {name:"tt_pym"},
        {name:"tt_status"},
        {name:"tt_time"}
    ];
    var store = new SUNLINE.JsonStore(url, field);
    //store.baseParams = {tt_id:0};

    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有票种信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID号", dataIndex:"tt_id", width:10, hidden:true},
            {header:"编号", dataIndex:"tt_num", width:100},
            {header:"名称", dataIndex:"tt_name", width:250},
            {header:"简称", dataIndex:"tt_short", width:200},
            {header:"编辑时间", dataIndex:"tt_time", width:150}
        ],
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:dodelete},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                store.load();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                emptyText:'编号、名称、简称等',
                width:150,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function(_t, _e){
                        if (_e.keyCode==13)
                            dosearch();
                    }
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载'+ thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'close.gif',
                cls: 'x-btn-icon',
                tooltip: getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();
            }
        }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有数据'
        })
    });


    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:60,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"tt_id", name:"tt_id", fieldLabel:"ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"tt_num", name:"tt_num", fieldLabel:"编号", maxLength:"20",allowBlank:false},
            {id:"tt_name", name:"tt_name", fieldLabel:"名称", maxLength:"50",allowBlank:false},
            {id:"tt_short", name:"tt_short", fieldLabel:"简称", maxLength:"30"}
        ]
    });

    var win = new Ext.Window({
        width:400,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    function modify(b) {
        if (b.text == '添加') {
            ROW.data = {};
        }
        else if (b.text == '编辑') {
            var row = grid.getSelectionModel().getSelected();
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要编辑的票种信息');
                return;
            }
            ROW.data = row.data;
        }
        win.setTitle(b.text + '票种信息');
        win.show(b.id);
    }

    win.on('show', function (w) {
        var f = form.getForm();
        f.reset();
        f.setValues(ROW.data);
    });

    function dosave() {
        var s = form.getForm().getValues();
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '请填写票种信息');
            return;
        }
        var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
        mask.show();

        Ext.Ajax.request({
            url:$__app__ + '/Tickettypes/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    var id = parseInt(result.info);
                    if (!isNaN(id)){
                        msg = msg.substring(id.toString().length);
                        s.tt_id = id;
                        s.tt_time = (new Date()).format('Y-m-d H:i:s');
                        if(s.tt_short==""){
                            s.tt_short = s.tt_name;
                        }

                        store.add(new Ext.data.Record(s));
                    }else{
                        var row = grid.getSelectionModel().getSelected();
                        row.set('tt_time', (new Date()).format('Y-m-d H:i:s'));
                        ChangeRowData(row, s, store);
                        store.commitChanges();
                    }
                    win.hide();
                }
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '操作失败');
            }
        })
    }

    function dodelete() {
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要删除的票种信息');
            return;
        }
        Ext.MessageBox.confirm('友情提示', '确定删除票种信息？', callBack);
        function callBack(id) {
            if (id == 'yes') {
                var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在删除，请稍后...'});
                mask.show();
                var s = row.data;
                Ext.Ajax.request({
                    url:$__app__ + '/Tickettypes/del',
                    params:{tt_id:s.tt_id},
                    method:'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            grid.store.remove(grid.getSelectionModel().getSelected());
                        }
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '操作失败');
                    }
                })
            }
        }
    }

    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        store['baseParams'] = {skey:skey};
        store.load({params:{start:0, limit:pageSize}});
    }

    new Ext.Viewport({
        layout:'border',
        items:[grid]
    });
});


