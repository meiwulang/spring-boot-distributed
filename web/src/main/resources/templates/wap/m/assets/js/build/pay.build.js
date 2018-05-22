webpackJsonp([38],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(81);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(132);

	var _common = __webpack_require__(22);

	var _common2 = _interopRequireDefault(_common);

	var _jquery = __webpack_require__(23);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__(80);

	var _global2 = _interopRequireDefault(_global);

	var _artTemplate = __webpack_require__(85);

	var _artTemplate2 = _interopRequireDefault(_artTemplate);

	var _userinfo = __webpack_require__(93);

	var _userinfo2 = _interopRequireDefault(_userinfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Index = function () {
		function Index() {
			(0, _classCallCheck3.default)(this, Index);

			this.Bala();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Bala',
			value: function Bala() {
				var _this = this;
				var no = _global2.default.GetUrlPara('n');
				if (window.__wxjs_environment !== "miniprogram") {
					(0, _jquery2.default)(".payInput").show();
				} else {
					(0, _jquery2.default)(".payInput").hide();
				}
				_global2.default.Ajax({
					url: '/front/order/m/confirmOrderInfo/',
					type: 'get',
					data: {
						no: no
					},
					success: function success(res) {
						if (res.code == 200) {
							var html = (0, _artTemplate2.default)('tpl-bala', res.data);
							(0, _jquery2.default)('#wrap').html(html);
							var contract_template_num = "";
							if (res.data.payment_info.contract_template_num) {
								var contract_template_num = res.data.payment_info.contract_template_num;
							}
							_this.Event(contract_template_num, res.data);
							console.log(res.data, 'html');
						}
					}
				});
			}
		}, {
			key: 'GetQrcode',
			value: function GetQrcode() {
				var _this = this;
				var no = _global2.default.GetUrlPara('n');
				var appletId = window.sessionStorage.getItem('appletId');
				if (!appletId) {
					appletId = '';
				}
				_global2.default.Ajax({
					url: '/wechat/doUnifiedOrder',
					type: 'get',
					data: {
						// appletId : appletId,
						outTradeNo: no,
						type: 2,
						paymentAmount: (0, _jquery2.default)('.payInput input').val()
					},
					success: function success(res) {
						if (res.code == 200) {
							(0, _jquery2.default)('.wx-qrcode img').attr('src', res.data.url);
							(0, _jquery2.default)('.main').attr('newOutTradeNo', res.data.newOutTradeNo);
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event(contract_template_num, html) {
				var contract_template_num = contract_template_num;
				var html = html;
				var _this = this;
				(0, _jquery2.default)(".pay_list .choice").on("click", function () {
					console.log(contract_template_num);
					(0, _jquery2.default)('.pay_list .choice').addClass("choice_bor");
					(0, _jquery2.default)('.pay_list .choice').removeClass("choice_yes");
					(0, _jquery2.default)(this).toggleClass('choice_yes');
					(0, _jquery2.default)(this).toggleClass('choice_bor');

					if ((0, _jquery2.default)(".listss .choice").hasClass("choice_yes")) {
						(0, _jquery2.default)('.wx-qrcode').show();
						(0, _jquery2.default)('.payInput').show();
						if (contract_template_num > 0) {
							(0, _jquery2.default)('.buttons').text('签署合同');
						} else {
							(0, _jquery2.default)('.buttons').text('支付完成');
						}
						if (html.payment_info.total_fee > 0 && html.payment_info.o_source == 4 && html.payment_info.o_status == 3) {
							var input = (0, _jquery2.default)(".payInput input").val();
							var reg = /^\d+(?:\.\d{1,2})?$/;
							if (!reg.test(input) || input == null) {
								(0, _jquery2.default)('.wx-qrcode').hide();
								(0, _jquery2.default)('.pay_list .choice').addClass("choice_bor");
								(0, _jquery2.default)('.pay_list .choice').removeClass("choice_yes");
								_global2.default.Popup.Tip('请输入大于0的整数数字或者保留两位小数');
								(0, _jquery2.default)('.payInput').show();
							} else {
								_this.GetQrcode();
							}
						} else {
							_this.GetQrcode();
						}
					} else if ((0, _jquery2.default)(".listsss .choice").hasClass("choice_yes")) {
						(0, _jquery2.default)('.payInput').show();
						(0, _jquery2.default)('.wx-qrcode').hide();
						(0, _jquery2.default)('.buttons').text('确认支付');
					} else {
						(0, _jquery2.default)('.payInput').hide();
						(0, _jquery2.default)('.wx-qrcode').hide();
						(0, _jquery2.default)('.buttons').text('上传凭证');
					}
				});
				(0, _jquery2.default)(".buttons").on("click", function () {
					var no = _global2.default.GetUrlPara('n');
					if ((0, _jquery2.default)(".listss .choice").hasClass("choice_yes")) {
						window.location.href = 'order_success.html?n=' + no;
					} else if ((0, _jquery2.default)(".listOff .choice").hasClass("choice_yes")) {
						_global2.default.Popup.Tip('请前往PC端上传凭证！');
					} else if ((0, _jquery2.default)(".listsss .choice").hasClass("choice_yes")) {
						console.log(html.payment_info.total_fee, 'html');
						if (html.payment_info.total_fee > 0 && html.payment_info.o_source == 4 && html.payment_info.o_status == 3) {
							var input = (0, _jquery2.default)(".payInput input").val();
							var reg = /^\d+(?:\.\d{1,2})?$/;
							if (!reg.test(input)) {
								_global2.default.Popup.Tip('请输入大于0的整数数字或者保留两位小数');
							} else {
								console.log("输入正确");
								var openId = window.sessionStorage.getItem('openid');
								var appletId = window.sessionStorage.getItem('appletId');
								if (!appletId) {
									appletId = '';
								}
								_global2.default.Ajax({
									url: '/wechat/doUnifiedOrder',
									type: 'get',
									data: {
										appletId: appletId,
										outTradeNo: no,
										type: 1,
										newOutTradeNo: (0, _jquery2.default)('.main').attr('newOutTradeNo'),
										// openId : $('.main').attr('openid')
										openId: openId,
										paymentAmount: (0, _jquery2.default)('.payInput input').val()
									},
									success: function success(res) {
										if (res.code == 200) {
											if (res.message == '礼品卡抵扣成功！') {
												window.location.href = 'order_success.html?n=' + no;
											} else {
												// 判断是否为小程序
												if (window.__wxjs_environment === "miniprogram") {
													res.data.openId = openId;
													res.data.success_url = _global2.default.Api() + '/wap/m/order_success.html?n=' + _global2.default.GetUrlPara('n');
													//alert("location:"+window.location.href)
													//alert("res.data.success_url"+res.data.success_url)
													window.wx.miniProgram.redirectTo({
														url: '/pages/pay/pay?key=' + window.btoa((0, _stringify2.default)(res.data))
														// url: '/pages/pay/pay'
													});
												} else {
													_this.WxPay(res.data);
												}
											}
										}
									}
								});
							};
						} else {
							var openId = window.sessionStorage.getItem('openid');
							var appletId = window.sessionStorage.getItem('appletId');
							if (!appletId) {
								appletId = '';
							}
							_global2.default.Ajax({
								url: '/wechat/doUnifiedOrder',
								type: 'get',
								data: {
									appletId: appletId,
									outTradeNo: no,
									type: 1,
									newOutTradeNo: (0, _jquery2.default)('.main').attr('newOutTradeNo'),
									// openId : $('.main').attr('openid')
									openId: openId,
									paymentAmount: (0, _jquery2.default)('.payInput input').val()
								},
								success: function success(res) {
									if (res.code == 200) {
										if (res.message == '礼品卡抵扣成功！') {
											window.location.href = 'order_success.html?n=' + no;
										} else {
											// 判断是否为小程序
											if (window.__wxjs_environment === "miniprogram") {
												res.data.openId = openId;
												res.data.success_url = _global2.default.Api() + '/wap/m/order_success.html?n=' + _global2.default.GetUrlPara('n');
												//alert("location:"+window.location.href)
												//alert("res.data.success_url"+res.data.success_url)
												window.wx.miniProgram.redirectTo({
													url: '/pages/pay/pay?key=' + window.btoa((0, _stringify2.default)(res.data))
													// url: '/pages/pay/pay'
												});
											} else {
												_this.WxPay(res.data);
											}
										}
									}
								}
							});
						}
					} else {
						if (html.payment_info.total_fee > 0 && html.payment_info.o_pay_method == 2 && html.payment_info.o_status == 1) _global2.default.Popup.Tip('凭证正在确认中，无需再次支付！');
					}
				});
			}
		}, {
			key: 'WxPay',
			value: function WxPay(para) {
				var no = _global2.default.GetUrlPara('n');
				function onBridgeReady() {
					WeixinJSBridge.invoke('getBrandWCPayRequest', para, function (res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							window.location.href = 'order_success.html?n=' + no;
						} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
					});
				}
				if (typeof WeixinJSBridge == "undefined") {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				} else {
					onBridgeReady();
				}
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 132:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});