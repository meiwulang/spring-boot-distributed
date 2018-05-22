var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
 $("#footer").load("index_footer.html?t="+_TimeStamp);
 $("#pactmo").load("PactModal.html?t="+_TimeStamp);
 $("#login_mask").load("login.html?t="+_TimeStamp);
//  $('.business_type').on('click', function () {
//      $(this).parent().find('.ion_select').removeClass('ion_selected')
//      $(this).find('.ion_select').addClass('ion_selected')
//      var text = $(this).find('.ion_select').attr('data-text')
//
//      $('#business_type').val(text)
//
//
//  })
    
    $(".ion_o").on("click",function(){
        $(".ionos").css("display","block");
        $(".ionws").css("display","");
        $(".war_o").html("");
        $(".togg").css("display","");
        $(".ion_se").removeClass("ion_selected");
        $('input[name="input_lun"]').val("");
        $("#launch .two_act .active").removeClass("active")
    })
    $(".ion_w").on("click",function(){
        $(".ionos").css("display","");
        $(".ionws").css("display","block");
        $(".war_o").html("*")
        $(".togg").css("display","block")
    })

    $("#city_t").on("click",function(e){
        e.stopPropagation()
        $(".clear_th").css("display","block");
        $("#launch").css("display","block")
    })
    //所在城市
    $(function () {
        
        function cii(leve,pid){
            var level = leve;
            var pid = pid;
            $.ajax({
                url: ApiUrl + "/b2b/business/getCityList?level=" + level + '&pid=' + pid,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (result) {
                    if (result.code == 200) {
                        var html = '';
                        for(var i = 0;i < result.data.length; i++){
                            html += '<a pid="' + result.data[i].id + '">' + result.data[i].name + '</a>';
                        }
                        if(leve == 1){
                            $(".city1").html(html);
                        }else if(leve == 2){
                            $(".city2").html(html);
                        }else if(leve == 3){
                            $(".city3").html(html);
                        }
                        $(".city1 a").off().on("click",function(e){
                            e.stopPropagation();
                            $("#org_pc").val($(this).html());
                            $(".ty1").val($(this).html());
                            $(".ty2").val("");
                            $(".ty3").val("");
                            $(".city1 a").removeClass("active");
                            $(this).addClass("active");
                            var pid = $(this).attr("pid");
                            cii(2,pid);
                            $(".city_fa_ul li").removeClass("active");
                            $(".city_fa_ul li").eq("1").addClass('active');
                            $(".cii").removeClass("zin");
                            $(".cii").eq("1").addClass("zin");

                        })
                        $(".city2 a").off().on("click",function(e){
                            e.stopPropagation();
                            $("#org_pc").val($(".city1 .active").html() + '-' + $(this).html());
                            $(".ty2").val($(this).html());
                            $(".ty3").val("");
                            $(".city2 a").removeClass("active");
                            $(this).addClass("active");
                            var pid = $(this).attr("pid");
                            cii(3,pid);
                            $(".city_fa_ul li").removeClass("active");
                            $(".city_fa_ul li").eq("2").addClass('active');
                            $(".cii").removeClass("zin");
                            $(".cii").eq("2").addClass("zin");
                            
                        })
                        $(".city3 a").off().on("click",function(e){
                            e.stopPropagation();
                            $("#org_pc").val($(".city1 .active").html() + '-' + $(".city2 .active").html() + '-' + $(this).html());
                            $(".ty3").val($(this).html());
                            $(".city3 a").removeClass("active");
                            $(this).addClass("active");
                            $(".city1").html('');
                            $(".city2").html('');
                            $(".city3").html('');
                            $(".city_fa").hide();
                            
                        })
                    } else {
                        $.MsgBox({type: "alert", title: '错误', msg: result.message, speed: 200});
                    }
                }
            });
        }
        $("#org_pc").on("click",function(e){
        e.stopPropagation();
        $(".city_fa_ul li").removeClass("active");
        $(".city_fa_ul li").eq("0").addClass('active');
        $(".cii").removeClass("zin");
        $(".cii").eq("0").addClass("zin");
        $(".city2").html('');
        $(".city3").html('');
        $(".city_fa").show();
        cii(1);
        })
        $(".city_fa .clear").on("click",function(e){
            e.stopPropagation();
            $(".city_fa").hide();
        })
        $(".city_fa_ul li").on("click",function(e){
            e.stopPropagation();
            $(".city_fa_ul li").removeClass('active');
            $(this).addClass('active');
            var _index = $(this).index();
            $(".cii").removeClass("zin");
            $(".cii").eq(_index).addClass("zin");
        })
        $(".city_fa").on("click",function(e){
            e.stopPropagation();
        })
        $(window).on("click",function(){
            $(".city_fa").hide();
        })
    });
    // //选择投放地区
    // $("#launch .two_act span").on("click",function(){
    //     var arra = [];
    //     $(this).toggleClass("active")
    //     var $length_lun = $(".two_act .active").length
    //     for(var i =0;i < $length_lun;i++){
    //         var cit = $(".two_act .active").eq(i).html()
    //         arra.push(cit)  
    //     }
    //     $('input[name="input_lun"]').val(arra.join(","));
    //     // console.log(arra)
        
    // })
    function gostep(step) {
        if (step == 1) {
            $("#jdy_one").css('display', 'block')
            $("#jdy_two").css('display', 'none')
            $("#jdy_there").css('display', 'none')
            $(".hexagonal").removeClass('active')
            $('#fist_background').addClass('active')
        } else if (step == 2) {
            $("#jdy_one").css('display', 'none')
            $("#jdy_two").css('display', 'block')
            $("#jdy_there").css('display', 'none')
            $(".hexagonal").removeClass('active')
            $('#two_background').addClass('active')
        } else if (step == 3) {
            //alert(1)
            $("#jdy_one").css('display', 'none')
            $("#jdy_two").css('display', 'none')
            $("#jdy_there").css('display', 'block')
            $(".hexagonal").removeClass('active')
            $('#submit_audit').addClass('active')

        }
    }


    $(function () {
        //第一步提交 第一步页面隐藏 第二步页面显示
        $('#sub').click(function () {
            var mobile = $('input[name="input_mobieRegister"]').val();//手机号
            var hin_p=$("#hin p");
            if (!$.trim(mobile)) {
                hin_p.html("手机号不能为空！");
                $('input[name="input_mobieRegister"]').focus();
                return false;
            };

            if (!/(^0?[1][34857][0-9]{9}$)/.test(mobile)) {
                hin_p.html("请输入11位正确手机号！");
                $('input[name="input_mobieRegister"]').focus();
                return false;
            } else {
                hin_p.html("");
            };


            var u_pass = $('input[name="input_passwordRegister"]').val();//密码
            var passwordReg_p=$("#passwordReg p");
            if (!$.trim(u_pass)) {
                passwordReg_p.html("密码不能为空！");
                $('input[name="input_passwordRegister"]').focus();
                return false;
            }
            if (!/^[a-zA-Z0-9]{6,20}$/.test(u_pass)) {
                passwordReg_p.html("请输入6~20位密码!(数字或字母)");
                $('input[name="input_passwordRegister"]').focus();
                return false;
            } else {
                passwordReg_p.html("")
            };

            var repassword = $('input[name="input_passwordConfirm"]').val();//确认密码
            var repassword_p=$("#repassword p");
            var u_pass = $('input[name="input_passwordRegister"]').val()//密码
            if (repassword == u_pass) {
                repassword_p.html("");
            } else {
                repassword_p.html("两次密码不一样！");
                $('input[name="input_passwordRegister"]').focus()
                return false;
            }
            if (!$.trim(repassword)) {
                repassword_p.html("确认密码不能为空！");
                $('input[name="input_passwordRegister"]').focus()
                return false;
            }

            var business_type = $('.ion_selected').parent().find('.business_type_cls').val();
            if (!business_type) {
                $("#business_text p").html("请选择商家类型！");
                return false;
            }


            var com_name = $('input[name="input_company_nameRegister"]').val()//公司名称
            if (!$.trim(com_name)) {
                $("#com_name p").html("公司名称不能为空！");
                $('input[name="input_company_nameRegister"]').focus()
                return false;
            } else {
                $("#com_name p").html("");
            }
            
            var com_name = $('input[name="input_company_name"]').val()//公司简称
            if (!$.trim(com_name)) {
                $("#com_sname p").html("公司名称不能为空！");
                $('input[name="input_company_name"]').focus()
                return false;
            } else {
                $("#com_sname p").html("");
            }
            
            var org_province = $('.ty1').val()//省
            var org_city = $('.ty2').val()//市
            var org_county = $('.ty3').val()//区县
            if (!$.trim(org_province) || !$.trim(org_city) || !$.trim(org_county)) {
                $("#org_pcc p").html("省、市、区、县选择不完整！");
                $('input[name="org_pcc"]').focus()
                return false;
            } else {
                $("#org_pcc p").html("");
            }

            var org_add = $('input[name="org_addr"]').val()//详细地址
            if (!$.trim(org_add)) {
                $("#org_add p").html("公司地址不能为空！");
                $('input[name="org_addr"]').focus()
                return false;
            } else {
                $("#org_add p").html("");
            }

            var org_legal = $('input[name="org_legal"]').val()//联系人
            if (!$.trim(org_legal)) {
                $("#legal p").html("联系人不能为空！");
                $('input[name="org_legal"]').focus()
                return false;
            } else {
                $("#legal p").html("");
            }
            var org_tel = $('input[name="org_tel"]').val()//固定电话
            if (!$.trim(org_tel)) {
                $("#org_tel p").html("固定电话不能为空！");
                $('input[name="org_tel"]').focus()
                return false;
            } else {
                $("#org_tel p").html("");
            }

            var org_email = $('input[name="org_email"]').val()//邮箱
            if (!$.trim(org_email)) {
                $("#org_email p").html("邮箱不能为空！");
                $('input[name="org_email"]').focus()
                return false;
            } else {
                $("#org_email p").html("");
            }

            if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(org_email)) {
                $("#org_email p").html("请输入正确的邮箱格式！");
                $('input[name="org_email"]').focus();
                return false;

            } else {
                $("#org_email p").html("")

            }
            var yzmRegister = $('#input_yzmRegister').val();
            if (!$.trim(yzmRegister)) {
                $.MsgBox({type: "alert", title: '错误', msg: '请输入验证码！', speed: 200});
                $('#input_yzmRegister').focus();
                return false;
            } else {
                var verifycheckcodeUrl = '/b2b/user/verifycheckcode?phone=' + mobile + '&check_code=' + yzmRegister
                ajaxRequest(verifycheckcodeUrl, 'GET', '', function (ret) {
                    if (ret.code == 200) {
                        gostep(2)
                    } else {
                        $.MsgBox({type: "alert", title: '错误', msg: ret.message, speed: 200});
                        $('#input_yzmRegister').focus();
                        return false;
                    }
                })
            }
        });


        //商户类型
        $(".ion_sele").click(function () {
            $(".hotsoso").removeClass("models");
            $(".hotsoso").attr("data-toggle","modal");
            $(".ion_sele").removeClass("ion_selected");
            $(this).addClass("ion_selected");
//          var type = $('.business_selected .ion_selected').next().val()//单位类型
//          console.log(type)
        });
        //产品类型
        $(".ion_se").click(function () {
            $(this).toggleClass("ion_selected");
            
        });
        //显示分销商和供应商事项
        $(".hotsoso.models").on("click",function(){
            if( $(this).hasClass('models') ){
                $.MsgBox({type: "alert", title: '提示信息', msg: "请选择商户类型", speed: 200});
            }
        });
        //是否同意
        $("#select_next").click(function () {
            var t = $(this),
            css = 'ion_selected';
            if(t.hasClass(css)) {
                t.removeClass(css);
                $("#sub").attr("disabled", true);
                $("#sub").css({"background-color":"#C8C8C8","color":"white"});

            } else {
                t.addClass(css);
                $("#sub").attr("disabled", false);
                $("#sub").css({"background-color":"#FFA600","color":"black"});
            }
        });
        //表单数据提交
        $('#reg').click(function (ev) {
            ev.preventDefault();
            //第二步验证
            if($(".ion_w").hasClass("ion_selected")){
                var org_licence_code = $('input[name="org_licence_code"]').val();
                if(org_licence_code.length < 1){
                    $.MsgBox({type: "alert", title: '提示信息', msg: "请输入营业执照号！", speed: 200});
                    return false;
                };
                var org_licence = $('.phon1 img').attr('src')//营业执照
                if(!org_licence){
                   $.MsgBox({type: "alert", title: '提示信息', msg: "请上传营业执照！", speed: 200});
                    return false; 
                };
                var org_logo = $('.phon4 img').attr('src')//企业LOGO
                if(!org_logo){
                   $.MsgBox({type: "alert", title: '提示信息', msg: "请上传企业LOGO！", speed: 200});
                    return false; 
                };
            }
            var arr = [];
            var $leng = $(".bus .ion_selected").length
            for(var i = 0;i < $leng;i++){
                var type = $('.bus .ion_selected').eq(i).next().val();//产品类型
                // console.log(type);
                arr.push(type)
            }
            var b = arr.join(",");
//          var rele = "'" + b + "'";
            var oin = $('input[name="input_lun"]').val()  //产品投放城市
            
            var type = $('.ion_selected').parent().find('.business_type_cls').val();//单位类型
            var mobile = $('input[name="input_mobieRegister"]').val()//手机号
            var u_pass = $('input[name="input_passwordRegister"]').val()//密码
            var org_name = $('input[name="input_company_nameRegister"]').val()//公司名称
            var org_sname = $('input[name="input_company_name"]').val()//公司简称
            var org_release = b //产品类型

            
            var org_addr = $('input[name="org_addr"]').val()//公司地址
            var org_intro = $('#input_companyIntroRegister').val()//公司简介
            var org_legal = $('input[name="org_legal"]').val()//联系人

            var org_province = $('.ty1').val()//省
            var org_city = $('.ty2').val()//市
            var org_county = $('.ty3').val()//区县

            var org_email = $('input[name="org_email"]').val()//邮箱
            var org_tel = $('input[name="org_tel"]').val()//固定电话
            var org_realname = $('input[name="org_realname"]').val()//身份证姓名

            var org_card = $('input[name="org_card"]').val()//身份证号
            var org_card_front = $('.phon2 img').attr('src')//身份证正面
            var org_card_back = $('.phon3 img').attr('src')//身份证背面
            var org_logo = $('.phon4 img').attr('src')//企业LOGO

            var org_licence_code = $('input[name="org_licence_code"]').val()//营业执照号
            var org_licence = $('.phon1 img').attr('src')//营业执照
            var datas = JSON.stringify({
                "type": type,
                "mobile": mobile,               
                "u_pass": u_pass,
                "org_name": org_name,               
                "org_province": org_province,
                "org_city": org_city,
                "org_county": org_county,
                "org_addr": org_addr,
                "org_intro": org_intro,
                "org_legal": org_legal,
                "org_email": org_email,
                "org_tel": org_tel,
                "org_realname": org_realname,
                "org_card": org_card,
                "org_card_front": org_card_front,               
                "org_card_back": org_card_back,
                "org_licence_code": org_licence_code,
                "org_licence": org_licence,              
                "org_logo": org_logo,
                "org_sname": org_sname,
                "org_release": org_release,
                "org_apply_city":oin
               
            });
            $.ajax(
                    {
                        url: ApiUrl + "/b2b/business/register",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data: datas,
                        success: function (result) {
                            // console.log('success:' + JSON.stringify(result));

                            if (result.code == 200) {
                                gostep(3)

                            } else {

                                $.MsgBox({type: "alert", title: '错误', msg: result.message, speed: 200});
                            }


                        },
                        error: function (result) {
                            // console.log(result);
                        }
                    }
            );


        })

//点击上传图片
        $(document).ready(function () {
            
            function up(num){
            var formdata = new FormData();
            formdata.append("file", $('#file'+num)[0].files[0]);//获取文件法二
            var size = $('#file'+num)[0].files[0].size;
            
            if( size > 500000*10 ){
                $.MsgBox({type:"alert",title: '错误',msg: "图片超过5M",speed:200});
                // alert('图片超过5M');
                return false;
            }
            
            $.ajax({
                type: 'POST',
                url: ApiUrl + '/b2b/upload/picture',
                data: formdata,
                cache: false,
                processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                contentType: false, // 不设置Content-type请求头
                success: function (ret) {
                    oUrl = ret.data.url
                    // alert("上传成功！")
                    $.MsgBox({type:"alert",title: '错误',msg: "上传成功！",speed:200});
                    $('.phon'+num).html('<img src="' + oUrl + '" alt="" /> ')
                },
                error: function (ret) {
                }
            })
        }
            
            $('.up_load').on('click',function(){
                if( $(this).hasClass('phon1') ){
                    $(".inpu1").trigger("click");
                }
                if( $(this).hasClass('phon2') ){
                    $(".inpu2").trigger("click");
                }
                if( $(this).hasClass('phon3') ){
                    $(".inpu3").trigger("click");
                }
                if( $(this).hasClass('phon4') ){
                    $(".inpu4").trigger("click");
                }
            });
            
            $('form[name=form1] input').on('click',function(){
                $(this).on('change',function(){
                    if( $(this).hasClass('inpu1') ){
                        up(1);
                    }
                    if( $(this).hasClass('inpu2') ){
                        up(2);
                    }
                    if( $(this).hasClass('inpu3') ){
                        up(3);
                    }
                    if( $(this).hasClass('inpu4') ){
                        up(4);
                    }
                })
            })          
        })

    })

    function showtime(t) {
        var mobile = $('input[name="input_mobieRegister"]').val()
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
            window.onbeforeunload
            $("#hin p").html("请输入11位正确手机号！");
            $('input[name="input_mobieRegister"]').focus();
            return false;
        } else {
            getUsersendcheckcodeData(t)
        }
        
    }

    function update_p(num, t) {
        if (num == t) {
            $('#submit').text(" 重新发送验证码");
            $('#submit').attr("disabled", false);

        }
        else {
            printnr = t - num;
            $('#submit').text(" (" + printnr + ")秒重新发送")
        }
    }

    function getUsersendcheckcodeData(t) {
        var mobile = $('input[name="input_mobieRegister"]').val();
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
            $("#hin p").html("请输入11位正确手机号！");
            $('input[name="input_mobieRegister"]').focus();
            return false;
        }
        $('#submit').attr("disabled", true);
        var getusersendcheckcodeUrl = '/front/b2b/user/sendcheckcode';
        ajaxRequest(getusersendcheckcodeUrl, 'GET', {
            phone :　mobile,
            type　:'register'
        }, function (ret) {
            if (ret.code == 200) {
                for (i = 1; i <= t; i++) {
            window.setTimeout("update_p(" + i + "," + t + ")", i * 1000);
        }   
            } else {
                $.MsgBox({type: "alert", title: '错误', msg: ret.message, speed: 200});
                $('#submit').attr("disabled", false);
            }

        })

    }

    //选择地区
    // function getCityDatas(){
    //     code = _GetCityCode();
    //     getCityUrl = '/front/Order/h5/currCity?code=' + code;
    //     ajaxRequest(getCityUrl, "GET",  "",function(ret){
    //         if(ret.code == 200){
    //             var dataInter = ret.data.cityList;
    //             var interText = doT.template($("#City-template").text());
    //             $("#launchs").html(interText(dataInter));

    //                 //选择投放地区
    // $(document).on("click","#launch .two_act span",function(){
    //     var arra = [];
    //     $(this).toggleClass("active")
    //     var $length_lun = $(".two_act .active").length
    //     for(var i =0;i < $length_lun;i++){
    //         var cit = $(".two_act .active").eq(i).html()
    //         arra.push(cit)  
    //     }
    //     $('input[name="input_lun"]').val(arra.join(","));
    //      })

    //        //投放城市的点击消失
    //    $(document).on("click",".clear_th",function(){
    //       $(".clear_th").css("display","none");
    //       $("#launch").css("display","none");
    //    })
    //    $(document).on("click",function(){
    //       $(".clear_th").css("display","none");
    //       $("#launch").css("display","none");
    //    })
    //    $(document).on("click","#launch",function(e){
    //       e.stopPropagation()
    //    })
    //     }

    //     })
    // }
    // getCityDatas();