var ROW={};
var LgirdVal = {};//存储部门所属单位的信息
Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '部门管理';
    var url=$__app__+'/Workgroup/dataJson';
    var field=['wg_id','wg_org_id','wg_bh','wg_name','wg_tel','wg_fax','wg_info','wg_type','wg_status'];
    var store=SUNLINE.JsonStore(url,field,false);
    var cm=[
        { text: 'ID',  dataIndex: 'wg_id',hidden:true },
        { text: '部门名称',  dataIndex: 'wg_name',width:160 },
        { text: '部门编号',  dataIndex: 'wg_bh' ,width:100},
        { text: '电话号码',  dataIndex: 'wg_tel',width:120 },
        { text: '传真号码',  dataIndex: 'wg_fax',width:120 },
        { text: '简介',  dataIndex: 'wg_info' ,width:160}
    ];
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        autoScroll: true,
        columns:cm,
        viewConfig:{
            emptyText : '暂时没有信息',
            deferEmptyText : true
        },
        loadMask:{msg:'数据载入中，请稍候'},
        tbar:[
            {text:'添加',iconCls:'button-add',handler:modify,disabled:isDisabled('Workgroup::add')},
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Workgroup::edit')},
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Workgroup::del')},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                if(!LgirdVal.org_name){
                    Ext.Msg.alert('友情提醒','没有选择单位或单位信息有误！');
                    return;
                }else{
                    store.reload();
                }
            }},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'wg_Search',
                iconCls:'button-sch',
                emptyText : '查询部门名称，编号',
                width:200,
                onTriggerClick:function(e){
                    wgSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            wgSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){
                    window.location.reload();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });
    var lurl = url=$__app__+'/Company/json_data';
    var lfield=['org_id','org_bh','org_name','org_type'];
    var lstore=SUNLINE.JsonStore(lurl,lfield);
    var lcm=[
        new Ext.grid.RowNumberer({width:50}),
        {text:'ID',dataIndex:'org_id',hidden:true },
        {text:'编号',dataIndex:'org_bh',width:80 },
        {text:'单位名称',dataIndex:'org_name',width:240},
        {text:'单位类型',dataIndex:'org_type',width:80 }
    ];

    var lgrid = Ext.create('Ext.grid.Panel',{
        region:'west',
        store:lstore,
        columns:lcm,
        split:true,
        width:450,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            '快速搜索',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'org_Search',
                emptyText : '单位名称,单位编号，单位类型',
                iconCls:'button-sch',
                width:220,
                onTriggerClick:function(e){
                    orgSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            orgSearch();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: lstore,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    lgrid.on('cellclick',function(sm,rowldx,c,r){
        LgirdVal = {};
        LgirdVal = r.data;
        console.log(r.data);
        SUNLINE.baseParams(store,{wg_org_id:LgirdVal.org_id});
        store.load({params:{page:1,start:0}});
    })
    var form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/Workgroup/save',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:60,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID',id:'wg_id',name: 'wg_id',hidden:true},
            {fieldLabel: '单位ID',id:'wg_org_id',name: 'wg_org_id',allowBlank: false,hidden:true},
            {fieldLabel: '所属单位',id:'wg_org_name',name: 'wg_org_name',disabled:true},
            {fieldLabel: '部门编号',id:'wg_bh',name: 'wg_bh',allowBlank: false,emptyText:'请填写你的部门编号'},
            {fieldLabel: '部门名称',id:'wg_name',name: 'wg_name',allowBlank: false,emptyText:'请填写你的部门名称'},
            {fieldLabel: '部门电话',id:'wg_tel',name: 'wg_tel',allowBlank: true},
            {fieldLabel: '传真号码',id:'wg_fax',name: 'wg_fax',allowBlank: true},
            {fieldLabel: '部门简介',id:'wg_info',name: 'wg_info',xtype:'textarea',allowBlank: true}
        ]
    })

    var win=Ext.create('Ext.window.Window', {
        title:'部门信息',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form],
        buttons: [
            /*{text: '重置',handler: function() {
                form.getForm().reset();
                if(ROW.values.wg_id){
                    Ext.getCmp('wg_id').setValue(ROW.values.wg_id);
                }
                Ext.getCmp('wg_org_name').setValue(LgirdVal.org_name);
                Ext.getCmp('wg_org_id').setValue(LgirdVal.org_id);
            }},*/
            {text: '提交',handler: function() {
                var iform = form.getForm();
                var v=iform.getValues();
                if (!iform.isValid()) {
                    Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                    return;
                }
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url: $__app__+'/Workgroup/save',
                    params: v,
                    method:'post',
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
            {text:'关闭',handler:function(){
                win.hide();
            }}
        ]
    });
    ziyo_log({ listeners : [{grid: grid, action:'Workgroup', pk_id:'wg_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [grid,lgrid]
    });

    function wgSearch(){
        var skey=Ext.getCmp('wg_Search').getValue();
        if(!LgirdVal.id){
            Ext.Msg.alert('友情提示','请先选择单位！');
            return;
        }
        var wg_org_id = LgirdVal.org_id;
        console.log(LgirdVal);
        SUNLINE.baseParams(store,{skey:skey,wg_org_id:wg_org_id});
        store.currentPage = 1;
        store.load();
    }
    function orgSearch(){
        var skey=Ext.getCmp('org_Search').getValue();
        SUNLINE.baseParams(lstore,{skey:skey});
        lstore.currentPage = 1;
        lstore.load();
        store.removeAll();
    }
    function modify(v){
        if(typeof LgirdVal.org_id == 'undefined'){
            Ext.Msg.alert('友情提示','请先选择左边的单位！');
            return false;
        }else{
            if(v.text=='添加'){
                ROW.values={};
            }else{
                var ret=SUNLINE.getSelected(grid);
                if(ret==null){
                    Ext.Msg.alert('友情提示','请选择你要编辑的部门信息！');
                    return false;
                }
                ROW.values=ret.data;
            }
            ROW.values.wg_org_id=LgirdVal.org_id;
            ROW.values.wg_org_name=LgirdVal.org_name;
            win.setTitle(v.text+'部门信息',v.iconCls);
            win.show();
        }

    }

    win.on('show',function(){
        form.getForm().reset();
        form.getForm().setValues(ROW.values);
    })

    function del(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要删除的部门信息！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Workgroup/del',
                    params: {
                        wg_id:ret.data.wg_id
                    },
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

    //{button:'ziyo_log_btn',listeners:[{obj:grid, action:'Users', table:'Users'},{obj:grid, action:'UsersInfo', table:'Users'}]}
});