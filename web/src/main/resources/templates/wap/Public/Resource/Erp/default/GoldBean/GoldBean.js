var ROW={};
var LgirdVal = {};//存储部门所属单位的信息
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '金豆充值';
    var url=$__app__+'/GoldBean/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);
    var c_url=$__app__+'/Users/dataJson';
    var c_field=['org_id','org_pid','org_bh','org_name','org_sname', 'org_addr','org_legal','org_tel','org_mob',
        'wg_fax','org_status','org_pym','org_web','org_addtime','org_intro','org_logo','org_pic',
        'org_mapx','org_mapy','org_mapz'];
    var c_store=SUNLINE.JsonStore(c_url,c_field);
    var hiderule;
    var cm=[
        { text: 'ID',  dataIndex: 'ag_id',hidden:false },
        { text: '帐单号',  dataIndex: 'ag_pay_no',width:160 },
        { text: '金豆数',  dataIndex: 'ag_total_fee',width:160 },
        { text: '类型',  dataIndex: 'ag_type' ,width:100},
        { text: '备注',  dataIndex: 'ag_remark' ,width:300},
        { text: '操作日期',  dataIndex: 'ag_create_time',width:150,renderer:function(val){
            if(val != null){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d h:i:s');
            }
        }},
    ];
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        autoScroll: true,
        columns:cm,
        viewConfig:{
            emptyText : '暂时没有信息',
            deferEmptyText : true
        },
        loadMask:{msg:'数据载入中，请稍候'},
        tbar:[
            {text:'充值',iconCls:'button-add',handler:modify},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                if(!LgirdVal.org_name){
                    Ext.Msg.alert('友情提醒','没有选择单位或单位信息有误！');
                    return;
                }else{
                    store.reload();
                }
            }},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'wg_Search',
                iconCls:'button-sch',
                emptyText : '备注关键字',
                width:200,
                onTriggerClick:function(e){
                    wgSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            wgSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){
                    window.location.reload();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });
    var lurl = url=$__app__+'/Users/dataJson';
    var lfield=['u_id','u_realname','u_mobile','u_name'];
    var lstore=SUNLINE.JsonStore(lurl,lfield);
    var lcm=[
        {text:'编号',dataIndex:'u_id',width:60 },
        {text:'用户名',dataIndex:'u_name',width:120},
        {text:'角色权限',dataIndex:'r_name',width:100,renderer:rolerule},
        {text:'真实姓名',dataIndex:'u_realname',width:120 },
        {text:'手机号码',dataIndex:'u_mobile',width:150 }
    ];

    function rolerule(v, c, r) {
        if (r.data['u_admin'] == 1) {
            return '<font color="green" style="font-weight:900">管理员<font/>';
        } else {
            return r.data.r_name;
        }
    }

    var company_box=SUNLINE.CompanyBox({
        config:{
            hidden:hiderule,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:440,
            labelAlign: 'right',
            value: '全部单位',
            pageSize:20,
            style:'margin:3px 5px 3px 10px',
            listConfig:{
                minWidth:280
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

    var lgrid = Ext.create('Ext.grid.Panel',{
        region:'west',
        store:lstore,
        columns:lcm,
        split:true,
        width:535,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {
                xtype:'buttongroup',
                id:'search_form',
                height:80,
                columns:2,
                padding:"10 0 0 0",
                items:[
                    company_box,
                    {text:'查询',rowspan:3,iconCls: 'searchico',iconAlign: 'top',height:50,style:'margin:3px 5px 3px 10px;',handler:orgSearch},
                    {
                        labelAlign:'right',
                        labelWidth:70,
                        colspan:1,
                        fieldLabel: '用户名称',
                        xtype:'textfield',
                        id:'org_Search',
                        emptyText : '用户名、真实姓名、手机号码',
                        iconCls:'button-sch',
                        width:450
                    },


                ]
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: lstore,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    lgrid.on('cellclick',function(sm,rowldx,c,r){
        LgirdVal = r.data;
        console.log(r.data);
        SUNLINE.baseParams(store,{wg_org_id:LgirdVal.org_id,u_id:LgirdVal.u_id});
        store.load({params:{page:1,start:0}});
    })
    var form=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,
        url: $__app__+'/Workgroup/save',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            labelWidth:60,
            labelAlign:'right'
        },
        defaultType: 'textfield',
        items: [
            {fieldLabel: 'ID',id:'ag_id',name: 'ag_id',hidden:true},
            {fieldLabel: '单位ID',id:'ag_org_id',name: 'ag_org_id',allowBlank: false,hidden:true},
            {fieldLabel: '用户ID',id:'ag_u_id',name: 'ag_u_id',allowBlank: false,hidden:true},
            {fieldLabel: '所属单位',id:'ag_org_name',name: 'ag_org_name',disabled:true},
            {fieldLabel: '用户名',id:'ag_u_name',name: 'ag_u_name',disabled:true},
            {fieldLabel: '真实姓名',id:'ag_u_realname',name: 'ag_u_realname',disabled:true},
            {fieldLabel: '金豆数',id:'ag_total_fee',name: 'ag_total_fee',allowBlank: false,emptyText:'请填写金豆数量'},
            {fieldLabel: '说明',id:'ag_remark',name: 'ag_remark',xtype:'textarea',allowBlank: true,value:'金豆充值'}
        ]
    });

    company_box.store.on('load',function(a,b){
        this.add({id:0,text:'全部单位', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box.store.load();

    company_box.on('select',function(c,r){
        Ext.getCmp('org_Search').setValue('');
        var row= r[0];
        SUNLINE.baseParams(lstore,{u_org_id:row.get('id')});
        ROW.u_org_id=row.get('id');
        lstore.load();
        SUNLINE.baseParams(select_role.store,{r_org:ROW.u_org_id});
        select_role.store.load();
        select_role.setValue('全部权限');

    });

    select_role.store.on({
        load:function(a,b){
            this.add({r_id:0,r_name:'全部权限'});
            for(var i in b){
                this.add(b[i]['data']);
            }
        }
    });

    select_role.store.load();
    select_role.on({
        select:function(c,r){
            var row=r[0].data;
            var us_data={u_org_id:ROW.u_org_id};
            if(row.r_id>0)us_data.u_role_id=row.r_id;
            SUNLINE.baseParams(lstore,us_data);
            lstore.currentPage=1;
            lstore.load();
        }
    });

    var win=Ext.create('Ext.window.Window', {
        title:'金豆充值',
        closeAction:'hide',
        autoHeight:true,
        modal:true,
        width: 400,
        items: [form],
        buttons: [
            {text: '提交',handler: function() {
                var iform = form.getForm();
                var v=iform.getValues();
                if (!iform.isValid()) {
                    Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
                    return;
                }
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url: $__app__+'/GoldBean/save',
                    params: v,
                    method:'post',
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', r.info.msg);
                        if(r.status){
                            win.hide();
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }},
            {text:'关闭',handler:function(){
                win.hide();
            }}
        ]
    });
    ziyo_log({ listeners : [{grid: grid, action:'GoldBean', pk_id:'ag_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [grid,lgrid]
    });

    function wgSearch(){
        var skey=Ext.getCmp('wg_Search').getValue();
        if(!LgirdVal.id){
            Ext.Msg.alert('友情提示','请先选择单位！');
            return;
        }
        var u_id = LgirdVal.u_id;
        SUNLINE.baseParams(store,{skey:skey,u_id:u_id});
        store.currentPage = 1;
        store.load();
    }
    function orgSearch(){
        var skey=Ext.getCmp('org_Search').getValue();
        SUNLINE.baseParams(lstore,{skey:skey});
        lstore.currentPage = 1;
        lstore.load();
        store.removeAll();
    }
    function modify(v){
        if(typeof LgirdVal.org_id == 'undefined'){
            Ext.Msg.alert('友情提示','请先选择左边的单位！');
            return false;
        }else{
            ROW.values={};
            ROW.values.ag_u_id=LgirdVal.u_id;
            ROW.values.ag_org_id=LgirdVal.org_id;
            ROW.values.ag_u_name=LgirdVal.u_name;
            ROW.values.ag_u_realname=LgirdVal.u_realname;
            ROW.values.ag_org_name=LgirdVal.org_name;
            win.setTitle(v.text+'信息',v.iconCls);
            win.show();
        }

    }

    win.on('show',function(){
        form.getForm().reset();
        form.getForm().setValues(ROW.values);
    })

    function del(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要删除记录！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/GoldBean/del',
                    params: {
                        wg_id:ret.data.wg_id
                    },
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
    };
    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'GoldBean', table:'AppGoldbeanAccount', pk_id:'ag_id'}] });

});