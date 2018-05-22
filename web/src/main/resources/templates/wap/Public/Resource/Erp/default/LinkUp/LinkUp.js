/**
 * Created by Administrator on 15-12-7.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var thisTitle = '游客咨询';
    var url=$__app__+'/LinkUp/dataJson';
    var store=SUNLINE.JsonStore(url,[]);
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"lk_id", dataIndex:"lk_id", width:50, hidden:true},
        { text: '游客',  dataIndex: 'lk_tourist',width:120,renderer:renderTourist},
        { text: '分销用户',  dataIndex: 'lk_uname',width:120,renderer:renderUname },
        { text: '产品名称',  dataIndex: 'lk_p_name',width:350,renderer:renderLabel },
        { text: '咨询时间',  dataIndex: 'lk_create_time',width:350, renderer: renderDate },
        { text: '备注',  dataIndex: 'lk_remark',width:350}
    ];

    function renderDate(v,i,r){
        return timestamp2date(v);
    }

    function renderTourist(v,m,r){
        return v+'<br>'+r.get('lk_tourist_tel');
    }
    function renderUname(v,m,r){
        return v+'<br>'+r.get('lk_zname');
    }
    function renderLabel(v,m,r){
        var label = r.get('lk_label');
        var lb_txt = [];
        if (label) lb_txt = show_label(label);
        return '<a href="'+$__app__+'/detail.html?p_id='+r.get('lk_p_enid')+'" target="_blank" style="color:blue">【预览】</a>'+v+'<br>'+lb_txt.join('');
    }
    var hiderule;
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
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box_store.load();
    company_box.on('select',function(c,r){
        var search_text=Ext.getCmp('_Search').getValue();
        var row= r[0];
        var org_id = row.get('id');
        select_org_id = org_id;
        SUNLINE.baseParams(store,{skey:search_text,org_id:org_id});
        store.currentPage =1;
        store.load();
    });
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {text:'处理',iconCls:'button-edit',handler:function(){
                var row=SUNLINE.getSelected(grid);
                if(!row){
                    Ext.Msg.alert('友情提示', '请选择要处理的游客咨询!');
                    return;
                }
                win.setTitle('处理咨询');
                form.getForm().setValues(row.data);
                win.show();
            }},
            '-',
            {text:'标记为...', id:'label_btn' },
            '-',
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            company_box,
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'_Search',
                cls:'search-icon-cls',
                emptyText : '游客称呼等',
                width:150,
                onTriggerClick:function(e){
                    doSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            doSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners:{
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            }
        }
    })

    function doSearch(){
        var skey = Ext.getCmp('_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage =1;
        store.load();
    }



    var form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/LinkUp/remark',
        layout: 'anchor',
        defaults: {
            labelWidth:70,
            width:355,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID', name: 'lk_id',hidden:true},
            {fieldLabel: '备注', name: 'lk_remark',xtype:'textarea',allowBlank: false,id:'lk_remark'}
        ],
        buttons: [{
            text: '提交',
            formBind: true, //验证通过之后，才可以触发提交按钮
            disabled: true,
            handler: function() {
                var formVal = this.up('form').getForm();
                if (formVal.isValid()) {
                    formVal.submit({
                        success: function(formVal, action) {
                            Ext.Msg.alert('成功提示', action.result.msg, function(){
                                var title=win.getTitle();
                                store.reload();
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
                Ext.getCmp('lk_remark').setValue('');
            }
        }]
    });


    var win=Ext.create('Ext.window.Window', {
        title:'处理咨询',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form]
    });

    win.on('show',function(){
        var title=win.getTitle();
        Ext.getCmp('l_color').setHidden(title=='处理咨询');
        Ext.getCmp('color').setHidden(title=='处理咨询');
    });

    win.on('hide',function(){
        form.getForm().reset();
    });


    window.set_label = function(b){
        var row = SUNLINE.getSelected(grid);
        if (!row) return ExtAlert('请选择您想标记的游客咨询数据。');
        var id = row.get('lk_id');
        if (id==''||id=='0') return ExtAlert('请选择您想标记的游客咨询数据。');

        var data = {id:id, lk_label: b.text,type : 'lk_label'};
        Ext.Ajax.request({
            url:$__app__ + '/LinkUp/set_label',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                QtipMsg('友情提醒', info.msg, {direction:'t', width:210});
                if (ret.status){
                    row.set('lk_label', info.label);
                }
            },
            failure:function (response, otps) {
                QtipMsg('友情提醒', '设置标签操作失败', {direction:'t', width:210});
            }
        });
    }


    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })

    ziyo_log({ listeners : [{grid: grid, action:'LinkUp', pk_id:'l_id'}] });
    ziyo_label('label_btn');
});