WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';

    var thisTitle = '票务管理';
    var td_url = $__app__ + '/TicketBusine/ticket_bus_json';
    var td_field = [{name:"td_id"}];
    var td_store=SUNLINE.GroupingStore(td_url,td_field,{sortInfo:{field:'td_id',direction: "DESC"}, groupField:'td_type'});
    var ri_groupfeatures=Ext.create('Ext.grid.feature.Grouping',{
        groupHeaderTpl: ['',' <div>{name} {[values.rows.length]}条'],
        startCollapsed:false,
        collapsible:true
    });

    function td_site_name_fn(v,c,r){
        var td_start_time='',td_end_time='';
        if(r.get('td_start_time'))td_start_time='('+r.get('td_start_time')+')';
        if(r.get('td_end_time'))td_end_time='('+r.get('td_end_time')+')';
        return '<font color="green">'+r.get('td_fly_num')+'</font> '+r.get('td_start_place')+td_start_time+'—'+r.get('td_end_place')+td_end_time;
    }
    function td_site_time_fn(v,c,r){
        return r.get('td_start_time')+'—'+r.get('td_end_time');
    }
    function td_total_num_fn(v,c,r){
        var td_one_num=parseFloat(r.get('big_num'));
        var td_two_num=parseFloat(r.get('min_num'));
        var td_three_num=parseFloat(r.get('small_num'));
        if(!td_one_num)td_one_num=0;
        if(!td_two_num)td_two_num=0;
        if(!td_three_num)td_three_num=0;
        return (td_one_num+td_two_num+td_three_num);
    }
    function td_total_price_fn(v,c,r){
        var td_one_num=parseFloat(r.get('big_num'))*parseFloat(r.get('big_price'));
        var td_two_num=parseFloat(r.get('min_num'))*parseFloat(r.get('min_price'));
        var td_three_num=parseFloat(r.get('small_num'))*parseFloat(r.get('small_price'));
        if(!td_one_num)td_one_num=0;
        if(!td_two_num)td_two_num=0;
        if(!td_three_num)td_three_num=0;
        var price=(td_one_num+td_two_num+td_three_num);
        if(!price)price=0;
        return '￥'+price.toFixed(2);
    }
    function ticket_num(v){
        if(!v)return 0;
        return v;
    }
    function ticket_type_fn(v){
        if(v=='改签') return '<font color="green">'+v+'</font>';
        if(v=='退票') return '<font color="red">'+v+'</font>';
        return v;
    }
    var td_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"td_id", dataIndex:"td_id", width:60, hidden:true},
        {header:"状态", dataIndex:"td_ticket_type", width:60,renderer:ticket_type_fn},
        {header:"签收日期", dataIndex:"td_to_time", width:100,renderer:td_bu_time_time},
        {header:"票面日期", dataIndex:"td_bu_time", width:100,renderer:td_bu_time_time},
        {header:"车次/起止", dataIndex:"td_num", align:'left',width:220,renderer:td_site_name_fn},
        /*{header:"出发/到达时间", dataIndex:"td_start_time", align:'center',width:110,renderer:td_site_time_fn},*/
        {header:"下铺/商务/头等舱", dataIndex:"big_num", align:'center', width:110,renderer:ticket_num},
        {header:"中铺/一等/硬座/商务舱", dataIndex:"min_num", align:'center', width:110,renderer:ticket_num},
        {header:"上铺/二等/无座/经济舱", dataIndex:"small_num", align:'center', width:110,renderer:ticket_num},
        {header:"总张数", dataIndex:"td_total_num", align:'center',width:90,renderer:td_total_num_fn},
        {header:"手续费", dataIndex:"td_to_price", align:'right',width:80},
        {header:"总金额", dataIndex:"td_total_price",  align:'right',width:100,renderer:td_total_price_fn},
        {header:"出票点", dataIndex:"td_ticket_org", width:120},
        {header:"票务备注", dataIndex:"td_remark", width:100},
        {header:"结算类型", dataIndex:"td_pay_type", width:100}
    ];
    function td_bu_time_time(v,m,r){
        return v.substr(0,4) + '-' + v.substr(4,2) + '-' + v.substr(6,2) ;
    }

    var td_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:td_store,
        style :'border-right-width:1px;border-top:2px solid #009DDA',
        loadMask:{msg:'数据载入中，请稍后'},
        features: [ri_groupfeatures],
        viewConfig:{
            emptyText:'没有票务信息',
            deferEmptyText:true
        },
        columns:td_cm,
        tbar:[
            {text:'添加库存',iconCls:'button-add',disabled:isDisabled('TicketBusine::save'),
                menu:[
                    {text:'添加库存',iconCls:'button-add',handler:td_modify, disabled:isDisabled('TicketBusine::save')},
                    {text:'批量导入',iconCls:'button-add',handler:all_modify, disabled:isDisabled('TicketBusine::save')}
                ]
            },'-',
            {text:'编辑库存', iconCls:'button-edit',id:'edit_id',handler:td_modify, disabled:isDisabled('TicketBusine::edit')},'-',
            {text:'票面改签', iconCls:'button-warning',id:'sign_id',handler:td_modify, disabled:isDisabled('TicketBusine::sign')},'-',
            {text:'退票', iconCls:'button-drop',id:'del_id',handler:td_modify, disabled:isDisabled('TicketBusine::del')},'-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},'-',
            {text:'导出',iconCls:'button-excel',handler:download_excel},'-',
            {text:'刷新',iconCls:'button-ref',handler:function(){
                td_store.load();
            }},'-',
            {text:'停用', iconCls:'button-del',id:'td_status',handler:p_stop_modify, disabled:isDisabled('TicketBusine::t_save'),hidden:true},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'st_dosearch_id',
                emptyText:'票务名称',
                width:150,
                onTriggerClick:function (e) {
                    st_dosearch()
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            st_dosearch()
                        }
                    }
                }
            }
        ],
        listeners:{
            cellclick:function(v,g,n,r){
                var td_status = r.data.td_status;
                switch(td_status){
                    case '正常':
                        Ext.getCmp('td_status').setText("停用");
                        Ext.getCmp('td_status').setIconCls("button-del");
                        break;
                    case '停用':
                    default :
                        Ext.getCmp('td_status').setText("恢复正常");
                        Ext.getCmp('td_status').setIconCls("button-dropyes");
                        break;
                }
            }
        }/*,
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:td_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有票务信息'
        })*/
    });
    function td_del_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择要删除的行！');
            return;
        };
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/select_detail',
            params:{td_id:row.data.td_id},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (info.info=='not_save'){
                    Ext.Msg.alert('友情提示', '该票已出售,不能删除');
                    return false;
                }else{
                    Ext.Msg.confirm('友情提示','您确定删除吗？',function(y){
                        if(y=='yes'){
                            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                            myMask.show();
                            Ext.Ajax.request({
                                url:$__app__ + '/TicketBusine/del',
                                params:{td_id:row.data.td_id},
                                method:'POST',
                                success:function (response, otps) {
                                    var ret = Ext.decode(response.responseText);
                                    var info=ret.info;
                                    Ext.Msg.alert('友情提示',info);
                                    if (ret.status){
                                        td_store.reload();
                                    };
                                    myMask.hide();
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
    function p_stop_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的票务信息！');
            return false;
        }
        var status;
        var sta;
        if(row.data.td_status=='正常'){
            status='停用';
            sta='停用';
        }else{
            status='正常';
            sta='恢复';
        }
        Ext.Msg.confirm('友情提示','您确定要'+sta+'这个票么？',function(y){
            if(y=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/TicketBusine/save',
                    method:'POST',
                    params : {td_status:status,td_id:row.data.td_id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;

                        if (ret.status){
                            if(row.data.td_status=='正常'){
                                Ext.Msg.alert('友情提示','停用成功');
                            }else{
                                Ext.Msg.alert('友情提示','恢复正常');
                            }
                            td_store.reload();
                        }else{
                            Ext.Msg.alert('友情提示',info.msg);
                        }
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }
    function st_dosearch(){
        var key=Ext.getCmp('st_dosearch_id').getValue();
        SUNLINE.baseParams(td_store,{skey:key},true);
        td_store.currentPage=1;
        td_store.load();
    }
    //查看产品
    var p_del_url = $__app__ + '/TicketBusine/p_del';
    var p_del_field = [{name:"p_id"}];
    var p_del_store = new SUNLINE.JsonStore(p_del_url,p_del_field,false,{pageSize:10});
    var p_del_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:p_del_store,
        width:500,
        height:420,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有产品信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:60,header:'全部'}),
            {header:"p_id", dataIndex:"p_id", width:80,hidden:true},
            {header:"产品编号", dataIndex:"p_num", width:80},
            {header:"产品民称", dataIndex:"p_name", width:245},
            {header:"旅游天数", dataIndex:"p_days", width:80}
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            {text:'删除', iconCls:'button-del',handler:del_modify,width:80},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                emptyText:'产品名称',
                cls:'search-icon-cls',
                width:160,
                id:'p_del_dosearch_id',
                onTriggerClick:function (e) {
                    p_del_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            p_del_dosearch();
                        }
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:p_del_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });
    function p_del_dosearch(){
        var key=Ext.getCmp('p_del_dosearch_id').getValue();
        var row=SUNLINE.getSelected(td_grid);
        SUNLINE.baseParams(p_del_store,{td_p_id:row.data.td_p_id,skey:key});
        p_del_store.currentPage=1;
        p_del_store.load();


    }
    var p_del_win=new Ext.Window({
        title:'查看产品',
        width:510,
        height:490,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:[p_del_grid],
        buttons:[
            {text:'关闭', handler:function (){
                p_del_win.hide();
            }}
        ]
    })
    function del_modify(){
        var row=SUNLINE.getSelected(td_grid);
        var rows=p_del_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何产品');
            return;
        }
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/select_detail',
            params:{td_id:row.data.td_id},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (info.info=='not_save'){
                    Ext.Msg.alert('友情提示', '该票已出售,不能删除该票的产品信息');
                    return false;
                }else{
                    var p_id='';
                    for(var i=0;i<rows.length;i++){
                        p_id+=rows[i]['data']['p_id']+',';
                    }
                    p_id=p_id.substr(0,p_id.length-1);
                    var td_pd_va=row.data.td_p_id;
                    td_pd_va=td_pd_va.substr(1,td_pd_va.length-1);

                    Ext.Msg.confirm('友情提示','你确定删除吗？',function(y){
                        if(y=='yes'){
                            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
                            myMask.show();
                            Ext.Ajax.request({
                                url:$__app__ + '/TicketBusine/save',
                                params:{
                                    td_p_id_org:td_pd_va,
                                    td_p_id_del:p_id,
                                    td_id:row.data.td_id
                                },
                                method:'POST',
                                success:function (response, otps) {
                                    myMask.hide();
                                    var ret = Ext.decode(response.responseText);
                                    var info=ret.info;
                                    if(ret.status ==1){
                                        td_store.reload();
                                        Ext.Msg.alert('友情提示','产品信息删除成功');
                                    }else{
                                        Ext.Msg.alert('友情提示',info.msg);
                                    }
                                    p_del_win.hide();
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
    function p_del_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请您先选择要操作的票务');
            return false;
        }
        if(row.data.td_status=='停用'){
            Ext.Msg.alert('提示信息','您选择要操作的票务已经停用了');
            return false;
        }
        p_del_win.show();
        var row=SUNLINE.getSelected(td_grid);
        if(row.data.td_p_id){
            SUNLINE.baseParams(p_del_store,{td_p_id:row.data.td_p_id});
            p_del_store.currentPage=1;
            p_del_store.load();
        }

    }
    p_del_win.on('hide',function(){
        p_del_store.removeAll();
    })
    //适用产品
    var p_url = $__app__ + '/Products/dataJson';
    var p_field = [{name:"p_id"}];
    var p_store = new SUNLINE.JsonStore(p_url,p_field,false,{pageSize:10});
    var p_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:p_store,
        width:500,
        height:420,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有产品信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:60,header:'全部'}),
            {header:"p_id", dataIndex:"p_id", width:80,hidden:true},
            {header:"产品编号", dataIndex:"p_num", width:80},
            {header:"产品民称", dataIndex:"p_name", width:245},
            {header:"旅游天数", dataIndex:"p_days", width:80}
        ],
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            {text:'添加', iconCls:'button-add',handler:p_add_modify,width:80},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                emptyText:'产品名称',
                cls:'search-icon-cls',
                width:160,
                id:'p_dosearch_id',
                onTriggerClick:function (e) {
                    p_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            p_dosearch();
                        }
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:p_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });
    function p_dosearch(){
        var key=Ext.getCmp('p_dosearch_id').getValue();
        SUNLINE.baseParams(p_store,{skey:key});
        p_store.currentPage=1;
        p_store.load();
    }

    var p_win=new Ext.Window({
        title:'选择产品',
        width:510,
        height:490,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:[p_grid],
        buttons:[
            {text:'关闭', handler:function (){
                p_win.hide();
            }}
        ]
    })
    WG.p_id='';
    function p_add_modify(){
        var row=SUNLINE.getSelected(td_grid);
        var rows=p_grid.getSelectionModel().getSelection();
        if(rows.length==0){
            Ext.Msg.alert('友情提示','没有选中任何产品');
            return;
        }
        if(WG.p_id==row.data.td_p_id){
            WG.p_id=row.data.td_p_id;
        }
        if(!WG.p_id){
            WG.p_id=row.data.td_p_id;
        }
        WG.p_id=row.data.td_p_id;
        for(var i=0;i<rows.length;i++){
            WG.p_id+=','+rows[i]['data']['p_id'];
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/save',
            params:{td_p_id:WG.p_id,td_id:row.data.td_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if(ret.status ==1){
                    Ext.Msg.alert('友情提示','产品信息添加成功');
                }else{
                    Ext.Msg.alert('友情提示',info.msg);
                }

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function p_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请您先选择要操作的票务');
            return false;
        }
        if(row.data.td_status=='停用'){
            Ext.Msg.alert('提示信息','您选择要操作的票务已经停用了');
            return false;
        }
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/select_detail',
            params:{td_id:row.data.td_id},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (info.info=='not_save'){
                    Ext.Msg.alert('友情提示', '该票已出售,不能选择产品');
                    return false;
                }else{
                    p_win.show();
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })

    }
    p_win.on('hide',function(){
        p_store.removeAll();
        td_store.load();
        WG.p_id='';
    })
    p_win.on('show',function(){
        p_store.reload();
    });

    var _cof={
        fields:['sd_id','sd_name','sd_code','sd_city'],url:$__app__ + '/StationStart/fen_select',
        where:{box_type:'出发口岸'},
        config:{
            width:150,
            displayField:'sd_name',
            valueField:'sd_name',
            editable:true,
            /*forceSelection:true,*/
            allowBlank:false,
            labelAlign:"right"
        }
    };
    _cof.id='td_start_place';
    _cof.config.fieldLabel="始发站";
    _cof.config.id="td_start_place";
    var td_start_place_OrgCombo=SUNLINE.ComBoxPlus(_cof);
    _cof.id='td_end_place';
    _cof.config.fieldLabel="目的地";
    _cof.config.id="td_end_place";
    var td_end_place_OrgCombo=SUNLINE.ComBoxPlus(_cof);
    var bc_form_grid=SUNLINE.OrgCombo_ticket_company({fieldLabel:"票务公司",name:'td_ticket_org',id:'td_ticket_org',allowBlank:false,labelWidth:80},{forceSelection:false});

    var goto_box=SUNLINE.LocalComob({
        id:'td_type',
        fields:['td_type'],
        data:[['去程'],['返程']],
        config:{
            id:'td_type',
            labelAlign:'right',
            fieldLabel:'往返类型',
            labelWidth:65,
            width:200,
            style:'float:left',
            value:'去程'
        }
    });

    //结算类型
    var pay_type=SUNLINE.LocalComob({
        id:'td_pay_type',
        fields:['td_pay_type'],
        data:[['签单'],['现金']],
        config:{
            id:'td_pay_type',
            labelAlign:'right',
            fieldLabel:'',
            labelWidth:0,
            width:120,
            style:'float:left',
            value:'现金'
        }
    });
    //交通类型
    var td_traffic_type_combo=SUNLINE.LocalComob({
        id:'td_traffic_type',
        fields:['td_traffic_type'],
        data:[['火车'],['飞机']],
        config:{
            id:'td_traffic_type',
            fieldLabel:"",
            labelWidth:0,
            labelAlign:"right" ,
            width:102,
            style:'float:left',
            forceSelection:false,
            value:'火车'
        }
    });

    //手动添加库存信息
    var td_form= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        cls:'form_cm2',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:300 },
            labelWidth:100,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:300,labelAlign:"right" },
                items:[
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '交通类型',
                        combineErrors: false,
                        defaults: { hideLabel: true },
                        items: [
                            td_traffic_type_combo,
                            goto_box
                        ]
                    },
                    {id:"td_id", name:"td_id", fieldLabel:"td_id", maxLength:"10",xtype:"hidden"},
                    {id:"td_handle", name:"td_handle", fieldLabel:"操作类型", maxLength:"10",xtype:"hidden"},
                    {id:"td_fly_num", name:"td_fly_num", fieldLabel:"航班(次)号", maxLength:"50", allowBlank:false,vtype:'NotBlank'},
                    td_start_place_OrgCombo,
                    {id:"td_start_city", name:"td_start_city", fieldLabel:"始发站城市", maxLength:"50",xtype:'hidden'},
                    {id:"td_start_code", name:"td_start_code", fieldLabel:"始发站编号", maxLength:"50",xtype:'hidden'},
                    td_end_place_OrgCombo,
                    {id:"td_end_city", name:"td_end_city", fieldLabel:"目的地城市", maxLength:"50",xtype:'hidden'},
                    {id:"td_end_code", name:"td_end_code", fieldLabel:"目的地编号", maxLength:"50",xtype:'hidden'},
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '票面日期',
                        combineErrors: false,
                        defaults: { hideLabel: true},
                        items: [
                            SUNLINE.ExtDateField({id:'td_bu_time',name:'td_bu_time',labelAlign:"right",fieldLabel:false, allowBlank:false,style:'float:left',width:116,value:int2date(date_val)}),
                            {xtype:'displayfield',id:'date_type',value: '送票日期:',style:'float:left;padding:0 6px'},
                            SUNLINE.ExtDateField({id:'td_to_time',name:'td_to_time',labelAlign:"right",fieldLabel:false, allowBlank:false,width:116,value:int2date(date_val)})
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '出发时间',
                        combineErrors: false,
                        defaults: { hideLabel: true},
                        items: [
                            {id:'td_start_time',name:'td_start_time',xtype:'textfield',width: 117,blankText:"正确认格式:(10:30)",style:'float:left'},
                            {xtype: 'displayfield', value: '抵达时间:',style:'float:left;padding:0 6px'},
                            {id:'td_end_time',name:'td_end_time',xtype:'textfield',width: 117,blankText:"正确认格式:(10:30)"}
                        ]
                    },

                    bc_form_grid.box,
                    {id:"td_toid", name:"td_toid", fieldLabel:"出票点ID", maxLength:"50",xtype:'hidden'},
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '结算类型',
                        combineErrors: false,
                        defaults: { hideLabel: true},
                        items: [
                            pay_type,
                            {xtype: 'displayfield', value: '每张手续:',style:'float:left;padding:0 6px'},
                            {id:"td_to_price", name:"td_to_price", xtype: 'numberfield',width: 115}
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '<span class="help" data-qtip="下铺/商务/头等舱">&nbsp;</span>一级票种',
                        combineErrors: false,
                        defaults: { hideLabel: true },
                        items: [
                            {id:'big_num',name:'big_num', xtype: 'numberfield',width: 60, value:0,style:'float:left',minValue:'0'},
                            {xtype: 'displayfield', value: ' 单票价',style:'float:left;padding:0 6px'},
                            {id:'big_price',name:'big_price',xtype:'numberfield',width: 72, value:0,style:'float:left'},
                            {xtype: 'displayfield', value: ' 单票损',style:'float:left;padding:0 5px'},
                            {id:'big_spoli_price',name:'big_spoli_price',xtype:'numberfield',width: 70, value:0}
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '<span class="help" data-qtip="中铺/一等/硬座/商务舱">&nbsp;</span>二级票种',
                        combineErrors: false,
                        defaults: { hideLabel: true },
                        items: [
                            {id:'min_num',name:'min_num', xtype: 'numberfield',width: 60, value:0,style:'float:left',minValue:'0'},
                            {xtype: 'displayfield', value: ' 单票价',style:'float:left;padding:0 6px'},
                            {id:'min_price',name:'min_price',xtype:'numberfield',width: 72, value:0,style:'float:left'},
                            {xtype: 'displayfield', value: ' 单票损',style:'float:left;padding:0 5px'},
                            {id:'min_spoli_price',name:'min_spoli_price',xtype:'numberfield',width: 70, value:0}
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '<span class="help" data-qtip="上铺/二等/无座/经济舱">&nbsp;</span>三级票种',
                        combineErrors: false,
                        defaults: { hideLabel: true },
                        items: [
                            {id:'small_num',name:'small_num', xtype: 'numberfield',width: 60, value:0,style:'float:left',minValue:'0'},
                            {xtype: 'displayfield', value: ' 单票价',style:'float:left;padding:0 6px'},
                            {id:'small_price',name:'small_price',xtype:'numberfield',width: 72, value:0,style:'float:left'},
                            {xtype: 'displayfield', value: ' 单票损',style:'float:left;padding:0 5px'},
                            {id:'small_spoli_price',name:'small_spoli_price',xtype:'numberfield',width: 70, value:0}
                        ]
                    },
                    {id:"td_remark", name:"td_remark", fieldLabel:"票务备注",height:50, xtype:'textarea'}
                ]
            }
        ]
    });
    td_start_place_OrgCombo.on({
        beforequery:function(){
            site_box_fn(this);
        }
    });
    td_start_place_OrgCombo.on({
        select:function(c,r,e){
            var row=r[0].data;
            Ext.getCmp('td_start_code').setValue(row.sd_code);
            Ext.getCmp('td_start_city').setValue(row.sd_city);
            fly_number_code();
        }
    });
    td_end_place_OrgCombo.on({
        beforequery:function(){
            site_box_fn(this);
        }
    });
    td_end_place_OrgCombo.on({
        select:function(c,r,e){
            var row=r[0].data;
            Ext.getCmp('td_end_code').setValue(row.sd_code);
            Ext.getCmp('td_end_city').setValue(row.sd_city);
            fly_number_code();
        }
    });
    function site_box_fn(t){
        var tf_type=td_traffic_type_combo.getValue();
        if(!tf_type){
            Ext.Msg.alert('友情提示','请选择交通类型!');
            return false;
        }
        SUNLINE.baseParams(t.store,{sd_start_type:tf_type});
    }
    td_traffic_type_combo.on({
        select:function(){
            var tf_type=td_traffic_type_combo.getValue();
            SUNLINE.baseParams(td_start_place_OrgCombo.store,{sd_start_type:tf_type});
            SUNLINE.baseParams(td_end_place_OrgCombo.store,{sd_start_type:tf_type});
            td_start_place_OrgCombo.store.load();
            td_end_place_OrgCombo.store.load();
        }
    });
    bc_form_grid.box.on({
        select:function(c,r,e){
            var row=r[0].data;
            Ext.getCmp('td_toid').setValue(row.org_id);
            Ext.getCmp('td_to_price').setValue(row.org_procedure);
        }
    });
    //航班(次)号移时间操作
    Ext.getCmp('td_fly_num').on({ blur:function(t,e,o){ fly_number_code(); }});
    Ext.getCmp('td_start_code').on({ blur:function(t,e,o){ fly_number_code(); }});
    Ext.getCmp('td_end_code').on({ blur:function(t,e,o){ fly_number_code(); }});
    function fly_number_code(){
        var number=Ext.getCmp('td_fly_num').getValue();
        var start_code=Ext.getCmp('td_start_code').getValue();
        var end_code=Ext.getCmp('td_end_code').getValue();
        if(!number || !start_code || !end_code)return false;
        var post={fl_number:number,start_code:start_code,end_code:end_code};
        Ext.Ajax.request({
            url:$__app__ + '/Widget/train_fly_find',
            params:post,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var rows=ret.info;
                if (ret.status){
                    td_start_place_OrgCombo.setValue(rows.fl_start_name);
                    Ext.getCmp('td_start_city').setValue(rows.fl_start_city);
                    Ext.getCmp('td_start_code').setValue(rows.fl_start_code);
                    td_end_place_OrgCombo.setValue(rows.fl_end_name);
                    Ext.getCmp('td_end_city').setValue(rows.fl_end_city);
                    Ext.getCmp('td_end_code').setValue(rows.fl_end_code);
                    Ext.getCmp('td_start_time').setValue(rows.fl_start_time);
                    Ext.getCmp('td_end_time').setValue(rows.fl_end_time);
                    var big_price= 0,min_price=0,small_price=0;
                    if(rows.fl_money_one)big_price=rows.fl_money_one;
                    if(rows.fl_money_two)min_price=rows.fl_money_two;
                    if(rows.fl_money_three)small_price=rows.fl_money_three;
                    Ext.getCmp('big_price').setValue(big_price);
                    Ext.getCmp('min_price').setValue(min_price);
                    Ext.getCmp('small_price').setValue(small_price);
                };
            }
        })
    }
    var td_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:td_form,
        buttons:[
            {text:'保存',id:'dosave_id', handler:td_dosave},
            {text:'关闭', handler:function () { td_win.hide();},style:'margin-right:15px;'}
        ]
    });

    function td_dosave(t){
        if (!td_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        var data= td_form.getForm().getValues();
        if(data['td_start_place']==data['td_end_place']){
            Ext.Msg.alert('友情提示', '出发地和目的地不能一致');
            return;
        }
        Ext.MessageBox.confirm('友情提示','你确认需要【'+ t.text+'】操作吗?',function(y){
            if(y!='yes')return false;
            var url=$__app__ + '/TicketBusine/save';
            if(t.text=='确认票面改签' || t.text=='确认退票') url=$__app__ + '/TicketBusine/ticket_sing_del';
            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
            myMask.show();
            Ext.Ajax.request({
                url:url,
                params:data,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    Ext.Msg.alert('友情提示',info);
                    if (ret.status){
                        td_store.reload();
                        td_win.hide();
                    };
                    myMask.hide();
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });

    }
    function td_modify(v){
        var _from=td_form.getForm();
        var readonly_yes=['td_traffic_type','td_type','td_fly_num',
            'td_start_place','td_end_place','td_bu_time','td_ticket_org','td_to_price',
            'big_num','big_price','big_spoli_price',
            'min_num','min_price','min_spoli_price',
            'small_num','small_price','small_spoli_price','td_traffic_type'];
        var readonly_no=[],rows={};
        if(v.text=='编辑库存' || v.text=='票面改签' || v.text=='退票'){
            var row=SUNLINE.getSelected(td_grid);
            if(!row){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            rows=row.data;
            if(rows.td_bu_time.length<=8) rows.td_bu_time=td_bu_time_time(rows.td_bu_time);
            if(rows.td_to_time.length<=8) rows.td_to_time=td_bu_time_time(rows.td_to_time);
            rows.td_handle='编辑';
            if(v.text=='票面改签'){
                //交通类型、往返类型、始发站不可修改
                //readonly_yes=[];
                readonly_no=['td_traffic_type','td_type','td_start_place'];
                Ext.getCmp('date_type').setValue('改签日期:');
                rows.td_handle='改签';
            }else if(v.text=='退票'){
                //除了票数、票损、备注；其他都不可修改
                readonly_no=['td_traffic_type','td_type','td_fly_num',
                    'td_start_place','td_end_place','td_bu_time','td_ticket_org','td_to_price','big_price',
                    'min_price','small_price','td_traffic_type'];
                readonly_yes=['big_num','big_spoli_price','min_num','min_spoli_price','small_num','small_spoli_price'];
                Ext.getCmp('date_type').setValue('退票日期:');
                rows.td_handle='退票';
            }else if(v.text=='编辑库存'){
                readonly_no=['td_traffic_type','td_type','td_fly_num',
                    'td_start_place','td_end_place','td_bu_time','td_ticket_org','td_to_price','big_spoli_price',
                    'min_spoli_price','small_spoli_price','td_traffic_type'];
                readonly_yes=['big_num','big_price','min_num','min_price','small_num','small_price'];
                rows.big_num=rows.ol_big_num;
                rows.min_num=rows.ol_min_num;
                rows.small_num=rows.ol_small_num;
            }
            //需要有最大值
            if(v.text=='票面改签' || v.text=='退票'){
                Ext.getCmp('big_num').setMaxValue(rows.big_num);
                Ext.getCmp('min_num').setMaxValue(rows.min_num);
                Ext.getCmp('small_num').setMaxValue(rows.small_num);
                rows.td_remark='';
                rows.td_to_time=td_bu_time_time(date_val);
            }
        }else{
            _from.reset();
            readonly_no=['big_spoli_price','min_spoli_price','small_spoli_price'];
            rows.td_handle='添加';
            Ext.getCmp('big_num').setMaxValue(1000);
            Ext.getCmp('min_num').setMaxValue(1000);
            Ext.getCmp('small_num').setMaxValue(1000);
        }
        console.log(1111)
        if(readonly_no.length>0)Ext.each(readonly_no,function(v,i){ Ext.getCmp(v).setReadOnly(true); });
        if(readonly_yes.length>0){
            Ext.each(readonly_yes,function(v,i){
                if(in_array(v,readonly_no)!=-1){
                    Ext.getCmp(v).setReadOnly(true);
                }else{
                    Ext.getCmp(v).setReadOnly(false);
                }
            });
        }
        _from.setValues(rows);
        td_win.show();
        td_win.setTitle(v.text+"票务信息", v.iconCls);
        Ext.getCmp('dosave_id').setText('确认'+v.text);
        if(v.text=='票面改签' || v.text=='退票')sign_del_spoli_price();
    }

    //票损金额系统计算
    function sign_del_spoli_price(v){
        var to_time=Ext.getCmp('td_to_time').getValue();
        var to_date=Ext.getCmp('td_bu_time').getValue();
        var handle=Ext.getCmp('td_handle').getValue();
        var be_date=(to_date.getTime()-to_time.getTime())/1000;
        var days=24*3600;
        if(handle!='改签' && handle!='退票')return false;
        var spoli_price={
            big_price:'big_spoli_price',
            min_price:'min_spoli_price',
            small_price:'small_spoli_price'
        };
        for(var val in spoli_price){
            var price=parseFloat(Ext.getCmp(val).getValue()),money=0;
            if(price==0 || !price)continue;
            if(be_date<=days){
                //1天内需要收20%
                money=price*0.2;
            }else if(be_date>days && be_date<=2*days){
                //1天—2天内需要收10%
                money=price*0.1;
            }else if(be_date>2*days && be_date<=15*days){
                //2天—15天内需要收5%
                money=price*0.05;
            }
            Ext.getCmp(spoli_price[val]).setValue(money);
        }
    }

    //修改改签、退票日期时计划票损
    Ext.getCmp('td_to_time').on({
        change:function(f,v){
            sign_del_spoli_price(v);
        }
    });

    //余标票面改签 (start)
    var sign_form= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:200 },
            labelWidth:100,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                items:[
                    {id:"sign_td_id", name:"td_id", fieldLabel:"td_id", maxLength:"10",xtype:"hidden"},
                    {id:"sign_fly_num", name:"td_fly_num", fieldLabel:"航班(次)号", maxLength:"50", readOnly:true},
                    {id:"sign_big_num", name:"big_num", fieldLabel:'<span class="help" data-qtip="下铺/商务/头等舱">&nbsp;</span>一级票务', maxLength:"50",readOnly:true},
                    {id:"sign_min_num", name:"min_num", fieldLabel:'<span class="help" data-qtip="中铺/一等/硬座/商务舱">&nbsp;</span>二级票务', maxLength:"50",readOnly:true},
                    {id:"sign_small_num", name:"small_num", fieldLabel:'<span class="help" data-qtip="上铺/二等/无座/经济舱">&nbsp;</span>三级票务', maxLength:"50",readOnly:true},
                    {id:"sign_start_code", name:"td_bu_time", fieldLabel:"票面日期", maxLength:"50",readOnly:true},
                    SUNLINE.ExtDateField({id:'td_old_date',name:'td_old_date',labelAlign:"right",fieldLabel:"改签日期"}),
                    {id:"sign_name", name:"td_remark", fieldLabel:"改签备注",xtype:'textarea',height:50}
                ]
            }
        ]
    });
    var sign_win= new Ext.Window({
        title:'为存余票改签',
        width:300,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:sign_form,
        buttons:[
            {text:'确认改签',handler:confirm_sign},
            {text:'关闭', handler:function () {
                sign_win.hide();
            }}
        ]
    });

    function sign_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要改签的票务信息!');
            return false;
        }
        sign_win.show();
        var rows=row.data;
        var form_data={
            td_id:rows.td_id,
            td_fly_num:rows.td_fly_num+' ('+rows.td_start_place+' — '+rows.td_end_place+')',
            big_num:rows.big_num,
            min_num:rows.min_num,
            small_num:rows.small_num,
            td_bu_time:int2date(rows.td_bu_time)
        };
        var _sign_form=sign_form.getForm();
        _sign_form.setValues(form_data);
    }

    function confirm_sign(){
        var _sign_form=sign_form.getForm();
        if (!_sign_form.isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        Ext.MessageBox.confirm('友情提示','你确认需要改签当前班次吗?',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
            myMask.show();
            var post_data=_sign_form.getValues();
            Ext.Ajax.request({
                url:$__app__ + '/TicketBusine/confirm_sign_save',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    Ext.Msg.alert('友情提示',info);
                    if (ret.status){
                        td_store.reload();
                        sign_win.hide();
                    };
                    myMask.hide();
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });
    }


    //批量导入游客信息(start)
    var all_win= new Ext.Window({
        title:'批量导入票务',
        width:260,
        height:180,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        html : '<iframe src="" id="_print_frm" name="_print_frm" frameborder="0" width="100%" height="100%"></iframe>',
        buttons:[
            {text:'关闭', handler:function () {
                all_win.hide();
            }}
        ]
    });

    function all_modify(){
        all_win.show();
        var url = $__app__ + '/TicketBusine/all_upload';
        window._print_frm.location = url;
    }

    //创建大交通浏览表
    var flyStore=Ext.create('Ext.data.Store', {
        storeId: 'batchStore',
        fields:[],data: []
    });

    function fly_num_fn(v){
        if(!v)return 0;
        return v;
    }

    //删除项目
    function items_del(){
        return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
    };
    var fly_cm=[
        {header:"", dataIndex:"items_del", width:25,renderer:items_del},
        {header:"送票日期", dataIndex:"td_to_time", width:80},
        {header:"票面日期", dataIndex:"td_bu_time", width:80},
        {header:"车次/起止", dataIndex:"td_fly_num",align:'left', width:220,renderer:td_site_name_fn},
        {header:"下铺/商务", dataIndex:"big_num",align:'center',width:90,renderer:fly_num_fn},
        {header:"中铺/一等", dataIndex:"min_num",align:'center', width:100,renderer:fly_num_fn},
        {header:"上铺/二等", dataIndex:"small_num",align:'center', width:100,renderer:fly_num_fn},
        {header:"总张数", dataIndex:"td_total_num", width:90,align:'center',renderer:td_total_num_fn},
        /*{header:"总金额", dataIndex:"td_total_price", width:90,align:'right',renderer:td_total_price_fn},*/
        {header:"出票点", dataIndex:"td_ticket_org", width:100},
        {header:"结算类型", dataIndex:"td_pay_type", width:80},
        {header:"交通类型", dataIndex:"td_traffic_type", width:80,hidden:true},
    ];
    var fly_grid=new Ext.grid.GridPanel({
        store:flyStore,
        columns:fly_cm,
        region:'center',
        autoScroll:true,
        bodyBorder: false,
        height:370,
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        }
    });

    var FlyWin = new Ext.Window({
        title : '确认批量导入信息',
        width : 1000,
        height : 450,
        modal : true,
        fixed:true,
        closeAction : 'hide',
        items:fly_grid,
        buttons:[
            {text:'确认保存',handler:add_all_busine},
            {text:'返回导入',handler:function(){
                all_win.show();
                FlyWin.hide();
            }},
            {text:'关闭', handler:function () {
                FlyWin.hide();
            }}
        ]
    });

    fly_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            if(c==0){
                var _row=SUNLINE.getSelected(fly_grid);
                flyStore.remove(_row);
            }
        }
    });
    
    window.grid_all_excel=function(r){
        var rows= r.root;
        flyStore.removeAll();
        for(var i=0;i< r.total;i++){
            flyStore.add(rows[i]);
        }
        all_win.hide();
        FlyWin.show();
    };

    function add_all_busine(b){
        var data=[];
        flyStore.each(function(v){
            var row= v.data;
            data.push(row);
        });
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/numbers_stock',
            params:{rows:Ext.encode(data)},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info);
                if (ret.status){
                    td_store.reload();
                    FlyWin.hide();
                };
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    //添加表单
    var province_combo=SUNLINE.ComBoxCity({id:'st_province',config:{fieldLabel:"省份",labelWidth:100,labelAlign:"right",allowBlank:false},where:{city_type:'province'},actionTo:'st_city'});
    var city_combo=SUNLINE.ComBoxCity({id:'st_city',config:{fieldLabel:"城市",labelWidth:100,labelAlign:"right",allowBlank:false},where:{city_type:'city'},appTo:'st_province'});
    var county_combo=SUNLINE.ComBoxCity({id:'st_county',config:{fieldLabel:"区/县",labelWidth:100,labelAlign:"right",allowBlank:false},where:{city_where:'county'},appTo:'st_city'});
    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"st_id", name:"st_id", fieldLabel:"ID", maxLength:"10", allowBlank:false, xtype:"hidden",labelAlign:"right"},
            {id:"st_name", name:"st_name", fieldLabel:"出发地点", maxLength:"100",labelAlign:"right",allowBlank:false,vtype:'NotBlank'},
            {
                xtype:"combo",
                id:"st_type",
                name:"st_type",
                fieldLabel:"类型",
                allowBlank:false,
                labelAlign:"right",
                store:new Ext.data.SimpleStore({fields:['st_type'], data:[
                    ['班车站'],
                    ['顺路站']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"st_type",
                displayField:"st_type",
                mode:"local",
                value:'班车站'
            },
            province_combo,
            city_combo,
            county_combo
        ]
    });
    td_win.on('hide',function(){
        td_form.form.reset();
    })


    /*右边*/
    var tbd_url = $__app__ + '/TicketBuDetail/dataJson';
    var tbd_fld = [{name:"sp_id"} ];
    var tbd_store = new SUNLINE.JsonStore(tbd_url,tbd_fld,false);
    var tbd_cm=[
        new Ext.grid.RowNumberer({width:30}),
        //{xtype:'rownumberer',width:100},
        {header:"tbd_id",dataIndex:"tbd_id",width:60, hidden: true},
        {header:"tbd_tb_id",dataIndex:"tbd_tb_id",width:60, hidden: true},
        {header:"类型",dataIndex:"tbd_type",width:100},
        {header:"总数",dataIndex:"tbd_num",align:'center',width:60},
        {header:"已售",dataIndex:"tbd_sold_num",align:'center',width:60},
        {header:"单价",dataIndex:"tbd_price",align:'right',width:80,renderer:function(v){
            return '￥'+v;
        }}
    ];

    var tbd_grid = new Ext.grid.GridPanel({
        region:'east',
        border:false,
        collapsed:true,
        split : {size:3},
        width : 400,
        maxWidth : 800,
        minWidth : 350,
        store:tbd_store,
        style :'border-left-width:1px;border-top:2px solid #009DDA',
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '暂无该票务明细信息',
            deferEmptyText : true
        },
        columns:tbd_cm,
        tbar:[
            {iconCls:'button-sch',text:'查看销售明细',handler:sch_modify},
            {text:'收起',iconCls:'button-structure',handler:function(){
                tbd_grid.collapse();
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:tbd_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有该票务明细信息'
        })
    });
    var sch_url=$__app__+'/TicketBusine/sch_select';
    var sch_field=['ti_id'];
    var sch_store=SUNLINE.GroupingStore(sch_url,sch_field,{sortInfo:{field:'s_id',direction: "DESC"}, groupField:'s_o_number'});
    var groupingFeature = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "订单编号:{name} (共 {[values.rows.length]} 条)"
    });
    var sch_cm=[
        new Ext.grid.RowNumberer(),
        {header:"s_id", dataIndex:"s_id", width:50, hidden:true},
        {header:"s_o_number", dataIndex:"s_o_number", width:100, hidden:true},
        {header:"游客姓名", dataIndex:"s_vip_name", width:100},
        {header:"游客手机号", dataIndex:"s_vip_mob", width:100},
        {header:"游客证件", dataIndex:"s_vip_card", width:160},
        {header:"出发日期", dataIndex:"s_start_date", width:120,renderer:function(v){
            return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
        }},
        {header:"订单号", dataIndex:"s_o_number",width:175,renderer:function(v,i,r){
        var url = $__app__+"/OrderDetail/index/id/"+v;
        return '<a href = "'+url+'" target = "_blank">'+v+'</a>';
        }}
    ]
    //查看销售明细
    var sch_grid=new Ext.grid.GridPanel({
        region:'center',
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: sch_store,//数据源
        columns: sch_cm,//表格列定义
        height : 477,
        features: [groupingFeature],
        autoScroll : true,
        modal : true,
        closeAction : 'hide',
        layout : 'fit',
        minWidth:200,
        minHeight:100,
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:sch_store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有销售明细信息'
        })
    });
    var sch_win=new Ext.Window({
        title:'查看销售明细',
        width:700,
        height:477,
        mixWidth:200,
        mixHeight:100,
        closeAction:'hide',
        autoScroll : true,
        layout : 'fit',
        maximizable : true,//全屏效果
        modal:true,
        items:[sch_grid],
        buttons:[
            {text:'关闭',handler:function(){
                sch_win.hide();
            }}
        ]
    })
    sch_win.on('show',function(){
        var row=SUNLINE.getSelected(tbd_grid);
        SUNLINE.baseParams(sch_store,{tbd_id:row.data.tbd_id});
        sch_store.currentPage=1;
        sch_store.load();
    })
    function sch_modify(){
        var row=SUNLINE.getSelected(tbd_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请您先选择要操作的库存明细');
            return false;
        }
        sch_win.show();

    }
    var tbd_type_combo=SUNLINE.DictComBox_false({fieldLabel:"铺位等级",name:'tbd_type',allowBlank:false,labelAlign:"right"},{'d_type':'火车铺位'});
    var tbd_form= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:200 },
            labelWidth:60,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:140,labelAlign:"right" },
                items:[
                    {id:"tbd_id", name:"tbd_id", fieldLabel:"tbd_id", maxLength:"10",xtype:"hidden"},
                    {id:"tbd_tb_id", name:"tbd_tb_id", fieldLabel:"tbd_tb_id", maxLength:"10",xtype:'hidden'},
                    tbd_type_combo.box,
                    {id:"tbd_num", name:"tbd_num", fieldLabel:"总数", maxLength:"50", xtype:'numberfield',allowBlank:false,vtype:'NotBlank'},
                    //{id:"tbd_sold_num", name:"tbd_sold_num", fieldLabel:"已售数量", xtype:'numberfield',maxLength:"50", allowBlank:false,vtype:'NotBlank'},
                    {id:"tbd_price", name:"tbd_price", fieldLabel:"单价",xtype:'numberfield', maxLength:"50", allowBlank:false,vtype:'NotBlank'}
                ]
            }
        ]
    });
    var tbd_win= new Ext.Window({
        width:320,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:tbd_form,
        buttons:[
            {text:'保存', handler:tbd_dosave},
            {text:'关闭', handler:function () {
                tbd_win.hide();
            }}
        ]
    });

    tbd_win.on({
        show:function(){
            var row=SUNLINE.getSelected(td_grid);
            Ext.getCmp('tbd_tb_id').setValue(row.data.td_id);
        }
    });

    function tbd_dosave(){
        if (!tbd_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(td_grid);
        var data= tbd_form.getForm().getValues();
        //data['tbd_tb_id']=row.data.td_id;
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/ticket_bus_detail',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info);
                if (ret.status){
                    tbd_store.reload();
                    tbd_win.hide();
                };

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function tbd_modify(v){
        var row=SUNLINE.getSelected(td_grid);
        if(!row){
            Ext.Msg.alert('提示信息','请您先选择要操作的票务');
            return false;
        }
        if(row.data.td_status=='停用'){
            Ext.Msg.alert('提示信息','您选择要操作的票务已经停用了');
            return false;
        }
        tbd_win.show();
        tbd_win.setTitle('添加票务明细', v.iconCls);
    }
    tbd_win.on('hide',function(){
        tbd_form.form.reset();
    })
    td_grid.on('select',function(i,v){
        var row=SUNLINE.getSelected(td_grid);
        var key=row.data.td_traffic_type+'座位';
        var store=tbd_type_combo.box.getStore();
        SUNLINE.baseParams(store,{'d_type':key});
        store.load();
        SUNLINE.baseParams(tbd_store,{tbd_tb_id:row.data.td_id});
        tbd_store.currentPage=1;
        tbd_store.load();

        //改签票不能再次改签与编辑
        if(row.data.td_ticket_type=='改签'){
            Ext.getCmp('edit_id').setDisabled(true);
            Ext.getCmp('sign_id').setDisabled(true);
            Ext.getCmp('del_id').setDisabled(isDisabled('TicketBusine::del'));
        }else if(row.data.td_ticket_type=='退票'){
            Ext.getCmp('edit_id').setDisabled(true);
            Ext.getCmp('sign_id').setDisabled(true);
            Ext.getCmp('del_id').setDisabled(true);
        }else{
            //TicketBusine
            Ext.getCmp('edit_id').setDisabled(isDisabled('TicketBusine::edit'));
            Ext.getCmp('sign_id').setDisabled(isDisabled('TicketBusine::sign'));
            Ext.getCmp('del_id').setDisabled(isDisabled('TicketBusine::del'));
        }
        //退票后所有操作都不可以操作
        if(tbd_grid.getCollapsed())tbd_grid.expand();

    });
    td_store.on('load',function(){
        tbd_store.removeAll();
    })




    //新拖拽产品
    var new_add_url = $__app__ + '/TicketBusine/select_pro';
    var new_add_field = [{name:"p_id"}];
    var new_add_store = new SUNLINE.JsonStore(new_add_url,new_add_field,false);
    var new_add_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"p_id", dataIndex:"p_id", width:80,hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:150},
        {header:"产品民称", dataIndex:"p_name", width:245},
        {header:"天数", dataIndex:"p_days", width:74,align:'center',renderer:function(v){
            return v+'天'
        }}
    ]
    var new_add_check={
        xtype: 'checkboxgroup',
        fieldLabel: ' ',
        columns: 1,
        id:'new_add_check_id',
        labelSeparator:' ',
        labelWidth:0,
        vertical: true,
        items: [
            {boxLabel: '适用全部产品',id:'new_add_check_1', name: 'new_add_check', inputValue: '1'}
        ]
    }

    var new_add_grid=Ext.create('Ext.grid.Panel', {
        region:'west',
        width:510,
        store: new_add_store,
        columns: new_add_cm,
        tbar:[
            new_add_check,
            '->',
            {text:'加入到选择中', iconCls:'button-edit',handler:new_add_dosave}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:new_add_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });

    var new_have_url = $__app__ + '/TicketBusine/del_pro';
    var new_have_field = [{name:"p_id"}];
    var new_have_store = new SUNLINE.JsonStore(new_have_url,new_have_field,false,{pageSize:1000});
    var new_have_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"p_id", dataIndex:"p_id", width:80,hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:150},
        {header:"产品民称", dataIndex:"p_name", width:245},
        {header:"天数", dataIndex:"p_days", width:74,align:'center',renderer:function(v){
            return v+'天'
        }}
    ]
    var new_have_grid=Ext.create('Ext.grid.Panel', {
        region:'center',
        store: new_have_store,
        style:'border-left:2px solid #008DC4',
        columns: new_have_cm,
        tbar:[
            '<b style="color:#3892d3">已选择的产品</b>',
            '->',
            {text:'删除所选择项目', iconCls:'button-edit',handler:new_add_dosave}
        ]/*,
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:new_have_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'  '
        })*/
    });
    function new_add_dosave(e){
        var row=SUNLINE.getSelected(new_have_grid);
        var msg='移除';
        if(e.text=='加入到选择中'){
            row=SUNLINE.getSelected(new_add_grid);
            msg='加入';
        }
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要'+msg+'的产品!');
            return false;
        }
        add_remove_store(row,msg);
    }
    var new_win=Ext.create('Ext.window.Window', {
        title: '选择产品',
        autoHeight:true,
        closeAction : 'hide',
        resizable:false,
        fixed:true,
        modal:true,
        height:500,
        //height:400,
        width: 1030,
        layout: 'border',
        items: [ new_add_grid,new_have_grid],
        buttons:[
            {text:'保存', handler:new_save},
            {text:'关闭', handler:function () {
                new_win.hide();
            }}
        ]
    });
    new_win.on('show',function(){
        var row=SUNLINE.getSelected(td_grid);
        if(row.data.td_num=='-1'){
            Ext.getCmp('new_add_check_1').setValue('1');
        }
        SUNLINE.baseParams(new_add_store,{td_p_id:row.data.td_p_id});
        new_add_store.currentPage=1;
        new_add_store.load();
        SUNLINE.baseParams(new_have_store,{td_p_id:row.data.td_p_id});
        new_have_store.currentPage=1;
        new_have_store.load();
        WG.num='one_load';
    })
    new_win.on('hide',function(){
        WG.num='more_load';
        Ext.getCmp('new_add_check_1').setValue('2');
    })
    new_add_store.on('load',function(){
        if(WG.num!='one_load'){
            var p_id='';
            new_have_store.each(function(v,i){
                p_id+= v.data.p_id+',';
            })
            SUNLINE.baseParams(new_add_store,{td_p_id:p_id});
            new_add_store.currentPage=1;
        }else{
            WG.num='more_load';
        }
    })
    new_add_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            add_remove_store(r,'加入');
        }
    });
    new_have_grid.on({
        celldblclick:function(t, td, c, r, tr, ri, e, opt){
            add_remove_store(r,'移除');
        }
    });
    //加入或加入景点项目
    function add_remove_store(row,type){
        var new_add_check_val=Ext.getCmp('new_add_check_id').getValue();
        if(new_add_check_val['new_add_check']==1){
            Ext.Msg.alert('友情提示','该库存已经适用所有产品，不能够再添加或移除产品了');
        }
        if(type=='移除'){
            new_add_store.add(row);
            new_have_store.remove(row);
        }else{
            var p_id=[];
            new_have_store.each(function(v,i){
                p_id[i]= v.data.p_id;
            })
            if(in_array(row.data.p_id,p_id)==-1){
                var data={
                    p_days: row.data.p_days,
                    p_id: row.data.p_id,
                    p_name: row.data.p_name,
                    p_num: row.data.p_num
                }
                new_have_store.add(data);
            }
            new_add_store.remove(row);
        }
    }

    function new_save(){
        var new_add_check_val=Ext.getCmp('new_add_check_id').getValue();
        var p_id='';
        var td_num_val='';
        if(new_add_check_val['new_add_check']==1){
            p_id='-1';
            td_num_val='-1';
        }else{
            new_have_store.each(function(v,i){
                p_id+= v.data.p_id+',';
            })
            if(p_id.length){
                p_id=p_id.substr(0,p_id.length-1);
                if(!p_id.split(",")[0]){
                    td_num_val=p_id.split(",")['length'];
                }else{
                    td_num_val=0;
                }
            }else{
                td_num_val=0;
            }
        }
        var row=SUNLINE.getSelected(td_grid);
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TicketBusine/save_pro',
            params:{td_p_id:p_id,td_num:td_num_val,td_id:row.data.td_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', result.info.msg);
                if(result.info){
                    new_win.hide();
                    td_store.reload();
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        })
    }
    function new_modify(){
        var row=SUNLINE.getSelected(td_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请你选择操作的行！');
            return;
        };
        new_win.show();
    }


    //搜索条件区域 （start）
    //票种类型Box
    var plan_status_box=SUNLINE.LocalComob({
        id:'fly_type',
        fields:['fly_type'],
        data:[['全部'],['火车'],['飞机']],
        config:{
            fieldLabel:'交通类型',
            labelWidth:60,
            width:150,
            value:'全部'
        }
    });

    //票务类型
    var ticket_type_box=SUNLINE.LocalComob({
        id:'ticket_type',
        fields:['ticket_type'],
        data:[['全部'],['正常'],['改签'],['退票']],
        config:{
            id:'ticket_type',
            fieldLabel:"票务类型",
            labelWidth:60,
            width:140,
            value:'全部'
        }
    });

    //签收日期
    var sign_time=SUNLINE.ExtDateField({
        id:'sign_time',
        width:110,
        labelWidth:0,
        name:'sign_time',
        fieldLabel:":",
        allowBlank:true,
        format: 'Y-m-d'
    });
    //票面日期
    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        allowBlank:true,
        fieldLabel:":",
        format: 'Y-m-d'
    });
    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[td_grid,tbd_grid],
        tbar:[
            plan_status_box,'-',
            '始发站:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'start_site_id',to_id:'start_id',width:80},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'start_id'},
            '-',
            '目的地:',
            {xtype:'textfield',emptyText:'全部始发站',text:'选择始发站',id:'end_site_id',to_id:'end_id',width:80},
            {xtype:'hidden',emptyText:'全部始发站ID',id:'end_id'},
            '-',
            '签收日期:',sign_time,'-',
            '票面日期:',start_time,'-',
            ticket_type_box,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            {text:'清空',handler:sreach_del},
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){parent.CloseTab()}}
        ]
    });

    SUNLINE.WhereMulti({select_data:['start_site_id','end_site_id'],status_box:plan_status_box});

    function selectInfo(){
        var post=where_detail();
        SUNLINE.baseParams(td_store,post);
        td_store.load();
    };

    //得到搜索条件
    function where_detail(){
        //签收日期
        var sign_time_v=Ext.Date.format(sign_time.getValue(),'Ymd');
        //票面日期
        var start_time_v=Ext.Date.format(start_time.getValue(),'Ymd');
        var status_box=plan_status_box.getValue();
        var start_id=Ext.getCmp('start_id').getValue();
        var end_id=Ext.getCmp('end_id').getValue();
        var ticket_type=Ext.getCmp('ticket_type').getValue();
        var post={};
        if(sign_time_v)post.sign_time=sign_time_v;
        if(start_time_v)post.start_time=start_time_v;
        if(status_box)post.status_box=status_box;
        if(start_id)post.start_id=start_id;
        if(end_id)post.end_id=end_id;
        if(ticket_type)post.ticket_type=ticket_type;
        return post;
    }

    function sreach_del(){
        sign_time.setValue('');
        start_time.setValue('');
        plan_status_box.setValue('全部')
    };

    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出库存信息吗?',function(y){
            if(y!='yes')return false;
            var post=where_detail();
            var key=Ext.getCmp('st_dosearch_id').getValue();
            var url='';
            if(post.sign_time)url+='/sign_time/'+post.sign_time;
            if(post.start_time)url+='/start_time/'+post.start_time;
            if(post.status_box)url+='/status_box/'+post.status_box;
            if(post.start_id)url+='/start_id/'+post.start_id;
            if(post.end_id)url+='/end_id/'+post.end_id;
            if(key)url+='/skey/'+key;
            if(post.ticket_type)url+='/ticket_type/'+post.ticket_type;
            window.location = $__app__+'/TicketBusine/ticket_bus_excel'+url;
        });
    }

    ziyo_log({ listeners : [{grid: td_grid, action:'TicketBusine', pk_id:'td_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [Panel]
    });
});