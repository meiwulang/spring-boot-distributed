/**
 * Created by zsl on 16-11-09.
 */
var bk_bool=true;

$(function(){
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

    window.MobileJs={
        img_width_height:function(id){
            $.each(id,function(i,v){
                var img_id=id.eq(i);
                if(img_id.width()>img_id.height()){
                    img_id.css('height','100%');
                }else{
                    img_id.css('width','100%');
                }
            });
        },
        Swiper:function(){
            //this.img_width_height($('.swiper-wrapper').find('img'));
            new Swiper('.mobile_cover',{
                resizeReInit : true,
                autoplay : 3500,
                loop:true,
                pagination: '.pagination',
                paginationClickable: true
            });

            $(".mobile-top .icon").click(function(){
                if (wx){
                    show_wechat_share();
                } else {
                    fx_width();
                    var fx_info = $(".fengxiang").find(".fx_info")
                    fx_info.html("数据加载中,请稍等...");
                    fx_info.html($(".eded").html());
                    config_share();
                }
            });

            function show_wechat_share(show){
                if (!wx) return false;
                var m = $('#wechat_share_m');
                if (show===false){
                    m.hide();
                }else{
                    m.show();
                }
            };
        },
        DetailJs:function(){
            var is_this=this;
            var list_head=$('.list-head');
            var head_col=list_head.find('.head-col');
            var head_fixd=$('.head-fixd');
            head_col.css('width',(100/head_col.length)+'%');
            head_fixd.find('.head-col').css('width',(100/head_col.length)+'%');
            top_scroll();
            function top_scroll(){
                var box_id=$('.box-id');
                $.each(box_id,function(i,v){
                    var id=box_id.eq(i);
                    var top_val=id.position().top;
                    id.attr('data-top',top_val);
                    list_head.find('.head-col').eq(i).attr('data-top',top_val);
                    head_fixd.find('.head-col').eq(i).attr('data-top',top_val);
                });
                mobile_click();
            };
            function mobile_click(){
                var fixd_title = $(".head-fixd .head-col");
                fixd_title.unbind();
                fixd_title.click(function(){
                    var top_val=parseFloat($(this).attr('data-top'));
                    if(!top_val)top_val=0;
                    $(window).scrollTop(top_val-80);
                });
                var mobile_title = $(".list-head .head-col");
                mobile_title.unbind();
                mobile_title.click(function(){
                    var top_val=parseFloat($(this).attr('data-top'));
                    if(!top_val)top_val=0;
                    $(window).scrollTop(top_val-80);
                });
            };
            var title_height=list_head.position().top;
            $(window).scroll(function(){scroll_item();});
            function scroll_item(){
                var head_col=$('.head-fixd .head-col');
                var wind_top=$(window).scrollTop();
                if(wind_top>title_height){
                    head_fixd.show();
                }else{
                    head_fixd.hide();
                }
                var hover_id='';
                $.each(head_col,function(i,v){
                    var h_id=head_col.eq(i);
                    var h_top=h_id.attr('data-top');
                    if(h_top<wind_top){
                        hover_id=head_col.eq(i+1);
                    }
                });
                if(hover_id){
                    head_col.removeClass("head_hover");
                    hover_id.addClass("head_hover");
                }else{
                    head_col.removeClass("head_hover");
                    head_col.eq(0).addClass("head_hover");
                }
            }
            $('.day-detail').click(function(){
                var d_text=$(this).html();
                var info=$('.journey-box').find('.info');
                var info_detail=$('.journey-box').find('.info_detail');
                if(d_text=='查看更多图文详情'){
                    $(this).html('只看简介行程');
                    info.hide();
                    info_detail.show();
                }else{
                    $(this).html('查看更多图文详情');
                    info.show();
                    info_detail.hide();
                }
            });

            //获取最近出团日期
            date_list();
            function date_list(){
                var p_id=$('input[name=p_id]').val();
                var where={ url:$__app__ + '/Goal/bus_list_details',data:{id:p_id,limit:8}};
                is_this.AjaxJson(where,function(v,r){
                    var date_box=$('.date-box');
                    var tpl='';
                    if(v.info=='没有班次信息'){
                        date_box.html('<div class="box-cls-id">当前没有班次信息...</div>');
                    }else{
                        $.each(v.info.bl_data,function(ti,tv){
                            if(ti==4) tpl+='<li class="clear"></li></ul><ul>';
                            tpl+='<li class="date-items">' +
                                '<div class="di-box">' +
                                '<div class="date">'+tv.start_date+' 周'+tv.bl_week+'</div>' +
                                '<div class="money">¥ '+tv.price+'</div>' +
                                '<div class="price">¥ '+tv.trade_price+'</div>' +
                                '</div>' +
                                '</li>';
                        });
                        date_box.html('<ul>'+tpl+'<li class="clear"></li></ul>');
                    }
                });
            }
        },
        load_img:function(type){
            var load_cls=$('.load-cls');
            load_cls.css('height',$(window).height()-45);
            if(type=='show'){
                load_cls.show();
            }else{
                load_cls.hide();
            }
        },
        OrderJson:function(){
            var is_this=this;
            var items_box=$('#wap-box');
            var load_data=$('.load-data');
            load_ajax({start:0,limit:20});
            function load_ajax(where,to_type){
                var type={'team':'团队订单','fit':'跟团游'};
                if(order_type)where.order_type=type[order_type];
                var url=$__app__ + '/OrderAdmin/order_simple';
                is_this.load_img('show');
                items_box.hide();
                is_this.AjaxJson({
                    url:url,
                    data:where
                },function(v,r){
                    is_this.load_img('hide');
                    items_box.show();
                    if(v.status==0)return false;
                    var tpl=order_list_tpl(v.root);
                    var order_list=$('.order-list ul');
                    is_this.page_load({
                        count:v.total,
                        limit:20,
                        to_type:to_type,
                        id:order_list,
                        tpl:tpl
                    },function(p,c,l){
                        load_ajax({start:p,limit:l},'append');
                    });

                   /* if(to_type=='append'){
                        order_list.append(tpl);
                        var h_w=$(document).height()-$(window).height()*2;
                        $(window).scrollTop(h_w);
                    }else{
                        order_list.html(tpl);
                    }
                    var page=(parseFloat(r.data.start)+1);
                    if(Math.ceil(v.total/r.data.limit)-1<=page)load_data.html('已加载全部');
                    load_data.attr('page-data', page);
                    load_data_fn();*/
                });
            };

            function load_data_fn(){
                load_data.unbind();
                load_data.click(function(){
                    if($(this).html()=='已加载全部')return false;
                    var page=$(this).attr('page-data');
                    load_ajax({start:page,limit:20},'append');
                });
            }

            /**
             * 渲染订单列表(列表)
             * @param data
             * @returns {string}
             */
            function order_list_tpl(data){
                var len=data.length;
                var list_text='';
                for(var i= 0;i<len;i++){
                    list_text+=tpl_find(data[i]);
                }
                return list_text;
            };

            /**
             * 渲染订单列表(单条)
             * @param row
             * @returns {string}
             */
            function tpl_find(row){
                var status_color={ '待确认':'#009999', '已确认':'#578F00', '退票':'#999'};
                var pop={big:0,small:0};
                var row_detail=row.o_room_detail;
                if(row_detail){
                    for(var p in row_detail){
                        var rw=row_detail[p];
                        var num=parseFloat(rw.num);
                        if(num<=0 || !num)continue;
                        if(rw.t_preset_type=='成人票' || rw.t_preset_type=='全陪票'){
                            pop.big+=num;
                        }else{
                            pop.small+=num;
                        }
                    }
                };
                var pop_txt='';
                if(pop.big>0)pop_txt=pop.big+'大';
                if(pop.small>0)pop_txt+=pop.small+'小';
                if(row.o_status=='收款中')row.o_status='已确认';
                return '<li class="o-l">' +
                    '<a href="'+$__app__ + "/Mobile/order_detail/id/"+row.o_number+'"><div class="o-title"><span class="o-status" style="color:'+status_color[row.o_status]+';">'+row.o_status+'</span>'+row.o_product_name+'</div>' +
                    '<div class="o-detail">' +
                    '<span class="o-time"><dl>' +
                    '<dd class="ot-l date">日期：'+int2float(row.o_start_date)+' 至 '+int2float(row.o_end_date)+'</dd>' +
                    '<dd class="ot-l number">编号：'+row.o_number+'</dd>' +
                    '</dl>' +
                    '</span>' +
                    '<span class="o-price"><dl><dd class="op-l money">￥'+parseFloat(row.o_settle_real).toFixed(0)+'</dd><dd class="op-l pop">'+pop_txt+'</dd></dl>' +
                    '</span>' +
                    '</div></a>' +
                    '<div class="o-org"><dl><dd class="oo-r"><font style="color:#f50">卖：</font><a href="tel:o_service_tel">'+row.o_service_name+'</a></dd><dd><font style="color:green">买：</font>'+row.o_sorg_name+'</dd></dl></div>' +
                    '</li>';
            };

            var nav_l=$('.nav-list').find('.nav-l');
            nav_l.unbind();
            nav_l.click(function(){
                nav_l.removeClass('nav-hover');
                $(this).addClass('nav-hover');
                var status_val=$(this).html();
                var where={start:0,limit:20};
                if(status_val!='全部')where.o_status=status_val;
                load_ajax(where);
            });

            var store=function(skey){
                is_this.AjaxJson({
                    url:$__app__ + '/OrderAdmin/search_json',
                    data:{keylike:skey}
                },function(v,r){
                    search_list_tpl(v.root);
                });
            };
            $.WapBox({
                id: $('.glyphicon-search'),
                back_id:$('#wap-box'),
                top_id:$('.items-box'),
                store:store
            });
            var box_cls=$('.box-cls');
            box_cls.unbind();
            box_cls.click(function(){
                $('#wap-box').show();
                $('.items-box').hide();
            });

            function search_list_tpl(data){
                var tpl='';
                for(var i=0;i<data.length;i++){
                    var rows=data[i];
                    tpl+='<li class="it-list" data-id="'+rows.o_number+'">【'+rows.o_product_num+'】'+ rows.o_product_name+'</li>';
                }
                $('.items-list ul').html(tpl);
                list_hover();
            };

            function list_hover(){
                var it_list=$('.it-list');
                it_list.unbind();
                it_list.click(function(){
                    var number=$(this).attr('data-id');
                    var where={start:0,limit:20,number:number};
                    load_ajax(where);
                    $('#wap-box').show();
                    $('.items-box').hide();
                });
            };
        },
        UserListJs:function(){
            var u_list=$('.u-list');
            u_list.unbind();
            u_list.click(function(){
                var bus_id=$(this).find('.bus');
                if(bus_id.attr('style')=='display: block;'){
                    bus_id.hide();
                }else{
                    bus_id.show();
                }
            });
            var u_open=$('.u-open');
            u_open.unbind();
            u_open.click(function(){
                var gly=$(this).find('.gly');
                if(gly.html()=='展开大交通'){
                    u_list.find('.bus').show();
                    gly.html('收起大交通');
                }else{
                    u_list.find('.bus').hide();
                    gly.html('展开大交通');
                }
            });
        },
        msg_bk:function(type){
            var body=$('body');
            if(bk_bool==true){
                body.append('<div class="BackgroundAlert"></div>');
                bk_bool=false;
            }
            var bk_alert=$('.BackgroundAlert');
            bk_alert.css({height:$(window).height()});
            if(type=='show'){
                bk_alert.show();
            }else{
                bk_alert.hide();
            }
        },
        /**
         * 手机手动拖拽
         * @param opt
         */
        touch_move:function(opt){
            var touch_id=opt.id;
            var x_left= 0,mv_left=0;
            var touch_width=touch_id.width()-$(window).width();
            if(opt.type=='top')touch_width=touch_id.height()-$(window).height();
            if(opt.diff)touch_width+=opt.diff;
            touch_id.off().on('touchstart',function(e){
                var event=e.originalEvent,left_w=$(this).position().left,th_w=event.changedTouches[0].clientX;
                if(opt.type=='top')left_w=$(this).position().top;
                x_left= th_w-left_w;
            }).on('touchmove',function(e){
                var event=e.originalEvent,x= event.changedTouches[0].clientX;
                if(opt.type=='top')x=event.changedTouches[0].clientY;
                x=x-x_left;
                mv_left=x;
                var css_data={transform:'translate('+x+'px,0px)',left:x};
                if(opt.type=='top')css_data={transform:'translate(0px,'+x+'px)',top:x};
                touch_id.css(css_data);
            }).on('touchend',function(e){
                var left_w=$(this).position().left,tr_move=true,range_w=0;
                if(opt.type=='top')left_w=$(this).position().top;
                if(left_w>0){
                    range_w=0;
                    tr_move=false;
                }else if((0-left_w)>touch_width){
                    range_w=(0-touch_width);
                    tr_move=false;
                }else{
                    tr_move=true;
                };
                if(tr_move===false){
                    var css_data={transform:'translate('+range_w+'px,0px)',left:range_w};
                    if(opt.type=='top')css_data={transform:'translate(0px,'+range_w+'px)',top:range_w};
                    touch_id.css(css_data);
                }
            });
        },
        /**
         * 手机翻页
         * @param count 总数
         * @param limit 每页
         * @param obj
         */
        page_load:function(opt,obj){
            var count=opt.count,limit=opt.limit;
            var load_data=$('.load-data');
            var page=parseFloat(load_data.attr('page-data'))+1;
            var total=Math.ceil(count/limit);
            if(opt.to_type=='append'){
                opt.id.append(opt.tpl);
                var h_w=$(document).height()-$(window).height()*2;
                $(window).scrollTop(h_w);
            }else{
                opt.id.html(opt.tpl);
            }
            if(total<=page)load_data.html('已加载全部');else load_data.html('加载更多数据')
            load_data.attr('page-data', page);
            load_data.unbind();
            load_data.click(function(){
                if($(this).html()=='已加载全部')return false;
                var page=$(this).attr('page-data');
                if(obj)obj(page,count,limit);
            });
        },
        ProductList:function(){
            var is_this=this;
            var is_page=10;
            var city_data=web_site;
            var glyphicon_chevron_down=$('.term-cls .glyphicon');
            var items_all=$('.items-all');
            glyphicon_chevron_down.unbind();
            glyphicon_chevron_down.click(function(){
                if($(this).hasClass('glyphicon-chevron-down')){
                    $(this).removeClass('glyphicon-chevron-down');
                    $(this).addClass('glyphicon-chevron-up');
                    items_all.show();
                    is_this.msg_bk('show');
                }else{
                    $(this).addClass('glyphicon-chevron-down');
                    $(this).removeClass('glyphicon-chevron-up');
                    items_all.hide();
                    is_this.msg_bk('hide');
                }
            });
            $(window).load(function(){
                search_load({start:0,limit:is_page,city_data:city_data});
                load_series();
            });
            //加载产品内容
            function search_load(data,to_type){
                is_this.load_img('show');
                is_this.AjaxJson({
                    url:$__app__+'/ProductsList/mongo_search',
                    data:data
                },function(v,r){
                    is_this.load_img('hide');
                    var goods_list=$('.goods_list ul');
                    is_this.page_load({
                        count:v.count,
                        limit:is_page,
                        to_type:to_type,
                        id:goods_list,
                        tpl:items_list_html(v.data)
                    },function(p,c,l){
                        search_load({start:p*l,limit:l,city_data:city_data},'append');
                    });
                    setTimeout(function(){
                        is_this.img_width_height(goods_list.find('img'));
                    },200)
                });
            };
            function items_list_html(data){
                var tpl='';
                $.each(data,function(i,v){
                    tpl+=tpl_find(v);
                });
                return tpl;
            };
            function tpl_find(row){
                var p_cover=row.p_cover;
                if(!p_cover)p_cover='./Public/Images/cover-img.png';
                var tags='';
                if(row.key_sys){
                    $.each(row.key_sys,function(i,v){ tags+='<i class="tag-cls" style="color:'+ v.pk_color+';background:'+ v.pk_bgcolor+'">'+ v.pk_name+'</i>'; });
                    tags='<dd class="gsr-l tag">'+tags+'</dd>';
                }
                return '<a href="'+$__app__+'/Mobile/detail/id/'+row.p_oid+'"><li class="g-l">' +
                    '<div class="gs-left"><img src="/'+p_cover+'"></div>' +
                    '<div class="gs-right">' +
                    '<dl><dd class="gsr-l title">['+row.p_series+'] '+row.p_name+'</dd>'+tags+'<dd class="gsr-l money">￥<span class="price">'+row.ticket_min+'</span>起</dd></dl>' +
                    '</div></li></a>';
            };

            //加载产品系列
            function load_series(){
                is_this.AjaxJson({
                    url:$__app__+'/ProductsList/search_top_json',
                    data:{type:'p_series'}
                },function(v,r){
                    var term_cls=$('.term-cls');
                    var row= v.root,ser_tpl='';
                    $.each(row,function(i,v){
                        ser_tpl+='<li class="tm-l">'+ v.pi_key+'</li>';
                    });
                    ser_tpl='<li class="tm-l tm-hover">全部产品</li>'+ser_tpl+'<li class="clear"></li>';
                    term_cls.find('.items').html(ser_tpl);
                    term_cls.find('.items-all').html(ser_tpl);
                    term_type_fn();
                    is_this.touch_move({
                        id:$('.term-cls .items'),
                        type:'left',
                        diff:50
                    });
                });
            }


            var store=function(skey){
                if(!skey)return false;
                is_this.AjaxJson({
                    url:$__app__ + '/ProductsList/mongo_search',
                    data:{list:skey}
                },function(v,r){
                    search_list_tpl(v.data);
                });
            };

            $.WapBox({
                id: $('.glyphicon-search'),
                back_id:$('#wap-box'),
                top_id:$('.items-box'),
                store:store
            });

            var box_cls=$('.box-cls');
            box_cls.unbind();
            box_cls.click(function(){
                $('#wap-box').show();
                $('.items-box').hide();
            });

            function search_list_tpl(data){
                var tpl='';
                $.each(data,function(i,v){
                    tpl+='<li class="it-list" data-id="'+v.p_num+'">【'+v.p_series+'】'+ v.p_name+'</li>';
                });
                $('.items-list ul').html(tpl);
                list_hover();
            };

            function list_hover(){
                var it_list=$('.it-list');
                it_list.unbind();
                it_list.click(function(){
                    var number=$(this).attr('data-id');
                    var where={start:0,limit:is_page,city_data:city_data,list:number};
                    search_load(where);
                    $('#wap-box').show();
                    $('.items-box').hide();
                });
            };

            //选择产品系列
            function term_type_fn(){
                var term_cls=$('.term-cls').find('.tm-l');
                term_cls.unbind();
                term_cls.click(function(){
                    var series=$(this).html();
                    var where={start:0,limit:is_page,city_data:city_data};
                    if(series!='全部产品' && series)where.series=series;
                    term_cls.removeClass('tm-hover');
                    $(this).addClass('tm-hover');
                    search_load(where);
                });
            };


        },
        /**
         * 前后台交互
         * @param store
         * @param obj
         * @constructor
         */
        AjaxJson:function(store,obj){
            $.ajax({
                type:"POST",
                url:store.url,
                data:store.data,
                success:function (msg) {
                    var data = msg;
                    if (typeof msg != 'object')
                        data = eval("(" + msg + ")");
                    if(obj)obj(data,store);
                }
            });
        }
    };
});