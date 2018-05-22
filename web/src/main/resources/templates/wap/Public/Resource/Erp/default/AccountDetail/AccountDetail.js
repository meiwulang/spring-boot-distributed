/**
 * Created by sunline on 2016-10-25.
 */

Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';



    function ad_money_in(v, m, r) {
        var type = r.get('ad_class');
        return type=='收入' ? money(v) : '';
    }

    function ad_money_out(v, m, r) {
        var type = r.get('ad_class');
        return type=='支出' ? money(v) : '';
    }

    function ad_detail(v, m, r) {
        try { m.tdAttr = 'data-qtip:"'+ v +'"';  }catch (e){ }
        return v;
    }

    var ad_url = $__app__ + '/AccountDetail/dataJson';
    var ad_field = [];
    var ad_store = SUNLINE.JsonStore(ad_url, ad_field, false);
    var ad_cm = [
        new Ext.grid.RowNumberer({width:45}),
        {header:"ID", dataIndex:"ad_id", width:50, hidden:true},
        {header:"交易时间", dataIndex:"ad_time", width:150, renderer:timestamp2date},
        {header:"收入", dataIndex:"ad_money", width:100, renderer:ad_money_in},
        {header:"支出", dataIndex:"ad_money", width:100, renderer:ad_money_out},
        {header:"操作人", dataIndex:"ad_uname", width:80},
        //{header:"详情", dataIndex:"ad_remark", width:50},
        {header:"摘要", dataIndex:"ad_detail", width:300, renderer:ad_detail}
    ];

    var ad_grid=new Ext.grid.GridPanel({
        region:'center',store:ad_store,columns: ad_cm,border:false,loadMask:{msg:'数据载入中，请稍后'},
        tbar: [
            {text:'刷新', id:'account_ref', iconCls:'button-ref', handler:function () { ad_store.reload(); } },
            {text:'查看详情', handler:showDetail },
            {text:'收入调整', id:'account_in', handler:account_in, disabled:isDisabled('AccountDetail::in') },
            {text:'支出调整', id:'account_out', handler:account_out, disabled:isDisabled('AccountDetail::out') }
        ],
        //style : 'border-left:1px solid #ccc;',
        viewConfig:{emptyText:'暂无账户流水信息',deferEmptyText:true},
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:ad_store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: '暂无账户流水信息'
        })
    });


    var _form = Ext.create('Ext.form.Panel', {
        border:false,
        defaultType : 'textfield',
        bodyStyle : 'padding:10px;',
        defaults :{
            anchor : '95%',
            labelWidth:80,
            labelAlign:'right'
        },
        //字段：org_id，money，外部订单号 out_number，摘要 detail,备注 other,
        items:[
            {name:'org_id', fieldLabel:'单位ID', xtype:'hidden'},
            {name:'type', fieldLabel:'收支类型', xtype:'hidden'},
            {name:'org_name', fieldLabel:'单位账户', xtype:'displayfield'},
            {name:'money', fieldLabel:'金额', xtype:'numberfield', allowBlank:false},
            {name:'out_number', fieldLabel:'外部订单号',emptyText:'非必填项。可以填写订单号或账单号等'},
            {name:'detail', fieldLabel:'摘要', xtype:'textarea', height:80, allowBlank:false},
            {name:'other', fieldLabel:'其他说明', xtype:'textarea', height:80}
        ]
    });

    var _win = Ext.create('Ext.Window', {
        title : '余额调整',
        width : 500,
        autoHeight: true,
        closeAction : 'hide',
        modal : true,
        items : [_form],
        buttons:[
            //{text:'values', handler:function () { showFormValues(_form) }},
            {text:'保存', handler:do_save},
            {text:'取消', handler:function () { _win.hide(); }}
        ]
    });


    function do_save() {
        var _f = _form.getForm();
        if (!_f.isValid()) return ExtAlert('金额与摘要必须填写！');
        var data = _f.getValues();
        console.log( data );

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/AccountDetail/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                //console.log(response.responseText);
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info);
                if (ret.status){
                    var org = SUNLINE.getSelected(org_grid);
                    var money = data.type == '收入' ? data.money : (0-data.money);
                    //更新账户余额
                    org.set('org_balance', (parseFloat(org.get('org_balance')) + parseFloat(money)) );
                    ad_store.reload();
                    _f.reset();
                    _win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                //console.log(arguments);
            }
        });
    }

    function account_out(b) {
        var org = SUNLINE.getSelected(org_grid);
        if (!org) return ExtAlert('请选择您要调整的账户信息。');
        var vs = {
            'org_id' : org.data.org_id,
            'org_name' : org.data.org_name,
            'type' : '支出',
        };
        _win.setTitle('余额调整：支出');
        _win.show(b.id);
        _form.getForm().setValues(vs);
    }

    function account_in(b) {
        var org = SUNLINE.getSelected(org_grid);
        if (!org) return ExtAlert('请选择您要调整的账户信息。');
        var vs = {
            'org_id' : org.data.org_id,
            'org_name' : org.data.org_name,
            'type' : '收入',
        };
        _win.setTitle('余额调整：收入');
        _win.show(b.id);
        _form.getForm().setValues(vs);
    }

    var pb, pbody;
    function showDetail(b) {
        var row = SUNLINE.getSelected(ad_grid);
        if (!row) return ExtAlert('请选择您要查看的账户流水记录。');
        //console.log(row);
        if (!pb) pb = Ext.create('Ext.Window', {
            title : '流水详情',
            width : 600,
            height : 400,
            closeAction : 'hide',
            autoScroll : true,
            modal : true,
            buttons : [
                {text:'关闭', handler:function () { pb.hide(); }}
            ]
        });
        pb.show(b.id);
        pbody = pb.body;
        if (!isNaN(row.data.ad_time)) row.data.ad_time = timestamp2date(row.data.ad_time);
        var html = ad_tpl.apply(row.data);
        pbody.setHtml(html);
    }

    var ad_tpl = new Ext.Template(
        '<div class="ad-box">' ,
        '<div class="row"><label>流水编号：</label><div>{ad_serial_number}&nbsp;</div></div>',
        '<div class="row"><label>单位名称：</label><div>{ad_sorg_name}&nbsp;</div></div>',
        //'<div class="row"><label>操作类型：</label><div>{ad_theme}&nbsp;</div></div>',
        '<div class="row"><label>外部订单：</label><div>{ad_out_number}&nbsp;</div></div>',
        '<div class="row"><label>收支类型：</label><div>{ad_class}&nbsp;</div></div>',
        '<div class="row"><label>交易金额：</label><div>{ad_money}&nbsp;</div></div>',
        '<div class="row"><label>操作人：</label><div>{ad_uname}&nbsp;</div></div>',
        '<div class="row"><label>详细说明：</label><div>{ad_detail}&nbsp;</div></div>',
        '<div class="row"><label>摘要说明：</label><div>{ad_remark}&nbsp;</div></div>',
        '<div class="row"><label>操作时间：</label><div>{ad_time}&nbsp;</div></div>',
        '</div>'
    );



    var a_out_btn, a_in_btn, a_ref_btn;
    var org_url = $__app__ + '/Company/dataJson';
    var org_field = [{name:"org_id"} ];
    var org_store = new SUNLINE.JsonStore(org_url,org_field);
    org_store.on('load', function (s) {
        ad_store.removeAll(); //加载时移除上一个账户显示的内容
        if (!a_out_btn) a_out_btn = Ext.getCmp('account_out');
        if (!a_in_btn) a_in_btn = Ext.getCmp('account_in');
        if (!a_ref_btn) a_ref_btn = Ext.getCmp('account_ref');
        a_out_btn.setDisabled(true);
        a_in_btn.setDisabled(true);
        a_ref_btn.setDisabled(true);
    });

    var org_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID", dataIndex:"org_id", id:'org_id',width:50, hidden:true},
        //{header:"编号", dataIndex:"org_bh", width:80, hidden:true},
        {header:"账户余额", dataIndex:"org_balance", width:120, renderer:money},
        {header:"品牌简称", dataIndex:"org_sname", width:160, hidden:true},
        {header:"单位名称", dataIndex:"org_name", width:300}
    ];

    var org_grid = new Ext.grid.GridPanel({
        region:'west',store:org_store,columns: org_cm,border:false,loadMask:{msg:'数据载入中，请稍后'},
        width : 400, minWidth:350, maxWidth:500, split: true,
        viewConfig:{emptyText:'没有单位账户信息',deferEmptyText:true},
        tbar: ['财务余额：',
            {text:'刷新', handler:function () { org_store.reload(); } },
            '->', {
            xtype:'trigger',
            triggerCls:'x-form-search-trigger',
            id:'search',
            emptyText:'编号、名称等',
            width:180,
            onTriggerClick:function (e) { doSearch(); },
            listeners:{
                "specialkey":function (_t, _e) {
                    if (_e.keyCode == 13) doSearch();
                }
            }
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:org_store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: '没有数据'
        })
    });

    org_grid.on('select', function (g, r, i) {
        //console.log(arguments);
        //console.log(r.data.org_name);
        SUNLINE.baseParams(ad_store, {ad_sorg_id : r.data.org_id});
        if (!a_out_btn) a_out_btn = Ext.getCmp('account_out');
        if (!a_in_btn) a_in_btn = Ext.getCmp('account_in');
        if (!a_ref_btn) a_ref_btn = Ext.getCmp('account_ref');
        if (!isDisabled('AccountDetail::out')) a_out_btn.setDisabled(false);
        if (!isDisabled('AccountDetail::in')) a_in_btn.setDisabled(false);
        a_ref_btn.setDisabled(false);
        ad_store.load();
    });

    function doSearch() {
        var skey = Ext.getCmp('search').getValue();
        SUNLINE.baseParams(org_store, {skey : skey});
        org_store.currentPage = 1;
        org_store.load();
    }




    new Ext.Viewport({
        layout : 'border',
        items : [org_grid, ad_grid]
    });
});