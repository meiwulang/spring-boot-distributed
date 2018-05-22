ROW={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    var thisTitle = "购物店管理";

    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "d_id","d_text","cls" ]
    });

    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });

    var attr_Store = SUNLINE.JsonStore($__app__ + '/Store/attr',['group','gname','data'],false);

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
        var v=Ext.getCmp('st_property').getValue();
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
            if(h[i].textContent!='购物店')sd.push(h[i].textContent);
        };
        Ext.getCmp('ht_attribute').setValue(sd);
        attrWin.hide();
    };


    /********************* 左边树 start *************************/
    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/Store/treeJson'
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
        style:'border-top:1px solid #009DDA;',
        tbar : [
            "购物店地区分布",
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
        rootVisible: true
    });

    left_tree.on('select',function(t,r,c,tf){
        var key=r.data.text;
        if(key=='所有分组'){
            store_store.removeAll();
        }else{
            if(r.data.leaf){
                SUNLINE.baseParams(store_store,{st_city:key});
            }else{
                SUNLINE.baseParams(store_store,{st_province:key});
            }
            store_store.currentPage=1;
            store_store.load();
        }
    })
    /********************* 左边树 end *************************/


    /******************** 购物店grid  start***************************/
    var url = $__app__ + '/Store/dataJson';
    var field = [
        {name:"st_id"},
        {name:"st_name"},
        {name:"st_name_short"},
        {name:"st_pym"},
        {name:"st_cover"},
        {name:"st_province"},
        {name:"st_city"},
        {name:"st_county"},
        {name:"st_org_id"},
        {name:"st_mapx"},
        {name:"st_mapy"},
        {name:"st_mapz"},
        {name:"st_bintroduction"},
        {name:"st_pic"},
        {name:"st_address"},
        {name:"st_telephone"},
        {name:"st_opentime"},
        {name:"st_class"},
        {name:"st_attribute"},
        {name:"st_status"},
        {name:"st_dateline"}
    ];
    var store_store = new SUNLINE.JsonStore(url, field,false);

    var store_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        store:store_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有购物店信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"购物店名称", dataIndex:"st_name", width:180},
            {header:"购物店电话", dataIndex:"st_telephone", width:120},
            {header:"购物店地址", dataIndex:"st_district", width:200,renderer:fullDress},
            {header:"封面图片", dataIndex:"st_cover", width:120,renderer:formatPic}
        ],
        tbar : [
            {text:'查看所有商店政策', iconCls:'button-edit', handler:all_store_price},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){
                store_store.reload();
                contact_store.removeAll();
                price_store.removeAll();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'store_dosearch_id',
                cls:'search-icon-cls',
                emptyText:'购物店名称、拼音码',
                width:150,
                onTriggerClick:function (e) {
                    store_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            store_dosearch();
                        }
                    }
                }
            }
        ]
    });
    var all_store_url = $__app__ + '/Store/all_store';
    var all_store_field = [{name:"sp_id"}];
    var all_store_store = new SUNLINE.JsonStore(all_store_url, all_store_field,false);
    var all_store_cm=[];

    all_store_cm.push(new Ext.grid.RowNumberer({width:30}));
    for(var f in pro_one){

        var one_title={};
        one_title['header']=pro_one[f];
        one_title['dataIndex']=pro_one[f];
        one_title['width']=120;
        if(pro_one[f]=='商店名称'){
            one_title['locked']=true;
            one_title['align']='left';
        }else{
            one_title['align']='center';
            one_title['lockable']=false;
        }
        all_store_cm.push(one_title);
    }


    name_OrgCombo=SUNLINE.OrgCombo_Province({listConfig:{minWidth:290},id:'province_all',name:'name',allowBlank:false,width:130,editable:true,forceSelection:true});
    st_name_OrgCombo=SUNLINE.OrgCombo_Province({listConfig:{minWidth:290},id:'st_name_all',name:'st_name',allowBlank:false,width:130,editable:true,forceSelection:true});
    var sp_type_all_dict=SUNLINE.DictComBox({id:'sp_type_all',name:'sp_type',labelAlign:"right",allowBlank:false,width:130},{'d_type':'商店类别'});
    var name_store=name_OrgCombo.box.getStore();
    var st_name_store=st_name_OrgCombo.box.getStore();
    var sp_type_all_store=sp_type_all_dict.box.getStore();
    name_store.on('beforeload',function(){
        SUNLINE.baseParams(name_store,{type:'province'},true);
    })
    st_name_store.on('beforeload',function(){
        SUNLINE.baseParams(st_name_store,{type:'store'},true);
    })
    name_store.on('load',function(){
        name_store.add({name:'全部省份'})
    })
    st_name_store.on('load',function(){
        st_name_store.add({name:'全部购物店'})
    })
    sp_type_all_store.on('load',function(){
        this.add({d_type:'商店类别',d_text:'全部类别', d_status: "ok", d_recommend: "0"});
        sp_type_all_store.add({sp_type:'全部类别'})
    })
    name_OrgCombo.box.on('select',function(){
        sousuo();
    })
    st_name_OrgCombo.box.on('select',function(){
        sousuo();
    })
    sp_type_all_dict.box.on('select',function(){
        sousuo();
    })



    var tbar_items_grid= new Ext.grid.GridPanel({
        region : 'center',
        border : false,
        xtype: 'locking-grid',
        columnLines: true,
        columns:all_store_cm, //表格列定义
        store : all_store_store,
        tbar:[
            '适用省份 : ',
            name_OrgCombo.box,
            '-',
            '商店名称 :',
            st_name_OrgCombo.box,
            '-',
            '商店类别 :',
            sp_type_all_dict.box,
            '-',
            '有效时间 : ',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_start_time',name:'t_start_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_end_time',start:true}),
            '~',
            SUNLINE.ExtDateField({labelSeparator:'',id:'t_end_time',name:'t_end_time',labelWidth:0,fieldLabel:" ",labelAlign:"right",width:120,gang:'t_start_time'}),
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store: all_store_store,
            displayInfo: true,
            displayMsg: '第{0} 到 {1} 条数据 共{2}条',
            emptyMsg: '暂无商店政策数据'
        }),
        viewConfig:{
            emptyText : '暂无商店政策信息。',
            deferEmptyText : true
        }
    });
    Ext.getCmp('t_start_time').on('select',function(){
        sousuo()
    })
    Ext.getCmp('t_end_time').on('select',function(){
        sousuo()
    })
    function sousuo(){
        var province_all=Ext.getCmp('province_all').getValue();
        var st_name_all=Ext.getCmp('st_name_all').getValue();
        var sp_type_all=Ext.getCmp('sp_type_all').getValue();
        var t_start_time=Ext.getCmp('t_start_time').getRawValue();
        var t_end_time=Ext.getCmp('t_end_time').getRawValue();
        SUNLINE.baseParams(all_store_store,{
            province:province_all,
            st_name:st_name_all,
            sp_type:sp_type_all,
            t_start:t_start_time,
            t_end:t_end_time
        });
        all_store_store.currentPage=1;
        all_store_store.reload();
    }
    var all_store_win = new Ext.Window({
        title : '查看所有商店政策',
        width:Ext.getBody().getWidth()-100,
        height:Ext.getBody().getHeight()-50,
        autoHeight:true,
        closeAction:'hide',
        resizable:true,
        modal:true,
        items:[tbar_items_grid],
        mixWidth:500,
        mixHeight:200,
        cls : 'suntour_dataView',
        autoScroll : true,
        layout : 'fit',
        maximizable : true,//全屏效果
        buttons:[
            {text:'关闭', handler:function (){
                all_store_win.hide();
            }}
        ]
    });
    var all_store_store_num=1;
    function all_store_price(){
        all_store_win.show();
        if(all_store_store_num==1) all_store_store.load();
        all_store_store_num++;
    }
    store_store.on('load',function(){
        contact_store.removeAll();
        price_store.removeAll();
    })

    function formatPic(v,m,r){
        var st_cover = r.get("st_cover");
        if(st_cover!=''){
            st_cover=$app_root+st_cover;
            return "<img style='height: 20px;' src='" + st_cover + "' qtip='<img src=\"" + st_cover + "\">'>";
        }else{
            return '';
        }
    };

    function store_dosearch(){

        var key=Ext.getCmp('store_dosearch_id').getValue();
        SUNLINE.baseParams(store_store,{skey:key},true);
        store_store.currentPage=1;
        store_store.load();
    }
    store_store.on('beforeload',function(){
        var data=SUNLINE.getSelected(left_tree);
        if(data==null || data.data.text=='所有分组'){
            return false;
        }
    })


    store_grid.on('select',function(i,v){
        var store_sc_id=v['data']['st_id'];
        SUNLINE.baseParams(contact_store,{rc_type:'购物店',rc_pid:store_sc_id});
        contact_store.currentPage=1;
        contact_store.load();
        SUNLINE.baseParams(price_store,{sp_st_id:store_sc_id});
        price_store.currentPage=1;
        price_store.load();
    });


    var province_combo=SUNLINE.ComBoxCity({
        id:'st_province',
        items_type:true,
        where:{city_type:'province'},
        config:{fieldLabel:"<span style='color:red'> * </span>省份",labelWidth:80,labelAlign:'right',allowBlank:false,listeners:{
            select:function(){
                if( Ext.getCmp('st_city_id').getValue() ) Ext.getCmp('st_city_id').setValue();
                if( Ext.getCmp('st_county_id').getValue() ) Ext.getCmp('st_county_id').setValue();
            }
        }}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'st_city',
        items_type:true,
        where:{city_type:'city'},
        appTo:'st_province',
        config:{fieldLabel:"<span style='color:red'> * </span>城市",labelWidth:80,labelAlign:'right',allowBlank:false,listeners:{
            select:function(){
                if( Ext.getCmp('st_county_id').getValue() ) Ext.getCmp('st_county_id').setValue();
            }
        }}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'st_county',
        items_type:true,
        where:{city_type:'county'},
        appTo:'st_city',
        config:{fieldLabel:"<span style='color:red'> * </span>区/县",labelWidth:80,labelAlign:'right'}
    })
    var sp_type_dict=SUNLINE.DictComBox_false({id:'sp_type_id',name:'st_type',fieldLabel:"<span style='color:red'> * </span>商店类别",labelWidth:80,labelAlign:"right",allowBlank:false},{'d_type':'商店类别'});
    var store_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        defaults:{anchor:'90%',xtype:'textfield',labelWidth:80,labelAlign:"right",style:'margin-top:5px;'},
        items:[
            {id:"st_id", name:"st_id", fieldLabel:"ID", maxLength:"10",xtype:"hidden"},
            {id:"st_org_id", name:"st_org_id", fieldLabel:"编辑权限单位ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"st_name", name:"st_name", fieldLabel:"<span style='color:red'> * </span>购物店名称", maxLength:"100", allowBlank:false,vtype:'NotBlank'},
            {id:"st_name_short", name:"st_name_short", fieldLabel:"购物店简称", maxLength:"100"},
            {id:"st_telephone", name:"st_telephone", fieldLabel:"购物店电话", maxLength:"100"},
            province_combo,
            city_combo,
            county_combo,
            sp_type_dict.box,
            {id:"st_property",name:"st_property",fieldLabel:"附加属性",maxLength:"1000",listeners:{'focus':function(t){attrWin.show(t.id)}}},
            {xtype:'textarea',id:'st_bintroduction',name:"st_bintroduction", fieldLabel:"购物店简介",labelWidth:80,labelAlign:"right"}
        ]
    });
    var store_win=new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:store_form,
        buttons:[
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                store_win.hide();
            }}
        ]
    })
    sp_type_num=1;
    store_win.on('show',function(){
        if(sp_type_num==1){
            sp_type_dict.box.getStore().load();
            pro_store.load();
        }
        Ext.getCmp('sp_type_id').setValue('果脯')
        sp_type_num++;
    })
    store_win.on('hide',function(){
        store_form.form.reset();
    })


    /******************** 购物店grid  end ***************************/


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


    contact_store.on('beforeload',function(){
        var row=SUNLINE.getSelected(store_grid);
        if(row==null){
           return false;
        }
    })
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
                    {name:"rc_name", fieldLabel:"<span style='color:red'> * </span>联系人", allowBlank:false,vtype:'NotBlank'},
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
    var price_field = [ {name:"sp_id"} ];
    var price_url = $__app__ + '/StorePrice/dataJson';
    var price_store = new SUNLINE.JsonStore(price_url, price_field,false);
    price_store.on('beforeload',function(){
        var row=SUNLINE.getSelected(store_grid);
        if(row==null){
            return false;
        }
    })
    var price_grid=new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store:price_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有商店政策信息',
            deferEmptyText:true
        },
        tbar : [
            '<b>商店政策</b>:',
            {text:'添加', iconCls:'button-add',handler:price_modify},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:price_modify},
            '-',
            {text:'删除', iconCls:'button-del',handler:price_del},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){price_store.reload();}}
        ],
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"sp_id", dataIndex:"sp_id", width:10,hidden:true},
            {header:"sp_st_id", dataIndex:"sp_st_id", width:10,hidden:true},
            {header:"政策名称", dataIndex:"sp_name", width:120},
            //{header:"同行价", dataIndex:"hp_settlement_price", width:80,align:'right',renderer:money},
            {header:"人头返利", dataIndex:"sp_one_price", width:90,align:'right',renderer:money},
            {header:"利润百分比", dataIndex:"sp_pct_num", width:100,align:'right',renderer:function(v){
                if(!v){
                    v='无'
                }else{
                    v=v+'%';
                }
                return v;
            }},
            {header:"适用省份", dataIndex:"sp_province", width:180,renderer:function(v){
                return "<span title='"+v+"'>"+v+"</span>"
            }},
            {header:"有效期", dataIndex:"sp_data", width:180,renderer:function(v,m,r){
                return data_look(r.get('sp_start_time'))+' 至 '+data_look(r.get('sp_end_time'))
            }}
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:price_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有商店政策信息'
        })
    });
    function price_del(){
        var row=SUNLINE.getSelected(price_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要删除的商店政策信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该商店政策信息吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/StorePrice/del',
                    params:{sp_id:row.data.sp_id},
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
    var pro_url = $__app__ + '/StorePrice/apply_province';
    var pro_field = [{name:"id"}];
    var pro_store = new SUNLINE.JsonStore(pro_url, pro_field,false);

    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        items:[
            {
                cls:'tcol2',
                defaults:{xtype:'textfield',labelWidth:80,width:280,labelAlign:"right",style:'margin-top:5px;'},
                items:[
                    {name:"sp_id", fieldLabel:"sp_id",hidden:true},
                    {name:"sp_st_id", fieldLabel:"sp_st_id",hidden:true},
                    {id:'sp_org_name',fieldLabel:"商店名称",labelWidth:80,labelAlign:"right",disabled:true,width:560},
                    {id:'sp_name',name:"sp_name", fieldLabel:"政策名称",labelWidth:80,labelAlign:"right",allowBlank:false,width:560},
                    {name:"sp_one_price", fieldLabel:"人头返利", xtype:'numberfield'},
                    {name:"sp_pct_num", fieldLabel:"利润百分比", xtype:'numberfield'},
                    SUNLINE.ExtDateField({id:'sp_start_time',name:'sp_start_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>开始时间",width:280,gang:'sp_end_time',start:true}),
                    SUNLINE.ExtDateField({id:'sp_end_time',name:'sp_end_time',labelWidth:80,labelAlign:"right",style:'margin-top:5px;',fieldLabel:"<span style='color:red'> * </span>结束时间",width:280,gang:'sp_start_time'})
                ]
            },
            {
                width:560,
                labelWidth:80,
                labelAlign:"right",
                xtype: 'tagfield',
                allowBlank:false,
                name:'sp_province[]',
                id:'sp_province',
                fieldLabel: '<span style="color:red"> * </span>适用省份',
                store:pro_store,
                value: [''],
                displayField: 'name',
                valueField: 'name',
                reference: 'locations',
                filterPickList: true,
                createNewOnEnter: true,
                createNewOnBlur: true,
                queryMode: 'local',
                publishes: 'name'
            },
            { xtype:'textarea',id:'sp_remark',name:"sp_remark", fieldLabel:"政策说明", labelWidth:80,maxLength:"200", height:60,width:560,labelAlign:"right",style:'margin-top:5px;'}
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
    price_form_win.on('hide',function(){
        price_form.form.reset();
    })
    var pro_store_num=1;
    price_form_win.on('show',function(){
        if(pro_store_num==1) pro_store.load();
        pro_store_num++;
    })
    function price_dosave(){
        if (!price_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
            return;
        };

        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();

        var row=SUNLINE.getSelected(store_grid);
        var data= price_form.getForm().getValues();
        if(row){
            data['sp_st_id']=row.get('st_id');
        }
        var hotel_row=SUNLINE.getSelected(store_grid);
       // data['sp_name']=hotel_row.data.st_name;
        data['sp_type']=hotel_row.data.st_type;
        Ext.Ajax.request({
            url:$__app__ + '/StorePrice/save',
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
    function price_modify(v){
        var hotel_row=SUNLINE.getSelected(store_grid);
        if(hotel_row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的购物店信息！');
            return false;
        }
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(price_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的商店政策信息！');
                return false;
            }
        }
        price_form_win.show();
        if(v.text=='编辑'){
            if(row.data.sp_start_time.indexOf("-")<=0){
                row.data.sp_start_time=data_look(row.data.sp_start_time);
            }
            if(row.data.sp_end_time.indexOf("-")<=0){
                row.data.sp_end_time=data_look(row.data.sp_end_time);
            }
            if(row.data.sp_province.constructor != Array) row.data.sp_province=row.data.sp_province.split(',');

            price_form.form.setValues(row.data);
        }
        Ext.getCmp('sp_org_name').setValue(hotel_row.data.st_name);
        price_form_win.setTitle(v.text+"商店政策信息", v.iconCls);
    }
    /******************** 联系人 end *****************************/

    var right_panel = new Ext.panel.Panel({
        border : false,
        style:'border-left:1px solid #009DDA ',
        split :{size:3},
        region : 'east',
        width:500,
        minWidth : 400,
        maxWidth : 600,
        layout :'border',
        items : [price_grid,contact_grid]
    });


    var left_panel=new Ext.panel.Panel({
        border : false,
        split : {size:3},
        region : 'center',
        layout :'border',
        tbar: [
            {text:'添加', iconCls:'button-add',handler:store_modify, disabled:isDisabled('Store::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:store_modify, disabled:isDisabled('Store::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:store_del, disabled:isDisabled('Store::del')},
            '-',
            {text:'地图', iconCls:'button-edit',handler:editMap, disabled:isDisabled('Plugs::plugs')},
            '-',
            {text:'图片管理', iconCls:'button-edit',handler:store_pic, disabled:isDisabled('Pic::index')},
            '-'
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有购物店信息'
        }),
        items : [left_tree,store_grid]
    });

    new Ext.Viewport({
        layout:'border',
        items:[left_panel,right_panel]
    });

    function store_pic(){
        var row=SUNLINE.getSelected(store_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的购物店信息！');
            return false;
        }
        pic_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/table_model/购物店/table_id/'+row.data.st_id;
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

    function store_modify(v){
        if(v.text == '编辑'){
            var row=SUNLINE.getSelected(store_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的购物店信息！');
                return false;
            }
        };
        store_win.setTitle(v.text + '购物店信息');
        store_win.show(v.id);
        if(v.text == '编辑'){
            store_form.form.setValues(row.data);
        }
    }

    function store_del(v){
        var row=SUNLINE.getSelected(store_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的购物店信息！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该购物店吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/Store/save',
                    params:{st_id:row.data.st_id,st_status:'del'},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功！');
                        if(result.status ==1){
                            store_store.reload();
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


    function contact_modify(v){
        var store_row=SUNLINE.getSelected(store_grid);

        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(contact_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的联系人信息！');
                return false;
            }
        }else{
            if(store_row==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的购物店信息！');
                return false;
            }
        }
        contact_form_win.setTitle(v.text + '联系人信息');
        contact_form_win.show();
        if(v.text=='编辑'){
            contact_form.form.setValues(row.data);
        }else{
            var data={};
            data['rc_pid']=store_row.data.st_id;
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
                    params:{rc_id:row.data.rc_id,'rc_status':'del'},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', '删除成功！');
                        if(result.status ==1){
                            contact_store.reload();
                        }
                    },
                    failure:function (response, otps) {
                        myMask.hide();
                        Ext.Msg.alert('友情提示', '删除失败！');
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
                var store_data=SUNLINE.getSelected(store_grid);
                data['rc_pid']=store_data.get('st_id');
                data['rc_type']='购物店';
                Ext.Ajax.request({
                    url : $__app__ + '/ResourceContact/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示','操作成功!');
                        if (ret.status){
                            contact_store.reload();
                            contact_form_win.hide();
                        };
                        myMask.hide();
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
        if(!store_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        Ext.MessageBox.confirm('友情提示','确认要保存？',function(v){
            if(v=='yes'){
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                var data=store_form.getForm().getValues();
                Ext.Ajax.request({
                    url : $__app__ + '/Store/save',
                    method:'POST',
                    params : data,
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        var info=ret.info;
                        Ext.Msg.alert('友情提示',info.msg);
                        if (ret.status){
                            store_store.reload();
                            tree_store.reload();
                            store_win.hide();
                        };
                        myMask.hide();
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
        var province = r.get('st_province');
        if(province == null) {province = ""};
        var city = r.get('st_city');
        if(city == null) {city = ""};
        var county = r.get('st_county') ? r.get('st_county') : "";
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
                cls:'search-icon-cls',
                triggerCls:'x-form-search-trigger',
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
            '&nbsp; 大小:', { xtype : 'numberfield', id : 'map_size', width : 40, readOnly:true},
            {text:'保存', iconCls:'button-save',handler:saveMapInfo}
        ],
        html:'<iframe id="ifm_map" name="ifm_map" src="" width="100%" height="100%" frameborder=0></iframe>'
    });




    function editMap(b){
        var row=SUNLINE.getSelected(store_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的景点');
            return;
        };
        ROW.id=row.data.st_id;
        ROW.mapx=row.data.st_mapx;
        ROW.mapy=row.data.st_mapy;
        ROW.mapz=row.data.st_mapz;
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
        var lng = Ext.getCmp('map_lng').getValue(),
            lat = Ext.getCmp('map_lat').getValue(),
            size = Ext.getCmp('map_size').getValue();
        if(!lng){
            Ext.Msg.alert('友情提示','请您点击地图选择位置！');
            return;
        }
        var _myMask=SUNLINE.LoadMask('正在保存单位地理信息，请稍候...');
        _myMask.show();
        var row=SUNLINE.getSelected(store_grid);
        Ext.Ajax.request({
            url: $__app__ + '/Store/save',
            params: { st_id:ROW.id, st_mapx:lat, st_mapy:lng, st_mapz:size},
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    Ext.Msg.alert( '友情提示',$rst.info.msg);
                    if ($rst.status){
                        map_win.hide();
                        store_store.reload();
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

    function data_look(v){
        return v.substr(0,4)+'-'+v.substr(4,2)+'-'+v.substr(6,2);
    }

    /********************* 地图 end ****************/
    window.main_reload=function(){
        store_store.reload();
    }
});
