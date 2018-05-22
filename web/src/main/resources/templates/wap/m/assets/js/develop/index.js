import '../../less/index.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _.CheckLogin(function(){
            _.GetCityCode(function(citycode,cityname){
                _this.citycode = citycode;
                // _this.UserInfo();
                _this.Banner();
                _this.List();
                _this.Event();
                $('.top .city span').text(cityname);
                _.Statistics();

                var host = window.location.host;
                var acard = '';
                var openid = window.sessionStorage.getItem('openid');
                switch(host){
                    case 'b2b.fingercrm.cn':
                        acard = 'http://card.fingercrm.cn?openId='+openid;
                        break;
                    case 'b2b.pro.fingercrm.cn':
                        acard = 'http://card.fingercrm.cn?openId='+openid;
                        break;                        
                    default:
                        acard = 'http://card.test.fingercrm.cn?openId='+openid;
                        break;
                }
                // $('.card-a').attr('href',acard);
                $('.card-a').on('click',function(){
                    window.location.href = acard;
                })
            })
        })
	}

    UserInfo(){
        if( !share_user || JSON.stringify(share_user) == '{}' ){
            $('.user-info').hide();
        }else if(share_user.org_type != '供应商'){
            let html= template('tpl-userinfo',share_user);
            $('.user-info').html(html);
        }
    }

	Banner(){
        let _this = this;
        _.Ajax({
            url : '/front/h5/adver/indexAdver',
            type : 'get',
            data : {
                city_code : _this.citycode
            },
            success : function(res){
                if( res.code == 200 ){
                    let html = template('tpl-banner',res);
                    $('.swiper-wrapper').html(html);

                    new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',   //索引class
                        paginationClickable: true,  //索引小圆点是否可点
                        loop : true,    //loop模式,你能够无限滑动滑块，到最后一个之后会跳转回第一个
                        autoplay : 3000 //自动播放
                    });

                    let w = $('#wrap').width();
                    $('.banner').height(w*0.52);
                    if(!res.data){
                        $('.banner').height(0);
                    }
                }
            }
        })
	}

    List(){
        let _this = this;
        _.Ajax({
            url : '/front/b2b/adver/wap_buslist',
            type : 'get',
            data : {
                city_code : _this.citycode
            },
            success : function(res){
                if( res.code == 200 ){
                    res['city_code'] = _this.citycode;
                    res['openId'] = _.GetUrlPara('openId');
                    let html = template('tpl-list',res);
                    $('.products').html(html);
                    _this.Wx();
                    new _.LazyLoad();

                    // var eyestate = window.localStorage.getItem('eye');
                    // if( eyestate == 0 ){
                    //     $('h2.products-tit').addClass('eye-close');
                    //     $('.products li .return').hide();
                    // }else{
                    //     $('h2.products-tit').removeClass('eye-close');
                    //     $('.products li .return').show();
                    // }
                }
            }
        })
    }

    Event(){
        
        let _this = this;
        $('.cates li').on('click',function(){
            let type = $(this).attr('type');
               window.location.href = 'list.html?type='+type; 
            
        })

        $('h2.products-tit').on('click',function(){
            $(this).toggleClass('eye-close');
            $('.products li .return').toggle();
            if( $(this).hasClass('eye-close') ){
                window.localStorage.setItem('eye',0);
            }else{
                window.localStorage.setItem('eye',1);
            }
        })
         // if(share_user && share_user.u_id){
            // var uu_ids = sessionStorage.getItem('user_ids');
            // if(tt == '0'){
                // window.location.href = "?u_id=" + share_user.u_id;
                // document.location.href + '?u_id=' + share_user.u_id;
                // $.UrlUpdateParams(window.location.href, "u_id", share_user.u_id)
                // window.location.href = window.location.href + '?u_id=' + share_user.u_id;
                // sessionStorage.setItem("user_ids",'1');
                // tt = '1';
            // }
   
        // }
        
    }
    Wx(){
        var host = window.location.host;
        var codes = _.Cookie.Get('city_code');
        var uid = '';
        if(share_user && share_user.u_id){
            uid = share_user.u_id;
        }
        let _this = this;
        var cover = '';//图片
        var p_name = '';
        var p_sname = '';
        var link = document.location.href + '&city_code=' + codes + '&u_id=' + uid;
        cover = 'http://' + host + '../..../img/wx_index.png';
        let userinfo_orgid = '';
            if( JSON.stringify(share_user) != '{}' && share_user.u_id ){
                p_name = '旅游去哪玩？超丰富旅游线路，让你放纵玩！';
                p_sname = '众多有趣玩法，请点击详情查看。';  
            }
            if(_uinfo && _uinfo.m_org_id && _uinfo.u_id){
                userinfo_orgid = _uinfo.m_org_id;
                if(_uinfo.org_type == "管理公司" || _uinfo.org_type == "供应商"){
                    p_name = '旅游去哪玩？超丰富旅游线路，让你放纵玩！';
                    p_sname = '众多有趣玩法，请点击详情查看。';
                }else{
                    p_name = _uinfo.u_realname +'的旅游微店铺,超丰富旅游线路,让你放纵玩！';
                    p_sname = '优惠活动狂欢放送，休闲旅游说走就走，快来逛逛我的微店铺吧~';
                }
            }else{
                p_name = '旅游去哪玩？超丰富旅游线路，让你放纵玩！';
                p_sname = '众多有趣玩法，请点击详情查看。';
            }
            
            _.WxShare.CommonShare({
                title : p_name,
                desc : p_sname,
                link : link,
                pic : cover
            });
    }
}

UserInfo.Ready(function(){
    new Index();
})
