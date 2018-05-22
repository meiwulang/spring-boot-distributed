webpackJsonp([43],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(136);

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

			this.Render();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Render',
			value: function Render() {
				var _this = this;
				var no = _global2.default.GetUrlPara('n');
				_global2.default.Ajax({
					url: '/h5/Payment/paytype_list',
					type: 'get',
					data: {
						no: no
					},
					success: function success(res) {
						if (res.code == 200) {
							var html = (0, _artTemplate2.default)('tpl-list', res.data);
							(0, _jquery2.default)('.main').html(html);
							_this.Bala();
						}
					}
				});
			}
		}, {
			key: 'Bala',
			value: function Bala() {
				var _this = this;
				var no = _global2.default.GetUrlPara('n');
				_global2.default.Ajax({
					url: '/h5/Payment/gateway',
					type: 'get',
					data: {
						no: no,
						payType: 30
					},
					success: function success(res) {
						if (res.code == 200) {
							var html = (0, _artTemplate2.default)('tpl-img', res.data);
							(0, _jquery2.default)('.phon').html(html);
							_this.Event();
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				(0, _jquery2.default)(".buttonss").on("click", function () {
					var html = '<div>取消</div><div class="but_yes">确认</div>';
					_global2.default.Popup.Info('实际支付按微信支付成功为准！' + html);
					_this.Events();
				});
			}
		}, {
			key: 'Events',
			value: function Events() {
				(0, _jquery2.default)(".but_yes").on("click", function () {
					var no = _global2.default.GetUrlPara('n');
					window.location.href = 'order_success.html?n=' + no;
				});
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 136:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});