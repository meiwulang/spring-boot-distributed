Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/WxCustom/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,true);
    var account;

    var win_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {xtype:'hidden',id:'wc_id',name:"wc_id"},
            {xtype:'textfield',id:'wc_nickname',name:"wc_nickname", fieldLabel:"微信昵称",allowBlank:false,labelWidth:80,width:320,labelAlign:"right"},
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:200,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {xtype:'textfield',name:"wc_account",id:'wc_account', fieldLabel:"客服账号",allowBlank:false},
                    {
                        xtype: 'displayfield',
                        id: 'app_num',
                        name: 'app_num',
                        style:'margin-left:10px;height:24px;line-height:25px;',
                        width:100
                    }
                ]
            },
            {
                xtype: 'displayfield',
                id: 'form_text',
                name: 'form_text',
                value:'<span style="color:#7F7575;margin-left: 80px;">账号由字母，数字组成最多10个字符</span>',
                hidden:true
            },
            {xtype:'textfield',name:"wc_pass",labelAlign:"right",id:'wc_pass', fieldLabel:"客服密码",labelWidth:80,width:320}
        ]
    });

    var add_win=new Ext.Window({
        title : '添加客服',
        layout: 'fit',
        width : 400,
        region:'center',
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[win_form],
        buttons: [
            {text : '确定',handler:save},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

     //上传图片
    var head_img_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"wc_appid", name:"wc_appid", fieldLabel:"公众号",hidden:true},
            {id:"account", name:"account", fieldLabel:"客服账号",hidden:true},
            {name:'material',fieldLabel:"设置头像",xtype:'filefield',allowBlank: false,buttonText: '选择图片'}
        ]
    });

    var head_img_win=new Ext.Window({
        title : '设置头像',
        layout: 'border',
        width : 400,
        height: 130,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[head_img_form],
        buttons: [
            {text : '确定',handler:save_img},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

    add_win.on('hide',function(){
        win_form.getForm().reset();
    })

    add_win.on('show',function(){
        Ext.getCmp('app_num').setValue(account);
    })

    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"wc_id", width:120,hidden:true},
        {header:"昵称", dataIndex:"wc_nickname", width:150},
        {header:"头像", dataIndex:"wc_headimgurl", width:200,renderer:formatPic,align:'center'},
        {header:"账号", dataIndex:"wc_account", width:200},
        {header:"公众号ID", dataIndex:"wc_appid", width:200},
        {header:"客服ID", dataIndex:"wc_kfid", width:150}
    ];

    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
    wxapp_combo.getStore().on('load',function(store,records){
        if(records.length>0){
            wxapp_combo.setValue(records[0].data.wa_appid);
            wxapp_combo.focus();
        }
    });

    wxapp_combo.on('change',function(v,r,o){
        Ext.Ajax.request({
            url:$__app__ + '/WxCustom/get_app_num',
            params:{'wa_appid':r},
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                if(result.status==1){
                    account=result.info;
                }else{
                    Ext.Msg.alert('友情提示',result.info);
                    return;
                }
            }
        })
        var skey = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(store,{'wc_appid':skey});
        store.currentPage = 1;
        store.load();
    });

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        tbar:[
            wxapp_combo,
            {text:'添加',iconCls:'button-add',handler:modify},
            {text:'编辑',iconCls:'button-edit',handler:modify},
            {text:'删除',iconCls:'button-del',handler:del},
            {text:'设置头像',iconCls:'button-edit',handler:function(){
                var row=SUNLINE.getSelected(grid);
                if(!row){
                    Ext.Msg.alert('友情提示','请选择要设置头像的客服！');
                    return false;
                }
                head_img_win.show();
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                Ext.getCmp('wc_appid').setValue(s);
                Ext.getCmp('account').setValue(row.data.wc_account);
            }},
            {text:'同步客服',iconCls:'button-edit',handler:sync}
        ],
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        viewConfig:{
            emptyText:'没有客服信息',
            deferEmptyText:true
        },
        columns:cm,
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有客服信息'
        })
    });

    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });

    function formatPic(v){
        if(v==''){
            return '暂无头像';
        }else{
            return "<img style='height: 20px;width:20px;' src='" + v + "' data-qtip='<div><img src=\""+v+"\" style=\"max-width:400px;;max-height:400px;\"> </div>' class='media_pic'>";
        }
    }

    function modify(v){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('友情提示','请先选择要编辑的客服！');
                return;
            }
            add_win.show();
            win_form.getForm().setValues(row.data);
            Ext.getCmp('wc_account').setHidden(true);
            Ext.getCmp('app_num').setHidden(true);
            Ext.getCmp('form_text').setHidden(true);
        }else{
            add_win.show();
            Ext.getCmp('wc_account').setHidden(false);
            Ext.getCmp('app_num').setHidden(false);
            Ext.getCmp('form_text').setHidden(false);
        }
        add_win.setTitle(v.text+'客服');
    }

    function save_img(){
        if (!head_img_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        head_img_form.submit({
            url:$__app__ + '/WxCustom/save_img',
            waitMsg: '素材上传中...',
            failure:function (response, opts) {
                if(opts.result.success===false){
                    Ext.Msg.alert('友情提示','上传失败，网络传输错误！');
                    return;
                }
                Ext.Msg.alert('友情提示',opts.result.info.msg);
                if(opts.result.status){
                    store.reload();
                    head_img_win.hide();
                }
            }
        });
    }

    function save(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if (!win_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var row = win_form.getForm().getValues();
        row['wc_appid']=s;
        row['wc_account']=row['wc_account']+account;
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/WxCustom/save',
            params:row,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', result.info);
                if(result.status ==1){
                    store.reload();
                    add_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '设置失败');
            }
        })
    }

    function del(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择要删除的客服！');
            return;
        }
       row.data['wc_appid']=s;
        Ext.MessageBox.confirm('友情提示','确定删除该客服吗？',function(v){
            if (v == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxCustom/del',
                    params:row.data,
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '设置失败');
                    }
                })
            }
        })
    }

    function sync(){
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        if(!s){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        Ext.MessageBox.confirm('友情提示','是否确定同步客服？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxCustom/sync',
                    params:{wc_appid:s},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '设置失败');
                    }
                })
            }
        })
    }

})