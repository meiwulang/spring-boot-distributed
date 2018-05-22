var WG = {};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $__app__ + '/s.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '出团计划单';

    var url = $__app__ + '/TeamPlanTpl/team_list';
    var fld = [ "team_id"];
    var _store=SUNLINE.GroupingStore(url,fld,{sortInfo:{field:'team_num',direction: "ASC"}, groupField:'team_p_name'},false);
    var grouping_store = Ext.create("Ext.grid.feature.Grouping",{
        groupHeaderTpl: "{name} (共 {[values.rows.length]} 个团队)"
    });

    //酒店安排操作
    function hotel_plan_fn(v){
        if(!v)return '<span style="color: #999;">未安排</span>';
        var hotel_detail={},hotel_name='';
        for(var i=0;i< v.length;i++){
            var row = v[i];
            var hp_man = row.hp_man, hp_man_tel = row.hp_man_tel;
            if (!hp_man) hp_man='';
            if (!hp_man_tel) hp_man_tel='';
            if (row.hp_name) hotel_detail[row.hp_name] = row.hp_name+' 【联系电话:'+hp_man+hp_man_tel+'】';
            if (row.hp_name && !hotel_name) hotel_name = row.hp_name;
        };
        var hotel_txt='';
        for(var j in hotel_detail){
            if(hotel_txt){
                hotel_txt+='<br>'+hotel_detail[j];
            }else{
                hotel_txt=hotel_detail[j];
            }
        };
        var frist=v[0];
        return '<span data-qtip="'+hotel_txt+'">'+hotel_name+'</span>';
    };


    var _cm=[
        new Ext.grid.RowNumberer(),
        {header:"team_id",dataIndex:"team_id",width:80,hidden:true},
        {header:"team_guide_bus",dataIndex:"team_guide_bus",width:80,hidden:true},
        {header:"team_end_date",dataIndex:"team_end_date",width:80,hidden:true},
        {header:"出团状态",dataIndex:"team_credit_status",width:150,renderer:start_status},
        {header:"团队编号",dataIndex:"team_num",width:120},
        {header:"产品信息",dataIndex:"team_p_name",width:160, renderer:function(v,i,r){
            if(r.data.p_series){
                var enid = r.get('encode_p_id');
                var url = $__app__+"/Goal/"+enid;
                return '<a href = "'+url+'" target = "_blank" title="'+v+'" >'+ r.data.p_series+'--'+r.data.p_num+'</a>';
            }else{
                return '<a href = "'+$__app__+'/TeamList/PrintTeam/num/'+ r.data.p_num+'" target = "_blank"  title = "'+v+'">'+v+'</a>';
            }
        }},
        {header:"出发日期",dataIndex:"team_start_date",width:130, renderer:start_date},
        {header:"人数",dataIndex:"team_saled",width:50,align:'center'},
        {header:"全陪导游",dataIndex:"team_guide_name",width:80, renderer:quan_gudie},
        {header:"地陪导游",dataIndex:"team_local_guide_name",width:80, renderer:di_gudie},
        {header:"司机姓名",dataIndex:"team_driver_name",width:80, renderer:driver_plan},
        {header:"酒店安排",dataIndex:"team_hotel_detail",width:150, renderer:hotel_plan_fn},
        {header:"包车费用",dataIndex:"team_fee_car",align:'right',width:100, renderer:money},
        {header:"住宿费用",dataIndex:"team_fee_hotel",align:'right',width:100, renderer:money},
        {header:"导服费用",dataIndex:"team_fee_guide",align:'right',width:100, renderer:money},
        {header:"用餐费用",dataIndex:"team_fee_meal",align:'right',width:100, renderer:money},
        {header:"景点费用",dataIndex:"team_fee_scenic",align:'right',width:100, renderer:money},
        {header:"购物店费用",dataIndex:"team_fee_store",align:'right',width:100, renderer:money},
        {header:"保险费用",dataIndex:"team_fee_insurance",align:'right',width:100, renderer:money},
        {header:"其他费用",dataIndex:"team_fee_other",align:'right',width:100, renderer:money},
        {header:"故宫预约状态",dataIndex:"team_appoint_status",width:100}
    ];


    var bl_status_combo = new Ext.form.ComboBox({
        typeAhead: true,
        width:100,
        triggerAction: 'all',
        lazyRender:true,
        editable: false,
        mode: 'local',
        value: 0,
        id:'bl_status',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [ 'bl_status_Id',  'displayText' ],
            data: [[0,'全部'],['销售中', '销售中'], ['停售', '停售'], ['计划', '计划'], ['暂停', '暂停'], ['取消', '取消']]
        }),
        valueField: 'bl_status_Id',
        displayField: 'displayText'
    });


    var bl_sale_check={
        xtype: 'checkbox',
        id:'bl_sale_fld_id',
        boxLabel: '仅显示已售',
        name: 'bl_saled',
        inputValue: '1',
        checked: true,
        listeners: {
            'change':function(t, nv, ov){
                search_mod();
            }
        }
    };


    var p_days_combo = new Ext.form.ComboBox({
        typeAhead: true,
        width:150,
        triggerAction: 'all',
        lazyRender:true,
        mode: 'local',
        id:'p_days',
        emptyText: '可直接填写天数',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [ 'p_days_Id', 'displayText' ],
            data: [[0,'全部'],[1, '一日游'], [2, '二日游'], [3, '三日游'], [-1, '四日及以上']]
        }),
        valueField: 'p_days_Id',
        displayField: 'displayText'
    });


    var _grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:_store,
        features: [grouping_store],
        columns: _cm, //表格列定义
        style:'border-top:3px solid #3892d3',
        //selModel:new Ext.selection.Model({mode:'MULTI'}),
        selModel:{ selType: 'checkboxmodel' },
        viewConfig:{
            groupByText : '使用当前字段分组',
            showGroupsText : '分组显示',
            showGroupName : true,
            enableGroupingMenu:true,
            hideGroupedColumn : false,
            emptyText: '暂无团队信息。',
            groupTextTpl: '{text} <span style="font-weight: normal;">(共{[values.rs.length]}个团队)</span>'
        },
        tbar : [
            bl_sale_check,
            '-',
            '状态：',
            bl_status_combo,
            '天数：', p_days_combo,
            '-',
            {text:'按出发时间分组',id:'_group_by_id',field:'team_p_name',handler:setGroup,
                menu:{
                    items :[
                        {text:'按线路分组',field:'team_p_name',handler:setGroup},
                        {text:'按出发时间分组',field:'team_start_time',handler:setGroup}
                    ]
                }
            }
        ],
        listeners:{
            cellclick:function(v,g,n,r){
                var td_status = r.data.team_credit_status;
                if(td_status=='未报账' || td_status=='未提交'){
                    Ext.getCmp('editor_modify_id').setDisabled(false);
                }else{
                    Ext.getCmp('editor_modify_id').setDisabled(true);
                }
            },
            selectionchange : function(selModel, sel, e){
                var p_id = '';
                Ext.each(sel, function(r){
                    var id = r.get('team_p_id');
                    if (p_id=='')
                        p_id = id;
                    else{
                        if (p_id != id) {
                            selModel.deselect(r);
                            QtipMsg('友情提醒', '您不能选择不同的线路产品。', {direction:'t', mouse:true, width:210});
                        }
                    }
                });
            },
            cellmousedown : function(t, td, ci, r, tr, ri, e, o){
                set_mouse(e);
            }
        }
    });




    function start_status(v,m,r){
        if(v=="审核中"){
            v="<span style='color: #f00000'>导游报账"+v+"</font>"
        }else if(v=="审核完成"){
            v="<span style='color: #24840b'>导游报账"+v+"</font>"
        }else if(v=="审核驳回"){
            v="<span style='color: #9a1c21;font-weight: bold'>导游报账"+v+"</font>"
        }else if(v=="报账中"){
            v="<span style='color: #9a1c21;font-weight: bold'>导游报账"+v+"</font>"
        }else{
            if(r.get('team_id')){
                v="<span style='color: #004ca5'>"+r.get('team_si_status')+"</font>"
            }else{
                v="<span style='color: #a576d5'>未安排</font>"
            }
        };
        var img = 'hmenu-unlock.gif" data-qtip="未锁定';
        if (r.data.team_lock==1 || r.data.team_lock=='on'){
            img = 'hmenu-lock.gif" data-qtip="锁定报名，只有生成计划才会真正锁定';
        };
        return '<img src="' + $app_public_images_path + img + '">&nbsp;&nbsp;&nbsp;'+v;
    };


    function plan_status(v){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        };
        return v;
    };


    function start_date(v,m,r){
        var time='';
        if(r.data.team_start_time!='00')time=r.data.team_start_time;
        return v+' &nbsp;'+time;
    };


    function quan_gudie(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_guide_tel+'">'+v+'</span>'
        }
        return v;
    };


    function di_gudie(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_local_guide_tel+'">'+v+'</span>'
        }
        return v;
    };


    function driver_plan(v,m,r){
        if (!v){
            v = '<span style="color: #999;">未安排</span>'
        }else{
            v='<span title="'+v+' &nbsp;'+ r.data.team_driver_tel+'">'+v+'</span>'
        }
        return v;
    };


    //设置Store分组与按钮的文字
    function setGroup(b){
        var g = Ext.getCmp('_group_by_id');
        g.setText(b.text);
        _store.group(b.field);
        g.field = b.field;
    };


    function ti_day(v){
        if (v==-1) return '-';
        return '第'+ v +'天';
    };


    var items_list=[
        {text:'车辆',iconCls:'button-add',id:'car_id'},
        {text:'导游',iconCls:'button-add',id:'guides_id'},
        {text:'景区',iconCls:'button-add',id:'scenic_id'},
        {text:'住宿',iconCls:'button-add',id:'hotal_id'},
        {text:'餐饮',iconCls:'button-add',id:'caterers_id'},
        {text:'购物店',iconCls:'button-add',id:'shop_id'},
        {text:'地接',iconCls:'button-add',id:'dijie_id'},
        {text:'大交通',iconCls:'button-add',id:'dajiaotong_id'},
        {text:'小交通',iconCls:'button-add',id:'xiaojiaotong_id'},
        {text:'保险',iconCls:'button-add',id:'baoxian_id'},
        {text:'其他',iconCls:'button-add',id:'out_id'}
    ];

    var reckon_type='ti_all_money';
    var items_cost_url=$__app__+'/TeamPlan/ticket_items_list';
    var items_cost_field=['ti_id'];
    var items_cost_store=SUNLINE.GroupingStore(items_cost_url,items_cost_field,{sortInfo:{field:'ti_type_new'}, groupField:'ti_type_new'},false);
    //计划单里项目成本的grid
    var _team_items_grid=ItemsList({
        store:items_cost_store,
        items_list:items_list,
        reckon_type:reckon_type,
        team_guide:false,//是否是导游报账
        team_plan:true,//判断是否是出团计划单中所用
        team_hotel_plan:true,//出团计划单 酒店独有
        plan_type:'height_false',
        pop_num:1,
        tpl_car:isDisabled('TeamPlanTpl::tpl_car'),  //安排车辆
        tpl_diao:isDisabled('TeamPlanTpl::tpl_diao')  //安排计调
    },function(m,s,i){
    },function(){});
    //产品列表容器
    var pro_url=$__app__+'/TeamPlanTpl/select_pro_team';
    var pro_field=['pid'];
    var pro_store = SUNLINE.JsonStore(pro_url,pro_field);
    var pro_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"p_id", width:50, hidden:true},
        {header:"产品编号", dataIndex:"p_num", width:100},
        {header:"产品主标题", dataIndex:"p_name", width:300}
    ];
    //左侧产品
    var pro_grid=new Ext.grid.GridPanel({
        title:'所有线路',
        region:'west',
        width : 290,
        maxWidth : 360,
        minWidth : 280,
        floatable: false,
        margin: '5 0 0 0',
        store:pro_store,
        columns:pro_cm,
        bodyBorder: false,
        autoScroll : true,
        collapsed : true,
        collapsible:true,
        style:'border-right:2px solid #3892d3',
        defaults: {
            collapsible: true,
            split: true,
            bodyPadding: 10
        },
        tbar:[
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'产品名称',
                width:130,
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
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:pro_store,
            displayInfo: true,
            displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有产品信息'
        })
    });
    // 计划单主表单
    var ob_start_date_date=SUNLINE.ExtDateField({id:'ob_start_date_id',name:'ob_start_date',labelAlign:"right",fieldLabel:"出发日期",labelWidth:60,width:165,allowBlank:true, value:new Date()});
    var _panel = new Ext.Panel({
        layout : 'border',
        region:'center',
        border:false,
        tbar: [
            {text:'选择产品',
                handler:function(){
                    pro_grid.expand(true);
                }},
            '-',
            ob_start_date_date,
            '-',
            {text:'查询',iconCls:'button-sch',handler:sch_modify},
            '-',
            {text:'编辑',act:'edit',iconCls:'button-edit',id:'editor_modify_id',handler:editor_modify, disabled:isDisabled('TeamPlanTpl::team_items_lock')},
            '-',
            {text:'游客信息表',act:'print',iconCls:'button-print',handler:_print, disabled:isDisabled('TeamPlanTpl::output')},
            '-',
            {text:'导游计划单',act:'print',iconCls:'button-print',handler:_print, disabled:isDisabled('Goal::PrintProList')},
            '-',
            /*{text:'查看游客',act:'print',iconCls:'button-print',handler:_print, disabled:isDisabled('Seat::printTraveller')},
            '-',*/
            {text:'安排酒店',act:'print',iconCls:'button-print',handler:hotel_room},
            '-',
            {text:'生成预约单',act:'print',iconCls:'button-print',handler:create_appoint,disabled:isDisabled('TourAppoint::create_plan')},
            '-',
            {text:'故宫预约',iconCls:'fa fa-book',handler:appoint,disabled:isDisabled('TourAppoint::appoint')},
            '-',
            {text:'导出游客',iconCls:'button-excel',handler:load_excel},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'}
        ],
        items:[pro_grid, _grid]
    });
    //添加导游司机 按钮
    function tpl_botton(idd,name,value,return_name){
        return_name={
            id:idd,
            name:name,
            text:value,
            fieldLabel:"",
            xtype:'button',
            width:90,
            style:'margin-left:16px;margin-top:3px;margin-bottom:3px;'
        }
        return return_name;
    };
    var team_model_tpl=SUNLINE.DictComBox({name:'team_tpl_title',id:'team_tpl_title',fieldLabel:"<b style='color:#666'>计划模板</b>",labelWidth:70,width:600,labelAlign:"right"},{'d_type':'计划模板'});
    var editor_from= new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle: 'padding:0px 30px 0px 10px;',
        width:Ext.getBody().getWidth(),
        height:Ext.getBody().getHeight(),
        autoScroll : true,
        items : [{
            columnWidth :1,
            style:'margin-top:5px;',
            items : [{
                title: '基本团队信息',
                xtype : 'fieldset',
                autoHeight:true,
                cls:'tcol3',
                defaults:{
                    xtype:'textfield',
                    labelWidth:70,
                    labelAlign:"right",
                    style: 'width:33%;margin-top5px;'
                },
                items :[
                    {xtype :'hidden', id:'team_guide_bus', name:'team_guide_bus'},
                    {xtype :'hidden', id:'team_id_new', name:'team_id'},
                    {xtype :'hidden', id:'team_end_date', name:'team_end_date'},
                    { fieldLabel: '团队编号',name: 'team_num', allowBlank:false, readOnly:true },
                    { fieldLabel: '出发时间',readOnly:true, name: 'team_start_date'},
                    { fieldLabel: '报名人数',readOnly:true, name: 'team_saled'},
                    { xtype : 'checkbox', fieldLabel : '终止报名', name: 'team_lock', boxLabel: '锁定报名', inputValue:1},
                    {id:'team_print_contacts', xtype : 'checkbox', fieldLabel : '打印联系人', name: 'team_print_contacts', boxLabel: '打印清单联系人', inputValue:1, checked:true},
                    {id:'team_print_detail', xtype : 'checkbox', fieldLabel : '打印成本', name: 'team_print_detail', boxLabel: '打印签单成本', inputValue:1, checked:true}
                ]
            }]
        },{
            columnWidth:.25,
            style:'margin-right:15px;margin-top:5px;',
            items : [
                {
                    title : '全陪导游',
                    xtype : 'fieldset',
                    defaultType: 'textfield',
                    autoHeight:true,
                    cls:'tcol2',
                    defaults:{xtype:'textfield',labelWidth:70,labelAlign:"right", style: 'width:99%;'},
                    items :[
                        {xtype :'hidden', id:'team_guide_oid', name:'team_guide_id'},
                        {xtype :'hidden', id:'team_guide_org', name:'team_guide_org'},
                        {fieldLabel:'导游姓名', id:'u_realname_id', name:'team_guide_name',readOnly:isDisabled('TeamPlanTpl::tpl_guide')},
                        {fieldLabel:'导游电话', id:'team_guide_tel', name:'team_guide_tel',readOnly:isDisabled('TeamPlanTpl::tpl_guide')},
                        tpl_botton('u_realname_id2','u_realname_id2','添加全陪','u_realname_id22'),
                        tpl_botton('quan_orderbus','quan_orderbus','编辑票务','quan_orderbus_name')
                    ]
                }
            ]
        },{
            columnWidth:.25,
            style:'margin-right:15px;margin-top:5px;',
            items : [
                {
                    title : '地陪导游',
                    xtype : 'fieldset',
                    defaultType: 'textfield',
                    autoHeight:true,
                    cls:'tcol1',
                    defaults:{xtype:'textfield',labelWidth:70,labelAlign:"right", style: 'width:99%;'},
                    items :[
                        {xtype :'hidden', id:'team_local_guide_id', name:'team_local_guide_id'},
                        {xtype :'hidden', id:'team_local_guide_org', name:'team_local_guide_org'},
                        {fieldLabel:'地陪导游', id:'u_realname_local', name:'team_local_guide_name',readOnly:isDisabled('TeamPlanTpl::tpl_guide')},
                        {fieldLabel:'导游电话', id:'team_local_guide_tel', name:'team_local_guide_tel',readOnly:isDisabled('TeamPlanTpl::tpl_guide')},
                        tpl_botton('u_realname_local2','u_realname_local2','添加地陪','u_realname_local22')
                    ]
                }
            ]
        },{
            columnWidth:.25,
            style:'margin-right:15px;margin-top:5px;',
            items : [
                {
                    title : '司机信息',
                    xtype : 'fieldset',
                    defaultType: 'textfield',
                    autoHeight:true,
                    cls:'tcol1',
                    defaults:{xtype:'textfield',labelWidth:70,labelAlign:"right", style: 'width:99%;'},
                    items :[
                        {fieldLabel:'team_driver_oid', id:'team_driver_oid',name:'team_driver_id',xtype :'hidden'},
                        {fieldLabel:'team_bus_oid', id:'team_bus_oid',name:'team_bus_id',xtype :'hidden'},
                        {fieldLabel:'team_driver_org', id:'team_driver_org',name:'team_driver_org',xtype :'hidden'},
                        {fieldLabel:'司机姓名', id:'team_driver_name_id',name:'team_driver_name',readOnly:isDisabled('TeamPlanTpl::tpl_car')},
                        {fieldLabel:'司机电话', id:'team_driver_tel',name:'team_driver_tel',readOnly:isDisabled('TeamPlanTpl::tpl_car')},
                        tpl_botton('team_driver_name_id2','team_driver_name_id2','添加司机','u_realname_local22')
                    ]
                }
            ]
         },{
            columnWidth:.25,
            style:'margin-right:15px;margin-top:5px;',
            items : [
                {
                    title : '车辆信息',
                    xtype : 'fieldset',
                    defaultType: 'textfield',
                    autoHeight:true,
                    cls:'tcol1',
                    defaults:{xtype:'textfield',labelWidth:70,labelAlign:"right", style: 'width:99%;'},
                    items :[
                        {fieldLabel:'车牌号码', id:'team_bus',name:'team_bus',readOnly:isDisabled('TeamPlanTpl::tpl_car')},
                        {fieldLabel:'座位数', xtype:'numberfield', id:'team_bus_seats',name:'team_bus_seats',readOnly:isDisabled('TeamPlanTpl::tpl_car')},
                        tpl_botton('team_bus2','team_bus2','添加车辆','u_realname_local22')
                    ]
                }
            ]
         },{
            columnWidth : 1,
            items : [_team_items_grid],
            autoHeight:true
         },{
            columnWidth :1,
            style:'margin-top:5px;',
            items : [
                { xtype: 'textarea',
                    hideLabel: true,
                    name: 'team_remark',
                    id:'team_remark_id',
                    width:'100%',
                    height:120
                }
            ]
         },
            {
                columnWidth :1,
                style:'margin-top:5px;',
                items : [ team_model_tpl.box ]
            },
            {
            columnWidth :1,
            style:'margin-top:5px;',
            items : [
                { xtype: 'textarea',
                    hideLabel: true,
                    name: 'team_tpl_detail',
                    id:'team_tpl_detail',
                    width:'100%',
                    height:120
                }
            ]
        }
        ]
    });


    //选择模版时赋值
    team_model_tpl.box.on({
        select:function(c, r, e){
            var row=r[0];
            Ext.getCmp('team_tpl_detail').setValue(row.get('detail'));
        }
    });


    //计划单内导游司机车辆添加
    function realname_(v,i,r){
        var name_val;
        if(r.data.gu_type_status=='带团中'){
            name_val='<span style="color:#ca0000"> <i class="fa fa-flag"></i> '+v+'</span>';
        }else{
            name_val=v;
        }
        return name_val;
    };


    function u_mobile_(v,i,r){
        var name_val;
        if(r.data.type_name=='车辆'){
            name_val='<span>'+v+'座</span>';
        }else{

            name_val='<span> <i class="fa fa-phone-square"></i> '+v+'</span>';
        }
        return name_val;
    };


    function team_start_date_(v,i,r){
        if(v)return v+'-'+ r.data.team_end_date;
    };


    var gudie_plan_url = $__app__ + '/TeamPlanTpl/gudie_plan';
    var gudie_plan_field = [{name:"hp_id"}];
    var gudie_plan_store = new SUNLINE.JsonStore(gudie_plan_url, gudie_plan_field,false);
    var gudie_plan_cm =[
        new Ext.grid.RowNumberer({width:30}),
        {header:"gu_id", dataIndex:"gu_id", width:50, hidden:true},
        {header:"u_id", dataIndex:"u_id", width:50, hidden:true},
        {header:"team_end_date", dataIndex:"team_end_date", width:50, hidden:true},
        {header:"gu_org_id", dataIndex:"gu_org_id", width:50, hidden:true},
        {header:"姓名/车牌号", dataIndex:"u_realname", width:120,renderer:realname_},
        {header:"联系方式/座位数", dataIndex:"u_mobile", width:140,align:'center',renderer:u_mobile_},
        {header:"出团时间", dataIndex:"team_start_date", width:90,renderer:team_start_date_},
        {header:"类型", dataIndex:"type_name", width:100, hidden:true},
        {header:"状态", dataIndex:"gu_type_status", width:100, hidden:true}
    ];


    var gudie_plan_grid= new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        columns:gudie_plan_cm,
        store : gudie_plan_store,
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: gudie_plan_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无站点数据'
        }),
        viewConfig:{
            emptyText : '',
            deferEmptyText : true
        },
        tbar:[
            {text:'空闲',id:'one_kxian',handler:sc_ht_add},
            '-',
            {text:'带团中',id:'tow_daituan',handler:sc_ht_add},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'gudie_plan_dosearch',
                cls:'search-icon-cls',
                emptyText:'',
                width:110,
                onTriggerClick:function (e) {
                    gudie_plan_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            gudie_plan_dosearch();
                    }
                }
            }
        ]
    });


    function gudie_plan_dosearch(){
        var key=Ext.getCmp('gudie_plan_dosearch').getValue();
        SUNLINE.baseParams(gudie_plan_store,{skey:key},true);
        gudie_plan_store.currentPage=1;
        gudie_plan_store.load();
    };


    function gudie_store_status(status_name){
        var key=Ext.getCmp('gudie_plan_dosearch').getValue();
        var row=SUNLINE.getSelected(_grid);
        SUNLINE.baseParams(gudie_plan_store,{
            start_time:row.data.team_start_date,
            end_time:row.data.team_end_date,
            team_id:row.data.team_id,
            skey:key,
            gu_type_status:status_name
        },true);
        gudie_plan_store.currentPage=1;
        gudie_plan_store.load()
    };


    function sc_ht_add(v){
        gudie_store_status(v.text);
    };


    var gudie_plan_win=new Ext.Window({
        width : 400,
        height : 500,
        closeAction : 'hide',
        modal : true,
        items : [gudie_plan_grid],
        autoHeight : true,
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        buttons:[
            {text:'确定选择',handler:t_items_add},
            {text:'关闭',handler:function(){
                gudie_plan_win.hide();
            },style:'margin-right:15px;'}
        ]
    });


    function set_id_mod(a,b,c,d){
        var row=SUNLINE.getSelected(gudie_plan_grid);
        Ext.getCmp(a).setValue(row.data.u_realname);
        Ext.getCmp(b).setValue(row.data.u_mobile);
        Ext.getCmp(c).setValue(row.data.u_id);
        if(d)Ext.getCmp(d).setValue(row.data.gu_org_id);
    };


    function t_items_add(){
        var row=SUNLINE.getSelected(gudie_plan_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        };
        if(row.data.type_name=='全陪导游'){
            set_id_mod('u_realname_id','team_guide_tel','team_guide_oid','team_guide_org');
        }else if(row.data.type_name=='地陪导游'){
            set_id_mod('u_realname_local','team_local_guide_tel','team_local_guide_id','team_local_guide_org');
        }else if(row.data.type_name=='司机'){
            set_id_mod('team_driver_name_id','team_driver_tel','team_driver_oid','team_driver_org');
        }else{
            set_id_mod('team_bus','team_bus_seats','team_bus_oid');
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        var dataa=row.data;
        dataa['team_id']=Ext.getCmp('team_id_new').getValue();
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlanTpl/save_work_man',
            params:dataa,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var result = Ext.decode(response.responseText);
                Ext.Msg.alert('提示信息',row.data.type_name+'添加成功!');
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '删除失败');
            }
        });

        gudie_plan_win.hide();
    };


    function gudie_store_load(type_name){
        var key=Ext.getCmp('gudie_plan_dosearch').getValue();
        var row=SUNLINE.getSelected(_grid);
        SUNLINE.baseParams(gudie_plan_store,{
            start_time:row.data.team_start_date,
            end_time:row.data.team_end_date,
            team_id:row.data.team_id,
            skey:key,
            type:type_name,
            gu_type_status:'空闲'
        },true);
        gudie_plan_store.currentPage=1;
        gudie_plan_store.load()
    };


    function gudie_plan(v){
        var type_name;
        if(v=='u_realname_id' || v=='u_realname_id2'){
            var name=Ext.getCmp('team_guide_bus').getValue();
            if(name=='已出票'){
                Ext.Msg.alert('友情提示', '请先退全陪导游大交通票才能更换全陪导游');
                return;
            }
            type_name='全陪导游';
        }else if(v=='u_realname_local' || v=='u_realname_local2'){
            type_name='地陪导游';
        }else if(v=='team_driver_name_id' || v=='team_driver_name_id2'){
            type_name='司机';
        }else{
            type_name='车辆';
        }
        gudie_plan_win.show();
        Ext.getCmp('one_kxian').enable();
        gudie_plan_win.setTitle("选择"+type_name, v.iconCls);
        gudie_store_load(type_name)
    };

    Ext.getCmp('u_realname_id').on('focus',function(a){ gudie_plan(a.id) });
    Ext.getCmp('u_realname_local').on('focus',function(a){ gudie_plan(a.id) });
    Ext.getCmp('team_driver_name_id').on('focus',function(a){ gudie_plan(a.id) });
    Ext.getCmp('team_bus').on('focus',function(a,b,c){ gudie_plan(a.id) });
    Ext.getCmp('u_realname_id2').on('click',function(a,b,c){ gudie_plan(a.id) });
    Ext.getCmp('u_realname_local2').on('click',function(a){ gudie_plan(a.id) });
    Ext.getCmp('team_driver_name_id2').on('click',function(a){ gudie_plan(a.id) });
    Ext.getCmp('team_bus2').on('click',function(a,b,c){ gudie_plan(a.id) });


    //编辑票务
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "u_id"]
    });


    var gudie_bus_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });


    function _date_mod(v){
        if(v)return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
    };


    var gudie_bus_cm=[
        new Ext.grid.RowNumberer({width:30}),
        {header:"ob_id", dataIndex:"ob_id", width:10,hidden:true},
        {header:"start_num", dataIndex:"start_num", width:10,hidden:true},
        {header:"end_num", dataIndex:"end_num", width:10,hidden:true},
        {header:"到达日期", dataIndex:"ob_end_date", width:100,hidden:true,renderer:_date_mod},
        {header:"铺位信息", dataIndex:"ob_berth_type", width:100,hidden:true},
        {header:"出发站编码", dataIndex:"ob_start_site_num", width:100,hidden:true},
        {header:"目的地编码", dataIndex:"ob_end_site_num", width:100,hidden:true},
        {header:"出发日期", dataIndex:"ob_start_date", width:130,renderer:_date_mod},
        {header:"类型", dataIndex:"ob_goto_type", width:100},
        {header:"班次编号", dataIndex:"ob_bus_number", width:100},
        {header:"出发时间", dataIndex:"ob_start_time", width:80},
        {header:"抵达时间", dataIndex:"ob_end_time", width:80},
        {header:"始发站", dataIndex:"ob_start_site", width:100},
        {header:"目的地", dataIndex:"ob_end_site", width:100},
        {header:"出票状态", dataIndex:"ob_status", width:100}
    ];


    var gudie_bus_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-right:1px #3892D3 solid',
        store:gudie_bus_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有票务信息',
            deferEmptyText:true
        },
        columns:gudie_bus_cm,
        tbar : [
            '<b>全陪大交通信息操作</b>',
            '->',
            {text:'添加大交通',f_type:'add',iconCls:'button-add',handler:order_modify},
            '-',
            {text:'编辑大交通',f_type:'edit',iconCls:'button-edit',handler:order_modify},
            '-',
            {text:'删除大交通',f_type:'del',iconCls:'button-del',handler:order_del}
        ]
    });


    function order_del(){
        var row_g=SUNLINE.getSelected(gudie_bus_grid);
        var team_id_val=Ext.getCmp('team_id_new').getValue();
        if(row_g==null){
            Ext.Msg.alert('提示信息','请选择您要操作的票务');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','您确认要删除？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url : $__app__ + '/TeamPlanTpl/order_del',
                    method:'POST',
                    params : {team_id:team_id_val,ob_id:row_g.data.ob_id},
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            one_guide_store();
                        };
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    };


    var ob_start_time_text=new Ext.form.TextField({id:"ob_start_time",labelAlign:'right',labelWidth:80,width:390,name:"ob_start_time",fieldLabel:'出发时间',allowBlank:true});
    ob_start_time_text.focus();
    ob_start_time_text.regex=/^(((1|0?)[0-9]|2[0-3])：([0-5][0-9]))|(((1|0?)[0-9]|2[0-3]):([0-5][0-9]))$/;
    ob_start_time_text.regexText ='正确认格式:(10:30)';
    var ob_end_time_text=new Ext.form.TextField({id:"ob_end_time",labelAlign:'right',labelWidth:80,width:390,name:"ob_end_time",fieldLabel:'到达时间',allowBlank:true});
    ob_end_time_text.focus();
    ob_end_time_text.regex=/^(((1|0?)[0-9]|2[0-3])：([0-5][0-9]))|(((1|0?)[0-9]|2[0-3]):([0-5][0-9]))$/;
    ob_end_time_text.regexText ='正确认格式:(12:30)';
    var f_traffic_name_combo=SUNLINE.DictComBox_false({labelWidth:80,labelAlign:"right",fieldLabel:"交通类型",name:'ob_type',allowBlank:false,id:'ob_type'},{'d_type':'交通类型'});
    var f_ticket_type_combo=SUNLINE.DictComBox_false({labelWidth:80,labelAlign:"right",fieldLabel:"铺位",id:'ob_berth_type',name:'ob_berth_type',allowBlank:false},{'d_type':'火车铺位'});
    var f_traffic_start_OrgCombo=SUNLINE.OrgCombo_Sation({fieldLabel:"出发口岸",listConfig:{minWidth:340},id:'ob_start_site',name:'ob_start_site',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var f_traffic_end_OrgCombo=SUNLINE.OrgCombo_Sation({fieldLabel:"目的地口岸",listConfig:{minWidth:340},id:'ob_end_site',name:'ob_end_site',allowBlank:false,listWidth:250,editable:true,forceSelection:true});
    var traffic_form=new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol1',
                defaults:{xtype:'textfield',labelWidth:80,width:390,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"ob_id",id:'ob_id', fieldLabel:"ob_id", maxLength:"100",hidden:true},
                    {name:"ob_status",id:'ob_status', fieldLabel:"ob_status", maxLength:"100",hidden:true},
                    {name:"ob_site_sid",id:'ob_site_sid', fieldLabel:"ob_site_sid", maxLength:"100",hidden:true},
                    {name:"ob_city_start",id:'ob_city_start', fieldLabel:"start_num", maxLength:"100",hidden:true},
                    {name:"ob_site_eid",id:'ob_site_eid', fieldLabel:"ob_site_eid", maxLength:"100",hidden:true},
                    {name:"ob_city_end",id:'ob_city_end', fieldLabel:"ob_city_end", maxLength:"100",hidden:true},
                    {
                        xtype:"combo",
                        id:"ob_goto_type",
                        name:"ob_goto_type",
                        fieldLabel:"往返类型",
                        allowBlank:false,
                        labelAlign:"right",
                        store:new Ext.data.SimpleStore({fields:['ob_goto_type'], data:[
                            ['去程'],['返程']
                        ]}),
                        triggerAction:"all",
                        editable:false,
                        valueField:"ob_goto_type",
                        displayField:"ob_goto_type",
                        mode:"local",
                        value:'去程'
                    },
                    {id:'ob_bus_number_new',name:"ob_bus_number", fieldLabel:"班次编号", maxLength:"20", allowBlank:false},
                    f_traffic_name_combo.box,
                    f_ticket_type_combo.box,
                    f_traffic_start_OrgCombo.box,
                    f_traffic_end_OrgCombo.box,
                    SUNLINE.ExtDateField({id:'ob_start_date',name:'ob_start_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"出发日期",width:390,gang:'ob_end_date',start:true}),
                    ob_start_time_text,
                    SUNLINE.ExtDateField({id:'ob_end_date',name:'ob_end_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"抵达日期",width:390,gang:'ob_start_date'}),
                    ob_end_time_text
                ]
            }
        ]
    });


    f_traffic_start_OrgCombo.box.on({'select':function(c,r,n){
        Ext.getCmp('ob_site_sid').setValue(r[0].get('sd_id'));
        Ext.getCmp('ob_city_start').setValue(r[0].get('sd_city'));
    }});


    f_traffic_end_OrgCombo.box.on({'select':function(c,r,n){
        Ext.getCmp('ob_site_eid').setValue(r[0].get('sd_id'));
        Ext.getCmp('ob_city_end').setValue(r[0].get('sd_city'));
    }});



    f_traffic_name_combo.box.on('select',function(c,r,n){
        var key;
        if(r[0].get('d_text')=='动车'){
            key='高铁座位';
        }else{
            key=r[0].get('d_text')+'座位';
        };
        var store=f_ticket_type_combo.box.getStore();
        var start_store=f_traffic_start_OrgCombo.box.getStore();
        var end_store=f_traffic_end_OrgCombo.box.getStore();
        if(r[0].get('d_text')=='飞机'){
            SUNLINE.baseParams(start_store,{sd_start_type:'飞机'});
            SUNLINE.baseParams(end_store,{sd_start_type:'飞机'});
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        }else{
            if(r[0].get('d_text')=='高铁'){
                SUNLINE.baseParams(start_store,{sd_start_type:'高铁'});
                SUNLINE.baseParams(end_store,{sd_start_type:'高铁'});
            }else if(r[0].get('d_text')=='动车'){
                SUNLINE.baseParams(start_store,{sd_start_type:'动车'});
                SUNLINE.baseParams(end_store,{sd_start_type:'动车'});
            }else{
                SUNLINE.baseParams(start_store,{sd_start_type:'火车'});
                SUNLINE.baseParams(end_store,{sd_start_type:'火车'});
            };
            start_store.currentPage=1;
            start_store.load();
            end_store.currentPage=1;
            end_store.load();
        };
        SUNLINE.baseParams(store,{'d_type':key});
        store.load();
    });


    var traffic_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:traffic_form,
        buttons:[
            {text:'确认出票',shibie:"chupiao", handler:traffic_dosave},
            {text:'保存草稿',shibie:"caogao", handler:traffic_dosave},
            {text:'关闭', handler:function () {
                traffic_win.hide();
            },style:'margin-right:15px;'}
        ]
    });



    traffic_win.on('hide',function(){
        traffic_form.reset();
    });



    function traffic_dosave(v){
        if(!traffic_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请填写红色边框的区域。');
            return;
        }
        var data=traffic_form.getForm().getValues();
        var team_id_val=Ext.getCmp('team_id_new').getValue();
        var card_val=Ext.getCmp('order_card').getValue();
        var u_id=Ext.getCmp('u_id').getValue();
        if(v.shibie=='chupiao'){
            data['ob_status']='已出票'
        }else{
            var row=SUNLINE.getSelected(gudie_bus_grid);
            if(data['ob_status']=='已出票'){
                Ext.Msg.alert('友情提示', '已出票的票务不能在修改了。');
                return;
            };
            data['ob_status']='未出票'
        };
        data['team_id']=team_id_val;
        data['team_id']=team_id_val;
        data['vip_card']=card_val;
        data['u_id']=u_id;
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlanTpl/order_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    traffic_win.hide();
                    gudie_bus_store.removeAll();
                    one_guide_store();
                    Ext.Msg.alert('友情提示',info.msg);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        });
    };



    traffic_win.on('show',function(){
        f_traffic_name_combo.box.getStore().load();
        var row_g=SUNLINE.getSelected(gudie_bus_grid);
        if(row_g){
            var key;
            if(row_g.data.ob_type=='动车'){
                key='高铁座位';
            }else{
                key=row_g.data.ob_type+'座位';
            };
            SUNLINE.baseParams(f_ticket_type_combo.box.getStore(),{d_type:key});
            f_ticket_type_combo.box.getStore().load();
        };
        f_traffic_start_OrgCombo.box.getStore().load();
        f_traffic_end_OrgCombo.box.getStore().load();
    });


    function order_modify(v){
        var card=Ext.getCmp('order_card').getValue();
        if(!card){
            Ext.Msg.alert('提示信息','请先填写身份证号');
            return false;
        };
        if(!gudie_bus_from.form.isValid()){
            Ext.Msg.alert('友情提示', '请填写红色边框的区域。');
            return;
        };
        var row=SUNLINE.getSelected(_grid);
        if(v.f_type=='add'){
            traffic_win.show();
            traffic_form.form.setValues({
                ob_start_date:row.data.team_start_date,
                ob_end_date:row.data.team_end_date
            });
        }else if(v.f_type=='edit'){
            var row_g=SUNLINE.getSelected(gudie_bus_grid);
            if(row_g==null){
                Ext.Msg.alert('提示信息','请选择您要操作的票务');
                return false;
            };
            row_g=row_g.data;
            traffic_win.show();
            traffic_form.form.setValues(row_g);
            var start_date=_date_mod(row_g.ob_start_date);
            var end_date=_date_mod(row_g.ob_end_date);
            Ext.getCmp('ob_start_date').setRawValue(start_date);
            Ext.getCmp('ob_end_date').setRawValue(start_date);
        };
    };


    var gudie_bus_from = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle: 'padding:0px 30px 0px 10px;',
        width:880,
        autoScroll : true,
        items : [
            {
                columnWidth :1,
                style:'margin-top:5px;',
                items : [
                    {
                        style:'margin-right:15px;margin-top:5px;',
                        items : [
                            {
                                title : '全陪导游信息',
                                xtype : 'fieldset',
                                defaultType: 'textfield',
                                autoHeight:true,
                                cls:'tcol2',
                                defaults:{xtype:'textfield',labelWidth:70,labelAlign:"right", style: 'width:49%;'},
                                items :[
                                    {id:'u_id',name:'u_id',xtype :'hidden'},
                                    {fieldLabel: '姓名',name: 'order_name',id:'order_name',allowBlank:false,readOnly:true},
                                    {fieldLabel: '证件号',name: 'order_card',id:'order_card',allowBlank:false}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                columnWidth : 1,
                items : [gudie_bus_grid],
                autoHeight:true
            }
        ]
    });


    var gudie_bus_win=new Ext.Window({
        width:875,
        height:450,
        closeAction:'hide',
        modal:true,
        items:gudie_bus_from,
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        maximizable : true,//全屏效果
        buttons : [
            {text:'关闭',handler:function(){ gudie_bus_win.hide()}}
        ]
    });


    gudie_bus_win.on('hide',function(){
        gudie_bus_store.each(function(v){
            var row= v.data;
            if(row.ob_status=='已出票'){
                Ext.getCmp('quan_orderbus').setText('已出票')
                Ext.getCmp('team_guide_bus').setValue('已出票')
            }
        });
    });


    gudie_bus_win.on('hide',function(){
        gudie_bus_store.removeAll();
        gudie_bus_from.reset();
    });


    function qu_time(v){
        return v.substr(0,4)+v.substr(5,2)+v.substr(8,2);
    };


    function gudie_bus_dosave(){ };



    function one_guide_store(){
        var idd=Ext.getCmp('team_guide_oid').getValue();
        var team_id_val=Ext.getCmp('team_id_new').getValue();
        var row=SUNLINE.getSelected(_grid);
        gudie_bus_win.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlanTpl/find_one_gudie',
            params:{u_id:idd,team_id:team_id_val},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                if (ret.status){
                    if(info.msg.u_realname) Ext.getCmp('order_name').setValue(info.msg.u_realname);
                    if(info.msg.u_card) Ext.getCmp('order_card').setValue(info.msg.u_card);
                    if(info.msg.u_id) Ext.getCmp('u_id').setValue(info.msg.u_id);
                    if(info.info=='未安排'){
                        add_giude_bus('去程')
                        add_giude_bus('返程')
                    }else{
                        gudie_bus_store.loadData(info.info);
                        var ii={};
                        Ext.each( info.info,function(v,i){
                            ii[v.ob_goto_type]='1';
                        });
                        if(!ii['去程']){
                            add_giude_bus('去程')
                        }
                        if(!ii['返程']){
                            add_giude_bus('返程')
                        }
                    }
                }
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        });
    };


    function add_giude_bus(type){
        var row=SUNLINE.getSelected(_grid);
        var s_time;
        if(type=='去程'){
            s_time =qu_time(row.data.team_start_date);
        }else{
            var end_Data=Ext.getCmp('team_end_date').getValue();
            s_time =qu_time(end_Data);
        };
        gudie_bus_store.add({
            ob_start_date:s_time,
            ob_end_date:s_time,
            ob_goto_type:type,
            ob_status:'未出票'
        });
    };


    Ext.getCmp('quan_orderbus').on('click',function(a){
        var idd=Ext.getCmp('team_guide_oid').getValue();
        if(!idd || idd==0){
            Ext.Msg.alert('提示信息','请先选择全陪导游');
            return false;
        };
        one_guide_store();
    });


    var editor_win= new Ext.Window({
        width:Ext.getBody().getWidth()-50,
        height:Ext.getBody().getHeight()-50,
        closeAction:'hide',
        modal:true,
        items:editor_from,
        mixWidth:500,
        mixHeight:350,
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        maximizable : true,//全屏效果
        buttons : [
            {xtype:'tbtext',id:'j_tip'},
            {text:'生成计划单',handler:create_plan_list},
            {text:'保存草稿', handler:create_plan_list,tooltip:'只保存您做的修改信息，不会生成计划单。' },
            {text:'关闭',handler:function(){ editor_win.hide()}}
        ]
    });



    editor_win.on('hide',function(){
        editor_from.reset();
    });



    //保存草稿
    //生成计划单
    function create_plan_list(v){
        var data= editor_from.getForm().getValues();
        var row=SUNLINE.getSelected(_grid);
        if(v.text=='生成计划单'){
            if(isDisabled('TeamPlanTpl::tpl_diao')==true){
                Ext.Msg.alert('提示信息','您没有权限生成计划单，只能保存草稿');
                return false;
            }
        }
        var type_id_val= WG.pro_team_type //团队类型
        if(row.data.team_start_date.indexOf("-")>0){         //开始时间
            row.data.team_start_date=row.data.team_start_date.substr(0,4) + '-' + row.data.team_start_date.substr(5,2) + '-' + row.data.team_start_date.substr(8,2) ;
        }
        if(data['team_print_contacts']!=1)data['team_print_contacts']=2;
        if(data['team_print_detail']!=1)data['team_print_detail']=2;
        if(row.data.team_id)data['team_id']=row.data.team_id;
        data['team_bl_id']=row.data.team_bl_id;
        data['team_p_id']=row.data.team_p_id;
        data['team_start_time']=row.data.team_start_time;
        data['team_saled']=row.data.team_saled;  //已售人数
        if(data['team_lock']!=1){
            data['team_lock']='all';
        }else{
            data['team_lock']=1;
        }
        data['team_bus_num']=row.data.team_bus_num;
        data['team_type']=type_id_val;    //团队类型
        data['team_start_date']=row.data.team_start_date;
        data['team_p_days']=row.data.team_p_days;
        var north_data=[];
        var sign={};
        var sign_i=0
        for(var i=0;i<items_cost_store.count();i++){
            var At_store=items_cost_store.getAt(i);
            if(At_store.data['ti_insti_type']=='签单'){
                sign[sign_i]=At_store.data['ti_sign'];
                sign_i++;
            }
            switch(At_store.data['ti_type_new']){
                case '导游':
                    At_store.data['si_subject']='team_fee_guide';
                    break;
                case '餐饮':
                    At_store.data['si_subject']='team_fee_meal';
                    break;
                case '住宿':
                    At_store.data['si_subject']='team_fee_hotel';
                    break;
                case '景区':
                    At_store.data['si_subject']='team_fee_scenic';
                    break;
                case '购物店':
                    At_store.data['si_subject']='team_fee_store';
                    break;
                case '车辆':
                    At_store.data['si_subject']='team_fee_car';
                    break;
                case '大交通':
                    At_store.data['si_subject']='team_fee_traffic';
                    break;
                case '小交通':
                    At_store.data['si_subject']='team_fee_traffic_s';
                    break;
                case '保险':
                    At_store.data['si_subject']='team_fee_insurance';
                    break;
                case '地接':
                    At_store.data['si_subject']='team_fee_agency';
                    break;
                case '其他':
                    At_store.data['si_subject']='team_fee_other';
                    break;
                default :
                    At_store.data['si_subject']='team_fee_other';
                    break;
            }
            north_data.push(At_store.data);
        }
        north_data=Ext.encode(north_data);
        sign=Ext.encode(sign);   //计划单
        data['team_items']=north_data;
        data['ti_sign']=sign;

        if(v.text=='生成计划单'){
            data['team_si_status']='生成计划单'
            team_save_mod(data);
        }else{
            if(row.data.team_si_status=='生成计划单'){
                Ext.Msg.alert('友情提示','已经生成计划单，您不能在保存草稿了');
            }else{
                data['team_si_status']='安排中';
                team_save_mod(data);
            }
        }
    };



    function team_save_mod(data){
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlan/team_save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                myMask.hide();
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    clog('[team_save_mod] TeamPlan/team_save success.');
                    _store.reload();
                    editor_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    };



    function time_qu(v){
        return v.substr(0,4)+v.substr(5,2)+v.substr(8,2);
    };


    editor_win.on('hide',function(){
        clog('editor_win hide.');
        _store.reload();
        room_store.removeAll();
        room_day_store.removeAll();
        room_plan_store.removeAll();
    });



    function date_mod(){
        var row=SUNLINE.getSelected(_grid);
        var data={}
        data['team_print_contacts']=2;
        data['team_print_detail']=2;
        data['team_bl_id']=row.data.team_bl_id;
        data['team_p_id']=row.data.team_p_id;
        data['team_start_time']=row.data.team_start_time;
        data['team_saled']=row.data.team_saled;  //已售人数
        data['team_bus_num']=row.data.team_bus_num;
        data['team_type']=WG.pro_team_type //团队类型
        var type_id_val=WG.pro_team_type;
        if(type_id_val=='products'){
            type_id_val='散客团';
        }else{
            type_id_val='独立成团';
        }
        data['team_start_date']=row.data.team_start_date;
        data['team_p_days']=row.data.team_p_days;
        data['team_num']=row.data.team_num;
        data['pro_team_type']=type_id_val //团队类型
        data['team_type']=type_id_val //团队类型
        if(data['team_lock']!=1){
            data['team_lock']='all';
        }else{
            data['team_lock']=1;
        }
        return data;
    };



    function editor_modify(v){
        var row=SUNLINE.getSelected(_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        var t_start_time_v=time_qu(row.data.team_start_date);
        _team_items_grid.ticket_date = {start_date:t_start_time_v,end_date:t_start_time_v};
        editor_win.show();
        /*if(row.data.team_id == 0){
            var data=date_mod();
            Ext.Ajax.request({
                url:$__app__ + '/TeamPlan/ticket_items_list_add',
                params:data,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    var arr=info.msg;
                    var id=info.info;
                    var end_date=info.time;
                    Ext.getCmp('team_id_new').setValue(id)
                    Ext.getCmp('team_end_date').setValue(end_date)
                    for(var i in arr){
                        if(arr[i]['ti_type_new']){
                            items_cost_store.add(arr[i])
                        }
                    }
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }else{
            Ext.Ajax.request({
                url:$__app__ + '/TeamPlan/team_items_lock',
                params:row.data,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    var arr=info.msg.team_items;
                    Ext.getCmp('team_remark_id').setValue(info.msg.team_remark);
                    Ext.getCmp('team_tpl_title').setValue(info.msg.team_tpl_title);
                    Ext.getCmp('team_tpl_detail').setValue(info.msg.team_tpl_detail);
                    for(var i in arr){
                        if(arr[i]['ti_type_new']){
                            items_cost_store.add(arr[i])
                        }
                    }
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }*/
        editor_from.getForm().setValues(row.data);
        if(row.data.team_guide_bus=='已出票'){
            Ext.getCmp('quan_orderbus').setText('已出票');
        }
        editor_win.setTitle('['+row.data.team_bl_num+']'+row.data.team_p_name+' '+row.data.team_bus_num+'号车', v.iconCls);
    };



    editor_win.on('hide',function(){
        items_cost_store.removeAll();
        WG.hotel_type=''
        hotel_plan_num=1;
    });



    function sch_modify(){
        search_mod();
    };




    function dosearch(){
         var search_val=Ext.getCmp('search').getValue();
         SUNLINE.baseParams(pro_store,{skey:search_val,type:WG.pro_team_type});
         pro_store.currentPage=1;
         pro_store.load();
        _store.removeAll();
    };


    Ext.getCmp('bl_status').on('select',function(c,r,n){
        clog('bl_status select.')
        search_mod();
    });


    Ext.getCmp('p_days').on('change',function(c,r,n){
        clog('p_days change.')
        search_mod();
    });


    function search_mod(){
        var p_days_val=Ext.getCmp('p_days').getValue();
        var ob_start_date_val=Ext.getCmp('ob_start_date_id').getRawValue();
        var bl_status_val=Ext.getCmp('bl_status').getValue();
        var bl_sale_fld_val=Ext.getCmp('bl_sale_fld_id').getValue();
        bl_sale_fld_val = bl_sale_fld_val ? 1 : 'all';
        var row_p=SUNLINE.getSelected(pro_grid);
        if(row_p)var p_id=row_p.data.p_id;
        SUNLINE.baseParams(_store,{
            team_p_id:p_id,
            type:WG.pro_team_type,
            bl_saled:bl_sale_fld_val,
            p_days:p_days_val,
            start_date:ob_start_date_val,
            bl_status:bl_status_val
        },true);
        _store.currentPage=1;
        clog('[search_mod]');
        _store.load();
    };


    //查看游客
    var _print_win = new Ext.Window({
        title : '打印',
        modal : true,
        maximizable : true,//全屏效果
        closeAction : 'hide',
        html : '<iframe src="" id="_print_frm" name="_print_frm" frameborder="0" width="100%" height="100%"></iframe>',
        buttons:[
            {text:'打印',id:'sunline_print',handler:doprint},
            {text:'关闭', handler:function(){_print_win.hide();}}
        ]
    });


    function _print(b){
        var _row=SUNLINE.getSelected(_grid);
        if(_row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的出团计划单');
            return false;
        }
        var _w = 850, _h = Ext.getBody().getHeight();
        _print_win.setWidth(_w);
        _print_win.setHeight(_h-50);
        if(b.text== '游客信息表'){
            if(!_row.data.team_id){
             Ext.Msg.alert('提示信息','请先出填写团计划单的详细信息');
             return false;
             }
        }
        var contacts,detail,url;
        switch (b.text){
            case '游客信息表':
                contacts = Ext.getCmp('team_print_contacts').getValue() == true ? 1 : 2;
                detail = Ext.getCmp('team_print_detail').getValue() == true ? 1 : 2;
                url = $__app__ + '/TeamPlanTpl/output/team_id/' + _row.data.team_id + '/contacts/' + contacts+'/type/'+WG.pro_team_type+'/detail/'+detail;
                break;
            case '导游计划单':
                url = $__app__ + '/TeamPlanTpl/output/team_id/'+_row.data.team_id+'/flag/yes';
                break;
            case '查看游客':
                contacts = Ext.getCmp('team_print_contacts').getValue() == true ? 1 : 2;
                detail = Ext.getCmp('team_print_detail').getValue() == true ? 1 : 2;
                url = $__app__ + '/TeamPlanTpl/guest_info/team_id/' + _row.data.team_id + '/contacts/' + contacts+'/type/'+WG.pro_team_type+'/detail/'+detail;
                break;
            case '查看火车':
                url = $__app__ + '/TeamPlanTpl/trf_plan/team_id/'+_row.data.team_id;
                break;
            case '查看飞机':
                url = $__app__ + '/TeamPlanTpl/air_plan/team_id/'+_row.data.team_id;
                break;
        }
        _print_win.setTitle('查看['+_row.data.team_bl_num+']'+_row.data.team_p_name+' '+_row.data.team_bus_num+'号车', b.iconCls);
        _print_win.setSize( _w, _h - 50 );
        _print_win.show();
        window._print_frm.location = url;
    }
    //酒店订房
    var room_url = $__app__ + '/TeamPlanTpl/kbai';
    var room_field = [
        'hp_date2',
        'hp_date',
        'hp_name',
        'hp_room_num',
        'hp_room_price',
        'hp_maids_num',
        'hp_maids_price',
        'hp_money',
        'hp_caozuo'
    ];
    var room_store = new SUNLINE.JsonStore(room_url, room_field,false);
    var room_day_store = new SUNLINE.JsonStore(room_url, room_field,false);
    var room_plan_store = new SUNLINE.JsonStore(room_url, room_field,false);
    room_plan_store.sort('hp_date2', 'ADS');
    function price_bed(v){
        if(v)return ' ￥ '+v;
    }
    function price_bedd(v){
        if(v)return '<span style="color:#008000"> ￥ '+v+'</span>';

    }
    var room_price= new Ext.grid.GridPanel({
        width:400,
        height:140,
        minHeight:10,
        region:'north',
        border:false,
        style : 'border-bottom:3px solid #3993D3;',
        resizable:false,
        closeAction:'hide',
        store:room_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'酒店价格信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ti_name_id", dataIndex:"ti_name_id", width:10,hidden:true},
            {header:"酒店名称", dataIndex:"ti_insti_name", width:150},
            {header:"房间类型", dataIndex:"ti_cs_type_name", width:150},
            {header:"单价· 间", dataIndex:"ti_trade_price", width:100,align:'right',renderer:price_bed},
            {header:"单价· 床", dataIndex:"ti_trade_price_ban", width:100,align:'right',renderer:function status_msg(v,m,r){
                return ' ￥ '+r.get('ti_trade_price')/2;
            }}
        ],
        tbar:[
            '<b>报价参考酒店:</b>'
        ]
    });
    function room_bed(v){
        if(v)return v
    }
    function jian_bed(v){
        if(v!=0)return v
    }
    var room_day= new Ext.grid.GridPanel({
        width:800,
        region:'center',
        border:false,
        minHeight:200,
        style : 'border-bottom:3px solid #3993D3;',
        resizable:false,
        closeAction:'hide',
        store:room_day_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'酒店价格信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"订单编号", dataIndex:"o_number", width:150},
            {header:"游客人数", dataIndex:"num", width:90,align:'right'},
            {header:"房数/每天",dataIndex:"room_num", width:100,align:'right',renderer:room_bed},
            {header:"退补床数", dataIndex:"poor_num", width:100,align:'right',renderer:jian_bed},
            {header:"退补金额", dataIndex:"ti_trade_price_all", width:100,align:'right',renderer:function status_msg(v,m,r){
                var price;
                if(r.get('room_poor')=='true'){
                    if(r.get('poor_num')>0){
                        price=r.get('poor_num')*r.get('t_spread_price');
                    }else{
                        price=(-r.get('poor_num'))*r.get('t_out_room_price');
                    }
                }
                if(price)return ' ￥ '+price;

            }},
            {header:"票价类型",dataIndex:"t_preset_type", width:100},
            {header:"补房差参考价",dataIndex:"t_spread_price", align:'right',width:120,align:'right',renderer:price_bed},
            {header:"退房差参考价",dataIndex:"t_out_room_price",align:'right', width:120,align:'right',renderer:price_bed}
        ],
        tbar:[
            '<b>报名信息分析 : （每天用量）</b>',
            {
                xtype:'tbtext',
                id:'hp_total',
                style:'font-weight:bold;color:blue',
                text:''
            }
        ]
    });
    //搜索酒店名称
    var hp_name_box=SUNLINE.ComBoxPlus({
        id:'insti_name_hp',
        fields:['id','text'],url:$__app__ + '/Team/items_data',
        where:{type:'住宿'},
        config:{
            id:'insti_name_hpp',
            name:'hp_name',
            width:330,
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            fieldLabel:"酒店名称",
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            editable:true,
            forceSelection:false,
            pageSize:20
        }
    });
    var hp_name_room_box=cs_type_name_box=SUNLINE.ComBoxPlus({
        id:'cs_type_name_hp',
        fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
        config:{
            id:'cs_type_name_hpp',
            name:'hp_name_room',
            width:330,
            labelWidth:80,
            labelAlign:"right",
            style:'margin-top:5px;',
            fieldLabel:"酒店房型",
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        }
    });

    hp_name_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(room_plan);
            var r= r[0];
            Ext.getCmp('hp_name_room_id').setValue( r.get('id'));
            Ext.getCmp('cs_type_name_hpp').setValue('');
            if(r.get('rc_name')){
                Ext.getCmp('form_man').setValue( r.get('rc_name'));
            }else{
                Ext.getCmp('form_man').setValue('');
            }
            if(r.get('rc_tel')){
                Ext.getCmp('form_man_tel').setValue(r.get('rc_tel'));
            }else{
                Ext.getCmp('form_man_tel').setValue('');
            }
        }
    });
    //加载资源项目信息
    hp_name_room_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(_grid);
            var cs_type_name_box_store=cs_type_name_box.store;
            var hp_date=time_hp(row.get('team_start_date'));
            var room_id=Ext.getCmp('hp_name_room_id').getValue();
            SUNLINE.baseParams(cs_type_name_box_store,{type:'住宿',at_id:room_id,start_date:hp_date,end_date:hp_date});
            cs_type_name_box_store.load();
        }
    });
    hp_name_room_box.on({
        select:function( c, r, e ){
            var r= r[0];
           // var ti_num=r.get('hp_room_num');
            var price= parseFloat(r.get('price'));
            Ext.getCmp('form_trade_price').setValue(price.toFixed(2));
            Ext.getCmp('form_insti_type').setValue(r.get('pay_type'));
        }
    });

    var room_plan= new Ext.grid.GridPanel({
        Width:800,
        region:'south',
        border:false,
        style : 'border-top:2px solid #3993D3;',
        height:300,
        minHeight:100,
        maxHeight:1000,
        resizable:true,
        closeAction:'hide',
        store:room_plan_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'酒店价格信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"入住日期", dataIndex:"hp_date", width:100,sortable:true},
            {header:"日期排序", dataIndex:"hp_date2",width:150, hidden:true},
            {header:"hp_team_id", dataIndex:"hp_team_id",width:150, hidden:true},
            {header:"酒店名称", dataIndex:"hp_name", width:150},
            {header:"酒店房型", dataIndex:"hp_name_room", width:150},
            {header:"酒店房型", dataIndex:"hp_name_room_id", width:150,hidden:true},
            {header:"用房/间", dataIndex:"hp_room_num", width:100,align:'right',sortable:true},
            {header:"单价/间", dataIndex:"hp_room_price", width:100,align:'right',renderer:price_bed,sortable:true},
            {header:"总金额", dataIndex:"hp_money", width:100,align:'right',renderer:price_bedd},
            {header:"当天酒店房型总房数/总房数", dataIndex:"hp_all_room", width:210,align:'right', hidden:true},
            {header:"结算方式", dataIndex:"hp_insti_type", width:80},
            {header:"联系人", dataIndex:"hp_man", width:80},
            {header:"联系方式", dataIndex:"hp_man_tel", width:100},
            {header:"备注", dataIndex:"hp_remark", width:150,renderer:function(v){
                if(!v)return '';
                return '<font title="'+v+'" color="blue">'+v+'</font>';
            }}
        ],
        tbar:[
            '<b>安排酒店 : </b>',
            {text:'添加',iconCls:"button-add",handler:add_modose},
            '-',
            {text:'编辑',iconCls:"button-add",handler:edit_modify},
            '-',
            {text:'订房确认函',iconCls:"button-add",handler:hotel_queren},
            '-',
            {text:'删除',iconCls:"button-del",handler:hotel_del}
        ]
    });


    function add_modose(){
        var row=SUNLINE.getSelected(_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        render_attr_view();
        WG.add_edit='add';
        shop_win.show();
    }

    function edit_modify(){
        var row=SUNLINE.getSelected(room_plan);
        if(row==null){
            Ext.Msg.alert('友情提示', '请选择要编辑的酒店信息');
            return;
        }
        WG.add_edit='edit';
        shop_win.show();
        render_attr_view(row.data.hp_date);
        var index = attr_store.find('d_text',row.data.hp_date);
        attrView.getSelectionModel().select(index, true);
        store_form.form.setValues(row.data);
    }
    /**
     * 将行程日期渲染到dataView中
     * @param date
     */
    function render_attr_view(date){
        if(date){
            date_list=[{d_id:date,d_text:date}];
            attr_store.removeAll();
            attr_store.loadData(date_list);
        }else{
            var row=SUNLINE.getSelected(_grid);
            var date_list = [];
            var sd = new Date(row.get('team_start_date')).getTime();
            var _days = row.get('team_p_days'); //5
            for (var _d=0; _d<Number(_days); _d++){ //0-4
                var _td = new Date(sd+Number(_d)*86400000);
                _td=Ext.Date.format(_td,'Y-m-d');
                var tmp_d = {d_id:_td, d_text:_td};
                date_list.push(tmp_d);
            }
            attr_store.removeAll();
            attr_store.loadData(date_list);
        }
    }

    //加载资源信息
    /*hp_name_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(room_plan);
            var hp_name_box_store=hp_name_box.store;
            SUNLINE.baseParams(hp_name_box_store,{type:'住宿'});
            hp_name_box_store.load();

        }
    });
    hp_name_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(room_plan);
            var r= r[0];
            row.set('hp_name_room_id', r.get('id'));
            row.set('hp_name_room', '');
            if(r.get('rc_name')){
                row.set('hp_man',r.get('rc_name'));
            }else{
                row.set('hp_man','');
            }
            if(r.get('rc_mobile')){
                row.set('hp_man_tel',r.get('rc_mobile'));
            }else{
                row.set('hp_man_tel','');
            }
        }
    });
    //加载资源项目信息
    hp_name_room_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(room_plan);
            var cs_type_name_box_store=cs_type_name_box.store;
            var hp_date=time_hp(row.get('hp_date'));
            SUNLINE.baseParams(cs_type_name_box_store,{type:'住宿',at_id:row.get('hp_name_room_id'),start_date:hp_date,end_date:hp_date});
            cs_type_name_box_store.load();
        }
    });
    hp_name_room_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(room_plan);
            var r= r[0];
            var ti_num=row.get('hp_room_num');
            var price= parseFloat(r.get('price'));
            row.set('hp_room_price', price.toFixed(2));
            row.set('hp_money',parseFloat(price*ti_num).toFixed(2));
            row.set('hp_insti_type',r.get('pay_type'));
        },
        focus:function( c, r, i, e ){
            var row=SUNLINE.getSelected(room_plan);
            var cs_type_name_box_store=cs_type_name_box.store;
            var hp_date=time_hp(row.get('hp_date'));
            SUNLINE.baseParams(cs_type_name_box_store,{type:'住宿',at_id:row.get('hp_name_room_id'),start_date:hp_date,end_date:hp_date});
            cs_type_name_box_store.load();
        }
    });*/
    function time_hp(v){
        return v.substr(0,4)+v.substr(5,2)+v.substr(8,2);
    }
    function hotel_fuzhi(){
        var row=SUNLINE.getSelected(room_plan);
        if(row==null){
            Ext.Msg.alert('友情提示', '请选择要复制的酒店信息');
            return;
        }
        room_plan_store.add({
            hp_date:row.data.hp_date,
            hp_date2:row.data.hp_date2,
            hp_maids_num:row.data.hp_maids_num,
            hp_maids_price:row.data.hp_maids_price,
            hp_money:row.data.hp_money,
            hp_name:row.data.hp_name,
            hp_name_room:row.data.hp_name_room,
            hp_name_room_id:row.data.hp_name_room_id,
            hp_real_room:row.data.hp_real_room,
            hp_room_num:row.data.hp_room_num,
            hp_room_price:row.data.hp_room_price,
            hp_insti_type:row.data.hp_insti_type,
            hp_man:row.data.hp_man,
            hp_man_tel:row.data.hp_man_tel,
            hp_remark:row.data.hp_remark,
            id:(new Date()).valueOf()
        });
    }
    function hotel_queren(b){
        var _row=SUNLINE.getSelected(room_plan);
        if(_row==null){
            Ext.Msg.alert('提示信息','请选择您要确认的酒店');
            return false;
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
        _print_win.setTitle('酒店确认函', b.iconCls);
        _print_win.setSize( _w, _h - 50 );
        _print_win.show();

        var url = $__app__ + '/TeamPlanTpl/hotel_before';
        window._print_frm.location = url;
    }
    window.getItemsArr=function(){
        var items_arr=[];
        room_plan_store.each(function(v){
            var row= v.data;
            items_arr.push(row);
        });
        items_arr=Ext.encode(items_arr);
        return items_arr;
    }
    window.get_hp_id=function(){
        var _row=SUNLINE.getSelected(room_plan);
        return _row.data.hp_name;

    }
    function hotel_add(){
        room_plan_store.add({
            hp_date:'',
            hp_date2:'',
            hp_name:'',
            hp_room_num:'0',
            hp_room_price:'0',
            hp_maids_num:'0',
            hp_maids_price:'0',
            hp_money:'0'
        });
    }
    function hotel_del(){
        var row=SUNLINE.getSelected(room_plan);
        if(row==null){
            Ext.Msg.alert('友情提示', '请选择要删除的酒店信息');
            return;
        }
        room_plan_store.remove(row);
    }
    function hp_date_f(t,nv,ov,o){
        var set_data=[];
        var room={};
        room_plan.store.each(function(v){
            var rw= v.data;
            if((rw.hp_date).length!=10){
                rw.hp_date=Ext.Date.format(rw.hp_date,'Y-m-d');
            }
            v.data.hp_date=rw.hp_date;
            v.data.hp_date2=(rw.hp_date).replace(/-/g,'');
            set_data.push(v);
            var t=rw.hp_date2; //时间
            var name=rw.hp_name_room_id;  // 酒店名称
            var type=rw.hp_name_room;  //   房间数
            var key=t+'-'+name+'-'+type;
            var key_zong=t+'-'+name;
            var num;  //房间数
            if(rw.hp_room_num){
                num=rw.hp_room_num
            }else{
                num=0;
            }
            if(!room[key])room[key]=0;
            if(!room[key_zong])room[key_zong]=0;
            room[key]+=num;
            room[key_zong]+=num;
        });

        room_plan.store.removeAll();
        Ext.each(set_data,function(v,i){
            room_plan.store.add(v);
        });
    }
    var room_win=new Ext.Window({
        title:"酒店报价",
        layout:'border',
        width:Ext.getBody().getWidth()-200,
        height:Ext.getBody().getHeight(),
        closeAction:'hide',
        modal:true,
        items:[ room_price,room_day,room_plan],
        cls : 'suntour_dataView',
        autoScroll : true,
        maximizable : true,//全屏效果
        buttons : [
            {
                xtype:'tbtext',
                id:'hp_money_all2',
                style:'font-weight:bold;color:blue',
                text:''
            },
            '->',
            {text:'保存',handler:room_dosave,id:'hotel_1'},
            '-',
            {text:'关闭',id:'hotel_2',handler:function(){
                room_win.hide();
            }}
        ]
    })
    room_win.on('hide',function(){
        if(WG.hotel_type=='安排酒店'){
            WG.hotel_type='';
            clog('room_win hide.');
            _store.reload();
            room_store.removeAll();
            room_day_store.removeAll();
            room_plan_store.removeAll();
        }
    })
    function hp_all_money(){
        var money=0;
        room_plan_store.each(function(v){
            var row= v.data;
            money=parseFloat(money)+parseFloat(row.hp_money);
        });
        money='<span style="line-height:1px;">总金额为:￥'+parseFloat(money).toFixed(2)+'元,由绿色价格累加得到</span>';
        if(document.getElementById('hp_money_all2')){
            document.getElementById('hp_money_all2').innerHTML=money;
        }

    }
    room_plan_store.on({
        update:function(){
            hp_all_money();
        },
        datachanged:function(){
            hp_all_money();
        }
    });
    function hp_room_price(t,nv,ov,o){
        var row=SUNLINE.getSelected(room_plan);
        var price_h=0;
        price_h=(parseFloat(row.get('hp_room_num'))*parseFloat(nv)).toFixed(2);
        row.set('hp_money',round_format(price_h));
    }
    function hp_room_num(t,nv,ov,o){
        var row=SUNLINE.getSelected(room_plan);
        var price_h=0;
        price_h=(parseFloat(row.get('hp_room_price'))*parseFloat(nv)).toFixed(2);
        row.set('hp_money',round_format(price_h));
        row.set('hp_real_room',nv);
    }
    function room_dosave(){
        if(WG.hotel_type=='安排酒店'){
            var data=[];
            room_plan_store.each(function(v){
                var row= v.data;
                data.push(row);
            })
            var grid_row=SUNLINE.getSelected(_grid);
            var team_id=grid_row.data.team_id;
            data=Ext.encode(data);
            var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/TeamPlanTpl/save_hotel',
                params:{detail:data,team_id:team_id},
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    Ext.Msg.alert('友情提示',info.msg);
                    if (ret.status){
                        WG.hotel_type='';
                        room_win.hide();
                        clog('[room_dosave] /TeamPlanTpl/save_hotel success.');
                        _store.reload();
                        room_store.removeAll();
                        room_day_store.removeAll();
                        room_plan_store.removeAll();
                    };
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }else{
            var row=SUNLINE.getSelected(_grid);
            var now_time=row.data.team_start_date;
            now_time = Date.parse(new Date(now_time));
            var set_data=[];
            var i=0,j=0;
            items_cost_store.each(function(v){
                var rw= v.data;
                if(rw.ti_type_new!='住宿'){
                    set_data.push(rw);
                }
            })
            var i=1;
            room_plan_store.each(function(v){
                i++
                var row= v.data;
                var drr={};
                var ol_t=Date.parse(new Date(row.hp_date));
                drr['ti_day']=(ol_t-now_time)/86400000+1;
                drr['ti_cs_type_name']=row['hp_name_room'];
                drr['ti_insti_name']=row['hp_name'];
                drr['ti_trade_price']=row['hp_room_price'];
                drr['ti_insti_type']=row['hp_insti_type'];
                drr['ti_num']=row['hp_room_num'];
                drr['ti_all_money']=row['hp_money'];
                drr['ti_type_mode']='按人计算';
                drr['ti_remark']=row['hp_remark'];
                drr['ti_type_new']='住宿';
                drr['ti_man']=row['hp_man'];
                drr['ti_man_tel']=row['hp_man_tel'];
                drr['ti_name_id']=row['hp_name_room_id'];
                drr['ti_deal_status']='已处理';
                drr['id']=(new Date()).valueOf()+i;
                set_data.push(drr);
            })
            room_win.hide();
            items_cost_store.removeAll();
            Ext.each(set_data,function(v,i){
                items_cost_store.add(v);
            });
        }
    }

    var timeComob=new Ext.form.ComboBox({
        id:"appoint_time",
        name:"appoint_date",
        fieldLabel:"游玩时间",
        allowBlank:false,
        labelWidth:80,
        labelAlign:'right',
        width:160,
        triggerAction:"all",
        store:new Ext.data.SimpleStore({
            fields:['name','value'],
            data:[['上午','上午'],['下午','下午']]
        }),
        displayField:"name",
        valueField:"value",
        mode:"local",
        forceSelection:true,
        typeAhead:true,
        value:"上午"
    });
    var scenic_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {id:"appoint_team_id", name:"team_id", fieldLabel:"ID",xtype:"hidden"},
            {id:"appoint_team_num", name:"team_num", fieldLabel:"团队编号",readOnly:true},
            SUNLINE.ExtDateField({id:'appoint_date',name:'appoint_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"游玩日期",width:280}),
            timeComob
        ]
    });
    var appoint_win=new Ext.Window({
        title:"故宫预约单生成",
        layout:'fit',
        width:400,
        height:200,
        closeAction:'hide',
        style:'background:#fff',
        modal:true,
        items:[scenic_form],
        autoScroll : true,
        maximizable : true,//全屏效果
        buttons : [
            {
                xtype:'tbtext',
                id:'hp_money_all2',
                style:'font-weight:bold;color:blue',
                text:''
            },
            '->',
            {text:'保存',handler:appoint_dosave},
            '-',
            {text:'关闭',handler:function(){
                appoint_win.hide();
            }}
        ]
    })
    function appoint_dosave(){
        var flag=scenic_form.getForm().isValid();
        if(!flag){
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        }
        var row=SUNLINE.getSelected(_grid);
        row=row.data;
        var url=$__app__+'/TourAppoint/create_plan/team_id/'+row.team_id+'/appoint_date/'+Ext.getCmp('appoint_date').getRawValue()+'/appoint_time/'+Ext.getCmp('appoint_time').getValue();
        window.open(url);
    }
    function create_appoint(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择一个团队！');
            return false;
        }
        if(row.team_id==0){
            Ext.Msg.alert('友情提示', '该团队还未安排不能生成！');
            return false;
        }
        row=row.data;
        Ext.getCmp('appoint_team_num').setValue(row.team_num);
        var data={team_id:row.team_id};
        Ext.Ajax.request({
            url:$__app__ + '/TourAppoint/get_imperial_date',
            params:data,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var date=new Date();
                if(ret.status){
                    date=ret.info;
                }
                Ext.getCmp('appoint_date').setValue(date);
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
        appoint_win.show();
    }

    //导出游客信息
    function load_excel(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择一个团队！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要导出该团队游客表吗?',function(y){
            if(y!='yes')return false;
            row=row.data;
            var url='bl_id/'+row.team_bl_id+'/bus_num/'+row.team_bus_num+'/pid/'+row.team_p_id;
            window.location = $__app__+'/TeamPlanTpl/load_seat_excel/'+url;
        });
    }

    function appoint(){
        var row=SUNLINE.getSelected(_grid);
        if(!row){
            Ext.Msg.alert('友情提示', '请选择一个团队！');
            return false;
        }
        if(row.data.team_id==0){
            Ext.Msg.alert('友情提示', '该团队还未安排不能预约！');
            return false;
        }
        if(row.data.team_appoint_status=='已预约'){
            Ext.Msg.alert('友情提示', '该团队已预约！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','您确定该团队的故宫行程已预约?',function(y){
            if(y=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data={team_id:row.data.team_id};
                Ext.Ajax.request({
                    url:$__app__ + '/TourAppoint/appoint',
                    params:data,
                    method:'POST',
                    success:function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        var date=new Date();
                        myMask.hide();
                        Ext.Msg.alert('友情提示', ret.info);
                        if(ret.status){
                            clog('[appoint] /TourAppoint/appoint success.');
                            _store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        })
    }

    WG.hotel_type='';
    function hotel_room(v){
        if(v){
            if(v.text=='安排酒店'){
                WG.hotel_type='安排酒店'
                Ext.getCmp('hotel_2').hide();
            }else{
                WG.hotel_type='住宿'
                Ext.getCmp('hotel_2').hide();
            }
        }else{
            WG.hotel_type='住宿'
            Ext.getCmp('hotel_2').hide();
        }
        var row=SUNLINE.getSelected(_grid);
        if(row==null){
            Ext.Msg.alert('提示信息','请选择您要操作的内容');
            return false;
        }
        if(!row.data.team_id){
            var data=date_mod();
            Ext.Ajax.request({
                url:$__app__ + '/TeamPlan/ticket_items_list_add',
                params:data,
                method:'POST',
                success:function (response, otps) {
                    var ret = Ext.decode(response.responseText);
                    var info=ret.info;
                    var idd=info.info;
                    hp_room_id(idd);
                },
                failure:function (response, otps) {
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }else{
            hp_room_id(row.data.team_id);
        }
    }
    var hotel_plan_num=1;
    function hp_room_id(idd){
        if(WG.hotel_type=='安排酒店'){
            plan_hotel_select(idd);
        }else{
            if(hotel_plan_num==1){
                plan_hotel_select(idd);
                hotel_plan_num++;
            }else{
                room_win.show();
            }
        }
    }
    function plan_hotel_select(idd){
        Ext.Ajax.request({
            url:$__app__ + '/TeamPlanTpl/hotel_room',
            params:{team_id:idd},
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.each(Ext.decode(info.msg),function(v,i){
                    room_store.add(v);
                });
                Ext.each(Ext.decode(info.info),function(v,i){
                    room_day_store.add(v);
                });
                Ext.each(Ext.decode(info.plan),function(v,i){
                    room_plan_store.add(v);
                });
                Ext.getCmp('hp_total').setText('<span title="'+info.title+'">'+info.title+'</span>');
                room_win.show();
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }
    //打印
    function print_plan(b){
        window._print_frm.print_plan();
    };

    pro_grid.on('select',function(t,r,c,tf){
        var type_val= WG.pro_team_type;
        var p_days_val=Ext.getCmp('p_days').getValue();
        var ob_start_date_val=Ext.getCmp('ob_start_date_id').getRawValue();
        var bl_status_val=Ext.getCmp('bl_status').getValue();
        var bl_sale_fld_val=Ext.getCmp('bl_sale_fld_id').getValue();
        if(!bl_sale_fld_val['bl_saled'])bl_sale_fld_val['bl_saled']='all';
        SUNLINE.baseParams(_store,{
            team_p_id:r.data.p_id,
            type:WG.pro_team_type,
            bl_saled:bl_sale_fld_val['bl_saled'],
            p_days:p_days_val,
            start_date:ob_start_date_val,
            bl_status:bl_status_val
        },true);
        _store.currentPage=1;
        clog('pro_grid select.');
        _store.load();
    });

    ziyo_log({ listeners : [{grid: _panel, action:'TeamPlanTpl', pk_id:'team_id'}] });

    new Ext.Viewport({
        layout : 'border',
        items : [_panel]
    });

    WG.pro_team_type=tpl_type;
    SUNLINE.baseParams(pro_store,{type:WG.pro_team_type});
    pro_store.currentPage=1;
    pro_store.load();
    if(WG.pro_team_type=='team'){
        Ext.getCmp('quan_orderbus').hide();
    }else{
        Ext.getCmp('quan_orderbus').show();
    };
    //打印
    SUNLINE.baseParams(_store,{
        type:WG.pro_team_type
    },true);
    _store.currentPage=1;
    clog('就是这里了.');
    _store.load();
    function doprint(){
        window._print_frm.focus();
        window._print_frm.print();
    };

    function time_jia(v){
        return v.substr(0,4)+'-'+ v.substr(4,2)+'-'+ v.substr(6,2);
    };

    /*if(tomorrow){
        tomorrow=time_jia(tomorrow);
        Ext.getCmp('ob_start_date_id').setValue(tomorrow);
        clog('应该是这里了')
        search_mod();
    }*/

    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "d_id","d_text","cls","d_time" ]
    });
    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : []
    });

    var attrTpl = new Ext.XTemplate(
        '<div class="group-wrap">请选择日期</div>',
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{d_id}" time="{d_text}">{d_text}</div>',
        '</tpl>'
    );
    var attrView = new Ext.view.View({
        store : attr_store,
        tpl : attrTpl,
        multiSelect : true,
        simpleSelect : true,
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        emptyText : '暂无自定义属性。'
        //plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });

    var store_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        autoScroll : true,
        bodyStyle:'background:none;padding:10px',
        items:[{
            columnWidth : 1,
            autoHeight:true,
            width:400,
            minHeight:130,
            modal : true,
            layout : 'fit',
            cls : 'suntour_dataView',
            closeAction : 'hide',
            autoScroll : true,
            items: attrView
        },{
            columnWidth : 1,
            defaults:{width:330,xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
            items : [
                {id:'hp_date',name:"hp_date", fieldLabel:"hp_date2",hidden:true},
                {id:'hp_date2',name:"hp_date2", fieldLabel:"hp_date2",hidden:true},
                {id:'hp_team_id',name:"hp_team_id", fieldLabel:"hp_team_id",hidden:true},
                {id:'hp_name_room_id',name:"hp_name_room_id", fieldLabel:"hp_name_room_id",hidden:true},
                hp_name_box,
                hp_name_room_box,
                {fieldLabel:"用房/间", name:"hp_room_num",id:'form_num', xtype:'numberfield',value:0,allowBlank:false},
                {fieldLabel:"单价/间", name:"hp_room_price",id:'form_trade_price', xtype:'numberfield',allowBlank:false},
                {fieldLabel:"总金额", name:"hp_money",id:'form_all_money', xtype:'numberfield',allowBlank:false},
                {id:"form_insti_type", name:"hp_insti_type",fieldLabel:"结算方式", xtype:"combo", triggerAction : "all",
                    store:new Ext.data.SimpleStore({fields:['hp_insti_type'], data:[
                        ['现金'],
                        ['签单'],
                        ['预付']
                    ]}),
                    displayField:"hp_insti_type",
                    valueField:"hp_insti_type",
                    mode:"local",
                    value:"签单",
                    forceSelection : true,
                    typeAhead : true,
                    allowBlank:false,
                    width:330
                },
                {fieldLabel:"联系人", name:"hp_man",id:'form_man'},
                {fieldLabel:"联系方式", name:"hp_man_tel",id:'form_man_tel'},
                {xtype:'textarea',id:'form_remark',name:"hp_remark", fieldLabel:"备注",labelWidth:80,labelAlign:"right"}
            ],
            autoHeight:true
        }]
    });

    var shop_win=Ext.create('Ext.window.Window', {
        title:'安排酒店',
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        maxHeight:600,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        width:380,
        height:535,
        items:store_form,
        buttons:[
            {text:'保存',handler:shop_dosave},
            {text:'关闭', handler:function () {
                shop_win.hide();
            }}
        ]
    });

    Ext.getCmp('form_num').on('change',function(t,nv,ov,o){
        var price_h=Ext.getCmp('form_trade_price').getValue();
        if(!price_h)price_h=0;
        var all_money=(parseFloat(price_h)*parseFloat(nv)).toFixed(2);
        Ext.getCmp('form_all_money').setValue(all_money);
    })
    Ext.getCmp('form_trade_price').on('change',function(t,nv,ov,o){
        var price_h=Ext.getCmp('form_num').getValue();
        if(!price_h)price_h=0;
        var all_money=(parseFloat(price_h)*parseFloat(nv)).toFixed(2);
        Ext.getCmp('form_all_money').setValue(all_money);
    })
    Ext.getCmp('form_all_money').on('blur',function(t,nv,ov,o){
        var all_money=Ext.getCmp('form_all_money').getValue();
        if(!all_money)all_money=0;
        var num=Ext.getCmp('form_num').getValue();
        if(!num)num=0;
        var price=(parseFloat(all_money)/parseFloat(num)).toFixed(2);
        Ext.getCmp('form_trade_price').setValue(price);
    })


    function shop_dosave(){
        var vaild=store_form.getForm().isValid();
        if(!vaild){
            Ext.Msg.alert('友情提示', '请检查红色边框区域是否填写正确！');
            return false;
        }
        var data=store_form.getForm().getValues();
        var grid_row=SUNLINE.getSelected(_grid);
        data['hp_team_id']=grid_row.data.team_id;
        var h = attrView.getSelectedNodes();
        if(h.length<1){
            Ext.Msg.alert('友情提示', '请选择您要入住的时间！');
            return false;
        };
        if(WG.add_edit=='edit'){
            var row=SUNLINE.getSelected(room_plan);
            room_plan_store.remove(row);
        };
        for (var i=0; i < h.length; i++){
            data['id'] = time();
            if(h[i].textContent!='入住时间'){
                var _dd = {};
                for (var dk in data){
                    if (typeof data[dk] !== 'function'){
                        _dd[dk] = data[dk];
                    }
                }
                var _d = room_plan_store.add(_dd);
                var date=h[i]['attributes'][2]['value'];
                var date2=h[i].textContent;
                _d[0].set('hp_date', date);
                _d[0].set('hp_date2', date2);
            }
        };
        shop_win.hide();
        Ext.Msg.alert('友情提示', '安排酒店成功');
    }

    shop_win.on('hide',function(){
        store_form.form.reset();
        WG.add_edit='';
    })

    function ItemsList(opt,obj,sct_type_select){
        //计算方式
        var id_arr=[];
        var items_cost_store=opt.store;
        //默认情况下有车辆与导游
        var tpl_car,tpl_diao,tpl_text,shop_type,team_hotel_plan;
        //出团计划单 酒店独有
        if(opt.team_hotel_plan==true){
            team_hotel_plan=true;
        }else{
            team_hotel_plan=false;
        }
        if(opt.tpl_car==true){
            tpl_car=true;
        }else{
            tpl_car=false;
        }
        if(opt.tpl_diao==true){
            tpl_diao=true;
        }else{
            tpl_diao=false;
        }
        if(tpl_diao==true && tpl_car==true){
            tpl_text=true;
        }
        if(opt.team_plan!=true){
            var empty_store=[
                {type_new:'车辆',insti_name:'中型车',cs_type_name:'中型大巴',sort:-8},
                {type_new:'导游',insti_name:'地接导游',cs_type_name:'地接导游',sort:-8},
            ];
            Ext.each(empty_store,function(emv,emi){
                EmptyItemsStore(emv);
            })
        }

        function EmptyItemsStore(data){
            if(!data.type_new || !data.insti_name) return false;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_type_name_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票',//票种类型,
                ti_sense_price:data.ti_sense_price?data.ti_sense_price:0,//成本单价,
                ti_days_num:data.ti_days_num?data.ti_days_num:1,//使用天数,
                ti_profit:data.ti_profit?data.ti_profit:0//毛利
            };
            //items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_arr=[],items_remove=[];
            items_cost_store.each(function(v){
                var row= v.data;
                items_arr.push(row.ti_type_new);
            });
            if(in_array(data.type_new,items_arr)==-1){
                items_cost_store.add(items_data);
            }
            return items_data;
        }
        var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
            collapsible:false,
            groupHeaderTpl:['','<div><span class="items-group-cls">{rows:this.values_rows}</span>{name:this.format_keyword} (共 {[values.rows.length]} 项成本)</div>',{
                format_keyword:function(name){
                    if(name=="-1"){
                        return '按团计费';
                    }else if(name=="-2"){
                        return '分公司报价';
                    }else{
                        if(parseFloat(name)>0) name='第'+name+'天';
                        return name;
                    }
                },
                values_rows:function(row){
                    if(row.length>0){
                        var items_type={},money= 0,money_total=0;
                        Ext.each(row,function(v,i){
                            var rw=v.data;
                            money+=parseFloat(rw['ti_trade_price']);
                            money_total+=parseFloat(rw['ti_all_money']);
                        });
                    }
                    return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元] [单价小计:<font class="red-cls">￥'+money.toFixed(2)+'</font>元]';
                }
            }]
        });

        //表头标注
        //删除项目
        function items_del(){
            return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
        };
        //结算总额显示
        function all_money(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
                }else{
                    return '￥'+ parseFloat(v).toFixed(2)
                }
            }
        };
        //结算单价显示
        function trade_price_new(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '￥'+parseFloat(v).toFixed(2);
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '￥'+parseFloat(v).toFixed(2);
                }else{
                    return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
                }
            }
        };
        function type_name_box_fn(v,m,r){
            if(opt.team_line!=true)return v;
            if(!v)return '';
            var ti_sense_price=r.data.ti_sense_price;
            if(!ti_sense_price)ti_sense_price=0;
            if(r.data.ti_type_new=='住宿')return '<font color="red">('+ti_sense_price+'/间)</font>'+v;
            if(r.data.ti_type_new=='导游' || r.data.ti_type_new=='车辆')return v;
            return '<font color="red">('+ti_sense_price+'/人)</font>'+v;
        };
        function profit_fn(v,m,r){
            if(!v)v=0;
            if(r.data.ti_type_new=='住宿') return '<font color="orange">'+v+'/间</font>';
            if(r.data.ti_type_new=='车辆' || r.data.ti_type_new=='导游') return '<font color="orange">'+v+'/团</font>';
            return '<font color="orange">'+v+'/人</font>';
        }
        //天数显示
        function days_format(v,m){
            if(v<0)return '-';
            return '第'+v+'天';
        }
        //项目类型
        var ti_type_mode_box=SUNLINE.LocalComob({
            id:'ti_type_mode',
            fields:['ti_type_mode'],
            data:[['按团计算'],['按人计算']],
            config:{
                id:"ti_type_mode_id",
                listeners:{ change:ti_type_mode }
            }
        });
        ti_type_mode_box.on({
            focus:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='住宿'){
                    hotel_room();
                }
            }
        });
        //结算方式
        var si_settle_type_box=SUNLINE.LocalComob({
            id:'ti_insti_type',
            fields:['ti_insti_type'],
            data:[['签单'],['现金'],['预付']],
            config:{
                id:"ti_insti_type_id"
            }
        });
        si_settle_type_box.on({
            focus:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='住宿'){
                    hotel_room();
                }
            }
        });
        var _cof={
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        };
        //搜索项目数据
        var insti_name_box=SUNLINE.ComBoxPlus({
            id:'insti_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:_cof
        });
        //搜索项目中内项目数据
        var cs_type_name_box=SUNLINE.ComBoxPlus({
            id:'cs_type_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:_cof
        });

        //票种类型Box
        var sct_type_box=SUNLINE.LocalComob({
            id:'sct_type',
            fields:['sct_type'],
            data:[['成人票'],['儿童票'],['婴儿票'],['全陪票']],
            config:{
                id:"sct_type_id",
                listeners:{
                    select:sct_type_select
                }
            }
        });
        //处理状态
        var deal_status_box=SUNLINE.LocalComob({
            id:'ti_status_box',
            fields:['ti_status_box'],
            data:[['未处理'],['处理中'],['已处理']],
            config:{
                value:'未处理'
            }
        });
        function ti_day_old(){}
        //消费项目表头
        var items_cost_cm=[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
            {header:"", dataIndex:"items_del", width:25,renderer:items_del},
            {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
            {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
            {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
            {header:"sp_one_price", dataIndex:"sp_one_price", width:10, hidden:true},
            {header:"sp_pct_num", dataIndex:"sp_pct_num", width:10, hidden:true},
            {header:"sp_id", dataIndex:"sp_id", width:10, hidden:true},
            {header:"资源名称", dataIndex:"ti_insti_name", width:150,editor:insti_name_box},
            {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
            {header:"项目名称", dataIndex:"ti_cs_type_name", width:160,editor:cs_type_name_box,renderer:type_name_box_fn},
            {header:"项目名称ID", dataIndex:"ti_cs_type_name_id", width:50,hidden:true},
            {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
            {header:"票种类型", dataIndex:"ti_sct_type", width:70,hidden:opt.type?false:true,editor:sct_type_box},
            {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box,hidden:opt.team_line?true:false},
            {header:"结算方式", dataIndex:"ti_insti_type", width:80,editor:si_settle_type_box},
            {header:"第几天", dataIndex:"ti_day",hidden:opt.type?true:false, width:80,renderer:days_format,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_day_new'
                })
            },
            {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right',sortable:true,renderer:all_money,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_all_money_new',
                    listeners:{ change:ti_settle_money }
                })
            },
            {header:"数量", dataIndex:"ti_num", width:60,align:'center',sortable:true,
                renderer:function(v,i,r){
                    if(r.get('ti_type_new')=='住宿'){
                        if(v)return v+'/间';
                    }else{
                        return v
                    }
                },
                editor:new Ext.form.NumberField({
                    minValue:1,selectOnFocus:true,id:'ti_num_new',
                    listeners:{ change:ti_settle_num }
                })
            },
            {header:"成本单价", dataIndex:"ti_sense_price",hidden:true, width:85,align:'right'},
            {header:"毛利", dataIndex:"ti_profit",sortable:true,hidden:opt.team_line?false:true,renderer:profit_fn, width:100,align:'right',
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_profit',
                    listeners:{ change:ti_profit_even }
                })
            },
            {header:"单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:80,align:'right',
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_trade_price_new',
                    listeners:{ change:ti_settle_price }
                })
            },
            {header:"备注", dataIndex:"ti_remark", width:160,editor:new Ext.form.TextField({id:'ti_remark_new'}),renderer:function(v){
                if(!v)return '';
                return '<font title="'+v+'" color="blue">'+v+'</font>';
            }},
            {header:'签单号',dataIndex:'ti_sign',width:130,editor:new Ext.form.TextField({id:'ti_sign'}),hidden:opt.team_plan?false:true},
            {header:'处理状态',dataIndex:'ti_deal_status',width:80,editor:deal_status_box,hidden:opt.team_plan?false:true,renderer:function(v){
                if(!v)return '未处理';
                return v;
            }},
            {header:'联系方式',dataIndex:'ti_man_tel',width:130,editor:new Ext.form.TextField({id:'ti_man_tel'}),hidden:true},
            {header:'联系人',dataIndex:'ti_man',width:150,editor:new Ext.form.TextField({id:'ti_man'}),hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                if(!v && !r.get('ti_man')) return '';
                if(!v)v='';
                var tel=r.get('ti_man_tel');
                if(!tel)tel='';
                return v+'-'+ r.get('ti_man_tel');
            }}
        ];
        show_hotel_win('ti_remark_new')
        show_hotel_win('ti_sign')
        show_hotel_win('ti_man')
        show_hotel_win('ti_trade_price_new')
        show_hotel_win('ti_num_new')
        show_hotel_win('ti_all_money_new')
        show_hotel_win('ti_day_new')
        function show_hotel_win(idd){
            Ext.getCmp(idd).on({
                focus:function( c, r, i, e ){
                    var row=SUNLINE.getSelected(items_cost_grid);
                    if(row.get('ti_type_new')=='住宿'){
                        hotel_room();
                    }
                }
            });
        }
        //组织tbar项目
        var items_data=[];
        Ext.each(opt.items_list,function(v,i){
            if(v.text=='车辆'){
                items_data[i]={
                    text: v.text,id: v.id,handler:tbar_items,disabled:tpl_text
                }
            }else if(v.text=='住宿'){
                if(team_hotel_plan==true){
                    items_data[i]={
                        text: v.text,id: v.id,handler:hotel_room,disabled:tpl_diao
                    }
                }else{
                    items_data[i]={
                        text: v.text,id: v.id,handler:tbar_items,disabled:tpl_diao
                    }
                }
            }else{
                items_data[i]={
                    text: v.text,id: v.id,handler:tbar_items,disabled:tpl_diao
                }
            }
        });
        if(opt.team_line==true){
            items_data=items_data.concat(
                { xtype:'checkbox',id:"Common_id",width:8,handler:click,value:true},
                '<font color="blue" title="有证不包含景区">全陪是否有证</font>'
            );
        }
        items_data=items_data.concat(
            [
                '->',
                {text:'按项目类型分组',id:'_group_by',iconCls:"searchico",field:'ti_type_new',handler:setGroup,
                    menu:{
                        items :[
                            {text:'按天分组',field:'ti_day',handler:setGroup,xtype:opt.type?'hidden':''},
                            {text:'按项目类型分组',field:'ti_type_new',handler:setGroup},
                            {text:'按结算方式',field:'ti_insti_type',handler:setGroup,xtype:opt.type?'hidden':''}
                        ]
                    }
                }
            ]);

        var grid_items={
            region:'center',
            loadMask: {msg : '数据传输中，请稍候...'},
            store: items_cost_store,
            columns: items_cost_cm,
            autoHeight : true,
            features: [items_cost_group],
            autoScroll : true,
            modal : true,
            closeAction : 'hide',
            cls : 'suntour_dataView',
            layout : 'fit',
            minWidth:500,
            minHeight:500,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            tbar:items_data
        }
        if(opt.plan_type=='height_false'){
            grid_items.autoHeight=false;
            //grid_items.height=Ext.getBody().getHeight()-200;
        }
        if(opt.team_plan==true){
            if(opt.team_guide!=true){
                grid_items.bbar=[
                    '<b>其他事项：</b>','->',
                    '备用金领款：',
                    {xtype:'numberfield', id:'team_total_fee_2', name:'team_total_fee'}
                ];
                grid_items.buttons=[
                    '->',
                    {xtype : 'tbtext', id:'total_info', text:'&nbsp;' }
                ];
            }
        };

        //画出表格
        var items_cost_grid=new Ext.grid.GridPanel(grid_items);
        var car_grid=ITEMS_YUN.CarPrice({
            load_type:'yes'
        });
        //选择车辆信息
        var car_win=Ext.create('Ext.window.Window', {
            title: '车辆规则选择',
            autoHeight:true,
            closeAction : 'hide',
            layout : 'border',
            resizable:false,
            fixed:true,
            modal:true,
            height: 500,
            width: 1000,
            items:car_grid,
            buttons:[
                {text:'确认选择',handler:car_grid_fn},
                {text:'关闭', handler:function () {
                    car_win.hide();
                }}
            ]
        });
        function click(){
            var comm=Ext.getCmp("Common_id");
            var pop=items_cost_grid.pop
            if(pop.guide<=0)return true;
            if(comm.getValue()==true){
                //选择有证，全陪不包含景区门票
                items_cost_store.each(function(v){
                    var row= v.data;
                    if(row.ti_type_new=='景区'){
                        var guide_num=parseFloat(row.ti_num)-parseFloat(pop.guide);
                        v.set('ti_num',guide_num);
                        v.set('ti_all_money',parseFloat(row.ti_trade_price)*guide_num);
                    }
                });
            }else{
                //选择无证,全陪包含景区门票
                items_cost_store.each(function(v){
                    var row= v.data;
                    if(row.ti_type_new=='景区'){
                        var guide_num=row.ti_num+pop.guide;
                        v.set('ti_num',guide_num);
                        v.set('ti_all_money',parseFloat(row.ti_trade_price)*guide_num);
                    }
                });
            }
        }
        car_win.on({
            show:function(){
                //根据人数、团队级等筛选、日期时间
                var where={};
                if(items_cost_grid.car_store){
                    var where=items_cost_grid.car_store(car_grid);
                    //日期时间
                    //开始
                    where.cap_start_date=items_cost_grid.ticket_date.start_date;
                    //结束
                    where.cap_end_date=items_cost_grid.ticket_date.end_date;
                    car_grid.where=where;
                }
                SUNLINE.baseParams(car_grid.store,where);
                car_grid.store.load();
            }
        });
        //确认选择车辆规则
        function car_grid_fn(t){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要使用的车辆规则！');
                return false;
            }
            var cap_money=row.get('cap_money')?parseFloat(row.get('cap_money')):0;
            var cap_num=parseFloat(row.get('cap_num'));
            if(cap_num==0)cap_num=1;
            var itmes_row=SUNLINE.getSelected(items_cost_grid);
            itmes_row.set('ti_insti_name', row.get('cap_name'));
            itmes_row.set('ti_cs_type_name', row.get('cap_type'));
            itmes_row.set('ti_remark', row.get('cap_remark'));

            if(opt.reckon_type=='ti_all_money'){
                //团队业务中 车辆人数=成人+儿童
                var pop=items_cost_grid.pop;
                cap_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            itmes_row.set('ti_all_money', cap_money);
            itmes_row.set('ti_num', cap_num);
            var trade_price=Math.round(cap_money/cap_num).toFixed(2);
            itmes_row.set('ti_trade_price', trade_price);
            itmes_row.set('ti_sense_price', trade_price);
            car_win.hide();
        }
        //点击事件操作,操作车辆信息
        insti_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='车辆'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过车辆规则选择?',function(y){
                        if(y=='yes'){
                            car_win.show();
                        }
                    })
                }
            }
        });
        //加载资源信息
        insti_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var insti_name_box_store=insti_name_box.store;
                SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
                insti_name_box_store.load();
            }
        });
        //选择资源信息
        insti_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                row.set('ti_name_id', r.get('id'));
                row.set('ti_cs_type_name', '');
                //联系人信息赋值
                row.set('ti_man_tel', r.get('rc_mobile'));
                row.set('ti_man', r.get('rc_name'));
                row.set('sp_one_price', r.get('sp_one_price'));
                row.set('sp_pct_num', r.get('sp_pct_num'));
                row.set('sp_id', r.get('id'));
            },
            focus:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='住宿'){
                    hotel_room();
                }
            }
        });
        //加载资源项目信息
        cs_type_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_box.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            },
            focus:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='住宿'){
                    hotel_room();
                }
                var cs_type_name_box_store=cs_type_name_box.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        //选择资源项目信息
        cs_type_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                var ti_num=row.get('ti_num');
                var price= parseFloat(r.get('price'));
                var sct_type='成人票';
                //选择项目后金额改变
                if(row.get('ti_type_new')=='购物店'){
                    var ti_remark='';
                    if(r.get('sp_one_price'))ti_remark=r.get('sp_one_price')+'/人';
                    if(r.get('sp_pct_num'))ti_remark=ti_remark?(ti_remark+'+'+r.get('sp_pct_num')+'%'):r.get('sp_pct_num')+'%';
                    if(r.get('sp_remark'))ti_remark=ti_remark?(ti_remark+' 说明:'+r.get('sp_remark')):r.get('sp_remark');
                    row.set('ti_insti_type', '签单');
                    row.set('ti_remark', ti_remark);
                    if(r.get('sp_one_price')){
                        price=0-parseFloat(r.get('sp_one_price'));
                        row.set('ti_trade_price', price.toFixed(2));
                        row.set('ti_sense_price', price.toFixed(2));
                        row.set('ti_num',ti_num);
                        row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                    }
                }else{
                    if(row.get('ti_type_new')=='景区')sct_type= r.get('t_type');
                    row.set('ti_insti_type', r.get('pay_type'));
                    row.set('ti_num',ti_num);
                    row.set('ti_remark', r.get('remark'));
                    row.set('ti_sense_price', price.toFixed(2));
                    if(row.get('ti_type_new')=='住宿'){
                        if(opt.team_line==true){
                            price=(price+row.get('ti_profit'))*row.get('ti_days_num')/2;//(成本单价+毛利)*天数/2
                        }else{
                            price=price/2;
                        }
                    }
                    row.set('ti_trade_price', price.toFixed(2));
                    row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                }
                row.set('ti_sct_type', sct_type);
            }
        });
        //操作结算总额
        function ti_settle_money(t,nv,ov,o){
            //操作总额同步操作单价
            var row=SUNLINE.getSelected(items_cost_grid);
            //按人计算是单价=总金额*数量
            var price=Math.round(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
            var ti_sense_price=0;
            if(!nv)nv=0;
            if(row.get('ti_type_mode')=='按团计算'){
                //按团计算是单价=总金额/数量
                price=parseFloat(nv).toFixed(2);
            }
            //毛利:有按团计算、按人计算、按房间计算
            var profit=price-parseFloat(row.get('ti_sense_price'));
            if(!profit)profit=0;
            if(row.get('ti_type_new')=='住宿'){
                profit=(price/row.get('ti_days_num'))*2-parseFloat(row.get('ti_sense_price'));
            }else if(row.get('ti_type_new')=='车辆'){
                row.set('ti_sense_price',round_format(price));
                //profit=profit*parseFloat(row.get('ti_num'));
                profit=0;
            }else if(row.get('ti_type_new')=='导游'){
                profit=0;
                row.set('ti_sense_price',round_format(price));
            }
            row.set('ti_trade_price',round_format(price));
            row.set('ti_profit',round_format(profit));
        }
        //按团切换事件
        function ti_type_mode(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(nv=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
            }else{
                var price=Math.round(parseFloat(row.get('ti_all_money'))/parseFloat(row.get('ti_num'))).toFixed(2);
                row.set('ti_trade_price',round_format(price));
            }
        }
        //操作数量时，操作结算总额和结算单价
        function ti_settle_num(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=0;
            if(!nv)nv=0;
            if(row.get('ti_type_mode')=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
                return false;
            }
            if(opt.reckon_type=='ti_trade_price'){
                if(row.get('ti_type_new')=='住宿'){
                    //如果是住宿计算总额
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }else{
                    //如果是其他计算单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }
            }else{
                if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                    //如果是车辆与导游计算修改单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }else{
                    //其他计算总价
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }
            }
        }

        //操作毛利时,操作结算单价
        function ti_profit_even(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(!nv)nv=0;
            //单价=(成本单价+毛利)
            var trade_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv);
            if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                //单价=成本单价+(毛利/数量)
                trade_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv)/parseFloat(row.get('ti_num'));
            }else if(row.get('ti_type_new')=='住宿'){
                //单价=(成本单价+毛利)*天数/2
                trade_price=(parseFloat(row.get('ti_sense_price'))+parseFloat(nv))*row.get('ti_days_num')/2;
            }
            row.set('ti_trade_price',round_format(trade_price));
            //总金额
            var price=(trade_price*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(trade_price);
            row.set('ti_all_money',round_format(price));
        }

        //操作单价时,操作结算总额
        function ti_settle_price(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(nv);
            row.set('ti_all_money',round_format(price));
            if(opt.team_line!=true)return false;
            //成本价=(单价-毛利)
            var sense_price=parseFloat(nv)+parseFloat(row.get('ti_profit'));
            if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                //成本价=单价-(毛利/数量)
                sense_price=parseFloat(row.get('ti_sense_price'))+parseFloat(nv)/parseFloat(row.get('ti_num'));
            }else if(row.get('ti_type_new')=='住宿'){
                //成本价=(成本单价+毛利)*天数/2
                sense_price=(parseFloat(row.get('ti_sense_price'))+parseFloat(nv))*row.get('ti_days_num')/2;
            }else{
                row.set('ti_profit',0);
                row.set('ti_sense_price',nv);
            }
        }

        //双击删除项目
        //tpl_diao=true;   //false有权限  true没权限
        //tpl_car=false;
        items_cost_grid.on({
            celldblclick:function(t, td, c, r, tr, ri, e, opt){
                if(c==2){
                    var _row=SUNLINE.getSelected(items_cost_grid);
                    items_cost_store.remove(_row);
                }
            },
            'beforeedit':function(a,b,c){
                if(b.record.data.ti_type_new=='车辆'){
                    if(tpl_car==true && tpl_diao==true){
                        return false;   // false不可修改  true可修改
                    }else{
                        return true;
                    }
                }else{
                    if(tpl_diao==true){
                        return false;   //不可修改
                    }else{
                        return true;   //可修改
                    }
                }
            }
        });


        items_cost_store.on({
            update:function(){
                items_total_money();
            },
            datachanged:function(){
                items_total_money();
            }
        });


        //计算最终金额
        function items_total_money(){
            var total_money= 0,items_num={},money= 0,items_type={};
            items_cost_store.each(function(v){
                var row= v.data;
                items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
                if(opt.reckon_type=='ti_trade_price'){
                    //1.根据结算单价计算
                    money=parseFloat(row.ti_trade_price);
                    if(row.ti_type_new=='住宿'){
                        money=parseFloat(row.ti_all_money);
                    }
                    total_money+=money;
                }else{
                    //2.根据结算总额计算
                    money=parseFloat(row.ti_all_money);
                    total_money+=money;
                }
                items_type[row.ti_insti_type]=items_type[row.ti_insti_type]?(items_type[row.ti_insti_type]+parseFloat(row.ti_all_money)):parseFloat(row.ti_all_money);
            });
            Ext.each(opt.items_list,function(v,i){
                if(items_num[v.text]>0){
                    Ext.getCmp(v.id).setText(v.text+'(<font style="color:red;font-size:12px">'+items_num[v.text]+'</font>)');
                }else{
                    Ext.getCmp(v.id).setText(v.text);
                }
            });
            if(obj)obj(total_money,items_cost_store,items_type);
            items_cost_grid.total_money=total_money;

            if(opt.team_plan==true){
                if(opt.team_guide!=true){
                    //计算面签，现金，预付的明细
                    var text_money='实时统计信息：';
                    for(var itv in items_type){
                        text_money+=itv+'金额：<b>￥'+parseFloat(items_type[itv]).toFixed(2)+'</b>元;';
                    }
                    text_money+='总金额为:<b>￥'+parseFloat(total_money).toFixed(2)+'</b>元';
                    Ext.getCmp('total_info').setText(text_money);
                }
            }
        }

        //分组操作
        function setGroup(b){
            var g = Ext.getCmp('_group_by');
            g.setText(b.text);
            items_cost_store.group(b.field);
            g.field = b.field;
        };

        //添加项目
        function tbar_items(v){
            var v_text= v.text;
            if(v_text.indexOf('(')>0){
                v_text= v_text.split('(');
                v.text=v_text[0];
            }
            if(v.text=='车辆'){
                var type='按人计算';
                var day_new='-1';
                var name='北京中型车'
                var type_name='中型大巴'
            }else if(v.text=='导游'){
                var type='按人计算';
                var day_new='-1';
                var name='地接导游'
                var type_name='地接导游'
            }else if(v.text=='住宿'){
                var type='按人计算';
                var day_new='-1';
                var name=''
                var type_name=''
            }else{
                var type='按人计算';
                var day_new=1;
                var name=''
                var type_name=''
            }
            var pop_num=1;
            if(items_cost_grid.pop_num)pop_num=items_cost_grid.pop_num;
            //车辆公式计算=成人数量+儿童数量
            var pop=items_cost_grid.pop;
            if(v.text=='车辆' && typeof items_cost_grid.pop=='object'){
                pop_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            if(v.text=='景区' && opt.team_line==true){
                if(Ext.getCmp("Common_id")!=true){
                    pop_num+=parseFloat(pop.guide);
                }
            }
            var items_data={
                ti_insti_name:name,
                ti_cs_type_name:type_name,
                ti_type_new: v.text,
                ti_type_mode:type,
                ti_insti_type:'现金',
                ti_sct_type:'成人票',
                ti_day:day_new,
                ti_all_money:'0',
                ti_num:pop_num,
                ti_trade_price:'0',
                ti_remark:'',
                ti_profit:0,
                ti_days_num:1,
                ti_sense_price:0
            };
            items_cost_store.add(items_data);
        }
        return items_cost_grid;
    }
});
