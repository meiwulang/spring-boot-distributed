/**
 * Created with JetBrains PhpStorm.
 * User: zsl
 * Date: 13-9-16
 * Time: 下午5:28
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    var field={
        org_name:false,
        u_mob:false,
        yz_verify:false
    };
    var datum_field={
        u_name:false,
        u_email:false,
        u_password:false,
        org_legal:false,
        org_card:false,
        org_card_pic:false
    };
    $(window).load(function(){
        if($("#org_id").val()){
            datum_field["u_name"]=true;
            datum_field["u_email"]=true;
            datum_field["org_legal"]=true;
            datum_field["org_card"]=true;
            if($("#org_type").val()!="sales"){
                var t_field=["org_tax","org_charter","org_certificate"];
                for(var i=0;i<t_field.length;i++){
                    datum_field[t_field[i]]=true;
                }
                var t_field_pic=["org_tax_pic","org_charter_pic","org_certificate_pic"];
                for(var j=0;j<t_field_pic.length;j++){
                    datum_field[t_field_pic[j]]=false;
                }
            }
        }
    });

    function reg_li_label_block(t){
       /* $(".reg_form").find("li").removeClass("reg_li_bk");
        $(t).parent("li").addClass("reg_li_bk");*/

    }
    function reg_li_bk(t){
        $(".reg_form").find("li").find(".reg_msg").removeClass("reg_li_label_block");
        $(t).parent("li").find(".reg_msg").addClass("reg_li_label_block");
    }
    function reg_block(t){
        $(t).parent("li").find(".reg_msg").addClass("reg_block");
        $(t).parent("li").find("input").addClass("reg_block_color");
    }
    function reg_block_remove(t) {
        $(t).parent("li").find(".reg_msg").removeClass("reg_block");
        $(t).parent("li").find("input").removeClass("reg_block_color");
    }
    function reg_li_remove (t){
        $(t).parent("li").removeClass("reg_li_bk");
        $(t).parent("li").find(".reg_msg").removeClass("reg_block");
        $(t).parent("li").find(".reg_msg").removeClass("reg_li_label_block");
        $(t).removeClass("reg_block_color");
    }

    $(".reg_form").find("li").find("input").focus(function(){
        $(this).parent("li").find(".reg_m").html("");
        reg_li_label_block(this);
        reg_li_bk(this);
    });
    /**
     * 当焦点离开表单框时执行
     */
    $(".reg_form").find("li").find("input").blur(function(){
        var is_this=$(this).parent().find('.verify_send')
        reg_li_remove(this);
        var name=$(this).attr("name"),val=$(this).val();
        if(!$(this).val()){
            reg_block(this);
        }else{
            reg_block_remove(this);
            switch_t(name,val,this,function(e){
                var body_bk=$('.verify_send');
                if(e.status!=1){
                    body_bk.addClass('send-cls');
                }else{
                    body_bk.removeClass('send-cls');
                }
            });
        }

    });

    /**
     * 需要验证的项目
     * @param name 项目名称
     * @param val 项目值
     * @param t 当前项目
     * @return {Boolean} 返回值
     */
    function switch_t(name,val,t,fn){
        switch(name) {
            case 'u_name':
                blur_ajax({r_name:name,r_val:val,r_msg:"登录账号",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'u_email':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"邮箱",v_filed:[field,datum_field]})==false) return false
                blur_ajax({r_name:name,r_val:val,r_msg:"邮箱",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'u_password':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"密码",v_filed:[field,datum_field]})==false) return false
                break;
            case 'u_password_old':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"密码",v_old:$("#u_password").val(),v_filed:[field,datum_field]})==false) return false
                break;
            case 'org_card':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"身份证号",v_filed:[field,datum_field]})==false) return false
                blur_ajax({r_name:name,r_val:val,r_msg:"身份证号",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'org_tax':
                blur_ajax({r_name:name,r_val:val,r_msg:"税务登记证",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'org_charter':
                blur_ajax({r_name:name,r_val:val,r_msg:"营业执照",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'org_certificate':
                blur_ajax({r_name:name,r_val:val,r_msg:"经营许可证",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'org_name':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"公司名称",v_filed:[field,datum_field]})==false) return false
                blur_ajax({r_name:name,r_val:val,r_msg:"公司名称",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'yz_verify':
                blur_ajax({r_name:name,r_val:val,r_msg:"验证码",r_this:t,r_filed:[field,datum_field]});
                break;
            case 'u_mob':
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"手机号",v_filed:[field,datum_field]})==false) return false;
                blur_ajax({r_name:name,r_val:val,r_msg:"手机号",r_this:t,r_filed:[field,datum_field]},fn);
                break;
            case "org_legal":
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"法人姓名",v_filed:[field,datum_field]})==false) return false;
                break;
            case "org_card_pic":
                if(blur_verify({v_name:name,v_val:val,v_this:t,v_msg:"身份证照片",v_filed:[field,datum_field]})==false) return false;
                break;
            case "org_tax":
                blur_ajax({r_name:name,r_val:val,r_msg:"税务登记证",r_this:t,r_filed:[field,datum_field]});
                break;
            case "org_charter":
                blur_ajax({r_name:name,r_val:val,r_msg:"营业执照",r_this:t,r_filed:[field,datum_field]});
                break;
            case "org_certificate":
                blur_ajax({r_name:name,r_val:val,r_msg:"经营许可证",r_this:t,r_filed:[field,datum_field]});
                break;
            case "org_card_pic":
                if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                break;
            case "org_tax_pic":
                if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                break;
            case "org_charter_pic":
                if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                break;
            case "org_certificate_pic":
                if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                break;
        }
    }


    /**
     * 表单前端验证
     * @param v
     * @return {Boolean}
     */
    function blur_verify(v){
        var my_mail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var my_mob=/(^0?[1][3548][0-9]{9}$)/;
        var reg_m=$(v.v_this).parent("li").find(".reg_m");
        /*** 邮箱验证*/
        if(v.v_name=="u_email" && v.v_val){
            if(!v.v_val.match(my_mail)){
                reg_m.html(v.v_msg+"格式有误,请输入正确的"+ v.v_msg);
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false;
            }
        }
        /*** 密码验证 */
        if(v.v_name=="u_password" && v.v_val){
            if(v.v_val.length<6){
                reg_m.html(v.v_msg+"过短,请输入6至18个字符");
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false;
            }else if(v.v_val.length>18){
                reg_m.html(v.v_msg+"过长,请输入6至18个字符");
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false;
            }else{
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:true});
                reg_m.html('<p class="reg_bk"></p>');
            }
        }
        if(v.v_name=="u_password_old" && v.v_val){
            if(v.v_val != v.v_old){
                reg_m.html("两次请输入的"+ v.v_msg+"不一致，请重新输入");
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false;
            }else{
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:true});
                reg_m.html('<p class="reg_bk"></p>');
            }
        }
        /*手机号验证*/
        if(v.v_name=="u_mob" && v.v_val){
            if(!v.v_val.match(my_mob)){
                reg_m.html(v.v_msg+"格式有误,请输入正确的"+ v.v_msg);
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false;
            }
        }
        /*法人验证*/
        if(v.v_name=="org_legal"){
            if(v.v_val){
                reg_m.html('<p class="reg_bk"></p>');
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:true});
            }else{
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
            }
        }
        /*法人验证*/
        if(v.v_name=="org_card_pic"){
            if(v.v_val){
                reg_m.html('<p class="reg_bk"></p>');
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:true});
            }else{
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
            }
        }
        /*身份证号判断*/
        if(v.v_name=="org_card"){
            if(!CardChk(v.v_val).start){
                reg_m.html(v.v_msg+"格式有误,请输入正确的"+ v.v_msg);
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false
            }
        }
        /*公司名称的验证*/
        if(v.v_name=="org_name"){
            //alert(v.v_val.length);
            if(v.v_val.length<5){
                reg_m.html(v.v_msg+"不能小于5个字符");
                filed_true({d_filed:v.v_filed,d_name:v.v_name,d_true:false});
                return false
            }
        }
    }

    /**
     * 表单交互验证
     * @param data 传来的数据
     */
    function blur_ajax(data,fn){
        var reg_m=$(data.r_this).parent("li").find(".reg_m"),
            u_id=$("#u_id").val(),org_id=$("#org_id").val();
        reg_m.html('<p class="reg_bk  reg_bk_load"></p>');
        $.ajax({
            type:"POST",
            url:$__app__ + "/Users/blur_ajax",
            data:{ name:data.r_name, val: data.r_val,u_id: u_id,org_id: org_id},
            success:function (msg) {
                var row = msg;
                if (typeof msg != 'object')
                    row = eval("(" + msg + ")");
                reg_m.html("");
                if(fn)fn(row);
                if(row.status==1){
                    filed_true({d_filed:data.r_filed,d_name:data.r_name,d_true:true});
                    reg_m.html('<p class="reg_bk"></p>');
                }else{
                    filed_true({d_filed:data.r_filed,d_name:data.r_name,d_true:false});
                    reg_m.html(data.r_msg+row.info);
                }
            }
        });
    }

    /**
     * 验证处理
     * @param d 提交来的数据
     */
    function filed_true(d){
        for(var i=0;i<d.d_filed.length;i++){
            d.d_filed[i][d.d_name]= d.d_true;
        }
    }

    /*密码强弱度*/
    $("input[name='u_password']").keyup(function(){
        var pw=$(this).val();
        pw_yz(pw);
    });
    function pw_yz(pw){
        var score=0;
        if (pw.match(/(.*[0-9].*[0-9].*[0-9])/)){ score += 5;};
        if (pw.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){ score += 5 ;};
        if (pw.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){ score += 10;};
        if (pw.match(/([a-zA-Z])/) && pw.match(/([0-9])/)){ score += 15;};
        if (pw.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && pw.match(/([0-9])/)){ score += 15;};
        if (pw.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && pw.match(/([a-zA-Z])/)){score += 15;};
        if (pw.match(/^\w+$/) || pw.match(/^\d+$/) ){ score += 10;};
        if (pw.length>6) { score += 11;};
        if (pw.length<6) { score = -5;};
        var ref=$(".reg_fdl").find("dd");
        ref.find("p").removeClass("reg_fdl_bk");
        if(score>5 && score<=20){
            ref.eq(0).find("p").addClass("reg_fdl_bk");
        };
        if(score>20 && score<=50){
            for(var i=0;i<2;i++){
                ref.eq(i).find("p").addClass("reg_fdl_bk");
            }
        };
        if(score>50){
            for(var j=0;j<3;j++){
                ref.eq(j).find("p").addClass("reg_fdl_bk");
            }
        }
    };

    $("#org_type").change(function(){
        if($(this).val()!="sales"){
            org_append("org_tax",true);
            org_append("org_charter",true);
            org_append("org_certificate",true);
            $(".org_release").show();
            wholesale({
                t_field:["org_tax","org_tax_pic","org_charter","org_charter_pic","org_certificate","org_certificate_pic"],
                t_false:false
            })
        }else{
            wholesale({
                t_field:["org_tax","org_tax_pic","org_charter","org_charter_pic","org_certificate","org_certificate_pic"],
                t_false:true
            })
            $(".org_release").hide();
            $(".release").attr("checked",false);
            $("input[name=org_release]").val("");
            org_append("org_tax",false);
            org_append("org_charter",false);
            org_append("org_certificate",false);
        }
    })

    function org_type_append(type){
        if(type!="sales"){
            org_append("org_tax",true);
            org_append("org_charter",true);
            org_append("org_certificate",true);
            $(".org_release").show();
            wholesale({
                t_field:["org_tax","org_tax_pic","org_charter","org_charter_pic","org_certificate","org_certificate_pic"],
                t_false:false
            })
        }else{
            wholesale({
                t_field:["org_tax","org_tax_pic","org_charter","org_charter_pic","org_certificate","org_certificate_pic"],
                t_false:true
            })
            $(".org_release").hide();
            $(".release").attr("checked",false);
            $("input[name=org_release]").val("");
            org_append("org_tax",false);
            org_append("org_charter",false);
            org_append("org_certificate",false);
        }
    }

    var pr_type=$('.pr-type');
    pr_type.find('.type-l').click(function(){
        if($(this).hasClass('type-hover'))return;
        pr_type.find('.type-l').removeClass('type-hover');
        $(this).addClass('type-hover');
        var v=$(this).attr('data-val');
        $('input[name=org_type]').val(v);
        org_type_append(v);
    });

    function org_append(id,f){
        var tt=$("#"+id).parent("li").find(".reg_ftext"),
        tt_pic=$("#"+id+"_pic").parent("li").find(".reg_ftext");
        if(!tt.find("font").html() && !tt_pic.find("font").html() && f==true){
            tt.append("<font> * </font>");
            tt_pic.append("<font> * </font>");
        }
        if(tt.find("font").html() && tt_pic.find("font").html() && f==false){
            tt.find("font").remove();
            tt_pic.find("font").remove();
        }
    }


    $(".verify_send").click(function(){
        var v=$("#u_mob").val(),reg_m=$(this).parent("li").find(".reg_m");
        if(!v){
            reg_m.html("请输入手机号码!");
            return false;
        }
        if(switch_t("u_mob",v,"#u_mob")==false){
            return false;
        }else{
            var t=$(this);
            setTimeout(function(){
                if(t.hasClass('send-cls')) return false;
                background_show_msg();
            },200);
        }
    });
    function verify_send(v,reg_m){
        $(".verify_send").hide();
        var but_yzm=$('.but_yzm');
        var yzm_cls=$('.yzm-cls');
        if(!yzm_cls.val()){
            alert('请填写验证码!');
            return false;
        }
        if(but_yzm.hasClass('yzm_load'))return false;
        but_yzm.addClass('yzm_load');
        but_yzm.css('background','#eee');
        but_yzm.val('正在提交...');
        reg_m.html('<p class="reg_bk  reg_bk_load"></p>');
        $.ajax({
            type:"POST",
            url:$__app__ + "/Users/mob_send",
            data:{ u_mob:v ,yzm:yzm_cls.val()},
            success:function (msg) {
                var row = msg;
                if (typeof msg != 'object')
                    row = eval("(" + msg + ")");
                but_yzm.removeClass('yzm_load');
                but_yzm.css('background','orangered');
                but_yzm.val('立即发送');
                yzm_cls.val('');
                var time = new Date().getTime();
                $('.yzm-more').find('img').attr('src',$__app__+'/company/verify/'+time);
                if(row.status==1){
                    reg_m.html('<p class="reg_bk"></p>');
                    $(".send_div").css("display","inline-block");
                    ctime($(".send_div"),$(".verify_send"));
                    $('.body_bk').hide();
                }else{
                    alert(row.info);
                    $(".verify_send").show();
                    reg_m.html("手机号"+row.info);
                }
            }
        });
    }
    function ctime(cls,id){
        var i=59;
        var s_time=setInterval(jump,1000);
        function jump(){
            if(i==0){
                clearInterval(s_time);
                cinter(cls,id);
            };
            cls.html(i+"秒后可重发!");
            i--;
        };
    }
    function cinter(cls,id){
        cls.css("display","none");
        id.css("display","inline-block");
    }

    function forget_check(mForm){
        var bStatus = true,sErrMsg = '',sPwd = false,sPwd_Verify = false;
        var mobile_reg = /(^0?[1][3548][0-9]{9}$)/;
        var index = 0;
        for(; index < mForm.length; ++index){
            switch( mForm[index].name ){
                case 'u_name_forget':
                    if($.trim(mForm[index].value) == "" ){
                        bStatus = false;
                    }
                    break;
                case 'u_mob_forget':
                    if( $.trim(mForm[index].value) == "" ){
                        bStatus = false;
                    }
                    else if(!$.trim(mForm[index].value).match(mobile_reg)){
                        sErrMsg = "手机格式错误!";
                        bStatus = false;
                    }
                    break;
                case 'u_pwd'://密码
                    sPwd = {'field':'u_pwd','value':mForm[index].value};
                case 'u_pwd_c'://确认密码
                    sPwd_Verify = {'field':'u_pwd_c','value':mForm[index].value};
                    if(mForm[index].value.length<6 || mForm[index].value.length > 18){
                        sErrMsg = "密码长度不对,请输入6至18个字符";
                        bStatus = false;
                    }
                    break;
                case 'yz_verify'://验证码
                    if($.trim(mForm[index].value.length) != 6){
                        sErrMsg = "验证码错误";
                        bStatus = false;
                    }
                    break;
                default:
                    break;
            }
            if( sPwd && sPwd_Verify && sPwd.value != sPwd_Verify.value ){
                return {'status':false,'field':sPwd_Verify.field,'error':'确认密码跟设置密码不一致'};
            }
            else if( !bStatus ){
                return {'status':bStatus,'field':mForm[index].name,'error':sErrMsg};
            }
        }
        return {'status':bStatus};
    }
    $(".rverify_next").click(function(){
        if($(this).hasClass('not-submit'))return false;
        $(this).addClass('not-submit');
        $(this).val('正在提交');
        var ret = forget_check($(this).parents("form").serializeArray());
        if( !ret.status ){
            if(ret.error.length > 0){
                alert(ret.error);
            }
            $("#"+ret.field).focus();
            $(this).removeClass('not-submit');
            $(this).val('下一步');
            return false;
        }
        $(this).parents("form").submit();
    });

    $(".reg_submit").click(function(){
        if($(this).hasClass('not-submit')) return false;
        $(this).addClass('not-submit');
        $(this).val('正在提交...');
        change_load();
        if(present(analyze(datum_field),datum_field)==false){
            $(this).removeClass('not-submit');
            $(this).val('提交');
            return false;
        }
        if(!$("#regcheck").attr('checked')){
            alert("请阅读《平台服务使用协议》");
            $(this).removeClass('not-submit');
            $(this).val('提交');
            return false; }
    });

    function wholesale(int){
        for(var i=0;i<int.t_field.length;i++){
            if(int.t_false==false){ datum_field[int.t_field[i]]=false; }
            if(int.t_false==true){ delete datum_field[int.t_field[i]]; }
        }
    }

    /**
     * 验证数据分析
     * @param field 需要验证的数据
     * @return {Array} 返回分析出的数据
     */
    function analyze(field){
        var datum_va=[],i=0;
        for (var prop in field) {
            if (field.hasOwnProperty(prop)) {
                if(datum_va){ datum_va[i]=prop; }else{ datum_va[i]=prop; }
            }
            i++;
        }
        return datum_va;
    }

    /**
     * 提交时对表单填写错误项的判断
     * @param va 要判断的数据
     * @return {Boolean} 返回是否通过
     */
    function present(va,fd){
        for(var i=0;i<va.length;i++){
            var name=va[i],v=$("#"+va[i]).val(),t="#"+va[i];
            if(fd[name]==false){
                if(v){switch_t(name,v,t);}else{reg_block(t)}
                return false;
            }
        }
    }
    function getFileSize(obj) {
        var pic={size:"",type_pic:"",name_pic:""};
        if(navigator.userAgent.indexOf("MSIE")>0){
            var fso = new ActiveXObject('Scripting.FileSystemObject');
            var file = fso.GetFile(obj.value);
            pic.size = file.size;
            pic.type_pic = file.type;
        }else {
            pic.size = obj.files[0].size;
            pic.type_pic = obj.files[0].type;
        }
        return pic;
    }

    $("#org_card_pic").change(function(){ if(size_type_pic(this)==false) return false; });
    $("#org_tax_pic").change(function(){ if(size_type_pic(this)==false) return false; });
    $("#org_charter_pic").change(function(){ if(size_type_pic(this)==false) return false; });
    $("#org_certificate_pic").change(function(){ if(size_type_pic(this)==false) return false; });

    function size_type_pic(t){
        $(t).removeClass("reg_block_color");
        var pic=getFileSize(t),msg_pic=$(t).parent("li").find(".reg_m");
        var img_type=["image/jpeg","image/png","image/gif"];
        if($.inArray(pic.type_pic,img_type)<0){
            msg_pic.show();$(t).val("");
            msg_pic.html("图片格式有错，请上传jpg,jpeg,png,gif格式的图片!");
            return false;
        }
        if(pic.size>(500*1000)){
            msg_pic.show(); $(t).val("");
            msg_pic.html("传送的图片不可大于500KB!");
            return false;
        }
        msg_pic.show(); msg_pic.html("");
    }

    function change_load(){
        var va=analyze(datum_field);
        for(var i=0;i<va.length;i++){
            var name=va[i],val=$("#"+name).val();
            switch (va[i]){
                case "org_card_pic":
                     if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                    break;
                case "org_tax_pic":
                    if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                    break;
                case "org_charter_pic":
                    if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                    break;
                case "org_certificate_pic":
                    if(val){ datum_field[name]=true; }else{ datum_field[name]=false; }
                    break;
            }
        }
    }

    $(".release").click(function () {
        var v, r = $(".release"), len = r.length;
        for (var i = 0; i < len; i++) {
            if (r.eq(i).attr('checked')) {
                if (v) {
                    v += "," + r.eq(i).val();
                } else {
                    v = r.eq(i).val();
                }
            }
        }
        $("input[name=org_release]").val(v);
    });

    /**
     * 城市选择联动
     * @type {{CityAjax: Function 异步加载, AllLoad: Function 页面打开加载, CityChange: Function 条件变动}}
     */
    var CitySelect = {
        CityAjax:function(premes){
            var t=this;
            $.ajax({
                type:"POST",
                url:$__app__ + "/City/city_json",
                data:premes,
                success:function (msg) {
                    var row = msg;
                    if (typeof msg != 'object')
                        row = eval("(" + msg + ")");
                    var id_html=$('select[name=org_'+premes.type+']');
                    var tpl_html='<option>==选择'+premes.msg+'==</option>';
                    if(row.status==1){
                        var root=row.data;
                        $.each(root,function(i,v){
                            tpl_html+='<option value="'+ v.CityName+'" data-val="'+ v.CityId+'">'+ v.CityName+'</option>';
                        });
                        id_html.html(tpl_html);
                    }else{
                        id_html.html(tpl_html);
                    }
                    t.CityChange();
                }
            });
        },
        AllLoad:function(){
            this.CityAjax({type:'province',msg:'省份'});
        },
        CityChange:function(){
            var province=$('select[name=org_province]');
            var city=$('select[name=org_city]');
            var county=$('select[name=org_county]');
            var t=this;
            province.unbind();
            province.change(function(){
                var v=$(this).find('option:selected').attr('data-val');
                t.CityAjax({type:'city',id:v,msg:'城市'});
                county.html('<option>==选择区/县==</option>');
            });
            city.unbind();
            city.change(function(){
                var v=$(this).find('option:selected').attr('data-val');
                t.CityAjax({type:'county',id:v,msg:'区/县'});
            });
        }
    };
    CitySelect.AllLoad();

    /**
     * 打开验证码输入
     */
    function background_show_msg(){
        var win_height=$(window).height();
        var win_width=$(window).width();
        var body_bk=$('.body_bk');
        var yzm_cls=body_bk.find('.yzm-cls');
        var close_id=body_bk.find('.fa-times');
        var yzm_more=body_bk.find('.yzm-more');
        var body_text=body_bk.find('.body-text');
        body_bk.css({
            height:win_height
        });
        body_text.css({
            left:(win_width-300)/2
        });
        body_bk.show();
        var yzm_val='';
        yzm_cls.keyup(function(){
            var vl=$(this).val();
            if(vl.length>4){
                $(this).val(yzm_val);
                return false;
            }
            yzm_val=vl;
        });
        close_id.click(function(){
            body_bk.hide();
        });
        yzm_more.click(function(){
            var time = new Date().getTime();
            $(this).find('img').attr('src',$__app__+'/company/verify/'+time);
        });
        var but_yzm=$('.but_yzm');
        but_yzm.click(function(){
            var u_mob=$('#u_mob');
            verify_send(u_mob.val(),u_mob);
        });
    }

})

