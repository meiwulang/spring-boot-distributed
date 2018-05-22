import '../../less/pay.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Bala();
	}

	Bala(){
		let _this = this;
		var no = _.GetUrlPara('n');
		if(window.__wxjs_environment!=="miniprogram"){
			$(".payInput").show();						
		}else{
			$(".payInput").hide();
		}	
		_.Ajax({
            url : '/front/order/m/confirmOrderInfo/',
            type : 'get',
            data : {
                no : no
            },
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-bala',res.data);
                    $('#wrap').html(html);
                    var contract_template_num = "";
                    if(res.data.payment_info.contract_template_num){
                    	var contract_template_num = res.data.payment_info.contract_template_num;
                    }
					_this.Event(contract_template_num,res.data);
					console.log(res.data,'html')
                }
            }
        })
	}

	GetQrcode(){
		let _this = this;
		var no = _.GetUrlPara('n');
		var appletId = window.sessionStorage.getItem('appletId');
	      if(!appletId){
	        appletId = '';
	      }
		_.Ajax({
        	url : '/wechat/doUnifiedOrder',
        	type : 'get',
        	data : {
        		// appletId : appletId,
        		outTradeNo : no,
				type : 2,
				paymentAmount: $('.payInput input').val()
        	},
        	success : function(res){
        		if( res.code == 200 ){
        			$('.wx-qrcode img').attr('src',res.data.url);
        			$('.main').attr('newOutTradeNo',res.data.newOutTradeNo);
        		}
        	}
        })
	}

	Event(contract_template_num,html){
		var contract_template_num = contract_template_num;
		var html = html;
		let _this = this;
		$(".pay_list .choice").on("click",function(){
			console.log(contract_template_num);
			$('.pay_list .choice').addClass("choice_bor");
			$('.pay_list .choice').removeClass("choice_yes");
			$(this).toggleClass('choice_yes');
			$(this).toggleClass('choice_bor');

			if( $(".listss .choice").hasClass("choice_yes") ){
				$('.wx-qrcode').show();
				$('.payInput').show();
				if(contract_template_num > 0){
					$('.buttons').text('签署合同');
				}else{
					$('.buttons').text('支付完成');
				}
				if( html.payment_info.total_fee > 0 && html.payment_info.o_source == 4 && html.payment_info.o_status == 3 ){
					var input = $(".payInput input").val();
					var reg = /^\d+(?:\.\d{1,2})?$/
					if( !reg.test(input) || input == null){
						$('.wx-qrcode').hide();
						$('.pay_list .choice').addClass("choice_bor");
						$('.pay_list .choice').removeClass("choice_yes");
						_.Popup.Tip('请输入大于0的整数数字或者保留两位小数');
						$('.payInput').show();
					}else{
						_this.GetQrcode();
					}
				}else{
					_this.GetQrcode();
				}
			}else if( $(".listsss .choice").hasClass("choice_yes") ){
				$('.payInput').show();
				$('.wx-qrcode').hide();
				$('.buttons').text('确认支付');
			}else{
				$('.payInput').hide();
				$('.wx-qrcode').hide();
				$('.buttons').text('上传凭证');
			}
		});
		$(".buttons").on("click",function(){
			var no = _.GetUrlPara('n');
			if($(".listss .choice").hasClass("choice_yes")){
				window.location.href = 'order_success.html?n=' + no;
			}
			else if($(".listOff .choice").hasClass("choice_yes")){
				_.Popup.Tip('请前往PC端上传凭证！');
			}
			else if($(".listsss .choice").hasClass("choice_yes")){
				console.log(html.payment_info.total_fee,'html')
				if( html.payment_info.total_fee > 0 && html.payment_info.o_source == 4 && html.payment_info.o_status == 3 ){
					var input = $(".payInput input").val();
					var reg = /^\d+(?:\.\d{1,2})?$/
					if( !reg.test(input) ){
						_.Popup.Tip('请输入大于0的整数数字或者保留两位小数');
					}else{
						console.log("输入正确");
						var openId = window.sessionStorage.getItem('openid');
						var appletId = window.sessionStorage.getItem('appletId');
						if( !appletId ){
							appletId = '';
						}
						_.Ajax({
							url : '/wechat/doUnifiedOrder',
							type : 'get',
							data : {
								appletId : appletId,
								outTradeNo : no,
								type : 1,
								newOutTradeNo : $('.main').attr('newOutTradeNo'),
								// openId : $('.main').attr('openid')
								openId : openId,
								paymentAmount: $('.payInput input').val()
							},
							success : function(res){
								if( res.code == 200 ){
									if( res.message == '礼品卡抵扣成功！' ){
										window.location.href = 'order_success.html?n='+no;
									}else{
										// 判断是否为小程序
										if(window.__wxjs_environment==="miniprogram"){
											res.data.openId=openId;
											res.data.success_url=_.Api()+'/wap/m/order_success.html?n='+_.GetUrlPara('n');
											//alert("location:"+window.location.href)
											//alert("res.data.success_url"+res.data.success_url)
											window.wx.miniProgram.redirectTo({
												url: '/pages/pay/pay?key='+window.btoa(JSON.stringify(res.data))
												// url: '/pages/pay/pay'
											})
										}else{
											_this.WxPay(res.data);
										}
									}
								}
							}
						})
					};
				}else{
					var openId = window.sessionStorage.getItem('openid');
					var appletId = window.sessionStorage.getItem('appletId');
					if( !appletId ){
						appletId = '';
					}
					_.Ajax({
						url : '/wechat/doUnifiedOrder',
						type : 'get',
						data : {
							appletId : appletId,
							outTradeNo : no,
							type : 1,
							newOutTradeNo : $('.main').attr('newOutTradeNo'),
							// openId : $('.main').attr('openid')
							openId : openId,
							paymentAmount: $('.payInput input').val()
						},
						success : function(res){
							if( res.code == 200 ){
								if( res.message == '礼品卡抵扣成功！' ){
									window.location.href = 'order_success.html?n='+no;
								}else{
									// 判断是否为小程序
									if(window.__wxjs_environment==="miniprogram"){
										res.data.openId=openId;
										res.data.success_url=_.Api()+'/wap/m/order_success.html?n='+_.GetUrlPara('n');
										//alert("location:"+window.location.href)
										//alert("res.data.success_url"+res.data.success_url)
										window.wx.miniProgram.redirectTo({
											url: '/pages/pay/pay?key='+window.btoa(JSON.stringify(res.data))
											// url: '/pages/pay/pay'
										})
									}else{
										_this.WxPay(res.data);
									}
								}
							}
						}
					})
				}
			}
			else{
				if(html.payment_info.total_fee > 0 && html.payment_info.o_pay_method == 2 && html.payment_info.o_status == 1)
				_.Popup.Tip('凭证正在确认中，无需再次支付！');
			}
		})
	}

	WxPay(para){
		var no = _.GetUrlPara('n');
		function onBridgeReady(){
		   WeixinJSBridge.invoke(
		       'getBrandWCPayRequest', para,
		       function(res){     
		           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
		           		window.location.href = 'order_success.html?n='+no;
		           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
		       }
		   ); 
		}
		if (typeof WeixinJSBridge == "undefined"){
		   if( document.addEventListener ){
		       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		   }else if (document.attachEvent){
		       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
		       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		   }
		}else{
		   onBridgeReady();
		}
	}
}

UserInfo.Ready(function(){
	new Index();
})