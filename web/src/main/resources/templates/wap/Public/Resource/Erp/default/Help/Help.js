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
    var url=$__app__+'/Help/dataJson';
    var html_url = 'http://help.jdytrip.cn/detail.html';
    var field=[];
    var store=SUNLINE.GroupingStore(url,field,{ groupField:'he_type' },true);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['', '{columnName}: {name:this.formatName} (共 {[values.rows.length]} 条)', {
            formatName: function (v) {
                var group_field = store.getConfig('groupField');
                switch (group_field) {
                    case 'he_type':
                        return (v == 1) ? '视频' : '文章';
                }
            }
        }],
        startCollapsed:false
    })
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID",dataIndex:"he_id",hidden:true },
        {header:"排序", width:80 ,dataIndex:"he_or_id",editor:"numberfield"},
        {header:"标题", dataIndex:"he_title", width:150},
        {header:"查看范围", dataIndex:"he_area_name", width:150},
        {header:"类型", dataIndex:"he_type", width:150,renderer:function(v,n,r){
            switch (r.data.he_type){
                case '1':
                    return '视频';
                    break;
                case '0':
                    return '文章';
                    break;
                default:
                    break;
            }
        }},
        {header:"关键字", dataIndex:"he_keyword", width:150},
        {header:"状态", dataIndex:"he_status", width:120,renderer:status_str},
        {header:"推荐", dataIndex:"he_recom", width:120,renderer:recom_str},
        {header:"添加时间",dataIndex:"he_time", width:150,renderer:function(val){
               var date=new Date(parseInt(val)*1000);
               return Ext.Date.format(date,'Y-m-d H:i:s');
            }
        },
        {header:"修改时间",dataIndex:"he_updateTime",width:150,renderer:function(val){
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
        viewConfig:{emptyText:'没有符合你要查找的内容，请试试输入文档的标题哦╮(╯_╰)╭'},
        forceFit: true, //列宽自适应
        tbar:[
            '<span style = "color:#009DDA;font-size: 15px;font-weight: bolder">文档列表</span>',
            {text:'添加',iconCls:'button-add',id:'word-btn-add',handler:modify,disabled:isDisabled('Help::save')},
            {text:'编辑',iconCls:'button-edit',handler:modify,disabled:isDisabled('Help::save')},
            {text:'查看',iconCls:'button-sch',handler:lookup,disabled:isDisabled('Help::lookUp')},
            {text:'删除',iconCls:'button-del',handler:del,disabled:isDisabled('Help::del')},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.load();
            }},
            {text:'加入推荐',iconCls:'button-dropyes',handler:recom,id:"re-Recom",disabled:isDisabled('Help::recom')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'he_Search',
                iconCls:'button-sch',
                emptyText : '文档标题,或关键字',
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
                        url: $__app__+'/Help/save',
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
                var he_recom = r.data.he_recom;
                switch(he_recom){
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
            },
            itemdblclick:function(){
                var ret=SUNLINE.getSelected(grid);
                ROW.values=ret.data;
                panel.show();
                editorData(ret.data.he_content);
                document.getElementById('artTitle').innerHTML = "文档管理";
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

    var comment_form = Ext.create('Ext.form.Panel',{
        bodyStyle:"padding:20px",
        defaults:{
            allowBlank:true,
            labelWidth:60,
            width:445,
            labelAlign:'right',
            xtype:'textareafield'
        },
        frame : false,
        url: 'demo.php',
        items : [
            {fieldLabel : '评论ID',name:'hm_id',xtype:'hiddenfield'},
            {fieldLabel : '评论内容',name:'hm_comment',readOnly: true},
            {fieldLabel : '回复内容',name:'hm_relay',height:100,emptyText:'请输入回复内容'},
        ],
        buttons:[
            {text:'回复', handler:replaySubmit},
            {text:'关闭', handler:function(){comment_win.hide();}}
        ]
    })
    var comment_win = Ext.create('Ext.window.Window', {
        title: '评论回复框',
        height: 300,
        width: 500,
        layout: 'fit',
        closeAction:'hide',
        modal:true,
        items: comment_form
    });
    var comment_url = $__app__ + '/Help/commentDataJson';
    var comment_field = [];
    var comment_store = new SUNLINE.JsonStore(comment_url, comment_field,false);
    var grid_comment=new Ext.grid.GridPanel({
        collapsed:true,
        collapsible:true,
        title:'文档评论',
        region : 'south',
        height: 350,
        columns:comment_field,
        fixed:true,
        store : comment_store,
        style:'border-top:3px solid #009DDA;',
        forceFit: true, //列宽自适应
        viewConfig:{
            emptyText:'没有评论信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'回复',iconCls:'button-edit',handler:function(){
                var selected_row = SUNLINE.getSelected(grid_comment);
                if(!selected_row){
                    Ext.Msg.alert('友情提示','请选择要回复的评论！');
                    return false;
                }
                replayWin();
            }},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                comment_store.load();
            }},
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"评论ID", dataIndex:"hm_id", hidden:true},
            {header:"评论内容", dataIndex:"hm_comment",renderer:commentText},
            {header:"评论用户", dataIndex:"u_name"},
            {header:"评论时间", dataIndex:"hm_time"},
            {header:"最后回复时间", dataIndex:"hm_relay_time"},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:comment_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有评论信息'
        }),
        listeners:{itemdblclick:replayWin}
    });
    var grid_view = Ext.create('Ext.panel.Panel',{
        region : 'center',
        autoScroll: false,
        layout :'border',
        items:[grid,grid_comment]
    });

    grid.on('select',function(){
        var row=SUNLINE.getSelected(grid);
        SUNLINE.baseParams(comment_store,{hm_he_id:row.data.he_id});
        comment_store.currentPage=1;
        comment_store.load();
    })
    function commentText(v,m,r){
        var hm_relay_time = r.get('hm_relay_time');
        var text_name = '<span style="color: #fff;background-color:#FF0000;display:inline-block;padding:0 6px;border-radius:3px;margin:0 6px">未回复</span>' + v;
        if(hm_relay_time != '-'){
            var text_name = '<span style="color: #fff;background-color:#1E87EF;display:inline-block;padding:0 6px;border-radius:3px;margin:0 6px">已回复</span>' + v;
        }
        return text_name;
    }
    function replayWin(){
        var comment_row = SUNLINE.getSelected(grid_comment);
        comment_form.getForm().setValues(comment_row.data);
        comment_win.show();
    }
    function replaySubmit(){
        var comment_params = comment_form.getForm().getValues();
        if(!comment_params.hm_relay){
            Ext.Msg.alert('友情提示','请输入要回复的内容！');
            return false;
        }
        Ext.Ajax.request({
            url: $__app__+'/Help/commentRelpay',
            params: comment_params,
            success: function(r){
                var r = Ext.decode(r.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    comment_store.reload();
                }
            },
            error:function(r){
            }
        })
    }

    function ArtSearch(){
        var skey=Ext.getCmp('he_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
    }

    function upload(){
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
            },function(r){
                Ext.Msg.alert('友情提示', r.msg);
            }
        );
    }


    var form=Ext.create('Ext.form.Panel',{
        border:false,
        padding:15,
        bodyStyle:'background:none;',
        defaults:{
            defaults:{
                allowBlank:false,
                labelWidth:60,
                width:860,
                labelAlign:'right',
                xtype:'textfield'
            }
        },
        items:[
            {
                cls:'tcol2',
                items:[
                    {id:"he_id",name:"he_id",hidden:true,allowBlank:true},
                    {id:"he_title", name:"he_title", fieldLabel:"文档标题", maxLength:"50"},
                    {id:"he_img", name:"he_img", fieldLabel:"缩图", maxLength:"50",hidden:true},
                    {id:"he_cate_id", name:"he_cate_id",hidden:true},
                    {
                        fieldLabel: "文档类型",
                        xtype: 'radiogroup',
                        columnWidth: 20,
                        items: [
                            {boxLabel: '文章', id: 'he_type_1', name: 'he_type', inputValue: '0', checked: true},
                            {boxLabel: '视频', id: 'he_type_2', name: 'he_type', inputValue: '1'}
                        ],
                    },
                    {xtype:'checkboxgroup',name:'checkboxgroup',
                        id: 'checkboxgroup', fieldLabel: '使用范围',columnWidth:0.7,
                        items: [
                            { boxLabel: '全部', name: 'he_area_name[]', inputValue: '全部',handler:function(v,c){
                                var checkBoxGroup=Ext.getCmp('checkboxgroup').items;
                                var status=c?true:false;
                                for(var i = 1; i < checkBoxGroup.length; i++){
                                        checkBoxGroup.get(i).setDisabled(status);
                                }
                            }},
                            { boxLabel: '供应商', name: 'he_area_name[]', inputValue: '供应商' },
                            { boxLabel: '分销商', name: 'he_area_name[]', inputValue: '分销商' },
                            { boxLabel: '管理公司', name: 'he_area_name[]', inputValue: '管理公司' }
                        ]},
                    {id:"he_cate_name", name:"he_cate_name", fieldLabel:"类别名称", maxLength:"20",disabled:true},
                    {
                        id:"he_status",
                        name:"he_status",
                        fieldLabel:"文档状态",
                        //vtype:'alphanum',
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['he_status','he_status_val'],
                            data:[
                                ['ok','发布'],
                                ['lock','隐藏']
                            ]
                        }),
                        displayField:"he_status_val",
                        valueField:"he_status",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:"ok"
                    },
                    {
                        id:"he_keyword",
                        name:"he_keyword",
                        fieldLabel:"关键词",
                        /*vtype:'alphanum',*/
                        maxLength:"100",
                        width:620,
                        emptyText:'（多个使用‘,’隔开）'
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
                width:860,
                height:470,
                html:'<textarea name="he_content" id="he_content"></textarea>'
            }
        ]
    });


    function all_role(v){
        console.log(v);
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
            initialFrameHeight:430,
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
    var panel_width=920;
    var panel = Ext.create('Ext.panel.Panel', {
        width: panel_width,
        bodyBorder:true,
        floating: true,
        scrollable:true,
        bodyStyle:'overflow-x:hidden;overflow-y:scroll',
        modal:true,
        items:[form],
        tbar:[
            '<span id = "artTitle" style="color:#009DDA;font-size: 16px;font-weight: bolder">文档管理</span>',
            '->',
            {text:'保存',iconCls:'button-save',handler:save},
            {text:'关闭',iconCls:'button-del',handler:function(){
                panel.hide();
            }}
        ]
    });

    panel.on('show',function() {
        this.setHeight(grid_view.getHeight());
        this.setPosition(grid.getWidth() - 630, 0);
        form.getForm().reset();
        Ext.getCmp("he_cate_id").setValue(cate_id);
        Ext.getCmp("he_cate_name").setValue(cate_name);
        form.getForm().setValues(ROW.values);
        $('input[name=p_cover]').val(ROW.values.he_img);
        Ext.getCmp('he_img').setValue(ROW.values.he_img);
        uploads.construction(ROW.values.he_img);
        var value=ROW.values.he_area_name;
        if(value) {
            groupCheckboxSet(value);
        }else{
            groupCheckboxSet('全部');
        }
    });

    var panel_see = new Ext.Window({
        title : '文档查看',
        width : 800,
        height : 450,
        bodyBorder : true,
        modal : true,
        maximizable: true,
        closeAction : 'hide',
        maximized : true,
        html : '<iframe id="artIfr" name="artIfr" src=""  width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>',
        buttons : [
            /*'<span style="color:#009DDA;font-size: 16px;font-weight: bolder">文档信息</span>',
            '->',*/
            {text:'关闭',iconCls:'button-del',handler:function(){ panel_see.hide(); }}
        ]
    });


    panel_see.on('show',function(){
        var iframe_innerhtml = "<div><h3 style = 'text-align: center'>"+ROW.values.he_title+"</h3>" +ROW.values.he_content+"</div>";
        document.getElementById("artIfr").contentWindow.document.body.innerHTML = iframe_innerhtml;
    });


    function lookup(){
        var ret=SUNLINE.getSelected(grid);
        if(!ret) return ExtAlert('请选择你要查看的文档信息！');
        var data = ret.data;
        window.open(html_url+'?cid='+data.he_cate_id+'&&did='+data.he_id,'_blank');
    };


    function modify(b){
        if(b.text=='添加'){
            ROW.values={};
            if(!cate_id)
            {
                Ext.Msg.alert('友情提示','请选择你要发布信息的类别！');
                return false;
            }
            panel.show();
            editorData();
            document.getElementById('artTitle').innerHTML = "添加文档";
        }else{
            var ret=SUNLINE.getSelected(grid);
            if(ret==null){
                Ext.Msg.alert('友情提示','请选择你要编辑的文档信息！');
                return false;
            }
            ROW.values=ret.data;
            panel.show();
            editorData(ret.data.he_content);
            document.getElementById('artTitle').innerHTML = "编辑文档";
        }

    };


    function del(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要删除的文档信息！');
            return false;
        }
        var delVal = ret.data.he_status;
        if(delVal == 'del'){
            Ext.Msg.alert('友情提示','该文档信息已删除！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Help/del',
                    params: {he_id:ret.data.he_id},
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
            Ext.Msg.alert('友情提示','请选择你要'+ v.text+'的文档信息！');
            return false;
        }
        var recomVal = ret.data.he_recom;
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要'+ v.text+'该文档？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Help/recom',
                    params: {he_id:ret.data.he_id,he_recom:recomVal},
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

    function save(){
        var iform = form.getForm();
        var v=iform.getValues();
        v.he_content = editorData('',true).getContent();
        if(v.he_content == ''){
            Ext.Msg.alert('友情提示','亲，你是不是忘记填写文档了!');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Help/save',
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


    var ri_url=$__app__+'/HelpCates/getcatelist';
    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : ri_url
        },
        root: {
            expanded: true,
            text:'所有类别',
            children:'children'
        }
    });
    var cate_id=0;
    var cate_name='';
    var load_bool=true;
    var treeView = Ext.create('Ext.tree.Panel',{
        region:'west',
        minWidth : 280,
        maxWidth : 390,
        width:300,
        store: tree_store,
        bodyBorder:true,
        split : true,
        border:false,
        tbar:[
            {text:'添加',iconCls:'button-add',id:'add_btn',handler:function(){
                var row=treeView.getSelection();
                if(!row[0] || row[0].data.text=='所有类别'){
                    Ext.Msg.alert('友情提示', '请先选择模块!');
                    return;
                }
                formcate.getForm().setValues(row[0].data);
                win.setTitle('添加类别');
                formcate.setHtml('');
                win.show();
            }},
            {text:'编辑',iconCls:'button-edit',id:'edit_btn',handler:function(){
                var row=treeView.getSelection();
                if(!row[0] || row[0].data.text=='所有类别'){
                    Ext.Msg.alert('友情提示', '请选择需要编辑的分类!');
                    return;
                }
                var edit_row = {};
                edit_row.hc_id = row[0].data.id;
                edit_row.hc_cate_name = row[0].data.text;
                edit_row.hc_order = row[0].data.hc_order;
                formcate.getForm().setValues(edit_row);
                win.setTitle('编辑类别');
                win.show();
            }},
            {text:'删除',iconCls:'button-del',id:'del_btn',handler:function(){
                var row=treeView.getSelection();
                if(!row[0]){
                    Ext.Msg.alert('友情提示', '请选择要删除的类别!');
                    return;
                }
                Ext.MessageBox.confirm('友情提示', '是否确认删除该类别？', function(id){
                    if (id == 'yes') {
                        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                        myMask.show();
                        Ext.Ajax.request({
                            url:$__app__ + '/HelpCates/del',
                            params:{hc_id:row[0].data.id},
                            method:'POST',
                            success:function (response, otps) {
                                myMask.hide();
                                var ret = Ext.decode(response.responseText);
                                var info=ret.info;
                                Ext.Msg.alert('友情提示',info);
                                if (ret.status){
                                    tree_store.reload();
                                };
                            },
                            failure:function (response, otps) {
                                myMask.hide();
                                Ext.Msg.alert('友情提示', '操作失败！');
                            }
                        })
                    }
                })

            }},
            {text:'刷新',iconCls:'button-ref', handler:function(){
                if(load_bool){
                    load_bool=false;
                    tree_store.reload();
                    store.removeAll();
                }
            }}
        ],
        listeners : {
            select : function(t, r, i){
                Ext.getCmp('del_btn').setDisabled(!r.data.id);
                Ext.getCmp('word-btn-add').setDisabled((r.data.pid != 0) ? false : true); //直接r.data.pid判断无效
                cate_id=r.data.id;
                cate_name= r.data.text;
                Ext.getCmp('hc_parent_id').setValue(cate_id);
                if(!r.data.l_id && r.data.text!='所有类别'){
                    Ext.getCmp('add_btn').setDisabled(false);
                    Ext.getCmp('edit_btn').setDisabled(false);
                }else{
                    Ext.getCmp('add_btn').setDisabled(true);
                    Ext.getCmp('edit_btn').setDisabled(true);
                }
                var text=r.data.text;
                var id=r.data.id;

                    SUNLINE.baseParams(store,{cate_name:text,cate_id:id},false);
                    store.currentPage = 1;
                    store.load();

            }
        },
        rootVisible: true
    });

    treeView.on('afteritemexpand',function(){
        load_bool=true;
    });
    var formcate=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/HelpCates/add',
        layout: 'anchor',
        defaults: {
            labelWidth:70,
            width:355,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID', name: 'hc_id',hidden:true},
            {fieldLabel: '名称', name: 'hc_cate_name',allowBlank: false,id:'hc_cate_name'},
            {fieldLabel: '排序', name: 'hc_order',id:'hc_order',allowBlank: false,xtype:'numberfield'},
            {fieldLabel: '所属分组', name: 'hc_parent_id',id:'hc_parent_id',hidden:true},
        ],
        buttons: [{
            text: '提交',
            formBind: true,
            disabled: true,
            handler: function() {
                var formVal = this.up('form').getForm();
                if (formVal.isValid()) {
                    formVal.submit({
                        success: function(formVal, action) {
                            Ext.Msg.alert('成功提示', action.result.msg, function(){
                                var title=win.getTitle();
                                if(title=='添加类别' || title=='编辑类别'){
                                    tree_store.reload();
                                    formcate.getForm().reset();
                                }else{
                                    store.reload();
                                }
                                win.hide();
                            });
                        },
                        failure: function(formVal, action) {
                            Ext.Msg.alert('失败提示', action.result.msg);
                        }
                    });
                }
            }
        },{
            text: '重置',
            handler: function() {
                var title=win.getTitle();
                Ext.getCmp('hc_cate_name').setValue('');
                Ext.getCmp('hc_order').setValue('');
                if(title!='添加分组'){
                    setHtml();
                }
            }
        }]
    });
    var win=Ext.create('Ext.window.Window', {
        title:'添加分组',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [formcate]
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
                    Ext.getCmp('he_img').setValue(r.data.url);
                },function(r){
                    Ext.Msg.alert('友情提示', r.msg);
                }
            );
        }
    };

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


    ziyo_log({ listeners : [{grid: grid, action:'Help', pk_id:'he_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[grid_view,{
            region: 'west',
            collapsible: true,
            title: '文档类别',
            width: 280,
            scrollable:true,
            split: true,
            items:treeView
        }]
    })

})