Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/WxQrcode/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);

    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"wq_id", width:120,hidden:true},
        {header:"公众号ID", dataIndex:"wq_appid", width:120,hidden:true},
        {header:"Ticket", dataIndex:"wq_ticket", width:150},
        {header:"场景值", dataIndex:"wq_scene", width:150},
        {header:"二维码", dataIndex:"wq_url", width:130,renderer:formatPic,align:'center'},
        {header:"创建时间", dataIndex:"wq_start_time",id:'grid_start_time', width:150,renderer:start_time,hidden:true},
        {header:"失效时间", dataIndex:"wq_end_time",id:'grid_end_time', width:150,renderer:end_time,hidden:true},
        {header:"有效时间", dataIndex:"wq_valid_time",id:'grid_valid_time', width:150,renderer:valid_time,hidden:true},
        {header:"备注", dataIndex:"wq_remark", width:120}
    ]

    //编辑窗口的表单
    var edit_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:330,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"wq_id", name:"wq_id", fieldLabel:"ID",hidden:true},
            {id:"wq_ticket", name:"wq_ticket", fieldLabel:"Ticket",readOnly:true},
            {id:"wq_end_time", name:"wq_end_time", fieldLabel:"失效时间",readOnly:true},
            {id:"wq_url", name:"wq_url_edit", fieldLabel:"地址",readOnly:true},
            {id:"wq_remark_edit", name:"wq_remark_edit", fieldLabel:"备注"}
        ]
    });

    //添加窗口的表单
    var add_form=new Ext.form.FormPanel({
        border:false,
        region:'center',
        bodyStyle:"background:#fff;padding:5;",
        autoHeight:true,
        defaults:{xtype:'textfield',labelWidth:80,width:250,labelAlign:"right",style:'margin-top:10px;'},
        items:[
            {id:"wq_scene", name:"wq_scene",fieldLabel:"场景值",allowBlank:false},
            {
                xtype: 'radiogroup',
                fieldLabel: '有效期类型',
                labelWidth:80,
                labelAlign:"right",
                columns: 2,
                id:'wq_time_type',
                name:'wq_time_type',
                items: [
                    { boxLabel: '秒', name: 'wq_time_type', inputValue: '秒',checked: true},
                    { boxLabel: '分钟', name: 'wq_time_type', inputValue: '分钟'},
                    { boxLabel: '小时', name: 'wq_time_type', inputValue: '小时'},
                    { boxLabel: '天', name: 'wq_time_type', inputValue: '天'}
                ],
                listeners:{
                    change:function(i,n){
                        Ext.getCmp('wq_valid_time').focus();
                        switch(n.wq_time_type){
                            case '秒':
                                Ext.getCmp('wq_valid_time').minValue=60;
                                Ext.getCmp('wq_valid_time').maxValue=2592000;
                                break;
                            case '分钟':
                                Ext.getCmp('wq_valid_time').minValue=1;
                                Ext.getCmp('wq_valid_time').maxValue=43200;
                                break;
                            case '小时':
                                Ext.getCmp('wq_valid_time').minValue=1;
                                Ext.getCmp('wq_valid_time').maxValue=720;
                                break;
                            case '天':
                                Ext.getCmp('wq_valid_time').minValue=1;
                                Ext.getCmp('wq_valid_time').maxValue=30;
                                break;
                        }
                        Ext.getCmp('wq_time_type').focus();
                    }
                }
            },
            {id:"wq_valid_time",xtype:'numberfield',name:"wq_valid_time", fieldLabel:"有效期",allowBlank:false,minValue:60,maxValue:2592000},
            {id:"wq_remark_add", name:"wq_remark_add", fieldLabel:"备注"}
        ]
    });

    //菜单添加窗口
    var add_win=new Ext.Window({
        title : '添加二维码',
        layout: 'fit',
        width : 300,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[add_form],
        buttons: [
            {text : '保存', handler:add_qrcode},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

     //编辑窗口
    var edit_win=new Ext.Window({
        title : '编辑二维码',
        layout: 'fit',
        width : 400,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[edit_form],
        buttons: [
            {text : '保存', handler:edit_qrcode},
            {text : '关闭', handler:function(){edit_win.hide();}}
        ]
    });


    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
    wxapp_combo.getStore().on('load',function(store,records){
        if(records.length>0){
            wxapp_combo.setValue(records[0].data.wa_appid);
            wxapp_combo.focus();
        }
    })

    wxapp_combo.on('change',function(){
        var skey = Ext.getCmp('wxapp_combo_id').getValue();
        var check_type = Ext.getCmp('check_type').getText();
        var show_ed = Ext.getCmp('show_ed').getText();
        if(check_type=='切换到永久二维码'){
            var type='QR_SCENE';
            if(show_ed=='显示未过期'){
                var status='显示已过期';
            }else{
                var status='显示未过期';
            }
            Ext.getCmp('show_ed').setHidden(false);
            Ext.getCmp('grid_valid_time').setHidden(false);
            Ext.getCmp('grid_end_time').setHidden(false);
            Ext.getCmp('grid_start_time').setHidden(false);
        }else{
            var type='QR_LIMIT_STR_SCENE';
            var status='';
            Ext.getCmp('show_ed').setHidden(true);
            Ext.getCmp('grid_valid_time').setHidden(true);
            Ext.getCmp('grid_end_time').setHidden(true);
            Ext.getCmp('grid_start_time').setHidden(true);
        }
        SUNLINE.baseParams(store,{'wq_appid':skey,'wq_type':type,'status':status});
        store.currentPage = 1;
        store.load();
    })

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        tbar:[
            wxapp_combo,
            {text:'添加',iconCls:'button-add',hidden:isDisabled('WxQrcode::add'),handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                add_win.show();
                var btn_str=Ext.getCmp('check_type').getText();
                if(btn_str=='切换到永久二维码'){
                    add_win.setTitle('添加临时二维码');
                }else{
                    add_win.setTitle('添加永久二维码');
                }
            }},
            {text:'编辑',id:'edit_btn',iconCls:'button-edit',hidden:isDisabled('WxQrcode::edit'),handler:function(){
                var s = Ext.getCmp('wxapp_combo_id').getValue();
                if(!s){
                    Ext.Msg.alert('友情提示','请先选择一个公众号！');
                    return;
                }
                var row=SUNLINE.getSelected(grid);
                if(!row){
                    Ext.Msg.alert('友情提示','请先选择一条要编辑的数据！');
                    return;
                }
                edit_win.show();
                Ext.getCmp('wq_id').setValue(row.data.wq_id);
                Ext.getCmp('wq_remark_edit').setValue(row.data.wq_remark);
                Ext.getCmp('wq_ticket').setValue(row.data.wq_ticket);
                Ext.getCmp('wq_end_time').setValue(end_time(row.data.wq_end_time));
                Ext.getCmp('wq_url').setValue(row.data.wq_url);
            }},
            {text:'切换到临时二维码',name:'check_type',id:'check_type', enableToggle: true, pressed: false,
                toggleHandler:function(item, pressed){
                    var s = Ext.getCmp('wxapp_combo_id').getValue();
                    if(!s){
                        Ext.Msg.alert('友情提示','请先选择一个公众号！');
                        return;
                    }
                    if(pressed){
                        Ext.getCmp('show_ed').setHidden(false);
                        item.setText("切换到永久二维码");
                        var type='QR_SCENE';
                        var show_ed=Ext.getCmp('show_ed').getText();
                        if(show_ed=='显示已过期'){
                            var status='显示未过期';
                        }else{
                            var status='显示已过期';
                        }
                        Ext.getCmp('grid_valid_time').setHidden(false);
                        Ext.getCmp('grid_end_time').setHidden(false);
                        Ext.getCmp('grid_start_time').setHidden(false);
                    }else{
                        Ext.getCmp('show_ed').setHidden(true);
                        item.setText("切换到临时二维码");
                        Ext.getCmp('grid_valid_time').setHidden(true);
                        Ext.getCmp('grid_end_time').setHidden(true);
                        Ext.getCmp('grid_start_time').setHidden(true);
                        var type='QR_LIMIT_STR_SCENE';
                        var status='';

                    }
                    var skey = Ext.getCmp('wxapp_combo_id').getValue();
                    SUNLINE.baseParams(store,{'wq_appid':skey,'wq_type':type,'status':status});
                    store.currentPage = 1;
                    store.load();
                }
            },
            {text:'显示已过期',name:'show_ed',id:'show_ed',hidden:true,enableToggle: true, pressed: false,
                toggleHandler:function(item, pressed){
                    if(pressed){
                        item.setText("显示未过期");
                        var status='显示已过期';
                    }else{
                        item.setText("显示已过期");
                        var status='显示未过期';
                    }
                    var skey = Ext.getCmp('wxapp_combo_id').getValue();
                    SUNLINE.baseParams(store,{'wq_appid':skey,'wq_type':'QR_SCENE','status':status});
                    store.currentPage = 1;
                    store.load();
                }
            }
        ],
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        viewConfig:{
            emptyText:'没有二维码信息',
            deferEmptyText:true
        },
        columns:cm,
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有二维码数据'
        })
    });

    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    })


    function add_qrcode(){
        if(!add_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var row= add_form.getForm().getValues();
        if(row['wq_time_type']){
            var valid_time=parseInt(row['wq_valid_time']);
            switch (row['wq_time_type'])
            {
                case '秒':
                    valid_time=valid_time;
                    break;
                case '分钟':
                    valid_time=valid_time*60;
                    break;
                case '小时':
                    valid_time=valid_time*3600;
                    break;
                case '天':
                    valid_time=valid_time*86400;
                    break;
            }
            if(valid_time>2592000 || valid_time<60){
                Ext.Msg.alert('友情提示', '有效时间设置不正确！');
                return;
            }
        }
        var s = Ext.getCmp('wxapp_combo_id').getValue();
        var type=Ext.getCmp('check_type').getText();
        if(type=='切换到永久二维码'){
            row['wq_type']='QR_SCENE';
            row['wq_valid_time']=valid_time;
        }else{
            if(row.wq_scene.replace(/[^\x00-\xff]/g,"aa").length>40){
                Ext.Msg.alert('友情提示', '场景值设置不正确');
                return;
            }
            row['wq_type']='QR_LIMIT_STR_SCENE';
        }
        row['wq_appid']=s;
        row['status']=0;
        Ext.Msg.confirm('友情提示', "是否确认添加？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxQrcode/add_qrcode',
                    method:'POST',
                    params : row,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info.msg);
                            store.load();
                            add_win.hide();
                        }else{
                            if(ret.info.status==1){
                                Ext.Msg.confirm('友情提示', ret.info.msg,function(opt){
                                    if(opt=='yes'){
                                        row['status']=1;
                                        Ext.Ajax.request({
                                            url : $__app__ + '/WxQrcode/add_qrcode',
                                            method:'POST',
                                            params : row,
                                            success : function(response, opts){
                                                var ret = Ext.decode(response.responseText);
                                                if(ret.status==1){
                                                    Ext.Msg.alert('友情提示',ret.info.msg);
                                                    store.load();
                                                    add_win.hide();
                                                }else{
                                                    Ext.Msg.alert('友情提示',ret.info.msg);
                                                }
                                                myMask.hide();
                                            },
                                            failure : function(response, opts){
                                                Ext.Msg.alert('友情提示', '操作失败！');
                                            }
                                        })
                                    }
                                })
                            }else{
                                Ext.Msg.alert('友情提示',ret.info.msg);
                            }
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

    function edit_qrcode(){
        var row= edit_form.getForm().getValues();
        if(!edit_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.Msg.confirm('友情提示', "是否确认保存？",function(opt){
            if(opt=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxQrcode/edit_qrcode',
                    method:'POST',
                    params : {wq_id:row.wq_id,wq_remark:row.wq_remark_edit},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        if(ret.status==1){
                            Ext.Msg.alert('友情提示',ret.info);
                            store.load();
                            edit_win.hide();
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


/*win处理操作开始*/

    edit_win.on('show',function(){
        var type=Ext.getCmp('check_type').getText();
        if(type=='切换到永久二维码'){
            Ext.getCmp('wq_end_time').setHidden(false);
        }else{
            Ext.getCmp('wq_end_time').setHidden(true);
        }
    })

    edit_win.on('hide',function(){
        edit_form.form.reset();
    })

    add_win.on('show',function(){
        var type=Ext.getCmp('check_type').getText();
        if(type=='切换到永久二维码'){
            Ext.getCmp('wq_scene').regex=/^[1-9]\d{0,31}$/;
            Ext.getCmp('wq_valid_time').enable().setHidden(false);
            Ext.getCmp('wq_time_type').enable().setHidden(false);
        }else{
            Ext.getCmp('wq_scene').regex=null;
            Ext.getCmp('wq_valid_time').disable().setHidden(true);
            Ext.getCmp('wq_time_type').disable().setHidden(true);
        }
    })

    add_win.on('hide',function(){
        add_form.form.reset();
    })

/*win处理操作结束*/



/*渲染函数开始*/

    function getQrImage(v){
        if(v==''){
            return '';
        }else{
            v=encodeURIComponent(v);
            return $__app__+'/WxQrcode/qrcode?data='+v;
        }
    };

    function formatPic(v){
        if(v==''){
            return '';
        }else{
            var wq_url=getQrImage(v);
            return "<img style='height: 20px;width:20px;' src='" + wq_url + "' data-qtip='<div style=\"width:300px;height:300px;\"><img src=\""+wq_url+"\" style=\"max-width:100%;max-height:100%;\"> </div>' class='media_pic'>";
        }
    }

    function start_time(v,m,r){
        if(r.get('wq_valid_time')==0){
            return ;
        }
        var end_time =parseInt(r.get('wq_end_time'));
        var valid_time =parseInt(r.get('wq_valid_time'));
        var time= new Date(parseInt((end_time-valid_time)*1000));
        var date =Ext.Date.format(time,'Y-m-d H:i:s');
        return date;

    }

    function end_time(v){
        if(v==0){
            return;
        }
        v= new Date(parseInt(v)*1000);
        var date = Ext.Date.format(v,'Y-m-d H:i:s');
        return date;
    }

    function valid_time(v){
        if(v==0){
            return;
        }
        var v=parseInt(v);
        var days=Math.floor(v/86400);
        var hours=Math.floor((v%86400)/3600);
        var mins=Math.floor((v%3600)/60);
        var seconds=v%60;
        var str='';
        if(days>0){
            str+=days+'天';
        }
        if(hours>0){
            str+=days+'小时';
        }
        if(mins>0){
            str+=mins+'分钟';
        }
        if(seconds>0){
            str+=seconds+'秒';
        }
        return str;
    }

/*渲染函数结束*/



})