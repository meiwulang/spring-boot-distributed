import '../../less/order_list_buyer.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';

class Index{
	constructor(){
	    // if(!(_uinfo && _uinfo.u_id)){
	    //         window.location.href = 'login.html?ty=detail';
	    // }else{
	    // 	$("#wrap").css("display","");
	    // }
		var _this = this;
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
			'page' : currpage//当前第几页
		}
		$('body').addClass('scrolling');
 		_.Ajax({
 			// url : '/h5/shop/get_order_list',
 			url : '/front/order/m/queryOrderList',
 			type : 'post',
 			data : data,
 			success : function(res) {
 				if (res.code == 200) {
 					let data = res.data;
					_this.pages.total=res.total;
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
}
new Index();


