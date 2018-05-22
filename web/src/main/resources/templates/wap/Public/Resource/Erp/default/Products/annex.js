/**
 * Created by cjl on 2017/7/21.
 */

var is_edit = Ext.create('Ext.form.TextField', {
    allowBlank: false,
    maxLength: 20,
});

var pageSize = 10;

var topCm = [
    {header: "附件ID", dataIndex: "pa_id", align: 'center', hidden: true, width: 80},
    {
        header: "已选附件名称（<span style= 'color:red'>单击名称可编辑</span>）",
        dataIndex: "pa_name",
        align: 'left',
        editor: is_edit,
        width: 300
    },
    {header: "文件大小", dataIndex: "pa_size", align: 'right', width: 100},
    {header: "文件类型", dataIndex: "pa_suffix", align: 'center', width: 80},
    {header: "最后修改时间", dataIndex: "pa_updatetime", align: 'center', width: 150},
];
var botCm = [
    {header: "附件ID", dataIndex: "pa_id", align: 'center', hidden: true, width: 80},
    {
        header: "未选附件名称(<span style='color:red'>单击名称可编辑</font>)",
        dataIndex: "pa_name",
        align: 'left',
        editor: is_edit,
        width: 300
    },
    {header: "文件大小", dataIndex: "pa_size", align: 'right', width: 100},
    {header: "文件类型", dataIndex: "pa_suffix", align: 'center', width: 80},
    {header: "最后修改时间", dataIndex: "pa_updatetime", align: 'center', width: 150},
];

var annex_url = $__app__ + '/Annex/getAnnex';
var top_store = SUNLINE.JsonStore(annex_url, [], false, {pageSize: pageSize});
var bot_store = SUNLINE.JsonStore(annex_url, [], false, {pageSize: pageSize});

//上面
var topForm = Ext.create('Ext.grid.Panel', {
    region: 'center',
    store: top_store,
    columns: topCm,
    border: false,
    height: 260,
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                edit: function (v, g) {
                    var data = SUNLINE.getSelected(g.grid).data;
                    var pa_name = data.pa_name;
                    var pa_id = data.pa_id;
                    Ext.Ajax.request({
                        url: $__app__ + '/Annex/updateAnnexName',
                        params: {pa_id: pa_id, pa_name: pa_name},
                        method: 'post',
                        success: function (response) {
                            var r = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', r.message);
                            if (r.success) {
                                top_store.load();
                            }
                        }
                    });
                }
            }
        })
    ],
    tbar: [
        {text: '取消选择', iconCls: 'button-del', handler: delAnnex},
        {text: '批量上传附件', iconCls: 'button-add', id: 'batch_id_bind', handler: editAnnex},
    ],
    selModel: {selType: 'checkboxmodel'},
    viewConfig: {emptyText: '没有附件信息'},
});

//下面
var botForm = Ext.create('Ext.grid.Panel', {
    region: 'center',
    store: bot_store,
    columns: botCm,
    border: false,
    height: 300,
    tbar: [
        {text: '选择', iconCls: 'button-sh', handler: bindAnnex},
    ],
    style: "border-top:2px solid #ccc",
    selModel: {selType: 'checkboxmodel'},
    viewConfig: {emptyText: '暂无附件！'},
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                edit: function (v, g) {
                    var data = SUNLINE.getSelected(g.grid).data;
                    var pa_name = data.pa_name;
                    var pa_id = data.pa_id;
                    Ext.Ajax.request({
                        url: $__app__ + '/Annex/updateAnnexName',
                        params: {pa_id: pa_id, pa_name: pa_name},
                        method: 'post',
                        success: function (response) {
                            var r = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', r.message);
                            if (r.success) {
                                bot_store.load();
                            }
                        }
                    });
                }
            }
        })
    ],
    bbar: new Ext.PagingToolbar({
        pageSize: pageSize,
        store: bot_store,
        displayInfo: true,
        displayMsg: '第{0} 到 {1} 条数据 共{2}条',
        emptyMsg: '没有附件信息，快去添加哦'
    })
});

var annex_win = Ext.create('Ext.window.Window', {
    width: 700,
    height: 605,
    bodyBorder: true,
    layout: 'border',
    viewModel: true,
    modal: true,
    title: '附件管理',
    closeAction: 'hide',
    items: [{
        region: 'north',
        collapsible: false,
        autoScroll: true,
        items: [topForm],
    }, {
        region: 'center',
        collapsible: false,
        autoScroll: true,
        items: [botForm]
    }
    ],
});

//当附件管理打开时
annex_win.on('show', function () {
    var p_id = annex_win.pid;
    //重加载top_store**********************
    SUNLINE.baseParams(top_store, {status: 0, p_id: p_id});
    top_store.currentPage = 1;
    top_store.load();
    //重加载bot_store**********************
    SUNLINE.baseParams(bot_store, {status: 1, p_id: p_id});
    bot_store.currentPage = 1;
    bot_store.load();
});


/**
 * 打开附件管理界面
 */
function annexSetting() {
    var row = SUNLINE.getSelected(products);
    if (!row) {
        Ext.Msg.alert('友情提示', '请先选择线路信息！');
        return;
    }
    ;
    annex_win.pid = row.data.p_id;
    //打开附件弹窗
    annex_win.show();
}

/**
 * 绑定附件
 */
function bindAnnex() {
    var data = SUNLINE.getSelected(botForm, true);
    if (data == false) {
        Ext.Msg.alert('信息提示', '请勾选未绑定附件！');
        return;
    }
    Ext.each(data, function (t) {
        top_store.add(t);
        bot_store.remove(t);
    });
    //保存产品附件信息
    saveAnnex(1);
}

/**
 * 取消附件
 */
function delAnnex() {
    var data = SUNLINE.getSelected(topForm, true);
    if (data == false) {
        Ext.Msg.alert('信息提示', '请勾选已选附件！');
        return;
    }
    Ext.each(data, function (t) {
        bot_store.add(t);
        top_store.remove(t);
    });
    //保存产品附件信息
    saveAnnex(0);
}

/**
 * 绑定附件
 * @param string type 1-绑定 0-取消绑定
 */
function saveAnnex( type ) {
    var pid = annex_win.pid; //产品ID
    var pa_id = [];
    top_store.each(function (record) {
        pa_id.push(record.get('pa_id'));
    });
    pa_id = pa_id.sort().join(','); //产品ID字符串列表

    Ext.Ajax.request({
        url: $__app__ + '/Annex/updateProducts',
        params: {pid: pid, pa_id: pa_id,type:type},
        method: 'POST',
        success: function (response, otps) {
            var ret = Ext.decode(response.responseText);
            if (ret.success) {
                //Ext.Msg.alert('信息提示', ret.message);
                bot_store.currentPage = 1;
                bot_store.load();
                top_store.currentPage = 1;
                top_store.load();
            } else {
                Ext.Msg.alert('信息提示', ret.message);
            }
        },
        failure: function (response, otps) {
            Ext.Msg.alert('信息提示', '附件绑定出错!');
        }
    });
}
