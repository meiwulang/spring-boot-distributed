ORGTree.rootText = '所有酒店';
var ROW={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    var thisTitle = "酒店管理";

    /********************* 左边树 start *************************/
    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Hotel/treeJson'
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
            "酒店地区分布",
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
        width:260,
        store: tree_store,
        bodyBorder:true,
        split : {size:3},
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        rootVisible: true
    });
    left_tree.on('select',function(t,r,c,tf){
        var key=r.data.text;
        if(key=='所有分组'){
            hotel_store.removeAll();
        }else{
            var class_=Ext.getCmp('class').getValue('全部等级酒店');
            if(class_=='全部等级酒店')class_='';
            if(r.data.leaf){
                SUNLINE.baseParams(hotel_store,{ht_city:key,ht_class:class_});
            }else{
                SUNLINE.baseParams(hotel_store,{ht_province:key,ht_class:class_});
            }
            hotel_store.currentPage=1;
            hotel_store.load();
        }
    })

    /********************* 左边树 end *************************/


    /******************** 酒店grid  start***************************/
    var url = $__app__ + '/Hotel/dataJson';
    var field = [
        {name:"ht_id"},
        {name:"ht_name"},
        {name:"ht_name_short"},
        {name:"ht_pym"},
        {name:"ht_cover"},
        {name:"ht_province"},
        {name:"ht_city"},
        {name:"ht_county"},
        {name:"ht_org_id"},
        {name:"ht_mapx"},
        {name:"ht_mapy"},
        {name:"ht_mapz"},
        {name:"ht_telephone"},
        {name:"ht_attribute"},
        {name:"ht_status"},
        {name:'ht_dateline', type:'date', dateFormat:'timestamp'}
    ];
    var hotel_store = new SUNLINE.JsonStore(url, field,false);

    var class_combo=SUNLINE.DictComBox({id:'class',name:'class',labelAlign:"right",value:'全部等级酒店',editable:true,forceSelection:true},{'d_type':'酒店等级'});
    var class_store=class_combo.box.getStore();
    class_store.on('load',function(){
        this.add({d_type:'酒店等级',d_text:'全部等级酒店', d_status: "ok", d_recommend: "0"});
        Ext.getCmp('class').setValue('全部等级酒店');
        SUNLINE.baseParams(class_store,{d_type:'酒店等级'});
    })
    class_combo.box.on('select',function(c,r,n){
        var class_=Ext.getCmp('class').getValue('全部等级酒店');
        if(class_=='全部等级酒店')class_='';
        SUNLINE.baseParams(hotel_store,{ht_class:class_},true);
        hotel_store.currentPage=1;
        hotel_store.load();
        price_store.removeAll();
        contact_store.removeAll();
    })
    var hotel_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        store:hotel_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有酒店信息',
            deferEmptyText:true
        },
        columns:[
             new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"ht_id", width:50, hidden:true},
            {header:"等级", dataIndex:"ht_class", width:100},
            {header:"酒店名称", dataIndex:"ht_name", width:180,renderer:function(v,i,r){
                var enid = r.get('ht_id');
                var url = $__app__+"/Hotel/one_hotel/ht_id/"+enid;
                return '<a href = "'+url+'" target = "_blank">'+v+'</a>';
            }},
            {header:"酒店地址", dataIndex:"ht_telephone", width:160,renderer:fullDress},
            {header:"封面图片", dataIndex:"ht_cover", width:120,renderer:formatPic}
        ],
        tbar : [
            /*{text:'刷新', iconCls:'button-ref', handler:function(){
                hotel_store.reload();
                price_store.removeAll();
                contact_store.removeAll();
            }},*/
            '<b>酒店等级 :</b>',
            class_combo.box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'酒店名称、拼音码',
                width:150,
                onTriggerClick:function (e) {
                    hotel_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            hotel_dosearch();
                        }
                    }
                }
            }
        ]
    });

    function formatPic(v,m,r){
        var ht_cover = r.get("ht_cover");
        if(ht_cover!=''){
            ht_cover=$app_root+ht_cover;
            return "<img style='height: 20px;' src='" + ht_cover + "' qtip='<img src=\"" + ht_cover + "\">'>";
        }else{
            return '';
        }
    };

    function hotel_dosearch(){
        var class_=Ext.getCmp('class').getValue('全部等级酒店');
        if(class_=='全部等级酒店')class_='';
        var key=Ext.getCmp('hotel_search').getValue();
        SUNLINE.baseParams(hotel_store,{skey:key,ht_class:class_},true);
        hotel_store.currentPage=1;
        hotel_store.load();
    }
    hotel_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(left_tree);
        if(data==null || data.data.text=='所有分组'){
            return false;
        }
    })
    hotel_grid.on('select',function(i,v){
      SUNLINE.baseParams(price_store,{hp_hotel_id: v['data']['ht_id']});
      price_store.currentPage=1;
      price_store.load();
      SUNLINE.baseParams(contact_store,{rc_type:'酒店',rc_pid: v['data']['ht_id']});
      contact_store.currentPage=1;
      contact_store.load();
    });

    hotel_store.on('load',function(){
        contact_store.removeAll();
        price_store.removeAll();
    })

    var province_combo=SUNLINE.ComBoxCity({
        id:'ht_province',
        where:{city_type:'province'},
        items_type:true,
        config:{fieldLabel:"<span style='color:red'> * </span>省份",labelWidth:80,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('ht_city_id').getValue() ) Ext.getCmp('ht_city_id').setValue();
                if( Ext.getCmp('ht_county_id').getValue() ) Ext.getCmp('ht_county_id').setValue();
            }
        }}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'ht_city',
        where:{city_type:'city'},
        items_type:true,
        appTo:'ht_province',
        config:{fieldLabel:"<span style='color:red'> * </span>城市",labelWidth:80,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('ht_county_id').getValue() ) Ext.getCmp('ht_county_id').setValue();
            }
        }}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'ht_county',
        where:{city_type:'county'},
        items_type:true,
        appTo:'ht_city',
        config:{fieldLabel:"<span style='color:red'> * </span>区/县",labelWidth:80,labelAlign:'right',editable:false, allowBlank:false}
    })
    var ht_class_combo=SUNLINE.DictComBox_false({name:'ht_class',fieldLabel:"<span style='color:red'> * </span>等级",labelWidth:80,labelAlign:"right",allowBlank:false,editable:true,forceSelection:false},{'d_type':'酒店等级'});

    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{d_id}">{d_text}</div>',
        '</tpl>'
    );

    //新的DataView数据源
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "d_id","d_text","cls" ]
    });
    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });

    var attr_Store = SUNLINE.JsonStore($__app__ + '/Hotel/attr',['group','gname','data'],false);
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
        var v=Ext.getCmp('ht_attribute').getValue();
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
        //$types = array("周边设施", "房间设施",'酒店服务','酒店设施');
        for (var i=0; i < h.length; i++){
            if(h[i].textContent!='周边设施' && h[i].textContent!='房间设施' && h[i].textContent!='酒店服务' && h[i].textContent!='酒店设施')sd.push(h[i].textContent);
        };
        Ext.getCmp('ht_attribute').setValue(sd);
        attrWin.hide();
    };
    var hotel_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {id:"ht_id", name:"ht_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"ht_org_id", name:"ht_org_id", fieldLabel:"编辑权限单位ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"ht_name", name:"ht_name", fieldLabel:"<span style='color:red'> * </span>酒店名称", maxLength:"100", allowBlank:false,vtype:'NotBlank'},
            {id:"ht_name_short", name:"ht_name_short", fieldLabel:"酒店简称", maxLength:"100"},
            province_combo,
            city_combo,
            county_combo,
            {id:"ht_address", name:"ht_address", fieldLabel:"详细地址"},
            {id:"ht_attribute",name:"ht_attribute",fieldLabel:"附加属性",maxLength:"1000",listeners:{'focus':function(t){attrWin.show(t.id)}}},
            ht_class_combo.box,
            {
                xtype: 'container',
                collapsible: true,
                style:'border:none;margin-top:5px;margin-bottom:-10px',
                defaults: {
                    labelWidth:80,
                    anchor: '100%',
                    labelAlign:"right" ,
                    layout: {
                        type: 'hbox'

                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: '免房政策',
                    defaults: {
                        hideLabel: true
                    },
                    items: [

                        {xtype: 'numberfield',fieldLabel: ' ht_room_num', name: 'ht_room_num', width: 75},
                        {xtype: 'displayfield', value: '间房',style:'margin-left:5px;margin-right:5px;'},
                        {xtype: 'displayfield', value: '免',style:'margin-left:5px;margin-right:5px;'},
                        { fieldLabel: 'ht_room', name: 'ht_room_free', width: 75, xtype:'numberfield'},
                        {xtype: 'displayfield', value: '间',style:'margin-left:5px;'}
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '免房早餐',
                    defaults: {
                        hideLabel: true
                    },
                    items: [
                        {id:"ht_breakfast", name:"ht_breakfast", fieldLabel:" ", xtype:"combo", triggerAction : "all",
                            store:new Ext.data.SimpleStore({fields:['ht_breakfast'], data:[
                                ['免房含早餐'],
                                ['免房不含早餐']
                            ]}),
                            displayField:"ht_breakfast",
                            valueField:"ht_breakfast",
                            mode:"local",
                            //value:"免房含早餐",
                            forceSelection : true,
                            typeAhead : true,
                            width:98
                        },
                        {xtype: 'displayfield', value: '早餐',style:'margin-left:5px;margin-right:5px;'},
                        {xtype: 'numberfield',    fieldLabel: 'ht_breakfast_price', name: 'ht_breakfast_price', width: 75},
                        {xtype: 'displayfield', value: '元',style:'margin-left:5px;'}
                    ]
                }]
            },

            {xtype:'textarea',id:'ht_bintroduction',name:"ht_bintroduction", fieldLabel:"酒店简介",labelWidth:80,labelAlign:"right"}
        ]
    });

    var hotel_win=new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:hotel_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                hotel_win.hide();
            }}
        ]
    })
    var ht_class_num=1;
    hotel_win.on('show',function(){
        if(ht_class_num==1) ht_class_combo.box.getStore().load();
        ht_class_num++;
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
            emptyText:'没有服务信息',
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
            '-',
            {text:'相册', iconCls:'button-edit',handler:items_pic},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'items_dosearch_id',
                cls:'search-icon-cls',
                emptyText:'标题',
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
            emptyMsg:'没有服务信息'
        })

    });

    function items_dosearch(){
        var key=Ext.getCmp('items_dosearch_id').getValue();
        var row=SUNLINE.getSelected(hotel_grid);
        var items_sc_id=row.get('ht_id');
        SUNLINE.baseParams(items_store,{skey:key,ri_pid:items_sc_id,ri_type:'酒店'});
        items_store.currentPage=1;

        items_store.load();
    }
    var items_win=new Ext.Window({
        title:'服务项目',
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

    var ri_subject_combo=SUNLINE.DictComBox_false({name:'ri_subject',fieldLabel:"<span style='color:red'> * </span>主题类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'酒店主题'});
    var items_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',width:200},
        items:[
            {id:"ri_id", name:"ri_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"ri_pid", name:"ri_pid", fieldLabel:"所属资源id", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"ri_type", name:"ri_type", fieldLabel:"服务类型", value:'酒店',xtype:"hidden"},
            {id:"ri_title", name:"ri_title", fieldLabel:"<span style='color:red'> * </span>标题", maxLength:"100", allowBlank:false,vtype:'NotBlank'},
            ri_subject_combo.box,
            {
                xtype: 'radiogroup',
                fieldLabel: '是否显示',
                labelWidth:80,
                labelAlign:"right",
                columns: 2,
                items: [
                    { boxLabel: '是', name: 'ri_show', inputValue: '是',checked: true},
                    { boxLabel: '否', name: 'ri_show', inputValue: '否'}
                ]
            },
            {name:"ri_remark", fieldLabel:"服务说明", xtype:'textarea', maxLength:"200", height:60,width:200}
        ]
    });
    var items_form_win=new Ext.Window({
        title:'服务信息',
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:items_form,
        buttons:[
            {text:'保存', handler:items_dosave},
            {text:'关闭', handler:function () {
                items_form_win.hide();
            }}
        ]
    })

    items_form_win.on('hide',function(){
        items_form.form.reset();
    })
    var subject_num=1;
    items_form_win.on('show',function(){
        if(subject_num==1) ri_subject_combo.box.getStore().load();
        subject_num++;
    })
    hotel_win.on('hide',function(){
        hotel_form.form.reset();
    })


    /******************** 酒店grid  end ***************************/

    /******************** 价格策略  start ************************/
    var price_field = [
        {name:"hp_id"},
        {name:"hp_name"},
        {name:"hp_retail"},
        {name:"hp_peer"},
        {name:"hp_price_peer"},
        {name:"hp_price_retail"},
        {name:"hp_price_sales"},
        {name:"hp_price_settle"},
        {name:"hp_hotel_id"},
        {name:"hp_org_id"},
        {name:"hp_desc"},
        {name:"hp_commission"},
        {name:"hp_week"},
        {name:"hp_start_date"},
        {name:"hp_end_date"},
        {name:"hp_items_id"},
        {name:"hp_items_name"},
        {name:"hp_status"},
        {name:"hp_refund"}
    ];

    var price_storeUrl = $__app__ + '/HotelPrice/dataJson';
    var price_store = new SUNLINE.JsonStore(price_storeUrl, price_field,false);

    var price_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store:price_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有酒店信息',
            deferEmptyText:true
        },
        tbar : [
            '<b>价格策略</b>:',
            {text:'添加', iconCls:'button-add',handler:price_modify, disabled:isDisabled('HotelPrice::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:price_modify, disabled:isDisabled('HotelPrice::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:price_del, disabled:isDisabled('HotelPrice::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){price_store.reload();}}
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"hp_id", dataIndex:"hp_id", width:10,hidden:true},
            {header:"hp_hotel_id", dataIndex:"hp_hotel_id", width:10,hidden:true},
            {header:"票价名称", dataIndex:"hp_name", width:120},
            //{header:"同行价", dataIndex:"hp_settlement_price", width:80,align:'right',renderer:money},
            {header:"结算价", dataIndex:"hp_price_settle", width:80,align:'right',renderer:money},
            {header:"早餐类型", dataIndex:"hp_breakfast", width:80},
            {header:"结算方式", dataIndex:"hp_payment", width:80},
            {header:"有效期", dataIndex:"hp_data", width:180,renderer:function(v,m,r){
                return data_look(r.get('hp_start_date'))+' 至 '+data_look(r.get('hp_end_date'))
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:price_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有价格信息'
        })
    });
    function data_look(v){
        return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
    }
    function time_hp_start_date(v,m,r){
        var time = r.get('hp_start_date');
        var time1=time.substr(0,4);
        var time2=time.substr(4,2);
        var time3=time.substr(6,2);
        return time1 + '-' + time2 + '-' + time3 ;
    }
    function time_hp_end_date(v,m,r){
        var time = r.get('hp_end_date');
        var time1=time.substr(0,4);
        var time2=time.substr(4,2);
        var time3=time.substr(6,2);
        return time1 + '-' + time2 + '-' + time3 ;

    }

    price_store.on('beforeLoad',function(){
       var data=SUNLINE.getSelected(hotel_grid);
        if(data==null){
            return false;
        }
    })

    var rt_weekly= SUNLINE.weekCheckboxGroup({
        width:400,
      // id:'hp_week',
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'hp_week',
        config:{labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side'}
    });
    var hp_breakfast_dict=SUNLINE.DictComBox_false({id:'hp_breakfast_id',name:'hp_breakfast',fieldLabel:"<span style='color:red'> * </span>早餐类型",labelWidth:80,labelAlign:"right",allowBlank:false,value:'含早餐'},{'d_type':'酒店早餐'});
    var hp_payment_dict=SUNLINE.DictComBox_false({id:'hp_payment_id',name:'hp_payment',fieldLabel:"<span style='color:red'> * </span>结算方式",labelWidth:80,labelAlign:"right",allowBlank:false,value:'现金'},{'d_type':'支付方式'});
    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {xtype:'textfield',id:'hp_name',name:"hp_name", fieldLabel:"<span style='color:red'> * </span>票价名称",labelWidth:80,width:560,labelAlign:"right",allowBlank:false,vtype:'NotBlank'},
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"hp_id", fieldLabel:"hp_id",hidden:true},
                    {name:"hp_hotel_id", fieldLabel:"hp_hotel_id",hidden:true},
                    {name:"hp_price_sales", fieldLabel:"门店销售价", xtype:'numberfield'},
                    {name:"hp_settlement_price", fieldLabel:"同行价", xtype:'numberfield'},
                    {name:"hp_price_settle", fieldLabel:"<span style='color:red'> * </span>结算价", xtype:'numberfield',allowBlank:false,vtype:'NotBlank'},
                    {name:"hp_commission", fieldLabel:"销售回佣", xtype:'numberfield'},
                    {name:"hp_refund", fieldLabel:"退房差", xtype:'numberfield'},
                    {name:"hp_differe_room", fieldLabel:"补房差", xtype:'numberfield'},
                    SUNLINE.ExtDateField({id:'hp_start_date',name:'hp_start_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:280,gang:'hp_end_date',start:true}),
                    SUNLINE.ExtDateField({id:'hp_end_date',name:'hp_end_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:280,gang:'hp_start_date'}),
                    hp_payment_dict.box,
                    hp_breakfast_dict.box
                ]
            },
            rt_weekly,
            {xtype:'textfield',id:'hp_items_name',name:"hp_items_name", fieldLabel:"消费项目",labelWidth:80,width:560,labelAlign:"right",listeners:{'focus':items_choose_show}},
            {xtype:'hidden',id:'hp_items_id',name:"hp_items_id"},
            { xtype:'textarea',id:'hp_desc',name:"hp_desc", fieldLabel:"票价说明", labelWidth:80,maxLength:"200", height:60,width:560,labelAlign:"right"}
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
    ROW.num=1;
    price_form_win.on('show',function(){
        if(ROW.num==1){
            hp_breakfast_dict.box.getStore().load();
            hp_payment_dict.box.getStore().load();
        }
        Ext.getCmp('hp_breakfast_id').setValue('含早餐')
        Ext.getCmp('hp_payment_id').setValue('现金')
        ROW.num++;
    })
    price_form_win.on('hide',function(){
        price_form.form.reset();
    })

    var items_choose_store = new SUNLINE.JsonStore(items_url, items_field);
    var items_choose_grid=new Ext.grid.GridPanel({

        region:'center',
        border:false,
        store:items_choose_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有服务信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"标题", dataIndex:"ri_title", width:180},
            {header:"类型", dataIndex:"ri_subject", width:180},
            {header:"是否显示", dataIndex:"ri_show", width:100}
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
                emptyText:'标题',
                cls:'search-icon-cls',
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
    function items_choose_dosearch(){
        var key=Ext.getCmp('items_choose_dosearch_id').getValue();
        var row=SUNLINE.getSelected(hotel_grid);
        var items_ht_id=row.get('ht_id');
        SUNLINE.baseParams(items_choose_store,{skey:key,ri_pid:items_ht_id,ri_type:'酒店'})
        items_choose_store.currentPage=1;
        items_choose_store.load({start:0,limit:1000});
    }

    var items_choose_win=new Ext.Window({
        title:'消费项目',
        width:550,
        height:400,
        layout:'fit',
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
                Ext.getCmp('hp_items_id').setValue(temp_id);
                Ext.getCmp('hp_items_name').setValue(temp_name);
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
        {name:"rc_id"},
        /*{name:"rc_pid"},
        {name:"rc_retail"},
        {name:"rc_peer"},
        {name:"rc_price_peer"},
        {name:"rc_price_retail"},
        {name:"rc_price_sales"},
        {name:"rc_price_settle"},
        {name:"rc_price_refund"},
        {name:"rc_payment"},
        {name:"rc_resources_id"},
        {name:"rc_resources_type"},
        {name:"rc_org_id"},
        {name:"rc_desc"}*/
    ];

    var contact_storeUrl = $__app__ + '/ResourceContact/dataJson';
    var contact_store = new SUNLINE.JsonStore(contact_storeUrl, contact_field, false);
    var contact_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'south',
        height:200,
        autoLoad:false,
        style:'border-top:1px solid #009DDA',
        store:contact_store,
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
            {text:'刷新', iconCls:'button-ref', handler:function(){contact_store.reload();}}
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
                    {name:"rc_pid", fieldLabel:"rc_pid",hidden:true},
                    {name:"rc_name", fieldLabel:"<span style='color:red'> * </span>联系人",allowBlank:false,vtype:'NotBlank'},
                    sp_type_all_dict.box,
                    {name:"rc_mobile", fieldLabel:"手机",vtype:'Mobile'},
                    {name:"rc_tel", fieldLabel:"电话"},
                    {name:"rc_fax", fieldLabel:"传真"},
                    {name:"rc_email", fieldLabel:"邮箱",vtype:'email'},
                    {name:"rc_qq", fieldLabel:"QQ"},
                    {name:"rc_weixin", fieldLabel:"微信号"},
                    {name:"rc_type",xtype:'hidden',fieldLabel:"联系人类型",value:'酒店'},
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
        var data=SUNLINE.getSelected(hotel_grid);
        if(data==null){
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
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>'
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
        split : true,
        region : 'center',
        layout :'border',
        tbar: [
            {text:'添加', iconCls:'button-add',handler:hotel_modify, disabled:isDisabled('Hotel::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:hotel_modify, disabled:isDisabled('Hotel::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:hotel_del, disabled:isDisabled('Hotel::del')},
            '-',
            {text:'地图', iconCls:'button-edit',handler:editMap, disabled:isDisabled('Plugs::plugs')},
            '-',
            {text:'图片管理', iconCls:'button-edit',handler:hotel_pic, disabled:isDisabled('Pic::index')},
            '-',
            {text:'服务项目', iconCls:'button-add',handler:items_view, disabled:isDisabled('ResourceItem::save')}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:hotel_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有酒店信息'
        }),
        items : [left_tree,hotel_grid]
    });

    new Ext.Viewport({
        layout:'border',
        items:[left_panel,right_panel]
    });

    function hotel_modify(v){
        if(v.text == '编辑'){
            var row=SUNLINE.getSelected(hotel_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
                return false;
            }
        };
        hotel_win.setTitle(v.text + '酒店信息');
        hotel_win.show(v.id);
        if(v.text == '编辑'){
            if(row.data.ht_root_rule)var ht_root_rule=Ext.decode(row.data.ht_root_rule);
            hotel_form.form.setValues(row.data);
            hotel_form.form.setValues(ht_root_rule);
        }
    }

    function hotel_del(v){
        var row=SUNLINE.getSelected(hotel_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该酒店吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Hotel/del',
                    params:{ht_id:row.data.ht_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            hotel_store.reload();
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


    function hotel_pic(){
        var row=SUNLINE.getSelected(hotel_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/酒店/table_id/'+row.data.ht_id;
    }


    function items_view(){
        var row=SUNLINE.getSelected(hotel_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        items_win.show();
        SUNLINE.baseParams(items_store,{'ri_pid':row.data.ht_id,'ri_type':'酒店'})
        items_store.currentPage=1;
        items_store.load();
    }
    function items_modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(items_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的类目信息！');
                return false;
            }
        }
        items_form_win.setTitle(v.text+'服务信息');
        items_form_win.show();
        if(v.text=='编辑'){
            items_form.form.setValues(row.data);
        }

    }

    function items_del(){
        var row=SUNLINE.getSelected(items_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的服务信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该服务吗？',function(id){
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


    function items_pic(){
        var row=SUNLINE.getSelected(hotel_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/酒店服务/table_id/'+row.data.ht_id;
    }

    function items_dosave(){
        if(!items_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                var row=SUNLINE.getSelected(hotel_grid);
                myMask.show();
                var data=items_form.getForm().getValues();
                data['ri_pid']=row.data.ht_id;
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
        var hotel_row=SUNLINE.getSelected(hotel_grid);
        if(hotel_row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
            return false;
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(price_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的票种信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text+'价格信息');
        price_form_win.show();
        if(v.text=='编辑'){
            if(row.data.hp_start_date.indexOf("-")<=0){
                row.data.hp_start_date=row.data.hp_start_date.substr(0,4) + '-' + row.data.hp_start_date.substr(4,2) + '-' + row.data.hp_start_date.substr(6,2) ;
            }
            if(row.data.hp_end_date.indexOf("-")<=0){
                row.data.hp_end_date=row.data.hp_end_date.substr(0,4) + '-' + row.data.hp_end_date.substr(4,2) + '-' + row.data.hp_end_date.substr(6,2) ;
            }
            price_form.form.setValues(row.data);
            sb_weekly_id=row.get('hp_week');
            SUNLINE.weekSetValues(rt_weekly,sb_weekly_id );
        }
        price_form_win.setTitle(v.text+"酒店票价信息", v.iconCls);
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
                    url:$__app__ + '/HotelPrice/del',
                    params:{hp_id:row.data.hp_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',ret.info);
                        if(ret.status ==1){
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

        var row=SUNLINE.getSelected(hotel_grid);
        var data= price_form.getForm().getValues();
        if(row){
            data['hp_hotel_id']=row.get('ht_id');
        }
        Ext.Ajax.request({
            url:$__app__ + '/HotelPrice/save',
            params:data,
            method:'POST',
            success:function (response, otps) {
                myMask.hide();
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    price_store.reload();
                    price_form_win.hide();
                };
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    function items_choose_show(){
        var row=SUNLINE.getSelected(hotel_grid);
        if (!row){
            Ext.Msg.alert('友情提示', '没有指定的酒店');
            return false;
        };
        SUNLINE.baseParams(items_choose_store,{'ri_pid':row.data.ht_id,'ri_type':'酒店'});
        items_choose_store.load({start:0,limit:1000});
        items_choose_win.show();
    }

    items_choose_store.on('load',function(){
        var rt_items_id=Ext.getCmp('hp_items_id').getValue();
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
        var hotel_row=SUNLINE.getSelected(hotel_grid);
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(contact_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的联系人信息！');
                return false;
            }
        }else{
            if(hotel_row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的酒店信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text + '联系人信息');
        contact_form_win.show();
        if(v.text=='编辑'){
            contact_form.form.setValues(row.data);
        }else{
            var data={};
            data['rc_pid']=hotel_row.data.ht_id;
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
                    url:$__app__ + '/ResourceContact/del',
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


    function dosave(){
        if(!hotel_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=hotel_form.getForm().getValues();
                Ext.Ajax.request({
                    url : $__app__ + '/Hotel/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            hotel_store.reload();
                            hotel_win.hide();
                            tree_store.reload();
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



    function fullDress(v,m,r){
        var province = r.get('ht_province');
        if(province == null) {province = ""};
        var city = r.get('ht_city');
        if(city == null) {city = ""};
        var county = r.get('ht_county') ? r.get('ht_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
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
                xtype : 'trigger', id:'map_search', width:180,
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
        var row=SUNLINE.getSelected(hotel_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的酒店');
            return;
        };
        ROW.id=row.data.ht_id;
        ROW.mapx=row.data.ht_mapx;
        ROW.mapy=row.data.ht_mapy;
        ROW.mapz=row.data.ht_mapz;
        map_win.show();
    }

    map_win.on('show', function(w){
       Ext.getCmp('map_search').setValue(ROW.addr);
        var map_lng = Ext.getCmp('map_lng');
        var map_lat = Ext.getCmp('map_lat');
        var map_size = Ext.getCmp('map_size');
        var cityName = Ext.getCmp('cityName');
        map_size.setValue(''); map_lat.setValue(''); map_lng.setValue(''); cityName.setValue('');
        if (ROW.mapy) {map_lng.setValue(ROW.mapy)};
        if (ROW.mapx) {map_lat.setValue(ROW.mapx)};
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
        Ext.Ajax.request({
            url: $__app__ + '/Hotel/save',
            params: { ht_id:ROW.id, ht_mapx:lat, ht_mapy:lng, ht_mapz:size },
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    Ext.Msg.alert( '友情提示',$rst.info.msg);
                    if ($rst.status){
                        map_win.hide();
                        hotel_store.reload();
                    }
                }catch(e){
                    Ext.Msg.alert('友情提示', '未能获取单位地理信息！请重试。<br><textarea rows=5 cols=50 readonly>' +
                        e.message + '\n\n' + response.responseText + "</textarea>");
                }
            },
            failure: function(response, opts) {
                _myMask.hide();
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
        hotel_store.reload();
    }

});