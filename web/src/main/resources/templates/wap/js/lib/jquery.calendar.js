/*
 20170120
 <div class="nscalendar">
 <div class="nsc-title">
 <a href="javascript:void(0);" class="prev">
 </a>

 <a href="javascript:void(0);" class="next">
 </a>
 </div>
 <div class="nsc-content">
 <div class="nsc-list nsc-week"> 日 </div>
 <div class="nsc-list nsc-week"> 一 </div>
 <div class="nsc-list nsc-week"> 二 </div>
 <div class="nsc-list nsc-week"> 三 </div>
 <div class="nsc-list nsc-week"> 四 </div>
 <div class="nsc-list nsc-week"> 五 </div>
 <div class="nsc-list nsc-week"> 六 </div>
 <div class="nsc-list">
 </div>
 <div class="nsc-list">
 </div>
 <div class="nsc-list nsc-rest">
 <span class="d">1</span>
 <span class="t">元旦</span>
 </div>
 <div class="nsc-list">
 <span class="event e1"></span>
 <span class="event e2"></span>
 <span class="event e3"></span>
 <span class="event e4"></span>
 <span class="event e5"></span>
 <span class="d">2</span>
 </div>
 <div class="nsc-list">
 <div class="prompt p1" data-text="提示1"></div>
 <div class="prompt p2" data-text="提示2"></div>
 <div class="prompt p3" data-text="提示3"></div>
 <span class="d">3</span>
 </div>
 <div class="nsc-list">
 <span class="d">4</span>
 </div>
 <div class="nsc-list">
 <span class="d">5</span>
 </div>
 </div>
 </div>

 <div class="nsc-prompt">
 <div class="nsc-p-c">FinallyFinallyFinallyFinallyFinallyFinallyFinallyFinallyFinallyFinallyFinally </div>
 </div>

 */ 
(function ($) {
    $.fn.nscalendar = function (config,callback) {
        //日期计算函数
        function DateAdd(strInterval, NumDay, dtDate) {
            var dtTmp = new Date(dtDate);
            if (isNaN(dtTmp)) dtTmp = new Date();
            switch (strInterval) {
                case "s":
                    return new Date(Date.parse(dtTmp) + (1000 * NumDay));
                case "n":
                    return new Date(Date.parse(dtTmp) + (60000 * NumDay));
                case "h":
                    return new Date(Date.parse(dtTmp) + (3600000 * NumDay));
                case "d":
                    return new Date(Date.parse(dtTmp) + (86400000 * NumDay));
                case "w":
                    return new Date(Date.parse(dtTmp) + ((86400000 * 7) * NumDay));
                case "m":
                    return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case "y":
                    return new Date((dtTmp.getFullYear() + NumDay), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }
        }

        //节日数据
        var festival = [{
            m: 0,
            d: 1,
            name: "元旦"
        },
            {
                m: 1,
                d: 14,
                name: "情人节"
            },
            {
                m: 2,
                d: 8,
                name: "妇女节"
            },
            {
                m: 2,
                d: 12,
                name: "植树节"
            },
            {
                m: 3,
                d: 14,
                name: "白色情人节"
            },
            {
                m: 4,
                d: 1,
                name: "劳动节"
            },
            {
                m: 5,
                d: 1,
                name: "儿童节"
            },
            {
                m: 6,
                d: 1,
                name: "建党节"
            },
            {
                m: 7,
                d: 1,
                name: "建军节"
            },
            {
                m: 8,
                d: 10,
                name: "教师节"
            },
            {
                m: 9,
                d: 1,
                name: "国庆节"
            },
            {
                m: 11,
                d: 24,
                name: "平安夜"
            },
            {
                m: 11,
                d: 25,
                name: "圣诞节"
            }];

        //创建提示主方法 
        function createPrompt(obj, text) {
            //清掉所有
            clearPrompt();

            $("body").append('<div class="nsc-prompt"><div class="nsc-p-c"> ' + text + ' </div></div>');
            setPos();
            $(window).resize(function (e) {
                setPos();
            });
            $(".nsc-prompt").mouseleave(function (e) {
                clearPrompt();
            })

            function setPos() {
                var l = $(obj).offset().left - $(".nsc-prompt").width() / 2 + 15;
                var t = $(obj).offset().top - 35;
                $(".nsc-prompt").css("left", l).css("top", t);
            }
        }

        $(document).click(function (e) {
            clearPrompt();
        });
        function clearPrompt() {
            $(".nsc-prompt").remove();
            $(window).unbind("resize");
        }

        $(this).each(function (index, element) {

            var title = "";
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var url = "";
            var daylistdata = ""
            if (config) {
                title = config.title ? config.title : title;
                year = config.year ? config.year : year;
                month = config.month ? config.month : month;
                url = config.url ? config.url : url;
                daylistdata = config.daylistdata ? config.daylistdata : daylistdata;
            }
            var thisObj = this;
            var currentDate = new Date();
            //currentDate.setYear(year);
            currentDate.setMonth(month - 1);
            currentDate.setDate(1);
            //currentDate.setHours(0,0,0,0);

            //清除
            function clear() {
                $(thisObj).html("");
            }

            function StringToDate(DateStr) {

                var converted = Date.parse(DateStr);
                var myDate = new Date(converted);
                if (isNaN(myDate)) {
                    //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
                    var arys = DateStr.split('-');
                    myDate = new Date(arys[0], --arys[1], arys[2]);
                }
                return myDate;
            }

            //转化
            //创建
            function create() {
                var json;
                if (daylistdata && daylistdata != "") {
                    json = daylistdata;
                    execute();
                } else {
                    execute();
                }
                //执行创建
                function execute() {
                    function int2date(daytime, ds) {
                    daytime = daytime.toString();
                    var Y = daytime.substr(0, 4);
                    var M = daytime.substr(4, 2);
                    var D = daytime.substr(6, 2);
                    ds = ds ? ds : '.';
                    return Y + ds + M + ds + D;
                };
                // <div class="nsc-tc"> ' + title + ' ' + currentDate.getFullYear() + '年' + (month) + '月 </div>
                    var html = '<div class="nscalendar">\
									<div class="nsc-title">\
									  <a href="javascript:void(0);" class="prev">\
									  </a>\
									  <div class="nsc-tc"> ' + title + '' + (year) + '年' + (month) + '月 </div>\
									  <a href="javascript:void(0);" class="next">\
									  </a>\
									</div>\
									<div class="nsc-content">\
									  <div class="nsc-list nsc-week"> 一 </div>\
									  <div class="nsc-list nsc-week"> 二 </div>\
									  <div class="nsc-list nsc-week"> 三 </div>\
									  <div class="nsc-list nsc-week"> 四 </div>\
									  <div class="nsc-list nsc-week"> 五 </div>\
									  <div class="nsc-list nsc-weekendt"> 六 </div>\
									  <div class="nsc-list nsc-weekendt"> 日 </div>';
                    for(var ci in json){
                        var ci_val=json[ci];
                        var d_html='';
                        var d_hurr='';
                        var flag = '';
                        if(ci_val.info){
                            // 成团
                            if(ci_val.info.p_promotion){
                                var leng = ci_val.info.p_promotion.length;
                                if(leng > 0){  
                                var hurr = '';                           
                                    for(var i = 0;i < leng;i++){
                                        hurr += '<div class="groups">';
                                        hurr += '<div class="group_right"><span>' + ci_val.info.p_promotion[i].pp_title + '</span></div>';
                                        hurr += '<div class="contents"><span>活动时间：<span>' + ci_val.info.p_promotion[i].pp_start_date + '</span>&nbsp;至&nbsp;<span>' + ci_val.info.p_promotion[i].pp_end_date_str + '</span></span></div><div class="contents"><span>班期时间：<span>' + ci_val.info.p_promotion[i].pp_classes_start_date_str + '</span>&nbsp;至&nbsp;<span>' + ci_val.info.p_promotion[i].pp_classes_end_date_str + '</span></span></div></div>';
                                      
                                    }
                                    d_hurr += '<div class="chios">' + hurr + '</div><img src="img/pgss.png" alt="">';
                                }
                            }
                            if (ci_val.info.is_cluster == 1) {
                                d_html='<span class="event bq" data-text="'+ci_val.info.bl_id+'">'+ci_val.info.seat_num+'<br><span class="tuan">团</span>'+ci_val.info.price+'<span style="font-size:8px;">起</span></span>';
                                if(leng > 0){
                                    d_html += '<span class="hurr">促' + d_hurr + '</span>';
                                }
                            } else {
                                d_html='<span class="event bq" data-text="'+ci_val.info.bl_id+'">'+ci_val.info.seat_num+'<br>'+ci_val.info.price+'<span style="font-size:8px;">起</span></span>';
                                if(leng > 0){
                                    d_html += '<span class="hurr">促' + d_hurr + '</span>';
                                }
                            }
                             if (ci_val.info.sell_status == 1) {
                                d_html='<span class="event bq shouwan" data-text="'+ci_val.info.bl_id+'"><span class="shouwan">售完</span>'+'<br><span class="shouwan">'+ci_val.info.price+'<span style="font-size:8px;">起</span></span></span>'; 
                                if(leng > 0){
                                    d_html += '<span class="hurr">促' + d_hurr + '</span>';
                                }
                            }
                            if(ci_val.info.pd_content_status == 1){
                                flag = '<i class="fa fa-flag faflag" aria-hidden="true"></i>'
                            }
                            
                            // if (ci_val.info.pd_content_status == 1) {
                            //      d_html='<span class="event bq" data-text="'+ci_val.info.bl_id+'"><span class=""></span><i class="fa fa-flag" aria-hidden="true"></i></span>'; 
                            //     console.log(1)
                            // }
                        }
                        html+='<div start_date="' + ci_val.Ymd + '" class="nsc-list '+ci_val.css+'" d="'+ ci +'">'+d_html+'<span class="d">'+ci_val.d+ '</span>' + flag +'</div>';
                    }
                    html += '</div></div>';
                    clear();
                    
                    $(thisObj).html(html);

                    if( typeof callback == 'function' ){
                        callback.call(thisObj);
                    }

                    $('.prev').hide();

                    if ((month > new Date().getMonth()+1) || (year > new Date().getFullYear())) {
                        $('.prev').show();
                    }

                    if ((year > new Date().getFullYear()) && (month == new Date().getMonth())) {
                        $('.next').hide();
                    }

                    $(thisObj).find(".prev").click(function (e) {
                        var yea = $(".nsc-tc").text().split("年")[0]; //获取年月
                        var mon =  $(".nsc-tc").text().split("年")[1].split("月")[0];
                        getproductcalendarData($.trim(mon),$.trim(yea),true);
                        return false;
                    });

                    $(thisObj).find(".next").click(function (e) {
                        var yea = $(".nsc-tc").text().split("年")[0]; //获取年月
                        var mon =  $(".nsc-tc").text().split("年")[1].split("月")[0];
                        getproductcalendarData($.trim(mon),$.trim(yea),false);
                        return false;
                    });

                    $(thisObj).find(".prompt").hover(function (e) {
                        var info = $(this).attr("data-text");
                        if (info && info != "") {
                            createPrompt(this, info);
                        }
                        return false;
                    });

                    $(thisObj).find(".event").hover(function (e) {
                        var info = $(this).attr("data-text");
                        if (info && info != "") {
                            // createPrompt(this, info);
                        }
                        return false;
                    });

                    if ($(thisObj).find(".bq").hasClass("shouwan")) {
                        $(thisObj).find(".shouwan").removeClass('bq');
                    }
                    // $(thisObj)  整个日历
                    $(thisObj).find(".nsc-list").click(function (e) {

                        if ($(this).hasClass('nsc-weekend')) {   //选中状态不能再次点击
                            return false;
                        } else{
                            if ($(this).find('span').hasClass('bq')) {
                                var info = $(this).find('span.event').attr("data-text");
                                var start = $(this).attr("start_date");
                                if (info && info != "") {

                                    $(this).addClass('nsc-weekend');  //选中状态
                                    $(this).siblings().removeClass('nsc-weekend');

                                    var p_id = GetQueryString('p_id');
                                    getproductdetailData(p_id,false);
                                }
                                return false;
                            }
                        }
                    });
                }
            }

            //执行创建
            create();
        });
    };
})(jQuery);