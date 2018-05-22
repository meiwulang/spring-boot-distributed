webpackJsonp([4],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__("./assets/less/develop/person.less");

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _common = __webpack_require__("./assets/js/common/common.js");

	var _common2 = _interopRequireDefault(_common);

	var _index = __webpack_require__("./assets/js/develop/person/index.js");

	var _index2 = _interopRequireDefault(_index);

	var _common3 = __webpack_require__("./assets/js/develop/common/common.js");

	var _common4 = _interopRequireDefault(_common3);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

	    _date_new2.default.initPerson();
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
	            _this.Route();
	        });
	    },

	    Route: function Route() {
	        var _this = this;

	        (0, _jquery2.default)(window).scrollTop(0);

	        var dateType = _global2.default.GetPage().curPage;
	        switch (dateType) {
	            case 'system':
	                _index2.default.System();
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

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/person.less":
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
	// imports


	// module
	exports.push([module.id, "/*\n\tauthor : zhupinglei,\n\tdesc : 浏览器重置\n*/\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  font-size: 14px;\n  line-height: 1.4;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  -webkit-user-select: none;\n  /* 禁止选中文本（如无文本选中需求，此为必选项） */\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  background-color: #f3f5f9;\n}\nbody div,\nbody dl,\nbody dt,\nbody dd,\nbody ul,\nbody ol,\nbody li,\nbody h1,\nbody h2,\nbody h3,\nbody h4,\nbody h5,\nbody h6,\nbody pre,\nbody form,\nbody fieldset,\nbody input,\nbody p,\nbody a,\nbody blockquote,\nbody th,\nbody i,\nbody u,\nbody span {\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\nbody ol,\nbody ul {\n  list-style: none;\n}\nbody u,\nbody i {\n  font-weight: normal;\n  font-style: normal;\n}\nbody a {\n  color: #333;\n  text-decoration: none;\n}\nbody a,\nbody img {\n  -webkit-touch-callout: none;\n  /* 禁止长按链接与图片弹出菜单 */\n}\nbody input,\nbody select,\nbody button,\nbody textarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -o-appearance: none;\n  border: none;\n  background-color: #fff;\n  margin: 0;\n  padding: 0;\n  resize: none;\n  outline: none;\n  border-radius: 0;\n}\nbody table {\n  border-collapse: collapse;\n  border-spacing: 0px;\n}\nbody .clearfix {\n  *zoom: 1;\n}\nbody .clearfix:after {\n  display: block;\n  overflow: hidden;\n  clear: both;\n  height: 0;\n  visibility: hidden;\n  content: \".\";\n}\nbody {\n  background-color: #f3f5f9;\n}\n/*----------用来移除向下箭头----------*/\n/*input[type=\"date\"]::-webkit-calendar-picker-indicator {\n   display: none;\n}*/\n/*----------用来移除叉叉按钮----------*/\n/*input[type=\"date\"]::-webkit-clear-button{\n   display:none;\n}*/\n#popup-loading {\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -30px;\n  margin-top: -50px;\n  z-index: 100;\n  background: url(" + __webpack_require__("./assets/img/loading.gif") + ") center center no-repeat;\n  background-size: 30px 30px;\n  background-color: rgba(255, 255, 255, 0.6);\n  border-radius: 10px;\n}\n#popup-mask {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.1);\n  z-index: 99;\n}\n#popup-tip {\n  width: 180px;\n  line-height: 16px;\n  color: #fff;\n  background-color: #000000;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -105px;\n  margin-top: -30px;\n  z-index: 100;\n  text-align: center;\n}\n#popup-info {\n  word-wrap: break-word;\n  width: 200px;\n  line-height: 20px;\n  color: #333;\n  background-color: #fff;\n  border-radius: 5px;\n  overflow: hidden;\n  font-size: 14px;\n  padding: 15px;\n  position: fixed;\n  left: 50%;\n  top: 30%;\n  margin-left: -115px;\n  z-index: 100;\n  box-shadow: 0px 0px 2px #ccc;\n}\n#popup-info .popup-confirm .popup-content {\n  height: 100px;\n  background: url(" + __webpack_require__("./assets/img/guide/warr.png") + ") center 30% no-repeat;\n  background-size: 52px auto;\n}\n#popup-info .popup-confirm .popup-content .popup-txt {\n  position: relative;\n  top: 80px;\n  text-align: center;\n}\n#popup-info .popup-confirm .popup-foot {\n  position: relative;\n  height: 43px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel,\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  line-height: 43px;\n  font-size: 14px;\n  text-align: center;\n  height: 43px;\n  width: 57%;\n  position: absolute;\n  box-sizing: border-box;\n  bottom: -16px;\n}\n#popup-info .popup-confirm .popup-foot .popup-cancel {\n  color: #666;\n  left: -15px;\n  border-top: 1px solid #e7e7e7;\n}\n#popup-info .popup-confirm .popup-foot .popup-ok {\n  color: #fff;\n  background: #fc2a35;\n  right: -15px;\n}\n#wrap #person {\n  padding-bottom: 50px;\n  box-sizing: border-box;\n}\n#wrap #person .acti_header {\n  height: 40px;\n  font-size: 14px;\n  width: 100%;\n  margin-bottom: 2px;\n  position: relative;\n  z-index: 5;\n}\n#wrap #person .screen {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: #fff;\n  z-index: -1;\n  opacity: 0;\n}\n#wrap #person .screen .sha {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 50px;\n  width: 100vw;\n}\n#wrap #person .screen .son {\n  padding-top: 12px;\n  padding-right: 15px;\n  box-sizing: border-box;\n  width: 100vh;\n  height: 100vw;\n  background-color: #fff;\n  transform: rotate(0deg);\n  -webkit-transform: rotate(0deg);\n  -moz-transform: rotate(0deg);\n  -o-transform: rotate(0deg);\n  transition: all 0.3s ease-in-out;\n  -webkit-transition: all 0.3s ease-in-out;\n  -moz-transition: all 0.3s ease-in-out;\n  -o-transition: all 0.3s ease-in-out;\n  transform-origin: 50vw 50vw;\n}\n#wrap #person .screen .son .ave {\n  width: 100%;\n  height: 100%;\n}\n#wrap #person .screen .clear {\n  color: #fff;\n  text-align: center;\n  line-height: 30px;\n  font-size: 25px;\n  background-color: rgba(0, 0, 0, 0.4);\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  position: fixed;\n  top: 15px;\n  right: 30px;\n}\n#wrap #person .screen.active {\n  opacity: 1;\n  z-index: 99;\n}\n#wrap #person .screen.active .son {\n  transform: rotate(90deg);\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n}\n#wrap #person .count {\n  position: relative;\n  width: 100%;\n  height: 290px;\n  /*background-color: #fff;*/\n  box-sizing: border-box;\n  padding: 15px;\n  padding-top: 10px;\n  background-color: rgba(255, 255, 255, 0);\n}\n#wrap #person .count .time {\n  width: 100%;\n  height: 30px;\n  box-sizing: border-box;\n  border-bottom: 1px solid #e7e7e7;\n  line-height: 30px;\n  overflow: hidden;\n  font-size: 10px;\n  color: #999;\n}\n#wrap #person .count .time h2 {\n  font-size: 10px;\n  height: 100%;\n  width: 70px;\n  float: left;\n}\n#wrap #person .count .time .day {\n  margin-left: 70px;\n  text-align: right;\n  overflow: hidden;\n}\n#wrap #person .count .shade {\n  position: absolute;\n  width: 100vw;\n  height: 208px;\n  top: 42px;\n  left: 0;\n}\n#wrap #person .count .char {\n  height: 260px;\n}\n#wrap #person .count.disable {\n  visibility: hidden;\n}\n#wrap #person .record {\n  background-color: #fff;\n}\n#wrap #person .record .switch {\n  height: auto;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 5px 0 12px;\n  background: -webkit-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Safari 5.1 - 6.0 */\n  background: -o-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Opera 11.1 - 12.0 */\n  background: -moz-linear-gradient(180deg, #6186f8, #5266e1);\n  /* Firefox 3.6 - 15 */\n  background: linear-gradient(180deg, #6186f8, #5266e1);\n}\n#wrap #person .record .switch .ul-bag {\n  padding: 0 10px;\n}\n#wrap #person .record .switch .ul-bag ul {\n  border-radius: 6px;\n  border: 1px solid #fff;\n  overflow: hidden;\n  height: 34px;\n  display: flex;\n  display: -webkit-flex;\n}\n#wrap #person .record .switch .ul-bag ul li {\n  flex: 1;\n  font-size: 12px;\n  color: #fff;\n  height: 100%;\n  text-align: center;\n  float: left;\n  box-sizing: border-box;\n  border-right: 1px solid #fff;\n}\n#wrap #person .record .switch .ul-bag ul li a {\n  display: inline-block;\n  height: 100%;\n  width: 100%;\n  line-height: 34px;\n  color: #fff;\n}\n#wrap #person .record .switch .ul-bag ul li:last-child {\n  border-right: none ;\n}\n#wrap #person .record .switch .ul-bag ul li.active {\n  background-color: #fff;\n  color: #5575e2;\n}\n#wrap #person .record .switch .ul-bag ul li.active a {\n  color: #5575e2;\n}\n#wrap #person .record .mation-txt {\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n}\n#wrap #person .record .tato {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  z-index: 10;\n  font-size: 12px;\n  color: #666;\n  text-align: center;\n  width: 100%;\n  height: 50px;\n  background-color: #fff;\n  border-top: 1px solid #e7e7e7;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: flex-start;\n}\n#wrap #person .record .tato .sum {\n  background-color: #587de5;\n  font-size: 14px;\n  color: #fff;\n  line-height: 52px;\n  width: 80px;\n}\n#wrap #person .record .tato .col {\n  flex: 1;\n  padding: 5px 0 5px 36px;\n}\n#wrap #person .record .tato .col p {\n  font-size: 16px;\n  color: #333;\n  line-height: 20px;\n  text-align: left;\n}\n#wrap #person .record .tato .col p.grey-font {\n  font-size: 12px;\n  color: #999;\n  line-height: 20px;\n}\n#wrap #person .record .count {\n  border-bottom: 0;\n  padding-bottom: 10px;\n}\n#wrap #person .record .tab-wrap {\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 0 10px #ddd;\n  position: relative;\n  left: 0;\n  top: -20px;\n  background-color: #fff;\n}\n#wrap #person .record .tab-wrap div.tab {\n  flex: 1;\n  padding: 10px 0;\n  border-bottom: 2px solid #ffffff;\n  text-align: center;\n  position: relative;\n  box-sizing: border-box;\n}\n#wrap #person .record .tab-wrap div.tab.active {\n  color: #587de5;\n}\n#wrap #person .record .tab-wrap div.tab:after {\n  display: block;\n  content: '';\n  position: absolute;\n  right: -1px;\n  top: 10px;\n  height: 18px;\n  width: 1px;\n  border-right: 2px dotted #e1e1e1;\n}\n#wrap #person .record .tab-wrap div.tab:last-child:after {\n  border-right: 0;\n}\n#wrap #person .record .tab-bg {\n  height: 20px;\n  background-color: #f7f7f7;\n  margin-top: 20px;\n  padding: 0 10px;\n}\n#wrap #person .record .table-wrap {\n  background-color: #f7f7f7;\n}\n#wrap #person .record .table-wrap div.cont {\n  display: none;\n}\n#wrap #person .record .table-wrap table {\n  text-align: center;\n  border-collapse: collapse;\n  width: 100%;\n}\n#wrap #person .record .table-wrap table thead {\n  background-color: #f7f7f7;\n  border: 0;\n}\n#wrap #person .record .table-wrap table thead tr {\n  height: 40px;\n}\n#wrap #person .record .table-wrap table thead tr th {\n  font-size: 12px;\n  color: #999;\n}\n#wrap #person .record .table-wrap table thead tr th:first-child {\n  width: 10px;\n}\n#wrap #person .record .table-wrap table thead tr th:last-child {\n  width: 10px;\n}\n#wrap #person .record .table-wrap table thead tr th:nth-child(2) {\n  text-align: left;\n  padding-left: 6px;\n}\n#wrap #person .record .table-wrap table tbody tr {\n  height: 46px;\n}\n#wrap #person .record .table-wrap table tbody tr td {\n  font-size: 12px;\n  color: #333;\n  border-bottom: 5px solid #f7f7f7;\n  background-color: #fff;\n}\n#wrap #person .record .table-wrap table tbody tr td a {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n#wrap #person .record .table-wrap table tbody tr td:first-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #person .record .table-wrap table tbody tr td:last-child {\n  width: 10px;\n  border-bottom: 5px solid #f7f7f7 !important;\n}\n#wrap #person .record .table-wrap table tbody tr td:nth-child(2) {\n  text-align: left;\n}\n#wrap #person .record .table-wrap table tbody tr:last-child td {\n  border-bottom: none !important;\n}\n#wrap #person .record .table-wrap table tbody tr.border-bottom {\n  height: 36px;\n}\n#wrap #person .record .table-wrap table tbody tr.border-bottom td {\n  border-bottom: 1px solid #f7f7f7;\n}\n#wrap #person .record .table-wrap table tbody tr.border-bottom td:first-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #person .record .table-wrap table tbody tr.border-bottom td:last-child {\n  border-bottom: 0px solid #f7f7f7 !important;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom {\n  height: 30px;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom td {\n  font-size: 10px;\n  color: #999;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom td.div-wrap {\n  position: relative;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap {\n  position: absolute;\n  left: 0;\n  top: 0;\n  line-height: 30px;\n  min-width: 350px;\n  height: 30px;\n  overflow: hidden;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span {\n  display: inline-block;\n  text-align: left;\n}\n#wrap #person .record .table-wrap table tbody tr.tr-bottom td.div-wrap .wrap span:first-child {\n  margin-right: 5px;\n  width: 150px;\n}\n#wrap #person .record .table-wrap .mation-txt {\n  background-color: #fff;\n}\n#wrap #person .record .table-index {\n  margin-top: 0;\n  padding-top: 0;\n}\n#wrap #person .record #content .data-null {\n  display: none;\n  height: 60px;\n  line-height: 60px;\n  text-align: center;\n  color: #999;\n  font-size: 13px;\n  position: relative;\n  top: -280px;\n  z-index: 4;\n}\n#wrap #person .record #content table tr td.arrow-right a {\n  position: relative;\n}\n#wrap #person .record #content table tr td.arrow-right a:after {\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  margin-top: -4px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #656565;\n  border-right: 1px solid #656565;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n#wrap #person .record .title {\n  margin: 0 10px;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  border-bottom: 1px solid #ddd;\n}\n#wrap #person .record .title h2 {\n  position: absolute;\n  left: 0;\n  top: -123px;\n  height: 26px;\n  width: 100%;\n  z-index: 10;\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #person .record .title h2 a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  position: absolute;\n  right: -10px;\n  top: -5px;\n  z-index: 11;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #person .record .title h2 span.bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n}\n#wrap #person .record .title h2 span.bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #person .record .tim {\n  font-size: 14px;\n  color: #ff2d55;\n}\n#wrap #person .record .tim label {\n  display: block;\n}\n#wrap #person .record .tim input {\n  width: 100%;\n  color: #5575e2;\n  text-align: right;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") 85% no-repeat;\n  background-size: 11px 6px;\n  margin-left: -20px;\n  font-size: 14px;\n}\n#wrap #person .record .tim div.active {\n  display: block;\n}\n#wrap #person .record .tim div.day {\n  margin-right: -10px;\n}\n#wrap #person .record .tim div.day input {\n  width: 140px;\n}\n#wrap #person .record .tim div.month {\n  margin-right: -20px;\n}\n#wrap #person .record .tim div.month input {\n  width: 105px;\n}\n#wrap #person .record .tim div.year select {\n  direction: rtl;\n}\n#wrap #person .record .tim select {\n  padding-right: 16px;\n  color: #5575e2;\n  font-size: 14px;\n  background: url(" + __webpack_require__("./assets/img/jt.png") + ") right no-repeat;\n  background-size: 11px 6px;\n  width: 100%;\n  height: 20px;\n  line-height: 20px;\n}\n#wrap #person .record .date-wrap {\n  margin: 0 10px;\n}\n#wrap #person .record .date-wrap .tim div {\n  display: none;\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n  margin: 0 !important;\n}\n#wrap #person .record .date-wrap .tim div input {\n  margin: 0 !important;\n  text-align: left;\n}\n#wrap #person .record .date-wrap .tim div select {\n  width: auto;\n}\n#wrap #person .record .date-wrap .tim div.active {\n  display: block;\n}\n#wrap #person .record .date-wrap .tim div.day input {\n  width: 132px;\n}\n#wrap #person .record .date-wrap .tim div.day span {\n  vertical-align: top;\n  display: inline-block;\n  color: #5575e2;\n  padding-right: 10px;\n}\n#wrap #person .record .title_header {\n  display: flex;\n  display: -webkit-flex;\n  justify-content: space-between;\n  align-items: center;\n}\n#wrap #person .record .title_header a.home {\n  display: inline-block;\n  font-size: 14px;\n  width: 40px;\n  height: 36px;\n  background: url(" + __webpack_require__("./assets/img/home.png") + ") no-repeat 0 0;\n  background-size: 100% 100%;\n}\n#wrap #person .record .title_header .bg_ing {\n  font-size: 14px;\n  color: #fff;\n  padding-right: 36px;\n  padding-left: 15px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  line-height: 26px;\n  height: 26px;\n  position: relative;\n  margin-left: 10px;\n}\n#wrap #person .record .title_header .bg_ing:after {\n  position: absolute;\n  left: 0px;\n  top: 50%;\n  margin-top: -5px;\n  content: '';\n  display: block;\n  overflow: hidden;\n  width: 8px;\n  height: 8px;\n  border-top: 1px solid #333;\n  border-right: 1px solid #333;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  left: 5px;\n  color: #fff;\n  border-color: #fff;\n}\n#wrap #person .record .no-tab .table-wrap {\n  padding-top: 2px;\n}\n#wrap #person .record {\n  margin-top: 0;\n  /*.switch{\n\t\t\t\tbox-shadow: 0px 3px 4px #f2f2f2;\n\t\t\t}*/\n}\n#wrap #person .record .count {\n  position: relative;\n  width: 100%;\n  height: 445px;\n  background-color: rgba(255, 255, 255, 0);\n  box-sizing: border-box;\n  padding: 10px 15px 0 15px;\n}\n#wrap #person .record .count .char {\n  height: 435px;\n}\n#wrap #person .record thead tr th {\n  background-color: #fafafa;\n}\n#wrap #person .record tbody tr:last-child td {\n  border-bottom: none!important;\n}\n#wrap #person .record tbody td:last-child {\n  width: 15px;\n  border-bottom: none!important;\n}\n#wrap #person .record tbody tr td a span {\n  box-sizing: border-box;\n  padding-top: 1px;\n  overflow: hidden;\n  display: inline-block;\n  width: 100%;\n  max-height: 30px;\n}\n#wrap #person .record .tato .sum {\n  margin-right: 5px;\n}\n#wrap #person .record .tato .col {\n  padding-left: 5px;\n}\n", ""]);

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

/***/ "./assets/less/develop/person.less":
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/person.less");
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/person.less", function() {
				var newContent = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./assets/less/develop/person.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ "./assets/js/develop/person/person.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

		this.Init();

		this.event();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_this.Render();
		},
		Render: function Render(parm) {
			var _this = this;
			_global2.default.GetTpl({
				url: '/person/index.tpl',
				data: {},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.tableRender();
				}
			});
		},
		getAjaxPram: function getAjaxPram() {
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getPersonCurPram(route);
			var tabType = (0, _jquery2.default)('.tab-wrap').find('.active').attr('tabType');
			var parm = {
				route: route, //路由时间类型 
				pagaType: _date_new2.default['index'][route], //时间type
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value,
				identityLevel: tabType
			};
			return parm;
		},
		tableRender: function tableRender() {
			var _this = this;
			var parm = _this.getAjaxPram();
			var levelName = (0, _jquery2.default)('.tab-wrap').find('.active').attr('levelName');
			_global2.default.Ajax({
				url: '/personalSales/list',
				type: 'post',
				data: {
					type: parm.pagaType,
					startDate: parm.start,
					endDate: parm.end,
					identityLevel: parm.identityLevel
				},
				success: function success(res) {
					if (res.code == 0) {
						var resData = res.body;
						resData.levelName = levelName;
						_global2.default.GetTpl({
							url: '/person/table.tpl',
							data: resData,
							success: function success(html) {
								(0, _jquery2.default)('#table-contanier').html(html);
							}
						});
					}
				}
			});
		},
		event: function event() {
			var _this = this;
			//$(".date-wrap .tim").off("change",'input,select');

			(0, _jquery2.default)(".date-wrap .tim").off().on("change", '.month input,select', function () {
				var self = (0, _jquery2.default)(this);
				_this.tableRender();
			});

			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.start', function () {
				var self = (0, _jquery2.default)(this);
				var start = self.val();
				var end = self.parent().find('input.end').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});
			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.end', function () {
				var self = (0, _jquery2.default)(this);
				var end = self.val();
				var start = self.parent().find('input.start').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});

			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var self = (0, _jquery2.default)(this);
				self.addClass('active').siblings('.tab').removeClass('active');
				_this.tableRender();
			});
		}

	};

	module.exports = Start;

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

/***/ "./assets/js/develop/person/system_person.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

		this.Init();

		this.event();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_this.Render();
		},
		Render: function Render(parm) {
			var _this = this;
			_global2.default.GetTpl({
				url: '/person/system_index.tpl',
				data: {},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.tableRender();
				}
			});
		},
		getAjaxPram: function getAjaxPram() {
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getPersonCurPram(route);
			var tabType = (0, _jquery2.default)('.tab-wrap').find('.active').attr('tabType');
			var parm = {
				route: route, //路由时间类型 
				pagaType: _date_new2.default['index'][route], //时间type
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value,
				identityLevel: tabType
			};
			return parm;
		},
		tableRender: function tableRender() {
			var _this = this;
			var parm = _this.getAjaxPram();
			_global2.default.Ajax({
				url: '/personalSales/list',
				type: 'post',
				data: {
					type: parm.pagaType,
					startDate: parm.start,
					endDate: parm.end,
					identityLevel: parm.identityLevel
				},
				success: function success(res) {
					if (res.code == 0) {
						var resData = res.body;
						resData.sumType = parm.route;
						resData.list.forEach(function (item, index) {
							if (item.type == '0') {
								item.unitName = encodeURIComponent(item.companyName);
							} else if (item.type == '1') {
								item.unitName = encodeURIComponent(item.departmentName);
							}
						});

						_global2.default.GetTpl({
							url: '/person/index_table.tpl',
							data: resData,
							success: function success(html) {
								(0, _jquery2.default)('#table-contanier').html(html);
							}
						});
					}
				}
			});
		},

		event: function event() {
			var _this = this;
			//$(".date-wrap .tim").off("change",'input,select');

			(0, _jquery2.default)(".date-wrap .tim").off().on("change", '.month input,select', function () {
				var self = (0, _jquery2.default)(this);
				_this.tableRender();
			});

			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.start', function () {
				var self = (0, _jquery2.default)(this);
				var start = self.val();
				var end = self.parent().find('input.end').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});
			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.end', function () {
				var self = (0, _jquery2.default)(this);
				var end = self.val();
				var start = self.parent().find('input.start').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});

			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var self = (0, _jquery2.default)(this);
				self.addClass('active').siblings('.tab').removeClass('active');
				var tabType = (0, _jquery2.default)('.tab-wrap').find('.active').attr('tabType');
				_this.tableRender();
			});
		}

	};

	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/person/system_person_detail.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _global = __webpack_require__("./assets/js/common/global.js");

	var _global2 = _interopRequireDefault(_global);

	var _template = __webpack_require__("./assets/js/lib/artTemplate.js");

	var _template2 = _interopRequireDefault(_template);

	var _date_new = __webpack_require__("./assets/js/common/date_new.js");

	var _date_new2 = _interopRequireDefault(_date_new);

	var _popup = __webpack_require__("./assets/js/common/popup.js");

	var _popup2 = _interopRequireDefault(_popup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Start() {

		this.Init();

		this.event();
	}

	Start.prototype = {
		Init: function Init() {
			var _this = this;
			_this.Render();
		},
		Render: function Render(parm) {
			var _this = this;

			var pageTitle = decodeURIComponent(_global2.default.GetUrlPara('name'));

			_global2.default.GetTpl({
				url: '/person/index.tpl',
				data: {
					pageTitle: pageTitle
				},
				success: function success(html) {
					(0, _jquery2.default)('#content').html(html);
					_this.tableRender();
				}
			});
		},
		getAjaxPram: function getAjaxPram() {
			var route = _global2.default.GetPage().parentPage;
			var myDateFn = _date_new2.default.getPersonCurPram(route);
			var tabType = (0, _jquery2.default)('.tab-wrap').find('.active').attr('tabType');
			var parm = {
				route: route, //路由时间类型 
				pagaType: _date_new2.default['index'][route], //时间type
				start: myDateFn.start,
				end: myDateFn.end,
				value: myDateFn.value,
				identityLevel: tabType
			};
			return parm;
		},
		tableRender: function tableRender() {
			var _this = this;
			var parm = _this.getAjaxPram();
			var ajaxData = {
				type: parm.pagaType,
				startDate: parm.start,
				endDate: parm.end,
				identityLevel: parm.identityLevel
			};
			var companyId = _global2.default.GetUrlPara('companyId');
			var departmentId = _global2.default.GetUrlPara('departmentId');
			if (companyId) {
				ajaxData.companyId = companyId;
				ajaxData.departmentId = null;
			} else if (departmentId) {
				ajaxData.companyId = null;
				ajaxData.departmentId = departmentId;
			}
			_global2.default.Ajax({
				url: '/personalSales/list',
				type: 'post',
				data: ajaxData,
				success: function success(res) {
					if (res.code == 0) {
						var resData = res.body;
						_global2.default.GetTpl({
							url: '/person/table.tpl',
							data: resData,
							success: function success(html) {
								(0, _jquery2.default)('#table-contanier').html(html);
							}
						});
					}
				}
			});
		},
		event: function event() {
			var _this = this;
			//$(".date-wrap .tim").off("change",'input,select');

			(0, _jquery2.default)(".date-wrap .tim").off().on("change", '.month input,select', function () {
				var self = (0, _jquery2.default)(this);
				_this.tableRender();
			});

			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.start', function () {
				var self = (0, _jquery2.default)(this);
				var start = self.val();
				var end = self.parent().find('input.end').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});
			(0, _jquery2.default)(".date-wrap .tim").on("change", '.day input.end', function () {
				var self = (0, _jquery2.default)(this);
				var end = self.val();
				var start = self.parent().find('input.start').val();
				if (start > end) {
					_popup2.default.Tip('开始日期不能晚于结束日期');
				} else {
					_this.tableRender();
				}
			});

			(0, _jquery2.default)("#content").off('click', '.tab-wrap .tab');
			(0, _jquery2.default)("#content").on('click', '.tab-wrap .tab', function () {
				var self = (0, _jquery2.default)(this);
				self.addClass('active').siblings('.tab').removeClass('active');
				_this.tableRender();
			});
		}

	};

	module.exports = Start;

/***/ }),

/***/ "./assets/js/develop/person/index.js":
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery = __webpack_require__("./assets/js/lib/jquery.2.1.4.js-exposed");

	var _jquery2 = _interopRequireDefault(_jquery);

	var _person = __webpack_require__("./assets/js/develop/person/person.js");

	var _person2 = _interopRequireDefault(_person);

	var _system_person = __webpack_require__("./assets/js/develop/person/system_person.js");

	var _system_person2 = _interopRequireDefault(_system_person);

	var _system_person_detail = __webpack_require__("./assets/js/develop/person/system_person_detail.js");

	var _system_person_detail2 = _interopRequireDefault(_system_person_detail);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		Index: function Index() {
			var uDataLimit = localStorage.uDataLimit;
			//let uDataLimit = 1;
			console.log(uDataLimit + 'uDataLimit + p');

			switch (uDataLimit) {
				case '0':
					//用户级
					new _person2.default();
					break;
				case '1':
					//部门级
					new _person2.default();
					break;
				case '2':
					//单位级
					new _person2.default();
					break;
				case '3':
					//系统级
					new _system_person2.default();
					break;

			}
		},
		System: function System() {
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
					new _system_person_detail2.default();
					break;

			}
		}

	};

/***/ })

});