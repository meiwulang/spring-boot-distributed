var WG={};
var _tpi_type = {"guide":"导游","hotel":"住宿","car":"交通","scenic":"景点","meals":"餐饮","shop":"购物店","goods":"物品","restore":'应付社'};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '导游报账管理';
    var si_url = $__app__ + '/TeamPlanItems/select_data';
    var si_field = [{name:"si_id"}];
    var si_store = new SUNLINE.JsonStore(si_url, si_field);

    //签单/回执单
    function receipt_mod(v,m,r){
        if(v)return '<span title="'+v+'">'+v+'</span>';
    }
    //线路名称
    function series_num_fn(v,m,r){
        var txt=r.get('team_p_series')+'-'+ r.get('team_p_num');
        if(r.get('team_type')=='团队订单'){
            txt='【'+r.get('team_p_name')+'】'+r.get('team_p_series')+'-'+ r.get('team_p_num');
        }else{
            txt=r.get('team_p_series')+'-'+ r.get('team_p_num');
        }
        return txt;
    }
    //出团日期
    function start_date_fn(v,m,r){
        var time=r.get('team_start_date').substr(0,4) + '-' + r.get('team_start_date').substr(4,2) + '-' + r.get('team_start_date').substr(6,2);
        return time;
    }
    //全陪导游
    function guide_quan(v, m, r, ri, ci){ return get_items_guide_detail('全陪导游', v); }
    //地接导游
    function guide_dijie(v,m,r){
        return get_items_guide_detail('地接导游', v);
        var local=get_items_guide_detail('地接导游', v);
        var all=get_items_guide_detail('全陪导游', v);
        var txt='';
        if(local)txt+='<div class="al-left"><font color="#6495ed">地陪：</font>'+local+'</div>';
        if(all)txt+='<div class="al-left"><font color="orange">全陪：</font>'+all+'</div>';
        return txt;
    }

    function survey_name_fn(v,m,r){
        var txt='';
        if(r.get('team_survey_name'))txt+='<div class="al-left"><font color="green">审核：</font>'+r.get('team_survey_name')+'</div>';
        if(r.get('team_user'))txt+='<div class="al-left"><font color="#da70d6">发团：</font>'+r.get('team_user')+'</div>';
        return txt;
    }
    //司机车辆
    function drivers(v, m, r){ return get_items_name('交通', v, m); }
    //导游显示
    function get_items_guide_detail(type, v,cls){
        var txt = '<span style="color:#666;">未安排</span>';
        try{
            if (typeof v == 'object'){
                var _t = v['导游'].tpi_name.split('<br>'), _p=[];
                for ( var i=0; i<_t.length; i++){
                    var _m = _t[i].split('：');
                    if (_m[0]==type) {
                        var _e = _m[1].split(' ');
                        if(cls=='detail'){
                            _p.push(_m[1]);
                        }else{
                            _p.push( '<span data-qtip="'+ _m[1] +'">'+ _e[0] +'</span>' );
                        }
                    }
                }
                txt = _p.join('、');
            }
        }catch(e){ }
        return txt;
    }
    //车辆司机显示
    function get_items_name(type, items, m){
        var txt = '<span style="color:#666;">未安排</span>', qtip = 'data-qtip="' + type + '：未安排"';
        if (typeof items == 'object') {
            var nd = items[type];
            if (nd){
                var tmp = nd.tpi_name;
                qtip = 'data-qtip="<b>'+type+'：共'+ nd.num +'项</b><br>'+ tmp +'"';
                txt = tmp.replace(/：(.*?)<br>/g, '、').replace(/：(.*?)$/, '');
            }
        }
        m.tdAttr = qtip;
        return txt;
    }
    //审核状态显示
    function team_status(v,m,r){
        var html_cls='';
        if(!v)v='未报账';
        if(v=='报账中')v='审核中';
        switch (v){
            case '未报账':
                html_cls='<font class="tm-status red-cls">'+v+'</font>';
                break;
            case '报账中':
                html_cls='<font class="tm-status blue-cls">'+v+'</font>';
                break;
            case '审核中':
                var team_time=[
                    {id:'team_survey_time',text:'计调'},
                    {id:'team_finance_time',text:'财务'}
                ];
                for(var ti=0;ti<team_time.length;ti++){
                    var tm_row=team_time[ti];
                    if(r.get(tm_row.id) && r.get(tm_row.id)!=0){
                        html_cls+='<font class="tm-status green-cls" title="'+tm_row.text+'审核通过">'+tm_row.text+'</font>';
                    }else{
                        html_cls+='<font class="tm-status gray-cls" title="'+tm_row.text+'未审核">'+tm_row.text+'</font>';
                    }
                }
                break;
            case '已完成':
                html_cls='<font class="tm-status green-cls">已完成</font>';
                break;
            case '已驳回':
                html_cls='<font class="tm-status red-cls"><b>已驳回</b></font>';
        }
        return html_cls;
    }
    //金额显示
    function money_g(v,m,r){
        if(!v) v = "0.00";
        return '￥'+ (parseFloat(v).toFixed(2));
    }

    function money_gg(v,m,r){
        if(!v) v = "0.00";
        return '<font data-qtip="实际订单收入按【已完成】为准!">￥'+(parseFloat(v).toFixed(2))+'</font>';
    }

    function gross_fn(v,m,r){
        v=money_g(v);
        if(r.get('team_credit_status')=='已完成'){
            return '<font style="color:green">'+v+'</font>';
        }else{
            return '<font style="color:#999" data-qtip="实际毛利费用按【已完成】为准!">'+v+'</font>';
        }
    }

    function guide_fn(v,m,r){
        v=money_g(v);
        if(r.get('team_credit_status')=='已完成'){
            return '<font style="color:green">'+v+'</font>';
        }else{
            return '<font style="color:#999" data-qtip="实际团队余额按【已完成】为准!">'+v+'</font>';
        }
    }
    function show_product(v,i,r){
        var team_num = r.get('team_num'), label = r.get('team_label_items'), tg = '_blank', p_num = r.get('team_p_num'),
            tn= '<br><span style="font-weight: bold;color: '+ (team_num?'blue':'#ccc') +'">'+ (team_num?team_num:'未生成计划') +'</span>';
        var url='';
        var text='';
        if(r.data.team_type=='跟团游'){
            var enid = r.get('encode_p_id');
            var url = $__app__+"/detail.html?p_id="+enid;
            text='['+ p_num +']';
        }else{
            url = $__app__+'/TeamList/PrintTeam/num/'+ r.data.team_p_num;
        }
        if (r.get('team_p_id')==='0') {
            url = '#'; tg = '_self'; p_num = 'PIN';
        }
        var txt='';
        if(text){
            txt = '<a href = "'+url+'" target = "'+ tg +'" title="'+ r.data.team_p_series +'" >'+ text +'<span data-qtip="'+v+'">'+ v+'</span> </a>';
        }else{
            txt = '<a href = "'+url+'" target = "'+ tg +'" data-qtip="'+v+'">'+ v +' </a>';
        }
        var lb_txt = [];
        if (label) lb_txt = show_label(label);
        return txt + tn + lb_txt.join('');
    }

    var si_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"team_id", dataIndex:"team_id", width:50, hidden:true},
        {header:"状态", dataIndex:"team_credit_status", width:150,renderer:team_status},
        {header:"发团日期", dataIndex:"team_start_date", width:90,renderer:start_date_fn},
        {header:"产品信息",dataIndex:"team_p_name",width:310, sortable:false, renderer:show_product},
        {header:"地陪",dataIndex:"team_local_guide_name",width:70, align:'center', menuDisabled:true, sortable:false},
        {header:"全陪",dataIndex:"team_guide_name",width:70, align:'center', menuDisabled:true, sortable:false},
        {header:"人数",dataIndex:"team_saled",width:50, menuDisabled:true, sortable:false,align:'center'},
        {header:"发团计调", dataIndex:"team_user", width:75},
        {header:"审核计调", dataIndex:"team_survey_name", width:75},
        {header:"签单/回执单", dataIndex:"team_receipt", width:120, renderer:receipt_mod},
        {header:"订单收入 <i class='fa fa-question-circle'></i>", dataIndex:"team_order_money", width:100,renderer:money_gg,align:"right",tooltip:"实际订单收入按【已完成】为准!"},
        {header:"毛利 <i class='fa fa-question-circle'></i>", dataIndex:"team_gross_money", width:100,renderer:gross_fn,align:"right",tooltip:"实际毛利费用按【已完成】为准!"},
        {header:"团队余额 <i class='fa fa-question-circle'></i>", dataIndex:"team_surplus_money", width:100,renderer:guide_fn,align:"right",tooltip:"实际团队余额按【已完成】为准!"}
    ];
    //选择产品
    var Products_OrgCombo=SUNLINE.OrgCombo_Products({listConfig:{minWidth:320},name:'p_name',valueField:'p_id',id:'p_name_id',width:245,listWidth:250,editable:true,forceSelection:true,where: {source: 'order',order_type:'seller'},});
    var Products_store=Products_OrgCombo.box.getStore();
    Products_store.on('load',function(a,b,c){
        this.add({p_name:'全部产品',p_id:'全部产品'});
        for(var i in b){
            this.add(b[i]['data']);
        }
        Ext.getCmp('p_name_id').setValue('全部产品');
    });

    var isHidden = _uinfo.org_type=='管理公司' ? false : true;
    var conf_s = {
        hidden:isHidden,
        displayField:'text',
        valueField:'id',
        id:'team_org_id',
        labelWidth:60,
        fieldLabel:'所属单位',
        hiddenName:'team_org_id',
        width:400,
        pageSize:20,
        value:'',
        listConfig:{
            width:400,
            minWidth:300,
            maxWidth:500
        },
        labelAlign:'right'
    };
    var company_config=Ext.apply(conf_s,{});
    var company_box= SUNLINE.CompanyBox({
        where:{  org_type:'供应商',source:'order' },
        config:company_config
    });
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "供应商",tel:'120'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    });
    company_box.on('select',function(c,r){
        load_where({});
    });

    var si_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        columns:si_cm,
        store:si_store,
        cls:'tpi_cls',
        style:'border-top:2px solid #3892d3',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有导游报账信息',
            enableTextSelection:true,
            deferEmptyText:true
        },
        tbar:[
            {text:'报账',id:"reimbursed_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::reimbursed_btn')},
            "-",
            /*{text:'相关审核',iconCls:"button-sch", xtype:'splitbutton',
                menu:{
                    items:[
                        {text:'计调审核',id:"tour_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::tour_btn')},
                        "-",
                        {text:'房调审核',id:"real_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::real_btn')},
                        "-",
                        {text:'财务审核',id:"finance_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::finance_btn')},
                        "-",
                        {text:'撤销审核',id:"recall_btn",handler:down_modify, disabled:isDisabled('TeamPlanItems::recall_btn')}
                    ]
                }
            },*/
            {text:'计调审核',id:"tour_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::tour_btn')},
            "-",
            {text:'财务审核',id:"finance_btn",handler:submit_modify, disabled:isDisabled('TeamPlanItems::finance_btn')},
            "-",
            {text:'撤销审核',id:"recall_btn",handler:down_modify, disabled:isDisabled('TeamPlanItems::recall_btn')},
            "-",
            {text:'查看明细',handler:submit_modify},
            "-",
            {text:'查看凭证',handler:image_account},
            "-",
            {text:'单团毛利',id:"gross_btn",handler:submit_account, xtype:'splitbutton',disabled:isDisabled('TeamPlanItems::gross_btn'),
                menu:{
                    items:[
                        {text: '更新毛利',id:"gross_money_id",iconCls:'button-view',handler:submit_gross, disabled:isDisabled('TeamPlanItems::gross_btn')}
                    ]
                }
            },
            "-",
            {text:'标记为...', id:'label_btn' },
            "-",
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'导游、手机号、团队编号',
                width:180,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            dosearch();
                    }
                }
            }
        ],
        listeners:{
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            }
        },
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:si_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有导游报账信息',
            items:[
                company_box,
            ],
        })
    }
    );
    //选中每条出团计划单
    si_grid.on({
        select:function(v,r,ni,e){
            var rw= r.data;
            var td_status = rw.team_credit_status;
            var bool={dis_true:[],dis_false:[]};
            if(rw.team_survey_time==0)rw.team_survey_time='';
            //1.未报账的状态：未报账 or 已驳回
            if(td_status=='未报账' || td_status=='已驳回'){
                bool.dis_true=['tour_btn','finance_btn','recall_btn'];
                bool.dis_false=['reimbursed_btn'];
            }
            if(td_status=='报账中'){
                bool.dis_true=['reimbursed_btn','finance_btn'];
                bool.dis_false=['tour_btn','recall_btn'];
            }
            //4.财务审核状态：审核中，计调已经审核通过
            if(td_status=='审核中' && rw.team_survey_time){
                bool.dis_true=['reimbursed_btn','tour_btn'];
                bool.dis_false=['finance_btn','recall_btn'];
            }else if(td_status=='审核中' && !rw.team_survey_time){
                bool.dis_false=['tour_btn','recall_btn'];
            }
            //5.已完成
            if(td_status=='已完成'){
                bool.dis_true=['tour_btn','finance_btn','reimbursed_btn','recall_btn'];
                if(!isDisabled('TeamPlanItems::finance_btn')){
                    bool.dis_false=['recall_btn'];
                }
            }
            disabled_bool(bool);
        }
    });

    /**
     * 根据权限判断是否启用
     * @param data
     */
    function disabled_bool(data){
        var b_true=data.dis_true;
        var b_false=data.dis_false;
        for(var ti=0;ti<b_true.length;ti++){
            var true_id=b_true[ti];
            Ext.getCmp(true_id).setDisabled(true);
        };
        for(var fi=0;fi<b_false.length;fi++){
            var false_id=b_false[fi];
            var f_type=false;
            if(isDisabled('TeamPlanItems::'+false_id))f_type=true;
            Ext.getCmp(false_id).setDisabled(f_type);
        }
    }

    var _panel = new Ext.Panel({
        layout : 'border',
        region:'center',
        border:false,
        tbar: [
            '选择产品:',
            Products_OrgCombo.box,
            '出团时间:',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_start_time',name:'t_start_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_end_time',start:true}),
            '~',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_end_time',name:'t_end_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_start_time'}),
            "-",
            {text:'查询全部',id:"search_cls",iconCls:"searchico",handler:fast_search, xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '查询全部',handler:fast_search},
                        {text: '未报账',handler:fast_search},
                        {text: '报账中',handler:fast_search},
                        {text: '审核中',handler:fast_search},
                        {text: '已完成',handler:fast_search}
                    ]
                }
            },
            "-",
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            {text:'查看备注',id:'remark_bottom2',handler:remarkSelect},
            {text:'导出数据',iconCls:'button-excel',handler:download_excel, disabled:isDisabled('TeamPlanItems::derive_xls')},
            {text:'利润表',iconCls:'button-excel',handler:profit_download_excel, disabled:isDisabled('TeamPlanItems::profit_excel_data')}
        ],
        items : [si_grid]
    });

    //下载利润表
    function profit_download_excel(b){
        var data=items_where({});
        if(data.team_credit_status != '已完成'){
            Ext.Msg.alert('友情提示','利润表下载需要选择【已完成】状态！');
            return false;
        }
        var url=[];
        for(var k in data){
            var row=data[k];
            if(row&&row!='全部产品'){
                url.push(k);
                url.push(row);
            }
        }
        if(url.length>0)url=url.join('/');
        window.location = $__app__+'/TeamPlanItems/profit_excel_data/'+url;
    }

    //按不同状态进行查询
    function fast_type(b){
        Ext.getCmp("type_cls").setText(b.text);
        load_where({});
    }

    //按不同状态进行查询
    function fast_search(b){
        Ext.getCmp("search_cls").setText(b.text);
        load_where({});
    }

    function load_where(data){
        data=items_where(data);
        SUNLINE.baseParams(si_store,data);
        si_store.currentPage=1;
        si_store.load();
    }

    //操作报账明细(start)
    var items_url=$__app__ + '/TeamPlanItems/json_items_json';
    var items_field = [{name:"tpi_id"}];
    var items_store=SUNLINE.GroupingStore(items_url,items_field,{sortInfo:{field:'tpi_order'}, groupField:'tpi_type'},false);
    var items_grouping = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: ['',"<span class='items-box-id'><span class='items-group-right'>{rows:this.values_rows}</span><font color='blue'>{rows:this.values_name}</font> (共 {[values.rows.length]} 个项目)</span>",{
            values_rows:function(row){
                if(row.length>0){
                    return store_money_json(row);
                }
                return '';
            },
            values_name:function(row){
                var items_type='';
                Ext.each(row,function(v,i){
                    var rw=v.data;
                    items_type=rw.tpi_type;
                })
                return items_type;
            }
        }]
    });
    function num_max_len(num){
        var nv=parseInt(num*1000), ns = nv.toString();
        var last = ns.substr(ns.length-1,1);
        if (last==0) return num;
        return Math.ceil(num*100)/100;
    }

    //金额数据组织
    function store_money_json(row){
        var sign_money= 0,sign_num=0,cash_money= 0,cash_num=0,all_money= 0,type='',run_money=0;
        Ext.each(row,function(v,i){
            var rw=v.data;
            var price=data_str_int(rw,'tpi_price'),
                money=data_str_int(rw,'tpi_money'),
                tpi_num=data_str_int(rw,'tpi_num');

            //如果是购物店计算不一样
            if(rw.tpi_type=='购物店'){
                money=(rw.tpi_price*rw.tpi_num)+(rw.tpi_money*(rw.tpi_percent/100));
                money=parseFloat(money)?parseFloat(money):0;
                money=num_max_len(money);
                run_money+=parseFloat(rw.tpi_money);
            }
            //if(rw.tpi_pay_type=='收入'){ money=0-money;}
            if(rw.tpi_settle=='现金'){
                cash_money+=money;
                cash_num+=1;
            }else{
                sign_money+=money;
                sign_num+=1;
            };
            all_money+=money;
            type=rw.tpi_type;
        });
        // if(in_array(type,['购物店','应付社'])!=-1){
        //     cash_money=0-cash_money;
        //     sign_money=0-sign_money;
        //     all_money=0-all_money;
        // }
        var json={cash_num:cash_num,cash_money:cash_money,sign_num:sign_num,sign_money:sign_money,all_money:all_money};
        var json_txt='现金('+json.cash_num+'笔):<font color="green">￥'+json.cash_money.toFixed(2)+'</font>　' +
            '签单('+json.sign_num+'笔):<font color="#ff4500">￥'+json.sign_money.toFixed(2)+'  </font>　' +
            '总金额:<font color="#6495ed">￥'+json.all_money.toFixed(2)+'</font>';
        if(run_money > 0){json_txt=json_txt+'　总流水:'+run_money.toFixed(2)}
        return json_txt;
    }

    //价格显示
    function si_settle_fn(v,i,r){
        if(!v)return '';
        var co = '';
        var tt = '';
        if(r.data.tpi_add_type==0 && r.data.tpi_old_price > 0){
            co = 'blue';
            if(r.data.tpi_type=='交通'){
                tt = '原价:￥'+(r.data.tpi_old_price*r.data.tpi_num).toFixed(2);
            }else{
                tt = '原价:￥'+r.data.tpi_old_price;
            }
        }
        if(r.data.tpi_type=='购物店'){
            //提成=总额*百分比
            var money=(r.get("tpi_money")*(r.get('tpi_percent')/100)).toFixed(2);
            return '<font title="提成='+ r.get("tpi_money")+'*'+ r.get('tpi_percent')+'%='+money+'">提:'+money+'</font>';
        }else if(r.data.tpi_type=='交通'){
            return '<font color="'+co+'" title="'+tt+'">￥'+ r.data.tpi_money+'</font>';
        }else{
            return '<font color="'+co+'" title="'+tt+'">￥'+ v +'</font>';
        }
    }


    function tpi_num_fn(v,n,r){
        if(!v)return '';
        if(r.data.tpi_type=='购物店'){
            //提成=单价*数量
            var money=(r.get("tpi_price")*r.get('tpi_num')).toFixed(2);
            return '<font title="人头='+ r.get("tpi_price")+'*'+ r.get('tpi_num')+'人='+money+'">人:'+money+'</font>';
        }else if(r.data.tpi_type=='交通'){
            return 1.0;
        }
        v=parseFloat(v)?parseFloat(v):0;
        return '<b>'+ v.toFixed(1)+'</b>';
    }
    function money_fn(v,n,r){
        if(!v)return '';
        var clr='green';
        if(r.get('tpi_pay_type')=='收入')clr='red';
        v=parseFloat(v)?parseFloat(v):0;
        //money=(rw.tpi_price*rw.tpi_num)+(rw.tpi_money*(rw.tpi_percent/100));
        if(r.data.tpi_type=='购物店') v=(r.get("tpi_price")*r.get('tpi_num'))+(r.get("tpi_money")*(r.get('tpi_percent')/100));
        return '<font color="'+clr+'"><b>￥'+ v.toFixed(2)+'</b></font>';
    }
    function settle_fn(v,n,r){
        if(!v)return '';
        var cls='#000';
        if(r.get('tpi_settle')=='现金')cls='#ff9036';
        return '<font color="'+cls+'">'+v+'</font>';
    }
    function contacts_fn(v,n,r){
        if(!v)return '';
        var tel='('+ r.get('tpi_tel')+')';
        if(!r.get('tpi_tel'))tel='';
        return v+tel;
    }
    function attach_fn(v){
        if(!v)return '';
        if(v.length>0){
            return '<span class="button-jpeg" data-qtip="当前有'+ v.length+'个附件"></span>';
        }
    }
    function remark_fn(v){
        if(!v)return '';
        return '<span data-qtip="'+v+'">'+v+'</span>';
    }

    var items_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"tpi_team_id", dataIndex:"tpi_team_id", width:10,hidden:true},
        {header:"tpi_id", dataIndex:"tpi_id", width:10,hidden:true},
        {header:"单位ID", dataIndex:"tpi_cs_id", width:10,hidden:true},
        {header:"资源类型", dataIndex:"tpi_type", width:10,hidden:true},
        {header:"项目名称", dataIndex:"tpi_name", width:130},
        {header:"规格说明", dataIndex:"tpi_spec", width:100,renderer:title_show},
        {header:"单价<i class='fa fa-question-circle'></i>", dataIndex:"tpi_price", width:80,align:'right',renderer:si_settle_fn,tooltip:"蓝色表示导游修改过该价格"},
        {header:"数量", dataIndex:"tpi_num", width:80,align:'center',renderer:tpi_num_fn},
        {header:"购物流水", dataIndex:"tpi_money",id:'tpi_money_id', width:100,align:'right',renderer:money,hidden:true},
        {header:"总金额", dataIndex:"tpi_money", width:100,align:'right',renderer:money_fn},
        {header:"结算类型", dataIndex:"tpi_settle", width:80,align:'center',renderer:settle_fn},
        {header:"交易类型", dataIndex:"tpi_pay_type", width:80,align:'center',hidden:true},
        {header:"联系人", dataIndex:"tpi_contacts", width:140,renderer:contacts_fn},
        {header:"签单编号", dataIndex:"tpi_sign_number", width:100},
        {header:"符件", dataIndex:"tpi_attach", width:58,renderer:attach_fn},
        {header:"备注", dataIndex:"tpi_remark", width:160,renderer:remark_fn}
    ];

    var _tpi_type_menu = Ext.create('Ext.menu.Menu',{});
    var items_type_store = new Ext.data.Store({
            fields:['text','id'],
            data:[],
    })
    load_tpi_menu('支出');
    var items_pay_type=SUNLINE.LocalComob({
        id:'items_pay_type',
        fields:['text','id'],
        data:[
            {id: '全部', text: '全部'},
            {id: '签单', text: '签单'},
            {id: '现金', text: '现金'},
        ],
        config:{
            fieldLabel:'结算类型',
            editable:false,
            valueField:'id',
            displayField:'text',
            id:'items_pay_type',
            name:'items_pay_type',
            labelWidth:60,
            labelAlign:'right',
            width:180,
            value:'全部'
        }
    });
    var items_type_id = Ext.create('Ext.form.ComboBox', {
        id: 'items_type_id',
        fieldLabel: '项目类型',
        labelWidth: 60,
        labelAlign: 'right',
        store: items_type_store,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'id',
        emptyText: '全部',
        width: 180,
        value:'全部',
        editable:false,
        listeners: {
            select:function(c,r){
                items_store_load();
            },
        }
    });


    var _grid={
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:items_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目',
            deferEmptyText:true,
            enableTextSelection:true
        },
        features: [items_grouping],
        columns:items_cm,
        tbar : [
            {text:'添加',id:"add_items_id",iconCls:"button-add",cls_id:'add_items_id',
                menu:_tpi_type_menu
            },
            {text:'编辑',iconCls:'button-edit',id:'edit_items_id',act:'edit',act_type:'编辑',handler:add_modify},
            {text:'删除',iconCls:'button-del',id:'del_items_id',handler:items_del},
            {text:'刷新',iconCls:'button-ref',handler:function(){ items_store.load(); }},
            '->',
            items_type_id,
            '-',
            items_pay_type,
            '-',
            {xtype:"hidden",id:"items_pay_time",value:'支出'},
        ]
    };
    var items_grid=new Ext.grid.GridPanel(_grid);
    items_store.on({
        load:function(){
            var it_id=Ext.getCmp('items_type_id').getValue();
            if(it_id=='购物店'){
                Ext.getCmp('tpi_money_id').setHidden(false);
            }else{
                Ext.getCmp('tpi_money_id').setHidden(true);
            }
        }
    });

    var tabp = Ext.create('Ext.tab.Panel', {
        region: 'north',
        //plain: true,
        listeners: {
            tabchange: function(tabs, newTab, oldTab) {
                Ext.getCmp('items_pay_time').setValue(newTab.title);
                load_tpi_menu(newTab.title);
                items_store_load();
            }
        },
        items: [{
            title: '支出',
        }, {
            title: '收入',
        }]
    });

    //操作报账明细(end)
    var bz_win=new Ext.Window({
        width:1080,
        height:500,
        closeAction:'hide',
        resizable:true,
        modal:true,
        items:[tabp,items_grid],
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'border',
        maximizable : true,//全屏效果
        buttons:[
            { xtype:'tbtext',id:'bottom_money',style:'font-weight:bold;',text:'现金(0笔):￥0.00；签单(0笔):￥0.00；总金额:￥0.00'},
            '->',
            {text:'当前状态',hidden:true,id:'status_bottom'},
            {text:'提交审核',id:'one_bottom',handler:down_modify, hidden:isDisabled('TeamPlanItems::recall_btn')},
            {text:'保存草稿',id:'two_bottom',handler:bz_dosave},
            {text:'查看备注',id:'remark_bottom',handler:remarkSelect},
            {text:'关闭', handler:function () {
                bz_win.hide();
            }}
        ]
    });

    //审核与驳回处理(start)
    var deal_form = Ext.create('Ext.form.Panel', {
        bodyStyle : 'padding:8px;',
        defaultType : 'textfield',
        defaults : {labelWidth:90, labelAlign:'right', labelSeparator:'：', anchor:'95%'},
        items : [
            {name:"team_id",fieldLabel:"所属计划单",xtype:"hidden"},
            {name:"dl_title",fieldLabel:"操作说明",readOnly:true},
            {id:'dl_remark',name:"dl_remark",fieldLabel:"备注",xtype:'textarea'}
        ]
    });

    var deal_win = Ext.create('Ext.Window', {
        title : '选择景点',
        layout : 'fit',
        width : 500,
        modal : true,
        id:'dl_tmid',
        closeAction : 'hide',
        items : deal_form,
        listeners : {
            hide : function(w){ deal_form.getForm().reset(); }
        },
        buttons : [
            {text:'确认保存', handler:deal_vf},
            {text:'关闭', handler:function(){ deal_win.hide();}}
        ]
    });
    //审核与驳回处理(end)

    //驳回审核信息处理(start)
    var down_store = new Ext.data.Store({
        fields:['text'],
        date:[]
    })
    var down_type_box = Ext.create('Ext.form.ComboBox', {
        id: 'dl_title_down',
        name:'dl_title',
        fieldLabel: "<span style='color:red'> * </span>撤消至",
        labelWidth: 90,
        labelAlign: 'right',
        store: down_store,
        queryMode: 'local',
        displayField: 'text',
        valueField: 'text',
        value:'请选择',
        editable:false,
    });

    var down_form = Ext.create('Ext.form.Panel', {
        bodyStyle : 'padding:8px;',
        defaultType : 'textfield',
        defaults : {labelWidth:90, labelAlign:'right', labelSeparator:'：', anchor:'95%'},
        items : [
            {name:"team_id",fieldLabel:"所属计划单ID",xtype:"hidden"},
            down_type_box,
            {name:"dl_remark",fieldLabel:"<span style='color:red'> * </span>备注",xtype:'textarea'}
        ]
    });
    var down_win = Ext.create('Ext.Window', {
        title : '撤消当前团队报账',
        layout : 'fit',
        width : 500,
        modal : true,
        closeAction : 'hide',
        items : down_form,
        listeners : {
            hide : function(w){ down_form.getForm().reset(); }
        },
        buttons : [
            {text:'确认保存', handler:down_vf},
            {text:'查看备注', handler:remarkSelect},
            {text:'关闭', handler:function(){ down_win.hide();}}
        ]
    });
    function down_modify(v){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ v.text+'的团队!');
            return;
        };
        set_down_store(row.data);
        down_win.show();
        var down_f=down_form.getForm();
        down_f.setValues({team_id:row.data.team_id});
    }

    function set_down_store(data) {
        down_store.removeAll();
        down_store.add({text:'请选择'});
        down_store.add({text:'重新报账'});
        if(data.team_survey_time > 0){
            down_store.add({text:'重新计调审核'});
        }
        if(data.team_finance_time > 0){
            down_store.add({text:'重新财务审核'});
        }
        // if(text == '计调审核驳回'){
        //     down_store.add({text:'重新报账'});
        // }else if(text == '财务审核驳回'){
        //     down_store.add({text:'重新报账'});
        //     down_store.add({text:'重新计调审核'});
        // }else if(text == '撤销审核'){
        //     down_store.add({text:'重新报账'});
        //     down_store.add({text:'重新计调审核'});
        //     down_store.add({text:'重新财务审核'});
        // }

    }

    function down_vf(v){
        var down_f=down_form.getForm();
        Ext.MessageBox.confirm('友情提示','您确定需要【'+ v.text+'】吗?',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            var post_data=down_f.getValues();
            if(post_data.dl_title == '请选择'){
                ExtAlert('请选择您要撤消至的状态');
                return false;
            }
            if(post_data.dl_remark == ''){
                ExtAlert('请填写备注信息');
                return false;
            }
            Ext.Ajax.request({
                url: $__app__ + '/TeamPlan/status_save',
                method: 'POST',
                params: post_data,
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        si_store.load();
                        down_win.hide();
                        bz_win.hide();
                    }
                    ExtAlert( msg );
                    myMask.hide();
                },
                failure : function(response, opts){
                    myMask.hide();
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }
    //驳回审核信息处理(end)

    //切换更新
    function items_load(e){
        // if(e.cls_id=='items_cls')items_disabled(e.text);
        // Ext.getCmp(e.cls_id).setText(e.text);
        // items_store_load();
    }

    function items_store_load(){
        var row = SUNLINE.getSelected(si_grid);
        var rows=row.data;
        var store_post={team_id:rows.team_id};
        var pay_type=Ext.getCmp('items_pay_time').getValue();
        var settle_type=Ext.getCmp('items_pay_type').getValue();
        var tpi_type=Ext.getCmp('items_type_id').getValue();
        if(settle_type=='全部')settle_type='';
        if(tpi_type=='全部')tpi_type='';
        store_post.tpi_pay_type=pay_type;
        store_post.tpi_settle=settle_type;
        store_post.tpi_type=tpi_type;
        SUNLINE.baseParams(items_store,store_post);
        items_store.load();
    }

    function items_where(data){
        var search_cls=Ext.getCmp("search_cls").getText();
        if(search_cls=="查询全部") search_cls = "";
        data.team_credit_status=search_cls;
        data.team_org_id=Ext.getCmp('team_org_id').getValue();
        data.team_p_id=Ext.getCmp('p_name_id').getValue();
        data.start_time=Ext.getCmp('t_start_time').getRawValue();
        data.end_time=Ext.getCmp('t_end_time').getRawValue();
        return data;
    }

    //快速查询
    function dosearch(){
        var skeys=Ext.getCmp('search').getValue();
        var store_post={skey:skeys};
        SUNLINE.baseParams(si_store,store_post);
        si_store.load();
    }

    function items_disabled(tpi_type){
        // var add_items_id=Ext.getCmp('add_items_id');
        // var edit_items_id=Ext.getCmp('edit_items_id');
        // if(tpi_type=='整团账单'){
        //     add_items_id.setDisabled(true);
        //     tpi_type='';
        // }else{
        //     add_items_id.setDisabled(false);
        // }
        // add_items_id.setText('添加'+tpi_type);
        // edit_items_id.setText('编辑'+tpi_type);
        Ext.getCmp('items_type_id').setValue(tpi_type);
    }

    items_store.on({
        load:function(){
            items_store_money();
        }
    });
    function items_store_money(){
        var json=store_money_json(items_store.data.items);
        Ext.getCmp('bottom_money').setText(json);
    };

    //点击跳出操作
    function submit_modify(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        var rows=row.data;
        var td_status=rows.team_credit_status;
        var base_post={team_id:rows.team_id};
        var one_bottom=Ext.getCmp('one_bottom');
        var two_bottom=Ext.getCmp('two_bottom');
        //提交报账明细操作
        var look=['add_items_id','edit_items_id','del_items_id','one_bottom','two_bottom'];
        if(b.text=='查看明细'){
            array_hidden(look,true);
        }else if(b.text=='报账'){
            array_hidden(look,false);
            one_bottom.setHidden(true);
            two_bottom.setText('提交审核');
        }else{
            array_hidden(look,false);
            one_bottom.setHidden(false);
            one_bottom.setText(b.text+'驳回');
            two_bottom.setText(b.text+'提交');
        }
        Ext.getCmp('status_bottom').setText(b.text);
        //查看单团毛利
        var guide_name = rows.team_local_guide_name ? rows.team_local_guide_name : '未安排';
        var g_txt = '(地陪:'+guide_name+')';
        bz_win.setTitle(b.text+" 团号:"+rows.team_num+' 产品名称:'+rows.team_p_name+g_txt);
        base_post.tpi_type='';
        base_post.tpi_settle='';
        base_post.tpi_pay_type='支出';
        Ext.getCmp('items_pay_type').setValue('全部');
        Ext.getCmp('items_pay_time').setValue('支出');
        Ext.getCmp('items_type_id').setValue('全部');
        SUNLINE.baseParams(items_store,base_post);
        items_store.load();
        tabp.setActiveTab(0);
        bz_win.show();
    }

    //确认报账、确认审核(start)

    //确认报账、确认审核(end)

    //审核处理
    function bz_dosave(v){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ v.text+'的团队!');
            return;
        };
        var rows=row.data;
        var deal_post={
            team_id:rows.team_id,
            dl_title: v.text
        };
        if(v.text == '提交审核'){
            Ext.MessageBox.confirm('友情提示','您确定需要【提交审核】吗?',function(y){
                if(y!='yes')return false;
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var post_data=deal_post;
                Ext.Ajax.request({
                    url: $__app__ + '/TeamPlan/status_save',
                    method: 'POST',
                    params: post_data,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var msg = ret.info;
                        if (ret.status==1){
                            si_store.load();
                            bz_win.hide();
                        }
                        ExtAlert( msg );
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        ExtAlert('请求服务器失败，状态码：' + response.status);
                    }
                });
            });
        }else{
            var deal_f=deal_form.getForm();
            deal_win.show();
            Ext.getCmp('dl_tmid').setTitle(v.text);
            deal_f.setValues(deal_post);
        }
    }

    //提交审核
    function deal_vf(v){
        var deal_f=deal_form.getForm();
        Ext.MessageBox.confirm('友情提示','您确定需要【'+ v.text+'】吗?',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            var post_data=deal_f.getValues();
            Ext.Ajax.request({
                url: $__app__ + '/TeamPlan/status_save',
                method: 'POST',
                params: post_data,
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        si_store.load();
                        deal_win.hide();
                        bz_win.hide();
                    }
                    ExtAlert( msg );
                    myMask.hide();
                },
                failure : function(response, opts){
                    myMask.hide();
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }

    //查看操作备注信息
    function remarkSelect(){
        var row_data = Ext.JSON.decode(SUNLINE.getSelected(si_grid).data.team_remark_curd);
        var remark_model = Ext.define('remark_model', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'remark_uid'},
                {name: 'remark_user'},
                {name: 'remark_time'},
                {name: 'remark_type'},
                {name: 'remark_content'}
            ]
        });
        var remark_store = Ext.create('Ext.data.Store', {
            model: 'remark_model',
            pageSize: 10,
            data: row_data,
            proxy: Ext.create('Ext.data.MemoryProxy', {
                data: row_data,
                reader: {type: 'json'},
                enablePaging: true
            }),
        });
        var remark_grid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: remark_store,
            viewConfig: {
                emptyText: '暂无备注信息',
                deferEmptyText: true,
            },
            columns: [
                {text: '用户ID', dataIndex: 'remark_uid', xtype: 'hiddenfield'},
                {text: '用户姓名', dataIndex: 'remark_user'},
                {text: '操作时间', dataIndex: 'remark_time'},
                {text: '操作内容', dataIndex: 'remark_type'},
                {text: '操作备注', dataIndex: 'remark_content'},
            ],
            listeners: {
                select: function () {
                    var selected_data = SUNLINE.getSelected(remark_grid).data;
                    var html = '<fieldset>';
                    html += '<legend>备注信息</legend>';
                    html += '<div><label>姓名：</label>' + selected_data.remark_user + '</div>';
                    html += '<div><label>时间：</label>' + selected_data.remark_time + '</div>';
                    html += '<div><label>内容：</label>' + selected_data.remark_type + '</div>';
                    html += '<div><label>备注：</label>' + selected_data.remark_content + '</div>';
                    html += '</fieldset>';
                    remark_grid_detail.update(html);
                },
            },
            forceFit: true, //列表宽度自适应
            autoScorll: true,
            bbar: Ext.create("Ext.PagingToolbar", {
                store: remark_store,
                displayInfo: true,
                displayMsg: '第{0} 到 {1} 条数据 共 {2} 条',
                emptyMsg: '没有数据'
            })
        });
        var remark_grid_detail = Ext.create('Ext.panel.Panel', {
            region: 'south',
            height: 150,
            bodyStyle: 'background:#F5F5F5; padding:5px;',
            minHeight: 150,
            maxHeight: 150,
            autoScroll: true,
            html: '请选择需要查看的记录。'
        });
        var remark_win = Ext.create('Ext.window.Window', {
            title: '备注信息',
            width: 700,
            height: 450,
            closeAction: 'hide',
            maximizable: true,
            modal: true,
            layout: 'border',
            items: [remark_grid, remark_grid_detail]
        });
        remark_win.show();
    }

    //操作出团计划单报账（添加、编辑、删除）(start)
    /** <<<   项目安排：公共方法、属性、对象 */
    var settle_store = new Ext.data.SimpleStore({fields:['text'],data:[ ['签单'], ['现金'] ]});
    /**   项目安排：公共方法、属性、对象  >>> */

    // <<< 选择消费项目资源界面
    var sitg_cm = [
        {text:'ID', dataIndex:'tn_id', width:60, hidden:true},
        {text:'所属ID', dataIndex:'tn_rs_id', hidden:true},
        {text:'价格名称', dataIndex:'tn_name', width:150},
        {text:'结算单价', dataIndex:'tn_price_settle', width:100, renderer:money},
        {text:'结算方式', dataIndex:'tn_payment', width:100},
        {text:'有效期', dataIndex:'tn_start_date', width:200, renderer:function(v, m, r){ return v + ' - ' + r.get('tn_end_date') } }
    ];
    var shop_cm = [
        {text:'ID', dataIndex:'tn_id', width:60, hidden:true},
        {text:'所属ID', dataIndex:'tn_rs_id', hidden:true},
        {text:'购物政策', dataIndex:'tn_name', width:150},
        {text:'人头单价', dataIndex:'tn_price_settle', width:100, renderer:money},
        {text:'流水比例', dataIndex:'tn_price2', width:100, renderer:function(v,m,r){ return v + '%'}},
        {text:'结算方式', dataIndex:'tn_payment', width:100},
        {text:'有效期', dataIndex:'tn_start_date', width:200, renderer:function(v, m, r){ return v + ' - ' + r.get('tn_end_date') } }
    ];

    var select_items_win, select_items_grid, select_items_ticket_grid, tpi_name_store, tpi_spec_store;
    function select_items(b){
        var grid_scenic=items_text('','show');
        if (!tpi_name_store)
            tpi_name_store = SUNLINE.JsonStore($__app__ + '/Resource/get_name',[], false);
        var pm = {type:grid_scenic}
        SUNLINE.baseParams(tpi_name_store, pm);
        tpi_name_store.load();

        if (!tpi_spec_store)
            tpi_spec_store = SUNLINE.JsonStore($__app__ + '/Resource/get_ticket', [], false);
        SUNLINE.baseParams(tpi_spec_store, {type:grid_scenic});

        if (!select_items_grid)
            select_items_grid = Ext.create('Ext.grid.Panel', {
                region : 'center',
                border : false,
                store : tpi_name_store,
                columns : [
                    new Ext.grid.RowNumberer(),
                    {text:'ID', dataIndex:'id', width:60, hidden:true},
                    {text:'名称', dataIndex:'rs_name', width:200},
                    {text:'所在城市', dataIndex:'rs_city', width:80},
                    {text:'简称', dataIndex:'rs_sname', width:150}
                ],
                listeners : {
                    select : function(g, r, i){
                        SUNLINE.baseParams(tpi_spec_store, {cs_id: r.get('id')}, true);
                        tpi_spec_store.load();
                    }
                },
                bbar : new Ext.PagingToolbar({
                    pageSize: 20,
                    store:tpi_name_store,
                    displayInfo: true,
                    displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
                    emptyMsg: '暂无数据'
                })
            });

        if (!select_items_ticket_grid)
            select_items_ticket_grid = Ext.create('Ext.grid.Panel', {
                region : 'east',
                border : false,
                width : 400,
                split : true,
                maxWidth : 600,
                minWidth : 350,
                store : tpi_spec_store,
                columns : sitg_cm,
                listeners : { rowdblclick: select_items_confirm }
            });

        if (!select_items_win)
            select_items_win = Ext.create('Ext.Window', {
                title : '选择资源',
                width : 900,
                height : 400,
                closeAction : 'hide',
                modal : true,
                maximizable: true,
                layout : 'border',
                items : [select_items_grid, select_items_ticket_grid],
                listeners : { hide:function(w){ tpi_spec_store.removeAll(); } },
                buttons : [
                    {xtype:'trigger',triggerCls : 'x-form-search-trigger',id:'rs_search',iconCls:'button-sch',
                        emptyText : '快捷搜索',width:200,
                        onTriggerClick:function(e){ rs_search(); },
                        listeners :{ specialkey : function(_t, _e){ if(_e.keyCode==13) rs_search(); } }
                    },
                    '->',
                    {text:'确认选择', handler : select_items_confirm},
                    {text:'关闭', handler:function(){ select_items_win.hide(); }}
                ]
            });

        if (grid_scenic=='shop')
            select_items_ticket_grid.reconfigure(tpi_spec_store, shop_cm);
        else
            select_items_ticket_grid.reconfigure(tpi_spec_store, sitg_cm);

        select_items_win.setTitle('选择'+ _tpi_type[grid_scenic] +'资源');
        select_items_win.show();
    }

    //快速搜索资源
    function rs_search(){
        var skey = Ext.getCmp('rs_search').getValue();
        SUNLINE.baseParams(tpi_name_store, {skey:skey}, true);
        tpi_name_store.currentPage = 1;
        tpi_name_store.load();
    }
    //<<<处理车辆公司，司机信息模块
    var car_org_store = SUNLINE.JsonStore($__app__ + '/Resource/get_name', [], false);
    SUNLINE.baseParams(car_org_store, {type:'car'});
    var drivers_store = SUNLINE.JsonStore($__app__ + '/Drivers/json_data', [], false);
    var car_store = SUNLINE.JsonStore($__app__ + '/Car/dataJson', [], false);
    //车辆公司选择
    var car_box={id:"tpi_name_car",name:"tpi_name_car",fieldLabel:"车辆公司",maxLength:"50",pageSize:20,
        xtype:'combo', displayField:'rs_sname', valueField:'rs_sname', editable:true,hidden:true,
        store : car_org_store,queryMode:'remote', queryParam:'skey', minChars : 2, forceSelection:true,
        tpl:Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item" data-qtip="{rs_sname}-{rs_name}" style="height: 24px;line-height: 24px; overflow: hidden;text-overflow:ellipsis;">' +
                '<label style="display: inline-table; width: 90px; overflow: hidden; color: blue;text-overflow:ellipsis;">{rs_sname}</label> {rs_name}</li>',
            '</tpl></ul>'
        ),
        listeners: {
            select:function(t, r){
                var id=r[0].get('id'), f = items_form.getForm(), fv= f.getValues();
                if (fv.tpi_cs_id == id) return; //如果选择的原来的车队，不做任何改变。
                f.setValues({ tpi_cs_id: id, tpi_contacts:'',tpi_tel:'',tpi_spec_id:'',tpi_spec:'',tpi_other:'' });
                SUNLINE.baseParams(drivers_store, { d_org_id : id });
                if (drivers_store.isLoaded()) drivers_store.load();
                SUNLINE.baseParams(car_store, { c_org_id : id });
                if (car_store.isLoaded()) car_store.load();
            }
        }
    };
    //车辆下面司机选择
    var contacts_box={
        id:"tpi_contacts_car",name:"tpi_contacts_car",fieldLabel:"司机",maxLength:"20",pageSize:20,
        xtype:'combo', displayField:'u_realname', valueField:'u_realname', editable:true,
        store : drivers_store, queryMode:'remote', queryParam:'skey', minChars : 2,hidden:true,
        //todo 司机的在团状态
        listeners:{
            select : function(t, r){ var d = r[0].getData(); items_form.getForm().setValues( {tpi_tel: d.u_mobile, tpi_spec_id: d.u_id } ); }
        }
    };
    var car_spec_box= {id:"tpi_spec_car",name:"tpi_spec_car",fieldLabel:"车辆信息", pageSize:20,
        xtype:'combo', displayField:'c_mark', valueField:'c_mark', editable:true,hidden:true,
        store : car_store, queryMode:'remote', queryParam:'skey', minChars : 2,
        //todo 车辆的在团状态
        listeners : { select:function(t,r){ var d=r[0].getData();items_form.getForm().setValues( {tpi_other: d.c_people } ); } }
    };
    //处理车辆公司，司机信息模块>>>

    //<<<物品操作模块
    var goods_default_store = SUNLINE.JsonStore($__app__ + '/Dict/dict_json', [], false);
    SUNLINE.baseParams(goods_default_store, {d_type:'常用物品'});
    var goods_box={id:"tpi_spec_goods",name:"tpi_spec_goods",hidden:true,fieldLabel:"物品名称",maxLength:"50",xtype:'combo',store:goods_default_store,queryDelay:300,minChars:2,mode:'remote',displayField:'d_text',valueField:'d_text'};
    var goods_name_box={id:"tpi_name_goods",name:"tpi_name_goods",hidden:true,fieldLabel:"仓库名称",xtype:'combo',store:new Ext.data.SimpleStore({fields:['text'],data:[ ['北京'], ['扬州'] ]}), displayField:'text', valueField:'text', editable:false};
    //物品操作模块>>>

    //<<<应交社里分类型选择
    var items_type_box=SUNLINE.LocalComob({
        id:'tpi_items_type',
        fields:['tpi_items_type'],
        data:[['景点'],['住宿'],['餐饮'],['交通'],['物品']],
        config:{
            fieldLabel:"单位类型",
            allowBlank:true,
            hidden:true,
            id:'tpi_items_type',
            labelWidth:90,
            labelAlign:'right',
            labelSeparator:'：',
            value:'景点'
        }
    });

    var pay_class_box=SUNLINE.LocalComob({
        id:'tpi_pay_class',
        fields:['tpi_pay_class'],
        data:[['正常报账'],['现退给游客']],
        config:{
            fieldLabel:"是否现退",
            allowBlank:true,
            hidden:true,
            id:'tpi_pay_class',
            labelWidth:90,
            labelAlign:'right',
            labelSeparator:'：',
            value:'正常报账'
        }
    });
    //应交社里分类型选择>>>

    //消费项目的可见对象权限设置
    var is_show_set = false;
    if(!isDisabled('TeamPlanItems::finance_btn')){
        var show_store = new Ext.data.SimpleStore({fields:['id','text'],data:[ ['0','全部可见'],['1','财务计调可见'],['2','仅财务可见']]});
    }else if(!isDisabled('TeamPlanItems::tour_btn')){
        var show_store = new Ext.data.SimpleStore({fields:['id','text'],data:[ ['0','全部可见'],['1','财务计调可见']]});
    }else{
        var show_store = new Ext.data.SimpleStore({fields:['id','text'],data:[ ['0','全部可见']]});
        var is_show_set = true;
    }

    //报账明细表单
    var items_form = Ext.create('Ext.form.Panel', {
        bodyStyle : 'padding:8px;',
        defaultType : 'textfield',
        defaults : {labelWidth:90, labelAlign:'right', labelSeparator:'：', anchor:'95%'},
        items : [
            {id:'tpi_id',name:"tpi_id",fieldLabel:"ID",xtype:"hidden"},
            {id:'tpi_pay_type',name:"tpi_pay_type",fieldLabel:"项目支付类型",xtype:"hidden"},
            {id:'tpi_team_id',name:"tpi_team_id",fieldLabel:"所属计划单",xtype:"hidden"},
            {id:'tpi_type',name:"tpi_type",fieldLabel:"项目类型",xtype:'hidden', value:'景点'},
            {id:'tpi_cs_id',name:"tpi_cs_id",fieldLabel:"结算单位",xtype:"hidden"},
            {id:'tpi_date',name:"tpi_date",fieldLabel:"游玩日期",xtype:"datefield", format:'Y-m-d', editable:false},
            items_type_box,
            car_box,
            contacts_box,
            goods_box,
            goods_name_box,
            car_spec_box,
            {id:'tpi_name',name:"tpi_name",fieldLabel:"项目名称",maxLength:"50"},
            {id:'tpi_spec_id',name:"tpi_spec_id",fieldLabel:"规格id",xtype:"hidden"},
            {id:'tpi_spec',name:"tpi_spec",fieldLabel:"规格"},
            {id:'tpi_settle',name:"tpi_settle",fieldLabel:"<font color='red'>*</font>结算方式",xtype:'combo',store:settle_store, displayField:'text', valueField:'text', editable:false},
            {id:'tpi_sign_number',name:"tpi_sign_number",fieldLabel:"签单号",maxLength:"50",hidden:true},
            {id:'tpi_num',name:"tpi_num",fieldLabel:"数量", xtype:'numberfield', listeners:{ blur: compute  } },
            {id:'tpi_price',name:"tpi_price",fieldLabel:"单价", xtype:'numberfield', listeners:{ blur: compute  } },
            {id:'tpi_money',name:"tpi_money",fieldLabel:"金额", xtype:'numberfield',readOnly:true, listeners:{ blur: compute  }},
            {id:'tpi_percent',name:"tpi_percent",fieldLabel:"流水比例(%)",hidden:true, xtype:'numberfield', listeners:{ blur: compute  }},
            {id:'tpi_total_money',name:"tpi_total_money",fieldLabel:"金额", xtype:'numberfield',readOnly:true,hidden:true},
            {id:'tpi_show',name:"tpi_show",fieldLabel:"可见对象",xtype:'combo',hidden:is_show_set,store:show_store,value:'全部可见', displayField:'text', valueField:'id', editable:false},
            {id:'tpi_contacts',name:"tpi_contacts",fieldLabel:"联系人",maxLength:"20"},
            {id:'tpi_tel',name:"tpi_tel",fieldLabel:"联系电话",maxLength:"50"},
            {id:'tpi_remark',name:"tpi_remark",fieldLabel:"备注"}
        ]
    });

    var items_win = Ext.create('Ext.Window', {
        title : '选择景点',
        layout : 'fit',
        width : 500,
        modal : true,
        id:'items_id',
        closeAction : 'hide',
        items : items_form,
        listeners : {
            hide : function(w){ items_form.getForm().reset(); },
            show : function(w){

            }
        },
        buttons : [
            {text:'保存', handler:tpi_save},
            {text:'关闭', handler:function(){ items_win.hide();}}
        ]
    });

    items_type_box.on({
        select:function(r){
            var r_val= r.value;
            //if(in_array(r_val,['司机车辆','物品'])==-1)return false;
            if(r_val=='物品')r_val='物品';
            r_val=items_text(r_val);
            add_items_show(r_val,'yes');
            console.log(r.value)
            var _form=items_form.getForm();
            var _form_get=_form.getValues();
            var post_form={
                tpi_team_id:_form_get.tpi_team_id,
                tpi_type:_form_get.tpi_type,
                tpi_date:_form_get.tpi_date,
                tpi_items_type:r.value
            };
            _form.reset();
            _form.setValues(post_form);
        }
    });


    Ext.getCmp('tpi_settle').on({
        select:function(){
            setTimeout(function(){
                var settle_val=Ext.getCmp('tpi_settle').getValue();
                if(settle_val=='签单'){
                    Ext.getCmp('tpi_sign_number').setHidden(false);
                    //Ext.getCmp('tpi_pay_class').setHidden(true);
                }else if(settle_val=='现金'){
                    //Ext.getCmp('tpi_pay_class').setHidden(false);
                    Ext.getCmp('tpi_sign_number').setHidden(true);
                }else{
                    Ext.getCmp('tpi_sign_number').setHidden(true);
                    //Ext.getCmp('tpi_pay_class').setHidden(true);
                }
            },200)
    }});

    //跳出添加、编辑项目明细窗口
    function add_modify(e){
        var tpi_type=e.text;
        var row = SUNLINE.getSelected(si_grid);
        var rows=row.data;
        var date_id=Ext.getCmp('tpi_date');
        var start_date=int2date(rows.team_start_date);
        var _form=items_form.getForm();
        var form_post={};
        if(e.act_type=='编辑'){
            var g_row=SUNLINE.getSelected(items_grid);
            if(!g_row){
                ExtAlert('请选择需要编辑的报账明细！');
                return false;
            }
            form_post=g_row.data;
            start_date=int2date(form_post.tpi_date);
            var post_type=form_post.tpi_type;
            if(form_post.tpi_type=='应付社')post_type=form_post.tpi_items_type
            tpi_type=items_text(post_type);
            //计算购物店的利润
            form_post.tpi_total_money=shop_money(form_post);
            if(form_post.tpi_settle=='现金'){
                Ext.getCmp('tpi_sign_number').setHidden(true);
                Ext.getCmp('tpi_pay_class').setHidden(false);
            }else if(form_post.tpi_settle=='签单'){
                Ext.getCmp('tpi_sign_number').setHidden(false);
                Ext.getCmp('tpi_pay_class').setHidden(true);
            }else{
                Ext.getCmp('tpi_sign_number').setHidden(true);
                Ext.getCmp('tpi_pay_class').setHidden(true);
            }
            Ext.getCmp('tpi_items_type').setReadOnly(true);
        }else{
            var tpi_type_str=tpi_type;
            if(!tpi_type_str || tpi_type_str=='全部'){
                Ext.Msg.alert('友情提示','请选择报账类目后再添加！');
                return false;
            }
            var items_pay_time = Ext.getCmp('items_pay_time').getValue();
            form_post={tpi_type:tpi_type_str,tpi_team_id:rows.team_id,tpi_pay_type:items_pay_time};
            Ext.getCmp('tpi_sign_number').setHidden(true);
            if(tpi_type=='应付社')form_post.tpi_items_type='';
            Ext.getCmp('tpi_items_type').setReadOnly(false);
        }
        //显示操作表单项目
        add_items_show(tpi_type);
        Ext.getCmp('items_id').setTitle(form_post.tpi_type+ e.act_type);
        //form_post=set_val_data(tpi_type,form_post);
        date_id.setMinValue(start_date);
        _form.setValues(form_post);
        date_id.setValue(start_date);
        items_win._act= e.act;
        items_win.show();
        field_label(tpi_type);

    }

    /**
     * 不同类目显示不同的值
     * @param type 项目类型
     * @param form_post 表单内容
     * @returns {*}
     */
    function set_val_data(type,form_post){
        var field_val={};
        switch (type){
            case 'car':
                field_val={tpi_name:'tpi_name_car',tpi_contacts:'tpi_contacts_car',tpi_spec:'tpi_spec_car'};
                break;
            case 'goods':
                field_val={tpi_spec:'tpi_spec_goods',tpi_name:'tpi_name_goods'};
                break;
        }
        for(var i in form_post){
            if(field_val[i]){
                form_post[field_val[i]]=form_post[i];
                if(i=='tpi_name'){
                    var dv = {id:form_post.tpi_cs_id, rs_sname:form_post.tpi_name};
                    car_org_store.add(dv);
                }
            }
        }
        return form_post;
    }

    /**
     * 整理成报账明细
     * @param form_post 表单提交内容
     * @returns {*}
     */
    function val_set_data(form_post){
        return form_post;
    }

    //不同项目判断显示问题
    function add_items_show(type,other){
        array_hidden(['tpi_name_car','tpi_contacts_car','tpi_spec_goods','tpi_name_goods','tpi_spec_car','tpi_total_money','tpi_percent','tpi_items_type'],true);
        array_hidden(['tpi_name','tpi_contacts','tpi_spec','tpi_name','tpi_price','tpi_contacts','tpi_tel','tpi_settle','tpi_num','tpi_money'],false);
        Ext.getCmp('tpi_name').setReadOnly(false);
        Ext.getCmp('tpi_spec').setReadOnly(false);
        Ext.getCmp('tpi_money').setReadOnly(true);
        Ext.getCmp('tpi_settle').setReadOnly(false);
        switch (type){
            case '导游':
                Ext.getCmp('tpi_settle').setValue('签单');
                Ext.getCmp('tpi_settle').setReadOnly(true);
                Ext.getCmp('tpi_sign_number').setHidden(false);
                break;
            case '购物店':
                Ext.getCmp('tpi_money').setReadOnly(false);
                array_hidden(['tpi_total_money','tpi_percent'],false);
                break;

            default://默认操作管理
                break;
        };
        if(other=='yes') array_hidden(['tpi_items_type'],false);
    };
    //操作表单项隐藏还是显示
    function array_hidden(like,bool,str){
        for(var i=0;i<like.length;i++){
            Ext.getCmp(like[i]).setHidden(bool);
            if(str){
                var name=like[i].replace(str,'');
                var bool_true=false;
                if(bool_true==false)bool_true=true;
                Ext.getCmp(name).setHidden(bool_true);
            }
        }
    }

    //获取当前选择的分类
    function items_text(type,cls){
        //var str_int = {"导游":"guide","住宿":"hotel","交通":"car","景点":"scenic","餐饮":"meals","购物店":"shop","物品":"goods",'应付社':"restore"};
        //编辑的时候
        if(!type)type=Ext.getCmp('items_type_id').getValue();
        if(type=='全部')type='';
        if(!type)type=Ext.getCmp('tpi_type').getValue();
        if(type=='应付社' && cls=='show') type=Ext.getCmp('tpi_items_type').getValue();
        return type;
    }

    //确认选择消费项目
    function select_items_confirm(){
        var i_row = SUNLINE.getSelected( select_items_grid),
            t_row = SUNLINE.getSelected(select_items_ticket_grid);
        var grid_scenic=items_text();
        if (!i_row) return ExtAlert('请选择您需要的' + _tpi_type[grid_scenic] );
        if (!t_row) return ExtAlert('请选择您需要的价格信息。');
        var fv = {}
        fv.tpi_cs_id = i_row.get('id');
        fv.tpi_name = i_row.get('rs_name');
        fv.tpi_spec_id = t_row.get('tn_id');
        fv.tpi_spec = t_row.get('tn_name');
        fv.tpi_price = t_row.get('tn_price_settle');
        fv.tpi_settle = t_row.get('tn_payment');
        if (t_row.get('tn_price2')) fv.tpi_num = t_row.get('tn_price2');
        if(fv.tpi_settle=='签单'){
            Ext.getCmp('tpi_sign_number').setHidden(false);
            Ext.getCmp('tpi_pay_class').setHidden(true);
        }else if(fv.tpi_settle=='现金'){
            Ext.getCmp('tpi_sign_number').setHidden(true);
            Ext.getCmp('tpi_pay_class').setHidden(false);
        }else{
            Ext.getCmp('tpi_sign_number').setHidden(true);
            Ext.getCmp('tpi_pay_class').setHidden(true);
        }
        clog(fv, '选择消费项目');
        select_items_win.hide();
        //根据操作的资源类型进行判断设置哪个表单
        switch (grid_scenic){
            case 'scenic':
                items_form.getForm().setValues(fv);
                Ext.getCmp('tpi_num').focus(true);
                break;
            case 'meals':
                items_form.getForm().setValues(fv);
                Ext.getCmp('tpi_num').focus(true);
                break;
            case 'shop':
                fv.tpi_num=0;
                if (t_row.get('tn_price2')) fv.tpi_percent = t_row.get('tn_price2');
                fv.tpi_total_money='';
                fv.tpi_money='';
                items_form.getForm().setValues(fv);
                Ext.getCmp('tpi_num').focus(true);
                break;
            case 'hotel':
                items_form.getForm().setValues(fv);
                Ext.getCmp('tpi_num').focus(true);
                break;
            case 'restore':
                items_form.getForm().setValues(fv);
                Ext.getCmp('tpi_num').focus(true);
                break;
        }
    }
    function compute(t){
        var grid_scenic=items_text();
        var f = items_form.getForm();
        clog(grid_scenic, '现在要什么？')
        var fv = f.getValues(), nd = {};
        if (t.name == 'tpi_price' || t.name == 'tpi_num'){
            nd['tpi_price'] = fv.tpi_price;
            nd['tpi_num'] = fv.tpi_num ? fv.tpi_num : 0;
            nd['tpi_money'] = Number(fv.tpi_price * fv.tpi_num).toFixed(2);
        }else{
            if (fv.tpi_num!='' && fv.tpi_num!='0'){
                nd['tpi_money'] = fv.tpi_money;
                nd['tpi_num'] = fv.tpi_num;
                nd['tpi_price'] = (fv.tpi_money / fv.tpi_num).toFixed(2);
            }
        }
        if(grid_scenic=='购物店'){
            nd.tpi_money=fv.tpi_money;
            //返佣总额
            nd.tpi_total_money=shop_money(fv);
            nd.tpi_price=fv.tpi_price;
        }else if(grid_scenic=='交通'){
            //return false;
        }
        f.setValues(nd);
    }
    //购物店总体利润的计算
    function shop_money(data){
        return data.tpi_money*data.tpi_percent/100+data.tpi_num*data.tpi_price;
    }

    /** <<<  计划单项目安排保存方法 */

    //计划单项目保存方法
    function tpi_save(b){
        var grid_scenic=items_text();
        var _f, fv, _win, _act = grid_scenic, mc='';
        _f = items_form.getForm();
        _win = items_win;
        if ( !_f.isValid() ) return ExtAlert('请正确填写表单内容。');
        fv = _f.getValues();
        if (fv.tpi_name == ''){
            return ExtAlert('请输入'+grid_scenic+'名称');
        }
        if (fv.tpi_settle == ''){
            return ExtAlert('请选择结算方式');
        }
        if(_act != '购物店'){
            if (fv.tpi_price == ''){
                return ExtAlert('请输入单价');
            }
            if (fv.tpi_num == '' || fv.tpi_num == '0'){
                return ExtAlert('请填写正确的数量。');
            }
        }
        /*if (_act == 'hotel' && fv.tpi_id>0 ){
            if ( fv.tpi_date.length != 1 ) return ExtAlert('编辑时只能选择一个日期。');
        }*/
        var edit_in = (fv.tpi_id == '') ? -2 : items_store.find('tpi_id', new RegExp('^' + fv.tpi_id + '$'));
        var tip = fv.tpi_name + '('+ fv.tpi_spec + ')';
        switch (_act){
            case '导游':
                var index = items_store.find('tpi_spec', fv.tpi_spec);
                break;
            case '购物店':
                if(!((fv.tpi_price != '' && (fv.tpi_num != '' && fv.tpi_num != 0)) || (fv.tpi_money != 0 && fv.tpi_percent != 0))){
                    return ExtAlert('人头单价进店人数与购物总额流水比例必填一项');
                }
                break;
            default:
                var index=-1, ri = -1;
                items_store.each(function(r){
                    ri++;
                    var cs_id=r.get('tpi_cs_id'), spec_id= r.get('tpi_spec');
                    if (cs_id==fv.tpi_cs_id && spec_id==fv.tpi_spec) index = ri;
                });
                break;
        };
        fv=val_set_data(fv);
        if ( index>-1 && edit_in != index){
            Ext.Msg.confirm('友情提醒', '已经存在“'+ tip + '”了，是否继续添加？', function(yn){
                if (yn!='yes') return ;
                real_tpi_save(fv, b, _f, _win);
            });
        }else{
            real_tpi_save(fv, b, _f, _win);
        }
    }


    //真正提交数据的AJAX
    function real_tpi_save(fv, btn, _form, _win){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        if (typeof fv.tpi_date == 'object') {
            fv.tpi_date = Ext.encode(fv.tpi_date);
        }
        fv.tpi_type_class='items_detail';
        Ext.Ajax.request({
            url: $__app__ + '/TeamPlanItems/save',
            method: 'POST',
            params: fv,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg = ret.info.msg;
                if (ret.status==1){
                    items_store.load();
                    if (_form) _form.reset();
                    if (_win) _win.hide();
                }
                ExtAlert( msg );
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                ExtAlert('请求服务器失败，状态码：' + response.status);
            }
        });
    }

    /**
     * 替换表单备注
     * @param type 添加类目类型
     */
    function field_label(type){
        var title_txt={

            '购物店':{tpi_name:'<font color="red">*</font>购物店名称',tpi_spec:'购物店规格',tpi_date:'进店日期',tpi_price:'人头单价',tpi_num:'进店人数',tpi_total_money:'返佣总额',tpi_money:'购物总额'},

            default:{tpi_name:type+'名称',tpi_spec:type+'规格',tpi_date:'出行日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'}
        };
        var data=title_txt[type];
        if(!data)data=title_txt['default'];
        for(var i in data){
            Ext.getCmp(i).setFieldLabel(data[i]);
        }
    }

    //计划单项目删除方法
    function items_del(b){
        var grid_scenic=items_text();
        var row = SUNLINE.getSelected(items_grid);
        if (!row) return ExtAlert('请选择您要删除的数据。');

        Ext.Msg.confirm('友情提醒', '您真的要删除“'+ row.get('tpi_name') +'”吗？', function(yn){
            if (yn != 'yes') return ;

            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();

            Ext.Ajax.request({
                url : $__app__ + '/TeamPlanItems/items_del',
                method: 'POST',
                params : {tpi_id: row.get('tpi_id')},
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var tp_row = SUNLINE.getSelected(si_grid);
                    var msg = ret.info;
                    if (ret.status==1){
                        items_grid.getStore().remove(row);
                        if (row.get('tpi_type')=='导游'){
                            if (row.get('tpi_spec')=='全陪导游'){
                                tp_row.set('team_guide_id', '');
                                tp_row.set('team_guide_name', '');
                                tp_row.set('team_guide_tel', '');
                            }else{
                                tp_row.set('team_local_guide_id', '');
                                tp_row.set('team_local_guide_name', '');
                                tp_row.set('team_local_guide_tel', '');
                            }
                        }
                    }
                    ExtAlert( msg );
                    myMask.hide();
                },
                failure : function(response, opts){
                    myMask.hide();
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }
    /**  计划单项目安排保存方法  >>> */

    //单团毛利操作(start)
    //单团毛利
    var print_height=700;
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
            {text:'类型',id:'type_id',xtype:'hidden',value:''},
            {text:'导出',handler:export_appoint},
            {text : '打印', handler:doprint},
            {text : '关闭', handler:function(){print_win.hide();}}
        ]
    });

    function export_appoint(){
        var type_id=Ext.getCmp('type_id').getValue();
        try{
            var row = SUNLINE.getSelected(si_grid);
            if(type_id=='bus_trans'){
                window.location = $__app__+'/TeamPlanItems/bus_trans_excel/team_id/'+row.get('team_id');
            }else{
                var type_url='';
                if(type_id=='file'||type_id=='supply')type_url='/type/'+type_id;
                window.location = $__app__+'/TeamPlanItems/profit_excel/team_id/'+row.get('team_id')+type_url;
            }
        }catch(e){
            clog(e);
        }
    };

    //单团毛利打印
    function doprint(){
        window.ifm_print.focus();
        window.ifm_print.print();
    }

    /*print_win.on("show",function(){
        var row = SUNLINE.getSelected(si_grid);
        var rows=row.data;
        Ext.getCmp("print_id").setTitle("单团毛利 导游:"+rows.team_guide_name+rows.team_guide_tel+" 团队编号:"+rows.team_num);
        var url = $__app__ + '/TeamPlanItems/team_print?_dc=' + time()+'&team_id='+rows.team_id;
        window.ifm_print.location = url;
    });*/

    function submit_account(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        Row_data=row.data;
        var url='',title='';
        var team_local_guide_name = Row_data.team_local_guide_name ? Row_data.team_local_guide_name : '';
        var team_local_guide_tel = Row_data.team_local_guide_tel ? Row_data.team_local_guide_tel : '';
        if(b.text == "单团毛利" || b.text=='团档'|| b.text=='补充团档'){
            var team_txt='',type_id='team';
            if(b.text=='团档'){
                team_txt='&type=file';
                type_id='file';
            }
            if(b.text=='补充团档'){
                team_txt='&type=supply';
                type_id='supply';
            }
            url = $__app__ + '/TeamPlanItems/team_print?_dc=' + time()+'&team_id='+Row_data.team_id+team_txt;
            title=b.text+" 导游:"+team_local_guide_name+team_local_guide_tel+" 团队编号:"+Row_data.team_num;
            Ext.getCmp('type_id').setValue(type_id);
        }else if(b.text=='交通明细表'){
            url = $__app__ + '/TeamPlanItems/bus_trans_print?_dc=' + time()+'&team_id='+Row_data.team_id;
            title= b.text+" 导游:"+Row_data.team_local_guide_name+Row_data.team_local_guide_tel+" 团队编号:"+Row_data.team_num;
            type_id='bus_trans';
        }
        Ext.getCmp('type_id').setValue(type_id);
        if(!url)return false;
        print_win.show();
        Ext.getCmp("print_id").setTitle(title);
        window.ifm_print.location = url;
    }
    //单团毛利操作(end)

    //查看作证信息(start)
    var bill_url = $__app__ + '/TeamPlanItems/attach_list_json';
    var bill_field = [{name:"si_id"}];
    var bill_store=SUNLINE.GroupingStore(bill_url,bill_field,{sortInfo:{field:'si_type'}, groupField:'si_type'},false);
    var grouping_bill = Ext.create("Ext.grid.feature.Grouping",{
        collapsible:false,
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个项目)"
    });
    function title_show(v){
        if(!v)return '';
        return "<span title="+v+">"+v+"</span>";
    }
    var bill_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:bill_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        features: [grouping_bill],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"si_id", dataIndex:"si_id", width:50,hidden:true},
            {header:"si_team_id", dataIndex:"si_team_id", width:50,hidden:true},
            {header:"资源名称", dataIndex:"si_name", width:260},
            {header:"项目名称", dataIndex:"si_type", width:130,hidden:true}
        ]
    });
    var img_height=500;
    var image_grid=new Ext.panel.Panel({
        region:'east',
        border:true,
        width:650,
        height:img_height,
        html:'<iframe src="" style="border:none;width:100%;height:'+img_height+'px" name="news_frame" id="news_frame"></iframe>'
    })
    var cert_remark_panel=new Ext.form.FormPanel({
        border:false,
        region:'south',
        bodyStyle:'padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {fieldLabel:"team_id",id:'team_id_cert',name:"team_id",hidden:true},
            {xtype:'textarea',id:'team_receipt_cert',name:"team_receipt", labelWidth:80,labelAlign:"right",height:100}
        ]
    });

    function receipt_dosave(v){
        var data=cert_remark_panel.getForm().getValues();
        if(typeof v=='string'){
            data.team_receipt=v;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlanItems/receipt_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    image_win.hide();
                    si_store.load();
                    Ext.Msg.alert('友情提示',info.msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    var image_left_panel=new Ext.panel.Panel({
        region:'center',
        layout:'border',
        items:[bill_grid,cert_remark_panel]
    })
    var image_win=new Ext.Window({
        id:'image_win',
        layout:'border',   //左右必须有他
        autoHeight:true,
        title:'查看凭证',
        width:950,
        height:500,
        resizable:false,
        autoScroll : true,
        closeAction:'hide',
        modal:true,
        items:[image_grid,image_left_panel],
        buttons:[
            {text:'保存', handler:receipt_dosave},
            {text:'凭证齐全', handler:function(){receipt_dosave('凭证齐全')}},
            {text:'关闭', handler:function(){ image_win.hide();}}
        ]
    })
    bill_grid.getSelectionModel().on('select',function(t,r){
        var row= r;
        var url = $__app__ + '/TeamPlanItems/image_select/si_id/'+row.get('si_id')+'/team_id/'+row.get('si_team_id');
        window.news_frame.location = url;
    });

    function image_account(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        /*if (row.data.team_credit_status=='未报账') {
            Ext.Msg.alert('友情提示', '未报账的团队没有凭证!');
            return;
        };*/
        image_win.show();
        Ext.getCmp('team_receipt_cert').setValue(row.data.team_receipt);
        Ext.getCmp('team_id_cert').setValue(row.data.team_id);
        SUNLINE.baseParams(bill_store,{team_id:row.data.team_id});
        bill_store.currentPage=1;
        bill_store.load();
    }
    //查看作证信息(end)

    //手动更新毛利费用
    function submit_gross(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择你要'+ b.text+'的团队!');
            return;
        };
        if(row.data.team_credit_status=='未报账'){
            Ext.Msg.alert('友情提示', '未报账的团队不可更新费用!');
            return;
        }
        Ext.MessageBox.confirm('友情提示','你确定需要更新毛利费用！',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__ + '/TeamPlanItems/team_profit_upgraded',
                method: 'POST',
                params: {team_id:row.data.team_id},
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        si_store.load();
                    }
                    ExtAlert( msg );
                    myMask.hide();
                },
                failure : function(response, opts){
                    myMask.hide();
                    ExtAlert('请求服务器失败，状态码：' + response.status);
                }
            });
        });
    }

    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出当前条件下的数据吗?',function(y){
            if(y!='yes')return false;
            var post_val=items_where({});
            var skeys=Ext.getCmp('search').getValue();
            if(skeys)post_val.skeys=skeys;
            var url=[];
            for(var i in post_val){
                if(!post_val[i])continue;
                url.push(i);
                url.push(post_val[i]);
            }
            url=url.join('/');
            window.location = $__app__+'/TeamPlanItems/get_select_excel/'+url;
        });
    }


    //操作出团计划单报账（添加、编辑、删除）(end)
    new Ext.Viewport({
        layout : 'border',
        items : [_panel]
    });

    window.set_label = function(b){
        var row = SUNLINE.getSelected(si_grid);
        if (!row) return ExtAlert('请选择您想标记的计划单数据。');
        var team_id = row.get('team_id');
        if (team_id==''||team_id=='0') return ExtAlert('标签只能对已经生成的计划单进行标记。');
        var data = {team_id:team_id, team_label: b.text,type:'team_label_items'};
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlan/set_label',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                QtipMsg('友情提醒', info.msg, {direction:'t', width:210});
                if (ret.status){
                    row.set('team_label_items', info.label);
                }
            },
            failure:function (response, otps) {
                QtipMsg('友情提醒', '设置标签操作失败', {direction:'t', width:210});
            }
        });
    };

    function load_tpi_menu(title) {
        var type = title == '收入' ? _tpi_type_in : _tpi_type_out;
        _tpi_type_menu.removeAll();
        items_type_store.removeAll();
        items_type_store.add({text:'全部',id:'全部'});
        for(var i in type){
            _tpi_type_menu.add({text: type[i].d_text,act:'add',act_type:'添加',handler:add_modify});
            items_type_store.add({text:type[i].d_text,id:type[i].d_text});
        }
    }

    items_pay_type.on({
        select:function(v,r){
            items_store_load();
        }
    });

    ziyo_log({ listeners : [{grid: si_grid, action:'TeamPlan', pk_id:'team_id'}] });
    ziyo_label('label_btn');
});
