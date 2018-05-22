import '../../less/order_list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
	    // if(!(_uinfo && _uinfo.u_id)){
	    //         window.location.href = 'login.html?ty=detail';
	    // }else{
	    // 	$("#wrap").css("display","");
	    // }
		var _this = this;
		_.CheckLogin(function(){
			$("#wrap").show();
			// 用于计算页数
			_this.pages={
				total:0,
				count:1
			}
		    _.GetCityCode(function(citycode){
		        _this.citycode = citycode;
		        _this.Event();
		        _this.Tab();
		        _this.Render(1);
				_this.Scrollload();
			}) 
			var host = window.location.host;
            var acard = '';
            var openid = window.sessionStorage.getItem('openid');
            switch(host){
                case 'b2b.fingercrm.cn':
                    acard = 'http://card.fingercrm.cn/order-list?openId='+openid;
					break;
				case 'b2b.pro.fingercrm.cn':
                    acard = 'http://card.fingercrm.cn/order-list?openId='+openid;
                    break;					
                default:
                    acard = 'http://card.test.fingercrm.cn/order-list?openId='+openid;
                    break;
            }
            $(".main .links").on("click",function(){
            	window.location.href = acard;
            });
            if(_uinfo && _uinfo.u_stype){
            	if(window.__wxjs_environment!=="miniprogram" && _uinfo.u_stype != '3'){
            		$(".links").show();
            	}
            }
            if(_uinfo && _uinfo.u_stype){
	            if(window.__wxjs_environment==="miniprogram" || _uinfo.u_stype == '3'){
	                $(".t-bar .left").hide();
	            }
	        }
	        var appletId = _.GetUrlPara('appletId');
		    if(appletId && appletId != undefined){
		      window.sessionStorage.setItem('appletId',appletId);
		    }
		})
	}

	Tab(){
		let _this = this;
		var ty = '';
		$('.infor-bar ul li').off().on('click',function() {
			sessionStorage.setItem("typ",$(this).attr("typ"));
			sessionStorage.setItem("typeNum",$(this).attr("typeNum"));
			$(this).find('a').addClass('active');
			$(this).siblings().find('a').removeClass('active');
			$('.lists').html("");
			$(window).scrollTop(0);
			_this.pages.count=1;

			_this.Render(_this.pages.count);	
		})
 	}

 	Render(currpage){
 		var typeNum = sessionStorage.getItem("typeNum");
 		if(typeNum){
 			$(".infor-bar ul li").each(function(){
 				if(typeNum == $(this).attr("typeNum")){
 					$(".infor-bar ul li a").removeClass('active');
 					$(this).find("a").addClass('active');
 				}
 			})
 		}
 		let _this = this;
 		let status = $('.infor-bar ul li a.active').attr('typeNum');
 		let order_type = _.GetUrlPara('order_type');
		if (status == '全部') {
			status = '';
		}
 		let key = $.trim($('.search input').val());
 		if( !key || key == 'undefined' ){
			key = '';
		}else{
			$('.search input').val(key);
			$('.search .search-placeholder').hide();
			$(".sear").css("display","block");
		}

		order_type = 'buyer';

		let data = {
			'order_type' : order_type,//订单管理类型：seller(卖家订单),buyer(买家订单) 此为买家
			'status' : typeNum,//订单状态（全部、待确认、待付款、已付款、退票）
			'key' : key,//搜索关键字(订单号、手机号、游客姓名、商家名称、产品名称、出团日期、预订日期)
			'limit' : 20,//每页显示数
			'page' : currpage,//当前第几页
			'appletId':window.sessionStorage.getItem('appletId')
		}
		$('body').addClass('scrolling');
 		_.Ajax({
 			// url : '/h5/shop/get_order_list',
 			url : '/front/order/m/queryOrderList',
 			type : 'post',
 			data : data,
 			success : function(res) {
 				if (res.code == 200) {
 					let data = res.data.pageInfo;
					_this.pages.total=res.data.pageInfo.total;
 					data['order_type'] = order_type;
 					let html = template('tpl-lists',data);
					$(".loading").remove();
					$('.lists').append(html);
					new Swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        resistanceRatio: .00000000000001,
                        slideToClickedSlide: true
                    })
                    _this.Dele();
                    $('body').removeClass('scrolling');

 				}
 			}

 		})
 	}
 	Dele(){
 		var _this = this;
 		$(".delete").off().on("click",function(){
 			let num = $(this).parents("li").attr("num"),
				sta = $(this).parents("li").attr("status"),
				prod = $(this).parents("li").attr("prod"),
				orderid = $(this).parents("li").attr("ids"),
				org_name = $(this).parents("li").attr("org_name"),
				real = $(this).parents("li").attr("real");
 			
 			var textss = '0';
 			var html = '<div id="pageinfo-pop" class="pop_bg"><h3>取消订单</h3><div class="info">';
 				html += '<input readonly="readonly" class="bg_c" value="' + num +'" type="text">';
 				html += '<label>订单编号：</label>';

 				html += '<input readonly="readonly" class="bg_c input_wid" value="' + real + '" type="text">';
 				html += '<label class="pres">金额：</label>';

 				html += '<input readonly="readonly" class="bg_c input_wid" value="' + sta + '" type="text">';
 				html += '<label>订单状态：</label>';

 				html += '<input readonly="readonly" class="bg_c" value="' + org_name + '" type="text">';
 				html += '<label>买家名称：</label>';

 				html += '<input readonly="readonly" class="bg_c" value="' + prod + '" type="text">';
 				html += '<label>产品名称：</label>';

 				html += '<textarea placeholder="请输入取消原因，小于300字" class="tions"></textarea>';
 				html += '<label>取消原因：</label>';

 				// html += '<input class="wy_mon" placeholder="请输入正数" type="text">';
 				// html += '<label>违约金：</label>';
 				// html += '<div class="spa"></div>';
 				html += '</div><div class="btn clearfix"><a class="cancel" href="javascript:;">取消</a>';
 				html += '<a class="submit" href="javascript:;">提交</a></div></div>';
 			// $("#popup-info").append(html);
 			var formPop = Popup.Info(html);
 			
	        if(sta != '已全款'){
	        	$("#popup-info .pop_bg .wy_mon").attr("readonly","readonly");
	        	$("#popup-info .pop_bg .wy_mon").css("background","#f4f8f5");
	        }
 			$(".pop_bg .cancel").on("click",function(){
 				 Popup.PopupRemove();
 			})
 			$(".spa").on("click",function(){
 				$("#popup-info .pop_bg ul").toggleClass("spas");
 			})
 			$(".pop_bg .submit").off().on("click",function(){
 				var tions = $(".tions").val();
 				if(tions.length > 300){
 					Popup.Tip('取消原因不能超过300字！');
 				}else{
 					formPop.hide();
 					_this.Deles(num,sta,real,formPop,orderid);
 				}
 			})
 			$(".wy_mon").on("input propertychange",function(){
 				var tes = $(".wy_mon").val();
 				if(tes < 0){
 					$(".wy_mon").val('0');
 				}else{
 					tes = tes.replace(/[^0-9]/ig,"");
 				$(".wy_mon").val(tes);
 				}
 				
 			})
 		})
 		$(".no_delete").on("click",function(){
 			Popup.Tip("你没有操作【取消订单】权限 订单确认后只能供应商可以操作取消！");
 		})
 		$(".deletes").on("click",function(){
 			Popup.Tip("当前订单”计划单已生成“不可取消订单 如需取消请从计划单中移除相应订单！");
		 })
		//  跳转到退款申请页
		$(".refund").on("click",function(){
			let orderId=$(this).attr("oId");
			window.location.href = 'order_refundApply.html?id='+orderId;
		});
		// 跳转到退款记录页
		$(".refundRecord").off().on("click",function(e){
			e.stopPropagation();
			e.preventDefault();			
			let orderId=$(this).attr("oId");
			window.location.href = 'order_refundRecord.html?id='+orderId;
		});	
		// 改签按钮(临时)
		$(".endorse").off().on("click",function(e){
			e.stopPropagation();
			e.preventDefault();			
			let orderId=$(this).attr("oId");
			window.location.href = 'order_endorse.html?id='+orderId;
		});				

 	}
 	Deles(num,sta,real,formPop,orderid){
 		var _this = this;
		let order_type = _.GetUrlPara('order_type');
		let penalty_remarks = $("#popup-info .pop_bg .tions").val();
		let money = $("#popup-info .pop_bg .wy_mon").val();
		let pop = _.Popup.Confirm('是否确认取消此订单！',function(){
	        _.Ajax({
	            url : '/Order/cancel',
	            type : 'post',
	            data : {
	                oOrderNo : num, //订单编号
	                orderId : orderid,//订单id
	                remark : penalty_remarks,//取消备注
	                saler : false
	            },
	            success : function(res){
	            	if(res.success == true){
	            		_.Popup.PopupRemove();
						pop.remove();
		            	_.Popup.Tip(res.message);
		            	$('.lists').html("");
		            	_this.pages.count=1;
						_this.Render(_this.pages.count);
	            	}else{
	            		formPop.show();
        				pop.remove();
	            	}
	            }
	        })
	    },function(){
        	console.log(formPop);
        	formPop.show();
        	pop.remove();
        }); 
 	}
 	Event(){
 		let _this = this;
 		let order_type = _.GetUrlPara('order_type');
 		if (order_type) {
 			if (order_type == 'buyer') {
	 			$('.buyer').show();
	 			$('.list-name').html('买家订单')
	 		} else{
	 			
	 			$('.seller').show();
	 			$('.list-name').html('卖家订单')
	 		}
 		} else{
 			$('.list-name').html('订单列表');
 		}

 		$('.t-bar a.left').on('click',function() {
	 		// window.history.back();
	 		window.location.href = 'index.html';
	 		sessionStorage.removeItem("typ");
	 	});
	 	$(".t-bar .right").on("click",function(){
	 		window.location.href = 'order_search.html?order_type=' + order_type;
	 	})
	 	var nums = 0;
	 	$(".infor-bar ul li").each(function(){
            nums += $(this).width();
        })
        $(".infor-bar ul").width(nums);
 	}
	//  下拉加载数据列表
	 Scrollload(){
		let _this = this;
		console.log("order_list下拉")
		$(window).scroll(function () {
			let scrollTop = $(this).scrollTop();
			let scrollHeight = $(document).height();
			let windowHeight = $(this).height();
			if (scrollTop + windowHeight == scrollHeight) {
				// 获取page数,并判断是否是最后一页	
				if(_this.pages.total > (_this.pages.count * 20)){
					if( !$('body').hasClass('scrolling') ){
						_this.Render(++_this.pages.count);
						$(".lists").append('<div class="loading">加载中...</div>');
					}	
				}else{
					$(".loading").remove();
				}				
			}
		});		 
	 }	
}
UserInfo.Ready(function(){
	new Index();
})


