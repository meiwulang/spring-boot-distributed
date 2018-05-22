Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    var url= $__app__ + '/Report/get_json';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,false);
    var store_data={re_id:re_id};
    if(re_get){
        store_data['where']=Ext.encode(re_get);
    }
    SUNLINE.baseParams(store,store_data);
    store.load();
    var grid=Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:cm,
        viewConfig:{emptyText:'暂时没有信息'},
        tbar:[
            '<b>'+re_title+'</b>',
            '->',
            {text:'导出',iconCls:'button-excel',handler:excel_export}
        ]
    });
    function excel_export(){
        window.location = $__app__+'/Report/excel_export?id='+re_id+'&where='+Ext.encode(re_get);
    }

    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
});