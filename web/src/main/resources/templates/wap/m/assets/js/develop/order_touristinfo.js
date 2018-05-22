import '../../less/order_touristinfo.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _this.pages={
            total:0,
            count:1
        } 
        _this.orderId=null;       
        _.GetCityCode(function(citycode){
            _this.citycode = citycode;
            _this.Render(1);
            _this.Scrollload();
        })
	}

 	Render(currpage){
 		let _this = this;
 		var no = _.GetUrlPara('n');
         var order_type = _.GetUrlPara('order_type');
         $('body').addClass('scrolling');
        //  获取编辑游客信息
 		_.Ajax({
			url : '/Order/getTourists',
 			data : {
                orderId : _.GetUrlPara('otid'),
                pageNo : currpage,
                pageSize: 10
 			},
 			success : function(res) {
 				if (res.code == 0) {
                    let data=res.body.body
                    let html = template('tpl-order',data);
                    _this.pages.total=data.totalNum;
                    _this.orderId=data.resultList[0].otOrderId;
                    // $('#wrap').html(html);
					$(".loading").remove();
					$('.tourist-info-con').append(html);
                    $('body').removeClass('scrolling');                    
                    _this.Event();
 				}
 			}

 		})
 	}

 	Event(statu,credit,credit_type,number,settle_real,confirm_type,o_id){
 		var _this = this;
 		var order_type = _.GetUrlPara('order_type');
 		if (order_type == 'seller') {
 			$('.buyer-infor').show();
 			$('.business-infor').hide();
 		} else {
 			$('.buyer-infor').hide();
 			$('.business-infor').show();
         }
         
         $('.t-bar a.left').on('click',function() {
            window.history.back();
        })  
        //用户信息保存
        $(".ul-info .saveBtn").on("click",function(){
			let name = $.trim($(this).parent().find('input.name').val()),
                tel = $.trim($(this).parent().find('input.tel').val()),
                card_type = $.trim($(this).parent().find('select.card_type').val()),
                card_no = $.trim($(this).parent().find('input.card_no').val()),
                uid=$(this).parent().attr('uid');
            if( !name ){
                _.Popup.Tip('请填写姓名');
                return false;
            }
            
            if( !_.RegEx.Tel(tel) ){
                _.Popup.Tip('请填写正确的手机号码');
                return false;
            }  
			if( card_type == 0 && card_no ){
	            var rst = _.RegEx.CardChk(card_no);
	            //验证失败
	            if (rst.start == 0) {
	            	_.Popup.Tip(rst.info);
	                return false;
	            }
	        }
	        if( card_type == 1 && card_no ){
	        	if(!_.RegEx.Passport(card_no)){
	        		_.Popup.Tip("请填写正确护照信息！");
	        		return false;
	        	}
            }  
            _.Ajax({
                url : '/Order/saveTourist',
                 type : 'post',
                 data : {
                    otName : name,
                    otPhone : tel,
                    otLicenceType: card_type,
                    otLincese: card_no,
                    otOrderId:_this.orderId,
                    id:uid
                 },
                 success : function(res) {
                    if (res.code == 0) {
                        _.Popup.Tip("游客信息编辑成功！");
                      } else {
                        _.Popup.Tip("游客信息编辑失败！");
                      }                    
                 }
    
             })            
            
        })       
	
     }
	//  下拉加载数据列表
    Scrollload(){
        let _this = this;
        console.log("下拉加载")
		$(window).scroll(function () {
			let scrollTop = $(this).scrollTop();
			let scrollHeight = $(document).height();
			let windowHeight = $(this).height();
			if (scrollTop + windowHeight == scrollHeight) {
				// 获取page数,并判断是否是最后一页	
				if(_this.pages.total > (_this.pages.count * 10)){
					if( !$('body').hasClass('scrolling') ){
						_this.Render(++_this.pages.count);
						$(".tourist-info-con").append('<div class="loading">加载中...</div>');
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


