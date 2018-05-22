import '../../less/order_endorse.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
		_this.mation = 0;
		_this.images = {
			localId: [],
			serverId: []
		};
        _.GetCityCode(function(citycode){
			_this.citycode = citycode;
            _this.Render();
        })
	}

	Tab(){
		let _this = this;
		$('.infor-bar ul li').on('click',function() {
			var index = $(this).index();
			$(".lists").hide();
			$(".lists").eq(index).show();
			$(this).find('a').addClass('active');
			$(this).siblings().find('a').removeClass('active');
		});

		$('.t-bar a.left').on('click',function() {
	 		window.history.back();
	 	})
 	}

 	Render(){
 		let _this = this;
		 var id = _.GetUrlPara('id');
 		_.Ajax({
			url : '/orderRefundRecord/getOtherRefundTypeForOrder/'+id,
 			type : 'get',
 			success : function(res) {
 				if (res.code == 0) {
					getTouristInfo(res.body);
 				}
 			}
		 })
		 
		// 游客信息
		function getTouristInfo(flag){
			_.Ajax({
				url : '/orderRefundRecord/getTouristListForRefund/'+_.GetUrlPara('id'),
				 type : 'get',
				 success : function(res) {
					 if (res.code == 0) {
						res.RefundType=flag;
						let html = template('tpl-order',res);
						$("#wrap").html(html);
						_this.Tab();
						_this.Event();
					 }
				 }
			 })
		};
 	}
 	Event(){
 		var _this = this;
 		$('.t-bar a.left').on('click',function() {
			// window.history.back();
			window.location.href = 'order_list.html';
			sessionStorage.removeItem("typ");
		});	
		
		// 全选按钮
		$("#allcheck").on("click",function(){
			let flag=$(this).is(':checked');
			if(flag){
				$("input[name='checkPart']").prop("checked",true);
			}else{
				$("input[name='checkPart']").prop("checked",false);
			}
		})
		$("input[name='checkPart']").on("click",function(){
			let allcheck=$("input[name='checkPart']").length;
			let checklist=$("input[name='checkPart']:checked").length;
			if(allcheck==checklist){
				$("#allcheck").prop("checked",true);
			}else{
				$("#allcheck").prop("checked",false);
			}
		})
	
		// 提交按钮
		$(".submit .btn").on("click",function(){
			window.location.href = 'order_endorseDate.html?id='+_.GetUrlPara('id');;
			return;
			
			let text=$(".active").html();
			let vallist=[];
			$("input[name='checkPart']:checked").each(function(){
				vallist.push($(this).val())
			})
			let refundMoney=null;
			let remark="";
			// 退票是0其他是1
			let type=text=="游客退票"?0:1
			if(text=="游客退票"){
				remark=$("#remark_1").val()
			}else{
				remark=$("#remark_2").val();
				refundMoney=$("input[type='number']").val();				
				vallist=[];
			}	
			if(!remark){
				_.Popup.Tip("请填写退款说明");
				return;
			}		
			_.Ajax({
				url : '/orderRefundRecord/applyOrderRefund',
				type : 'post',
				data : {
					"applyRefundAmount": refundMoney,
					"orderId": _.GetUrlPara('id'),
					"refundExplain": remark,
					"touristIds": vallist,
					"type":type
				},
				success : function(res) {
					if (res.code == 0) {
						window.location.href = 'order_refundRecord.html?id='+_.GetUrlPara('id');;
					}else{
						_.Popup.Tip(res.message);
					}
				}
			 })
	   	})			

	 }
	 

}
UserInfo.Ready(function(){
	new Index();
})


