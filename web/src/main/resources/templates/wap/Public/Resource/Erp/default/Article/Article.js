/**
 * Created by Administrator on 15-12-16.
 */
var ROW = {};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    if(_uinfo.us_orgid){
        ROW.u_org_id = _uinfo.us_orgid;
    }
    var url=$__app__+'/Article/dataJson';
    var field=[];
    var store=SUNLINE.GroupingStore(url,field,{ groupField:'ar_area_name' },true);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ' {name}: (共 {[values.rows.length]} 条)',
        startCollapsed:false
    });
    var cm=[
        {header:"ID",dataIndex:"ar_id",hidden:true },
        {header:"排序", width:80 ,align:"right",dataIndex:"ar_or_id",editor:"numberfield"},
        {header:"标题", dataIndex:"ar_title", width:150},
        {header:"查看范围", dataIndex:"ar_area", width:150,renderer:function(v,n,r){
            var workName = '';
            switch(r.data.ar_area_id){
                case '1':
                    workName = '(所有可见)';
                    break;
                case '2':
                    workName = '(指定单位)';
                    break;
                case '3':
                    workName = '(指定部门)';
                    break;
                /*case '4':
                    workName = '(指定用户)';
                    break;*/
                default:
                    break;
            }
            return workName = r.data.ar_area_name+workName;
        }},
        {header:"关键字", dataIndex:"ar_keyword", width:150},
        {header:"状态", dataIndex:"ar_status", width:120,renderer:status_str},
        {header:"推荐", dataIndex:"ar_recom", width:120,renderer:recom_str},
        {header:"添加时间",dataIndex:"ar_creatTime", width:150,renderer:function(val){
               var date=new Date(parseInt(val)*1000);
               return Ext.Date.format(date,'Y-m-d H:i:s');
            }
        },
        {header:"修改时间",dataIndex:"ar_updateTime",width:150,renderer:function(val){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d H:i:s');
            }
        }
    ]

    function status_str(v){
        switch(v){
            case 'ok':
                return '已发布';
                break;
            case 'lock':
                return '已隐藏';
                break;
            case 'del':
                return '已删除';
                break;
            default:
                break;
        }
    }

    function recom_str(v){
        switch(v){
            case 'ok':
                return '已推荐';
                break;
            case 'del':
            default:
                return '未推荐';
                break;
        }
    }

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        features: [groupfeatures],
        columns:cm,
        store:store,
        fixed:true,
        forceFit: true,
        viewConfig:{emptyText:'没有符合你要查找的内容，请试试输入公告的标题哦╮(╯_╰)╭'},
        tbar:[
            '<span style = "color:#009DDA;font-size: 15px;font-weight: bolder">公告列表</span>',
            {text:'添加',iconCls:'button-add',handler:modify,disabled:isDisabled('Article::save')},
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Article::save')},
            {text:'查看',iconCls:'button-sch',handler:lookup,disabled:isDisabled('Article::lookUp')},
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Article::del')},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.load();
            }},
            {text:'加入推荐',iconCls:'button-dropyes',handler:recom,id:"re-Recom",disabled:isDisabled('Article::recom')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'ar_Search',
                iconCls:'button-sch',
                emptyText : '公告标题,或关键字',
                width:150,
                onTriggerClick:function(e){
                    ArtSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            ArtSearch();
                    }
                }
            }
        ],
        plugins:{
            ptype:'cellediting',
            clicksToEdit:1,
            listeners:{
                edit:function(v,g){
                    var data = SUNLINE.getSelected(g.grid).data;
                    var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                    myMask.show();
                    Ext.Ajax.request({
                        url: $__app__+'/Article/save',
                        params: data,
                        method:'post',
                        success: function(response){
                            var r = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', r.info.msg);
                            if(r.status){
                                // panel.hide();
                                store.load();
                            }
                            myMask.hide();
                        }
                    })
                }
            }
        },
        listeners:{
            cellclick:function(v,g,n,r){
                var ar_recom = r.data.ar_recom;
                switch(ar_recom){
                    case 'ok':
                        Ext.getCmp('re-Recom').setText("取消推荐");
                        Ext.getCmp('re-Recom').setIconCls("button-del");
                        break;
                    case 'del':
                    default :
                        Ext.getCmp('re-Recom').setText("加入推荐");
                        Ext.getCmp('re-Recom').setIconCls("button-dropyes");
                        break;
                }
            }
        },
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    })

    function ArtSearch(){
        var skey=Ext.getCmp('ar_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
    }
    var orgCom = SUNLINE.ComBoxPlus({
        url:$__app__+'/Company/dataJson',
        fields:['org_id','org_name'],
        config:{
            id:'ar_area_cmpy',
            name: 'ar_area_cmpy',
            fieldLabel:'选择单位',
            labelWidth:60,
            labelAlign:'right',
            width:620,
            displayField: 'org_name',
            valueField: 'org_name',
            hidden:true,
            loadingText:'正在加载单位信息'
        }
    })
    var WgCom=SUNLINE.ComBoxPlus({
        url:$__app__+'/Workgroup/dataJson',
        fields:['wg_id','wg_name'],
        where:{wg_org_id:ROW.u_org_id},
        config:{
            id:'ar_area_work',
            name:'ar_area_work',
            fieldLabel:'选择部门',
            labelWidth:60,
            labelAlign:'right',
            width:620,
            displayField:'wg_name',
            valueField:'wg_name',
            hidden:true,
            loadingText:'正在加载当前部门信息'
        }

    });
    var UseCom=SUNLINE.ComBoxPlus({
        url:$__app__+'/Users/dataJson',
        fields:['u_id','u_name'],
        config:{
            id:'ar_area_user',
            name:'ar_area_user',
            fieldLabel:'选择用户',
            labelWidth:60,
            labelAlign:'right',
            width:620,
            displayField:'u_name',
            valueField:'u_name',
            hidden:true
        }
    });

    var cate_store=Ext.create('Ext.data.Store', {
        fields: ['ar_cate_id', 'ar_cate_name'],
        data : [
            {"ar_cate_id":"1", "ar_cate_name":"公告"},
            {"ar_cate_id":"2", "ar_cate_name":"资讯"}
        ]
    });


    var CateCom=Ext.create('Ext.form.ComboBox', {
        id:"ar_cate_name",
        name:"ar_cate_name",
        fieldLabel: '资讯类别',
        labelWidth:60,
        store: cate_store,
        queryMode: 'local',
        emptyText : '请选择',
        align:'left',
        displayField: 'ar_cate_name',
        valueField: 'ar_cate_name',
        editable:false,
        triggerAction:"all",
        forceSelection:true,
        typeAhead:true
    });

    var form=Ext.create('Ext.form.Panel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        defaults:{
            defaults:{
                allowBlank:false,
                labelWidth:60,
                width:850,
                labelAlign:'right',
                xtype:'textfield'
            }
        },
        items:[
            {
                cls:'tcol2',
                items:[
                    {id:"ar_id",name:"ar_id",hidden:true,allowBlank:true},
                    {id:"ar_title", name:"ar_title", fieldLabel:"文章标题", maxLength:"20"},
                    {id:"ar_img", name:"ar_img", fieldLabel:"缩图", maxLength:"50",hidden:true},
                    CateCom,
                    //{id:"ar_status", name:"ar_status", fieldLabel:"状态", vtype:'alphanum', maxLength:"20"},
                    {
                        id:"ar_status",
                        name:"ar_status",
                        fieldLabel:"状态",
                        //vtype:'alphanum',
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['ar_status','ar_status_val'],
                            data:[
                                ['ok','发布'],
                                ['lock','隐藏']
                            ]
                        }),
                        displayField:"ar_status_val",
                        valueField:"ar_status",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:"ok"
                    },
                    {
                        id:"ar_area",
                        name:'ar_area',
                        fieldLabel:"查阅范围",
                        xtype:'radiogroup',
                        columnWidth:80,
                        width:620,
                        items:[
                            { boxLabel: '系统公告',id:'ar_area_1', name: 'ar_area', inputValue: '1',checked:true},
                            { boxLabel: '指定单位',id:'ar_area_2', name: 'ar_area', inputValue: '2'},
                            { boxLabel: '指定部门', id:'ar_area_3',name: 'ar_area', inputValue: '3' }
                            /*{ boxLabel: '指定用户', id:'ar_area_4',name: 'ar_area', inputValue: '4' }*/
                        ],
                        listeners :{
                            'change':function(){
                                change_area();
                            }
                        }
                    },
                    orgCom,
                    WgCom,
                    UseCom,
                    {
                        id:"ar_keyword",
                        name:"ar_keyword",
                        fieldLabel:"关键词",
                        /*vtype:'alphanum',*/
                        maxLength:"20",
                        width:620,
                        emptyText:'后缀：攻略,游记,住宿,美食,购物,特产,交通,行程,景点等（多个使用‘,’隔开）'
                    }
                ]
            },
            {
                height:200,
                html:"<li class=\"cover-cls\"> <button class=\"upload-btn\" id=\"upload_file\">上传封面</button>" +
                "<div class=\"cover-img\"><form><div class=\"files\"><div class=\"upload-selecter\"></div>" +
                "<input type=\"file\" name=\"upload-file\" class=\"upload-file\"></div></form>" +
                "</div><input type=\"hidden\" name=\"p_cover\" class=\"form-id\">" +
                "<span class=\"upload-msg\">[建议尺寸:最小(550*350)，一般(715*455)，大小:不超过(5M)]</span></li>"
            },
            {
                height:470,
                width:850,
                html:'<textarea name="he_content" id="he_content"></textarea>'
            }
        ]
    });

    function change_area(){
        var obj = Ext.getCmp("ar_area").items.items;
        for(var i in obj){
            if(obj[i].checked){
                var rad_val = obj[i].inputValue;
                var cmpy = Ext.getCmp("ar_area_cmpy");
                var work = Ext.getCmp("ar_area_work");
                /*var user = Ext.getCmp("ar_area_user");*/
                switch(rad_val){
                    case '1':
                        cmpy.hide();
                        work.hide();
                        /*user.hide();*/
                        break;
                    case '2':
                        cmpy.show();
                        work.hide();
                        /*user.hide();*/
                        break;
                    case '3':
                        cmpy.hide();
                        work.show();
                        /*user.hide();*/
                        break;
                    /*case '4':
                        cmpy.hide();
                        work.hide();
                        user.show();
                        break;*/
                    default :
                        break;
                }
            }
        }
    }
    var panel_width=900;
    var panel = Ext.create('Ext.panel.Panel', {
        width: panel_width,
        bodyBorder:true,
        floating: true,
        scrollable:true,
        bodyStyle:'overflow-x:hidden;overflow-y:scroll',
        modal:true,
        items:[form],
        tbar:[
            '<span id = "artTitle" style="color:#009DDA;font-size: 16px;font-weight: bolder">公告管理</span>',
            '->',
            {text:'保存',iconCls:'button-save',handler:save},
            {text:'关闭',iconCls:'button-del',handler:function(){
                panel.hide();
            }}
        ]
    });
    panel.on('show',function(){
        this.setHeight(grid.getHeight());
        this.setPosition(grid.getWidth()-panel_width,0);
        form.getForm().reset();
        form.getForm().setValues(ROW.values);
        $('input[name=p_cover]').val(ROW.values.ar_img);
        Ext.getCmp('ar_img').setValue(ROW.values.ar_img);
        uploads.construction(ROW.values.ar_img);
        if(ROW.values.ar_area_id){
            var num = ROW.values.ar_area_id;
            Ext.getCmp("ar_area_"+num).setValue(true);
            //Ext.getCmp("ar_status").setValue(status);
            var name = ROW.values.ar_area_name;
            switch(num){
                case '1':
                    break;
                case '2':
                    Ext.getCmp("ar_area_cmpy").setValue(name);
                    break;
                case '3':
                    Ext.getCmp("ar_area_work").setValue(name);
                    break;
                /*case '4':
                    Ext.getCmp("ar_area_user").setValue(name);
                    break;*/
                default:
                    break;
            }
        }


    });

    var panel_see = new Ext.Window({
        title : '公告查看',
        width : 800,
        height : 450,
        bodyBorder : true,
        modal : true,
        maximizable: true,
        closeAction : 'hide',
        maximized : true,
        html : '<iframe id="artIfr" name="artIfr" src=""  width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>',
        buttons : [
            /*'<span style="color:#009DDA;font-size: 16px;font-weight: bolder">公告信息</span>',
            '->',*/
            {text:'关闭',iconCls:'button-del',handler:function(){ panel_see.hide(); }}
        ]
    });


    panel_see.on('show',function(){
        /*this.setHeight(grid.getHeight());
        this.setPosition(grid.getWidth()-panel_width,0);
        //window.artIfr.location='https://www.baidu.com';*/
        var iframe_innerhtml = "<div><h3 style = 'text-align: center'>"+ROW.values.ar_title+"</h3>" +ROW.values.ar_content+"</div>";
        document.getElementById("artIfr").contentWindow.document.body.innerHTML = iframe_innerhtml;
    });


    function lookup(){
        var ret=SUNLINE.getSelected(grid);
        if(!ret) return ExtAlert('请选择你要查看的公告信息！');
        ROW.values=ret.data;
        panel_see.show();

    };


    function modify(b){
        if(b.text=='添加'){
            ROW.values={};
            panel.show();
            editorData();
            document.getElementById('artTitle').innerHTML = "添加公告";
        }else{
            var ret=SUNLINE.getSelected(grid);
            if(ret==null){
                Ext.Msg.alert('友情提示','请选择你要编辑的公告信息！');
                return false;
            }
            ROW.values=ret.data;
            panel.show();
            editorData(ret.data.ar_content);
            document.getElementById('artTitle').innerHTML = "公告管理";
        }

    };


    function del(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要删除的公告信息！');
            return false;
        }
        var delVal = ret.data.ar_status;
        if(delVal == 'del'){
            Ext.Msg.alert('友情提示','该公告信息已删除！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Article/del',
                    params: {ar_id:ret.data.ar_id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })
    }
    function recom(v){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要'+ v.text+'的公告信息！');
            return false;
        }
        var recomVal = ret.data.ar_recom;
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要'+ v.text+'该公告？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Article/recom',
                    params: {ar_id:ret.data.ar_id,ar_recom:recomVal},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })

    }


    function editorData(content,reset){
        var reset = reset ? false : true;
        var editor_data={
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars:[[
                'Source', 'Undo', 'Redo','Bold','test',
                'forecolor','backcolor','removeformat',
                'fontsize','fontfamily','underline','strikethrough','|',
                'justify','justifyleft', 'justifycenter', 'justifyright','|',
                'imageleft', 'imageright', 'imagecenter','indent','|',
                'simpleupload','insertvideo','attachment','link', 'unlink','emotion'
            ]],
            //focus时自动清空初始化时的内容
            autoClearinitialContent:false,
            //关闭字数统计
            wordCount:false,
            //出现滚动条
            autoHeightEnabled:false,
            //关闭elementPath
            elementPathEnabled:false,
            //默认的编辑区域高度
            initialFrameHeight:420,
            zIndex:999999,
            initialStyle:'p{font-size: 12px;}'
        };
        var editor = UE.getEditor('he_content',editor_data);
        if(reset === true) {
            if (content) {
                editor.addListener("ready", function () {
                    editor.setContent(content);
                });
                editor.setContent(content);
            } else {
                editor.setContent('');
            }
        }
        return editor;
    }

    function save(){
        var iform = form.getForm();
        var v=iform.getValues();
        if(!form.getForm().isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }

        v.ar_content = editorData('',true).getContent();
        if(v.ar_content == ''){
            Ext.Msg.alert('友情提示','亲，你是不是忘记填写公告了!');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Article/save',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info.msg);
                if(r.status){
                    panel.hide();
                    store.reload();
                    editorData().setContent('');
                }
                myMask.hide();
            }
        })
    }
    $(window).resize(function(){
        panel.setPosition(document.body.scrollWidth-panel_width,0)
        panel.setHeight(document.body.scrollHeight)
    });
    var uploads={
        construction:function(pid)
        {
            this.uploadify();
        },
        uploadify:function(){
            var p_cover=$('input[name=p_cover]').val();
            $('.cover-img').uploadFile({
                    url:$__app__ + '/Upload/ajax_upload',
                    verify:{ size:5000,type:['jpg','JPG','gif','PNG','png','GIF']},
                    multiple:false,
                    select_id:'.upload-btn',
                    process:'?x-oss-process=image/resize,m_mfit,h_230,w_330',
                    load_msg:'正在努力上传中，请稍等...',
                    default_url:p_cover,
                    data:{
                        table_model:'产品',
                        table_id:3045
                    }
                },function(r,data){
                    $('input[name=p_cover]').val(r.data.url);
                    Ext.getCmp('ar_img').setValue(r.data.url);
                },function(r){
                    Ext.Msg.alert('友情提示', r.msg);
                }
            );
        }
    }
    ziyo_log({ listeners : [{grid: grid, action:'Article', pk_id:'ar_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})