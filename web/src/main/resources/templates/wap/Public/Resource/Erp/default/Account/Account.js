/**
 * Created by sunline on 16-5-30.
 */

Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var _url = $__app__ + '/Account/dataJson';
    var _fld = ['ac_id','ac_time','ac_remark','ac_money','ac_category','ac_company','ac_status','ac_from_org',
        'ac_from_info','ac_sorg_id','ac_sorg_name','ac_uid','ac_uname','ac_confirm_id','ac_confirm_name',
        'ac_confirm_time','ac_confirm_info','ac_type','ac_name'];
    var _store = SUNLINE.JsonStore(_url, _fld);

    //收支类别的数据源
    var _cate_url_in, _cate_fld, _cate_store_in, _cate_url_out, _cate_store_out;
    _cate_url_in = $__app__ + '/Account/category/type/in';
    _cate_url_out = $__app__ + '/Account/category/type/out';
    _cate_fld = ['category'];
    _cate_store_in = SUNLINE.JsonStore(_cate_url_in, _cate_fld);
    _cate_store_out = SUNLINE.JsonStore(_cate_url_out, _cate_fld);

    //账户信息的数据源
    var  _account_store,_account_url, _account_fld;
    _account_url = $__app__ + '/Account/book';
    _account_fld = ['account_name', 'balance', 'order'];
    _account_store = SUNLINE.JsonStore(_account_url, _account_fld);
    _account_store.on('load', function(){
        if ( _account_form )  _account_form.getForm().reset();
    });

    //管理公司列表
    var _manage_url, _manage_fld, _manage_store, _manage_store_city;
    _manage_url = $__app__ + '/Company/manage';
    _manage_fld = ['org_id','org_name','org_sname','org_city'];
    _manage_store = SUNLINE.JsonStore(_manage_url, _manage_fld);
    _manage_store_city = SUNLINE.JsonStore(_manage_url, _manage_fld);

    function money_in(v,m,r){
        var t = r.get('ac_type');
        m.tdAttr = 'title="' + RMB(v) + '"';
        return t == '收入' ? money(v) : '';
    };

    function money_out(v,m,r){
        var t = r.get('ac_type');
        m.tdAttr = 'title="' + RMB(v) + '"';
        return t == '支出' ? money(v) : '';
    };

    var _cm = {
        items: [
            new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"ac_id",width:80, hidden:true},
            {header:"状态",dataIndex:"ac_status",width:60, hidden:true},
            {header:"日期",dataIndex:"ac_time",width:100, renderer:number2date},
            {header:"类别",dataIndex:"ac_category",width:130},
            {header:"摘要",dataIndex:"ac_remark",width:300},
            {header:"收入",dataIndex:"ac_money",width:120, renderer:money_in},
            {header:"支出",dataIndex:"ac_money",width:120, renderer:money_out},
            {header:"所属账户",dataIndex:"ac_name",width:150},
            {header:"所属公司",dataIndex:"ac_company",width:150},
            {header:"操作人ID",dataIndex:"ac_uid",width:80, hidden:true},
            {header:"操作财务",dataIndex:"ac_uname",width:120},
            {header:"汇款信息",dataIndex:"ac_from_info",width:180},
            //{header:"认领人",dataIndex:"ac_confirm_name",width:120},
            {header:"汇款单位",dataIndex:"ac_from_org",width:180}
        ],
        defaults: { sortable: false/*, menuDisabled : true*/ }
    };

    var _grid = new Ext.grid.GridPanel({
        region: 'center',
        store: _store,
        columns : _cm,
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂无财务数据',
            deferEmptyText: true
        },
        tbar : [
            {text:'收入', act:'in', handler:modify},
            {text:'支出', act:'out', handler:modify},
            {text:'转账', act:'move', handler:function(b){transfer_win.show(b.id)}},
            {text:'编辑', id:'_edit', handler:edit},
            {text:'删除', id:'_del', handler:do_del},
            {text:'刷新', handler:function(){ _store.reload(); }},
            {text:'类别管理', act:'category', id: '_category', menu:{
                items:[
                    {text:'收入类别', act:'in', handler:modify_category},
                    {text:'支出类别', act:'out', handler:modify_category}
                ]
            }},
            {text:'账户设置', act:'setup_account', handler:setup_account},
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '->',
            '快捷搜索',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'detail_search',
                cls:'search-icon-cls',
                emptyText:'输入关键字',
                width:170,
                onTriggerClick:function (e) {
                    detail_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            detail_dosearch();
                        }
                    }
                }
            }
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        })
    });



    /**
     * 快捷搜索
     */
    function detail_dosearch(){
        var key=Ext.getCmp('detail_search').getValue();
        SUNLINE.baseParams(_store,{skey:key},true);
        _store.currentPage=1;
        _store.load();
    }

    /**************************************************/
    /*                转账部分                        */
    /**************************************************/

    var transfer_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:200 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:80,labelAlign:"right" },
                items:[
                    {
                        fieldLabel:'转出账户',
                        xtype: 'combo',
                        name : 'out_name',
                        store: _account_store,
                        displayField:"an_name",
                        valueField:"an_name",mode:"remote",
                        forceSelection:true,typeAhead:true,allowBlank:false,editable:false
                    },
                    {id:"transfer_money",name:"transfer_money",fieldLabel:"金额",allowBlank:false,xtype:"numberfield",
                        listeners:{ blur:function(t){ var v = t.getValue(); if (!v) return; transfer_form.getForm().setValues({transfer_money_ex:RMB(v)}); } }
                    },
                    {id:"transfer_money_ex",name:"transfer_money_ex",fieldLabel:"大写",allowBlank:false,xtype:"displayfield"},
                    {name:"poundage_money", fieldLabel:"手续费",xtype:"numberfield"},
                    {
                        fieldLabel:'转入账户',
                        xtype: 'combo',
                        name : 'in_name',
                        store: _account_store,
                        displayField:"an_name",
                        valueField:"an_name",mode:"remote",
                        forceSelection:true,typeAhead:true,allowBlank:false,editable:false
                    },
                    {name:"ac_time",fieldLabel:"转账日期",xtype:"datefield", value:new Date(), maxValue:new Date(), format:'Y-m-d',allowBlank:false, editable:false},
                    {name:"ac_remark", fieldLabel:"摘要",xtype:'textarea'}
                ]
            }
        ]
    });

    var transfer_win = Ext.create('Ext.Window', {
        title : '转账',
        width : 500,
        autoHeight : true,
        resizable : false,
        modal : true,
        items : transfer_form,
        closeAction : 'hide',
        buttons : [
            {text:'保存',handler:move},
            {text:'关闭', handler:function () {
                transfer_win.hide();
            }}
        ]
    });

    transfer_win.on('hide',function(){
        transfer_form.form.reset();
    })
    
    function move(){
        if(!transfer_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var data=transfer_form.getForm().getValues();
        if(data.out_name==data.in_name){
            Ext.Msg.alert('友情提示', '转出账户与转入账户不能相同！');
            return;
        }
        Ext.MessageBox.confirm('友情提示','是否确认转账？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Account/transfer_accounts',
                    params:data,
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            _store.reload();
                            transfer_win.hide();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '转账失败');
                    }
                })
            }
        })
    }

    /**
     * 删除记账数据
     * @param b
     * @returns {*}
     */
    function do_del(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您要删除的数据。');
        Ext.Msg.confirm('友情提醒', '您真的要删除这条数据吗？',function(btn){
            if (btn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Account/del',
                    params : {ac_id: row.get('ac_id')},
                    method : 'POST',
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        ExtAlert(r.info);
                        if (r.status){
                            _store.remove(row);
                        }
                    },
                    failure: function(response, opts) {
                        ExtAlert('请求服务器失败，状态码：' + response.status);
                    }
                });
            }
        });
    };

    /**
     * 编辑
     * @param b
     * @returns {*}
     */
    function edit(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您要编辑的数据。');
        var fv = {}, d = row.data;
        for (var i in d){ fv[i] = d[i]; };
        fv['ac_time'] = int2date(fv['ac_time']);
        fv['ac_money_ex'] = RMB(fv['ac_money']);
        if (row.data.ac_type == '收入') {
            _form_in.getForm().setValues(fv);
            var ac_from_org = Ext.getCmp('ac_from_org');
            if (fv.ac_sorg_id=='' || fv.ac_sorg_id == '0'){
                ac_from_org.setReadOnly(false);
            }else{
                ac_from_org.setReadOnly(true);
            }
            _win_in.show(b.id);
        }else{
            _form_out.getForm().setValues(fv);
            _win_out.show(b.id);
        }
    };

    /**************************************************/
    /*                收入部分                        */
    /**************************************************/

    /**
     * 通过银行卡号查找所属分销商
     * @param t
     * @returns {boolean}
     */
    function get_sales_org(t){
        var bn = t.getValue();
        if (!bn) return false;
        Ext.Ajax.request({
            url : $__app__ + '/BankCard/get_company',
            params : {skey: bn},
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                var ac_from_org = Ext.getCmp('ac_from_org');
                var ac_sorg_id = Ext.getCmp('ac_sorg_id');
                var ac_sorg_name = Ext.getCmp('ac_sorg_name');
                if (r.total){
                    var c = r.data[0];
                    ac_from_org.setReadOnly(true);
                    ac_from_org.setValue(c.org_name);
                    ac_sorg_id.setValue(c.org_id);
                    ac_sorg_name.setValue(c.org_name);
                }else{
                    ac_from_org.setReadOnly(false);
                    //ac_from_org.setValue('');
                    ac_sorg_id.setValue('');
                    ac_sorg_name.setValue('');
                }
            },
            failure: function(response, opts) {
                console.log('请求服务器失败，状态码：' + response.status);
            }
        });
    };

    //收入表单
    var _form_in = Ext.create('Ext.form.Panel', {
        border:false,
        defaultType : 'textfield',
        bodyStyle : 'padding:5px; padding_bottom:0;',
        defaults : { anchor: '100%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {id:"ac_id",name:"ac_id",fieldLabel:"ID",maxLength:"11",allowBlank:false,xtype:"hidden"},
            {xtype:'fieldset', title:'汇款信息', defaultType:'textfield',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {id:"ac_from_info",name:"ac_from_info",fieldLabel:"银行卡号",maxLength:"100",
                        emptyText:'输入对方银行账号可以自动匹配分销商',
                        listeners:{ blur:get_sales_org }
                    },
                    {id:"ac_from_org",name:"ac_from_org",fieldLabel:"汇款单位",maxLength:"100"},
                    {xtype:'displayfield', fieldLabel:'说明', value:'<span style="color:#666;">自动匹配的汇款单位不能编辑。</span>'}
                ]
            },
            {xtype:'fieldset', title:'记账数据', defaultType:'textfield',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {id:"ac_money",name:"ac_money",fieldLabel:"金额",allowBlank:false,xtype:"numberfield",
                        listeners:{ blur:function(t){ var v = t.getValue(); if (!v) return; _form_in.getForm().setValues({ac_money_ex:RMB(v)}); } }
                    },
                    {id:"ac_money_ex",name:"ac_money_ex",fieldLabel:"大写",allowBlank:false,xtype:"displayfield"},
                    {id:"ac_time",name:"ac_time",fieldLabel:"汇款日期",xtype:"datefield", value:new Date(), maxValue:new Date(), format:'Y-m-d',allowBlank:false, editable:false},
                    {id:"ac_remark",name:"ac_remark",fieldLabel:"摘要",maxLength:"100"},
                    {
                        fieldLabel:'收入类别',
                        xtype: 'combo',
                        store: _cate_store_in,
                        name : 'ac_category',
                        displayField:"category", valueField:"category",
                        mode:"remote",forceSelection:true,typeAhead:true,editable:false
                    },
                    {
                        fieldLabel: '所属公司',
                        xtype: 'combo',
                        id:'company_income',
                        name : 'ac_company',
                        store: _manage_store,
                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">{org_city} - {org_sname}</li>',
                            '</tpl></ul>'
                        ),
                        displayField:"org_sname",
                        valueField:"org_sname",mode:"remote",
                        forceSelection:true,typeAhead:true,editable:false
                    },
                    {
                        fieldLabel: '所属城市',
                        xtype: 'combo',
                        id:'city_income',
                        name : 'ac_city',
                        store: _manage_store_city,
                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">{org_city}</li>',
                            '</tpl></ul>'
                        ),
                        displayField:"org_city",
                        valueField:"org_city",mode:"remote",
                        forceSelection:true,typeAhead:true,editable:false
                    },
                    {
                        fieldLabel:'选择账户',
                        xtype: 'combo',
                        name : 'ac_name',
                        store: _account_store,
                        displayField:"an_name",
                        valueField:"an_name",mode:"remote",
                        forceSelection:true,typeAhead:true,allowBlank:false,editable:false
                    }
                ]
            },
            {id:"ac_sorg_id",name:"ac_sorg_id",fieldLabel:"同行单位ID",xtype:"hidden"},
            {id:"ac_sorg_name",name:"ac_sorg_name",fieldLabel:"同行单位名称",xtype:"hidden"}
        ]
    });


    //收入窗口
    var _win_in = Ext.create('Ext.Window', {
        title : '收入',
        width : 500,
        autoHeight : true,
        resizable : false,
        modal : true,
        items : _form_in,
        closeAction : 'hide',
        buttons : [
            {text:'Values', handler:function(){ showFormValues(_form_in); }},
            {text:'保存进认领', act:'draft', handler:do_in_save},
            {text:'直接保存', act:'save', handler:do_in_save},
            {text:'关闭', handler:function(){ _win_in.hide(); }}
        ],
        listeners : {
            /*'show' : function(){ _form.getForm().setValues(dv); }*/
        }
    });

    //按钮事件方法
    function modify(b){
        if (b.act == 'in')
            _win_in.show(b.id);
        else
            _win_out.show(b.id);
    };

    function do_in_save(b){
        var text = '您确定要直接保存收入信息吗？';
        if (b.act == 'draft') text = '您确定要保存进认领吗？';
        Ext.Msg.confirm('友情提醒', text, function(btn){
            if (btn!='yes') return false;

            var _f = _form_in.getForm();
            if (!_f.isValid()) return ExtAlert( '请正确填写表单，注意红框显示部分。');
            var fv = _f.getValues();
            if (b.act == 'draft'){//保存进认领
                if (fv.ac_from_info=='') return ExtAlert('请填写银行卡号等汇款信息，以方便同事认领。');
                if (fv.ac_from_org=='') return ExtAlert('请填写汇款单位相关信息，以方便同事认领。');
            }else{
                if (fv.ac_remark=='') return ExtAlert('请填写摘要。');
                if (fv.ac_category=='') return ExtAlert('请填写收入类别。');
                if (fv.ac_company=='') return ExtAlert('请填写所属公司。');
            };
            fv.act = b.act;
            var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : $__app__ + '/Account/save_in',
                params : fv,
                method: 'POST',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示',r.info.msg);
                    if (r.status){
                        _win_in.hide();
                        if (fv['ac_id']==''){
                            fv['ac_id'] = r.info.ac_id;
                            fv['ac_time'] = fv['ac_time'].replace(/-/ig, '');
                            fv['ac_type'] = '收入';
                            fv['ac_status'] = '待认领';
                            _store.add(fv);
                        }else{
                            var row = SUNLINE.getSelected(_grid);
                            for (var i in fv){
                                row.set(i, fv[i]);
                            };
                            row.commit();
                        };
                        _f.reset();
                    };
                    myMask.hide();
                },
                failure: function(response, opts) {
                    Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                    myMask.hide();
                }
            });
        });
    };



    /**************************************************/
    /*                支出部分                        */
    /**************************************************/
    var _form_out = Ext.create('Ext.form.Panel', {
        border:false,
        defaultType : 'textfield',
        bodyStyle : 'padding:5px; padding_bottom:0;',
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {name:"ac_id",fieldLabel:"ID",maxLength:"11",allowBlank:false,xtype:"hidden"},
            {name:"ac_money",fieldLabel:"金额",allowBlank:false,xtype:"numberfield",
                listeners:{ blur:function(t){ var v = t.getValue(); if (!v) return; _form_out.getForm().setValues({ac_money_ex:RMB(v)}); } }
            },
            {name:"ac_money_ex",fieldLabel:"大写",allowBlank:false,xtype:"displayfield"},
            {name:"ac_time",fieldLabel:"支出日期",xtype:"datefield", value:new Date(), maxValue:new Date(), format:'Y-m-d',allowBlank:false, editable:false},
            {name:"ac_remark",fieldLabel:"摘要",maxLength:"100",allowBlank:false},
            {
                fieldLabel:'支出类别',
                xtype: 'combo',
                store: _cate_store_out,
                name : 'ac_category',
                displayField:"category", valueField:"category",
                mode:"remote",forceSelection:true,typeAhead:true,editable:false,allowBlank:false
            },
            {
                fieldLabel: '所属公司',
                xtype: 'combo',
                id:'company_cost',
                name : 'ac_company',
                store: _manage_store,
                tpl: Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{org_city} - {org_sname}</li>',
                    '</tpl></ul>'
                ),
                displayField:"org_sname",
                valueField:"org_sname",mode:"remote",forceSelection:true,typeAhead:true,allowBlank:false,editable:false
            },
            {
                fieldLabel: '所属城市',
                xtype: 'combo',
                id:'city_cost',
                name : 'ac_city',
                store: _manage_store_city,
                tpl: Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{org_city}</li>',
                    '</tpl></ul>'
                ),
                displayField:"org_city",
                valueField:"org_city",mode:"remote",
                forceSelection:true,typeAhead:true,editable:false
            },
            {
                fieldLabel:'选择账户',
                xtype: 'combo',
                name : 'ac_name',
                store: _account_store,
                displayField:"an_name",
                valueField:"an_name",mode:"remote",forceSelection:true,typeAhead:true,allowBlank:false,editable:false
            }
        ]
    });

    var _win_out = Ext.create('Ext.Window', {
        title : '支出',
        width : 500,
        /*height : 300,*/
        resizable : false,
        modal : true,
        items : _form_out,
        closeAction : 'hide',
        buttons : [
            {text:'Values', handler:function(){ showFormValues(_form_out); }},
            {text:'保存', act:'save', handler:do_out_save},
            {text:'关闭', handler:function(){ _win_out.hide(); }}
        ]
    });

    Ext.getCmp('company_income').on({
        select:function(c,r,e){
            var row= r[0].data;
            SUNLINE.baseParams(_manage_store_city,{org_sname:row.org_sname});
            _manage_store_city.load();
            Ext.getCmp('city_income').setValue(row.org_city);
        }
    });

    Ext.getCmp('city_income').on({
        focus:function(c,r,e){
            var org_sname=Ext.getCmp('company_income').getValue();
            SUNLINE.baseParams(_manage_store_city,{org_sname:org_sname});
            _manage_store_city.load();
        }
    });

    Ext.getCmp('company_cost').on({
        select:function(c,r,e){
            var row= r[0].data;
            SUNLINE.baseParams(_manage_store_city,{org_sname:row.org_sname});
            _manage_store_city.load();
            Ext.getCmp('city_cost').setValue(row.org_city);
        }
    });

    Ext.getCmp('city_cost').on({
        focus:function(c,r,e){
            var org_sname=Ext.getCmp('company_cost').getValue();
            SUNLINE.baseParams(_manage_store_city,{org_sname:org_sname});
            _manage_store_city.load();
        }
    });

    function do_out_save(b){
        var _f = _form_out.getForm();
        if (!_f.isValid()) return ExtAlert( '请正确填写表单，注意红框显示部分。');
        var fv = _f.getValues();
        console.log(fv);
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Account/save_out',
            params : fv,
            method: 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info.msg);
                if (r.status){
                    _win_out.hide();
                    if (fv.ac_id==''){
                        fv['ac_id'] = r.info.ac_id;
                        fv['ac_time'] = fv['ac_time'].replace(/-/ig, '');
                        fv['ac_type'] = '支出';
                        fv['ac_status'] = '正常';
                        _store.add(fv);
                    }else{
                        var row = SUNLINE.JsonStore(_grid);
                        for (var i in fv){
                            row.set(i, fv[i]);
                        };
                        row.commit();
                    }
                    _f.reset();
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };




    /************************************************/
    /*          收入支出类别管理                    */
    /************************************************/

    var _category_form, _category_win;

    function modify_category(b){
        var title = b.act == 'in' ? '收入类别管理': '支出类别管理';
        if (!_category_form){
            _category_form = Ext.create('Ext.form.Panel',{
                border:false,
                region : 'center',
                bodyStyle : 'padding:5px; padding_top:0;',
                defaults : { anchor: '100%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {xtype:'hidden', name:'type'},
                    {xtype:'textareafield', name:'category', height:285}
                ]
            });
        };
        if (!_category_win){
            _category_win = Ext.create('Ext.Window', {
                title : '类别',
                width : 500,
                height : 400,
                resizable : false,
                modal : true,
                layout : 'border',
                closeAction:'hide',
                items : [
                    {region:'north', html:'填写说明：一行一个类别名称', autoHeight:true, bodyStyle:'padding:5px;'},
                    _category_form
                ],
                buttons : [
                    {text:'Values', handler: function(){ showFormValues(_category_form); }},
                    {text:'保存', act:'save', handler: category_save},
                    {text:'关闭', handler: function(){ _category_win.hide(); }}
                ],
                listeners : {
                    /*'show' : function(){ _form.getForm().setValues(dv); }*/
                }
            });
        };
        var store = b.act=='in' ? _cate_store_in : _cate_store_out;
        var _type = [];
        store.each(function(r){
            _type.push(r.get('category'));
        });
        var dv = {type:b.act, category: _type.join('\n')};
        _category_win.setTitle(title);
        _category_form.getForm().setValues(dv);
        _category_win.show(b.id);
    };

    /**
     * 收支类别保存
     * @param b
     */
    function category_save(b){
        var _fv = _category_form.getForm().getValues();
        if (_fv.type=='' || filterHtml(_fv.category) == ''){
            Ext.Msg.alert('友情提醒', '请正确填写类别信息。');
            return;
        };
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Account/category_save',
            params : _fv,
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info);
                if (r.status){
                    _category_win.hide();
                    if (_fv.type == 'in ')
                        _cate_store_in.load();
                    else
                        _cate_store_out.load();
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };



    /***************************************************/
    /*             账户设置管理                        */
    /***************************************************/

    var _account_grid, _account_cm, _account_win, _account_form;

    function setup_account(b){
        if (!_account_cm)
            _account_cm = {
                items : [
                    {header:'ID', dataIndex:'an_id', width:280,hidden:true},
                    {header:'账户名称', dataIndex:'an_name', width:280},
                    {header:'排序', dataIndex:'an_sort', width:60, align:'right'},
                    {header:'期初余额', dataIndex:'an_money', width:150, align:'right', renderer:money }
                ]
            };
        if (!_account_grid){
            _account_grid = new Ext.grid.GridPanel({
                region: 'center',
                store: _account_store,
                columns : _account_cm,
                border: false,
                loadMask: {msg: '数据载入中，请稍后'},
                viewConfig: {
                    emptyText: '暂无账户信息',
                    deferEmptyText: true
                },
                listeners : {
                    'select' :function(g, r, i, o){
                       // clog(r.data);
                        var dv = {};
                        dv['an_id'] = r.data.an_id;
                        dv['an_name'] = r.data.an_name;
                        dv['an_money'] = r.data.an_money;
                        dv['an_sort'] = r.data.an_sort;
                        _account_form.getForm().setValues(dv);
                        Ext.getCmp('_account_save').setText('编辑');
                    }
                }
            });
        };

        if (!_account_form)
            _account_form = Ext.create('Ext.form.Panel', {
                border:false,
                region : 'south',
                autoHeight:true,
                bodyStyle : 'padding:5px; background:#f1f1f1;',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {xtype:'hidden', name:'an_id', fieldLabel:'KEY'},
                    {xtype:'textfield', name:'an_name', fieldLabel:'账户名称',allowBlank:false},
                    {xtype:'numberfield', name:'an_money', fieldLabel:'期初余额', allowBlank:false, value:0},
                    {xtype:'numberfield', name:'an_sort', fieldLabel:'排序', allowBlank:false, value:0}
                ]
            });

        if (!_account_win)
            _account_win = Ext.create('Ext.Window', {
                title : '账户设置',
                width : 500,
                height : 400,
                resizable : false,
                modal : true,
                closeAction : 'hide',
                layout:'border',
                items : [_account_grid,_account_form],
                tools : [{
                    itemId: 'refresh',
                    type: 'refresh',
                    callback: function() {
                        _account_store.reload();
                        Ext.getCmp('_account_save').setText('新增');
                    }
                }],
                buttons : [
                    //{text:'Values', handler:function(){ showFormValues(_account_form)} },
                    {text:'新增', id:'_account_save', handler:book_save },
                    {text:'重置', handler:function(){ _account_form.getForm().reset(); Ext.getCmp('_account_save').setText('新增');} },
                    {text:'删除', handler:book_del },
                    {text:'关闭', handler:function(){ _account_win.hide(); } }
                ]
            });
        _account_win.show(b.id);
    };

    /**
     * 账户设置保存
     */
    function book_save(){
        var sf = _account_form.getForm();
        if (!sf.isValid()){
            Ext.Msg.alert('友情提醒', '请正确填写账户信息。');
            return;
        };
        var fv = sf.getValues();
        var row = SUNLINE.getSelected(_account_grid);
        //没有编辑任何内容时，放弃保存操作。
        if (fv.an_id){
            if ( fv.an_name == row.get('an_name') && parseFloat(fv.an_money) == parseFloat(row.get('an_money')) && fv.an_sort == row.get('an_sort') ) {
             clog('未做修改，程序放弃操作。');
             return;
             }
        }else{
            var index = -1, ri=0;
            _account_store.each(function(r){
                if (r.get('an_name') == fv.an_name) index=ri;
                ri++;
            });
            if (index > -1){
                Ext.Msg.alert('友情提醒', '您填写的账户名称已经存在，请不要重复添加。');
                return;
            };
        }
        if (fv.an_id){
            //编辑时，检查账户是否有记录
            var myMask = SUNLINE.LoadMask('账户数据检验中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : $__app__ + '/Account/book_change',
                params : fv,
                method : 'POST',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    myMask.hide();
                    if (r.status){
                        Ext.Msg.confirm('友情提示', '您要修改的账户已经有入账记录，您确定要修改吗？', function(y){
                            if (y=='yes') book_real_save(fv, sf, row);
                        });
                    }else{
                        book_real_save(fv, sf, row);
                    }
                },
                failure: function(response, opts) {
                    Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                    myMask.hide();
                }
            });
        }else{
            book_real_save(fv, sf, row);
        };
    };


    function book_real_save(fv, form, row){
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Account/book_save',
            params : fv,
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info);
                if (r.status){
                    //_account_win.hide();
                    if (!fv.an_id) {
                        _account_store.add(fv); //新增时添加
                    }else{
                        //编辑时，更新选中的记录
                        row.set('an_name', fv.an_name);
                        row.set('an_money', fv.an_money);
                        row.set('an_sort', fv.an_sort);
                        _account_grid.getSelectionModel().deselect(row);
                        _store.reload();
                    };
                    form.reset();
                    Ext.getCmp('_account_save').setText('新增');
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };


    function book_del(b){
        var row = SUNLINE.getSelected(_account_grid);
        if (!row) return ExtAlert('请选择您要删除的账户信息。');
        var myMask = SUNLINE.LoadMask('账户数据检验中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Account/book_change',
            params : row.data,
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                myMask.hide();
                if (r.status){
                    Ext.Msg.alert('友情提示', '该账户下已存在交易记录，不能删除');
                    return false;
                }else{
                    book_real_del(row);
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    }


    function book_real_del(row){
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Account/book_del',
            params : {an_id : row.get('an_id')},
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                ExtAlert(r.info);
                if (r.status){
                    _account_store.load();
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                ExtAlert( '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };


    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    ziyo_log({ listeners : [{grid: _grid, table:'Account', pk_id:'ac_id'}] });

});