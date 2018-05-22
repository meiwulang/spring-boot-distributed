import '../../less/bills_detail.less';
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
		var no = _.GetUrlPara('no')
		_.Ajax({
			url : '/h5/credit/get_credit_detail',
			type : 'get',
			data : {
				no : no,
				order_type : order_type
			},
			success : function(res){
				if( res.code == 200 ){
					res['order_type'] = order_type;
					let html = template('tpl-condition',res);
					$('.main').html(html);
					 _this.Event();
				}
			}
		})
	}
	Event(){
		$(".tab ul li").on("click",function(){
			var _index = $(this).index();
			$(".tab ul li a").removeClass("active");
			$(this).find("a").addClass("active");
			$(".cons").addClass("display");
			$(".cons").eq(_index).removeClass("display");
		})
		$('.lef').off().on('click',function(){
            window.history.back();
        })
	}
}

UserInfo.Ready(function(){
	new Index();
})