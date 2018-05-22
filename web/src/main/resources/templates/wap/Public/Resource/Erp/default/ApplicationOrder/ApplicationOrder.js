var ROW={};
var LgirdVal = {};//存储部门所属单位的信息
Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '订单管理';
    var url=$__app__+'/ApplicationOrder/dataJson';
    var field=['ao_id','ao_number','ao_org_name','ao_money','ao_start_date','ao_end_date'];
    var store=SUNLINE.JsonStore(url,field,false);
    var c_field=['app_id','app_name'];
    var cm=[
        { text: 'ID',  dataIndex: 'ao_id'},
        { text: '订单号',  dataIndex: 'ao_number',width:160 },
        { text: '使用单位',  dataIndex: 'ao_org_name' ,width:200},
        { text: '价格',  dataIndex: 'ao_money' ,width:200,renderer:price_format},
        { text: '开始日期',  dataIndex: 'ao_start_date' ,width:200,renderer:time_format},
        { text: '结束日期',  dataIndex: 'ao_end_date',width:150,renderer:time_format},
    ];


    function price_format(val){
        return val>0?val:'免费';
    }
    function time_format(val){
        if(val != null){
            var date=int2date(val,0);
            return date;
        }
    }

    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        autoScroll: true,
        columns:cm,
        viewConfig:{
            emptyText : '暂时没有信息',
            deferEmptyText : true
        },
        loadMask:{msg:'数据载入中，请稍候'},
        tbar:[
            {text:'删除',iconCls:'button-del',handler:del},
            {text:'刷新',iconCls:'button-ref',handler:function(){
                    store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'wg_Search',
                iconCls:'button-sch',
                emptyText : '查询使用单位，订单号',
                width:200,
                onTriggerClick:function(e){
                    wgSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            wgSearch();
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){
                    window.location.reload();
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });
    var lurl =$__app__+'/Application/dataJson';
    var lfield=['app_id','app_key','app_name','app_buy_count','app_view_count'];
    var lstore=SUNLINE.JsonStore(lurl,lfield);
    var lcm=[
        {text:'编号',dataIndex:'app_id',width:80 },
        {text:'应用名称',dataIndex:'app_name',width:150},
        {text:'已售数',dataIndex:'app_buy_count',width:80 },
        {text:'浏览量',dataIndex:'app_click_count',width:80 }
    ];

    var lgrid = Ext.create('Ext.grid.Panel',{
        region:'west',
        store:lstore,
        columns:lcm,
        split:true,
        width:400,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            {
                xtype:'buttongroup',
                id:'search_form',
                height:80,
                columns:3,
                padding:"10 0 0 0",
                items:[
                    {
                        fieldLabel: '适用范围',
                        labelAlign:'right',
                        labelWidth:70,
                        width:320,
                        colspan:2,
                        xtype:'combobox',
                        id:'d_type',name: 'd_type',
                        triggerAction:'all',
                        queryParam:'d_type',
                        store:Ext.create('Ext.data.Store', {
                            fields:['text','leaf'],
                            proxy: {
                                type: 'ajax',
                                url: $__app__+'/Dict/typeCombo',
                                extraParams:{all:true},
                                actionMethods:{create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
                                reader: {type: 'json',rootProperty: 'data'}
                            }
                        }),
                        displayField: 'text',
                        valueField: 'text',
                        emptyText:' 请选择公司类型 ',
                        allowBlank: false,
                    }
                    ,
                    {text:'查询',rowspan:3,iconCls: 'searchico',iconAlign: 'top',height:50,style:'margin:3px 5px 3px 10px;',handler:orgSearch},
                    {
                        labelAlign:'right',
                        labelWidth:70,
                        colspan:2,
                        fieldLabel: '应用名称',
                        xtype:'textfield',
                        id:'org_Search',
                        emptyText : '请输入应用名称',
                        iconCls:'button-sch',
                        width:320
                    }

                ]
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store: lstore,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });

    lgrid.on('cellclick',function(sm,rowldx,c,r){
        LgirdVal = r.data;
        SUNLINE.baseParams(store,{app_key:LgirdVal.app_key});
        store.load({params:{page:1,start:0}});
    })

    ziyo_log({ listeners : [{grid: grid, action:'ApplicationOrder', pk_id:'ao_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [grid,lgrid]
    });

    function wgSearch(){
        var skey=Ext.getCmp('wg_Search').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage = 1;
        store.load();
    }
    function orgSearch(){
        var skey=Ext.getCmp('org_Search').getValue();
        SUNLINE.baseParams(lstore,{skey:skey});
        lstore.currentPage = 1;
        lstore.load();
        store.removeAll();
    }



    function del(){
        var ret=SUNLINE.getSelected(grid);
        if(ret==null){
            Ext.Msg.alert('友情提示','请选择你要删除记录！');
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/ApplicationOrder/del',
                    params: {
                        ao_id:ret.data.ao_id
                    },
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info.msg);
                            store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })
    }

});