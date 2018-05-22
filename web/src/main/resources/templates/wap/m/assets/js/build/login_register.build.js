webpackJsonp([17],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(111);

	var _common = __webpack_require__(22);

	var _common2 = _interopRequireDefault(_common);

	var _jquery = __webpack_require__(23);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__(80);

	var _global2 = _interopRequireDefault(_global);

	var _userinfo = __webpack_require__(93);

	var _userinfo2 = _interopRequireDefault(_userinfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Index = function () {
		function Index() {
			(0, _classCallCheck3.default)(this, Index);

			this.Regi();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Regi',
			value: function Regi() {
				var _this = this;
				var appletId = _jquery2.default.trim(_global2.default.GetUrlPara('appletId'));
				if (appletId && appletId != undefined) {
					window.sessionStorage.setItem('appletId', appletId);
				}
				var openId = _global2.default.GetUrlPara('openId');
				var pid = _global2.default.GetUrlPara('p_id');
				_global2.default.Ajax({
					url: '/user/visitorRegister',
					type: 'get',
					data: {
						openId: openId,
						p_id: pid
					},
					success: function success(res) {
						if (res.code == 200) {
							_this.Login();
						}
					}
				});
			}
		}, {
			key: 'Login',
			value: function Login() {
				var openId = _global2.default.GetUrlPara('openId');
				var pid = _global2.default.GetUrlPara('p_id');
				_global2.default.Ajax({
					url: '/user/loginByOpenId',
					type: 'get',
					data: {
						openId: openId,
						p_id: pid,
						from: 1
					},
					success: function success(res) {
						if (res.code == 200) {
							var type = _global2.default.GetUrlPara('type');
							if (type == 'product') {
								window.location.href = 'detail.html?p_id=' + pid;
							} else if (type == 'order') {
								window.location.href = 'order_list.html';
							}
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

/***/ 111:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});