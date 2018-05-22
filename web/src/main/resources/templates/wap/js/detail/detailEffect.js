var slider = {
    init: function () {
        $("#slide_sPicList").on("mouseover", "li>a>img", this.imgChange);
    },
    imgChange: function (e) {
        var sSrc = $(e.target).attr("src");
        var i = $(e.target).attr("src").indexOf(".jpg");
        var bSrc = sSrc.slice(0, i) + sSrc.slice(i);
        $("#bigImg").attr("src", bSrc);
    }

}
// setTimeout("slider.init();", 500);


  //活动条
function active() {
    var count = 0;
    $(document).on('click', ".pic_space>.slide_rightbtn", function () {
        $(".pic_space>.slide_rightbtn").css("text-decoration", "none")
        var lenght = parseInt($("#slide_sPicList>li").css("width")) + 10;
        var num = $("#slide_sPicList>li").length
        event.preventDefault();
        if (count <= num - 5) {
            count++;
            $("#slide_sPicList").css("left", ((-count * lenght)) + "px");
        }


    })
    $(document).on('click', ".pic_space>.slide_leftbtn", function () {

        event.preventDefault();
        $(".pic_space>.slide_leftbtn").css("text-decoration", "none")
        $(".pic_space>.slide_leftbtn").css("color", "none")
        var lenght = parseInt($("#slide_sPicList>li").css("width")) + 10;
        if (count > 0) {
            count--;
            $("#slide_sPicList").css("left", (-count * lenght) + "px");
        }

    })

    $(document).on('mouseover', ".slide_sPic", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass("redColor_selected").siblings("li").removeClass("redColor_selected");
    })

}

active();
getCityData();

function getCityData(citycode) {
    _GetCityData(citycode,function(ret){
        if (ret.data && ret.code == 200) {
            data = ret.data;
            cityList = data.cityList
            var cityhtml = ''
            for (var i in cityList) {
                cityhtml += '<li class="pull-left ' + (i < 1 ? '' : 'dashed') + '">';
                cityhtml += '<div class="line_left">' + cityList[i].gname + '</div>';
                cityhtml += '<div class="line_right">';
                for (var x in cityList[i].data) {
                    cityhtml += '<a onClick="getCityData(' + cityList[i].data[x].code + ')">' + cityList[i].data[x].name + '</a>';
                }
                cityhtml += '</div></li>';
            }
            $('.city').hide()
            $('.switch_tip').hide()
            $('.city').html(data.currentCity.name + ' <span class="caret"></span>')
            $('#citylist').html(cityhtml)
            getTopconditionData()
            //getproductdetailData(p_id)

        } else {
            $.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
        }
    });
}

function getTopconditionData() {
    code = _GetCityCode();
    if (code && 'null' != code) {
        var getTopconditionUrl = '/b2b/product/topcondition?code=' + code;
    } else {
        var getTopconditionUrl = '/b2b/product/topcondition';
    }

    ajaxRequest(getTopconditionUrl, 'GET', '', function (ret) {

        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            var intersearchText = doT.template($("#TopconditionsearchDta-template").text());
            $("#TopconditionsearchData").html(intersearchText(dataInter));
        } else {
            $.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
        }
    })
}

var linelink = {
    init: function () {
        var heightlists = document.querySelectorAll("#travelDetail_description>.stroke_descriptionList>li");
        for (var i = 0; i < heightlists.length - 1; i++) {
            var height = $(heightlists[i]).css('height');
            $("#travelDetail_description>.stroke_descriptionList>li:eq(" + i + ") .days_linkLine").css("height", height);
        }
    }
};

setTimeout("linelink.init();", 500);

//日历下单
function gorder(e) {         
    e.stopPropagation();
    if (_uinfo && _uinfo.u_id) {
        if($(".tavel_date .nsc-list").hasClass("nsc-weekend")){
            if ($('li.scheduleTitle').hasClass('active')) {
                var pid = GetQueryString('p_id');
                var bqid = $(".schedule-infor li.active").attr("data-id");
                var citycode = $('body').attr('detail_citycode');
                window.location.href = 'order.html?p_id=' + pid + '&bl_id=' + bqid + '&city_code=' + citycode;
            } else{
                $.MsgBox({type: "alert", title: '错误', msg: "请选择班期", speed: 200});
            }
            
        }else{
            $.MsgBox({type: "alert", title: '错误', msg: "请在日历上选择班期", speed: 200});
        }
    } else {
        $.MsgBox({
            type: "alert", title: '提示', msg: "请先登录", speed: 200, callback: function () {
                $("#myModal").modal("show");
            }
        });
    }
}

//班期下单
function gorders(pid,bqid,e) {         
    e.stopPropagation();
    if (_uinfo && _uinfo.u_id) {
            var citycode = $('body').attr('detail_citycode');
            window.location.href = 'order.html?p_id=' + pid + '&bl_id=' + bqid + '&city_code=' + citycode;
    } else {
        $.MsgBox({
            type: "alert", title: '提示', msg: "请先登录", speed: 200, callback: function () {
                $("#myModal").modal("show");
            }
        });
    }
}

function LowerCase(argument) {
    argument = argument.toString();
    argument = argument.toLowerCase();
    return argument;
}
