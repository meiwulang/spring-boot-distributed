$(function () {
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);

    getActiveListData();
    getBrandListData();
    getGoodsListData();
})

//产品分页
function showPage(page) {
    $(this).addClass('active');
    getBrandListData(page);
}

function showPage_g(page) {
    $(this).addClass('active');
    getGoodsListData(page);
}

// 活动专区推荐活动列表
function getActiveListData() {
    code = _GetCityCode();
    var data = {
        'city_code' : code
    }

    var getActiveListUrl = '/b2b/Active/activeList';
    ajaxRequest(getActiveListUrl, 'POST', data, function(ret) {
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            // console.log(dataInter)
            var activeListText = doT.template($("#ActiveListData-template").text());
            $("#ActiveListData").html(activeListText(dataInter));
        }
    })
}

// 活动专区品牌列表
function getBrandListData(page) {
    code = _GetCityCode();
    var data = {
        'city_code' : code,
        limit: 8,  //每页显示多少个 这个应该是8现在
        start: page   //第几个开始取数据
    }

    var getBrandListUrl = '/b2b/Active/brandList';
    ajaxRequest(getBrandListUrl, 'POST', data, function(ret) {
        if (ret.code == 200) {
            var dataInter = ret.data;
            // console.log(ret)
            if (dataInter) {
                var brandListText = doT.template($("#BrandListData-template").text());
                $("#BrandListData").html(brandListText(dataInter));
                Hover();
            } else{
                $('.brand_business').hide();
                $('.pro_pruduct').css('margin-top','-90px');
            }
            

            var cpage = ret.start;
            var totalpage = Math.ceil(ret.total / 8);
            var outstr = '';
            var pagesize = 8;
            var count;

             if(totalpage <= pagesize) { //总页数小于十页
                    for(count = 1; count <= totalpage; count++) {
                        if(count != cpage) {
                            outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
                        } else {
                            outstr = outstr + "<li class='pages active' >" + count + "</li>";
                        }
                    }
                }
                if(totalpage > pagesize) { //总页数大于十页
                    if(parseInt((cpage - 1) / 10) == 0) {
                        for(count = 1; count <= 10; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                        outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
                    } else if(parseInt((cpage - 1) / 10) == parseInt(totalpage / 10)) {
                        outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";

                        for(count = parseInt(totalpage / 10) * 10 + 1; count <= totalpage; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                    } else {
                        outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";
                        for(count = parseInt((cpage - 1) / 10) * 10 + 1; count <= parseInt((cpage - 1) / 10) * 10 + 10; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                        outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage(" + count + ")'>后十页</li>";
                    }
                }
                if(cpage == 1) {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' >上一页</li>"

                } else if(cpage == totalpage) {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' >下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>"

                } else {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage(" + (Number(cpage) - 1) + ")'>上一页</li>"

                }

                $('#Pagination_b').html(outstr);
                if(GetQueryString('start')) {
                    var curl = delQueStr(document.URL, 'start')
                    window.history.pushState({}, document.title, curl);
                }

                //分页结束
        }
    })
}
// 活动专区商品列表
function getGoodsListData(page) {
    code = _GetCityCode();
    var data = {
        'city_code' : code,
        limit: 12,  //每页显示多少个 这个应该是8现在
        start: page   //第几个开始取数据
    }

    var getGoodsListUrl = '/b2b/Active/goodsList';
    ajaxRequest(getGoodsListUrl, 'POST', data, function(ret) {
        if (ret.code == 200) {
            var dataInter = ret.data;
            if (dataInter) {
                var goodsListText = doT.template($("#GoodsListData-template").text());
                $("#GoodsListData").html(goodsListText(dataInter));
            } else{
                $('.pro_pruduct').hide();

            }
            var cpage = ret.start;
            var totalpage = Math.ceil(ret.total / 12);
            var outstr = '';
            var pagesize = 12;
            var count;

             if(totalpage <= pagesize) { //总页数小于十页
                    for(count = 1; count <= totalpage; count++) {
                        if(count != cpage) {
                            outstr = outstr + "<li class='pages ' onClick='showPage_g(" + count + ")'>" + count + "</li>";
                        } else {
                            outstr = outstr + "<li class='pages active' >" + count + "</li>";
                        }
                    }
                }
                if(totalpage > pagesize) { //总页数大于十页
                    if(parseInt((cpage - 1) / 10) == 0) {
                        for(count = 1; count <= 10; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage_g(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                        outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage_g(" + count + ")'>后十页</li>";
                    } else if(parseInt((cpage - 1) / 10) == parseInt(totalpage / 10)) {
                        outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage_g(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";

                        for(count = parseInt(totalpage / 10) * 10 + 1; count <= totalpage; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage_g(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                    } else {
                        outstr = outstr + "<li class='pages pagination_prevPage' style='width:80px' onClick='showPage_g(" + (parseInt((cpage - 1) / 10) * 10) + ")'>前十页</li>";
                        for(count = parseInt((cpage - 1) / 10) * 10 + 1; count <= parseInt((cpage - 1) / 10) * 10 + 10; count++) {
                            if(count != cpage) {
                                outstr = outstr + "<li class='pages ' onClick='showPage_g(" + count + ")'>" + count + "</li>";
                            } else {
                                outstr = outstr + "<li class='pages active' >" + count + "</li>";
                            }
                        }
                        outstr = outstr + "<li class='pages pagination_nextPage' style='width:80px' onClick='showPage_g(" + count + ")'>后十页</li>";
                    }
                }
                if(cpage == 1) {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage_g(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' >上一页</li>"

                } else if(cpage == totalpage) {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' >下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage_g(" + (Number(cpage) - 1) + ")'>上一页</li>"

                } else {

                    outstr += "<li class=' pages pagination_nextPage' style='width:80px' onClick='showPage_g(" + (Number(cpage) + 1) + ")'>下一页</li><li class='pages pagination_prevPage' style='width:80px' onClick='showPage_g(" + (Number(cpage) - 1) + ")'>上一页</li>"

                }

                $('#Pagination_p').html(outstr);
                if(GetQueryString('start')) {
                    var curl = delQueStr(document.URL, 'start')
                    window.history.pushState({}, document.title, curl);
                }
        }
    })
}

function Hover() {
    $('.brand_img').on({
        'mouseenter' : function(){
            $(this).siblings('.activity_description').show();
        }
    })

    $('.activity_description').on({
        'mouseleave' : function(){
            $('.activity_description').hide();
        }
    })
}
