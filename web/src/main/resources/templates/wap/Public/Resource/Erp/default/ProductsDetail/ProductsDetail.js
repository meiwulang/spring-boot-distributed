var PicStore=[{img_id:'products',img_name:'产品相册'}];
var PicStoreData={};
var product_type='';
var eu_rows={};
var detail_ue_rows={};
var selected={};
var p_cb_id = 0; //品牌ID
var p_cb_name; //品牌名称
var st_id={};
var p_by_station;
//window.scenic_data = []; //监听景点

Ext.onReady(function(){
    if(type){
        $('.supp-route').show();
        product_type=type;
    }
    var org_id=_uinfo.org_id;
    var par_id;
    var url=$__app__ + '/Pic/product_load_data';
    var field = [];
    var pic_store = new SUNLINE.JsonStore(url, field,false,{pageSize:15});
    var imageTpl = new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="thumb-wrap scenic-cls">',
        '<i class="fa fa-check-circle"></i><img src="{at_url}?x-oss-process=image/resize,m_fill,h_110,w_150" /><span class="scenic-txt">{at_name}</span>',

        '</div>',
        '</tpl>'
    );
    var pic_view=Ext.create('Ext.view.View', {
        store: pic_store,
        tpl: imageTpl,
        simpleSelect:true,
        multiSelect :true,
        overClass:'header-view-over',
        selectedClass:'header-view-selected',
        itemSelector:'div.thumb-wrap',
        emptyText: '没有图片信息'
    });


    var combox_sc=SUNLINE.ComBoxPlus({

        id:'combox_sc',
        fields:['img_id','img_name'],url:$__app__ + '/Pic/product_pic',
        config:{
            displayField:'img_name',
            valueField:'img_id',
            width:360,
            fieldLabel:'选择图片类型'

        }
    });
    var pic_panel=Ext.create('Ext.panel.Panel',{
        height:430,
        tbar:[

            combox_sc,

             '->','快速搜索：',
             {
             xtype:'trigger',
             triggerCls : 'x-form-search-trigger',
             id:'Search_key',
             emptyText : '图片名称',
             width:280,
             onTriggerClick:function(e){
             _Search();
             },
             listeners :{
             "specialkey" : function(_t, _e){
             if (_e.keyCode==13)
             _Search();
             }
             }
             }
        ],
        items:[pic_view],
        bbar:new Ext.PagingToolbar({
            pageSize:15,
            store:pic_store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有产品信息'
        })
    });
    function _Search(){
        if(combox_sc.getValue()=='----请选择资源----'){
            Ext.Msg.alert('友情提示','请选择资源类型进行搜索');
            return false;
        }
       // combox_sc.setValue('全部');
        var skey=Ext.getCmp('Search_key').getValue();
        resource_id= selected.get('img_id');
        resource_type=  selected.get('img_type');
        resource_name=selected.get('img_name');
        if(resource_name=='全部'){
            resource_name='';
            resource_id='';
        }
        SUNLINE.baseParams(pic_store,{'at_org_id':org_id,'at_name':skey,'at_table_id':resource_id,'at_table':resource_type});


        pic_store.currentPage=1;
        pic_store.load();

    }
    var pic_win=Ext.create('Ext.window.Window',{
        title : '添加行程图片',
        width : 830,
        height:520,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        padding:6,
        resizable:false,
        fixed:true,
        modal:true,
        items:[pic_panel],
        buttons: [
            {text : '保存',handler:add_img},
            {text : '上传图片',handler:img_upload},
            {text : '关闭', handler:function(){pic_win.hide();}}
        ]
    });
    pic_win.on('show',function(){
        //获取酒店、景区、产品标示
        var source_id=par_id.find('input[name=source_id]').val();
        var home_id=par_id.find('input[name=home_id]').val();
        var days=par_id.attr('data-day');
        var source_name=Ext.getCmp('source-'+days+'_id').getValue();
        var hotel=Ext.getCmp('source--'+days+'_id').getValue();
        var pd_version=$('input[name=pd_version]').val();
        //PicStoreData={scenic:source_id,products:pd_version,hotel:home_id};
        SUNLINE.baseParams(pic_store,{at_org_id:org_id});
        pic_store.currentPage=1;
        pic_store.load();
        SUNLINE.baseParams(combox_sc.store,{
            source_id:source_id,
            home_id:home_id,
            days:days,
            source_name:Ext.encode(source_name),
            hotel:Ext.encode(hotel),
            pd_version:pd_version
        });
        combox_sc.store.load();
    });

    /*combox_sc.on({
        collapse:function(){
            var source_id=par_id.find('input[name=source_id]').val();
            var home_id=par_id.find('input[name=home_id]').val();
            var days=par_id.attr('data-day');
            var source_name=Ext.getCmp('source-'+days+'_id').getValue();
            var hotel=Ext.getCmp('source--'+days+'_id').getValue();

            //相册图片,当天选择景区、酒店、产品图片
            if(source_name){
                source_id=source_id.split(',');
                var source_data=[{img_id:'all',img_name:'全部'},{img_id:'products',img_name:'产品相册'}];
                $.each(source_name,function(i,v){
                    source_data[i+2]={
                        img_id:source_id[i],
                        img_name:source_name[i]
                    }
                });
                combox_sc.getStore().removeAll();
                $.each(source_data,function(vi,vv){
                    combox_sc.getStore().add(vv);
                });
            };
            if(hotel){
                home_id=home_id.split(',');
            }

        }
    });*/
    combox_sc.on('select',function(c,r){
        var row= r[0];
        var img_id=row.get('img_id');
        selected=row;

        var source_id=par_id.find('input[name=source_id]').val();
        if(img_id==0){
            SUNLINE.baseParams(pic_store,{at_org_id:org_id,type:row.get('img_type')});
            pic_store.currentPage=1;
        }else if(img_id<0){
            SUNLINE.baseParams(pic_store,{at_org_id:org_id});
            pic_store.currentPage=1;
        }else{
            SUNLINE.baseParams(pic_store,{at_org_id:org_id,at_table_id:row.get('img_id')});
            pic_store.currentPage=1;
        }


        /*if(img_id=='products'){
            SUNLINE.baseParams(pic_store,{type:img_id});
        }else if(img_id=='all'){
            var pd_version=$('input[name=pd_version]').val();
            SUNLINE.baseParams(pic_store,{at_id:source_id,pd_id:pd_version});
        }else{

        }*/
        pic_store.reload();
    });
    function add_img(b){
        var pic_id=par_id.find('.prd_info').find('.pic');
        var pic_length=0;
        if(pic_id.html())pic_length=pic_id.find('.list-pic').length;
        var row=pic_view.getSelectionModel().getSelection();
        if((row.length+pic_length)>4){
            Ext.Msg.alert('友情提示','每天只可以上传4张图片,请重新选择!');
            return false;
        }
        var str_img='';
        $.each(row,function(i,v){
            var r= v.data;
            str_img+='<div class="list-pic"><i class="fa fa-times-circle"></i><img src="'+r.at_url+'"></div>';
        })
        pic_id.prepend(str_img);
        pic_win.hide();
        pic_store.reload();
        remove_pic();
    }

    function remove_pic(){
        var fa=$('.fa-times-circle');
        fa.unbind();
        fa.click(function(){
            var this_id=$(this).parents('.list-pic');
            this_id.remove();
        });
    };





    /******************** 相册  start ***************************/
    var upload_win=new Ext.Window({
        title:'上传图片',
        width:650,
        height:400,
        closeAction:'hide',
        fixed:true,
        modal:true,
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>',
        buttons:[
            {text:'确定添加到相册',handler:add_load}
        ]
    });
    /******************** 相册  end ***************************/
    function img_upload(){
        if(combox_sc.getValue()=='----请选择资源----'){
            Ext.Msg.alert('友情提示','请选择资源类型进行上传');
            return false;
        }
        upload_win.show();

        var resource_id=selected.get('img_id');
        var resource_type=selected.get('img_type');
        var resource_name=selected.get('img_name');
        if(resource_type=='hotel'){
            resource_type='酒店';

        }else if(resource_type=='scenic'){
            resource_type='景点';
        }else if (resource_type=='products'){
            resource_type='产品';
        }
        upload_win.setTitle('您正在<font color="red">【'+resource_name+'】</font>上传图片！');




        window.pic_iframe.location=$__app__+'/Pic/index/table_model/'+resource_type+'/table_id/'+resource_id;

    };
    function add_load(){
        var resource_key=selected.get('img_id');
        var resource_type=selected.get('img_type');
        if(resource_type=='全部'){
            resource_type='';
        }

        SUNLINE.baseParams(pic_store,{'at_org_id':org_id,'at_table_id':resource_key,'at_table':resource_type});
        pic_store.currentPage=1;
        pic_store.load();
        upload_win.hide();

    };


    var ProductsPanel= {
        /**
         * 初始化方法
         * @param pid
         */
        construction:function(pid){
            var panel_id=this;
            var visa_id=$('#visa-id');
            if(product_class==20){
                visa_id.show();
            }else{
                visa_id.hide();
            }
            if(pid){
                this.load_ajax({id:pid,pd_id:pd_id},function(data){
                    if(data.p_type=='20'){
                        visa_id.show();
                    }
                    panel_id.before_index(data,'ajax');
                    panel_id.save_product();
                    panel_id.EditorView();
                    panel_id.uploadify();
                });
            }else{
                panel_id.before_index();
                panel_id.save_product();
                this.EditorView();
                this.uploadify();
            };
            this.WindowCls();
        },
        /**
         * 如果存在产品ID这里会加载(编辑？)
         * @param opt
         * @param obj
         */
        load_ajax:function(opt,obj){
            var is_this=this;
            $.ajax({
                type:"POST",
                url:$__app__ + "/Products/find_data_json",
                data:{id:opt.id,pd_id:opt.pd_id},
                async : false,
                success:function (row) {
                    var data=row.info;
                    p_by_station=data.p_by_station;
                    p_cb_id   = data.p_cb_id;
                    p_cb_name = data.p_cb_name;
                    var form_id=$('.form-id');
                    var eu_id=['feature','cost_in','cost_noin','notice','visa'/*'correctly','passed'*/];
                    $.each(form_id,function(i,v){
                        var ind=form_id.eq(i);
                        var name_val=ind.attr('name');
                        if((name_val=='pd_id' || name_val=='p_id') && copy=='true')return true;
                        if(name_val=='p_pid'){
                            ind.val(data.pd_id);
                            return true;
                        }
                        var row_val=data[name_val];
                        if(in_array(name_val,eu_id)!=-1){
                            row_val=data['pd_content'][name_val];
                        }
                        if(row_val)ind.val(row_val);
                    });
                    is_this.DistinctType(data.p_type);
                    //$('.cover-img').html('<img src="'+data.p_cover+'?x-oss-process=image/resize,m_mfit,h_250,w_350"/>');
                    if(obj)obj(data);
                }
            });
        },
        /**
         * 判断是否在对应数组内
         * @param str 指定字符串
         * @param arr 指定数组
         * @returns {boolean}
         */
        in_array:function(str,arr){
            var bool=false;
            $.each(arr,function(i,v){
                if(str==v){
                    bool=true;
                    return false;
                }
            });
            return bool;
        },
        before_index:function(data,type){
            var panel_id=this;
            var p_type='',pd_content='',p_destination_city = [];
            if(typeof(data)=='object'){
                p_type=data.p_type;
                pd_content=data.pd_content;
                p_destination_city=data.p_destination_city;
                if(p_destination_city)p_destination_city=p_destination_city.split(',');
            };

            var product_type_data = [];
            var p_type_txt = '';
            var p_type_id = $('input[name=p_type]');
            if( !p_type_id.val() ){
                p_type_id.val(10);
            }
            if (product_class > 0) p_type_id.val(product_class);
            var product_type_cls = p_type_id.val();
            for (var pi = 0; pi < ProductType.length; pi++) {
                if (ProductType[pi].id != 0) {
                    product_type_data.push(ProductType[pi]);
                }
                if (ProductType[pi].id == product_type_cls && product_type_cls != 0) {
                    if(btn_type=='编辑'){
                        p_type_txt = ProductType[pi].text;
                    }else if(btn_type == '添加'){
                        p_type_txt='';
                    }
                }
            }

            var pt_config = {
                fieldLabel: '',
                editable: false,
                valueField: 'id',
                displayField: 'text',
                id: 'product_type',
                name: 'product_type',
                labelHidden: true,
                width: 430,
                renderTo: 'p_type',
                value: p_type_txt
            };
            var ProductType_box = SUNLINE.LocalComob({
                id: 'product_type',
                fields: ['text', 'id'],
                data: product_type_data,
                config: pt_config
            });

            var p_num = $('input[name=p_num]').val(); //产品编号 有编号则编辑，没有则是新增或复制
            if (ProductType_box.getValue() && p_num && copy != 'true') {
                ProductType_box.setReadOnly(true);
            }
            ProductType_box.on({
                select:function(e,rv){

                    var row=rv[0].data;
                    panel_id.DistinctType(row.text);
                    p_type_id.val(row.id);
                    //判断线路类型是否修改，修改则同步修改目的地景点类型
                    // if( scenic_data.length > 0 ){
                    //     Ext.each(scenic_data, function(n, i){
                    //         SUNLINE.baseParams(n.getStore(), {d_type:'游玩景点', p_type: row.id})
                    //         n.getStore().currentPage=1;
                    //         n.getStore().reload();
                    //         n.setValue(''); //清空‘目的地景点’原先的值
                    //     });
                    // }
                }
            });

           var brand_box = SUNLINE.ComBoxPlus({
                id: 'p_cb_name',
                name: 'p_cb_name',
                fields: ['cb_id', 'cb_name'],
                url: $__app__ + '/Brand/getBrand',
                where: {},
                config: {
                    displayField: 'cb_name',
                    emptyText: '请选择',
                    valueField: 'cb_id',
                    width: 340,
                    value: p_cb_name,
                    pageSize: 20,
                    fieldLabel: '',
                    labelWidth: 60,
                    labelAlign: 'right',
                    padding: '0 0 0 0',
                    renderTo: 'company_brand_id',
                }
            });
            brand_box.on('focus', function (c, r) {
                var list_store = brand_box.getStore();
                SUNLINE.baseParams(list_store, {});
                list_store.currentPage = 1;
                list_store.load();
            });
            brand_box.on('select',function(c,r){
                var row = r[0];
                p_cb_id = row.get('cb_id');
            });


            /*var site_data=[
                {id:'p_type',
                    fields:['d_id','d_text','d_type','d_extend'],url:$__app__+'/Dict/dict_json',
                    where:{d_type:'产品类型'},
                    config:{renderTo:'p_type',displayField:'d_text',valueField:'d_text',value:p_type,width:430}
                }
            ];
            $.each(site_data,function(i,v){
                var com_id=SUNLINE.ComBoxPlus(v);
                com_id.on({
                    select:function(e,rv){
                        var row=rv[0].data;
                        panel_id.DistinctType(row.d_text);
                    }
                });
            });*/
            /*var crowd_data = [
                {id:'p_destination_city',
                    fields:['d_id','d_text','d_type'],url:$__app__+'/Dict/dict_json',
                    where:{d_type:'目的地'},
                    type:'Tag',
                    config:{renderTo:'p_destination_city',displayField:'d_text',valueField:'d_text',value:p_destination_city,width:430}
                }
            ];
            $.each(crowd_data,function(i,v){
                var crowd_id = SUNLINE.ComBoxPlus(v);
            });*/

            /*var out_arr=['feature','cost_in','cost_noin','notice','correctly','passed'];
            $.each(out_arr,function(i,v){
                var detail_val='';
                if(pd_content)detail_val=pd_content[v]
                Ext.create('Ext.form.HtmlEditor', {
                    width: 800,
                    height: 200,
                    id:v+'_id',
                    renderTo:v,
                    value:detail_val
                });
            });*/
            if(this.BcProducts(data)){
                $('.yun-title-left').tabs({
                    t_hover:".ytl-txt",
                    t_event:"click",
                    t_move_add:[
                        [".ytl_list", "ytl_hover"],
                        [".product_list", "p_hover"],
                        [".ytl_set","set_route"]
                    ]
                },function(n,i,c){
                    if(i.html()=='行程信息'){
                        if(type=='ajax'){//当进入产品编辑的时候
                            panel_id.empty_detail(pd_content);
                        }else {
                            panel_id.empty_detail(pd_content,'skip');
                        }
                    }
                    if(i.html()=='扩展配置'){
                        $.ajax({
                            type:"POST",
                            url:$__app__ + "/ProductsDetail/marketStatus",
                            success:function (row) {
                                if(row.code==300 || row.code==400){
                                    $('#by-station').hide();
                                    $('.ytl_set').show();
                                    $('#msg').html("<span style='font-size: 8px;color: red;display: inline-block;width: 340px'>"+row.message+"</span><a href='"+row.url+"' style='margin-right:10px;width:50px;float:right;display:left;padding:3px;border-radius:3px ;cursor:pointer;background-color: #2288e3;color:white' target='_blank'><span style='padding: 10px'>购买</span></a>");
                                }else if(row.code==200 && row.message=='已购买'){
                                    $('.ytl_set').show();
                                    //$('#msg').html("<span><img src="+row.data[0].app_logo+"></span>");
                                    $('#msg').html("<span style='padding-left: 10px;'>应用有效期至 "+row.data[0].app_end_time+"</span>");
                                    $("#msg").css("padding-left","150px");
                                    $("#msg").css("font-size","8px");
                                    $("#msg").css("color","gray");
                                }
                            }
                        });
                    }else {
                        $('.ytl_set').hide();
                    }
                });
                if(pd_id){
                    $('input[name=pd_id]').val(pd_id);
                }
                if(copy){
                    $('input[name=p_num]').val('');
                    $('input[name=p_id]').val('');
                    $('input[name=p_name]').val('');
                }
            };
            if(data && product_type)panel_id.empty_detail(pd_content);
        },
        BcProducts:function(data){
            var upload_file=$('#upload_file');
            var readonly_true=['p_num','p_name','p_name_short','p_series','p_crowd_id','p_days'];
            var p_num=$('#p_num');
            if(type){
                var ytl_list=$('.ytl_list');
                var product_list=$('.product_list');
                ytl_list.removeClass('ytl_hover');
                ytl_list.eq(1).addClass('ytl_hover');
                product_list.removeClass('p_hover');
                product_list.eq(1).addClass('p_hover');
                /*ytl_list.eq(0).click(function(){
                    Ext.Msg.alert('友情提示','补充行程只能编辑行程信息!');
                });*/
                var pdID = $('input[name=pd_id]');
                if(!pd_id){
                    pdID.val('');
                }else{
                    var startDate = $('input[name=pd_start_date]');
                    var endDate = $('input[name=pd_end_date]');
                    startDate.val(data.pd_start_date);
                    endDate.val(data.pd_end_date);
                }
                upload_file.hide();
                for(var ri=0;ri<readonly_true.length;ri++){
                    $('input[name='+readonly_true[ri]+']').attr('readonly',true);
                }
                return true;
            }else{
                upload_file.show();
                for(var ri=0;ri<readonly_true.length;ri++){
                    $('input[name='+readonly_true[ri]+']').attr('readonly',false);
                }
                return true;
            }

        },
        /*行程说明*/
        /*重载行程信息*/
        empty_detail:function(is_this,type){
            var panel_id=this;
            var p_days=parseFloat($('input[name=p_days]').val());
            var p_info=$('.p-info-box');
            var p_info_num=p_info.length;
            var p_num=p_days-p_info_num;
            var prd_days=$('.prd-days');
            var detail=[];
            if(is_this)detail=is_this.stroke;
            if(p_num>0){
                for(var i=0;i<p_num;i++){
                    var pr={};
                    var d_val=detail[i];
                    if(typeof(d_val)=='object' && type!='skip'){
                        if(!d_val.food_text)d_val.food_text='';
                        pr={title:d_val.title,home:d_val.home,source:d_val.source,source_id:d_val.source_id,detail:d_val.detail,hotel:d_val.hotel,home_id:d_val.home_id,
                            food:d_val.food,food_text:d_val.food_text,pic_img:d_val.pic_img,source_text:d_val.source_text};
                    }else{
                        pr={title:'出发地-目的地',home:'',source:'',detail:'',food:'',food_text:'',source_id:'',pic_img:'',home_id:'',hotel:'',source_text:''};
                    };
                    pr.days=p_info_num+(i+1);
                    var html=panel_id.prh_tpl(pr);
                    prd_days.append(html);
                };
            }else if(p_num<0){
                for(var i=0;i<(0-p_num);i++){
                    p_info.eq(p_info_num-(i+1)).remove();
                }
            };
            panel_id.select_traffic_fn();
            panel_id.source_com_box(detail);
            panel_id.save_product();
            panel_id.ImgClick();
            panel_id.ClickStatus();
            remove_pic();
        },
        prh_for:function(data){
            var tpl='',panel_id=this;
            $.each(data,function(i,v){
                v.days=(i+1);
                tpl+=panel_id.prh_tpl(v);
            });
            $('.prd-days').html(tpl);
        },
        prh_tpl:function(data){
            var food_data=['早餐','中餐','晚餐'];
            var food_tpl='';
            var food_arr=[],panel_id=this;
            if(data.food)food_arr=data.food;
            $.each(food_data,function(i,v){
                var checked_zt='';
                if(data.food)if(panel_id.in_array(v,food_arr)) checked_zt='checked="true"'
                food_tpl+='<label><input type="checkbox" name="food" value="'+v+'" '+checked_zt+'>'+v+'</label>';
            });
            var source_id=data.source_id?data.source_id:'';
            //图片信息
            var pic_div='';
            if(data.pic_img){
                $.each(data.pic_img,function(ii,vv){
                    pic_div+='<div class="list-pic"><i class="fa fa-times-circle"></i><img src="'+vv+'"></div>';
                });
            };
            if(!data.source_text)data.source_text='';
            var tpl='<div class="p-info-box" data-day="'+data.days+'">' +
                '<div class="days-cls">第'+data.days+'天<i class="delta-cls"></i></div>' +
                '<div class="days-icon">'+data.days+'D<i class="delta-cls"></i></div>' +
                '<div class="prd_info">' +
                '<ul>' +
                '<li class="prd-list prd-title">' +
                '<span class="pic-icon"><i class="fa fa-picture-o"></i>添加图片</span>' +
                '<input type="text" value="'+data.title+'" name="title" class="input-cls from-detail-id">' +
                '<span class="traffic-icon">' +
                '<i class="fa fa-car" data-val="car" title="插入专车"></i>' +
                '<i class="fa fa-ship" data-val="ship" title="插入船"></i>' +
                '<i class="fa fa-subway" data-val="subway" title="插入火车"></i>' +
                '<i class="fa fa-train" data-val="train" title="插入高铁"></i>' +
                '<i class="fa fa-plane" data-val="plane" title="插入飞机"></i>' +
                '<i class="fa fa-bus" data-val="bus" title="插入汽车"></i>' +
                '</span>' +
                '</li>' +
                '<li class="prd-list prd-fd">' +
                '<span class="fh-food">' +
                '<em class="it-title">用餐情况:</em>' +food_tpl+
                '<input type="text" class="input-cls food_text" name="food_text" value="'+data.food_text+'"></span></li>' +
                '<li class="prd-list prd-fh">' +
                '<span class="fh-home">' +
                '<em class="it-title  ee-em">住宿情况:</em><span class="ee-span" id="source--'+data.days+'"><content>'+data.hotel+'</content></span>' +
                '<input type="hidden" name="home_id" class="input-cls source_idd_'+data.days+'" value="'+data.home_id+'">' +
                '<input type="text" name="home" class="input-cls from-detail-id  ee-input" value="'+data.home+'">' +
                '</span><span class="ee-span2">同步</span></li>' +
                '<li class="prd-list prd-scenic">' +
                '<em class="it-title">游玩景点:</em><span id="source-'+data.days+'"><content>'+data.source+'</content></span>' +
                '<input type="hidden" name="source_id" class="input-cls source_id_'+data.days+'" value="'+source_id+'">' +
                '</li>' +
                '<li class="prd-list scenic-text">' +
                '<em class="it-title">简易行程:</em><textarea name="sketch_text" class="input-cls sketch_text">'+data.source_text+'</textarea><br />' +
                '<span class="sketch-msg">* 简易行程供出团计划单和确认单使用，请正确填写服务项目及服务时间，以符合业务要求。 </span>' +
                '</li>' +
                '<li class="prd-list info">' +
                /*'<span id="detail-'+data.days+'" class="detail-cls"><content>'+data.detail+'</content></span>' +*/
                '<textarea id="detail-'+data.days+'" name="detail-'+data.days+'" class="detail-cls">'+data.detail+'</textarea>' +
                '</li>' +
                '<li class="prd-list pic">'+pic_div+'<div class="clear"></div></li>' +
                '</ul></div></div>';
            return tpl;
        },
        select_traffic_fn:function(){
            var traffic=$('.traffic-icon').find('.fa');
            traffic.unbind();
            traffic.click(function(){
                var is_this=$(this);
                var title_id=is_this.parents('.prd-list').find('input[name=title]');
                title_id.insertAtCaret('[@'+is_this.attr('data-val')+']')
            })
        },
        source_com_box:function(data){
            //var p_type = $('input[name=p_type]').val();//线路类型（第一次加载时）
            var len=$('.p-info-box').length,is_this=this;
            setTimeout(function(){
                var editor_data=is_this.EditorData();
                for(var i=1;i<=len;i++){
                    // 景区景点操作
                    if($('#source-'+i+'_id').html())continue;
                    if($('#source--'+i+'_id').html())continue;
                    var source_id=$('#source-'+i).find('content');
                    var home_id=$('#source--'+i).find('content');
                    var source_val=source_id.html();
                    var home_val=home_id.html();
                    if(source_val)source_val=(source_val.replace(' ',source_val)).split(',');
                    if(home_val)home_val=(home_val.replace(' ',home_val)).split(',');
                    SUNLINE.ComBoxPlus({
                        id:'source--'+i,
                        fields:['ht_id','ht_name'],url:$__app__+'/Dict/dict_json',
                        where:{d_type:'酒店住宿'},
                        config:{
                            renderTo:'source--'+i,
                            displayField:'ht_name',
                            valueField:'ht_name',
                            width:400,
                            multiSelect: true,
                            value:home_val,
                            tpl:Ext.create('Ext.XTemplate',
                                '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item"><span class="list-right">{ht_province}-{ht_city}-{ht_county}</span>{ht_name}</li>',
                                '</tpl></ul>'
                            ),
                            pageSize:20
                        },type:'Tag'
                    });

                    var com_pls = SUNLINE.ComBoxPlus({
                        id:'source-'+i,
                        fields:['sc_id','sc_name'],
                        url:$__app__+'/ProductsDetail/getScenicList',
                        //url: $__app__+'/Dict/dict_json',
                        where:{d_type:'游玩景点'},
                        config:{
                            renderTo:'source-'+i,
                            displayField:'sc_name',
                            valueField:'sc_name',
                            width:730,
                            tpl:Ext.create('Ext.XTemplate',
                                '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item"><span style="{scan_style}">{sc_province}-{sc_city}-{sc_county}</span>{sc_name}</li>',
                                '</tpl></ul>'
                            ),
                            multiSelect: true,
                            value:source_val,
                            pageSize:20,
                        },type:'Tag'
                    });
                    //scenic_data.push(com_pls);
                    source_id.remove();
                    home_id.remove();

                    //判断最后一次删除景点，清除隐藏域中最后一个值
                    Ext.getCmp('source-'+i+'_id').on('change', function(_this, newValue, oldValue){
                        var id=_this.getId();
                        id=id.split('-');
                        id=id[1].split('_');
                        id=id[0];
                        if( !newValue ){
                            $('.source_id_'+id).val('');
                        }
                    });

                    Ext.getCmp('source-'+i+'_id').on('select',function(c,r,e){
                        var id=c.getId();
                        id=id.split('-');
                        id=id[1].split('_');
                        id=id[0];
                        var str='', str_name='';

                        Ext.each(r,function(v,i){
                            var row=v.data;
                            if(str){
                                str+=','+row.sc_id;
                                str_name+=';'+row.sc_name;
                            }else{
                                str+=row.sc_id;
                                str_name=row.sc_name;
                            }
                        });
                        var sid=$('.source_id_'+id);
                        var days_id=sid.parents('.prd_info');
                        var sketch_text=days_id.find('.sketch_text');
                        sketch_text.val(str_name);
                        sid.val(str);
                    });

                    Ext.getCmp('source--'+i+'_id').on('select',function(c,r,e){
                        var id=c.getId();id=id.split('--');id=id[1].split('_');id=id[0];
                        var str='';
                        Ext.each(r,function(v,i){
                            var row=v.data;
                            if(str){
                                str+=','+row.ht_id;
                            }else{
                                str=row.ht_id;
                            }
                        });
                        $('.source_idd_'+id).val(str);
                        var sss='.source_idd_';
                    });
                    // 行程内容操作
                    var detail_id='detail-'+i;
                    detail_ue_rows[detail_id]=UE.getEditor(detail_id,editor_data);
                    /*var detail_id=$('#detail-'+i).find('content');
                     Ext.create('Ext.form.HtmlEditor', {
                     width: 800,
                     height: 200,
                     id:'detail-'+i+'_id',
                     renderTo: 'detail-'+i,
                     value:detail_id.html()
                     });
                     detail_id.remove();*/
                }
            },100);
        },
        base_product:function(){
            var form_id=$('.form-id');
            var form_data={};
            var is_this=this,post_f=[];

            $.each(form_id,function(i,v){
                var f_id=form_id.eq(i);
                var f_name=f_id.attr('name');
                if(!f_name)return true;
                if(eu_rows[f_name]){
                    form_data[f_name]=eu_rows[f_name].getContent();
                }else{
                    form_data[f_name] = f_id.val();
                }
            });

            //记录品牌信息
            //var cb_id = Number(Ext.getCmp('p_cb_name_id').getValue());
            if( p_cb_id ){
                form_data['p_cb_id'] = p_cb_id;
            }
            //顺路站信息记录
            if(st_id){
                 p_by_station=JSON.stringify(station.getValue());
                form_data['p_by_station']= p_by_station;
            }

            var combox_data=[/*'p_destination_city','feature','cost_in','cost_noin','notice','correctly','passed',*/'pd_start_date','pd_end_date'];
            $.each(combox_data,function(i,v){
                if(is_this.in_array(v,['pd_start_date','pd_end_date']) && type=='true'){
                    form_data[v]=Ext.Date.format(Ext.getCmp(v+'_id').getValue(),'Ymd');
                }else if(is_this.in_array(v,['p_crowd'])){
                    var val =  Ext.getCmp(v+'_id').getValue();
                    form_data[v] = val.join(",");
                }else{
                    form_data[v]=Ext.getCmp(v+'_id').getValue();
                }
            });
            return form_data;
        },
        ClickStatus:function(){
            var check_id=$('input[type=checkbox]');
            check_id.unbind();
            check_id.click(function(){
                if($(this).attr('checked')=='checked'){
                    $(this).attr('checked',false);
                }else{
                    $(this).attr('checked',true);
                }
            });
        },
        /**
         * 行程说明信息
         */
        delail_product:function(){
            var info_id=$('.p-info-box');
            var info_data=[];
            $.each(info_id,function(i,v){
                var days_id=info_id.eq(i);
                var detail_id=days_id.find('.from-detail-id');
                //获取用餐情况
                var food_id=days_id.find('input[name=food]');
                var food_data=[],ii=0;
                $.each(food_id,function(i,v){
                    var f_id=food_id.eq(i);
                    if(f_id.attr('checked')=='checked'){
                        food_data[ii]=f_id.val();
                        ii++;
                    }
                });
                //获取图片信息
                var pic_data=[];
                var pic_id=days_id.find('.pic .list-pic');
                if(pic_id.length){
                    $.each(pic_id,function(i,v){
                        pic_data[i]=pic_id.eq(i).find('img').attr('src');
                    })
                };
                info_data[i]={
                    title:days_id.find('input[name=title]').val(),
                    home:days_id.find('input[name=home]').val(),
                    source:Ext.getCmp('source-'+(i+1)+'_id').getValue(),
                    source_text:days_id.find('textarea[name=sketch_text]').val(),
                    hotel:Ext.getCmp('source--'+(i+1)+'_id').getValue(),
                    source_id:$('.source_id_'+(i+1)).val(),
                    home_id:$('.source_idd_'+(i+1)).val(),
                    /*detail:Ext.getCmp('detail-'+(i+1)+'_id').getValue(),*/
                    detail:detail_ue_rows['detail-'+(i+1)].getContent(),
                    food:food_data,
                    food_text:days_id.find('input[name=food_text]').val(),
                    pic_img:pic_data
                }
            });
            var detail_data={};
            detail_data['stroke']=info_data;
            return detail_data;
        },


        /**
         * 产品信息保存
         */
        save_product:function(){
            var save_id=$('.save-id'),panel_id=this;
            save_id.unbind();
            save_id.click(function(){
                var ytl_hover=$('.ytl_hover').find('.ytl-txt');
                var form_data={};
                form_data=panel_id.base_product();
                form_data['delail']=Ext.encode(panel_id.delail_product());
                //如果产品线路类型不存在，则默认显示周边短线（10）
                form_data.p_type = !form_data.p_type ? 10 : form_data.p_type;

                if(form_data.p_num == ''){
                    Ext.Msg.alert('温馨提示','产品编号不能为空哦！');
                    return false;
                }else{
                    var numStatus = onlyNumAlpha();
                    if( numStatus === false ){
                        $("#p_num").focus();
                        Ext.Msg.alert('温馨提示','产品编号只能输入字母、数字！');
                        return false;
                    }
                }
                if(form_data.p_name ==''){
                    Ext.Msg.alert('温馨提示','产品名称不能为空！');
                    return false;
                }
                if(form_data.p_series == ''){
                    Ext.Msg.alert('温馨提示','产品系列不能为空哦！');
                    return false;
                }
                if(form_data.p_days == ''){
                    Ext.Msg.alert('温馨提示','行程天数不能为空哦！');
                    return false;
                }
                //addType是判断线路编辑入口从哪里进来的，1-线路新增或编辑，0是补充行程新增或编辑
                if ( addType && form_data.p_cover == '') {
                    Ext.Msg.alert('温馨提示', '产品封面图不能为空哦！');
                    return false;
                }
                $.ajax({
                    type:"POST",
                    url:$__app__ + "/Products/save",
                    data:form_data,
                    success:function (row) {
                        if(row.status){
                            Ext.Msg.alert('友情提示',row.info,function(y){
                                parent_window_load();
                                parent.CloseTab(true);
                                window.store.reload();
                            });
                        }else{
                            Ext.Msg.alert('友情提示',row.info);
                        }
                    }
                });
            });
        },
        /**
         * 文件上传
         */
        uploadify:function(){
            var p_cover=$('input[name=p_cover]').val();
            $('.cover-img').uploadFile({
                url:$__app__ + '/Upload/ajax_upload',
                verify:{ size:5000,type:['jpg','JPG','gif','PNG','png','GIF']},
                multiple:false,
                select_id:'.upload-btn',
                process:'?x-oss-process=image/resize,m_mfit,h_230,w_330',
                load_msg:'正在努力上传中，请稍等...',
                default_url:p_cover,
                data:{
                    table_model:'产品',
                    table_id:3045
                }
            },function(r,data){
                $('input[name=p_cover]').val(r.data.url);
            },function(r){
                Ext.Msg.alert('友情提示', r.msg);
            }
            );
        },
        PicData:function(){},
        ImgClick:function(){

            var pic_icon=$('.pic-icon');
            pic_icon.unbind();
            pic_icon.click(function(){
                var info_box=$(this).parents('.p-info-box');
                par_id=info_box;
                combox_sc.setValue('----请选择资源----');
                pic_win.show();
            });
            var ee=$('.ee-span2');
            ee.unbind();
            ee.click(function(){
                var ii=$(this).parents('.p-info-box');
                ii=ii.attr('data-day');
                var hotel_name=Ext.getCmp('source--'+ii+'_id').getValue();
                var hotel_id=$('.source_idd_'+ii).val();
                var jj=ii-1;
                var name=$('.ee-input').eq(jj).val();

                var pp_days=parseFloat($('input[name=p_days]').val());
                    for(var j=1;j<=pp_days;j++){
                        Ext.getCmp('source--'+j+'_id').setValue(hotel_name);
                        $('.source_idd_'+j).val(hotel_id);
                        $('.ee-input').val(name);
                    }

            });
        },
        WindowCls:function(){
            var clos_id=$('.clos-id');
            clos_id.unbind();
            clos_id.click(function(){
                Ext.MessageBox.confirm('友情提示','你确定要关闭吗?',function(y){
                    if(y=='yes'){
                        parent_window_load();
                        parent.CloseTab(true);
                    }
                })
            });
        },
        EditorData:function(){
            var editor_data={
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test','forecolor','backcolor','removeformat','fontsize','fontfamily','underline','strikethrough','justify','indent','unlink']],
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
            return editor_data;
        },

        EditorView:function(){
            var editor_data=this.EditorData();
            var eu_id=['feature','cost_in','cost_noin','notice','visa'/*'correctly','passed'*/];
            for(var ei=0;ei<eu_id.length;ei++){
                var eu_row=eu_id[ei];
                eu_rows[eu_row]=UE.getEditor(eu_row,editor_data);
            }
        },

        DistinctType:function(type){
            var visa_id=$('#visa-id');
            switch (type){
                case '出境旅游':
                    visa_id.show();
                    break;
                default :
                    visa_id.hide();
                    break;
            }
        }
    };

    function parent_window_load(){
        parent.to_pernet_wind('ifm_tab_24',function(id){
            id.load_alert();
        });
    }
    ProductsPanel.construction(pid);

    //产品编号判断
    $('#p_num').on('blur',function(){
        onlyNumAlpha();
    });

    /**
     * 判断产品编号是否是数字、字母？
     */
    function onlyNumAlpha(){
        var pronum_msg=$('.pronum-msg');
        var p_num = $('input[name="p_num"]').val();
        if (!/^[a-zA-Z0-9]{1,20}$/.test(p_num)) {
            pronum_msg.html("请填写字母、数字，最多输入20字符");
            pronum_msg.css('color','red')
            return false;
        }else{
            pronum_msg.css('color','#999')
        }
    }

    //顺路站
    var station = SUNLINE.ComBoxPlus({
        id:'station',
        name:'station',
        fields:['st_name','st_province','st_city','st_county','st_id'],
        url:$__app__+'/Station/ontheway_station',
        config:{
            renderTo:'way-station',
            displayField:'st_name',
            valueField:'st_id',
            width:730,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item"><span>{st_name}</span><span style="float: right">{st_province}-{st_city}-{st_county}</span></li>',
                '</tpl></ul>'
            ),
            value:p_by_station,
            multiSelect: true,
            pageSize:20
        },type:'Tag'
    });




    /*
     * 行程起始终止时间
     * */
    var start_time=SUNLINE.ExtDateField({
        id:'pd_start_date_id',
        width:180,
        labelWidth:0,
        labelAlign:'right',
        name:'pd_start_date',
        value:new Date(),
        fieldLabel:":",
        format: 'Y-m-d',
        gang:'pd_end_date_id',
        start:true
    });
    var end_time=SUNLINE.ExtDateField({
        id:'pd_end_date_id',
        width:180,
        labelWidth:0,
        labelWidth:'right',
        name:'pd_end_date',
        fieldLabel:":",
        value:new Date(),
        format: 'Y-m-d',
        gang:'pd_start_date_id'
    });
    var pd_start=$("#start_time").attr("val");
    var pd_end=$("#end_time").attr("val");
    var start_date=$("#start_date").val();
    if(start_date){
        pd_start=pd_end=start_date;
        Ext.getCmp("pd_start_date_id").setReadOnly(true);
        Ext.getCmp("pd_end_date_id").setReadOnly(true);
    }
    if(pd_start){ Ext.getCmp("pd_start_date_id").setValues(pd_start); }
    if(pd_end){ Ext.getCmp("pd_end_date_id").setValues(pd_end); }
    start_time.render("start_time");
    end_time.render("end_time");
});