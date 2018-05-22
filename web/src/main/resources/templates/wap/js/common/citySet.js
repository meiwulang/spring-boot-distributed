$(function(){
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
})