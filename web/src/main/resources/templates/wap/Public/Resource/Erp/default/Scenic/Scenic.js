




ORGTree.rootText = '所有景点';
ROW={};

Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    var thisTitle = "景点管理";

    /********************* 左边树 start *************************/
    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Scenic/treeJson'
        },
        root: {
            expanded: true,
            text:'所有分组',
            children:[
                { text: 'province', expanded: true, children: [
                    { text: 'city', leaf: true }
                ] }
            ]
        }
    });
    var left_tree = new Ext.tree.Panel({
        tbar : [
            "景点地区分布",
            "->",
            {
                text : '折叠',
                iconCls:"fa fa-bars",
                handler:function(b){
                    left_tree.collapseAll();
                }
            }
        ],
        region:'west',
        minWidth : 240,
        maxWidth : 350,
        style:'border-top:1px solid #009DDA;',
        width:260,
        store: tree_store,
        bodyBorder:true,
        split : {size:3},
        border:false,
        rootVisible: true
    });

    left_tree.on('select',function(t,r,c,tf){
        var key=r.data.text;
        if(key=='所有分组'){
            scenic_store.removeAll();
        }else{
            if(r.data.leaf){
                SUNLINE.baseParams(scenic_store,{sc_city:key});
            }else{
                SUNLINE.baseParams(scenic_store,{sc_province:key});
            }
            scenic_store.currentPage=1;
            scenic_store.load();
        }
    })

    /********************* 左边树 end *************************/


    /******************** 景点grid  start***************************/
    var url = $__app__ + '/Scenic/dataJson';
    var field = [
        {name:"sc_id"},
        {name:"sc_name"},
        {name:"sc_name_short"},
        {name:"sc_pym"},
        {name:"sc_cover"},
        {name:"sc_province"},
        {name:"sc_city"},
        {name:"sc_county"},
        {name:"sc_org_id"},
        {name:"sc_mapx"},
        {name:"sc_mapy"},
        {name:"sc_mapz"},
        {name:"sc_bintroduction"},
        {name:"sc_pic"},
        {name:"sc_address"},
        {name:"sc_telephone"},
        {name:"sc_opentime"},
        {name:"sc_attribute"},
        {name:"sc_status"},
        {name:"sc_dateline"},
        {name:"sc_spot_id"},
        {name:"sc_grades"},
        {name:"sc_destination"}
    ];
    var scenic_store = new SUNLINE.JsonStore(url, field,false);

    var class_combo=SUNLINE.DictComBox({id:'class',name:'class',labelAlign:"right",value:'全部景点等级',editable:true,forceSelection:true},{'d_type':'景点等级'});
    var class_store=class_combo.box.getStore();
    class_store.on('load',function(){
        this.add({d_type:'景点等级',d_text:'全部景点等级', d_status: "ok", d_recommend: "0"});
        Ext.getCmp('class').setValue('全部景点等级');
        SUNLINE.baseParams(class_store,{d_type:'景点等级'});
    })
    class_combo.box.on('select',function(c,r,n){
        var class_=Ext.getCmp('class').getValue('全部景点等级');
        if(class_=='全部景点等级')class_='';
        SUNLINE.baseParams(scenic_store,{sc_grades:class_},true);
        scenic_store.currentPage=1;
        scenic_store.load();
        price_store.removeAll();
        contact_store.removeAll();
    })

    var scenic_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        store:scenic_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有景点信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"sc_id", width:50, hidden:true},
            {header:"等级", dataIndex:"sc_grades", width:80},
            {header:"景点名称", dataIndex:"sc_name", width:180,renderer:function(v,i,r){
                var enid = r.get('sc_id');
                var url = $__app__+"/Scenic/one_scenic/sc_id/"+enid;
                return '<a href = "'+url+'" target = "_blank">'+v+'</a>';
            }},
            {header:"自定义目的地", dataIndex:"sc_destination", width:120},
            {header:"景区属性", dataIndex:"sc_type", width:120},
            {header:"景区排序", dataIndex:"sc_order", width:120},
            {header:"景点电话", dataIndex:"sc_telephone", width:120},
            {header:"封面图片", dataIndex:"sc_pic", width:120,renderer:formatPic}
        ],
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){
                scenic_store.reload();
                price_store.removeAll();
                contact_store.removeAll();
            }},
            '<b>景点等级 :</b>',
            class_combo.box,
            '->',
            '搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'scenic_dosearch_id',
                emptyText:'景点名称、拼音码、自定义目的地',
                width:200,
                onTriggerClick:function (e) {
                    scenic_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            scenic_dosearch();
                        }
                    }
                }
            }
        ]
    });

    function scenic_dosearch(){
        var key=Ext.getCmp('scenic_dosearch_id').getValue();
        SUNLINE.baseParams(scenic_store,{skey:key},true)
        scenic_store.load({params:{start:0,limit:pageSize}});
    }

    scenic_store.on('load',function(){
        contact_store.removeAll();
        price_store.removeAll();
    })

    scenic_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(left_tree);
        if(data==null || data.data.text=='所有分组'){
            return false;
        }
    })

    scenic_grid.on('select',function(i,v){
        var scenic_sc_id=v['data']['sc_id']
        SUNLINE.baseParams(price_store,{'sct_scenic':scenic_sc_id});
        price_store.load({params:{start:0,limit:20}});
        SUNLINE.baseParams(contact_store,{rc_type:'景点',rc_pid:scenic_sc_id});
        contact_store.load({params:{start:0,limit:20}});
    });


    var province_combo=SUNLINE.ComBoxCity({
        id:'sc_province',
        where:{city_type:'province'},
        items_type:true,
        config:{fieldLabel:"<span style='color:red'> * </span>省份",labelWidth:110,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('sc_city_id').getValue() ) Ext.getCmp('sc_city_id').setValue();
                if( Ext.getCmp('sc_county_id').getValue() ) Ext.getCmp('sc_county_id').setValue();
            }
        }}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'sc_city',
        where:{city_type:'city'},
        items_type:true,
        appTo:'sc_province',
        config:{fieldLabel:"<span style='color:red'> * </span>城市",labelWidth:110,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('sc_county_id').getValue() ) Ext.getCmp('sc_county_id').setValue();
            }
        }}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'sc_county',
        where:{city_type:'county'},
        items_type:true,
        appTo:'sc_city',
        config:{fieldLabel:"<span style='color:red'> * </span>区/县",labelWidth:110,labelAlign:'right',editable:false, allowBlank:false}
    })

    var sc_grades_combo=SUNLINE.DictComBox_false({id:'sc_grades_id',name:'sc_grades',fieldLabel:"<span style='color:red'> * </span>景点等级",labelWidth:110,labelAlign:"right",allowBlank:false},{'d_type':'景点等级'});
    var sc_type_combo=SUNLINE.DictComBox_false({id:'sc_type_id',name:'sc_type',fieldLabel:"<span style='color:red'> * </span>景区属性",labelWidth:110,labelAlign:"right",allowBlank:false},{'d_type':'景区属性'});


    var scenic_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:110,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {id:"sc_id", name:"sc_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"sc_org_id", name:"sc_org_id", fieldLabel:"编辑权限单位ID", maxLength:"10", xtype:"hidden"},
            {id:"sc_name", name:"sc_name", fieldLabel:"<span style='color:red'> * </span>景点名称", maxLength:"100",allowBlank:false,vtype:'NotBlank'},
            {id:"sc_name_short", name:"sc_name_short", fieldLabel:"景点简称", maxLength:"100"},
            {id:"sc_order", name:"sc_order", fieldLabel:"景点排序",xtype:'numberfield'},
            {id:"sc_telephone", name:"sc_telephone", fieldLabel:"景点电话", maxLength:"14"},
            sc_type_combo.box,
            province_combo,
            city_combo,
            county_combo,
            {id:"sc_destination", name:"sc_destination", fieldLabel:"<span style='color:red'> * </span><span class='help' data-qtip='可填写多个目的地使用\",\"隔开,用于前台显示'>&nbsp;</span>自定义目的地",allowBlank:false,tooltip:'欠款总额 = 未生成账单 + 已生成账单但未还款金额'},
            {name:"sc_address", fieldLabel:"详细地址"},
            {id:"sc_attribute",name:"sc_attribute",fieldLabel:"附加属性",maxLength:"1000",listeners:{'focus':function(t){attrWin.show(t.id)}}},
            {id:"sc_opentime", name:"sc_opentime", fieldLabel:"开放时间",blankText:"正确认格式:(6:00-20:00)"},
            sc_grades_combo.box,
            {xtype:'textarea',id:'sc_bintroduction',name:"sc_bintroduction", fieldLabel:"景点简介",labelWidth:110,labelAlign:"right"}
        ]
    });
    //新的DataView数据源
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "d_id","d_text","cls" ]
    });
    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });

    var attr_Store = SUNLINE.JsonStore($__app__ + '/Scenic/attr',['group','gname','data'],false);
    var attr_Store_is_load = false;
    attr_Store.on('load', function(store){
        //重构DataView的数据
        attr_Store_is_load = true;
        var data = [];
        store.each(function(record){
            var id = 'g_'+ record.get('group');
            var items = record.get('data');
            data.push({d_id:id, cls : 'group-wrap', d_text:record.get('gname')});
            Ext.each(items, function(item, index){
                var it  = {};
                it.cls = '';
                it.d_id = item.d_id;
                it.d_text = item.d_text;
                data.push(it);
            });
        });
        attr_store.loadData(data);
        setSelected();
    });
    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{d_id}">{d_text}</div>',
        '</tpl>'
    );
    var attrView = new Ext.view.View({
        store : attr_store,
        tpl : attrTpl,
        multiSelect : true,
        simpleSelect : true,
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        emptyText : '暂无自定义属性。',
        plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });

    var attrWin = new Ext.Window({
        title : '选择自定义属性',
        width : 640,
        height : 340,
        modal : true,
        layout : 'fit',
        cls : 'suntour_dataView',
        closeAction : 'hide',
        autoScroll : true,
        items: attrView,
        buttons : [
            {text:'确认选择', handler:getSelected},
            {text:'刷新', handler:function(){ attr_Store.reload(); }},
            {text:'取消', handler:function(){ attrWin.hide(); }}
        ]
    });
    attrWin.on('show',function(){
        var attrWinHeight = attrWin.getHeight();
        if(attrWinHeight > 500){
            attrWin.setHeight("500");
        };
        if(attrWinHeight < 100){
            attrWin.setHeight("200");
        };
        /* if (!attr_Store_is_load)*/ attr_Store.load();
    });

    function setSelected(){
        var v=Ext.getCmp('sc_attribute').getValue();
        if (v){
            var h = v.split(',');
            for (var i=0; i< h.length; i++){
                var index = attr_store.find('d_text', new RegExp('^' + h[i] + '$'));
                attrView.getSelectionModel().select(index, true);
            }
        }
    };

    function getSelected(){
        var h = attrView.getSelectedNodes(), sd=[];
        for (var i=0; i < h.length; i++){
            if(h[i].textContent!='景区类型')sd.push(h[i].textContent);
        };
        Ext.getCmp('sc_attribute').setValue(sd);
        attrWin.hide();
    };
    var scenic_win=new Ext.Window({
        width:400,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:scenic_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                scenic_win.hide();
            }}
        ]
    })

    scenic_win.on('show',function(){

        //Ext.getCmp('sc_grades_id').setValue('AAAAA');
        //Ext.getCmp('sc_type_id').setValue('常去景区');

    })
    var items_url = $__app__ + '/ResourceItem/dataJson';
    var items_field = [
        {name:"ri_id"},
        {name:"ri_title"},
        {name:"ri_pid"},
        {name:"ri_subject"},
        {name:"ri_show"},
        {name:"ri_remark"},
        {name:"ri_type"},
        {name:"ri_status"}
    ];
    var items_store = new SUNLINE.JsonStore(items_url, items_field,false);
    var items_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:items_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ri_id", dataIndex:"ri_id", width:180,hidden:true},
            {header:"ri_pid", dataIndex:"ri_pid", width:180,hidden:true},
            {header:"ri_type", dataIndex:"ri_type", width:180,hidden:true},
            {header:"标题", dataIndex:"ri_title", width:250},
            {header:"类型", dataIndex:"ri_subject", width:250}
        ],
        tbar : [
            {text:'添加', iconCls:'button-add',handler:items_modify},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:items_modify},
            '-',
            {text:'删除', iconCls:'button-del',handler:items_del},
            /*'-',
            {text:'相册', iconCls:'button-edit',handler:items_pic},*/
            '->',
            '搜索:',
            {
                xtype:'trigger',
                id:'items_dosearch_id',
                cls:'search-icon-cls',
                triggerCls:'x-form-search-trigger',
                emptyText:'服务名称',
                width:150,
                onTriggerClick:function (e) {
                    items_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            items_dosearch();
                        }
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:items_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有服务项目'
        })
    });
    var items_win=new Ext.Window({
        title:'服务项目管理',
        width:550,
        height:400,
        layout:'fit',
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[items_grid],
        buttons:[
            {text:'关闭', handler:function () {
                items_win.hide();
            }}
        ]
    })

    var ri_subject_combo=SUNLINE.DictComBox_false({name:'ri_subject',fieldLabel:"主题类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'景点主题类型'});
    var items_form = new Ext.form.FormPanel({
        border:false,
        autoHeight:true,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',width:200},
        items:[
            {id:"ri_id", name:"ri_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"ri_pid", name:"ri_pid", fieldLabel:"所属资源id", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"ri_type", name:"ri_type", fieldLabel:"类目类型", value:'景点',xtype:"hidden"},
            {id:"ri_title", name:"ri_title", fieldLabel:"标题", maxLength:"100", allowBlank:false},
            ri_subject_combo.box,
            {
                xtype: 'radiogroup',
                fieldLabel: '是否显示',
                labelWidth:80,
                labelAlign:"right",
                columns: 2,
                items: [
                    { boxLabel: '是', name: 'ri_show', inputValue: '是',checked: true},
                    { boxLabel: '否', name: 'ri_show', inputValue: '否'},
                ]
            },
            {name:"ri_remark", fieldLabel:"服务说明", xtype:'textarea', height:60,width:200}
        ]
    });
    var items_form_win=new Ext.Window({
        title:'服务项目',
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:[items_form],
        buttons:[
            {text:'保存', handler:items_dosave},
            {text:'关闭', handler:function () {
                items_form_win.hide();
            }}
        ]
    })
    var subject_num=1;
    items_form_win.on('show',function(){
        if(subject_num==1) ri_subject_combo.box.getStore().load();
        subject_num++;
    })
    items_form_win.on('hide',function(){
        items_form.form.reset();
    })

    scenic_win.on('hide',function(){
        scenic_form.form.reset();
    })


    /******************** 景点grid  end ***************************/

    /******************** 价格策略  start ************************/
    var price_field = [
        {name:"rp_id"},
        {name:"rp_name"},
        {name:"rp_retail"},
        {name:"rp_peer"},
        {name:"rp_price_peer"},
        {name:"rp_price_retail"},
        {name:"rp_price_sales"},
        {name:"rp_price_settle"},
        {name:"rp_price_refund"},
        {name:"rp_payment"},
        {name:"rp_resources_id"},
        {name:"rp_resources_type"},
        {name:"rp_org_id"},
        {name:"rp_desc"}
    ];

    var price_storeUrl = $__app__ + '/ScenicTickets/scenictickets';
    var price_store = new SUNLINE.JsonStore(price_storeUrl, price_field,false);

    var price_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store:price_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有景点票价信息',
            deferEmptyText:true
        },
        tbar : [
            '<b>价格策略</b>:',
            {text:'添加', iconCls:'button-add',handler:price_modify, disabled:isDisabled('ScenicTickets::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:price_modify, disabled:isDisabled('ScenicTickets::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:price_del, disabled:isDisabled('ScenicTickets::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){
                price_store.reload()
            }},
            '-'
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"sct_id", width:50, hidden:true},
            {header:"rp_org_id", dataIndex:"sct_org_id", width:50, hidden:true},
            {header:"票价名称", dataIndex:"sct_name", width:150},
            {header:"类型", dataIndex:"sct_type", width:80},
            {header:"挂牌价", dataIndex:"sct_price", width:80},
            {header:"结算价", dataIndex:"sct_price_settle", width:80},
            {header:"特殊票", dataIndex:"sct_limit", width:80},
            {header:"周几有效", dataIndex:"sct_week", width:150,renderer:SUNLINE.weekRenderer},
            {header:"有效期起", dataIndex:"sct_start_date", width:120,renderer:time_sct_start_date},
            {header:"有效期止", dataIndex:"sct_end_date", width:120,renderer:time_sct_end_date}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:price_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有价格信息'
        })
    });
    function time_sct_start_date(v,m,r){
        return r.get('sct_start_date').substr(0,4) + '-' + r.get('sct_start_date').substr(4,2) + '-' + r.get('sct_start_date').substr(6,2) ;
    }
    function time_sct_end_date(v,m,r){
        return r.get('sct_end_date').substr(0,4) + '-' + r.get('sct_end_date').substr(4,2) + '-' + r.get('sct_end_date').substr(6,2) ;
    }

    var rt_ticket_type_combo=SUNLINE.DictComBox_false({id:'sct_type_id',name:'sct_type',fieldLabel:"<span style='color:red'> * </span>票价类型",width:280,labelWidth:80,labelAlign:"right",allowBlank:false,editable:true,forceSelection:false},{'d_type':'景点门票类型'});
    var rt_limit_condition=new Ext.form.TextField({id:"sct_limit_condition",labelAlign:'right',labelWidth:80,width:280,name:"sct_limit_condition",fieldLabel:'<span class="help" data-qtip="实名票:必须填写身份证<br>限制性别:只能输入男或女<br>限制年龄:只能输入正整数、<正整数、正整数，如：>10、<10、8-10">&nbsp;</span>特殊规则',disabled:true});
    var rt_limit_type_combo=SUNLINE.DictComBox_false({id:'sct_limit_id',name:'sct_limit',allowBlank:false,fieldLabel:"<span style='color:red'> * </span>特殊名称",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'票种限制'});
    rt_limit_type_combo.box.on('collapse', function(_t){
        var tv = _t.getValue();
        if(tv=='限制性别'){
            rt_limit_condition.setDisabled(false);
            rt_limit_condition.allowBlank = false;
            rt_limit_condition.regex=/^男$|^女$/;
            rt_limit_condition.regexText ='只能输入男或女，请注意前后的空格。';
        }else if( tv=='限制年龄'){
            rt_limit_condition.setDisabled(false);
            rt_limit_condition.allowBlank=false;
            rt_limit_condition.regex =/^<+?[1-9][0-9]*$|^>+?[1-9][0-9]*$|^\d+-[1-9][0-9]*$/;
            rt_limit_condition.regexText ='只能输入“<正整数 或 >正整数 或 正整数-正整数”，如<10、>10、10-20等';
        }else{
            rt_limit_condition.setDisabled(true);
            rt_limit_condition.allowBlank=true;
            rt_limit_condition.regex = '';
            rt_limit_condition.regexText = '';
            rt_limit_condition.setValue( '' );
        }
    });

    var rt_weekly= SUNLINE.weekCheckboxGroup({
        width:400,
        id:'sct_week',
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'sct_week',
        config:{labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side'}
    });
    var sct_payment_dict=SUNLINE.DictComBox_false({id:'sct_payment_id',name:'sct_payment',fieldLabel:"<span style='color:red'> * </span>结算方式",labelWidth:80,labelAlign:"right",allowBlank:false,value:'现金'},{'d_type':'支付方式'});
    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"sct_id", fieldLabel:"ID",xtype:"hidden"},
                    {name:"sct_scenic", fieldLabel:"景点ID",xtype:"hidden"},
                    {name:"sct_name", fieldLabel:"<span style='color:red'> * </span>票价名称",allowBlank:false,vtype:'NotBlank'},
                    rt_ticket_type_combo.box,
                    {name:"sct_price_settle", fieldLabel:"<span style='color:red'> * </span>结算价格", xtype:'numberfield',allowBlank:false,vtype:'NotBlank'},
                    {name:"sct_price", fieldLabel:"挂牌价格", xtype:'numberfield'},
                    {name:"sct_refund", fieldLabel:"退票价格", xtype:'numberfield'},
                    {name:"sct_commission", fieldLabel:"佣金", xtype:'numberfield',value:0},
                    rt_limit_type_combo.box,
                    rt_limit_condition,
                    SUNLINE.ExtDateField({id:'sct_start_date',name:'sct_start_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:280,gang:'sct_end_date',start:true}),
                    SUNLINE.ExtDateField({id:'sct_end_date',name:'sct_end_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:280,gang:'sct_start_date'}),
                    sct_payment_dict.box
                ]
            },
            rt_weekly,
            {xtype:'textfield',id:'sct_items_name',name:"sct_items_name", fieldLabel:"消费项目",labelWidth:80,width:560,labelAlign:"right",
                listeners:{'focus':items_choose_show}},
            {xtype:'hidden',id:'sct_items_id',name:"sct_items_id"},
            {name:"sct_explain", fieldLabel:"票价说明", xtype:'textarea', labelWidth:80,height:60,width:560,labelAlign:"right"}
        ]
    });
    var price_form_win=new Ext.Window({
        width:600,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:price_form,
        buttons:[
            {text:'保存', handler:price_dosave},
            {text:'关闭', handler:function () {
                price_form_win.hide();
            }}
        ]
    })
    rt_ticket_type_num=1;
    price_form_win.on('show',function(){
        if(rt_ticket_type_num==1){
            rt_ticket_type_combo.box.getStore().load();
            rt_limit_type_combo.box.getStore().load();
            sct_payment_dict.box.getStore().load();
        }
        Ext.getCmp('sct_type_id').setValue('成人票')
        Ext.getCmp('sct_limit_id').setValue('实名票')
        Ext.getCmp('sct_payment_id').setValue('现金')
        rt_ticket_type_num++;
    })

    price_form_win.on('hide',function(){
        price_form.form.reset();
    })

    var items_choose_store = new SUNLINE.JsonStore(items_url, items_field,false);
    var items_choose_grid=new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:items_choose_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务项目',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"标题", dataIndex:"ri_title", width:180},
            {header:"类型", dataIndex:"ri_subject", width:180},
            {header:"是否显示", dataIndex:"ri_show", width:60}
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
                emptyText:'景点、拼音码',
                width:150,
                id:'items_choose_dosearch_id',
                onTriggerClick:function (e) {
                    items_choose_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            items_choose_dosearch();
                        }
                    }
                }
            }
        ]
    });


    function items_dosearch(){
        var key=Ext.getCmp('items_dosearch_id').getValue();
        var row=SUNLINE.getSelected(scenic_grid);
        var items_sc_id=row.get('sc_id');
        SUNLINE.baseParams(items_store,{skey:key,ri_pid:items_sc_id,ri_type:'景点'});
        items_store.load({params:{start:0,limit:pageSize}});
    }

    function items_choose_dosearch(){
        var key=Ext.getCmp('items_choose_dosearch_id').getValue();
        var row=SUNLINE.getSelected(scenic_grid);
        var items_sc_id=row.get('sc_id');
        SUNLINE.baseParams(items_choose_store,{skey:key,ri_pid:items_sc_id,ri_type:'景点',limit:1000});
        items_choose_store.currentPage=1;
        items_choose_store.load();
    }

    var items_choose_win=new Ext.Window({
        title:'消费项目',
        width:550,
        height:400,
        resizable:false,
        closeAction:'hide',
        modal:true,
        items:[items_choose_grid],
        buttons:[
            {text:'确定',handler:function(){
                var rows=items_choose_grid.getSelectionModel().getSelection();
                var temp_id='';
                var temp_name='';
                for(var i=0;i<rows.length;i++){
                    temp_id+=rows[i]['data']['ri_id']+',';
                    temp_name+=rows[i]['data']['ri_title']+',';
                }
                temp_id=temp_id.substr(0,temp_id.length-1);
                temp_name=temp_name.substr(0,temp_name.length-1);
                Ext.getCmp('sct_items_id').setValue(temp_id);
                Ext.getCmp('sct_items_name').setValue(temp_name);
                items_choose_win.hide();
            }},
            {text:'关闭', handler:function (){
                items_choose_win.hide();
            }}
        ]
    })

    /******************** 价格策略  end **************************/


    /******************** 联系人 start ***************************/
    var contact_field = [
        {name:"rp_id"},
        {name:"rp_name"},
        {name:"rp_retail"},
        {name:"rp_peer"},
        {name:"rp_price_peer"},
        {name:"rp_price_retail"},
        {name:"rp_price_sales"},
        {name:"rp_price_settle"},
        {name:"rp_price_refund"},
        {name:"rp_payment"},
        {name:"rp_resources_id"},
        {name:"rp_resources_type"},
        {name:"rp_org_id"},
        {name:"rp_desc"}
    ];

    var contact_storeUrl = $__app__ + '/ResourceContact/dataJson';
    var contact_store = new SUNLINE.JsonStore(contact_storeUrl, contact_field, false);
    var contact_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'south',
        height:200,
        style:'border-top:1px solid #009DDA',
        store:contact_store,
        autoScroll : true,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有联系人信息',
            deferEmptyText:true
        },
        tbar : [
            {text:'添加', iconCls:'button-add',handler:contact_modify, disabled:isDisabled('ResourceContact::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:contact_modify, disabled:isDisabled('ResourceContact::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:contact_del, disabled:isDisabled('ResourceContact::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){contact_store.reload();}},
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"id", dataIndex:"rc_id", width:10,hidden:true},
            {header:"rc_pid", dataIndex:"rc_pid", width:10,hidden:true},
            {header:"联系人", dataIndex:"rc_name", width:80},
            {header:"职位", dataIndex:"rc_job", width:80},
            {header:"手机", dataIndex:"rc_mobile", width:120},
            {header:"座机", dataIndex:"rc_tel", width:110},
            {header:"传真", dataIndex:"rc_fax", width:110},
            {header:"邮箱", dataIndex:"rc_email", width:110},
            {header:"是否显示", dataIndex:"rc_show", width:90},
            {header:"QQ", dataIndex:"rc_qq", width:80},
            {header:"微信号", dataIndex:"rc_weixin", width:80}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:contact_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有联系人信息'
        })
    });
    var sp_type_all_dict=SUNLINE.DictComBox({id:'rc_job',name:'rc_job',fieldLabel:"<span style='color:red'> * </span>职位",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'员工职位'});
    var contact_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"rc_id", fieldLabel:"id",hidden:true},
                    {name:"rc_type",value:'景点',hidden:true},
                    {name:"rc_pid", fieldLabel:"rc_pid",hidden:true},
                    {name:"rc_name", fieldLabel:"<span style='color:red'> * </span>联系人",allowBlank:false,vtype:'NotBlank'},
                    sp_type_all_dict.box,
                    {name:"rc_mobile", fieldLabel:"<span style='color:red'> * </span>手机",vtype:'Mobile'},
                    {name:"rc_tel", fieldLabel:"电话"},
                    {name:"rc_fax", fieldLabel:"传真"},
                    {name:"rc_email", fieldLabel:"邮箱",vtype:'email'},
                    {name:"rc_qq", fieldLabel:"QQ"},
                    {name:"rc_openid", fieldLabel:"微信号"},
                    {
                        labelWidth:80,
                        labelAlign:"right",
                        style:'margin-top:5px;',
                        name:"rc_show",
                        fieldLabel:"是否显示",
                        xtype:"combo",
                        editable:false,
                        triggerAction:"all",
                        store:new Ext.data.SimpleStore({
                            fields:['combo_value'],
                            data:[
                                ['是'],
                                ['否']
                            ]
                        }),
                        displayField:"combo_value",
                        valueField:"combo_value",
                        mode:"local",
                        forceSelection:true,
                        typeAhead:true,
                        value:"是"
                    }
                ]
            },
            {xtype:'textarea',id:'rc_remark',name:"rc_remark", fieldLabel:"简介",labelWidth:80,width:560,labelAlign:"right"},
        ]
    });
    var contact_form_win=new Ext.Window({
        width:600,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:contact_form,
        buttons:[
            {text:'保存', handler:contact_dosave},
            {text:'关闭', handler:function () {
                contact_form_win.hide();
            }}
        ]
    })

    contact_store.on('beforeload',function(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            return false;
        }
    })
    contact_form_win.on('hide',function(){
        contact_form.form.reset();
    })
    /******************** 联系人 end *****************************/

    /******************** 相册  start ***************************/
    var pic_win=new Ext.Window({
        width:650,
        height:400,
        closeAction:'hide',
        modal:true,
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>',
    })
    /******************** 相册  end ***************************/

    var right_panel = new Ext.panel.Panel({
        border : false,
        style:'border-left:1px solid #009DDA ',
        split : {size:3},
        region : 'east',
        width:500,
        minWidth : 400,
        maxWidth : 600,
        layout :'border',
        items : [price_grid, contact_grid]
    });


    var left_panel=new Ext.panel.Panel({
        border : false,
        split : {size:3},
        region : 'center',
        layout :'border',
        tbar: [
            {text:'添加', iconCls:'button-add',handler:scenic_modify, disabled:isDisabled('Scenic::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:scenic_modify, disabled:isDisabled('Scenic::save')},
            '-',
            {text:'编辑景点详情', iconCls:'button-edit',handler:detail_modify},
            '-',
            {text:'删除', iconCls:'button-del',handler:scenic_del, disabled:isDisabled('Scenic::del')},
            '-',
            {text:'地图', iconCls:'button-edit',handler:editMap, disabled:isDisabled('Plugs::plugs')},
            '-',
            {text:'图片管理', iconCls:'button-edit',handler:scenic_pic, disabled:isDisabled('Pic::index')},
            '-',
            {text:'服务项目', iconCls:'button-add',handler:items_view, disabled:isDisabled('ResourceItem::save')},
            '-',
            {text:'更新产品', iconCls:'button-edit',handler:update_product, disabled:isDisabled('Scenic::updateProduct')},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:scenic_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有景点信息'
        }),
        items : [left_tree,scenic_grid]
    });

    new Ext.Viewport({
        layout:'border',
        items:[left_panel,right_panel]
    });
    var sc_grades_num=1;
    function scenic_modify(v){
        if(v.text == '编辑'){
            if(sc_grades_num==1){
                sc_grades_combo.box.getStore().load();
                sc_type_combo.box.getStore().load();
            }
            sc_grades_num++;
            var row=SUNLINE.getSelected(scenic_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
                return false;
            }
        };
        scenic_win.setTitle(v.text + '景点信息');
        scenic_win.show(v.id);
        if(v.text == '编辑'){
            scenic_form.form.setValues(row.data);
        }
    }

    function scenic_pic(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/景点/table_id/'+row.data.sc_id;
    }

    function scenic_del(v){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该景点吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Scenic/save',
                    params:{sc_id:row.data.sc_id,sc_status:'删除'},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功！');
                        if(result.status ==1){
                            scenic_store.reload();
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

    function items_view(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
            return false;
        }
        items_win.show();
        SUNLINE.baseParams(items_store,{'ri_pid':row.data.sc_id,'ri_type':'景点'});
        items_store.load({params:{start:0,limit:20}});
    }

    function update_product(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
            return false;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Scenic/updateProduct',
            method:'GET',
            params : {sc_id:row.data.sc_id},
            success : function(response, opts){
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                Ext.Msg.alert('友情提示',ret.msg);
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    function items_modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(items_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的服务项目！');
                return false;
            }
        }
        items_form_win.setTitle(v.text+'服务项目');
        items_form_win.show();
        if(v.text=='编辑'){
            items_form.form.setValues(row.data);
        }else{
            var scenic_row=SUNLINE.getSelected(scenic_grid);
            items_form.form.setValues({ri_pid:scenic_row.data.sc_id});
        }
    }
    function items_pic(){
        var row=SUNLINE.getSelected(items_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点服务项目！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/景点类目/table_id/'+row.data.ri_id;
    }

    function items_del(){
        var row=SUNLINE.getSelected(items_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的服务项目！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该服务项目吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/ResourceItem/del',
                    params:{ri_id:row.data.ri_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            items_store.reload();
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

    function items_dosave(){
        if(!items_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=items_form.getForm().getValues();
                Ext.Ajax.request({
                    url : $__app__ + '/ResourceItem/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            items_store.reload();
                            items_form_win.hide();
                        };

                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        });
    }

    function price_modify(v){
        var hotel_row=SUNLINE.getSelected(scenic_grid);
        if(v.text=='添加') {
            if (hotel_row == null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
                return false;
            }
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(price_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的票价信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text+'价格信息');
        price_form_win.show();
        if(v.text=='编辑'){
            if(row.data.sct_start_date.indexOf("-")<=0){
                row.data.sct_start_date=row.data.sct_start_date.substr(0,4) + '-' + row.data.sct_start_date.substr(4,2) + '-' + row.data.sct_start_date.substr(6,2) ;
            }
            if(row.data.sct_end_date.indexOf("-")<=0){
                row.data.sct_end_date=row.data.sct_end_date.substr(0,4) + '-' + row.data.sct_end_date.substr(4,2) + '-' + row.data.sct_end_date.substr(6,2) ;
            }


            price_form.form.setValues(row.data);
            sb_weekly_id=row.get('sct_week');
            SUNLINE.weekSetValues(rt_weekly,sb_weekly_id );
        }
        price_form_win.setTitle(v.text+"景点票价", v.iconCls);
    }

    function price_del(){
        var row=SUNLINE.getSelected(price_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要删除的票种信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该票种信息吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/ScenicTickets/del',
                    params:{sct_id:row.data.sct_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',result.info);
                        if(result.status ==1){
                            price_store.reload();
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


    function price_dosave(){
        if (!price_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(scenic_grid);
        var s = price_form.getForm().getValues();
        s['sct_scenic']=row.get('sc_id');
        Ext.Ajax.request({
            url:$__app__ + '/ScenicTickets/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    price_store.reload();
                    price_form_win.hide();
                    Ext.getCmp('sct_limit_condition').setDisabled(true);
                };

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }


    function items_choose_show(){
        var row=SUNLINE.getSelected(scenic_grid);
        if (!row){
            Ext.Msg.alert('友情提示', '没有指定的景点');
            return false;
        };
        items_choose_store.load({params:{'ri_pid':row.data.sc_id,'ri_type':'景点',limit:1000}});
        items_choose_win.show();
    }

    items_choose_store.on('load',function(){
        var rt_items_id=Ext.getCmp('sct_items_id').getValue();
        if(rt_items_id==''){

        }else{
            rt_items_id=','+rt_items_id+',';
            var count=items_choose_store.getCount();
            var select_array=[];
            for(var index=0;index<count;index++){
                var record=items_choose_store.getAt(index);
                if(rt_items_id.search(','+record['data']['ri_id']+',')>=0){
                    select_array.push(record);
                }
            }
            if(select_array.length>0){
                items_choose_grid.getSelectionModel().select(select_array);
            }
        }
    })
    function contact_modify(v){
        var scenic_row=SUNLINE.getSelected(scenic_grid);
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(contact_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的联系人信息！');
                return false;
            }
        }else{
            if(scenic_row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的景点信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text + '联系人信息');
        contact_form_win.show();
        if(v.text=='编辑'){
            contact_form.form.setValues(row.data);
        }else{
            var data={};
            data['rc_pid']=scenic_row.data.ht_id;
            contact_form.form.setValues(data);
        }

    }

    function contact_del(){
        var row=SUNLINE.getSelected(contact_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的联系人信息！');
            return false;
        }

        Ext.MessageBox.confirm('友情提示','确定删除该联系人吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/ResourceContact/save',
                    params:{rc_id:row.data.rc_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            contact_store.reload();
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

    function contact_dosave(){
        if(!contact_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=contact_form.getForm().getValues();
                var scenic_data=SUNLINE.getSelected(scenic_grid);
                data['rc_pid']=scenic_data.get('sc_id');
                data['rc_type']='景点';
                Ext.Ajax.request({
                    url : $__app__ + '/ResourceContact/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            contact_store.reload();
                            contact_form_win.hide();
                        };

                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        });
    }

    var detail_win=new Ext.Window({
        title:'编辑景点详情',
        width:1020,
        height:Ext.getBody().getHeight()-50,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        maximizable : true,//全屏效果
        html:'<iframe  style="border:none;width:100%;height:100%" name="detail_text_iframe" id="detail_text_iframe"></iframe>',
        buttons:[
            {text:'保存', handler:detail_dosave},
            {text:'关闭', handler:function () {
                detail_win.hide();
            }}
        ]
    })
    function detail_dosave(){
        var row=SUNLINE.getSelected(scenic_grid);
        var data=window.detail_text_iframe.save_data();
        data['sc_id']=ROW.sc_id;
        data['info']=Ext.encode(data['info']);
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
        myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Scenic/save_detail',
            method:'POST',
            params : data,
            success : function(response, opts){
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    detail_win.hide();
                    tree_store.reload();
                    scenic_store.reload();
                };

            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })

    }
    detail_win.on('hide',function(){
        scenic_store.currentPage=1;
        scenic_store.load();
        ROW.sc_id='';
    })
    detail_win.on('show',function(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(!ROW.sc_id){
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的景点！');
                return false;
            }else{
                ROW.sc_id=row.data.sc_id;
            }
        }
        window.detail_text_iframe.location=$__app__+'/Scenic/scenic_detail/sc_id/'+ROW.sc_id;
    })
    function detail_modify(){
        var row=SUNLINE.getSelected(scenic_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点！');
            return false;
        }
        detail_win.show();
    }
    function dosave(){
        if(!scenic_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=scenic_form.getForm().getValues();
                Ext.Ajax.request({
                    url : $__app__ + '/Scenic/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        scenic_win.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            ROW.sc_id=info.sc_id;
                            Ext.MessageBox.confirm('友情提示',info.msg+',稍后请更新产品,您需要继续编辑该景区详情么？',function(v){
                                if(v=='yes'){
                                    detail_win.show();
                                }else{
                                    tree_store.reload();
                                    scenic_store.reload();
                                }})

                        };

                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            }
        });
    }

    function formatPic(v,m,r){
        var sc_cover = r.get("sc_cover");
        if(sc_cover!=''){
            sc_cover=$app_root+sc_cover;
            return "<img style='height: 20px;' src='" + sc_cover + "' qtip='<img src=\"" + sc_cover + "\">'>";
        }else{
            return '';
        }
    };

    /***************** 地图 start ********************/
    var map_win = new Ext.Window({
        title : '地理信息',
        width :700,
        height: 400,
        closeAction : 'hide',
        modal : true,
        resizable : false,
        tbar : [
            '搜索:',{
                xtype : 'trigger',
                id:'map_search',
                width:180,
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                onTriggerClick:function(e){
                    try{
                        var key = Ext.getCmp('map_search').getValue();
                        window.ifm_map.search_local(key)
                    }catch(e){}
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            try{
                                var key = _t.getValue();
                                window.ifm_map.search_local(key)
                            }catch(e){}
                        }
                    }
                }
            },
            //{text:'刷新',handler:function(){window.ifm_map.location.reload();}},
            '->',
            '', { xtype : 'hidden', id:'cityName', width : 90, readOnly:true },
            '经度:', { xtype : 'textfield', id:'map_lng', width : 70, readOnly:true },
            '&nbsp; 纬度:', { xtype : 'textfield', id:'map_lat', width : 70, readOnly:true },
            '&nbsp; 大小:', { xtype : 'numberfield', id : 'map_size', width : 40, readOnly:true },
            {text:'保存', iconCls:'button-save',handler:saveMapInfo}
        ],
        html:'<iframe id="ifm_map" name="ifm_map" src="" width="100%" height="100%" frameborder=0></iframe>'
    });

    function editMap(b){
        var row=SUNLINE.getSelected(scenic_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的景点');
            return;
        };
        ROW.id=row.data.sc_id;
        ROW.mapx=row.data.sc_mapx;
        ROW.mapy=row.data.sc_mapy;
        ROW.mapz=row.data.sc_mapz;
        map_win.show();
    }

    map_win.on('show', function(w){
        Ext.getCmp('map_search').setValue(ROW.addr);
        var map_lng = Ext.getCmp('map_lng');        var map_lat = Ext.getCmp('map_lat');
        var map_size = Ext.getCmp('map_size');
        var cityName = Ext.getCmp('cityName');
        map_size.setValue(''); map_lat.setValue(''); map_lng.setValue(''); cityName.setValue('');
        if (ROW.mapx) {map_lng.setValue(ROW.mapx)};
        if (ROW.mapy) {map_lat.setValue(ROW.mapy)};
        if (ROW.mapz) {map_size.setValue(ROW.mapz)};
        var url = $__app__ + '/Plugs/plugs?_dc=' + time();
        window.ifm_map.location = url;
    });

    function saveMapInfo(){
        var lng = Ext.getCmp('map_lng').getValue(),
            lat = Ext.getCmp('map_lat').getValue(),
            size = Ext.getCmp('map_size').getValue();
        if(!lng){
            Ext.Msg.alert('友情提示','请您点击地图选择位置！');
            return;
        }
        var _myMask=SUNLINE.LoadMask('正在保存单位地理信息，请稍候...');
        _myMask.show();
        var row=SUNLINE.getSelected(scenic_grid);
        Ext.Ajax.request({
            url: $__app__ + '/Scenic/save',
            params: { sc_id:ROW.id, sc_mapx:lat, sc_mapy:lng, sc_mapz:size},
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    Ext.Msg.alert( '友情提示',$rst.info.msg);
                    if ($rst.status){
                        map_win.hide();
                        scenic_store.reload();
                    }
                }catch(e){
                    Ext.Msg.alert('友情提示', '未能获取单位地理信息！请重试。<br><textarea rows=5 cols=50 readonly>' +
                        e.message + '\n\n' + response.responseText + "</textarea>");
                }
            },
            failure: function(response, opts) {
                myMask.hide();
                Ext.Msg.alert("系统提示", "未知错误，未能获取单位详情，稍后重试。[状态：" + response.status + "]");
            }
        });
    };

    window.setMapInfo = function(point){
        Ext.getCmp('map_lng').setValue(point[0]);
        Ext.getCmp('map_lat').setValue(point[1]);
    };

    window.setMapSize = function(size){
        Ext.getCmp('map_size').setValue(size);
    };
    /********************* 地图 end ****************/

    window.main_reload=function(){
        scenic_store.reload();
    }
});