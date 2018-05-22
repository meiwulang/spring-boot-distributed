var pageSize = 20;
var status_color = {'未处理':'#ff6331', '同步成功':'#71dc1c', '同步失败':'#8899AB'};
Ext.onReady(function(){
    var thisTitle='订单同步';
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';

    Ext.QuickTips.init();

    var ticket_url=$__app__+'/OrderSync/ticket_data';
    var ticket_store=SUNLINE.JsonStore(ticket_url,[],false);
    var ticket_cm=[
        new Ext.grid.RowNumberer({width:20}),
        {header:"票价类型", dataIndex:"ticket_type", width:150},
        {header:"价格", dataIndex:"ticket_price", width:150,editor:new Ext.form.NumberField({id:'ticket_price'})},
        {header:"数量", dataIndex:"number", width:250},
    ];
    var ts_grid={
        region:'center',
        border:false,
        style:'border:1px #ccc solid',
        store:ticket_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有票价信息',
            deferEmptyText:true,
            enableTextSelection:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        minHeight:300,
        columns:ticket_cm,
        // tbar : [
        //     '<b>票价信息</b>',
        // ],
    };
    var ticket_grid=new Ext.grid.GridPanel(ts_grid);
    var edit_form = new Ext.form.FormPanel({
        border : false,
        region : 'north',
        height: 120,
        split:{size:2},
        bodyStyle : "background:#fff;padding:5",
        cls:'tcol2',
        defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {name:'id',fieldLabel: '订单id',hidden:true},
            {name:'number',fieldLabel: '订单编号',editable:false},
            {name:'p_code',fieldLabel: "<font color='red'>*</font>产品编号",allowBlank: false, },
            SUNLINE.ExtDateField({id:'start_date',name:'start_date',fieldLabel:"<font color='red'>*</font>出团日期",width:280,labelWidth:80,labelAlign:"right",}),
            {name:'sorg_phone',fieldLabel: "<font color='red'>*</font>分销商手机",allowBlank: false, vtype:'Mobile' },
            {name:'worg_user_name',fieldLabel: "<font color='red'>*</font>操作人姓名",allowBlank: false, },
            {name:'worg_user_phone',fieldLabel: "<font color='red'>*</font>操作人手机",allowBlank: false, vtype:'Mobile' },
        ]
    });
    var edit_win = new Ext.Window({
        title: '订单编辑',
        width: 620,
        layout: 'border',
        minHeight: 500,
        height:Ext.getBody().getHeight()-50,
        closeAction: 'hide',
        modal: true,
        items: [edit_form,ticket_grid],
        buttons: [
            {id:'edit_and_sync',text: '保存并同步',handler:edit_save_sync},
            {id:'edit_only',text: '保存',handler:edit_save_only},
            {
                text: '取消', handler: function () {
                edit_win.hide();
            }
            }
        ]
    });


    var setForm = Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:80,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {id:'app_id', fieldLabel:'app_id', name:'app_id', allowBlank: false, editable:false},
            {id:'app_secret', fieldLabel:'app_secret', name:'app_secret', allowBlank: false,},
            {id:'account_name', fieldLabel:'第三方账号', name:'account_name', allowBlank: false},
            {id:'account_pwd', fieldLabel:'第三方密码', name:'account_pwd', allowBlank: false, inputType:'password',}
        ]
    });

    window.setFormw = new Ext.Window({
        title: '基本设置',
        width: 400,
        autoHeight: true,
        closeAction: 'hide',
        modal: true,
        items: [setForm],
        buttons: [
            {text: '保存',handler:save_set},
            {
                text: '取消', handler: function () {
                setFormw.hide();
            }
            }
        ]
    });

    var status_combo = new Ext.form.ComboBox({
        id: 'status_box',
        name: 'status_box',
        fieldLabel:'同步状态:',
        allowBlank:false,
        labelAlign: 'right',
        width:240,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['同步成功'],['同步失败'],['未处理']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        editable:false,
        value:"全部"
    });
    Ext.getCmp('status_box').on('select',function(t,r,i){
        doSearch();
    });

    var c_url=$__app__+'/OrderSync/json_data';
    var c_store=SUNLINE.JsonStore(c_url);
    var c_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"同步状态", dataIndex:"status", width:120,renderer:format_status},
        {header:"订单号", dataIndex:"number", width:150},
        {header:"产品信息", dataIndex:"product_name", width:270, renderer:show_product},
        {header:"外部产品编号", dataIndex:"p_code", width:150},
        {header:"金额", dataIndex:"settle_real", width:80,align:"right",renderer:show_money},
        {header:"总人数", dataIndex:"num", width:80},
        {header:"同步时间", dataIndex:"add_time", width:150},
        {header:"买家信息", dataIndex:"sorg_name", width:200, renderer:show_sorg},
        {header:"操作人", dataIndex:"worg_user_name", width:150, renderer:show_worg_name},
        {header:"备注", dataIndex:"remark", width:300},
    ];
    var panel = new Ext.grid.GridPanel({
        region:'center',
        store:c_store,
        columns: c_cm,
        border:true,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{emptyText:'没有同步订单信息',deferEmptyText:true},
        tbar:[
            {text: '设置', iconCls: '', id: 'sync_set', handler:sync_set},
            {text: '编辑', iconCls: 'button-edit', id: 'sync_edit', handler:sync_edit},
            {text: '同步', iconCls: '', id: 'sync_sync', handler:sync_sync},
            '-',
            status_combo,
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'w_search',
                cls:'search-icon-cls',
                emptyText:'订单号',
                width:200,
                onTriggerClick:function (e) {
                    doSearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            doSearch();
                    }
                }
            },
        ],
        bbar: new Ext.PagingToolbar({pageSize: pageSize,store:c_store,displayInfo: true,displayMsg: '共{2}条数据',emptyMsg: '没有数据'})
    });

    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

    function doSearch(){
        var status  = Ext.getCmp('status_box').getValue();
        var search_text = Ext.getCmp('w_search').getValue();
        SUNLINE.baseParams(c_store,{status:status,skey:search_text});
        c_store.currentPage = 1;
        c_store.load();
    }

    function sync_set() {
        Ext.Ajax.request({
            url: $__app__ + '/OrderSync/app_set',
            method: 'GET',
            success: function (response, options) {
                setForm.getForm().setValues(JSON.parse(response.responseText));
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障');
            }
        });
        setFormw.show();
    }

    function save_set() {
        var set = setForm.getForm().getValues();
        Ext.Ajax.request({
            url: $__app__ + '/OrderSync/save_set',
            method: 'post',
            waitMsg: '数据加载中，请稍后....',
            params: set,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', obj.info);
            },
            failure: function (response, opts) {
                Ext.Msg.alert('友情提示', '保存失败！');
            }
        });
    }

    function sync_edit() {
        var row=SUNLINE.getSelected(panel);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要编辑的订单!');
            return false;
        };
        var data=row.data;
        data.start_date = int2date(data.start_date);
        var edit_data=edit_form.getForm();
        edit_data.setValues(data);
        if(data.status == '同步成功'){
            Ext.getCmp('edit_and_sync').setHidden(true);
            Ext.getCmp('edit_only').setHidden(true);
        }else{
            Ext.getCmp('edit_and_sync').setHidden(false);
            Ext.getCmp('edit_only').setHidden(false);
        }
        edit_win.show();
        SUNLINE.baseParams(ticket_store,{id:data.id});
        ticket_store.load();
    }

    function edit_save(sync) {
        if(!edit_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var form_data=edit_form.form.getValues();

        //获取明细信息
        var ticket_list=[];
        ticket_store.each(function(v){
            var row= v.data;
            delete(row.id);
            ticket_list.push(row);
        });
        form_data.ticket_list=Ext.encode(ticket_list);
        form_data.sync = sync;
        Ext.Ajax.request({
            url:$__app__ + '/OrderSync/edit_save',
            method:'POST',
            params:form_data,
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                myMask.hide();
                if(1==rst.status){
                    edit_win.hide();
                    c_store.reload();
                    Ext.Msg.alert('友情提示',rst.info);
                }else{
                    Ext.Msg.alert('友情提示',rst.info);
                }
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '未知错误！');
            }
        });

    }

    function edit_save_sync() {
        edit_save(1);
    }
    function edit_save_only() {
        edit_save(0);
    }

    function sync_sync() {
        var row=SUNLINE.getSelected(panel);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要同步的订单!');
            return false;
        };
        var data=row.data;
        if(data.status == '同步成功'){
            Ext.Msg.alert('友情提示','此订单已同步成功,请勿重复操作!');
            return false;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderSync/sync_sync',
            method:'POST',
            params:{id:data.id},
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                myMask.hide();
                c_store.reload();
                Ext.Msg.alert('友情提示',rst.info);
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '未知错误！');
            }
        });
    }
    function format_status(v, m, r){
        return '<div style="width:62px;border-radius:3px;padding:2px 5px;color:#fff;background-color: '+status_color[v]+'">'+v+'</div>';
    };
    function show_product(v,i,r){
        return '[' + r.get('product_num') + ']' + v;
    }
    function show_sorg(v,i,r) {
        return '[' + r.get('sorg_phone') + ']' + v;
    }
    function show_worg_name(v,i,r) {
        return v + '(' + r.get('worg_user_phone') + ')';
    }
    function show_money(v,i,r) {
        if(!v) v = "0.00";
        return '￥'+ (parseFloat(v).toFixed(2));
    }
})