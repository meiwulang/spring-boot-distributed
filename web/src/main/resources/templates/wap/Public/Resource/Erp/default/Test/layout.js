/**
 * Created by sunline on 16-7-12.
 */

Ext.onReady(function(){

    var _center = Ext.create('Ext.Panel', {
        region : 'center',
        border : true,
        html : '中'
    });

    var _panel = Ext.create('Ext.Panel', {
        layout: 'border',
        defaults : { border:true },
        tbar : ['最外面的Tbar'],
        items : [
            {region : 'north', height: 80, html : '北方', tbar:['North Tbar']},
            {region : 'south', autoHeight:true, html : '南'},
            {region : 'west', width:200, html : '西'},
            {region : 'east', width:200, html : '东'},
            _center
        ]
    });

    /*var _panel = Ext.create('Ext.Panel', {
        title : 'Test Panel',
        layout : 'fit',
        items : _center
    });*/

    _panel.setWidth(500);
    _panel.setHeight(600);
    _panel.render(Ext.getBody());

});