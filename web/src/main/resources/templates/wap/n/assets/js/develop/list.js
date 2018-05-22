var less = require('@/assets/less/develop/list.less')
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';

function Start(){
	this.Init();
}

Start.prototype = {
	Init : function(){
		var _this = this;
		_this.Judge();
		_this.Infor();
	},

	Judge : function(){
		var userType = localStorage.getItem('uDataLimit');
		if ( userType == 2 || userType == 3 ) {
			$(".personLi").show();
		} else if(userType == 1 ){
			
		} else if(userType == 0 ){
		
		}

	},
	Infor : function(){

		if (localStorage.getItem('uRealName') && localStorage.getItem('uRealName') != 'null') {
			$('.user_name').html(localStorage.getItem('uRealName'));
		}

		if (localStorage.getItem('uPost') && localStorage.getItem('uPost') != 'null') {
			$('.user_post').html(localStorage.getItem('uPost'));
		}

		if (localStorage.getItem('uPic') && localStorage.getItem('uPic') != 'null') {
			$('.user_img img').attr('src',localStorage.getItem('uPic'))
		}
	}
}

new Start();

