Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var url= $__app__ + '/WxMedia/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);
    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"wme_id", width:50, hidden:true},
        {header:"素材ID", dataIndex:"wme_mediaid", width:150,align:'center'},
        {header:"素材内容", dataIndex:"wme_url", width:150,renderer:formatMedia},
        {header:"素材类型", dataIndex:"wme_type", width:150,renderer:get_type,align:'center'},
        {header:"创建时间", dataIndex:"wme_make_time", width:150,renderer:time,align:'center'},
        {header:"过期时间", dataIndex:"wme_end_time", width:150,renderer:time,align:'center'},
        {header:"素材标题", dataIndex:"wme_video_title", width:150,align:'center'},
        {header:"素材描述", dataIndex:"wme_video_introduction", width:150,align:'center'}
    ];


    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
    wxapp_combo.getStore().on('load',function(store,records){
        if(records.length>0){
            wxapp_combo.setValue(records[0].data.wa_appid);
            wxapp_combo.focus();
        }
    })

    wxapp_combo.on('change',function(){
        Ext.getCmp('show_ed').setHidden(true);
        Ext.getCmp('wme_type_btn').setValue('image');
        Ext.getCmp('check_type').setText("切换到临时素材");
        var appid = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(store,{wme_appid:appid,type:'永久',wme_type:'image'});
        store.currentPage = 1;
        store.load();
    })

    var grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:store,
        columns:cm,
        loadMask:{msg:'数据载入中，请稍后'},
        tbar:[
            wxapp_combo,
            {
                name:"wme_type_btn",
                id:"wme_type_btn",
                fieldLabel:"类型",
                labelWidth:30,
                width:110,
                labelAlign:'left',
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                displayField:'combo_value',
                valueField:'input_value',
                value:'image',
                store:new Ext.data.SimpleStore({
                    fields:['combo_value','input_value'],
                    data:[
                        ['图片','image'],
                        ['视频','video'],
                        ['音频','voice']
                    ]
                }),
                listeners:{
                    'change':function(i,n){
                        var appid = Ext.getCmp('wxapp_combo_id').getValue();
                        var param={};
                        param.wme_appid=appid;
                        var btn_text=Ext.getCmp('check_type').getText();
                        if(btn_text=='切换到临时素材'){
                            param.type='永久';
                        }else{
                            var status_text=Ext.getCmp('show_ed').getText();
                            if(status_text=='显示未过期'){
                                param.status='显示已过期';
                            }else{
                                param.status='显示未过期';
                            }
                        }
                        param.wme_type=n;
                        SUNLINE.baseParams(store,param);
                        store.currentPage = 1;
                        store.load();
                    }
                }
            },
            {text:'添加',iconCls:'button-add',handler:add_media,hidden:isDisabled('WxMedia::add')},
            {text:'删除',id:'edit_btn',iconCls:'button-edit',handler:del_media,hidden:isDisabled('WxMedia::del')},
            {text:'切换到临时素材',name:'check_type',id:'check_type', enableToggle: true, pressed: false,
                toggleHandler:function(item, pressed){
                    var s = Ext.getCmp('wxapp_combo_id').getValue();
                    if(!s){
                        Ext.Msg.alert('友情提示','请先选择一个公众号！');
                        return;
                    }
                    var param={};
                    param.wme_appid=s;
                    if(item.getText()=='切换到临时素材'){
                        Ext.getCmp('show_ed').setHidden(false);
                        item.setText("切换到永久素材");
                        param.type='临时';
                        var status_text=Ext.getCmp('show_ed').getText();
                        if(status_text=='显示未过期'){
                            param.status='显示已过期';
                        }else{
                            param.status='显示未过期';
                        }
                    }else{
                        Ext.getCmp('show_ed').setHidden(true);
                        item.setText("切换到临时素材");
                        param.type='永久';
                    }
                    var wme_type=Ext.getCmp('wme_type_btn').getValue();
                    param.wme_type=wme_type;
                    SUNLINE.baseParams(store,param);
                    store.currentPage = 1;
                    store.load();
                }
            },
            {text:'显示已过期',name:'show_ed',id:'show_ed',hidden:true,enableToggle: true, pressed: false,
                toggleHandler:function(item, pressed){
                    var s = Ext.getCmp('wxapp_combo_id').getValue();
                    if(!s){
                        Ext.Msg.alert('友情提示','请先选择一个公众号！');
                        return;
                    }
                    if(item.getText()=='显示已过期'){
                        item.setText("显示未过期");
                        var status='显示已过期';
                    }else{
                        item.setText("显示已过期");
                        var status='显示未过期';
                    }
                    var wme_type=Ext.getCmp('wme_type_btn').getValue();
                    SUNLINE.baseParams(store,{wme_appid:s,type:'临时',wme_type:wme_type,status:status});
                    store.currentPage = 1;
                    store.load();
                }
            }
        ],
        viewConfig:{
            emptyText:'没有素材信息',
            deferEmptyText:true
        },
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有素材信息'
        })
    });

    var add_form= new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none; padding:10px;',
        defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {name:'material',fieldLabel:"素材",xtype:'filefield',allowBlank: false,buttonText: '选择素材'},
            {id:"wme_video_title", name:"wme_video_title", fieldLabel:"视频标题"},
            {id:"wme_video_introduction", name:"wme_video_introduction", fieldLabel:"视频描述",xtype:'textarea'},
            {id:'wme_type',name: 'wme_type',xtype:'hidden',value:'image'},
            {id:'wme_media_status',name: 'wme_media_status',xtype:'hidden',value:'临时'},
            {id:'wme_appid',name:'wme_appid',xtype: 'hidden',value:''},
            {name:'force_ajax_flag',xtype: 'hidden',value:'1'}
        ]
    });

//素材添加窗口
    var add_win=new Ext.Window({
        title : '添加素材',
        autoHeight:true,
        width : 400,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items:[add_form],
        buttons: [
            {text : '保存', handler:upload_media},
            {text : '关闭', handler:function(){add_win.hide();}}
        ]
    });

    add_win.on('hide',function(){
        add_form.form.reset();
    })

    add_win.on('show',function(){
        var wme_type=Ext.getCmp('wme_type_btn').getValue();
        var wme_appid = Ext.getCmp('wxapp_combo_id').getValue();
        var wme_media_status = Ext.getCmp('check_type').getText();
        if(wme_media_status=='切换到临时素材'){
            wme_media_status='永久';
        }else{
            wme_media_status='临时';
        }
        if(wme_type=='video'){
            Ext.getCmp('wme_video_title').enable().setHidden(false);
            Ext.getCmp('wme_video_introduction').enable().setHidden(false);
        }else{
            Ext.getCmp('wme_video_title').disable().setHidden(true);
            Ext.getCmp('wme_video_introduction').disable().setHidden(true);
        }
        Ext.getCmp('wme_appid').setValue(wme_appid);
        Ext.getCmp('wme_type').setValue(wme_type);
        Ext.getCmp('wme_media_status').setValue(wme_media_status);
    })


    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    })

    function get_type(v){
        if(v=='image'){
            return '图片';
        }else if(v=='video'){
            return '视频';
        }else if(v=='voice'){
            return '音频';
        }
    }

    function formatMedia(v,m,r){
        var wme_type = r.get("wme_type");
        v=$app_root+v;
        if(v!='' && wme_type=='image'){
            return "<img style='height: 20px;width:30px;' src='" + v + "' data-qtip='<img src=\""+v+"\" style=\"max-width:600px;max-height:500px;\">' class='media_pic'>";
        }else if(wme_type=='video'){
            return '<i class="fa fa-film" style="font-size: 18px;" '+"data-qtip=\"<div style='text-align: center;'><video style='width: 550px;height:460px;' controls='controls' autoplay='autoplay'>"+
            "<source src='" + v + "' type='video/ogg' />"+
            "<source src='" +v + "' type='video/mp4' />" +
            "<source src='" + v + "' type='video/webm' />" +
            "<object data='" + v + "'><embed src='" + v + "' /></object></video></div>\"></i>";
        }else{
            return '<i class="fa fa-headphones" style="font-size: 18px;" data-qtip="<div style=\'padding-top:20px;width:400px;height:500px;\'><embed height=\'100\' width=\'400\' src=' + v + '></embed></div>"></i>';
        }
    };

    function time(v,metaData, record, rowIndex, colIndex){
        if(v==0){
            return '永久有效';
        }
        v= new Date(parseInt(v)*1000);
        var current_time=new Date();
        var date = Ext.Date.format(v,'Y-m-d H:i:s');
        if(current_time>v && colIndex==6){
            return '<span style="color:red">'+date+'</span>';
        }else{
            return date;
        }
    }

    function upload_media(){
        if (!add_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        add_form.submit({
            url:$__app__ + '/WxMedia/save',
            waitMsg: '素材上传中...',
            failure:function (response, opts) {
                if(opts.result.success===false){
                    Ext.Msg.alert('友情提示','上传失败，网络传输错误！');
                    return;
                }
                Ext.Msg.alert('友情提示',opts.result.info.msg);
                if(opts.result.status){
                    store.reload();
                    add_win.hide();
                }
            }
        });
    }

    function add_media(){
        var wxapp_id = Ext.getCmp('wxapp_combo_id').getValue();
        if(!wxapp_id){
            Ext.Msg.alert('友情提示','请先选择一个公众号！');
            return;
        }
        var btn_str=Ext.getCmp('check_type').getText();
        var wme_type=get_type(Ext.getCmp('wme_type_btn').getValue());
        add_win.show();
        if(btn_str=='切换到永久素材'){
            add_win.setTitle('添加临时'+wme_type+'素材');
        }else{
            add_win.setTitle('添加永久'+wme_type+'素材');
        }
    }

    function del_media(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择一条要删除的数据！');
            return;
        }
        Ext.MessageBox.confirm('友情提示','删除后其他使用该素材的功能将无法正常使用,确定？',function(id){
            if(id=='yes'){
                var wme_appid = Ext.getCmp('wxapp_combo_id').getValue();
                var param={wme_id:row.data.wme_id,wme_mediaid:row.data.wme_mediaid,wme_appid:wme_appid};
                if(row.data.wme_end_time==0){
                    param.wme_status='forever';
                }
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/WxMedia/del_media',
                    method:'POST',
                    params :param,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',ret.info);
                        if(ret.status){
                            store.reload();
                        }
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

})