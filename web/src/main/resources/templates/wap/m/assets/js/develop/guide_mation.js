import '../../less/guide_mation.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        _this.Show();
	}
  	Show(){
		let _this = this;
             
		var id = _.GetUrlPara('id');
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
		$(".lef").on("click",function(){
			window.history.back();
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