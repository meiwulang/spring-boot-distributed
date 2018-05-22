import '../../less/made_detail.less';
import C from '../common/common.js';
import $ from '../lib/jquery.2.1.4.js';
import _ from '../common/global.js';
import Popup from '../common/popup.js';
import Swiper from '../lib/swiper.3.4.0.js';
import template from '../lib/artTemplate.js';

class Index{
	constructor(){
		var _this = this;
		_.CheckLogin(function(){

		    _.GetCityCode(function(citycode){
		        _this.citycode = citycode;
		        _this.Render();
			}) 
		})
	}

 	Render(){
 		let _this = this;
 		let status = $('.infor-bar ul li a.active').attr('typeNum');
 		let requireId = _.GetUrlPara('id');
 		let type = _.GetUrlPara('type');

		
		let data = {
			'edit' : '0',
			'requireId' : requireId
		}
		$('body').addClass('scrolling');
 		_.Ajax({
 			url : '/require/queryRequireDetail',
 			type : 'post',
 			data : data,
 			success : function(res) {
 				if (res.code == 200) {

 					res.body['madetype'] = type;
 					res.body['requireId'] = requireId;
 					

 					let html = template('tpl-lists',res.body);
					$(".loading").remove();
					$('.content').html(html);
                    $('body').removeClass('scrolling');

 				}
 			}

 		})
 	}
}
new Index();


