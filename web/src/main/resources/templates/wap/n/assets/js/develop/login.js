import '@/assets/less/develop/login.less';
import $ from 'jquery';
import _ from '@/assets/js/common/global.js';
import Common from '@/assets/js/common/common.js';


function Start() {
	this.Init();
}

Start.prototype = {
	Init : function(){
		let _this = this;
		_this.Rem();
		$('#submit').on('click',function(){
			_this.Submit();
		})
	},
	Rem : function(){
		$('.username input').val('');
		$('.password input').val('');

		$(".reme").on("click",function(){
			$(".reme").toggleClass("active");
		})
		var name = localStorage.getItem("b-uname");
		var pass = localStorage.getItem("b-upass");
		if(name && pass){
			$('.username input').val(name);
			$('.password input').val(pass);
			$(".reme").addClass("active");
		}

	},
	Submit : function(){
		let uname = $.trim($('.username input').val()),
			upass = $.trim($('.password input').val());

		if( !uname ){
			_.Popup.Tip('请输入正确的用户名');
			return false;
		}

		if( !_.RegEx.Password(upass) ){
			_.Popup.Tip('请输入正确的密码');
			return false;
		}
		_.Ajax({
			url : '/user/distAdminLogin',
			type : 'post',
			data : {
				uAccount : uname,
				uPassword : upass
			},
			success : function(res){
				if( res.code == 200 ){
					console.log(res)
					if($(".reme").hasClass("active")){
						localStorage.setItem("b-uname",uname);
						localStorage.setItem("b-upass",upass);
					}else{
						localStorage.setItem("b-uname",'');
						localStorage.setItem("b-upass",'');
					}
					localStorage.setItem('uDataLimit',res.data.uDataLimit.toString());//0:用户级 1:部门级2:单位级3:系统级
					localStorage.setItem('uDepartmentId',res.data.uDepartmentId);
					localStorage.setItem('uRealName',res.data.uRealName);
					localStorage.setItem('uPic',res.data.uPic);
					localStorage.setItem('uPost',res.data.uPost);
					localStorage.setItem('cName',res.data.cName);
					localStorage.setItem('dName',res.data.dName);
					localStorage.setItem('uRealName',res.data.uRealName);
					window.location.href = 'list.html';
				}else{
					_.Popup.Tip(res.message);
				}
			}
		})
	}
}

Common.Ready(function(){
	new Start();
})