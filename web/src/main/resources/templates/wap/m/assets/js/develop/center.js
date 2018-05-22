import '../../less/center.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		let _this = this;
        _.GetCityCode(function(citycode){
            _this.citycode = citycode;
			_this.UserInfo();
		});
	}

	UserInfo(){
		let _this = this;
        let order_type = _.GetUrlPara('order_type');

        if(!(_uinfo && _uinfo.u_id)){
            window.location.href = 'login.html?ty=detail';
        }else{
            if(_uinfo.org_type == '分销商' && order_type == 'seller'){
                window.location.href = 'center.html?order_type=buyer';
            }
            if(_uinfo.org_type != '分销商' && order_type == ''){
                window.location.href = 'center.html?order_type=seller';
            }else if(_uinfo.org_type == '分销商' && order_type == ''){
                window.location.href = 'center.html?order_type=buyer';
            }
            let html= template('tpl-userinfo',_uinfo);
            $('.main').html(html);
              if (order_type == 'seller') {
                    $('.bg').addClass('seller').removeClass('buyer');
                    $('.seller_c').show();
                    $('.buyer_c').hide();
                    $('.go a').attr('href','center.html?order_type=buyer');

                } else if (order_type == 'buyer') {
                    $('.bg').addClass('buyer').removeClass('seller');
                    $('.go a').html('进入卖家中心');
                    $('.go a').attr('href','center.html?order_type=seller');
                    $('.seller_c').hide();
                    $('.buyer_c').show();
                }
                if(share_user){
                    $(".img img").attr("src",share_user.u_face);
                }
        }
            
        if(_uinfo && _uinfo.u_id){
            if(_uinfo.org_type != '供应商' && _uinfo.org_type != '管理公司'){
                $(".detail .go").css("display","none")
            }
            
        }
        // 导游信息
        // if(_guide.g_name && _guide.g_mob){
        //     $(".guidese").css("display","");
        // }
        
        $(".cike").on("click",function(){
            console.log("test");
            Popup.Info('是否确定切换账户！');
            _this.Ht();
        })
    }
    Ht(){
        var html = '<div class="lesse">取消</div><div class="yer">确定</div>';
        $("#popup-info").append(html);
        $(".yer").on("click",function(){
            _.Ajax({
                url : '/user/mobileLogout',
                type : 'post',
                data : {},
            success : function(res){
                        window.location.href = '/wap/m/login.html';
                }
            })
        })
        $(".lesse").on("click",function(){
                Popup.PopupRemove();
        })
    }
}
UserInfo.Ready(function(){
    new Index();
})