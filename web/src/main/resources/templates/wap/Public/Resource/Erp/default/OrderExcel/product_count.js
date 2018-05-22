/**
 * Created by Administrator on 2016/5/30.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/OrderExcel/product_select';
    var store=SUNLINE.GroupingStore(url,[],{sortInfo:{field:'num',direction: "DESC"}, groupField:'o_type'});
    var ri_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' <div>{name} {[values.rows.length]}条'],
        startCollapsed:false,
        collapsible:true
    });
    var cm=[
        {header:"地区", dataIndex:"p_name", width:400,renderer:function(v,m,r){
            if(v=='总计'){
                return v;
            }else{
                var series_id=Ext.getCmp('series').getValue();
                console.log(series_id)
                if(series_id=='p_series'){
                    return r.get('p_series');
                }else{
                    return '[ '+ r.get('p_series')+' ] '+v;
                }
            }
        }},
        {header:"人数", dataIndex:"num", width:120,align:'center'},
        {header:"占比", dataIndex:"per", width:120,align:'right'}
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

    var SourceNameBox=SUNLINE.CompanyBox({
        where:{
            org_type:'分公司'
        },
        config:{
            displayField:'text',
            valueField:'id',
            id:'source_name',
            fieldLabel:'',
            labelWidth:0,
            width:207,
            labelAlign:'right',
            value:''
        }
    });
    SourceNameBox.store.on({
        load:function(){
            this.add({id:'0',text:'所有公司'});
        }
    });

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        features: [ri_groupfeatures],
        columns:cm ,
        viewConfig:{emptyText:'没有线路人数汇总信息'},
        tbar:[
            '分公司:',
            SourceNameBox,
            '-',
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
            {xtype:"hidden",id:"series",value:'p_series'},
            {text:'按系类分组',id:'series_name', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '按系类分组',id:"p_series_id",handler:function(){
                            Ext.getCmp("series_name").setText("按系类分组");
                            Ext.getCmp("series").setValue("p_series");
                        }},
                        {text: '按线路分组',id:"p_name_id",handler:function(){
                            Ext.getCmp("series_name").setText("按线路分组");
                            Ext.getCmp("series").setValue("o_product_id");
                        }}
                    ]
                }
            },
            {xtype:"hidden",id:"o_type_id",value:'all'},
            {text:'订单类型',id:'o_type_name', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '全部订单',handler:function(){
                            Ext.getCmp("o_type_name").setText("全部订单");
                            Ext.getCmp("o_type_id").setValue("all");
                        }},
                        {text: '团队订单',handler:function(){
                            Ext.getCmp("o_type_name").setText("团队订单");
                            Ext.getCmp("o_type_id").setValue("团队订单");
                        }},
                        {text: '跟团游',handler:function(){
                            Ext.getCmp("o_type_name").setText("跟团游");
                            Ext.getCmp("o_type_id").setValue("跟团游");
                        }}
                    ]
                }
            },
            {text:'查询',iconCls:'button-sch',handler:sreach_fn}
        ]
    });

    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Y-m-d');
        var end_date=Ext.Date.format(end_time.getValue(),'Y-m-d');
        var post_data={start_date:start_date,end_date:end_date};
        var sell_date_id=Ext.getCmp('sell_date').getValue();
        var series_id=Ext.getCmp('series').getValue();
        var type_id=Ext.getCmp('o_type_id').getValue();
        var org_id=SourceNameBox.getValue();
        if(sell_date_id)post_data.sell_date=sell_date_id;
        if(series_id)post_data.series=series_id;
        if(type_id)post_data.type_id=type_id;
        if(org_id && org_id!=0)post_data.worg_id=org_id;
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