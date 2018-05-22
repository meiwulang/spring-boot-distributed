import '../../less/made_success.less';
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
		var typ = _.GetUrlPara('typ');
		if(typ == '1'){
			$(".success").show();
		}else if(typ == '0'){
			$(".err").show();
		}
	}
	
	
	
}

UserInfo.Ready(function(){
	new Index();
})