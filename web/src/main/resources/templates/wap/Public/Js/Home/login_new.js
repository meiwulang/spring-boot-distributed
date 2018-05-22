/**
 * Created by mark pony on 2017/6/15.
 */
$(function () {
    if( window.top.location != window.location ){
        window.top.location.href = window.location.href;
    }
    $('.loginType').click(function () {
        $('.form1').slideToggle(500);
        $('.form3').slideToggle(500);
        $('.message_tip').empty();
    });

    $('.rembPwd').click(function () {
        $(this).find('span').toggleClass('checked');
    });

    $('.getCode').on('click', function () {
        if (!verify_mobile($.trim($('#u_mobile').val()))){
            $('#u_mobile').focus();
            message('请填写正确的手机号码！!');
            return false;
        }
        if ($('#getCode').hasClass('disable')) {
            return false;
        }
        sendCheckCode();
    });

    //监听回车事情
    $('#uname,#upass').on('keydown',function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            login();
        }
    })
    // document.onkeydown = function(e){
    //     var ev = document.all ? window.event : e;
    //     if(ev.keyCode==13) {
    //         login();
    //     }
    // }

    //记住密码初始化
    if(localStorage.getItem("rmbCk") == "true") {
        $("#login_checkbox").addClass('checked');
        $("#uname").val(localStorage.getItem("uname"));
        $("#upass").val(localStorage.getItem("upwd"));
    }else{
        $("#uname").val("");
        $("#upass").val("");
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
    var verify_code = $('#u_check_code').val();
    var data = {'uname': u_name, 'upass': u_pass, 'verify_code': verify_code};
    if ($('.form3').is(':visible')) {
        data = {'uname': u_mobile, 'u_code': u_code};
        if (u_mobile == ''||!verify_mobile(u_mobile)) {
            $('#u_mobile').focus();
            message('请填正确的手机号码');
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
            message('密码不能为空');
            return;
        }

        if ($('#u_check_code').is(':visible')) {
            if (verify_code == '') {
                $('#u_check_code').focus();
                message('请输入验证码');
                return;
            }
        }
    }
    ajaxRequest(url, 'POST', data, function (ret) {
        if (ret.code == 200 && ret.data) {
            var city_code = ret.data.org_city_code;
            var htmlw = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + ret.data.u_realname + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + ret.data.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://help.jdytrip.cn' target='_blank'>帮助中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://app.jdytrip.cn' target='_blank'>应用市场</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"
            var htmlt = "<div class='pull-right'><div class='pull-left'><span>欢迎您!</span><span class='hotsoso' id='user_name'>" + ret.data.u_realname + "</span></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><span>" + ret.data.org_sname + "</span> </div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='/index/main.shtml' target='_blank'>管理中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://test.help.jdytrip.cn' target='_blank'>帮助中心</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='http://test.app.jdytrip.cn' target='_blank'>应用市场</a></div><span class='pull-left'>&nbsp;&nbsp;|&nbsp;&nbsp;</span><div class='pull-left'><a href='logout.html'>安全退出</a></div></div>"

            
            saveCookie(ret);
            savePass();
            if($('#myModal').length > 0){
                if (window.location.host == "www.jdytrip.cn") {
                    $(".my_navbar .pull-right").html(htmlw);
                } else {
                    $(".my_navbar .pull-right").html(htmlt);
                }
                $(".pri_b").css("display", "block");
                $(".log_width").css("width", "40%");
                $(".log_block").css("display", "block");
                $(".log_bottom").css("display", "block");
                $(".travel").css("width", "90px");

                $(".raid span").css("display", "none");
                $(".raid a").css("display", "none");
                $(".sp span").css("display", "none");
                var html = "<span> <span class='colorb'>欢迎你！&#x3000;</span>" + ret.data.u_realname + "</span>";
                $(".adde").html(html);
                $(".price_pr").css("display", "block");
                $(".priceOver").css("display", "block");
                $('#myModal').modal('hide');
                if( typeof getCityData != 'undefined' ){
                    getCityData(city_code);
                }
                $('.contactCustomer').show();
                $('.detail_eye').show();
                if (ret.data.passType == 1) {
                    window.location.href = 'rePwd.html';
                }
            }else {
                window.location.href = '/?city_code=' + city_code;
            }
            var urls = window.location.pathname;
            var log = sessionStorage.getItem("order_log");
            if(urls == "/order.html" && log == "logs"){
                window.location.reload();
            }else if(urls == "/register0.html"){
                window.location.href = 'index.html';
            }else if (urls == '/detail.html' || urls == '/company.html') {
                window.location.reload();
            }
            $('.businessLink').attr('href','business.html');
        } else {
            $('.message_tip').empty();
            $('.code').show();
            message(ret.message);
        }
    });
}


/**
 * 验证手机号码
 */
function verify_mobile(u_mobile){
    var reg=/^1[34578][0-9]{9}$/;
    return reg.test(u_mobile);
}
/**
 * 保存用户cookie信息
 * @param ret
 */

function saveCookie(ret) {
    $.getScript(ApiUrl + '/common/getConst.shtml');
    addcookie('user_id', ret.data.u_id, 36000);
    addcookie('myname', ret.data.u_realname, 36000);
    addcookie('org_sname', ret.data.org_sname, 36000);
    addcookie('org_id', ret.data.u_org_id, 36000);
    addcookie('city_code',ret.data.org_city_code, 36000);
    addcookie('city_name',ret.data.org_city, 36000);
}

/**
 * 缓存帐号信息
 */
function savePass() {
    if ($("#login_checkbox").attr('class') == 'checked') {
        var username = $("#uname").val();
        var password = $("#upass").val();
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
    var phone = $.trim($('#u_mobile').val());
    var data = {source: 'm', phone: phone};
    ajaxRequest(url, 'get', data, function (ret) {
        if (ret.code == 200) {
            setTime();
            $('#getCode').addClass('disable');
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