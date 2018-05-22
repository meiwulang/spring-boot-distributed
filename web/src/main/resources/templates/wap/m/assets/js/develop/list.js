import '../../less/list.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		let _this = this;
		_.CheckLogin(function(){
	        _.GetCityCode(function(citycode,cityname){
	            _this.citycode = citycode;
				_this.Condition();
				_this.Window();
				$('.top .city span').text(cityname);
				_.Statistics();
			});
		});
	}
	Window(){
		var types = '';
		types = _.GetUrlPara('type');
		switch(types){
			case '10':
				$(document).attr("title","周边短线");
				break;
			case '11':
				$(document).attr("title","国内长线");
				break;
			case '20':
				$(document).attr("title","出境旅游");
				break;
			case '30':
				$(document).attr("title","邮轮");
				break;
		}
	}
	Condition(){
		let _this = this;
		_.Ajax({
			url : '/front/B2b/Product/listcondition',
			type : 'get',
			data : {
				city_code : _this.citycode,
				type : _.GetUrlPara('type')
			},
			success : function(res){
				if( res.code == 200 ){
					let html = template('tpl-condition',res.data);
					$('.address').html(html);
					_this.AddressCheck();
					_this.ConditionEvent();
					_this.List();
					
				}
			}
		})
	}

	AddressCheck(){
		let len = 0;
		$('.address .address-list li').each(function(){
			len += $(this).width();
		})
		$('.address .address-list ul').width(len);
		//赋给出发日期值
		var da_on = decodeURIComponent(_.GetUrlPara('da_on'));
		var da_tw = decodeURIComponent(_.GetUrlPara('da_tw'));
		da_on = da_on == 'undefined' ? '' : da_on;
		da_tw = da_tw == 'undefined' ? '' : da_tw;
		if(da_on && da_tw){
			$('.datese').val(da_on);
			$('.dates').val(da_tw);
		}else if(da_on){
			$('.datese').val(da_on);
			$('.dates').val(da_on);
		}
	}

	ConditionEvent(){
		let _this = this;
		let $wrap = $('.address'),
			$ad_list = $wrap.find('.address-list'),
			$btn = $wrap.find('.address-btn'),
			$filter = $wrap.find('.filter-wrap'),
			$filter_menu = $filter.find('.filter-menu'),
			$filter_list = $filter.find('.filter-list'),
			$submit = $filter.find('.filter-submit button');

		// 省份选择
		$ad_list.find('li').on('click',function(e){
			e.stopPropagation();
			$(this).addClass('active').siblings().removeClass('active');
			if( !$filter.hasClass('open') ){
				_this.SetData();
			}
		})
		//阻止冒泡
		$(".filter-list").on("click",function(e){
			e.stopPropagation();
		})
		// 删选按扭
		$btn.on('click',function(e){
			e.stopPropagation();
			$filter.toggle();
			$filter.toggleClass('open');
		})
		// 删选菜单
		$filter_menu.find('li').on('click',function(e){
			e.stopPropagation();
			if( $(this).hasClass('active') ){
				return false;
			}
			let type = $(this).attr('type');
			$(this).addClass('active').siblings().removeClass('active');
			$filter_list.find('ul[type='+type+']').addClass('active').siblings().removeClass('active');
		})
		// 删选列表
		$filter_list.find('li').on('click',function(e){
			e.stopPropagation();
			$(this).toggleClass('check').siblings().removeClass('check');
		})
		// 确认选择
		$submit.on('click',function(e){
			e.stopPropagation();
			_this.SetData();
			$filter.hide();
			$filter.removeClass('open');
		})
		// 隐藏浮层
		$(document).on('click',function(){
			$filter.hide();
			$filter.removeClass('open');
		})
	}

	SetData(){
		let _this = this;
		let $wrap = $('.address'),
			$ad_list = $wrap.find('.address-list'),
			$filter = $wrap.find('.filter-wrap'),
			$filter_menu = $filter.find('.filter-menu'),
			$filter_list = $filter.find('.filter-list');

		let type = _.GetUrlPara('type');
		if( !type ){
			type = '';
		}

		let province = $ad_list.find('li.active span').text(),
			city = $filter_list.find('ul[type="city"] li.check').text(),
			days = $filter_list.find('ul[type="days"] li.check').text(),
			attribute = $filter_list.find('ul[type="attribute"] li.check').text(),
			scenic = $filter_list.find('ul[type="scenic"] li.check').text(),
			business = $filter_list.find('ul[type="business"] li.check').text();
		let start = '';
		let	datese_on = $('.datese').val();
		let	dates_tw = $('.dates').val();
		let key = $.trim($('.search input').val());
		var patt = "-"
		var datese = datese_on.replace(new RegExp(patt),"");
		datese = datese.replace(new RegExp(patt),"");
		var dates = dates_tw.replace(new RegExp(patt),"");
		dates = dates.replace(new RegExp(patt),"");
		if(datese && dates){
			start = datese + ',' + dates;
		}else if(datese){
			start = datese + ',' + datese;
		}
		let href_search = 	'type='+type+
							'&province='+encodeURIComponent(province)+
							'&destination='+encodeURIComponent(city)+
							'&days='+encodeURIComponent(days)+
							'&attribute='+encodeURIComponent(attribute)+
							'&scenic='+encodeURIComponent(scenic)+
							'&business='+encodeURIComponent(business)+
							'&key='+encodeURIComponent(key)+
							'&da_on='+encodeURIComponent(datese_on)+
							'&da_tw='+encodeURIComponent(dates_tw)+
							'&startDate=' + encodeURIComponent(start);
		window.location.href = 'list.html?'+href_search;	
	}

	GetData(){
		let _this = this;
		let type = _.GetUrlPara('type'),
			province = decodeURIComponent(_.GetUrlPara('province')),
			city = decodeURIComponent(_.GetUrlPara('destination')),
			days = decodeURIComponent(_.GetUrlPara('days')),
			attribute = decodeURIComponent(_.GetUrlPara('attribute')),
			scenic = decodeURIComponent(_.GetUrlPara('scenic')),
			business = decodeURIComponent(_.GetUrlPara('business')),
			key = decodeURIComponent(_.GetUrlPara('key')),
			startDate = decodeURIComponent(_.GetUrlPara('startDate'));

		if( !type ){
			type = '';
		}

		if( !province || province == 'undefined' ){
			province = '全部';
		}
		$('.address .address-list li[v='+province+']').addClass('active').siblings().removeClass('active');

		if( !city || city == 'undefined' ){
			city = '';
		}else{
			$('.filter-list ul[type=city] li[v='+city+']').addClass('check');
		}

		if( !days || days == 'undefined' ){
			days = '';
		}else{
			$('.filter-list ul[type=days] li[v='+days+']').addClass('check');
		}

		if( !attribute || attribute == 'undefined' ){
			attribute = '';
		}else{
			$('.filter-list ul[type=attribute] li[v='+attribute+']').addClass('check');
		}

		if( !scenic || scenic == 'undefined' ){
			scenic = '';
		}else{
			$('.filter-list ul[type=scenic] li[v='+scenic+']').addClass('check');
		}

		if( !business || business == 'undefined' ){
			business = '';
		}else{
			$('.filter-list ul[type=business] li[v='+business+']').addClass('check');
		}

		if( !key || key == 'undefined' ){
			key = '';
		}else{
			$('.search input').val(key);
			$('.search .search-placeholder').hide();
			$(".sear").css("display","block");
		}

		let data = {
			'city_code': _this.citycode,//当前页面城市代码，必须
	        'type': type,//产品类型('10'=>'周边短线', '11'=>'国内长线', '20'=>'出境旅游', '30'=>'邮轮') 必须
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
	        'startDate' : startDate
		}

		return data;
	}

	List(){
		let _this = this;
		let data = this.GetData();
		_.Ajax({
			url : '/front/B2b/Product/lists',
			type : 'post',
			data : data,
			success : function(res){
				if( res.code == 200 ){
					res.data['city_code'] = _this.citycode;
					var html = template('tpl-list',res.data);
					$('.products').html(html);
					var total = res.data.total;	
					_this.Urls();	
					_this.Wx(total);	
					new _.LazyLoad();
				}
			}
		})
	}
	Urls(){
		if(share_user && share_user.u_id){
			$(".products ul li a").each(function(){
				var hre = $(this).attr("href");
				var hr = hre + '&u_id=' +share_user.u_id
				$(this).attr("href",hr);
			})
		}
	}
	Wx(total){
		var host = window.location.host;
        let _this = this;
        var codes = _.Cookie.Get('city_code');
        var uids = '';
        if(share_user && share_user.u_id){
            uids = share_user.u_id;
        }
        var key = _.GetUrlParaByHref('key'); //关键字
        var province = _.GetUrlParaByHref('province'); //目的城市
        var scenic = _.GetUrlParaByHref('scenic'); //热门景点
        var days = _.GetUrlParaByHref('days'); //行程天数
        if(!key || key == undefined){
        	key = '';
        }else{
        	key = '（' + key + '）';
        }
        if(!province || province == undefined || province == "全部"){
        	province = '';
        }
        if(!scenic || scenic == undefined){
        	scenic = '';
        }
        if(!days || days == undefined){
        	days = '';
        }else{
        	days = days + '日游线路合集';
        }
        var type = _.GetUrlPara('type');
            var p_names = '';
            var p_name = '';
            var p_sname = '';
            var p_cover = '';
            var link = document.location.href + '&city_code=' + codes + '&u_id=' + uids;
            if(type == "10"){
            	p_names = "周边短线";
            	p_cover = 'http://' + host + '../..../img/10.png';
            }else if(type == '11'){
            	p_names = "国内长线";
            	p_cover = 'http://' + host + '../..../img/11.png';
            }else if(type == '20'){
            	p_names = "出境游";
            	p_cover = 'http://' + host + '../..../img/20.png';
            }else if(type == '30'){
            	p_names = "邮轮";
            	p_cover = 'http://' + host + '../..../img/30.png';
            }else if(type == '40'){
            	p_names = "特色游";
            	p_cover = 'http://' + host + '../..../img/40.png';
            }else if(type == '50'){
            	p_names = "自助游";
            	p_cover = 'http://' + host + '../..../img/50.png';
            }
           
            let userinfo_orgid = '';
            if( JSON.stringify(share_user) != '{}' && share_user.u_id ){
               
                p_name = '旅游去哪玩？' + p_names +'爆款线路，超好玩！嗨翻天！';
                p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
                if(share_user.org_logo){
                	p_cover = share_user.org_logo;
                }
                
            }
            if( _uinfo && _uinfo.m_org_id && _uinfo.u_id){
                userinfo_orgid = _uinfo.m_org_id;
                if(_uinfo.org_type == "管理公司" || _uinfo.org_type == "供应商"){
                	if(key || province || scenic || days){
                		p_name = '为您推荐了' + province + scenic + key + days +'（' + total + '条）';
                	}else{
                		p_name = '旅游去哪玩？' + p_names +'爆款线路，超好玩！嗨翻天！';
                	}
                	p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
                }else{
                	if(key || province || scenic || days){
                		p_name = _uinfo.u_realname + '为您推荐了' + province + scenic + key + days +'（' + total + '条）';
                	}else{
                		p_name = '欢迎光临' + _uinfo.u_realname +'的' + _uinfo.org_name +'旅游微店铺,' + p_names +'爆款线路等你来~';
                	}
                	p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
                	p_cover = 'http://' + host + '../..../img/00.png';
                }
            }else{
            	if(key || province || scenic || days){
                	p_name = '为您推荐了' + province + scenic + key + days +'（' + total + '条）';
                }else{
                	p_name = '旅游去哪玩？' + p_names +'爆款线路，超好玩！嗨翻天！';
                }
                p_sname = '众多有趣玩法，请点击详情查看，即可开启畅玩之旅！';
            }
            _.WxShare.CommonShare({
                title : p_name,
                desc : p_sname,
                url : link,
                pic : p_cover
            });
        
    }
}

UserInfo.Ready(function(){
	new Index();
})