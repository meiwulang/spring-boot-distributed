/**
 * Created by Administrator on 2016/3/31.
 */
var ScenicAll={}
var ScenicId=[]
ITEMS_SCENIC={
    ItemsScenic:function(opt){
        //景区选择部分(start)
        var url = $__app__ + '/Scenic/sc_dataJson';
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
        var sc_grades_combo=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:120,value:'全部类型',editable:false,forceSelection:false},{'d_type':'景区属性'},'','',false);
        var scenic_class=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:180,editable:false,forceSelection:false},{'d_type':'景区类型'},'','',false);
        var scenic_city=SUNLINE.DictComBox({name:'scenic_city',fieldLabel:"",labelWidth:0,allowBlank:false,width:120,value:'北京市',editable:false,forceSelection:false},{'d_type':'景区城市'},'','',false);
        var attrView = new Ext.view.View({
            store : scenic_store,
            tpl : attrTpl,
            multiSelect : true,
            simpleSelect : true,
            itemSelector:'div.select-wrap',
            selectedItemCls : 'selected-wrap',
            emptyText : '未找到景区',
            cls:'scroll-cls',
            height:450,
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
                    width:180,
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
            width: 480,
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
            if(grades_val && grades_val!='全部类型')where_data['sc_type']=grades_val;
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
        var cp_url = $__app__ + '/Scenic/scenic_detail_list';
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
        var scene_store=SUNLINE.GroupingStore(cp_url,cp_field,{sortInfo:{field:'sct_id',direction: "DESC"}, groupField:'sc_name'},false);
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
            selModel:{
                selType: 'checkboxmodel'/*,
                mode:'SIMPLE'*/
            },
            columns: scene_cm,
            tbar:[
                '<b style="color:#3892d3">已选景区</b>',
                '->',
                {text:'移除选中景区', iconCls:'button-edit',handler:scene_store_remove}
            ]
        });
        //加载资源项目信息
        cs_type_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(all_scene);
                var cs_type_name_box_store=cs_type_name_box.store;
                var rows=row.data;
                var start_date=Ext.Date.format(Ext.getCmp('team_start_date').getValue(),'Ymd');
                var end_date=Ext.Date.format(Ext.getCmp('team_end_date').getValue(),'Ymd');
                SUNLINE.baseParams(cs_type_name_box_store,{type:'景区',at_id:rows.sc_id,start_date:start_date,end_date:end_date});
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
        var sct_id=[];
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
            for(var i=0;i<row.length;i++){
                var r=row[i];
                sd_id.push(r.id);
                //景区部分移除选中部分
                scenic_store.remove(list[i]);
                //加入到已选择景区列表中
                scene_store.add(list[i]);
            };
        }
        //移除所选择景区
        function scene_store_remove(r){
            var rows=all_scene.getSelectionModel().getSelection();
            for(var i=0;i<rows.length;i++){
                var row=rows[i];
                scene_store.remove(row);
                scenic_store.add(row);
            }
        }
        //默认请况下赋值
        var load_first='yes';
        if(opt.store.scenic && load_first=='yes'){
            //当景区加截完成执行
            scenic_store.on({
                load:function(){
                    var scenic=opt.store.scenic,scenic_detail=[];
                    //统计右则有那些景点
                    scene_store.each(function(sv){
                       var rows= sv.data;
                        scenic_detail.push(rows.sc_id);
                    });
                    //scene_store.removeAll();
                    //统一需要删除项目添加项目去右则
                    var items_rows=[];
                    this.each(function(v){
                        if(!v)return true;
                        var row= v.data;
                        if(scenic[row.sc_id]){
                            items_rows.push(v);
                            if(in_array(row.sc_id,scenic_detail)==-1){
                                scene_store.add(v);
                            }
                        }
                    });
                    //删除多余的景区项目
                    for(var si=0;si<items_rows.length;si++){
                        scenic_store.remove(items_rows[si]);
                    }
                    load_first='no';
                }
            });
        }


        //已选择景区部分(end)
        return {scenic_box:scenic_box,all_scene:all_scene};
    },
    SelectSite:function(obj){
        //往返类型
        var goto_box=SUNLINE.LocalComob({
            id:'s_goto_type',
            fields:['s_goto_type'],
            data:[['去程'],['返程'],['往返']],
            config:{
                id:'s_goto_type',
                labelAlign:'right',
                fieldLabel:'往返类型',
                labelWidth:60,
                width:280,
                style:'float:left',
                value:'往返'
            }
        });
        var _cof={
            fields:['sd_id','sd_name','sd_code','sd_city'],url:$__app__ + '/StationStart/fen_select',
            where:{box_type:'出发口岸'},
            config:{
                width:280,
                labelWidth:60,
                displayField:'sd_name',
                valueField:'sd_name',
                editable:true,
                allowBlank:false,
                labelAlign:"right"
            }
        };
        _cof.id='site_start';
        _cof.config.fieldLabel="始发站点";
        _cof.config.id="site_start";
        var site_start_box=SUNLINE.ComBoxPlus(_cof);
        var site_form = Ext.create('Ext.form.Panel',{
            bodyPadding: 10,
            autoScroll:true,
            width: "100%",
            defaults:{
                labelWidth:60,
                width:280,
                labelAlign:'right',
                xtype:'textfield'
            },
            items:[
                {id:"s_bus_id",name:"bus_id",fieldLabel:"座位下标",hidden:true},
                {id:"start_site",name:"start_site",fieldLabel:"上车站点",allowBlank:false},
                {id:"site_id",name:"site_id",fieldLabel:"始发站ID",hidden:true},
                site_start_box,
                {id:"start_time",name:"start_time",fieldLabel:"上车时间"},
                goto_box,
                {id:"start_map",name:"start_map",fieldLabel:"地图座标",hidden:true},
                {xtype: 'checkboxfield',id:'site_seat_status',name: 'seat_status',fieldLabel: '接送状态',boxLabel: '设置为不含接送'},
                {xtype:'checkboxfield',id:'site_bool',name: 'site_bool',fieldLabel: '批量修改',boxLabel: '同步到所有游客上'}
            ]
        });

        var td_win= new Ext.Window({
            title:'编辑游客上车站点信息',
            width:320,
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            fixed:true,
            items:site_form,
            buttons:[
                {text:'确认保存',id:'dosave_id',handler:function(t){
                    var _site_from=site_form.getForm();
                    var _site_from_data=_site_from.getValues();
                    if (!_site_from.isValid() && _site_from_data.seat_status!='on') {
                        Ext.Msg.alert('友情提示', '红色边框显示为必填项！');
                        return;
                    };
                    if(obj)obj(t,_site_from_data,td_win);
                }},
                {text:'关闭', handler:function () { td_win.hide();},style:'margin-right:15px;'}
            ]
        });

        //当选择始发站的时候修改始发站ID
        site_start_box.on({
            select:function(c,r,n){
                var row= r[0].data;
                Ext.getCmp('site_id').setValue(row.sd_id);
            }
        });

        //当触发上车站点时跳出
        Ext.getCmp('start_site').on({
            focus:function(){
                $.layer({
                    type: 2,
                    border: [0],
                    title: false,
                    iframe: {src : $__app__+'/Buy/showMap'},
                    area: ['890px', '545px']
                });
            }
        });
        //选择框中选择的站点
        window.map_name_fn=function(map){
            Ext.getCmp('start_site').setValue(map.name);
            Ext.getCmp('start_map').setValue(map.start_map);
        }
        return {form:site_form,win:td_win};
    },
    SelectFly:function(opt,obj){
        var is_this=this;
        //操作航班(次)信息(start)
        //交通类型
        var traffic_type_combo=SUNLINE.LocalComob({
            id:'ob_type',
            fields:['ob_type'],
            data:[['火车'],['飞机']],
            config:{
                id:'ob_type',
                fieldLabel:"",
                labelWidth:0,
                labelAlign:"right" ,
                width:140,
                style:'float:left',
                forceSelection:false,
                value:'火车'
            }
        });

        //往返类型
        var goto_box=SUNLINE.LocalComob({
            id:'ob_goto_type',
            fields:['ob_goto_type'],
            data:[['去程'],['返程']],
            config:{
                id:'ob_goto_type',
                labelAlign:'right',
                fieldLabel:'往返类型',
                labelWidth:60,
                width:216,
                style:'float:left',
                value:'去程'
            }
        });

        var berth_type_box=SUNLINE.LocalComob({
            id:'ob_berth_type',
            fields:['ob_berth_type'],
            data:[['下铺'],['中铺'],['上铺'],['硬座'],['无座'],['二等座'],['一等座'],['经济舱'],['头等舱'],['商务舱']],
            config:{
                fieldLabel:'铺位信息',
                labelWidth:60,
                width:216,
                value:'二等座',
                labelAlign:'right',
                editable:true
            }
        });

        var fly_form= new Ext.form.FormPanel({
            border:false,
            layout : 'column',
            cls:'form_cm2',
            bodyStyle:'background:none; padding:10px;',
            defaults :{
                bodyStyle:'background:none;',
                layout : 'form',
                defaultType : 'textfield',
                defaults:{ width:300 },
                labelWidth:100,
                labelAlign:'right',
                border : false
            },
            items:[
                {
                    columnWidth:1,
                    defaults:{ width:300,labelAlign:"right" },
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '交通类型',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                traffic_type_combo,
                                goto_box
                            ]
                        },
                        {id:"bus_id", name:"bus_id", fieldLabel:"座位下标", xtype:'hidden'},
                        {id:"s_id", name:"s_id", fieldLabel:"座位ID", xtype:'hidden'},
                        {id:"ob_id", name:"ob_id", fieldLabel:"航班(次)ID", xtype:'hidden'},
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '航班(次)号',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                {id:'ob_bus_number',name:'ob_bus_number',xtype:'textfield', allowBlank:false,width: 140,style:'float:left',readOnly:true},
                                berth_type_box
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '始发站点',
                            combineErrors: false,
                            defaults: { hideLabel: true },
                            items: [
                                {id:'ob_start_site',name:'ob_start_site',xtype:'textfield',width: 140,style:'float:left',readOnly:true},
                                {xtype: 'displayfield', value: '目地站点:',style:'float:left;padding:0 6px'},
                                {id:'ob_end_site',name:'ob_end_site',xtype:'textfield',width: 147,readOnly:true}
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '出发日期',
                            combineErrors: false,
                            defaults: { hideLabel: true},
                            items: [
                                SUNLINE.ExtDateField({id:'ob_start_date',name:'ob_start_date',labelAlign:"right",format: 'Y-m-d',fieldLabel:false, allowBlank:false,style:'float:left',width:140,gang:'ob_end_date',start:true}),
                                SUNLINE.ExtDateField({id:'ob_end_date',name:'ob_end_date',labelAlign:"right",fieldLabel:'抵达日期',labelWidth:60, allowBlank:false,width:216,gang:'ob_start_date'})
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '出发时间',
                            combineErrors: false,
                            defaults: { hideLabel: true},
                            items: [
                                {id:'ob_start_time',name:'ob_start_time',xtype:'textfield',width: 140,blankText:"正确认格式:(10:30)",style:'float:left'},
                                {xtype: 'displayfield', value: '抵达时间:',style:'float:left;padding:0 6px'},
                                {id:'ob_end_time',name:'ob_end_time',xtype:'textfield',width: 147,blankText:"正确认格式:(10:30)"}
                            ]
                        },
                        {id:"ob_old_start", name:"ob_old_start", fieldLabel:"原始始发站", xtype:'hidden'},
                        {id:"ob_old_end", name:"ob_old_end", fieldLabel:"原始目的地", xtype:'hidden'},
                        {id:"ob_site_sid", name:"ob_site_sid", fieldLabel:"始发站ID", xtype:'hidden'},
                        {id:"tbd_id", name:"tbd_id", fieldLabel:"库存ID", xtype:'hidden'},
                        {id:"tbd_type", name:"tbd_type", fieldLabel:"库存类型", xtype:'hidden'},
                        {id:"ob_start_code", name:"ob_start_code", fieldLabel:"始发站编号", xtype:'hidden'},
                        {id:"ob_end_code", name:"ob_end_code", fieldLabel:"目的地编号", xtype:'hidden'},
                        {id:"ob_start_platform", name:"ob_start_platform", fieldLabel:"始发站站台",xtype:'hidden'},
                        {id:"ob_site_eid", name:"ob_site_eid", fieldLabel:"目的地ID", xtype:'hidden'},
                        {id:"ob_city_start", name:"ob_city_start", fieldLabel:"出发城市", xtype:'hidden'},
                        {id:"ob_city_end", name:"ob_city_end", fieldLabel:"目的地城市", xtype:'hidden'},
                        {id:"ob_end_platform", name:"ob_end_platform", fieldLabel:"目的地站台",xtype:'hidden'},
                        {xtype: 'checkboxfield',id:'fly_seat_status',name: 'seat_status',fieldLabel: '交通状态',boxLabel: '设置为不含大交通(大交通自理)'},
                        {xtype: 'checkboxfield',id:'add_ticket',name: 'add_ticket',fieldLabel: '交通类型',boxLabel: '只做接送站点使用'},
                        {xtype: 'checkboxfield',id:'ob_bool',name: 'site_bool',fieldLabel: '批量修改',boxLabel: '同步到所有相同票种（已出票无效）'}
                    ]
                }
            ]
        });

        var f_win= new Ext.Window({
            title:'大交通信息选择',
            width:480,
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            fixed:true,
            items:fly_form,
            buttons:[
                {text:'确认保存', handler:td_dosave},
                {text:'关闭', handler:function () { f_win.hide();},style:'margin-right:15px;'}
            ]
        });
        var fly_grid=ITEMS_YUN.FlySelect({site:'yes'});
        var fly_win = new Ext.Window({
            title:"在线选择航班(次)信息",
            width:1000,
            height:525,
            resizable:false,
            modal:true,
            closeAction:'hide',
            fixed:true,
            items: fly_grid.grid,
            buttons:[
                {text:'确认选择',handler:confirm_fly},
                {text:'关闭',handler:function(){ fly_win.hide(); }}
            ]
        });

        //当窗口打开时执行
        goto_box.on({select:function(v){
                if(fly_form.post_back){
                    var _from=fly_form.getForm();
                    if(v.value=='返程'){
                        _from.setValues(fly_form.post_back);
                    }else{
                        _from.setValues(fly_form.post_go);
                    }
                }else{
                    Ext.getCmp('ob_start_date').setValue(int2date(opt.end_date));
                    Ext.getCmp('ob_end_date').setValue(int2date(opt.end_date));
                }
            }
        });

        //在线选择班次数据
        Ext.getCmp('ob_bus_number').on({
            focus:function(t,e,o){
                fly_win.show();
                var start_code=Ext.getCmp('ob_start_code').getValue();
                var end_code=Ext.getCmp('ob_end_code').getValue();
                //if(!start_code || !end_code)return false;
                var start_date=Ext.util.Format.date(Ext.getCmp('ob_start_date').getValue(),'Ymd');
                var site_data={
                    start:{
                        sd_start_type:traffic_type_combo.getValue(),
                        sd_name:Ext.getCmp('ob_start_site').getValue(),
                        sd_id:Ext.getCmp('ob_site_sid').getValue(),
                        sd_city:Ext.getCmp('ob_city_start').getValue(),
                        sd_code:start_code
                    },
                    end:{
                        sd_name:Ext.getCmp('ob_end_site').getValue(),
                        sd_id:Ext.getCmp('ob_site_eid').getValue(),
                        sd_city:Ext.getCmp('ob_city_end').getValue(),
                        sd_code:end_code
                    },
                    start_date:start_date
                };
                fly_grid.fn(site_data);
            }
        });

        function confirm_fly(v){
            var rows=SUNLINE.getSelected(fly_grid.grid);
            if(!rows){
                Ext.Msg.alert('友情提示','请选择需要选择的班次信息！');
                return false;
            }
            var start_site=Ext.getCmp('start_site_id_id').getValue();
            var end_site=Ext.getCmp('end_site_id_id').getValue();
            rows=rows.data;
            var _form_fly=fly_form.getForm();
            var form_post={
                ob_bus_number:rows.fl_number,
                ob_start_site:start_site,
                ob_end_site:end_site,
                ob_start_time:rows.fl_start_time,
                ob_end_time:rows.fl_end_time,
                ob_site_sid:rows.fl_start_id,
                ob_start_code:rows.fl_start_code,
                ob_start_platform:rows.fl_start_platform,
                ob_site_eid:rows.fl_end_id,
                ob_end_code:rows.fl_end_code,
                ob_end_platform:rows.fl_end_platform
            };
            if(rows.fl_stock){
                $.each(rows.fl_stock,function(i,v){
                    form_post.tbd_id= v.tbd_id;
                    form_post.tbd_type= v.tbd_type;
                    return false;
                })
            }
            _form_fly.setValues(form_post);
            fly_win.hide();
        }

        function td_dosave(t){
            var form_fly=fly_form.getForm();
            var _site_form_fly=form_fly.getValues();
            if(!form_fly.isValid() && _site_form_fly.seat_status!='on'){
                Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
                return;
            }
            if(obj)obj(t,form_fly.getValues(),f_win);
        }
        //操作航班(次)信息(end)
        return {win:f_win,form:fly_form};
    }
};