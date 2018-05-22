webpackJsonp([26],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(81);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(120);

	var _common = __webpack_require__(22);

	var _common2 = _interopRequireDefault(_common);

	var _jquery = __webpack_require__(23);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__(80);

	var _global2 = _interopRequireDefault(_global);

	var _popup = __webpack_require__(87);

	var _popup2 = _interopRequireDefault(_popup);

	var _artTemplate = __webpack_require__(85);

	var _artTemplate2 = _interopRequireDefault(_artTemplate);

	var _userinfo = __webpack_require__(93);

	var _userinfo2 = _interopRequireDefault(_userinfo);

	var _wechat_config = __webpack_require__(121);

	var _wechat_config2 = _interopRequireDefault(_wechat_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Index = function () {
		function Index() {
			(0, _classCallCheck3.default)(this, Index);

			var _this = this;
			_this.mation = 0;
			_this.images = {
				localId: [],
				serverId: []
			};
			// _this.chooseImg()
			// wx_config.wxConfig()
			_global2.default.GetCityCode(function (citycode) {
				_this.citycode = citycode;
				_this.Render();
			});
		}

		(0, _createClass3.default)(Index, [{
			key: 'Tab',
			value: function Tab() {
				var _this = this;
				(0, _jquery2.default)('.infor-bar ul li').on('click', function () {
					var index = (0, _jquery2.default)(this).index();
					(0, _jquery2.default)(".lists").hide();
					(0, _jquery2.default)(".lists").eq(index).show();
					(0, _jquery2.default)(this).find('a').addClass('active');
					(0, _jquery2.default)(this).siblings().find('a').removeClass('active');
				});

				(0, _jquery2.default)('.t-bar a.left').on('click', function () {
					window.history.back();
				});
			}
		}, {
			key: 'Render',
			value: function Render() {
				var _this = this;
				var no = _global2.default.GetUrlPara('n');
				var order_type = _global2.default.GetUrlPara('order_type');
				_global2.default.Ajax({
					// url : '/h5/shop/get_order_detail',
					url: '/front/order/m/queryOrderDetail',
					type: 'post',
					data: {
						no: no,
						order_type: order_type
					},
					success: function success(res) {
						if (res.code == 200) {
							var data = res.data;
							var statu = res.data.order_detail.o_status;
							var o_id = res.data.order_detail.o_sorg_id;
							var credit = res.data.order_detail.org_credit;
							var number = res.data.order_detail.o_number;
							var settle_real = res.data.order_detail.o_settle_real;
							var confirm_type = res.data.order_detail.confirm_type;
							// console.log(credit);
							var credit_type = res.data.order_detail.credit_type;
							data['order_type'] = order_type;
							//  调用支付凭证接口插入data中
							_this.getProof(function (response) {
								data.pay_detail = JSON.parse((0, _stringify2.default)(response.body));
								var html = (0, _artTemplate2.default)('tpl-order', data);
								(0, _jquery2.default)('#wrap').html(html);
								if (res.data.order_detail.blacklist_user && res.data.order_detail.blacklist_user == '1' && _this.mation == 0) {
									_this.mation = 1;
									_global2.default.Popup.Tip('当前团内有黑名单游客，请注意接待！');
								}
								_this.Tab();
								_this.Event(statu, credit, credit_type, number, settle_real, confirm_type, o_id);
								if (statu == "未签署") {
									(0, _jquery2.default)(".check").show();
								};
								if (statu == "已全款" && res.data.orderContract && res.data.orderContract != null && res.data.orderContract.isCustomerSign == "0" && res.data.order_detail.existsContract == '1') {
									(0, _jquery2.default)(".check").show();
									console.log(1212);
								}
								var eyestate = window.localStorage.getItem('eye');
								eyestate = 0;
								if (eyestate == 0) {
									(0, _jquery2.default)('.return').hide();
								} else {
									(0, _jquery2.default)('.return').show();
								}
								//根据权限限制编辑游客按钮
								var otyp = decodeURI(_global2.default.GetUrlPara('type'));
								if (otyp == "待审核" || otyp == "已驳回" || otyp == "已取消" || statu == "待审核") {
									(0, _jquery2.default)(".submit").hide();
								} else {
									(0, _jquery2.default)(".submit").show();
								}
							}, res.data.order_detail.order_id);
						}
					}
				});
			}
			//  支付凭证列表

		}, {
			key: 'getProof',
			value: function getProof(callback, _oid) {
				_global2.default.Ajax({
					url: '/b2b/shop/orderPayList',
					type: 'post',
					data: {
						// id : _.GetUrlPara('otid'),
						id: _oid
					},
					async: false,
					success: function success(res) {
						if (callback && typeof callback === "function") {
							callback(res);
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event(statu, credit, credit_type, number, settle_real, confirm_type, o_id) {
				var _this = this;
				var order_type = _global2.default.GetUrlPara('order_type');
				if (order_type == 'seller') {
					(0, _jquery2.default)('.buyer-infor').show();
					(0, _jquery2.default)('.business-infor').hide();
				} else {
					(0, _jquery2.default)('.buyer-infor').hide();
					(0, _jquery2.default)('.business-infor').show();
				}
				//立即支付
				if (_uinfo && _uinfo.u_id) {
					if (o_id == _uinfo.org_id && statu && statu == "已报名" || statu == "已首款") {
						(0, _jquery2.default)(".nites").css("display", "block");
						(0, _jquery2.default)(".nite").css("display", "none");
					} else if (o_id == _uinfo.org_id) {
						// $(".img img").css("display","none");
						// $(".nites").css("display","block");
					}
				}
				//确认订单
				if (statu && statu == "待审核" && order_type && order_type == "seller" && confirm_type == '1') {
					(0, _jquery2.default)(".define").css("display", "block");
				}

				(0, _jquery2.default)(".define").on("click", function () {
					_popup2.default.Info('确认订单！');
					var html = '<div class="niced">';
					if (credit_type == '1') {
						html += '<div class="fa fa_on ft"><span class="fas"></span><i><span class="ed">信用额度</span>直接确认<span class="ye">(信用余额:' + credit + '元)</span><i></div>';
					} else {
						// html += '<div class="fa fc ft"><span class="fas"></span><i><span class="ed">信用额度</span>直接确认<span class="ye">(信用余额:' + credit +'元)</span><i></div>';
					}

					html += '<div class="fa fa_on fw"><span class="fas"></span>确认并由分销商自行支付</div>';
					html += '<div class="lesse">取消</div><div class="yer">确定</div></div>';
					(0, _jquery2.default)("#popup-info").append(html);
					if (credit_type == '1' && parseInt(settle_real) > parseInt(credit)) {
						(0, _jquery2.default)(".ft").addClass("fc");
						(0, _jquery2.default)(".ft").removeClass("fa_on");
						(0, _jquery2.default)(".ye").append('<span class="funds">余额不足</span>');
					}
					(0, _jquery2.default)(".fa_on").on("click", function (e) {
						e.stopPropagation();
						(0, _jquery2.default)(".fas").removeClass("fass");
						(0, _jquery2.default)(this).find(".fas").addClass("fass");
					});
					(0, _jquery2.default)(".yer").off().on("click", function () {
						var confirm = '';
						if ((0, _jquery2.default)(".ft").find(".fas").hasClass("fass")) {
							confirm = '1';
						} else if ((0, _jquery2.default)(".fw").find(".fas").hasClass("fass")) {
							confirm = '2';
						} else {
							_global2.default.Popup.Tip('请选择确认类型！');
							return false;
						}
						var aja = '';
						if (confirm == '2') {
							aja = '/H5/shop/changeStatus';
						} else if (confirm == '1') {
							aja = '/H5/shop/agent_credit';
						}
						_global2.default.Ajax({
							url: aja,
							type: 'post',
							data: {
								no: number,
								o_status: statu,
								o_settle_real: settle_real,
								confirm: confirm,
								o_number: number
							},
							success: function success(res) {
								if (res.code == 200) {
									_global2.default.Popup.Tip(res.message);
									_popup2.default.PopupRemove();
									_this.Render();
								} else {
									_popup2.default.PopupRemove();
								}
							}
						});
					});
					(0, _jquery2.default)(".lesse").on("click", function () {
						_popup2.default.PopupRemove();
					});
				});
				//修改备注
				(0, _jquery2.default)(".bjs").off().on("click", function () {
					_popup2.default.Info('');
					var textss = (0, _jquery2.default)(".pa").text();

					var html = '<div id="pageinfo-pop" class="pop_bg"><h3>修改订单备注</h3><div class="info">';
					html += '<textarea>' + textss + ' </textarea>';
					html += '</div><div class="btn clearfix"><a class="cancel" href="javascript:;">取消</a>';
					html += '<a class="submit" href="javascript:;">提交</a></div></div>';
					(0, _jquery2.default)("#popup-info").append(html);
					(0, _jquery2.default)(".pop_bg .cancel").on("click", function () {
						_popup2.default.PopupRemove();
					});
					(0, _jquery2.default)(".pop_bg .submit").off().on("click", function () {
						var num = _global2.default.GetUrlPara('n');
						var mark = (0, _jquery2.default)(".pop_bg textarea").val();
						if (!_jquery2.default.trim(mark)) {
							_global2.default.Popup.Tip("备注内容不能为空！");
							return false;
						}
						_global2.default.Ajax({
							url: '/h5/shop/order_remark',
							type: 'post',
							data: {
								o_number: num,
								o_remark: mark
							},
							success: function success(res) {
								_popup2.default.PopupRemove();
								if (res.code == 200) {
									_global2.default.Popup.Tip(res.message);
									_this.Render();
								}
							}
						});
					});
				});
				//合同签署约定
				(0, _jquery2.default)(".edit_pri").on("click", function () {
					(0, _jquery2.default)(".primes").addClass("in");
					var html = (0, _jquery2.default)(".tex_salee").attr("datas");
					(0, _jquery2.default)(".text_area").val(html);
					_this.Prims();
				});

				(0, _jquery2.default)(".pri_a").off().on("click", function () {
					(0, _jquery2.default)(".primes").removeClass("in");
				});
				(0, _jquery2.default)(".check").on("click", function () {
					var no = _global2.default.GetUrlPara('n');
					window.location.href = 'order_success.html?n=' + no + '&imgout=1';
				});
				//  跳转到编辑游客页
				(0, _jquery2.default)(".submit .btn").on("click", function () {
					window.location.href = 'order_touristinfo.html?n=' + _global2.default.GetUrlPara('n') + '&order_type=' + _global2.default.GetUrlPara('order_type') + '&otid=' + _global2.default.GetUrlPara('otid');
				});
				//  跳转到上传支付凭证
				(0, _jquery2.default)(".submitProof .btn").on("click", function () {
					window.location.href = 'order_payproof.html?n=' + _global2.default.GetUrlPara('n') + '&order_type=' + _global2.default.GetUrlPara('order_type') + '&otid=' + _global2.default.GetUrlPara('otid');
				});

				// //  查看凭证
				// $(".getPayProof").off().on("click",function(){
				// })
				// // 选择凭证
				// $(".choosePayProof").off().on("click",function(){
				// 	_this.imgChoose()
				// })
				// 	上传凭证
				(0, _jquery2.default)(".uploadPayProof").off().on("click", function () {
					_this.chooseImg();
				});
			}
		}, {
			key: 'Prims',
			value: function Prims() {
				(0, _jquery2.default)(".pri_btn").on("click", function () {
					var html = (0, _jquery2.default)(".text_area").val();
					var num = _global2.default.GetUrlPara('n');
					_global2.default.Ajax({
						url: '/front/order/m/updateContractAgreement',
						type: 'post',
						data: {
							oContractAgreement: html,
							oOrderNo: num
						},
						success: function success(res) {
							if (res.code == '200') {
								(0, _jquery2.default)(".tex_salee").attr("datas", html);
								(0, _jquery2.default)(".tex_salee").html(html);
								(0, _jquery2.default)(".primes").removeClass("in");
								_global2.default.Popup.Tip(res.message);
							}
						}
					});
				});
			}

			// 上传图片函数

		}, {
			key: 'imgUpload',
			value: function imgUpload() {
				var _this = this;
				var i = 0,
				    length = _this.images.localId.length;
				_this.images.serverId = [];
				wx.uploadImage({
					localId: _this.images.localId[i],
					success: function success(res) {
						i++;
						//   alert('已上传：' + i + '/' + length);
						_global2.default.Popup.Tip('已上传：' + i + '/' + length);
						_this.images.serverId.push(res.serverId);
						if (i < length) {
							upload();
						}
					},
					fail: function fail(res) {
						//   alert(JSON.stringify(res));
						_global2.default.Popup.Tip((0, _stringify2.default)(res));
					}
				});
			}
			// 微信上传图片

		}, {
			key: 'chooseImg',
			value: function chooseImg() {
				console.log("微信配置", _wechat_config2.default.wxConfig());
				var _this = this;
				wx.config(_wechat_config2.default.wxConfig());
				wx.ready(function () {
					(0, _jquery2.default)(".add").off().on("click", function () {
						wx.chooseImage({
							count: 9, // Ä¬ÈÏ9
							//sizeType: ['original', 'compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
							sizeType: ['compressed'], // ¿ÉÒÔÖ¸¶¨ÊÇÔ­Í¼»¹ÊÇÑ¹ËõÍ¼£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
							sourceType: ['album', 'camera'], // ¿ÉÒÔÖ¸¶¨À´Ô´ÊÇÏà²á»¹ÊÇÏà»ú£¬Ä¬ÈÏ¶þÕß¶¼ÓÐ
							success: function success(res) {
								var localIds = res.localIds; // ·µ»ØÑ¡¶¨ÕÕÆ¬µÄ±¾µØIDÁÐ±í£¬localId¿ÉÒÔ×÷Îªimg±êÇ©µÄsrcÊôÐÔÏÔÊ¾Í¼Æ¬
								var html = '';
								for (var i = 0; i < localIds.length; i++) {
									html += ' <li class="lis"><div class="sc"></div><img src="' + localIds[i] + '" d-src="' + localIds[i] + '" alt=""></li>';
								}
								(0, _jquery2.default)('.upsed .phon_wx').prepend(html);
								//照片高度
								var wid = (0, _jquery2.default)(".lis").css("width");
								(0, _jquery2.default)(".lis").css("height", wid);
								//图片剪切
								// var wh = $(".lis").height();
								// $(".lis img").each(function(){
								//   var imgs = $(this).attr("d-src");
								//   $(this).attr("d-src",imgs + '?x-oss-process=image/resize,m_fill,h_' + wh + ',w_' + wh);
								// })
								(0, _jquery2.default)(".upsed .phon_wx .sc").off().on("click", function () {
									(0, _jquery2.default)(this).parent().remove();
								});
							}
						});
					});

					function wx_ajax(prolist) {
						_global2.default.Popup.LoadingRemove();
						var id = _global2.default.GetUrlPara("id");
						var siid = (0, _jquery2.default)("#mysele_two").children('option:selected').val();
						_global2.default.Ajax({
							url: '/common/downloadMedia' + prolist,
							type: 'get',
							// data : {
							//   file : prolist,
							//   at_table_id : siid,
							//   at_pid : id
							// },
							success: function success(res) {
								_global2.default.Popup.Tip(res.message);
								if (res.code == 200) {
									(0, _jquery2.default)('.upsed .phon_ul .lis').remove();
									(0, _jquery2.default)(".upsed").removeClass("in");
									_this.Show();
								}
								alert(res.message);
							}
						});
					}
					function wx_img(index, leng, prolist) {
						var local = (0, _jquery2.default)('.upsed .phon_wx .lis').eq(index).find('img').attr("d-src");
						wx.uploadImage({
							localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 0, // 默认为1，显示进度提示
							success: function success(res) {
								var serverId = res.serverId; // 返回图片的服务器端ID
								prolist.push(serverId);
								index = index + 1;
								if (index < leng) {
									wx_img(index, leng, prolist);
								} else {
									wx_ajax(prolist);
								}
							}
						});
					}

					(0, _jquery2.default)(".boot .yes").off().on("click", function () {
						var prolist = [];
						var leng = (0, _jquery2.default)('.upsed .phon_wx .lis').length;
						if (leng < 1) {
							_global2.default.Popup.Tip('请添加图片！');
							return false;
						}
						var index = 0;
						_global2.default.Popup.Loading();
						wx_img(index, leng, prolist);
					});
				});
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 120:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__(23);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__(80);

	var _global2 = _interopRequireDefault(_global);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import Popup from '../common/popup.js';
	// import template from '../lib/artTemplate.js';
	// import UserInfo from '../common/userinfo.js';
	// import Api from './api.js';


	// import C from '../common/common.js';
	exports.default = {
	    wxConfig: function wxConfig() {
	        var wx_config = {
	            debug: false,
	            appId: 'wx4f8c668abdd46305',
	            timestamp: null,
	            nonceStr: null,
	            signature: null,
	            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
	        };
	        _global2.default.Ajax({
	            url: '/common/getWXconfig',
	            data: {
	                pageUrl: location.href
	            },
	            async: false,
	            success: function success(res) {
	                // alert(JSON.stringify(res));
	                wx_config.timestamp = res.body.timestamp;
	                wx_config.nonceStr = res.body.nonceStr;
	                wx_config.signature = res.body.signature;
	            }
	        });
	        return wx_config;
	    }
	};

/***/ })

});