import '../../less/credit.less';
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
		var order_type = _.GetUrlPara('order_type');
		var status = '';
		status = $(".nav ul li .active").attr("status");
		var key = '';
		_.Ajax({
			url : '/h5/credit/get_credit_list',
			type : 'post',
			data : {
				order_type : order_type,
				status : status,
				key : key,
				limit : '999',
				page : '0'
			},
			success : function(res){
				if( res.code == 200 ){
					res.data['order_type'] = order_type;
					let html = template('tpl-condition',res.data);
					$('.content').html(html);
					_this.Colo();
				}
			}
		})
	}
	Event(){
		let _this = this;
		$(".nav>ul>li>a").on("click",function(){
			$(".nav ul li a").removeClass("active");
			$(this).addClass("active");
			_this.Show();
		});
		$(".lef").on("click",function(){
			window.history.back();
		})

	}
	Colo(){
		$(".colo").each(function(){
			console.log(1212)
			if($(this).text() == "未还完"){
				$(this).css("color","#ffad26");
			}else if($(this).text() == "已还完"){
				$(this).css("color","#37cc72");
			}else if($(this).text() == "未还款"){
				$(this).css("color","#84b6fb");
			}
		})
	}

}

UserInfo.Ready(function(){
	new Index();
})