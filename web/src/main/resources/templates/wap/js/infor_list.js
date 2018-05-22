 $(function() {
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);
    newsListData();
})

//产品分页
function showPage(page) {
    $(this).addClass('active');
    // window.history.pushState({}, document.title, changeURLPar(document.URL, 'start', page));
    newsListData(page);
}

function newsListData(page) {
    var data = {
        start : page,
        limit : 10,
        cate_id : '',
        keyword : ''
    }
    var getNewsListUrl = '/b2b/news/lists';
    ajaxRequest(getNewsListUrl, 'GET', data, function(ret) {
        if (ret.data && ret.code == 200) {
            var data = ret.data;

            if (data.list) {
                var interText = doT.template($("#newsListData-template").text());
                $("#newsListData").html(interText(data));

                var cpage = data.start;
                var totalpage = Math.ceil(data.total / data.limit);
                var outstr = "";
                var pagesize = 10;
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

                $('#Pagination').html(outstr)

                if(GetQueryString('start')) {
                    var curl = delQueStr(document.URL, 'start')
                    window.history.pushState({}, document.title, curl);
                }

                //分页结束
            }
        }
    })

}
