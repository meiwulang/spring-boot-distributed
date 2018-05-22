/**
 * Created by Johony on 16-2-25.
 */
Ext.onReady(function(){
    var store = SUNLINE.GroupingStore($__app__+'/Account/city_json',[],'',true,'',200);
    Ext.each(ac_cm,function(v,i){
        switch (v.renderer){
            case 'money':
                v.renderer=money;
                break;
        }
    });
    var start_time=SUNLINE.ExtDateField({
        id:'start_date',
        width:110,
        labelWidth:0,
        name:'start_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:start_date,gang:'end_date',start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'end_date',
        width:110,
        labelWidth:0,
        name:'end_date',
        fieldLabel:":",
        format: 'Y-m-d',
        value:end_date,gang:'start_date'
    });
    var grid = Ext.create('Ext.grid.Panel',{
        region:'center',
        store:store,
        columns:ac_cm,
        style:'border-top:2px solid #009DDA',
        fixed:true,
        viewConfig:{emptyText:'没有符合你要查找的内容'},
        tbar:[
            '报销时间','-',
            start_time,' 至 ',end_time,
            {text:'查询', iconCls:'button-sch',handler:selectInfo},
            {text:'导出数据',iconCls:'button-excel',handler:download_excel},
            '->',
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'pl_Search',
                cls:'search-icon-cls',
                emptyText : '费用类别',
                width:280,
                onTriggerClick:function(e){
                    planeSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if(_e.keyCode==13)
                            planeSearch();
                    }
                }
            }
        ]
    });

    //导出/打印
    function download_excel(){
        Ext.MessageBox.confirm('友情提示','你确定要导出当前条件下的数据吗?',function(y){
            if(y!='yes')return false;
            var post_val=where_select();
            var skeys=Ext.getCmp('pl_Search').getValue();
            if(skeys)post_val.skeys=skeys;
            var url=[];
            for(var i in post_val){
                if(!post_val[i])continue;
                url.push(i);
                url.push(post_val[i]);
            }
            url=url.join('/');
            window.location = $__app__+'/Account/city_json_excel/'+url;
        });
    }

    function planeSearch(){
        var key=Ext.getCmp('pl_Search').getValue();
        SUNLINE.baseParams(store,{skeys:key},true);
        store.load();
    };

    function where_select(){
        var start_date=Ext.Date.format(start_time.getValue(),'Ymd');
        var end_date=Ext.Date.format(end_time.getValue(),'Ymd');
        return {start_date:start_date,end_date:end_date};
    }

    //查询条件汇总
    selectInfo();
    function selectInfo(){
        var post=where_select();
        SUNLINE.baseParams(store,post);
        store.load();
    };

    new Ext.Viewport({
        layout:'border',
        items:[grid]
    })
})