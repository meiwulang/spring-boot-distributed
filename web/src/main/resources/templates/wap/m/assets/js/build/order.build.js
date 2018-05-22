webpackJsonp([25],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(81);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(119);

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

	function id_card(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		var tip = "";
		var pass = true;
		if (!code) return {
			status: false,
			msg: '身份证号码不能为空'
		};
		if (typeof code != 'string') code = code.toString();
		code = code.toUpperCase();
		if (code.length != 15 && code.length != 18) {
			tip = "身份证号格式错误";
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			tip = "地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				;var last = parity[sum % 11];
				if (last != code[17]) {
					tip = "验证失败，请注意数字或字母大小写的准确性，填写正确的验证信息！";
					pass = false;
				}
			}
		}
		;return {
			status: pass,
			msg: tip
		};
	}
	function CardChk(idcard) {
		var Errors = new Array("ok", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "验证失败，请注意数字或字母大小写的准确性，填写正确的验证信息!", "身份证地区非法!");
		var area = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		var idcard, Y, JYM;
		var S, M;
		var idcard_array = new Array();
		idcard_array = idcard.split("");
		//地区检验
		var Area = area[parseInt(idcard.substr(0, 2))];
		if (Area == null) return {
			start: 0,
			info: Errors[4]
		};
		//身份号码位数及格式检验
		var Birthday = '',
		    sexCode = '';
		switch (idcard.length) {
			case 15:
				Birthday = '19' + idcard.substr(6, 2) + '-' + idcard.substr(8, 2) + '-' + idcard.substr(10, 2);
				sexCode = idcard.substring(14, 15);
				break;
			case 18:
				//18位身份号码检测
				//出生日期的合法性检查
				Birthday = idcard.substr(6, 4) + '-' + idcard.substr(10, 2) + '-' + idcard.substr(12, 2);
				sexCode = idcard.substring(16, 17);
				//计算校验位
				S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
				Y = S % 11;
				M = "F";
				JYM = "10X98765432";
				M = JYM.substr(Y, 1);
				//判断校验位
				if (M == idcard_array[17]) {//return Errors[0]; //检测ID的校验位
				} else {
					return {
						start: 0,
						info: Errors[3]
					};
				}
				break;
			default:
				return {
					start: 0,
					info: Errors[1]
				};
				break;
		}
		var cSex = '';
		if (sexCode % 2 == 0) {
			cSex = '女';
		} else {
			cSex = '男';
		}
		return {
			start: 1,
			data: {
				area: Area,
				birthday: Birthday,
				sex: cSex
			}
		};
	}
	function CardSex(Card) {
		var cSex = '';
		var isOK = CardChk(Card);
		//检查身份证是否合法
		if (isOK.start != 1) {
			cSex = isOK.info;
			//不合法则返回错误信息
		} else {
			var cLen = Card.length;
			if (cLen == 15) {
				sexCode = Card.substring(14, 15);
			} else if (cLen == 18) {
				sexCode = Card.substring(16, 17);
			}
			if (sexCode % 2 == 0) {
				cSex = '女';
			} else {
				cSex = '男';
			}
		}
		return cSex;
	}
	function getAge(Card) {
		var Age = '';
		var isOK = CardChk(Card);
		if (isOK.start != 1) {
			Age = isOK.info;
		} else {
			var cLen = Card.length;
			var date = new Date();
			//var CardArr = new Array();
			//CardArr = Card.split("");
			switch (cLen) {
				case 15:
					var y = Card.substr(6, 2);
					//年
					var m = Card.substr(8, 2);
					//月
					var d = Card.substr(10, 2);
					//日
					var birth = "19" + y + '-' + m + '-' + d;
					if (m < 9) {
						var zs = date.getFullYear() - 1900 - y;
						//9月份前出生的周岁
					} else {
						var zs = date.getFullYear() - 1900 - y - 1;
						//9月份出生后的周岁
					}
					var Age = zs;
					// 返回周岁
					break;
				case 18:
					var y = Card.substr(6, 4);
					//年
					var m = Card.substr(10, 2);
					//月
					var d = Card.substr(12, 2);
					//日
					var birth = y + '-' + m + '-' + d;
					if (m < 9) {
						var zs = date.getFullYear() - y;
					} else {
						var zs = date.getFullYear() - y - 1;
					}
					var Age = zs;
					break;
			}
		}
		return Age;
	}
	function chechIdcard(val, opt) {
		if (opt.card_type != '身份证' || val == '' || val == null) return true;
		val = val.replace('x', 'X');
		var rst = CardChk(val);
		//console.log([val,opt,rst]);
		if (rst.start == 0) {
			return rst;
		} else {
			var card = rst.data;
			if (opt.limit_type == "限制性别" || opt.limit_type == "限性别") {
				if (card.sex != opt.limit_condition) {
					return {
						start: 0,
						info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition
					};
				} else {
					// 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
					// return true;
				}
			}
			//票种限制年龄
			if (opt.limit_type == "限制年龄" || opt.limit_type == "限年龄") {
				var condition = opt.limit_condition,
				    where = "";
				var Age = getAge(val);
				if (condition.indexOf("-") >= 0) {
					var bt = condition.split("-");
					where = Age > bt[0] && Age < bt[1];
				} else if (condition.indexOf("<") >= 0) {
					var gt = condition.split("<");
					where = Age < gt[1];
				} else if (condition.indexOf(">") >= 0) {
					var gt = condition.split(">");
					where = Age > gt[1];
				} else {
					where = Age == condition;
				}
				if (where) {
					// 很奇怪的一个地方，外部调用都要用到rst.start来判断chechIdcard是否验证成功，这儿却return true,不符合逻辑
					// return true;
				} else {
					return {
						start: 0,
						info: "身份证填写错误,此票种" + opt.limit_type + "为" + opt.limit_condition + '，当前年龄是：' + Age
					};
				}
			}
		}
		return rst;
	}

	var Index = function () {
		function Index() {
			(0, _classCallCheck3.default)(this, Index);

			var _this = this;
			this.DATA = {};
			this.ustype = '';
			this.type_3Flag = true;
			this.main_cardType = null;
			if (!(_uinfo && _uinfo.u_id)) {
				window.location.href = 'login.html?ty=detail';
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
				var ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
				var ticketId_list = [];
				ticket_list.forEach(function (data) {
					ticketId_list.push(data.tid);
				});
				_global2.default.Ajax({
					// url : '/b2b/shop/info',
					url: '/front/order/m/queryOrderInfo',
					type: 'post',
					data: {
						p_id: _global2.default.GetUrlPara('p_id'),
						bl_id: _global2.default.GetUrlPara('bl_id'),
						city_code: _this.citycode,
						tickets: ticketId_list
					},
					success: function success(res) {
						if (res.code == 200) {
							_this.DATA = res.data;
							res.data['ticket_show'] = _this.TicketData();
							// _this.ustype = res.ustype;
							if (res.data && res.data != null && res.data.uStype && res.data.uStype == '3') {
								_this.ustype = '3';
							}

							_this.DATA = res.data;
							var html = (0, _artTemplate2.default)('tpl-order', res.data);
							(0, _jquery2.default)('.main').html(html);
							(0, _jquery2.default)('.t-bar a.back').on('click', function () {
								window.history.back();
							});
							// $('.tourist-list li:gt(1)').hide();
							_this.Event();
							// if(_this.ustype == '3'){
							// 	$(".payment").show();
							// 	$(".add-card").trigger("click");
							// }
							if (window.__wxjs_environment === "miniprogram" || _this.ustype == '3') {
								(0, _jquery2.default)(".payment").show();
								(0, _jquery2.default)(".add-card").trigger("click");
								(0, _jquery2.default)(".companyorsingleWrap").hide();
							}
							if (window.__wxjs_environment !== "miniprogram") {
								(0, _jquery2.default)(".companyorsingleWrap").show();
							}
							_this.Settlement();
						}
					}
				});
			}
		}, {
			key: 'TicketData',
			value: function TicketData() {
				var _this = this;
				var ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
				var ticket_show = {};
				for (var i = 0; i < ticket_list.length; i++) {
					for (var j in _this.DATA.ticket) {
						if (ticket_list[i].tid == j) {
							ticket_show[j] = _this.DATA.ticket[j];
							ticket_show[j]['base_num'] = ticket_list[i].num;
							ticket_show[j]['t_name'] = ticket_list[i].t_name;
							ticket_show[j]['people_num'] = ticket_list[i].num * _this.DATA.ticket[j].num;
							ticket_show[j]['bed_num'] = ticket_list[i].num * _this.DATA.ticket[j].room_num;
							ticket_show[j]['bed_price'] = 0;
							ticket_show[j]['bed_dec'] = 0;
							ticket_show[j]['people_num_round'] = [];
							for (var x = 0; x < ticket_show[j]['people_num']; x++) {
								ticket_show[j]['people_num_round'].push(x);
							}
							if (_this.DATA.ticket[j].t_preset_type == '套票') {
								for (var k in _this.DATA.ticket[j].list) {
									ticket_show[j].list[k]['people_num'] = ticket_list[i].num * _this.DATA.ticket[j].list[k].num;
									ticket_show[j].list[k]['bed_num'] = ticket_list[i].num * _this.DATA.ticket[j].list[k].room_num;
									ticket_show[j].list[k]['bed_price'] = 0;
									ticket_show[j].list[k]['bed_dec'] = 0;
									ticket_show[j].list[k]['people_num_round'] = [];
									for (var _x = 0; _x < ticket_show[j].list[k]['people_num']; _x++) {
										ticket_show[j].list[k]['people_num_round'].push(_x);
									}
								}
							}
							break;
						}
					}
				}
				return ticket_show;
				console.log(ticket_show, 'ticket_show');
			}
		}, {
			key: 'Event',
			value: function Event() {
				var _this = this;
				(0, _jquery2.default)('.ticket-info .list .toggle').on('click', function () {
					(0, _jquery2.default)(this).parent().toggleClass('open');
				});

				(0, _jquery2.default)('.remark h4 span').on('click', function () {
					(0, _jquery2.default)('.remark').toggleClass('open');
				});

				(0, _jquery2.default)('.see-detail').on('click', function () {
					(0, _jquery2.default)('.pos').addClass('in');
				});
				(0, _jquery2.default)('.prime').on('click', function () {
					(0, _jquery2.default)('.primes').addClass('in');
				});
				(0, _jquery2.default)('.pri_a').on('click', function () {
					(0, _jquery2.default)('.primes').removeClass('in');
				});
				//合同补充约定 提交
				(0, _jquery2.default)(".pri_btn").on("click", function () {
					var html = (0, _jquery2.default)(".text_area").val();
					(0, _jquery2.default)(".prime-text").html(html);
					(0, _jquery2.default)('.primes').removeClass('in');
				});
				(0, _jquery2.default)('.pos a.back').on('click', function () {
					(0, _jquery2.default)('.pos').removeClass('in');
					(0, _jquery2.default)('.pos-s1').show();
					(0, _jquery2.default)('.pos-s2').hide();
				});

				//卡券支付
				(0, _jquery2.default)(".add-card").on("click", function () {
					var html = '<dl><dd><span>卡号：</span><span><input class="card-num" type="text" value="" placeholder="请输入卡号"><span class="clet">&times;</span>';
					html += '</span></dd><dd class="items clearfix"><span><span>密码：</span><span><input class="pass" type="password" value="" placeholder="请输入卡密码"><span class="pwd-check">验证</span>';
					html += '</span></dd></dl>';
					(0, _jquery2.default)(".card-mor").append(html);
					_this.Vall();
				});

				//首付款
				(0, _jquery2.default)('.fullOrFirst li').on('click', function () {

					(0, _jquery2.default)('.fullOrFirst li').find('span').removeClass('active');
					(0, _jquery2.default)(this).find('span').addClass('active');

					var $full = (0, _jquery2.default)('.pay-full span');
					var $first = (0, _jquery2.default)('.pay-first span');
					var amount = '';

					// if ($first.hasClass('active')) {
					// 	console.log('first')
					// 	amount = _this.DATA.pay_amount;
					// }
					_this.Settlement();
				});
				(0, _jquery2.default)('.fullOrTwo li').on('click', function () {

					(0, _jquery2.default)('.fullOrTwo li').find('span').removeClass('active');
					(0, _jquery2.default)(this).find('span').addClass('active');

					var $company = (0, _jquery2.default)('.pay-company span');
					var $single = (0, _jquery2.default)('.pay-single span');
				});
				this.BedEvent();
				this.TouristEvent();
				this.SiteEvent();
				this.PromotionEvent();
				this.Submit();
			}
		}, {
			key: 'Vall',
			value: function Vall() {
				var _this = this;
				//验证
				(0, _jquery2.default)('.pwd-check').off().on("click", function () {
					var cardNo = [];
					var _index = (0, _jquery2.default)(this).parents("dl").index();
					var num = (0, _jquery2.default)(this).parents("dl").find(".card-num").val();
					var passe = (0, _jquery2.default)(this).parents("dl").find(".pass").val();
					if (!_jquery2.default.trim(num)) {
						_global2.default.Popup.Tip('请输入卡号');
						return false;
					}
					if (!_jquery2.default.trim(passe)) {
						_global2.default.Popup.Tip('请输入密码');
						return false;
					}
					// 如果type=3则不能通过下一次验证
					if (!_this.type_3Flag) {
						_global2.default.Popup.Tip('折扣卡仅限单张使用！');
						return false;
					}
					// 判断是否有相同卡号
					var cardNumList = [];
					(0, _jquery2.default)(".card-num").each(function () {
						cardNumList.push((0, _jquery2.default)(this).val());
					});
					if (unique(cardNumList).length != cardNumList.length) {
						_global2.default.Popup.Tip('有重复卡号！');
						return false;
					}
					passe = hex_md5(passe);
					var cararr = {
						cardNo: num,
						pass: passe
					};
					cardNo.push(cararr);
					var pid = _global2.default.GetUrlPara('p_id');
					var appletId = window.sessionStorage.getItem('appletId');
					if (!appletId) {
						appletId = '';
					}

					_global2.default.Ajax({
						url: '/Order/validateCard',
						type: 'post',
						data: {
							appletId: appletId,
							cardList: cardNo,
							pid: pid
						},
						success: function success(res) {
							if (res.code == 0) {
								var data = res.body;
								if (data && data.length) {
									// 伪测试数据
									// var data=[{
									// 	cardType:3,
									// 	cardDiscountRate:0.9,
									// 	cardDiscountMax:500,
									// 	cardPrice:10,
									// 	cardPerson:5,
									// 	cardPersonPrior:1
									// }]

									// 卡类型唯一限制
									if (_this.main_cardType == null) {
										_this.main_cardType = data[0].cardType;
									} else {
										if (_this.main_cardType != data[0].cardType) {
											_global2.default.Popup.Tip('请使用同一种类型的卡！');
											_this.Settlement();
											return false;
										}
									}
									// 判断卡类型
									(0, _jquery2.default)('.payment li dl').eq(_index).attr("via", '1');
									if (data[0].cardType == 1) {
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("num", data[0].cardPerson);
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("Prior", data[0].cardPersonPrior);
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("c_type", "1");
									} else if (data[0].cardType == 2) {
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("num", data[0].cardPrice);
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("c_type", "2");
									} else {
										_this.type_3Flag = false;
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("num", data[0].cardDiscountRate);
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("cardMax", data[0].cardDiscountMax);
										(0, _jquery2.default)('.payment li dl').eq(_index).attr("c_type", "3");
									}
									(0, _jquery2.default)('.payment li dl').eq(_index).find(".pwd-check").html("通过").addClass("active");
									_this.Settlement();
								}
							}
						}
					});
				});
				(0, _jquery2.default)(".card-mor .clet").off().on("click", function () {
					// type_3Flag 为false不能新增，并置true
					console.log("c_type", (0, _jquery2.default)(this).attr("c_type"));
					if ((0, _jquery2.default)(this).parents("dl").attr("c_type") == 3) {
						_this.type_3Flag == false && (_this.type_3Flag = true);
					}
					(0, _jquery2.default)(this).parents("dl").remove();
					_this.Settlement();
				});
				//当卡号 密码发生变化之后状态改变
				// $(".card-mor dl").each(function(){

				// })
				// 卡号去重方法
				function unique(list) {
					var res = [];
					var json = {};
					for (var i = 0; i < list.length; i++) {
						if (!json[list[i]]) {
							res.push(list[i]);
							json[list[i]] = 1;
						}
					}
					return res;
				}
			}
		}, {
			key: 'BedEvent',
			value: function BedEvent() {
				var _this = this;
				var data = this.DATA.ticket_show;
				(0, _jquery2.default)('.bed li .num-check span').on('click', function () {
					var $li = (0, _jquery2.default)(this).parents('li'),
					    $input = $li.find('.num-check input'),
					    tid = $li.attr('tid'),
					    type = $li.attr('type'),
					    active = (0, _jquery2.default)(this).attr('class');
					var people_num = parseInt($li.attr('people_num'));
					var num = parseInt($input.val());
					switch (active) {
						case 'reduce':
							num--;
							break;
						case 'add':
							num++;
							break;
						default:
							break;
					}
					// 床位超过2倍或为负数停止运行
					if (people_num * 2 < num || num < 0) {
						return false;
					}
					$input.val(num);

					var bedprice = 0;
					switch (type) {
						case 'group':
							var ttid = $li.attr('tid');
							tid = $li.attr('pid');

							var dec = num - data[tid].base_num * data[tid].list[ttid].room_num; // 房差数
							var addprice = data[tid].list[ttid].t_spread_price,
							    // 退房价
							reduceprice = data[tid].list[ttid].t_out_room_price; // 加房价
							if (dec > 0) {
								bedprice = dec * addprice;
							} else {
								bedprice = dec * reduceprice;
							}
							data[tid].list[ttid].bed_num = num;
							data[tid].list[ttid].bed_price = bedprice;
							data[tid].list[ttid].bed_dec = dec;
							break;
						case 'normal':
							var dec = num - data[tid].base_num * data[tid].room_num; // 房差数
							var addprice = data[tid].t_spread_price,
							    // 退房价
							reduceprice = data[tid].t_out_room_price; // 加房价
							if (dec > 0) {
								bedprice = dec * addprice;
							} else {
								bedprice = dec * reduceprice;
							}
							data[tid].bed_num = num;
							data[tid].bed_price = bedprice;
							data[tid].bed_dec = dec;
							break;
					}
					$li.find('.price span').text(bedprice.toFixed(2));
					_this.Settlement();
				});
			}
		}, {
			key: 'TouristEvent',
			value: function TouristEvent() {
				(0, _jquery2.default)('.tourist-list li').each(function (index) {
					(0, _jquery2.default)(this).find('.number').text(index + 1);
				});
				//第一个游客为游客代表人
				(0, _jquery2.default)(".tourist-list ul li:first").find(".name u").html("填写游客代表人信息");
				(0, _jquery2.default)(".tourist-list ul li:first").attr("is_rep", "1");
				if (!(0, _jquery2.default)('.tourist-list li.limit').size()) {
					(0, _jquery2.default)('.tourist-list li').eq(0).show();
				}
				(0, _jquery2.default)('.bed-list li').hide();
				(0, _jquery2.default)('.bed-list li').eq(0).show();

				if (!(0, _jquery2.default)('.tourist-list li.nolimit').size() || (0, _jquery2.default)('.tourist-list li').length == 1) {
					(0, _jquery2.default)('.tourist-more').hide();
				}
				(0, _jquery2.default)('.tourist-more').on('click', function (e) {
					e.stopPropagation();
					(0, _jquery2.default)(this).toggleClass('open');
					if ((0, _jquery2.default)(this).hasClass('open')) {
						(0, _jquery2.default)(this).parents(".show_hide").find("li.nolimit").show();
						(0, _jquery2.default)(this).find('span').text('收起');
					} else {
						(0, _jquery2.default)(this).find('span').text('展开所有');
						(0, _jquery2.default)(this).parents(".show_hide").find("li.nolimit").hide();
						(0, _jquery2.default)('.bed-list li').eq(0).show();
						if (!(0, _jquery2.default)('.tourist-list li.limit').size()) {
							(0, _jquery2.default)('.tourist-list li').eq(0).show();
						}
					}
				});

				(0, _jquery2.default)('.tourist-list li').on('click', function () {
					var ind = (0, _jquery2.default)(this).index();
					var data = (0, _jquery2.default)(this).data('data');
					if (ind == '0') {
						(0, _jquery2.default)(".tourist-info-con .card_type").html('<option>身份证</option><option>护照</option>');
					} else {
						var html = '<option>身份证</option><option>护照</option>';
						html += '<option>军官证</option><option>回乡证</option>';
						html += '<option>台胞证</option><option>国际海员证</option>';
						html += '<option>港澳通行证</option><option>赴台证</option>';
						(0, _jquery2.default)(".tourist-info-con .card_type").html(html);
					};
					if (data) {
						(0, _jquery2.default)('.tourist-info input.name').val(data.name);
						(0, _jquery2.default)('.tourist-info input.tel').val(data.tel);
						(0, _jquery2.default)('.tourist-info select.card_type').val(data.card_type);
						(0, _jquery2.default)('.tourist-info input.card_no').val(data.card_no);
					} else {
						(0, _jquery2.default)('.tourist-info input.name').val('');
						(0, _jquery2.default)('.tourist-info input.tel').val('');
						(0, _jquery2.default)('.tourist-info select.card_type').val('身份证');
						(0, _jquery2.default)('.tourist-info input.card_no').val('');
					}
					if ((0, _jquery2.default)(this).hasClass('limit')) {
						var name = (0, _jquery2.default)(this).attr('name'),
						    limit_type = (0, _jquery2.default)(this).attr('limit_type'),
						    limit_condition = (0, _jquery2.default)(this).attr('limit_condition');
						(0, _jquery2.default)('.tourist-info .tips span').text(name + '：');
						(0, _jquery2.default)('.tourist-info .tips u').text('（限制：' + limit_type + ' ' + limit_condition + '）');
						(0, _jquery2.default)('.tourist-info .tips').show().attr({
							'limit_type': limit_type,
							'limit_condition': limit_condition
						});
					} else {
						(0, _jquery2.default)('.tourist-info .tips').hide().attr({
							'limit_type': '无限制',
							'limit_condition': ''
						});
					}
					(0, _jquery2.default)('.tourist-info').addClass('in').attr('ind', ind);
				});

				(0, _jquery2.default)('.tourist-info a.back').on('click', function () {
					(0, _jquery2.default)('.tourist-info').removeClass('in');
					(0, _jquery2.default)('.tourist-info-con i.icon-error').hide();
				});

				(0, _jquery2.default)('.tourist-info .save').on('click', function () {
					var ind = (0, _jquery2.default)('.tourist-info').attr('ind');
					var name = _jquery2.default.trim((0, _jquery2.default)('input.name').val()),
					    tel = _jquery2.default.trim((0, _jquery2.default)('input.tel').val()),
					    card_type = _jquery2.default.trim((0, _jquery2.default)('select.card_type').val()),
					    card_no = _jquery2.default.trim((0, _jquery2.default)('input.card_no').val());
					var limit_type = (0, _jquery2.default)('.tourist-info .tips').attr('limit_type'),
					    limit_condition = (0, _jquery2.default)('.tourist-info .tips').attr('limit_condition');

					(0, _jquery2.default)('.tourist-info-con i.icon-error').hide();

					if (!(0, _jquery2.default)('.tourist-list').hasClass('have-one')) {
						if (!name) {
							_global2.default.Popup.Tip('请填写姓名');
							(0, _jquery2.default)('.tourist-info-con input.name').next().show();
							return false;
						}

						if (!_global2.default.RegEx.Tel(tel)) {
							_global2.default.Popup.Tip('请填写正确的手机号码');
							(0, _jquery2.default)('.tourist-info-con input.tel').next().show();
							return false;
						}
					}

					if (card_type == '身份证' && card_no) {
						var rst = CardChk(card_no);
						//验证失败
						if (rst.start == 0) {
							_global2.default.Popup.Tip(rst.info);
							return false;
						}
					}
					if (card_type == '护照' && card_no) {
						if (!_global2.default.RegEx.Passport(card_no)) {
							_global2.default.Popup.Tip("请填写正确护照信息！");
							return false;
						}
					}
					if (limit_type != '无限制' && card_type == '身份证') {
						if (!card_no) {
							_global2.default.Popup.Tip('请填写身份证号码');
							(0, _jquery2.default)('.tourist-info-con input.card_no').next().show();
							return false;
						}

						// 验证数据
						var opt = {
							card_type: card_type,
							limit_type: limit_type,
							limit_condition: limit_condition
						};
						var _rst = chechIdcard(card_no, opt);
						//验证失败
						if (_rst.start == 0) {
							_global2.default.Popup.Tip(_rst.info);
							(0, _jquery2.default)('.tourist-info-con input.card_no').next().show();
							return false;
						}
					}

					if (ind == 0) {
						if (!card_no) {
							_global2.default.Popup.Tip('请填写证件号');
							(0, _jquery2.default)('.tourist-info-con input.card_no').next().show();
							return false;
						}
					}

					var is_rep = '';
					if (ind == '0') {
						is_rep = '1';
					};
					var data = {
						is_rep: is_rep,
						name: name,
						tel: tel,
						card_type: card_type,
						card_no: card_no
					};
					if (data.name || data.tel || data.card_no) {
						var $li = (0, _jquery2.default)('.tourist-list li').eq(ind);
						$li.data('data', data);
						$li.find('.name u').text(data.name);
						$li.find('.tel').show().text(data.tel);
						// if(data.card_no){
						$li.find('.card').show().find('.card-type').text(data.card_type);
						$li.find('.card .card-no').text(data.card_no);
						// }
						(0, _jquery2.default)('.tourist-list').addClass('have-one');
						(0, _jquery2.default)('.tourist-list').find('li').eq(ind).addClass('writed');
					}
					(0, _jquery2.default)('.tourist-info').removeClass('in');
				});
			}
		}, {
			key: 'SiteEvent',
			value: function SiteEvent() {
				var _this = this;

				var t_id = [];
				var tlist = this.DATA.ticket_show;
				for (var i in tlist) {
					var t = tlist[i].t_preset_type;
					if (t == '套票') {
						for (var j in tlist[i].list) {
							t_id.push(tlist[i].list[j].t_id);
						}
					} else {
						t_id.push(tlist[i].t_id);
					}
				}
				t_id = t_id.join(',');

				(0, _jquery2.default)('.site .item').on('click', function () {
					var type = 'go';
					if ((0, _jquery2.default)(this).hasClass('site-back')) {
						type = 'back';
					}
					(0, _jquery2.default)('.site-input input').val('');
					(0, _jquery2.default)('.site-select').attr('type', type);
					var start_date = _this.DATA.bl_start_date.replace(/\-/gi, '');
					var p_id = _global2.default.GetUrlPara('p_id');
					_global2.default.Ajax({
						url: '/front/b2b/shop/station',
						type: 'post',
						data: {
							limit: "999",
							start: 1,
							start_date: start_date,
							start_time: "",
							t_id: t_id,
							p_id: p_id,
							bl_id: _global2.default.GetUrlPara('bl_id')
						},
						success: function success(res) {
							if (res.code == 200) {
								// let go_list = [],
								// 	back_list = [];
								// for(let i = 0; i < res.data.list.length; i++){
								// 	if( res.data.list[i].go_back == '去程' ){
								// 		let go_flag = 0;
								// 		for(let j = 0; j < go_list.length; j++){
								// 			if( go_list[j].site_name == res.data.list[i].site_name ){
								// 				go_list[j].list.push(res.data.list[i]);
								// 				go_flag = 1;
								// 				break;
								// 			}
								// 		}
								// 		if( go_flag == 0 ){
								// 			go_list.push({
								// 				site_name : res.data.list[i].site_name,
								// 				list : [res.data.list[i]]
								// 			})
								// 		}
								// 	}else{
								// 		let back_flag = 0;
								// 		for(let j = 0; j < back_list.length; j++){
								// 			if( back_list[j].site_name == res.data.list[i].site_name ){
								// 				back_list[j].list.push(res.data.list[i]);
								// 				back_flag = 1;
								// 				break;
								// 			}
								// 		}
								// 		if( back_flag == 0 ){
								// 			back_list.push({
								// 				site_name : res.data.list[i].site_name,
								// 				list : [res.data.list[i]]
								// 			})
								// 		}
								// 	}
								// }
								// res.data['go_list'] = go_list;
								// res.data['back_list'] = back_list;
								res.data['type'] = type;
								res.data['stop'] = res.data.data.stop_status;
								var html = (0, _artTemplate2.default)('tpl-site-select-list', res.data);
								(0, _jquery2.default)('.site-select-list').html(html);
								(0, _jquery2.default)('.site-select').addClass('in');
								(0, _jquery2.default)('.site-select-list .on_btn').on('click', function () {
									var name = (0, _jquery2.default)(this).attr('name');
									var time = (0, _jquery2.default)(this).attr('time');
									(0, _jquery2.default)('.site-input input').val(time + " " + name);
									(0, _jquery2.default)(this).parents(".site-select-list").find("li").removeClass("check");
									(0, _jquery2.default)(this).addClass('check');
									(0, _jquery2.default)('.site-select .save').click();
								});
								(0, _jquery2.default)(".site-select-list .on_btn_no").on("click", function () {
									_global2.default.Popup.Tip('班车已停售，如需乘坐请联系商家！');
								});
								(0, _jquery2.default)('.site-input input').on('keyup', function () {
									var v = _jquery2.default.trim((0, _jquery2.default)(this).val());
									if (v) {
										(0, _jquery2.default)('.site-select-list li').removeClass('check');
									}
								});
							}
						}
					});
				});

				(0, _jquery2.default)('.site-select a.back').on('click', function () {
					(0, _jquery2.default)('.site-select').removeClass('in');
				});

				(0, _jquery2.default)('.site-select .save').on('click', function () {
					var type = (0, _jquery2.default)('.site-select').attr('type');
					var v = _jquery2.default.trim((0, _jquery2.default)('.site-input input').val()),
					    time = '',
					    id = '',
					    name = '',
					    types = '',
					    price = '',
					    bus_id = void 0;

					if ((0, _jquery2.default)('.site-select-list li').hasClass("check")) {
						types = (0, _jquery2.default)('.site-select-list li.check').attr('types');
						time = (0, _jquery2.default)('.site-select-list li.check').attr('time');
						id = (0, _jquery2.default)('.site-select-list li.check').attr('lid');
						name = (0, _jquery2.default)('.site-select-list li.check').attr('name');
						price = (0, _jquery2.default)('.site-select-list li.check').attr('price');
						bus_id = (0, _jquery2.default)('.site-select-list li.check').attr('bus_id');
					} else {
						name = v;
						price = '0.00';
					}
					var data = {
						types: types,
						time: time,
						id: id,
						name: name,
						price: price,
						bus_id: bus_id
					};
					var $item = (0, _jquery2.default)('.site .site-' + type);
					$item.data('data', data);
					$item.find('.no-check').hide();
					$item.find('.checked').show();
					$item.find('.checked p').text(data.time + " " + data.name);
					$item.find('.checked i').text('￥' + data.price + '/人');
					(0, _jquery2.default)('.site-select').removeClass('in');

					_this.Settlement();
				});
			}
		}, {
			key: 'PromotionEvent',
			value: function PromotionEvent() {
				var _this = this;

				if ((0, _jquery2.default)('.promotion-list li').length > 1) {
					(0, _jquery2.default)('.promotion-list li:gt(0)').hide();
				} else {
					(0, _jquery2.default)('.promotion-more').hide();
				}

				(0, _jquery2.default)('.promotion-list li').on('click', function () {
					if ((0, _jquery2.default)(this).hasClass('active')) {
						return false;
					}
					(0, _jquery2.default)(this).addClass('active').siblings().removeClass('active');
					_this.Settlement();
				});

				(0, _jquery2.default)('.promotion-more').on('click', function () {
					(0, _jquery2.default)(this).toggleClass('open');
					if ((0, _jquery2.default)(this).hasClass('open')) {
						(0, _jquery2.default)('.promotion-list li').show();
						(0, _jquery2.default)(this).find('span').text('收起');
					} else {
						(0, _jquery2.default)('.promotion-list li:gt(0)').hide();
						(0, _jquery2.default)(this).find('span').text('展开所有');
					}
				});

				(0, _jquery2.default)('.pos .change').on('click', function () {
					(0, _jquery2.default)('.pos .pos-s1,.pos .pos-s2').toggle();
					(0, _jquery2.default)(this).toggleClass("changes");
				});
			}
		}, {
			key: 'Settlement',
			value: function Settlement() {
				var _this = this;
				var data = this.DATA.ticket_show;
				console.log("this.DATA.ticket_show", this.DATA.ticket_show);
				console.log("this.DATA.ticket", this.DATA.ticket);
				console.log("this.DATA.ticketfirstpay_type", this.DATA.firstpay_type);
				var AllPrice = 0; // 总价
				var TicketPrice = 0; // 票价总和
				var TicketTradePrice = 0; // 同行价总和
				var BedPrice = 0; // 房差总和
				var Go = { // 去程
					price: 0,
					name: '',
					num: 0
				};
				var Back = { // 返程
					price: 0,
					name: '',
					num: 0
				};
				var SitePrice = 0; // 去程返程总和
				var godata = (0, _jquery2.default)('.site .site-go').data('data'),
				    backdata = (0, _jquery2.default)('.site .site-back').data('data');
				var goprice = 0,
				    backprice = 0;
				if (godata) {
					Go.name = godata.name;
					goprice = godata.price;
				}
				if (backdata) {
					Back.name = backdata.name;
					backprice = backdata.price;
				}

				var AdultTotal = 0,
				    AdultNum = 0,
				    ChildrenTotal = 0,
				    ChildrenNum = 0,
				    SetsTotal = 0,
				    SetsNum = 0;

				for (var _i in data) {
					var limit_type = data[_i].t_preset_type;
					switch (limit_type) {
						case '成人票':
							AdultTotal += data[_i].base_num * data[_i].t_trade_price;
							AdultNum += data[_i].base_num;
							BedPrice += data[_i].bed_price;
							break;
						case '儿童票':
							ChildrenTotal += data[_i].base_num * data[_i].t_trade_price;
							ChildrenNum += data[_i].base_num;
							BedPrice += data[_i].bed_price;
							break;
						case '套票':
							SetsTotal += data[_i].base_num * data[_i].t_trade_price;
							SetsNum += data[_i].base_num;
							for (var j in data[_i].list) {
								BedPrice += data[_i].list[j].bed_price;
							}
							break;
					}

					Go.price += goprice * data[_i].people_num;
					Go.num += data[_i].people_num;
					Back.price += backprice * data[_i].people_num;
					Back.num += data[_i].people_num;
					SitePrice += goprice * data[_i].people_num + backprice * data[_i].people_num;
					TicketPrice += data[_i].base_num * data[_i].t_price;
					TicketTradePrice += data[_i].base_num * data[_i].t_trade_price;
				}
				this.DATA['Go'] = Go;
				this.DATA['Back'] = Back;
				// 活动优惠金额
				var p_data = this.DATA.p_promotion;
				var ActiveTotal = 0,
				    ActiveTitle = '';
				if (p_data.length > 0) {
					var pp_id = (0, _jquery2.default)('.promotion-list li.active').attr('lid');
					for (var z = 0; z < p_data.length; z++) {
						if (p_data[z].pp_id != pp_id) {
							continue;
						}
						var type = p_data[z].pp_type;
						var pp_num = p_data[z].pp_amount;
						ActiveTitle = p_data[z].pp_title;
						// 定额
						if (type == 'quota') {
							var pp_son_type = p_data[z].pp_son_type;
							// 定额每人
							if (pp_son_type == 'quotaPerson') {
								var pp_ticket_type = p_data[z].pp_ticket_type;

								for (var i = 0; i < pp_ticket_type.length; i++) {
									var this_type = pp_ticket_type[i];
									switch (this_type) {
										case 'adult':
											// 成人
											ActiveTotal += AdultNum * pp_num;
											break;
										case 'children':
											//儿童
											ActiveTotal += ChildrenNum * pp_num;
											break;
										case 'sets':
											// 套票
											ActiveTotal += SetsNum * pp_num;
											break;
									}
								}
							}
							// 定额每单
							if (pp_son_type == 'quotaOrder') {
								ActiveTotal = pp_num;
							}
						}
						// 百分比
						if (type == 'percent') {
							var pp_ticket_type = p_data[z].pp_ticket_type;
							// 最高优惠价
							var max_money = p_data[z].pp_max_limit;

							for (var i = 0; i < pp_ticket_type.length; i++) {
								var this_type = pp_ticket_type[i];
								switch (this_type) {
									case 'adult':
										// 成人
										ActiveTotal += AdultTotal * pp_num / 100;
										break;
									case 'children':
										//儿童
										ActiveTotal += ChildrenTotal * pp_num / 100;
										break;
									case 'sets':
										// 套票
										ActiveTotal += SetsTotal * pp_num / 100;
										break;
								}
							}

							if (max_money && ActiveTotal > max_money) {
								ActiveTotal = max_money;
							}
						}
						// 退出循环
						break;
					}
				}
				this.DATA['Active'] = {
					ActiveTotal: -1 * ActiveTotal,
					ActiveTitle: ActiveTitle
				};

				var amount = 1;

				if ((0, _jquery2.default)('.pay-first span').hasClass('active')) {
					amount = this.DATA.pay_amount;
				} else {
					amount = 1;
				}
				if (this.DATA.pay_way == 1) {
					if (this.DATA.firstpay_type == 1) {
						var priceWrap = AdultNum + ChildrenNum;
						AllPrice = priceWrap * amount;
					} else {
						AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
					}
				} else {
					AllPrice = TicketPrice + BedPrice + SitePrice;
				}
				console.log(AllPrice, 'AllPrice');
				console.log(TicketPrice, 'TicketPrice');
				console.log(BedPrice, 'BedPrice');
				console.log(SitePrice, 'SitePrice');
				// AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
				var FactTotal = TicketTradePrice + BedPrice + SitePrice; // 实际结算
				var GetTotal = AllPrice - FactTotal; // 佣金
				this.DATA['TicketTradePrice'] = TicketTradePrice;
				this.DATA['FactTotal'] = FactTotal;
				this.DATA['GetTotal'] = GetTotal;
				this.DATA['AllPrice'] = AllPrice.toFixed(2);
				this.DATA['BedPrice'] = BedPrice;
				this.DATA['SitePrice'] = SitePrice;

				if ((0, _jquery2.default)('.pay-first span').hasClass('active')) {
					if (this.DATA.firstpay_type == 1) {
						var priceWrap = AdultNum + ChildrenNum;
						AllPrice = priceWrap * amount;
					} else {
						AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
					}
					(0, _jquery2.default)('.submit .total .price span').text(Math.ceil(AllPrice).toFixed(2));
				} else {
					AllPrice = TicketPrice + BedPrice + SitePrice;
					(0, _jquery2.default)('.submit .total .price span').text(AllPrice.toFixed(2));
				}
				var html = (0, _artTemplate2.default)('tpl-pos', this.DATA);
				(0, _jquery2.default)('.pos-con').html(html);
				if (window.__wxjs_environment === "miniprogram" || _this.ustype == '3') {
					//判断为卡券支付
					var pare = _this.Cardpri(); // wuli郑,这里处理是亮点,可以给个赞
					var session_Pare = JSON.parse((0, _stringify2.default)(pare));
					// console.log("执行Cardpri()输出pare=>",pare);
					var numm = 0; //抵消卡数
					var minus = 0; //用卡要减去的钱数
					// yjk_todo 为每种卡设置初始变量 
					var _cardPerson = {
						"adult": 0,
						"child": 0
					}; //名额卡
					// 名额卡中票的数组需要一个中间数组来维护	
					var middle_pare = null;
					var _price = 0; //金额卡
					var _discountRate = 0; //折扣卡
					var calepri = 0; //结算总金额
					if ((0, _jquery2.default)(".card-mor dl").length > 0) {
						// yjk_todo 需要判断抵扣类型,allprice为当前卡未抵扣前的总金额
						console.log("card_type", (0, _jquery2.default)(this).attr("c_type"));
						(0, _jquery2.default)(".card-mor dl").each(function () {
							// 首先判断卡的类型
							if ((0, _jquery2.default)(this).attr("via") == '1' && (0, _jquery2.default)(this).attr("c_type") == '1') {
								// cardPersonPrior为1时优先抵扣成人	
								// 需要一个中间数组来维护，当ctype=1计算完时更新该数组
								middle_pare = JSON.parse((0, _stringify2.default)(session_Pare));
								if ((0, _jquery2.default)(this).attr("Prior") == "1") {
									// 该卡中抵扣的成人数量（_cardPerson.adult）与票中的成人数量比较（pare.adult.length）
									_cardPerson.adult = parseInt((0, _jquery2.default)(this).attr("num"));
									for (var _i2 = 0; _i2 < session_Pare.adult.length; _i2++) {
										if (_i2 < _cardPerson.adult) {
											minus += session_Pare.adult[_i2];
											middle_pare.adult.shift();
										}
									}
									if (session_Pare.adult.length < _cardPerson.adult) {
										for (var _i3 = 0; _i3 < session_Pare.child.length; _i3++) {
											if (_i3 < _cardPerson.adult - session_Pare.adult.length) {
												minus += session_Pare.child[_i3];
												middle_pare.child.shift();
											}
										}
									}
								} else {
									// 卡中抵扣的儿童数量与票中的儿童数量比较
									_cardPerson.child = parseInt((0, _jquery2.default)(this).attr("num"));
									for (var _i4 = 0; _i4 < session_Pare.child.length; _i4++) {
										if (_i4 < _cardPerson.child) {
											minus += session_Pare.child[_i4];
											middle_pare.child.shift();
										}
									}
									if (session_Pare.child.length < _cardPerson.child) {
										for (var _i5 = 0; _i5 < session_Pare.adult.length; _i5++) {
											if (_i5 < _cardPerson.child - session_Pare.child.length) {
												minus += session_Pare.adult[_i5];
												middle_pare.adult.shift();
											}
										}
									}
								}
								session_Pare = JSON.parse((0, _stringify2.default)(middle_pare));
							} else if ((0, _jquery2.default)(this).attr("via") == '1' && (0, _jquery2.default)(this).attr("c_type") == '2') {
								_price += parseFloat((0, _jquery2.default)(this).attr("num"));
								// console.log("_price",_price)
							} else if ((0, _jquery2.default)(this).attr("via") == '1' && (0, _jquery2.default)(this).attr("c_type") == '3') {
								_discountRate = parseFloat((0, _jquery2.default)(this).attr("num"));
								var discountLimit = Number(AllPrice) * Number(_discountRate);
								discountLimit = discountLimit.toFixed(2);
								var _cardMax = parseFloat((0, _jquery2.default)(this).attr("cardMax"));
								// calepri=AllPrice-((AllPrice-discountLimit>_cardMax)?_cardMax:discountLimit)
								// console.log("AllPrice",AllPrice)
								// console.log("discountLimit",discountLimit,typeof discountLimit)
								// console.log("_cardMax",_cardMax)
								if (AllPrice - discountLimit > _cardMax) {
									calepri = AllPrice - _cardMax;
								} else {
									calepri = discountLimit;
								}
								// console.log("calepri",calepri)
							}
						});
						// console.log("_cardPerson",_cardPerson);
						if ((0, _jquery2.default)(".card-mor dl").eq(0).attr("c_type") == '1') {
							calepri = AllPrice - minus;
						} else if ((0, _jquery2.default)(".card-mor dl").eq(0).attr("c_type") == '2') {
							calepri = AllPrice - _price;
							// console.log("金额卡合计",calepri)
						} else if ((0, _jquery2.default)(".card-mor dl").eq(0).attr("c_type") == null) {
							calepri = AllPrice;
						}
						if (calepri < 0) {
							calepri = 0.00;
						}
						(0, _jquery2.default)('.submit .total .price span').text(Number(calepri).toFixed(2));
						var htmlss = '<li class="clearfix"><div class="item"><div class="key" style="font-size: 14px; color: #333;">';
						htmlss += '卡券支付：￥' + minus + '</div><div class="price">实付金额：￥' + Number(calepri).toFixed(2) + '</div></div></li>';
						(0, _jquery2.default)(".pos-con .pos-s1 ul").append(htmlss);
					}
				}
			}
			//yjk_todo  数据结构为 
			// {
			// 	adult:[票价从大到小排序的数组],
			// 	child:[票价从小到大排序的数组]
			// }

		}, {
			key: 'Cardpri',
			value: function Cardpri() {
				var _this = this;
				var priceObj = {
					"adult": [],
					"child": []
				};
				var ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
				// console.log("ticket_list",ticket_list)
				for (var i = 0; i < ticket_list.length; i++) {
					for (var j in _this.DATA.ticket) {
						if (ticket_list[i].tid == j) {
							// 判断是否为成人票
							if (_this.DATA.ticket[j].t_preset_type == "成人票") {
								for (var s = 0; s < ticket_list[i].num; s++) {
									priceObj.adult.push(_this.DATA.ticket[j].t_price);
								}
								break;
							} else {
								for (var _s = 0; _s < ticket_list[i].num; _s++) {
									priceObj.child.push(_this.DATA.ticket[j].t_price);
								}
								break;
							}
						}
					}
				}
				priceObj.child.sort(function (a, b) {
					return a < b;
				});
				priceObj.adult.sort(function (a, b) {
					return a < b;
				});
				// console.log("新的排序结构",priceObj)	
				return priceObj;
			}
		}, {
			key: 'Submit',
			value: function Submit(blyes) {
				var _this = this;
				var bl_yes = blyes;
				(0, _jquery2.default)('.submit .btn').off().on('click', function () {
					var active_num = 0;
					var ticket_ok_num = 0;
					var err_msg = '';
					var bookType = '';
					var oType = 1;
					if ((0, _jquery2.default)('.pay-first span').hasClass('active')) {
						bookType = 1;
					} else {
						bookType = 0;
					}
					if ((0, _jquery2.default)('.pay-single span').hasClass('active')) {
						oType = 1;
					} else {
						oType = 2;
					}
					(0, _jquery2.default)('.tourist-list li').each(function () {
						// 其本信息
						var tdata = (0, _jquery2.default)(this).data('data');
						var i_n = '',
						    i_m = '',
						    i_c = '',
						    card_typeval = '身份证';
						if (tdata) {
							i_n = tdata.name;
							i_m = tdata.tel;
							i_c = tdata.card_no;
							card_typeval = tdata.card_type;
							active_num++;
						}

						// 限制信息
						var type = (0, _jquery2.default)(this).attr('type');
						var tid = (0, _jquery2.default)(this).attr('tid');
						var is_rep = (0, _jquery2.default)(this).attr('is_rep');

						if (type == 'normal') {
							var limit_typeval = _this.DATA.ticket[tid].t_limit_type;
							var limit_conditionval = _this.DATA.ticket[tid].t_limit_condition;
						}
						if (type == 'group') {
							tid = (0, _jquery2.default)(this).attr('pid');
							var ttid = (0, _jquery2.default)(this).attr('tid');
							var limit_typeval = _this.DATA.ticket[tid].list[ttid].t_limit_type;
							var limit_conditionval = _this.DATA.ticket[tid].list[ttid].t_limit_condition;
						}

						// 验证电话号码
						if (i_m) {
							var mobile_reg = /(^0?[1][34857][0-9]{9}$)/;
							if (!mobile_reg.test(i_m)) {
								err_msg = '请填写正确的手机号码';
								return false;
							}
						}

						if (limit_typeval != '无限制' && card_typeval == "身份证") {
							if (i_c == '') {
								err_msg = '请填写身份证号';
								return false;
							}
							var opt = {
								card_type: card_typeval,
								limit_type: limit_typeval,
								limit_condition: limit_conditionval
							};
							var rst = chechIdcard(i_c, opt);
							//验证失败
							if (rst.start == 0) {
								err_msg = rst.info;
								return false;
							}
							//验证成功
							if (rst.start == 1) {
								ticket_ok_num++;
							}
						} else {
							ticket_ok_num++;
						}
					});

					if (!(0, _jquery2.default)('.tourist-list li').eq(0).hasClass('writed')) {
						_global2.default.Popup.Tip('请将游客代表人信息填写完整');
						return false;
					}

					if (!active_num) {
						// _.Popup.Tip('请添加至少一组游客信息');
						_global2.default.Popup.Tip('请将游客信息填写完整');
						return false;
					}

					if (err_msg) {
						_global2.default.Popup.Tip(err_msg);
						return false;
					}

					//验证买票数据是否完整
					if (ticket_ok_num < (0, _jquery2.default)('.tourist-list li').length) {
						_global2.default.Popup.Tip('请填写正确的游客信息');
						return false;
					}

					//验证是否填写接送信息
					var godata = (0, _jquery2.default)('.site .site-go').data('data'),
					    backdata = (0, _jquery2.default)('.site .site-back').data('data');
					if (!godata || !backdata) {
						_global2.default.Popup.Tip('请填写接送信息');
						return false;
					}

					//按后端数据格式生成所有票数据
					var data = _this.DATA.ticket_show;
					var start_date = _this.DATA.bl_start_date.replace(/\-/gi, ''),
					    end_date = _this.DATA.bl_end_date.replace(/\-/gi, '');
					var tickdata = [];

					var _loop = function _loop(i) {
						var type = data[i].t_preset_type;
						tickdata.push({
							id: data[i].t_id,
							num: data[i].people_num,
							room_num: data[i].bed_num,
							list: {},
							seat: []
						});
						var len = tickdata.length;
						if (type != '套票') {
							(0, _jquery2.default)('.tourist-list li[type=normal][tid=' + i + ']').each(function () {
								var lidata = (0, _jquery2.default)(this).data('data');
								if (!lidata) {
									lidata = {
										card_no: '',
										card_type: '身份证',
										name: '',
										tel: ''
									};
								}

								tickdata[len - 1].seat.push({
									"is_rep": lidata.is_rep,
									"start_site_type": godata.types,
									"end_site_type": backdata.types,
									"vip_name": lidata.name, //游客姓名
									"vip_mob": lidata.tel, //游客手机号
									"vip_card_type": lidata.card_type, //游客证件类型
									"vip_card": lidata.card_no, //游客证件号
									"start_site": godata.name, //去程站点名称
									"start_sid": godata.id, //去程站点ID
									"start_date": start_date, //出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
									"end_site": backdata.name, //返程站点名称
									"end_sid": backdata.id, //返程站点ID
									"end_date": end_date, //返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
									"start_bus_id": godata.bus_id,
									"end_bus_id": backdata.bus_id
								});
							});
						} else {
							var _loop2 = function _loop2(j) {
								tickdata[len - 1].list[j] = {
									id: data[i].list[j].t_id,
									num: data[i].list[j].people_num,
									room_num: data[i].list[j].bed_num,
									seat: []
								};
								(0, _jquery2.default)('.tourist-list li[type=group][pid=' + i + '][tid=' + j + ']').each(function () {
									var lidata = (0, _jquery2.default)(this).data('data');
									if (!lidata) {
										lidata = {
											card_no: '',
											card_type: '身份证',
											name: '',
											tel: ''
										};
									}
									tickdata[len - 1].list[j].seat.push({
										"is_rep": lidata.is_rep,
										"start_site_type": godata.types,
										"end_site_type": backdata.types,
										"vip_name": lidata.name, //游客姓名
										"vip_mob": lidata.tel, //游客手机号
										"vip_card_type": lidata.card_type, //游客证件类型
										"vip_card": lidata.card_no, //游客证件号
										"start_site": godata.name, //去程站点名称
										"start_sid": godata.id, //去程站点ID
										"start_date": start_date, //出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
										"end_site": backdata.name, //返程站点名称
										"end_sid": backdata.id, //返程站点ID
										"end_date": end_date, //返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
										"start_bus_id": godata.bus_id,
										"end_bus_id": backdata.bus_id
									});
								});
							};

							for (var j in data[i].list) {
								_loop2(j);
							}
						}
					};

					for (var i in data) {
						_loop(i);
					}
					var buy_uid = '';
					if (share_user) {
						buy_uid = share_user.u_id;
					}
					var city_code = '';
					city_code = _global2.default.GetUrlPara('city_code');
					var oContractAgreement = (0, _jquery2.default)(".prime-text").html();
					var cardflag = 0;
					if (window.__wxjs_environment === "miniprogram" || _this.ustype == '3') {
						var cararr = [];
						if ((0, _jquery2.default)(".card-mor dl").length < 1) {
							_global2.default.Popup.Tip('请使用卡券支付');
							return false;
						} else {
							(0, _jquery2.default)(".card-mor dl").each(function () {
								if ((0, _jquery2.default)(this).attr("via") != '1') {
									cardflag = 1;
								} else {
									var numm = (0, _jquery2.default)(this).find(".card-num").val();
									var passe = (0, _jquery2.default)(this).find(".pass").val();
									passe = hex_md5(passe);
									var car = {
										cardNo: numm,
										pass: passe
									};
									cararr.push(car);
								}
							});
						}
					}
					if (cardflag == 1) {
						_global2.default.Popup.Tip('你有未验证通过的卡片');
						return false;
					}
					var appletId = window.sessionStorage.getItem('appletId');
					if (!appletId) {
						appletId = '';
					}
					_global2.default.Ajax({
						url: '/b2b/shop/place',
						type: 'post',
						data: {
							appletId: appletId,
							cardDOS: cararr,
							oContractAgreement: oContractAgreement, //合同签约定
							bl_yes: bl_yes,
							bl_id: _this.DATA.bl_id,
							buy_uid: buy_uid,
							city_code: city_code,
							o_remark: _jquery2.default.trim((0, _jquery2.default)('.remark-text textarea').val()),
							url_bool: 'yes',
							ticket: tickdata,
							pp_id: (0, _jquery2.default)('.promotion-list li.active').attr('lid'),
							bookType: bookType, //0-full  1-first
							oType: oType
						},
						success: function success(res) {
							if (res.code == 200) {
								debugger;
								if (res.data && res.data.status && res.data.status == "待确认") {
									window.location.href = 'pay_success.html?n=' + res.data.number;
								} else if (res.data && res.data.status && res.data.status == "已预约") {
									window.location.href = 'pay.html?n=' + res.data.number + '#wechat_redirect';
								}
							} else if (res.code == 682) {
								//不接待游客 不能下单
								var mess = _jquery2.default.parseJSON(res.message);
								var lis = '';
								for (var j = 0; j < mess.length; j++) {
									lis += '<li>' + mess[j].vip_name + "(" + mess[j].b_name + ')' + mess[j].b_mobile + '&nbsp; ' + mess[j].b_card + '<p>理由：' + mess[j].b_sorg_reason + '</p></li>';
								}
								var html = '<div class="order_sta">';
								html += '<h4><span class="no"></span>线路供应商无法接待此订单游客!</h4>';
								html += '<ul class="popu_ul">' + lis + '</ul>';
								html += '<div class="buts clearfix"><a class="sures" href="javascript:;">确定</a></div></div>';
								_global2.default.Popup.Info(html);
								(0, _jquery2.default)(".buts .sures").off().on("click", function () {
									_global2.default.Popup.PopupRemove();
								});
							} else if (res.code == 683) {
								//确认游客 继续下单
								var mess = _jquery2.default.parseJSON(res.message);

								var lis = '';
								for (var j = 0; j < mess.length; j++) {
									lis += '<li>' + mess[j].vip_name + "(" + mess[j].b_name + ')' + mess[j].b_mobile + '&nbsp; ' + mess[j].b_card + '<p>理由：' + mess[j].b_sorg_reason + '</p></li>';
								}
								var html = '<div class="order_sta">';
								html += '<h4><span class="yes"></span>线路供应商需审核此订单游客!</h4>';
								html += '<ul class="popu_ul">' + lis + '</ul>';
								html += '<div class="buts clearfix"><a class="cle" href="javascript:;">取消</a><a class="sure" href="javascript:;">确定</a></div></div>';
								_global2.default.Popup.Info(html);
								(0, _jquery2.default)(".buts .cle").off().on("click", function () {
									_global2.default.Popup.PopupRemove();
								});

								(0, _jquery2.default)(".buts .sure").off().on("click", function () {
									_this.Submit(1);
									(0, _jquery2.default)('.submit .btn').click();
									_global2.default.Popup.PopupRemove();
								});
							}
						}
					});
				});
			}
		}]);
		return Index;
	}();

	_userinfo2.default.Ready(function () {
		new Index();
	});

/***/ }),

/***/ 119:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

});