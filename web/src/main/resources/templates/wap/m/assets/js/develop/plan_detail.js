import '../../less/plan_detail.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		let _this = this;
        _this.Show();
        _this.Event();
	}
	Show(){
		let _this = this;
             
		var id = _.GetUrlPara('id')
		_.Ajax({
			url : '/h5/team/get_team_detail',
			type : 'get',
			data : {
				id : id,
			},
			success : function(res){
				if( res.code == 200 ){
					let html = template('tpl-condition',res.data);
					$('.main').html(html);
					 _this.Event();
				}
			}
		})
	}
	Event(){
		$(".nav ul li").on("click",function(){
			var _index = $(this).index();
			$(".nav ul li a").removeClass("active");
			$(this).find("a").addClass("active");
			$(".cons").addClass("display");
			$(".cons").eq(_index).removeClass("display");
		});
		$(".bu").on("click",function(){
			$(".actiss").addClass("in")
		});
		$(".buts").on("click",function(){
			$(".list").addClass("in")
		});
		$(".less").on("click",function(){
			$(this).parents(".fa").removeClass("in");
		})
		//切换形成内容
		$(".header").on("click",function(){
			$(this).toggleClass('open');
		})
		$(".shows li").on("click",function(e){
			e.stopPropagation();
			var _index = $(this).index();
			$(".header p").text($(this).text());
			$(".tabse").addClass("dis");
			$(".tabse").eq(_index).removeClass("dis");
			$(".header").removeClass('open');
		})
		var name = $(".shows li").eq('0').text();
		$(".header p").text(name);

		$('.lef').on('click',function(){
            window.history.back();
        })
        //简易   详情
        $(".jh").on("click",function(e){
        	e.stopPropagation();
        	var _index = $(this).attr("num");
        	$(this).parents('dl').find(".jh").removeClass("active");
        	$(this).addClass("active");
        	$(this).parents('dl').find(".deta").addClass("dis");
        	$(this).parents('dl').find(".deta").eq(_index).removeClass("dis")
        })
        $(".tabse").eq("0").removeClass("dis");

        //票种汇总
        $(".go_backs dd").on("click",function(){
        	$(".parint").css("display","none");
        	$(".trip dl dd").css("display","none");
        	var types = $(this).attr("types");
        	$(".trip dl dd").each(function(){
        		if($(this).attr('type') == types){
        			$(this).css("display","");
        		}
        	})
        	$(this).parents(".fa").removeClass("in");
        })
        //游客接送
        $(".go_ba dd").on("click",function(){
        	$(".trip dl dd").css("display","none");
        	$(".parint").css("display","none");
        	var stname = $(this).attr("stname");
        	$(".trip dl dd").each(function(){
        		if($(this).attr('stname') == stname){
        			$(this).css("display","");
        		}
        	})
        	$(this).parents(".fa").removeClass("in");
        })
        //全部游客信息
        $(".no_border .two").on("click",function(){
        	$(".parint").css("display","");
        	$(".trip dl dd").css("display","");
        })
	}
}

UserInfo.Ready(function(){
	new Index();
})