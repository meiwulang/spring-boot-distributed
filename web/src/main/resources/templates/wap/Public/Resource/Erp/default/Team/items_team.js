/**
 * Created by Administrator on 2016/3/31.
 */
var items_list=[
    {text:'车辆',iconCls:'button-add',id:'car_id'},
    {text:'导游',iconCls:'button-add',id:'guides_id'},
    {text:'景区',iconCls:'button-add',id:'scenic_id'},
    {text:'住宿',iconCls:'button-add',id:'hotal_id'},
    {text:'餐饮',iconCls:'button-add',id:'caterers_id'},
    {text:'购物店',iconCls:'button-add',id:'shop_id'},
    {text:'其他',iconCls:'button-add',id:'out_id'}
];

Ext.onReady(function () {
    //计算方式
    var reckon_type='ti_trade_price';
    var items_cost_url=$__app__+'/Ticket/new_ticket_detail';
    var items_cost_field=['ti_id'];
    var items_cost_store=SUNLINE.GroupingStore(items_cost_url,items_cost_field,{sortInfo:{field:'ti_type_new'}, groupField:'ti_type_new'},false);
    SUNLINE.baseParams(items_cost_store,{ti_product_id:115,ti_ta_tid:120,ta_type:'成人票',t_end_time:'2016-04-20',t_start_time:'2016-04-01'});
    items_cost_store.load();
    var items_cost_grid=SUNLINE.ItemsList({
        store:items_cost_store,
        items_list:items_list,
        reckon_type:'ti_trade_price',
        team_plan:true,//判断是否是出团计划单中所用
        pop_num:1
    },function(m,s,i){
        console.log(i);
    },function(){});
    items_cost_grid.ticket_date = {start_date:20160401,end_date:20160425};
    console.log(this.PopData())
    items_cost_grid.pop = this.PopData();
    /*var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{name:this.format_keyword} (共 {[values.rows.length]} 项成本)',{format_keyword:function(name){
            if(name=="-1"){
                return '按团计费';
            }else if(name=="-2"){
                return '分公司报价';
            }else{
                return '第'+name+'天';
            }
        }}]
    });
    //表头标注
    //删除项目
    function items_del(){
        return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
    };
    //结算总额显示
    function all_money(v,m,r){
        if(r.data.ti_type_new=='住宿'){
            return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
        }else{
            return '￥'+ parseFloat(v).toFixed(2)
        }
    };

    //结算单价显示
    function trade_price_new(v,m,r){
        if(r.data.ti_type_new=='住宿'){
            return '￥'+parseFloat(v).toFixed(2);
        }else{
            return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
        }
    };

    //天数显示
    function days_format(v,m){
        if(v<0)return '-';
        return '第'+v+'天';
    };

    //项目类型
    var ti_type_mode_box=SUNLINE.LocalComob({
        id:'ti_type_mode',
        fields:['ti_type_mode'],
        data:[['按团计费'],['按人计费']],
        config:{
            id:"ti_type_mode_id"
        }
    });

    //结算方式
    var si_settle_type_box=SUNLINE.LocalComob({
        id:'ti_insti_type',
        fields:['ti_insti_type'],
        data:[['签单'],['现金'],['预付']],
        config:{
            id:"ti_insti_type_id"
        }
    });

    var _cof={
        displayField:'text',
        valueField:'text',
        listConfig:{minWidth:285},
        allowBlank:false,
        listWidth:250,
        editable:true,
        forceSelection:false,
        pageSize:20
    };
    //搜索项目数据
    var insti_name_box=SUNLINE.ComBoxPlus({
        id:'insti_name',
        fields:['id','text'],url:$__app__ + '/Team/items_data',
        config:_cof
    });
    //搜索项目中内项目数据
    var cs_type_name_box=SUNLINE.ComBoxPlus({
        id:'cs_type_name',
        fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
        config:_cof
    });
    //消费项目表头
    var items_cost_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
        {header:"", dataIndex:"items_del", width:25,renderer:items_del},
        {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
        {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
        {header:"资源名称", dataIndex:"ti_insti_name", width:170,editor:insti_name_box},
        {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
        {header:"项目名称", dataIndex:"ti_cs_type_name", width:130,editor:cs_type_name_box},
        {header:"项目名称ID", dataIndex:"ti_cs_type_name_id", width:50,hidden:true},
        {header:"项目类型", dataIndex:"ti_type_new", width:80},
        {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box},
        {header:"结算方式", dataIndex:"ti_insti_type", width:80,editor:si_settle_type_box},
        {header:"第几天", dataIndex:"ti_day", width:80,renderer:days_format,
            editor:new Ext.form.NumberField({
                selectOnFocus:true,id:'ti_day_new'
            })
        },
        {header:"总金额",dataIndex:"ti_all_money", width:80,align:'right',sortable:true,renderer:all_money,
            editor:new Ext.form.NumberField({
                selectOnFocus:true,id:'ti_all_money_new',
                listeners:{ change:ti_settle_money }
            })
        },
        {header:"数量", dataIndex:"ti_num", width:50,sortable:true,
            editor:new Ext.form.NumberField({
                minValue:1,selectOnFocus:true,id:'ti_num_new',
                listeners:{ change:ti_settle_num }
            })
        },
        {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right',
            editor:new Ext.form.NumberField({
                selectOnFocus:true,id:'ti_trade_price_new',
                listeners:{ change:ti_settle_price }
            })
        },
        {header:"备注", dataIndex:"ti_remark", width:150,editor:new Ext.form.TextField({id:'ti_remark_new'})}
    ];
    //组织tbar项目
    var items_data=[];
    Ext.each(items_list,function(v,i){ items_data[i]={ text: v.text,iconCls: v.iconCls,id: v.id,handler:tbar_items } });
    items_data=items_data.concat(['-',{text:'删除项目', id:'_del_item', iconCls:'button-del',handler:items_cost_del}]);
    //画出表格
    var items_cost_grid=new Ext.grid.GridPanel({
        region:'center',
        loadMask: {msg : '数据传输中，请稍候...'},
        store: items_cost_store,
        columns: items_cost_cm,
        height : 350,
        features: [items_cost_group],
        autoScroll : true,
        modal : true,
        closeAction : 'hide',
        cls : 'suntour_dataView',
        layout : 'fit',
        minWidth:500,
        minHeight:400,
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        tbar:items_data
    });

    //加载资源信息
    insti_name_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(items_cost_grid);
            var insti_name_box_store=insti_name_box.store;
            SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
        }
    });
    //选择资源信息
    insti_name_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(items_cost_grid);
            var r= r[0];
            row.set('ti_name_id', r.get('id'));
            row.set('ti_cs_type_name', '');
        }
    });

    //加载资源项目信息
    cs_type_name_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(items_cost_grid);
            var cs_type_name_box_store=cs_type_name_box.store;
            SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:ticket_date.start_date,end_date:ticket_date.end_date});
            cs_type_name_box_store.load();
        }
    });
    //选择资源项目信息
    cs_type_name_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(items_cost_grid);
            var r= r[0];
            var ti_num=1;
            var price= parseFloat(r.get('price'));
            //选择项目后金额改变
            row.set('ti_trade_price', price.toFixed(2));
            row.set('ti_num',ti_num);
            row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
            row.set('ti_remark', r.get('remark'));
        }
    });


    //操作结算总额
    function ti_settle_money(t,nv,ov,o){
        //操作总额同步操作单价
        var row=SUNLINE.getSelected(items_cost_grid);
        var price=(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
        row.set('ti_trade_price',price);
    }

    //操作数量时，操作结算总额和结算单价
    function ti_settle_num(t,nv,ov,o){
        var row=SUNLINE.getSelected(items_cost_grid);
        var price=0;
        if(reckon_type=='ti_trade_price'){
            if(row.get('ti_type_new')=='住宿'){
                //如果是住宿计算总额
                price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                row.set('ti_all_money',price);
            }else{
                //如果是其他计算单价
                price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                row.set('ti_trade_price',price);
            }
        }
    }

    //操作单价时,操作结算总额
    function ti_settle_price(t,nv,ov,o){
        var row=SUNLINE.getSelected(items_cost_grid);
        var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
        row.set('ti_all_money',price);
    }

    //双击删除项目
    items_cost_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            if(c==2){
                var _row=SUNLINE.getSelected(items_cost_grid);
                items_cost_store.remove(_row);
            }
        }
    });
    items_cost_store.on({
        update:function(){
            items_total_money();
        },
        datachanged:function(){
            items_total_money();
        }
    });


    //计算最终金额
    function items_total_money(){
        var total_money= 0,items_num={};
        items_cost_store.each(function(v){
            var row= v.data;
            items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
            if(reckon_type=='ti_trade_price'){
                //1.根据结算单价计算
                var money=parseFloat(row.ti_trade_price);
                if(row.ti_type_new=='住宿'){
                    money=parseFloat(row.ti_all_money);
                }
                total_money+=money;
            }else{
                //2.根据结算总额计算
            }
        });
        Ext.each(items_list,function(v,i){
            if(items_num[v.text]>0){
                Ext.getCmp(v.id).setText(v.text+'(<font color="red">'+items_num[v.text]+'</font>)');
            }else{
                Ext.getCmp(v.id).setText(v.text);
            }
        });
        console.log(total_money);
    }

    //添加项目
    function tbar_items(v){
        var v_text= v.text;
        if(v_text.indexOf('(')>0){
            v_text= v_text.split('(');
            v.text=v_text[0];
        }
        if(v.text=='车辆'){
            var type='按团计算';
            var day_new='-1';
            var name='北京中型车'
            var type_name='中型大巴'
        }else if(v.text=='导游'){
            var type='按团计算';
            var day_new='-1';
            var name='北京地接导游'
            var type_name='北京地接优秀导游'
        }else if(v.text=='住宿'){
            var type='按团计算';
            var day_new='-1';
            var name=''
            var type_name=''
        }else{
            var type='按人计算';
            var day_new=1;
            var name=''
            var type_name=''
        }
        items_cost_store.add({
            ti_insti_name:name,
            ti_cs_type_name:type_name,
            ti_type_new: v.text,
            ti_type_mode:type,
            ti_insti_type:'现金',
            ti_day:day_new,
            ti_all_money:'0',
            ti_num:'1',
            ti_trade_price:'0',
            ti_remark:''
        });
    }
    //删除成本项目
    function items_cost_del(){
        var _row=SUNLINE.getSelected(items_cost_grid);
        if (!_row){
            Ext.Msg.alert('友情提示', '请选择您想要删除的该成本项目。');
            return;
        };
        items_cost_store.remove(_row);
        //console.log(_row.data)
        if(_row.data.ti_type_new=='住宿'){
            WG.a_money=WG.a_money-parseFloat(_row.data.ti_all_money);
        }else{
            WG.a_money=WG.a_money-parseFloat(_row.data.ti_trade_price);
        }
        var a_money=0;
        a_money=WG.a_money;
        var text = '实时统计信息： 总计:<span>'+real_money(a_money)+'元</span> (由绿色价格累加得到)' ;
        Ext.getCmp('total_info').setText(text);
    }*/
    new Ext.Viewport({
        layout : 'border',
        items :items_cost_grid
    });
});