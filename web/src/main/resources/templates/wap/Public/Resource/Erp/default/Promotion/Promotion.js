/**
 * Created by cjl on 2017/5/5.
 */
var pageSize = 20;

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var cur_org_id = _uinfo.org_id;

    //金额验证,只允许数字和小数点
    Ext.apply(Ext.form.field.VTypes, {
        money: function(val, field) {
            return /^\d+$|^\d+\.\d+$/.test(val);
        },
        moneyText: "请输入数字！",
    });

    //可编辑设置
    if( _uinfo.org_type == '管理公司' ){
        var is_edit = Ext.create('Ext.form.TextField', {
            allowBlank: false,
            vtype:'money',
        });
        var isColsHide = false;
        var colsNum = 1;
    }else {
        is_edit = false;
        var isColsHide = true;
        var colsNum = 2;
    }
    function is_cluster(v) {
        return v ? v : 0 ;
    }

    var url = $__app__ + '/Promotion/PromotionData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);

    //菜单栏
    var cm = [
        new Ext.grid.RowNumberer({width:30}),
        {header: "ID", dataIndex: "pp_id", width: 50, hidden: true},
        {
            header: '<span style="color:blue">活动排序</span>',
            dataIndex: 'pp_sort',
            width: 80,
            align: 'center',
            editor: is_edit,
            hidden: isColsHide,
            renderer:is_cluster
        },
        {header: "品牌ID", dataIndex: "pp_brand", width: 100,align: 'center',hidden:true},
        {header: "活动名称", dataIndex: "pp_title", width: 200},
        {header: "品牌名称", dataIndex: "cb_name", width: 100},
        {header: "活动类型", dataIndex: "pp_type_text", width: 100},
        {header: "活动金额", dataIndex: "pp_amount", width: 100,align: 'right'},
        {header: "最大限制", dataIndex: "pp_max_limit", width: 100,align: 'right'},
        {header: "产品ID",   dataIndex: "pp_scope", align: 'center',hidden:true},
        {header: "产品范围", dataIndex: "pp_scope_name", width: 100},
        {header: "支付类型", dataIndex: "pp_pay_type_text", width: 150},
        {header: "票价类型", dataIndex: "pp_ticket_type_text", width: 150},
        {header: "主推城市", dataIndex: "pp_first_city", width: 200},
        {header: "投放城市", dataIndex: "pp_apply_city", width: 200},
        {header: "活动时间", dataIndex: "pp_date", width: 150},
        {header: "班期时间", dataIndex: "pp_classes_date", width: 150},
        {header: "添加人", dataIndex: "u_realname", width: 120},
        {header: "添加时间", dataIndex: "pp_time", width: 120},
    ];

    //活动管理操作-新增、编辑、删除、绑定产品
    var add_btn = {text: '新增', iconCls: 'button-add', id: 'add_id', handler: editPromotion,style:'margin-left:5px;margin-top:3px;'};
    var edit_btn = {text: '编辑', iconCls: 'button-edit', id: 'edit_id', handler: editPromotion,style:'margin-left:5px;margin-top:3px;'};
    var del_btn = {text: '删除', iconCls: 'button-del', id: 'del_id', handler: delPromotion,style:'margin-left:5px;margin-top:3px;'};
    var bind_product = {text: '绑定产品', iconCls: 'button-edit', id: 'bind_id', handler: bindProducts, style:'margin-left:5px;margin-top:3px;'};

    //搜索时间下拉列表
    var dateGroup = SUNLINE.LocalComob({
        id: 'date_group',
        fields: ['date_name', 'date_text'],
        data: [
            {'date_name': 'pp_date', 'date_text': '活动时间'},
            {'date_name': 'pp_classes_date', 'date_text': '班期时间'},
        ],
        config: {
            displayField: 'date_text',
            valueField: 'date_name',
            fieldLabel: '',
            labelSeparator: '',
            allowBlank: true,
            id: 'date_group',
            name: 'date_group',
            labelWidth: 0,
            labelAlign: 'right',
            width: 115,
            value: '活动时间',
            style:'margin-top:3px;',
        }
    });
    var start_date = SUNLINE.ExtDateField({
        id: 'start_date',
        name: 'start_date',
        labelWidth: 0,
        labelAlign: "right",
        style: 'margin-top:3px;margin-left:5px;',
        fieldLabel: false,
        labelSeparator: '',
        width: 110,
        gang: 'end_date',
        start: true,
        value: '',
    });
    var end_date = SUNLINE.ExtDateField({
        id: 'end_date',
        name: 'end_date',
        labelWidth: 0,
        labelAlign: "right",
        style: 'margin-top:3px;margin-left:5px;',
        fieldLabel: false,
        labelSeparator: '',
        width: 110,
        gang: 'start_date',
        value: ''
    });

    var hiderule = (_uinfo.org_type != '管理公司') ? true : false ; //除了管理公司，其它角色都隐藏单位搜索
    var company_name = (_uinfo.org_type == '管理公司') ? '全部' : _uinfo.org_name;
    var company_box = SUNLINE.CompanyBox({
        fields: ['id', 'text', 'org_bh'],
        url: $__app__ + '/Promotion/treeJson',
        config: {
            colspan:2,
            disabled: hiderule,
            displayField: 'text',
            valueField: 'id',
            fieldLabel: '所属单位',
            labelWidth: 60,
            width: 230,
            labelAlign: 'right',
            value: company_name,
            pageSize: 20,
            listConfig: {
                minWidth: 340
            },
            style:'margin-top:3px;',
            listeners: {
                //单位选择后自动查询结果
                select: function(v,r){
                    var org_id = r[0]['data']['id'];
                    Ext.getCmp('cur_org_id').setValue(org_id);
                    doSearch();
                }
            }
        }
    });


    //配置ext面板
    var panel = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '暂无活动信息'},
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var data = SUNLINE.getSelected(g.grid).data;
                        var pp_id = Number(data.pp_id);
                        var pp_sort = Number(data.pp_sort);

                        if( data.pp_id ){
                            Ext.Ajax.request({
                                url: $__app__+'/Promotion/setPromoSort',
                                params: {pp_id: pp_id, pp_sort: pp_sort},
                                method:'post',
                                success: function(response){
                                    var r = Ext.decode(response.responseText);
                                    if(r.status){
                                        store.load();
                                    }
                                }
                            });
                        }else{
                            Ext.Msg.alert('友情提示', "参数出错，该活动ID丢失！");
                            return false;
                        }
                    }
                }
            })
        ],
        tbar:[
            {
                xtype:'buttongroup',
                title:'活动管理',
                height:84,
                columns: 4,
                id:'btn-first',
                items:[
                    {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn',style:'margin-left:5px;margin-top:3px;'},
                    {text: '刷新', iconCls: 'button-ref', id: 'ref_id', colspan:colsNum, handler: function () { store.reload()},style:'margin-left:5px;margin-top:3px;'},
                    {
                        text: '主推',
                        iconCls: 'button-write',
                        id: 'first_city',
                        disabled:isColsHide,
                        hidden: isColsHide,
                        style: 'margin-left:5px;margin-top:3px;',
                        tooltip:'活动专区的主推城市的设置',
                        handler: function(t){
                            //判断单位是否已选择
                            row = SUNLINE.getSelected(panel);
                            if (!row) {
                                return ExtAlert('请先选择要主推的活动!', '友情提示');
                            }else if( !row.get('pp_apply_city') ){
                                return ExtAlert('请先设定投放城市!', '友情提示');
                            }

                            var pp_id = row.get('pp_id');
                            //主推城市panel
                            window.firstCity = SUNLINE.PutCity({
                                id: 'pp_first_city',
                                url: $__app__ + '/Promotion/firstCityJson?pp_id='+pp_id,
                                title: '主推城市'
                            }, function (v) {
                                //提交主推城市数据
                                Ext.Ajax.request({
                                    url: $__app__ + '/promotion/updateFirstCity',
                                    params: {pp_id: pp_id, pp_first_city: v.join(',')},
                                    method: 'POST',
                                    success: function (response, otps) {
                                        var ret = Ext.decode(response.responseText);
                                        if (1 == ret.success) {
                                            Ext.Msg.alert('信息提示', ret.message);
                                            store.reload();
                                        } else {
                                            Ext.Msg.alert('信息提示', ret.message);
                                        }
                                    },
                                    failure: function (response, otps) {
                                        Ext.Msg.alert('信息提示', '主推城市保存出错!');
                                    }
                                });
                            });
                            //设置默认城市
                            firstCity.this_val = row.get('pp_first_city');
                            //记录默认显示的城市
                            window.sarea_val_fn = function (e) {
                                return Ext.getCmp(e).getValue();
                            };
                            //显示主推城市
                            firstCity.show();
                        },
                    },
                    bind_product,
                    add_btn,
                    edit_btn,
                    del_btn,
                    {xtype:'button',text:'推荐产品', iconCls: 'button-edit', id: 'tj_id', handler:tj_product, style:'margin-left:5px;margin-top:3px;'},
                ]
            },
            {
                xtype: 'buttongroup',
                title: '查询条件',
                height: 84,
                columns: 3,
                id: 'where-second',
                items: [
                    dateGroup,
                    start_date,
                    end_date,
                    company_box,
                    {text: '查询', width:110, iconCls: 'button-sch', handler: function () { doSearch();},style:'margin-left:5px;margin-top:3px;'},
                ]
            },
            {xtype:'hidden', id:'cur_org_id', value:_uinfo.org_id},
            {xtype:'hidden', id:'pp_first_city', value:''},
            '->',
            {
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:80,
                bodyStyle:'padding:10px',
                items:[{
                    xtype:'trigger',
                    triggerCls:'x-form-search-trigger',
                    id: 'keywords',
                    name: 'keywords',
                    width: 160,
                    emptyText: '活动名称、投放城市',
                    onTriggerClick: function (e) {
                        doSearch();
                    },
                    listeners: {
                        "specialkey": function (_t, _e) {
                            if (_e.keyCode == 13) {
                                doSearch();
                            }
                        }
                    }
                },{
                    icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                    cls: 'x-btn-icon',
                    tooltip: '重载活动',
                    handler:function(){
                        window.location.reload();
                    },
                    style:'margin-left:5px;'
                },{
                    icon: $app_public_images_path + 'delete.gif',
                    cls: 'x-btn-icon',
                    tooltip: '关闭当前页',
                    style:'margin-left:5px;',
                    handler: function () {
                        var main_tab_view = parent.Ext.getCmp('MainTabPanel'); //得到tab组件
                        var tab = main_tab_view.getActiveTab();
                        if (!tab.closable) return;
                        Ext.Msg.confirm('友情提醒', '您真的要关闭“' + tab.title + '”吗？', function (btn) {
                            if (btn == 'yes') {
                                main_tab_view.remove(tab);
                                parent.tab_list_menu.remove(Ext.getCmp('am_' + tab.id));
                            }
                        });
                    }
                }]
            }
        ],
        listeners:{
            rowdblclick:function(grid,row){ //双击
                bindProducts();
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有送票站点信息，快去添加哦'
        })
    });

    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

    //**************************************add page or edit page start
    //基本信息
    var basicInfo = [
        {id: "pp_id", name: "pp_id", hidden: true, allowBlank: true},
        {
            id: "pp_title",
            name: "pp_title",
            labelAlign: 'right',
            fieldLabel: "<font color='red'>*</font> 活动名称",
            width: 300,
            maxLength:10,
            maxLengthText:'最多可输入10个字符',
            style: 'margin-top:5px;',
            enableKeyEvents:true,
            listeners:{
                change: function(t, e){
                    var val = t.getValue();
                    Ext.getCmp('pp_title').setValue(val.substring(0,10));
                    var len = val.length >10 ? 10 : val.length;
                    Ext.getCmp('word_count').setData(len+'/10');
                }
            }
        },{
            xtype: 'label',
            forId: 'word_count',
            id: 'word_count',
            html: '0/20',
            height:24,
            width:40,
            style:'margin-top:5px;margin-left:10px;line-height:24px;align:center;display:inline-block;',
        },{
            xtype: 'label',
            forId: 'preview',
            id: 'preview',
            html: '<a href="javascript:;" id="preview">预览</a>',
            height:24,
            width:40,
            style:'margin-top:5px;margin-left:10px;line-height:24px;align:center;display:inline-block;',
        },{
            xtype: 'label',
            forId: 'pre-text',
            id: 'pre-text',
            html: '',
            height:30,
            width:300,
            style:'margin-left:75px;display:inline-block;line-height:30px;',
        },
        SUNLINE.ExtDateField({
                id: 'pp_start_date',
                name: 'pp_start_date',
                labelAlign: "right",
                fieldLabel: "<font color='red'>*</font> 活动时间:",
                labelWidth: 70,
                labelSeparator: '',
                style: 'margin-top:5px;clear:both;',
                gang: 'pp_end_date',
                width: 180,
                start: true,
            }
        ),
        SUNLINE.ExtDateField({
                id: 'pp_end_date',
                name: 'pp_end_date',
                labelAlign: "right",
                labelWidth: 15,
                style: 'margin-top:5px;',
                fieldLabel: "-&nbsp;",
                labelSeparator: '',
                gang: 'pp_start_date',
                width: 130,
                value: '',
            }
        ),
        SUNLINE.ExtDateField({
                id: 'pp_classes_start_date',
                name: 'pp_classes_start_date',
                labelAlign: "right",
                fieldLabel: "<font color='red'>*</font> 班期时间:",
                labelWidth: 70,
                labelSeparator: '',
                style: 'margin-top:5px;clear:both;',
                gang: 'pp_classes_end_date',
                width: 180,
                start: true,
                value: ''
            }
        ),
        SUNLINE.ExtDateField({
                id: 'pp_classes_end_date',
                name: 'pp_classes_end_date',
                labelAlign: "right",
                labelWidth: 15,
                style: 'margin-top:5px;',
                fieldLabel: "-&nbsp;",
                labelSeparator: '',
                gang: 'pp_classes_start_date',
                width: 130,
                value: ''
            }
        ),
        {
            id: "pp_desc",
            name: "pp_desc",
            labelAlign: 'right',
            fieldLabel: "<font color='red'>&nbsp;</font> 活动描述",
            width: 450,
            allowBlank:true,
            style: 'margin-bottom:15px;margin-top:5px;',
        },
    ];

    //活动规则
    var activityRules = [
        {
            xtype: 'checkboxgroup',
            id: 'pp_pay_type',
            name:'pp_pay_type',
            fieldLabel: "<font color='red'>*</font> 支付类型",
            labelWidth: 70,
            labelAlign: 'right',
            style: 'margin-top:10px;clear:both;',
            width: 230,
            columns: 2,
            vertical: true,
            items: [
                { boxLabel: '在线支付', width:80, id:'onlinePay', name: 'pp_pay_type[]', inputValue: 'onlinePay', checked: true },
                { boxLabel: '信用支付', width:80, id:'creditPay', name: 'pp_pay_type[]', inputValue: 'creditPay', checked: true },
            ]
        },
        {
            xtype: 'checkboxgroup',
            id: 'pp_ticket_type',
            name:'pp_ticket_type',
            fieldLabel: "<font color='red'>*</font> 票价类型",
            labelWidth: 70,
            labelAlign: 'right',
            style: 'margin-top:10px;',
            width: 220,
            columns: 3,
            vertical: true,
            items: [
                { boxLabel: '成人', width:50, id:'adult', name: 'pp_ticket_type', inputValue: 'adult', checked: true },
                { boxLabel: '儿童', width:50, id:'children', name: 'pp_ticket_type', inputValue: 'children',},
                { boxLabel: '套票', width:50, id:'sets', name: 'pp_ticket_type', inputValue: 'sets',},
            ]
        },
        SUNLINE.LocalComob({
            id: 'pp_type',
            fields: ['pp_type', 'pp_type_text'],
            data: [
                {'pp_type': 'percent', 'pp_type_text': '百分比'},
                {'pp_type': 'quota', 'pp_type_text': '定额'},
            ],
            config: {
                id:'pp_type',
                displayField: 'pp_type_text',
                valueField: 'pp_type',
                fieldLabel: "<font color='red'>*</font> 活动类型",
                labelWidth: 70,
                labelAlign: 'right',
                style: 'margin-top:5px;clear:both;',
                width: 200,
                value:'百分比',
                listeners: {
                    select: function (t, record) {
                        var _thisVal = record[0].data.pp_type;
                        setRules(_thisVal,'quotaOrder');
                    },
                    change: function(t,record) {
                        //设置票价类型是否显示？ 选择每人时显示，选择每单时隐藏
                        var bool = record == 'percent' ? false : true;
                        Ext.getCmp('pp_ticket_type').setDisabled( bool );
                    }

                }
            },
        }),
        {
            id: "pp_max_limit",
            name: "pp_max_limit",
            labelAlign: 'right',
            fieldLabel: "<font color='red'>&nbsp;</font> 上限金额",
            width: 250,
            style: 'margin-top:5px;',
            hidden: true,
            allowBlank:true,
            vtype:'money',
        },
        {
            id: 'pp_son_type',
            name: 'pp_son_type',
            fieldLabel: "",
            labelSeparator: '',
            xtype: 'radiogroup',
            margin: '5px 0 0 10px',
            vertical: false,
            hidden: true,
            width: 200,
            items: [
                {boxLabel: '每单', id: 'quotaOrder', name: 'pp_son_type', inputValue: 'quotaOrder', checked: true},
                {boxLabel: '每人', id: 'quotaPerson', name: 'pp_son_type', inputValue: 'quotaPerson'}
            ],
            listeners: {
                change: function (t, record) {
                    //设置票价类型是否显示？ 选择每人时显示，选择每单时隐藏
                    var pp_type = Ext.getCmp('pp_type').getValue();
                    if (pp_type == 'quota') {
                        var b = record.pp_son_type == 'quotaPerson' ? false : true;
                        Ext.getCmp('pp_ticket_type').setDisabled(b);
                    }
                },
            }
        },
        {
            id: "pp_amount",
            name: "pp_amount",
            labelAlign: 'right',
            fieldLabel: "<font color='red'>*</font> 活动金额",
            width: 350,
            style: 'margin-top:5px;margin-bottom:15px;',
            emptyText: '定额优惠金额或百分比的比例（0-100）',
            vtype:'money',
        },
    ];

    //活动范围
    var brand_box = SUNLINE.CompanyBox({
        where: {order_type: 'product_list', org_id: _uinfo.org_id},
        id: 'pp_brand',
        name: 'pp_brand',
        fields: ['cb_id', 'cb_name'],
        url: $__app__ + '/Brand/getBrand',
        config: {
            allowBlank:true,
            displayField: 'cb_name',
            valueField: 'cb_id',
            emptyText: '请选择',
            width: 240,
            value: '',
            pageSize: 0, //不要分页设置
            fieldLabel: '<font color="red">*</font> 产品品牌',
            labelWidth: 70,
            labelAlign: 'right',
            padding: '0 0 0 0',
            listConfig:{
                minWidth:340,
            }
        }
    });

    var activityRange = [
        brand_box,
        {
            fieldLabel: "<font color='red'>*</font> 产品范围", xtype: 'radiogroup', columns: 2, vertical: false,
            items: [
                {boxLabel: '全部产品', id: 'pp_scope_all', name: 'pp_scope', inputValue: 'all', checked: true},
                {boxLabel: '部分参加', id: 'pp_scope_part', name: 'pp_scope', inputValue: ''}
            ],
        },
        {
            id: "pp_apply_city",
            name: "pp_apply_city",
            labelAlign: 'right',
            fieldLabel: "<font color='red'>*</font> 投放城市",
            width: 450,
            allowBlank:false,
            style: 'margin-top:5px;margin-bottom:15px;',
            emptyText: '活动的投放城市',
            listeners: {
                render: function (p) {
                    p.getEl().on('click', function (p) {
                        //处理点击事件代码
                        positionWin.show();
                    });
                },
            }
        }
    ];

    //编辑活动活动面板
    var addForm = Ext.create('Ext.form.FormPanel', {
        bodyPadding: 5,
        id: 'form',
        border: false,
        width: 500,
        cls: 'basic_class',
        bodyStyle: "background:none;",
        defaults: {
            xtype: 'fieldset',
            autoHeight: true,
            defaultType: 'textfield',
            defaults: {allowBlank: false, labelAlign: 'right', labelWidth: 70}
        },
        items: [
            {title: '基本信息', cls: 'tcol2', items: basicInfo},
            {title: '活动规则', cls: 'tcol2', items: activityRules},
            {title: '活动范围', cls: 'tcol2', items: activityRange},
        ],
    });

    /*公司所在地投放城市(start)*/
    var positionWin = SUNLINE.PutCity({
        id: 'pp_apply_city',
        old_val: Ext.getCmp('pp_apply_city').getValue(),
        //url: $__app__ + '/Promotion/putCityJson',
        title: '投放城市'
    }, function (v) {
        Ext.getCmp('pp_apply_city').setValue(v);
    });

    window.sarea_val_fn = function (e) {
        return Ext.getCmp(e).getValue();
    };


    //活动立减‘添加’或‘编辑’
    var promotion = Ext.create('Ext.window.Window', {
        width: 510,
        bodyBorder: true,
        modal: true,
        closeAction: 'hide',
        items: [addForm],
        buttons: [{
            id: 'sub_part',
            text: '保 存',
            handler: function ( _this ) {
                var param = addForm.getForm();
                
                //验证是否为空
                if (!param.isValid()) {
                    var onlinePay = Ext.getCmp('onlinePay').getValue();
                    var creditPay = Ext.getCmp('creditPay').getValue();
                    //adult-成人，children-儿童，sets-套票
                    var adult = Ext.getCmp('adult').getValue();
                    var children = Ext.getCmp('children').getValue();
                    var sets = Ext.getCmp('sets').getValue();
                    if(onlinePay == false && creditPay == false ){
                        return ExtAlert('支付类型是必选项，请选择一个或全选', '提示');
                    }else if( !adult && !children && !sets ){
                        return ExtAlert('票价类型至少选择一个', '提示');
                    }else{
                        return ExtAlert('请在红色边框里面填写正确格式的数据', '提示');
                    }
                };
                //把默认类型中的中文转换成其值
                var data = param.getValues();
                if(data.pp_pay_type == '在线支付'){
                    data.pp_pay_type = 'onlinePay';
                }else if( data.pp_pay_type == '信用支付' ){
                    data.pp_pay_type = 'creditPay';
                }

                if( data.pp_ticket_type instanceof Array  ){
                    data.pp_ticket_type = data.pp_ticket_type.join(',');
                }
                if(data.pp_type == '百分比'){
                    data.pp_type = 'percent';
                }
                //当前所属单位
                var pp_org_id = Ext.getCmp('p_org_name_id').getValue();
                if( pp_org_id == '全部' ){
                    return ExtAlert('请先选择活动所属单位', '提示');
                }else if( _uinfo.org_type == '供应商' ){
                    data.pp_org_id = _uinfo.org_id;
                }else{
                    data.pp_org_id = pp_org_id;
                }

                //判断是否选择品牌信息?
                if( !data.pp_id && !data.pp_brand ){
                    return ExtAlert('产品品牌必须选一个', '提示');
                }
                data.pp_brand = Ext.getCmp('pp_brand_id').getValue();

                console.log( data,'pp_scope:', data.pp_scope);

                Ext.Ajax.request({
                    url: $__app__ + '/promotion/save',
                    params: data,
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (1 == ret.success) {
                            bindProduct.pp_scope = promotion.data.pp_id ? promotion.data.pp_scope : '';

                            positionWin.hide();
                            //重新加载数据
                            store.reload();
                            addForm.reset();
                            promotion.hide();
                            if(_this.text == '保 存' ) {
                                Ext.Msg.alert('信息提示', ret.message);
                            }else{
                                //promotion.data
                                bindProduct.pp_id = ret.pp_id;
                                bindProduct.pp_brand = data.pp_brand;
                                bindProduct.show();
                            }
                        } else {
                            Ext.Msg.alert('信息提示', ret.message);
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '活动保存出错!');
                    }
                });
            }
        }, {
            text: '关 闭',
            handler: function () {
                promotion.hide();
            }
        }]
    });


    promotion.on('show', function(){

        SUNLINE.baseParams(brand_box.getStore(), {order_type: 'product_list', org_id: Ext.getCmp('cur_org_id').getValue()});
        brand_box.getStore().currentPage = 1;
        brand_box.getStore().load();

        if(promotion.data && promotion.data.pp_title ){
            var text = '<span class="pre-title-text">'+promotion.data.pp_title+'</span>';
            Ext.getCmp('pre-text').setData(text);
            Ext.getCmp('pre-text').setStyle({display:'inline-block'});
        }else{
            Ext.getCmp('pre-text').setData('');
            Ext.getCmp('pre-text').setStyle({display:'none'});
        }
        //默认显示支付类型
        if(promotion.data && promotion.data.pp_pay_type  ){
            pay_type = promotion.data.pp_pay_type;
            for(var i=0;i<pay_type.length; i++ ){
                Ext.getCmp(pay_type[i]).setValue(true);
            }
        }
        //默认显示票价类型
        if(promotion.data && promotion.data.pp_ticket_type ){
            var ticket_type = promotion.data.pp_ticket_type;
            for(var i=0; i< ticket_type.length; i++){
                if( ticket_type[i] ){
                    Ext.getCmp( ticket_type[i]).setValue(true);
                }
            }
        }
        //编辑时，产品品牌不可编辑
        if( promotion.data && promotion.data.pp_brand ){
            Ext.getCmp('pp_brand_id').setDisabled(true);
        }else{
            Ext.getCmp('pp_brand_id').setDisabled(false);
        }

        //编辑时，设置radio显示其原来的值
        if(promotion.data && promotion.data.pp_type == 'quota' ){
            Ext.getCmp(promotion.data.pp_son_type).setValue(true);
        }
        if(promotion.data && promotion.data.pp_type == 'quota' ){
            Ext.getCmp(promotion.data.pp_son_type).setValue(true);
        }
        if(promotion.data && promotion.data.pp_scope != 'all'){
            Ext.getCmp('sub_part').setText('下一步');
            Ext.getCmp('pp_scope_part').setValue(true);
            Ext.getCmp('pp_scope_all').setValue(false);
        }else{
            Ext.getCmp('sub_part').setText('保 存');
            Ext.getCmp('pp_scope_part').setValue(false);
            Ext.getCmp('pp_scope_all').setValue(true);
        }
    });

    //部分产品绑定聚焦事件
    Ext.getCmp('pp_scope_part').on('focus',function(){
        Ext.getCmp('sub_part').setText('下一步');
    });
    Ext.getCmp('pp_scope_all').on('focus',function(){
        Ext.getCmp('sub_part').setText('保 存');
    });


    /**
     * 新增或编辑活动
     */
    function editPromotion(obj) {
        //判断单位是否已选择
        var org_id = Ext.getCmp('p_org_name_id').getValue();
        if( org_id == '全部' ){
            return ExtAlert('请先选择活动所属单位!', '友情提示');
        }

        var row = [];
        addForm.reset();
        var pp_type = 'def'; //默认设置规则
        var son_type = '';
        if (obj.id == 'add_id') { //新增
            row.data = [];
            var thisTitle = '新增活动';

        } else if (obj.id == 'edit_id') { //编辑
            row = SUNLINE.getSelected(panel);
            if (!row) {
                return ExtAlert('请选择编辑的活动信息!', '友情提示');
            }
            pp_type = row.data.pp_type;
            son_type = row.data.pp_son_type;
            row.data.pp_amount = row.data.pp_amount.replace('%', '');
            row.data.pp_amount = row.data.pp_amount.replace('￥', '');
            row.data.pp_max_limit = row.data.pp_max_limit.replace('￥', '');
            row.data.pp_max_limit = row.data.pp_max_limit.replace('-', '');

            //重新加载数据和显示旧的数据
            var thisTitle = '编辑活动';
        }
        promotion.setTitle(thisTitle, obj.iconCls);
        promotion.data = row.data;

        addForm.getForm().setValues(row.data);
        setRules(pp_type, son_type);
        promotion.show();
    }

    //删除活动
    function delPromotion(){
        var row = SUNLINE.getSelected(panel);
        if (!row ) {
            return ExtAlert('请选择删除的活动!', '友情提示');
        }
        Ext.MessageBox.confirm('友情提示', '你确定要删除该活动？', function (v) {
            if ('yes' == v) {
                Ext.Ajax.request({
                    url: $__app__ + '/Promotion/del',
                    params: {pp_id: row.data.pp_id},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.success) {
                            Ext.Msg.alert('信息提示', '活动删除成功!');
                            store.reload(); //重新加载数据
                        } else {
                            Ext.Msg.alert('信息提示', '活动删除失败!');
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '活动删除出错!');
                    }
                });
            }
        });
    }

    //设置默认显示规则
    function setRules(_thisVal, sonType) {
        if (_thisVal == 'percent' || _thisVal == 'def') {
            Ext.getCmp('pp_son_type').setHidden(true);   // 每人每单隐藏
            Ext.getCmp('pp_max_limit').setHidden(false);  // 最大上限显示
            Ext.getCmp('pp_amount').setFieldLabel("<font color='red'>*</font> 百分比");
            Ext.getCmp('pp_amount').emptyText = '百分比值：0-100';
            Ext.getCmp('pp_amount').applyEmptyText('百分比值：0-100');
            Ext.getCmp('quotaOrder').setValue(true);
            Ext.getCmp('pp_ticket_type').setDisabled(false);  // 票价类型显示
        } else if (_thisVal == 'quota') {
            Ext.getCmp('pp_max_limit').setHidden(true);   // 最大上限显示
            Ext.getCmp('pp_son_type').setHidden(false);   // 每人每单隐藏
            Ext.getCmp('pp_amount').setFieldLabel("<font color='red'>*</font> 活动金额");
            Ext.getCmp('pp_amount').emptyText = '活动金额';
            Ext.getCmp('pp_amount').applyEmptyText('活动金额');
            if( sonType == 'quotaOrder' ){ //定额每单时
                Ext.getCmp('pp_ticket_type').setDisabled(true);  // 票价类型隐藏
            }else{ //定额每人时
                Ext.getCmp('pp_ticket_type').setDisabled(false);  // 票价类型显示
            }
        }
    }

    /**
     * 搜索活动
     */
    function doSearch(){
        //搜索条件
        var data = {};
        var date_group = Ext.getCmp('date_group').getValue();
        var start_date = Ext.Date.format(Ext.getCmp('start_date').getValue(), 'Ymd');
        var end_date = Ext.Date.format(Ext.getCmp('end_date').getValue(), 'Ymd');
        if( date_group != 'pp_classes_date'){
            data.pp_start_date = start_date;
            data.pp_end_date = end_date;
        }else{
            data.pp_classes_start_date = start_date;
            data.pp_classes_end_date = end_date;
        }
        //活动单位ID和搜索关键词
        var org_id = Ext.getCmp('p_org_name_id').getValue();
        var keywords = Ext.getCmp('keywords').getValue();
        //data.org_id = parseInt(org_id) >= 1 ? parseInt(org_id) : parseInt(_uinfo.org_id);
        if (parseInt(org_id)) {
            data.org_id = parseInt(org_id);
        }
        data.keywords = keywords;

        //重加载store
        SUNLINE.baseParams(store, data);
        store.currentPage = 1;
        store.load();
    }
    //**************************************add page or edit page end

    //******************************************bind product ********************
    var left_url = $__app__ + '/Promotion/getProductList';
    var left_fields = [];
    var left_store = SUNLINE.JsonStore(left_url, left_fields,false, {pageSize:10});
    var right_store = SUNLINE.JsonStore(left_url, left_fields, false, {pageSize:10});
    var tj_store = SUNLINE.JsonStore(left_url, left_fields, false);

    var leftCm = [
        {header: "ID", dataIndex: "p_id",align:'center',hidden:true},
        {header: "产品编号", dataIndex: "p_num",align:'left' ,width:100},
        {header: "产品类型", dataIndex: "p_type", align: 'center',width:80},
        {header: "产品名称", dataIndex: "p_name", align: 'left',width:220}
    ];

    //配置未参加活动产品的面板
    var leftForm = Ext.create('Ext.grid.Panel', {
        store: left_store,
        columns: leftCm,
        border: false,
        selModel: new Ext.selection.CheckboxModel({ mode:'SIMPLE'}),
        width:550,
        height:418,
        viewConfig: {emptyText: '暂无产品！'},
        style:'border-top:1px solid #ccc;',
        tbar:[
            { xtype: 'textfield', labelWidth: 58,labelAlign: 'left',fieldLabel:'产品名称', id: 'p_name', name: 'p_name', width: 280,emptyText: '产品名称'},
            { text: '查询', iconCls: 'button-sch', handler: function () {searchProduct(0);}},
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: left_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有产品信息，快去添加哦'
        })
    });

    //配置未参加活动产品的面板
    var rightForm = Ext.create('Ext.grid.Panel', {
        store: right_store,
        columns: leftCm,
        title:'已参加产品',
        border: false,
        autoScroll: true,
        height: 550,
        selModel: new Ext.selection.CheckboxModel({ mode:'SIMPLE'}),
        viewConfig: {emptyText: '暂无产品！'},
    });


    //活动立减添加或编辑
    var bindProduct = Ext.create('Ext.window.Window', {
        width:970,
        height:550,
        bodyBorder: true,
        layout: 'border',
        viewModel: true,
        modal: true,
        title: '绑定产品',
        closeAction: 'hide',
        items:[{
            region: 'west',
            autoScroll: true,
            title: '未参加产品',
            width: 470,
            cls : 'not_join_product',
            items:[leftForm]
        }, {
            region: 'center',
            activeTab: 0,
            cls : 'move_product',
            html:'<div class="but-id">' +
            '<span class="but-in"><img src="/img/move_right.png"/></span>' +
            '<span class="but-out"><img src="/img/move_left.png"/></span>' +
            '</div>',
            style:'border-top:1px solid #ccc;border-bottom:1px solid #ccc',
        },{
            region: 'east',
            width: 450,
            cls : 'al_join_product',
            items:[rightForm],
            emptyText:'暂无产品',
        }],
        buttons: [{
            id: 'bind_product_save',
            text: '保存产品',
            handler: function () {
                var pid = [];
                right_store.each(function(record){
                    pid.push(record.get('p_id')) ;
                });
                if( pid.length < 1 ){
                    return Ext.Msg.alert('信息提示', '已参加产品至少有一个!');
                }
                pid = pid.join(','); //产品ID字符串

                Ext.Ajax.request({
                    url: $__app__ + '/Promotion/updateProducts',
                    params: {pid: pid, pp_id:bindProduct.pp_id},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.success) {
                            Ext.Msg.alert('信息提示', '产品保存成功!');
                            left_store.reload();
                            right_store.reload();
                            bindProduct.hide();
                            store.reload(); //重新加载数据
                        } else {
                            Ext.Msg.alert('信息提示', '产品保存失败!');
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '产品保存出错!');
                    }
                });

            }
        }, {
            text: '关闭',
            handler: function () {
                bindProduct.hide();
            }
        }]
    });

    bindProduct.on('show', function(){
        var pp_scope = bindProduct.pp_scope;
        var pp_brand = bindProduct.pp_brand;
        var pp_org_id = bindProduct.pp_org_id;
        //显示产品绑定界面，产品类型不可能是全部，传值错误？？？
        pp_scope = pp_scope == 'all' ? '' : pp_scope;
        console.log('pp_brand:',pp_brand,'pp_scope:', pp_scope);

        //重加载left_store**********************
        Ext.getCmp('p_name').setValue('');
        SUNLINE.baseParams(left_store, {status:0, pp_brand:pp_brand, pp_org_id:pp_org_id, pp_scope:pp_scope});
        left_store.currentPage = 1;
        left_store.load();

        //重加载right_store**********************
        SUNLINE.baseParams(right_store, {status:1, pp_brand:pp_brand, pp_org_id:pp_org_id, pp_scope:pp_scope});
        right_store.currentPage = 1;
        right_store.load({
            callback:function(){
                var total = right_store.getCount();
                rightForm.setTitle('已参加产品('+total+')');
            }
        });
    });

    //绑定产品
    function bindProducts(){
        var row = SUNLINE.getSelected(panel);
        if (!row) {
            return ExtAlert('请先选择活动信息!', '友情提示');
        }else if( row.data.pp_scope == 'all' ){
            return ExtAlert('活动的产品范围是全产品，不能更改!', '友情提示');
        }
        bindProduct.pp_scope = row.data.pp_scope;
        bindProduct.pp_id = row.data.pp_id;
        bindProduct.pp_org_id = row.data.pp_org_id;
        bindProduct.pp_brand = row.data.pp_brand;
        bindProduct.show();
    }

    //绑定产品中未参加活动产品搜索
    function searchProduct( status ){
        var params = {};

        if( status == 0 ){ //未参加活动产品搜索
            var new_store = left_store;
            var p_name = Ext.getCmp('p_name').getValue();
            //参数
            params.status = 0;
            params.pp_scope = bindProduct.pp_scope;
            params.pp_brand = bindProduct.pp_brand;
            params.pp_org_id = bindProduct.pp_org_id;
            params.p_name = p_name;
        }else if( status == 2 ){ //推荐产品搜索
            var new_store = tj_store;
            var p_name = Ext.getCmp('search_key').getValue();
            //参数
            params.status = 2;
            params.pp_scope = tj_win.data.pp_scope;
            params.pp_brand = tj_win.data.pp_brand;
            params.pp_org_id = tj_win.data.pp_org_id;
            params.pp_tj_pid = tj_win.data.pp_tj_pid;
            params.p_name = p_name;
        }

        //重加载left_store
        SUNLINE.baseParams(new_store, params);
        new_store.currentPage = 1;
        if(status == 2){
            new_store.load({
                callback: function (records, operation, success) {
                    //获取grid的复选框对象
                    var selMod = tj_form.getSelectionModel();
                    var selModItems = selMod.store.data.items;
                    console.log(selModItems);
                    for (var i in selModItems) {
                        if ( i != 'remove' && selModItems[i].get('sel_num') > 0 ) {
                            selMod.select(parseInt(i), true, false);
                        }
                    }
                }
            });
        }else{
            new_store.load();
        }

    }

    //Jquery方法
    $(function(){
        if( _uinfo.org_type == '供应商' || _uinfo.org_type == '管理公司'){
            //加入参加活动的产品
            $(".but-in").live('click', function(){
                var data = SUNLINE.getSelected(leftForm,true);
                Ext.each(data,function(t){
                    right_store.add(t);
                    left_store.remove(t);
                    //重新计算已参加产品
                    var total = right_store.getCount();
                    rightForm.setTitle('已参加产品('+total+')');
                });
            });
            //移除活动中产品
            $(".but-out").live('click', function(){
                var data = SUNLINE.getSelected(rightForm,true);
                Ext.each(data,function(t){
                    left_store.add(t);
                    right_store.remove(t);
                    //重新计算已参加产品
                    var total = right_store.getCount();
                    rightForm.setTitle('已参加产品('+total+')');
                });
            });
        }

        //预览标题
        $("#preview").live('click', function(){
            var pp_title = $('input[name="pp_title"]').val();
            if( pp_title ){
                var text = '<span class="pre-title-text">'+pp_title+'</span>';
                Ext.getCmp('pre-text').setData(text);
                Ext.getCmp('pre-text').setStyle({display:'inline-block'});
            }else {
                Ext.getCmp('pre-text').setData('');
                Ext.getCmp('pre-text').setStyle({display:'none'});
            }
        });
    });

    //推荐cm
    var tjCm = [
        {header: "产品ID", dataIndex: "p_id",align:'center',align:'center',width:100,hidden:true},
        {header: "产品编号", dataIndex: "p_num",align:'left' ,width:100},
        {header: "产品类型", dataIndex: "p_type", align: 'center',width:80},
        {header: "产品名称", dataIndex: "p_name", align: 'left',width:280}
    ];

    //配置未参加活动产品的面板
    //推荐产品---表单
    var tj_form = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: tj_store,
        columns: tjCm,
        border: false,
        selModel: new Ext.selection.CheckboxModel({ mode:'SIMPLE'}),
        multiSelect: true, //多选行，按下ctrl键
        width:520,
        height:430,
        tbar:[
            {
                xtype: 'textfield',
                labelWidth: 48,
                labelAlign: 'left',
                fieldLabel: '关键词',
                id: 'search_key',
                name: 'search_key',
                width: 280,
                emptyText: '产品编号、产品名称',
                listeners: {
                    "specialkey": function (_t, _e) {
                        if (_e.keyCode == 13) {
                            searchProduct(2)
                        }
                    }
                }
            },
            { text: '查询', iconCls: 'button-sch', handler: function () {searchProduct(2);}},
        ],
        viewConfig: {emptyText: '暂无绑定活动产品！'},
    });

    //推荐产品---窗口
    var tj_win = Ext.create('Ext.window.Window', {
        bodyBorder: true,
        modal: true,
        closeAction: 'hide',
        items: [tj_form],
        buttons: [{
            text: '提交',
            handler: function () {
                var tj_pid = [];
                var row = SUNLINE.getSelected(tj_form, true);
                Ext.each(row, function(record){
                    tj_pid.push(record.get('p_id'));
                });

                if( tj_pid.length <1 ){
                    return ExtAlert('至少要选择一个产品!', '友情提示');
                }else{
                    var pp_id = tj_win.data.pp_id; //活动ID
                    tj_pid = tj_pid.join(',');
                    //保存推荐产品
                    Ext.Ajax.request({
                        url: $__app__ + '/Promotion/setTjProduct',
                        params: {pp_id: pp_id, tj_pid: tj_pid},
                        method: 'POST',
                        success: function (response, otps) {
                            var ret = Ext.decode(response.responseText);
                            if (ret.success) {
                                Ext.Msg.alert('信息提示', '产品推荐成功!');
                                store.reload();
                                tj_win.hide();
                            } else {
                                Ext.Msg.alert('信息提示', '产品推荐失败!');
                            }
                        },
                        failure: function (response, otps) {
                            Ext.Msg.alert('信息提示', '产品推荐出错!');
                        }
                    });
                }
            }
        },{
            text: '取消',
            handler: function () {
                tj_win.hide();
            }
        }]
    });

    //打开界面时，执行方法
    tj_win.on('show', function(){
        var pp_brand = tj_win.data.pp_brand; //品牌ID
        var pp_org_id = tj_win.data.pp_org_id; //单位ID
        var pp_scope = tj_win.data.pp_scope;
        var pp_tj_pid = tj_win.data.pp_tj_pid; //原推荐产品ID字符串（以，分隔）

        //重载要推荐的产品（就是已绑定的产品）
        SUNLINE.baseParams(tj_store, {status:2, pp_brand:pp_brand, pp_scope:pp_scope, pp_org_id: pp_org_id,pp_tj_pid:pp_tj_pid});
        tj_store.load({
            callback: function (records, operation, success) {
                //获取grid的复选框对象
                var selMod = tj_form.getSelectionModel();
                var selModItems = selMod.store.data.items;
                for (var i in selModItems) {
                    if ( i != 'remove' && selModItems[i].get('sel_num') > 0 ) {
                        selMod.select(parseInt(i), true, false);
                    }
                }
            }
        });
    });


    //推荐产品----打开推荐产品界面
    function tj_product(){
        row = SUNLINE.getSelected(panel);
        if (!row) {
            return ExtAlert('请选择要推荐的活动!', '友情提示');
        }
        tj_win.data = row.data;
        tj_win.setTitle('推荐产品 - '+row.data.pp_title );
        tj_win.show();
    }

    //******************************************bind product ********************

    //注入日志处理流程
    ziyo_log({listeners: [{grid: panel, action: 'Promotion', table: 'ProductsPromotion', pk_id: 'pp_id'}]});
});


