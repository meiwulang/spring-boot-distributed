/**
 * Created by zsl on 2017/2/8.
 */
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var thisTitle = '产品推荐';
    var url=$__app__+'/Products/dataJson';
    var field=[];
    var store=SUNLINE.GroupingStore(url,field,{sortInfo:{field:'p_id',direction: "DESC"}});
    function name_fn(v,i,r){
        var enid = r.get('p_enid');
        var url = $__app__+"/detail.html?p_id="+enid;
        return '<a href = "'+url+'" target = "_blank" style="color:blue">【预览】</a> '+v;
    }
    function name_short_fn(v,i,r){
        var enid = r.get('p_enid');
        var url = $__app__+"/Goal/"+enid;
        return '<a href = "'+url+'" target = "_blank">'+v+'</a>';
    }
    function status_fn(v,i,r){
        if(v=='待审核')return '<font style="color:red;font-weight: bold">'+ v+'</font>';
        return '<font style="color:#999999;font-weight: bold">'+ v+'</font>';
    }
    function time_fn(val){
        var date=new Date(parseInt(val)*1000);
        return Ext.Date.format(date,'Y-m-d H:i:s');
    }
    function groom_fn(v){
        var txt='';
        switch (v){
            case '0':
                txt='<font color="#999">未推荐</font>';
                break;
            case '1':
                txt='<font color="green"><b>推荐</b></font>';
                break;
            case '2':
                txt='<font color="blue"><b>精选</b></font>';
                break;
        }
        return txt;
    };
    function destination_city_fn(v){
        return '<font data-qtip="'+v+'">'+v+'</font>';
    };
    var cm=[
        new Ext.grid.RowNumberer({width:50}),
        {header:"ID", dataIndex:"p_id", width:50, hidden:true},
        {header:'<span style="color:blue">排序</span>', dataIndex:"p_order", editor:true, width:100, align:'center'},
        {header:"产品编号", dataIndex:"p_num", width:150},
        {header:"产品名称", dataIndex:"p_name", width:250,renderer:name_fn},
        {header:"产品副标题", dataIndex:"p_name_short", width:250,renderer:name_short_fn,hidden:true},
        {header:"天数", dataIndex:"p_days", width:100,align:'center'},
        {header:"操作人", dataIndex:"p_linkman", width:100,align:'center'},
        {header:"目的地", dataIndex:"p_destination_city", width:150,align:'left',renderer:destination_city_fn},
        {header:"状态", dataIndex:"p_status", width:70,renderer:status_fn,hidden:true},
        {header:"编辑时间", dataIndex:"p_time", width:200,renderer:time_fn,hidden:true},
        {header:"推荐状态", dataIndex:"p_groom", width:80,renderer:groom_fn,align:'center'},
        {header:"所属单位", dataIndex:"p_org_name", width:200,align:'left'},
        {header:"主推城市", dataIndex:"p_first_city", width:200,align:'left'},
        {header:"适用城市", dataIndex:"ticket_city", width:200,align:'left',renderer:destination_city_fn}
    ];

    var ProductType_box=SUNLINE.LocalComob({
        id:'product_type',
        fields:['text','id'],
        data:ProductType,
        config:{
            fieldLabel:'类型',
            editable:false,
            valueField:'id',
            displayField:'text',
            id:'product_type',
            name:'product_type',
            labelWidth:30,
            labelAlign:'right',
            width:180,
            value:'全部类型'
        }
    });

    var groom_box=SUNLINE.LocalComob({
        id:'groom_type',
        fields:['text','id'],
        data:[{id:0,text:'全部产品'},{id:3,text:'全部推荐'},{id:2,text:'推荐精选'},{id:1,text:'推荐普通'}],
        config:{
            fieldLabel:'推荐类型',
            editable:false,
            valueField:'id',
            displayField:'text',
            id:'groom_type',
            name:'groom_type',
            labelWidth:60,
            labelAlign:'right',
            width:180,
            value:'全部产品'
        }
    });

    //************************************主推城市 start 2017.9.13
    var zt_city = {
        text: '主推城市',
        iconCls: 'button-write',
        id: 'first_city',
        handler: function (t) {
            //判断单位是否已选择
            row = SUNLINE.getSelected(products);
            if (!row) {
                return ExtAlert('请先选择要主推的产品!', '友情提示');
            } else if (!row.get('ticket_city')) {
                return ExtAlert('请先设置本产品的适用城市!', '友情提示');
            }

            var p_id = row.get('p_id');
            //主推城市panel
            window.firstCity = SUNLINE.PutCity({
                id: 'p_first_city',
                url: $__app__ + '/Products/firstCityJson?p_id=' + p_id,
                title: '主推城市'
            }, function (v) {
                if( v.length == 0 ){
                    return ExtAlert('主推城市至少选一个!', '友情提示');
                }
                //提交主推城市数据
                Ext.Ajax.request({
                    url: $__app__ + '/Products/updateFirstCity',
                    params: {p_id: p_id, p_first_city: v.join(',')},
                    method: 'POST',
                    success: function (response, otps) {
                        var ret = Ext.decode(response.responseText);
                        if ( ret.success ) {
                            Ext.Msg.alert('信息提示', ret.message);
                            store.reload();
                        } else {
                            Ext.Msg.alert('信息提示', ret.message);
                        }
                    }
                });
            });

            //设置默认城市
            firstCity.this_val = row.get('p_first_city');
            //记录默认显示的城市
            window.sarea_val_fn = function (e) {
                return Ext.getCmp(e).getValue();
            };
            //显示主推城市
            firstCity.show();
        },
    };
    //************************************主推城市 end 2017.9.13

    /********************* 适用城市选择功能（start） ********************/
    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{code}">{name}</div>',
        '</tpl>'
    );
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "id","name","code" ]
    });
    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });
    var _url=$__app__ + '/City/put_city';
    var attr_Store = SUNLINE.JsonStore(_url,['group','gname','data'],false);
    var attr_Store_is_load = false;
    attr_Store.on('load', function(store){
        //重构DataView的数据
        attr_Store_is_load = true;
        var data = [];
        store.each(function(record){
            var id = 'g_'+ record.get('group');
            var items = record.get('data');
            data.push({id:id, cls : 'group-wrap', name:record.get('gname')});
            Ext.each(items, function(item, index){
                var it  = {};
                it.cls = '';
                it.id = item.id;
                it.code = item.code;
                it.name = item.name;
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
        style:'border-top:1px solid #ccc',
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        emptyText : '<div style="padding:10px">暂无投放市场信息......</div>',
    });
    function setSelected(){
        var cur_val = Ext.getCmp('city_range').getValue();
        attrView.getSelectionModel().deselectAll(false);
        if (cur_val){
            var cur_val_arr = cur_val.split(',');
            for (var i = 0; i < cur_val_arr.length; i++){
                var index = attr_store.find('name', new RegExp('^' + cur_val_arr[i] + '$'));
                attrView.getSelectionModel().select(index, true);
            }
        }
    };
    var city_range_panel = Ext.create('Ext.Panel',{
        region:'center',
        items:[attrView],
        cls : 'adver_view',
        autoScroll: true,  
        bodyStyle:"padding:10px;",
    });
    var  heigt= document.body.scrollHeight-200;
    var  width= document.body.scrollWidth-200;
    var city_range_box = Ext.create('Ext.window.Window',{
        title:'适用城市',
        closeAction:'hide',
        modal:true,
        items: [city_range_panel],
        width:width,
        height:heigt,
        autoScroll:true,
        buttons:[
            {
                text:'确认选择',
                handler:function(){
                    var selected_obj =  attrView.getSelectionModel().getSelection();
                    if(selected_obj.length <= 0){
                        //Ext.Msg.alert('友情提示','请选择要筛选的城市');
                        Ext.getCmp('city_range').setValue('');
                    }else{
                        var selected_name_arr = [];
                        for (var i=0; i < selected_obj.length; i++){
                             selected_name_arr.push(selected_obj[i].data.name);
                        };
                        var city_val = selected_name_arr.join(',');
                        Ext.getCmp('city_range').setValue(city_val);
                   }
                    city_range_box.hide();
                    //加载搜索数据
                    SUNLINE.baseParams(store,{p_range_city:city_val},true);
                    store.currentPage = 1;
                    store.load();
                }
            },
            {
                text:'取消',
                handler:function(){
                    city_range_box.hide();
                }
            }
        ]
    });
    /********************* 适用城市选择功能（end） ********************/

    var groom_city=SUNLINE.DictComBox_false({fieldLabel:"推荐城市",name:'groom_city',id:'groom_city',width:180,hidden:true,labelWidth:60,labelAlign:"right",forceSelection:false},{'d_type':'开放城市'});

    var products=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        border :false,
        viewConfig:{emptyText:'哎呀，暂时没有产品信息，快去添加哦'},
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    edit:function(v,g){
                        var data = SUNLINE.getSelected(g.grid).data;
                        if( data.p_id ){
                            Ext.Ajax.request({
                                url: $__app__+'/Products/updateSort',
                                params: {p_id: data.p_id, p_order: data.p_order},
                                method:'post',
                                success: function(response){
                                    var r = Ext.decode(response.responseText);
                                    if(r.status){
                                        store.load();
                                    }else{
                                        Ext.Msg.alert('友情提示', r.msg);
                                    }
                                }
                            });
                        }
                    }
                }
            })
        ],
        tbar:[
            {text:'推荐普通',iconCls:'button-add',handler:groom_modify,disabled:isDisabled('ProductsDetail::index'), xtype:'splitbutton',
                menu:{
                    items:[
                        {text: '推荐精选',handler:groom_modify,disabled:isDisabled('ProductsDetail::index'),iconCls:'button-view'},
                        {text: '取消推荐',handler:groom_modify,disabled:isDisabled('ProductsDetail::index'),iconCls:'button-view'}
                    ]
                }
            },
            {text:'编辑',iconCls:'button-edit',id:'edit_id',handler:modify,disabled:isDisabled('ProductsDetail::index')},
            {xtype:'hidden', id:'p_first_city', value:''},
            zt_city,
            '-',
            {text:'刷新',iconCls:'button-ref',handler:function(){
                store.reload();
            }},
            '-',
            {text:'日志',iconCls:'button-log',id:'ziyo_log_btn'},
            '-',
            ProductType_box,
            groom_box,
            groom_city.box,
            '适用城市:',
            {
                id:'city_range',
                xtype:'textfield',
                emptyText : '请选择适用城市',
                listeners:{
                    focus:function(){
                        if(attr_Store_is_load === false)attr_Store.load();
                        city_range_box.show();
                    }
                }
            },
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'Search_key',
                emptyText : '产品名称，拼音码',
                width:200,
                onTriggerClick:function(e){
                    ProSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            ProSearch();
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
        ],
        bbar: new Ext.PagingToolbar({
            pageSize: pageSize,
            store:store,
            displayInfo: true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息，快去添加哦'
        })
    });

    ProductType_box.on({
        select:function(t,r){
            var row=r[0].data;
            SUNLINE.baseParams(store,{p_type:row.id},true);
            store.load();
        }
    });
    groom_box.on({
        select:function(t,r){
            var row=r[0].data;
            SUNLINE.baseParams(store,{p_groom:row.id},true);
            store.load();
        }
    });

    groom_city.box.on({
        select:function(t,r){
            var row=r[0].data;
            SUNLINE.baseParams(store,{p_destination_city:row.d_text},true);
            store.load();
        }
    });

    //搜索
    function ProSearch(){
        var skey=Ext.getCmp('Search_key').getValue();
        SUNLINE.baseParams(store,{skey:skey});
        store.currentPage=1;
        store.load();
    }

    /**
     * 产品推荐操作
     * @param b
     */
    function groom_modify(b){
        var row = SUNLINE.getSelected(products);
        if (!row) {
            Ext.Msg.alert('友情提示', '请选择要'+b.text+'的线路信息！');
            return;
        };
        var groom_data={'推荐普通':1,'推荐精选':2,'取消推荐':0};
        var s={p_id:row.get('p_id'),groom_name: b.text,groom:groom_data[b.text]};
        Ext.Msg.confirm('友情提示', '您真的要'+b.text+'“'+ row.get('p_name') +'”吗？',function(btn){
            if (btn == 'yes'){
                var myMask = SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();
                url = $__app__ + '/Products/groom_modify';
                Ext.Ajax.request({
                    url : url,
                    params : s,
                    success : function(response, opts){
                        var rst = Ext.decode(response.responseText);
                        if (rst.status){
                            store.load();
                        }
                        Ext.Msg.alert('友情提示',rst.info);
                        myMask.hide();
                    },
                    failure : function(response, opts){
                        myMask.hide();
                        Ext.Msg.alert('友情提示', b.text+'线路信息遇到未知错误！未能'+ b.text+'。',function(){});
                    }
                });
            }
        });
    }


    function modify(b){
        var row = SUNLINE.getSelected(products);
        if(!row){
            Ext.Msg.alert('友情提示','请先选择要编辑的产品！');
            return false;
        }
        parent.OpenTab('新增产品', 'new_product_add', '', $__app__ + '/ProductsDetail?id='+row.data.p_id, 1);
    }

    //products
    new Ext.Viewport({
        layout : 'border',
        items : [products]
    });
});