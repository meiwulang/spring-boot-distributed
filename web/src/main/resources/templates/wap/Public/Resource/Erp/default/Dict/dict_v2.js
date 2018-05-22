/**
 * Created by sunline on 2017-02-02.
 */

var GROUP_DATA={};

Ext.define('DictModel', {
    extend: 'Ext.data.TreeModel',
    fields: [
        {name: 'd_text', type: 'string'},
        {name: 'd_display', type: 'int'},
        {name: 'd_hot', type: 'int'},
        {name: 'd_recommend', type: 'int'},
        {name: 'd_order', type: 'int'},
        {name: 'd_extend',     type: 'string'}
    ]
});

Ext.onReady(function() {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '字典管理';

    ///////////////////////////    字典分组     //////////////////////////////
    var g_store = SUNLINE.JsonStore($__app__ + '/Dict/group', []);
    g_store.on('load', function () {
        store.loadData({text:'.', children:[]}); //清空关键词列表
        GROUP_DATA = null; //清空当前分组的赋值
    });

    var g_cm = [
        new Ext.grid.RowNumberer({width:45}),
        { text: '分组名称',  dataIndex: 'd_text', width:210, renderer:function (v, m, r) {
            var icon = (r.get('d_recommend')== 0) ? 'fa-lock' : 'fa-unlock';
            return '<i class="fa '+ icon +'"></i> ' + v;
        } }
    ];

    //字典分组操作按扭组，只有“管理公司”权限角色才能操作
    var dictGroup = null ;
    if (_uinfo.org_type == '管理公司') {
        dictGroup = {
            text: '<i class="fa fa-bars"></i>', menu: {
                items: [
                    '<div style="text-align: center;">字典分组</div>', '-',
                    {text: '添加', handler: group_modify, act: 'add'},
                    {text: '编辑', handler: group_modify, act: 'edit'},
                    {text: '删除', handler: group_del, act: 'del'}
                ]
            }
        }
    }

    var group_grid = Ext.create('Ext.grid.Panel', {
        region:'west',
        width : 280,
        maxWidth: 480,
        minWidth: 280,
        store : g_store,
        columns : g_cm,
        split : true,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar : [
            {xtype:'trigger', triggerCls : 'x-form-search-trigger', id:'g_search', width:150,
                emptyText : '分组名称',
                onTriggerClick:function(e){ doSearch();},
                listeners :{"specialkey" : function(_t, _e){ if(_e.keyCode==13) doSearch(); }}
            },
            {text:'<i class="fa fa-refresh"></i>', tooltip:'刷新', handler:function (b) { g_store.reload(); } },
            '->',
            dictGroup,
        ],
        bbar : new Ext.PagingToolbar({
            pageSize: 20,
            store: g_store,
            displayInfo: true,
            beforePageText : '',
            afterPageText : '/{0}',
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    group_grid.on('select', function (g, r, i, e) {
        var d = r.data;
        GROUP_DATA = d;
        SUNLINE.baseParams(store, {d_type: d.d_text});
        store.load();
    });

    function doSearch() {
        var gs = Ext.getCmp('g_search'), skey=gs.getValue();
        SUNLINE.baseParams( g_store, {skey:skey} );
        g_store.currentPage=1;
        g_store.load();
    }

    function group_modify(b){
        var title = '字典分组', title_pre='添加', fv={d_text:"",d_recommend:0,d_order:0};
        if (b.act == 'edit'){
            var row = SUNLINE.getSelected(group_grid);
            if (!row) return ExtAlert('请选择需要编辑的字典分组。');
            title_pre='编辑';
            row.data.is_add = '1';
            fv = row.data;
        }else{
            fv.is_add = 0;
        }
        console.log(fv);
        group_win.setTitle(title_pre + title);
        group_win.show(b.id);
        group_form.getForm().setValues(fv);
    }


    /**
     * 字典分组删除
     */
    function group_del(b) {
        var row = SUNLINE.getSelected(group_grid);
        if (!row) {
            return ExtAlert('请选择想要删除的字典分组。', '提示');
        }

        var myMask = SUNLINE.LoadMask('字典分组删除中，请稍候...');
        myMask.show();

        Ext.Ajax.request({
            url: $__app__ + '/Dict/typeDel',
            params: {d_text: row.data.d_text},
            success: function (response) {
                var res = Ext.decode(response.responseText);
                if (res == 1) {
                    ExtAlert('数据删除成功', '提示');
                    g_store.reload();
                } else {
                    ExtAlert('数据删除失败', '提示');
                }
                myMask.hide();
            }
        });
    }

    /**
     * 字典值删除
     * @param b
     */
    function dictDel(_this) {
        var row = SUNLINE.getSelected(tree_grid);
        if (!row) {
            return ExtAlert('请选择想要删除的字典值!', '提示');
        }
        var myMask = SUNLINE.LoadMask('数据删除中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__ + '/Dict/delete',
            params: {d_text: row.data.d_text, d_type: row.data.d_type, d_group: row.data.d_group},
            success: function (response) {
                var res = Ext.decode(response.responseText);
                if (res == 1) {
                    ExtAlert('数据删除成功', '提示');
                    store.reload();
                } else {
                    ExtAlert('数据删除失败', '提示');
                }
                myMask.hide();
            }
        });
    }

    var group_form = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right', hideEmptyLabel: false },
        defaultType : 'textfield',
        flex : 1,
        items : [
            {xtype:'hidden', name:'d_id'},
            {xtype:'hidden', name:'is_add'},
            {fieldLabel: '分组名称', name:'d_text', allowBlank:false },
            {fieldLabel: '级别', boxLabel:'非系统级（允许用户自行管理）',name:'d_recommend', inputValue:1, id:'recom0', xtype:'radiofield'},
            {boxLabel:'系统级（仅管理公司可管理）',name:'d_recommend', inputValue:0, id:'recom1', xtype:'radiofield'},
            {fieldLabel: '排序', name:'d_order', value:0, xtype:'numberfield', minValue:0 }
        ]
    });

    var group_win = Ext.create('Ext.Window', {
        title : '',
        width : 500,
        autoHeight : true,
        items : group_form,
        modal:true,
        closeAction : 'hide',
        buttons : [
            {text:'Values', handler:function(){showFormValues(group_form);}},
            {text:'保存', handler:group_save},
            {text:'关闭', handler:function(){ group_win.hide();}}
        ]
    });

    function group_save() {
        var f = group_form.getForm(), fv;
        if (!f.isValid()) return ExtAlert('请正确填写字典分组信息。');
        fv=f.getValues();
        console.log(fv);
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Dict/group_save',
            params: fv,
            success: function(response, opt){
                var r = Ext.decode(response.responseText);
                ExtAlert(r.info.msg);
                if(r.status){
                    group_win.hide();
                    //g_store.reload();
                    g_store.reload();
                }
                myMask.hide();
            }
        });
    }



    ///////////////////////////    字典内容     //////////////////////////////
    var store = Ext.create('Ext.data.TreeStore', {
        model: 'DictModel',
        autoLoad : false,
        proxy: {
            type: 'ajax',
            url: $__app__ + '/Dict/tree_data',
            actionMethods:{
                create:'POST',
                read:'POST',
                update:'POST',
                destroy:'POST'
            }
        },
        folderSort: true
    });

    function d_text(v, m, r) {
        var org_id = r.get('d_org_id');
        var color = (org_id==0 || org_id==1) ? 'blue' : '#000';
        return '<span style="color:'+ color +'">' + v + '</span>';
    }

    var tree_grid = Ext.create('Ext.tree.Panel', {
        region : 'center',
        tbar : [
            {text:'添加', handler:modify, act:'add'},
            {text:'编辑', id:'dict_edit', handler:modify, act:'edit'},
            {text:'删除', id:'dict_del', handler:dictDel, act:'del'},
            {text:'刷新', handler:function () { store.reload(); }}
        ],
        useArrows: true,
        rootVisible: false,
        singleExpand : true,
        store: store,
        root: {
            text: "Dict root node",
            expanded: true,
            children: [ ]
        },
        columns: [
            { text: '关键词', xtype: 'treecolumn', width: 240, sortable: true, dataIndex: 'd_text', locked: true, renderer:d_text },
            { text: '前台显示',  dataIndex: 'd_display', renderer:function(v){ return (v==0) ? '隐藏':'显示'; } },
            { text: '热门',  dataIndex: 'd_hot', renderer:function(v){ return (v==0) ? '一般' : '热门'; }},
            { text: '推荐',  dataIndex: 'd_recommend', renderer:function(v){ return (v==0) ? '一般' : '推荐'; } },
            { text: '排序',  dataIndex: 'd_order' },
            { text: '扩展',  dataIndex: 'd_extend', width:150 }
            /*{
            //we must use the templateheader component so we can use a custom tpl
            //xtype: 'templatecolumn',
            text: 'Duration',
            width: 150,
            sortable: true,
            dataIndex: 'duration',
            align: 'center',
            //add in the custom tpl for the rows
            tpl: Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                formatHours: function(v) {
                    if (v < 1) {
                        return Math.round(v * 60) + ' mins';
                    } else if (Math.floor(v) !== v) {
                        var min = v - Math.floor(v);
                        return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                    } else {
                        return v + ' hour' + (v === 1 ? '' : 's');
                    }
                }
            })
        }, {
            text: 'Assigned To',
            width: 150,
            dataIndex: 'user',
            sortable: true
        }, {
            xtype: 'checkcolumn',
            header: 'Done',
            dataIndex: 'done',
            width: 40,
            stopSelection: false
        }, {
            text: 'Edit',
            width: 40,
            menuDisabled: true,
            xtype: 'actioncolumn',
            tooltip: 'Edit task',
            align: 'center',
            icon: '../simple-tasks/resources/images/edit_task.png',
            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : '') , record.get('task'));
            },
            // Only leaf level tasks may be edited
            isDisabled: function(view, rowIdx, colIdx, item, record) {
                return !record.data.leaf;
            }
        }*/
            ]
    });

    var dict_edit, dict_del;
    tree_grid.on('select', function (t, r, i, o) {
        if (_uinfo.u_org_id != 1) {
            if (!dict_edit) dict_edit = Ext.getCmp('dict_edit');
            if (!dict_del) dict_del = Ext.getCmp('dict_del');
            var org = r.get('d_org_id'), isMe = (org=='0' ||org=='1');
            dict_edit.setDisabled( isMe );
            dict_del.setDisabled( isMe );
        }
    })

    var boxTpl = Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{_split}{d_text}</li>',
        '</tpl></ul>'
    );
    var d_type_store = SUNLINE.JsonStore($__app__+'/Dict/parent', [], false), d_type_store_is_loaded = false,
        d_type_conf = {name : 'd_type', store : d_type_store, fieldLabel : '上级关键词', loadingText:'正在加载上级关键词',
        minChars:2, queryDelay:300, allQuery : '', queryParam:'skey', triggerAction:'all', valueField:'d_text',
        displayField:'d_text', mode:'remote', typeAhead:true, tpl: boxTpl, allowBlank:false, editable:false},
        d_type_combox = Ext.create('Ext.form.ComboBox', d_type_conf);
    d_type_store.on('load', function (s) { d_type_store_is_loaded = true; });

    var _form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right', hideEmptyLabel: false },
        defaultType : 'textfield',
        flex : 1,
        items : [
            {xtype:'hidden', name:'d_id'},
            {xtype:'hidden', name:'d_group'},
            {xtype:'hidden', name:'d_org_id'},
            {fieldLabel: '关键词', name:'d_text', allowBlank:false },
            //{fieldLabel: '上级关键词', name:'d_type', xtype:'combo' },
            d_type_combox,
            {fieldLabel: '排序', name:'d_order', value:0, xtype:'numberfield', minValue:0 },
            {xtype: 'radiogroup', fieldLabel: '前台显示',
                items: [
                    {boxLabel: '显示', name: 'd_display', inputValue: 1, checked:true},
                    {boxLabel: '隐藏', name: 'd_display', inputValue: 0}
                ]
            },
            {xtype: 'radiogroup', fieldLabel: '热门',
                items: [
                    {boxLabel: '热门', name: 'd_hot', inputValue: 1},
                    {boxLabel: '一般', name: 'd_hot', inputValue: 0, checked:true}
                ]
            },
            {xtype: 'radiogroup', fieldLabel: '推荐',
                items: [
                    {boxLabel: '推荐', name: 'd_recommend', inputValue: 1},
                    {boxLabel: '一般', name: 'd_recommend', inputValue: 0, checked:true}
                ]
            },
            {fieldLabel:'扩展', name:'d_extend', xtype:'textarea'},
            {xtype:'displayfield', value:'请按JSON格式填写扩展内容。'}
        ]
    });

    var _win;
    function modify(b) {
        if (!GROUP_DATA) return ExtAlert('请先选择字典分组。');
        if (!_win) _win = Ext.create('Ext.Window', {
            title : 'DICT',
            width : 500,
            autoHeight : true,
            closeAction : 'hide',
            items : _form,
            modal:true,
            buttons : [
                {text:'Values', handler:function(){showFormValues(_form);}},
                {text:'保存', handler:do_save},
                {text:'关闭', handler:function(){ _win.hide();}}
            ]
        });
        var fv = {d_id:'',d_org_id:_uinfo.u_org_id, d_group:GROUP_DATA['d_text'],d_text:'',d_type:GROUP_DATA['d_text'],d_display:1,d_hot:0, d_recommend:0, d_order:0, d_extend:''},
            title_pre = '添加',
            params = {d_group:GROUP_DATA.d_text};
        if ( b.act == 'edit' ){
            var row = SUNLINE.getSelected(tree_grid);
            if (!row) return ExtAlert('请选择您想编辑的关键词。');
            title_pre = '编辑';
            fv = row.data;
            params['d_id'] = row.data.d_id;
        }
        //console.log(params);
        SUNLINE.baseParams(d_type_store, params);
        if ( d_type_store_is_loaded ) { d_type_store.load(); }
        _form.getForm().setValues(fv);
        _win.setTitle(title_pre  + '关键词');
        _win.show();
    }


    function do_save() {
        var f = _form.getForm();
        if (!f.isValid()) return ExtAlert('请正确填写关键词信息。');
        var fv=f.getValues();
        console.log(fv);
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Dict/do_save',
            params: fv,
            success: function(response, opt){
                var r = Ext.decode(response.responseText);
                ExtAlert(r);
                if(r.status){
                    _win.hide();
                    store.reload();
                    f.reset();
                }
                myMask.hide();
            },
            failure: function(response, opts) {
                myMask.hide();
                ExtAlert('服务器端故障状态码：' + response.status);
            }
        });

    }

    new Ext.Viewport({
        layout:'border',
        items:[group_grid,tree_grid]
    })

});
