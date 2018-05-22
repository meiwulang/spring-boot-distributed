/**
 * url内查询条件组织
 * @param field 多于的条件
 */
Eye_Init();
 $(function() {
	var titleArr = {
		"0": "搜索结果 - 金豆云旅游",
		"10": "周边短线 - 金豆云旅游",
		"11": "国内长线 - 金豆云旅游",
		"20": "出境游 - 金豆云旅游",
		"30": "邮轮 - 金豆云旅游"
	};
	var type = GetQueryString('type') ? GetQueryString('type') : "0";
	$('title').html(titleArr[type]);

	window.onpopstate = function(){
		var urlsearch = window.location.search;
		var urlstorage = window.sessionStorage.getItem('product_list_url');
		if( urlsearch != urlstorage ){
			window.sessionStorage.setItem('product_list_url',urlsearch);
			window.location.reload();
		}
	}
	// window.addEventListener("popstate", function() {
	// 	window.location.reload();
	// });

	var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
	$("#header").load("index_header.html?t="+_TimeStamp);
	$("#footer").load("index_footer.html?t="+_TimeStamp);
	$("#login_mask").load("login.html?t="+_TimeStamp);
	
	//list列表
	$(".recomend_menuBtns").on("click", ".menuS", function() {
		$(".one_list").show();
		$(".two_list").hide();
		var Curl = delQueStr(document.URL, 'only_cluster');
		window.history.pushState({}, document.title, Curl);
		// $('.groupsel').css('color','#000');
		// $('.sellnum').css('color','#000');
		sessionStorage.setItem("listType",1);
		$(".product_recommend .list_box.first").css('display', "block").siblings(".list_box.second").css("display", "none");
		$(this).children().css("color", "#FFA600").parent().siblings().children().css("color", "#D3D3D3");

		//懒加载
		Img_Init();
		// getProductlistconditionData();
	});
	//班期列表
	$(".recomend_menuBtns").on("click", ".menuF", function() {
		$(".one_list").hide();
		$(".two_list").show();
		sessionStorage.setItem("listType",2);
		$(".product_recommend .list_box.second").css('display', "block").siblings(".list_box.first").css("display", "none");
		$(this).children().css("color", "#FFA600").parent().siblings().children().css("color", "#D3D3D3");
		// getProductlistconditionData();

		SetHeight();
	});

	//记住班期列表的选择
	if (sessionStorage.getItem("listType") == 2) {
		$(".one_list").hide();
		$(".two_list").show();
		$(".product_recommend .list_box.second").css('display', "block").siblings(".list_box.first").css("display", "none");
		$(".glyphicon-th-list").css("color", "#D3D3D3");
		$(".glyphicon-th").css("color", "#FFA600");
		// getProductlistconditionData();
	}

	getCityData();

	if (GetQueryString('key')) {
		$(".contentSreach").text(GetQueryString('key'));
	}
	if(GetQueryString('province')) {
		$('.city_list').hide();
		$(".select-result").append('<li class="pull-left active" data-label="province" id="selectAm"><span>' + GetQueryString('province') + '</span> <span class="item_delete">✕</span></li>');
	};
	if(GetQueryString('destination')) {
		$('.city_list').hide();
		$(".select-result").append('<li class="pull-left active" data-label="destination" id="selectAm"><span>' + GetQueryString('destination') + '</span> <span class="item_delete">✕</span></li>');
	};
	if(GetQueryString('days')) {
		$('.day_list').hide();
		$(".select-result").append('<li class="pull-left active" data-label="days" id="selectBm"><span>' + GetQueryString('days') + '天</span> <span class="item_delete">✕</span></li>');
	};
	if(GetQueryString('business')) {
		$('.business_list').hide();
		$(".select-result").append('<li class="pull-left active" data-label="business" id="selectEm"><span>' + GetQueryString('business') + '</span> <span class="item_delete">✕</span></li>');
	};

	//活动
	if (GetQueryString('ptitle')) {
		console.log(111)
		// window.location.onload();
		$(".promotion-title").append('<div class="" id="selectPm"><span>' + GetQueryString('ptitle') + '</span> <span class="item_delete">✕</span></div>');
	}
	

	if(GetQueryString('type')) {
		$('.index_navbar li').removeClass('active');
		$('#type' + GetQueryString('type')).addClass('active');
	};
	//选择条件效果
	Event();
	
	//更多选择
	Img_Init();
	//echo.init({ offset: 100, throttle: 250, unload: false, callback: function(element, op) { /*console.log(element, 'has been', op + 'ed')*/ } });
})

function Event(){

	//热门目的地
	$('#selectA a.clickA').off().on("click", function() {
		$('#selectA a.clickA').removeClass('active');
		$(this).addClass("active");
		$('.city_list').hide();
		var copyThisA = '<li id="selectAm" class="pull-left active" data-label="'+$(this).attr('data-label')+'" id="selectAm"><span>'+$(this).text()+'</span> <span class="item_delete">✕</span></li>';
		var label = $(this).attr('data-label');
		if($("#selectAm").length > 0) {
			$("#selectAm span:first").html($(this).find('span').text());
			window.history.pushState({}, document.title, changeURLPar(document.URL, label, $(this).text()));
			getProductlistconditionData();

		} else {
			window.history.pushState({}, document.title, changeURLPar(document.URL, label, $(this).text()));
			getProductlistconditionData();
			$(".select-result").append(copyThisA);
		};
	});

	//行程天数
	$('#selectB li').off().on("click", function() {
		$('.day_list').hide();
		$(this).addClass("active").siblings().removeClass("active");
		if($(this).hasClass("select-all")) {
			$("#selectBm").remove();
		} else {
			var copyThisA = $(this).clone();
			var dayNum = parseInt($(this).find('span').text());
			if($("#selectBm").length > 0) {
				$("#selectBm span:first").html($(this).text());
				window.history.pushState({}, document.title, changeURLPar(document.URL, 'days', dayNum));
				getProductlistconditionData();
			} else {
				window.history.pushState({}, document.title, changeURLPar(document.URL, 'days', dayNum));
				getProductlistconditionData();
				copyThisA.append(' <span class="item_delete">✕</span>');
				$(".select-result").append(copyThisA.attr("id", "selectBm"));
			};
		};
	});

	//商家信息
	$('#selectE li').off().on("click", function() {
		$('.scenic_list').hide();
		$(this).addClass("active").siblings().removeClass("active");
		if($(this).hasClass("select-all")) {
			$("#selectEm").remove();
		} else {
			var copyThisA = $(this).clone();
			if($("#selectEm").length > 0) {
				$("#selectEm span:first").html($(this).text());
				window.history.pushState({}, document.title, changeURLPar(document.URL, 'business', $(this).find('span').text()));
				getProductlistconditionData();
			} else {
				window.history.pushState({}, document.title, changeURLPar(document.URL, 'business', $(this).find('span').text()));
				getProductlistconditionData();
				copyThisA.append(' <span class="item_delete">✕</span>');
				$(".select-result").append(copyThisA.attr("id", "selectEm"));
			};
		};
	});

	var only_cluster = GetQueryString('only_cluster');
	//全部产品
	$('.clearsel').off().on("click",function() {
		if ( !only_cluster || only_cluster == 0 ) {
			return false;
		} else {
			$('.sellnum').css('color','#000');
			$('.groupsel').css('color','#000');
			window.history.pushState({}, document.title, changeURLPar(document.URL, 'only_cluster', $(this).attr("type")));
			getProductlistconditionData();
		}
		
	})

	//已售，成团
	$('.selectlist div').off().on("click",function() {
		if ($(this).attr('type') == only_cluster) {
			return false;
		} else{
			$(this).css('color','red').siblings().css('color','#000');
			$(this).addClass('active').siblings().removeClass('active');
			window.history.pushState({}, document.title, changeURLPar(document.URL, 'only_cluster', $(this).attr("type")));
			getProductlistconditionData();
		}
		
	})

	
	if (only_cluster == 1) {
		$('.sellnum').css('color','#f00');
	} else if (only_cluster == 2) {
		$('.groupsel').css('color','#f00');
	}

	//删除筛选条件 热门目的地
	$('#selectAm').off().on("click", function() {
		$('.city_list').show();
		var label = $('#selectAm').attr('data-label');
		var curl = delQueStr(document.URL, label);
		window.history.pushState({}, document.title, curl);
		getProductlistconditionData();
		$(this).remove();
		$("#selectA li").removeClass("active");
	});

	//删除筛选条件 天数
	$('#selectBm').off().on("click", function() {
		var Burl = delQueStr(document.URL, 'days');
		window.history.pushState({}, document.title, Burl);
		getProductlistconditionData();
		$(this).remove();
		$("#selectB li").removeClass("active");
	});

	//删除筛选条件 商家
	$('#selectEm').off().on("click", function() {
		window.history.pushState({}, document.title, delQueStr(document.URL, 'business', $(this).find('span').text()));
		getProductlistconditionData();
		$(this).remove();
		$("#selectE li").removeClass("active");
	});

	//删除活动
	$('#selectPm').off().on("click", function() {
		var AcUrl = delQueStr(document.URL, 'ptitle', $(this).find('span').text());
		AcUrl = delQueStr(AcUrl, 'act_id', $(this).find('span').text());
		window.history.pushState({}, document.title, AcUrl);
		getProductlistconditionData();
		$(this).remove();
		$("#selectE li").removeClass("active");
	});
}


function getCityData(citycode) {
	_GetCityData(citycode,function(ret){
		if(ret.data && ret.code == 200) {
			getTopconditionData();
			getProductlistconditionData();
			getbuslistrData();
			getArr();
		}
	});
}

//搜索框
function getTopconditionData() {
	code = _GetCityCode();
	if(code && 'null' != code) {
		var getTopconditionUrl = '/b2b/product/topcondition?code=' + code;
	} else {
		var getTopconditionUrl = '/b2b/product/topcondition';
	}
	ajaxRequest(getTopconditionUrl, 'GET', '', function(ret) {
		if(ret.data && ret.code == 200) {
			var dataInter = ret.data;
			var intersearchText = doT.template($("#TopconditionsearchDta-template").text());
			$("#TopconditionsearchData").html(intersearchText(dataInter));
			getUlHeight();
		}
	})
}

//购买记录
function getbuslistrData() {
	code = _GetCityCode();
	var type = GetQueryString('type');
	type = type ? type : 10;
	if (type == 0) {
		type = 10;
	}
	var getbuslistUrl = '/b2b/shop/recent_order_list?city_code=' + code;
	ajaxRequest(getbuslistUrl, 'GET', '', function(ret) {
		if(ret.data && ret.code == 200) {
			var dataInter = ret.data;
			var interText = doT.template($("#buslistData-template").text());
			$("#buslistData").html(interText(dataInter));
		}
	})
}

//浏览记录
function getArr(){
	var data = localStorage.getItem('array');
	data = JSON.parse(data);
	var dataInter = data;
	var interText = doT.template($("#buslistData-templates").text());
	$("#buslistDatas").html(interText(dataInter));
}

//产品分页
function showPage(page) {
	$(this).addClass('active');
	window.history.pushState({}, document.title, changeURLPar(document.URL, 'start', page));
	getProductlistconditionData();
}

function select_where(field) {
	var searchvar = {
		city_code: _GetCityCode()
	};
	var url_key = ['type', 'province', 'destination', 'days', 'business','startDate', 'key', 'only_cluster', 'act_id'];
	if(field) url_key = url_key.concat(field);
	for(var i = 0 in url_key) {
		if(GetQueryString(url_key[i])) {
			searchvar[url_key[i]] = GetQueryString(url_key[i]);
		}
	}
	return searchvar;
}

function in_array($value, $array) {
	if(typeof $array != 'object') return false;
	for(var $i = 0; $i < $array.length; $i++) {
		if($value == $array[$i]) return $i;
	}
	return -1;
};

function getProductlistconditionData() {
	var searchvar = select_where();
	/**
	 * 判断值是否在数组内
	 * @param $value
	 * @param $array
	 * @return {*}
	 */
	var getProductlistconditionUrl = '/front/B2b/Product/listcondition';
	$('#soso').html("0");
	ajaxRequest(getProductlistconditionUrl, 'GET', searchvar, function(ret) {
		if(ret.data && ret.code == 200) {
			//写入热门目的地
			var pcHtml = '';
			if(!($('#selectAm').attr('data_label') == 'province') && ret.data.des_by_province) {
				for ( var i in ret.data.des_by_province) {
						pcHtml += '<li class="clearfloat"><a class="pull-left firstLi clickA" data-label="province"><span>' + i + '</span></a><div class="pull-left">';
						for(var j in ret.data.des_by_province[i]) {
							pcHtml += '<a class="clickA" data-label="destination"><span>' + ret.data.des_by_province[i][j] + '</span></a>';
						}
						pcHtml += '</div></li>';
				}
				$('#selectA').html(pcHtml) ;
				$('.city_list').show();
			} else {
				$('.city_list').hide();
			}

			var Dayhtml = '';
			if(ret.data.days) {
				for(i = 0; i < ret.data.days.length; i++) {
					Dayhtml += '<li class="pull-left"><span>' + ret.data.days[i] + '天</span></li>';
				}
				$('#selectB').html(Dayhtml);
				$('.day_list').show();
			} else {
				$('.day_list').hide();
			}

			var businesshtml = '';
			if(ret.data.business) {
				for(i = 0; i < ret.data.business.length; i++) {
					businesshtml += '<li class="pull-left"><span data-id="' + ret.data.business[i].id + '">' + ret.data.business[i].sname + '</span></li>';
				}
				$('#selectE').html(businesshtml);
				$('.business_list').show();
			} else {
				$('.business_list').hide();
			}

			Event();
			getProductlistsData()
			getProductbuslistData()
			
			//更多
			$('.load_moreIntro').off().on("click", function() {
				var t = $(this),
					css = 'open';
					t.html('<span>收起</span>');
				if(t.hasClass(css)) {
					t.removeClass(css);
					var height = '47px';
					t.html('<span>更多</span>');

				} else {
					t.addClass(css);
					var height = $(this).siblings('.col-xs-10').height() + 13 + 'px';
					
				}
				t.parent().css('height', height);
			});
			if ($('.business_list').find('.col-xs-10').height() > 60) {
				$('.business_list').css('padding-bottom','12px');
			}
			if ($('.business_list').find('.col-xs-10').height() < 40) {
				$('.business_list').css('padding-bottom','0px');
			}
			getUlHeight();
		} else {
			$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
		}
	})
}

//产品列表
function getProductlistsData() {
	var searchvar = select_where(['start']);
	searchvar.limit = 20;
	var getProductlistsUrl = '/front/B2b/Product/lists';
	ajaxRequest(getProductlistsUrl, 'POST', searchvar, function(ret) {
		if(ret.data && ret.code == 200) {
			var data = ret.data;
			var dataInter = ret.data.list;

			if(dataInter != 'undefined' && dataInter) {
				$("#ProductlistsData").css("display","");
				$('#Pagination_p').css("display","");
				$(".rec").css("display","");

				var interText = doT.template($("#ProductlistsData-template").text());
				$("#ProductlistsData").html(interText(dataInter));

				if (_uinfo && _uinfo.u_id ) {
					var eye_state = localStorage.getItem('e_type');
					if( !eye_state || eye_state == 1 ){  //显示
						$(".pri_b").show();
					}else{
						$(".pri_b").hide();
					}
				}
				
				//条数统计
				$('#soso').html(ret.data.total)
				//分页
				var cpage = ret.data.start; //保存现在页码的值
				var totalpage = Math.ceil(ret.data.total / ret.data.limit);
				var outstr = "";
				var pagesize = 10;
				var count;
				//页面最后一页

				if(totalpage <= pagesize) { //总页数小于十页
					for(count = 1; count <= totalpage; count++) {
						if(count != cpage) {
							outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
						} else {
							outstr = outstr + "<li class='pages active' >" + count + "</li>";
						}
					}
				}
				if(totalpage > pagesize) { //总页数大于十页
					if(parseInt((cpage - 1) / 10) == 0) {
						for(count = 1; count <= 10; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
						outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
					} else if(parseInt((cpage - 1) / 10) == parseInt(totalpage / 10)) {
						outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";

						for(count = parseInt(totalpage / 10) * 10 + 1; count <= totalpage; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
					} else {
						outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";
						for(count = parseInt((cpage - 1) / 10) * 10 + 1; count <= parseInt((cpage - 1) / 10) * 10 + 10; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
						outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
					}
				}
				if(cpage == 1) {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' >上一页</li>";
				} else if(cpage == totalpage) {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' >下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>";
				} else {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>";
				}

				$('#Pagination_p').html(outstr);

				if(GetQueryString('start')) {
					var curl = delQueStr(document.URL, 'start')
					window.history.pushState({}, document.title, curl);
				}

				//分页结束

				//懒加载
				Img_Init();
				//活动促销
				$(".pary").hover(function(){
					$(this).find(".chils .groups:last").css("border-bottom","0");
					$(this).find(".chils").css("display","block");
					$(this).find("img").css("display","block");
				},function(){
					$(this).find(".chils").css("display","");
					$(this).find("img").css("display","");
				});
			} else {
				$('#soso').html("0");
				$(".rec").css("display","block");
				$("#ProductlistsData").css("display","none");
				$('#Pagination_p').css("display","none");
			}

			if(!(_uinfo && _uinfo.u_id)){
			    $('.travelItem_evaluate h5 a').attr('href','/index/login.shtml');
			}
		} else {
			$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
		}
	})
}


function SetHeight(){
	$('#ProductbuslistData li .log_width').each(function(){
		var hei = $(this).height();
		$(this).parent().find('.linkBtn').css('height',parseInt(hei)+'px');
		$(this).parent().find('div.col-xs-1').css('line-height',parseInt(hei)+'px');
	})
}

//班期列表

function getProductbuslistData() {
	var searchvar = select_where(['start']);
	var getProductbuslistUrl = '/b2b/product/buslist'
	ajaxRequest(getProductbuslistUrl, 'POST', searchvar, function(ret) {
		if(ret.data && ret.code == 200) {
			var dataInter = ret.data.list;
			if(dataInter) {
				var interText = doT.template($("#ProductbuslistData-template").text());
				$("#ProductbuslistData").html(interText(dataInter));

				if ($('.nav-tabs li').hasClass('active')) {
					$('.pro_type').hide();
				}

				SetHeight();

				$('#ProductbuslistData li').each(function(){
					var ind = $(this).index();
					if( typeof dataInter[ind].ticket && dataInter[ind].ticket && dataInter[ind].t_price != '暂无报价'){
						$(this).find('.priceColor_danger').showprice(dataInter[ind].ticket,0,43,false);
					}
				})

				//分页
				var cpage = ret.data.start; //保存现在页码的值
				var totalpage = Math.ceil(ret.data.total / ret.data.limit);
				var outstr = "";
				var pagesize = 10;
				var count;
				//页面最后一页

				if(totalpage <= pagesize) { //总页数小于十页
					for(count = 1; count <= totalpage; count++) {
						if(count != cpage) {
							outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
						} else {
							outstr = outstr + "<li class='pages active' >" + count + "</li>";
						}
					}
				}
				if(totalpage > pagesize) { //总页数大于十页
					if(parseInt((cpage - 1) / 10) == 0) {
						for(count = 1; count <= 10; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
						outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
					} else if(parseInt((cpage - 1) / 10) == parseInt(totalpage / 10)) {
						outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";

						for(count = parseInt(totalpage / 10) * 10 + 1; count <= totalpage; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
					} else {
						outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";
						for(count = parseInt((cpage - 1) / 10) * 10 + 1; count <= parseInt((cpage - 1) / 10) * 10 + 10; count++) {
							if(count != cpage) {
								outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
							} else {
								outstr = outstr + "<li class='pages active' >" + count + "</li>";
							}
						}
						outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
					}
				}
				if(cpage == 1) {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' >上一页</li>";
				} else if(cpage == totalpage) {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' >下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>";
				} else {
					outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>";
				}

				$('#Pagination_b').html(outstr)

				if(GetQueryString('start')) {
					var curl = delQueStr(document.URL, 'start')
					window.history.pushState({}, document.title, curl);
				}
				//分页结束
			} else {
				$("#Pagination_b").html("<p class='firse_cont'>没有查询到数据！</p>");
				$("#ProductbuslistData").html('');
			}
		//列表页面未登录不显示同行价
		if (_uinfo && _uinfo.u_id) {
			var eye_state = localStorage.getItem('e_type');
			 if ( !eye_state || eye_state == 1){
			 	$(".log_width").css("width","40%");
				$('.t_price').show();
				SetHeight();
			}else{
				$('.t_price').hide();
				$(".log_width").css("width","50%");
				SetHeight();
			}
			$(".list_eye").show();
			SetHeight();
		}else{
			$(".log_width").css("width","50%");
			$(".log_block").css("display","none");
			$(".log_bottom").css("display","none");
			$(".list_eye").hide();
			SetHeight();
		};

		//活动促销
		$(".pary").hover(function(){
				$(this).find(".chils .groups:last").css("border-bottom","none");
				$(this).find(".chils").css("display","block");
				$(this).find("img").css("display","block");
		},function(){
				$(this).find(".chils").css("display","");
				$(this).find("img").css("display","");
		});
		} else {

			$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });

		}

	})

}

function int2date(daytime, ds) {
	daytime = daytime.toString();
	var Y = daytime.substr(0, 4);
	var M = daytime.substr(4, 2);
	var D = daytime.substr(6, 2);
	ds = ds ? ds : '.';
	return Y + ds + M + ds + D;
};

function getUlHeight() {
	$(".load_moreIntro").each(function() {
		var hei = $(this).prev().height(); //ul height
		if(hei <= 40) {
			$(this).hide();
		} else {
			$(this).show();
		};
	});
};

//日历插件
$("#datetimeStart").datetimepicker({
    format: 'yyyy-mm-dd',
    minView:'month',
    language: 'zh-CN',
    autoclose:true,
    todayButton: true,
    startDate:new Date()
}).on("changeDate",function(e){
	$("#datetimeEnd").datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        todayButton: true,
        startDate:new Date()
    }).on("changeDate",function(e){
    });
	$("#datetimeEnd").datetimepicker('show');
});

//确定
$('.subDate').off().on('click',function() {
	var startDate = $("#datetimeStart").val().replace('-','').replace('-','');
	var endDate = $("#datetimeEnd").val().replace('-','').replace('-','');
	if (!startDate) {
		return false;
	}

	if (!endDate) {
		$("#datetimeEnd").val($("#datetimeStart").val())
		endDate = startDate;
	}

	if (parseInt(startDate) > parseInt(endDate)) {
		var mDate = "";
		mDate = $("#datetimeStart").val();
		$("#datetimeStart").val($("#datetimeEnd").val());
		$("#datetimeEnd").val(mDate);
	}
	window.history.pushState({}, document.title, changeURLPar(document.URL, 'startDate', startDate + ',' + endDate));
	getProductlistconditionData();
});

//清除
$('.clearDate').off().on('click',function() {
	$("#datetimeStart").val('');
	$("#datetimeEnd").val('');
	var Curl = delQueStr(document.URL, 'startDate');
	window.history.pushState({}, document.title, Curl);
	getProductlistconditionData();
});

//立即下单
function gorders(pid,bqid,e) {         
    e.stopPropagation();
    if (_uinfo && _uinfo.u_id) {
        var citycode = _GetCityCode();
        window.location.href = 'order.html?p_id=' + pid + '&bl_id=' + bqid + '&city_code=' + citycode;
    } else {
        $.MsgBox({
            type: "alert", title: '提示', msg: "请先登录", speed: 200, callback: function () {
                $("#myModal").modal("show");
            }
        });
    }
}

//是否显示同行价
$('.list_eye').on('click',function() {
	$(this).find('i').toggleClass('fa-eye-slash').toggleClass('fa-eye');
	$(this).toggleClass('open');
	Eye();
})
function Eye() {
    if ($('.list_eye').hasClass('open')) {  //显示
		localStorage.setItem('e_type','1');
        $('.t_price').show();
        $(".log_width").css("width", "40%");
        SetHeight();
    } else{   //隐藏
		localStorage.setItem('e_type','2');
        $('.t_price').hide();
        $(".log_width").css("width", "50%");
        SetHeight();
    }
}
function Eye_Init(){
	var eye_state = localStorage.getItem('e_type');
	if( !eye_state || eye_state == 1 ){  //显示
		$('.list_eye').addClass('open');
	 	$(".log_width").css("width", "40%");
	 	$('i.eye_slash').addClass('fa-eye').removeClass('fa-eye-slash');
		$('.t_price').show();
		$(".pri_b").show();
		SetHeight();
	}else{
	 	$('.list_eye').removeClass('open');
		$(".log_width").css("width", "50%");
		$('i.eye_slash').addClass('fa-eye-slash').removeClass('fa-eye');
		$('.t_price').hide();
		$(".pri_b").hide();
		SetHeight();
	}
}

//懒加载
function Img_Init() {
	echo.init({
		offset: 100,
		throttle: 250,
		unload: false,
		callback: function(element, op) {}
	});
}
