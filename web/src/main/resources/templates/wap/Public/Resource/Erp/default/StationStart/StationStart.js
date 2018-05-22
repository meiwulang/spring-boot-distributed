var ROW = {};
var WG={};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    var thisTitle = '始发站管理';


    if(_uinfo['org_type']=='管理公司' && _uinfo['org_id']==1){
        var sd_url = $__app__ + '/StationStart/dataJson';
    }else{
        var sd_url = $__app__ + '/StationStart/fen_select';
    }
    var sd_field = [{name:"sd_id"}];
    var sd_store = new SUNLINE.JsonStore(sd_url, sd_field);

    var sd_cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID号", dataIndex:"sd_id", width:60, hidden:true},
        {header:"站点名称", dataIndex:"sd_name", width:180},
        {header:"类型", dataIndex:"sd_type", width:100},
        {header:"交通类型", dataIndex:"sd_start_type", width:100},
        {header:"所属区域", dataIndex:"sd_district", width:200,renderer:fullDress}
    ];

    var sd_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:sd_store,
        style :'border-right-width:1px;',
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有始发站信息',
            deferEmptyText:true
        },
        columns:sd_cm,
        tbar:[
            {text:'添加', iconCls:'button-add',handler:modify, disabled:isDisabled('StationStart::save')},
            '-',
            {text:'编辑', iconCls:'button-edit',handler:modify, disabled:isDisabled('StationStart::save')},
            '-',
            {text:'删除', iconCls:'button-del',handler:st_del, disabled:isDisabled('StationStart::del')},
            '-',
            {text:'地图', iconCls:'button-edit',handler:editMap},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function () {
                sd_store.reload();
            }},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                cls:'search-icon-cls',
                id:'sd_dosearch_id',
                emptyText:'始发站名称',
                width:150,
                onTriggerClick:function (e) {
                    sd_dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            sd_dosearch();
                        }
                    }
                }
            },
            '-',
            {
                icon: $app_public_images_path + 'arrow_rotate_anticlockwise.png',
                cls: 'x-btn-icon',
                tooltip: '重载' + thisTitle,
                handler:function(){window.location.reload();}
            },'-',
            {
                icon:$app_public_images_path + 'close.gif',
                cls:'x-btn-icon',
                tooltip:getCloseQtip(thisTitle),
                handler:function(){parent.CloseTab();}
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:sd_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有始发站信息'
        })
    });


    function sd_dosearch(){
        var key=Ext.getCmp('sd_dosearch_id').getValue();
        SUNLINE.baseParams(sd_store,{skey:key});
        sd_store.currentPage=1;
        sd_store.load();
    }

    //添加表单
    var province_combo=SUNLINE.ComBoxCity({
        id:'sd_province',
        where:{city_type:'province'},
        config:{fieldLabel:"省份",labelWidth:80,width:300,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('sd_city_id').getValue() ) Ext.getCmp('sd_city_id').setValue();
                if( Ext.getCmp('sd_county_id').getValue() ) Ext.getCmp('sd_county_id').setValue();
            }
        }}
    })
    var city_combo=SUNLINE.ComBoxCity({
        id:'sd_city',
        where:{city_type:'city'},
        appTo:'sd_province',
        config:{fieldLabel:"城市",labelWidth:80,width:300,labelAlign:'right',allowBlank:false,editable:false, listeners:{
            select:function(){
                if( Ext.getCmp('sd_county_id').getValue() ) Ext.getCmp('sd_county_id').setValue();
            }
        }}
    })
    var county_combo=SUNLINE.ComBoxCity({
        id:'sd_county',
        where:{city_type:'county'},
        appTo:'sd_city',
        config:{fieldLabel:"区/县",labelWidth:80,width:300,labelAlign:'right',editable:false, allowBlank:false}
    });
    var org_type_bool=true;
    if(_uinfo.org_type=='管理公司'){
        org_type_bool=false;
    }
    var sd_start_type_combo=SUNLINE.DictComBox_false({id:'sd_start_type',name:'sd_start_type',fieldLabel:"交通方式",labelWidth:80,
        width:300,labelAlign:"right",allowBlank:false,readOnly:org_type_bool},{'d_type':'交通类目'});
    var sd_form = new Ext.form.FormPanel({
        border:false,
        defaultType:'textfield',
        bodyStyle:'background:none;padding:10px',
        defaults:{width:300, labelWidth:80, labelAlign:'right'},
        items:[
            {id:"sd_id", name:"sd_id", fieldLabel:"ID", maxLength:"10", xtype:"hidden",labelAlign:"right"},
            {name:"sd_name", fieldLabel:"站点名称",labelAlign:"right", allowBlank:false,vtype:'NotBlank'},
            sd_start_type_combo.box,
            {name:"sd_code", fieldLabel:"三字编码",labelAlign:"right", vtype:'NotBlank',hidden:org_type_bool},
            {
                xtype:"combo",
                id:"sd_type",
                name:"sd_type",
                fieldLabel:"类型",
                labelAlign:"right",
                store:new Ext.data.SimpleStore({fields:['sd_type'], data:[
                    ['始发站'],['出发口岸']
                ]}),
                triggerAction:"all",
                editable:false,
                valueField:"sd_type",
                displayField:"sd_type",
                mode:"local",
                value:'始发站',
                hidden:true
            },
            province_combo,
            city_combo,
            county_combo
        ]
    });

    var sd_win = new Ext.Window({
        width:380,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        items:sd_form,
        buttons:[
            {text:'保存', handler:sd_save},
            {text:'关闭', handler:function () {
                sd_win.hide();
            }}
        ]
    });
    var sd_start=1;
    sd_win.on('show',function(){
        if(sd_start==1)sd_start_type_combo.box.getStore().load();
        sd_start++;
    })
    function sd_save(){
        if (!sd_form.getForm().isValid()) {
            Ext.Msg.alert('友情提示', '红色边框显示为必填项');
            return;
        };
        var myMask=SUNLINE.LoadMask('数据提交中，请稍后...');
        myMask.show();
        var s = sd_form.getForm().getValues();
        Ext.Ajax.request({
            url:$__app__ + '/StationStart/save',
            params:s,
            method:'POST',
            success:function (response, otps) {
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示',info.msg);
                if (ret.status){
                    sd_store.reload();
                    sd_win.hide();
                }
                myMask.hide();
            },
            failure:function (response, otps) {
                myMask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    }

    //添加-修改方法
    function modify(v){
        if(v.text=='编辑'){
            var row=SUNLINE.getSelected(sd_grid);
            if(row==null){
                Ext.Msg.alert('提示信息','请选择您要操作的内容');
                return false;
            }
            sd_win.show();
            sd_form.getForm().setValues(row.data);
        }else{
            sd_win.show();
            if(org_type_bool===true){
                Ext.getCmp('sd_start_type').store.add({d_text:'汽车'});
                Ext.getCmp('sd_start_type').setValue('汽车');
            }
        }
        sd_win.setTitle(v.text+"始发站信息", v.iconCls);
    }

    sd_win.on('hide',function(){
        sd_form.getForm().reset();
    })

    //删除
    function st_del(){
        var row=SUNLINE.getSelected(sd_grid);
        if(row==null) {
            Ext.Msg.alert('友情提示', '请选择您要操作的始发站点！');
            return false;
        }
        Ext.MessageBox.confirm('友情提示','确定删除该始发站点吗？',function(id){
            if (id == 'yes') {
                var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/StationStart/del',
                    params:{sd_id:row.data.sd_id},
                    method:'POST',
                    success:function (response, otps) {
                        myMask.hide();
                        var result = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', result.info);
                        if(result.status ==1){
                            sd_store.reload();
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

    //修改值
    sd_win.on('show',function(){
        sd_form.getForm().reset();
        sd_form.getForm().setValues(WG.values);
    });

    /**
     * 完整的地点
     * @param v
     * @param m
     * @param r
     * @return {String}
     */
    function fullDress(v,m,r){
        var province = r.get('sd_province');
        if(province == null) {province = ""};
        var city = r.get('sd_city');
        if(city == null) {city = ""};
        var county = r.get('sd_county') ? r.get('sd_county') : "";
        if(county == null) {county = ""};
        return province + '-' + city + '-' + county ;
    };

    new Ext.Viewport({
        layout : 'border',
        items : [sd_grid]
    });


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
                width:100,
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
            {text:'刷新',handler:function(){window.ifm_map.location.reload();}},
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
        var row=SUNLINE.getSelected(sd_grid);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要设置地理位置的始发地');
            return;
        };
        ROW.id=row.data.sd_id;
        ROW.mapx=row.data.sd_mapx;
        ROW.mapy=row.data.sd_mapy;
        ROW.mapz=row.data.sd_mapz;
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
        var row=SUNLINE.getSelected(sd_grid);
        Ext.Ajax.request({
            url: $__app__ + '/StationStart/save',
            params: { sd_id:ROW.id, sd_mapx:lat, sd_mapy:lng, sd_mapz:size},
            success: function(response, opts) {
                _myMask.hide();
                try{
                    var $rst = Ext.decode(response.responseText);
                    Ext.Msg.alert( '友情提示',$rst.info.msg);
                    if ($rst.status){
                        map_win.hide();
                        sd_store.reload();
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









});