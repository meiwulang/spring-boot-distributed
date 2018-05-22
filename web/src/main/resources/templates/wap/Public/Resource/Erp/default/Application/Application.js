var USER={};
var ROW = {};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url= $__app__ + '/Application/dataJson';
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
            if (r.get('app_status') == '未审核') {
                _data_no.push(r.data);
                n_no++;
            } else {
                _data_ok.push(r.data);
                n_ok++;
            }
        });
        app_all.setText('全部应用<span>' + n_all + '</span>').setDisabled(n_all == 0);
        app_ok.setText('已审核<span>' + n_ok + '</span>').setDisabled(n_ok == 0);
        app_no.setText('未审核<span>' + n_no + '</span>').setDisabled(n_no == 0);
    }

    store.load();
    var cm=[
        {header:"ID", dataIndex:"app_id", width:50},
        {header:"应用图标", dataIndex:"app_logo", width:100,renderer:formatPic},
        {header:"应用名称", dataIndex:"app_name", width:150},
        {header:"状态", dataIndex:"app_status", width:100,renderer:function(v){
            if(v=='未审核'){
                return "<span style='color:red;font-weight: bold'>"+v+"</span>";
            }else{
                return "<span style='color:green;font-weight: bold'>"+v+"</span>";
            }
        }},
        {header:"app_secret", dataIndex:"app_secret", width:150},
        {header:"app_key", dataIndex:"app_key", width:150},
        {header:"应用服务器地址", dataIndex:"app_server", width:150},
        {header:"开发者名称", dataIndex:"app_user_name", width:150},
        {header:"使用权限", dataIndex:"app_role", width:100},
        {header:"是否支持免费体验", dataIndex:"app_allow_trial", width:100,align:"center"},
        {header:"体验周期", dataIndex:"app_allow_trial_cycle", width:100},
        {header:"技术支持姓名", dataIndex:"app_support_user", width:150},
        {header:"技术支持电话", dataIndex:"app_support_mobile", width:200},
        {header:"发布时间", dataIndex:"app_time", width:100,/*dateFormat: 'Y-m-d',*/renderer:function(val){
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
            {id:'app_all', text:'全部应用',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', pressed:true, handler:app_list},
            {id:'app_ok', text:'已审核',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:app_list},
            {id:'app_no', text:'未审核',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:app_list},
            '-',
            {text:'查看',iconCls:'button-sch',handler:view},
            '-',
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Users::del')},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '-',
            {text:'审核应用',iconCls:'button-pass',handler:audit_show,id:'admin_id'},
            '-',
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'u_Search',
                iconCls:'button-sch',
                emptyText : '应用名称，开发者',
                width:245,
                onTriggerClick:function(e){
                    Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            Search();
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
               var status=r.get('app_status');
               //Ext.getCmp('admin_id').setDisabled(status=='已发布');
            }
        }
    });


    function audit_show(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要编辑的用户信息！');
            return false;
        }
        ROW.values=ret.data;
        winPanel.show();
    }
    function view(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择要查看的应用！');
            return false;
        }
        var html_url ='http://app.jdytrip.cn/detail.html';
        window.open(html_url+'?app_id='+ret.data.app_id,'_blank');
    }

    function app_list(){
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
    function Search(){
        var skey=Ext.getCmp('u_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
    }

    var form=Ext.create('Ext.form.Panel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        items:[
            {
                defaults: {
                    labelWidth:90,
                    labelAlign:'right',
                    width:610
                },
                items:[
                    {id:"app_id",name:"app_id",fieldLabel:"ID",xtype:"hidden"},
                    {id:"app_name",name:"app_name",fieldLabel:"应用名称",maxLength:"20",emptyText:'',allowBlank:false,xtype:'textfield'},
                    {id:"app_support_user",name:"app_support_user",fieldLabel:"开发者名称",xtype:'textfield'},
                    //{id:"app_role",name:"app_role",fieldLabel:"使用范围",xtype:'textfield'},
                    {xtype:'checkboxgroup',name:'checkboxgroup',
                        id: 'checkboxgroup', fieldLabel: '使用范围',columnWidth:0.7,
                        items: [
                            { boxLabel: '供应商', name: 'app_role[]', inputValue: '供应商' },
                            { boxLabel: '分销商', name: 'app_role[]', inputValue: '分销商' },
                            { boxLabel: '管理公司', name: 'app_role[]', inputValue: '管理公司' }
                        ]},
                    {id:"app_allow_trial_cycle",name:"app_allow_trial_cycle",fieldLabel:"体验周期",xtype:'textfield'},
                    {id:"app_status",name:"app_status",fieldLabel:"应用状态",xtype:'combo',displayField : 'text',valueField : 'text',mode : 'local', emptyText : '选择状态',
                    store:new Ext.data.SimpleStore({
                        fields : ['text'],
                        data : [['开发中'], ['未审核'], ['已发布'], ['已下架'], ['已删除']]
                    })},
                    {id:"app_key",name:"app_key",fieldLabel:"app_key",xtype:'textfield'},
                    {id:"app_secret",name:"app_secret",fieldLabel:"app_secret",maxLength:"45",xtype:'textfield'},
                    {id:"app_server",name:"app_server",fieldLabel:"应用服务地址",maxLength:"45",xtype:'textfield'},
                    {id:"app_logo",name:"app_logo",fieldLabel:"app_logo",xtype:"hidden"},
                    {
                        margin:'10px 0 0 7px',
                        height:150,
                        html:"<label class=\"upload_file_name\"><font color='red'>&nbsp;</font> 上传文件<span role=\"separator\">:</span></label>" +
                        "<li class=\"cover-cls\"> <button class=\"upload-btn\" id=\"upload_file\">上传图片</button>" +
                        "<div class=\"cover-img\" id=\"cover-img_1\"><form><div class=\"files\"><div class=\"upload-selecter\"></div>" +
                        "<input type=\"file\" name=\"upload-file\" class=\"upload-file\"></div></form>" +
                        "<span class=\"upload-msg\">[建议尺寸:(134*69)，大小:不超过(5M)]</span></li>"
                    },
                    {id:"app_price_json",name:"app_price_json",fieldLabel:"价格体系",xtype:'textarea', maxLength:"200",height:60,width:610,allowBlank:true},
                    {id:"app_brief",name:"app_brief",fieldLabel:"应用简介",xtype:'textarea', maxLength:"200",height:60,width:610,allowBlank:true},
                    {id:"app_modules",name:"app_modules",fieldLabel:"菜单配置",xtype:'textarea', maxLength:"500",height:120,width:610,allowBlank:true}
                ]
            }
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
                    url: $__app__+'/Application/del',
                    params: {app_id:row.data.app_id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info.msg);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }else{
                myMask.hide();
            }
        })
    }

    function admin(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要设置管理员的用户信息！');
            return false;
        }
        var app_id = ret.data.app_id;
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Application/audit',
            params: {app_id:app_id},
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    store.reload();
                    winPanel.hide();
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
                    $('input[name=app_logo]').val(r.data.url);
                }, function (r) {
                    Ext.Msg.alert('友情提示', r.msg);
                }
            );
        }
    };


    var winPanel = Ext.create('Ext.window.Window', {
        closeAction:'hide',
        autoHeight:true,
        width: 650,
        title:"应用审核",
        modal:true,
        items: [form],
        buttons:[
            {text:'审核',iconCls:'button-pass',handler:function(){
                admin();
            }},
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
        if (!form.isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Application/save',
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
        var value=ROW.values.app_role;
        form.getForm().reset();
        form.getForm().setValues(ROW.values);
        uploads.construction(ROW.values.app_logo);
        groupCheckboxSet(value);


    });
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });

    /**
     * 设置checkbox初始值
     * @param value
     */
    function groupCheckboxSet(value){
        var va = value.split(',');
        var checkBoxGroup=Ext.getCmp('checkboxgroup').items;
        for(var i = 0; i < checkBoxGroup.length; i++){
            var inputValue=checkBoxGroup.get(i).inputValue;
            if(inArray(inputValue,va)){
                checkBoxGroup.get(i).setValue(true);
            }
        }
    }

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'Application', table:'Application', pk_id:'app_id'}] });


})