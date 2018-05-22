var Cp={};
var MapVal = {};
var IS_EDIT=true;//点击的状态
var TAB_CLICK='';//现在点击的是哪个tab
var ROW={},ROW2={}; //  ROW2是预览界面的全局  ROW是编辑状态下全局
var select_org_id; //当前选中的所属单位ID
Ext.onReady(function(){
    var thisTitle='单位';
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';

    Ext.QuickTips.init();
    var c_url=$__app__+'/Company/json_data';
    var c_field=['org_id','org_pid','org_bh','org_name','org_sname', 'org_addr','org_legal','org_tel','org_mob',
        'wg_fax','org_status','org_pym','org_web','org_addtime','org_intro','org_logo','org_pic',
        'org_mapx','org_mapy','org_mapz'];
    var c_store=SUNLINE.JsonStore(c_url,c_field);

    var c_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID", dataIndex:"org_id", width:80, hidden:true},
        {header:"编号", dataIndex:"org_bh", width:85},
        {header:"单位名称", dataIndex:"org_name", width:220},
        {header:"单位类型", dataIndex:"org_type", width:80},
        {header:"是否开户", dataIndex:"org_finaccount", width:80,renderer:
            function(v,m,r){
                var span = r.get('org_finaccount')==1 ? '<span title="已开付款账户"><img src="/Public/Images/account-out.png"></span>' : '';
                span += r.get('org_receipt_account')==1 ? '<span title="已开收款账户" style="margin-left:3px;"><img src="/Public/Images/account-in.png"></span>' : '';
                return span;
            }
        },
        {header:"设置结算", dataIndex:"org_settle_type", width:80,renderer:
            function(v,m,r){
                var span = r.get('org_settle_type') ? '<span style="color:blue">已设置</span>' : '';
                return span;
            }
        },
        {header:"服务电话", dataIndex:"org_service_tel", width:100},
        {header:"法人代表", dataIndex:"org_legal", width:80},
        {header:"法人手机号", dataIndex:"org_mob", width:120,align:'center'},
        {header:"单位地址", dataIndex:"org_addr", width:200}
    ];
    var c_grid=new Ext.grid.GridPanel({
        region:'center',
        store:c_store,
        columns: c_cm,
        border:true,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{emptyText:'没有单位信息',deferEmptyText:true},
        bbar: new Ext.PagingToolbar({pageSize: pageSize,store:c_store,displayInfo: true,displayMsg: '共{2}条数据',emptyMsg: '没有数据'})
    });





    /*****      判断附件信息是否填写完整   ******/
    function verify_card(v){
        var dd = true;
        if(!v.org_card){
            $(window.ifal.document).find('#ID_id').addClass('allow_bank');
            dd = false;
        }
        if(!v.org_tax){
            $(window.ifal.document).find('#tax_id').addClass('allow_bank');
            dd = false;
        }
        if(!v.org_charter){
            $(window.ifal.document).find('#charter_id').addClass('allow_bank');
            dd = false;
        }
        return dd;
    }
    /***   获取单位信息     ***/
    function getOther(s,fn){
        if(s == null) {
            fn();
            return false;
        }
        var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url: $__app__+'/Company/getOther',
            params: {org_id:s.org_id,org_pid:s.org_pid},
            success: function(response){
                var r = Ext.decode(response.responseText);
                if(typeof r.status !='undefined'){
                    Ext.Msg.alert('友情提示', r.info);
                }else{
                    fn(r,s);
                }
                myMask.hide();
            }
        })
    }
    /***    保存的方法    ***/
    function doSave_success(s,url,fn){
        var mask=SUNLINE.LoadMask('正在加载数据...');
        mask.show();
        Ext.Ajax.request({
            url:$__app__+url,
            params:s,
            method:'post',
            success:function(resp){
                var ret=Ext.decode(resp.responseText);
                mask.hide();
                fn(ret);
            }
        })
    }

    /****       查看单位信息的操作   ***/
    /**   单位信息展示的 Panel   infoPanel  **/
    var org_detail = new Ext.Panel({
        border : false,
        region:'center',
        width:500,
        autoScroll : true,
        style : 'border-left:1px solid #d0d0d0;border-top:1px solid #ccc;',
        html : '<div style="padding: 10px;">请点击左则列表信息!</div>'
    });
    c_grid.on('select',function( t, r, i, eOpts){
        Ext.getCmp('entityacount').setDisabled(true);
        if(r.data.org_status=='通过'){
            if(r.data.org_finaccount!=1){
                Ext.getCmp('entityacount').setDisabled(isDisabled('Company::entity_account'));
            }else{
                if(r.data.org_type!='分销商' && r.data.org_receipt_account!=1){
                    Ext.getCmp('entityacount').setDisabled(isDisabled('Company::entity_account'));
                }
            }
        }
        if(r.data.org_type=='分销商'){
            Ext.getCmp('setsettle').setDisabled(true);
        }else{
            Ext.getCmp('setsettle').setDisabled(isDisabled('Company::set_settle'));
        }
    });

    var infoPanel=Ext.create('Ext.panel.Panel',{
        region:'east',
        layout : 'border',
        width:505,
        maxHight:700,
        border:true,
        autoScroll : true,
        bodyBorder:true,
        split:{size:3},
        tbar:Ext.create('Ext.toolbar.Toolbar',{
            cls:'dd',
            items:[
                {text:'基本信息',id:'basic_info_id',cls:'tab-button-custom',enableToggle: true,handler:tabs_html},
                {text:'附件信息',id:'attach_info_id',cls:'tab-button-custom',enableToggle: true,handler:tabs_html},
                {text:'系统设置',id:'set_info_id',cls:'tab-button-custom',enableToggle: true,handler:tabs_html,hidden:true}
            ]
        }),
        items:org_detail
    })

    function tabs_html(e){
        var row = SUNLINE.getSelected(c_grid);
        if( row == null ){
            Ext.Msg.alert('提示信息','请选择你要查看的单位');
            return false;
        }
        removePress();
        e.setPressed(true);
        tabs_detail(row.data, e.text);
    }

    //模版数据信息
    function org_detail_tpl(e,data){
        var tpl_data={
            基本信息:{单位名称:'org_name',单位编号:'org_bh',单位简称:'org_sname',单位地址:'org_addr',单位类型:'org_type',票价类型:'org_fare_type',服务电话:'org_service_tel',所在省份:'org_province',
                所在城市:'org_city',所在区县:'org_county',法人姓名:'org_legal',手机号码:'org_mob',联系电话:'org_mob',单位简介:'org_intro'},
            附件信息:{公司名称:'org_name',法人姓名:'org_legal',产品类型:'org_release_news',单位logo:'org_logo',身份证号:'org_card',身份证正面:'org_card_front',身份证反面:'org_card_back',营业执照:'org_licence_code',营业执照照片:'org_licence'},
            系统设置:{是否允许分销商编辑发票抬头:'is_make_title',在线支付账单达到多少金额时合并:'withdraw_min_amount',是否开启扫描支付:'is_scan_payment',出团计划单排序:'team_plan_tour_order',班期停售设置:'stop_type',出发前几天:'buslist_stop_day',停售时分:'buslist_stop_time',支付倒计时:'is_expire_open','距离出发时间超过(小时)':'expire_time','保留(小时)':'expire_time_now','否则保留(分钟)':'expire_time_save'}
        };
        var detail=tpl_data[e];
        if(!detail)return false;
        var tpl=[];
        for(var oi in detail){
            if(!data[detail[oi]])continue;
            if(in_array(oi,['身份证正面','身份证反面','营业执照照片','单位logo'])!=-1 && e != '系统设置'){
                tpl.push('<li class="org-list"><a href="{'+detail[oi]+'}" target="_blank"><img src="{'+detail[oi]+'}?x-oss-process=image/resize,m_mfit,w_460" width="96%"></a></li>');
            }else if(e != '系统设置'){
                tpl.push('<li class="org-list"><span class="org-title" >'+oi+'：</span><span class="org-text">{'+detail[oi]+'}</span></li>');
            }else{
                if(detail[oi] == 'stop_type' || detail[oi] =='is_expire_open' ||  detail[oi] == 'team_plan_tour_order'){
                    tpl.push('<hr>');
                }
                tpl.push('<li class="org-list" ><span class="org-title" style="margin-right:20px;width: 250px;text-align: right">'+oi+'：</span><span class="org-text" style="margin-left: 180px">{'+detail[oi]+'}</span></li>');
            }
        }
        var d_tpl=tpl.join('');
        return '<div class="org-info-box"><ul>'+d_tpl+'</ul></div>';
    }

    function tabs_detail(data,type){
        var _detail_body = null;
        if (!_detail_body){
            var bd = org_detail.body;
            bd.update('').setStyle('background','#fff');
            _detail_body = bd.createChild();
        }
        data.org_type_news=data.org_type;
        data.org_release_news=p_type(data.org_release);
        type=type?type:'基本信息';
        var tpl=org_detail_tpl(type,data);
        var detail_tpl=new Ext.XTemplate(tpl);
        var html = detail_tpl.apply(data);
        _detail_body.hide().update(html).slideIn('l', {stopFx:true,duration:.5});
        org_detail.body.highlight('#c3daf9', {block:true});
    }

    function p_type(v){
        var str=','+v+',';
        var type=PRODUCTS_TYPE,
            len=type.length,va;
        for(var i=0;i<len;i++){
             if(str.indexOf(','+type[i][0]+',')>-1){
                 if(va){ va +=","+type[i][1]; }else{ va =type[i][1]; }
             }
        }
        if(!va && !v){
            va="没有类型";
        }else if(v && !va){
            va=v;
        }
        return va
    }

    c_grid.on('cellclick',function(v,i,d,r){
        removePress();
        Ext.getCmp('basic_info_id').setPressed(true);
        var row=r.data;
        if(row.org_type == '供应商'){
            Ext.getCmp('set_info_id').setHidden(false);
        }else{
            Ext.getCmp('set_info_id').setHidden(true);
        }
        tabs_detail(row);
    });

    /***    给选中tab 的添加状态    ***/
    function rP(v){
        Ext.getCmp('basic_info_id').setPressed(false);
        Ext.getCmp('attach_info_id').setPressed(false);
        Ext.getCmp('map_info_id').setPressed(false);
        Ext.getCmp('link_info_id').setPressed(false);
        if(v === true ){
            Ext.getCmp('basic_info_id').setPressed(true);
        }
    }
    /**  清除tab 的选中状态   **/
    function removePress(v){
        Ext.getCmp('basic_info_id').setPressed(false);
        Ext.getCmp('attach_info_id').setPressed(false);
        Ext.getCmp('set_info_id').setPressed(false);
        /* Ext.getCmp('map_info_id').setPressed(false);
         Ext.getCmp('link_info_id').setPressed(false);*/
        if(typeof v!='undefined') Ext.getCmp(v).setPressed(true);
    }

    /**主界面**/
    var org_type=false;
    if(_uinfo.org_type!='管理公司'){
        org_type=true;

    }

    //单位列表
    var hiderule;
    var company_box=SUNLINE.CompanyBox({
        config:{
            hidden:hiderule,
            displayField:'text',
            valueField:'id',
            fieldLabel:'所属单位',
            labelWidth:60,
            width:300,
            labelAlign: 'right',
            value: '全部公司',
            pageSize:20,
            listConfig:{
                minWidth:340
            }
        }
    });
    var company_box_store=company_box.getStore();
    company_box_store.on('load',function(a,b,c){
        this.add({id:0,text:'全部公司', org_bh: "quanbu", org_type: "管理公司",tel:'110'});
        for(var i in b){
            this.add(b[i]['data']);
        }
    })
    company_box_store.load();
    company_box.on('select',function(c,r){
        var skey = Ext.getCmp('d_type').getValue();
        var position = Ext.getCmp('position_search').getValue();
        var search_text=Ext.getCmp('search').getValue();
        var row= r[0];
        var org_id = row.get('id');
        select_org_id = org_id;
        SUNLINE.baseParams(c_store,{skey:skey,text:search_text,position:position,org_id:org_id});
        c_store.load();
    });

    var Panel=Ext.create('Ext.panel.Panel',{
        region:'center',
        layout:'border',


        tbar: {
            xtype: "container",
            border: false,
            items: [{
                //tbar第一行工具栏
                xtype: "toolbar",
                items: [

                    {text:'添加分销商',act:'addt',iconCls:'button-add',handler:modify,hidden:isDisabled('Company::add'), xtype:'splitbutton',
                        menu:{
                            items:[
                                {text:'添加供应商',act:'addt',iconCls:'button-add',handler:modify,disabled:isDisabled('Company::add')}/*,
                                 {text:'添加管理公司',act:'addt',iconCls:'button-add',handler:modify,disabled:isDisabled('Company::add')}*/
                            ]
                        }
                    },
                    '-',
                    {text:'删除',iconCls:'button-del',handler:del,hidden:isDisabled('Company::del')},

                    '-',

                    {text:'编辑',act:'addt',iconCls:'button-edit',handler:modify,disabled:isDisabled('Company::save'), xtype:'splitbutton',
                        menu:{
                            items:[
                                /*{text:'添加联系人',iconCls:'button-tq',handler:addLink,disabled:isDisabled('LinkMan::save')},
                                 "-",*/
                                {text:'开户',id:'entityacount',iconCls:'button-account-in',handler:account,disabled:isDisabled('Company::entity_account')},
                                '-',
                                {text:'结算设置',id:'setsettle',iconCls:'button-gear',handler:set_settle,disabled:isDisabled('Company::set_settle')},
                                '-',
                                {text:'余额查询',id:'rsbalance',iconCls:'button-dollar',handler:rs_balance,disabled:isDisabled('Company::rs_balance')},
                                '-',
                                {text:'管理附件',iconCls:'button-attach',handler:addLogo,disabled:isDisabled('Company::PicSave')},
                                '-',
                                {text:'印章管理',iconCls:'button-attach',handler:addSeal/*,disabled:isDisabled('Company::SealSave')*/},
                                '-',
                                {text:'广告位排序',handler:setAdv,disabled:isDisabled('Company::ad_manage')}
                                /*"-",
                                 {text:'设置坐标',iconCls:'button-structure',handler:addMap,disabled:isDisabled('Company::Map')}*/
                            ]
                        }
                    },

                    '-',
                    {text:'刷新',iconCls:'button-ref',handler:function(){
                        c_store.reload();
                    }},
                    '-',
                    {text:'日志',iconCls:'button-log', id:'ziyo_log_btn'},
                    {
                        fieldLabel: '公司类型',
                        labelAlign:'right',
                        labelWidth:70,
                        xtype:'combobox',
                        id:'d_type',name: 'd_type',
                        triggerAction:'all',
                        queryParam:'d_type',
                        editable:false,
                        store:Ext.create('Ext.data.Store', {
                            fields:['text','leaf'],
                            proxy: {
                                type: 'ajax',
                                url: $__app__+'/Dict/typeCombo',
                                extraParams:{all:true},
                                actionMethods:{create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
                                reader: {type: 'json',rootProperty: 'data'}
                            }
                        }),
                        displayField: 'text',
                        valueField: 'text',
                        emptyText:' 请选择公司类型 ',
                        allowBlank: false,
                        listeners:{
                            select:function(){
                                var skey = Ext.getCmp('d_type').getValue();
                                var position = Ext.getCmp('position_search').getValue();
                                var search_text=Ext.getCmp('search').getValue();
                                var org_id = select_org_id;
                                SUNLINE.baseParams(c_store,{skey:skey,text:search_text,position:position,org_id:org_id});
                                c_store.currentPage = 1;
                                c_store.load();
                            }
                        },
                        hidden:org_type
                    },
                    '-',
                    {
                        xtype:'textfield',
                        fieldLabel:'公司所在地:',
                        //padding:'0 50 0 0',
                        allowBlank:true,
                        id:'position_search',
                        emptyText:'点击查询公司所在地',
                        labelWidth:70,
                        hidden:org_type,

                    },
                ]
            }, {
                //tbar第二行工具栏
                xtype: "toolbar",
                items: [
                    company_box,
                    '快捷搜索:',
                    {
                        xtype:'trigger',
                        triggerCls:'x-form-search-trigger',
                        id:'search',
                        emptyText:'单位编号/单位名称/所属类型/法人姓名/手机号',
                        width:300,
                        onTriggerClick:function (e) {
                            doSearch();
                        },
                        listeners:{
                            "specialkey":function (_t, _e) {
                                if (_e.keyCode == 13)
                                    doSearch();
                            }
                        }
                    },
                    '-',
                    {
                        icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                        cls: 'x-btn-icon',
                        tooltip: '重载' + thisTitle,
                        handler:function(){
                            window.location.reload();
                        }
                    }
                ]
            }]

        },


        items:[c_grid,infoPanel]
    });

    /**搜索**/
    function doSearch(){
        var skey = Ext.getCmp('d_type').getValue();
        var position = Ext.getCmp('position_search').getValue();
        var search_text=Ext.getCmp('search').getValue();
        var org_id = select_org_id;
        SUNLINE.baseParams(c_store,{skey:skey,text:search_text,position:position,org_id:org_id});
        c_store.currentPage = 1;
        c_store.load();
    }
    /**公司添加 和  编辑**/
    /***   公司的基本信息的表单录入     ****/
    var pro_type_publish = SUNLINE.productType({
        id:'org_release',name:'release',fieldLabel:"产品类型",labelWidth:70,cls:'tcol12'
    });
    var basic_items=[
        {id:"org_id", name:"org_id", fieldLabel:"ID", xtype:'hidden',allowBlank:true},
        SUNLINE.OrgCombo({id:'org_pname',name:'org_pname',fieldLabel:"所属单位"},{valueField:'org_name',pageSize:20,labelWidth:70,labelAlign:'right'}),
        {id:"org_pid", name:"org_pid", fieldLabel:"父级ID", hidden:true, maxLength:"10",allowBlank:true},
        {id:"org_bh", name:"org_bh", fieldLabel:"<font color='red'>*</font> 编号", vtype:'alphanum', maxLength:"10",hidden:true,allowBlank:true},
        {id:"org_name", name:"org_name", fieldLabel:"<font color='red'>*</font> 单位名称",  maxLength:"50"},
        {id:"org_sname", name:"org_sname", fieldLabel:"单位简称", maxLength:"50",allowBlank:true},
        {id:"org_mapx", name:"org_mapx", fieldLabel:"经度", maxLength:"50",hidden:true,allowBlank:true},
        {id:"org_mapy", name:"org_mapy", fieldLabel:"纬度", maxLength:"50",hidden:true,allowBlank:true},
        {id:"org_addr", name:"org_addr", fieldLabel:"<font color='red'>*</font> 单位地址", maxLength:"100"/*,listeners:{'focus':selectAddr}*/},
        {id:"org_type",name:"org_type",fieldLabel:"<font color='red'>*</font> 单位类型",maxLength:"11",xtype:'combobox',queryParam:'org_type',editable:false,hidden:true,
            store:Ext.create('Ext.data.Store', {fields:['text','leaf'],
                proxy: {type: 'ajax',url: $__app__+'/Dict/typeCombo',reader: {type: 'json',rootProperty: 'data'}}
            }),
            displayField: 'text',valueField: 'text',emptyText:' 请选择单位类型 ',allowBlank: true
        },
        {id:"org_fare_type",name:"org_fare_type",fieldLabel:"票价类型",maxLength:"11",xtype:"combo",editable:false,triggerAction:"all",
            store:new Ext.data.SimpleStore({fields:['org_fare_type'],data:[['同行价'],['门市价'],['代理价']]}),
            displayField:"org_fare_type",valueField:"org_fare_type",mode:"local",forceSelection:true,typeAhead:true,value:"同行价"
        },
        {id:"org_service_tel",name:"org_service_tel",fieldLabel:"服务电话",allowBlank:true},
        {id:"org_fax",name:"org_fax",fieldLabel:"传真",allowBlank:true},
        SUNLINE.ComBoxCity({
            id:'org_province',
            where:{city_type:'province'},
            config:{fieldLabel:"<font color='red'>*</font> 省份",labelWidth:70,labelAlign:'right',forceSelection:true,editable:false, allowBlank:false,width:334,listeners:{
                select:function(){
                    if( Ext.getCmp('org_city_id').getValue() ) Ext.getCmp('org_city_id').setValue();
                    if( Ext.getCmp('org_county_id').getValue() ) Ext.getCmp('org_county_id').setValue();
                }
            },emptyText:'请选择省份'}
        }),
        SUNLINE.ComBoxCity({
            id:'org_city',
            where:{city_type:'city'},
            appTo:'org_province',
            config:{fieldLabel:"<font color='red'>*</font> 城市",labelWidth:70,labelAlign:'right',forceSelection:true,editable:false, allowBlank:false,width:334,listeners:{
                select:function(){
                    if( Ext.getCmp('org_county_id').getValue() ) Ext.getCmp('org_county_id').setValue();
                }
            },emptyText:'请选择城市'}
        }),
        SUNLINE.ComBoxCity({
            id:'org_county',
            where:{city_type:'county'},
            appTo:'org_city',
            config:{fieldLabel:"<font color='red'>*</font> 区/县",labelWidth:70,labelAlign:'right',forceSelection:true,editable:false, allowBlank:false,width:334,emptyText:'请选择区/县'}
        }),
        {id:"org_licence_code",name:"org_licence_code",fieldLabel:"营业执照",width:665,allowBlank:true},
        pro_type_publish,
        {
            id:'org_alone',
            xtype: 'fieldcontainer',
            fieldLabel: '结算类型',
            defaultType: 'radiofield',
            hidden: true,
            items: [
                {id: 'alone_true',width:90,boxLabel: '独立结算', name: 'org_alone', inputValue: '0',checked: true},
                {id: 'alone_false',width:100,boxLabel: '非独立结算', name: 'org_alone', inputValue: '1'}
            ]
        }
    ];

    function selectAddr(v,n,i){
        if(v.lastValue){
            var row = SUNLINE.getSelected(c_grid);
            ROW.basic=row.data;
        }else{
            ROW.basic = {};
            ROW.basic.org_mapx = '0.000000';
            ROW.basic.org_mapy = '0.000000';
        }
        mapWin.show();
        Ext.getCmp('mapSub').setText('保存');
        setTimeout(function(){
            var ifa=Ext.get('ifa').dom;
            ifa.style.display='';
            window.ifa.switchTab('地理信息',ROW,true);
        },1500)
        mapWin.on('hide',function(){
            if(typeof MapVal.str != 'undefined'){
                Ext.getCmp('org_addr').setValue(MapVal.str);
                Ext.getCmp('org_mapx').setValue(MapVal.X);
                Ext.getCmp('org_mapy').setValue(MapVal.Y);
            }
        })
    }
    Ext.getCmp('org_pname').on('select',function(t,r,i){
        var row=r[0].data;
        Ext.getCmp('org_pid').setValue(row.org_id);
        aloneShow(row.org_id);
    });
    /***    法人信息    ****/
    var legal_items=[
        {id:"org_legal", name:"org_legal", fieldLabel:"<font color='red'>*</font> 姓名",maxLength:"100"},
        {id:"org_mob", name:"org_mob", fieldLabel:"<font color='red'>*</font> 手机号码", vtype:'Mobile', maxLength:"11"},
        {id:"org_tel", name:"org_tel", fieldLabel:"联系电话",allowBlank:true},
        {id:"org_procedure", name:"org_procedure",allowBlank:true, fieldLabel:"<span class='help' data-qtip='票务公司需要用的到'>&nbsp;</span>手续费",hidden:true},
        {id:"org_intro", name:"org_intro", fieldLabel:"单位简介",maxLength:"600",xtype:'textarea',width:665,allowBlank:true}
    ];
    /**     基本信息的表单  ***/
    var form_basic=Ext.create('Ext.form.Panel',{
        bodyPadding: 5,id:'form',border:false,width: 700,cls:'basic_class',bodyStyle:"background:none;",
        defaults:{xtype:'fieldset',autoHeight:true,defaultType:'textfield',
            defaults:{allowBlank:false,labelAlign:'right',labelWidth:70}
        },
        items: [{title:'基本信息',cls:'tcol2',items:basic_items},{title:'负责人信息',cls:'tcol2',items:legal_items}]
    });
    /****     单位的基本信息的窗口   *****/
    var basicWin = Ext.create('Ext.window.Window',{
        title:'添加单位',
        closeAction:'hide',
        width: 750,
        modal:true,
        items: [form_basic],
        buttons:[
            {text:'提交',handler:basicSub},
            {text:'关闭',handler:function(){
                basicWin.hide();
            }}
        ]
    });

    if(_uinfo.org_type!='管理公司'){
        readonly_fn(true);
        pro_type_publish.setReadOnly(true);


    };
    /*非管理公司的单位管理编辑限制*/
    function readonly_fn(type){
        var read_data=['org_licence_code','org_pname','org_bh','org_name','org_sname','org_fare_type'];
        for(var ri= 0;ri<read_data.length;ri++){
            Ext.getCmp(read_data[ri]).setReadOnly(type);
        }
    };

    /*公司所在地投放城市(start)*/

    var positionWin=SUNLINE.PutCity({
        id:'position_search',
        old_val:Ext.getCmp('position_search').getValue(),
        url:$__app__ + '/Company/putCityJson',
        title:'公司所在地选择',

    },function(v){

        Ext.getCmp('position_search').setValue(v);
        var search_text=Ext.getCmp('search').getValue();
        var skey = Ext.getCmp('d_type').getValue();
        var position = Ext.getCmp('position_search').getValue();
        var org_id = company_box.getValue();
        SUNLINE.baseParams(c_store,{skey:skey,text:search_text,position:position});
        c_store.currentPage = 1;
        c_store.load();

    });

    Ext.getCmp('position_search').on({
        focus:function(e){
            if(_uinfo.org_type=='管理公司'){
                positionWin.show(e.id);
            }
        }
    });


    /*公司所在地投放城市(end)*/
    /*选择投放城市(start)*/
    //var attrWin=SUNLINE.PutCity({
    //    id:'org_apply_city_1',
    //    old_val:Ext.getCmp('org_apply_city_1').getValue()
    //},function(v){
    //    Ext.getCmp('org_apply_city_1').setValue(v);
    //});

    //Ext.getCmp('org_apply_city_1').on({
    //    focus:function(e){
    //        if(_uinfo.org_type=='管理公司'){
    //            attrWin.show(e.id);
    //        }
    //    }
    //});
    //
    window.sarea_val_fn=function(e){
        return Ext.getCmp(e).getValue();
    };
    //
    //Ext.getCmp('org_type').on({
    //    select:function(c,r){
    //        var rows= r[0].data;
    //        if(rows.text=='供应商'){
    //            pro_type_publish.setHidden(false);
    //            Ext.getCmp('org_apply_city_1').setHidden(false);
    //        }else{
    //            pro_type_publish.setHidden(true);
    //            Ext.getCmp('org_apply_city_1').setHidden(true);
    //        }
    //    }
    //});
    /*选择投放城市(end)*/

    /***    判断是否选择单位信息     ***/
    function checkInfo(v,thisWin){
        var row = SUNLINE.getSelected(c_grid);
        if(row == null){
            Ext.Msg.alert('提示信息','请你选择你要'+v+'的单位！');
            return false;
        }
        ROW.basic=row.data;
        if(thisWin){
            thisWin.show();
        }
    }

    function aloneShow(org_id,org_alone_value){
        if(org_id > 0){
            Ext.getCmp('org_alone').setHidden(false);
        }else{
            Ext.getCmp('org_alone').setHidden(true);
        }

        if(org_alone_value == 1){
            Ext.getCmp('alone_true').setValue(0);
            Ext.getCmp('alone_false').setValue(1);
        }else{
            Ext.getCmp('alone_true').setValue(1);
            Ext.getCmp('alone_false').setValue(0);
        }
    }

    /**
     * @param type 1-添加操作，2-编辑操作
     */
    function aloneReadOnly(type) {
        if (type == 1) {
            Ext.getCmp('alone_true').setReadOnly(false);
            Ext.getCmp('alone_false').setReadOnly(false);
        } else {
            if (_uinfo.org_pid > 0) {
                Ext.getCmp('alone_true').setReadOnly(true);
                Ext.getCmp('alone_false').setReadOnly(true);
            } else {
                Ext.getCmp('alone_true').setReadOnly(false);
                Ext.getCmp('alone_false').setReadOnly(false);
            }
        }
    }

    /**   添加编辑方法  **/
    function modify(v){  //添加
        var _from=form_basic.getForm();
        ROW={};
        var org_type='';
        if(in_array(v.text,['添加分销商','添加供应商','添加管理公司'])!=-1){
            ROW={};
            Ext.getCmp('org_pname').setDisabled(false);
            aloneReadOnly(1);
            aloneShow(0);
            basicWin.show();
            _from.reset();
            SUNLINE.productTypeSetValues(pro_type_publish,'' );
            org_type=(v.text).replace(/添加/,'');
            Ext.getCmp('org_type').setValue(org_type);
        }else if(v.text=='编辑'){
            var row = SUNLINE.getSelected(c_grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选择需要编辑的单位!');
                return false;
            }
            row=row.data;
            if(_uinfo.org_type!='管理公司'){
                Ext.getCmp('org_pname').setDisabled(true);
            }
            aloneReadOnly(2);
            aloneShow(row.org_pid);
            basicWin.show();
            _from.reset();
            var com_box={org_province:row.org_province,org_city:row.org_city,org_county:row.org_county};
            com_box_val(com_box);
            _from.setValues(row);

            SUNLINE.productTypeSetValues(pro_type_publish,row.org_release );
            org_type=row.org_type;
        }
        //供应商需要有单位编号
        //分销商和管理公司不需要有
        if(org_type=='供应商'){
            pro_type_publish.setHidden(false);
            Ext.getCmp('org_bh').setHidden(false);
        }else{
            pro_type_publish.setHidden(true);
            Ext.getCmp('org_bh').setHidden(true);
        }
        /**添加公司 或 编辑公司 时  应该弹出一个窗口**/
    }

    function com_box_val(data){
        for(var di in data){
            Ext.getCmp(di+'_id').store.add({name:data[di]});
        }
    }

    /**     基本信息的窗口弹出时触发的函数   ***/
    /***    基本信息提交    ***/
    function basicSub(){
        var text_s='基本信息';
        var row=form_basic.getForm().getValues();
        if(!form_basic.getForm().isValid()){
            Ext.Msg.alert('友情提示','请把红色框填写完整');
            return false;
        }

        if(typeof ROW.basic != 'undefined'){
            row.org_mapx=ROW.basic.org_mapx;
            row.org_mapy=ROW.basic.org_mapy;
        }
        var y_row=row;
        doSave_success(row,'/Company/save',function(v){
            var rw=v.info;
            if(v.status){
                Ext.Msg.alert('友情提示',v.info.msg);
                basicWin.hide();
                c_store.load();
            }else{
                Ext.Msg.alert('友情提示',v.info.msg);
            }
        })
    }

    /*****      联系人的组件      ****/
    var link_items= [
        {id:"lk_id", name:"lk_id", fieldLabel:"ID",hidden:true},
        {id:"lk_org_id", name:"lk_org_id", fieldLabel:"所属单位ID",hidden:true},
        {id:"lk_name", name:"lk_name", fieldLabel:"姓名", maxLength:"100",allowBlank:false},
        {id:"lk_phone", name:"lk_phone", fieldLabel:"手机", vtype:'Mobile',maxLength:"100",allowBlank:false},
        {id:"lk_tel", name:"lk_tel", fieldLabel:"电话", maxLength:"100"},
        {id:"lk_fax", name:"lk_fax", fieldLabel:"传真", maxLength:"100"},
        {id:"lk_qq", name:"lk_qq", fieldLabel:"Q Q", maxLength:"100"},
        {id:"lk_job", name:"lk_job", fieldLabel:"职位", maxLength:"100"},
        {id:"lk_email", name:"lk_email", fieldLabel:"邮箱",vtype:'email', maxLength:"100"},
        {id:"lk_info", name:"lk_info", fieldLabel:"简介", maxLength:"200",xtype:'textarea',width:360}
    ];
    /****       联系人信息的表单   ****/
    var link_form=Ext.create('Ext.form.Panel',{
        bodyPadding: 10,autoScroll:true,cls:'basic_class',width: 407,
        items:[{defaultType: 'textfield',cls:'tcol2',
            defaults: {labelWidth:40,labelAlign:'right',xtype:'textfield'},
            items:link_items
        }
        ]
    })
    /****    添加联系人的窗口   ****/
    var linkWin = Ext.create('Ext.window.Window',{
        title:'添加联系人',
        closeAction:'hide',
        width: 435,
        height:300,
        modal:true,
        items: [link_form],
        buttons:[
            {text:'提交',handler:linkSub},
            {text:'关闭',handler:function(){
                linkWin.hide();
            }}
        ]
    })
    /****       添加联系人  *****/
    function addLink(v){
        checkInfo(v.text,linkWin);
    }

    /***        联系人窗口显示时触发的方法  ***/
    linkWin.on('show',function(){
        link_form.getForm().reset();
        getOther(ROW.basic,function(r,s){
            if(r.link_man != null){
                ROW.link_man= r.link_man;
                link_form.getForm().setValues(ROW.link_man[0]);
            }
        })
    })
    /*****   联系人信息提交   ****/
    function linkSub(){
        var text_s='联系人信息';
        Ext.getCmp('lk_org_id').setValue(ROW.basic.org_id);
        var row_link = link_form.getForm().getValues();
        if(!link_form.getForm().isValid()){
            Ext.Msg.alert('友情提示','请把红色框填写完整');
            return false;
        }
        doSave_success(row_link,'/LinkMan/save',function(v){
            var rw=v.info;
            if(v.status){
                Ext.Msg.alert('友情提示',rw.msg);
                ROW.link_man=[];
                ROW2.link_man=[];
                ROW.link_man[0]=row_link;
                ROW2.link_man[0]=row_link;
                linkWin.hide();
                c_store.load();
                Ext.getCmp('basic_info_id').setPressed(false);
                Ext.getCmp('attach_info_id').setPressed(false);
                Ext.getCmp('map_info_id').setPressed(false);
                Ext.getCmp('link_info_id').setPressed(true);
                window.infoIfr.switchTab(text_s,ROW2);
            }else{
                Ext.Msg.alert('友情提示','联系人信息保存失败或已存在，请重试');
            }
        })
    }
    /****       单位印章start     ******/
    function addSeal(){
        var row = SUNLINE.getSelected(c_grid);
        if(row == null){
            Ext.Msg.alert('提示信息','请你选择你要添加印章的单位！');
            return false;
        }
        SealWin.show();
        window.seal.location = $__app__+'/Company/basicInfo?id='+row.data.org_id+'&type=Seal';
    }
    var SealWin = Ext.create('Ext.window.Window',{
        title:'印章管理',
        closeAction:'hide',
        width: 400,
        minHeight:300,
        height:Ext.getBody().getHeight()-300,
        modal:true,
        html:'<iframe id="seal" name="seal" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>',
        buttons:[
            {text:'提交',handler:SealSub},
            {text:'关闭',handler:function(){
                SealWin.hide();
            }}
        ]
    });
    function SealSub(){
        var post_data=window.seal.Company_File();
        if(!post_data.org_id){
            Ext.Msg.alert('提示信息','缺少单位数据！');
            return false;
        }
        post_data.type='seal';
        Ext.MessageBox.confirm('友情提示','你确定要保存印章信息吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/Company/pic_save',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status == 1) {
                        c_store.load();
                        SealWin.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });
    }
    /****       单位印章end     ******/
    /****       添加附件的窗口     ******/
    var LogoWin = Ext.create('Ext.window.Window',{
        title:'管理附件',
        closeAction:'hide',
        width: 400,
        minHeight:500,
        height:Ext.getBody().getHeight()-50,
        modal:true,
        html:'<iframe id="ifal" name="ifal" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>',
        buttons:[
            {text:'提交',handler:LogoSub},
            {text:'关闭',handler:function(){
                LogoWin.hide();
            }}
        ]
    });

    /****      添加管理附件   ******/
    function addLogo(){
        var row = SUNLINE.getSelected(c_grid);
        if(row == null){
            Ext.Msg.alert('提示信息','请你选择你要添加附件的单位！');
            return false;
        }
        LogoWin.show();
        window.ifal.location = $__app__+'/Company/basicInfo?id='+row.data.org_id;
    }

    /****      提交附件信息     ****/
    function LogoSub(){
        var post_data=window.ifal.Company_File();
        if(!post_data.org_id){
            Ext.Msg.alert('提示信息','缺少单位数据！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','你确定要保存附件信息吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/Company/pic_save',
                params:post_data,
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status == 1) {
                        c_store.load();
                        LogoWin.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });
    }

    /*LogoWin.on('hide',function(){
     window.ifal.document.display = 'none';
     })*/
    /******     设置坐标的窗口 ******/
    var mapWin = Ext.create('Ext.window.Window',{
        title:'添加坐标',
        closeAction:'hide',
        width: 750,
        height:570,
        modal:true,
        html:'<iframe id="ifa" name="ifa" src="'+$__app__+'/Company/basicInfo" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>',
        buttons:[
            {text:'提交',id:'mapSub',handler:mapSub},
            {text:'关闭',handler:function(){
                mapWin.hide();
            }}
        ]
    });

    /*****     设置坐标 *****/
    function addMap(){
        var row = SUNLINE.getSelected(c_grid);
        if(row == null){
            Ext.Msg.alert('提示信息','请你选择你要设置坐标的单位！');
            return false;
        }
        ROW.basic=row.data;
        mapWin.show();
        Ext.getCmp('mapSub').setText('提交');
        setTimeout(function(){
            var ifa=Ext.get('ifa').dom;
            ifa.style.display='';
            window.ifa.switchTab('地理信息',ROW,true);
        },1500)
    }
    /****   设置坐标的提交方法***/
    function mapSub(){
        MapVal = window.ifa.getMapVal();
        var text = Ext.getCmp('mapSub').getText();
        if(text == '保存'){
            ROW.basic.org_mapx=MapVal.X;
            ROW.basic.org_mapy=MapVal.Y;
            ROW.basic.org_addr = MapVal.str;
            mapWin.hide();
        }else if(text == '提交'){
            var pra={org_id:ROW.basic.org_id,org_mapx:MapVal.X,org_mapy:MapVal.Y,org_addr:MapVal.str};
            doSave_success(pra,'/Company/save',function(v){
                var rw=v.info;
                if(v.status){
                    Ext.Msg.alert('友情提示',v.info.msg);
                    ROW.basic.org_mapx=MapVal.X;
                    ROW.basic.org_mapy=MapVal.Y;
                    ROW.basic.org_addr = MapVal.str;
                    ROW2.basic.org_mapx=MapVal.X;
                    ROW2.basic.org_mapy=MapVal.Y;
                    ROW2.basic.org_addr = MapVal.str;
                    mapWin.hide();
                    c_store.reload();
                    Ext.getCmp('basic_info_id').setPressed(false);
                    Ext.getCmp('attach_info_id').setPressed(false);
                    Ext.getCmp('map_info_id').setPressed(true);
                    Ext.getCmp('link_info_id').setPressed(false);
                    window.infoIfr.switchTab('地理信息',ROW2);
                }else{
                    Ext.Msg.alert('友情提示','地理信息保存失败，请重试');
                }
            })
        }
    }
    function del(){
        var row = SUNLINE.getSelected(c_grid);
        if(row==null){
            Ext.Msg.alert('友情提示','请选择你要删除的内容！');
            return;
        }
        var myMask = SUNLINE.LoadMask('数据处理中，请稍候...');
        myMask.show();
        Ext.Msg.confirm('友情提示','你确定要删除该内容？',function(v){
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Company/del',
                    params: {org_id:row.data.org_id},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info);
                            c_store.reload();
                        }
                        myMask.hide();
                    }
                })
            }
        })
    }


    /**开户模块*/
    var account_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {name:"org_id", fieldLabel:"org_id", maxLength:"10",xtype:"hidden"},
                    {name:"org_bh", fieldLabel:"单位编号",labelSeparator:'：',id:"a_org_bh", disabled:true},
                    {name:"org_name", fieldLabel:"单位名称",labelSeparator:'：', id:"a_org_name",disabled:true},
                    {name:"org_sname", fieldLabel:"单位简称",labelSeparator:'：',id:"a_org_sname", disabled:true},
                    {name:"org_licence_code", fieldLabel:"营业执照",labelSeparator:'：',allowBlank:true, maxLength:"50"},
                    {name:"org_remark", fieldLabel:"开户备注",labelSeparator:'：', maxLength:"50"}
                ]
            }
        ]
    });
    var account_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:account_form,
        buttons:[
            {text:'保存', handler:account_dosave},
            {text:'关闭', handler:function () {
                account_win.hide();
            },style:'margin-right:15px;'}
        ]
    })


    function account(v){
        var row = SUNLINE.getSelected(c_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要开户的单位');
            return false;
        }
        if(row.data.org_zt!='ok') {
            Ext.Msg.alert('友情提示','该单位还没有审核通过！');
            return false;
        }
        account_win.setTitle(v.text, v.iconCls);
        account_form.getForm().setValues(row.data);
        account_win.show();
    }

    function account_dosave(){
        var data = account_form.getForm().getValues();
        if (!account_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        }
        data.org_sname = Ext.getCmp('a_org_sname').getValue();
        data.org_name = Ext.getCmp('a_org_name').getValue();

        var myMask=new Ext.LoadMask(Ext.getBody().component, {target:account_win,msg:'数据提交中，请稍候...'});
        myMask.show();

        Ext.Ajax.request({
            url:$__app__ + '/Company/entity_account',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info);
                if (ret.status){
                    account_win.hide();
                    c_store.reload();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }


    /**结算设置模块*/
    var settle_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:10px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:340 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:260,labelAlign:"right" },
                items:[
                    {name:"org_id", fieldLabel:"org_id", maxLength:"10",xtype:"hidden"},
                    {name:"org_bh", fieldLabel:"单位编号",labelSeparator:'：',id:"settle_org_bh", disabled:true},
                    {name:"org_name", fieldLabel:"单位名称",labelSeparator:'：', id:"settle_org_name",disabled:true},
                    {name:"org_sname", fieldLabel:"单位简称",labelSeparator:'：',id:"settle_org_sname", disabled:true},
                    {name:"org_pay_rate", fieldLabel:"网银支付手续费率(%)",labelSeparator:'：',allowBlank:false,maxLength:5,emptyText:'按百分比填写，如填写0.3表示0.3%'},
                    {name:"org_scan_pay_rate", fieldLabel:"扫码支付手续费率(%)",labelSeparator:'：',allowBlank:false,maxLength:5,emptyText:'按百分比填写，如填写0.3表示0.3%'},
                    {xtype:'combobox',name:"org_settle_type", fieldLabel:"<span title='按付款日表示付款后即开始计算其结算日，按回团日表示出游回团后再计算其结算日'><i class='fa fa-question-circle'></i> 结算类型</span>",labelSeparator:'：',allowBlank:false,displayField: 'name',valueField: 'name',emptyText:'请选择结算类型',editable:false,
                        store:new Ext.data.Store({fields:['name'],data:SETTLETYPE})
                    },
                    {xtype:'combobox',name:"org_settle_days", fieldLabel:"<span title='系统内生成账单时间，与第三方提现T+N有区别，即实际提现到账时间为T+N1+N2，例如需次日即到账，则该项应设置为0，第三方处理还需要1天，即T+0+1天到账'><i class='fa fa-question-circle'></i> 结算周期</span>",labelSeparator:'：',allowBlank:false,displayField: 'name',valueField: 'name',emptyText:'请选择结算周期',editable:false,
                        store:new Ext.data.Store({fields:['name'],data:SETTLEDAYS})
                    },
                    {name:"org_settle_rate", fieldLabel:"<span title='即金豆云需要抽佣的比例，实际结算给供应商的金额=订单金额*(1-结算费率-手续费率)'><i class='fa fa-question-circle'></i> 结算费率(%)</span>",labelSeparator:'：',allowBlank:false, maxLength:5,emptyText:'按百分比填写，如填写1表示1%'}
                ]
            }
        ]
    });
    var settle_win= new Ext.Window({
        width:420,
        autoHeight:true,
        closeAction:'hide',
        resizable:false,
        modal:true,
        items:settle_form,
        buttons:[
            {text:'保存', handler:settle_dosave},
            {text:'关闭', handler:function () {
                settle_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    var adv_form=Ext.create('Ext.form.Panel',{
        border:false,
        bodyStyle:'background:none;padding:8px',
        items:[{
            defaults: {
                labelWidth:80,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:[
                {name:"org_id",xtype:'hiddenfield'},
                {name:"org_name",fieldLabel:"单位名称" ,readOnly:true,},
                {name:"org_groom",fieldLabel:"排名权重",emptyText:'----数值越大排名越靠前----'}
            ]
        }]
    })

    var setAdv_win =new Ext.Window({
        width:300,

        modal:true,
        closeAction:'hide',
        items:[adv_form],
        title:'广告排行设置',
        buttons:[

            {text:'保存', handler:adv_dosave},
            {text:'关闭', handler:function () {
                setAdv_win.hide();
            },style:'margin-right:15px;'}
        ]
    })

    function adv_dosave()
    {
        Ext.MessageBox.confirm('友情提示','你确定要保存权重信息吗？',function(y){
            if(y!='yes')return false;
            var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url:$__app__ + '/Company/groomSave',
                params:adv_form.getForm().getValues(),
                method:'POST',
                success:function (response, otps) {
                    myMask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.msg;
                    if (result.status == 1) {
                        c_store.load();
                        setAdv_win.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    myMask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        });

    }
    function setAdv(){
        var row = SUNLINE.getSelected(c_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要设置排序的单位');
            return false;
        }

        setAdv_win.data = {
            org_id : row.get('org_id'),
            org_name : row.get('org_name'),
            org_groom : row.get('org_groom')
        };

        setAdv_win.show();
    }
    setAdv_win.on('show', function(w){
        adv_form.getForm().setValues(setAdv_win.data);
    });



    function set_settle(v){
        var row = SUNLINE.getSelected(c_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要设置结算参数的单位');
            return false;
        }
        if(row.data.org_type=='分销商') {
            Ext.Msg.alert('友情提示','结算设置不开放给分销商！');
            return false;
        }
        settle_win.setTitle(v.text, v.iconCls);
        settle_form.getForm().setValues(row.data);
        settle_win.show();
    }

    function settle_dosave(){
        var data = settle_form.getForm().getValues();
        if (!settle_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        }

        if(isNaN(data.org_pay_rate) || data.org_pay_rate<0 || data.org_pay_rate>5){
            Ext.Msg.alert('友情提示','网银支付手续费率应为0-5的数字，即不能超过5%');
            return;
        }

        //if(isNaN(data.org_scan_pay_rate) || data.org_scan_pay_rate < 0.6){
        //    Ext.Msg.alert('友情提示','扫码支付手续费率不能低于0.6%');
        //    return;
        //}

        if(isNaN(data.org_settle_rate) || data.org_settle_rate<0 || data.org_settle_rate>20){
            Ext.Msg.alert('友情提示','结算费率应为0-20的数字，即不能超过20%');
            return;
        }
        if(parseFloat(data.org_pay_rate)+parseFloat(data.org_settle_rate)>100){
            Ext.Msg.alert('友情提示','支付手续费和结算费率相加不能超过100');
            return;
        }

        var myMask=new Ext.LoadMask({target:settle_win,msg:'数据提交中，请稍候...'});
        myMask.show();

        Ext.Ajax.request({
            url:$__app__ + '/Company/set_settle',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info);
                if (ret.status){
                    settle_win.hide();
                    c_store.reload();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }



    var rs_balance_form =Ext.create('Ext.form.Panel',{
        border:false,
        bodyStyle:'background:none;padding:8px',
        items:[{
            defaults: {
                labelWidth:80,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:[
                {id:"f_balance",fieldLabel:"付款账户" ,readOnly:true},
                {id:"s_balance",fieldLabel:"收款账户",readOnly:true}
            ]
        }]
    })


    var rs_balance_win = new Ext.Window({
        width:310,
        modal:true,
        closeAction:'hide',
        items:[rs_balance_form],
        title:'支付平台账户余额查询',
        buttons:[
            {text:'刷新',handler:function(){
                rs_balance('reload');
            }},
            {text:'关闭', handler:function () {
                rs_balance_win.hide();
            },style:'margin-right:15px;'}
        ]
    });

    function rs_balance(act){
        var row = SUNLINE.getSelected(c_grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择要查询的单位');
            return false;
        }
        if(act!='reload'){
            rs_balance_win.show();
        }
        var myMask=new Ext.LoadMask({target:rs_balance_win,msg:'查询进行中，请稍候...'});
        myMask.show();
        Ext.Ajax.request({
            url:$__app__ + '/Company/rs_balance',
            params:{id:row.data.org_id},
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                if (ret.code==200){
                    rs_balance_form.getForm().setValues(ret.balance);
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '查询失败！');
            }
        })
    }

    ziyo_log({ listeners : [{grid: c_grid, action:'Company', pk_id:'org_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [Panel]
    });


})