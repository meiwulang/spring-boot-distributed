var ROW = {};
GUIDE_WORK = {};
var WG={};
var Row_data
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '报表管理';
    var pay_type_txt='付';
    if(type_id=='购物店')pay_type_txt='收';
    var sb_url = $__app__ + '/SettleBill/all_data_json';
    var sb_field = ["tpi_cs_id","tpi_name","tpi_spec","tpi_date","sign_num","cash_num","sign_money","cash_money"];
    var sb_store = SUNLINE.JsonStore(sb_url,sb_field,false);
    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:start_date,gang:'end_date',start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date',
        width:110,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:end_date,gang:'start_date'
    });

    function money_format(v){
        v=parseFloat(v);
        if(!v)v=0;
        return '￥'+ v.toFixed(2);
    }
    function num_format(v){
        v=parseFloat(v)?parseFloat(v):0;
        return v.toFixed(0);
    }
    function sign_cash_num(v,m,r){
        return parseFloat(r.get('sign_num'))+ parseFloat(r.get('cash_num'));
    }
    function sign_not_money(v,m,r){
        var not_money=parseFloat(r.get('not_money'))?parseFloat(r.get('not_money')):0;
        var sign_money=parseFloat(r.get('sign_money'))?parseFloat(r.get('sign_money')):0;
        var money=sign_money+not_money;
        return '<b style="color: green">'+money_format(money)+'</b>';
    }
    function date_format(v,format){
        return Ext.Date.format(v,format);
    }
    function date_mat(){
        return date_format(start_time.getValue(),'Y-m-d')+' 至 '+date_format(end_time.getValue(),'Y-m-d');
    }
    function sign_num_format(v){
        return '<b>'+num_format(v)+'</b>'
    }
    function sign_money_format(v){
        return '<b>'+money_format(v)+'</b>'
    }
    var sb_cm =[
        {header:"结算单位ID", dataIndex:"tpi_cs_id", width:240,xtype:'hidden'},
        {header:"结算单位", dataIndex:"tpi_name", width:240,align:'left'},
        {header:"起止日期", dataIndex:"tpi_date", width:180,align:'left',renderer:date_mat},
        {
            text:'导游应'+pay_type_txt,
            hidden:true,
            id:'sb_guide_id',
            columns:[
                {header:"数量", dataIndex:"sign_num", width:90,align:'center',renderer:sign_num_format},
                {header:"垫"+pay_type_txt+"金额", dataIndex:"out_money", width:100,align:'right', renderer:sign_money_format },
                {header:"签单金额", dataIndex:"sign_money_one", width:100,align:'right', renderer:sign_money_format },
                {header:"领用金额", dataIndex:"team_total_fee", width:100,align:'right', renderer:sign_money_format }
            ]
        },
        {
            text:'未生成',
            id:'sb_guide_nid',
            columns:[
                {header:"签单数量", dataIndex:"sign_num", width:90,align:'center',renderer:sign_num_format},
                {header:"现金数量", dataIndex:"cash_num", width:90,align:'center',renderer:num_format},
                {header:"数量小计", dataIndex:"sign_num", width:90,align:'center', renderer:sign_cash_num },
                {header:"签单", dataIndex:"sign_money", width:100,align:'right', renderer:sign_money_format },
                {header:"现金", dataIndex:"cash_money", width:100,align:'right', renderer:money_format }
            ]
        },
        {header:"未结金额", dataIndex:"not_money", width:100,align:'right',renderer:sign_money_format},
        {header:"应"+pay_type_txt+"总额", dataIndex:"sign_money", width:100,align:'right',renderer:sign_not_money}
    ];

    var items_type_box_id=SUNLINE.LocalComob({
        id:'tpi_settle_id',
        fields:['tpi_settle_id'],
        data:[['全部类型'],['签单'],['现金']],
        config:{
            width:180,
            fieldLabel:"结算类型",
            allowBlank:true,
            id:'tpi_settle_id',
            labelWidth:80,
            labelAlign:'right',
            labelSeparator:'：',
            value:'全部类型'
        }
    });
    var pay_type_val='支出';
    if(type_id=='购物店')pay_type_val='收入';
    var sb_grid = new Ext.grid.GridPanel({
        region : 'center',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: sb_store,//数据源
        columns: sb_cm,//表格列定义
        viewConfig:{
            emptyText:'没有账单信息',
            enableTextSelection:true,
            deferEmptyText:true
        },
        tbar:[
            '<b>'+type_id+'待处理账单：</b>',
            {text:'查看账单明细',iconCls: 'button-add',handler:settle_detail_show},'-',
            {xtype:"hidden",id:"pay_type",value:pay_type_val},
            {xtype:"hidden",id:"type_id",value:type_id},//住宿,其他,司机车辆,导游,应付社,景点,物品,购物店,餐饮
            /*{text:'大交通',id:'type_txt', xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '景点',handler:type_fn},
                        {text: '住宿',handler:type_fn},
                        {text: '餐饮',handler:type_fn},
                        {text: '物品',handler:type_fn},
                        {text: '大交通',handler:type_fn},
                        {text: '全陪导游',handler:type_fn},
                        {text: '地接导游',handler:type_fn},
                        /!*{text: '其他',handler:type_fn},*!/
                        /!*{text: '应付社',handler:type_fn},
                        {text: '购物店',handler:type_fn},*!/
                        {text: '司机车辆',handler:type_fn},
                        {text: '出发地接送',handler:type_fn}
                    ]
                }
            },*/
            '出团日期','-',
            start_time,' 至 ',end_time,
            items_type_box_id,
            {text:'查询',iconCls:'button-sch',handler:sreach_fn},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'u_Search',
                iconCls:'button-sch',
                emptyText : '结算单位',
                width:220,
                onTriggerClick:function(e){
                    sb_search();
                },
                listeners : {
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            sb_search();
                    }
                }
            }
        ]
    });

    //判断是地接导游还是其他项目
    sb_store.on({
        load:function(){
            var type_id=Ext.getCmp('type_id').getValue();
            if(type_id=='地接导游'){
                Ext.getCmp('sb_guide_id').setHidden(false);
                Ext.getCmp('sb_guide_nid').setHidden(true);
            }else{
                Ext.getCmp('sb_guide_id').setHidden(true);
                Ext.getCmp('sb_guide_nid').setHidden(false);
            }
        }
    });

    function type_fn(b){
        Ext.getCmp("type_txt").setText(b.text);
        Ext.getCmp("type_id").setValue(b.text);
    }

    function store_where(){
        return {
            pay_type:Ext.getCmp('pay_type').getValue(),
            type:Ext.getCmp('type_id').getValue(),
            start_date:date_format(start_time.getValue(),'Ymd'),
            end_date:date_format(end_time.getValue(),'Ymd'),
            settle_type:items_type_box_id.getValue()
        };
    }
    sreach_fn();
    function sreach_fn(b){
        var store_post=store_where();
        SUNLINE.baseParams(sb_store,store_post);
        sb_store.load();
    }


    function sb_search(){
        var store_post=store_where();
        store_post.skey = Ext.getCmp('u_Search').getValue();
        SUNLINE.baseParams(sb_store,store_post);
        sb_store.load();
    }


    var de_url = $__app__ + '/SettleBill/items_data_json';
    var de_field = ['team_id','team_num','team_p_num','team_p_name','team_p_series','team_start_date','team_type','tpi_num','sign_money','cash_money','put_money'];
    var de_store = SUNLINE.JsonStore(de_url,de_field,false);
    function detail_all_money(v,m,r){
        var sign=parseFloat(r.get('sign_money'))?parseFloat(r.get('sign_money')):0;
        var cash=parseFloat(r.get('cash_money'))?parseFloat(r.get('cash_money')):0;
        var put=parseFloat(r.get('put_money'))?parseFloat(r.get('put_money')):0;
        var sign_one=parseFloat(r.get('sign_money_one'))?parseFloat(r.get('sign_money_one')):0;
        var money=sign + cash+ put;
        if(r.get('tpi_spec')=='地接导游')money=sign+sign_one;
        return money_format(money);
    }
    function detail_date_format(v){
        if(!v)return '';
        return int2date(v);
    }
    function spec_fn(v,m,r){
        if(r.get('tpi_type')=='司机车辆'){
            return '司机：'+r.get('tpi_contacts');
        }else if(r.get('tpi_type')=='出发地接送'){
            return '<div class="trans_list_cls"> 司机：'+r.get('tp_driver_text')+'</div>';
        }else{
            return v;
        }
    }
    function name_text_fn(v,m,r){
        if(!v)return '';
        return '<div class="trans_list_cls"> '+v+'</div>';
    }
    function team_num(v,m,r){
        if(r.get('tpi_type')=='出发地接送'){
            var type_txt=' 出发 ';
            if(r.get('tp_type')=='返程')type_txt=' 抵达 ';
            var fly_txt='<br > <b style="color: darkred">'+ r.get('tp_fly_time')+'</b>'+type_txt+ r.get('tp_fly_number');
            if(!r.get('tp_fly_time'))fly_txt='';
            return '<b>'+int2float(r.get('tp_start_date'))+'</b> '+ r.get('tp_type')+fly_txt;
        }else{
            return v;
        }
    }
    function start_site_fn(v,m,r){
        if(!v)return '';
        if(r.get('tpi_type')=='大交通'){
            return '<div class="trans_list_cls"><font color="green">'+ r.get('ob_bus_number')+'</font> '+ r.get('ob_start_site')+'('+ r.get('ob_start_time')+')—'+ r.get('ob_end_site')+'('+ r.get('ob_start_time')+')</div>';
        }
    }
    function ti_remark_fn(v){
        if(!v)return '';
        return '<div class="trans_list_cls">'+v+'</div>';
    }

    function ob_start_date_fn(v){
        if(!v)return '';
        if(v=="<b>合计:</b>")return v;
        return '<b>'+ int2float(v)+'</b>';
    }
    var de_cm =[
        {header:"团队ID", dataIndex:"team_id",id:'team_id', width:40,hidden:true},
        {header:"团队编号", dataIndex:"team_num",id:'team_num', width:140,renderer:team_num},
        {header:"日期", dataIndex:"ob_start_date",id:'ob_start_date', width:60,renderer:ob_start_date_fn},
        {header:"团队名称", dataIndex:"team_p_name",id:'team_p_name', width:200,align:'left',renderer:name_text_fn},
        {header:"时间/航班次", dataIndex:"ob_start_site",id:'ob_start_site', width:300,align:'left',renderer:start_site_fn},
        {header:"项目", dataIndex:"tpi_spec",id:'tpi_spec', width:100,align:'left',renderer:spec_fn},
        {header:"类型", dataIndex:"ob_type",id:'ob_type', width:60,align:'left'},
        {header:"来源", dataIndex:"ob_source",id:'ob_source', width:60,align:'left'},
        {header:"状态", dataIndex:"ob_status",id:'ob_status', width:60,align:'left'},
        {header:"日期", dataIndex:"team_start_date",id:'team_start_date', width:100,align:'left',renderer:detail_date_format},
        {header:"地陪", dataIndex:"team_local_guide_name",id:'team_local_guide_name', width:100,align:'left'},
        {header:"数量", dataIndex:"tpi_num",id:'tpi_num', width:100,align:'center',renderer:num_format},
        {header:"垫"+pay_type_txt+"金额", dataIndex:"out_money",id:'out_money', width:100,align:'right',renderer:sign_money_format},
        {header:"签单金额", dataIndex:"sign_money_one",id:'sign_money_one', width:100,align:'right',renderer:sign_money_format},
        {header:"领用金额", dataIndex:"team_total_fee",id:'team_total_fee', width:100,align:'right',renderer:sign_money_format},
        {header:"签单金额", dataIndex:"sign_money",id:'sign_money', width:100,align:'right',renderer:sign_money_format},
        {header:"现金金额", dataIndex:"cash_money",id:'cash_money', width:100,align:'right',renderer:money_format},
        {header:"预"+pay_type_txt+"金额", dataIndex:"put_money",id:'put_money', width:100,align:'right',renderer:money_format},
        {header:"总流水", dataIndex:"tpi_money",id:'tpi_money', width:100,align:'right',renderer:money_format},
        {header:"应"+pay_type_txt+"总额", dataIndex:"sign_money", width:100,align:'right',renderer:detail_all_money},
        {header:"备注", dataIndex:"ti_remark",id:'ti_remark', width:200,align:'left',renderer:ti_remark_fn}
    ];
    var start_time_id=SUNLINE.ExtDateField({
        id:'start_date_id',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:start_date,gang:'end_date',start:true
    });
    var end_time_id=SUNLINE.ExtDateField({
        id:'end_date_id',
        width:110,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:end_date,gang:'start_date'
    });
    var items_type_box=SUNLINE.LocalComob({
        id:'tpi_settle',
        fields:['tpi_settle'],
        data:[['全部类型'],['签单'],['现金'],['预付']],
        config:{
            width:180,
            fieldLabel:"结算类型",
            allowBlank:true,
            id:'tpi_settle',
            labelWidth:80,
            labelAlign:'right',
            labelSeparator:'：',
            value:'全部类型'
        }
    });
    var de_grid = new Ext.grid.GridPanel({
        title:'账单',
        width:'100%',
        region:'east',
        border:false,//无边框
        loadMask: {msg : '数据传输中，请稍候...'},// 导入时显示loading
        store: de_store,//数据源
        columns: de_cm,//表格列定义
        collapsed:true,
        /*collapsible:true,*/
        bodyBorder: false,
        autoScroll : true,
        fixed:true,
        selModel:{
            selType: 'checkboxmodel', mode:'SIMPLE'
        },
        viewConfig:{
            emptyText:'没有账单信息',
            enableTextSelection:true,
            deferEmptyText:true
        },
        tbar:[
            {text:'确认生成账单',iconCls: 'button-add',handler:submit_gross,disabled:isDisabled("SettleBill::"+role_type+"_deal_create")},'-',
            {xtype:"hidden",id:"cs_id"},
            '出团日期：',start_time_id,' 至 ',end_time_id,'-',
            items_type_box,
            {text:'查询',iconCls:'button-sch',handler:detail_store},
            {text:'单团毛利',id:"gross_btn",iconCls:"button-print",handler:submit_account,disabled:isDisabled('TeamPlanItems::gross_btn')},
            {text:'关闭',iconCls:'button-del',handler:function(){
                de_grid.collapse();
            }},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'du_Search',
                iconCls:'button-sch',
                emptyText : '团队编号、地陪、团队名称',
                width:220,
                onTriggerClick:function(e){
                    db_search();
                },
                listeners : {
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            db_search();
                    }
                }
            }
        ],
        bbar:[
           { xtype:'tbtext',id:'bottom_money',style:'font-weight:bold;',text:'当前已选(共0笔)：现金:￥0.00；预付:￥0.00；<font color="red">签单:￥0.00；</font><font color="green">总金额:￥0.00</font>'}
        ]
    });

    function settle_detail_show(){
        var row=SUNLINE.getSelected(sb_grid);
        if(!row || row.get('tpi_name')=='<b>账单合计：</b>'){
            Ext.Msg.alert('友情提示','请选择需要生成就会账单的单位!');
            return false;
        };
        if(de_grid.getCollapsed())de_grid.expand();
        var type_id=Ext.getCmp('type_id').getValue();
        Ext.getCmp('gross_btn').setText('单团毛利');
        if(type_id=='地接导游'){
            hidden_show(['tpi_num','team_local_guide_name','put_money','cash_money','sign_money','ti_remark','ob_start_date','ob_start_site','ob_type','ob_source','ob_status','tpi_money'],true);
            hidden_show(['out_money','sign_money_one','team_total_fee'],false);
        }else if(type_id=='出发地接送'){
            hidden_show(['team_start_date','team_local_guide_name','out_money','sign_money_one','team_total_fee','put_money','ob_start_date','ob_start_site','ob_type','ob_source','ob_status','tpi_money'],true);
            hidden_show(['sign_money','cash_money','ti_remark'],false);
            Ext.getCmp('gross_btn').setText('交通明细表');
        }else if(type_id=='大交通'){
            hidden_show(['team_num','team_p_name','tpi_spec','team_start_date','team_local_guide_name','put_money','out_money','sign_money_one','team_total_fee','ti_remark','tpi_money'],true);
            hidden_show(['ob_start_date','ob_start_site','ob_type','ob_source','ob_status'],false);
            Ext.getCmp('gross_btn').setText('交通明细表');
        }else if(type_id=='购物店'){
            hidden_show(['tpi_num','team_local_guide_name','put_money','cash_money','sign_money','tpi_money'],false);
            hidden_show(['out_money','sign_money_one','team_total_fee','ti_remark','ob_start_date','ob_start_site','ob_type','ob_source','ob_status'],true);
        }else{
            hidden_show(['tpi_num','team_local_guide_name','put_money','cash_money','sign_money'],false);
            hidden_show(['out_money','sign_money_one','team_total_fee','ti_remark','ob_start_date','ob_start_site','ob_type','ob_source','ob_status','tpi_money'],true);
        }
        var date_str=date_mat();
        de_grid.setTitle(type_id+'：'+row.get('tpi_name')+'('+date_str+')账单');
        start_time_id.setValue(date_format(start_time.getValue(),'Y-m-d'));
        end_time_id.setValue(date_format(end_time.getValue(),'Y-m-d'));
        Ext.getCmp('cs_id').setValue(row.get('tpi_cs_id'));
        detail_store();
    }

    /**
     * 隐藏或显示头部
     * @param data
     * @param key
     */
    function hidden_show(data,key){
        for(var i=0;i<data.length;i++){
            Ext.getCmp(data[i]).setHidden(key);
        }
    }

    function detail_store(){
        var detail_post=detail_where();
        SUNLINE.baseParams(de_store,detail_post);
        de_store.load();
    }

    function detail_where(){
        return {
            cs_id:Ext.getCmp('cs_id').getValue(),
            start_date:date_format(start_time_id.getValue(),'Ymd'),
            end_date:date_format(end_time_id.getValue(),'Ymd'),
            pay_type:Ext.getCmp('pay_type').getValue(),
            type:Ext.getCmp('type_id').getValue(),
            settle_type:Ext.getCmp('tpi_settle').getValue()
        };
    }

    function db_search(){
        var detail_post=detail_where();
        detail_post.skey = Ext.getCmp('du_Search').getValue();
        SUNLINE.baseParams(de_store,detail_post);
        de_store.load();
    }

    //单团毛利操作(start)
    //单团毛利
    var print_height=Ext.getBody().getHeight()-50;
    var print_win = new Ext.Window({
        title:'单团毛利',
        width:800,
        height:print_height,
        backColor:'#ffffff',
        bodyStyle:"background:#ffffff",
        closeAction : 'hide',
        id:"print_id",
        resizable:false,
        maximizable : true,//全屏效果
        modal:true,
        html:'<iframe id="ifm_print" name="ifm_print" src="" width="100%" style=" height: '+print_height+';" frameborder=0></iframe>',
        buttons: [
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){print_win.hide();}}
        ]
    });

    //单团毛利打印
    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }


    function submit_account(b){
        var row = SUNLINE.getSelected(de_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        Row_data=row.data;
        var url='',title='';
        if(b.text == "单团毛利"){
            url = $__app__ + '/TeamPlanItems/team_print?_dc=' + time()+'&team_id='+Row_data.team_id;
            title="单团毛利 导游:"+Row_data.team_local_guide_name+Row_data.team_local_guide_tel+" 团队编号:"+Row_data.team_num;

        }else if(b.text=='交通明细表'){
            url = $__app__ + '/TeamPlanItems/bus_trans_print?_dc=' + time()+'&tp_id='+Row_data.team_id;
            title= b.text+" 线路:"+Row_data.team_p_name;
        }
        if(!url)return false;
        print_win.show();
        Ext.getCmp("print_id").setTitle(title);
        window.ifm_print.location = url;
    }

    //对选中的项目进行操作
    de_grid.getSelectionModel().on('selectionchange',function(t,r){
        var money=get_select();
        var all_money=money.cash+money.put+money.sign;
        Ext.getCmp('bottom_money').setText('当前已选(共'+money.id.length+'笔)：现金:￥'+(money.cash).toFixed(2)+'；预付:￥'+(money.put).toFixed(2)+
            '；<font color="red">签单:￥'+(money.sign).toFixed(2)+'；</font><font color="green">总金额:￥'+all_money.toFixed(2)+'</font>');
    });

    //对选单位时操作
    sb_grid.getSelectionModel().on('select',function(t,r){
        var row= r.data;
        var date_str=date_mat();
        de_grid.setTitle(Ext.getCmp('type_id').getValue()+'：'+row.tpi_name+'('+date_str+')账单');
    });

    /**
     * 统计已选中的信息
     * @returns {{sign: number, cash: number, put: number, id: Array}}
     */
    function get_select(){
        var rows=de_grid.getSelectionModel().getSelection();
        var money={sign:0,cash:0,put:0,id:[],num:0,td_id:[],ob_id:[]};
        Ext.each(rows,function(v,i){
            var row= v.data;
            var put=parseFloat(row.put_money)?parseFloat(row.put_money):0;
            var cash=parseFloat(row.cash_money)?parseFloat(row.cash_money):0;
            var sign=parseFloat(row.sign_money)?parseFloat(row.sign_money):0;
            if(row.team_num!='<b>合计:</b>' && row.ob_start_date!='<b>合计:</b>'){
                money.sign+=sign;
                money.cash+=cash;
                money.put+=put;
                money.num+=parseFloat(row.tpi_num);
                money.id.push(row.team_id);
                if(row.td_id)money.td_id.push(row.td_id);
                if(row.ob_id)money.ob_id.push(row.ob_id);
            }
        });
        return money;
    }

    //生成账单
    function submit_gross(b){
        var money=get_select();
        if(money.id.length<=0){
            Ext.Msg.alert('友情提示', '请选择需要生成账单的明细!');
            return;
        }
        var row=SUNLINE.getSelected(sb_grid);
        row=row.data;
        var pay_type=Ext.getCmp('pay_type').getValue();
        pay_type=pay_type=='支出'?1:2;
        var org_type=Ext.getCmp('type_id').getValue();
        var post_row={
            team_id:Ext.encode(money.id),
            td_id:Ext.encode(money.td_id),
            ob_id:Ext.encode(money.ob_id),
            sb_org_id:row.tpi_cs_id,
            sb_org_name:row.tpi_name,
            sb_org_type:org_type,
            sb_type:pay_type,
            sb_num:money.num,
            sb_amount:(money.cash+money.put+money.sign),
            sb_repay_amount:(money.cash+money.put)
        };
        if(org_type=='地接导游')post_row.sb_amount=money.sign;
        Ext.MessageBox.confirm('友情提示','你确定需要生成账单吗?',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__ + '/SettleBill/save',
                method: 'POST',
                params: post_row,
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    ExtAlert( msg );
                    myMask.hide();
                    if (ret.status==1){
                        de_store.reload();
                        de_grid.collapse();
                        sb_store.load();
                    }
                },
                failure : function(response, opts){
                    myMask.hide();
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }

    var Panel = Ext.create('Ext.panel.Panel',{
        region:'center',
        layout :'border',
        items:[sb_grid,de_grid]
    });


    new Ext.Viewport({
        layout : 'border',
        items : [Panel]
    });


});
