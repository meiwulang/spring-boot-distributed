var ROW = {};
GUIDE_WORK = {};
var WG={};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '报表管理';

    var xc_url = $__app__ + '/OrderExcel/sale_data';//select_order';
    var xc_field = ['id',"o_id_num_san", "o_num_san", "o_settle_real_san", "one_num", "one_o_settle_real", "one_o_num",
        "o_wm_uid",  "o_worg_id", "o_wm_name", "o_id_num", "o_num", "o_settle_real",
        "o_worg_name", "month_o_num", "month_o_settle_real", "month_num"];

    function me_money(v, m, r){
        mateData(v, m, r);
        return money(v, m, r);
    };

    function mateData(v, m, r){
        m.tdCls = r.get('_type')=='org' ? 'g' : 's';
        return v;
    }

    Ext.define('OrderExcel', {
        extend: 'Ext.data.TreeModel',
        fields: xc_field
    });

    var xc_store = Ext.create('Ext.data.TreeStore', {
        model: 'OrderExcel',
        proxy: {
            type: 'ajax',
            url: xc_url,
            actionMethods:{
                create:'POST',
                read:'POST',
                update:'POST',
                destroy:'POST'
            }
        },
        root:{ expanded: true, children:'children'}
    });
    xc_store.sort('month_o_num','DESC');
    var xc_cm =[
        //new Ext.grid.RowNumberer(),
        //{header:"分公司", dataIndex:"o_worg_name", width:300},
        {xtype: 'treecolumn',header:"统计对象", dataIndex:"o_wm_name", width:240,align:'left',locked: true, renderer:mateData},
        {
            text:'散客',
            columns:[
                {header:"订单数", dataIndex:"o_id_num_san", width:100,align:'center', renderer:mateData },
                {header:"人数", dataIndex:"o_num_san", width:100,align:'center', renderer:mateData },
                {header:"金额", dataIndex:"o_settle_real_san", width:100,align:'right', renderer:me_money }
            ]
        },
        {
            text:'团队',
            columns:[
                {header:"订单数", dataIndex:"o_id_num", width:100,align:'center', renderer:mateData },
                {header:"人数", dataIndex:"o_num", width:100,align:'center', renderer:mateData },
                {header:"金额", dataIndex:"o_settle_real", width:100,align:'right', renderer:me_money }
            ]
        },
        {
            text:'日汇总',
            columns:[
                {header:"订单数", dataIndex:"one_o_num", width:100,align:'center', renderer:mateData},
                {header:"人数", dataIndex:"one_num", width:100,align:'center', renderer:mateData },
                {header:"金额", dataIndex:"one_o_settle_real", width:100,align:'right', renderer:me_money }
            ]
        },
        {
            text:'月汇总',
            columns:[
                {header:"订单总数", dataIndex:"month_num", width:100,align:'center', renderer:mateData },
                {header:"总人数", dataIndex:"month_o_num", width:100,align:'center', renderer:mateData },
                {header:"总金额", dataIndex:"month_o_settle_real", width:100,align:'right', renderer:me_money}
            ]
        }
    ];
    var start_date=SUNLINE.ExtDateField({labelSeparator:'',id:'o_start_date',name:'o_start_date',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120});
    var _status = [];
    for(var i in order_status){
        var val='';
        if(i!='待确认') val=i;
        _status.push({
            id:i,
            boxLabel:order_status[i],
            name:'order_status_',
            inputValue:i,
            value : val
        });
    }
    var tree = Ext.create('Ext.tree.Panel', {
        region : 'center',
        useArrows: true,
        rootVisible: false,
        multiSelect: true,
        store:xc_store,
        columns:xc_cm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无票价信息。',
            deferEmptyText : true
        },
        tbar:[
            {
                width:530,
                labelAlign:'right',
                fieldLabel:'<b>订单状态 </b> ',
                labelWidth:75,
                xtype: 'checkboxgroup',
                id:'order_sta',
                columns: 6,
                vertical: true,
                items:_status
            },
             start_date,
            {text:'查询', iconCls:'searchico',handler:sea_select},
            '-',
            {text:'展开', id:'tree_id',iconCls:'fa fa-list-ul',handler:tree_status},
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('销售汇总报表')}},
        ]
    });
    function tree_status(v){
        if(v.text=='折叠'){
            Ext.getCmp('tree_id').setText("展开");
            Ext.getCmp('tree_id').setIconCls("fa fa-list-ul");
            tree.collapseAll();
        }else{
            Ext.getCmp('tree_id').setText("折叠");
            Ext.getCmp('tree_id').setIconCls("fa fa-bars");
            tree.expandAll();
        }
    }
    function sea_select(){
        var status=Ext.getCmp('order_sta').getValue();
        var o_start_date=Ext.getCmp('o_start_date').getRawValue();
        if(!o_start_date){
            Ext.Msg.alert('提示信息','请选择查询时间');
            return false;
        }
        status=Ext.encode(status);
        SUNLINE.baseParams(xc_store,{
            o_status:status,
            start:o_start_date
        });
        xc_store.load();
    }
    new Ext.Viewport({
        layout : 'border',
        items : [tree]
    });
    function time_jia(v){
        return v.substr(0,4)+'-'+ v.substr(4,2)+'-'+ v.substr(6,2);
    }
    if(tomorrow){
        var status=Ext.getCmp('order_sta').getValue();
        status=Ext.encode(status);
        tomorrow=time_jia(tomorrow);
        Ext.getCmp('o_start_date').setValue(tomorrow);
        SUNLINE.baseParams(xc_store,{
            o_status:status,
            start:tomorrow
        });
        xc_store.load();
    }

});
