webpackJsonp([33],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(124);

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
			_global2.default.CheckLogin(function () {
				(0, _jquery2.default)("#wrap").show();
				// 用于计算页数
				_this.pages = {
					total: 0,
					count: 1
				};
				_global2.default.GetCityCode(function (citycode) {
					_this.citycode = citycode;
					_this.Event();
					// _this.Tab();
					_this.Render(1);
					_this.Scrollload();
				});
				var host = window.location.host;
				var acard = '';
				var openid = window.sessionStorage.getItem('openid');
				var appletId = _global2.default.GetUrlPara('appletId');
				if (appletId && appletId != undefined) {
					window.sessionStorage.setItem('appletId', appletId);
				}
			});
		}

		(0, _createClass3.default)(Index, [{
			key: 'Render',
			value: function Render(currpage) {
				(0, _jquery2.default)('body').addClass('scrolling');
				_global2.default.Ajax({
					url: '/orderRefundRecord/getRefundRecord/' + _global2.default.GetUrlPara('id') + "/0",
					type: 'get',
					success: function success(res) {
						if (res.code == 0) {
							var html = (0, _artTemplate2.default)('tpl-lists', res);
							console.log("res", res);
							(0, _jquery2.default)(".loading").remove();
							(0, _jquery2.default)('.recordlist').append(html);
							// _this.Dele();
							(0, _jquery2.default)('body').removeClass('scrolling');
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				var order_type = _global2.default.GetUrlPara('order_type');

				(0, _jquery2.default)('.t-bar a.left').on('click', function () {
					// window.history.back();
					window.location.href = 'order_list.html';
					sessionStorage.removeItem("typ");
				});
			}
			//  下拉加载数据列表

		}, {
			key: 'Scrollload',
			value: function Scrollload() {
				var _this = this;
				console.log("order_list下拉");
				(0, _jquery2.default)(window).scroll(function () {
					var scrollTop = (0, _jquery2.default)(this).scrollTop();
					var scrollHeight = (0, _jquery2.default)(document).height();
					var windowHeight = (0, _jquery2.default)(this).height();
					if (scrollTop + windowHeight == scrollHeight) {
						// 获取page数,并判断是否是最后一页	
						if (_this.pages.total > _this.pages.count * 20) {
							if (!(0, _jquery2.default)('body').hasClass('scrolling')) {
								_this.Render(++_this.pages.count);
								(0, _jquery2.default)(".recordlist").append('<div class="loading">加载中...</div>');
							}
						} else {
							(0, _jquery2.default)(".loading").remove();
						}
					}
				});
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 124:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});