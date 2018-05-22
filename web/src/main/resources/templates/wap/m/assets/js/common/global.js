// desc : 公用方法库
// author : zhupinglei
// 344184416@qq.com

import $ from '../lib/jquery.2.1.4.js';
import Cookie from './cookie.js';
import GetTpl from './gettpl.js';
import RegEx from './regex.js';
import Popup from './popup.js';
import PageInfo from './pageinfo.js';
import WxShare from '../lib/wx_share.js';
import LazyLoad from '../lib/lazyload.js';
// import Config from './city.js';
import Statistics from './statistics.js';
import Api from './api.js';

export default {
	Popup : Popup,
	Cookie : Cookie,
	RegEx : RegEx,
	WxShare : WxShare,
	LazyLoad : LazyLoad,
	PageInfo : PageInfo,
	Statistics : Statistics,
	Api : Api,
	GetTpl : function(obj){
		new GetTpl(obj);
	},
	// Api : function(){
	// 	let host = window.location.host;
	// 	let api = '';
	// 	switch(host){
	// 		// 测试地址
	// 		case 'h5.b2b.test.fingercrm.cn':
	// 			api = 'http://b2b.test.fingercrm.cn/';
	// 			break;
	// 		// 本地开发
	// 		case 'local.b2b-web.jdytrip.cn':
	// 			api = 'http://b2b.test.fingercrm.cn/';
	// 			break;
	// 		// 线上生产
	// 		default:
	// 			api = 'http://b2b.fingercrm.cn/';
	// 			break;
	// 	}
	// 	return api;
	// },
	Ajax : function(obj){
		let _this = this;
		var openid = window.sessionStorage.getItem('openid');
		let def = {
			url : '',
			type : 'get',
			dataType : 'json',
			data : {
				source : 'm',
				openid : openid
			},
			success : function(){}
		}
		obj.data = $.extend(def.data,obj.data);
		obj = $.extend(def,obj);
		if (obj.type == 'post' || obj.type == 'POST') {
	        obj.data = JSON.stringify(obj.data);
	    }
	    Popup.Loading();
		$.ajax({
			url : Api() + obj.url,
			type : obj.type,
			contentType : "application/json; charset=utf-8",
			xhrFields: {
           			withCredentials: true
       			},
       		crossDomain: true,
			dataType : 'json',
			data : obj.data
		}).done(function(res){
			Popup.LoadingRemove();
			obj.success(res);
			if( res.code != 200 && res.code != 0 && res.code != 300 && res.code!=400 && res.code != 682 && res.code != 683){
				Popup.Tip(res.message);
			}else if( res.code == 300 || res.code == 400){
				Popup.Info('<div style="word-wrap:break-word;word-break:break-all;">'+res.message + ',请前往' +res.data.buy_url+'购买</div>');
			}
			PageInfo.Get(obj,res);
		}).fail(function(jqXHR, textStatus, errorThrown){
			Popup.LoadingRemove();
			console.log('出错接口:',obj.url);
			PageInfo.Get(obj,[jqXHR,textStatus,errorThrown]);
		})
	},
	GetUrlPara : function(key){
		let para = window.location.search.split('?')[1];
		
		if( para ){
			let arr;
			if( window.location.search.indexOf('&&') > -1 ){
				arr = para.split('&&');
			}else{
				arr = para.split('&');
			}
			let len = arr.length,
				obj = {};
			for(let i = 0; i < len; i++){
				let v = arr[i].split('='),
					k = v[0],
					value = v[1] ? v[1] : '';
				obj[k] = value;
			}
			if( !key ){	//无key值，取全部
				return obj;
			}else{	//有key值，取key值对应值
				return obj[key];
			}
		}else{
			return '';
		}
	},
	GetUrlParaByHref : function(key){
		var para = window.location.href.split('?')[1];
		if( para ){
			var arr = "";
			if(window.location.hash.indexOf('&&') > -1) {
				arr = para.split('&&');
			} else {
				arr = para.split('&');
			}
			var len = arr.length,
				obj = {};
			for(var i = 0; i < len; i++){
				var v = arr[i].split('='),
					k = v[0],
					value = v[1] ? v[1] : '';
				obj[k] = value;
			}
			if( !key ){	//无key值，取全部
				return obj;
			}else{	//有key值，取key值对应值
				return obj[key];
			}
		}else{
			return '';
		}
	},
	DelQueStr : function(url, ref) {
		var str = "";
		if (url.indexOf('?') != -1) {
		    str = url.substr(url.indexOf('?') + 1);
		}
		else {
		    return url;
		}
		var arr = "";
		var returnurl = "";
		var setparam = "";
		if (str.indexOf('&') != -1) {
		    arr = str.split('&');
		    for (var i = 0; i < arr.length; i++) {
		        if (arr[i].split('=')[0] != ref) {
		            returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
		        }
		    }
		    return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
		}
		else {
		    arr = str.split('=');
		    if (arr[0] == ref) {
		        return url.substr(0, url.indexOf('?'));
		    }
		    else {
		        return url;
		    }
		}
	},
	TimeDown : function(time,each,call){
		let date = new Date(),
			StartTime = date.getTime();

		let t = setInterval(function(){
			let date = new Date(),
				ThisTime = date.getTime();
			let desc = ThisTime - StartTime;

			let showTime = time - parseInt(desc/1000);

			if( typeof each == 'function' ){
				each(showTime);
			}
			if( showTime <= 0 ){
				clearInterval(t);
				if( typeof call == 'function' ){
					call();
				}
			}
		},1000);
	},
	GetCityCode : function(callback){
		callback('330100','杭州');
		return false;

		let _this = this;
		let SessionCityCode = Cookie.Get('city_code');
		let SessionCityName = Cookie.Get('city_name');
		let citycode = _this.GetUrlParaByHref('city_code');
		if( citycode ){
			_this.Ajax({
				url : '/front/h5/Adver/getStartCity',
				type : 'get',
				data : {
					code : citycode
				},
				success : function(res){
					if( res.code == 200 ){
						Cookie.Add('city_code',citycode);
						Cookie.Add('city_name',res.data.currentCity.name);
						callback(citycode,res.data.currentCity.name);
					}
				}
			})
			return false;
		}
		if( SessionCityCode ){
			callback(SessionCityCode,SessionCityName);
			return false;
		}
		_this.Ajax({
			url : '/front/Order/h5/currCity',
			type : 'get',
			success : function(res){
				if( res.code == 200 ){
					citycode = res.data.currentCity.code;
					let cityname = res.data.currentCity.name;
					Cookie.Add('city_code',citycode);
					Cookie.Add('city_name',cityname);
					callback(citycode,cityname);
				}
			}
		})
	},
	CheckLogin : function(callback){
		var _this = this;
		// alert(_this.GetUrlParaByHref('openId') + '1');
		var openId = _this.GetUrlParaByHref('openId'),
			register = parseInt(_this.GetUrlParaByHref('register'));
		if( $.trim(openId) ){
			// alert('判断');
			window.sessionStorage.setItem('openid',openId);
		}
		var open = window.sessionStorage.getItem('openid');
		if( register === 1 ){
			// alert('授权成功')
			_this.Ajax({
				url : '/user/loginByOpenId',
				type : 'get',
				data : {
					openId : openId,
					from : 0
				},
				success : function(res){
					if( res.code == 200 ){
						callback();
					}
				}
			})
		}else if( register === 0 ){
			// alert('去注册页')
			_this.Ajax({
				url : '/user/h5/register',
				type : 'get',
				success : function(res){
					if( res.code == 200 ){
						// callback();
						// return false;
						window.location.href = res.data;
					}
				}
			})
		}else{
			callback();
		}
	}
}