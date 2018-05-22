var pageSize = 20; //每页记录数
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var url = $__app__ + '/TicketPerson/ticketDataJson';
    var field = ['sh_id', 'sh_start_station', 'sh_type', 'sh_mob', 'sh_edit_time'];
    var store = SUNLINE.JsonStore(url, field);

    /**
     * 送票人添加或编辑
     */
    function ticketEdit(obj) {
        //重新加载数据
        addForm.reset();
        if ('add_id' == obj.id) { //************添加
            //设置标题
            var thisTitle = '添加送票站点';
            panel.setTitle(thisTitle, obj.iconCls);
            panel.show(obj.id);
        } else if ('edit_id' == obj.id) { //***********编辑
            var row = SUNLINE.getSelected(shuttle);
            if (!row) {
                return ExtAlert('请选择需要编辑的送票站点!', '友情提示');
            }
            //重新加载数据和显示旧的数据
            var thisTitle = '编辑送票站点';
            panel.setTitle(thisTitle, obj.iconCls);
            addForm.getForm().setValues(row.data);
            Ext.getCmp('sh_type').setRawValue(row.data.sh_type);
            Ext.getCmp('sh_start_station').setRawValue(row.data.sh_start_station);
            panel.show();
        }
    }

    /**
     * 送票站点搜索
     */
    function doSearch() {
        var keyword = Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(store, {keyword: keyword});
        store.currentPage = 1;
        store.load();
    }

    //送票人删除
    function ticketDel() {
        var row = SUNLINE.getSelected(shuttle);
        if (null == row) {
            return ExtAlert('请选择你要删除的内容!', '友情提示');
        }
        var myMask = SUNLINE.LoadMask('数据处理中，请稍候...');
        myMask.show();
        Ext.MessageBox.confirm('友情提示', '你确定要删除该内容？', function (v) {
            if ('yes' == v) {
                Ext.Ajax.request({
                    url: $__app__ + '/TicketPerson/del',
                    params: {sh_id: row.data.sh_id},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (ret.success) {
                            Ext.Msg.alert('信息提示', '送票站点删除成功!');
                            //重新加载数据
                            store.reload();
                        } else {
                            Ext.Msg.alert('信息提示', '送票站点删除失败!');
                        }
                        myMask.hide();
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '送票站点出错!');
                        myMask.hide();
                    }
                });
            }
        });
    }

    /**
     * 循环给ID赋值
     * @param data
     */
    function setTicketPerson(data) {
        for (var key in data) {
            Ext.getCmp(key).setValue(data[key]);
        }
    }

    //交通类型
    // var sh_type = SUNLINE.DictComBox_false({
    //     id: "sh_type",
    //     name: "sh_type",
    //     fieldLabel: '交通类型',
    //     labelWidth: 90,
    //     width: 200,
    //     allowBlank: false,
    //     labelAlign: 'right',
    //     displayField: "d_text",
    //     valueField: "d_text",
    // }, {d_type: "交通类目"});
    var sh_type = SUNLINE.LocalComob({
        id: 'sh_type',
        fields: ['d_text'],
        data: [
            {'d_text': '火车'},
        ],
        config: {
            displayField: 'd_text',
            valueField: 'd_text',
            fieldLabel: '交通类目',
            allowBlank: true,
            id: 'sh_type',
            name: 'sh_type',
            labelWidth: 90,
            labelAlign: 'right',
            width: 300,
            value: '火车'
        }
    });

    //送票站点
    var box_station = SUNLINE.CompanyBox({
        config:{
            id: 'sh_start_station',
            name: 'sh_start_station',
            displayField:'sd_name',
            valueField:'sd_name',
            fieldLabel:'送票站点',
            labelWidth:90,
            width:300,
            labelAlign: 'right',
            allowBlank: false,
            pageSize:20,
            emptyText:'请选择',
            listConfig:{
                minWidth:360
            }
        },
        url:$__app__ + '/TicketPerson/getStartStationList',
        fields:['sd_name'],
    });

    //送票人手机号
    var mobile = Ext.create('Ext.form.TextField', {
        id: "sh_mob",
        name: "sh_mob",
        fieldLabel: '联系号码',
        labelAlign: 'right',
        labelWidth: 90,
        width: 300,
        allowBlank: false,
        vtype: 'Mobile',
    });

    //添加或编辑送票人面板
    var addForm = Ext.create('Ext.form.FormPanel', {
        border: false,
        padding: 15,
        bodyStyle: 'background:none;',
        defaults: {
            defaults: {
                margin: '10 0',
                xtype: 'textfield',
            }
        },
        items: {
            cls: 'tcol2',
            items: [
                {id: "sh_id", name: "sh_id", hidden: true, allowBlank: true},
                sh_type,
                box_station,//始发站点的名称
                mobile,
            ]
        },
    });

    //送票人添加或编辑的面板设置
    var panel = Ext.create('Ext.window.Window', {
        width: 380,
        bodyBorder: true,
        modal: true,
        closeAction: 'hide',
        items: [addForm],
        buttons: [{
            text: '提交',
            handler: function () {
                var param = addForm.getForm();
                //验证是否为空
                if (!param.isValid()) {
                    return ExtAlert('请在红色边框里面填写正确格式的数据', '提示');
                }
                ;
                Ext.Ajax.request({
                    url: $__app__ + '/TicketPerson/save',
                    params: param.getValues(),
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if (1 == ret.success) {
                            Ext.Msg.alert('信息提示', ret.message + '送票站点成功!');
                            //重新加载数据
                            store.reload();
                            addForm.reset();
                            panel.hide();
                        } else if (2 == ret.success) {
                            Ext.Msg.alert('信息提示', '该送票站点已存在，请重新选择!');
                        } else {
                            Ext.Msg.alert('信息提示', ret.message + '送票站点失败!');
                            panel.hide();
                        }
                    },
                    failure: function (response, otps) {
                        Ext.Msg.alert('信息提示', '送票站点删除出错!');
                    }
                });
            }
        }, {
            text: '关闭',
            handler: function () {
                panel.hide();
            }
        }]
    });

    /* start***********************************************************************/
    var cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: "ID", dataIndex: "sh_id", width: 50, hidden: true},
        {header: "送票站点", dataIndex: "sh_start_station", width:200, align: 'center'},
        {header: "送票类型", dataIndex: "sh_type", width:200, align: 'center'},
        {header: "送票人手机", dataIndex: "sh_mob", width:200, align: 'center'},
        {header: "编辑时间", dataIndex: "sh_edit_time", width:200, align: 'center'},
    ];

    //配置ext面板
    var shuttle = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        border: false,
        viewConfig: {emptyText: '哎呀，暂时没有送票站点信息，快去添加哦'},
        tbar: [
            {text: '添加', iconCls: 'button-add', id: 'add_id', handler: ticketEdit},
            {text: '编辑', iconCls: 'button-edit', id: 'edit_id', handler: ticketEdit},
            {
                text: '刷新', iconCls: 'button-ref', id: 'ref_id', handler: function () {
                store.reload()
            }
            },
            {text: '删除', iconCls: 'button-del', id: 'del_id', handler: ticketDel},
            '-',
            {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn'},
            '->',
            '快速搜索：',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'Search_key',
                emptyText: '送票站点、送票类型、联系号码',
                width: 300,
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
                handler:function(){
                    window.location.reload();
                }
            }

        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有送票站点信息，快去添加哦'
        })
    });

    //配置ext布局
    new Ext.Viewport({
        layout: 'border',
        items: [shuttle]
    });
    /*end ***********************************************************************/

    //注入日志处理流程
    ziyo_log({listeners: [{grid: shuttle, action: 'TicketPerson', table: 'shuttle', pk_id: 'sh_id'}]});
});
