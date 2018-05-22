/**
 * Created by Administrator on 2016/3/31.
 */
var ScenicAll={}
var ScenicId=[]
Ext.onReady(function () {
    var sct_id=[];//景区id
    //景区选择部分(start)
    var url = $__app__ + '/Scenic/dataJson';
    var field = [
        {name:"sc_id"},
        {name:"sc_name"},
        {name:"sc_name_short"},
        {name:"sc_pym"},
        {name:"sc_cover"},
        {name:"sc_order"},
        {name:"sc_province"},
        {name:"sc_city"},
        {name:"sc_county"},
        {name:"sc_org_id"},
        {name:"sc_mapx"},
        {name:"sc_mapy"},
        {name:"sc_mapz"},
        {name:"sc_bintroduction"},
        {name:"sc_pic"},
        {name:"sc_address"},
        {name:"sc_telephone"},
        {name:"sc_opentime"},
        {name:"sc_attribute"},
        {name:"sc_status"},
        {name:"sc_dateline"},
        {name:"sc_spot_id"},
        {name:"sc_grades"}
    ];
    var scenic_store = new SUNLINE.JsonStore(url, field,false);
    var attrTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="select-wrap {cls}" id="{sc_id}" bintroduction="{sc_bintroduction}" data-qtip="{sc_name}">{sc_name}</div>',
        '</tpl>'
    );
    scenic_store.on('load',function(){
        var scenic_data=[],scenic_type=[],is_this=this,index= 0,index_data=[];
        is_this.each(function(v){
            var row= v.data;
            if(in_array(row.sc_type,scenic_type)==-1){
                scenic_type.push(row.sc_type);
                scenic_data.push({sc_id:0,sc_name:row.sc_type,cls:'heading-cls'});
                index+=1;
            }
            //显示已经选中的景点
            if(in_array(row.sc_id,ScenicId)!=-1)index_data.push(index);
            scenic_data.push(row);
            index+=1;
        });
        is_this.removeAll();
        Ext.each(scenic_data,function(v,i){
            is_this.add(v);
        });
        Ext.each(index_data,function(dv,di){
            attrView.getSelectionModel().select(dv, true);
        });
    });
    var sc_grades_combo=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:90,value:'全部类型',editable:false,forceSelection:false},{'d_type':'景区属性'},'','',false);
    var scenic_class=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:130,editable:false,forceSelection:false},{'d_type':'景区类型'},'','',false);
    var scenic_city=SUNLINE.DictComBox({name:'scenic_city',fieldLabel:"",labelWidth:0,allowBlank:false,width:90,value:'北京市',editable:false,forceSelection:false},{'d_type':'景区城市'},'','',false);
    var attrView = new Ext.view.View({
        store : scenic_store,
        tpl : attrTpl,
        multiSelect : true,
        simpleSelect : true,
        itemSelector:'div.select-wrap',
        selectedItemCls : 'selected-wrap',
        emptyText : '未找到景区',
        cls:'scroll-cls',
        height:430,
        scrollable:true
    });
    var scenic_panel=Ext.create('Ext.panel.Panel', {
        region:'center',
        tbar:[
            '景区类型:',sc_grades_combo.box,
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'景点名称',
                width:130,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            dosearch();
                    }
                }
            }
        ],
        items:attrView
    });
    var scenic_box=Ext.create('Ext.panel.Panel', {
        region:'west',
        width: 385,
        split : {size:3},
        tbar:[
            '所属城市:',scenic_city.box,
            '景区属性:',scenic_class.box
        ],
        items:scenic_panel
    });
    scenic_select_fn();// todo 测试默认加载
    function dosearch(){
        scenic_select_fn();
    };
    /**
     * 加载所有景区信息
     */
    function scenic_select_fn(){
        var where_data={start:0,limit:100};
        //判断城市选择
        var city_val=scenic_city.box.getValue();
        if(city_val && city_val!='全部城市')where_data['sc_city']=city_val;
        //判断属性选择
        var sc_class_val=scenic_class.box.getValue();
        if(sc_class_val && sc_class_val!='全部属性')where_data['attribute']=sc_class_val;
        //判断类型选择
        var grades_val=sc_grades_combo.box.getValue();
        if(grades_val)where_data['sc_type']=grades_val;
        //判断关键词选择
        var skey=Ext.getCmp('search').getValue();
        if(skey)where_data['skey']=skey;
        SUNLINE.baseParams(scenic_store,where_data);
        scenic_store.load();
    }
    //强追加“全部属性”
    scenic_class.box.store.on({
        load:function(){
            this.add({d_id:'',d_text:'全部属性'});
        }
    });
    //选择景区类型时
    sc_grades_combo.box.on({
        select:function(c,r,e){
            scenic_select_fn();
        }
    });
    //选择所属城市
    scenic_city.box.on({
        select:function(c,r,e){
            scenic_select_fn();
        }
    });

    //选择主题属性
    scenic_class.box.on({
        select:function(c,r,e){
            scenic_select_fn();
        }
    });

    //景区选择部分(end)

    //已选择景区部分(start)
    //结算方式
    var si_settle_type_box=SUNLINE.LocalComob({
        id:'ti_insti_type',
        fields:['ti_insti_type'],
        data:[['现金'],['签单']],
        config:{
            id:"ti_insti_type_id"
        }
    });

    //搜索项目中内项目数据
    var _cof={
        displayField:'text',
        valueField:'text',
        listConfig:{minWidth:285},
        allowBlank:false,
        listWidth:250,
        editable:true,
        forceSelection:false,
        pageSize:20
    };
    var cs_type_name_box=SUNLINE.ComBoxPlus({
        id:'cs_type_name',
        fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
        config:_cof
    });

    //var cp_url = $__app__ + '/Scenic/scenic_detail_list';
    var cp_field = [
        {name:'sct_id'},
        {name:'sct_scenic'},
        {name:'sct_name'},
        {name:'sct_price_settle'},
        {name:'sc_name'},
        {name:'sct_type'},
        {name:'sct_payment'},
        {name:'sc_bintroduction'}
    ];
    var scene_store=Ext.create('Ext.data.Store', {
        storeId: 'scenecStore',
        fields:cp_field,
        data: [],groupField:'sc_name'
    });;
    var scene_cm=[
        { text: '景区名称', dataIndex: 'sc_name', width:150,renderer:function(v){return '<font color="blue"><b>'+v+'</b></font>'}},
        {header:"资源名称ID", dataIndex:"sc_id", width:50,hidden:true},
        {header:"项目名称", dataIndex:"sct_name", width:120,editor:cs_type_name_box},
        {header:"项目名称ID", dataIndex:"sct_id", width:50,hidden:true},
        {header:"结算方式", dataIndex:"sct_payment", width:80,editor:si_settle_type_box,hidden:true},
        { text: '价格', dataIndex: 'sct_price_settle', width:80,align:'right',renderer:function(v){
            return '￥'+ parseFloat(v).toFixed(2);
        }}
    ];
    var all_scene=Ext.create('Ext.grid.Panel', {
        region:'center',
        store: scene_store,
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        columns: scene_cm,
        tbar:[
            '<b style="color:#3892d3">已选景区</b>',
            '->',
            {text:'移除选中景区', iconCls:'button-edit',handler:function(){
                var row=SUNLINE.getSelected(all_scene);
                scene_store.remove(row);
                scenic_store.add(row);
            }}
        ]
    });

    //加载资源项目信息
    cs_type_name_box.on({
        beforequery:function( c, r, i, e ){
            var row=SUNLINE.getSelected(all_scene);
            var cs_type_name_box_store=cs_type_name_box.store;
            SUNLINE.baseParams(cs_type_name_box_store,{type:'景区',at_id:row.get('sc_id'),start_date:20160601,end_date:20160630});
            cs_type_name_box_store.load();
        }
    });
    cs_type_name_box.on({
        select:function( c, r, e ){
            var row=SUNLINE.getSelected(all_scene);
            var r= r[0];
            row.set('sct_payment', r.get('pay_type'));
            row.set('sct_price_settle', r.get('price'));
        }
    });
    //点击景区时加载当前所选景区
    attrView.on({
        selectionchange:function(t,r,i,e){
            if(r.length>0){
                var rw= r[0].data;
                if(rw.sc_id==0)return false;
            }
            if(r.length<=0)return false;
            scene_store_load(r);
        }
    });
    //获取所选择景区值
    function scene_store_load(list){
        var row = attrView.getSelectedNodes(), sd_id=[];
        for(var i=0;i<list.length;i++){
            var r=list[i].data;
            sct_id.push(r.id);
            //景区部分移除选中部分
            scenic_store.remove(list[i]);
            //加入到已选择景区列表中
            scene_store.add(list[i]);
        };
    }
    //已选择景区部分(end)
    new Ext.Viewport({
        layout : 'border',
        items :[scenic_box,all_scene]
    });
});