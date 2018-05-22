Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '公众号管理';

    var wa_url = $__app__ + '/WxApp/dataJson';
    var wa_store = new SUNLINE.JsonStore(wa_url);

    var wa_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID号", dataIndex:"wa_id", width:60, hidden:true},
        {header:"默认", dataIndex:"wa_name", width:50,renderer:format_flag},
        {header:"公众号名称", dataIndex:"wa_name", width:140},
        {header:"公众号", dataIndex:"wa_num", width:140},
        {header:"appid", dataIndex:"wa_appid", width:140},
        {header:"secret", dataIndex:"wa_secret", width:160,renderer:format_secret},
        {header:"token", dataIndex:"wa_token", width:120},
        {header:"服务器地址", dataIndex:"wa_appid", width:500,renderer:format_url},
        {header:"EncodingAESKey", dataIndex:"wa_aeskey", width:200}
    ];

    var wa_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:wa_store,
        style :'border-right-width:1px;',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有公众号信息',
            deferEmptyText:true
        },
        columns:wa_cm,
        tbar:[
            {text:'添加', iconCls:'button-add',handler:modify,hidden:isDisabled('WxApp::add')},
            {text:'编辑', iconCls:'button-edit',handler:modify,hidden:isDisabled('WxApp::edit')},
            {text:'删除', iconCls:'button-del',handler:del,hidden:isDisabled('WxApp::del')},
            {text:'清除access_token', iconCls:'button-clear',handler:clear,hidden:isDisabled('WxApp::clear')},
            {text:'设为默认', iconCls:'button-edit',handler:set_default,hidden:isDisabled('WxApp::set_default')},
            '<span style="color:#009DDA;font-size: 15px;font-family:微软雅黑">有红旗标识的为默认公众号</span>'
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:wa_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有公众号信息'
        })
    });
    
     var wa_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%'},
        items:[
            {id:"wa_id", name:"wa_id", fieldLabel:"ID", maxLength:10, xtype:"hidden",labelAlign:"right"},
            {id:"wa_name", name:"wa_name", fieldLabel:"公众号名称",labelAlign:"right", allowBlank:false,vtype:'NotBlank'},
            {id:"wa_num", name:"wa_num", fieldLabel:"公众号",labelAlign:"right"},
            {id:"wa_appid", name:"wa_appid", fieldLabel:"AppID",labelAlign:"right", allowBlank:false,vtype:'NotBlank',listeners:{
                'blur':function(){
                    Ext.getCmp('wa_url').setValue('http://'+$http_host+$__app__+'/WxResponse/index/appid/'+Ext.getCmp('wa_appid').getValue());
                }
            }},
            {id:"wa_secret", name:"wa_secret", fieldLabel:"AppSecret",labelAlign:"right",allowBlank:false,vtype:'NotBlank'},
            {id:"wa_aeskey", name:"wa_aeskey", fieldLabel:"EncodingAESKey",labelAlign:"right",allowBlank:false,},
            {id:"wa_token", name:"wa_token", fieldLabel:"Token",labelAlign:"right",allowBlank:false,},
            {id:"wa_url", name:"wa_url", fieldLabel:"服务器地址",labelAlign:"right",enableKeyEvents:true,listeners:{
                'keyup':function(){
                    Ext.getCmp('wa_url').setValue('http://'+$http_host+$__app__+'/WxResponse/index/appid/'+Ext.getCmp('wa_appid').getValue());
                }
            }}
        ]
    });

    var wa_win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:wa_form,
        buttons:[
            {text:'保存', handler:wa_save},
            {text:'关闭', handler:function () {
                wa_win.hide();
            }}
        ]
    });

    function wa_save(){
        if (!wa_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = wa_form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/WxApp/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    wa_store.reload();
                    wa_win.hide();
                }
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(wa_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            wa_win.show();
            row.data.wa_url='http://'+$http_host+$__app__+'/WxResponse/index/appid/'+row.data.wa_appid;
            wa_form.getForm().setValues(row.data);
        }else{
            wa_win.show();
        }
        wa_win.setTitle(v.text+"公众号信息", v.iconCls);
    }

    //添加-修改方法
    function set_default(){
        var row=SUNLINE.getSelected(wa_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的公众号！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定将该公众号设为默认吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxApp/set_default',
                    params:{wa_id:row.data.wa_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            wa_store.reload();
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

    //删除
    function del(){
        var row=SUNLINE.getSelected(wa_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的公众号！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该公众号吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxApp/del',
                    params:{wa_id:row.data.wa_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            wa_store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        })
    }

    function clear(){
        var row=SUNLINE.getSelected(wa_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的公众号！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定清除该公众号的access_token吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxApp/clear_access_token',
                    params:{wa_appid:row.data.wa_appid},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败');
                    }
                })
            }
        })
    }


    function format_secret(v){
        if(v!=''){
            return v.substr(0,6)+'********'+ v.substr(-6,6);
        }
        return v;
    }

    function format_url(v){
        if(v!=''){
            var str='http://'+$http_host+$__app__+'/WxReponse/index/appid/'+v;
            return str;
        }
        return v;
    }

    function format_flag(v,i,r){
        var wa_default= r.get('wa_default');
        if(wa_default=='是'){
            return '<i class="fa fa-flag" style="color:red"></i> ';
        }else{
            return '';
        }
    }

    wa_win.on('hide',function(){
        wa_form.getForm().reset();
    });

    new Ext.Viewport({
        layout : 'border',
        items : [wa_grid]
    });

});
