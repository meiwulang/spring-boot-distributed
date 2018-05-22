/**
 * Created by cjl on 2017/4/14.
 */
Ext.onReady(function () {

    //判断当前用户的单位类型，显示其可操作“送票状态”
    var sentTicket = null; //默认操作为空
    var sendText = null;
    var checkObj = {}; //复选框显示

    if (_uinfo.org_type == '管理公司' || _uinfo.org_type == '供应商') {
        //checkObj = {selType: 'checkboxmodel'};
        checkObj = new Ext.selection.CheckboxModel({
            checkOnly:true,
            listeners: {
                beforeselect: function (_this,record) {
                    if ( record.data.s_vip_name && record.data.s_vip_mob ) {
                        return true;
                    }else{
                        ExtAlert('您选择的游客信息不全，无法添加送票信息！', '提示');
                        return false;
                    }
                }
            }
        });
        var btnText = '签收';
        var btnId = 'sign-ticket';
        if (_uinfo.org_type == '供应商') {
            btnText = '寄出';
            btnId = 'sent-ticket';
            //送票录入按钮
            sendText = {
                text: '送票',
                iconCls: 'button-edit',
                id: 'sendTicket',
                handler: sendTicket,
            }
        }
        //更新送票状态按钮
        sentTicket = {
            text: btnText,
            iconCls: 'button-edit',
            id: btnId,
            handler: updStatus,
        }
    }

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '游客信息列表';
    var url = $__app__ + '/TicketSend/getListData';
    var field = [];
    var store = SUNLINE.GroupingStore(url, field, {
        sortInfo: {field: 's_id', direction: "ASC"},
        groupField: 'st_start_station'
    }, true);

    var cm = [
        {text: '送票状态ID', dataIndex: 'st_status', align: 'center',hidden:true},
        {text: '送票状态', dataIndex: 'st_status_text', width:100,align: 'center'},
        {text: '票价名称', dataIndex: 's_tname', width:100,align: 'center'},
        {text: '游客姓名', dataIndex: 's_vip_name', width:100, align: 'center'},
        {text: '游客手机号码', dataIndex: 's_vip_mob', width:120, align: 'center'},
        {text: '游客身份证号码', dataIndex: 's_vip_card', width:150, align: 'center'},
        {text: '订单编号', dataIndex: 's_o_number', width:160, align: 'center'},
        {text: '送票站点', dataIndex: 'st_start_station', width:200,align: 'center'},
        {text: '联系电话', dataIndex: 'st_sh_mob', width:120,align: 'center'},
        {text: '送票航班号', dataIndex: 'st_classes_number', width:100,align: 'center'},
        {text: '送票日期', dataIndex: 'st_start_date', width:120,align: 'center'},
        {text: '送票时间', dataIndex: 'st_start_time', width:120,align: 'center'},
        {text: '产品名称', dataIndex: 'p_name', hidden: true},
        {text: '出发日期', dataIndex: 's_start_date', hidden: true},
    ];

    var group_btn;
    var group_features = Ext.create('Ext.grid.feature.Grouping', {
        groupHeaderTpl: ['', '{columnName}: {name:this.formatName} (共 {[values.rows.length]} 条)', {
            formatName: function (time) {
                var group_field = store.getConfig('groupField');
                switch (group_field) {
                    case 'st_start_station':
                        return time ? time : '未送票';
                    case 's_o_number':
                        return time;
                    case 's_tname':
                        return time;
                    case 'p_name':
                        return time;
                    case 's_start_date':
                        return time;
                    case 'st_status':
                        return time ? time : '未送票';
                }
            }
        }],
        startCollapsed: false
    });


    /*添加票价窗口(start)*/
    var st_status = SUNLINE.LocalComob({
        id: 'st_status',
        fields: ['st_status', 'st_status_text'],
        data: [
            {'st_status': 100, 'st_status_text': '全部'},
            {'st_status': 200, 'st_status_text': '未送票'},
            {'st_status': 0, 'st_status_text': '未寄出'},
            {'st_status': 1, 'st_status_text': '已寄出'},
            {'st_status': 2, 'st_status_text': '已签收'}
        ],
        config: {
            displayField: 'st_status_text',
            valueField: 'st_status',
            fieldLabel: '送票状态',
            allowBlank: true,
            id: 'st_status',
            name: 'st_status',
            labelWidth: 80,
            labelAlign: 'right',
            width: 160,
            value: '全部'
        }
    });

    //送票站点下拉列表
    /*
    var url = $__app__+'/TicketSend/getStartStationList';
    var stStartStation = SUNLINE.DictComBox({
        id: 'st_start_station',
        name: 'st_start_station',
        fieldLabel: "送票站点",
        labelWidth: 80,
        labelAlign: 'right',
        width: 220,
        allowBlank: true,
        displayField: 'sh_start_station',
        valueField: 'sh_start_station',
        },{},url);
        */

    var stStartStation = SUNLINE.ComBoxPlus({
        id:'st_start_station',
        name: 'st_start_station',
        fields:['sh_id','sh_start_station'],
        url:$__app__+'/TicketSend/getStartStationList',
        where:{},
        config:{
            readOnly:true,
            displayField:'sh_start_station',
            emptyText:'请选择',
            valueField:'sh_start_station',
            width:320,
            value:'',
            pageSize:20,
            fieldLabel:'送票站点',
            labelWidth: 60,
            labelAlign: 'right',
            padding:'0 0 0 0'
        }
    });

    stStartStation.on('focus',function(c,r){
        var list_store=stStartStation.getStore();
        SUNLINE.baseParams(list_store,{});
        stStartStation.setReadOnly(false);
        stStartStation.setValue('');
        list_store.currentPage=1;
        list_store.load();
    });


    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        //forceFit: true, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        features: [group_features],
        selModel: checkObj,
        tbar: {
            xtype: "container",
            border: false,
            items: [{
                //tbar第一行工具栏
                xtype: "toolbar",
                items: [
                    sendText,
                    sentTicket, //送票状态按钮
                    {text: '日志', iconCls: 'button-log', id: 'ziyo_log_btn'},
                    '-',
                    {
                        text: '按送票站点分组',
                        id: 'group_btn',
                        menu: {
                            items: [
                                {
                                    text: '按送票站点分组', handler: function (b) {
                                    store.group('st_start_station');
                                    Ext.getCmp('group_btn').setText(b.text);
                                }
                                },
                                {
                                    text: '按订单编号分组', handler: function (b) {
                                    store.group('s_o_number');
                                    Ext.getCmp('group_btn').setText(b.text);
                                }
                                }, {
                                    text: '按票价名称分组', handler: function (b) {
                                        store.group('s_tname');
                                        Ext.getCmp('group_btn').setText(b.text);
                                    }
                                }, {
                                    text: '按产品名称分组', handler: function (b) {
                                        store.group('p_name');
                                        Ext.getCmp('group_btn').setText(b.text);
                                    }
                                }, {
                                    text: '按出发日期分组', handler: function (b) {
                                        store.group('s_start_date');
                                        Ext.getCmp('group_btn').setText(b.text);
                                    }
                                }, {
                                    text: '按送票状态分组', handler: function (b) {
                                        store.group('st_status');
                                        Ext.getCmp('group_btn').setText(b.text);
                                    }
                                }
                            ]
                        }
                    },
                    '-',
                    st_status,
                    '出发日期:',
                    SUNLINE.ExtDateField({
                            id: 's_start_date',
                            name: 's_start_date',
                            labelWidth: 0,
                            labelAlign: "right",
                            style: 'margin-top:5px;',
                            fieldLabel: " ",
                            labelSeparator: '',
                            width: 110,
                            gang: 's_end_date',
                            start: true,
                            value: sys_time.start
                        }
                    ),
                    '~',
                    SUNLINE.ExtDateField({
                            id: 's_end_date',
                            name: 's_end_date',
                            labelWidth: 0,
                            labelAlign: "right",
                            style: 'margin-top:5px;',
                            fieldLabel: " ",
                            labelSeparator: '',
                            width: 110,
                            gang: 's_start_date',
                            value: sys_time.end
                        }
                    )
                ]
            }, {
                //tbar第二行工具栏
                xtype: "toolbar",
                items: [
                    stStartStation,
                    '关键字:',
                    {
                        xtype: 'textfield',
                        id: 'keywords',
                        name: 'keywords',
                        width: 300,
                        emptyText: '票价名称、订单编号、游客姓名、游客手机号码'
                    },
                    {
                        text: '查询',
                        iconCls: 'button-sch',
                        handler: function () {
                            doSearch();
                        },
                    },
                ]
            }]

        },

        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        viewConfig:{ //面板可复制属性
            enableTextSelection:true
        },
        renderTo: Ext.getBody()
    });

    //渲染页面
    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    /**
     * 搜索方法
     */
    function doSearch() {
        var st_status = Ext.getCmp('st_status').getValue();
        var s_start_date = Ext.Date.format(Ext.getCmp('s_start_date').getValue(), 'Y-m-d');
        var s_end_date = Ext.Date.format(Ext.getCmp('s_end_date').getValue(), 'Y-m-d');
        var st_start_station = Ext.getCmp('st_start_station_id').getValue();
        var skey = Ext.util.Format.trim(Ext.getCmp('keywords').getValue());
        var search_params = {
            st_status: st_status === '全部' ? '100' : st_status,
            s_start_date: s_start_date,
            s_end_date: s_end_date,
            st_start_station: st_start_station,
            skey: skey,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }


    /*start **************************************************************************/

    //1. 弹出送票录入界面
    function sendTicket() {
        //获取多行数据
        var row = SUNLINE.getSelected(grid, true);
        if (0 == row.length) {
            return ExtAlert('请选择您要送票的游客!', '提示');
        }

        //把勾选中游客Id拼接成字符串，以‘,’分隔
        var sid = [];
        //第一条记录
        var firstRecord = row[0].data;
        for (var i = 0; i < row.length; i++) {
            sid[i] = parseInt(row[i].data.s_id);
        }
        sid = sid.join(',');
        sendPanel.data = firstRecord;
        //弹出送票panel
        sendPanel.show();
        Ext.getCmp('st_s_type').setRawValue(sendPanel.data.st_s_type);
        Ext.getCmp('sh_start_station').setRawValue(sendPanel.data.st_start_station);
        Ext.getCmp('st_s_id').setValue(sid);
    }

    //送票状态修改
    function updStatus(_this) {
        var row = SUNLINE.getSelected(grid, true); //获取多行数据
        if (0 == row.length) {
            return ExtAlert('请选择您要送票的游客!', '提示');
        }
        /** 此方法一共两种情况
         * 1、供应商‘寄出’操作（且选中都录入送票信息和状态为'未寄出'）
         * 2、管理公司‘签收’操作（且选中都录入送票信息和状态为'已寄出'）
         */
            //默认状态
        var statusText = '未寄出';
        var old_status = 0;
        var st_status = 1;
        if (_this.id == 'sign-ticket') {
            statusText = '已寄出';
            old_status = 1;
            st_status = 2;
        }
        console.log( row );
        var sid = [];
        for (var i = 0; i < row.length; i++) {
            if (row[i].data.st_start_station == null) {
                return ExtAlert('请选择已录入送票信息的游客！', '提示');
                break;
            } else if (row[i].data.st_status != old_status) {
                return ExtAlert('您选择游客中送票状态不对，请选择‘' + statusText + '’的送票状态！', '提示');
                break;
            } else {
                sid[i] = parseInt(row[i].data.s_id);
            }
        }
        Ext.Ajax.request({
            url: $__app__ + '/TicketSend/updStatus',
            params: {st_s_id: sid.join(','), st_status: st_status},
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if (ret.success) {
                    store.reload();
                }
                return ExtAlert(ret.message, '提示');
            },
            failure: function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        });
    }

    //航班班次
    var classesNum = Ext.create('Ext.form.TextField', {
        labelWidth: 80,
        width: 280,
        labelAlign: "right",
        id: "st_classes_number",
        name: "st_classes_number",
        fieldLabel: '航班班次',
        allowBlank: false,
    });
    //出发日期
    var startDate = SUNLINE.ExtDateField({
        id: 'st_start_date',
        name: 'st_start_date',
        labelWidth: 80,
        width: 280,
        labelAlign: "right",
        fieldLabel: "出发日期",
        allowBlank: false,
        listeners: {
            select: function (t, d) {
                var new_v = Ext.util.Format.date(d, 'Y-m-d');
                Ext.getCmp('st_start_date').setValue(new_v);
            }
        }
    });

    //出发时间
    var startTime = Ext.create('Ext.form.TextField', {
        labelWidth: 80,
        width: 280,
        labelAlign: "right",
        id: "st_start_time",
        name: "st_start_time",
        fieldLabel: '班次时间',
        allowBlank: false,
        emptyText: '时间格式如12:00',

    });

    //交通方式
    var st_s_type = SUNLINE.DictComBox_false({
        id: 'st_s_type',
        name: 'st_s_type',
        fieldLabel: "交通方式",
        labelWidth: 80,
        width: 280,
        labelAlign: "right",
        allowBlank: false,
        value: '火车'
    }, {'d_type': '交通类目'});
    //选择完后交能，站点和电话数据清空
    st_s_type.box.on('select', function() {
        Ext.getCmp('sh_start_station').setValue('');
        Ext.getCmp('sh_mob_1').setValue('');
        Ext.getCmp('st_sh_mob').setValue('');
        Ext.getCmp('st_sh_id').setValue('');
    })

    //送票站点
    var stationUrl = $__app__ + "/TicketSend/getStartStationList";
    var startStation = SUNLINE.DictComBox({
        id: 'sh_start_station',
        name: 'st_start_station',
        fieldLabel: "送票站点",
        labelWidth: 80,
        width: 280,
        displayField: 'sh_start_station',
        valueField: 'sh_start_station',
        labelAlign: "right",
        allowBlank: false,
    }, {}, stationUrl, ['sh_id', 'sh_start_station', 'sh_mob']);
    //下拉组件每次获取focus事件时，更新store数据
    startStation.box.on('focus', function () {
        var st_s_type = Ext.getCmp('st_s_type').getValue(); //送票类型
        if (st_s_type) {
            SUNLINE.baseParams(startStation.store, {st_s_type: st_s_type});
            startStation.store.currentPage = 1;
            startStation.store.load();
        }
    });
    //当选择完送票站点时，自动获取他的联系电话
    startStation.box.on('select', function () {
        var sh_mob = startStation.box.findRecordByValue(startStation.box.getValue()).get('sh_mob');
        var sh_id = startStation.box.findRecordByValue(startStation.box.getValue()).get('sh_id');
        Ext.getCmp('st_sh_mob').setValue(sh_mob);
        Ext.getCmp('sh_mob_1').setValue(sh_mob);
        Ext.getCmp('st_sh_id').setValue(sh_id);
    });

    //送票人手机号码
    var shMob = Ext.create('Ext.form.TextField', {
        labelWidth: 80,
        width: 280,
        labelAlign: "right",
        id: "st_sh_mob",
        name: "st_sh_mob",
        fieldLabel: '联系电话',
        allowBlank: false,
        disabled: true,
    });


    //3. 送票表单
    var sendForm = Ext.create('Ext.form.FormPanel', {
        border: false,
        bodyStyle: 'background:none;padding:10px',
        defaultType: 'textfield',
        defaults: {labelAlign: "right", width: 280, labelWidth: 80,},
        items: [
            {id: "st_s_id", name: "st_s_id", fieldLabel: "游客ID", xtype: "hidden"},
            classesNum,
            st_s_type.box,
            startStation.box,
            startDate,
            startTime,
            shMob,
            {id: "st_sh_id", name: "st_sh_id", fieldLabel: "送票站点ID", xtype: "hidden"},
            {id: "sh_mob_1", name: "sh_mob_1", fieldLabel: "电话", xtype: "hidden"},
        ]
    });

    //2. 送票panel
    var sendPanel = new Ext.Window({
        width: 330,
        title: '送票',
        items: sendForm,
        modal: true,
        closeAction: 'hide',
        buttons: [
            {text: '保存', handler: sendSave},
            {
                text: '关闭', handler: function () {
                sendPanel.hide();
            }
            }
        ]
    });

    //关闭送票panel时，重新加载送票表单数据
    sendPanel.on('hide', function () {
        sendForm.getForm().reset();
    });

    //打开送票panel时，重新加载送票表单数据
    sendPanel.on('show', function () {
        sendForm.getForm().setValues(sendPanel.data);
        var curDate = sendPanel.data.st_start_date ? sendPanel.data.st_start_date : sendPanel.data.s_start_date;
        var curTime = sendPanel.data.st_start_time ? sendPanel.data.st_start_time : sendPanel.data.s_start_time;
        curTime = curTime != '0' && curTime ? curTime : ''; //如始发时间为0时，显示为空
        Ext.getCmp('st_start_date').setValue(curDate);
        Ext.getCmp('st_start_time').setValue(curTime);
    });

    /**
     * 保存送票信息
     */
    function sendSave() {
        if (!sendForm.getForm().isValid()) {
            return ExtAlert('红色边框显示为必填项', '友情提示');
        };

        var myMask = SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var sendFormData = sendForm.getForm().getValues();
        Ext.Ajax.request({
            url: $__app__ + '/TicketSend/save',
            params: sendFormData,
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                myMask.hide();
                if (ret.success) {
                    store.reload();
                }
                ExtAlert(ret.message, '友情提示');
                sendPanel.hide();
            },
            failure: function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };

    //订单详情页面跳转
    window.UrlOrderDetail=function(v){
        parent.OpenTab('订单详情'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v+'/source/frame/order_type/seller', 1);
    };
    
    /*end ****************************************************************************/

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: grid, action:'TicketSend', table: 'SendTicket', pk_id:'st_s_id'}] });
});