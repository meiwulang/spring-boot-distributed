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
(function($) {
    var index = 0;
    $.fn.nscalendar = function(config) {

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
            $(window).resize(function(e) {
                setPos();
            });
			$(".nsc-prompt").mouseleave(function(e) {
                clearPrompt();
            })

            function setPos() {
                var l = $(obj).offset().left - $(".nsc-prompt").width() / 2 + 15;
                var t = $(obj).offset().top - 35;
                $(".nsc-prompt").css("left", l).css("top", t);
            }
        }
        $(document).click(function(e) {
            clearPrompt();
        });
        function clearPrompt() {
            $(".nsc-prompt").remove();
            $(window).unbind("resize");
        }

        $(this).each(function(index, element) {

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
					//console.log(JSON.stringify(json))
					execute();

                  
                } else {
                    execute();
                }

                //执行创建
                function execute() {

                    var html = '<div class="nscalendar">\
									<div class="nsc-title">\
									  <a href="javascript:void(0);" class="prev">\
									  </a>\
									  <div class="nsc-tc"> ' + title + ' ' + currentDate.getFullYear() + '年' + (currentDate.getMonth() + 1) + '月 </div>\
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
                        if(ci_val.info){
                            d_html='<span class="event bq" data-text="'+ci_val.info.bl_id+'">'+ci_val.info.seat_num+'<br>'+ci_val.info.price+'</span>';
                        }
                        html+='<div class="nsc-list '+ci_val.css+'">'+d_html+'<span class="d">'+ci_val.d+'</span></div>';
                    }
                    html += '</div></div>';
                    html += '<div class="timer_fh" onclick="timer_fh()">返回</div>';
                    clear();
                    $(thisObj).html(html);

                    $(thisObj).find(".prev").click(function(e) {
                        getproductcalendarData(month - 1);
                        return false;
                    });

                    $(thisObj).find(".next").click(function(e) {
                        getproductcalendarData(Number(month) + 1)
                        return false;
                    });

                    $(thisObj).find(".prompt").hover(function(e) {
                        var info = $(this).attr("data-text");
                        if (info && info != "") {
                            createPrompt(this, info);
                        }
                        return false;
                    });
                    $(thisObj).find(".event").hover(function(e) {
                        var info = $(this).attr("data-text");
                        if (info && info != "") {

                           // createPrompt(this, info);
                        }
                        return false;
                    });
				   $(thisObj).find(".bq").click(function(e) {
                        var info = $(this).attr("data-text");
                        if (info && info != "") {

                           $('.immediate_signUp').attr('onclick','window.location.href = "order.html?p_id='+ GetQueryString('p_id') +'&bl_id='+info+'"')
						  
                        }
                        return false;
                    });

                }

            }
            //执行创建
            create();
        });
    };
})(jQuery);