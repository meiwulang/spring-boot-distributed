import '../../less/pay_success.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import template from '../lib/artTemplate.js';
import UserInfo from '../common/userinfo.js';

class Index{
	constructor(){
		this.Render();
	}
	Render(){
		var no = _.GetUrlPara('n');
		$('.btns').on('click',function(){
			window.location.href = 'order_detail.html?n='+no;
		})
	}
}

UserInfo.Ready(function(){
	new Index();
})