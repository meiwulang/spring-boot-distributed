/**
 * Created by Johony on 16-2-23.
 */
var usInfo = {};
var tp_api_type = '';
Ext.onReady(function(){
    var store = Ext.create('Ext.data.TreeStore', {
        fields: [''],
        proxy: {
            type: 'ajax',
            url: $__app__+'/TransPlan/json_data',
            actionMethods:{
                create:'POST',
                read:'POST',
                update:'POST',
                destroy:'POST'
            }
        },
        root:{ expanded: true, children:'children'}
    });
    if(urlData){
        SUNLINE.baseParams(store,{o_start_date:urlData.s_start_date,ob_goto_type:urlData.ob_goto_type,start_site:urlData.ob_start_site});
        store.load();
    }

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
    /*Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }*/
    var start_time=SUNLINE.ExtDateField({
        id:'ob_start_date',
        width:180,
        labelWidth:0,
        labelAlign:'right',
        name:'ob_start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:new Date()
    });



    var checkData = [],site_name = [];
    var cm=[
        { xtype: 'treecolumn', text: '出发站点/游客姓名',dataIndex: 'ob_start_site',width:400,renderer:function(v,i,r){
            if(r.get('site_name') && !r.get('s_vip_name')){
                return r.get('site_name');
            }else if(r.get('s_vip_name')){
                return r.get('s_vip_name');
            }else{
                return v;
            }
        }},
        {header:"座位ID",dataIndex:"s_id",hidden:true},
        {header:"手机号",dataIndex:"s_vip_mob",width:100,align:'center'},
        {header:"订单编号",dataIndex:"s_o_number",width:160,align:'center',renderer:function(v){
            if(v){
                var str = '<a href = "javascript:;" onclick = UrlOrder("'+v+'") style = "color:blue">'+v+'</a>';
                return str;
            }
        }},
        {header:"车次编号",dataIndex:"ob_bus_number",width:100,align:'center'},
        {header:'出发时间',dataIndex:"ob_start_time",width:100,align:'center',renderer:function(v){
            if(!v){
                return '';
            }
        }},
        {header:'到达时间',dataIndex:"ob_end_time",width:100,align:'center',renderer:function(v){
            if(!v){
                return '';
            }
        }},
        {
            xtype: 'checkcolumn',
            header: '计划状态',
            dataIndex: 'done',
            width: 100,
            stopSelection: true,
            menuDisabled: true,
            id:'check',
            name:'check',
            renderer:function(v,m,r){
                if(r.get('s_tpid')>0){
                    return '';
                }else{
                    return (new Ext.grid.column.CheckColumn).renderer(v);
                }
            },
            listeners:{
                checkchange:function(t,r,c,o){
                    var row=store.getAt(r).data;
                    if(row.leaf===true && row.done === true){
                        if(row.s_tpid>0)return;
                        if(checkData.indexOf(row.s_id)<0){
                            checkData.push(row.s_id);
                            site_name.push(row.site_name);
                        }
                    }else if(row.leaf===true && row.done===false){
                        checkData.remove(row.s_id);
                        site_name.remove(row.site_name);
                    }else if(row.parentId=='root' && row.done === true){
                        children_row(row,r,true);
                    }else if(row.parentId=='root' && row.done === false){
                        children_row(row,r,false);
                    }
                }
            }
        },
        {header:'操作',dataIndex:'start_date',align:'center',width:140,renderer:function(v,n,r){
            if(r.get('expanded')) return '';
            if(r.get('s_tpid')=='0') return '<span style = "color:red">暂无计划</span>';
            var StrDate = v;
            var StrSite = r.get('ob_start_site');
            var StrType = r.get('ob_goto_type');
            var str = 's_start_date-'+StrDate+'-ob_start_site-'+StrSite+'-ob_goto_type-'+StrType;
            var plStr = '<a style = "color:blue;cursor:pointer" onclick=planeList("'+str+'")>[计划明细]</a>';
            return plStr;
        }}
    ];

    window.planeList=function(v){
        parent.OpenTab('计划明细', 'PlaneList'+v, '', $__app__+'/TransPlan/PlaneList/'+v, 1);
    }
    window.UrlOrder=function(v){
        parent.OpenTab('订单详情', 'OrderDetail'+v, '', $__app__+'/OrderDetail/index/id/'+v, 1);
    }
    /**
     *获取子节点信息
     * @param row //
     * @param r
     * @param bool
     */
    function children_row(row,r,bool){
        checkData = [];
        site_name = [];
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

    var start_site=SUNLINE.StartSiteBox({
        config:{
            displayField:'text',
            valueField:'text',
            fieldLabel:'出发口岸',
            labelWidth:60,
            width:220,
            labelAlign:'right',
            value:'全部口岸'
        }
    });
    var grid = Ext.create('Ext.tree.Panel',{
        region:'center',
        border:false,
        xtype: 'treePanel',
        rootVisible: false,
        useArrows: true,
        store:store,
        columns:cm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{
            emptyText : '<span>暂无旅客信息</span>',
            deferEmptyText : true
        },
        tbar:[
            '<span style = "font-size: 14px;color:#00b7ee;font-weight: bolder">接送计划</span>',
            /*'<a style = "cursor: pointer;color:#009DDA" onclick = backPlanes()><< 返回接送计划列表</a>',*/
            /*{
                id:"ob_goto_type",
                name:"ob_goto_type",
                fieldLabel:"类型",
                xtype:"combo",
                editable:false,
                width:120,
                labelWidth:30,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['ob_goto_type'],
                    data:[
                        ['去程'],
                        ['返程']
                    ]
                }),
                displayField:"ob_goto_type",
                valueField:"ob_goto_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"去程"
            },
            '出发时间',
            start_time,
            start_site,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
             */
            '-',
            {text:'刷新', iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '-',
            {
                id:'s_o_type',
                name:'s_o_type',
                fieldLabel:"订单类型",
                xtype:"combo",
                editable:false,
                width:150,
                labelWidth:60,
                triggerAction:"all",
                store:new Ext.data.SimpleStore({
                    fields:['ord_type'],
                    data:[
                        ['全部'],
                        ['跟团游'],
                        ['团队订单']
                    ]
                }),
                displayField:"ord_type",
                valueField:"ord_type",
                mode:"local",
                forceSelection:true,
                typeAhead:true,
                value:"全部",
                listeners:{
                    select:function(v,n,i){
                        var s_o_type = n[0].data.ord_type;
                        SUNLINE.baseParams(store,{s_o_type:s_o_type,o_start_date:urlData.s_start_date,ob_goto_type:urlData.ob_goto_type,start_site:urlData.ob_start_site});
                        store.reload();
                    }
                }
            },
            '-',
            {text:'安排计划',iconCls:'button-edit',handler:MakePlane,disabled:isDisabled('TransPlan::trans_plan_save')},
            '-',
            '快速搜索：',
            {
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
            },
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
    window.backPlanes=function(){
        /*var StrType = urlData.ob_goto_type;
        var StrSite = urlData.ob_start_site;
        var StrDate = urlData.s_start_date;
        var str = 's_start_date-'+StrDate+'-ob_start_site-'+StrSite+'-ob_goto_type-'+StrType;*/
        parent.OpenTab('接送计划', 'TransList', '', $__app__+'/TransPlan/TransList', 1);
    }
    function planeSearch(){
        if(urlData){
            var go_type = urlData.ob_goto_type;
            var start_site = urlData.ob_start_site;
            var start_date = urlData.s_start_date;
        }else{
            Ext.Msg.alert('温馨提示','缺少重要查询条件');
            return false;
        }
        var skey=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{ob_goto_type:go_type,start_site:start_site,o_start_date:start_date,skey:skey});
        store.currentPage=1;
        store.load();
    }

    /**
     * 查询信息哦
     */
    function getTopInfo(){
        /*usInfo.type = Ext.getCmp('ob_goto_type').value;
        var start_date = Ext.getCmp('ob_start_date').value;
        usInfo.site_val = start_site.getValue();
        var year = start_date.getFullYear();
        var mon = start_date.getMonth()+1;
        if(mon<10){
            mon = '0'+mon;
        }
        var day = start_date.getDate();
        usInfo.start = year+mon+day;*/
        //SUNLINE.baseParams(store,{o_start_date:urlData.s_start_date,ob_goto_type:urlData.ob_goto_type,start_site:urlData.ob_start_site});
    }
    /*function selectInfo(){
        SUNLINE.baseParams(store,{o_start_date:usInfo.start,ob_goto_type:usInfo.type,start_site:usInfo.site_val});
        store.load();
    }*/

    /******************安排计划开始*********************************************/
    /**
     * 安排计划
     * @returns {boolean}
     * @constructor
     */
    function MakePlane(){
        var len = checkData.length;
        if(typeof checkData[len-1] == 'undefined'){
            Ext.Msg.alert('温馨提示','请先选择要安排的旅客');
            return false;
        }
        win.show();
        Ext.getCmp('tp_sb_text').setValue(urlData.ob_start_site);
        Ext.getCmp('tp_start_date').setValue(urlData.s_start_date);
        Ext.getCmp('tp_type').setValue(urlData.ob_goto_type);
        Ext.getCmp('tp_sid').setValue(checkData);
        Ext.getCmp('tp_person').setValue(len);
        Ext.getCmp('tp_station_text').setValue(site_name);

    }
    /**
     * 安排计划表单
     * @type {Ext.form.Panel}
     */
    /*var specail_serve=SUNLINE.ComBoxPlus({
        id:'tp_specail_serve',
        fields:['type'],
        action:'local',
        storeData:[['儿童座'],['轮椅']],
        config:{
            fieldLabel:'特殊服务',
            width:280,
            labelWidth:60,
            displayField:'type',
            valueField:'type',
            labelAlign:'right',
            multiSelect: true
        },
        type:'Tag'
    });*/
    var dri_store = SUNLINE.JsonStore($__app__+'/TransPlan/getDrivers',['d_id','u_name','u_mobile'], false);
    var car_store = SUNLINE.JsonStore($__app__+'/TransPlan/getCars',['c_id','c_mark','c_brand','c_people'], false);
    var car_type=SUNLINE.ComBoxPlus({
        id:'tp_car_type',
        fields:['d_id','d_text','d_type'],
        url:$__app__+'/Dict/dict_json',
        where:{d_type:'车辆车型'},
        config:{displayField:'d_text',valueField:'d_text',value:'',fieldLabel: '车辆类型',labelWidth:60,labelAlign:'right',hidden:true}
    });
    var cm = [
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
            store:SUNLINE.JsonStore($__app__+'/TransPlan/getCarOrg',['org_id','org_name'],false),
            loadingText:'正在加载数据',
            displayField:'org_name',
            valueField:'org_name',
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
                    Ext.getCmp('tp_car_org_id').setValue(row.org_id);
                    if(row.org_name != '测试厦门'){
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
                        SUNLINE.baseParams(dri_store,{d_org_id:row.org_id});
                        dri_store.reload();
                        SUNLINE.baseParams(car_store,{c_org_id:row.org_id});
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
                '<li role="option" class="x-boundlist-item">{u_name} - {u_mobile}</li>',
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
            allowBlank:false,
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
            allowBlank:false,
            hidden:true,
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{c_brand} - {c_mark} - {c_people}人</li>',
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
        {id:'tp_specail_serve',name:'tp_specail_serve',fieldLabel:'特殊服务',xtype:'textarea',hidden:true}
    ];


    var form = Ext.create('Ext.form.Panel',{
        bodyPadding: 10,
        autoScroll:true,
        width: "100%",
        defaults:{
            labelWidth:60,
            width:280,
            labelAlign:'right',
            xtype:'textfield'
        },
        items:cm
    })

    /**
     * 安排计划窗口
     */

    var win = new Ext.Window({
        title:"安排计划",
        width:330,
        /*height:245,*/
        autoScroll: true,
        closeAction:'hide',
        items: form,
        buttons:[
            {text:'确认',handler:submit},
            {text:'关闭',handler:function(){ win.hide(); }}
        ]
    });

    /**
     * 数据查重
     */
    /*function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem;!(elem = arr[i]); i++) {
            if(!hash[elem]){
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }*/
    function submit(){
        var iform = form.getForm();
        var v=iform.getValues();
        if(!form.getForm().isValid()) {
            Ext.Msg.alert('友情提醒','请把红色边框填写完整！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/TransPlan/trans_plan_save',
            params: v,
            method:'post',
            success: function(response){
                var r = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示', r.info);
                if(r.status){
                    form.getForm().reset();
                    checkData = [];
                    win.hide();
                    store.reload();
                }
                myMask.hide();
            }
        })
    }



    /************************安排计划结束************************************/
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})