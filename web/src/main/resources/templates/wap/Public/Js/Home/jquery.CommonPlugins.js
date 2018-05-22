/**
 * Created by zhu shao lei on 13-12-17.
 * 必需在jquery 下面用
 */
(function($){
    $.extend({SubVerify:function(opt){
        var my_mob=/(^0?[1][35487][0-9]{9}$)/;
        var msg_alert=opt.msg_alert;
        this.v_Mobile=function(t,m){//没有数据的定义
            var mob=t.val();
            if(!mob.match(my_mob) && mob){
                t.addClass("verify_error");
                if(m!='return'){
                    if(!msg_alert){
                        alert("请填写正确的手机号!");
                    }else{
                        msg_alert("请填写正确的手机号!");
                    }
                }
                return false;
            }else{
                return pass_class(t);
            }
        };

        this.v_card=function(t,data,from,type){
            var t_data=data;
            var vip_card= $.trim(t.val()),topCls =t.parent().parent(),tid=topCls.attr("tid");
            var td_id = topCls.attr("td_id");
            var msg='';
            //from = from ? from : "身份证";
            if(from!="身份证"){
                t.removeClass("verify_error");
                return true;
            }
            //票种限制性别的
            var t_detail = {};
            if(type=='scenic'){
                t_detail=t_data;
            }else{
                if(td_id){
                    t_detail=t_data[td_id].t_detail.tickets;
                }else{
                    t_detail=t_data[tid].t_detail.tickets;
                }
                t_detail = t_detail[tid];
            }
            if(t_detail.limit_type=="限制性别" || t_detail.limit_type=="限性别"){
                if(CardSex(vip_card)!=t_detail.limit_condition){
                     msg="此票种"+t_detail.limit_type+"为"+t_detail.limit_condition;
                    if(!msg_alert){
                        alert(msg);
                    }else{
                        msg_alert(msg);
                    }
                    t.addClass("verify_error");
                    return false;
                }else{
                    return pass_class(t);
                }
            }

            //票种限制年龄
            if(t_detail.limit_type=="限制年龄" || t_detail.limit_type=="限年龄"){
                var condition=t_detail.limit_condition,where="";
                if(condition.indexOf("-")>=0){
                    var bt=condition.split("-");
                    where=getAge(vip_card)>bt[0] && getAge(vip_card)<bt[1];
                }else if(condition.indexOf("<")>=0){
                    var gt=condition.split("<");
                    where=(getAge(vip_card)<gt[1]);
                }else if(condition.indexOf(">")>=0){
                    var gt=condition.split(">");
                    where=(getAge(vip_card)>gt[1]);
                }else{
                    where=(getAge(vip_card)==condition);
                }

                if(where){
                    return pass_class(t);
                }else{
                    msg="此票种"+t_detail.limit_type+"为"+t_detail.limit_condition;
                    if(!msg_alert){
                        alert(msg);
                    }else{
                        msg_alert(msg);
                    }
                    t.addClass("verify_error");
                    return false;
                }
            }

            if(!CardChk(vip_card).start && vip_card){//todo 在这里必需要有CardChk身份证验证插件
                msg="请填写正确的身份证号!";
                if(!msg_alert){
                    alert(msg);
                }else{
                    msg_alert(msg);
                }
                t.addClass("verify_error");
                return false;
            }else{
                return pass_class(t);
            }
        }

        this.v_uName=function(t){
            if(t.val()) return pass_class(t);
        }

        function pass_class(t){
            if(t.attr("class")) t.removeClass("verify_error");
            return true;
        }
        return this;
    },
    hintMsg:function(t){
            var h_msg=t,h_len=h_msg.length;
            var hm_id=t;
            for(var i=0;i<h_len;i++){
                var h_i=h_msg.eq(i),h_msg_html=msg_tpl(h_i.html());
                if(h_i.html() && !h_i.find(".title_ask").html()){ h_i.html(h_msg_html);  }
            }
            hm_id.find(".title_ask").hover(function(){
                var title_msg=$(this).find(".title_ask_msg");
                title_msg.show();
            },function(){
                var title_msg=$(this).find(".title_ask_msg");
                title_msg.hide();
            })
            function msg_tpl(tpl){
                return '<span class="title_ask">' +
                    '<img src="'+$app_public_images_path+'b_help.png">' +
                    '<div class="title_ask_msg" style="display: none;">' +
                    tpl+'<i class="all_icon_h_b"></i></div></span>';
            }
        },
        /**
         * 获取最终活动金额
         * @param data 活动数据
         * @param money 订单总金额
         * @param pop 活动有效人数
         * @param om 产品天数
         * @param pop_data 票价及人数
         * @returns {*}
         * @constructor
         */
    ActivityRule:function(data,money,pop,om,pop_data){
        if(money<=0) return 0;
        var fr_data = data
        var ac_money=0;
        var credit=fr_data.au_credit;
        var au_use_paytype=fr_data.au_use_paytype;
        if(au_use_paytype==0){
            ac_money=money*(credit/100);
        }else if(au_use_paytype==1){
            if(fr_data.au_payptype_mark==0){
                ac_money=credit;
            }else{
                if(fr_data.days && fr_data.au_day_msg){
                    if(parseInt(fr_data.days)<=1){
                        ac_money = fr_data.au_day_msg.day1*pop;
                    }else{
                        ac_money = fr_data.au_day_msg.day2*pop;
                    }
                }else{
                    ac_money=pop*credit;
                }
            }
        }else if(au_use_paytype==2){
            ac_money=money*(credit/100);
        }
        ac_money=parseInt(ac_money);
        if(parseInt(fr_data.au_credit_max*pop)<ac_money && fr_data.au_credit_max>0){
            ac_money=parseInt(fr_data.au_credit_max*pop);
        }
        //限制规则的处理
        if(typeof data.activity_money_rule=="object" && fr_data.au_use_paytype==1){
            ac_money=$.ActivityPeopleRule(data.activity_money_rule,data,money,pop,ac_money);
        }

        if(ac_money>fr_data.credit){
            ac_money=fr_data.credit;
        }
        if(ac_money>100) ac_money=parseInt(ac_money/10)*10;
        if(om){
            if(ac_money>om) ac_money = om;
        }
        return parseInt(ac_money);
    },
        /**
         * 优惠规则限制按单票价计算
         * @param rule_data 优惠规则
         * @param ticket_data 票价及人数
         * @param activity 活动规则
         * @constructor
         */
    ActivityMoneyRule:function(rule_data,ticket_data,activity){
            var money = 0;
            $.each(ticket_data,function(v,i){
                var rule = {},rule_bool = false,credit;
                v = parseFloat(v),i=parseFloat(i);
                $.each(rule_data,function(ri,rv){
                    if(rv["mr_end_money"]>=v){
                        rule = rv; rule_bool=true;
                        return false;
                    }
                });
                if(rule_bool==true){
                    if(rule["mr_rate_type"]==1){
                        credit = parseFloat(activity["au_credit"]*(rule["mr_rate"]/100));
                    }else{
                        credit = parseFloat(rule["mr_rate"]);
                    }
                    if(credit>activity["au_credit"]) credit = activity["au_credit"];
                    money +=credit*i;
                }else{
                    money +=parseFloat(activity["au_credit"])*i;
                }
            });
            return money;
    },
        /**
         * 优惠规则限制按人均计算
         * @param rule_data 优惠规则
         * @param activity 活动规则
         * @param money 订单算金额
         * @param pop 有铲人数
         * @returns {number}
         * @constructor
         */
    ActivityPeopleRule:function(rule_data,activity,money,pop,old_money,obj){
        var cd_money = parseFloat(money/pop),rule={},rule_bool=false,credit= 0,all_money=0;
        $.each(rule_data,function(i,v){
            if(v["mr_end_money"]>=cd_money){
                rule = v; rule_bool=true;
                return false;
            }
        });
        if(rule_bool==true){
            if(rule["mr_rate_type"]==1){
                credit=parseFloat(activity["au_credit"]*(rule["mr_rate"]/100));
            }else{
                credit=parseFloat(rule["mr_rate"]);
            }
            if(credit>activity["au_credit"]) credit = activity["au_credit"];
            all_money=credit*pop;
        }else{
            all_money=old_money;
        }
        if(obj) obj(rule_bool,rule,rule_data);
        return all_money;
    }
    });
    $.fn.HoverCls=function(opt){
        var hc_id=$(this),
            h_class=opt.h_class
        hc_id.hover(function(){
            hc_id.removeClass(h_class);
            $(this).addClass(h_class);
        },function(){
            hc_id.removeClass(h_class);
        })
    };
    /*** 支付脚本Pay(start) ***/

        //支付操作
    $.fn.BzyPay = function(data){
        var Pay_data=data;
        pay_show(data);
        function pay_operate(){
            var pay_selected=$(".pay_selected");
            $(".pay_list").click(function(){
                $(".pay_list").removeClass("pay_list_show");
                var t = $(this),
                    sub=$(".pay_sub .sub"),
                    txt=$(".pay_sub .txt");
                if (!t.hasClass('pay_disabled')) {
                    $(this).addClass("pay_list_show");
                    txt.hide(); sub.show();
                } else {
                    sub.hide(); txt.show();
                }

                if(t.attr("id")=="list_focus"){
                    sub.html("集中支付");
                }else if(t.attr("id")=="list_pos"){
                    sub.html("确定支付");
                }else{
                    sub.html("下一步");
                }

            });

            $(".cls_hide").click(function(){
                pay_selected.hide();
            });

            $(".pay_sub .sub").click(function(){
                var t=$(this);
                if(t.html()=="确定支付"){
                    var rst=pos_pay(Pay_data.RealMoney);
                    //var rst = {success:true, msg:'0001044380888247696461    000033000000000001交易成功                                3053010472201020000212400000103310051190051195780936938410331OCT', type:'ums'};
                    if(rst["success"]==true){
                        var order={o_number:Pay_data.NumId, pos:rst.msg,type:'ums'};
                        $.ajax({
                            type:"POST",
                            url:$__app__ + "/Order/pos_pay",
                            data:order,
                            success:function (msg) {
                                var data = msg;
                                if (typeof msg != 'object')
                                    data = eval("(" + msg + ")");
                                if (data.status == 1) {
                                    window.location.href=$__app__ + data.info;
                                }else{
                                    alert(data.info)
                                }
                            }
                        });

                    }
                    return;
                }
                if(t.html()=="集中支付"){
                    var num_id=$("input[name=num_id]").val();
                    window.location.href=$__app__+"/Buy/order_success/NumID/"+num_id+"/status/not_pay";
                    //window.close();
                    return false;
                }
                pay_open_url();
                $(".pay_box .pay_next").hide();
                $(".pay_box .pay_last").show();
            });

            //支付完成后的操作
            pay_selected.find(".finish").click(function(){
                if(Pay_data.type=="patch"){
                    setTimeout(function(){
                        parent.CloseTab(true);
                    },1000);
                }else{
                    var pid=$("input[name=pay_id]").val();
                    window.location.href=$__app__+"/Goal/"+pid;
                }

            })

            //支付出现问题了
            pay_selected.find(".error").click(function(){
                window.location.href="http://h.u-an.me";
                window.close();
            })
        }

        function pay_open_url(){
            var num_id=$("input[name=num_id]").val();
            window.open($__app__+"/Order/pay_order/num_id/"+num_id);
        }

        //显示支付框
        function pay_show(info){
            var pay_box=$(".pay_box");
            var win_width=$(window).width();
            var pay_width=pay_box.width();
            $(".pay_selected").show();
            pay_box.css({left:(win_width-pay_width)/2,top:150});
            pay_box.find(".pay_next").show();
            pay_box.find(".pay_last").hide();
            pay_box.find(".msg_order b").html(info.NumId);
            $("input[name=num_id]").val(info.NumId);
            $("input[name=pay_id]").val(info.pid)
            pay_operate();
        };
    };
    /*** 支付脚本Pay(end) ***/

    /**
     * tabs页
     * @param opt
     */
    $.fn.tabs = function (opt,obj) {
        var t_id = this,
            t_hover = $(t_id).find(opt.t_hover),
            t_move_add = opt.t_move_add,
            len = t_move_add.length,
            t_event = "hover",
            t_move_class = opt.t_move_class, class_len = t_move_class.length,
            t_len = t_hover.length;
        if (opt.t_event) t_event = opt.t_event;
        switch (t_event) {
            case "hover":
                t_hover.hover(function () {
                    Event_fn(this)
                },function(){});
                break;
            case "click":
                t_hover.click(function () {
                    Event_fn(this)
                });
                break;
        }
        function Event_fn(t) {
            var n = t_hover.index($(t));
            if(obj) obj(n,$(t),t_id);
            if (t_move_add) {
                for (var i = 0; i < len; i++) {
                    $(t_id).find(t_move_add[i][0]).removeClass(t_move_add[i][1]);
                    $(t_id).find(t_move_add[i][0]).eq(n).addClass(t_move_add[i][1]);
                }
            }
            if (t_move_class) {
                for (var j = 0; j < class_len; j++) {
                    for (var t = 0; t < t_len; t++) {
                        if (t == n) {
                            $(t_id).find(t_move_class[j][0]).eq(t).addClass(t_move_class[j][1] + t);
                        } else {
                            $(t_id).find(t_move_class[j][0]).removeClass(t_move_class[j][1] + t);
                        }
                    }
                }
            }
        }

    }

    $.fn.BzyBox = function(opt,obj){
        var box = this;
        var click_cls = $(opt.click_cls);
        var view_data = opt.view_data;
        var view_width = opt.view_width;
        box.find(".cls_hide").click(function(){
            box.hide();
        });
        click_cls.click(function(){
            var site_class = $(this).find(".site_class");
            var site_bool = true;
            $.each(site_class,function(i,v){
                var sb_bool = site_class.eq(i).attr("sb_bool");
                if(sb_bool==1){
                    site_bool = false;
                    alert("系统班车过12点，次日出发的站点禁止修改,有需要请联系系统管理员!");
                    return false;
                }
            })
            if(site_bool===false) return false;
            position_box();
            if(obj) obj(box,view_data,$(this));
        });
        function position_box(){
            var replace_box=$(".box_info");
            replace_box.width(view_width);
            box.find(".bb_title").width(view_width-10);
            var win_width=$(window).width();
            var replace_width=replace_box.width();
            $(".Bzy_Box").show();
            replace_box.css({left:(win_width-replace_width)/2,top:100});
        }
    }

    /**
     * 判断输入的是什么类型
     * @param opt event_Name:对应类型,class_Name:有那些标签需要些事件
     * @param obj 处理业务上的逻辑
     */
    $.fn.eventChange = function(opt,obj){
        var ec_id=$(this),class_Name=opt.class_Name;
        $.each(class_Name,function(i,val){
            var e_id=$(val);
            if(opt.event_Name=="keyup"){
                e_id.keyup(function(){
                    obj(this);
                })
            }
            if(opt.event_Name=="click"){
                e_id.click(function(){
                    obj(this);
                })
            }
        })
    }


    /**
     * 展开全部显示
     * autoHeight:指定的高度
     * moreCls:指定的点击样式 默认为：key_more
     * moreTop: 标签相对上面 默认：5px
     * moreRight: 标签相对右面 默认：10px
     * moreMsg: 更多描述 默认：更多
     * moreNotMsg: 收起的描述 默认：收起
     */
    $.fn.unfoldMore = function(opt){
        var key=$(this);
        /*var key_li=key.find(opt.findClass);*/
        var auto_h=opt.autoHeight;
        var h=key.height();
        if(h<auto_h) return true;

        //标签位置
        var m_t = "5px",m_r = "10px";
        m_t = opt.moreTop ? opt.moreTop : m_t;
        m_r = opt.moreRight ? opt.moreRight : m_r;

        //说明
        var more_msg="更多",more_not_msg = "收起";
        more_msg = opt.moreMsg ? opt.moreMsg : more_msg;
        more_not_msg = opt.moreNotMsg ? opt.moreNotMsg : more_not_msg;

        var more_cls = "key_more";
        more_cls = opt.moreCls ? opt.moreCls : more_cls;

        var more_tpl = '<span class="'+more_cls+'">'+more_msg+'</span>';
        key.append(more_tpl);
        var addCls = { position:"relative",height:auto_h+'px',overflow:"hidden" };
        var hasCls = { position:"relative" };
        key.css(addCls);
        var key_more = key.find("."+more_cls);
        key_more.css({
            position: "absolute",
            top:m_t,
            right:m_r,
            cursor: "pointer"
        });
        key_more.click(function(){
            var t_key = $(this).parent();
            if( $(this).html()==more_msg){
                t_key.removeAttr("style");
                t_key.css(hasCls);
                $(this).html(more_not_msg);
            }else{
                t_key.css(addCls)
                $(this).html(more_msg);
            }
        })
    }

    /**
     * 滑动展现信息
     * @param HoverCls 要显示的样式
     * @constructor
     */
    $.fn.LeftHover = function(opt){
        var nav=$(this);
        var left_main = nav.find(opt.HoverCls);
        var n_time="";
        var num=0;
        var n=0;
        var back=nav.find(".back").attr("val");
        if(back){
            nav.find(".back").hover(function(){
                clearTimeout(n_time);
                nav_show();
            },function(){
                n_time=setTimeout(function(){
                    nav_hide();
                },200)
            });
            left_main.hover(function(){
                clearTimeout(n_time);
            },function(){
                n_time=setTimeout(function(){
                    nav_hide();
                },200)
            });
        }

        var info_time="";
        nav.find(".bzy_nav_list").find(".nav_list").hover(function(){
            num=nav.find(".nav_list").index($(this));
            info_hide(n);
            info_show(num);
        },function(){
            n=num;
            info_time=setTimeout(function(){
                info_hide(n);
            },200)
        });

        nav.find(".bzy_mln_info").find(".min_right").hover(function(){
            clearTimeout(info_time)
        },function(){
            info_time=setTimeout(function(){
                info_hide(n);
            },200)
        })


        function info_show(n){
            nav.find(".bzy_mln_info").find(".min_right").eq(n).show();
            nav.find(".bzy_nav_list").find(".nav_list").eq(n).addClass("nav_list_cls_bk");
        }

        function info_hide(n){
            nav.find(".bzy_mln_info").find(".min_right").eq(n).hide();
            nav.find(".bzy_nav_list").find(".nav_list").eq(n).removeClass("nav_list_cls_bk");
        }

        function nav_show(){
            left_main.show();
        }

        function nav_hide(){
            left_main.hide();
        }
    }


    Date.prototype.dateDiff = function(interval,objDate2)
    {
        var d=this, i={}, t=d.getTime(), t2=objDate2.getTime();
        i['y']=objDate2.getFullYear()-d.getFullYear();
        i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4);
        i['m']=i['y']*12+objDate2.getMonth()-d.getMonth();
        i['ms']=objDate2.getTime()-d.getTime();
        i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000));
        i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000);
        i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000);
        i['n']=Math.floor(t2/60000)-Math.floor(t/60000);
        i['s']=Math.floor(t2/1000)-Math.floor(t/1000);
        return i[interval];
    }


    /**
     * 单位店铺开通上线倒计时
     * date 日期
     * website 站点信息
     * webtype 站点类型
     * 调用方法如下
     * $("#count_js").showCountTime({
            date:"2014/3/10",
            website:"南京站",
            webtype:"周边短线"
        })
     * @param opt
     */
    $.fn.showTime = function(opt){
        var s_id=$(this);
        var  date=opt.date,webString=opt.webString,webTxt=webString,webType=opt.webType;
        s_time(date,webString);
        function s_time(date,webString){
            var Yearleft= 0,Monthleft=0,Dateleft= 0,Hourleft= 0,Minuteleft= 0,Secondleft=0;
            if(webType=="Month"){
                var Today = new Date();
                var NowHour = Today.getHours();
                var NowMinute = Today.getMinutes();
                var NowMonth = Today.getMonth();
                var NowDate = Today.getDate();
                var NowYear = Today.getFullYear();
                var NowSecond = Today.getSeconds();
                if (NowYear < 2000)
                    NowYear= 1900 + NowYear;
                Today = null;
                var dates = new Date(date);
                Yearleft = dates.getFullYear() - NowYear,
                    Monthleft = dates.getMonth() - NowMonth - 1,
                    Dateleft = dates.getDate() - NowDate,
                    Hourleft = dates.getHours() - NowHour,
                    Minuteleft = dates.getMinutes() - NowMinute,
                    Secondleft = dates.getSeconds() - NowSecond;
                if (Secondleft<0)
                {
                    Secondleft=60+Secondleft;
                    Minuteleft=Minuteleft-1;
                }
                if (Minuteleft<0)
                {
                    Minuteleft=60+Minuteleft;
                    Hourleft=Hourleft-1;
                }
                if (Hourleft<0)
                {
                    Hourleft=24+Hourleft;
                    Dateleft=Dateleft-1;
                }
                if (Dateleft<0)
                {
                    Dateleft=31+Dateleft;
                    Monthleft=Monthleft-1;
                }
                if(Dateleft<10){ Dateleft=0+""+Dateleft; }

                if (Monthleft<0)
                {
                    Monthleft=12+Monthleft;
                    Yearleft=Yearleft-1;
                }
            }else{

                var t = new Date();
                var t1 = new Date(date);
                var d = t.dateDiff('s', t1);
                var Dateleft = parseInt(d/86400),
                    hs = d - Dateleft * 86400,
                    Hourleft = parseInt( hs / (60*60)),
                    ms = hs - Hourleft * 3600,
                    Minuteleft = parseInt( ms / 60),
                    Secondleft = ms - Minuteleft*60;
                //s_id.html(date);
                //alert(d + '\n' + day + '天\n' + h + '小时\n' + m + '分钟\n' + s + '秒');

                /* var t = parseInt(time()/1000);
                 var t1 = parseInt(time(new Date(date))/1000);
                 var Dates = t1 - t;
                 //天
                 Dateleft = Dates%60;
                 //Dateleft = Dates%86400;*/

            }

            return false;
            if(parseFloat(Secondleft)<0){
                if(!opt.EntMsg) opt.EntMsg="活动结束!";
                s_id.html(opt.EntMsg);
                return false;
            }
            if(Secondleft<10){ Secondleft=0+""+Secondleft; }
            if(Minuteleft<10){ Minuteleft=0+""+Minuteleft; }
            if(Hourleft<10){ Hourleft=0+""+Hourleft; }
            if(Monthleft<10){ Monthleft=0+""+Monthleft; }
            /*webString=webString.replace("`Year`",Yearleft);//年
             webString=webString.replace("`Month`",(dates.getMonth()+1));//月
             webString=webString.replace("`Date`",dates.getDate());//日*/
            webString=webString.replace("`Day`",Dateleft);//天数
            webString=webString.replace("`Hour`",Hourleft);//月
            webString=webString.replace("`Minute`",Minuteleft);//天数
            webString=webString.replace("`Second`",Secondleft);//天数
            //Temp="距"+(dates.getMonth()+1)+"月"+dates.getDate()+"日"+website+webtype+"正式上线还有<br /><span>"+Dateleft+"</span>天<span>"+Hourleft+"</span>小时<span>"+Minuteleft+"</span>分<span>"+Secondleft+"</span>秒";
            //Temp="倒计时<b>"+Dateleft+"</b>天<b>"+Hourleft+"</b>小时<b>"+Minuteleft+"</b>分<b>"+Secondleft+"</b>秒";

            Temp = webString;
            s_id.html(Temp);
            timerID = setTimeout(function(){
                webString = webTxt;
                s_time(date,webString);
            },1000);
            timerRunning = true;
        }
    }
    /**
     * 下拉选择控件
     * @param Cls 指下需要放的位置
     */
    $.fn.selectData = function(opt,obj){
        var s_id = $(this);
        var data = opt.sData,
            valName = opt.valName,
            valDefault = opt.valDefault;
        var tpl_list = "";
        $.each(data,function(i,v){ tpl_list+= '<li class="sel_list" data-val="'+i+'">'+v+'</li>'; })
        var tpl = '<div class="select_data">' +
            '<input type="text" value="'+valDefault+'" class="select_val" name="'+valName+'" readonly>' +
            '<div class="select"><ul>'+tpl_list+'</ul></div></div>';
        s_id.html(tpl);
        var select_data = $(".select_data");
        var win=0;
        $(".select_val").toggle(function(){
            $(this).parent().find(".select").show();
            $(this).parent().find(".select").css("z-index",9999)
            win=1;
        },function(){
            $(this).parent().find(".select").show();
            $(this).parent().find(".select").css("z-index",9999)
            win=1;
        });
        select_data.find(".sel_list").click(function(){
            $(this).parent().parent().parent().find(".select_val").val($(this).attr("data-val"));
            if(obj) obj($(this).attr("data-val"),$(this).parent().parent().parent().parent().parent().find(".tz_card"));
        });
        $("body").click(function(){ if(win==1){
            select_data.find(".select").hide();  win=0;
            select_data.find(".select").css("z-index",0);
        } });
    };


/**
     * 浮动导航菜单
     * autoHeight:要计算高度的区域有那里,组数形式:["n1","n2"]
     * ClickId:要改变样式的ID
     * ClickClass:需要改变的样式
     * cDivId：需要统计到什么区域改变样式
     * custom_h：自定义高度;默认为：125
     * @param opt
     */
    $.fn.scrollAnchor= function(opt){
        var sa_id = this,
            ClickId=$(sa_id).find(opt.ClickId),
            ClickClass=opt.ClickClass,
            cDivId=$(opt.cDivId),
            custom_h=125;
        var xcsm=$('.xcsm-box');
        var cl_l=xcsm.find('.cl-l');

        var autoHeight=opt.autoHeight,
            len=autoHeight.length;

        if(opt.custom_h) custom_h=opt.custom_h;
        var c=cDivId,c_len=c.length;
        $(window).scroll(function () {
            var h= 0;
            for(var i=0;i<len;i++){
                h=h+$(autoHeight[i]).outerHeight();
            }
            h=h+custom_h;
            var wh = $(window).scrollTop();
            scr(wh,h);
            position(wh,h)
            days_fn(wh);
        })

        function days_fn(wh){
            var xcsm_h=xcsm.offset().top;
            var cont_left=xcsm.find('.cont-left');
            var circle = $('.fa-circle-thin');
            if(wh>=xcsm_h){
                if(wh>(circle.offset().top-cont_left.height())){
                    cont_left.css({
                        display:'none'
                    })
                }else{
                    cont_left.css({
                        position: 'fixed',
                        top: '50px',
                        display:'block'
                    })
                  /*  $.each(cont_left,function(i,v){
                        var top_value=50+i*35;
                        cont_left.eq(i).css({
                            position: 'fixed',
                            top: top_value+'px',
                            display:'block'
                        })
                    })*/

                }
            }else{
                cont_left.css({
                    position: 'static',
                    top: '0'
                })
            }
            var days_icon=xcsm.find('.days-icon');
            var days_n=0;
            $.each(days_icon,function(i,v){
                var t_top=days_icon.eq(i).offset().top-60;
                if(wh>t_top)days_n=i;
            })
            setTimeout(function(){
                xcsm.find('.cl-l').removeClass('cl-hover').hide();
                xcsm.find('.cl-l').eq(days_n).addClass('cl-hover').show();
            },200);

        }

        sa_id.find('.item-l').click(function(){ item_fn(this,opt.GotoCls);});
        $('.cl-l').click(function(){item_fn(this,'.xcsm-box .days-icon'); });

        function item_fn(t,cls){
            var item_val=$(t).attr('goto');
            var this_h=sa_id.height();
            var to_h=$(cls+'[goto="'+item_val+'"]').offset().top;
            $(document).scrollTop(to_h-this_h-10);
        }

        function  position(wh,h){
            for (var j = 0; j < c_len; j++) {
                var ch = h, ch_t;
                for (var z = 0; z < j; z++) {
                    ch = ch + c.eq(z).outerHeight();
                }
                ch_t = ch + c.eq(j).outerHeight();
                if (wh >= ch && wh < ch_t) {
                    ClickId.removeClass(ClickClass);
                    ClickId.eq(j).addClass(ClickClass);
                }
            }
        }
        function scr(wh,h){
            var bk=opt.blockClass
            if(wh>=h){
                $(sa_id).css("position","fixed");
                if(bk){
                    $(bk[0]).hide();
                    $(bk[1]).show();
                }
            }else{
                $(sa_id).css("position","relative");
                if(bk){
                    $(bk[1]).hide();
                    $(bk[0]).show();
                }
            }
        }
    }


    /**
     * 限制只能用数字
     * @param opt Msg:描述；TypeNumber:判断是否可以用正数或负数
     * @param obj 需要执行的方法
     * @constructor
     */
    $.fn.KeyUpNumber = function(opt,obj){
        var id = $(this);
        var Msg = opt.Msg;
        var TypeNumber = opt.TypeNumber;
        var ToType = opt.ToType;
        var Hover_cls = opt.Hover_cls
        var MaxMoney = opt.MaxMoney
        var id_val = id.val();

        id.keyup(function(){
            var v = $(this).val();
            if(!TypeNumber) TypeNumber = "-";
            if(v==TypeNumber || !v) v=0;
            v = parseFloat(v);
            if((!v && v!=0) || v>MaxMoney){
                if(Hover_cls==".ajax_msg"){
                    id.parent().find(Hover_cls).html(Msg);
                }else{
                    alert(Msg);
                }
                $(this).val(id_val);
                return false;
            }else{
                if(Hover_cls==".ajax_msg"){
                    id.parent().find(Hover_cls).html("");
                }
                if(v!=0){
                    $(this).val(v);
                }
            }
            if(obj) obj(ToType,$(this),v);
        })
    };

    /**
     * 输入框默认值
     * @param opt
     * @constructor
     */
    $.fn.DefaultVal = function(opt){
        var default_txt = $(this),def_cls = opt.DefaultCls;
        $.each(default_txt,function(i,v){
            default_txt.eq(i).val(default_txt.eq(i).attr("default-data"));
        });
        default_txt.blur(function(){
            def_val($(this),"blur");
        });
        default_txt.focus(function(){
            def_val($(this),"focus");
        });

        function def_val(t,ty){
            var d_val = t.val(),d_txt = t.attr("default-data");
            if(d_val==d_txt){
                t.val("");
            }else{
                if(d_val=="") t.val(d_txt);
            }
            if(ty=="blur"){
                t.addClass(def_cls);
            }else{
                t.removeClass(def_cls);
            }
        }
    };

    $.fn.smartFloat = function() {
        var position = function(element) {
            var top = element.position().top, pos = element.css("position");
            $(window).scroll(function() {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) {
                    if (window.XMLHttpRequest) {
                        element.css({
                            position: "fixed",
                            top: 0
                        });
                    } else {
                        element.css({
                            top: scrolls
                        });
                    }
                }else {
                    element.css({
                        position: "absolute",
                        top: top
                    });
                }
            });
        };
        return $(this).each(function() {
            position($(this));
        });
    };

    $.fn.ExtPayPlan = function(opt,obj){
        var ext_id=$(this),
            Number_ID = opt.Number,
            old_money = opt.o_money,
            money_type = opt.money_type;
        function formatDate(value) {
            var dt=new Date(value);
            if(!value) dt="";
            return dt ? dt.dateFormat('Y-m-d') : '';
        };

        var ps_store = SUNLINE.JsonStore($__app__ + '/OrderBack/ps_json', ["name","money","time","status"],false);
        ps_store.baseParams.o_number=Number_ID;
        ps_store.reload();
        var ps_cm = new Ext.grid.ColumnModel({
            columns:[
                new Ext.grid.RowNumberer(),
                {header:"计划名称", dataIndex:"name", width:120,editor: new Ext.form.TextField({ allowBlank: false ,id:"rg_times"})},
                {header:"付款金额", dataIndex:"money", width:90,renderer:money,align:"right",editor: new Ext.form.NumberField({ allowBlank: false })},
                {header:"付款时间", dataIndex:"time", width:80,renderer:formatDate,editor: new SUNLINE.ExtDateField()},
                {header:"付款状态", dataIndex:"status", width:60,renderer:pstatus}
            ],
            defaults:{sortable: true, menuDisabled:true}
        });
        var ps_grid = new Ext.grid.EditorGridPanel({
            region : 'center',
            border : false,
            height:400,
            store : ps_store,
            clicksToEdit:1,
            loadMask : {msg:'付款计划数据载入中，请稍后'},
            cm : ps_cm, //表格列定义
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),//行选择模式(单选)
            viewConfig : {emptyText: '暂无付款计划信息。'},
            tbar: [
                {text:'添加付款计划',iconCls:'button-add',handler:function(){
                    if(ps_store.getCount()>=5){
                        Ext.Msg.alert("友情提示","每个产品只可以设置5个规则!");
                        return false;
                    }
                    var ps_txt = ["预付定金","签证费用","机票费用","尾款"];
                    var m = 0;
                    var i = 0;
                    ps_store.each(function(record){
                        m+=record.data.money;
                        i++;
                    });
                    var o_m = old_money;
                    if(money_type=="html")
                        o_m = old_money.html();
                    var order_money = parseFloat(o_m);
                    if(!order_money) order_money= 0;
                    if(m>=order_money){
                        Ext.Msg.alert("友情提示","没有可设置计划的金额！");
                        return false;
                    }
                    m = order_money-m;
                    ps_store.add(new Ext.data.Record({name:ps_txt[i],money: m,time:new Date(),status:"待付款"}));
                }},
                "-",
                {text:'删除计划',iconCls:'button-del',handler:renege_del},
                '->',
                {text:'刷新', iconCls:'button-ref', handler:function(){ps_store.reload();} }
            ],
            listeners:{
                'cellclick' : function(grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    if(record.get("status")=="已付款"){
                        Ext.Msg.alert("友情提示","已付款的计划不可编辑!");
                        return false;
                    }
                }
            }
        });
        var ps_win=new Ext.Window({
            title:"付款计划设置",
            width:400,
            height:400,
            closeAction:"hide",
            modal : true,
            items: ps_grid ,
            layout : 'border',
            buttons:[
                {text:'保存',handler:ps_save},
                {text:'关闭',handler:function(){
                    ps_win.hide();
                }}
            ]
        });
        $(".ps_icon").click(function(){
            ps_win.show()
        });

        function pstatus(v){
            if(v=="已付款"){
                v = "<b style='color:red'>"+v+"</b>";
            }
            return v;
        }

        /*ps_win.on("show",function(){
            ps_store.baseParams.o_number=Number_ID;
            ps_store.reload();
        });
        ps_win.on("hide",function(){
            ps_store.removeAll();
        });*/
        function ps_save(){
            var tmp = [],null_bool=true;
            ps_store.each(function(record){
                var data = record.data;
                if(!data.name || !data.money){
                    null_bool=false;
                    return false;
                };
                var time_s = data.time;
                if(time_s.length==10){
                    data.time = time_s;
                }else if(time_s.length==19){
                    data.time = time_s.substr(0,10);
                }else{
                    data.time = time_s.format('Y-m-d');
                }
                tmp.push(data) ;
            });
            if(null_bool==false){
                Ext.Msg.alert('友情提示','计划中存在空值，请修改后再提交！');
                return;
            };
            ps_win.hide();
            /*return false;
            var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在保存，请稍后...'});
            mask.show();
            Ext.Ajax.request({
                url : $__app__ + '/OrderLog/change_out_num',
                method : 'POST',
                params : {o_pay_plan:Ext.encode(tmp),o_number:Number_ID},
                success : function(response, opts){
                    var rst = Ext.decode(response.responseText);
                    mask.hide();
                    if (rst.status=='1'){
                        Ext.Msg.alert("友情提示",rst.info);
                        ps_win.hide();
                        ps_store.load();
                    }else{
                        Ext.Msg.alert("友情提示","付款计划保存失败!");
                    }
                },
                failure : function(response, opts){
                    Ext.Msg.alert('友情提示', '付款计划保存失败！请稍候再试。');
                }
            });*/
        };
        function renege_del(){
            var row = ps_grid.getSelectionModel().getSelected();
            if(row.data.status=="已付款"){
                Ext.Msg.alert("友情提示","已付款的计划不可删除!");
                return false;
            }
            ps_store.remove(row);
        }

        ps_store.on("load",function(){
            var data = ps_tpl(ps_store);
            ext_id.html(data["tpl"]);
            if(obj) obj(data["money"],ps_store,ps_win);
        });

        ps_win.on("hide",function(){
            var data = ps_tpl(ps_store);
            if(data["bool"]===false) return false;
            ext_id.html(data["tpl"]);
            if(obj) obj(data["money"],ps_store,ps_win);
        });

        function ps_tpl(store){
            var tpl_up="";
            var tpl_down="";
            var n=store.getCount();
            var f = (100-n)/n;
            var i = 0;
            var money = 0;
            var bool=false;
            var status="已付款";
            store.each(function(record){
                i++;
                var data = record.data;
                var style = "";
                if(i<n) style = "border-right: 1px dotted #CCCCCC;";
                style +="width:"+f+"%"
                tpl_up += '<td align="left" style="'+style+'">' +
                    '<span class="float_right">'+data.time+'</span>'+data.name+'</td>';
                var cls_block = "";
                var block_txt = '';
                if(status=="已付款"){
                    block_txt = '<span class="ps_pay"> 立即支付>>></span>'
                }
                if(data.status=="已付款"){
                    cls_block = "ps_block";
                    block_txt = '<span class="ps_end_pay">(已付款)</span>'
                }
                tpl_down += '<td class="'+cls_block+'">'+parseFloat(data.money).toFixed(2)+'元'+block_txt+'</td>';
                money += parseFloat(data.money);
                bool=true;
                status = data.status;
            });
            var tpl='<table border="0" cellspacing="0" cellpadding="0" class="payment_schedule_line">' +
                '<tr class="ps_line_list up">'+tpl_up+'</tr><tr class="ps_line_list down">'+tpl_down+'</tr></table>';
            return {tpl:tpl,money:money,bool:bool};
        }
    };
    /**
     * 返回头部js插件
     * @constructor
     */
    $.fn.WindTopScroll = function(){
        var body_id=$(this);
        body_id.append('<div class="return-top"><ul><li><i class="fa fa-angle-up"></i></li><li class="rt-l go-top">返回顶部</li></ul></div>');
        var return_top=$('.return-top');
        var go_top=return_top.find('.go-top');
        setTimeout(function(){
            return_top.hide();
            go_top.unbind();
            go_top.click(function(){
                body_id.animate({scrollTop:0},200);
            });
            $(window).scroll(function(){
                var w_h=body_id.height();
                var t_h=$(this).scrollTop();
                if(t_h>200){
                    return_top.show();
                }else{
                    return_top.hide();
                }
            });
        },200)
    }

    //产品搜索
    $.fn.SearchBoxTxt=function(opt,obj){
        var sh_sub=$(this).find('.sh_sub');
        var sh_txt=$(this).find('.sh_txt');
        sh_txt.val(opt.value);
        var df_txt='';
        sh_sub.click(function(){
            var text=sh_txt.val();
            if(df_txt && df_txt==text) return;
            df_txt=text;
            search_fn(text);
        });
        sh_txt.keydown(function(e){
            var text=sh_txt.val();
            if(df_txt && df_txt==text) return;
            df_txt=text;
            if(e.keyCode==13)search_fn(text);
        });
        function search_fn(v){
            if(obj)obj(v);
        }
    };
    //产品搜索下拉框
    $.fn.SearchSelect=function(opt,obj){
        var sh_id=$(this);
        /*搜索框条件搜索操作*/
        var SearchSelect = {
            search_box:sh_id,
            search:function(opt,obj){
                var t=(this.search_box).find('.sh_txt');
                var float_box=(this.search_box).find('.float-box');
                var t_id=this;
                var key_re='ok';
                var n_index=0;
                t.unbind();
                t.keydown(function(event){
                    var key_code = event.keyCode;
                    if(key_code==40 || key_code==38){ n_index=t_id.UpDown(key_code,n_index,t,float_box); return; }
                    if(key_code==13){t_id.UpEnter(t,float_box);return;}
                    var tt=$(this);
                    if(key_re=='no')return;
                    if((key_code>=65 && key_code<=90) || (key_code>=48 && key_code<=57) || key_code==32 || key_code==8 || key_code==127 || key_code==229){
                        key_re='no';
                        setTimeout(function(){
                            var skey=tt.val();
                            t_id.SearchAjax({skey:skey});
                            key_re='ok';
                            n_index=0;
                        },1000);
                    }else{
                        key_re='ok';
                    }
                });
                t.click(function(){
                    var skey=$(this).val();
                    if(!skey)return ;
                    t_id.SearchAjax({skey:skey});
                    n_index=0;
                });
                t_id.SearchBlur(t,float_box);

            },
            UpDown:function(code,n,t,float_box){
                var len=float_box.find('.fb-list').length;
                if(n>=len)n=0;
                if(n<0)n=len-1;
                float_box.find('.fb-list').removeClass('fb-select');
                var fb_select=float_box.find('.fb-list').eq(n);
                fb_select.addClass('fb-select');
                t.val(fb_select.attr('data-val'));
                if(code==40){ n++;}else{ n--;}
                return n;
            },
            SearchAjax:function(premes){
                var float_box=(this.search_box).find('.float-box');
                var t=this;
                $.ajax({
                    type:"POST",
                    url:$__app__ + "/KeySearch/key_json",
                    data:premes,
                    success:function (msg) {
                        var row = msg;
                        if (typeof msg != 'object')
                            row = eval("(" + msg + ")");
                        if(row.status==1){
                            var root=row.info.data;
                            float_box.show();
                            t.SearchTpl(root,float_box,premes);
                        }else{
                            float_box.hide();
                        }
                        t.SearchHover(float_box);
                    }
                });
            },
            SearchTpl:function(data,cls,premes){
                var tpl='';
                $.each(data,function(i,v){
                    var nm= (v.KeyName).replace(premes.skey,'<b>'+premes.skey+'</b>');
                    tpl+='<dd class="fb-list" data-type="'+ v.KeyType+'" data-val="' + v.KeyName+'">' +
                        '<span class="fb-r">'+ v.KeyGroup+'</span>' + nm +
                        '</dd>';
                });
                cls.html('<dl>'+tpl+'</dl>');
            },
            SearchBlur:function(t,float_box){
                t.blur(function(){
                    setTimeout(function(){float_box.hide()},500);
                })
            },
            UpEnter:function(t,float_box){
                var v=t.val();
                if(!v)return ;
                this.SearchFn(float_box,v);
            },
            SearchHover:function(float_box){
                var list=float_box.find('.fb-list');
                var t=this;
                list.unbind();
                list.hover(function(){
                    list.removeClass('fb-select');
                    $(this).addClass('fb-select');
                },function(){
                    list.removeClass('fb-select');
                });
                list.click(function(){
                    t.SearchFn(float_box,$(this).attr('data-val'));
                });
            },
            SearchFn:function(float_box,v){
                var url='';
                var fb_select=float_box.find('.fb-select');
                var data={};
                if(fb_select.length>0){
                    if(fb_select.attr('data-type')=='周边短线'){
                        url='circum#';
                        data['type']='circum';
                    }else{
                        url='inland#';
                        data['type']='inland';
                    };
                    var fb_r=fb_select.find('.fb-r');
                    if(fb_r.html()=='热门景点'){
                        url+='scenic_'+v;
                        data['scenic']=v;
                    };
                    if(fb_r.html()=='目的省份'){
                        url+='province_'+v;
                        data['province']=v;
                    };
                    if(fb_r.html()=='目的城市'){
                        url+='city_'+v;
                        data['city']=v;
                    };
                    if(fb_r.html()=='主题属性'){
                        url+='attribute_'+v;
                        data['attribute']=v;
                    }
                    if(fb_r.html()=='出行天数'){
                        url+='days_'+v;
                        data['days']=v;
                    }
                }else{
                    data={
                        type:'inland',
                        skey:v
                    };
                    url='inland#skey_'+v;
                }
                if(opt.type=='url'){
                    window.location = $__app__+'/search/'+url;
                }else{
                    if(obj)obj(data);
                }
                float_box.hide();
            }
        };
        SearchSelect.search(opt,obj);
    };

    /**
     * 城市选择框
     * @constructor
     */
    $.fn.SelectCity = function(opt){
        var s_left=$(this);
        var fa_angle = s_left.find('.fa-angle');
        city_box_fn();
        s_left.find('.city-cls').click(function(){
            if(s_left.hasClass('city-hover')){
                s_left.removeClass('city-hover');
                fa_angle.removeClass('fa-angle-up');
                fa_angle.addClass('fa-angle-down');
            }else{
                s_left.addClass('city-hover');
                fa_angle.removeClass('fa-angle-down');
                fa_angle.addClass('fa-angle-up');
            }
        });

        /**
         * 添加选择框
         */
        function city_box_fn(){
            var data={
                hot:'热门出发地',
                ABCDEFG:'ABCDEFG',
                HJKLMNQ:'HJKLMNQ',
                RSTWXYZ:'RSTWXYZ'
            };
            var title_h=city_title_tpl_fn(data);
            s_left.append('<div class="city-box">' +title_h+ '<div class="city-info"><ul></ul></div></div>');
            city_fn();
        }

        /**
         * 选择项框的标题
         * @param data
         * @returns {string}
         */
        function city_title_tpl_fn(data){
            var t='';
            $.each(data,function(i,v){
                var c='';
                if(i=='hot')c='ct-hover';
                t+='<li class="ct-l '+c+'" title="'+i+'"><font>'+v+'</font><i class="l-top"></i><i class="l-bottom"></i></li>';
            });
            return '<div class="city-title"><ul>' + t +'</ul></div>';
        }

        function city_fn(){
            var city_box=$('.city-box');
            var ct_l=city_box.find('.ct-l');
            var city_info=city_box.find('.city-info ul');
            city_info.html(city_tpl_box(opt.store['hot']));
            ct_l.click(function(){
                ct_l.removeClass('ct-hover');
                $(this).addClass('ct-hover');
                var f_v=$(this).attr('title');
                var val='';
                if(f_v=='hot'){
                    val=city_tpl_box(opt.store[f_v]);
                }else{
                    val=city_tpl_title(opt.store[f_v]);
                }
                city_info.html(val);
                city_select(city_box);
            });
            city_select(city_box);
        }

        function city_tpl_box(data){
            var tpl='<li class="ci-l"><span class="ci-box">';
            if(typeof  data=='object'){
                $.each(data,function(i,v){
                    var cls='';
                    if(v.num>25)cls='hot-cls';
                    tpl+= '<a href="javascript:;" class="item '+cls+'" data-val="'+v.city+'">'+ v.city+'</a>\r';
                });
            }
            return tpl+'</span></li>';
        }
        function city_tpl_title(data){
            if(typeof  data!='object')return '';
            var tpl='';
            $.each(data,function(i,v){
                tpl+='<li class="ci-l zm">' +
                    '<span class="ci-title">'+i+'</span>'+
                    '<span class="ci-box">' ;
                var tt='';
                $.each(v,function(ci,cv){
                    var cls='';
                    if(cv.num>5)cls='hot-cls';
                    tt+='<a href="javascript:;" class="item '+cls+'" data-val="'+cv.city+'">'+cv.city+'</a>\r';
                });
                tpl+=tt+'</span></li>'
            });
            return tpl;
        }
        function city_select(city_box){
            var item=city_box.find('.item');
            var city_b=$('.city-cls').find('.city');
            item.unbind();
            item.click(function(){
                var v=$(this).attr('data-val');
                sessionStorage.city_data=v;
                city_b.html(v);
                s_left.removeClass('city-hover');
                fa_angle.removeClass('fa-angle-up');
                fa_angle.addClass('fa-angle-down');
            });
        }
        $(window).load(function(){
            var city_v='吉安';
            if(opt.org_city){
                sessionStorage.city_data='';
                city_v=opt.org_city;
            }
            if(sessionStorage.city_data){
                city_v=sessionStorage.city_data;
            }else{
                sessionStorage.city_data=city_v;
            }
            var city_b=$('.city-cls').find('.city');
            city_b.html(city_v);
        });
    };
})(jQuery)

