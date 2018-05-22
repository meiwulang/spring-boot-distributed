import '../../less/pact_success.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
	}

	Render(){
		let _this = this;
		var no = _.GetUrlPara('n');
		_.Ajax({
            url : '/front/order/m/queryOrderDetail',
            type : 'post',
            data : {
                no : no
            },
            success : function(res){
                if( res.code == 200 ){
                    var html = template('tpl-list',res.data);
                    $('.main').html(html);
                    _this.Even();
                   
                }
            }
        })
	}
	Even(){
		var no = _.GetUrlPara('n');
		if(_uinfo && _uinfo.u_id){
			$(".yes").css("display","block");
		}else{
			$(".nos").css("display","block");
		}
		$(".bottom_index").on("click",function(){
			
		})

		if($(".bear img").hasClass("zf")){
			$(document).attr("title","");
		}else{
			$(document).attr("title","");
		}
		
		$('.bottom_index').on('click',function(){
			window.location.href = 'order_detail.html?n='+no;
		})
	}
	
	
}

UserInfo.Ready(function(){
	new Index();
})