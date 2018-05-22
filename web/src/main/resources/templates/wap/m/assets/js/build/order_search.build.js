webpackJsonp([34],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(128);

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

	        _global2.default.GetCityCode(function (citycode) {
	            _this.citycode = citycode;
	            _this.Enter();
	        });
	    }

	    (0, _createClass3.default)(Index, [{
	        key: 'Enter',
	        value: function Enter() {
	            var _this = this;
	            // $('input').on('keydown',function(e) {
	            // 	if( 13 == e.keyCode) {
	            // 		_this.Render();
	            // 	}

	            // });

	            (0, _jquery2.default)(".inp input").on('input propertychange', function () {
	                if (!(0, _jquery2.default)('body').hasClass('scrolling')) {
	                    _this.Render();
	                }
	                var key = (0, _jquery2.default)('input').val();
	            });

	            (0, _jquery2.default)('.go-back a.left').on('click', function () {
	                history.go(-1);
	            });
	        }
	    }, {
	        key: 'Render',
	        value: function Render() {
	            var _this = this;
	            var key = (0, _jquery2.default)('input').val();
	            (0, _jquery2.default)('body').addClass('scrolling');
	            _global2.default.Ajax({
	                // url : '/h5/shop/search_order_keyword',
	                url: '/front/order/m/searchOrderList',
	                type: 'post',
	                data: {
	                    key: key
	                },
	                success: function success(res) {
	                    if (res.code == 200) {
	                        var order_type = _global2.default.GetUrlPara('order_type');
	                        res['order_type'] = order_type;
	                        var html = (0, _artTemplate2.default)('tpl-search', res);
	                        if (res.data.length != 0) {
	                            (0, _jquery2.default)('.detail').html(html);
	                        } else {
	                            (0, _jquery2.default)('.detail').html('<li class="no-infor">暂无数据</li>');
	                        }
	                        (0, _jquery2.default)('body').removeClass('scrolling');
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

/***/ 128:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});