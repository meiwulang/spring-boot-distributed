/**
 * Created by Johony on 16-2-23.
 */
Ext.onReady(function(){

    var start_time=SUNLINE.ExtDateField({
        id:'ob_start_date',
        width:180,
        labelWidth:0,
        labelAlign:'right',
        name:'ob_start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date()
    });

    var store = Ext.create('Ext.data.TreeStore', {
        fields: [''],
        proxy: {
            type: 'ajax',
            url: $__app__+'/GoOutPlane/jsonData',
            actionMethods:{
                create:'POST',
                read:'POST',
                update:'POST',
                destroy:'POST'
            }
        },
        root:{ expanded: true, children:'children'}
    });


    var cm=[
        { xtype: 'treecolumn', text: '出发口岸/出发站点/游客姓名',dataIndex: 'ob_start_site',width:400,renderer:function(v,i,r){
            var type = Ext.getCmp('ob_goto_type').value;
            var check = Ext.getCmp('checkNum');
            if(type == '去程'){
                var str = 's_start_stname';
            }else{
                var str = 'ob_end_site';
            }
            if(r.get(str) && !r.get('s_vip_name')){
                return r.get(str);
            }else if(r.get('s_vip_name')){
                return r.get('s_vip_name');
            }else{
                return v;
            }
        }},
        /*{header:"旅客姓名",dataIndex:"s_vip_name",width:100,align:'right'},*/
        {header:"手机号",dataIndex:"s_vip_mob",width:100,align:'center'},
        {header:"订单编号",dataIndex:"o_number",width:160,align:'center'},
        {header:"车次编号",dataIndex:"ob_bus_number",width:100,align:'center'},
        {header:'出发时间',dataIndex:"ob_start_time",width:100,align:'center',readerer:function(){

        }},
        {header:'到达时间',dataIndex:"ob_end_time",width:100,align:'center'},
        {
            xtype: 'checkcolumn',
            header: '安排计划',
            id:'checkNum',
            name:'checkNum',
            dataIndex: 'done',
            width: 100,
            stopSelection: true,
            menuDisabled: true
        }
    ];

    var grid = Ext.create('Ext.tree.Panel',{
        region:'center',
        border:false,
        xtype: 'treePanel',
        rootVisible: false,
        useArrows: true,
        store:store,
        columns:cm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '<span>暂无旅客信息</span>',
            deferEmptyText : true
        },
        tbar:[
            '<span style = "font-size: 14px;color:#00b7ee;font-weight: bolder">接送计划</span>',
            {
                id:"ob_goto_type",
                name:"ob_goto_type",
                fieldLabel:"类型",
                xtype:"combo",
                editable:false,
                width:120,
                labelWidth:30,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['ob_goto_type'],
                    data:[
                        ['去程'],
                        ['返程']
                    ]
                }),
                displayField:"ob_goto_type",
                valueField:"ob_goto_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"去程"
            },
            '出发时间',
            start_time,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '->',
            {text:'安排计划',iconCls:'button-',handler:createPlane}
        ]
    });
    function createPlane(){

    }
    function selectInfo(){
        var type = Ext.getCmp('ob_goto_type').value;
        var start_date = Ext.getCmp('ob_start_date').value;
        var year = start_date.getFullYear();
        var mon = start_date.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = start_date.getDate();
        var start = year+mon+day;
        SUNLINE.baseParams(store,{o_start_date:start,ob_goto_type:type});
        store.load();
    }
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})