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

import $ from '../lib/jquery.2.1.4.js';
import template from '../lib/artTemplate.js';
let Cache = [];

class GetTpl{
	constructor(obj){
		let def = {
			url : '',
			data : {},
			success : function(){}
		}	
		obj = $.extend(def,obj);
		let url = '/tpl/' + obj.url;

		let flag = 0, CacheHtml = '';
		for(let i = 0; i < Cache.length; i++){
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
			let render = template.compile(str),
				html = render(obj.data);
			Cache.push({
				url : url,
				render : render
			})
			obj.success(html);
		})
	}
}

export default GetTpl;