/**
 * Created by mark pony on 2017/6/15.
 */
$(function () {
    $('.loginType').click(function () {
        $('.form1').slideToggle(500);
        $('.form3').slideToggle(500);
        $('.message_tip').empty();
    });

    $('.rembPwd').click(function () {
        $(this).find('span').toggleClass('checked');
    });

    $('.getCode').on('click', function () {
        if ($('#u_mobile').val() == '') {
            $('#u_mobile').focus();
            message('手机号码不能为空！');
            return false;
        }
        if ($('#getCode').hasClass('disable')) {
            return false;
        }
        sendCheckCode();
    });

    //监听回车事情
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            login();
        }
    }

    //记住密码初始化
    if(localStorage.getItem("rmbCk") == "true") {
        $("#login_checkbox").addClass('checked');
        $("#uname").val(localStorage.getItem("uname"));
        $("#upwd").val(localStorage.getItem("upwd"));
    }else{
        $("#uname").val("");
        $("#upwd").val("");
    }

    $('#upass').keyboard({
        lang:'en'
    });

});


/**
 * 用户登录
 */
function login() {
    var url = '/user/mobileLogin';
    var u_name = $.trim($('#uname').val());//用户名过滤空格
    var u_pass = $('#upass').val();
    var u_mobile = $.trim($('#u_mobile').val());
    var u_code = $('#u_code').val();
    var u_check_code = $('#u_check_code').val();
    var data = {'uname': u_name, 'upass': u_pass, 'check_code': u_check_code};
    if ($('.form3').is(':visible')) {
        url = "/user/mobileSMSLogin_login";
        data = {'u_mobile': u_mobile, 'u_code': u_code};
        if (u_mobile == '') {
            $('#u_mobile').focus();
            message('请填手机号码');
            return;

        } else if (u_code == '') {
            $('#u_code').focus();
            message('请填验证码');
            return;
        }
    } else {
        if (u_name == '') {
            $('#uname').focus();
            message('用户名不能为空');
            return;

        } else if (u_pass == '') {
            $('#upass').focus();
            message('密码不能为空.');
            return;
        }

        if ($('#u_check_code').is(':visible')) {
            if (u_check_code == '') {
                $('#u_check_code').focus();
                message('请输入验证码');
                return;
            }
        }
    }
    ajaxRequest(url, 'POST', data, function (ret) {
        if (ret.code == 200 && ret.data) {
            var city_code = ret.data.org_city_code;
            saveCookie(ret);
            savePass();
            window.location.href = '/?city_code=' + city_code;
        } else {
            $('.message_tip').empty();
            $('.code').show();
            message(ret.message);
        }
    });
}


/**
 * 保存用户cookie信息
 * @param ret
 */

function saveCookie(ret) {
    addcookie('user_id', ret.data.u_id, 36000);
    addcookie('myname', ret.data.u_name, 36000);
    addcookie('org_sname', ret.data.org_sname, 36000);
    addcookie('org_id', ret.data.u_org_id, 36000);
}

/**
 * 缓存帐号信息
 */
function savePass() {
    if ($("#login_checkbox").attr('class') == 'checked') {

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


/**
 * 发送短信验证码
 */
function sendCheckCode() {
    var url = '/front/b2b/user/sendcheckcode';
    var phone = '13866665747';
    var data = {source: 'm', phone: phone};
    ajaxRequest(url, 'get', data, function (ret) {
        if (ret.code == 200) {
            setTime();
            $('#getCode').addClass('disable');
            message('短信验证码发送成功!');
        } else {
            message(ret.message);
        }
    });
}


/**
 * 发送短信验证码倒计时
 */
var countDown = 60;
function setTime() {
    if (countDown == 0) {
        $('.getCode').html('重新发送');
        $('#getCode').removeClass('disable');
        countDown = 60;
        return;
    } else {
        $('.getCode').html(countDown + '秒');
        countDown--;
    }
    setTimeout(function () {
        setTime()
    }, 1000)
}

/**
 * 提示信息
 * @param tip 提示内容
 */
function message(tip) {
    $('.message_tip').html(tip);
}

/**
 * 刷新图形验证码
 */
function changeVerify() {
    $('#verify_code').attr('src', '/b2b/user/get_verify');
}