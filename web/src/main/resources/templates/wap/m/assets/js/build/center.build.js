webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(94);

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
	        _global2.default.GetCityCode(function (citycode) {
	            _this.citycode = citycode;
	            _this.UserInfo();
	        });
	    }

	    (0, _createClass3.default)(Index, [{
	        key: 'UserInfo',
	        value: function UserInfo() {
	            var _this = this;
	            var order_type = _global2.default.GetUrlPara('order_type');

	            if (!(_uinfo && _uinfo.u_id)) {
	                window.location.href = 'login.html?ty=detail';
	            } else {
	                if (_uinfo.org_type == '分销商' && order_type == 'seller') {
	                    window.location.href = 'center.html?order_type=buyer';
	                }
	                if (_uinfo.org_type != '分销商' && order_type == '') {
	                    window.location.href = 'center.html?order_type=seller';
	                } else if (_uinfo.org_type == '分销商' && order_type == '') {
	                    window.location.href = 'center.html?order_type=buyer';
	                }
	                var html = (0, _artTemplate2.default)('tpl-userinfo', _uinfo);
	                (0, _jquery2.default)('.main').html(html);
	                if (order_type == 'seller') {
	                    (0, _jquery2.default)('.bg').addClass('seller').removeClass('buyer');
	                    (0, _jquery2.default)('.seller_c').show();
	                    (0, _jquery2.default)('.buyer_c').hide();
	                    (0, _jquery2.default)('.go a').attr('href', 'center.html?order_type=buyer');
	                } else if (order_type == 'buyer') {
	                    (0, _jquery2.default)('.bg').addClass('buyer').removeClass('seller');
	                    (0, _jquery2.default)('.go a').html('进入卖家中心');
	                    (0, _jquery2.default)('.go a').attr('href', 'center.html?order_type=seller');
	                    (0, _jquery2.default)('.seller_c').hide();
	                    (0, _jquery2.default)('.buyer_c').show();
	                }
	                if (share_user) {
	                    (0, _jquery2.default)(".img img").attr("src", share_user.u_face);
	                }
	            }

	            if (_uinfo && _uinfo.u_id) {
	                if (_uinfo.org_type != '供应商' && _uinfo.org_type != '管理公司') {
	                    (0, _jquery2.default)(".detail .go").css("display", "none");
	                }
	            }
	            // 导游信息
	            // if(_guide.g_name && _guide.g_mob){
	            //     $(".guidese").css("display","");
	            // }

	            (0, _jquery2.default)(".cike").on("click", function () {
	                console.log("test");
	                _popup2.default.Info('是否确定切换账户！');
	                _this.Ht();
	            });
	        }
	    }, {
	        key: 'Ht',
	        value: function Ht() {
	            var html = '<div class="lesse">取消</div><div class="yer">确定</div>';
	            (0, _jquery2.default)("#popup-info").append(html);
	            (0, _jquery2.default)(".yer").on("click", function () {
	                _global2.default.Ajax({
	                    url: '/user/mobileLogout',
	                    type: 'post',
	                    data: {},
	                    success: function success(res) {
	                        window.location.href = '/wap/m/login.html';
	                    }
	                });
	            });
	            (0, _jquery2.default)(".lesse").on("click", function () {
	                _popup2.default.PopupRemove();
	            });
	        }
	    }]);
	    return Index;
	}();

	_userinfo2.default.Ready(function () {
	    new Index();
	});

/***/ }),

/***/ 94:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});