/**
 * Created by Administrator on 15-12-7.
 */
var org_id=_uinfo.org_id;
var org_type=_uinfo.org_type;
var type_rule=false;
Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();




    var thisTitle = '标签管理';
    var url=$__app__+'/Label/dataJson';
    var store=SUNLINE.JsonStore(url,[],false);

    SUNLINE.baseParams(store,{l_org_id:org_id});
    store.currentPage=1;
    store.load();

    var cm=[
        new Ext.grid.RowNumberer({header:'序号',width:70,align:"center"}),
        { text: '名称',  dataIndex: 'l_text' ,renderer:text,width:150},
        { text: '所属模块',  dataIndex: 'l_category',renderer:model },
        { text: '所属分组',  dataIndex: 'l_parent' },
        { text: '排序',  dataIndex: 'l_order' },
        { text: '标签颜色',  dataIndex: 'l_color' }
    ];

    function model(v){
        return TYPE[v];
    }

    function text(v,m,r){
       var color = r.get('l_color');
       return  '<span style="color: #fff;background-color:'+color+';" class="ziyo_label">'+v+'</span>';
}

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {text:'添加',iconCls:'button-add',handler:function(){
                var row=tree.getSelection();
                if(!row[0] || !row[0].data.leaf){
                    Ext.Msg.alert('友情提示', '请先选择模块!');
                    return;
                }
                var  data={};
                data['l_category']=row[0].data.l_category;
                data['l_parent']=row[0].data.l_id;
                data['l_org_id']=org_id;
                form.getForm().setValues(data);
                win.setTitle('添加标签');
                win.show();
            }},
            {text:'编辑',iconCls:'button-edit',handler:function(){
                var row=SUNLINE.getSelected(grid);
                if(!row){
                    Ext.Msg.alert('友情提示', '请选择要编辑的标签!');
                    return;
                }
                win.setTitle('编辑标签');
                form.getForm().setValues(row.data);
                form.setHtml('<div style="margin-top: 10px;margin-left:  140px;width:100px;height: 30px;line-height: 30px;;text-align: center;color: #fff;background-color: '+row.data.l_color+'">预览</div>');
                win.show();
            }},
            {text:'删除',iconCls:'button-del',handler:function(){
                var row=SUNLINE.getSelected(grid);
                if(!row){
                    Ext.Msg.alert('友情提示', '请选择要删除的标签!');
                    return;
                }
                Ext.MessageBox.confirm('友情提示', '是否确认删除该标签？', function(id){
                    if (id == 'yes') {
                        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                        myMask.show();
                        Ext.Ajax.request({
                            url:$__app__ + '/Label/del',
                            params:{l_id:row.data.l_id,l_parent:row.data.l_parent},
                            method:'POST',
                            success:function (response, otps) {
                                myMask.hide();
                                var ret = Ext.decode(response.responseText);
                                var info=ret.info;
                                Ext.Msg.alert('友情提示',info);
                                if (ret.status){
                                    store.reload();
                                };
                            },
                            failure:function (response, otps) {
                                myMask.hide();
                                Ext.Msg.alert('友情提示', '操作失败！');
                            }
                        })
                    }
                })
            }},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerClass : 'x-form-search-trigger',
                id:'dict_Search',
                emptyText : '标签名称等',
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
        var skey = Ext.getCmp('dict_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage =1;
        store.load();
    }

    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Label/treeJson'
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


    var form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/Label/add',
        layout: 'anchor',
        defaults: {
            labelWidth:70,
            width:355,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ORG_ID', name: 'l_org_id',hidden:true},
            {fieldLabel: 'ID', name: 'l_id',hidden:true},
            {fieldLabel: '名称', name: 'l_text',allowBlank: false,id:'l_text'},
            {fieldLabel: '所属模块', name: 'l_category',hidden:true},
            {fieldLabel: '所属分组', name: 'l_parent',hidden:true},
            {fieldLabel: '排序', name: 'l_order',id:'l_order',allowBlank: false,xtype:'numberfield'},
            {fieldLabel: '颜色', name: 'l_color',id:'l_color'},
            {
                id:'color',
                xtype:'colorpicker',
                height:60,
                hidden:true,
                style:'margin-left:30px;',
                listeners: {
                    select: function(picker, selColor) {
                          var color = '#' + selColor;
                          Ext.getCmp('l_color').setValue(color);
                          setHtml();
                    }
                }
            }
        ],
        html:'<div style="margin-top: 10px;margin-left:  140px;width:100px;height: 30px;line-height: 30px;;text-align: center;color: #fff;background-color: #000">预览</div>',
        buttons: [{
            text: '提交',
            formBind: true, //验证通过之后，才可以触发提交按钮
            disabled: true,
            handler: function() {
                var formVal = this.up('form').getForm();
                if (formVal.isValid()) {
                    formVal.submit({
                        success: function(formVal, action) {
                            Ext.Msg.alert('成功提示', action.result.msg, function(){
                                var title=win.getTitle();
                                if(title=='添加分组'){
                                    tree_store.reload();
                                }else{
                                    store.reload();
                                }
                                win.hide();
                            });
                        },
                        failure: function(formVal, action) {
                            Ext.Msg.alert('失败提示', action.result.msg);
                        }
                    });
                }
            }
        },{
            text: '重置',
            handler: function() {
                var title=win.getTitle();
                Ext.getCmp('l_text').setValue('');
                Ext.getCmp('l_order').setValue('');
                if(title!='添加分组'){
                    Ext.getCmp('l_color').setValue();
                    setHtml();
                }
            }
        }]
    });

    Ext.getCmp('color').colors=COLOR;

    var win=Ext.create('Ext.window.Window', {
        title:'添加分组',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form]
    });

    win.on('show',function(){
        var title=win.getTitle();
        Ext.getCmp('l_color').setHidden(title=='添加分组');
        Ext.getCmp('color').setHidden(title=='添加分组');
        if(title!='添加分组'){
            setHtml();
        }else{
            form.setHtml('');
        }
    });

    win.on('hide',function(){
        form.getForm().reset();
    });

    Ext.getCmp('l_color').on('blur',function(v,r,d){
        setHtml();
    });

    Ext.getCmp('l_text').on('blur',function(v,r,d){
        var title=win.getTitle();
        if(title!='添加分组'){
            setHtml();
        }
    });

    //设置预览的颜色和文字
    function setHtml(){
        var l_color=Ext.getCmp('l_color').getValue();
        var l_text=Ext.getCmp('l_text').getValue();
        var color='#000';
        var text='预览';
        if(l_color){
            color=l_color;
        }else{
           Ext.getCmp('l_color').setValue('#000000');
        }
        if(l_text){
            text=l_text;
        }
        form.setHtml('<div style="margin-top: 10px;margin-left:  140px;width:100px;height: 30px;line-height: 30px;;text-align: center;color: #fff;background-color:'+color+'">'+text+'</div>');
    }

    var load_bool=true;
    /*
    非管理公司单位的操作限制
    */
    if (org_type!='管理公司'){
        type_rule=true;
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
        tbar:[
            {text:'添加分组',iconCls:'button-add',id:'add_btn',handler:function(){
                var row=tree.getSelection();
                if(!row[0] || row[0].data.text=='所有分组'){
                    Ext.Msg.alert('友情提示', '请先选择模块!');
                    return;
                }
                form.getForm().setValues(row[0].data);
                win.setTitle('添加分组');
                form.setHtml('');
                win.show();
            },hidden:type_rule},
            {text:'删除',iconCls:'button-del',id:'del_btn',handler:function(){
                var row=tree.getSelection();
                if(!row[0]){
                    Ext.Msg.alert('友情提示', '请选择要删除的分组!');
                    return;
                }
                Ext.MessageBox.confirm('友情提示', '是否确认删除该分组？', function(id){
                    if (id == 'yes') {
                        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                        myMask.show();
                        Ext.Ajax.request({
                            url:$__app__ + '/Label/del',
                            params:{l_id:row[0].data.l_id,l_org_id:org_id},
                            method:'POST',
                            success:function (response, otps) {
                                myMask.hide();
                                var ret = Ext.decode(response.responseText);
                                var info=ret.info;
                                Ext.Msg.alert('友情提示',info);
                                if (ret.status){
                                    tree_store.reload();
                                };
                            },
                            failure:function (response, otps) {
                                myMask.hide();
                                Ext.Msg.alert('友情提示', '操作失败！');
                            }
                        })
                    }
                })

            },hidden:type_rule},
            {text:'刷新',iconCls:'button-ref', handler:function(){
                if(load_bool){
                    load_bool=false;
                    tree_store.load();
                    store.removeAll();
                }
            },hidden:type_rule}
        ],
        listeners : {
            select : function(t, r, i){
                Ext.getCmp('del_btn').setDisabled(!r.data.l_id);
                if(!r.data.l_id && r.data.text!='所有分组'){
                    Ext.getCmp('add_btn').setDisabled(false);
                }else{
                    Ext.getCmp('add_btn').setDisabled(true);
                }
                var text=r.data.text;
                var l_category=r.data.l_category;
                if(r.data.leaf){
                    var l_id=r.data.l_id;
                }
                if(text!= "所有分组"){
                    SUNLINE.baseParams(store,{category:l_category,id:l_id,l_org_id:org_id},false);
                    store.currentPage = 1;
                    store.load();
                }
            }
        },
        rootVisible: true
    });

    tree.on('afteritemexpand',function(){
        load_bool=true;
    });

    new Ext.Viewport({
        layout:'border',
        items:[grid,tree]
    })

    ziyo_log({ listeners : [{grid: grid, action:'Label', pk_id:'l_id'}] });

});