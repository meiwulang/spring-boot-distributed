/**
 * Created by Administrator on 2016/5/30.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/OrderExcel/sanke_man_select';
    var store=SUNLINE.JsonStore(url,[],false);
    var cm=[
        {header:"地区", dataIndex:"org_sname", width:150},
        {header:"指标", dataIndex:"zhi_num", width:120,align:'center',hidden:true},
        {header:"收客人数", dataIndex:"num", width:120,align:'center'},
        {header:"完成率", dataIndex:"per", width:120,align:'right',hidden:true}
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

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        columns:cm ,
        viewConfig:{emptyText:'没有散客收客人数汇总信息'},
        tbar:[
            {xtype:"hidden",id:"sell_date",value:'o_confirm_time'},
            {text:'收客日期',id:'sell_txt', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '收客日期',id:"deal_times",handler:function(){
                            Ext.getCmp("sell_txt").setText("收客日期");
                            Ext.getCmp("sell_date").setValue("o_confirm_time");
                        }},
                        {text: '出团日期',id:"out_date",handler:function(){
                            Ext.getCmp("sell_txt").setText("出团日期");
                            Ext.getCmp("sell_date").setValue("o_start_date");
                        }}
                    ]
                }
            },
            start_time,
            ' 至 ',
            end_time,
            {text:'查询',iconCls:'button-sch',handler:sreach_fn},
            {text:'导出', iconCls:'button-excel',handler:download_excel}
        ]
    });
    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出散客收客人数明细表吗?',function(y){
            if(y!='yes')return false;
            var url_data=where_date();
            var url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date;
            window.location = $__app__+'/OrderExcel/sanke_man_excel/'+url;
        });
    }
    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Y-m-d');
        var end_date=Ext.Date.format(end_time.getValue(),'Y-m-d');
        var post_data={start_date:start_date,end_date:end_date};
        var sell_date_id=Ext.getCmp('sell_date').getValue();
        if(sell_date_id)post_data.sell_date=sell_date_id;
        return post_data;
    }
    function sreach_fn(){
        var date_val=where_date();
        SUNLINE.baseParams(store,date_val);
        store.load();
    }
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
});