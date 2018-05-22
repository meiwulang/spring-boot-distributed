var Cp = {};
var TAB_CLICK = '';//现在点击的是哪个tab

Ext.onReady(function () {
    var thisTitle = '工单';
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var c_url = $__app__ + '/WorkOrder/dataJson';
    var c_field = [];
    var c_order_id = '0';
    var c_store = SUNLINE.JsonStore(c_url, c_field);
    var c_cm = [
        new Ext.grid.RowNumberer({width:50}),
        {header: "ID", dataIndex: "ar_id", width: 10},
        {
            header: "优先级", width: 80, dataIndex: "wo_label", renderer: function (v) {
            switch (v) {
                case '紧急':
                    return '<span style="padding:2px 4px 2px 4px;background: red;border-radius: 3px;color:#FFFFFF">紧急</span>';
                case '普通':
                    return '<span style="padding:2px 4px 2px 4px;background: dodgerblue;border-radius: 3px;color:#FFFFFF">普通</span>';
                default:
                    return '<span style="padding:2px 4px 2px 4px;background: dodgerblue;border-radius: 3px;color:#FFFFFF">普通</span>';
            }
        }
        },
        {header: "状态", dataIndex: "wo_status", width: 120, renderer: status_str},
        {header: "问题内容", dataIndex: "wo_content", width: 450},
        {header: "问题分类", dataIndex: "wo_cate_name", width: 150},
        {
            header: "提交时间", dataIndex: "wo_time", width: 150, renderer: function (val) {
            var date = new Date(parseInt(val) * 1000);
            return Ext.Date.format(date, 'Y-m-d H:i:s');
        }
        },
        {
            header: "最后处理时间", dataIndex: "wo_updateTime", width: 150, renderer: function (val) {
            var date = new Date(parseInt(val) * 1000);
            return Ext.Date.format(date, 'Y-m-d H:i:s');
        }
        }
    ];
    var grid = new Ext.grid.GridPanel({
        region: 'center',
        store: c_store,
        columns: c_cm,
        border: true,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {emptyText: '没有信息', deferEmptyText: true},
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: c_store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: '没有数据'
        }),
        listeners: {
            cellclick: function (v, g, n, r) {
                Ext.getCmp("wf_user_id").setValue(r.data.wo_user_id);
                Ext.getCmp("wf_order_id").setValue(r.data.wo_id);
                c_order_id = r.data.wo_id;
                activePress(true);
            }
        }
    });


    var statusTip = {'ok': '已解决', 'going': '进行中', 'need': '未解决'};

    function status_str(v) {
        switch (v) {
            case 'ok':
                return '<span style="padding:2px 4px 2px 4px;background: green;border-radius: 3px;color:#FFFFFF">' + statusTip.ok + '</span>';
                break;
            case 'going':
                return '<span style="padding:2px 4px 2px 4px;background: dodgerblue;border-radius: 3px;color:#FFFFFF">' + statusTip.going + '</span>';
                break;
            case 'need':
                return '<span style="padding:2px 4px 2px 4px;background: rosybrown;border-radius: 3px;color:#FFFFFF">' + statusTip.need + '</span>';
                break;
            default:
                break;
        }
    }

    /***保存数据***/
    function doSave_success(s, url, fn) {
        var mask = SUNLINE.LoadMask('正在加载数据...');
        mask.show();
        Ext.Ajax.request({
            url: $__app__ + url,
            params: s,
            method: 'post',
            success: function (resp) {
                var ret = Ext.decode(resp.responseText);
                mask.hide();
                fn(ret);
            }
        })
    }

    var detail = new Ext.Panel({
        border: false,
        region: 'center',
        width: 500,
        autoScroll: true,
        style: 'border-left:1px solid #d0d0d0;border-top:1px solid #ccc;',
        html: '<div style="padding: 10px;">请点击左则列表信息!</div>'
    });

    var infoPanel = Ext.create('Ext.panel.Panel', {
        region: 'east',
        layout: 'border',
        width: 505,
        maxHight: 700,
        border: true,
        autoScroll: true,
        bodyBorder: true,
        split: {size: 3},
        tbar: Ext.create('Ext.toolbar.Toolbar', {
            cls: 'dd',
            items: [
                {text: '问题描述', id: 'basic_info_id', cls: 'tab-button-custom', enableToggle: true, handler: tabs_html},
                {text: '处理记录', id: 'attach_info_id', cls: 'tab-button-custom', enableToggle: true, handler: tabs_html}
            ]
        }),
        items: detail
    });


    function tabs_html(e) {
        var row = SUNLINE.getSelected(grid);
        if (row == null) {
            Ext.Msg.alert('提示信息', '请选择你要查看的单位');
            return false;
        }
        removePress();
        e.setPressed(true);
        tabs_detail(row.data, e.text);
    }

    var form_items = [
        {id: "wf_user_id", name: "wf_user_id", hidden: true},
        {id: "wf_order_id", name: "wf_order_id", hidden: true},
        {
            id: "wf_feedback",
            name: "wf_feedback",
            fieldLabel: "工单反馈",
            maxLength: "200",
            xtype: 'textarea',
            width: 550,
            height: 200
        },{
            fieldLabel: "处理结果",
            xtype: 'radiogroup',
            columnWidth: 20,
            items: [
                {boxLabel: '已处理', id: 'wf_status_ok', name: 'wf_status', inputValue: 'ok'},
                {boxLabel: '处理中', id: 'wf_status_need', name: 'wf_status', inputValue: 'going', checked: true}
            ],
        }
    ];

    var form_deal = Ext.create('Ext.form.Panel', {
        bodyPadding: 10, autoScroll: true, cls: 'basic_class', width: 607,
        items: [{
            defaultType: 'textfield', cls: 'tcol2',
            defaults: {labelWidth: 60, labelAlign: 'right', xtype: 'textfield'},
            items: form_items
        }
        ]
    });

    var win = Ext.create('Ext.window.Window', {
        title: '工单处理',
        closeAction: 'hide',
        width: 635,
        height: 350,
        modal: true,
        items: [form_deal],
        buttons: [
            {text: '提交处理', handler: saveform},
            {
                text: '关闭', handler: function () {
                win.hide();
            }
            }
        ]
    });

    function saveform() {
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var formdata = form_deal.getForm().getValues();
        Ext.Ajax.request({
            url: $__app__ + '/WorkOrder/saveFeedback',
            params: formdata,
            method: 'POST',
            success: function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status == 1) {
                    win.hide();
                }
                ;
                form_deal.getForm().reset();

                getFeedbackContent(c_order_id);
                c_store.load();
                Ext.Msg.alert('友情提示', msg);
            },
            failure: function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }

        });
    }

    //模版数据信息
    function wo_detail_tpl(e, data) {
        var time = new Date(parseInt(data.wo_time) * 1000);
        time_new = Ext.Date.format(time, 'Y-m-d H:i:s');
        var updateTime = new Date(parseInt(data.wo_updateTime) * 1000);
        updateTime_new = Ext.Date.format(updateTime, 'Y-m-d H:i:s');
        var content = '<div class="org-info-box"><li class="org-list"><span class="org-title">问题描述：</span><span class="org-text">' + data.wo_content + '</span></li>';
        content += '<li class="org-list"><span class="org-title">工单类别：</span><span class="org-text">' + data.wo_cate_name + '</span></li>';
        content += '<li class="org-list"><span class="org-title">发布用户：</span><span class="org-text">' + data.wo_name + '</span></li>';
        content += '<li class="org-list"><span class="org-title">提问时间：</span><span class="org-text">' + time_new + '</span></li>';
        content += '<li class="org-list"><span class="org-title">处理时间：</span><span class="org-text">' + updateTime_new + '</span></li>';
        content += '<li class="org-list"><span class="org-title">处理状态：</span><span class="org-text">' + statusTip[data.wo_status] + '</span></li>';
        if(data.wo_attachs!=''){
            content += '<li class="org-list"><span class="org-title">附件图片：</span><span class="org-text"><a href="' + data.wo_attachs + '" target="_blank"><img src="' + data.wo_attachs + '" width="400" height="300"></a></span></li>';
        }
          content += '</div>';
        var contentCmd = '<div class="org-info-box" id="feedbackList"></div>';

        if (e == '问题描述') {
            TAB_CLICK = 1;
            return content;
        } else {
            TAB_CLICK = 2;
            return contentCmd;

        }

    }

    function tabs_detail(data, type) {
        var _detail_body = null;
        if (!_detail_body) {
            var bd = detail.body;
            bd.update('').setStyle('background', '#fff');
            _detail_body = bd.createChild();
        }
        data.wo_type_news = data.wo_type;
        type = type ? type : '问题描述';
        var tpl = wo_detail_tpl(type, data);
        var html = tpl;
        _detail_body.hide().update(html).slideIn('l', {stopFx: true, duration: .5});
        detail.body.highlight('#c3daf9', {block: true});
        getFeedbackContent(data.wo_id);

    }

    grid.on('cellclick', function (v, i, d, r) {
        var row = r.data;
        tabs_detail(row);

    });


    function getFeedbackContent(order_id) {
        var feedlist = '';
        Ext.Ajax.request({
            url: $__app__ + '/WorkOrder/getFeedbackList',
            params: {order_id: order_id},
            method: 'post',
            success: function (response) {
                var r = Ext.decode(response.responseText);
                var data = r.data;
                if (r.code == 200) {
                    Ext.each(data, function (v, i) {
                        if (v.wf_admin == 0) {
                            var color = '#A64200';
                            var type_name = '<font style="color:' + color + '">用戶</font>';
                            var time_tip = '咨询时间:' + v.wf_time + ' 用户名：' + v.wf_user_name;
                        }
                        else {
                            var type_name = '客服';
                            var time_tip = '答复时间:' + v.wf_time + ' 客服姓名：' + v.u_realname;
                        }
                        feedlist += '<li class="org-list" style="border-bottom:1px solid #c2ccd1;padding-bottom:4px;color:' + color + '"><span class="org-title">' + type_name + '：</span><span class="org-text">' + v.wf_feedback + '<br><time style="font-size:10px;color:#ccc">' + time_tip + '</time></span></li>';
                    });
                }
                if(feedlist){
                    $('#feedbackList').html(feedlist);
                }else{
                    $('#feedbackList').html('<span style="margin:10px">该问题还没有处理记录!<span>');
                }

            }
        });

    }


    /***增加TAB选中状态***/
    function activePress() {
        Ext.getCmp('basic_info_id').setPressed(true);
        Ext.getCmp('attach_info_id').setPressed(false);
    }

    /** 清除TAB选中状态**/
    function removePress(v) {
        Ext.getCmp('basic_info_id').setPressed(false);
        Ext.getCmp('attach_info_id').setPressed(false);
        if (typeof v != 'undefined') Ext.getCmp(v).setPressed(true);
    }

    /**主panel**/
    var Panel = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'border',
        tbar: [
            '<span style = "color:#009DDA;font-size: 15px;font-weight: bolder">工单列表</span>',
            {
                text: '处理', iconCls: 'button-edit', handler: function () {
                var row = SUNLINE.getSelected(grid);
                if (!row) {
                    Ext.Msg.alert('友情提示', '请选择要处理的工单!');
                    return;
                }

                tabs_detail(row.data, 'd');
                Ext.getCmp('attach_info_id').setPressed(true);
                win.setTitle('工单处理');
                win.show();
            }
            },
            //{text:'指派',iconCls:'button-dropyes',id:"re-Recom",disabled:isDisabled('Article::recom')},
            '-',
            {text: '标记为...', id: 'label_btn'},

            {
                text: '刷新', iconCls: 'button-ref', handler: function () {
                c_store.load();
            }
            }, ,
            '-',
            {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn'},
            '-', '提交日期：',
            SUNLINE.ExtDateField({
                id: 'seach_start_date',
                name: 'seach_start_date',
                labelWidth: 0,
                labelAlign: "right",
                style: 'margin-top:5px;',
                fieldLabel: " ",
                labelSeparator: '',
                width: 120,
                gang: 'seach_stop_date',
                start: true
            }),
            '~',
            SUNLINE.ExtDateField({
                id: 'seach_stop_date',
                name: 'seach_stop_date',
                labelWidth: 0,
                labelAlign: "right",
                style: 'margin-top:5px;',
                fieldLabel: " ",
                labelSeparator: '',
                width: 120,
                gang: 'seach_start_date'
            }),
            '-',
            '关键字：',
            {
                xtype: 'textfield',
                id: 'wo_Search',
                emptyText: '工单标题,或关键字',
                width: 150
            },
            {text: '查询', iconCls: 'searchico', act: 'select', handler: search}
        ],
        items: [grid, infoPanel]
    })


    var field = [];
    var userStore = SUNLINE.JsonStore($__app__ + '/Users/dataJson', field, false);
    var cm = [
        new Ext.grid.RowNumberer(),
        {header: "ID", dataIndex: "u_id", width: 50, hidden: true},
        {
            header: "锁", dataIndex: "u_status", width: 30, renderer: function (v) {
            switch (v) {
                case 'ok':
                    return '<font style = "color:#2c800e">正</font>';
                    break;
                case 'lock':
                    return '<span class = "button-lock" style = "background:no-repeat;display: inline-block;width:25px;height:25px"></span>';
                    break;
            }
        }
        },
        {header: "用户名", dataIndex: "u_name", width: 100},
        {header: "真实姓名", dataIndex: "u_realname", width: 80},
        {header: "手机号码", dataIndex: "u_mobile", width: 100},
        {header: "权限角色", dataIndex: "r_name", width: 100},
        {header: "权限等级", dataIndex: "u_scope", width: 80},
        {header: "年龄", dataIndex: "u_age", hidden: true},
        {header: "单位", dataIndex: "u_org_id", width: 100, hidden: true},
        {header: "部门", dataIndex: "wg_name", width: 100},
        {header: "岗位职务", dataIndex: "u_job", width: 100},
        {header: "性别", dataIndex: "u_sex", width: 60},
        {header: "qq", dataIndex: "u_qq", width: 100},
        {header: "传真", dataIndex: "u_fax", width: 100},
        {header: "邮箱", dataIndex: "u_email", width: 100},
        {header: "政治面貌", dataIndex: "u_zzmm", width: 100, hidden: true},
        {header: "地址", dataIndex: "u_addr", width: 100},
        {
            header: "添加时间", dataIndex: "u_addtime", width: 100, /*dateFormat: 'Y-m-d',*/renderer: function (val) {
            if (val != null) {
                var date = new Date(parseInt(val) * 1000);
                return Ext.Date.format(date, 'Y-m-d');
            }
        }, hidden: true
        },
        {header: "备注", dataIndex: "u_remark", width: 200}
    ];


    window.set_label = function (b) {
        var row = SUNLINE.getSelected(grid);
        if (!row) return ExtAlert('请选择您想标记的工单数据。');
        var id = row.get('wo_id');
        var data = {id: id, wo_label: b.text};
        Ext.Ajax.request({
            url: $__app__ + '/WorkOrder/set_label',
            params: data,
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提醒', '操作成功！');

                row.set('wo_label', b.text);

            },
            failure: function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        });
    }


    function search() {
        var skey = Ext.getCmp('wo_Search').getValue();
        var start_time = Ext.Date.format(Ext.getCmp('seach_start_date').getValue(), 'Y-m-d');
        var end_time = Ext.Date.format(Ext.getCmp('seach_stop_date').getValue(), 'Y-m-d');
        SUNLINE.baseParams(c_store, {skey: skey, start_time: start_time, end_time: end_time});
        c_store.currentPage = 1;
        c_store.load();
    }

    function today() {
        var time = new Date();
        return Ext.util.Format.date(time, 'Y-m-d');
    }

    ziyo_log({listeners: [{grid: grid, action: 'WorkOrder', pk_id: 'wo_id'}]});
    new Ext.Viewport({
        layout: 'border',
        items: [Panel]
    });

    ziyo_label('label_btn');
})