/**
 * Created by Administrator on 2016/5/30.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/OrderExcel/man_select';
    var store=SUNLINE.JsonStore(url,[],false);
    var cm=[
        {header:"地区", dataIndex:"org_sname", width:150},
        {header:"人数", dataIndex:"num", width:120,align:'center'},
        {header:"占比", dataIndex:"per", width:120,align:'right'}
    ];
    var start_time=SUNLINE.ExtDateField({
        width:110,
        labelWidth:0,
        fieldLabel:":",
        format: 'Y-m-d',
        id:'start_date',
        name:'start_date',
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
        viewConfig:{emptyText:'没有人数汇总信息'},
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
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('市场销售汇总')}},
        ]
    });

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
    sreach_fn();
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
});