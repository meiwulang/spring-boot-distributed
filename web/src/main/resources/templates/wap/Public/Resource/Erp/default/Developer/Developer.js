var USER={};
var ROW = {};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url= $__app__ + '/Developer/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);
    store.on('load', function(){
        set_status_btn(store, true);
    });
    var _data_all, _data_ok, _data_no;

    function set_status_btn(_store, opt) {
        var app_all = Ext.getCmp('app_all'), n_all = _store.getCount(),
            app_ok = Ext.getCmp('app_ok'), n_ok = 0,
            app_no = Ext.getCmp('app_no'), n_no = 0;
        _data_all = [];
        _data_no = [];
        _data_ok = [];
        store.each(function (r) {
            _data_all.push(r.data);
            if (r.get('ad_status') == '审核中') {
                _data_no.push(r.data);
                n_no++;
            } else {
                _data_ok.push(r.data);
                n_ok++;
            }
        });
        app_all.setText('全部开发者<span>' + n_all + '</span>').setDisabled(n_all == 0);
        app_ok.setText('已审核<span>' + n_ok + '</span>').setDisabled(n_ok == 0);
        app_no.setText('未审核<span>' + n_no + '</span>').setDisabled(n_no == 0);
    }

    store.load();
    function int_to_date(v){
        if(!v || v==0)return '';
        return int2date(v);
    }
    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"u_id", width:50, hidden:true},
        {header:"开发者帐号", dataIndex:"ad_name", width:100},
        {header:"开发者名称", dataIndex:"ad_name", width:80},
        {header:"手机号码", dataIndex:"ad_mobile", width:100},
        {header:"开发者类型", dataIndex:"ad_type", width:100},
        {header:"证件类型", dataIndex:"ad_identity_type", width:80},
        {header:"证件号码", dataIndex:"ad_identity_card", width:100},
        {header:"证件照片", dataIndex:"ad_identity_photo", width:100,renderer:formatPic},
        {header:"电子邮件", dataIndex:"ad_email", width:100},
        {header:"QQ", dataIndex:"ad_qq", width:100},
        {header:"状态", dataIndex:"ad_status", width:100,renderer:function(v){
            if(v=='审核中'){
                return "<span style='color:red;font-weight: bold'>"+v+"</span>";
            }else{
                return "<span style='color:green;font-weight: bold'>"+v+"</span>";
            }
        }},
        {header:"银行名称", dataIndex:"ad_bank_name", width:150},
        {header:"银行卡号", dataIndex:"ad_bank_card_no", width:200},
        {header:"开发者简介", dataIndex:"ad_describe", width:200},
        {header:"注册时间", dataIndex:"ad_time", width:100,/*dateFormat: 'Y-m-d',*/renderer:function(val){
            if(val != null){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d');
            }
        },hidden:true},
    ];

    function formatPic(v,m,r){
        if(v){
            return "<img style='height: 20px;' src='" +v + "?x-oss-process=image/resize,m_fill,h_30,w_60' data-qtip='<img src=" + v + "?x-oss-process=image/resize,m_fill,w_500>'>";
        }else{
            return "暂无照片";
        }
    };

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        layout:'fit',
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {id:'app_all', text:'全部开发者',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', pressed:true, handler:user_list},
            {id:'app_ok', text:'已审核',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:user_list},
            {id:'app_no', text:'未审核',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:user_list},
            {text:'添加',act:'addt',iconCls:'button-add',handler:modify,disabled:isDisabled('Users::add')},
            '-',
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Users::save')},
            '-',
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Users::del')},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '-',
            {text:'修改密码',iconCls:'button-pass',handler:userModify,disabled:isDisabled('Users::UpUserPass')},
            {text:'审核通过',iconCls:'button-pass',handler:userAdmin,id:'admin_id'},
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
        }),
        listeners:{
            "select":function(i,r){
                var status=r.get('ad_status');
                Ext.getCmp('admin_id').setDisabled(status=='已通过');
            }
        }
    });

    function user_list(){
        if(this.id=='app_ok'){
            store.loadData(_data_ok);
        }
        if(this.id=='app_no'){
            store.loadData(_data_no);
        }

        if(this.id=='app_all'){
            store.loadData(_data_all);
        }

    }

    function UserSearch(){
        var skey=Ext.getCmp('u_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
    }

    var form=Ext.create('Ext.form.Panel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        defaults: {
            labelWidth:90,
            labelAlign:'right',
            width:330
        },
        items:[
                    {id:"ad_id",name:"ad_id",fieldLabel:"ID",xtype:"hidden"},
                    {id:"ad_uname",name:"ad_uname",xtype:'textfield',fieldLabel:"<span class='input-red'>*</span> 开发者帐号",vtype:'email',maxLength:"20",emptyText:'请填写email',allowBlank:false},
                    {id:"ad_name", name:"ad_name",xtype:'textfield', fieldLabel:"<span class='input-red'>*</span> 开发者名称", maxLength:"20",allowBlank:false },
                    {id:'ad_type', name:'ad_type', fieldLabel:'开发者类型',xtype:"combo",editable:false,triggerAction:"all",store:new Ext.data.SimpleStore({fields:['ad_type'],data:[['个人'],['公司']]}),
                        displayField:"ad_type",valueField:"ad_type",mode:"local",forceSelection:true,typeAhead:true,value:"无"},
                    {id:"ad_mobile",xtype:'textfield',name:"ad_mobile",fieldLabel:"<span class='input-red'>*</span> 手机号码",vtype:'Mobile',maxLength:"45",allowBlank:false},
                    {id:'ad_identity_type', name:'ad_identity_type', fieldLabel:'证件类型',xtype:"combo",editable:false,triggerAction:"all",store:new Ext.data.SimpleStore({fields:['ad_identity_type'],data:[['身份证'],['护照'],['企业营业执照']]}),
                        displayField:"ad_identity_type",valueField:"ad_identity_type",mode:"local",forceSelection:true,typeAhead:true,value:"无"},
                    {id:"ad_identity_card",xtype:'textfield',name:"ad_identity_card",fieldLabel:"证件号码"},
                    {id:"ad_qq",name:"ad_qq",fieldLabel:"QQ",maxLength:"45",xtype : 'numberfield'},
                    {id:"ad_identity_photo",name:"ad_identity_photo",fieldLabel:"photo",xtype:"hidden"},
                    {id:"ad_bank_name",xtype:'textfield',name:"ad_bank_name",fieldLabel:"银行名称",allowBlank:true},
                    {id:"ad_bank_card_no",xtype:'textfield',name:"ad_bank_card_no",fieldLabel:"银行卡号",allowBlank:true},
                    {
                        margin:'20px 0 0 7px',
                        height:180,
                        html:"<label class=\"upload_file_name\"><font color='red'>&nbsp;</font> 上传文件<span role=\"separator\">:</span></label>" +
                        "<li class=\"cover-cls\"> <button class=\"upload-btn\" id=\"upload_file\">上传证件</button>" +
                        "<div class=\"cover-img\" id=\"cover-img_1\"><form><div class=\"files\"><div class=\"upload-selecter\"></div>" +
                        "<input type=\"file\" name=\"upload-file\" class=\"upload-file\"></div></form>" +
                        "<span class=\"upload-msg\">[建议尺寸:(134*69)，大小:不超过(5M)]</span></li>"
                    },
                    {id:"ad_describe",name:"ad_describe",fieldLabel:"开发者简介",xtype:'textarea', maxLength:"200",height:60,width:410,allowBlank:true}
                ]

    });



    function del(){
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
                    url: $__app__+'/Developer/UserDel',
                    params: {u_id:row.data.ad_id},
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
                name: 'ad_id',
                hidden:true
            },
            {
                id:'ad_duname',
                fieldLabel:'用户名',
                name:'ad_uname',
                allowBlank: false,
                disabled:true
            },
            {
                id:'ad_dname',
                fieldLabel:'真实姓名',
                name:'ad_name',
                allowBlank: false,
                disabled:true
            },
            {
                id:'ad_upass',
                fieldLabel:'密码',
                inputType:'password',
                name:'ad_upass',
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
                    url: $__app__+'/Developer/UpUserPass',
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

    function userModify(v){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要修改密码的用户！');
            return false;
        }
                var iform = uform.getForm();
                iform.setValues(ret.data);
                win.show();
    };
    function userAdmin(b){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要设置的用户信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要进行'+b.text+'吗？',function(y){
            if(y!='yes')return false;
            if(b.text=='审核通过'){
                admin();
            }
        });
    }
    function admin(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要设置管理员的用户信息！');
            return false;
        }
        var uid = ret.data.ad_id;
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Developer/userAdmin',
            params: {ad_id:uid},
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


    var uploads = {
        construction: function (logo_url) {
            this.uploadify(logo_url);
        },
        uploadify: function (logo_url) {
            $('.cover-img').uploadFile({
                    url: $__app__ + '/Upload/ajax_upload',
                    verify: {size: 5000, type: ['jpg', 'JPG', 'gif', 'PNG', 'png', 'GIF']},
                    multiple: false,
                    select_id: '.upload-btn',
                    process: '?x-oss-process=image/resize,m_mfit,h_39,w_134',
                    load_msg: '正在努力上传中，请稍等...',
                    default_url: logo_url,
                    data: {
                        table_model: '产品',
                        table_id: 3045
                    }
                }, function (r) {
                    $('input[name=ad_identity_photo]').val(r.data.url);
                }, function (r) {
                    Ext.Msg.alert('友情提示', r.msg);
                }
            );
        }
    };

    function modify(b){
        if(b.text=='添加'){
            if(ROW.u_org_id==0){
                Ext.Msg.alert('友情提示','选择全部公司，不能修改用户信息');
                return false;
            }
            ROW.values={};
            Ext.getCmp('ad_mobile').enable(true);
            Ext.getCmp('ad_uname').enable(true);
            winPanel.show();
            winPanel.setTitle('添加用户');
        }else{
            var ret=SUNLINE.getSelected(grid);
            if(ret==null){
                Ext.Msg.alert('友情提示','请选择你要编辑的用户信息！');
                return false;
            }
            ROW.values=ret.data;
            Ext.getCmp('ad_uname').disable(true);

       winPanel.show();
            winPanel.setTitle('编辑用户');
        }

    }

    var winPanel = Ext.create('Ext.window.Window', {
        closeAction:'hide',
        autoHeight:true,
        width: 450,
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
        var nameVal = Ext.getCmp('ad_name').getValue();
        var mobVal = Ext.getCmp('ad_mobile').getValue();
        v.u_name = nameVal;
        v.u_mobile = mobVal;
        if (!iform.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Developer/save',
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
        uploads.construction(ROW.values.ad_identity_photo);
    });
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'Developer', table:'AppDeveloper', pk_id:'ad_id'}] });


})