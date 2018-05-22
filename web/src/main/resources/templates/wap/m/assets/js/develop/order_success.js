import '../../less/order_success.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
	}

	Render(){
		console.log(12121212);
		let _this = this;
		var no = _.GetUrlPara('n');
		_.Ajax({
            url : '/front/order/m/queryOrderDetail',
            type : 'post',
            data : {
                no : no
            },
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-list',res.data);
                    $('.main').html(html);
                    _this.Even();
                   
                }
            }
        })
	}
	Even(){
		var _this = this;
		var imgout = _.GetUrlPara('imgout');
		if(imgout == '1'){
			$(".bear").hide();
		}
		if(_uinfo && _uinfo.u_id){
			$(".yes").css("display","block");
		}else{
			$(".nos").css("display","block");
		}
		$(".che_detail").on("click",function(){
			var no = _.GetUrlPara('n');
			window.location.href = 'order_detail.html?n=' + no;
		})

		if($(".bear img").hasClass("zf")){
			$(document).attr("title","支付成功");
		}else{
			$(document).attr("title","预定成功");
		}
		$(".pay_list .choice").on("click",function(){
			$(".succ").addClass("active");
			$('.pay_list .choice').addClass("choice_bor");
			$('.pay_list .choice').removeClass("choice_yes");
			$(this).toggleClass('choice_yes');
			$(this).toggleClass('choice_bor');
		});
		$(".succ").on("click",function(){
			if($(".mation_pact .choice").hasClass("choice_yes")){
				let _this = this;
				var no = _.GetUrlPara('n');
				_.Ajax({
		            url : '/front/order/m/electronicContract/signContract',
		            type : 'post',
		            data : {
		                orderNo : no
		            },
		            success : function(res){
		                if( res.code == 200 ){
		                   window.location.href = 'pact_success.html?n=' + no;
		                }
		            }
		        })
			}
		});
		$(".succ_cal").on("click",function(){
			window.history.back();
		})
		
	}
	
	
}

UserInfo.Ready(function(){
	new Index();
})