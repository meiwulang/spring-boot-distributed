webpackJsonp([36],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(130);

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
	    _this.pages = {
	      total: 0,
	      count: 1
	    };
	    _this.orderId = null;
	    _global2.default.GetCityCode(function (citycode) {
	      _this.citycode = citycode;
	      _this.Render(1);
	      _this.Scrollload();
	    });
	  }

	  (0, _createClass3.default)(Index, [{
	    key: 'Render',
	    value: function Render(currpage) {
	      var _this = this;
	      var no = _global2.default.GetUrlPara('n');
	      var order_type = _global2.default.GetUrlPara('order_type');
	      (0, _jquery2.default)('body').addClass('scrolling');
	      //  获取编辑游客信息
	      _global2.default.Ajax({
	        url: '/Order/getTourists',
	        data: {
	          orderId: _global2.default.GetUrlPara('otid'),
	          pageNo: currpage,
	          pageSize: 10
	        },
	        success: function success(res) {
	          if (res.code == 0) {
	            var data = res.body.body;
	            var html = (0, _artTemplate2.default)('tpl-order', data);
	            _this.pages.total = data.totalNum;
	            _this.orderId = data.resultList[0].otOrderId;
	            // $('#wrap').html(html);
	            (0, _jquery2.default)(".loading").remove();
	            (0, _jquery2.default)('.tourist-info-con').append(html);
	            (0, _jquery2.default)('body').removeClass('scrolling');
	            _this.Event();
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

	      (0, _jquery2.default)('.t-bar a.left').on('click', function () {
	        window.history.back();
	      });
	      //用户信息保存
	      (0, _jquery2.default)(".ul-info .saveBtn").on("click", function () {
	        var name = _jquery2.default.trim((0, _jquery2.default)(this).parent().find('input.name').val()),
	            tel = _jquery2.default.trim((0, _jquery2.default)(this).parent().find('input.tel').val()),
	            card_type = _jquery2.default.trim((0, _jquery2.default)(this).parent().find('select.card_type').val()),
	            card_no = _jquery2.default.trim((0, _jquery2.default)(this).parent().find('input.card_no').val()),
	            uid = (0, _jquery2.default)(this).parent().attr('uid');
	        if (!name) {
	          _global2.default.Popup.Tip('请填写姓名');
	          return false;
	        }

	        if (!_global2.default.RegEx.Tel(tel)) {
	          _global2.default.Popup.Tip('请填写正确的手机号码');
	          return false;
	        }
	        if (card_type == 0 && card_no) {
	          var rst = _global2.default.RegEx.CardChk(card_no);
	          //验证失败
	          if (rst.start == 0) {
	            _global2.default.Popup.Tip(rst.info);
	            return false;
	          }
	        }
	        if (card_type == 1 && card_no) {
	          if (!_global2.default.RegEx.Passport(card_no)) {
	            _global2.default.Popup.Tip("请填写正确护照信息！");
	            return false;
	          }
	        }
	        _global2.default.Ajax({
	          url: '/Order/saveTourist',
	          type: 'post',
	          data: {
	            otName: name,
	            otPhone: tel,
	            otLicenceType: card_type,
	            otLincese: card_no,
	            otOrderId: _this.orderId,
	            id: uid
	          },
	          success: function success(res) {
	            if (res.code == 0) {
	              _global2.default.Popup.Tip("游客信息编辑成功！");
	            } else {
	              _global2.default.Popup.Tip("游客信息编辑失败！");
	            }
	          }

	        });
	      });
	    }
	    //  下拉加载数据列表

	  }, {
	    key: 'Scrollload',
	    value: function Scrollload() {
	      var _this = this;
	      console.log("下拉加载");
	      (0, _jquery2.default)(window).scroll(function () {
	        var scrollTop = (0, _jquery2.default)(this).scrollTop();
	        var scrollHeight = (0, _jquery2.default)(document).height();
	        var windowHeight = (0, _jquery2.default)(this).height();
	        if (scrollTop + windowHeight == scrollHeight) {
	          // 获取page数,并判断是否是最后一页	
	          if (_this.pages.total > _this.pages.count * 10) {
	            if (!(0, _jquery2.default)('body').hasClass('scrolling')) {
	              _this.Render(++_this.pages.count);
	              (0, _jquery2.default)(".tourist-info-con").append('<div class="loading">加载中...</div>');
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

/***/ 130:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});