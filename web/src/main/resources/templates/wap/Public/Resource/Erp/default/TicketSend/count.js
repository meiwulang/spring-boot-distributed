/**
 * Created by admin on 2017/4/14.
 */
var pageSize = 20;
Ext.onReady(function () {

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '游客信息列表';
    var url = $__app__ + '/TicketSend/getCountData';
    var field = [];
    var store = SUNLINE.GroupingStore(url, field, {}, true,{},pageSize);

    var cm = [
        {text: '送票站点', dataIndex: 'st_start_station', width:200, align: 'center'},
        {text: '送票日期', dataIndex: 'st_start_date', width: 200, align: 'center'},
        {text: '总送票数', dataIndex: 'total', width: 120, align: 'center'},
        {text: '已寄出', dataIndex: 'send', width:100, align: 'center'},
        {text: '已签收', dataIndex: 'sign', width:100, align: 'center'},
        {text: '送票类型', dataIndex: 'st_s_type', width: 100, align: 'center'},
        {text: '送票电话', dataIndex: 'st_s_mob', width: 200, align: 'center'},
    ];
    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        viewConfig: {emptyText: '暂时没有信息'},
        tbar:{
            items:[
                {text:'送票详情',
                    id:'',
                    iconCls: 'button-view',
                    disabled:false,
                    handler:count_view,
                },
                '送票日期:',
                SUNLINE.ExtDateField({
                        id: 'st_start_date',
                        name: 'st_start_date',
                        labelWidth: 0,
                        labelAlign: "right",
                        style: 'margin-top:5px;',
                        fieldLabel: " ",
                        labelSeparator: '',
                        width: 110,
                        gang: 'st_end_date',
                        start: true,
                        value: sys_time.start
                    }
                ),
                '~',
                SUNLINE.ExtDateField({
                        id: 'st_end_date',
                        name: 'st_end_date',
                        labelWidth: 0,
                        labelAlign: "right",
                        style: 'margin-top:5px;',
                        fieldLabel: " ",
                        labelSeparator: '',
                        width: 110,
                        gang: 'st_start_date',
                        value: sys_time.end
                    }
                ),
                '关键字:',
                {
                    xtype: 'textfield',
                    id: 'keywords',
                    name: 'keywords',
                    width: 300,
                    emptyText: '送票站点、送票电话'
                },
                {
                    text: '查询',
                    iconCls: 'button-sch',
                    handler: function () {
                        doSearch();
                    },
                },
            ]
        },
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        renderTo: Ext.getBody(),
        listeners:{ //监听绑定双击事件，双击打开站点详情
            rowdblclick:function(){ viewWin.show(); }
        }
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    //统计搜索
    function doSearch(){
        var st_start_date = Ext.Date.format(Ext.getCmp('st_start_date').getValue(), 'Y-m-d');
        var st_end_date = Ext.Date.format(Ext.getCmp('st_end_date').getValue(), 'Y-m-d');
        var skey = Ext.util.Format.trim(Ext.getCmp('keywords').getValue());
        var search_params = {
            st_start_date: st_start_date,
            st_end_date: st_end_date,
            skey: skey,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    function count_view(){
        //获取被点击一行的数据
        var row = SUNLINE.getSelected(grid);
        if ( !row ) {
            return ExtAlert('请选择您要查看的站点!', '提示');
        }
        viewWin.show();
    }

    /*站点详情窗口(start)*/
    var viewWin = new Ext.Window({
        title:'送票详情',
        width:1130,
        height:550,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        resizable:false,
        modal:true,
        html:'<iframe id="send_view" name="send_view" src="" width="1130" style=" height:480px;" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint, id:'doprint_btn'},
            {text : '关闭', handler:function(){viewWin.hide();}}
        ]
    });

    //统计详情显示加载详情界面及数据
    viewWin.on("show",function(){
        var row = SUNLINE.getSelected(grid);
        var d = row.data;
        var params = '&st_start_station='+d.st_start_station +'&st_start_date='+d.st_start_date+'&st_s_type='+d.st_s_type+'&st_s_mob='+d.st_s_mob+'&total='+d.total;
        var url = $__app__ + '/TicketSend/view?_dc=' + time()+params;
        window.send_view.location = url;
    });

    /**
     * 打印界面
     */
    function doprint(){
        window.send_view.focus();
        window.send_view.print();
    }
});
