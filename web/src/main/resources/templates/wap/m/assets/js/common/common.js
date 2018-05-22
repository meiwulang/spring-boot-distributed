// desc : 全局公用js
// author : zhupinglei
// 344184416@qq.com

import $ from '../lib/jquery.2.1.4.js';
import _ from './global.js';
// import Config from './city.js';
import template from '../lib/artTemplate.js';
import UserInfo from './userinfo.js';

class Common{
	constructor(){
		// this.PageInfo();
		this.City();
		this.Search();
		this.Nav();
		this.Route();
	}

	PageInfo(){
		$('<div id="send-pageinfo">反馈</div>').appendTo('body').on('click',function(){
			_.PageInfo.Send(_.Api());
		})
	}

	City(){
		$('.top .city').on('click',function(){
			_.GetCityCode(function(citycode){
				_.Ajax({
					url : '/front/h5/Adver/getStartCity',
					type : 'get',
					data : {
						code : citycode
					},
					success : function(res){
						if( res.code == 200 ){
							$('.citylist').addClass('in');
							let html = template('tpl-citylist',res.data);
							$('.citylist').html(html);
							$('.citylist .citylist-con li').on('click',function(){
								let code = $(this).attr('code'),
									name = $(this).text();
								_.Cookie.Add('city_code',code);
								_.Cookie.Add('city_name',name);
								var city_codes = _.GetUrlPara('city_code');
								if(city_codes){
									var urls = _.DelQueStr(document.URL,'city_code');
									window.location.href = urls;
								}else{
									window.location.reload();
								}
							})
							$('.citylist a.back').on('click',function(){
								$('.citylist').removeClass('in');
							})
						}
					}
				})
			})
		})

		$('.citylist .citylist-tbar a.back').on('click',function(){
			$('.citylist').removeClass('in');
		})
	}

	SearchJump(){
		let keyword = $.trim($('.search input').val());
		let type = _.GetUrlPara('type');
		let search = '?';
		if( keyword ){
			search += 'key='+encodeURIComponent(keyword);
			if( type ){
				search += '&type='+type;
			}
			window.location.href = 'list.html'+search;
		}
	}

	Search(){
		let _this = this;
		if( $('.search').size() ){
			
			$('.search input').val('');
			$('.search .search-placeholder').show();

			// $('.search .search-placeholder').on('click',function(){
			// 	$(this).hide();
			// 	$('.search input').focus();
			// 	_this.Focusajax();
			// 	$(".sear").css("display","block");
			// })

			$('.search input').on('keyup',function(e){
				if( e.keyCode == 13 ){
					_this.SearchJump();
				}
			})

			$(".search input").on("input propertychange",function(){
				if( !$('body').hasClass('scrolling') ){
					_this.Inputchangeajax()
				}
			})

			$(".search input").on("click",function(){
				if( $(".focussearch").attr("class")=="focussearch" &&  $(".changesearch").attr("class")=="changesearch"){
					if( !$.trim($(".search input").val()) ){
						_this.Focusajax();
					}
					if( !$('body').hasClass('scrolling') ){
						_this.Inputchangeajax();
					}
				};
			})			

			$(".sear").on("click",function(){
				_this.SearchJump();
			})

			$('.search input').on('blur',function(){
				if( !$.trim($(this).val()) ){
					$(this).val("");
					$(".sear").css("display","");
					$('.search .search-placeholder').show();
				}
			})
		}
	}

	Nav(){
		if( $('#nav').size() ){
			$('#nav .nav_user').on('click',function(){
        		_.Ajax({
        			url : '/user/h5/mine',
        			type : 'post',
        			success : function(res){
        				if( res.code == 200 ){
        					window.location.href = res.data;
        				}
        			}
        		})
        	})
        	return false;

 			if(_uinfo && _uinfo.u_id){
				if(_uinfo.org_type != '分销商'){
					$("#nav .nav_user a").attr("href","center.html?order_type=seller");
	                $("#nav .nav_order a").attr("href","order_list.html?order_type=seller");
	            }else{
	            	$("#nav .nav_user a").attr("href","center.html?order_type=buyer");
	                $("#nav .nav_order a").attr("href","order_list.html?order_type=buyer");
	            }
        	}

		}
	}

	Route(){
		var pathname = window.location.pathname;
		switch(pathname){
			case '/index.html':
				if(share_user && share_user.org_sname){
					$(document).attr("title",share_user.org_sname);
				}else{
					$(document).attr("title","");
				}
				break;
			case '/schedule.html':
				$(document).attr("title","班期/票价选择");
				break;
			case '/order.html':
				$(document).attr("title","订单预定");
				break;
			case '/pay.html':
				$(document).attr("title","订单支付");
				break;
		}
		Config();
	}

	Focusajax(){
		let _this=this;
		_.GetCityCode(function(citycode){
			_.Ajax({
				url : '/B2b/Product/getCatAreas',
				type : 'get',
				data : {
					city_code : citycode
				},
				success : function(res){
					if( res.code == 200 ){
						$('.focussearch').addClass('fadein');
						let html = template('tpl-focussearch',res);
						$('.focussearch').html(html);
						_this.Closesearch();			
						$(".search-typelist").on("click",function(){
							$(this).siblings(".onshow").removeClass("onshow");
							$(this).addClass("onshow");
							let typelistvalue=$(this).attr("value");
							$(".search-ul").each(function(){
								if($(this).attr("value")==typelistvalue){
									$(this).siblings(".show").removeClass("show");
									$(this).addClass("show");								
								}
							})							
						})
					}
				}
			})	
		})
	
	}

	Inputchangeajax(){
		let _this=this;
		var type = '';
		type = _.GetUrlPara('type');
		_.GetCityCode(function(citycode){
			$('body').addClass('scrolling');
			_.Ajax({
				url : '/B2b/Product/getCatKeys',
				type : 'get',
				data : {
					key:$(".search input").val(),
					city_code : citycode,
					type : type
				},
				success : function(res){
					if( res.code ==200 ){
						res.key=$('.search input').val();
						console.log(res.key)
						$('.changesearch').addClass('fadein');
						let html = template('tpl-changesearch',res);
						$('.changesearch').html(html);
						_this.Closesearch();	
						$('body').removeClass('scrolling');									
						// $(".search-key").text($('.search input').val())	
					}
				}
			})	
		})		
	}
	
	Closesearch(){
		$(".close").on("click",function(){
			$(this).parent().removeClass("fadein");
			$(".sear").css("display","");
			$('.search .search-placeholder').show();
			$('.search input').val("");							
		});		
	}

}

UserInfo.Ready(function(){
	new Common();
})