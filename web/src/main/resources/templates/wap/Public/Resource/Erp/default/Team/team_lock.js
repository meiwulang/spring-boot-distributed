/**
 * Created by zhushaolei on 2016/2/27.
 */
var SaveDetail=true;
var CheckBool=false;
var ScenicAll={};
var SeatStore=[];
var ScenicId=[];
var DaysEmpty=[];
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = $app_root + 's.gif';
    Ext.QuickTips.init();
    Ext.Loader.setPath ("Ext","/Public/Ext5/" ) ;

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
    //var items_f=['sc_name', 'sct_name','sct_type','si_type','sct_payment','sct_price_settle','sc_pop','sc_money','sc_link','sc_tel'];
    var items_f=['ti_id'];
    var ItemsStore=Ext.create('Ext.data.Store', {
        storeId: 'ItemsStore',
        fields:items_f,
        data: tm_itmes_detail,groupField:'ti_sort'
    });


    var sct_field=['sc_id','sc_name'];
    var ScenicStore=Ext.create('Ext.data.Store', {
        fields:sct_field,
        data: [],groupField:'ti_sort'
    });

    var Scenic_cm=[
        new Ext.grid.RowNumberer(),
        {header:"ID", dataIndex:"sc_id", width:50, hidden:true},
        {header:"景区名称", dataIndex:"sc_name", width:220}
    ];

    var pro_grid=new Ext.grid.GridPanel({
        store:ScenicStore,
        columns:Scenic_cm,
        bodyBorder: false,
        autoScroll : true
    });
    //选择景区窗口
    var ScenicWindow= new Ext.Window({
        title : '打印',
        width : 400,
        height : 600,
        modal : true,
        maximizable : true,//全屏效果
        closeAction : 'hide',
        fixed:true,
        items:pro_grid,
        buttons:[
            {text:'确认选择'},
            {text:'关闭', handler:function(){ScenicWindow.hide();}}
        ]
    });
    ScenicWindow.show();
    //选择酒店窗口
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
                        valueField:'text'
                    }
                };
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
                        }
                        //修改行程中的酒店信息
                        if(row.attr('id')=='tm_hotel_level') is_this.HotelToAll();

                        //修改去程大交通
                        if(row.attr('id')=='go_traffic'){
                            Ext.getCmp('go_start').setValue('');
                            Ext.getCmp('go_end').setValue('');
                            var itmes_data={
                                insti_name:rw.text,
                                cs_type_name:'去程',
                                type_new:'大交通'
                            };
                            is_this.EmptyItemsStore(itmes_data);
                        }
                        if(row.attr('id')=='back_traffic'){
                            Ext.getCmp('back_start').setValue('');
                            Ext.getCmp('back_end').setValue('');
                            var itmes_data={
                                insti_name:rw.text,
                                cs_type_name:'返程',
                                type_new:'大交通'
                            };
                            is_this.EmptyItemsStore(itmes_data);
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
                                this.getStore().load();
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
                is_this.DateDays(dateId[0],dateId[1]);
                $.each(dateId,function(i,v){
                    v.on('select',function(){
                        is_this.DateDays(dateId[0],dateId[1]);
                    });
                })
            },100);

        },
        DateDays:function(days_start,days_end){
            /*var start_date=parseFloat(days_start.getValue().getTime()/1000);
            var end_date=parseFloat(days_end.getValue().getTime()/1000);
            var days=(end_date-start_date)/3600/24+1;*/
            var days=this.DistanceDays();
            $('input[name=team_days]').val(days);
            var days_data=date_lousy(days_start.rawValue,days_end.rawValue);
            this.DateDaysView(days_data);
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
                if(DaysEmpty[d_id])continue;
                DaysEmpty[d_id]=days_id.html();
            }
            console.log(DaysEmpty);
            //得到行程天数
            var days=this.DistanceDays(),days_tpl='';
            for(var i=0;i<days;i++){
                if(DaysEmpty[i]){
                    days_tpl+='<div class="team_days days-'+i+'" date-val="'+i+'">'+DaysEmpty[i]+'</div>';
                }else{
                    days_tpl+=this.DaysTpl(i);
                }
            }
            $('.tm-table').html(days_tpl);
            /*return false;
            var days=[];
            for(var i=0;i<days_data.length;i++){
                days.push({team_date:days_data[i],team_days:i+1});
            };
            console.log(days);
            var team_days=$('.team_days');
            var days_len=team_days.length;
            var team_len=days.length;
            //清除多余的时间段
            var max_min={min:0,max:0};
            for(var j=0;j<days_len;j++){
                var rw=team_days.eq(j);
                if(!rw.hasClass('disabled')){
                    if(max_min.min==0)max_min.min=parseFloat(rw.attr('date-val'));
                    max_min.max=parseFloat(rw.attr('date-val'));
                }
                if(in_array(rw.attr('date-val'),days_data)==-1)rw.addClass('disabled');
            }
            var days_tpl;
            for(var i=0;i<team_len;i++){
                var row=days[i];
                var date_id=$('.days-'+row.team_date);
                if(parseFloat(row.team_date)<max_min.min){
                    if(date_id.hasClass('disabled')){
                        date_id.removeClass('disabled');
                    }else{
                        days_tpl=this.DaysTpl(row);
                        $('.tm-table').prepend(days_tpl);
                    }
                }else if(parseFloat(row.team_date)>max_min.max){
                    if(date_id.hasClass('disabled')){
                        date_id.removeClass('disabled');
                    }else{
                        days_tpl=this.DaysTpl(row);
                        $('.tm-table').append(days_tpl);
                    }
                }else{
                    date_id.find('.days-id').html(row.team_days+'D');
                }
            }*/
        },
        SaveView:function(){
            if(typeof tm_route!='object')return '';
            var is_this=this;
            var tpl='';
            $.each(tm_route,function(i,v){
                tpl+=is_this.TeamTpl(v);
            })
            $('.tm-table').html(tpl);
        },
        DateDaysView:function(days_data){
            if(SaveDetail==true && typeof tm_route=='object'){
                this.SaveView();
                SaveDetail=false;
            }else{
                this.emptyView(days_data);
            }
            var is_this=this;
            setTimeout(function(){
                //is_this.ScenicBox();
                is_this.SceneItems();
                //is_this.HotelBox();
                is_this.ClickStatus();
                is_this.HotelToAll();
                is_this.HotelStoreData();
                is_this.ItemsFood();
            },200);
        },
        //渲染景区控件
        ScenicBox:function(){
            var len=$('.scenic_id').length;
            var team_days=$('.team_days');
            var is_this=this;
            for(var i=1;i<=len;i++){
                var days_id=team_days.eq(i-1);
                var id=days_id.attr('date-val');
                //if(Ext.getCmp('source-'+id+'_id'))console.log(Ext.getCmp('source-'+id+'_id').render('source-'+id));
                if($('#source-'+id+'_id').html())continue;
                if(typeof DateScenic[id]!='object')DateScenic[id]={};
                var source_name=$('#source-'+id).find('.txt').html();
                var source_val=[];
                if(source_name)source_val=source_name.split(',');
                // 景区景点操作
                //console.log(Ext.getCmp('source-'+id+'_id'));
                var com_pls=SUNLINE.ComBoxPlus({
                    id:'source-'+id,
                    fields:['sc_id','sc_name'],url:$__app__+'/Dict/dict_json',
                    where:{d_type:'游玩景点'},
                    config:{
                        renderTo:'source-'+id,
                        displayField:'sc_name',
                        valueField:'sc_name',
                        width:710,
                        height:30,
                        multiSelect: true,
                        value:source_val
                    },type:'Tag'
                });
                function store_all(t_is){
                    if(typeof ScenicAll.scenic=='object'){
                        t_is.removeAll();
                        var scenic= ScenicAll.scenic;
                        var team_days=$('.team_days');
                        var team_scenic=[];
                        $.each(team_days,function(i,v){
                            var sc_row=team_days.eq(i).find('input[name=sc_name]').val();
                            if(sc_row){
                                sc_row=sc_row.split(',');
                                team_scenic=team_scenic.concat(sc_row);
                            }
                        });
                        $.each(scenic,function(i,v){
                            var s_row=scenic[i];
                            if(in_array(s_row.sc_name,team_scenic)!=-1)return true;
                            t_is.add(s_row);
                        });
                    }
                }
                com_pls.on({
                    expand:function(q,opt){ store_all(this.store); }
                });
                com_pls.store.on({
                    load:function(q,opt){ store_all(this);}
                });

                com_pls.on('change',function(r,c,e){
                    var days=$('#'+(r.getId()).replace('_id','')).parents('.team_days');
                    var date_val=days.attr('date-val');
                    DateScenic_val=DateScenic[date_val];
                    var str,scene_name={},scene_txt='',scene_data={},sc_name=[],sc_id=[];
                    Ext.each(r.displayTplData,function(v,vi){
                        var row=v;
                        scene_name[row.sc_name]=scene_name[row.sc_name];
                        sc_name.push(row.sc_name);
                        sc_id.push(row.sc_id);
                        if(str){
                            str+=','+row.sc_id;
                            scene_txt+=' -> '+row.sc_name;
                        }else{
                            str=row.sc_id;
                            scene_txt=row.sc_name;
                        }
                        if(typeof DateScenic_val[row.sc_id]=='object'){
                            scene_data[row.sc_id]=DateScenic_val[row.sc_id];
                        }else{
                            scene_data[row.sc_id]={sc_id:row.sc_id,sc_name:row.sc_name,sc_bintroduction:row.sc_bintroduction};
                        }
                    });
                    DateScenic[date_val]=scene_data;
                    //显示隐藏项目明细
                    if(str){
                        days.find('.hide-cls').show();
                    }else{
                        days.find('.hide-cls').hide();
                    }

                    //线路安排
                    days.find('input[name=line_id]').val(scene_txt);
                    days.find('input[name=sc_id]').val(str);
                    days.find('input[name=sc_name]').val(sc_name);

                    //景点说明
                    var msg_box=days.find('.msg-box');
                    var msg_tpl=is_this.SceneMsgTpl(str,scene_data);
                    msg_box.find('dl').html(msg_tpl);
                    is_this.ScItemsBlur();
                    //如果项目内容存在，操作项目内容区域
                    if(typeof ScenicAll=='object'){
                        TotelStore.removeAll();
                        //var scenic_items=[];
                        $.each(sc_id,function(i,v){
                            if(!ScenicAll.scenic_items) return true;
                            if(typeof ScenicAll.scenic_items[v]=='object'){
                                var row=ScenicAll.scenic_items[v];
                                $.each(row,function(i,v){
                                    //scenic_items.push(v);
                                    TotelStore.add(v);
                                });
                            }
                        });
                        is_this.ScenicItemsSave(TotelStore,days);
                    }

                });
            }
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
        //渲染酒店控件
        HotelBox:function(){
            var len=$('.hotel_id').length,dis_len=len;
            var is_this=this;
            var team_days=$('.team_days');
            // 景区景点操作
            for(var i=1;i<=len;i++){
                var days_id=team_days.eq(i-1);
                var id=days_id.attr('date-val');
                if(days_id.hasClass('disabled')==true)dis_len=dis_len-1;
                /*if(days_id.hasClass('disabled'))days_id.removeClass('disabled');*/
                if($('#hotel-'+id+'_id').html())continue;
                if(typeof DateScenic[id]!='object')DateScenic[id]={};
                var hotel_val=$('#hotel-'+id).find('.txt').html();
                // 景区景点操作
                var hotel_pls=SUNLINE.ComBoxPlus({
                    id:'hotel-'+id,
                    fields:['ht_id','ht_name'],url:$__app__+'/Dict/dict_json',
                    where:{d_type:'酒店住宿'},
                    config:{renderTo:'hotel-'+id,
                        displayField:'ht_name',
                        valueField:'ht_name',
                        width:710,
                        height:30,
                        value:hotel_val
                    }
                });
                hotel_pls.on('select',function(c,r,e){
                    var row= r[0].data;
                    var days=$('#'+(c.getId()).replace('_id','')).parents('.team_days');
                    days.find('input[name=hotel_id]').val(row.ht_id);
                    days.find('input[name=hotel_name]').val(row.ht_name);
                    is_this.HotelStoreData();
                });
                hotel_pls.on({
                    'beforequery':function(c,r,o) {
                        var tm_hotel_level=Ext.getCmp('tm_hotel_level').getValue();
                        var tm_hotel_level_id=$('input[name=tm_hotel_level_id]');
                        if(parseFloat(tm_hotel_level_id.val())<0){
                            SUNLINE.baseParams(this.store, {d_type:'酒店住宿',ht_class:tm_hotel_level});
                        }else{
                            SUNLINE.baseParams(this.store, {d_type:'酒店住宿'});
                        }
                        this.store.load();
                    }
                });
            }
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
                    ti_sort:sort_fn('住宿')
                };
            });

            //先取出已经存在的酒店信息
            var remove_hotel=[];
            ItemsStore.each(function(sv,si){
                var row=sv.data;
                if(hotel_data[row.ti_name_id]){
                    var h_row=hotel_data[row.ti_name_id];
                    row.ti_num=h_row.ti_num;
                    hotel_data[row.ti_name_id]=row;
                }
                if(row.ti_type_new=='住宿') remove_hotel.push(sv);
            });
            $.each(remove_hotel,function(ri,rv){
                ItemsStore.remove(rv);
            });

            $.each(hotel_data,function(hi,hv){
                if(!hv.ti_name_id)return true;
                if(pop.big==0)pop.big=1;
                hv.ti_num=pop.big*hv.ti_num;
                hv.ti_all_money=hv.ti_num*hv.ti_trade_price;
                ItemsStore.add(hv);
            });
            /*TotelStore.each(function(sv,si){
                if(hotel_data[sv['ti_name_id']] && sv['ti_type_new']=='住宿'){

                }else{
                    TotelStore.add();
                }
            });*/
            /*var hotel_data={
                ti_name_id:team_days.find('input[name=hotel_id]').val(),
                ti_insti_name:team_days.find('input[name=hotel_id]').val(),
                ti_type_mode:team_days.find('input[name=hotel_id]').val(),
                ti_num:team_days.find('input[name=hotel_id]').val()
            };*/
        },
        TeamTpl:function(data){
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
                    sc_detail+='<dd class="msg-list msg-'+e+'" data-id="'+e+'">' +
                        '<span class="days-title">'+ ev.name+'</span>' +
                        '<span class="days-info">' +
                        '<input type="text" name="scenic_msg_id" class="days-from scenic_items" value="'+ ev.detail+'"></span></dd>';
                })
            }
            return '<div class="team_days days-'+data.team_date+'" date-val="'+data.team_date+'">' +
                '<div class="days-id" title="'+data.team_date+'">'+data.team_days+'D</div>' +
                '<div class="days-mian">' +
                '<ul>' +
                '<li class="scenic_list days-list">' +
                '<span class="days-title">旅游景点：</span>' +
                '<span class="days-info">' +
                '<i class="scenic_id" id="source-'+data.team_date+'"><i class="txt">'+data.sc_name+'</i></i>' +
                '<input type="hidden" name="sc_id" class="days-from" value="'+data.sc_id+'">' +
                '<input type="text" name="sc_name" class="days-from" value="'+data.sc_name+'">' +
                '</span>' +
                '</li>' +
                '<li class="scenic_items_list days-list '+sc_detail_hide+'">' +
                '<span class="days-title">景点项目：</span>' +
                '<span class="days-info">' +
                '<input type="hidden" name="sc_items_id" class="days-from" value="'+data.sc_items_id+'">' +
                '<input type="text" readonly="readonly" name="scenic_items_id" value="'+data.scenic_items_id+'" class="days-from" style="width:620px;">' +
                '</span>' +
                '<span class="days-exit"><i class="fa fa-angle-down"></i> 编辑</span>' +
                '</li>' +
                '<li class="line_list days-list '+sc_detail_hide+'">' +
                '<span class="days-title">线路安排：</span>' +
                '<span class="days-info"><input type="text" name="line_id" class="days-from" value="'+data.line_id+'"></span>' +
                '</li>' +
                '<li class="food_list days-list">' +
                '<span class="days-title">用餐情况：</span>' +
                '<span class="days-info" style="height:30px;line-height: 30px">' +food_tpl +
                '<input name="food_text" type="text" class="days-from" style="width: 585px;margin-left: 5px" value="'+data.food_text+'">' +
                '</span>' +
                '</li>' +
                '<li class="hotel_list days-list">' +
                '<span class="days-title">住宿情况：</span>' +
                '<span class="days-info">' +
                '<i class="hotel_id" id="hotel-'+data.team_date+'"><i class="txt">'+data.hotel_name+'</i></i>' +
                '<input type="hidden" name="hotel_id" class="days-from" value="'+data.hotel_id+'">' +
                '<input type="hidden" name="hotel_name" class="days-from" value="'+data.hotel_name+'">' +
                '</span>' +
                '</li>' +
                '<li class="scenic_msg days-list '+sc_detail_hide+'"><div class="msg-box"><dl>'+sc_detail+'</dl></div></li>' +
                '<li class="detail_list days-list">' +
                '<span class="days-title">行程说明：</span>' +
                '<span class="days-info">' +
                '<textarea type="text" name="detail_id" class="days-from" style="height:60px;">'+data.detail+'</textarea>' +
                '</span>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
        },
        DaysTpl:function(data){
            /*var hotel_level=Ext.getCmp('tm_hotel_level').getValue();
            var hotel_level_id=$('input[name=tm_hotel_level_id]').val();*/
            //('#source-'+data).html('');
            //Ext.getCmp('source-'+data).remove();
            return '<div class="team_days days-'+data+'" date-val="'+data+'">' +
                '<div class="days-id" title="'+data+'">'+(data+1)+'D</div>' +
                '<div class="days-mian">' +
                '<ul>' +
                '<li class="scenic_list days-list">' +
                '<span class="days-title">旅游景点：</span>' +
                '<span class="days-info">' +
                '<i class="scenic_id" id="source-'+data+'"></i>' +
                '<input type="hidden" name="sc_id" class="days-from">' +
                '<input type="text" name="sc_name" class="days-from" readonly="readonly">' +
                '</span>' +
                '</li>' +
                '<li class="scenic_items_list days-list hide-cls">' +
                '<span class="days-title">景点项目：</span>' +
                '<span class="days-info">' +
                '<input type="hidden" name="sc_items_id" class="days-from">' +
                '<input type="text" readonly="readonly" name="scenic_items_id" class="days-from" style="width:620px;">' +
                '</span>' +
                '<span class="days-exit">编辑 <i class="fa fa-angle-down"></i></span>' +
                '</li>' +
                '<li class="line_list days-list hide-cls">' +
                '<span class="days-title">线路安排：</span>' +
                '<span class="days-info"><input type="text" name="line_id" class="days-from"></span>' +
                '</li>' +
                '<li class="food_list days-list">' +
                '<span class="days-title">用餐情况：</span>' +
                '<span class="days-info" style="height:30px;line-height: 30px">' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="早"> 早</label>' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="中"> 中</label>' +
                '<label class="food-cls"><input type="checkbox" name="food_id" value="晚"> 晚</label>' +
                '<input name="food_text" type="text" class="days-from" style="width: 585px;margin-left: 5px">' +
                '</span>' +
                '</li>' +
                '<li class="hotel_list days-list">' +
                '<span class="days-title">住宿情况：</span>' +
                '<span class="days-info">' +
                '<i class="hotel_id" id="hotel-'+data+'"><i class="txt"></i></i>' +
                '<input type="hidden" name="hotel_id" class="days-from">' +
                '<input type="hidden" name="hotel_name" class="days-from">' +
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
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票'//票种类型
            };
             items_data.ti_sort=sort_fn(items_data.ti_type_new);

             var items_remove={};
             ItemsStore.each(function(v,i){
                 var row= v.data;
                 if(row.ti_type_new==data.type_new && row.ti_cs_type_name==data.cs_type_name && data.type_new=='大交通'){
                     items_remove=v;
                 }else if(data.type_new='餐饮'){
                     if(row.ti_insti_name==data.insti_name){
                         row.ti_cs_type_name=items_data.ti_cs_type_name;
                         row.ti_num=items_data.ti_num;
                         row.ti_all_money=items_data.ti_num* row.ti_trade_price;
                         items_data=row;
                         items_remove=v;
                     }else{
                         if(row.ti_type_new=='餐饮')items_data='';
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
                        sct_id.push(iv.sct_id);
                        if(in_array(iv.sct_id,store_id)==-1){
                            iv.si_type='按人计量';
                            if(iv.sct_type=='成人票'){
                                iv.sc_pop=pop.big;
                            }else if(iv.sct_type=='婴儿票'){
                                iv.sc_pop=pop.tiny;
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
                            iv.ti_type_mode=iv.sct_price_settle;
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
                {text:'毛利',iconCls:'button-add',id:'profit_id'},
                {text:'其他',iconCls:'button-add',id:'out_id'}
            ];

            items_grid=SUNLINE.ItemsList({
                store:ItemsStore,
                items_list:items_list,
                reckon_type:'ti_all_money',
                pop_num:1,
                type:'team'
            },function(m,s){
                count_money();
            },sct_type_select);
            var start_date=$('input[name=team_start_date]');
            var end_date=$('input[name=team_end_date]');
            start_date=(start_date.val()).replace(/-/g,'');
            end_date=(end_date.val()).replace(/-/g,'');
            items_grid.ticket_date={start_date:start_date,end_date:end_date};
            items_grid.render('team-items');
            function count_money(){
                var money= 0,big_money= 0,small_money= 0,tiny_money=0;
                ItemsStore.each(function(v,i){
                    var row= v.data;
                    money+=parseFloat(row.ti_all_money);
                    if(row.ti_sct_type=='成人票'){
                        big_money+=parseFloat(row.ti_all_money);
                    }else if(row.ti_sct_type=='婴儿票'){
                        tiny_money+=parseFloat(row.ti_all_money);
                    }else{
                        small_money+=parseFloat(row.ti_all_money);
                    }
                });
                if(!big_money)big_money=0;
                if(!small_money)small_money=0;
                if(!tiny_money)tiny_money=0;
                var big_price=$('input[name=big_price]');
                var small_price=$('input[name=small_price]');
                var tiny_price=$('input[name=tiny_price]');

                var count_big=$('#team-price .big-count');
                var count_small=$('#team-price .small-count');
                var count_tiny=$('#team-price .tiny-count');

                var pop_big=$('#team-price .big-pop');
                var pop_small=$('#team-price .small-pop');
                var pop_tiny=$('#team-price .tiny-pop');
                var pop=is_this.PopData();

                var big_my=(big_money/pop.big);
                if(!big_my || big_my=='Infinity')big_my=0;
                big_price.val(round_format(big_my));
                count_big.html(big_money.toFixed(2));
                pop_big.html(pop.big);

                var small_my=((small_money/pop.small));
                if(!small_my || small_my=='Infinity')small_my=0;
                small_price.val(round_format(small_my));
                count_small.html(small_money.toFixed(2));
                pop_small.html(pop.small);

                var tiny_my=((tiny_money/pop.tiny));
                if(!tiny_my || tiny_my=='Infinity')tiny_my=0;
                tiny_price.val(round_format(tiny_my));
                count_tiny.html(tiny_money.toFixed(2));
                pop_tiny.html(pop.tiny);

                is_this.CountMoney();
            }
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
            if(!pop_big)pop_big=0;
            if(!pop_small)pop_small=0;
            if(!pop_tiny)pop_tiny=0;
            return {count:(pop_big+pop_small+pop_tiny),big:pop_big,small:pop_small,tiny:pop_tiny};
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
            var pop={};
            for(var i=0;i<id.length;i++){
                var rst=id.eq(i);
                pop[rst.attr('data-type')]={
                    sct_type:rst.attr('data-type'),
                    sct_old_pop:rst.attr('data-val'),
                    sc_pop:rst.val()
                }
            };
            ItemsStore.each(function(v,i){
                var row= v.data;
                if(row.ti_type_mode!='按团计量'){
                    var pop_num=parseFloat(pop[row.ti_sct_type]['sc_pop']);
                    v.set('ti_num',pop_num);
                    v.set('ti_all_money',pop_num*row.ti_trade_price);
                }
            });
        },
        CountMoney:function(){
            var to_text=$('.to-text');
            var team_total_money=$('input[name=team_total_money]');
            var pop=this.PopData();
            var big_price=parseFloat($('input[name=big_price]').val());
            var small_price=parseFloat($('input[name=small_price]').val());
            var tiny_price=parseFloat($('input[name=tiny_price]').val());

            var big_money=parseFloat($('.big-count').html());
            var small_money=parseFloat($('.small-count').html());
            var tiny_money=parseFloat($('.tiny-count').html());
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
            to_text.html(money_txt);

            team_total_money.val((big_money+small_money+tiny_money).toFixed(2));
        },
        //关闭团队窗口
        TeamClose:function(){
            var clos_id=$('.submit-close');
            clos_id.unbind();
            clos_id.click(function(){
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
                var post=is_this.FromData();
                post['tm_status']='保存';
                if($('.submit-release').find('.text').html()=='撤销')post['tm_status']='发布';
                AjaxData(post);
            });

            //发布团队
            var release=$('.submit-release');
            release.unbind();
            release.click(function(){
                var post=is_this.FromData();
                post['tm_status']=$(this).find('.text').html();
                Ext.MessageBox.confirm('友情提示','你确定需要'+post['tm_status']+'当前团队吗?',function(y){
                    if(y!='yes')return false;
                    AjaxData(post);
                });
            });
            function AjaxData(post){
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
                                window.parent.to_pernet_wind('ifm_tab_194',function(id){
                                    id.ifm_tab();
                                });
                                parent.CloseTab(true);
                                window.store.reload();
                            });
                        }else{
                            Ext.Msg.alert('友情提示',info);
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
                items.push(v.data);
            });
            if(items.length>0)Data['tm_items_detail']=Ext.encode(items);


            /*{
             team_days:1,
             team_date:20160225,
             sc_name:['西湖','长城'],
             sc_id:'4093,4096',
             scenic_items_id:'西湖(门票30元/人)',
             sc_items_id:'1121,5543',
             line_id:'居庸关长城 -> 测试水立方'
             food_id:['早','中','晚'],
             food_text:'三餐不可不畏',
             hotel_id:1,
             hotel_name:'北京和平里宾馆',
             sc_detail:{
             '居庸关长城':'居庸关在北京市昌平县境内，形势险要，自古为兵家必争之地',
             '测试水立方':'有南北两个关口，南名“南口”'
             },
             detail:'在这里显示其他内容'
             }*/
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
                var sc_detail={};
                for(var j=0;j<msg_list.length;j++){
                    var rd=msg_list.eq(j);
                    sc_detail[rd.attr('data-id')]={
                        name:rd.find('.days-title').html(),
                        detail:rd.find('.days-info').find('.scenic_items').val()
                    }
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
            return Data;
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
            $.each(SeatStore,function(i,v){
                if(v.t_name=='儿童票'){
                    small_data.push(v);
                }else if(v.t_name=='婴儿票'){
                    tiny_data.push(v);
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

            var tpl='';
            $.each(seat_data,function(si,sv){
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
            var s_id='';
            if(data.s_id)s_id=data.s_id;
            var tpl='<li class="tour-list vip-cls" t_id="'+data.t_name+'" t_index="'+data.t_index+'">' +
                '<div class="tl-left tl-list">' +
                '<span class="tl-ticket"><b>'+(parseFloat(data.t_index)+1)+' ).</b> '+data.t_name+'</span>' +
                '</div>' +
                '<div class="tl-right tl-list">' +
                '<dl><dd class="tlr-list">' +

                '<span class="tlr-from vip-name-id">' +
                '<div class="txt-from vip-list">' +
                '<label class="tlr-txt">姓名</label>' +
                '<input type="text" name="vip_name" value="'+data.vip_name+'" class="ipt-name vip-from">' +
                '</div>' +
                '<div class="msg-from"></div>' +
                '</span>' +
                '<span class="tlr-from vip-card-id">' +
                '<div class="txt-from vip-list">' +
                '<label class="tlr-txt">证件</label>' +
                '<select name="vip_card_type" class="vip-from">' +option_tpl+'</select> ' +
                '<input type="text" name="vip_card" value="'+data.vip_card+'" class="ipt-card vip-from '+card_cls+'">' +
                '</div>' +
                '<div class="msg-from">'+card_alert+'</div>' +
                '</span>' +
                '<span class="tlr-from vip-mob-id">' +
                '<div class="txt-from vip-list">' +
                '<label class="tlr-txt">手机</label>' +
                '<input type="text" name="vip_mob" value="'+data.vip_mob+'" class="ipt-phone vip-from '+mob_cls+'">'+
                '</div>' +
                '<div class="msg-from">'+mob_alert+'</div>' +
                '</span>' +
                '</dd>' +
                '<dd class="tlr-list map-id">' +
                '<i class="fa fa-map-marker"></i> ' +
                '<input type="hidden" value="'+s_id+'" name="s_id" class="vip-from">' +
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
                if(hotel_id_v)continue;
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
            var len=team_days.length,food_data={'早':0,'中':0,'晚':0};
            for(var i=0;i<len;i++){
                var days_id=team_days.eq(i);
                var food_id=days_id.find('input[name=food_id]');
                for(var j=0;j<food_id.length;j++){
                    var food_row=food_id.eq(j);
                    if(food_row.attr('checked')=='checked'){
                        food_data[food_row.val()]=food_data[food_row.val()]?(food_data[food_row.val()]+1):1;
                    }
                }
            };
            //计算公式
            var food_num=(food_data['中']+food_data['晚']);
            if(food_num<=0)return false;
            var pop=this.PopData();
            //var food=food_num*(pop.big+Math.ceil(pop.small/2));
            var food=(pop.big+Math.ceil(pop.small/2));
            var food_txt='';
            if(pop.big>0)food_txt=pop.big+'成人 ';
            if(pop.small>0)food_txt+=pop.small+'儿童';
            var itmes_data={
                insti_name:'团队用餐',
                cs_type_name:food_txt,
                type_new:'餐饮',
                num:food
            };
            //消费项目表中
            this.EmptyItemsStore(itmes_data);
        },
        //选择历史产品
        HistoryTeam:function(){
            var is_this=this;
            var pro_url=$__app__+'/Team/dataJson';
            var pro_field=['pid'];
            var pro_store = SUNLINE.JsonStore(pro_url,pro_field,false);
            function date_format(v, m, r){
                return r.get('tm_date_start')+'至'+r.get('tm_date_end');
            };
            function traffic_format(v, m, r){
                return r.get('tm_go_traffic')+'->'+r.get('tm_back_traffic');
            };
            var pro_cm=[
                new Ext.grid.RowNumberer(),
                {header:"ID", dataIndex:"tm_id", width:50, hidden:true},
                {header:"产品编号", dataIndex:"tm_number", width:190, hidden:true},
                {header:"产品标题", dataIndex:"tm_route_title", width:200},
                {header:"行程日期", dataIndex:"tm_date_start", width:150,renderer:date_format, hidden:true},
                {header:"天数", dataIndex:"tm_day", width:60,align:'center'},
                {header:"交通信息", dataIndex:"tm_go_traffic", width:140,renderer:traffic_format},
                {header:"组团社", dataIndex:"tm_agency", width:240},
                {header:"住宿标准", dataIndex:"tm_hotel_level", width:200}
            ];
            var pro_grid=new Ext.grid.GridPanel({
                region:'center',
                floatable: false,
                margin: '5 0 0 0',
                store:pro_store,
                columns:pro_cm,
                bodyBorder: false,
                autoScroll : true,
                style:'border-right:2px solid #3892d3',
                defaults: {
                    split: true,
                    bodyPadding: 10
                },
                tbar:[
                    '快速搜索:',
                    {
                        xtype:'trigger',
                        triggerCls:'x-form-search-trigger',
                        id:'t_search',
                        cls:'search-icon-cls',
                        emptyText:'团队标题、组团社、住宿标准、交通信息、团队编号',
                        width:280,
                        onTriggerClick:function (e) {
                            t_dosearch();
                        },
                        listeners:{
                            "specialkey":function (_t, _e) {
                                if (_e.keyCode == 13)
                                    t_dosearch();
                            }
                        }
                    }
                ],
                bbar: new Ext.PagingToolbar({
                    pageSize: 12,
                    store:pro_store,
                    displayInfo: true,
                    displayMsg:  '第{0} 到 {1} 条数据 共{2}条',
                    emptyMsg: '没有产品信息'
                })
            });

            function t_dosearch(){
                var skey_v=Ext.getCmp('t_search').getValue();
                SUNLINE.baseParams(pro_store,{skey:skey_v,start:0,limit:12});
                pro_store.load();
                //SUNLINE.baseParams(scenic_store,{});
            }

            var editor_win= new Ext.Window({
                title:'选择历史产品',
                width:950,
                height:500,
                closeAction:'hide',
                modal:true,
                items:pro_grid,
                cls : 'suntour_dataView',
                layout : 'fit',
                buttons : [
                    {text:'确定使用',handler:function(){
                        var row=SUNLINE.getSelected(pro_grid);
                        if(!row){
                            Ext.Msg.alert('友情提示','请选择需要使用团队!');
                            return false;
                        }
                        window.location.href=$__app__+'/Team/index/type/new/id/'+row.data.tm_number
                    }},
                    {text:'关闭',handler:function(){ editor_win.hide()}}
                ]
            });
            var title_select=$('.title-select');
            title_select.unbind();
            title_select.click(function(){
                editor_win.show();
                SUNLINE.baseParams(pro_store,{type:'team',start:0,limit:12});
                pro_store.load();
            });

            //历史报价数据源
            var history_url = $__app__ + '/Team/team_mongo_select';
            var history_field = [];
            var history_store=SUNLINE.GroupingStore(history_url,history_field,{sortInfo:{field:'sct_id',direction: "DESC"}, groupField:'sc_name'},false);


            //景区选择
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
                //scene_store_load();
            });
            var sc_grades_combo=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:90,value:'全部类型'},{'d_type':'景区属性'});
            var scenic_class=SUNLINE.DictComBox({name:'scenic_type',fieldLabel:"",labelWidth:0,allowBlank:false,width:130},{'d_type':'景区类型'});
            var scenic_city=SUNLINE.DictComBox({name:'scenic_city',fieldLabel:"",labelWidth:0,allowBlank:false,width:90,value:'北京市'},{'d_type':'景区城市'});
            var attrView = new Ext.view.View({
                store : scenic_store,
                tpl : attrTpl,
                multiSelect : true,
                simpleSelect : true,
                itemSelector:'div.select-wrap',
                selectedItemCls : 'selected-wrap',
                emptyText : '未找到景区',
                cls:'scroll-cls',
                height:360,
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
                items:scenic_panel/*,
                bbar:new Ext.PagingToolbar({
                    pageSize:50,
                    store:scenic_store,
                    displayInfo:true,
                    displayMsg:' 共{2}条',
                    emptyMsg:'没有价格信息'
                })*/
            });
            /**====start====**/
            var cp_url = $__app__ + '/Scenic/scenic_items_list';
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

            var items_store=Ext.create('Ext.data.Store', {
                storeId: 'scenecStore',
                fields:cp_field,
                data: [],groupField:'sc_name'
            });
            if(typeof ScenicAll=='object' && ScenicAll.scenic_items){
                $.each(ScenicAll.scenic_items,function(i,v){
                    $.each(v,function(si,sv){
                        sv.id='';
                        items_store.add(sv);
                    })
                })
            };

            var scene_cm=[
                { text: '景区名称', dataIndex: 'sc_name', width:150,hidden:true},
                { text: '项目名称', dataIndex: 'sct_name', width:130},
                /*{ text: '票价类型', dataIndex: 'sct_type', width:100},*/
                { text: '价格', dataIndex: 'sct_price_settle', width:80,align:'right',renderer:function(v){
                    return '￥'+ parseFloat(v).toFixed(2);
                }}
            ];
            var grouping_Scene = Ext.create("Ext.grid.feature.Grouping",{
                groupHeaderTpl: "<span class='sc-cls'>{name}  (共 {[values.rows.length]} 项)</span>"
            });
            var all_scene=Ext.create('Ext.grid.Panel', {
                region:'west',
                width:240,
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
                tbar:[
                    '<b style="color:#3892d3">已选择的子项目</b>',
                    '->',
                    {text:'删除所选', iconCls:'button-edit',handler:add_items}
                ]
            });


            function history_fn(v, m, r){
                return '<span data-qtip="' +
                    '<b>交通:</b>'+ r.get('tm_go_traffic')+' -> '+r.get('tm_back_traffic')+'<br>' +
                    '<b>住宿:</b>'+ r.get('tm_hotel_level')+'<br>' +
                    '<b>天数:</b>'+ r.get('tm_day')+'天<br>' +
                    '<b>单位:</b>'+ r.get('tm_agency')+'<br>' +
                    '<b>景区:</b>'+ r.get('scenic_name')+'">'+v+'</span>';
            }

            function history_fn_red(v, m, r){
                return '<span data-qtip="' +
                    '<b>交通:</b>'+ r.get('tm_go_traffic')+' -> '+r.get('tm_back_traffic')+'<br>' +
                    '<b>住宿:</b>'+ r.get('tm_hotel_level')+'<br>' +
                    '<b>天数:</b>'+ r.get('tm_day')+'天<br>' +
                    '<b>单位:</b>'+ r.get('tm_agency')+'<br>' +
                    '<b>景区:</b>'+ r.get('scenic_name')+'" style="color:red"><b>'+v+'</b></span>';
            }

            var history_cm=[
                { text: '产品名称', dataIndex: 'tm_route_title', width:235,renderer:history_fn,hidden:true},
                /*{ text: '票价类型', dataIndex: 'sct_type', width:100},*/
                { text: '编号', dataIndex: 'tm_id', width:50,align:'center',renderer:history_fn},
                { text: '天数', dataIndex: 'tm_day', width:50,align:'center',renderer:history_fn},
                { text: '景区数', dataIndex: 'scenic_num', width:65,align:'center',renderer:history_fn},
                { text: '匹配数', dataIndex: 'sc_innum', width:65,align:'center',renderer:history_fn_red}
            ];

            //票种类型Box
            var histroy_box=SUNLINE.LocalComob({
                id:'histroy_sel',
                fields:['histroy_sel'],
                data:[['相对筛选'],['绝对筛选']],
                config:{
                    id:"histroy_sel_id",
                    value:'绝对筛选',
                    listeners:{
                         select:function(c,r){
                             history_load(scene_store);
                         }
                     }
                }
            });
            var history_scene=Ext.create('Ext.grid.Panel', {
                region:'east',
                store: history_store,
                width:240,
                style:'border-left:2px solid #008DC4',
                columns: history_cm,
                tbar:[
                    '筛选:',
                    histroy_box,
                    '->',
                    {text:'确认所选', handler:affirm_fn}
                ]
            });

            function affirm_fn(v){
                var row=SUNLINE.getSelected(history_scene);
                if(!row){
                    Ext.Msg.alert('友情提示','请选择需要使用团队!');
                    return false;
                }
                window.location.href=$__app__+'/Team/index/type/new/id/'+row.data.tm_number
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

            /**====end====**/
            function dosearch(){
                scenic_select_fn();
            };
            var sct_id=[];
            attrView.on({
                selectionchange:function(t,r,i,e){
                    if(r.length>0){
                        var rw= r[0].data;
                        if(rw.sc_id==0)return false;
                    }
                    //if(r.length<ScenicId.length)return false;
                    scene_store_load();
                }
            });

            function scene_store_load(){
                var row = attrView.getSelectedNodes(), sd_id=[]/*,items_data={},sd_name=[]*/;
                for(var i=0;i<row.length;i++){
                    var r=row[i];
                    sd_id.push(r.id);
                };
                //加截选择景区
                var days_date=$('input[name=team_start_date]');
                SUNLINE.baseParams(scene_store,{sc_id:sd_id.join(','),days_date:days_date.val()});
                scene_store.load();
            }
            history_load(items_store);
            function history_load(t){
                var sd_id=[],sd_name=[];
                items_store.each(function(v){
                    var row= v.data;
                    sd_id.push(row.sc_id);
                    sd_name.push(row.sc_name);
                });
                //加截历史报价
                var histroy_sel=histroy_box.getValue();
                var history_data={sc_id:Ext.encode(sd_id),sc_name:Ext.encode(sd_name)};
                if(histroy_sel)history_data.histroy_sel=histroy_sel;
                SUNLINE.baseParams(history_store,history_data);
                history_store.load();
                is_this.ItemsStoreData(items_store);
            }

            items_store.on({
                update:function(){
                    history_load(this)
                },
                datachanged:function(){
                    history_load(this);
                }
            });

            scene_store.on({
                load:function(){
                    var store_data=[],scene_price_min={};
                    sct_id=[];
                    //得到已经存在的项目
                    var items_scid=[];
                    items_store.each(function(items_v){
                        var row_items=items_v.data;
                        if(in_array(row_items.sc_id,items_scid)==-1 && parseFloat(row_items.sct_price_settle)!=0)items_scid.push(row_items.sc_id);
                        sct_id.push(row_items.sct_id);
                    });
                    //取得景区最小结算价格
                    scene_store.each(function(sv,z){
                        var v_row= sv.data;
                        if(in_array(v_row.sct_id,sct_id)!=-1){
                            store_data.push(sv);
                        }else{
                            if(!scene_price_min[v_row.sc_id] && in_array(v_row.sc_id,items_scid)==-1){
                                scene_price_min[v_row.sc_id]=v_row;
                                store_data.push(sv);
                            }
                        }
                    });

                    //赋值最小结算价格到已选项目中

                    $.each(scene_price_min,function(i,price_v){
                        items_store.add(price_v);
                    });
                    //删除已经移过去的项目
                    for(var i=0;i<store_data.length;i++){
                        scene_store.remove(store_data[i]);
                    }

                    //获取所选择景区
                    var row_scene = attrView.getSelectedNodes(),items_data={};
                    for(var i=0;i<row_scene.length;i++){
                        var r=row_scene[i];
                        items_data[r.id]=({
                            sc_id: r.id,
                            sc_name: r.innerHTML,
                            sc_bintroduction:r.getAttribute('bintroduction'),
                            sct_id: -1,
                            sct_name: "【"+r.innerHTML+"】参观",
                            sct_price_settle: "0",
                            sct_scenic: r.id,
                            sct_type: "成人票"
                        });
                    };

                    //获取有没有重的项目
                    items_store.each(function(iv,ii){
                        var row=iv.data;
                        var items_row=items_data[row.sc_id];
                        if(items_row && items_row.sct_id==-1){
                            items_data[row.sc_id]='';
                        }
                    });
                    //将值赋值到
                    $.each(items_data,function(di,dv){
                        if(!dv.sc_id)return true;
                        items_store.add(dv);
                    });
                    items_store.each(function(v,i){
                        sct_id.push(v.data.sct_id);
                    });

                }
            });
            scenic_class.box.store.on({
                load:function(){
                    this.add({d_id:'',d_text:'全部属性'});
                }
            });
            //选择景区类型时
            sc_grades_combo.box.on({
                select:function(c,r,e){
                    /*var row=r[0].data;
                    SUNLINE.baseParams(scenic_store,{sc_type:row.d_text,start:0,limit:50});
                    scenic_store.load();*/
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

            function scenic_select_fn(){
                var where_data={start:0,limit:50};

                var city_val=scenic_city.box.getValue();
                if(city_val)where_data['sc_city']=city_val;

                var sc_class_val=scenic_class.box.getValue();
                if(sc_class_val && sc_class_val!='全部属性')where_data['attribute']=sc_class_val;

                var grades_val=sc_grades_combo.box.getValue();
                if(grades_val)where_data['sc_type']=grades_val;

                var skey=Ext.getCmp('search').getValue();
                if(skey)where_data['skey']=skey;

                SUNLINE.baseParams(scenic_store,where_data);
                scenic_store.load();
            }

            var scenic_itmes=Ext.create('Ext.panel.Panel', {
                region:'center',
                layout :'border',
                items:[all_scene,select_scene,history_scene]
            });
            var attrWin = new Ext.Window({
                title : '选择游玩景区',
                width : 1100,
                height : 520,
                modal : true,
                fixed:true,
                resizable:false,
                layout :'border',
                maximizable:true,
                cls : 'suntour_dataView',
                closeAction : 'hide',
                autoScroll : true,
                items: [scenic_box,scenic_itmes],
                buttons:[
                    {text:'保存',handler:function(){
                        scenic_data_fn(items_store.data);
                    }},
                    {text:'关闭', handler:function () {
                        attrWin.hide();
                    }}
                ]
            });

            function scenic_data_fn(row){
                Ext.MessageBox.confirm('友情提示!','确认所选择景区!',function(y){
                    if(y!='yes')return false;
                    var scenic_val={},scenic_items={};
                    for(var i=0;i<row.length;i++){
                        var r=row.items[i].data;
                        scenic_val[r.sc_id]={
                            sc_id:r.sc_id,
                            sc_bintroduction: r.sc_bintroduction,
                            sc_name: r.sc_name
                        }
                        if(!scenic_items[r.sc_id])scenic_items[r.sc_id]=[];
                        scenic_items[r.sc_id].push(r);
                    }
                    ScenicAll.scenic=scenic_val;
                    ScenicAll.scenic_items=scenic_items;
                    attrWin.hide();
                    scenic_html_fn();
                });
            }
            if(typeof ScenicAll.scenic=='object') scenic_html_fn();
            function scenic_html_fn(){
                var scenic_html='';
                $.each(ScenicAll.scenic,function(i,v){
                    scenic_html+='<em class="tsc-list" data-id="'+ v.sc_id+'">'+ v.sc_name+'</em>'
                })
                if(scenic_html)scenic_html='已选备用景区：'+scenic_html;
                $('.team-scenic').html(scenic_html);
            }
            var scenic_select=$('.scenic-select');
            scenic_select.click(function(){
                attrWin.show();
                SUNLINE.baseParams(scenic_store,{sc_type:'全部类型',sc_city:'北京市',start:0,limit:500});
                scenic_store.load();
            });
        }
    };
    TeamTo.construct();

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
            start_map:data.sp_map?data.sp_map:'',
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
    }
});
