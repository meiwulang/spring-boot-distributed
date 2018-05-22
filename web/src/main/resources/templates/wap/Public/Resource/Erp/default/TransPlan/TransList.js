/**
 * Created by Johony on 16-2-25.
 */
var usInfo = {};//存储查询条件
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/TransPlan/seat_bus_list',[],{groupField:'start_date'},true);
    var groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ' 出发日期 :{name}: (共 {[values.rows.length]} 条)',
        startCollapsed:false
    })
    var cm = [
        new Ext.grid.RowNumberer(),
        {header:'出发日期',dataIndex:'start_date',align:'left',width:100/*,renderer:function(v,i,r){
            if(!v){
                return r.get('s_end_date');
            }else{
                return v;
            }
        }*/},
        {header:'出发口岸',dataIndex:'ob_start_site',align:'left',width:150,renderer:function(v,i,r){
            if(!v){
                return r.get('ob_end_site');
            }else{
                return v;
            }
        }},
        {header:'接送类型',dataIndex:'ob_goto_type',align:'center',width:100},
        {header:'订单数',dataIndex:'number',align:'center',width:80},
        {header:'接送总人数',dataIndex:'num',align:'center',width:100},
        {header:'未安排人数',dataIndex:'n_pop',align:'center',width:100,renderer:function(v){
            return '<span style = "color:#ff4500">'+v+'</span>';
        }},
        {header:'已安排人数',dataIndex:'tp_pop',align:'center',width:100,renderer:function(v){
            return '<span style = "color:green">'+v+'</span>';
        }},
        {header:'计划数量',dataIndex:'tp_num',align:'center',width:100},
        {header:'站点数量',dataIndex:'st_num',align:'center',width:100},
        {header:'未出票',dataIndex:'yp_pop',align:'center',width:70},
        {header:'已出票',dataIndex:'p_num',align:'center',width:70},
        {header:'状态',dataIndex:'n_pop',width:70,align:'center',renderer:function(v,n,r){
            if(v>0){
                return '<span style = "color:#ff4500">安排中</span>';
            }else{
                return '<span style = "color:green">已完成</span>';
            }
        }},
        {header:'操作',dataIndex:'start_date',align:'center',width:140,renderer:function(v,n,r){
            var type = Ext.getCmp('ob_goto_type').getValue();
            if(type == '去程'){
                var StrDate = v;
                var StrSite = r.get('ob_start_site');
                var StrType = type;
            }else if(type == '返程'){
                var StrDate = r.get('start_date');
                var StrSite = r.get('ob_end_site');
                var StrType = type;
            }
            var str = 's_start_date-'+StrDate+'-ob_start_site-'+StrSite+'-ob_goto_type-'+StrType;
            var reStr = '<a style = "cursor: pointer;color:#0000ff" onclick = planeInfo("'+str+'")>[游客明细]</a>';
            var plStr = '<a style = "cursor: pointer;color:#0000ff" onclick = planeList("'+str+'")>[已排计划]</a>';
            return reStr+' | '+plStr;
        }}
    ];

    window.planeInfo=function(v){
        parent.OpenTab('安排接送', 'Plane'+v, '', $__app__+'/TransPlan/Text/'+v, 1);
    }
    window.planeList=function(v){
        parent.OpenTab('计划订单', 'PlaneList'+v, '', $__app__+'/TransPlan/PlaneList/'+v, 1);
    }

    var start_time=SUNLINE.ExtDateField({
        id:'pd_start_date_id',
        width:110,
        labelWidth:0,
        name:'pd_start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'pd_end_date_id',
        start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'pd_end_date_id',
        width:110,
        labelWidth:0,
        name:'pd_end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date(),
        gang:'pd_start_date_id'
    });
    var start_site=SUNLINE.StartSiteBox({
        config:{
            displayField:'text',
            valueField:'text',
            fieldLabel:'出发口岸',
            labelWidth:60,
            width:220,
            labelAlign:'right',
            value:'全部口岸'
        }
    });
    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        features: [groupfeatures],
        store:store,
        columns:cm,
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容，点击查询试试看╮(╯_╰)╭'},
        tbar:[
            {
                id:"ob_goto_type",
                name:"ob_goto_type",
                fieldLabel:"类型",
                xtype:"combo",
                editable:false,
                width:100,
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
            '-',
            '出发时间',
            start_time,
            '至',
            end_time,
            start_site,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '游客姓名,游客手机号,订单编号,站点名称,航班编号',
                width:180,
                onTriggerClick:function(e){
                    planeSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            planeSearch();
                    }
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
    })

    function planeSearch(){
        var skey=Ext.getCmp('pl_Search').getValue();
        var go_type = Ext.getCmp('ob_goto_type').getValue();
        SUNLINE.baseParams(store,{ob_goto_type:go_type,skey:skey});
        store.currentPage=1;
        store.load();
    }

    function creatDate(date){
        var year = date.getFullYear();
        var mon = date.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = date.getDate();
        if(day<10){
            day = '0'+day;
        }
        return year+mon+day;
    }
    function getTopInfo(){
        usInfo.type = Ext.getCmp('ob_goto_type').value;
        var start_date = start_time.getValue();
        var end_date = end_time.getValue();
        usInfo.site_val = start_site.getValue();
        if(usInfo.site_val == '全部口岸'){
            usInfo.site_val = '';
        }
        usInfo.start = creatDate(start_date);
        usInfo.end = creatDate(end_date);
    }
    function selectInfo(){
        getTopInfo();
        SUNLINE.baseParams(store,{o_start_date:usInfo.start,o_end_date:usInfo.end,ob_goto_type:usInfo.type,start_site:usInfo.site_val});
        store.load();
    }
    ziyo_log({ listeners : [{grid: grid, action:'TransPlan', pk_id:'tp_id'}] });
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})