import '../../less/schedule.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		let _this = this;
		if(!(_uinfo && _uinfo.u_id)){
			if(share_user){
				_.GetCityCode(function(citycode){
					_this.citycode = citycode;
					_this.Render();
				});
			}else{
				window.location.href = 'login.html';
			}
		}else{
			_.GetCityCode(function(citycode){
				_this.citycode = citycode;
				_this.Render();
			});
		}
	}

	Render(){
		let _this = this;
		let	froms = '';
		var from = window.sessionStorage.getItem("from");
		if(from == 'preview'){
			froms = "preview";
		};
		_.Ajax({
			url : '/front/h5/adver/getCalendarMonths',
			type : 'get',
			data : {
				p_id : _.GetUrlPara('p_id'),
				from : froms,
				city_code : _this.citycode
			},
			success : function(res){
				if( res.code == 200 ){
					let html = template('tpl-month-list',res);
					$('.month-list ul').html(html);
					let year = _.GetUrlPara('year'),
						month = _.GetUrlPara('month'),
						day = _.GetUrlPara('day');
					if( year && month ){
						$('.month-list li[year='+year+'][month='+month+']').addClass('active');
					}else{
						$('.month-list li').eq(0).addClass('active');
					}
					_this.MonthList();
					_this.Calendar(day);
					_this.Event();
					$('.t-bar a').on('click',function(){
						window.history.back();
					})
				}
			}
		})
	}

	Event(){
		let _this = this;
		//只浏览
		var form = window.sessionStorage.getItem('from');
		if(form == 'preview'){
			$(".next").hide();
		};
		$('.month-list li').on('click',function(){
			if( $(this).hasClass('active') ){
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			$(".ticket-list").html("");
			_this.CheckNum();
			_this.Calendar();
		})
		if(!(_uinfo && _uinfo.u_id)){
           $('.icon-trade').css("display","none");
        }else{
           $('.icon-trade').css("display","");
        }

		$('.icon-trade').on('click',function(){
			$(this).toggleClass('open');
			$('.ticket-list li .trade-price,.ticket-list li .s-trade-price').toggle();
			$('.ticket-list li .price,.ticket-list li .s-price').toggle();
			$('.calendar-list li .price,.calendar-list li .trade-price').toggle();
			$('.month-list li .price,.month-list li .trade-price').toggle();
		})


	}

	MonthList(){
		let len = 100 * $('.calendar .month-list li').length;
		$('.calendar .month-list ul').width(len);
	}

	Calendar(day){
		let _this = this;
		let $li = $('.month-list ul li.active'),
			year = $li.attr('year'),
			month = $li.attr('month'),
			froms = '';
		var from = window.sessionStorage.getItem("from");
		if(from == 'preview'){
			froms = "preview";
		};

		_.Ajax({
			// url : '/b2b/product/calendar',
			url : '/front/product/calendar',
			type : 'post',
			data : {
				p_id : _.GetUrlPara('p_id'),//产品ID
		    	year : year,//年份
		    	month : month,//月份
		    	from : froms,
		    	city_code : _this.citycode//城市代码
			},
			success : function(res){
				if( res.code == 200 ){
					res['year'] = year;
					res['month'] = month;
					if( day ){
						res['day'] = day;
					}
					$('.icon-trade').removeClass('open');
					let html = template('tpl-calendar',res);
					$('.calendar-list').html(html);
					_this.CalendarEvent(res.data);
					_this.Next(res.data);

					$('.calendar-list li.default').click().removeClass('default');

					let data = res.data;
					for (let i = 0; i < data.length; i++) {
						
						let dataInf = data[i].info;
						if (dataInf) {
							if (dataInf.sell_status == 1) {
								let sellOut = $('.calendar-list li').find('div.sellout').parent();
								sellOut.addClass('selloutbg');
								sellOut.unbind();
								sellOut.css('color' , '#999');
								sellOut.find('div.sellout i').css('color' , '#999');
								sellOut.find('div.sellout span').css('color' , '#999');
							}
						} else{
							let onInfo = $('.calendar-list li').find('div.noInfo').parent();
							onInfo.unbind();
						}
					}
				}
			}
		})
	}

	CalendarEvent(data){
		let _this = this;
		// 选择班期
		$('.calendar-list li').on('click',function(){
			if( $(this).hasClass('active') || $(this).hasClass('blank') ){
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			let ind = $(this).attr('ind');
			let tdata = data[ind];
			let html = template('tpl-ticket-list',tdata);
			$('.ticket-list').html(html);
			_this.TicketEvent(tdata,0);
			_this.CheckNum();
			if($(".tpl_dl dd").length == '1'){
				$(".tpl_dl dd").eq("0").addClass("acti");
				$(".ticket-list .bl_tab").eq("0").addClass("disp");
			}
			$(".tpl_dl dd").off().on("click",function(){
				if($(this).hasClass("acti")){
					return false;
				}
				//清楚input值
				$(".num-check input").val("0");
				$(".tpl_dl dd").removeClass("acti");
				$(this).addClass("acti");
				let _index = $(this).index();
				_index = _index - 1;
				$(".bl_tab").removeClass("disp");
				$(".bl_tab").eq(_index).addClass("disp");
				_this.TicketEvent(tdata,_index);
				_this.CheckNum();
			})
		})
	}

	TicketEvent(data,index){
		let _this = this;
		$('.ticket-list .bl_tab .bl_class li .num-check span').off().on('click',function(){
			let $li = $(this).parents('li'),
				$fa = $(this).parents(".bl_class").find("h3").attr("typ"),
				$input = $li.find('.num-check input'),
				ind = $li.index(),
				tid = $li.attr('tid'),
				type = $li.attr('type'),
				active = $(this).attr('class');
			let num = parseInt($input.val());

			let tdata;
			var is = data.info.bl_data[index];
			console.log(data.info.bl_data[index]);
			for(let i = 0; i < is.ticket[$fa].length; i++){
				if( tid == data.info.bl_data[index].ticket[$fa][i].t_id ){
					tdata = data.info.bl_data[index].ticket[$fa][i];
					break;
				}
			}

			switch(active){
				case 'reduce':
					num--;
					if( num < 0 ){
						num = 0;
					}
					break;
				case 'add':
					num++;
					if( tdata.t_store > -1 && num > tdata.t_store ){
						num--;
					}
					break;
				default:
					break;
			}
			let price = (num * tdata.t_price).toFixed(2);
			let trade_price = (num * tdata.t_trade_price).toFixed(2);
			$input.val(num);
			$li.find('.price').html('<i>￥</i>'+price);
			$li.find('.trade-price').html('<i>￥</i>'+trade_price);

			_this.CheckNum();
		})
	}

	Next(data){
		let _this = this;
		$('.next').off().on('click',function(){
			//只浏览
			var form = window.sessionStorage.getItem('from');
			if(form == 'preview'){
				return false;
			};
			let _index = $(".ticket-list .disp").index();
			_index = _index - 1;
			if( $(this).hasClass('disable') ){
				return false;
			}
			let list = [];
			$('.ticket-list .disp li').each(function(){
				let tid = $(this).attr('tid');
				let t_name = $(this).parents(".bl_class").find("h3").attr("typ");
				let tnum = parseInt($(this).find('.num-check input').val());
				if( tnum > 0 ){
					list.push({
						tid : tid,
						num : tnum,
						t_name : t_name
					})
				}
			})
			if( !list.length ){
				alert('请选择票价类型');
				return false;
			}else{
				window.sessionStorage.setItem('ticket-list',JSON.stringify(list));
			}
			let ind = $('.calendar-list li.active').attr('ind');
			let	bl_id = data[ind].info.bl_data[_index].bl_id;
			window.location.href = 'order.html?p_id=' + _.GetUrlPara('p_id')+'&bl_id=' + bl_id + '&city_code=' + _this.citycode;
		})
	}

	CheckNum(){
		let all = 0;
		$('.ticket-list li').each(function(){
			let tnum = parseInt($(this).find('.num-check input').val());
			all += tnum;
		})
		if( all ){
			$('.next').removeClass('disable');
		}else{
			$('.next').addClass('disable');
		}
	}
}

UserInfo.Ready(function(){
	new Index();
})