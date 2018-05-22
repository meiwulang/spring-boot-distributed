var ROW = {} , AR = {};
Ext.onReady(function () {
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    window.org_id = top._uinfo.u_jgid;

    var url = $__app__ + '/Adver/dataJson';
    var field = [{name:"ad_id"},{name:"ad_place"},{name:"ad_barea"},{name:"ad_sarea"},{name:"ad_stime"},{name:"ad_etime"},{name:"ad_title"},{name:"ad_pic"},{name:"ad_content"},{name:"ad_opentype"},{name:"ad_display"},
        {name:"ad_url"}];
    var store = new SUNLINE.JsonStore(url, field);
    function ad_title_url(v,m,r){
        return '<a href="'+ r.get('ad_url')+'" target="_blank">'+ v+'</a>';
    }
    //把链接转换成图片展示
    function formatPic(v,m,r){
        return "<img style='height: 20px;' src='" +v + "?x-oss-process=image/resize,m_fill,h_30,w_60' data-qtip='<img src=" + v + "?x-oss-process=image/resize,m_fill,w_500>'>";
    };
    function date_f(v){
        return int2date(v);
    }

    var ad_place_box=SUNLINE.DictComBox({
        id:"ad_place",
        fieldLabel:'广告位置',
        labelWidth:60,
        displayField:"d_text",
        valueField:"d_text",
        editable:false,
        labelAlign:'right'
    },{d_type:"广告位置"});
    ad_place_box.store.on({
        load:function(){
            ad_place_box.store.add({d_text:'全部位置'});
        }
    })
    function content_fn(v){
        return '<span data-qtip="'+v+'">'+v+'</span>';
    }
    function sarea_fn(v){

    }
    window.grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有广告信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:50}),
            {header:"广告ID", dataIndex:"ad_id", width:50,hidden:true},
            {header:"广告位置", dataIndex:"ad_place", width:150},
            {header:"广告名称", dataIndex:"ad_title", width:180, renderer:ad_title_url},
            {header:"广告封面", dataIndex:"ad_pic", width:120,renderer:formatPic},
            {header:"排序", dataIndex:"ad_order", width:70},
            {header:"投放城市", dataIndex:"ad_sarea", width:150,renderer:content_fn},
            {header:"开始日期", dataIndex:"ad_stime", width:100,renderer:date_f},
            {header:"结束日期", dataIndex:"ad_etime", width:100,renderer:date_f},
            {header:"是否有效", dataIndex:"ad_display", width:100},
            {header:"其他内容", dataIndex:"ad_price", width:80},
            {header:"广告说明", dataIndex:"ad_content", width:200,renderer:content_fn}
        ],
        tbar: [
            {text:'添加', iconCls:'button-add', handler:modify},
            '-',
            {text:'编辑', iconCls:'button-edit', handler:modify},
            '-',
            {text:'删除', iconCls:'button-del', handler:doDelete},
            '-',
            {text:'刷新', iconCls:'button-ref', handler:function(){store.reload();}},'-',
            ad_place_box.box,
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                emptyText:'广告名称、广告说明、其他内容、投放城市',
                width:240,
                onTriggerClick:function (e) {
                    ad_search();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            ad_search();
                    }
                }
            }
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:pageSize,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有广告信息'


        })
    });

    ad_place_box.box.on({
        select:function(){
            ad_search();
        }
    });

    function ad_search(){
        var search=Ext.getCmp('search').getValue();
        var ad_place=ad_place_box.box.getValue();
        if(ad_place=='全部位置')ad_place='';
        var ad_post={
            skey:search,
            ad_place:ad_place
        };

        SUNLINE.baseParams(store,ad_post);
        store.currentPage=1;
        store.load();
    }

    window.win = new Ext.Window({
        id:'win',
        width:500,
        autoHeight:true,
        closeAction:'hide',
        modal:true,
        html:'<iframe id="ifm_adver" name="ifm_adver" src="" width="100%" height="570" frameborder=0></iframe>',
        buttons:[
            {text:'保存',
                id:"save_btn",
                handler:function(b){
                    var info = '';
                    window.ifm_adver.funcsub(b.text, function( info ){
                        if( info ){ //更新成功后，返回更新信息
                            Ext.Msg.alert("友情提示", info);
                            win.hide();
                        }
                    });
                }
            },
            {text:'关闭', handler:function () {
                win.hide();
            }}
        ]
    });
    win.on('hide',function(w){
        store.reload();
    })
    win.on('show', function(w){
        var url = $__app__ + '/Adver/modifyAdver?_dc=' + time()+'&id='+ROW.data.ad_id;
        window.ifm_adver.location = url;
    });

    function doDelete(){
        var row = SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('温馨提示','请选择你要删除的数据');
            return false;
        }
        Ext.MessageBox.confirm('温馨提示','您确定要删除该数据吗？',function(y){
            if(y!='yes')return false;
            var myMask = SUNLINE.LoadMask('数据删除中，请稍候...');
            myMask.show();
            Ext.Ajax.request({
                url: $__app__+'/Adver/del',
                params: {ad_id:row.data.ad_id},
                method:'post',
                success: function(response){
                    var r = Ext.decode(response.responseText);
                    Ext.Msg.alert('友情提示', r.info);
                    if(r.status){ store.reload(); }
                    myMask.hide();
                }
            })
        })
    }

    //广告增加、修改
    function modify(b) {
        if (b.text == '添加') {
            ROW.data = "";
        }else if (b.text == '编辑') {
            var row = SUNLINE.getSelected(grid);
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要编辑的广告信息');
                return;
            };
            ROW.data = row.data;
        }else{
            Ext.Msg.alert('友情提示', '参数有误，请联系管理员！');
            return;
        }
        win.setTitle(b.text + '广告信息');
        win.show(b.id);
    };

    window.sarea_val_fn=function(){
        return window.ifm_adver.sarea_val();
    }
    window.attrWin=SUNLINE.PutCity({},function(v,c){
        if(v.length>0){
            window.ifm_adver.sarea_val(v.join(','), c.join(','),'add');
        }else{
            window.ifm_adver.sarea_val('','','add');
        }
    });
    window.attr_fn=function(){
        attrWin.show('ad_sarea');
    };
    new Ext.Viewport({
        layout:'border',
        items:[grid]
    });
});