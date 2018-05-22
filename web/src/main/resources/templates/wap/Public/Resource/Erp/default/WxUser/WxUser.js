Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var first_status=true;     //是否第一次加载页面
    var ajax_status=true;      //加载完所有后向win传递的参数
    var sync_user_list=[];     //缓存数组
    var sync_status=true;      //是否正在同步

    Ext.QuickTips.init();
    var url= $__app__ + '/WxUser/dataJson';
    var store=SUNLINE.JsonStore(url,[],false);

    var group_url= $__app__ + '/WxGroup/get_group';
    var group_store=SUNLINE.JsonStore(group_url,[],false);

    var form_group_url= $__app__ + '/WxGroup/get_group';
    var form_group_store=SUNLINE.JsonStore(form_group_url,[],false);

    var tbar_group_store = Ext.create('Ext.data.Store', {
        model:Ext.data.Model,
        fields:[ "wg_gid","wg_name"],
        data:[]
    });

    group_store.on('load',function(){
        if(group_store.getCount()<1){
            Ext.getCmp('group_id').setValue(-2);
            Ext.getCmp('group_id').setValue(-1);
            tbar_group_store.removeAll();
            Ext.getCmp('show_message').setValue("<span style='color:red;font-size: 14px;font-family: 微软雅黑'> 当前公众号未发现分组，请先同步分组！</span>");
        }else{
            var change_tbar_group=true;
            var old_groupid=Ext.getCmp('group_id').getValue();
            var data=[];
            data.push({wg_gid:-1,wg_name:'全部'});
            var group_store_count=group_store.getCount();
            for(var i=0;i<group_store_count;i++){
                var record=group_store.getAt(i);
                data.push({wg_gid:record.get('wg_gid'),wg_name:record.get('wg_name')});
                if(old_groupid==record.get('wg_gid')){
                    change_tbar_group=false;
                }
            }
            tbar_group_store.loadData(data);
            Ext.getCmp('show_message').setValue("");
            if(change_tbar_group){
                Ext.getCmp('group_id').setValue(-2);
                Ext.getCmp('group_id').setValue(-1);
            }else{
                Ext.getCmp('group_id').setValue(old_groupid);
            }
        }
    })

    var group_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"wg_id", width:120,hidden:true},
        {header:"分组ID", dataIndex:"wg_gid", width:225},
        {header:"分组名称", dataIndex:"wg_name", width:230,editor:{}}
    ]

    var cm=[
        new Ext.grid.RowNumberer({width:30,resizable:true}),
        {header:"ID", dataIndex:"wu_id", width:120,hidden:true},
        {header:"昵称", dataIndex:"wu_nickname", width:120},
        {header:"备注", dataIndex:"wu_remark", width:120},
        {header:"头像", dataIndex:"wu_headimgurl", width:120,renderer:formatPic,align:'center'},
        {header:"所属分组", dataIndex:"wu_groupid", width:120,renderer:check_group},
        {header:"性别", dataIndex:"wu_sex", width:80},
        {header:"地址", dataIndex:"wu_country", width:150,renderer:get_addr},
        {header:"关注时间", dataIndex:"wu_subscribe_time", width:150,renderer:time},
        {header:"UNIONID", dataIndex:"wu_unionid", width:80},
        {header:"关注标记", dataIndex:"wu_subscribe", width:80},
        {header:"OPENID", dataIndex:"wu_openid", width:200},
        {header:"公众号", dataIndex:"wu_appid", width:200}
    ];

    var manage_group_grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        border:false,
        store:group_store,
        loadMask:{msg:'数据载入中，请稍后'},
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        columns:group_cm ,
        viewConfig:{emptyText:'没有分组信息'},
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:group_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有分组数据'
        })
    });

    //添加窗口的表单
    var win_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"wg_id", name:"wg_id", fieldLabel:"ID",hidden:true},
            {id:"wg_name", name:"wg_name", fieldLabel:"分组名称",allowBlank:false}
        ]
    });

    //菜单添加窗口
    var add_win=new Ext.Window({
        title : '添加分组',
        layout: 'border',
        width : 300,
        height: 130,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[win_form],
        buttons: [
            {text : '确定', handler:save_group},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

    //菜单添加窗口
    var schedule_win=new Ext.Window({
        title : '用户同步信息',
        layout: 'border',
        width : 400,
        height: 250,
        bodyStyle:"background:#fff;border:none",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        buttons: [
            {text : '关闭', handler:function(){
                if(sync_status){
                    Ext.Msg.confirm('友情提示', "正在同步信息关闭后会丢失同步进度，是否确认关闭？",function(opt){
                        if(opt=='yes'){
                            ajax_status=false;
                            sync_user_list=[];
                            store.reload();
                            schedule_win.hide();
                        }
                    })
                }else{
                    sync_user_list=[];
                    store.reload();
                    schedule_win.hide();
                }
            }}
        ]
    });

    schedule_win.on('show',function(){
        schedule_win.setHtml("<iframe style='width:100%;height:100%' src='"+$__app__+"/WxUser/sync_user?_dc='"+time()+" name='schedule_iframe' id='schedule_iframe'></iframe>");
    })


    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
    wxapp_combo.getStore().on('load',function(store,records){
        if(records.length>0){
            wxapp_combo.setValue(records[0].data.wa_appid);
            wxapp_combo.focus();
        }
    })

    wxapp_combo.on('change',function(){
        var skey = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(group_store,{'wg_appid':skey});
        group_store.currentPage = 1;
        group_store.load();

        SUNLINE.baseParams(form_group_store,{'wg_appid':skey});
        form_group_store.currentPage = 1;
        form_group_store.load();
    })


    var manage_group_win=new Ext.Window({
        title : '分组管理',
        layout: 'border',
        width : 500,
        height: 450,
        closeAction : 'hide',
        resizable:false,
        bodyStyle:"background:#fff;padding:5;",
        modal:true,
        items:[manage_group_grid],
        tbar:[
            {text:'添加',id:'add_group',iconCls:'button-add',handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                add_win.show();
                add_win.setTitle('添加分组');
            }},
            {text:'编辑',id:'edit_group',iconCls:'button-edit',handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                var row=SUNLINE.getSelected(manage_group_grid);
                if(!row){
                    Ext.Msg.alert('友情提示','请先选择一条要编辑的数据！');
                    return;
                }
                add_win.show();
                add_win.setTitle('编辑分组');
                Ext.getCmp('wg_id').setValue(row.data.wg_id);
                Ext.getCmp('wg_name').setValue(row.data.wg_name);
            }},
            {text:'删除',id:'del_group',iconCls:'button-del',handler:del_group},
            {text:'同步分组',id:'sync_group',iconCls:'button-save',handler:sync_group}

        ],
        buttons: [
            {text : '关闭', handler:function(){manage_group_win.hide();}}
        ]
    });

    var move_user_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {
                labelWidth:80,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"wu_groupid",
                id:"wu_groupid",
                fieldLabel:"分组",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:form_group_store,
                displayField:"wg_name",
                valueField:"wg_gid",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:""
            }
        ]
    });

    var move_user_win=new Ext.Window({
        title : '移动分组',
        layout: 'border',
        width : 310,
        height: 130,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[move_user_form],
        buttons: [
            {text : '确定', handler:move_user},
            {text : '关闭', handler:function(){move_user_win.hide();}}
        ]
    });

    var change_remark_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"wu_remark", name:"wu_remark", fieldLabel:"备注", allowBlank: false}
        ]
    });

    var change_remark_win=new Ext.Window({
        title : '修改备注',
        layout: 'border',
        width : 310,
        height: 130,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[change_remark_form],
        buttons: [
            {text : '确定', handler:change_remark},
            {text : '关闭', handler:function(){change_remark_win.hide();}}
        ]
    });

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        selModel:{
            selType: 'checkboxmodel'
        },
        columns:cm ,
        viewConfig:{emptyText:'没有用户信息'},
        tbar:[
            wxapp_combo,
            {
                labelWidth:30,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"group_id",
                id:"group_id",
                fieldLabel:"分组",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:tbar_group_store,
                displayField:"wg_name",
                valueField:"wg_gid",
                mode:"remote",
                forceSelection:true,
                typeAhead:true,
                value:"全部",
                listeners:{
                    change:function(v,r,o){
                        var appid = Ext.getCmp('wxapp_combo_id').getValue();
                        if(!r){
                            return ;
                        }
                        SUNLINE.baseParams(store,{'wu_appid':appid,'wu_groupid': r});
                        store.currentPage = 1;
                        store.load();
                    }}
            },
            {text:'用户信息操作',iconCls:'button-edit',hidden:isDisabled('WxUser::user'),width:130,
                menu:[
                    {width:130,text:'修改备注',iconCls:'button-edit',handler:change_remark_click},
                    {width:130,text:'移动分组',id:'move_group',iconCls:'button-edit',handler:move_user_click},
                    {width:130,text:'更新用户信息',id:'update_user',iconCls:'button-edit',handler:updata_one_user}
                ]
            },
            {text:'分组管理',id:'manage_group',iconCls:'button-edit',hidden:isDisabled('WxUser::group'),handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                manage_group_win.show();
            }},
            {text:'同步所有用户信息',id:'update_list_user',hidden:isDisabled('WxUser::syncall'),iconCls:'button-edit',handler:function(){
                Ext.Msg.confirm('友情提示', "同步用户需要一定时间，是否确认同步？",function(opt){
                    if(opt=='yes'){
                        first_status=true;
                        ajax_status=true;
                        sync_status=true;
                        sync_user_list=[];
                        updata_list_user();
                        schedule_win.show();
                    }
                })
            }},
            {
                xtype: 'displayfield',
                id: 'show_message',
                name: 'show_message'
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有用户数据'
        })
    });

    function move_user_click(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var row=grid.getSelectionModel().getSelection();
        if(!row || row.length<1){
            Ext.Msg.alert('友情提示','未发现选中信息');
            return;
        }
        move_user_win.show();
    }

    function change_remark_click(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var row=grid.getSelectionModel().getSelection();
        if(row.length==0){
            Ext.Msg.alert('友情提示','请先选择一条要编辑的数据！');
            return;
        }
        if(row.length!=1){
            Ext.Msg.alert('友情提示','只能选择一条数据！');
            return;
        }
        change_remark_win.show();
        Ext.getCmp('wu_remark').setValue(row.data.wu_remark);
    }

    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    })
/******************************* 渲染函数 start ***********************************************/

    function formatPic(v){
        if(v==''){
            return '';
        }else{
            return "<img style='height: 20px;width:20px;' src='" + v + "' data-qtip='<div><img src=\""+v+"\" style=\"max-width:400px;;max-height:400px;\"> </div>' class='media_pic'>";
        }
    }

    function check_group(v){
        var num=group_store.getCount();
        for(var i=0;i<num;i++){
            var wg_gid=group_store.getAt(i).get('wg_gid');
            if(wg_gid==v){
                return group_store.getAt(i).get('wg_name');
            }
        }
    }

    function get_addr(v,r,o){
        var city=r.record.get('wu_city');
        var province=r.record.get('wu_province');
        var country=r.record.get('wu_country');
        var str='';
        if(country){
            str+=country;
        }
        if(province){
            str+='-'+province;
        }
        if(city){
            str+='-'+city;
        }
        return str;
    }

    function time(v){
        if(v==0){
            return;
        }
        v= new Date(parseInt(v)*1000);
        var date = Ext.Date.format(v,'Y-m-d H:i:s');
        return date;
    }

/********************************* 渲染函数 end ***********************************************/


/********************************* 功能函数 start *********************************************/

    //更新单个用户信息
    function updata_one_user(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var row=grid.getSelectionModel().getSelection();
        if(row.length!=1){
            Ext.Msg.alert('友情提示','请先选择一条要编辑的数据！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认更新？",function(opt){
            if(opt=='yes'){
                Ext.Ajax.request({
                    url:$__app__+'/WxUser/updata_one_user',
                    params:{'wu_id':row[0].data.wu_id},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.status==1){
                            change_remark_win.hide();
                            Ext.Msg.alert('友情提示','更新成功！');
                            store.load();
                        }
                    },
                    failure:function (response, otps) {

                    }
                })
            }
        })
    }

    //修改备注
    function change_remark(){
        var row=SUNLINE.getSelected(grid);
        var form_row= change_remark_form.getForm().getValues();
        Ext.Msg.confirm('友情提示', "是否确认修改？",function(opt){
            if(opt=='yes'){
                Ext.Ajax.request({
                    url:$__app__+'/WxUser/change_remark',
                    params:{'wu_id':row.data.wu_id,'wu_remark':form_row.wu_remark},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.status==1){
                            change_remark_win.hide();
                            Ext.Msg.alert('友情提示','修改成功！');
                            store.load();
                        }
                    },
                    failure:function (response, otps) {

                    }
                })
            }
        })
    }

    //移动分组
    function move_user(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var rows=grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何记录');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认移动分组？",function(opt){
            if(opt=='yes'){
                var wu_id='';
                var wu_openid='';
                for(var i=0;i<rows.length;i++){
                    wu_id+=rows[i]['data']['wu_id']+',';
                    wu_openid+=rows[i]['data']['wu_openid']+',';
                }
                wu_id=wu_id.substr(0,wu_id.length-1);
                wu_openid=wu_openid.substr(0,wu_openid.length-1);
                var form_row= move_user_form.getForm().getValues();
                Ext.Ajax.request({
                    url:$__app__+'/WxUser/change_group',
                    params:{'wu_appid':s,'wu_id':wu_id,'wu_openid':wu_openid,'wu_groupid':form_row.wu_groupid},
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',ret.info);
                        if (ret.status){
                            move_user_win.hide();
                            store.load();
                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示','移动失败');
                    }
                })
            }
        })
    }

    //删除
    function del_group(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var row=SUNLINE.getSelected(manage_group_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择一条要删除的数据！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认删除？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxGroup/del_group',
                    method:'POST',
                    params : {wg_id:row.data.wg_id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            group_store.load();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }


    /*manage_group_grid.on('validateedit',function(i,g){
        if ( g.value == g.originalValue ) return false;
        var row=SUNLINE.getSelected(manage_group_grid);
        if(g.value.replace(/[^\x00-\xff]/g,"aaa").length>16){
            Ext.Msg.alert('友情提示', '分组名过长');
            return;
        }
        Ext.Ajax.request({
            url:$__app__+'/WxGroup/save_group',
            params:{wg_id:row.data.wg_id,wg_name:g.value},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.status!=1){
                    g.cancel = true;
                }
            },
            failure:function (response, otps) {

            }
        })
    })*/

//添加，编辑
    function save_group(){
        var row= win_form.getForm().getValues();
        if(!win_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        if(row.wg_name.replace(/[^\x00-\xff]/g,"aaa").length>16){
            Ext.Msg.alert('友情提示', '分组名过长');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认添加？",function(opt){
            if(opt=='yes'){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxGroup/save_group',
                    method:'POST',
                    params :  {wg_appid:s,wg_name:row.wg_name,wg_id:row.wg_id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            group_store.load();
                            add_win.hide();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })

    }

    add_win.on('hide',function(){
        win_form.form.reset();
    })

    //同步分组函数
    function sync_group(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认同步？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxGroup/sync_group',
                    method:'POST',
                    params :  {wg_appid:s},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            group_store.load();
                        }else{
                            Ext.Msg.alert('友情提示',ret.info);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

    //批量更新用户信息
     window.updata_list_user=function(){
        if(!ajax_status)return;
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        Ext.Ajax.request({
            url : $__app__ + '/WxUser/get_users_info',
            method:'POST',
            params :  {'wu_appid':s,first_status:first_status},
            success : function(response, opts){
               var ret = Ext.decode(response.responseText);
                if(ret.status==1){
                    first_status=false;
                    if(!ret.info.status && !ret.info.data){
                        ajax_status=false;
                        return;
                    }else if(ret.info.status && ret.info.data=='empty'){
                        set_array_data([{errcode:2}]);
                    }else if(ret.info.status && ret.info.data=='error'){
                        set_array_data([{errcode:1}]);
                    }else if(ret.info.status){
                        set_array_data(ret.info.data);
                    }
                    updata_list_user();
                }else{
                    Ext.Msg.alert('友情提示', ret.info);
                }
            },
            failure : function(response, opts){
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    window.set_array_data=function(data){
        if(data.length>0){
            if(!data.errcode){
                data.push({'errcode':'pageover'});
            }
            sync_user_list=sync_user_list.concat(data);
        }
    }

    window.get_array_data=function(){
        if(!sync_status){
            return false;
        }
        if(sync_user_list.length>0){
            var val=sync_user_list.shift();
            return val;
        }else{
            if(ajax_status){
                return 'empty';
            }else{
                sync_status=false;
                return false;
            }
        }
    }

/********************************* 功能函数 end **********************************************/




})