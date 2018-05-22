
Ext.onReady(function(){

    /********************* 左边树 start *************************/
    var tree_store=Ext.create('Ext.data.TreeStore', {
        autoLoad:true,
        proxy : {
            type : 'ajax',
            url : $__app__+'/City/tree_json'
        },
        root: {
            expanded: true,
            text:'所有分组',
            children:[
                { text: 'name', expanded: true, children: [
                    { text: 'name', leaf: true }
                ] }
            ]
        }
    });
    var left_tree = new Ext.tree.Panel({
        tbar : [
            '<b>城市管理 :</b>',
           /* {text:'添加', iconCls:'button-add'},
            {text:'编辑', iconCls:'button-edit'},
            {text:'删除', iconCls:'button-del'},*/
            {text:'加入到分组', iconCls:'button-add',margin:'0 0 0 200',handler:city_group},
            {
                text : '折叠',
                iconCls:"fa fa-bars",
                margin:'0 0 0 15',
                handler:function(b){
                    left_tree.collapseAll();
                }
            },
        ],
        columns: [{
            xtype: 'treecolumn',
            text: '城市名称',
            flex: 2,
            sortable: true,
            dataIndex: 'text'
        },{
            id:'suoshu',
            text: '所属地区',
            flex: 1,
            dataIndex: 'group_id',
            sortable: true
        }],
        region:'west',
        minWidth : 240,
        maxWidth : 550,
        width:450,
        store: tree_store,
        bodyBorder:true,
        split : {size:3},
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        rootVisible: true,

    });

    /*城市的数据处理*/
        //加入分组

    function select_set_index(city,str_val){
        var len=city.childNodes.length;
        if(len>0){
            tree_store.each(function(rst){
                var row=rst.data;
                if(row.id==city.get('id') || row.pid==city.get('id')){
                    var set_data={group_id:str_val};
                    if(row.expanded==false && !row.pid){
                        var children=row.children;
                        for(var i=0;i<children.length;i++){
                            children[i]['group_id']=str_val;
                        }
                        set_data.children=children;
                    }
                    rst.set(set_data);
                }
            });
        }else{
            city.set({group_id:str_val});
        }
    }
    function city_group(v){
        var city=SUNLINE.getSelected(left_tree);
            var handle='',url='';
            if(v.text=='加入到分组'){
                var city=SUNLINE.getSelected(left_tree);
                handle='添加到';
                url=$__app__ + '/City/cityGroup_add';
            }else if(v.text=='移城所选'){
                var city=SUNLINE.getSelected(right_tree);
                handle='移除';
                url=$__app__ + '/City/cityGroup_del';
            }
            if(city==null) {
                Ext.Msg.alert('友情提示', '请选择您要操作的城市！');
                return false;
            }
            var city_name = city.data.text;
            var city_id = city.data.id;
            var city_pid = city.data.pid;
            var area=SUNLINE.getSelected(area_grid);
            if(v.text=='加入到分组'){
                if(area==null) {
                    Ext.Msg.alert('友情提示', '请选择您要添加的地区！');
                    return false;
                }
            }
            var area_id=area.data.d_id;
            var area_name=area.data.d_text;
            var row=SUNLINE.getSelected(left_tree);
            Ext.MessageBox.confirm('友情提示','确定要将城市'+handle+'分组吗？',function(id){
                if (id == 'yes') {
                    var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                    myMask.show();
                    Ext.Ajax.request({
                        url:url,
                        params:{city_name:city_name,area_id:area_id,area_name:area_name,city_id:city_id,city_pid:city_pid},
                        method:'POST',
                        success:function (response) {
                            myMask.hide();
                            var result = Ext.decode(response.responseText);
                            if(result.code ==100){
                                Ext.Msg.alert('友情提示', result.message);
                            } else if(result.code ==200){
                                Ext.Msg.alert('友情提示', result.message);
                            }else if(result.code ==300){
                                Ext.Msg.alert('友情提示', result.message);
                                right_store.load();

                                select_set_index(city,result.data.group_id);
                            }

                        },
                    })
                }
            })
    }


    /********************* 左边树 end *************************/


    /***********************  地区分类 start  ***********************************/

    var dict_url = $__app__ + '/Dict/dict_json';
    var dict_fields=['d_id','d_text','code','detail'];
    var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , false);
    SUNLINE.baseParams(dict_store,{d_type:'城市分组'});
    dict_store.load();
    var area_grid = new Ext.grid.GridPanel({
        region:'center',
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        store:dict_store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有城市分组信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer({width:30}),
            {header:"地区名称", dataIndex:"d_text"},
        ],
        tbar : [
            '<b>地区分类 :</b>'
        ]
    });

    area_grid.on('select',function(c,r,n){
        right_tree.show();
        SUNLINE.baseParams(right_store,{group_id: r.data.d_text});
        right_store.load();
    })


    /***********************  地区分类  end   ***********************************/




    /***********************  已选城市  start   ***********************************/

    var right_store=Ext.create('Ext.data.TreeStore',{
        autoLoad:false,
        proxy : {
            type : 'ajax',
            url : $__app__+'/City/tree_json',
            actionMethods:{
                create:'POST',
                read:'POST',
                update:'POST',
                destroy:'POST'
            }
        },
        root: {
            expanded: true,
            text:'所有分组',
            children:[
                { text: 'name', expanded: true, children: [
                    { text: 'name', leaf: true }
                ] }
            ]
        }
    });
    var right_tree = new Ext.tree.Panel({
        tbar : [
            '<b>已选城市 :</b>',
            {text:'移城所选', iconCls:'button-del' ,margin:'0 0 0 50',handler:city_group},
        ],
        hidden:true,
        region:'east',
        minWidth : 240,
        maxWidth : 520,
        width:520,
        store: right_store,
        bodyBorder:true,
        split : {size:3},
        border:false,
        style:'border-top:1px solid #009DDA;border-left:1px solid #009DDA;',
        rootVisible: true
    });

    /***********************  已选城市  end   ***********************************/






    /***********************  界面展示  start   ***********************************/

    var left_panel=new Ext.panel.Panel({
        border : false,
        split : true,
        region : 'center',
        layout :'border',
        items : [left_tree,area_grid]
    });
    new Ext.Viewport({
        layout:'border',
        items:[left_panel,right_tree]
    });

    /***********************  界面展示  end   ***********************************/








})