webpackJsonp([15],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(81);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(109);

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
			_global2.default.CheckLogin(function () {
				_global2.default.GetCityCode(function (citycode, cityname) {
					_this.citycode = citycode;
					_this.Condition();
					_this.Window();
					(0, _jquery2.default)('.top .city span').text(cityname);
					_global2.default.Statistics();
				});
			});
		}

		(0, _createClass3.default)(Index, [{
			key: 'Window',
			value: function Window() {
				var types = '';
				types = _global2.default.GetUrlPara('type');
				switch (types) {
					case '10':
						(0, _jquery2.default)(document).attr("title", "周边短线");
						break;
					case '11':
						(0, _jquery2.default)(document).attr("title", "国内长线");
						break;
					case '20':
						(0, _jquery2.default)(document).attr("title", "出境旅游");
						break;
					case '30':
						(0, _jquery2.default)(document).attr("title", "邮轮");
						break;
				}
			}
		}, {
			key: 'Condition',
			value: function Condition() {
				var _this = this;
				_global2.default.Ajax({
					url: '/front/B2b/Product/listcondition',
					type: 'get',
					data: {
						city_code: _this.citycode,
						type: _global2.default.GetUrlPara('type')
					},
					success: function success(res) {
						if (res.code == 200) {
							var html = (0, _artTemplate2.default)('tpl-condition', res.data);
							(0, _jquery2.default)('.address').html(html);
							_this.AddressCheck();
							_this.ConditionEvent();
							_this.List();
						}
					}
				});
			}
		}, {
			key: 'AddressCheck',
			value: function AddressCheck() {
				var len = 0;
				(0, _jquery2.default)('.address .address-list li').each(function () {
					len += (0, _jquery2.default)(this).width();
				});
				(0, _jquery2.default)('.address .address-list ul').width(len);
				//赋给出发日期值
				var da_on = decodeURIComponent(_global2.default.GetUrlPara('da_on'));
				var da_tw = decodeURIComponent(_global2.default.GetUrlPara('da_tw'));
				da_on = da_on == 'undefined' ? '' : da_on;
				da_tw = da_tw == 'undefined' ? '' : da_tw;
				if (da_on && da_tw) {
					(0, _jquery2.default)('.datese').val(da_on);
					(0, _jquery2.default)('.dates').val(da_tw);
				} else if (da_on) {
					(0, _jquery2.default)('.datese').val(da_on);
					(0, _jquery2.default)('.dates').val(da_on);
				}
			}
		}, {
			key: 'ConditionEvent',
			value: function ConditionEvent() {
				var _this = this;
				var $wrap = (0, _jquery2.default)('.address'),
				    $ad_list = $wrap.find('.address-list'),
				    $btn = $wrap.find('.address-btn'),
				    $filter = $wrap.find('.filter-wrap'),
				    $filter_menu = $filter.find('.filter-menu'),
				    $filter_list = $filter.find('.filter-list'),
				    $submit = $filter.find('.filter-submit button');

				// 省份选择
				$ad_list.find('li').on('click', function (e) {
					e.stopPropagation();
					(0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
					if (!$filter.hasClass('open')) {
						_this.SetData();
					}
				});
				//阻止冒泡
				(0, _jquery2.default)(".filter-list").on("click", function (e) {
					e.stopPropagation();
				});
				// 删选按扭
				$btn.on('click', function (e) {
					e.stopPropagation();
					$filter.toggle();
					$filter.toggleClass('open');
				});
				// 删选菜单
				$filter_menu.find('li').on('click', function (e) {
					e.stopPropagation();
					if ((0, _jquery2.default)(this).hasClass('active')) {
						return false;
					}
					var type = (0, _jquery2.default)(this).attr('type');
					(0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
					$filter_list.find('ul[type=' + type + ']').addClass('active').siblings().removeClass('active');
				});
				// 删选列表
				$filter_list.find('li').on('click', function (e) {
					e.stopPropagation();
					(0, _jquery2.default)(this).toggleClass('check').siblings().removeClass('check');
				});
				// 确认选择
				$submit.on('click', function (e) {
					e.stopPropagation();
					_this.SetData();
					$filter.hide();
					$filter.removeClass('open');
				});
				// 隐藏浮层
				(0, _jquery2.default)(document).on('click', function () {
					$filter.hide();
					$filter.removeClass('open');
				});
			}
		}, {
			key: 'SetData',
			value: function SetData() {
				var _this = this;
				var $wrap = (0, _jquery2.default)('.address'),
				    $ad_list = $wrap.find('.address-list'),
				    $filter = $wrap.find('.filter-wrap'),
				    $filter_menu = $filter.find('.filter-menu'),
				    $filter_list = $filter.find('.filter-list');

				var type = _global2.default.GetUrlPara('type');
				if (!type) {
					type = '';
				}

				var province = $ad_list.find('li.active span').text(),
				    city = $filter_list.find('ul[type="city"] li.check').text(),
				    days = $filter_list.find('ul[type="days"] li.check').text(),
				    attribute = $filter_list.find('ul[type="attribute"] li.check').text(),
				    scenic = $filter_list.find('ul[type="scenic"] li.check').text(),
				    business = $filter_list.find('ul[type="business"] li.check').text();
				var start = '';
				var datese_on = (0, _jquery2.default)('.datese').val();
				var dates_tw = (0, _jquery2.default)('.dates').val();
				var key = _jquery2.default.trim((0, _jquery2.default)('.search input').val());
				var patt = "-";
				var datese = datese_on.replace(new RegExp(patt), "");
				datese = datese.replace(new RegExp(patt), "");
				var dates = dates_tw.replace(new RegExp(patt), "");
				dates = dates.replace(new RegExp(patt), "");
				if (datese && dates) {
					start = datese + ',' + dates;
				} else if (datese) {
					start = datese + ',' + datese;
				}
				var href_search = 'type=' + type + '&province=' + encodeURIComponent(province) + '&destination=' + encodeURIComponent(city) + '&days=' + encodeURIComponent(days) + '&attribute=' + encodeURIComponent(attribute) + '&scenic=' + encodeURIComponent(scenic) + '&business=' + encodeURIComponent(business) + '&key=' + encodeURIComponent(key) + '&da_on=' + encodeURIComponent(datese_on) + '&da_tw=' + encodeURIComponent(dates_tw) + '&startDate=' + encodeURIComponent(start);
				window.location.href = 'list.html?' + href_search;
			}
		}, {
			key: 'GetData',
			value: function GetData() {
				var _this = this;
				var type = _global2.default.GetUrlPara('type'),
				    province = decodeURIComponent(_global2.default.GetUrlPara('province')),
				    city = decodeURIComponent(_global2.default.GetUrlPara('destination')),
				    days = decodeURIComponent(_global2.default.GetUrlPara('days')),
				    attribute = decodeURIComponent(_global2.default.GetUrlPara('attribute')),
				    scenic = decodeURIComponent(_global2.default.GetUrlPara('scenic')),
				    business = decodeURIComponent(_global2.default.GetUrlPara('business')),
				    key = decodeURIComponent(_global2.default.GetUrlPara('key')),
				    startDate = decodeURIComponent(_global2.default.GetUrlPara('startDate'));

				if (!type) {
					type = '';
				}

				if (!province || province == 'undefined') {
					province = '全部';
				}
				(0, _jquery2.default)('.address .address-list li[v=' + province + ']').addClass('active').siblings().removeClass('active');

				if (!city || city == 'undefined') {
					city = '';
				} else {
					(0, _jquery2.default)('.filter-list ul[type=city] li[v=' + city + ']').addClass('check');
				}

				if (!days || days == 'undefined') {
					days = '';
				} else {
					(0, _jquery2.default)('.filter-list ul[type=days] li[v=' + days + ']').addClass('check');
				}

				if (!attribute || attribute == 'undefined') {
					attribute = '';
				} else {
					(0, _jquery2.default)('.filter-list ul[type=attribute] li[v=' + attribute + ']').addClass('check');
				}

				if (!scenic || scenic == 'undefined') {
					scenic = '';
				} else {
					(0, _jquery2.default)('.filter-list ul[type=scenic] li[v=' + scenic + ']').addClass('check');
				}

				if (!business || business == 'undefined') {
					business = '';
				} else {
					(0, _jquery2.default)('.filter-list ul[type=business] li[v=' + business + ']').addClass('check');
				}

				if (!key || key == 'undefined') {
					key = '';
				} else {
					(0, _jquery2.default)('.search input').val(key);
					(0, _jquery2.default)('.search .search-placeholder').hide();
					(0, _jquery2.default)(".sear").css("display", "block");
				}

				var data = {
					'city_code': _this.citycode, //当前页面城市代码，必须
					'type': type, //产品类型('10'=>'周边短线', '11'=>'国内长线', '20'=>'出境旅游', '30'=>'邮轮') 必须
					'province': province, //目的地省
					'destination': city, //目的地市
					'days': days, //行程天数
					'attribute': attribute, //产品属性
					'scenic': scenic, //热门景点
					//'startDate': '20170112,20170118', //出发日期搜索区间
					'business': business, //商家信息,
					'key': key, //模糊查询,
					'start': 1, //当前页码，可选。不传递则默认为第一页
					'limit': 999, //每页行数，非必须，默认为10行
					'startDate': startDate
				};

				return data;
			}
		}, {
			key: 'List',
			value: function List() {
				var _this = this;
				var data = this.GetData();
				_global2.default.Ajax({
					url: '/front/B2b/Product/lists',
					type: 'post',
					data: data,
					success: function success(res) {
						if (res.code == 200) {
							res.data['city_code'] = _this.citycode;
							var html = (0, _artTemplate2.default)('tpl-list', res.data);
							(0, _jquery2.default)('.products').html(html);
							var total = res.data.total;
							_this.Urls();
							_this.Wx(total);
							new _global2.default.LazyLoad();
						}
					}
				});
			}
		}, {
			key: 'Urls',
			value: function Urls() {
				if (share_user && share_user.u_id) {
					(0, _jquery2.default)(".products ul li a").each(function () {
						var hre = (0, _jquery2.default)(this).attr("href");
						var hr = hre + '&u_id=' + share_user.u_id;
						(0, _jquery2.default)(this).attr("href", hr);
					});
				}
			}
		}, {
			key: 'Wx',
			value: function Wx(total) {
				var host = window.location.host;
				var _this = this;
				var codes = _global2.default.Cookie.Get('city_code');
				var uids = '';
				if (share_user && share_user.u_id) {
					uids = share_user.u_id;
				}
				var key = _global2.default.GetUrlParaByHref('key'); //关键字
				var province = _global2.default.GetUrlParaByHref('province'); //目的城市
				var scenic = _global2.default.GetUrlParaByHref('scenic'); //热门景点
				var days = _global2.default.GetUrlParaByHref('days'); //行程天数
				if (!key || key == undefined) {
					key = '';
				} else {
					key = '（' + key + '）';
				}
				if (!province || province == undefined || province == "全部") {
					province = '';
				}
				if (!scenic || scenic == undefined) {
					scenic = '';
				}
				if (!days || days == undefined) {
					days = '';
				} else {
					days = days + '日游线路合集';
				}
				var type = _global2.default.GetUrlPara('type');
				var p_names = '';
				var p_name = '';
				var p_sname = '';
				var p_cover = '';
				var link = document.location.href + '&city_code=' + codes + '&u_id=' + uids;
				if (type == "10") {
					p_names = "周边短线";
					p_cover = 'http://' + host + '../..../img/10.png';
				} else if (type == '11') {
					p_names = "国内长线";
					p_cover = 'http://' + host + '../..../img/11.png';
				} else if (type == '20') {
					p_names = "出境游";
					p_cover = 'http://' + host + '../..../img/20.png';
				} else if (type == '30') {
					p_names = "邮轮";
					p_cover = 'http://' + host + '../..../img/30.png';
				} else if (type == '40') {
					p_names = "特色游";
					p_cover = 'http://' + host + '../..../img/40.png';
				} else if (type == '50') {
					p_names = "自助游";
					p_cover = 'http://' + host + '../..../img/50.png';
				}

				var userinfo_orgid = '';
				if ((0, _stringify2.default)(share_user) != '{}' && share_user.u_id) {

					p_name = '旅游去哪玩？' + p_names + '爆款线路，超好玩！嗨翻天！';
					p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
					if (share_user.org_logo) {
						p_cover = share_user.org_logo;
					}
				}
				if (_uinfo && _uinfo.m_org_id && _uinfo.u_id) {
					userinfo_orgid = _uinfo.m_org_id;
					if (_uinfo.org_type == "管理公司" || _uinfo.org_type == "供应商") {
						if (key || province || scenic || days) {
							p_name = '为您推荐了' + province + scenic + key + days + '（' + total + '条）';
						} else {
							p_name = '旅游去哪玩？' + p_names + '爆款线路，超好玩！嗨翻天！';
						}
						p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
					} else {
						if (key || province || scenic || days) {
							p_name = _uinfo.u_realname + '为您推荐了' + province + scenic + key + days + '（' + total + '条）';
						} else {
							p_name = '欢迎光临' + _uinfo.u_realname + '的' + _uinfo.org_name + '旅游微店铺,' + p_names + '爆款线路等你来~';
						}
						p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
						p_cover = 'http://' + host + '../..../img/00.png';
					}
				} else {
					if (key || province || scenic || days) {
						p_name = '为您推荐了' + province + scenic + key + days + '（' + total + '条）';
					} else {
						p_name = '旅游去哪玩？' + p_names + '爆款线路，超好玩！嗨翻天！';
					}
					p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
				}
				_global2.default.WxShare.CommonShare({
					title: p_name,
					desc: p_sname,
					url: link,
					pic: p_cover
				});
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 109:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});