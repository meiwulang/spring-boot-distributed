import '../../less/order_list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
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
		        // _this.Tab();
		        _this.Render(1);
				_this.Scrollload();
			}) 
			var host = window.location.host;
            var acard = '';
            var openid = window.sessionStorage.getItem('openid');
	        var appletId = _.GetUrlPara('appletId');
		    if(appletId && appletId != undefined){
		      window.sessionStorage.setItem('appletId',appletId);
		    }
		})
	}

 	Render(currpage){
		$('body').addClass('scrolling');
 		_.Ajax({
 			url : '/orderRefundRecord/getRefundRecord/'+_.GetUrlPara('id')+"/0",
 			type : 'get',
 			success : function(res) {
 				if (res.code == 0) {
					let html = template('tpl-lists',res);
					console.log("res",res);
					$(".loading").remove();
					$('.recordlist').append(html);
                    // _this.Dele();
                    $('body').removeClass('scrolling');
 				}
 			}
 		})
 	}
 	Event(){
 		let _this = this;
 		let order_type = _.GetUrlPara('order_type');

 		$('.t-bar a.left').on('click',function() {
	 		// window.history.back();
	 		window.location.href = 'order_list.html';
	 		sessionStorage.removeItem("typ");
	 	});
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
						$(".recordlist").append('<div class="loading">加载中...</div>');
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
