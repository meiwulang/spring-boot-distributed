 $(function() {
    // echo.init({
    //     offset: 100,
    //     throttle: 250,
    //     unload: false,
    //     callback: function(element, op) {
    //         //console.log(element, 'has been', op + 'ed')
    //     }
    // });
    var date = new Date();
    var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
    $("#header").load("index_header.html?t="+_TimeStamp);
    $("#footer").load("index_footer.html?t="+_TimeStamp);
    $("#login_mask").load("login.html?t="+_TimeStamp);
    getCityData();
})
function getCityData(citycode) {
	_GetCityData(citycode,function(ret){
		if(ret.data && ret.code == 200){
			getTopconditionData();
			getBoutiquelistData();
		}else{
			$.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
		}
	});
}

function getTopconditionData() {
    code = _GetCityCode();
    if(code && 'null' != code) {
        var getTopconditionUrl = '/b2b/product/topcondition?code=' + code;
    } else {
        var getTopconditionUrl = '/b2b/product/topcondition';
    }
    ajaxRequest(getTopconditionUrl, 'GET', '', function(ret) {
        if(ret.data && ret.code == 200) {
            var dataInter = ret.data;
            var intersearchText = doT.template($("#TopconditionsearchDta-template").text());
            $("#TopconditionsearchData").html(intersearchText(dataInter));
            echo.init({
                offset: 100,
                throttle: 250,
                unload: false,
                callback: function(element, op) {
                }
            });
        } 
    })
}

	
function getBoutiquelistData() {
	code = _GetCityCode();
	var getBoutiquelistUrl = '/b2b/business/boutiquelist?city_code=' + code
	ajaxRequest(getBoutiquelistUrl, 'GET', '', function(ret) {
		if(ret.data && ret.code == 200) {
			var data = ret.data.list;
			var businessEntertpl = doT.template($("#businessEnter-template").text());
			$('#businessEnter').html(businessEntertpl(data));
			var sortDetailtpl = doT.template($("#sortDetail-template").text());
			$('#sortDetail').html(sortDetailtpl(data));
            echo.init({
                offset: 100,
                throttle: 250,
                unload: false,
                callback: function(element, op) {
                }
            });
		} else {
			$.MsgBox({type:"alert",title: '错误',msg:ret.message,speed:200});
		}
	})
};


function Start(){
    // 判断用户状态
    if(_uinfo && _uinfo.u_id){
        $("#user_name").html(_uinfo.u_realname);
        $("#org_name").html(_uinfo.org_sname);
    }else{
        window.location.href = '/index/login.shtml';
    }
}

Start();