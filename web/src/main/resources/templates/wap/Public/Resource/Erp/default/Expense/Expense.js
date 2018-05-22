/**
 * Created by sunline on 2016-05-23.
 */

Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    var _params = {};
    var _url = $__app__+'/Expense/dataJson';
    var _field=[
        'ex_id','ex_category','ex_money','ex_remark','ex_detail','ex_status','ex_return',
        'ex_submit_uid','ex_submit_name','ex_org_id','ex_org_name','ex_submit_time','ex_audit_uid',
        'ex_audit_name','ex_audit_time'
    ];
    var _store=SUNLINE.JsonStore(_url,_field);

    _store.on('beforeload',function(){
        get_total_info();
    });

    var _url_cate = $__app__+'/Expense/category';
    var _fld_cate = ['category'];
    var _store_cate = SUNLINE.JsonStore(_url_cate, _fld_cate);

    function ex_number(v){
        if (v.toString().length < 6) {
            var v = '000000' + v;
            v = v.substr(v.length-6, 6);
        };
        return v;
    };

    function ex_status(v, m, r){
        var color = {'草稿':'green', '待审核':'blue', '已审核':'#000', '已付款':'#FD00FF', '退回':'#f00'};
        var ret = v == '退回' ? ' <i class="fa fa-info-circle" title="'+ r.get('ex_return') +'"></i>' :'';
        return '<span style="color: '+ color[v] +'">'+ v  + ret+'</span>';
    };

    var _cm = {
        items: [
            new Ext.grid.RowNumberer(),
            {header: "状态", dataIndex: "ex_status", width: 80, renderer:ex_status},
            {header: "报销编号", dataIndex: "ex_id", width: 100, renderer:ex_number},
            {header: "报销日期", dataIndex: "ex_submit_time", width: 150},
            {header: "金额", dataIndex: "ex_money", width: 120, align:'right', renderer:money},
            {header: "费用类别", dataIndex: "ex_category", width: 110},
            {header: "事由摘要", dataIndex: "ex_remark", width: 200},
            {header: "报销人", dataIndex: "ex_submit_name", width: 90, renderer:function(v){ return '<div onclick="submit_name(\''+ v +'\')">'+v+'</div>' }},
            //{header: "所属单位", dataIndex: "ex_org_name", width: 90},
            {header: "审核人", dataIndex: "ex_audit_name", width: 110},
            {header: "审核时间", dataIndex: "ex_audit_time", width: 150}
        ],
        defaults: { sortable: false, menuDisabled : true }
    };

    var manCombox = SUNLINE.ComBoxPlus({
        id:'search_man',
        select:false,
        fields:['ex_submit_name','ex_submit_name'],
        url:$__app__+'/Expense/get_submit_man',
        config:{
            displayField:'ex_submit_name',
            valueField:'ex_submit_name',
            emptyText:'选择报销人',
            forceSelection:true,
            queryDelay:300,
            typeAhead:true,
            selectOnFocus : true,
            triggerAction:'all',
            queryParam:'skey',
            minChars:1,
            width:90
        }
    });

    var _grid = new Ext.grid.GridPanel({
        region: 'center',
        store: _store,
        columns : _cm,
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂无报销信息',
            deferEmptyText: true
        },
        tbar : [
            {text:'新增', act:'add', handler:modify, disabled:isDisabled('Expense::edit')},
            {text:'编辑', act:'edit', id:'_edit', handler:modify, disabled:isDisabled('Expense::edit')},
            {text:'删除', id:'_del', handler:do_del, disabled:isDisabled('Expense::edit')},
            {text:'刷新', handler:function(){ _store.reload(); }},
            {text:'审核', act:'audit', id: '_audit', handler:_audit, disabled:isDisabled('Expense::audit')},
            {text:'标记为已付款', id:'_mark', handler:_mark, xtype:'splitbutton', disabled:isDisabled('Expense::mark'), menu : {
                items : [
                    {text:'撤销标记', handler:_mark_return}
                ]
            }},
            {text:'费用类别', handler:category, disabled:isDisabled('Expense::category')},
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            {
                id:'seach_status',
                labelWidth:40,
                width:90,
                labelAlign:"right",
                style:'margin-top:5px;',
                name:"ex_status",
                fieldLabel:"",
                xtype:"combo",
                editable:false,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['combo_value'],
                    data:[
                        ['草稿'],
                        ['待审核'],
                        ['已审核'],
                        ['已付款'],
                        ['退回'],
                        ['全部']
                    ]
                }),
                displayField:"combo_value",
                valueField:"combo_value",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"",
                emptyText:'选择状态'
            },
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',labelWidth:0,labelAlign:"right",fieldLabel:" ",labelSeparator:'',width:105,gang:'seach_stop_date',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',labelWidth:0,labelAlign:"right",fieldLabel:" ",labelSeparator:'',width:105,gang:'seach_start_date'}),
            '-',
            manCombox,
            '-',
            {text:'查询',iconCls:'searchico',act:'select',handler:seach}
        ]
    });

    window.submit_name = function(name){
        SUNLINE.baseParams(_store,{submit_name:name}, true);
        _store.load();
    };

    //搜索
    function seach(){
        var seach_man=manCombox.getValue();
        var seach_status=Ext.getCmp('seach_status').getValue();
        var start_date=Ext.getCmp('seach_start_date').getValue();
        start_date=Ext.Date.format(start_date,'Y-m-d');
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        stop_date=Ext.Date.format(stop_date,'Y-m-d');
        _params = {'seach_status':seach_status,'seach_man':seach_man,'start_date':start_date,'stop_date':stop_date};
        SUNLINE.baseParams(_store, _params);
        _store.currentPage=1;
        _store.load();
    }


    //草稿：draft_money元；待审核：noaud_money元；已审核（未付款）：aud_money元；已付款：pay_money元
    function get_total_info(){
        Ext.Ajax.request({
            url:$__app__ + '/Expense/get_total_info',
            params:_params,
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                if(result.status ==1){
                    var draft_money=result.info.draft_money?result.info.draft_money:0;
                    var noaud_money=result.info.noaud_money?result.info.noaud_money:0;
                    var aud_money=result.info.aud_money?result.info.aud_money:0;
                    var pay_money=result.info.pay_money?result.info.pay_money:0;
                    var str='草稿：'+draft_money+'元，待审核：'+noaud_money+'元，已审核（未付款）：'+aud_money+'元，已付款：'+pay_money+'元';
                    document.getElementById('total_info').innerHTML = str;
                }
            }
        })
    }

    var btn_edit = Ext.getCmp('_edit');
    var btn_del = Ext.getCmp('_del');
    var btn_mark = Ext.getCmp('_mark');
    var btn_audit = Ext.getCmp('_audit');
    _grid.on('select', function( g, r, i, o ){
        var status = r.get('ex_status');
        if ( !isDisabled('Expense::edit') ) btn_edit.setDisabled( status!='草稿'&&status!='退回' );
        if ( !isDisabled('Expense::edit') ) btn_del.setDisabled(status!='草稿');
        if ( !isDisabled('Expense::audit') ) btn_audit.setDisabled(status=='草稿'||status=='已审核'||status=='已付款'||status=='退回');
        if ( !isDisabled('Expense::mark') ) btn_mark.setDisabled(status!='已审核'&&status!='已付款');
    });


    //{id:"ex_status",name:"ex_status",fieldLabel:"状态",maxLength:"'草稿','待审核','已审核','已付款','退回'",allowBlank:false,
    // xtype:"combo",xname:"enum",triggerAction:"all",store:new Ext.data.SimpleStore({fields:['combo_ex_status'],data:[['草稿'],['待审核'],['已审核'],['已付款'],['退回']]}),
    // displayField:"combo_ex_status",valueField:"combo_ex_status",mode:"local",forceSelection:true,typeAhead:true,value:"草稿"},
    var _form = Ext.create('Ext.form.Panel',{
        border:false,
        defaultType : 'textfield',
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {id:"ex_id",name:"ex_id",fieldLabel:"ID",xtype:"hidden"},
            {id:"ex_category",name:"ex_category",fieldLabel:"费用类别",allowBlank:false, xtype:"combo",
                editable:false, triggerAction:"all",store:_store_cate,displayField:'category',valueField:'category',
                forceSelection:true, emptyText:'请选择费用类别'
            },
            {id:"ex_money",name:"ex_money",fieldLabel:"报销金额",allowBlank:false, xtype:'numberfield',
                listeners: {
                    blur : function(t,e){
                        var rmb = RMB(t.getValue());
                        Ext.getCmp('ex_money_ex').setValue(rmb);
                    }
                }
            },
            {id:"ex_money_ex",name:'ex_money_ex',fieldLabel:"大写金额",xtype:'displayfield'},
            {id:"ex_remark",name:"ex_remark",fieldLabel:"事由摘要",maxLength:"100",allowBlank:false},
            {id:"ex_detail",name:"ex_detail",fieldLabel:"报销明细",maxLength:"1000",xtype:'textareafield', height:100},
            {id:"ex_org_name",name:"ex_org_name",fieldLabel:"单位名称",disabled:true,value:_uinfo.org_name},
            {id:"ex_submit_name",name:"ex_submit_name",fieldLabel:"报 销 人",disabled:true,value:_uinfo.u_realname}
        ]
    });

    var _win = Ext.create('Ext.Window', {
        title : '报销',
        width : 500,
        height : 370,
        resizable : false,
        modal : true,
        closeAction:'hide',
        bodyStyle : 'padding:5px;',
        items : _form,
        buttons : [
            {text:'Values', handler:function(){ showFormValues(_form); }},
            {text:'保存草稿', act:'draft', handler:do_save},
            {text:'提交审核', act:'audit', handler:do_save},
            {text:'关闭', handler:function(){ _win.hide(); }}
        ],
        listeners : {
           'show' : function(){
               var title=_win.getTitle();
               if(title=='编辑费用报销'){
                   _form.getForm().setValues(dv);
               }
           }
        }
    });

    _win.on('hide',function(){
        _form.getForm().reset();
    })

    var dv = {ex_id:0, ex_category:'', ex_money:'', ex_remark:'', ex_detail:''};
    function modify(b){
        var title = '新增费用报销';
        if (b.act == 'edit'){
            var row = SUNLINE.getSelected(_grid);
            if (!row) {
                Ext.Msg.alert('友情提醒', '请选择您要编辑的草稿数据！');
                return;
            };
            dv = row.data;
            dv['ex_money_ex'] = RMB(dv['ex_money']);
            title = '编辑费用报销';
        };
        _win.setTitle(title);
        _win.show(b.id);
    };


    //删除报销数据方法
    function do_del(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提醒', '请选择您要删除的报销数据！');
            return;
        };
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Expense/del',
            params : {ex_id:row.get('ex_id')},
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info.msg);
                if (r.status){
                    _store.remove(row);
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };

    //保存入口
    function do_save(b){
        var _f = _form.getForm();
        if (!_f.isValid()){
            Ext.Msg.alert('友情提醒', '请正确填写报销信息，注意红色边框处的内容。');
            return;
        };
        var data = _f.getValues();
        data['act'] = 'draft';
        if (b.act == 'audit') {
            act = '待审核';
            Ext.Msg.confirm('友情提醒', '请确认填写的报销信息，提交后无法修改！', function(btn){
                if (btn == 'yes') {
                    data['act'] = 'submit_audit';
                    real_save(b, data);
                }
            });
        }else{
            real_save(b, data);
        }
    };

    /**
     * 报销数据保存方法
     * @param b 按钮
     * @param data 提交的数据
     * @param win 窗口
     */
    function real_save(b, data, win){
        var act = '草稿';
        if (b.act == 'audit') act = '待审核';
        data['ex_status'] = data['ex_status'] ? data['ex_status'] : act;
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Expense/save',
            params : data,
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info.msg);
                if (r.status){
                    if (!win) win = _win;
                    win.hide();
                    _store.load();
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    };


    //审核表单-查看部分
    var _audit_form = Ext.create('Ext.form.Panel',{
        region :'center',
        border:false,
        defaultType : 'displayfield',
        bodyStyle : 'padding:5px;',
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {name:"ex_id",fieldLabel:"ID",xtype:"hidden"},
            {name:"ex_category",fieldLabel:"费用类别",allowBlank:false, xtype:"combo",
                editable:false, triggerAction:"all",store:_store_cate,displayField:'category',valueField:'category',
                forceSelection:true, emptyText:'请选择费用类别'
            },
            {name:"ex_money",fieldLabel:"报销金额",xtype:"numberfield",
                listeners:{ blur:function(t){ var v = t.getValue(); if (!v) return; _audit_form.getForm().setValues({ex_money_ex:RMB(v)}); } }},
            {name:'ex_money_ex',fieldLabel:"大写金额"},
            {name:"ex_remark",fieldLabel:"事由摘要"},
            {name:"ex_submit_time",fieldLabel:"报销日期"},
            {name:"ex_detail",fieldLabel:"报销明细",maxLength:"1000",xtype:'textareafield', height:100,readOnly:true},
            {name:"ex_org_name",fieldLabel:"单位名称"},
            {name:"ex_submit_name",fieldLabel:"报 销 人"}
        ]
    });

    //审核表单-状态填写部分
    var _audit_form_s = Ext.create('Ext.form.Panel',{
        region :'south',
        height : 136,
        border:false,
        bodyStyle : 'padding:5px; border-top:1px solid #ccc;',
        defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {
                xtype      : 'fieldcontainer',
                fieldLabel : '审核状态',
                defaultType: 'radiofield',
                //defaults: { flex: 1 },
                layout: 'vbox',
                items: [
                    { boxLabel: '审核通过', name: 'ex_status', inputValue: '已审核' },
                    { boxLabel : '退回重填 <span style="color:#888;">| 须填写退回原因</span>', name : 'ex_status', inputValue: '退回' }
                ]
            },
            {name:"ex_return",fieldLabel:"退回原因", xtype:'textareafield'}
        ]
    });

    //审核窗口定义
    var _audit_win = Ext.create('Ext.Window', {
        title : '报销审核',
        width : 500,
        height : 550,
        resizable : false,
        modal : true,
        layout : 'border',
        items : [_audit_form, _audit_form_s],
        buttons : [
            {text:'Values', handler:function(){ showFormValues(_audit_form_s); }},
            {text:'保存审核', act:'audit', handler:do_audit_save},
            {text:'关闭', handler:function(){ _audit_win.hide(); }}
        ]
    });

    //审核窗口显示
    function _audit(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提醒', '请选择您要审核的报销数据！');
            return;
        };
        var dv = row.data;
        dv['ex_money_ex'] = RMB(dv['ex_money']);
        _audit_form.getForm().setValues(row.data);
        _audit_form_s.getForm().reset();
        _audit_win.show(b.id);
    };

    //审核保存
    function do_audit_save(b){
        var f1 = _audit_form.getForm().getValues();
        var f2 = _audit_form_s.getForm().getValues();
        var data = {
            ex_id : f1.ex_id,
            ex_money:f1.ex_money,
            ex_status : f2['ex_status'],
            act : 'audit'
        };
        if (!f2['ex_status']) return ExtAlert('请选择审核状态！');

        if ( f2['ex_status'] == '退回' ){
            if ( filterHtml(f2['ex_return']) == '' ){
                Ext.Msg.alert('友情提醒', '请正确填写退回原因！');
                return ;
            };
            data['ex_return'] = f2['ex_return'];
        };
        real_save(b, data, _audit_win);
    };

    //标记为已付款方法
    function _mark(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提醒', '请选择您要标记为已付款的报销数据！');
            return;
        };
        if (row.get('ex_status') == '已付款'){
            Ext.Msg.alert('友情提醒', '您选择的报销数据已经为已付款状态，无需再次标记！');
            return;
        }
        var data = {ex_id:row.get('ex_id'), ex_status:'已付款', act:'_mark'};
        real_save(b, data);
    };

    //标记撤销方法
    function _mark_return(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row){
            Ext.Msg.alert('友情提醒', '请选择您要标记为已付款的报销数据！');
            return;
        };
        var data = {ex_id:row.get('ex_id'), ex_status:'已审核', act:'_mark'};
        real_save(b, data);
    }

    var _win_category;
    //费用类别管理的窗口
    function category(b){
        if (!_win_category){
            _win_category = new Ext.Window({
                title : '费用类别管理',
                width : 300,
                maxWidth: 500,
                minWidth: 300,
                height : 400,
                minHeight : 400,
                maxHeight : 480,
                modal: true,
                closeAction : 'hide',
                layout : 'border',
                items : [
                    {region:'north', html:'填写说明：一行一个类别名称', autoHeight:true, bodyStyle:'padding:5px;'},
                    {region:'center', html : '<textarea style="width: 100%; height: 100%; " id="text_category"></textarea>', bodyStyle:'padding: 5px;' }
                ],
                buttons : [
                    {text : '保存', handler:category_save},
                    {text : '关闭', handler:function(){ _win_category.hide(); }}
                ],
                listeners : {
                    'show' : function(){
                        var cate = '';
                        _store_cate.each(function(r){
                            cate += r.get('category') + '\n';
                        });
                        document.getElementById('text_category').value = cate;
                    }
                }
            });
        };
        _win_category.show(b.id);
    };

    /**
     * 费用类别保存方法
     */
    function category_save(){
        var tc = document.getElementById('text_category');
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Expense/category_save',
            params : {cate:tc.value},
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',r.info);
                if (r.status){
                    _win_category.hide();
                    _store_cate.load();
                };
                myMask.hide();
            },
            failure: function(response, opts) {
                Ext.Msg.alert('友情提示', '请求服务器失败，状态码：' + response.status);
                myMask.hide();
            }
        });
    }



    new Ext.Viewport({
        layout : 'border',
        items : [
            _grid,
            {
                region:'south',
                autoHeight : true,
                //草稿：元；待审核：元；已审核（未付款）：元；已付款：元
                html:'<div id="total_info" style="padding: 3px 10px;">统计中...</div>',
                bbar: new Ext.PagingToolbar({
                    pageSize: pageSize,
                    store: _store,
                    displayInfo: true,
                    displayMsg: '',
                    emptyMsg: '没有数据'
                })
            }
        ]
    });

    ziyo_log({ listeners : [{grid: _grid, table:'Expense', pk_id:'ex_id'}] });


});