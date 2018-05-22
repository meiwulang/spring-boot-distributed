/**
 * Created by zhushaolei on 2016/2/27.
 */
var SaveDetail=true;
var CheckBool=false;
var ScenicAll={};
var SeatStore=[];
var ScenicId=[];
var DaysBoxId;
var DaysEmpty=[];
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;
    //导入百度编辑器
    var editor_data={
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test','forecolor','backcolor','fontsize','underline','strikethrough','justify','indent']],
        //focus时自动清空初始化时的内容
        /* autoClearinitialContent:true,*/
        //关闭字数统计
        wordCount:false,
        //关闭elementPath
        elementPathEnabled:false,
        //默认的编辑区域高度
        initialFrameHeight:300,
        initialStyle:'p{font-size: 12px;}'
    };
    editor_data.initialFrameHeight=150;
    var supply_Editor=UE.getEditor('team-supply-detail',editor_data);
    var special_Editor=UE.getEditor('team_special_id',editor_data);
    var give_Editor=UE.getEditor('team_give_id',editor_data);
    var money_in_Editor=UE.getEditor('team_money_in_id',editor_data);
    var money_notin_Editor=UE.getEditor('team_money_notin_id',editor_data);

    if(tm_seat_data)SeatStore=tm_seat_data;
    ScenicAll=tm_spare_scenic;
    var DateScenic={};
    var ScenicItems={};
    var items_grid;
    var TotelStore=Ext.create('Ext.data.Store', {
        storeId: 'TotelStore',
        fields:[],
        data: []
    });
    if(typeof tm_itmes_detail!='object')tm_itmes_detail=[];
    var items_f=['ti_id'];
    var ItemsStore=Ext.create('Ext.data.Store', {
        storeId: 'ItemsStore',
        fields:items_f,
        data: tm_itmes_detail,groupField:'ti_sort'
    });

    //景区选择窗口(start)
    var scenicIT=ITEMS_SCENIC.ItemsScenic({store:tm_spare_scenic});

    var ItemsWindow=new Ext.Window({
        title : '选择游玩景区',
        width : 1000,
        height : 600,
        modal : true,
        maximizable : true,//全屏效果
        closeAction : 'hide',
        fixed:true,
        autoScroll : true,
        layout : 'border',
        items:[scenicIT.scenic_box,scenicIT.all_scene],
        buttons:[
            {text:'确认选择',id:'sct_wind_id',handler:scenic_items_fn},
            {text:'关闭', handler:function(){ItemsWindow.hide();}}
        ]
    });
    var scenicIT_detail=scenicIT.all_scene;
    //添加景点时
    scenicIT_detail.store.on({
        add:function(s,rw){
            var type='add';
            scenicIT_fn(rw,'add');
        }
    });
    /**
     * 提交选择数据
     * @param rw 所选择数据
     * @param type 判断是添加还是删除
     */
    function scenicIT_fn(rw,type){
        var scenic_val={},scenic_items={};
        if(ScenicAll.scenic)scenic_val=ScenicAll.scenic;
        if(ScenicAll.scenic_items)scenic_items=ScenicAll.scenic_items;
        var rows=rw;
        for(var i=0;i<rows.length;i++){
            var r=rows[i].data;
            if(type=='remove'){
                delete(scenic_val[r.sc_id]);
                delete(scenic_items[r.sc_id]);
            }else{
                scenic_val[r.sc_id]={
                    sc_id:r.sc_id,
                    sc_bintroduction: r.sc_bintroduction,
                    sc_name: r.sc_name
                }
                if(!scenic_items[r.sc_id]){
                    scenic_items[r.sc_id]=[];
                    scenic_items[r.sc_id].push(r);
                }else{
                    scenic_items[r.sc_id]=[r];
                }
            }
        }
        ScenicAll.scenic=scenic_val;
        ScenicAll.scenic_items=scenic_items;
        scenic_html_fn();
    }

    //移除景点时
    scenicIT_detail.store.on({
        remove:function(){
            var rows=scenicIT_detail.getSelectionModel().getSelection();
            scenicIT_fn(rows,'remove');
        }
    });

    function scenic_html_fn(){
        var scenic_html='';
        $.each(ScenicAll.scenic,function(i,v){
            scenic_html+='<em class="tsc-list" data-id="'+ v.sc_id+'">'+ v.sc_name+'</em>'
        })
        if(scenic_html)scenic_html='已选备用景区：'+scenic_html;
        $('.team-scenic').html(scenic_html);
    }
    //景区选择窗口(end)

    //选择酒店窗口 (start)
    var hotel_field=['sc_id','sc_name'];
    var HotelStore = SUNLINE.JsonStore($__app__+'/Dict/dict_json' , hotel_field , false);
    var Hotel_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"ht_id", width:50, hidden:true},
        {header:"酒店名称", dataIndex:"ht_name", width:170},
        {header:"酒店星级", dataIndex:"ht_class", width:120}
    ];
    var hotel_combo=SUNLINE.DictComBox({id:'hotel_class',name:'hotel_class',labelAlign:"right",value:'全部等级酒店',editable:true,forceSelection:true},{'d_type':'酒店等级'});

    var hotel_grid=new Ext.grid.GridPanel({
        store:HotelStore,
        columns:Hotel_cm,
        bodyBorder: false,
        tbar:[
            '搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'景区名称',
                width:150,
                onTriggerClick:function (e) {
                    hotel_dosearch();
                },
                listeners:{
                    "specialkey":function (_t, _e) {
                        if (_e.keyCode == 13)
                            hotel_dosearch();
                    }
                }
            },hotel_combo.box
        ]
    });

    function hotel_dosearch(){
        var skey=Ext.getCmp('hotel_search').getValue();
        SUNLINE.baseParams(HotelStore,{query:skey,d_type:'酒店住宿',start:0,limit:20});
        HotelStore.currentPage=1;
        HotelStore.load();
    }

    hotel_combo.box.on('select',function(c,r,n){
        var hotel_class=Ext.getCmp('hotel_class').getValue('全部等级酒店');
        if(hotel_class=='全部等级酒店')class_='';
        SUNLINE.baseParams(HotelStore,{ht_class:hotel_class,d_type:'酒店住宿',start:0,limit:20});
        HotelStore.currentPage=1;
        HotelStore.load();
    })

    hotel_grid.on({
        celldblclick:function(){ HotelSelectFn(); }
    });

    //酒店弹出窗口
    var HotelWindow= new Ext.Window({
        title : '选择住宿酒店',
        width : 400,
        height : 600,
        modal : true,
        maximizable : true,//全屏效果
        closeAction : 'hide',
        fixed:true,
        autoScroll : true,
        items:hotel_grid,
        buttons:[
            '<font color="blue">双击可选中</font>',
            '->',
            {text:'确认选择',handler:HotelSelectFn},
            {text:'关闭', handler:function(){HotelWindow.hide();}}
        ]
    });
    //选择酒店窗口 (end)




    var TeamTo={
        ext_cof_fn:function(row){
            return {
                id:row.attr('id'),
                name:row.attr('id'),
                width:180,
                height:26,
                renderTo:row.attr('id'),
                fieldLabel:false,
                value:row.find('.txt').html(),
                cls:'ext_from'
            };
        },
        //构造方法
        construct:function(){
            this.ExtBox();
            this.ExtDate();
            this.TeamItems();
            this.PopBlur();
            this.TeamClose();
            this.DataSave();
            this.SeatData();
            this.HistoryTeam();
            this.DaysScenicDel();
            this.BatchUser();
            this.BatchSite();
            this.BatchFly();
            this.AddOffer();
            this.default_store();
        },
        //选择酒店确认
        hotel_select_fn:function(t){
            var row= SUNLINE.getSelected(hotel_grid);
            DaysBoxId.find('input[name=hotel_id]').val(row.get('ht_id'));
            DaysBoxId.find('input[name=hotel_name]').val(row.get('ht_name'));
            this.HotelStoreData();
            HotelWindow.hide();
        },
        //选择景区确认(新)
        scenic_items_fn:function(t,rows_scenic){
            var rows;
            if(rows_scenic){
                rows=rows_scenic;
            }else{
                var sc_grid=scenicIT.all_scene;
                rows=sc_grid.getSelectionModel().getSelection();

                //内容为当前+选择到的
                var scid=[];
                //获取原始数据

                var sc_val=DaysBoxId.find('input[name=sc_id]').val();
                if(sc_val)scid=sc_val.split(',');
                //得到最新数据
                Ext.each(rows,function(rws_v,rows_i){
                    var rws=rws_v.data;
                    scid.push(rws.sc_id);
                });
                var scenic_data=[];
                for(var i=0;i<scid.length;i++){
                    var scval=ScenicAll.scenic_items[scid[i]];
                    $.each(scval,function(i,v){
                        scenic_data.push(v);
                    })
                }
                rows=scenic_data;
            }

            var is_this=this;
            var date_val=DaysBoxId.attr('date-val');
            DateScenic_val=DateScenic[date_val];
            var str,scene_name={},scene_txt='',scene_data={},sc_name=[],sc_id=[];
            Ext.each(rows,function(rows_v,rows_i){
                var rows_data=rows_v;
                scene_name[rows_data.sc_name]=scene_name[rows_data.sc_name];
                sc_name.push(rows_data.sc_name);
                sc_id.push(rows_data.sc_id);
                if(str){
                    str+=','+rows_data.sc_id;
                    scene_txt+=' → '+rows_data.sc_name;
                }else{
                    str=rows_data.sc_id;
                    scene_txt=rows_data.sc_name;
                }
                if(DateScenic_val){
                    if(typeof DateScenic_val[rows_data.sc_id]=='object'){
                        scene_data[rows_data.sc_id]=DateScenic_val[rows_data.sc_id];
                    }else{
                        scene_data[rows_data.sc_id]={sc_id:rows_data.sc_id,sc_name:rows_data.sc_name,sc_bintroduction:rows_data.sc_bintroduction};
                    }
                }else{
                    scene_data[rows_data.sc_id]={sc_id:rows_data.sc_id,sc_name:rows_data.sc_name,sc_bintroduction:rows_data.sc_bintroduction};
                }
            });
            DateScenic[date_val]=scene_data;
            //显示隐藏项目明细
            if(str){
                DaysBoxId.find('.hide-cls').show();
            }else{
                DaysBoxId.find('.hide-cls').hide();
            }
            //线路安排
            DaysBoxId.find('input[name=line_id]').val(scene_txt);
            DaysBoxId.find('input[name=sc_id]').val(str);
            DaysBoxId.find('input[name=sc_name]').val(sc_name);
            DaysBoxId.find('input[name=sc_name]').attr('data-val',sc_name);
            //景点说明
            var msg_box=DaysBoxId.find('.msg-box');
            var msg_tpl=is_this.SceneMsgTpl(str,scene_data);
            msg_box.find('dl').html(msg_tpl);
            is_this.ScItemsBlur();
            //如果项目内容存在，操作项目内容区域
            if(typeof ScenicAll=='object'){
                TotelStore.removeAll();
                $.each(sc_id,function(i,v){
                    if(!ScenicAll.scenic_items) return true;
                    if(typeof ScenicAll.scenic_items[v]=='object'){
                        var row=ScenicAll.scenic_items[v];
                        $.each(row,function(i,v){
                            TotelStore.add(v);
                        });
                    }
                });
                is_this.ScenicItemsSave(TotelStore,DaysBoxId);
            }
            //关闭窗口
            ItemsWindow.hide();
            this.DaysScenicDel();
        },
        //编辑团队时默认数据源
        default_store:function(){
            if(tm_route.length>0){
                for(var ri=0;ri<tm_route.length;ri++){
                    if(typeof ScenicAll=='object'){
                        var sc_id=tm_route[ri]['sc_id'];
                        if(sc_id)sc_id=sc_id.split(',');
                        var obj={};
                        $.each(sc_id,function(i,v){
                            if(!ScenicAll.scenic_items) return true;
                            if(typeof ScenicAll.scenic_items[v]=='object'){
                                var row=ScenicAll.scenic_items[v];
                                $.each(row,function(i,v){
                                    obj[v.sc_id]=v;
                                });
                            }
                        });
                        ScenicItems[ri]=obj;
                    }
                }
            }
        },
        //宣染下列控件
        ExtBox:function(){
            //下拉框
            var is_this=this;
            var ext_box=$('.ext-box');
            $.each(ext_box,function(i,v){
                var row=ext_box.eq(i);
                var _cof={
                    id:row.attr('id'),
                    fields:['id','text'],url:$__app__ + '/Team/com_box_data',
                    config:{
                        displayField:'text',
                        valueField:'text',
                        triggerAction:'all',
                        minChars:2,
                        queryDelay:300,
                        allQuery : ''
                    }
                };
                if(row.attr('id')=='go_end' || row.attr('id')=='back_end')_cof.config.minWidth=265;
                if(row.attr('data-where')){
                    var dw=row.attr('data-where');
                    var where={};
                    var dw_data=dw.split(':');
                    for(var i=0;i<dw_data.length;i++){
                        if(i%2==0)where[dw_data[i]]=dw_data[(i+1)];
                    }
                    _cof['where']=where;
                }
                var opt=is_this.ext_cof_fn(row);
                _cof.config= Ext.apply(_cof.config, opt);
                if(o_number){
                    if(in_array(row.attr('id'),['tm_agency','tm_linkman'])!=-1)_cof.config.readOnly=true;
                }
                var com_box=SUNLINE.ComBoxPlus(_cof);
                com_box.on({
                    select:function(c,r,e){
                        var rw= r[0].data;
                        $('input[name='+row.attr('id')+'_id]').val(rw.id);
                        if(row.attr('id')=='go_traffic'){
                            $('#team_traffic .go-cls').find('.arrow').html('<i class="fa fa-'+traffic_default[rw.text]+'"></i>');
                        }
                        if(row.attr('id')=='back_traffic'){
                            $('#team_traffic .back-cls').find('.arrow').html('<i class="fa fa-'+traffic_default[rw.text]+'"></i>');
                        }
                        if(row.attr('id')=='tm_agency'){
                            $('input[name=buy_fax]').val(rw.tel);
                            $('input[name=tm_linkman_id]').val('');
                            Ext.getCmp('tm_linkman').setValue('');
                        }
                        //修改行程中的酒店信息
                        if(row.attr('id')=='tm_hotel_level'){
                            is_this.HotelToAll();
                            is_this.HotelStoreData();
                        }

                        //修改去程大交通
                        if(row.attr('id')=='go_traffic'){
                            Ext.getCmp('go_start').setValue('');
                            Ext.getCmp('go_end').setValue('');
                            is_this.BigSmallSaveTraffic(rw.text,'去程');
                        }
                        if(row.attr('id')=='back_traffic'){
                            Ext.getCmp('back_start').setValue('');
                            Ext.getCmp('back_end').setValue('');
                            is_this.BigSmallSaveTraffic(rw.text,'返程');
                        }
                    }
                });
                if(row.attr('id')=='tm_linkman' || where['box_type']=='出发口岸'){
                    com_box.on({
                        beforequery:function(q,opt){
                            if(where['box_type']=='出发口岸'){
                                var tf_type=Ext.getCmp('go_traffic').getValue();
                                if(row.hasClass('back-id'))tf_type=Ext.getCmp('back_traffic').getValue();
                                SUNLINE.baseParams(this.getStore(),{sd_start_type:tf_type,box_type:'出发口岸'});
                                //this.getStore().load();
                            }
                            if(row.attr('id')=='tm_linkman'){
                                var org_id=$('input[name=tm_agency_id]').val();
                                SUNLINE.baseParams(this.getStore(),{org_id:org_id,box_type:'用户'});
                                this.getStore().load();
                            }
                        }
                    });

                }
            });
        },
        //修改大交通信息
        BigSmallSaveTraffic:function(name,type){
            var pop=this.PopData();
            //添加成人票大交通信息
            var big_name=name+'成人';
            if(name=='交通自理')big_name=name;
            var itmes_data={
                insti_name:big_name,
                cs_type_name:type+'成人',
                type_new:'大交通',
                sct_type:'成人票'
            };
            this.EmptyItemsStore(itmes_data);
            //添加儿童票大交通
            if(pop.small>0){
                var small_name=name+'儿童';
                if(name=='交通自理')small_name=name;
                var small_itmes={
                    insti_name:small_name,
                    cs_type_name:type+'儿童',
                    type_new:'大交通',
                    sct_type:'儿童票',
                    num:pop.small
                };
                this.EmptyItemsStore(small_itmes);
            }
        },
        //宣染日期控件
        ExtDate:function(){
            //日期选择
            var is_this=this;
            var ext_date=$('.ext-date');
            $.each(ext_date,function(di,dv){
                var row=ext_date.eq(di);
                var _cof={ format: 'Y-m-d',value:row.find('txt').html(),gang:row.attr('to-id')};
                if(row.attr('id')=='team_start_date') _cof['start']=true;
                var opt=is_this.ext_cof_fn(row);
                _cof= Ext.apply(_cof, opt);
                var date_id=SUNLINE.ExtDateField(_cof);
            });

            setTimeout(function(){
                var dateId=[Ext.getCmp('team_start_date'),Ext.getCmp('team_end_date')];
                is_this.DateDays(dateId[0],dateId[1],'load');
                $.each(dateId,function(i,v){
                    v.on('select',function(){
                        is_this.DateDays(dateId[0],dateId[1]);
                    });
                })
            },100);

        },
        DateDays:function(days_start,days_end,type){
            var start_date=parseFloat(days_start.getValue().getTime()/1000);
            var end_date=parseFloat(days_end.getValue().getTime()/1000);
            var days=(end_date-start_date)/3600/24+1;
            $('input[name=team_days]').val(days);
            var days_data=date_lousy(days_start.rawValue,days_end.rawValue);
            this.DateDaysView(days_data,type);
        },
        DistanceDays:function(){
            var dateId=[Ext.getCmp('team_start_date'),Ext.getCmp('team_end_date')];
            var days_start=dateId[0];
            var days_end=dateId[1];
            var start_date=parseFloat(days_start.getValue().getTime()/1000);
            var end_date=parseFloat(days_end.getValue().getTime()/1000);
            var days=(end_date-start_date)/3600/24+1;
            return days;
        },
        emptyView:function(days_data){
            //存储已经有的行程
            var team_days=$('.team_days');
            for(var ti=0;ti<team_days.length;ti++){
                var days_id=team_days.eq(ti);
                var d_id=days_id.attr('date-val');
                //if(DaysEmpty[d_id] || !days_id.find('.days-scenic').html())continue;
                var detail=this.FromDetailFind(days_id,(d_id+1));
                DaysEmpty[d_id]=detail;
            }
            //得到行程天数
            var days=this.DistanceDays(),days_tpl='';
            for(var i=0;i<days;i++){
                if(DaysEmpty[i]){
                    //days_tpl+='<div class="team_days days-'+i+'" date-val="'+i+'">'+DaysEmpty[i]+'</div>';
                    days_tpl+=this.TeamTpl(DaysEmpty[i],i);
                }else{
                    days_tpl+=this.DaysTpl(i);
                }
            }
            $('.tm-table').html(days_tpl);
        },
        SaveView:function(){
            if(typeof tm_route!='object')return '';
            var is_this=this;
            var tpl='';
            $.each(tm_route,function(i,v){
                tpl+=is_this.TeamTpl(v,i);
            })
            $('.tm-table').html(tpl);
        },
        DateDaysView:function(days_data,type){
            if(SaveDetail==true && typeof tm_route=='object'){
                this.SaveView();
                SaveDetail=false;
            }else{
                this.emptyView(days_data);
            }
            var is_this=this;
            setTimeout(function(){
                is_this.SceneItems();
                is_this.DaysHotel();
                is_this.ClickStatus();
                is_this.HotelToAll();
                if(type!='load')is_this.HotelStoreData();
                if(type!='load')is_this.ItemsFood();
                is_this.DaysScenicDel();
                is_this.ScenicSort();
                is_this.AddDayScenic();
                var days_from=$('.days-from');
                var detail_editor={};
                /*for(var di=0;di<days_from.length;di++){
                    detail_editor[di]=UE.getEditor('detail-'+di,editor_data);
                }*/
            },200);
        },
        //景区说明模板
        SceneMsgTpl:function(id,data){
            if(!id)return '';
            var sc_id=id.split(',');
            var scene_msg='';
            var scene_data={};
            $.each(sc_id,function(si,sv){
                var row=data[sv];
                scene_msg+='<dd class="msg-list msg-'+row.sc_id+'" data-id="'+row.sc_id+'">' +
                    '<span class="days-title">'+row.sc_name+'</span>' +
                    '<span class="days-info">' +
                    '<input type="text" name="scenic_msg_id[]" class="days-from scenic_items" value="'+row.sc_bintroduction+'">' +
                    '</span>' +
                    '</dd>';
            });
            return scene_msg;
        },
        //编辑景区说明触发
        ScItemsBlur:function(){
            var scenic_items=$('.scenic_items');
            scenic_items.unbind();
            scenic_items.blur(function(){
                var days=$(this).parents('.team_days');
                var msg_id=$(this).parents('.msg-list');
                DateScenic[days.attr('date-val')][msg_id.attr('data-id')]['sc_bintroduction']=$(this).val();
            });
        },
        //景区项目选择
        SceneItems:function(){
            var is_this=this;
            var scene_items_select=$('.scene_items_select');
            var len=scene_items_select.length;
            var cp_url = $__app__ + '/Scenic/scenic_items_list';
            var cp_field = [
                {name:'sct_id'},
                {name:'sct_scenic'},
                {name:'sct_name'},
                {name:'sct_price_settle'},
                {name:'sc_name'},
                {name:'sct_type'},
                {name:'sct_payment'},
                {name:'sc_bintroduction'},
                {name:'sct_explain'}
            ];
            var scene_store=SUNLINE.GroupingStore(cp_url,cp_field,{sortInfo:{field:'sct_id',direction: "DESC"}, groupField:'sc_name'},false);

            var items_store=Ext.create('Ext.data.Store', {
                storeId: 'scenecStore',
                fields:cp_field,
                data: [],groupField:'sc_name'
            });
            var scene_cm=[
                { text: '景区名称', dataIndex: 'sc_name', width:150,hidden:true},
                { text: '项目名称', dataIndex: 'sct_name', width:250},
                { text: '票价类型', dataIndex: 'sct_type', width:100},
                { text: '价格', dataIndex: 'sct_price_settle', width:120,align:'right',renderer:function(v){
                    return '￥'+ parseFloat(v).toFixed(2);
                }}
            ];
            var grouping_Scene = Ext.create("Ext.grid.feature.Grouping",{
                groupHeaderTpl: "<span class='sc-cls'>{name}  (共 {[values.rows.length]} 项)</span>"
            });
            var all_scene=Ext.create('Ext.grid.Panel', {
                region:'west',
                width:500,
                store: scene_store,
                features: [grouping_Scene],
                columns: scene_cm,
                tbar:[
                    '<b style="color:#3892d3">全部子项目</b>',
                    '->',
                    {text:'加入到选择中', iconCls:'button-edit',handler:add_items}
                ]
            });

            var grouping_Items = Ext.create("Ext.grid.feature.Grouping",{
                groupHeaderTpl: "<span class='sc-cls'>{name}  (共 {[values.rows.length]} 项)</span>"
            });

            var select_scene=Ext.create('Ext.grid.Panel', {
                region:'center',
                store: items_store,
                style:'border-left:2px solid #008DC4',
                features: [grouping_Items],
                columns: scene_cm,
                autoScroll:true,
                tbar:[
                    '<b style="color:#3892d3">已选择的子项目</b>',
                    '->',
                    {text:'删除所选择项目', iconCls:'button-edit',handler:add_items}
                ]
            });

            var scene_win=Ext.create('Ext.window.Window', {
                title: '景点子项选择',
                autoHeight:true,
                closeAction : 'hide',
                resizable:false,
                fixed:true,
                modal:true,
                height: 500,
                width: 1000,
                autoScroll:true,
                layout: 'border',
                items: [ all_scene,select_scene ],
                buttons:[
                    {text:'保存', handler:scene_save},
                    {text:'关闭', handler:function () {
                        scene_win.hide();
                    }}
                ]
            });

            var days_exit=$('.days-exit');
            var DaysId,ItemsId;
            days_exit.unbind();
            days_exit.click(function(){
                var days_id=DaysId=$(this).parents('.team_days');
                var sc_id=days_id.find('input[name=sc_id]').val();
                SUNLINE.baseParams(scene_store,{sc_id:sc_id,days_date:days_id.attr('date-val')});
                scene_store.load();
                scene_win.show();
                items_store.removeAll();
            });

            //load时加载
            scene_store.on('load',function(){
                ItemsId=DaysId.find('input[name=sc_items_id]').val();
                if(ItemsId)ItemsId=ItemsId.split(',');
                var remove_id=[],j=0;
                this.each(function(v,i){
                    if(typeof v.data!='object')return true;
                    var row= v.data;
                    if(in_array(row.sct_id,ItemsId)!=-1 && ItemsId){
                        remove_id[j]=v;
                        j++;
                    }
                });
                $.each(remove_id,function(i,v){
                    add_remove_store(v);
                })
            });

            //加入或加入景点项目
            function add_items(e){
                var row=SUNLINE.getSelected(select_scene);
                var msg='移除';
                if(e.text=='加入到选择中'){
                    row=SUNLINE.getSelected(all_scene);
                    msg='加入';
                }
                if(!row){
                    Ext.Msg.alert('友情提示','请选择需要'+msg+'的景点项目!');
                    return false;
                }
                add_remove_store(row,msg);
            }

            all_scene.on({
                celldblclick:function(t, td, c, r, tr, ri, e, opt){
                    add_remove_store(r,'加入');
                }
            });
            select_scene.on({
                celldblclick:function(t, td, c, r, tr, ri, e, opt){
                    add_remove_store(r,'移除');
                }
            });

            //加入或加入景点项目
            function add_remove_store(row,type){
                if(type=='移除'){
                    scene_store.add(row);
                    items_store.remove(row);
                }else{
                    var sct_id=[];
                    items_store.each(function(v,i){
                        sct_id[i]= v.data.sct_id;
                    })
                    if(in_array(row.data.sct_id,sct_id)==-1){
                        items_store.add(row);
                    }
                    scene_store.remove(row);
                }
            }

            /**
             * 保存票务明细
             */
            function scene_save(){
                is_this.ScenicItemsSave(items_store,DaysId);
                scene_win.hide();
            }
        },
        //得到景区ID
        ItemsStoreData:function(data){
            ScenicId=[];
            data.each(function(v){
                var row= v.data;
                ScenicId.push(row.sc_id);
            });
        },
        /**
         * 操作当天景区票价
         * @param data 景区项目
         * @param days_id 当天标示
         * @constructor
         */
        ScenicItemsSave:function(data,days_id){
            var items_id=[],ii= 0,items_txt='',Items_data=[];
            data.each(function(v,i){
                var row= v.data;
                if(row.sct_id==-1)return true;
                items_id[i]=[row.sct_id];
                if(items_txt){
                    items_txt+=','+row.sc_name+'('+row.sct_name+row.sct_price_settle+'元/人)';
                }else{
                    items_txt=row.sc_name+'('+row.sct_name+row.sct_price_settle+'元/人)';
                }
                Items_data[row.sct_id]=row;
            });
            ScenicItems[days_id.attr('date-val')]=Items_data;
            days_id.find('input[name=sc_items_id]').val(items_id);
            days_id.find('input[name=scenic_items_id]').val(items_txt);
            this.TeamStore(ScenicItems);
        },
        HotelStoreData:function(){
            var team_days=$('.team_days'),hotel_data={},is_this=this;
            var pop=is_this.PopData();
            var len=team_days.length;
            $.each(team_days,function(i,v){
                if(i>=(len-1))return false;
                var days_id=team_days.eq(i);
                var hotel_id=days_id.find('input[name=hotel_id]').val();
                var hotel_name=days_id.find('input[name=hotel_name]').val();
                if(!hotel_id)return true;
                hotel_data[hotel_id]={
                    ti_name_id:hotel_id,
                    ti_insti_name:hotel_name,
                    ti_type_mode:'按人计算',
                    ti_num:hotel_data[hotel_id]?(parseFloat(hotel_data[hotel_id]['ti_num'])+1):1,
                    ti_type_new:'住宿',
                    ti_day:'-1',
                    ti_all_money:0,
                    ti_trade_price:0,
                    ti_type:'基本',
                    ti_insti_type:'现金',
                    ti_sct_type:'成人票',
                    ti_sort:sort_fn('住宿'),
                    ti_sense_price:0,
                    ti_profit:0//毛利
                };
            });
            //先取出已经存在的酒店信息
            if(pop.big==0)pop.big=1;
            var hotel_num=pop.big+pop.guide;
            var remove_hotel=[];
            ItemsStore.each(function(sv,si){
                var row=sv.data;
                if(row.ti_type_new!='住宿') return true;
                if(row.ti_days_hotel=='yes'){
                    if(hotel_data[row.ti_name_id] || (hotel_data[row.ti_insti_name] && hotel_data[row.ti_sct_type])){
                        var h_row=hotel_data[row.ti_name_id];
                        row.ti_num=h_row.ti_num;
                        hotel_data[row.ti_name_id]=row;
                    }
                    remove_hotel.push(sv);
                }else{
                    sv.set('ti_num',hotel_num);
                }
            });
            $.each(remove_hotel,function(ri,rv){
                ItemsStore.remove(rv);
            });
            $.each(hotel_data,function(hi,hv){
                if(!hv.ti_name_id)return true;
                hv.ti_days_num=hv.ti_num;
                hv.ti_num=hotel_num;
                hv.ti_days_hotel='yes';
                hv.ti_all_money=hv.ti_num*hv.ti_trade_price;
                ItemsStore.add(hv);
            });
        },
        TeamTpl:function(data,days_num){
            //餐饮信息
            var food_data=['早','中','晚'];
            var food_tpl='';
            $.each(food_data,function(i,v){
                var checked_zt='';
                if(data.food_data)if(in_array(v,data.food_data)!=-1) checked_zt='checked="true"'
                food_tpl+='<label class="food-cls"><input type="checkbox" name="food_id" value="'+v+'" '+checked_zt+'> '+v+'</label>';
            });
            //景点明细信息
            var sc_detail='',sc_detail_hide='hide-cls';
            if(typeof data.sc_detail=='object'){
                sc_detail_hide='';
                $.each(data.sc_detail,function(e,ev){
                    sc_detail+='<dd class="msg-list msg-'+ev.id+'" data-id="'+ev.id+'">' +
                        '<span class="days-title">'+ ev.name+'</span>' +
                        '<span class="days-info">' +
                        '<input type="text" name="scenic_msg_id" class="days-from scenic_items" value="'+ ev.detail+'"></span></dd>';
                })
            }
            return '<div class="team_days days-'+days_num+'" date-val="'+days_num+'">' +
                '<div class="days-id" title="'+days_num+'">'+(days_num+1)+'D</div>' +
                '<div class="days-mian">' +
                '<ul>' +
                '<li class="scenic_list days-list">' +
                '<span class="days-title">旅游景点：</span>' +
                '<span class="days-info">' +
                '<i class="days-scenic"></i>'+
                /*'<i class="scenic_id" id="source-'+data.team_date+'"><i class="txt">'+data.sc_name+'</i></i>' +*/
                '<input type="hidden" name="sc_id" class="days-from" value="'+data.sc_id+'">' +
                '<input type="text" name="sc_name" class="days-from scenic-box scenic-list" readonly="readonly" value="'+data.sc_name+'" data-val="'+data.sc_name+'">' +
                '<span class="add-scenic add-items-cls"><i class="fa fa-plus" aria-hidden="true"></i>编辑景区</span>' +
                '</span>' +
                '</li>' +
                '<li class="scenic_items_list days-list '+sc_detail_hide+'">' +
                '<span class="days-title">景点项目：</span>' +
                '<span class="days-info">' +
                '<input type="hidden" name="sc_items_id" class="days-from" value="'+data.sc_items_id+'">' +
                '<input type="text" readonly="readonly" name="scenic_items_id" value="'+data.scenic_items_id+'" class="days-from" style="width:760px;">' +
                '</span>' +
                '<span class="days-exit"><i class="fa fa-angle-down"></i> 编辑</span>' +
                '</li>' +
                '<li class="line_list days-list">' +
                '<span class="days-title">线路安排：</span>' +
                '<span class="days-info"><input type="text" name="line_id" class="days-from" value="'+data.line_id+'"></span>' +
                '</li>' +
                '<li class="food_list days-list">' +
                '<span class="days-title">用餐情况：</span>' +
                '<span class="days-info" style="height:30px;line-height: 30px">' +food_tpl +
                '<input name="food_text" type="text" class="days-from" style="width: 734px;margin-left: 5px" value="'+data.food_text+'">' +
                '</span>' +
                '</li>' +
                '<li class="hotel_list days-list">' +
                '<span class="days-title">住宿情况：</span>' +
                '<span class="days-info">' +
                /*'<i class="hotel_id" id="hotel-'+data.team_date+'"><i class="txt">'+data.hotel_name+'</i></i>' +*/
                '<input type="hidden" name="hotel_id" class="days-from" value="'+data.hotel_id+'">' +
                '<input type="text" name="hotel_name" class="days-from hotel-box" value="'+data.hotel_name+'">' +
                '<span class="add-hotel add-items-cls"><i class="fa fa-plus" aria-hidden="true"></i>编辑酒店</span>'+
                '</span>' +
                '</li>' +
                '<li class="scenic_msg days-list '+sc_detail_hide+'"><div class="msg-box"><dl>'+sc_detail+'</dl></div></li>' +
                '<li class="detail_list days-list">' +
                '<span class="days-title">行程说明：</span>' +
                '<span class="days-info">' +
                '<textarea type="text" id="detail-'+days_num+'" name="detail_id" class="days-from" style="height:60px;">'+data.detail+'</textarea>' +
                '</span>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
        },
        DaysTpl:function(data){
            /*var hotel_level=Ext.getCmp('tm_hotel_level').getValue();
             var hotel_level_id=$('input[name=tm_hotel_level_id]').val();*/
            return '<div class="team_days days-'+data+'" date-val="'+data+'">' +
                '<div class="days-id" title="'+data+'">'+(data+1)+'D</div>' +
                '<div class="days-mian">' +
                '<ul>' +
                '<li class="scenic_list days-list">' +
                '<span class="days-title">旅游景点：</span>' +
                '<span class="days-info">' +
                '<i class="days-scenic"></i>'+
                /*'<i class="scenic_id" id="source-'+data.team_date+'"></i>' +*/
                '<input type="hidden" name="sc_id" class="days-from">' +
                '<input type="text" name="sc_name" class="days-from scenic-box scenic-list" readonly="readonly" value="">' +
                '<span class="add-scenic add-items-cls"><i class="fa fa-plus" aria-hidden="true"></i>编辑景区</span>' +
                '</span>' +
                '</li>' +
                '<li class="scenic_items_list days-list hide-cls">' +
                '<span class="days-title">景点项目：</span>' +
                '<span class="days-info">' +
                '<input type="hidden" name="sc_items_id" class="days-from">' +
                '<input type="text" readonly="readonly" name="scenic_items_id" class="days-from" style="width:760px;">' +
                '</span>' +
                '<span class="days-exit">编辑 <i class="fa fa-angle-down"></i></span>' +
                '</li>' +
                '<li class="line_list days-list">' +
                '<span class="days-title">线路安排：</span>' +
                '<span class="days-info"><input type="text" name="line_id" class="days-from"></span>' +
                '</li>' +
                '<li class="food_list days-list">' +
                '<span class="days-title">用餐情况：</span>' +
                '<span class="days-info" style="height:30px;line-height: 30px">' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="早"> 早</label>' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="中"> 中</label>' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="晚"> 晚</label>' +
                '<input name="food_text" type="text" class="days-from" style="width: 734px;margin-left: 5px">' +
                '</span>' +
                '</li>' +
                '<li class="hotel_list days-list">' +
                '<span class="days-title">住宿情况：</span>' +
                '<span class="days-info">' +
                /*'<i class="hotel_id" id="hotel-'+data.team_date+'"><i class="txt"></i></i>' +*/
                '<input type="hidden" name="hotel_id" class="days-from">' +
                '<input type="text" name="hotel_name" class="days-from hotel-box">' +
                '<span class="add-hotel add-items-cls"><i class="fa fa-plus" aria-hidden="true"></i>编辑酒店</span>'+
                '</span>' +
                '</li>' +
                '<li class="scenic_msg days-list hide-cls"><div class="msg-box"><dl></dl></div></li>' +
                '<li class="detail_list days-list">' +
                '<span class="days-title">行程说明：</span>' +
                '<span class="days-info">' +
                '<textarea type="text" name="detail_id" class="days-from" style="height:60px;"></textarea>' +
                '</span>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
        },
        EmptyItemsStore:function(data){
            if(!data.type_new || !data.insti_name) return false;
            var pop=this.PopData();
            data.num=data.num?data.num:pop.big;
            if(data.type_new=='大交通' && data.sct_type=='成人票')data.num+=pop.guide;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_type_name_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_days_num:data.ti_days_num?data.ti_days_num:1,//结算单价
                ti_sense_price:data.ti_sense_price?data.ti_sense_price:0,//结算单价
                ti_profit:data.ti_profit?data.ti_profit:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票'//票种类型
            };
            if(!data.ti_sense_price)items_data.ti_sense_price=items_data.ti_trade_price;
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_remove=[];
            ItemsStore.each(function(v,i){
                var row= v.data;
                if(row.ti_type_new==data.type_new && row.ti_cs_type_name==data.cs_type_name && data.type_new=='大交通'){
                    items_remove=v;
                }else if(data.type_new=='餐饮'){
                    if(row.ti_insti_name==data.insti_name && row.ti_day==data.day){
                        row.ti_cs_type_name=items_data.ti_cs_type_name;
                        row.ti_num=items_data.ti_num;
                        row.ti_all_money=items_data.ti_num* row.ti_trade_price;
                        items_data=row;
                        items_remove=v;
                    }else{
                        //删除多于的用餐
                        //items_remove=v;
                        //if(row.ti_type_new=='餐饮')items_data='';
                    }
                }
            });

            if(!items_data)return false;
            ItemsStore.remove(items_remove);
            if(data.insti_name!='交通自理'){
                ItemsStore.add(items_data);
            }
            return items_data;
        },
        TeamStore:function(data){
            var sct_id=[],store_id=[];
            //票价人数
            var pop=this.PopData();

            //此操作为不添加已经存在的项目
            ItemsStore.each(function(tv,ti){
                var r_w=tv.data;
                if(r_w.sct_id)store_id.push(r_w.sct_id);
            });

            $.each(data,function(i,v){
                $.each(v,function(ii,iv){
                    if(iv){
                        if(parseFloat(iv.sct_price_settle)==0)return true;
                        sct_id.push(iv.sct_id);
                        if(in_array(iv.sct_id,store_id)==-1){
                            iv.si_type='按人计量';
                            if(iv.sct_type=='成人票'){
                                iv.sc_pop=pop.big;
                            }else if(iv.sct_type=='婴儿票'){
                                iv.sc_pop=pop.tiny;
                            }else if(iv.sct_type=='全陪票'){
                                iv.sc_pop=pop.guide;
                            }else{
                                iv.sc_pop=pop.small;
                            }
                            iv.sc_class='景区';
                            iv.sc_money=iv.sc_pop*iv.sct_price_settle;
                            iv.ti_cs_type_name_id=iv.sct_id;
                            iv.ti_cs_type_name=iv.sct_name;
                            iv.ti_day='-1';
                            iv.ti_id=iv.sc_id;
                            iv.ti_insti_name=iv.sc_name;
                            iv.ti_insti_type=iv.sct_payment;
                            iv.ti_trade_price=iv.sct_price_settle;
                            iv.ti_sense_price=iv.sct_price_settle;
                            iv.ti_days_num=0;
                            iv.ti_profit=0;
                            iv.ti_type_mode=iv.si_type;
                            iv.ti_type_new=iv.sc_class;
                            iv.ti_num=iv.sc_pop;
                            iv.ti_all_money=iv.sc_money;
                            iv.ti_sct_type=iv.sct_type;
                            iv.ti_sort=sort_fn(iv.sc_class);
                            iv.ti_remark=iv.sct_explain;
                            ItemsStore.add(iv);
                        }
                    }
                });
            });

            //此操作为删除已经不存在的项目
            var remove_id=[];
            ItemsStore.each(function(tv,ti){
                var row=tv.data;
                if(row.sct_id && in_array(row.sct_id,sct_id)==-1){
                    remove_id.push(tv);
                }
            })
            for(var i=0;i<=remove_id.length;i++){
                ItemsStore.remove(remove_id[i]);
            }
        },
        //计算显示票种明细
        CountMoneyItems:function(){
            var is_this=this;
            var pop=this.PopData();
            var Common_id=Ext.getCmp('Common_id').getValue();
            //计算每种类型金
            var items={'big':0,'small':0,'tiny':0,'guide':0},profit_price=0;
            ItemsStore.each(function(v,i){
                var row= v.data;
                var ti_trade_price=parseFloat(row.ti_trade_price);
                if(!ti_trade_price)ti_trade_price=0;
                var sct_type=row.ti_sct_type;
                if(sct_type=='老人票')sct_type='成人票';
                switch (sct_type){
                    //1.成人票金额=所有成人票单价*成人数量
                    case '成人票':
                        if(in_array(row.ti_type_new,['导游','车辆'])!=-1){
                            items.big+=(row.ti_num-pop.small)*ti_trade_price;
                            items.small+=pop.small*ti_trade_price;//儿童金额
                        }else if(row.ti_type_new=='餐饮'){
                            items.big+=(row.ti_num-pop.small/2)*ti_trade_price;
                            items.small+=(pop.small/2)*ti_trade_price;//儿童金额
                        }else if(in_array(row.ti_type_new,['大交通','住宿'])!=-1 || (row.ti_type_new=='景区' && Common_id!=true)){
                            items.big+=(row.ti_num-pop.guide)*ti_trade_price;
                            items.guide+=pop.guide*ti_trade_price;//全陪金额
                        }else{
                            items.big+=row.ti_num*ti_trade_price;
                        }
                        break;
                    case '儿童票':
                        //2.儿童票金额=所有儿童票单价*儿童数量+(成人票:用餐单价*儿童数量/2+导游单价*儿童数量+车辆单价*儿童数量)
                        items.small+=row.ti_num*ti_trade_price;
                        break;
                    case '婴儿票':
                        //3.婴儿票金额=所有婴儿票单价*婴儿数量
                        items.tiny+=row.ti_num*ti_trade_price;
                        break;
                    case '全陪票':
                        //4.全陪票金额=所有全陪票单价*全部票单价
                        items.guide+=row.ti_num*ti_trade_price;
                        break;
                }
                /**
                 * 计算毛利金额
                 * 1.导游、车辆是按团计算;住宿是按间计算;其他按人计算
                 */
                var ti_profit=parseFloat(row.ti_profit);
                if(!ti_profit)ti_profit=0;
                if(in_array(row.ti_type_new,['导游','车辆'])!=-1){
                    profit_price+=ti_profit;
                }else if(in_array(row.ti_type_new,['住宿'])!=-1){
                    profit_price+=ti_profit*row.ti_days_num*row.ti_num/2
                }else{
                    profit_price+=ti_profit*row.ti_num;
                }
            });
            if(!profit_price)profit_price=0;
            $('.profit_price').html('毛利总额:￥'+profit_price.toFixed(2)+'元');
            $('input[name=tm_profit_price]').val(profit_price);
            $.each(items,function(rows,pv){
                var price_id=$('input[name='+rows+'_price]');
                var count_id=$('#team-price .'+rows+'-count');
                var pop_id=$('#team-price .'+rows+'-pop');
                var div_money=parseFloat(price_id.val());
                if(!div_money)div_money=0;
                var my_id=(pv/pop[rows]);
                if(!my_id || my_id=='Infinity')my_id=0;
                price_id.val(my_id);
                pop_id.html(pop[rows]);
                count_id.html(pv.toFixed(2));
            });
            is_this.CountMoney();
        },
        TeamItems:function(){
            var is_this=this;
            var items_list=[
                {text:'车辆',iconCls:'button-add',id:'car_id'},
                {text:'导游',iconCls:'button-add',id:'guides_id'},
                {text:'景区',iconCls:'button-add',id:'scenic_id'},
                {text:'住宿',iconCls:'button-add',id:'hotal_id'},
                {text:'餐饮',iconCls:'button-add',id:'caterers_id'},
                {text:'购物店',iconCls:'button-add',id:'shop_id'},
                {text:'大交通',iconCls:'button-add',id:'big_bus_id'},
                {text:'接送',iconCls:'button-add',id:'goto_id'},
                /*{text:'毛利',iconCls:'button-add',id:'profit_id'},*/
                {text:'其他',iconCls:'button-add',id:'out_id'}
            ];
            items_grid=SUNLINE.ItemsList({
                store:ItemsStore,
                items_list:items_list,
                reckon_type:'ti_all_money',
                pop_num:1,
                team_line:true,
                type:'team'
            },function(m,s){
                is_this.CountMoneyItems()
            },sct_type_select);
            var start_date=$('input[name=team_start_date]');
            var end_date=$('input[name=team_end_date]');
            start_date=(start_date.val()).replace(/-/g,'');
            end_date=(end_date.val()).replace(/-/g,'');
            items_grid.ticket_date={start_date:start_date,end_date:end_date};
            items_grid.pop=this.PopData();
            items_grid.render('team-items');
            //选择票种类型
            function sct_type_select(c,r,e){
                var row=SUNLINE.getSelected(items_grid);
                var rw=r[0].data;
                pop_money(row,rw);
            }

            //操作人数或总金额
            function pop_money(row,rw){
                var pop=is_this.PopData();
                if(rw.sct_type=='成人票'){
                    pop=pop.big;
                }else if(rw.sct_type=='婴儿票'){
                    pop=pop.tiny;
                }else if(rw.sct_type=='全陪票'){
                    pop=pop.guide;
                }else{
                    pop=pop.small;
                }
                var money=pop*parseFloat(row.get('ti_trade_price'));
                row.set('ti_all_money',money);
                row.set('ti_num',pop);
                return {pop:pop,money:money};
            }

            //动态加载车辆信息;需求：根据人数、团队级等筛选、日期时间
            items_grid.car_store=function(g){
                var where={};
                //团队级等筛选
                var tm_type=Ext.getCmp('tm_type').getValue();
                if(tm_type)where.cap_level=tm_type;
                var pop=is_this.PopData();
                where.cap_num=parseFloat(pop.big)+parseFloat(pop.small);
                return where;
            }

        },
        PopData:function(){
            var pop_big=parseFloat($('input[name=pop_big]').val());
            var pop_small=parseFloat($('input[name=pop_small]').val());
            var pop_tiny=parseFloat($('input[name=pop_tiny]').val());
            var pop_guide=parseFloat($('input[name=pop_guide]').val());
            if(!pop_big)pop_big=0;
            if(!pop_small)pop_small=0;
            if(!pop_tiny)pop_tiny=0;
            if(!pop_guide)pop_guide=0;
            return {count:(pop_big+pop_small+pop_tiny+pop_guide),big:pop_big,small:pop_small,tiny:pop_tiny,guide:pop_guide};
        },
        PopBlur:function(){
            var is_this=this;
            var pop_blur=$('.pop-blur');
            pop_blur.unbind();
            pop_blur.blur(function(){
                is_this.PopStore(pop_blur,this);
                is_this.SeatData();
                is_this.HotelStoreData();
                var pop=is_this.PopData();
                items_grid.pop_num=pop.big;
                items_grid.pop=pop;
                is_this.ItemsFood();
                is_this.CountMoneyItems();
            });
            var price_cls=$('.price-cls');
            price_cls.unbind();
            price_cls.blur(function(){
                var price=parseFloat($(this).val());
                if(!price)price=0;
                var price_id=$(this).parents('.price');
                var pop=parseFloat(price_id.find('.count-pop').html());
                price_id.find('.count-price').html((price*pop).toFixed(2));
                is_this.CountMoney();
            });

            //操作大交通信息时
            var tm_traffic=$('input[name=tm_traffic]');
            tm_traffic.unbind();
            tm_traffic.click(function(){
                /*var ext_box=$('.ext-box');
                 if($(this).val()!='交通自理')return false;
                 for(var i=0;i<ext_box.length;i++){
                 var row=ext_box.eq(i);
                 Ext.getCmp(row.attr('id')).setValue('')
                 }*/
                is_this.SeatData();
            });
        },
        PopStore:function(id,t){
            var pop={},pop_data=this.PopData();
            for(var i=0;i<id.length;i++){
                var rst=id.eq(i);
                pop[rst.attr('data-type')]={
                    sct_type:rst.attr('data-type'),
                    sct_old_pop:rst.attr('data-val'),
                    sc_pop:rst.val()
                }
            };

            var add_items=[],remove_items=[];
            ItemsStore.each(function(v,i){
                var row= v.data;
                if(row.ti_type_mode!='按团计量'){
                    var pop_num=str2float(pop[row.ti_sct_type]['sc_pop']);
                    if(row.ti_type_new=='大交通'){
                        //是成人票大交通=成人+导游
                        if(row.ti_sct_type=='成人票')pop_num+=pop_data.guide;
                        //如果儿童人数小于等于0的大交通删除
                        if(row.ti_sct_type=='儿童票' && pop_data.small<=0) remove_items.push(v);
                        //如果儿童票大0且，原先没有儿童大交通需要添加
                        if(row.ti_sct_type=='儿童票' && pop_data.small>0)add_items.push(v);
                    }
                    //全部无证的话需要景区门票费用
                    if(row.ti_type_new=='景区' && Ext.getCmp("Common_id").getValue()!=true && pop_data.guide>0){
                        pop_num=pop_num+pop_data.guide;
                    }
                    if(in_array(row.ti_type_new,['导游','车辆'])!=-1){
                        pop_num=pop_num+pop_data.small;
                        //单价=总价/人数
                        var all_money= str2float(row.ti_all_money);
                        var trade_price=all_money/pop_num;
                        v.set('ti_trade_price',round_format(trade_price));
                        //成本单价=（总价-毛利）/人数
                        var profit_price=str2float(row.ti_profit);
                        var sense_price=(all_money-profit_price)/pop_num;
                        v.set('ti_sense_price',round_format(sense_price));
                    }else{
                        v.set('ti_all_money',pop_num*row.ti_trade_price);
                    }
                    v.set('ti_num',pop_num);

                }
            });
            //如果儿童人数小于等于0的大交通删除
            if(remove_items.length>0){
                for(var ri=0;ri<remove_items.length;ri++){
                    ItemsStore.remove(remove_items[ri]);
                }
            }
            //如果儿童票大0且，原先没有儿童大交通需要添加，且不是交通自理
            if(pop_data.small>0 && add_items.length<=0){
                var go_traffic=Ext.getCmp('go_traffic').getValue();
                var back_traffic=Ext.getCmp('back_traffic').getValue();
                var small_itmes={};
                if(go_traffic && go_traffic!='交通自理'){
                    small_itmes={
                        insti_name:go_traffic+'儿童',
                        cs_type_name:'去程儿童',
                        type_new:'大交通',
                        sct_type:'儿童票',
                        num:pop_data.small
                    };
                    this.EmptyItemsStore(small_itmes);
                }
                if(back_traffic && back_traffic!='交通自理'){
                    small_itmes={
                        insti_name:back_traffic+'儿童',
                        cs_type_name:'返程儿童',
                        type_new:'大交通',
                        sct_type:'儿童票',
                        num:pop_data.small
                    };
                    this.EmptyItemsStore(small_itmes);
                }

            }
        },
        CountMoney:function(){
            var to_text=$('.to-text');
            var team_total_money=$('input[name=team_total_money]');
            var pop=this.PopData();
            var big_price=parseFloat($('input[name=big_price]').val());
            var small_price=parseFloat($('input[name=small_price]').val());
            var tiny_price=parseFloat($('input[name=tiny_price]').val());
            var guide_price=parseFloat($('input[name=guide_price]').val());

            var big_money=parseFloat($('.big-count').html());
            var small_money=parseFloat($('.small-count').html());
            var tiny_money=parseFloat($('.tiny-count').html());
            var guide_money=parseFloat($('.guide-count').html());
            var money_txt='';
            //成人票
            if(big_price.toFixed(2) || pop.big){
                money_txt+=big_price.toFixed(2)+' 元/成人 × '+pop.big+'人';
            }
            //儿童票
            if(small_price.toFixed(2) || pop.small){
                if(money_txt)money_txt+=' + ';
                money_txt+=small_price.toFixed(2)+'元/儿童 × '+pop.small+'人';
            }
            //婴儿票
            if(tiny_price.toFixed(2) || pop.tiny){
                if(money_txt)money_txt+=' + ';
                money_txt+=tiny_price.toFixed(2)+'元/婴儿 × '+pop.tiny+'人';
            }
            //全陪票
            if(guide_price.toFixed(2) || pop.guide){
                if(money_txt)money_txt+=' + ';
                money_txt+=guide_price.toFixed(2)+'元/全陪 × '+pop.guide+'人';
            }

            to_text.html(money_txt);

            team_total_money.val((big_money+small_money+tiny_money+guide_money).toFixed(2));
        },
        //关闭团队窗口
        TeamClose:function(){
            var clos_id=$('.submit-close');
            clos_id.unbind();
            clos_id.click(function(){
                if($(this).hasClass('disabled'))return false;
                Ext.MessageBox.confirm('友情提示','你确定要关闭吗?',function(y){
                    if(y=='yes'){
                        parent.CloseTab(true);
                    }
                })
            });
        },
        //保存团队
        DataSave:function(){
            var is_this=this;
            //保存团队
            var keep=$('.submit-keep');
            keep.unbind();
            keep.click(function(){
                if($(this).hasClass('disabled'))return false;
                var post=is_this.FromData();
                post['tm_status']='保存';
                if($('.submit-release').find('.text').html()=='撤销')post['tm_status']='发布';
                AjaxData(post,$(this));
            });

            //发布团队
            var release=$('.submit-release');
            release.unbind();
            release.click(function(){
                if($(this).hasClass('disabled'))return false;
                var this_ck=$(this);
                var post=is_this.FromData();
                post['tm_status']=$(this).find('.text').html();
                Ext.MessageBox.confirm('友情提示','你确定需要'+post['tm_status']+'当前团队吗?',function(y){
                    if(y!='yes')return false;
                    AjaxData(post,this_ck);
                });
            });


            //操作创建模版信息

            var tm_type_box=SUNLINE.DictComBox_false({name:'tm_tpl_type',allowBlank:false,fieldLabel:"品牌系列",labelWidth:80,width:300, labelAlign:'right',forceSelection:false},{'d_type':'品牌系列'});
            var tpl_form = Ext.create('Ext.form.Panel',{
                bodyPadding: 5,
                autoScroll:true,
                width: "100%",
                defaults:{
                    labelWidth:80,
                    width:300,
                    labelAlign:'right',
                    xtype:'textfield'
                },
                items:[
                    {id:"tm_number", name:"tm_number", fieldLabel:"团队编号",hidden:true},
                    {id:"tm_id", name:"tm_id", fieldLabel:"团队ID",hidden:true},
                    {id:"tm_tpl_name", name:"tm_tpl_name", fieldLabel:"模板名称"},
                    tm_type_box.box
                ]
            });

            var tpl_wind= new Ext.Window({
                title : '创建团队报价模板',
                width : 350,
                modal : true,
                closeAction : 'hide',
                fixed:true,
                autoScroll : true,
                items:tpl_form,
                buttons:[
                    {text:'确认创建',handler:tpl_handler},
                    {text:'关闭', handler:function(){tpl_wind.hide();}}
                ]
            });
            //创建模板
            var submit_tpl=$('.submit-tpl');
            submit_tpl.unbind();
            submit_tpl.click(function(){
                tpl_wind.show();
            });

            function tpl_handler(){
                var _form=tpl_form.getForm();
                if(!_form.isValid()){
                    Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
                    return;
                }
                if($(this).hasClass('disabled'))return false;
                var this_ck=$(this);
                var post=is_this.FromData();
                var f_post=_form.getValues();
                post['tm_status']=$(this).find('.text').html();
                post['tm_tpl_name']=f_post.tm_tpl_name;
                post['tm_tpl_type']=f_post.tm_tpl_type;
                Ext.MessageBox.confirm('友情提示','你确定要当前团队为模板吗?',function(y){
                    if(y!='yes')return false;
                    AjaxData(post,this_ck);
                });
            }

            function AjaxData(post,it){
                $('.ytr-tool').addClass('disabled');
                $.ajax({
                    type:"POST",
                    url:$__app__ + "/Team/team_save",
                    data:post,
                    success:function (msg) {
                        var data = msg;
                        if (typeof msg != 'object')
                            data = eval("(" + msg + ")");
                        var info = data.info;
                        if (data.status == 1) {
                            Ext.Msg.alert('友情提示',info,function(y){
                                var o_number=$('input[name=o_number]').val();
                                if(!o_number){
                                    window.parent.to_pernet_wind('ifm_tab_194',function(id){
                                        id.ifm_tab();
                                    });
                                }
                                parent.CloseTab(true);
                                window.store.reload();
                            });
                        }else{
                            Ext.Msg.alert('友情提示',info);
                            $('.ytr-tool').removeClass('disabled');
                        }
                    }
                });
            }
            var is_this=this;
            //保存团队
            var keep=$('.submit-keep');
            keep.unbind();
            keep.click(function(){
                if($(this).hasClass('disabled'))return false;
                var post=is_this.FromData();
                post['tm_status']='保存';
                if($('.submit-release').find('.text').html()=='撤销')post['tm_status']='发布';
                AjaxData(post,$(this));
            });

            //发布团队
            var release=$('.submit-release');
            release.unbind();
            release.click(function(){
                if($(this).hasClass('disabled'))return false;
                var this_ck=$(this);
                var post=is_this.FromData();
                post['tm_status']=$(this).find('.text').html();
                Ext.MessageBox.confirm('友情提示','你确定需要'+post['tm_status']+'当前团队吗?',function(y){
                    if(y!='yes')return false;
                    AjaxData(post,this_ck);
                });
            });


            //操作创建模版信息

            var tm_type_box=SUNLINE.DictComBox_false({name:'tm_tpl_type',allowBlank:false,fieldLabel:"品牌系列",labelWidth:80,width:300, labelAlign:'right',forceSelection:false},{'d_type':'品牌系列'});
            var tpl_form = Ext.create('Ext.form.Panel',{
                bodyPadding: 5,
                autoScroll:true,
                width: "100%",
                defaults:{
                    labelWidth:80,
                    width:300,
                    labelAlign:'right',
                    xtype:'textfield'
                },
                items:[
                    {id:"tm_number", name:"tm_number", fieldLabel:"团队编号",hidden:true},
                    {id:"tm_id", name:"tm_id", fieldLabel:"团队ID",hidden:true},
                    {id:"tm_tpl_name", name:"tm_tpl_name", fieldLabel:"模板名称"},
                    tm_type_box.box
                ]
            });

            var tpl_wind= new Ext.Window({
                title : '创建团队报价模板',
                width : 350,
                modal : true,
                closeAction : 'hide',
                fixed:true,
                autoScroll : true,
                items:tpl_form,
                buttons:[
                    {text:'确认创建',handler:tpl_handler},
                    {text:'关闭', handler:function(){tpl_wind.hide();}}
                ]
            });
            //创建模板
            var submit_tpl=$('.submit-tpl');
            submit_tpl.unbind();
            submit_tpl.click(function(){
                tpl_wind.show();
            });

            function tpl_handler(){
                var _form=tpl_form.getForm();
                if(!_form.isValid()){
                    Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
                    return;
                }
                if($(this).hasClass('disabled'))return false;
                var this_ck=$(this);
                var post=is_this.FromData();
                var f_post=_form.getValues();
                post['tm_status']=$(this).find('.text').html();
                post['tm_tpl_name']=f_post.tm_tpl_name;
                post['tm_tpl_type']=f_post.tm_tpl_type;
                Ext.MessageBox.confirm('友情提示','你确定要当前团队为模板吗?',function(y){
                    if(y!='yes')return false;
                    AjaxData(post,this_ck);
                });
            }



            function AjaxData(post,it){
                $('.ytr-tool').addClass('disabled');
                /*var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
                myMask.show();*/
                $.ajax({
                    type:"POST",
                    url:$__app__ + "/Team/team_save",
                    data:post,
                    success:function (msg) {
                        var data = msg;
                        if (typeof msg != 'object')
                            data = eval("(" + msg + ")");
                        //myMask.hide();
                        var info = data.info;
                        if (data.status == 1) {
                            Ext.Msg.alert('友情提示',info,function(y){
                                var o_number=$('input[name=o_number]').val();
                                if(!o_number){
                                    window.parent.to_pernet_wind('ifm_tab_194',function(id){
                                        id.ifm_tab();
                                    });
                                }
                                parent.CloseTab(true);
                                window.store.reload();
                            });
                        }else{
                            Ext.Msg.alert('友情提示',info);
                            $('.ytr-tool').removeClass('disabled');
                        }
                    }
                });
            }
        },
        //表单数据组织
        FromData:function(t){
            var Data={};
            //普通表单
            var team_from=$('.team-from');
            for(var i=0;i<team_from.length;i++){
                var row=team_from.eq(i);
                Data[row.attr('name')]=row.val();
            }
            //ext表单
            var ext_from=$('.ext-from');
            for(var i=0;i<ext_from.length;i++){
                var row=ext_from.eq(i);
                var val=Ext.getCmp(row.attr('id')).getValue();
                if(row.hasClass('ext-date'))val=Ext.Date.format(val,'Ymd');
                Data[row.attr('id')]=val;
            }

            //所有消费项目
            var items=[];
            ItemsStore.each(function(v,i){
                var row=v.data;
                items.push(row);
                if(ScenicAll.scenic_items){
                    if(!ScenicAll.scenic_items[row.sct_id])ScenicAll.scenic_items[row.sct_id]=row;
                }
            });
            if(items.length>0)Data['tm_items_detail']=Ext.encode(items);

            //详细行程读取
            var team_days=$('.team_days');
            var team_data=[],days_num=0;
            for(var i=0;i<team_days.length;i++){
                var row=team_days.eq(i);
                days_num=days_num+1;
                if(row.hasClass('disabled')){
                    days_num=days_num-1;
                    continue;
                }
                var detail=this.FromDetailFind(row,days_num);
                team_data.push(detail);
            }
            Data['team_detail']=Ext.encode(team_data);
            var tm_show=$('input[name=tm_show]');
            Data['tm_show']=0;
            if(tm_show.attr('checked')=='checked')Data['tm_show']=tm_show.val();
            //交通情况
            Data['tm_traffic']=this.TrafficVal();
            //座位数据
            Data['tm_seat']=Ext.encode(SeatStore);
            Data['tm_spare_scenic']=Ext.encode(ScenicAll);
            Data['tm_supply_detail']=supply_Editor.getContent();
            Data['team_special']=special_Editor.getContent();
            Data['team_give']=give_Editor.getContent();
            Data['team_money_in']=money_in_Editor.getContent();
            Data['team_money_notin']=money_notin_Editor.getContent();

            //获取追加的报价
            var pop_detail=$('.team_table').find('.offer-list');
            var pop_detail_data=[];
            for(var pi=0;pi<pop_detail.length;pi++){
                var pop_id=pop_detail.eq(pi);
                pop_detail_data.push({
                    tm_big_pop:pop_id.find('input[name=tm_big_pop]').val(),
                    tm_small_pop:pop_id.find('input[name=tm_small_pop]').val(),
                    tm_guide:pop_id.find('input[name=tm_guide]').val(),
                    tm_car:pop_id.find('input[name=tm_car]').val(),
                    tm_big_price:pop_id.find('input[name=tm_big_price]').val(),
                    tm_small_price:pop_id.find('input[name=tm_small_price]').val(),
                    tm_remark:pop_id.find('input[name=tm_remark]').val()
                });
            }
            Data['tm_pop_detail']=Ext.encode(pop_detail_data);
            return Data;
        },
        FromDetailFind:function(row,days_num){
            var days_date=row.attr('date-val');
            //基本信息
            var detail={
                team_days:days_num,
                team_date:days_date,
                sc_name:row.find('input[name=sc_name]').val(),
                sc_id:row.find('input[name=sc_id]').val(),
                scenic_items_id:row.find('input[name=scenic_items_id]').val(),
                sc_items_id:row.find('input[name=sc_items_id]').val(),
                line_id:row.find('input[name=line_id]').val(),
                food_text:row.find('input[name=food_text]').val(),
                hotel_id:row.find('input[name=hotel_id]').val(),
                hotel_name:row.find('input[name=hotel_name]').val(),
                detail:row.find('textarea[name=detail_id]').val()
            };
            //景区介绍明细
            var msg_list=row.find('.msg-list');
            var sc_detail=[];
            for(var j=0;j<msg_list.length;j++){
                var rd=msg_list.eq(j);
                /*sc_detail[rd.attr('data-id')+" "]={
                    id:rd.attr('data-id'),
                    name:rd.find('.days-title').html(),
                    detail:rd.find('.days-info').find('.scenic_items').val()
                }*/
                sc_detail.push({
                    id:rd.attr('data-id'),
                    name:rd.find('.days-title').html(),
                    detail:rd.find('.days-info').find('.scenic_items').val()
                });
            }
            //用餐情况
            var food_id=row.find('input[name=food_id]');
            var food_data=[];
            for(var z=0;z<food_id.length;z++){
                var rz=food_id.eq(z);
                if(rz.attr('checked')=='checked')food_data.push(rz.val());
            }

            detail['food_data']=food_data;
            detail['sc_detail']=sc_detail;
            return detail;
        },
        TrafficVal:function(){
            var tm_traffic=$('input[name=tm_traffic]');
            var traffic_val='';
            for(var i=0;i<tm_traffic.length;i++){
                var row=tm_traffic.eq(i);
                if(row[0].checked){
                    traffic_val=row.val();
                }
            }
            return traffic_val;
        },
        ClickStatus:function(){
            var check_id=$('input[type=checkbox]'),is_this=this;
            check_id.unbind();
            check_id.click(function(){
                if($(this).attr('checked')=='checked'){
                    $(this).attr('checked',false);
                }else{
                    $(this).attr('checked',true);
                }
                is_this.ItemsFood();
            });
        },
        SeatData:function(){
            var pop=this.PopData();
            var is_this=this;
            var big_data=[];
            var small_data=[];
            var tiny_data=[];
            var guide_data=[];
            $.each(SeatStore,function(i,v){
                if(v.t_name=='儿童票'){
                    small_data.push(v);
                }else if(v.t_name=='婴儿票'){
                    tiny_data.push(v);
                }else if(v.t_name=='全陪票'){
                    guide_data.push(v);
                }else{
                    big_data.push(v);
                }
            })
            //统计游客新数据
            var seat_data=[];
            var j=0;
            //成人票
            for(var i=0;i<pop.big;i++){
                var row={};
                if(typeof big_data[i]=='object'){
                    big_data[i]['t_index']=j;
                    row= big_data[i];
                }else{
                    row=is_this.VipEmpty(j,'成人票');
                }
                j++;
                seat_data.push(row);
            }

            //儿童票
            for(var i=0;i<pop.small;i++){
                var row={};
                if(typeof small_data[i]=='object'){
                    small_data[i]['t_index']=j;
                    row= small_data[i];
                }else{
                    row=is_this.VipEmpty(j,'儿童票');
                }
                j++;
                seat_data.push(row);
            }

            //婴儿票
            for(var i=0;i<pop.tiny;i++){
                var row={};
                if(typeof tiny_data[i]=='object'){
                    tiny_data[i]['t_index']=j;
                    row= tiny_data[i];
                }else{
                    row=is_this.VipEmpty(j,'婴儿票');
                }
                j++;
                seat_data.push(row);
            }

            //全陪票
            for(var i=0;i<pop.guide;i++){
                var row={};
                if(typeof guide_data[i]=='object'){
                    guide_data[i]['t_index']=j;
                    row= guide_data[i];
                }else{
                    row=is_this.VipEmpty(j,'全陪票');
                }
                j++;
                seat_data.push(row);
            }

            var tpl='';
            $.each(seat_data,function(si,sv){
		if(!sv.vip_mob)sv.vip_mob='';
		seat_data[si]=sv;
                tpl+=is_this.SeatTpl(sv);
            })
            if(!tpl)tpl='还没有填写游客信息...';
            $('.tour-content').html(tpl);
            SeatStore=seat_data;
            this.SeatChange();
            site_select_box()
        },
        VipEmpty:function(index,t_name){
            return {
                vip_card_type:'身份证',
                start_site:'',
                start_time:'',
                vip_mob:'',
                vip_card:'',
                t_index:index,
                t_name:t_name,
                vip_name:'',
                start_sid:0,
                start_map:''
            };
        },
        SeatTpl:function(data){
            var card_type=['身份证','护照','其他'];
            var option_tpl='';
            for(var i=0;i<card_type.length;i++){
                var type=card_type[i];
                var selected='';
                if(data.vip_card_type==type)selected='selected';
                option_tpl+='<option value="'+type+'" '+selected+'>'+type+'</option>';
            };
            var start_site='请选择上车地点';
            if(data.start_site)start_site=data.start_site;
            if(data.start_time)start_site='【'+data.start_time+'】 '+start_site;
            //验证信息
            var mob_msg='',card_msg='',mob_cls='',card_cls='',mob_alert='',card_alert='';
            if(!FORMCHECK.mobile(data.vip_mob)){
                if(!data.vip_mob && CheckBool==false){}else{
                    mob_cls='disabled';
                    mob_alert='* 手机号填写错误!';
                }
            };
            var form_card=FORMCHECK.chechIdcard(data.vip_card,{card_type:data.vip_card_type});
            if(form_card['start']== 0){
                if(!data.vip_card && CheckBool==false){}else{
                    card_cls='disabled';
                    card_msg=form_card['info'];
                    card_alert='* '+card_msg;
                }
            }
            var tf_val='上车站点:<span class="map_site">'+start_site+'</span> <span class="site-select">[编辑]</span>';
            var traffic=this.TrafficVal();
            if(traffic=='交通自理')tf_val='交通自理';
            var s_id='',s_team_id='';
            if(data.s_id)s_id=data.s_id;
            if(data.s_team_id)s_team_id=data.s_team_id;
            //操作接送与大交通部分(start)
            var site_fly_html='';
            var start_site_val='不含接送',start_end_val='不含接送',fly_start_val='不含大交通',fly_end_val='不含大交通';
            if(data.start_site)start_site_val=data.start_site;
            if(data.start_end)start_end_val=data.start_end;
            if(data.go_fly){
                var gf_cls='';
                var gf_txt='';
                var gf_sk='';
                if(data.go_fly.add_ticket==1){
                    gf_cls='not-fly';
                    gf_txt='不包含';
                }
                if(data.go_fly.tbd_id)gf_sk='<font color="#26b4d3">(库存)</font>';
                fly_start_val=data.go_fly.start_site+'至'+data.go_fly.end_site+' <i class="fly-number '+gf_cls+'">'+data.go_fly.fly_number+' ('+data.go_fly.fly_start_time+'—'+data.go_fly.fly_end_time+')'+gf_txt+' '+gf_sk+'</i>';
            }
            if(data.to_fly){
                var tf_cls='';
                var tf_txt='';
                var tf_sk='';
                if(data.to_fly.add_ticket==1){
                    tf_cls='not-fly';
                    tf_txt='不包含';
                }
                if(data.to_fly.tbd_id)tf_sk='<font color="#26b4d3">(库存)</font>';
                fly_end_val=data.to_fly.start_site+'至'+data.to_fly.end_site+' <i class="fly-number '+tf_cls+'">'+data.to_fly.fly_number+' ('+data.to_fly.fly_start_time+'—'+data.to_fly.fly_end_time+')'+tf_txt+' '+tf_sk+'</i>';
            }
            var vip_card='';
            if(!vip_card)vip_card=data.vip_card
            //操作去程数据
            site_fly_html+='<div class="site-go site-list"><b class="site-title">去程:</b>' +
                '<span class="site-id"><i class="fa fa-taxi" aria-hidden="true"></i> '+start_site_val+'</span>' +
                '<span class="fly-id"><i class="fa fa-plane" aria-hidden="true"></i> '+fly_start_val+'</span></div>';
            //操作返程数据
            site_fly_html+='<div class="site-back site-list"><b class="site-title">返程:</b>' +
                '<span class="site-id"><i class="fa fa-taxi" aria-hidden="true"></i>  '+start_end_val+'</span>' +
                '<span class="fly-id"><i class="fa fa-plane" aria-hidden="true"></i> '+fly_end_val+'</span></div>';
            //操作接送与大交通部分(end)
            if(site_fly_html)site_fly_html='<div class="site-fly">'+site_fly_html+'</div>';
            var tpl='<li class="tour-list vip-cls" t_id="'+data.t_name+'" t_index="'+data.t_index+'">' +
                '<div class="tl-left tl-list">' +
                '<label class="vip-cls"><span class="tl-ticket"><input type="checkbox" class="check-id"><b>'+(parseFloat(data.t_index)+1)+' ).</b> '+data.t_name+'</span></label>' +
                '</div>' +
                '<div class="tl-right tl-list">' +
                '<dl><dd class="tlr-list"><div class="vip-detail">' +
                    //游客姓名
                    '<span class="tlr-from vip-name-id">' +
                    '<div class="txt-from vip-list">' +
                    '<label class="tlr-txt">姓名</label>' +
                    '<input type="text" name="vip_name" value="'+data.vip_name+'" class="ipt-name vip-from">' +
                    '</div>' +
                    '<div class="msg-from"></div>' +
                    '</span>' +
                    //游客证件号与证件类型
                    '<span class="tlr-from vip-card-id">' +
                    '<div class="txt-from vip-list">' +
                    '<label class="tlr-txt">证件</label>' +
                    '<select name="vip_card_type" class="vip-from">' +option_tpl+'</select> ' +
                    '<input type="text" name="vip_card" value="'+vip_card+'" class="ipt-card vip-from '+card_cls+'">' +
                    '</div>' +
                    '<div class="msg-from">'+card_alert+'</div>' +
                    '</span>' +
                    //游客手机号
                    '<span class="tlr-from vip-mob-id">' +
                    '<div class="txt-from vip-list">' +
                    '<label class="tlr-txt">手机</label>' +
                    '<input type="text" name="vip_mob" value="'+data.vip_mob+'" class="ipt-phone vip-from '+mob_cls+'">'+
                    '</div>' +
                    '<div class="msg-from">'+mob_alert+'</div>' +
                    '</span></div><div class="site-fly">' + site_fly_html +
                '</dd>' +
                '<dd class="tlr-list map-id" style="display: none">' +
                '<i class="fa fa-map-marker"></i> ' +
                '<input type="hidden" value="'+s_id+'" name="s_id" class="vip-from">' +
                '<input type="hidden" value="'+s_team_id+'" name="s_team_id" class="vip-from">' +
                '<input type="hidden" value="'+data.start_site+'" name="start_site" class="vip-from">' +
                '<input type="hidden" value="'+data.start_time+'" name="start_time" class="vip-from">' +
                '<input type="hidden" value="'+data.start_sid+'" name="start_sid" class="vip-from">' +
                '<input type="hidden" value="'+data.start_map+'" name="start_map" class="vip-from">'+tf_val+'</dd></dl></div></li>';
            return tpl;
        },
        SeatChange:function(){
            var vip_from=$('.vip-from');
            var is_this=this;
            vip_from.change(function(){
                var id=$(this).parents('.tour-list');
                SeatStore[id.attr('t_index')][$(this).attr('name')]=$(this).val();
                is_this.SeatData();
            });
        },
        //对酒店数据操作
        HotelToAll:function(){
            var tm_hotel_level=Ext.getCmp('tm_hotel_level').getValue();
            var tm_hotel_level_id=$('input[name=tm_hotel_level_id]').val();
            var team_days=$('.team_days');
            var len=team_days.length;
            /**
             * 1.住宿标准选择时操作
             *  a.赋值到所有未选择的天数上
             *  b.除去隐藏酒店和最后一天酒店
             */
            for(var i=0;i<len;i++){
                var di=team_days.eq(i);
                //b.除去隐藏酒店和最后一天酒店
                if(di.hasClass('disabled')==true || i>=(len-1))continue;
                var hotel_id=di.find('.hotel_id');
                var hotel_val=$('input[name='+hotel_id.attr('id')+']');
                var hotel_id_val=di.find('input[name=hotel_id]');
                var hotel_id_v=parseFloat(hotel_id_val.val());
                if(hotel_id_v==0)hotel_id_v='';
                //a.赋值到所有未选择的天数上
                //if(hotel_id_v)continue;
                hotel_val.val(tm_hotel_level);
                hotel_id_val.val(tm_hotel_level_id);
                di.find('input[name=hotel_name]').val(tm_hotel_level);
            }


            /**
             * 2.修改日期时操作
             *  a.默认选择标准酒店
             */

            /**
             * 3.修改单天时操作
             *  a.只修改当天的酒店信息
             *  b.消费项目有所变化
             */
            /**
             * 4.团队人数据修改时操作
             *  a.消费项目有所变化
             */
        },
        //用餐情况
        ItemsFood:function(){
            /**
             * 用餐情况
             * 1.用餐情况数量=每天(中餐+晚餐)*（成人+儿童/2）
             * 2.不算隐藏部分
             */
            var team_days=$('.team_days');
            var len=team_days.length,food_data={'早':0,'中':0,'晚':0},eat_data=[];
            for(var i=0;i<len;i++){
                var days_id=team_days.eq(i);
                var food_id=days_id.find('input[name=food_id]');
                for(var j=0;j<food_id.length;j++){
                    var food_row=food_id.eq(j);
                    if(food_row.attr('checked')=='checked'){
                        if(in_array(food_row.val(),['中','晚'])!=-1) eat_data.push({ day:(i+1), food:'第'+(i+1)+'天团队'+food_row.val()+'餐' });
                        //food_data[food_row.val()]=food_data[food_row.val()]?(food_data[food_row.val()]+1):1;
                    }
                }
            };
            //获取当前用餐情况
            var items_data={};
            ItemsStore.each(function(fv){
                var items_row=fv.data;
                if(items_row.ti_type_new=='餐饮') items_data[items_row.ti_day+'_'+items_row.ti_insti_name]=fv;
            });
            //组织用餐到明细中
            var pop=this.PopData();
            var food=(pop.big+pop.small/2);
            for(var ei=0;ei<eat_data.length;ei++){
                var row=eat_data[ei];
                var itmes_data={
                    insti_name:row.food,
                    cs_type_name:'团队正餐',
                    type_new:'餐饮',
                    day:row.day,
                    num:food
                };
                this.EmptyItemsStore(itmes_data);
                //清除已先中的值
                var f_key=row.day+'_'+row.food;
                if(items_data[f_key]) delete(items_data[f_key]);
            }
            //删除多余的用餐情况
            for(var ii in items_data){
                ItemsStore.remove(items_data[ii]);
            }

            //console.log(food_data)
            //计算公式
            /*var food_num=(food_data['中']+food_data['晚']);
            if(food_num<=0)return false;
            var pop=this.PopData();
            var food=(pop.big+pop.small/2);
            for(var fi=0;fi<food_num;fi++){
                var itmes_data={
                    insti_name:'团队用餐',
                    cs_type_name:'团队正餐',
                    type_new:'餐饮',
                    num:food
                };
                this.EmptyItemsStore(itmes_data);
            }*/
            //cs_type_name_id
           /*
            var food_txt='';
            if(pop.big>0)food_txt=pop.big+'成人 ';
            if(pop.small>0)food_txt+=pop.small+'儿童';
            var itmes_data={
                insti_name:'团队用餐',
                cs_type_name:food_txt,
                type_new:'餐饮',
                num:food
            };*/
            //消费项目表中
            //this.EmptyItemsStore(itmes_data);
        },
        //选择历史产品
        HistoryTeam:function(){
            var is_this=this;
            var scenic_select=$('.scenic-select');
            scenic_select.load();
            scenic_select.click(function(){
                ItemsWindow.show();
                Ext.getCmp('sct_wind_id').setText('确认');
            });
            ItemsWindow.on({
                show:function(){
                    is_this.ScenicShow();
                }
            });
        },
        //每天所存在的景区、酒店
        SelectScenicAll:function(){
            var team_days=$('.team_days');
            var sc_data=[];
            for(var ti=0;ti<team_days.length;ti++){
                var days_id=team_days.eq(ti);
                var sc_id=days_id.find('input[name=sc_id]').val();
                if(sc_id){
                    if(sc_data.length>0){
                        sc_data=sc_data.concat(sc_id.split(','));
                    }else{
                        sc_data=sc_id.split(',');
                    }
                }
            }
            return {scenic_num:sc_data};
        },
        //景区删除
        DaysScenicDel:function(){
            var team_days=$('.team_days');
            for(var i=0;i<team_days.length;i++){
                var days_id=team_days.eq(i);
                var scenic_id=days_id.find('input[name=sc_name]');
                var scenic_i=days_id.find('input[name=sc_id]');
                var scenic_txt=scenic_id.val();
                if(!scenic_txt){
                    days_id.find('.days-scenic').html('');
                    continue;
                }
                var sc_data=scenic_txt.split(','),sc_string='',sc_id=(scenic_i.val()).split(',');
                for(var si=0;si<sc_data.length;si++){
                    sc_string+='<em title="'+sc_data[si]+'" sc-id="'+sc_id[si]+'" class="sc_list">'+sc_data[si]+'<i class="fa fa-times" aria-hidden="true"></i></em>';
                }
                days_id.find('.days-scenic').html(sc_string);
            }
            this.DaysScenicDelClose();
        },
        //景区的排序问题
        ScenicSort:function(){
            var is_this=this;
            $( ".days-scenic" ).sortable({
                cursor: "move",
                items :".sc_list",                        //只是li可以拖动
                opacity: 0.6,                       //拖动时，透明度为0.6
                /*revert: true,                     //释放时，增加动画*/
                zIndex:60,
                update : function(event, ui){       //更新排序之后
                    var days_id=$(this).parents('.team_days');
                    var sc_list=$(this).find('.sc_list');
                    var sc_id=[],sc_name=[],scenic_data=[];
                    for(var i=0;i<sc_list.length;i++){
                        var row=sc_list.eq(i);
                        sc_id.push(row.attr('sc-id'));
                        sc_name.push(row.attr('title'));
                        var sc_val=ScenicAll.scenic_items[row.attr('sc-id')];
                        $.each(sc_val,function(i,v){
                            scenic_data.push(v);
                        })
                    }
                    DaysBoxId=days_id;
                    is_this.scenic_items_fn('移动景区',scenic_data);
                }
            });
        },
        //删除所选择景区
        DaysScenicDelClose:function(){
            var fa_times=$('.fa-times');
            var is_this=this;
            fa_times.unbind();
            fa_times.click(function(){
                var days_id=$(this).parents('.team_days');
                DaysBoxId=days_id;
                var sc_list=$(this).parents('.sc_list');
                var sc_id=(days_id.find('input[name=sc_id]').val()).split(','),scenic_data=[];
                for(var i=0;i<sc_id.length;i++){
                    if(sc_id[i]!=sc_list.attr('sc-id')){
                        var sc_val=ScenicAll.scenic_items[sc_id[i]];
                        $.each(sc_val,function(i,v){
                            scenic_data.push(v);
                        })
                    }
                }
                is_this.scenic_items_fn('删除景区',scenic_data);
            });
        },
        //选择每天的酒店
        DaysHotel:function(){
            var hotel_box=$('.add-hotel');
            hotel_box.unbind();
            hotel_box.click(function(){
                HotelWindow.show();
                DaysBoxId=$(this).parents('.team_days');
                SUNLINE.baseParams(HotelStore,{d_type:'酒店住宿',start:0,limit:20,page:1});
                HotelStore.load();
            });
        },
        //批量导入游客信息
        BatchUser:function(){
            var batch=SUNLINE.BatchUserData({},function(r){
                var user_data=r;
                var data_user=[];
                var tour_list=$('.tour-list');
                for(var ti=0;ti<tour_list.length;ti++){
                    var id=tour_list.eq(ti);
                    var rows=user_data[ti];
                    if(!rows)continue;
                    if(rows.vip_name)id.find('input[name=vip_name]').val(rows.vip_name);
                    if(rows.vip_card_type)id.find('select[name=vip_card_type]').val(rows.vip_card_type);
                    if(rows.vip_card)id.find('input[name=vip_card]').val(rows.vip_card);
		            if(!rows.vip_mob)rows.vip_mob='';
                    id.find('input[name=vip_mob]').val(rows.vip_mob);
                    rows.t_name=id.attr('t_id');
                    rows.s_id=id.find('input[name=s_id]').val();
                    rows.s_team_id=id.find('input[name=s_team_id]').val();
                    rows.t_index=ti;
                    id.attr('t_index',ti);
                    data_user.push(rows);
                }
                SeatStore=data_user;
            });
            var batch_user=$('.batch-user');
            batch_user.unbind();
            batch_user.click(function(){
                var tour_list=$('.tour-list');
                batch.batch_grid.pop=tour_list.length;
                batch.batchWin.show();
            });
        },
        //批量操作接送信息
        BatchSite:function(){
            var is_this=this;
            var site_form=ITEMS_SCENIC.SelectSite(function(t,data,win){
                //当不是全部操作且不是指定操作停止执行
                if(data.site_bool!='on' && data.bus_id.length<=0){
                    Ext.Msg.alert('友情提示','请返回选择游客信息或勾选【同步到所有游客上】');
                    return false;
                }
                var post_go={
                    start_site:data.start_site,
                    site_start:data.site_start,
                    site_start_id:data.site_id,
                    start_time:data.start_time,
                    start_map:data.start_map
                };
                var post_back={
                    start_end:data.start_site,
                    site_end:data.site_start,
                    site_end_id:data.site_id,
                    end_time:data.start_time,
                    end_map:data.start_map
                };
                var post={};
                if(data.s_goto_type=='去程'){
                    post=post_go;
                }else if(data.s_goto_type=='返程'){
                    post=post_back;
                }else{
                    post=Ext.apply(post_go,post_back);
                }
                //修改游客数据
                is_this.SeatSaveData(data,post);
                win.hide();
            });
            var td_win=site_form.win;
            site_form=site_form.form;
            var batch_site=$('.batch-site');
            batch_site.unbind();
            batch_site.click(function(){
                var check_id=document.getElementsByClassName('check-id');
                var check_row=[];
                for(var i=0;i<check_id.length;i++){
                    if(check_id[i].checked===true)check_row.push(i);
                }
                td_win.show();
                var _from=site_form.getForm();
                _from.reset();
                var post={};
                if(check_row.length>0){
                    post.bus_id=check_row;
                    post.site_bool=false;
                }else{
                    post.site_bool=true;
                }
                _from.setValues(post);
            });
        },
        //批量操作大交通信息
        BatchFly:function(){
            var is_this=this;
            var fly_form=ITEMS_SCENIC.SelectFly({},function(t,data,win){
                var post_data={
                    fly_number:data.ob_bus_number,
                    fly_start_code:data.ob_start_code,
                    fly_end_code:data.ob_end_code,
                    fly_type:data.ob_goto_type,
                    /*fly_start_name:'萧山机场',*/
                    fly_start_date:data.ob_start_date,
                    fly_start_time:data.ob_start_time,
                    fly_start_id:data.ob_site_sid,
                    fly_start_platform:data.ob_start_platform,
                    /*fly_end_name:'首都机场',*/
                    fly_end_date:data.ob_end_date,
                    fly_end_time:data.ob_end_time,
                    fly_end_id:data.ob_site_eid,
                    fly_end_platform:data.ob_end_platform,
                    /*add_ticket: 0,*/
                    start_site:data.ob_start_site,
                    end_site:data.ob_end_site,
                    fl_berth_type:data.ob_berth_type,
                    tbd_id:data.tbd_id,
                    tbd_type:data.tbd_type
                };
                if(data.add_ticket=='on'){
                    post_data.add_ticket=1;
                }
                var post={};
                if(data.ob_goto_type=='去程'){
                    post={go_fly:post_data};
                }else{
                    post={to_fly:post_data};
                }
                is_this.SeatSaveData(data,post);
                win.hide();
            });
            var f_win=fly_form.win;
            fly_form=fly_form.form;
            var batch_fly=$('.batch-fly');
            batch_fly.unbind();
            batch_fly.click(function(){
                var check_id=document.getElementsByClassName('check-id');
                var check_row=[];
                for(var i=0;i<check_id.length;i++){
                    if(check_id[i].checked===true)check_row.push(i);
                }
                f_win.show();
                var _from=fly_form.getForm();
                var start_date=Ext.Date.format(Ext.getCmp('team_start_date').getValue(),'Y-m-d');

                _from.reset();
                var post={};
                //去程记录操作
                var go_traffic=$('input[name=go_traffic]').val();
                var go_berth_type='经济舱';
                if(go_traffic!='飞机'){
                    go_traffic='火车';
                    go_berth_type='二等座';
                }
                post.ob_type=go_traffic;
                post.ob_berth_type=go_berth_type;
                post.ob_start_date=start_date;
                post.ob_end_date=start_date;
                post.ob_start_site=$('input[name=go_start]').val();
                post.ob_site_sid=$('input[name=go_start_id]').val();
                post.ob_end_site=$('input[name=go_end]').val();
                post.ob_site_eid=$('input[name=go_end_id]').val();
                fly_form.post_go=post;

                //返程记录操作
                var end_date=Ext.Date.format(Ext.getCmp('team_end_date').getValue(),'Y-m-d');
                var to_traffic=$('input[name=back_traffic]').val();
                var to_berth_type='经济舱';
                if(to_traffic!='飞机'){
                    to_traffic='火车';
                    to_berth_type='二等座';
                }
                fly_form.post_back={
                    ob_type:to_traffic,
                    ob_berth_type:to_berth_type,
                    ob_start_date:end_date,
                    ob_end_date:end_date,
                    ob_start_site:$('input[name=back_start]').val(),
                    ob_site_sid:$('input[name=back_start_id]').val(),
                    ob_end_site:$('input[name=back_end]').val(),
                    ob_site_eid:$('input[name=back_end_id]').val()
                };

                if(check_row.length>0){
                    post.bus_id=check_row;
                    post.site_bool=false;
                    fly_form.post_back.bus_id=check_row;
                    fly_form.post_back.site_bool=false;
                }else{
                    post.site_bool=true;
                    fly_form.post_back.site_bool=true;
                }
                _from.setValues(post);
            });
        },
        //座位数据的修改
        SeatSaveData:function(data,post){
            var is_this=this;
            var tpl='';
            //设置为不含接送
            if(data.seat_status=='on'){
                Ext.each(data,function(sv,si){ data[si]=''; })
            }
            if(data.site_bool=='on'){
                //同步到所有游客
                Ext.each(SeatStore,function(v,i){
                    SeatStore[i]=Ext.apply(SeatStore[i],post);
                    tpl+=is_this.SeatTpl(SeatStore[i]);
                });
            }else{
                //同步到所选择游客
                var bus_id=data.bus_id;
                Ext.each(SeatStore,function(dv,id){
                    if(in_array(id,bus_id.split(','))!=-1){
                        SeatStore[id]=Ext.apply(SeatStore[id],post);
                    }
                    tpl+=is_this.SeatTpl( SeatStore[id]);
                });
            }
            if(!tpl)tpl='还没有填写游客信息...';
            $('.tour-content').html(tpl);
        },
        ScenicShow:function(){
            var scenic=this.SelectScenicAll();
            scenicIT_detail.store.removeAll();
            if(ScenicAll.scenic_items){
                $.each(ScenicAll.scenic_items,function(i,v){
                    if(!v.length)return true;
                    $.each(v,function(si,sv){
                        if(in_array(sv.sc_id,scenic.scenic_num)!=-1)return true;//如果已经用过了，就不可再次使用
                        scenicIT_detail.store.add(sv);
                    })
                });
            }
        },
        AddDayScenic:function(){
            var add_scenic=$('.add-scenic');
            var is_this=this;
            add_scenic.unbind();
            add_scenic.click(function(){
                is_this.ScenicShow();
                Ext.getCmp('sct_wind_id').setText('确认选择');
                DaysBoxId=$(this).parents('.team_days');
                ItemsWindow.show();
            });
        },
        //追加报价明细(start)
        AddOffer:function(){
            var is_this=this;
            is_this.AppendOffer();
            var tm_list=['tm_big_pop','tm_small_pop','tm_guide','tm_car'];
            //this.OfferPrice();
            for(var i=0;i<tm_list.length;i++){
                var tm_id=$('input[name='+tm_list[i]+']');
                tm_id.unbind();
                tm_id.blur(function(){
                    var tm_id=$(this).parents('.offer-list');
                    is_this.OfferPrice(tm_id);
                });
            }
        },
        AppendOffer:function(){
            //追加报价
            var add_offer=$('.add-offer');
            var is_this=this;
            add_offer.unbind();
            add_offer.click(function(){
                is_this.OfferTpl();
                is_this.AddOffer();
            });
            this.OfferDel();
        },
        OfferPrice:function(id){
            var pop=this.PopData();
            var big_pop=parseFloat(id.find('input[name=tm_big_pop]').val());
            var small_pop=parseFloat(id.find('input[name=tm_small_pop]').val());
            var car_price=parseFloat(id.find('input[name=tm_car]').val());
            var guide_price=parseFloat(id.find('input[name=tm_guide]').val());
            var tm_big_price=id.find('input[name=tm_big_price]');
            var tm_small_price=id.find('input[name=tm_small_price]');
            if(!car_price)car_price=0;
            if(!guide_price)guide_price=0;
            if(big_pop>=0 && big_pop)pop.big=big_pop;
            if(small_pop>=0 && small_pop)pop.small=small_pop;
            var big_price= 0,small_price=0;
            ItemsStore.each(function(v){
                var rows= v.data;
                if(rows.ti_type_new=='导游' || rows.ti_type_new=='车辆'){
                    var car_money=parseFloat(car_price/(big_pop+small_pop));
                    if(rows.ti_type_new=='导游')car_money=parseFloat(guide_price/(big_pop+small_pop));
                    if(big_pop>0)big_price+=car_money;
                    if(small_pop>0)small_price+=car_money;
                }else{
                    if(rows.ti_sct_type=='成人票'){
                        big_price+=parseFloat(rows.ti_trade_price);
                        if(rows.ti_type_new=='餐饮')small_price+=parseFloat(rows.ti_trade_price/2*small_pop);
                    }else{
                        small_price+=parseFloat(rows.ti_trade_price);
                    }
                }
            });
            tm_big_price.val(Math.ceil(big_price).toFixed(2));
            tm_small_price.val(Math.ceil(small_price).toFixed(2));
        },
        OfferDel:function(){
            //删除报价
            var offer_del=$('.offer-del');
            offer_del.unbind();
            offer_del.click(function(){
                var list=$(this).parents('.offer-list');
                list.remove();
            });
        },
        OfferTpl:function(){
            var pop=this.PopData();
            var offer_id=$('.offer-id');
            var tpl='<tr class="offer-list">' +
                '<td><input type="text" class="tm_table" name="tm_big_pop" value="'+pop.big+'"></td>' +
                '<td><input type="text" class="tm_table" name="tm_small_pop" value="'+pop.small+'"></td>' +
                '<td><input type="text" class="tm_table" name="tm_guide"></td>' +
                '<td><input type="text" class="tm_table" name="tm_car"></td>' +
                '<td><input type="text" class="tm_table" name="tm_big_price"></td>' +
                '<td><input type="text" class="tm_table" name="tm_small_price"></td>' +
                '<td><input type="text" class="tm_table" name="tm_remark"></td>' +
                '<td class="offer-del">删除</td>' +
                '</tr>';
            var app_offer=$('.app_offer');
            if(!app_offer.html()){
                tpl='<table class="team_table" cellpadding="0" cellspacing="0" border="0">' +
                    '<thead><tr><th>成人数</th><th>儿童数</th><th>导游金额</th><th>车辆金额</th><th>成人单价</th><th>儿童单价</th><th style="width: 400px">备注说明</th><th style="width: 40px">操作</th></tr></thead>' +
                    '<tbody class="app_offer">'+tpl+'</tbody></table>';
                offer_id.html(tpl);
            }else{
                app_offer.append(tpl);
            }
            this.OfferDel();
        }
    };
    TeamTo.construct();
    //确认选择景区
    function scenic_items_fn(t){
        if(t.text=='确认选择'){
            TeamTo.scenic_items_fn(t);
        }else{
            ItemsWindow.hide();
        }
    };
    //确认选择酒店
    function HotelSelectFn(t){
        TeamTo.hotel_select_fn(t);
    };

    var yun_titile=$('#yun-titile');
    $(window).scroll(function(){
        var top_px=$(this).scrollTop();
        if(top_px>20){
            yun_titile.css({
                position:'fixed',
                top:0
            });
        }else{
            yun_titile.css({
                position:'relative'
            });
        }
    });
    $('.yun-title-left').tabs({
        t_hover:".ytl-txt",
        t_event:"click",
        t_move_add:[
            [".ytl_list", "ytl_hover"],
            [".team-display", "display_show"]
        ]
    },function(n,i,c){
        if(i.html()=='游客信息'){
            TeamTo.SeatData();
        }
    });
    /*上车站点的处理*/
    function site_select_box(){
        var site_id=$('.site-select');
        site_id.unbind();
        site_id.click(function(){
            var tour_id=$(this).parents('.tour-list');
            var tid=tour_id.attr('t_id');
            var t_index=tour_id.attr('t_index');
            var start_sid=tour_id.find('input[name=start_sid]').val();
            var start_map=tour_id.find('input[name=start_map]').val();
            var start_date=Ext.getCmp('team_start_date').getValue();
            start_date=Ext.Date.format(start_date,'Ymd')
            var bool='no';
            if(start_sid>0 || start_map)bool='yes';
            if(!tid){
                layer.msg('没有对应票种数据!');
                return false;
            }
            $.layer({
                type: 2,
                border: [0],
                title: '上车站点选择',
                iframe: {src : $__app__+'/Buy/select_site/site_name/'+Ext.getCmp('go_start').getValue()+'/num/'+t_index+'/start_date/'+start_date},
                area: ['890px', '580px']
            });
        });
    }
    window.site_select_fn=function(data,id,index,bool,site_type){
        var seat={};
        seat={
            start_site:data.st_name,
            start_time:data.sp_go_time?data.sp_go_time:'',
            start_sid:data.sp_id?data.sp_id:0,
            start_map:data.sp_map?data.sp_map:''
        };
        if(bool==true){
            $.each(SeatStore,function(i,v){
                site_ticket_find(i,seat);
            });
        }else{
            site_ticket_find(index,seat);
        };
        TeamTo.SeatData();
    };
    function site_ticket_find(index,seat){
        SeatStore[index]=Ext.apply(SeatStore[index],seat);
    };
    //选择订单来源单位
    var SourceNameBox=SUNLINE.CompanyBox({
        where:{
            org_type:'网络平台'
        },
        config:{
            displayField:'text',
            valueField:'id',
            id:'source_name',
            fieldLabel:'',
            labelWidth:0,
            width:207,
            labelAlign:'right',
            value:'当前选择报名社',
            renderTo:'rep-source'
        }
    });
    var source_name=$('input[name=tm_source_name]');
    if(source_name.val()){
        SourceNameBox.setValue(source_name.val());
    }

    SourceNameBox.store.on('load',function(){
        this.add({id:0,text:'当前选择报名社'});
    });

    SourceNameBox.on('select',function(c,r,e){
        var row= r[0];
        $('input[name=tm_source_id]').val(row.get('id'));
        $('input[name=tm_source_name]').val(row.get('text'));
    });


    //账号日期的生成
    Ext.getCmp('team_end_date').on({
        change:function(t,n,o){
            var end_date=Ext.Date.format(n,'Y-m-d');
            Ext.getCmp('tm_pay_date').setValue(end_date);
        }
    });
});
