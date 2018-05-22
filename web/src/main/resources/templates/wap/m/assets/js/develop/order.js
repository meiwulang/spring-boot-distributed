import '../../less/order.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

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
    if (!code)
        return {
            status: false,
            msg: '身份证号码不能为空'
        };
    if (typeof code != 'string')
        code = code.toString();
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
                sum += (ai * wi);
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
    var Errors = new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","验证失败，请注意数字或字母大小写的准确性，填写正确的验证信息!","身份证地区非法!");
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
    }
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    var Area = area[parseInt(idcard.substr(0, 2))];
    if (Area == null)
        return {
            start: 0,
            info: Errors[4]
        };
    //身份号码位数及格式检验
    var Birthday = ''
      , sexCode = '';
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
    if (opt.card_type != '身份证' || val == '' || val == null)
        return true;
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
            var condition = opt.limit_condition
              , where = "";
            var Age = getAge(val);
            if (condition.indexOf("-") >= 0) {
                var bt = condition.split("-");
                where = Age > bt[0] && Age < bt[1];
            } else if (condition.indexOf("<") >= 0) {
                var gt = condition.split("<");
                where = (Age < gt[1]);
            } else if (condition.indexOf(">") >= 0) {
                var gt = condition.split(">");
                where = (Age > gt[1]);
            } else {
                where = (Age == condition);
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


class Index{
	constructor(){
		let _this = this;
		this.DATA = {};
		this.ustype = '';
		this.type_3Flag=true;
		this.main_cardType=null;
		if(!(_uinfo && _uinfo.u_id)){
			window.location.href = 'login.html?ty=detail';
		}else{
			_.GetCityCode(function(citycode){
				_this.citycode = citycode;
				_this.Render();
			})
		}
	}

	Render(){
		let _this = this;
		let ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
		let ticketId_list=[];
		ticket_list.forEach(data=>{
			ticketId_list.push(data.tid)
		});
		_.Ajax({
			// url : '/b2b/shop/info',
			url : '/front/order/m/queryOrderInfo',
			type : 'post',
			data : {
				p_id : _.GetUrlPara('p_id'),
				bl_id : _.GetUrlPara('bl_id'),
				city_code : _this.citycode,
				tickets:ticketId_list
			},
			success : function(res){
				if( res.code == 200 ){
					_this.DATA = res.data;
					res.data['ticket_show'] = _this.TicketData();
					// _this.ustype = res.ustype;
					if(res.data && res.data != null && res.data.uStype && res.data.uStype == '3'){
						_this.ustype = '3'
					}
					
					_this.DATA = res.data;
					let html = template('tpl-order',res.data);
					$('.main').html(html);
					$('.t-bar a.back').on('click',function(){
						window.history.back();
					})
					// $('.tourist-list li:gt(1)').hide();
					_this.Event();
					// if(_this.ustype == '3'){
					// 	$(".payment").show();
					// 	$(".add-card").trigger("click");
					// }
					if(window.__wxjs_environment==="miniprogram" || _this.ustype == '3'){
						$(".payment").show();
						$(".add-card").trigger("click");	
						$(".companyorsingleWrap").hide();						
					}
					if(window.__wxjs_environment!=="miniprogram"){
						$(".companyorsingleWrap").show();						
					}						
					_this.Settlement();
				}
			}
		})
	}

	TicketData(){
		let _this = this;
		let ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
		let ticket_show = {};
		for(let i = 0; i < ticket_list.length; i++){
			for(let j in _this.DATA.ticket ){
				if( ticket_list[i].tid == j ){
					ticket_show[j] = _this.DATA.ticket[j];
					ticket_show[j]['base_num'] = ticket_list[i].num;
					ticket_show[j]['t_name'] = ticket_list[i].t_name;
					ticket_show[j]['people_num'] = ticket_list[i].num * _this.DATA.ticket[j].num;
					ticket_show[j]['bed_num'] = ticket_list[i].num * _this.DATA.ticket[j].room_num;
					ticket_show[j]['bed_price'] = 0;
					ticket_show[j]['bed_dec'] = 0;
					ticket_show[j]['people_num_round'] = [];
					for(var x = 0; x < ticket_show[j]['people_num']; x++){
						ticket_show[j]['people_num_round'].push(x);
					}
					if( _this.DATA.ticket[j].t_preset_type == '套票' ){
						for(let k in _this.DATA.ticket[j].list ){
							ticket_show[j].list[k]['people_num'] = ticket_list[i].num * _this.DATA.ticket[j].list[k].num;
							ticket_show[j].list[k]['bed_num'] = ticket_list[i].num * _this.DATA.ticket[j].list[k].room_num;
							ticket_show[j].list[k]['bed_price'] = 0;
							ticket_show[j].list[k]['bed_dec'] = 0;
							ticket_show[j].list[k]['people_num_round'] = [];
							for(let x = 0; x < ticket_show[j].list[k]['people_num']; x++){
								ticket_show[j].list[k]['people_num_round'].push(x);
							}
						}
					}
					break;
				}
			}
		}
		return ticket_show;
		console.log(ticket_show,'ticket_show')
	}

	Event(){
		var _this = this;
		$('.ticket-info .list .toggle').on('click',function(){
			$(this).parent().toggleClass('open');
		});

		$('.remark h4 span').on('click',function(){
			$('.remark').toggleClass('open');
		});

		$('.see-detail').on('click',function(){
			$('.pos').addClass('in');
		});
		$('.prime').on('click',function(){
			$('.primes').addClass('in');
		});
		$('.pri_a').on('click',function(){
			$('.primes').removeClass('in');
		});
		//合同补充约定 提交
		$(".pri_btn").on("click",function(){
			var html = $(".text_area").val();
			$(".prime-text").html(html);
			$('.primes').removeClass('in');
		});
		$('.pos a.back').on('click',function(){
			$('.pos').removeClass('in');
			$('.pos-s1').show();
			$('.pos-s2').hide();
		})
		
		//卡券支付
		$(".add-card").on("click",function(){
			var html = '<dl><dd><span>卡号：</span><span><input class="card-num" type="text" value="" placeholder="请输入卡号"><span class="clet">&times;</span>';
				html += '</span></dd><dd class="items clearfix"><span><span>密码：</span><span><input class="pass" type="password" value="" placeholder="请输入卡密码"><span class="pwd-check">验证</span>';
				html += '</span></dd></dl>';
			$(".card-mor").append(html);				
			_this.Vall();
		});

		//首付款
		$('.fullOrFirst li').on('click',function(){

			$('.fullOrFirst li').find('span').removeClass('active');
			$(this).find('span').addClass('active');

			let $full = $('.pay-full span');
			let $first = $('.pay-first span');
			let amount = '';

			// if ($first.hasClass('active')) {
			// 	console.log('first')
			// 	amount = _this.DATA.pay_amount;
			// }
			_this.Settlement();
		})
		$('.fullOrTwo li').on('click',function(){

			$('.fullOrTwo li').find('span').removeClass('active');
			$(this).find('span').addClass('active');

			let $company = $('.pay-company span');
			let $single = $('.pay-single span');
		})
		this.BedEvent();
		this.TouristEvent();
		this.SiteEvent();
		this.PromotionEvent();
		this.Submit();
	}
	Vall(){
		var _this = this;
		//验证
		$('.pwd-check').off().on("click",function(){
			var cardNo = [];
			var _index = $(this).parents("dl").index();
			var num = $(this).parents("dl").find(".card-num").val();
			var passe = $(this).parents("dl").find(".pass").val();
			if(!$.trim(num)){
				_.Popup.Tip('请输入卡号');
				return false;
			}
			if(!$.trim(passe)){
				_.Popup.Tip('请输入密码');
				return false;
			}
			// 如果type=3则不能通过下一次验证
			if(!_this.type_3Flag){
				_.Popup.Tip('折扣卡仅限单张使用！');
				return false;
			}
			// 判断是否有相同卡号
			let cardNumList=[];
			$(".card-num").each(function(){
				cardNumList.push($(this).val())
			})
			if(unique(cardNumList).length!=cardNumList.length){
				_.Popup.Tip('有重复卡号！');
				return false;				
			}			
			passe = hex_md5(passe);
			var cararr = {
				cardNo : num,
				pass : passe
			}
			cardNo.push(cararr);
			var pid = _.GetUrlPara('p_id');
			var appletId = window.sessionStorage.getItem('appletId');
		    if(!appletId){
		        appletId = '';
			}

			_.Ajax({
				url : '/Order/validateCard',
				type : 'post',
				data : {
					appletId : appletId,
					cardList : cardNo,
					pid : pid
				},
				success : function(res){
					if(res.code == 0){
						var data = res.body;
						if(data && data.length){
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
							if(_this.main_cardType==null){
								_this.main_cardType=data[0].cardType;
							}else{
								if(_this.main_cardType!=data[0].cardType){
									_.Popup.Tip('请使用同一种类型的卡！');
									_this.Settlement();
									return false;
								}
							}
							// 判断卡类型
							$('.payment li dl').eq(_index).attr("via",'1');
							if(data[0].cardType==1){
								$('.payment li dl').eq(_index).attr("num",data[0].cardPerson);
								$('.payment li dl').eq(_index).attr("Prior",data[0].cardPersonPrior);
								$('.payment li dl').eq(_index).attr("c_type","1");
							}else if(data[0].cardType==2){
								$('.payment li dl').eq(_index).attr("num",data[0].cardPrice);
								$('.payment li dl').eq(_index).attr("c_type","2");
							}else{
								_this.type_3Flag=false;
								$('.payment li dl').eq(_index).attr("num",data[0].cardDiscountRate);
								$('.payment li dl').eq(_index).attr("cardMax",data[0].cardDiscountMax);
								$('.payment li dl').eq(_index).attr("c_type","3");
							}
							$('.payment li dl').eq(_index).find(".pwd-check").html("通过").addClass("active");
							_this.Settlement();
						}
						
					}
				}
			})

		})
		$(".card-mor .clet").off().on("click",function(){
			// type_3Flag 为false不能新增，并置true
			console.log("c_type",$(this).attr("c_type"))
			if($(this).parents("dl").attr("c_type")==3){
				_this.type_3Flag==false && (_this.type_3Flag=true);
			}
			$(this).parents("dl").remove();
			_this.Settlement();
		})
		//当卡号 密码发生变化之后状态改变
		// $(".card-mor dl").each(function(){

		// })
		// 卡号去重方法
		function unique(list){
			var res = [];
			var json = {};
			for(var i = 0; i < list.length; i++){
			 if(!json[list[i]]){
			  res.push(list[i]);
			  json[list[i]] = 1;
			 }
			}
			return res;			
		}
	}
	BedEvent(){
		let _this = this;
		let data = this.DATA.ticket_show;
		$('.bed li .num-check span').on('click',function(){
			let $li = $(this).parents('li'),
				$input = $li.find('.num-check input'),
				tid = $li.attr('tid'),
				type = $li.attr('type'),
				active = $(this).attr('class');
			let people_num = parseInt($li.attr('people_num'));
			let num = parseInt($input.val());
			switch(active){
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
			if( people_num * 2 < num || num < 0 ){
				return false;
			}
			$input.val(num);

			let bedprice = 0;
			switch(type){
				case 'group':
					var ttid = $li.attr('tid');
					tid = $li.attr('pid');
					
					var dec = num - (data[tid].base_num * data[tid].list[ttid].room_num);	// 房差数
					var addprice = data[tid].list[ttid].t_spread_price,	// 退房价
						reduceprice = data[tid].list[ttid].t_out_room_price;	// 加房价
					if( dec > 0 ){
						bedprice = dec * addprice;
					}else{
						bedprice = dec * reduceprice;
					}
					data[tid].list[ttid].bed_num = num;
					data[tid].list[ttid].bed_price = bedprice;
					data[tid].list[ttid].bed_dec = dec;
					break;
				case 'normal':
					var dec = num - (data[tid].base_num * data[tid].room_num);	// 房差数
					var addprice = data[tid].t_spread_price,	// 退房价
						reduceprice = data[tid].t_out_room_price;	// 加房价
					if( dec > 0 ){
						bedprice = dec * addprice;
					}else{
						bedprice = dec * reduceprice;
					}
					data[tid].bed_num = num;
					data[tid].bed_price = bedprice;
					data[tid].bed_dec = dec;
					break;
			}
			$li.find('.price span').text(bedprice.toFixed(2));
			_this.Settlement();
		})
	}

	TouristEvent(){
		$('.tourist-list li').each(function(index){
			$(this).find('.number').text(index+1);
		})
		//第一个游客为游客代表人
		$(".tourist-list ul li:first").find(".name u").html("填写游客代表人信息");
		$(".tourist-list ul li:first").attr("is_rep","1");
		if( !$('.tourist-list li.limit').size() ){
			$('.tourist-list li').eq(0).show();
		}
		$('.bed-list li').hide();
		$('.bed-list li').eq(0).show();
		
		if( !$('.tourist-list li.nolimit').size() || $('.tourist-list li').length == 1 ){
			$('.tourist-more').hide();
		}
		$('.tourist-more').on('click',function(e){
			e.stopPropagation();
			$(this).toggleClass('open');
			if( $(this).hasClass('open') ){
				$(this).parents(".show_hide").find("li.nolimit").show();
				$(this).find('span').text('收起');
			}else{
				$(this).find('span').text('展开所有');
				$(this).parents(".show_hide").find("li.nolimit").hide();
				$('.bed-list li').eq(0).show();
				if( !$('.tourist-list li.limit').size() ){
					$('.tourist-list li').eq(0).show();
				}
			}
		})

		$('.tourist-list li').on('click',function(){
			let ind = $(this).index();
			let data = $(this).data('data');
			if(ind == '0'){
				$(".tourist-info-con .card_type").html('<option>身份证</option><option>护照</option>');
			}else{
				var html = '<option>身份证</option><option>护照</option>';
				html += '<option>军官证</option><option>回乡证</option>';
				html += '<option>台胞证</option><option>国际海员证</option>';
				html += '<option>港澳通行证</option><option>赴台证</option>';
				$(".tourist-info-con .card_type").html(html);
			};
			if( data ){
				$('.tourist-info input.name').val(data.name);
				$('.tourist-info input.tel').val(data.tel);
				$('.tourist-info select.card_type').val(data.card_type);
				$('.tourist-info input.card_no').val(data.card_no);
			}else{
				$('.tourist-info input.name').val('');
				$('.tourist-info input.tel').val('');
				$('.tourist-info select.card_type').val('身份证');
				$('.tourist-info input.card_no').val('');
			}
			if( $(this).hasClass('limit') ){
				let name = $(this).attr('name'),
					limit_type = $(this).attr('limit_type'),
					limit_condition = $(this).attr('limit_condition');
				$('.tourist-info .tips span').text(name+'：');
				$('.tourist-info .tips u').text('（限制：' + limit_type + ' ' + limit_condition + '）');
				$('.tourist-info .tips').show().attr({
					'limit_type' : limit_type,
					'limit_condition' : limit_condition
				})
			}else{
				$('.tourist-info .tips').hide().attr({
					'limit_type' : '无限制',
					'limit_condition' : ''
				});
			}
			$('.tourist-info').addClass('in').attr('ind',ind);
		})

		$('.tourist-info a.back').on('click',function(){
			$('.tourist-info').removeClass('in');
			$('.tourist-info-con i.icon-error').hide();
		})

		$('.tourist-info .save').on('click',function(){
			let ind = $('.tourist-info').attr('ind');
			let name = $.trim($('input.name').val()),
				tel = $.trim($('input.tel').val()),
				card_type = $.trim($('select.card_type').val()),
				card_no = $.trim($('input.card_no').val());
			let limit_type = $('.tourist-info .tips').attr('limit_type'),
				limit_condition = $('.tourist-info .tips').attr('limit_condition');

			$('.tourist-info-con i.icon-error').hide();

			if( !$('.tourist-list').hasClass('have-one') ){
				if( !name ){
					_.Popup.Tip('请填写姓名');
					$('.tourist-info-con input.name').next().show();
					return false;
				}
				
				if( !_.RegEx.Tel(tel) ){
					_.Popup.Tip('请填写正确的手机号码');
					$('.tourist-info-con input.tel').next().show();
					return false;
				}
			}

			if( card_type == '身份证' && card_no ){
	            var rst = CardChk(card_no);
	            //验证失败
	            if (rst.start == 0) {
	            	_.Popup.Tip(rst.info);
	                return false;
	            }
	        }
	        if( card_type == '护照' && card_no ){
	        	if(!_.RegEx.Passport(card_no)){
	        		_.Popup.Tip("请填写正确护照信息！");
	        		return false;
	        	}				
	        }
			if( limit_type != '无限制' && card_type == '身份证' ){
				if( !card_no ){
					_.Popup.Tip('请填写身份证号码');
					$('.tourist-info-con input.card_no').next().show();
					return false;
				}

				// 验证数据
				let opt = {
	                card_type: card_type,
	                limit_type: limit_type,
	                limit_condition: limit_condition
	            }
	            let rst = chechIdcard(card_no, opt);
	            //验证失败
	            if( rst.start == 0 ){
	            	_.Popup.Tip(rst.info);
	            	$('.tourist-info-con input.card_no').next().show();
	                return false;
	            }
			}

			if( ind == 0 ){
				if( !card_no ){
					_.Popup.Tip('请填写证件号');
					$('.tourist-info-con input.card_no').next().show();
					return false;
				}
			}

			var is_rep = '';
			if(ind == '0'){
				is_rep = '1';
			};
            let data = {
            	is_rep : is_rep,
				name : name,
				tel : tel,
				card_type : card_type,
				card_no : card_no
			}
			if( data.name || data.tel || data.card_no ){
				let $li = $('.tourist-list li').eq(ind);
				$li.data('data',data);
				$li.find('.name u').text(data.name);
				$li.find('.tel').show().text(data.tel);
				// if(data.card_no){
					$li.find('.card').show().find('.card-type').text(data.card_type);
					$li.find('.card .card-no').text(data.card_no);
				// }
				$('.tourist-list').addClass('have-one');
				$('.tourist-list').find('li').eq(ind).addClass('writed');
			}
			$('.tourist-info').removeClass('in');
		})
	}

	SiteEvent(){
		let _this = this;

		let t_id = [];
		let tlist = this.DATA.ticket_show;
		for(let i in tlist ){
			let t = tlist[i].t_preset_type;
			if( t == '套票' ){
				for( let j in tlist[i].list ){
					t_id.push(tlist[i].list[j].t_id);
				}
			}else{
				t_id.push(tlist[i].t_id);
			}
		}
		t_id = t_id.join(',');

		$('.site .item').on('click',function(){
			let type = 'go';
			if( $(this).hasClass('site-back') ){
				type = 'back';
			}
			$('.site-input input').val('');
			$('.site-select').attr('type',type);
			let start_date = _this.DATA.bl_start_date.replace(/\-/gi,'');
			let p_id = _.GetUrlPara('p_id');
			_.Ajax({
				url : '/front/b2b/shop/station',
				type : 'post',
				data : {
					limit : "999",
					start : 1,
					start_date : start_date,
					start_time : "",
					t_id : t_id,
					p_id : p_id,
					bl_id : _.GetUrlPara('bl_id')
				},
				success : function(res){
					if( res.code == 200 ){
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
						let html = template('tpl-site-select-list',res.data);
						$('.site-select-list').html(html);
						$('.site-select').addClass('in');
						$('.site-select-list .on_btn').on('click',function(){
							let name = $(this).attr('name');
							let time = $(this).attr('time');
							$('.site-input input').val(time + " " + name);
							$(this).parents(".site-select-list").find("li").removeClass("check");
							$(this).addClass('check');
							$('.site-select .save').click();
						})
						$(".site-select-list .on_btn_no").on("click",function(){
							_.Popup.Tip('班车已停售，如需乘坐请联系商家！');
						})
						$('.site-input input').on('keyup',function(){
							let v = $.trim($(this).val());
							if( v ){
								$('.site-select-list li').removeClass('check');
							}
						})
					}
				}
			})
		})

		$('.site-select a.back').on('click',function(){
			$('.site-select').removeClass('in');
		})

		$('.site-select .save').on('click',function(){
			let type = $('.site-select').attr('type');
			let v = $.trim($('.site-input input').val()),
				time = '',
				id = '',
				name = '',
				types = '',
				price = '',
				bus_id;

			if($('.site-select-list li').hasClass("check")){
				types = $('.site-select-list li.check').attr('types');
				time = $('.site-select-list li.check').attr('time');
				id = $('.site-select-list li.check').attr('lid');
				name = $('.site-select-list li.check').attr('name');
				price = $('.site-select-list li.check').attr('price');
				bus_id = $('.site-select-list li.check').attr('bus_id');
			}else{
				name = v;
				price = '0.00';
			}
			let data = {
				types : types,
				time : time,
				id : id,
				name : name,
				price : price,
				bus_id : bus_id
			}
			let $item = $('.site .site-'+type);
			$item.data('data',data);
			$item.find('.no-check').hide();
			$item.find('.checked').show();
			$item.find('.checked p').text(data.time + " " + data.name);
			$item.find('.checked i').text('￥'+data.price+'/人');
			$('.site-select').removeClass('in');

			_this.Settlement();

		})
	}

	PromotionEvent(){
		let _this = this;

		if( $('.promotion-list li').length > 1 ){
			$('.promotion-list li:gt(0)').hide();
		}else{
			$('.promotion-more').hide();
		}

		$('.promotion-list li').on('click',function(){
			if( $(this).hasClass('active') ){
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			_this.Settlement();
		})

		$('.promotion-more').on('click',function(){
			$(this).toggleClass('open');
			if( $(this).hasClass('open') ){
				$('.promotion-list li').show();
				$(this).find('span').text('收起');
			}else{
				$('.promotion-list li:gt(0)').hide();
				$(this).find('span').text('展开所有');
			}
		})

		$('.pos .change').on('click',function(){
			$('.pos .pos-s1,.pos .pos-s2').toggle();
			$(this).toggleClass("changes")
		})
	}

	Settlement(){
		var _this = this;
		let data = this.DATA.ticket_show;
		console.log("this.DATA.ticket_show",this.DATA.ticket_show)
		console.log("this.DATA.ticket",this.DATA.ticket)
		console.log("this.DATA.ticketfirstpay_type",this.DATA.firstpay_type)
		let AllPrice = 0;	// 总价
		let TicketPrice = 0;	// 票价总和
		let TicketTradePrice = 0; 	// 同行价总和
		let BedPrice = 0;	// 房差总和
		let Go = {	// 去程
			price : 0,
			name : '',
			num : 0
		};	
		let Back = {	// 返程
			price : 0,
			name : '',
			num : 0
		};
		let SitePrice = 0;	// 去程返程总和
		let godata = $('.site .site-go').data('data'),
			backdata = $('.site .site-back').data('data');
		let goprice = 0,
			backprice = 0;
		if( godata ){
			Go.name = godata.name;
			goprice = godata.price;
		}
		if( backdata ){
			Back.name = backdata.name;
			backprice = backdata.price;
		}

		let AdultTotal = 0,
			AdultNum = 0,
			ChildrenTotal = 0,
			ChildrenNum = 0,
			SetsTotal = 0,
			SetsNum = 0;
		
		for(let i in data){
			let limit_type = data[i].t_preset_type;
			switch(limit_type){
	            case '成人票':
	                AdultTotal += data[i].base_num * data[i].t_trade_price;
	                AdultNum += data[i].base_num;
	                BedPrice += data[i].bed_price;
	                break;
	            case '儿童票':
	                ChildrenTotal += data[i].base_num * data[i].t_trade_price;
	                ChildrenNum += data[i].base_num;
	                BedPrice += data[i].bed_price;
	                break;
	            case '套票':
	                SetsTotal += data[i].base_num * data[i].t_trade_price;
	                SetsNum += data[i].base_num;
	                for(let j in data[i].list){
						BedPrice += data[i].list[j].bed_price;
					}
	                break;
			}
			
			Go.price += goprice * data[i].people_num;
			Go.num += data[i].people_num;
			Back.price += backprice * data[i].people_num;
			Back.num += data[i].people_num;
			SitePrice += goprice * data[i].people_num + backprice * data[i].people_num;
			TicketPrice += data[i].base_num * data[i].t_price;
			TicketTradePrice += data[i].base_num * data[i].t_trade_price;
		}
		this.DATA['Go'] = Go;
		this.DATA['Back'] = Back;
		// 活动优惠金额
	    var p_data = this.DATA.p_promotion;
	    var ActiveTotal = 0, ActiveTitle = '';
	    if( p_data.length > 0 ){
	        var pp_id = $('.promotion-list li.active').attr('lid');
	        for(var z = 0; z < p_data.length; z++){
	            if( p_data[z].pp_id != pp_id ){
	                continue;
	            }
	            var type = p_data[z].pp_type;
	            var pp_num = p_data[z].pp_amount;
	            ActiveTitle = p_data[z].pp_title;
	            // 定额
	            if( type == 'quota' ){
	                var pp_son_type = p_data[z].pp_son_type;
	                // 定额每人
	                if( pp_son_type == 'quotaPerson' ){
	                    var pp_ticket_type = p_data[z].pp_ticket_type;

	                    for(var i = 0; i < pp_ticket_type.length; i++){
	                        var this_type = pp_ticket_type[i];
	                        switch(this_type){
	                            case 'adult':   // 成人
	                                ActiveTotal += AdultNum * pp_num;
	                                break;
	                            case 'children':    //儿童
	                                ActiveTotal += ChildrenNum * pp_num;
	                                break;
	                            case 'sets':     // 套票
	                                ActiveTotal += SetsNum * pp_num;
	                                break;
	                        }
	                    }
	                }
	                // 定额每单
	                if( pp_son_type == 'quotaOrder' ){
	                    ActiveTotal = pp_num;
	                }
	            }
	            // 百分比
	            if( type == 'percent' ){
	                var pp_ticket_type = p_data[z].pp_ticket_type;
	                // 最高优惠价
	                var max_money = p_data[z].pp_max_limit;

	                for(var i = 0; i < pp_ticket_type.length; i++){
	                    var this_type = pp_ticket_type[i];
	                    switch(this_type){
	                        case 'adult':   // 成人
	                            ActiveTotal += (AdultTotal * pp_num)/100;
	                            break;
	                        case 'children':    //儿童
	                            ActiveTotal += (ChildrenTotal * pp_num)/100;
	                            break;
	                        case 'sets':     // 套票
	                            ActiveTotal += (SetsTotal * pp_num)/100;
	                            break;
	                    }
	                }

	                if( max_money && ActiveTotal > max_money  ){
	                    ActiveTotal = max_money;
	                }
	            }
	            // 退出循环
	            break;
	        }
	    }
	    this.DATA['Active'] = {
	    	ActiveTotal : -1 * ActiveTotal,
	    	ActiveTitle : ActiveTitle
	    }

	    let amount = 1;

    	if ($('.pay-first span').hasClass('active')) {
    		amount = this.DATA.pay_amount;
    	} else{
    		amount = 1;
		}
		if(this.DATA.pay_way == 1){
			if(this.DATA.firstpay_type == 1){
				var priceWrap = AdultNum + ChildrenNum;
				AllPrice = priceWrap * amount;
			}else{
				AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
			}
		}else{
			AllPrice = TicketPrice + BedPrice + SitePrice
		}
		console.log(AllPrice,'AllPrice')
		console.log(TicketPrice,'TicketPrice')
		console.log(BedPrice,'BedPrice')
		console.log(SitePrice,'SitePrice')
		// AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
		let FactTotal = TicketTradePrice + BedPrice + SitePrice;	// 实际结算
		let GetTotal = AllPrice - FactTotal;	// 佣金
		this.DATA['TicketTradePrice'] = TicketTradePrice;
		this.DATA['FactTotal'] = FactTotal;
		this.DATA['GetTotal'] = GetTotal;
		this.DATA['AllPrice'] = AllPrice.toFixed(2);
		this.DATA['BedPrice'] = BedPrice;
		this.DATA['SitePrice'] = SitePrice;

		
		if ($('.pay-first span').hasClass('active')) {
			if(this.DATA.firstpay_type == 1){  
				var priceWrap = AdultNum + ChildrenNum;
				AllPrice = priceWrap * amount;
			}else{
				AllPrice = (TicketPrice + BedPrice + SitePrice) * Number(amount);
			}
    		$('.submit .total .price span').text(Math.ceil(AllPrice).toFixed(2));
    	} else{
			AllPrice = TicketPrice + BedPrice + SitePrice;
    		$('.submit .total .price span').text(AllPrice.toFixed(2));
    	}
		let html = template('tpl-pos',this.DATA);
		$('.pos-con').html(html);
		if(window.__wxjs_environment==="miniprogram" || _this.ustype == '3'){
			//判断为卡券支付
			var pare = _this.Cardpri();	// wuli郑,这里处理是亮点,可以给个赞
			var session_Pare=JSON.parse(JSON.stringify(pare))
			// console.log("执行Cardpri()输出pare=>",pare);
			var numm = 0;//抵消卡数
			var minus = 0;//用卡要减去的钱数
			// yjk_todo 为每种卡设置初始变量 
			var _cardPerson={
				"adult":0,
				"child":0
			}; //名额卡
			// 名额卡中票的数组需要一个中间数组来维护	
			var middle_pare=null;
			var _price=0; //金额卡
			var _discountRate=0; //折扣卡
			var calepri=0; //结算总金额
			if($(".card-mor dl").length > 0){
				// yjk_todo 需要判断抵扣类型,allprice为当前卡未抵扣前的总金额
				console.log("card_type",$(this).attr("c_type"))
				$(".card-mor dl").each(function(){
					// 首先判断卡的类型
					if( $(this).attr("via") == '1' && $(this).attr("c_type") == '1' ){
						// cardPersonPrior为1时优先抵扣成人	
						// 需要一个中间数组来维护，当ctype=1计算完时更新该数组
						middle_pare=JSON.parse(JSON.stringify(session_Pare));
						if( $(this).attr("Prior")=="1" ){
							// 该卡中抵扣的成人数量（_cardPerson.adult）与票中的成人数量比较（pare.adult.length）
							_cardPerson.adult=parseInt($(this).attr("num"));
							for( let i = 0; i < session_Pare.adult.length; i++ ){
								if( i < _cardPerson.adult ){
									minus += session_Pare.adult[i];
									middle_pare.adult.shift()
								}
							}							
							if( session_Pare.adult.length<_cardPerson.adult ){
								for( let i = 0; i < session_Pare.child.length; i++ ){
									if( i < _cardPerson.adult- session_Pare.adult.length){
										minus += session_Pare.child[i];
										middle_pare.child.shift()
									}
								}
							}							
						}else{
							// 卡中抵扣的儿童数量与票中的儿童数量比较
							_cardPerson.child=parseInt($(this).attr("num"));
							for( let i = 0; i < session_Pare.child.length; i++ ){
								if( i < _cardPerson.child ){
									minus += session_Pare.child[i];
									middle_pare.child.shift()
								}
							}	
							if( session_Pare.child.length<_cardPerson.child ){
								for( let i = 0; i < session_Pare.adult.length; i++ ){
									if( i < _cardPerson.child- session_Pare.child.length ){
										minus += session_Pare.adult[i];
										middle_pare.adult.shift()
									}
								}	
							}								 
						}
						session_Pare=JSON.parse(JSON.stringify(middle_pare));
					}else if($(this).attr("via") == '1' && $(this).attr("c_type") == '2'){
						_price+=parseFloat($(this).attr("num"));
						// console.log("_price",_price)
					}else if($(this).attr("via") == '1' && $(this).attr("c_type") == '3'){
						_discountRate=parseFloat($(this).attr("num"));
						let discountLimit=Number(AllPrice)*Number(_discountRate);
						discountLimit=discountLimit.toFixed(2);
						let _cardMax=parseFloat($(this).attr("cardMax"));
						// calepri=AllPrice-((AllPrice-discountLimit>_cardMax)?_cardMax:discountLimit)
						// console.log("AllPrice",AllPrice)
						// console.log("discountLimit",discountLimit,typeof discountLimit)
						// console.log("_cardMax",_cardMax)
						if(AllPrice-discountLimit>_cardMax){
							calepri=AllPrice-_cardMax
						}else{
							calepri=discountLimit
						}
						// console.log("calepri",calepri)
					}					
				});
				// console.log("_cardPerson",_cardPerson);
				if($(".card-mor dl").eq(0).attr("c_type") == '1'){
					calepri = AllPrice - minus;
				}else if($(".card-mor dl").eq(0).attr("c_type") == '2'){
					calepri=AllPrice-_price;
					// console.log("金额卡合计",calepri)
				}else if($(".card-mor dl").eq(0).attr("c_type") == null){
					calepri=AllPrice;
				}
				if( calepri < 0 ){
					calepri = 0.00;
				}
				$('.submit .total .price span').text(Number(calepri).toFixed(2));
				var htmlss = '<li class="clearfix"><div class="item"><div class="key" style="font-size: 14px; color: #333;">';
					htmlss += '卡券支付：￥'+ minus +'</div><div class="price">实付金额：￥'+ Number(calepri).toFixed(2) +'</div></div></li>'
				$(".pos-con .pos-s1 ul").append(htmlss);
			}
		}
		
	}
	//yjk_todo  数据结构为 
	// {
	// 	adult:[票价从大到小排序的数组],
	// 	child:[票价从小到大排序的数组]
	// }
	Cardpri(){
		let _this = this;
		let priceObj={
			"adult":[],
			"child":[]
		};
		let ticket_list = JSON.parse(window.sessionStorage.getItem('ticket-list'));
		// console.log("ticket_list",ticket_list)
		for(let i = 0; i < ticket_list.length; i++){
			for(let j in _this.DATA.ticket ){
				if( ticket_list[i].tid == j ){
					// 判断是否为成人票
					if(_this.DATA.ticket[j].t_preset_type=="成人票"){
						for(let s = 0;s < ticket_list[i].num;s++){
							priceObj.adult.push(_this.DATA.ticket[j].t_price);
						}
						break;
					}else{
						for(let s = 0;s < ticket_list[i].num;s++){
							priceObj.child.push(_this.DATA.ticket[j].t_price);
						}
						break;
					}
				}
			}
		}
		priceObj.child.sort(function(a,b){
			return a < b;
		})
		priceObj.adult.sort(function(a,b){
			return a < b;
		})	
		// console.log("新的排序结构",priceObj)	
		return priceObj;
	}
	Submit(blyes){
		let _this = this;
		var bl_yes = blyes;
		$('.submit .btn').off().on('click',function(){
			let active_num = 0;
			let ticket_ok_num = 0;
			let err_msg = '';
			let bookType ='';
			let oType = 1;
			if ($('.pay-first span').hasClass('active')) {
	    		bookType = 1;
	    	} else{
	    		bookType = 0;
	    	}
			if ($('.pay-single span').hasClass('active')) {
	    		oType = 1;
	    	} else{
	    		oType = 2;
	    	}
			$('.tourist-list li').each(function(){
				// 其本信息
				let tdata = $(this).data('data');
				let i_n = '', i_m = '', i_c = '', card_typeval = '身份证';
				if( tdata ){
			        i_n = tdata.name;
			        i_m = tdata.tel;
			        i_c = tdata.card_no;
			        card_typeval = tdata.card_type;
			        active_num++;
		        }

		        // 限制信息
		        let type = $(this).attr('type');
		        let tid = $(this).attr('tid');
		        let is_rep = $(this).attr('is_rep');

		        if( type == 'normal' ){
		            var limit_typeval = _this.DATA.ticket[tid].t_limit_type;
		            var limit_conditionval = _this.DATA.ticket[tid].t_limit_condition;
		        }
		        if( type == 'group' ){
		        	tid = $(this).attr('pid');
		            var ttid = $(this).attr('tid');
		            var limit_typeval = _this.DATA.ticket[tid].list[ttid].t_limit_type;
		            var limit_conditionval = _this.DATA.ticket[tid].list[ttid].t_limit_condition;
		        }

		        // 验证电话号码
		        if (i_m) {
		            let mobile_reg = /(^0?[1][34857][0-9]{9}$)/;
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
		            }
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
		        }else{
		            ticket_ok_num++;
		        }
			})

			if( !$('.tourist-list li').eq(0).hasClass('writed') ){
				_.Popup.Tip('请将游客代表人信息填写完整');
		        return false;
			}

			if( !active_num ){
				// _.Popup.Tip('请添加至少一组游客信息');
				_.Popup.Tip('请将游客信息填写完整');
		        return false;
			}

			if( err_msg ){
				_.Popup.Tip(err_msg);
		        return false;
			}


			//验证买票数据是否完整
		    if( ticket_ok_num < $('.tourist-list li').length ){
		        _.Popup.Tip('请填写正确的游客信息');
		        return false;
		    }

		    //验证是否填写接送信息
		    let godata = $('.site .site-go').data('data'),
		    	backdata = $('.site .site-back').data('data');
		    if( !godata || !backdata ){
		    	_.Popup.Tip('请填写接送信息');
		    	return false;
		    }

		    //按后端数据格式生成所有票数据
		    let data = _this.DATA.ticket_show;
		    let start_date = _this.DATA.bl_start_date.replace(/\-/gi,''),
        		end_date = _this.DATA.bl_end_date.replace(/\-/gi,'');
		    let tickdata = [];
		    for(let i in data){
		    	let type = data[i].t_preset_type;
		    	tickdata.push({
		    		id : data[i].t_id,
		    		num : data[i].people_num,
		    		room_num : data[i].bed_num,
		    		list : {},
		    		seat : []
		    	})
		    	let len = tickdata.length;
		    	if( type != '套票' ){
		    		$('.tourist-list li[type=normal][tid='+i+']').each(function(){
		    			let lidata = $(this).data('data');
		    			if( !lidata ){
		    				lidata = {
		    					card_no : '',
		    					card_type : '身份证',
		    					name : '',
		    					tel : ''
		    				}
		    			}

		    			tickdata[len-1].seat.push({
		    				"is_rep" : lidata.is_rep,
		    				"start_site_type" : godata.types,
		    				"end_site_type" : backdata.types,
		    				"vip_name" : lidata.name,//游客姓名
	                        "vip_mob" : lidata.tel,//游客手机号
	                        "vip_card_type" : lidata.card_type,//游客证件类型
	                        "vip_card" : lidata.card_no,//游客证件号
	                        "start_site" : godata.name,//去程站点名称
	                        "start_sid" : godata.id,//去程站点ID
	                        "start_date" : start_date,//出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
	                        "end_site" : backdata.name,//返程站点名称
	                        "end_sid" : backdata.id,//返程站点ID
	                        "end_date" : end_date,//返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
	                        "start_bus_id" : godata.bus_id,
	                        "end_bus_id" : backdata.bus_id
		    			})
		    		})
		    	}else{
		    		for(let j in data[i].list){
		    			tickdata[len-1].list[j] = {
		    				id : data[i].list[j].t_id,
		    				num : data[i].list[j].people_num,
		    				room_num : data[i].list[j].bed_num,
		    				seat : []
		    			}
		    			$('.tourist-list li[type=group][pid='+i+'][tid='+j+']').each(function(){
		    				let lidata = $(this).data('data');
			    			if( !lidata ){
			    				lidata = {
			    					card_no : '',
			    					card_type : '身份证',
			    					name : '',
			    					tel : ''
			    				}
			    			}
		    				tickdata[len-1].list[j].seat.push({
		    					"is_rep" : lidata.is_rep,
		    					"start_site_type" : godata.types,
		    					"end_site_type" : backdata.types,
		    					"vip_name" : lidata.name,//游客姓名
		                        "vip_mob" : lidata.tel,//游客手机号
		                        "vip_card_type" : lidata.card_type,//游客证件类型
		                        "vip_card" : lidata.card_no,//游客证件号
		                        "start_site" : godata.name,//去程站点名称
		                        "start_sid" : godata.id,//去程站点ID
		                        "start_date" : start_date,//出发日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
		                        "end_site" : backdata.name,//返程站点名称
		                        "end_sid" : backdata.id,//返程站点ID
		                        "end_date" : end_date,//返程日期（如果推迟一天或提前一天会用到，没有值默认为出发日期与返程日期）
		                        "start_bus_id" : godata.bus_id,
	                        	"end_bus_id" : backdata.bus_id
		    				})
		    			})
		    		}
		    	}
		    }
		    var buy_uid = '';
		    if(share_user){
		    	buy_uid = share_user.u_id;
		    }
		    var city_code = '';
		    city_code = _.GetUrlPara('city_code');
		    var oContractAgreement = $(".prime-text").html();
		    var cardflag = 0;
		    if(window.__wxjs_environment==="miniprogram" || _this.ustype == '3'){
		    	var cararr = [];
		    	if($(".card-mor dl").length < 1){
		    		_.Popup.Tip('请使用卡券支付');
		    		return false;
		    	}else{
		    		$(".card-mor dl").each(function(){
			    		if($(this).attr("via") != '1'){
			    			cardflag = 1;
			    		}else{
			    			var numm = $(this).find(".card-num").val();
				    		var passe = $(this).find(".pass").val();
				    		passe = hex_md5(passe);
				    		var car = {
				    			cardNo : numm,
				    			pass : passe
				    		};
				    		cararr.push(car);
			    		}
			    		
			    	});
		    	}
		    	
		    }
		    if(cardflag == 1){
		    	_.Popup.Tip('你有未验证通过的卡片');
			    return false;
		    }
		    var appletId = window.sessionStorage.getItem('appletId');
		    if(!appletId){
		        appletId = '';
		    }
		    _.Ajax({
		    	url : '/b2b/shop/place',
		    	type : 'post',
		    	data : {
		    		appletId : appletId,
		    		cardDOS : cararr,
		    		oContractAgreement : oContractAgreement,//合同签约定
		    		bl_yes : bl_yes,
		    		bl_id : _this.DATA.bl_id,
		    		buy_uid : buy_uid,
		    		city_code : city_code,
		    		o_remark : $.trim($('.remark-text textarea').val()),
		    		url_bool : 'yes',
		    		ticket : tickdata,
		    		pp_id : $('.promotion-list li.active').attr('lid'),
					bookType : bookType,  //0-full  1-first
					oType : oType
		    	},
		    	success : function(res){
		    		if(res.code == 200){
						debugger
		    			if(res.data && res.data.status && res.data.status == "待确认"){
		    				window.location.href = 'pay_success.html?n=' + res.data.number;
		    			}else if(res.data && res.data.status && res.data.status == "已预约"){
		    				window.location.href = 'pay.html?n=' + res.data.number +'#wechat_redirect';
		    			}
		    		}else if(res.code == 682){ //不接待游客 不能下单
		    			var mess = $.parseJSON(res.message);
		    			var lis = '';
		    			for (var j = 0;j < mess.length; j++){
		    				lis += '<li>' + mess[j].vip_name + "(" + mess[j].b_name + ')' + mess[j].b_mobile + '&nbsp; ' + mess[j].b_card + '<p>理由：' + mess[j].b_sorg_reason + '</p></li>';
		    			}
		    			var html = '<div class="order_sta">';
		    				html += '<h4><span class="no"></span>线路供应商无法接待此订单游客!</h4>';
		    				html += '<ul class="popu_ul">' + lis + '</ul>';
		    				html += '<div class="buts clearfix"><a class="sures" href="javascript:;">确定</a></div></div>';
		    			_.Popup.Info(html);
		    			$(".buts .sures").off().on("click",function(){
		    				_.Popup.PopupRemove();
		    			})
		    		}else if(res.code == 683){ //确认游客 继续下单
		    			var mess = $.parseJSON(res.message);
		    			
		    			var lis = '';
		    			for (var j = 0;j < mess.length; j++){
		    				lis += '<li>' + mess[j].vip_name + "(" + mess[j].b_name + ')' + mess[j].b_mobile + '&nbsp; ' + mess[j].b_card + '<p>理由：' + mess[j].b_sorg_reason + '</p></li>';
		    			}
		    			var html = '<div class="order_sta">';
		    				html += '<h4><span class="yes"></span>线路供应商需审核此订单游客!</h4>';
		    				html += '<ul class="popu_ul">' + lis + '</ul>';
		    				html += '<div class="buts clearfix"><a class="cle" href="javascript:;">取消</a><a class="sure" href="javascript:;">确定</a></div></div>';
		    			_.Popup.Info(html);
		    			$(".buts .cle").off().on("click",function(){
		    				_.Popup.PopupRemove();
		    			})

		    			$(".buts .sure").off().on("click",function(){
		    				_this.Submit(1);
		    				$('.submit .btn').click();
		    				_.Popup.PopupRemove();
		    			})
		    		}
		    		
		    		
		    	}
		    })
		})
	}
}

UserInfo.Ready(function(){
	new Index();
})