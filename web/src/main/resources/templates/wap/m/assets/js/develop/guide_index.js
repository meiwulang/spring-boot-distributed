import '../../less/guide_index.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
        let _this = this;
        if((_guide.g_mob) || (_uinfo && _uinfo.u_id)){
        	
        }else{
        	window.location.href = 'login.html?guide=guide';
        }
        _this.Show();
	}
  	Show(){
		let _this = this; 
		var id = _.GetUrlPara('id');
		_.Ajax({
			url : '/H5/TeamPlanItem/teamPlanInfo',
			type : 'get',
			data : {
				id : id,
			},
			success : function(res){
				if( res.code == 200 ){
					res.data['id'] = id;
					let html = template('tpl-condition',res.data);
					$('.main').html(html);
					if(res.data.team_detail.team_credit_status != '未报账'){
						console.log(1212)
					 	$(".nav_three").removeClass("nav_th");
					 	$(".nav_three a").html($(".sons").html());
					}
					if(_uinfo && _uinfo.u_id){
						var u_mobile = _uinfo.u_mobile;
					}else{
						var u_mobile = '';
					}
					var g_mob = '';
					if(_guide.g_mob){
						var g_mob = _guide.g_mob;
					}
					if(u_mobile == res.data.team_detail.team_local_guide_tel || g_mob == res.data.team_detail.team_local_guide_tel){
						
					}else{
						$(".nav_three").removeClass("nav_th");
					}
					_this.Event();
				}
			}
		})
	}
	Event(){
		var _this = this;
		$(".nav_th").off().on("click",function(){
			_.Popup.Confirm('是否确定提交报账！',function(){
          		var id = _.GetUrlPara('id');

		        _.Ajax({
		            url : '/H5/TeamPlanItem/status_save',
		            type : 'post',
		            data : {
		              team_id : id,
		              dl_title : "提交审核",
		            },
		            success : function(res) {
		               _.Popup.PopupRemove();
		               if(res.code == '200'){
		                _.Popup.Tip(res.message);
		                _this.Show();
		               }
		            }
		        })
	        });
		})
	}
}

UserInfo.Ready(function(){
	new Index();
})