webpackJsonp([27],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(122);

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
				var id = _global2.default.GetUrlPara('id');
				_global2.default.Ajax({
					url: '/orderRefundRecord/getOtherRefundTypeForOrder/' + id,
					type: 'get',
					success: function success(res) {
						if (res.code == 0) {
							getTouristInfo(res.body);
						}
					}
				});

				// 游客信息
				function getTouristInfo(flag) {
					_global2.default.Ajax({
						url: '/orderRefundRecord/getTouristListForRefund/' + _global2.default.GetUrlPara('id'),
						type: 'get',
						success: function success(res) {
							if (res.code == 0) {
								res.RefundType = flag;
								var html = (0, _artTemplate2.default)('tpl-order', res);
								(0, _jquery2.default)("#wrap").html(html);
								_this.Tab();
								_this.Event();
							}
						}
					});
				};
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				(0, _jquery2.default)('.t-bar a.left').on('click', function () {
					// window.history.back();
					window.location.href = 'order_list.html';
					sessionStorage.removeItem("typ");
				});

				// 全选按钮
				(0, _jquery2.default)("#allcheck").on("click", function () {
					var flag = (0, _jquery2.default)(this).is(':checked');
					if (flag) {
						(0, _jquery2.default)("input[name='checkPart']").prop("checked", true);
					} else {
						(0, _jquery2.default)("input[name='checkPart']").prop("checked", false);
					}
				});
				(0, _jquery2.default)("input[name='checkPart']").on("click", function () {
					var allcheck = (0, _jquery2.default)("input[name='checkPart']").length;
					var checklist = (0, _jquery2.default)("input[name='checkPart']:checked").length;
					if (allcheck == checklist) {
						(0, _jquery2.default)("#allcheck").prop("checked", true);
					} else {
						(0, _jquery2.default)("#allcheck").prop("checked", false);
					}
				});

				// 提交按钮
				(0, _jquery2.default)(".submit .btn").on("click", function () {
					window.location.href = 'order_endorseDate.html?id=' + _global2.default.GetUrlPara('id');;
					return;

					var text = (0, _jquery2.default)(".active").html();
					var vallist = [];
					(0, _jquery2.default)("input[name='checkPart']:checked").each(function () {
						vallist.push((0, _jquery2.default)(this).val());
					});
					var refundMoney = null;
					var remark = "";
					// 退票是0其他是1
					var type = text == "游客退票" ? 0 : 1;
					if (text == "游客退票") {
						remark = (0, _jquery2.default)("#remark_1").val();
					} else {
						remark = (0, _jquery2.default)("#remark_2").val();
						refundMoney = (0, _jquery2.default)("input[type='number']").val();
						vallist = [];
					}
					if (!remark) {
						_global2.default.Popup.Tip("请填写退款说明");
						return;
					}
					_global2.default.Ajax({
						url: '/orderRefundRecord/applyOrderRefund',
						type: 'post',
						data: {
							"applyRefundAmount": refundMoney,
							"orderId": _global2.default.GetUrlPara('id'),
							"refundExplain": remark,
							"touristIds": vallist,
							"type": type
						},
						success: function success(res) {
							if (res.code == 0) {
								window.location.href = 'order_refundRecord.html?id=' + _global2.default.GetUrlPara('id');;
							} else {
								_global2.default.Popup.Tip(res.message);
							}
						}
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

/***/ 122:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});