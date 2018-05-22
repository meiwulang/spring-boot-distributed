 /**
 * Created by sunline on 2017-02-17.
 */

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '信用额度管理';
    var pro_type_publish = SUNLINE.productType({ //授信的适用产品类型
        id:'cl_product_type',name:'cl_product_type',fieldLabel:"产品类型",labelWidth:70
    });
    var company_box=SUNLINE.CompanyBox();
    var url = $__app__ + '/CreditLimit/dataJson';
    var store = SUNLINE.JsonStore(url, []);
    var isHidden = _uinfo.org_type=='管理公司' ? false : true;
    var cm =[
        new Ext.grid.RowNumberer({width:50}),
        {header:"cl_id", dataIndex:"cl_id", width:50, hidden:true},
        {header:"供应商", dataIndex:"cl_worg_name", width:200,hidden:isHidden},
        {header:"分销商", dataIndex:"cl_sorg_name", width:250,renderer:fullOrg},
        {header:"信用额度 <i class='fa fa-question-circle'></i>",tooltip:'单击可编辑授信', dataIndex:"cl_money", width:120,align:'right', editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:function(v, m, r, i){
            var mn = real_money(v, m, r);
            var cn = mn;
            try{
                cn = RMB(Number(v));
            }catch(e){ };
            var div = '<div title="无编辑权限：'+ cn +'" style="text-align:right;"><span>' + mn + '</span></div>';
            if(!isDisabled('CreditLimit::save')){
                div = '<div title="点击可编辑授信：'+ cn +'" style="text-align:right;"><a href="javascript:;" style="color:blue;" onclick="clickModify('+i+');"><span>' + mn + '</span></a></div>';
            }
            return div;
        }},
        {header:"信用余额", dataIndex:"cl_balance", width:120,align:'right', editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"结算周期", dataIndex:"cl_cycle", width:90},
        {header:"结算日", dataIndex:"cl_day", width:80},
        {header:"产品类型", dataIndex:"cl_product_type", width:200,hidden:true},
        {header:"产品类型名称", dataIndex:"cl_product_type_name", width:200,hidden:true},
        {header:"分销商区域", dataIndex:"cl_area", width:130,renderer:fullDress},
        {header:"法人代表", dataIndex:"org_legal", width:90},
        {header:"手机号码", dataIndex:"org_mob", width:100},
        {header:"联系电话", dataIndex:"org_tel", width:100},
        {header:"地址", dataIndex:"org_addr", width:250}
    ];

    company_box.store.on({
        beforeload:function(store,options){
            Ext.apply(store.proxy.extraParams, {org_type:'供应商'});
        },
        load:function(){
            company_box.store.add({id:0,text:'全部供应商'});
            company_box.store.sort({property : 'id',direction: 'ASC'});
        }
    });
    if(_uinfo.org_type=='管理公司'){
        company_box.setValue('全部供应商');
    }else{
        company_box.setHidden(true);
        company_box.setDisabled(true);
    }


    function fullOrg(v,m,r){
        return "【"+r.get('cl_sorg_bh')+"】"+v;
    };
    function fullDress(v,m,r){
        var province = r.get('org_province');
        if(province == null) {province = ""};
        var city = r.get('org_city');
        if(city == null) {city = ""};
        var county = r.get('org_county') ? r.get('org_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    var bc_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:cm,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有额度授信信息',
            enableTextSelection: true,
            deferEmptyText:true
        },
        tbar:[
            {text:'新增授信', iconCls:'button-add',handler:credit_modify, disabled:isDisabled('CreditLimit::save')},
            '-',
            {text:'编辑授信', iconCls:'button-edit',handler:credit_modify, disabled:isDisabled('CreditLimit::save')},
            '-',
            company_box,
            '-',
            '余额状态',
            {
                xtype:"combo",
                id:"org_money_val",
                name:"org_money_val",
                width:100,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['org_money_val'],
                    data:[
                        ['全部'],
                        ['有余额']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"org_money_val",
                displayField:"org_money_val",
                mode:"local",
                value:'全部'
            },
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'cb_search',
                cls:'search-icon-cls',
                emptyText:'分销商名称/编号/法人姓名/手机号',
                width:240,
                onTriggerClick:function (e) {
                    cb_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            cb_dosearch();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'额度授信信息'
        })
    });

    window.clickModify = function(i){
        if(isDisabled('CreditLimit::save')){
            Ext.Msg.alert('友情提示', '您没有权限编辑授信');
            return;
        }
        bc_grid.getSelectionModel().select(i, true);
        var v = {text:'编辑授信'};
        credit_modify(v);
    }


    //监听搜索控件改变进行搜索
    company_box.on('change',function(){
        cb_dosearch('nokey');
    })
    Ext.getCmp('org_money_val').on('change',function(){
        cb_dosearch('nokey');
    })

    org_bill_choose_week=new Ext.form.ComboBox({
        name:"cl_day",
        fieldLabel:"结算日",
        xtype:"combo",
        editable:false,
        triggerAction:"all",
        labelSeparator:'：',
        labelWidth:70,
        store:new Ext.data.SimpleStore({
            fields:['cl_day'],
            data:[
                ['周一'],
                ['周二'],
                ['周三'],
                ['周四'],
                ['周五'],
                ['周六'],
                ['周日']
            ]
        }),
        labelAlign:'right',
        displayField:"cl_day",
        valueField:"cl_day",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:'1'
    });

    org_bill_choose_month=new Ext.form.ComboBox({
        name:"cl_day",
        fieldLabel:"结算日",
        editable:false,
        triggerAction:"all",
        disabled:true,
        xtype:"hidden",
        labelSeparator:'：',
        labelWidth:70,
        store:new Ext.data.SimpleStore({
            fields:['cl_day'],
            data:[
                ['1'],
                ['2'],
                ['3'],
                ['4'],
                ['5'],
                ['6'],
                ['7'],
                ['8'],
                ['9'],
                ['10'],
                ['11'],
                ['12'],
                ['13'],
                ['14'],
                ['15'],
                ['16'],
                ['17'],
                ['18'],
                ['19'],
                ['20'],
                ['21'],
                ['22'],
                ['23'],
                ['24'],
                ['25'],
                ['26'],
                ['27'],
                ['28']
            ]
        }),
        labelAlign:'right',
        displayField:"cl_day",
        valueField:"cl_day",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:'1'
    });


    var basic_items = [{name:"cl_id", fieldLabel:"cl_id", maxLength:"10",xtype:"hidden"},
        {name:"cl_sorg_id", fieldLabel:"cl_sorg_id", maxLength:"10",xtype:"hidden"},

        {name:"cl_sorg_bh", fieldLabel:"账户编号",labelSeparator:'：', maxLength:"50",disabled:true},
        {name:"cl_sorg_name", fieldLabel:"账户名称",labelSeparator:'：', maxLength:"50",disabled:true},
        {name:"org_legal", fieldLabel:"法人代表",labelSeparator:'：', maxLength:"50",disabled:true},
        {name:"org_mob", fieldLabel:"手机号码",labelSeparator:'：', maxLength:"50",disabled:true},
        {name:"org_tel", fieldLabel:"联系电话",labelSeparator:'：', maxLength:"50",disabled:true},
        pro_type_publish,
        {name:"cl_money", fieldLabel:"信用额度",labelSeparator:'：', maxLength:"50",xtype:'numberfield',allowBlank:false},
        {
            name:"cl_cycle",
            fieldLabel:"结算周期",
            id:'cl_cycle_id',
            xtype:"combo",
            editable:false,
            allowBlank:false,
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['cl_cycle','cl_cycle_name'],
                data:[
                    ['手动','手动(账单日为9999-99-99，即不自动生成账单)'],
                    ['日结','日结(按付款日期)'],
                    ['周结','周结(按出团日期，出境、邮轮按付款日期)'],
                    ['月结','月结(按出团日期，出境、邮轮按付款日期)'],
                ]
            }),
            labelSeparator:'：',
            displayField:"cl_cycle_name",
            valueField:"cl_cycle",
            mode:"local",
            forceSelection:true,
            typeAhead:true,
            value:'日结'
        },
        org_bill_choose_week,
        org_bill_choose_month
    ];

    var credit_form=Ext.create('Ext.form.Panel',{
        layout: 'column',bodyPadding: 10,id:'form',border:false,width: 560,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',columnWidth:1,
            defaults:{anchor: '100%',allowBlank:false,labelAlign:'right',labelWidth:70}
        },
        items: [
            {title:'授信信息',cls:'tcol2',items:basic_items},
            {title:'温馨提示',cls:'tcol2',html:'<div style="margin: 10px;color:red"><ul><li>1、手动则账单日为9999-99-99，即不自动生成账单；</li><li>2、日结、周结、月结会根据各自规则计算账单日，并在每日凌晨自动生成账单，您也可以到【生成信用账单】功能里手动生成。</li><li>3、日结按付款日期计算账单日；</li><li>4、周结、月结按出团日期计算账单日；</li><li>5、出境游和邮轮无论选择何种方式，都按付款日期计算账单日。</li></ul></div>'}
        ]
    });

    var credit_win= new Ext.Window({
        width:570,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:credit_form,
        buttons:[
            {text:'保存', handler:credit_dosave},
            {text:'关闭', handler:function () {
                credit_win.hide();
            },style:'margin-right:15px;'}
        ]
    })




    var search_sorg_url = $__app__ + '/CreditLimit/get_company';
    var search_sorg_store = SUNLINE.JsonStore(search_sorg_url, [],false);
    var search_sorg_cm =[
        new Ext.grid.RowNumberer(),
        {header:"org_id", dataIndex:"org_id", width:50, hidden:true},
        {header:"编号", dataIndex:"org_bh", width:100, align:'center'},
        {header:"单位名称", dataIndex:"org_name", width:250},
        {header:"分销商区域", dataIndex:"org_province", width:150,renderer:fullDress},
        {header:"法人代表", dataIndex:"org_legal", width:90},
        {header:"手机号码", dataIndex:"org_mob", width:100},
        {header:"联系电话", dataIndex:"org_rel", width:100},
        {header:"地址", dataIndex:"org_addr", width:250}
    ];

    //有供应商的省份、城市列表
    var area_large_url = $__app__ + '/ActivityCount/getLargeAreaList';
    var area_large_field = [];
    var area_large_store = SUNLINE.JsonStore(area_large_url, area_large_field);
    var area_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var area_city_store = Ext.create('Ext.data.Store',{
        fields: ['name'],
        data: []
    });
    var box_large_area = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_area',
        fieldLabel: '大区',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_large_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        editable:false,
        width: 120,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                area_store.loadData(r[0].get('data'));
                area_pro_arr = ''; //重置
                Ext.each(r[0].get('data'),function(v){
                    if(area_pro_arr) {
                        area_pro_arr += ',' + v.name;
                    }else{
                        area_pro_arr = v.name;
                    }
                });
            },
            change:function(t,n,o,opt){
                var r = t.valueModels;
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                if(r && r.length >0 ) {
                    area_store.loadData(r[0].get('data'));
                    area_pro_arr = ''; //重置
                    Ext.each(r[0].get('data'), function (v) {
                        if (area_pro_arr) {
                            area_pro_arr += ',' + v.name;
                        } else {
                            area_pro_arr = v.name;
                        }
                    });
                }
            }
        }
    });
    var box_province = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_province',
        fieldLabel: '省份',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 120,
        editable:false,
        listeners: {
            select:function(c,r){
                Ext.getCmp('search_org_city').setValue('');
                area_city_store.loadData(r[0].get('data'));
                area_pro_arr = '';
            },
            change:function(t,n,o,opt){
                var r = t.valueModels;
                if(r && r.length >0 ){
                    Ext.getCmp('search_org_city').setValue('');
                    area_city_store.loadData(r[0].get('data'));
                    area_pro_arr = '';
                }
            }
        }
    });
    var box_city = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_city',
        fieldLabel: '城市',
        labelWidth: 40,
        labelAlign: 'right',
        store: area_city_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 140,
        editable:false
    });


    var search_sorg_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:search_sorg_cm,
        store:search_sorg_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有分销商信息',
            enableTextSelection: true,
            deferEmptyText:true
        },
        tbar:[
            {text:'授信', iconCls:'button-add',handler:credit_modify},
            {xtype:'checkboxfield',id:'only_my_city',name:'only_my_city',fieldLabel:false,boxLabel:'只关注'+_uinfo.org_city},
            box_large_area,
            box_province,
            box_city,
            {xtype:'textfield',id:'sorg_company_search',name:'sorg_company_search',width:240, emptyText:'分销商名称/编号/法人名称/手机号码'},
           {text:'查询',iconCls: 'searchico',handler:function(){
               cb_dosearch('sorg');
           }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:search_sorg_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分销商信息'
        }),
        listeners:{
            "rowdblclick":function (_this, record, tr, rowIndex, e, eOpts) {
                //非独立结算单位不能授信
                if(record.get('org_alone') == 1){
                    Ext.Msg.alert('提示信息','当前选中单位不是独立结算的单位,不能授信!');
                    return false;
                }
                credit_modify({text:'授信'});
            }
        }
    });
    var search_sorg_win =  new Ext.Window({
        width:900,
        height:500,
        maximizable : true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:search_sorg_grid,
        scrollable:true,
        layout : 'border',
        buttons:[
            {text:'关闭', handler:function () {
                search_sorg_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    credit_win.on('hide',function(){
        credit_form.getForm().reset();
    });
    Ext.getCmp('cl_cycle_id').on('change', function(c,r,n){
        change_cl_cycle(r,null);
    });
    Ext.getCmp('only_my_city').on('change', function(t,n,o){
        if(n==true){
            box_large_area.setDisabled(true);
            box_province.setDisabled(true);
            box_city.setDisabled(true);
        }else{
            box_large_area.setDisabled(false);
            box_province.setDisabled(false);
            box_city.setDisabled(false);
        }
    });
    Ext.getCmp('sorg_company_search').on('specialkey',function(t,e){
        if (e.keyCode == 13) {
            cb_dosearch('sorg');
        }
    });

    function change_cl_cycle(type,row){
        if(type=='周结'){
            org_bill_choose_week.setDisabled(false);
            org_bill_choose_week.setHidden(false);
            org_bill_choose_month.setDisabled(true);
            org_bill_choose_month.setHidden(true);
            if(row)org_bill_choose_week.setValue(row.data.cl_day);
        }else if(type=='月结'){
            org_bill_choose_week.setDisabled(true);
            org_bill_choose_week.setHidden(true);
            org_bill_choose_month.setDisabled(false);
            org_bill_choose_month.setHidden(false);
            if(row)org_bill_choose_month.setValue(row.data.cl_day);
        }else{
            org_bill_choose_week.setDisabled(true);
            org_bill_choose_week.setHidden(true);
            org_bill_choose_month.setDisabled(true);
            org_bill_choose_month.setHidden(true);
        }
    }
    function credit_modify(v){
        if(v.text=='编辑授信'){
            credit_win.setTitle(v.text, v.iconCls);
            var row=SUNLINE.getSelected(bc_grid);
            if(!row){
                Ext.Msg.alert('提示信息','请选择您要操作的数据');
                return false;
            }
            var cl_product_type = row.data.cl_product_type;
            cl_product_type = cl_product_type.replace(/\[|\]|"/g,'');
            SUNLINE.productTypeSetValues(pro_type_publish,cl_product_type );
            credit_form.getForm().setValues(row.data);
            credit_win.show();
            change_cl_cycle(row.data.cl_cycle,row);
        }else{
            if(!search_sorg_win.isHidden()){
                var row = SUNLINE.getSelected(search_sorg_grid);
                if(!row){
                    Ext.Msg.alert('提示信息','请选择您要授信的分销商');
                    return false;
                }
                credit_win.setTitle(v.text, v.iconCls);
                credit_form.getForm().setValues({cl_id:0,cl_sorg_id:row.data.org_id,cl_sorg_bh:row.data.org_bh,org_legal:row.data.org_legal,org_mob:row.data.org_mob,org_tel:row.data.org_tel,cl_sorg_name:row.data.org_name,cl_cycle:'',cl_day:''});
                credit_win.show();
                change_cl_cycle(null,null);
            }else{
                var worg = _uinfo.org_type=='管理公司' ? company_box.getValue() : _uinfo.org_id;
                if(isNaN(worg) || !worg>0){
                    Ext.Msg.alert('提示信息','请在所属单位里选择有个供应商才能进行授信');
                    return false;
                }
                Ext.getCmp('only_my_city').setValue(true);
                box_large_area.setDisabled(true);
                box_province.setDisabled(true);
                box_city.setDisabled(true);
                search_sorg_win.setTitle(v.text);
                search_sorg_win.show();
            }
        }
    }


    function credit_dosave(){
        var data = credit_form.getForm().getValues();
        var money_c = 0;
        data['cl_worg_id'] = _uinfo.org_type=='管理公司' ? company_box.getValue() : _uinfo.org_id;
        if(data['cl_id']>0){
            var row=SUNLINE.getSelected(bc_grid);
            var money_c=parseFloat(row.data.cl_money)-parseFloat(row.data.cl_balance);
            data['cl_worg_id'] = row.data.cl_worg_id;
        }
        if(isNaN(data['cl_worg_id']) || !data['cl_worg_id']>0){
            Ext.Msg.alert('友情提示', '供应商参数丢失，请重新选择所属单位里的供应商');
            return;
        }
        if (!credit_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        }
        if(data['cl_money']<0){
            Ext.Msg.alert('友情提示', '信用额度不能为负数');
            return;
        }
        if(money_c>data['cl_money']){
            Ext.Msg.alert('友情提示', '该分销商已经使用信用额度'+money_c+',所以信用额度最低为'+money_c);
            return;
        }
        var myMask=new Ext.LoadMask({target:credit_win,msg:'数据提交中，请稍候...'});
        myMask.show();

        Ext.Ajax.request({
            url:$__app__ + '/CreditLimit/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    credit_win.hide();
                    store.reload();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    function cb_dosearch(t){
        if(t&&t=='sorg'){
            var region =Ext.getCmp('search_org_area').getValue();
            var province =Ext.getCmp('search_org_province').getValue();
            var city =Ext.getCmp('search_org_city').getValue();
            var search_store = search_sorg_store;
            var key = Ext.getCmp('sorg_company_search').getValue();
            if(!key && !region && !province && !city)return;
            var worg = _uinfo.org_type=='管理公司' ? company_box.getValue() : _uinfo.org_id;
            if(Ext.getCmp('only_my_city').getValue()==true){
                region='';
                province = '';
                city = _uinfo.org_city;
            }
            var search_params ={skey: key,region:region,province:province,city:city,worg:worg};
        }else {
            var search_store = store;
            var worg = company_box.getValue();
            var org_money_val = Ext.getCmp('org_money_val').getValue();
            var skey = (t&& t=='nokey') ? '' : Ext.getCmp('cb_search').getValue();
            var search_params ={skey: skey};
            if(!isNaN(worg) && worg>0){
                search_params.worg = worg;
            }
            if(org_money_val!='全部'){
                search_params.balance = 1;
            }

        }
        SUNLINE.baseParams(search_store, search_params);
        search_store.currentPage = 1;
        search_store.load();
    }


    ziyo_log({ listeners : [{grid: bc_grid, action:'CreditLimit', pk_id:'cl_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [bc_grid]
    });

    if(_uinfo['org_id']!=1){
        Ext.getCmp('p_org_name_id').setDisabled(true);
    }

});
