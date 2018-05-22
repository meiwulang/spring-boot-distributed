var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
$("#header").load("index_header.html?t="+_TimeStamp);
$("#footer").load("index_footer.html?t="+_TimeStamp);
$("#login_mask").load("login.html?t="+_TimeStamp);

var p_id = GetQueryString('p_id');

if (p_id) {
    getproductdetailData(p_id,true);
} else {
    location.href = 'index.html'
}

var DetailLists = [];
var DATA_INFO = '';
var page = 1;
var nice = '0';
$('.schedule-detail').append('班期正在加载中...');
function getproductdetailData(pid,flag) {
   
    code = _GetCityCode();
    var start_date = $('.nsc-weekend').attr('start_date') || '';
    var getproductdetailUrl = '/front/b2b/product/detail?city_code=' + code + '&p_id=' + pid + '&start_date=' + start_date;
    ajaxRequest(getproductdetailUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            setTimeout("slider.init();", 500);
            addcookie('detail_org_id', ret.data.org_id, 360000);
            //ret.data.city_code = code;
            $('body').attr('detail_citycode',ret.data.city_code);
            $('body').attr('appoint',ret.data.appoint);
            var dataInter = ret.data;
            var interText = doT.template($("#productdetailData-template").text());
            var datadetail = ret.data.detail
            //获取数据title
            if( datadetail ){
                var interTitle = doT.template($("#productTitle-template").text());
                $("#productTitle").html(interTitle(datadetail))
                var interTextdetail = doT.template($("#productdetailstrokeData-template").text());
                $("#productdetailstrokeData").html(interTextdetail(datadetail).replace(/\[@([^\]]*)]/g, '<i class="fa fa-$1" aria-hidden="true"></i>'));
                Etype();
            }
            
            $('title').html(ret.data.p_name + ' - 金豆云旅游');
            var imgNum = ret.data.slide_img.length;
            var ulLength = (imgNum + 2) * ($('.slide_sPic').width() + 10);
            $('.slide_sPicList').css('width', ulLength + 'px');
            PrinterUrl(ret.data.p_id);
            //消除换行符
            var $span = $(".everyDay_intro .line_description li p").length;
            for (var j = 0; j < $span; j++) {
                var $p = $(".everyDay_intro .line_description li p").eq(j);
                if ("<br>" == $p.html()) {
                    $p.remove();
                };
            };
           
            //锚点动画
            $(document).on("click", ".travel_introList_sort a", function () {
                $("html, body").animate({
                    scrollTop: $($(this).attr("to")).offset().top + (-60) + "px"
                }, {
                    duration: 500,
                    easing: "swing"
                });
                return false;
            })
            //天数锚点动画
            $(document).on("click", ".stroke_descriptionBtns li a", function () {
                $("html, body").animate({
                    scrollTop: $($(this).attr("href")).offset().top + (-50) + "px"
                }, {
                    duration: 500,
                    easing: "swing"
                });
                return false;
            })
    
            $("#productdetailData").html(interText(dataInter));
            //浏览记录
            var arrd = [];
            if(ret.data.slide_img && ret.data.slide_img != null){
                var srcs = ret.data.slide_img[0];
            }
            var tit = ret.data.p_name;
            var tits = ret.data.p_sname;
            var pnum = ret.data.p_num;
            var types = ret.data.p_type_name;
            var iod = ret.data.p_id;
            var price = $(".price_promptBigFont").text();
            var data = {
                "srcs" : srcs,
                "tit" : tit,
                "tits" : tits,
                "iod" : iod,
                "types" : types,
                "pnum" : pnum,
                "price" : price
            }
            
            var second = localStorage.getItem('array');
            if(second){
                var arrd = JSON.parse(second);
                if (arrd && arrd.length){
                    for(var i = 0; i < arrd.length;i++){
                        if(arrd[i].iod == iod){
                            arrd.splice(i,1);
                        }
                    }
                }
                
            }
            if(tit != null && srcs){
               arrd.unshift(data);     
            }
          
            var arrs = JSON.stringify(arrd);
            localStorage.setItem('array',arrs);

            $(".intro_Content ul li table").attr("width","");
            $(".intro_Content ul li table").attr("style","");
             //未登录状态隐藏同行价
            if (!(_uinfo && _uinfo.u_id)) {
                $(".priceOver").css("display","none");
                $(".price_pr").css("display","none");
                $('.businessLink').attr('href','index.html');
            };
            // if ($('.detail_eye').hasClass('open')) {
            // } else{
            //     $('.t_price').hide();
            // }
            //滚动监听
            if(ret.data.detail){
                $(window).on("scroll", function(){
                    var $top = $(window).scrollTop() + 130;
                    var $off_to = $(".line_tit").offset().top
                    var $off_top = $("#lifeature_nice").offset().top
                    var $off_topt = $("#listroke").offset().top
                    var $off_tops = $("#licost_in_nice").offset().top
                    var $off_topf = $("#licost_noin_nice").offset().top
                    var $off_topi = $("#linotice_nice").offset().top
                    var $off_topg = $("#livis").offset().top
                    var header = document.querySelector('.travel_introList');
                    if($top > ($off_to - 30)){
                        header.classList.add('sticky')
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(0).addClass("ive")
                    }else{
                        header.classList.remove('sticky')
                    }
                    if($top > $off_topt){
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(1).addClass("ive")
                    }
                    if($top > $off_tops){
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(2).addClass("ive")
                    }
                    if($top > $off_topf){
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(3).addClass("ive")
                    }
                    if($top > $off_topi){
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(4).addClass("ive")
                    }
                    if($top > $off_topg){
                        $(".travel_introList_sort li").removeClass("ive")
                        $(".travel_introList_sort li").eq(5).addClass("ive")
                    }
                    
                })
            }
            
            $(".stroke_descriptionBtns").positionSticky();
            $('.stroke_descriptionBtns').onePageNav();
            //活动促销
            $(".tavel_date").css("display","");
            $(".acts").hover(function(){
                    $(this).find(".actss .groups:last").find(".contens").css("border-bottom","0");
                    $(this).find(".actss").css("display","block");
                    $(this).find("img").css("display","block");
                    $(".acts").css("background","#ffa600");
                    $(".acts").css("color","#fff");
                    $(".actss").css("color","#000");
                },function(){
                    $(this).find(".actss").css("display","");
                    $(this).find("img").css("display","");
                    $(".acts").css("background","");
                    $(".acts").css("color","");
                    $(".actss").css("color","");
            });

            $('.city-list').html(ret.data.city_name);

            //只在第一次加载
            if (flag) {
                getproductlist_detailsData(1);
                getproductcalendarData();
            }

            //加载日历中的多班期信息
            if (DATA_INFO) {
                var d = $('.nsc-weekend').attr('d');
                var interTitle = doT.template($("#scheduleTitleData-template").text());
                $(".schedule-detail").append(interTitle(DATA_INFO[d]));
                Etype();
                
                if ($('li.scheduleTitle').length == 1) {
                    $('li.scheduleTitle').addClass('active');
                    $('li.ind0s').addClass('show');
                }
                
                $('.scheduleTitle').on('click',function() {
                    $(this).addClass('active').siblings().removeClass('active');
                    var ind = $(this).attr('ind');
                    $(".ticketCont").removeClass('show');
                    $(".ind" + ind + "s").addClass('show');
                })
                
                if (!(_uinfo && _uinfo.u_id)) {
                    $(".priceOver").css("display","none");
                    $(".price_pr").css("display","none");
                };
            }
        }

        //未登录情况下无法查看同行价
        if (_uinfo && _uinfo.u_id) {
             $('.detail_eye').show();
        } else{
             $('.detail_eye').hide();
        }
    });
}

 //打印行程链接
function PrinterUrl(pid) {
    var cc = $('body').attr('detail_citycode');
    var start_date = $('.nsc-weekend').attr('start_date') || '';
    $('.printer_btn').html('<a href="/Goal/PrintProList/' + pid + '/'+ cc + '/' + start_date +'" target="_blank">' + '<span class="ion_printer"></span><span>打印行程</span></a>');
}

//班期列表查看更多班期
$(document).on("click",".more_active",function(){
    page = page + 1;
    getproductlist_detailsData(page);
})
$(document).on("click",".more_act",function(){
    $(".ticket_detail li").eq(4).nextAll().css('display','none');
    $(".more").text("查看更多班期>>");
    $(".more").addClass("more_ac");
    $(".more").removeClass("more_act");
})
$(document).on("click",".more_ac",function(){
    $(".more").text("向上隐藏<<");
    $(".ticket_detail li").eq(4).nextAll().css('display','');
    $(".more").addClass("more_act");
    $(".more").removeClass("more_ac");
})

//班期列表
function getproductlist_detailsData(page) {
    var data = {
        'p_id': GetQueryString('p_id'),//产品ID
        'city_code': $('body').attr('detail_citycode'),
        'limit': 5,//每页多少条
        'page': page//第几页
    }
    var getproductlist_detailsUrl = '/b2b/product/list_details';

    ajaxRequest(getproductlist_detailsUrl, 'POST', data, function (ret) {
        if (ret.code == 200) {
            if (ret.data) {
                var dataInter = ret.data.list;
                var data_total = ret.data.total;
                for(var i = 0; i < dataInter.length; i++){
                    DetailLists.push(dataInter[i]);
                }
                if(data_total == 0){
                    $(".more").css("display","none");
                }
                if (dataInter && data_total > 0) {
                    var interText = doT.template($("#productlist_detailsData-template").text());
                    $("#productlist_detailsData").append(interText(dataInter));
                    
                    //价格浮层的显示
                    $('#productlist_detailsData li').each(function(){
                        var ind = $(this).index();
                        if(DetailLists[ind] && !$(this).find('.showprice .price-table').size() ){
                            if (DetailLists[ind].ticket.length > 0) {
                                $(this).find('.showprice').showprice(DetailLists[ind].ticket,-265,10,true);
                                // if ($('.detail_eye').hasClass('open')) {
                                //     $('.t_price').show();
                                // } else{
                                //     $('.t_price').hide();
                                // } 
                                Etype();
                            }
                        }
                    })
                    //活动促销
                    $(".parys").hover(function(){
                        $(this).find(".actso .groups:last").css("border-bottom","0");
                        $(this).find(".actso").css("display","block");
                        $(this).find("img").css("display","block");
                    },function(){
                        $(this).find("img").css("display","");
                        $(this).find(".actso").css("display","");
                    });
                } 
                
                var $oli = $(".oli").length;
                if($oli >= data_total){
                    $(".more").removeClass("more_active")
                    $(".more").addClass("more_act")
                    $(".more").text("向上隐藏<<")
                }
                if(_uinfo && _uinfo.u_id){
                  $(".travel").css("width","90px");
                }

                if ($('body').attr('appoint') == 'false') {
                    $('button.immediate_signUpSmall').attr('disabled','disabled');
                    $('button.immediate_signUpSmall').text('无权购买');
                    $('button.immediate_signUpSmall').css({
                        'background':'#eee',
                        'color':'gray'
                    });
                }
                
            } else{
                $('button.immediate_signUp').text('暂无班期');
                $('button.immediate_signUp').attr('disabled','disabled');
                $('button.immediate_signUp').css('background','#eee');
            }
        } else {
            $.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
        }
    })
}

var hei = ''; 
//日历
function getproductcalendarData(v_month,v_year,condition) {

    if (!v_month) {
        var myDate = new Date();
        var Month = myDate.getMonth() + 1;
        var Year = myDate.getFullYear();
    } else {
        Month = parseInt(v_month);
        Year = parseInt(v_year);
        if (condition) {
            (Month == 1)?(Year -= 1,Month = 12):(Month--);
        } else{
            (Month == 12)?(Year += 1,Month = 1):(Month++);
        }
    }

    var data = {
        'p_id': GetQueryString('p_id'),//产品ID
        'year': Year,//年份
        'month': Month,//月份
        'city_code': $('body').attr('detail_citycode')
    }

    var getproductcalendarUrl = '/b2b/product/calendar';
    ajaxRequest(getproductcalendarUrl, 'POST', data, function (ret) {
        $('.tavel_date').removeClass('tavel_date_cls');
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            DATA_INFO = ret.data;
            if (dataInter) {
                var $leng = dataInter.length
                var cr_month=Month;
                var cr_year=Year;
                //获取月份
                for(var i = 0;i < $leng;i++){
                    var month_of=dataInter[i];
                    if((month_of.css).indexOf('s-today') > 0)continue;
                    if((month_of.css).indexOf('s-pm') <= 0){
                        cr_month=parseInt(month_of.m);
                        cr_year=parseInt(month_of.Y);
                        break;
                    }
                };

                $(".tavel_date").nscalendar({year:cr_year,month: cr_month, daylistdata: dataInter},function(){
                    $(this).find(".s-already").each(function(){
                        var d = $(this).attr('d');
                        if(dataInter[d]){
                            if (dataInter[d].info.ticket.length > 0) {
                                $(this).find('.event').showprice(dataInter[d].info.ticket,-330,0,true);
                                // if ($('.detail_eye').hasClass('open')) {
                                //     $('.t_price').show();
                                // } else{
                                //     $('.t_price').hide();
                                // } 
                                Etype();
                            }
                        }
                    })
                });
            } 
        } else {
            $.MsgBox({type:"alert",title: '错误',msg: ret.message,speed:200});
        }
    })
}

//是否显示同行价
function Eye() {
    $('i.eye_slash').toggleClass('fa-eye-slash').toggleClass('fa-eye');
    $('i.eye_slash').parent().toggleClass('open');
    Open();
}

function Open() {
    if ($('.detail_eye').hasClass('open')) {
        localStorage.setItem('e_type','1');
        $('i.eye_slash').addClass('fa-eye').removeClass('fa-eye-slash');
        $('.t_price').show();
        $(".priceOver").css("display","block");
        $(".price_pr").css("display","block");
    } else{
        localStorage.setItem('e_type','2');
        $('i.eye_slash').addClass('fa-eye-slash').removeClass('fa-eye');
        $('.t_price').hide();
        $(".priceOver").css("display","none");
        $(".price_pr").css("display","none");
    }    
} 

function Etype() {
    var eye_state = localStorage.getItem('e_type');
    if (_uinfo && _uinfo.u_id) {
        if ( !eye_state || eye_state == 1){
            $('.detail_eye').addClass('open');
            $('i.eye_slash').addClass('fa-eye').removeClass('fa-eye-slash');
            $('.t_price').show();
            $(".priceOver").css("display","block");
            $(".price_pr").css("display","block");
        } else if (eye_state == 2){
            $('.detail_eye').removeClass('open');
            $('i.eye_slash').addClass('fa-eye-slash').removeClass('fa-eye');
            $('.t_price').hide();
            $(".priceOver").css("display","none");
            $(".price_pr").css("display","none");
        }
    }  
}