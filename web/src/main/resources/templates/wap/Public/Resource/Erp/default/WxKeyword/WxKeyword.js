WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '微信自动回复设置';
    var news_data=[];
    var first_load_flag=true;

    var edit_type='image';

    var wk_store = Ext.create('Ext.data.Store', {
        fields:['wk_msg_type','name'],
        data:[
                {wk_msg_type:'text',name:'文本消息'},
                {wk_msg_type:'voice',name:'语音消息'},
                {wk_msg_type:'video',name:'视频消息'},
                {wk_msg_type:'image',name:'图片消息'},
                {wk_msg_type:'shortvideo',name:'小视频消息'},
                {wk_msg_type:'location',name:'地理位置'},
                {wk_msg_type:'link',name:'链接消息'},
                {wk_msg_type:'event_subscribe',name:'关注事件'},
                {wk_msg_type:'event_scan',name:'扫码事件'},
                {wk_msg_type:'event_unsubscribe',name:'取消关注事件'},
                {wk_msg_type:'event_location',name:'上报地理位置事件'},
                {wk_msg_type:'event_view',name:'跳转链接事件事件'},
                {wk_msg_type:'event_click',name:'菜单点击事件'},
                {wk_msg_type:'no_content',name:'任意类型'}
        ]
    });

    var wk_cm=[
        new Ext.grid.RowNumberer(),
        {header:"wk_msg_type", dataIndex:"wk_msg_type", width:10,hidden:true},
        {header:"接收消息类型", dataIndex:"name", width:180}
    ];
    var wk_grid = new Ext.grid.GridPanel({
        region:'west',
        width:210,
        split : {size:3},
        maxWidth:500,
        columns:wk_cm,
        minWidth:10,
        border:false,
        store:wk_store
    });
    wk_grid.on('select',function(i,v){
        var row=SUNLINE.getSelected(wk_grid);
        var wxapp_id = Ext.getCmp('wxapp_combo_id').getValue();
        SUNLINE.baseParams(right_store,{wk_appid:wxapp_id,wk_msg_type:row.data.wk_msg_type});
        right_store.currentPage=1;
        right_store.load();
    });

    /*右边*/
    var right_url = $__app__ + '/WxKeyword/dataJson';
    var right_store=SUNLINE.GroupingStore(right_url,[],{sortInfo:{field:'wk_order',direction: "DESC"}, groupField:'wk_keyword'},false);
    var groupingFeature=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{name:this.format_keyword} (共 {[values.rows.length]} 条)',{format_keyword:function(name){
            if(name!=""){
                return '关键字:'+'<b style="font-size:14px;line-height:24px;color:#000;">'+name+'</b>';
            }else{
                return '<b style="font-size:14px;line-height:24px;color:#000;">不匹配关键字</b>';
            }
        }}]
    })
    var right_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"wk_id",dataIndex:"wk_id",width:60, hidden: true},
        {header:"wk_appid",dataIndex:"wk_appid",width:60, hidden: true},
        {header:"wk_keyword_regex",dataIndex:"wk_keyword_regex",width:60, hidden: true},
        {header:"wk_msg_type",dataIndex:"wk_msg_type",width:60, hidden: true},
        {header:"wk_reply_type",dataIndex:"wk_reply_type",width:60, hidden: true},
        {header:"wk_denial",dataIndex:"wk_denial",width:60, hidden: true},
        {header:"wk_content",dataIndex:"wk_content",width:60, hidden: true},
        {header:"回复内容",dataIndex:"wk_reply_type",width:140,renderer:format_reply_type},
        {header:"规则名称",dataIndex:"wk_rule",width:140},
        {header:"匹配规则",dataIndex:"wk_match",width:140},
        {header:"是否阻断",dataIndex:"wk_denial",width:140},
        {header:"开始时间",dataIndex:"wk_start_time",width:140,renderer:format_time},
        {header:"结束时间",dataIndex:"wk_end_time",width:140,renderer:format_time},
        {header:"优先级",dataIndex:"wk_order",width:100}
    ];
    function format_reply_type(v){
        switch(v){
            case 'news':
                return '回复图文消息';
            case 'text':
                return '回复文本消息';
            case 'voice':
                return '回复音频消息';
            case 'video':
                return '回复视频消息';
            case 'music':
                return '回复音乐消息';
            case 'image':
                return '回复图片消息';
            case 'program':
                return '程序处理';
            case 'mandate':
                return '托管处理';
            case 'ignore':
                return '忽略处理';
            default:
                return '';
        }
    }

    function format_time(v){
        if(v==''|| v==0){
            return '';
        }
        var t = new Date(parseInt(v) * 1000);
        return Ext.Date.format(t,'Y-m-d H:i:s');
    }

    var wxapp_combo=SUNLINE.WxAppCombo({autoLoad:true,config:{id:'wxapp_combo_id'}});
    wxapp_combo.getStore().on('load',function(store,records){
        if(records.length>0){
            wxapp_combo.setValue(records[0].data.wa_appid);
            wxapp_combo.focus();
        }
    });
    wxapp_combo.on('change',function(){
        var wxapp_id = Ext.getCmp('wxapp_combo_id').getValue();
        var row=SUNLINE.getSelected(wk_grid);
        if(row){
            SUNLINE.baseParams(right_store,{wk_appid:wxapp_id,wk_msg_type:row.data.wk_msg_type});
            right_store.currentPage = 1;
            right_store.load();
        }
    })

    var right_grid = new Ext.grid.GridPanel({
        region:'center',
        store:right_store,
        loadMask:{msg:'数据载入中，请稍后' },
        viewConfig:{
            emptyText:'暂无回复内容',
            deferEmptyText : true
        },
        columns:right_cm,
        features: [groupingFeature],
        tbar:[
            wxapp_combo,
            {text:'添加回复规则',iconCls:'button-add',width:140,hidden:isDisabled('WxKeyword::add'),
                menu:[
                    {width:140,text:'回复图文消息',replyType:'news',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'回复文本消息',replyType:'text',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'回复音频消息',replyType:'voice',iconCls:'button-add',handler:reply_add}, //image_voice_video
                    {width:140,text:'回复视频消息',replyType:'video',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'回复音乐消息',replyType:'music',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'回复图片消息',replyType:'image',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'程序处理',replyType:'program',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'托管处理',replyType:'mandate',iconCls:'button-add',handler:reply_add},
                    {width:140,text:'忽略处理',replyType:'ignore',iconCls:'button-add',handler:reply_add}
                ]
            },
            {text:'编辑',iconCls:'button-edit',width:90,handler:save_modify,hidden:isDisabled('WxKeyword::edit')},
            {text:'删除',iconCls:'button-del',width:90,handler:del_modify,hidden:isDisabled('WxKeyword::del')},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'wk_dosearch_id',
                emptyText:'关键字、规则名称',
                width:230,
                onTriggerClick:function (e) {
                    wk_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            wk_dosearch();
                        }
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:right_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有回复内容'
        })
    });

    right_store.on('beforeload',function(){
        var row=SUNLINE.getSelected(wk_grid);
        if(row==null){
            return false;
        }
    })


    function reply_add(v){
        var wxapp_id=wxapp_combo.getValue();
        if(!wxapp_id){
            Ext.Msg.alert('提示信息','请选择公众号');
            return false;
        }
        var row=SUNLINE.getSelected(wk_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请在左侧选择您要操作的消息类型');
            return false;
        }
        if(v.replyType=='voice' || v.replyType=='image' || v.replyType=='video'){
            edit_type= v.replyType;
            var replyType='ivv';
            if(v.replyType=='video'){
                Ext.getCmp('wk_ivv_title').enable().setHidden(false);
                Ext.getCmp('wk_ivv_desc').enable().setHidden(false);
            }else{
                Ext.getCmp('wk_ivv_title').disable().setHidden(true);
                Ext.getCmp('wk_ivv_desc').disable().setHidden(true);
            }
        }else if(v.replyType=='music'){
            edit_type='thumb';
            var replyType=v.replyType;
        }else{
            var replyType=v.replyType;
        }
        if(row.data.wk_msg_type=='text' || row.data.wk_msg_type=='event_click' || row.data.wk_msg_type=='event_scan'){
            Ext.getCmp('wk_match_'+replyType+'_id').enable().setHidden(false);
            Ext.getCmp('wk_keyword_'+replyType+'_id').enable().setHidden(false);
            Ext.getCmp(replyType+'_match_keyword').enable().setHidden(false);
        }else{
            Ext.getCmp('wk_match_'+replyType+'_id').disable().setHidden(true);
            Ext.getCmp('wk_keyword_'+replyType+'_id').disable().setHidden(true);
            Ext.getCmp(replyType+'_match_keyword').disable().setHidden(true);
        }
        if(v.replyType=='mandate'){
            var mandate_store=Ext.getCmp('wk_mandate_keyword_id').getStore();
            SUNLINE.baseParams(mandate_store,{type:'text'});
            mandate_store.currentPage=1;
            mandate_store.load();
        }else if(v.replyType=='news'){
            news_data=[];
            if(first_load_flag){
               first_load_flag=false;
            }else{
                news_frame.set_html([]);
            }
        }
        var form_data={
            wk_msg_type:row.data.wk_msg_type,
            wk_reply_type:v.replyType,
            wk_appid:wxapp_id
        }
        var form=Ext.getCmp(replyType+'_form');
        form.getForm().setValues(form_data);
        var win_obj=Ext.getCmp(replyType+'_win');
        win_obj.show();
        win_obj.setTitle('添加'+v.text);
    }

    //多图文编辑窗口
    var news_match_keyword={xtype: 'checkboxgroup',fieldLabel: ' ',columns: 1,id:'news_match_keyword',labelSeparator:' ',vertical: true,
        items:[
            {boxLabel:'不匹配关键字', name: 'wk_mate_name', inputValue: '是' }
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_news_id').disable();
                    Ext.getCmp('wk_keyword_news_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_news_id').enable();
                    Ext.getCmp('wk_keyword_news_id').enable();
                }
            }
        }
    }
    var news_form= new Ext.form.FormPanel({
        id:'news_form',
        region:'center',
        border:false,
        layout : 'column',
        style:'border-right:1px #3892D3 solid',
        bodyStyle:'padding:10px',
        items:[{
            cls:'tcol2',
            defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
            items:[
                {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                {id:'news_data',name:"news_data", fieldLabel:"图文",xtype:"hidden"},
                {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                {
                    xtype: 'radiogroup',
                    fieldLabel: '匹配类型',
                    labelWidth:80,
                    labelAlign:"right",
                    width:350,
                    columns: 2,
                    id:'wk_match_news_id',
                    items: [
                        { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                        { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                        { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                    ]
                },
                {id:'wk_keyword_news_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                news_match_keyword,
                {
                    xtype: 'radiogroup',
                    fieldLabel: '是否阻断',
                    labelWidth:80,
                    labelAlign:"right",
                    columns: 2,
                    items: [
                        { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                        { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                    ]
                },
                SUNLINE.ExtDateField({id:'wk_start_time_news',name:'wk_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",width:350,gang:'wk_end_time_news',start:true}),
                SUNLINE.ExtDateField({id:'wk_end_time_news',name:'wk_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",width:350,gang:'wk_start_time_news'}),
                {name:"wk_order", fieldLabel:"优先级", allowBlank:false,xtype:'numberfield',value:1},
            ]
        }]
    });
    var news_edit_frame=new Ext.panel.Panel({
        region:'east',
        width:420,
        height:450,
        html:'<iframe src="'+$__app__+'/WxKeyword/news_edit" style="border:none;width:100%;height:100%" name="news_frame" id="news_frame"></iframe>'
    })
    var news_win= new Ext.Window({
        id:'news_win',
        layout:'border',
        width:800,
        height:500,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:[news_form,news_edit_frame],
        buttons:[
            {text:'保存', save_type:'news',handler:dosave},
            {text:'关闭', handler:function(){news_win.hide();}}
        ]
    })
    news_win.on('hide',function(){
        news_form.getForm().reset();
    })

    //文本回复编辑窗口
    var text_match_keyword={xtype: 'checkboxgroup',fieldLabel: ' ',columns: 1,id:'text_match_keyword',labelSeparator:' ',vertical: true,
        items:[
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是' }
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_text_id').disable();
                    Ext.getCmp('wk_keyword_text_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_text_id').enable();
                    Ext.getCmp('wk_keyword_text_id').enable();
                }
            }
        }
    }
    var text_form= new Ext.form.FormPanel({
        id:'text_form',
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[{
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:80,
                        labelAlign:"right",
                        width:350,
                        columns: 2,
                        id:'wk_match_text_id',
                        items: [
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_text_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    text_match_keyword,
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '是否阻断',
                        labelWidth:80,
                        labelAlign:"right",
                        columns: 2,
                        items: [
                            { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                            { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                        ]
                    },
                    SUNLINE.ExtDateField({id:'wk_start_time_text',name:'wk_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",width:350,gang:'wk_end_time_text',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_text',name:'wk_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",width:350,gang:'wk_start_time_text'}),
                    {name:"wk_order", fieldLabel:"优先级",allowBlank:false,xtype:'numberfield',value:1},
                    {name:"content_text",labelAlign:"right", fieldLabel:"回复内容", xtype:'textarea',height:70,vtype:'NotBlank', allowBlank:false}
                ]
            }
        ]
    });
    var text_win= new Ext.Window({
        id:'text_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:text_form,
        buttons:[
            {text:'保存', save_type:'text',handler:dosave},
            {text:'关闭', handler:function(){text_win.hide();}}
        ]
    })
    text_win.on('hide',function(){
        text_form.getForm().reset();
    })


    //图片 音频 视频 回复编辑窗口
    var ivv_match_keyword={id:'ivv_match_keyword',xtype:'checkboxgroup',fieldLabel:' ',columns: 1,labelSeparator:' ',vertical: true,
        items: [
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是' }
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_ivv_id').disable();
                    Ext.getCmp('wk_keyword_ivv_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_ivv_id').enable();
                    Ext.getCmp('wk_keyword_ivv_id').enable();
                }
            }
        }
    }
    ivv_form=new Ext.form.FormPanel({
        id:'ivv_form',
        border:false,
        layout : 'column',
        width:380,
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id_ivv", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:80,
                        labelAlign:"right",
                        columns: 2,
                        width:350,
                        id:'wk_match_ivv_id',
                        items: [
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_ivv_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    ivv_match_keyword,
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '是否阻断',
                        labelWidth:80,
                        labelAlign:"right",
                        columns: 2,
                        items: [
                            { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                            { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                        ]
                    },
                    SUNLINE.ExtDateField({id:'wk_start_time_ivv',name:'wk_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",width:350,gang:'wk_end_time_ivv',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_ivv',name:'wk_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",width:350,gang:'wk_start_time_ivv'}),
                    {name:"wk_order", fieldLabel:"优先级",allowBlank:false,xtype:'numberfield',value:1},
                    {id:'wk_ivv_title',name:"wk_ivv_title", fieldLabel:"视频标题",allowBlank:false},
                    {id:'wk_ivv_desc',name:"wk_ivv_desc", fieldLabel:"视频描述",xtype:'textarea',height:50,allowBlank:false},
                    {id:'wk_ivv_image_id',name:"wk_ivv", fieldLabel:"选题素材", maxLength:"100", width:310,listeners:{'focus':function(){media_win.show();}} ,emptyText:'请选择素材'},
                    {id:'wk_ivv_mediaid',name:"wk_ivv_mediaid",xtype:'hidden'},
                    {id:'wk_ivv_mediaurl',name:"wk_ivv_mediaurl",xtype:'hidden'},
                    {id:'wk_rule_image_id',name:"wk_rule_image", fieldLabel:"",xtype:'displayfield',style:'margin-top:1px;padding-left:5px;',width:50}
                ]
            }
        ]
    });
    var ivv_win= new Ext.Window({
        id:'ivv_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:ivv_form,
        buttons:[
            {text:'保存', save_type:'ivv',handler:dosave},
            {text:'关闭', handler:function(){ivv_win.hide();}}
        ]
    })
    ivv_win.on('hide',function(){
        ivv_form.getForm().reset();
    })


    //回复音乐消息编辑窗口
    var music_match_keyword={id:'music_match_keyword',xtype:'checkboxgroup',fieldLabel:' ',columns: 1,labelSeparator:' ',vertical: true,
        items: [
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是' }
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_music_id').disable();
                    Ext.getCmp('wk_keyword_music_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_music_id').enable();
                    Ext.getCmp('wk_keyword_music_id').enable();
                }
            }
        }
    }
    var music_form= new Ext.form.FormPanel({
        id:'music_form',
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"music_image_url", fieldLabel:"music_image_url", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:100,
                        width:350,
                        labelAlign:"right",
                        columns: 2,
                        id:'wk_match_music_id',
                        items: [
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_music_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    music_match_keyword,
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '是否阻断',
                        labelWidth:100,
                        labelAlign:"right",
                        columns: 2,
                        items: [
                            { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                            { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                        ]
                    },
                    SUNLINE.ExtDateField({id:'wk_start_time_music',name:'wk_start_time',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",gang:'wk_end_time_music',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_music',name:'wk_end_time',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",gang:'wk_start_time_music'}),
                    {name:"wk_order", fieldLabel:"优先级", allowBlank:false,xtype:'numberfield',value:1},
                    {name:"music_title", fieldLabel:"音乐标题",maxLength:50,allowBlank:false},
                    {name:"music_desc", fieldLabel:"音乐描述",maxLength:50,allowBlank:false},
                    {
                        id:'music_file_id',
                        xtype: 'filefield',
                        name: 'music_file',
                        fieldLabel: '音乐文件',
                        labelWidth: 100,
                        width:310,
                        buttonText: '选择文件'
                    },
                    {id:'music_url_id',name:"music_url_display",fieldLabel:"",xtype:'displayfield',style:'margin-top:1px;padding-left:5px;',width:50,value:''},
                    {id:'music_cover_focus_id',name:"music_cover_focus", width:310, fieldLabel:"缩略图",listeners:{'focus':function(){media_win.show();}} ,emptyText:'请选择素材',hidden:true},
                    {id:'music_cover_mediaid_id',name:"music_cover_mediaid",xtype:'hidden'},
                    {id:'music_cover_mediaurl_id',name:"music_cover_mediaurl",xtype:'hidden'},
                    {id:'music_cover_display_id',name:"music_cover_display", fieldLabel:"",xtype:'displayfield',style:'margin-top:1px;padding-left:5px;',width:50,value:'',hidden:true},
                    {name:'force_ajax_flag',xtype: 'hidden',value:'1'},
                    {name:'music_old_url',xtype: 'hidden',value:''}
                ]
            }
        ]
    });
    var music_win= new Ext.Window({
        id:'music_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:music_form,
        buttons:[
            {text:'保存', save_type:'music',handler:dosave},
            {text:'关闭', handler:function(){music_win.hide();}}
        ]
    })
    music_win.on('hide',function(){
        music_form.getForm().reset();
    })


    //程序处理编辑窗口
    var program_match_keyword={id:'program_match_keyword',xtype:'checkboxgroup',fieldLabel:' ',columns: 1,labelSeparator:' ',vertical: true,
        items: [
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是' }
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_program_id').disable();
                    Ext.getCmp('wk_keyword_program_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_program_id').enable();
                    Ext.getCmp('wk_keyword_program_id').enable();
                }
            }
        }
    }
    var program_form= new Ext.form.FormPanel({
        id:'program_form',
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:100,
                        width:350,
                        labelAlign:"right",
                        columns: 2,
                        id:'wk_match_program_id',
                        items: [
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_program_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    program_match_keyword,
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '是否阻断',
                        labelWidth:100,
                        labelAlign:"right",
                        columns: 2,
                        items: [
                            { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                            { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                        ]
                    },
                    SUNLINE.ExtDateField({id:'wk_start_time_program',name:'wk_start_time',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",gang:'wk_end_time_program',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_program',name:'wk_end_time',labelWidth:100,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",gang:'wk_start_time_program'}),
                    {name:"wk_order", fieldLabel:"优先级",allowBlank:false,xtype:'numberfield',value:1},
                    {name:"content_program", fieldLabel:"程序方法", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                ]
            }
        ]
    });
    var program_win= new Ext.Window({
        id:'program_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:program_form,
        buttons:[
            {text:'保存', save_type:'program',handler:dosave},
            {text:'关闭', handler:function(){program_win.hide();}}
        ]
    })
    program_win.on('hide',function(){
        program_form.getForm().reset();
    })


    //托管处理编辑窗口

    //托管处理
    var mandate_match_keyword={xtype: 'checkboxgroup',fieldLabel: ' ',columns: 1,id:'mandate_match_keyword',labelSeparator:' ',vertical: true,
        items: [
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是'}
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_mandate_id').disable();
                    Ext.getCmp('wk_keyword_mandate_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_mandate_id').enable();
                    Ext.getCmp('wk_keyword_mandate_id').enable();
                }
            }
        }
    }
    var mendate_rule_url=$__app__+'/WxKeyword/keyword_list';
    var mandate_rule_store= SUNLINE.JsonStore(mendate_rule_url, [], false,{pageSize:10});
    var mandate_rule_combo=new Ext.form.ComboBox({
        id:'wk_mandate_keyword_id',
        name:'wk_receive_mandate',
        store:mandate_rule_store,
        fieldLabel:"关键字",
        labelAlign:"right",
        displayField:'wk_keyword_display',
        valueField:'wk_keyword_value',
        labelWidth:80,
        allowBlank:false,
        width:350,
        listWidth:350,
        editable:false,
        forceSelection:true
    });
    var mandate_form= new Ext.form.FormPanel({
        id:'mandate_form',
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:80,
                        width:350,
                        labelAlign:"right",
                        columns: 2,
                        id:'wk_match_mandate_id',
                        items:[
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_mandate_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50,allowBlank:false,vtype:'NotBlank'},
                    mandate_match_keyword,
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '是否阻断',
                        labelWidth:80,
                        labelAlign:"right",
                        columns: 1,
                        items: [
                            { boxLabel: '是', name: 'wk_denial', inputValue: '是'},
                            { boxLabel: '否', name: 'wk_denial', inputValue: '否',checked: true}
                        ]
                    },
                    SUNLINE.ExtDateField({id:'wk_start_time_mandate',name:'wk_start_time',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",gang:'wk_end_time_program',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_mandate',name:'wk_end_time',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",gang:'wk_start_time_program'}),
                    {name:"wk_order", fieldLabel:"优先级",allowBlank:false,xtype:'numberfield',value:1},
                    {
                        name:"wk_mandate_type",
                        fieldLabel:"消息类型",
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['wk_mandated_type','wk_mandated_name'],
                            data:[
                                ['文本消息','text'],
                                ['语音消息','voice'],
                                ['视频消息','video'],
                                ['图片消息','image'],
                                ['小视频消息','shortvideo'],
                                ['地理位置','location'],
                                ['扫码事件','event_scan'],
                                ['链接消息','link'],
                                ['菜单点击事件','event_click']
                            ]
                        }),
                        displayField:"wk_mandated_type",
                        valueField:"wk_mandated_name",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:'text',
                        listeners:{
                            change:function(v,n){
                               if(n=='text' || n=='event_click' || n=='event_scan'){
                                   mandate_rule_combo.enable().setHidden(false);
                                   var mandate_rule_combo_store=mandate_rule_combo.getStore();
                                   SUNLINE.baseParams(mandate_rule_combo_store,{type:n});
                                   mandate_rule_combo_store.load();
                               }else{
                                   mandate_rule_combo.setValue('').disable().setHidden(true);
                               }
                            }
                        }
                    },
                    mandate_rule_combo
                ]
            }
        ]
    });
    var mandate_win= new Ext.Window({
        id:'mandate_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:mandate_form,
        buttons:[
            {text:'保存',  save_type:'mandate',handler:dosave},
            {text:'关闭', handler:function(){mandate_win.hide();}}
        ]
    })
    mandate_win.on('hide',function(){
        mandate_form.getForm().reset();
    })


    //忽略处理编辑窗口
    var ignore_match_keyword={xtype: 'checkboxgroup',fieldLabel: ' ',columns: 1,id:'ignore_match_keyword',labelSeparator:' ',vertical: true,
        items: [
            {boxLabel: '不匹配关键字', name: 'wk_mate_name', inputValue: '是'}
        ],listeners:{
            'change':function(i,n,o){
                if(n.wk_mate_name=='是'){
                    Ext.getCmp('wk_match_ignore_id').disable();
                    Ext.getCmp('wk_keyword_ignore_id').setValue('').disable();
                }else{
                    Ext.getCmp('wk_match_ignore_id').enable();
                    Ext.getCmp('wk_keyword_ignore_id').enable();
                }
            }
        }
    }
    var ignore_form= new Ext.form.FormPanel({
        id:'ignore_form',
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"wk_id", fieldLabel:"wk_id", maxLength:10,xtype:"hidden"},
                    {name:"wk_appid", fieldLabel:"wk_appid",xtype:"hidden"},
                    {name:"wk_msg_type", fieldLabel:"wk_msg_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_reply_type", fieldLabel:"wk_reply_type", maxLength:10,xtype:"hidden"},
                    {name:"wk_rule", fieldLabel:"规则名称", maxLength:50, allowBlank:false,vtype:'NotBlank'},
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '匹配类型',
                        labelWidth:80,
                        width:350,
                        labelAlign:"right",
                        columns: 2,
                        id:'wk_match_ignore_id',
                        items: [
                            { boxLabel: '部分', name: 'wk_match', inputValue: '部分',checked: true},
                            { boxLabel: '正则', name: 'wk_match', inputValue: '正则'},
                            { boxLabel: '全文', name: 'wk_match', inputValue: '全文'}
                        ]
                    },
                    {id:'wk_keyword_ignore_id',name:"wk_keyword", fieldLabel:"匹配关键字", maxLength:50,allowBlank:false,vtype:'NotBlank'},
                    ignore_match_keyword,
                    SUNLINE.ExtDateField({id:'wk_start_time_ignore',name:'wk_start_time',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"开始时间",gang:'wk_end_time_ignore',start:true}),
                    SUNLINE.ExtDateField({id:'wk_end_time_ignore',name:'wk_end_time',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"结束时间",gang:'wk_start_time_ignore'}),
                ]
            }
        ]
    });
    var ignore_win= new Ext.Window({
        id:'ignore_win',
        width:400,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:ignore_form,
        buttons:[
            {text:'保存',  save_type:'ignore',handler:dosave},
            {text:'关闭', handler:function(){ignore_win.hide();}}
        ]
    })
    ignore_win.on('hide',function(){
        ignore_form.getForm().reset();
    })


    function dosave(v){
        var form=Ext.getCmp(v.save_type+'_form');
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('系统提示', '请留意红色边框的部分是否填写正确');
            return;
        };
        if(v.save_type=='news'){
            var news_data=window.news_frame.get_news_data();
            if(news_data.length<1){
                Ext.Msg.alert('系统提示', '至少设置一条图文消息');
                return;
            }
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(res) {
            if (res == 'yes') {
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                if(v.save_type=='news'){
                      Ext.getCmp('news_data').setValue('['+news_data.toString()+']');
                }
                form.submit({
                    url:$__app__ + '/WxKeyword/save',
                    waitMsg: '提交中...',
                    failure:function (response, opts) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示',opts.result.info.msg);
                        if(opts.result.status){
                            Ext.getCmp(v.save_type+'_win').hide();
                            right_store.reload();
                        }
                    }
                });
            }
        })
    }

    function del_modify(){
        var row=SUNLINE.getSelected(right_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要删除的回复规则！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','删除后相关回复将无法正常使用,确定删除？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/WxKeyword/del',
                    params:{wk_id:row.data.wk_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            right_store.reload();
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


    var media_url = $__app__ + '/WxMedia/dataJson';
    var media_store = SUNLINE.JsonStore(media_url,[], false,{pageSize:10});
    var media_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:media_store,
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"wme_id",dataIndex:"wme_id",width:50,hidden:true},
            {header:"已设",dataIndex:'wme_flag',width:50,align:'center',renderer:format_flag},
            {header:"素材封面", dataIndex:"wme_url", width:130,renderer:formatMedia,align:'center'},
            {header:"添加时间", dataIndex:"wme_make_time", width:160,renderer:format_time,align:'center'}
        ],
        tbar:[
            {text:'上传素材', iconCls:'button-add',handler:upload_modify},
            '-',
            {text:'删除', iconCls:'button-del',handler:media_del},
        ],
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有素材信息',
            deferEmptyText:true
        },
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store:media_store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有素材信息'
        })
    });
    var media_win = new Ext.Window({
        title:'选择素材',
        width:530,
        height:470,
        closeAction : 'hide',
        modal : true,
        items : [media_grid],
        layout : 'fit',
        buttons:[
            {text:'选择', handler:cover_modify},
            {text:'关闭', handler:function(){media_win.hide();} }
        ]
    });
    media_win.on('show',function(){
       var wme_appid=wxapp_combo.getValue();
       SUNLINE.baseParams(media_store,{wme_appid:wme_appid,wme_type:edit_type,wme_end_time:0},true);
       media_store.currentPage=1;
       media_store.load();
   })

    var upload_media_form= new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none; padding:10px;',
        defaults:{xtype:'textfield',labelWidth:80,width:350,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {name:'material',fieldLabel:"素材",xtype: 'filefield',labelWidth: 80,allowBlank: false,buttonText: '选择素材'},
            {id:"wme_video_title", name:"wme_video_title", fieldLabel:"视频标题"},
            {id:"wme_video_introduction", name:"wme_video_introduction", fieldLabel:"视频描述",xtype:'textarea'},
            {id:'wme_type',name: 'wme_type',xtype:'hidden',value:'image'},
            {id:'wme_media_status',name: 'wme_media_status',xtype:'hidden',value:'临时'},
            {id:'wme_appid',name:'wme_appid',xtype: 'hidden',value:''},
            {name:'force_ajax_flag',xtype: 'hidden',value:'1'}
        ]
    });
    var upload_media_win=new Ext.Window({
        title:'上传素材',
        width : 420,
        closeAction : 'hide',
        modal : true,
        items : upload_media_form,
        layout : 'fit',
        buttons:[
            {text:'保存', handler:upload_media},
            {text:'关闭', handler:function(){
                upload_media_win.hide();
            }}
        ]
    });
    upload_media_win.on('hide',function(){
        upload_media_form.getForm().reset();
    })

    function upload_modify(){
        upload_media_win.show();
        var form_data={wme_type:edit_type,wme_appid:wxapp_combo.getValue()}
        if(edit_type=='video'){
            Ext.getCmp('wme_video_title').enable().setHidden(false);
            Ext.getCmp('wme_video_introduction').enable().setHidden(false);
        }else{
            Ext.getCmp('wme_video_title').disable().setHidden(true);
            Ext.getCmp('wme_video_introduction').disable().setHidden(true);
        }
        upload_media_form.getForm().setValues(form_data);
    }

    function upload_media(){
        if (!upload_media_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        upload_media_form.submit({
            url:$__app__ + '/WxMedia/save',
            waitMsg: '素材上传中...',
            failure:function (response, opts) {
                Ext.Msg.alert('友情提示',opts.result.info.msg);
                if(opts.result.status){
                    media_store.reload();
                    upload_media_win.hide();
                }
            }
        });
    }

    function cover_modify(){
        var row=SUNLINE.getSelected(media_grid);
        if(!row){
            Ext.Msg.alert('友情提示','您还没有选中任何素材');
            return;
        }
        if(ivv_win.isHidden()){
            Ext.getCmp('music_cover_mediaid_id').setValue(row.data.wme_mediaid);
            for(var i=0;i<media_store.count();i++){
                var media_row=media_store.getAt(i);
                media_row.set('wme_flag',Math.random());
            }
            var media_data=formatMedia(row.get('wme_url'),'',row);
            Ext.getCmp('music_cover_display_id').setValue(media_data);
            Ext.getCmp('music_cover_mediaurl_id').setValue(row.data.wme_url);
            Ext.getCmp('music_cover_focus_id').setValue('已选择素材');
        }else{
            Ext.getCmp('wk_ivv_mediaid').setValue(row.data.wme_mediaid);
            for(var i=0;i<media_store.count();i++){
                var media_row=media_store.getAt(i);
                media_row.set('wme_flag',Math.random());
            }
            var media_data=formatMedia(row.get('wme_url'),'',row);
            Ext.getCmp('wk_rule_image_id').setValue(media_data);
            Ext.getCmp('wk_ivv_mediaurl').setValue(row.data.wme_url);
            Ext.getCmp('wk_ivv_image_id').setValue('已选择素材');
        }
        media_win.hide();
    }

    function media_del(){
        var row=SUNLINE.getSelected(media_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的素材！');
            return;
        }
        var wme_appid = wxapp_combo.getValue();
        var param={wme_id:row.data.wme_id,wme_mediaid:row.data.wme_mediaid,wme_appid:wme_appid,wme_status:'forever'};
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
                    media_store.reload();
                }
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }


    function formatMedia(v,m,r){
        if(typeof r =='string'){
            wme_type=r;
        }else{
            var wme_type = r.get("wme_type");
        }
        v=$app_root+v;
        if(wme_type=='image' || wme_type=='thumb'){
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

    function format_flag(v,i,r){
        v= r.get('wme_mediaid');
        if(ivv_win.isHidden()){
           var value=Ext.getCmp('music_cover_mediaid_id').getValue();
        }else{
           var value=Ext.getCmp('wk_ivv_mediaid').getValue();
        }
        if(v==value){
            return '<i class="fa fa-flag" style="color:red"></i>';
        }else{
            return '';
        }
    }

    function wk_dosearch(){
        var row=SUNLINE.getSelected(wk_grid);
        if(!row) {
            Ext.Msg.alert('友情提示', '请先选择接收消息类型');
            return false;
        }
        var key=Ext.getCmp('wk_dosearch_id').getValue();
        SUNLINE.baseParams(right_store,{skey:key,wk_msg_type:row.data.wk_msg_type},true);
        right_store.currentPage=1;
        right_store.load();
    }


    //编辑
    function save_modify(v){
        var row=SUNLINE.getSelected(right_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择您要编辑的回复规则！');
            return false;
        }
        row=row.data;
        var form_data={
            wk_id:row.wk_id,
            wk_msg_type:row.wk_msg_type,
            wk_reply_type:row.wk_reply_type,
            wk_appid:row.wk_appid,
            wk_rule:row.wk_rule,
            wk_keyword:row.wk_keyword,
            wk_start_time:Ext.Date.format(new Date(parseInt(row.wk_start_time)*1000),'Y-m-d'),
            wk_end_time:Ext.Date.format(new Date(parseInt(row.wk_end_time)*1000),'Y-m-d'),
            wk_order:parseInt(row.wk_order),
            wk_denial:row.wk_denial
        };
        switch(row.wk_reply_type){
            case 'video':
                var content=Ext.decode(row.wk_content);
                form_data.wk_ivv_title=content.title;
                form_data.wk_ivv_desc=content.desc;
                form_data.wk_ivv_mediaid=content.mediaid;
                form_data.wk_ivv_mediaurl=content.mediaurl;
                form_data.wk_rule_image_id=formatMedia(content.mediaurl,'',row.wk_reply_type);
                break;
            case 'voice':
            case 'image':
                var content=Ext.decode(row.wk_content);
                form_data.wk_ivv_mediaid=content.mediaid;
                form_data.wk_ivv_mediaurl=content.url;
                form_data.wk_rule_image_id=formatMedia(content.url,'',row.wk_reply_type);
                break;
            case 'music':
                var content=Ext.decode(row.wk_content);
                form_data.music_title=content.title;
                form_data.music_desc=content.desc;
                form_data.music_url_display=formatMedia(content.url,'','voice');
                form_data.music_cover_focus='已选择素材';
                form_data.music_cover_display=formatMedia(content.cover_url,'','image');
                form_data.music_cover_mediaid=content.cover_id;
                form_data.music_cover_mediaurl=content.cover_url;
                form_data.music_old_url=content.url;
                break;
            case 'mandate':
                var content=Ext.decode(row.wk_content);
                form_data.wk_mandate_type=content.msg_type;
                var mandate_store=Ext.getCmp('wk_mandate_keyword_id').getStore();
                SUNLINE.baseParams(mandate_store,{type:content.msg_type});
                mandate_store.currentPage=1;
                mandate_store.load(function(){
                    mandate_rule_combo.setValue(content.msg_keyword);
                });
                break;
            case 'text':
                form_data.content_text=row.wk_content;
                break;
            case 'program':
                form_data.content_program=row.wk_content;
                break;
        }

        if(row.wk_reply_type=='voice' || row.wk_reply_type=='image' || row.wk_reply_type=='video'){
            edit_type= row.wk_reply_type;
            var replyType='ivv';
            if(row.wk_reply_type=='video'){
                Ext.getCmp('wk_ivv_title').enable().setHidden(false);
                Ext.getCmp('wk_ivv_desc').enable().setHidden(false);
            }else{
                Ext.getCmp('wk_ivv_title').disable().setHidden(true);
                Ext.getCmp('wk_ivv_desc').disable().setHidden(true);
            }
        }else if(row.wk_reply_type=='music'){
            edit_type='thumb';
            var replyType=row.wk_reply_type;
        }else{
            var replyType=row.wk_reply_type;
        }

        if(row.wk_msg_type=='text' || row.wk_msg_type=='event_click' || row.wk_msg_type=='event_scan'){
            Ext.getCmp('wk_match_'+replyType+'_id').enable().setHidden(false);
            Ext.getCmp('wk_keyword_'+replyType+'_id').enable().setHidden(false);
            Ext.getCmp(replyType+'_match_keyword').enable().setHidden(false);
        }else{
            Ext.getCmp('wk_match_'+replyType+'_id').disable().setHidden(true);
            Ext.getCmp('wk_keyword_'+replyType+'_id').disable().setHidden(true);
            Ext.getCmp(replyType+'_match_keyword').disable().setHidden(true);
        }
        if(row.wk_msg_type=='mandate'){
            var mandate_store=Ext.getCmp('wk_mandate_keyword_id').getStore();
            SUNLINE.baseParams(mandate_store,{type:'text'});
            mandate_store.currentPage=1;
            mandate_store.load(function(){
                var content=Ext.decode(row.wk_content);
                Ext.getCmp('wk_mandate_keyword_id').setValue(content.msg_keyword);
            });
        }
        if(row.wk_reply_type=='news'){
            news_data=Ext.decode(row.wk_content);
            if(first_load_flag){
                first_load_flag=false;
            }else{
                news_frame.set_html(news_data);
            }
        }
        var form=Ext.getCmp(replyType+'_form');
        var win_obj=Ext.getCmp(replyType+'_win');
        win_obj.show();
        if(form_data.wk_keyword==''){
            Ext.getCmp(replyType+'_match_keyword').setValue({wk_mate_name:true});
            Ext.getCmp('wk_match_'+replyType+'_id').disable();
            Ext.getCmp('wk_keyword_'+replyType+'_id').disable();
        }else{
            form_data.wk_match=row.wk_match;
            Ext.getCmp(replyType+'_match_keyword').setValue({wk_mate_name:false});
            Ext.getCmp('wk_match_'+replyType+'_id').enable();
            Ext.getCmp('wk_keyword_'+replyType+'_id').enable();
        }
        form.getForm().setValues(form_data);
        win_obj.setTitle('编辑回复规则');
    }

    var panel = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'border',
        items : [wk_grid,right_grid]
    });

    new Ext.Viewport({
        layout : 'border',
        items :panel
    });

    window.get_news=function(){
        return news_data;
    }

    window.msgAlert=function(msg){
        Ext.Msg.alert('系统提示',msg);
    }



});