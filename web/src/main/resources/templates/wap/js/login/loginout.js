var url_type = GetQueryString('type');
ajaxRequest('/user/mobileLogout','GET', '', function (ret) {
	if(ret.data&&ret.code==200){
		var date = new Date();
		var t = date.getTime();
	   	$.MsgBox({
	   		type:"alert",
	   		title: '注销',
	   		msg:'注销成功！',
	   		speed:200,
	   		callback:function(){
				delCookie('user_id');
				delCookie('org_sname');
				delCookie('myname');
				delCookie('org_id');
				delCookie('detail_org_id');
				/*delCookie('city_code');
				delCookie('city_name');*/
				if(url_type){
				   window.location.href='http://' + window.location.host;
				}else{
				   history.back();
				}
			}
		});
	}else{
		$.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
	}
	
});