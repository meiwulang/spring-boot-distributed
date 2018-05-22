$(function () {
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);
    getCityData()
    var Cid = GetQueryString('id');
    if (Cid) {
        $('#qcode').attr('src', ApiUrl + '/b2b/qrcode/create?url=http://' + window.location.host+'/wap/news/id/'+Cid);
        getNewsetailData(Cid)
    } else {
        location.href = 'index.html';
    }
})


function getNewsetailData(cid) {

    var getNewsetailUrl = '/b2b/news/detail?id=' + cid;

    ajaxRequest(getNewsetailUrl, 'GET', '', function (ret) {
        //console.log(ret);
        if (ret.data && ret.code == 200) {
            //console.log(JSON.stringify(ret.data));
            var data = ret.data;
            $('#title').html(data.title);
            $('title').html(data.title + ' - 金豆云旅游');
            $('.content_detail').html(data.content);
            $('#send_time').html(data.create_time);
        } else {
            // console.log(ret.message);
        }
    });
}

function getCityData(citycode) {
    _GetCityData(citycode,function(ret){
        if(ret.code == 200){
            getNewslistsData();
        }
    });
}

function getNewslistsData() {
    code = _GetCityCode();
    var getnewslistsUrl = '/b2b/news/lists?limit=8&city_code=' + code;
    ajaxRequest(getnewslistsUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data.list;
            var interText = doT.template($("#NewslistsData-template").text());
            $("#NewslistsData").html(interText(dataInter));
        } else {
            // console.log(ret.message);
        }
    })
}