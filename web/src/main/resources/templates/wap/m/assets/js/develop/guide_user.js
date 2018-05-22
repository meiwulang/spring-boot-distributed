import '../../less/guide_user.less';
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
	}
  
}

UserInfo.Ready(function(){
	new Index();
})