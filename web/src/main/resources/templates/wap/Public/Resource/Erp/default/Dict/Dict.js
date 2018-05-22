/**
 * Created by Administrator on 15-12-7.
 */

var ROW={};
var form_text = '';
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '字典管理';
    var url=$__app__+'/Dict/dataJson';
    var store=SUNLINE.JsonStore(url,[],false);
    var cm=[
        new Ext.grid.RowNumberer(),
        { text: '名称',  dataIndex: 'd_text' },
        { text: '类型',  dataIndex: 'd_type' },
        { text: '拼音码',  dataIndex: 'd_pym' },
        { text: '扩展',  dataIndex: 'd_extend' },
        { text: '排序',  dataIndex: 'd_order' },
        { text: '前台显示',  dataIndex: 'd_display', renderer:function(v){
            if(v==0){
                return '不显示';
            }else{
                return '显示';
            }
        } },
        { text: '热门',  dataIndex: 'd_hot', renderer:function(v){
            if(v==0){
                return '非热门';
            }else{
                return '热门';
            }
        }},
        { text: '推荐',  dataIndex: 'd_recommend', renderer:function(v){
            if(v==0){
                return '不推荐';
            }else{
                return '推荐';
            }
        } }
    ]
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {text:'添加',iconCls:'button-add',handler:modify,disabled:isDisabled('Dict::add')},
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Dict::edit')},
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Dict::delete')},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                if(form_text == ''){
                    Ext.Msg.alert('友情提醒','请先选择左边的分组！');
                    return false;
                }else{
                    store.reload();
                }
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerClass : 'x-form-search-trigger',
                id:'dict_Search',
                emptyText : '名称、拼音简称等',
                width:150,
                onTriggerClick:function(e){
                    dictSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            dictSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    })

    function dictSearch(){
        if(form_text=='所有分组'){
            form_text = '';
        }
        var skey = Ext.getCmp('dict_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey,d_type:form_text});
        store.currentPage =1;
        store.load();
        //store.load({params:{skey:skey}})
    }

    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Dict/treeJson'
        },
        root: {
            expanded: true,
            text:'所有分组',
            children:'children'
        },
        listeners:{
            prefetch:function(t,r,s,g){
                console.log(t);
                console.log(r);
                console.log(s);
                console.log(g);
            }
        }
    });
    var load_bool=true;
    var tbar=['<b>字典类目</b>']
    if(_uinfo.org_type=='管理公司'){
        tbar=[
            {text:'添加分组',iconCls:'button-add',handler:function(){
                winTyle.show();
            }},
            {text:'删除',iconCls:'button-del'/*,disabled:true*/},
            {text:'刷新',iconCls:'button-ref', handler:function(){
                if(load_bool){
                    load_bool=false;
                    tree_store.load();
                }

            }}
        ];
    }
    var tree=Ext.create('Ext.tree.Panel',{
        region:'west',
        minWidth : 240,
        maxWidth : 350,
        width:260,
        store: tree_store,
        bodyBorder:true,
        split : true,
        border:false,
        tbar:tbar,
        rootVisible: true
    })
    tree.on('afteritemexpand',function(){
        load_bool=true;
    });

    var recommend_box=SUNLINE.LocalComob({
        id:'d_recommend',
        fields:['text'],
        data:[{text:'系统级'},{text:'公共级'}],
        config:{
            fieldLabel:'分组类型',
            editable:false,
            valueField:'text',
            displayField:'text',
            id:'d_recommend',
            name:'d_recommend',
            labelWidth:60,
            labelAlign:'right',
            value:'系统级'
        }
    });

    var formType=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/Dict/add_type',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        defaultType: 'textfield',
        items: [
            {labelWidth:60,fieldLabel: '类型名称',labelAlign:'right',name: 'text',allowBlank: false},
            recommend_box
        ],
        buttons: [{
            text: '重置',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }, {
            text: '提交',
            formBind: true, //验证通过之后，才可以触发提交按钮
            disabled: true,
            handler: function() {
                var formVal = this.up('form').getForm();
                if (formVal.isValid()) {
                    formVal.submit({
                        success: function(formVal, action) {
                            Ext.Msg.alert('成功提示', action.result.msg, function(){
                                tree_store.load();
                                winTyle.hide();
                            });
                        },
                        failure: function(formVal, action) {
                            Ext.Msg.alert('失败提示', action.result.msg);
                        }
                    });
                }
            }
        }]
    })
    var winTyle=Ext.create('Ext.window.Window', {
        title:'添加分组',
        closeAction:'hide',
        autoHeight:true,
		modal:true,
        width: 400,
        items: [formType]
    });
    winTyle.on('show',function(){
        formType.getForm().reset();
    })
    var rform=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/Dict/save',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:40,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'ID',
            name: 'd_id',
            hidden:true
        },{
            id:'d_type',
            fieldLabel: '类型',
            name: 'd_type',
            disabled:true,
            allowBlank: false
        },{
            fieldLabel: '名称',
            name: 'd_text',
            allowBlank: false
        } ,{
            fieldLabel: '扩展',
            name: 'd_extend'
        }, {
            fieldLabel: '排序',
            name: 'd_order',
            allowBlank: false
        }]
    })
	tree.on('cellclick',function(t,td,c,r){
        var text=r.data.text;
        form_text = text;
		if(text != "所有分组"){
            //store.load({params:{d_type:text}});
            SUNLINE.baseParams(store,{d_type:text});
            store.load({params:{page:1,start:0}});
		}
    })
    var win=Ext.create('Ext.window.Window', {
        title:'字典管理',
        closeAction:'hide',
        autoHeight:true,
        width: 400,
		modal:true,
        items: [rform],
        buttons: [
            {text: '提交',handler: function() {
                var iform = rform.getForm();
                var v=iform.getValues();
                v.d_type=Ext.getCmp('d_type').getValue();
                if(v.d_type==null){
                    Ext.Msg.alert('友情提醒','缺少重要参数！');
                    return;
                }
                if (!iform.isValid()) {
                    Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                    return;
                }
                /*console.log(v);
                return;*/
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url: $__app__+'/Dict/save',
                    params: v,
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info.msg);
                        if(r.status){
                            win.hide();
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }},
            {text: '关闭',handler: function() {
                win.hide();
            }}
        ]
    });
    function del(){
        var row = SUNLINE.getSelected(grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请选择你要删除的内容！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Dict/del',
                    params: {d_id:row.data.d_id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })
    }
    function modify(v){
        //console.log(form_text);
        if(form_text=='' || form_text == '所有分组'){
            Ext.Msg.alert('友情提示','请先选择字典分组！');
            return false;
        }
        if(v.text=='添加'){
            ROW.values={};
			ROW.values.d_type=form_text;
        }else{
            var row = SUNLINE.getSelected(grid);
            if(row==null){
                Ext.Msg.alert('友情提示','请选择你要编辑的信息！');
                return;
            }
            ROW.values=row.data;
        }
        win.setTitle(v.text+'信息',v.iconCls);
        win.show();
    }
    win.on('show',function(){
        var iform = rform.getForm();
        iform.reset();
        iform.setValues(ROW.values);
    })
    ziyo_log({ listeners : [{grid: grid, action:'Dict', pk_id:'d_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[grid,tree]
    })

})