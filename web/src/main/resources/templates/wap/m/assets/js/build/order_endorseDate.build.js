webpackJsonp([28],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(81);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(123);

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
			if (!(_uinfo && _uinfo.u_id)) {
				if (share_user) {
					_global2.default.GetCityCode(function (citycode) {
						_this.citycode = citycode;
						_this.Render();
					});
				} else {
					window.location.href = 'login.html';
				}
			} else {
				_global2.default.GetCityCode(function (citycode) {
					_this.citycode = citycode;
					_this.Render();
				});
			}
		}

		(0, _createClass3.default)(Index, [{
			key: 'Render',
			value: function Render() {
				var _this = this;
				var froms = '';
				var from = window.sessionStorage.getItem("from");
				if (from == 'preview') {
					froms = "preview";
				};
				_global2.default.Ajax({
					url: '/front/h5/adver/getCalendarMonths',
					type: 'get',
					data: {
						p_id: _global2.default.GetUrlPara('p_id'),
						from: froms,
						city_code: _this.citycode
					},
					success: function success(res) {
						if (res.code == 200) {
							var html = (0, _artTemplate2.default)('tpl-month-list', res);
							(0, _jquery2.default)('.month-list ul').html(html);
							var year = _global2.default.GetUrlPara('year'),
							    month = _global2.default.GetUrlPara('month'),
							    day = _global2.default.GetUrlPara('day');
							if (year && month) {
								(0, _jquery2.default)('.month-list li[year=' + year + '][month=' + month + ']').addClass('active');
							} else {
								(0, _jquery2.default)('.month-list li').eq(0).addClass('active');
							}
							_this.MonthList();
							_this.Calendar(day);
							_this.Event();
							(0, _jquery2.default)('.t-bar a').on('click', function () {
								window.history.back();
							});
						}
					}
				});
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				//只浏览
				var form = window.sessionStorage.getItem('from');
				if (form == 'preview') {
					(0, _jquery2.default)(".next").hide();
				};
				(0, _jquery2.default)('.month-list li').on('click', function () {
					if ((0, _jquery2.default)(this).hasClass('active')) {
						return false;
					}
					(0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
					(0, _jquery2.default)(".ticket-list").html("");
					_this.CheckNum();
					_this.Calendar();
				});
				if (!(_uinfo && _uinfo.u_id)) {
					(0, _jquery2.default)('.icon-trade').css("display", "none");
				} else {
					(0, _jquery2.default)('.icon-trade').css("display", "");
				}

				(0, _jquery2.default)('.icon-trade').on('click', function () {
					(0, _jquery2.default)(this).toggleClass('open');
					(0, _jquery2.default)('.ticket-list li .trade-price,.ticket-list li .s-trade-price').toggle();
					(0, _jquery2.default)('.ticket-list li .price,.ticket-list li .s-price').toggle();
					(0, _jquery2.default)('.calendar-list li .price,.calendar-list li .trade-price').toggle();
					(0, _jquery2.default)('.month-list li .price,.month-list li .trade-price').toggle();
				});
			}
		}, {
			key: 'MonthList',
			value: function MonthList() {
				var len = 100 * (0, _jquery2.default)('.calendar .month-list li').length;
				(0, _jquery2.default)('.calendar .month-list ul').width(len);
			}
		}, {
			key: 'Calendar',
			value: function Calendar(day) {
				var _this = this;
				var $li = (0, _jquery2.default)('.month-list ul li.active'),
				    year = $li.attr('year'),
				    month = $li.attr('month'),
				    froms = '';
				var from = window.sessionStorage.getItem("from");
				if (from == 'preview') {
					froms = "preview";
				};

				_global2.default.Ajax({
					// url : '/b2b/product/calendar',
					url: '/front/product/calendar',
					type: 'post',
					data: {
						p_id: _global2.default.GetUrlPara('p_id'), //产品ID
						year: year, //年份
						month: month, //月份
						from: froms,
						city_code: _this.citycode //城市代码
					},
					success: function success(res) {
						if (res.code == 200) {
							res['year'] = year;
							res['month'] = month;
							if (day) {
								res['day'] = day;
							}
							(0, _jquery2.default)('.icon-trade').removeClass('open');
							var html = (0, _artTemplate2.default)('tpl-calendar', res);
							(0, _jquery2.default)('.calendar-list').html(html);
							_this.CalendarEvent(res.data);
							_this.Next(res.data);

							(0, _jquery2.default)('.calendar-list li.default').click().removeClass('default');

							var data = res.data;
							for (var i = 0; i < data.length; i++) {

								var dataInf = data[i].info;
								if (dataInf) {
									if (dataInf.sell_status == 1) {
										var sellOut = (0, _jquery2.default)('.calendar-list li').find('div.sellout').parent();
										sellOut.addClass('selloutbg');
										sellOut.unbind();
										sellOut.css('color', '#999');
										sellOut.find('div.sellout i').css('color', '#999');
										sellOut.find('div.sellout span').css('color', '#999');
									}
								} else {
									var onInfo = (0, _jquery2.default)('.calendar-list li').find('div.noInfo').parent();
									onInfo.unbind();
								}
							}
						}
					}
				});
			}
		}, {
			key: 'CalendarEvent',
			value: function CalendarEvent(data) {
				var _this = this;
				// 选择班期
				(0, _jquery2.default)('.calendar-list li').on('click', function () {
					if ((0, _jquery2.default)(this).hasClass('active') || (0, _jquery2.default)(this).hasClass('blank')) {
						return false;
					}
					(0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
					var ind = (0, _jquery2.default)(this).attr('ind');
					var tdata = data[ind];
					var html = (0, _artTemplate2.default)('tpl-ticket-list', tdata);
					(0, _jquery2.default)('.ticket-list').html(html);
					_this.TicketEvent(tdata, 0);
					_this.CheckNum();
					if ((0, _jquery2.default)(".tpl_dl dd").length == '1') {
						(0, _jquery2.default)(".tpl_dl dd").eq("0").addClass("acti");
						(0, _jquery2.default)(".ticket-list .bl_tab").eq("0").addClass("disp");
					}
					(0, _jquery2.default)(".tpl_dl dd").off().on("click", function () {
						if ((0, _jquery2.default)(this).hasClass("acti")) {
							return false;
						}
						//清楚input值
						(0, _jquery2.default)(".num-check input").val("0");
						(0, _jquery2.default)(".tpl_dl dd").removeClass("acti");
						(0, _jquery2.default)(this).addClass("acti");
						var _index = (0, _jquery2.default)(this).index();
						_index = _index - 1;
						(0, _jquery2.default)(".bl_tab").removeClass("disp");
						(0, _jquery2.default)(".bl_tab").eq(_index).addClass("disp");
						_this.TicketEvent(tdata, _index);
						_this.CheckNum();
					});
				});
			}
		}, {
			key: 'TicketEvent',
			value: function TicketEvent(data, index) {
				var _this = this;
				(0, _jquery2.default)('.ticket-list .bl_tab .bl_class li .num-check span').off().on('click', function () {
					var $li = (0, _jquery2.default)(this).parents('li'),
					    $fa = (0, _jquery2.default)(this).parents(".bl_class").find("h3").attr("typ"),
					    $input = $li.find('.num-check input'),
					    ind = $li.index(),
					    tid = $li.attr('tid'),
					    type = $li.attr('type'),
					    active = (0, _jquery2.default)(this).attr('class');
					var num = parseInt($input.val());

					var tdata = void 0;
					var is = data.info.bl_data[index];
					console.log(data.info.bl_data[index]);
					for (var i = 0; i < is.ticket[$fa].length; i++) {
						if (tid == data.info.bl_data[index].ticket[$fa][i].t_id) {
							tdata = data.info.bl_data[index].ticket[$fa][i];
							break;
						}
					}

					switch (active) {
						case 'reduce':
							num--;
							if (num < 0) {
								num = 0;
							}
							break;
						case 'add':
							num++;
							if (tdata.t_store > -1 && num > tdata.t_store) {
								num--;
							}
							break;
						default:
							break;
					}
					var price = (num * tdata.t_price).toFixed(2);
					var trade_price = (num * tdata.t_trade_price).toFixed(2);
					$input.val(num);
					$li.find('.price').html('<i>￥</i>' + price);
					$li.find('.trade-price').html('<i>￥</i>' + trade_price);

					_this.CheckNum();
				});
			}
		}, {
			key: 'Next',
			value: function Next(data) {
				var _this = this;
				(0, _jquery2.default)('.next').off().on('click', function () {
					//只浏览
					var form = window.sessionStorage.getItem('from');
					if (form == 'preview') {
						return false;
					};
					var _index = (0, _jquery2.default)(".ticket-list .disp").index();
					_index = _index - 1;
					if ((0, _jquery2.default)(this).hasClass('disable')) {
						return false;
					}
					var list = [];
					(0, _jquery2.default)('.ticket-list .disp li').each(function () {
						var tid = (0, _jquery2.default)(this).attr('tid');
						var t_name = (0, _jquery2.default)(this).parents(".bl_class").find("h3").attr("typ");
						var tnum = parseInt((0, _jquery2.default)(this).find('.num-check input').val());
						if (tnum > 0) {
							list.push({
								tid: tid,
								num: tnum,
								t_name: t_name
							});
						}
					});
					if (!list.length) {
						alert('请选择票价类型');
						return false;
					} else {
						window.sessionStorage.setItem('ticket-list', (0, _stringify2.default)(list));
					}
					var ind = (0, _jquery2.default)('.calendar-list li.active').attr('ind');
					var bl_id = data[ind].info.bl_data[_index].bl_id;
					window.location.href = 'order.html?p_id=' + _global2.default.GetUrlPara('p_id') + '&bl_id=' + bl_id + '&city_code=' + _this.citycode;
				});
			}
		}, {
			key: 'CheckNum',
			value: function CheckNum() {
				var all = 0;
				(0, _jquery2.default)('.ticket-list li').each(function () {
					var tnum = parseInt((0, _jquery2.default)(this).find('.num-check input').val());
					all += tnum;
				});
				if (all) {
					(0, _jquery2.default)('.next').removeClass('disable');
				} else {
					(0, _jquery2.default)('.next').addClass('disable');
				}
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 123:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});