// desc : 全局cookie值操作
// author : zhupinglei
// 344184416@qq.com

export default {
	Add : function(name, value, expireHours){
		var cookieString = name + "=" + escape(value) + "; path=/";
		//判断是否设置过期时间  
	    if (expireHours > 0) {
	        let date = new Date();
	        date.setTime(date.getTime + expireHours * 3600 * 1000);
	        cookieString = cookieString + "; expire=" + date.toGMTString();
	    }
	    document.cookie = cookieString;
	},
	Get : function(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	    if (arr = document.cookie.match(reg)){
	        return unescape(arr[2]);
	    }else{
	        return null;
	    }
	},
	Del : function(name){
		let exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    let cval = this.Get(name);
	    if (cval != null) {
	    	document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
	    }
	}
}