var ROW={};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();

    /*投放市场选择功能（start）*/
    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{code}">{name}{btn}{cancel_btn}</div>',
        '</tpl>'
    );

    //新的DataView数据源
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
        var g_data = {};
        store.each(function(record){
            var id = 'g_'+ record.get('group'),
                sel_id = 'sel_'+id,
                can_id = 'can_'+id;
            var btn="<button style='float: right;' id='"+sel_id+"' class='group1'>全选</button>";
            var cancel_btn="<button style='float: right;margin-right:10px;' id='"+can_id+"' class='group2'>取消全选</button>";
            var items = record.get('data');

            data.push({id:id, cls : 'group-wrap',btn:btn,cancel_btn:cancel_btn, name: record.get('gname')+'&nbsp;'});

            g_data[record.get('gname')] = items;

            Ext.each(items, function(item, index){
                var it  = {};
                it.cls = '';
                it.id = item.id;
                it.code = item.code;
                it.name = item.name;
                it.group = id;
                data.push(it);
            });
        });
        attr_store.loadData(data);
        var btn = Ext.query('button[class=group1]');
        var cancel_btn = Ext.query('button[class=group2]');
        add_select(btn);

        add_select(cancel_btn,'deselect');

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
        emptyText : '',
        plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });

    function setSelected(){
        var v=ROW.org_apply_city;
        attrView.getSelectionModel().deselectAll(false);
        if (v){
            var h = v.split(',');
            for (var i=0; i< h.length; i++){
                var index = attr_store.find('name', new RegExp('^' + h[i] + '$'));
                attrView.getSelectionModel().select(index, true);
            }
        }
    };
    function getSelected(){
        var h = attrView.getSelectedNodes(), sd=[],code=[];
        for (var i=0; i < h.length; i++){
            if((h[i].textContent).indexOf('省')>0 || (h[i].textContent).indexOf('自治区')>0 || (h[i].className).indexOf('group-wrap')>0){}else{
                code.push(h[i].id);
                sd.push(h[i].textContent);
            }
        };
        return sd;
    };

    function add_select(cls,type){
        Ext.each(cls, function(item, index){
            Ext.get(item.id).on("click",function(c, b, o, e){
                var prefix=type?'can_':'sel_';
                var g = b.id.replace(prefix, '');
                var s_data= [];
                var index = attr_store.find('group', new RegExp('^' + g + '$'));
                attr_store.each(function(r){
                    var gt = r.get('group');
                    if (g === gt ){
                        s_data.push( r );
                    }
                });
                if(type=='deselect'){
                    attrView.getSelectionModel().deselect(s_data, true);
                }else{
                    attrView.getSelectionModel().select(s_data, true);
                }
            });
        });
    }
    var grid=Ext.create('Ext.Panel',{
        region:'center',
        border:false,
        items:attrView,
        cls : 'adver_view',
        autoScroll: true,
        tbar:[
            '<b>供应商投放市设置</b>',
            '->',
            {text:'确认保存',iconCls:'button-save',handler:apply_city_fn}
        ]
    });

    /*供应商列表部分(start)*/
    var lurl = $__app__+'/Company/json_data';
    var lfield=['org_id','org_bh','org_name','org_type'];
    var lstore=SUNLINE.JsonStore(lurl,lfield,false,{pageSize:15});
    SUNLINE.baseParams(lstore,{org_type:'供应商'});
    lstore.load();
    /*供应商产品类型*/
    var type_url = $__app__+'/Company/get_type';
    var type_field = '';
    var type_store=SUNLINE.JsonStore(type_url,type_field,false);

    var lcm=[
        new Ext.grid.RowNumberer({width:50}),
        {text:'ID',dataIndex:'org_id',hidden:true },
        {text:'单位编号',dataIndex:'org_bh',width:100 },
        {text:'单位名称',dataIndex:'org_name',width:240},
        {text: '城市',dataIndex:'org_city',width:60 }
    ];
    var lgrid = Ext.create('Ext.grid.Panel',{
        region:'center',
        border:false,
        store:lstore,
        columns:lcm,
        loadMask:{ msg : '数据载入中，请稍后' },
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            '快速搜索',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'org_Search',
                emptyText : '单位名称,单位编号',
                iconCls:'button-sch',
                width:220,
                onTriggerClick:function(e){
                    orgSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            orgSearch();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: pageSize,
            store:lstore,
            displayInfo: true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'暂时没有信息'
        })
    });
    lgrid.on('cellclick',function(sm,rowldx,c,r){
        var row = r.data;
        ROW=row;
        SUNLINE.baseParams(type_store,{org_id:row.org_id});
        type_store.load();
        attr_store.removeAll();
    });
    /*供应商列表部分(end)*/

    var type_grid = Ext.create('Ext.grid.Panel',{
        region:'south',
        border:false,
        height:300,
        store:type_store,
        loadMask:{ msg : '数据载入中，请稍后' },
        columns: [
            new Ext.grid.RowNumberer({width:50}),
            {text: '产品类型',dataIndex:'type',width:220 },
            {text: '投放城市数量<i class="fa fa-question-circle"></i>',dataIndex:'num',width:130,tooltip:"如果投放城市数量不对,查看是否存在开放城市已被关闭"},
            {text: '产品编码',dataIndex:'release',width:50,hidden:true},
            {text: '产品投放城市',dataIndex:'org_apply_city',width:50,hidden:true},
        ],
        viewConfig:{
            emptyText : '暂无单位产品类型信息',
            deferEmptyText : true
        }
    })

    type_grid.on('cellclick',function(sm,rowldx,c,r){
        var row = r.data;
        ROW=row;
        attr_Store.load();
    });

    var left_grid = Ext.create('Ext.panel.Panel', {
        border :false,
        region:'west',
        layout:"border",
        //split : {size:3},
        split : true,
        style : 'border-right-width:1px;',
        collapsible: false,
        collapsed: false,
        floatable: false,
        fixed:false,
        title:'',
        width : 470,
        maxWidth: 530,
        items:[lgrid,type_grid]
    });

    //ziyo_log({ listeners : [{grid: lgrid, action:'Company', pk_id:'wg_id'}] });
    new Ext.Viewport({
        layout : 'border',
        items : [grid,left_grid]
    });

    function apply_city_fn(){
        var ROW=SUNLINE.getSelected(lgrid);
        if(!ROW){
            Ext.Msg.alert('友情提示','请选择需要设置投放市场的供应商！');
            return false;
        }
        var type_grid_s = SUNLINE.getSelected(type_grid);
        if(!type_grid_s){
            Ext.Msg.alert('友情提示','请选择所选供应商需要设置的产品类型！');
            return false;
        }
        var city=getSelected();
        if(city.length>0)city=city.join(',');

        Ext.Msg.confirm('友情提示','你确定要设置当前供应商的投放市场吗？',function(v){
            var myMask = SUNLINE.LoadMask('数据处理中，请稍候...');
            myMask.show();
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/Company/apply_city_save',
                    params: {org_id:ROW.data.org_id,org_apply_city:city,org_type:type_grid_s.data.release},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        if(r.status){
                            Ext.Msg.alert('友情提示', r.info);
                            type_store.reload();
                        }else{
                            Ext.Msg.alert('友情提示', r.info);
                        }
                        myMask.hide();
                    }
                })
            }else{
                myMask.hide();
            }
        })
    }

    function orgSearch(){
        var skey=Ext.getCmp('org_Search').getValue();
        SUNLINE.baseParams(lstore,{skey:skey},true);
        lstore.currentPage = 1;
        lstore.load();
        attr_store.removeAll();
    }
});