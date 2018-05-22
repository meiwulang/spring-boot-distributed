var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
// $("#footer").load("index_footer.html?t="+_TimeStamp);

$(function() {

	//防止页面后退
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });

	if (_uinfo) {
		$('.rp_name').html(_uinfo.u_realname);
		$('#rp_username').val(_uinfo.u_realname);
		$('.rp_business').html(_uinfo.org_name);
	}

	if (_uinfo && _uinfo.passType == 0) {
		window.location.href = 'index.html';
	}
	$('#sub').on('click', function() {
		var rp_def = $('#rp_def').val();
		var rp_new = $('#rp_new').val();
		var rp_sure = $('#rp_sure').val();
		if ( $.trim(rp_def)) {
			if (rp_new) {
				if ( $.trim(rp_def) != $.trim(rp_new)) {
					if ( $.trim(rp_new) == $.trim(rp_sure)  ) {
						getUpdatePassData();
					} else{
						$.MsgBox({ 
							type: "alert", 
							title: '错误', 
							msg: '两次密码输入不一致', 
							speed: 200 
						});
					}
				}else{
					$.MsgBox({ 
						type: "alert", 
						title: '错误', 
						msg: '新密码不能与旧密码一致', 
						speed: 200 
					});
				}
				
			} else{
				$.MsgBox({ 
					type: "alert", 
					title: '错误', 
					msg: '请输入新密码', 
					speed: 200 
				});
			}
		} else{
			$.MsgBox({ 
				type: "alert", 
				title: '错误', 
				msg: '请输入原始密码', 
				speed: 200 
			});

		}
		
	});
});	
function getUpdatePassData() {
	var id = _uinfo.u_id;
	var rp_def = $('#rp_def').val();
	var rp_new = $('#rp_new').val();

	var getUpdatePassUrl = '/b2b/user/updatePass';
	ajaxRequest(getUpdatePassUrl, 'POST', {
		u_id : id,
		u_password : rp_new, 
		u_old : rp_def,
		passType : '1'
	}, function(ret) {
		

		if(ret.code == 200) {
			 $.MsgBox({ 
			 	type: "confirm", 
			 	title: '提示', 
			 	msg: ret.message, 
			 	speed: 200,
			 	callback: function() {

					window.location.href = 'index.html';
                    }
			 });
			 
		} else {
			$.MsgBox({ type: "alert", title: '错误', msg: ret.message, speed: 200 });
		}
	});
}

