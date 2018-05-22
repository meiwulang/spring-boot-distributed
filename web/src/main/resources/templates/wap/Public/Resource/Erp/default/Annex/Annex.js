/**
 * Created by cjl on 2017/7/19.
 */
var bot_store = {};
var grid = {};
Ext.onReady(function () {
    //可编辑设置
    var isCompanyHide = _uinfo.org_type == '管理公司' ? false : true;

    var is_edit = Ext.create('Ext.form.TextField', {
        allowBlank: false,
        maxLength: 20,
    });

    //标题字段
    var cm = [
        new Ext.grid.RowNumberer({width: 50}),
        {text: '附件ID', dataIndex: 'pa_id', width: 100, align: 'center', hidden: true},
        {
            text: '附件名称（<span style= "color:red">单击名称可编辑</span>）',
            dataIndex: 'pa_name',
            editor: is_edit,
            width: 200,
            align: 'left'
        },
        {text: '附件链接', dataIndex: 'pa_url', width: 340, align: 'left', renderer: addLink},
        {text: '所属单位', dataIndex: 'pa_org_name', width: 200, align: 'center'},
        {text: '文件大小', dataIndex: 'pa_size', width: 100, align: 'right'},
        {text: '文件类型', dataIndex: 'pa_suffix', width: 80, align: 'center'},
        {text: '添加时间', dataIndex: 'pa_addtime', width: 150, align: 'center'},
        {text: '最后修改时间', dataIndex: 'pa_updatetime', width: 150, align: 'center'},
    ];

    //store
    var url = $__app__ + '/Annex/getList';
    var field = ['pa_id', 'pa_name', 'pa_url', 'pa_org_id', 'pa_org_name', 'pa_size', 'pa_suffix', 'pa_addtime', 'pa_updatetime'];
    bot_store = SUNLINE.JsonStore(url, field);

    //所属单位
    var company_box = SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config: {
            hidden: isCompanyHide,
            displayField: 'text',
            valueField: 'id',
            fieldLabel: '所属单位',
            labelWidth: 60,
            width: 300,
            labelAlign: 'right',
            value: '',
            pageSize: 20,
            listConfig: {
                minWidth: 340
            }
        }
    });
    company_box.on('select', function (c, r) {
        doSearch();
    });

    //表格渲染数据列表
    grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: bot_store,
        columns: cm,
        viewConfig: {emptyText: '暂无附件'},
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners: {
                    edit: function (v, g) {
                        var data = SUNLINE.getSelected(g.grid).data;
                        Ext.Ajax.request({
                            url: $__app__ + '/Annex/updateAnnexName',
                            params: {pa_id: data.pa_id, pa_name: data.pa_name},
                            method: 'post',
                            success: function (response) {
                                var r = Ext.decode(response.responseText);
                                if ( !r.success ) {
                                    //bot_store.load();
                                    Ext.Msg.alert('友情提示', r.message);
                                }
                            }
                        });
                    }
                }
            })
        ],
        tbar: [
            {text: '批量上传附件', iconCls: 'button-add', id: 'batch_id', handler: editAnnex},
            {text: '删除', iconCls: 'button-del', id: 'del_id', handler: delAnnex},
            '-',
            {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn'},
            {
                text: '刷新', iconCls: 'button-ref', id: 'ref_id', handler: function () {
                bot_store.reload()
            }
            },
            '-',
            company_box,
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'Search_key',
                emptyText: '附件名称、文件类型',
                width: 160,
                onTriggerClick: function (e) {
                    doSearch();
                },
                listeners: {
                    "specialkey": function (_t, _e) {
                        if (_e.keyCode == 13) {
                            doSearch();
                        }
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载送票站点',
                handler: function () {
                    window.location.reload();
                }
            }

        ],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: bot_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无附件'
        }),
        viewConfig: { //面板可复制属性
            enableTextSelection: true
        },
        renderTo: Ext.getBody()
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    //查询条件搜索信息
    function doSearch() {
        var org_id = Ext.getCmp('p_org_name_id').getValue();
        var keyword = Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(bot_store, {org_id: org_id, keyword: keyword});
        bot_store.currentPage = 1;
        bot_store.load();
    }


    /**
     * 删除附件
     */
    function delAnnex() {
        row = SUNLINE.getSelected(grid);
        if (!row) {
            return ExtAlert('请选择要删除的附件信息!', '友情提示');
        }
        Ext.MessageBox.confirm('友情提示', '你确定要删除该附件？', function (v) {
            if ('yes' == v) {
                Ext.Ajax.request({
                    url: $__app__ + '/Annex/del',
                    params: {pa_id: row.data.pa_id},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.success) {
                            //Ext.Msg.alert('信息提示', '附件删除成功!');
                            bot_store.reload(); //重新加载数据
                        } else {
                            Ext.Msg.alert('信息提示', ret.message);
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '附件删除出错!');
                    }
                });
            }
        });
    };


    /**
     * 附件链接点击可下载
     */
    function addLink(url) {
        return url ? '<a href="' + url + '" target="_blank">' + url + '</a>' : '';
    }

    //注入日志处理流程
    ziyo_log({listeners: [{grid: grid, action: 'Annex', table: 'ProductsAnnex', pk_id: 'pa_id'}]});
});
