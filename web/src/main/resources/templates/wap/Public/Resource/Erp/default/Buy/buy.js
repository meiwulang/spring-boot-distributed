/**
 * Created by zhushaolei on 2016/1/22.
 */
var Ticket={};
var CheckBool=false;
var BusNum=0;
var TaStore={};
$(function(){
    BusNum=seat_num.surplus_num;
    traffic_click_fn();
    function traffic_click_fn(){
        var traffic_cls=$('.traffic-cls');
        traffic_cls.unbind();
        traffic_cls.click(function(){
            var fa_angle=$(this).find('.fa');
            var ticket_list=$(this).parents('.ticket-list');
            if(fa_angle.hasClass('fa-angle-down')){
                ticket_list.find('.traffic-main').show();
                fa_angle.removeClass('fa-angle-down');
                fa_angle.addClass('fa-angle-up');
            }else{
                ticket_list.find('.traffic-main').hide();
                fa_angle.removeClass('fa-angle-up');
                fa_angle.addClass('fa-angle-down');
            }
        });
    }
    //页面打开后去后台拉票价数据
    //$(window).load(function(){ ticket_url() });
    setTimeout(function(){ ticket_url(); },500);
    function ticket_url(){
        var bl_id=$('input[name=bl_id]').val();
        $.ajax({
            type:"POST",
            url:$__app__ + "/Buy/buy_ticket_ajax",
            data:{ bl_id:bl_id,number:number_id },
            success:function (msg) {
                var data = msg;
                if (typeof msg != 'object')
                    data = eval("(" + msg + ")");
                var info = data.info;
                if (data.status == 1) {
                    if(info.total>0){
                        if(typeof info.order=='object' && number_id)order_view(info.order,info.ob_id);
                        TaStore=info.ta_store;
                        traffic_view(info.traffic,info.groups,info.data);
                        ticket_view(info.data);
                    }
                }
            }
        });
    };

    function traffic_view(data,groups,root){
        var traffic_type=$('.traffic-type');
        var traffic_go=traffic_view_tpl(data,'go');
        traffic_type.find('.tft-go').html(traffic_go);
        var traffic_back=traffic_view_tpl(data,'back');
        traffic_type.find('.tft-back').html(traffic_back);
        home_traffic_view(groups);
        select_home(groups);
        select_traffic(groups);

        var groups='',traffic=[];
        $.each(root,function(i,v){
            if(v.num>0){
                if(!groups)groups=v.ta_groups;
                traffic.push(v.t_groups);
            }
        });
        if(groups){
            //操作住宿
            var hg_list=$('.hg-list');
            hg_list.removeClass('hg-hover');
            $.each(hg_list,function(hi,hv){
                var h_row=hg_list.eq(hi);
                if(h_row.attr('data-val')==groups)h_row.addClass('hg-hover');
            });

            //操作交通
            var tg_list=$('.check-cls');
            var check_cls=document.getElementsByClassName('check-cls');
            $.each(tg_list,function(hi,hv){
                var t_row=tg_list.eq(hi);
                if(in_array(t_row.attr('data-val'),traffic)!=-1){
                    check_cls[hi].checked=true;
                }
            });
        }
    }

    /**
     * 渲染住宿、交通
     * @param groups
     */
    function home_traffic_view(groups,type){
        //渲染住宿分组
        var home='',home_num= 0,traffic='',traffic_id=[];
        for(var hi in groups){
            var home_row=groups[hi];
            home+='<li class="hg-list" data-val="'+home_row.name+'">'+home_row.name+' <i class="hg-num">'+home_row.num+'</i></li>';
            home_num+=home_row.num;
            for(var ti in home_row['items']){
                var items_row=home_row['items'][ti];
                if(in_array(items_row.name,traffic_id)==-1){
                    traffic+='<li class="tg-list"><label class="tg-select"> <input type="checkbox" class="check-cls" data-val="'+items_row.name+'">'+items_row.name+'</label></li>';
                    traffic_id.push(items_row.name);
                }

            }
        }
        if(type!='find')$('.home-group').find('ul').html('<li class="hg-list hg-hover">全部 <i class="hg-num">'+home_num+'</i></li>'+home+'<li class="clear"></li>');
        //渲染交通分组
        $('.traffic-group').find('ul').html('<li class="tg-list tg-hover"><label class="tg-select"> <input type="checkbox" class="check-cls" checked="checked">全部</label></li>'+traffic+'<li class="clear"></li>');
        select_traffic(groups);
    }

    //大交通筛选列表
    function traffic_view_tpl(data,type){
        var type_name='去程';
        if(type=='back')type_name='返程';
        data=data[type_name];
        if(!data)return '<label class="tf-select tf-title" traffic-type="'+type+'">交通('+type_name+'):</label>' +
            '<label class="tf-select"><input type="checkbox" value="不含" class="traffic-id" checked="checked" traffic-type="'+type+'"> 其他</label>';
        var traffic='<label class="tf-select tf-title" traffic-type="'+type+'">交通('+type_name+'):</label>';
        var site_data=[];
        $.each(data,function(i,v){
            if(!v)return true;
            if(in_array(v.f_traffic_name,site_data)!=-1)return true;
            site_data.push(v.f_traffic_name);
            traffic+='<label class="tf-select">' +
                '<input type="checkbox" value="'+ v.f_traffic_name+'" class="traffic-id" checked="checked" traffic-type="'+type+'"> '+ v.f_traffic_name+'</label>';
        });
        traffic+='<label class="tf-select"><input type="checkbox" value="不含" class="traffic-id" checked="checked" traffic-type="'+type+'"> 其他</label>';
        return traffic;
    }

    function select_home(data){
        //操作店酒分组时候
        var hg_list=$('.hg-list');
        hg_list.unbind();
        hg_list.click(function(){
            hg_list.removeClass('hg-hover');
            $(this).addClass('hg-hover');
            var home_val=$(this).attr('data-val');
            if(home_val){
                home_traffic_view([data[home_val]],'find');
            }else{
                home_traffic_view(data,'find');
            }
            ticket_show();
        });
    };
    //操作交通分组时候
    function select_traffic(data){
        var check_cls=$('.tg-list');
        check_cls.unbind();
        check_cls.click(function(){
            ticket_show();
        });
    };
    //根据筛选条件查询票价
    function ticket_show(){
        var ticket_list=$('.ticket-list');
        //房的信息处理
        var home_group=$('.home-group');
        var home_val=home_group.find('.hg-hover').attr('data-val');
        //交通信息处理
        var check_cls=$('.check-cls'),traffic_id=[];
        var tg_list=$('.tg-list');
        var check_js=document.getElementsByClassName('check-cls');
        tg_list.removeClass('tg-hover');
        for(var ci=0;ci<check_cls.length;ci++){
            var check_id=check_cls.eq(ci);
            var check_ed=check_js[ci];
            var check_val=check_id.attr('data-val');
            if(check_ed.checked && check_val){ traffic_id.push(check_val); }
            if(check_ed.checked)check_id.parents('.tg-list').addClass('tg-hover');
        }
        //当住宿是全部、交通分组为全部时执行
        if(!home_val && traffic_id.length<=0){
            ticket_list.removeClass('ticket-hide');
            return false;
        }
        ticket_list.addClass('ticket-hide');
        for(var i=0;i<ticket_list.length;i++){
            var row=ticket_list.eq(i);
            var home_gp=row.attr('home-groups');
            var traffic_gp=row.attr('traffic-groups');
            //查询出是当前住宿，且是选中交通分组的票价
            if(home_gp==home_val && in_array(traffic_gp,traffic_id)!=-1) row.removeClass('ticket-hide');
            //当交通为全部时
            if(home_gp==home_val && traffic_id.length<=0) row.removeClass('ticket-hide');
            //当有住宿无交通时
            if(home_gp==home_val && traffic_gp=='其他') row.removeClass('ticket-hide');
            //当有交通无住宿时
            if(home_gp=='其他' && in_array(traffic_gp,traffic_id)!=-1) row.removeClass('ticket-hide');
            //当两都没时
            if(home_gp=='其他' && traffic_gp=='其他') row.removeClass('ticket-hide');
            //当没选住宿时
            if(!home_val && (in_array(traffic_gp,traffic_id)!=-1 || traffic_gp=='其他')) row.removeClass('ticket-hide');
        }
    }


    function ticket_id_show(){
        return false;
        var traffic_go=[],traffic_back=[];
        var go_id=$('.tft-go').find('.traffic-id');
        var back_id=$('.tft-back').find('.traffic-id');
        //选择去程信息
        $.each(go_id,function(gi,gv){
            var row_id=go_id.eq(gi);
            if(row_id.attr('checked')=='checked'){
                traffic_go.push(row_id.val());
            }
        });
        //选择返程信息
        $.each(back_id,function(bi,bv){
            var row_id=back_id.eq(bi);
            if(row_id.attr('checked')=='checked'){
                traffic_back.push(row_id.val());
            }
        });
        //操作返程、去程
        var ticket_list=$('.ticket-list');
        for(var ti=0;ti<ticket_list.length;ti++){
            var row_tid=ticket_list.eq(ti);
            var start_type=row_tid.attr('start-type');
            var end_type=row_tid.attr('end-type');
            if(in_array(start_type,traffic_go)!=-1 &&  in_array(end_type,traffic_back)!=-1){
                row_tid.show();
            }else{
                row_tid.hide();
            }
        }
    }

    function order_view(data,ob_id){
        var buy_from=$('.buy-from');
        $.each(buy_from,function(i,v){
            var f_id=buy_from.eq(i);
            var name_id=f_id.attr('name');
            if(f_id.attr('type')=='radio'){
                if(f_id.val()==data.o_payment_type)f_id.attr('checked','checked');
                return true;
            };
            if(name_id=='out_number')name_id='o_out_num';
            if(name_id=='pact_number')name_id='o_deal_num';
            var v_l=data[name_id];
            if(!v_l)return true;
            buy_from.eq(i).val(v_l);
        });

        $('.days-id').html(data.o_days);
        $('.week_id').html('('+data.end_week+')');
        var end_id=$('.end-id');
        var end_date_id=$('.end-date-id');
        end_id.val(data.o_end_date);
        end_date_id.html(int2date(data.o_end_date));
        //当安排过接送计划后不可修改返程日期
        if(data.tp_back>0){
            end_id.hide();
            end_date_id.show();
            end_date_id.attr('title','当前订单返程有安排过计划的游客，如果需要修改请先撤销接送计划！');
        }
        //当票务已经出票后不可修改返程日期
        if(data.fly_back>0){
            end_id.hide();
            end_date_id.show();
            end_date_id.attr('title','当前订单返程有大交通已出票的游客，如果需要修改请先撤消！');
        }

        Ext.getCmp('buy_org').setValue(data['o_sorg_name']);
        Ext.getCmp('buy_org').setDisabled(true);
        Ext.getCmp('buy_id').setValue(data['o_name']);
        Ext.getCmp('buy_id').setDisabled(true);
        $('.site_city').html(data.o_sorg_city);
        if(data['o_source_name'])Ext.getCmp('source_name').setValue(data['o_source_name']);
        //Ext.getCmp('source_name').setDisabled(true);
        if(ob_id>0){
            Ext.getCmp('source_name').setDisabled(true);
            $('.source-msg').html('当前订单已经生成账单，不可修改结算单位！');
        }
        $('input[name=buy_org]').val(data['o_sorg_id']);
        $('input[name=buy_uid]').val(data['o_uid']);
        if(data.o_sorg_id!=data.o_pay_org){
            var credit= $('.org_credit');
            credit.attr('data-val',999999999);
            credit.find('.a-money').html('网络平台结算,额度不受限制');
            credit.find('.a-msg').html('');
        }
    }

    /**
     * 渲染票价信息
     * @param data
     */
    function ticket_view(data){
        Ticket=data;
        var ticket_content=$('.ticket-content');
        //票价信息
        var td_tpl=ticket_detail(Ticket);
        ticket_content.find('ul').html(td_tpl);
        traffic_click_fn();
        adjust_handle();
        //房差的修改
        room_poor_data();

        //游客信息
        var tour_content=$('.tour-content');
        var tour_info=tour_content.parents('.tour-info');
        var room_tpl='';
        room_tpl=tourist_detail(Ticket);
        if(room_tpl){
            tour_content.html(room_tpl);
            tour_info.show();
        }else{
            tour_info.hide();
        }
        seat_save();
        pos_detail(Ticket);

        fa_click();
        sell_favourable_fn();

        //选择上车站点信息
        site_select_box();

        //选择大交通信息
        //select_traffic_type();

        //select_traffic_type_fn();

        ticket_id_show();
        ticket_show();
        //批量添加游客信息
        batch_user_fn();
    };

    /**
     * 所有票价模板
     * @param data
     * @returns {string}
     */
    function ticket_detail(data){
        //统计主票库存
        var ta_store={};
        $.each(data,function(di,dv){
            var num=parseFloat(dv.num);
            if(!num)num=0;
            if(ta_store[dv.t_standards_id]){
                ta_store[dv.t_standards_id]+=num;
            }else{
                ta_store[dv.t_standards_id]=num;
            }
        });

        var tpl='';
        $.each(data,function(i,v){
            tpl+=ticket_detail_find(v,ta_store);
        })
        return tpl;
    };

    /**
     * 单条票价模板
     * @param data
     * @returns {string}
     */
    function ticket_detail_find(data,max){
        var bl_start_date=$('input[name=bl_start_date]').val();
        var bl_end_date=$('input[name=bl_end_date]').val();

        //大交通信息
        var traffic={ 飞机:'plane',火车:'subway',高铁:'train',动车:'train',轮船:'ship',汽车:'bus'};
        var fly='';
        if(typeof data.t_traffic_all=='object'){
            $.each(data.t_traffic_all,function(i,v){
                v.f_start_date=bl_start_date;
                if(v.f_traffic_type=='返程')v.f_start_date=bl_end_date;
                if(v.f_traffic_start_place)v.f_traffic_start_place=(v.f_traffic_start_place).replace('市','');
                if(v.f_traffic_end_place)v.f_traffic_end_place=(v.f_traffic_end_place).replace('市','');
                fly+='<tr>' +
                    '<td class="trt-goto"><i class="xj-icon"></i>'+ v.f_traffic_type+'</td>' +
                    '<td class="trt-date">['+v.f_start_date+']</td>' +
                    '<td class="trt-city">'+ v.f_traffic_start_place+' → '+ v.f_traffic_end_place+'</td>' +
                    '<td class="trt-fly"><i class="fa fa-'+ traffic[v.f_traffic_name]+'"></i>'+ v.f_traffic_name+'</td>' +
                    '<td class="trt-ssite">'+ v.f_traffic_start+'</td>' +
                    '<td class="trt-icon"></td>' +
                    '<td class="trt-esite">'+ v.f_traffic_end+'</td>' +
                    '</tr>';
            });
        };

        //房差信息
        var root_tpl='',out_room_price='';;
        if(data.t_spread_price>0){
            var bl_room='';
            var room_money=(parseFloat(data.poor_num)*parseFloat(data.t_spread_price)).toFixed(2);
            var t_spread_price=parseFloat(data.t_spread_price).toFixed(2);
            var room_poor='';
            var start_room_disable='',end_room_disable='';
            if(!data.t_out_room_price)data.t_out_room_price=0;
            //退房差时体现
            if(parseFloat(data.poor_num)<0){
                room_money=(parseFloat(data.poor_num)*parseFloat(data.t_out_room_price)).toFixed(2);
                t_spread_price=parseFloat(data.t_out_room_price).toFixed(2);
                if(parseFloat(data.t_spread_price)!=0)out_room_price='(补差:￥'+parseFloat(data.t_spread_price).toFixed(2)+')';
            }else{
                if(parseFloat(data.t_out_room_price)!=0)out_room_price='(退差:￥'+parseFloat(data.t_out_room_price).toFixed(2)+')';
            }

            if(data.room_poor==true)room_poor='checked=checked';
            if(data.t_room==='9999999'){
                if(data.t_room=='房源充足，可自由选择'){
                    bl_room='<label><input type="checkbox" class="room_poor" '+room_poor+' t_id="'+data.t_id+'" style="display:none"> ' +
                        '<em class="room-cls"><i class="room-type">不同意拼房，愿意支付房差费用</i>:' +
                        '补<i class="room-num">'+data.poor_num+'</i>间 × ￥<i class="price-ic">'+t_spread_price+'</i> = ￥' +
                        '<i class="money-ic">'+room_money+'</i> '+out_room_price+'</em>' +
                        '</label>';
                    //可选择房间数
                    if(data.room_poor==true){
                        var r_num=(data.num+data.num%2)/2;
                        //if(data.room_num>r_num)start_room_disable='';
                        if(data.room_num>0)start_room_disable='';
                        if(parseFloat(data.num)>data.room_num)end_room_disable='';
                    }

                }else if(data.t_room=='必须补房差'){
                    bl_room='<label>' +
                        '<em class="room-cls"><i class="room-type">必须补房差，房差费用</i>:' +
                        '补<i class="room-num">'+data.poor_num+'</i>间 × ￥<i class="price-ic">'+t_spread_price+'</i> = ￥' +
                        '<i class="money-ic">'+room_money+'</i></em>' +
                        '</label>';
                }else{
                    bl_room='<label><em class="room-cls"><i class="room-type">不能选房，只能拼房</i></label>';
                }
            }else{
                var poor_num=parseFloat(data.room_num)-parseFloat(data.num);
                if(data.t_preset_type!='成人票')poor_num=parseFloat(data.room_num);
                if(poor_num<0){
                    room_money=(poor_num*parseFloat(data.t_out_room_price)).toFixed(2);
                    t_spread_price=parseFloat(data.t_out_room_price).toFixed(2);
                    if(parseFloat(data.t_spread_price)!=0)out_room_price='(补差:￥'+parseFloat(data.t_spread_price).toFixed(2)+')';
                }else{
                    room_money=(poor_num*parseFloat(data.t_spread_price)).toFixed(2);
                    t_spread_price=parseFloat(data.t_spread_price).toFixed(2);
                    if(parseFloat(data.t_out_room_price)!=0)out_room_price='(退差:￥'+parseFloat(data.t_out_room_price).toFixed(2)+')';
                }
                bl_room='<label>' +
                    '<em class="room-cls"><i class="room-type">愿意支付房差费用</i>:' +
                    '补<i class="room-num">'+poor_num+'</i>床位 × ￥<i class="price-ic">'+t_spread_price+'</i> = ￥' +
                    '<i class="money-ic">'+room_money+'</i> '+out_room_price+'</em>' +
                    '</label>';
            }
            if(data.room_num<=0)start_room_disable='disable';
            if(data.room_num>=data.num*2)end_room_disable='disable';
            root_tpl='<dd class="tlm-list tlm-ticket">' +
                '<span class="tlm-name">床位</span>' +
                '<span class="tlm-select">' +
                '<em class="lg_adjust">' +
                '<span class="last not-selected '+start_room_disable+'" data-val="-">' +
                '<i class="line-open line-horizon"></i>' +
                '</span>' +
                '<input type="text" value="'+data.room_num+'" class="num_pop" t_id="'+data.t_id+'" fields="room_num" readonly="readonly">' +
                '<span class="next not-selected '+end_room_disable+'" data-val="+">' +
                '<i class="line-open line-horizon"></i>' +
                '<i class="line-open line-vertical"></i>' +
                '</span></em></span>' +
                '<span class="tlm-msg"> (2人间) '+bl_room+'</span></dd>';
        }
        var t_price=parseFloat(data.t_price).toFixed(2);
        var start_disable='',end_disable='',start_site_type='start-type="不含"',end_site_type='end-type="不含"';
        var t_money=(parseFloat(data.t_price)*parseFloat(data.num)).toFixed(2);
        if(parseFloat(data.num)<=0)start_disable='disable';
        if(parseFloat(data.num)>=(BusNum+parseFloat(data.num)))end_disable='disable '+BusNum;
        if(parseFloat(data.num)>=data.t_store && data.t_store>=0)end_disable='disable';
        if(data['去程'])start_site_type='start-type="'+data['去程']['f_traffic_name']+'"';
        if(data['返程'])end_site_type='end-type="'+data['返程']['f_traffic_name']+'"';
        var groups_val='';

        //判断主票库存信息
        var max_msg='';
        if(TaStore[data.t_standards_id]){
            var t_store=TaStore[data.t_standards_id]['t_store'];
            if(t_store<=max[data.t_standards_id]){
                end_disable='disable';
                max_msg='<font style="font-size: 12px;color: red">* '+data.ta_name+' 已经是最大库存!</font>';
            }
        }

        if(data.t_groups=='其他')groups_val=' <font style="font-size:12px;color:red">(未分组)</font>'
        var tpl='<li class="ticket-list ticket-id-'+data.t_id+'" '+start_site_type+' '+end_site_type+' home-groups="'+data.ta_groups+'" traffic-groups="'+data.t_groups+'">' +
            '<div class="tl-title">' +
            '<span class="traffic-cls">查看大交通信息<i class="fa fa-angle-down"></i></span>' +
            '<span class="tname-cls"><em class="taname-cls">['+data.ta_name+']</em>'+data.t_standards_name+groups_val+'</span>' +
            '</div>' +
            '<div class="tl-main"><dl>' +
            '<dd class="tlm-list tlm-ticket">' +
            '<span class="tlm-name">人数</span>' +
            '<span class="tlm-select">' +
            '<em class="lg_adjust">' +
            '<span class="last not-selected '+start_disable+'" data-val="-">' +
            '<i class="line-open line-horizon"></i>' +
            '</span>' +
            '<input type="text" value="'+data.num+'" class="num_pop" t_id="'+data.t_id+'" fields="num" readonly="readonly">' +
            '<span class="next not-selected '+end_disable+'" data-val="+">' +
            '<i class="line-open line-horizon"></i>' +
            '<i class="line-open line-vertical"></i>' +
            '</span>' +
            '</em>' +
            '</span>' +
            '<span class="tlm-msg"> × ￥<i class="price-ic">'+t_price+'</i> = ￥<i class="money-ic">'+t_money+'</i>('+data.t_preset_type+')</span>' +max_msg+
            '</dd>'+root_tpl+'</dl>' +
            '</div>' +
            '<div class="traffic-main">' +
            '<table class="table-route">'+fly+'</table>' +
            '</div>' +
            '</li>';
        return tpl;
    };

    /**
     * 批量添加游客
     * @param data
     * @returns {string}
     */
    function tourist_detail(data){
        var tpl='',vip_num=1;
        $.each(data,function(i,v){
            if(typeof v.t_seat!='object')return true;
            $.each(v.t_seat,function(si,sv){
                sv['t_index']=si;
                tpl+=tourist_detail_find(sv,vip_num,v);
                vip_num++;
            });
        });
        return tpl;
    }

    String.prototype.trim=function() {
        return this.replace(/(^\s*)|(\s*$)/g,'');
    }
    function tourist_detail_find(data,vip_num,ticket){
        var card_type=['身份证','护照','其他'];
        var option_tpl='';
        for(var i=0;i<card_type.length;i++){
            var type=card_type[i];
            var selected='';
            if(data.vip_card_type==type)selected='selected';
            option_tpl+='<option value="'+type+'" '+selected+'>'+type+'</option>';
        };
        var start_site='未选择站点',start_end='未选择站点',go_price='',to_price='';
        if(!data.goto_price)data.goto_price=0;
        if(!data.start_price)data.start_price=0;
        if(!data.end_price)data.end_price=0;
        //去程
        if(data.start_site)start_site=data.start_site;
        if(data.start_time)start_site='【'+data.start_time+'】 '+start_site;
        if(data.start_price!=0)to_price='<font class="goto_price_cls">(￥'+data.start_price+')</font>';
        //返程
        if(data.start_end)start_end=data.start_end;
        if(data.end_time)start_end='【'+data.end_time+'】 '+start_end;
        if(data.end_price!=0)go_price='<font class="goto_price_cls">(￥'+data.end_price+')</font>';

        //验证信息
        var mob_msg='',card_msg='',mob_cls='',card_cls='',mob_alert='',card_alert='';
        data.vip_mob = data.vip_mob.trim();
        if(!FORMCHECK.mobile(data.vip_mob)){
            if(!data.vip_mob && CheckBool==false){}else{
                mob_cls='disabled';
                mob_msg='<i class="fa fa-minus-circle" msg-data="手机号填写错误!"></i>';
                mob_alert='* 手机号填写错误!';
            }
        };

        data.vip_card = data.vip_card.trim().toUpperCase();
        var form_card=FORMCHECK.chechIdcard(data.vip_card,{limit_type:ticket.t_limit_type,limit_condition:ticket.t_limit_condition,card_type:data.vip_card_type});
        if(form_card['start']== 0){
            if(!data.vip_card && CheckBool==false){}else{
                card_cls='disabled';
                card_msg=form_card['info'];
                card_alert='* '+card_msg;
                card_msg='<i class="fa fa-minus-circle" msg-data="'+card_msg+'"></i>';
            }
        }
        var s_id='';
        if(data.s_id)s_id=data.s_id;

        //接送计划与票务管理处理
        var bus_ticket='',fly_tgo='',back_ticket='',fly_tback='',team_id='';
        //去程
        if(data.go_tpid>0)bus_ticket='<i class="fa fa-car" title="已经安排【去程】接送计划"></i> ';
        if(data.go_bus){
            if(data.go_fly.fly_status=='已出票')fly_tgo='<i class="fa fa-ticket" title="【去程】大交通票已出,如要编辑请去票务管理操作"></i>';
        }
        //返程
        if(data.back_tpid>0)back_ticket='<i class="fa fa-car" title="已经安排【返程】接送计划"></i> ';
        if(data.back_bus){
            //back_ticket+='<i class="fa fa-ticket" title="【返程】大交通票已出"></i>';
            if(data.to_fly.fly_status=='已出票')fly_tback='<i class="fa fa-ticket" title="【返程】大交通票已出,如要编辑请去票务管理操作"></i>';
        }
        if(data.team_id>0)team_id='<i class="fa fa-flag" style="color: blueviolet" title="已经安排过计划单，撤消此订单才可操作！"></i>';

        /**
         * 接送站点选择;
         * 1.没有始发站时无法选择接送
         * 2.有始发站时可以选择接送
         */
        var fly_go='<b>未安排班次</b>',fly_go_txt='',fly_to='<b>未安排班次</b>',
            fly_to_txt='',go_stock='',to_stock='',go_in= 0,to_in= 0;
        if(data.go_fly){
            var go_fly=data.go_fly;
            if(go_fly.fly_number){
                fly_go=go_fly.fly_number+' ('+go_fly.fly_start_time+'—'+go_fly.fly_end_time+')';
                fly_go_txt=go_fly.fly_start_name+'('+go_fly.fly_start_time+')—'+go_fly.fly_end_name+'('+go_fly.fly_end_time+')';
            }
            if(go_fly.tbd_id)go_stock='<font color="#26b4d3">(库存)</font>';
            if(go_fly.fly_inval==1)go_in=1;
        }
        if(data.to_fly){
            var to_fly=data.to_fly;
            if(to_fly.fly_number){
                fly_to=to_fly.fly_number+' ('+to_fly.fly_start_time+'—'+to_fly.fly_end_time+')';
                fly_to_txt=to_fly.fly_start_name+'('+to_fly.fly_start_time+')—'+to_fly.fly_end_name+'('+to_fly.fly_end_time+')';
            }
            if(to_fly.tbd_id)to_stock='<font color="#26b4d3">(库存)</font>';
            if(to_fly.fly_inval==1)to_in=1;
        }
        if(data.start_ticket==1)fly_go='<em>'+fly_go+'(不包含)</em>';
        if(data.end_ticket==1)fly_to='<em>'+fly_to+'(不包含)</em>';
        var start_select='<span class="site-select" data-type="去程">[编辑]</span> <span class="fly-name" title="'+fly_go_txt+'" site-name="'+data.site_start+'">'+fly_go+'</span>'+go_stock+
                '<span class="fly-select" data-type="去程" ticket-site="'+data.start_ticket+'">[编辑航班(次)]</span>',
            end_select='<span class="site-select" data-type="回程">[编辑]</span> <span class="fly-name" title="'+fly_to_txt+'" site-name="'+data.site_end+'">'+fly_to+'</span>'+to_stock+
                '<span class="fly-select" data-type="回程" ticket-site="'+data.end_ticket+'">[编辑航班(次)]</span>';
        if(fly_tgo)start_select='<span class="site-select" data-type="去程">[编辑]</span> <span class="fly-name" title="'+fly_go_txt+'">'+fly_go+'</span>'+fly_tgo;
        if(fly_tback)end_select='<span class="site-select" data-type="回程">[编辑]</span> <span class="fly-name" title="'+fly_to_txt+'">'+fly_to+'</span>'+fly_tback;
        if(start_site=='不含去程大交通不可选择站点') start_select='';
        if(start_end=='不含回程大交通不可选择站点') end_select='';


        var tpl='<li class="tour-list vip-cls" t_id="'+data.t_id+'" t_index="'+data.t_index+'" t_type="'+data.t_preset_type+'">' +
            '<i class="fa fa-times del-seat" title="删除当前游客!"></i>' +
            '<div class="tl-left tl-list">' +
            '<label class="vip_user_cls"><span class="tl-txt"><i class="fa-error"></i> 旅客'+vip_num+team_id+'</span>' +
            '<span class="tl-ticket"><input type="hidden" class="check-cls">'+data.t_name+'</span><br /><span class="tl-ticket-type">('+data.t_preset_type+')</span>' +
            '</label></div>' +
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
            '<label class="tlr-txt">身份</label>' +
            '<select name="vip_card_type" class="vip-from">' +option_tpl+'</select> ' +
            '<input type="text" name="vip_card" value="'+data.vip_card+'" class="ipt-card vip-from '+card_cls+'">' +card_msg +
            '</div>' +
            '<div class="msg-from">'+card_alert+'</div>' +
            '</span>' +

            '<span class="tlr-from vip-mob-id">' +
            '<div class="txt-from vip-list">' +
            '<label class="tlr-txt">手机</label>' +
            '<input type="text" name="vip_mob" value="'+data.vip_mob+'" class="ipt-phone vip-from '+mob_cls+'">'+mob_msg+
            '</div>' +
            '<div class="msg-from">'+mob_alert+'</div>' +
            '</span>' +

            '</dd>' +
            '<dd class="tlr-list map-id">' +
            '' +
            '<input type="hidden" value="'+s_id+'" name="s_id" class="vip-from">' +
            '<input type="hidden" value="'+data.start_site+'" name="start_site" class="vip-from">' +
            '<input type="hidden" value="'+data.start_time+'" name="start_time" class="vip-from">' +
            '<input type="hidden" value="'+data.start_sid+'" name="start_sid" class="vip-from">' +
            '<input type="hidden" value="'+data.start_map+'" name="start_map" class="vip-from">' +
            '<input type="hidden" value="'+data.start_end+'" name="start_end" class="vip-from">' +
            '<input type="hidden" value="'+data.start_price+'" name="start_price" class="vip-from">' +
            '<input type="hidden" value="'+data.end_time+'" name="end_time" class="vip-from">' +
            '<input type="hidden" value="'+data.end_sid+'" name="end_sid" class="vip-from">' +
            '<input type="hidden" value="'+data.end_map+'" name="end_map" class="vip-from">' +
            '<input type="hidden" value="'+data.end_price+'" name="end_price" class="vip-from">' +
            '<input type="hidden" value="'+data.goto_price+'" name="goto_price" class="vip-from">' +
            '<span class="site-goto-id"><i class="fa fa-map-marker"></i> 发车点:'+to_price+'<span class="map_site" title="'+start_site+'">'+start_site+'</span> <span class="site_type">' + bus_ticket +'</span>' +
            start_select+'</span>' +
            '<span class="site-goto-id"><i class="fa fa-map-marker"></i> 返回点:'+go_price+'<span class="map_site" title="'+start_end+'">'+start_end+'</span> <span class="site_type">' + back_ticket +'</span>' +
            end_select+'</span>'+
            '</dd></dl></div></li>';
        return tpl;
    }

    /**
     * 补房差操作
     */
    function room_poor_data(){
        var room_poor=$('.room_poor');
        room_poor.unbind();
        room_poor.click(function(){
            var t_id=$(this).attr('t_id');
            var options={};
            options.id=t_id;
            options.data={room_poor:true};
            ticket_save(options);
        });
    }

    /**
     * 票价选择事件
     */
    function adjust_handle(){
        var lg_adjust=$('.lg_adjust');
        var last_id=lg_adjust.find('.last');
        var next_id=lg_adjust.find('.next');
        var change_id=[
            {clickCls:last_id,type:"-"},
            {clickCls:next_id,type:"+"}
        ];
        $.each(change_id,function(i,v){
            var clickCls=v.clickCls;
            clickCls.unbind();
            clickCls.click(function(){
                if($(this).hasClass('disable'))return false;
                var adjust=$(this).parents('.lg_adjust');
                var pop_id=adjust.find('.num_pop');
                var num=pop_id.val();
                var t_id=pop_id.attr('t_id');
                var field=pop_id.attr('fields');
                if(v.type=='-' && field=='num'){
                    var t_bus=judge_ticket_bus(t_id);
                    if(t_bus){
                        layer.msg(t_bus);
                        return false;
                    }
                }
                adjust_pop(v.type,t_id,field);
            });
        });
    }

    /**
     * 判断大交通与接送计划是否存在
     * @param t_id
     */
    function judge_ticket_bus(t_id){
        var tour_list=$('.tour-list'),tour_bool=false,msg='';
        $.each(tour_list,function(i,v){
            var tour_id=tour_list.eq(i);
            if(tour_id.attr('t_id')==t_id){
                var ticket_title=tour_id.find('.fa-ticket').attr('title');
                var car_title=tour_id.find('.fa-car').attr('title');
                var team_title=tour_id.find('.fa-flag').attr('title');
                if(car_title){
                    tour_bool=true;
                    msg='当前票价中存在已经安排过的接送计划，请从游客列表中选择删除!';
                    return false;
                }

                if(ticket_title){
                    tour_bool=true;
                    msg='当前票价中存在已经出过的大交通票，请从游客列表中选择删除!';
                    return false;
                }
                if(team_title){
                    tour_bool=true;
                    msg='当前票价中存在已经安排过计划单的游客，请从计划单中撤消后，再来删除!';
                    return false;
                }
            }
        });
        if(tour_bool==true)return msg;
    }

    /**
     * 判断单条游客内部是否有大交通和接送计划
     * @param id 当前编号项目$(this)
     * @returns {*}
     */
    function find_seat_bus(id,type){
        var list_id=id.parents('.tour-list');
        var msg='';
        var fa_car=list_id.find('.fa-car');
        if(fa_car.attr('title')){
            msg='当前游客'+fa_car.attr('title')+',<br />如果需要'+type+'需要先撤销接送计划，<br />再来'+type+'!';
        }
        var fa_ticket=list_id.find('.fa-ticket');
        if(fa_ticket.attr('title')){
            /*layer.confirm('当前游客'+fa_ticket.attr('title')+',<br />删除后相应的大交通票也同样删除！',function(index){
             adjust_pop('-',t_id,'num',(parseFloat(t_index)+1));
             layer.msg('亲记得在下面收违约金哦!');
             });*/
            msg='当前游客'+fa_ticket.attr('title')+',<br />如果需要'+type+'需要先退掉大交通票，<br />再来'+type+'!';
        }
        if(type=='删除'){
            var fa_flag=list_id.find('.fa-flag');
            if(fa_flag.attr('title')) msg='当前游客已经安排过计划单，请从计划单中撤消后，再来删除!';
        }
        if(msg)return msg;
    }

    /**
     * 修改票价信息与房间个数
     * @param type 正或负
     * @param tid 需要修改的ID
     * @param field 需要修改的字段
     */
    function adjust_pop(type,tid,field,rm_id){
        var options={id:tid,data:{},type:{}};
        var num=1;
        if(type=='-')num=0-num;
        options.data[field]=parseFloat(num);
        options.type[field]='sum';
        if(rm_id)options.rm_id=rm_id;
        ticket_save(options);
    }

    function ticket_save(options){
        var t_data=json_save(Ticket,options);
        ticket_view(t_data);
    }

    /**
     * 修改座位数据
     */
    function seat_save(){
        var vip_from=$('.vip-from');
        vip_from.unbind();
        vip_from.change(function(){
            var vip_cls=$(this).parents('.vip-cls');
            var t_id=vip_cls.attr('t_id');
            var t_index=vip_cls.attr('t_index');
            var v_name=$(this).attr('name');
            if(typeof Ticket[t_id]!='object')return true;
            var ticket=Ticket[t_id];
            var old_seat=ticket['t_seat'][t_index];
            var seat=seat_find_data(vip_cls);
            if($.inArray(v_name,['vip_card_type','vip_name','vip_card'])!=-1){
                var fsb=find_seat_bus($(this),'修改');
                if(fsb){
                    layer.msg(fsb);
                    seat[v_name]=old_seat[v_name];
                    //return false;
                }
            }
            seat['t_id']=ticket.t_id;
            seat['t_name']=ticket.t_standards_name;
            seat['t_preset_type']=ticket.t_preset_type;
            seat['bus_num']=0;
            seat['seat_num']=0;
            seat=Ext.apply(old_seat,seat);
            ticket['t_seat'][parseFloat(t_index)]=seat;
            Ticket[t_id]=ticket;
            ticket_view(Ticket);
        });
    }

    function seat_find_data(t){
        var vip_from= t.find('.vip-from');
        var data={};
        $.each(vip_from,function(i,v){
            var vip_id=vip_from.eq(i);
            data[vip_id.attr('name')]=vip_id.val();
        });
        return data;
    }

    /**
     * 修改数据
     * @param data
     * @param opt
     * @returns {*}
     */
    function json_save(data,opt){
        if(typeof data!='object')return false;
        var json_data={},type_fd;
        if(opt.id) json_data=data[opt.id];
        if(typeof opt.data=='object'){
            $.each(opt.data,function(i,v){
                type_fd=i;
                if(typeof opt.type=='object'){
                    var type=opt.type;
                    if(type[i]=='sum')json_data[i]=parseFloat(json_data[i])+parseFloat(v);
                    if(i=='num'){
                        json_data['poor_num']=0;
                        json_data['room_poor']=false;
                    }
                    return true;
                };
                if(i=='room_poor'){
                    if(json_data[i]==true){
                        json_data[i]=false;
                        json_data['poor_num']=0;
                    }else{
                        json_data[i]=true;
                    }
                    return true;
                }
                json_data[i]=v;
            });
            //房间数=(人数-人数%2)/2
            var num=parseFloat(json_data['num']);
            /*if(json_data['t_room']=='必须补房差'){
                json_data['room_num']=(num+num%2)/2;
                json_data['poor_num']=parseFloat(num%2);
            }else if(json_data['t_room']=='房源充足，可自由选择' && json_data['room_poor']==true){
                json_data['poor_num']=num-2*(num-parseFloat(json_data['room_num']));
            }else{
                json_data['room_num']=(num+num%2)/2;
            }*/
            //房间数=人数(成人票):0(儿童票)
            if(type_fd=='num'){
                if(json_data['t_preset_type']=='成人票'){
                    json_data['room_num']=num;
                }else{
                    json_data['room_num']=0;
                }
            }
        };
        if(opt.id) {
            if(opt.rm_id){
                data[opt.id]['t_seat']=array_remove(data[opt.id]['t_seat'],parseFloat(opt.rm_id)-1);
            }else{
                json_data=seat_data(json_data);
                data[opt.id]=json_data;
            }

        };
        var surplus_num=0;
        $.each(data,function(i,v){
            surplus_num+= parseFloat(v.num);
        });
        BusNum=parseFloat(seat_num.surplus_num)-parseFloat(surplus_num);
        return data;
    };

    /**
     * 组织座位信息
     * t_id:442,
     * num:3,
     * t_seat:[
     * {t_id:442,vip_name:'游客一',vip_mob:'13851948015'},
     * {t_id:442,vip_name:'游客二',vip_mob:'13851948015'},
     * {t_id:442,vip_name:'游客三',vip_mob:'13851948015'}
     * ]
     * @param data
     */
    function seat_data(data){
        //if(data.num<=0)return data;
        var seat=[];
        for(var i=0;i<data.num;i++){
            if(typeof data['t_seat']=='object'){
                var t_seat=data['t_seat'];
                if(typeof t_seat[i]=='object'){
                    seat[i]=t_seat[i];
                    continue;
                }
            }
            seat[i]=seat_data_empty(data);
        }
        data.t_seat=seat;
        return data;
    }

    /**
     * 空座位数据
     * @param ticket
     * @returns
     */
    function seat_data_empty(ticket){
        var traffic_all=ticket.t_traffic_all;
        var site_name='',site_end='',site_name_id= 0,site_end_id=0;
        $.each(traffic_all,function(i,v){
            if(v.f_traffic_type=='去程'){
                site_name= v.f_traffic_start;
                site_name_id= v.f_start_place_id;
            }else{
                site_end=v.f_traffic_end;
                site_end_id=v.f_end_place_id;
            }
        });
        return {
            t_id:ticket.t_id,
            t_name:ticket.t_standards_name,
            t_preset_type:ticket.t_preset_type,
            bus_num:0,
            seat_num:0,
            vip_name:'',
            vip_mob:'',
            vip_card_type:'',
            vip_card:'',
            start_site:site_name,
            site_start:site_name,
            site_start_id:site_name_id,
            start_ticket:site_name?0:1,
            start_time:'',
            start_baoshi:site_name?0:1,
            start_sid:0,
            start_map:'',
            start_end:site_end,
            site_end:site_end,
            site_end_id:site_end_id,
            end_ticket:site_end?0:1,
            end_baoshi:site_end?0:1,
            end_time:'',
            end_sid:0,
            end_map:''
        };
    }

    function sell_favourable_fn(){
        var sell_favourable=$('input[name=sell_favourable]');
        sell_favourable.change(function(){
            pos_detail(Ticket);
        });
    }


    //pos总金额计算
    function pos_detail(data){
        var money= 0,pos_detail='',ticket_money= 0,room_money= 0,settle_money = 0,bus_price_data=[];
        var sell_favourable=parseFloat($('input[name=sell_favourable]').val());
        if(!sell_favourable)sell_favourable=0;
        $.each(data,function(i,v){
            money+= v.t_price* v.num;
            settle_money+=v.t_trade_price * v.num;
            ticket_money+=v.t_price* v.num;
            var poor_num= v.room_num;
            if(v.t_preset_type=='成人票')poor_num= v.room_num- v.num;
            if(poor_num!=0){
                var t_spread_price=v.t_spread_price;
                if(!v.t_out_room_price)v.t_out_room_price=0;
                if(poor_num<0)t_spread_price=v.t_out_room_price;
                money+= poor_num*t_spread_price;
                settle_money+= poor_num*t_spread_price;
                room_money+= poor_num*t_spread_price;
            }
            pos_detail+=pos_find_tpl(v);
            var gpt=goto_price_data(v);
            if(gpt)bus_price_data.push(gpt);
        });
        //对接送计划的操作
        var bus_price=goto_price_tpl(bus_price_data);
        if(!bus_price)bus_price=0;
        settle_money=settle_money+bus_price;
        var total_money=$('.total-money');
        total_money.html((money-sell_favourable+bus_price).toFixed(2));
        total_money.attr('title','结算金额:￥'+settle_money.toFixed(2));
        var cb=compare_balance(settle_money);
        if(cb.status==false){
            layer.msg(cb['msg']);
        }
        var l_pos_money=$('.l_pos_money');
        var pos_txt='';
        if(ticket_money)pos_txt='￥'+ticket_money.toFixed(2)+'(票价)';
        if(room_money)pos_txt+='+￥'+room_money.toFixed(2)+'(房差)';
        if(sell_favourable)pos_txt+='+￥'+sell_favourable.toFixed(2)+'(优惠)';
        if(pos_txt)pos_txt+='=';
        l_pos_money.html(pos_txt+'订单总额：￥<i>'+(money-sell_favourable).toFixed(2)+'</i></em>');
        var cost=$('.right-main .cost');
        if(pos_detail){
            cost.html('<dt class="mt20">票价信息</dt>'+pos_detail);
        }else{
            cost.html('');
        }
    }

    function compare_balance(money){
        var balance=parseFloat($('.org_balance').attr('data-val'));
        var credit=parseFloat($('.org_credit').attr('data-val'));
        balance=balance?balance:0;
        credit=credit?credit:0;
        if(balance<money && credit<money){
            //return {status:false,msg:'信用余额或账户余额不足,可能会影响预定订单!'}
        }
        return {status:true,balance:balance,credit:credit}
    }

    //票价信息显示
    function pos_find_tpl(data){
        if(data.num<=0) return '';
        var money=(parseFloat(data.num)*parseFloat(data.t_price));
        var room_tpl='';
        //房差信息显示
        var poor_num=data.room_num;
        if(data.t_preset_type=='成人票') poor_num=data.room_num-data.num;
        if(poor_num!=0){
            var t_spread_price=parseFloat(data.t_spread_price);
            if(!data.t_out_room_price)data.t_out_room_price=0;
            if(poor_num<0)t_spread_price=parseFloat(data.t_out_room_price);
            var r_money=parseFloat(poor_num)*t_spread_price;
            room_tpl='<span class="number">房差:'+poor_num+'床位</span> × <span class="price">￥'+t_spread_price+'</span>' +
                '<span class="amount">￥'+r_money+'</span>' +
                '<div class="clear"></div>';
        }
        return '<dd class="insurance">' +
            '<p title="'+data.t_standards_name+'">'+data.t_standards_name+'</p>' +
            '<span class="number">报名:'+data.num+'人</span> × <span class="price">'+parseFloat(data.t_price)+'</span>' +
            '<span class="amount">￥'+money+'</span>' +
            '<div class="clear"></div>'+room_tpl+'</dd>';
    };

    //接送信息显示
    function goto_price_data(data){
        if(!data.t_seat)return '';
        var seat_date={},money=0;
        $.each(data.t_seat,function(i,v){
            if(!v.goto_price || v.goto_price==0)return true;
            if(v.start_price || v.start_price!=0){
                seat_date[v.start_sid]={
                    num:seat_date[v.start_sid]?(seat_date[v.start_sid]['num']+1):1,
                    price:v.start_price,
                    name: v.start_site
                }
            };
            if(v.end_price || v.end_price!=0){
                seat_date[v.end_sid]={
                    num:seat_date[v.end_sid]?(seat_date[v.end_sid]['num']+1):1,
                    price:v.end_price,
                    name: v.start_end
                }
            };

            /*seat_date[v.start_sid]={
                num:seat_date[v.start_sid]?(seat_date[v.start_sid]['num']+1):1,
                price:v.goto_price,
                name: v.start_site
            }*/

        });
        return seat_date;
    };

    //接送计划模版
    function goto_price_tpl(data){
        var bus_data={};
        $.each(data,function(i,v){
            $.each(v,function(bi,bv){
                bus_data[bi]={
                    num:bus_data[bi]?(bus_data[bi]['num']+bv.num):bv.num,
                    price:bv.price,
                    name:bv.name
                }
            })
        });

        var bus_tpl='',money=0;
        $.each(bus_data,function(di,dv){
            var price=(parseFloat(dv.price)*parseFloat(dv.num));
            bus_tpl+='<li class="bus-list">' +
                '<span class="bl-title">'+dv.name+'</span>' +
                '<span class="bl-text">' +
                '<em class="bl-right">￥'+price+'</em>' +
                '<em class="bl-left">数量:'+dv.num+'次 × '+dv.price+'</em>' +
                '</span>' +
                '</li>';
            money+=price;
        });
        if(bus_tpl){
            bus_tpl='<ul><li class="bus-title">接送信息</li>'+bus_tpl+'</ul>';
            var bus_cls=$('.bus-cls');
            bus_cls.html(bus_tpl);
        }
        return money;
    };

    function fa_click(){
        var fa_minus_circle=$('.fa-minus-circle');
        /*fa_minus_circle.click(function(){
            layer.tips($(this).attr('msg-data'), $(this));
        });*/
    };

    /**
     * 获取表单内数据
     * @returns {{}}
     */
    function from_data_post(){
        var buy_from=$('.buy-from');
        var data={};
        $.each(buy_from,function(i,v){
            var buy_id=buy_from.eq(i);
            if(buy_id.attr('type')=='radio'){
                data[buy_id.attr('name')]=$('input[name="'+buy_id.attr('name')+'"]:checked').val();
            }else{
                data[buy_id.attr('name')]=buy_id.val();
            }
        });
        if(number_id)data['o_number']=number_id;
        return data;
    };

    $('.pos-sub').click(function(){
        //验证表单
        var vip_from=$('.vip-from'),fm_msg='';
        $.each(vip_from,function(i,v){
            var fm_id=vip_from.eq(i);
            if(fm_id.hasClass('disabled')){
                fm_msg=fm_id.parents('.vip-list').find('.tlr-txt').html();
                return false;
            }
        });
        if(fm_msg){
            layer.alert('请注意红色框中内容,【'+fm_msg+'】错误！');
            return false;
        }
        //当新添加订单时同行城市与当前城市不在一起时提示
        var s_city=$('input[name=o_sorg_city]').val();
        var o_id=$('input[name=o_id]').val();
        var site_city=$('.site_city').html();
        if(!o_id && s_city!=site_city){
            layer.confirm('同行所在城市【'+s_city+'】与出发城市【'+site_city+'】不一样，你确认需要继续下订单吗?',function(index){
                layer.close(index); //执行关闭
                buy_ajax($('.pos-sub'));
            })
        }else{
            buy_ajax($('.pos-sub'));
        }
    });

    /**
     * 表单数据提交
     */
    function buy_ajax(is_this,url_bool){
        if(is_this.hasClass('disabled'))return false;
        var post=from_data_post();
        if(!post.buy_uid){
            layer.msg('请选择报名社或报名人!');
            return false;
        }
        post['ticket']=Ext.encode(Ticket);
        //is_this.addClass('disabled');
        if(url_bool)post['url_bool']=url_bool;
        $.ajax({
            type:"POST",
            url:$__app__ + "/Order/post_ajax_data",
            data:post,
            success:function (msg) {
                var data = msg;
                if (typeof msg != 'object')
                    data = eval("(" + msg + ")");
                var info = data.info;
                if (data.status == 1) {
                    if(number_id){
                        location.href=$__app__+'/Buy/success_page/id/'+info.number+'/type/save';
                    }else{
                        location.href=$__app__+'/Buy/success_page/id/'+info.number;
                    }
                }else{

                    if(info.s_id){
                        layer.confirm('【'+info.s_vip_name+'】当已存在此游客，你确定再次报名吗？（订单号：'+info.s_o_number+'）',function(index){
                            layer.close(index); //执行关闭
                            buy_ajax($('.pos-sub'),'yes');
                        });
                    }else if(info.o_number){
                        layer.confirm('当前【分销商】已经存在“待确认”订单，是否继续报名？',function(index){
                            layer.close(index); //执行关闭
                            buy_ajax($('.pos-sub'),'yes');
                        });

                    }else{
                        layer.alert(info);
                    }
                    is_this.removeClass('disabled');
                }
            }
        });
    };

    //pos单浮动

    $(window).scroll(function () {
        var right_main=$('#main .right-main');
        if($(this).scrollTop()>=60){
            right_main.css({
                position: 'fixed',top:0,left:(parseFloat($(this).width())+560)/2
            });
        }else{
            right_main.css({
                position: 'relative',top:0,left:0
            });
        }
    });
    /*上车站点的处理*/
    function site_select_box(){
        var site_id=$('.site-select');
        site_id.unbind();
        site_id.click(function(){
            var tour_id=$(this).parents('.tour-list');
            var data_type=$(this).attr('data-type');
            var tid=tour_id.attr('t_id');
            var sid=tour_id.find('input[name=s_id]').val();
            var t_index=tour_id.attr('t_index');
            var start_sid=tour_id.find('input[name=start_sid]').val();
            var start_map=tour_id.find('input[name=start_map]').val();
            var start_date=$('input[name=bl_start_date]').val();
            var map_site=$(this).parents('.site-goto-id').find('.fly-name').attr('site-name');
            var bool='no';
            var url=$__app__+'/Buy/select_site/id/'+tid+'/num/'+t_index+'/select/'+bool+'/start_date/'+start_date+'/site_type/'+data_type;
            if(start_sid>0 || start_map)bool='yes';
            if(!tid){
                layer.msg('没有对应票种数据!');
                return false;
            }
            var site_goto_id=$(this).parents('.site-goto-id');
            var fa_car=site_goto_id.find('.fa-car');
            if(fa_car.attr('title')){
                layer.msg('当前游客'+fa_car.attr('title')+',<br />如果需要修改需要先撤销接送计划，<br />再来修改!');
                return false;
            }
            var car_len=tour_id.find('.fa-car').length,goto_car='';
            if(car_len>0)url+='/goto_car/'+car_len;
            if(map_site)url+='/site_name/'+map_site;
            if(sid)url+='/sid/'+sid;
            $.layer({
                type: 2,
                border: [0],
                title: '上车站点选择',
                iframe: {src : url},
                area: ['890px', '580px']
            });
        });

        var del_seat=$('.del-seat');
        del_seat.unbind();
        del_seat.click(function(){
            var list_id=$(this).parents('.tour-list');
            var t_id=list_id.attr('t_id');
            var t_index=list_id.attr('t_index');
            var fsb=find_seat_bus($(this),'删除');
            if(fsb){
                layer.msg(fsb);
                return false;
            }
           /* var fa_car=list_id.find('.fa-car');
            if(fa_car.attr('title')){
                layer.msg('当前游客'+fa_car.attr('title')+',<br />如果需要删除需要先撤销接送计划，<br />再来删除!');
                return false;
            }
            var fa_ticket=list_id.find('.fa-ticket');
            if(fa_ticket.attr('title')){
                /!*layer.confirm('当前游客'+fa_ticket.attr('title')+',<br />删除后相应的大交通票也同样删除！',function(index){
                    adjust_pop('-',t_id,'num',(parseFloat(t_index)+1));
                    layer.msg('亲记得在下面收违约金哦!');
                });*!/
                layer.msg('当前游客'+fa_ticket.attr('title')+',<br />如果需要删除需要先退掉大交通票，<br />再来删除!');
                return false;
            }*/
            adjust_pop('-',t_id,'num',(parseFloat(t_index)+1));
        });

        //选择航班(次)号
        var fly_id=$('.fly-select');
        fly_id.unbind();
        fly_id.click(function(){
            var tour_id=$(this).parents('.tour-list');
            var goto_id=$(this).parents('.site-goto-id');
            //判断是否安排过接送计划
            var car_title=goto_id.find('.fa-car').attr('title');
            if(car_title){
                layer.msg(car_title+'，撤销当前接送计划才可以修改!');
                return false;
            }
            var data_type=$(this).attr('data-type');
            var tid=tour_id.attr('t_id');
            var t_index=tour_id.attr('t_index');
            var sid=tour_id.find('input[name=s_id]').val(),seat='';
            var str_date=$('input[name=bl_start_date]').val();
            if(data_type=='回程')str_date=$('input[name=bl_end_date]').val();
            var url= $__app__+'/Buy/select_fly/t_index/'+t_index+'/tid/'+tid+'/fly_type/'+data_type+seat+'/date/'+str_date;
            if(sid) seat='/sid/'+sid;
            if($(this).attr('ticket-site')==1)url+='/site/yes';
            $.layer({
                type: 2,
                border: [0],
                title: '安排航班(次)信息',
                iframe: {src :url},
                area: ['997px', '650px']
            });
        });
    };
    function array_remove(data,index){
        var len=data.length;
        var arr=[];
        for(var i=0;i<len;i++){
            if(i!=index)arr.push(data[i]);
        }
        return arr;
    }

    //选择上车站点数据组织
    window.site_select_fn=function(data,id,index,bool,site_type){
        var seat={};
        /*seat={
            start_site:data.st_name,//去程站点名称
            start_time:data.sp_go_time?data.sp_go_time:'',//去程站点时间
            start_sid:data.sp_id?data.sp_id:0,//去程站点id
            start_map:data.sp_map?data.sp_map:'',//去程站点地图座标
            start_end:data.st_name,//返程站点名称
            end_time:data.sp_go_time?data.sp_go_time:'',//返程站点时间
            end_sid:data.sp_id?data.sp_id:0,//返程站点id
            end_map:data.sp_map?data.sp_map:'',//返程站点地图度座标
            goto_price:data.sp_settle_price //总接送费用
        };*/
        if(site_type.type=='返程'){
            //操作去程时
            seat={
                start_site:data.st_name,//去程站点名称
                start_time:data.sp_go_time?data.sp_go_time:'',//去程站点时间
                start_sid:data.sp_id?data.sp_id:0,//去程站点id
                start_map:data.sp_map?data.sp_map:'',//去程站点地图座标
                start_price:data.sp_settle_price?data.sp_settle_price:0
            };
            //如果同步时操作
            if(site_type.status==true){
                seat.start_end=data.st_name;
                seat.end_time=data.sp_go_time?data.sp_go_time:'';
                seat.end_sid=data.sp_id?data.sp_id:0;
                seat.end_map=data.sp_map?data.sp_map:'';
                seat.end_price=data.sp_settle_price?data.sp_settle_price:0
            }
        }else{
            //操作返程时
            seat={
                start_end:data.st_name,//返程站点名称
                end_time:data.sp_go_time?data.sp_go_time:'',//返程站点时间
                end_sid:data.sp_id?data.sp_id:0,//返程站点id
                end_map:data.sp_map?data.sp_map:'',
                end_price:data.sp_settle_price?data.sp_settle_price:0
            };
            //如果同步时操作
            if(site_type.status==true){
                seat.start_site=data.st_name;
                seat.start_time=data.sp_go_time?data.sp_go_time:'';
                seat.start_sid=data.sp_id?data.sp_id:0;
                seat.start_map=data.sp_map?data.sp_map:'';
                seat.start_price=data.sp_settle_price?data.sp_settle_price:0;
            }
        }
        if(bool==true){
            $.each(Ticket,function(di,v){
                var ticket=Ticket[di];
                if(typeof ticket['t_seat']!='object')return true;
                $.each(ticket['t_seat'],function(i,v){
                    site_ticket_find(di,i,seat,bool);
                });
            })
        }else{
            site_ticket_find(id,index,seat);
        };
        ticket_view(Ticket);
    };

    function site_ticket_find(id,index,seat){
        var ticket=Ticket[id];
        var old_seat=ticket['t_seat'][index];
        //如果去程接送有值
        if(parseFloat(old_seat.go_tpid)>0){
            seat.start_site=old_seat.start_site;
            seat.start_time=old_seat.start_time;
            seat.start_sid=old_seat.start_sid;
            seat.start_map=old_seat.start_map;
            seat.start_price=old_seat.start_price;
        }
        //如果返程接送有值
        if(parseFloat(old_seat.back_tpid)>0){
            seat.start_end=old_seat.start_end;
            seat.end_time=old_seat.end_time;
            seat.end_sid=old_seat.end_sid;
            seat.end_map=old_seat.end_map;
            seat.end_price=old_seat.end_price;
        }
        seat.goto_price=parseFloat(seat.start_price)+parseFloat(seat.end_price);
        ticket['t_seat'][parseFloat(index)]=Ext.apply(old_seat,seat);
        Ticket[id]=ticket;
    }

    window.fly_select_fn=function(data,id,index,bool,site_type,fly_inval){
        var add_ticket= 0,add_bool=false;
        switch (fly_inval){
            case '1':
                add_ticket=1;
                break;
            case '2':
                add_ticket=0;
                break;
            default:
                add_ticket=0;
                add_bool=true;
                break;
        };
        var fly_data={
            'fly_number':data.fl_number,
            'fly_start_code':data.fl_start_code,
            'fly_end_code':data.fl_end_code,
            'fly_type':site_type,
            'fly_start_name':data.fl_start_name,
            'fly_start_time':data.fl_start_time,
            'fly_start_id':data.fl_start_id,
            'fly_start_platform':data.fl_start_platform,
            'fly_end_name':data.fl_end_name,
            'fly_end_time':data.fl_end_time,
            'fly_end_id':data.fl_end_id,
            'fly_end_platform':data.fl_end_platform,
            'add_ticket':add_ticket,
            'start_site':data.start_site,
            'end_site':data.end_site
        };
        if(data.stock){
            fly_data.tbd_id=data.stock.tbd_id;
            fly_data.tbd_type=data.stock.tbd_type;
        }
        // todo 航班信息需要进座位数据，由后台根据航班编号查询
        if(site_type=='去程'){
            site_type='go_fly';
        }else{
            site_type='to_fly';
        }
        //大交通同步操作类型
        switch (bool){
            case '1'://同步到所有游客
                $.each(Ticket,function(ai,av){
                    var tid=Ticket[ai]['t_seat'];
                    if(tid){
                        $.each(tid,function(ti,tv){
                            tv[site_type]=fly_data;
                            tv=start_end_goto_data(tv,fly_data,site_type,add_bool);
                            Ticket[ai]['t_seat'][ti]=tv;
                        });
                    }
                });
                break;
            case '3'://同步到相同票价游客
                var sid=Ticket[id]['t_seat'];
                $.each(sid,function(i,v){
                    v[site_type]=fly_data;
                    v=start_end_goto_data(v,fly_data,site_type);
                    Ticket[id]['t_seat'][i]=v;
                });
                break;
            default: //只使用到当前游客
                var rows=Ticket[id]['t_seat'][index];
                rows[site_type]=fly_data;
                rows=start_end_goto_data(rows,fly_data,site_type);
                Ticket[id]['t_seat'][index]=rows;
                break;
        }
        ticket_view(Ticket);
        /*if(bool===false && bool_all!==true){
            var rows=Ticket[id]['t_seat'][index];
            rows[site_type]=fly_data;
            rows=start_end_goto_data(rows,fly_data,site_type);
            Ticket[id]['t_seat'][index]=rows;
        }else if(bool_all===true){
            $.each(Ticket,function(ai,av){
                var tid=Ticket[ai]['t_seat'];
                if(tid){
                    $.each(tid,function(ti,tv){
                        tv[site_type]=fly_data;
                        tv=start_end_goto_data(tv,fly_data,site_type,bool_all);
                        Ticket[ai]['t_seat'][ti]=tv;
                    });
                }
            });
        }else{
            var sid=Ticket[id]['t_seat'];
            $.each(sid,function(i,v){
                v[site_type]=fly_data;
                v=start_end_goto_data(v,fly_data,site_type);
                Ticket[id]['t_seat'][i]=v;
            });
        }*/

    };

    /**
     * 切换站点时执行
     * @param v
     * @param fly_data
     * @param site_type
     * @returns {*}
     */
    function start_end_goto_data(v,fly_data,site_type,bool_all){
        if(site_type=='go_fly'){
            if(v.site_start== v.start_site && v.site_start!=fly_data.start_site){
                v.start_site=fly_data.start_site;
            }
            v.site_start_id=fly_data.fly_start_id;
            v.site_start=fly_data.start_site;
            if(bool_all!==true){
                v.start_ticket=fly_data.add_ticket;
            }else{
                v.start_ticket= v.start_baoshi;
            }
        }else{
            if(v.site_end== v.start_end && v.site_end!=fly_data.end_site){
                v.start_end=fly_data.end_site;
            }
            v.end_site_id=fly_data.fly_end_id;
            v.end_site=fly_data.end_site;
            if(bool_all!==true){
                v.end_ticket=fly_data.add_ticket;
            }else{
                v.end_ticket=v.end_baoshi;
            }
        }
        return v;
    }


    /**
     * 选择交通类型交互
     */
    function select_traffic_type(){
        var tfs_start_site=$('select[name=tfs_start_site]');
        var tfs_end_site=$('select[name=tfs_end_site]');
        tfs_start_site.change(function(){
            select_traffic_type_fn($(this));
        });
        tfs_end_site.change(function(){
            select_traffic_type_fn($(this));
        });
    }

    function select_traffic_type_fn(t){
        var tfs_start_site=$('select[name=tfs_start_site]').val();
        var tfs_end_site=$('select[name=tfs_end_site]').val();
        var ticket_list=$('.ticket-list');
        for(var i=0;i<ticket_list.length;i++){
            var ticket_id=ticket_list.eq(i);
            var where=true;
            /**
             * 1.交通方式不是全部、不含；
             * 2.交通方式是全部时
             * 3.交通方式是不含时
             */
            if(tfs_start_site!='全部'){
                if(ticket_id.attr('start-type')==tfs_start_site)where=true; else where=false;
            }
            if(tfs_end_site!='全部'){
                if(ticket_id.attr('end-type')==tfs_end_site)where=true; else where=false;
            }
            if(where){
                ticket_id.show();
            }else{
                ticket_id.hide();
            }
        }
    }

    //批量添加游客信息
    var batch=SUNLINE.BatchUserData({type:'fit'},function(r){
        var small=[],big=[],pop_data=[];
        for(var ri=0;ri< r.length;ri++){
            var rows= r[ri];
            pop_data.push(rows);
            /*if(rows.t_name=='成人票'){
                big.push(rows);
            }else{
                small.push(rows);
            }*/

        }
        var tour_list=$('.tour-list');
        var len=tour_list.length;
        var si= 0,bi=0;
        for(var i=0;i<len;i++){
            var tour_id=tour_list.eq(i);
            var row;
            /*if(tour_id.attr('t_type')=='成人票'){
                row=big[bi];
                bi++;
            }else{
                row=small[si];
                si++;
            }*/
            row=pop_data[bi];
            bi++;
            if(!row)continue;
            tour_fn(tour_id,row,tour_id.attr('t_index'),tour_id.attr('t_id'));
        }
        ticket_view(Ticket);
    });

    function tour_fn(tour_id,row,t_index,tid){
        tour_id.find('input[name=vip_name]').val(row.vip_name);
        tour_id.find('input[name=vip_card]').val(row.vip_card);
        tour_id.find('select[name=vip_card_type]').val(row.vip_card_type);
        if(row.vip_mob)tour_id.find('input[name=vip_mob]').val(row.vip_mob);
        var ticket=Ticket[tid];
        var seat=ticket['t_seat'][t_index];
        seat.vip_name=row.vip_name;
        seat.vip_card=row.vip_card;
        seat.vip_card_type=row.vip_card_type;
        if(row.vip_mob)seat.vip_mob=row.vip_mob;
        ticket['t_seat'][t_index]=seat;
        Ticket[tid]=ticket;
    }
    function batch_user_fn(){
        //批量导入游客
        var batch_id=$('.batch-id');
        var tour_list=$('.tour-list');
        batch_id.unbind();
        batch_id.click(function(){
            batch.batch_grid.pop=tour_list.length;
            batch.batchWin.show();
        });

        //航班(次)信息
        var fly_id=$('.fly-id');
        fly_id.unbind();
        fly_id.click(function(){
            fly_site_data();
        });
    }

    /**
     * 获座位与航班(次)数据
     */
    function fly_site_data(){
        var check_cls=document.getElementsByClassName('check-cls');
        var check_id=$('.check-cls');
        var t_id=[],t_index=[];
        for(var i=0;i<check_cls.length;i++){
            if(check_cls[i].checked==false)continue;
            var list_id=check_id.eq(i).parents('.tour-list');
            if(in_array(list_id.attr('t_id'),t_id)==-1){
                t_id.push(list_id.attr('t_id'));
            }
            t_index.push(i);
        }
        if(t_id.length>1){
            layer.confirm('选择的游客中存在不同票种,是否继续操作？',function(index){
                layer.close(index); //执行关闭
                win_fly_select();
            });
        }else{
            win_fly_select();
        }
    }
    function win_fly_select(data){
        $.layer({
            type: 2,
            border: [0],
            title: '安排航班(次)信息',
            iframe: {src : $__app__+'/Buy/select_fly/'},
            area: ['1000px', '580px']
        });
    };

    var end_id=$('.end-id');
    end_id.unbind();
    end_id.change(function(){
        var val=$(this).val();
        var week=$(this).find('option[value='+val+']').attr('week-val');
        var days=$(this).find('option[value='+val+']').attr('days-val');
        $('.week_id').html('('+week+')');
        $('.days-id').html(days);
        $('input[name=bl_end_date]').val(val);
        $('input[name=p_days]').val(days);
    });
});

var BuyOrg={};
Ext.onReady(function(){
    if(!$('.replace-info').html())return false;
    if(_uinfo.org_type=='管理公司'){
        _uinfo.org_name='';
        _uinfo.u_realname='';
    }
    var _conf={
        where:{
            org_type:'分销商'
        },
        config:{
            displayField:'org_name',
            valueField:'org_id',
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} - {org_name}</li>',
                '</tpl></ul>'
            ),
            id:'buy_org',
            pageSize:20,
            fieldLabel:'',
            labelWidth:0,
            width:300,
            labelAlign:'right',
            value:_uinfo.org_name,
            renderTo:'rep-company'
        }
    };
    if(site_name)_conf.where.org_city=site_name;
    SUNLINE.UserCompanyBox(_conf);

    SUNLINE.CompanyBox({
        fields:['u_id','u_mob','u_zname'],url:$__app__ + '/Users/dataJson',
        where:{
            us_orgid:_uinfo.org_id
        },
        config:{
            displayField:'u_zname',
            valueField:'u_zname',
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_zname} - {u_mob}</li>',
                '</tpl></ul>'
            ),
            id:'buy_id',
            fieldLabel:'',
            labelWidth:0,
            width:180,
            labelAlign:'right',
            value:_uinfo.u_realname,
            renderTo:'rep-user'
        }
    });
    Ext.getCmp('buy_org').on('select',function( c, r, e){
        var row= r[0];
        var buy_id=Ext.getCmp('buy_id');
        var buy_org=$('input[name=buy_org]');
        var buy_user=$('input[name=buy_uid]');
        var sorg_city=$('input[name=o_sorg_city]');
        SUNLINE.baseParams(buy_id.store,{us_orgid:row.get('org_id')});
        buy_id.store.load();
        buy_id.setValue('');
        buy_org.val(row.get('id'));
        sorg_city.val(row.get('org_city'));
        buy_user.val('');
        BuyOrg=row;
        credit_balance_money(row);
    });

    function credit_balance_money(row,type){
        var balance= $('.org_balance');
        var balance_money=parseFloat(row.get('balance'));
        balance_money=balance_money?balance_money:0;
        balance.attr('data-val',balance_money.toFixed(2));
        balance.find('.a-money').html('￥'+balance_money.toFixed(2));
        var credit= $('.org_credit');
        var credit_money=parseFloat(row.get('credit_balance'));
        var credit_msg=parseFloat(row.get('credit'));
        credit_money=credit_money?credit_money:0;
        credit_msg=credit_msg?credit_msg:0;
        var pay_type_id=$('input[name=o_source_id]').val();
        if(parseFloat(pay_type_id)>0){
            credit.attr('data-val',999999999);
            credit.find('.a-money').html('网络平台结算,额度不受限制');
            credit.find('.a-msg').html('');
        }else{
            credit.attr('data-val',credit_money.toFixed(2));
            credit.find('.a-money').html('￥'+credit_money.toFixed(2));
            credit.find('.a-msg').html('(额度：￥'+credit_msg.toFixed(2)+')');
        }
        if(type!='网络平台'){
            //操作用户
            var buy_user=$('input[name=buy_uid]');
            buy_user.val(row.get('u_id'));
            Ext.getCmp('buy_id').setValue(row.get('u_realname'));
            Ext.getCmp('buy_org').setValue(row.get('u_realname')+'-'+row.get('org_name'));
        }
    }

    Ext.getCmp('buy_id').on('select',function( c, r, e){
        var row= r[0];
        var buy_user=$('input[name=buy_uid]');
        buy_user.val(row.get('u_id'));
    });

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

    SourceNameBox.store.on('load',function(){
        this.add({id:0,text:'当前选择报名社'});
    });

    SourceNameBox.on('select',function(c,r,e){
        var row= r[0];
        $('input[name=o_source_id]').val(row.get('id'));
        $('input[name=o_source_name]').val(row.get('text'));
        var o_id=$('input[name=o_id]').val();
        if(row.get('id')==0){
            credit_balance_money(BuyOrg);
        }else{
            credit_balance_money(row,'网络平台');
        }
    });
});