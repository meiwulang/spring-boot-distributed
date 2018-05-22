/**
 * Created by Administrator on 2016/5/30.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var url= $__app__ + '/OrderExcel/order_business_json';
    var store=SUNLINE.JsonStore(url,[],false);
    function product_fn(v){
        return '<span title="'+v+'">'+v+'</span>';
    }
    var cm=[
        {header:"客服", dataIndex:"o_service_name", width:90},
        {header:"销售", dataIndex:"o_wm_name", width:90},
        {header:"发团日期", dataIndex:"o_start_date", width:100,renderer:function(v){
            return int2date(v);
        }},
        {header:"组团社", dataIndex:"o_sorg_name", width:180},
        {header:"联系人", dataIndex:"o_name", width:90},
        {header:"线路", dataIndex:"o_product_name", width:260,renderer:product_fn},
        {header:"天数", dataIndex:"o_days", width:60,align:'center'},
        {header:"订单数", dataIndex:"num", width:80,align:'center'},
        {
            text: '人数',
            columns:[
                {header:"成人", dataIndex:"big_pop", width:60,align:'center'},
                {header:"儿童", dataIndex:"small_pop", width:60,align:'center'},
                {header:"合计", dataIndex:"pop", width:60,align:'center'}
            ]
        },
        {header:"产品品牌", dataIndex:"o_product_series", width:150},
        {header:"所属地区", dataIndex:"o_sorg_city", width:100}
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

    var pay_type_box=SUNLINE.LocalComob({
        id:'o_status',
        fields:['o_status'],
        data:[['全部'],['待付款']],
        config:{
            fieldLabel:'订单状态',
            labelWidth:60,
            width:150,
            value:'待付款'
        }
    });

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        width:500,
        store:store,
        columns:cm ,
        viewConfig:{emptyText:'没有汇总信息'},
        tbar:[
            {xtype:'textfield',fieldLabel:'分公司',labelWidth:50,emptyText:'全部分公司',text:'选择分公司',id:'tm_worg_txt',to_id:'tm_worg_id',width:180},
            {xtype:'hidden',emptyText:'全部分公司ID',id:'tm_worg_id'},
            '-',
            {xtype:'textfield',fieldLabel:'分销商',labelWidth:50,emptyText:'全部分销商',text:'选择分销商',id:'tm_sorg_txt',to_id:'tm_sorg_id',width:180},
            {xtype:'hidden',emptyText:'全部分销商ID',id:'tm_sorg_id'},
            '-',
            {xtype:'textfield',fieldLabel:'所属地区',labelWidth:60,emptyText:'全部城市',text:'选择城市',id:'sorg_city',to_id:'sorg_city_id',width:180},
            {xtype:'hidden',emptyText:'全部城市ID',id:'sorg_city_id'},'-',
            pay_type_box,
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
            {text:'查询',iconCls:'button-sch',handler:sreach_fn},
            {text:'导出', iconCls:'button-excel',handler:download_excel},
            {text:'帮助',icon: $app_public_images_path + 'b_help.png', cls: 'x-btn-icon',handler:function(){help('散客营业明细')}},
        ]
    });
    sreach_fn();
    function sreach_fn(){
        var date_val=where_date();
        SUNLINE.baseParams(store,date_val);
        store.load();
    }


    store.on({
        load:function(){
            if(store.length<=0)return false;
            var big_pop= 0,small_pop= 0,pop= 0,num=0;
            store.each(function(v){
                var row= v.data;
                big_pop+=parseFloat(row.big_pop);
                small_pop+=parseFloat(row.small_pop);
                pop+=parseFloat(row.pop);
                num+=parseFloat(row.num);
            });
            if(big_pop>0)store.getAt(0).set('big_pop',big_pop);
            if(big_pop>0)store.getAt(0).set('small_pop',small_pop);
            if(big_pop>0)store.getAt(0).set('pop',pop);
            if(num>0)store.getAt(0).set('num',num);
        }
    });

    function where_date(){
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        var end_date=Ext.Date.format(end_time.getValue(),'Ymd');
        var post_data={start_date:start_date,end_date:end_date};
        var tm_worg_id=Ext.getCmp('tm_worg_id').getValue();
        var tm_sorg_id=Ext.getCmp('tm_sorg_id').getValue();
        var sorg_city_id=Ext.getCmp('sorg_city_id').getValue();
        post_data.o_status=pay_type_box.getValue();
        if(tm_worg_id)post_data.o_worg_id=tm_worg_id;
        if(tm_sorg_id)post_data.o_sorg_id=tm_sorg_id;
        if(sorg_city_id)post_data.sorg_city_id=sorg_city_id;
        var sell_date=Ext.getCmp('sell_date').getValue();
        post_data.date_type=sell_date;
        return post_data;
    }

    var trans_store = new SUNLINE.JsonStore($__app__+'/TransPlan/select_combox', [],false);
    var trans_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"id", width:80,hidden:true},
        {header:"名称", dataIndex:"text", width:300}
    ];
    var trans_grid=new Ext.grid.GridPanel({
        region:'center',
        store:trans_store,
        columns:trans_cm,
        autoScroll:true,
        selModel:{
            selType: 'checkboxmodel'
        },
        height:520,
        tbar:[
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'trans_Search',
                cls:'search-icon-cls',
                emptyText : '信息名称',
                width:280,
                onTriggerClick:function(e){
                    trans_search();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            trans_search();
                    }
                }
            }
        ]
    });

    var trans_win = new Ext.Window({
        width : 400,
        height : 600,
        modal : true,
        fixed:true,
        closeAction : 'hide',
        items:trans_grid,
        buttons:[
            {text:'确认选择',handler:trans_vf_fn},
            {text:'关闭', handler:function () {
                trans_win.hide();
            }}
        ]
    });
    function trans_search(){
        var keys=Ext.getCmp('trans_Search').getValue();
        SUNLINE.baseParams(trans_store,{skey:keys},true);
        trans_store.load();
    }
    var select_id='';
    var select_name='';
    var select_row=['tm_worg_txt','tm_sorg_txt','sorg_city'];
    for(var si=0;si<select_row.length;si++){
        Ext.getCmp(select_row[si]).on({
            focus:function(t,e,o){
                trans_win.setTitle(t.text);
                select_id= t.to_id;
                select_name= t.id;
                trans_win.show();
                var post={type:t.text};
                SUNLINE.baseParams(trans_store,post);
                trans_store.load();
            }
        });
    }

    function trans_vf_fn(){
        var rows=trans_grid.getSelectionModel().getSelection();
        var sl_id=[];
        var sl_name=[];
        Ext.each(rows,function(v,i){
            var row= v.data;
            if(v.id && row.text!='全部')sl_id.push(row.id);
            sl_name.push(row.text);
        });
        Ext.getCmp(select_id).setValue(sl_id);
        Ext.getCmp(select_name).setValue(sl_name);
        trans_win.hide();
    }

    trans_store.on({
        load:function(){
            var row_id=Ext.getCmp(select_id).getValue();
            if(!row_id)return '';
            var i=0;
            row_id=row_id.split(',');
            this.each(function(v){
                var rows= v.data;
                if(in_array(rows['id'],row_id)!=-1){
                    trans_grid.getSelectionModel().select(i, true);
                }
                i++;
            })
        }
    });

    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出散客营业明细表吗?',function(y){
            if(y!='yes')return false;
            var url_data=where_date();
            var url='start_date/'+url_data.start_date+'/end_date/'+url_data.end_date+'/o_status/'+url_data.o_status+'/date_type/'+Ext.getCmp('sell_date').getValue();
            if(url_data.o_worg_id)url+='/o_worg_id/'+url_data.o_worg_id;
            if(url_data.o_sorg_id)url+='/o_sorg_id/'+url_data.o_sorg_id;
            if(url_data.sorg_city_id)url+='/sorg_city_id/'+url_data.sorg_city_id;
            window.location = $__app__+'/OrderExcel/train_detail_excel/'+url;
        });
    }

    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
});