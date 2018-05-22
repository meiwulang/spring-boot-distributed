
var detail_content;
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '错误日志';
    var url = $__app__ + '/SystemLogs/getListData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);
    store.load();
    var cm = [
        {text: '编号#ID', dataIndex: 'log_id',width:70},
        {text: '日志类型', dataIndex: 'log_type',width:120},
        {text: '上报URL', dataIndex: 'log_url',width:340},
        {text: '上报时间', dataIndex: 'log_time',width:150},
        {text: '用户名', dataIndex: 'log_u_name',width:110},
        {text: '姓名', dataIndex: 'log_u_realname',width:110},
    ];

    //日志类型
    var type_url = $__app__ + '/SystemLogs/getListDataType';
    var type_field = [];
    var type_store = SUNLINE.JsonStore(type_url, type_field);
    var box_type = Ext.create('Ext.form.ComboBox', {
        id: 'search_log_type',
        fieldLabel: '日志类型',
        labelWidth: 60,
        labelAlign: 'right',
        store: type_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '全部类型',
        width:200
    });

    //左边表格渲染数据列表
    var grid_left = Ext.create('Ext.grid.Panel', {
        region : 'west',
        border:false,
        store: store,
        columns: cm,
        width:900,
        split: {size: 5},
        forceFit: false, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: [
            box_type,
            {
                id: 'search_key',
                name: 'search_key',
                xtype: 'textfield',
                labelWidth: 50,
                width: 300,
                fieldLabel: "&nbsp;关键字",
                emptyText: '请输入上报URL、姓名、用户名查询'
            },
            {text: '查询', iconCls: 'button-sch',handler: doSearch},
            {text: '刷新', iconCls: 'button-ref', handler: function () {store.reload();}}
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: 20,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners: {
            selectionchange: function (i,r) {
                SUNLINE.baseParams(detail_store, {log_id:r[0].data.log_id});
                detail_store.load();
            }
        },
        renderTo: Ext.getBody()
    });

    var detail_tpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">日志编号：</span>#{id}</div>',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">上报URL：</span>{url}</div>',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">上报时间：</span>{time}</div>',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">上报IP：</span><a href="http://www.ip138.com/ips138.asp?ip={ip}&action=2" target="_blank">{ip}</a></div>',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">反馈信息：</span>{remark}</div>',
        '<div style="margin:10px;"><span style="font-weight:bold;color:#555;">上报内容：</span></div>',
        '<div style="margin:10px;padding:10px;border:1px solid #ccc"><pre>{[this.format_json(values.data)]}</pre></div>',
        '</tpl>',
        {
            format_json: function(v){
                if(!v){
                    detail_content = '无数据！';
                    return '无数据！';
                }
                v = JSON.parse(v);
                detail_content = v;
                return JSON.stringify(v,null,2);
            }
        }
    );
    //新的DataView数据源
    Ext.define('detailStore', {
        extend: 'Ext.data.Model',
        fields: [ "id","url","time","remark","data" ]
    });
    var detail_store = Ext.create('Ext.data.Store', {
        model: 'detailStore',
        data : [ ]
    });
    var detail_url = $__app__ + '/SystemLogs/getListDataDetail';
    var detail_store = SUNLINE.JsonStore(detail_url,['log_id','log_url',"log_time",'log_remark','log_data','log_ip'],false);
    detail_store.on('load', function(d_store){
        var data = [];
        d_store.each(function(record){
            var log_id = record.get('log_id');
            var log_url = record.get('log_url');
            var log_time = record.get('log_time');
            var log_ip = record.get('log_ip');
            var log_remark = record.get('log_remark');
            var log_data = record.get('log_data') ? record.get('log_data') : "";
            data.push({id:log_id,url:log_url,time:log_time,ip:log_ip,remark:log_remark,data:log_data});
            //$("#songReqJson").text(JSON.stringify(log_data,null,2));
        });

        detail_store.loadData(data);
    });

    var detail_view = new Ext.view.View({
        store : detail_store,
        tpl : detail_tpl,
        multiSelect : true,
        simpleSelect : true,
        style:'border-top:1px solid #ccc',
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        emptyText : '<div style="padding:10px">暂无信息......</div>',
        plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });
    //右边 表格渲染数据列表
    var grid_right = Ext.create('Ext.Panel', {
        region:'center',
        items:detail_view,
        cls : 'adver_view',
        autoScroll: true,
        tbar: [
            '<b>错误日志详情</b>',
            '->',
            {text: 'console调试', iconCls: 'button-log',handler: function(){
                console.log(detail_content);
            }},
            {text: '刷新', iconCls: 'button-ref', handler: function () {detail_store.reload();}},
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler: function () {
                    window.location.reload();
                }
            }
        ],
    });

    Ext.create('Ext.Viewport',{
        layout : 'border',
        items : [grid_left,grid_right]
    });

    /**
     * 搜索方法
     */
    function doSearch() {
        var params = {};
        var keywords = Ext.getCmp('search_key').getValue();
        var log_type = Ext.getCmp('search_log_type').getValue();
        if(log_type  !== null){
            params.log_type = log_type;
        }
        params.keywords = keywords;
        SUNLINE.baseParams(store, params);
        store.currentPage = 1;
        store.load();
    }
});

