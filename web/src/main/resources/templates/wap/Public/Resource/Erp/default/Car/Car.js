var ROW = {};
GUIDE_WORK = {};
var WG={};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '车辆管理';

    var car_url = $__app__ + '/Car/dataJson';
    var car_field = [{name:"c_id"}];
    var car_store = new SUNLINE.JsonStore(car_url, car_field);

    var car_cm =[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"c_id", width:50, hidden:true},
        {header:"车队编号", dataIndex:"c_org_id", width:100, hidden:true},
        {header:"车牌号", dataIndex:"c_mark", width:120},
        {header:"品牌", dataIndex:"c_brand", width:80},
        {header:"可坐人数", dataIndex:"c_people", width:80},
        {header:"车型", dataIndex:"c_car_type", width:100},
        {header:"出厂年月", dataIndex:"c_ppl", width:100,renderer:c_ppl_date}
    ];
    function c_ppl_date(v,m,r){
        return r.get('c_ppl').substr(0,4) + '-' + r.get('c_ppl').substr(4,2) + '-' + r.get('c_ppl').substr(6,2) ;
    }
    //车队公司
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'车队公司'}
    });
    var car_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:car_cm,
        store:car_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有车辆信息',
            deferEmptyText:true
        },
        tbar:[
            {text:'添加', iconCls:'button-add', handler:modify, disabled:isDisabled('Car::save')},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify, disabled:isDisabled('Car::save')},
            '-',
            {text:'删除', iconCls:'button-del', handler:del, disabled:isDisabled('Car::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                car_store.reload();
            }},
            company_box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'车牌号、车辆品牌',
                width:200,
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
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:car_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有车辆信息'
        })
    });
    ROW.c_org_id=_uinfo.org_id;
    SUNLINE.baseParams(car_store,{c_org_id:ROW.c_org_id});
    car_store.load();
    company_box.on('select',function(c,r){
        var row= r[0];
        SUNLINE.baseParams(car_store,{c_org_id:row.get('id')});
        ROW.c_org_id=row.get('id');
        car_store.load();
    });


    var c_car_type_combo=SUNLINE.DictComBox({name:'c_car_type',fieldLabel:"车辆车型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'车辆车型'});
    var c_brand_type_combo=SUNLINE.DictComBox({name:'c_brand',fieldLabel:"车辆品牌",labelWidth:80,labelAlign:"right",allowBlank:false,editable:true,forceSelection:false},{'d_type':'车辆品牌'});
    var car_form = new Ext.form.FormPanel({
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
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {id:"c_id", name:"c_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {id:"c_org_id", name:"c_org_id", fieldLabel:"用户ID", maxLength:"10", xtype:"hidden"},
                    {id:"c_mark", name:"c_mark", fieldLabel:" 车牌号", maxLength:"50", allowBlank:false,vtype:'NotBlank'},
                    c_brand_type_combo.box,
                    c_car_type_combo.box,
                    {id:"c_people", name:"c_people", fieldLabel:"可坐人数", maxLength:"10",allowBlank:false,xtype:'numberfield'},
                    SUNLINE.ExtDateField({id:'c_ppl', fieldLabel:"出厂日期",labelAlign:"right"})
                ]
            },{
                columnWidth:1,
                items:[{id:"c_info",labelAlign:"right", name:"c_info", fieldLabel:"车辆备注", maxLength:"500", xtype:'textarea',width:"260"}]
            }
        ]
    });
    var win = new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:car_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    function dosave() {
        if (!car_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = car_form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/Car/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    car_store.reload();
                    win.hide();
                };
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };

    //搜索框查询
    function dosearch(){
        var key=Ext.getCmp('search').getValue();
        SUNLINE.baseParams(car_store,{skey:key,c_org_id:ROW.c_org_id});
        car_store.currentPage=1;
        car_store.load();
    }

    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            win.show();
            if(row.data.c_ppl.indexOf("-")<=0){
                row.data.c_ppl=row.data.c_ppl.substr(0,4) + '-' + row.data.c_ppl.substr(4,2) + '-' + row.data.c_ppl.substr(6,2) ;
            }
            car_form.getForm().setValues(row.data);
            win.setTitle(v.text+"车辆信息", v.iconCls);
        }else{
            win.show();
            Ext.getCmp('c_org_id').setValue( ROW.c_org_id);
            win.setTitle(v.text+"车辆信息", v.iconCls);
        }
    }

    win.on('hide',function(){
        car_form.getForm().reset();
    })

    //删除
    function del(){
        var row=SUNLINE.getSelected(car_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }

        var id = row.get('c_id'), c_mark = row.get('c_mark');
        Ext.Msg.confirm('友情提示','你确定删除'+c_mark+'吗？',function(y){
            if(y=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Car/del',
                    method : 'POST',
                    params : { c_id :id},
                    success : function(response, opts){
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            car_store.reload();
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }

    new Ext.Viewport({
        layout : 'border',
        items : [car_grid]
    });





});
