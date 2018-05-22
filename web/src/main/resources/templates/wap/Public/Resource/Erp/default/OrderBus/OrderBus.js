WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '订单交通';

    var pageSize=50;

    var ob_url = $__app__ + '/OrderBus/ob_select';
    var ob_field = [{name:"ob_id"}];
    //var ob_store = new SUNLINE.JsonStore(ob_url, ob_field);
    var ob_store;
    if(push_o_numver){
        ob_store=SUNLINE.GroupingStore(ob_url,ob_field,{sortInfo:{field:'ob_id',direction: "DESC"}, groupField:'ob_goto_type'},false,'',pageSize);
    }else{
        ob_store=SUNLINE.GroupingStore(ob_url,ob_field,{sortInfo:{field:'ob_id',direction: "DESC"}, groupField:'o_number'},false,'',pageSize);
    }
    var grouping_store = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个人)"
    });
    var ob_store_export = new SUNLINE.JsonStore(ob_url, ob_field,false);

    var ob_cm =[
        {header:"ob_id", dataIndex:"ob_id", width:50, hidden:true},
        {header:"ob_oid", dataIndex:"ob_oid", width:50, hidden:true},
        {header:"ob_sid", dataIndex:"ob_sid", width:50, hidden:true},
        {header:"ob_pid", dataIndex:"ob_pid", width:50, hidden:true},
        {header:"ob_tid", dataIndex:"ob_tid", width:50, hidden:true},
        {header:"ob_org_id", dataIndex:"ob_org_id", width:50, hidden:true},
        {header:"状态", dataIndex:"ob_status", width:60,renderer:function(v,m,r){
            if(v=='未出票'){
                return '<b style="color:#ca0000" class="div">'+v+'</b>';
            }else if(v=='已出票'){
                return '<span style="color:green" class="div">'+v+'</span>';
            }else if(v=='已退票'){
                return '<span style="color:#ddd" class="div">'+v+'</span>';
            }else{
                return '<span style="color:green" class="div">'+v+'</span>';
            }
        }},
        {header:"往返", dataIndex:"ob_goto_type", width:50,renderer:function(v,m,r){
            return '<div class="div">'+v+'</div>';
        }},
        {header:"订单类型", dataIndex:"s_o_type", width:80,renderer:function(v,m,r){
            return '<div class="div">'+v+'</div>';
        }},
        {header:"订单编号", dataIndex:"o_number", width:155,renderer:function(v,m,r){
            if(r.get('s_ticket_type')=='全陪票' && r.get('s_o_type')=='跟团游'){
                return '<font color="#999">全陪大交通无订单信息</font>';
            }else{
                return '<div class="div" title="点击查看订单详情>>>" style="color: #0000ff;cursor: pointer" onclick="OrderDetail(\''+v+'\')">'+v+'</div>';
            }
        }},
        {header:"票价名称", dataIndex:"s_tname", width:100,renderer:function(v,m,r){
            return '<div class="div">'+v+'</div>';
        }},
        {header:"游客信息", dataIndex:"s_vip_name", width:200,renderer:function(v,m,r){
            return '<div>' +
                '<div class="name-left">'+v+'</div>' +
                '<div class="name-right"> [ '+ r.get('s_vip_mob')+' ]</div>' +
                '<div class="clear"></div>' +
                '<div class="name-left">'+ r.get('s_vip_card_type')+'</div>' +
                '<div class="name-right"> [ '+ r.get('s_vip_card')+' ]</div>' +
                '<div class="clear"></div>' +
                '</div>'
        }},
        {header:"大交通信息", dataIndex:"ob_start_date", width:280,renderer:function(v,m,r){
            var start_time;
            if(r.get('ob_start_time')==0){
                start_time='<span style="color:#ccc"> [ 未知 ] </span>';
            }else{
                start_time=' [ '+r.get('ob_start_time')+' ]';
            }
            var end_time;
            if(r.get('ob_end_time')==0){
                end_time='<span style="color:#ccc"> [ 未知 ] </span>';
            }else{
                end_time=' [ '+r.get('ob_end_time')+' ]';
            }
            return '<div>' +
                '<div class="traller-left">' +
                '<div class="tr-le-top">'+r.get('ob_start_site')+'</div>' +
                '<div class="tr-le-bottom">'+v.substr(0,4)+'-'+ v.substr(4,2)+'-'+ v.substr(6,2)+'   '+start_time+'</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="traller-center"> <i class="fa fa-long-arrow-right"></i></div>' +
                '<div class="traller-right">' +
                '<div class="tr-le-top">'+r.get('ob_end_site')+'</div>' +
                '<div class="tr-le-bottom">' +r.get('ob_end_date').substr(0,4)+'-'+ r.get('ob_end_date').substr(4,2)+'-'+r.get('ob_end_date').substr(6,2)+'   '+end_time+'</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>'
        }},
        {header:"交通类型", dataIndex:"ob_type", width:160,renderer:function(v,m,r){
            var ob_bus_number;
            if(r.get('ob_bus_number')){
                ob_bus_number=' [ '+r.get('ob_bus_number')+' ]';
            }else{
                ob_bus_number='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            var ob_seat_detail;
            if(r.get('ob_seat_detail')){
                ob_seat_detail=' [ '+r.get('ob_seat_detail')+' ]';
            }else{
                ob_seat_detail='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            return '<div>' +
                '<div class="type-left">'+v+'</div>' +
                '<div class="type-right">'+ob_bus_number+'</div>' +
                '<div class="clear"></div>' +
                '<div class="type-left">'+ r.get('ob_berth_type')+'</div>' +
                '<div class="type-right">'+ob_seat_detail+'</div>' +
                '<div class="clear"></div>' +
                '</div>';
        }},
        {header:"出票信息", dataIndex:"ob_type", width:160,renderer:function(v,m,r){
            var ob_price;
            if(r.get('ob_price')){
                ob_price=' ￥'+r.get('ob_price')+' ';
            }else{
                ob_price='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            var ob_out_site;
            if(r.get('ob_out_site')){
                ob_out_site=' '+r.get('ob_out_site')+' ';
            }else{
                ob_out_site='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            return '<div>' +
                '<div class="type-left">地点 : </div>' +
                '<div class="type-right">'+ob_out_site+'</div>' +
                '<div class="clear"></div>' +
                '<div class="type-left">手续费 : </div>' +
                '<div class="type-right">'+ob_price+'</div>' +
                '<div class="clear"></div>' +
                '</div>';
        }},
        {header:"购票金额", dataIndex:"ob_money", width:90,align:'right',renderer:function(v,m,r){
            if(v==0){
                v='<span style="color:#ccc"> [ 未知 ] </span>';
            }else{
                v='￥'+v;
            }
            return '<div style="text-align: right; line-height:40px;">'+v+'</div>';
        }},
        {header:"当前持票人", dataIndex:"ob_final_name", width:160,renderer:function(v,m,r){
            var reStr = '<span style = "cursor: pointer;color:#509dee" ondblclick = planeInfo("'+val+'")> [ 动态 ] </span>';
            if(!v){
                v='<span style="color:#ccc"> [ 未知 ] </span>';
                reStr='';
            }
            var ob_final_tel;
            if(r.get('ob_final_tel')){
                ob_final_tel=' '+r.get('ob_final_tel')+' ';
            }else{
                ob_final_tel='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            if(r.get('ob_id')){
                var val=r.get('ob_id');
            }else{
                var val=-1;
            }

            return '<div>' +
                '<div class="final_name_top">'+v+reStr+'</div>' +
                '<div class="clear"></div>' +
                '<div class="final_name_bottom">'+ob_final_tel+'</div>' +
                '<div class="clear"></div>' +
                '</div>';
        }},
        {header:"快递信息", dataIndex:"ob_ems_org", width:160,renderer:function(v,m,r){
            var v;
            if(!v){
                v='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            var ob_ems_number;
            if(r.get('ob_ems_number')){
                ob_ems_number=' [ '+r.get('ob_final_tel')+' ] ';
            }else{
                ob_ems_number='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            var ob_express_money;
            if(r.get('ob_express_money')){
                ob_express_money=' [ ￥'+r.get('ob_express_money')+' ] ';
            }else{
                ob_express_money='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            return '<div>' +
                '<div class="final_name_top">'+v+' '+ob_express_money+'</div>' +
                '<div class="clear"></div>' +
                '<div class="final_name_bottom">'+ob_ems_number+'</div>' +
                '<div class="clear"></div>' +
                '</div>';
        }},
        {header:"产品名称", dataIndex:"o_product_name", width:200,renderer:function(v,m,r){
            if(r.get('s_ticket_type')=='全陪票')  return '<font color="#999">全陪大交通无订单信息</font>';
            var v;
            if(!v){
                v='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            var o_sorg_name;
            if(r.get('o_sorg_name')){
                o_sorg_name=' [ '+r.get('o_sorg_name')+' ] ';
            }else{
                o_sorg_name='<span style="color:#ccc"> [ 未知 ] </span>';
            }
            return '<div>' +
                '<div class="final_name_top">'+v+'</div>' +
                '<div class="clear"></div>' +
                '<div class="final_name_bottom">'+o_sorg_name+'</div>' +
                '<div class="clear"></div>' +
                '</div>';
        }}
    ];

    ob_start_site_OrgCombo=SUNLINE.OrgCombo_Sation2({
        listConfig:{minWidth:285},labelSeparator:'',id:'ob_start_site_id',name:'ob_start_site',listWidth:400,allowBlank:true,
        editable:true,forceSelection:true,fieldLabel:'出发',labelWidth:30,width:165
    });
    ob_end_site_OrgCombo=SUNLINE.OrgCombo_Sation2({ listConfig:{minWidth:285},labelSeparator:'',id:'ob_end_site_id',name:'ob_end_site',listWidth:250,allowBlank:true,editable:true,forceSelection:true,fieldLabel:"目的",labelWidth:30,width:165});
    //ob_start_date_date=SUNLINE.ExtDateField({/*labelSeparator:'',*/id:'ob_start_date_id',name:'ob_start_date',labelAlign:"right",fieldLabel:"日期",labelWidth:30,width:165,allowBlank:true});
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        var company_box=SUNLINE.CompanyBox_guide({
            where:{org_type:'管理公司'}
        });
        WG.org_id=1;
    }else{
        WG.org_id=' ';
        var company_box=' ';
    }
    var bc_url = $__app__ + '/OrderBus/company_select';
    var bc_field = [{name:"bc_id"}];
    var bc_store = new SUNLINE.JsonStore(bc_url, bc_field,false);
    var bc_form_store = new SUNLINE.JsonStore(bc_url, bc_field,false);
    var bc_form_grid=SUNLINE.OrgCombo_ticket_company({fieldLabel:"票务公司",name:'ob_out_site',allowBlank:false,  labelWidth:80,editable:true,forceSelection:true});
    /*var bc_form_grid = new Ext.form.ComboBox({
        labelWidth:80,
        width:390,
        labelAlign:"right",
        allowBlank : false,
        name:'ob_out_site_id',
        id:'bc_org_id_form',
        hiddenName:'org_id',
        fieldLabel:"票务公司",
        store: bc_form_store,
        displayField:'org_name',
        valueField:"org_id",
        typeAhead: true,
        mode: 'remote',
        triggerAction: 'all',
        editable:false,
        forceSelection:false
    });*/
    bc_form_store.on('load',function(){
        bc_form_store.add({
            org_name:_uinfo['org_name'],
            org_id:_uinfo['org_id']
        })
    })
    var bc_grid = new Ext.form.ComboBox({
        width:210,
        labelAlign:"right",
        labelWidth:56,
        name:'org_id',
        id:'bc_org_id',
        hiddenName:'org_id',
        fieldLabel:"票务公司",
        store: bc_store,
        displayField:'org_name',
        valueField:"org_id",
        typeAhead: true,
        mode: 'remote',
        triggerAction: 'all',
        editable:false,
        forceSelection:false,
        listConfig:{minWidth:250}
    });
    bc_store.on('load',function(){
        this.add({org_id:'-1',org_name:'全部票务公司', org_type: "机票和火车票出票点"});
    })
    Ext.getCmp('bc_org_id').setValue('全部票务公司');
    var fen_url = $__app__ + '/OrderBus/company_fen';
    var fen_field = [{name:"fen_id"}];
    var fen_store = new SUNLINE.JsonStore(fen_url, fen_field,false);
    fen_store.on('load',function(){
        this.add({org_id:'-1',org_name:'全部管理公司'});
    })
    var fen_grid;
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        fen_grid = new Ext.form.ComboBox({
            width:310,
            labelAlign:"right",
            labelWidth:56,
            name:'org_id',
            id:'idd_org_id',
            hiddenName:'org_id',
            fieldLabel:"管理公司",
            store: fen_store,
            displayField:'org_name',
            valueField:"org_id",
            typeAhead: true,
            mode: 'remote',
            triggerAction: 'all',
            editable:false,
            forceSelection:false,
            listConfig:{minWidth:300}
        });
        Ext.getCmp('idd_org_id').setValue('全部管理公司');
        WG.org_id=1;
    }else{
        WG.org_id=' ';

        fen_grid = '';
    }


    var ob_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:ob_cm,
        store:ob_store,
        features: [grouping_store],
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有订单交通信息',
            deferEmptyText:true
        },
        selModel:{
            selType: 'checkboxmodel'
        },
        style : 'border-top:1px solid #ddd;',
        tbar:[
            {text:'编辑票务', id:'bottom_1',iconCls:'button-edit',handler:traffic_modify, disabled:isDisabled('OrderBus::save_bus')},
            '-',
            {text:'持票人', id:'bottom_2',iconCls:'button-edit',handler:man_modify, disabled:isDisabled('OrderBus::save_bus')},
            '-',
            {text:'退单程票', id:'bottom_3',iconCls:'button-edit',handler:tui_modify},
            '-',
            {text:'退往返票', id:'bottom_4',iconCls:'button-edit',handler:tui_modify},
            '-',
            {text:'票务改签', id:'bottom_5',iconCls:'button-edit',handler:traffic_modify},
            /*'-',
            {text:'取消订单', id:'bottom_6',iconCls:'button-edit',handler:tui_modify},*/
            '-',
            {text:'火车票打印单',f_name:'tra',id:'tra',act:'print',iconCls:'button-print',handler:_print},
            '-',
            {text:'飞机票打印单',f_name:'air',id:'air',act:'print',iconCls:'button-print',handler:_print},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'}
        ],
       /* listeners:{
        cellclick:function(v,g,n,r){
            var td_status = r.data.ob_status;
                switch(td_status){
                    case '已退票':
                        Ext.getCmp('bottom_1').setDisabled(true)//编辑票务
                        Ext.getCmp('bottom_2').setDisabled(true)//持票人
                        Ext.getCmp('bottom_3').setDisabled(true)//退单程票
                        Ext.getCmp('bottom_4').setDisabled(true)//退往返票
                        Ext.getCmp('bottom_5').setDisabled(true)//票务改签
                        Ext.getCmp('bottom_6').setDisabled(true)//取消订单
                        break;
                    case '未出票':
                        Ext.getCmp('bottom_1').setDisabled(false)//编辑票务
                        Ext.getCmp('bottom_2').setDisabled(true)//持票人
                        Ext.getCmp('bottom_3').setDisabled(true)//退单程票
                        Ext.getCmp('bottom_4').setDisabled(true)//退往返票
                        Ext.getCmp('bottom_5').setDisabled(true)//票务改签
                        Ext.getCmp('bottom_6').setDisabled(false)//取消订单
                        break;
                    case '已出票':
                        Ext.getCmp('bottom_1').setDisabled(true)//编辑票务
                        Ext.getCmp('bottom_2').setDisabled(false)//持票人
                        Ext.getCmp('bottom_3').setDisabled(false)//退单程票
                        Ext.getCmp('bottom_4').setDisabled(false)//退往返票
                        Ext.getCmp('bottom_5').setDisabled(false)//票务改签
                        Ext.getCmp('bottom_6').setDisabled(false)//取消订单
                        break;
                    case '已改签':
                        Ext.getCmp('bottom_1').setDisabled(true)//编辑票务
                        Ext.getCmp('bottom_2').setDisabled(false)//持票人
                        Ext.getCmp('bottom_3').setDisabled(false)//退单程票
                        Ext.getCmp('bottom_4').setDisabled(false)//退往返票
                        Ext.getCmp('bottom_5').setDisabled(false)//票务改签
                        Ext.getCmp('bottom_6').setDisabled(false)//取消订单
                        break;
                    default :
                        break;
                }
            }
        },*/
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:ob_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有订单交通信息'
        })
    });
    var _print_win;
    ob_grid.on('select',function(i,r,v){
        if(r.data.ob_type=='飞机'){
            Ext.getCmp('tra').setDisabled(true);
            Ext.getCmp('air').setDisabled(false);
        }else{
            Ext.getCmp('tra').setDisabled(false);
            Ext.getCmp('air').setDisabled(true);
        }
    })
    function _print(v){
        var rows=ob_grid.getSelectionModel().getSelection();
        if(rows.length<=0){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);
        var ob_id_arr=crrs.ob_id;
        var ob_sid_arr=crrs.ob_sid;
        for(var i=1;i<brrs.length;i++){
            if(crrs['ob_start_date']!=brrs[i]['data']['ob_start_date']){
                Ext.Msg.alert('提示信息','您多选的出发时间不一致，请重新选择');
                return false;
            }
            if(crrs['ob_start_site']!=brrs[i]['data']['ob_start_site']){
                Ext.Msg.alert('提示信息','您多选的出发站点不一致，请重新选择');
                return false;
            }
            if(crrs['ob_out_site']!=brrs[i]['data']['ob_out_site']){
                Ext.Msg.alert('提示信息','您多选的票务公司不一致，请重新选择');
                return false;
            }
            ob_id_arr+=','+brrs[i]['data']['ob_id'];
            ob_sid_arr+=','+brrs[i]['data']['ob_sid'];
        }
        var _w = 850, _h = Ext.getBody().getHeight();
        if (!_print_win){
            _print_win= new Ext.Window({
                title : '打印',
                width : _w,
                height : _h - 50,
                modal : true,
                maximizable : true,//全屏效果
                closeAction : 'hide',
                html : '<iframe src="" id="_print_frm" name="_print_frm" frameborder="0" width="100%" height="100%"></iframe>',
                buttons:[
                    {text:'打印',id:'sunline_print'/*,xtype:'splitbutton'*/,handler:doprint},
                    {text:'关闭', handler:function(){_print_win.hide();}}
                ]
            });
        }

        _print_win.show();

        var name_title=''
        setTimeout( function(){
            if(v.f_name=='tra'){
                var url = $__app__ + '/TeamPlanTpl/trf_plan/ob_id/'+ob_id_arr+'/ob_sid/'+ob_sid_arr;
                window._print_frm.location = url;
                name_title='查看火车票确认单';
            }else if(v.f_name=='air'){
                var url = $__app__ + '/TeamPlanTpl/air_plan/ob_id/'+ob_id_arr+'/ob_sid/'+ob_sid_arr;
                window._print_frm.location = url;
                name_title='查看飞机票确认单';
            }else{

            }
        },1000);
        _print_win.setTitle(name_title, v.iconCls);
        _print_win.setSize( _w, _h - 50 );

    }
    function doprint(){
        window._print_frm.focus();
        window._print_frm.print();
    }
    var tui_form=new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        items:[
            {
                columnWidth:1,
                defaults:{ width:385,labelAlign:"right" },
                items:[
                    {name:"ob_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {name:"ob_stocks_id", fieldLabel:"ob_stocks_id",xtype:"hidden"},
                    {name:"ob_td_name", fieldLabel:"ob_td_name",xtype:"hidden"},
                    {name:"o_number", fieldLabel:"o_number",xtype:"hidden"},
                    {name:"type", fieldLabel:"type", maxLength:"10",xtype:"hidden"},
                    {name:"o_number", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
                    {labelWidth:50,name:"ob_penalty", fieldLabel:"违约金", maxLength:"10",xtype:'numberfield',value:0},
                ]
            },{
                columnWidth:1,
                items:[{labelWidth:50,labelAlign:"right", name:"ol_remark", fieldLabel:"备注", maxLength:"500", xtype:'textarea',width:"385"}]
            }
        ]
    });
    var tui_win = new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:tui_form,
        buttons:[
            {text:'保存', handler:tui_dosave},
            {text:'关闭', handler:function () {
                tui_win.hide();
            },style:'margin-right:15px'}
        ]
    });
    function tui_dosave(){
        if (!tui_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var s = tui_form.getForm().getValues();
        s['type']=WG.tui_type;
        s['o_number']=WG.o_number;
        s['ob_sid']=WG.ob_sid;
        s['i_num']=WG.i_num;
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/tui_save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ob_store.reload();
                    tui_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    function tui_modify(v){
        var rows=ob_grid.getSelectionModel().getSelection();
        if(rows.length<=0){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);
        WG.i_num=1
        for(var i=1;i<brrs.length;i++){
            if(crrs['o_number']!=brrs[i]['data']['o_number']){
                Ext.Msg.alert('提示信息','您多选的订单编号不一致，请重新选择');
                return false;
            }
            WG.i_num=1+i;
            crrs['ob_id']+=','+brrs[i]['data']['ob_id'];
            crrs['ob_sid']+=','+brrs[i]['data']['ob_sid'];
        }
        if(v.text=='退单程票'){
            WG.tui_type='dc';  //单程
        }else if(v.text=='退往返票'){
            WG.tui_type='wf';  //往返
        }else if(v.text=='取消订单'){
            WG.tui_type='qx';  //取消
        }
        WG.o_number=crrs['o_number'];
        WG.ob_sid=crrs['ob_sid'];
        tui_win.show();
        tui_form.getForm().setValues(crrs);
        tui_win.setTitle(v.text+"信息", v.iconCls);
    }
    tui_win.on('hide',function(){
        tui_form.getForm().reset();
        WG.o_number='';
        WG.tui_type='';
        WG.ob_sid='';
        WG.i_num=1;
    })
    function setGroup(b){
        var g = Ext.getCmp('_group_by');
        g.setText(b.text);
        ob_store.group(b.field);
        g.field = b.field;

    };
    var panel2 = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'border',
        items : [ob_grid],
        style : 'border-top:1px solid #ddd;',
        tbar:[
            ob_start_site_OrgCombo.box,
            '-',
            ob_end_site_OrgCombo.box,
            '-',
            '出团时间:',
            SUNLINE.ExtDateField({labelSeparator:'',id:'ob_start_date_id',name:'ob_start_date',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'ob_end_date_id',start:true}),
            '~',
            SUNLINE.ExtDateField({labelSeparator:'',id:'ob_end_date_id',name:'ob_end_date',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'ob_start_date_id'}),
            '-',
            '搜索:',
            {
                xtype:'textfield',
                id:'ob_search',
                emptyText:'订单编号、游客姓名、手机号、身份证',
                width:240
            },
            '-',
            {text:'搜索',iconCls:"searchico",handler:search_modify},
            '-',
            {text:'清空',handler:empty_modify},
            '-',
            {text:'导出',rowspan:1,iconCls: 'button-excel',handler:export_modify, disabled:isDisabled('OrderBus::export_xsl')}
        ]
    });
    var ob_type_combo=SUNLINE.DictComBox_false({fieldLabel:"交通类型",name:'ob_type',id:'ob_type_id',width:130,labelWidth:56,labelAlign:"right"},{'d_type':'交通类型'});
    var end_store=ob_type_combo.box.getStore();
    SUNLINE.baseParams(end_store,{d_type:'交通类型'});
    end_store.on('load',function(){
        this.add({d_type:'交通类型',d_text:'全部', d_status: "ok", d_recommend: "0"});
        SUNLINE.baseParams(end_store,{d_type:'交通类型'});
    })
    if(push_o_numver){
        var close_click= {text:'关闭',id:'clos-id'};
    }else{
        var close_click= '';
    }
    Ext.getCmp('ob_type_id').setValue('全部');
    var panel = new Ext.Panel({
        region : 'center',
        border : false,
        layout : 'border',
        items : [panel2],
        tbar:[
            fen_grid,
            bc_grid,
            '-',
            '出票状态',
            {
                xtype:"combo",
                id:"org_money_id",
                name:"ob_status",
                width:75,
                store:new Ext.data.SimpleStore({
                    fields:['ob_status'],
                    data:[
                        ['全部'],
                        ['未出票'],
                        ['已出票'],
                        ['已退票']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"ob_status",
                displayField:"ob_status",
                mode:"local",
                value:'全部'
            },
            '-',
            '订单类型',
            {
                xtype:"combo",
                id:"o_type_id",
                name:"o_type",
                width:90,
                store:new Ext.data.SimpleStore({
                    fields:['o_type'],
                    data:[
                        ['全部'],
                        ['跟团游'],
                        ['团队订单']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"o_type",
                displayField:"o_type",
                mode:"local",
                value:'全部'
            },
            '-',
            '往返类型',
            {
                xtype:"combo",
                id:"ob_goto_type",
                name:"ob_goto_type",
                width:90,
                store:new Ext.data.SimpleStore({
                    fields:['ob_goto_type'],
                    data:[
                        ['全部'],
                        ['去程'],
                        ['返程']
                    ]
                }),
                triggerAction:"all",
                editable:false,
                valueField:"ob_goto_type",
                displayField:"ob_goto_type",
                mode:"local",
                value:'全部'
            },
            ob_type_combo.box,
            '-',
            {text:'按订单编号分组',id:'_group_by',iconCls:"searchico",field:'o_number',handler:setGroup,
                menu:{
                    items :[
                        {text:'按出发日期分组',field:'ob_start_date',handler:setGroup},
                        {text:'按往返类型分组',field:'ob_goto_type',handler:setGroup},
                        {text:'按出发地分组',field:'ob_city_start',handler:setGroup},
                        {text:'按目的地分组',field:'ob_city_end',handler:setGroup},
                        {text:'按班次编号分组',field:'ob_bus_number',handler:setGroup},
                        {text:'按订单编号分组',field:'o_number',handler:setGroup}
                    ]
                }
            },
            '->',
            close_click
        ]
    });
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        company_box.on('select',function(c,r){
            WG.org_id=r[0].data.id;
            search_mod();
        })
    }

    function dosearch(){
        var key=Ext.getCmp('ob_search').getValue();
        SUNLINE.baseParams(ob_store,{skey:key});
        ob_store.currentPage=1;
        ob_store.load();
    }
    //导出
    function export_modify(){
        var where={};
        var ob_start_site_val=Ext.getCmp('ob_start_site_id').getValue();
        var ob_end_site_val=Ext.getCmp('ob_end_site_id').getValue();
        var ob_start_date_val=Ext.getCmp('ob_start_date_id').getRawValue();
        var ob_end_date_val=Ext.getCmp('ob_end_date_id').getRawValue();
        var ob_search_val=Ext.getCmp('ob_search').getValue();
        var ob_status_val=Ext.getCmp('org_money_id').getValue();
        if(ob_start_site_val) where["ob_start_site"]=ob_start_site_val;
        if(ob_end_site_val) where["ob_end_site"]=ob_end_site_val;
        if(ob_start_date_val) where["ob_start_date"]=ob_start_date_val;
        if(ob_end_date_val) where["ob_end_date"]=ob_end_date_val;
        if(ob_search_val) where["skey"]=ob_search_val;
        if(ob_status_val) where["ob_status"]=ob_status_val;
        where["export"]='export';
        ob_store_export['baseParams']=where;
        ob_store_export.load({callback:function(){
            var data_num=ob_store_export['data']['items']['length'];
            if(data_num==0){
                Ext.Msg.alert('友情提示',"没有数据可以导出！");
                return;
            }else{
                var param='';
                for(i in where){
                    param = param + i + "=" + where[i] + "&";
                }
                Ext.Msg.confirm('友情提示','你确认要下载账单的电子表格吗？',function(y){
                    if(y=='yes'){
                        window.open($__app__+"/OrderBus/export_xsl?"+param,'_blank');
                    }
                })
            }
        }});
    }
    //清空
    function empty_modify(){
        Ext.getCmp('ob_start_site_id').setValue('');
        Ext.getCmp('ob_end_site_id').setValue('');
        Ext.getCmp('ob_start_date_id').setValue('');
        Ext.getCmp('ob_end_date_id').setValue('');
        Ext.getCmp('ob_search').setValue('');
        Ext.getCmp('org_money_id').setValue('全部');
        Ext.getCmp('o_type_id').setValue('全部');
        Ext.getCmp('ob_goto_type').setValue('全部');
        Ext.getCmp('bc_org_id').setValue('全部票务公司');
        Ext.getCmp('ob_type_id').setValue('全部');
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            Ext.getCmp('idd_org_id').setValue('全部管理公司');
            SUNLINE.baseParams(ob_store,{
                skey:'',
                ob_start_date:'',
                ob_end_site:'',
                ob_start_site:'',
                ob_status:'全部',
                ob_org_id:'全部管理公司',
                bc_org_id:'全部票务公司',
                o_type:'全部',
                ob_type:'全部'
            });
        }else{
            SUNLINE.baseParams(ob_store,{
                skey:'',
                ob_start_date:'',
                ob_end_site:'',
                ob_start_site:'',
                ob_status:'全部',
                bc_org_id:'全部票务公司',
                o_type:'全部',
                ob_type:'全部'
            });
        }



        ob_store.currentPage=1;
        ob_store.load();
    }
    //搜索
    Ext.getCmp('org_money_id').on('select',function(){
        search_mod();
    })
    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        Ext.getCmp('idd_org_id').on('select',function(){
            search_mod();
        })
    }

    Ext.getCmp('bc_org_id').on('select',function(){
        search_mod();
    })

    Ext.getCmp('o_type_id').on('select',function(){
        search_mod();
    })
    Ext.getCmp('ob_goto_type').on('select',function(){
        search_mod();
    })
    Ext.getCmp('ob_type_id').on('select',function(){
        search_mod();
    })
    function search_modify(){
        search_mod();
    }
    function search_mod(){
        var ob_goto_type_val=Ext.getCmp('ob_goto_type').getValue();            //去程返程
        var ob_start_site_val=Ext.getCmp('ob_start_site_id').getValue();            //出发地
        var ob_end_site_val=Ext.getCmp('ob_end_site_id').getValue();            //目的地
        var ob_start_date_val=Ext.getCmp('ob_start_date_id').getRawValue(); //开始日期
        var ob_end_date_val=Ext.getCmp('ob_end_date_id').getRawValue(); //开始日期
        var ob_search_val=Ext.getCmp('ob_search').getValue();          //搜索
        var ob_status_val=Ext.getCmp('org_money_id').getValue();    //出票状态
        var idd_org_id_val;
        if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
            var idd_org_id_val=Ext.getCmp('idd_org_id').getValue();  //管理公司
        }else{
            var idd_org_id_val='';
        }

        var bc_org_id_val=Ext.getCmp('bc_org_id').getValue();  //票务公司
        var o_type_val=Ext.getCmp('o_type_id').getValue();  //订单类型
        var ob_type_val=Ext.getCmp('ob_type_id').getValue();  //交通类型
        SUNLINE.baseParams(ob_store,{
            skey:ob_search_val,
            ob_start_date:ob_start_date_val,
            ob_end_date:ob_end_date_val,
            ob_end_site:ob_end_site_val,
            ob_start_site:ob_start_site_val,
            ob_status:ob_status_val,
            ob_org_id:idd_org_id_val,
            bc_org_id:bc_org_id_val,
            o_type:o_type_val,
            ob_goto_type:ob_goto_type_val,
            ob_type:ob_type_val
        });
        ob_store.currentPage=1;
        ob_store.load();
    }
    //查看票位置
    var look_url = $__app__ + '/OrderBus/obd_select';
    var look_field = [ {name:"obd_id"}];
    var look_store = new SUNLINE.JsonStore(look_url, look_field,false,{pageSize:10});
    var look_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:look_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有票位置的信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"obd_id", dataIndex:"obd_id", width:150,hidden:true},
            {header:"obd_ob_id", dataIndex:"obd_ob_id", width:150,hidden:true},
            {header:"当前持票人", dataIndex:"obd_final_name", width:100},
            {header:"持票人联系方式", dataIndex:"obd_final_tel", width:115},
            {header:"快递公司", dataIndex:"obd_ems_org", width:150},
            {header:"快递运单号", dataIndex:"obd_ems_number", width:100},
            {header:"快递运费", dataIndex:"obd_express_money", width:100},
            {header:"持票时间", dataIndex:"obd_ems_time", width:136,renderer:function(v,m,r){
                v= new Date(parseInt(v)*1000);
                return Ext.Date.format(v,'Y-m-d H:i:s');
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:look_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有票位置的信息'
        })
    });
    var look_win=new Ext.Window({
        width:746,
        height:458,
        layout:'fit',
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[look_grid],
        buttons:[
            {text:'关闭', handler:function () { look_win.hide();}}
        ]
    })
    window.planeInfo=function(v){
        var row=SUNLINE.getSelected(ob_grid);
        //console.log(row);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        if(!row.data.ob_final_name){
            Ext.Msg.alert('提示信息','票还未给持票人');
            return false;
        }
        look_win.show();
        look_win.setTitle('查看票位置', v.iconCls);
    }

    look_win.on('show',function(){
        var row=SUNLINE.getSelected(ob_grid);
        SUNLINE.baseParams(look_store,{obd_ob_id:row.data.ob_id});
        look_store.currentPage=1;
        look_store.load();
    })
    //持票人
    var ob_ems_org_combo=SUNLINE.DictComBox_false({fieldLabel:"快递公司",name:'ob_ems_org',id:'ob_ems_org_id',width:390,labelWidth:100,labelAlign:"right", allowBlank:true},{'d_type':'快递公司'});
    var man_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol1',
                defaults:{xtype:'textfield',labelWidth:100,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"ob_id", fieldLabel:"ob_id", maxLength:"100",hidden:true},
                    {name:"ob_obd_type", id:'ob_obd_type_id',fieldLabel:"ob_obd_type", maxLength:"100",hidden:true},
                    //{name:"ob_final_name", fieldLabel:"ob_final_name", maxLength:"100",hidden:true},
                    {name:"ob_final_name", fieldLabel:"当前持票人", maxLength:"20"},
                    {name:"ob_final_tel", fieldLabel:"持票人联系方式", maxLength:"20"},
                    ob_ems_org_combo.box,
                    {name:"ob_ems_number", fieldLabel:"快递运单号", maxLength:"30"},
                    {name:"ob_express_money", fieldLabel:"快递运费", xtype:'numberfield'},
                ]
            }
        ]
    })
    var man_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:man_form,
        buttons:[
            {text:'保存', handler:man_dosave},
            {text:'关闭', handler:function () {
                man_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    function man_dosave(){
        if (!man_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var rows=ob_grid.getSelectionModel().getSelection();
        var crrs=Ext.apply({},rows[0].data);
        var data = man_form.getForm().getValues();
        data['type']='man';
        data['ob_final_name_old']=crrs['ob_final_name'];
        data['ob_final_tel_old']=crrs['ob_final_tel'];
        data['ob_ems_org_old']=crrs['ob_ems_org'];
        data['ob_ems_number_old']=crrs['ob_ems_number'];
        data['ob_express_money_old']=crrs['ob_express_money'];
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/save_bus',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ob_store.reload();
                    man_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    man_win.on('hide',function(){
        man_form.getForm().reset();
    })
    function man_modify(v){
        var rows=ob_grid.getSelectionModel().getSelection();
        if(rows.length<=0){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);
        if(crrs==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        if(crrs['ob_status']=='未出票'){
            Ext.Msg.alert('提示信息','请先编辑票务信息');
            return false;
        }

        if(crrs.ob_end_date.indexOf("-")<=0){
            crrs.ob_end_date=crrs.ob_end_date.substr(0,4) + '-' + crrs.ob_end_date.substr(4,2) + '-' + crrs.ob_end_date.substr(6,2) ;
        }
        if(brrs.length==0){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }else if(brrs.length==1){

        }else{
            for(var i=1;i<brrs.length;i++){
                if(brrs[i].data.ob_end_date.indexOf("-")<=0){
                    brrs[i].data.ob_end_date=brrs[i].data.ob_end_date.substr(0,4) + '-' + brrs[i].data.ob_end_date.substr(4,2) + '-' + brrs[i].data.ob_end_date.substr(6,2) ;
                }
                if(brrs[i]['data']['ob_status']!='已出票'){
                    Ext.Msg.alert('提示信息','您多选的出票状态不一致，请重新选择');
                    return false;
                }
                crrs['ob_id']+=','+brrs[i]['data']['ob_id'];
                crrs['ob_obd_type']='more';
            }
        }
        man_win.show();
        man_form.getForm().setValues(crrs);
        man_win.setTitle('编辑持票人信息', v.iconCls);
    }
    //交通详情
    var ob_start_time_text=new Ext.form.TextField({id:"ob_start_time",labelAlign:'right',labelWidth:80,width:390,name:"ob_start_time",fieldLabel:'出发时间', emptyText: '例如:10:10',allowBlank:true});
    ob_start_time_text.focus();
    ob_start_time_text.regex=/^(((1|0?)[0-9]|2[0-3])：([0-5][0-9]))|(((1|0?)[0-9]|2[0-3]):([0-5][0-9]))$/;
    ob_start_time_text.regexText ='正确认格式:(10:30)';
    var ob_end_time_text=new Ext.form.TextField({id:"ob_end_time",labelAlign:'right',labelWidth:80,width:390,name:"ob_end_time",fieldLabel:'到达时间', emptyText: '例如:12:12',allowBlank:true});
    ob_end_time_text.focus();
    ob_end_time_text.regex=/^(((1|0?)[0-9]|2[0-3])：([0-5][0-9]))|(((1|0?)[0-9]|2[0-3]):([0-5][0-9]))$/;
    ob_end_time_text.regexText ='正确认格式:(12:30)';
    var ob_berth_type_combo=SUNLINE.DictComBox({id:'ob_berth_type_new',fieldLabel:"交通铺位",name:'ob_berth_type',allowBlank:false,labelAlign:"right",labelWidth:80,width:390,forceSelection:false},{'d_type':'火车铺位'});
    var ob_pay_type_combo=SUNLINE.DictComBox({id:'ob_pay_type_new',name:'ob_pay_type',fieldLabel:"支付方式",labelWidth:80,labelAlign:"right",allowBlank:false,value:'现金'},{'d_type':'支付方式'});

    var kuc_url = $__app__ + '/OrderBus/busine';
    var kuc_field = [{name:"td_id"}];
    var kuc_store = new SUNLINE.JsonStore(kuc_url, kuc_field,false);
    var kuc_grid = new Ext.form.ComboBox({
        width:390,
        labelAlign:"right",
        labelWidth:80,
        name:'ob_td_name',
        id:'td_name',
        fieldLabel:"选择库存",
        store: kuc_store,
        displayField:'td_name',
        valueField:"td_name",
        editable:false,
        typeAhead: true,
        mode: 'remote',
        forceSelection: true,
        triggerAction: 'all',
        listConfig:{maxWidth:305},
        tpl:Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item"> {td_start_time_new}  {td_name}  {td_num_new} {tbd_price_new}</li>',
            '</tpl></ul>'
        )
    });

    var traffic_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol1',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:'ob_id',name:"ob_id", fieldLabel:"ob_id", hidden:true},
                    {name:"ob_stocks_id", id:'tbd_id',fieldLabel:"ob_stocks_id", maxLength:"100",hidden:true},
                    {name:"gaiqian", fieldLabel:"gaiqian", maxLength:"100",hidden:true}, //gaiqian
                    //{name:"ob_oid", fieldLabel:"ob_oid", maxLength:"100",hidden:true}, //订单号
                    {name:"o_number", fieldLabel:"o_number", maxLength:"100",hidden:true}, //订单编号
                    {name:"ob_type_ourself", fieldLabel:"ob_type_ourself", maxLength:"100",hidden:true}, //ob_type_ourself自己做判断
                    {name:"ob_final_name", fieldLabel:"ob_final_name", maxLength:"100",hidden:true},
                    {id:'ob_bus_number_new',name:"ob_bus_number", fieldLabel:"班次编号", maxLength:"20", allowBlank:false,vtype:'NotBlank', emptyText: '例如:G1-G9998'},
                    ob_berth_type_combo.box,
                    kuc_grid,
                    {name:"ob_seat_detail",id:'ob_seat_detail_id', fieldLabel:"座位信息", maxLength:"20", emptyText: '例如:07车 072号,可不填'},
                    ob_start_time_text,
                    SUNLINE.ExtDateField({id:'ob_end_date',name:'ob_end_date',labelAlign:"right",fieldLabel:"到达日期", allowBlank:false,labelWidth:80,width:390}),
                    ob_end_time_text,
                    {id:'ob_money_new',name:"ob_money", fieldLabel:"购票单价", maxLength:"20",  xtype:'numberfield',allowBlank:false},
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '销售价格',
                        combineErrors: false,
                        defaults: { hideLabel: true },
                        items: [
                            {id:'ob_sell_money_new',name:"ob_sell_money", fieldLabel:"销售价格",width:230, maxLength:"20",  xtype:'numberfield',allowBlank:false,style:'float:left;padding-right:6px'},
                            {xtype: 'button', text: '获取票价',id:'sell_money_only',handler:button_fn}
                        ]
                    },
                    {name:"ob_price", fieldLabel:"手续费", maxLength:"20", xtype:'numberfield',allowBlank:false},
                    ob_pay_type_combo.box,
                    bc_form_grid.box,
                    {name:"ob_out_site_id",id:'ob_out_site_id', fieldLabel:"ob_out_site_id", maxLength:"100",hidden:true},
                ]

            },{
                cls:'tcol1',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {id:'penalty_money',name:"penalty_money", fieldLabel:"改签金额", maxLength:"20",vtype:'NotBlank', xtype:'numberfield', value:0},
                ]
            },{
                columnWidth:1,
                items:[{labelWidth:80,labelAlign:"right", name:"ob_remarks", fieldLabel:"购票备注", xtype:'textarea',width:"390"}]
            }
        ]
    });
    function button_fn(){
        var ob_id=Ext.getCmp('ob_id').getValue();
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/sell_money',
            params:{id:ob_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    Ext.MessageBox.confirm('友情提示','获取到的销售单价为【'+info+'】，你确定需要使用吗？',function(y){
                        if(y!='yes')return false;
                        Ext.getCmp('ob_sell_money_new').setValue(info);
                    });
                }
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    /*Ext.getCmp('sell_money_only').on({
        click:function(){
            alert(11111)
        }
    });*/
    ob_berth_type_combo.box.on('select',function(c,r,n){
        Ext.getCmp('tbd_id').setValue('')   //库存ID
        Ext.getCmp('ob_money_new').setValue('');   //价格
        //Ext.getCmp('ob_start_time').setValue('');
        //Ext.getCmp('ob_end_time').setValue('');
        //Ext.getCmp('bc_org_id_form').setValue('');
        //Ext.getCmp('ob_bus_number_new').setValue('');
        var rows=ob_grid.getSelectionModel().getSelection();
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);

        console.log(r)
        SUNLINE.baseParams(kuc_store,{
            ob_start_date:crrs.ob_start_date,
            ob_berth_type:r[0].data.d_text,
            ob_start_site:crrs.ob_start_site,
            ob_type:crrs.ob_type
        });
        kuc_store.load();
    });
    Ext.getCmp('ob_money_new').on({
        blur:function(){
           var money=Ext.getCmp('ob_money_new').getValue();
           var sell_money=Ext.getCmp('ob_sell_money_new').getValue();
           if(!sell_money || sell_money==0)Ext.getCmp('ob_sell_money_new').setValue(money);
        }
    });
    kuc_grid.on('select',function(a,b){
        console.log(b[0]['data'])
        Ext.getCmp('ob_money_new').setValue(b[0]['data'].tbd_price) //价格
        Ext.getCmp('ob_start_time').setValue(b[0]['data'].td_start_time)
        Ext.getCmp('tbd_id').setValue(b[0]['data'].tbd_id)   //库存ID
        Ext.getCmp('ob_end_time').setValue(b[0]['data'].td_end_time)
        //Ext.getCmp('bc_org_id_form').setValue(_uinfo['org_name'])
        Ext.getCmp('ob_bus_number_new').setValue(b[0]['data'].td_fly_num)
    })
    function data_look(v){
        return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
    }
     bc_form_grid.box.on('select',function(a,b,c){
        Ext.getCmp('ob_out_site_id').setValue(b[0]['data']['org_id']);
     })
    var traffic_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:traffic_form,
        buttons:[
            {text:'出票',shibie:"chupiao", handler:traffic_dosave, disabled:isDisabled('OrderBus::chupiao')},
            {text:'保存草稿',shibie:"baoc",id:'baoc', handler:traffic_dosave, disabled:isDisabled('OrderBus::baoc')},
            {text:'关闭', handler:function () {
                traffic_win.hide();
            },style:'margin-right:15px;'}
        ]
    })
    //var ob_pay_type_num=1;
    traffic_win.on('show',function(){
        /*if(ob_pay_type_num==1){
            ob_pay_type_combo.box.getStore().load();
            ob_berth_type_combo.box.getStore().load();
        }
        Ext.getCmp('ob_pay_type_new').setValue('签单');
        ob_pay_type_num++;*/

        var rows=ob_grid.getSelectionModel().getSelection();
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);

     
        SUNLINE.baseParams(kuc_store,{
            ob_start_date:crrs.ob_start_date,
            ob_berth_type:crrs.ob_berth_type,
            ob_start_site:crrs.ob_start_site,
            ob_type:crrs.ob_type
        });
        kuc_store.load();
    })
    function traffic_dosave(v){
        var _tform=traffic_form.getForm();
        var data = _tform.getValues();
        if(v.shibie=='baoc'){
            data['ob_status']='未出票';
        }else{
            if (!_tform.isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            data['ob_status']='已出票';
        }
        data['i_num']=WG.i_num;  //编辑的数量
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/OrderBus/save_bus',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    ob_store.reload();
                    traffic_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    traffic_win.on('hide',function(){
        traffic_form.getForm().reset();
        WG.i_num=1;
    })

    function traffic_modify(v){
        WG.i_num=1;
        var rows=ob_grid.getSelectionModel().getSelection();
        if(rows.length<=0){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        var brrs=rows;
        var crrs=Ext.apply({},rows[0].data);
        if(crrs.ob_end_date.indexOf("-")<=0){
            crrs.ob_end_date=crrs.ob_end_date.substr(0,4) + '-' + crrs.ob_end_date.substr(4,2) + '-' + crrs.ob_end_date.substr(6,2) ;
        }
        if(v.text=='编辑票务'){
            if(brrs.length==0){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }else if(brrs.length==1){
                Ext.getCmp('ob_seat_detail_id').setHidden(false);
            }else{
                Ext.getCmp('ob_seat_detail_id').setHidden(true);
                if(brrs[0]['data']['ob_status']=='未出票'){
                    for(var i=1;i<brrs.length;i++){
                        if(brrs[i].data.ob_end_date.indexOf("-")<=0){
                            brrs[i].data.ob_end_date=brrs[i].data.ob_end_date.substr(0,4) + '-' + brrs[i].data.ob_end_date.substr(4,2) + '-' + brrs[i].data.ob_end_date.substr(6,2) ;
                        }
                        if(crrs['ob_end_date']!=brrs[i]['data']['ob_end_date']){
                            Ext.Msg.alert('提示信息','您多选的到达日期不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_start_site']!=brrs[i]['data']['ob_start_site']){
                            Ext.Msg.alert('提示信息','您多选的出发口岸不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_status']!=brrs[i]['data']['ob_status']){
                            Ext.Msg.alert('提示信息','您多选的出票状态不一致，请重新选择');
                            return false;
                        }
                        crrs['ob_id']+=','+brrs[i]['data']['ob_id'];
                        crrs['ob_type_ourself']='no_more';
                        WG.i_num=i+1;
                    }
                }else if(brrs[0]['data']['ob_status']=='已出票'){
                    for(var i=1;i<brrs.length;i++){
                        if(brrs[i].data.ob_end_date.indexOf("-")<=0){
                            brrs[i].data.ob_end_date=brrs[i].data.ob_end_date.substr(0,4) + '-' + brrs[i].data.ob_end_date.substr(4,2) + '-' + brrs[i].data.ob_end_date.substr(6,2) ;
                        }
                        if(crrs['ob_end_date']!=brrs[i]['data']['ob_end_date']){
                            Ext.Msg.alert('提示信息','您多选的到达日期不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_bus_number']!=brrs[i]['data']['ob_bus_number']){
                            Ext.Msg.alert('提示信息','您多选的班车编号不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_out_site_id']!=brrs[i]['data']['ob_out_site_id']){
                            Ext.Msg.alert('提示信息','您多选的票务公司不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_status']!=brrs[i]['data']['ob_status']){
                            Ext.Msg.alert('提示信息','您多选的出票状态不一致，请重新选择');
                            return false;
                        }
                        crrs['ob_id']+=','+brrs[i]['data']['ob_id'];
                        crrs['ob_type_ourself']='yes_more';
                        WG.i_num=i+1;
                    }
                }
            }
            Ext.getCmp('penalty_money').setHidden(true);
            //console.log(WG.i_num);
        }else{
            Ext.getCmp('penalty_money').setHidden(false);
            if(brrs.length==0){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }else if(brrs.length==1){
                Ext.getCmp('ob_seat_detail_id').setHidden(false);
                crrs['gaiqian']='gaiqian';
            }else{
                Ext.getCmp('ob_seat_detail_id').setHidden(true);

                if(brrs[0]['data']['ob_status']=='已出票'){
                    for(var i=1;i<brrs.length;i++){
                        if(brrs[i].data.ob_end_date.indexOf("-")<=0){
                            brrs[i].data.ob_end_date=brrs[i].data.ob_end_date.substr(0,4) + '-' + brrs[i].data.ob_end_date.substr(4,2) + '-' + brrs[i].data.ob_end_date.substr(6,2) ;
                        }
                        if(crrs['o_number']!=brrs[i]['data']['o_number']){
                            Ext.Msg.alert('提示信息','您多选的订单号不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_start_site']!=brrs[i]['data']['ob_start_site']){
                            Ext.Msg.alert('提示信息','您多选的出发口岸不一致，请重新选择');
                            return false;
                        }
                        if(brrs[0]['data']['ob_status']!=brrs[i]['data']['ob_status']){
                            Ext.Msg.alert('提示信息','您多选的出票状态不一致，请重新选择');
                            return false;
                        }
                        crrs['ob_id']+=','+brrs[i]['data']['ob_id'];
                        crrs['gaiqian']='gaiqian';
                    }
                }
            }
        }
        traffic_win.show();
        if(!parseFloat(crrs.ob_money))crrs.ob_money='';
        if(!parseFloat(crrs.ob_price))crrs.ob_price='';
        crrs.ob_sell_money=crrs.ob_sell_money>0?crrs.ob_sell_money:crrs.ob_money;
        console.log(crrs);
        traffic_form.getForm().setValues(crrs);
        if(v.text=='编辑票务'){
            traffic_win.setTitle('编辑票务', v.iconCls);
            if(!crrs.ob_name)Ext.getCmp('td_name').setValue('不用库存')
            Ext.getCmp('baoc').show();
        }else{
            traffic_win.setTitle('票务改签', v.iconCls);
            Ext.getCmp('baoc').hide();
        }
    }
    traffic_win.on('show',function(){
        var row=SUNLINE.getSelected(ob_grid);
        var ob_type_cm=row.data.ob_type+'座位';
        var berth_type_store=ob_berth_type_combo.box.getStore()
        var ob_pay_type_store=ob_pay_type_combo.box.getStore()
        SUNLINE.baseParams(berth_type_store,{d_type:ob_type_cm},true);
        berth_type_store.load();
        bc_form_store.load();
        ob_pay_type_store.load();
    })

    man_win.on('show',function(){
        var ob_ems_org_store=ob_ems_org_combo.box.getStore()
        ob_ems_org_store.load();
    })

    if(push_o_numver){
        Ext.getCmp('clos-id').on('click',function(){
            Ext.MessageBox.confirm('友情提示','你确定要关闭吗?',function(y){
                if(y=='yes'){
                    parent.CloseTab(true);
                }
            })
        })
        Ext.getCmp('ob_search').setValue(push_o_numver);
        SUNLINE.baseParams(ob_store,{o_number:push_o_numver});
        ob_store.currentPage=1;
        ob_store.load();
    }else{
        ob_store.currentPage=1;
        ob_store.load();
    }

    window.OrderDetail=function(number){
        parent.OpenTab('订单详情'+number, 'OrderDetail'+number, '', $__app__+'/OrderDetail/index/id/'+number, 1);
    }

    ziyo_log({ listeners : [{grid: ob_grid, action:'OrderBus', pk_id:'ob_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items :panel
    });







});
