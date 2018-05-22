var ROW = {} , TROW = {} , PROW = {} ;
var cityCombo="";
ORGTree.rootText = '所有酒店';
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    window.org_id = top._uinfo.u_jgid;
    window.pageSize = top._uinfo.u_setup.pageSize ? top._uinfo.u_setup.pageSize : $app_page_size;
    var thisTitle = "酒店管理";

    function formatPic(v,m,r){
        var ht_cover = r.get('ht_cover');    //
        if(ht_cover){
            pic_path = format_pic_path(ht_cover, "_m");
            return "<img style='height: 20px;' src='" + pic_path + "' qtip='<img src=\"" + pic_path + "\">'>";
        }
    };

    var org_combo = [];
    if (_uinfo.u_dj == '平台级') {
        org_combo = ['->','选择单位：', org_ComboBox];
        _org_tree_loader.baseParams['_in'] = 'org_type::many,,single::s';
    };

/*    org_ComboBox.on('treeClick', function (org, treeNode) {
        store.baseParams = {ht_org_id : org.org_id};
        store.load();
    });*/
    /********************* 省、市、区/县 start **********************/
    var provinceCombo = SUNLINE.provinceCombo("ht_province");
    provinceCombo.on({
        'select': function(_t, record, index){
            var cityCombo_store = cityCombo.getStore();
            cityCombo_store.baseParams['pid'] = record.get('id');
            cityCombo_store.load();
        }
    });

    var cityCombo = SUNLINE.cityCombo("ht_city");
    cityCombo.on({
        'select': function(_t, record, index){
            var countyCombo_store = countyCombo.getStore();
            countyCombo_store.baseParams['pid'] = record.get('id');
            countyCombo_store.load();
        }
    });

    function show_name(v, m, r){
        var org= r.get('ht_org_id');
        if (org==0) v='<span style="color:blue;" qtip="<b>系统级资源</b><br>小八为您事先准备了些已知资源，您不用再输入了，可以直接选用，并添加与其合作的价格信息。">'+ v +'</span>';
        return v;
    };

    var countyCombo = SUNLINE.countyCombo("ht_county");
    /********************* 省、市、区/县 end **********************/

    /********************* 左边酒店 start *************************/
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
    var store = new SUNLINE.JsonStore(url, field);

    var grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:store,
        style:'border-left-width:1px; ',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有酒店信息',
            deferEmptyText:true
        },
        columns:[
            {header:"状态", dataIndex:"ht_status", width:50},
            {header:"酒店名称", dataIndex:"ht_name", width:180, renderer:show_name },
            {header:"酒店电话", dataIndex:"ht_telephone", width:120},
            {header:"封面图片", dataIndex:"ht_cover", width:120, renderer:formatPic}
        ],
        tbar : [
            {text:'刷新', iconCls:'button-ref', handler:function(){store.reload();}},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerClass:'x-form-search-trigger',
                id:'search',
                emptyText:'酒店名称、拼音码',
                width:150,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            dosearch();
                        }
                    }
                }
            }
        ]
    });

    function __editPic(b){
        _editPic(b, grid, "酒店");
    };
    /********************* 左边酒店 start *************************/

    /********************* 监听左边 start *************************/
        //票
    grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
        // 1.加载房价
        var row = grid.getSelectionModel().getSelected();
        if (row) {
            ROW.data = row.data;
        };
        var scId = r.data.ht_id;   //获取被选中的ID
        price_store.baseParams['rp_resources_id'] = scId;
        price_store.load();

        // 2.加载联系方式
        var ht_id = r.data.ht_id;
        loadLinkForm(ht_id);
    });

    function loadLinkForm(ht_id){
        var so = _hotel_info.getForm();
        so.reset();
        _hotel_info.getForm().load({
            waitTitle : '提示', //标题
            params:{rt_id:ht_id},
            url : $__app__ + '/HotelOrg/loadLinkForm', //请求的url地址
            method : 'POST', //请求方式
            success : function (form, action) { //加载成功的处理函数
                so.setValues(action.result.data);
            },
            failure : function (form, action) { //加载失败的处理函数
                so.setValues("");
            }
        });
    };
    /********************* 监听左边 end *************************/

    /********************* 右上房价 start *************************/
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

    var price_storeUrl = $__app__ + '/HotelPrice/dataJson';
    var price_store = new SUNLINE.JsonStore(price_storeUrl, price_field, false);

    var _price_grid = new Ext.grid.GridPanel({
        border : false,
        region : 'center',
        store:price_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有酒店信息',
            deferEmptyText:true
        },
        tbar : [
            {text:'添加房价', iconCls:'button-add', handler:editTicket},
            '-',
            {text:'编辑房价', iconCls:'button-edit', handler:editTicket},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){price_store.reload();}},
            '->',
            {
                icon:$app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls:'x-btn-icon',
                tooltip:'重载' + thisTitle,
                handler:function () {
                    window.location.reload();
                }
            },
            '-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function () {
                    parent.CloseTab();
                }
            }
        ],
        columns:[
            {header:"房价名称", dataIndex:"rp_name", width:150},
            {header:"销售价格", dataIndex:"rp_price_sales", width:80},
            {header:"结算价格", dataIndex:"rp_price_settle", width:80},
            {header:"退票价格", dataIndex:"rp_price_refund", width:80},
            {header:"结算方式", dataIndex:"rp_payment", width:80}
        ]
    });
    /************************** 右上房价 end ***************************/

    /************************ 添加/修改房价 start *************************/
    var price_form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"rp_id", name:"rp_id", fieldLabel:"ID", maxLength:"10", xtype:"hidden"},
            {id:"rp_resources_type", name:"rp_resources_type", fieldLabel:"所属类型", maxLength:"10", xtype:"hidden", value:'酒店'},
            {id:"rp_resources_id", name:"rp_resources_id", fieldLabel:"酒店ID", maxLength:"10", xtype:"hidden",value:''},
            {id:"rp_name", name:"rp_name", fieldLabel:"房价名称", maxLength:"50"},
            /*{
                xtype:"combo",
                id:"rp_peer",
                name:"rp_peer",
                fieldLabel:"同行销售",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['rp_peer'], data:[
                    ['是'],
                    ['否']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"rp_peer",
                displayField:"rp_peer",
                mode:"local",
                value:'否'
            },
            {id:"rp_price_peer", name:"rp_price_peer", fieldLabel:"同行价格"},
            {
                xtype:"combo",
                id:"rp_retail",
                name:"rp_retail",
                fieldLabel:"是否零售",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['rp_retail'], data:[
                    ['是'],
                    ['否']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"rp_retail",
                displayField:"rp_retail",
                mode:"local",
                value:'否'
            },*/
            {id:"rp_price_retail", name:"rp_price_retail", fieldLabel:"挂牌价格"},
            {id:"rp_price_sales", name:"rp_price_sales", fieldLabel:"销售价格"},
            {id:"rp_price_settle", name:"rp_price_settle", fieldLabel:"结算价格"},
            {id:"rp_price_refund", name:"rp_price_refund", fieldLabel:"退款价格"},
            {
                xtype:"combo",
                id:"rp_payment",
                name:"rp_payment",
                fieldLabel:"结算方式",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['rp_status'], data:[
                    ['签单'],
                    ['现金结算']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"rp_status",
                displayField:"rp_status",
                mode:"local",
                value:'现金结算'
            },
            {id:"rp_desc", name:"rp_desc", fieldLabel:"备注说明", maxLength:"200", xtype:"textarea"}
        ]
    });

    var price_win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:price_form,
        buttons:[
            {text:'保存', handler:dosave_price},
            {text:'关闭', handler:function () {
                price_win.hide();
            }}
        ]
    });

    function editTicket(b) {
        var row = grid.getSelectionModel().getSelected();
        if (b.text == '添加房价') {
            if (!row) {
                Ext.Msg.alert('友情提示', '请在左边区域单击选择要添加房价的酒店');
                return;
            };
            TROW.data = "";
        }else if (b.text == '编辑房价') {
            var trow = _price_grid.getSelectionModel().getSelected();
            if (!trow) {
                Ext.Msg.alert('友情提示', '请在下面区域单击选择要编辑的房价');
                return;
            };
            TROW.data = trow.data;
        };
        price_win.setTitle(b.text);
        price_win.show(b.id);
    };

    price_win.on('show', function (w) {
        var f = price_form.getForm();
        f.reset();
        f.setValues(TROW.data);
    });

    function dosave_price() {
        var s = price_form.getForm().getValues();
        s.rp_resources_id = ROW.data.ht_id;
        s.rp_resourname = ROW.data.ht_name;
        if(!s.ht_id){
            s.rp_org_id = org_id;
        };
        Ext.Ajax.request({
            url:$__app__ + '/HotelPrice/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var  msg  = result.info;
                if (result.status ==1) {
                    price_win.hide();
                    price_store.load();
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败');
            }
        })
    }
    /************************ 添加/修改房价 end *************************/

    /******************** 右下联系方式 start **********************/
    var _hotel_info = new Ext.form.FormPanel({
        bodyStyle : 'padding:10px;',
        //style : 'border-top:1px solid #ccc',
        split : true,
        region : 'south',
        //autoHeight : true,
        border : false,
        height : 220,
        minHeight : 220,
        maxHeight : 220,
        defaultType : 'textfield',
        items : [
            {id:"ro_id",name:"ro_id",fieldLabel:"ID",maxLength:"10",allowBlank:false,xtype:"hidden"},
            {id:"ro_org_id",name:"ro_org_id",fieldLabel:"批发商ID",maxLength:"10",allowBlank:false,xtype:"hidden"},
            {id:"ro_resources_id",name:"ro_resources_id",fieldLabel:"酒店ID",maxLength:"10",allowBlank:false,xtype:"hidden"},
            {id:"ro_resources_type",name:"ro_resources_type",fieldLabel:"酒店类型",maxLength:"10",allowBlank:false,xtype:"hidden"},
            {id:"ro_contact_name",name:"ro_contact_name",fieldLabel:"联系人",maxLength:"10",allowBlank:false},
            {id:"ro_mobile_phone",name:"ro_mobile_phone",fieldLabel:"手机",maxLength:"11",allowBlank:false,xtype:"numberfield"},
            {id:"ro_telephone",name:"ro_telephone",fieldLabel:"办公室电话",maxLength:"20"},
            {id:"ro_foxnumber",name:"ro_foxnumber",fieldLabel:"传真",maxLength:"20"},
            {id:"ro_email",name:"ro_email",fieldLabel:"邮箱",maxLength:"20"},
            {id:"ro_position",name:"ro_position",fieldLabel:"职务",maxLength:"20"}
        ],
        bbar : [
            '->',
            {text:'保存联系人', iconCls:'button-save', handler:dosave_link}
        ]
    });
    /********************* 右下联系方式 end *************************/

    /********************* 左边树 start *************************/
    var _west = new Ext.tree.TreePanel({
        tbar : [
            "酒店地区分布",
            "->",
            {text : '折叠', iconCls:"code", handler:function(b){
                var root = _west.getRootNode();
                _west.getLoader().load(root);
                root.expand(false);
            }
            }],
        region:'west',
        width:'200',
        useArrows: true,
        autoScroll: true,
        animate: true,
        enableDD: true,
        containerScroll: true,
        border: false,
        dataUrl: 'getNodes',
        root: {
            nodeType: 'async',
            text: '全部',
            draggable: false,
            id: 'all'
        }
    });

    _west.on('click', function (node, event) {
        var n = node.id;    //取得文字信息
        store.baseParams['node'] = n;
        store.load();
    });
    /********************* 左边树 end *************************/

    var _east = new Ext.Panel({
        border : false,
        style:'border-left-width:1px; ',
        split : true,
        region : 'east',
        width:500,
        minWidth : 400,
        maxWidth : 600,
        layout :'border',
        items : [_price_grid, _hotel_info]
    });

    /******************************* 添加/编辑酒店 start *****************************/
    var form = new Ext.form.FormPanel({
        border:false,
        bodyStyle:'background:none;padding:10px',
        labelWidth:80,
        labelAlign:'right',
        defaultType:'textfield',
        defaults:{anchor:'90%' },
        items:[
            {id:"ht_id", name:"ht_id", fieldLabel:"ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"ht_org_id", name:"ht_org_id", fieldLabel:"编辑权限单位ID", maxLength:"10", allowBlank:false, xtype:"hidden"},
            {id:"ht_name", name:"ht_name", fieldLabel:"酒店名称", maxLength:"100", allowBlank:false},
            {id:"ht_name_short", name:"ht_name_short", fieldLabel:"酒店简称", maxLength:"100", allowBlank:false},
            provinceCombo,
            cityCombo,
            countyCombo,
            {id:"ht_telephone", name:"ht_telephone", fieldLabel:"酒店电话", maxLength:"100"},
            {id:"ht_mapx", name:"ht_mapx", fieldLabel:"坐标X", maxLength:"100", disabled:true},
            {id:"ht_mapy", name:"ht_mapy", fieldLabel:"坐标Y", maxLength:"100", disabled:true},
            {id:"ht_mapz", name:"ht_mapz", fieldLabel:"地图大小", maxLength:"100", disabled:true},
            {id:"ht_attribute",name:"ht_attribute",fieldLabel:"附加属性",maxLength:"1000",listeners:{'focus':function(t){attrWin.show(t.id)}}},
            {
                xtype:"combo",
                id:"ht_status",
                name:"ht_status",
                fieldLabel:"是否有效",
                allowBlank:false,
                store:new Ext.data.SimpleStore({fields:['ht_status'], data:[
                    ['有效'],
                    ['无效']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"ht_status",
                displayField:"ht_status",
                mode:"local",
                value:'有效'
            }
        ]
    });

    var win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:form,
        buttons:[
            {text:'保存到系统', hidden:(_uinfo.u_dj=='平台级') ? false : true, handler:dosave},
            {text:'保存', handler:dosave},
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });

    //酒店 - 保存
    function dosave(b) {
        var c = form.getForm().isValid();
        if (!c) {
            return;
        }
        var s = form.getForm().getValues();
        if(b.text != '保存到系统'){
            if(!s.ht_id){
                s.ht_org_id = org_id;
            }
        }else{
            s.ht_org_id = 0;
        };
        Ext.Ajax.request({
            url:$__app__ + '/Hotel/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var  msg  = result.info.msg;
                if (result.status ==1) {
                    win.hide();
                    if (s.ht_id==''){
                        s.ht_id = result.info.ht_id;
                        store.insert(0, new Ext.data.Record(s) );
                    }else{
                        store.reload();
                    }
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败');
            }
        })
    }

    //联系方式保存
    function dosave_link() {
        if(ROW.data == null){
            Ext.Msg.alert('友情提示', '请在左边区域单击选择要编辑联系方式的酒店');
            return;
        };
        var s = _hotel_info.getForm().getValues();
        if(!s.ho_id){
            s.ro_org_id = org_id;
        };
        s.ro_resources_id = ROW.data.ht_id;
        s.ro_resources_type = '酒店';
        Ext.Ajax.request({
            url:$__app__ + '/HotelOrg/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var result = Ext.decode(response.responseText);
                var  msg  = result.info;
                if (result.status ==1) {
                    //loadLinkForm(s.ho_hotel_id);
                };
                Ext.Msg.alert('友情提示', msg);
            },
            failure:function (response, otps) {
                Ext.Msg.alert('友情提示', '操作失败');
            }
        })
    }

    //酒店-搜索
    function dosearch() {
        var skey = Ext.getCmp('search').getValue();
        store['baseParams'] = {skey:skey};
        store.load({params:{start:0, limit:pageSize}});
    };

    //酒店-删除
    function dodelete() {
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要删除的酒店');
            return;
        };
        if (row.data.ht_org_id == 0) {
            if(_uinfo.u_dj!='平台级'){
                Ext.Msg.alert('友情提示', '系统级别酒店不能删除！');
                return;
            }
        };
        Ext.MessageBox.confirm('友情提示', '确定删除该酒店吗？', callBack);
        function callBack(id) {
            if (id == 'yes') {
                var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在删除，请稍后...'});
                mask.show();
                var s = row.data;
                Ext.Ajax.request({
                    url:$__app__ + '/Hotel/del',
                    params:{ht_id:s.ht_id},
                    method:'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            grid.store.remove(grid.getSelectionModel().getSelected());
                        }
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '删除失败');
                    }
                })
            }
        }
    }

    //酒店增加、修改
    function modify(b) {
        if (b.text == '添加') {
            ROW.data = "";
        }else if (b.text == '编辑') {
            var row = grid.getSelectionModel().getSelected();
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要编辑的酒店信息');
                return;
            };
            ROW.data = row.data;
            if (row.data.ht_org_id == 0) {
                if(_uinfo.u_dj!='平台级'){
                    Ext.Msg.alert('友情提示', '系统级别酒店不能修改！');
                    return;
                }
            }
        };
        win.setTitle(b.text + '酒店信息');
        win.show(b.id);
    };

    win.on('show', function (w) {
        var f = form.getForm();
        f.reset();
        f.setValues(ROW.data);
    });
    /******************************* 添加/编辑酒店 end *****************************/

    /********************************** 地图 start ********************************/
    var _map_win = new Ext.Window({
        title : '地理信息',
        width : 770,
        height: 400,
        closeAction : 'hide',
        modal : true,
        resizable : false,
        tbar : [
            '搜索：',
            {
                xtype : 'trigger', id:'map_search', width:180,
                triggerClass:'x-form-search-trigger',
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
            {text:'刷新',handler:function(){window.ifm_map.location.reload();}},
            '->',
            '经度：', { xtype : 'hidden', id:'cityName', width : 90, readOnly:true },
            '经度：', { xtype : 'textfield', id:'map_lng', width : 90, readOnly:true },
            '&nbsp; 纬度：', { xtype : 'textfield', id:'map_lat', width : 90, readOnly:true },
            '&nbsp; 大小：', { xtype : 'numberfield', id : 'map_size', width : 40, readOnly:true },
            {text:'保存设置', iconCls:'button-save',handler:saveMapInfo}
        ],
        html:'<iframe id="ifm_map" name="ifm_map" src="" width="100%" height="100%" frameborder=0></iframe>'
    });

    function editMap(b) {
        var row = grid.getSelectionModel().getSelected();
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的酒店');
            return;
        };
        ROW.data = row.data;
        if (row.data.ht_org_id == 0) {
            Ext.Msg.alert('友情提示', '系统级别酒店不能修改！');
            return;
        };
        ROW.data = row.data;
        _map_win.show(b.id);
    };

    _map_win.on('show', function(w){
        Ext.getCmp('map_search').setValue(ROW.data.org_addr);
        var map_lng = Ext.getCmp('map_lng');
        var map_lat = Ext.getCmp('map_lat');
        var map_size = Ext.getCmp('map_size');
        var cityName = Ext.getCmp('cityName');
        map_size.setValue(''); map_lat.setValue(''); map_lng.setValue(''); cityName.setValue('');
        if (ROW.data.ht_mapy) {map_lng.setValue(ROW.data.ht_mapy)};
        if (ROW.data.ht_mapx) {map_lat.setValue(ROW.data.ht_mapx)};
        if (ROW.data.ht_mapz) {map_size.setValue(ROW.data.ht_mapz)};
        if (ROW.data.ht_city) {cityName.setValue(ROW.data.ht_city)};
        var url = $__app__ + '/plugs/map/my_point_hotel.html?_dc=' + time();
        window.ifm_map.location = url;
    });

    function saveMapInfo(){
        var lng = Ext.getCmp('map_lng').getValue(),
            lat = Ext.getCmp('map_lat').getValue(),
            size = Ext.getCmp('map_size').getValue();
        var _myMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在保存单位地理信息，请稍候..."});
        _myMask.show();
        Ext.Ajax.request({
            url: $__app__ + '/Hotel/save',
            params: { ht_id: ROW.data.ht_id, ht_mapx:lat, ht_mapy:lng, ht_mapz:size },
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    if ($rst.status){
                        _map_win.hide();
                        window.ROW.data['ht_mapx'] = lat;
                        window.ROW.data['ht_mapy'] = lng;
                        window.ROW.data['ht_mapz'] = size;
                        //renderCompanyInfo(window.ROW.data);
                    }else{
                        Ext.Msg.alert( '友情提示',$rst.info?$rst.info: '未知错误。单位地理信息未能保存成功！' );
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
    /********************************** 地图 end ********************************/

    /******************************* 酒店属性 start *****************************/
    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">' +
            '<h3 id="{[values.group]}">{[values.gname]}</h3>' +
            '{[ this.renderItems(values)]}' +
            '</tpl>',
        {
            renderItems : function(values){
                var data = values.data, html='<div class="suntour_group_body">';
                for (var i=0; i<data.length; i++){
                    var d=data[i], id = d['id'], attr=d['text'];
                    html += '<div class="select-wrap" id="'+attr+'">'+attr+'</div>';
                };
                html += '<div class="x-clear"></div></div>';
                return html;
            }
        }
    );

    var attrStore = SUNLINE.JsonStore($__app__ + '/Hotel/attr',['group','gname','data'],false);
    attrStore.on('load',function(store){ setSelected(); });

    var attrView = new Ext.DataView({
        store : attrStore,
        tpl : attrTpl,
        autoHeight : true,
        multiSelect : true,
        simpleSelect : true,
        overClass:'x-view-over',
        itemSelector:'div.select-wrap',
        selectedClass : 'selected-wrap',
        emptyText : '暂无自定义属性。',
  //      plugins: [ new Ext.DataView.DragSelector() ]
    });

    var attrWin = new Ext.Window({
        title : '选择自定义属性',
        width : 620,
        //height : 400,
        autoHeight : true,
        modal : true,
        cls : 'suntour_dataView',
        closeAction : 'hide',
        autoScroll : true,
        items: attrView,
        buttons : [
            {text:'确认选择', handler:getSelected},
            {text:'刷新', handler:function(){ attrStore.reload(); }},
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
        attrStore.load();
    });

    function setSelected(){
        var v=Ext.getCmp('ht_attribute').getValue();
        if (v){
            var h = v.split(',');
            attrView.select(h);
        }
    };

    function getSelected(){
        var h = attrView.getSelectedNodes(), sd=[];
        for (var i=0; i < h.length; i++){
            sd.push(h[i].textContent);
        };
        Ext.getCmp('ht_attribute').setValue(sd);
        attrWin.hide();
    };
    /******************************* 酒店属性 end *****************************/

    var _left = new Ext.Panel({
        border : false,
        split : true,
        region : 'center',
        layout :'border',
        style:'border-right-width:1px; ',
        items : [_west, grid],
        tbar: [
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:dodelete},
            '-',
            {text:'地图', iconCls:'button-edit', handler:editMap},
            '-',
            {text:'图片管理', iconCls:'button-edit', handler:__editPic},
            org_combo

        ],

        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有酒店信息'
        })
    });

    new Ext.Viewport({
        layout:'border',
        items:[_left, _east]
    });
});