ORGTree.rootText = '所有餐饮';
ROW={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    var thisTitle = "餐饮管理";

    /********************* 左边树 start ***********
     * |}**************/

     var tree_store=Ext.create('Ext.data.TreeStore', {

        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Restaurant/treeJson'
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
            "餐饮地区分布",
            "->",
            {
                text : '折叠',
                iconCls:"fa fa-bars",
                handler:function(b){
                    left_tree.collapseAll();
                }
            }
        ],
        style:'border-top:1px solid #009DDA',
        region:'west',
        minWidth : 240,
        maxWidth : 350,
        width:260,
        store: tree_store,
        bodyBorder:true,
        split:{size:2},
        border:false,
        rootVisible: true
    });

    left_tree.on('select',function(t,r,c,tf){
        var key=r.data.text;
        if(key=='所有分组'){
            restaurant_store.removeAll();
        }else{
            if(r.data.leaf){
                SUNLINE.baseParams(restaurant_store,{rt_city:key});
            }else{
                SUNLINE.baseParams(restaurant_store,{rt_province:key});
            }
            restaurant_store.currentPage=1;
            restaurant_store.load();
        }
    })

    /********************* 左边树 end *************************/

    /******************** 餐厅grid  start***************************/
    var url = $__app__ + '/Restaurant/dataJson';
    var field = [
        {name:"rt_id"},
        {name:"rt_name"},
        {name:"rt_name_short"},
        {name:"rt_pym"},
        {name:"rt_cover"},
        {name:"rt_province"},
        {name:"rt_city"},
        {name:"rt_county"},
        {name:"rt_org_id"},
        {name:"rt_mapx"},
        {name:"rt_mapy"},
        {name:"rt_mapz"},
        {name:"rt_bintroduction"},
        {name:"rt_pic"},
        {name:"rt_address"},
        {name:"rt_telephone"},
        {name:"rt_opentime"},
        {name:"rt_class"},
        {name:"rt_attribute"},
        {name:"rt_status"},
        {name:"rt_dateline"}
    ];
    var restaurant_store = new SUNLINE.JsonStore(url, field,false);

    var class_combo=SUNLINE.DictComBox({id:'class',name:'class',labelAlign:"right",value:'全部餐厅类型',editable:true,forceSelection:true},{'d_type':'餐厅类型'});
    var class_store=class_combo.box.getStore();
    class_store.on('load',function(){
        this.add({d_type:'餐厅类型',d_text:'全部餐厅类型', d_status: "ok", d_recommend: "0"});
        Ext.getCmp('class').setValue('全部餐厅类型');
        SUNLINE.baseParams(class_store,{d_type:'餐厅类型'});
    })
    class_combo.box.on('select',function(c,r,n){
        var class_=Ext.getCmp('class').getValue('全部等级餐饮');
        if(class_=='全部餐厅类型')class_='';
        SUNLINE.baseParams(restaurant_store,{rt_class:class_},true);
        restaurant_store.currentPage=1;
        restaurant_store.load();
        price_store.removeAll();
        contact_store.removeAll();
    })

    var restaurant_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        store:restaurant_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有餐厅信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"餐厅类型", dataIndex:"rt_class", width:120},
            {header:"餐厅名称", dataIndex:"rt_name", width:180},
            {header:"餐厅地址", dataIndex:"st_district", width:200,renderer:fullDress},
            //{header:"餐厅地址", dataIndex:"rt_province", width:120},
            {header:"封面图片", dataIndex:"rt_cover", width:120,renderer:formatPic}
        ],
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){
                restaurant_store.reload();
                price_store.removeAll();
                contact_store.removeAll();
            }},
            '<b>餐厅类型 :</b>',
            class_combo.box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'restaurant_dosearch_id',
                emptyText:'餐厅名称、拼音码',
                width:150,
                onTriggerClick:function (e) {
                    restaurant_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            restaurant_dosearch();
                        }
                    }
                }
            }
        ]
    });

     restaurant_store.on('beforeload',function(){
         var data=SUNLINE.getSelected(left_tree);
         if(data==null || data.data.text=='所有分组'){
            return false;
         }
     })

    function formatPic(v,m,r){
        var rt_cover = r.get("rt_cover");
        if(rt_cover!=''){
            rt_cover=$app_root+rt_cover;
            return "<img style='height: 20px;' src='" + rt_cover + "' qtip='<img src=\"" + rt_cover + "\">'>";
        }else{
            return '';
        }
    };

    restaurant_store.on('load',function(){
        price_store.removeAll();
        contact_store.removeAll();
    })

    function restaurant_dosearch(){
        var key=Ext.getCmp('restaurant_dosearch_id').getValue();
        SUNLINE.baseParams(restaurant_store,{skey:key},true);
        restaurant_store.currentPage=1;
        restaurant_store.load();
    }

    restaurant_grid.on('select',function(i,v){
        $restaurant_sc_id=v['data']['rt_id'];
        SUNLINE.baseParams(price_store,{'rp_restaurant_id':$restaurant_sc_id})
        price_store.load({params:{start:0,limit:pageSize}});
        SUNLINE.baseParams(contact_store,{rc_type:'餐饮',rc_pid:$restaurant_sc_id})
        contact_store.load({params:{start:0,limit:pageSize}});
    });

    var province_combo=SUNLINE.ComBoxCity({
        id:'rt_province',
        where:{city_type:'province'},
        items_type:true,
        config:{fieldLabel:"<span style='color:red'> * </span>省份",labelWidth:80,labelAlign:'right',allowBlank:false,listeners:{
            select:function(){
                if( Ext.getCmp('rt_city_id').getValue() ) Ext.getCmp('rt_city_id').setValue();
                if( Ext.getCmp('rt_county_id').getValue() ) Ext.getCmp('rt_county_id').setValue();
            }
        }}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'rt_city',
        where:{city_type:'city'},
        appTo:'rt_province',
        items_type:true,
        config:{fieldLabel:"<span style='color:red'> * </span>城市",labelWidth:80,labelAlign:'right',allowBlank:false,listeners:{
            select:function(){
                if( Ext.getCmp('rt_county_id').getValue() ) Ext.getCmp('rt_county_id').setValue();
            }
        }}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'rt_county',
        items_type:true,
        where:{city_type:'<span style="color:red"> * </span>county'},
        appTo:'rt_city',
        config:{fieldLabel:"区/县",labelWidth:80,labelAlign:'right',allowBlank:false}
    })
    var rt_class_combo=SUNLINE.DictComBox_false({id:'rt_class_id',name:'rt_class',fieldLabel:"餐厅类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'餐厅类型'});
    var restaurant_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {id:"rt_id", name:"rt_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"rt_org_id", name:"rt_org_id", fieldLabel:"编辑权限单位ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"rt_name", name:"rt_name", fieldLabel:"<span style='color:red'> * </span>餐厅名称", maxLength:"100",allowBlank:false,vtype:'NotBlank'},
            {id:"rt_name_short", name:"rt_name_short", fieldLabel:"餐厅简称", maxLength:"100"},
            province_combo,
            city_combo,
            county_combo,
            {id:"rt_attribute",name:"rt_attribute",fieldLabel:"附加属性",maxLength:"1000",listeners:{'focus':function(t){attrWin.show(t.id)}}},
            {id:"rt_opentime", name:"rt_opentime", fieldLabel:"营业时间", maxLength:"100",blankText:"正确认格式:(6:00-20:00)"},
            rt_class_combo.box,
            {xtype:'textarea',id:'rt_bintroduction',name:"rt_bintroduction", fieldLabel:"餐厅简介",labelWidth:80,labelAlign:"right"}
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

    var attr_Store = SUNLINE.JsonStore($__app__ + '/Restaurant/attr',['group','gname','data'],false);
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
        var v=Ext.getCmp('rt_attribute').getValue();
        if (v){
            var h = v.split(',');
            //console.log(h);
            for (var i=0; i< h.length; i++){
                var index = attr_store.find('d_text', new RegExp('^' + h[i] + '$'));
                attrView.getSelectionModel().select(index, true);
            }
        }
    };

    function getSelected(){
        var h = attrView.getSelectedNodes(), sd=[];
        for (var i=0; i < h.length; i++){
            if(h[i].textContent!='设施')sd.push(h[i].textContent);
        };
        Ext.getCmp('rt_attribute').setValue(sd);
        attrWin.hide();
    };
    var restaurant_win=new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:restaurant_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                restaurant_win.hide();
            }}
        ]
    })
    var rt_class_num=1;
    restaurant_win.on('show',function(){
        if(rt_class_num==1) rt_class_combo.box.getStore().load();
        rt_class_num++;
        Ext.getCmp('rt_class_id').setValue('特色餐厅');
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
            emptyText:'没有类目信息',
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
                id:'items_dosearch_id',
                triggerCls:'x-form-search-trigger',
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
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: items_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '没有消费项目信息'
        })
    });

    function items_pic(){
        var row=SUNLINE.getSelected(items_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的景点服务项目！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/餐饮类目/table_id/'+row.data.ri_id;
    }



    var items_win=new Ext.Window({
        title:'服务项目',
        width:550,
        height:400,
        //resizable:false,
        closeAction:'hide',
        layout : 'fit',
        modal:true,
        items:[items_grid],
        buttons:[
            {text:'关闭', handler:function () {
                items_win.hide();
            }}
        ]
    })

    var ri_subject_combo=SUNLINE.DictComBox_false({name:'ri_subject',fieldLabel:"主题类型",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'餐厅主题类型'});
    var items_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',width:200},
        items:[
            {id:"ri_id", name:"ri_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"ri_pid", name:"ri_pid", fieldLabel:"所属资源id", maxLength:"10", xtype:"hidden"},
            {id:"ri_type", name:"ri_type", fieldLabel:"<span style='color:red'> * </span>类目类型", value:'餐饮',xtype:"hidden"},
            {id:"ri_title", name:"ri_title", fieldLabel:"<span style='color:red'> * </span>标题", maxLength:"100", allowBlank:false},
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
            {name:"ri_remark", fieldLabel:"类目说明", xtype:'textarea', maxLength:"200", height:60,width:200}
        ]
    });
    var items_form_win=new Ext.Window({
        title:'类目信息',
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
    var subject_num=1;
    items_form_win.on('show',function(){
        if(subject_num==1) ri_subject_combo.box.getStore().load();
        subject_num++;
    })
    items_form_win.on('hide',function(){
        items_form.form.reset();
    })

    restaurant_win.on('hide',function(){
        restaurant_form.form.reset();
    })


    /******************** 餐厅grid  end ***************************/

    /******************** 餐标  start ************************/
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
        {name:"rp_desc"},
        {name:"rp_commission"},
        {name:"rp_start_date"},
        {name:"rp_end_date"},
        {name:"rp_items_id"},
        {name:"rp_items_name"}
    ];

    var price_storeUrl = $__app__ + '/RestaurantPrice/dataJson';
    var price_store = new SUNLINE.JsonStore(price_storeUrl, price_field,false);

    var price_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store:price_store,

        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有餐标信息',
            deferEmptyText:true
        },
        tbar : [
            '<b>餐标</b>:',
            {text:'添加', iconCls:'button-add',handler:price_modify, disabled:isDisabled('RestaurantPrice::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:price_modify, disabled:isDisabled('RestaurantPrice::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:price_del, disabled:isDisabled('RestaurantPrice::del')},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){
                price_store.reload()
            }},
            '-'
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"rp_id", width:50, hidden:true},
            {header:"rp_org_id", dataIndex:"rp_org_id", width:50, hidden:true},
            {header:"票价名称", dataIndex:"rp_name", width:120},
            //{header:"挂牌价", dataIndex:"rp_price_sales", width:80,align:'right',renderer:money},
            {header:"结算价", dataIndex:"rp_price_settle", width:80,align:'right',renderer:money},
            {header:"结算方式", dataIndex:"rp_payment", width:80},
            {header:"有效期", dataIndex:"rp_data", width:180,renderer:function(v,m,r){
                return data_look(r.get('rp_start_date'))+' 至 '+data_look(r.get('rp_end_date'))
            }}
            //{header:"有效星期", dataIndex:"rp_week", width:120,renderer:SUNLINE.weekRenderer}
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
    function time_rp_start_date(v,m,r){
        return r.get('rp_start_date').substr(0,4) + '-' + r.get('rp_start_date').substr(4,2) + '-' + r.get('rp_start_date').substr(6,2) ;
    }
    function time_rp_end_date(v,m,r){
        return r.get('rp_end_date').substr(0,4) + '-' + r.get('rp_end_date').substr(4,2) + '-' + r.get('rp_end_date').substr(6,2) ;
    }
    var rt_weekly= SUNLINE.weekCheckboxGroup({
        width:400,
        id:'rp_week',
        fieldLabel:'<span style="color:red"> * </span>周几有效',
        name:'rp_week',
        config:{labelWidth:80,labelAlign:"right",style:'margin-top:5px;',allowBlank:false,msgTarget:'side'}
    });
    var rp_payment_dict=SUNLINE.DictComBox_false({id:'rp_payment_id',name:'rp_payment',fieldLabel:"<span style='color:red'> * </span>结算方式",labelWidth:80,labelAlign:"right",allowBlank:false,value:'现金'},{'d_type':'支付方式'});
    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {name:"rp_name", fieldLabel:"<span style='color:red'> * </span>餐标名称", xtype:'textfield',allowBlank:false,vtype:'NotBlank', labelWidth:80,maxLength:"200",width:560,labelAlign:"right"},
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"rp_id", fieldLabel:"ID",xtype:"hidden"},
                    {name:"rp_restaurant_id", fieldLabel:"餐厅ID",xtype:"hidden"},
                    {name:"rp_price_sales", fieldLabel:"挂牌价格", xtype:'numberfield'},
                    {name:"rp_commission", fieldLabel:"佣金", xtype:'numberfield',value:0},
                    {name:"rp_price_settle", fieldLabel:"<span style='color:red'> * </span>结算价格", xtype:'numberfield',allowBlank:false,vtype:'NotBlank'},
                    {name:"rp_refund", fieldLabel:"退票价格", xtype:'numberfield'},
                    SUNLINE.ExtDateField({id:'rp_start_date',name:'rp_start_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:280,gang:'rp_end_date',start:true}),
                    SUNLINE.ExtDateField({id:'rp_end_date',name:'rp_end_date',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:280,gang:'rp_start_date'}),
                    rp_payment_dict.box
                ]
            },
            rt_weekly,
            {xtype:'textfield',id:'rp_items_name',name:"rp_items_name", fieldLabel:"消费项目",labelWidth:80,width:560,labelAlign:"right",
                listeners:{'focus':items_choose_show}},
            {xtype:'hidden',id:'rp_items_id',name:"rp_items_id"},
            {name:"rp_desc", fieldLabel:"餐标说明", xtype:'textarea', labelWidth:80,maxLength:"200", height:60,width:560,labelAlign:"right"}

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
    var rp_payment_num=1;
    price_form_win.on('show',function(){
        if(rp_payment_num==1){
            rp_payment_dict.box.getStore().load();
        }
        Ext.getCmp('rp_payment_id').setValue('现金')
        rp_payment_num++;
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
            emptyText:'没有类目信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ri_pid", dataIndex:"ri_pid", width:180,hidden:true},
            {header:"ri_type", dataIndex:"ri_type", width:180,hidden:true},
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
                cls:'search-icon-cls',
                emptyText:'标题',
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
        var row=SUNLINE.getSelected(restaurant_grid);
        var items_sc_id=row.get('rt_id');

        SUNLINE.baseParams(items_store,{skey:key,ri_pid:items_sc_id,ri_type:'餐饮'});
        items_store.currentPage=1;
        items_store.load();
    }

    function items_choose_dosearch(){
        var key=Ext.getCmp('items_choose_dosearch_id').getValue();
        var row=SUNLINE.getSelected(restaurant_grid);
        var items_sc_id=row.get('rt_id')
        SUNLINE.baseParams(items_choose_store,{skey:key,ri_pid:items_sc_id,ri_type:'餐饮',limit:1000});
        items_choose_store.currentPage=1;
        items_choose_store.load();
    }

    var items_choose_win=new Ext.Window({
        title:'消费项目',
        width:550,
        height:400,
        resizable:false,
        closeAction:'hide',
        layout : 'fit',
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
                Ext.getCmp('rp_items_id').setValue(temp_id);
                Ext.getCmp('rp_items_name').setValue(temp_name);
                items_choose_win.hide();
            }},
            {text:'关闭', handler:function (){
                items_choose_win.hide();
            }}
        ]
    })

    /******************** 餐标  end **************************/


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
            {text:'刷新', iconCls:'button-ref', handler:function(){
                contact_store.reload();
            }}
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ID", dataIndex:"rc_id", width:50, hidden:true},
            {header:"rc_pid", dataIndex:"rc_pid", width:50, hidden:true},
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
                    {name:"rc_mobile", fieldLabel:"手机", vtype:'Mobile'},
                    {name:"rc_tel", fieldLabel:"座机"},
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
            {xtype:'hidden',id:'rc_pid',name:"rc_pid"}
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

    contact_form_win.on('hide',function(){
        contact_form.form.reset();
    })
    contact_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(restaurant_grid);
        if(data==null){
        return false;
        }
    })
    price_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(restaurant_grid);
        if(data==null){
            return false;
        }
    })

        /******************** 联系人 end *****************************/

    var right_panel = new Ext.panel.Panel({
        border : false,
        style:'border-left:1px solid #009DDA ',
        split:{size:2},
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
            {text:'添加', iconCls:'button-add',handler:restaurant_modify, disabled:isDisabled('Restaurant::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:restaurant_modify, disabled:isDisabled('Restaurant::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:restaurant_del, disabled:isDisabled('Restaurant::del')},
            '-',
            {text:'地图', iconCls:'button-edit',handler:editMap, disabled:isDisabled('Plugs::plugs')},
            '-',
            {text:'图片管理', iconCls:'button-edit',handler:store_pic, disabled:isDisabled('Pic::index')},
            '-',
            {text:'服务项目', iconCls:'button-add',handler:items_view, disabled:isDisabled('ResourceItem::save')}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:restaurant_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有餐厅信息'
        }),
        items : [left_tree,restaurant_grid]
    });
    function store_pic(){
        var row=SUNLINE.getSelected(restaurant_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/餐饮/table_id/'+row.data.rt_id;
    }

    /******************** 相册  start ***************************/
    var pic_win=new Ext.Window({
        border:false,
        title:'图片管理',
        width:650,
        height:400,
        closeAction:'hide',
        modal:true,
        html:'<iframe width="100%" height="100%" border="0" name="pic_iframe"></iframe>'
    })
    /******************** 相册  end ***************************/

    new Ext.Viewport({
        layout:'border',
        items:[left_panel,right_panel]
    });

    function restaurant_modify(v){
        if(v.text == '编辑'){
            var row=SUNLINE.getSelected(restaurant_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
                return false;
            }
        };
        restaurant_win.setTitle(v.text + '餐厅信息');
        restaurant_win.show(v.id);
        if(v.text == '编辑'){
            restaurant_form.form.setValues(row.data);
        }
    }

    function restaurant_del(v){
        var row=SUNLINE.getSelected(restaurant_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该餐厅吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Restaurant/del',
                    params:{rt_id:row.data.rt_id,rt_status:'删除'},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        var info=result.info;
                        Ext.Msg.alert('友情提示',info);
                        if(result.status ==1){
                            restaurant_store.reload();
                            tree_store.reload();
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
        var row=SUNLINE.getSelected(restaurant_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
            return false;
        }
        items_win.show();
        SUNLINE.baseParams(items_store,{'ri_pid':row.data.rt_id,'ri_type':'餐饮'})
        items_store.load({params:{start:0,limit:pageSize}});
    }
    function items_modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(items_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的类目信息！');
                return false;
            }
        }else{
            var row=SUNLINE.getSelected(restaurant_grid);
            items_form.getForm().setValues({'ri_pid':row.data.rt_id});
        }
        items_form_win.show();
        if(v.text=='编辑'){
            items_form.form.setValues(row.data);
        }

    }

    function items_del(){
        var row=SUNLINE.getSelected(items_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的服务项目信息！');
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
        if(v.text=='添加') {
            var hotel_row = SUNLINE.getSelected(restaurant_grid);
            if (hotel_row == null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
                return false;
            }
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(price_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text+'价格信息');
        price_form_win.show();
        if(v.text=='编辑'){
            if(row.data.rp_start_date.indexOf("-")<=0){
                row.data.rp_start_date=row.data.rp_start_date.substr(0,4) + '-' + row.data.rp_start_date.substr(4,2) + '-' + row.data.rp_start_date.substr(6,2) ;
            }
            if(row.data.rp_end_date.indexOf("-")<=0){
                row.data.rp_end_date=row.data.rp_end_date.substr(0,4) + '-' + row.data.rp_end_date.substr(4,2) + '-' + row.data.rp_end_date.substr(6,2) ;
            }
            price_form.form.setValues(row.data);
            sb_weekly_id=row.get('rp_week');
            SUNLINE.weekSetValues(rt_weekly,sb_weekly_id );
        }
        price_form_win.setTitle(v.text+"餐标信息", v.iconCls);
    }

    function price_del(){
        var row=SUNLINE.getSelected(price_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要删除的餐标信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该餐标信息吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/RestaurantPrice/del',
                    params:{rp_id:row.data.rp_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示',result.info);
                        if(result.status==1){
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
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var row=SUNLINE.getSelected(restaurant_grid);
        var s = price_form.getForm().getValues();
        s['rp_restaurant_id']=row.get('rt_id');
        Ext.Ajax.request({
            url:$__app__ + '/RestaurantPrice/save',
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
                };

            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }


    function items_choose_show(){
        var row=SUNLINE.getSelected(restaurant_grid);
        if (!row){
            Ext.Msg.alert('友情提示', '没有指定的餐厅');
            return false;
        };
        items_choose_store.load({params:{'ri_pid':row.data.rt_id,'ri_type':'餐饮',limit:1000}});
        items_choose_win.show();
    }


    items_choose_store.on('load',function(){
        var rt_items_id=Ext.getCmp('rp_items_id').getValue();
        if(rt_items_id==''){

        }else{
            rt_items_id=','+rt_items_id+',';
            var count=items_choose_store.getCount();
            var select=[];
            for(var index=0;index<count;index++){
                var record=items_choose_store.getAt(index);
                if(rt_items_id.search(','+record['data']['ri_id']+',')>=0){
                    select.push(record);
                    items_choose_grid.getSelectionModel().select(select);
                }
            }
        }
    })
    function contact_modify(v){
        var restaurant_row=SUNLINE.getSelected(restaurant_grid);
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(contact_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的联系人信息！');
                return false;
            }
        }else{
            if(restaurant_row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的餐厅信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text + '联系人信息');
        contact_form_win.show();
        if(v.text=='编辑'){
            contact_form.form.setValues(row.data);
        }else{
            var data={};
            data['rc_pid']=restaurant_row.data.ht_id;
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
                var restaurant_data=SUNLINE.getSelected(restaurant_grid);
                data['rc_pid']=restaurant_data.get('rt_id');
                data['rc_type']='餐饮';
                Ext.Ajax.request({
                    url : $__app__ + '/ResourceContact/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status==1){

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
        if(!restaurant_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=restaurant_form.getForm().getValues();
                Ext.Ajax.request({
                    url : $__app__ + '/Restaurant/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        myMask.hide();
                        var ret = Ext.decode(response.responseText)
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status==1){
                            restaurant_store.reload();
                            tree_store.reload();
                            restaurant_win.hide();
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



    /**
     * 完整的地点
     * @param v
     * @param m
     * @param r
     * @return {String}
     */
    function fullDress(v,m,r){
        var province = r.get('rt_province');
        if(province == null) {province = ""};
        var city = r.get('rt_city');
        if(city == null) {city = ""};
        var county = r.get('rt_county') ? r.get('rt_county') : "";
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
                xtype:'trigger',
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
        var row=SUNLINE.getSelected(restaurant_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的餐厅');
            return;
        };
        ROW.id=row.data.rt_id;
        ROW.mapx=row.data.rt_mapx;
        ROW.mapy=row.data.rt_mapy;
        ROW.mapz=row.data.rt_mapz;

        map_win.show();
    }

    map_win.on('show', function(w){
        Ext.getCmp('map_search').setValue(ROW.addr);
        var map_lng = Ext.getCmp('map_lng');        var map_lat = Ext.getCmp('map_lat');
        var map_size = Ext.getCmp('map_size');
        var cityName = Ext.getCmp('cityName');
        map_size.setValue(''); map_lat.setValue(''); map_lng.setValue(''); cityName.setValue('');
        if (ROW.mapx) {map_lat.setValue(ROW.mapx)};
        if (ROW.mapy) {map_lng.setValue(ROW.mapy)};
        if (ROW.mapz) {map_size.setValue(ROW.mapz)};
        var url = $__app__ + '/Plugs/plugs?_dc=' + time();
        window.ifm_map.location = url;
    });

    function saveMapInfo(){
        var row=SUNLINE.getSelected(restaurant_grid);
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
            url: $__app__ + '/Restaurant/save',
            params: { rt_id:ROW.id, rt_mapx:lat, rt_mapy:lng, rt_mapz:size},
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    Ext.Msg.alert( '友情提示',$rst.info.msg);
                    if ($rst.status){
                        map_win.hide();
                        restaurant_store.reload();
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
        restaurant_store.reload();
    }

});
