/**
 * Created by sunline on 16-5-21.
 */

Ext.onReady(function(){

    var is_balance = _is_balance;

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    function subject_code(value, _p){
        var l = value.toString().length, L= 0, lo=false;
        for (var i=0; i<_layer_len.length; i++){
            L += _layer_len[i];
            if (L == l) {
                lo = true;
                if (_p) lo = (L==4) ? 0 : L-_layer_len[i];
                break;
            }
        };
        return lo;
    }

    //自定义Vtype
    Ext.define('Override.form.field.VTypes', {
        override: 'Ext.form.field.VTypes',

        //验证科目编码的合法性
        subject: function(value) {
            return this.subjectFun(value);
        },

        subjectFun:subject_code, //验证方法

        //报错时提示信息
        subjectText: '科目编码结构为'+ _layer_len.join('-') +'，请输入正确的编码。'
    });

    var _default_category = '资产';
    var _url=$__app__+'/AccountSubject/dataJson';
    var _field=['as_id','as_category', 'as_code','as_name', 'as_direction', 'as_status', 'as_balance'];
    var _store=SUNLINE.JsonStore(_url,_field, false);
    var _default_params = {'as_category':_default_category, limit:9999};
    SUNLINE.baseParams(_store, _default_params);

    //组织无上级科目的数据模型
    Ext.define('NoParent', { extend:'Ext.data.Model', fields : _field });
    var no_parent_store = Ext.create('Ext.data.Store', {
        model : 'NoParent',
        data : [{as_id:'0000', as_category:'', as_code:'0000', as_name:'无上级科目', as_direction:'', as_status:'启用'}]
    });
    //获取无上级科目的Model(Record)
    var no_parent = no_parent_store.getAt(0);

    function show_name(v, m, r){
        var len = _layer_len, code= r.get('as_code'), sl = (code.length-len[0])/len[1], ps='';
        for (var i=0; i<sl; i++){ ps+='　'}
        return ps + v;
    };

    function show_control(v, m, r){
        var add = '<i class="fa fa-plus" title="增加子科目"></i>',
            edit = '<i class="fa fa-pencil" title="编辑"></i>',
            del = '<i class="fa fa-times" title="删除科目"></i>';
        return '<div class="_control">' + add + edit + del + '</div>';
    };

    function show_balance(v, m, r, ri, ci, store, view){
        var code = r.get('as_code'), reg=new RegExp('^'+code+'\\d+');
        var fi = store.find('as_code', reg, ri);
        if (fi>-1) return '';
        return Number(v).toFixed(2);
    };

    var _tbar = [
        '<b>类别：</b>',
        {text:'资产', enableToggle:true, toggleGroup:'category', pressed: true, handler:get_subject_data},
        {text:'负债', enableToggle:true, toggleGroup:'category', handler:get_subject_data},
        {text:'权益', enableToggle:true, toggleGroup:'category', handler:get_subject_data},
        {text:'成本', enableToggle:true, toggleGroup:'category', handler:get_subject_data},
        {text:'损益', enableToggle:true, toggleGroup:'category', handler:get_subject_data},
        '<b>操作：</b>'
    ];
    var _subject_bar = [
        {text:'新增', action:'add', handler:modify},
        {text:'编辑', action:'edit', handler:modify},
        {text:'删除', action:'del', handler:function(){ alert('财务科目数据的删除逻辑还需要沟通确认，在哪些情况下可以删除？'); }},
        {text:'刷新', handler:function(){ _store.reload(); }},
        {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}
    ];
    var _balance_bar = [
        //{text:'保存'},
        {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'}
    ];

    var _cm_items = [
        new Ext.grid.RowNumberer(),
        //{header: '操作', dataIndex: 'as_code', width: 90, renderer: show_control},
        {header: "编码", dataIndex: "as_code", width: 120},
        {header: "名称", dataIndex: "as_name", width: 320, renderer: show_name},
        {header: "余额方向", dataIndex: "as_direction", width: 120, align: 'center'}
    ];

    var _cm_subject = [
        {header: "状态", dataIndex: "as_status", width: 100}
    ];

    var _cm_balance = [
        {header: "期初余额", dataIndex: "as_balance", width: 150, editor:{xtype:'numberfield'}, align:'right', renderer:show_balance }
    ];


    //Grid Options
    var _grid_opt = {
        region: 'center',
        store: _store,
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '没有科目信息',
            deferEmptyText: true
        },
        listeners : {
            render : function(){ _store.load(); },
            beforeedit:function(e, c, o){
                if (show_balance(0, null, c.record, c.rowIdx, c.colIdx, _store) === '') return false;
            },
            edit : function(e, c, o){
                //console.log(c);
                if ( c.value == c.originalValue ) return false;
                var data = {as_id: c.record.get('as_id'), as_balance: c.value}
                console.log(data);
                var url = $__app__+'/AccountSubject/balance_save';
                _real_save(data, url);
            }
        }
    };

    if (is_balance) { //期初余额相关配置
        _tbar = _tbar.concat(_balance_bar);
        _cm_items = _cm_items.concat(_cm_balance);
        _grid_opt['plugins'] =  Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit:1});
    }else{ //科目管理相关配置
        _tbar = _tbar.concat(_subject_bar);
        _cm_items = _cm_items.concat(_cm_subject);
    };
    _grid_opt['tbar'] = _tbar;

    var _cm = {
        items: _cm_items,
        defaults: { sortable: false, menuDisabled : true }
    };
    _grid_opt['columns'] = _cm;


    //科目数据显示Grid
    var _grid=new Ext.grid.GridPanel(_grid_opt);

    //加载各类别的科目数据
    function get_subject_data(b){
        _default_params['as_category'] = b.text;
        SUNLINE.baseParams(_store, _default_params);
        _store.load();
    };

    //科目编辑表单
    var _form = Ext.create('Ext.form.Panel',{
        border :false,
        region : 'center',
        bodyStyle : 'padding:5px;',
        defaults : {
            anchor:'95%',
            labelAlign : 'right',
            labelWidth:80,
            labelSeparator:'：'
        },
        defaultType: 'textfield',
        items : [
            {fieldLabel:'ID', name:'as_id', xtype:'hidden' },
            {fieldLabel:'类别', name:'as_category', allowBlank:false, readOnly:true },
            {fieldLabel:'科目编码', name:'as_code', allowBlank:false, xtype:'numberfield',listeners:{blur:get_parent_subject}, vtype:'subject' },
            {fieldLabel:'科目名称', name:'as_name', allowBlank:false },
            {fieldLabel:'上级科目', name:'p_name', disabled:true },
            {fieldLabel:'余额方向', xtype:'fieldcontainer', defaultType:'radiofield',defaults:{flex:1},layout:'hbox', items:[
                {boxLabel:'借方', name:'as_direction', inputValue:'借方'},
                {boxLabel:'贷方', name:'as_direction', inputValue:'贷方'}
            ] }
        ]
    });

    //科目编辑窗口
    var _win = Ext.create('Ext.window.Window', {
        title: '科目管理',
        layout: 'border',
        modal : true,
        width : 530,
        height : 300,
        closeAction : 'hide',
        items : _form,
        buttons : [
            {text : 'Values', handler:function(){ showFormValues(_form); }},
            {text : '保存', handler:do_save},
            {text : '关闭', handler:function(){ _win.hide(); }}
        ]
    });


    /**
     * 新增|编辑的入口方法
     * @param b
     */
    function modify(b){
        var _title = _default_category+'类科目';
        if (b.action == 'add'){ //新增
            _title = '新增' + _title;
            var fd = {as_category:_default_category};
        }else{ //编辑
            _title = '编辑' + _title;
            var row = SUNLINE.getSelected(_grid);
            if (!row){
                Ext.Msg.alert('友情提醒','请选择您想编辑的科目数据。');
                return;
            };
            var fd = row.data;
            var pl = subject_code(fd.as_code, true);
            var pn = no_parent.get('as_name');
            if (pl>0){
                var tr =  get_local_subject(fd.as_code.toString().substr(0,pl));
                pn = tr.get('as_name');
            };
            fd['p_name'] = pn;
        };
        _form.getForm().setValues(fd);
        _win.setTitle(_title);
        _win.show();
    };


    function do_save(b){
        var _f = _form.getForm();
        if (!_f.isValid()){
            Ext.Msg.alert('友情提醒','请正确填写红色边框处的数据！');
            return;
        }
        var _fv = _f.getValues();
        var url = $__app__+'/AccountSubject/save';
        _real_save(_fv, url, _f, _win);
    };

    function _real_save(data, url, form, win){
        if (!data) {
            Ext.Msg.alert('友情提醒','缺少必要的数据，无法完成本次操作！');
            return;
        };
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: url,
            params: data,
            method:'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info.msg);
                if(r.status){
                    if (win) win.hide();
                    if (form) form.reset();
                    //todo 利用本地插入方式替换reload
                    _store.reload();
                }
                myMask.hide();
            }
        });
    }


    /**
     * 设置表单中上级科目与余额方向的值
     * @param field 科目编码表单域
     */
    function get_parent_subject(field){
        var code = field.getValue();
        var pl = subject_code(code, true);
        code = pl==0 ? 'no' : code.toString().substr(0,pl);
        console.log('pl:' + pl);
        console.log('code:'+code);
        var p = get_local_subject(code);
        var _f = _form.getForm(), _s = _f.getValues();
        _s['p_name'] = p.get('as_name');
        _s['as_direction'] = p.get('as_direction');
        _f.setValues(_s);
    };

    /**
     * 获取指定编码的科目数据
     * @param code 科目编码
     * @returns {Record}
     */
    function get_local_subject(code){
        //取本地的科目数据
        var s = new RegExp('^'+ code +'$');
        var ri = _store.find('as_code', s);
        if (ri > -1){
            var r = _store.getAt(ri);
            return r;
        };
        return no_parent;
    };

    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: _grid, action:'Account', table:'AccountSubject', pk_id:'as_id'}] });

});