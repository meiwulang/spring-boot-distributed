/**
 * Created by Johony on 16-2-25.
 */
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/Account/pay_json',[],'',true,'',20);
    var cm = [
        {header:'报销时间',dataIndex:'ac_time',align:'right',width:90},
        {header:'事由摘要',dataIndex:'ac_remark',width:300},
        {header:'金额',dataIndex:'ac_money',align:'right',width:100,renderer:money},
        {header:'报销人',dataIndex:'name',width:80,align:'center'},
        {header:'费用类别',dataIndex:'ac_category',width:180,align:'center'},
        {header:'归属地',dataIndex:'ac_city',width:80,align:'center'}
    ];

    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:start_date,gang:'end_date',start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date',
        width:110,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:end_date,gang:'start_date'
    });

    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        style:'border-top:2px solid #009DDA',
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        tbar:[

            '报销时间','-',
            start_time,' 至 ',end_time,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            {text:'导出数据',iconCls:'button-excel',handler:download_excel},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '摘要、所属公司、费用类别',
                width:280,
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
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出当前条件下的数据吗?',function(y){
            if(y!='yes')return false;
            var post_val=where_select();
            var skeys=Ext.getCmp('pl_Search').getValue();
            if(skeys)post_val.skeys=skeys;
            var url=[];
            for(var i in post_val){
                if(!post_val[i])continue;
                url.push(i);
                url.push(post_val[i]);
            }
            url=url.join('/');
            window.location = $__app__+'/Account/pay_json_excel/'+url;
        });
    }

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{skeys:key},true);
        store.load();
    };

    function where_select(){
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        var end_date=Ext.Date.format(end_time.getValue(),'Ymd');
        return {start_date:start_date,end_date:end_date};
    }

    //查询条件汇总
    selectInfo();
    function selectInfo(){
        var post=where_select();
        SUNLINE.baseParams(store,post);
        store.load();
    };


    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})