/**
 * Created by Administrator on 2016/1/28.
 */
var SelectSite={};
Ext.onReady(function () {
    var start_site_name='未选择站点';
    if(SiteName){
        start_site_name=SiteName;
    }else if(TrafficAll.goto_site){
        start_site_name=TrafficAll.goto_site.f_traffic_start;
        if(site_type=='回程'){
            start_site_name=TrafficAll.goto_site.f_traffic_end;
        }
    }
    if(select_site=='yes')$('input[name=site_name]').attr('checked',false);
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
    var sp_url = $__app__ + '/Buy/buy_site_price';
    var sp_store=SUNLINE.GroupingStore(sp_url,sp_fld,{sortInfo:{field:'sp_go_times',direction: "ASC"}, groupField:'st_name'},false);
    SUNLINE.baseParams(sp_store,{site_name:start_site_name,start_date:start_date,site_type:site_type});
    sp_store.load();
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "上车站点: {name}"
    });

    function farmat_money(v){
        return '<div class="farmat-money">￥'+v+'</div>'
    }

    var sp_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ID",dataIndex:"sp_id",width:60, hidden: true},
        {header:"sp_stid",dataIndex:"st_id",width:60, hidden: true},
        {header:"出发时间",dataIndex:"sp_go_time",width:80},
        {header:"上车站点",dataIndex:"st_name",width:300},
        {header:"起(始)点站",dataIndex:"sp_site_name",width:150},
        {header:"所在城市",dataIndex:"city",width:200},
        {header:"价格",dataIndex:"sp_settle_price",width:130,renderer:farmat_money}
    ];

    var sp_grid = new Ext.grid.GridPanel({
        border:false,
        autoWidth : true,
        height:420,
        store:sp_store,
        renderTo:'site-id',
        style :'border-left-width:1px;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '当前城市占无固定上车点。请选择【地图在线选择】或【自行去:'+start_site_name+'】',
            deferEmptyText : true
        },
        columns:sp_cm,
        features: [groupingFeature],
        tbar:[
            {text:'<i class="fa fa-map-marker"></i> 地图在线选择',cls: 'btn-icon',id:'map',handler:show_map},
            '-',
            {text:'<i class="fa fa-car"></i> 自行去出发口岸',cls: 'btn-icon',id:'car_id',handler:site_fn},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'st_dosearch_id',
                emptyText:'出发地名称、类型、拼音码',
                width:200,
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
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:10,
            store:sp_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有班车策略信息'
        })
    });

    function st_dosearch(){
        var skey=Ext.getCmp('st_dosearch_id').getValue();
        SUNLINE.baseParams(sp_store,{skey:skey},true);
        sp_store.load();
    }

    Ext.getCmp('map').on('click',function(){
        sp_store.reload();
    })
    function show_map(){
        $.layer({
            type: 2,
            border: [0],
            title: false,
            iframe: {src : $__app__+'/Buy/showMap'},
            area: ['890px', '545px']
        });
    }
    /*var map_win = new Ext.Window({
        title:"座位调整",
        width:890,
        height:500,
        autoScroll: true,
        closeAction:'hide',
        html: '<iframe id = "map" name = "map" src = "'+$__app__+'/Buy/showMap" width = "100%" height = "100%"></iframe>',
        buttons:[
            {text:'调整'},
            {text:'关闭',handler:function(){ map_win.hide(); }}
        ]
    });*/

    Ext.getCmp('car_id').setText('<i class="fa fa-car"></i> 自行解决：'+start_site_name)
    //选择行赋值事件
    sp_grid.on('select',function(i,v){
        SelectSite = {};
        var row=SUNLINE.getSelected(sp_grid);
        SelectSite=row.data;
        site_txt();
    })


    function site_txt(){
        $('.site-cls').html(SelectSite.sp_go_time+' '+SelectSite.st_name+' [接送费:'+SelectSite.sp_settle_price+']');
    }
    site_confirm();
    function site_confirm(){
        var check_input=$('input[type=checkbox]');
        check_input.unbind();
        check_input.click(function(){
            if($(this).attr('checked')=='checked'){
                $(this).attr('checked',false);
            }else{
                $(this).attr('checked',true);
            }
        });

        var confirm_id=$('.site-confirm');
        confirm_id.unbind();
        confirm_id.click(function(){
            if(!SelectSite.st_name){
                layer.msg('请选择上车站点!');
                return false;
            }
            var site_name=$('input[name=site_name]');
            var site_type=$('input[name=site_back]');
            var bool=false,type_site={status:false,type:site_type.attr('data-type')};
            if(site_name.attr('checked')=='checked')bool=true;
            if(site_type.attr('checked')=='checked'){
                type_site={status:true,type:site_type.attr('data-type')};
            };
            var tr_id;
            //if(!SiteName)tr_id=TrafficAll.id;
            tr_id=TrafficAll.id;
            //console.log(tr_id)
            parent.site_select_fn(SelectSite,tr_id,seat_num,bool,type_site);
            clos_layer_combox();
        });
        var select_id=$('#select-site').find('.float-right');
        select_id.unbind();
        select_id.click(function(){
            $('.site-cls').html('');
            SelectSite={};
        });

        var cell_id=$('.site-cell');
        cell_id.unbind();
        cell_id.click(function(){
            clos_layer_combox();
        });
    }
    function site_fn(){
        SelectSite={};
        SelectSite['st_name']=start_site_name;
        $('.site-cls').html(start_site_name);
    }
    function  clos_layer_combox(){
        var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
        parent.layer.close(index); //执行关闭
    }

    setTimeout(function(){
        window.map_name_fn=function(data){
            SelectSite.st_name=data.name;
            SelectSite.sp_map=data.map;
            $('.site-cls').html(data.name);
        };
    },200);


});
