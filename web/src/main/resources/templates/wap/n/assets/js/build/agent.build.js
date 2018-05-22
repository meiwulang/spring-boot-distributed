webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/agent.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _common = __webpack_require__("./assets/js/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	var _index = __webpack_require__("./assets/js/develop/agent1/index.js");

	var _index2 = _interopRequireDefault(_index);

	var _common3 = __webpack_require__("./assets/js/develop/common/common.js");

	var _common4 = _interopRequireDefault(_common3);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
		_date_new2.default.init();
		_date_new2.default.dateShowByDateRoute();
		_common4.default.Init();
		this.Init();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_this.Route();

			(0, _jquery2.default)(window).on('hashchange', function () {
				_common4.default.dateTabInit();
				_date_new2.default.dateShowByDateRoute();
				_common4.default.dateEnabled();
				_this.Route();
			});
		},
		Route: function Route() {
			var _this = this;
			var dateType = _global2.default.GetPage().curPage;
			switch (dateType) {
				case 'time':
					_index2.default.Time();
					break;
				case 'department':
					_index2.default.Department();
					break;
				case 'system':
					_index2.default.SystemIndex();
					break;
				case 'departmentOne':
					_index2.default.DepartmentOne();
					break;
				default:
					_index2.default.Index();
					break;
			}
		}

	};

	_common2.default.Ready(function () {
		new Start();
	});

/***/ }),

/***/ "./assets/js/develop/agent1/system_detail_department_one.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        _global2.default.GetTpl({
	            url: '/agent1/company/department_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTablePerson();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departId: departmentId
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTableTime: function RenderTableTime() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_time.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '231') {
	            _this.RenderTablePerson();
	        } else if (type == '221') {
	            _this.RenderTableTime();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent.less":
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
	// imports


	// module
	exports.push([module.id, "/*\n\tauthor : zhupinglei,\n\tdesc : 浏览器重置\n*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  -webkit-user-select: none;\n  /* 禁止选中文本（如无文本选中需求，此为必选项） */\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  background-color: #f3f5f9;\n}\nbody div,\nbody dl,\nbody dt,\nbody dd,\nbody ul,\nbody ol,\nbody li,\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5,\nbody h6,\nbody pre,\nbody form,\nbody fieldset,\nbody input,\nbody p,\nbody a,\nbody blockquote,\nbody th,\nbody i,\nbody u,\nbody span {\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\nbody ol,\nbody ul {\n  list-style: none;\n}\nbody u,\nbody i {\n  font-weight: normal;\n  font-style: normal;\n}\nbody a {\n  color: #333;\n  text-decoration: none;\n}\nbody a,\nbody img {\n  -webkit-touch-callout: none;\n  /* 禁止长按链接与图片弹出菜单 */\n}\nbody input,\nbody select,\nbody button,\nbody textarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -o-appearance: none;\n  border: none;\n  background-color: #fff;\n  margin: 0;\n  padding: 0;\n  resize: none;\n  outline: none;\n  border-radius: 0;\n}\nbody table {\n  border-collapse: collapse;\n  border-spacing: 0px;\n}\nbody .clearfix {\n  *zoom: 1;\n}\nbody .clearfix:after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  visibility: hidden;\n  content: \".\";\n}\nbody {\n  background-color: #f3f5f9;\n}\n/*----------用来移除向下箭头----------*/\n/*input[type=\"date\"]::-webkit-calendar-picker-indicator {\n   display: none;\n}*/\n/*----------用来移除叉叉按钮----------*/\n/*input[type=\"date\"]::-webkit-clear-button{\n   display:none;\n}*/\n#popup-loading {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -30px;\n  margin-top: -50px;\n  z-index: 100;\n  background: url(" + __webpack_require__("./assets/img/loading.gif") + ") center center no-repeat;\n  background-size: 30px 30px;\n  background-color: rgba(255, 255, 255, 0.6);\n  border-radius: 10px;\n}\n#popup-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.1);\n  z-index: 99;\n}\n#popup-tip {\n  width: 180px;\n  line-height: 16px;\n  color: #fff;\n  background-color: #000000;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -105px;\n  margin-top: -30px;\n  z-index: 100;\n  text-align: center;\n}\n#popup-info {\n  word-wrap: break-word;\n  width: 200px;\n  line-height: 20px;\n  color: #333;\n  background-color: #fff;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 30%;\n  margin-left: -115px;\n  z-index: 100;\n  box-shadow: 0px 0px 2px #ccc;\n}\n#popup-info .popup-confirm .popup-content {\n  height: 100px;\n  background: url(" + __webpack_require__("./assets/img/guide/warr.png") + ") center 30% no-repeat;\n  background-size: 52px auto;\n}\n#popup-info .popup-confirm .popup-content .popup-txt {\n  position: relative;\n  top: 80px;\n  text-align: center;\n}\n#popup-info .popup-confirm .popup-foot {\n  position: relative;\n  height: 43px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel,\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  line-height: 43px;\n  font-size: 14px;\n  text-align: center;\n  height: 43px;\n  width: 57%;\n  position: absolute;\n  box-sizing: border-box;\n  bottom: -16px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel {\n  color: #666;\n  left: -15px;\n  border-top: 1px solid #e7e7e7;\n}\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  color: #fff;\n  background: #fc2a35;\n  right: -15px;\n}\n#wrap #agent {\n  padding-bottom: 50px;\n  box-sizing: border-box;\n}\n#wrap #agent .acti_header {\n  height: 40px;\n  font-size: 14px;\n  width: 100%;\n  margin-bottom: 2px;\n  position: relative;\n  z-index: 5;\n}\n#wrap #agent .screen {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n  z-index: -1;\n  opacity: 0;\n}\n#wrap #agent .screen .sha {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 50px;\n  width: 100vw;\n}\n#wrap #agent .screen .son {\n  padding-top: 12px;\n  padding-right: 15px;\n  box-sizing: border-box;\n  width: 100vh;\n  height: 100vw;\n  background-color: #fff;\n  transform: rotate(0deg);\n  -webkit-transform: rotate(0deg);\n  -moz-transform: rotate(0deg);\n  -o-transform: rotate(0deg);\n  transition: all 0.3s ease-in-out;\n  -webkit-transition: all 0.3s ease-in-out;\n  -moz-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transform-origin: 50vw 50vw;\n}\n#wrap #agent .screen .son .ave {\n  width: 100%;\n  height: 100%;\n}\n#wrap #agent .screen .clear {\n  color: #fff;\n  text-align: center;\n  line-height: 30px;\n  font-size: 25px;\n  background-color: rgba(0, 0, 0, 0.4);\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  position: fixed;\n  top: 15px;\n  right: 30px;\n}\n#wrap #agent .screen.active {\n  opacity: 1;\n  z-index: 99;\n}\n#wrap #agent .screen.active .son {\n  transform: rotate(90deg);\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n}\n#wrap #agent .count {\n  position: relative;\n  width: 100%;\n  height: 290px;\n  /*background-color: #fff;*/\n  box-sizing: border-box;\n  padding: 15px;\n  padding-top: 10px;\n  background-color: rgba(255, 255, 255, 0);\n}\n#wrap #agent .count .time {\n  width: 100%;\n  height: 30px;\n  box-sizing: border-box;\n  border-bottom: 1px solid #e7e7e7;\n  line-height: 30px;\n  overflow: hidden;\n  font-size: 10px;\n  color: #999;\n}\n#wrap #agent .count .time h2 {\n  font-size: 10px;\n  height: 100%;\n  width: 70px;\n  float: left;\n}\n#wrap #agent .count .time .day {\n  margin-left: 70px;\n  text-align: right;\n  overflow: hidden;\n}\n#wrap #agent .count .shade {\n  position: absolute;\n  width: 100vw;\n  height: 208px;\n  top: 42px;\n  left: 0;\n}\n#wrap #agent .count .char {\n  height: 260px;\n}\n#wrap #agent .count.disable {\n  visibility: hidden;\n}\n#wrap #agent .record {\n  background-color: #fff;\n}\n#wrap #agent .record .switch {\n  height: auto;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 5px 0 12px;\n  background: -webkit-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Safari 5.1 - 6.0 */\n  background: -o-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Opera 11.1 - 12.0 */\n  background: -moz-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Firefox 3.6 - 15 */\n  background: linear-gradient(180deg, #6186f8, #5266e1);\n}\n#wrap #agent .record .switch .ul-bag {\n  padding: 0 10px;\n}\n#wrap #agent .record .switch .ul-bag ul {\n  border-radius: 6px;\n  border: 1px solid #fff;\n  overflow: hidden;\n  height: 34px;\n  display: flex;\n  display: -webkit-flex;\n}\n#wrap #agent .record .switch .ul-bag ul li {\n  flex: 1;\n  font-size: 12px;\n  color: #fff;\n  height: 100%;\n  text-align: center;\n  float: left;\n  box-sizing: border-box;\n  border-right: 1px solid #fff;\n}\n#wrap #agent .record .switch .ul-bag ul li a {\n  display: inline-block;\n  height: 100%;\n  width: 100%;\n  line-height: 34px;\n  color: #fff;\n}\n#wrap #agent .record .switch .ul-bag ul li:last-child {\n  border-right: none ;\n}\n#wrap #agent .record .switch .ul-bag ul li.active {\n  background-color: #fff;\n  color: #5575e2;\n}\n#wrap #agent .record .switch .ul-bag ul li.active a {\n  color: #5575e2;\n}\n#wrap #agent .record .mation-txt {\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n}\n#wrap #agent .record .tato {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n  background-color: #fff;\n  border-top: 1px solid #e7e7e7;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: flex-start;\n}\n#wrap #agent .record .tato .sum {\n  background-color: #587de5;\n  font-size: 14px;\n  color: #fff;\n  line-height: 52px;\n  width: 80px;\n}\n#wrap #agent .record .tato .col {\n  flex: 1;\n  padding: 5px 0 5px 36px;\n}\n#wrap #agent .record .tato .col p {\n  font-size: 16px;\n  color: #333;\n  line-height: 20px;\n  text-align: left;\n}\n#wrap #agent .record .tato .col p.grey-font {\n  font-size: 12px;\n  color: #999;\n  line-height: 20px;\n}\n#wrap #agent .record .count {\n  border-bottom: 0;\n  padding-bottom: 10px;\n}\n#wrap #agent .record .tab-wrap {\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 0 10px #ddd;\n  position: relative;\n  left: 0;\n  top: -20px;\n  background-color: #fff;\n}\n#wrap #agent .record .tab-wrap div.tab {\n  flex: 1;\n  padding: 10px 0;\n  border-bottom: 2px solid #ffffff;\n  text-align: center;\n  position: relative;\n  box-sizing: border-box;\n}\n#wrap #agent .record .tab-wrap div.tab.active {\n  color: #587de5;\n}\n#wrap #agent .record .tab-wrap div.tab:after {\n  display: block;\n  content: '';\n  position: absolute;\n  right: -1px;\n  top: 10px;\n  height: 18px;\n  width: 1px;\n  border-right: 2px dotted #e1e1e1;\n}\n#wrap #agent .record .tab-wrap div.tab:last-child:after {\n  border-right: 0;\n}\n#wrap #agent .record .tab-bg {\n  height: 20px;\n  background-color: #f7f7f7;\n  margin-top: 20px;\n  padding: 0 10px;\n}\n#wrap #agent .record .table-wrap {\n  background-color: #f7f7f7;\n}\n#wrap #agent .record .table-wrap div.cont {\n  display: none;\n}\n#wrap #agent .record .table-wrap table {\n  text-align: center;\n  border-collapse: collapse;\n  width: 100%;\n}\n#wrap #agent .record .table-wrap table thead {\n  background-color: #f7f7f7;\n  border: 0;\n}\n#wrap #agent .record .table-wrap table thead tr {\n  height: 40px;\n}\n#wrap #agent .record .table-wrap table thead tr th {\n  font-size: 12px;\n  color: #999;\n}\n#wrap #agent .record .table-wrap table thead tr th:first-child {\n  width: 10px;\n}\n#wrap #agent .record .table-wrap table thead tr th:last-child {\n  width: 10px;\n}\n#wrap #agent .record .table-wrap table thead tr th:nth-child(2) {\n  text-align: left;\n  padding-left: 6px;\n}\n#wrap #agent .record .table-wrap table tbody tr {\n  height: 46px;\n}\n#wrap #agent .record .table-wrap table tbody tr td {\n  font-size: 12px;\n  color: #333;\n  border-bottom: 5px solid #f7f7f7;\n  background-color: #fff;\n}\n#wrap #agent .record .table-wrap table tbody tr td a {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n#wrap #agent .record .table-wrap table tbody tr td:first-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #agent .record .table-wrap table tbody tr td:last-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #agent .record .table-wrap table tbody tr td:nth-child(2) {\n  text-align: left;\n}\n#wrap #agent .record .table-wrap table tbody tr:last-child td {\n  border-bottom: none !important;\n}\n#wrap #agent .record .table-wrap table tbody tr.border-bottom {\n  height: 36px;\n}\n#wrap #agent .record .table-wrap table tbody tr.border-bottom td {\n  border-bottom: 1px solid #f7f7f7;\n}\n#wrap #agent .record .table-wrap table tbody tr.border-bottom td:first-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #agent .record .table-wrap table tbody tr.border-bottom td:last-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom {\n  height: 30px;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom td {\n  font-size: 10px;\n  color: #999;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom td.div-wrap {\n  position: relative;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap {\n  position: absolute;\n  left: 0;\n  top: 0;\n  line-height: 30px;\n  min-width: 350px;\n  height: 30px;\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span {\n  display: inline-block;\n  text-align: left;\n}\n#wrap #agent .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span:first-child {\n  margin-right: 5px;\n  width: 150px;\n}\n#wrap #agent .record .table-wrap .mation-txt {\n  background-color: #fff;\n}\n#wrap #agent .record .table-index {\n  margin-top: 0;\n  padding-top: 0;\n}\n#wrap #agent .record #content .data-null {\n  display: none;\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n  position: relative;\n  top: -280px;\n  z-index: 4;\n}\n#wrap #agent .record #content table tr td.arrow-right a {\n  position: relative;\n}\n#wrap #agent .record #content table tr td.arrow-right a:after {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  margin-top: -4px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #656565;\n  border-right: 1px solid #656565;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n#wrap #agent .record .title {\n  margin: 0 10px;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  border-bottom: 1px solid #ddd;\n}\n#wrap #agent .record .title h2 {\n  position: absolute;\n  left: 0;\n  top: -123px;\n  height: 26px;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #agent .record .title h2 a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  position: absolute;\n  right: -10px;\n  top: -5px;\n  z-index: 11;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #agent .record .title h2 span.bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n}\n#wrap #agent .record .title h2 span.bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #agent .record .tim {\n  font-size: 14px;\n  color: #ff2d55;\n}\n#wrap #agent .record .tim label {\n  display: block;\n}\n#wrap #agent .record .tim input {\n  width: 100%;\n  color: #5575e2;\n  text-align: right;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") 85% no-repeat;\n  background-size: 11px 6px;\n  margin-left: -20px;\n  font-size: 14px;\n}\n#wrap #agent .record .tim div.active {\n  display: block;\n}\n#wrap #agent .record .tim div.day {\n  margin-right: -10px;\n}\n#wrap #agent .record .tim div.day input {\n  width: 140px;\n}\n#wrap #agent .record .tim div.month {\n  margin-right: -20px;\n}\n#wrap #agent .record .tim div.month input {\n  width: 105px;\n}\n#wrap #agent .record .tim div.year select {\n  direction: rtl;\n}\n#wrap #agent .record .tim select {\n  padding-right: 16px;\n  color: #5575e2;\n  font-size: 14px;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") right no-repeat;\n  background-size: 11px 6px;\n  width: 100%;\n  height: 20px;\n  line-height: 20px;\n}\n#wrap #agent .record .date-wrap {\n  margin: 0 10px;\n}\n#wrap #agent .record .date-wrap .tim div {\n  display: none;\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 !important;\n}\n#wrap #agent .record .date-wrap .tim div input {\n  margin: 0 !important;\n  text-align: left;\n}\n#wrap #agent .record .date-wrap .tim div select {\n  width: auto;\n}\n#wrap #agent .record .date-wrap .tim div.active {\n  display: block;\n}\n#wrap #agent .record .date-wrap .tim div.day input {\n  width: 132px;\n}\n#wrap #agent .record .date-wrap .tim div.day span {\n  vertical-align: top;\n  display: inline-block;\n  color: #5575e2;\n  padding-right: 10px;\n}\n#wrap #agent .record .title_header {\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #agent .record .title_header a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #agent .record .title_header .bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n  position: relative;\n  margin-left: 10px;\n}\n#wrap #agent .record .title_header .bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #agent .record .no-tab .table-wrap {\n  padding-top: 2px;\n}\n#wrap #agent .record .count {\n  padding-bottom: 10px;\n}\n#wrap #agent tbody tr:last-child td {\n  border-bottom: none!important;\n}\n#wrap #agent tbody td.next-page {\n  width: 15px;\n  border-bottom: 1px solid #e7e7e7!important;\n}\n#wrap #agent tbody td.next-page img {\n  width: 8px;\n  position: relative;\n  top: 2px;\n}\n#wrap #agent tbody td:last-child {\n  width: 15px;\n  border-bottom: none!important;\n}\n#wrap #agent .sales-table tbody p {\n  color: #999;\n}\n", ""]);

	// exports


/***/ }),

/***/ "./assets/img/home.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABACAYAAAHZm5F1AAAAAXNSR0IArs4c6QAADFxJREFUeAHdWwtsU9cZ/m3HiTEJSSAEQRlL1xKxoI6oMCgFConYWjpYJ1TUDjpeW9E6qlV9QFlLgXXA+hjjXWBj7dJCNYmBqqYFDYoYLIJVo+02VAQrCJT1sUAYRAnBjmNn/3ft3z4+vvf62nFouyPd/O/HOT73nnP/e+Ki5OZKJqOUMAHdXV1dL5kpuWPMuEIgmKoGJdelS5dGQzR3RSv5ClKVEMYVDodXut3uMhFHIhxbYkAhduVzPhtESYfQ7+IrdObMmVd0odDSO9AwyItB0PGmKoGp03GG69ChQ/0mTZq0Km4aQ4yEuVdLuVeDwWv4e4jq6gP022eKDBUoYPC2GJTy54e/aKXfsZIxeAqfnqtrN8ihQzwGlO7GdZbM8Rt43yKIEoPm5TAbDY72R7oFCJ8Yi6QmCioTPOGruKqThIsymMDR680xHDxHLdqj2E/GDjAp4453vJ06+X6wtCXFsQwpptsLqvQnz7XRA9+JTs6f/6bdmKuQv7aymHRHkgnt3r17terkpSWFcfJMY4jCnTyJY234UK+gBpTU4cxz8ODBQbW1tU+JRksb0a53AkIasLjQRTMmJ98+4gQKxsAyNH7GUCj0aF5e3hDDMs0f1YmoCk+HIk+BopgiYIadLK6vKwkNqOJxAx0RJfDFCBNtLdP5urIZLQ7E2MPGm8wUrXgyL+DA1Fgm0opt0ftYdySRkfY6FialDWPMRmmNn0XIwz/2DeUSN3pvQA5OkvG619uTjKE0ZKDbMH7xtUQ2MJQsoBNv750MxXFkEoqRR94P0cC+0ccRFBK5xNWTkZNnw0YmD65qNQRlxe74jQdGWgdVN3mMO/JH3/Mle45RcIA1IHL16tXDphrMxECOr47ekR83J+5S6Ev/4SiPf4mk1aauPkihMPwnmp4JHKDBAS48ffFzOm4wQjO6wTDkcrke2bhx41KD6+CPZABV6Q6gZKTKTd2ZKYgjcWpqKEwzByJToa6n06puxriVM5UvOKBxtbS0jCwsLBzDy/ZXmdc746iagQQQttAqdPNytET2CaKYSyjB4FNwQFx42mBzIHxGrRv2cLKsDfual56eH91xWFskJBJAhe69e/eWTpkyZWVCzRw7dT5Cq7a30vpFxdQ38RQ0lN88HKRdBwJU92xx0p7RzJMaHLhxS8RGwEzf4D25oY2u8lNyk7LAWymHwkTzl7fQrLv9dNftyYu+2CCwerk7OjoWer3er4uCDvWHvy63o61s5Skjti5OoFIIM2i2Fzr3SYQeW8vbFW5YkX68OoqLPR732LaqK5fIAPUkKBAINKgKTvBrHUTlJVFXgwe4KdCR/IBO50Pf9Xb16tVrD8+JiekMVXnVjW6qujF6N+DF5fcrott8VccO1ycmaKyr2ElYrh7HT4Zp/ettNPceP3kTq7BpnIuXI/TGoYDlTwEjNQmhwcPYepqamsaXl5fPgKAnmySBGIIDymUkM27cuLyGhobVzE/a6cAoF00Cq76Ep0IkA1qFsBEd4Fk3OyeqTHAVCp51cDHMxJGVrhVfYqSFmTrIVD9tAlBw4lTX0WlHgeyU7ByqMivcaUfscrAcCQmaAo8ePdpn5MiRd+bn5w9nz335SvO4so1vCCWIqik8Fbo7OzunezyeWlUxVzjue7WpgYG7GxsbB/AjfFNPJYDgElTFwTOu1tbWCbyhvR/CnmyyikoycXjx4sVqpwkcOh6il99IvJBueaqYCp1vMVMLWNxj19y5c/PKysoedNL7F3mz8uH56Dsq9FGKeWh1Cz0xp5BGDHU2Z+M9R/DYhV32rxlPu1hhB1XKG9xfLkwUk9jOaLOXtdIdt3pJf+MUuQplQRKea+fOnfCYNgHsF2tGeU0TgLNXny2iEx91xrd9EsAMSu8F4kVnUezNykyfLvAm5fE1rbRsQRENHaLfXKkmW3YF6NiJkJFUqjTKkeACsaMyrYZC/QRvWF94pY22Ly+mAvPdu2kc2Yk52ehKIqaOwFyzo53LxJklALtRVR6qGV1A+48lqjXgS5PAgLK3XC9CHWI7//TmVhpU7qHnf5qYjJ9xvWTxumj1ZsKtBbRgenIhBvMHzclI6DFTaBSpFs8rpH5cJlIbEniZfyIE+cv7qcVf6FolAFmyN3DSNCsDbwZzRA9h5VPX61FaHtsIgtemzF6dYqnddktBSpk8JnIE1CRg0HXhwoU9/K4x3ZF1TGnhfT7ClW1Tfw5jFAYMGHDEzllJkYtwN+SyqSMhP0fX5cuX60tLS6eZBUL9t/lymDb8oZ2qK+1nIxzu2h+kygp7PXlOIJ7g8rx4nnnJXyGgFWt48DQ2cQXEpmGYbxuRzy/L6oCnGiAwmiQAHEnACo9wFPZ7vKkpyp2BH9y4uCz7KOPmT58cpiZJSAIyL5AExjrCiSxpbm5+K4cxU1zJzwGB4CpEkvErVirI6PZNiWjCkIAiElqFSAK0QOCqXGyzhuJMdaDyBAeUJKALPGdNgugOVb6OCy1Qt82YTudIlau4BDLjicwxdOrETs9O5iiRbjvQomTjLxsbLWz3ye4mYWVvxVczdqKj6vconmkyVvpmfJVnhfdo5zJxriZoZ2emp/OEBnQdOHDAP3bs2G9ytX603TulXdDrKZPkrWLqcivazfUMz9atW2sKCgruZmdp3+itAn5efL1jkofOV2nBAV1cURrBBZ3ZjFtuRcXpFxlKp9QcdZ7QKnRxTW+805Ka6jwd3tgUoTf/HKCTZyMUCHXRoDIX3TGqgL49xv6FIZ3fdHLpnOiptI6Ddp0+fbq8srLyScZzOgNwkOxPx6Inr2q5kjJtQj7XH9104kyIduwN0n9bwtS/n4cen+VPOnkjiXcX6p0Vfzrf2EvyCZdv+f3+e0SpuxDFtzV8GujTC2EqLvTQIzP9lkU4fObevidAR/8RJBd/75x5l8/yc3c2eUmHBcKH4AKNzXUwGJzOXxVqsgmi26D6XPdWwDjhMLLKSw/N8GdcBNyyu506ghEaxu/YGMBMqtd6PqClszoUmTEIV65cmVhcXHyvmQOnPJzf3chFhH9+FCKv103z+YDV+BHdu+9RPV+7s53O/jvER3/d9PD9fsdVdD1vDIAMAmSCC99dX1/fZ+rUqat0Q6c0jpjgoNzV9jANHuihRQ8Uphw1cerLTg/HVf54sIO6+IzzRH64zv+uL+2xFdWfdBg8fRAM2bVr1+71+XwTVSOn+M82tdHH/wnTlHE+mjklp89WyxTOc6X5V/zdpaUtTIv5O8stDr+zqLUy3bkxEDwIVbrAKe3Lx50VprOfhKmOVwWUnuSEsJ2PIJfew7EKmI+3Zuohdiu746fC9OHZTj5V2UXXgtEyj69AflsrqwTfaiDEAyA+uWbVli/wUzs/G/Y1BI3zI/pJZtUpTu0v5sNSTc1hyudniNcbTaE90GVM99oxPpo3zXpW4YvLO7z8DuZvDs8s6E0VXP7PpFkNRNxHJBIJ8rtCBl8U46YG4ufch1VEw9ildupc2BgEDJacyocDDNCcZS10+L0O24HAbEMr5u8emQ4C7Oxyg5ynWqjRQP7P/6SdEXze813+0jCsO+OAQmy6VlYavRXONobpXf5iWcQbLLR/nY9+qysrkbs1nafs5FYDES8q89eOD3hW1Dj9v4Hs0uCTen3dxknN/X8N0RH+n5hwZ3QAsFF6YjZ/Za+UyZ9tBHs7dSDQeQy7DILgXdu2bdu6cOHCFSzL6vXa447+mrjf7RpWB5wStTopamcrn1myHS6xk3mnQyM2n8/trKio+Ft1dfU4ZoiNXV5Jsv487Rs+6KTzn3aSv5eHbv5Kxi6S/OkEdphreId5jVeY++708UtZ5v7NOq7ygMvlnjRpUh5Xnh7j2+QGPRkn9GF+x3j17QB1hNJMDSfONJ3hN3np4e/zO0eWH0Gl03BrhssgCMQq4zp37tw3eIbM02zg40vb1M6jEyotuEBjEGI6Bs4fv27nFQUvY6IDH1/KpnfAjoZMveIDs2/fvvLJkyfPzvaW+SKMnN5xyUnnC61C4Prl5hWmz6xZs2p69+49luVZrTKSxPWE0jGzmLpMpQUH1HHhCaTNmzcX8av8zSUlJRVc5e7P/5pQxnZ+3rrj5SHzR7xZtt3kSSfs3JjpqDzBAVUcPs14Ekt0hTaDTnTM7DLmZRLITFfnqbTgApGciuvJ2sl03ZzT2Qa3ssuUjw5Z2eS8s3YOc5VEOj/p5HY5XhdZTyfY0/5zNkj/A+BlGZGO1/U8AAAAAElFTkSuQmCC"

/***/ }),

/***/ "./assets/img/jt.png":
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAANCAYAAACtpZ5jAAABSElEQVQ4jZXTsUsbYRzG8U8u4uCgk8vh6Kqrk0vBRWygdUo6OjmI3RS5zbRIlw4V9A8IF0FxSImL4K4gCK6O1sXJxaEQ6vC+oUdMonng4OD5vd/7vQ/Plaq7f37gA55Rw70RlGcpqNUfZpBjAucJvmESiziJxkiq1R+mcBYZ49hL8IRlPGIBTZRHgJZxjDnhtst5lj4l0b/DRyGOCn6OsPAvLMWzq3mW3kNSGLjEGv5hA+vvgG7HuQ6qeZZedY2kZ/AIO4VNKkOgn/A9vn/Ns7RVNHvBsIdDIecm5vvMLKCBEg7yLN3vHegHhk1cCA1pY6bgzeJ39FpCbK80CPwXn3EboWeYis8ppnEj5NrpBxgbAOZ/Da+FKjXilt1adVvUV8PAIqAixLLS88Ghf+igKIq6RFWoVAdfhIiG6q2Nu2phS7h6+z0HXgAJd0wdyE/Y8AAAAABJRU5ErkJggg=="

/***/ }),

/***/ "./assets/js/develop/agent1/index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _company_index = __webpack_require__("./assets/js/develop/agent1/company_index.js");

	var _company_index2 = _interopRequireDefault(_company_index);

	var _company_detail_time = __webpack_require__("./assets/js/develop/agent1/company_detail_time.js");

	var _company_detail_time2 = _interopRequireDefault(_company_detail_time);

	var _company_detail_department = __webpack_require__("./assets/js/develop/agent1/company_detail_department.js");

	var _company_detail_department2 = _interopRequireDefault(_company_detail_department);

	var _department_index = __webpack_require__("./assets/js/develop/agent1/department_index.js");

	var _department_index2 = _interopRequireDefault(_department_index);

	var _department_detail_time = __webpack_require__("./assets/js/develop/agent1/department_detail_time.js");

	var _department_detail_time2 = _interopRequireDefault(_department_detail_time);

	var _user_index = __webpack_require__("./assets/js/develop/agent1/user_index.js");

	var _user_index2 = _interopRequireDefault(_user_index);

	var _system_index = __webpack_require__("./assets/js/develop/agent1/system_index.js");

	var _system_index2 = _interopRequireDefault(_system_index);

	var _system_index_company = __webpack_require__("./assets/js/develop/agent1/system_index_company.js");

	var _system_index_company2 = _interopRequireDefault(_system_index_company);

	var _system_detail_time = __webpack_require__("./assets/js/develop/agent1/system_detail_time.js");

	var _system_detail_time2 = _interopRequireDefault(_system_detail_time);

	var _system_detail_department = __webpack_require__("./assets/js/develop/agent1/system_detail_department.js");

	var _system_detail_department2 = _interopRequireDefault(_system_detail_department);

	var _system_detail_department_one = __webpack_require__("./assets/js/develop/agent1/system_detail_department_one.js");

	var _system_detail_department_one2 = _interopRequireDefault(_system_detail_department_one);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*localStorage.uDataLimit = '0';*/

	exports.default = {

		Index: function Index() {
			var uDataLimit = localStorage.uDataLimit;
			console.log(uDataLimit + '  uDataLimit + s');
			switch (uDataLimit) {
				case '0':
					//用户级
					new _user_index2.default();
					break;
				case '1':
					//部门级
					new _department_index2.default();
					break;
				case '2':
					//单位级
					new _company_index2.default();
					break;
				case '3':
					//系统级
					new _system_index2.default();
					break;
			}
		},
		Time: function Time() {
			var uDataLimit = localStorage.uDataLimit;

			switch (uDataLimit) {
				case '0':
					//用户级			   
					break;
				case '1':
					//部门级
					new _department_detail_time2.default();
					break;
				case '2':
					//单位级
					new _company_detail_time2.default();
					break;
				case '3':
					//系统级
					new _system_detail_time2.default();
					break;

			}
		},
		Department: function Department() {
			var uDataLimit = localStorage.uDataLimit;

			switch (uDataLimit) {
				case '0':
					//用户级
					break;
				case '1':
					//部门级
					break;
				case '2':
					//单位级
					new _company_detail_department2.default();
					break;
				case '3':
					//系统级
					new _system_detail_department2.default();
					break;

			}
		},
		SystemIndex: function SystemIndex() {
			var uDataLimit = localStorage.uDataLimit;

			switch (uDataLimit) {
				case '0':
					//用户级
					break;
				case '1':
					//部门级
					break;
				case '2':
					//单位级
					break;
				case '3':
					//系统级
					new _system_index_company2.default();
					break;
			}
		},
		DepartmentOne: function DepartmentOne() {
			var uDataLimit = localStorage.uDataLimit;

			switch (uDataLimit) {
				case '0':
					//用户级
					break;
				case '1':
					//部门级
					break;
				case '2':
					//单位级
					break;
				case '3':
					//系统级
					new _system_detail_department_one2.default();
					break;

			}
		}

	};

/***/ }),

/***/ "./assets/js/develop/agent1/company_index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
		this.Init();
		this.Event();
		_common2.default.dateEnabled();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_global2.default.GetTpl({
				url: '/agent1/company/index_company.tpl',
				data: {},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.RenderChart();
					_this.RenderTableDepartment();
				}
			});
		},
		RenderChart: function RenderChart() {
			var _this = this;
			var comPram = this.GetCommonPram();
			var chartPram = {
				queryType: comPram.pagaType,
				endDate: comPram.end,
				startDate: comPram.start
			};
			_ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
				_global2.default.GetTpl({
					url: '/agent1/chart.tpl',
					data: {},
					success: function success(html) {
						(0, _jquery2.default)('#chart').html(html);
						_ChartRender2.default.Render(chartData);
					}
				});
			});
		},
		RenderTableDepartment: function RenderTableDepartment() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType
			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				resData.sumType = comPram.route;
				resData.list.forEach(function (item) {
					item.departName = encodeURIComponent(item.departmentName);
				});
				_global2.default.GetTpl({
					url: '/agent1/company/index_table_department.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},
		RenderTableTime: function RenderTableTime() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType
			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				resData.sumType = comPram.route;
				resData.list.forEach(function (item) {
					item.timeName = encodeURIComponent(item.timeRange);
				});
				_global2.default.GetTpl({
					url: '/agent1/company/index_table_time.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},

		GetCommonPram: function GetCommonPram(date) {
			var _this = this;
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getCurPram(route);
			var pram = {
				route: route,
				pagaType: _date_new2.default['index'][route],
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value
			};
			return pram;
		},
		renderFn: function renderFn(type) {
			var _this = this;
			if (type == '115') {
				_this.RenderTableDepartment();
			} else if (type == '125') {
				_this.RenderTableTime();
			}
		},
		Event: function Event() {
			var _this = this;
			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var _self = (0, _jquery2.default)(this);
				var type = _self.attr('tableType');
				_self.addClass('active').siblings('.tab').removeClass('active');
				_this.renderFn(type);
			});
			(0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
			(0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
				_this.RenderChart();
				var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
				_this.renderFn(type);
			});
		}

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/less/develop/sales.less":
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/sales.less");
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/sales.less", function() {
				var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/sales.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/sales.less":
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
	// imports


	// module
	exports.push([module.id, "/*\n\tauthor : zhupinglei,\n\tdesc : 浏览器重置\n*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  -webkit-user-select: none;\n  /* 禁止选中文本（如无文本选中需求，此为必选项） */\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  background-color: #f3f5f9;\n}\nbody div,\nbody dl,\nbody dt,\nbody dd,\nbody ul,\nbody ol,\nbody li,\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5,\nbody h6,\nbody pre,\nbody form,\nbody fieldset,\nbody input,\nbody p,\nbody a,\nbody blockquote,\nbody th,\nbody i,\nbody u,\nbody span {\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\nbody ol,\nbody ul {\n  list-style: none;\n}\nbody u,\nbody i {\n  font-weight: normal;\n  font-style: normal;\n}\nbody a {\n  color: #333;\n  text-decoration: none;\n}\nbody a,\nbody img {\n  -webkit-touch-callout: none;\n  /* 禁止长按链接与图片弹出菜单 */\n}\nbody input,\nbody select,\nbody button,\nbody textarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -o-appearance: none;\n  border: none;\n  background-color: #fff;\n  margin: 0;\n  padding: 0;\n  resize: none;\n  outline: none;\n  border-radius: 0;\n}\nbody table {\n  border-collapse: collapse;\n  border-spacing: 0px;\n}\nbody .clearfix {\n  *zoom: 1;\n}\nbody .clearfix:after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  visibility: hidden;\n  content: \".\";\n}\nbody {\n  background-color: #f3f5f9;\n}\n/*----------用来移除向下箭头----------*/\n/*input[type=\"date\"]::-webkit-calendar-picker-indicator {\n   display: none;\n}*/\n/*----------用来移除叉叉按钮----------*/\n/*input[type=\"date\"]::-webkit-clear-button{\n   display:none;\n}*/\n#popup-loading {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -30px;\n  margin-top: -50px;\n  z-index: 100;\n  background: url(" + __webpack_require__("./assets/img/loading.gif") + ") center center no-repeat;\n  background-size: 30px 30px;\n  background-color: rgba(255, 255, 255, 0.6);\n  border-radius: 10px;\n}\n#popup-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.1);\n  z-index: 99;\n}\n#popup-tip {\n  width: 180px;\n  line-height: 16px;\n  color: #fff;\n  background-color: #000000;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -105px;\n  margin-top: -30px;\n  z-index: 100;\n  text-align: center;\n}\n#popup-info {\n  word-wrap: break-word;\n  width: 200px;\n  line-height: 20px;\n  color: #333;\n  background-color: #fff;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 30%;\n  margin-left: -115px;\n  z-index: 100;\n  box-shadow: 0px 0px 2px #ccc;\n}\n#popup-info .popup-confirm .popup-content {\n  height: 100px;\n  background: url(" + __webpack_require__("./assets/img/guide/warr.png") + ") center 30% no-repeat;\n  background-size: 52px auto;\n}\n#popup-info .popup-confirm .popup-content .popup-txt {\n  position: relative;\n  top: 80px;\n  text-align: center;\n}\n#popup-info .popup-confirm .popup-foot {\n  position: relative;\n  height: 43px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel,\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  line-height: 43px;\n  font-size: 14px;\n  text-align: center;\n  height: 43px;\n  width: 57%;\n  position: absolute;\n  box-sizing: border-box;\n  bottom: -16px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel {\n  color: #666;\n  left: -15px;\n  border-top: 1px solid #e7e7e7;\n}\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  color: #fff;\n  background: #fc2a35;\n  right: -15px;\n}\n#wrap #sales {\n  padding-bottom: 50px;\n  box-sizing: border-box;\n}\n#wrap #sales .acti_header {\n  height: 40px;\n  font-size: 14px;\n  width: 100%;\n  margin-bottom: 2px;\n  position: relative;\n  z-index: 5;\n}\n#wrap #sales .screen {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n  z-index: -1;\n  opacity: 0;\n}\n#wrap #sales .screen .sha {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 50px;\n  width: 100vw;\n}\n#wrap #sales .screen .son {\n  padding-top: 12px;\n  padding-right: 15px;\n  box-sizing: border-box;\n  width: 100vh;\n  height: 100vw;\n  background-color: #fff;\n  transform: rotate(0deg);\n  -webkit-transform: rotate(0deg);\n  -moz-transform: rotate(0deg);\n  -o-transform: rotate(0deg);\n  transition: all 0.3s ease-in-out;\n  -webkit-transition: all 0.3s ease-in-out;\n  -moz-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transform-origin: 50vw 50vw;\n}\n#wrap #sales .screen .son .ave {\n  width: 100%;\n  height: 100%;\n}\n#wrap #sales .screen .clear {\n  color: #fff;\n  text-align: center;\n  line-height: 30px;\n  font-size: 25px;\n  background-color: rgba(0, 0, 0, 0.4);\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  position: fixed;\n  top: 15px;\n  right: 30px;\n}\n#wrap #sales .screen.active {\n  opacity: 1;\n  z-index: 99;\n}\n#wrap #sales .screen.active .son {\n  transform: rotate(90deg);\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n}\n#wrap #sales .count {\n  position: relative;\n  width: 100%;\n  height: 290px;\n  /*background-color: #fff;*/\n  box-sizing: border-box;\n  padding: 15px;\n  padding-top: 10px;\n  background-color: rgba(255, 255, 255, 0);\n}\n#wrap #sales .count .time {\n  width: 100%;\n  height: 30px;\n  box-sizing: border-box;\n  border-bottom: 1px solid #e7e7e7;\n  line-height: 30px;\n  overflow: hidden;\n  font-size: 10px;\n  color: #999;\n}\n#wrap #sales .count .time h2 {\n  font-size: 10px;\n  height: 100%;\n  width: 70px;\n  float: left;\n}\n#wrap #sales .count .time .day {\n  margin-left: 70px;\n  text-align: right;\n  overflow: hidden;\n}\n#wrap #sales .count .shade {\n  position: absolute;\n  width: 100vw;\n  height: 208px;\n  top: 42px;\n  left: 0;\n}\n#wrap #sales .count .char {\n  height: 260px;\n}\n#wrap #sales .count.disable {\n  visibility: hidden;\n}\n#wrap #sales .record {\n  background-color: #fff;\n}\n#wrap #sales .record .switch {\n  height: auto;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 5px 0 12px;\n  background: -webkit-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Safari 5.1 - 6.0 */\n  background: -o-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Opera 11.1 - 12.0 */\n  background: -moz-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Firefox 3.6 - 15 */\n  background: linear-gradient(180deg, #6186f8, #5266e1);\n}\n#wrap #sales .record .switch .ul-bag {\n  padding: 0 10px;\n}\n#wrap #sales .record .switch .ul-bag ul {\n  border-radius: 6px;\n  border: 1px solid #fff;\n  overflow: hidden;\n  height: 34px;\n  display: flex;\n  display: -webkit-flex;\n}\n#wrap #sales .record .switch .ul-bag ul li {\n  flex: 1;\n  font-size: 12px;\n  color: #fff;\n  height: 100%;\n  text-align: center;\n  float: left;\n  box-sizing: border-box;\n  border-right: 1px solid #fff;\n}\n#wrap #sales .record .switch .ul-bag ul li a {\n  display: inline-block;\n  height: 100%;\n  width: 100%;\n  line-height: 34px;\n  color: #fff;\n}\n#wrap #sales .record .switch .ul-bag ul li:last-child {\n  border-right: none ;\n}\n#wrap #sales .record .switch .ul-bag ul li.active {\n  background-color: #fff;\n  color: #5575e2;\n}\n#wrap #sales .record .switch .ul-bag ul li.active a {\n  color: #5575e2;\n}\n#wrap #sales .record .mation-txt {\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n}\n#wrap #sales .record .tato {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n  background-color: #fff;\n  border-top: 1px solid #e7e7e7;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: flex-start;\n}\n#wrap #sales .record .tato .sum {\n  background-color: #587de5;\n  font-size: 14px;\n  color: #fff;\n  line-height: 52px;\n  width: 80px;\n}\n#wrap #sales .record .tato .col {\n  flex: 1;\n  padding: 5px 0 5px 36px;\n}\n#wrap #sales .record .tato .col p {\n  font-size: 16px;\n  color: #333;\n  line-height: 20px;\n  text-align: left;\n}\n#wrap #sales .record .tato .col p.grey-font {\n  font-size: 12px;\n  color: #999;\n  line-height: 20px;\n}\n#wrap #sales .record .count {\n  border-bottom: 0;\n  padding-bottom: 10px;\n}\n#wrap #sales .record .tab-wrap {\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 0 10px #ddd;\n  position: relative;\n  left: 0;\n  top: -20px;\n  background-color: #fff;\n}\n#wrap #sales .record .tab-wrap div.tab {\n  flex: 1;\n  padding: 10px 0;\n  border-bottom: 2px solid #ffffff;\n  text-align: center;\n  position: relative;\n  box-sizing: border-box;\n}\n#wrap #sales .record .tab-wrap div.tab.active {\n  color: #587de5;\n}\n#wrap #sales .record .tab-wrap div.tab:after {\n  display: block;\n  content: '';\n  position: absolute;\n  right: -1px;\n  top: 10px;\n  height: 18px;\n  width: 1px;\n  border-right: 2px dotted #e1e1e1;\n}\n#wrap #sales .record .tab-wrap div.tab:last-child:after {\n  border-right: 0;\n}\n#wrap #sales .record .tab-bg {\n  height: 20px;\n  background-color: #f7f7f7;\n  margin-top: 20px;\n  padding: 0 10px;\n}\n#wrap #sales .record .table-wrap {\n  background-color: #f7f7f7;\n}\n#wrap #sales .record .table-wrap div.cont {\n  display: none;\n}\n#wrap #sales .record .table-wrap table {\n  text-align: center;\n  border-collapse: collapse;\n  width: 100%;\n}\n#wrap #sales .record .table-wrap table thead {\n  background-color: #f7f7f7;\n  border: 0;\n}\n#wrap #sales .record .table-wrap table thead tr {\n  height: 40px;\n}\n#wrap #sales .record .table-wrap table thead tr th {\n  font-size: 12px;\n  color: #999;\n}\n#wrap #sales .record .table-wrap table thead tr th:first-child {\n  width: 10px;\n}\n#wrap #sales .record .table-wrap table thead tr th:last-child {\n  width: 10px;\n}\n#wrap #sales .record .table-wrap table thead tr th:nth-child(2) {\n  text-align: left;\n  padding-left: 6px;\n}\n#wrap #sales .record .table-wrap table tbody tr {\n  height: 46px;\n}\n#wrap #sales .record .table-wrap table tbody tr td {\n  font-size: 12px;\n  color: #333;\n  border-bottom: 5px solid #f7f7f7;\n  background-color: #fff;\n}\n#wrap #sales .record .table-wrap table tbody tr td a {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n#wrap #sales .record .table-wrap table tbody tr td:first-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #sales .record .table-wrap table tbody tr td:last-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #sales .record .table-wrap table tbody tr td:nth-child(2) {\n  text-align: left;\n}\n#wrap #sales .record .table-wrap table tbody tr:last-child td {\n  border-bottom: none !important;\n}\n#wrap #sales .record .table-wrap table tbody tr.border-bottom {\n  height: 36px;\n}\n#wrap #sales .record .table-wrap table tbody tr.border-bottom td {\n  border-bottom: 1px solid #f7f7f7;\n}\n#wrap #sales .record .table-wrap table tbody tr.border-bottom td:first-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #sales .record .table-wrap table tbody tr.border-bottom td:last-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom {\n  height: 30px;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom td {\n  font-size: 10px;\n  color: #999;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom td.div-wrap {\n  position: relative;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap {\n  position: absolute;\n  left: 0;\n  top: 0;\n  line-height: 30px;\n  min-width: 350px;\n  height: 30px;\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span {\n  display: inline-block;\n  text-align: left;\n}\n#wrap #sales .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span:first-child {\n  margin-right: 5px;\n  width: 150px;\n}\n#wrap #sales .record .table-wrap .mation-txt {\n  background-color: #fff;\n}\n#wrap #sales .record .table-index {\n  margin-top: 0;\n  padding-top: 0;\n}\n#wrap #sales .record #content .data-null {\n  display: none;\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n  position: relative;\n  top: -280px;\n  z-index: 4;\n}\n#wrap #sales .record #content table tr td.arrow-right a {\n  position: relative;\n}\n#wrap #sales .record #content table tr td.arrow-right a:after {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  margin-top: -4px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #656565;\n  border-right: 1px solid #656565;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n#wrap #sales .record .title {\n  margin: 0 10px;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  border-bottom: 1px solid #ddd;\n}\n#wrap #sales .record .title h2 {\n  position: absolute;\n  left: 0;\n  top: -123px;\n  height: 26px;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #sales .record .title h2 a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  position: absolute;\n  right: -10px;\n  top: -5px;\n  z-index: 11;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #sales .record .title h2 span.bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n}\n#wrap #sales .record .title h2 span.bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #sales .record .tim {\n  font-size: 14px;\n  color: #ff2d55;\n}\n#wrap #sales .record .tim label {\n  display: block;\n}\n#wrap #sales .record .tim input {\n  width: 100%;\n  color: #5575e2;\n  text-align: right;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") 85% no-repeat;\n  background-size: 11px 6px;\n  margin-left: -20px;\n  font-size: 14px;\n}\n#wrap #sales .record .tim div.active {\n  display: block;\n}\n#wrap #sales .record .tim div.day {\n  margin-right: -10px;\n}\n#wrap #sales .record .tim div.day input {\n  width: 140px;\n}\n#wrap #sales .record .tim div.month {\n  margin-right: -20px;\n}\n#wrap #sales .record .tim div.month input {\n  width: 105px;\n}\n#wrap #sales .record .tim div.year select {\n  direction: rtl;\n}\n#wrap #sales .record .tim select {\n  padding-right: 16px;\n  color: #5575e2;\n  font-size: 14px;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") right no-repeat;\n  background-size: 11px 6px;\n  width: 100%;\n  height: 20px;\n  line-height: 20px;\n}\n#wrap #sales .record .date-wrap {\n  margin: 0 10px;\n}\n#wrap #sales .record .date-wrap .tim div {\n  display: none;\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 !important;\n}\n#wrap #sales .record .date-wrap .tim div input {\n  margin: 0 !important;\n  text-align: left;\n}\n#wrap #sales .record .date-wrap .tim div select {\n  width: auto;\n}\n#wrap #sales .record .date-wrap .tim div.active {\n  display: block;\n}\n#wrap #sales .record .date-wrap .tim div.day input {\n  width: 132px;\n}\n#wrap #sales .record .date-wrap .tim div.day span {\n  vertical-align: top;\n  display: inline-block;\n  color: #5575e2;\n  padding-right: 10px;\n}\n#wrap #sales .record .title_header {\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #sales .record .title_header a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #sales .record .title_header .bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n  position: relative;\n  margin-left: 10px;\n}\n#wrap #sales .record .title_header .bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #sales .record .no-tab .table-wrap {\n  padding-top: 2px;\n}\n#wrap #sales .record .count {\n  padding-bottom: 10px;\n}\n#wrap #sales tbody tr:last-child td {\n  border-bottom: none!important;\n}\n#wrap #sales tbody td.next-page {\n  width: 15px;\n  border-bottom: 1px solid #e7e7e7!important;\n}\n#wrap #sales tbody td.next-page img {\n  width: 8px;\n  position: relative;\n  top: 2px;\n}\n#wrap #sales tbody td:last-child {\n  width: 15px;\n  border-bottom: none!important;\n}\n#wrap #sales .sales-table tbody p {\n  color: #999;\n}\n", ""]);

	// exports


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

/***/ "./assets/js/develop/agent1/ajaxCommon.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _promise = __webpack_require__("./node_modules/babel-runtime/core-js/promise.js");

	var _promise2 = _interopRequireDefault(_promise);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		ChartAjax: function ChartAjax(pram) {
			var _this = this;
			return new _promise2.default(function (resolve, reject) {
				_global2.default.Ajax({
					url: '/agentDistChart/chartData',
					type: 'post',
					data: pram,
					success: function success(res) {
						if (res.code == 200) {
							var resData = res.data;
							resolve(resData);
						}
					}
				});
			});
		},

		tabbleOfAgent: function tabbleOfAgent(pram) {
			var _this = this;
			return new _promise2.default(function (resolve, reject) {
				_global2.default.Ajax({
					url: '/agentStatistics/agentStatistics',
					type: 'post',
					data: pram,
					success: function success(res) {
						if (res.code == 200) {
							var resData = res.body;
							resolve(resData);
						}
					}
				});
			});
		}

	};

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/promise.js":
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__("./node_modules/core-js/library/fn/promise.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/core-js/library/fn/promise.js":
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__("./node_modules/core-js/library/modules/es6.object.to-string.js");
	__webpack_require__("./node_modules/core-js/library/modules/es6.string.iterator.js");
	__webpack_require__("./node_modules/core-js/library/modules/web.dom.iterable.js");
	__webpack_require__("./node_modules/core-js/library/modules/es6.promise.js");
	__webpack_require__("./node_modules/core-js/library/modules/es7.promise.finally.js");
	__webpack_require__("./node_modules/core-js/library/modules/es7.promise.try.js");
	module.exports = __webpack_require__("./node_modules/core-js/library/modules/_core.js").Promise;


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.promise.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__("./node_modules/core-js/library/modules/_library.js");
	var global = __webpack_require__("./node_modules/core-js/library/modules/_global.js");
	var ctx = __webpack_require__("./node_modules/core-js/library/modules/_ctx.js");
	var classof = __webpack_require__("./node_modules/core-js/library/modules/_classof.js");
	var $export = __webpack_require__("./node_modules/core-js/library/modules/_export.js");
	var isObject = __webpack_require__("./node_modules/core-js/library/modules/_is-object.js");
	var aFunction = __webpack_require__("./node_modules/core-js/library/modules/_a-function.js");
	var anInstance = __webpack_require__("./node_modules/core-js/library/modules/_an-instance.js");
	var forOf = __webpack_require__("./node_modules/core-js/library/modules/_for-of.js");
	var speciesConstructor = __webpack_require__("./node_modules/core-js/library/modules/_species-constructor.js");
	var task = __webpack_require__("./node_modules/core-js/library/modules/_task.js").set;
	var microtask = __webpack_require__("./node_modules/core-js/library/modules/_microtask.js")();
	var newPromiseCapabilityModule = __webpack_require__("./node_modules/core-js/library/modules/_new-promise-capability.js");
	var perform = __webpack_require__("./node_modules/core-js/library/modules/_perform.js");
	var promiseResolve = __webpack_require__("./node_modules/core-js/library/modules/_promise-resolve.js");
	var PROMISE = 'Promise';
	var TypeError = global.TypeError;
	var process = global.process;
	var $Promise = global[PROMISE];
	var isNode = classof(process) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[__webpack_require__("./node_modules/core-js/library/modules/_wks.js")('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch (e) { /* empty */ }
	}();

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = perform(function () {
	        if (isNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else if (handler = global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(global, function () {
	    var handler;
	    if (isNode) {
	      process.emit('rejectionHandled', promise);
	    } else if (handler = global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__("./node_modules/core-js/library/modules/_redefine-all.js")($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__("./node_modules/core-js/library/modules/_set-to-string-tag.js")($Promise, PROMISE);
	__webpack_require__("./node_modules/core-js/library/modules/_set-species.js")(PROMISE);
	Wrapper = __webpack_require__("./node_modules/core-js/library/modules/_core.js")[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("./node_modules/core-js/library/modules/_iter-detect.js")(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});


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

/***/ "./node_modules/core-js/library/modules/_an-instance.js":
/***/ (function(module, exports) {

	module.exports = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_for-of.js":
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__("./node_modules/core-js/library/modules/_ctx.js");
	var call = __webpack_require__("./node_modules/core-js/library/modules/_iter-call.js");
	var isArrayIter = __webpack_require__("./node_modules/core-js/library/modules/_is-array-iter.js");
	var anObject = __webpack_require__("./node_modules/core-js/library/modules/_an-object.js");
	var toLength = __webpack_require__("./node_modules/core-js/library/modules/_to-length.js");
	var getIterFn = __webpack_require__("./node_modules/core-js/library/modules/core.get-iterator-method.js");
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
	  var f = ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-call.js":
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__("./node_modules/core-js/library/modules/_an-object.js");
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-array-iter.js":
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__("./node_modules/core-js/library/modules/_iterators.js");
	var ITERATOR = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('iterator');
	var ArrayProto = Array.prototype;

	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
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

/***/ "./node_modules/core-js/library/modules/_species-constructor.js":
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__("./node_modules/core-js/library/modules/_an-object.js");
	var aFunction = __webpack_require__("./node_modules/core-js/library/modules/_a-function.js");
	var SPECIES = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('species');
	module.exports = function (O, D) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_task.js":
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__("./node_modules/core-js/library/modules/_ctx.js");
	var invoke = __webpack_require__("./node_modules/core-js/library/modules/_invoke.js");
	var html = __webpack_require__("./node_modules/core-js/library/modules/_html.js");
	var cel = __webpack_require__("./node_modules/core-js/library/modules/_dom-create.js");
	var global = __webpack_require__("./node_modules/core-js/library/modules/_global.js");
	var process = global.process;
	var setTask = global.setImmediate;
	var clearTask = global.clearImmediate;
	var MessageChannel = global.MessageChannel;
	var Dispatch = global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (__webpack_require__("./node_modules/core-js/library/modules/_cof.js")(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
	    defer = function (id) {
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in cel('script')) {
	    defer = function (id) {
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set: setTask,
	  clear: clearTask
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_invoke.js":
/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_microtask.js":
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__("./node_modules/core-js/library/modules/_global.js");
	var macrotask = __webpack_require__("./node_modules/core-js/library/modules/_task.js").set;
	var Observer = global.MutationObserver || global.WebKitMutationObserver;
	var process = global.process;
	var Promise = global.Promise;
	var isNode = __webpack_require__("./node_modules/core-js/library/modules/_cof.js")(process) == 'process';

	module.exports = function () {
	  var head, last, notify;

	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise && Promise.resolve) {
	    var promise = Promise.resolve();
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }

	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};


/***/ }),

/***/ "./assets/less/develop/agent.less":
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent.less");
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent.less", function() {
				var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/agent.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ "./node_modules/core-js/library/modules/_perform.js":
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_promise-resolve.js":
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__("./node_modules/core-js/library/modules/_an-object.js");
	var isObject = __webpack_require__("./node_modules/core-js/library/modules/_is-object.js");
	var newPromiseCapability = __webpack_require__("./node_modules/core-js/library/modules/_new-promise-capability.js");

	module.exports = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_redefine-all.js":
/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__("./node_modules/core-js/library/modules/_hide.js");
	module.exports = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-species.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__("./node_modules/core-js/library/modules/_global.js");
	var core = __webpack_require__("./node_modules/core-js/library/modules/_core.js");
	var dP = __webpack_require__("./node_modules/core-js/library/modules/_object-dp.js");
	var DESCRIPTORS = __webpack_require__("./node_modules/core-js/library/modules/_descriptors.js");
	var SPECIES = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('species');

	module.exports = function (KEY) {
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iter-detect.js":
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__("./node_modules/core-js/library/modules/_wks.js")('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }

	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.promise.finally.js":
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-promise-finally
	'use strict';
	var $export = __webpack_require__("./node_modules/core-js/library/modules/_export.js");
	var core = __webpack_require__("./node_modules/core-js/library/modules/_core.js");
	var global = __webpack_require__("./node_modules/core-js/library/modules/_global.js");
	var speciesConstructor = __webpack_require__("./node_modules/core-js/library/modules/_species-constructor.js");
	var promiseResolve = __webpack_require__("./node_modules/core-js/library/modules/_promise-resolve.js");

	$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
	  var C = speciesConstructor(this, core.Promise || global.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es7.promise.try.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-promise-try
	var $export = __webpack_require__("./node_modules/core-js/library/modules/_export.js");
	var newPromiseCapability = __webpack_require__("./node_modules/core-js/library/modules/_new-promise-capability.js");
	var perform = __webpack_require__("./node_modules/core-js/library/modules/_perform.js");

	$export($export.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = newPromiseCapability.f(this);
	  var result = perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });


/***/ }),

/***/ "./assets/js/develop/agent1/ChartRender.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
					value: true
	});

	var _defineProperty2 = __webpack_require__("./node_modules/babel-runtime/helpers/defineProperty.js");

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {

					Render: function Render(res) {
									var _ref;

									var _this = this;
									var rights = '5.3%';
									var blueC = '#5f98e7';
									var orangeC = '#ffa01e';
									if ((0, _jquery2.default)('#header .ul-bag .rig').hasClass('active')) {
													rights = '8%';
									}
									// 指定图表的配置项和数据
									var option = {
													legend: {
																	left: 'center',
																	data: ['代理人新增人数趋势', '代理人累计趋势']
													},
													yAxis: [{
																	axisLabel: {
																					show: true,
																					textStyle: {
																									color: '#6d7783'
																					}
																	},
																	splitLine: {
																					show: true,
																					//  改变轴线颜色
																					lineStyle: {
																									// 使用深浅的间隔色
																									color: ['#f2f2f2']
																					}
																	},
																	axisLine: {
																					lineStyle: {
																									type: 'solid',
																									color: '#dedede'

																					}
																	}
													}],
													xAxis: [(_ref = {
																	type: 'category',
																	axisLine: { onZero: false },
																	axisLabel: {
																					show: true,
																					textStyle: {
																									color: '#6d7783',
																									fonsSize: 10
																					}
																	},
																	splitLine: {
																					show: true,
																					//  改变轴线颜色
																					lineStyle: {
																									// 使用深浅的间隔色
																									color: ['#f2f2f2']
																					}
																	}
													}, (0, _defineProperty3.default)(_ref, 'axisLine', {
																	lineStyle: {
																					type: 'solid',
																					color: '#dedede'
																	}
													}), (0, _defineProperty3.default)(_ref, 'boundaryGap', false), (0, _defineProperty3.default)(_ref, 'data', res.dateStringList), _ref)],
													grid: {
																	left: '3%',
																	top: '21%',
																	right: rights,
																	bottom: '8%',
																	containLabel: true
													},
													series: [{
																	name: '代理人新增人数趋势',
																	type: 'line',
																	itemStyle: {
																					normal: {
																									color: blueC,
																									lineStyle: {
																													color: blueC
																									}
																					}
																	},
																	label: { normal: {
																									show: true,
																									position: 'top',
																									distance: 0
																					} },
																	// data: [1000, 1500, 900, 741, 1223, 1669 ]
																	data: res.todayAgentList
													}, {
																	name: '代理人累计趋势',
																	type: 'line',
																	itemStyle: {
																					normal: {
																									color: orangeC,
																									lineStyle: {
																													color: orangeC
																									}
																					}
																	},
																	label: { normal: {
																									show: true,
																									position: 'top',
																									distance: 0
																					} },
																	// data: [500, 100, 400, 1000, 16, 32, 64, 128, 256]
																	data: res.allAgentList
													}]
									};
									_global2.default.EchartsInit("#agent .char", option);
									option.xAxis[0].axisLabel = {
													show: true,
													textStyle: {
																	color: '#6d7783',
																	fontSize: 8
													},
													interval: 0,
													rotate: 40
									};
									_global2.default.EchartsInit("#agent .screen .son .ave", option);

									if (res.allAgentList.length < 1 && res.todayAgentList.length < 1) {
													(0, _jquery2.default)('#content .data-null').show();
									} else {
													(0, _jquery2.default)('#content .data-null').hide();
									}
					}

	};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/defineProperty.js":
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__("./node_modules/babel-runtime/core-js/object/define-property.js");

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/define-property.js":
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__("./node_modules/core-js/library/fn/object/define-property.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/define-property.js":
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__("./node_modules/core-js/library/modules/es6.object.define-property.js");
	var $Object = __webpack_require__("./node_modules/core-js/library/modules/_core.js").Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.define-property.js":
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__("./node_modules/core-js/library/modules/_export.js");
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__("./node_modules/core-js/library/modules/_descriptors.js"), 'Object', { defineProperty: __webpack_require__("./node_modules/core-js/library/modules/_object-dp.js").f });


/***/ }),

/***/ "./assets/js/develop/common/common.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    Init: function Init() {
	        this.dateTabInit();
	        this.EventInit();
	    },
	    dateDisabled: function dateDisabled() {
	        (0, _jquery2.default)('.tim input').attr('disabled', true);
	        (0, _jquery2.default)('.tim input').css('color', '#999');
	        (0, _jquery2.default)('.tim select').attr('disabled', true);
	        (0, _jquery2.default)('.tim select').css('color', '#999');
	    },
	    dateEnabled: function dateEnabled() {
	        (0, _jquery2.default)('.date-wrap .tim input').attr('disabled', false);
	        (0, _jquery2.default)('.date-wrap .tim input').css('color', '#5575e2');
	        (0, _jquery2.default)('.date-wrap .tim select').attr('disabled', false);
	        (0, _jquery2.default)('.date-wrap .tim select').css('color', '#5575e2');
	    },
	    getDateFormat: function getDateFormat(date) {
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
	            year: year,
	            month: month,
	            day: day,
	            monthFormat: year + '-' + month,
	            dateFormat: year + '-' + month + '-' + day
	        };
	    },
	    dateTabInit: function dateTabInit() {
	        var route = _global2.default.GetPage().parentPage;
	        (0, _jquery2.default)("#header .ul-bag li").each(function () {
	            var self = (0, _jquery2.default)(this);
	            var selfAname = self.find('a').attr('href');
	            selfAname = selfAname.split('#')[1];
	            selfAname = selfAname.split('/')[0];
	            if (selfAname === route) {
	                self.addClass('active').siblings('li').removeClass('active');
	            }
	        });
	    },
	    DateInit: function DateInit() {
	        var _this = this;
	        (0, _jquery2.default)("#header .tim select").find('option:last').prop("selected", "selected");
	        var date = new Date();
	        var curDate = _this.getDateFormat(date).dateFormat;
	        var curMonth = _this.getDateFormat(date).monthFormat;
	        (0, _jquery2.default)("#header .tim .day").find('input').val(curDate);
	        (0, _jquery2.default)("#header .tim .month").find('input').val(curMonth);
	    },
	    EventInit: function EventInit() {
	        var _this = this;

	        (0, _jquery2.default)("#header").on("click", '.ul-bag li', function () {
	            (0, _jquery2.default)(".switch ul li").removeClass('active');
	            (0, _jquery2.default)(this).addClass("active");
	            if ((0, _jquery2.default)("#person")[0]) {
	                _date_new2.default.clearPersonDate();
	            } else {
	                _date_new2.default.clearDate();
	            }
	        });

	        //返回上一页
	        (0, _jquery2.default)("#content,.title_header").on("click", '.bg_ing', function () {
	            var curPage = _global2.default.GetPage().curPage;
	            var route = _global2.default.GetPage().parentPage;
	            var pathname = window.location.pathname;
	            pathname = pathname.replace('/wap/n/', '');
	            pathname = pathname.replace('/', '');
	            var uDataLimit = localStorage.uDataLimit;

	            if (curPage === 'detail' || curPage === 'department' || curPage === 'time' || curPage === 'system' || curPage === 'departmentOne') {
	                window.history.go(-1);
	                // window.location.href = pathname+'#'+route;
	            } else {
	                window.location.href = 'list.html';
	            }
	        });

	        (0, _jquery2.default)("#content").on("click", '.count .shade', function () {
	            console.log('sreen');
	            (0, _jquery2.default)(".screen").addClass("active");
	            (0, _jquery2.default)(".count").addClass('disable');
	            (0, _jquery2.default)(".record").addClass('disable');
	        });
	        (0, _jquery2.default)("#content").on("click", '.clear', function () {
	            (0, _jquery2.default)(".screen").removeClass("active");
	            (0, _jquery2.default)(".count").removeClass('disable');
	            (0, _jquery2.default)(".record").removeClass('disable');
	        });

	        var wid = document.documentElement.clientWidth;
	        var hei = document.documentElement.clientHeight;
	        (0, _jquery2.default)(".screen").css("width", wid);
	        (0, _jquery2.default)(".screen").css("height", hei);

	        (0, _jquery2.default)(".screen .son").css("width", hei);
	        (0, _jquery2.default)(".screen .son").css("height", wid);
	    },
	    getNewDay: function getNewDay(dateTemp, days) {
	        var dateTemp = dateTemp.split("-");
	        var date = new Date(parseInt(dateTemp[0]), parseInt(dateTemp[1]) - 1, parseInt(dateTemp[2]));
	        date.setDate(date.getDate() + days);
	        var year = date.getFullYear(),
	            month = date.getMonth() + 1,
	            day = date.getDate();
	        if (month < 10) {
	            month = '0' + month;
	        }
	        if (day < 10) {
	            day = '0' + day;
	        }
	        return year + "-" + month + "-" + day;
	    },
	    getWeekDate: function getWeekDate(week, startDate) {
	        var _this = this;
	        switch (week) {
	            case '周一':
	                var tim = _this.getNewDay(startDate, 0);
	                break;
	            case '周二':
	                var tim = _this.getNewDay(startDate, 1);
	                break;
	            case '周三':
	                var tim = _this.getNewDay(startDate, 2);
	                break;
	            case '周四':
	                var tim = _this.getNewDay(startDate, 3);
	                break;
	            case '周五':
	                var tim = _this.getNewDay(startDate, 4);
	                break;
	            case '周六':
	                var tim = _this.getNewDay(startDate, 5);
	                break;
	            case '周日':
	                var tim = _this.getNewDay(startDate, 6);
	                break;
	        }
	        return tim;
	    },
	    getYearDate: function getYearDate(season, startDate) {
	        var year = startDate.substring(0, 4);
	        console.log(year);
	        switch (season) {
	            case '第一季度':
	                var start = year + '-01-01';
	                var end = year + '-03-31';
	                break;
	            case '第二季度':
	                var start = year + '-04-01';
	                var end = year + '-06-30';
	                break;
	            case '第三季度':
	                var start = year + '-07-01';
	                var end = year + '-09-30';
	                break;
	            case '第四季度':
	                var start = year + '-10-01';
	                var end = year + '-12-31';
	                break;
	        }
	        return { start: start, end: end };
	    },
	    getTimeDate: function getTimeDate(time) {
	        var time = time.split('-')[0];

	        return time + ':00';
	    },

	    getPageTypeByTime: function getPageTypeByTime(route, timeRang, timeName) {
	        var _this = this;

	        var returnType = '',
	            queryDate = '',
	            start = '',
	            end = '',
	            startTime = '';

	        switch (route) {
	            case 'day':
	                returnType = '2';
	                queryDate = timeRang;
	                startTime = _this.getTimeDate(timeName);
	                break;
	            case 'week':
	                returnType = '2';
	                var dataStart = timeRang.split('至')[0];
	                queryDate = _this.getWeekDate(timeName, dataStart);
	                start = queryDate;
	                startTime = '';
	                end = "";
	                break;
	            case 'month':
	                returnType = '2';
	                var dateDay = timeName.replace('年', '-');
	                dateDay = dateDay.replace('月', '-');
	                dateDay = dateDay.replace('日', '');
	                queryDate = dateDay;
	                start = queryDate;
	                startTime = '';
	                end = "";
	                break;
	            case 'season':
	                returnType = '1';
	                var dateDay = timeName.replace('年', '-');
	                dateDay = dateDay.replace('月', '');
	                queryDate = dateDay + '-01';
	                start = queryDate;
	                startTime = '';
	                end = "";
	                break;
	            case 'year':
	                returnType = '4';
	                var dataStart = timeRang.split('至')[0];
	                queryDate = _this.getYearDate(timeName, dataStart).start;
	                start = queryDate;
	                end = _this.getYearDate(timeName, dataStart).end;
	                startTime = '';
	                break;
	            default:
	                break;

	        }
	        return {
	            type: returnType,
	            queryDate: queryDate,
	            start: start,
	            end: end,
	            startTime: startTime

	        };
	    },
	    getPageTypeByAgent: function getPageTypeByAgent(route, comPram) {
	        var _this = this;

	        var returnPram = {};

	        switch (route) {
	            case 'day':
	                returnPram = {
	                    queryDate: comPram.start,
	                    queryType: comPram.pagaType
	                };
	                break;
	            case 'week':
	                returnPram = {
	                    startDate: comPram.start,
	                    endDate: comPram.end,
	                    queryType: comPram.pagaType
	                };
	                break;
	            case 'month':
	                returnPram = {
	                    queryDate: comPram.start,
	                    queryType: comPram.pagaType
	                };
	                break;
	            case 'season':
	                returnPram = {
	                    startDate: comPram.start,
	                    endDate: comPram.end,
	                    queryType: comPram.pagaType
	                };
	                break;
	            case 'year':
	                returnPram = {
	                    startDate: comPram.start,
	                    endDate: comPram.end,
	                    queryType: comPram.pagaType
	                };
	                break;
	            default:
	                break;
	        }

	        return returnPram;
	    }

	};

/***/ }),

/***/ "./assets/js/develop/agent1/company_detail_time.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

	    this.Init();
	    this.Event();
	    _common2.default.dateDisabled();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        _global2.default.GetTpl({
	            url: '/agent1/company/time_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTableDepartment();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTableDepartment: function RenderTableDepartment() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var timeLevel = _global2.default.GetUrlPara('timeLevel');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            timeLevel: timeLevel
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/time_table_department.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var timeLevel = _global2.default.GetUrlPara('timeLevel');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            timeLevel: timeLevel
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/time_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '116') {
	            _this.RenderTableDepartment();
	        } else if (type == '136') {
	            _this.RenderTablePerson();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/company_detail_department.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        _global2.default.GetTpl({
	            url: '/agent1/company/department_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTablePerson();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departId: departmentId
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTableTime: function RenderTableTime() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_time.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '231') {
	            _this.RenderTablePerson();
	        } else if (type == '221') {
	            _this.RenderTableTime();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/department_index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	    _common2.default.dateEnabled();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;

	        _global2.default.GetTpl({
	            url: '/agent1/department/index_department.tpl',
	            data: {},
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTablePerson();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/department/index_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTableTime: function RenderTableTime() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            resData.sumType = comPram.route;
	            resData.list.forEach(function (item) {
	                item.timeName = encodeURIComponent(item.timeRange);
	            });
	            _global2.default.GetTpl({
	                url: '/agent1/department/index_table_time.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '231') {
	            _this.RenderTablePerson();
	        } else if (type == '221') {
	            _this.RenderTableTime();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/department_detail_time.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

	    this.Init();
	    this.Event();
	    _common2.default.dateDisabled();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        _global2.default.GetTpl({
	            url: '/agent1/department/time_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTablePerson();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },

	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var timeLevel = _global2.default.GetUrlPara('timeLevel');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: 234,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            timeLevel: timeLevel
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/department/time_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    Event: function Event() {
	        var _this = this;

	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            _this.RenderTablePerson();
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/user_index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        _global2.default.GetTpl({
	            url: '/agent1/user/index_user.tpl',
	            data: {},
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTableTime();
	            }
	        });
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },

	    RenderTableTime: function RenderTableTime() {
	        var _this = this;
	        var comPram = this.GetCommonPram();
	        var pram = {
	            startDate: comPram.start,
	            endDate: comPram.end,
	            tableType: 322,
	            type: comPram.pagaType
	        };
	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            resData.sumType = comPram.route;
	            resData.list.forEach(function (item) {
	                item.timeName = encodeURIComponent(item.timeRange);
	            });
	            _global2.default.GetTpl({
	                url: '/agent1/user/index_table_time.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },

	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            //let type = $(".tab-wrap").find('.active').attr('tableType');
	            _this.RenderTableTime();
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/system_index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
		this.Init();
		this.Event();
		_common2.default.dateEnabled();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_global2.default.GetTpl({
				url: '/agent1/system/index_system.tpl',
				data: {
					pageTitle: name
				},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.RenderChart();
					_this.RenderTableCompany();
				}
			});
		},
		RenderChart: function RenderChart() {
			var _this = this;
			var comPram = this.GetCommonPram();
			var chartPram = {
				queryType: comPram.pagaType,
				endDate: comPram.end,
				startDate: comPram.start
			};
			_ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
				_global2.default.GetTpl({
					url: '/agent1/chart.tpl',
					data: {},
					success: function success(html) {
						(0, _jquery2.default)('#chart').html(html);
						_ChartRender2.default.Render(chartData);
					}
				});
			});
		},
		RenderTableCompany: function RenderTableCompany() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType
			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				resData.sumType = comPram.route;
				resData.list.forEach(function (item) {
					if (item.type == '1') {
						item.departName = encodeURIComponent(item.departmentName);
					} else if (item.type == '0') {
						item.comName = encodeURIComponent(item.companyName);
					}
				});
				_global2.default.GetTpl({
					url: '/agent1/system/index_table_company.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},
		RenderTableTime: function RenderTableTime() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType
			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				_global2.default.GetTpl({
					url: '/agent1/system/index_table_time.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},

		GetCommonPram: function GetCommonPram(date) {
			var _this = this;
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getCurPram(route);
			var pram = {
				route: route,
				pagaType: _date_new2.default['index'][route],
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value
			};
			return pram;
		},
		renderFn: function renderFn(type) {
			var _this = this;
			if (type == '440') {
				_this.RenderTableCompany();
			} else if (type == '420') {
				_this.RenderTableTime();
			}
		},
		Event: function Event() {
			var _this = this;
			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var _self = (0, _jquery2.default)(this);
				var type = _self.attr('tableType');
				_self.addClass('active').siblings('.tab').removeClass('active');
				_this.renderFn(type);
			});
			(0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
			(0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
				_this.RenderChart();
				var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
				_this.renderFn(type);
			});
		}

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/system_index_company.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
		this.Init();
		this.Event();
		_common2.default.dateEnabled();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;

			var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
			_global2.default.GetTpl({
				url: '/agent1/system/detail_company.tpl',
				data: {
					pageTitle: name
				},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.RenderChart();
					_this.RenderTableDepartment();
				}
			});
		},
		RenderChart: function RenderChart() {
			var _this = this;
			var comPram = this.GetCommonPram();
			var companyId = _global2.default.GetUrlPara('companyId');
			var chartPram = {
				queryType: comPram.pagaType,
				endDate: comPram.end,
				startDate: comPram.start,
				companyId: companyId
			};
			_ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
				_global2.default.GetTpl({
					url: '/agent1/chart.tpl',
					data: {},
					success: function success(html) {
						(0, _jquery2.default)('#chart').html(html);
						_ChartRender2.default.Render(chartData);
					}
				});
			});
		},
		RenderTableDepartment: function RenderTableDepartment() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var companyId = _global2.default.GetUrlPara('companyId');
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType,
				companyId: companyId

			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				resData.sumType = comPram.route;
				resData.list.forEach(function (item) {
					item.departName = encodeURIComponent(item.departmentName);
				});
				_global2.default.GetTpl({
					url: '/agent1/company/index_table_department.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},
		RenderTableTime: function RenderTableTime() {
			var _this = this;
			var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
			var comPram = this.GetCommonPram();
			var companyId = _global2.default.GetUrlPara('companyId');
			var pram = {
				startDate: comPram.start,
				endDate: comPram.end,
				tableType: tableType,
				type: comPram.pagaType,
				companyId: companyId
			};
			_ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
				resData.sumType = comPram.route;
				resData.companyId = companyId;
				resData.list.forEach(function (item) {
					item.timeName = encodeURIComponent(item.timeRange);
				});
				_global2.default.GetTpl({
					url: '/agent1/system/company_table_time.tpl',
					data: resData,
					success: function success(html) {
						(0, _jquery2.default)('#table-container').html(html);
					}
				});
			});
		},

		GetCommonPram: function GetCommonPram(date) {
			var _this = this;
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getCurPram(route);
			var pram = {
				route: route,
				pagaType: _date_new2.default['index'][route],
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value
			};
			return pram;
		},
		renderFn: function renderFn(type) {
			var _this = this;
			if (type == '115') {
				_this.RenderTableDepartment();
			} else if (type == '125') {
				_this.RenderTableTime();
			}
		},
		Event: function Event() {
			var _this = this;
			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var _self = (0, _jquery2.default)(this);
				var type = _self.attr('tableType');
				_self.addClass('active').siblings('.tab').removeClass('active');
				_this.renderFn(type);
			});
			(0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
			(0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
				_this.RenderChart();
				var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
				_this.renderFn(type);
			});
		}

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/system_detail_time.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	var _common = __webpack_require__("./assets/js/develop/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	    _common2.default.dateDisabled();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        _global2.default.GetTpl({
	            url: '/agent1/company/time_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTableDepartment();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var companyId = _global2.default.GetUrlPara('companyId');
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            companyId: companyId
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTableDepartment: function RenderTableDepartment() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var companyId = _global2.default.GetUrlPara('companyId');
	        var timeLevel = _global2.default.GetUrlPara('timeLevel');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            companyId: companyId,
	            timeLevel: timeLevel
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/time_table_department.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var companyId = _global2.default.GetUrlPara('companyId');
	        var timeLevel = _global2.default.GetUrlPara('timeLevel');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            companyId: companyId,
	            timeLevel: timeLevel
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/time_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '116') {
	            _this.RenderTableDepartment();
	        } else if (type == '136') {
	            _this.RenderTablePerson();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/agent1/system_detail_department.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/sales.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _ajaxCommon = __webpack_require__("./assets/js/develop/agent1/ajaxCommon.js");

	var _ajaxCommon2 = _interopRequireDefault(_ajaxCommon);

	var _ChartRender = __webpack_require__("./assets/js/develop/agent1/ChartRender.js");

	var _ChartRender2 = _interopRequireDefault(_ChartRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {
	    this.Init();
	    this.Event();
	}

	Start.prototype = {
	    Init: function Init() {
	        var _this = this;
	        var name = decodeURIComponent(_global2.default.GetUrlPara('name'));
	        console.log('name');
	        console.log(name);
	        _global2.default.GetTpl({
	            url: '/agent1/company/department_detail_index.tpl',
	            data: {
	                pageTitle: name
	            },
	            success: function success(html) {
	                (0, _jquery2.default)('#content').html(html);
	                _this.RenderChart();
	                _this.RenderTablePerson();
	            }
	        });
	    },
	    GetCommonPram: function GetCommonPram(date) {
	        var _this = this;
	        var route = _global2.default.GetPage().parentPage;
	        var myDateFn = _date_new2.default.getCurPram(route);
	        var pram = {
	            route: route,
	            pagaType: _date_new2.default['index'][route],
	            start: myDateFn.start,
	            end: myDateFn.end,
	            value: myDateFn.value
	        };
	        return pram;
	    },
	    RenderChart: function RenderChart() {
	        var _this = this;
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var comPram = this.GetCommonPram();
	        var chartPram = {
	            queryType: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departId: departmentId
	        };
	        _ajaxCommon2.default.ChartAjax(chartPram).then(function (chartData) {
	            _global2.default.GetTpl({
	                url: '/agent1/chart.tpl',
	                data: {},
	                success: function success(html) {
	                    console.log(html);
	                    (0, _jquery2.default)('#chart').html(html);
	                    _ChartRender2.default.Render(chartData);
	                }
	            });
	        });
	    },
	    RenderTablePerson: function RenderTablePerson() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_person.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },

	    RenderTableTime: function RenderTableTime() {
	        var _this = this;

	        var comPram = _this.GetCommonPram();
	        var departmentId = _global2.default.GetUrlPara('departmentId');
	        var tableType = (0, _jquery2.default)('.tab-wrap .tab.active').attr('tableType');
	        var pram = {
	            tableType: tableType,
	            type: comPram.pagaType,
	            endDate: comPram.end,
	            startDate: comPram.start,
	            departmentId: departmentId
	        };

	        _ajaxCommon2.default.tabbleOfAgent(pram).then(function (resData) {
	            _global2.default.GetTpl({
	                url: '/agent1/company/department_table_time.tpl',
	                data: resData,
	                success: function success(html) {
	                    (0, _jquery2.default)('#table-container').html(html);
	                }
	            });
	        });
	    },
	    renderFn: function renderFn(type) {
	        var _this = this;
	        if (type == '231') {
	            _this.RenderTablePerson();
	        } else if (type == '221') {
	            _this.RenderTableTime();
	        }
	    },
	    Event: function Event() {
	        var _this = this;
	        (0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
	        (0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
	            var _self = (0, _jquery2.default)(this);
	            var type = _self.attr('tableType');
	            _self.addClass('active').siblings('.tab').removeClass('active');
	            _this.renderFn(type);
	        });
	        (0, _jquery2.default)(".date-wrap").off("change", '.tim input,.tim select');
	        (0, _jquery2.default)(".date-wrap").on("change", '.tim input,.tim select', function () {
	            _this.RenderChart();
	            var type = (0, _jquery2.default)(".tab-wrap").find('.active').attr('tableType');
	            _this.renderFn(type);
	        });
	    }

	};
	module.exports = Start;

/***/ }),

/***/ "./node_modules/core-js/library/modules/_new-promise-capability.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 25.4.1.5 NewPromiseCapability(C)
	var aFunction = __webpack_require__("./node_modules/core-js/library/modules/_a-function.js");

	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	}

	module.exports.f = function (C) {
	  return new PromiseCapability(C);
	};


/***/ })

});