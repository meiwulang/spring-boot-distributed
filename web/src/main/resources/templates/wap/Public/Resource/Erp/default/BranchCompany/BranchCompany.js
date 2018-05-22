WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '公司管理';

    var bc_url = $__app__ + '/Company/sys_company_list';
    var bc_field = [
        {name:"bc_id"},
        {name:"bc_name"},
        {name:"bc_province"},
        {name:"bc_city"},
        {name:"bc_county"},
        {name:"bc_apply_city"},
        {name:"bc_time"},
        {name:"bc_status"}
    ];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field);

    var bc_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID", dataIndex:"bc_id", width:50, hidden:true},
        {header:"分公司名称", dataIndex:"bc_name", width:280},
        {header:"分公司地址", dataIndex:"bc_name_add", width:150,renderer:fullDress},
        {header:"适用城市", dataIndex:"bc_apply_city", width:400}
    ];
    function fullDress(v,m,r){
        var province = r.get('bc_province');
        if(province == null) {province = ""};
        var city = r.get('bc_city');
        if(city == null) {city = ""};
        var county = r.get('bc_county') ? r.get('bc_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };
    var bc_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:bc_cm,
        store:bc_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有分公司信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'编辑适用城市', iconCls:'button-edit', handler:modify, disabled:isDisabled('BranchCompany::company_save')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                bc_store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'bc_search',
                cls:'search-icon-cls',
                emptyText:'分公司名称',
                width:150,
                onTriggerClick:function (e) {
                    bc_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            bc_dosearch();
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
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:bc_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分公司信息'
        })
    });



    //搜索框查询
    function bc_dosearch(){
        var key=Ext.getCmp('bc_search').getValue();
        SUNLINE.baseParams(bc_store,{skey:key});
        bc_store.currentPage=1;
        bc_store.load();
    }
    var province_combo=SUNLINE.ComBoxCity({
        id:'bc_province',
        config:{
            fieldLabel:"省份",
            labelWidth:80,
            labelAlign:"right",
            allowBlank:false,
            disabled:true
        },
        where:{city_type:'province'},
        actionTo:'bc_city'
    });

    var city_combo=SUNLINE.ComBoxCity({
        id:'bc_city',
        config:{
            fieldLabel:"城市",
            labelWidth:80,
            labelAlign:"right",
            allowBlank:false,
            disabled:true
        },
        where:{city_type:'city'},
        appTo:'bc_province'
    });
    var county_combo=SUNLINE.ComBoxCity({
        id:'bc_county',
        config:{
            fieldLabel:"区/县",
            labelWidth:80,
            labelAlign:"right",
            allowBlank:false,
            disabled:true
        },
        where:{city_where:'county'},
        appTo:'bc_city'
    });
    var city_url = $__app__ + '/BranchCompany/apply_city';
    var city_field = [
        {name:"id"},
        {name:"Name"},
        {name:"LevelType"}
    ];
    var city_store = new SUNLINE.JsonStore(city_url, city_field,false);
    var bc_form= new Ext.form.FormPanel({
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
        viewModel: {},
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {id:"bc_id", name:"bc_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"bc_name", name:"bc_name", fieldLabel:"分公司名称", maxLength:"10", allowBlank:false,vtype:'NotBlank',disabled:true},
                    province_combo,
                    city_combo,
                    county_combo,
                    {
                        xtype: 'tagfield',
                        allowBlank:false,
                        name:'bc_apply_city[]',
                        id:'bc_apply_city',
                        fieldLabel: '适用城市',
                        store:city_store,
                        value: [''],
                        displayField: 'Name',
                        valueField: 'Name',
                        reference: 'locations',
                        filterPickList: true,
                        createNewOnEnter: true,
                        createNewOnBlur: true,
                        queryMode: 'local',
                        publishes: 'Name'
                    }
                ]
            }
        ]
    });
    bc_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:bc_form,
        buttons:[
            {text:'保存', handler:bc_dosave},
            {text:'关闭', handler:function () {
                bc_win.hide();
            }}
        ]
    })
    bc_win.on('hide',function(){
        bc_form.getForm().reset();
    })
    function bc_dosave(){
        if (!bc_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var data = bc_form.getForm().getValues();
        data['bc_name']=WG.bc_name;
        Ext.Ajax.request({
            url:$__app__ + '/BranchCompany/company_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    bc_store.reload();
                    bc_win.hide();
                };
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    //添加-修改方法
    function modify(v){
        if(v.text=='编辑适用城市'){
            var row=SUNLINE.getSelected(bc_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            SUNLINE.baseParams(city_store,{org_id:row.data.bc_id});
            city_store.load();
            bc_win.show();
            WG.bc_name=row.data.bc_name;
            if(row.data.bc_apply_city.constructor != Array) row.data.bc_apply_city=row.data.bc_apply_city.split(',');
            bc_form.getForm().setValues(row.data);
        }else{
            city_store.load();
            bc_win.show();

        }
        bc_win.setTitle(v.text+"分公司信息", v.iconCls);
    }


    //删除
    function del(){
        var row=SUNLINE.getSelected(bc_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }

        var id = row.get('bc_id'), bc_name = row.get('bc_name');
        Ext.Msg.confirm('友情提示','你确定删除'+bc_name+'吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/BranchCompany/del',
                    method : 'POST',
                    params : { bc_id :id},
                    success : function(response, opts){
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            bc_store.reload();
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }
    ziyo_log({ listeners : [{grid: bc_grid, action:'BranchCompany', pk_id:'bc_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [bc_grid]
    });





});
