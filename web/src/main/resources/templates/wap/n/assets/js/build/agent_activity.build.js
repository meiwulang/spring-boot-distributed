webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/agent_activity.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _common = __webpack_require__("./assets/js/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	var _pubs = __webpack_require__("./assets/js/develop/agent_activity/pubs.js");

	var _pubs2 = _interopRequireDefault(_pubs);

	var _index = __webpack_require__("./assets/js/develop/agent_activity/index.js");

	var _index2 = _interopRequireDefault(_index);

	var _company = __webpack_require__("./assets/js/develop/agent_activity/company.js");

	var _company2 = _interopRequireDefault(_company);

	var _department = __webpack_require__("./assets/js/develop/agent_activity/department.js");

	var _department2 = _interopRequireDefault(_department);

	var _person = __webpack_require__("./assets/js/develop/agent_activity/person.js");

	var _person2 = _interopRequireDefault(_person);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Routes = {
	    index: _index2.default,
	    company: _company2.default,
	    department: _department2.default,
	    person: _person2.default
	};

	var App = {
	    init: function init() {
	        var _this = this;

	        this.render();
	        this.refreshHref();
	        this.refreshStyle();
	        _pubs2.default.initEvent();
	        this.navigation();
	        (0, _jquery2.default)(window).on('hashchange', function () {
	            _this.refreshHref();
	            _this.refreshStyle();
	            _this.navigation();
	        });
	    },
	    render: function render() {
	        _pubs2.default.renderTime();
	    },
	    refreshHref: function refreshHref() {
	        var param = location.hash ? location.hash.split('/')[1] : null;
	        param = param ? '/' + param : '';
	        (0, _jquery2.default)('#header').find('.ul-bag li').each(function () {
	            var self = (0, _jquery2.default)(this);
	            var page = self.find('a').data('page');
	            self.find('a').attr('href', '#' + page + param);
	        });
	    },
	    refreshStyle: function refreshStyle() {
	        _pubs2.default.refreshTimeStyle();
	    },
	    navigation: function navigation() {
	        var Page = Routes[_pubs2.default.getPath()[1]];
	        (0, _jquery2.default)(window).scrollTop(0);
	        Page ? Page.init() : Routes.index.init();
	    }
	};

	_common2.default.Ready(function () {
	    App.init();
	});

/***/ }),

/***/ "./assets/js/develop/agent_activity/person.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__("./node_modules/babel-runtime/helpers/extends.js");

	var _extends3 = _interopRequireDefault(_extends2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	var _pubs = __webpack_require__("./assets/js/develop/agent_activity/pubs.js");

	var _pubs2 = _interopRequireDefault(_pubs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render() {
	    _global2.default.GetTpl({
	        url: '/agent_activity/index.tpl',
	        data: {},
	        success: function success(tpl) {
	            (0, _jquery2.default)('#content').html(tpl);
	            renderTable();
	        }
	    });
	}

	function renderTable() {
	    var _pubs$getAjaxParam = _pubs2.default.getAjaxParam(),
	        timeType = _pubs$getAjaxParam.timeType,
	        start = _pubs$getAjaxParam.start;

	    var salesManagerId = _pubs2.default.getQuery('id');
	    var salesManagerName = _pubs2.default.getQuery('name') || '';
	    _global2.default.Ajax({
	        url: '/agentActivityStatistics/queryAgentActivityBySalesManager.htm',
	        type: 'post',
	        data: {
	            queryMonth: start,
	            salesManagerId: salesManagerId
	        },
	        success: function success(res) {
	            if (res.code == 0) {
	                var resData = res.body;
	                var list = (resData.list || []).map(function (item) {
	                    return (0, _extends3.default)({}, item);
	                });
	                var summary = resData.summary || {};
	                (0, _jquery2.default)('#table_title').text(salesManagerName + '\u603B\u4EE3\u7406' + (summary.totalAgentNums || 0) + '\u4EBA');
	                _global2.default.GetTpl({
	                    url: '/agent_activity/person_table.tpl',
	                    data: {
	                        list: list,
	                        summary: summary
	                    },
	                    success: function success(tpl) {
	                        (0, _jquery2.default)('#table-contanier').html(tpl);
	                    }
	                });
	            } else {
	                _popup2.default.Tip(res.message);
	            }
	        }
	    });
	}

	function initEvent() {
	    _pubs2.default.initTimeEvent(renderTable);
	}

	function init() {
	    render();
	    initEvent();
	}

	exports.default = {
	    init: init
	};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent_activity.less":
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
	// imports


	// module
	exports.push([module.id, "/*\n\tauthor : zhupinglei,\n\tdesc : 浏览器重置\n*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  -webkit-user-select: none;\n  /* 禁止选中文本（如无文本选中需求，此为必选项） */\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  background-color: #f3f5f9;\n}\nbody div,\nbody dl,\nbody dt,\nbody dd,\nbody ul,\nbody ol,\nbody li,\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5,\nbody h6,\nbody pre,\nbody form,\nbody fieldset,\nbody input,\nbody p,\nbody a,\nbody blockquote,\nbody th,\nbody i,\nbody u,\nbody span {\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\nbody ol,\nbody ul {\n  list-style: none;\n}\nbody u,\nbody i {\n  font-weight: normal;\n  font-style: normal;\n}\nbody a {\n  color: #333;\n  text-decoration: none;\n}\nbody a,\nbody img {\n  -webkit-touch-callout: none;\n  /* 禁止长按链接与图片弹出菜单 */\n}\nbody input,\nbody select,\nbody button,\nbody textarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -o-appearance: none;\n  border: none;\n  background-color: #fff;\n  margin: 0;\n  padding: 0;\n  resize: none;\n  outline: none;\n  border-radius: 0;\n}\nbody table {\n  border-collapse: collapse;\n  border-spacing: 0px;\n}\nbody .clearfix {\n  *zoom: 1;\n}\nbody .clearfix:after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  visibility: hidden;\n  content: \".\";\n}\nbody {\n  background-color: #f3f5f9;\n}\n/*----------用来移除向下箭头----------*/\n/*input[type=\"date\"]::-webkit-calendar-picker-indicator {\n   display: none;\n}*/\n/*----------用来移除叉叉按钮----------*/\n/*input[type=\"date\"]::-webkit-clear-button{\n   display:none;\n}*/\n#popup-loading {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -30px;\n  margin-top: -50px;\n  z-index: 100;\n  background: url(" + __webpack_require__("./assets/img/loading.gif") + ") center center no-repeat;\n  background-size: 30px 30px;\n  background-color: rgba(255, 255, 255, 0.6);\n  border-radius: 10px;\n}\n#popup-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.1);\n  z-index: 99;\n}\n#popup-tip {\n  width: 180px;\n  line-height: 16px;\n  color: #fff;\n  background-color: #000000;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -105px;\n  margin-top: -30px;\n  z-index: 100;\n  text-align: center;\n}\n#popup-info {\n  word-wrap: break-word;\n  width: 200px;\n  line-height: 20px;\n  color: #333;\n  background-color: #fff;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 30%;\n  margin-left: -115px;\n  z-index: 100;\n  box-shadow: 0px 0px 2px #ccc;\n}\n#popup-info .popup-confirm .popup-content {\n  height: 100px;\n  background: url(" + __webpack_require__("./assets/img/guide/warr.png") + ") center 30% no-repeat;\n  background-size: 52px auto;\n}\n#popup-info .popup-confirm .popup-content .popup-txt {\n  position: relative;\n  top: 80px;\n  text-align: center;\n}\n#popup-info .popup-confirm .popup-foot {\n  position: relative;\n  height: 43px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel,\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  line-height: 43px;\n  font-size: 14px;\n  text-align: center;\n  height: 43px;\n  width: 57%;\n  position: absolute;\n  box-sizing: border-box;\n  bottom: -16px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel {\n  color: #666;\n  left: -15px;\n  border-top: 1px solid #e7e7e7;\n}\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  color: #fff;\n  background: #fc2a35;\n  right: -15px;\n}\n#wrap #agent_activity {\n  padding-bottom: 50px;\n  box-sizing: border-box;\n}\n#wrap #agent_activity .acti_header {\n  height: 40px;\n  font-size: 14px;\n  width: 100%;\n  margin-bottom: 2px;\n  position: relative;\n  z-index: 5;\n}\n#wrap #agent_activity .screen {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n  z-index: -1;\n  opacity: 0;\n}\n#wrap #agent_activity .screen .sha {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 50px;\n  width: 100vw;\n}\n#wrap #agent_activity .screen .son {\n  padding-top: 12px;\n  padding-right: 15px;\n  box-sizing: border-box;\n  width: 100vh;\n  height: 100vw;\n  background-color: #fff;\n  transform: rotate(0deg);\n  -webkit-transform: rotate(0deg);\n  -moz-transform: rotate(0deg);\n  -o-transform: rotate(0deg);\n  transition: all 0.3s ease-in-out;\n  -webkit-transition: all 0.3s ease-in-out;\n  -moz-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transform-origin: 50vw 50vw;\n}\n#wrap #agent_activity .screen .son .ave {\n  width: 100%;\n  height: 100%;\n}\n#wrap #agent_activity .screen .clear {\n  color: #fff;\n  text-align: center;\n  line-height: 30px;\n  font-size: 25px;\n  background-color: rgba(0, 0, 0, 0.4);\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  position: fixed;\n  top: 15px;\n  right: 30px;\n}\n#wrap #agent_activity .screen.active {\n  opacity: 1;\n  z-index: 99;\n}\n#wrap #agent_activity .screen.active .son {\n  transform: rotate(90deg);\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n}\n#wrap #agent_activity .count {\n  position: relative;\n  width: 100%;\n  height: 290px;\n  /*background-color: #fff;*/\n  box-sizing: border-box;\n  padding: 15px;\n  padding-top: 10px;\n  background-color: rgba(255, 255, 255, 0);\n}\n#wrap #agent_activity .count .time {\n  width: 100%;\n  height: 30px;\n  box-sizing: border-box;\n  border-bottom: 1px solid #e7e7e7;\n  line-height: 30px;\n  overflow: hidden;\n  font-size: 10px;\n  color: #999;\n}\n#wrap #agent_activity .count .time h2 {\n  font-size: 10px;\n  height: 100%;\n  width: 70px;\n  float: left;\n}\n#wrap #agent_activity .count .time .day {\n  margin-left: 70px;\n  text-align: right;\n  overflow: hidden;\n}\n#wrap #agent_activity .count .shade {\n  position: absolute;\n  width: 100vw;\n  height: 208px;\n  top: 42px;\n  left: 0;\n}\n#wrap #agent_activity .count .char {\n  height: 260px;\n}\n#wrap #agent_activity .count.disable {\n  visibility: hidden;\n}\n#wrap #agent_activity .record {\n  background-color: #fff;\n}\n#wrap #agent_activity .record .switch {\n  height: auto;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 5px 0 12px;\n  background: -webkit-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Safari 5.1 - 6.0 */\n  background: -o-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Opera 11.1 - 12.0 */\n  background: -moz-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Firefox 3.6 - 15 */\n  background: linear-gradient(180deg, #6186f8, #5266e1);\n}\n#wrap #agent_activity .record .switch .ul-bag {\n  padding: 0 10px;\n}\n#wrap #agent_activity .record .switch .ul-bag ul {\n  border-radius: 6px;\n  border: 1px solid #fff;\n  overflow: hidden;\n  height: 34px;\n  display: flex;\n  display: -webkit-flex;\n}\n#wrap #agent_activity .record .switch .ul-bag ul li {\n  flex: 1;\n  font-size: 12px;\n  color: #fff;\n  height: 100%;\n  text-align: center;\n  float: left;\n  box-sizing: border-box;\n  border-right: 1px solid #fff;\n}\n#wrap #agent_activity .record .switch .ul-bag ul li a {\n  display: inline-block;\n  height: 100%;\n  width: 100%;\n  line-height: 34px;\n  color: #fff;\n}\n#wrap #agent_activity .record .switch .ul-bag ul li:last-child {\n  border-right: none ;\n}\n#wrap #agent_activity .record .switch .ul-bag ul li.active {\n  background-color: #fff;\n  color: #5575e2;\n}\n#wrap #agent_activity .record .switch .ul-bag ul li.active a {\n  color: #5575e2;\n}\n#wrap #agent_activity .record .mation-txt {\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n}\n#wrap #agent_activity .record .tato {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n  background-color: #fff;\n  border-top: 1px solid #e7e7e7;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: flex-start;\n}\n#wrap #agent_activity .record .tato .sum {\n  background-color: #587de5;\n  font-size: 14px;\n  color: #fff;\n  line-height: 52px;\n  width: 80px;\n}\n#wrap #agent_activity .record .tato .col {\n  flex: 1;\n  padding: 5px 0 5px 36px;\n}\n#wrap #agent_activity .record .tato .col p {\n  font-size: 16px;\n  color: #333;\n  line-height: 20px;\n  text-align: left;\n}\n#wrap #agent_activity .record .tato .col p.grey-font {\n  font-size: 12px;\n  color: #999;\n  line-height: 20px;\n}\n#wrap #agent_activity .record .count {\n  border-bottom: 0;\n  padding-bottom: 10px;\n}\n#wrap #agent_activity .record .tab-wrap {\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 0 10px #ddd;\n  position: relative;\n  left: 0;\n  top: -20px;\n  background-color: #fff;\n}\n#wrap #agent_activity .record .tab-wrap div.tab {\n  flex: 1;\n  padding: 10px 0;\n  border-bottom: 2px solid #ffffff;\n  text-align: center;\n  position: relative;\n  box-sizing: border-box;\n}\n#wrap #agent_activity .record .tab-wrap div.tab.active {\n  color: #587de5;\n}\n#wrap #agent_activity .record .tab-wrap div.tab:after {\n  display: block;\n  content: '';\n  position: absolute;\n  right: -1px;\n  top: 10px;\n  height: 18px;\n  width: 1px;\n  border-right: 2px dotted #e1e1e1;\n}\n#wrap #agent_activity .record .tab-wrap div.tab:last-child:after {\n  border-right: 0;\n}\n#wrap #agent_activity .record .tab-bg {\n  height: 20px;\n  background-color: #f7f7f7;\n  margin-top: 20px;\n  padding: 0 10px;\n}\n#wrap #agent_activity .record .table-wrap {\n  background-color: #f7f7f7;\n}\n#wrap #agent_activity .record .table-wrap div.cont {\n  display: none;\n}\n#wrap #agent_activity .record .table-wrap table {\n  text-align: center;\n  border-collapse: collapse;\n  width: 100%;\n}\n#wrap #agent_activity .record .table-wrap table thead {\n  background-color: #f7f7f7;\n  border: 0;\n}\n#wrap #agent_activity .record .table-wrap table thead tr {\n  height: 40px;\n}\n#wrap #agent_activity .record .table-wrap table thead tr th {\n  font-size: 12px;\n  color: #999;\n}\n#wrap #agent_activity .record .table-wrap table thead tr th:first-child {\n  width: 10px;\n}\n#wrap #agent_activity .record .table-wrap table thead tr th:last-child {\n  width: 10px;\n}\n#wrap #agent_activity .record .table-wrap table thead tr th:nth-child(2) {\n  text-align: left;\n  padding-left: 6px;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr {\n  height: 46px;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr td {\n  font-size: 12px;\n  color: #333;\n  border-bottom: 5px solid #f7f7f7;\n  background-color: #fff;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr td a {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr td:first-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr td:last-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr td:nth-child(2) {\n  text-align: left;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr:last-child td {\n  border-bottom: none !important;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.border-bottom {\n  height: 36px;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.border-bottom td {\n  border-bottom: 1px solid #f7f7f7;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.border-bottom td:first-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.border-bottom td:last-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom {\n  height: 30px;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom td {\n  font-size: 10px;\n  color: #999;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom td.div-wrap {\n  position: relative;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap {\n  position: absolute;\n  left: 0;\n  top: 0;\n  line-height: 30px;\n  min-width: 350px;\n  height: 30px;\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span {\n  display: inline-block;\n  text-align: left;\n}\n#wrap #agent_activity .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span:first-child {\n  margin-right: 5px;\n  width: 150px;\n}\n#wrap #agent_activity .record .table-wrap .mation-txt {\n  background-color: #fff;\n}\n#wrap #agent_activity .record .table-index {\n  margin-top: 0;\n  padding-top: 0;\n}\n#wrap #agent_activity .record #content .data-null {\n  display: none;\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n  position: relative;\n  top: -280px;\n  z-index: 4;\n}\n#wrap #agent_activity .record #content table tr td.arrow-right a {\n  position: relative;\n}\n#wrap #agent_activity .record #content table tr td.arrow-right a:after {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  margin-top: -4px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #656565;\n  border-right: 1px solid #656565;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n#wrap #agent_activity .record .title {\n  margin: 0 10px;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  border-bottom: 1px solid #ddd;\n}\n#wrap #agent_activity .record .title h2 {\n  position: absolute;\n  left: 0;\n  top: -123px;\n  height: 26px;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #agent_activity .record .title h2 a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  position: absolute;\n  right: -10px;\n  top: -5px;\n  z-index: 11;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #agent_activity .record .title h2 span.bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n}\n#wrap #agent_activity .record .title h2 span.bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #agent_activity .record .tim {\n  font-size: 14px;\n  color: #ff2d55;\n}\n#wrap #agent_activity .record .tim label {\n  display: block;\n}\n#wrap #agent_activity .record .tim input {\n  width: 100%;\n  color: #5575e2;\n  text-align: right;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") 85% no-repeat;\n  background-size: 11px 6px;\n  margin-left: -20px;\n  font-size: 14px;\n}\n#wrap #agent_activity .record .tim div.active {\n  display: block;\n}\n#wrap #agent_activity .record .tim div.day {\n  margin-right: -10px;\n}\n#wrap #agent_activity .record .tim div.day input {\n  width: 140px;\n}\n#wrap #agent_activity .record .tim div.month {\n  margin-right: -20px;\n}\n#wrap #agent_activity .record .tim div.month input {\n  width: 105px;\n}\n#wrap #agent_activity .record .tim div.year select {\n  direction: rtl;\n}\n#wrap #agent_activity .record .tim select {\n  padding-right: 16px;\n  color: #5575e2;\n  font-size: 14px;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") right no-repeat;\n  background-size: 11px 6px;\n  width: 100%;\n  height: 20px;\n  line-height: 20px;\n}\n#wrap #agent_activity .record .date-wrap {\n  margin: 0 10px;\n}\n#wrap #agent_activity .record .date-wrap .tim div {\n  display: none;\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 !important;\n}\n#wrap #agent_activity .record .date-wrap .tim div input {\n  margin: 0 !important;\n  text-align: left;\n}\n#wrap #agent_activity .record .date-wrap .tim div select {\n  width: auto;\n}\n#wrap #agent_activity .record .date-wrap .tim div.active {\n  display: block;\n}\n#wrap #agent_activity .record .date-wrap .tim div.day input {\n  width: 132px;\n}\n#wrap #agent_activity .record .date-wrap .tim div.day span {\n  vertical-align: top;\n  display: inline-block;\n  color: #5575e2;\n  padding-right: 10px;\n}\n#wrap #agent_activity .record .title_header {\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #agent_activity .record .title_header a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #agent_activity .record .title_header .bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n  position: relative;\n  margin-left: 10px;\n}\n#wrap #agent_activity .record .title_header .bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #agent_activity .record .no-tab .table-wrap {\n  padding-top: 2px;\n}\n#wrap #agent_activity .record {\n  margin-top: 0;\n  /*.switch{\n          box-shadow: 0px 3px 4px #f2f2f2;\n      }*/\n}\n#wrap #agent_activity .record .count {\n  position: relative;\n  width: 100%;\n  height: 445px;\n  background-color: rgba(255, 255, 255, 0);\n  box-sizing: border-box;\n  padding: 10px 15px 0 15px;\n}\n#wrap #agent_activity .record .count .char {\n  height: 435px;\n}\n#wrap #agent_activity .record thead tr th {\n  background-color: #fafafa;\n}\n#wrap #agent_activity .record tbody tr:last-child td {\n  border-bottom: none!important;\n}\n#wrap #agent_activity .record tbody td:last-child {\n  width: 15px;\n  border-bottom: none!important;\n}\n#wrap #agent_activity .record tbody tr.tr-bottom td.div-wrap .wrap {\n  min-width: auto!important;\n}\n#wrap #agent_activity .record tbody tr td a span {\n  box-sizing: border-box;\n  padding-top: 1px;\n  overflow: hidden;\n  display: inline-block;\n  width: 100%;\n  max-height: 30px;\n}\n#wrap #agent_activity .record .tato .sum {\n  margin-right: 5px;\n}\n#wrap #agent_activity .record .tato .col {\n  padding-left: 5px;\n}\n#wrap #agent_activity .record .table-title {\n  padding: 6px 0 8px 12px;\n}\n", ""]);

	// exports


/***/ }),

/***/ "./assets/img/home.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./assets/img/jt.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAANCAYAAACtpZ5jAAABSElEQVQ4jZXTsUsbYRzG8U8u4uCgk8vh6Kqrk0vBRWygdUo6OjmI3RS5zbRIlw4V9A8IF0FxSImL4K4gCK6O1sXJxaEQ6vC+oUdMonng4OD5vd/7vQ/Plaq7f37gA55Rw70RlGcpqNUfZpBjAucJvmESiziJxkiq1R+mcBYZ49hL8IRlPGIBTZRHgJZxjDnhtst5lj4l0b/DRyGOCn6OsPAvLMWzq3mW3kNSGLjEGv5hA+vvgG7HuQ6qeZZedY2kZ/AIO4VNKkOgn/A9vn/Ns7RVNHvBsIdDIecm5vvMLKCBEg7yLN3vHegHhk1cCA1pY6bgzeJ39FpCbK80CPwXn3EboWeYis8ppnEj5NrpBxgbAOZ/Da+FKjXilt1adVvUV8PAIqAixLLS88Ghf+igKIq6RFWoVAdfhIiG6q2Nu2phS7h6+z0HXgAJd0wdyE/Y8AAAAABJRU5ErkJggg=="

/***/ }),

/***/ "./assets/js/develop/agent_activity/pubs.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray2 = __webpack_require__("./node_modules/babel-runtime/helpers/slicedToArray.js");

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getPath() {
	    var sp = '/';
	    var ret = void 0;
	    var hash = window.location.hash;
	    if (hash) {
	        hash = hash.slice(hash.charAt(1) === sp ? 2 : 1);
	        var index = hash.indexOf('?');
	        ret = hash.slice(0, index !== -1 ? index : hash.length).split(sp);
	    }
	    return ret || [];
	}
	function getQuery(key) {
	    var ret = {};
	    var hash = window.location.hash;
	    if (hash) {
	        var index = hash.indexOf('?');
	        if (index !== -1) {
	            hash.slice(index + 1).split('&').forEach(function (value) {
	                if (value) {
	                    var arr = value.split('=');
	                    if (arr[0]) {
	                        ret[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
	                    }
	                }
	            });
	        }
	    }
	    return key ? ret[key] : ret;
	}
	function getTimeParam(timeType) {
	    var $container = _date_new2.default.container;
	    var start = '';
	    var end = '';
	    var value = '';
	    switch (timeType) {
	        case 'total':
	            break;
	        case 'day':
	            value = start = _jquery2.default.trim($container.find('.day input.start').val());
	            end = _jquery2.default.trim($container.find('.day input.end').val());
	            break;
	        case 'week':
	            var selectedWeek = $container.find('.week select option:selected');

	            var _MyDate$getSelectStar = _date_new2.default.getSelectStartEnd(selectedWeek);

	            start = _MyDate$getSelectStar.start;
	            end = _MyDate$getSelectStar.end;
	            value = _MyDate$getSelectStar.value;

	            break;
	        case 'month':
	            value = _jquery2.default.trim($container.find('.month input').val());
	            start = value + '-01';
	            break;
	        case 'season':
	            var selectedSeason = $container.find('.season select option:selected');

	            var _MyDate$getSelectStar2 = _date_new2.default.getSelectStartEnd(selectedSeason);

	            start = _MyDate$getSelectStar2.start;
	            end = _MyDate$getSelectStar2.end;
	            value = _MyDate$getSelectStar2.value;

	            break;
	        case 'year':
	            var selectedYear = $container.find('.year select option:selected');

	            var _MyDate$getSelectStar3 = _date_new2.default.getSelectStartEnd(selectedYear);

	            start = _MyDate$getSelectStar3.start;
	            end = _MyDate$getSelectStar3.end;
	            value = _MyDate$getSelectStar3.value;

	            break;
	        default:
	            break;
	    }
	    return { start: start, end: end, value: value };
	}
	function getTimeType() {
	    return getPath()[0] || 'total';
	}
	function renderTime() {
	    var totalHtml = '<div class="total active" style="display: none"></div>';
	    var monthHtml = _date_new2.default.month();
	    _date_new2.default.container.html(totalHtml + monthHtml);
	}
	exports.default = {
	    getPath: getPath,
	    getQuery: getQuery,
	    getTimeType: getTimeType,
	    getAjaxParam: function getAjaxParam() {
	        var timeType = getTimeType();
	        var timeParam = getTimeParam(timeType) || {};
	        var tabType = (0, _jquery2.default)('.tab-wrap').find('.active').data('type');
	        return {
	            timeType: timeType,
	            tabType: tabType,
	            start: timeParam.start,
	            end: timeParam.end,
	            value: timeParam.value
	        };
	    },

	    renderTime: renderTime,
	    refreshTimeStyle: function refreshTimeStyle() {
	        var timeType = getTimeType();
	        //tab-head
	        (0, _jquery2.default)('#header').find('.ul-bag li').each(function () {
	            var $this = (0, _jquery2.default)(this);
	            var href = $this.find('a').attr('href');
	            href = href.split('#')[1];
	            href = href.split('/')[0];
	            if (href === timeType) {
	                $this.addClass('active').siblings('li').removeClass('active');
	            }
	        });
	        //tab-content
	        _date_new2.default.container.find('.' + timeType).addClass('active').siblings('div').removeClass('active');
	        if (!location.hash) {
	            (0, _jquery2.default)('.date-wrap .tim .total').addClass('active').siblings('div').removeClass('active');
	        }
	    },
	    initEvent: function initEvent() {
	        /* 链接跳转，不要绑定事件，注释 */
	        /*$('#header').on('click','.ul-bag li',function(){
	            if (!$(this).is('.active')) {
	                $('.switch ul li').removeClass('active')
	                $(this).addClass('active')
	                renderTime()
	            }
	        })*/
	        //返回上一页
	        (0, _jquery2.default)('#content,.title_header').on('click', '.bg_ing', function () {
	            var _getPath = getPath(),
	                _getPath2 = (0, _slicedToArray3.default)(_getPath, 1),
	                timeType = _getPath2[0];

	            if (timeType) {
	                window.history.go(-1);
	            } else {
	                window.location.href = 'list.html';
	            }
	        });
	    },
	    initTimeEvent: function initTimeEvent(cb) {
	        cb = cb || _jquery2.default.noop;
	        (0, _jquery2.default)('.date-wrap').find('.tim').off().on('change', '.month input,select', function () {
	            cb();
	        }).on('change', '.day input.start', function () {
	            var $this = (0, _jquery2.default)(this);
	            var start = $this.val();
	            var end = $this.parent().find('input.end').val();
	            if (start > end) {
	                _popup2.default.Tip('开始日期不能晚于结束日期');
	            } else {
	                cb();
	            }
	        }).on('change', '.day input.end', function () {
	            var self = (0, _jquery2.default)(this);
	            var end = self.val();
	            var start = self.parent().find('input.start').val();
	            if (start > end) {
	                _popup2.default.Tip('开始日期不能晚于结束日期');
	            } else {
	                cb();
	            }
	        });
	    },
	    initTabEvent: function initTabEvent(cb) {
	        cb = cb || _jquery2.default.noop;
	        (0, _jquery2.default)('#content').off('click', '.tab-wrap .tab').on('click', '.tab-wrap .tab', function () {
	            (0, _jquery2.default)(this).addClass('active').siblings('.tab').removeClass('active');
	            cb();
	        });
	    }
	};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/slicedToArray.js":
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _isIterable2 = __webpack_require__("./node_modules/babel-runtime/core-js/is-iterable.js");

	var _isIterable3 = _interopRequireDefault(_isIterable2);

	var _getIterator2 = __webpack_require__("./node_modules/babel-runtime/core-js/get-iterator.js");

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if ((0, _isIterable3.default)(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/is-iterable.js":
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__("./node_modules/core-js/library/fn/is-iterable.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/core-js/library/fn/is-iterable.js":
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__("./node_modules/core-js/library/modules/web.dom.iterable.js");
	__webpack_require__("./node_modules/core-js/library/modules/es6.string.iterator.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/core.is-iterable.js");


/***/ }),

/***/ "./node_modules/core-js/library/modules/core.is-iterable.js":
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__("./node_modules/core-js/library/modules/_classof.js");
	var ITERATOR = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('iterator');
	var Iterators = __webpack_require__("./node_modules/core-js/library/modules/_iterators.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/_core.js").isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    // eslint-disable-next-line no-prototype-builtins
	    || Iterators.hasOwnProperty(classof(O));
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_classof.js":
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__("./node_modules/core-js/library/modules/_cof.js");
	var TAG = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ }),

/***/ "./node_modules/babel-runtime/core-js/get-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__("./node_modules/core-js/library/fn/get-iterator.js"), __esModule: true };

/***/ }),

/***/ "./assets/less/develop/agent_activity.less":
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent_activity.less");
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent_activity.less", function() {
				var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent_activity.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__("./node_modules/core-js/library/modules/_an-object.js");
	var get = __webpack_require__("./node_modules/core-js/library/modules/core.get-iterator-method.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/_core.js").getIterator = function (it) {
	  var iterFn = get(it);
	  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/core.get-iterator-method.js":
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__("./node_modules/core-js/library/modules/_classof.js");
	var ITERATOR = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('iterator');
	var Iterators = __webpack_require__("./node_modules/core-js/library/modules/_iterators.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/_core.js").getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ }),

/***/ "./assets/js/common/date_new.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		container: (0, _jquery2.default)(".date-wrap .tim"),
		GetSelectDate: function GetSelectDate(date) {
			var dateArr = date.split('至');
			return {
				start: dateArr[0].trim(),
				end: dateArr[1].trim()
			};
		},
		GetDateFormat: function GetDateFormat(date) {
			var year = date.getFullYear(),
			    month = date.getMonth() + 1,
			    day = date.getDate();
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			return {
				date: date,
				year: year,
				month: month,
				day: day,
				dayFormat: year + '-' + month + '-' + day,
				monthFormat: year + '-' + month
			};
		},
		Today: function Today() {
			var _this = this;
			var date = new Date();
			return _this.GetDateFormat(date);
		},
		day: function day() {
			var _this = this;
			var start = _this.Today().dayFormat;
			var html = '<div class="day active"><input type="date" value="' + start + '" /></div>';
			return html;
		},
		dayTwo: function dayTwo() {
			var _this = this;
			var start = _this.Today().dayFormat;
			var htmlS = '<div class="day active"><input class="start" type="date" value="' + start + '" />';
			var htmlE = '<span> 至 </span><input class="end" type="date" value="' + start + '" /></div>';
			return htmlS + htmlE;
		},
		//周数据
		week: function week() {
			var _this = this;

			// 获取今天年月日
			var today = _this.Today().dayFormat;
			var year = _this.Today().year;

			// 算出这年的第一周星期一和星期日
			var date = new Date(year - 1, 0, 1);
			var n = 6 - (date.getDay() + 6) % 7;
			date.setDate(date.getDate() + n);
			var weekstart, weekend;
			var arr = [];
			var weeks = [];
			do {
				date.setDate(date.getDate() + 1);
				weekstart = _this.GetDateFormat(date);
				date.setDate(date.getDate() + 6);
				weekend = _this.GetDateFormat(date);
				arr.push(weekstart.dayFormat + '至' + weekend.dayFormat);
				weeks.push({
					start: weekstart.dayFormat,
					end: weekend.dayFormat
				});
			} while (today > weekend.dayFormat);

			var start = void 0,
			    end = void 0,
			    dateValue = void 0;
			var curDate = { start: '', end: '' };

			curDate.start = today;
			curDate.end = today;

			var html = '<div class="week"><select>';
			for (var i = 0; i < arr.length; i++) {

				if (curDate.start >= weeks[i].start && curDate.end <= weeks[i].end) {
					start = weeks[i].start;
					end = weeks[i].end;
					dateValue = arr[i];
					html += '<option selected="selected" start="' + weeks[i].start + '" end="' + weeks[i].end + '" value="' + arr[i] + '">' + arr[i] + '</option>';
				} else {
					html += '<option start="' + weeks[i].start + '" end="' + weeks[i].end + '" value="' + arr[i] + '">' + arr[i] + '</option>';
				}
			}
			html += '</select></div>';

			return html;
		},
		month: function month() {
			var _this = this;
			var start = _this.Today().monthFormat;
			var html = '<div class="month"><input type="month" value="' + start + '" /></div>';

			return html;
		},
		season: function season() {
			var _this = this;
			//季统计
			var getSeasonNum = function getSeasonNum(n) {
				var valueS = '';
				var valueE = '';
				var nStr = '';
				if (n === 1) {
					valueS = '-01-01';
					valueE = '-03-31';
					nStr = '一';
				} else if (n === 2) {
					valueS = '-04-01';
					valueE = '-06-30';
					nStr = '二';
				} else if (n === 3) {
					valueS = '-07-01';
					valueE = '-09-30';
					nStr = '三';
				} else if (n === 4) {
					valueS = '-10-01';
					valueE = '-12-31';
					nStr = '四';
				}
				return {
					valueS: valueS,
					valueE: valueE,
					n: nStr
				};
			};

			var today = _this.Today().dayFormat;
			var curYear = _this.Today().year;
			var curMonth = _this.Today().month;
			var startYear = _this.GetDateFormat(new Date(curYear - 1, 0, 1)).year;

			var seasonArr = [];

			for (var i = startYear; i < curYear; i++) {
				for (var j = 1; j < 5; j++) {
					var time = getSeasonNum(j);
					var item = { label: i + '年' + '第' + time.n + '季度', value: i + time.valueS + '至' + i + time.valueE, start: i + time.valueS, end: i + time.valueE };
					seasonArr.push(item);
				}
			}

			var seasonLen = Math.ceil(curMonth / 3);

			for (var m = 1; m < seasonLen + 1; m++) {
				var time = getSeasonNum(m);
				var item = { label: curYear + '年' + '第' + time.n + '季度', value: curYear + time.valueS + '至' + curYear + time.valueE, start: curYear + time.valueS, end: curYear + time.valueE };
				seasonArr.push(item);
			}

			var start = void 0,
			    end = void 0,
			    dateValue = void 0;
			var curDate = { start: '', end: '' };

			curDate.start = today;
			curDate.end = today;

			var html = '<div class="season"><select>';

			seasonArr.forEach(function (item, index) {

				if (curDate.start >= item.start && curDate.end <= item.end) {
					start = item.start;
					end = item.end;
					dateValue = item.value;
					html += '<option start="' + item.start + '" end="' + item.end + '" selected="selected" value="' + item.value + '">' + item.label + '</option>';
				} else {
					html += '<option start="' + item.start + '" end="' + item.end + '" value="' + item.value + '">' + item.label + '</option>';
				}
			});

			html += '</select></div>';

			return html;
		},
		year: function year() {
			var _this = this;
			//年统计
			var yearArr = [];

			var today = _this.Today().dayFormat;
			var curYear = _this.Today().year;
			var startYear = _this.GetDateFormat(new Date(curYear - 1, 0, 1)).year;

			for (var i = startYear; i < curYear + 1; i++) {
				var item = { label: i + '年', value: i + '-01-01至' + i + '-12-31', start: i + '-01-01', end: i + '-12-31' };
				yearArr.push(item);
			}

			var start = void 0,
			    end = void 0,
			    dateValue = void 0;
			var curDate = { start: '', end: '' };

			curDate.start = today;
			curDate.end = today;

			var html = '<div class="year"><select>';

			yearArr.forEach(function (item) {

				if (curDate.start >= item.start && curDate.end <= item.end) {
					start = item.start;
					end = item.end;
					dateValue = item.value;
					html += '<option start="' + item.start + '" end="' + item.end + '" selected="selected" value="' + item.value + '">' + item.label + '</option>';
				} else {
					html += '<option start="' + item.start + '" end="' + item.end + '" value="' + item.value + '">' + item.label + '</option>';
				}
			});

			html += '</select></div>';

			return html;
		},
		init: function init(container) {
			var _this = this;
			//_this.container = container;
			var dayHtml = _this.day();
			var weekHtml = _this.week();
			var monthHtml = _this.month();
			var seasonHtml = _this.season();
			var yearHtml = _this.year();
			var temp = dayHtml + weekHtml + monthHtml + seasonHtml + yearHtml;
			//$(".date-wrap .tim").htm(temp);
			_this.container.html(temp);
		},
		clearDate: function clearDate() {
			this.init();
		},
		getSelectStartEnd: function getSelectStartEnd(selectedOption) {
			var value = _jquery2.default.trim(selectedOption.val());
			var start = _jquery2.default.trim(selectedOption.attr('start'));
			var end = _jquery2.default.trim(selectedOption.attr('end'));
			var returnPram = {
				start: start,
				end: end,
				value: value
			};
			return returnPram;
		},
		getCurPram: function getCurPram(route) {
			var _this = this;
			var returnPram = {};
			switch (route) {
				case 'day':
					var dayVal = _jquery2.default.trim(_this.container.find('.day input').val());
					returnPram = {
						start: dayVal,
						end: '',
						value: dayVal
					};
					break;
				case 'week':
					var selectedWeek = _this.container.find('.week select option:selected');
					returnPram = _this.getSelectStartEnd(selectedWeek);
					break;
				case 'month':

					var monthVal = _jquery2.default.trim(_this.container.find('.month input').val());
					returnPram = {
						start: monthVal + '-01',
						end: '',
						value: monthVal
					};
					break;
				case 'season':
					var selectedSeason = _this.container.find('.season select option:selected');
					returnPram = _this.getSelectStartEnd(selectedSeason);
					break;
				case 'year':
					var selectedYear = _this.container.find('.year select option:selected');
					returnPram = _this.getSelectStartEnd(selectedYear);
					break;
				default:
					break;
			}
			return returnPram;
		},

		initPerson: function initPerson(container) {
			var _this = this;
			var dayHtml = _this.dayTwo();
			var weekHtml = _this.week();
			var monthHtml = _this.month();
			var seasonHtml = _this.season();
			var yearHtml = _this.year();
			var temp = dayHtml + weekHtml + monthHtml + seasonHtml + yearHtml;
			_this.container.html(temp);
		},
		getPersonCurPram: function getPersonCurPram(route) {
			var _this = this;
			var returnPram = {};
			switch (route) {
				case 'day':
					var start = _jquery2.default.trim(_this.container.find('.day input.start').val());
					var end = _jquery2.default.trim(_this.container.find('.day input.end').val());
					returnPram = {
						start: start,
						end: end,
						value: start
					};
					break;
				case 'week':
					var selectedWeek = _this.container.find('.week select option:selected');
					returnPram = _this.getSelectStartEnd(selectedWeek);
					break;
				case 'month':
					var monthVal = _jquery2.default.trim(_this.container.find('.month input').val());
					returnPram = {
						start: monthVal + '-01',
						end: '',
						value: monthVal
					};
					break;
				case 'season':
					var selectedSeason = _this.container.find('.season select option:selected');
					returnPram = _this.getSelectStartEnd(selectedSeason);
					break;
				case 'year':
					var selectedYear = _this.container.find('.year select option:selected');
					returnPram = _this.getSelectStartEnd(selectedYear);
					break;
				default:
					break;
			}
			return returnPram;
		},
		clearPersonDate: function clearPersonDate() {
			this.initPerson();
		},
		dateShowByDateRoute: function dateShowByDateRoute() {
			var _this = this;
			var route = _global2.default.GetPage().parentPage;
			_this.container.find('.' + route).addClass('active').siblings('div').removeClass('active');
		},

		index: {
			'day': 2,
			'week': 3,
			'month': 1,
			'season': 4,
			'year': 5
		},
		indexOfFF: {
			'day': 1,
			'week': 2,
			'month': 3,
			'season': 4,
			'year': 5
		}
	};

/***/ }),

/***/ "./assets/js/develop/agent_activity/index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__("./node_modules/babel-runtime/helpers/extends.js");

	var _extends3 = _interopRequireDefault(_extends2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	var _pubs = __webpack_require__("./assets/js/develop/agent_activity/pubs.js");

	var _pubs2 = _interopRequireDefault(_pubs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render() {
	    _global2.default.GetTpl({
	        url: '/agent_activity/index.tpl',
	        data: {},
	        success: function success(tpl) {
	            (0, _jquery2.default)('#content').html(tpl);
	            renderTable();
	        }
	    });
	}

	function renderTable() {
	    var _pubs$getAjaxParam = _pubs2.default.getAjaxParam(),
	        timeType = _pubs$getAjaxParam.timeType,
	        start = _pubs$getAjaxParam.start;

	    _global2.default.Ajax({
	        url: '/agentActivityStatistics/queryAgentActivityOfTotalCompany',
	        type: 'post',
	        data: {
	            queryMonth: start
	        },
	        success: function success(res) {
	            if (res.code == 0) {
	                var resData = res.body;
	                var list = (resData.list || []).map(function (item) {
	                    var queryStr = _jquery2.default.param({
	                        id: item.companyId,
	                        name: item.companyName
	                    });
	                    var linkTo = '#' + timeType + '/company?' + queryStr;
	                    return (0, _extends3.default)({}, item, {
	                        linkTo: linkTo
	                    });
	                });
	                var summary = resData.summary || {};
	                (0, _jquery2.default)('#table_title').text('\u5168\u516C\u53F8\u603B\u4EE3\u7406' + (summary.totalAgentNums || 0) + '\u4EBA');
	                _global2.default.GetTpl({
	                    url: '/agent_activity/index_table.tpl',
	                    data: {
	                        list: list,
	                        summary: summary
	                    },
	                    success: function success(tpl) {
	                        (0, _jquery2.default)('#table-contanier').html(tpl);
	                    }
	                });
	            } else {
	                _popup2.default.Tip(res.message);
	            }
	        }
	    });
	}

	function initEvent() {
	    _pubs2.default.initTimeEvent(renderTable);
	}

	function init() {
	    render();
	    initEvent();
	}

	exports.default = {
	    init: init
	};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/extends.js":
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__("./node_modules/babel-runtime/core-js/object/assign.js");

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/assign.js":
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__("./node_modules/core-js/library/fn/object/assign.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/assign.js":
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__("./node_modules/core-js/library/modules/es6.object.assign.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/_core.js").Object.assign;


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.assign.js":
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__("./node_modules/core-js/library/modules/_export.js");

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__("./node_modules/core-js/library/modules/_object-assign.js") });


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-assign.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__("./node_modules/core-js/library/modules/_object-keys.js");
	var gOPS = __webpack_require__("./node_modules/core-js/library/modules/_object-gops.js");
	var pIE = __webpack_require__("./node_modules/core-js/library/modules/_object-pie.js");
	var toObject = __webpack_require__("./node_modules/core-js/library/modules/_to-object.js");
	var IObject = __webpack_require__("./node_modules/core-js/library/modules/_iobject.js");
	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__("./node_modules/core-js/library/modules/_fails.js")(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),

/***/ "./assets/js/develop/agent_activity/company.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__("./node_modules/babel-runtime/helpers/extends.js");

	var _extends3 = _interopRequireDefault(_extends2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	var _pubs = __webpack_require__("./assets/js/develop/agent_activity/pubs.js");

	var _pubs2 = _interopRequireDefault(_pubs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render() {
	    _global2.default.GetTpl({
	        url: '/agent_activity/company.tpl',
	        data: {},
	        success: function success(tpl) {
	            (0, _jquery2.default)('#content').html(tpl);
	            renderTable();
	        }
	    });
	}

	function renderTable() {
	    var _pubs$getAjaxParam = _pubs2.default.getAjaxParam(),
	        timeType = _pubs$getAjaxParam.timeType,
	        tabType = _pubs$getAjaxParam.tabType,
	        start = _pubs$getAjaxParam.start;

	    var companyId = _pubs2.default.getQuery('id');
	    var companyName = _pubs2.default.getQuery('name') || '';
	    var urlMap = {
	        department: '/agentActivityStatistics/queryAgentActivityOfDeptByCompany',
	        person: '/agentActivityStatistics/queryAgentActivityOfSalesManagerByCompany'
	    };
	    _global2.default.Ajax({
	        url: urlMap[tabType],
	        type: 'post',
	        data: {
	            queryMonth: start,
	            companyId: companyId
	        },
	        success: function success(res) {
	            if (res.code == 0) {
	                var resData = res.body;
	                var paramMap = {
	                    department: {
	                        idKey: 'deptId',
	                        columnKey: 'deptName',
	                        columnName: '部门名称'
	                    },
	                    person: {
	                        idKey: 'salesManagerId',
	                        columnKey: 'salesManagerName',
	                        columnName: '销售经理'
	                    }
	                };
	                var param = paramMap[tabType] || {};
	                var list = (resData.list || []).map(function (item) {
	                    var queryStr = _jquery2.default.param({
	                        id: item[param.idKey],
	                        name: item[param.columnKey]
	                    });
	                    var linkTo = '#' + timeType + '/' + tabType + '?' + queryStr;
	                    return (0, _extends3.default)({}, item, {
	                        linkTo: linkTo
	                    });
	                });
	                var summary = resData.summary || {};
	                (0, _jquery2.default)('#table_title').text(companyName + '\u603B\u4EE3\u7406' + (summary.totalAgentNums || 0) + '\u4EBA');
	                _global2.default.GetTpl({
	                    url: '/agent_activity/company_table.tpl',
	                    data: (0, _extends3.default)({}, param, {
	                        list: list,
	                        summary: summary
	                    }),
	                    success: function success(tpl) {
	                        (0, _jquery2.default)('#table-contanier').html(tpl);
	                    }
	                });
	            } else {
	                _popup2.default.Tip(res.message);
	            }
	        }
	    });
	}

	function initEvent() {
	    _pubs2.default.initTimeEvent(renderTable);
	    _pubs2.default.initTabEvent(renderTable);
	}

	function init() {
	    render();
	    initEvent();
	}

	exports.default = {
	    init: init
	};

/***/ }),

/***/ "./assets/js/develop/agent_activity/department.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__("./node_modules/babel-runtime/helpers/extends.js");

	var _extends3 = _interopRequireDefault(_extends2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	var _pubs = __webpack_require__("./assets/js/develop/agent_activity/pubs.js");

	var _pubs2 = _interopRequireDefault(_pubs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render() {
	    _global2.default.GetTpl({
	        url: '/agent_activity/index.tpl',
	        data: {},
	        success: function success(tpl) {
	            (0, _jquery2.default)('#content').html(tpl);
	            renderTable();
	        }
	    });
	}

	function renderTable() {
	    var _pubs$getAjaxParam = _pubs2.default.getAjaxParam(),
	        timeType = _pubs$getAjaxParam.timeType,
	        start = _pubs$getAjaxParam.start;

	    var deptId = _pubs2.default.getQuery('id');
	    var deptName = _pubs2.default.getQuery('name') || '';
	    _global2.default.Ajax({
	        url: '/agentActivityStatistics/queryAgentActivityOfSalesManagerByDept',
	        type: 'post',
	        data: {
	            queryMonth: start,
	            deptId: deptId
	        },
	        success: function success(res) {
	            if (res.code == 0) {
	                var resData = res.body;
	                var list = (resData.list || []).map(function (item) {
	                    return (0, _extends3.default)({}, item);
	                });
	                var summary = resData.summary || {};
	                (0, _jquery2.default)('#table_title').text(deptName + '\u603B\u4EE3\u7406' + (summary.totalAgentNums || 0) + '\u4EBA');
	                _global2.default.GetTpl({
	                    url: '/agent_activity/department_table.tpl',
	                    data: {
	                        list: list,
	                        summary: summary
	                    },
	                    success: function success(tpl) {
	                        (0, _jquery2.default)('#table-contanier').html(tpl);
	                    }
	                });
	            } else {
	                _popup2.default.Tip(res.message);
	            }
	        }
	    });
	}

	function initEvent() {
	    _pubs2.default.initTimeEvent(renderTable);
	}

	function init() {
	    render();
	    initEvent();
	}

	exports.default = {
	    init: init
	};

/***/ }),

/***/ "./node_modules/core-js/library/fn/get-iterator.js":
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__("./node_modules/core-js/library/modules/web.dom.iterable.js");
	__webpack_require__("./node_modules/core-js/library/modules/es6.string.iterator.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/core.get-iterator.js");


/***/ })

});