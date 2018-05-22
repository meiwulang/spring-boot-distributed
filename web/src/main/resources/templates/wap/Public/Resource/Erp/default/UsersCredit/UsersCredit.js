
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '禁用信用支付';
    var url = $__app__ + '/UsersCredit/getListData';
    var field = [];
    var store = SUNLINE.JsonStore(url, field);
    SUNLINE.baseParams(store, {type:'show'});
    store.load();
    var cm = [
        new Ext.grid.RowNumberer({width:50,align:'center'}),
        {text: '用户名', dataIndex: 'name',width:130},
        {text: '真实姓名', dataIndex: 'realname',width:130},
        {text: '手机号', dataIndex: 'mobile',width:250},
    ];

    //左侧单位列表
    var company_box = SUNLINE.CompanyBox();
    if(_uinfo.org_type == '管理公司') {
        company_box.setValue('全部单位');
        company_box.store.on({
            load:function(){
                company_box.store.add({id:0,text:'全部单位'});
                company_box.store.sort({property : 'id',direction: 'ASC'});
            }
        });
    }else{
        company_box.setHidden(true);
        company_box.setDisabled(true);
    }

    //左边表格渲染数据列表
    var grid_left = Ext.create('Ext.grid.Panel', {
        region : 'west',
        border:false,
        store: store,
        columns: cm,
        width:590,
        split: {size: 3},
        forceFit: false, //列宽自适应
        selModel: {selType: 'checkboxmodel'},
        viewConfig: {emptyText: '暂时没有信息'},
        tbar: [
            '<b>用户列表：</b>',
            {text:'禁用',iconCls:'button-add',handler: function(){
                disableCurd(1);
            }},
            '-',
            {
                id: 'search_key',
                name: 'search_key',
                xtype: 'textfield',
                labelWidth: 50,
                width: 260,
                fieldLabel: "&nbsp;关键字",
                emptyText: '请输入姓名、手机号码查询'
            },
            {text: '查询', iconCls: 'button-sch',handler: doSearch},
            {text: '刷新', iconCls: 'button-ref', handler: function () {
                var params = {};
                params.type = 'show';
                var org_id = company_box.getValue();
                var keywords = Ext.getCmp('search_key').getValue();
                if(!isNaN(org_id) && org_id>0){
                    params.org_id = org_id;
                }
                params.keywords = keywords;
                SUNLINE.baseParams(store, params);
                store.load();
            }}
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners: {
            rowdblclick: function () {
                disableCurd(1);
            }
        },
        renderTo: Ext.getBody()
    });

    //右边 表格渲染数据列表
    var right_url = $__app__ + '/UsersCredit/getListData';
    var right_field = [];
    var right_store = SUNLINE.JsonStore(right_url, right_field);
    SUNLINE.baseParams(right_store, {type:'hide'});
    right_store.load();

    var right_cm = [
        new Ext.grid.RowNumberer({width:50,align:'center'}),
        {text: '用户名', dataIndex: 'name',width:150},
        {text: '真实姓名', dataIndex: 'realname',width:150},
        {text: '手机号', dataIndex: 'mobile',width:150},
    ];
    var grid_right = Ext.create('Ext.grid.Panel', {
        region : 'center',
        border:false,//无边框
        store: right_store,
        columns: right_cm,
        split: {size: 3},
        forceFit: false, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        selModel: {selType: 'checkboxmodel'},
        tbar: [
            '<b>已禁用：</b>',
            {
                text:'移除',
                icon: $app_public_images_path + 'delete.gif',
                cls: 'x-btn-icon',
                handler: function(){
                    disableCurd(2);
                }
            },
            {text: '刷新', iconCls: 'button-ref', handler: function () {right_store.reload();}},
            '->',
            company_box,
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler: function () {
                    window.location.reload();
                }
            }
        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: right_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners: {
            rowdblclick: function () {
                disableCurd(2);
            }
        },
        renderTo: Ext.getBody()
    });

    Ext.create('Ext.Viewport',{
        layout : 'border',
        items : [grid_left,grid_right]
    });

    company_box.on('select',function(){
        doSearch();
    });

    /**
     * 加入、移除信用支付
     * @param type 类型：1-禁用,2-移除
     */
    function disableCurd(type){
        if(type != 1 && type != 2){
            Ext.Msg.alert('友情提示', '操作类型错误！');
        }
        var params = {};
        if(type == 1){
            params.type = 'show';
            var rows = SUNLINE.getSelected(grid_left,true);
            var title_alert = '请选择要禁用的用户！';
        }else{
            params.type = 'hide';
            var rows = SUNLINE.getSelected(grid_right,true);
            var title_alert = '请选择要移除的用户！';
        }
        if(!rows.length){
            Ext.Msg.alert('友情提示', title_alert);
            return false;
        }
        var ids_arr = [];
        for (var i = 0; i < rows.length; i++) {
            ids_arr[i] = parseInt(rows[i].data.id);
        }
        params.id_str = ids_arr.join(',');
        Ext.Ajax.request({
            url: $__app__ + '/UsersCredit/disableCurd',
            params: params,
            method: 'POST',
            success: function (response, otps) {
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status == 1) {
                    doSearch();
                }else {
                    Ext.Msg.alert('友情提示', msg);
                }
            },
            failure: function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    /**
     * 搜索方法
     */
    function doSearch() {
        var params = {};
        params.type = 'show';
        var org_id = company_box.getValue();
        var keywords = Ext.getCmp('search_key').getValue();
        if(!isNaN(org_id) && org_id>0){
            params.org_id = org_id;
        }
        //左侧store加载
        params.keywords = keywords;
        SUNLINE.baseParams(store, params);
        store.currentPage = 1;
        store.load();
        //右侧store加载
        params.type = 'hide';
        params.keywords = '';
        SUNLINE.baseParams(right_store, params);
        right_store.currentPage = 1;
        right_store.load();
    }

});