/**
 * Created by Administrator on 2016/5/30.
 */
var PlanInfo=[];
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/TicketBusine/busine_count_store';
    var store=SUNLINE.JsonStore(url,[]);
    var cm=[
        new Ext.grid.RowNumberer(),
        {header:"票务公司id", dataIndex:"ob_out_site_id", width:100,hidden:true},
        {header:"票务公司", dataIndex:"ob_out_site", width:200},
        {header:"总金额", dataIndex:"money", width:110,align:'right',renderer:money},
        {
            text:'结算',
            columns:[
                {header:"未结费用", dataIndex:"no_money",align:'right',renderer:money},
                {header:"结算中费用", dataIndex:"to_money", width:100,align:'right',renderer:money},
                {header:"已结费用", dataIndex:"yes_money", width:100,align:'right',renderer:money}
            ]
        },
        {
            text:'使用',
            columns:[
                {header:"未使用费用", dataIndex:"weiyong_money", width:100,align:'right',renderer:money},
                {header:"已使用费用", dataIndex:"yiyong_money", width:100,align:'right',renderer:money}
            ]
        }
    ];
    store.sort('money', 'DESC');
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
        style:'border-top:2px solid #009DDA',
        region:'center',
        width:500,
        store:store,
        columns:cm ,
        viewConfig:{emptyText:'没有票务公司汇总信息'}
    });
    var ri_store=SUNLINE.JsonStore($__app__+'/TicketBusine/busine_count_detail',[],false);
    function bus_number(v,i,r){
        if(!v)return '';
        return v + r.get('ob_start_site')+'--'+r.get('ob_end_site');
    }
    function time_jia(v){
        if(v=='19931028')return ' 合 计 :';
        if(v)v= v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
        return v;
    }
    function all_num(v,i,r){
        return parseInt(r.get('huo_xia_num'))+parseInt(r.get('huo_zhong_num'))+parseInt(r.get('huo_shang_num'))+parseInt(r.get('dong_er_num'))+parseInt(r.get('dong_yi_num'));
    }
    function ob_money(v){
        if(!v)return ' ';
        return   '<div style="text-align:right;"><span>' + v + '</span></div>';
    }
    var ri_cm = [
        new Ext.grid.RowNumberer(),
        {header:"出票日期", dataIndex:"ob_time", width:90,align:'center',renderer:time_jia},
        {header:"票面日期", dataIndex:"ob_start_date", width:90,renderer:time_jia},
        {header:"车次", dataIndex:"ob_bus_number", width:170,renderer:bus_number},
        {
            text:'火车',
            columns:[
                {header:"下铺", dataIndex:"huo_xia_num", width:50,align:'center'},
                {header:"中铺", dataIndex:"huo_zhong_num", width:50,align:'center'},
                {header:"上铺", dataIndex:"huo_shang_num", width:50,align:'center'}
            ]
        },
        {
            text:'高铁/动车',
            columns:[
                {header:"二等座", dataIndex:"dong_er_num", width:65,align:'center'},
                {header:"一等座", dataIndex:"dong_yi_num", width:65,align:'center'}
            ]
        },
        {header:"张数", dataIndex:"all_num", width:50,align:'center',renderer:all_num},
        {header:"手续费", dataIndex:"ob_price", width:75,align:'right',renderer:ob_money},
        {header:"金额", dataIndex:"money", width:85,align:'right',renderer:money},
        {header:"票务公司", dataIndex:"ob_out_site", width:200}
    ];
    ri_store.sort('ob_time', 'ASC');
    var ri_grid = Ext.create('Ext.grid.Panel',{
        region:'east',
        width:870,
        minWidth:10,
        store:ri_store,
        collapsed:true,
        columns:ri_cm,
        style:'border-left:2px solid #009DDA;border-top:2px solid #009DDA',
        tbar:[
            {text:'收起',iconCls:'button-structure',handler:function(){
                ri_grid.collapse();
            }},
            //{text:'导出',f_type:'one', iconCls:'button-excel',handler:download_excel}
        ],
        viewConfig:{emptyText:'没有票务公司详情信息'}
    });
    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[grid,ri_grid],
        tbar:[
            {xtype:"hidden",id:"sell_date",value:'ob_start_date'},
            {text:'票面日期',id:'sell_txt', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '票面日期',id:"deal_times",handler:function(){
                            Ext.getCmp("sell_txt").setText("票面日期");
                            Ext.getCmp("sell_date").setValue("ob_start_date");
                        }},
                        {text: '出票日期',id:"out_date",handler:function(){
                            Ext.getCmp("sell_txt").setText("出票日期");
                            Ext.getCmp("sell_date").setValue("ob_time");
                        }}
                    ]
                }
            },
            '出发日期',
            start_time,
            ' 至 ',
            end_time,
            {text:'查询',iconCls:'button-sch',handler:sreach_fn},
            //{text:'导出',f_type:'all', iconCls:'button-excel',handler:download_excel}
        ]
    });
    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Y-m-d');
        var end_date=Ext.Date.format(end_time.getValue(),'Y-m-d');
        var time_type_val=Ext.getCmp("sell_date").getValue();
        var post_data={start_date:start_date,end_date:end_date,time_type:time_type_val};
        return post_data;
    }
    //导出/打印
    function download_excel(v){
        var name='',url='';
        var url_data=where_date();
        if(v.f_type=='all'){
            url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date+'/type/all';
            if(url_data.worg_id)url+='/worg_id/'+url_data.worg_id;
            if(url_data.car_org_id)url+='/car_org_id/'+url_data.car_org_id;
            name='你确定要导出车辆公司统计表吗?';
        }else{
            var row = SUNLINE.getSelected(grid);
            if(row == null){
                Ext.Msg.alert('友情提示','请选择要导出的车队公司!');
                return false;
            }
            name='你确定要导出'+row.data.tp_car_org_name+'的统计表吗?';
            url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date+'/tp_car_org_id/'+row.data.tp_car_org_id+'type/one';
        }
        Ext.MessageBox.confirm('友情提示',name,function(y){
            if(y!='yes')return false;
            window.location = $__app__+'/TransPlan/all_trans_count/'+url;
        });

    }
    function sreach_fn(){
        var date_val=where_date();
        SUNLINE.baseParams(store,date_val);
        store.load();
    }
    sreach_fn();

    grid.on('cellclick',function(v,i,d,r){
        var row= r.data;
        if(row.tp_car_org_name=='总计'){
            ri_store.removeAll();
            return false;
        }
        var date_val=where_date();
        date_val['ob_out_site_id']=row.ob_out_site_id;
        SUNLINE.baseParams(ri_store,date_val);
        ri_store.load();
        if(ri_grid.getCollapsed())ri_grid.expand();
    });
    store.on('load',function(){
        ri_store.removeAll();
    })

    new Ext.Viewport({
        layout:'border',
        items:[Panel]
    })
});