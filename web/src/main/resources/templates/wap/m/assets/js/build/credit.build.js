webpackJsonp([2],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(95);

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

			var _this = this;
			_this.Show();
			_this.Event();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Show',
			value: function Show() {
				var _this = this;
				var order_type = _global2.default.GetUrlPara('order_type');
				var status = '';
				status = (0, _jquery2.default)(".nav ul li .active").attr("status");
				var key = '';
				_global2.default.Ajax({
					url: '/h5/credit/get_credit_list',
					type: 'post',
					data: {
						order_type: order_type,
						status: status,
						key: key,
						limit: '999',
						page: '0'
					},
					success: function success(res) {
						if (res.code == 200) {
							res.data['order_type'] = order_type;
							var html = (0, _artTemplate2.default)('tpl-condition', res.data);
							(0, _jquery2.default)('.content').html(html);
							_this.Colo();
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				(0, _jquery2.default)(".nav>ul>li>a").on("click", function () {
					(0, _jquery2.default)(".nav ul li a").removeClass("active");
					(0, _jquery2.default)(this).addClass("active");
					_this.Show();
				});
				(0, _jquery2.default)(".lef").on("click", function () {
					window.history.back();
				});
			}
		}, {
			key: 'Colo',
			value: function Colo() {
				(0, _jquery2.default)(".colo").each(function () {
					console.log(1212);
					if ((0, _jquery2.default)(this).text() == "未还完") {
						(0, _jquery2.default)(this).css("color", "#ffad26");
					} else if ((0, _jquery2.default)(this).text() == "已还完") {
						(0, _jquery2.default)(this).css("color", "#37cc72");
					} else if ((0, _jquery2.default)(this).text() == "未还款") {
						(0, _jquery2.default)(this).css("color", "#84b6fb");
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

/***/ 95:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});