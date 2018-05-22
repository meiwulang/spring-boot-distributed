var ROW = {};
GUIDE_WORK = {};
var WG={};
//setReadOnly
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '司机管理';

    var url = $__app__ + '/Drivers/json_data';
    var field = [{name:"d_id"}];
    var store = new SUNLINE.JsonStore(url, field);

    var cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID", dataIndex:"d_id", width:50, hidden:true},
        {header:"d_org_id", dataIndex:"d_org_id", width:50, hidden:true},
        {header:"d_uid", dataIndex:"d_uid", width:50, hidden:true},
        {header:"us_job", dataIndex:"us_job", width:50, hidden:true},
        {header:"u_usid", dataIndex:"u_usid", width:50, hidden:true},
        {header:"us_id", dataIndex:"us_id", width:50, hidden:true},
        {header:"us_orgid", dataIndex:"us_orgid", width:50, hidden:true},
        {header:"司机姓名", dataIndex:"u_realname", width:100},
        {header:"性别", dataIndex:"u_sex", width:60},
        {header:"手机号", dataIndex:"u_mobile", width:100},
        {header:"身份证", dataIndex:"u_card", width:180},
        {header:"驾驶证号", dataIndex:"d_drivers", width:180},
        {header:"领证时间", dataIndex:"d_lead_time", width:100,renderer:time_d_lead_time}
    ];
    function formatTime(v){
        if(v==''|| v==0){
            return '';
        }
        var t = new Date(parseInt(v) * 1000);
        return Ext.Date.format(t,'Y-m-d');
    }
    function time_d_lead_time(v,m,r){
        return r.get('d_lead_time').substr(0,4) + '-' + r.get('d_lead_time').substr(4,2) + '-' + r.get('d_lead_time').substr(6,2) ;
    }
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'车队公司'}
    });
    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:cm,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有司机信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify, disabled:isDisabled('Drivers::save')},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify, disabled:isDisabled('Drivers::save')},
            '-',
            {text:'删除', iconCls:'button-del', handler:del, disabled:isDisabled('Drivers::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                store.reload();
            }},
            '-',
            company_box,
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'司机姓名，驾驶证',
                width:180,
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
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },'-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有司机信息'
        })
    });

    ROW.d_org_id=_uinfo.org_id;
    SUNLINE.baseParams(store,{d_org_id:ROW.d_org_id});
    store.load();
    company_box.on('select',function(c,r){
        var row= r[0];
        SUNLINE.baseParams(store,{d_org_id:row.get('id')});
        ROW.d_org_id=row.get('id');
        store.load();
    });

    var form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:100,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:220,labelAlign:"right" },
                items:[
                    {id:"d_id", name:"d_id", fieldLabel:"ID", maxLength:"10", xtype:"hidden"},
                    {id:"u_id", name:"u_id", fieldLabel:"ID", maxLength:"10", xtype:"hidden"},
                    {id:"us_id", name:"us_id", fieldLabel:"ID", maxLength:"10", xtype:"hidden"},
                    {id:"d_org_id", name:"d_org_id", fieldLabel:"d_org_id", maxLength:"10", xtype:"hidden"},
                    {id:"us_orgid", name:"us_orgid", fieldLabel:"us_orgid", maxLength:"10", xtype:"hidden"},
                    {id:"d_uid", name:"d_uid", fieldLabel:"d_uid", maxLength:"10", xtype:"hidden"},
                    {id:"us_job", name:"us_job", fieldLabel:"us_job", maxLength:"10", xtype:"hidden",value:'司机'},
                    {id:"u_usid", name:"u_usid", fieldLabel:"u_usid", maxLength:"10", xtype:"hidden"},
                    {id:"u_mobile", name:"u_mobile", fieldLabel:"手机号", maxLength:"20", allowBlank:false,vtype:'Mobile'},
                    {id:"u_realname", name:"u_realname", fieldLabel:"姓名", maxLength:"50", allowBlank:false,vtype:'NotBlank'},
                    {id:"u_sex", name:"u_sex", fieldLabel:"性别", xtype:"combo", triggerAction : "all",
                        store:new Ext.data.SimpleStore({fields:['u_sex'], data:[
                            ['男'],
                            ['女']
                        ]}),
                        displayField:"u_sex",
                        valueField:"u_sex",
                        mode:"local",
                        value:"男",
                        forceSelection : true,
                        typeAhead : true,
                        allowBlank:false,
                        width:220
                    },
                    {id:"u_card", name:"u_card", fieldLabel:"身份证号", maxLength:"20"/*,vtype:'Card', allowBlank:false*/},
                    {id:"d_drivers", name:"d_drivers", fieldLabel:"驾驶证号", maxLength:"18"/*, allowBlank:false,vtype:'NotBlank'*/},
                    SUNLINE.ExtDateField({id:'d_lead_time', fieldLabel:"领证时间",labelAlign:"right", allowBlank:true})
                ]
            },{
                columnWidth:1,
                defaults:{ width:220,labelAlign:"right" },
                items:[{id:"d_info",labelAlign:"right", name:"d_info", fieldLabel:"个人备注", maxLength:"500", xtype:'textarea'}]
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

    Ext.getCmp('u_mobile').on('blur',function(){
        var row = form.getForm().getValues();
        if(row['d_id']){
        }else{
            var user_d_mob=Ext.getCmp('u_mobile').getValue();
            //var d_org_idd=Ext.getCmp('d_org_idd').getValue();
            Ext.Ajax.request({
                url : $__app__ + '/Drivers/select_mob',
                method : 'POST',
                params : { u_mobile :user_d_mob},
                success : function(response){
                    var ret = Ext.decode(response.responseText);
                    if(ret.info){
                        Ext.Ajax.request({
                            url : $__app__ + '/Drivers/select_repeat',
                            method : 'POST',
                            params : {d_org_id:ROW.d_org_id,d_uid:ret.info.u_id},
                            success : function(r){
                                var ret_repeat = Ext.decode(r.responseText);
                                if(ret_repeat.info.msg=='该司机已存在'){
                                    var data_repeat={
                                        u_mobile:'',
                                        u_realname:'',
                                        u_sex:'',
                                        u_card:'',
                                        d_uid:'',
                                        u_id:'',
                                        u_usid:''
                                    }
                                    form.getForm().setValues(data_repeat);
                                    Ext.Msg.alert('友情提示',ret_repeat.info.msg);
                                    setFieldReadOnly(false);
                                }else{
                                    mobile_data(ret);
                                    setFieldReadOnly(true);
                                }
                            },
                            failure : function(response, opts){
                                Ext.Msg.alert('友情提示', '操作失败');
                            }
                        });
                    }else{
                        mobile_data();
                        setFieldReadOnly(false);
                        Ext.Msg.alert('友情提示', '用户账号里没有这个手机号的用户,如果继续注册，将会生成新用户！');
                    }
                },
                failure : function(response, opts){
                    Ext.Msg.alert('友情提示', '操作失败');
                }
            });
        }

    })

    function mobile_data(ret){
        if(ret){
            var data={
                u_realname:ret.info.u_realname,
                u_sex:ret.info.u_sex,
                u_card:ret.info.u_card,
                d_uid:ret.info.u_id,
                u_id:ret.info.u_id,
                u_usid:ret.info.u_usid
            }           
        }else{
            var data={
                u_realname:'',
                u_sex:'',
                u_card:'',
                d_uid:'',
                u_id:'',
                u_usid:''
            }
        }       
        form.getForm().setValues(data);
    }

    function setFieldReadOnly(type){
        Ext.getCmp('u_realname').setDisabled(type);
        Ext.getCmp('u_sex').setDisabled(type);
        Ext.getCmp('u_card').setDisabled(type);
    }

    //搜索框查询
    function dosearch(){
        var key=Ext.getCmp('search').getValue();
        SUNLINE.baseParams(store,{skey:key,d_org_id:ROW.d_org_id});
        store.currentPage=1;
        store.load();
    }
/*
    Ext.getCmp('d_org_idd').on({'select':function(c,r,n){
        var row= r[0];
        var d_org_id_value=row.get('d_org_id');
        var d_org_name_value=row.get('d_org_name');
        WG.d_org_id=d_org_id_value;
        WG.d_org_name=d_org_name_value;
        SUNLINE.baseParams(store,{d_org_id:d_org_id_value});
        store.currentPage=1;
        store.load();
    }});
*/

    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            win.show();
            var row_data=Ext.apply({},row.data);
            row_data.d_lead_time=row_data.d_lead_time.substr(0,4) + '-' + row_data.d_lead_time.substr(4,2) + '-' + row_data.d_lead_time.substr(6,2) ;
            data=form.getForm().setValues(row_data);
            Ext.getCmp('u_realname').setDisabled(true);
            Ext.getCmp('u_sex').setDisabled(true);
            Ext.getCmp('u_card').setDisabled(true);
            Ext.getCmp('u_mobile').setDisabled(true);
        }else{
            win.show();
            win.setTitle(v.text+"司机信息", v.iconCls);
            Ext.getCmp('u_realname').setDisabled(false);
            Ext.getCmp('u_sex').setDisabled(false);
            Ext.getCmp('u_card').setDisabled(false);
            Ext.getCmp('u_mobile').setDisabled(false);
        }
        win.setTitle(v.text+"司机信息", v.iconCls);
    }


    win.on('show',function(){
        Ext.getCmp('us_orgid').setValue( WG.d_org_id);
    })




    function dosave() {
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var data = form.getForm().getValues();
        //编辑司机
        data['d_org_id']=ROW.d_org_id;

        Ext.Ajax.request({
            url:$__app__ + '/Drivers/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    store.reload();
                    win.hide();
                };

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };


    win.on('hide',function(){
        form.getForm().reset();
    })

    //删除
    function del(){
        var row=SUNLINE.getSelected(grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        };
        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            if(y=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Drivers/del_user',
                    params:{d_id:row.data.d_id,us_id:row.data.us_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            store.reload();
                            win.hide();
                        };

                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }
    ziyo_log({ listeners : [{grid: grid, action:'Drivers', pk_id:'d_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [grid]
    });



});
