import '../../less/login_register.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Regi();
	}
	Regi(){
		var _this = this;
		var appletId = $.trim(_.GetUrlPara('appletId'));
        if(appletId && appletId != undefined) {
            window.sessionStorage.setItem('appletId', appletId);
        }
		var openId = _.GetUrlPara('openId');
		var pid = _.GetUrlPara('p_id');
		_.Ajax({
			url : '/user/visitorRegister',
			type : 'get',
			data : {
				openId : openId,
				p_id : pid
			},
			success : function(res){
				if( res.code == 200 ){
					_this.Login();
				}
			}
		})
	}
	Login(){
		var openId = _.GetUrlPara('openId');
		var pid = _.GetUrlPara('p_id');
		_.Ajax({
			url : '/user/loginByOpenId',
			type : 'get',
			data : {
				openId : openId,
				p_id : pid,
				from : 1
			},
			success : function(res){
				if( res.code == 200 ){
					var type  = _.GetUrlPara('type');
					if(type == 'product'){
						window.location.href = 'detail.html?p_id=' + pid;
					}else if(type == 'order'){
						window.location.href = 'order_list.html';
					}

				}
			}
		})
	}

	

	

	
}

UserInfo.Ready(function(){
	new Index();
})