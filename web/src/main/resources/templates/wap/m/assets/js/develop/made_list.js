import '../../less/made_list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';

class Index{
	
	constructor(){
		console.log(123)
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
		        _this.Tab();
		        _this.Render(1);
			}) 
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

		let data = {
			'clientType' : '0',
			'status' : status,
			'currPage' : currpage,
			'pageSize' : 999
		}
		$('body').addClass('scrolling');
 		_.Ajax({
 			url : '/require/queryRequireList',
 			type : 'post',
 			data : data,
 			success : function(res) {
 				if (res.code == 200) {
 					let data = res.data;
 					let list = data.list;
					_this.pages.total=data.total;
					data['status'] = status;
 					let html = template('tpl-lists',data);
					$(".loading").remove();
					$('.lists').append(html);
					new Swiper('.swiper-container', {
                        slidesPerView: 'auto',
                        resistanceRatio: .00000000000001,
                        slideToClickedSlide: true
                    })
                    // _this.Dele();
                    $('body').removeClass('scrolling');

 				}
 			}

 		})
 	}
}
new Index();


