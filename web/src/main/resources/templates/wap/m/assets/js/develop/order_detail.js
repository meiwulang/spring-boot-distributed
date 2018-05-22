import '../../less/order_detail.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';
import wx_config from '../common/wechat_config.js';

class Index{
	constructor(){
        let _this = this;
		_this.mation = 0;
		_this.images = {
			localId: [],
			serverId: []
		};
		// _this.chooseImg()
		// wx_config.wxConfig()
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
 		var no = _.GetUrlPara('n');
 		var order_type = _.GetUrlPara('order_type');
 		_.Ajax({
 			// url : '/h5/shop/get_order_detail',
			url : '/front/order/m/queryOrderDetail',
 			type : 'post',
 			data : {
 				no : no,
 				order_type : order_type
 			},
 			success : function(res) {
 				if (res.code == 200) {
 					let data = res.data;
 					let statu = res.data.order_detail.o_status;
 					let o_id = res.data.order_detail.o_sorg_id;
 					let credit = res.data.order_detail.org_credit;
 					let number = res.data.order_detail.o_number;
 					let settle_real = res.data.order_detail.o_settle_real;
 					let confirm_type = res.data.order_detail.confirm_type;
 					// console.log(credit);
 					let credit_type = res.data.order_detail.credit_type;
					 data['order_type'] = order_type;
					//  调用支付凭证接口插入data中
					 _this.getProof((response)=>{
						data.pay_detail=JSON.parse(JSON.stringify(response.body))
						let html = template('tpl-order',data);
						$('#wrap').html(html);
						if(res.data.order_detail.blacklist_user && res.data.order_detail.blacklist_user == '1' && _this.mation == 0){
							_this.mation = 1;
							_.Popup.Tip('当前团内有黑名单游客，请注意接待！');
						}
						_this.Tab();
						_this.Event(statu,credit,credit_type,number,settle_real,confirm_type,o_id);
						if(statu == "未签署"){
							$(".check").show();
						};
						if(statu == "已全款" && res.data.orderContract && res.data.orderContract != null && res.data.orderContract.isCustomerSign == "0" && res.data.order_detail.existsContract == '1'){
							$(".check").show();
							console.log(1212);
						}
						var eyestate = window.localStorage.getItem('eye');
						eyestate = 0;
						if( eyestate == 0 ){
							$('.return').hide();
						}else{
							$('.return').show();
						}	
						//根据权限限制编辑游客按钮
						let otyp=decodeURI(_.GetUrlPara('type'))
						if( otyp=="待审核"||otyp=="已驳回"||otyp=="已取消"||statu=="待审核" ){
							$(".submit").hide()
						}else{
							$(".submit").show()
						}																	
					 },res.data.order_detail.order_id);
 				}
 			}
		 })
 	}
	//  支付凭证列表
	getProof(callback,_oid){
		_.Ajax({
			url : '/b2b/shop/orderPayList', 
			type : 'post',
			data : {
				// id : _.GetUrlPara('otid'),
				id : _oid,
			},
			async:false,
			success : function(res) {
				if (callback && typeof(callback) === "function") {
					callback(res);
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
 		//立即支付
 		if(_uinfo && _uinfo.u_id){
			if(o_id == _uinfo.org_id && statu && statu == "已报名" || statu == "已首款"){
	 			$(".nites").css("display","block");
	 			$(".nite").css("display","none");
	 		}else if(o_id == _uinfo.org_id){
	 			// $(".img img").css("display","none");
	 			// $(".nites").css("display","block");
	 		}
    	}
 		//确认订单
 		if(statu && statu == "待审核" && order_type && order_type =="seller" && confirm_type == '1'){
 			$(".define").css("display","block");
 		}
 		
 		$(".define").on("click",function(){
 			Popup.Info('确认订单！');
 			var html = '<div class="niced">';
 			if(credit_type == '1'){
 				html += '<div class="fa fa_on ft"><span class="fas"></span><i><span class="ed">信用额度</span>直接确认<span class="ye">(信用余额:' + credit +'元)</span><i></div>';
 			}else{
 				// html += '<div class="fa fc ft"><span class="fas"></span><i><span class="ed">信用额度</span>直接确认<span class="ye">(信用余额:' + credit +'元)</span><i></div>';
 			}
            
        	html += '<div class="fa fa_on fw"><span class="fas"></span>确认并由分销商自行支付</div>';
        	html += '<div class="lesse">取消</div><div class="yer">确定</div></div>';
        	$("#popup-info").append(html);
        	if(credit_type == '1' && parseInt(settle_real) > parseInt(credit)){
        		$(".ft").addClass("fc");
        		$(".ft").removeClass("fa_on");
        		$(".ye").append('<span class="funds">余额不足</span>')
        	}
        	$(".fa_on").on("click",function(e){
        		e.stopPropagation();
        		$(".fas").removeClass("fass");
        		$(this).find(".fas").addClass("fass");
        	})
	        $(".yer").off().on("click",function(){
	        	var confirm = '';
	        	if($(".ft").find(".fas").hasClass("fass")){
	        		confirm = '1';
	        	}else if($(".fw").find(".fas").hasClass("fass")){
	        		confirm = '2';
	        	}else{
	        		_.Popup.Tip('请选择确认类型！');
	        		return false;
	        	}
	        	var aja = '';
	        	if(confirm == '2'){
	        		aja = '/H5/shop/changeStatus';
	        	}else if(confirm == '1'){
	        		aja = '/H5/shop/agent_credit';
	        	}
	            _.Ajax({
	            url : aja,
	            type : 'post',
	            data : {
	            	no : number,
	            	o_status : statu,
	            	o_settle_real : settle_real,
	            	confirm : confirm,
	            	o_number : number
	            },
	                success : function(res){
	                    if( res.code == 200 ){
	                       _.Popup.Tip(res.message);
	                       Popup.PopupRemove();
	                       _this.Render();
	                    }else{
	                       Popup.PopupRemove();
	                    }
	                }
	            })
	        })
	        $(".lesse").on("click",function(){
	        	Popup.PopupRemove();
	        })
 		})
 		//修改备注
 		$(".bjs").off().on("click",function(){
 			Popup.Info('');
 			var textss = $(".pa").text();
 			
 			var html = '<div id="pageinfo-pop" class="pop_bg"><h3>修改订单备注</h3><div class="info">';
 				html += '<textarea>' + textss +' </textarea>';
 				html += '</div><div class="btn clearfix"><a class="cancel" href="javascript:;">取消</a>';
 				html += '<a class="submit" href="javascript:;">提交</a></div></div>';
 			$("#popup-info").append(html);
 			$(".pop_bg .cancel").on("click",function(){
 				 Popup.PopupRemove();
 			})
 			$(".pop_bg .submit").off().on("click",function(){	
 				var num = _.GetUrlPara('n');
 				var mark = $(".pop_bg textarea").val();
 				if(!$.trim(mark)){
 					_.Popup.Tip("备注内容不能为空！");
 					return false;
 				}
 				_.Ajax({
	            url : '/h5/shop/order_remark',
	            type : 'post',
	            data : {
	            	o_number : num,
	            	o_remark : mark
	            },
	                success : function(res){
	                	Popup.PopupRemove();
	                    if( res.code == 200 ){
	                        _.Popup.Tip(res.message);
	                        _this.Render();
	                    }
	                }
	            })
 			})
 		})
 		//合同签署约定
 		$(".edit_pri").on("click",function(){
 			$(".primes").addClass("in");
 			var html = $(".tex_salee").attr("datas");
 			$(".text_area").val(html);
 			_this.Prims();
 		})
 		
 		$(".pri_a").off().on("click",function(){
 			$(".primes").removeClass("in");
 		});
 		$(".check").on("click",function(){
 			 var no = _.GetUrlPara('n');
 			 window.location.href = 'order_success.html?n=' + no + '&imgout=1';
		 })
		//  跳转到编辑游客页
		$(".submit .btn").on("click",function(){
			window.location.href = 'order_touristinfo.html?n=' +
			 _.GetUrlPara('n') + '&order_type='+_.GetUrlPara('order_type')+'&otid='+_.GetUrlPara('otid');
	   })	
		//  跳转到上传支付凭证
		$(".submitProof .btn").on("click",function(){
			window.location.href = 'order_payproof.html?n=' +
			 _.GetUrlPara('n') + '&order_type='+_.GetUrlPara('order_type')+'&otid='+_.GetUrlPara('otid');
	   })		   	

		// //  查看凭证
		// $(".getPayProof").off().on("click",function(){
		// })
		// // 选择凭证
		// $(".choosePayProof").off().on("click",function(){
		// 	_this.imgChoose()
		// })
		// 	上传凭证
		$(".uploadPayProof").off().on("click",function(){
			_this.chooseImg()
		})		
 	}
 	Prims(){
 		$(".pri_btn").on("click",function(){
 			var html = $(".text_area").val();
 			var num = _.GetUrlPara('n');
 			_.Ajax({
 				url : '/front/order/m/updateContractAgreement',
	 			type : 'post',
	 			data : {
	 				oContractAgreement : html,
	 				oOrderNo : num
	 			},
	 			success : function(res) {
	 				if(res.code == '200'){
	 					$(".tex_salee").attr("datas",html);
		 				$(".tex_salee").html(html);
		 				$(".primes").removeClass("in");
		 				 _.Popup.Tip(res.message);
	 				}
	 				
	 			}
 			})
 		})
	 }
	 
	// 上传图片函数
	imgUpload(){
		let _this = this;
		var i = 0, length = _this.images.localId.length;
		_this.images.serverId = [];		
		wx.uploadImage({
			localId: _this.images.localId[i],
			success: function (res) {
				i++;
				//   alert('已上传：' + i + '/' + length);
				_.Popup.Tip('已上传：' + i + '/' + length)
				_this.images.serverId.push(res.serverId);
				if (i < length) {
					upload();
				}
			},
			fail: function (res) {
				//   alert(JSON.stringify(res));
				_.Popup.Tip(JSON.stringify(res))
			}
		  });
	}
	// 微信上传图片
    chooseImg(){
		console.log("微信配置",wx_config.wxConfig())
		var _this = this;
		wx.config(wx_config.wxConfig());
		wx.ready(function(){
			$(".add").off().on("click",function(){
			   wx.chooseImage({
				  count: 9, // Ä¬ÈÏ9
				  //sizeType: ['original', 'compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
				  sizeType: [ 'compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
				  sourceType: ['album', 'camera'], // ¿ÉÒÔÖ¸¶¨À´Ô´ÊÇÏà²á»¹ÊÇÏà»ú£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
				  success: function (res) {
					  var localIds = res.localIds; // ·µ»ØÑ¡¶¨ÕÕÆ¬µÄ±¾µØIDÁÐ±í£¬localId¿ÉÒÔ×÷Îªimg±êÇ©µÄsrcÊôÐÔÏÔÊ¾Í¼Æ¬
					  var html='';
					  for(var i=0;i<localIds.length;i++){
						  html+=' <li class="lis"><div class="sc"></div><img src="' + localIds[i] + '" d-src="' + localIds[i] + '" alt=""></li>';
					  }
						$('.upsed .phon_wx').prepend(html);
						//照片高度
						var wid = $(".lis").css("width");
						$(".lis").css("height",wid);
						//图片剪切
						// var wh = $(".lis").height();
						// $(".lis img").each(function(){
						//   var imgs = $(this).attr("d-src");
						//   $(this).attr("d-src",imgs + '?x-oss-process=image/resize,m_fill,h_' + wh + ',w_' + wh);
						// })
						$(".upsed .phon_wx .sc").off().on("click",function(){
							$(this).parent().remove();
						})
				  }
			  });
			})
	
			function wx_ajax(prolist){
				_.Popup.LoadingRemove();
				var id = _.GetUrlPara("id");
				var siid = $("#mysele_two").children('option:selected').val();
				_.Ajax({
					url : '/common/downloadMedia'+prolist,
					type : 'get',
					// data : {
					//   file : prolist,
					//   at_table_id : siid,
					//   at_pid : id
					// },
					success : function(res) {
						_.Popup.Tip(res.message);
					   if(res.code == 200){
							$('.upsed .phon_ul .lis').remove();
							$(".upsed").removeClass("in");
							_this.Show();
					   }
					   alert(res.message)
					}
				})
			}
			function wx_img(index,leng,prolist){
				var local = $('.upsed .phon_wx .lis').eq(index).find('img').attr("d-src");
				wx.uploadImage({
					localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 0, // 默认为1，显示进度提示
					success: function (res) {
						var serverId = res.serverId; // 返回图片的服务器端ID
						prolist.push(serverId);
						index = index + 1;
						if(index < leng){
							wx_img(index,leng,prolist);
						}else{
							wx_ajax(prolist);
						}
					}
				}); 
			}
	
			$(".boot .yes").off().on("click",function(){
				var prolist = [];
				var leng = $('.upsed .phon_wx .lis').length;
				if(leng < 1){
					_.Popup.Tip('请添加图片！');
					return false;
				}
				var index = 0;
				_.Popup.Loading();
				wx_img(index,leng,prolist);
			})
			 
		  })  
		}
}
UserInfo.Ready(function(){
	new Index();
})


