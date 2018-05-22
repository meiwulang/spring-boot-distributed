import '../../less/detail.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _.GetCityCode(function(citycode){
            _this.citycode = citycode;
            // _this.Render(citycode);
            _.Statistics();
            var openId = $.trim(_.GetUrlPara('openId'));
            if( openId ){
                window.sessionStorage.setItem('openid',openId);
            }
            _this.Render(citycode);
            
        })
	}

    Render(city_code){
        let _this = this;
        var uid = '';
        var froms = '';//预览参数
        //仅浏览 不可操作
        var from = _.GetUrlParaByHref("from");
        if(from == 'preview'){
           froms = "preview";
           window.sessionStorage.setItem('from','preview');
        }else{
           window.sessionStorage.setItem('from','');
        };
        _this.citycode = city_code;
        if(share_user && share_user.u_id){
            uid = share_user.u_id;
        }
        _.Ajax({
            url : '/front/b2b/product/detail',
            type : 'get',
            data : {
                p_id : _.GetUrlPara('p_id'),
                city_code : city_code,
                s_uid : uid,
                from : froms,
                start_date : ''
            },
            success : function(res){
                if( res.code == 200 ){
                    $('head title').text(res.data.p_type_name);
                    res.data['city_code'] = _this.citycode;
                    res.data['share_user'] = share_user;
                    res.data['share_user_flag'] = 1;
                    if( !share_user || JSON.stringify(share_user) == '{}' ){
                        res.data['share_user_flag'] = 0;
                    }else if(share_user.org_type == '供应商'){
                        res.data['share_user_flag'] = 0;
                    }
                    var html = template('tpl-detail',res.data);
                    $('.main').html(html);

                    var eyestate = window.localStorage.getItem('eye');
                    eyestate = 0;
                    if( eyestate == 0 ){
                        $('.eye').removeClass('eyes');
                        $('.return').hide();
                    }else{
                        $('.eye').addClass('eyes');
                        $('.return').show();
                    }

                    // 返回按扭
                    $('.icons .back').on('click',function(){
                        var city_codes = _.GetUrlPara('city_code');
                        if(city_codes){
                            window.location.href = 'list.html?type=' + res.data.p_type;
                        }else{
                            window.history.back();
                        }
                        // if( window.history.length > 1 ){
                        //     window.history.back();
                        // }else{
                        //     window.location.href = 'list.html?type='+res.data.p_type;
                        // }
                    })

                    $("dt span").each(function(){
                        var html = $(this).text().replace(/\[@([^\]]*)]/g, ' <i class="fa fa-$1" aria-hidden="true"></i> ');
                        $(this).html(html);
                    });
                    var appoint = res.data.appoint;
                    if(appoint == false){
                        $('.date-list li').addClass("appoin");
                        $(".submit-btn").attr("href","javascript:;");
                        $(".submit-btn").css("background","#999");
                        $(".submit-btn").html("无权购买");
                        $(".submit-btn").addClass("appoin");
                        $(".date-t-more").addClass("appoin");
                    }
                    var nums = 0;
                    $(".details-menu .ul_ul ul li").each(function(){
                        nums += $(this).width();
                    })
                    $(".details-menu .ul_ul ul").width(nums);

                    if( $(".date-list ul li").length < 1 || res.data.bus_list.no_price_bool == 0 ){
                        $(".date-t-more").addClass("alerts").attr("href","javascript:;");
                        $(".submit-btn").addClass("alerts").attr("href","javascript:;");
                        $(".date-list").css("display","none");
                        $(".date-t").css("border-bottom","none");
                    }else{
                        $(".date-list").css("display","");
                        $(".date-t").css("border-bottom","");
                    }
                    _this.Banner();
                    _this.Event();
                    _this.Poes(res.data.code_url);
                    _this.Wx(res.data);
                    if(res.data.detail){
                        $(window).on("scroll", function() {
                            var $top = ($(window).scrollTop()) + 63;
                            var $off_top = $("#lifeature").offset().top;//线路特色
                            var $off_topt = $("#listroke").offset().top;//行程简介
                            var $off_topi = $("#linotice").offset().top;//预定须知
                            var $off_topg = $("#livisa").offset().top;//签证信息
                            var header = document.querySelector('.ul_ul');
                            if($top > ($off_topt)){
                                header.classList.add('sticky');
                                $(".details-menus li").removeClass("active");
                                $(".details-menus li").eq(0).addClass("active");
                            }else{
                                header.classList.remove('sticky');
                            }
                            if($top > $off_top){
                                $(".details-menus li").removeClass("active");
                                $(".details-menus li").eq(1).addClass("active");
                            }
                            if(res.data.detail.cost_in || res.data.detail.cost_noin){
                                var $off_tops = $("#licost_in").offset().top;//费用包含
                                var $off_topf = $("#licost_noin").offset().top;//费用不包含
                                if($top > $off_tops){
                                    $(".details-menus li").removeClass("active");
                                    $(".details-menus li").eq(2).addClass("active");
                                }
                                if($top > $off_topf){
                                    $(".details-menus li").removeClass("active");
                                    $(".details-menus li").eq(3).addClass("active");
                                }
                            }
                            if($top > $off_topi){
                                $(".details-menus li").removeClass("active");
                                $(".details-menus li").eq(4).addClass("active");
                            }
                            if($top > $off_topg){
                                $(".details-menus li").removeClass("active");
                                $(".details-menus li").eq(5).addClass("active");
                            }
                            //简易、详细行程悬浮
                            if($top > ($off_topt - 300)){
                                $(".detail_move").show();
                            }else{
                                 $(".detail_move").hide();
                            }
                            if($top > ($off_top - 370)){
                               $(".detail_move").hide();
                            }
                        })
                    }
                }
            }
        })
    }

    Wx(data){
        let _this = this;
        var p_sname = '';
        // if( data.share_user_flag == 1 ){
            let uid = '', userinfo_orgid = '';
            if( typeof data.share_user.u_id ){
                uid = data.share_user.u_id;
                p_sname = '热季爆款线路，快来看看吧~';
            }
            if(_uinfo && _uinfo.m_org_id && _uinfo.u_id){
                userinfo_orgid = _uinfo.m_org_id;
                if(_uinfo.org_type == '管理公司' || _uinfo.org_type == '供应商'){
                    p_sname = '热季爆款线路，快来看看吧~';
                }else{
                    p_sname = _uinfo.org_name + '为你推荐了旅游线路，快来看看吧~';
                    
                }
            }else{
               p_sname = '热季爆款线路，快来看看吧~'; 
            }
            var oid = _.GetUrlParaByHref('oid');

            // new _.WxShare.DetailShare({
            //     share_uid: uid,//分享者用户id
            //     Host: window.location.host,//分享域名
            //     city_code: _this.citycode,//城市code
            //     userinfo_orgid : userinfo_orgid,
            //     products:{
            //         p_id: data.p_id,//产品id
            //         p_name: data.p_name,//产口名称
            //         p_sname: p_sname,//产品简名
            //         p_cover: data.p_cover, //产品封面
            //         org_id: data.org_id,   //产品单位id
            //         business: data.business,//产品单位名称
            //         p_type: data.p_type, //产品类型 非必填
            //         node_id: _.GetUrlPara('node_id'), //传播id（非必填）
            //         nodePid: _.GetUrlPara('node_pid'),
            //         oid : oid
            //     }
            // });
            _.WxShare.CommonShare({
                title : p_sname,
                desc : data.p_name,
                link : window.location.href + '&openId=' + window.sessionStorage.getItem('openid'),
                pic : data.p_cover
            });
        // }
        //改变title值
        $(document).attr("title",data.p_type_name);
    }
    Poes(urls){
        if(urls){
            $(".cops").css("display","block");
        }
        $(".cops").on("click",function(){
            Popup.Info('');
            var html = '<div style="height:230px;overflow:hidden;"><img style="width:100%;" src="' + urls + '" alt=""><p style="text-align:center;">长按二维码关注</p></div>'
            $("#popup-info").append(html);
            $("#popup-mask").css('background-color','rgba(0,0,0,0.5)');
 
            $("#popup #popup-mask").on("click",function(){
                Popup.PopupRemove();
            })
        })
        
    }

	Banner(){
		new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',   //索引class
            paginationClickable: true,  //索引小圆点是否可点
            loop : true,    //loop模式,你能够无限滑动滑块，到最后一个之后会跳转回第一个
            autoplay : 3000 //自动播放
        });

        let w = $('#wrap').width();
        $('.banner').height(w*0.52);
	}

    Event(){
        let _this = this;
        //仅浏览 不可操作
        var from = window.sessionStorage.getItem('from');
        if(from == 'preview'){
            $(".submit").hide();
           
        }else{
            $(".submit").show();
        };
        $(".appoin").on("click",function(){
             _.Popup.Tip('无权购买此产品！');
             return false;
        })
        $(".alerts").on("click",function(){
            _.Popup.Tip('该产品暂无班期');
        })
        $('.date-list li.no-price').on('click',function(){
            _.Popup.Tip('该日期暂无票价');
        })
        //出发城市
        $('.city-check').on('click',function(){
            var numb = $(".city_num").text();
            numb = parseInt(numb);
            if(numb == 0){
                _.Popup.Tip('暂无更多城市！');
                return false;
            }else{
               $('.city-list').addClass('in'); 
            } 
        });
        $('.city-list').on('click',function(){
            $(this).removeClass('in');
        })
        //活动
        $('.promotion-check').on('click',function(){
            $('.activi').addClass('in');
        });
        $('.bg_ing,.dei').on('click',function(){
            $('.stroke_detail').removeClass('in');
            $(".dei").hide();
        })
        //查看详情
        $('.details-more,.deil').on('click',function(){
            $('.stroke_detail').addClass('in');
            $(".dei").show();
        });
        if(_uinfo && _uinfo.u_stype){
            if(_uinfo.u_stype == '3'){
                $(".icons .back").hide();
            }
        }
        //查看同行价
        $(".eye").on("click",function(){
            $(this).toggleClass('eyes');
            // $('.priced').toggleClass('dis_no');
            // $(".mation").toggleClass("dise");
            // $(".detail_play").toggleClass("die");
            if( $(this).hasClass('eyes') ){
                window.localStorage.setItem('eye',1);
                $('.return').show();
            }else{
                window.localStorage.setItem('eye',0);
                $('.return').hide();
            }
        });
        $('.city-list li').off().on('click',function(e){
            e.stopPropagation();
            //判断是否为已选城市
            if($(this).hasClass("colors")){
                return false;
            }
            var code = $(this).attr('code'),
            name = $(this).text();
            $('.city-active').text(name).attr('code',code);
            $('.city-list').removeClass('in');
            var city_code = $('.city-active').attr('code'),
                city_name = $('.city-active').text();
            $(this).addClass('colors').siblings().removeClass('colors');
            _.Cookie.Add('city_code',city_code);
            _.Cookie.Add('city_name',city_name);
            _this.Render(city_code);   
        });
        //天数锚点动画
        $('.attrli li a').on("click",function(){
            $("html, body").animate({
                scrollTop: $($(this).attr("href")).offset().top + (-50) + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
            return false;
        })
        // 未登录时眼睛消失
        if(_uinfo && _uinfo.u_id){
            // $(".eye").css("display","none");
        }else{
            // $(".cope").css("display","block");
            // $(".eye").css("display","none");
        }
        // if(share_user && share_user.u_mobile){
        //     $(".tel").attr("href","tel:" + share_user.u_mobile);
        // }else{
        //     $("#wrap .submit .submit-contact").css("display","none");
        // }
        //过滤行程没有图片
        $(".img-list").each(function(){
            var len = $(this).find(".i-detail img").length;
            if(len < 1){
                $(this).remove();
            }
        })
        if(share_user && share_user.u_id){
            $(".date-list ul li a").each(function(){
                var hre = $(this).attr("href");
                var hr = hre + '&u_id=' +share_user.u_id
                $(this).attr("href",hr);
            })
            var hrefs = $(".submit-btn").attr("href");
            $(".submit-btn").attr("href",hrefs + "&u_id=" + share_user.u_id)
        }
    }
}

UserInfo.Ready(function(){
    new Index();
})