var ROW={};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    /*主体*/

    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{code}">{name}{btn}{cancel_btn}</div>',
        '</tpl>'
    );
    //新的DataView数据源
    Ext.define('attrStore', {
        extend: 'Ext.data.Model',
        fields: [ "id","name","code" ,'isopne']
    });
    var attr_store = Ext.create('Ext.data.Store', {
        model: 'attrStore',
        data : [ ]
    });
    var _url=$__app__ + '/City/cityAll';
    var attr_Store = SUNLINE.JsonStore(_url,['group','gname','data','isopne'],true);
    var attr_Store_is_load = false;




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

    var attrView = new Ext.view.View({
        store : attr_store,
        tpl : attrTpl,
        multiSelect : true,
        simpleSelect : true,
        style:'border-top:1px solid #ccc',
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        //emptyText : '<div style="padding:10px">暂无投放市场信息......</div>',
        plugins : [Ext.create('Ext.ux.DataView.DragSelector', {})]
    });

    function getSelected(){
        var h = attrView.getSelectedNodes(), sd=[],code=[],city=[];
        for (var i=0; i < h.length; i++){
            if(!$(h[i]).hasClass('group-wrap')){
                code.push(h[i].id);
                sd.push(h[i].textContent);
            }
        };
        city={'sd':sd,'code':code}
        return city;

    };
    var grid=Ext.create('Ext.Panel',{
        region:'center',
        items:attrView,
        cls : 'adver_view',
        autoScroll: true,
        tbar:[
            '<b>投放城市设置</b>',
            '->',
            {text:'投放城市操作',iconCls:'button-save',handler:apply_city_fn},
        ]
    });

    function apply_city_fn(){
        var city=getSelected();
        var city_name=city.sd;
        var city_id=city.code;

        if(city_name=='' || !city_name){
            Ext.Msg.alert('友情提示','请选择需要投放的城市！');
            return false;
        }
        if(city_name.length>0)city_name=city_name.join(',');
        if(city_id.length>0)city_id=city_id.join(',');

        Ext.Msg.confirm('友情提示','你确定对投放城市进行设置吗？',function(v){
            var myMask = SUNLINE.LoadMask('数据处理中，请稍候...');
            myMask.show();
            if(v=='yes'){
                Ext.Ajax.request({
                    url: $__app__+'/City/putCity_manage',
                        params: {city_id:city_id,city_name:city_name},
                    success: function(response){
                        var r = Ext.decode(response.responseText);
                        console.log(r);
                        if(r.code=='200'){
                            Ext.Msg.alert('友情提示', r.message);
                        }
                        myMask.hide();
                    },
                    failure: function (response) {
                        var r = Ext.decode(response.responseText);
                        if(r.code=='300'){
                            Ext.Msg.alert('友情提示', r.message);
                        }
                        myMask.hide();
                    }

                })
            }
        })
    }

    attr_Store.on('load', function(store){


        //重构DataView的数据
        attr_Store_is_load = true;
        var data = [];
        store.each(function(record){
            var id = 'g_'+ record.get('group'),
                sel_id = 'sel_'+id,
                can_id = 'can_'+id;

            var items = record.get('data');

            var btn="<button style='float: right;' id='"+sel_id+"' class='group1'>全选</button>";
            var cancel_btn="<button style='float: right;margin-right:10px;' id='"+can_id+"' class='group2'>取消全选</button>";

            data.push({id:id, cls : 'group-wrap', name:record.get('gname'),btn:btn,cancel_btn:cancel_btn});
            Ext.each(items, function(item, index){
                var it  = {};
                it.cls = '';
                it.id = item.id;
                it.code = item.code;
                it.name = item.name;
                it.group = id;
                it.isopen=item.isopen
                data.push(it);
            });

        });
        attr_store.loadData(data);
        var btn = Ext.query('button[class=group1]');
        var cancel_btn = Ext.query('button[class=group2]');

        add_select(btn);
        add_select(cancel_btn,'deselect');
        var data_index=0;
        attr_store.each(function(rst){
            var row=rst.data;
            if(row.isopen=='1'){
                attrView.getSelectionModel().select(data_index, true);
            }
            data_index++;
        });


    });



    new Ext.Viewport({
        layout : 'border',
        items : [grid]
    });






   } )