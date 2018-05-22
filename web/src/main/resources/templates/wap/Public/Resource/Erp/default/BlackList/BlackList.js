Ext.onReady(function(){
    var thisTitle='游客黑名单';
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';

    Ext.QuickTips.init();
    var menu_dis = _uinfo.org_type=='管理公司' ? true : false;
    //所属单位 s
    var isHidden = _uinfo.org_type=='管理公司' ? false : true;
    var conf_s = {
        hidden:isHidden,
        displayField:'text',
        valueField:'id',
        id:'s_org_id',
        labelWidth:60,
        fieldLabel:'所属单位',
        hiddenName:'s_org_id',
        width:400,
        pageSize:20,
        value:'',
        listConfig:{
            width:400,
            minWidth:300,
            maxWidth:500
        },
        labelAlign:'right'
    };
    var company_config=Ext.apply(conf_s,{});
    var company_box= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order' },
        config:company_config
    });
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "供应商",tel:'120'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    });
    company_box.on('select',function(c,r){
        doSearch();
    });
    //所属单位 e
    //级别筛选 s
    var level_box = new Ext.form.ComboBox({
        id: 'b_level_s',
        name: 'b_level_s',
        fieldLabel:false,
        allowBlank:false,
        width:140,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['value'],
            data:[['全部'],['不接待'],['需确认']]
        }),
        displayField:"value",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        editable:false,
        value:"全部"
    });
    Ext.getCmp('b_level_s').on('select',function(t,r,i){
        doSearch();
    });
    //级别筛选 e
    //左边  s
    var c_url=$__app__+'/BlackList/json_data';
    var c_field=['b_id','b_org_id','b_name','b_tel','b_mobile','b_worg_reason','b_sorg_reason','b_level','b_card'];
    var c_store=SUNLINE.JsonStore(c_url,c_field);
    var c_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID", dataIndex:"b_id", width:80, hidden:true},
        {header:"手机号", dataIndex:"b_mobile", width:120},
        {header:"身份证", dataIndex:"b_card", width:150},
        {header:"姓名", dataIndex:"b_name", width:120},
        {header:"电话", dataIndex:"b_tel", width:120},
        {header:"禁用等级", dataIndex:"b_level", width:150},
    ];
    var left_panel = new Ext.grid.GridPanel({
        region:'center',
        store:c_store,
        columns: c_cm,
        border:true,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{emptyText:'没有黑名单游客信息',deferEmptyText:true},
        bbar: new Ext.PagingToolbar({pageSize: pageSize,store:c_store,displayInfo: true,displayMsg: '共{2}条数据',emptyMsg: '没有数据',items:[
            company_box,
        ],})
    });
    //左边  e
    //右边  s
    var user_detail = new Ext.Panel({
        border : false,
        region:'center',
        width:500,
        autoScroll : true,
        style : 'border-left:1px solid #d0d0d0;border-top:1px solid #ccc;',
        html : '<div style="padding: 10px;">请点击左则展示详细信息!</div>'
    });
    var right_panel = Ext.create('Ext.panel.Panel',{
        region:'east',
        layout : 'border',
        width:505,
        maxHight:700,
        border:true,
        autoScroll : true,
        bodyBorder:true,
        tbar:Ext.create('Ext.toolbar.Toolbar',{
            cls:'dd',
            height:30,
            items:[
                {text:'详细信息',id:'basic_info_id',cls:'tab-button-custom',enableToggle: true},
            ]
        }),
        items:user_detail
    })
    var user_detail_tpl = new Ext.XTemplate(
        '<div class="org-info-box"><ul>' +
        '<li class="org-list"><span class="org-title" >手机号：</span><span class="org-text">{b_mobile}</span></li>' +
        '<li class="org-list"><span class="org-title" >身份证：</span><span class="org-text">{b_card}</span></li>' +
        '<li class="org-list"><span class="org-title" >禁用等级：</span><span class="org-text">{b_level_s}</span></li>' +
        '<li class="org-list"><span class="org-title" >姓名：</span><span class="org-text">{b_name}</span></li>' +
        '<li class="org-list"><span class="org-title" >电话：</span><span class="org-text">{b_tel}</span></li>' +
        '<li class="org-list"><span class="org-title" >内部备注：</span><span class="org-text">{b_worg_reason}</span></li>' +
        '<li class="org-list"><span class="org-title" >分销商备注：</span><span class="org-text">{b_sorg_reason}</span></li>' +
        '</ul></div>'
    );
    left_panel.on('cellclick',function(v,i,d,r){
        var row  = r.data;
        if(row.b_level == '需确认'){
            row.b_level_s = '需确认（订单需供应商审核）';
        }else{
            row.b_level_s = '不接待（无法下单）';
        }
        var html = user_detail_tpl.apply(row);
        user_detail.body.hide().update(html).slideIn('l', {stopFx:true,duration:.5});
    });
    //右边  e

    var panel=Ext.create('Ext.panel.Panel',{
        region:'center',
        layout:'border',
        tbar: {
            xtype: "container",
            border: false,
            items: [{
                xtype: "toolbar",
                items: [
                    {text:'添加',iconCls:'button-add',act:'add', handler:modify,disabled:menu_dis},
                    '-',
                    {text:'编辑',iconCls:'button-edit',act:'edit', handler:modify,disabled:menu_dis},
                    '-',
                    {text:'删除',iconCls:'button-del', handler:del,disabled:menu_dis},
                    '-',
                    {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
                    '-',
                    {xtype:'tbtext',text: '禁用等级:'},
                    level_box,
                    '->',
                    '快速搜索：',
                    {
                        xtype:'trigger',
                        triggerCls:'x-form-search-trigger',
                        id:'w_search',
                        cls:'search-icon-cls',
                        emptyText:'姓名,手机,电话,身份证',
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
                ]
            }]
        },
        items:[left_panel,right_panel]
    });

    //添加 编辑 s
    var form_base = [
        {id:"b_id", name:"b_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
        {id:"b_org_id", name:"b_org_id", fieldLabel:"单位ID", maxLength:"10",xtype:"hidden"},
        {id:"b_mobile", name:"b_mobile", fieldLabel:"手机号", maxLength:"11", vtype:'Mobile'},
        {id:"b_card", name:"b_card", fieldLabel:"身份证号", maxLength:"20"},
        {id:"b_level",name:"b_level",fieldLabel:"<font color='red'>*</font>禁用等级",xtype:"combo",editable:false,triggerAction:"all",allowBlank:false,
            store:new Ext.data.SimpleStore({fields:['b_level','b_level_s'],data:[['需确认','需确认（订单需供应商审核）'],['不接待','不接待（无法下单）']]}),
            displayField:"b_level_s",valueField:"b_level",mode:"local",forceSelection:true,typeAhead:true,value:""
        },
        {id:"b_name", name:"b_name", fieldLabel:"姓名", maxLength:"20"},
        {id:"b_tel", name:"b_tel", fieldLabel:"电话", maxLength:"20"},
        {id:"b_worg_reason", name:"b_worg_reason", fieldLabel:"内部备注", maxLength:"255", xtype:'textarea',emptyText:'仅供内部查看的理由,最多200字'},
        {id:"b_sorg_reason", name:"b_sorg_reason", fieldLabel:"<font color='red'>*</font>分销商备注", maxLength:"255", xtype:'textarea',allowBlank:false,emptyText:'展示给分销商查看的理由,最多200字'},
    ];

    // var form_reason = [
    //     {id:"b_worg_reason", name:"b_worg_reason", fieldLabel:"内部备注", maxLength:"255", xtype:'textarea',emptyText:'仅供内部查看的理由,最多200字'},
    //     {id:"b_sorg_reason", name:"b_sorg_reason", fieldLabel:"<font color='red'>*</font>分销商备注", maxLength:"255", xtype:'textarea',allowBlank:false,emptyText:'展示给分销商查看的理由,最多200字'},
    // ];

    var form=Ext.create('Ext.form.Panel',{
        bodyPadding: 10,id:'form',border:false,width: 410,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{labelAlign:'right',labelWidth:80,width:340}
        },
        items: [{title:'基本信息',items:form_base},{title:'说明',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1.根据手机号或身份证判断，至少填一项!</li></ul></div>'}]
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
        }else{
            var row=SUNLINE.getSelected(left_panel);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择要编辑的黑名单游客信息');
                return;
            }
            form.getForm().setValues(row.data);
        }
        win.setTitle(v.text+"黑名单游客", v.iconCls);
        win.show();
    }
    function dosave() {
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '请按正确格式填写红框内容');
            return;
        };
        var b_mobile = Ext.getCmp('b_mobile').getValue();
        var b_card = Ext.getCmp('b_card').getValue();
        if(b_mobile=='' && b_card==''){
            Ext.Msg.alert('友情提示', '手机号和身份证必须填写一项!');
            return;
        }

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/BlackList/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    c_store.reload();
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
    //添加 编辑 e
    //删除  s
    function del(){
        var row=SUNLINE.getSelected(left_panel);
        if(row==null){
            Ext.Msg.alert('友情提示','请您选择要删除的行！');
            return;
        }
        var id = row.get('b_id');
        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/BlackList/del',
                    method : 'POST',
                    params : { b_id :id },
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功');
                        c_store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }
    //删除  e
    //搜索 s
    function doSearch(){
        var b_level  = Ext.getCmp('b_level_s').getValue();
        var b_org_id  = Ext.getCmp('s_org_id').getValue();
        var search_text = Ext.getCmp('w_search').getValue();
        SUNLINE.baseParams(c_store,{b_level:b_level,skey:search_text,b_org_id:b_org_id});
        c_store.currentPage = 1;
        c_store.load();
    }
    //搜索  e

    ziyo_log({ listeners : [{grid: left_panel, action:'UserBlacklist', pk_id:'b_id'}] });
    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });
})