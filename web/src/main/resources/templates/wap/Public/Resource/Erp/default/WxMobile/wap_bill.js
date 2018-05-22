/**
 * Created by Administrator on 16-4-7.
 */
var team_items={};
var team_data={};
$(function(){
    //表单数据操作
    $.getForm=function(opt){
        var id=opt.id;
        var data_return;
        function get_this(type,data){
            var return_data={};
            for(var gi=0;gi<id.length;gi++){
                var f_id=id.eq(gi);
                var f_name=f_id.attr('name');
                return_data[f_name]=f_id.val();
                if(type=='reset'){
                    f_id.val('');
                }else if(type=='set'){
                    f_id.val(data[f_name]);
                    return_data[f_name]=data[f_name];
                }
            }
            return return_data;
        }
        data_return=get_this(opt.action,opt.data);
        return data_return;
    };
    //手机端弹出搜索框
    $.WapBox=function(opt){
        opt.id.unbind();
        opt.id.click(function(){
            var tpi_add_type=$('input[name=tpi_add_type]').val();
            if(tpi_add_type==0)return false;
            if(opt.store)opt.store();
            box_show();
        });
        function box_show(){
            opt.back_id.hide();
            opt.top_id.show();
        };
        function box_hide(){
            opt.back_id.show();
            opt.top_id.hide();
        };
        //快速搜索
        var search_txt=$('.search-txt');
        search_txt.change(function(){
            var s_txt=$(this).val();
            if(opt.store)opt.store(s_txt);
        });

        $('.fa-search').click(function(){
            var f_txt=search_txt.val();
            if(opt.store)opt.store(f_txt);
        });
    };
    //添加导游报账信息
    var WapAddBill={
        //初始化方法
        rb_list:$('.rb_list'),
        rb_info:$('#rb-info'),
        add_bill:$('.add-bill'),
        rb_btn:$('.rb-btn'),
        bill_add_save:$('.bill-save'),
        construction:function(){
            var is_this=this;
            this.items_jeep();
            this.bill_add();
            if(wap_title=='团队报账')this.items_store(team_id);
            if(wap_title=='附件管理')this.attach_load(0);
            if(wap_title=='团队列表'){
                this.team_list_store('未报账');
                this.sch_btn();
            }
            this.confirm_id();
            this.select_items();
            this.save_money();
            this.bill_items_del();
            this.sign_hover();
            this.bus_show();
            this.right_sk();
            this.items_select();
            this.bill_add_save.click(function(){
                is_this.items_add_save();
            });
            //关闭添加窗口
            var bill_title=this.add_bill.find('.wap_title_left');
            bill_title.click(function(){
                is_this.add_bill.hide();
            });
        },
        //初始化数据
        items_store:function(id,type){
            var data={id:id},is_this=this;
            $.ajax({
                type:"POST",
                url:$__app__ + "/WxMobile/items_json",
                data:data,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    team_items=data.items;
                    team_data=data.tp_data;
                    type=type?type:'景点';
                    if(type=='车费')type='司机车辆';
                    //渲染日期
                    is_this.bill_list_date(data.tp_data.team_date,$('select[name=tpi_date]'));
                    //渲染列表
                    if(type=='购物店'){
                        is_this.bill_list_shop_tpl(team_items[type]);
                    }else{
                        is_this.bill_list_tpl(team_items[type]);
                    }

                }
            });
        },
        //初始化团队数据
        team_list_store:function(type,page,cls,key){
            var data={type:type},is_this=this;
            if(page)data.page=page;
            if(key)data.key=key;
            $.ajax({
                type:"POST",
                url:$__app__ + "/WxMobile/team_list_data",
                data:data,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    var rows=data.info;
                    is_this.team_list_tpl(rows.data,cls);
                    var load_more=$('.load-more');
                    var page_num=parseFloat(rows.page)?parseFloat(rows.page):0;
                    if(rows.total>(page_num+1)*20){
                        load_more.show();
                        load_more.attr('data-page',rows.page);
                        is_this.load_more_team(type,rows.page);
                    }else{
                        load_more.hide();
                    }
                }
            });
        },
        load_more_team:function(type,page){
            var load_more=$('.load-more'),is_this=this;
            load_more.unbind();
            load_more.click(function(){
                page=parseFloat(page)?parseFloat(page):0;
                is_this.team_list_store(type,(page+1),'append');
            });
        },
        //不同分类之间的分类
        items_jeep:function(){
            var is_this=this;
            this.rb_list.unbind();
            this.rb_list.click(function(){
                var items_val=$(this).attr('data-val');
                if(items_val=='车费')items_val='司机车辆';
                if($(this).hasClass('lt-list')){
                    is_this.team_list_store(items_val);
                }else{
                    if(items_val=='购物店'){
                        is_this.bill_list_shop_tpl(team_items[items_val]);
                    }else{
                        is_this.bill_list_tpl(team_items[items_val]);
                    }
                }
                is_this.rb_list.removeClass('rb_hover');
                $(this).addClass('rb_hover');
            });
        },
        /**
         * 渲染出报账记录
         * @param data
         * @returns {boolean}
         */
        bill_list_tpl:function(data){
            var tpl='',sign= 0,cosh= 0,sign_money= 0,cosh_money=0;
            if(!data){ this.rb_info.html(tpl); return false;}
            $.each(data,function(i,v){
                var add_type='';
                var tpi_name=v.tpi_name;
                var tpi_spec= v.tpi_spec;
                var pop_type='人';
                if(v.tpi_type=='物品'){
                    tpi_name= v.tpi_spec;
                    tpi_spec=v.tpi_name;
                }
                if(v.tpi_type=='司机车辆' || (v.tpi_type=='应付社' && v.tpi_items_type=='司机车辆')){
                    v.tpi_num=1;
                    v.tpi_price= v.tpi_money;
                    tpi_spec= v.tpi_contacts;
                }
                if(v.tpi_type=='住宿')pop_type='间';
                var tpi_money=(v.tpi_num*v.tpi_price);
                if(v.tpi_add_type==1)add_type='add_type_cls';
                tpl+='<li class="info-list '+add_type+'" data-id="'+i+'">' +
                    '<div class="if-right">' +
                    '<span class="if_money if-l">￥'+tpi_money.toFixed(2)+'</span>' +
                    '<span class="if_price if_dm if-l"><i class="if-type">'+ v.tpi_settle+'</i>:'+ v.tpi_price+'/'+pop_type+'</span>' +
                    '</div>' +
                    '<div class="if-left">' +
                    '<span class="if_name if-l">'+ tpi_name +'('+tpi_spec+')</span>' +
                    '<span class="if_pop if_dm if-l">共'+ v.tpi_num+pop_type+'('+ v.tpi_date_val+')</span>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</li>';
                if(v.tpi_settle=='现金'){
                    cosh++;
                    cosh_money+=tpi_money;
                }else{
                    sign++;
                    sign_money+=tpi_money;
                }
            });
            tpl='<ul>'+tpl+'<li class="info-list money-list">' +
                '<div class="if-right">' +
                '<span class="if_money_text if-l">总金额</span>' +
                '<span class="all_money if-l">￥'+(cosh_money+sign_money).toFixed(2)+'<i class="i_txt">元</i></span>' +
                '</div>' +
                '<div class="if-left" style="width: 180px">' +
                '<span class="if_sign if-l"><i class="rb-title">现付('+cosh+'笔):</i>￥'+cosh_money.toFixed(2)+'</span>' +
                '<span class="if_cash if-l"><i class="rb-title">签单('+sign+'笔):</i>￥'+sign_money.toFixed(2)+'</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</li></ul>';
            this.rb_info.html(tpl);
            this.bill_save($('.info-list'));
        },
        /**
         * 渲染购物店的消费记录
         * @param data
         * @returns {boolean}
         */
        bill_list_shop_tpl:function(data){
            var tpl='',sign= 0,cosh= 0,sign_money= 0,cosh_money=0;
            if(!data){ this.rb_info.html(tpl); return false;}
            $.each(data,function(i,v){
                var num=v.tpi_num?parseFloat(v.tpi_num):0;
                var percent=v.tpi_percent?parseFloat(v.tpi_percent):0;
                var price=v.tpi_price?parseFloat(v.tpi_price):0;
                var all_money=v.tpi_total_money?parseFloat(v.tpi_total_money):0;
                //购物店金额＝数据*单价+总额*(百分比/100)
                var percent_money=Math.round(all_money*(percent/100));
                var num_money=(num*price);
                var tpi_money=num_money+percent_money;
                var add_type='';
                if(v.tpi_add_type==1)add_type='add_type_cls';
                tpl+='<li class="info-list '+add_type+'" data-id="'+i+'">' +
                    '<div class="if-right">' +
                    '<span class="if_money if-l">￥'+tpi_money.toFixed(2)+'</span>' +
                    '<span class="percent-cls if_dm if-l">提成:'+all_money.toFixed(2)+'*'+percent.toFixed(2)+'%='+Math.round(all_money*(percent/100))+'</span>' +
                    '<span class="if_price if_dm if-l">人头:'+ num+'*'+ price.toFixed(2)+'='+(num*price)+'</span>' +
                    '</div>' +
                    '<div class="if-left">' +
                    '<span class="if_name if-l">'+ v.tpi_name +' <font color="#999">('+ v.tpi_settle+')</font></span>' +
                    '<span class="if_all_money if_dm if-l">消费:￥'+ all_money.toFixed(2)+'</span>' +
                    '<span class="if_pop if_dm if-l">共'+ v.tpi_num+'人('+ v.tpi_date_val+')</span>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</li>';
                if(v.tpi_settle=='现金'){
                    cosh++;
                    cosh_money+=tpi_money;
                }else{
                    sign++;
                    sign_money+=tpi_money;
                }
                /*//提成
                if(percent_money>0){
                    sign++;
                    sign_money+=percent_money;
                }
                //人头费
                if(num_money>0){
                    cosh++;
                    cosh_money+=num_money;
                }*/
            });
            tpl='<ul>'+tpl+'<li class="info-list money-list">' +
                '<div class="if-right">' +
                '<span class="if_money_text if-l">总金额</span>' +
                '<span class="all_money if-l">￥'+(cosh_money+sign_money).toFixed(2)+'<i class="i_txt">元</i></span>' +
                '</div>' +
                '<div class="if-left" style="width: 180px">' +
                '<span class="if_sign if-l"><i class="rb-title">现付('+cosh+'笔):</i>￥'+cosh_money.toFixed(2)+'</span>' +
                '<span class="if_cash if-l"><i class="rb-title">签单('+sign+'笔):</i>￥'+sign_money.toFixed(2)+'</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</li></ul>';
            this.rb_info.html(tpl);
            this.bill_save($('.info-list'));
        },
        /**
         * 渲染日期
         * @param data
         * @param id
         */
        bill_list_date:function(data,id){
            var tpl='';
            for(var d=0;d< data.length;d++){
                tpl+='<option value="'+data[d]+'">'+int2date(data[d])+'</option>';
            }
            id.html(tpl);
        },
        //修改报账明细
        bill_save:function(id){
            var is_this=this;
            id.unbind();
            id.click(function(){
                var team_id=$(this).attr('data-id');
                var rb_menu=$('#rb-menu');
                if(rb_menu.length<=0)return false;
                if(!team_id)return false;
                var rb_hover_val=$('.rb_hover').attr('data-val');
                if(rb_hover_val=='车费')rb_hover_val='司机车辆';
                var data=team_items[rb_hover_val][team_id];
                is_this.bill_show(data,'yes');
            });
        },
        //追加报账明细
        bill_add:function(){
            var is_this=this;
            is_this.rb_btn.unbind();
            is_this.rb_btn.click(function(){
                var rb_hover_val=$('.rb_hover').attr('data-val');
                var tpi_data={ tpi_type:rb_hover_val, tpi_team_id:team_id,tpi_add_type:1,tpi_settle:'现金',tpi_date:team_data.team_start_date,tpi_pay_class:'0'};
                if(rb_hover_val=='其他')tpi_data.tpi_name='北京';
                is_this.bill_show(tpi_data);
            });
        },
        //跳出输入框
        bill_show:function(store,up_type){
            var form_cls=$('.form_cls'),bill_del=$('.bill-del');
            if(store.tpi_type=='应付社' && up_type!='yes')store.tpi_items_type='景点';
            if(store.tpi_type=='司机车辆'){
                store.tpi_type='车费';
                store.tpi_spec=store.tpi_contacts;
            }
            if(store.tpi_type=='应付社' && store.tpi_items_type=='司机车辆')store.tpi_spec=store.tpi_contacts;
            $.getForm({ id:form_cls, data:store, action:'set'});
            $('.bill-title').html('添加'+store.tpi_type);
            if(store.tpi_id){
                bill_del.html('删　除');
            }else{
                bill_del.html('关　闭');
            };
            if(store.tpi_type=='应付社' && store.tpi_items_type=='司机车辆')store.tpi_items_type='车费';
            //如果为计划单中的数据，则禁止编辑
            if(store.tpi_add_type==0 || store.tpi_type=='购物店'){
                this.readonly_fn(form_cls,true,store.tpi_type,store.tpi_add_type);
                bill_del.addClass('disabled-cls');
            }else{
                if(up_type=='yes' && store.tpi_type=='应付社'){
                    this.readonly_fn(form_cls,false,store.tpi_items_type,store.tpi_add_type,'yes');
                }else{
                    this.readonly_fn(form_cls,false,store.tpi_type,store.tpi_add_type);
                    bill_del.removeClass('disabled-cls');
                }
            };
            //判断是否是购物店
            if(store.tpi_type=='购物店' && store.tpi_spec){
                $('select[name=tpi_spec_sel]').html('<option value="'+store.tpi_spec_id+'">'+store.tpi_spec+'</option>');
            }
            var tpi_money=$('input[name=tpi_money]');
            tpi_money.attr('readonly',true);
            if(store.tpi_type=='车费' || (store.tpi_type=='应付社' && store.tpi_items_type=='车费'))tpi_money.attr('readonly',false);
            var items_type_id=$('select[name=tpi_items_type]');
            if(up_type=='yes' && store.tpi_type=='应付社'){
                items_type_id.attr('readonly',true);
                items_type_id.attr('disabled',true);
            }else{
                items_type_id.attr('readonly',false);
                items_type_id.attr('disabled',false);
            }
            this.add_bill.show();
            this.sign_number_show();
            this.items_type_select();
        },
        readonly_fn:function(id,bool,type,add_type,items_type){
            var title_txt={
                '景点':{tpi_name:'景点名称',tpi_spec:'门票名称',tpi_date:'游玩日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '餐饮':{tpi_name:'餐厅名称',tpi_spec:'餐标',tpi_date:'用餐日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '住宿':{tpi_name:'酒店名称',tpi_spec:'房型',tpi_date:'入住日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '其他':{tpi_name:'仓库名称',tpi_spec:'物品名称',tpi_date:'作用日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '车费':{tpi_name:'车辆公司',tpi_spec:'车辆信息',tpi_date:'使用日期',tpi_contacts:'司机',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '购物店':{tpi_name:'购物店',tpi_spec:'政策',tpi_date:'进店日期',tpi_price:'人头单价',tpi_num:'进店人数',tpi_total_money:'购物总额',tpi_money:'返佣总额'},
                '应付社':{tpi_name:'结算单位',tpi_spec:'消费项目',tpi_date:'出行日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额'},
                '默认':{tpi_name:'结算单位',tpi_spec:'消费项目',tpi_date:'出行日期',tpi_price:'单价',tpi_num:'数量',tpi_money:'总额',tpi_contacts:'联系人'}
            };
            //购物店需要显示的字段
            var tpi_spec=$('input[name=tpi_spec]');
            var shop_show=['tpi_spec_sel','tpi_percent','tpi_total_money'];
            var bus_show=['tpi_price','tpi_num'];
            if(!title_txt[type])type='默认';
            var list_data=title_txt[type];
            for(var fi=0;fi<id.length;fi++){
                var fm_id=id.eq(fi);
                var list_id=fm_id.parents('.cs-list');
                var fm_name=fm_id.attr('name');
                if(list_data[fm_name])list_id.find('.cs-title').html(list_data[fm_name]+'：');
                if(items_type=='yes' && in_array(fm_name,['tpi_items_type'])!=-1)continue;
                //对购物店的操作
                if(type=='购物店'){
                    if(in_array(fm_name,shop_show)!=-1){
                        fm_id.removeClass('disabled-id');
                        list_id.show();
                    }
                    tpi_spec.addClass('disabled-id');
                }else{
                    if(in_array(fm_name,shop_show)!=-1){
                        fm_id.addClass('disabled-id');
                        if(fm_name!='tpi_spec_sel')list_id.hide();
                    }
                    tpi_spec.removeClass('disabled-id');
                }
                //车费显示数据
                if(type=='车费'){
                    if(in_array(fm_name,bus_show)!=-1){
                        fm_id.addClass('disabled-id');
                        list_id.hide();
                    }
                }else{
                    if(in_array(fm_name,bus_show)!=-1){
                        fm_id.removeClass('disabled-id');
                        list_id.show();
                    }
                }
                //对应付社的里的操作
                if(in_array(fm_name,['tpi_items_type'])!=-1){
                    if(type=='应付社'){
                        list_id.show();
                    }else{
                        list_id.hide();
                    }
                }
                if(add_type==1 && type=='购物店'){
                    if(in_array(fm_name,['tpi_date','tpi_name','tpi_spec_sel','tpi_settle'])!=-1){
                        fm_id.attr('readonly',false);
                        fm_id.attr('disabled',false);
                        continue;
                    }
                };
                if(fm_id.hasClass('select-box')){
                    fm_id.attr('disabled',bool);
                }else if(in_array(fm_name,['tpi_num','tpi_remark','tpi_total_money','tpi_sign_number'])!=-1){
                    continue;
                }else{
                    fm_id.attr('readonly',bool);
                }
            }
        },
        //选择单位类型
        items_type_select:function(){
            var items_type_id=$('select[name=tpi_items_type]'),is_this=this;
            items_type_id.unbind();
            items_type_id.change(function(){
                var type_val=$(this).val(),form_cls=$('.form_cls');
                if(type_val=='司机车辆')type_val='车费';
                if(type_val=='物品')type_val='其他';
                is_this.readonly_fn(form_cls,false,type_val,1,'yes');
                var tpi_money=$('input[name=tpi_money]');
                tpi_money.attr('readonly',true);
                if(type_val=='车费')tpi_money.attr('readonly',false);
                for(var i=0;i<form_cls.length;i++){
                    var fm_id=form_cls.eq(i);
                    var fm_name=fm_id.attr('name');
                    if(in_array(fm_name,['tpi_id','tpi_cs_id','tpi_team_id','tpi_type','tpi_add_type','tpi_date','tpi_items_type','tpi_settle'])!=-1)continue;
                    fm_id.val('');
                }
            });
        },
        //选择资信息
        select_items:function(){
            var store=this.search_store;
            $.WapBox({
                id: $('input[name=tpi_name]'),
                back_id:$('.info-box'),
                top_id:$('.items-box'),
                store:store
            });
        },
        search_store:function(skey){
            var tpi_type=$('input[name=tpi_type]').val(),is_this=this;
            if(tpi_type=='应付社')tpi_type=$('select[name=tpi_items_type]').val();
            if(tpi_type=='景点')tpi_type='景区';
            var data={type:tpi_type,start:0,limit:50};
            if(skey)data['query']=skey;
            $.ajax({
                type:"POST",
                url:$__app__ + "/Team/items_data",
                data:data,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    var info = data.data;
                    if(data.status==0){
                        $.alert({msg:data.info});
                        return false;
                    }
                    //if(data.status==0) window.location=$__app__+"/Mobile/login.shtml";
                    WapAddBill.search_list_tpl(info);
                }
            });
        },
        search_list_tpl:function(data){
            var tpl='';
            for(var i=0;i<data.length;i++){
                var rows=data[i];
                tpl+='<li class="it-list" data-id="'+rows.id+'">'+ rows.text+'</li>';
            }
            $('.items-list ul').html(tpl);
            this.search_items_hover();
        },
        search_items_hover:function(){
            var items_list=$('.items-list').find('.it-list'),is_this=this;
            items_list.unbind();
            items_list.click(function(){
                var sc_id=$(this).attr('data-id');
                $('input[name=tpi_name]').val($(this).html());
                $('input[name=tpi_cs_id]').val(sc_id);
                $('.info-box').show();
                $('.items-box').hide();
                is_this.items_resource_data(sc_id);
            });
            var box_cls=$('.box-cls');
            box_cls.unbind();
            box_cls.click(function(){
                $('.info-box').show();
                $('.items-box').hide();
            });
        },
        //渲染购物店政策
        items_resource_data:function(id){
            var ri_type=$('input[name=tpi_type]').val(),
                ri_date=$('select[name=tpi_date]').val(),
                is_this=this;
            if(ri_type!='购物店')return false;
            var post_data={type:ri_type,start_date:ri_date,end_date:ri_date,at_id:id,start:0,limit:50};
            $.ajax({
                type:"POST",
                url:$__app__ + "/Team/items_data_detail",
                data:post_data,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    var info = data.data;
                    var spec_sel=$('select[name=tpi_spec_sel]');
                    var spec_option='',shop_data={},first_data={};
                    $.each(info,function(i,v){
                        var sel='';
                        if(i==0){
                            first_data=v;
                            sel='selected';
                        };
                        spec_option+='<option value="'+ v.id+'" '+sel+'>'+ v.text+'</option>';
                        shop_data[v.id]=v;
                    });
                    is_this.shop_set_values(first_data);
                    spec_sel.html(spec_option);
                    spec_sel.unbind();
                    spec_sel.change(function(){
                        var sp_id=$(this).val();
                        is_this.shop_set_values(shop_data[sp_id]);
                    });
                }
            });
        },
        //购物店选择器
        shop_set_values:function(row){
            $('input[name=tpi_spec_id]').val(row.id);
            $('input[name=tpi_spec]').val(row.text);
            $('input[name=tpi_price]').val(row.sp_one_price);
            $('input[name=tpi_percent]').val(row.sp_pct_num);
            $('input[name=tpi_num]').val(0);
            $('input[name=tpi_total_money]').val(0);
            $('input[name=tpi_money]').val(0);
        },
        //添加新项目保存与修改
        items_add_save:function(){
            var rows=$.getForm({ id:$('.form_cls'), action:'get'}),is_this=this;
            //判断必填项是否为空
            var not_empty=['tpi_date','tpi_name'];
            var return_bool=false;
            $.each(rows,function(i,v){
                if(in_array(i,not_empty)!=-1 && !v){
                    return_bool=true;
                    return false;
                }
            });
            if(return_bool==true){
                $.toast({msg:'请注意”*“号内容必需填写！',time:2000});
                return false;
            }
            rows.tpi_type_class='items_detail';
            $.ajax({
                type:"POST",
                url:$__app__ + "/WxMobile/items_save",
                data:rows,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    if(data.status!=0){
                        is_this.add_bill.hide();
                        $.toast({msg:data.info.msg,time:1000});
                        is_this.items_store(team_id,rows.tpi_type);
                    }else{
                        $.alert({msg:data.info});
                    }
                }
            });
        },
        //渲染团队列表
        team_list_tpl:function(data,cls){
            var tpl='';
            $.each(data,function(i,v){
                if(!v.team_num)return true;
                var series='';
                if(v.team_p_series)series='['+ v.team_p_series +']';
                var bk='';
                var pf='<i class="pf-cls pf-red">散</i>';
                if(v.team_type=='团队订单'){
                    series= v.team_p_name;
                    pf='<i class="pf-cls pf-green">团</i>';
                }
                var guide_txt='(导游:未安排)';
                if(v.guide)guide_txt='<font color="#666">(导游:'+v.guide.tpi_name+')</font>';
                if(i%2==0)bk='style="background:#f9f9f9"';
                var out_txt=[];
                if(v.team_guide_name)out_txt.push('全陪:'+v.team_guide_name);
                if(v.team_survey_name)out_txt.push('计审:'+v.team_survey_name);
                if(v.team_root_name)out_txt.push('房审:'+v.team_root_name);
                console.log(out_txt);
                if(out_txt.length>0){
                    out_txt='<span class="if_pop if_dm if-l">'+out_txt.join(' | ')+'</span>';
                }else{
                    out_txt='';
                }
                tpl+='<a href="'+$__app__ + '/WxMobile/wap_today/id/'+ v.team_id+'"><li class="info-list" '+bk+'>' +
                    '<div class="if_name team-title"><i class="status-cls '+ v.team_cls+'">'+ v.team_credit_status+'</i>'+v.team_num+series+'</div>' +
                    '<div class="if-right"><span class="if_money if-l"></span>' +
                    '<span class="if_price if_dm if-l if_start_date">'+ v.start_date+'～'+ v.end_date+'</span>' +
                    '</div>' +
                    '<div class="if-left">' +
                    '<span class="if_pop if_dm if-l">'+pf+' 共'+ v.team_adult+'+'+ v.team_children+'人 '+guide_txt+'</span>' +out_txt+
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</li></a>';
            });
            var rb_info=$('#rb-info ul');
            if(cls=='append'){
                rb_info.append(tpl);
            }else{
                rb_info.html(tpl);
            }

        },
        //修改总金额操作
        save_money:function(){
            var tpi_price=$('input[name=tpi_price]');
            var tpi_num=$('input[name=tpi_num]');
            var total_money=$('input[name=tpi_total_money]');
            var percent=$('input[name=tpi_percent]');
            tpi_num.unbind();
            tpi_num.change(function(){ all_money(); });
            tpi_price.unbind();
            tpi_price.change(function(){ all_money(); });
            total_money.unbind();
            total_money.change(function(){ all_money(); });
            function all_money(){
                var tpi_price_n=parseFloat(tpi_price.val());
                var tpi_num_n=parseFloat(tpi_num.val());
                var tpi_total_money=parseFloat(total_money.val());
                var tpi_percent=parseFloat(percent.val());
                if(!tpi_total_money)tpi_total_money=0;
                if(!tpi_percent)tpi_percent=0;
                if(!tpi_price_n)tpi_price_n=0;
                if(!tpi_num_n)tpi_num_n=0;
                var tpi_money=(tpi_price_n*tpi_num_n)+Math.round(tpi_total_money*tpi_percent)/100;
                $('input[name=tpi_money]').val(tpi_money.toFixed(2));
            }
        },
        //删除消费项目
        bill_items_del:function(){
            var bill_del=$('.bill-del'),is_this=this;
            bill_del.click(function(){
                if($(this).hasClass('disabled-cls')){
                    $.alert({msg:'默认消费项目不可删除!'});
                    return false;
                }
                var tpi_id=$('input[name=tpi_id]').val();
                var tpi_type=$('input[name=tpi_type]').val();
                var msg='删除';
                if(!tpi_id) msg='关闭';
                $.confirm({
                    msg:'你确定需要'+msg+'当前项目吗?',
                    ok:function(){
                        if(msg=='删除'){ ajax_del({tpi_id:tpi_id,tpi_type:tpi_type});}
                        is_this.add_bill.hide();
                    }
                });
            });
            function ajax_del(rows){
                $.ajax({
                    type:"POST",
                    url:$__app__ + "/WxMobile/items_del",
                    data:rows,
                    success:function (msg) {
                        var data = msg;
                        if (typeof msg != 'object')
                            data = eval("(" + msg + ")");
                        if(data.status!=0){
                            is_this.add_bill.hide();
                            $.toast({msg:data.info.msg,time:1000});
                            is_this.items_store(team_id,rows.tpi_type);
                        }else{
                            $.alert({msg:data.info});
                        }
                    }
                });
            }
        },
        //如果是签单时操作
        sign_hover:function(){
            var tpi_settle= $('select[name=tpi_settle]');
            var is_this=this;
            tpi_settle.unbind();
            tpi_settle.blur(function(){
                is_this.sign_number_show()
            });
        },
        //显示签单输入框
        sign_number_show:function(){
            var settle_val= $('select[name=tpi_settle]').val();
            var sign_number=$('.sign_number');
            var pay_class=$('.pay_class');
            if(settle_val=='签单'){
                sign_number.show();
                pay_class.hide();
            }else if(settle_val=='现金'){
                sign_number.hide();
                pay_class.show();
            }else{
                sign_number.hide();
                pay_class.hide();
            }
        },
        attach_load:function(id,type){
            var rows={team_id:team_id,items_id:id},is_this=this;
            if(type)rows.type=type;
            $.ajax({
                type:"POST",
                url:$__app__ + "/WxMobile/attach_json",
                data:rows,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    if(data.status!=0){
                        is_this.attach_list_tpl(data.info);
                    }else{
                        $.alert({msg:data.info});
                    }
                }
            });
        },
        attach_list_tpl:function(data){
            var tpl='',total_num=0;
            $.each(data,function(i,v){
                var list_tpl='';
                $.each(v,function(ti,tv){
                    var att_del='';
                    if(present_id=='yes')att_del='<i class="fa fa-minus-circle att-del"></i>';
                    var url_rows=(tv.at_url).split('.');
                    var img_url=url_rows[url_rows.length-2]+'_min.'+url_rows[url_rows.length-1];
                    list_tpl+=' <dd class="img-list" data-id="'+tv.at_id+'">'+att_del+'<img src="'+$__root__+img_url+'" class="img-cls"></dd>';
                });
                var txt=i;
                if(!txt)txt='公共项目';
                tpl+='<li class="match-list"><div class="item-title">'+txt+'('+ v.length+'张)' +
                    '<span class="title-txt"></span></div>' +
                    '<div class="items-info"><dl>'+list_tpl+'<dd class="clear"></dd></dl></div></li>';
                total_num+= v.length;
            });
            var match_info=$('.match-info ul');
            match_info.html(tpl);
            $('.mt-num').html(total_num+'张');
            var m_w=$(window).width();
            var img_list=$('.img-list'),is_this=this;
            img_list.css({
                height:m_w/4
            });
            this.attach_del();
        },
        attach_del:function(){
            var att_del=$('.att-del'),is_this=this;
            att_del.unbind();
            att_del.click(function(){
                var data_id=$(this).parents('.img-list');
                var data={id:data_id.attr('data-id')};
                $.confirm({
                    msg:'你确认需要删除当前附件吗?',
                    ok:function(){
                        $.ajax({
                            type:"POST",
                            url:$__app__ + "/WxMobile/match_del",
                            data:data,
                            success:function (msg) {
                                var data = msg;
                                if (typeof msg != 'object')
                                    data = eval("(" + msg + ")");
                                if(data.status!=0){
                                    is_this.attach_load();
                                }else{
                                    $.alert({msg:data.info});
                                }
                            }
                        });
                    }
                });
            });
        },
        items_select:function(){
            var select_box=$('.select-box'),is_this=this;
            select_box.change(function(){
                var t_id=$(this).val();
                var t_type=$(this).find('option:selected').attr('data-type');
                is_this.attach_load(t_id,t_type);
            });
        },
        //查看大交通信息、查看票价信息
        bus_show:function(){
            var bus_cls=$('.bus-cls');
            var wap_alert=$('#wap-alert');
            var wap_back=$('#wap-back');
            var bus_id=$('.bus-id');
            var vip_box_id=$('.vip-box');
            var is_this=this;
            bus_cls.unbind();
            bus_cls.click(function(){
                wap_alert.show();
                vip_box_id.hide();
                //wap_back.show();
                var bus_html=bus_id.html();
                wap_alert.html(bus_html);
                is_this.win_close();
                is_this.seat_select();
            });
            var ticket_cls=$('.ticket-cls');
            var ticket_id=$('.ticket-id');
            ticket_cls.unbind();
            ticket_cls.click(function(){
                wap_alert.show();
                vip_box_id.hide();
                //wap_back.show();
                var ticket_html=ticket_id.html();
                wap_alert.html(ticket_html);
                is_this.win_close();
                is_this.seat_select();
            });
        },
        //关闭窗口
        win_close:function(cls){
            var wap_alert=$('#wap-alert');
            //var wap_back=$('#wap-back');
            var wap_close=$('.wap-close');
            var vip_box_id=$('.vip-box');
            wap_close.unbind();
            wap_close.click(function(){
                wap_alert.hide();
                vip_box_id.show();
                //wap_back.hide();
            });
            if(cls=='yes'){
                wap_alert.hide();
                vip_box_id.show();
                //wap_back.hide();
            }
        },
        //游客信息的筛选
        seat_select:function(){
            var bus_list=$('.bus-list');
            var is_this=this;
            bus_list.unbind();
            bus_list.click(function(){
                var type=$(this).attr('data-type');
                var val=$(this).attr('data-val');
                is_this.seat_select_show(type,val);
                is_this.win_close('yes');
            });
            var pop_tools=$('.pop-tools');
            pop_tools.unbind();
            pop_tools.click(function(){
                is_this.seat_select_show('无');
            });
        },
        seat_select_show:function(type,val){
            var ct_list=$('.ct-list');
            for(var i=0;i<ct_list.length;i++){
                var ct_id=ct_list.eq(i);
                if(ct_id.hasClass('wp-title'))continue;
                var text='';
                switch (type){
                    case '去程':
                        text='go-num';
                        break;
                    case '返程':
                        text='back-num';
                        break;
                    case '票种':
                        text='t-data';
                        break;
                    default:
                        break;
                };
                if(text){
                    if(ct_id.attr(text)==val){
                        ct_id.show();
                    }else{
                        ct_id.hide();
                    }
                }else{
                    ct_id.show();
                }
            }
        },
        right_sk:function(){
            var right_sk=$('.right-sk span');
            var xx=$('.xx-cls');
            var jy=$('.jy-cls');
            right_sk.unbind();
            right_sk.click(function(){
                right_sk.removeClass('sk-hover');
                $(this).addClass('sk-hover');
                if($(this).hasClass('xx-sk')){
                    xx.show();
                    jy.hide();
                }else{
                    xx.hide();
                    jy.show();
                }
            });
        },
        sch_btn:function(){
            var sch_btn=$('.sch-btn'),is_this=this,sch_id=$('.sch-id');
            sch_btn.unbind();
            sch_btn.click(function(){
                var keys=sch_id.val();
                is_this.team_list_store('全部',0,'',keys);
                $(window).scrollTop(0);
            });
            sch_id.unbind();
            sch_id.change(function(){
                var keys=$(this).val();
                is_this.team_list_store('全部',0,'',keys);
                $(window).scrollTop(0);
            });
            this.scroll_fix();
        },
        scroll_fix:function(){
            $(window).scroll(function(){
                var sch_cls=$('.sch-box');
                var t_h=parseFloat($(window).scrollTop());
                if(t_h>100){
                    sch_cls.css({
                        display:'block'
                    });
                }else{
                    sch_cls.css({
                        display: 'none'
                    });
                }
            });
        },
        confirm_id:function(){
            var confirm_id=$('.confirm-id');
            confirm_id.unbind();
            confirm_id.click(function(){
                var status_id=$('.status-id').html();
                var msg='是否对此团队报账';
                var url=$__app__ + "/WxMobile/confirm_team_add";
                var data={id:team_id};
                if(status_id=='审核中' || status_id=='已完成'){
                    $.alert({msg:'【'+status_id+'】当前 状态不可撤消报账！'});
                    return false;
                }
                if(status_id!='未报账'){
                    msg='是否对此团队取消报账';
                    data.type='del';
                }
                $.confirm({
                    msg:msg,
                    ok:function(){
                        $.ajax({
                            type:"POST",
                            url:url,
                            data:data,
                            success:function (msg) {
                                var data = msg;
                                if (typeof msg != 'object')
                                    data = eval("(" + msg + ")");
                                if(data.status!=0){
                                    window.location.reload();
                                }else{
                                    $.alert({msg:data.info});
                                }
                            }
                        });
                    }
                });
            });
        }
    };
    WapAddBill.construction();
    $('.match-upload').click(function(){
        var items_type=$('.items_type');
        var post_val={
            at_si_name:items_type.find('option:selected').attr('data-type'),
            at_siid:items_type.val()
        };
    });
});