/**
 * Created by Administrator on 2016/1/28.
 */
var SelectSite={};
Ext.onReady(function () {
    var sp_fld = [
        {name:"sp_id"},
        {name:"st_id"},
        {name:"sp_go_time"},
        {name:"sp_go_times"},
        {name:"st_name"},
        {name:"sp_site_name"},
        {name:"sp_price"},
        {name:"sp_settle_price"},
        {name:"city"}
    ];
    var sp_url = $__app__ + '/TicketBusine/ku_show_win';
    var sp_store = new SUNLINE.JsonStore(sp_url, sp_fld,false);
    function farmat_money(v){
        return '<div class="farmat-money">￥'+v+'</div>'
    }
    function site_two(v,i,r){
        return r.get('td_start_time')+' ' + v +' -- '+r.get('td_end_time')+' '  + r.get('td_end_place') ;
    }
    function trf_tu(v){
        if(v=='飞机'){
            return '<i class="fa fa-plane" data-val="plane" title="飞机" style="color:blue"></i>';
        }else{
            return '<i class="fa fa-subway" data-val="subway" title="火车"  style="color:green"></i>';
        }
    }
    var sp_cm=[
        //new Ext.grid.RowNumberer({width:30}),
        {header:"交通",dataIndex:"td_traffic_type",width:50,align:'center',renderer:trf_tu},
        {header:"航班次",dataIndex:"td_fly_num",width:100},
        {header:"库存剩余",dataIndex:"all_num",width:100,align:'center'},
        {header:"始发站-目的地",dataIndex:"td_start_place",width:380,renderer:site_two}
    ];
    function time_jia(v){
        return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
    }
    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:time_jia(start_time_get)
    });
    var sp_grid = new Ext.grid.GridPanel({
        border:false,
        autoWidth : true,
        height:420,
        store:sp_store,
        renderTo:'box-site',
        style :'border-left-width:1px;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '当前没有库存信息',
            deferEmptyText : true
        },
        columns:sp_cm,
        tbar:[
            '往返类型',
            {
                xtype:"combo",
                id:"site_type",
                name:"site_type",
                width:75,
                allowBlank:false,
                store:new Ext.data.SimpleStore({
                    fields:['site_type'],
                    data:[['去程'],['返程']]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"site_type",
                displayField:"site_type",
                mode:"local",
                value:'去程'
            },
            start_time,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'st_dosearch_id',
                emptyText:'航班次、出发地、目的地等',
                width:180,
                onTriggerClick:function (e) {
                    st_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            st_dosearch();
                        }
                    }
                }
            }
        ]
    });
    function where_date(){
        if(!start_time_get || !day){
            Ext.Msg.alert('友情提示','缺少日期参数或产品天数!');
            return false;
        }
        var post_data={'day':day};
        var site_type_id=Ext.getCmp('site_type').getValue();
        var start_date_id=Ext.getCmp('start_date').getRawValue();
        var skey=Ext.getCmp('st_dosearch_id').getValue();
        if(site_type_id)post_data['td_type']=site_type_id;
        if(start_date_id)post_data['start_time']=start_date_id;
        if(skey)post_data['skey']=skey;
        return post_data;
    }

    function load_where(){
        var date_val=where_date();
        SUNLINE.baseParams(sp_store,date_val);
        sp_store.load();
    }
    load_where();
    function addDate2(date,days, split,jia){
        if (!split) split = '';
        var d=new Date(date);
        var days=parseInt(days);
        if(jia=='jia'){
            d.setDate(d.getDate()+days);
        }else{
            d.setDate(d.getDate()-days);
        }
        var month=d.getMonth()+1;
        var day = d.getDate();
        if(month<10) month = "0"+month;
        if(day<10) day = "0"+day;
        var val = d.getFullYear()+split+month+split+day;
        return val;
    };
    Ext.getCmp('site_type').on('select',function(a,b,c){
        var time_s=Ext.getCmp('start_date').getRawValue();
        var time_e='';
        if(b[0]['data']['site_type']=='返程'){
            console.log(b[0]['data']['site_type']);
            time_e=addDate2(time_s,day, '-','jia');
        }else{
            time_e=addDate2(time_s,day, '-','jian');
        }
        Ext.getCmp('start_date').setRawValue(time_e);
        load_where();

    })
    Ext.getCmp('start_date').on('select',function(){
        load_where();
    })
    function st_dosearch(){
        load_where();
    }


});
