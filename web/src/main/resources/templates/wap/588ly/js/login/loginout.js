var url_type = GetQueryString('type');
ajaxRequest('/user/mobileLogout','GET', '', function (ret) {
	if(ret.data&&ret.code==200){
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
				delCookie('user_city_code');
				delCookie('user_org_type');
				/*delCookie('city_code');
				delCookie('city_name');*/
				if(url_type){
				   window.location.href='http://' + window.location.host + '/588ly/index.html';
				}else{
				   history.back();
				}
			}
		});
	}else{
		$.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
	}
	
});