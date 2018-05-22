$(function () {
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);
    

    getCityData();

    //鼠标移入商家logo翻转
    $(document).on("mouseover",".well-item",function (){
         $(this).find(".correct").children().removeClass("test2");
        $(this).find(".opposite").children().removeClass("test");
        $(this).find(".correct").children().addClass("test");
        $(this).find(".opposite").children().addClass('test2');

    })
    $(document).on("mouseout",".well-item",function (){
        $(this).find(".correct").children().removeClass("test");
        $(this).find(".opposite").children().removeClass("test2");
        $(this).find(".correct").children().addClass("test2");
        $(this).find(".opposite").children().addClass('test');
    });
})
function getCityData(citycode){
    _GetCityData(citycode,function(ret){
        if(ret.data && ret.code == 200){
            getTopconditionData();
            getBoutiquelistData();
            getNewslistsData();
            getbuslistrData(); 
            getBannerData();
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
        if(ret.data && ret.code == 200){
            var dataInter = ret.data;
            var interText = doT.template($("#TopconditionDta-template").text());
            var intersearchText = doT.template($("#TopconditionsearchDta-template").text());
            $("#TopconditionsearchData").html(intersearchText(dataInter));
            $("#TopconditionDta").html(interText(dataInter));
        }
    })
}

function getBannerData() {
    code = _GetCityCode();
    // console.log(code);
    var getBannerUrl = '/b2b/adver/index_adver?city_code=' + code;
    ajaxRequest(getBannerUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data;
            /*console.log(dataInter)
            for(var i in ret.data.index_banner) {
                ret.data.index_banner.push(ret.data.index_banner[i]);
            }*/
            var interText = doT.template($("#BannerData-template").text());
            $("#carousel-example-generic").html(interText(dataInter.index_banner));
			
            var index_top=dataInter.index_top;
            var smallPropagate_img=$('.smallPropagate_img');
            for(var gi=0;gi<smallPropagate_img.length;gi++){
                var tpl='',val=index_top[gi];
                if(val){
                    tpl='<a href="'+val.ad_url+'" target="_'+val.ad_opentype+'"><img src="'+val.ad_pic+'" alt="'+val.ad_title+'"></a>';
                }
                smallPropagate_img.eq(gi).html(tpl);
            }
            $('#carousel-example-generic').carousel({interval: 3000});
            // $('.carousel_img').hover(function() {
            //     $('.carousel-control').show();
            // })
            
        } else {
			if(sessionStorage.getItem("un") == 1){
				
			}else{
				location.reload();
				sessionStorage.setItem("un", 1);
			}
        }
    })
}

function getBoutiquelistData() {
    code = _GetCityCode();
    var getBoutiquelistUrl = '/b2b/business/boutiquelist?limit=10&city_code=' + code
    ajaxRequest(getBoutiquelistUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            //console.log(JSON.stringify(ret.data))
            var dataInter = ret.data.list;
//              console.log(dataInter)
            var interTextTop = doT.template($("#BoutiquelistDataTop-template").text());
            $("#BoutiquelistDataTop").html(interTextTop(dataInter));
            var interText = doT.template($("#BoutiquelistData-template").text());
            $("#BoutiquelistData").html(interText(dataInter));
        } else {
        }
    })
}

function getNewslistsData() {
    code = _GetCityCode();
    var getnewslistsUrl = '/b2b/news/lists?limit=8&city_code=' + code
    ajaxRequest(getnewslistsUrl, 'GET', '', function (ret) {
        if (ret.data && ret.code == 200) {
            var dataInter = ret.data.list;
            var interText = doT.template($("#NewslistsData-template").text());
            $("#NewslistsData").html(interText(dataInter));
        } else {
      
        }
    })
}

function getbuslistrData() {
    code = _GetCityCode();
    var getbuslistUrl = '/b2b/adver/buslist?city_code=' + code
    ajaxRequest(getbuslistUrl, 'GET', '', function (ret) {
        if (ret.code == 200 || ret.code == '5508' ) {
//                console.log(JSON.stringify(ret.data))	
            var dataInter = ret.data;
            var interText = doT.template($("#buslistData-template").text());
            $("#buslistData").html(interText(dataInter));
            echo.init({
                offset: 100,
                throttle: 250,
                unload: false,
                callback: function (element, op) {
                    //console.log(element, 'has been', op + 'ed')
                }
            });
            $(".travel_detailContentTop").each(function () {
                $(this).find("li:gt(2)").attr('title', 'little');
                $(this).find("li:gt(6)").hide();
            })

            $('.travel_detailBtnSelect a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
                setTimeout(function(){
                    echo.render();
                },200)
                // console.log(1111)
            });
        }
    })
}