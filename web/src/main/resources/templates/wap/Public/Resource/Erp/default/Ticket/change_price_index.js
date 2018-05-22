/**
 * Created by wangxinghuan on 15-3-30.
 */
Ext.onReady(function(){
//    Ext.Msg.alert('提示信息','这是页面')
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var _store = SUNLINE.JsonStore($__app__ + '/Ticket/change_price_json', ["proType","wapPrice","minPrice","_id","idType"]);
    var _cm = new Ext.grid.ColumnModel({
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"线路类型", dataIndex:"proType", width:200},
            {header:"利润（%）", dataIndex:"wapPrice", width:200,editor: new Ext.form.NumberField({ allowBlank: false })},
            {header:"保底利润（元）", dataIndex:"minPrice", width:200,editor: new Ext.form.NumberField({ allowBlank: false })}
        ],
        defaults:{sortable: true, menuDisabled:true}
    });

    var _grid = new Ext.grid.EditorGridPanel({
        region : 'center',
        border : false,
        store : _store,
        clicksToEdit:1,
        loadMask : {msg:'违约规则数据载入中，请稍后'},
        cm : _cm, //表格列定义
        sm: new Ext.grid.RowSelectionModel({singleSelect:true}),//行选择模式(单选)
        viewConfig : {emptyText: '暂无手机价格设置'},
        tbar: [
            '->',
            {text:'刷新', iconCls:'button-ref', handler:function(){_store.reload();} }
        ],
        buttons:[
            {text:'保存',handler:save}
        ]
    });

    function del(){
        var _row = _grid.getSelectionModel().getSelected();
        _store.remove(_row);
    }

    function save(){
        var tmp = [],_id;
        _store.each(function(record){
            if(record.data._id){
                _id=record.data._id;
            }
            tmp.push(record.data) ;
        });
//        Ext.Msg.alert('友情提示',Ext.encode(tmp));
//        return;
        var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在保存，请稍后...'});
        mask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Ticket/save_m_price',
            method : 'POST',
            params : {data:Ext.encode(tmp),_id:_id},
            success : function(response, opts){
                var rst = Ext.decode(response.responseText);
                mask.hide();
                if (rst.status=='1'){
                    Ext.Msg.alert("友情提示",rst.info);
                }else{
                    Ext.Msg.alert("友情提示",rst.info);
                }
            },
            failure : function(response, opts){
                var rst = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', rst.info+'手机站价格设置保存失败！请稍候再试。');
                mask.hide();
            }
        });
    }

    new Ext.Viewport({
        layout:'border',
        items:[_grid]
    });
})