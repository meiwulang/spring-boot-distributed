// ajax二次封装
import $ from 'jquery';
import common from './common.js';
import Popup from '@/assets/js/common/popup.js';

export default function(obj){
	switch(common.getDevENV()){
		case 'local.baobiao.jdytrip.cn':
			  //var api = 'http://192.168.0.109:8080';
			 var api = 'http://b2b.test.fingercrm.cn';
			 // var api = 'http://47.96.30.236:8200';
			 //var api = 'http://192.168.1.204:8080';
			break;
		default:
			var api = '';
			break;
	}
	if( obj.type == 'post' ){
		obj.data = JSON.stringify(obj.data)
	}
	Popup.Loading();
	$.ajax({
		url : api + obj.url,
		type : obj.type,
		dataType : 'json',
		contentType : "application/json; charset=utf-8",
		xhrFields: {
   			withCredentials: true
		},
   		crossDomain: true,
		data : obj.data
	}).done(function(res){
		Popup.LoadingRemove();
		obj.success(res);
		if(res.code == '-5'){
			window.location.href = 'login.html';
		}
	})
}