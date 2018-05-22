/**
 * Created by Administrator on 2016/1/28.
 */
var SelectSite={};
Ext.onReady(function () {
    var sp_grid=ITEMS_YUN.FlySelect({});
    new Ext.Viewport({
        layout : 'border',
        items : [sp_grid.grid]
    });
});
