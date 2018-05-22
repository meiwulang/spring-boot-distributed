var ROW = {};
GUIDE_WORK = {};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    window.org_id = top._uinfo.u_jgid;
    var thisTitle = '单位审核管理';
    var url = $__app__ + '/Company/auditJson';
    var field = [
        {name:"org_id"},
        {name:"org_name"},
        {name:"org_zt"},
        {name:"org_legal"},
        {name:"org_mob"},
        {name:"org_certificate"},
        {name:"org_type"},
        {name:"org_release"},
        {name:"org_addtime"},
        {name:"org_card"},
        {name:"org_card_pic"},
        {name:"org_tax"},
        {name:"org_tax_pic"},
        {name:"org_charter"},
        {name:"org_charter_pic"},
        {name:"org_certificate_pic"},
        {name:"org_status"}
    ];
    var store = new SUNLINE.JsonStore(url, field);
    store.baseParams = { start:0, limit:pageSize };

    function org_status(v){
        if(v=="待审核"){
            v="<font color=red><b>"+v+"</b></font>";
        }
        return v;
    }

    function org_genre(v){
        /*var com_type=_sunline_.company_type,len=com_type.length,vl;
        for(var i=0;i<len;i++){
            if(com_type[i][0]==v){ return com_type[i][1]; }
        }*/
        return v;
    }

    function p_type(v){
        var s_arr=v.split(",");
        var type=[[10,"周边短线"],[11,"国内长线"],[20,"出境旅游"],[30,"邮轮"]],len=type.length,va;
        for(var i=0;i<len;i++){
            if($.inArray(String(type[i][0]),s_arr)>=0){
                if(va){ va +=","+type[i][1]; }else{ va =type[i][1]; }
            }
        }
        if(!va && !v){
            va="没有类型";
        }else if(v && !va){
            va=v;
        }
        return va
    }
    var tourguide_cm = [
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"org_id", width:150, hidden:true},
        {header:"单位名称", dataIndex:"org_name", width:200},
        {header:"法人代表", dataIndex:"org_legal", width:100},
        {header:"手机号码", dataIndex:"org_mob", width:120},
        {header:"公司类型", dataIndex:"org_type", width:100,renderer:org_genre},
        {header:"发布产品类型", dataIndex:"org_release", width:100,hidden:true},
        {header:"状态", dataIndex:"org_zt", width:80,hidden:true},
        {header:"审核状态", dataIndex:"org_status", width:80,renderer:org_status},
        {header:"身份证", dataIndex:"org_card", width:140},
        {header:"身份证照片", dataIndex:"org_card_pic", width:140,hidden:true},
        {header:"许可证", dataIndex:"org_certificate", width:200,hidden:true},
        {header:"经营许可证照片", dataIndex:"org_certificate_pic", width:180,hidden:true},
        {header:"税务登记证", dataIndex:"org_tax", width:140,hidden:true},
        {header:"税务登记证照片", dataIndex:"org_tax_pic", width:140,hidden:true},
        {header:"营业执照", dataIndex:"org_charter", width:150,hidden:true},
        {header:"营业执照照片", dataIndex:"org_charter_pic", width:100,hidden:true},
        {header:"注册时间", dataIndex:"org_addtime", width:150}
    ];

    var org_detail = new Ext.Panel({
        border : false,
        region:'east',
        width:500,
        autoScroll : true,
        style : 'border-left:1px solid #d0d0d0;border-top:1px solid #ccc;',
        html : '<div style="padding: 10px;">请点击左则列表信息!</div>'
    });

    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style : 'border-top:1px solid #ccc;',
        columns:tourguide_cm,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有单位信息',
            deferEmptyText:true
        }
    });

    var org_panel = new Ext.Panel({
        layout : 'border',
        region : 'center',
        border : false,
        tbar:[
            {text:'审核', iconCls:'button-edit',handler:org_audit,disabled:isDisabled('Company::audit')},
            '-',
            {text:'退回', iconCls:'button-edit',handler:org_audit,disabled:isDisabled('Company::audit')},
            '-',
            {text:'删除', iconCls:'button-del', handler:dodelete,disabled:isDisabled('Company::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                store.load();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                emptyText:'公司名称、法人姓名、手机号',
                width:260,
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
            '-',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function () {
                    parent.CloseTab();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有单位信息'
        }),
        items : [grid, org_detail]
    });

    var _detail_body = null;
    grid.getSelectionModel().on('select', function(sm, r){
        var data = r.data;
        if (!_detail_body){
            var bd = org_detail.body;
            bd.update('').setStyle('background','#E8E8E8');
            _detail_body = bd.createChild();
        }
        data.org_type_news=org_genre(data.org_type);
        data.org_release_news=p_type(data.org_release);
        var html = _org_tpl.apply(data);
        _detail_body.hide().update(html).slideIn('l', {stopFx:true,duration:.5});
        org_detail.body.highlight('#c3daf9', {block:true});
    });

    var _org_tpl = new Ext.XTemplate(
        '<div style="padding: 10px;">'+
        '<div><label>公司名称：</label>{org_name}</div>' +
        '<div><label>法人姓名：</label>{org_legal}</div>' +
        '<div><label>手机号：</label>{org_mob}</div>' +
        '<div><label>公司类型：</label>{org_type_news}</div>' +
        '<div><label>发布产品类型：</label>{org_release_news}</div>' +
        '<div><label style="font-weight: bold;">身份证号：</label><font color=red><b>{org_card}</b></font></div>' +
            '<div><a href="{org_card_front}" target="_blank"><img src="{org_card_front}?x-oss-process=image/resize,m_mfit,w_460" width=99%></a> </div>' +
            '<br /><div><a href="{org_card_front}" target="_blank"><img src="{org_card_back}?x-oss-process=image/resize,m_mfit,w_460" width=99%></a> </div>' +
            '<br /><div><label style="font-weight: bold;">营业执照：</label><font color=red><b>{org_licence_code}</b></font></div>' +
            '<div><a href="{org_card_front}" target="_blank"><img src="{org_licence}?x-oss-process=image/resize,m_mfit,w_460" width=99%></a> </div>' +
        '</div>'
    );

    new Ext.Viewport({
        layout:'border',
        items:[org_panel]
    });


    /************** 自助注册退回state *****************/
    var form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260 },
                items:[
                    {id:"org_name", name:"org_name", fieldLabel:"单位名称",style:"background:#efefef", readOnly:true},
                    {id:"org_id", name:"org_id", fieldLabel:"单位ID",xtype:"hidden"},
                    {id:"org_status", name:"org_status", fieldLabel:"当前状态", maxLength:"20",style:"background:#efefef",readOnly:true}
                ]
            },{
                columnWidth:1,
                items:[{id:"org_info", name:"org_info", fieldLabel:"退回原因", maxLength:"500", xtype:'textarea',width:"260"}]
            }
        ]
    });

    var win = new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        title:"单位注册退回原因",
        modal:true,
        items:form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });
    win.on('show', function (w) {
        var f = form.getForm();
        f.reset();
        f.setValues(ROW.data);
    });
    /************** 自助注册退回end *****************/
    var pro_type_publish = SUNLINE.productType({
        id:'org_release',name:'release',fieldLabel:"产品类型",columns:3
    });
    /************** 自助注册审核通过state *****************/
    var pass_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults :{
            xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'
        },
        items:[
            {id:"org_name_1", name:"org_name", fieldLabel:"单位名称",readOnly:true,width:360},
            {id:"org_sname_1", name:"org_sname", fieldLabel:"单位简称",readOnly:true,width:360},
            {id:"org_id_1", name:"org_id", fieldLabel:"单位ID",xtype:"hidden"},
            {id:"org_mob_1", name:"org_mob",xtype:"hidden"},
            {id:"org_legal_1", name:"org_legal",xtype:"hidden"},
            {id:"org_status_1", name:"org_status", fieldLabel:"当前状态", maxLength:"20",readOnly:true,width:360},
            {id:"org_type_1", name:"org_type", fieldLabel:"单位类型", maxLength:"20",readOnly:true,width:360},
            pro_type_publish,
            {id:"org_licence_code_1", name:"org_licence_code", fieldLabel:"营业执照",width:360},
            {id:"org_bh_1", name:"org_bh", fieldLabel:"单位编号", maxLength:"20",width:360}
        ]
    });

    var pass_win = new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        title:"单位注册审核信息补全",
        modal:true,
        items:pass_form,
        buttons:[
            {text:'确定审核', handler:callBack},
            {text:'关闭', handler:function () {
                pass_win.hide();
            }}
        ]
    });
    pass_win.on('show', function (w) {
        var pass_f = pass_form.getForm();
        pass_f.reset();
        var win_post=ROW.data;
        pass_f.setValues(ROW.data);
        SUNLINE.productTypeSetValues(pro_type_publish,win_post.org_release );
        if(win_post.org_type=='分销商'){
            pro_type_publish.setHidden(true);
        }else{
            pro_type_publish.setHidden(false);
        }
    });
    /************** 自助注册审核通过end *****************/


    window.sarea_val_fn=function(e){
        return Ext.getCmp(e).getValue();
    };
    /*选择投放城市(end)*/



    function org_audit(b) {
        var row=SUNLINE.getSelected(grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择需要'+ b.text+'的单位信息!');
            return;
        };
        var r = row.data;
        if(r.org_status=="退回"){
            Ext.Msg.alert('友情提示', '你选择的单位信息已经是退回状态了，不可以再'+ b.text+'了');
            return;
        }
        if (b.text == "审核") {
            ROW.data=row.data;
            pass_win.show();
        };
        if(b.text == "退回"){
            ROW.data=row.data;
            win.show();
        }
    }

    function callBack() {
        var dd = pass_form.getForm().getValues();
        dd.org_status="通过";
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Company/auditSave',
            params:dd,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status == 1) {
                    store.load();
                    pass_win.hide();
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }



    function dosave() {
        if (!form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var s = form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/Company/auditReturn',
            params:s,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    store.load();
                    win.hide();
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };

    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        store['baseParams'] = {skey:skey};
        store.load({params:{start:0, limit:pageSize}});
    };

    function dodelete() {
        var row=SUNLINE.getSelected(grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要删除的单位信息');
            return;
        };
        Ext.MessageBox.confirm('友情提示', '确定删除单位信息吗？<br />这里删除了，信息将会彻底删除掉，请慎用！', callBack);
        function callBack(id) {
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var s = row.data;
                Ext.Ajax.request({
                    url:$__app__ + '/Company/auditDel',
                    params:{org_id:s.org_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            grid.store.remove(SUNLINE.getSelected(grid));
                        }
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        }
    };

});
