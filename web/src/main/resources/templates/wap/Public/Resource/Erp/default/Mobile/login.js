$(function(){
    /*登录页面js start*/
    $("#logSubmit").click(function(){
        var f_name=$("#f_name");
        var f_pwd=$("#f_pwd");
        var f_url=$("#f_url");
        if(f_name.val()==""){
            $.alert({msg:"用户名/手机号不能为空"});
            return;
        }
        if(f_pwd.val()==""){
            $.alert({msg:"密码不能为空2"});
            return;
        }
        var param={};
        var pwd=f_pwd.val();
        var name=f_name.val();
        var url=f_url.val();
        var s='';
        param={uname:name,upass:pwd,source:'wap',url:url};
        $.loding({time:-1});
        $.ajax({
            url:$__app__ + "/Mobile/login_check",
            type:"POST",
            data:param,
            success:function(msg){
                var row = msg;
                if (typeof msg != 'object') row = eval("(" + msg + ")");
                $.loding({close:true});
                if(row.status==1){
                    if(row.info.bind_flag){
                        $.confirm({
                            msg:'是否将该微信号与此账号绑定?',
                            ok:function(){
                                window.location.href=row.info.url;
                            },
                            cancel:function(){
                                window.location.href=row.info.redirect_url;
                            }
                        })
                    }else{
                        $.toast({
                            msg:'登录成功',
                            time:1000,
                            callback:function(){
                                window.location.href=row.info.redirect_url;
                            }
                        })
                    }
                }else{
                    $.toast({
                        msg:row.info,
                        time:1000
                    })
                }
            },
            error:function(){
                $.loding({close:true});
                $.toast({
                    msg:'传输错误，请重试',
                    time:1000
                })
            }
        })
    });
})
