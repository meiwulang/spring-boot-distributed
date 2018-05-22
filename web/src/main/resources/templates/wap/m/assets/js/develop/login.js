import '../../less/login.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		$(".gui").removeClass("guides");
		let $s1 = $('.phon'),
			$s2 = $('.email');
		$s1.hide();
		$s2.hide();

		if(_uinfo && _uinfo.u_id){
			window.location.href = "index.html";
		}
		this.Event();
	}
	Event(){
		let _this = this;
		let $s1 = $('.phon'),
			$s2 = $('.email');
		$('.login_phon').on('click',function(){
			
			if( $(this).hasClass('s1') ){
				$s1.hide();
				$s2.show();
				$(".gui").removeClass("guides");
				$(".login_but").html("登&#x3000;录");
			}

			if( $(this).hasClass('s2') ){
				$s2.hide();
				$s1.show();
				$(".gui").removeClass("guides");
				$(".login_but").html("登&#x3000;录");
			}
		})

		$('.login_but').on('click',function(){
			if( $(this).hasClass('s1') ){
				_this.S1_Submit();
			}

			if( $(this).hasClass('s2') ){
				_this.S2_Submit();
			}
		})

		$s2.find('.ident').on('click',function(){
			if( $(this).hasClass('disable') ){
				return false;
			}
			_this.Code();
		})
		$(".phon .bind").on("click",function(){
			$(this).find("label").toggleClass("labels")
		})
		$(".email .bind").on("click",function(){
			$(this).find("label").toggleClass("labels")
		})
		//导游登录
		$(".gui").on("click",function(){
			$(this).addClass("guides");
			if($(".gui").hasClass("guides")){
				$s1.hide();
				$s2.show();
				$(".login_but").html("导 游 登 录");
			}
		})
		if(_.GetUrlPara('guide') == 'guide'){
			$(".gui").addClass("guides");
			$s1.hide();
			$s2.show();
			$(".login_but").html("导 游 登 录");
		}else{
			$s1.show();
			$s2.hide();
			$(".gui").removeClass("guides");
			$(".login_but").html("登&#x3000;录");
		}
	}

	Code(){
		let $s2 = $('.email');
		let phone = $.trim($s2.find('input.username').val());

		if( !_.RegEx.Tel(phone) ){
			_.Popup.Tip('请输入手机号');
			return false;
		}
		$s2.find('.ident').addClass('disable');
		if($(".gui").hasClass("guides")){
			var guide = '1';
		}else{
			var guide = '0';
		}
		_.Ajax({
			url : '/front/b2b/user/sendcheckcode',
			type : 'get',
			data : {
				phone : phone,
				guide : guide
			},
			success : function(res){
				if( res.code == 200 ){
					_.TimeDown(60,function(t){
						$s2.find('.ident').text(t+'秒');
					},function(){
						$s2.find('.ident').text('获取验证码');
						$s2.find('.ident').removeClass('disable');
					})
				}
			}
		})
	}

	S1_Submit(){
		let $s1 = $('.phon');
		let uname = $.trim($s1.find('input.username').val()),
			upass = $.trim($s1.find('input.password').val());

		if( !uname ){
			_.Popup.Tip('请输入正确的用户名');
			return false;
		}

		if( !_.RegEx.Password(upass) ){
			_.Popup.Tip('请输入正确的密码');
			return false;
		}
		var bind_wechat = '';
		if($(".phon .bind label").hasClass("labels")){
			bind_wechat = '1';
		}else{
			bind_wechat = '0';
		}
		_.Ajax({
			url : '/user/mobileLogin',
			type : 'post',
			data : {
				"uname": uname,//必填
				"upass": upass,//必填
				"bind_wechat" : bind_wechat
			},
			success : function(res){
				if( res.code == 200 ){
					_.Cookie.Add('city_code',res.data.org_city_code);
					_.Cookie.Add('city_name',res.data.org_city);
					if(_.GetUrlPara('ty') == 'detail'){
						window.location.href = $("#url_referer").val();
					}else{
						window.location.href = "index.html";
					}
					
				}
			}
		})
	}

	S2_Submit(){
		let $s2 = $('.email');
		let url = '';
		let u_mobile = $.trim($s2.find('input.username').val()),
			u_code = $.trim($s2.find('input.ncode').val());

		if( !_.RegEx.Tel(u_mobile) ){
			_.Popup.Tip('请输入正确的手机号码');
			return false;
		}

		if( !u_code ){
			_.Popup.Tip('请输入验证码');
			return false;
		}
		var bind_wechat = '';
		if($(".email .bind label").hasClass("labels")){
			bind_wechat = '1';
		}else{
			bind_wechat = '0';
		}
		if($(".gui").hasClass("guides")){
			url = '/b2b/User/guide_login';
		}else{
			url = '/user/mobileLogin';
		}
		_.Ajax({
			url : url,
			type : 'post',
			data : {
				uname : u_mobile,
				u_code : u_code,
				bind_wechat : bind_wechat
			},
			success : function(res){
				if( res.code == 200 ){
					if($(".gui").hasClass("guides")){
						window.location.href = "guide_list.html";
						return false;
					}else{
						_.Cookie.Add('city_code',res.data.org_city_code);
						_.Cookie.Add('city_name',res.data.org_city);
					}
					if(_.GetUrlPara('ty') == 'detail'){
						window.location.href = $("#url_referer").val();
					}else{
						window.location.href = "index.html";
					}
					
				}
			}
		})
	}
}

UserInfo.Ready(function(){
	new Index();
})