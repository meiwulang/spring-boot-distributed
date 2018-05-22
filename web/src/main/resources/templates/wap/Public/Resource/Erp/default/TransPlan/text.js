/**
 * Created by Johony on 2016/4/13.
 */
var SelectVal = {};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    /**
     * 删除数组中指定下标和对象
     * @param obj
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    /**
     * 开始时间
     */
    var start_time=SUNLINE.ExtDateField({
        id:'ob_start_date',width:180,labelWidth:0,labelAlign:'right',name:'ob_start_date',fieldLabel:":",format: 'Ymd',value:new Date()
    });

    /**
     * 出发口岸
     */
    var start_site=SUNLINE.StartSiteBox({
        config:{displayField:'text',valueField:'text',fieldLabel:'出发口岸',labelWidth:60,width:220,labelAlign:'right',value:'全部口岸'}
    });
    /**
     * 数据源 store
     * @type {Ext.data.TreeStore}
     */
    var store = Ext.create('Ext.data.TreeStore', {
        fields: [''],proxy: {type: 'ajax',url: $__app__+'/TransPlan/TheDataJson',actionMethods:{create:'POST',read:'POST',update:'POST',destroy:'POST'}},
        root:{ expanded: true, children:'children'}
    });
    /**
     * checkData 表示勾选的游客信息
     * site_name 站点名称
     * @type {Array}
     */
    var checkData = [],site_name = [];
    /**
     * 安排接送列表
     * @type {*[]}
     */
    var cm=[
        { xtype: 'treecolumn', text: '去返/出发站点/游客姓名',dataIndex: 'ob_start_site',width:570,renderer:function(v,i,r){
            var data = r.data;
            if(data.depth == '1'){
                return r.get('goto_type');
            }
            if(data.depth == '2'){
                var num = data.children.length;
                if(num>0){
                    if(data.children[0].ob_goto_type == '去程'){
                        var ob_site = data.children[0].ob_start_site;
                    }else if(data.children[0].ob_goto_type == '返程'){
                        var ob_site = data.children[0].ob_end_site;
                    }
                }
                var stname = '';
                var noNum = 0;
                if(data.s_start_stname)stname = data.s_start_stname;
                if(data.s_end_stname)stname = data.s_end_stname;
                $.each(data.children,function(i,v){
                    if(v.ob_bus_number == '' && v.ob_start_time == 0 && v.ob_end_time == 0) noNum++;
                })
                return stname+' 到'+ob_site+'  (共 '+num+' 人 '+'<b style = "color:red">未 安 排 票 务: '+noNum+' 人</b>)';
            }
            if(data.depth == '3'){
                return r.get('s_vip_name');
            }
            return v;
        }},
        {header:"座位ID",dataIndex:"s_id",hidden:true},
        {header:"计划ID",dataIndex:"s_tpid",hidden:true,renderer:function(v,i,r){
            if(r.data.depth == 3){
                if(r.get('goto_type')== '去程'){
                    return r.data.s_go_tpid;
                }else if(r.get('goto_type') == '返程'){
                    return r.data.s_back_tpid;
                }
            }
        }},
        {header:"手机号",dataIndex:"s_vip_mob",width:100,align:'center'},
        {header:"订单编号",dataIndex:"s_o_number",width:160,align:'center',renderer:function(v){
            if(v){
                var str = '<a href = "javascript:;" onclick = UrlOrder("'+v+'") style = "color:blue">'+v+'</a>';
                return str;
            }
        }},
        {header:"车次编号",dataIndex:"ob_bus_number",width:100,align:'center',renderer:function(v,i,r){
            if(!v && r.data.depth == 3){
                return '<b style = "color:red">未安排票务</b>';
            }
            return v;
        }},
        {header:'出发时间',dataIndex:"ob_start_time",width:100,align:'center',renderer:function(v,i,r){
            if(!v && r.data.depth == 3){
                return '<b style = "color:red">未安排票务</b>';
            }
            return v;
        }},
        {header:'到达时间',dataIndex:"ob_end_time",width:100,align:'center',renderer:function(v,i,r){
            if(!v && r.data.depth == 3){
                return '<b style = "color:red">未安排票务</b>';
            }
            return v;
        }},
        {xtype: 'checkcolumn',header: '计划状态',dataIndex: 'done',width: 100,stopSelection: true,menuDisabled: true,id:'check',name:'check',
            renderer:function(v,m,r){
                /*if(r.get('s_go_tpid')>0 && r.get('goto_type')== '去程'){return '';}
                if(r.get('s_back_tpid')>0 && r.get('goto_type')== '返程'){return '';}
                return (new Ext.grid.column.CheckColumn).renderer(v);*/
                if(r.data.depth == 3){
                    if(r.data.ob_goto_type == '去程' && r.data.s_go_tpid > 0 ){
                        return '';
                    }
                    if(r.data.ob_goto_type == '返程' && r.data.s_back_tpid > 0 ){
                        return '';
                    }
                }
                return (new Ext.grid.column.CheckColumn).renderer(v);
            },
            listeners:{
                checkchange:function(t,r,c,o){
                    check_child(store.getAt(r),c);
                }
            }
        },
        {header:'操作',dataIndex:'start_date',align:'center',width:140,renderer:function(v,n,r){
            if(r.data.depth == 3){
                if((r.data.ob_goto_type == '去程' && r.data.s_go_tpid == 0) || (r.data.ob_goto_type == '返程' && r.data.s_back_tpid == 0)){
                    return '<span style = "color:red">暂无计划</span>';
                }else{
                    if(r.data.ob_goto_type == '去程'){
                        var StrSite = r.get('ob_start_site');
                    }else if(r.data.ob_goto_type == '返程'){
                        var StrSite = r.get('ob_end_site');
                    }
                    var StrDate = createDate(Ext.getCmp('ob_start_date').getValue());
                    var StrType = r.get('ob_goto_type');
                    var str = 's_start_date-'+StrDate+'-ob_start_site-'+StrSite+'-ob_goto_type-'+StrType;
                    var plStr = '<a style = "color:blue;cursor:pointer" onclick=planeList("'+str+'")>[计划明细]</a>';
                    return plStr;
                }
            }
        }}
    ];


    function check_child(node,checked){
       node.eachChild(function(child) {
           child.set('done', checked);
           if(child.hasChildNodes()){
               check_child(child,checked);
           }
       })
    }
    /**
     *获取子节点信息
     * @param row //
     * @param r
     * @param bool
     */
    function children_row(row,r,bool){
        checkData = [];site_name = [];
        var len=row.children.length;
        store.getAt(r).set('done',bool);
        for(var i=0;i<len;i++){
            var index_row=row['children'][i];
            if(index_row.s_tpid>0)continue;
            if(row.expanded==true){
                store.getAt(r+i+1).set('done',bool);
            }else{
                index_row.done=bool;
            }
            if(bool==false){
                checkData.remove(index_row.s_id);
                site_name.remove(index_row.site_name);
            }else{
                if(checkData.indexOf(index_row.s_id)<0){
                    checkData.push(index_row.s_id);
                    site_name.push(index_row.site_name);
                }
            }
        }
    }
    /**
     * 订单类型的下拉框
     */
    var o_type = new Ext.form.ComboBox({
        id:'s_o_type',name:'s_o_type',fieldLabel:"订单类型",xtype:"combo",editable:false,width:150,labelWidth:60,triggerAction:"all",
        store:new Ext.data.SimpleStore({fields:['ord_type'],data:[['全部'],['跟团游'],['团队订单']]}),
        displayField:"ord_type",valueField:"ord_type",mode:"local",forceSelection:true,typeAhead:true,value:"全部",
        /*listeners:{
            select:function(v,n,i){
                var s_o_type = n[0].data.ord_type;
                SUNLINE.baseParams(store,{s_o_type:s_o_type,o_start_date:urlData.s_start_date,ob_goto_type:urlData.ob_goto_type,start_site:urlData.ob_start_site});
                store.reload();
            }
        }*/
    })
    /**
     * 搜索
     */
    var search = {
        xtype:'trigger',
        triggerCls : 'x-form-search-trigger',
        id:'pl_Search',
        cls:'search-icon-cls',
        emptyText : '游客姓名,游客手机号,订单编号,站点名称,航班编号',
        width:350,
        onTriggerClick:function(e){
            planeSearch();
        },
        listeners :{
            "specialkey" : function(_t, _e){
                if(_e.keyCode==13)
                    planeSearch();
            }
        }
    };
    /**
     * grid
     * @type {Ext.tree.Panel}
     */
    var grid = Ext.create('Ext.tree.Panel',{
        region:'center',border:false,rootVisible: false,useArrows: true,store:store,columns:cm,
        loadMask:{ msg : '数据载入中，请稍后' },viewConfig:{emptyText : '<span>暂无旅客信息</span>',deferEmptyText : true},
        /*selModel:{selType: 'checkboxmodel'},*/
        tbar:[
            '<span style = "font-size: 14px;color:#00b7ee;font-weight: bolder">接送计划</span>',
            o_type,
            '-',
            '出发时间',
            start_time,
            start_site,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            {text:'安排计划',iconCls:'button-edit',handler:MakePlane,disabled:isDisabled('TransPlan::trans_plan_save')},
            {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
            '-',
            '快速搜索：',
            search,
            '->',
            {text:'关闭',iconCls:'button-close',handler:function(){
                Ext.MessageBox.confirm('友情提示','你确定要关闭吗?',function(y){
                    if(y=='yes'){
                        parent.CloseTab(true);
                    }
                })
            }}
        ]
    });

    /**
     *搜索
     * @returns {boolean}
     */
    function planeSearch(){
        var skey=Ext.getCmp('pl_Search').getValue();
        var siteName = start_site.getValue();
        var start_date = createDate(Ext.getCmp('ob_start_date').getValue());
        if(!siteName && !start_date){
            Ext.Msg.alert('温馨提示','请选择时间和出发口岸！');
            return false;
        }
        SUNLINE.baseParams(store,{start_site:siteName,o_start_date:start_date,skey:skey});
        store.currentPage=1;
        store.load();
    }

    /**
     * 组织时间日期数据
     * @param dateVal
     * @returns {number}
     */
    function createDate(dateVal){
        var year = dateVal.getFullYear();
        var mon = dateVal.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = dateVal.getDate();
        if(day<10){
            day = '0'+day;
        }
        return year+mon+day;
    }
    /**
     * 查询信息哦
     */
    function getTopInfo(){
        SelectVal.typeVal = Ext.getCmp('s_o_type').getValue();
        SelectVal.time = createDate(start_time.getValue());
        SelectVal.site = start_site.getValue();
    }

    /**
     * 条件查询
     */
    function selectInfo(){
        getTopInfo();
        SUNLINE.baseParams(store,{o_start_date:SelectVal.time,s_o_type:SelectVal.typeVal,start_site:SelectVal.site});
        store.load();
    }

    window.planeList=function(v){
        parent.OpenTab('计划明细', 'PlaneList'+v, '', $__app__+'/TransPlan/PlaneList/'+v, 1);
    }
    window.UrlOrder=function(v){
        parent.OpenTab('订单详情:'+v, 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v, 1);
    }
    var dri_store = SUNLINE.JsonStore($__app__+'/TransPlan/getDrivers',['d_id','u_name','u_mobile','plan','site','time'], false);
    var car_store = SUNLINE.JsonStore($__app__+'/TransPlan/getCars',['c_id','c_mark','c_brand','c_people','plan','num'], false);
    var car_type=SUNLINE.ComBoxPlus({
        id:'tp_car_type',
        fields:['d_id','d_text','d_type'],
        url:$__app__+'/Dict/dict_json',
        where:{d_type:'车辆车型'},
        config:{displayField:'d_text',valueField:'d_text',value:'',fieldLabel: '车辆类型',labelWidth:90,labelAlign:'right',hidden:true}
    });
    var cmForm = [
        {id:"tp_bus_text",name:"tp_bus_text",fieldLabel:"车辆信息",hidden:true},
        {id:"tp_driver_text",name:"tp_driver_text",fieldLabel:'司机ID',hidden:true},
        {id:"tp_sid",name:"tp_sid",fieldLabel:'座位ID',hidden:true},
        {id:"tp_type",name:"tp_type",fieldLabel:"接送类型",editable:false,readOnly:true,hidden:true},
        {id:"tp_station_text",name:"tp_station_text",fieldLabel:"出发站点",editable:false,readOnly:true,hidden:true},
        {id:"tp_sb_text",name:"tp_sb_text",fieldLabel:'出发口岸',editable:false,readOnly:true},
        {id:"tp_area",name:'tp_area',fieldLabel:'出发城市',editable:false,readOnly:true,hidden:true},
        {id:'tp_start_date',name:'tp_start_date',fieldLabel:'出发日期',editable:false,readOnly:true},
        {id:'tp_car_org_id',name:'tp_car_org_id',fieldLabel:'车辆公司ID',hidden:true},
        {
            id:'tp_car_org_name',
            name:'tp_car_org_name',
            fieldLabel:'车辆公司',
            xtype:'combo',
            editable:true,
            store:SUNLINE.JsonStore($__app__+'/TransPlan/getCarOrg',['id','text'],false),
            loadingText:'正在加载数据',
            displayField:'text',
            valueField:'text',
            queryMode:'remote',
            selectOnFocus:true,
            allowBlank:false,
            emptyText:'请选择车辆公司',
            listeners:{
                select:function(v,r,i){
                    var row = r[0].data;
                    Ext.getCmp('tp_api_type').setValue(row.org_api_type);
                    Ext.getCmp('tp_driver').setValue();
                    Ext.getCmp('tp_driver_text').setValue();
                    Ext.getCmp('tp_bus').setValue();
                    Ext.getCmp('tp_bus_text').setValue();
                    Ext.getCmp('tp_car_num').setValue();
                    car_type.setValue();
                    Ext.getCmp('tp_forecast_money').setValue();
                    Ext.getCmp('tp_real_money').setValue();
                    Ext.getCmp('tp_specail_serve').setValue();
                    Ext.getCmp('tp_car_org_id').setValue(row.id);
                    if(row.text != '测试厦门'){
                        Ext.getCmp('tp_car_num').setHidden(true);
                        car_type.setHidden(true);
                        Ext.getCmp('tp_driver').setHidden(false);
                        Ext.getCmp('tp_specail_serve').setHidden(true);
                        Ext.getCmp('tp_forecast_money').setHidden(false);
                        Ext.getCmp('tp_real_money').setHidden(false);
                        Ext.getCmp('tp_bus').setHidden(false);
                        Ext.getCmp('tp_go_time').allowBlank=true;
                        Ext.getCmp('tp_car_num').allowBlank=true;
                        car_type.allowBlank=true;
                        Ext.getCmp('tp_api_type').setValue('内部');
                        var startDate = Ext.getCmp('tp_start_date').getValue();
                        SUNLINE.baseParams(dri_store,{d_org_id:row.id,date:startDate});
                        dri_store.reload();
                        SUNLINE.baseParams(car_store,{c_org_id:row.id,date:startDate});
                        car_store.reload();
                    }else{
                        Ext.getCmp('tp_car_num').setHidden(false);
                        car_type.setHidden(false);
                        Ext.getCmp('tp_forecast_money').setHidden(true);
                        Ext.getCmp('tp_real_money').setHidden(true);
                        Ext.getCmp('tp_go_time').allowBlank=false;
                        Ext.getCmp('tp_car_num').allowBlank=false;
                        car_type.allowBlank=false;
                        Ext.getCmp('tp_driver').setHidden(true);
                        Ext.getCmp('tp_bus').setHidden(true);
                        Ext.getCmp('tp_specail_serve').setHidden(false);
                        Ext.getCmp('tp_driver').allowBlank=true;
                        Ext.getCmp('tp_bus').allowBlank=true;
                        Ext.getCmp('tp_api_type').setValue('接口');
                    }
                }
            }
        },
        {
            id:"tp_driver",
            name:"tp_driver",
            fieldLabel:'司机姓名',
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_name} - {u_mobile}' +
                '<tpl if = "plan == true">',
                '<font style = "color:red" title="{site}-{time}">(已安排)</font>',
                '</tpl>',
                '</li>',
                '</tpl></ul>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{u_name} - {u_mobile}',
                '</tpl>'
            ),
            xtype:"combo",
            editable:true,
            triggerAction:"all",
            store:dri_store,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            displayField:'u_name',
            valueField:'d_id',
            queryMode:'remote',
            typeAhead: true,
            selectOnFocus:true,
            emptyText:'请选择司机',
            /*allowBlank:false,*/
            hidden:true,
            listeners:{
                select:function(v,r,i){
                    var row= r[0];
                    var str = row.get('u_name')+'--'+row.get('u_mobile');
                    Ext.getCmp('tp_driver_text').setValue(str);
                }
            }
        },
        {
            id:"tp_bus",
            name:"tp_bus",
            fieldLabel:"车辆信息",
            xtype:"combo",
            editable:true,
            triggerAction:"all",
            store:car_store,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            valueField:'c_id',
            queryMode:'remote',
            typeAhead: true,
            selectOnFocus:true,
            emptyText:'请选择车辆',
            /*allowBlank:false,*/
            hidden:true,
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{c_brand} - {c_mark} - {c_people}人' +
                '<tpl if = "plan == true">',
                '<font style = "color:red">({num})</font>',
                '</tpl>',
                '</li>',
                '</tpl></ul>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{c_brand} - {c_mark} - {c_people}人',
                '</tpl>'
            ),
            listeners:{
                select:function(v,i,r){
                    var row= i[0];
                    Ext.getCmp('tp_bus_text').setValue(row.get('c_brand')+'-'+ row.get('c_mark')+'-'+ row.get('c_people')+'人');
                }
            }
        },
        {id:'tp_person',name:'tp_person',fieldLabel:'人数',allowBlank:false,readOnly:true},
        {id:'tp_api_type',name:'tp_api_type',fieldLabel:'数据类型',hidden:true},
        {id:'tp_car_num',name:'tp_car_num',fieldLabel:'车辆数',allowBlank:false,hidden:true},
        car_type,
        {id:'tp_go_time',name:'tp_go_time',fieldLabel:'发车时间',editable:true,emptyText:'请填写发车时间',allowBlank:false},
        {id:'tp_forecast_money',name:'tp_forecast_money',fieldLabel:'预估价格',emptyText:'预估价格',allowBlank:true,hidden:true},
        {id:'tp_real_money',name:'tp_real_money',fieldLabel:'实际价格',emptyText:'实际价格',allowBlank:true,hidden:true},
        {id:'tp_specail_serve',name:'tp_specail_serve',fieldLabel:'特殊服务',hidden:true}
    ];
    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        region:'center',
        anchor: '100%',
        items:[{cls:'tcol2',defaults:{
            labelWidth:90,
            width:400,
            labelAlign:'right',
            xtype:'textfield'
        },items:cmForm}]
    })
    var gridStore = SUNLINE.JsonStore($__app__+'/TransPlan/getGrid',[],false);
    var gridCm = [
        {header:'座位ID',dataIndex:'s_id',align:'center',width:100,hidden:true},
        {header:'游客姓名',dataIndex:'s_vip_name',align:'center',width:100},
        {header:'手机号',dataIndex:'s_vip_mob',align:'center',width:100},
        {header:'订单编号',dataIndex:'s_o_number',align:'center',width:100},
        {header:'车次编号',dataIndex:'ob_bus_number',align:'center',width:100},
        {header:'出发时间',dataIndex:'ob_start_time',align:'center',width:100},
        {header:'到达时间',dataIndex:'ob_end_time',align:'center',width:100},
        {header:'上车站点',dataIndex:'site_name',align:'center',width:100}
    ];
    var maxTime = new Ext.form.ComboBox({
        id:'maxTime',name:'maxTime',fieldLabel:"",xtype:"combo",editable:false,width:150,labelWidth:60,triggerAction:"all",
        store:new Ext.data.SimpleStore({fields:['maxTime'],data:[['1小时'],['2小时'],['3小时']]}),
        displayField:"maxTime",valueField:"maxTime",mode:"local",forceSelection:true,typeAhead:true,value:"2小时",
        listeners: {
            select: function (v, n, i) {
                var data = n[0].data;
                if(data.maxTime == '1小时'){
                    Ext.getCmp('oh').setDisabled(true);
                    Ext.getCmp('hh').setDisabled(true);
                }else{
                    Ext.getCmp('oh').setDisabled(false);
                    Ext.getCmp('hh').setDisabled(false);
                }
            }
        }
    });
    var grid_bottom = Ext.create('Ext.grid.Panel',{
        store:gridStore,
        columns:gridCm,
        region : 'center',
        selModel:{
            selType: 'checkboxmodel'
        },
        tbar:[
            "<span id = 'type' style = 'color:#3892d3'>返程</span>",
            {text:'>30分钟',handler:setThisTime},
            {text:'>45分钟',handler:setThisTime},
            {text:'>1小时',id:'oh',handler:setThisTime},
            {text:'>1.5小时',id:'hh',handler:setThisTime},
            '到',
            maxTime,
            '以内'
        ],
        bbar: new Ext.PagingToolbar({pageSize: pageSize,store:gridStore,displayInfo: true,displayMsg: '',emptyMsg: '没有数据'})
    });
    var panel_bottom = Ext.create('Ext.panel.Panel',{
        region : 'south',
        layout : 'border',
        style : 'border-top-width:1px;',
        border : true,
        width:'100%',
        height:335,
        items : [grid_bottom],
        tbar:[
            "<span id = 'info' style = 'color:#3892d3'>请根据时差选择要安排的相反接送类型的游客信息</span>"
        ]
    })
    function setThisTime(v){
        //alert(v.text);
        var maxTimeVal = maxTime.getValue();
        var goType = $('#type').text();
        SUNLINE.baseParams(gridStore,{time: v.text,maxTime:maxTimeVal,goto_type:goType,sid:SelectVal.tp_sid});
        gridStore.load();
    }
    var win = Ext.create('Ext.window.Window',{
        title:"安排计划",
        width:900,
        autoHeight:true,
        //height:590,
        autoScroll: true,
        modal:true,
        closeAction:'hide',
        items: [form,panel_bottom],
        buttons:[
            {text:'确认',handler:submit},
            {text:'关闭',handler:function(){ win.hide(); }}
        ]
    });

    /**
     * 安排计划
     * @constructor
     */
    function MakePlane(){
        checkData = [];site_name = [];var gotoType = [],startSite = '';
        store.each(function(i,v){
            if(i.data.depth == '3' && i.data.done == true){
                if((i.data.ob_goto_type == '去程'  && i.data.s_go_tpid == 0) || (i.data.ob_goto_type == '返程' && i.data.s_back_tpid == 0)){
                    checkData.push(i.data.s_id);
                    site_name.push(i.data.s_start_stname);
                    startSite = i.data.ob_start_site;
                    if(gotoType.indexOf(i.data.ob_goto_type) == -1) gotoType.push(i.data.ob_goto_type);
                }
            }
        })
        if(checkData.length<=0){
            Ext.Msg.alert('温馨提示','请先选择要安排计划的游客信息');
            return false;
        }
        if(gotoType.length>1){
            Ext.Msg.alert('温馨提示','你选择的游客去返程冲突，请重新选择单程游客');
            return false;
        }
        win.show();
        //gotoType[0]='返程';
        if(gotoType[0] == '去程'){
            $('#type').text("返程");
        }else if(gotoType[0] == '返程'){
            $('#type').text("去程");
        }
        SelectVal.tp_sid = checkData.join(',');
        SelectVal.station_text = site_name.join(',');
        SelectVal.ob_start_date = createDate(start_time.getValue());
        if(SelectVal.site == '全部口岸' || !SelectVal.site){
            SelectVal.site = startSite;
        }
        Ext.getCmp('tp_sb_text').setValue(SelectVal.site);

        Ext.getCmp('tp_start_date').setValue(SelectVal.ob_start_date);
        Ext.getCmp('tp_type').setValue(gotoType[0]);
        Ext.getCmp('tp_sid').setValue(SelectVal.tp_sid);
        Ext.getCmp('tp_person').setValue(checkData.length);
        Ext.getCmp('tp_station_text').setValue(SelectVal.station_text);

    }
    win.on('hide',function(){
        form.getForm().reset();
    })

    /**
     * 获取关联游客的信息
     */
    function getDataInfo(){
        var sid=[];var siteName = [];
        var row = grid_bottom.getSelectionModel().getSelection();
        $.each(row,function(i,v){
            sid.push(v.data.s_id);
            siteName.push(v.data.site_name);
        })
        SelectVal.backSid = sid.join(',');
        SelectVal.backSite = siteName.join(',');

    }

    /**
     * 提交方法
     * @returns {boolean}
     */
    function submit(){
        var formChe = form.getForm();
        if(!formChe.isValid()){
            Ext.Msg.alert('温馨提示','请把红色框填写完整');
            return false;
        }
        var s = form.getValues();
        getDataInfo();
        if(SelectVal.backSid != ''){
            s.backSid =  SelectVal.backSid;
            s.backSite =  SelectVal.backSite;
        }
        Ext.Ajax.request({
            url:$__app__+'/TransPlan/checkTrans',
            params:s,
            method:'post',
            success:function(response){
                var x = Ext.decode(response.responseText);
                if(x.status){
                    saveData(s);
                }else{
                    Ext.MessageBox.confirm('温馨提示', x.info+'，确定要安排么？',function(y){
                        if(y == 'yes'){
                            saveData(s);
                        }
                    })
                }
            }
        });
    }
    function saveData(s){
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/SaveTheTrans',
            params: s,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    form.getForm().reset();
                    win.hide();
                    store.reload();
                    gridStore.removeAll();
                }
                myMask.hide();
            }
        })
    }
    if(urlData){
        start_time.setValue(urlData.s_start_date);
        start_site.setValue(urlData.ob_start_site);
        Ext.getCmp('pl_Search').setValue(urlData.o_number);
        SUNLINE.baseParams(store,{o_start_date:urlData.s_start_date,start_site:urlData.ob_start_site,skey:urlData.o_number});
        store.load();
    }
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    });

    ziyo_log({ listeners : [{grid: grid, action:'TransPlan', pk_id:'s_tpid'}] });

})