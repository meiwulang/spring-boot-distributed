/**
 * Created by zsl on 17-4-8.
 */
var __app__ = $__app__, load_team_list = false;
var bl_id_num,selected_data;
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = __app__ + '/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '出团计划单';
    var url = __app__ + '/TeamPlan/team_list';
    var fld = [ "team_id"];
    var _store_tmp = SUNLINE.GroupingStore(url,fld,{sortInfo:{field:'team_p_num',direction: "ASC"}, groupField:'team_p_name'},false);
    var _data_all, _data_ok, _data_no;
    var _store= SUNLINE.JsonStore(url, fld, false);
    _store.on('load', function(){
        set_status_btn(_store, true);
    });
    function set_status_btn(_store, opt){
        var plan_all = Ext.getCmp('plan_all'), n_all = _store.getCount(),
            plan_ok = Ext.getCmp('plan_ok'), n_ok = 0,
            plan_no = Ext.getCmp('plan_no'), n_no = 0 ;
        _data_all=[]; _data_no=[]; _data_ok=[];
        _store.each(function(r){
            _data_all.push(r.data);
            if (r.get('team_id')==0) {
                _data_no.push(r.data);
                n_no++;
            } else {
                _data_ok.push(r.data);
                n_ok++;
            }
        });
        plan_all.setText('全部计划<span>'+ n_all +'</span>').setDisabled(n_all==0);
        plan_ok.setText('已生成计划<span>'+ n_ok +'</span>').setDisabled(n_ok==0);
        plan_no.setText('未生成计划<span>'+ n_no +'</span>').setDisabled(n_no==0);
        if (opt === true){
            //当load时，需要做把plan_all pressed
            plan_all.fireEvent('click');
            _store_tmp.loadData(_data_all);
            //clog('loadData ok.')
        }
    }


    function confirm_order(v,r,c){
        //console.log(c.data);
        //var start_time= c.data.team_start_date;
        //var status=['待确认','待付款'];
        //var order_type='seller';
        //var time_type='o_start_date';
        //var product_id=c.data.team_p_id;
        var prepay=parseInt(c.get('team_prepay_num'));
        if (!prepay) return '<span style="color: #999">无</span>';

        //var url = $__app__+'/OrderAdmin/seller/start_time/'+start_time+'/status/'+status+'/time_type/'+time_type+'/order_type/'+order_type+'/product_id/'+product_id;
        return '<span  style="color: blue; cursor: pointer">'+prepay+'</span>';
    }





    var grouping_store = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个团队)"
    });

    function show_product(v,i,r){
        var team_num = r.get('team_num'), label = r.get('team_label'), tg = '_blank', p_num = r.get('team_p_num'),
            tn= '<br><span style="font-weight: bold;color: '+ (team_num?'blue':'#ccc') +'">'+ (team_num?team_num:'未生成计划') +'</span>';
        if(r.data.team_type=='跟团游'){
            var enid = r.get('encode_p_id');
            var url = $__app__+"/detail.html?p_id="+enid;
        }else{
            var url = $__app__+'/TeamList/PrintTeam/num/'+ r.data.team_p_num;
        }
        if (r.get('team_p_id')==='0') {
            url = '#'; tg = '_self'; p_num = 'PIN';
        }
        var txt = '<a href = "'+url+'" target = "'+ tg +'" title="'+ r.data.team_p_series +'" >['+ p_num +'] </a>'+ v;
        var lb_txt = [];
        if (label) lb_txt = show_label(label);
        return txt + tn + lb_txt.join('');
    }

    function start_date(v,m,r){
        var time='';
        if(r.data.team_start_time!='00') time=r.data.team_start_time;
        return number2date(v) + ' &nbsp;'+time;
    }
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
    };
    var slt_color = ['#ccc', '#0ace0a'];
    function get_items_info(type, items, m){
        var txt = '<i class="fa fa-check"',
            qtip = 'data-qtip="未安排"',
            color = slt_color[0], num = 0;
        if (typeof items == 'object') {
            var nd = items[type];
            if (nd){
                var tmp = nd.tpi_name;
                qtip = 'data-qtip="<b>'+type+'：共'+ nd.num +'项</b><br>'+ tmp +'"';
                //var txt = tmp.replace(/：(.*?)<br>/g, '、').replace(/：$/, '');
                color = slt_color[1];
                num = nd.num;
            }
        }
        m.tdAttr = qtip;

        return '<span class="checked" style="background: '+color+';">'+
            txt + '></i> '+ num +' </span>';
    };

    function get_items_guide_detail(type, v){
        var txt = '<span style="color:#666;">未安排</span>';
        try{
            if (typeof v == 'object'){
                var _t = v['导游'].tpi_name.split('<br>'), _p=[];
                for ( var i=0; i<_t.length; i++){
                    var _m = _t[i].split('：');
                    if (_m[0]==type) {
                        var _e = _m[1].split(' ');
                        _p.push( '<span data-qtip="'+ _m[1] +'">'+ _e[0] +'</span>' );
                    }
                }
                txt = _p.join('、');
            }
        }catch(e){ }
        return txt;
    };
    function team_remark(v, r, m){
        var color = v ? slt_color[1] : slt_color[0];
        return '<span class="checked" style="background: '+color+';" data-qtip="'+ v.replace(/\n/ig, '<br>') +
            '">&nbsp;<i class="fa fa-check"></i>&nbsp;</span>';
    };
    //改变计划单列表数据
    function filter_plan(b){
        var data = b.id=='plan_all'? _data_all : (b.id=='plan_ok' ? _data_ok : _data_no);
        _store_tmp.loadData(data);
    };

    function guide_quan(v, m, r, ri, ci){
        var txt = '<span style="color:#666;">未安排</span>';
        if(v){
            txt='<span data-qtip="'+v+'：'+ r.get('team_guide_tel')+'">'+ v +'</span>'
        };
        return txt;
    };
    function guide_dijie(v,m,r){
        var txt = '<span style="color:#666;">未安排</span>';
        if(v){
            txt='<span data-qtip="'+v+'：'+ r.get('team_local_guide_tel')+'">'+ v +'</span>'
        };
        return txt;
    };
    function hotel(v, m, r){ return get_items_name('住宿', v, m); };
    function meals(v, m, r){ return get_items_info('餐饮', v, m); };
    function shop(v, m, r){ return get_items_info('购物店', v, m); };
    function drivers(v, m, r){
        var txt = '<span style="color:#666;">未安排</span>';
        if(v){
            txt='<span data-qtip="<b>车辆信息：'+ r.get('team_bus')+'</b><br>'+v+'：'+ r.get('team_driver_tel')+'">'+ v +'</span>';
        };
        return txt;
    };
    function scenic(v, m, r){ return get_items_info('景点', v, m); };
    function goods(v, m, r){ return get_items_info('其他费用', v, m); };
    function planMoney(v, m, r) {
        var isly = r.get('team_fee_no');
        if (isly == 1) return '<span style="color:#666;">不领</span>';
        return money(v, m, r);
    };

    var prepay_window;
    var _cm=[
        {xtype:'rownumberer', width:45},
        {header:"team_id",dataIndex:"team_id",width:80,hidden:true},
        {header:"班期ID",dataIndex:"team_bl_id",width:80,hidden:true},
        {header:"结束日期",dataIndex:"team_end_date",width:80,hidden:true},
        {header:"产品信息",dataIndex:"team_p_name",width:400, sortable:false, renderer:show_product},
        {header:"计划车号",dataIndex:"team_bus_num",width:80},
        {header:"出发日期",dataIndex:"team_start_date",width:130, menuDisabled:true, sortable:false, renderer:start_date},
        {header:"人数?",dataIndex:"team_saled",width:60, menuDisabled:true, sortable:false,align:'center',
            renderer:function(v,m,r){
                if(!r.get('team_prepay_num')){
                    return (parseInt(r.get('team_adult'))+parseInt(r.get('team_children')));
                }else{
                    return ((parseInt(r.get('team_adult'))+parseInt(r.get('team_children')))-parseInt(r.get('team_prepay_num')));
                }
            }, tooltip:'该人数不含待确认人数与待付款人数'},
        {header:"成人",dataIndex:"team_adult",width:50, menuDisabled:true, sortable:false,align:'center'},
        {header:"儿童",dataIndex:"team_children",width:50, menuDisabled:true, sortable:false,align:'center'},
        {header:"未付款?",dataIndex:"team_confirm",width:70, menuDisabled:true, sortable:false,align:'center',renderer:confirm_order,listeners:{
            click:function (view, record, item){
                var row =  _grid.getStore().getAt(item);
                if(!parseInt(row.data.team_prepay_num))return false;
                /*var start_time= row.data.team_start_date;
                 var status=['待确认','待付款'];
                 var order_type='seller';
                 var time_type='o_start_date';
                 var product_id=row.data.team_p_id;
                 var display=1;*/
                var bl_id=row.data.team_bl_id;
                var bus_num=row.data.team_bus_num;
                //var url = $__app__+'/OrderAdmin/seller/start_time/'+start_time+'/status/'+status+'/time_type/'+time_type+'/order_type/'+order_type+'/product_id/'+product_id+'/display/'+display;
                var url = $__app__+'/OrderAdmin/seller/bl_id/'+bl_id+'/bus_num/'+bus_num;
                if (!prepay_window) {
                    prepay_window= new Ext.Window({
                        width : Ext.getBody().getWidth()-50,
                        height : Ext.getBody().getHeight()-50,
                        closeAction : 'hide',
                        modal : true,
                        html : '<iframe  frameborder="0" id="order_list" name="order_list" style="width: 100%; height: 100%;" ></iframe>',
                    });
                }
                var title =number2date(row.data.team_start_date)+' '+row.data.team_p_name;
                prepay_window.setTitle('未付款订单列表（'+ title+'）');
                prepay_window.show();
                setTimeout(function(){
                    window.order_list.location = url;
                }, 100);
            }
        } ,tooltip:'包含：待确认人数、待付款人数'},
        //{header:"待付款",dataIndex:"team_prepay",width:60, menuDisabled:true, sortable:false,align:'center',renderer:confirm_order},
        {header:"团队计调",dataIndex:"team_user",id:'team_user',width:80, align:'center'},
        {header:"全陪",dataIndex:"team_guide_name",width:80, align:'center', menuDisabled:true, sortable:false, renderer:guide_quan},
        {header:"地陪",dataIndex:"team_local_guide_name",width:80, align:'center', menuDisabled:true, sortable:false, renderer:guide_dijie},
        {header:"司机车辆",dataIndex:"team_driver_name",width:90, align:'center', menuDisabled:true, sortable:false, renderer:drivers},
        {header:"住宿",dataIndex:"team_items",width:100, align:'center', menuDisabled:true, sortable:false, renderer:hotel},
        {header:"团款",dataIndex:"team_total_fee",width:100, align:'center', menuDisabled:true, sortable:false, renderer:planMoney},
        {header:"景点",dataIndex:"team_items",width:60, align:'center', menuDisabled:true, sortable:false, renderer:scenic},
        {header:"餐饮",dataIndex:"team_items",width:60, align:'center', menuDisabled:true, sortable:false, renderer:meals},
        {header:"其他",dataIndex:"team_items",width:60, align:'center', menuDisabled:true, sortable:false, renderer:goods},
        {header:"注意事项",dataIndex:"team_remark",width:80, align:'center', menuDisabled:true, sortable:false, renderer:team_remark}
    ];

    var _grid = new Ext.grid.GridPanel({
        id: 'team_plan_grid',
        region:'center',
        border:false,
        store:_store_tmp,
        features: [grouping_store],
        columns: _cm, //表格列定义
        style:'border-top:3px solid #3892d3',
        selModel:{ selType: 'checkboxmodel' },
        viewConfig:{
            groupByText : '使用当前字段分组',
            showGroupsText : '分组显示',
            showGroupName : true,
            enableGroupingMenu:true,
            hideGroupedColumn : false,
            emptyText: '暂无计划单信息。',
            enableTextSelection:true,
            groupTextTpl: '{text} <span style="font-weight: normal;">(共{[values.rs.length]}个计划单)</span>'
        },
        tbar : [
            {id:'plan_all', text:'全部计划',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', pressed:true, handler:filter_plan},
            {id:'plan_ok', text:'已生成计划',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:filter_plan},
            {id:'plan_no', text:'未生成计划',enableToggle: true,cls:'g_plan', toggleGroup:'g_plan', handler:filter_plan},
            '-',
            {text:'生成计划单',id:'create_plan_btn', iconCls:'button-group-go',handler:create_plan, disabled:isDisabled('TeamPlan::create_plan_btn')},
            {text:'撤销计划单',id:'remove_plan_btn', iconCls:'button-group-go',handler:create_plan, disabled:isDisabled('TeamPlan::remove_plan_del')},
            {text:'编辑计划单',id:'edit_plan_btn',iconCls:'button-edit',handler:edit_plan_info, disabled:isDisabled('TeamPlan::edit_plan_btn')},
            {text:'打印计划单',id:'print_plan_btn',iconCls:'button-print', act:'print_detail', handler:plan_print, disabled:isDisabled('TeamPlan::print_plan_btn')},
            {text:'发送通知',id:'send_wx_msg',iconCls:'button-weixin',handler:send_wx_msg}
        ],
        listeners:{
            select : function(t, r, i, eo){
                //selected_data=r;
                var team_id = r.get('team_id'), status = r.get('team_credit_status'),team_saled = r.get('team_saled'),team_prepay_num= r.get('team_prepay_num');
                if(!isDisabled('TeamPlan::create_plan_btn'))Ext.getCmp('create_plan_btn').setDisabled(team_id>0);
                if(!isDisabled('TeamPlan::edit_plan_btn'))Ext.getCmp('edit_plan_btn').setDisabled(team_id==0 || status!='未报账');
                if(!isDisabled('TeamPlan::print_plan_btn'))Ext.getCmp('print_plan_btn').setDisabled(!team_id>0);
                Ext.getCmp('t_print').setDisabled(!team_id>0);
                Ext.getCmp('t_insurance').setDisabled(!team_id>0);
                Ext.getCmp('t_print_all').setDisabled(!team_id>0);
                Ext.getCmp('t_print_simple').setDisabled(!team_id>0);
                Ext.getCmp('t_print_items').setDisabled(!team_id>0);
                if(!isDisabled('TeamPlan::remove_plan_del'))Ext.getCmp('remove_plan_btn').setDisabled(team_id==0 || status!='未报账');
                if(parseInt(team_saled)-parseInt(team_prepay_num)<=0){
                    Ext.getCmp('create_plan_btn').setDisabled(true);
                }
            },
            selectionchange : function(selModel, sel, e){
                var p_id = '', load = true;
                var bl_id = [];
                var rows = SUNLINE.getSelected(_grid, true);//获取原已选中数据
                if(rows.length>0){
                    var selected_id=rows[0].get('team_id');
                    var team_credit_status = rows[0].get('team_credit_status');
                }
                Ext.each(sel, function(r){
                    var id = r.get('team_id');
                    if (p_id===''){
                        p_id = id;
                    }else{
                        if (p_id != id) {
                            if( parseInt(selected_id) > 0 && in_array(team_credit_status,['审核中','报账中']) == 1 ){
                                Ext.getCmp('create_plan_btn').setDisabled(true);
                                Ext.getCmp('edit_plan_btn').setDisabled(true);
                                Ext.getCmp('remove_plan_btn').setDisabled(true);
                                Ext.getCmp('print_plan_btn').setDisabled(false);
                            }else if(parseInt(selected_id)>0 && team_credit_status == '未报账'){
                               Ext.getCmp('create_plan_btn').setDisabled(true);
                               Ext.getCmp('edit_plan_btn').setDisabled(false);
                               Ext.getCmp('remove_plan_btn').setDisabled(false);
                               Ext.getCmp('print_plan_btn').setDisabled(false);
                            }else if(parseInt(selected_id)==0 ){
                                Ext.getCmp('create_plan_btn').setDisabled(false);
                                Ext.getCmp('edit_plan_btn').setDisabled(true);
                                Ext.getCmp('remove_plan_btn').setDisabled(true);
                                Ext.getCmp('print_plan_btn').setDisabled(true);
                            }
                            load = false;
                            selModel.deselect(r);
                            QtipMsg('友情提醒', '您不能多选已生成的计划单。', {direction:'t', mouse:true, width:210});
                        }
                    }
                    bl_id.push(r.get('team_bl_id'));
                });
            },
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            }
        }
    });

    var is_team = (product_s_type=="team") ? true : false;
    var bl_sale_check = new Ext.form.field.Checkbox({
        id : 'bl_sale_fld_id',
        boxLabel: '仅显示已售',
        name: 'bl_saled',
        hidden: true,
        inputValue: '1',
        checked: true,
        listeners: {
            'change':function(t, nv, ov){  }
        }
    });
    var ob_start_date_date = SUNLINE.ExtDateField({
        id:'ob_start_date_id',name:'ob_start_date',
        labelAlign:"right",fieldLabel:"出发日期",labelWidth:60,
        width:165,allowBlank:true, value:new Date()
    });
    var company_box=SUNLINE.CompanyBox({
        where:{org_type:'供应商'},
        config:{
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            id:'company_box_id',
            width:380,
            labelAlign: 'right',
            value: _uinfo.org_name,
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    if(_uinfo.org_type!='管理公司'){
        company_box='<b>出团计划单：</b>';
    }
    var _panel = new Ext.Panel({
        layout : 'border',
        region:'center',
        border:false,
        tbar: [
            company_box,
            ob_start_date_date,
            bl_sale_check,
            {text:'查询',iconCls:'button-sch',handler:search_mod},
            {text:'标记为...', id:'label_btn' },
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            {text:'分项打印', id:'group_print',iconCls:'button-print', menu:{
                items : [
                    {text:'游客信息表',id:'t_print', act:'print',handler:plan_print},
                    {text:'保险名单',id:'t_insurance', act:'insurance',handler:plan_insurance_down},
                    '-',
                    {text:'详细行程',id:'t_print_all', act:'print_all',handler:plan_print},
                    {text:'简易行程',id:'t_print_simple', act:'print_simple',handler:plan_print, hidden:is_team},
                    '-',
                    {text:'项目明细',id:'t_print_items', act:'print_items', handler:plan_print}
                ]
            }},
            {text:'按线路分组', id:'group_prodcut', menu:{
                items : [
                    {text:'线路',field:'team_p_name', handler:set_product_group},
                    {text:'出发时间',field:'team_start_time', handler:set_product_group}
                ]
            }},
            {text:'限制设置',handler:show_set,hidden:isDisabled('TeamPlan::show_set')},
            '->',
            '快速搜索:',
            {
                xtype: 'trigger',
                triggerCls: 'x-form-search-trigger',
                id: 'search_key',
                emptyText: '线路编号、线路名称、团队计调',
                width: 300,
                onTriggerClick: function (e) {
                    search_mod();
                },
                listeners: {
                    "specialkey": function (_t, _e) {
                        if (_e.keyCode == 13) {
                            search_mod();
                        }
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载',
                handler:function(){
                    window.location.reload();
                }
            }
        ],
        items:[_grid]
    });

    //生成、合并、拆分出团计划单（start）
    var _create_plan_win, _create_plan_grid, _create_plan_store, _create_plan_grid_ft, _create_plan_is_collapse = false,
        series, is_stat;
    function create_plan(b){
        var show=false;
        var rows = SUNLINE.getSelected(_grid, true);
        if (rows.length<1) return ExtAlert(is_team ? '请选择您要生成计划的团队信息。': '请选择您需要拆分或合并的班期记录。');
        if (is_team && rows.length!=1) return ExtAlert('请选择一个您要生成计划的团队信息。');
        var bl = {}, fr=rows[0].data, _p={}, _ps=[],
            product = {
                team_p_id: fr.team_p_id, team_p_name:fr.team_p_name, team_p_num: fr.team_p_num,
                team_p_series:fr.team_p_series, team_start_date : fr.team_start_date,
                team_start_time:fr.team_start_time, team_p_days : fr.team_p_days
            };
        if (fr.team_id==0) { //计划单id为0时，才获取班期数据
            Ext.each(rows, function (item) {
                var nd = item.data;
                if (!bl[nd.team_bl_id]) bl[nd.team_bl_id] = [];
                bl[nd.team_bl_id].push(nd.team_bus_num);
                if (in_array(nd.team_p_id, _ps) == -1) _ps.push(nd.team_p_id); //选择的线路数
                _p[nd.team_p_id] = {
                    p_id: nd.team_p_id, p_name: nd.team_p_name, p_num: nd.team_p_num, p_days: nd.team_p_days,
                    team_start_date: nd.team_start_date, team_p_series: nd.team_p_series
                };

            });
        }

        if (!series) {
            series = SUNLINE.DictComBox({
                emptyText:'品牌系列', name:'team_p_series', id:'team_p_series_id', width:150,
                labelAlign:'right', labelSeparator:'：', labelWidth:80, anchor:'95%'
            }, {d_type:'品牌系列'});
            series.store.load();
        }

        if (!_create_plan_store)
            _create_plan_store = SUNLINE.GroupingStore(__app__+'/Seat/teamPlanList',[], {sortInfo:{field:'s_id',direction: "ASC"}, groupField:'o_bl_num'}, false );
        var _pm = (fr.team_id==0) ?  {bl: Ext.encode(bl), type:fr.team_type,p_id:fr.team_p_id,start_date:fr.team_start_date,prepay_type:'0'} : {team_id: fr.team_id,p_id:fr.team_p_id,start_date:fr.team_start_date};
        bl_id_num=_pm;
        SUNLINE.baseParams(_create_plan_store, _pm);



        _create_plan_store.load(function(){
            var bus_num=_create_plan_store.proxy.reader.rawData.bus_num?_create_plan_store.proxy.reader.rawData.bus_num:'';
            if(bus_num){
                Ext.getCmp('bus_num_combox').setValue('');
                Ext.getCmp('bus_num_combox').setDisabled(false);
            }else{
                Ext.getCmp('bus_num_combox').setDisabled(true);
                Ext.getCmp('bus_num_combox').setValue('--');
            }
            //console.log(_ps);
            if(_ps.length>1){
                Ext.getCmp('bus_num_combox').setValue('--');
                Ext.getCmp('bus_num_combox').setHidden(true);
            }
            bus_num_store.loadData(bus_num);
        });



        if (!_create_plan_grid_ft)
            _create_plan_grid_ft = Ext.create("Ext.grid.feature.Grouping",{
                groupHeaderTpl: ["{columnName}：<span style='color: blue'>{name}</span> ",
                    "<span style='font-weight: normal'>(共 <span style='color: red'>{rows:this.values_rows}</span> 位游客)</span>",{
                        values_rows:function(row) {
                            var p_num= 0,small = 0,big=0;
                            Ext.each(row, function(r){
                                small += parseInt(r.data.o_small_num);
                                big += parseInt(r.data.o_big_num);

                            });
                            p_num = small+big;
                            return p_num;
                        }
                    }]
            });
        if (!_create_plan_grid)
            _create_plan_grid = new Ext.grid.GridPanel({
                id: 'tourist_grid',
                region:'center',
                border:false,
                store:_create_plan_store,
                features: _create_plan_grid_ft,
                viewConfig:{emptyText:'暂时没有信息',enableTextSelection:true},
                tbar : [
                    {xtype:'tbtext', id:'tourist_info', text:'请选择订单信息。'},
                    '->',
                    {text:'收起',handler: function(btn) {
                        clog(arguments);
                        if ( !_create_plan_is_collapse )
                            _create_plan_grid_ft.collapseAll();
                        else
                            _create_plan_grid_ft.expandAll();
                        _create_plan_is_collapse = !_create_plan_is_collapse;
                        btn.setText(_create_plan_is_collapse ?  '展开' : '收起');
                    }},
                    {text:'按班期分组', id:'group_btn', menu:{
                        items : [
                            {text:'班期',field:'o_bl_num', handler:set_tourist_group},
                            {text:'报名城市',field:'o_sorg_city', handler:set_tourist_group},
                            {text:'报名社',field:'o_sorg_name', handler:set_tourist_group},
                            {text:'上车站点',field:'start_group', handler:set_tourist_group}
                        ]
                    }}
                ],
                columns: [
                    {text:'班期', dataIndex:'o_bl_num', width:80},
                    {text:'订单号', dataIndex:'o_number', width:148,labelSeparator:'', renderer:function(v,c,r){
                        if(parseInt(r.data.o_confirm_id)>0){
                            return '<a href="'+ __app__ +'/OrderDetail/index/id/'+ v +'/order_type/seller" target="_blank" style="color: red;font-weight: bolder">'+ v +'</a>';
                        }else{
                            return '<a href="'+ __app__ +'/OrderDetail/index/id/'+ v +'/order_type/seller" target="_blank">'+ v +'</a>';
                        }

                    }},
                    {text:'分销商名称', dataIndex:'o_sorg_name', width:150},
                    {text:'分销商城市', dataIndex:'o_sorg_city', width:60},
                    {text:'订单人数', dataIndex:'o_num', width:80,renderer:function(v,c,r){
                        if(parseInt(r.data.o_big_num) + parseInt(r.data.o_small_num)<parseInt(r.data.o_num)){
                            return"<span style='color: red;font-weight: bolder'>"+ r.data.o_num+"</span>"
                        }else{
                            return  r.data.o_num;
                        }
                    }},
                    {text:'人数', dataIndex:'o_num', width:50,renderer:function(v,c,r){
                        return parseInt(r.data.o_big_num) + parseInt(r.data.o_small_num) ;
                    }},
                    {text:'成人', dataIndex:'o_big_num', width:50},
                    {text:'儿童', dataIndex:'o_small_num', width:50},
                    {text:'游客联系人', dataIndex:'o_vip_name', width:60},
                    {text:'手机号', dataIndex:'o_vip_mob', width:100},
                    {text:'出发地', dataIndex:'start_group', width:100,hidden:true},
                    {text:'出发地', dataIndex:'start', width:140,renderer:function(v){
                        var s ='';
                        if (v==''){
                            return'自行前往目的地';
                        }else {
                            for(k in v){
                                s  +='('+v[k]+'人) '+k+'<br/>';
                            }
                            return s;
                        }
                    }
                    },
                    {text:'票价明细', dataIndex:'ticket', width:140,renderer:function(v){

                        var s ='';
                        for(k in v){
                            s  +='('+v[k]+'人) '+k+'<br/>';
                        }
                        return s;
                    }
                    },
                    {text:'订单备注', dataIndex:'o_remark', width:100},
                    {text:'订单状态', dataIndex:'o_status', width:80}
                ],

                style:'border-top:1px solid #ccc', //#3892d3',
                selModel:{ selType: 'checkboxmodel', mode:'SIMPLE' }
            });
        _create_plan_grid._params = product;
        _create_plan_grid.getSelectionModel().on({
            //select : function(t, r, i, eo){
            //    //这里做选中该行订单的所有游客
            //    var o_number = r.get('s_o_number');
            //    select_order(o_number);
            //},
            //'deselect':function(t, r, i, e){
            //    //这里做取消选中该行订单的所有游客
            //    var o_number = r.get('s_o_number');
            //    select_order(o_number, true);
            //},
            'selectionchange' : function(t, sed, e){
                //这里统计选中的信息
                if (is_stat) clearTimeout(is_stat);
                is_stat = setTimeout( function(){ stat_tourist_info(sed); }, 50 );
            }
        });

        if (!_create_plan_win)
            _create_plan_win = new Ext.Window({
                title : '生成计划单',
                width : 880,
                height : 500,
                layout : 'border',
                modal : true,
                maximizable : true,
                closeAction : 'hide',
                items : [_create_plan_grid],
                tools : [{
                    type:'refresh', tooltip: '刷新',
                    handler: function(event, toolEl, panelHeader) { _create_plan_store.reload(); }
                }],
                tbar : [
                    /*series.box,*/
                    {id:'team_p_name_id',xtype:'textfield', width:300},
                    bus_num,
                    {text:'生成计划单', id:'btn_plan_create', handler:plan_create, hidden: (b.id=='remove_plan_btn')},
                    {text:'加入', id:'btn_select_plan', handler:select_plan, hidden: (b.id=='remove_plan_btn')},
                    {text:'移除订单', id:'btn_remove_order', handler:remove_order, hidden: (b.id!='remove_plan_btn')},
                    {
                        id:'pre_pry',
                        xtype: "checkboxfield",
                        name: "pre_pry",
                        fieldLabel: "",
                        boxLabel: "包含待付款<span style='color: red'>(可能产生收款风险请谨慎操作)</span>",
                        //maxLength:"200",
                        //width:500,
                        labelSeparator:'',
                        //hidden:true
                        //checked:false,
                        listeners:{
                            change:function(i){
                                var bool = Ext.getCmp('pre_pry').getValue();
                                bl_id_num.prepay_type=bool?1:0;
                                SUNLINE.baseParams(_create_plan_store, bl_id_num);
                                _create_plan_store.load();
                            }
                        }
                    },
                ]
            });
        Ext.each(rows, function (item) {
            if((parseInt(item.get('o_num'))!=(parseInt(item.get('team_adult'))+parseInt(item.get('team_children')))) && b.id!='remove_plan_btn'){
                Ext.Msg.confirm('友情提醒', '当前计划单中存在分车订单，请注意【订单人数】和【人数】，您是否继续操作？', function(btn){
                    if (btn=='yes') {
                        _create_plan_win.show()
                    }else {
                        _create_plan_win.hide()
                    };
                })
            }else{
                _create_plan_win.show(show);
            }
        });
        bus_num_store.loadData([{name:1}]);
        var av=Ext.getCmp('pre_pry').setValue('');
        _create_plan_win._p = _p;
        _create_plan_win._ps = _ps;
        var title = b.id=='remove_plan_btn' ? '撤销计划单' : '生成计划单';
        if (b.id!='remove_plan_btn'){
            title += '<span style="color: yellow;"> (共'+ _ps.length + (is_team ? '个团队' : '条线路') +')</span>';
        }else{
            title += '<span style="color: yellow;">（请注意已经安排的资源数量等信息！）</span>';
        }
        series.box.setValue(product.team_p_series).setDisabled(_ps.length==1);
        Ext.getCmp('team_p_name_id').setValue(product.team_p_name).setDisabled(_ps.length==1);

        Ext.getCmp('btn_plan_create').setHidden(b.id=='remove_plan_btn');
        Ext.getCmp('btn_select_plan').setHidden(b.id=='remove_plan_btn');
        Ext.getCmp('btn_remove_order').setHidden(b.id!='remove_plan_btn');
        Ext.getCmp('bus_num_combox').setHidden(b.id=='remove_plan_btn');
        Ext.getCmp('pre_pry').setHidden(b.id=='remove_plan_btn');
        //if(_ps.length>1){
        //    Ext.getCmp('bus_num_combox').setValue('PIN');
        //    Ext.getCmp('bus_num_combox').setHidden(true);
        //}
    }


    //车号选择
    var bus_num_store = Ext.create('Ext.data.Store',{
        fields: [],
        data: []
    });
    var bus_num = Ext.create('Ext.form.ComboBox', {
        id: 'bus_num_combox',
        fieldLabel: '车号',
        labelWidth: 40,
        labelAlign: 'right',
        store: bus_num_store,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name',
        //value:'',
        emptyText: '请选择',
        width: 120,
    });



    var setItems = [
        {name:"team_id", fieldLabel:"team_id", maxLength:"10",xtype:"hidden"},
        {xtype: 'radiogroup', fieldLabel: '是否显示签单金额',labelWidth:160,
            items: [
                {boxLabel: '显示', name: 'team_show_sign', inputValue: 1, checked:true},
                {boxLabel: '隐藏', name: 'team_show_sign', inputValue: 0}
            ]
        },
        {xtype: 'radiogroup', fieldLabel: '是否显示分销商名称',labelWidth:160,
            items: [
                {boxLabel: '显示', name: 'team_show_sorg', inputValue: 1, checked:true},
                {boxLabel: '隐藏', name: 'team_show_sorg', inputValue: 0}
            ]
        },
        {xtype: 'radiogroup', fieldLabel: '是否允许导游修改单价',labelWidth:160,
            items: [
                {boxLabel: '允许', name: 'team_allow_edit', inputValue: 1},
                {boxLabel: '不允许', name: 'team_allow_edit', inputValue: 0, checked:true}
            ]
        },
    ];
    var set_form=Ext.create('Ext.form.Panel',{
        layout: 'column',bodyPadding: 10,id:'form',border:false,width: 450,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',columnWidth:1,
            defaults:{anchor: '100%',allowBlank:false,labelAlign:'right'}
        },
        items: [
            {title:'限制设置',cls:'tcol2',items:setItems},
        ]
    });
    var set_win = Ext.create('Ext.window.Window',{
        title:'限制设置',
        closeAction:'hide',
        width: 460,
        height:220,
        modal:true,
        items:set_form,
        buttons:[
            {text:'保存',handler:do_set},
            {text:'关闭',handler:function(){
                set_win.hide();
            }}
        ]
    });


    var slt_plan_grid, slt_plan_store, slt_win,confirm_id=0;
    function select_plan(b){
        var rows = SUNLINE.getSelected( _create_plan_grid, true );
        if (rows.length==0) return ExtAlert('请选择需要加入计划的订单信息。');

        Ext.each(rows, function(r){
            confirm_id += parseInt(r.get('o_confirm_id'));
        });
        if (parseInt(confirm_id)>1){
            Ext.Msg.alert('友情提示','所选订单包含待审核状态订单，不能加入！');
            confirm_id=0;
            return false;
        }
        var pt = _create_plan_grid._params;
        if (!slt_plan_store)
            slt_plan_store = SUNLINE.JsonStore(__app__ + '/TeamPlan/history', [], false);
        SUNLINE.baseParams(slt_plan_store, {start_date:pt.team_start_date, type:product_s_type});
        slt_plan_store.load();
        if (!slt_plan_grid)
            slt_plan_grid = Ext.create('Ext.grid.Panel', {
                store: slt_plan_store,
                viewConfig:{emptyText:'暂无可用于合并的计划单信息。'},
                columns : [
                    {header:'ID', dataIndex:'team_id', hidden:true},
                    {header:'出发日期', dataIndex:'team_start_date', width:90, renderer:number2date},
                    {header:'结束日期', dataIndex:'team_end_date', width:90, renderer:number2date},
                    {header:'计划单编号', dataIndex:'team_num', width: 150/*,renderer:function(v,m,r){
                     var td = r.get('td')== 0, color= td ?'blue':'black', qtip = ' data-qtip="' + (td ? '当天出发':'已经出发')+'" ';
                     return '<span style="color: '+color+'"'+qtip+'>'+ v +'</span>'
                     } */},
                    {header:'人数', dataIndex:'team_saled', width: 50},
                    {header:'品牌系统', dataIndex:'team_p_series', width: 150},
                    {header:'产品名称', dataIndex:'team_p_name', width: 280}
                ]
            });
        if (!slt_win)
            slt_win = Ext.create('Ext.Window', {
                title:'选择已有计划单',
                width : 800,
                height : 400,
                modal : true,
                closeAction : 'hide',
                layout : 'fit',
                items : [slt_plan_grid],
                tools : [
                    { type:'refresh', tooltip: '刷新', handler: function(en, t, ph) { slt_plan_store.reload(); }}
                ],
                buttons : [
                    {text:'确认加入', handler:join_plan },
                    {text:'取消', handler:function(){ slt_win.hide();}}
                ]
            });
        slt_win.show(b.id);
    }
    function join_plan(b){
        var row = SUNLINE.getSelected(slt_plan_grid);
        if (!row) return ExtAlert('请选择一个想要加入的计划单。');
        if(row.data.team_credit_type=='1'){
            return ExtAlert('此计划单已经在报账流程中，不能加入。');
        }
        var rows = SUNLINE.getSelected(_create_plan_grid, true);
        if (rows.length<1) return ExtAlert('无法获取游客信息，请重试！');

        var tourist = [],big= 0,small= 0;  //获取已选择的游客座位ID


        Ext.each(rows, function(r){
            //console.log(r);
            //return false;

            tourist.push(r.get('o_id'));
            //num += parseInt(r.get('o_num'));
            big += parseInt(r.get('o_big_num'));
            small += parseInt(r.get('o_small_num'));
        });


        var params = { s_oid: tourist.join(','), team_id:row.get('team_id'),num:big+small ,big:big,small:small};
        clog(params);
        Ext.Msg.confirm('友情提醒', '您真的要加入到['+row.get('team_num')+']计划中吗？', function(btn){
            if (btn!='yes') return false;

            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : __app__ + '/TeamPlan/join_plan',
                params : params,
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info;
                    if (ret.status==1){
                        slt_win.hide();
                        _create_plan_win.hide();
                        _store.reload();
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
    //从计划单里移除游客订单
    function remove_order(b){
        Ext.Msg.confirm('友情提示', '您真的要将选中订单中的游客移出该计划单吗？', function(y){
            if (y!='yes') return false;

            var rows = SUNLINE.getSelected(_create_plan_grid, true);
            if (rows.length<1) return ExtAlert('请选择您要生成计划单的游客名单。');
            //clog(_create_plan_grid._params);
            var tourist = [];  //获取已选择的游客座位ID
            Ext.each(rows, function(r){ tourist.push(r.get('o_id')); });
            var tp = SUNLINE.getSelected(_grid);
            var team_id = tp.get('team_id');

            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url : __app__ + '/TeamPlan/remove_order',
                params : { team_id: team_id, s_ids : tourist.join(',') },
                method : 'POST',
                success : function(response, opts){
                    var ret = Ext.decode(response.responseText);
                    var msg = ret.info.msg;
                    if (ret.status==1){
                        /*var rst = ret.info.team_plan;
                         _create_plan_grid.getStore().remove(rows);
                         tp.set('team_saled',rst['team_saled'] );
                         tp.set('team_adult',rst['team_adult'] );
                         tp.set('team_children',rst['team_children'] );*/
                        _create_plan_win.hide();
                        _store.reload();
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

    function stat_tourist_info(rs){
        //clog(is_stat);
        var order=[], city=[],small= 0,big = 0, num = 0;
        Ext.each(rs, function(r){
            var ob = r.get('o_number'), ct = r.get('o_sorg_city'), o_num = r.get('o_num'),big_mum = r.get('o_big_num'),small_num = r.get('o_small_num');
            if (in_array(ob, order)<0) order.push(ob);
            if (in_array(ct, city)<0) city.push(ct);
            small += parseInt(small_num);
            big += parseInt(big_mum);
        });
        num = small+big;

        //var si = { od_num:order.length, man: man, wom:wom, old:_old, adult:a, children:c }
        var info = '选中'+ order.length + '个订单共<span style="color: #ff4500">' +(num)+
            '</span>人, <span style="color: #6a5acd">成人'+big+ '人</span>，<span style="color: #008000">儿童'+small+'人</span>，<span style="color: #b26e4a">来自'+
            city.length+'城市</span>'
        Ext.getCmp('tourist_info').setText(info);
        //_create_plan_grid._selected_stat = si;
        is_stat = null;
    }

    function set_product_group(b){
        _store_tmp.group(b.field);
        Ext.getCmp('group_product').setText('按' + b.text + '分组');
    }

    function set_tourist_group(b){
        _create_plan_store.group(b.field);
        Ext.getCmp('group_btn').setText('按' + b.text + '分组');
    }

    //发送数据到后台生成计划单
    function plan_create(b){
        var rows = SUNLINE.getSelected(_create_plan_grid, true);


        if (rows.length<1) return ExtAlert('请选择您要生成计划单的游客名单。');
        //clog(_create_plan_grid._params);
        var tourist = [],num= 0,big_num = 0,small_num = 0, bus_num=[],bed_num= 0,o_worg_id='',o_confirm_id=0;  //获取已选择的游客座位ID
        Ext.each(rows, function(r){
            tourist.push(r.get('o_id'));
            big_num += parseInt(r.get('o_big_num'));
            small_num += parseInt(r.get('o_small_num'));
            bus_num=r.get('s_bus_num');
            bed_num += parseInt(r.get('o_bed_num'));
            o_worg_id= r.get('o_worg_id');
            o_confirm_id += parseInt(r.get('o_confirm_id'));
        });

        num +=  big_num+ small_num;
        var si = _create_plan_grid._selected_stat; //选择的统计数据
        var bus_num_select=Ext.getCmp('bus_num_combox').getValue();//复选框内的班车号
        if(!bus_num_select ){
            Ext.Msg.alert('友情提示','请选择您要生成的车号!');
            return false;
        }
        if(o_confirm_id>0){
            Ext.Msg.alert('友情提示','所选订单包含待审核状态订单，请查看订单号为红色的订单进行审核！');
            return false;
        }

        var params = _create_plan_grid._params;
        params['team_o_ids'] = tourist.join(',');
        params['num'] = num;
        params['big_num'] = big_num;
        params['small_num'] = small_num;
        params['bus_num'] = bus_num;
        params['bed_num'] = bed_num;
        params['bus_num_select'] = bus_num_select;
        params['o_worg_id'] = o_worg_id;


        if (_create_plan_win._ps.length > 1){
            params['team_p_series'] = series.box.getValue();
            params['team_p_name'] = Ext.getCmp('team_p_name_id').getValue();
            params['team_p_num'] = 'PIN';
            params['team_p_id'] = 0;
        }

        Ext.Msg.confirm('友情提醒', '您真的要为选中的'+ num +'位游客创建出团计划单吗？',function(y){
            if ( y == 'yes' ) plan_create_ajax(params);
        });
    }

    function plan_create_ajax(params){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: __app__ + '/TeamPlan/create_plan',
            params : params,
            method : 'POST',
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg = ret.info;
                if (ret.status==1){
                    _store.load();
                    _create_plan_win.hide();
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
     * 按订单批量选择
     * @param o_number 需要选择或取消选择的订单号
     * @param deselect true为取消选择
     * @param grid 选择的对象，默认为_create_plan_grid
     */
    function select_order(o_number, deselect, grid){
        //clog('select_order 1');
        if (!grid) grid = _create_plan_grid;
        var store = grid.getStore(), sm = grid.getSelectionModel();
        store.each(function(r){
            if (r.get('s_o_number')==o_number)
                if (deselect){
                    sm.deselect(r);
                }else{
                    sm.select(r, true);
                }
        });
    }

    function create_team_plan(params){
        clog(params, '创建团队计划单');
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: __app__ + '/TeamPlan/create_team_plan',
            params : params,
            method : 'POST',
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var msg = ret.info;
                if (ret.status==1){
                    _store.load();
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
    //生成、合并、拆分出团计划单（end）

    //编辑计划单(start)

    //计划单明细(start)
    var items_url=$__app__ + '/TeamPlanItems/json_items_json';
    var items_field = [{name:"tpi_id"}];
    var items_store=SUNLINE.GroupingStore(items_url,items_field,{sortInfo:{field:'tpi_days'}, groupField:'tpi_days'},false);
    var items_grouping = Ext.create("Ext.grid.feature.Grouping",{
        groupByText : '使用当前字段分组',
        showGroupsText : '分组显示',
        showGroupName : false,
        emptyText: '暂无成本数据。',
        groupHeaderTpl: ['',"<span class='items-box-id'><span class='items-group-right'>{rows:this.values_rows}</span><font color='blue'>{name:this.values_name}</font> (共 {[values.rows.length]} 个项目)</span>",{
            values_rows:function(row){
                if(row.length>0){
                    return store_money_json(row);
                }
                return '';
            },
            values_name:function(row){
                var type=items_store.getGrouper();

                if(type._property!='tpi_days')return row;
                return group_day(row);
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
            run_money+=money;
            //如果是购物店计算不一样
            if(rw.tpi_type=='购物店'){
                money=(rw.tpi_price*rw.tpi_num)+(rw.tpi_money*(rw.tpi_percent/100));
                money=parseFloat(money)?parseFloat(money):0;
                money=num_max_len(money);
            }
            if(rw.tpi_pay_type=='收入'){ money=0-money;}
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
        if(in_array(type,['购物店','应付社'])!=-1){
            cash_money=0-cash_money;
            sign_money=0-sign_money;
            all_money=0-all_money;
        }
        var json={cash_num:cash_num,cash_money:cash_money,sign_num:sign_num,sign_money:sign_money,all_money:all_money};
        var json_txt='现金('+json.cash_num+'笔):<font color="green">￥'+json.cash_money.toFixed(2)+'</font>　' +
            '签单('+json.sign_num+'笔):<font color="#ff4500">￥'+json.sign_money.toFixed(2)+'  </font>　' +
            '总金额:<font color="#6495ed">￥'+json.all_money.toFixed(2)+'</font>';
        if(type=='购物店'){json_txt=json_txt+'　总流水:'+run_money.toFixed(2)}
        return json_txt;
    }


    //价格显示
    function si_settle_fn(v,i,r){
        if(!v)return 0;
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
        }else if(r.data.tpi_type=='司机车辆' || r.data.tpi_type=='交通'){
            return '<font color="'+co+'" title="'+tt+'">￥'+ r.data.tpi_money+'</font>';
        }else{
            return '<font color="'+co+'" title="'+tt+'">￥'+ v +'</font>';
        }
    };
    function tpi_num_fn(v,n,r){
        if(r.data.tpi_type=='购物店'){
            //提成=单价*数量
            var money=(r.get("tpi_price")*r.get('tpi_num')).toFixed(2);
            return '<font title="人头='+ r.get("tpi_price")+'*'+ r.get('tpi_num')+'人='+money+'">人:'+money+'</font>';
        }else if(r.data.tpi_type=='司机车辆' || r.data.tpi_type=='交通'){
            return '<b>'+ 1 +'</b>';
        }
        v=parseFloat(v)?parseFloat(v):0;
        return '<b>'+ v+'</b>';
    }
    function money_fn(v,n,r){
        var clr='green';
        if(r.get('tpi_pay_type')=='收入')clr='red';
        v=parseFloat(v)?parseFloat(v):0;
        //money=(rw.tpi_price*rw.tpi_num)+(rw.tpi_money*(rw.tpi_percent/100));
        if(r.data.tpi_type=='购物店') v=(r.get("tpi_price")*r.get('tpi_num'))+(r.get("tpi_money")*(r.get('tpi_percent')/100));
        return '<font color="'+clr+'"><b>￥'+ v.toFixed(2)+'</b></font>';
    }
    function settle_fn(v,n,r){
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
    function remark_fn(v){
        if(!v)return '';
        return '<span data-qtip="'+v+'">'+v+'</span>';
    }
    function day_fn(v){
        if(v<=0)return '-';
        return '第'+v+'天';
    }
    function group_day(v){
        if (v<=0) return "整团";
        return "第"+ v +"天的消费项目";
    };
    var si_settle_type_box=SUNLINE.LocalComob({
        id:'ti_insti_type',
        fields:['ti_insti_type'],
        data:[['现金'],['签单']],
        config:{
            id:"tpi_settle"
        }
    });
    var items_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"tpi_team_id", dataIndex:"tpi_team_id", width:10,hidden:true},
        {header:"tpi_id", dataIndex:"tpi_id", width:10,hidden:true},
        {header:"单位ID", dataIndex:"tpi_cs_id", width:10,hidden:true},
        {header:"资源名称", dataIndex:"tpi_name", width:180,
            editor:new Ext.form.TextField({})
        },
        {header:"资源类型", dataIndex:"tpi_type", width:80},
        {header:"结算类型", dataIndex:"tpi_settle", width:80,align:'center',renderer:settle_fn,editor:si_settle_type_box},
        {header:"第几天", dataIndex:"tpi_days", width:80,align:'center',renderer:day_fn,
            editor:new Ext.form.NumberField({
                selectOnFocus:true,blur:days_change_group
            })},
        {header:"单价", dataIndex:"tpi_price", width:80,align:'right',renderer:si_settle_fn,
            editor:new Ext.form.NumberField({
                listeners:{ change:ti_settle_price }
            })
        },
        {header:"数量", dataIndex:"tpi_num", width:80,align:'center',renderer:tpi_num_fn,
            editor:new Ext.form.NumberField({
                listeners:{ change:ti_settle_num }
            })
        },
        {header:"总金额", dataIndex:"tpi_money", width:100,align:'right',renderer:money_fn,
            editor:new Ext.form.NumberField({
                listeners:{ change:ti_settle_money }
            })
        },
        {header:"联系人", dataIndex:"tpi_contacts", width:140,renderer:contacts_fn,
            editor:new Ext.form.TextField({})
        },
        {header:"备注", dataIndex:"tpi_remark", width:480,renderer:remark_fn,
            editor:new Ext.form.TextField({})
        }
    ];
    var ts_grid={
        region:'center',
        border:false,
        style:'border:1px #ccc solid',
        store:items_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有成本项目',
            deferEmptyText:true,
            enableTextSelection:true
        },
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        minHeight:300,
        features: [items_grouping],
        columns:items_cm,
        tbar : [
            '<b>团队成本：</b>',
            {text:'新增消费项目',iconCls:'button-add',id:'add_items_id',
                menu:{
                    items:[
                        {text: '景点',cls_id:'items_cls',handler:items_add},
                        {text: '住宿',cls_id:'items_cls',handler:items_add},
                        {text: '餐饮',cls_id:'items_cls',handler:items_add},
                        {text: '导游',cls_id:'items_cls',handler:items_add},
                        {text: '交通',cls_id:'items_cls',handler:items_add},
                        {text: '物品',cls_id:'items_cls',handler:items_add},
                        {text: '其他费用',cls_id:'items_cls',handler:items_add}
                    ]
                }
            },
            {text:'复制',iconCls:'button-view',handler:items_copy},
            {text:'删除',iconCls:'button-del',id:'del_items_id',handler:items_del},
            {text:'历史出团计划',iconCls:'',id:'teamplan_history',handler:teamplan_history},
            '->',
            {text:'按第几天分组', id:'group_items_btn', menu:{
                items : [
                    {text:'按第几天分组', handler:function(b){
                        items_store.group('tpi_days');
                        Ext.getCmp('group_items_btn').setText(b.text);
                    }},
                    {text:'按项目类型分组', handler:function(b){
                        items_store.group('tpi_type');
                        Ext.getCmp('group_items_btn').setText(b.text);
                    }},
                    {text:'按结算方式分组', handler:function(b){
                        items_store.group('tpi_settle');
                        Ext.getCmp('group_items_btn').setText(b.text);
                    }}
                ]
            }}
        ],
        bbar:[
            { xtype:'textfield',name:'team_total_fee',id:'team_total_fee',fieldLabel: '导游备用金',width:200},'元','->',
            { xtype:'tbtext',id:'bottom_money',style:'font-weight:bold;',text:''}
        ],
        // listeners: {
        //     beforeedit: function (a,b) {
        //         if(b.record.get('tpi_type') == '导游' && b.field == 'tpi_settle'){
        //             return false;
        //         }
        //     }
        // }
    };
    var items_grid=new Ext.grid.GridPanel(ts_grid);
    function items_add(e){
        var row=SUNLINE.getSelected(_grid);
        row=row.data;
        var days=1;
        var tpi_num=0;
        if(in_array(e.text,['导游','司机车辆','交通'])!=-1){
            days=-1;
            tpi_num=1;
        }else{
            tpi_num=row.team_saled;
        };
        var items_data={tpi_type:e.text,tpi_settle:'签单',tpi_days:days,tpi_num:tpi_num};
        items_store.add(items_data);
    }
    function items_copy(){
        var row=SUNLINE.getSelected(items_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要复制的消费项目!');
            return false;
        }
        var copy_data=new_add_data(row.data);
        items_store.add(copy_data);
    }

    /**
     * 复制新加明细
     * @param data
     * @returns {{}}
     */
    function new_add_data(data){
        var list={};
        for(var key in data){
            if(key=='id')continue;
            list[key]=data[key];
        }
        return list;
    }

    function days_change_group(){
        var type=items_store.getGrouper();
        if(type._property!='tpi_days'){
            return true;
        }
        setTimeout(function(){
            items_store.group('tpi_days');
        },200);
    }




    function items_del(){
        var row=SUNLINE.getSelected(items_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要删除的消费项目!');
            return false;
        }
        items_store.remove(row);
    }
    //操作单价时,操作结算总额
    function ti_settle_price(t,nv,ov,o){
        var row=SUNLINE.getSelected(items_grid);
        var tpi_price=parseFloat(nv);
        var ti_num=parseFloat(row.get('tpi_num'))?parseFloat(row.get('tpi_num')):0;
        var price=tpi_price*ti_num;
        row.set('tpi_money',round_format(price));
    }
    function ti_settle_num(t,nv,ov,o){
        var row=SUNLINE.getSelected(items_grid);
        var tpi_price=parseFloat(row.get('tpi_price'))?parseFloat(row.get('tpi_price')):0;
        var ti_num=parseFloat(nv);
        var price=tpi_price*ti_num;
        row.set('tpi_money',round_format(price));
    }
    function ti_settle_money(t,nv){
        var row=SUNLINE.getSelected(items_grid);
        var tpi_money=parseFloat(nv);
        var ti_num=parseFloat(row.get('tpi_num'))?parseFloat(row.get('tpi_num')):0;
        if(ti_num==0){
            row.set('tpi_price',0);
            return false;
        }
        row.set('tpi_price',round_format(tpi_money/ti_num));
    }
    //计划单明细(end)

    //历史出团计划
    var plan_store_url = $__app__ + '/TeamPlan/his_plan_list';
    var plan_store = SUNLINE.JsonStore(plan_store_url, [], false);

    function teamplan_history() {
        var row = SUNLINE.getSelected(_grid);
        SUNLINE.baseParams(plan_store, {
            team_p_id:row.get('team_p_id'),
            team_org_id:row.get('team_org_id'),
        });
        plan_his_window.show();
    }
    var plan_his_type = SUNLINE.LocalComob({
        id: 'plan_his_type',
        fields: ['type_value', 'type_text'],
        data: [
            {'type_value': 1, 'type_text': '相同产品计划单'},
            {'type_value': 2, 'type_text': '所有计划单'},
        ],
        config: {
            displayField: 'type_text',
            valueField: 'type_value',
            fieldLabel: '计划单筛选',
            allowBlank: true,
            id: 'plan_his_type',
            name: 'plan_his_type',
            labelWidth: 80,
            labelAlign: 'right',
            width: 230,
            value: '相同产品计划单'
        }
    });
    var plan_cm = [
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"team_id", width:100, hidden:true},
        {header:"产品信息", dataIndex:"team_p_name", width:200, renderer:show_product},
        {header:"出发日期", dataIndex:"team_start_date", width:120, renderer:start_date},
        //{header:"人数?",dataIndex:"team_saled",width:60, menuDisabled:true, sortable:false,align:'center', renderer:function(v,m,r){ return v- r.get('team_confirm'); }, tooltip:'该人数不含预留人数'},
        {header:"人数?",dataIndex:"team_saled",width:60, menuDisabled:true, sortable:false,align:'center',
            renderer:function(v,m,r){
                if(!r.get('team_prepay_num')){
                    return v;
                }else{
                    return (v-r.get('team_prepay_num'));
                }
            }, tooltip:'该人数不含待确认人数与待付款人数'},
        {header:"成人",dataIndex:"team_adult",width:50, menuDisabled:true, sortable:false,align:'center'},
        {header:"儿童",dataIndex:"team_children",width:50, menuDisabled:true, sortable:false,align:'center'},
        {header:"团队计调", dataIndex:"team_user", width:90},
        {header:"司机车辆",dataIndex:"team_driver_name",width:90, align:'center', menuDisabled:true, sortable:false, renderer:drivers},
        {header:"住宿",dataIndex:"team_items", width:60, align:'center', menuDisabled:true, sortable:false, renderer:hotel},
        {header:"景点",dataIndex:"team_items", width:60, align:'center', menuDisabled:true, sortable:false, renderer:scenic},
        {header:"餐饮",dataIndex:"team_items", width:60, align:'center', menuDisabled:true, sortable:false, renderer:meals},
        {header:"其他",dataIndex:"team_items",width:60, align:'center', menuDisabled:true, sortable:false, renderer:goods},
    ];
    var get_item_url;
    var plan_his_grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:plan_store,
        columns:plan_cm,
        viewConfig:{emptyText:'暂时没有信息',enableTextSelection:true},
        tbar: [
            {text: '查看明细', iconCls: '', id: 'plan_item_show',act:'print_items', handler:plan_print },
            plan_his_type,
            '出发日期:',
            SUNLINE.ExtDateField({
                    id: 'tpi_start',
                    name: 'tpi_start',
                    labelWidth: 0,
                    labelAlign: "right",
                    style: 'margin-top:5px;',
                    fieldLabel: " ",
                    labelSeparator: '',
                    width: 110,
                    gang: 'tpi_end',
                    start: true,
                    value: '',
                }
            ),
            '~',
            SUNLINE.ExtDateField({
                    id: 'tpi_end',
                    name: 'tpi_end',
                    labelWidth: 0,
                    labelAlign: "right",
                    style: 'margin-top:5px;',
                    fieldLabel: " ",
                    labelSeparator: '',
                    width: 110,
                    gang: 'tpi_start',
                    value: '',
                }
            ),
            {text:'查询',iconCls:'button-sch', handler: doSearch},
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store:plan_store,
            displayInfo: true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有相关信息'
        }),
    });

    var plan_his_window = Ext.create('Ext.Window', {
        title : '历史出团计划',
        width : 960,
        height : 500,
        closeAction : 'hide',
        layout : 'border',
        items : [plan_his_grid],
        listeners : {'show':function(){
            plan_store.load();
            plan_his_type.reset();
            Ext.getCmp('tpi_start').reset();
            Ext.getCmp('tpi_end').reset();
        }},
        buttons:[
            '->',
            {text:'复制', handler:copy_item},
            {text:'关闭',handler:function(){plan_his_window.hide();}
            }]
    });
    //搜索查询数据
    function doSearch() {
        var plan_his_type = Ext.getCmp('plan_his_type').getValue();
        var tpi_start     = Ext.getCmp('tpi_start').getValue();
        var tpi_end       = Ext.getCmp('tpi_end').getValue();
        SUNLINE.baseParams(plan_store,{plan_his_type:plan_his_type,tpi_start:tpi_start,tpi_end:tpi_end},true);
        plan_store.currentPage = 1;
        plan_store.load();
    }
    function copy_item() {
        cp_win.show();
    }
    var cp_win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        title:'友情提示',
        items: new Ext.form.FormPanel({
            border:false,
            bodyStyle:'background:none;padding:10px',
            defaultType:'textfield',
            items: [
                {id:"msg_show",xtype:'fieldset',autoHeight:true,border:0,html:'复制操作将会修改原有的消费明细,请选择修改方式?'},
            ]
        }),
        buttons:[
            {text:'追加', handler:function(){copy_edit_store('add')}},
            {text:'覆盖', handler:function(){copy_edit_store('cover')}},
            {text:'关闭', handler:function () {
                cp_win.hide();
            }}
        ]
    });
    function copy_edit_store(type){
        var from_row = SUNLINE.getSelected(plan_his_grid);
        if (!from_row) return ExtAlert('请选择您要复制项目明细的计划单！');
        var to_row = SUNLINE.getSelected(_grid);
        var url = $__app__ + '/TeamPlan/get_plan_items';
        Ext.Ajax.request({
            url: url,
            params: {from_team_id: from_row.get('team_id'), to_team_id: to_row.get('team_id')},
            method: 'POST',
            success: function (response, otps) {
                var ret = Ext.decode(response.responseText);
                if(ret.length>0){
                    if (type == 'cover') items_store.removeAll();
                    Ext.each(ret, function (v) {
                        var data = new_add_data(v);
                        items_store.add(data);
                    })
                }
                plan_his_window.hide();
                cp_win.hide();
                return ExtAlert('操作成功', '提示');
            },
            failure: function (response, otps) {
                cp_win.hide();
                var ret = Ext.decode(response.responseText);
                return ExtAlert('操作失败', '提示');
            }
        });
    }
    //历史出团计划end

    var edit_plan_form = new Ext.FormPanel({
        bodyStyle:"background:#fff;padding:15px;",
        border:false,
        defaults:{
            style:'padding-top:10px;',
            defaults: {
                labelWidth: 80,
                labelAlign:'right'
            }
        },
        items:[
            {
                xtype: 'fieldset',
                title: '<b>基本团队信息</b>',
                collapsible: true,
                id:'basic_plan',
                defaults: {labelWidth: 80,labelAlign:'right'},
                items:[
                    {name:'team_detail_title',fieldLabel: '团队信息' ,xtype: 'displayfield'},
                    {
                        cls:'tcol2',
                        width:600,
                        defaults:{ xtype: 'displayfield',labelWidth: 80,labelAlign:'right', width:200},
                        items:[
                            {name:'team_start_date',fieldLabel: '出团时间' },
                            {name:'team_end_date',fieldLabel: '返程日期' }
                        ]
                    },
                    {name:'team_saled_detail',fieldLabel: '出游人数',xtype: 'displayfield' }/*,
                     {value: '成人三晚:4（4人）；成人四星:8（7人）',name:'team_biu',fieldLabel: '床位情况',xtype: 'displayfield' }*/
                ]
            },
            {
                xtype: 'fieldset',
                title: '<b>导游、司机信息</b>',
                collapsible: true,
                id:'service_plan',
                items:[
                    {
                        cls:'tcol2',
                        width:600,
                        defaults:{ xtype: 'textfield',labelWidth: 80,labelAlign:'right', width:260},
                        items:[
                            {name:'team_id',fieldLabel: '计划单ID',hidden:true},
                            {name:'team_local_guide_name',fieldLabel: '地陪姓名'},
                            {name:'team_local_guide_tel',fieldLabel: '地陪电话' },
                            {name:'team_guide_name',fieldLabel: '全陪姓名'},
                            {name:'team_guide_tel',fieldLabel: '全陪电话' },
                            {name:'team_driver_name',fieldLabel: '司机姓名' },
                            {name:'team_driver_tel',fieldLabel: '司机电话' }
                        ]
                    },
                    {xtype: 'textfield',name:'team_bus',fieldLabel: '车辆信息',width:520 }
                ]
            },
            items_grid,
            {
                xtype: 'fieldset',
                title: '<b>注意事项</b>',
                collapsible: true,
                id:'out_plan',
                items:[
                    {xtype: 'textareafield',name:'team_remark',width:'98%' }
                ]
            },
        ]
    });

    var edit_plan_panel = new Ext.Panel({
        title:'编辑计划单',
        width:'100%',
        region:'east',
        border:false,//无边框
        collapsed:true,
        bodyBorder: false,
        autoScroll : true,
        hidden:true,
        fixed:true,
        items:[ edit_plan_form ],
        bbar:[
            '->',
            {text:'保存计划单',handler:plan_items_save},
            {text:'关闭操作',handler:plan_items_close}
        ]
    });
    edit_plan_panel.on({
        collapse:function(p){
            p.setHidden(true);
        },
        beforeexpand:function(p){
            p.setHidden(false);
        }
    });
    function edit_plan_info(e){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择需要编辑的计划单!');
            return false;
        };
        var data=row.data;
        if(edit_plan_panel.getCollapsed()){
            edit_plan_panel.expand();
        };
        console.log(data);
        data.team_start_date=number2date(data.team_start_date)+' '+data.team_start_time;
        data.team_end_date=number2date(data.team_end_date);
        console.log(data);
        data.team_saled_detail='成人:'+data.team_adult+'；儿童:'+data.team_children+'；共('+data.team_saled+')；床位：<span title="该数量包含计划单涉及的所有订单床位数，如订单跨车情况下此数量大于实际计划单内床位数！">'+data.team_bed_num+' 床 <li class="fa fa-question-circle"></li></span>';
        data.team_detail_title='<font color="red">【'+data.team_num+'】</font>'+data.team_p_name;
        edit_plan_panel.setTitle('编辑计划单 '+data.team_detail_title);
        var edit_data=edit_plan_form.getForm();
        edit_data.setValues(data);
        SUNLINE.baseParams(items_store,{team_id:data.team_id,tpi_add_type:-1});
        items_store.load();
    }
    function plan_items_save(e){
        var _form=edit_plan_form.getForm();
        if(!_form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        };
        Ext.MessageBox.confirm('友情提示','你确定需要保存计划单吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            var form_data=_form.getValues();
            //导游备用金
            form_data.team_total_fee=Ext.getCmp('team_total_fee').getValue();
            //获取明细信息
            var items_data=[];
            var r = false;
            items_store.each(function(v){
                var row= v.data;
                if(row.tpi_name == '' || row.tpi_name == undefined){
                    r = true;
                    return;
                }
                delete(row.id);
                items_data.push(row);
            });
            if(r){
                myMask.hide();
                Ext.Msg.alert('友情提示', '资源名称不能为空');
                return false;
            }
            form_data.items_data=Ext.encode(items_data);
            Ext.Ajax.request({
                url:$__app__ + '/TeamPlan/plan_items_save',
                method:'POST',
                params:form_data,
                success : function(response, opts){
                    var rst = Ext.decode(response.responseText);
                    myMask.hide();
                    if(200==rst.code){
                        edit_plan_panel.collapse();
                        search_mod();
                        Ext.Msg.alert('友情提示',rst.data);
                    }else{
                        Ext.Msg.alert('友情提示',rst.message);
                    }
                },
                failure : function(response, opts){
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '未知错误！');
                }
            });
        });
    }

    function plan_items_close(e){
        var _form=edit_plan_form.getForm();
        var form_data=_form.getValues();
        edit_plan_panel.collapse();
    }

    items_store.on({
        datachanged:function(t){
            bottom_money_fn();
        },
        update:function(t){
            bottom_money_fn();
        }
    });
    function bottom_money_fn(){
        var bottom_money=Ext.getCmp('bottom_money');
        var team_total_fee=Ext.getCmp('team_total_fee');
        var cash_money= 0,cash_num= 0,sign_money= 0,sign_num=0;
        items_store.each(function(v){
            var row= v.data,
                tpi_money=parseFloat(row.tpi_money)?parseFloat(row.tpi_money): 0,
                tpi_num=parseFloat(row.tpi_num)?parseFloat(row.tpi_num): 0;
            if(row.tpi_settle=='现金'){
                cash_money+= tpi_money;
                cash_num+= 1
            }else{
                sign_money+= tpi_money;
                sign_num+= 1
            }
        });
        bottom_money.setText('现金('+cash_num+'笔):￥'+cash_money.toFixed(2)+'；签单('+sign_num+'笔):￥'+sign_money.toFixed(2)+'；总金额:￥'+(cash_money+sign_money).toFixed(2));
        var _rows = SUNLINE.getSelected(_grid);
        if(!_rows.get('team_total_fee')){
            team_total_fee.setValue(cash_money);
        }
    }
    //编辑计划单(end)

    //打印显示窗口（计划单、详情行程、简易行程）
    var show_win, sp_store;
    function plan_print(b){
        if(b.id == 'plan_item_show'){
            var row = SUNLINE.getSelected(plan_his_grid);
            if (!row) return ExtAlert('请选择您要查看项目明细的计划单！');
        }else{
            var row = SUNLINE.getSelected(_grid);
            if (!row) return ExtAlert('请选择您要查看游客信息的计划单！');
        }

        if (!sp_store)
            sp_store = SUNLINE.JsonStore(__app__ + '/TeamPlan/get_products', [], false);
        SUNLINE.baseParams(sp_store, {
            team_id:row.get('team_id'), team_p_id:row.get('team_p_id'), team_p_name: row.get('team_p_name'),
            team_p_num: row.get('team_p_num'), team_p_series:row.get('team_p_series')
        });
        if (row.get('team_p_id')=='0') sp_store.load();
        if (!show_win)
            show_win = new Ext.Window({
                title : '计划单',
                width : 820,
                height : Ext.getBody().getHeight()-50,
                maximizable : true,
                closeAction : 'hide',
                modal : true,
                html : '<iframe id="_show_win_frm" name="_show_win_frm" frameborder="0" style="width: 100%; height: 100%;"></iframe>',
                listeners : { show:function(w){ } },
                buttons : [
                    {
                        xtype:'combo', id:'p_selection', width:460, store:sp_store,
                        displayField:'p_name', valueField:'p_id',
                        editable : false,
                        listeners: {
                            select : function(t, r){
                                set_window_url(r);
                            }
                        }
                    },
                    '->',
                    {text:'显示成本', id:'show_money', handler:function(b){
                        var url = window._show_win_frm.location.href;
                        var txt = '/type/all';
                        var u = (b.text == '显示成本') ? url + txt : url.replace(txt, '');
                        b.setText( (b.text == '显示成本') ? '隐藏成本' : '显示成本' );
                        window._show_win_frm.location = u;
                    }},
                    {text:'隐藏签单金额', id:'show_sign', handler:function(b){
                        var url = window._show_win_frm.location.href;
                        var txt = '/sign/off';
                        var u = (b.text == '隐藏签单金额') ? url + txt : url.replace(txt, '');
                        b.setText( (b.text == '隐藏签单金额') ? '显示签单金额' : '隐藏签单金额' );
                        window._show_win_frm.location = u;
                    }},
                    {text:'导出', id:'order_s_num_export', handler:function(b){
                        var url = window._show_win_frm.location.href;
                        location.href = url.replace('plan_print', 'planExport');
                    }},
                    {text:'按座位号排序显示', id:'order_s_num', handler:function(b){
                        var url = window._show_win_frm.location.href;
                        var txt = '/type/1';
                        var u = (b.text == '按座位号排序显示') ? url + txt : url.replace(txt, '');
                        b.setText( (b.text == '按座位号排序显示') ? '按订单排序显示' : '按座位号排序显示' );
                        window._show_win_frm.location = u;

                    }},
                    {text:'打印', iconCls:'button-print', handler:function(b){
                        try{
                            window._show_win_frm.focus();
                            window._show_win_frm.do_print();
                        }catch (e){
                            ExtAlert('目标窗口中的打印方法没有定义。');
                        }
                    }},
                    {text:'关闭', handler:function(b){ show_win.hide(); }}
                ]
            });
        show_win.setTitle(b.text);
        show_win.show(b.id);
        show_win._b_ = b;
        Ext.getCmp('show_money').setHidden(b.act!='print_items');
        Ext.getCmp('show_sign').setHidden(b.act!='print_detail');
        Ext.getCmp('order_s_num').setHidden(b.act!='print');
        Ext.getCmp('order_s_num_export').setHidden(b.act!='print');
        if(set)Ext.getCmp('order_s_num').setText('按订单排序显示');
        Ext.getCmp('p_selection').setHidden(b.act=='print' || b.act=='print_items');
        setTimeout(function(){ set_window_url( null); }, 500);
    }

    function show_set() {
        var row = SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要修改设置的计划单');
            return false;
        }
        set_form.getForm().setValues(row.data);
        set_win.show();
    }

    function do_set() {
        var set = set_form.getForm().getValues();
        Ext.Msg.confirm('友情提示', '您真的要修改设置吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url: $__app__ + '/TeamPlan/show_set',
                    method: 'post',
                    waitMsg: '数据加载中，请稍后....',
                    params: set,
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.status == 1) {
                            Ext.Msg.alert('友情提示', '修改设置成功');
                            set_win.hide();
                            _store.reload();
                        } else {
                            Ext.Msg.alert('友情提示', '修改设置失败！');
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '修改设置失败！');
                    }
                });
            }
        });
    }

    function send_wx_msg() {
        var row = SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要发送通知的计划单');
            return false;
        }
        Ext.Msg.confirm('友情提示', '您真的要发送通知吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url: $__app__ + '/TeamPlan/send_wx_msg',
                    method: 'post',
                    waitMsg: '数据加载中，请稍后....',
                    params: {team_id:row.get('team_id')},
                    success: function (response, opts) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.status == 1) {
                            Ext.Msg.alert('友情提示', '通知发送成功');
                        } else {
                            Ext.Msg.alert('友情提示', '通知发送失败！');
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.alert('友情提示', '通知发送失败！');
                    }
                });
            }
        });
    }


    function set_window_url(sct){
        var b = show_win._b_;
        if(b.id == 'plan_item_show'){
            var row = SUNLINE.getSelected(plan_his_grid);
        }else{
            var row = SUNLINE.getSelected(_grid);
        }
        var ps = Ext.getCmp('p_selection');
        var team_id = row.get('team_id'), pid='0';
        if (row.get('team_p_id')!='0') {
            ps.setValue(row.get('team_p_name')).setReadOnly(true);
        }else{
            if (!sct){
                var pi = sp_store.getAt(0);
                pid = pi.get('p_id');
                ps.setValue(pi.get('p_name')).setReadOnly(false);
            }else{
                pid = sct[0].get('p_id');
            }
        }
        var url = __app__;
        var action = b.act == 'print' ? 'plan_print' : 'journey';
        if (b.act == 'print_items'){
            action = 'print_items';
        }else if(b.act=='print_detail'){
            action = 'print_detail';
        }else{
            if (row.get('team_type')=='团队订单' && b.act=='print_all') action = 'team_journey';
        }
        url += '/TeamPlan/'+ action +'/id/' + team_id + '/num/'+ row.get('team_p_num');
        if (pid!='0') url += '/pid/'+pid;
        if (b.act=='print_simple') url += '/flag/yes';
        if(set){
            url +='/type/1';
        }

        clog(url);
        window._show_win_frm.location = url;
    }

    /**
     * 保险名单导出
     * @param b
     * @returns {*}
     */
    function plan_insurance_down(b){
        var rows = SUNLINE.getSelected(_grid, true);
        if (rows.length != 1) return ExtAlert('只能选择一条数据进行导出。');
        var r = rows[0], team_id = r.get('team_id'), bl_id = r.get('team_bl_id');
        var url = __app__ + '/Seat/insurance/team_id/'+team_id+'/bl_id/'+ bl_id;
        window.location = url;
    }

    /**
     * 出团计划单查询
     */
    function search_mod(){
        var ob_start_date_val = ob_start_date_date.getRawValue();
        var bl_sale_fld_val = bl_sale_check.getValue();
        var org_id=Ext.getCmp('company_box_id').getValue();
        var search_key = Ext.getCmp('search_key').getValue(); //快速搜索关键词

        if (_uinfo.org_type != '管理公司') org_id = _uinfo.org_id;
        bl_sale_fld_val = bl_sale_fld_val ? 1 : 'all';
        SUNLINE.baseParams(_store, {
            org_id: org_id,
            type: product_s_type ? product_s_type : 'products',
            bl_saled: bl_sale_fld_val,
            start_date: ob_start_date_val,
            search_key: search_key,
        }, true);
        _store.currentPage = 1;
        _store.load();
    }

    /**
     * 标签操作方法
     * @param b
     * @returns {*}
     */
    window.set_label = function(b){
        var row = SUNLINE.getSelected(_grid);
        if (!row) return ExtAlert('请选择您想标记的计划单数据。');
        var team_id = row.get('team_id');
        if (team_id==''||team_id=='0') return ExtAlert('标签只能对已经生成的计划单进行标记。');

        var data = {team_id:team_id, team_label: b.text,type:'team_label'};
        Ext.Ajax.request({
            url:__app__ + '/TeamPlan/set_label',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                QtipMsg('友情提醒', info.msg, {direction:'t', width:210});
                if (ret.status){
                    row.set('team_label', info.label);
                }
            },
            failure:function (response, otps) {
                QtipMsg('友情提醒', '设置标签操作失败', {direction:'t', width:210});
            }
        });
    };

    new Ext.Viewport({
        layout : 'border',
        items : [_panel,edit_plan_panel]
    });
    search_mod();
    //注入日志处理流程
    ziyo_log({ listeners : [{grid: _grid, action:'TeamPlan', table:'TeamPlan', pk_id:'team_id'}] });
    ziyo_label('label_btn');
});