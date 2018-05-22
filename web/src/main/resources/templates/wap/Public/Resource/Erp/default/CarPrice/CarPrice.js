Ext.onReady(function(){
    var grid=ITEMS_YUN.CarPrice({load_type:false});
    new Ext.Viewport({
        layout : 'border',
        items:[grid]
    });
});