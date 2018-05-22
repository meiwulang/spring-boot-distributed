var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
$("#footer").load("index_footer.html?t="+_TimeStamp);
function gostep(step) {
	if(step == 1) {
		$("#jdy_one").css('display', 'block')
		$("#jdy_two").css('display', 'none')
		$("#jdy_there").css('display', 'none')
		$(".hexagonal").removeClass('active')
		$('#fist_background').addClass('active')
	} else if(step == 2) {
		$("#jdy_one").css('display', 'none')
		$("#jdy_two").css('display', 'block')
		$("#jdy_there").css('display', 'none')
		$(".hexagonal").removeClass('active')
		$('#two_background').addClass('active')
	} else if(step == 3) {
		//alert(1)
		$("#jdy_one").css('display', 'none')
		$("#jdy_two").css('display', 'none')
		$("#jdy_there").css('display', 'block')
		$(".hexagonal").removeClass('active')
		$("#submit_audit").addClass('active')

	}
}
//获取验证码
function update_p(num, t) {
	if(num == t) {
		$("#submit").text(" 重新发送验证码");
		$("#submit").attr("disabled", false);

	} else {
		printnr = t - num;
		$('#submit').text(" (" + printnr + ")秒重新发送");
	}
}

function showtime(t) {
	for(i = 1; i <= t; i++) {
		window.setTimeout("update_p(" + i + "," + t + ")", i * 1000);
	}
}

function getUsersendcheckcodeData() {
	var mobile = $('input[name="input_mobieRegister"]').val();
	var getusersendcheckcodeUrl = '/front/b2b/user/sendcheckcode';
	ajaxRequest(getusersendcheckcodeUrl, 'GET', {
		phone : mobile ,
		type : 'fpwd'
	}, function(ret) {
		if(ret.code == 200) {
			showtime(120);
			$('#submit').attr("disabled", true);
			$('#sub').attr("disabled", false);
		} else {
			$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
			$('#submit').attr("disabled", false);
			$('#sub').attr("disabled", true);
		}

	});
}
$("#submit").on('click', function() {
	var mobile = $('input[name="input_mobieRegister"]').val();
	if(!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
		$("#hin p").html("请输入11位正确手机号！");
		$('input[name="input_mobieRegister"]').focus();
		return false;
	} else {
		getUsersendcheckcodeData();
	}

});
//
$(function() {

	//第一步提交 第一步页面隐藏 第二步页面显示点击下一步
	$('#sub').on('click', function() {
		mobile = $('input[name="input_mobieRegister"]').val(); //手机号
		var hin_p = $("#hin p");
		if(!$.trim(mobile)) {
			hin_p.html("手机号不能为空！");
			$('input[name="input_mobieRegister"]').focus();
			return false;
		};

		if(!/(^0?[1][34857][0-9]{9}$)/.test(mobile)) {
			hin_p.html("请输入11位正确手机号！");
			$('input[name="input_mobieRegister"]').focus();
			return false;
		} else {
			hin_p.html("");
		};

		var yzmRegister = $('#input_yzmRegister').val();
		if(!$.trim(yzmRegister)) {
			$.MsgBox({ type: "alert", title: '错误', msg: '请输入验证码！', speed: 200 });
			$('#input_yzmRegister').focus();
			return false;
		} else {
			var verifycheckcodeUrl = '/b2b/user/verifycheckcode';
			ajaxRequest(verifycheckcodeUrl, 'GET', {
				phone : mobile,
				check_code : yzmRegister,
				type : 'pwd'
			}, function(ret) {
				var data = ret.data;
				if(ret.code == 200) {
					tokens = data.token;
					gostep(2);
				} else {
					$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
					$('#input_yzmRegister').focus();
					return false;
				}

			})
		}
	});
	var second = 5;
	function showTime1() {
		if(second == 0) {
			window.location = "index.html";
			clearInterval(time);
		}
		$("#time").html(second);
		second--;
	}

	function getUpDateUserPassData() {
		var getupdateUserPassUrl = '/b2b/user/updateUserPass';
		ajaxRequest(getupdateUserPassUrl, 'GET', {
			phone : mobile,
			pwd : u_pass, 
			check_code : tokens
		}, function(ret) {
			if(ret.code == 200) {
				gostep(3);
				
				time = setInterval(showTime1, 1000);
			} else {
				$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
			}
		});
	}

	function regPwd() {
		mobile = $('input[name="input_mobieRegister"]').val() //手机号
		u_pass = $('input[name="input_passwordRegister"]').val() //密码
		var passwordReg_p = $("#passwordReg p");
		if(!$.trim(u_pass)) {
			passwordReg_p.html("密码不能为空！");
			$('input[name="input_passwordRegister"]').focus();
			return false;
		}
		if(!/^[a-zA-Z0-9]{6,20}$/.test(u_pass)) {
			passwordReg_p.html("请输入6~20位密码!(数字或字母)");
			$('input[name="input_passwordRegister"]').focus();
			return false;
		} else {
			passwordReg_p.html("")
		};

		repassword = $('input[name="input_passwordConfirm"]').val(); //确认密码
		var repassword_p = $("#repassword p");
		//				var u_pass = $('input[name="input_passwordRegister"]').val() //密码
		if(!$.trim(repassword)) {
			repassword_p.html("确认密码不能为空！");
			$('input[name="input_passwordRegister"]').focus()
			return false;
		}
		if(repassword == u_pass) {
			repassword_p.html("");
			getUpDateUserPassData();
		} else {
			repassword_p.html("两次密码不一样！");
			$('input[name="input_passwordRegister"]').focus()
			return false;
		}

	}

	//改变新密码
	$('#reg').on('click', function(ev) {
		ev.preventDefault();
		regPwd();
	});

});