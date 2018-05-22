var USER={};
var ROW = {};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url= $__app__ + '/Users/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);
    SUNLINE.baseParams(store,{u_org_id:_uinfo.u_org_id});
    store.load();
    if(_uinfo.u_org_id){
        ROW.u_org_id = _uinfo.u_org_id;
    }else{
        ROW.u_org_id = '';
    }
    var hiderule;
    /*if(_uinfo.org_type!='管理公司'){
        hiderule=true;
    }*/
    function int_to_date(v){
        if(!v || v==0)return '';
        return int2date(v);
    }
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID", dataIndex:"u_id", width:50, hidden:true},
        {header:"锁", dataIndex:"u_status", width:30,renderer:function(v){
            switch(v){
                case 'ok':
                    return '<font style = "color:#2c800e">正</font>';
                    break;
                case 'lock':
                    return '<span class = "button-lock" style = "background:no-repeat;display: inline-block;width:25px;height:25px"></span>';
                    break;
            }
        }},
        {header:"微信", dataIndex:"u_openid", width:70,renderer:wx},
        {header:"用户名", dataIndex:"u_name", width:100},
        {header:"真实姓名", dataIndex:"u_realname", width:80},
        {header:"手机号码", dataIndex:"u_mobile", width:100},
        {header:"权限角色", dataIndex:"r_name", width:100,renderer:rolerule},
        {header:"权限等级", dataIndex:"u_scope", width:80},
        {header:"年龄", dataIndex:"u_age", hidden:true},
        {header:"籍贯", dataIndex:"u_native_palce", hidden:true},
        {header:"单位", dataIndex:"u_org_id", width:100,hidden:true},
        {header:"部门", dataIndex:"wg_name", width:100},
        {header:"岗位职务", dataIndex:"u_job", width:100},
        {header:"单位名称", dataIndex:"org_name", width:180},
        {header:"状态", dataIndex:"u_status", width:100,hidden:true},
        {header:"身份证", dataIndex:"u_card", width:150},
        {header:"性别", dataIndex:"u_sex", width:60},
        {header:"文化程度", dataIndex:"u_culture", width:80},
        {header:"出生年月", dataIndex:"u_birthday", width:100,renderer:int_to_date},
        {header:"qq", dataIndex:"u_qq", width:100},
        {header:"传真", dataIndex:"u_fax", width:100},
        {header:"邮箱", dataIndex:"u_email", width:100},
        {header:"政治面貌", dataIndex:"u_zzmm", width:100,hidden:true},
        {header:"地址", dataIndex:"u_addr", width:100},
        {header:"添加时间", dataIndex:"u_addtime", width:100,/*dateFormat: 'Y-m-d',*/renderer:function(val){
            if(val != null){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d');
            }
        },hidden:true},
        {header:"备注", dataIndex:"u_remark", width:200}
    ];
    function getText(v){
        var str = '';
        switch(v){
            case 'boss':
                str = '老板';
                break;
            case 'sales':
                str = '销售';
                break;
            case 'guide':
                str = '导游';
                break;
            case 'drivers':
                str = '司机';
                break;
            case 'service':
                str = '客服';
                break;
            case 'finance':
                str = '财务';
                break;
        }
        return str;
    }

    function role_text(v){
        if(!v) return '';
        var arr = [];
        v = Ext.decode(v);
        Ext.each(v,function(i,v){
            arr.push(getText(i));
        })
        return arr.join(',');
    }

    var company_box=SUNLINE.CompanyBox({
        config:{
            hidden:hiderule,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:300,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var select_role = SUNLINE.ComBoxPlus({
        url:$__app__+'/Role/roleJson',
        fields:['r_id','r_name'],
        where:{r_org:ROW.u_org_id,r_id:ROW.u_role_id},
        config:{
            id:'role_id',
            name: 'role_id',
            fieldLabel:'权限角色',
            labelWidth:60,
            width:220,
            labelAlign:'right',
            displayField: 'r_name',
            valueField: 'r_id',value:'全部权限'
        }
    });

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {text:'添加',act:'addt',iconCls:'button-add',handler:modify,disabled:isDisabled('Users::add')},
            '-',
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Users::save')},
            '-',
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Users::del')},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}, //,handler:_ziyo_log
            '-',
            {text:'用户锁定',iconCls:'button-lock',handler:AllLock,id:'lock_id',disabled:isDisabled('Users::UserLock')},
            /*'-',
            {text:'解除锁定',iconCls:'lock-back',handler:LockBack},*/
            '-',
            {text:'重置密码',iconCls:'button-pass',handler:userModify,disabled:isDisabled('Users::UpUserPass')},

            {text:'设为管理员',iconCls:'button-pass',handler:userAdmin,id:'admin_id',disabled:isDisabled('Users::UserAdmin')},
            '-',
            company_box,
            '-',
            select_role,
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'u_Search',
                iconCls:'button-sch',
                emptyText : '用户名，拼音码，真实名字，手机号',
                width:245,
                onTriggerClick:function(e){
                    UserSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            UserSearch();
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有用户，快去添加哦'
        })
    });

    select_role.store.on({
        load:function(){
            select_role.store.add({r_id:0,r_name:'全部权限'});
        }
    });
    select_role.on({
        select:function(c,r){
            var row=r[0].data;
            var us_data={u_org_id:ROW.u_org_id};
            if(row.r_id>0)us_data.u_role_id=row.r_id;
            SUNLINE.baseParams(store,us_data);
            store.currentPage=1;
            store.load();
        }
    });

    grid.on('rowclick',function(t,r,tr,ri){
        var lock= r.get('u_status');
        var admin= r.get('u_admin');
        if(lock=='lock'){
            Ext.getCmp('lock_id').setText('解除锁定');
        }else{
            Ext.getCmp('lock_id').setText('用户锁定');
        }
        if(admin == 1){
            Ext.getCmp('admin_id').setText('解除管理员');
        }else{
            Ext.getCmp('admin_id').setText('设为管理员');
        }
    });

    function UserSearch(){
        var skey=Ext.getCmp('u_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey,u_org_id:ROW.u_org_id});
        store.currentPage=1;
        store.load();
    }
    var uorg_id = SUNLINE.ComBoxPlus({
        url:$__app__+'/Company/dataJson',
        fields:['org_id','org_name'],
        where:{wg_org_id:ROW.u_org_id},
        config:{
            id:'org_name',
            name:'org_name',
            fieldLabel:'选择单位',
            labelWidth:90,
            labelAlign:'right',
            displayField:'org_name',
            valueField:'org_id'
        }
    })
    var u_scope=SUNLINE.ComBoxPlus({
        action:'local',
        storeData:user_level,
        fields:['name'],
        id:'name',
        config:{
            editable:false,
            id:'u_scope',
            name:'u_scope',
            fieldLabel:'权限等级',
            value:'用户级',
            labelWidth:90,
            labelAlign:'right'
        }
    });

    var wg_name=SUNLINE.ComBoxPlus({
        url:$__app__+'/Workgroup/dataJson',
        fields:['wg_id','wg_name'],
        where:{wg_org_id:ROW.u_org_id},
        config:{
            id:'wg_name',
            name:'wg_name',
            fieldLabel:'选择部门',
            labelWidth:90,
            matchFieldWidth:false,
            listConfig:{width:350},
            labelAlign:'right',
            displayField:'wg_name',
            valueField:'wg_id',
            pageSize:20
        }
    });



    /*var u_join=SUNLINE.ComBoxPlus({
        id:'us_status',
        fields:['d_id','d_text','d_type'],url:$__app__+'/Dict/dict_json',
        where:{d_type:'工作状态'},
        config:{displayField:'d_text',valueField:'d_text',value:'在职',fieldLabel: '在职状态',labelWidth:90,labelAlign:'right'}
    });*/



    var u_role = SUNLINE.ComBoxPlus({
        url:$__app__+'/Role/roleJson',
        fields:['r_id','r_name'],
        where:{r_org:ROW.u_org_id,r_id:ROW.u_role_id},
        config:{
            id:'u_role_id', 
            name: 'u_role_id',
            fieldLabel:"<span class='input-red'>*</span> 角色权限",
            labelWidth:90,
            labelAlign:'right',
            allowBlank:false,
            displayField: 'r_name',
            valueField: 'r_id'
        }
    });


    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box_store.load();
    company_box.on('select',function(c,r){
        Ext.getCmp('u_Search').setValue('');
        var row= r[0];
        SUNLINE.baseParams(store,{u_org_id:row.get('id')});
        ROW.u_org_id=row.get('id');
        store.load();
        //重载部门
        SUNLINE.baseParams(u_role.store,{r_org:ROW.u_org_id});
        u_role.store.load();

        SUNLINE.baseParams(select_role.store,{r_org:ROW.u_org_id});
        select_role.store.load();
        select_role.setValue('全部权限');

        //重载权限
        SUNLINE.baseParams(wg_name.store,{wg_org_id:ROW.u_org_id});
        wg_name.store.load();
    });
    /*var us_ticket_type=SUNLINE.ComBoxPlus({
        action:'local',
        storeData:price_type,
        fields:['name'],
        id:'name',
        config:{
            id:'us_ticket_type',
            name:'us_ticket_type',
            fieldLabel:'票价类型',
            value:'同行价',
            labelWidth:90,
            labelAlign:'right'
        }
    });*/

    var u_culture = SUNLINE.ComBoxPlus({
        id:'u_culture',
        fields:['d_id','d_text','d_type'],url:$__app__+'/Dict/dict_json',
        where:{d_type:'文化程度'},
        config:{displayField:'d_text',valueField:'d_text',value:'',fieldLabel: '文化程度',labelWidth:90,labelAlign:'right'}
    });
    var specailR = [];
    for(var i in SpecailRole){
        specailR.push({
            id:i,
            //name : i,
            boxLabel:SpecailRole[i],
            name:'us_specail_role',
            inputValue:i
            //value : i
        });
    }
    var form=Ext.create('Ext.form.Panel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        items:[
            {
                cls:'tcol2',
                defaults: {
                    labelWidth:90,
                    labelAlign:'right',
                    xtype:'textfield'
                },
                items:[
                    {id:"u_id",name:"u_id",fieldLabel:"ID",xtype:"hidden"},
                    {id:"u_org_id",name:"u_org_id",fieldLabel:"单位ID",xtype:"hidden"},
                    {id:"u_name",name:"u_name",fieldLabel:"<span class='input-red'>*</span> 用户名",vtype:'alphanum',maxLength:"20",emptyText:'用于登录，建议使用英文字母',allowBlank:false},
                    {id:"u_realname", name:"u_realname", fieldLabel:"<span class='input-red'>*</span> 真实姓名", maxLength:"20",allowBlank:false },
                    {id:"u_wg_id", name:"u_wg_id", fieldLabel:"部门ID",xtype:'hidden' },
                    wg_name,
                    {id:'u_job', name:'u_job', fieldLabel:'岗位职务', maxLength:"20"},
                    u_scope,
                    u_role,
                    /*us_ticket_type,*/
                    /*u_join,*/
                    {fieldLabel:'特殊权限',width:610,xtype: 'hidden',id:'ddd',columns: 3,vertical: true,disabled:isDisabled('Users::setSpecail'),items:specailR},
                    {id:"u_addr",name:"u_addr",fieldLabel:"地址",maxLength:"200",width:610,allowBlank:true},

                    {id:"u_mobile",name:"u_mobile",fieldLabel:"<span class='input-red'>*</span> 手机",vtype:'Mobile',maxLength:"45",allowBlank:false,
                        listeners:{
                            'blur':function (v) {
                                var u_id=Ext.getCmp('u_id').getValue();
                                if(u_id)return '';
                                user_form(v.getValue());
                            }
                        }
                    },
                    {id:"u_card",name:"u_card",fieldLabel:"身份证",maxLength:"18",
                        listeners:{
                            'blur':function (_v) {
                                var card = _v.value;
                                var rst = CardChk(card);
                                if (rst.start == 1) {
                                    Ext.getCmp('u_sex').setValue(rst.data.sex);
                                    Ext.getCmp('u_birthday').setValue(rst.data.birthday);
                                } else {
                                    Ext.Msg.alert('友情提示','请填写正确的身份证号（'+rst.info+')');
                                }
                            }
                        }
                    },
                    {id:"u_sex",name:"u_sex",fieldLabel:"性别",xtype:"combo",editable:false,triggerAction:"all",store:new Ext.data.SimpleStore({fields:['combo_u_sex'],data:[['男'],['女']]}),displayField:"combo_u_sex",valueField:"combo_u_sex",
                        mode:"local",forceSelection:true,typeAhead:true,value:"男"},
                    {id:"u_birthday",name:"u_birthday",fieldLabel:"出生年月",xtype:'datefield',format:'Y-m-d',editable:false},
                    /*{id:"u_age",name:"u_age",fieldLabel:"年龄",allowBlank:true},
                    {id:"u_native_palce",name:"u_native_palce",fieldLabel:"籍贯",allowBlank:true},*/
                    u_culture,
                    {id:"u_zzmm",name:"u_zzmm",fieldLabel:"政治面貌",xtype:"combo",editable:false,triggerAction:"all",store:new Ext.data.SimpleStore({fields:['u_political'],data:[['团员'],['党员'],['无']]}),
                        displayField:"u_political",valueField:"u_political",mode:"local",forceSelection:true,typeAhead:true,value:"无"},
                    {id:"u_tel",name:"u_tel",fieldLabel:"电话",maxLength:"45",allowBlank:true},
                    {id:"u_fax",name:"u_fax",fieldLabel:"传真",maxLength:"45",allowBlank:true},
                    {id:"u_qq",name:"u_qq",fieldLabel:"QQ",maxLength:"45",xtype : 'numberfield',
                        listeners:{
                            blur:function (_t, _n, _o) {
                                var em = Ext.getCmp('u_email');
                                if (em.isValid()==false || em.getValue()=='')
                                    em.setValue(_t.getValue() + '@qq.com');
                            }
                        }
                    },
                    {id:"u_email",name:"u_email",fieldLabel:"邮箱",vtype : 'email',vtypeText : '邮箱格式不正确！如：your_name@888ly.cn',maxLength:"100"},
                    {id:"u_emergency_name",name:"u_emergency_name",fieldLabel:"紧急联系人",allowBlank:true},
                    {id:"u_emergency_phone",name:"u_emergency_phone",fieldLabel:"紧急联系电话",vtype:'Mobile',allowBlank:true},
                    {id:"u_remark",name:"u_remark",fieldLabel:"备注",xtype:'textarea', maxLength:"200",height:60,width:610,allowBlank:true}
                ]
            }
        ]
    });

    wg_name.on('select',function(c,r){
        var r=r[0];
        Ext.getCmp('u_wg_id').setValue(r.get('wg_id'));
    });

    //通过手机账号获取用户信息
    function user_form(v){
        if(!v)return '';
        Ext.Ajax.request({
            url: $__app__+'/Users/user_form_mobile',
            params: {u_mobile:v},
            success: function(response){
                var r = Ext.decode(response.responseText);
                var info= r.info;
                var _form=form.getForm();
                info.u_id='';
                info.u_zname=info.u_realname;
                _form.setValues(info);
            }
        })
    }

    function del(){
        checkOrg();
        var row = SUNLINE.getSelected(grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请选择你要删除的内容！');
            return;
        }
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            var myMask = SUNLINE.LoadMask('数据处理中，请稍候...');
            myMask.show();
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Users/UserDel',
                    params: {u_id:row.data.u_id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info.msg);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })
    }
    var uform = Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:60,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [{
                fieldLabel: 'ID',
                name: 'u_id',
                hidden:true
            },
            {
                id:'u_uname',
                fieldLabel:'用户名',
                name:'u_name',
                allowBlank: false,
                disabled:true
            },
            {
                id:'u_uzname',
                fieldLabel:'真实姓名',
                name:'u_realname',
                allowBlank: false,
                disabled:true
            },
            {
                id:'u_password',
                fieldLabel:'密码',
                name:'u_password',
                allowBlank: false
            }
        ]
    });
    var win=Ext.create('Ext.window.Window', {
        title:'修改密码',
        closeAction:'hide',
        autoHeight:true,
        width: 400,
        modal:true,
        items: [uform],
        buttons: [
            {text: '提交',handler: function() {
                var iform = uform.getForm();
                var v=iform.getValues();
                if (!iform.isValid()) {
                    Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                    return;
                }
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url: $__app__+'/Users/UpUserPass',
                    params: v,
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info);
                        if(r.status){
                            win.hide();
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }},
            {text: '关闭',handler: function() {
                win.hide();
            }}
        ]
    });
    function checkOrg(){
        if(typeof (ROW.u_org_id) == 'undefined'){
            Ext.Msg.alert('友情提示','您暂无单位信息，请先选择单位！');
            return false;
        }
    }
    function userModify(v){
        checkOrg();
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要修改密码的用户！');
            return false;
        }

        var iform = uform.getForm();
        iform.setValues(ret.data);
        Ext.getCmp('u_password').setValue('');
        win.show();

    };
    function userAdmin(b){
        var ret=SUNLINE.getSelected(grid);
        var org_type =_uinfo.org_type;
        var org_id =_uinfo.org_id;
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要设置的用户信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要进行'+b.text+'吗？',function(y){
            if(y!='yes')return false;
            if(b.text=='设为管理员'){
                admin(org_type);
            }else{
                disAdmin(org_type,org_id);
            }
        });
    }
    function AllLock(b){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要锁定的用户信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要进行'+b.text+'吗？',function(y){
            if(y!='yes')return false;
            if(b.text=='用户锁定'){
                userLock();
            }else{
                LockBack();
            }
        });

    };
    function admin(org_type){
        checkOrg();
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要设置管理员的用户信息！');
            return false;
        }
        var uid = ret.data.u_id;
        var u_status = ret.data.u_admin;
        if(u_status == '1'){
            Ext.Msg.alert('友情提示','用户已经是管理员，无需再次操作！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Users/userAdmin',
            params: {u_id:uid,u_status:u_status,u_org_id:ROW.u_org_id,u_role_id:org_type},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    store.reload();
                }
                myMask.hide();
            }
        })
    }
    function disAdmin(org_type){
        checkOrg();
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要解除管理员的用户信息！');
            return false;
        }
        var uid = ret.data.u_id;
        var u_status = ret.data.u_admin;
        if(u_status == 0){
            Ext.Msg.alert('友情提示','用户已经不是管理员，无需再次操作！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Users/userAdmin',
            params: {u_id:uid,u_status:u_status,u_org_id:ROW.u_org_id,u_role_id:org_type},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    store.reload();
                }
                myMask.hide();
            }
        })
    }
    function userLock(v,n,r){
        checkOrg();
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要锁定的用户信息！');
            return false;
        }
        var uid = ret.data.u_id;
        var u_status = ret.data.u_status;
        if(u_status == 'lock'){
            Ext.Msg.alert('友情提示','Ta已经很惨了，被锁定过就别再锁了！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Users/UserLock',
            params: {u_id:uid,u_status:u_status,u_org_id:ROW.u_org_id},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    store.reload();
                }
                myMask.hide();
            }
        })
    }
    function LockBack(){
        checkOrg();
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要解锁的用户信息！');
            return false;
        }
        var uid = ret.data.u_id;
        var u_status = ret.data.u_status;
        if(u_status != 'lock'){
            Ext.Msg.alert('友情提示','嗨，Ta的状态已为正常状态');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Users/UserLock',
            params: {u_id:uid,u_status:u_status,u_org_id:ROW.u_org_id},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    store.reload();
                }
                myMask.hide();
            }
        })
    }
    function modify(b){
        checkOrg();
        if(b.text=='添加'){
            if(ROW.u_org_id==0){
                Ext.Msg.alert('友情提示','选择全部公司，不能修改用户信息');
                return false;
            }
            ROW.values={};
            Ext.getCmp('u_mobile').enable(true);
            Ext.getCmp('u_name').enable(true);
            Ext.getCmp('u_role_id').setDisabled(false);

            winPanel.show();
            winPanel.setTitle('添加用户');
        }else{
            var ret=SUNLINE.getSelected(grid);
            if(ret==null){
                Ext.Msg.alert('友情提示','请选择你要编辑的用户信息！');
                return false;
            }
            ROW.values=ret.data;
            Ext.getCmp('u_name').disable(true);
            var userinfo=_uinfo;
            if(userinfo.u_admin=='0'){
                Ext.getCmp('wg_name').setDisabled(true);
                Ext.getCmp('u_scope').setDisabled(true);
                Ext.getCmp('u_role_id').setDisabled(true);
            }else{
                if(ROW.values.u_admin=='1'){
                    Ext.getCmp('u_role_id').setDisabled(true);
                }else{
                    Ext.getCmp('u_role_id').setDisabled(false);
                    Ext.getCmp('wg_name').setDisabled(false);
                    Ext.getCmp('u_scope').setDisabled(false);
                }
            }


       winPanel.show();
            winPanel.setTitle('编辑用户');
        }

    }

    var panel_width=500;
    var winPanel = Ext.create('Ext.window.Window', {
        closeAction:'hide',
        autoHeight:true,
        width: 650,
        modal:true,
        items: [form],
        buttons:[
            {text:'保存',iconCls:'button-save',handler:function(){
                save_panel();
            }},
            {text:'关闭',iconCls:'button-del',handler:function(){
                winPanel.hide();
            }}
        ]
    });
    function save_panel(){
        var iform = form.getForm();
        var v=iform.getValues();

        var nameVal = Ext.getCmp('u_name').getValue();
        var mobVal = Ext.getCmp('u_mobile').getValue();
        v.u_name = nameVal;
        v.u_mobile = mobVal;
        var org_type=_uinfo.org_type;
        v.org_type=org_type;

        var u_scope = v.u_scope;
        var wg_id = v.u_wg_id;
        var wg_name = v.wg_name;


        if(!v.u_org_id)v.u_org_id = ROW.u_org_id;
        if(v.us_specail_role && v.us_specail_role.length>0){
            v.us_specail_role = Ext.encode(v.us_specail_role);
        }
        if (!iform.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        if(u_scope == '部门级' && wg_id == 0){
            Ext.Msg.alert('友情提醒','请为部门级用户选择对应部门！');
            return;
        }

        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Users/save',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info.msg);
                if(r.status){
                    winPanel.hide();
                    store.reload();
                }
                myMask.hide();
            }
        })

    }

    winPanel.on('show',function(){
        form.getForm().reset();
        form.getForm().setValues(ROW.values);
        if(ROW.values.us_specail_role){
            var role = Ext.decode(ROW.values.us_specail_role);
            Ext.getCmp('ddd').setValue({'us_specail_role':role});
        }
    });
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
    function rolerule(v, c, r) {
        if (r.data['u_admin'] == 1) {
            return '<font color="green" style="font-weight:900">管理员<font/>';
        } else {
            return r.data.r_name;
        }
    }
    function wx(v,c,r){
        if(r.data['u_openid']){
            return '<font color="red" title="'+ r.data["u_nickname"]+'">已绑定<font/>';
        }else{
            return '<font color="#999" >未绑定<font/>';
        }
    }
    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'Users', table:'Users', pk_id:'u_id'}] });


})