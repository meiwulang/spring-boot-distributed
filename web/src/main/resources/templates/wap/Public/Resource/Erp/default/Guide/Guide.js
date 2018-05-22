var ROW={};
Ext.onReady(function(){
    var thisTitle='导游';
   // var user_field_list=['u_id','us_id','u_mobile','u_education','u_sex','u_native_palce','u_age','u_email','u_home_addr','us_work_addr','u_political','u_qq','u_emergency_name','u_emergency_phone','u_remark','us_status','u_card','u_card_front','u_card_back'];
    var user_field_list=[];
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var c_url=$__app__+'/Guide/json_data';
    var c_field=['u_id','u_name','u_mobile','u_tel','u_realname','u_email','u_fax','u_qq','u_nickname',
        'u_openid','u_card','u_sex','u_education','u_home_addr','u_political','u_emergency_name','u_emergency_phone','u_remark','us_id','us_wgid','us_job','u_role_id','us_scope','us_ticket_type','us_work_time','us_work_addr','us_status','gu_id','gu_uid','gu_card','gu_source','gu_card_front','gu_card_back','gu_card_level','gu_tour_type','gu_work_type','gu_tour_style','gu_price','gu_work_year','gu_tour_year','gu_way','gu_honor','gu_addtime'];
    var c_store=SUNLINE.JsonStore(c_url,c_field);
    var c_cm=[
        new Ext.grid.RowNumberer({width:60}),
        {header:"ID", dataIndex:"u_id", width:80, hidden:true},
        {header:"姓名", dataIndex:"u_realname", width:80},
        {header:"审核状态", dataIndex:"gu_status", width:80,align:'center',renderer:function(v){
            if(v=='未审核'){
                return "<span style='color:#cb0000;font-weight: bold'>"+v+"</span>"
            }else if(v=='已审核'){
                return "<span style='color:#4dae0b;font-weight: bold'>"+v+"</span>"
            }else{
                return "<span style='color:#8e2424;font-weight: bold'>"+v+"</span>"
            }
        }},
        {header:"性别", dataIndex:"u_sex", width:80},
        {header:"手机", dataIndex:"u_mobile", width:140},
        {header:"电话", dataIndex:"u_tel", width:140},
        {header:"导服费", dataIndex:"gu_price", width:80},
        {header:"地址", dataIndex:"u_home_addr", width:200},
        {header:"身份证", dataIndex:"u_card" , width:180},
        {header:"导游证", dataIndex:"gu_card", width:180},
        {header:"状态", dataIndex:"us_status", width:100},
        {header:"上岗时间", dataIndex:"us_work_time", width:200,renderer:formatTime},
        {header:"添加时间", dataIndex:"gu_addtime",width:200, renderer:formatTime}
    ];

    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'导游公司'}
    });

    var c_grid=new Ext.grid.GridPanel({
        region:'center',
        store:c_store,
        columns: c_cm,
        loadMask:{msg:'数据载入中，请稍候'},
        viewConfig:{
            emptyText:'没有导游信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'添加',act:'addt',iconCls:'button-add',handler:modify,hidden:isDisabled('Guide::add')},
            {text:'编辑',iconCls:'button-edit',handler:modify,hidden:isDisabled('Guide::edit')},
            {text:'审核', iconCls:'button-edit',id:'audit_btn',handler:modify,hidden:isDisabled('Guide::audit')},
            {text:'实名认证', iconCls:'button-edit',id:'check_btn',handler:modify,hidden:isDisabled('Guide::auth')},
            {text:'刷新',iconCls:'button-ref',handler:function(){c_store.reload()}},
            company_box,
            '->',
            '快捷搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'导游姓名',
                width:240,
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
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:c_store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: '没有数据'
        })
    });

    ROW.gu_org_id=_uinfo.org_id;
    SUNLINE.baseParams(c_store,{gu_org_id:ROW.gu_org_id});
    c_store.load();
    company_box.on('select',function(c,r){
        var row=r[0];
        SUNLINE.baseParams(c_store,{gu_org_id:row.get('id')});
        ROW.gu_org_id=row.get('id');
        c_store.load();
    })

    var u_education_combo=SUNLINE.DictComBox({id:'u_education',name:'u_education',fieldLabel:"文化程度",labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,value:'专科'},{'d_type':'文化程度'},'','',true);
    var us_status_combo=SUNLINE.DictComBox({id:'us_status',name:'us_status',fieldLabel:"工作状态",labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,value:'在职'},{'d_type':'工作状态'},'','',true);
    var gu_level_combo=SUNLINE.DictComBox({id:'gu_card_level',name:'gu_card_level',fieldLabel:"导游证级别",labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,value:'初级'},{'d_type':'导游证级别'},'','',true);
    var gu_tour_type_combo=SUNLINE.DictComBox({id:'gu_tour_type',name:'gu_tour_type',fieldLabel:"带团性质",labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,value:'全职'},{'d_type':'带团性质'},'','',true);
    var gu_work_type = SUNLINE.checkBoxGroup({id:'gu_work_type',name:'gu_work_type',fieldLabel:"工作性质",width:310,columns: 1,labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side'},gu_work_type_data,'',true);
    var gu_tour_style= SUNLINE.checkBoxGroup({id:'gu_tour_style',name:'gu_tour_style',fieldLabel:"带团风格",width:300,columns: 1,labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side'},gu_tour_style_data,'',true);
    var guide_base_form=new Ext.form.FormPanel({
        border:false,
        id:'ziyo001',
        defaultType : "textfield",
        bodyStyle:"background:none;padding:5;overflow-y:auto",
        labelWidth : 60,
        labelAlign : "right",
        items:[
            {
                xtype:'fieldset',
                title:'<span style="color: #1E88E5;font-size: 16px;font-family:Microsoft Yahei">基本信息</span>',
                columnWidth:1,
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:300,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:'u_id',name:'u_id',xtype:'hidden'},
                    {id:'gu_id',name:'gu_id',xtype:'hidden'},
                    {id:'us_id',name:'us_id',xtype:'hidden'},
                    {name:'action',xtype:'hidden',value:'添加'},
                    {id:'gu_source',name:'gu_source',xtype:'hidden',value:'guide'},
                    {id:'gu_status',name:'gu_status',xtype:'hidden',value:'未审核'},
                    {id:"u_mobile",name:"u_mobile", fieldLabel:"手机",vtype:'Mobile', maxLength:"11",allowBlank:false,listeners:{'blur':function(t){
                        var data=[];
                        var u_mobile=Ext.getCmp('u_mobile').getValue();
                        var gu_id=Ext.getCmp('gu_id').getValue();
                        data['gu_org_id']=ROW.gu_org_id;
                        data['gu_id']=gu_id;
                        checkUser(u_mobile,data);
                    }
                    }},
                    {id:"u_realname",name:"u_realname", fieldLabel:"姓名",maxLength:"20",allowBlank:false,vtype:'NotBlank'},
                    {
                        id:"u_sex",
                        labelWidth:100,
                        labelCls:'label-custom',
                        labelAlign:"right",
                        style:'margin-top:5px;',
                        name:"u_sex",
                        fieldLabel:"性别",
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['combo_u_sex'],
                            data:[
                                ['男'],
                                ['女']
                            ]
                        }),
                        displayField:"combo_u_sex",
                        valueField:"combo_u_sex",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:"男"
                    },
                    {id:'u_native_palce',name:'u_native_palce',fieldLabel:'籍贯',maxLength:20},
                    {id:"u_age", name:"u_age", fieldLabel:"年龄",xtype: 'numberfield', maxValue:120},
                    {id:"u_email",name:"u_email", fieldLabel:"邮箱",vtype:'email', maxLength:"20",vtypeText:'请填写正确的邮箱地址'},
                    {id:"u_home_addr",name:"u_home_addr", fieldLabel:"家庭住址"},
                    {id:"us_work_addr",name:"us_work_addr", fieldLabel:"工作地点"},
                    {id:"u_political",name:"u_political", fieldLabel:"政治面貌",maxLength:"20"},
                    u_education_combo.box,
                    {id:"u_qq",name:"u_qq", fieldLabel:"QQ",maxLength:"12"},
                    SUNLINE.ExtDateField({id:'us_work_time',name:'us_work_time',labelWidth:100,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;',fieldLabel:"上岗时间",width:300}),
                    {id:"gu_price",name:"gu_price", fieldLabel:"导服费",xtype: 'numberfield',value:'0'}
                ]
            },{
                xtype:'fieldset',
                title:'<span style="color: #1E88E5;font-size:16px;font-family:Microsoft Yahei">其他信息</span>',
                columnWidth:1,
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:300,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:"u_emergency_name",name:"u_emergency_name", fieldLabel:"紧急联系人"},
                    {id:"u_emergency_phone",name:"u_emergency_phone", fieldLabel:"紧急联系方式",vtype:'Mobile'},
                    {id:"u_remark",name:"u_remark", fieldLabel:"备注", xtype:'textarea', maxLength:"200", height:60,width:600}
                ]
            }, {
                xtype:'fieldset',
                title:'<span style="color:#1E88E5;font-size: 16px;font-family:Microsoft Yahei">基础工作信息</span>',
                columnWidth:1,
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:300,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    gu_level_combo.box,
                    gu_tour_type_combo.box,
                    gu_work_type[0],
                    gu_tour_style[0],
                    us_status_combo.box
                ]
            },{
                xtype:'fieldset',
                title:'<span style="color: #1E88E5;font-size:16px;font-family:Microsoft Yahei">工作经验</span>',
                columnWidth:1,
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:100,width:300,labelCls:'label-custom',labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:"gu_tour_year",name:"gu_tour_year",fieldLabel:"实际带团年限",xtype: 'numberfield',maxLength:"20"},
                    {id:"gu_work_year",name:"gu_work_year",fieldLabel:"公司工作年限",xtype: 'numberfield',maxLength:"20"},
                    {id:"gu_way",name:"gu_way", fieldLabel:"会带路线", xtype:'textarea', maxLength:"200", height:60,width:600},
                    {id:"gu_honor", name:"gu_honor", fieldLabel:"荣誉", xtype:'textarea', maxLength:"200", height:60,width:600}
                ]
            },
            {id:"u_card",name:"u_card",xtype:'hidden',fieldLabel:"身份证号",maxLength:"20"},
            {id:"u_card_front",name:"u_card_front",xtype:'hidden',fieldLabel:"身份证正面",maxLength:"20"},
            {id:"u_card_back",name:"u_card_back",xtype:'hidden',fieldLabel:"身份证反面",maxLength:"20" },
            {id:"gu_card",name:"gu_card",xtype:'hidden',fieldLabel:"导游证",maxLength:"20"},
            {id:"gu_card_front",name:"gu_card_front",xtype:'hidden',fieldLabel:"导游证正面",maxLength:"20"}
        ]
    })

    var attenment_panel=new Ext.panel.Panel({
        scroll:false,
        width:800,
        height:500,
        html:"<iframe id='vip_card_frame' name='vip_card' src='"+$__app__ + "/Guide/uploadCard' width='100%' height='100%' style='border:none'></iframe>"
    });

    attenment_panel.on('show',function(){
        var row=SUNLINE.getSelected(c_grid);
        window.vip_card.location=$__app__ + "/Guide/uploadCard/gu_id/"+row.data.gu_id;
    });

    function modify(v){
        if(v.text!='添加'){
            var row=SUNLINE.getSelected(c_grid);
            if(row==null){
                Ext.Msg.alert('友情提示','请选择您要操作的导游！');
                return false;
            }
        }
        right_panel.show();
        right_panel.setPosition(c_grid.getWidth()-650,0);
        right_panel.setHeight(c_grid.getHeight());
        attenment_panel.hide();
        if(v.text=='添加'){
            for(var i=0;i<user_field_list.length;i++){
                Ext.getCmp(user_field_list[i]).setReadOnly(false);
            }
            Ext.getCmp('base-info-btn').show().setPressed(true).addCls('tab-button-custom-pressed');
            guide_base_form.show();
        }else{
            row.data['us_work_time']=formatTime(row.data['us_work_time']);
            row.data.action= v.text;
            guide_base_form.show();
            var _guide_form=guide_base_form.getForm();
            _guide_form.setValues(row.data);
            SUNLINE.checkBoxGroupSetValues(gu_work_type,row.data['gu_work_type']);
            SUNLINE.checkBoxGroupSetValues(gu_tour_style,row.data['gu_tour_style']);
            if(v.text=='编辑'){
                for(var i=0;i<user_field_list.length;i++){
                    Ext.getCmp(user_field_list[i]).setReadOnly(true);
                }
                Ext.getCmp('base-info-btn').show().setPressed(true).addCls('tab-button-custom-pressed');
                Ext.getCmp('card-info-btn').show().setPressed(false).removeCls('tab-button-custom-pressed');
            }else if(v.text=='审核'){
                Ext.getCmp('save_btn').setText('审核通过');
                Ext.getCmp('base-info-btn').show().setPressed(true).addCls('tab-button-custom-pressed');
                Ext.getCmp('card-info-btn').show().setPressed(false).removeCls('tab-button-custom-pressed');
            }else if(v.text=='实名认证'){
                guide_base_form.hide();
                attenment_panel.show();
                Ext.getCmp('card-info-btn').show().setPressed(true).addCls('tab-button-custom-pressed');
            }
        }
    }

    c_grid.on('select',function(v,r){
        if(r.data['gu_status']=='已审核'){
            Ext.getCmp('audit_btn').disable();
            Ext.getCmp('check_btn').disable();
        }else{
            if(r.data['gu_status']=='审核中'){
                Ext.getCmp('check_btn').disable();
            }else{
                Ext.getCmp('check_btn').enable();
                Ext.getCmp('audit_btn').enable();
            }
        }
    })

    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
            SUNLINE.baseParams(c_store,{skey:skey,gu_org_id:ROW.gu_org_id})
        c_store.currentPage=1;
        c_store.load();
    };

/*    var left_panel=new Ext.panel.Panel({
        region:'center',
        items:[c_grid]
    });*/
    var right_panel=new Ext.panel.Panel({
        width:650,
        modal:true,
        floating:true,
        layout:'fit',
        tbar:{
            border: true,
            cls:'x-toolbar-custom',
            items:[
                {id:'base-info-btn',text:'基本信息',cls:'tab-button-custom',enableToggle:true,hidden:true,handler:show_form},
                {id:'card-info-btn',text:'身份信息',cls:'tab-button-custom',enableToggle:true,hidden:true,handler:show_form},
                '->',
                {id:'save_btn',text:'保存',iconCls:'fa fa-floppy-o',cls:'control-button-custom',overCls:'',handler:do_save},
                {text:'关闭',iconCls:'fa fa-times',cls:'control-button-custom',overCls:'',handler:hide_form}
            ]
        },
        items:[
            guide_base_form,attenment_panel
        ]
    });
    new Ext.Viewport({
        layout : 'border',
        items : [c_grid]
    });

    c_grid.on('resize',function(){
        if(!right_panel.isHidden()){
            right_panel.setPosition(c_grid.getWidth()-650,0);
            right_panel.setHeight(c_grid.getHeight());
        }
    });
    right_panel.on('hide',function(){
        guide_base_form.form.reset();
        guide_base_form.hide();
        attenment_panel.hide();
        Ext.getCmp('save_btn').setText('保存');
        Ext.getCmp('base-info-btn').hide();
        Ext.getCmp('card-info-btn').hide();
    })
    function hide_form(){
        Ext.MessageBox.confirm('友情提示','确定不保存就关闭？',function(v){
            if(v=='yes'){
                right_panel.hide()
            }
        })
    }
    function show_form(v){
        if(!v.pressed){
            v.setPressed(true);
            return false;
        }
        if(v.text=='基本信息'){
            attenment_panel.hide();
            guide_base_form.show();
            Ext.getCmp('base-info-btn').setPressed(true).addCls('tab-button-custom-pressed');
            Ext.getCmp('card-info-btn').setPressed(false).removeCls('tab-button-custom-pressed');
        }else if(v.text=='身份信息'){
            guide_base_form.hide();
            attenment_panel.show();
            Ext.getCmp('card-info-btn').setPressed(true).addCls('tab-button-custom-pressed');
            Ext.getCmp('base-info-btn').setPressed(false).removeCls('tab-button-custom-pressed');
        }
    }

    function do_save(){
        if(guide_base_form.isHidden()){
            var card_data=window.vip_card.cardData();
            if(!card_data.status){
                Ext.Msg.alert('友情提示', card_data.msg);
                return;
            }else{
                guide_base_form.getForm().setValues(card_data.data);
            }
        }else{
            if(!guide_base_form.form.isValid()){
                Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
                return;
            }
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=guide_base_form.getForm().getValues();
                data['gu_org_id']=ROW.gu_org_id;
                Ext.Ajax.request({
                    url : $__app__ + '/Guide/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            c_store.reload();
                            right_panel.hide();
                        };
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

    function formatTime(v){
        if(v==''|| v==0){
            return '';
        }
        var t = new Date(parseInt(v) * 1000);
        return Ext.Date.format(t,'Y-m-d');
    }

    function checkUser(mobile,data){
        Ext.Ajax.request({
            url:$__app__+'/Guide/checkUser',
            method:'POST',
            params:{u_mobile:mobile,gu_id:data.gu_id,gu_org_id:data.gu_org_id},
            success:function(response,ret){
                var ret = Ext.decode(response.responseText);
                if(ret.status==1){
                    var u_data=ret.info;
                    if(u_data.status==1){
                        u_data.msg['us_work_time']='';
                        guide_base_form.form.setValues(u_data.msg);
                        SUNLINE.checkBoxGroupSetValues(gu_work_type,u_data.msg['gu_work_type']);
                        SUNLINE.checkBoxGroupSetValues(gu_tour_style,u_data.msg['gu_tour_style']);
                        for(var i=0;i<user_field_list.length;i++){

                            Ext.getCmp(user_field_list[i]).setReadOnly(true);
                        }
                        Ext.getCmp('u_mobile').setReadOnly(false);
                    }else if(u_data.status==0){
                        for(var i=0;i<user_field_list.length;i++){
                            Ext.getCmp(user_field_list[i]).setReadOnly(false);
                        }
                        Ext.Msg.alert('友情提示', ret.info['msg']);
                        Ext.getCmp('u_mobile').setReadOnly(false);
                    }
                }else{
                    if(ret.info.status==1){
                        var status=Ext.getCmp('u_realname').readOnly;
                        if(status==true){
                            guide_base_form.reset();
                        }
                        Ext.getCmp('u_mobile').setValue(mobile);
                        for(var i=0;i<user_field_list.length;i++){
                            Ext.getCmp(user_field_list[i]).setReadOnly(false);
                        }
                    }
                }
            }
        })
    }

});

