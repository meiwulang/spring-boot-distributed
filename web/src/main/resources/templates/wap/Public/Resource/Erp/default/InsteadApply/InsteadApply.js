/**
 * Created by cjl on 2017/8/4.
 */
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var pageSize = 20;

    var url = $__app__ + '/InsteadApply/getListData/action_type/' + action_type + '/org_id/' + org_id;
    //var url = $__app__ + '/InsteadApply/getListData/';
    var field = [];
    var store = SUNLINE.JsonStore(url, field, false);
    var search_data = {
        start_time: start_time,
        end_time: end_time
    };
    SUNLINE.baseParams(store, search_data);
    store.currentPage = 1;
    store.load();

    var org_name = action_type == 1 ? '分销商' : '供应商';
    var is_show = org_id ? true : false;

    var cm = [
        new Ext.grid.RowNumberer({width: 50}),
        {text: '大区', dataIndex: 'org_area', align: 'left', width: 120},
        {text: '省份', dataIndex: 'org_province', align: 'left', width: 120},
        {text: '城市', dataIndex: 'org_city', align: 'left', width: 120},
        {text: org_name + 'ID', dataIndex: 'org_id', align: 'center', width: 100, hidden: true},
        {text: org_name + '名称', dataIndex: 'org_name', width: 300, align: 'left'},
        {text: '订单数', dataIndex: 'order_num', width: 100, align: 'right'},
        {text: '代报订单数', dataIndex: 'd_order_num', width: 100, align: 'right'},
        {text: '占比', dataIndex: 'percent', width: 100, align: 'right'},
        {text: '操作', dataIndex: 'org_dist', width: 100, align: 'center', renderer: distHandler, hidden: is_show},
    ];


    //有供应商的省份、城市列表
    var area_large_url = $__app__ + '/ActivityCount/getLargeAreaList';
    var area_large_field = [];
    var area_large_store = SUNLINE.JsonStore(area_large_url, area_large_field);
    var area_store = Ext.create('Ext.data.Store', {
        fields: ['name'],
        data: []
    });
    var area_city_store = Ext.create('Ext.data.Store', {
        fields: ['name'],
        data: []
    });
    var box_large_area = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_area',
        fieldLabel: '大区/省/市',
        labelWidth: 70,
        labelAlign: 'right',
        store: area_large_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 180,
        style:'margin-top:3px',
        listeners: {
            select: function (c, r) {
                Ext.getCmp('search_org_province').setValue('');
                Ext.getCmp('search_org_city').setValue('');
                area_store.loadData(r[0].get('data'));
                area_pro_arr = ''; //重置
                Ext.each(r[0].get('data'), function (v) {
                    if (area_pro_arr) {
                        area_pro_arr += ',' + v.name;
                    } else {
                        area_pro_arr = v.name;
                    }
                });
            }
        }
    });
    var box_province = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_province',
        fieldLabel:false,
        labelSeparator:'',
        labelAlign: 'right',
        store: area_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 110,
        style:'margin-top:3px;margin-left:5px;',
        listeners: {
            select: function (c, r) {
                Ext.getCmp('search_org_city').setValue('');
                area_city_store.loadData(r[0].get('data'));
                area_pro_arr = '';
            }
        }
    });
    var box_city = Ext.create('Ext.form.ComboBox', {
        id: 'search_org_city',
        fieldLabel:false,
        labelSeparator:'',
        labelAlign: 'right',
        store: area_city_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        emptyText: '请选择',
        width: 110,
        style:'margin-top:3px;margin-left:5px;',
    });

    //表格渲染数据列表
    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        store: store,
        columns: cm,
        forceFit: false, //列宽自适应
        viewConfig: {emptyText: '暂时没有信息'},
        tbar:[{
                xtype:'buttongroup',
                id:'search_form',
                title:'<b style="float:left;">'+text_title+'</b>'+'<span style="float:right;">查询条件</span>',
                height:84,
                columns:4,
                items:[
                    box_large_area,
                    box_province,
                    box_city,
                    {
                        text: '刷新',
                        iconCls: 'button-ref',
                        style:'margin-top:3px;margin-left:5px;',
                        handler: function () {
                            store.reload();
                        }
                    },
                    SUNLINE.ExtDateField({
                        id:'start_time',
                        name:'start_time',
                        labelAlign:"right",
                        fieldLabel:'交易日期',
                        labelWidth:70,
                        width:180,
                        value:start_time,
                        gang:'end_time',
                        start:true,
                        style:'margin-top:3px;',
                    }),
                    SUNLINE.ExtDateField({
                        fieldLabel:false,
                        labelSeparator:'',
                        id:'end_time',
                        name:'end_time',
                        labelAlign:"right",
                        width:110,
                        value:end_time,
                        gang:'start_time',
                        colspan:2,
                        style:'margin-top:3px;margin-left:5px;',
                    }),
                    {
                        text: '查询',
                        iconCls: 'button-sch',
                        style:'margin-top:3px;margin-left:5px;',
                        handler: function () {
                            doSearch();
                        },
                    },
                ],
            },
            '->',
            {
                xtype:'buttongroup',
                title:'全局快速搜索',
                height:84,
                columns:7,
                bodyStyle:'padding:10px',
                items: [{
                    xtype: 'trigger',
                    triggerCls: 'x-form-search-trigger',
                    id: 'skey',
                    emptyText: org_name + '名称',
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
                {xtype:'tbtext',text:'&nbsp;'},
                {
                    icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                    cls: 'x-btn-icon',
                    tooltip: '重载统计数据',
                    handler: function () {
                        window.location.reload();
                    }
                },
                {xtype:'tbtext',text:'&nbsp;'},
                {
                    icon: $app_public_images_path + 'delete.gif',
                    cls: 'x-btn-icon',
                    tooltip: '关闭当前页',
                    handler: function () {
                        var main_tab_view = parent.Ext.getCmp('MainTabPanel'); //得到tab组件
                        var tab = main_tab_view.getActiveTab();
                        if (!tab.closable) return;
                        Ext.Msg.confirm('友情提醒', '您真的要关闭“' + tab.title + '”吗？', function (btn) {
                            if (btn == 'yes') {
                                main_tab_view.remove(tab);
                                parent.tab_list_menu.remove(Ext.getCmp('am_' + tab.id));
                            }
                        });
                    }
                },{xtype:'tbtext',text:'&nbsp;'},
                    {icon: $app_public_images_path + 'b_help.png',  tooltip: '查看帮助',cls: 'x-btn-icon',handler:function(){help(org_name+'代报名统计')}},]
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: pageSize,
            store: store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        renderTo: Ext.getBody()
    });

    Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [grid]
    });

    function doSearch() {
        var org_area = Ext.getCmp('search_org_area').getRawValue();
        var org_province = Ext.getCmp('search_org_province').getRawValue();
        var org_city = Ext.getCmp('search_org_city').getRawValue();
        var skey = Ext.getCmp('skey').getValue();
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time   = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');
        console.log('search:',start_time, end_time);
        var search_params = {
            org_area: org_area,
            org_province: org_province,
            org_city: org_city,
            start_time: start_time,
            end_time: end_time,
            skey: skey,
        };
        SUNLINE.baseParams(store, search_params);
        store.currentPage = 1;
        store.load();
    }

    function distHandler(v, m) {
        var show_name = action_type == 2 ? '分销商' : '供应商';
        var new_action_name = action_type == 2 ? 'buyer' : 'supply';
        var org_name = m.record.data.org_name;
        var start_time = Ext.Date.format(Ext.getCmp('start_time').getValue(), 'Y-m-d');
        var end_time   = Ext.Date.format(Ext.getCmp('end_time').getValue(), 'Y-m-d');

        var url = $__app__ + '/InsteadApply/' + new_action_name + '/org_id/' + v + '/org_name/' + encodeURI(org_name);
        url += '/start_time/'+encodeURI(start_time) + '/end_time/' + encodeURI(end_time);
        var text = "<a href='javascript:;' style='color:blue;' onclick='openInstead(" + v + ",\""+org_name+"\",\""+ url + "\")'>" + show_name + "分布</a>";
        //去掉本页合计和全部合计
        return m.record.data.org_id ? text : '';
    }

    window.openInstead = function (org_id, org_name, url) {
        var open_title = org_name+'的'+(action_type == 2 ? '分销商' : '供应商') + "代报名统计";
        var open_id = "InsteadApply_" + Math.round(Math.random() * 1000);
        parent.OpenTab(open_title, open_id, '', url, 1);
    }
});

