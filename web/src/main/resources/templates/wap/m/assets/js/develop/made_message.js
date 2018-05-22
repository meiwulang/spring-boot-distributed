import '../../less/made_message.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
		this.Event();
  		this.Mation();
  		this.Ciy();
  		var requireId = _.GetUrlPara('id');
  		if(requireId && requireId != undefined){
  			this.Edit();
  		}
  		
	}

	Render(){
		
		let _this = this;
		_.Ajax({
            url : '/front/h5/Adver/getStartCity',
            type : 'get',
            data : {},
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-citylist',res.data);
                    $('.citylist').html(html);
                    var requireId = _.GetUrlPara('id');
			  		if(!requireId || requireId == undefined){
			  			$(".citys").text(res.data.currentCity.name);
			  		}
                    _this.City();
                }
            }
        })
  		
	}
	int2date(daytime, ds) {
	  daytime = daytime.toString();
	  var Y = daytime.substr(0, 4);
	  var M = daytime.substr(4, 2);
	  var D = daytime.substr(6, 2);
	  ds = ds ? ds : '.';
	  return Y + ds + M + ds + D;
	}
	Edit(){
		var _this = this;
		var requireId = _.GetUrlPara('id');
		_.Ajax({
 			url : '/require/queryRequireDetail',
 			type : 'post',
 			data : {
 				'edit' : '1',
				'requireId' : requireId
 			},
 			success : function(res) {
 				if (res.code == 200) {
 					var data = res.body;
 					var rOptionalServices = data.rOptionalServices;
					if(rOptionalServices && rOptionalServices != null){
						var arr=rOptionalServices.split(",");  
						$(".fa-ul ul li").each(function(){
							var typ = $(this).attr("typ");
							for(var i=0;i<arr.length;i++){
								if(typ == arr[i]){
									$(this).addClass("active");
								}
							}
						})
					}
					$("body").attr("did",data.dId);
					if(data.rStartDateHead && data.rStartDateHead != null){
						var r = _this.int2date(data.rStartDateHead,"-");
						$(".tims").val(r);//开始时间
					}
					
					if(data.rStartDateTail && data.rStartDateTail != null){
						var d =_this.int2date(data.rStartDateTail,"-");
						$(".time").val(d);//结束时间
					}
					
					$(".day-sta").val(data.rPlayDaysMin);//最小天
					$(".day-end").val(data.rPlayDaysMax);//最大天
					
					if(data.rDestinationCitys && data.rDestinationCitys != null){{
						$(".city-end").text(data.rDestinationCitys);//目的地
					}}
					if(data.rStartCity && data.rStartCity != null){
						$(".citys").text(data.rStartCity);//出发城市
					}
					if(data.rAdultNum && data.rAdultNum != null){
						$(".peop_o").val(data.rAdultNum);//成人
					}
					if(data.rBabyNum && data.rBabyNum != null){
						$(".peop_s").val(data.rBabyNum);//儿童
					}
					if(data.rChildNum && data.rChildNum != null){
						$(".peop_t").val(data.rChildNum);//婴儿
					}
					if(data.rPerBudget && data.rPerBudget != null){
						$(".pricese").val(data.rPerBudget);//人均预算
					}
					if(data.rOtherRequire && data.rOtherRequire != null){
						$(".deman").val(data.rOtherRequire);//其他需求
					}
					$(".namer").val(data.rHeadName);
					$(".phon").val(data.rHeadPhone);
					$(".vx").val(data.rHeadWx);
					$(".emai").val(data.rHeadEmail);
					if(data.rHeadSex == '1'){
						$("#sex").val("1"); 
					}
					if(data.rType == '1'){
						$("#typer").val("1");//定制类型
					}
 				}
 			}

 		})
	}
	City(){
		var _this = this;
		$(".citylist-tbar .back").on("click",function(){
        	$(".citylist").removeClass("in");
        });
        $(".citylist .change-city li").on("click",function(){
        	$(".citylist").removeClass("in");
        	$(".citys").text($(this).html());
        })
	}
	Endcity(){
		let _this = this;
		var key = $(".whiter input").val();
		$("body").addClass("acti");
		_.Ajax({
            url : '/designCityList/'+ key,
            type : 'get',
            data : {},
            success : function(res){
            	$("body").removeClass("acti");
                if( res.code == "0" ){
                    var html = template('city-tem',res);
                    $('.pos').html(html);
                    $(".pos").show();
                  	_this.Ciy();
                }
            }
        })
	}
	Ciy(){
		var _this = this;
		$(".whiter .fas").on("click",function(){
			$(".whiter .fas").css("zIndex","-1");
			$(".whiter input").focus();
		})
		 //目的地
		// document.onkeydown=function(event){
  //           var e = event || window.event || arguments.callee.caller.arguments[0];
  //           if(e && e.keyCode==13){ // enter 键
  //            _this.Endcity();
  //          }
  //       };
  		$(".whiter input").on("input propertychange",function(){
  			if( !$('body').hasClass('acti') ){
  				var vals = $(".whiter input").val();
  				vals = $.trim(vals);
  				if(vals.length > 0){
  					_this.Endcity();
  				}
				
			}
  			
  		})
		$(".pos li").on("click",function(){
			$(".pos").hide();
			var citys = $(this).attr("name");
			var typt = 0;
			$(".city_uls li").each(function(){
				var name = $(this).attr("name");
				if(name == citys){
					typt = 1;
				}
			});
			if(typt == 0){
				$(".city_uls").append('<li name="' + citys + '" class="colors">'+ citys +'</li>');
			}
			$(".city_uls .cle").remove();
		});
		$(".city-btn").on("click",function(){
			var html = [];
			$(".city_uls li").each(function(){
				html.push($(this).attr("name"));
			});
			html = html.join(",");
			$(".city-list").removeClass("in");
			$(".city-end").text(html);
		})
		$(".pos,.city-list").on("click",function(e){
			e.stopPropagation();
			$(".pos").hide();
		})
	}
	Event(){
		var _this = this;
		$(".citys").on("click",function(){
			$(".citylist").addClass("in");
		});
		$(".city-end").on("click",function(){
			$(".city-list").addClass("in");
		});
		
		$(".city-list_header").on("click",function(){
			$(".city-list").removeClass("in");
		})
		$(".fa-ul ul li").on("click",function(){
			$(this).toggleClass("active");
		});
		//出发日期
		$(".tims").change(function(){
			$(".time").attr("min",$(".tims").val())
		});
		$(".time").change(function(){
			$(".tims").attr("max",$(".time").val())
		})
		$(".peop_o").on("input propertychange",function(){
			var peop_o = $(".peop_o").val();
			peop_o = peop_o.replace(/[^0-9]/ig,"");
			$(".peop_o").val(peop_o);
		})
		$(".peop_t").on("input propertychange",function(){
			var peop_o = $(".peop_t").val();
			peop_o = peop_o.replace(/[^0-9]/ig,"");
			$(".peop_t").val(peop_o);
		})
		$(".peop_s").on("input propertychange",function(){
			var peop_o = $(".peop_s").val();
			peop_o = peop_o.replace(/[^0-9]/ig,"");
			$(".peop_s").val(peop_o);
		})
		
		//加减天数
		$(".days .sun-rig span").off().on("click",function(){
			var sears = $(".day-sta").val(),
				end = $(".day-end").val();
			if($(this).hasClass("cle")){ //减
				if($(this).parent().hasClass("saer")){
					if(sears > 0){
						sears--;
						$(".day-sta").val(sears);
					}
				}else{
					if(end > 0){
						end--;
						$(".day-end").val(end);
					}
				}
			}else{ //加
				if($(this).parent().hasClass("saer")){
					sears++;
					$(".day-sta").val(sears);
				}else{
					end++;
					$(".day-end").val(end);
				}
			}
		})
	}
	Mation(){
		$(".btn").on("click",function(){
			var rtype = $("#typer").val(),//定制类型
				s_city = $.trim($(".citys").text()),//出发城市
				e_city = $.trim($(".city-end").text()),//目的地
				tims = $.trim($(".tims").val()),//开始时间
				time = $.trim($(".time").val()),//结束时间
				day_sta = $(".day-sta").val(),//最小天
				day_end = $(".day-end").val(),//最大天
				peop_o = $.trim($(".peop_o").val()),//成人
				peop_t = $.trim($(".peop_t").val()),//儿童
				peop_s = $.trim($(".peop_s").val()),//婴儿
				pricese = $.trim($(".pricese").val());//人均预算

			var demand = $.trim($(".deman").val());//其他需求

			var namer = $.trim($(".namer").val()),
				sex = $("#sex").val(),
				phon = $.trim($(".phon").val()),
				vx = $.trim($(".vx").val()),
				emai = $.trim($(".emai").val());
			if(!e_city){
				_.Popup.Tip('请填写目的地');
				return false;
			}
			if(tims){
				tims = tims.replace(new RegExp("-"),"");
				tims = tims.replace(new RegExp("-"),"");
			}
			if(!tims || !time){
				_.Popup.Tip('请选择出发日期');
				return false;
			}
			if(time){
				time = time.replace(new RegExp("-"),"");
				time = time.replace(new RegExp("-"),"");
			}
			if(day_sta == "0" && day_end == "0"){
				_.Popup.Tip('请选择出游天数');
				return false;
			}
			if(!peop_o && !peop_t && !peop_s){
				_.Popup.Tip('请输入出游人数');
				return false;
			}
			if(!pricese){
				_.Popup.Tip('请填写人均预算');
				return false;
			}
			var gai = [];
			$(".fa-ul ul li").each(function(){
				if($(this).hasClass("active")){
					gai.push($(this).attr("typ"));
				}
			})
			if(gai.length < 1){
				_.Popup.Tip('请选择可选服务');
				return false;
			}
			if(demand.length < 50){
				_.Popup.Tip('其他需求至少填写50字');
				return false;
			}
			if(demand.length > 500){
				_.Popup.Tip('其他需求最多填写500字');
				return false;
			}
			gai = gai.join(",");
			if(!namer){
				_.Popup.Tip('请填写游客联系人姓名');
				return false;
			}
			if(!phon){
				_.Popup.Tip('请填写游客联系人手机号');
				return false;
			}
			if( !_.RegEx.Tel(phon) ){
				_.Popup.Tip('请输入正确的手机号码');
				return false;
			}
			if(!vx){
				_.Popup.Tip('请填写游客联系人微信');
				return false;
			}
			if(!emai){
				_.Popup.Tip('请填写游客联系人邮箱');
				return false;
			}
			if( !_.RegEx.Email(emai) ){
				_.Popup.Tip('请输入正确的邮箱');
				return false;
			}
			var requireId = _.GetUrlPara('id');
			var url ="",
				ids = "";

	  		if(requireId && requireId != undefined){
	  			url = "/require/saveNewRequire";
	  			ids = $("body").attr("did");
	  		}else{
	  			url = "/require/saveRequire";
	  		}
			_.Ajax({
	            url : url,
	            type : 'post',
	            data : {
	            	dId : ids,
	            	rType : rtype,
	            	rStartCity : s_city,
	            	rDestinationCitys : e_city,
	            	rStartDateHead : tims,
	            	rStartDateTail : time,
	            	rPlayDaysMin : day_sta,
	            	rPlayDaysMax : day_end,
	            	rAdultNum : peop_o,
	            	rBabyNum : peop_s,
	            	rChildNum : peop_t,
	            	rPerBudget : pricese,
	            	rOtherRequire : demand,
	            	rHeadName : namer,
	            	rHeadSex : sex,
	            	rHeadPhone : phon,
	            	rHeadWx : vx,
	            	rHeadEmail : emai,
	            	rOptionalServices : gai
	            },
	            success : function(res){
	                if( res.code == 200 ){
	                    window.location.href = "made_success.html?typ=1";
	                }else{
	                	window.location.href = "made_success.html?typ=0";
	                }
	            }
	        })
		})
	}
	
}

UserInfo.Ready(function(){
	new Index();
})