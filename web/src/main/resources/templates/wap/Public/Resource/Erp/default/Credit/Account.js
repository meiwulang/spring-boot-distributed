/**
 * Created by Johony on 16-2-23.
 */
var usInfo = {};
Ext.onReady(function(){
    var acc_url = $__app__ + '/Credit/ad_select';
    var acc_field = [{name:"ad_id"}];
    var acc_store = new SUNLINE.JsonStore(acc_url, acc_field,false);
    var acc_cm =[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"ad_id", width:50, hidden:true},
        {header:"交易流水号", dataIndex:"ad_serial_number", width:200,renderer:function(val){
            if(val=='账户余额'){
                return "<b style='color:#010408'>账户余额</b>";
            }else{
                return val;
            }
        }},
        {header:"操作人", dataIndex:"ad_uname", width:80},
        {header:"操作时间", dataIndex:"ad_time", width:150,renderer:function(val){
            if(val){
                var date=new Date(parseInt(val)*1000);
                return Ext.Date.format(date,'Y-m-d H:i:s');
            }else{
                return '';
            }
        }},
        {header:"主题", dataIndex:"ad_theme", width:200},
        {header:"交易金额", dataIndex:"ad_money", width:100,align:'right',renderer:function(v,m,r){
            if(r.get('ad_class')=='支出'){
                return "<span style='color:#ff8e92'>￥"+v+"</span>";
            }else if(r.get('ad_class')=='收入'){
                return "<span style='color:#008000'>￥"+v+"</span>";
            }else if(!r.get('ad_class')){
                if(v){
                    return "<span style='color:#1494d9'>￥"+v+"</span>";
                }else{
                    return "<span style='color:#1494d9'>￥0</span>";
                }

            }else{
                return "<span style='color:#008000'>￥"+v+"</span>";
            }
        }},
        //{header:"主要内容", dataIndex:"ad_remark", width:500},
        {header:"付款状态", dataIndex:"ad_status", width:100}
    ];

    var acc_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:acc_cm,
        store:acc_store,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '<span>暂无账户明细信息</span>',
            deferEmptyText : true
        },
        tbar:[
            '<span style = "font-size: 14px;color:#00b7ee;font-weight: bolder">账户明细</span>',
            '<a style = "cursor: pointer;color:#009DDA" onclick = backPlanes()><< 返回信用账户列表</a>'
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:acc_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有账户明细信息'
        })
    });
    window.backPlanes=function(){
        parent.OpenTab('账户明细', 'Credit', '', $__app__+'/Credit/index', 1);
    }


    SUNLINE.baseParams(acc_store,{ad_sorg_id:get_org});
    acc_store.currentPage=1;
    acc_store.load();



    new Ext.Viewport({
        layout:'border',
        items:[acc_grid]
    })
})