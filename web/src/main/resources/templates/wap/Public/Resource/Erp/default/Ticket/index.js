/**
 * Created by zsl on 2017/1/15.
 */
PRODUCTS = {}; TICKET = {}; TICKETLIMITS = {}; OBJTYPE = ""; MTYPE = ""; R_GRID = {};
//var helpStr = '<span style="color: red;">程序自动判断“成人”“儿童”的最低报价填充到相应产品的日历显示数据中。</span>';
var helpStr = '';
var t_room_data = [[1,'房源充足，可自由选择'],[2,'不能选房，只能拼房'],[3,'必须补房差']];
var curd_click_btn = 0;
var select_org_id = _uinfo.org_id;
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '票价管理';
    function t_room(v){
        for (var i=0; i<t_room_data.length; i++){
            if (v==t_room_data[i][0]) return t_room_data[i][1];
        };
        return '***';
    };
    function t_store(v){
        if (v==-1){ v = '无限制'; };
        return v;
    };
    function site_name_rule_fn(v){
        return '<span data-qtip="'+v+'">'+v+'</span>';
    }
    function site_name_rule_fn_2(v){
        if(!v)return '<font color="green">0站点</font>';
        var site= v.split(',');
        var len=site.length;
        return '<font color="green" data-qtip="'+v+'">'+len+'站点</font>';
    }
    function limit_condition_fn(v){
        if(!v || v==' ')return '无';
        return v;
    }
    function status_fn(v){
        if(v=='无效')return '<font color="red">无效</font>';
        return '<font color="green">有效</font>';
    }
    function standards_name(v,m,r){
        var str = '';
        if(r.data.t_default == 1){
            str += '<span style="color: red;" qtip="默认价格">显 </span>'
        }
        str += r.data.t_standards_name;
        return str;
    }

    function isPackageTicket(td){  // 判断套票，是返回true
        if (!td) return false;
        var d = Ext.decode(td);
        if (!d){
            return false;
        };
        return true;
    };

    function salesStatus(v, m, r){
        var sg = r.data.t_single , t1=t2=['#ccc','非'];
        if (sg=='1') t1 = ['green',''];
        if (v=='有效') t2 = ['blue',''];
        var tmp='<span style="color:'+t2[0]+';" qtip="'+t2[1]+'有效票价">效</span>';
        tmp += '<span style="color:'+t1[0]+';" qtip="'+t1[1]+'独立销售">独</span>';
        if (isPackageTicket(r.data.t_detail)){
            tmp += '<span style="color: #999;" qtip="套票">套</span>';
        }
        return tmp;
    };

    var _cm = [
        new Ext.grid.RowNumberer({
            width　:　50,
            align:"center"
            }), //行号
        {header:"ID",dataIndex:"t_id",width:50,hidden:true,align:'right'},
        {header:"状态",dataIndex:"t_status",width:50,renderer:status_fn},
        {header:"适用站点",dataIndex:"t_site_name_rule",width:80,renderer:site_name_rule_fn_2},
        {header:"票价名称",dataIndex:"t_standards_name",width:100,renderer:standards_name},
        {header:"类型",dataIndex:"t_preset_type",width:60},
        {header:"门市价",dataIndex:"t_price",width:90,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"同行价",dataIndex:"t_trade_price",width:90,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"补房差",dataIndex:"t_spread_price",width:90,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        {header:"退房差",dataIndex:"t_out_room_price",width:90,align:'right',editor:new Ext.form.NumberField({selectOnFocus:true}), sortable:true,renderer:money},
        /*{header:"排序",dataIndex:"t_order",width:60, align:'center', editor:new Ext.form.NumberField()},*/
        {header:"周几有效",dataIndex:"t_weekly",width:130,renderer:SUNLINE.weekRenderer},
        /*{header:"是否返利",dataIndex:"t_rebate",width:60},*/
        {header:"票价类目",dataIndex:"t_room_groups",width:80,renderer:limit_condition_fn},
        {header:"交通类目",dataIndex:"t_groups",width:80,renderer:limit_condition_fn},
        {header:"限制类型",dataIndex:"t_limit_type",width:80},
        {header:"限制条件",dataIndex:"t_limit_condition",width:80,renderer:limit_condition_fn},
        //{header:'适用站点',dataIndex:"t_site_name_rule",width:120,renderer:site_name_rule_fn},
        {header:'始发站',dataIndex:"t_start_site",width:100,renderer:site_name_rule_fn},
        {header:"库存量",dataIndex:"t_store",width:80,tooltip:'-1为不限制',editor:new Ext.form.NumberField({selectOnFocus:true}),renderer:t_store}
        /*{header:"拼房选项",dataIndex:"t_room",width:150,renderer:t_room},*/
        /*{header:"编辑时间",dataIndex:"t_time",width:150}*/
    ];
    var _url = $__app__ + '/Ticket/dataJson';
    var _field = [
        "t_id","t_name","t_product_id","t_site_name","t_site_name_rule","t_preset_type","t_detail","t_price","t_trade_price",
        "t_agency_price","t_spread_price","t_web_price","t_web_show","t_time","t_discount","t_pym",
        "t_weekly","t_rebate","t_bind","t_limit_type","t_limit_condition","t_single","t_order",
        "t_remark","t_contain","t_uncontain","t_status","t_room","t_store","t_seat"
    ];
    var _store = SUNLINE.JsonStore(_url, _field, false);
    var _grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},//导入时显示loading
        store: _store,//数据源
        columns: _cm,//表格列定义
        style : 'border-bottom-width:1px;',
        viewConfig : {emptyText: '暂无票价信息。'},
        selModel:{ selType: 'checkboxmodel' },
        tbar:[
            {text:'添加',id:'detail_add',iconCls:'button-add',handler:_modify,disabled:isDisabled('Ticket::add'),xtype:'splitbutton',
                menu:{
                    items:[{text:'添加套票',iconCls:'button-add',handler:_packageTicket,disabled:isDisabled('Ticket::add_season') }]
                }
            },
            {text:'批量添加',id:'batch_add',handler:_modify,disabled:isDisabled('Ticket::add')},
            '-',
            {text:'编辑',id:'detail_edit',iconCls:'button-edit',handler:_modify,disabled:isDisabled('Ticket::edit')},'-',
            {text:'删除',iconCls:'button-del',handler:_del,disabled:isDisabled('Ticket::del')},'-',
            {text:'刷新',iconCls:'button-ref',handler:function(){
                _store.load()
            }},'-',
            {text:'设为无效',iconCls:'button-dropyes',id:'setStatusBtn',handler:setStatus,disabled:isDisabled('Ticket::dropyes')},//'-',
            '-',
            {text:'设为默认价格',id:'button-default',handler:setDefault},
            '-',
            {text:'绑到班期',id:'button-bus',handler:bindBus},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'_Search',
                emptyText : '票价名称、拼音简码等',
                width:220,
                onTriggerClick:function(e){
                    _Search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            _Search();
                    }
                }
            },'-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            },
            {
                icon: $app_public_images_path + 'close.gif',
                cls: 'x-btn-icon',
                tooltip: getCloseQtip(thisTitle),
                handler:function(){ parent.CloseTab(); }
            }
        ],

        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: helpStr + '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: helpStr + '没有数据'
        }),
        listeners:{
            afteredit : function(g){
                var pdrow = g.record, t_id=pdrow.get('t_id');
                var url = $__app__ + '/Ticket/ajaxModify';
                var jsonParams={};
                jsonParams[g.field] = g.value;
                jsonParams['t_id'] = t_id;
                ajaxModify(jsonParams, url, pdrow);
            }
        }
    });

    _grid.getSelectionModel().on('selectionchange', function(sm,record){
        var rows = SUNLINE.getSelected(_grid, true);
        if(rows.length > 1){
            Ext.getCmp("detail_edit").setDisabled(true);
            Ext.getCmp("setStatusBtn").setDisabled(true);
            Ext.getCmp("ziyo_log_btn").setDisabled(true);
            Ext.getCmp("button-default").setDisabled(true);
            Ext.getCmp("button-bus").setDisabled(true);
        }else{
            Ext.getCmp("detail_edit").setDisabled(false);
            Ext.getCmp("setStatusBtn").setDisabled(false);
            Ext.getCmp("ziyo_log_btn").setDisabled(false);
            Ext.getCmp("button-default").setDisabled(false);
            Ext.getCmp("button-bus").setDisabled(false);
        }
    });

    function _Search(){
        if (PRODUCTS){
            SUNLINE.baseParams(_store,{skey:Ext.getCmp('_Search').getValue()},true);
            _store.load();
        }else{
            Ext.Msg.alert('友情提示', '请先选择您要查询的产品信息。');
        }
    };

    var _p_grid = SUNLINE.ProductsGrid('select', 10);
    _p_grid.getSelectionModel().on('select', function( sm, rowIndex, record ){
        var row=rowIndex.data;
        SUNLINE.baseParams(_store,{t_product_id:row.p_id});
        _store.load();
    });

    /*单位操作(start)*/
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:380,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var product_config={
        layout : 'border',
        region : 'west',
        split : true,
        style : 'border-right-width:1px;',
        width : 450,
        maxWidth : 460,
        minWidth : 380,
        items:[_p_grid]
    };
    if(_uinfo.org_type=='管理公司')product_config.tbar=[ company_box ];
    var product_select = product_config;
    company_box.on({
        select:function(c,r){
            var row=r[0].data;
            select_org_id = row.id;
            SUNLINE.baseParams(_p_grid.store,{p_org_id:row.id});
            _p_grid.store.load();
        }
    });
    /*单位操作(end)*/

    /*添加票价窗口(start)*/
    //票价类型.单票
    var preset_type=SUNLINE.LocalComob({
        id:'t_preset_type',
        fields:['t_preset_type'],
        data:[['成人票'],['儿童票']],
        config:{
            fieldLabel:'<span style="color:red"> * </span>票价类型',
            allowBlank:false,
            id:'t_preset_type',
            name:'t_preset_type',
            labelWidth:80,
            labelAlign:'right',
            width:260,
            value:'成人票'
        }
    });
    //票价类型.套票
    var preset_type2=SUNLINE.LocalComob({
        id:'t_preset_type2',
        fields:['t_preset_type2'],
        data:['套票'],
        config:{
            fieldLabel:'<span style="color:red"> * </span>票价类型',
            allowBlank:false,
            id:'t_preset_type2',
            name:'t_preset_type',
            labelWidth:80,
            labelAlign:'right',
            width:260,
            value:'套票',
            readOnly:true
        }
    });
    //preset_type.on({
    //    select:function(c,r){
    //        var row=r[0].data;
    //        if(row.t_preset_type=='儿童票'){
    //            Ext.getCmp('t_out_room_price').setReadOnly(true);
    //        }else{
    //            Ext.getCmp('t_out_room_price').setReadOnly(false);
    //        }
    //    }
    //});
    //票价名字.单票
    var standards_name=SUNLINE.DictComBox({
        id:"t_standards_name",
        name:"t_standards_name",
        fieldLabel:'<span style="color:red"> * </span>票价名称',
        labelWidth:80,
        displayField:"d_text",
        valueField:"d_text",
        allowBlank:false,
        maxLength: 20,
        maxLengthText: '最多允许输入20个字符',
        labelAlign:'right',
        forceSelection:false,
        width:260
    },{d_type:"票价名称"});
    //票价名字.套票
    var standards_name2=SUNLINE.DictComBox({
        id:"t_standards_name2",
        name:"t_standards_name",
        fieldLabel:'<span style="color:red"> * </span>票价名称',
        labelWidth:80,
        displayField:"d_text",
        valueField:"d_text",
        allowBlank:false,
        maxLength: 20,
        labelAlign:'right',
        forceSelection:false,
        width:260
    },{d_type:"票价名称"});
    //限制类型.单票
    var limit_type=SUNLINE.DictComBox({
        id:"t_limit_type",
        name:"t_limit_type",
        fieldLabel:'限制类型',
        labelWidth:80,
        width:260,
        displayField:"d_text",
        valueField:"d_text",
        editable:false,
        forceSelection:false,
        labelAlign:'right'
    },{d_type:"限制类型"});


    //票价类目.单票
    var one_type=SUNLINE.DictComBox({
        id:"t_room_groups",
        name:"t_room_groups",
        fieldLabel:'票价类目',
        labelWidth:80,
        width:260,
        maxLength: 20,
        maxLengthText: '最多允许输入20个字符',
        displayField:"d_text",
        valueField:"d_text",
        forceSelection:false,
        labelAlign:'right'
    },{d_type:"票价类目"});

    //票价类目.套票
    var one_type2=SUNLINE.DictComBox({
        id:"t_room_groups2",
        name:"t_room_groups",
        fieldLabel:'票价类目',
        labelWidth:80,
        width:260,
        displayField:"d_text",
        valueField:"d_text",
        forceSelection:false,
        labelAlign:'right'
    },{d_type:"票价类目"});
    //交通类目.单票
    var two_type=SUNLINE.DictComBox({
        fieldLabel:'<span style="color:red"> * </span>交通类目',
        id:"t_groups",
        name:"t_groups",
        labelWidth:80,
        allowBlank:false,
        width:260,
        forceSelection:false,
        displayField:"d_text",
        valueField:"d_text",
        labelAlign:'right'
    },{d_type:"交通类目"});



    //周几有效.单票
    var weekly_list= SUNLINE.weekCheckboxGroup({
        width:400,
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'t_weekly',
        config:{id:'t_weekly',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false}
    });

    //周几有效.套票
    var weekly_list2= SUNLINE.weekCheckboxGroup({
        itemwidth:80,
        width:400,
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'package_week',
        config:{id:'package_week',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false}
    });

    //限制条件.单票
    var _t_limit_condition = new Ext.form.TextField({labelWidth:80,labelAlign:"right",id:"t_limit_condition",name:"t_limit_condition",fieldLabel:"限制条件",readOnly:true});

    //投放市场.单票
    var _t_site_name_rule = new Ext.form.TextField({labelWidth:80,labelAlign:"right",id:"t_site_name_rule",name:"t_site_name_rule",width:780,
        fieldLabel:'<span style="color:red"> * </span>投放市场',allowBlank:false});
    //投放市场.套票
    var _t_site_name_rule2 = new Ext.form.TextField({labelWidth:80,labelAlign:"right",id:"t_site_name_rule2",name:"t_site_name_rule",width:780,
        fieldLabel:'<span style="color:red"> * </span>投放市场',allowBlank:false});


    // var _t_start_site = new Ext.form.TextField({labelWidth:80,labelAlign:"right",id:"t_start_site",name:"t_start_site",width:780,
    //     fieldLabel:'始发站'});
    var _t_start_site = SUNLINE.ComBoxPlus({
        id:'t_start_site',
        name:'t_start_site',
        fields:['sd_id','sd_name'],
        url:$__app__+'/StationStart/get_start_site',
        where:{},
        config:{
            fieldLabel:"始发站",
            labelWidth:80,
            labelAlign:"right",
            displayField:'sd_name',
            valueField:'sd_name',
            forceSelection:false,
            width:780,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item"><span style="float:right;color:blue;">{sd_province}-{sd_city}-{sd_county}</span>{sd_name}</li>',
                '</tpl></ul>'
            ),
            multiSelect: true,
            value:'',
            pageSize:20,
        },type:'Tag'
    });
    _t_start_site.on({
        'beforequery':function(c,r,o) {
            var t_groups=Ext.getCmp('t_groups').getValue();
            if(!t_groups){
                Ext.Msg.alert('友情提示','请选择【交通类目】再选择【始发站】!');
                return false;
            }
            var _p_row = SUNLINE.getSelected(_p_grid);
            var store = _t_start_site.getStore();
            var old_t = store.proxy.extraParams.t_groups;
            SUNLINE.baseParams(store,{t_groups:t_groups,org_id:select_org_id,p_type:_p_row.data.p_type});
            if(c.query == ''){
                store.load();
            }
        }
    });

    var _t_start_site_b = SUNLINE.ComBoxPlus({
        id:'t_start_site_b',
        name:'t_start_site',
        fields:['sd_id','sd_name'],
        url:$__app__+'/StationStart/get_start_site',
        where:{},
        config:{
            fieldLabel:"",
            labelWidth:80,
            labelAlign:"right",
            displayField:'sd_name',
            valueField:'sd_name',
            width:780,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item"><span style="float:right;color:blue;">{sd_province}-{sd_city}-{sd_county}</span>{sd_name}</li>',
                '</tpl></ul>'
            ),
            multiSelect: true,
            value:'',
            pageSize:20,
        },type:'Tag'
    });
    _t_start_site_b.on({
        'beforequery':function(c,r,o) {
            var cur_row = batch_grid.getSelectionModel().getSelection();
            cur_row = (cur_row.length > 1) ? cur_row[1] : cur_row[0];
            if(!cur_row.data.t_groups){
                Ext.Msg.alert('友情提示','请选择【交通类目】再选择【始发站】!');
                return false;
            }
            var _p_row = SUNLINE.getSelected(_p_grid);
            var store = _t_start_site_b.getStore();
            var old_t = store.proxy.extraParams.t_groups;
            SUNLINE.baseParams(store,{t_groups:cur_row.data.t_groups,org_id:select_org_id,p_type:_p_row.data.p_type});
            if(c.query == ''){
                store.load();
            }
        }
    });

    //限制条件触发.单票
    limit_type.box.on('collapse', function(_t){
        var tv = _t.getValue();
        if(tv=='限制性别'){
            _t_limit_condition.setReadOnly(false);
            _t_limit_condition.allowBlank = false;
            _t_limit_condition.regex=/^男$|^女$/;
            _t_limit_condition.regexText ='只能输入男或女，请注意前后的空格。';
        }else if( tv=='限制年龄'){
            _t_limit_condition.setReadOnly(false);
            _t_limit_condition.allowBlank=false;
            _t_limit_condition.regex =/^<+?[1-9][0-9]*$|^>+?[1-9][0-9]*$|^\d+-[1-9][0-9]*$/;
            _t_limit_condition.regexText ='只能输入“<正整数 或 >正整数 或 正整数-正整数”，如<10、>10、10-20等';
        }else{
            _t_limit_condition.setReadOnly(true);
            _t_limit_condition.setValue( '' );
            _t_limit_condition.allowBlank=true;
            _t_limit_condition.regex = '';
            _t_limit_condition.regexText = '';
        }
    });



    var _form = new Ext.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items : [
            {
                cls:'tcol3',
                defaults:{xtype:'textfield',labelWidth:80,width:260,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:"t_id",name:"t_id",fieldLabel:"ID",allowBlank:false,xtype:"hidden"},
                    {id:"t_product_id",name:"t_product_id",fieldLabel:"ID",allowBlank:false,xtype:"hidden"},
                    preset_type,standards_name.box,limit_type.box,
                    {id:'t_site_name',name:'t_site_name',xtype:'hidden'},
                    one_type.box,
                    two_type.box,
                    _t_limit_condition,
                    {id:"t_price",name:"t_price",fieldLabel:'<span style="color:red"> * </span>门市价',maxLength:"11",allowBlank:false,regex:/^[0-9]\d*(\.\d+)?$/,regexText:'只能输入大于等于0的数字',xtype:'numberfield'},
                    {id:"t_trade_price",name:"t_trade_price",fieldLabel:'<span style="color:red"> * </span>同行价',maxLength:"11",allowBlank:false,regex:/^[0-9]\d*(\.\d+)?$/,regexText:'只能输入大于等于0的数字',xtype:'numberfield',
                        listeners:{'blur':function(t, n, o){
                            var a = Ext.getCmp('t_agency_price'), ap=a.getValue(),trade=Ext.getCmp('t_trade_price').getValue();
                            if (ap == 0 || ap == '' || !ap){
                                a.setValue(trade);
                            }
                        }}
                    },
                    {id:'t_store',name:'t_store',fieldLabel:'<span class="help" data-qtip="该库存量是每天的上限，-1为不限制。">&nbsp;</span>库存量',xtype:'numberfield', value:-1},
                    {id:"t_spread_price",name:"t_spread_price",fieldLabel:"补房差",regex:/^\+?[0-9]*$/,regexText:'只能输入正整数',xtype:'numberfield',listeners:{
                        /*
                        blur:function(){
                            var out_room_id=Ext.getCmp('t_out_room_price'),out_room=out_room_id.getValue(),out_room_price=Ext.getCmp('t_spread_price').getValue();
                            if (out_room == 0 || out_room == '' || !out_room){
                                out_room_id.setValue(out_room_price);
                            }
                        }
                        */
                    }},
                    {id:"t_out_room_price",name:"t_out_room_price",fieldLabel:"退房差",regex:/^\+?[0-9]*$/,regexText:'只能输入正整数',xtype:'numberfield'}
                ]
            },
            weekly_list,
            _t_site_name_rule,
            _t_start_site,
            {xtype:'textarea',id:'t_remark', name:'t_remark',width:780,labelWidth:80, height:80, fieldLabel:'票价简介',labelAlign:"right"}
        ]
    });
    /** 套票管理相关代码开始 */
    var _packageWin, _packageCm, _packageStore, _packageGrid,b;


    var __url = $__app__ + '/Ticket/ticketJson';
    _packageStore = SUNLINE.JsonStore(__url,_field,false);


    var _packageTicketForm = new Ext.FormPanel({
        region : 'north',
        layout:'column',
        border:false,
        autoHeight : true,
        style : 'border-bottom-width:1px;',
        bodyStyle : 'background:none;padding-bottom:2px;',
        items:[
            {
                columnWidth:1,
                items : [
                    {
                        cls:'tcol3',
                        defaults:{xtype:'textfield',labelWidth:80,width:260,labelAlign:"right",style:'margin-top:5px;'},
                        items:[
                            new Ext.form.Hidden({name:'t_id'}),
                            preset_type2,
                            standards_name2.box,
                            {id:'t_site_pname2',name:'t_site_pname',xtype:'hidden'},
                            one_type2.box,
                            {id:"t_p_price2",name:"t_price",fieldLabel:'<span style="color:red"> * </span>门市价',maxLength:"11",allowBlank:false,xtype:'numberfield'},
                            {id:"t_trade_p_price2",name:"t_trade_price",fieldLabel:'<span style="color:red"> * </span>同行价',maxLength:"11",allowBlank:false,xtype:'numberfield'},
                            {id:'t_store2',name:'t_store',fieldLabel:'<span class="help" data-qtip="该库存量是每天的上限，-1为不限制。">&nbsp;</span>库存量',xtype:'numberfield', value:-1}
                        ]
                    },
                    weekly_list2,
                    _t_site_name_rule2,
                    {xtype:'textarea',id:'t_remark2', name:'t_remark',width:780,labelWidth:80, height:80, fieldLabel:'票价简介',labelAlign:"right"}
                ]
            }
        ]
    });

    //套票管理界面

        _packageCm = [
            new Ext.grid.RowNumberer(), //行号
            {header:"ID",dataIndex:"t_id",width:50,hidden:true,align:'right'},
            {header:"状态",dataIndex:"t_status",width:55,align:'center',renderer:salesStatus},
            {header:"票价名称",dataIndex:"t_standards_name",width:100},
            {header:"<span style='color: red;'>占座数量</span>",dataIndex:"t_seat",width:80,editor:new Ext.form.NumberField({selectOnFocus:true,allowDecimals:false})},
            {header:"门市价",dataIndex:"t_price",width:80,align:'right',sortable:true},
            {header:"同行价",dataIndex:"t_trade_price",width:80,align:'right',sortable:true},
            {header:"周几有效",dataIndex:"t_weekly",width:120,renderer:SUNLINE.weekRenderer},
            {header:"限制类型",dataIndex:"t_limit_type",width:80},
            {header:"限制条件",dataIndex:"t_limit_condition",width:80},
            {header:"编辑时间",dataIndex:"t_time",width:150}
        ];

        _packageGrid = new Ext.grid.Panel({
            region : 'center',
            //clicksToEdit:1,
            border:false,//无边框
            loadMask: {msg : '数据传输中，请稍候...'},//导入时显示loading
            columns : _packageCm,
            store : _packageStore,
            autoScroll:true,
            viewConfig : {emptyText: '暂无票价信息。'},
            selModel:{
                selType: 'checkboxmodel',
                mode:'SIMPLE'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            tbar:[
                {text:'添加单票',iconCls:'button-add',handler:_package_Ticket_Itmes},
                "-",
                {text:'移除单票',iconCls:'button-del',handler:_package_Ticket_Itmes_remove}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: pageSize,
                store: _packageStore,
                displayInfo: true,
                displayMsg: '第{0} 到 {1} 条数据 共{2}条',
                emptyMsg: '没有数据'
            })
        });

        _packageWin = new Ext.Window({
            title: '套票管理',
            width:810,
            layout : 'border',
            height:570,
            modal:true,
            resizeHandles:'s',
            closeAction:'hide',
            items : [_packageTicketForm, _packageGrid],
            buttons : [
                {text : '保存', handler:doPackageSubmit},
                {text : '取消', handler:function(){_packageWin.hide();}}
            ]
        });
    //票价加载时 对之前已选的票价进行选中

    _packageWin.on({
        show:function(){
            _packageStore.load(function(){
                ticket_select_row(_packageStore,_packageGrid);
            });
        }
    });

    //******************* 批量添加票价 - Start ***************
    var batch_store = Ext.create('Ext.data.Store',{
        fields: [],
        data: []
    });
    //var field_preset_type = Ext.create('Ext.form.ComboBox',{
    //    store:new Ext.data.Store({
    //        fields:['text'],
    //        data:[['成人票'],['儿童票']]
    //    }),
    //    emptyText:'成人票',
    //    valueFiled:'text',
    //    displayField:'text',
    //    editable:false
    //});
    var field_preset_type = SUNLINE.DictComBox(
        {displayField:"d_text",valueField:"d_text",width:100,editable:false},
        {d_type:"票价类型"}
    ).box;
    var field_d_type =  SUNLINE.DictComBox(
        {displayField:"d_text",valueField:"d_text",width:80,editable:true,forceSelection:false},
        {d_type:"票价类目"}
    ).box;
    var field_limit_type =  SUNLINE.DictComBox(
        {displayField:"d_text",valueField:"d_text",width:120,editable:false},
        {d_type:"限制类型"}
    ).box;
    var field_groups =  SUNLINE.DictComBox(
        {displayField:"d_text",valueField:"d_text",width:100,editable:false},
        {d_type:"交通类目"}
    ).box;
    var batch_grid = Ext.create('Ext.grid.Panel', {
        border: false,
        region:'center',
        store: batch_store,
        columns: [
            new Ext.grid.RowNumberer(),
            {
                header: '<span style="color:red">* </span>票价名称',
                dataIndex:"t_standards_name",
                width:150,
                locked:true,
                editor:{
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {header: '<span style="color:red">* </span>票价类型', dataIndex:"t_preset_type", width:100, locked:true, editor:field_preset_type},
            {header: '<span style="color:red">* </span>交通类目',dataIndex:"t_groups",width:100,locked:true,editor:field_groups},
            {
                header: '<span style="color:red">* </span>门市价',
                dataIndex:"t_price",
                width:80,
                editor:{
                    xtype: 'numberfield',
                    allowBlank: false
                }
            },
            {
                header: '<span style="color:red">* </span>同行价',
                dataIndex:"t_trade_price",
                width:80,editor:{
                    xtype: 'numberfield',
                    allowBlank: false
                }
            },
            {
                header: '<span style="color:red">* </span>投放市场',
                dataIndex:"t_site_name_rule",
                width:120,
                renderer:batchQuitTip,
                editor: new Ext.form.TextField({
                    listeners: {
                        focus: function (t) {
                            var _p_row = SUNLINE.getSelected(_p_grid);
                            //选择投放市场.单票
                            window.attrWin=SUNLINE.PutCity({
                                id:'t_site_name_rule',
                                url:$__app__ + '/City/put_city_json?p_type='+_p_row.data.p_type
                            },function(v,c,id){
                                if(id){
                                    var row=SUNLINE.getSelected(batch_grid);
                                    if(v.length>0){
                                        row.set(id,v);
                                    }else{
                                        row.set(id,'');
                                    }
                                    return id;
                                }

                                if(v.length>0){
                                    Ext.getCmp('t_site_name_rule').setValue(v);
                                }else{
                                    Ext.getCmp('t_site_name_rule').setValue('');
                                }
                            });
                            attrWin.this_id = 't_site_name_rule';
                            attrWin.this_val = t.getValue();
                            attrWin.show();
                        }
                    }
                })
            },
            {
                header: '始发站',
                dataIndex:"t_start_site",
                width:300,
                renderer:batchQuitTip,
                editor:_t_start_site_b
            },
            {header: '补房差',dataIndex:"t_spread_price",width:80,editor:{
                xtype: 'numberfield',
                allowBlank: false
            }},
            {header: '退房差',dataIndex:"t_out_room_price",width:80,editor:{
                xtype: 'numberfield',
                allowBlank: false
            }},
            {header: '票价类目',dataIndex:"t_room_groups",width:80,editor:field_d_type},
            {header: '限制类型',dataIndex:"t_limit_type",width:120,editor:field_limit_type},
            {
                header: '限制条件',
                dataIndex:"t_limit_condition",
                width:120,
                editor:{
                    xtype: 'textfield',
                    allowBlank: false
                }
            },
            {header: '库存量',dataIndex:"t_store",width:80,editor:{
                xtype: 'numberfield',
                allowBlank: false
            }}
        ],
        selModel:{selType: 'checkboxmodel'},
        tbar:[
            {text:'添加行',iconCls:'button-add',handler:batchRowAdd},
            '-',
            {text:'移除行',iconCls:'button-del',handler:batchRowDel},
            '-',
            {text:'复制',iconCls:'button-edit',handler:batchRowCopy},
        ],
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        }
    });
    var batch_win = Ext.create('Ext.window.Window', {
        layout: 'border',
        title: '批量添加',
        width:950,
        height:570,
        modal:true,
        resizable : false,
        closeAction:'hide',
        maximizable: true,
        items: [batch_grid],
        buttons : [
            {text : '保存',handler:batchTicketSave},
            {text : '取消', handler:batchWinClose}
        ],
    });
    batch_win.on('close',batchWinClose);
    //提示渲染
    function batchQuitTip(v){
        return '<font data-qtip="'+v+'">'+v+'</font>';
    };
    //窗口关闭
    function batchWinClose(){
        batch_win.hide();
        batch_store.load();
    }
    //保存票价
    function batchTicketSave(){
        //console.log(batch_store.data.length);
        //console.log(batch_store.data);
        if(batch_store.data.length < 1){
            Ext.Msg.alert('友情提示','请至少添加一条票价数据。');
            return false;
        }
        var product_row = SUNLINE.getSelected(_p_grid);
        if (!product_row){
            Ext.Msg.alert('友情提示', '请选择您想添加票价的产品信息。');
            return false;
        };
        var tk_params = {};
        tk_params.t_product_id = product_row.data.p_id;
        tk_params.t_standards_name = '';
        tk_params.t_preset_type = '';
        tk_params.t_price = '';
        tk_params.t_trade_price = '';
        tk_params.t_spread_price = '';
        tk_params.t_out_room_price = '';
        tk_params.t_room_groups = '';
        tk_params.t_groups = '';
        tk_params.t_limit_type = '';
        tk_params.t_limit_condition = '';
        tk_params.t_site_name_rule = '';
        tk_params.t_start_site = '';
        tk_params.t_store = '';
        for (var i = 0; i < batch_store.data.length; i++) {
            var record = batch_store.getAt(i);
            var row_num = Number(i) + 1;
            if(!$.trim(record.get('t_standards_name'))){
                Ext.Msg.alert('友情提示','【票价名称】为必填项，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            var name_str = $.trim(record.get('t_standards_name'));
            if(name_str.length > 20){
                Ext.Msg.alert('友情提示','【票价名称】最多允许输入20个字符，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!$.trim(record.get('t_preset_type'))){
                Ext.Msg.alert('友情提示','【票价类型】为必填项，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!$.trim(record.get('t_groups'))){
                Ext.Msg.alert('友情提示','【交通类目】为必填项，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!$.trim(record.get('t_price')) || $.trim(record.get('t_price')) == 0){
                Ext.Msg.alert('友情提示','【门市价】为必填项且不能为0，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            var reg_price = /^\+?[1-9][0-9]*$/;
            if(!reg_price.test($.trim(record.get('t_price')))){
                Ext.Msg.alert('友情提示','【门市价】只能为正整数，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!$.trim(record.get('t_trade_price')) || $.trim(record.get('t_trade_price')) == 0){
                Ext.Msg.alert('友情提示','【同行价】为必填项且不能为0，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!reg_price.test($.trim(record.get('t_trade_price')))){
                Ext.Msg.alert('友情提示','【同行价】只能为正整数，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(Number(record.get('t_trade_price')) > Number(record.get('t_price'))){
                Ext.Msg.alert('友情提示','【同行价】必须小于【门市价】，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            if(!$.trim(record.get('t_site_name_rule'))){
                Ext.Msg.alert('友情提示','【投放市场】为必填项，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            var room_str = $.trim(record.get('t_room_groups'));
            if(room_str.length > 20){
                Ext.Msg.alert('友情提示','【票价类目】最多允许输入20个字符，请仔细检查第 '+row_num+' 行！');
                return false;
            }
            //console.log(record);
            var amp = i>0 ? ',' : '';
            var amp_site = i>0 ? '||' : '';
            tk_params.t_standards_name += amp + record.get('t_standards_name');
            tk_params.t_preset_type += amp + record.get('t_preset_type');
            tk_params.t_price += amp + record.get('t_price');
            tk_params.t_trade_price += amp + record.get('t_trade_price');
            tk_params.t_spread_price += amp + record.get('t_spread_price');
            tk_params.t_out_room_price += amp + record.get('t_out_room_price');
            tk_params.t_room_groups += amp + record.get('t_room_groups');
            tk_params.t_groups += amp + record.get('t_groups');
            tk_params.t_limit_type += amp + record.get('t_limit_type');
            tk_params.t_limit_condition += amp + record.get('t_limit_condition');
            tk_params.t_site_name_rule += amp_site + record.get('t_site_name_rule');
            tk_params.t_start_site += amp_site + record.get('t_start_site');
            tk_params.t_store += amp + record.get('t_store');
        }
        Ext.MessageBox.confirm('友情提示', '您确认要批量添加票价吗？', function (b) {
            if(b == "yes") {
                Ext.Ajax.request({
                    url: $__app__ + '/Ticket/addTicket',
                    method: 'POST',
                    params: tk_params,
                    success: function (response, opts) {
                        var res = Ext.decode(response.responseText);
                        if (res.status == 1) {
                            batch_win.hide();
                            batch_store.load();
                            _store.load();
                        }
                        Ext.Msg.alert('友情提示', res.info);
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '保存失败！');
                    }
                });
            }
        })
    }
    //添加行
    function batchRowAdd(){
        var batch_row = [{
            't_standards_name':'',
            't_preset_type':'',
            't_price':'0',
            't_trade_price':'0',
            't_spread_price':'0',
            't_out_room_price':'0',
            't_room_groups':'',
            't_groups':'',
            't_limit_type':'无限制',
            't_limit_condition':'',
            't_site_name_rule':'',
            't_start_site':'',
            't_store':'-1'
        }];
        batch_store.insert(0,batch_row);
    }
    //复制行
    function batchRowCopy(){
        var batch_rows = SUNLINE.getSelected(batch_grid,true);
        if (!batch_rows.length){
            Ext.Msg.alert('友情提示','请选择您要复制的记录。');
            return false;
        };
        Ext.each(batch_rows,function(v){
            //delete v.data.id;
            //batch_store.insert(0,v.data);
            var cur_row = v.data;
            var batch_row = [{
                't_standards_name': cur_row.t_standards_name,
                't_preset_type':cur_row.t_preset_type,
                't_price':cur_row.t_price,
                't_trade_price':cur_row.t_trade_price,
                't_spread_price':cur_row.t_spread_price,
                't_out_room_price':cur_row.t_out_room_price,
                't_room_groups':cur_row.t_room_groups,
                't_groups':cur_row.t_groups,
                't_limit_type':cur_row.t_limit_type,
                't_limit_condition':cur_row.t_limit_condition,
                't_site_name_rule':cur_row.t_site_name_rule,
                't_start_site':cur_row.t_start_site,
                't_store':cur_row.t_store
            }];
            batch_store.insert(0,batch_row);
        });
    }
    //删除行
    function batchRowDel(){
        var batch_rows = SUNLINE.getSelected(batch_grid,true);
        if (!batch_rows.length){
            Ext.Msg.alert('友情提示','请选择您要删除的行。');
            return false;
        };
        Ext.each(batch_rows,function(m){
            batch_grid.getStore().remove(m);
        });
    }
    //******************* 批量添加票价 - End ***************

    function ticket_select_row(store,grid){
        var tickets_detail=Ext.decode(TICKET.formValues.t_detail);
        var indexs=[];
        if (!tickets_detail){
            grid.getSelectionModel().selectAll(true);
        }else{
            for (var i=0; i<tickets_detail.length; i++){
                var row = store.find('t_id', new RegExp('^'+ tickets_detail[i].id + '$'));
                indexs.push( store.getAt(row) );
            }
            if(indexs.length>0) grid.getSelectionModel().select(indexs);
        }
    }


    function _packageTicket(b){
        var p_row = SUNLINE.getSelected(_p_grid);
        if (!p_row){
            Ext.Msg.alert('友情提示', '请选择您想添加票价的产品信息。');
            return;
        };
        PRODUCTS=p_row.data;

        _packageWin.setTitle('套票管理：'+PRODUCTS.p_name);
        var f = _packageTicketForm.getForm();
        f.reset();
            if(b.text=='编辑'){
                f.setValues(TICKET.formValues);
                SUNLINE.weekSetValues(weekly_list2,TICKET.formValues.t_weekly);
                ticket_Detail();

            }else{
                _packageStore.removeAll();
            }
        Ext.getCmp('t_preset_type2').setValue('套票');
        _packageWin.show();
    };


    //添加套票
    var _package_Items_Win, _package_Items_Cm, _package_Items_Store, _package_Items_Grid;
    function _package_Ticket_Itmes(b){
        var p_row = SUNLINE.getSelected(_p_grid);
        if (!p_row){
            Ext.Msg.alert('友情提示', '请选择您想添加票价的产品信息。');
            return;
        };
        PRODUCTS=p_row.data;
        if (!_package_Items_Cm){
            _package_Items_Cm = [
                new Ext.grid.RowNumberer(), //行号
                {header:"ID",dataIndex:"t_id",width:50,hidden:true,align:'right'},
                {header:"状态",dataIndex:"t_status",width:45,align:'center',renderer:salesStatus},
                {header:"票价名称",dataIndex:"t_standards_name",width:100},
                {header:"<span style='color: red;'>占座数量</span>",dataIndex:"t_seat",width:80,
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,
                        allowDecimals:false,
                    })},
                {header:"门市价",dataIndex:"t_price",width:60,align:'right',sortable:true},
                {header:"同行价",dataIndex:"t_trade_price",width:60,align:'right',sortable:true},
                {header:"周几有效",dataIndex:"t_weekly",width:120,renderer:SUNLINE.weekRenderer},
                {header:"限制类型",dataIndex:"t_limit_type",width:80},
                {header:"限制条件",dataIndex:"t_limit_condition",width:80},
                {header:"编辑时间",dataIndex:"t_time",width:150}
            ];
        }
        if (!_package_Items_Store){
            var _url = $__app__ + '/Ticket/ticket_data';
            _package_Items_Store = SUNLINE.JsonStore(_url,_field,false);
        }
        var ids = '';
        _packageStore.each(function(record, sc){
            ids += record.get('t_id')+",";
        });

        SUNLINE.baseParams(_package_Items_Store,{t_product_id:PRODUCTS.p_id,t_type:"in", ids:ids  },false);
        _package_Items_Store.load();




        if (!_package_Items_Grid){
            _package_Items_Grid = new Ext.grid.Panel({
                region : 'center',
                clicksToEdit:1,
                border:false,//无边框
                loadMask: {msg : '数据传输中，请稍候...'},//导入时显示loading
                columns : _package_Items_Cm,
                store : _package_Items_Store,
                viewConfig : {emptyText: '暂无票价信息。'},
                selModel:{
                    selType: 'checkboxmodel',
                    mode:'SIMPLE'
                },
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 2
                },

                //tbar:[
                //    '->',
                //    '快速搜索：',
                //    {
                //        xtype:'trigger',
                //        triggerClass : 'x-form-search-trigger',
                //        id:'_Items_Search',
                //        emptyText : '票价名称、拼音简码等',
                //        width:150,
                //        onTriggerClick:function(e){
                //            _Items_Search();
                //        },
                //        listeners :{
                //            "specialkey" : function(_t, _e){
                //                if (_e.keyCode==13)
                //                    _Items_Search();
                //            }
                //        }
                //    }
                //],

                bbar: new Ext.PagingToolbar({
                    pageSize: pageSize,
                    store: _package_Items_Store,
                    displayInfo: true,
                    displayMsg: '第{0} 到 {1} 条数据 共{2}条',
                    emptyMsg: '没有数据'
                })
            });
        }
        if (!_package_Items_Win){
            _package_Items_Win = new Ext.Window({
                title:"票价列表 &nbsp;&nbsp;&nbsp;<span style='color: red'>(双击编辑占座数量)</span>",
                width:600,
                layout : 'border',
                height:400,
                modal:true,
                resizeHandles:'s',
                closeAction:'hide',
                items : [ _package_Items_Grid],
                buttons : [
                    {text : '添加', handler:doPackageItemsSubmit},
                    {text : '取消', handler:function(){_package_Items_Win.hide();}}
                ]

            });
        };
        _package_Items_Win.show(b.id);
    };
    //移除单票
    function _package_Ticket_Itmes_remove(){
        var all='all';
        var s = SUNLINE.getSelected(_packageGrid,all);
        _packageGrid.getStore().remove(s);
    };

    //套票：通过 t_detail 返回详情
    function ticket_Detail(){
        SUNLINE.baseParams(_packageStore,{t_id:TICKET.row.get('t_id')});
        _packageStore.load();
    };

    //添加套票的时候的搜索
    function _Items_Search(){
        if (PRODUCTS.info){
            _package_Items_Store.baseParams['skey'] = Ext.getCmp('_Items_Search').getValue();
            _package_Items_Store.load();
        }else{
            Ext.Msg.alert('友情提示', '请先选择您要查询的产品信息。');
        }
    };

    function doPackageSubmit(){
        var ticketForm = _packageTicketForm.getForm();
        var s = ticketForm.getValues();
        if (!ticketForm.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };

        var ids ='', seats = ''; var detail=[];
        _packageStore.each(function(record, sc){
            if (isNaN(parseInt(record.data.t_seat))||parseInt(record.data.t_seat)<1){
                ids = "";
                seats = "";
                return;
            };
            ids = record.get('t_id');
            seats = record.get('t_seat');
            detail.push({id:ids,seat:seats});
        });
        s['t_detail']=JSON.stringify(detail);
        s['t_product_id'] = PRODUCTS.p_id;

        if(!seats){
            Ext.Msg.alert('友情提示', '单票占座数量不能为空。');
            return;
        };
        if(parseFloat(s.t_price)< parseFloat(s.t_trade_price)){
            Ext.Msg.alert('友情提示', '注意同行价不能大于门市价！');
            return;
        }
        if (s.t_weekly==''){
            Ext.Msg.alert('友情提示', '请正确勾选周几有效。');
            return;
        };

        if(!s['t_site_name_rule']){
            Ext.Msg.alert('友情提示', '请正确勾选适用站点');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var old_t_id = s.t_id;

        Ext.Ajax.request({
            url:$__app__ + '/Ticket/save',
            method:'POST',
            params:s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info = ret.info, msg='';
                if (ret.status==1){

                    msg = info.msg;
                    _store.load();

                }else{
                    msg = info;
                };
                Ext.Msg.alert('友情提示', msg );
                _packageWin.hide();
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '单票保存失败！');
            }
        });
    };

    //给套票添加票价
    function doPackageItemsSubmit(){
        var all='all';
        var s = SUNLINE.getSelected(_package_Items_Grid,all);
        for (var i=0; i< s.length; i++){
            if(!s[i].data.t_seat){
                Ext.Msg.alert('友情提示', '请填写包含票价的占座数量！');
                return;
            }
        };

        _packageStore.add(s);

        _package_Items_Store.remove(s);

        _package_Items_Win.hide();

    }

    /** 套票管理相关代码结束 */
    var _win = new Ext.Window({
        title : '票价定义：' ,
        width : 820,
        autoHeight : true,
        iconCls : 'button-add',
        closeAction : 'close',
        resizable : false,
        modal:true,
        items:[ _form ],
        buttons : [
            {text : '保存',handler:doSubmit},
            {text : '取消', handler:function(){_win.hide();}}
        ],
        listeners:{
            'show':function(){

                _win.setTitle('票价定义：'+PRODUCTS.p_name);
                var _fm=_form.getForm();
                _fm.reset();
                field_store_add(['t_limit_type','t_groups']);
                _fm.setValues(TICKET.formValues);
                if(TICKET.formValues.t_start_site){
                    setTimeout(function(){
                        var ddt = TICKET.formValues.t_start_site.split(",");
                        _t_start_site.setValue(ddt);
                    },300);
                }
                var formValue = _fm.getValues();
                if(formValue.t_limit_type=='限制年龄' || formValue.t_limit_type=='限制性别'){
                    _t_limit_condition.setReadOnly(false);
                }
                SUNLINE.weekSetValues(weekly_list,TICKET.formValues.t_weekly);
            },
            'hide':function(){
                ++curd_click_btn;
            }
        }
    });


    /*对combox的重复数据进行处理*/
    function field_store_add(field){
        for(var i= 0;i<field.length;i++){
            var store_id=Ext.getCmp(field[i]).store;
            if(TICKET['formValues'][field[i]] && store_id.count()==0) {
                store_id.add({d_text:TICKET['formValues'][field[i]]});
            }
        }
    }


    //增加、编辑票价
    function _modify(b){
        var p_row = SUNLINE.getSelected(_p_grid);
        if (!p_row){
            Ext.Msg.alert('友情提示', '请选择您想添加票价的产品信息。');
            return;
        };
        PRODUCTS=p_row.data;

        if (b.text == "添加"){
            if(curd_click_btn == 0){
                    limit_type.box.store.add({d_text:'无限制'});
            }
            TICKET.formValues = {t_id:'',t_product_id:p_row.data.p_id, t_weekly:'',t_limit_type:limit_type,t_store:-1,t_limit_type:'无限制'}
        }else if(b.text == "批量添加"){
            batch_win.show();
            batch_win.setTitle('票价定义：' + p_row.data.p_name);
            return false;
        }else{
            var row = SUNLINE.getSelected(_grid);
            if (!row){
                Ext.Msg.alert('友情提示', '请选择您想编辑的票价信息。');
                return;
            };
            TICKET.row = row;
            TICKET.formValues = row.data;
            if (isPackageTicket(row.data.t_detail)){ // 打开套票编辑窗口
                _packageTicket(b); return;
            }
        };
        _win.show(b.id);
    };

    //删除票价
    function _del(){
        var rows = SUNLINE.getSelected(_grid,true);
        if (!rows.length){
            Ext.Msg.alert('友情提示','请选择您要移除的票价。');
            return false;
        };
        var select_p_row = SUNLINE.getSelected(_p_grid);
        Ext.MessageBox.confirm('提示', '确定删除选中的票价吗？', function (b) {
            if(b == "yes"){
                var t_id = [];
                for (var i = 0; i < rows.length; i++) {
                    t_id[i] = parseInt(rows[i].data.t_id);
                }
                var t_ids_str = t_id.join(',');
                Ext.Ajax.request({
                    url:$__app__ + '/Ticket/delTicket',
                    method:'POST',
                    params:{t_id:t_ids_str,p_id:select_p_row.data.p_id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var msg = ret.info;
                        if (ret.status==1){
                            Ext.Msg.alert('友情提示', msg);
                            Ext.each(rows,function(m){
                                _grid.getStore().remove(m);
                            });
                        }else{
                            Ext.Msg.alert('友情提示', msg);
                        }
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示',  '移除消费项目操作失败！');
                    }
                });
            }
        });
    };

    Ext.getCmp('t_site_name_rule').on({
        focus:function(){
            var _p_row=SUNLINE.getSelected(_p_grid);
            //选择投放市场.单票
            window.attrWin=SUNLINE.PutCity({
                id:'t_site_name_rule',
                url:$__app__ + '/City/put_city_json?p_type='+_p_row.data.p_type
            },function(v,c,id){
                if(id){
                    var row=SUNLINE.getSelected(batch_grid);
                    if(v.length>0){
                        row.set(id,v);
                    }else{
                        row.set(id,'');
                    }
                    return id;
                }

                if(v.length>0){
                    Ext.getCmp('t_site_name_rule').setValue(v);
                }else{
                    Ext.getCmp('t_site_name_rule').setValue('');
                }
            });
            attrWin.show();
            attrWin.this_id = '';
        }
    });

    Ext.getCmp('t_site_name_rule2').on({
        focus:function(){
            var _p_row=SUNLINE.getSelected(_p_grid);
            //选择投放市场.套票
            window.attrWin2=SUNLINE.PutCity({
                id:'t_site_name_rule2',
                url:$__app__ + '/City/put_city_json?p_type='+_p_row.data.p_type
            },function(v,c){
                if(v.length>0){
                    Ext.getCmp('t_site_name_rule2').setValue(v);
                }else{
                    Ext.getCmp('t_site_name_rule2').setValue('');
                }
            });
            attrWin2.show();
        }
    });

    //始发站选择
    window.site_win=SUNLINE.PutCity({
        url:$__app__ + '/StationStart/start_site_group',
        title:'选择始发站',
        id:'t_start_site',
        site_type: 1
    },function(v,c,id){
        if(id){
            var row=SUNLINE.getSelected(batch_grid);
            if(v.length>0){
                row.set(id,v);
            }else{
                row.set(id,'');
            }
            return id;
        }

        if(v.length>0){
            Ext.getCmp('t_start_site').setValue(v);
        }else{
            Ext.getCmp('t_start_site').setValue('');
        }
    });

    // Ext.getCmp('t_start_site').on({
    //     focus:function(){
    //         var t_groups=Ext.getCmp('t_groups').getValue();
    //         if(!t_groups){
    //             Ext.Msg.alert('友情提示','请选择【交通类目】再选择【始发站】!');
    //             return false;
    //         }
    //         site_win.show();
    //         if(t_groups == '汽车' || t_groups == '邮轮') {
    //             Ext.getCmp('site_val').setDisabled(true);
    //         }else{
    //             Ext.getCmp('site_val').setDisabled(false);
    //         }
    //     }
    // });

    window.sarea_val_fn=function(e){
        return Ext.getCmp(e).getValue();
    };

    window.site_val_fn=function(e){
        return Ext.getCmp(e).getValue();
    }

    window.start_site_data_fn=function(){
        return {type:two_type.box.getValue(),org_id:select_org_id};
    }

    function doSubmit(b){
        var form = _form.getForm();
        if (!form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };

        var s = form.getValues(), old_t_id = s.t_id;
        if (s.t_weekly==''){
            Ext.Msg.alert('友情提示', '请正确勾选周几有效。');
            return;
        };
        if(!s['t_site_name_rule']){
            Ext.Msg.alert('友情提示', '请正确勾选适用站点');
            return;
        };
        if(parseFloat(s.t_price)< parseFloat(s.t_trade_price)){
            Ext.Msg.alert('友情提示', '注意同行价不能大于门市价！');
            return;
        }
        if(s.t_start_site){
            s.t_start_site = s.t_start_site.join(',');
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Ticket/save',
            method:'POST',
            params:s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info = ret.info, msg= info.msg;
                myMask.hide();
                if (ret.status==1){
                    _win.hide();
                    _store.load();
                }
                Ext.Msg.alert('友情提示', msg);
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '“' + s.t_name + '”删除失败！');
            }
        });
    };

    _grid.getSelectionModel().on({
        'select':function(sm, rowIndex){
            var data=rowIndex.data;
            var setStatusBtn=Ext.getCmp('setStatusBtn');
            if(data.t_status == "有效"){
                setStatusBtn.setText('设为无效');
            }else{
                setStatusBtn.setText('设为有效');
            };
        }
    });

    //********** 绑定到班期START ************
    var bind_url = $__app__ + '/BusListNew/buslist_dateJoin';
    var bind_field = [];
    var bind_store = SUNLINE.GroupingStore(bind_url,bind_field,{sortInfo:{field:'bl_start_date',direction: "ASC"}, groupField:'bl_num'},false);
    var bind_features = Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{columnName}: {name:this.format_time} (共 {[values.rows.length]} 条)',{
            format_time:function(time){
                var group_field=bind_store.getConfig('groupField');
                switch(group_field){
                    case 'bl_num':
                        return time;
                }
            }}
        ],
        startCollapsed:false
    });
    //类型：0-全部，1-包含当前选定票价，2-不包含当前选定票价
    var has_type_box = SUNLINE.LocalComob({
        id: 'has_type',
        fields: ['id', 'text'],
        data: [
            {id: 0, text: '全部'},
            {id: 1, text: '包含当前选定票价'},
            {id: 2, text: '不包含当前选定票价'}
        ],
        config: {
            fieldLabel: '类型',
            editable: false,
            valueField: 'id',
            displayField: 'text',
            id: 'has_type',
            name: 'has_type',
            labelWidth: 40,
            labelAlign: 'right',
            width: 200,
            value: '全部',
        }
    });
    var bind_grid_left = Ext.create('Ext.grid.Panel', {
        border: false,
        region:'center',
        store: bind_store,
        features:[bind_features],
        columns: [
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"bl_id",width:50,hidden:true},
            {header:"状态",dataIndex:"bl_status",width:50, menuDisabled:false, renderer:bl_status},
            {header:"出发日期",dataIndex:"bl_start_date",width:135,renderer:strDate, menuDisabled:false},
            {header:"星期",dataIndex:"bl_week",width:55,renderer:weekName, menuDisabled:false},
            {header:"班期编号",dataIndex:"bl_num",width:110, menuDisabled:false, renderer:is_price, groupRenderer:bl_num,renderer:num_fn},
            {header:"班期名称",dataIndex:"bl_name",width:100,align:'center'},
            {header:"总座位",dataIndex:"bl_seat_count",width:80,align:'center'},
            {header:"门市价",dataIndex:"t_price",width:80,align:'center',renderer:priceNew},
            {header:"同行价",dataIndex:"t_trade_price",width:80,align:'center',renderer:priceTradeNew},
            {header:"库存量",dataIndex:"t_store",width:95,align:'center',renderer:storeNew},
        ],
        selModel:{selType: 'checkboxmodel'},
        tbar:[
            '<b>选择班期</b>',
            '->',
            '查询日期：',
            SUNLINE.ExtDateField({
                id:'seach_start_date',
                name:'seach_start_date',
                labelWidth:0,
                labelAlign:"right",
                fieldLabel:" ",
                labelSeparator:'',
                width:120,
                gang:'seach_stop_date',
                start:true,
                value:sys_time.start
            }),
            '~',
            SUNLINE.ExtDateField({
                id:'seach_stop_date',
                name:'seach_stop_date',
                labelWidth:0,
                labelAlign:"right",
                fieldLabel:" ",
                labelSeparator:'',
                width:120,
                gang:'seach_start_date',
                value:sys_time.end
            }),
            has_type_box,
            {text: '查询', iconCls: 'button-sch', handler: bindBusSearch},
            '-',
            {text: '刷新', iconCls: 'button-ref',style:'margin-right:10px', handler: function () {bind_store.reload();}},
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: bind_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
    });
    var bind_form = new Ext.form.FormPanel({
        id: 'bind_form',
        title:'',
        labelSeparator :'：',           //分隔符
        labelWidth : 50,              //标签宽度
        frame : false,
        applyTo :'form',
        style: 'margin-left: 7px',
        items:[
            {
                xtype : 'panel',
                layout : 'column',              //嵌套列布局
                border : false,                 //不显示边框
                defaults : {                   //应用到每一个子元素上的配置
                    border : false,            //不显示边框
                    layout : 'form',            //在列布局中嵌套form布局
                },
                items :[
                    {
                        labelSeparator :'：',
                        items :{
                            id: 'bind_t_price',
                            xtype : 'numberfield',
                            name : 't_price',
                            fieldLabel:'门市价',
                            disabled:true,
                        }
                    },
                    {
                        labelSeparator :'：',
                        items :{
                            id: 'bind_t_trade_price',
                            xtype : 'numberfield',
                            name : 't_trade_price',
                            fieldLabel:'同行价',
                            disabled:true,
                        }
                    },
                    {
                        labelSeparator :'：',
                        items :{
                            id: 'bind_t_store',
                            xtype : 'numberfield',
                            name : 't_store',
                            value:-1,
                            disabled:true,
                            fieldLabel:'<span class="help" data-qtip="该库存量是每天的上限，-1为不限制。">&nbsp;</span>库存量',
                        }
                    }
                ]
            },
        ]
    });
    var bind_grid_right = Ext.create('Ext.panel.Panel', {
        region : 'south',
        height: 80,
        items: [bind_form],
        style: 'border-top:1px solid #C1C1C1',
        tbar:[
            {
                id: 'checkboxgroup',
                xtype:'checkboxgroup',
                name:'checkboxgroup',
                fieldLabel: '',
                items: [
                    { boxLabel: '<b>修改班期价格</b>',id:'is_change', name: 'is_change', inputValue: '1'},
                ]
            }
        ]
    });
    var bind_win = Ext.create('Ext.window.Window', {
        layout: 'border',
        title: '绑到班期',
        width:850,
        height:570,
        modal:true,
        resizable : false,
        closeAction:'hide',
        maximizable: true,
        items: [bind_grid_left,bind_grid_right],
        buttons : [
            {text : "移除票价",handler:bindBusDel,tooltip:'从选定的班期中移除当前票价'},
            {text : '保存',handler:bindBusSave},
            {text : '取消', handler:function(){bind_win.hide();}}
        ],
    });
    Ext.getCmp('is_change').on('change',function(){
        var check_bool = Ext.getCmp('is_change').getValue();
        if(check_bool === true){
            Ext.getCmp('bind_t_price').setDisabled(false);
            Ext.getCmp('bind_t_trade_price').setDisabled(false);
            Ext.getCmp('bind_t_store').setDisabled(false);
        }else{
            Ext.getCmp('bind_t_price').setDisabled(true);
            Ext.getCmp('bind_t_trade_price').setDisabled(true);
            Ext.getCmp('bind_t_store').setDisabled(true);
        }
    });
    function whereDate(){
        var post_date={};
        var start_date = Ext.getCmp('seach_start_date').getValue();
        if(start_date){
            post_date.start_date=Ext.Date.format(start_date,'Y-m-d');
        }
        var stop_date= Ext.getCmp('seach_stop_date').getValue();
        if(stop_date){
            post_date.stop_date=Ext.Date.format(stop_date,'Y-m-d');
        }
        return post_date;
    }
    function bindBus(){
        var p_row = SUNLINE.getSelected(_p_grid);
        if (!p_row){
            Ext.Msg.alert('友情提示', '请选择您想操作的产品信息。');
            return;
        };
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提示', '请选择您要操作的票价。');
            return false;
        };
        //获取班期列表
        Ext.getCmp('has_type').setValue('全部');
        bindBusSearch();
        //重置表单数据
        Ext.getCmp('is_change').setValue(false);
        bind_form.getForm().reset();
        //显示绑定窗口
        bind_win.show();
        bind_win.setTitle('绑到班期：' + row.data.t_standards_name);
        return false;
    }
    function bindBusSave(){
        var p_row = SUNLINE.getSelected(_p_grid); //当前选中产品信息
        var t_row = SUNLINE.getSelected(_grid); //当前选中票价
        var b_row = SUNLINE.getSelected(bind_grid_left,true); //当前班期信息
        if(!b_row.length){
            Ext.Msg.alert('友情提示', '请至少选择一个班期！');
            return false;
        }
        var bind_params = {};
        var is_change = Ext.getCmp('is_change').getValue();
        if(is_change === true){
            bind_params = bind_form.getForm().getValues();
            if(!bind_params.t_price || Number(bind_params.t_price) < 0){
                Ext.Msg.alert('友情提示','【门市价】必须大于等于0');
                return false;
            }
            if(!bind_params.t_trade_price || Number(bind_params.t_trade_price) < 0){
                Ext.Msg.alert('友情提示','【同行价】必须大于等于0');
                return false;
            }
            if(!bind_params.t_store || Number(bind_params.t_store) < -1){
                Ext.Msg.alert('友情提示','【库存量】必须大于等于-1');
                return false;
            }
            if(Number(bind_params.t_trade_price) > Number(bind_params.t_price)){
                Ext.Msg.alert('友情提示','【同行价】必须小于等于【门市价】');
                return false;
            }
        }
        Ext.Msg.confirm('友情提示','您确认要保存吗？',function(b){
            if(b == "yes") {
                var bus_id_arr = [];
                for (var i = 0; i < b_row.length; i++) {
                    bus_id_arr[i] = parseInt(b_row[i].data.bl_id);
                }
                var bus_ids_str = bus_id_arr.join(',');
                bind_params.p_id = p_row.data.p_id;
                bind_params.t_id = t_row.data.t_id;
                bind_params.bus_ids_str = bus_ids_str;
                bind_params.is_change = (is_change === true) ? 1 : 0;
                Ext.Ajax.request({
                    url: $__app__ + '/Ticket/changeBusPrice',
                    method: 'POST',
                    params: bind_params,
                    success: function (response, opts) {
                        var res = Ext.decode(response.responseText);
                        if (res.status == 1) {
                            bind_store.reload();
                            Ext.getCmp('is_change').setValue(false);
                            bind_form.getForm().reset();
                        }
                        Ext.Msg.alert('友情提示', res.info);
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '保存失败！');
                    }
                });
            }
        })
    }
    function bindBusDel(){
        var p_row = SUNLINE.getSelected(_p_grid); //当前选中产品信息
        var t_row = SUNLINE.getSelected(_grid); //当前选中票价
        var b_row = SUNLINE.getSelected(bind_grid_left,true); //当前班期信息
        if(!b_row.length){
            Ext.Msg.alert('友情提示', '请至少选择一个班期！');
            return false;
        }
        var bind_params = {};
        Ext.Msg.confirm('友情提示','您确认要移除票价吗？',function(b){
            if(b == "yes") {
                var bus_id_arr = [];
                for (var i = 0; i < b_row.length; i++) {
                    bus_id_arr[i] = parseInt(b_row[i].data.bl_id);
                }
                var bus_ids_str = bus_id_arr.join(',');
                bind_params.p_id = p_row.data.p_id;
                bind_params.t_id = t_row.data.t_id;
                bind_params.bus_ids_str = bus_ids_str;
                Ext.Ajax.request({
                    url: $__app__ + '/Ticket/delBusTicket',
                    method: 'POST',
                    params: bind_params,
                    success: function (response, opts) {
                        var res = Ext.decode(response.responseText);
                        if (res.status == 1) {
                            bind_store.reload();
                            Ext.getCmp('is_change').setValue(false);
                            bind_form.getForm().reset();
                        }
                        Ext.Msg.alert('友情提示', res.info);
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '保存失败！');
                    }
                });
            }
        })
    }
    function bindBusSearch(){
        var p_row = SUNLINE.getSelected(_p_grid);
        var post_data = whereDate();
        var has_type = Ext.getCmp('has_type').getValue();
        if(has_type == 1 || has_type == 2) {
            post_data.has_type = has_type;
            var t_row = SUNLINE.getSelected(_grid); //当前选中票价
            post_data.t_id = t_row.data.t_id;
        }
        post_data.bl_product_id = p_row.data.p_id;
        post_data.p_org_id = select_org_id;
        SUNLINE.baseParams(bind_store, post_data);
        bind_store.currentPage = 1;
        bind_store.load();
    }
    function priceNew(v,m,r){
        var t_row = SUNLINE.getSelected(_grid); //当前选中票价
        var bl_ticket_detail = r.get('bl_ticket_detail');
        var bl_ticket_ids = r.get('bl_ticket_ids');
        var strs_arr = bl_ticket_ids.split(",");
        if(bl_ticket_ids && $.inArray(t_row.data.t_id,strs_arr) == -1){
            return '--';
        }
        if(bl_ticket_detail == 1){ //有修改
            var bl_ticket_detail_con = JSON.parse(r.get('bl_ticket_detail_con'));
            var value = '';
            $.each(bl_ticket_detail_con,function(i,v){
                if(i == t_row.data.t_id){
                    value = v.t_price;
                    return false;
                }
            });
            if(!value){
                return '￥'+t_row.data.t_price;
            }
            return '<span style="color:blue">￥'+value+'</span>';
        }else{ //无修改
            return '￥'+t_row.data.t_price;
        }
    }
    function priceTradeNew(v,m,r){
        var t_row = SUNLINE.getSelected(_grid); //当前选中票价
        var bl_ticket_detail = r.get('bl_ticket_detail');
        var bl_ticket_ids = r.get('bl_ticket_ids');
        var strs_arr = bl_ticket_ids.split(",");
        if(bl_ticket_ids && $.inArray(t_row.data.t_id,strs_arr) == -1){
            return '--';
        }
        if(bl_ticket_detail == 1){ //有修改
            var bl_ticket_detail_con = JSON.parse(r.get('bl_ticket_detail_con'));
            var value = '';
            $.each(bl_ticket_detail_con,function(i,v){
                if(i == t_row.data.t_id){
                    value = v.t_trade_price;
                    return false;
                }
            });
            if(!value){
                return '￥'+t_row.data.t_trade_price;
            }
            return '<span style="color:blue">￥'+value+'</span>';
        }else{ //无修改
            return '￥'+t_row.data.t_trade_price;
        }
    }
    function storeNew(v,m,r){
        var t_row = SUNLINE.getSelected(_grid); //当前选中票价
        var bl_ticket_detail = r.get('bl_ticket_detail');
        var bl_ticket_ids = r.get('bl_ticket_ids');
        var strs_arr = bl_ticket_ids.split(",");
        if(bl_ticket_ids && $.inArray(t_row.data.t_id,strs_arr) == -1){
            return '--';
        }
        if(bl_ticket_detail == 1){ //有修改
            var bl_ticket_detail_con = JSON.parse(r.get('bl_ticket_detail_con'));
            var value = '';
            $.each(bl_ticket_detail_con,function(i,v){
                if(i == t_row.data.t_id){
                    value = v.t_store;
                    return false;
                }
            });
            if(!value){
                return (t_row.data.t_store == -1) ? '无限制' : t_row.data.t_store;
            }
            value = (value == -1) ? '无限制' : value;
            return '<span style="color:blue">'+value+'</span>';
        }else{ //无修改
            return (t_row.data.t_store == -1) ? '无限制' : t_row.data.t_store;
        }
    }
    function weekName(v,m,r){
        var name_arr = ['日','一','二','三','四','五','六'];
        return name_arr[v];
    }
    function is_price(v, m, r){
        if (r.get('bl_ticket_detail')=='1') {
            v = '<span style="color:blue" qtip="当天调整过票价，将不受票价定义里设置的影响">' + v + '</span>';
        }
        return v;
    };
    function bl_num(v){
        return v;
    };
    function bl_status(v){
        var dict = {
            '计划':'color:#FF6E24',
            '正常':'color:#444', //3889FF
            '暂停':'color:#A82FFF',
            '取消':'color:#666',
            '锁定':'color:red',
            'del':'color:#ccc;text-decoration:line-through;'
        };
        return '<span style="'+ dict[v] +'">' + v + '</span>';
    };
    function num_fn(v,m,r){
        return '<font color="blue" data-qtip="'+v+'">'+v+'</font>';
    }
    function strDate(v,m,r){
        var bl_ticket_ids = r.get('bl_ticket_ids');
        var pre_str = '';
        if(!bl_ticket_ids){
            pre_str = '<span style="color:red;border:1px solid red;" data-qtip="该班期已含当前选定票价">含</span> ';
        }else{
            var strs_arr = bl_ticket_ids.split(",");
            var t_row = SUNLINE.getSelected(_grid); //当前选中票价
            if($.inArray(t_row.data.t_id,strs_arr) != -1){
                pre_str = '<span style="color:red;border:1px solid red;" data-qtip="该班期已含当前选定票价">含</span> ';
            }
        }

        var daytime = r.get('bl_start_time');
        if(r.get('bl_ticket_detail') && r.get('bl_ticket_detail')!=0){
            return '<font color="blue" data-qtip="当前班期金额有所调整">'+int2date(v) + ' ' + daytime+'</font>' + pre_str;
        }else{
            return int2date(v) + ' ' + daytime + pre_str;
        }
    };
    //********** 绑定到班期END *************

    function setDefault(){
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提示', '请选择您想设为默认价格的票价信息。');
            return;
        };
        Ext.Msg.confirm('友情提示','您真的要将“'+ row.data.t_standards_name +'”设为默认价格吗？',function(bb){
            if (bb=='yes'){
                ajaxModify({t_id:row.data.t_id}, $__app__+'/Ticket/setDefaultStatus', null, function(s, params){
                    if (s.status==1){
                        _store.load();
                    }else{
                        Ext.Msg.alert('友情提示', s.info);
                    }
                });
            }
        });
    }

    function setStatus(b){
        var row = SUNLINE.getSelected(_grid);

        if (!row){
            Ext.Msg.alert('友情提示', '请选择您想'+ b.text +'信息。');
            return;
        };
        Ext.Msg.confirm('友情提示','您真的要将“'+ row.data.t_standards_name +'”'+ b.text +'吗？',function(bb){
            if (bb=='yes'){
                var data =row.data, params={t_id:data.t_id}, status=data.t_status;
                var setStatusBtn=Ext.getCmp('setStatusBtn');
                params.t_status = (status=='有效') ? '无效' : '有效';
                ajaxModify(params, $__app__+'/Ticket/ajaxModify', null, function(s, params){
                    if (s.status==1){
                        if(data.t_status == "有效"){
                            setStatusBtn.setText('设为有效');
                        }else{
                            setStatusBtn.setText('设为无效');
                        };
                        _store.load();
                    }else{
                        Ext.Msg.alert('友情提示', s.info);
                    }
                });
            }
        });
    }
    /*添加票价窗口(end)*/

    ziyo_log({ listeners : [{grid: _grid, action:'Ticket', pk_id:'t_id'}] });
    new Ext.Viewport({
        layout : 'border',
        defaults : { border:false },
        items : [product_select,_grid]
    });
});