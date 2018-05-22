webpackJsonp([16],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(110);

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

			(0, _jquery2.default)(".gui").removeClass("guides");
			var $s1 = (0, _jquery2.default)('.phon'),
			    $s2 = (0, _jquery2.default)('.email');
			$s1.hide();
			$s2.hide();

			if (_uinfo && _uinfo.u_id) {
				window.location.href = "index.html";
			}
			this.Event();
		}

		(0, _createClass3.default)(Index, [{
			key: 'Event',
			value: function Event() {
				var _this = this;
				var $s1 = (0, _jquery2.default)('.phon'),
				    $s2 = (0, _jquery2.default)('.email');
				(0, _jquery2.default)('.login_phon').on('click', function () {

					if ((0, _jquery2.default)(this).hasClass('s1')) {
						$s1.hide();
						$s2.show();
						(0, _jquery2.default)(".gui").removeClass("guides");
						(0, _jquery2.default)(".login_but").html("登&#x3000;录");
					}

					if ((0, _jquery2.default)(this).hasClass('s2')) {
						$s2.hide();
						$s1.show();
						(0, _jquery2.default)(".gui").removeClass("guides");
						(0, _jquery2.default)(".login_but").html("登&#x3000;录");
					}
				});

				(0, _jquery2.default)('.login_but').on('click', function () {
					if ((0, _jquery2.default)(this).hasClass('s1')) {
						_this.S1_Submit();
					}

					if ((0, _jquery2.default)(this).hasClass('s2')) {
						_this.S2_Submit();
					}
				});

				$s2.find('.ident').on('click', function () {
					if ((0, _jquery2.default)(this).hasClass('disable')) {
						return false;
					}
					_this.Code();
				});
				(0, _jquery2.default)(".phon .bind").on("click", function () {
					(0, _jquery2.default)(this).find("label").toggleClass("labels");
				});
				(0, _jquery2.default)(".email .bind").on("click", function () {
					(0, _jquery2.default)(this).find("label").toggleClass("labels");
				});
				//导游登录
				(0, _jquery2.default)(".gui").on("click", function () {
					(0, _jquery2.default)(this).addClass("guides");
					if ((0, _jquery2.default)(".gui").hasClass("guides")) {
						$s1.hide();
						$s2.show();
						(0, _jquery2.default)(".login_but").html("导 游 登 录");
					}
				});
				if (_global2.default.GetUrlPara('guide') == 'guide') {
					(0, _jquery2.default)(".gui").addClass("guides");
					$s1.hide();
					$s2.show();
					(0, _jquery2.default)(".login_but").html("导 游 登 录");
				} else {
					$s1.show();
					$s2.hide();
					(0, _jquery2.default)(".gui").removeClass("guides");
					(0, _jquery2.default)(".login_but").html("登&#x3000;录");
				}
			}
		}, {
			key: 'Code',
			value: function Code() {
				var $s2 = (0, _jquery2.default)('.email');
				var phone = _jquery2.default.trim($s2.find('input.username').val());

				if (!_global2.default.RegEx.Tel(phone)) {
					_global2.default.Popup.Tip('请输入手机号');
					return false;
				}
				$s2.find('.ident').addClass('disable');
				if ((0, _jquery2.default)(".gui").hasClass("guides")) {
					var guide = '1';
				} else {
					var guide = '0';
				}
				_global2.default.Ajax({
					url: '/front/b2b/user/sendcheckcode',
					type: 'get',
					data: {
						phone: phone,
						guide: guide
					},
					success: function success(res) {
						if (res.code == 200) {
							_global2.default.TimeDown(60, function (t) {
								$s2.find('.ident').text(t + '秒');
							}, function () {
								$s2.find('.ident').text('获取验证码');
								$s2.find('.ident').removeClass('disable');
							});
						}
					}
				});
			}
		}, {
			key: 'S1_Submit',
			value: function S1_Submit() {
				var $s1 = (0, _jquery2.default)('.phon');
				var uname = _jquery2.default.trim($s1.find('input.username').val()),
				    upass = _jquery2.default.trim($s1.find('input.password').val());

				if (!uname) {
					_global2.default.Popup.Tip('请输入正确的用户名');
					return false;
				}

				if (!_global2.default.RegEx.Password(upass)) {
					_global2.default.Popup.Tip('请输入正确的密码');
					return false;
				}
				var bind_wechat = '';
				if ((0, _jquery2.default)(".phon .bind label").hasClass("labels")) {
					bind_wechat = '1';
				} else {
					bind_wechat = '0';
				}
				_global2.default.Ajax({
					url: '/user/mobileLogin',
					type: 'post',
					data: {
						"uname": uname, //必填
						"upass": upass, //必填
						"bind_wechat": bind_wechat
					},
					success: function success(res) {
						if (res.code == 200) {
							_global2.default.Cookie.Add('city_code', res.data.org_city_code);
							_global2.default.Cookie.Add('city_name', res.data.org_city);
							if (_global2.default.GetUrlPara('ty') == 'detail') {
								window.location.href = (0, _jquery2.default)("#url_referer").val();
							} else {
								window.location.href = "index.html";
							}
						}
					}
				});
			}
		}, {
			key: 'S2_Submit',
			value: function S2_Submit() {
				var $s2 = (0, _jquery2.default)('.email');
				var url = '';
				var u_mobile = _jquery2.default.trim($s2.find('input.username').val()),
				    u_code = _jquery2.default.trim($s2.find('input.ncode').val());

				if (!_global2.default.RegEx.Tel(u_mobile)) {
					_global2.default.Popup.Tip('请输入正确的手机号码');
					return false;
				}

				if (!u_code) {
					_global2.default.Popup.Tip('请输入验证码');
					return false;
				}
				var bind_wechat = '';
				if ((0, _jquery2.default)(".email .bind label").hasClass("labels")) {
					bind_wechat = '1';
				} else {
					bind_wechat = '0';
				}
				if ((0, _jquery2.default)(".gui").hasClass("guides")) {
					url = '/b2b/User/guide_login';
				} else {
					url = '/user/mobileLogin';
				}
				_global2.default.Ajax({
					url: url,
					type: 'post',
					data: {
						uname: u_mobile,
						u_code: u_code,
						bind_wechat: bind_wechat
					},
					success: function success(res) {
						if (res.code == 200) {
							if ((0, _jquery2.default)(".gui").hasClass("guides")) {
								window.location.href = "guide_list.html";
								return false;
							} else {
								_global2.default.Cookie.Add('city_code', res.data.org_city_code);
								_global2.default.Cookie.Add('city_name', res.data.org_city);
							}
							if (_global2.default.GetUrlPara('ty') == 'detail') {
								window.location.href = (0, _jquery2.default)("#url_referer").val();
							} else {
								window.location.href = "index.html";
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

/***/ 110:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});