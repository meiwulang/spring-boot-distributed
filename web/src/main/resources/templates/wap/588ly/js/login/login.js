$(document).ready(function() {
	if(localStorage.getItem("rmbCk") == "true") {
		$("#login_checkbox").attr("checked", true);
		$("#uname").val(localStorage.getItem("uname"));
		$("#upwd").val(localStorage.getItem("upwd"));
	}

});

function save() {

	if($("#login_checkbox").prop("checked")) {
		var username = $("#uname").val();
		var password = $("#upwd").val();
		localStorage.setItem("uname", username);
		localStorage.setItem("upwd", password);
		localStorage.setItem("rmbCk", "true");
	} else {
		localStorage.setItem("rmbCk", "false");
		localStorage.setItem("uname", "");
		localStorage.setItem("upwd", "");

	}
};

function userLogin() {

	var uname = $('#uname').val();
	var upwd = $('#upwd').val();
	var reg = /^[a-zA-Z0-9_]{3,16}$/;
	var userLoginUrl = '/user/mobileLogin';
	var datas = { 'uname': uname, 'upass': upwd };
	ajaxRequest(userLoginUrl, 'POST', datas, function(ret) {

		            // console.log(JSON.stringify(ret))
		if(ret.data && ret.code == 200) {
			if(ret.data.u_nickname == 0) {
				var u_name = ret.data.u_realname;
			} else {
				u_name = ret.data.u_nickname
			};
			$(".pri_b").css("display", "block");
			$(".log_width").css("width", "40%");
			$(".log_block").css("display", "block");
			$(".log_bottom").css("display", "block");
			$(".travel").css("width", "90px");

			$(".raid span").css("display", "none");
			$(".raid a").css("display", "none");
			$(".sp span").css("display", "none");
			var html = "<span> <span class='colorb'>欢迎你！&#x3000;</span>" + u_name + "</span>";
			$(".adde").html(html);
			$(".price_pr").css("display", "block")
			$(".priceOver").css("display", "block");

			// var html = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + u_name + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + ret.data.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://help.jdytrip.cn' target='_blank'>帮助中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>";

			// $(".my_navbar .pull-right").html(html);

			var htmlw = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + u_name + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + ret.data.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://help.jdytrip.cn' target='_blank'>帮助中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"
			var htmlt = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + u_name + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + ret.data.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://test.help.jdytrip.cn' target='_blank'>帮助中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"

			if (window.location.host == "www.jdytrip.cn") {
				$(".my_navbar .pull-right").html(htmlw);
			} else {
				$(".my_navbar .pull-right").html(htmlt);
			}

			$('#myModal').modal('hide');
			$.getScript(ApiUrl + '/common/getConst.shtml');
			addcookie('user_id', ret.data.u_id, 36000);
			addcookie('myname', u_name, 36000);
			addcookie('org_sname', ret.data.org_sname, 36000);
			addcookie('org_id', ret.data.u_org_id, 36000);
			addcookie('org_type', ret.data.org_type, 36000);
			addcookie('city_code',ret.data.org_city_code);
			addcookie('city_name',ret.data.org_city);
			var city_code = ret.data.org_city_code;
			if( typeof getCityData != 'undefined' ){
				getCityData(city_code);
			}
			//列表页面显示同行价
			save();

			addcookie('user_city_code',ret.data.org_city_code);
			addcookie('user_org_type',ret.data.org_type);

			// 无锡和苏州不能选地址
			var user_city_code = getCookie('user_city_code');
			var user_org_type = getCookie('user_org_type');
			if( (user_city_code == '320200' || user_city_code == '320500' || user_city_code == '320400') && user_org_type == '分销商' ){
				$('.vertMiddle').hide();
			}else{
				$('.vertMiddle').show();
			}
			$('.detail_eye').show();
			window.location.reload();

			// console.log(ret.data);
			// if (ret.data.passType == 1) {
   //              window.location.href = 'rePwd.html';
   //          }

		} else {
			//              $.MsgBox({type: "alert", title: '错误', msg: ret.message, speed: 200});

			if(reg.test(uname) == false) {
				$('.megF').html("请输入正确的用户名与密码或账户已被锁定！");
				$('#uname').focus(function() {
					$('.megF').html(" ");
					$('#uname').val("");
				});
				return false;
			};

			if(reg.test(upwd) == false) {
				$('.megF').html("请输入正确的用户名与密码或账户已被锁定！");
				$('#upwd').focus(function() {
					$('.megF').html(" ");
				})
				return false;
			};
			$('.megF').html("请输入正确的用户名与密码或账户已被锁定！");
		};

	});

};
$(".close").click(function() {
	$('.megF').html("");
	$('#uname').val("");
	$('#upwd').val("");
});

$('#myModal').keydown(function() {
	if('13' == event.keyCode) {
		userLogin();
	}
});