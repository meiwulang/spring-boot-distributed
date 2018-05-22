/**
 * Created by sunline on 16-6-1.
 */

Ext.onReady(function(){

    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();

    var _url = $__app__ + '/Account/receive_data';
    var _fld = ['ac_id','ac_time','ac_remark','ac_money','ac_category','ac_company','ac_status','ac_from_org',
        'ac_from_info','ac_sorg_id','ac_sorg_type','ac_sorg_name','ac_uid','ac_uname','ac_confirm_id','ac_confirm_name',
        'ac_confirm_time','ac_confirm_info','ac_type','ac_name'];
    var _store = SUNLINE.JsonStore(_url, _fld);
    //_store.setSorters({field:'ac_status', direction:'DESC'});

    var sorg_url = $__app__ + '/Company/dataJson';
    var sorg_fld = ['org_id', 'org_name','org_bh','org_sname', 'org_type'];
    var sorg_store = SUNLINE.JsonStore(sorg_url, sorg_fld);

    function _money(v, m, r){
        m.tdAttr = 'title="'+ RMB(v) +'"';
        return money(v);
    };

    function ac_status(v, m, r){
        var uid = r.get('ac_confirm_id');
        if (v=='正常' && uid != '-1') v = '已审核';
        var cls = {'待认领':'s_r', '待审核':'s_a', '已审核':'s_o'};
        m.tdCls = 'status';
        return '<span class="status_box '+ cls[v] +'">' + v + '</span>';
    };

    function ac_print(v){
        var css = v==1 ? 'opacity:1; filter:alpha(opacity=100);':'opacity:0.3; filter:alpha(opacity=30);';
        var tip = v==1 ? '已打印' : '未打印';
        return "<img src='"+ $app_public_images_path+"print-n.gif' style='"+ css +"' data-qtip='"+ tip +"'>";
    };

    function ac_sale(v){
        var cls = v=='yes' ? '#FF8000':'#666';
        return '<span style="color: '+ cls +'">'+ v +'</span>'
    }

    function interval_time(v){
        if(v){
            return Math.ceil(v)+'天';
        }
    }

    function from_info(v,m,r){
        var org = r.get('ac_from_org');
        try{
            m.tdAttr = 'data-qtip="汇款信息：'+ v +'<br>汇款单位：'+ org +'"' ;
        }catch(e){ };
        return v + '-' + org;
    }

    function sorg_info(v,m,r){
        v = v ? v : '-';
        return v;
    }

    var print_img = "<img src='"+ $app_public_images_path+"/print-n.gif'>";
    var _cm = {
        items: [
            //new Ext.grid.RowNumberer(),
            {header:"ID",dataIndex:"ac_id",width:80, align:'right'},
            {header:"状态",dataIndex:"ac_status",width:60, renderer:ac_status},
            {header:print_img,dataIndex:"ac_print",width:40, renderer:ac_print},
            {header:"日期",dataIndex:"ac_time",width:100, renderer:number2date},
            {header:"金额",dataIndex:"ac_money",width:120, renderer:_money},
            {header:"摘要",dataIndex:"ac_remark",width:180},
            {header:"汇款信息",dataIndex:"ac_from_info",width:180, renderer:from_info},
            {header:"认领单位",dataIndex:"ac_sorg_name",width:180, renderer:sorg_info}, //ac_sorg_name
            {header:"账户",dataIndex:"ac_name",width:150},
            {header:"操作人ID",dataIndex:"ac_uid",width:80, hidden:true},
            {header:"操作财务",dataIndex:"ac_uname",width:120},
            {header:"认领人",dataIndex:"ac_confirm_name",width:120},
            {header:"认领时间",dataIndex:"ac_confirm_time",width:150, renderer:timestamp2date},
            {header:"间隔时间",dataIndex:"ac_interval_time",width:150, renderer:interval_time},
            {header:"分销账户",dataIndex:"ac_sale",width:80, renderer:ac_sale}
        ],
        defaults: { /*sortable: false, menuDisabled : true*/ }
    };

    var _grouping = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 笔资金)"
    });

    window._grid = new Ext.grid.GridPanel({
        region: 'center',
        store: _store,
        columns : _cm,
        border: false,
        loadMask: {msg: '数据载入中，请稍后'},
        viewConfig: {
            emptyText: '暂时没有需要认领的数据',
            deferEmptyText: true
        },
        tbar : [
            {text:'认领', id:'btn_receive', handler:receive},
            {text:'审核', id:'btn_audit', handler:receive, hidden:isDisabled('Account::receive_audit'), disabled:isDisabled('Account::receive_audit')},
            {text:'查看打印', handler:do_print, disabled:isDisabled('Account::receive_print'), xtype:'splitbutton', menu:{
                items : [
                    {text:'标记为已打印', handler:confirm_print, mark_text:'已打印', mark_val:'1', disabled:isDisabled('Account::receive_print')},
                    {text:'标记为未打印', handler:confirm_print, mark_text:'未打印', mark_val:'0', disabled:isDisabled('Account::receive_print')}
                ]
            }},
            /*{text:'标记为已打印', handler:confirm_print, mark_text:'已打印', mark_val:'1', disabled:isDisabled('Account::receive_print'), xtype:'splitbutton',
                menu: {items : [
                    {text:'标记为未打印', handler:confirm_print, mark_text:'未打印', mark_val:'0'}
                ]}
            },*/
            {text:'刷新', handler:function(){ _store.reload(); }},
            {text:'修改', menu:{
                items : [
                    {text:'摘要', handler:changRemark, disabled:isDisabled('Account::change_remark')}
                ]
            }},
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            {id:'ac_status',xtype:'combo',fieldLabel:'状态',labelSeparator:'', labelWidth:27, width:150,editable:false,
                store:new Ext.data.SimpleStore({fields:['ac_status'],data:[['全部'],['待认领'],['待审核'],['已审核']]}),
               /* listeners:{select:function(t,r){
                    var st = r[0]['data']['ac_status'];
                    SUNLINE.baseParams(_store, {ac_status:st});
                    _store.load();
                }},*/
                displayField:"ac_status",valueField:"ac_status",mode:"local",forceSelection:true,typeAhead:true,value:"全部"},
            SUNLINE.ExtDateField({id:'seach_start_date',name:'seach_start_date',labelWidth:0,labelAlign:"right",fieldLabel:" ",labelSeparator:'',width:105,gang:'seach_stop_date',start:true}),
            '~',
            SUNLINE.ExtDateField({id:'seach_stop_date',name:'seach_stop_date',labelWidth:0,labelAlign:"right",fieldLabel:" ",labelSeparator:'',width:105,gang:'seach_start_date'}),
            '-',
            '快速搜索:',
            {
                xtype:'textfield',
                //triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'dosearch',
                emptyText:'汇款信息,汇款单位,认领人,金额',
                width:217
            },
            {text:'查询',iconCls:'searchico',act:'select',handler:seach}
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: _store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有数据'
        }),
        listeners : {
            'select' : function(g, r){
                var btn_receive = Ext.getCmp('btn_receive'),
                    btn_audit = Ext.getCmp('btn_audit'),
                    status = r.get('ac_status');
                btn_receive.setDisabled(status!='待认领'); //认领按钮不可用
                btn_audit.setDisabled(isDisabled('Claim::audit') && status!='待审核');
            }
        }
    });


    //按条件搜索函数
    function seach(){
        var st=Ext.getCmp('ac_status').getValue();
        var start_date=Ext.getCmp('seach_start_date').getValue();
        var stop_date=Ext.getCmp('seach_stop_date').getValue();
        var doseach=Ext.getCmp('dosearch').getValue();
        SUNLINE.baseParams(_store, {ac_status:st,start_date:start_date,stop_date:stop_date,doseach:doseach});
        _store.currentPage = 1;
        _store.load();
    }

    // 资金认领表单
    var _form = Ext.create('Ext.form.Panel', {
        border:false,
        defaultType : 'textfield',
        bodyStyle : 'padding:5px; padding_bottom:0;',
        defaults : { anchor: '100%', labelSeparator:'：', labelAlign:'right'},
        items : [
            {id:"ac_id",name:"ac_id",fieldLabel:"ID",maxLength:"11",allowBlank:false,xtype:"hidden"},
            {xtype:'fieldset', title:'汇款信息', defaultType:'displayfield',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {id:"ac_from_info",name:"ac_from_info",fieldLabel:"银行卡号"},
                    {id:"ac_from_org",name:"ac_from_org",fieldLabel:"汇款单位"},
                    {id:"ac_money",name:"ac_money",fieldLabel:"金额",allowBlank:false},
                    {id:"ac_money_ex",name:"ac_money_ex",fieldLabel:"大写"},
                    {id:"ac_time",name:"ac_time",fieldLabel:"汇款日期"},
                    {id:"ac_remark_ex",name:"ac_remark_ex",fieldLabel:"摘要"}
                ]
            },
            {xtype:'fieldset', title:'认领信息', defaultType:'textfield',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {id:"ac_sorg_id",name:"ac_sorg_id",fieldLabel:"同行单位ID",xtype:"hidden"},
                    {id:"ac_sorg_type",name:"ac_sorg_type",fieldLabel:"单位类型",xtype:"hidden"},
                    {id:"ac_sorg_name",name:"ac_sorg_name",fieldLabel:"认领单位",xtype:'combo',
                        store: sorg_store,
                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">' +
                                '<div style="float:left; width: 80px; overflow: hidden; color: blue;white-space: nowrap;text-overflow: ellipsis;" ' +
                                'title="{org_bh}">{org_bh}</div>' +
                                '<div style="margin-left: 82px; height: 22px; line-height: 22px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" ' +
                                'title="{org_name}">{org_name}</div>' +
                            '</li>',
                            '</tpl></ul>'
                        ),
                        listeners : { 'select' : function(t, r){
                            var dv = {ac_sorg_id: r[0]['data']['org_id'], ac_sorg_type: r[0]['data']['org_type']};
                            dv['ac_sale'] = dv.ac_sorg_type == '分销商'? 'yes': dv.ac_sorg_type;
                            console.log(dv);
                            _form.getForm().setValues(dv);
                        } },
                        displayField:"org_name",
                        valueField:"org_name",mode:"remote",
                        pageSize : 20,
                        queryDelay:300,
                        queryParam : 'skey',
                        minChars:2,
                        allQuery:'',
                        triggerAction:"all",
                        forceSelection:false,typeAhead:true
                    },
                    {xtype : 'textareafield', name : 'ac_confirm_info', fieldLabel: '认领说明',height: 70},
                    {xtype : 'displayfield', fieldLabel: '&nbsp;', labelSeparator : '', value:'<span style="color: #666;">认领说明请认真填写相关订单及对应金额。</span>' },
                    {xtype : 'numberfield', name: 'ac_difference', fieldLabel:'差额',value:0},
                    {name: 'ac_difference_info', fieldLabel:'差额说明',emptyText:'填写差额事由（优惠、抹零、赔偿、抵冲人头返利等）',maxLength:50}
                ]
            },{xtype:'fieldset', title:'审核信息', defaultType:'textfield', hidden:true, id:'_audit_field_set',
                defaults : { anchor: '95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {name : 'ac_remark', fieldLabel:'摘要', allowBlank:false},
                    {xtype: 'checkbox', fieldLabel:'分销账户', boxLabel:'这是团款，需要入到汇款单位的账户。', name:'ac_sale', inputValue:'yes'}
                ]
            }

        ]
    });


    var _win = Ext.create('Ext.Window', {
        title : '资金认领',
        width : 500,
        autoHeight : true,
        resizable : false,
        modal : true,
        items : _form,
        closeAction : 'hide',
        buttons : [
            //{text:'Values', handler:function(){ showFormValues(_form); }},
            {text:'提交审核', id:'save', handler:do_receive},
            {text:'通过', id:'audit_ok', handler:receive_audit, hidden:true},
            //{text:'退回', id:'audit_no', handler:receive_audit, hidden:true},
            {text:'关闭', handler:function(){ _win.hide(); }}
        ]
    });


    //认领保存方法
    function do_receive(b){
        var _f = _form.getForm();
        if (!_f.isValid()) return ExtAlert('请正确填写认领表单，注意红框部分必填。');
        var fv = _f.getValues();
        if (filterHtml(fv.ac_confirm_info)=='') return ExtAlert('请正确填写认领说明。');
        if (fv.ac_difference!=0){
            if (!fv.ac_difference_info) return ExtAlert('请填写差额说明。');
        };
        if (fv.ac_sorg_id=='' || fv.ac_sorg_id==0){
            Ext.Msg.confirm('友情提醒', '您确定这笔款项不需要选择汇款单位吗？', function(y){
                if (y == 'yes') do_receive_ajax(fv);
            });
        }else{
            do_receive_ajax(fv);
        }
    };

    function do_receive_ajax(fv){
        Ext.Ajax.request({
            url : $__app__ + '/Account/receive_save',
            params : fv,
            method : 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                ExtAlert(r.info.msg);
                if (r.status){
                    var row = SUNLINE.getSelected(_grid);
                    row.set('ac_status', '待审核');
                    row.commit();
                    _win.hide();
                    _f.reset();
                }
            },
            failure: function(response, opts) {
                ExtAlert('请求服务器失败，状态码：' + response.status);
            }
        });
    };


    //认领审核方法
    function receive_audit(b){
        Ext.Msg.confirm('友情提醒', '您确定'+ b.text + '审核吗？该操作不可逆，请谨慎操作。', function(btn){
            if (btn != 'yes') return false;
            var _f = _form.getForm();
            if (!_f.isValid()) return ExtAlert('请正确填写认领表单，注意红框部分必填。');
            var fv = _f.getValues();
            fv.act = b.id;
            if (b.id == 'audit_no'){
                return_win(fv);
            }else{
                if (fv.ac_sale=='yes')
                    if (fv.ac_sorg_id=='0' || fv.ac_sorg_id=='') return ExtAlert('您选择了入汇款单位账户，但没有选择汇款单位。');
                real_return(fv);
            };
            console.log(fv);
        });
    };

    function real_return(data){
        Ext.Ajax.request({
            url : $__app__ + '/Account/receive_audit',
            params : data,
            method: 'POST',
            success: function(response){
                var r = Ext.decode(response.responseText);
                ExtAlert(r.info);
                if (r.status){
                    var row = SUNLINE.getSelected(_grid);
                    row.set('ac_status', '正常');
                    row.commit();
                    _win.hide();
                }
            },
            failure: function(response, opts) {
                ExtAlert('请求服务器失败，状态码：' + response.status);
            }
        });
    };

    var _return_win;
    function return_win(data){
        if (!_return_win)
            _return_win = Ext.create('Ext.Window', {
                title : '退回确认',
                width : 400,
                height : 240,
                layout : 'border',
                closeAction : 'hide',
                resizable : false,
                modal : true,
                items : [
                    {region:'north', bodyStyle: 'padding:5px;', autoHeight:true,html:'您确定要退回本次认领吗？如果是请在下面填写退回说明。'},
                    {region:'center', bodyStyle: 'padding:5px; padding-top:0;', html:'<textarea style="width: 100%; height: 100%" id="return_info"></textarea>'}
                ],
                buttons : [
                    {text:'确认退回', handler:function(){
                        var ri = document.getElementById('return_info').value;
                        if (ri=='') return ExtAlert('请填写退回说明！');
                        data.ac_return = ri;
                        real_return(data);
                    }},
                    {text:'关闭', handler:function(){ _return_win.hide();}}
                ]
            });
        _return_win.show();
    };


    //打开认领/审核的窗口
    function receive(b){
        var row = SUNLINE.getSelected(_grid);
        var t = b.id=='btn_receive' ? '认领' : '审核';
        if (!row) return ExtAlert('请选择您要'+ t +'的财务数据。');
        var fv = {}, d = row.data;
        for (var i in d){ fv[i] = d[i]; };
        fv.ac_money_ex = RMB(fv.ac_money);
        fv.ac_time = int2date(fv.ac_time);
        fv.ac_remark_ex = fv.ac_remark;
        fv.ac_sale = row.get('ac_sorg_type')=='分销商' ? 'yes': '';
        //console.log(fv);
        _form.getForm().setValues(fv);
        /*if (fv.ac_sorg_id!='' && fv.ac_sorg_id!='0'){
            //如果汇款单位信息已填写，则锁定不可以编辑修改
            Ext.getCmp('ac_sorg_name').setReadOnly(true);
        }else{
            Ext.getCmp('ac_sorg_name').setReadOnly(false);
        };*/
        var save_btn = Ext.getCmp('save'),
            audit_ok = Ext.getCmp('audit_ok'),
            _audit_field_set = Ext.getCmp('_audit_field_set'),
            is_receive = b.id == 'btn_receive';

        save_btn.setHidden(!is_receive); //设置认领按钮是否可见
        audit_ok.setHidden(is_receive);  //设置审核按钮是否可见
        _audit_field_set.setDisabled(is_receive); //设置审核信息是否可用
        _audit_field_set.setHidden(is_receive);   //设置审核信息是否可见

        var title = b.id=='btn_receive' ? '资金认领' : '资金认领审核';
        _win.setTitle(title);
        _win.show(b.id);
    };

    var _print_win = new Ext.Window({
        title : '打印认领单',
        width : 810,
        height : 470,
        modal : true,
        closeAction : '',
        html : '<iframe id="_print_ifm" name="_print_ifm" src="" frameborder="0" style="width: 100%; height: 100%;"></iframe>',
        buttons : [
            {text:'打印', handler:function(){ window._print_ifm.focus(); window._print_ifm.do_print(); } },
            {text:'关闭', handler:function(){ _print_win.hide(); } }
        ]
    });


    function do_print(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您需要打印的认领数据。');
        _print_win.show(b.id);
    };


    _print_win.on('show', function(){
        var row = SUNLINE.getSelected(_grid);
        window._print_ifm.location = $__app__ + '/Account/receive_print?_dc=' + time() + '&ac_id=' + row.data.ac_id;
    });


    var cr_win, cr_form;
    function changRemark(b) {
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您要修改摘要信息的数据。');

        var data = Ext.apply({}, row.data);
        data._remark = data['ac_remark'];

        if (!cr_form)
            cr_form = Ext.create('Ext.form.Panel', {
                defaultType : 'displayfield',
                defaults : {anchor:'95%', labelSeparator:'：', labelAlign:'right'},
                items : [
                    {xtype: 'hidden', name:'ac_id'},
                    {name:'ac_time', fieldLabel:'日期'},
                    {name:'ac_money', fieldLabel:'金额'},
                    {name:'ac_sorg_name', fieldLabel:'领款单位'},
                    {name:'ac_from_info', fieldLabel:'汇款信息'},
                    {name:'_remark', fieldLabel:'原摘要'},
                    {xtype: 'textarea', fieldLabel:'新摘要', name : 'ac_remark', height:130}
                ]
            });
        cr_form.getForm().setValues(data);

        if (!cr_win)
            cr_win = Ext.create('Ext.Window', {
                title : '修改摘要',
                width : 500,
                height : 400,
                closeAction : 'hide',
                bodyStyle: 'padding:10px;',
                modal : true,
                layout : 'fit',
                items : [ cr_form ],
                buttons : [
                    //{text : 'values', handler:function () {showFormValues(cr_form);}},
                    {text: '确认修改', handler:save_remark},
                    {text: '关闭', handler:function () {cr_win.hide();}}
                ]
            });

        cr_win.show(b.id);
    }


    /**
     * 修改摘要的保存方法
     * @param b
     */
    function save_remark(b) {
        Ext.Msg.confirm('友情提示', '您真的要修改摘要吗？', function (btn) {
            if (btn != 'yes') return false;
            var fv = cr_form.getForm().getValues();
            Ext.Ajax.request({
                url : $__app__ + '/Account/change_remark',
                params : fv,
                method : 'POST',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    ExtAlert(r.info);
                    if (r.status){
                        var row = SUNLINE.getSelected(_grid);
                        row.set('ac_remark', fv.ac_remark);
                        row.commit();
                        cr_win.hide();
                    }
                },
                failure: function(response, opts) {
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }


    new Ext.Viewport({
        layout : 'border',
        items : [_grid]
    });

    //注入日志处理流程
    ziyo_log({ listeners : [{grid: _grid, action:'Account', table:'Account', pk_id:'ac_id'}] });

});

function confirm_print(r){
    var row = SUNLINE.getSelected(_grid);
    var ac_id = row.get('ac_id');
    var params = {ac_id: ac_id};
    if ( r===true ){
        //打印完成时被调用，在receive_print.html里调用
        var msg =  '认领单已经发送打印，是否将其标志为<span style="color: #ff8d38;">已打印</span>';
        params['ac_print'] = '1';
    }else{
        var msg = '您确定要将选中的数据标记为“'+ r.mark_text +'”吗？';
        params['ac_print'] = r.mark_val;
    };
    Ext.Msg.confirm('友情提醒', msg, function(y){
        if (y!=='yes') return false;
        clog( params );
        Ext.Ajax.request({
            url : $__app__ + '/Account/set_print',
            method: 'POST',
            params : params,
            success: function(response){
                var r = Ext.decode(response.responseText);
                ExtAlert(r.info);
                if (r.status){
                    var row = SUNLINE.getSelected(_grid);
                    row.set('ac_print', params.ac_print);
                    row.commit();
                }
            },
            failure: function(response, opts) {
                ExtAlert('请求服务器失败，状态码：' + response.status);
            }
        });
    });
}