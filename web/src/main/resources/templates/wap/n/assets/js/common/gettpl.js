// desc : 公用获取前端模板文件
// author : zhupinglei
// 344184416@qq.com

// para obj example:
// {
// 		url : 'test.tpl',
// 		data : {
// 			a : 1
// 		},
// 		success : function(html){
// 			// dosomething
// 		}
// }
import $ from 'jquery';
import template from 'template';
import common from './common.js';
var Cache = [];

export default function(obj){
	var def = {
		url : '',
		data : {},
		success : function(){}
	}	
	obj = $.extend(def,obj);
	var locaoHost = window.location.hostname;
	if(common.getDevENV() === 'local.baobiao.jdytrip.cn'){
        var url = '/tpl' + obj.url;
	}
	else{
        var url = '/wap/n/tpl' + obj.url;
	}

	var flag = 0, CacheHtml = '';
	for(var i = 0; i < Cache.length; i++){
		if( Cache[i].url == url && flag == 0 ){
			flag = 1;
			CacheHtml = Cache[i].render(obj.data);
			break;
		}
	}
	if( flag == 1 ){
		obj.success(CacheHtml);
		return false;
	}
	$.get(url,function(str){
		var render = template.compile(str),
			html = render(obj.data);
		Cache.push({
			url : url,
			render : render
		})
		obj.success(html);
	})
}