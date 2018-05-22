var WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    var thisTitle = "票价管理";

    //产品
    var p_series_combo=SUNLINE.DictComBox({name:'p_series',id:'p_series_id',width:200,labelWidth:80,labelAlign:"right"},{'d_type':'品牌系列'});
    var Products_OrgCombo=SUNLINE.OrgCombo_Products_false({name:'p_name',id:'p_name_id',width:400,allowBlank:true,editable:true,forceSelection:true});

    //返利
    function t_moneyprice(v,m,r){
        if(v) return '￥'+v;
    }
    //代理价/门市价/补房差
    function price_fen(v,m,r){
        if(r.get('t_company_type')){
            return '';
        }else{
            return '￥'+v;
        }
    }
    function price_daili(v,m,r){
        if(r.get('t_company_type')){
            return '';
        }else{
            if(r.get('t_fang_type')){
                return '￥'+r.get('t_agency_price');
            }else{
                return '￥'+v;
            }
        }
    }

    //周几有效
    function week_test(value,m,r){
        if(r.get('t_company_type')){
            return '';
        }else{
            var str = "一,二,三,四,五,六,日";
            if (value) {
                value = value.replace('1', '一');
                value = value.replace('2', '二');
                value = value.replace('3', '三');
                value = value.replace('4', '四');
                value = value.replace('5', '五');
                value = value.replace('6', '六');
                value = value.replace('0', '日');
                value = value.replace('7', '日'); //兼容老数据
                var tmp = value.split(',');
                for (var i=0; i<tmp.length; i++){
                    str = str.replace(tmp[i], "<span>"+ tmp[i] +"</span>");
                };
            };
            return '<span class="weekly">'+str+'</span>';
        }
    }
    //大交通状态
    function traff_status(v, m, r){
        if(r.get('t_fang_fen')){
            v=Ext.decode(v);
            var f=' ',j=' ';
            if(v['qucheng']) f="<span style='color:#008000'>"+v['qucheng']+"</span>";
            if(v['fancheng'])j='-'+"<span style='color:#00c300'>"+v['fancheng']+"</span>";
            return f+j;

        }
    }
    //有效期/分公司/票种名称
    function date_city_name(v, m, r){
        if(_uinfo['org_id']==1){
            if(r.get('t_fang_type')){   //t_fang_type   添加一个判断  是否是总公司的
                return r.get('t_start_time')+'至'+r.get('t_end_time');
            }else if(r.get('t_company_type')){
                return r.get('t_company_name');
            }else{
                return v+ ' <span style="color:#0000ff"> ( '+r.get('t_site_name_rule')+' ) </span>';
            }
        }else{
            if(r.get('t_company_type')){
                return r.get('t_start_time')+'至'+r.get('t_end_time');
            }else{
                return v+ ' <span style="color:#0000ff"> ( '+r.get('t_site_name_rule')+' ) </span>';
            }
        }

    }

    var ticket_cm=[
        { xtype: 'treecolumn', text: '有效期/分公司/票种名称',dataIndex: 't_standards_name',width:350,renderer:date_city_name},
        {header:"ID",dataIndex:"t_id",width:130,align:'right',hidden:true},
        {header:"成本价/同行价",dataIndex:"t_trade_price",width:130,align:'right',renderer:price_fen},
        {header:"返利",dataIndex:"t_money",width:80,align:'right',renderer:t_moneyprice},
        {header:"代理价/门市价",dataIndex:"t_price",width:130,align:'right',renderer:price_daili  },
        {header:"补房差",dataIndex:"t_spread_price",width:100,align:'right',renderer:price_fen},
        {header:"补房差",dataIndex:"t_out_room_price",width:100,align:'right',renderer:price_fen},
        {header:"周几有效",dataIndex:"t_weekly",width:150,renderer:week_test},
        {header:'适用公司',dataIndex:"t_site_name_rule",width:400,hidden:true},
        {header:'交通分组',dataIndex:"t_groups",width:80},
        {header:'大交通状态',dataIndex:"t_traff_status",width:240,renderer:traff_status}
    ];

    var ticket_store=Ext.create('Ext.data.TreeStore', {
        fields: [''],
        proxy: { type: 'ajax', url: $__app__+'/Ticket/zong_data',actionMethods:{
            create:'POST',
            read:'POST',
            update:'POST',
            destroy:'POST'
        } },
        root:{ expanded: true, children:'children'}
    });
    var right_tbar=[];
    if(_uinfo['org_id']==1){
        right_tbar=right_tbar.concat([
            {text:'地接报价',iconCls:'button-add',handler:right_modify, disabled:isDisabled('Ticket::select_detail')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:right_modify, disabled:isDisabled('Ticket::select_detail')},
            '-',
            {text:'删除', iconCls:'button-del',handler:right_del, disabled:isDisabled('Ticket::del')},
            '-',
            {text:'添加分公司报价',text_type:'add',iconCls:'button-add',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'编辑分公司报价',text_type:'edit', iconCls:'button-edit',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'复制分公司报价',text_type:'fuzhi', iconCls:'button-edit',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'删除分公司报价', iconCls:'button-del',handler:ticket_del_zong, disabled:isDisabled('Ticket::fen_del')},
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                ticket_store.reload();
            }},
            '-',
            {text:'历史报价', iconCls:'button-edit',id:'right_history_status',handler:right_history, disabled:isDisabled('Ticket::select')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'ticket_search_zhu',
                cls:'search-icon-cls',
                emptyText:'票价名称',
                width:150,
                onTriggerClick:function (e) {
                    ticket_dosearch_zhu();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13){}
                        ticket_dosearch_zhu();
                    }
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            }
        ]);
    }else{
        right_tbar=right_tbar.concat([
            {text:'添加',text_type:'add',iconCls:'button-add',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'编辑',text_type:'edit', iconCls:'button-edit',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'复制报价',text_type:'fuzhi', iconCls:'button-edit',handler:add_ticket_zong, disabled:isDisabled('Ticket::start_find')},
            '-',
            {text:'删除', iconCls:'button-del',handler:ticket_del_zong, disabled:isDisabled('Ticket::fen_del')},
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                ticket_store.reload();
            }},
            '-',
            {text:'升级方案',handler:ticket_program,disabled:isDisabled('UpgradeProgram::save')},
            '-',
            {text:'历史报价', iconCls:'button-edit',id:'right_history_status',handler:right_history, disabled:isDisabled('Ticket::select')},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'ticket_search_zhu',
                cls:'search-icon-cls',
                emptyText:'票价名称',
                width:150,
                onTriggerClick:function (e) {
                    ticket_dosearch_zhu();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13){}
                        ticket_dosearch_zhu();
                    }
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            }
        ])
    }
    //升级方案
    var program_url = $__app__ + '/UpgradeProgram/dataJson';
    var program_field = [ {name:"up_id"}];
    var program_store = new SUNLINE.JsonStore(program_url, program_field,false);
    var program_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:program_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有升级方案',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"up_id", width:150,hidden:true},
            {header:"up_ticket_id", dataIndex:"up_ticket_id", width:150,hidden:true},
            {header:"方案名称", dataIndex:"up_name", width:100},
            {header:"方案类型", dataIndex:"up_type", width:100},
            {header:"挂牌价", dataIndex:"up_price_sales", width:100},
            {header:"结算价", dataIndex:"up_price_settle", width:100},
            {header:"开始时间", dataIndex:"up_start_time", width:120,renderer:time_new},
            {header:"结束时间", dataIndex:"up_end_time", width:120,renderer:time_new},
            {header:"周几有效", dataIndex:"up_weekly", width:150,renderer:SUNLINE.weekRenderer}
        ],
        tbar : [
            {text:'添加', iconCls:'button-add',handler:program_add},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:program_add},
            '-',
            {text:'删除', iconCls:'button-del',handler:program_del},
            '->',
            '<b>快速搜索</b>:',
            {
                xtype:'trigger',
                id:'program_dosearch',
                cls:'search-icon-cls',
                emptyText:'升级方案名称',
                triggerCls:'x-form-search-trigger',
                width:150,
                onTriggerClick:function (e) {
                    program_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            program_dosearch();
                        }
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:program_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有升级方案的信息'
        })
    });
    var program_add_weekly= SUNLINE.weekCheckboxGroup({
        width:400,
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'up_weekly',
        config:{labelWidth:80,labelAlign:"right",style:'margin-top:5px;',msgTarget:'side',allowBlank:false}
    });
    var up_type_combo=SUNLINE.DictComBox_false({name:'up_type',fieldLabel:"<span style='color:red'> * </span>方案类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'升级方案类型'});
    var program_add_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:"up_id", name:"up_id", fieldLabel:"up_id", maxLength:"100",hidden:true},
                    {id:"up_ticket_id", name:"up_ticket_id", fieldLabel:"up_ticket_id", maxLength:"100",hidden:true},
                    {id:"up_name", name:"up_name", fieldLabel:"方案名称", maxLength:"100"},
                    up_type_combo.box,
                    {id:"up_price_sales", name:"up_price_sales", fieldLabel:"挂牌价", maxLength:"20"},
                    {id:"up_price_settle", name:"up_price_settle", fieldLabel:"<span style='color:red'> * </span>结算价", maxLength:"20", allowBlank:false,vtype:'NotBlank'}
                ]
            },
            program_add_weekly,
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    SUNLINE.ExtDateField({id:'up_start_time',name:'up_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:390,gang:'up_end_time',start:true}),
                    SUNLINE.ExtDateField({id:'up_end_time',name:'up_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:390,gang:'up_start_time'})
                ]
            },
            {id:"up_introduction", name:"up_introduction",labelAlign:"right", fieldLabel:"方案简介", xtype:'textarea',labelWidth:80,style:'margin-top:5px;', height:60,width:780}
        ]
    })
    var program_add_win=new Ext.Window({
        width:840,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:program_add_form,
        buttons:[
            {text:'保存',handler:program_add_dosave},
            {text:'关闭', handler:function () {
                program_add_win.hide();
            }}
        ]
    });
    function program_add_dosave(){
        if (!program_add_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();

        var row=SUNLINE.getSelected(right_grid);
        var data= program_add_form.getForm().getValues();
        data['up_ticket_id']=row.data.t_id;
        Ext.Ajax.request({
            url:$__app__ + '/UpgradeProgram/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    program_store.reload();
                    program_add_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    program_add_win.on('hide',function(){
        program_add_form.form.reset();
    })
    function program_add(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(program_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            program_add_win.show();
            program_add_form.getForm().setValues(row.data);

        }else{
            program_add_win.show();
        }
        if(v.text=='编辑'){
            if(row.data.up_start_time.indexOf("-")<=0){
                row.data.up_start_time=time_new(row.data.up_start_time);
            }
            if(row.data.up_end_time.indexOf("-")<=0){
                row.data.up_end_time=time_new(row.data.up_end_time);
            }
            program_add_form.form.setValues(row.data);
            var up_weekly_id=row.get('up_weekly');
            SUNLINE.weekSetValues(program_add_weekly,up_weekly_id );
        }
        program_add_win.setTitle(v.text+"升级方案信息", v.iconCls);
    }
    function program_del(){
        var row=SUNLINE.getSelected(program_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要删除的升级方案信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该升级方案信息吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/UpgradeProgram/del',
                    params:{up_id:row.data.up_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',result.info);
                        if(result.status==1){
                            program_store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        })
    }
    function program_dosearch(){
        var row=SUNLINE.getSelected(right_grid);
        var key=Ext.getCmp('program_dosearch').getValue();
        SUNLINE.baseParams(program_store,{skey:key,up_ticket_id:row.data.t_id});
        program_store.currentPage=1;
        program_store.load();
    }
    var program_win=new Ext.Window({
        title:'查看升级方案',
        width:840,
        height:400,
        layout:'fit',
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[program_grid],
        buttons:[
            {text:'关闭', handler:function () { program_win.hide();}}
        ]
    })
    function ticket_program(){
        var row=SUNLINE.getSelected(right_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择要升级方案的票价');
            return;
        }
        if(!row.data.t_fang_fen){
            Ext.Msg.alert('提示信息','该按钮只能编辑票价信息');
            return false;
        }
        var row=SUNLINE.getSelected(right_grid);
        SUNLINE.baseParams(program_store,{up_ticket_id:row.data.t_id});
        program_store.currentPage=1;
        program_store.load();
        program_win.show();
    }
    var up_type_num=1;
    program_win.on('show',function(){
        if(up_type_num==1) up_type_combo.box.getStore().load();
        up_type_num++;
    })
    var right_grid = Ext.create({
        region:'center',
        border:false,
        xtype: 'treepanel',
        rootVisible: false,
        store:ticket_store,
        columns:ticket_cm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无票价信息。',
            deferEmptyText : true
        },
        style : 'border-top:3px solid #3993D3;',
        tbar:right_tbar
    });
    //历史报价
    function right_history(){
        var row=SUNLINE.getSelected(ticket_ta_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的票价名称');
            return false;
        }
        var out_time=''
        var price=Ext.getCmp('right_history_status').getText();
        var key=Ext.getCmp('ticket_search_zhu').getValue();
        if(price!='历史报价'){
            Ext.getCmp('right_history_status').setText("历史报价");
        }else{
            out_time='out_time';
            Ext.getCmp('right_history_status').setText("收起报价");
        }
        SUNLINE.baseParams(ticket_store,{t_standards_name:key,t_product_id:WG.p_id,t_taid:row.data.ta_id,now_time:out_time});
        ticket_store.currentPage=1;
        ticket_store.load();

    }
    //删除分公司报价
    function ticket_del_zong(){
        var row=SUNLINE.getSelected(right_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }
        if(!row.data.t_fang_fen){
            Ext.Msg.alert('友情提示','该按钮只能删除分公司的票价信息！');
            return;
        }
        var id = row.get('t_id');
        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            if(y=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/Ticket/fen_del',
                    method : 'POST',
                    params : { t_id :id},
                    success : function(response, opts){
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info.msg);
                        if(result.status ==1){
                            ticket_store.reload();
                        }
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        })
    }
    //分公司票价表单
    var add_ticke_weekly= SUNLINE.weekCheckboxGroupThree({
        width:400,
        fieldLabel:'周几有效',
        name:'t_weekly',
        config:{labelWidth:70,labelAlign:"right",style:'margin-top:5px;',allowBlank:false,disabled:true,disabledCls:'dis_week'}
    });
    var city_choose_url = $__app__ + '/Ticket/city_select';
    var city_choose_field = [{name:"org_id"}];
    var city_choose_store = new SUNLINE.JsonStore(city_choose_url, city_choose_field,false);
    var city_choose_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:city_choose_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"city_id", dataIndex:"cp_id", width:10,hidden:true},
            {header:"城市名称", dataIndex:"cp_city", width:200},
            {header:"城市接送价格", dataIndex:"cp_price", width:130,align:'right',renderer:money}
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                emptyText:'适用城市',
                width:150,
                id:'city_choose_dosearch_id',
                onTriggerClick:function (e) {
                    city_choose_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            city_choose_dosearch();
                        }
                    }
                }
            }
        ]
    });
    function city_choose_dosearch(){
        var key=Ext.getCmp('city_choose_dosearch_id').getValue();
        var org_id_v;
        if(_uinfo['org_id']==1){
            var row=SUNLINE.getSelected(right_grid);
            org_id_v=row.data.t_bc_id;
        }else{
            org_id_v=_uinfo['org_id'];
        }
        SUNLINE.baseParams(city_choose_store,{skey:key,limit:1000,org_id:org_id_v});
        city_choose_store.currentPage=1;
        city_choose_store.load();
    }
    var t_grades_combo=SUNLINE.DictComBox_false({id:'t_groups',name:'t_groups',fieldLabel:"交通分组",labelWidth:80,labelAlign:"right",forceSelection:false},{'d_type':'交通分组'});
    var add_ticke_form=new Ext.form.FormPanel({
        region:'center',
        width:450,
        maxWidth:450,
        minWidth:450,
        height:600,
        border:false,
        bodyStyle:'background:#fff;padding:10px;',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:70,width:210,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"t_id",id:'t_id_new',fieldLabel:"t_id", maxLength:"100",hidden:true},
                    {name:"t_standards_id", fieldLabel:"t_standards_id", maxLength:"100",hidden:true},
                    {name:"t_standards_name", fieldLabel:"<span style='color:red'> * </span>票价名称", maxLength:"100",allowBlank:false,vtype:'NotBlank'},
                    {id:"t_single", name:"t_single",fieldLabel:"单独销售",width:210, maxLength:"40",disabled:true,hidden:true},
                    t_grades_combo.box,
                    {id:"t_money_add",name:"t_money",fieldLabel:"同行利润", maxLength:"20",allowBlank:false,vtype:'NotBlank', xtype:'numberfield',value:0},
                    {id:"t_price_add",name:"t_price",fieldLabel:"门市价", maxLength:"20",disabled:true,value:0},
                    {id:"t_trade_price_add",name:"t_trade_price", xtype:'numberfield',fieldLabel:"同行价", maxLength:"20",allowBlank:false,vtype:'NotBlank',value:0 },
                    {id:"t_agency_price_add",name:"t_agency_price", fieldLabel:"代理价", maxLength:"20" ,disabled:true},
                    {name:"t_spread_price", fieldLabel:"补房差", maxLength:"20",disabled:true },
                    {name:"t_out_room_price",id:'t_out_room_price',fieldLabel:"退房差",xtype:'numberfield',disabled:true},
                    {name:"t_room", fieldLabel:"拼房选择", maxLength:"20" ,disabled:true},
                    {name:"t_store", fieldLabel:"库存量", maxLength:"20",disabled:true },
                    {name:"t_limit_type", fieldLabel:"限制条件", maxLength:"20",disabled:true},
                    {name:"t_limit_condition", fieldLabel:"限制类型", maxLength:"20",disabled:true}
                ]
            },
            {xtype:'textfield',id:'fen_t_site_name_rule',name:"t_site_name_rule", fieldLabel:"<span style='color:red'> * </span>适用城市",allowBlank:false,labelWidth:70,width:420,labelAlign:"right",
                listeners:{'focus':city_choose_show_zong}},
            {xtype:'hidden',id:'fen_t_city_price_id',name:"t_city_price_id"},
            add_ticke_weekly,
            {name:"t_remark",labelAlign:"right", fieldLabel:"票价简介", xtype:'textarea',labelWidth:70,style:'margin-top:5px;', height:170,width:420}
        ]
    });
    var city_choose_win=new Ext.Window({
        title:'适用城市',
        width:400,
        height:500,
        resizable:false,
        autoScroll : true,
        closeAction:'hide',
        modal:true,
        items:[city_choose_grid],
        buttons:[
            '<span style="color:blue">多选取最大城市价格</span>',
            '->',
            {text:'选择',handler:function(){
                var rows=city_choose_grid.getSelectionModel().getSelection();
                if(rows.length==0){
                    Ext.Msg.alert('友情提示','没有选中任何记录');
                    return;
                }
                var temp_id='';
                var temp_name='';
                var temp_price=0;
                for(var i=0;i<rows.length;i++){
                    temp_id+=rows[i]['data']['cp_id']+',';
                    temp_name+=rows[i]['data']['cp_city']+',';
                    if(rows[i]['data']['cp_price']>=temp_price)temp_price=rows[i]['data']['cp_price'];
                }
                temp_id=temp_id.substr(0,temp_id.length-1);
                temp_name=temp_name.substr(0,temp_name.length-1);
                temp_id=','+temp_id+',';
                Ext.getCmp('fen_t_site_name_rule').setValue(temp_name);
                Ext.getCmp('fen_t_city_price_id').setValue(temp_id);
                /*for(var i=0;i<season_store.count();i++){
                    var At_store=season_store.getAt(i);
                    var ci_name=At_store.get('ci_name');
                    var ci_trade_price=At_store.get('ci_trade_price');
                    var c_moey=0;
                    if(ci_name=='接送（去）'  || ci_name=='接送(去)'){
                        if(ci_trade_price!=0){
                            c_moey=parseFloat(temp_price)-parseFloat(ci_trade_price);
                            At_store.set('ci_trade_price',temp_price);
                            Ext.getCmp('t_price_add').setValue(parseFloat(Ext.getCmp('t_price_add').getValue())+parseFloat(c_moey));
                            Ext.getCmp('t_trade_price_add').setValue(parseFloat(Ext.getCmp('t_trade_price_add').getValue())+parseFloat(c_moey));
                            Ext.getCmp('t_agency_price_add').setValue(parseFloat(Ext.getCmp('t_agency_price_add').getValue())+parseFloat(c_moey));
                        }
                    }
                }*/
                city_choose_win.hide();
            }},
            {text:'关闭', handler:function (){
                city_choose_win.hide();
            }}
        ]
    })
    function city_choose_show_zong(){
        var rows=SUNLINE.getSelected(right_grid);
        if(_uinfo['org_id']==1){
            var row=SUNLINE.getSelected(right_grid);
            org_id_v=row.data.t_bc_id;
        }else{
            org_id_v=_uinfo['org_id'];
        }
        SUNLINE.baseParams(city_choose_store,{limit:1000,org_id:org_id_v});
        city_choose_store.currentPage=1;
        city_choose_store.load();
        city_choose_win.show();
    }
    city_choose_win.on('hide',function(){
        city_choose_store.removeAll();
    })
    city_choose_store.on('load',function(){
        var rt_items_id=Ext.getCmp('fen_t_city_price_id').getValue();
        if(rt_items_id){
            rt_items_id=','+rt_items_id+',';
            var count=city_choose_store.getCount();
            var select_array=[];
            for(var index=0;index<count;index++){
                var record=city_choose_store.getAt(index);
                if(rt_items_id.search(','+record['data']['cp_id']+',')>=0){
                    select_array.push(record);
                }
            }
            if(select_array.length>0){
                city_choose_grid.getSelectionModel().select(select_array);
            }
        }
    })
    //分公司票价表单  成本项目
    var car_url = $__app__ + '/CostItem/select_data';
    var car_field = [
        {name:"ci_id"}
    ];
    var season_store = new SUNLINE.JsonStore(car_url, car_field,false);
    var season_south1= new Ext.grid.GridPanel({
        region:'center',
        border:false,
        width:710,
        style : 'border-left:3px solid #3993D3;',
        height:282,
        resizable:false,
        closeAction:'hide',
        store:season_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        columns:[
            {header:"ci_id", dataIndex:"ci_id", width:10,hidden:true},
            {header:"ci_bc_id", dataIndex:"ci_bc_id", width:10,hidden:true},
            {header:"p_id", dataIndex:"p_id", width:10,hidden:true},
            {header:"t_id", dataIndex:"t_id", width:10,hidden:true},
            {header:"td_details", dataIndex:"td_details", width:10,hidden:true},
            {header:"td_gross_price", dataIndex:"td_gross_price", width:10,hidden:true},
            {header:"项目名称", dataIndex:"ci_name", width:350},
            {header:"同行价", dataIndex:"ci_trade_price", width:350,align:'right',editor:new Ext.form.NumberField({id:'ci_trade_price_add'})}
        ],
        tbar:[
            '<b style="margin-top:3px;line-height:20px">报价明细</b>'
        ]
    });
    //分公司票价表单  交通明细
    var season_station_start_url = $__app__ + '/StationStart/dataJsonn';
    var season_station_start_field = [{name:"sd_id"}];
    var season_station_start_store=SUNLINE.GroupingStore(season_station_start_url,season_station_start_field,{ groupField:'f_traffic_type'},false);
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 条)"
    });
    var f_traffic_name_combo=SUNLINE.DictComBox_false({name:'f_traffic_name',allowBlank:false},{'d_type':'交通类型'});
    var f_ticket_type_combo=SUNLINE.DictComBox_false({name:'f_ticket_type',allowBlank:false},{'d_type':'火车铺位'});
    var f_traffic_start_OrgCombo=SUNLINE.OrgCombo_Sation({listConfig:{minWidth:340},name:'f_traffic_start',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var f_traffic_end_OrgCombo=SUNLINE.OrgCombo_Sation({listConfig:{minWidth:340},name:'f_traffic_end',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var season_station_start= new Ext.grid.GridPanel({
        region:'south',
        width:720,
        border:false,
        style : 'border-left:3px solid #3993D3;border-bottom:3px solid #3993D3;',
        height:190,
        resizable:false,
        closeAction:'hide',
        store:season_station_start_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        features: [groupingFeature],
        columns:[
            {header:"交通类型", dataIndex:"f_time", width:10,hidden:true},
            {header:"交通类型", dataIndex:"f_traffic_name", width:100,editor:f_traffic_name_combo.box},
            {header:"铺位", dataIndex:"f_ticket_type", width:100,editor:f_ticket_type_combo.box},
            {header:"出发口岸", dataIndex:"f_traffic_start", width:250,editor:f_traffic_start_OrgCombo.box},
            {header:"出发城市", dataIndex:"f_traffic_start_place", width:150,hidden:true},
            {header:"出发城市", dataIndex:"f_start_place_id", width:150,hidden:true},
            {header:"目的地口岸", dataIndex:"f_traffic_end", width:250,editor:f_traffic_end_OrgCombo.box},
            {header:"目的城市", dataIndex:"f_traffic_end_place", width:150,hidden:true},
            {header:"目的城市", dataIndex:"f_end_place_id", width:150,hidden:true}
        ],
        tbar:[
            '<b>交通明细<b>',
            {text:'添加路程',id:'detaild_add',iconCls:'button-add',width:120,
                menu:[ {text:'添加去程',iconCls:'button-add',handler:add_traffic},
                    {text:'添加返程',iconCls:'button-add',handler:add_traffic}]
            },
            '-',
            {text:'删除',iconCls:'button-del',handler:del_traffic}
        ]
    });
    function add_traffic(v){
        if(v.text=='添加去程'){
            season_station_start_store.add({
                f_time:Date.parse(new Date()),
                f_traffic_type:'去程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
        }else if(v.text=='添加返程'){
            season_station_start_store.add({
                f_time:Date.parse(new Date()),
                f_traffic_type:'返程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
        }
    }
    f_traffic_name_combo.box.on('select',function(c,r,n){
        var key;
        if(r[0].get('d_text')=='动车'){
            key='高铁座位';
        }else{
            key=r[0].get('d_text')+'座位';
        }
        var store=f_ticket_type_combo.box.getStore();
        var start_store=f_traffic_start_OrgCombo.box.getStore();
        var end_store=f_traffic_end_OrgCombo.box.getStore();

        var row=SUNLINE.getSelected(season_station_start);

        if(r[0].get('d_text')=='飞机'){
            SUNLINE.baseParams(start_store,{sd_start_type:'飞机'});
            SUNLINE.baseParams(end_store,{sd_start_type:'飞机'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
            row.set('f_ticket_type','经济舱');
        }else{
            if(r[0].get('d_text')=='高铁'){
                SUNLINE.baseParams(start_store,{sd_start_type:'高铁'});
                SUNLINE.baseParams(end_store,{sd_start_type:'高铁'});
                row.set('f_ticket_type','二等座');
            }else if(r[0].get('d_text')=='动车'){
                row.set('f_ticket_type','二等座');
                SUNLINE.baseParams(start_store,{sd_start_type:'动车'});
                SUNLINE.baseParams(end_store,{sd_start_type:'动车'});
            }else{
                SUNLINE.baseParams(start_store,{sd_start_type:'火车'});
                SUNLINE.baseParams(end_store,{sd_start_type:'火车'});
                row.set('f_ticket_type','下铺');
            }
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        }
        row.set('f_traffic_start','');
        row.set('f_traffic_end','');
        SUNLINE.baseParams(store,{'d_type':key});
        store.load();
    });
    season_station_start.on('select',function(i,v){
        key=v['data']['f_traffic_name']+'座位';
        var store=f_ticket_type_combo.box.getStore();
        SUNLINE.baseParams(store,{'d_type':key});
        store.load();
        var start_store=f_traffic_start_OrgCombo.box.getStore();
        var end_store=f_traffic_end_OrgCombo.box.getStore();
        if(v['data']['f_traffic_name']=='飞机'){
            SUNLINE.baseParams(start_store,{sd_start_type:'飞机'});
            SUNLINE.baseParams(end_store,{sd_start_type:'飞机'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;

            end_store.load();
        }else if(v['data']['f_traffic_name']=='高铁'){
            SUNLINE.baseParams(start_store,{sd_start_type:'高铁'});
            SUNLINE.baseParams(end_store,{sd_start_type:'高铁'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        }else if(v['data']['f_traffic_name']=='动车'){
            SUNLINE.baseParams(start_store,{sd_start_type:'动车'});
            SUNLINE.baseParams(end_store,{sd_start_type:'动车'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        }else{
            SUNLINE.baseParams(start_store,{sd_start_type:'火车'});
            SUNLINE.baseParams(end_store,{sd_start_type:'火车'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        }
    })
    function del_traffic(){
        var row=SUNLINE.getSelected(season_station_start);
        if(!row){
            Ext.Msg.alert('提示信息','请选择您要删除的行！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该交通明细信息吗？',function(id){
            if (id == 'yes') {
                season_station_start_store.remove(row);
                /*var f_time_value=row.data.f_time;
                for(var i=0;i<season_station_start_store.count();i++){
                    var At_store=season_station_start_store.getAt(i);
                    var f_time=At_store.get('f_time');
                    if(f_time==f_time_value){
                        season_station_start_store.remove(season_station_start_store.data.items[i]);
                        season_station_start_store.reload();
                        Ext.Msg.alert('友情提示','删除成功');
                    }
                }*/
            }
        })
    }
    f_traffic_end_OrgCombo.box.on({'select':function(c,r,n){
        var row=SUNLINE.getSelected(season_station_start);
        var row_right=SUNLINE.getSelected(right_grid);
        row.set('f_traffic_end_place',r[0].get('sd_city'));
        row.set('f_end_place_id',r[0].get('sd_id'));
        if(r[0].get('sd_id')){
            if(row.get('f_start_place_id')){
                Ext.Ajax.request({
                    url:$__app__ + '/Ticket/traff_price',
                    params:{
                        start_id:r[0].get('sd_id'),
                        end_id:row.get('f_start_place_id'),
                        type:row.get('f_ticket_type'),
                        name:row.get('f_traffic_name'),
                        start_time:row_right.data.t_start_time
                    },
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        if(info.msg){
                            var temp_price=info.msg;
                            var qu_num=0;
                            var fan_num=0;
                            season_station_start_store.each(function(v){
                                var row_data= v.data;
                                if(row_data.f_traffic_type=='去程'){
                                    qu_num++;
                                }else{
                                    fan_num++;
                                }
                            });
                            for(var i=0;i<season_store.count();i++){
                                var At_store=season_store.getAt(i);
                                var ci_name=At_store.get('ci_name');
                                var ci_trade_price=At_store.get('ci_trade_price');
                                var c_moey=0;
                                if(row.get('f_traffic_type')=='去程'){
                                    if(ci_name=='大交通（去）'  || ci_name=='大交通(去)'){
                                        if(qu_num>1){
                                            c_moey=parseFloat(temp_price);
                                            At_store.set('ci_trade_price',parseFloat(temp_price)+parseFloat(ci_trade_price));
                                        }else{
                                            c_moey=parseFloat(temp_price)-parseFloat(ci_trade_price);
                                            At_store.set('ci_trade_price',temp_price);
                                        }
                                        Ext.getCmp('t_price_add').setValue(parseFloat(Ext.getCmp('t_price_add').getValue())+parseFloat(c_moey));
                                        Ext.getCmp('t_trade_price_add').setValue(parseFloat(Ext.getCmp('t_trade_price_add').getValue())+parseFloat(c_moey));
                                        Ext.getCmp('t_agency_price_add').setValue(parseFloat(Ext.getCmp('t_agency_price_add').getValue())+parseFloat(c_moey));
                                    }
                                }else{
                                    if(ci_name=='大交通（返）'  || ci_name=='大交通(返)'){
                                        if(qu_num>1){
                                            c_moey=parseFloat(temp_price);
                                            At_store.set('ci_trade_price',parseFloat(temp_price)+parseFloat(ci_trade_price));
                                        }else{
                                            c_moey=parseFloat(temp_price)-parseFloat(ci_trade_price);
                                            At_store.set('ci_trade_price',temp_price);
                                        }
                                        Ext.getCmp('t_price_add').setValue(parseFloat(Ext.getCmp('t_price_add').getValue())+parseFloat(c_moey));
                                        Ext.getCmp('t_trade_price_add').setValue(parseFloat(Ext.getCmp('t_trade_price_add').getValue())+parseFloat(c_moey));
                                        Ext.getCmp('t_agency_price_add').setValue(parseFloat(Ext.getCmp('t_agency_price_add').getValue())+parseFloat(c_moey));

                                    }

                                }
                            }
                            qu_num=0;
                            fan_num=0;

                        }
                    },
                    failure:function (response, otps) {
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        }
    }})
    f_traffic_start_OrgCombo.box.on({'select':function(c,r,n){
        var row=SUNLINE.getSelected(season_station_start);
        row.set('f_traffic_start_place',r[0].get('sd_city'));
        row.set('f_start_place_id',r[0].get('sd_id'));
    }})
    //价格计算   成本项目   同行价   毛利  门市价  代理价
    //地接价不可修改
    season_south1.on('select',function(i,v){
        if(v['data']['ci_name']=='地接价'){
            Ext.getCmp('ci_trade_price_add').setReadOnly(true);
        }else{
            Ext.getCmp('ci_trade_price_add').setReadOnly(false);
        }
    });
    //成本项目 价格修改
    Ext.getCmp('ci_trade_price_add').on('change',function(t,n,o,opt){
        var row=SUNLINE.getSelected(season_south1);
        if(!n){
            n=0;
            row.set('ci_trade_price',n);
        }
        if(n=='-' || n=='.'){
            n=0;
            row.set('ci_trade_price',n);
        }
        if(!o){
            o=0;
        }
        if(o=='-' || o=='.'){
            o=0;
        }
        var tonghang=Ext.getCmp('t_trade_price_add').getValue();
        var mengshi=Ext.getCmp('t_price_add').getValue();
        var daili=Ext.getCmp('t_agency_price_add').getValue();
        var chai_money=parseFloat(n)-parseFloat(o);
        var t_price=parseFloat(mengshi)+parseFloat(chai_money);   //门市价
        var t_trade_price=parseFloat(tonghang)+parseFloat(chai_money);//同行价
        var t_agency_price=parseFloat(chai_money)+parseFloat(daili);   //代理价
        Ext.getCmp('t_price_add').setValue((t_price).toFixed(2));
        Ext.getCmp('t_trade_price_add').setValue((t_trade_price).toFixed(2));
        Ext.getCmp('t_agency_price_add').setValue((t_agency_price).toFixed(2));
    })

    WG.num_start=1;
    //同行利润
    Ext.getCmp('t_money_add').on('change',function(t,n,o,opt){
        if(WG.num_start!=1){
            if(!n){
                n=0;
                Ext.getCmp('t_money_add').setValue((n).toFixed(2));
            }
            if(!o){
                o=0;
            }
            var tonghang=Ext.getCmp('t_trade_price_add').getValue()
            var t_price=parseFloat(n)+parseFloat(tonghang);   //门市价
            Ext.getCmp('t_price_add').setValue((t_price).toFixed(2));
        }
        WG.num_start++;
    })
    //同行价格
    Ext.getCmp('t_trade_price_add').on('blur',function(){
        var tonghang_old=0;
        var tonghang_new=Ext.getCmp('t_trade_price_add').getValue();
        if(!tonghang_new){
            tonghang_new=0;
            Ext.getCmp('t_trade_price_add').setValue(0);
        }
        for(var i=0;i<season_store.count();i++){
            var At_store=season_store.getAt(i);
            if(At_store.get('ci_trade_price')==null){
                At_store.set('ci_trade_price',0);
            }
            tonghang_old=parseFloat(At_store.get('ci_trade_price'))+parseFloat(tonghang_old);
        }
        var chai_money=parseFloat(tonghang_new)-parseFloat(tonghang_old);
        var mengshi=Ext.getCmp('t_price_add').getValue();
        var daili=Ext.getCmp('t_agency_price_add').getValue();
        t_price=parseFloat(mengshi)+parseFloat(chai_money);   //门市价
        var t_agency_price=parseFloat(chai_money)+parseFloat(daili);   //代理价
        Ext.getCmp('t_price_add').setValue((t_price).toFixed(2));
        Ext.getCmp('t_agency_price_add').setValue((t_agency_price).toFixed(2));
        for(var i=0;i<season_store.count();i++){
            var At_store=season_store.getAt(i);
            if(At_store.get('ci_name')=='毛利'){
                var maoli=parseFloat(At_store.get('ci_trade_price'))+parseFloat(chai_money);
                At_store.set('ci_trade_price',(maoli).toFixed(2));
            }
        }
    })
    //添加、编辑、复制分公司报价
    var add_ticket_win=new Ext.Window({
        title:'票价定义',
        width:1170,
        height:550,
        layout:'border',
        closeAction:'hide',
        modal:true,
        items : [
            add_ticke_form,
            {
                region:'east',
                items:[
                    season_station_start,season_south1
                ]
            }
        ],
        buttons:[
            {text:'保存',handler:add_ticket_dosave_zong},
            {text:'取消', handler:function () {
                add_ticket_win.hide();
            },style:'margin-right:15px;'}
        ]
    });
    WG.td_id_val='-1';
    add_ticket_win.on('hide',function(){
        add_ticke_form.form.reset();
        season_store.removeAll();
        season_station_start_store.removeAll();
        WG.num_start=1;
        WG.td_id_val='-1';
    })
    //分公司票价保存
    function add_ticket_dosave_zong(){
        if(!add_ticke_form.form.isValid()){
            Ext.Msg.alert('友情提示','请填写左面表单红色边框的区域。');
            return false;
        }
        var t_money_add=Ext.getCmp('t_money_add').getValue();
        if(t_money_add==0){
            Ext.MessageBox.confirm('友情提示','您的门市价和同行价价格一样，您确定要保存么？',function(v){
                if(v=='yes'){
                    add_ticket_mo_zong();
                }
            })
        }else{
            add_ticket_mo_zong();
        }
    }
    function add_ticket_mo_zong(){
        var rows=SUNLINE.getSelected(right_grid);
        var left_data=add_ticke_form.getForm().getValues();
        left_data['t_end_time']=rows.data.t_end_time;
        left_data['t_start_time']=rows.data.t_start_time;
        left_data['t_preset_type']=rows.data.t_preset_type;
        left_data['t_single']=rows.data.t_single;
        left_data['t_out_room_price']=rows.data.t_out_room_price;
        left_data['t_spread_price']=rows.data.t_spread_price;
        left_data['t_room']=rows.data.t_room;
        left_data['t_store']=rows.data.t_store;
        left_data['t_limit_type']=rows.data.t_limit_type;
        left_data['t_limit_condition']=rows.data.t_limit_condition;
        left_data['t_price']=Ext.getCmp('t_price_add').getValue();
        left_data['t_trade_price']=Ext.getCmp('t_trade_price_add').getValue();
        left_data['t_agency_price']=Ext.getCmp('t_agency_price_add').getValue();
        left_data['company_type']='fen';
        if(WG.td_id_val!='-1')left_data['td_id']=WG.td_id_val;
        left_data['t_product_id']= rows.data.t_product_id;
        left_data['t_taid']= rows.data.t_taid;
        left_data['t_bc_id']=rows.data.t_bc_id;
        left_data['t_org_id']=rows.data.t_bc_id;
        left_data['t_org_pid']='1';
        left_data['t_weekly']=rows.data.t_weekly;
        //票价明细
        var north_data=[];
        for(var i=0;i<season_store.count();i++){
            var se_store=season_store.getAt(i);
            var se_temp={};
            se_temp['ci_name']=se_store.get('ci_name');
            se_temp['ci_trade_price']=se_store.get('ci_trade_price');
            north_data.push(se_temp);
            if(se_store.get('ci_name')=='毛利'){
                left_data['td_gross_price']=se_store.get('ci_trade_price');
            }
        }
        north_data=Ext.encode(north_data);
        left_data['items_price']=north_data;
        //交通明细
        var season_data=[];
        var qucheng=''
        var fancheng='';
        for(var i=0;i<season_station_start_store.count();i++){
            var tr_store=season_station_start_store.getAt(i);
            var tr_temp={};
            if(tr_store.get('f_traffic_start') || tr_store.get('f_traffic_end')){
                if(tr_store.get('f_traffic_start')==tr_store.get('f_traffic_end')){
                    Ext.Msg.alert('提示信息','交通的始发站和目的地不能一致');
                    return false;
                }
                tr_temp['f_traffic_type']=tr_store.get('f_traffic_type');
                tr_temp['f_time']=tr_store.get('f_time');
                tr_temp['f_traffic_name']=tr_store.get('f_traffic_name');
                tr_temp['f_ticket_type']=tr_store.get('f_ticket_type');
                tr_temp['f_traffic_start']=tr_store.get('f_traffic_start');
                tr_temp['f_traffic_start_place']=tr_store.get('f_traffic_start_place');
                tr_temp['f_traffic_end_place']=tr_store.get('f_traffic_end_place');
                tr_temp['f_start_place_id']=tr_store.get('f_start_place_id');
                tr_temp['f_end_place_id']=tr_store.get('f_end_place_id');
                tr_temp['f_traffic_end']=tr_store.get('f_traffic_end');
                season_data.push(tr_temp);
                if(tr_store.get('f_traffic_type')=='去程'){
                    qucheng+='-'+tr_store.get('f_traffic_name')
                }else{
                    fancheng+='-'+tr_store.get('f_traffic_name')
                }

            }
        }
        left_data['qucheng']=qucheng;
        left_data['fancheng']=fancheng
        season_data=Ext.encode(season_data);
        left_data['t_traffic_all']=season_data;

        left_data['type_fen_zong']='fang';   //判断总共添加分公司的票

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Ticket/fen_save',
            params:left_data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                myMask.hide();
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ticket_store.reload();
                    add_ticket_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function add_ticket_zong(v){
        if(v.text_type=='add'){
            var row=SUNLINE.getSelected(ticket_ta_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择左边您要操作的票价');
                return false;
            }
            var rows=SUNLINE.getSelected(right_grid);
            if(!rows.data.t_company_type){
                if(_uinfo['org_id']==1){
                    Ext.Msg.alert('提示信息','请选择分公司那一行才能添加');
                }else{
                    Ext.Msg.alert('提示信息','请选择报账票价的时间段');
                }

                return false;
            }
            var data_all=rows.data;
            data_all['t_id']='';
            data_all['t_site_name_rule']='';
            season_store.removeAll();
            SUNLINE.baseParams(season_store,{ci_bc_id:rows.data.t_bc_id});
            season_store.load();
            add_ticke_form.getForm().setValues(rows.data);
            add_ticket_win.show();
            SUNLINE.weekSetValues(add_ticke_weekly,rows.data.t_weekly);
            season_station_start_store.add({
                f_time:Date.parse(new Date()),
                f_traffic_type:'去程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
            season_station_start_store.add({
                f_time:Date.parse(new Date()),
                f_traffic_type:'返程',
                f_traffic_name:'火车',
                f_ticket_type:'上铺',
                f_traffic_start:'',
                f_traffic_end:''
            });
            add_ticket_win.setTitle("添加分公司票价信息", v.iconCls);
        }else{
            var row=SUNLINE.getSelected(right_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的票价！');
                return false;
            }
            if(!row.data.t_fang_fen){
                Ext.Msg.alert('提示信息','请选择分公司票价那一行才能添加');
                return false;
            }
            Ext.Ajax.request({
                url:$__app__ + '/Ticket/td_save',
                params:{p_id:row.data.t_product_id,t_id:row.data.t_id,b_id:0},
                method:'POST',
                success:function (response,opts) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    if(info.msg){
                        var td_details=Ext.decode(info.msg);
                        for(var i in td_details){
                            if(td_details[i]['ci_name']){
                                var ci_name_v=td_details[i]['ci_name'];
                                var ci_trade_price_v=td_details[i]['ci_trade_price'];
                                season_store.add({
                                    ci_name:ci_name_v,
                                    ci_trade_price:ci_trade_price_v
                                });
                            }
                        }
                        if(v.text_type=='fuzhi'){
                            WG.td_id_val='-1';
                        }else{
                            WG.td_id_val=info.info;
                        }
                    }
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('提示信息','没有该票价的详情信息');
                }
            })
            var traffic=row.data.t_traffic_all;
            traffic=Ext.decode(traffic);
            for(var i in traffic){
                if(traffic[i]['f_traffic_name']){
                    var f_time_value=traffic[i]['f_time'];
                    var f_traffic_type_value=traffic[i]['f_traffic_type'];
                    var f_traffic_name_value=traffic[i]['f_traffic_name'];
                    var f_ticket_type_value=traffic[i]['f_ticket_type'];
                    var f_traffic_start_value=traffic[i]['f_traffic_start'];
                    var f_traffic_end_value=traffic[i]['f_traffic_end'];
                    var f_traffic_start_place_value=traffic[i]['f_traffic_start_place'];
                    var f_traffic_end_place_value=traffic[i]['f_traffic_end_place'];
                    var f_start_place_id_value=traffic[i]['f_start_place_id'];
                    var f_end_place_id_value=traffic[i]['f_end_place_id'];
                    season_station_start_store.add({
                        f_time:f_time_value,
                        f_traffic_type:f_traffic_type_value,
                        f_traffic_name:f_traffic_name_value,
                        f_ticket_type:f_ticket_type_value,
                        f_traffic_start:f_traffic_start_value,
                        f_traffic_end:f_traffic_end_value,
                        f_traffic_start_place:f_traffic_start_place_value,
                        f_start_place_id:f_start_place_id_value,
                        f_end_place_id:f_end_place_id_value,
                        f_traffic_end_place:f_traffic_end_place_value
                    });
                }
            }
            add_ticket_win.show();
            add_ticke_form.getForm().setValues(row.data);
            SUNLINE.weekSetValues(add_ticke_weekly,row.get('t_weekly'));
            add_ticket_win.setTitle("编辑分公司票价信息", v.iconCls);
            if(v.text_type=='fuzhi'){
                Ext.getCmp('t_id_new').setValue('');
                Ext.getCmp('fen_t_site_name_rule').setValue('');
                Ext.getCmp('fen_t_city_price_id').setValue('');
                WG.td_id_val='-1';
            }
        }

    }
    season_store.on('load',function(){
        var rows=SUNLINE.getSelected(right_grid);
        if(rows.data.t_trade_price){
            season_store.add({ci_id:0,ci_name:'毛利',ci_trade_price:0});
            season_store.add({ci_id:0,ci_name:'地接价',ci_trade_price:rows.data.t_trade_price});
        }
    })
    //地接价删除
    function right_del(){
        var row=SUNLINE.getSelected(right_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }
        if(!row.data.t_fang_type){
            Ext.Msg.alert('提示信息','该行不能删除！');
            return false;
        }
        Ext.Ajax.request({
            url:$__app__ + '/Ticket/select_detail',
            params:{t_id:row.data.t_id},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (info.info=='not_save'){
                    Ext.Msg.alert('友情提示', '分公司已经添加二次包装票,您不能删除标准票价了');
                    return false;
                }else{
                    Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
                        if(y=='yes'){
                            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                            myMask.show();
                            Ext.Ajax.request({
                                url:$__app__ + '/Ticket/del',
                                params:{t_id:row.data.t_id},
                                method:'POST',
                                success:function (response, otps) {
                                    myMask.hide();
                                    var ret = Ext.decode(response.responseText);
                                    var info=ret.info;
                                    Ext.Msg.alert('友情提示',info);
                                    if (ret.status){
                                        ticket_store.reload();
                                        right_win.hide();
                                    };
                                },
                                failure:function (response, otps) {
                                    myMask.hide();
                                    Ext.Msg.alert('友情提示', '操作失败！');
                                }
                            })
                        }
                    })
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    //地接价、编辑表单
    var t_weekly_s= SUNLINE.weekCheckboxGroup({
        width:400,
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'t_weeklyy',
        config:{id:'idd_t_weeklyy',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side',disabledCls:'dis_week'}
    });
    var standards_condition=new Ext.form.TextField({id:"t_limit_condition",labelAlign:'right',labelWidth:80,width:260,name:"t_limit_condition",fieldLabel:'<span class="help" data-qtip="实名票:必须填写身份证<br>限制性别:只能输入男或女<br>限制年龄:只能输入正整数、<正整数、正整数，如：>10、<10、8-10">&nbsp;</span>限制条件',disabled:true});
    var standards_combo=SUNLINE.DictComBox_false({id:'idd_t_limit_type',name:'t_limit_type',fieldLabel:"限制类型",labelWidth:80,labelAlign:"right",allowBlank:false,value:'实名票'},{'d_type':'票种限制'});
    standards_combo.box.on('change', function(c,r,n){
        if(r=='限制性别'){
            standards_condition.setDisabled(false);
            standards_condition.focus();
            standards_condition.allowBlank = false;
            standards_condition.regex=/^男$|^女$/;
            standards_condition.regexText ='只能输入男或女，请注意前后的空格。';
        }else if( r=='限制年龄'){
            standards_condition.setDisabled(false);
            standards_condition.focus();
            standards_condition.allowBlank=false;
            standards_condition.regex =/^<+?[1-9][0-9]*$|^>+?[1-9][0-9]*$|^\d+-[1-9][0-9]*$/;
            standards_condition.regexText ='只能输入“<正整数 或 >正整数 或 正整数-正整数”，如<10、>10、10-20等';
        }else{
            standards_condition.setDisabled(true);
            standards_condition.focus();
            standards_condition.allowBlank=true;
            standards_condition.regex = '';
            standards_condition.regexText = '';
            standards_condition.setValue( '' );
        }
    });
    var right_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    SUNLINE.ExtDateField({id:'t_start_time',name:'t_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:390,gang:'t_end_time',start:true}),
                    SUNLINE.ExtDateField({id:'t_end_time',name:'t_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:390,gang:'t_start_time'})
                ]
            },
            t_weekly_s,
            {
                cls:'tcol3',
                defaults:{xtype:'textfield',labelWidth:80,width:260,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"t_id", fieldLabel:"t_id", maxLength:"100",hidden:true},
                    {id:'t_preset_type_idd',name:"t_preset_type", fieldLabel:"t_preset_type", maxLength:"100",hidden:true},
                    {name:"t_product_id", fieldLabel:"t_product_id", maxLength:"100",hidden:true},
                    {name:"t_store",id:'idd_t_store',fieldLabel:'<span class="help" qtip="该库存量是每天的上限，-1为不限制。">&nbsp;</span>库存量',xtype:'numberfield', value:-1},
                    {
                        name:"t_single",
                        hidden:true,
                        id:'idd_t_single',
                        fieldLabel:"单独销售",
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['t_single'],
                            data:[
                                ['是'],
                                ['否']
                            ]
                        }),
                        displayField:"t_single",
                        valueField:"t_single",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:'否'
                    },
                    standards_combo.box,
                    standards_condition,
                    {name:"t_trade_price",id:'idd_t_trade_price', fieldLabel:"<span style='color:red'> * </span>成本价",
                        maxLength:"20",allowBlank:false,
                        listeners:{'focus':items_cost_show}},
                    {name:"t_price",id:'idd_t_price', fieldLabel:"<span style='color:red'> * </span>代理差价", maxLength:"20",allowBlank:false,xtype:'numberfield',value:0 },
                    {name:"t_agency_price",id:'idd_t_agency_price', fieldLabel:"<span style='color:red'> * </span>代理价", maxLength:"20",allowBlank:false },
                    {name:"t_spread_price",fieldLabel:"<span style='color:red'> * </span>补房差",  value:"0",allowBlank:false,xtype:'numberfield'},
                    {name:"t_out_room_price",fieldLabel:"<span style='color:red'> * </span>退房差", value:"0",allowBlank:false,xtype:'numberfield'},
                    {
                        width:260,
                        name:"t_room",
                        id:'idd_t_room',
                        fieldLabel:"拼房选项",
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['t_room'],
                            data:[
                                ['房源充足，可自由选择'],
                                ['不能选房，只能拼房'],
                                ['必须补房差']
                            ]
                        }),
                        displayField:"t_room",
                        valueField:"t_room",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:'房源充足，可自由选择'
                    }
                ]
            },
            {xtype:'textfield',id:'id_t_site_name_rule',name:"t_site_name_rule", fieldLabel:"<span style='color:red'> * </span>适用公司",allowBlank:false,labelWidth:80,width:780,labelAlign:"right",
                listeners:{'focus':bc_choose_show}},
            {xtype:'hidden',id:'id_t_bc_id',name:"t_bc_id"},
            {name:"t_remark",labelAlign:"right",id:'idd_t_remark', fieldLabel:"票价简介", xtype:'textarea',labelWidth:80,style:'margin-top:5px;', height:60,width:780}
        ]
    })
    Ext.getCmp('idd_t_price').on('change',function(a,b,c){
        var money=Ext.getCmp('idd_t_trade_price').getValue();
        var daili=Number(money)+Number(b);
        Ext.getCmp('idd_t_agency_price').setValue(daili);
    })
    //选择成本价
    var items_list=[
        {text:'车辆',iconCls:'button-add',id:'car_id'},
        {text:'导游',iconCls:'button-add',id:'guides_id'},
        {text:'景区',iconCls:'button-add',id:'scenic_id'},
        {text:'住宿',iconCls:'button-add',id:'hotal_id'},
        {text:'餐饮',iconCls:'button-add',id:'caterers_id'},
        {text:'购物店',iconCls:'button-add',id:'shop_id'},
        {text:'其他',iconCls:'button-add',id:'out_id'}
    ];
    var reckon_type='ti_trade_price';
    var items_cost_url=$__app__+'/Ticket/new_ticket_detail';
    var items_cost_field=['ti_id'];
    var items_cost_store=SUNLINE.GroupingStore(items_cost_url,items_cost_field,{sortInfo:{field:'ti_type_new'}, groupField:'ti_type_new'},false);
    var items_text='';
    var items_cost_grid=SUNLINE.ItemsList({
        store:items_cost_store,
        items_list:items_list,
        plan_type:'height_false',
        reckon_type:reckon_type,
        pop_num:1
    },function(m,s,i){
        WG.total_1info_val=m;
        items_text = '<span style="line-height:1px;">实时统计信息： 总计:'+real_money(m)+'元(由绿色价格累加得到)</span>';
        if(document.getElementById('total_1info')){
            document.getElementById('total_1info').innerHTML=items_text;
        }

    },function(){});
    var items_cost_win=new Ext.Window({
        title:'成本项目',
        width:1080,
        height:510,
        autoScroll : true,
        closeAction:'hide',
        layout : 'border',
        modal:true,
        resizable:true,
        maximizable : true,//全屏效果
        items:items_cost_grid,
        buttons:[
            {
                xtype:'tbtext',
                id:'total_1info',
                style:'font-weight:bold;color:blue',
                text:''
            },'->',
            {text:'确定',handler:items_cost_dosave},
            {text:'关闭', handler:function (){
                items_cost_win.hide();
            },style:'margin-right:15px;'}
        ]
    });

    function items_cost_dosave(){
        var cost_data=[];
        items_cost_store.each(function(v){
            var row= v.data;
            cost_data.push(row);
        });
        cost_data=Ext.encode(cost_data);
        WG.chengben=cost_data;
        Ext.getCmp('idd_t_trade_price').setValue(WG.total_1info_val);
        var idd_t_price=Ext.getCmp('idd_t_price').getValue();
        var daili=Number(idd_t_price)+Number(WG.total_1info_val);
        Ext.getCmp('idd_t_agency_price').setValue(daili);
        items_cost_win.hide();
    }
    function items_cost_show(){
        var time=Ext.getCmp('t_start_time').getRawValue();
        if(time){
            var row=SUNLINE.getSelected(ticket_ta_grid);
            var t_start_time_val=Ext.getCmp('t_start_time').getRawValue();
            var t_start_time_v=time_qu(t_start_time_val);
            var t_end_time_val=Ext.getCmp('t_end_time').getRawValue();
            var t_endtime_v=time_qu(t_end_time_val);
            //判断成本价格
            var right_row=SUNLINE.getSelected(right_grid);

            if(!WG.chengben){
                if(right_row==null){
                    SUNLINE.baseParams(items_cost_store,{ti_product_id:WG.p_id,ti_ta_tid:row.data.ta_id,ta_type:row.data.ta_type,t_end_time:t_end_time_val,t_start_time:t_start_time_val,limit:1000});
                }else{
                    if(right_row.data.t_taid!=row.data.ta_id){
                        SUNLINE.baseParams(items_cost_store,{ti_product_id:WG.p_id,ti_ta_tid:row.data.ta_id,ta_type:row.data.ta_type,t_end_time:t_end_time_val,t_start_time:t_start_time_val,limit:1000});
                    }else{
                        var ti_tid='';
                        if(right_row.data.t_standards_id!=0){
                            ti_tid=right_row.data.t_standards_id;
                        }else{
                            ti_tid=right_row.data.t_id;
                        }
                        SUNLINE.baseParams(items_cost_store,{ti_product_id:WG.p_id,ti_ta_tid:row.data.ta_id,ta_type:row.data.ta_type,t_end_time:t_end_time_val,t_start_time:t_start_time_val,ti_ticket_id:ti_tid,limit:1000});
                    }
                }

                items_cost_store.load();
            }
            items_cost_grid.ticket_date = {start_date:t_start_time_v,end_date:t_endtime_v};
            items_cost_win.show();
        }else{
            Ext.Msg.alert('友情提示','请您先选择票价的适用时间');
        }
    }
    function time_qu(v){
        return v.substr(0,4)+v.substr(5,2)+v.substr(8,2);
    }
    //选择适用公司
    var bc_choose_url = $__app__ + '/Ticket/bc_select';
    var bc_choose_field = [{name:"org_id"}];
    var bc_choose_store = new SUNLINE.JsonStore(bc_choose_url, bc_choose_field,false);
    var bc_choose_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:bc_choose_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"bc_id", dataIndex:"bc_id", width:10,hidden:true},
            {header:"公司名称", dataIndex:"org_name", width:300}
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                emptyText:'分公司名称',
                width:150,
                id:'bc_choose_dosearch_id',
                onTriggerClick:function (e) {
                    bc_choose_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            bc_choose_dosearch();
                        }
                    }
                }
            }
        ]
    });
    function bc_choose_dosearch(){
        var key=Ext.getCmp('bc_choose_dosearch_id').getValue();
        SUNLINE.baseParams(bc_choose_store,{skey:key,limit:1000});
        bc_choose_store.currentPage=1;
        bc_choose_store.load();
    }
    var bc_choose_win=new Ext.Window({
        title:'全部分公司',
        width:400,
        height:500,
        resizable:false,
        autoScroll : true,
        closeAction:'hide',
        modal:true,
        items:[bc_choose_grid],
        buttons:[
            {text:'选择',handler:function(){
                var rows=bc_choose_grid.getSelectionModel().getSelection();
                if(rows.length==0){
                    Ext.Msg.alert('友情提示','没有选中任何记录');
                    return;
                }
                var temp_id='';
                var temp_name='';
                for(var i=0;i<rows.length;i++){
                    temp_id+=rows[i]['data']['org_id']+',';
                    temp_name+=rows[i]['data']['org_name']+',';
                }
                temp_id=temp_id.substr(0,temp_id.length-1);
                temp_name=temp_name.substr(0,temp_name.length-1);
                temp_id=','+temp_id+',';
                Ext.getCmp('id_t_site_name_rule').setValue(temp_name);
                Ext.getCmp('id_t_bc_id').setValue(temp_id);
                bc_choose_win.hide();
            }},
            {text:'关闭', handler:function (){
                bc_choose_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    bc_choose_win.on('hide',function(){
        bc_choose_store.removeAll();
    })
    bc_choose_store.on('load',function(){
        var rt_items_id=Ext.getCmp('id_t_bc_id').getValue();
        if(rt_items_id==''){
        }else{
            rt_items_id=','+rt_items_id+',';
            var count=bc_choose_store.getCount();
            var select_array=[];
            for(var index=0;index<count;index++){
                var record=bc_choose_store.getAt(index);
                if(rt_items_id.search(','+record['data']['org_id']+',')>=0){
                    select_array.push(record);
                }
            }
            if(select_array.length>0){
                bc_choose_grid.getSelectionModel().select(select_array);
            }
        }
    })
    function bc_choose_show(){
        SUNLINE.baseParams(bc_choose_store,{limit:1000});
        bc_choose_store.currentPage=1;
        bc_choose_store.load();
        bc_choose_win.show();
    }
    //地接价、编辑窗口
    var right_win= new Ext.Window({
        width:820,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:right_form,
        buttons:[
            {text:'保存', handler:right_dosave},
            {text:'关闭', handler:function () {
                right_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    right_win.on('hide',function(){
        right_form.getForm().reset();
        WG.chengben='';
        WG.total_1info_val='';
        items_cost_store.removeAll();
    })
    var standards_combo_num=1;
    right_win.on('show',function(){
        if(standards_combo_num==1)standards_combo.box.getStore().load();
        standards_combo_num++;
        Ext.getCmp('idd_t_limit_type').setValue('实名票')
    })
    WG.only_data='off'; // 分公司添加票价后 总公司只能编辑日期   on--off
    right_win.on('hide',function(){
        WG.only_data='off';
    })
    function right_dosave(){
        if (!right_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(ticket_ta_grid);
        var data= right_form.getForm().getValues();
        data['t_product_id']= WG.p_id;
        data['t_taid']=row.data.ta_id;
        data['t_preset_type']=row.data.ta_type;
        data['cost_detail']=WG.chengben;

        if(WG.only_data=='on'){
            Ext.MessageBox.confirm('友情提示','<b style="color:#c40000;font-size:16px;line-height:30px;">分公司已经包装过票价标准了，您确定要修改么?这会将所有分公司的票价信息也全部修改掉，请慎重操作！</b>',function(id){
                if (id == 'yes') {
                    Ext.Ajax.request({
                        url:$__app__ + '/Ticket/save_only',
                        params:data,
                        method:'POST',
                        success:function (response, otps) {
                            myMask.hide();
                            var ret = Ext.decode(response.responseText);
                            var info=ret.info;
                            Ext.Msg.alert('友情提示',info.msg);
                            if (ret.status){
                                ticket_store.reload();
                                right_win.hide();
                            }
                        },
                        failure:function (response, otps) {
                            myMask.hide();
                            Ext.Msg.alert('友情提示', '操作失败！');
                        }
                    })
                }
            })

        }else{
            Ext.Ajax.request({
                url:$__app__ + '/Ticket/zong_save',
                params:data,
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    Ext.Msg.alert('友情提示',info.msg);
                    if (ret.status){
                        ticket_store.reload();
                        right_win.hide();
                    }
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }

    }
    //地接价、编辑
    function right_modify(v){
        var row_ta=SUNLINE.getSelected(ticket_ta_grid);
        if(row_ta==null){
            Ext.Msg.alert('提示信息','请选择您要操作的票价名称');
            return false;
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(right_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的票价内容');
                return false;
            }

            if(!row.data.t_fang_type){   //添加一个判断  是否是总公司的
                Ext.Msg.alert('提示信息','分公司的票价信息您不能修改');
                return false;
            }
         
            if(row.data.t_taid!=row_ta.data.ta_id){
                Ext.Msg.alert('提示信息','请选择您要操作的票价内容');
                return false;
            }
            Ext.Ajax.request({
                url:$__app__ + '/Ticket/select_detail',
                params:{t_id:row.data.t_id},
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    right_win.show();
                    if(row.data.t_start_time.indexOf("-")<=0){
                        row.data.t_start_time=time_new(row.data.t_start_time)
                    }
                    if(row.data.t_end_time.indexOf("-")<=0){
                        row.data.t_end_time=time_new(row.data.t_end_time)
                    }
                    right_form.getForm().setValues(row.data);
                    var sb_weekly_id=row.get('t_weekly');
                    SUNLINE.weekSetValues(t_weekly_s,sb_weekly_id);
                    if (info.info=='not_save'){
                        WG.only_data='on';  // 分公司添加票价后 总公司只能编辑日期
                    }
                    right_win.show();
                    right_win.setTitle(v.text+"票价内容", v.iconCls);
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }else{
            right_win.show();
            right_win.setTitle("添加票价内容", v.iconCls);
        }
    }
    function time_new(v){
        return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2)
    }
    //搜索
    function ticket_dosearch_zhu(){
        var row=SUNLINE.getSelected(ticket_ta_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的票价');
            return false;
        }
        var key=Ext.getCmp('ticket_search_zhu').getValue();

        var price=Ext.getCmp('right_history_status').getText();
        var out_time=''
        if(price!='历史报价'){
            out_time='out_time';
        }
        SUNLINE.baseParams(ticket_store,{t_standards_name:key,t_product_id:WG.p_id,t_taid:row.data.ta_id,now_time:out_time});
        ticket_store.currentPage=1;
        ticket_store.load();
    }
    //成本项目模块
    var cost_url = $__app__ + '/Ticket/cost_select';
    var cost_field = [{name:"ti_id"}];
    var cost_store=SUNLINE.GroupingStore(cost_url,cost_field,{sortInfo:{field:'ti_day'}, groupField:'ti_day'},false);
    var cost_group=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl:['','{name:this.format_keyword} (共 {[values.rows.length]} 项成本)',{format_keyword:function(name){
            if(name=="-1"){
                return '按团计费';
            }else if(name=="-2"){
                return '分公司报价';
            }else{
                return '第'+name+'天';
            }
        }}]
    })
    function ti_day(v){
        if (v=='-1' || v=='-2') return '-';
        return '第'+ v +'天';
    };
    var cost_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"资源名称", dataIndex:"ti_insti_name", width:170},
        {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
        {header:"项目名称", dataIndex:"ti_cs_type_name", width:130},
        {header:"项目类型", dataIndex:"ti_type_new", width:80},
        {header:"计量方式", dataIndex:"ti_type_mode", width:80},
        {header:"结算方式", dataIndex:"ti_insti_type", width:80},
        {header:"第几天", dataIndex:"ti_day", width:80,renderer:ti_day},
        {header:"总金额", dataIndex:"ti_all_money", width:80,align:'right',renderer:money},
        {header:"数量", dataIndex:"ti_num", width:50},
        {header:"结算单价", dataIndex:"ti_trade_price", width:90,align:'right',renderer:money},
        {header:"备注", dataIndex:"ti_remark", width:150}
    ];
    var south_grid = new Ext.grid.GridPanel({
        region:'south',
        height:250,
        border:false,
        columns:cost_cm,
        store:cost_store,
        split : {size:3},
        features: [cost_group],
        maxHeight:500,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目信息',
            deferEmptyText:true
        }
    });
    //右侧模块
    var right_panel = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'border',
        items : [right_grid,south_grid]
    })

    //票价名称
    var ticket_ta_url=$__app__+'/TicketName/dataJson';
    var ticket_ta_field=['ta_id'];
    var ticket_ta_store = SUNLINE.JsonStore(ticket_ta_url,ticket_ta_field,false);
    var ticket_ta_cm=[
        new Ext.grid.RowNumberer(),
        {header:"票价名称", dataIndex:"ta_name", width:120},
        {header:"票种", dataIndex:"ta_type", width:70},
        {header:"票价分组", dataIndex:"ta_groups", width:80}
    ];
    var ticket_tbar=[];
    if(_uinfo['org_id']==1){
        ticket_tbar=ticket_tbar.concat([
            {text:'添加',iconCls:'button-add',handler:ta_modify, disabled:isDisabled('TicketName::save')},
            '-',
            /*{text:'编辑', iconCls:'button-edit',handler:ta_modify, disabled:isDisabled('TicketName::save')},*/
            {text:'编辑',iconCls:'button-edit',disabled:isDisabled('TicketName::save'),
                menu:[
                    {text:'编辑',iconCls:'button-edit',handler:ta_modify},
                    {text:'复制',iconCls:'button-view',handler:ta_modify}
                ]
            },
            '-',
            {text:'删除', iconCls:'button-del',handler:ta_del, disabled:isDisabled('TicketName::del')}
        ]);
    }
    var ticket_ta_grid=new Ext.grid.GridPanel({
        region:'center',
        height:550,
        maxHeight:1000,
        minHeight:0,
        split : {size:3},
        store:ticket_ta_store,
        columns:ticket_ta_cm,
        border :false,
        style : 'border-top:3px solid #3993D3;',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无票价信息。',
            deferEmptyText : true
        },
        tbar:ticket_tbar,
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:ticket_ta_store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有票价信息'
        })
    });
    var ta_type_combo=SUNLINE.DictComBox_false({id:'ta_type_id',name:'ta_type',fieldLabel:"票价类型",width:260,labelWidth:80,labelAlign:"right",allowBlank:false,editable:true,forceSelection:false},{'d_type':'标准票价类型'});
    var ta_group_combo=SUNLINE.DictComBox_false({id:'ta_groups',name:'ta_groups',fieldLabel:"票价分组",width:260,labelWidth:80,labelAlign:"right",editable:true,forceSelection:false},{'d_type':'酒店等级'});
    var ta_form= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:260 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                items:[
                    {name:"ta_id", fieldLabel:"ta_id", maxLength:"10",xtype:"hidden"},
                    {name:"ta_name", fieldLabel:"票价名称",allowBlank:false,vtype:'NotBlank'},
                    ta_type_combo.box,
                    ta_group_combo.box
                ]
            }
        ]
    });
    //票价名称窗口
    var ta_win= new Ext.Window({
        width:330,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:ta_form,
        buttons:[
            {text:'保存', id:'ta-id',handler:ta_dosave},
            {text:'关闭', handler:function () {
                ta_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    //票价名称保存
    function ta_dosave(v){
        if (!ta_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var data = ta_form.getForm().getValues();
        data['ta_pid']= WG.p_id;
        var url=$__app__ + '/TicketName/save';
        if(v.text=='确认复制')url=$__app__ + '/Ticket/copy_ticket';
        Ext.Ajax.request({
            url:url,
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ticket_ta_store.reload();
                    ta_win.hide();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    var ta_type_num=1;
    ta_win.on('show',function(){
        if(ta_type_num==1)ta_type_combo.box.getStore().load();
    })
    Ext.getCmp('ta_type_id').setValue('成人票');
    ta_win.on('hide',function(){
        ta_form.getForm().reset();
    })
    //票价名称的添加、编辑
    function ta_modify(v){
        if(_uinfo['org_id']!='1'){
            Ext.Msg.alert('提示信息','您没有操作的权限');
            return false;
        }

        if( Ext.getCmp('p_name_id').getValue()==null){
            Ext.Msg.alert('提示信息','请您先选择导航栏里的产品');
            return false;
        }
        ta_win.show();
        if(v.text=='编辑' || v.text=='复制'){
            var row=SUNLINE.getSelected(ticket_ta_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的票价名称');
                return false;
            }
            ta_form.getForm().setValues(row.data);
        }
        Ext.getCmp('ta-id').setText('确认'+ v.text);
        ta_win.setTitle(v.text+"票价名称", v.iconCls);
    }
    //票价名称的删除
    function ta_del(){
        if(_uinfo['org_id']!='1'){
            Ext.Msg.alert('提示信息','您没有操作的权限');
            return false;
        }
        var row=SUNLINE.getSelected(ticket_ta_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        }
        Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
            myMask.show();
            if(y=='yes'){
                Ext.Ajax.request({
                    url:$__app__ + '/TicketName/del',
                    params:{ta_id:row.data.ta_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info);
                        if (ret.status){
                            ticket_ta_store.reload();
                            ta_win.hide();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }else{
                myMask.hide();
            }
        })
    }
    var left_grid = new Ext.Panel({
        border : false,
        layout : 'border',
        region : 'west',
        width:300,
        maxWidth:1000,
        minWidth:0,
        split : {size:3},
        style : 'border-top-width:1px;',
        items : [ticket_ta_grid]
    });

    var panel = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'border',
        items : [left_grid,right_panel],
        tbar:[
            '<b>产品系列:</b>',
            p_series_combo.box,
            '<b>产品名称:</b>',
            Products_OrgCombo.box
        ]
    });
    //产品系列
    var end_store=p_series_combo.box.getStore();
    var Products_store=Products_OrgCombo.box.getStore();
    SUNLINE.baseParams(end_store,{d_type:'品牌系列'});
    end_store.on('load',function(){
        this.add({d_type:'品牌系列',d_text:'全部产品', d_status: "ok", d_recommend: "0"});
        Ext.getCmp('p_series_id').setValue('全部产品');
    })
    p_series_combo.box.on({'select':function(c,r,n){
        Products_store.removeAll();
        SUNLINE.baseParams(Products_store,{p_series:r[0].get('d_text')});
        Products_store.currentPage=1;
        Products_store.load();
        ticket_ta_store.removeAll();
        cost_store.removeAll();
        SUNLINE.baseParams(ticket_store,{t_taid:''});
        ticket_store.load();
    }});
    //产品名称
    Products_OrgCombo.box.on({'select':function(c,r,n){
        WG.p_id=r[0].get('p_id');
        SUNLINE.baseParams(ticket_ta_store,{ta_pid:WG.p_id});
        ticket_ta_store.currentPage=1;
        ticket_ta_store.load();
        cost_store.removeAll();
        Ext.getCmp('right_history_status').setText("历史报价");
        SUNLINE.baseParams(ticket_store,{t_taid:''});
        ticket_store.load();
    }});
    //选择票价名称  来显示票价价格和成本项目

    ticket_ta_grid.on('select',function(i,v){
        SUNLINE.baseParams(ticket_store,{
            t_taid:v['data']['ta_id'],
            t_product_id: WG.p_id
        });
        ticket_store.currentPage=1;
        ticket_store.load();
        Ext.getCmp('right_history_status').setText("历史报价");
        cost_store.removeAll();
    });
    right_grid.on('select',function(c,r,n){
        var t_id_val=r.data.t_id;
        var t_standards_id_val=r.data.t_standards_id;
        if(t_standards_id_val!=0)t_id_val=t_id_val+','+t_standards_id_val;
        SUNLINE.baseParams(cost_store,{ti_ticket_id:t_id_val,limit:1000});
        cost_store.currentPage=1;
        cost_store.load();
    });

    ziyo_log({ listeners : [{grid: panel, action:'Ticket', pk_id:'t_id'}] });

    new Ext.Viewport({
        layout : 'border',
        items :panel
    });


    


})