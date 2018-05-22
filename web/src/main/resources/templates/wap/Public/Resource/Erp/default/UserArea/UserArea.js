/**
 * Created by Johony on 16-3-1.
 */
var org_info = {};
var OrgId='';
Ext.onReady(function(){
    var store = SUNLINE.JsonStore($__app__+'/UserArea/dataJson',[]);
    var cm = [
        {header:'分区ID',dataIndex:'ua_id',hidden:true},
        {header:'分区名称',dataIndex:'ua_text',width:100},
        {header:'分区区县',dataIndex:'ua_area_list',width:200,renderer:function(v){
            return '<span title = "'+v+'">'+v+'</span>';
        }},
        {header:'客服ID',dataIndex:'ua_service_uid',hidden:true},
        {header:'客服账号',dataIndex:'ua_service_uname',width:100},
        {header:'客服姓名',dataIndex:'ua_service_realname',width:100},
        {header:'客服手机',dataIndex:'ua_service_umob',width:100},
        {header:'客服所属部门ID',dataIndex:'ua_service_wgid',hidden:true},
        {header:'客服所属部门',dataIndex:'ua_service_wgname',width:120},
        {header:'销售ID',dataIndex:'ua_sales_uid',hidden:true},
        {header:'销售账号',dataIndex:'ua_sales_uname',width:100},
        {header:'销售姓名',dataIndex:'ua_sales_realname',width:100},
        {header:'销售手机',dataIndex:'ua_sales_umob',width:100},
        {header:'销售所属部门ID',dataIndex:'ua_sales_wgid',hidden:true},
        {header:'销售所属部门',dataIndex:'ua_sales_wgname',width:120},
        {header:'所属单位ID',dataIndex:'ua_orgid',hidden:true},
        {header:'所属单位名称',dataIndex:'ua_orgname',width:150},
        {header:'添加时间',dataIndex:'ua_time',hidden:true}
    ];
    if(_uinfo.org_pid>0)OrgId=_uinfo.org_id;
    var companyCombox = SUNLINE.ComBoxPlus({
        id:'company',
        fields:['org_id','org_name'],
        url:$__app__+'/UserArea/getCompany',
        config:{
            displayField:'org_name',
            valueField:'org_id',
            emptyText:'请选择分公司',
            width:300,
            listeners:{
                select:function(v,i,r){
                    org_info = i[0].data;
                    SUNLINE.baseParams(store,{ua_orgid:org_info.org_id});
                    store.currentPage=1;
                    store.load();
                    if(org_info.org_id==0)org_info.org_id='';
                    OrgId=org_info.org_id;
                }
            }
        }
    });

    companyCombox.getStore().on('load',function(){
        this.add({org_id:0,org_name:'全部分公司'});
    })

    if(_uinfo){
        if(_uinfo.org_type == '管理公司' && _uinfo.org_pid != 0){
            companyCombox.setDisabled(true);
            companyCombox.setValue(_uinfo.org_name);
        }
    }

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        fixed:true,
        viewConfig:{emptyText:'没有客服销售信息╮(╯_╰)╭，请快去添加哦(づ￣3￣)づ╭❤～'},
        tbar:[
            '<span style = "color:#00b7ee">用户分区管理</span>',
            companyCombox,
            '-',
            {text:'添加分区',iconCls:'button-add',handler:createArea,disabled:isDisabled('UserArea::save')},
            '-',
            {text:'编辑分区',iconCls:'button-edit',handler:createArea,disabled:isDisabled('UserArea::save')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'ua_Search',
                iconCls:'button-sch',
                emptyText : '用户名称，用户手机号',
                width:150,
                onTriggerClick:function(e){
                    uaSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            uaSearch();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '什么都没有╮(╯_╰)╭'
        })
    });
    function uaSearch(){
        var skey=Ext.getCmp('ua_Search').getValue();
        var orgID = companyCombox.getValue();
        SUNLINE.baseParams(store,{ua_orgid:orgID,skey:skey});
        store.currentPage=1;
        store.load();
    }
    var cityList=SUNLINE.ComBoxPlus({
        id:'area_list',
        fields:['name'],
        url:$__app__+'/UserArea/getCity',
        config:{
            fieldLabel:'选择区县',
            displayField:'name',
            valueField:'name',
            width:400,
            labelWidth:60,
            labelAlign:'right',
            multiSelect: true,
            allowBlank: false
        },
        type:'Tag'
    });

    /*cityList.on({
        beforequery:function(c,r,o){
            SUNLINE.baseParams(this.getStore(), {org_id: org_info.org_id?org_info.org_id:_uinfo.org_id});
            this.getStore().load();
        }
    })*/

    var user_store = SUNLINE.JsonStore($__app__+'/UserArea/getUser',['u_id','u_name','u_realname','u_mobile'], false);
    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:60,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID',id:'ua_id',name: 'ua_id',hidden:true},
            {fieldLabel: '分区名称',id:'ua_text',name: 'ua_text',allowBlank: false},
             cityList,
            {fieldLabel:'客服ID',id:'ua_service_uid',name:'ua_service_uid',hidden:true},
            {fieldLabel:'客服账号',id:'ua_service_uname',name:'ua_service_uname',hidden:true},
            {fieldLabel:'客服手机号',id:'ua_service_umob',name:'ua_service_umob',hidden:true},
            {
                id:"ua_service_realname",
                name:"ua_service_realname",
                fieldLabel:"选择客服",
                xtype:"combo",
                editable:true,
                triggerAction:"all",
                store:user_store,
                Style:'display: inline-block;',
                minChars:2,
                loadingText:'正在加载数据',
                valueField:'u_realname',
                queryMode:'remote',
                typeAhead: true,
                selectOnFocus:true,
                emptyText:'请选择客服',
                allowBlank:false,
                tpl: Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{u_name} - {u_realname} - {u_mobile}</li>',
                    '</tpl></ul>'
                ),
                displayField: 'u_realname',
                listeners:{
                    select:function(v,i,r){
                        var row = i[0].data;
                        Ext.getCmp('ua_service_uid').setValue(row.u_id);
                        Ext.getCmp('ua_service_uname').setValue(row.u_name);
                        Ext.getCmp('ua_service_umob').setValue(row.u_mobile);
                    },
                    beforequery:function(){
                        SUNLINE.baseParams(user_store,{org_id:org_info.org_id});
                        user_store.load();
                    }
                }
            },
            {fieldLabel:'销售ID',id:'ua_sales_uid',name:'ua_sales_uid',hidden:true},
            {fieldLabel:'销售账号',id:'ua_sales_uname',name:'ua_sales_uname',hidden:true},
            {fieldLabel:'销售手机号',id:'ua_sales_umob',name:'ua_sales_umob',hidden:true},
            {
                id:"ua_sales_realname",
                name:"ua_sales_realname",
                fieldLabel:"选择销售",
                xtype:"combo",
                editable:true,
                triggerAction:"all",
                store:user_store,
                Style:'display: inline-block;',
                minChars:2,
                loadingText:'正在加载数据',
                valueField:'u_realname',
                queryMode:'remote',
                typeAhead: true,
                selectOnFocus:true,
                emptyText:'请选择销售',
                allowBlank:false,
                tpl: Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{u_name} - {u_realname} - {u_mobile}</li>',
                    '</tpl></ul>'
                ),
                displayField:'u_realname',
                listeners:{
                    select:function(v,i,r){
                        var row = i[0].data;
                        Ext.getCmp('ua_sales_uid').setValue(row.u_id);
                        Ext.getCmp('ua_sales_uname').setValue(row.u_name);
                        Ext.getCmp('ua_sales_umob').setValue(row.u_mobile);
                    },
                    beforequery:function(){
                        SUNLINE.baseParams(user_store,{org_id:org_info.org_id});
                        user_store.load();
                    }
                }
            }
        ]
    })
    var win = Ext.create('Ext.window.Window',{
        title:'添加用户分区',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form],
        buttons: [
            {text: '提交',handler: submit},
            {text: '关闭',handler:function(){
                win.hide();
            }}
        ]
    });
    win.on('hide',function(){
       form.getForm().reset();
    });
    function submit(){
        var formValue = form.getForm().getValues();
        if(!form.getForm().isValid()){
            Ext.Msg.alert('友情提示','请把红色框填写完整');
            return false;
        }
        var len = formValue.area_list.length;
        formValue.ua_area_list = '';
        $.each(formValue.area_list,function(i,v){
            if(i==(len-1)){
                formValue.ua_area_list += v;
            }else{
                formValue.ua_area_list += v+',';
            }
        })
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        formValue.ua_orgid=OrgId;
        Ext.Ajax.request({
            url: $__app__+'/UserArea/save',
            method:'POST',
            params: formValue,
            success: function(response){
                var r = Ext.decode(response.responseText);
                myMask.hide();
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status == 1){
                    win.hide();
                    store.reload();
                    form.getForm().reset();
                }
            }
        })
    }
    win.on('show',function(){
        SUNLINE.baseParams(cityList.getStore(), {org_id: org_info.org_id?org_info.org_id:_uinfo.org_id});
        cityList.getStore().load();
    })
    function createArea(t){
        var orgData = companyCombox.getValue();
        if(!orgData){
            Ext.Msg.alert('温馨提示','请先选择公司');
            return false;
        }
        var title = '';
        if(t.text == '添加分区'){
            win.show();
            title = '添加';
        }else if(t.text == '编辑分区'){
            var row = SUNLINE.getSelected(grid);
            if(typeof row == 'undefined'){
                Ext.Msg.alert('温馨提示','请先选择要编辑的用户信息');
                return false;
            }
            win.show();
            title = '编辑';
            row.data.area_list = row.data.ua_area_list.split(',');
            form.getForm().setValues(row.data);
        }
        var titleStr = title + '用户分区';
        win.setTitle(titleStr);
    }

    ziyo_log({ listeners : [{grid: grid, action:'UserArea', pk_id:'ua_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})